import { Component, OnInit, Input  } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { SelectItem } from '../../../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../../../../main/services/cav-config.service";
import { DdrDataModelService } from "../../../../../../main/services/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
//import { ChartModule } from 'angular2-highcharts';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'transaction-failure-report',
    templateUrl: 'transaction-failure-report.component.html',
    styleUrls: ['transaction-failure-report.component.scss']
})
export class TransactionFailureReportComponent {

  TransactionFailureData:Array<TransactionFailureDataInterface>;
  urlParam: any;
  columnOptions: SelectItem[];
  id : any;
  loading = false;
  ajaxLoader = true;
  loader: boolean = false;
  filterCriteria = '';
  chartData: Object[];
  options: Object;
  cols: any;
  strTitle: any;
  trStartTime: any;
  trEndTime: any;
  txTotalCount: any;
  txLimit = 50;
  txOffset = 0;
  showChart: boolean = false;
  tabName : any ;
  screenHeight: any;
  value: number = 1;
  visibleCols: any[];
  totalFailure: any;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
 
  ngOnInit() {
   
    this.commonService.isToLoadSideBar = false ;
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight)-200;   
    this.commonService.currentReport="Transaction Failure";
    this.randomNumber();
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsTransactionFailure==>",this.commonService.nsTransactionFailure); 
    this.urlParam = this.commonService.getData();
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    console.log("this.urlParam >>>>>>>>>"+JSON.stringify(this.urlParam ));
	if(this._ddrData.isDetailsFlag){
	this.nsCommonData.transactionIndex = undefined;
	this.nsCommonData.transactionName = undefined;
	}
	
    this.fillInstanceData();
    
  }
  constructor(public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
   private nsCommonData:NsCommonService,
   private ddrData:DdrDataModelService,
   private ddrRequest:DDRRequestService  ) {

  }

  fillInstanceData(){
      try {
        this.getTransactionFailureData();
        this.setTestRunInHeader();
      this.cols = [
        { field: 'Failurevalue', header: 'Failure Type',  sortable: 'true',action: true, align: 'left', color: 'black', width: '120'},
        { field: 'NumberOfFailures', header: 'Number Of Failures', sortable:'true', action: true, align: 'right', color: 'black', width: '120'},

      ];

      this.visibleCols = [
        'Failurevalue','NumberOfFailures'
      ];

      this.columnOptions = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
      console.log('column options', this.columnOptions);
    } catch (error) {
      console.log('error in intialization compaonent --> ', error);
    }
  }



  getTransactionFailureData(){
    try{
      let url = '';
      let ajaxParam='';
      if(this._ddrData.transactionName === 'All Transactions'){
        this.nsCommonData.transactionName = undefined;
        console.log("this.nsCommonData.transactionName",this._ddrData.transactionName);
        this._ddrData.transactionName = undefined;
      }
      if(this.commonService.enableQueryCaching == 1){
        url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/NSTransactionReports?testRun=' + this.urlParam.testRun;
      }

      ajaxParam +='&strStartTime=' + this.trStartTime +
      '&strEndTime=' + this.trEndTime +
      '&object_id=' + this.nsCommonData.transactionIndex +

      '&statusCode=-1&object=2&reportType=failure';
      if(this._ddrData.transactionName || this.nsCommonData.transactionName){
        ajaxParam+= '&transactionName=' + (this._ddrData.transactionName || this.nsCommonData.transactionName);
        console.log("ajaxParam>>>>>>>>>>>>",ajaxParam);
        
       }
       if (this._ddrData.nsErrorName){
        ajaxParam+='&nsErrorName=' + this._ddrData.nsErrorName;
      }
       if(this._ddrData.strStatus==-1)
       {
        ajaxParam += '&statusCode=' + this._ddrData.strStatus;
       }
      if (this.nsCommonData.sessionSummaryFlag== true){
        ajaxParam += '&script=' + this.nsCommonData.scriptname;
      }

    if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        ajaxParam += '&groupName=' +this._ddrData.vectorName;
    if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        ajaxParam += '&generatorName=' +this._ddrData.generatorName;

      if(this.commonService.isFromTransactionSummary || this.commonService.isFromTransactionSession)
      {  
     
      if (this.nsCommonData.sessionSummaryFlag== true){
        this.commonService.nsTransactionFailure['script']= this.nsCommonData.scriptname;
      }
        console.log(" inside the session data from other report cond===>", this.commonService.nsTransactionFailure);
        ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsTransactionFailure, true);
      
        //setting value to key
        this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsTransactionFailure;
        console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);

      }
      else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
        this.commonService.isFromTransactionSummary =true;
        this.commonService.isFromTransactionSession =true;
        console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
        ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
      }
      
      url+=ajaxParam;
  url += '&limit=' + this.txLimit + '&offset=' + this.txOffset + '&showCount=false' + '&queryId='+this.queryId ;
      console.log('Final URL for build>>>>>>>>>', url);
      setTimeout(() => {
        this.openpopup();
       }, this._ddrData.guiCancelationTimeOut);
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignTransactionFailureData(data)),
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
  assignTransactionFailureData(res: any){
   // console.log("res>>>>>>>>>>>>>"+JSON.stringify(res));
  try {
      this.isCancelQuerydata = true;
      if (res === null || res === undefined) {

      this.loading = false;
        return;
      }
      setTimeout(() => {
   this.loading = false;
        this.loader = false;
      }, 2000);
      this.loading = false;
      this.ajaxLoader = false;
      
      this.TransactionFailureData = res.data;
      //if(this.nsCommonData.currRowData)
      //this.totalFailure= this.nsCommonData.currRowData.fail;
      //else{
        this.totalFailure = 0;
        this.TransactionFailureData.forEach((val, index) => {
         this.totalFailure = +this.totalFailure +  Number(val['NumberOfFailures']);
          });
     // }
      this.showfilterCriteria(res.startTime, res.endTime);
      this.createStackBarChart(res);
     
      
    }
  catch(error){
  }
}



