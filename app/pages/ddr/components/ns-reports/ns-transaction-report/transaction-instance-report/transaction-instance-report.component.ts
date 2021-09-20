import { Component, OnInit, Input  } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { SelectItem } from '../../../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../../../../main/services/cav-config.service";
import { DdrDataModelService } from "../../../../../../main/services/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'transaction-instance-report',
    templateUrl: 'transaction-instance-report.component.html',
    styleUrls: ['transaction-instance-report.component.scss']
})
export class TransactionInstanceReportComponent {
  [x: string]: any;
  InstanceDetail:Object[]=[{"TransactionName":"","scriptName":"","location":"","access":"","browser":"","userId":"","sessionId":"","txInstance":"","childIndex":"","startTime":"","absoluteStartTime":"","responseTime":"","statusName":""
    }];
  TransactionInstanceData:Array<TransactionInstanceDataInterface>;
  urlParam: any;
  columnOptions: SelectItem[];
  url:any;
  loading = false;
  ajaxLoader = true;
  loader: boolean = false;
  filterCriteria = '';
  options: Object;
  cols: any;
  strTitle: any;
  trStartTime: any;
  trEndTime: any;
  txTotalCount: any;
  txLimit = 50;
  txOffset = 0;
  value: number = 1;
  visibleCols: any[];
  prevColumn;
  toggleFilterTitle = '';
  isEnabledColumnFilter = true;
  subscribeTransaction:Subscription;
  toolTipStatus:string='';
  filterStatus:string='';
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;

  ngOnInit() {
    this.screenHeight = Number(this.commonService.screenHeight) - 130;
    this.commonService.isToLoadSideBar = true ;
    this.loading = true;
    this.urlParam = this.commonService.getData();
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    console.log("this.urlParam >>>>>>>>>"+JSON.stringify(this.urlParam ));
    console.log("this.commonService.summaryToInstanceFlag >>>>>>>>>"+this.nsCommonData.summaryToInstanceFlag +"ffffff"+this.nsCommonData.transactionName);
    this.commonService.currentReport="Transaction Instance";
    this.randomNumber();
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsTransactionInstance==>",this.commonService.nsTransactionInstance);
    this.subscribeTransaction=this.commonService.sideBarUIObservable$.subscribe((temp)=>{
      if(this.commonService.currentReport=="Transaction Instance")
     { this.loading = true;
       this.txLimit=50;
       this.txOffset=0;
       this.fillInstanceData();
     }
    })
    this.fillInstanceData();
    
  }
  constructor(public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
    private nsCommonData: NsCommonService,
    private ddrRequest:DDRRequestService  ) {

  }

  fillInstanceData(){
      try {
        this.getTransactionInstanceData();
        this.getTransactionInstanceCount();
        this.setTestRunInHeader();
      this.cols = [
        { field: 'TransactionName', header: 'Transaction Name',  sortable: 'true',action: true, align: 'left', color: 'black', width: '100'},
        { field: 'scriptName', header: 'Script Name', sortable:'true', action: true, align: 'left', color: 'black', width: '100'},
        { field: 'location', header: 'Location',  sortable: 'true',action: true, align: 'left', color: 'black', width: '100'},
        { field: 'access', header: 'Access',  sortable: 'true',action: true, align: 'left', color: 'black', width: '100'},
        { field: 'browser', header: 'Browser',  sortable: 'true',action: false, align: 'left', color: 'black', width: '100'},
        { field: 'userId', header: 'User Id', sortable:'custom', action: true, align: 'right', color: 'black', width: '100'},
        { field: 'sessionId', header: 'Session Id', sortable:'custom', action: true, align: 'right', color: 'black', width: '100'},
        { field: 'startTime', header: 'Start Time', sortable:'custom', action: true,align: 'right', color: 'black', width: '95'},
        { field: 'responseTime', header: 'Response Time', sortable:'custom', action: true, align: 'right', color: 'black', width: '100'},
        { field: 'statusName', header: 'Status', sortable:'true', action: true, align: 'left', color: 'black', width: '100'}
      ];
      this.visibleCols = [
        'TransactionName','scriptName','location','access','userId','sessionId','startTime','responseTime','statusName'
      ];
      if(this._ddrData.WAN_ENV < 1)
      {
      this.nsCommonData.isFromSummary = true;
      this.cols.splice(2,3);
      this.visibleCols.splice(2,2);
      }
      this.columnOptions = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
      console.log('column options', this.columnOptions);
    } catch (error) {
      console.log('error in intialization compaonent --> ', error);
    }
  }



