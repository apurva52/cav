import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-url-session-summary',
  templateUrl: './url-session-summary.component.html',
  styleUrls: ['./url-session-summary.component.css']
})
export class UrlSessionSummaryComponent implements OnInit {

  strGroupBy: any = "";                               //passed in url in case of url summary by status
  url: any;                                           //url for ajaxcall
  commonParams: any;
  object: number = 0;                                 //object 0 passed in case of url report
  fields: number = 4095;
  statusCode: number = -2;
  limit: number = 50;
  offset: number = 0;
  strTitle: string;
  cols: any;
  visibleCols: any[];
  columnOptions: SelectItem[];
  urlSessionSummaryData: any;                                //data stored after ajax call
  report: any;
  urlindex: any;
  count: any;
  scriptData:any;
  group:any;
  filter="";
  loading = false;
  showAllOption = false;
  prevColumn:any;
  isEnabledColumnFilter = true;
  toggleFilterTitle = '';
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;

  constructor(private _router: Router, private breadcrumbService: DdrBreadcrumbService,
    public commonService: CommonServices, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private ddrData: DdrDataModelService,private nsCommonData : NsCommonService, 
    private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.loading = true;
    this.commonParams = this.commonService.getData();
    console.log("urlsessionsummary");
    this.commonService.currentReport='URL Session Summary';
    this.randomNumber();
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.URL_SESSION_SUMMARY);
    this.commonService.checkForNsKeyObj(this.ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsURLSession==>",this.commonService.nsURLSession); 
    this.commonService.isToLoadSideBar = false;
    this.makeajaxcall();
    this.makeajaxcallCount();
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

  makeajaxcall(){
     
    if (this.nsCommonData.urlreportid) {
      this.group = "page,session,status";
      if (this.nsCommonData.urlSummaryData && this.nsCommonData.urlSummaryData['status'])
        this.statusCode = Number(this.nsCommonData.urlSummaryData['status']);
    }
    else {
      this.group = "page,session";
      this.statusCode = -2;
    } 
            let startTime = this.commonParams.startTime;
            let endTime = this.commonParams.endTime;
            this.url = this.getHostUrl();
            let ajaxParam='';
            if(this.commonService.enableQueryCaching == 1){
              this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?cacheId='+ this.commonParams.testRun + '&testRun=' + this.commonParams.testRun;
            }
            else{
              this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?testRun=' + this.commonParams.testRun;
            }
            ajaxParam += '&object=0&fields=4095' + '&statusCode=' + this.statusCode + '&startTime=' + startTime + '&endTime=' + endTime + '&strGroupBy=' + this.strGroupBy + '&reportType=summary' + '&strStatusName=NA' + '&group=' + this.group + '&urlidx=' + this.nsCommonData.urlidx;
            
          if(this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
              ajaxParam += '&groupName=' +this.ddrData.vectorName;
          if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
              ajaxParam += '&generatorName=' +this.ddrData.generatorName;
            
            if(this.commonService.isFromUrlSummary)
            {
              console.log("inside data of url session==>",this.ddrData.nsCQMFilter);
              //this.commonService.nsTransactionSummary=this.ddrData.nsCQMFilter[this.commonService.currentReport];
              if (this.nsCommonData.urlreportid)
              this.commonService.nsURLSession['group']="page,session,status"
              else
              this.commonService.nsURLSession['group']= "page,session";
              
              ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsURLSession,true);
              this.ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsURLSession;
              console.log("this.ddrData.nsCQMFilter in data call==>",this.ddrData.nsCQMFilter);
              console.log("ajax param are==>",ajaxParam);
            }
            else if (this.ddrData.nsCQMFilter[this.commonService.currentReport]) {
              this.commonService.isFromUrlSummary=true;
              console.log("inside else cond===> ",this.ddrData.nsCQMFilter[this.commonService.currentReport])
              ajaxParam = this.commonService.makeParamStringFromObj(this.ddrData.nsCQMFilter[this.commonService.currentReport], true);
            }
            this.url+=ajaxParam;
            //object = 0 is for URL Report
            console.log("url", this.url);
            setTimeout(() => {
              this.openpopup();
             }, this.ddrData.guiCancelationTimeOut);
            let finalUrl = this.url +'&limit=' + this.limit + '&offset=' + this.offset  +'&showCount=false' + '&queryId='+this.queryId ;
            this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => { (this.AssignData(data)) });
}

