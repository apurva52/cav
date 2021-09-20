import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
// import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
// import { ChartModule } from 'angular2-highcharts';
import { SelectItem } from '../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { HttpReportInterface } from "../../interfaces/http-req-resp-data-info";
// import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import * as moment from 'moment';
import 'moment-timezone';
import { DDRRequestService } from '../../services/ddr-request.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'http-req-resp',
  templateUrl: 'http-req-resp.component.html',
  styleUrls: ['http-req-resp.component.scss']
})
export class HttpReqRespComponent {

  @Input() columnData;
  mainData: any;
  strTitle: string;
  filterCriteria: string = "";
  ForFooterUrl: string = "";
  reportHeader: string;
  loading: boolean;
  screenHeight: any;
  id: any; //common service id
  colsHttpInfo: any;


  httpInfoArr: Array<httpInfoInterface>;
  httpRequestArr = [];
  httpRequestArrBody:string="";
  httpRequestArrBody1: any;
  httpResponseArr = [];
  httpResponseArrBody:string="";
  httpResponseArrBody1: any;
  showmore:boolean = false;
  showmore1:boolean = false;
  httpDerivedArr = [];
  httpSessionArr = [];
  httpConditionArr = [];
  cols = [];
  cols1 = [];
  showDownLoadReportIcon: boolean = true;
  isHttpInfoData: boolean = true;
  isSessionData: boolean = true;
  isRequestHeaders: boolean = true;
  isRequestBody: boolean = true;
  isResponseHeaders: boolean = true;
  isResponseBody: boolean = true;
  isCustomData: boolean = true;
  isConditionData: boolean = true;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  breadcrumb: BreadcrumbService;
  
  constructor( public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _ddrData: DdrDataModelService,
    //  private breadcrumbService: DdrBreadcrumbService,
    private ddrRequest:DDRRequestService, breadcrumb: BreadcrumbService) {
      this.breadcrumb = breadcrumb;
  }

  ngOnChanges() {
   
     if(this._ddrData.splitViewFlag) 
       this._ddrData.setInLogger("DDR:Flowpath","Http Request and Response","Open Http Request and Response Report"); 
   if (this.columnData != undefined) {
      this.loading = true;
      this.commonService.httpData = JSON.parse(JSON.stringify(this.columnData));
      //this.id = JSON.parse(JSON.stringify(this.columnData));
      this.id = this.commonService.getData();
      console.log("this.id*****************",this.id);
      if(this.id.enableQueryCaching)
      this.commonService.enableQueryCaching = this.id.enableQueryCaching;
      this.commonService.httpData.fpInstance = this.commonService.httpData.flowpathInstance;
        if (this.commonService.httpData['fpDuration'] == '< 1') {
          this.commonService.httpData.fpDuration = 0;
        }
        else if (this.commonService.httpData['fpDuration'].toString().includes(',')) {
          this.commonService.httpData.fpDuration = this.commonService.httpData.fpDuration.toString().replace(/,/g, "");
      }

      this.commonService.httpData.strEndTime = Number(this.commonService.httpData.startTimeInMs) + Number(this.commonService.httpData.fpDuration);
	this.randomNumber();
      this.gethttpReportData();
    }
  }