  getTransactionInstanceData(){
    try{
      let ajaxParam='';
      let dataurl ='';
      if(this._ddrData.transactionError == true)
      this.url = this.getHostUrl() + '/' + this._ddrData.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?cacheId='+ this.urlParam.testRun + '&testRun=' + this._ddrData.testRun;
      else if(this.commonService.enableQueryCaching == 1){
        this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?testRun=' + this.urlParam.testRun;
      }

      if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsTransactionInstance).length != 0) {
        
        console.log("inside the cQM filter applied cond===>");
        
        if (this.nsCommonData.summaryToInstanceFlag == true && this._ddrData.summaryToInstanceFlag =="true" && !(this.commonService.nsTransactionInstance['transidx']
        )) {
          console.log("inside summary to instance");
          this.commonService.nsTransactionInstance['transidx'] = this.nsCommonData.transactionIndex;
          delete this.commonService.nsTransactionInstance['transactionName'];
        }

    if(this.nsCommonData.failureToInstanceFlag == true && this._ddrData.summaryToInstanceFlag == "true" 
        && !(this.commonService.nsTransactionInstance['transidx'] && this.commonService.nsTransactionInstance['transactionName'])) {
           // condition for failure to instance
           console.log("inside failure to instance");
           this.commonService.nsTransactionInstance['transidx']=  this.nsCommonData.transactionIndex;
           this.commonService.nsTransactionInstance['transactionName']= this.nsCommonData.transactionName;
          }
          if (this.nsCommonData.sessionSummaryFlag === true && this._ddrData.summaryToInstanceFlag == "true" 
            && !(this.commonService.nsTransactionInstance['transidx'] && this.commonService.nsTransactionInstance['transactionName'])) {
             console.log("insside session summary to instance");
              this.commonService.nsTransactionInstance['script'] = this.nsCommonData.scriptname;
            this.commonService.nsTransactionInstance['transidx'] =this.nsCommonData.transactionIndex;
            this.commonService.nsTransactionInstance['transactionName']= this.nsCommonData.transactionName;
          }

        ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsTransactionInstance);
        // for FIlter CQM case    so that will update value in key pair.
        this._ddrData.nsCQMFilter[this.commonService.currentReport] = this.commonService.nsTransactionInstance;
      } 

      else {
	 if(this._ddrData.transactionError == true){
          this.trStartTime = this._ddrData.startTime;
          this.trEndTime = this._ddrData.endTime
        }
        ajaxParam = '&strStartTime=' + this.trStartTime +
          '&strEndTime=' + this.trEndTime +
          '&object=2&reportType=instance';

          if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
          ajaxParam += '&groupName=' +this._ddrData.vectorName;
         if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
          ajaxParam += '&generatorName=' +this._ddrData.generatorName;
         if(this._ddrData.transactionName)
         ajaxParam += '&transactionName=' + this._ddrData.transactionName;

        if (this.nsCommonData.summaryToInstanceFlag == true && this._ddrData.summaryToInstanceFlag == "true") {
          ajaxParam += '&transidx=' + this.nsCommonData.transactionIndex;
        }
      
       if (this._ddrData.transactionError) {
        //ajaxParam += '&transidx=' + this.nsCommonData.transactionIndex;
        ajaxParam += '&transactionName=' + this._ddrData.transactionName;
        ajaxParam += '&statusCode=' + this._ddrData.statuscode;
       } 
       else if (this.nsCommonData.failureToInstanceFlag == true && this._ddrData.summaryToInstanceFlag == "true") {
         // condition for failure to instance
	if(this.nsCommonData.transactionIndex)
          ajaxParam += '&transidx=' + this.nsCommonData.transactionIndex;
	if(this.nsCommonData.transactionName)
          ajaxParam += '&transactionName=' + this.nsCommonData.transactionName;
	if(this.nsCommonData.statuscode)
          ajaxParam += '&statusCode=' + this.nsCommonData.statuscode;
        }
       else if(this.nsCommonData.transactionInstancethroughsuccess) {
        ajaxParam += '&statusCode=0'
       }
         else if(this._ddrData.strStatus==0)
        {
         ajaxParam += '&statusCode=' + this._ddrData.strStatus;
        }
        else if(this._ddrData.filtermode.toLowerCase() == "success"){
          ajaxParam += '&statusCode=0';
        }
        else if(this._ddrData.filtermode.toLowerCase() == "failure"){
          ajaxParam += '&statusCode=-1';
        }
	      else {
          ajaxParam += '&statusCode=-2'
        }

        if (this.nsCommonData.sessionSummaryFlag === true && this._ddrData.summaryToInstanceFlag == "true") {
          ajaxParam += '&script=' + this.nsCommonData.scriptname;
          ajaxParam += '&transidx=' + this.nsCommonData.transactionIndex;
          ajaxParam += '&transactionName=' + this.nsCommonData.transactionName;
        }
       // this.commonService.nsTransactionInstance = this.commonService.makeObjectFromUrlParam(ajaxParam);
       //do not make ajax param here cz it will change the object stored in for breadcrumb via CQM.
      }
     
      if(this.commonService.isFromTransactionSummary || this.commonService.isFromTransactionSession ||this.commonService.isFromTransactionFailure)
      {
        console.log("inside 1st cond after coming from other report==>",this._ddrData.nsCQMFilter);
       // this.commonService.nsTransactionInstance=this._ddrData.nsCQMFilter[this.commonService.currentReport];
        ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsTransactionInstance,true);
        this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsTransactionInstance;
        console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);
        console.log("ajax param are==>",ajaxParam);

      }
      else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
        //condition for bread crumb. travel cz when other report are opened flags are turned off.
        console.log("inside 2nd condition after coming of nsCQMFilter",this._ddrData.nsCQMFilter[this.commonService.currentReport]);
        this.commonService.isFromTransactionSummary = true;
        this.commonService.isFromTransactionSession = true;
        this.commonService.isFromTransactionFailure = true;
        ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
      }

        if (this._ddrData.nsErrorName){
          ajaxParam +='&nsErrorName=' + this._ddrData.nsErrorName ;
        }

        this.commonService.nsTransactionInstance = this.commonService.makeObjectFromUrlParam(ajaxParam);
      
      this.url += ajaxParam;
      dataurl = this.url + '&limit=' + this.txLimit + '&offset=' + this.txOffset + '&showCount=false' + '&queryId='+this.queryId;
      console.log('Final URL for build>>>>>>>>>', dataurl);
	setTimeout(() => {
        this.openpopup();
       }, this._ddrData.guiCancelationTimeOut);
      this.ddrRequest.getDataUsingGet(dataurl).subscribe(data => (this.assignTransactionInstanceData(data)),
  error => {
        this.loading = false;
        }
);
    }
    catch (error) {
      console.log('error in getting data from rest call', error);
    }
  }
  assignTransactionInstanceData(res: any){
    this.isCancelQuerydata = true;
  //  console.log("res>>>>>>>>>>>>>"+JSON.stringify(res));
  this.commonService.isFilterFromNSSideBar=false;
  try {
      if (res === null || res === undefined) {
       this.loading = false;
        return;
      }
      setTimeout(() => {
        this.loading = false;
        this.loader = false;
      }, 2000);
      this.value = 1;
      this.loading = false;
      this.ajaxLoader = false;   
      this.InstanceDetail = res.data;

      this.TransactionInstanceData = this.getInstanceInfo();
      this.showfilterCriteria(res.startTime, res.endTime);
      this.commonService.customTimePlaceHolder=[];
      this.commonService.customTimePlaceHolder.push(res.startTime, res.endTime);
    }
  catch(error){
  }
}
getTransactionInstanceCount(){
  try{
    let counturl = '';
   counturl =this.url+ '&showCount=true';
  console.log('Final URL for build>>>>>>>>>', counturl);

  this.ddrRequest.getDataUsingGet(counturl).subscribe(data => (this.assignTransactioninstanceCount(data)));
  }
  catch(error)
      {
        console.log('error in getting data from rest call', error);
      }
}