openInstanceReport(rowData: any, flag?) {    
  console.log("rowData>>>>>>>-------"+JSON.stringify(rowData));
  this.ddrData.nsCQMFilter["Transaction Instance"]=undefined;
  if(this.commonService.isFromTransactionSummary || this.commonService.isFromTransactionSession)
  {
    console.log("transaction summary going out==>");
    this.commonService.nsTransactionInstance=JSON.parse(JSON.stringify(this.commonService.nsTransactionFailure));
    let param=this.commonService.nsTransactionInstance;          //param holds ref of txnInstance obj.
    delete this.commonService.nsTransactionInstance['group'];
    this.commonService.nsTransactionInstance['reportType']='instance';
    delete this.commonService.nsTransactionInstance['fields'];
    delete this.commonService.nsTransactionInstance['object_id'];
    if (!param['transactionName']) {
      param['transactionName'] = rowData.TransactionName;
      param['transidx'] = rowData.transactionindex;
    }
    this.commonService.nsTransactionInstance['statusCode'] = rowData.FailureType;
    this.commonService.isFromTransactionFailure = true;
    console.log("this.commonservice.nsTransactionInstance==>", this.commonService.nsTransactionInstance);
  }
  this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Transaction Instance');  

    this._ddrData.summaryToInstanceFlag = "true";
    this.nsCommonData.failureToInstanceFlag = true;
    if(this.nsCommonData.sessionSummaryFlag == true){
      this.nsCommonData.scriptname= rowData.scriptname;
    }
    if(flag== 'totalCount')
    this.nsCommonData.statuscode = '-1';
    else
    this.nsCommonData.statuscode = rowData.FailureType; 
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FAILURE;
    this.nsCommonData.transactionInstancethroughsuccess = false;
    this._router.navigate(['/home/ddr/nsreports/TransactionInstance']);
   
    
  }

 /**Used to create stacked Column chart based on FailureCount */
 createStackBarChart(res: any) {
  
  this.chartData = res.data;
  if(this.chartData.length == 0)
     this.showChart = false;
  else
    this.showChart = true;

  var failureInfoArr = [];
  var failureCount = [];
  for(var j=0; j < this.chartData.length; j++)
  { 
    var failuretype = this.chartData[j]["Failurevalue"];
    failureCount[j]=[Number(this.chartData[j]["NumberOfFailures"])];
    failureInfoArr.push({"name":failuretype,"data":failureCount[j]});
  }
  console.log("failureInfoArr>>>>>>>>>>>>",failureInfoArr);

  this.options = {
    chart: {
        type: 'column'
    },
  title: {
      text: 'Failure Details Report for Transaction'
  },
  credits: {
    enabled: false
  },
xAxis: {
  categories: ['Number of Failure'] 
},
yAxis: {
  min: 0,
  title: {
      text: 'Number of Failures'
  },
  stackLabels: {
      enabled: true,
      // style: {
      //     fontWeight: 'bold',
      //     color:'gray'
      // }
  }
},
// legend: {
//   align: 'center',
//   floating: false,
//   backgroundColor: 'white',
//   borderColor: '#CCC',
//   borderWidth: 1,
//   shadow: true
// },
// tooltip: {
//     headerFormat: '<b>{point.x}</b><br/>',
//     pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
// },
plotOptions: {
  column: {
    stacking: 'normal',
    pointWidth: 40

    // dataLabels: {
    //     enabled: true,
    //     color:  'white'
    //}

  }
},
series: failureInfoArr
  };
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
    this.strTitle = 'Netstorm - Transaction Failure Report - Test Run : ' + this.urlParam.testRun;
  }
  else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud') 
    this.strTitle = 'NetCloud - Transaction Failure Report - Test Run : ' + this.urlParam.testRun;
  else {
    this.strTitle = 'Netdiagnostics Enterprise - Transaction Failure Report - Session : ' + this.urlParam.testRun;
  }
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

