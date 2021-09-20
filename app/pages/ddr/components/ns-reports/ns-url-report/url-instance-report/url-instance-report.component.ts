import { Component, Input, OnInit,ViewChild } from '@angular/core';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import { SelectItem } from '../../../../interfaces/selectitem';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CommonServices } from '../../../../services/common.services';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { NsCommonService } from '../../services/ns-common-service';
import { DDRRequestService } from '../../../../services/ddr-request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-url-instance-report',
  templateUrl: './url-instance-report.component.html',
  styleUrls: ['./url-instance-report.component.css']
})
export class UrlInstanceReportComponent implements OnInit {
  @ViewChild("paginateRef") paginateRef :any;
  strTitle: string;
  urlInstanceDownload: any;
  urlidx: any;
  url: any = "";                                           //url for ajaxcall
  strStatusName: string = "NA";                                 //for vector name
  statusCode: number = -2;
  object: number = 0;
  commonParams: any;
  vectorMetaData: any;
  vectorData: any;
  urlInstanceData: any;                                   //url instance data after ajax call
  cols: any;
  visibleCols: any[];
  columnOptions: SelectItem[];
  limit: number = 50;
  offset: number = 0;
  count: any;
  filter: any;
  loading = false;
  prevColumn: any;
  isEnabledColumnFilter = true;
  toggleFilterTitle = '';
  ajaxUrl = "" ;
  screenHeight:any ;
  subscribeURL: Subscription;
  toolTipStatus: string='';
  toolTipUrl: string='';
  filterStatus: string='';
  filterUrl: string='';
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  value: number;
  loader: boolean;
  constructor(private _router: Router, private breadcrumbService: DdrBreadcrumbService,
    public commonService: CommonServices, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private ddrData: DdrDataModelService, private nsCommonData: NsCommonService,
    private ddrRequest:DDRRequestService) {
  }

