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
import { ChartModule } from 'angular2-highcharts';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'transaction-details-report',
    templateUrl: 'transaction-details-report.component.html',
    styleUrls: ['transaction-details-report.component.scss']
})
export class TransactionDetailsReportComponent {

  TransactionDetailsData:Array<TransactionDetailsDataInterface>;
  urlParam: any;
  loading = false;
  ajaxLoader = true;
  loader: boolean = false;
  filterCriteria = '';
  options:object;
  piechartData: Object[];
  StackBarChartOptions: object;
  strTitle: any;
  trStartTime: any;
  trEndTime: any;
  txTotalCount: any;
  txLimit = 50;
  txOffset = 0;
  screenHeight: any;
  value: number = 1;
  showChart : boolean = false;
  thinkTime:any;
  percentThink;
  average;
  thinktimeDuration: any;
  thinkData=[];
  columnOptions: SelectItem[];
  cols: any;
  visibleCols: any[];
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;

 
  ngOnInit() {
   
    this.commonService.isToLoadSideBar = false ;
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight)-94;   
    this.commonService.currentReport="Transaction Details";
    this.randomNumber();
    this.urlParam = this.commonService.getData();
    this.average = this.msToTimeFormate(this.nsCommonData.averagetime)+"(hh:mm:ss.ms)";
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    console.log("this.urlParam >>>>>>>>>"+JSON.stringify(this.urlParam ));
    if(this._ddrData.isDetailsFlag)
	this.nsCommonData.transactionName =undefined;
    //check for key value in case of Breadcrumb 
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsTransactionSessionSummary==>",this.commonService.nsTransactionSummary); 

    this.fillInstanceData();

    
  }
  constructor(public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
    private nsCommonData:NsCommonService ,
    private ddrData:DdrDataModelService,
    private ddrRequest:DDRRequestService ) {

  }

  fillInstanceData(){
    try {
      this.getTransactionDetailsData();
      this.setTestRunInHeader();
    this.cols = [
      { field: 'avgHeader', header: 'Average Time', action: true},
      { field: 'average', header: this.average, action: true},
      { field: 'percent', header: '100%',  action: true},

    ];

    this.visibleCols = [
      'avgHeader','average','percent'
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
 
  getTransactionDetailsData(){
    try{
      let url = '';
      let ajaxParam ='';
      if(this.commonService.enableQueryCaching == 1){
        url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/TransactionDetailsReport?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/TransactionDetailsReport?testRun=' + this.urlParam.testRun;
      }

      ajaxParam +='&strStartTime=' + this.trStartTime +
      '&strEndTime=' + this.trEndTime +
      '&object=2';
if (this.nsCommonData.transactionName)
ajaxParam += '&transactionName=' + this.nsCommonData.transactionName ;
else if(this._ddrData.transactionName)       
ajaxParam += '&transactionName=' + this._ddrData.transactionName ;

      if(this.nsCommonData.sessionSummaryFlag == true){
        ajaxParam += '&script=' + this.nsCommonData.scriptname;
        if(this.nsCommonData.statuscode!== '-')
        ajaxParam +=  '&statusCode='+this.nsCommonData.statuscode;
      }else{
        ajaxParam += '&statusCode=-2';
      }

  if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
  ajaxParam += '&groupName=' +this._ddrData.vectorName;
  if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
  ajaxParam += '&generatorName=' +this._ddrData.generatorName;

if(this.commonService.isFromTransactionSession || this.commonService.isFromTransactionSummary)
{
  //over rides the other normal cases....  
  console.log('this.commonService.nsTransactionDetails===============>',this.commonService.nsTransactionDetails);
  ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsTransactionDetails,true);
  this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsTransactionDetails;

}
else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
  console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
  ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
}

url+=ajaxParam;
url += '&queryId='+this.queryId ;
console.log('Final URL for build>>>>>>>>>', url);
setTimeout(() => {
  this.openpopup();
 }, this._ddrData.guiCancelationTimeOut);

      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignTransactionDetailsData(data)),
  error => {
        this.loading = false;
        }

);
      }
      catch(error){
            console.log('error in getting data from rest call', error);
          }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  assignTransactionDetailsData(res: any){
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
      this.value = 1;
      this.loading = false;
      this.ajaxLoader = false;
      
      this.thinkTime = res.thinkTime;
      this.thinktimeDuration=this.msToTimeFormate(this.thinkTime)+"(hh:mm:ss.ms)";
      this.percentThink = res.percentThink;
      this.TransactionDetailsData = res.data;
      this.showfilterCriteria(res.startTime, res.endTime);

      this.createpieChart(this.TransactionDetailsData,this.thinkTime);
      this.thinkData = this.Immutablepush(this.thinkData, {'avgHeader':'Think Duration','average':this.thinktimeDuration,'percent':this.percentThink+'%'})
     // console.log("this.thinkData************",this.thinkData);
    }
  catch(error){
    console.log(error);
  }
}


