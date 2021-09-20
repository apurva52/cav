import { Component, OnInit } from '@angular/core';
//import { NsReportService } from '../../../../../../main/services/ns-report-service';
import 'rxjs/Rx';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { CommonServices } from '../../../../services/common.services';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from '../../../../interfaces/selectitem';
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { NsCommonService } from '../../services/ns-common-service';
import { DdrDataModelService } from "../../../../../../main/services/ddr-data-model.service";
import { Subscription } from 'rxjs/Rx';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
  selector: 'app-page-instance-report',
  templateUrl: './page-instance-report.component.html',
  styleUrls: ['./page-instance-report.component.css']
})
export class PageInstanceReportComponent implements OnInit {

  pageInstanceInfo:Object[] = [{"pageName":"","scriptName":"","location":"","access":"","userId":"","sessionId":"","startTime":"","respTime":"",
  "status":"","childIndex":"", "pageInstance":""}];
  pageInstanceData : Array<PageInstanceInterface>;
  cols:any[];
  visibleCols:any[];
  columnOptions: SelectItem[];
  prevColumn:any;
  urlParam:any;
  limit:number = 50;
  offset:number = 0;
  url:string;
  totalCount:any;
  failureData:any;
  sub:any;
  status:string ="";
  filterCriteria:string="";
  screenHeight:any;
  pageName:string="";
  scriptName:string="";
  statusField:string="";
  loading = false;
  strTitle:any;
  showDownloadOption:boolean=true;
  dynamicWidthColumn : number ;  //  To calculate dynamic width of column
  subscribePage: Subscription;
  toolTipStatus: string='';
  toolTipUrl: string='';
  filterStatus: string='';
  filterUrl: string='';
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  loader: boolean;
  value: number;

  constructor(private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService, public commonService: CommonServices , private route : ActivatedRoute,
    private breadcrumbService: DdrBreadcrumbService, private _router: Router, private nsCommonData : NsCommonService,
    private _ddrData: DdrDataModelService, private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.commonService.isToLoadSideBar=true;
    this.loading = true;
    console.log("pgSummaryToInstance data = " , this.nsCommonData.pgSummaryToInstanceData);
    console.log("pgSummaryToInstanceFlag = " , this._ddrData.pgSummaryToInstanceFlag);
    //console.log("pgSummaryToInstanceFlag = " , this.nsCommonData.pgSummaryToInstanceFlag);
    this.randomNumber();
    this.urlParam = this.commonService.getData();
    console.log(" **** url Param **** " , this.urlParam);
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_INSTANCE)
    if(this._ddrData.pageFailure == true)
    {
      // this.sub = this.route.queryParams.subscribe(params => {
      //   this.failureData = JSON.parse(params['pageFailureDataFromSummary']);
      //   this.scriptName = params['scriptName'];
      //   console.log(" this.failureData ============== " ,  this.failureData); // for bug 67186 due to this ddr side bar ed cond. was getting true.cz of ? present in url of page in browser
      // });
      this.failureData =  this.nsCommonData.pgSummaryToFailureData;
      this.scriptName  =  this.nsCommonData.scriptName;
    }

    if(this._ddrData.pgSummaryToInstanceFlag == true)
    {
      //this.statusField = this.route.snapshot.queryParams['statusField'];
      this.statusField = this.nsCommonData.statuscode;
      console.log("this.statusField==>",this.statusField);
      console.log("this.statusField==>",!this.statusField);
      if(this.statusField==undefined)
      this.statusField = this.route.snapshot.queryParams['statusField'];
    }
    
