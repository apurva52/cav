import { DdrDataModelService } from '../../../../tools/actions/dumps/service/ddr-data-model.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonServices } from '../../../services/common.services';
// import 'rxjs/Rx';
import { Location } from '@angular/common';
import { SelectItem,Message } from 'primeng/primeng';
import { NoGroupingInterface, IPInfoInterface, StackTraceInterface } from '../../../interfaces/nogrouping-data-info';
import { CavConfigService } from "../../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import * as  CONSTANTS from '../../../constants/breadcrumb.constants';
import { DDRRequestService } from '../../../services/ddr-request.service';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-nogrouping',
  templateUrl: './nogrouping.component.html',
  styleUrls: ['./nogrouping.component.css']
})
export class NogroupingComponent implements OnInit {

  @Input() signatureName:any;
  @Input() displayName:any;
  @Output() stSignature = new EventEmitter();
  @Input() compareDepth:any;
  strTitle: string;
  elapsedTimeCol: boolean;
  stackTraceFilter: string;
  displayPopUp: boolean = false;
  rowData: any[];
  index:number;
  errMsg:Message[];
  downloadJSON = [];
  hotspotFilter: string;
  totalThreads: number;
  //Structured for all parameters 
  id: any = { "testRun": "", "tierName": "", "serverName": "", "appName": "", "startTime": "", "endTime": "", "startTimeInDateFormat": "", "endTimeInDateFormat": "", "trStartTime": "", "trDuration": "", "ipWithProd": "", "isZoomPanel": "", "strGraphKey": "" };

  //variable used for disable/enable loader image
  loading = false;
  BackFlag: boolean = false;

  //Structured for hotspot 1st table
  hotspotData: Object[] = [{ "tierid": "", "serverid": "", "appid": "", "threadid": "", "threadname": "", "hotspotstarttimestamp": "", "hotspotduration": "", "threadstate": "", "threadpriority": "", "threadstackdepth": "", "FlowPathInstance": "", "toolTipTextForHsDur": "", "hsTimeInMs": "", "hsDurationInMs": "", "hotspotElapsedTime": "", "startTime": "", "endTime": "", "instanceType": "" }];

  //Structured for Integration Point table
  backendData: Object[] = [{ "backendType": "", "backendId": "", "backendDuration": "", "backendSubType": "", "backendStartTime": "", "modifiedBackendStartTime": "", "starttimeInMs": "", "errorCount": "" }];

