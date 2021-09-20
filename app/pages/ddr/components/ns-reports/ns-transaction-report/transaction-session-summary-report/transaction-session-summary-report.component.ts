import { Component, OnInit, Input  } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { SelectItem } from '../../../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { Router,Params } from '@angular/router';
import { CavConfigService } from "../../../../../../main/services/cav-config.service";
import { DdrDataModelService } from "../../../../../../main/services/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'transaction-session-summary-report',
    templateUrl: 'transaction-session-summary-report.component.html',
    styleUrls: ['transaction-session-summary-report.component.scss']
})

export class TransactionSessionSummaryReportComponent {
 
  TransactionSessionSummaryData:Array<TransactionSessionSummaryDataInterface>;
  urlParam: any;
  url:any;
  columnOptions: SelectItem[];
  id : any;
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
  tabName : any ;
  value: number = 1;
  visibleCols: any[];
  prevColumn;
  screenHeight: any;
  toggleFilterTitle = '';
  isEnabledColumnFilter = true;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
 
  ngOnInit() {
    this.commonService.isToLoadSideBar = false ;
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.id = this.commonService.getData();
    this.urlParam = this.commonService.getData();
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    this.commonService.currentReport="Transaction Session Summary";
    this.randomNumber();
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsTransactionSessionSummary==>",this.commonService.nsTransactionSummary); 
	//  console.log("this._ddrData.filtermodefailure>>>>ff",this._ddrData.filtermode);
    console.log("this.urlParam >>>>>>>>>"+this.urlParam );
    this.fillNSTransactionData();
    
  }
  constructor(public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
    private nsCommonData: NsCommonService,
    private ddrData:DdrDataModelService,
    private ddrRequest:DDRRequestService) {

  }