  ngOnInit() {
    this.showmore=false;
    this.showmore1=false;
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight) - 140;
    if (this._ddrData.splitViewFlag == false)
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.HTTPREPORT);
      this.breadcrumb.add({label: 'HTTP Request Response', routerLink: '/ddr/httpReqResp'});
    if (this._ddrData.splitViewFlag == false)
      this.id = this.commonService.getData();
    if (this._router.url.indexOf('/home/ED-ddr/httpReqResp') != -1 && this._router.url.indexOf('?') != -1) {
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.id = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      console.log(this.id, "fter getting urlParam ");
      sessionStorage.setItem('hostDcName', location.host);
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.id;
      if (this.id.enableQueryCaching){
        this.commonService.enableQueryCaching = this.id.enableQueryCaching;
      }
    }
    this.commonService.isToLoadSideBar = false;
    if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
      this.id.testRun = this.id.testRun;
    }
    console.log('http Urlparameter info', this.id);
    // this.reportHeader = 'Http Request Response Report- '+ this.id.testRun;
    this.cols = [{ field: "header", header: "Header", sortable: true, width: '25' }, { field: "value", header: "Value", sortable: true, width: '75' }];
    this.cols1 = [{ field: "value", header: "Body", sortable: true, width: '100' }]
    //this.createFilterCriteria();
    this.randomNumber();
    this.setTestRunInHeader();
    if (this._ddrData.splitViewFlag == false)
      this.gethttpReportData();
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName;
    if(this._ddrData.isFromtrxFlow){
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.id.testRun=this._ddrData.testRunTr;
      //   return hostDCName;
    }
    else {
      hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if( !isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    {
      //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      this.id.testRun=this._ddrData.testRun;
      //this.testRun= this._ddrData.testRun;
      console.log("all case url==>",hostDcName,"all case test run==>",this.id.testRun);
    }
    // else if (this._navService.getDCNameForScreen("httpReqResp") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("httpReqResp");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
      this.strTitle = "Netstorm - Http Request Response Report - Test Run : " + this.id.testRun;
    else
      this.strTitle = "Netdiagnostics Enterprise - Http Request Response Report - Session : " + this.id.testRun;
  }

  /**
   * Rest call for getting http Report data
   */
  gethttpReportData() {
    let queryParams: any;
    let startTime: string;
    let endTime: string;
    if (this.commonService.httpFlag === true) {
      if(!this.commonService.httpData)
      {
      this.commonService.httpData = this._ddrData.httpData; 
      }
      queryParams = this.commonService.httpData;
       console.log("queryParams----------",queryParams);
      startTime = queryParams.startTimeInMs;
      endTime = queryParams.strEndTime;
    console.log(" value of start time in queryParam",startTime); 
   }
    else {
      queryParams = this.id;
      startTime = this.id.startTime;
      endTime = this.id.endTime;
    }
    //  console.log("queryParams is ===>>",queryParams);

    var url = '';
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   url = "//" + this.getHostUrl();
      // }
      // else
        url = this.getHostUrl();
    }

    else if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      //url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      if (this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      console.log('in dc case', url);
    }
    else
      url = this.getHostUrl();

      if(this.commonService.enableQueryCaching == 1){
    url += '/' + this.id.product.replace("/","")  + "/v1/cavisson/netdiagnostics/ddr/httpReportNew?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&fpInstance=" + queryParams.fpInstance + "&tierName=" + queryParams.tierName + "&serverName=" + queryParams.serverName + "&appName=" + queryParams.appName + "&statusCode=" + queryParams.statusCode +
      '&strStartTime=' + startTime + '&strEndTime=' + endTime +'&queryId='+this.queryId;
    }else
    {
      url += '/' + this.id.product.replace("/","")  + "/v1/cavisson/netdiagnostics/ddr/httpReportNew?testRun=" + this.id.testRun + "&fpInstance=" + queryParams.fpInstance + "&tierName=" + queryParams.tierName + "&serverName=" + queryParams.serverName + "&appName=" + queryParams.appName + "&statusCode=" + queryParams.statusCode +
      '&strStartTime=' + startTime + '&strEndTime=' + endTime + '&queryId='+this.queryId;
    }
    this.isCancelQuerydata = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);

