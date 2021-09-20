import { Component, Input, OnInit,OnDestroy } from '@angular/core';
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
  selector: 'app-url-component-details',
  templateUrl: './url-component-details.component.html',
  styleUrls: ['./url-component-details.component.css']
})
export class UrlComponentDetailsComponent implements OnInit {
  strTitle: string;
  downloadData: any[];
  //strGroupBy:any="";                                 //passed in url in case of url summary by status
  url:any;                                           //url for ajaxcall
  commonParams:any;
  //urlParam:any;                                      //parameters from url
  //hosturl:any=window.location.host; 
  object:number= 0;                                  //object 0 passed in case of url report
  fields:number=4095; 
  statusCode:number= -2; 
  limit:number= 22;
  offset:number= 0;
  //strTitle:string;
  cols:any;
  visibleCols: any[];
  columnOptions: SelectItem[];
  detailsData: any;                               //data stored after ajax call
  report: any;
  urlindex: any;
  showChart:boolean=false;
  showChartForRespTime:boolean=true;
  options:any;                                     //options for piechart 
  options1:any;                                    //options for barchart
  pieChartData:any[];
  stackChartData:any[];
  columnData:any[] = [];
  filter:any;
  loading:boolean=false;
  screenHeight:any;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;


  constructor(private _router: Router,private breadcrumbService :DdrBreadcrumbService,
    public commonService: CommonServices,private _cavConfigService: CavConfigService,private _navService: CavTopPanelNavigationService,private ddrData:DdrDataModelService,private nsCommonData : NsCommonService,
    private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.loading = true;
    this.screenHeight = this.commonService.screenHeight;
    this.commonParams = this.commonService.getData();
    this.randomNumber();
    this.setTestRunInHeader();
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.URL_DETAIL);
    this.makeajaxcall();
  }
  ngOnDestroy() {
    this.nsCommonData.urldetaildata = undefined;
  }

  CreateCharts(jsonData){
    console.log("dtaaaaaaaaaaaaaaaaaaaaaaaaaa",jsonData);
    let pieData = jsonData;
    this.showChart = true;
    var dataArr = [];
    console.log("data.lenght",pieData.length);
    for(let i=0;i<pieData.length;i++)
     {
       console.log("piedataaa",pieData);
       var barArr = [];
       let curr = pieData[i];
       if(curr.dnsLookUp != 0 && curr.dnsLookUp != "-"){
       dataArr.push({"name":"DNS Lookup","y":Number(curr.dnsLookUpPct),"color":"#FF5733"});
       barArr.push({"name":"DNS Lookup","data":[Number(curr.dnsLookUp)/1000],"color":"#FF5733"});
       }
       if(curr.connectionTime != 0 && curr.connectionTime != "-"){
       dataArr.push({"name":"Connect","y":Number(curr.connectionTimePct),"color":"#808000"});
       barArr.push({"name":"Connect","data":[Number(curr.connectionTime)/1000],"color":"#808000"});
       }
       if(curr.sslHandshake != 0 && curr.sslHandshake != "-"){
       dataArr.push({"name":"SSL","y":Number(curr.sslHandshakePct),"color":"#FF0000"});
       barArr.push({"name":"SSL","data":[Number(curr.sslHandshake)/1000],"color":"#FF0000"});
       }
       if(curr.requestSendTime != 0 && curr.requestSendTime != "-"){
       dataArr.push({"name":"Request Sent","y":Number(curr.requestSendTimePct),"color":"#0000FF"});
       barArr.push({"name":"Request Sent","data":[Number(curr.requestSendTime)/1000],"color":"#0000FF"});
       }
       if(curr.firstByteReceivedTime != 0 && curr.firstByteReceivedTime != "-"){
       dataArr.push({"name":"First Byte","y":Number(curr.firstByteReceivedTimePct),"color":"#4B3E45"});
       barArr.push({"name":"First Byte","data":[Number(curr.firstByteReceivedTime)/1000],"color":"#4B3E45"});
       }
       if(curr.contentDownloadTime != 0 && curr.contentDownloadTime != "-"){
       dataArr.push({"name":"Content Download","y":Number(curr.contentDownloadTimePct),"color":"#F08080"});
       barArr.push({"name":"Content Download","data":[Number(curr.contentDownloadTime)/1000],"color":"#F08080"});
       }

     }

     console.log("dataArr---------------",dataArr);
     console.log("barArr---------------",barArr);

    this.options = {
      chart : {
        type: "pie"
      },
      credits: {
        enabled :false
      },
      title :{
        text:"URL Component Details", 
        // style:{'fontSize':'13px'}
      },
      legend :{
	   // itemWidth : 600
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
          name: "Percentage Response Time",
          data:dataArr,
          enableMouseTracking: true
        }
      ]

    };
  
    this.options1 = {
      chart: {
        type: 'bar'
    },
    title: {
        text: 'Time Split Chart (Seconds)'
    },
    xAxis: {
        categories: ['Time']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Total Time consumption'
        }
    },
    credits: {
      enabled :false
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
};

  }

  setTestRunInHeader() {
    if (this.commonParams && this.commonParams.product.toLowerCase() == 'netstorm') {
      this.strTitle = 'Netstorm - URL Component Details - Test Run : ' + this.commonParams.testRun;
    }
    else if(this.commonParams && this.commonParams.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - URL Component Details - Test Run : ' + this.commonParams.testRun;
    else {
      this.strTitle = 'Netdiagnostics Enterprise - URL Component Details - Session : ' + this.commonParams.testRun;
    }
  }

  createTable(){
    console.log("in create table URL Details");
    this.cols = [
      { field: 'component', header: 'Component',  sortable: 'true',action: true, align: 'left', color: 'black', width: '120'},
      { field: 'avgResponseTime', header: 'Avg Response Time', sortable:'custom', action: true, align: 'right', color: 'black', width: '75'},
      { field: 'pctResponseTime', header: 'Percentage Response Time',  sortable: 'custom',action: true, align: 'right', color: 'black', width: '75'},
    ];

    this.visibleCols = [
      'component','avgResponseTime','pctResponseTime'];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
 }

  makeajaxcall(){
      let startTime = this.commonParams.startTime;
      let endTime = this.commonParams.endTime;
      if(this.nsCommonData.urlidx != undefined || this.nsCommonData.urlidx != null)
      this.urlindex = this.nsCommonData.urlidx;
      this.url = this.getHostUrl();
      
      if(this.commonService.enableQueryCaching == 1){
        this.url+= '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?cacheId='+ this.commonParams.testRun + '&testRun=' + this.commonParams.testRun;
      }
      else{
        this.url+= '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?testRun=' + this.commonParams.testRun;
      }

      this.url += '&statusCode=-2&showCount=false'+'&reportType=urldetails' + '&strStatusName="NA"';
      if (this.nsCommonData.urlsessionsummarydata != undefined)
        this.url += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName;
      if (this.nsCommonData.pgDetailToURLDetailFlag == true) {
        let pageParams = this.nsCommonData.pgDetailToURLDetailData;
        this.url += '&urltype=' + pageParams.urlType + '&pageidx=' + pageParams.pageIndex + '&startTime=' + pageParams.startTime + '&endTime=' + pageParams.endTime + '&object=' + pageParams.Object;
      }
      else
        this.url += '&object=0' + '&startTime=' + startTime + '&endTime=' + endTime + '&urlidx=' + this.urlindex;
        
      if(this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        this.url += '&groupName=' +this.ddrData.vectorName;
      if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        this.url += '&generatorName=' +this.ddrData.generatorName;  

        this.url += '&queryId='+this.queryId ;
        console.log("url",this.url);
        setTimeout(() => {
          this.openpopup();
         }, this.ddrData.guiCancelationTimeOut);
    
      this.ddrRequest.getDataUsingGet(this.url).subscribe(data => {(this.Data(data))});
  }

  Data(json){
  this.isCancelQuerydata = true;
 console.log("data in url component details  ",json);
 this.detailsData = json.data;
 this.loading = false;
 this.filtercriteria(json.starttime,json.endtime);
 console.log("this.detailsData",this.detailsData);

  if(this.detailsData.length != 0){
    this.columnData = [];
    /*Data for columns to be displayed*/
    for(let j=0;j<this.detailsData.length;j++){
      
      let obj = {};
      obj["component"] = "DNS Lookup%";
      obj["avgResponseTime"] = this.detailsData[j].dnsLookUpAvg;
      obj["pctResponseTime"] = this.detailsData[j].dnsLookUpPct;
      obj["avgResponseTimesort"] = this.detailsData[j].dnsLookUp;
      obj["pctResponseTimesort"] = this.detailsData[j].dnsLookUpPct;

      console.log("obj",obj);
      console.log("column data before push",this.columnData);
      this.columnData.push(JSON.parse(JSON.stringify(obj)));
      console.log("column data after push",this.columnData);

      obj["component"] = "Connect%";
      obj["avgResponseTime"] = this.detailsData[j].connectionTimeAvg;
      obj["pctResponseTime"] = this.detailsData[j].connectionTimePct;
      obj["avgResponseTimesort"] = this.detailsData[j].connectionTime;
      obj["pctResponseTimesort"] = this.detailsData[j].connectionTimePct;
      this.columnData.push(JSON.parse(JSON.stringify(obj)));

      obj["component"] = "SSL%";
      obj["avgResponseTime"] = this.detailsData[j].sslHandshakeAvg;
      obj["pctResponseTime"] = this.detailsData[j].sslHandshakePct;
      obj["avgResponseTimesort"] = this.detailsData[j].sslHandshake;
      obj["pctResponseTimesort"] = this.detailsData[j].sslHandshakePct;
      this.columnData.push(JSON.parse(JSON.stringify(obj)));

      obj["component"] = "Request Sent%";
      obj["avgResponseTime"] = this.detailsData[j].requestSendTimeAvg;
      obj["pctResponseTime"] = this.detailsData[j].requestSendTimePct;
      obj["avgResponseTimesort"] = this.detailsData[j].requestSendTime;
      obj["pctResponseTimesort"] = this.detailsData[j].requestSendTimePct;
      this.columnData.push(JSON.parse(JSON.stringify(obj)));

      obj["component"] = "First Byte%";
      obj["avgResponseTime"] = this.detailsData[j].firstByteReceivedTimeAvg;
      obj["pctResponseTime"] = this.detailsData[j].firstByteReceivedTimePct;
      obj["avgResponseTimesort"] = this.detailsData[j].firstByteReceivedTime;
      obj["pctResponseTimesort"] = this.detailsData[j].firstByteReceivedTimePct;
      this.columnData.push(JSON.parse(JSON.stringify(obj)));

      obj["component"] = "Content Download%";
      obj["avgResponseTime"] = this.detailsData[j].contentDownloadTimeAvg;
      obj["pctResponseTime"] = this.detailsData[j].contentDownloadTimePct;
      obj["avgResponseTimesort"] = this.detailsData[j].contentDownloadTime;
      obj["pctResponseTimesort"] = this.detailsData[j].contentDownloadTimePct;
      this.columnData.push(JSON.parse(JSON.stringify(obj)));

    }console.log("this.columnData",this.columnData);
    this.CreateCharts(this.detailsData);
    this.createTable();
  }
  }

  filtercriteria(startTime, endTime) {
    this.filter = "";
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filter += "DC=" + this.ddrData.dcName;
    if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      this.filter += ', From=' + startTime;
    }
    if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
      this.filter += ', To=' + endTime;
    }
    if (this.nsCommonData.urldetaildata!=undefined)
    {
      this.filter += ', URL=' + this.nsCommonData.urldetaildata.urlName;
    }
    if(this.nsCommonData.urlsessionsummarydata != undefined)
    {
      this.filter += ', Script Name=' + this.nsCommonData.urlsessionsummarydata.scriptName + ', Page Name=' + this.nsCommonData.urlsessionsummarydata.pageName + ', URL=' + this.nsCommonData.urlsessionsummarydata.urlName + ', URL Response Time=' + this.nsCommonData.urlsessionsummarydata.avgaverage +'(hh:mm:ss:ms)';
    }
    if (this.nsCommonData.urldetaildata!=undefined)
    {
      if (this.nsCommonData.urldetaildata.avgaverage !=undefined)
      this.filter += ', URL Response Time=' + this.nsCommonData.urldetaildata.avgaverage +'(hh:mm:ss:ms)';
    }
    if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1){
      this.filter += ', Generator Name=' +this.ddrData.generatorName;
    }
      
    if(this.ddrData.vectorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1){
      this.filter += ', Group Name=' +this.ddrData.vectorName;
    }
    if(this.nsCommonData.pgDetailToURLDetailData)
    {
        this.filter +=', Page=' +this.nsCommonData.pgDetailToURLDetailData['pageName']+', Transaction=' +this.nsCommonData.pgDetailToURLDetailData['transName'];  
    }
    if (this.filter.startsWith(',')) {
      this.filter = this.filter.substring(1);
    }
    if (this.filter.endsWith(',')) {
      this.filter = this.filter.substring(0, this.filter.length - 1);
    }
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

    /*
  **FUnction used to custom sort for intger and float
  */
  sortColumnsOnCustom(event, columnData) {
    console.log("eve",event,"custom",columnData);
    let fieldValue = event["field"];

    if (fieldValue == "avgResponseTime")
      fieldValue = ["avgResponseTimesort"];
    if (fieldValue == "pctResponseTime")
      fieldValue = ["pctResponseTimesort"];
    

    if (event.order == -1) {
      event.order = 1
      columnData = columnData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        console.log("value", value, "value2", value2);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      event.order = -1;
      //asecding order
      columnData = columnData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }

    this.columnData = [];
    //console.log(JSON.stringify(tempData));
    if (columnData) {
      columnData.map((rowdata) => { this.columnData = this.Immutablepush(this.columnData, rowdata) });
    }

  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

   /* Download report for URL Component Details  */
   downloadReports(reports: string) {
    this.downloadData = JSON.parse(JSON.stringify(this.columnData));
    let renameArray = { "component": "Component", "avgResponseTime": "Avg Response Time", "pctResponseTime": "Percentage Response Time"}
    let colOrder = ['Component', 'Avg Response Time', 'Percentage Response Time'];

    this.downloadData.forEach((val, index) => {
      delete val['avgResponseTimesort'];
      delete val['pctResponseTimesort'];
    });
    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filter,
      strSrcFileName: 'URLDetails',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.downloadData)
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