assignTransactioninstanceCount(res: any){
console.log("res>>>>>>>>>>>>>"+JSON.stringify(res));
        this.txTotalCount = res.totalCount;
        if(this.txLimit > this.txTotalCount)
          this.txLimit = Number(this.txTotalCount);
}


opentimeDetailsReport(rowData: any){
  console.log("rowData*********>>>>>>>-------"+JSON.stringify(rowData));
  console.log("going out of instance===>");
  if (this.commonService.isFromTransactionSession || this.commonService.isFromTransactionSummary) {
    this.commonService.nsSessionTiming = JSON.parse(JSON.stringify(this.commonService.nsTransactionInstance));
    console.log("this.commonservice.sessionTiming from instance=========>", this.commonService.nsSessionTiming);
    this.commonService.isFromTransactionInstance = true;
  }
  this.nsCommonData.currRowData = rowData;
  // this.nsCommonData.sesssionDuration =rowData.sessionInst;
  // this.nsCommonData.childIdx = rowData.childIndex;
 // this.nsCommonData.transactionIndex = rowData.txInstance;
  this.nsCommonData.objectType = '2';

  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_INSTANCE;
  this._router.navigate(['/home/ddr/nsreports/sessionTiming'])
 
}

openSessionName(rowData: any)
 {
 let url= this.getHostUrl() + '/' + this.urlParam.product + 
 '/recorder/recorder.jsp?openFrom=TR'+this.urlParam.testRun + 
 '&scriptName='+rowData.scriptName + sessionStorage.getItem('sesLoginName');
 console.log('JNLP Launcher url ',url);

 if(sessionStorage.getItem('productType') == "netdiagnostics" && sessionStorage.getItem('enableSecurityMode') == "1")
    window.open(url, "_blank");
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

setTestRunInHeader(){
  if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm') {
    this.strTitle = 'Netstorm - Transaction Instance Report - Test Run : ' + this.urlParam.testRun;
  }
  else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
    this.strTitle = 'NetCloud - Transaction Instance Report - Test Run : ' + this.urlParam.testRun;
   else {
    this.strTitle = 'Netdiagnostics Enterprise - Transaction Instance Report - Session : ' + this.urlParam.testRun;
  }
}
/**  Pagination method */
paginate(event) {
  // event.first = Index of the first record  (used  as offset in query) 
  // event.rows = Number of rows to display in new page  (used as limit in query)
  // event.page = Index of the new page
  // event.pageCount = Total number of pages

  
  this.txOffset = parseInt(event.first); 
  this.txLimit = parseInt(event.rows); 

   if(this.txLimit > this.txTotalCount)
     this.txLimit = Number(this.txTotalCount);     
     
  if((this.txLimit + this.txOffset) > this.txTotalCount)
    this.txLimit = Number(this.txTotalCount) - Number(this.txOffset);
  this.loader = true;
  this.getProgressBar();
  this.commonService.isFilterFromNSSideBar = true;  
  this.getTransactionInstanceData();
  
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

  /**Formatter cell data for converting ms to sec field */

  msToTimeFormate(duration) {
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

/** Show Hide Column For Instance Report */
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
}



/**  CustomSorting for Instance Report */
CustomsortOnColumns(event, tempData) {
 // console.log('event["field"]>>>>---'+event["field"]);
    //for interger type data type
    if (event["field"]=='userId'|| event["field"]=='sessionId'){
      if (event.order == -1) {
         var temp = (event["field"]);
        let  arr1: any[];
        let  arr2: any[];
         event.order = 1
         tempData = tempData.sort(function (a, b) {
           arr1 = a[temp].split(":");
           arr2 = b[temp].split(":");
           if(arr1[0]==arr2[0]){
           var value = Number(arr1[1]);
           var value2 = Number(arr2[1]);
           }else{
            var value = Number(arr1[0]);
            var value2 = Number(arr2[0]);
           }
           return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
         });
       }
       else {
         var temp = (event["field"]);
         let  arr1: any[];
         let  arr2: any[];
         event.order = -1;
         //asecding order
         tempData = tempData.sort(function (a, b) {
          arr1 = a[temp].split(":");
          arr2 = b[temp].split(":");
          if(arr1[0]==arr2[0]){
          var value = Number(arr1[1]);
          var value2 = Number(arr2[1]);
          }else{
           var value = Number(arr1[0]);
           var value2 = Number(arr2[0]);
          }
           return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
         });
       }
  }else {
   if (event.order == -1) {
     var temp = (event["field"]);
     event.order = 1
     tempData = tempData.sort(function (a, b) {
       var value = Number(a[temp]);
       var value2 = Number(b[temp]);
       return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
     });
   }
   else {
     var temp = (event["field"]);
     event.order = -1;
     //asecding order
     tempData = tempData.sort(function (a, b) {
       var value = Number(a[temp]);
       var value2 = Number(b[temp]);
       return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
     });
   }
  }
  this.TransactionInstanceData = [];
  //console.log(JSON.stringify(tempData));
  if (tempData) {
    tempData.map((rowdata) => { this.TransactionInstanceData = this.Immutablepush(this.TransactionInstanceData, rowdata) });
  }
  
  }
  Immutablepush(arr, newEntry) {
  return [...arr, newEntry]
  }


/**  FilterCritera for NS Summary */
showfilterCriteria(startTime: any, endTime: any) {
  this.filterCriteria='';
  this.toolTipStatus='';
  this.toolTipHint='';
  this.filterStatus='';
  let transactionInstance=this.commonService.nsTransactionInstance;
  if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
  this.filterCriteria += "DC=" + this.ddrData.dcName;
  }
  if (!this.commonService.isValidParamInObj(transactionInstance, 'phaseName'))
  {
  if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
    this.filterCriteria = ', From=' + startTime;
  }
  if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
    this.filterCriteria += ', To=' + endTime;
  }
  }