return this.ddrRequest.getDataUsingGet(url).subscribe(
      data => {(this.doAssignHttpReportValue(data))},
      error => {
        this.loading = false;
          if(error.hasOwnProperty('message') ){
            this.commonService.showError(error.message);
         }
         else{
          console.error(error);
         }
     }
    
    
    );
  }
  onShowMore(event){
     this.showmore=true;
   }
  onShowMore1(event){
    this.showmore1=true;
   }
  doAssignHttpReportValue(res: any) {
    this.isCancelQuerydata=true;
    if (res === null || res === undefined) {
      this.loading = false;
      return;
    }
    if (res.hasOwnProperty('Status')) {
      if (res.Status !== "" && res.Status !== "NA" && res.Status !== 'undefined' && res.Status !== undefined) {
          this.commonService.showError(res.Status);
      }
  }
    this.mainData = res;
    console.log("This is main Data", this.mainData);
    this.loading = false;
    this.httpInfoArr = res.httpInfo;
    if (this.httpInfoArr.length !== 0) {
      this.httpInfoArr.forEach((val, index) => {
        if (val.StatusCode === '0') {
          val.StatusCode = '-';
        }
      });
    }
    this.createFilterCriteria(res.strStartTime, res.strEndTime);

    if (res.httpInfo[0]["Http Info"] == undefined) {
      this.httpInfoArr = res.httpInfo;
      this.showDownLoadReportIcon = true;
    }
    else {
      this.httpInfoArr = [];
      this.showDownLoadReportIcon = false;
    }

    this.httpRequestArr = this.createTableArr(res.reqData[0]);
    this.httpResponseArr = this.createTableArr(res.respData[0]);
    this.httpDerivedArr = this.createTableArr(res.deriveData[0]);
    this.httpSessionArr = this.createTableArr(res.sessionData[0]);
    this.httpConditionArr = this.createTableArr(res.conditionData[0]);
    this.httpRequestArrBody = res.reqBodyData[0]["ReqBody"];
    this.httpResponseArrBody = res.respBodyData[0]["RespBody"];
    console.log("print this.httpRequestArrBody value", this.httpRequestArrBody);
    console.log("print this.httpResponseArrBody value", this.httpResponseArrBody);
    this.httpRequestArrBody1 = this.createTableArr1(res.reqBodyData[0]);
    this.httpResponseArrBody1 = this.createTableArr1(res.respBodyData[0]);
    if (this.httpRequestArr.length == 0 && this.httpResponseArr.length == 0 && this.httpDerivedArr.length == 0 && this.httpSessionArr.length == 0 && this.httpConditionArr.length == 0 && this.httpRequestArrBody1.length == 0 && this.httpResponseArrBody1.length == 0) {
      this.showDownLoadReportIcon = false;
    }
    // if (this.httpRequestArr.length == 0 && this.httpResponseArr.length == 0 && this.httpDerivedArr.length == 0 && this.httpSessionArr.length == 0 && this.httpConditionArr.length == 0) {
    //   this.showDownLoadReportIcon = false;
    // }

    if (this.httpInfoArr.length == 0)
      this.isHttpInfoData = false;

    if (this.httpRequestArr[0].header == "Request Headers"){
     this.httpRequestArr[0].value="No Config Found";
      this.isRequestHeaders = false;
      }

    if (this.httpRequestArrBody1[0].header == "ReqBody" && this.httpRequestArrBody1[0].value == "No Records Found"){
      this.httpRequestArrBody1[0].value="No Config Found";
      this.isRequestBody = false;
      }

    if (this.httpResponseArrBody1[0].header == "RespBody" && this.httpResponseArrBody1[0].value == "No Records Found"){
      this.httpResponseArrBody1[0].value="No Config Found";
      this.isResponseBody = false;
     }
    if (this.httpResponseArr[0].header == "Response Headers"){
      this.httpResponseArr[0].value="No Config Found";
      this.isResponseHeaders = false;
     }

    if (this.httpDerivedArr[0].header == "Custom Data"){
      this.httpDerivedArr[0].value="No Config Found";
      this.isCustomData = false;
    }

    if (this.httpSessionArr[0].header == "Session Data"){
      this.httpSessionArr[0].value="No Config Found";
      this.isSessionData = false;
    }

    if (this.httpConditionArr[0].header == "Condition Data"){
      this.httpConditionArr[0].value="No Config Found";
      this.isConditionData = false;
    }

  }

  createTableArr(reqDataDetail) {
    let data = reqDataDetail;
    let coldata = [];
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      try
      {
      coldata[i] = { header: keys[i], value: (decodeURIComponent(data[keys[i]]).replace(/\+/g, ' ')) };
      }
      catch(e)
      {
        if(data[keys[i]] && data[keys[i]].substring(data[keys[i]].length -2,data[keys[i]].length -1) === "%")
        {
          coldata[i] = { header: keys[i], value: (decodeURIComponent(data[keys[i]].substring(0,data[keys[i]].lastIndexOf("%2"))).replace(/\+/g, ' ')) }; 
        }
        else
        {
          coldata[i] = { header: keys[i], value: (data[keys[i]].replace(/\+/g, ' ')) };
        }
      }
    }
    return coldata;
  }
  createTableArr1(reqDataDetail) {
    let data = reqDataDetail;
    let coldata = [];
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      //console.log("length of data", keys.length);
      coldata[i] = { header: keys[i], value: (decodeURIComponent(data[keys[i]].substring(0,120)).replace(/\+/g, '')) };
    }
    return coldata;
  }

  createFilterCriteria(startTime: any, endTime: any) {
    this.ForFooterUrl = '';
    this.filterCriteria = '' ;
   if(sessionStorage.getItem("isMultiDCMode")=="true")
   {
    let dcName = this._cavConfigService.getActiveDC();
    if(dcName == "ALL")
      dcName = this._ddrData.dcName;
      this.filterCriteria = 'DC=' + dcName + ', ';
   }
    let strstartTime = Number(this.id.startTime);
    let strendTime = Number(this.id.endTime);
    if (this.commonService.httpFlag == true) {
      if (this.commonService.httpData.tierName != "NA" && this.commonService.httpData.tierName != "" && this.commonService.httpData.tierName != "undefined" && this.commonService.httpData.tierName != undefined)
        this.filterCriteria += "Tier=" + this.commonService.httpData.tierName;
      if (this.commonService.httpData.serverName != "NA" && this.commonService.httpData.serverName != "" && this.commonService.httpData.serverName != "undefined" && this.commonService.httpData.serverName != undefined)
        this.filterCriteria += ", Server=" + this.commonService.httpData.serverName;
      if (this.commonService.httpData.appName != "NA" && this.commonService.httpData.appName != "" && this.commonService.httpData.appName != "undefined" && this.commonService.httpData.appName != undefined)
        this.filterCriteria += ", Instance=" + this.commonService.httpData.appName;
    } else {
      if (this.id.tierName != "NA" && this.id.tierName != "" && this.id.tierName != "undefined" && this.id.tierName != undefined)
        this.filterCriteria += "Tier=" + this.id.tierName;
      if (this.id.serverName != "NA" && this.id.serverName != "" && this.id.serverName != "undefined" && this.id.serverName != undefined)
        this.filterCriteria += ", Server=" + this.id.serverName;
      if (this.id.appName != "NA" && this.id.appName != "" && this.id.appName != "undefined" && this.id.appName != undefined)
        this.filterCriteria += ", Instance=" + this.id.appName;
    }

    if (startTime != "NA" && startTime != "" && startTime != undefined && startTime != 'undefined')
      this.filterCriteria += ", StartTime=" + startTime;
    else if (this.id.startTime != "NA" && this.id.startTime != "" && this.id.startTime != 'undefined' && this.id.startTime != undefined) {
      let startTimeInDateFormat = moment(strstartTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY hh:mm:ss");
      this.filterCriteria += ', StartTime=' + startTimeInDateFormat;
    }

    if (endTime != "NA" && endTime != "" && endTime != 'undefined' && endTime != undefined)
      this.filterCriteria += ", EndTime=" + endTime;
    else if (this.id.endTime != "NA" && this.id.endTime != "" && this.id.endTime != 'undefined' && this.id.endTime != undefined) {
      let endTimeInDateFormat = moment(strendTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY hh:mm:ss");
      console.log('timings------********', endTimeInDateFormat);
      this.filterCriteria += ', EndTime=' + endTimeInDateFormat;
    }

    if (this.id.pageName != null && this.id.pageName != undefined && this.id.pageName != "" && this.id.pageName != "NA")
      this.filterCriteria += ", Page=" + this.id.pageName;
    if (this.id.transtx != null && this.id.transtx != undefined && this.id.transtx != "" && this.id.transtx != "NA")
      this.filterCriteria += ", Transaction=" + this.id.transtx;
    if (this.id.script != null && this.id.script != undefined && this.id.script != "" && this.id.script != "NA")
      this.filterCriteria += ", Script=" + this.id.script;
    if (this.commonService.httpData.urlQueryParamStr && this.commonService.httpData.urlQueryParamStr != 'NA') {
        if (this.commonService.httpData.urlQueryParamStr.length > 45) {
            let wholeUrl = this.commonService.httpData.urlQueryParamStr.substring(0, 45) + "...";
            this.filterCriteria += ", URL=" + wholeUrl;
        }
        else {
            this.filterCriteria += ", URL=" + this.commonService.httpData.urlQueryParamStr;
        }
    }

    if (this.filterCriteria.startsWith(","))
      this.filterCriteria = this.filterCriteria.substring(1);

    if (this.filterCriteria.endsWith(","))
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);

    this.ForFooterUrl += "URL=" + this.commonService.httpData.urlQueryParamStr;
  }

  downloadReport(downloadType: string) {
    let httpReqColOrder = ["No Record Found"];
    let httpResColOrder = ["No Record Found"];
    let httpDerivedColOrder = ["No Record Found"];
    let httpSessionColOrder = ["No Record Found"];
    let httpConditionColOrder = ["No Record Found"];
    let httpReqBodyColOrder = ["No Record Found"];
    let httpRespBodyColOrder = ["No Record Found"];

    console.log("httpRequestArr======", this.httpRequestArr);
    if (null != this.mainData.reqData[0])
      httpReqColOrder = Object.keys(this.mainData.reqData[0]);
    if (null != this.mainData.respData[0])
      httpResColOrder = Object.keys(this.mainData.respData[0]);
    if (null != this.mainData.deriveData[0])
      httpDerivedColOrder = Object.keys(this.mainData.deriveData[0]);
    if (null != this.mainData.sessionData[0])
      httpSessionColOrder = Object.keys(this.mainData.sessionData[0]);
    if (null != this.mainData.conditionData[0])
      httpConditionColOrder = Object.keys(this.mainData.conditionData[0]);
    if (null != this.mainData.reqBodyData[0])
      httpReqBodyColOrder = Object.keys(this.mainData.reqBodyData[0]);  
    if (null != this.mainData.respBodyData[0])
      httpRespBodyColOrder = Object.keys(this.mainData.respBodyData[0]);

    var jsonData = "[";
    let httpInfoRenameArray = { "TierName": "TierName", "ServerName": "ServerName", "AppName": "Instance", "StatusCode": "StatusCode" };
    let httpInfoColOrder = ["TierName", "ServerName", "Instance", "StatusCode"];
    let httpReqBodyRenameArray = { "ReqBody": "ReqBody"};
    let httpRespBodyRenameArray = { "RespBody": "RespBody"};
    let downloadObj: Object = {
      downloadType: downloadType,
      strSrcFileName: "HttpReport",
      strRptTitle: this.strTitle,

      httpInfoData: JSON.stringify(this.httpInfoArr),
      httpInfoRenameArray: JSON.stringify(httpInfoRenameArray),
      httpInfoColOrder: httpInfoColOrder.toString(),

      httpReqData: JSON.stringify(this.mainData.reqData),
      httpReqRenameArray: JSON.stringify(this.mainData.reqDownloadData),
      httpReqColOrder: httpReqColOrder.toString(),

      httpReqBodyData: JSON.stringify(this.mainData.reqBodyData),
      httpReqBodyRenameArray: JSON.stringify(httpReqBodyRenameArray),
      httpReqBodyColOrder: httpReqBodyColOrder.toString(),

      httpResData: JSON.stringify(this.mainData.respData),
      httpResRenameArray: JSON.stringify(this.mainData.respDownloadData),
      httpResColOrder: httpResColOrder.toString(),

      httpRespBodyData: JSON.stringify(this.mainData.respBodyData),
      httpRespBodyRenameArray: JSON.stringify(httpRespBodyRenameArray),
      httpRespBodyColOrder: httpRespBodyColOrder.toString(),

      httpCustomData: JSON.stringify(this.mainData.deriveData),
      httpCustomRenameArray: JSON.stringify(this.mainData.derivedDownloadData),
      httpCustomColOrder: httpDerivedColOrder.toString(),

      httpSessionData: JSON.stringify(this.mainData.sessionData),
      httpSessionRenameArray: JSON.stringify(this.mainData.sessionDownloadData),
      httpSessionColOrder: httpSessionColOrder.toString(),

      httpConditionData: JSON.stringify(this.mainData.conditionData),
      httpConditionRenameArray: JSON.stringify(this.mainData.conditionDownloadData),
      httpConditionColOrder: httpConditionColOrder.toString(),
      varFilterCriteria: this.filterCriteria
    }
    let downloadFileUrl = '';
    if (this.commonService.protocol && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol.endsWith("://"))
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/","");
      else
        downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/","") ;
    }
    else
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product.replace("/",""));

    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat")|| downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (
        this.openDownloadReports(res)
      ));
    }
    else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
  }

  //To open the download file from the particular path 
  openDownloadReports(res) {
    let downloadFileUrl = '';
    if (this.commonService.protocol && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
        downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
    } else
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true));

    downloadFileUrl += "/common/" + res;
    window.open(downloadFileUrl);
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
  
     url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.id.testRun +"&queryId="+this.queryId;  
    console.log("Hello u got that",url);
      this.isCancelQuery = false;
       this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
    }

    openpopup(){
      if(!this.isCancelQuerydata)
      this.isCancelQuery =true;
    }


}

export interface httpInfoInterface {
  TierName: string;
  ServerName: string;
  AppName: string;
  StatusCode: string;

}
