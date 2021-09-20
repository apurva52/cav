import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { SelectItem } from '../../../../interfaces/selectitem';
//import { NsReportService } from '../../../../../../main/services/ns-report-service';
import { Router } from '@angular/router';
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
  selector: 'app-page-failure-report',
  templateUrl: './page-failure-report.component.html',
  styleUrls: ['./page-failure-report.component.css']
})
export class PageFailureReportComponent implements OnInit {

  pageFailureData : Array<PageFailureInterface>;
  urlParam:any;
  cols:any[];
  columnOptions: SelectItem[];
  url:string;
  showChart:boolean= false;
  options:Object;
  filterCriteria:string="";
  screenHeight:any;
  pageName:string="";
  scriptName:string="";
  loading = false;
  strTitle:any;
  showDownloadOption:boolean=false;
  totalFailure:number;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;

  constructor(public commonService: CommonServices, private nsCommonData:NsCommonService, private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService , private _router: Router,
    private breadcrumbService: DdrBreadcrumbService,
    private _ddrData: DdrDataModelService,private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.commonService.isToLoadSideBar=false;
    console.log("page Failure Data = "  , this.nsCommonData.pgSummaryToFailureData);
    this.loading = true;
    this.randomNumber();
    this.pageName = this.nsCommonData.pgSummaryToFailureData['pageName'];
    this.scriptName = this.nsCommonData.pgSummaryToFailureData['scriptName'];
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_FAILURE);
    this.urlParam = this.commonService.getData();
    this.commonService.currentReport="Page Failure";
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsPageFailure==>",this.commonService.nsPageFailure); 
    this.makeColumns();
    this.getPageFailureData();
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
    this.cols = [{ field: 'failureType', header: 'Failure Type', sortable: true, action: true, align:'left', width: '50'}, 
      { field: 'noOfFailures', header: 'No. Of Failures', sortable: true, action: true, align:'right', width: '50'}
    ];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
  }

  getPageFailureData()
  { 
    let ajaxParam='';
    if(this.commonService.enableQueryCaching == 1){
      this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageFailure?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun; 
    }
    else{
      this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageFailure?testRun=' + this.urlParam.testRun;
    }

    ajaxParam+= '&startTime=' + this.urlParam.startTime + '&endTime=' + this.urlParam.endTime + '&object=1&status=-1&pageName=' + this.pageName +
    '&objectId=' + this.nsCommonData.pgSummaryToFailureData['pageIndex'] + '&scriptName=' + this.scriptName;

  if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    ajaxParam += '&groupName=' +this._ddrData.vectorName;
  if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
    ajaxParam += '&generatorName=' +this._ddrData.generatorName;
  if (this._ddrData.nsErrorName){
     ajaxParam +='&nsErrorName=' + this._ddrData.nsErrorName;
    }
  if(this.commonService.isFromPageSummary || this.commonService.isFromPageSessionSummary)
    {
      ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsPageFailure,true);
      console.log("ajaxParam===> for page failure are===>");
      this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsPageFailure;
      console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);
      console.log("ajax param are==>",ajaxParam);
    }
    else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
      this.commonService.isFromPageSummary=true;
      this.commonService.isFromPageSessionSummary=true;
      console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
      ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
    }
    console.log("ajaxparam are==>",ajaxParam);
    this.url+=ajaxParam + '&queryId='+this.queryId;
    console.log("final url *** " , this.url);
  
    setTimeout(() => {
      this.openpopup();
     }, this._ddrData.guiCancelationTimeOut);
    return this.ddrRequest.getDataUsingGet(this.url).subscribe(data => this.assignPageFailureData(data));
  }

  assignPageFailureData(res: any)
  {
    console.log(" response for failure data = " , res);
    this.isCancelQuerydata = true;
    this.loading = false;
    this.pageFailureData = res.data;
    console.log("page failure data = " , this.pageFailureData);
    this.totalFailure = res.totalFailure;
    console.log("total Failure = " , this.totalFailure);
    if(this.pageFailureData.length == 0)
      this.showDownloadOption = false;
    else
      this.showDownloadOption = true;
    this.showFilterCriteria(res.startTimeInDateFormat,res.endTimeInDateFormat);
    this.createColumnChart(res);
  }

  showFilterCriteria(startTimeInDateFormat:any,endTimeInDateFormat:any)
  {
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filterCriteria += "DC=" + this._ddrData.dcName;
    if(startTimeInDateFormat != "NA" && startTimeInDateFormat != "" && startTimeInDateFormat != undefined && startTimeInDateFormat != "undefined")
      this.filterCriteria += ", From=" + startTimeInDateFormat;
    if(endTimeInDateFormat != "NA" && endTimeInDateFormat != "" && endTimeInDateFormat != undefined && endTimeInDateFormat != "undefined")
      this.filterCriteria += ", To=" + endTimeInDateFormat;
    if(this.pageName != "NA" && this.pageName != "" && this.pageName != undefined && this.pageName != "undefined")
      this.filterCriteria += ", Page=" + this.pageName; 

    if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
    if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;
    
    if (this.filterCriteria.startsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(1);
    
    if (this.filterCriteria.endsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  createColumnChart(chartInfo:any)
  {
    let chartData = chartInfo.data;
    console.log("chart data = " ,chartData);
    let dataArr = [];

    if(chartData.length == 0)
      this.showChart = false;
    else
    {
      this.showChart = true;
      for(let i=0; i<chartData.length; i++)
      {
        dataArr.push({name:chartData[i]['failureType'],data:[Number(chartData[i]['noOfFailures'])]});
      }

      console.log( "data arr for column chart = " , dataArr);
      this.options = {
        chart :{
          type : 'column'
        },
        credits: {
          enabled :false
        },
        title :{
          text : ''
        },
        xAxis :{
          categories : ['Number Of Failures']
        },
        yAxis : {
          min : 0,
          title : {
            text : 'No Of Failures'
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: 'gray'
            },
          formatter: function () {
              if (this.total && this.total > 0) {
                return Number(this.total).toLocaleString();
              } else {
                return this.total;
              }
            }
          }
        },
        legend : {
          align : 'right',
          verticalAlign: 'top',
          borderWidth: 1
        },
        tooltip : {
          pointFormat : '{series.name}: <b>{point.y}</b>'
        },
        plotOptions :{
          column : {
            stacking : 'normal',
            dataLabels : {
              enabled : false
            },
            pointWidth: 50
          }
        },
        series :dataArr
      };
    }
  }

  openPageInstanceReport(nodeInfo : any)
  {
    console.log("nodeInfo in page failure report = " , nodeInfo);
    this._ddrData.nsCQMFilter["Page Instance"]=undefined;
    //this.nsCommonData.pgFailureToInstanceFlag = true;
    this._ddrData.pageFailure = true;
    this._ddrData.pgSummaryToInstanceFlag = false;
    this.nsCommonData.pgFailureToInstanceData = nodeInfo;
    this.commonService.isFilterFromNSSideBar = false;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_FAILURE;
    if (this.commonService.isFromPageSummary || this.commonService.isFromPageSessionSummary) { //doest include location ,browser and location filter
      this.commonService.nsPageInstance = JSON.parse(JSON.stringify(this.commonService.nsPageFailure));
      delete this.commonService.nsPageInstance['group'];
      if (this.commonService.nsPageInstance['trans']) {
        this.commonService.nsPageInstance['transactionName'] = this.commonService.nsPageInstance['trans'];
        delete this.commonService.nsPageInstance['trans'];

      }
      this.commonService.nsPageInstance['status']=nodeInfo.failureCode;
      if (this._ddrData.pageFailure) {
        if(this.commonService.nsPageInstance['pageName'] && (this.commonService.nsPageInstance['pageName']=='undefined' || this.commonService.nsPageInstance['pageName']==undefined))
        this.commonService.nsPageInstance['pageName'] = this.nsCommonData.pgSummaryToFailureData['pageName'];
        if(this.commonService.nsPageInstance['scriptName'] && (this.commonService.nsPageInstance['scriptName']=='undefined' || this.commonService.nsPageInstance['scriptName']==undefined))
        this.commonService.nsPageInstance['scriptName'] = this.scriptName;
        if(this.commonService.nsPageInstance['pageIndex'] && (this.commonService.nsPageInstance['pageIndex']=='undefined' || this.commonService.nsPageInstance['pageIndex']==undefined))
        this.commonService.nsPageInstance['pageIndex'] = this.nsCommonData.pgSummaryToFailureData['pageIndex'];
        this.commonService.nsPageInstance['pageSummaryToInstFlag'] = this._ddrData.pgSummaryToInstanceFlag;
        delete this.commonService.nsPageInstance['summaryByStatusFlag'];
        delete this.commonService.nsPageInstance['summaryToSessionSummaryFlag'];
        delete this.commonService.nsPageInstance['reportType'];
        // ajaxParam += '&pageName=' + this.pageName + '&script=' + this.scriptName + "&pageIndex=" + this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
        console.log("this.nsCommonData.pgFailureToInstanceFlag==>", this.nsCommonData.pgFailureToInstanceFlag);
      }
      console.log("this.nsCommonData.pgFailureToInstanceFlag==>", this.nsCommonData.pgFailureToInstanceFlag);
      this.commonService.isFromPageFailure = true;
      console.log("going out of page failure to instance====>", this.commonService.nsPageInstance);
    }
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Page Instance');
    this.commonService.isFilterFromNSSideBar=false;
    this.nsCommonData.scriptName=this.scriptName;
    
    //, {queryParams : { pageFailureDataFromSummary : JSON.stringify(this.nsCommonData.pgSummaryToFailureData), scriptName : this.scriptName}}
    this._router.navigate(['/home/ddr/nsreports/PageInstance']);
  }

  setTestRunHeader()
  {
    if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm') 
      this.strTitle = 'Netstorm - Page Failure Report - Test Run : ' + this.urlParam.testRun;
    else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - Page Failure Report - Test Run : ' + this.urlParam.testRun;
    else 
      this.strTitle = 'Netdiagnostics Enterprise - Page Failure Report - Session : ' + this.urlParam.testRun;  
  }

  downloadReport(type:string)
  {
    let renameArr;
    let colOrder;

    renameArr = {'failureType':'Failure Type','noOfFailures':'No Of Failure'};
    colOrder = ['Failure Type','No Of Failure'];

    this.pageFailureData.forEach((val, index) => {
     delete val['failureCode'];
    });

    console.log("pageSummaryData for download **  " , this.pageFailureData);
    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'PageFailure',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArr),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.pageFailureData)
    };

    let downloadFileUrl =  decodeURIComponent(this.getHostUrl(true)+'/'+ this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
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

export interface PageFailureInterface{
  failureType : string;
  noOfFailures : string;
  failureCode:string;
}