//   if ( this._ddrData.summaryToInstanceFlag =="true"){
//   if (this.nsCommonData.transactionName !== 'NA' && this.nsCommonData.transactionName !== '' && this.nsCommonData.transactionName !== undefined) {
//     this.filterCriteria += ', Transaction Name=' + this.nsCommonData.transactionName;
//   }
// }

    if(this._ddrData.generatorName )
    this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
    if(this._ddrData.vectorName  && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1 )
    this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

  if (this.nsCommonData.sessionSummaryFlag== true && this._ddrData.summaryToInstanceFlag =="true"){
    if (this.nsCommonData.scriptname !== 'NA' && this.nsCommonData.scriptname !== '' && this.nsCommonData.scriptname !== undefined) {
    this.filterCriteria += ', Script='+ this.nsCommonData.scriptname;
  }
}
  if (this.commonService.isValidParamInObj(transactionInstance, 'script'))
    this.filterCriteria += ", script=" + transactionInstance.script;
  if (this.commonService.isValidParamInObj(transactionInstance, 'transactionName'))
    this.filterCriteria += ", Transaction Name=" + transactionInstance.transactionName;
  if (this.commonService.isValidParamInObj(transactionInstance, 'page'))
    this.filterCriteria += ", page" + transactionInstance.page
  if (this.commonService.isValidParamInObj(transactionInstance, 'location') && this._ddrData.WAN_ENV > 0)
    this.filterCriteria += ", location=" + transactionInstance.location
  if (this.commonService.isValidParamInObj(transactionInstance, 'access')  && this._ddrData.WAN_ENV > 0)
    this.filterCriteria += ", access=" + transactionInstance.access
  if (this.commonService.isValidParamInObj(transactionInstance, 'browser'))
    this.filterCriteria += ", browser=" + transactionInstance.browser
  if (this.commonService.isValidParamInObj(transactionInstance, 'group'))
    this.filterCriteria += ", group=" + transactionInstance.group
  if (this.commonService.isValidParamInObj(transactionInstance, 'order'))
    this.filterCriteria += ", order=" + transactionInstance.order
  if (this.commonService.isValidParamInObj(transactionInstance, 'statusName'))
 { let status=transactionInstance['statusName'];
  if(status && status.length>=20)
  {
    this.toolTipStatus+="Status= "+transactionInstance['statusName'];
    status=status.substring(0,19);
    this.filterStatus += ", Status=" + status+" ....";  
  }
  else
  this.filterStatus += ", Status=" + status;
 }
 if (this.commonService.isValidParamInObj(transactionInstance, 'phaseName'))
    this.filterCriteria += ", Phase Name=" + transactionInstance.phaseName;
  // this.filterCriteria += ", Status=" + transactionInstance.statusName;
    console.log('headerinfo', this.filterCriteria);
  if (this.filterCriteria.startsWith(',')) {
    this.filterCriteria = this.filterCriteria.substring(1);
  }
  if (this.filterCriteria.endsWith(',')) {
    this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  else
    this.filterCriteria += '';

}