    this.commonService.currentReport="Page Instance";
    
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsPageInstance==>",this.commonService.nsPageInstance); 
    this.subscribePage=this.commonService.sideBarUIObservable$.subscribe((temp)=>{
      if(this.commonService.currentReport=="Page Instance")
     { 
       this.loading = true;
       this.limit=50;
       this.offset=0;
       this.getPageInstanceData();
       this.getPageInstanceDataCount();
       this.makeColumns();
     }
    })
    this.makeColumns();
    this.getPageInstanceData();
    this.getPageInstanceDataCount();
    this.setTestRunHeader();
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.urlParam.testRun = this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.urlParam.testRun);
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  makeColumns()
  {
    this.cols = [
      { field: 'pageName', header: 'Page Name', sortable: true, action: true, align:'left', width: '70'},
      { field: 'scriptName', header: 'Script Name', sortable: true, action: true, align:'left', width: '70'},
      { field: 'userId', header: 'User Id', sortable: 'custom', action: true, align:'right', width: '50'},
      { field: 'sessionId', header: 'Session Id', sortable: 'custom',action: true, align:'right', width: '50'},
      { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true, align:'right', width: '70'},
      { field: 'respTime', header: 'Response Time', sortable: 'custom', action: true, align:'right', width: '70'},
      { field: 'status', header: 'Status', sortable: true, action: true, align:'left', width: '70'},
    ];

    
    if(this._ddrData.WAN_ENV > 0)
    {
      this.nsCommonData.isFromSummary = false;
      this.cols = this.cols.concat({ field: 'location', header: 'Location', sortable: true, action: true, width: '70'},
      { field: 'access', header: 'Access', sortable: true, action: true,  width: '70'},
      { field: 'browser', header: 'Browser', sortable: true, action: false, width: '70'});
      this.visibleCols = [
        'pageName','scriptName','userId','tried','sessionId','startTime','respTime','status','location','access'
      ];
    }
    else{
      this.visibleCols = [
        'pageName','scriptName','userId','tried','sessionId','startTime','respTime','status'
      ];
    }

   
    // this.visibleCols = [
    //   'pageName','scriptName','userId','tried','sessionId','startTime','respTime','status','location','access'
    // ];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    console.log('column options', this.columnOptions);
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
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
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
  }

  getPageInstanceData()
  { let ajaxParam='';
    console.log(" ****** get data for page instance ****** ",this.commonService.enableQueryCaching);
    if(this.commonService.enableQueryCaching == 1){
      this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageInstance?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
    }
    else{
      this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageInstance?testRun=' + this.urlParam.testRun;
    }
    if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsPageInstance).length!=0) {
      if (this._ddrData.pgSummaryToInstanceFlag == true)
      {
        this.commonService.nsPageInstance['pageName']= this.nsCommonData.pgSummaryToInstanceData['pageName'];
        this.commonService.nsPageInstance['scriptName'] = this.nsCommonData.pgSummaryToInstanceData['scriptName'];
        this.commonService.nsPageInstance['pageIndex']= this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
      }
      if (this._ddrData.pageFailure) {
        if (this.commonService.nsPageInstance['pageName'] && (this.commonService.nsPageInstance['pageName'] == 'undefined' || this.commonService.nsPageInstance['pageName'] == undefined))
          this.commonService.nsPageInstance['pageName'] = this.nsCommonData.pgSummaryToFailureData['pageName'];
        if (this.commonService.nsPageInstance['scriptName'] && (this.commonService.nsPageInstance['scriptName'] == 'undefined' || this.commonService.nsPageInstance['scriptName'] == undefined))
          this.commonService.nsPageInstance['scriptName'] = this.scriptName;
        if (this.commonService.nsPageInstance['pageIndex'] && (this.commonService.nsPageInstance['pageIndex'] == 'undefined' || this.commonService.nsPageInstance['pageIndex'] == undefined))
          this.commonService.nsPageInstance['pageIndex'] = this.nsCommonData.pgSummaryToFailureData['pageIndex'];
        this.commonService.nsPageInstance['pageSummaryToInstFlag'] = this._ddrData.pgSummaryToInstanceFlag;
      }
      
      ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsPageInstance);
      this.commonService.isCQM=true;
      this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsPageInstance;
      console.log("inside first condition ***",this._ddrData.nsCQMFilter[this.commonService.currentReport]);
    } 
    else {
      ajaxParam = '&startTime=' + this.urlParam.startTime + '&endTime=' + this.urlParam.endTime + '&object=1&wanenv=' + this._ddrData.WAN_ENV +'&pageSummaryToInstFlag='
        + this._ddrData.pgSummaryToInstanceFlag;

      if (this._ddrData.pgSummaryToInstanceFlag == true) {
        this.pageName = this.nsCommonData.pgSummaryToInstanceData['pageName'];
        this.scriptName = this.nsCommonData.pgSummaryToInstanceData['scriptName'];
        this.status = this.statusField;
        ajaxParam += '&pageName=' + this.pageName + '&scriptName=' + this.scriptName + "&pageIndex=" + this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
      }
      else if (this._ddrData.pageFailure == true) {
        if (this.nsCommonData.pgFailureToInstanceData == undefined)
          this.status = '-1';
        else
          this.status = this.nsCommonData.pgFailureToInstanceData['failureCode'];
          let pageIndex=undefined;
           
        if (this.failureData && this.failureData['pageName']) {
        this.pageName = this.failureData['pageName'];
          pageIndex = this.failureData.pageIndex
        }
        ajaxParam += '&pageName=' + this.pageName + '&pageIndex=' + pageIndex + '&script=' + this.scriptName;
      }
      else
        this.status = "-2";
      ajaxParam += '&status=' + this.status;

      // if(this._ddrData.groupName=="Page Download"  && this._ddrData.vectorName!='undefined'&& this._ddrData.vectorName!=undefined )
      // ajaxParam += '&pageName=' + this._ddrData.vectorName;
            
      if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
      ajaxParam += '&groupName=' +this._ddrData.vectorName;
     if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
      ajaxParam += '&generatorName=' +this._ddrData.generatorName;
      
      if (this._ddrData.nsErrorName){
        ajaxParam +='&nsErrorName=' + this._ddrData.nsErrorName ;
      }

      // this.commonService.nsPageInstance=this.commonService.makeObjectFromUrlParam(ajaxParam);
     //do not make ajax param here cz it will change the object stored in for breadcrumb via CQM.
    }
 if(this.commonService.isFromPageSummary || this.commonService.isFromPageFailure || this.commonService.isFromPageSessionSummary || this.commonService.isCQM)
    {
      console.log("inside data of page Instance==>",this._ddrData.nsCQMFilter);
      //this.commonService.nsTransactionSummary=this._ddrData.nsCQMFilter[this.commonService.currentReport];
      ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsPageInstance,true);
      this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsPageInstance;
      console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);
      console.log("ajax param are==>",ajaxParam);
    }
    else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
      this.commonService.isFromPageInstance=true;
      console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
      ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
    }


    this.commonService.nsPageInstance=this.commonService.makeObjectFromUrlParam(ajaxParam);
   
      this.url += ajaxParam;
    let finalUrl = this.url + '&limit=' + this.limit + '&offset=' + this.offset + '&showCount=false' + '&queryId='+this.queryId;

    console.log("final url *** " , finalUrl);
      
    setTimeout(() => {
      this.openpopup();
     }, this._ddrData.guiCancelationTimeOut);
    return this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => this.assignPageInstanceData(data));
  }
  

  assignPageInstanceData(res: any)
  { 
    this.isCancelQuerydata =true;
    this.commonService.isFilterFromNSSideBar=false;
    console.log("response for page instance  = " , res);
    this.loading = false;
    this.loader = false;
    this.pageInstanceInfo = res.data;    
    if(this.pageInstanceInfo.length == 0)
      this.showDownloadOption = false;
    else
     this.showDownloadOption = true;
    this.pageInstanceData = this.getPageInstanceInfo();
    this.showFilterCriteria(res.startTimeInDateFormat,res.endTimeInDateFormat);
    this.commonService.customTimePlaceHolder=[];
    this.commonService.customTimePlaceHolder.push(res.startTimeInDateFormat, res.endTimeInDateFormat);
  }

  showFilterCriteria(startTimeInDateFormat:any,endTimeInDateFormat:any)
  {
    this.filterCriteria='';
    this.toolTipStatus='';
    this.toolTipUrl='';
    this.filterStatus='';
    this.filterUrl=''; 
   
    let pageInstance = this.commonService.nsPageInstance;
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filterCriteria += "DC=" + this._ddrData.dcName;
    if (!this.commonService.isValidParamInObj(pageInstance, 'phaseName')) {
      if (startTimeInDateFormat != "NA" && startTimeInDateFormat != "" && startTimeInDateFormat != undefined && startTimeInDateFormat != "undefined")
        this.filterCriteria += ", From=" + startTimeInDateFormat;
      if (endTimeInDateFormat != "NA" && endTimeInDateFormat != "" && endTimeInDateFormat != undefined && endTimeInDateFormat != "undefined")
        this.filterCriteria += ", To=" + endTimeInDateFormat;
    }

    if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
    if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

    if (this.pageName != "NA" && this.pageName != "" && this.pageName != undefined && this.pageName != "undefined")
      this.filterCriteria += ", Page=" + this.pageName;
    if (this.scriptName != "NA" && this.scriptName != "" && this.scriptName != undefined && this.scriptName != "undefined")
      this.filterCriteria += ", Script=" + this.scriptName;

    if (this.commonService.isValidParamInObj(pageInstance, 'scriptName'))
      this.filterCriteria += ", script=" + pageInstance.scriptName;
    if (this.commonService.isValidParamInObj(pageInstance, 'url'))
    {
      let url=pageInstance['url'];
    if(url && url.length>=20)
    {
      this.toolTipUrl+=pageInstance['url'];
      url=url.substring(0,19);
      this.filterUrl += ", Url=" + url+" ....";  
    }
    else
    this.filterUrl += ", Url=" + url; //substringed value
    }  
    //this.filterCriteria += ", url=" + pageInstance.url;
    if (this.commonService.isValidParamInObj(pageInstance, 'transactionName'))
      this.filterCriteria += ", transactionName=" + pageInstance.transactionName;
    if (this.commonService.isValidParamInObj(pageInstance, 'page'))
      this.filterCriteria += ", page" + pageInstance.page
    if (this.commonService.isValidParamInObj(pageInstance, 'location') && this._ddrData.WAN_ENV > 0)
      this.filterCriteria += ", location=" + pageInstance.location
    if (this.commonService.isValidParamInObj(pageInstance, 'access') && this._ddrData.WAN_ENV > 0)
      this.filterCriteria += ", access=" + pageInstance.access
    if (this.commonService.isValidParamInObj(pageInstance, 'browser'))
      this.filterCriteria += ", browser=" + pageInstance.browser
    if (this.commonService.isValidParamInObj(pageInstance, 'group'))
      this.filterCriteria += ", group=" + pageInstance.group
    if (this.commonService.isValidParamInObj(pageInstance, 'order'))
      this.filterCriteria += ", order=" + pageInstance.order
    if (this.commonService.isValidParamInObj(pageInstance, 'statusName'))
    {
      let status=pageInstance['status'];
    if(status && status.length>=20)
    {
      this.toolTipStatus+=pageInstance['status'];
      status=status.substring(0,19);
      this.filterStatus += ", Status=" + status+" ....";  
    }
    else
    this.filterStatus += ", Status=" + status;
  }
  if (this.commonService.isValidParamInObj(pageInstance, 'phaseName'))
  this.filterCriteria += ", Phase Name=" + pageInstance.phaseName;
  //    this.filterCriteria += ", Status=" + pageInstance.statusName;
    if (this.filterCriteria.startsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(1);
    
    if (this.filterCriteria.endsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  getPageInstanceInfo():Array<PageInstanceInterface>
  {
    let arr =[];
    for(let i=0; i<this.pageInstanceInfo.length; i++)
    {
      arr[i] = {"pageName":this.pageInstanceInfo[i]['pageName'],"scriptName":this.pageInstanceInfo[i]['scriptName'],"location":this.pageInstanceInfo[i]['location'],
      "access":this.pageInstanceInfo[i]['access'],"userId":this.pageInstanceInfo[i]['childIndex']+':'+this.pageInstanceInfo[i]['userId'],
      "sessionId":this.pageInstanceInfo[i]['childIndex']+':'+this.pageInstanceInfo[i]['sessionId'],"startTime":this.pageInstanceInfo[i]['startTime'],
      "respTime":this.pageInstanceInfo[i]['respTime'],"status":this.pageInstanceInfo[i]['status'],"childIndex":this.pageInstanceInfo[i]['childIndex'],
      "pageInstance":this.pageInstanceInfo[i]['pageInstance']};
    }
    return arr;
  }

  getPageInstanceDataCount()
  {
    this.url += '&showCount=true';
    return this.ddrRequest.getDataUsingGet(this.url).subscribe(data => this.assignPageInstanceCount(data));
  }

  assignPageInstanceCount(res: any)
  {
    console.log("response for data count = " , res);
    this.totalCount = res.count;
   if (this.limit > this.totalCount)
      this.limit = Number(this.totalCount);
  }

  paginate(event)
  {
    console.log("paginate event = " , event);
    this.offset = Number(event.first);
    this.limit = Number(event.rows);
     if (this.limit > this.totalCount)
        this.limit = Number(this.totalCount);
       if ((this.limit + this.offset) > this.totalCount)
             this.limit = Number(this.totalCount) - Number(this.offset);
    this.loader = true;
    this.getProgressBar();
    this.commonService.isFilterFromNSSideBar = true;    
    this.getPageInstanceData();
    
    
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
  openSessionName(nodeData)
  {
      let url= this.getHostUrl() + '/' + this.urlParam.product +
      '/recorder/recorder.jsp?openFrom=TR'+this.urlParam.testRun +
      '&scriptName='+nodeData + "&sesLoginName=" + sessionStorage.getItem('sesLoginName') ;
      console.log('JNLP Launcher url ',url);

      window.open(url, "_blank");
  }

  openSessionTimeDetail(nodeData:any)
  {
    console.log("nodeData = " , nodeData);
    this.nsCommonData.currRowData = nodeData;
    let sessionId = nodeData.sessionId;
    this.nsCommonData.sesssionDuration = sessionId.substring(sessionId.indexOf(':')+1,sessionId.length);
    this.nsCommonData.childIdx = nodeData.childIndex;
    this.nsCommonData.scriptName = nodeData.scriptName;
    this.nsCommonData.objectType = '1';
    this.nsCommonData.pageInstance = nodeData.pageInstance;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_INSTANCE;
    if(this.commonService.isFromPageFailure || this.commonService.isFromPageSummary || this.commonService.isFromPageSessionSummary)
    {
     this.commonService.nsSessionTiming=JSON.parse(JSON.stringify(this.commonService.nsPageInstance));
     console.log("going from page instance====>",this.commonService.nsSessionTiming); 
     this.commonService.isFromPageInstance=true;
    }
    this._router.navigate(['/home/ddr/nsreports/sessionTiming']);
  }

  /**Formatter cell data for converting ms to sec field */

  msToTimeFormat(duration) 
  {
    if (!isNaN(duration))
    {
      var milliseconds , seconds , minutes , hours , temp, time;
      time = +duration;
      time = Math.round(time);
      milliseconds = time%1000;
      time = (time - milliseconds)/1000;
      hours = parseInt(Number(time/3600)+'');
      time = time%3600;
      minutes = parseInt(Number(time/60)+'');
      time = time%60;
      seconds = parseInt(Number(time)+'');
      return(this.appendStringToTime(hours,minutes,seconds,milliseconds));
    }
    else
      return duration;
  }

  appendStringToTime(hh,mm,ss,msec)
  {
    if (msec < 10)
      msec = "0" + msec;
    if (msec < 100)
      msec = "0" + msec;
    if (mm < 10)
      mm = "0" + mm;
    if (ss < 10)
      ss = "0" + ss;
    if (hh < 10)
      hh = "0" + hh; // Make hrs 2 digit string

    return (hh + ":" + mm + ":" + ss + "." + msec);
  }

  customSortOnColumns(event, tempData) {
    console.log('event["field"]>>>>---' + event["field"]);
    //for interger type data type
    if (event["field"] == 'userId' || event["field"] == 'sessionId') {
        if (event.order == -1) {
            var temp = (event["field"]);
            let arr1: any[];
            let arr2: any[];
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                arr1 = a[temp].split(":");
                arr2 = b[temp].split(":");
                if (arr1[0] == arr2[0]) {
                    var value = Number(arr1[1]);
                    var value2 = Number(arr2[1]);
                } else {
                    var value = Number(arr1[0]);
                    var value2 = Number(arr2[0]);
                }
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            var temp = (event["field"]);
            let arr1: any[];
            let arr2: any[];
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                arr1 = a[temp].split(":");
                arr2 = b[temp].split(":");
                if (arr1[0] == arr2[0]) {
                    var value = Number(arr1[1]);
                    var value2 = Number(arr2[1]);
                } else {
                    var value = Number(arr1[0]);
                    var value2 = Number(arr2[0]);
                }
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }
    }
    else {
        if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1; //desending order
            console.log('temp datattaaa ', temp);
            tempData = tempData.sort(function (a, b) {
                var value = Number(a[temp].replace(/[:.,]/g, ''));
                var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            var temp = (event["field"]);
            event.order = -1; //asecding order
            tempData = tempData.sort(function (a, b) {
                var value = Number(a[temp].replace(/[:.,]/g, ''));
                var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }
    }
    this.pageInstanceData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
        tempData.map((rowdata) => { this.pageInstanceData = this.Immutablepush(this.pageInstanceData, rowdata) });
    }

}
Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
}

  openUserSessionReport(nodeInfo:any)
  {
    if(this.commonService.isFromPageFailure || this.commonService.isFromPageSummary || this.commonService.isFromPageSessionSummary)
    {
       this.commonService.nsUserSession=JSON.parse(JSON.stringify(this.commonService.nsPageInstance));
       console.log(" is going from page instance to user session==>",this.commonService.nsUserSession);
       this.commonService.isFromPageInstance=true;
    }
    console.log("nodeInfo for user session = " , nodeInfo);
    this.nsCommonData.currRowData = nodeInfo;
    this.nsCommonData.objectType = '1';
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_INSTANCE;
    this._router.navigate(['/home/ddr/nsreports/userSession']);
  }

  setTestRunHeader()
  {
    if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm')
      this.strTitle = 'Netstorm - Page Instance Report - Test Run : ' + this.urlParam.testRun;
    else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - Page Instance Report - Test Run : ' + this.urlParam.testRun;
    else 
      this.strTitle = 'Netdiagnostics Enterprise - Page Instance Report - Session : ' + this.urlParam.testRun;  
  }

  downloadReport(type:string)
  {
    let renameArr;
    let colOrder;

     renameArr = {'pageName':'Page Name','scriptName':'Script Name','location':'Location','access':'Access','userId':'User Id',
    'sessionId':'Session Id','startTime':'Start Time','respTime':'Response Time','status':'Status'};
      colOrder = ['Page Name','Script Name','User Id','Session Id','Start Time','Response Time','Status','Location','Access'];  
    
    

    this.pageInstanceData.forEach((val, index) => {
      delete val['childIndex'];
      delete val['pageInstance'];
      delete val['browser'];
      val['startTime'] = this.msToTimeFormat(val['startTime']);
      val['respTime'] = this.msToTimeFormat(val['respTime']);
     });

    console.log("pageSummaryData for download **  " , this.pageInstanceData);
   
    if(this._ddrData.WAN_ENV < 1)
    {
      this.pageInstanceData.filter(val=>{
        delete val['location'];
        delete val['access'];      
      })
      renameArr = {'pageName':'Page Name','scriptName':'Script Name','userId':'User Id','sessionId':'Session Id','startTime':'Start Time',
      'respTime':'Response Time','status':'Status'};
      colOrder = ['Page Name','Script Name','User Id','Session Id','Start Time','Response Time','Status'];
    }
    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'PageInstance',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArr),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.pageInstanceData)
    };

    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true)+'/'+ this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl,(downloadObj)).subscribe(res =>(this.openDownloadReports(res)));
    else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>(this.openDownloadReports(res)));
    
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open( decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
  }
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.subscribePage.unsubscribe();
  this.commonService.isFromPageFailure=false;
  this.commonService.isFromPageSummary=false;
  this.commonService.isFromPageSessionSummary=false;
  this.commonService.isCQM=false;
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
}, this._ddrData.guiCancelationTimeOut);
}

onCancelQuery(){
    let url = "";
   url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.urlParam.testRun +"&queryId="+this.queryId;  
  console.log("Hello u got that",url);
    this.isCancelQuery = false;
     this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
  }

  openpopup(){
    if(!this.isCancelQuerydata)
    this.isCancelQuery =true;
  }

}

export interface PageInstanceInterface {
  pageName : string;
  scriptName : string;
  location : string;
  access : string;
  userId : string;
  sessionId : string;
  startTime : string;
  respTime : string;
  status : string;
  childIndex : string;
  pageInstance: string;
}