  //Structured for stacktrace 2nd table
  hotspotSecData: Object[] = [{ "0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "" }];


  signatureInHeader: string;
  signaturePassHeader: string;
  startTimeInDate: String;
  endTimeInDate: String;
  hideTimeFilters: boolean;
  hideTimeRange: boolean;
  renamebackendNameMap: any;
  actualBackendNameMap: any;
  backendSubTypeNameMap: any;
  timeRange: SelectItem[];
  selectedTimeRange: any;
  stackTrace: string;
  minDepth: string;
  minDuration: string;
  IpData:any;
   hstotalCount: any;
   hsLimit = 10;
   hsOffset = 0;

  // Variable used for table column creation and show/hide columns
  colsForHotspot: any;
  colsForStackTrace: any;
  colsForIP: any;
  visibleColsForHotspot: any[];
  visibleColsForStackTrace: any[];
  visibleColsForIP: any[];
  columnOptionsForHotspot: SelectItem[];
  columnOptionsForStackTrace: SelectItem[];
  columnOptionsForIP: SelectItem[];
  prevColumnForHotspot;
  prevColumnForStackTrace;
  prevColumnForIP;

  // Varibles used for column level filter
  toggleFilterTitleForHotSpot = '';
  isEnabledColumnFilterForHotspot = false;
  toggleFilterTitleForIP = '';
  isEnabledColumnFilterForIP = false;
  toggleFilterTitleForStack = '';
  isEnabledColumnFilterForStack = true;
  showDownLoadReportIcon: boolean = true;
  

  hotSpotInfo: Array<NoGroupingInterface>;
  IPInfo: Array<IPInfoInterface>;
  hotSpotSecInfo: TreeNode[];
  graphKey:string;

  //Used to show the stacktrace information for first time
  selectItem: Object = { "tierid": "", "serverid": "", "appid": "", "threadid": "", "threadname": "", "hotspotstarttimestamp": "", "hotspotduration": "", "threadstate": "", "threadpriority": "", "threadstackdepth": "", "FlowPathInstance": "", "toolTipTextForHsDur": "", "hsTimeInMs": "", "hsDurationInMs": "", "hotspotElapsedTime": "", "instanceType": "" };
  selectedValue: any;
  aggCase:boolean=true;
  aggIpInfo=[];
  filterCriteriaagg ='';
  showPagination: boolean = false;
  showPaginationIP: boolean = false;
  
  /**
   * Loader will visible when load the component first time
   */
  ngOnInit() {
    this.loading = true;
    console.log("stSignature =============>>>>>>>>>>>>>>>>>>>>>>>" ,this.signatureName);
    console.log("Display Name---------------------------------->>>>",this.displayName);
    this.id = this.commonService.getData();
    this.createCols();
    this.getGraphKey();
    this.createDropDownMenu();
    this.getMode(this.id);
    this.getHotspotData();
    this.setTestRunInHeader();

  }

  ngOnChanges(){
   this.minDepth = this.compareDepth;
  }

  createCols() {
    this.colsForStackTrace = [
      { field: 'methodName', header: 'Method', sortable: false, action: true, align: 'left', width: '30%' },
      { field: 'className', header: 'Class', sortable: false, action: true, align: 'left', width: '50%' },
      { field: 'lineNo', header: 'Line', sortable: false, action: true, align: 'right', width: '15%' },
      { field: 'packageName', header: 'Source File', sortable: false, action: true, align: 'left', width: '25%'},
      { field: 'elapsedTime', header: 'Elapsed Time', sortable: false, action: true, align: 'right', width: '20%'},
      { field: 'frameNo', header: 'Frame', sortable: false, action: true, align: 'right', width: '15%'}
    ];

    this.colsForIP = [
      { field: 'renamebackendIPname', header: 'IP Name', sortable: true, action: true, align: 'left', color: 'blue', width: '60'},
      { field: 'actualbackendIPname', header: 'Discovered IP Name', sortable: true, action: false, align: 'left', color: 'black', width: '60' },
      { field: 'backendType', header: 'Type', sortable: true, action: true, align: 'left', color: 'black', width: '40' },
      { field: 'backendStartTime', header: 'Start Time', sortable: true, action: true, align: 'right', color: 'black', width: '60' },
      { field: 'backendDuration', header: 'Duration(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '40' },
      { field: 'errorCount', header: 'Status', sortable: true, action: true, align: 'left', color: 'black', width: '50' },
      { field: 'Query', header: 'Query', sortable: 'true', action: true, align: 'left', color: 'blue', width: '150' }
    ];

    if(this.id.product == 'netstorm'){
      this.colsForHotspot = [
        { field: 'threadid', header: 'Thread ID', sortable: 'custom', action: true, align: 'right', color: 'black', width: '81' },
        { field: 'threadname', header: 'Thread Name', sortable: true, action: true, align: 'left', color: 'black', width: '235' },
        { field: 'hotspotstarttimestamp', header: 'HotSpot Entry Time', sortable: true, action: true, align: 'right', color: 'black', width: '194' },
        { field: 'hotspotElapsedTime', header: 'HotSpot Entry Time(Elapsed)', sortable: true, action: true, align: 'right', color: 'black', width: '194' },
        { field: 'hotspotduration', header: 'HotSpot Duration(Sec)', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '167' },
        { field: 'threadstate', header: 'Thread State', sortable: true, action: true, align: 'left', color: 'black', width: '166' },
        { field: 'threadpriority', header: 'Thread Priority', sortable: 'custom', action: true, align: 'right', color: 'black', width: '118' },
        { field: 'threadstackdepth', header: 'Stack Depth', sortable: 'custom', action: true, align: 'right', color: 'black', width: '118' }
      ];

      this.visibleColsForHotspot = [
        'threadid', 'threadname', 'tierName', 'appName', 'hotspotstarttimestamp','hotspotElapsedTime', 'hotspotduration', 'totalDuration', 'threadstate', 'threadpriority', 'threadstackdepth'
      ];
    }else{
      this.colsForHotspot = [
        { field: 'threadid', header: 'Thread ID', sortable: 'custom', action: true, align: 'right', color: 'black', width: '81' },
        { field: 'threadname', header: 'Thread Name', sortable: true, action: true, align: 'left', color: 'black', width: '235' },
        { field: 'hotspotstarttimestamp', header: 'HotSpot Entry Time', sortable: true, action: true, align: 'right', color: 'black', width: '194' },
        { field: 'hotspotduration', header: 'HotSpot Duration(Sec)', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '167' },
        { field: 'threadstate', header: 'Thread State', sortable: true, action: true, align: 'left', color: 'black', width: '166' },
        { field: 'threadpriority', header: 'Thread Priority', sortable: 'custom', action: true, align: 'right', color: 'black', width: '118' },
        { field: 'threadstackdepth', header: 'Stack Depth', sortable: 'custom', action: true, align: 'right', color: 'black', width: '118' }
      ];
      this.visibleColsForHotspot = [
        'threadid', 'threadname', 'tierName', 'appName', 'hotspotstarttimestamp', 'hotspotduration', 'totalDuration', 'threadstate', 'threadpriority', 'threadstackdepth'
      ];
    }


    this.columnOptionsForHotspot = [];
    for (let i = 0; i < this.colsForHotspot.length; i++) {
      this.columnOptionsForHotspot.push({ label: this.colsForHotspot[i].header, value: this.colsForHotspot[i].field });
    }

    this.visibleColsForStackTrace = [
      '4', '3', '2', '1', '0'
    ];

    this.columnOptionsForStackTrace = [];
    for (let i = 0; i < this.colsForStackTrace.length; i++) {
      this.columnOptionsForStackTrace.push({ label: this.colsForStackTrace[i].header, value: this.colsForStackTrace[i].field });
    }

    this.visibleColsForIP = [
      'renamebackendIPname','backendType', 'backendStartTime', 'backendDuration', 'errorCount', 'Query'
    ];

    this.columnOptionsForIP = [];
    for (let i = 0; i < this.colsForIP.length; i++) {
      this.columnOptionsForIP.push({ label: this.colsForIP[i].header, value: this.colsForIP[i].field });
    }
  }

  ngOnDestroy()
  {
    this.commonService.indexArr.push(0);
  }
  /**
  * constructor to intilizes values 
  */
  constructor( private commonService: CommonServices, private location: Location, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService,private _router: Router,private _ddrData:DdrDataModelService,
    private ddrRequest:DDRRequestService ) {
  
  }

  getGraphKey()
  {
    return this.ddrRequest.getDataUsingGet(this.id.restDrillDownUrl).subscribe(data => (this.doAssigngraphKey(data)));
  }

  doAssigngraphKey(res:any)
  {
    this.graphKey = res.graphTimeKey;
  }
  createDropDownMenu()
  {
    this.timeRange = [];
    this.timeRange.push({ label: 'Last 10 Min', value: '10' });
    this.timeRange.push({ label: 'Last 20 Min', value: '20' });
    this.timeRange.push({ label: 'Last 30 Min', value: '30' });
    this.timeRange.push({ label: 'Last 40 Min', value: '40' });
    this.timeRange.push({ label: 'Last 50 Min', value: '50' });
    this.timeRange.push({ label: 'Last 60 Min', value: '60' });
  }
  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if( !isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    {
      //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      this.id.testRun=this._ddrData.testRun;
      
      console.log("all case url==>",hostDcName,"all case test run==>",this.id.testRun);
    }
  //  else if (this._navService.getDCNameForScreen("threadhotspot") === undefined)
  //     hostDcName = this._cavConfigService.getINSPrefix();
  //   else
  //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("threadhotspot");

  //   if (hostDcName.length > 0) {
  //     sessionStorage.removeItem("hostDcName");
  //     sessionStorage.setItem("hostDcName", hostDcName);
  //   }
  //   else
  //     hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
      this.strTitle = "Netstorm - Thread HotSpots - Test Run : " + this.id.testRun;
    else
      this.strTitle = "Netdiagnostics Enterprise - Thread HotSpots - Session : " + this.id.testRun;
  }
  getMode(queryParam: any) {
    var mode = queryParam.product;
    this.startTimeInDate = queryParam.startTimeInDateFormat;
    this.endTimeInDate = queryParam.endTimeInDateFormat;
    this.createTimeRangeHeader(queryParam.isZoomPanel);
    this.signatureInHeader = queryParam.displayName;
    if (this.displayName != undefined)
      this.signaturePassHeader = this.displayName;
    else
      this.signaturePassHeader = "";

    if (mode == "netstorm")
      this.elapsedTimeCol = true;
    else
      this.elapsedTimeCol = false;
  }

  createTimeRangeHeader(isZoom) {
    if (isZoom == "true") {
      this.hideTimeFilters = true;
      this.hideTimeRange = false;
    }
    else {
      this.hideTimeFilters = false;
      this.hideTimeRange = true;
    }
  }

  //To set thread stacktrace header information
  getSelected(event) {
    //console.log("event traget value--------"+event.data);
    this.selectItem = event.data;
  }

  //Method to apply filtes based on input
  clickApply(searchVal, depthVal, timeVal, durVal) {
    console.log("searchVal:",searchVal);
    console.log("depthVal:",depthVal);
    console.log("timeVal:",timeVal);
    console.log("durVal:",durVal);
    this.signaturePassHeader = "";
    if ((searchVal == undefined) && (depthVal == undefined) && (timeVal == undefined) && (durVal == undefined)) {
      alert("Please enter some valid value");
      return;
    }
    else {
      var strStartTime;
      var strEndTime;
      var timeFilterUrl
      if(this.id.product.replace("/","") == "netstorm" && timeVal != undefined){
          timeFilterUrl =  this.getHostUrl() + '/' + this.id.product.replace("/","")+ '/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=' + this.id.testRun
   
        timeFilterUrl = timeFilterUrl + "&graphTimeKey=" + timeVal;
        console.log("time filter call outgoing ddrsideBar",timeFilterUrl);
        this.loading = true;
        this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => (this.setTimeFilter(data,searchVal, depthVal,durVal)));
      }
      else{
      if (timeVal != undefined) {
        timeVal = Number(timeVal) * 60 * 1000;  //dropdown(nTime) value to ms
        var testDuration = Number(this.id.endTime) - Number(this.id.startTime);
       // var testEndTime = Number(this.id.endTime); // Test End time
        if (testDuration > timeVal)
        {
          var applyST = Number(this.id.endTime) - timeVal;
          strStartTime = applyST;
          strEndTime = this.id.endTime;
        }
        else //calculate end time when test is less than input time
        {
          alert("Filters time is greater than test run total time");
          strStartTime = Number(this.id.endTime) - Number(testDuration);
          strEndTime = this.id.endTime;
        }
      }
      else {
        strStartTime = this.id.startTime;
        strEndTime = this.id.endTime;
      }

      durVal = Number(durVal) * 1000; //Sec to Ms 

      //Rest call based on Filters input
      var endpoint_url
      // if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL")
      //   endpoint_url = this._ddrData.protocol + "://" + this.getHostUrl();
      // else
        endpoint_url = this.getHostUrl();

      endpoint_url = decodeURIComponent( endpoint_url+ '/' + this.id.product.replace("/","")); 

      if(this.commonService.enableQueryCaching == 1){
        endpoint_url+= "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + strStartTime + "&strEndTime=" + strEndTime
        + "&searchKeyVal=" + searchVal + "&depth=" + depthVal + "&hsDuration=" + durVal + "&stSignature=" + this.signatureName +"&graphId="+this.id.graphId;
      }
      else{
        endpoint_url+= "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + strStartTime + "&strEndTime=" + strEndTime
        + "&searchKeyVal=" + searchVal + "&depth=" + depthVal + "&hsDuration=" + durVal + "&stSignature=" + this.signatureName +"&graphId="+this.id.graphId;
      }
      this.loading = true;
      try {
        return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.doAssignValueHotspot(data)), error => {
          this.loading = false;
          console.error(error);
        });
      }
      catch (error) {
        this.loading = false;
        console.error(error);
      }
    }
    }
  }
  setTimeFilter(res:any, searchVal: any, depthVal: any, durVal: any): void {
    console.log("set time filter is hots ", res);
    var strStartTime;
    var strEndTime;
    var endpoint_url;
    strStartTime =res.ddrStartTime ;
    strEndTime =res.ddrEndTime ;

    endpoint_url = this.getHostUrl();

    endpoint_url = decodeURIComponent( endpoint_url+ '/' + this.id.product.replace("/","")); 

    if(this.commonService.enableQueryCaching == 1){
      endpoint_url+= "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + strStartTime + "&strEndTime=" + strEndTime
      + "&searchKeyVal=" + searchVal + "&depth=" + depthVal + "&hsDuration=" + durVal + "&stSignature=" + this.signatureName +"&graphId="+this.id.graphId;
    }
    else{
      endpoint_url+= "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + strStartTime + "&strEndTime=" + strEndTime
      + "&searchKeyVal=" + searchVal + "&depth=" + depthVal + "&hsDuration=" + durVal + "&stSignature=" + this.signatureName +"&graphId="+this.id.graphId;
    }
    try {
        this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.doAssignValueHotspot(data)), error => {
        this.loading = false;
        console.error(error);
      });
    }
    catch (error) {
      this.loading = false;
      console.error(error);
    }
  }
  clickBack() {
    let dataArr = [];
    console.log('index arr is ',this.commonService.indexArr);
    this.index = this.commonService.indexArr.pop();
    console.log('index value in clickback',this.index);
    dataArr.push(this.index);
    this.signatureName = undefined;
    this.stSignature.emit(dataArr);
  }

  /**
    * Method to reset data table
    */
  clickReset() {
  this.signaturePassHeader = undefined;
  this.compareDepth = 0;
  this.signaturePassHeader = "";
  this.selectedTimeRange = undefined;
  this.stackTrace = undefined;
  this.minDepth = undefined;
  this.minDuration = undefined;
  this.BackFlag = false;
  this.signatureName = undefined;
    // depthFilter.value = null;
    // durFilter.value = null;
    // this.BackFlag = true;
   // this.selectedValue = null;
   let url="";
    // if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL")
    //   url = this._ddrData.protocol + "://" + this.getHostUrl();
    // else
      url = this.getHostUrl();

      if(this.commonService.enableQueryCaching == 1){
        url =  decodeURIComponent(url + '/' + this.id.product.replace("/","")) + "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" 
        + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime+"&graphId="+this.id.graphId + "&depth=0";
      }
      else{
        url =  decodeURIComponent(url + '/' + this.id.product.replace("/","")) + "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" 
        + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime+"&graphId="+this.id.graphId + "&depth=0";
      }
    // console.log("Threadcount to nogrouping URL = " + endpoint_url);
    this.loading = true;
    try {
      return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignValueHotspot(data)),error=>{
        this.loading=false;
        console.error(error);
      });
    }
    catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  //Method to open Flowpath report when click on thread duration(mm:ss) based on row selected data
  openFPReport(data: any) {
    let threadId = "NA";
    if (data.instanceType.toLowerCase() != 'dotnet')
      threadId = data.threadid;
  let reqData = {};
  console.log("Row data is row data:", data);
  if (data != undefined) {
      var flowpathEndTime = (Number(data.hsTimeInMs) + Number(data.hsDurationInMs)).toString();
    reqData["hsEndTime"] = (Number(data.hsTimeInMs) + Number(data.hsDurationInMs) + 900000).toString();
    reqData["tierId"] = data.tierid;
    reqData["serverId"] = data.serverid;
    reqData["appId"] = data.appid;
    reqData["tierName"] = this.id.tierName;
    reqData["serverName"] = this.id.serverName;
    reqData["appName"] = this.id.appName;
    reqData["threadId"] = threadId;
    reqData["hsTimeInMs"] = data.hsTimeInMs;
    reqData["flowpathEndTime"] = flowpathEndTime;
  }
   this.commonService.isFilterFromSideBar = false;
  // this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.THREAD_HOTSPOT;
  this.commonService.hstofpData = reqData;
  this._ddrData.FromhsFlag = 'true';
  this._router.navigate(['/ddr/flowpath']);
  }
  
  //Method to get data when clcik on thread id -for thread stack trace
  passDataForStackTrace(data: any) {
    //dynamic creation for stack trace header info
    this.stackTraceFilter = `(Thread Id:${data.threadid}, Thread Name:${data.threadname}, HotSpot EntryTime(Absolute):${data.hotspotstarttimestamp}, Hotspot Duration:${data.hotspotduration} seconds )`;
    this.filterCriteriaagg = this.stackTraceFilter;
    //  console.log("stacktrace filter----"+ this.stackTraceFilter); 
    let url;
    // if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL")
    //   url = this._ddrData.protocol + "://" + this.getHostUrl();
    // else
      url = this.getHostUrl();

      if(this.commonService.enableQueryCaching == 1){
        let second_url: string =  decodeURIComponent(url + '/' + this.id.product.replace("/","")) + "/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" + data.serverid + "&appId=" + data.appid + "&threadId=" + data.threadid + "&hsTimeInMs=" + data.hsTimeInMs + "&hotSpotDuration=" + data.hsDurationInMs + '&instanceType=' + data.instanceType;
        //  console.log("second url-----------"+second_url);
        this.loading = true;
        this.getHotspotSecData(second_url); // Pass the URL to get Response from Rest service
        let IP_url: string  =url + '/' + this.id.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/backendNameForHotspot?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" + data.serverid + "&appId=" + data.appid + "&startTime=" + data.hotspotstarttimestamp + "&hsDuration=" + data.hsDurationInMs+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime + "&threadId=" + data.threadid;
        this.getbackendData(IP_url);
      }
    else{
        let second_url: string =  decodeURIComponent(url + '/' + this.id.product.replace("/","")) + "/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" + data.serverid + "&appId=" + data.appid + "&threadId=" + data.threadid + "&hsTimeInMs=" + data.hsTimeInMs + "&hotSpotDuration=" + data.hsDurationInMs + '&instanceType=' + data.instanceType;
      //  console.log("second url-----------"+second_url);
      this.loading = true;
      this.getHotspotSecData(second_url); // Pass the URL to get Response from Rest service
      let IP_url: string  =url + '/' + this.id.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/backendNameForHotspot?testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" + data.serverid + "&appId=" + data.appid + "&startTime=" + data.hotspotstarttimestamp + "&hsDuration=" + data.hsDurationInMs+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime + "&threadId=" + data.threadid;
      this.getbackendData(IP_url);
    }
  }

  //Rest call to get data as a response for thread info table   
  getHotspotData() {
    let pagination = "";
    pagination = "&hsLimit=" + this.hsLimit + "&hsOffset=" + this.hsOffset;
    console.log("this.id.product===>",this.id.product);
    // console.log(this.id.stSignature)
    if (this.signatureName != undefined) {
      this.BackFlag = true;
    }
    if(!this.compareDepth)
    this.compareDepth = 0;
    console.log("in get hotopt data input params is ===== ",this.signatureName);
    let url;
    // if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL")
    //  url = this._ddrData.protocol + "://" + this.getHostUrl(); 
    // else
      url = this.getHostUrl();

      if(this.commonService.enableQueryCaching == 1){
        url =  decodeURIComponent(url + '/' +  this.id.product.replace("/","")) + "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime + "&depth=" + this.compareDepth + "&compst=-" + "&stSignature=" + this.signatureName+"&graphId="+this.id.graphId;
      }
      else{
        url =  decodeURIComponent(url + '/' +  this.id.product.replace("/","")) + "/v1/cavisson/netdiagnostics/ddr/ASNoGroupingData?testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime + "&depth=" + this.compareDepth + "&compst=-" + "&stSignature=" + this.signatureName+"&graphId="+this.id.graphId;        
      }
    //   console.log("Threadcount to nogrouping URL = " + endpoint_url);
    url += "&showCount=false" + pagination;
    try {
      return this.ddrRequest.getDataUsingGet(url).subscribe(data => {this.doAssignValueHotspot(data);}, error => {
        this.loading = false;
        console.error(error);
      });
    }
    catch (error) {
      this.loading = false;
      console.log(error);
    }
  }


  paginate(event) {
    
    this.loading = true;
    this.hsOffset = parseInt(event.first);
    this.hsLimit = parseInt(event.rows);
    if (this.hsLimit > this.hstotalCount) {
        this.hsLimit = Number(this.hstotalCount);
    }
    if ((this.hsLimit + this.hsOffset) > this.hstotalCount) {
        this.hsLimit = Number(this.hstotalCount) - Number(this.hsOffset);
    }
      this.getHotspotData();
    }
    

  getbackendData(IP_url?: string) {
    // console.log("IP url===="+IP_url);
    try {
      return this.ddrRequest.getDataUsingGet(IP_url).subscribe(data => (this.doAssignValueBackendData(data)), error => {
        this.loading = false;
        console.error(error);
      });
    }
    catch (error) {
      this.loading = false;
      console.error(error);
    }

  }

  //Rest call to get data for stacktrace table
  getHotspotSecData(second_url?: string) {
    //console.log("second url===="+second_url);
    try {
      return this.ddrRequest.getDataUsingGet(second_url).subscribe(data => (this.doAssignValueSecHotspot(data)), error => {
        this.loading = false;
        console.error(error);
      }
      );
    }
    catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  //Assign hotspot response value to the firstarray
  doAssignValueHotspot(res: any) {
    //  this.sessionStorage.store('nogrouping',JSON.stringify(res));
    this.loading = false;
    if (res.hasOwnProperty('Status')) {
      this.showError(res.Status);
    }
    this.hotspotData = res.data;
    this.id.stSignature = undefined;
    this.hstotalCount = res.TotalCount;
    if(!this.hstotalCount){
      this.hstotalCount = 0;
    }
    if(res.startTime && res.startTime != "undefined")
     this.hotspotFilter = "(Total:" + this.hstotalCount + ", Start Time:" + res.startTime + ", End Time:" + res.endTime + ", Tier:" + this.id.tierName + ", Server:" + this.id.serverName + ", Instance:" + this.id.appName + ")";
    else 
     this.hotspotFilter = "(Total:" + this.hstotalCount + ", Tier:" + this.id.tierName + ", Server:" + this.id.serverName + ", Instance:" + this.id.appName + ")";

    if(this.hstotalCount > 10){ //If data is less then 10 then no pagination .
      this.showPagination =true;
    } else{
      this.showPagination =false;
    }

    if (this.hotspotData.length == 0) //If no data found. blank stack trace table
    {
      this.hotSpotSecInfo = [];
      this.IPInfo = [];
      this.aggIpInfo=[];
      this.stackTraceFilter = "";
      this.showDownLoadReportIcon = false;
    }
    else
      this.showDownLoadReportIcon = true;
    
    this.hotSpotInfo = this.getHotspotInfo();
  }

  //Assign stacktrace response value to secondarray 
  doAssignValueSecHotspot(res: any) {
    this.loading = false;
    this.hotspotSecData = res.treedata;
    this.hotSpotSecInfo = res.treedata;

    this.downloadJSON = res.downloadJSON;
  }

  doAssignValueBackendData(data: any) {
  // console.log("doAssignValueBackendData >>data",data);
    this.loading = false;
    this.renamebackendNameMap = data.renamebackendNameMap;
    this.actualBackendNameMap = data.actualBackendNameMap;
    this.backendSubTypeNameMap = data.backendSubTypeNameMap;
    let backendInfoList = data.backendInfoList;
    this.backendData = backendInfoList;

    console.log("condition value--------",(data.aggDataForBackends && Object.keys(data.aggDataForBackends).length != 0));
    if(data && data.aggDataForBackends && Object.keys(data.aggDataForBackends).length != 0)
    {
      console.log("aggregate case-------------");
    this.aggCase=true;
    this.aggIpInfo=data.aggDataForBackends;
    }
    else
    {
      console.log("previous  case-------------");
      this.aggCase=false;
    this.IPInfo = this.getIPinfo();
    if(this.IPInfo.length >10){ //If data is less then 10 then no pagination .
      this.showPaginationIP =true;
    } else{
      this.showPaginationIP =false;
    }
    }
   // this.IPInfo = this.getIPinfo();
  }

  openIPHealthScreen(nodeData:any){
  //  let endtime = Number(nodeData.starttimeInMs) + Number(nodeData.backendDuration);
  //  let ipPortArr = this.getHostUrl().split(':');
  //  let ip = ipPortArr[0].substring(2);
  //  let port = ipPortArr[1];
  //  let loc = this.getHostUrl();           
  //   if(loc.startsWith("//"))
  //   loc = loc.substring(2, loc.length);
  //  var url = this.getHostUrl() + "/" + this.id.product + "/analyze/drill_down_queries/drillDownRequestHandler.jsp?testRun="+this.id.testRun+"&strOperName=setQueryObject&reportType=flowpath&WAN_ENV=0&radRunPhase=0&testMode=W&isGroupByURL=true&isFromED=true&breadCrumbTrackID=1&strGraphKey="+this.graphKey+"&btCategory=intHealth&tierName="+this.id.tierName+"&dcName=&object=4&statusCode=-2&dcNameList=&isAll=null&flowmapName=default&nonZeroIP=false&dcIP="+ip+"&dcPort="+port+"&strStartTime="+nodeData.starttimeInMs+"&strEndTime="+endtime+"&isExMode=1&strTSList="+nodeData.starttimeInMs+"&endTSList="+endtime+"&backendActualName="+(encodeURIComponent(nodeData.actualbackendIPname)) + '&locationHost='+ loc;
  //  window.open(url,"_blank");

  this.commonService.hotspotToIP = true;
    this._ddrData.splitViewFlag = false;
    this.commonService.hotspotToIPData = nodeData;
    // this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.THREAD_HOTSPOT;
    if (this._router.url.indexOf('/home/ddrCopyLink') != -1) {
      this._router.navigate(['/home/ddrCopyLink/IpStatComponent']);
    } else if (this._router.url.indexOf('/home/ED-ddr') != -1) {
      this._router.navigate(['/home/ED-ddr/IpStatComponent']);
    } else {
      this._router.navigate(['/home/ddr/IpStatComponent']);
    }
  }

  //Store value for thread data
  getHotspotInfo(): Array<NoGroupingInterface> {
    var arrHotSpotData = [];
    for (var i = 0; i < this.hotspotData.length; i++) {
      if (i == 0) //for first time thread header information in table
      {
        this.passDataForStackTrace(this.hotspotData[i]);
        this.selectItem = this.hotspotData[i];
      }
      var hsDur = this.numberToLocalString(this.hotspotData[i]["hotspotduration"]);

      arrHotSpotData[i] = { tierid: this.hotspotData[i]["tierid"], serverid: this.hotspotData[i]["serverid"], appid: this.hotspotData[i]["appid"], threadid: this.hotspotData[i]["threadid"], hotspotstarttimestamp: this.hotspotData[i]["hotspotstarttimestamp"], hotspotduration: hsDur, threadstate: this.hotspotData[i]["threadstate"], threadpriority: this.hotspotData[i]["threadpriority"], threadstackdepth: this.hotspotData[i]["threadstackdepth"], FlowPathInstance: this.hotspotData[i]["FlowPathInstance"], threadname: this.hotspotData[i]["threadname"], hsTimeInMs: this.hotspotData[i]["hsTimeInMs"], toolTipTextForHsDur: this.hotspotData[i]["toolTipTextForHsDur"], hsDurationInMs: this.hotspotData[i]["hsDurationInMs"], hotspotElapsedTime: this.hotspotData[i]["hotspotElapsedTime"], strStartTime: this.hotspotData[i]["strStartTime"], strEndTime: this.hotspotData[i]["strEndTime"], instanceType: this.hotspotData[i]["instanceType"] };
    }
    return arrHotSpotData;
  }

  getIPinfo(): Array<IPInfoInterface> {
    var arrbackendData = [];
    for (var i = 0; i < this.backendData.length; i++) {


      arrbackendData[i] = {
        renamebackendIPname: this.renamebackendNameMap[this.backendData[i]["backendId"]],
        actualbackendIPname: this.actualBackendNameMap[this.backendData[i]["backendId"]].replace(/&#46;/g,'.'),
        backendType: this.BackendTypeName(this.backendData[i]["backendType"]),
        backendDuration: this.backendData[i]["backendDuration"],
        backendStartTime: this.backendData[i]["backendStartTime"],
        errorCount: this.HotspotStatus(this.backendData[i]["errorCount"]),
        Query: this.backendData[i]["backendSubType"] == 0 ?'-':this.backendSubTypeNameMap[this.backendData[i]["backendSubType"]].replace(/&#044;/g,',').replace(/&#010;/g,'\n'),
        starttimeInMs:this.backendData[i]["starttimeInMs"]
      };
    }
    return arrbackendData;
  }

  /*
  **FUnction used to custom sort for intger and float
  */
  threadHotspotSort(event, hotSpotInfo) {
    // console.log(event)
    let fieldValue = event["field"];
    if (fieldValue == "threadid" || fieldValue == "threadpriority" || fieldValue == "threadstackdepth") {
      if (event.order == -1) {
        event.order = 1
        hotSpotInfo = hotSpotInfo.sort(function (a, b) {
          var value = parseInt(a[fieldValue]);
          var value2 = parseInt(b[fieldValue]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        event.order = -1;
        //asecding order
        hotSpotInfo = hotSpotInfo.sort(function (a, b) {
          var value = parseInt(a[fieldValue]);
          var value2 = parseInt(b[fieldValue]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    if (event["field"] == "hotspotduration") {
      if (event.order == -1) {
        event.order = 1
        hotSpotInfo = hotSpotInfo.sort(function (a, b) {
          var value = parseFloat(a["hotspotduration"]);
          var value2 = parseFloat(b["hotspotduration"]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        event.order = -1;
        //asecding order
        hotSpotInfo = hotSpotInfo.sort(function (a, b) {
          var value = parseFloat(a["hotspotduration"]);
          var value2 = parseFloat(b["hotspotduration"]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    //this.hotSpotInfo = hotSpotInfo;
    this.hotSpotInfo = [];
    //console.log(JSON.stringify(tempData));
    if (hotSpotInfo) {
      hotSpotInfo.map((rowdata) => { this.hotSpotInfo = this.Immutablepush(this.hotSpotInfo, rowdata) });
  }
}
  /*
  **
  */
  stackTraceSort(event, hotSpotSecInfo) {
    //  console.log("in second case");
    let fieldValue = event["field"];
    if (fieldValue == "4" || fieldValue == "2") {
      if (event.order == -1) {
        event.order = 1
        hotSpotSecInfo = hotSpotSecInfo.sort(function (a, b) {
          var value = parseInt(a[fieldValue]);
          var value2 = parseInt(b[fieldValue]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        event.order = -1;
        //asecding order
        hotSpotSecInfo = hotSpotSecInfo.sort(function (a, b) {
          var value = parseInt(a[fieldValue]);
          var value2 = parseInt(b[fieldValue]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    //this.hotSpotSecInfo = hotSpotSecInfo;
    this.hotSpotSecInfo = [];
    //console.log(JSON.stringify(tempData));
    if (hotSpotSecInfo) {
      hotSpotSecInfo.map((rowdata) => { this.hotSpotSecInfo = this.Immutablepush(this.hotSpotSecInfo, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  
  //Store value fot thread stack trace data
  getHotspotSecInfo(): Array<StackTraceInterface> {
    var arrHotSpotSecData = [];
    for (var i = 0; i < this.hotspotSecData.length; i++) {
      arrHotSpotSecData[i] = { 0: this.hotspotSecData[i]["0"], 1: this.hotspotSecData[i]["1"], 2: this.hotspotSecData[i]["2"], 3: this.hotspotSecData[i]["3"], 4: this.hotspotSecData[i]["4"], 5: this.hotspotSecData[i]["5"], 6: this.hotspotSecData[i]["6"], 7: this.hotspotSecData[i]["7"] };
    }
    return arrHotSpotSecData;
  }
  
   updateSignature(displaySignature): string {
     if(displaySignature == "")
      {
      alert("Display Name Could not be empty.Resetting to last updated display name.");
      console.log("displayname value----"+this.displayName);
      console.log("stsignature value from text box----"+displaySignature);
      return "";
      }
      else if (displaySignature == this.signatureName)
      {
        alert("Not updated, already updated Same name.");
          displaySignature=this.signatureName;
        return "";
      }
     // console.log("updated signatuer value---"+stSignature);
     let url;
    //   if(sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL")
    //  url = this._ddrData.protocol+"://" + this.getHostUrl();
    //  else
     url= this.getHostUrl();
     
       let updateStSigantureUrl = decodeURIComponent(url+ '/' + this.id.product.replace("/",""))+"/v1/cavisson/netdiagnostics/ddr/InsertOrUpdateSignatue?testRun="+this.id.testRun+"&compDepth=0"+"&stSignature="+this.signatureName+"&displayName="+displaySignature+"&extraDisplayName="+this.signatureName;
       console.log("URL FOR UPDATE SIGNATURE IS:--" ,updateStSigantureUrl);
    
       this.ddrRequest.getDataInStringUsingGet(updateStSigantureUrl).subscribe(data =>{ 
         if(data.trim() != "") 
         alert(data)});
         return "";
    }

  //This function is used to set backendtype according to the type
  BackendTypeName(backendType) {
    var backendTypeName = "OTHER";

    if (backendType == 1)
      return "HTTP";
    else if (backendType == 2)
      return "JDBC";
    else if (backendType == 3)
      return "COHERENCE";
    else if (backendType == 4)
      return "RMI";
    else if (backendType == 5)
      return "MemCache";
    else if (backendType == 6)
      return "CLOUDANT";
    else if (backendType == 7)
      return "HADOOP";
    else if (backendType == 9)
      return "CASSANDRA";
    else if (backendType == 10)
      return "DB";
    else if (backendType == 14)
      return "JMSP";
    else if (backendType == 15)
      return "DATABASE";
    else if (backendType == 16)
      return "DATABASE";

    return backendTypeName;
  }

  // This Function is used to set value in Status
  HotspotStatus(errorCount) {

    if (errorCount == false)
      return 'Pass';

    else
      return 'Fail';

  }

  Querypop(nodeInfo: any) {
    var arr = [];
    this.displayPopUp = true;

    arr.push({ "IPname": nodeInfo.renamebackendIPname, "DiscoveredIPName": nodeInfo.actualbackendIPname, "Type": nodeInfo.backendType, "StartTime": nodeInfo.backendStartTime, "Duration": nodeInfo.backendDuration, "Status": nodeInfo.errorCount, "Query": nodeInfo.Query });
    this.rowData = arr;
  }

  downloadReport(downloadType: string) {
    let renameArray = { "threadid": "Thread ID", "threadname": "Thread Name", "hotspotstarttimestamp": "HotSpot Entry Time(Absolute)", "hotspotduration": "HotSpot Duration(Elapsed)", "threadstate": "Thread State", "threadpriority": "Thread Priority", "threadstackdepth": "Stack Depth", "hotspotElapsedTime": "HotSpot Entry Time(Elapsed)" };
    let secondRenameArray = { "methodName": "Method", "className": "Class", "lineNo": "Line", "packageName": "Source File", "elapsedTime": "Elapsed Time (ms)", "frameNo": "Frame" };
    let thirdRenameArray = { "renamebackendIPname": "IP Name", "actualbackendIPname": "Discovered IP Name", "backendType": "Type", "backendDuration": "Duration(ms)", "backendStartTime": "Start Time", "errorCount": "Status", "Query": "Query" };
    let colOrder = ["Thread ID", "Thread Name", "HotSpot Entry Time(Absolute)", "HotSpot Entry Time(Elapsed)", "HotSpot Duration(Elapsed)", "Thread State", "Thread Priority", "Stack Depth"];
    let colOrder1 = ["Method", "Class", "Line", "Source File", "Elapsed Time (ms)", "Frame"];
    let colOrder2 = ["IP Name", "Discovered IP Name", "Type", "Duration(ms)", "Start Time", "Status", "Query"]
    this.hotspotData.forEach((val, index) => {
      delete val['appid'];
      delete val['tierid'];
      delete val['hsTimeInMs'];
      delete val['serverid'];
      delete val['hsDurationInMs'];
      delete val['endTime'];
      delete val['FlowPathInstance'];
      delete val['toolTipTextForHsDur'];
      delete val['startTime'];
      delete val['instanceType'];
    });
    console.log("IPPPPPPPPPPPPPPPPPPPPPPPPP INFO IS -->",this.IPInfo);
    if (this.IPInfo != undefined) {
      this.IPInfo.forEach((val, index) => {
        delete val['_$visited'];
      });
    }
    if (this.IPInfo == undefined) {
      this.IpData = [];
    } else {
      this.IpData = this.IPInfo;
    }
    if (this.IpData !== []) {
      this.IpData.forEach((val, index) => {
        delete val['starttimeInMs'];
      });
    }
    this.downloadJSON=this.downloadJSON.filter(val=>delete val['count']);
    console.log("2",this.downloadJSON);
    let downloadObj: Object = {
      downloadType: downloadType,
      strSrcFileName: "nogrouping",
      strRptTitle: this.strTitle,
      jsonData: JSON.stringify(this.hotspotData),
      renameArray: JSON.stringify(renameArray),
      secondTableData: JSON.stringify(this.downloadJSON),
      secondRenameArray: JSON.stringify(secondRenameArray),
      thirdTableData: JSON.stringify(this.IpData),
      thirdRenameArray: JSON.stringify(thirdRenameArray),
      varFilterCriteria: this.hotspotFilter,
      colOrder: colOrder.toString(),
      colOrder1: colOrder1.toString(),
      colOrder2: colOrder2.toString()
    }

    let downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product) + "/v1/cavisson/netdiagnostics/ddr/downloadAutoSensorReport";
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat")|| downloadFileUrl.includes("/node"))) 
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (this.openDownloadReports(res)));
    else       
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (this.openDownloadReports(res)));
}
  openDownloadReports(res) {
    //console.log("file name generate ===",res)
    //console.log("//"+decodeURIComponent(this.commonServices.id.ipWithProd).replace("/netstorm","").replace("/netdiagnostics","")+"/common/"+res);
    window.open(decodeURIComponent(this.getHostUrl(true)) + "/common/" + res);
  }

  showHideColumnForHotspot(data: any) {
    if (this.visibleColsForHotspot.length === 1) {
      this.prevColumnForHotspot = this.visibleColsForHotspot[0];
    }
    if (this.visibleColsForHotspot.length === 0) {
      this.visibleColsForHotspot.push(this.prevColumnForHotspot);
    }
    if (this.visibleColsForHotspot.length !== 0) {
      for (let i = 0; i < this.colsForHotspot.length; i++) {
        for(let j = 0; j < this.visibleColsForHotspot.length; j++) {
          if (this.colsForHotspot[i].field === this.visibleColsForHotspot[j]) {
            this.colsForHotspot[i].action = true;
            break;
          } else {
            this.colsForHotspot[i].action = false;
          }
        }
      }
    }
  }
  
  showHideColumnForStackTrace(data: any) {
    if (this.visibleColsForStackTrace.length === 1) {
      this.prevColumnForStackTrace = this.visibleColsForStackTrace[0];
    }
    if (this.visibleColsForStackTrace.length === 0) {
      this.visibleColsForStackTrace.push(this.prevColumnForStackTrace);
    }
    if (this.visibleColsForStackTrace.length !== 0) {
      for (let i = 0; i < this.colsForStackTrace.length; i++) {
        for(let j = 0; j < this.visibleColsForStackTrace.length; j++) {
          if (this.colsForStackTrace[i].field === this.visibleColsForStackTrace[j]) {
            this.colsForStackTrace[i].action = true;
            break;
          } else {
            this.colsForStackTrace[i].action = false;
          }
        }
      }
    }
  }
  
  showHideColumnForIP(data: any) {
    if (this.visibleColsForIP.length === 1) {
      this.prevColumnForIP = this.visibleColsForIP[0];
    }
    if (this.visibleColsForIP.length === 0) {
      this.visibleColsForIP.push(this.prevColumnForIP);
    }
    if (this.visibleColsForIP.length !== 0) {
      for (let i = 0; i < this.colsForIP.length; i++) {
        for(let j = 0; j < this.visibleColsForIP.length; j++) {
          if (this.colsForIP[i].field === this.visibleColsForIP[j]) {
            this.colsForIP[i].action = true;
            break;
          } else {
            this.colsForIP[i].action = false;
          }
        }
      }
    }
  }

  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilterForHotspot() {
    this.isEnabledColumnFilterForHotspot = !this.isEnabledColumnFilterForHotspot;
    // if (this.isEnabledColumnFilterForHotspot) {
    //   this.isEnabledColumnFilterForHotspot = false;
    // } else {
    //   this.isEnabledColumnFilterForHotspot = true;
    // }
    this.changeColumnFilterForHotSpot();
  }

  toggleColumnFilterForIP() {
    this.isEnabledColumnFilterForIP = !this.isEnabledColumnFilterForIP;
    // if (this.isEnabledColumnFilterForIP) {
    //   this.isEnabledColumnFilterForIP = false;
    // } else {
    //   this.isEnabledColumnFilterForIP = true;
    // }
    this.changeColumnFilterForIP();
  }

  toggleColumnFilterForStack() {
    if (this.isEnabledColumnFilterForStack) {
      this.isEnabledColumnFilterForStack = false;
    } else {
      this.isEnabledColumnFilterForStack = true;
    }
    this.changeColumnFilterForStack();
  }

  /*This method is used to Enable/Disabled Column Filter*/
  changeColumnFilterForHotSpot() {
    try {
      let tableColumns = this.colsForHotspot;
      if (this.isEnabledColumnFilterForHotspot) {
        this.toggleFilterTitleForHotSpot = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForHotSpot = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }  

  changeColumnFilterForIP() {
    try {
      let tableColumns = this.colsForIP;
      if (this.isEnabledColumnFilterForIP) {
        this.toggleFilterTitleForIP = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForIP = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

  changeColumnFilterForStack() {
    try {
      let tableColumns = this.colsForStackTrace;
      if (this.isEnabledColumnFilterForStack) {
        this.toggleFilterTitleForStack = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForStack = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }


  //This method is used to convert number to comma format(e.g -123456 ->1,23,456)
  numberToLocalString(num) {
    return num.toLocaleString();
  }
  showError(msg: any) {
    this.errMsg = [];
    this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
   }
}