/** Download report for Instance report  */
downloadReports(reports: string) {
  let downloadInstanceInfo =JSON.parse(JSON.stringify(this.TransactionInstanceData));
  let renameArray = {'TransactionName': 'Transaction Name','scriptName': 'Script Name', 'location': 'Location','access': 'Access','userId': 'User Id','sessionId': 'Session Id','startTime': 'Start Time','responseTime': 'Response Time','statusName': 'Status'}
          
    let colOrder = ['Transaction Name','Script Name','Location','Access','User Id','Session Id','Start Time','Response Time','Status'];
// console.log("TransactionInstanceData=========== ", JSON.stringify(downloadInstanceInfo));
downloadInstanceInfo.forEach((val, index) => {
        delete val['browser'];
        delete val['txInstance'];
        delete val['sessionInst'];
        delete val['userInst'];
        delete val['childIndex'];
        delete val['absoluteStartTime']; 

        val['startTime']= this.msToTimeFormate(val['startTime']);
        val['responseTime']= this.msToTimeFormate(val['responseTime']);
        if(this._ddrData.WAN_ENV < 1)
        {
        delete val['location'];
        delete val['access'];
        }
            });
  //console.log("TransactionInstanceData=========== ", JSON.stringify(downloadInstanceInfo));
        if(this._ddrData.WAN_ENV < 1)
        colOrder = ['Transaction Name','Script Name','User Id','Session Id','Start Time','Response Time','Status'];
              
        let downloadObj: Object = {
        downloadType: reports,
        varFilterCriteria: this.filterCriteria,
        strSrcFileName: 'TransactionInstance',
        strRptTitle: this.strTitle,
        renameArray: JSON.stringify(renameArray),
        colOrder: colOrder.toString(),
        jsonData: JSON.stringify(downloadInstanceInfo)
      };
      let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product) +
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
      window.open(decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
    }