  AssignData(res){
    this.isCancelQuerydata = true;
    console.log("url session summary data", JSON.stringify(res));
    this.urlSessionSummaryData = res.data;
    this.loading = false;
    this.filtercriteria(res.starttime,res.endtime);
    this.createTable();
    this.changeColumnFilter();
  }

  filtercriteria(startTime,endTime){
    this.filter = "";
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.filter += "DC=" + this.ddrData.dcName;
    }
    if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      this.filter += ', From=' + startTime;
    }
    if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
      this.filter += ', To=' + endTime;
    }
    if (this.nsCommonData.urlSummaryData !=undefined)
    {
      this.filter += ', URL=' + this.nsCommonData.urlSummaryData.urlName;
    }
    if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1){
      this.filter += ', Generator Name=' +this.ddrData.generatorName;
    }
      
    if(this.ddrData.vectorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1){
      this.filter += ', Group Name=' +this.ddrData.vectorName;
    }
    
    if (this.filter.startsWith(',')) {
      this.filter = this.filter.substring(1);
    }
    if (this.filter.endsWith(',')) {
      this.filter = this.filter.substring(0, this.filter.length - 1);
    }
  }

  makeajaxcallCount(){
    let countUrl = this.url +'&limit=' + this.limit + '&offset=' + this.offset +'&showCount=true';
    this.ddrRequest.getDataUsingGet(countUrl).subscribe(data => { (this.AssignCountData(data)) });
  }

  AssignCountData(countdata){
    this.count = countdata.totalCount;
    if(this.limit > this.count)
      this.limit = Number(this.count);
    console.log("countdata",countdata);
  }

  createTable() {
    
        this.cols = [
          { field: 'urlName', header: 'URL Name', sortable: true, align: 'left', action: true },
         // { field: 'sessionCount', header: 'Script Count', align: 'right', color: 'blue', sortable: 'custom  ', action: true },
          { field: 'pageName', header: 'Page Name', sortable: 'custom', align: 'right', action: true },
          { field: 'scriptName', header: 'Script Name', sortable: 'custom', align: 'right', action: true },
          { field: 'tried', header: 'Tried', sortable: 'custom', align: 'right', action: true },
          { field: 'success', header: 'Success', sortable: 'custom', align: 'right', action: true },
          { field: 'fail', header: 'Fail', sortable: true, align: 'right', action: true },
          { field: 'failPercent', header: '%Fail', sortable: 'custom', align: 'right', action: true },
          { field: 'avgmin', header: 'Min', sortable: 'custom', align: 'right', action: true },
          { field: 'avgaverage', header: 'Average', sortable: 'custom', align: 'right', action: true },
          { field: 'avgmax', header: 'Max', sortable: 'custom', align: 'right', action: true },
          { field: 'avgmedian', header: 'Median', sortable: 'custom', align: 'right', action: true },
          { field: 'avgeighty', header: '80%tile', sortable: 'custom', align: 'right', action: true },
          { field: 'avgninety', header: '90%tile', sortable: 'custom', align: 'right', action: true },
          { field: 'avgninetyFive', header: '95%tile', sortable: 'custom', align: 'right', action: true },
          { field: 'avgninetyNine', header: '99%tile', sortable: 'custom', align: 'right', action: true }
        ];
    
        /*Component changes in case of url summary by status(fail% column is not shown and status column is added)*/
        if (this.nsCommonData.urlreportid) {
          this.cols[6].field = "errorname";
          this.cols[6].header = "Status";
        }
    
        this.visibleCols = [
          'urlName','pageName','scriptName','tried','success',  'fail', 'avgmin', 'avgaverage',
          'avgmax', 'avgmedian', 'avgeighty', 'avgninety', 'avgninetyFive',
          'avgninetyNine'
        ];

        if(this.nsCommonData.urlreportid)
          this.visibleCols.push('errorname');
          else
          this.visibleCols.push('failPercent');
        
    
        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
          this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
        }
        console.log('column options', this.columnOptions);
      }

      /*Function is called when Instance report is opened (from tried and success)*/
      urlInstanceReport(row,status?) {
    this.ddrData.nsCQMFilter["URL Instance"]=undefined;    
    this.nsCommonData.urlInstanceData = undefined;
    this.nsCommonData.urlsessionsummarydata = row;
    this.nsCommonData.urlidx = row.urlindex;
    if(status){
      this.nsCommonData.urlInstancethroughsuccess = true;
    }
    else{
      this.nsCommonData.urlInstancethroughsuccess = false;
    }
    console.log("this.commonService.isFromUrlSummary ===>",this.commonService.isFromUrlSession);
    if(this.commonService.isFromUrlSummary)
    {
      console.log("inside of cqm cond==>",this.commonService.nsURLSession);
      this.commonService.nsURLInstance=JSON.parse(JSON.stringify(this.commonService.nsURLSession));
      this.commonService.nsURLInstance['reportType']='instance';
      delete this.commonService.nsURLInstance['fields'];
      if(this.commonService.nsURLInstance['group'] && this.commonService.nsURLInstance['order'])
      this.commonService.nsURLInstance=this.commonService.filterGroupOrder(this.commonService.nsURLInstance);
      else
      delete this.commonService.nsURLInstance['group'];
      if (this.commonService.nsURLInstance['urlidx'] && (this.commonService.nsURLInstance['urlidx']=='undefined' || this.commonService.nsURLInstance['urlidx'] )) {
        this.commonService.nsURLInstance['urlidx']=this.nsCommonData.urlidx;
      }
      if (this.nsCommonData.urlInstancethroughsuccess)
      this.commonService.nsURLInstance['statusCode']=0;
      console.log("this.commonService.nsURLInstance==> going ourt of summary=====>",this.commonService.nsURLInstance);
      // if (this.nsCommonData.urlsessionsummarydata != undefined) {
      //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
      // }
      this.commonService.nsAutoFillSideBar(this.commonService.currentReport, 'URL Instance');
      this.commonService.isFromUrlSession = true;
    }

    
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SESSION_SUMMARY;
        this.ddrData.nsFromGraph = false;
        this._router.navigate(['/home/ddr/nsreports/urlInstance']);
  }

   /*Function is called when url component detail report is opened (from average)*/
   componentDetails(row) {
    this.nsCommonData.urldetaildata = undefined;
    this.nsCommonData.urlsessionsummarydata = row;
    this.nsCommonData.urlidx = row.urlindex;
    this.nsCommonData.pgDetailToURLDetailFlag = false;
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SESSION_SUMMARY;
        this._router.navigate(['/home/ddr/nsreports/urldetails']);
    }
  

  failure(row) {
    this.nsCommonData.urlfaildata = undefined;
    this.nsCommonData.urlsessionsummarydata = row;
    this.nsCommonData.urlidx = row.urlindex;
    if (this.nsCommonData.urlreportid){
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SESSION_SUMMARY;
    console.log("staaaaaaaaaaaaaaatus",this.urlSessionSummaryData.status);
    this.nsCommonData.FailureStatus = row.status;
  //  this._router.navigate(['/home/ddr/nsreports/urlInstance'])
    }else{
    this.nsCommonData.urlsessionsummarydata = row;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SESSION_SUMMARY;
    //this._router.navigate(['/home/ddr/nsreports/urlfail']);
    }
    
    if (this.nsCommonData.urlreportid)
    {
      if(this.commonService.isFromUrlSummary)
      {
        console.log("inside of cqm cond==>",this.commonService.nsURLSession);
        this.commonService.nsURLInstance=JSON.parse(JSON.stringify(this.commonService.nsURLSession));
        this.commonService.nsURLInstance['reportType']='instance';
        delete this.commonService.nsURLInstance['fields'];
        delete this.commonService.nsURLInstance['group'];
      //  delete this.commonService.nsURLInstance['order'];
        if (this.commonService.nsURLInstance['urlidx'] && ( this.commonService.nsURLInstance['urlidx']) ) {
          this.commonService.nsURLInstance['urlidx']=this.nsCommonData.urlidx;
        }
        if(!this.commonService.nsURLInstance['pageName'])
        this.commonService.nsURLInstance['pageName']=row.pageName;
        if (this.nsCommonData.urlInstancethroughsuccess)
        this.commonService.nsURLInstance['statusCode']=0;
  
        console.log("this.commonService.nsURLInstance==> going ourt of summary=====>",this.commonService.nsURLInstance);
        // if (this.nsCommonData.urlsessionsummarydata != undefined) {
        //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
        // }
        this.commonService.nsAutoFillSideBar(this.commonService.currentReport, 'URL Failure');
        this.commonService.isFromUrlSession = true;
    
      }  

    }
    else
    {
    if(this.commonService.isFromUrlSummary)
    {
      this.commonService.nsURLFailure=JSON.parse(JSON.stringify(this.commonService.nsURLSession));
      console.log("this.commonService.nsURLFailure==>",this.commonService.nsURLFailure);
     if(this.commonService.nsURLFailure['objid']=='undefined' || this.commonService.nsURLFailure['objid']==undefined)
      this.commonService.nsURLFailure['objid']=this.nsCommonData.urlidx;
      else
      this.commonService.nsURLFailure['objid']=this.commonService.nsURLFailure['urlidx'];
      delete this.commonService.nsURLFailure['urlidx'];
      delete this.commonService.nsURLFailure['transidx'];
      delete this.commonService.nsURLFailure['pageidx'];
      delete this.commonService.nsURLFailure['scriptidx'];
      delete this.commonService.nsURLFailure['fields'];
      delete this.commonService.nsURLFailure['strGroupBy'];
      delete this.commonService.nsURLFailure['group'];
      this.commonService.nsURLFailure['reportType']='failure';
      
      if(this.commonService.nsURLFailure['statusCode']==-2 ||this.commonService.nsURLFailure['statusCode']==-0)
      {
        this.commonService.nsURLFailure['statusCode']=-1;
      }
      this.commonService.nsURLFailure['strStatusName']='NA';
      delete this.commonService.nsURLFailure['fields'];
      delete this.commonService.nsURLFailure['strGroupBy'];
      delete this.commonService.nsURLFailure['order'];
      delete this.commonService.nsURLFailure['location'];
      delete this.commonService.nsURLFailure['browser'];
      delete this.commonService.nsURLFailure['access'];
      if(!this.commonService.nsURLFailure['pageName'])
      this.commonService.nsURLFailure['pageName']=row.pageName;
      
      console.log("this.commonservice.nsURLFailure===> going out==>",this.commonService.nsURLFailure);
      // this.url += '&object=0&limit=22&offset=0&statusCode=-1&showCount=false' + '&startTime=' + startTime + '&endTime=' 
      // endTime + '&reportType=failure' + '&strStatusName=NA' + '&objid=' + this.urlidx;
     this.commonService.isFromUrlSession=true;
    }
  }
    if (this.nsCommonData.urlreportid){
      this.ddrData.nsFromGraph = false;
      this._router.navigate(['/home/ddr/nsreports/urlInstance'])
    }
    else
    this._router.navigate(['/home/ddr/nsreports/urlfail']);

  }

   /*
  **FUnction used to custom sort for intger and float
  */
  sortColumnsOnCustom(event, urlSummaryData) {
    //console.log(event)
    let fieldValue = event["field"];
    // if (fieldValue == "MinDepth" || fieldValue == "MaxDepth" || fieldValue == "Count") {
    if (event.order == -1) {
      event.order = 1
      urlSummaryData = urlSummaryData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      event.order = -1;
      //asecding order
      urlSummaryData = urlSummaryData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }

    this.urlSessionSummaryData = [];
    //console.log(JSON.stringify(tempData));
    if (urlSummaryData) {
      urlSummaryData.map((rowdata) => { this.urlSessionSummaryData = this.Immutablepush(this.urlSessionSummaryData, rowdata) });
    }

  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
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

    
  paginate(event) {
    // event.first = Index of the first record  (used  as offset in query) 
    // event.rows = Number of rows to display in new page  (used as limit in query)
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
  
    
    this.offset = parseInt(event.first); 
    this.limit = parseInt(event.rows); 
  
     if(this.limit > this.count)
       this.limit = Number(this.count);     
       
    if((this.limit + this.offset) > this.count)
      this.limit = Number(this.count) - Number(this.offset);
    this.makeajaxcall();
  }
  
  openSessionName(nodeData)
    {
        let url='//' + this.getHostUrl() + '/' + this.commonParams.product + 
        '/recorder/recorder.jsp?openFrom=TR'+this.commonParams.testRun + 
        '&scriptName='+nodeData + "&sesLoginName=" + sessionStorage.getItem('sesLoginName');
        console.log('JNLP Launcher url ',url);

        window.open(url, "_blank");
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
          for(let j = 0; j < this.visibleCols.length; j++) {
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

    formatter(value) {
      if (value != '' && !isNaN(value)) {
        return Number(Number(value)).toLocaleString();
      }
      else if(value === ''){
      return '-';
      }
      else
        return value;
    }
    
    ngOnDestroy():void
    {
     this.commonService.isFromUrlSummary=false;

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