openPageReport(rowData: any) {    
console.log("rowData>>>>>>>111-------"+JSON.stringify(rowData));
if(this.commonService.isFromTransactionSession || this.commonService.isFromTransactionSummary)
{
  this.commonService.nsPageDetails=JSON.parse(JSON.stringify(this.commonService.nsTransactionDetails));
  console.log("inside open page report==>",this.commonService.nsPageDetails)
  this.commonService.isFromTranscationDetails=true;
}  
//not routed param to page rn.
  this.nsCommonData.currRowData = rowData;
  this.nsCommonData.objectType = '2';
  this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_DETAILS;
  this._router.navigate(['/home/ddr/nsreports/PageComponentDetail']);
 
  
}

 /**Used to create Stacked bar chart based on data */
 createpieChart(StackedData: any,time:any) {

  this.piechartData = StackedData;
  if(this.piechartData.length == 0)
     this.showChart = false;
  else
    this.showChart = true;

        var dataArr = [];
        var barArr = [];
        dataArr.push({"name":"Think Time","y":Number(this.thinkTime),"color":"#f4720e"});
        
        for (let i = 0; i < this.piechartData.length; i++) {
            dataArr.push({"name":this.piechartData[i]["pagename"],"y":Number(this.piechartData[i]["avgPageresponseTime"])});
            barArr.push({"name":this.piechartData[i]["pagename"],"data":[Number(this.piechartData[i]["avgPageresponseTime"])/1000]});
        }
        barArr.push({"name":"Think Time","data":[Number(this.thinkTime)/1000],"color":"#f4720e"});
        console.log('this.errArr******* ', dataArr)

        this.options = {
            chart : {
              type: "pie"
            },
            credits: {
              enabled :false
            },
            title :{
              text:"Transaction Detail Report", 
              // style:{'fontSize':'13px'}
            },
            legend :{
        //    itemWidth : 600
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions:{
              pie:{
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels :{
                  enabled: true,
                  format: '<b>{point.name}</b>= {point.percentage:.2f} %'
                },
                showInLegend: true
              }
            },
            series :[
              {
                name: "Percentage",
                data:dataArr,
                enableMouseTracking: true
              }
            ]
      
          }
          // split time chart
          this.StackBarChartOptions = {
              chart : {
                  type: 'bar'
              },
              title : {
                  text : 'Time Split Chart (Seconds)'
              },
              xAxis : {
                  categories:['Time']
              },
              yAxis: {
                  min:0,
                  title:{
                      text:'Total Time Consumption'
                  }
              },
              credits:{
                  enabled:false
              },
              legend: {
                showInLegend: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series:barArr
          }
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
    this.strTitle = 'Netstorm - Transaction Details Report - Test Run : ' + this.urlParam.testRun;
  }
  else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
    this.strTitle = 'NetCloud - Transaction Details Report - Test Run : ' + this.urlParam.testRun;
   else {
    this.strTitle = 'Netdiagnostics Enterprise - Transaction Details Report - Session : ' + this.urlParam.testRun;
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
/**  FilterCritera for NS Summary */
showfilterCriteria(startTime: any, endTime: any) {
  if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
  this.filterCriteria += "DC=" + this.ddrData.dcName;
  if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
    this.filterCriteria = ', From=' + startTime;
  }
  if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
    this.filterCriteria += ', To=' + endTime;
  }
  if(this._ddrData.generatorName )
  this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
  
  if(this._ddrData.vectorName  && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
  this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

  if (this.nsCommonData.transactionName || this._ddrData.transactionName) {
        this.filterCriteria += ', Transaction=' + (this.nsCommonData.transactionName||this._ddrData.transactionName);
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

/**  CustomSorting for Transaction Details Report */

CustomsortOnColumns(event, tempData) {
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

  this.TransactionDetailsData = [];
//console.log(JSON.stringify(tempData));
if (tempData) {
  tempData.map((rowdata) => { this.TransactionDetailsData = this.Immutablepush(this.TransactionDetailsData, rowdata) });
}
}


/** Download report for Transaction Details report  */
downloadReports(reports: string) 
{ 
  
    let pageweightedTime='';
    let thinkTimeRenameArray={'avgHeader':'Average Time','average':this.average,'percent':'100%'};
   let transactionDetailRenameArray={"pagename":"Page Name","avgPageresponseTime":"Avg Page Response Time","pageweightedTime":"Page Weighted Time","avgPageRespPercent":"Page Weighted Time Percentage"};
	 let thinkTimeColOrder=["Average Time",this.average,'100%'];
   let transactionDetailColOrder=["Page Name","Avg Page Response Time","Page Weighted Time","Page Weighted Time Percentage"];
     
   this.thinkData.forEach((val,index)=>
	 { delete val['pageindex'];
   
	 }); 
   this.TransactionDetailsData.forEach((val,index)=>
	 { delete val['pageindex'];
     delete val['Total'];
     
     val['avgPageresponseTime']= this.msToTimeFormate(val['avgPageresponseTime']);
     val['pageweightedTime']= this.msToTimeFormate(val['avgPageresponseTime']);

	 }); 
                  
	  	// console.log("Second stringify-----"+JSON.stringify(this.thinkData)); 
	    // console.log("First stringify-----"+JSON.stringify(this.TransactionDetailsData)); 
	   let downloadObj:Object={
	   downloadType:reports,
	   strSrcFileName: "advanceTransactionDetailsReport",
     strRptTitle:this.strTitle,
     varFilterCriteria:this.filterCriteria,
     thinkData :JSON.stringify(this.thinkData),
     thinktimeRenameArray :JSON.stringify(thinkTimeRenameArray),
     thinktimeColOrder:thinkTimeColOrder.toString(),
   transactionDetailData:JSON.stringify(this.TransactionDetailsData),
   transactionDetailRenameArray:JSON.stringify(transactionDetailRenameArray),  
   transactionDetailColOrder:transactionDetailColOrder.toString(),
	  }
    let downloadFileUrl = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.urlParam.product;
    } else {
      downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product);
    }
    downloadFileUrl += "/v1/cavisson/netdiagnostics/ddr/downloadAngularReport";
    //  alert("downloadFileUrl---"+downloadFileUrl);
  if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res => (this.openDownloadReports(res)));
  else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (this.openDownloadReports(res)));

}
openDownloadReports(res) {
   let downloadFileUrl = '';
   console.log('file name generate ===', res);
   window.open( decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
   }

   ngOnDestroy(): void {
  this.commonService.isFromTransactionSummary=false;
  this.commonService.isFromTransactionSession=false;
  this._ddrData.isDetailsFlag = false;
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



export interface TransactionDetailsDataInterface {
  pagename: string;
  avgPageresponceTime: string;
  weightedtime: string;
  weightedtimePercent: string;
  pageindex: string;
  Total: string;
  avgThinktime: string;


}