getInstanceInfo():Array<TransactionInstanceDataInterface>
{
  var InstanceArr = [];
  if(this.InstanceDetail.length > 0)
  {
    for(var i=0; i< this.InstanceDetail.length; i++)
    {
      InstanceArr[i] = {TransactionName:this.InstanceDetail[i]["TransactionName"],scriptName:this.InstanceDetail[i]["scriptName"],location:this.InstanceDetail[i]["location"],access:this.InstanceDetail[i]["access"],browser:this.InstanceDetail[i]["browser"],userId:(this.InstanceDetail[i]["childIndex"]+":"+this.InstanceDetail[i]["userId"]),userInst:this.InstanceDetail[i]["userId"],sessionInst:this.InstanceDetail[i]["sessionId"],sessionId:(this.InstanceDetail[i]["childIndex"]+":"+this.InstanceDetail[i]["sessionId"]),txInstance:this.InstanceDetail[i]["txInstance"],childIndex:this.InstanceDetail[i]["childIndex"],startTime:this.InstanceDetail[i]["startTime"],absoluteStartTime:this.InstanceDetail[i]["absoluteStartTime"],responseTime:this.InstanceDetail[i]["responseTime"],statusName:this.InstanceDetail[i]["statusName"]}; 
     }
     return InstanceArr;
  }
  
    return InstanceArr;
}

openUserSessionReport(rowData: any){
  console.log("rowData>>>>>>>-------"+JSON.stringify(rowData));
  if (this.commonService.isFromTransactionSession || this.commonService.isFromTransactionSummary) {
    this.commonService.nsUserSession = JSON.parse(JSON.stringify(this.commonService.nsTransactionInstance));
    console.log("this.commonservice.sessionTiming from instance=========>", this.commonService.nsUserSession);
    this.commonService.isFromTransactionInstance = true;
  }
  this.nsCommonData.currRowData = rowData;
  this.nsCommonData.objectType = '2';

  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_INSTANCE;
  this._router.navigate(['/home/ddr/nsreports/userSession'])
}
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.subscribeTransaction.unsubscribe();
  this.commonService.isFilterFromNSSideBar=false;
  this.commonService.isFromTransactionSession=false;
  this.commonService.isFromTransactionSummary=false;
  this.commonService.isFromTransactionFailure=false;
  this.nsCommonData.transactionInstancethroughsuccess = false;
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



export interface TransactionInstanceDataInterface {
  TransactionName: string;
  scriptName: string;
  sessionCount: string;
  location: string;
  access: string;
  browser: string;
  userId: string;
  sessionId: string;
  txInstance: string;
  userInst: string;
  childIndex: string;
  startTime: string;
  absoluteStartTime: string;
  responseTime: string;
  statusName: string;
}

