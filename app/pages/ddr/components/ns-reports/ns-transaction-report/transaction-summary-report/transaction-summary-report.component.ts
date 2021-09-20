import { Component, OnInit, Input  } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, MultiSelectModule,Message } from 'primeng/primeng';
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
import {Subscription} from 'rxjs/Subscription'
import { DDRRequestService } from '../../../../services/ddr-request.service';
import {MessageService} from 'primeng/components/common/messageservice';
@Component({
    selector: 'transaction-summary-report',
    templateUrl: 'transaction-summary-report.component.html',
    styleUrls: ['transaction-summary-report.component.scss']
})

export class TransactionSummaryReportComponent {
  @Input() summarybystatusReport:boolean;
  TransactionSummaryData:Array<TransactionSummaryDataInterface>;
  urlParam: any;
  url: any;
  screenHeight: any;
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
  toggleFilterTitle = '';
  isEnabledColumnFilter = true;
  subscribeTransaction:Subscription;
  filterCriteriaUrl: any='';
  completeUrl: any='';
  filterStatus: string='';
  statusHint: string='';
  colOrder: string[];
  renameArray: any;
  msgs: Message[] = [];
  width:number;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  ngOnInit() {
   
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight)-100;   
    this.urlParam = this.commonService.getData();
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    console.log("this.urlParam >>>>>>>>>"+JSON.stringify(this.urlParam ));
    this.commonService.currentReport= "Transaction Summary";
    this.commonService.isToLoadSideBar=true;
    this.randomNumber();
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsTransactionSummary==>",this.commonService.nsTransactionSummary); 
    this.subscribeTransaction=this.commonService.sideBarUIObservable$.subscribe((temp)=>{
      if(this.commonService.currentReport=="Transaction Summary")
     { this.loading = true;
       this.txLimit=50;
       this.txOffset=0;
       this.fillNSTransactionData();
     } 
    })
    this._ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessage(mssg)})
    this.fillNSTransactionData();
    this.changeTabHeader();
   
  }
  constructor(public commonService: CommonServices,private nsCommonData : NsCommonService,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
    private ddrData :DdrDataModelService,
    private ddrRequest:DDRRequestService) {

  }

  fillNSTransactionData(){
    try {
      console.log("this._ddrData.success>>>>fill",this._ddrData.filtermode);
      this.getTransactionSummaryData();
      this.getTransactionSummaryCount();
      this.setTestRunInHeader();
      this.cols = [
        { field: 'TransactionName', header: 'Transaction Name', sortable: 'true', action: true, align: 'left', color: 'black', width: '120' },

        //  { field: 'Count', header: 'Count',  sortable: 'custom',action: true, align: 'right', color: 'black', width: '75'},
        // { field: 'tried', header: 'Tried', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        // { field: 'success', header: 'Success', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        // { field: 'fail', header: 'Fail', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        // { field: 'failPercent', header: '%Fail', sortable: 'true', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'min', header: 'Min', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'average', header: 'Average', sortable: 'custom', action: true, align: 'right', color: 'black', width: '95' },
        { field: 'max', header: 'Max', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'median', header: 'Median', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'eighty', header: '80%', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'ninety', header: '90%', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'ninetyFive', header: '95%', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' },
        { field: 'ninetyNine', header: '99%', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' }
      ];
      this.visibleCols = [
        'TransactionName','min', 'average', 'max', 'median', 'eighty', 'ninety', 'ninetyFive', 'ninetyNine'
      ];

      this.renameArray = {
        'TransactionName': 'Transaction Name', 'min': 'Min', 'average': 'Average', 'max': 'Max'
        , 'median': 'Median', 'eighty': '80%', 'ninety': '90%', 'ninetyFive': '95%', 'ninetyNine': '99%'
      }

      this.colOrder = ['Transaction Name','Min', 'Max', 'Average', 'Median', '80%', '90%', '95%', '99%'];
      if (this.commonService.nsTransactionSummary['group'] && (this.commonService.nsTransactionSummary['group'].indexOf('generator') != -1 || this.commonService.nsTransactionSummary['group'].indexOf('session') != -1)) {

        if (this.commonService.nsTransactionSummary['group'] && this.commonService.nsTransactionSummary['group'].indexOf('session') != -1) {
          this.cols.push({ field: 'scriptname', header: 'Script Name', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
          this.visibleCols.push('scriptname');
          this.colOrder.push("Script Name");
          this.renameArray['scriptname'] = 'Script Name';
        }

        if (this.commonService.nsTransactionSummary['group'] && this.commonService.nsTransactionSummary['group'].indexOf('generator') != -1) {

          this.cols.push({ field: 'generatorName', header: 'Generator Name', sortable: 'true', action: true, align: 'left', color: 'black', width: '75' })
          this.visibleCols.push('generatorName');
          this.colOrder.push("Generator Name");
          this.renameArray['generatorName'] = 'Generator Name';
        }
      }
      else {
        this.cols.push({ field: 'sessionCount', header: 'Script Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.visibleCols.push('sessionCount');
        this.colOrder.push("Script Count");
        this.renameArray['sessionCount'] = 'Script Count';
      }

      if (this.commonService.nsTransactionSummary['group'] && this.commonService.nsTransactionSummary['group'].indexOf('status') != -1) {
        this.cols.push({ field: 'StatusType', header: 'Status', sortable: 'true', action: true, align: 'left', color: 'black', width: '75' })
        this.visibleCols.push('StatusType');
        this.colOrder.push("Status");
        this.renameArray['StatusType'] = 'Status';
      }
      else if (this._ddrData.filtermode.toLowerCase() == "success"){
        console.log("this._ddrData.success>>>>ss",this._ddrData.filtermode);
        this.cols.splice(1,0,{ field: 'tried', header: 'Tried', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.cols.splice(2,0,{ field: 'success', header: 'Success', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.visibleCols.push('tried', 'success');
        this.colOrder.splice(1,0,'Tried');
        this.colOrder.splice(2,0,'Success');
        this.renameArray['tried'] = 'Tried';
        this.renameArray['success'] = 'Success';
      }
      else if (this._ddrData.filtermode.toLowerCase() == "failure"){
        console.log("this._ddrData.filtermodefailure>>>>ff",this._ddrData.filtermode);
        this.cols.splice(1,0,{ field: 'tried', header: 'Tried', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.cols.splice(2,0,{ field: 'fail', header: 'Fail', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.cols.splice(11,0,{ field: 'failPercent', header: '%Fail', sortable: 'true', action: true, align: 'right', color: 'black', width: '75' })
        this.visibleCols.push('Tried','fail','failPercent');
        this.colOrder.splice(1,0,'Tried');
        this.colOrder.splice(2,0,'Fail');
        this.colOrder.push('%Fail');
        this.renameArray['tried'] = 'Tried';
        this.renameArray['fail'] = 'Fail';
        this.renameArray['failPercent'] = '%Fail';
      }
    else {
        this.cols.splice(1,0,{ field: 'tried', header: 'Tried', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.cols.splice(2,0,{ field: 'success', header: 'Success', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.cols.splice(3,0,{ field: 'fail', header: 'Fail', sortable: 'custom', action: true, align: 'right', color: 'black', width: '75' })
        this.cols.splice(12,0,{ field: 'failPercent', header: '%Fail', sortable: 'true', action: true, align: 'right', color: 'black', width: '75' })
        this.visibleCols.push('tried', 'success', 'fail', 'failPercent');
        this.colOrder.splice(1,0,'Tried');
        this.colOrder.splice(2,0,'Success');
        this.colOrder.splice(3,0,'Fail');
        this.colOrder.push('%Fail');
        this.renameArray['tried'] = 'Tried';
        this.renameArray['success'] = 'Success';
        this.renameArray['fail'] = 'Fail';
        this.renameArray['failPercent'] = '%Fail';
      }
      console.log("this.visibleCols--", this.visibleCols);
      console.log("this.cols ---", this.cols);
      this.columnOptions = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
      console.log('column options', this.columnOptions);
    } catch (error) {
      console.log('error in intialization compaonent --> ', error);
    }
  }

  getTransactionSummaryData(){
    try{
      let dataurl = '';
      let ajaxParam='';
      if(this.commonService.enableQueryCaching == 1){
        this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?testRun=' + this.ddrData.testRun;
      }
      console.log("this.commonService.isFilterFromNSSideBar===> 1",this.commonService.isFilterFromNSSideBar , "this.commonService.nsTransactionSummary==> 1",this.commonService.nsTransactionSummary)
      if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsTransactionSummary).length!=0) {
      console.log("this.commonService.isFilterFromNSSideBar===>",this.commonService.isFilterFromNSSideBar);
      //if(!this.commonService.isFromBreadCrumb) 
      this.commonService.isCQM=true;              // on applying filter this is set true;
        if (this.summarybystatusReport)
            {
              let group=[]
              group=this.commonService.nsTransactionSummary['group']
              if( group[0]=='' || group[0]==undefined)
              { 
                group[0]='status';
              }
              this.commonService.nsTransactionSummary['group']=group;
            }
        ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsTransactionSummary);
        // for FIlter CQM case    so that will update value in key pair.
        this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsTransactionSummary;
      }
      else
      {
      ajaxParam='&strStartTime=' + this.trStartTime +
      '&strEndTime=' + this.trEndTime +
      '&object=2&fields=4095&reportType=summary';
      if(this._ddrData.filtermode.toLowerCase() == "success"){
        ajaxParam += '&statusCode=0';
      }
      else if(this._ddrData.filtermode.toLowerCase() == "failure"){
        ajaxParam += '&statusCode=-1';
      }
      else {
        ajaxParam += '&statusCode=-2'
      }

       if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
	      ajaxParam += '&groupName=' +this._ddrData.vectorName;
       if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        ajaxParam += '&generatorName=' +this._ddrData.generatorName;
       if(this._ddrData.transactionName)
       ajaxParam += '&transactionName=' + this._ddrData.transactionName;
      
      if (this.summarybystatusReport=== true){
        ajaxParam +='&group=status';
      }
      if (this._ddrData.nsErrorName){
        ajaxParam +='&nsErrorName=' + this._ddrData.nsErrorName ;
      }
      

     // this.commonService.nsTransactionSummary=this.commonService.makeObjectFromUrlParam(ajaxParam);
      console.log("this.commonService.nsTransactionSummary===>",this.commonService.nsTransactionSummary); 
    }
      console.log("this.commonService.isCQM====>",this.commonService.isCQM);
    
      if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
      console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport]);
      this.commonService.isCQM=true;              // on applying filter this is set true;
      ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
    }
      this.commonService.nsTransactionSummary=this.commonService.makeObjectFromUrlParam(ajaxParam);
      this.url+=ajaxParam;
      console.log("'&limit=' + this.txLimit========>",this.txLimit);
      dataurl =this.url+'&limit=' + this.txLimit + '&offset=' + this.txOffset + '&showCount=false' + '&queryId='+this.queryId;
      console.log('Final URL for build>>>>>>>>>', dataurl);
      setTimeout(() => {
        this.openpopup();
       }, this._ddrData.guiCancelationTimeOut);

      this.ddrRequest.getDataUsingGet(dataurl).subscribe(data => (this.assignTransactionSummaryData(data)),
  error => {
        this.loading = false;
        }
);
      }
      catch(error)
          {
            console.log('error in getting data from rest call', error);
          }
  }
  assignTransactionSummaryData(res: any){
    this.isCancelQuerydata = true;
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
     
      this.TransactionSummaryData = res.data;
      this.showfilterCriteria(res.startTime, res.endTime);
      this.commonService.customTimePlaceHolder=[];
      this.commonService.customTimePlaceHolder.push(res.startTime, res.endTime);
      
    }
  catch(error){
  }
}
getTransactionSummaryCount(){
  try{
  let counturl = '';

  counturl =this.url+ '&showCount=true';
  console.log('Final URL for build>>>>>>>>>', counturl);

  this.ddrRequest.getDataUsingGet(counturl).subscribe(data => (this.assignTransactionSummaryCount(data)));
  }
  catch(error)
      {
        console.log('error in getting data from rest call', error);
      }
}

assignTransactionSummaryCount(res: any){
console.log("res>>>>>>>>>>>>>"+JSON.stringify(res));
        this.txTotalCount = res.totalCount;
        if(this.txLimit > this.txTotalCount)
          this.txLimit = Number(this.txTotalCount);
}

changeTabHeader(){
  if(this.summarybystatusReport===false)
  this.tabName = "Transaction Summary";
  else
  this.tabName = "Transaction Summary By Status";
}

opensessionCountReport(rowData: any){
  this.ddrData.nsCQMFilter["Transaction Session Summary"]=undefined;
  if(this.commonService.isCQM)
{
  console.log("transaction summary going out==>");
  this.commonService.nsTRansactionSessionSummary=JSON.parse(JSON.stringify(this.commonService.nsTransactionSummary));
  let param=this.commonService.nsTRansactionSessionSummary;
  if (!param['transactionName']) {
    param['transactionName'] = rowData.TransactionName;
    param['transidx'] = rowData.transactionindex;
  }
  if(rowData['status'] && rowData['StatusType'] && rowData['status']!='-' && rowData['StatusType']!='-')
  {
    this.commonService.nsTRansactionSessionSummary['statusCode']=rowData['status']; // cond for when user has selected group by status.
  }
this.commonService.isFromTransactionSummary=true;
console.log("this.commonservice.nsTransactionSessionSummary==>",this.commonService.nsTRansactionSessionSummary);
}
this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Transaction Session Summary'); //so that current report and the next report object will be made.
  this.nsCommonData.transactionName = rowData.TransactionName;  
  this.nsCommonData.transactionIndex = rowData.transactionindex;
  this.nsCommonData.summaryByStatusFlag = false;
  if(this.summarybystatusReport === true){
    this.nsCommonData.summaryByStatusFlag = true;
    this.nsCommonData.statuscode = rowData.status;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMAY_STATUS;
  }else
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMARY;
  this._router.navigate(['/home/ddr/nsreports/TransactionSessionSummary']);
 
}

openInstanceReport(rowData: any,status?) {    

  console.log("rowData>>>>>>>-------"+JSON.stringify(rowData));
  this.ddrData.nsCQMFilter["Transaction Instance"]=undefined;
  if(this.commonService.isCQM)
  {
    console.log("transaction summary going out==>");
    this.commonService.nsTransactionInstance=JSON.parse(JSON.stringify(this.commonService.nsTransactionSummary));
    let param=this.commonService.nsTransactionInstance;          //param holds ref of txnInstance obj.
     if(this.commonService.nsTransactionInstance['group'] && this.commonService.nsTransactionInstance['order'])
    this.commonService.nsTransactionInstance=this.commonService.filterGroupOrder(this.commonService.nsTransactionInstance);
    else
    delete this.commonService.nsTransactionInstance['group'];
    this.commonService.nsTransactionInstance['reportType']='instance';
    delete this.commonService.nsTransactionInstance['fields'];
    delete this.commonService.nsTransactionInstance['object_id'];
    if (!param['transactionName']) {
      param['transactionName'] = rowData.TransactionName;
      param['transidx'] = rowData.transactionindex;
    }
    if(status)            //true in case of all success on row click
    this.commonService.nsTransactionInstance['statusCode']='0';
    this.commonService.isFromTransactionSummary=true;

    if(rowData['status'] && rowData['StatusType'] && rowData['status'] && rowData['StatusType'] && rowData['status']!='-' && rowData['StatusType']!='-')
    {
      this.commonService.nsTRansactionSessionSummary['statusCode']=rowData['status']; // cond for when user has selected group by status.
    }
    console.log("this.commonservice.nsTransactionInstance==>",this.commonService.nsTransactionInstance);
    console.log("going to call auto fill**********************");
  }
  this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Transaction Instance');

  this._ddrData.summaryToInstanceFlag = "true";
  this.nsCommonData.summaryToInstanceFlag = true;

  this.nsCommonData.transactionName = rowData.TransactionName;  
  this.nsCommonData.transactionIndex = rowData.transactionindex;
  this.nsCommonData.failureToInstanceFlag = false;
  this.nsCommonData.transactionInstancethroughsuccess = status;
  if(this.summarybystatusReport === true)
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMAY_STATUS;
else
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMARY;
  this._router.navigate(['/home/ddr/nsreports/TransactionInstance']);
 
  
}

openDetailsReport(rowData: any){
  if(this.commonService.isCQM)
  {
    console.log("transaction summary going out==>");
    this.commonService.nsTransactionDetails=JSON.parse(JSON.stringify(this.commonService.nsTransactionSummary));
    delete this.commonService.nsTransactionDetails['transidx'];     //details doesnt support transaction id.
    let param=this.commonService.nsTransactionDetails;
    if (!param['transactionName']) {
      param['transactionName'] = rowData.TransactionName;
     
    }
  this.commonService.isFromTransactionSummary=true;
    console.log("this.commonservice.nsTransactionDetails==>",this.commonService.nsTransactionDetails);
  
  }
  this.nsCommonData.sessionSummaryFlag =false;
  this.nsCommonData.averagetime = rowData.average;
  this.nsCommonData.transactionName = rowData.TransactionName;  
  this.nsCommonData.transactionIndex = rowData.transactionindex;
if(this.summarybystatusReport === true)
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMAY_STATUS;
else
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMARY;
  this._router.navigate(['/home/ddr/nsreports/TransactionDetails']);
}

openFailureReport(rowData: any) {

  if(this.commonService.isCQM)
  {
    console.log("transaction summary going out==>");
    this.commonService.nsTransactionFailure=JSON.parse(JSON.stringify(this.commonService.nsTransactionSummary));
    if (this.commonService.nsTransactionFailure['transidx']) {
      this.commonService.nsTransactionFailure['object_id'] = this.commonService.nsTransactionFailure['transidx'];
      delete this.commonService.nsTransactionFailure['transidx'];
    }
    delete this.commonService.nsTransactionFailure['scriptname'];
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
  this.commonService.isFromTransactionSummary=true;
  console.log("this.commonservice.nsTransactionFailure==>",this.commonService.nsTransactionFailure);
}
  this.commonService.nsAutoFillSideBar(this.commonService.currentReport, 'Transaction Failure'); //making object of failure so that from failure when we open instance we will be gtting object bro.
  this.nsCommonData.sessionSummaryFlag = false;
  this.nsCommonData.currRowData = rowData;
  this.nsCommonData.transactionName = rowData.TransactionName;
  this.nsCommonData.transactionIndex = rowData.transactionindex;
  if (this.summarybystatusReport === true)
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMAY_STATUS;
  else
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMARY;

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
    if(this.summarybystatusReport === true)
    this.strTitle = 'Netstorm - Transaction Summary By Status Report - Test Run : ' + this.ddrData.testRun;
    else
    this.strTitle = 'Netstorm - Transaction Summary Report - Test Run : ' + this.urlParam.testRun;
  }
  else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud'){
    if(this.summarybystatusReport === true)
    this.strTitle = 'NetCloud - Transaction Summary By Status Report - Test Run : ' + this.urlParam.testRun;
    else
    this.strTitle = 'NetCloud - Transaction Summary Report - Test Run : ' + this.urlParam.testRun;
  }
   else {
    if(this.summarybystatusReport === true)
    this.strTitle = 'Netdiagnostics Enterprise - Transaction Summary By Status Report - Session : ' + this.urlParam.testRun;
    else
    this.strTitle = 'Netdiagnostics Enterprise - Transaction Summary Report - Session : ' + this.urlParam.testRun;
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
  this.commonService.isFilterFromNSSideBar = true  
  this.getTransactionSummaryData();
  
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
   let n=this.visibleCols.length;
   this.width=1240/n;
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
this.TransactionSummaryData = [];
//console.log(JSON.stringify(tempData));
if (tempData) {
  tempData.map((rowdata) => { this.TransactionSummaryData = this.Immutablepush(this.TransactionSummaryData, rowdata) });
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


/**  FilterCritera for NS Summary */
showfilterCriteria(startTime: any, endTime: any) {
  this.filterCriteria='';
  this.statusHint='';
  this.filterStatus='';
  let transactionSummary=this.commonService.nsTransactionSummary;
  if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
  this.filterCriteria += "DC=" + this.ddrData.dcName;
  }
  if(!this.commonService.isValidParamInObj(transactionSummary, 'phaseName'))
  {
  if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
    this.filterCriteria += ', From=' + startTime;
  }
  if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
    this.filterCriteria += ', To=' + endTime;
  }
  }
  if(this._ddrData.generatorName )
        this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
        
  if(this._ddrData.vectorName  && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1 )
        this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;
  // if(this._ddrData.groupName=="Transaction Stats" &&this._ddrData.vectorName!='undefined'&& this._ddrData.vectorName!=undefined )
  //      this.filterCriteria += ',TransactionName=' + this._ddrData.vectorName;
      
if (this.commonService.isValidParamInObj(transactionSummary, 'script'))
    this.filterCriteria += ", script=" + transactionSummary.script;
  if (this.commonService.isValidParamInObj(transactionSummary, 'url'))
    { this.completeUrl=transactionSummary.url;
      this.filterCriteriaUrl=this.completeUrl;
      
      this.filterCriteriaUrl=this.filterCriteriaUrl.substring(0,30);
      this.filterCriteriaUrl += ", url=" + this.filterCriteriaUrl;
    }
    else
    this.completeUrl='';
    console.log("filter criteria filters are=====>",transactionSummary);
  if (this.commonService.isValidParamInObj(transactionSummary, 'transactionName'))
    this.filterCriteria += ", Transaction Name=" + transactionSummary.transactionName;
  if (this.commonService.isValidParamInObj(transactionSummary, 'location'))
    this.filterCriteria += ", location=" + transactionSummary.location
  if (this.commonService.isValidParamInObj(transactionSummary, 'access'))
    this.filterCriteria += ", access=" + transactionSummary.access
  if (this.commonService.isValidParamInObj(transactionSummary, 'browser'))
    this.filterCriteria += ", browser=" + transactionSummary.browser
  if (this.commonService.isValidParamInObj(transactionSummary, 'group'))
    this.filterCriteria += ", group=" + transactionSummary.group
  if (this.commonService.isValidParamInObj(transactionSummary, 'order'))
    this.filterCriteria += ", order=" + transactionSummary.order
    if (this.commonService.isValidParamInObj(transactionSummary, 'statusName'))
    {
      let status=transactionSummary['statusName'];
      if(status && status.length>=20)
      {
        status=status.substring(0,19);
        this.statusHint=transactionSummary['statusName'];
        this.filterStatus+= ", Status=" + status+" ....";
      }
      else
      this.filterStatus+= ", Status=" + status;
     
    }
      if (this.commonService.isValidParamInObj(transactionSummary, 'phaseName'))
    this.filterCriteria += ", Phase Name=" + transactionSummary.phaseName;
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
  let downloadSummaryInfo =JSON.parse(JSON.stringify(this.TransactionSummaryData));
 // let renameArray;
 // let colOrder;
//   if(this.summarybystatusReport===false) {
  


        //   if(downloadSummaryInfo[0]['GeneratorName']){
        //     renameArray['GeneratorName'] = 'Generator Name';
        //     colOrder.push('Generator Name');
        //             console.log("1111111111111111");
        // }
          // console.log("heyyyyyyy genertaor name");

//  //console.log("TransactionSessionSummaryData=========== ", JSON.stringify(downloadSummaryInfo));
//  downloadSummaryInfo.forEach((val, index) => {
// 			delete val['transactionindex'];
//       delete val['scriptname'];
//       delete val['status']; 
// 			delete val['Count'];
//       delete val['StatusType'];
//       val['min']= this.msToTimeFormate(val['min']);
//       val['max']= this.msToTimeFormate(val['max']);
//       val['average']= this.msToTimeFormate(val['average']);
//       val['median']= this.msToTimeFormate(val['median']);
//       val['eighty']= this.msToTimeFormate(val['eighty']);
//       val['ninety']= this.msToTimeFormate(val['ninety']);
//       val['ninetyFive']= this.msToTimeFormate(val['ninetyFive']);
//       val['ninetyNine']= this.msToTimeFormate(val['ninetyNine']);
     
//           });
//         }else{
//           this.renameArray = {'TransactionName': 'Transaction Name','sessionCount': 'Script Count', 'StatusType': 'Status', 'min': 'Min','average': 'Average','max': 'Max','median': 'Median','eighty': '80%','ninety': '90%','ninetyFive': '95%','ninetyNine': '99%'}
        
//           this.colOrder = ['Transaction Name','Script Count','Status','Min','Max','Average','Median','80%','90%','95%','99%'];
	
//           if(downloadSummaryInfo[0]['GeneratorName']){
//             this.renameArray['GeneratorName'] = 'Generator Name';
//             this.colOrder.push('Generator Name');
//                     console.log("1111111111111111");
//         }
//           console.log("heyyyyyyy genertaor name");

//           downloadSummaryInfo.forEach((val, index) => {
//               delete val['transactionindex'];
//               delete val['scriptname'];
//               delete val['Count'];
//               delete val['tried'];
//               delete val['success']; 
//               delete val['fail'];
//               delete val['failPercent'];
//               delete val['status'];
//               //console.log("TransactionSessionSummaryData=========== ", JSON.stringify(downloadSummaryInfo);
//               val['min']= this.msToTimeFormate(val['min']);
//               val['max']= this.msToTimeFormate(val['max']);
//               val['average']= this.msToTimeFormate(val['average']);
//               val['median']= this.msToTimeFormate(val['median']);
//               val['eighty']= this.msToTimeFormate(val['eighty']);
//               val['ninety']= this.msToTimeFormate(val['ninety']);
//               val['ninetyFive']= this.msToTimeFormate(val['ninetyFive']);
//               val['ninetyNine']= this.msToTimeFormate(val['ninetyNine']);
             
//                   });
//          }


  downloadSummaryInfo.forEach((val, index) => {
    delete val['transactionindex'];
    delete val['status'];
    delete val['Count'];
    if (this.colOrder.indexOf('Script Name') == -1)   //group by session
      delete val['scriptname'];
    else
      delete val['sessionCount']

    if (this.colOrder.indexOf('Generator Name') == -1)
      delete val['generatorName'];
    else
      delete val['sessionCount']
    if (this._ddrData.filtermode.toLowerCase() == "success"){
      delete val['fail'];
      delete val['failPercent']
      }
    if (this._ddrData.filtermode.toLowerCase() == "failure"){
          delete val['success'];
      }

    if (this.colOrder.indexOf('Status') == -1)
      delete val['StatusType'];
    else {
      delete val['tried'];
      delete val['success'];
      delete val['fail'];
      delete val['failPercent'];

    } 

                
                //console.log("TransactionSessionSummaryData=========== ", JSON.stringify(downloadSummaryInfo);
                val['min']= this.msToTimeFormate(val['min']);
                val['max']= this.msToTimeFormate(val['max']);
                val['average']= this.msToTimeFormate(val['average']);
                val['median']= this.msToTimeFormate(val['median']);
                val['eighty']= this.msToTimeFormate(val['eighty']);
                val['ninety']= this.msToTimeFormate(val['ninety']);
                val['ninetyFive']= this.msToTimeFormate(val['ninetyFive']);
                val['ninetyNine']= this.msToTimeFormate(val['ninetyNine']);
               
                    });
    //  console.log("coloredder===> ", this.colOrder,"this rename arr==>",this.renameArray, "this.data==>", downloadSummaryInfo);
      let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'TransactionSummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(this.renameArray),
      colOrder: this.colOrder.toString(),
      jsonData: JSON.stringify(downloadSummaryInfo)
    };
    let downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product) +
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
    window.open( decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
   this.subscribeTransaction.unsubscribe();
  // this.commonService.isFilterFromNSSideBar=false;
   this.commonService.isFromBreadCrumb=false;
   this.commonService.isCQM=false;
  }
  showMessage(mssg: any) {
    this.msgs = [];
    if(mssg=="Query Saved")
    this.msgs.push({ severity: 'success', summary: 'Success Message', detail: mssg });
    else if(mssg=="Query Already Defined")
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    else
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    
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


export interface TransactionSummaryDataInterface {
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