  ngOnInit() {
    this.commonService.isToLoadSideBar = true;
    this.screenHeight = Number(this.commonService.screenHeight)-94; 
    this.commonService.currentReport = 'URL Instance' ;
    this.randomNumber();
    if (this.ddrData.summaryToInstanceFlag === 'true')
      this.nsCommonData.isFromSummary = true;
    else if (this.ddrData.summaryToInstanceFlag === 'false')
      this.nsCommonData.isFromSummary = false;
    this.loading = true;
    this.commonParams = this.commonService.getData();
    this.vectorMetaData = this.ddrData.vectorMetaData;
    this.vectorData = this.ddrData.vectorName;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.URL_INSTANCE);
    this.setTestRunInHeader();
    this.makeajaxcall();
    this.makeajaxcallCount();
    this.subscribeURL=this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == 'URL Instance') {
        this.loading = true;
        this.limit = 50;
        this.offset=0;
        console.log("this.paginateRef===>", this.paginateRef)
        let length = this.paginateRef['pageLinkSize'];
        let arry = [];
        for (let i = 1; i <= length; i++)
          arry.push(i);
        this.paginateRef['pageLinks'] = [];
        this.paginateRef['pageLinks'] = arry;
        this.paginateRef['_rows'] = 50;
        this.paginateRef['_first'] = 0;
        this.makeajaxcall();
        this.makeajaxcallCount();
      }
    })
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this.ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.commonParams.testRun = this.ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.commonParams.testRun);
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  setTestRunInHeader() {
    if (this.commonParams && this.commonParams.product.toLowerCase() == 'netstorm') {
      this.strTitle = 'Netstorm - URL Instance Report - Test Run : ' + this.commonParams.testRun;
    }
    else if(this.commonParams && this.commonParams.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - URL Instance Report - Test Run : ' + this.commonParams.testRun;
     else {
      this.strTitle = 'Netdiagnostics Enterprise - URL Instance Report - Session : ' + this.commonParams.testRun;
    }
  }


  makeajaxcall() {
    let ajaxParam = ""
    this.url = "";
    this.url +=  this.getHostUrl();
 
       if(this.commonService.enableQueryCaching == 1){
      this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?cacheId='+ this.commonParams.testRun + '&testRun=' + this.commonParams.testRun;
    }
    else{
      this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?testRun=' + this.commonParams.testRun;
    }
 /*ajax call when from WD*/


    if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsURLInstance).length!=0) {
      
      if (this.nsCommonData && this.nsCommonData.urlidx != undefined && !(this.commonService.nsURLInstance["url"] && this.commonService.nsURLInstance["urlidx"])) {
        this.commonService.nsURLInstance["urlidx"] = this.nsCommonData.urlidx;
        console.log("this.nsCommonData.urlidx != undefined");
      }
       this.commonService.nsURLInstance;
       
      if(!this.commonService.nsURLInstance['statusCodeFC']){
        if (this.ddrData.fromReport) {
          this.commonService.nsURLInstance['nsErrorName'] = this.ddrData.errorNameUrl;
        }
        else if (this.ddrData.nsErrorName) {
          this.commonService.nsURLInstance['nsErrorName'] = this.ddrData.nsErrorName;
        }
      }
      else{
        delete this.commonService.nsURLInstance['nsErrorName']; 
      }
      ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsURLInstance); 
      this.commonService.isCQM=true;
       // for FIlter CQM case    so that will update value in key pair.
       this.ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsURLInstance;
       console.log("inside CQM case==>");
    }
    else {
      console.log("inside normal case==>");
      // if (this.nsCommonData.urlidx != undefined /*&& this.ddrData.summaryToInstanceFlag == 'true' */) {
        if (this.nsCommonData.urlidx != undefined && this.ddrData.nsFromGraph == false) {
        this.urlidx = this.nsCommonData.urlidx;
        console.log("this.nsCommonData.urlidx != undefined");
      }
      console.log("this.url.idx==>",this.url.idx);
        if (!this.nsCommonData.FailureStatus || this.ddrData.summaryToInstanceFlag == 'false') {
          if (this.vectorMetaData != undefined) {
            if (this.vectorMetaData == "Error" && this.vectorData != "NA") {
              this.strStatusName = this.vectorData;
              //vectorName = "NA";     //becuse of errors graphs in webdashboard
            }
          }
        }
  
      if (this.nsCommonData.FailureStatus != undefined && this.ddrData.summaryToInstanceFlag == 'true')
        this.statusCode = this.nsCommonData.FailureStatus;

      else if (this.nsCommonData.urlInstancethroughsuccess)
        this.statusCode = 0;
      else
      {
      if(this.nsCommonData.urlsessionsummarydata && (this.nsCommonData.urlsessionsummarydata['status']!='-'&&this.nsCommonData.urlsessionsummarydata['status']!=null && this.nsCommonData.urlsessionsummarydata['status']!=undefined))
      this.statusCode=this.nsCommonData.urlsessionsummarydata['status'];
       else
       this.statusCode=-2;
      }
 
      let startTime = this.commonParams.startTime;
      let endTime = this.commonParams.endTime;

      ajaxParam = '&object=0' + '&startTime=' + startTime + '&endTime=' + endTime + "&statusCode=" + this.statusCode + "&strStatusName=" + this.strStatusName + '&reportType=instance' + "&urlidx=" + this.urlidx;
  
      // if (this.nsCommonData.urlsessionsummarydata != undefined) {
      //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
      // }

      console.log('this.ddrData.fromReport',this.ddrData.fromReport);
      console.log('this.ddrData.nsErrorName',this.ddrData.nsErrorName,this.ddrData.nsErrorName);

      if (this.ddrData.fromReport) {
        ajaxParam += '&nsErrorName=' + this.ddrData.errorNameUrl;
      }
      else if (this.ddrData.nsErrorName) {
        ajaxParam += '&nsErrorName=' + this.ddrData.nsErrorName;
      }

      console.log('ajaxParam in  instance',ajaxParam);

      // if(this.ddrData.groupName=="HTTP Requests"  && this.ddrData.vectorName!='undefined'&& this.ddrData.vectorName!=undefined )
      // ajaxParam += '&url=' + this.ddrData.vectorName;

      if(this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
      ajaxParam += '&groupName=' +this.ddrData.vectorName;
      if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
      ajaxParam += '&generatorName=' +this.ddrData.generatorName;
      
      if(this.commonService.isFromUrlSummary || this.commonService.isCQM || this.commonService.isFromUrlFailure || this.commonService.isFromUrlSession)
      {
        console.log("inside data of url instance==>",this.ddrData.nsCQMFilter);
       // this.commonService.nsTransactionInstance=this.ddrData.nsCQMFilter[this.commonService.currentReport];
        ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsURLInstance,true);
        this.ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsURLInstance;
        console.log("this.ddrData.nsCQMFilter in data call==>",this.ddrData.nsCQMFilter);
        console.log("ajax param are==>",ajaxParam);
      }
      else if (this.ddrData.nsCQMFilter[this.commonService.currentReport]) {
        console.log("inside else cond===> ",this.ddrData.nsCQMFilter[this.commonService.currentReport])
        ajaxParam = this.commonService.makeParamStringFromObj(this.ddrData.nsCQMFilter[this.commonService.currentReport], true);
      }

      this.commonService.nsURLInstance = this.commonService.makeObjectFromUrlParam(ajaxParam)
    }
    if (this.nsCommonData.urlsessionsummarydata != undefined && this.ddrData.nsFromGraph == false) {
      ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
    }
     this.ajaxUrl = this.url + ajaxParam 
    console.log("urlofinstance", this.url);
    setTimeout(() => {
      this.openpopup();
     }, this.ddrData.guiCancelationTimeOut);
    let finalUrl = this.ajaxUrl + '&limit=' + this.limit + '&offset='+  this.offset +'&showCount=false' + '&queryId='+this.queryId  ;
    this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => { (this.assignData(data)) });
  }
  
  assignData(json) {
    this.isCancelQuerydata = true;
    this.commonService.isFilterFromNSSideBar = false;
    this.urlInstanceData = json.data;
    setTimeout(() => {
      this.loader = false;
    }, 2000);
    this.loading = false;
    this.filtercriteria(json.starttime, json.endtime);
    this.commonService.customTimePlaceHolder=[];
    this.commonService.customTimePlaceHolder.push(json.starttime, json.endtime);
    console.log("INSTANCE DATAAAAAAAAAAAAAAAAA", json);
    if (this.urlInstanceData.length !== 0) {
        this.urlInstanceData.forEach((val, index) => {
	 if(val.hasOwnProperty('GeneratorName')){
          if (val['GeneratorName'] === '') {
            val['GeneratorName'] = 'NA';
          }
	
	} 
	else{
		val['GeneratorName'] = 'NA';
	}
        });
    }
    this.createTable();
    this.changeColumnFilter();
  }

  filtercriteria(startTime, endTime) {
    this.filter = "";
    this.toolTipStatus='';
    this.toolTipUrl='';
    this.filterStatus='';
    this.filterUrl=''; 
  
    let urlInstanceHeader = this.commonService.nsURLInstance;
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.filter += "DC=" + this.ddrData.dcName;
    }

    if (!this.commonService.isValidParamInObj(urlInstanceHeader, 'phaseName')) {
      if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
        this.filter += ', From=' + startTime;
      }
      if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
        this.filter += ', To=' + endTime;
      }
    }

    if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filter += ', Generator Name=' +this.ddrData.generatorName;

    if(this.ddrData.vectorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filter += ', Group Name=' +this.ddrData.vectorName;
    
    if (this.commonService.isValidParamInObj(urlInstanceHeader, "url")) {
      let url=urlInstanceHeader['url'];
      if(url && url.length>=20)
      {
        this.toolTipUrl+=urlInstanceHeader['url'];
        url= url.substring(0,19);
        this.filterUrl += ", Url=" + url +" ....";  
      }
      else
      this.filter += ", Url=" + url ;
      // this.filter += ', URL=' + urlInstanceHeader['url'];
    }
    if (this.commonService.isValidParamInObj(urlInstanceHeader, "pageName")) {
      this.filter += ', Page=' + urlInstanceHeader['pageName'];
    }

    if (this.commonService.isValidParamInObj(urlInstanceHeader, "scriptName")) {
      this.filter += ', Script=' + urlInstanceHeader['scriptName'];
    }

    if (this.commonService.isValidParamInObj(urlInstanceHeader, "transactionName")) {
      this.filter += ', Transaction=' + urlInstanceHeader['transactionName'];
    }

    if (this.commonService.isValidParamInObj(urlInstanceHeader, "location") && this.ddrData.WAN_ENV > 0) {
      this.filter += ', Location=' + urlInstanceHeader['location'];
    }
    
    if (this.commonService.isValidParamInObj(urlInstanceHeader, "browser")) {
      this.filter += ', Browser=' + urlInstanceHeader['browser'];
    }

    if (this.commonService.isValidParamInObj(urlInstanceHeader, "access") && this.ddrData.WAN_ENV > 0) {
      this.filter += ', Access=' + urlInstanceHeader['access'];
    }

    if (this.commonService.isValidParamInObj(urlInstanceHeader, "statusCodeFC")) {
      let status=urlInstanceHeader['statusCodeFC'];
      if(status && status.length>=20)
      {
        this.toolTipStatus+=urlInstanceHeader['statusCodeFC'];
        status=status.substring(0,19);
        this.filterStatus += ", Status=" + status+" ....";  
      }
      else
      this.filter += ", Status=" + status;
      // this.filter += ', Status =' + urlInstanceHeader['statusCodeFC'];
    }
    // if (this.nsCommonData.urlInstanceData != undefined) {
    //   this.filter += ', URL=' + this.nsCommonData.urlInstanceData.urlName;
    // }
    // if (this.nsCommonData.urlInstanceData != undefined) {
    //   if (this.nsCommonData.urlInstanceData.errorname != undefined)
    //     this.filter += ', URL Status=' + this.nsCommonData.urlInstanceData.errorname;
    // }
    // if (this.nsCommonData.urlsessionsummarydata != undefined) {
    //   this.filter += ', Script Name=' + this.nsCommonData.urlsessionsummarydata.scriptName + ', Page Name=' + this.nsCommonData.urlsessionsummarydata.pageName + ', URL=' + this.nsCommonData.urlsessionsummarydata.urlName + ', URL Status=' + this.nsCommonData.urlsessionsummarydata.errorname;
    // }
    if (this.commonService.isValidParamInObj(urlInstanceHeader, 'order'))
      this.filter += ", order=" + urlInstanceHeader.order
    if (this.commonService.isValidParamInObj(urlInstanceHeader, 'phaseName'))
      this.filter += ", Phase Name=" + urlInstanceHeader.phaseName;

    if (this.filter.startsWith(',')) {
      this.filter = this.filter.substring(1);
    }
    if (this.filter.endsWith(',')) {
      this.filter = this.filter.substring(0, this.filter.length - 1);
    }
  }

  makeajaxcallCount() {
    let countUrl = this.ajaxUrl + '&showCount=true';
    this.ddrRequest.getDataUsingGet(countUrl).subscribe(data => { (this.assignCountData(data)) });
  }

  assignCountData(countdata) {
    this.count = countdata.totalCount;
    if (this.limit > this.count)
      this.limit = Number(this.count);
    console.log("countdata", countdata);
  }

  paginate(event) {
    this.offset = parseInt(event.first);
    this.limit = parseInt(event.rows);
    if (this.limit > this.count)
       this.limit = Number(this.count);
       this.loader = true;
      this.getProgressBar();
     if ((this.limit + this.offset) > this.count)
       this.limit = Number(this.count) - Number(this.offset);

    this.makeajaxcall();
  
  }
  /** Method for progressbar */
  getProgressBar() {
    this.value =1;
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(interval);
      }
    }, 300);
  }
  createTable() {
    console.log("in create table");
    this.cols = [
      { field: 'urlName', header: 'URL Name', sortable: 'true', action: true, align: 'left' },
      { field: 'pageName', header: 'Page Name', sortable: 'true', action: true, align: 'left' },
      { field: 'scriptName', header: 'Script Name', sortable: 'true', action: true, align: 'left' },
      { field: 'GeneratorName', header: 'Generator Name',  sortable: 'true',action: false, align: 'left'},
      // { field: 'location', header: 'Location', sortable: 'custom', action: true, align: 'right'},
      // { field: 'access', header: 'Access', sortable: 'custom', action: true, align: 'right'},
      { field: 'convuserId', header: 'User Id', sortable: 'true', action: true, align: 'right' },
      { field: 'convsessionId', header: 'Session Id', sortable: 'true', action: true, align: 'right' },
      { field: 'avgstartTime', header: 'Start Time', sortable: 'custom', action: true, align: 'right' },
      { field: 'avgresponseTime', header: 'Response Time', sortable: 'custom', action: true, align: 'right' },
      { field: 'statusName', header: 'Status', sortable: 'true', action: true, align: 'right' },
      { field: 'httpCode', header: 'HTTP Code', sortable: 'custom', action: true, align: 'right' }
    ];
    this.visibleCols = [
      'urlName', 'pageName', 'scriptName', 'convuserId', 'convsessionId', 'avgstartTime', 'avgresponseTime', 'statusName', 'httpCode'];
    

    if (this.ddrData.WAN_ENV > 0) {
      this.cols.push({ field: 'location', header: 'Location', sortable: 'custom', action: true, align: 'right' }, { field: 'access', header: 'Access', sortable: 'custom', action: true, align: 'right' },
                     { field: 'browser', header: 'Browser', sortable: 'custom', action: false, align: 'right' });
      this.visibleCols.push('location', 'access');
    }
    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
  }

  urltimedetails(rowData) {
    console.log("row dataaaa issss ", rowData);
    //--testrun 1979 --object 0 --childidx 7 --sessioninst 162 --starttime 1489669 --urlidx 7 --pageinst 0

    this.nsCommonData.currRowData = rowData;
    this.nsCommonData.objectType = '0';
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_INSTANCE;
    this._router.navigate(['/home/ddr/nsreports/sessionTiming'])

  }
  userSession(data) {
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_INSTANCE;
    this.nsCommonData.currRowData = data;
    this.nsCommonData.objectType = '0';
    this._router.navigate(['/home/ddr/nsreports/userSession']);
  }

  openSessionName(rowData: any) {
    let url =  this.getHostUrl() + '/' + this.commonParams.product +
      '/recorder/recorder.jsp?openFrom=TR' + this.commonParams.testRun +
      '&scriptName=' + rowData.scriptName+"&sesLoginName=" + sessionStorage.getItem('sesLoginName');;
    console.log('JNLP Launcher url ', url);

    window.open(url, "_blank");
  }

  /*
**FUnction used to custom sort for intger and float
*/
  sortColumnsOnCustom(event, urlInstanceData) {
    //console.log(event)
    let fieldValue = event["field"];

    if (fieldValue == "avgresponseTime")
      fieldValue = ["responseTime"];
    if (fieldValue == "avgstartTime")
      fieldValue = ["startTime"];

    if (event.order == -1) {
      event.order = 1
      urlInstanceData = urlInstanceData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        console.log("value", value, "value2", value2);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      event.order = -1;
      //asecding order
      urlInstanceData = urlInstanceData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }

    this.urlInstanceData = [];
    //console.log(JSON.stringify(tempData));
    if (urlInstanceData) {
      urlInstanceData.map((rowdata) => { this.urlInstanceData = this.Immutablepush(this.urlInstanceData, rowdata) });
    }

  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    if (this.visibleCols.length !== 0) {
      for (let i = 0; i < this.cols.length; i++) {
        for (let j = 0; j < this.visibleCols.length; j++) {
          if (this.cols[i].field === this.visibleCols[j]) {
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });

  }

     /*This Method is used for handle the Column Filter Flag*/
     toggleColumnFilter() {
      if (this.isEnabledColumnFilter) {
        this.isEnabledColumnFilter = false;
      } else {
        this.isEnabledColumnFilter = true;
      }
      this.changeColumnFilter();
    }
  
  
   /*This method is used to Enable/Disabled Column Filter*/
   changeColumnFilter() {
    try {
      let tableColumns = this.cols;
      if (this.isEnabledColumnFilter) {
        this.toggleFilterTitle = 'Show Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitle = 'Hide Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

   /* Download report for URL Instance report  */
   downloadReports(reports: string) {
    this.urlInstanceDownload = JSON.parse(JSON.stringify(this.urlInstanceData));
    let renameArray = { "urlName": "URL Name", "pageName": "Page Name", "scriptName": "Script Name", "location": "Location", "access": "Access", "convuserId": "User Id", "convsessionId": "Session Id", "avgstartTime": "Start Time", "avgresponseTime": "Response Time", "statusName": "Status", "httpCode": "HTTP Code" }
    let colOrder = ['URL Name','Page Name','Script Name','User Id', 'Session Id', 'Start Time', 'Response Time', 'Status', 'HTTP Code'];
    if (this.ddrData.WAN_ENV >0){
      colOrder.push("Location");
      colOrder.push("Access");
    }

    this.urlInstanceDownload.forEach((val, index) => {
      delete val['browser'];
      delete val['userId'];
      delete val['sessionId'];
      delete val['pageInstance'];
      delete val['urlIndex'];
      delete val['childIndex'];
      delete val['startTime'];
      delete val['absoluteStartTime'];
      delete val['responseTime'];
      delete val['flowPathInstance'];
      if(this.ddrData.WAN_ENV < 1) 
      {
        delete val['location'];
        delete val['access'];
      }


    });
    if(this.ddrData.WAN_ENV < 1)
    colOrder = ['URL Name','Page Name','Script Name','User Id', 'Session Id', 'Start Time', 'Response Time', 'Status', 'HTTP Code'];
    
    
        
    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filter,
      strSrcFileName: 'URLInstance',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.urlInstanceDownload)
    };
    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.commonParams.product) +
      '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
        (this.openDownloadReports(res)));
    else
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open(decodeURIComponent(this.getHostUrl(true)) + '/common/' + res);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
   this.subscribeURL.unsubscribe();
   this.commonService.isFromUrlSummary=false;
   this.commonService.isCQM =false;
   this.commonService.isFromUrlFailure=false;   
   this.commonService.isFromUrlSession=false;
  }

      
randomNumber(){
  this.queryId = (Math.random() * 1000000).toFixed(0);
  console.log("queryId:::::::::::::"+this.queryId);
}
waitQuery()
{
  this.isCancelQuery = false;
  setTimeout(() => {
    this.openpopup();
}, this.ddrData.guiCancelationTimeOut);
}

onCancelQuery(){
    let url = "";
   url = decodeURIComponent(this.getHostUrl() + '/' + this.commonParams.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.commonParams.testRun +"&queryId="+this.queryId;  
  console.log("Hello u got that",url);
    this.isCancelQuery = false;
     this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
  }

  openpopup(){
    if(!this.isCancelQuerydata)
    this.isCancelQuery =true;
  }
}