  fillNSTransactionData(){
      try {
        this.getTransactionSessionSummaryData();
        this.getTransactionSessionSummaryCount();
        this.setTestRunInHeader();
	//console.log("this._ddrData.filtermodefailure>>>>ffillllllllllll",this._ddrData.filtermode);
      this.cols = [
        { field: 'TransactionName', header: 'Transaction Name',  sortable: 'true',action: true, align: 'left', color: 'black', width: '120'},
        { field: 'scriptname', header: 'Script Name', sortable:'true', action: true, align: 'left', color: 'black', width: '75'},
        { field: 'tried', header: 'Tried', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'success', header: 'Success', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'StatusType', header: 'Status',  sortable: 'true',action: true, align: 'left', color: 'black', width: '75'},
        { field: 'fail', header: 'Fail', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'failPercent', header: '%Fail',  sortable: 'true',action: true, align: 'right', color: 'black', width: '75'},
        { field: 'min', header: 'Min', sortable:'custom', action: true,align: 'right', color: 'black', width: '75'},
        { field: 'average', header: 'Average', sortable:'custom', action: true,align: 'right', color: 'black', width: '95'},
        { field: 'max', header: 'Max', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'median', header: 'Median', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'eighty', header: '80%', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'ninety', header: '90%', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'ninetyFive', header: '95%', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
        { field: 'ninetyNine', header: '99%', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'}


      ];

      this.visibleCols = [
        'TransactionName','scriptname','tried','success','StatusType','fail','failPercent','min','average','max','median','eighty','ninety','ninetyFive','ninetyNine'
      ];
      if (this._ddrData.filtermode.toLowerCase() == 'success'){
        this.cols.splice(4,3);
        this.visibleCols.splice(4,3);
      }
      else if(this._ddrData.filtermode.toLowerCase() == 'failure'){
        this.cols.splice(3,2);
        this.visibleCols.splice(3,2);
      }
      else if(this.nsCommonData.summaryByStatusFlag === false)
      {
        this.cols.splice(4,1);
        this.visibleCols.splice(4,1);
      }else{
        this.cols.splice(2,2);
        this.visibleCols.splice(2,2);
        //console.log("this.cols***--------",this.cols, "this.visibleCols*********--",this.visibleCols);
        this.cols.splice(3,2);
        this.visibleCols.splice(3,2);
        //console.log("this.cols***--------",this.cols, "this.visibleCols*********--",this.visibleCols);

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



  getTransactionSessionSummaryData(){
    try{
      let dataurl = '';
      let ajaxParam='';
      if(this.commonService.enableQueryCaching == 1){
        this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;         
      }
      else{
        this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?testRun=' + this.urlParam.testRun; 
      }
      ajaxParam += '&strStartTime=' + this.trStartTime +
      '&strEndTime=' + this.trEndTime +
      '&transactionName=' + this.nsCommonData.transactionName +
      '&transidx=' + this.nsCommonData.transactionIndex +
      '&object=2&fields=4095&reportType=summary';
      if(this.nsCommonData.summaryByStatusFlag===true){
        ajaxParam +='&group=session,status'+
             '&statusCode='+this.nsCommonData.statuscode;
      }else {
        ajaxParam +='&group=session'+'&statusCode=-2';
            }

      if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        ajaxParam += '&groupName=' +this._ddrData.vectorName;
      if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        ajaxParam += '&generatorName=' +this._ddrData.generatorName;  

      if (this.commonService.isFromTransactionSummary) {
        if (this.nsCommonData.summaryByStatusFlag === true) {
          this.commonService.nsTRansactionSessionSummary['group'] = ['session', 'status'];
          //this.commonService.nsTRansactionSessionSummary ['statusCode']=this.nsCommonData.statuscode;
        } else {
          this.commonService.nsTRansactionSessionSummary['group'] = ['session'];
        }
        console.log(" inside the session data from other report cond===>", this.commonService.nsTRansactionSessionSummary);
        ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsTRansactionSessionSummary, true);
      
        //setting value to key
        this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsTRansactionSessionSummary;
        console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);

      }
      else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
        this.commonService.isFromTransactionSummary=true;
        console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
        ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
      }

  this.url+=ajaxParam;

  dataurl =this.url+ '&limit=' + this.txLimit + '&offset=' + this.txOffset + '&showCount=false' + '&queryId='+this.queryId ;
      console.log('Final URL for build>>>>>>>>>', dataurl);
      setTimeout(() => {
        this.openpopup();
       }, this._ddrData.guiCancelationTimeOut);
      this.ddrRequest.getDataUsingGet(dataurl).subscribe(data => (this.assignTransactionSessionSummaryData(data)));
      }
      catch(error)
          {
            console.log('error in getting data from rest call', error);
          }
  }
  assignTransactionSessionSummaryData(res: any){
    try {
      this.isCancelQuerydata = true;
      if (res === null || res === undefined) {
        return;
      }
      setTimeout(() => {
        this.loader = false;
      }, 2000);
      this.value = 1;
      this.loading = false;
      this.ajaxLoader = false;
     
      this.TransactionSessionSummaryData = res.data;
      this.showfilterCriteria(res.startTime, res.endTime);

    }
  catch(error){
  }
}
getTransactionSessionSummaryCount(){
  try{
  let counturl = '';
      counturl = this.url + '&showCount=true';
  console.log('Final URL for build>>>>>>>>>', counturl);

  this.ddrRequest.getDataUsingGet(counturl).subscribe(data => (this.assignTransactionSessionSummaryCount(data)));
  }
  catch(error)
      {
        console.log('error in getting data from rest call', error);
      }
}

assignTransactionSessionSummaryCount(res: any){
console.log("res>>>>>>>>>>>>>"+JSON.stringify(res));
        this.txTotalCount = res.totalCount;
        if(this.txLimit > this.txTotalCount)
          this.txLimit = Number(this.txTotalCount);
}


openSessionName(rowData: any)
 {
 let url= this.getHostUrl() + '/' + this.urlParam.product + 
 '/recorder/recorder.jsp?openFrom=TR'+this.urlParam.testRun + 
 '&scriptName='+rowData + '&sesLoginName=' +sessionStorage.getItem('sesLoginName');
 console.log('JNLP Launcher url ',url);

 window.open(url, "_blank");
 }

openInstanceReport(rowData: any,success?) {    
console.log("rowData>>>>>>>-------"+JSON.stringify(rowData));
  if (this.commonService.isFromTransactionSummary) {
    console.log("transaction summary going out==>");
    this.commonService.nsTransactionInstance = JSON.parse(JSON.stringify(this.commonService.nsTRansactionSessionSummary));
    this.commonService.nsTransactionInstance['reportType']='instance';
    delete this.commonService.nsTransactionInstance['fields'];
     if(this.commonService.nsTransactionInstance['group'] && this.commonService.nsTransactionInstance['order'])
    this.commonService.nsTransactionInstance=this.commonService.filterGroupOrder(this.commonService.nsTransactionInstance);
    else
    delete this.commonService.nsTransactionInstance['group']; 
    if (!this.commonService.nsTransactionInstance['script']) {
      this.commonService.nsTransactionInstance['script'] = rowData.scriptname;
    }
    let param = this.commonService.nsTransactionInstance;          //param holds ref of txnInstance obj.
    
    if (!param['transactionName']) {
      param['transactionName'] = rowData.TransactionName;
      //param['transidx'] = rowData.transactionindex;
    }
    this.commonService.isFromTransactionSession = true;
    console.log("this.commonservice.nsTransactionInstance==>", this.commonService.nsTransactionInstance);
    }
  this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Transaction Instance');

  this._ddrData.summaryToInstanceFlag = "true";
  this.nsCommonData.sessionSummaryFlag = true;
  this.nsCommonData.scriptname= rowData.scriptname;
  this.nsCommonData.transactionName = rowData.TransactionName;  
  this.nsCommonData.transactionIndex = rowData.transactionindex;
  this.nsCommonData.transactionInstancethroughsuccess = success;
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SESSION_SUMMARY;
  this._router.navigate(['/home/ddr/nsreports/TransactionInstance']);
 
  
}

openDetailsReport(rowData: any){
  console.log("rowData>>>>>>>-------"+JSON.stringify(rowData));
if(this.commonService.isFromTransactionSummary)
{
  console.log("his.commonService.nsTRansactionSessionSummary=====>",this.commonService.nsTRansactionSessionSummary);
  if(!this.commonService.nsTRansactionSessionSummary['script'])
  {
    this.commonService.nsTRansactionSessionSummary['script']= rowData.scriptname;
  }
  this.commonService.nsTRansactionSessionSummary['transactionName']=rowData.TransactionName;
  delete this.commonService.nsTRansactionSessionSummary['transidx'];
  this.commonService.nsTransactionDetails=JSON.parse(JSON.stringify(this.commonService.nsTRansactionSessionSummary));
  this.commonService.isFromTransactionSession=true;
}
  this.nsCommonData.sessionSummaryFlag = true;
  this.nsCommonData.scriptname= rowData.scriptname;
  this.nsCommonData.averagetime = rowData.average;
  this.nsCommonData.statuscode =rowData.status;
  this.nsCommonData.transactionName = rowData.TransactionName;  
  this.nsCommonData.transactionIndex = rowData.transactionindex;
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SESSION_SUMMARY;
  this._router.navigate(['/home/ddr/nsreports/TransactionDetails']);
}

openFailureReport(rowData: any) {
  if(this.commonService.isFromTransactionSummary)
  {
    console.log("transaction summary going out==>");
    this.commonService.nsTransactionFailure=JSON.parse(JSON.stringify(this.commonService.nsTRansactionSessionSummary));
    if (this.commonService.nsTransactionFailure['transidx']) {
      this.commonService.nsTransactionFailure['object_id'] = this.commonService.nsTransactionFailure['transidx'];
      delete this.commonService.nsTransactionFailure['transidx'];
    }
    delete this.commonService.nsTransactionFailure['scriptidx'];
    this.commonService.nsTransactionFailure['reportType']='failure';
    if(this.commonService.nsTransactionFailure['statusCode']==-2 ||this.commonService.nsTransactionFailure['statusCode']==-0)
    {
      this.commonService.nsTransactionFailure['statusCode']=-1;
    }
    delete this.commonService.nsTransactionFailure['location'];
    delete this.commonService.nsTransactionFailure['access'];
    delete this.commonService.nsTransactionFailure['browser'];
    delete this.commonService.nsTransactionFailure['fields'];
    delete this.commonService.nsTransactionFailure['group'];
    delete this.commonService.nsTransactionFailure['order'];
    let param=this.commonService.nsTransactionFailure;
        
     if (!param['transactionName']) {
      param['transactionName'] = rowData.TransactionName;

    }
    this.commonService.isFromTransactionSession = true;
    console.log("this.commonservice.nsTransactionFailure==>", this.commonService.nsTransactionFailure);
  }
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Transaction Failure');

    this.nsCommonData.sessionSummaryFlag = true;
    this.nsCommonData.scriptname= rowData.scriptname;
    this.nsCommonData.transactionName = rowData.TransactionName;  
    this.nsCommonData.transactionIndex = rowData.transactionindex;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SESSION_SUMMARY;
    this._router.navigate(['/home/ddr/nsreports/TransactionFailurereport']);
    
  
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
    this.strTitle = 'Netstorm - Transaction Session Summary Report - Test Run : ' + this.urlParam.testRun;
  }
  else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
    this.strTitle = 'NetCloud - Transaction Session Summary Report - Test Run : ' + this.urlParam.testRun;
   else {
    this.strTitle = 'Netdiagnostics Enterprise - Transaction Session Summary Report - Session : ' + this.urlParam.testRun;
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
  this.getTransactionSessionSummaryData();
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

/** Show Hide Column For NS Summary*/
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

/**  CustomSorting for NS Summary */
CustomsortOnColumns(event, tempData) {

  //for interger type data type
if (event["field"] == "startTime") {
 if (event.order == -1) {
   var temp = (event["field"]);
   event.order = 1
   tempData = tempData.sort(function (a, b) {
     var value = Date.parse(a[temp]);
     var value2 = Date.parse(b[temp]);
     return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
   });
 }
 else {
   var temp = (event["field"]);
   event.order = -1;
   //asecding order
   tempData = tempData.sort(function (a, b) {
     var value = Date.parse(a[temp]);
     var value2 = Date.parse(b[temp]);
     return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
   });
 }
}
else {
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
this.TransactionSessionSummaryData = [];
//console.log(JSON.stringify(tempData));
if (tempData) {
  tempData.map((rowdata) => { this.TransactionSessionSummaryData = this.Immutablepush(this.TransactionSessionSummaryData, rowdata) });
}

}
Immutablepush(arr, newEntry) {
return [...arr, newEntry]
}


/**  FilterCritera for NS Summary */
showfilterCriteria(startTime: any, endTime: any) {
  if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
  this.filterCriteria += "DC=" + this.ddrData.dcName;
  }
  if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
    this.filterCriteria = ', From=' + startTime;
  }
  if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
    this.filterCriteria += ', To=' + endTime;
  }
  if(this._ddrData.generatorName )
  this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
  
  if(this._ddrData.vectorName  && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1 )
  this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;
  
  if (this.nsCommonData.transactionName !== 'NA' && this.nsCommonData.transactionName !== '' && this.nsCommonData.transactionName !== undefined) {
    this.filterCriteria += ', Transaction=' + this.nsCommonData.transactionName;
  }
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

/** Download report for Session Summary  */
downloadReports(reports: string) {
  
  let downloadSessionsummaryInfo =JSON.parse(JSON.stringify(this.TransactionSessionSummaryData));  
  let renameArray;
  let colOrder;
  
  if(this.nsCommonData.summaryByStatusFlag === false){
   renameArray = {'TransactionName': 'Transaction Name', 'scriptname': 'Script Name', 'tried': 'Tried','success': 'Success', 'fail': 'Fail','failPercent': '%Fail' ,'min': 'Min','average': 'Average','max': 'Max','median': 'Median','eighty': '80%','ninety': '90%','ninetyFive': '95%','ninetyNine': '99%'}
 
  colOrder = ['Transaction Name','Script Name','Tried','Success','Fail','%Fail','Min','Max','Average','Median','80%','90%','95%','99%'];


 console.log("TransactionSessionSummaryData=========== ", JSON.stringify(downloadSessionsummaryInfo));
	downloadSessionsummaryInfo.forEach((val, index) => {
		delete val['transactionindex'];
		delete val['sessionCount'];
		delete val['status']; 
		delete val['Count'];
      		delete val['StatusType'];
		delete val['generatorName'];	
      val['min']= this.msToTimeFormate(val['min']);
      val['max']= this.msToTimeFormate(val['max']);
      val['average']= this.msToTimeFormate(val['average']);
      val['median']= this.msToTimeFormate(val['median']);
      val['eighty']= this.msToTimeFormate(val['eighty']);
      val['ninety']= this.msToTimeFormate(val['ninety']);
      val['ninetyFive']= this.msToTimeFormate(val['ninetyFive']);
      val['ninetyNine']= this.msToTimeFormate(val['ninetyNine']); 
          });
		}else{
		  renameArray = {'TransactionName': 'Transaction Name','scriptname': 'Script Name', 'StatusType': 'Status', 'min': 'Min','average': 'Average','max': 'Max','median': 'Median','eighty': '80%','ninety': '90%','ninetyFive': '95%','ninetyNine': '99%'}
        
      colOrder = ['Transaction Name','Script Name','Status','Min','Max','Average','Median','80%','90%','95%','99%'];


      downloadSessionsummaryInfo.forEach((val, index) => {
          delete val['transactionindex'];
          delete val['sessionCount'];
          delete val['Count'];
          delete val['tried'];
          delete val['success']; 
          delete val['fail'];
          delete val['failPercent'];
          delete val['status'];
	  delete val['generatorName'];
      //console.log("TransactionSessionSummaryData=========== ", JSON.stringify(downloadSessionsummaryInfo));
          
          val['min']= this.msToTimeFormate(val['min']);
          val['max']= this.msToTimeFormate(val['max']);
          val['average']= this.msToTimeFormate(val['average']);
          val['median']= this.msToTimeFormate(val['median']);
          val['eighty']= this.msToTimeFormate(val['eighty']);
          val['ninety']= this.msToTimeFormate(val['ninety']);
          val['ninetyFive']= this.msToTimeFormate(val['ninetyFive']);
          val['ninetyNine']= this.msToTimeFormate(val['ninetyNine']);
          
              });
			}
		    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'TransactionSessionSummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(downloadSessionsummaryInfo)
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
  
  ngOnDestroy()
  {
    this.commonService.isFromTransactionSummary=false;
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


export interface TransactionSessionSummaryDataInterface {
  TransactionName: string;
  transactionindex: string;
  sessionCount: string;
  tried: string;
  success: string;
  fail: string;
  failPercent: string;
  min: string;
  average: string;
  max: string;
  median: string;
  eighty: string;
  ninety: string;
  ninetyFive: string;
  ninetyNine: string;

}
