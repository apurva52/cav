import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { Location } from '@angular/common';
import { SelectItem, Message } from 'primeng/primeng';
import { NoGroupingInterface, IPInfoInterface, StackTraceInterface } from '../../interfaces/nogrouping-data-info';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { MessageService } from '../../services/ddr-message.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.css']
})
export class HotspotComponent implements OnInit, OnChanges {
  highcharts = Highcharts;
  tableHeight: any = 180;
  hotspotDataCount: any;
  @Input() columnData;
  hotspotFilter: string;
  loading: boolean = false;
  id: any;
  hotSpotInfo: any;
  mergeData: any[] = [];
  threadinfo: any;
  Barinfo: any;
  strTitle; string;
  hotspotData: any;
  hotSpotSecInfo: TreeNode[];
  IPInfo: any;
  showAllOption: boolean = false;
  stackdepth = [];
  stackTraceFilter: any;
  stackTraceFilterToolTip;
  showChart: boolean = true;
  showBarChart: boolean = true;
  options: Object;
  options1: Object;
  selectItem: any;
  renamebackendNameMap: any;
  actualBackendNameMap: any;
  backendSubTypeNameMap: any;
  hotspotSecData: any;
  chartData = [];
  backendData: any;
  StateCount: any;
  stackDepthCount: any;
  screenHeight: any;
  elapsedTimeCol = false;
  filterCriteria = '';
  downloadFilterCriteria = '';
  graphKey: string;
  displayPopUp = false;
  rowData: any[];
  colsForHotspot: any = [];
  colsForStackTrace: any = [];
  colsForIP: any;
  visibleColsForHotspot: any[];
  visibleColsForStackTrace: any[];
  visibleColsForIP: any[];
  columnOptionsForHotspot: SelectItem[];
  columnOptionsForStackTrace: any;
  columnOptionsForIP: SelectItem[];
  prevColumnForHotspot;
  prevColumnForStackTrace;
  prevColumnForIP;
  showDownLoadReportIcon: boolean = true;
  isFilterFromSideBar: boolean = false;
  mergeFlag = false;
  HSToFP = false;
  msgs: Message[] = [];

  // Varibles used for column level filter
  toggleFilterTitleForHotSpot = '';
  isEnabledColumnFilterForHotspot: boolean = false;
  toggleFilterTitleForIP = '';
  isEnabledColumnFilterForIP: boolean = false;
  toggleFilterTitleForStack = '';
  isEnabledColumnFilterForStack = true
  errMsg: Message[];
  downloadJSON = [];
  // DC variables'
  ndeCurrentInfo: any;
  ndeInfoData: any;
  protocol: string = '//';
  dcProtocol: string = '//';
  host = '';
  port = '';
  testRun: string;
  dcList: SelectItem[];
  selectedDC;
  showDCMenu = false;

  filterTierName = '';
  filterServerName = '';
  filterInstanceName = '';
  completeTier = '';
  completeServer = '';
  completeInstance = '';
  @Input('value') compareFPInfo: any = {};
  selectedHotspot: any;
  filterDCName = '';
  second_url: string = ''; // using these variables for making common url for multidc support in CQM
  IP_url: string = '';
  aggCase: boolean = true;
  aggIpInfo = [];
  filterCriteriaagg = '';
  showPagination: boolean = false;
  showPaginationIP: boolean = false;
  toolTipTextForTD: string = 'cumulative time for which this thread was in hotspots';
  private sideBarHotspot: Subscription;
  mergeDataDownloadFlag: boolean = false;
  breadcrumb: BreadcrumbService;
  empty: boolean;

  constructor(private commonService: CommonServices, private location: Location,
    private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private breadcrumbService: DdrBreadcrumbService, private _router: Router, private _ddrData: DdrDataModelService, private messageService: MessageService,
    private ddrRequest: DDRRequestService, breadcrumb: BreadcrumbService) { this.breadcrumb = breadcrumb; }

  ngOnInit() {
    this.loading = true;
    if (this._ddrData.splitViewFlag == false)
      this.commonService.isToLoadSideBar = true;
    if (this.commonService.hotspotFilters['source'] != "FlowpathReport")
      this.commonService.currentReport = "Hotspot";
    this.commonService.hotspotFilters['source'] = "NA";
    console.log("this.commonService.enableQueryCaching*********", this.commonService.enableQueryCaching);
    if (!this.commonService.enableQueryCaching)
      this.commonService.enableQueryCaching = this._ddrData.enableQueryCaching;
    if (Object.keys(this.compareFPInfo).length == 0 && this._ddrData.splitViewFlag == false)
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.HOTSPOT);
      this.breadcrumb.add({label: 'HotSpot Thread Details', routerLink: '/ddr/hotspot'});
    if (this._ddrData.splitViewFlag == false) {
      this.id = this.commonService.getData();
      this.screenHeight = Number(this.commonService.screenHeight) - 90;
      if (this.commonService.hsFlag == false)
        this._ddrData.flagForHSToFP = '1';
      if (this._ddrData.flagForHSToFP === '1')
        this.commonService.hsFlag = false;
    } else
      this.screenHeight = Number(this.commonService.screenHeight) - 150;

