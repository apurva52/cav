import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
//import { NsReportService } from '../../../../../../main/services/ns-report-service';
import { Router } from '@angular/router';
import { SelectItem } from '../../../../interfaces/selectitem';
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { ActivatedRoute } from '@angular/router';
import { NsCommonService } from '../../services/ns-common-service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
  selector: 'app-page-component-details',
  templateUrl: './page-component-details.component.html',
  styleUrls: ['./page-component-details.component.css']
})
export class PageComponentDetailsComponent implements OnInit {

  pageCompDetailInfo:Array<PageCompDetailInterface>;
  urlParam:any;
  url:string;
  cols:any[];
  visibleCols: any[];
  columnOptions: SelectItem[];
  prevColumn:any;
  showPieChart:boolean=false;
  showStackedBarChart:boolean=false;
  pieOptions:Object;
  stackedBarOptions:Object;
  filterCriteria:string="";
  screenHeight:any;
  pageName:string="";
  statusField:string="";
  pageSummaryByStatusFlag:string="";
  loading = false;   
  strTitle:any;
  showDownloadOption:boolean=false;
  dynamicWidthColumn : number ;  //  To calculate dynamic width of column
      /**
     * url Param 
     */
    scriptName:string;
    avgRespTime:any;
    status:string;
    totalBytes:string;
    reportType:string;
    strTime:string;
    childIndex :string;
    sessionIndex:string;
    urlidx:string;
    pageIndex:string;
    trxnIndex:string;
    trnxName: string;
    sessionInstance:string;
    location: string = '';
    access: string = '';
    browser: string = '';
    urlName: string='';
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;
    
  constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService , private nsCommonData:NsCommonService, private _router: Router, private breadcrumbService: DdrBreadcrumbService,
    private route :ActivatedRoute, private _ddrData: DdrDataModelService,private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.loading = true;
    console.log(" currRowData **** " , this.nsCommonData.currRowData);
    this.randomNumber();
   // this.pageName = this.nsCommonData.pgSummaryToCompDetailData['pageName'];
    this.urlParam = this.commonService.getData();
    console.log(" **** url Param **** " , this.urlParam);
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.pageSummaryByStatusFlag = this.route.snapshot.queryParams['pageSummaryByStatus'];
    console.log("pageSummaryByStatusFlag in component detail = " , this.pageSummaryByStatusFlag);
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_COMPONENT_DETAIL);
    this.getDataFromRow();
    this.makeColumns();
    this.getPageCompDetailData();
    this.setTestRunHeader();
  }

  makeColumns()
  {
    this.cols = [
      { field: 'component', header: 'Component', sortable: true, action: true, align:'left'},
      { field: 'avgDownloadTime', header: 'Average Download Time', sortable: 'custom', action: true, align:'right'},
      { field: 'pageRespTimePercent', header: 'Percentage of Page Response Time', sortable: true, action: true, align:'right'}
    ];

    this.visibleCols = ['component','avgDownloadTime','pageRespTimePercent'];
    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    console.log('column options', this.columnOptions);
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
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

  getPageCompDetailData()
  {
    if(this.pageSummaryByStatusFlag == 'true')
      this.statusField = this.nsCommonData.currRowData["statusCode"];
    else
      this.statusField = '-2';

      if(this.commonService.enableQueryCaching == 1){
        this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageComponentDetail?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageComponentDetail?testRun=' + this.urlParam.testRun; 
      }
 
  this.url += '&startTime=' + this.urlParam.startTime +
    '&endTime=' + this.urlParam.endTime +
    '&object='+this.nsCommonData.objectType +
    '&scriptName=' + this.scriptName + 
    '&trans=' + this.trnxName +
    '&status='+this.statusField+
    '&pageIndex='+this.pageIndex+
    '&url=' +this.urlName+
    '&location=' +this.location+
    '&browser=' +this.browser+
    '&access=' +this.access ;
    
    if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.url += '&groupName=' +this._ddrData.vectorName;
  if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
    this.url += '&generatorName=' +this._ddrData.generatorName;

    
    //  '&startTime=' + this.urlParam.startTime + '&endTime=' + this.urlParam.endTime + 
    // '&object=1&pageIndex=' +this.nsCommonData.pgSummaryToCompDetailData['pageIndex'] + 
    // '&status='+this.statusField+
    //  '&scriptName=' + this.nsCommonData.pgSummaryToCompDetailData['scriptName'];
    this.url +='&queryId='+this.queryId;
    
    console.log("url *** " , this.url);
    setTimeout(() => {
      this.openpopup();
     }, this._ddrData.guiCancelationTimeOut);
    return this.ddrRequest.getDataUsingGet(this.url).subscribe(data => this.assignPageCompDetailData(data));
  }
  
  assignPageCompDetailData(res:any)
  {
    console.log("response for page Component = " , res);
    this.isCancelQuerydata = true;
    this.loading = false;
    this.pageCompDetailInfo = res.data;
    if(this.pageCompDetailInfo.length == 0)
      this.showDownloadOption = false;
    else
      this.showDownloadOption = true;
    this.showFilterCriteria(res.startTimeInDateFormat,res.endTimeInDateFormat);
    this.createPieChart(res);
    this.createStackedBarChart(res);
  }  

  showFilterCriteria(startTimeInDateFormat:any,endTimeInDateFormat:any)
  {
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filterCriteria += "DC" + this._ddrData.dcName;
    if(startTimeInDateFormat != "NA" && startTimeInDateFormat != "" && startTimeInDateFormat != undefined && startTimeInDateFormat != "undefined")
      this.filterCriteria += ", From=" + startTimeInDateFormat;
    if(endTimeInDateFormat != "NA" && endTimeInDateFormat != "" && endTimeInDateFormat != undefined && endTimeInDateFormat != "undefined")
      this.filterCriteria += ", To=" + endTimeInDateFormat;
    if(this.pageName != "NA" && this.pageName != "" && this.pageName != undefined && this.pageName != "undefined")
      this.filterCriteria += ", Page=" + this.pageName;
    if(this.scriptName != "NA" && this.scriptName != "" && this.scriptName != undefined && this.scriptName != "undefined")
    this.filterCriteria += ", Script=" + this.scriptName;
    if(this.trnxName != "NA" && this.trnxName != "" && this.trnxName != undefined && this.trnxName != "undefined")
    this.filterCriteria += ", Transaction=" + this.trnxName;
    if(this.avgRespTime != "NA" && this.avgRespTime != "" && this.avgRespTime != undefined && this.avgRespTime != "undefined")
    this.filterCriteria += ",  Average Page Response Time=" + this.msToTimeFormat(this.avgRespTime)+' (hh:mm:ss.ms)';
    
    if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
    if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

    if (this.filterCriteria.startsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(1);
    
    if (this.filterCriteria.endsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
        
  }
  createPieChart(pieData:any)
  {
    let pieChartData = pieData.data;
    console.log("pieChartData == " , pieChartData);
    let pieDataArr = [];
    if(pieChartData.length == 0)
      this.showPieChart= false;
    else
    {
      this.showPieChart = true;
      for(let i=0; i<pieChartData.length; i++)
      {
        pieDataArr.push({'name':pieChartData[i]['component'],'y':Number(pieChartData[i]['pageRespTimePercent'])});
      }

      console.log("pieDataArr = " , pieDataArr);
      this.pieOptions = {
        chart :{
          type : 'pie'
        },
        credits: {
          enabled :false
        },
        title :{
          text : 'Page Component Details',
          style:{'fontSize':'13px'}
        },
        tooltip : {
          pointFormat : '{series.name}: <b>{point.y}%</b>'
        },
        plotOptions :{
          pie : {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels : {
              enabled : false
            },
            showInLegend: true
          }
        },
        series :[{
          name: 'Page Components',
          data : pieDataArr
        }]
      };
    }
  }
  
  createStackedBarChart(barChartData:any)
  {
    let stackedChartData; 
    let stackedDataArr =[];

    if(this.nsCommonData.isFromSessionCompDetail == true)
    {
      stackedChartData = this.nsCommonData.barDataForSessionComp;
      stackedDataArr = this.nsCommonData.barDataForSessionComp;
    }    
    else 
    {
      stackedChartData = barChartData.data;
      for(let k=0; k<stackedChartData.length; k++)
      {
        let avgDownloadTimeInSec = Number(stackedChartData[k]['avgDownloadTime'])/1000;
        stackedDataArr.push({'name':stackedChartData[k]['component'],'data':[avgDownloadTimeInSec]});
      }
    }

    console.log("stackedDataArr = " , stackedDataArr);
   
    if(stackedChartData.length == 0)
      this.showStackedBarChart= false;
    else
      this.showStackedBarChart = true;

    this.stackedBarOptions = {
      chart : {
        type : 'bar'
      },
      title : {
        text: 'Time Split chart',
        style:{'fontSize':'13px'}
      },
      yAxis : {
        min : 0,
        title : {
          text : 'Seconds'
        }
      },
      plotOptions :{
        series : {
          stacking : 'normal'
        }
      },
      series : stackedDataArr
    };
  }

  openURLCompDetail(node:any)
  {
    let urlType;
    let params;
    console.log("node = " , node);
    
    if(node.component == 'Main URL')
      urlType = 1;
    else if(node.component == 'Embedded URL(s)')
      urlType = 2;
    else if(node.component == 'Main Redirect URL(s)') 
      urlType = 3;

    if(this.nsCommonData.isFromSessionCompDetail == true)
      params = this.nsCommonData.barDataForSessionComp;
    else
      params = {"urlType":urlType,"pageIndex":this.pageIndex,"Object":"1","status":"-2","startTime":this.urlParam.startTime,"endTime":this.urlParam.endTime, "pageName":this.pageName,"transName":this.trnxName};
    this.nsCommonData.pgDetailToURLDetailFlag = true;
    this.nsCommonData.pgDetailToURLDetailData = params;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_COMPONENT_DETAIL;
    this._router.navigate(['/home/ddr/nsreports/urldetails']);
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

   // Formatter for showing value upto 2 decimal places
  formatter(value)
  {
    if(!isNaN(value))
      return Number(value).toFixed(2);
    else
      return value;
  }

  getDataFromRow()
  {
      if(this.nsCommonData.objectType === '2') //transaction
      {
          this.reportType = 'Transacion';
          this.avgRespTime = this.nsCommonData.currRowData["avgPageresponseTime"];
          this.pageIndex = this.nsCommonData.currRowData["pageindex"];
          this.pageName = this.nsCommonData.currRowData["pagename"];
          this.trnxName = this.nsCommonData.transactionName;
          
      }
      else if(this.nsCommonData.objectType === '1') //page 
      {          
          this.reportType = 'Page';
          this.avgRespTime = this.nsCommonData.currRowData["respTime"];
          this.pageName = this.nsCommonData.currRowData["pageName"];
          this.pageIndex = this.nsCommonData.currRowData["pageIndex"];
          this.scriptName = this.nsCommonData.scriptName;
      }
      else if(this.nsCommonData.objectType === '3') //Session
      {
          this.reportType = 'Session';
          this.scriptName = this.nsCommonData.scriptName;
          this.avgRespTime = this.nsCommonData.currRowData["avgPageResp"];
          this.pageName = this.nsCommonData.currRowData["pageName"];
          this.pageIndex = this.nsCommonData.currRowData["pageIndex"];
      }
    if (this.commonService.isFromTranscationDetails || this.commonService.isFromPageSummary ||this.commonService.isFromPageSessionSummary) {
     if(this.commonService.isFromTranscationDetails)
     {
      this.urlParam.startTime = this.commonService.nsPageDetails['strStartTime'];
      this.urlParam.endTime = this.commonService.nsPageDetails['strEndTime'];
     
     }
     if(this.commonService.isFromPageSummary || this.commonService.isFromPageSessionSummary)
     {
      this.urlParam.startTime = this.commonService.nsPageDetails['startTime'];
      this.urlParam.endTime = this.commonService.nsPageDetails['endTime'];
      
     }
      if (this.commonService.nsPageDetails['page']) {
        this.pageName = this.commonService.nsPageDetails['page'];
        this.pageIndex = this.commonService.nsPageDetails['pageidx'];
      }
      if (this.commonService.nsPageDetails['transactionName'])
        this.trnxName = this.commonService.nsPageDetails['transactionName'];
      if (this.commonService.nsPageDetails['scriptName'])
        this.scriptName = this.commonService.nsPageDetails['scriptName'];
      if (this.commonService.nsPageDetails['url'])
        this.urlName = this.commonService.nsPageDetails['url'];
      if (this.commonService.nsPageDetails['location'])
        this.location = this.commonService.nsPageDetails['location'];
      if (this.commonService.nsPageDetails['browser'])
        this.browser = this.commonService.nsPageDetails['browser'];
      if (this.commonService.nsPageDetails['access'])
        this.access = this.commonService.nsPageDetails['access'];
    }
  }

  customSortOnColumns(event, tempData) {
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
         this.pageCompDetailInfo = [];
           //console.log(JSON.stringify(tempData));
           if (tempData) {
               tempData.map((rowdata) => { this.pageCompDetailInfo = this.Immutablepush(this.pageCompDetailInfo, rowdata) });
           }
   
       }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  setTestRunHeader()
  {
    if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm') 
      this.strTitle = 'Netstorm - Page Component Detail Report - Test Run : ' + this.urlParam.testRun;
    else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - Page Component Detail Report - Test Run : ' + this.urlParam.testRun; 
    else
      this.strTitle = 'Netdiagnostics Enterprise - Page Component Detail Report - Session : ' + this.urlParam.testRun;  
  }

  downloadReport(type:string)
  {
    let renameArr;
    let colOrder;

    renameArr = {'component':'Component','avgDownloadTime':'Average Download Time','pageRespTimePercent':'Percentage of Page Response Time'};

    colOrder = ['Component','Average Download Time','Percentage of Page Response Time'];

    this.pageCompDetailInfo.forEach((val, index) => {
      val['avgDownloadTime'] = this.msToTimeFormat(val['avgDownloadTime']);
      val['pageRespTimePercent'] = this.formatter(val['pageRespTimePercent']);
    });

    console.log("pageSummaryData for download **  " , this.pageCompDetailInfo);
    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'PageComponentDetail',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArr),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.pageCompDetailInfo)
    };

    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (this.openDownloadReports(res)));
    else
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (this.openDownloadReports(res)));

  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open( decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
  }
  ngOnDestroy(): void {
    this.commonService.isFromTranscationDetails = false;
    this.commonService.isFromPageSessionSummary=false;
    this.commonService.isFromPageSummary = false;
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

export interface PageCompDetailInterface
{
  component : string;
  avgDownloadTime : string;
  pageRespTimePercent : string;
}