/**  FilterCritera for Failure Report */
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
 
  if (this.nsCommonData.transactionName || this._ddrData.transactionName) {
        this.filterCriteria += ', Transaction=' + (this.nsCommonData.transactionName||this._ddrData.transactionName);
  }
 
  if (this.filterCriteria.startsWith(',')) {
    this.filterCriteria = this.filterCriteria.substring(1);
  }
  if (this.filterCriteria.endsWith(',')) {
    this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  else
    this.filterCriteria += '';

}

/** Download report for Failure report  */
downloadReports(reports: string) {
  let downloadfailureInfo =JSON.parse(JSON.stringify(this.TransactionFailureData));
  let renameArray = {'Failurevalue': 'Failure Type','NumberOfFailures': 'Number Of Failures'}
          
  let colOrder = ['Failure Type','Number Of Failures'];
 //console.log("TransactionFailureData=========== ", JSON.stringify(downloadfailureInfo));
 downloadfailureInfo.forEach((val, index) => {
        delete val['FailureType'];
            });
 // console.log("TransactionFailureData=========== ", JSON.stringify(downloadfailureInfo));
        let downloadObj: Object = {
        downloadType: reports,
        varFilterCriteria: this.filterCriteria,
        strSrcFileName: 'TransactionFailure',
        strRptTitle: this.strTitle,
        renameArray: JSON.stringify(renameArray),
        colOrder: colOrder.toString(),
        jsonData: JSON.stringify(downloadfailureInfo)
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
      window.open(decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
    }
    ngOnDestroy(): void {
    this.commonService.isFromTransactionSummary=false;
    this._ddrData.isDetailsFlag = false;
    console.log("ondestroy of failure called");

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



export interface TransactionFailureDataInterface {
  FailureType: string;
  NumberOfFailures: string;

}