    this.sideBarHotspot = this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == "Hotspot") {
        console.log("inside subsribe hotspot from sidebar");
        this.commonService.isFilterFromSideBar = true;
        let keys = Object.keys(temp);
        console.log('data coming from side bar to hotspot report', temp);
        this.getHotspotData();
      }
    });
    if ((this._router.url.indexOf('?') != -1) && (this._router.url.indexOf('/home/ED-ddr/hotspot') != -1)) {
      // alert("in this condition"+location.search);
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.id = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      console.log("set storage value----------------", this.id);
      //this.id.startTime = this.id.strStartTime;
      this.id.strEndTime = this.id.endTime;
      sessionStorage.setItem('hostDcName', location.host);
      // sessionStorage.setItem("product",this.urlParam.product);
      if (this.id.enableQueryCaching) {
        this.commonService.enableQueryCaching = this.id.enableQueryCaching;
      }
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.id;
      this.commonService.hsDataFromED = this.id;
      this.commonService.strGraphKey = this.id.strGraphKey;
      this.commonService.dcNameList = this.id.dcNameList;
      this.commonService.isAllCase = this.id.isAll;
      this.commonService.tierNameList = this.id.tierNameList;
      this.commonService.selectedDC = this.id.dcName;
      this.commonService.ajaxTimeOut = this.id.ajaxTimeout;
      sessionStorage.setItem("flagForHSToFP", this.id.flagForHSToFP || this._ddrData.flagForHSToFP);
      if (this.id.dcNameList != null && this.id.dcNameList != '' && this.id.dcNameList != undefined && this.id.dcNameList != 'undefined') {
        sessionStorage.setItem("dcNameList", this.id.dcNameList);
        sessionStorage.setItem("tierNameList", this.id.tierNameList)
        sessionStorage.setItem("isAllCase", this.id.isAll);
      }
      //this.id.startTime = this.id.strStartTime;
      //this.id.endTime = this.id.strEndTime;
    }
    console.log('This.id ----', this.id);
    if (this._ddrData.flagForHSToFP === '1') {
      this.HSToFP = true;
    } else if (sessionStorage.getItem("flagForHSToFP") === '1') {
      this.HSToFP = true;
    } else {
      this.HSToFP = false;
    }
    if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
      this.id.testRun = this.id.testRun;
    }

    if (this.commonService.hsFlag == false && this.commonService.hsDataFromED != undefined) {
      this.id = this.commonService.hsDataFromED;
    }

    if (this.commonService.hsFlag == false && sessionStorage.getItem("dcNameList") != null && sessionStorage.getItem("dcNameList") != '' && sessionStorage.getItem("dcNameList") != undefined && sessionStorage.getItem("dcNameList") != 'undefined') {
      this.commonService.dcNameList = sessionStorage.getItem("dcNameList");
      this.commonService.tierNameList = sessionStorage.getItem("tierNameList");
      this.commonService.isAllCase = sessionStorage.getItem("isAllCase");
    }
    if (Object.keys(this.compareFPInfo).length > 0) {
      this.commonService.isToLoadSideBar = false;
      this.updateIdParam();
    }
    else {
      console.log("this.id--------", this.id);
      this.fillData();
      this.getGraphKey();
      //this.createFilterCriteria();
      //this.setTestRunInHeader();
    }
    this._ddrData.passMesssage$.subscribe((mssg) => { this.showMessage(mssg) });
    this.setTestRunInHeader();
  }
  updateIdParam() {
    let endTime = 0;
    if (undefined != this.compareFPInfo.fpDuration) {
      if (this.compareFPInfo.fpDuration.toString().includes(','))
        endTime = Number(this.compareFPInfo.startTimeInMs) + Number(this.compareFPInfo.fpDuration.toString().replace(/,/g, ""));
      else if (this.compareFPInfo.fpDuration == '< 1')
        endTime = Number(this.compareFPInfo.startTimeInMs) + Number(0);
      else
        endTime = Number(this.compareFPInfo.startTimeInMs) + Number(this.compareFPInfo.fpDuration);
    }
    this.id['startTimeInMS'] = this.compareFPInfo['startTimeInMs'];
    this.id['strEndTimeMS'] = endTime + "";
    this.id['tierId'] = this.compareFPInfo['tierId'];
    this.id['serverId'] = this.compareFPInfo['serverId'];
    this.id['appId'] = this.compareFPInfo['appId'];
    this.id['tierName'] = this.compareFPInfo['tierName'];
    this.id['serverName'] = this.compareFPInfo['serverName'];
    this.id['appName'] = this.compareFPInfo['appName'];
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    if (this._ddrData.splitViewFlag)
      this._ddrData.setInLogger("DDR:Flowpath", "Hotspot", "Open Hotspot Report");

    if (this.columnData != undefined) {
      this.loading = true;
      console.log("this.commonService.enableQueryCaching", this.commonService.enableQueryCaching);
      this.commonService.enableQueryCaching = this.commonService.enableQueryCaching;
      //    this.columnData.startTime = this.columnData.startTimeInMs;
      if (this.columnData.fpDuration.toString().includes(','))
        this.columnData.fpDuration = this.columnData.fpDuration.replace(',', '');
      //  this.columnData.endTime = Number(this.columnData.startTimeInMs) + Number(this.columnData.fpDuration);
      this.id = JSON.parse(JSON.stringify(this.columnData));
      console.log("columndata=======>", this.columnData);
      if (this.columnData.btCatagory === 'Very Slow') {
        this.columnData.btCatagory = '12';
      }
      if (this.columnData.btCatagory === 'Slow') {
        this.columnData.btCatagory = '11';
      }
      if (this.columnData.btCatagory === 'Normal') {
        this.columnData.btCatagory = '10';
      }
      if (this.columnData.btCatagory === 'Errors') {
        this.columnData.btCatagory = '13';
      }
      this.getHotspotData();
    } else {
      this.id = this.commonService.getData();
    }
    console.log("id value---", this.compareFPInfo);

    if (Object.keys(this.compareFPInfo).length > 0) {
      this.updateIdParam();
      this.fillData();
    }
    this.getGraphKey();

  }

  fillData() {

    // if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
    //   this.getDCData();
    // } else {
    //   if (this._ddrData.splitViewFlag == false)
    //     this.getHotspotData();
    //   this.commonService.host = '';
    //   this.commonService.port = '';
    //   this.commonService.protocol = '';
    //   this.commonService.testRun = '';
    //   this.commonService.selectedDC = '';
    // }
    this.colsForHotspot = [
      { field: 'threadid', header: 'Thread ID', sortable: 'custom', action: true, align: 'right', color: 'black', width: '60' },
      { field: 'threadname', header: 'Thread Name', sortable: true, action: true, align: 'left', color: 'black', width: '277' },
      { field: 'tierName', header: 'Tier', sortable: true, action: true, align: 'left', color: 'black', width: '70' },
      { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '75' },
      { field: 'appName', header: 'Instance', sortable: 'true', action: true, align: 'left', color: 'black', width: '75' },
      { field: 'hotspotstarttimestamp', header: 'HotSpot Entry Time', sortable: true, action: true, align: 'right', color: 'black', width: '130' },
      { field: 'hotspotduration', header: 'HotSpot Duration(Sec)', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '116' },
      { field: 'totalDuration', header: 'Total Hotspot Duration(Sec)', sortable: 'custom', action: true, align: 'right', color: 'black', width: '116' },
      { field: 'threadstate', header: 'Thread State', sortable: true, action: true, align: 'left', color: 'black', width: '124' },
      { field: 'threadpriority', header: 'Thread Priority', sortable: 'custom', action: true, align: 'right', color: 'black', width: '78' },
      { field: 'threadstackdepth', header: 'Stack Depth', sortable: 'custom', action: true, align: 'right', color: 'black', width: '78' },
      { field: 'FlowPathInstance', header: 'FlowpathInstance', sortable: 'true', action: false, align: 'left', color: 'black', width: '108' }
    ];

    this.colsForStackTrace = [
      { field: 'methodName', header: 'Method', sortable: false, action: true, align: 'left', width: '50' },
      { field: 'className', header: 'Class', sortable: false, action: true, align: 'left', width: '120' },
      { field: 'lineNo', header: 'Line', sortable: false, action: true, align: 'right', width: '20' },
      { field: 'packageName', header: 'Source File', sortable: false, action: true, align: 'left', width: '70' },
      { field: 'elapsedTime', header: 'Elapsed Time (ms)', sortable: false, action: true, align: 'right', width: '40' },
      { field: 'frameNo', header: 'Frame', sortable: false, action: true, align: 'right', width: '20' }
    ];

    this.colsForIP = [
      { field: "action", header: "Action", toolTip: "Action Links", width: '50', action: true, align: 'left' },
      { field: 'renamebackendIPname', header: 'IP Name', sortable: true, action: true, align: 'left', color: 'blue', width: '110' },
      { field: 'actualbackendIPname', header: 'Discovered IP Name', sortable: true, action: false, align: 'left', color: 'black', width: '110' },
      { field: 'backendType', header: 'Type', sortable: true, action: true, align: 'left', color: 'black', width: '110' },
      { field: 'backendStartTime', header: 'Start Time', sortable: true, action: true, align: 'right', color: 'black', width: '110' },
      { field: 'backendDuration', header: 'Duration(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '110' },
      { field: 'errorCount', header: 'Status', sortable: true, action: true, align: 'left', color: 'black', width: '110' },
      { field: 'Query', header: 'Query', sortable: 'true', action: true, align: 'left', color: 'black', width: '110' },
      { field: 'fpInstance', header: 'FlowpathInstance', sortable: 'true', action: false, align: 'left', color: 'black', width: '118' },
      { field: 'networkreq', header: 'Network Delay Req(ms)', sortable: true, action: false, align: 'left', color: 'black', width: '110' },
      { field: 'networkres', header: 'Network Delay Res(ms)', sortable: true, action: false, align: 'left', color: 'black', width: '110' }
    ];

    this.visibleColsForHotspot = [
      'threadid', 'threadname', 'tierName', 'appName', 'hotspotstarttimestamp', 'hotspotduration', 'totalDuration', 'threadstate', 'threadpriority', 'threadstackdepth'
    ];
    if ((this.commonService.showIPSummary == false || this.commonService.hsFlag == false) && this._ddrData.splitViewFlag == false && this.commonService.openCurrentFlowpathTab == false) {
      console.log('making action calls for Action');
      this.colsForIP.splice(0, 0, { field: 'action', header: 'Action', toolTip: 'Action Links', width: 28, action: true, align: 'left' });
    }
    this.columnOptionsForHotspot = [];
    for (let i = 0; i < this.colsForHotspot.length; i++) {
      this.columnOptionsForHotspot.push({ label: this.colsForHotspot[i].header, value: this.colsForHotspot[i].field });
    }

    this.visibleColsForStackTrace = [
      'frameNo', 'className', 'lineNo', 'methodName', 'packageName', 'elapsedTime'
    ];

    this.columnOptionsForStackTrace = this.colsForStackTrace;
    //for (let i = 0; i < this.colsForStackTrace.length; i++) {
    //this.columnOptionsForStackTrace.push({ label: this.colsForStackTrace[i].header, value: this.colsForStackTrace[i].field });
    // }

    this.visibleColsForIP = [
      'action', 'renamebackendIPname', 'backendType', 'backendStartTime', 'backendDuration', 'errorCount', 'Query'
    ];

    this.columnOptionsForIP = [];
    for (let i = 0; i < this.colsForIP.length; i++) {
      this.columnOptionsForIP.push({ label: this.colsForIP[i].header, value: this.colsForIP[i].field });
    }

    if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
      this.getDCData();
    } else {
      if (this._ddrData.splitViewFlag == false)
        this.getHotspotData();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      this.commonService.testRun = '';
      this.commonService.selectedDC = '';
    }
  }


  openFPByIntegrationReport(rowData: any, flag: string) {
    try {
      console.log('rowData------>', rowData);
      let fpdata = {};
      console.log(this.id);
      fpdata['tierId'] = this.selectedHotspot.tierid;
      fpdata['serverId'] = this.selectedHotspot.serverid;
      fpdata['appId'] = this.selectedHotspot.appid;
      fpdata['tierName'] = this.selectedHotspot.tierName;
      fpdata['serverName'] = this.selectedHotspot.serverName;
      fpdata['appName'] = this.selectedHotspot.appName;
      fpdata['backendId'] = rowData.backendId;
      fpdata['fpInst'] = rowData.fpInstance;
      fpdata['seqno'] = rowData.seqNumber;
      fpdata['backendSubType'] = rowData.backendSubType;
      if (this.id.startTimeInMs != undefined) {
        fpdata['startTime'] = this.id.startTimeInMs - 90000;
        fpdata['endTime'] = Number(this.id.startTimeInMs) + Number(this.id.fpDuration) + 90000;
      } else {
        fpdata['startTime'] = this.id.startTime;
        fpdata['endTime'] = this.id.endTime
      }
      if (flag === 'FPByResTime') {
        fpdata['maxresTimeOfBackend'] = Number(this.id.fpDuration);
      }
      this._ddrData.splitViewFlag = false;
      console.log('Flowpath data===', fpdata);
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
      this._ddrData.IPByFPFlag = true;
      this.commonService.IPByFPData = fpdata;
      if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
        this._router.navigate(['/home/ddrCopyLink/flowpath']);
      } else {
        this._router.navigate(['/ddr/flowpath']);
      }
    } catch (error) {
      console.log('Error in opening FP Report---', error);
    }
  }

  getSelected(event) {
  }

  getGraphKey() {
    if (this.id.restDrillDownUrl == undefined || this.id.restDrillDownUrl == 'undefined') {
      this.graphKey = this.commonService.strGraphKey;
    } else {
      return this.ddrRequest.getDataUsingGet(this.id.restDrillDownUrl).subscribe(data => (this.doAssigngraphKey(data)));
    }
  }

  doAssigngraphKey(res: any) {
    this.graphKey = res.graphTimeKey;
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName;
    if (this._ddrData.isFromtrxFlow) {
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.id.testRun = this._ddrData.testRunTr;
      this.testRun = this._ddrData.testRunTr;
      //   return hostDCName;
    }
    else {
      hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
        //hostDcName =   this._ddrData.host + ':' +this._ddrData.port ;
        this.id.testRun = this._ddrData.testRun;
        this.testRun = this._ddrData.testRun;
        console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
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
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
      this.strTitle = "Netstorm - HotSpots - Test Run : " + this.id.testRun;
    else
      this.strTitle = "Netdiagnostics Enterprise - HotSpots - Session : " + this.id.testRun;
  }

  getHotspotData() {
    let rowData: any;
    if (this.commonService.hsFlag === true) {
      rowData = this.commonService.hsData;
    }
    let url = '';
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   url = "//" + this.getHostUrl();
      // }
      // else
      url = this.getHostUrl();

      console.log("urllll formeddddd", url);
    }

    else {
      //this.showDCMenu = true;
      this.dcProtocol = this.commonService.protocol;

      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
    }
    if (this.commonService.enableQueryCaching == 1) {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun;
    }
    else {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?testRun=" + this.id.testRun;
    }
    console.log("isFilterFromSideBar--", this.commonService.isFilterFromSideBar);
    let urlParam = "";

    if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.hotspotFilters).length != 0) // sidebar filters to hotspot 
    {
      let hsParam = this.commonService.hotspotFilters;
      if (this.commonService.isValidParamInObj(hsParam, 'pubicIP') && this.commonService.isValidParamInObj(hsParam, 'publicPort') && this.commonService.isValidParamInObj(hsParam, 'ndeTestRun')) {
        if (this.commonService.enableQueryCaching == 1) {
          url = hsParam['ndeProtocol'] + "://" + hsParam['pubicIP'] + ":" + hsParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?cacheId=' + hsParam['ndeTestRun'] + '&testRun=' + hsParam['ndeTestRun'];
        }
        else {
          url = hsParam['ndeProtocol'] + "://" + hsParam['pubicIP'] + ":" + hsParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?testRun=' + hsParam['ndeTestRun'];
        }
        // this.second_url = hsParam['ndeProtocol'] + "://" + hsParam['pubicIP'] + ":" + hsParam['publicPort'] + '/' + this.id.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?testRun=' + hsParam['ndeTestRun'];
        // this.IP_url = hsParam['ndeProtocol'] + "://" + hsParam['pubicIP'] + ":" + hsParam['publicPort'] + '/' + this.id.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/backendNameForHotspot?testRun=' + hsParam['ndeTestRun'];
        console.log("url--", url);
      }
      urlParam = this.commonService.makeParamStringFromObj(hsParam);
      url += urlParam;
      console.log("side bar case --hotspot param filter---", hsParam);
      console.log("side bar case --hotspot final url---", url);

      return this.ddrRequest.getDataUsingGet(url).subscribe(
        data => { this.doAssignValueHotspot(data) },
        error => {
          this.loading = false;
          if (error.hasOwnProperty('message')) {
            this.commonService.showError(error.message);
          }
          else {
            if (error.hasOwnProperty('statusText')) {
              this.commonService.showError(error.statusText);
              console.error(error);
            }
          }
        });
    } else if (this.id.fromSession === '1' || (this._ddrData.isFromtrxFlow && (!rowData || !rowData.data || rowData.data.length == 0))) {
      let hsParam = this.id;
      if (hsParam["startTime"] || hsParam["endTime"]) {
        hsParam["strStartTime"] = hsParam["startTime"];
        hsParam["strEndTime"] = hsParam["endTime"];
        delete hsParam["startTime"];
        delete hsParam["endTime"];
      }
      urlParam = this.commonService.makeParamStringFromObj(hsParam);
      this.commonService.hotspotFilters = hsParam;
      url += urlParam;
      console.log('--hotspot param filter---', hsParam);
      console.log(' --hotspot final url---', url);
      return this.ddrRequest.getDataUsingGet(url).subscribe(
        data => { this.doAssignValueHotspot(data) },
        error => {
          this.loading = false;
          if (error.hasOwnProperty('message')) {
            this.commonService.showError(error.message);
          }
          else {
            if (error.hasOwnProperty('statusText')) {
              this.commonService.showError(error.statusText);
              console.error(error);
            }
          }
        });
    }
    // ED TO HOTSPOT
    else if (rowData == undefined) // ED TO DDR CASE - ROWDATA WILL BE UNDEFINED
    {
      if (this.id.fpDuration) {
        if (this.id.fpDuration.toString().includes(','))
          this.id.strEndTime = Number(this.id.startTimeInMs) + Number(this.id.fpDuration.toString().replace(/,/g, ""));
        else if (this.id.fpDuration == '< 1') {
          this.id.strEndTime = Number(this.id.startTimeInMs) + Number(0);
        }
        else
          this.id.strEndTime = Number(this.id.startTimeInMs) + Number(this.id.fpDuration);
      }
      else {
        this.id.startTimeInMs = this.id.startTime;
        this.id.strEndTime = this.id.endTime;
      }

      console.log('id----->>>>>', this.id);
      urlParam = '&tierId=' + this.id.tierId +
        '&appId=' + this.id.appId +
        '&serverId=' + this.id.serverId +
        '&appName=' + this.id.appName +
        '&serverName=' + this.id.serverName +
        '&tierName=' + this.id.tierName +
        '&strStartTime=' + (this.id.startTimeInMS || this.id.startTimeInMs) +
        '&strEndTime=' + (this.id.strEndTimeMS || this.id.strEndTime);

      if (this.columnData == undefined) {
        console.log('m i here');
        urlParam += '&threadId=' + this.compareFPInfo['threadId'] +
          '&btCategory=' + this.compareFPInfo['btCatagory'] +
          '&urlName=' + this.compareFPInfo['urlName'] +
          '&urlIndex=' + this.compareFPInfo['urlIndex'] +
          '&flowpathInstance=' + this.compareFPInfo['flowpathInstance'];
      } else {
        console.log('or m i here', this.columnData);
        urlParam += '&btCategory=' + this.id.btCatagory +
          '&urlName=' + this.id.urlName +
          '&urlIndex=' + this.id.urlIndex +
          '&flowpathInstance=' + this.id.flowpathInstance;
        let instanceType = this.id.instanceType || this.columnData.Instance_Type;
        if (instanceType) {
          if (instanceType === "NodeJS") {
            //console.log('i m inside instance type');
            urlParam += '&instanceType=' + this.id.Instance_Type || this.columnData.Instance_Type;
          }
          if (instanceType.toLowerCase() !== "dotnet") {
            urlParam += '&threadId=' + this.id.threadId;
          }
        }
        else
          urlParam += '&threadId=' + this.id.threadId;
      }
      this.commonService.hotspotFilters = this.commonService.makeObjectFromUrlParam(urlParam);
      setTimeout(() => {
        this.messageService.sendMessage(this.commonService.hotspotFilters);
      }, 2000);
      url += urlParam;
      console.log("final url created in ED to hotspot case---", url);
      console.log("hotspotFilters--", JSON.stringify(this.commonService.hotspotFilters));
      return this.ddrRequest.getDataUsingGet(url).subscribe(
        data => { this.doAssignValueHotspot(data) },
        error => {
          this.loading = false;
          if (error.hasOwnProperty('message')) {
            this.commonService.showError(error.message);
          }
          else {
            if (error.hasOwnProperty('statusText')) {
              this.commonService.showError(error.statusText);
              console.error(error);
            }
          }
        }
      );
    }
    else {
      //hsData from common service could be data from flowpath-hotspot or transactionflowmap-hotspot.
      return this.doAssignValueHotspot(rowData);
    }
  }

  doAssignValueHotspot(res: any) {
    this.commonService.isFilterFromSideBar = false;
    console.log('hotpspot data------------>', res.data);
    this.commonService.hotspotFilters['startTimeInDateFormat'] = res.startTime;
    this.commonService.hotspotFilters['endTimeInDateFormat'] = res.endTime;
    this.createFilterCriteria();
    this.loading = false;
    if (res.hasOwnProperty('Status')) {
      this.commonService.showError(res.Status);
    }
    this.hotspotData = res.data;
    console.log('this.hotSpotInfo---->', this.hotspotData);
    this.hotspotDataCount = this.hotspotData.length;
    if (this.hotspotData.length != 0) {
      this.mergeData = this.hotspotData;
    }
    if (this.mergeData.length > 1 && (this.commonService.hsFlag == true || Object.keys(this.compareFPInfo).length > 0)) {
      this.mergeFlag = true;
      sessionStorage.setItem("isMerged", "false");
    }
    this.StateCount = res.threadStateCount;
    this.stackDepthCount = res.stackDepthCount;

    if (this.hotspotData.length > 10) { //If data is less then 10 then no pagination .
      this.showPagination = true;
    } else {
      this.showPagination = false;
    }
    if (this.hotspotData.length == 0) //If no data found. blank stack trace table
    {
      this.hotSpotSecInfo = [];
      this.IPInfo = [];
      this.aggIpInfo = [];
      this.stackTraceFilter = "";
      this.showDownLoadReportIcon = false;
      this.empty = true;
    }
    else
      this.showDownLoadReportIcon = true;
    this.hotSpotInfo = this.getHotspotInfo();
    this.threadinfo = this.hotSpotInfo;
    this.createPieChart(this.StateCount);
    this.createBarChart(this.stackDepthCount);
  }

  getDCData() {
    let url = this.getHostUrl() + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.id.testRun;
    //this.http.get(url).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any>res;
      console.log('COMPONENT - Hotspot , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
      if (data.length == 0) {
        data = this.setNDEInfoForSingleDC();
        console.log("data is ", data);
      } if (this.commonService.dcNameList.indexOf(',') != -1) {
        this.getNDEInfo(data)
      } else {
        this.singleDCCase(data);
      }
    },
      error => {
        console.log("multiDC request is getting failed");
      });
  }

  // setNDEInfoForSingleDC(){
  //   let data = [{"displayName": this.id.dcName,"ndeId": 1,"ndeIPAddr": this.id.dcIP,"ndeTomcatPort": this.id.dcPort,"ndeCtrlrName": "","pubicIP": this.id.dcIP,"publicPort": this.id.dcPort,"isCurrent": 1,"ndeTestRun":this.id.testRun,"ndeProtocol":location.protocol.replace(":","")}];
  //   return data;
  // }  

  setNDEInfoForSingleDC() {
    let data;
    if (this.id.dcName)
      data = [{ "displayName": this.id.dcName, "ndeId": 1, "ndeIPAddr": this.id.dcIP, "ndeTomcatPort": this.id.dcPort, "ndeCtrlrName": "", "pubicIP": this.id.dcIP, "publicPort": this.id.dcPort, "isCurrent": 1, "ndeTestRun": this.id.testRun, "ndeProtocol": location.protocol.replace(":", "") }];
    else if (this.commonService.host) {
      let protocol;
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        protocol = this.commonService.protocol.replace("://", "");
      else
        protocol = location.protocol.replace(":", "");

      data = [{ "displayName": this.commonService.selectedDC, "ndeId": 1, "ndeIPAddr": this.commonService.host, "ndeTomcatPort": this.commonService.port, "ndeCtrlrName": "", "pubicIP": this.commonService.host, "publicPort": this.commonService.port, "isCurrent": 1, "ndeTestRun": this.commonService.testRun, "ndeProtocol": protocol }];
    }
    return data;
  }


  singleDCCase(res) {
    this.ndeInfoData = res;
    this.selectedDC = this.commonService.dcNameList;
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.commonService.dcNameList == this.ndeInfoData[i].displayName) {

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.protocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.testRun = this.ndeInfoData[i].ndeTestRun;
          this.id.testRun = this.ndeInfoData[i].ndeTestRun;
        } else
          this.testRun = this.id.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.protocol;
        this.commonService.testRun = this.testRun;
        console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getHotspotData();
  }


  getTierNamesForDC(dcName) {
    try {
      return new Promise<void>((resolve, reject) => {
        console.log('getting tiername');
        var tierList = "";
        console.log('this.commonService.tierNameList====>', this.commonService.tierNameList);
        if (this.commonService.tierNameList && this.commonService.tierNameList.toString().indexOf(",") !== -1) {
          var allTierDClistArr = this.commonService.tierNameList.split(",");
          for (var i = 0; i < allTierDClistArr.length; i++) {
            if (allTierDClistArr[i].startsWith(dcName)) {
              var temp = (allTierDClistArr[i]).substring(dcName.length + 1);
              tierList += temp + ",";
            }
          }


          console.log("after removing dcName from tierList ***** " + tierList);
          if (tierList == "")
            tierList = this.commonService.tierNameList;

          if (tierList)
            this.id.tierName = tierList;
        }
        else {
          if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
            temp = (this.commonService.tierNameList).substring(dcName.length + 1);
            tierList = temp;
            tierList = tierList.substring(0, tierList.length);
            if (tierList != "") {
              this.id.tierName = tierList;
              this.commonService.fpFilters['tierName'] = tierList;
            }
          } else {
            this.id.tierName = this.commonService.tierNameList;
            this.commonService.fpFilters['tierName'] = this.commonService.tierNameList;
          }
        }
        console.log('tierName=====>', this.id.tierName);
        this.getTieridforTierName(this.id.tierName).then(() => resolve());
      });
    } catch (e) {
      console.log('exception in here==============', e);
    }
  }

  // getNDEInfo(res) {
  //   this.showDCMenu = true;
  //   this.ndeInfoData = res;
  //   this.dcList = [];
  //   let dcName = this.commonService.dcNameList.split(',');
  //   let isFirst = false;
  //   for (let i = 0; i < this.ndeInfoData.length; i++) {
  //     if (dcName[i])
  //       this.dcList.push({ label: dcName[i], value: dcName[i] });

  //     if (this.commonService.selectedDC && this.commonService.selectedDC != 'ALL') {
  //       this.selectedDC = this.commonService.selectedDC;
  //     }
  //     else {
  //       if (this.ndeInfoData[i].isCurrent == 1 && dcName.indexOf(this.ndeInfoData[i].displayName) != -1) {
  //         this.selectedDC = this.ndeInfoData[i].displayName;
  //         isFirst = true;
  //       } else if (i == (this.ndeInfoData.length - 1) && !isFirst)
  //         this.selectedDC = this.dcList[0];
  //     }
  //     if (this.selectedDC == this.ndeInfoData[i].displayName) {
  //       this.ndeCurrentInfo = this.ndeInfoData[i];
  //     }
  //   }
  //   this.getSelectedDC();
  // }

  getNDEInfo(res) {
    // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'HotSpot Thread Details')
    if (this.breadcrumb && this.breadcrumb[0].label == 'HotSpot Thread Details')
      this.showDCMenu = true;

    this.ndeInfoData = res;
    this.dcList = [];
    let dcName = this.commonService.dcNameList.split(',');
    let isFirst = false;

    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (dcName[i])
        this.dcList.push({ label: dcName[i], value: dcName[i] });

      if (this.commonService.selectedDC && this.commonService.selectedDC !== 'ALL') {
        this.selectedDC = this.commonService.selectedDC;
        console.log("this selected dc ", this.selectedDC);
      }
      else {
        console.log("else case")
        if (this.ndeInfoData[i].isCurrent == 1 && dcName.indexOf(this.ndeInfoData[i].displayName) != -1) {
          this.selectedDC = this.ndeInfoData[i].displayName;
          isFirst = true;
          console.log("Else case this selected dc ", this.selectedDC);
        } else if (i == (this.ndeInfoData.length - 1) && !isFirst)
          this.selectedDC = this.dcList[0];
        console.log("else if case isFirst false ", this.selectedDC);
      }
      if (this.selectedDC == this.ndeInfoData[i].displayName) {
        this.ndeCurrentInfo = this.ndeInfoData[i];
        console.log("if length case  ", this.selectedDC);
      }
    }

    if (dcName.length > this.ndeInfoData.length) {
      this.dcList = [];
      for (let k = 0; k < dcName.length; k++) {
        this.dcList.push({ label: dcName[k], value: dcName[k] });
      }
      console.log("this.dcList ==== ", this.dcList)
    }
    this.getSelectedDC();
  }

  getTieridforTierName(tierName) {
    return new Promise<void>((resolve, reject) => {
      try {

        console.log('reached here');
        var url = '';
        if (this.ndeCurrentInfo != undefined && this.ndeCurrentInfo != null && this.ndeCurrentInfo != '') {
          if (this.ndeCurrentInfo.ndeProtocol != undefined && this.ndeCurrentInfo.ndeProtocol != null && this.ndeCurrentInfo.ndeProtocol != '') {
            let protocol = this.ndeCurrentInfo.ndeProtocol;
            if (protocol.endsWith(":"))
              protocol = protocol.replace(":", "");

            url = protocol + '://' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          }
          else
            url = '//' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
        }
        else {
          // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
          //     url = "//" + this.getHostUrl();
          // }
          // else
          url = this.getHostUrl();
        }
        url += '/' + this.id.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.id.testRun + "&tierName=" + tierName;
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
          this.assignTierID(data)
          resolve();
        });
      } catch (e) {
        console.log('exception in making rest=====', e);
      }
    });
  }

  assignTierID(res) {
    try {
      var temp = res.split(":");
      this.id.tierid = temp[0].trim();
    } catch (e) {
      console.log('exception in getting tier id=====', e);
    }
  }

  getSelectedDC($event?) {
    if ($event) {
      this.selectedDC = $event.value;
      console.log("calling from dcMenu select case ", $event.value);
    }
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.selectedDC == this.ndeInfoData[i].displayName) {

        this.ndeCurrentInfo = this.ndeInfoData[i];

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.dcProtocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.testRun = this.ndeInfoData[i].ndeTestRun;
          this.id.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.id.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.dcProtocol;
        this.commonService.testRun = this.testRun;
        this.commonService.selectedDC = this.selectedDC;
        console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.getHotspotData();
    })
  }


  createPieChart(data: any) {
    this.loading = false;
    this.chartData = data;
    // if(this.chartData.length == 0)
    // {
    //    this.showChart = false;
    // }
    // else
    // {
    //   this.showChart = true;
    // }

    var ThreadInfoArr = [];
    var keys = Object.keys(this.chartData[0]);
    var count = this.chartData[0]
    for (var j = 0; j < keys.length; j++) {

      if (count[keys[j]] != 0) {
        if (keys[j] == 'WAITING') {
          ThreadInfoArr.push({
            color: '#FFFF00',
            "name": keys[j],
            "y": Number(count[keys[j]])
          });
        } else if (keys[j] == 'RUNNABLE' || keys[j] == 'Running') {
          ThreadInfoArr.push({
            color: '#00FF00',
            "name": keys[j],
            "y": Number(count[keys[j]])
          });
        } else if (keys[j] == 'BLOCKED') {
          ThreadInfoArr.push({
            color: '#FF0000',
            "name": keys[j],
            "y": Number(count[keys[j]])
          });
        } else if (keys[j] == 'TIMED_WAITING') {
          ThreadInfoArr.push({
            color: '#FFD700',
            "name": keys[j],
            "y": Number(count[keys[j]])
          });
        } else if (keys[j] == 'NEW') {
          ThreadInfoArr.push({
            color: '#ADFF2F',
            "name": keys[j],
            "y": Number(count[keys[j]])
          });
        } else if (keys[j] == 'TERMINATED') {
          ThreadInfoArr.push({
            color: '#8B0000',
            "name": keys[j],
            "y": Number(count[keys[j]])
          });
        }
      }
    }

    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      legend: {
        itemWidth: 300,
      },
      title: { text: 'HotSpot Threads By State', style: { 'fontSize': '13px' } },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: false,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
          showInLegend: true
        }
      },
      series: [
        {
          name: 'Percentage',
          data: ThreadInfoArr,
          enableMouseTracking: true
        }
      ]
    };
  }

  clickHandler(event) {
    this.showAllOption = true;
    let filteredhotspotdata = [];
    this.threadinfo.forEach((val, index) => {
      if (val['threadstate'] == event.point.name) {
        filteredhotspotdata.push(val);
      }

    });

    if (filteredhotspotdata.length > 0) {
      this.hotSpotInfo = filteredhotspotdata;
      this.passDataForStackTrace(filteredhotspotdata[0]);
      this.selectItem = filteredhotspotdata[0];
    }


  }

  createBarChart(data) {
    this.Barinfo = data;
    let Stackdeptharr = [];

    let keys = Object.keys(this.Barinfo);
    for (let i = 0; i < keys.length; i++) {

      Stackdeptharr.push({ "name": keys[i], "y": Number(this.Barinfo[keys[i]]) });
    }


    // if (this.stackDepthCount.length == 0  ) {
    //   this.showBarChart = false;
    // } else {
    //   this.showBarChart = true;
    // }

    this.options1 = {
      chart: {
        type: 'column'
      },
      title: { text: 'HotSpot Threads By Stack Depth', style: { 'fontSize': '13px' } },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        labels:
        {
          enabled: false
        },
        title: {
          text: 'StackDepth'
        }
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: 'Count'
        }
      },
      tooltip: {
        headerFormat: '<table><tr><td style="color:{series.color};padding:0">StackDepth:</td>' + '<td style="padding:0"><b>{point.key}</b></td></tr>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions1: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Count',
          enableMouseTracking: true,
          data: Stackdeptharr,
          pointWidth: 25
        }],

    }
  }

  Refresh() {
    this.showAllOption = false;
    this.hotSpotInfo = this.threadinfo;
    this.createPieChart(this.StateCount);
    this.passDataForStackTrace(this.hotSpotInfo[0]);
    this.selectItem = this.hotSpotInfo[0];
    this.createBarChart(this.stackDepthCount);
  }


  getHotspotInfo() {
    var arrHotSpotData = [];
    var totalHSDuration: string = "0";
    var tempTierId = "";
    var tempServerId = "";
    var tempAppId = "";
    let tempid = 0;
    for (var i = 0; i < this.hotspotData.length; i++) {
      if (i == 0) //for first time thread header information in table
      {
        this.passDataForStackTrace(this.hotspotData[i]);
        this.selectItem = this.hotspotData[i];
      }
      if (tempid == 0) {
        tempTierId = this.hotspotData[i]["tierid"];
        tempServerId = this.hotspotData[i]["serverid"];
        tempAppId = this.hotspotData[i]["appid"];
        tempid = this.hotspotData[i]["threadid"];
      }
      if (tempTierId == this.hotspotData[i]["tierid"] && tempServerId == this.hotspotData[i]["serverid"] && tempAppId == this.hotspotData[i]["appid"] && tempid == this.hotspotData[i]["threadid"]) {
        totalHSDuration = (Number(totalHSDuration) + Number(this.hotspotData[i]["hotspotduration"])).toFixed(3);
      } else {
        totalHSDuration = "0";
        tempTierId = this.hotspotData[i]["tierid"];
        tempServerId = this.hotspotData[i]["serverid"];
        tempAppId = this.hotspotData[i]["appid"];
        tempid = this.hotspotData[i]["threadid"];
        totalHSDuration = (Number(totalHSDuration) + Number(this.hotspotData[i]["hotspotduration"])).toFixed(3);
      }
      var hsDur = this.numberToLocalString(this.hotspotData[i]["hotspotduration"]);
      arrHotSpotData[i] = { tierid: this.hotspotData[i]["tierid"], serverid: this.hotspotData[i]["serverid"], appid: this.hotspotData[i]["appid"], threadid: this.hotspotData[i]["threadid"], hotspotstarttimestamp: this.hotspotData[i]["hotspotstarttimestamp"], hotspotduration: hsDur, threadstate: this.hotspotData[i]["threadstate"], threadpriority: this.hotspotData[i]["threadpriority"], threadstackdepth: this.hotspotData[i]["threadstackdepth"], FlowPathInstance: this.hotspotData[i]["FlowPathInstance"], threadname: this.hotspotData[i]["threadname"], hsTimeInMs: this.hotspotData[i]["hsTimeInMs"], toolTipTextForHsDur: this.hotspotData[i]["toolTipTextForHsDur"], hsDurationInMs: this.hotspotData[i]["hsDurationInMs"], hotspotElapsedTime: this.hotspotData[i]["hotspotElapsedTime"], strStartTime: this.hotspotData[i]["strStartTime"], strEndTime: this.hotspotData[i]["strEndTime"], instanceType: this.hotspotData[i]["instanceType"], tierName: this.hotspotData[i]["tierName"], serverName: this.hotspotData[i]["serverName"], appName: this.hotspotData[i]["appName"], totalDuration: totalHSDuration };
    }
    return arrHotSpotData;
  }

  passDataForStackTrace(data: any) {
    this.removeColField();
    this.selectedHotspot = data;
    //dynamic creation for stack trace header info
    this.stackTraceFilter = `( Thread Id: ${data.threadid}, HotSpot EntryTime: ${data.hotspotstarttimestamp} , Hotspot Duration: ${data.hotspotduration} seconds)`;
    this.stackTraceFilterToolTip = `Thread Id: ${data.threadid} \nThread Name: ${data.threadname} \nHotSpot EntryTime: ${data.hotspotstarttimestamp} \nHotspot Duration: ${data.hotspotduration} seconds`;
    this.filterCriteriaagg = this.stackTraceFilter;
    console.log("stacktrace filter----" + this.stackTraceFilter);
    let second_url: string = '';
    let IP_url = '';

    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   second_url =  decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""));
      //   IP_url =  decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""));
      // }
      // else {
      second_url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/", ""));
      IP_url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/", ""));
      // }
    }
    else {
      this.dcProtocol = this.commonService.protocol;
      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        second_url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        IP_url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        second_url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        IP_url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        this.dcProtocol = this.commonService.protocol;
      } else {
        second_url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        IP_url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        this.dcProtocol = location.protocol;
      }
    }

    console.log("second url data-----------", data);
    if (this.commonService.enableQueryCaching == 1) {
      second_url += "/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" +
        data.serverid + "&appId=" + data.appid + "&threadId=" + data.threadid + "&hsTimeInMs=" + data.hsTimeInMs +
        "&hotSpotDuration=" + data.hsDurationInMs + '&instanceType=' + data.instanceType;

      IP_url += "/v1/cavisson/netdiagnostics/ddr/backendNameForHotspot?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" + data.serverid + "&appId=" + data.appid + "&startTime=" + data.hotspotstarttimestamp + "&hsDuration=" + data.hsDurationInMs + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime;
    }
    else {
      second_url += "/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" +
        data.serverid + "&appId=" + data.appid + "&threadId=" + data.threadid + "&hsTimeInMs=" + data.hsTimeInMs +
        "&hotSpotDuration=" + data.hsDurationInMs + '&instanceType=' + data.instanceType;
      //   console.log("second url-----------", second_url);
      //this.loading = true;
      // this.getHotspotSecData(second_url); // Pass the URL to get Response from Rest service

      IP_url += "/v1/cavisson/netdiagnostics/ddr/backendNameForHotspot?testRun=" + this.id.testRun + "&tierId=" + data.tierid + "&serverId=" + data.serverid + "&appId=" + data.appid + "&startTime=" + data.hotspotstarttimestamp + "&hsDuration=" + data.hsDurationInMs + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime;
    }
    //if(this._ddrData.splitViewFlag){
    //  IP_url += "&flowpathInstance=" + data.FlowPathInstance;
    // }
    if (data.instanceType && data.instanceType.toLowerCase() !== "dotnet") {
      IP_url += '&threadId=' + data.threadid;

    }

    if (data.instanceType && data.instanceType == "NodeJS") {
      IP_url += '&flowpathInstance=' + data.FlowPathInstance;
      second_url += '&flowpathInstance=' + data.FlowPathInstance;
    } else if (this._ddrData.splitViewFlag || this.commonService.hsFlag) {
      console.log("we r Inside this", this._ddrData.splitViewFlag, this.commonService.hsFlag);
      IP_url += '&flowpathInstance=' + this.commonService.hotspotFilters['flowpathInstance'];
      second_url += '&flowpathInstance=' + this.commonService.hotspotFilters['flowpathInstance'];

    }

    console.log("second url-----------", second_url);
    console.log("IP_url ******* ", IP_url);
    this.loading = true;
    this.getHotspotSecData(second_url); // Pass the URL to get Response from Rest service
    this.getbackendData(IP_url);
  }
  removeColField(): any {
    if (this.colsForStackTrace[4]) {
      this.colsForStackTrace[4].width = '250';
    }
    if (this.colsForStackTrace[6] != undefined) {
      this.colsForStackTrace.pop();
      //  this.visibleColsForStackTrace.pop();
      //  this.columnOptionsForStackTrace.pop();
    }
  }


  numberToLocalString(num) {
    return num.toLocaleString();
  }

  getHotspotSecData(url: any) {
    //console.log("second url===="+second_url);
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignValueSecHotspot(data)));

  }

  doAssignValueSecHotspot(res: any) {
    this.loading = false;
    this.hotspotSecData = res.treedata;
    this.hotSpotSecInfo = res.treedata;
    this.downloadJSON = res.downloadJSON;
    this.mergeDataDownloadFlag = false;
    console.log('this.downloadJSON----->', this.downloadJSON);
  }

  //Store value fot thread stack trace data
  getHotspotSecInfo(): Array<StackTraceInterface> {
    var arrHotSpotSecData = [];
    for (let i = 0; i < this.hotspotSecData.length; i++) {
      arrHotSpotSecData[i] = { 0: this.hotspotSecData[i]["0"], 1: this.hotspotSecData[i]["1"], 2: this.hotspotSecData[i]["2"], 3: this.hotspotSecData[i]["3"], 4: (i + 1), 5: this.hotspotSecData[i]["5"], 6: this.hotspotSecData[i]["6"], 7: this.hotspotSecData[i]["7"] };
    }
    return arrHotSpotSecData;
  }

  getbackendData(backendDataUrl: any) {
    // console.log("IP url===="+IP_url);
    return this.ddrRequest.getDataUsingGet(backendDataUrl).subscribe(data => (this.doAssignValueBackendData(data)));
  }

  doAssignValueBackendData(data: any) {
    console.log("data value-------", data);
    this.loading = false;
    this.renamebackendNameMap = data.renamebackendNameMap;
    this.actualBackendNameMap = data.actualBackendNameMap;
    this.backendSubTypeNameMap = data.backendSubTypeNameMap;
    let backendInfoList = data.backendInfoList;


    this.backendData = backendInfoList;
    console.log("rest data------", data.aggDataForBackends)
    console.log("condition value--------", (data.aggDataForBackends && Object.keys(data.aggDataForBackends).length != 0));
    if (data.aggDataForBackends && Object.keys(data.aggDataForBackends).length != 0) {
      console.log("aggregate case-------------");
      this.aggCase = true;
      this.aggIpInfo = data.aggDataForBackends;
    }
    else {
      console.log("previous  case-------------");
      this.aggCase = false;
      this.IPInfo = this.getIPinfo();
      if (this.IPInfo.length > 10) { //If data is less then 10 then no pagination .
        this.showPaginationIP = true;
      } else {
        this.showPaginationIP = false;
      }
    }
  }

  getIPinfo(): Array<IPInfoInterface> {
    var arrbackendData = [];
    for (var i = 0; i < this.backendData.length; i++) {
      arrbackendData[i] = {
        renamebackendIPname: this.renamebackendNameMap[this.backendData[i]["backendId"]],
        actualbackendIPname: this.actualBackendNameMap[this.backendData[i]["backendId"]].replace(/&#46;/g, '.'),
        backendType: this.BackendTypeName(this.backendData[i]["backendType"]),
        backendDuration: this.backendData[i]["backendDuration"],
        backendStartTime: this.backendData[i]["backendStartTime"],
        errorCount: this.HotspotStatus(this.backendData[i]["errorCount"]),
        Query: this.commonService.getBackendSubType(this.backendData[i]["backendSubType"], this.backendSubTypeNameMap),
        starttimeInMs: this.backendData[i]["starttimeInMs"],
        fpInstance: this.backendData[i]["fpInstance"],
        seqNumber: this.backendData[i]["seqNumber"],
        backendId: this.backendData[i]["backendId"],
        backendSubType: this.backendData[i]["backendSubType"],
        networkreq: this.commonService.formatterFixed(this.backendData[i]["networkreq"]),
        networkres: this.commonService.formatterFixed(this.backendData[i]["networkres"]),
      };
    }
    return arrbackendData;
  }



  openIPHealthScreen(nodeData: any) {
    //  let endtime = Number(nodeData.starttimeInMs) + Number(nodeData.backendDuration.toString().replace(/\./g,""));
    //  let ipPortArr = this.getHostUrl().split(':');
    //  let ip = ipPortArr[0].substring(2);
    //  let port = ipPortArr[1];
    //  var url = '';
    //  console.log("nodedata=======",nodeData);
    //  if(this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
    //   url =  this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + "/" + this.id.product.replace("/","") + "/analyze/drill_down_queries/drillDownRequestHandler.jsp?testRun="+this.id.testRun+"&strOperName=setQueryObject&reportType=flowpath&WAN_ENV=0&radRunPhase=0&testMode=W&isGroupByURL=true&isFromED=true&breadCrumbTrackID=1&strGraphKey="+this.graphKey+"&btCategory=intHealth&tierName="+this.id.tierName+"&dcName=&object=4&statusCode=-2&dcNameList=&isAll=null&flowmapName=default&nonZeroIP=false&dcIP="+this.commonService.host+"&dcPort="+this.commonService.port+"&strStartTime="+nodeData.starttimeInMs+"&strEndTime="+endtime+"&isExMode=1&strTSList="+nodeData.starttimeInMs+"&endTSList="+endtime+"&backendActualName="+(encodeURIComponent(nodeData.actualbackendIPname));    
    //  }else {
    //   url =  this.getHostUrl() + "/" + this.id.product.replace("/","") + "/analyze/drill_down_queries/drillDownRequestHandler.jsp?testRun="+this.id.testRun+"&strOperName=setQueryObject&reportType=flowpath&WAN_ENV=0&radRunPhase=0&testMode=W&isGroupByURL=true&isFromED=true&breadCrumbTrackID=1&strGraphKey="+this.graphKey+"&btCategory=intHealth&tierName="+this.id.tierName+"&dcName=&object=4&statusCode=-2&dcNameList=&isAll=null&flowmapName=default&nonZeroIP=false&dcIP="+ip+"&dcPort="+port+"&strStartTime="+nodeData.starttimeInMs+"&strEndTime="+endtime+"&isExMode=1&strTSList="+nodeData.starttimeInMs+"&endTSList="+endtime+"&backendActualName="+(encodeURIComponent(nodeData.actualbackendIPname));
    //  }
    this.commonService.hotspotToIP = true;
    this._ddrData.splitViewFlag = false;
    this.commonService.hotspotToIPData = nodeData;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.HOTSPOT;
    if (this._router.url.indexOf('/home/ddrCopyLink') != -1) {
      this._router.navigate(['/home/ddrCopyLink/IpStatComponent']);
    } else {
      this._router.navigate(['/ddr/IpStatComponent']);
    }
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
    if (fieldValue == "hotspotduration" || fieldValue == "totalDuration") {
      if (event.order == -1) {
        event.order = 1
        hotSpotInfo = hotSpotInfo.sort(function (a, b) {
          var value = parseFloat(a[fieldValue]);
          var value2 = parseFloat(b[fieldValue]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        event.order = -1;
        //asecding order
        hotSpotInfo = hotSpotInfo.sort(function (a, b) {
          var value = parseFloat(a[fieldValue]);
          var value2 = parseFloat(b[fieldValue]);
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
    if (fieldValue == "4") {
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



  openFPReport(rowData) {
    let reqData = {};
    console.log("Row data is row data:", rowData);
    if (rowData != undefined) {
      let threadId = "NA";
      if (rowData.instanceType.toLowerCase() != 'dotnet')
        threadId = rowData.threadid;
      var flowpathEndTime = (Number(rowData.hsTimeInMs) + Number(rowData.hsDurationInMs)).toString();
      reqData["hsEndTime"] = (Number(rowData.hsTimeInMs) + Number(rowData.hsDurationInMs) + 900000).toString();
      reqData["tierId"] = rowData.tierid;
      reqData["serverId"] = rowData.serverid;
      reqData["appId"] = rowData.appid;
      reqData["tierName"] = this.id.tierName;
      reqData["serverName"] = this.id.serverName;
      reqData["appName"] = this.id.appName;
      reqData["threadId"] = threadId;
      reqData["hsTimeInMs"] = rowData.hsTimeInMs;
      reqData["flowpathEndTime"] = flowpathEndTime;

    }
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.HOTSPOT;
    this.commonService.hstofpData = reqData;
    this._ddrData.FromhsFlag = 'true';
    if (this._router.url.indexOf("/home/ddrCopyLink/") != -1)
      this._router.navigate(['/home/ddrCopyLink/flowpath']);
    else
      this._router.navigate(['/ddr/flowpath']);
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
      return 'Success';

    else
      return 'Error';

  }

  viewExceptionReport(rowData) {
    let errorData = {};
    console.log(this.id);
    errorData["tierId"] = this.selectedHotspot.tierid;
    errorData["serverId"] = this.selectedHotspot.serverid;
    errorData["appId"] = this.selectedHotspot.appid;
    errorData["tierName"] = this.selectedHotspot.tierName;
    errorData["serverName"] = this.selectedHotspot.serverName;
    errorData["appName"] = this.selectedHotspot.appName;
    errorData["backendId"] = rowData.backendId;
    errorData["fpInst"] = rowData.fpInstance;
    errorData["seqno"] = rowData.seqNumber;
    errorData["backendSubType"] = rowData.backendSubType;
    //alert(this.id.startTimeInMs+">>>> startTime>>>>>"+Number(this.id.startTimeInMs)+Number(this.id.fpDuration)+">>>>endTime" );
    if (this.id.startTimeInMs != undefined) {
      errorData["startTime"] = this.id.startTimeInMs - 90000;
      errorData['endTime'] = Number(this.id.startTimeInMs) + Number(this.id.fpDuration) + 90000;
    }
    else {
      errorData["startTime"] = this.id.startTime;
      errorData['endTime'] = this.id.endTime
    }
    this._ddrData.splitViewFlag = false;
    console.log("errordata", errorData);
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.HOTSPOT;
    this.commonService.hstoexData = errorData;
    this._ddrData.flowpathToExFlag = false;
    this.commonService.fromhstoExpFlag = true;
    this.commonService.hsDataFromED = this.id;
    if (this._router.url.indexOf("/home/ddrCopyLink/") != -1)
      this._router.navigate(['/home/ddrCopyLink/exception']);
    else
      this._router.navigate(['/ddr/exception']);
  }
  /**
   * Merge All StackTrace
   */
  mergeAllStackTrace() {
    this.loading = true;
    // this.commonService.loaderForDdr = true;
    // if(this.colsForStackTrace[5]==undefined)  {
    //  this.colsForStackTrace.push({ field: '5', header: 'Count', sortable: false, action: true, align: 'right', width: '80' }); 
    //   this.visibleColsForStackTrace.push('5');
    //   this.columnOptionsForStackTrace.push({ label: this.colsForStackTrace[5].header, value: this.colsForStackTrace[5].field });
    // }
    console.log('array length---', this.colsForStackTrace.length)
    if (this.colsForStackTrace[6] == undefined) {
      this.colsForStackTrace.push({ field: 'count', header: 'Count', sortable: false, action: true, align: 'right', width: '20' });
      this.visibleColsForStackTrace.push('count');
      this.columnOptionsForStackTrace = this.colsForStackTrace;
    }
    // this.colsForStackTrace[4].width = '180';
    if (sessionStorage.getItem("isMerged") == "true") {
      // openMergedStackTraceTable(JSON.parse(sessionStorage.getItem(key2)));
    } else {
      // sessionStorage.setItem("isMerged", "true");
      let timeArr = [];
      let durArr = [];
      console.log('this.mergeData-------->', this.mergeData);
      for (let i = 0; i < this.mergeData.length; i++) {
        timeArr.push(this.mergeData[i].hotspotstarttimestamp);
        durArr.push(this.mergeData[i].hsDurationInMs);
      }
      let startTime = timeArr.toString();
      let hsDuration = durArr.toString();
      let cmdArgs = "";
      cmdArgs = "--testrun " + this.id.testRun +
        " --TierID " + this.mergeData[0].tierid +
        " --ServerID " + this.mergeData[0].serverid +
        " --AppID " + this.mergeData[0].appid +
        " --ThreadId " + this.mergeData[0].threadid;

      let mergeStackUrl = "";
      if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
        if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") == -1)
          this.commonService.protocol = this.commonService.protocol + "://";


        mergeStackUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
      } else {
        // if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
        // mergeStackUrl =  decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""));
        // else      
        mergeStackUrl = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/", ""));
      }
      mergeStackUrl += "/v1/cavisson/netdiagnostics/ddr/hotspotMergeData?cmdArgs=" + cmdArgs +
        "&hsStartTime=" + startTime + "&hsDuration=" + hsDuration;

      console.log('mergeUrl------', mergeStackUrl)
      return this.ddrRequest.getDataUsingGet(mergeStackUrl).subscribe(data => (this.doAssignMergeAllStackTraceData(data)));
    }
  }

  doAssignMergeAllStackTraceData(data: any) {
    console.log('merged Dta--------------***', data)
    // this.commonService.loaderForDdr = false;
    this.loading = false;
    this.hotspotSecData = data.treedata;
    this.hotSpotSecInfo = data.treedata;
    this.downloadJSON = data.downloadJSON;
    this.mergeDataDownloadFlag = true;
  }

  createFilterCriteria() {
    this.filterCriteria = "";
    this.filterTierName = '';
    this.filterServerName = '';
    this.filterInstanceName = '';
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    this.downloadFilterCriteria = '';
    this.filterDCName = '';
    this.downloadFilterCriteria = '';
    let hsParams = this.commonService.hotspotFilters;
    let dcName = "";
    dcName = this.selectedDC;

    console.log("hsParams --", JSON.stringify(hsParams));
    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
      dcName = this.selectedDC;
    }
    else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;
    }

    if (this.commonService.isValidParamInObj(hsParams, "tierName")) {
      if (dcName) {
        this.filterTierName += "DC= " + dcName + ', ';
        this.downloadFilterCriteria += "DC= " + dcName + ', ';
        if (this._ddrData.isFromtrxFlow && (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true")) {
          this.filterTierName = 'DC=' + this._ddrData.dcNameTr + ', ';
          this.downloadFilterCriteria = 'DC=' + this._ddrData.dcNameTr + ', ';
        }
      }
      if (hsParams['tierName'].length > 32) {
        this.filterTierName += 'Tier=' + hsParams['tierName'].substring(0, 32) + '...';
        this.completeTier = hsParams['tierName'];
      } else
        this.filterTierName += 'Tier=' + hsParams['tierName'];

      this.downloadFilterCriteria += 'Tier=' + hsParams['tierName'];

    }

    if (this.commonService.isValidParamInObj(hsParams, "serverName")) {
      if (hsParams['serverName'].length > 32) {
        this.filterServerName = ', Server=' + hsParams['serverName'].substring(0, 32) + '...';
        this.completeServer = hsParams['serverName'];
      } else
        this.filterServerName = ', Server=' + hsParams['serverName'];

      this.downloadFilterCriteria += ', Server=' + hsParams['serverName'];
    }

    if (this.commonService.isValidParamInObj(hsParams, "appName")) {
      if (hsParams['appName'].length > 32) {
        this.filterInstanceName = ', Instance=' + hsParams['appName'].substring(0, 32) + '...';
        this.completeInstance = hsParams['appName'];
      } else
        this.filterInstanceName = ', Instance=' + hsParams['appName'];

      this.downloadFilterCriteria += ', Instance=' + hsParams['appName'];
    }
    if (this.commonService.isValidParamInObj(hsParams, "startTimeInDateFormat")) {
      this.filterCriteria += ', StartTime=' + hsParams['startTimeInDateFormat'];
    }
    if (this.commonService.isValidParamInObj(hsParams, "endTimeInDateFormat")) {
      this.filterCriteria += ', EndTime=' + hsParams['endTimeInDateFormat'];
    }
    if (this.commonService.isValidParamInObj(hsParams, "script")) {
      this.filterCriteria += ', Script Name=' + hsParams['script'];
    }

    if (this.commonService.isValidParamInObj(hsParams, "pageName")) {
      this.filterCriteria += ', Page Name=' + hsParams['pageName'];
    }

    if (this.commonService.isValidParamInObj(hsParams, "transactionName")) {
      this.filterCriteria += ', Transaction Name=' + hsParams['transactionName'];
    }
    if (this.commonService.isValidParamInObj(hsParams, "generatorName")) {
      this.filterCriteria += ', Generator Name=' + hsParams['generatorName'];
    }
    // if (this.filterCriteria.startsWith(',')) {
    //   this.filterCriteria = this.filterCriteria.substring(1);
    // }
    if (!this.commonService.isValidParamInObj(hsParams, "tierName") && !this.commonService.isValidParamInObj(hsParams, "serverName") && !this.commonService.isValidParamInObj(hsParams, "appName") && this.filterCriteria.startsWith(',')) {
      this.filterCriteria = this.filterCriteria.substring(1);
    }
    this.downloadFilterCriteria += this.filterCriteria;
  }

  Querypop(nodeInfo: any) {
    var arr = [];
    this.displayPopUp = true;

    arr.push({ "IPname": nodeInfo.renamebackendIPname, "DiscoveredIPName": nodeInfo.actualbackendIPname, "Type": nodeInfo.backendType, "StartTime": nodeInfo.backendStartTime, "Duration": nodeInfo.backendDuration, "Status": nodeInfo.errorCount, "Query": nodeInfo.Query });
    this.rowData = arr;
  }

  downloadReport(reports: string) {
    let downloadHotspotInfo = JSON.parse(JSON.stringify(this.hotSpotInfo));
    let threadHotspotRenameArray = { "threadid": "Thread Id", "threadname": "Thread Name", "tierName": "Tier", "serverName": "Server", "appName": "Instance", "hotspotstarttimestamp": "Hotspot Entry Time", "hotspotduration": "Hotspot Duration(Sec)", "threadstate": "Thread State", "threadpriority": "Thread priority", "totalDuration": "Total Hotspot Duration(Sec)", "threadstackdepth": "Stack Depth", "FlowPathInstance": "FlowPathInstance" };

    let threadHotspotColOrder = ["Thread Id", "Thread Name", "Tier", "Server", "Instance", "Hotspot Entry Time", "Hotspot Duration(Sec)", "Thread State", "Thread priority", "Total Hotspot Duration(Sec)", "Stack Depth", "FlowPathInstance"];

    downloadHotspotInfo.forEach((val, index) => {
      delete val['tierid'];
      delete val['serverid'];
      delete val['appid'];
      delete val['toolTipTextForHsDur'];
      delete val['hsDurationInMs'];
      delete val['hotspotElapsedTime'];
      delete val['hsTimeInMs'];
      delete val['instanceType'];
      delete val['_$visited'];

    });
    let stackTraceRenameArray;

    let stackTraceColOrder;

    //  this.hotSpotSecInfo.forEach((val, index) => {
    //  delete val['5'];
    //  delete val['6'];
    //  delete val['7'];
    // });
    if (this.mergeDataDownloadFlag) {
      stackTraceRenameArray = { "methodName": "Method", "className": "Class", "lineNo": "Line", "packageName": "Source File", "elapsedTime": "Elapsed Time (ms)", "frameNo": "Frame", "count": "Count" };

      stackTraceColOrder = ["Method", "Class", "Line", "Source File", "Elapsed Time (ms)", "Frame", "Count"];
    } else {
      stackTraceRenameArray = { "methodName": "Method", "className": "Class", "lineNo": "Line", "packageName": "Source File", "elapsedTime": "Elapsed Time (ms)", "frameNo": "Frame" };

      stackTraceColOrder = ["Method", "Class", "Line", "Source File", "Elapsed Time (ms)", "Frame"];
      this.downloadJSON.forEach((val, index) => {
        delete val['count'];
      });
    }

    let integrationPointCallRenameArray = {
      "renamebackendIPname": "IP Name", "actualbackendIPname": "Discovered IP Name", "backendType": "Type", "backendStartTime": "Start Time"
      , "backendDuration": "Duration(ms)", "errorCount": "Status", "Query": "Query", "fpInstance": "FlowpathInstance", "networkreq": "Network Delay Req(ms)", "networkres": "Network Delay Res(ms)"
    };

    let integrationPointCallColOrder = ["IP Name", "Discovered IP Name", "Type", "Start Time", "Duration(ms)", "Status", "Query", "FlowpathInstance", "Network Delay Req(ms)", "Network Delay Res(ms)"];
    // PDF is not download for Hotspot report - 
    if (this.IPInfo != undefined && this.IPInfo != "" && this.aggCase == false) {
      this.IPInfo.forEach((val, index) => {
        delete val['_$visited'];
        delete val['starttimeInMs'];
        delete val['seqNumber'];
        delete val['backendId'];
        delete val['backendSubType'];
      });
    }
    else {
      this.IPInfo = [];
    }



    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.downloadFilterCriteria,
      strSrcFileName: 'Hotspot Report',
      strRptTitle: this.strTitle,

      threadHotspotData: JSON.stringify(downloadHotspotInfo),
      threadHotspotRenameArray: JSON.stringify(threadHotspotRenameArray),
      threadHotspotColOrder: threadHotspotColOrder.toString(),

      stackTraceData: JSON.stringify(this.downloadJSON),
      stackTraceRenameArray: JSON.stringify(stackTraceRenameArray),
      stackTraceColOrder: stackTraceColOrder.toString(),

      integrationPointCallData: JSON.stringify(this.IPInfo),
      integrationPointCallRenameArray: JSON.stringify(integrationPointCallRenameArray),
      integrationPointCallColOrder: integrationPointCallColOrder.toString(),

    };
    let downloadFileUrl = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
      else
        downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
    }
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));

    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
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
        for (let j = 0; j < this.visibleColsForHotspot.length; j++) {
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
        for (let j = 0; j < this.visibleColsForStackTrace.length; j++) {
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
        for (let j = 0; j < this.visibleColsForIP.length; j++) {
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
      if (!this.isEnabledColumnFilterForHotspot) {
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
      if (!this.isEnabledColumnFilterForIP) {
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
      if (!this.isEnabledColumnFilterForStack) {
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

  openDownloadReports(res) {
    let url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else {
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      }
    }
    else {
      url = decodeURIComponent(this.getHostUrl(true));
    }

    url += "/common/" + res;
    window.open(url);
  }
  showError(msg: any) {
    this.errMsg = [];
    this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  ngOnDestroy() {
    console.log("on destroy case--hotspot report---");
    this.sideBarHotspot.unsubscribe();
  }

  showMessage(mssg: any) {
    this.msgs = [];
    if (mssg == "Query Saved") {
      let smsg = "Query Saved as " + this._ddrData.saveMessage;
      this.msgs.push({ severity: 'success', summary: 'Success Message', detail: smsg });
    }
    else if (mssg == "Query Already Defined")
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    else
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
  }


  onTabOpen(event) {
    if (this._ddrData.splitViewFlag == true)
      this.tableHeight = this.tableHeight - 190;
    else
      this.tableHeight = this.tableHeight - 230;
  }

  onTabClose(event) {
    if (this._ddrData.splitViewFlag == true)
      this.tableHeight = this.tableHeight + 190;
    else
      this.tableHeight = this.tableHeight + 230;
  }
}


