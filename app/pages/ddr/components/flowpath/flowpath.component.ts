import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, Output, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import { Observable } from 'rxjs';
//import 'rxjs/Rx';
import { SelectItem } from '../../interfaces/selectitem';
import { Router, NavigationExtras } from '@angular/router';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
//import { DdrDataModelService } from '../../services/ddr-data-model.service';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import { Subscription } from 'rxjs';
import { TimerService } from '../../../tools/configuration/nd-config/services/timer.service';
import { timeout } from 'rxjs/operators';
import { Message } from 'primeng/api';
import { MessageService } from '../../services/ddr-message.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { HighchartsChartModule } from 'highcharts-angular';
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

//import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
//import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
//import { ChartModule } from 'angular2-highcharts';
//import { CavConfigService } from '../../../../main/services/cav-config.service';
//import { TimerService } from '../../../../main/services/timer.service';
//import { CavNavBarComponent } from '../../../../main/components/cav-nav-bar/cav-nav-bar.component';
import { LZString } from './../../services/common.services';

//declare var LZString: any;

@Component({
  selector: 'app-flowpath',
  templateUrl: './flowpath.component.html',
  styleUrls: ['./flowpath.component.css']
})

export class FlowpathComponent implements OnInit, OnDestroy, AfterViewInit {
  ndeCurrentInfo: any;
  reportList: SelectItem[] = [{ label: 'Flowpath', value: '2' }, { label: 'DB Report', value: '6' }, { label: 'Exception', value: '7,71' }, { label: 'Method Timing', value: '9' }, { label: 'Service Method Timing', value: '91' }, { label: 'Hotspot', value: '8,81,82' }, { label: 'IP Summary', value: '11' }, { label: 'Http Report', value: '10' }, { label: 'Method Details', value: '3' }, { label: 'Sequence Diagram', value: '5' }, { label: 'Transaction Flowmap', value: '4' }];
  deleteCachedFlag: boolean = false;
  selectedReport = "";
  // Split value variables
  toggle: boolean = true;
  selectedFlowpathData;
  currentFPRowData;
  currentFPRowDataForDetails;
  columnName: String = '';
  txnToggle: boolean;
  index = '';
  flowBack: boolean = false;
  showSplitView: boolean = false;
  flowpathData: Array<FlowpathDataInterface>;
  columnOptions: SelectItem[];
  urlParam: any;
  loading = false;
  ajaxLoader = true;
  loader: boolean = false;
  headerInfo = '';
  options: Object;
  barChartOptions: Object;
  cols: any;
  chartData: Object[];
  showBarChart = true;
  showChart = true;
  fpStats: any;
  btArray: any;
  showDownLoadReportIcon = true;
  strTitle: any;
  showAllOption = false;
  pointName: any;
  queryData: Array<FlowpathDataInterface>;
  fpTotalCount: any;
  fpLimit = 50;
  fpOffset = 0;
  toggleFilterTitle = '';
  isEnabledColumnFilter = false;
  display: boolean = false;
  standselect: boolean = false;
  methselect: boolean = false;
  custselect: boolean = false;
  respselect: boolean = false;
  custom: string;
  standard: string;
  strDate: Date;
  endDate: Date;
  threadId: any;
  strTime: string;
  endTime: string;
  standardTime: SelectItem[];
  respdrop: SelectItem[];
  selectedTime: any;
  selectedResponse: any;
  selectedvalue: any;
  msg: string;
  value: number = 1;
  trStartTime: any;
  trEndTime: any;
  reportHeader: string;
  minMethods: number;
  responseTime: number;
  resptimeqmode: number;
  responseTime2: number;
  timefilter: boolean = false;
  prevColumn;
  visibleCols: any[];
  currentvisibleCols: any[];
  tableOptions: boolean = true;
  optionsButton: boolean = true;
  selectedTab: boolean = true;
  fpSignatureFlag = false;
  signatureToFP = false;
  signatureRowData: any;
  paginationFlag: boolean = true;
  showHeaderForGrpByBT: boolean = false;
  copyFlowpathLink;
  msgs: Message[];
  errMsg: Message[];
  customFlag: boolean = false;
  screenHeight: any;
  fromHsFlag: string = "";
  tierId: string = "NA";
  serverId: string = "NA";
  appId: string = "NA";
  correlationId: string = "NA";
  mode: string;
  responseCompare: any;
  btCategory: any;
  tierName: string = "NA";
  serverName: string = "NA";
  appName: string = "NA";
  flowpathID: any;
  strStartTime: any;
  strEndTime: any;
  showCount: any;
  flowpathEndTime: any;
  sqlIndex: any;
  urlName: string = "NA";
  urlIndex: string = "NA";
  strGroupBy: string = "NA";
  strOrderBy: string = "NA";
  statusCode: string = "-2";
  flowpathSignature: string = "NA";
  flag: any;
  url: string;   //this url will be send for ajax call to get fp data
  displayPopUp: boolean = false;
  customData: any;
  CustomFilter: any;
  isFilterFromSideBar: boolean = false;
  urlAjaxParamObject: any;
  urlAjaxParam: any;
  CompleteURL: string;
  URLstr: string;
  shellForNDFilters = 1;
  netForestURL: string;
  showNF: boolean = false;
  timeVarienceForNF: string = "900";
  selectedRowInfo: Array<FlowpathDataInterface> = [];
  private progress: Subscription;
  ndeInfoData: any;
  protocol: string = '//';
  dcProtocol: string = '//';
  isCheckbox: boolean = true;
  host = '';
  port = '';
  testRun: string;
  dcList: SelectItem[];
  selectedDC;
  selectedRow: any;
  showDCMenu = false;
  nvtondReport: boolean = false;
  checkNVSessionId: string;
  NVUrl: string;
  prevLimit: number;
  prevOffset: number;
  @ViewChild('accordSec') intialDrafit: ElementRef;
  infoHeader: string = "";
  strInfoMessage: string = "";
  filterTierName = '';
  filterServerName = '';
  filterInstanceName = '';
  completeTier = '';
  completeServer = '';
  completeInstance = '';
  filterDCName = '';
  showLink: boolean;
  showCompareReport: boolean = false;
  compareFPInfo: Array<FlowpathDataInterface> = [];
  downloadFilterCriteria = '';
  showIPSummary: boolean = false;
  dcIndexForNV: number = 0;
  // Variables used for sorting in side view

  @ViewChild('sideView') sideView: ElementRef;
  buttonValue = 'icons8 icons8-minus';
  buttonValueTootip = "Hide Side View";
  setClass = "ui-g-9";
  sortFieldName = '';
  order = '';
  sortingOrder = '';
  openSortPopUp = false;
  sortOptions: SelectItem[];
  sortButtonHide = true;
  showAutoInstrPopUp: boolean = false;
  argsForAIDDSetting: any[];

  fptypeErrorFlag: boolean = false;
  errormsgObj: Object[] = [{ "errorbit": "", "errmsg": "" }];
  securityEnableMode: any;
  private sideBarFlowpath: Subscription;
  keyMetadata: any;
  agdeleteFlag: boolean = false;
  nvArr: any[] = [];
  nvIndex = 0;
  masterDC: any;
  isFromDropDown: boolean = false;
  nvndData: any[] = [];
  nvPageCount: any[] = [];
  isFromPage: boolean = false;
  nvMultiDC: number = 0;
  @ViewChild('gb') gb: any;
  searchProperty: any;
  nFCase: boolean = false;
  nvFilter: string;
  nvndFirstData: boolean = false;
  fromBtTrend: any;

  queryId: any;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  //nvPage: boolean;
  nvndCount: any[] = [];
  pageNo: number = 1;  //Page Handling for NV-ND
  nvPageIndex: any = {};   //Store index
  nvCountFlag: boolean;
  processingInterval;
  checkIntervalFlag: any;
  downDc: boolean;
  breadcrumb: BreadcrumbService;
  empty: boolean;

  ngOnInit() {
    this.loading = true;
    if (this._ddrData.paginationFlag == true) {
      console.log("innnn>>>>>>");
      this.commonService.fpLimit = 50;
      this.commonService.fpOffset = 0;
      this.commonService.rowspaerpage = 50;
      this._ddrData.paginationFlag = false;
    }
    this.commonService.splitView = true;
    if (!this.commonService.fpLimit) {
      this.commonService.fpLimit = this.fpLimit;
      this.commonService.fpOffset = this.fpOffset;
    }
    this.commonService.currentReport = "Flowpath";
    this.commonService.isIntegratedFlowpath = true;
    if (sessionStorage.getItem("dasboardIntegrated") == 'true') {
      this.commonService.isIntegratedFlowpath = true;
    }
    this.commonService.enableQueryCaching = this._ddrData.enableQueryCaching;
    this.fpLimit = this.commonService.rowspaerpage;
    this.screenHeight = Number(this.commonService.screenHeight) - 132;
    this.urlParam = this.commonService.getData();
    if(!this.fromBtTrend){
      this.urlParam.urlIndex = undefined;
      this.urlParam.urlName = "AllTransactions";
    }
    if(!this.urlParam.testRun || this.urlParam.testRun == ""){
      this.urlParam.testRun = this.sessionService.session.testRun.id;
      console.log("The value inside the testRun in the URLPARAM is ...",this.urlParam.testRun);
    }
    if (this.urlParam.product)
      this.urlParam.product = this.urlParam.product.replace("/", "");

    /**
     * commenting this code for migration purpose because currently no exteranal link is supported in webdashboard.
     */
    // console.log("this._cavConfig.$WdinputsforDdr this._cavConfig.$WdinputsforDdr ******** ", this._cavConfig.$WdinputsforDdr);
    // if (this._cavConfig.$WdinputsforDdr) {
    //   sessionStorage.setItem("extLinkForDDR",undefined);
    //   this.urlParam = this._cavConfig.$WdinputsforDdr;
    //   if (this.urlParam.isFromNV)
    //     this._ddrData.isFromNV = this.urlParam.isFromNV;
    //   if (sessionStorage.getItem("isMultiDCMode") == "true" && this.urlParam.dcName) {
    //     /* First time urlParam and ddrData both have same testrun handling multidc case */
    //     this.urlParam.testRun = this._ddrData.testRun;
    //     this.urlParam.dcName = this._ddrData.dcName;
    //     this._cavNavBar.setDDRArguments(this.urlParam.dcName, true);
    //   }
    //   if (!this._ddrData.isFromNVNF)
    //     this.setParamaterInCaseOfNVorNDCase();
    //   if (this.urlParam["userName"])
    //     this._ddrData.userName = this.urlParam["userName"];
    //   else
    //     this._ddrData.userName = this._cavConfig.$userName;
    //   console.log("username ", this._ddrData.userName);
    //   this.getBackendIdForNF();
    //   // http://10.10.40.3:8012/netdiagnostics/v1/cavisson/netdiagnostics/ddr/backendId?testRun=1979&backendName=JDBC_10.10.30.30
    // }
    // else if (sessionStorage.getItem("extLinkForDDR") && sessionStorage.getItem("extLinkForDDR") !== "null") {
    //   try {
    //     this.urlParam = JSON.parse(sessionStorage.getItem("extLinkForDDR"));
    //     this.setParamaterInCaseOfNVorNDCase();
    //     if (this.urlParam["userName"])
    //       this._ddrData.userName = this.urlParam["userName"];
    //     else
    //       this._ddrData.userName = this._cavConfig.$userName;
    //     console.log("username ", this._ddrData.userName);
    //     console.log("sessionStorage.getItem **** ", sessionStorage.getItem("extLinkForDDR"));
    //     this.getBackendIdForNF();
    //   }
    //   catch (e) {
    //     console.log("error in ", e);
    //   }
    // }
    if (!this.nFCase) {
      this.commonFpCode();
    }
    this.commonService.isToLoadSideBar = true;
    console.log("this.commonService.isToLoadSideBarAmannnnnn",this.commonService.isToLoadSideBar);
  }

  randomNumber() {
    this.queryId = (Math.random() * 1000000).toFixed(0);
    console.log("this.queryId:::::::::::::" + this.queryId);
  }
  getKeyForMetaData(): any {
    if (this.urlParam['product'] || sessionStorage.getItem("product")) {
      let url;
      // if(!this.getHostUrl().startsWith("//") && !this.getHostUrl().startsWith("http") && sessionStorage.getItem("protocol")){
      //  url = sessionStorage.getItem("protocol") + "://" + this.getHostUrl() + '/' + (this.urlParam['product'] || sessionStorage.getItem("product"))    + '/v1/cavisson/netdiagnostics/webddr/fetchAllMetaData/' + (this.urlParam['testRun'] || sessionStorage.getItem("testRun")) + '?&flag=10';
      // }
      // else
      url = this.getHostUrl() + '/' + (this.urlParam['product'] || sessionStorage.getItem("product")) + '/v1/cavisson/netdiagnostics/webddr/fetchAllMetaData/' + (this.urlParam['testRun'] || sessionStorage.getItem("testRun")) + '?&flag=10';
      this.ddrRequest.getDataUsingGet(url).subscribe((data) => {
        this.keyMetadata = data['keymetadata'];
        console.log("*****this.keyMetadata*****", this.keyMetadata);
      })
    }
  }
  /* setParamterForEDAndCopyDdrCase function not in used 
  setParamterForEDAndCopyDdrCase() {
    sessionStorage.setItem('hostDcName', location.host);
    sessionStorage.setItem('protocol', location.protocol.substring(0, location.protocol.length - 1));
    this._ddrData.protocol = location.protocol.substring(0, location.protocol.length - 1);
    this._ddrData.host = location.hostname;
    this._ddrData.port = location.port;
    if (this.urlParam.sesLoginName)
      sessionStorage.setItem('sesLoginName', this.urlParam.sesLoginName);
      
    sessionStorage.setItem('port', location.port);
    sessionStorage.setItem('timeZoneId', this.urlParam.timeZoneId)
    this.commonService.removeFromStorage();
    sessionStorage.setItem("resTimeFlagforCustomData", this.urlParam.resTimeFlagforCustomData);
    sessionStorage.setItem("mode", this.urlParam.mode);
    this.commonService.setParameterIntoStorage = this.urlParam;
    this.commonService.strGraphKey = this.urlParam.strGraphKey;
    this.commonService.dcNameList = this.urlParam.dcNameList;
    this.commonService.isAllCase = this.urlParam.isAll;
    this.commonService.tierNameList = this.urlParam.tierNameList;
    this.commonService.ajaxTimeOut = this.urlParam.ajaxTimeout;
    if (this.urlParam.dcNameList != null && this.urlParam.dcNameList != '' && this.urlParam.dcNameList != undefined && this.urlParam.dcNameList != 'undefined') {
      sessionStorage.setItem("dcNameList", this.urlParam.dcNameList);
      sessionStorage.setItem("tierNameList", this.urlParam.tierNameList)
      sessionStorage.setItem("isAllCase", this.urlParam.isAll);
    }
    if (this.urlParam.isIntegratedFlowpath == 'true') {
      this.commonService.isIntegratedFlowpath = true;
    }
  }
      */

  constructor(public commonService: CommonServices,
    private _router: Router,
    //private _navService: CavTopPanelNavigationService,
    //private _cavConfigService: CavConfigService,
    //private _cavConfig: CavConfigService,
    //private _cavNavBar: CavNavBarComponent,
    private _timerService: TimerService,
    private flowmapDataService: DdrTxnFlowmapDataService,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private _changeDetection: ChangeDetectorRef,
    private messageService: MessageService,
    private ddrRequest: DDRRequestService,
    private sessionService: SessionService, breadcrumb: BreadcrumbService) 
    {
      this.breadcrumb = breadcrumb;
      this.fromBtTrend = this._router.getCurrentNavigation().extras.state;
      console.log("value in flowpath constructor", this.fromBtTrend);
  }

  getSecurityEnableMode() {
    var options: any;
    let restDrillDownUrl1 = this.checkAllCase() + '/' + this.urlParam.product.replace("/", "") +
      '/v1/cavisson/netdiagnostics/ddr/config/securityEnableMode';
    return this.ddrRequest.getDataInStringUsingGet(restDrillDownUrl1).subscribe(
      data => {
        this.assignSecurityMode(data);
      });
  }

  assignSecurityMode(data: any) {
    this.securityEnableMode = data;
    console.log('Enable Mode', this.securityEnableMode);
    if (this.securityEnableMode === "1") {
      this.securityEnableMode = false;
    } else {
      this.securityEnableMode = true;
    }
  }

  fillData() {
    try {
      this.createDropDownMenu();
      this.changeColumnFilter();
      // getting table data from server
      if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
        this.getDCData();
      } else {
        console.log('********flag*******', this._ddrData.cmdArgsFlag)
        if (this._ddrData.cmdArgsFlag === true) {
          this.getFlwoapthDataForFPAnalyzer();
        } else {
          if (this.urlParam.isFromNV) {
            this.commonService.host = '';
            this.commonService.port = '';
            this.commonService.protocol = '';
            this.commonService.testRun = '';
            this.commonService.selectedDC = '';
          }
          this.getFlowpathData();
          if (this._ddrData.FromhsFlag != 'true') {
            if (!(this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
              && (this.urlParam.flowpathID || this.urlParam.flowpathID === "NA")
              && sessionStorage.getItem("isMultiDCMode") == "true"))
              this.getFlowpathDataCount();
          }
        }
        this.commonService.host = '';
        this.commonService.port = '';
        this.commonService.protocol = '';
        this.commonService.testRun = '';
        this.commonService.selectedDC = '';
      }
      this.createLinkForCopy();
      this.setTestRunInHeader();

      this.sortOptions = [];
      this.sortOptions = [
        { label: 'Business Transaction', value: 'urlName' },
        { label: 'Category', value: 'btCatagory' },
        { label: 'Start Time', value: 'startTime' },
        { label: 'Total Response Time(ms)', value: 'fpDuration' },
        { label: 'Tier', value: 'tierName' },
        { label: 'Server', value: 'serverName' },
        { label: 'Instance', value: 'appName' },
        { label: 'Methods', value: 'methodsCount' },
        { label: 'CallOuts', value: 'callOutCount' },
        { label: 'Coherence CallOut', value: 'coherenceCallOut' },
        { label: 'JMS CallOut', value: 'jmsCallOut' },
        { label: 'DB Callouts', value: 'dbCallCounts' },
        { label: 'CallOut Errors', value: 'totalError' },
        { label: 'Status', value: 'statusCode' },
        { label: 'Flowpath Instance', value: 'flowpathInstance' },
        { label: 'URL', value: 'urlQueryParamStr' },
        { label: 'CPU Time(ms)', value: 'btCpuTime' },
        { label: 'Corr ID', value: 'correlationId' },
        { label: 'ND Session ID', value: 'ndSessionId' },
        { label: 'NV Page ID', value: 'nvPageId' },
        { label: 'NV Session ID', value: 'nvSessionId' },
        { label: 'Wait Time(ms)', value: 'waitTime' },
        { label: 'Sync Time(ms)', value: 'syncTime' },
        { label: 'IO Time(ms)', value: 'iotime' },
        { label: 'Suspension Time(ms)', value: 'suspensiontime' },
        { label: 'Store ID', value: 'storeId' },
        { label: 'Terminal ID', value: 'terminalId' },
        { label: 'QTime (ms)', value: 'QTimeInMS' },
        { label: 'Response Time(ms)', value: 'selfResponseTime' },
        { label: 'Parent FlowpathInstance', value: 'ParentFlowpathInstance' },
        { label: 'Total CPU Time(ms)', value: 'totalCpuTime' }
      ]
      this.cols = [
        { field: 'check', header: 'CheckOption', action: true, width: '50' },
        { field: 'tierName', header: 'Tier', sortable: true, action: false, width: '100' },
        { field: 'serverName', header: 'Server', sortable: true, action: false, width: '100' },
        { field: 'appName', header: 'Instance', sortable: 'custom', action: false, width: '100' },
        { field: 'urlName', header: 'Business Transaction', sortable: true, action: true, width: '200' },
        { field: 'flowpathInstance', header: 'FlowpathInstance', sortable: 'custom', action: false, width: '145' },
        { field: 'urlQueryParamStr', header: 'URL', sortable: true, action: true, width: '250' },
        { field: 'btCatagory', header: 'Category', sortable: true, action: true, width: '100' },
        { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true, width: '130' },
        { field: 'fpDuration', header: 'Total Response Time(ms)', sortable: 'custom', action: true, width: '190' },
        { field: 'btCpuTime', header: 'CPU Time(ms)', sortable: 'custom', action: true, width: '125' },
        { field: 'methodsCount', header: 'Methods', sortable: 'custom', action: true, width: '100' },
        { field: 'callOutCount', header: 'CallOuts', sortable: 'custom', action: true, width: '100' },
        { field: 'totalError', header: 'CallOut Errors', sortable: 'custom', action: false, width: '130' },
        { field: 'dbCallCounts', header: 'DB Callouts', sortable: 'custom', action: true, width: '110' },
        { field: 'statusCode', header: 'Status', sortable: 'custom', action: true, width: '100' },
        { field: 'correlationId', header: 'Corr ID', sortable: 'custom', action: false, width: '100' },
        { field: 'ndSessionId', header: 'ND Session ID', sortable: 'custom', action: false, width: '145' },
        { field: 'nvPageId', header: 'NV Page ID', sortable: 'custom', action: false, width: '110' },
        { field: 'coherenceCallOut', header: 'Coherence CallOut', sortable: 'custom', action: false, width: '150' },
        { field: 'jmsCallOut', header: 'JMS CallOut', sortable: 'custom', action: false, width: '110' },
        { field: 'nvSessionId', header: 'NV Session ID', sortable: 'custom', action: false, width: '130' },
        { field: 'waitTime', header: 'Wait Time(ms)', sortable: 'custom', action: false, width: '130' },
        { field: 'syncTime', header: 'Sync Time(ms)', sortable: 'custom', action: false, width: '130' },
        { field: 'iotime', header: 'IO Time(ms)', sortable: 'custom', action: false, width: '115' },
        { field: 'suspensiontime', header: 'Suspension Time(ms)', sortable: 'custom', action: false, width: '175' },
        { field: 'storeId', header: 'Store ID', sortable: 'custom', action: false, width: '100' },
        { field: 'terminalId', header: 'Terminal ID', sortable: 'custom', action: false, width: '110' },
        { field: 'QTimeInMS', header: 'QTime (ms)', sortable: 'custom', action: false, width: '110' },
        { field: 'selfResponseTime', header: 'Response Time(ms)', sortable: 'custom', action: false, width: '160' },
        { field: 'ParentFlowpathInstance', header: 'Parent FlowpathInstance', sortable: 'custom', action: false, width: '200' },
        { field: 'totalCpuTime', header: 'Total CPU Time(ms)', sortable: 'custom', action: false, width: '160' },
        { field: 'gcPause', header: 'GC Pause', sortable: 'true', action: false, width: '100' },
        { field: 'dynamicLoggingFlag', header: 'Flag', sortable: 'true', action: true, width: '100' },
        { field: 'applicationName', header: 'Application Name', sortable: 'true', action: false, width: '150' }
      ];
      this.visibleCols = [
        'check', 'urlName', 'urlQueryParamStr', 'btCatagory', 'startTime', 'fpDuration', 'btCpuTime', 'methodsCount', 'callOutCount',
        'dbCallCounts', 'statusCode', 'dynamicLoggingFlag'
      ];
      if (this.urlParam.backendName && this.urlParam.backendName != "NA" && this.urlParam.backendName != "undefined") {
        if (this.checkrespTime()) {
          this.cols.push({ field: 'backendMaxDur', header: 'Max IP Res time(ms)', sortable: 'custom', action: true, width: '130' });
          this.visibleCols.push('backendMaxDur');
        }
      }
      if (document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]) {
        let colWidthCSS = document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]['style'].width;
        if (colWidthCSS) {
          let numCSS = colWidthCSS.substring(0, colWidthCSS.indexOf('px'));
          if (numCSS > 20)
            document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]['style'].width = "20px";
        }
        console.log(document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]['style'].width, " true ", colWidthCSS);
      }
      if (this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
        && (!this.urlParam.flowpathID || this.urlParam.flowpathID === "NA")
        && sessionStorage.getItem("isMultiDCMode") == "true")  //NV-ND ALL case
      {
        this.sortOptions.push({ label: 'DC Name', value: 'dcName' });
        this.cols.push({ field: 'dcName', header: 'DC Name', sortable: 'custom', action: false, width: '75' });
      }
      this.columnOptions = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
      console.log('column options', this.columnOptions);
      this._ddrData.passMesssage$.subscribe((mssg) => { this.showMessage(mssg) });
    } catch (error) {
      console.log('error in intialization compaonent --> ', error);
    }
  }
  
  checkrespTime() {
    if (this.urlParam && (this.urlParam.backendRespTime || this.urlParam.backendRespTime >= 0)
      && this.urlParam.backendRespTime != "undefined" && this.urlParam.backendRespTime != "NA") {
      return true;
    }
    else
      return false;
  }
  createLinkForCopy() {
    let dcIp = "&dcIp=";
    let dcPort = "&dcPort=";
    let dcProtocol = "&dcProtocol=";
    let url = window.location.protocol + '//' + window.location.host;

    if (this.commonService.host && this.commonService.port) {
      if (this.commonService.protocol)
        this.copyFlowpathLink = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
        this.copyFlowpathLink = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
    } else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      this.copyFlowpathLink = location.protocol + "//" + location.host;
      dcIp = dcIp + this._ddrData.host;
      dcPort = dcPort + this._ddrData.port;
      dcProtocol = dcProtocol + this._ddrData.protocol;
    }

    else if (this.getHostUrl().startsWith("//"))
      this.copyFlowpathLink = location.protocol + this.getHostUrl();
    else
      this.copyFlowpathLink = this.getHostUrl();

    if (this.urlParam.product.indexOf("/") != -1)
      this.urlParam.product = this.urlParam.product.substring(1);
    console.log(this.urlParam.product, "---productName----");

    let nvCopyLinkParam;
    if (this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1") {
      let nvFilter;
      if (this.nvFilter)
        nvFilter = this.nvFilter.replace("=", "Z");
      else if (this.urlParam.nvFilter)
        nvFilter = this.urlParam.nvFilter.replace("=", "Z");
      if (this.nvArr[this.nvIndex] && this.nvArr.length > 0)
        nvCopyLinkParam = this.nvArr[this.nvIndex] + "&nvIndex=" + this.nvIndex + "&isFromNV=" + this.urlParam.isFromNV + "&nvFilter=" + nvFilter;
      else
        nvCopyLinkParam = "&nvIndex=" + this.nvIndex + "&isFromNV=" + this.urlParam.isFromNV + "&nvFilter=" + nvFilter;
    }
    let dcNAME;
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      if (this._ddrData.isFromNV == "1" || this.urlParam.isFromNV == "1") {
        dcNAME = "ALL";
      }
      else
        dcNAME = this._ddrData.dcName;
    }
    // else if (sessionStorage.getItem("isMultiDCMode") == "true")
    //   dcNAME = this._cavConfig.getActiveDC();
    else
      dcNAME = this.selectedDC;
    if (this._ddrData.cmdArgsFlag) {
      // if (nvCopyLinkParam)
      //   this.copyFlowpathLink += '/ProductUI//index.html?FileName=' + this.commonService.cmdFileName + "&testRun=" + this.urlParam.testRun + '&product=' + decodeURIComponent(this.urlParam.product) + "&ajaxTimeout=" + this.commonService.ajaxTimeOut + nvCopyLinkParam + "&requestFrom=ddr&path=/home/ddrCopyLink/flowpath" + dcIp + dcPort + dcProtocol + "&dcName=" + dcNAME + "&userName=" + sessionStorage.getItem("sesLoginName") + "&verifyUser=" + LZString.compressToEncodedURIComponent(sessionStorage.getItem("sesLoginName"));
      // else
      //   this.copyFlowpathLink += '/ProductUI//index.html?FileName=' + this.commonService.cmdFileName + "&testRun=" + this.urlParam.testRun + '&product=' + decodeURIComponent(this.urlParam.product) + "&ajaxTimeout=" + this.commonService.ajaxTimeOut + "&requestFrom=ddr&path=/home/ddrCopyLink/flowpath" + dcIp + dcPort + dcProtocol + "&dcName=" + dcNAME + "&userName=" + sessionStorage.getItem("sesLoginName") + "&verifyUser=" + LZString.compressToEncodedURIComponent(sessionStorage.getItem("sesLoginName"));
      // console.log("copy url data", this.copyFlowpathLink);
    }
    else {
      if (this._ddrData.IPByFPFlag === true) {
        console.log('Inside Integration Point call Case');
        this.urlParam.tierName = this.commonService.IPByFPData.tierName
        this.commonService.fpFilters.appName = this.commonService.IPByFPData.appName;
        this.commonService.fpFilters.serverName = this.commonService.IPByFPData.serverName;
        this.urlParam.tierId = this.commonService.IPByFPData.tierId;
        //this.serverId = this.commonService.IPByFPData.serverId;
        //this.appId = this.commonService.IPByFPData.appId;
        this.urlParam.startTime = this.commonService.IPByFPData.startTime;
        this.urlParam.endTime = this.commonService.IPByFPData.endTime;
      }
      else if (this._ddrData.FromhsFlag == 'true') {
        console.log(' method makeAjaxParameter and FromhsFlag is true');
        this.urlParam.tierName = this.commonService.hstofpData.tierName;
        this.commonService.fpFilters.serverName = this.commonService.hstofpData.serverName;
        this.commonService.fpFilters.appName = this.commonService.hstofpData.appName;
        this.urlParam.tierId = this.commonService.hstofpData.tierid;
        this.urlParam.serverId = this.commonService.hstofpData.serverid;
        this.urlParam.appId = this.commonService.hstofpData.appid;
        this.urlParam.startTime = this.commonService.hstofpData.hsTimeInMs;
        this.strEndTime = this.commonService.hstofpData.hsEndTime;
        this.threadId = this.commonService.hstofpData.threadId;
        this.urlParam.endTime = this.commonService.hstofpData.hsEndTime;
        this.flowpathEndTime = this.commonService.hstofpData.flowpathEndTime;
        this.paginationFlag = false;
      }
      if (nvCopyLinkParam) {
        this.copyFlowpathLink = url +'/UnifiedDashboard/ddrcopylink.html?requestFrom=DDRA9' +'&testRun=' + this.urlParam.testRun + "&tierName=" + this.urlParam.tierName +
          "&serverName=" + this.commonService.fpFilters.serverName + "&appName=" + this.commonService.fpFilters.appName + "&tierId=" + this.urlParam.tierId +
          "&startTime=" + this.urlParam.startTime + "&endTime=" + this.urlParam.endTime + '&product=' + decodeURIComponent(this.urlParam.product) +
          "&btCategory=" + this.commonService.fpFilters.btCategory + "&minMethods=" + this.minMethods + '&urlName=' + this.urlParam.urlName +
          '&statusCode=-2&timeZoneId=' + this.urlParam.timeZoneId + "&userName=" + sessionStorage.getItem("sesLoginName") +
          "&strOrderBy=" + this.commonService.fpFilters.strOrderBy + "&strGroupBy=" + this.commonService.fpFilters.strGroupBy +
          "&ajaxTimeout=" + this.commonService.ajaxTimeOut + "&flowpathID=" + this.commonService.fpFilters.flowpathID + nvCopyLinkParam +
          "&correlationId=" + encodeURIComponent(this.urlParam.correlationId) + "&mode=" + this.urlParam.mode + "&sqlIndex=" + this.commonService.fpFilters.sqlIndex +
          "&dcName=" + dcNAME + "&backendId=" + this.urlParam.backendId + "&backendRespTime=" + this.urlParam.backendRespTime +
          "&backendName=" + this.urlParam.backendName + "&path=/home/ddrCopyLink/flowpath" + dcIp + dcPort + dcProtocol +
          "&verifyUser=" + LZString.compressToEncodedURIComponent(sessionStorage.getItem("sesLoginName"));
      }
      else {
        this.copyFlowpathLink = url +'/UnifiedDashboard/ddrcopylink.html?requestFrom=DDRA9'+'&testRun=' + this.urlParam.testRun + "&tierName=" + this.urlParam.tierName +
          "&serverName=" + this.commonService.fpFilters.serverName + "&appName=" + this.commonService.fpFilters.appName + "&tierId=" + this.urlParam.tierId +
          "&startTime=" + this.urlParam.startTime + "&endTime=" + this.urlParam.endTime + '&product=' + decodeURIComponent(this.urlParam.product) +
          "&btCategory=" + this.commonService.fpFilters.btCategory + "&minMethods=" + this.minMethods + '&urlName=' + this.urlParam.urlName +
          '&statusCode=-2&timeZoneId=' + this.urlParam.timeZoneId + "&userName=" + sessionStorage.getItem("sesLoginName") + "&strOrderBy=" + this.commonService.fpFilters.strOrderBy +
          "&strGroupBy=" + this.commonService.fpFilters.strGroupBy + "&ajaxTimeout=" + this.commonService.ajaxTimeOut + "&flowpathID=" + this.commonService.fpFilters.flowpathID +
          "&correlationId=" + encodeURIComponent(this.urlParam.correlationId) + "&mode=" + this.urlParam.mode + "&sqlIndex=" + this.commonService.fpFilters.sqlIndex +
          "&dcName=" + dcNAME + "&backendId=" + this.urlParam.backendId + "&backendRespTime=" + this.urlParam.backendRespTime + "&backendName=" + this.urlParam.backendName +
          "&flowpathEndTime=" + this.flowpathEndTime + "&threadId=" + this.threadId + "&paginationFlag=" + this.paginationFlag +
          "&path=/home/ddrCopyLink/flowpath" + dcIp + dcPort + dcProtocol + "&verifyUser=" + LZString.compressToEncodedURIComponent(sessionStorage.getItem("sesLoginName"));
      }
    }
  }
  createDropDownMenu() {
    this.standardTime = [];
    this.respdrop = [];
    this.standardTime.push({ label: 'Last 10 minutes', value: '10' });
    this.standardTime.push({ label: 'Last 30 minutes', value: '30' });
    this.standardTime.push({ label: 'Last 1 hour', value: '60' });
    this.standardTime.push({ label: 'Last 2 hours', value: '120' });
    this.standardTime.push({ label: 'Last 4 hours', value: '240' });
    this.standardTime.push({ label: 'Last 8 hours', value: '480' });
    this.standardTime.push({ label: 'Last 12 hours', value: '720' });
    this.standardTime.push({ label: 'Last 24 hours', value: '1440' });
    this.standardTime.push({ label: 'Total Test Run', value: 'Whole Scenario' });

    this.respdrop.push({ label: '<=', value: { id: 10 } });
    this.respdrop.push({ label: '>=', value: { id: 11 } });
    this.respdrop.push({ label: '=', value: { id: 12 } });
  }

  openFlowPathCount(rowData: any, flag) {
    console.log('rowData-----------', rowData)
    this.setHostName();
    this.signatureRowData = {};
    if (flag === 'grpByBT') {
      this._ddrData.fpByBTFlag = true;
      this.commonService.fpByBTData = rowData;
      this.tableOptions = true;
    } else if (flag === 'fpSignature') {
      this.signatureToFP = true;
      this.signatureRowData = rowData;
      this.fpSignatureFlag = false;
    }
    this.getFlowpathData();
    this.getFlowpathDataCount();
  }

  getFlwoapthDataForFPAnalyzer() {
    console.log('this.commonService.flowpathCmdArgs---', this.commonService.fpAnalyzeData);
    let pagination = ' --limit 50 --offset 0';
    //      console.log("in analyser",this.urlParam);
    let param = {
      cmdArgs: this.commonService.fpAnalyzeData.cmdArgs,
      pagination: pagination,
      btName: this.commonService.fpAnalyzeData.btName,
      testRun: this.urlParam.testRun,
      startTime: this.commonService.fpAnalyzeData.startTime,
      endTime: this.commonService.fpAnalyzeData.endTime,
      FileName: this.urlParam.FileName,
      fpCount: this.commonService.fpAnalyzeData.fpCount
    };

    //console.log("We are in getFlwoapthDataForFPAnalyzer",param);
    let url;

    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL')
    //     url = this._ddrData.protocol + "://" + this.getHostUrl();
    //  else
    url = this.getHostUrl();

    url = url + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreportForFPAnalyserEX';
    console.log('url_______--.>', url);
    return this.ddrRequest.getDataUsingPost(url, param).subscribe(data => (this.assignFlowpathData(data)));

    //console.log("fileName inside rest",data.fileName);

  }

  openDBReports(data: any, flag) {
    this.setHostName();
    this.commonService.dbFilters["source"] = "FlowpathReport";
    this.showCompareReport = false;
    console.log('data items', data);
    this.commonService.showAllTabs = true;
    this.commonService.openCurrentFlowpathTab = true;
    if (flag === 'signature') {
      console.log('inside signature to DB')
      if (data.fpDuration == '< 1') {
        data.fpDuration = 0;
        this.commonService.setFPData = data;
      } else {
        this.commonService.setFPData = data;
      }
      this.commonService.signatureToDB = true;
      this.setInStorage(data, 'signature');
    } else {
      if (data.fpDuration == '< 1') {
        data.fpDuration == 0;
        this.commonService.setFPData = data;
      } else {
        this.commonService.setFPData = data;
      }
      this._ddrData.dbFlag = true;
      this.setInStorage(data, 'fptoDB');
    }
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;

    //code for Autofill from flowpath to DB
    //this.messageService.sendMessage(data);

    if (this.commonService.isIntegratedFlowpath) {
      this.commonService.showDbreport = false;
      this.commonService.openFlowpath = false;
      this.checkFpInstance(data.flowpathInstance);
      this._changeDetection.detectChanges();
      this.commonService.openDbTab = true;
      if (Number(data.dbCallCounts) == 0) {
        this.displayPopUp = true;
        this.infoHeader = "Database Queries";
        this.strInfoMessage = "No Query found for selected flowpath";
        return;
      }
      this.commonService.showDbreport = true;
      this.highlighttheRow();
    }
    else {
      if (this.flowBack) {
        this._ddrData.isFromtrxFlow = false;
      }
      if (this._router.url.indexOf('/home/ddrCopyLink') != -1) {
        this._router.navigate(['/home/ddrCopyLink/query']);
      } else {
        this._router.navigate(['/home/ddr/query']);
      }
    }
  }

  setInStorage(data: any, flag) {
    if (flag === 'signature') {
      console.log('insdie signature case')
      sessionStorage.removeItem('dbData');
      sessionStorage.setItem('dbData', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('dbData');
      sessionStorage.removeItem('dbFlag');
      sessionStorage.setItem('dbData', JSON.stringify(data));
      sessionStorage.setItem('dbFlag', 'true');
    }
  }
  /**used to open MethodTiming Report from Flowpath report */
  openMethodTiming(rowData, flag) {
    this.setHostName();
    this.showCompareReport = false;
    this.commonService.methodTimingFilters["source"] = "FlowpathReport";
    let reqData = {};
    this.commonService.showAllTabs = true;
    this.commonService.openCurrentFlowpathTab = true;
    console.log('Row data is:', rowData);
    let endTimeInMs = 0;
    if (rowData !== undefined) {
      if (rowData.fpDuration.toString().includes(','))
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration.toString().replace(/,/g, ""));
      else if (rowData.fpDuration == '< 1') {
        endTimeInMs = Number(rowData.startTimeInMs) + Number(0);
      }
      else
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);
      reqData['flowpathInstance'] = rowData.flowpathInstance;
      reqData['urlIndex'] = rowData.urlIndex;
      reqData['tierName'] = rowData.tierName;
      reqData['serverName'] = rowData.serverName;
      reqData['appName'] = rowData.appName;
      reqData['tierId'] = rowData.tierId;
      reqData['serverId'] = rowData.serverId;
      reqData['appId'] = rowData.appId;
      reqData['strStartTime'] = rowData.startTimeInMs;
      reqData['strEndTime'] = endTimeInMs;
      reqData['urlName'] = rowData.urlName;
      reqData['urlQueryParamStr'] = rowData.urlQueryParamStr;
      reqData['btCatagory'] = rowData.btCatagory;
    }
    this.commonService.mtData = reqData;
    //code for autofill from flowpath to MethodTiming
    //this.messageService.sendMessage(reqData);
    this._ddrData.mtFlag = 'true';
    this.commonService.mtFlag = true;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    if (this.commonService.isIntegratedFlowpath) {
      this.commonService.showMethodTiming = false;
      this.commonService.openFlowpath = false;
      this.checkFpInstance(rowData.flowpathInstance)
      this._changeDetection.detectChanges();
      this.commonService.showMethodTiming = true;
      this.commonService.openMethodTimingTab = true;
      this.highlighttheRow();
    }
    else {
      if (this.flowBack) {
        this._ddrData.isFromtrxFlow = false;
      }
      if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
        this._router.navigate(['/home/ddrCopyLink/methodtiming']);
      } else {
        this._router.navigate(['/ddr/methodtiming']);
      }
    }
  }

  openExceptionReport(rowData: any) {
    this.setHostName();
    console.log('rowData-->', rowData);
    this.commonService.showAllTabs = true;
    this.commonService.openCurrentFlowpathTab = true;
    this.showCompareReport = false;
    if (rowData !== undefined) {
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
      this._ddrData.flowpathToExFlag = true;
      if (rowData.fpDuration.toString().includes(',')) {
        rowData.fpDuration = Number(rowData.fpDuration.toString().replace(/,/g, ""));
      }
      if (rowData.fpDuration == '< 1') {
        this.commonService.flowpathToExData = rowData;
      } else {
        this.commonService.flowpathToExData = rowData;
      }
      this.commonService.flowpathToExData['failedQuery'] = 1;
      if (this.commonService.isIntegratedFlowpath) {
        this.commonService.showExceptionReport = false;
        this.commonService.openFlowpath = false;
        this.checkFpInstance(rowData.flowpathInstance)
        this._changeDetection.detectChanges();
        this.commonService.openExceptionTab = true;
        if (Number(rowData.totalError) == 0) {
          this.displayPopUp = true;
          this.infoHeader = "Exceptions";
          this.strInfoMessage = "No exception found for selected flowpath";
          return;
        }
        this.showLink = false;
        this.commonService.showExceptionReport = true;
        this.highlighttheRow();
      }
      else {
        if (this.flowBack) {
          this._ddrData.isFromtrxFlow = false;
        }
        if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
          this._router.navigate(['/home/ddrCopyLink/exception']);
        } else {
          this._router.navigate(['/home/ddr/exception']);
        }
      }
    }
  }

  openHotspotReport(data: any) {
    this.showCompareReport = false;
    this.setHostName();
    console.log('row data------------->', data);
    if (data !== undefined) {

      let fpinstance = data.flowpathInstance
      if (undefined != data.fpDuration) {
        var endTime;
        if (data.fpDuration.toString().includes(','))
          endTime = Number(data.startTimeInMs) + Number(data.fpDuration.toString().replace(/,/g, ""));
        else if (data.fpDuration == '< 1')
          endTime = Number(data.startTimeInMs) + Number(0);
        else
          endTime = Number(data.startTimeInMs) + Number(data.fpDuration);
      }

      //Ajax Call To Check Whether The Data in Hotspot is present or not.
      let url = 'testRun=' + this.urlParam.testRun +
        '&tierId=' + data.tierId +
        '&appId=' + data.appId +
        '&serverId=' + data.serverId +
        '&strStartTime=' + data.startTimeInMs +
        '&strEndTime=' + endTime +
        '&threadId=' + data.threadId +
        '&btCategory=' + data.btCatagory +
        '&appName=' + data.appName +
        '&serverName=' + data.serverName +
        '&tierName=' + data.tierName +
        '&urlName=' + data.urlName +
        '&urlIndex=' + data.urlIndex +
        '&btCatagory=' + data.btCatagory +
        '&flowpathInstance=' + data.flowpathInstance +
        '&instanceType=' + data.Instance_Type;
      console.log("url for hotspot from flowpath--", url);

      this.commonService.hotspotFilters = this.commonService.makeObjectFromUrlParam(url);
      this.commonService.hotspotFilters["source"] = "FlowpathReport";

      console.log("this.commonService.hotspotFilters ====>>", this.commonService.hotspotFilters);
      var endpoint_url = '';
      if (this.host != undefined && this.host != '' && this.host != null) {
        endpoint_url = this.protocol + this.host + ':' + this.port + '/' + this.urlParam.product;
      } else {
        endpoint_url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product);
      }
      endpoint_url += "/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?" + url;
      return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.hotspotData(data, fpinstance)));

    }
  }

  hotspotData(data, fpinstance) {
    if (data.hasOwnProperty('Status')) {
      this.commonService.showError(data.Status);
    }
    if (data.data.length <= 0) {
      // Display msg in Flowpath Component that no data is present for hotspot.
      this.displayPopUp = true;
      this.infoHeader = "Hotspot Thread Details";
      this.strInfoMessage = "There are no hotspots for the selected flowpath";
    }
    else {
      // Else route to Hotspot component with ajax call Data.
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
      this.commonService.hsFlag = true;
      this.commonService.hsData = data;
      this.commonService.showAllTabs = true;
      this.commonService.openCurrentFlowpathTab = true;

      //code for Autofill from FLowpath to Hotspot
      // this.messageService.sendMessage(this.commonService.hotspotFilters);

      if (this.commonService.isIntegratedFlowpath) {
        this.commonService.showHotspot = false;
        this.checkFpInstance(fpinstance)
        this._changeDetection.detectChanges();
        this.commonService.showHotspot = true
        this.commonService.openFlowpath = false;
        this.commonService.openHotspotTab = true;
        this.highlighttheRow();
      }
      else {
        if (this.flowBack) {
          this._ddrData.isFromtrxFlow = false;
        }
        if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
          this._router.navigate(['/home/ddrCopyLink/hotspot']);
        } else {
          this._router.navigate(['/home/ddr/hotspot']);
        }
      }
    }
  }
  paginate(event) {
    // event.first = Index of the first record  (used  as offset in query) 
    // event.rows = Number of rows to display in new page  (used as limit in query)
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    this.commonService.rowspaerpage = event.rows;
    this.fpOffset = parseInt(event.first);
    this.fpLimit = parseInt(event.rows);
    if (this.fpLimit > this.fpTotalCount) {
      this.fpLimit = Number(this.fpTotalCount);
    }
    if ((this.fpLimit + this.fpOffset) > this.fpTotalCount) {
      this.fpLimit = Number(this.fpTotalCount) - Number(this.fpOffset);
    }
    this.commonService.isFilterFromSideBar = true;
    this.loader = true;
    this.getProgressBar();
    this.getFlowpathData();

  }
  openMethodCallingTree(rowData) {
    this.setHostName();
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.showAllTabs = true;
    this.commonService.openCurrentFlowpathTab = true;
    this.showCompareReport = false;
    if (rowData != undefined) {
      if (rowData.fpDuration == '< 1') {
        this.commonService.mctData = rowData;
      } else {
        this.commonService.mctData = rowData;
      }
      this.commonService.mctFlag = true;
    }
    this.commonService.mctData['source'] = 'Flowpath';
    if (this.commonService.isIntegratedFlowpath) {
      this.commonService.showMethodCallingTree = false;
      this.checkFpInstance(rowData.flowpathInstance);
      this._changeDetection.detectChanges();
      this.commonService.showMethodCallingTree = true;
      this.commonService.openFlowpath = false;
      this.commonService.openMethodCallingTreeTab = true;
      this.highlighttheRow();

    }
    else {
      if (this.flowBack) {
        this._ddrData.isFromtrxFlow = false;
      }
      if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
        this._router.navigate(['/home/ddrCopyLink/methodCallingTree']);
      } else {
        this._router.navigate(['/home/ddr/methodCallingTree']);
      }
    }
  }
  openHttpReport(rowData) {
    console.log("rowdata", rowData);
    this.setHostName();
    this.showCompareReport = false;
    this.commonService.showAllTabs = true;
    this.commonService.openCurrentFlowpathTab = true;
    let reqData = {};
    let endTimeInMs = 0;
    if (rowData !== undefined) {
      if (rowData.fpDuration.toString().includes(','))
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration.toString().replace(/,/g, ""));
      else if (rowData.fpDuration == '< 1') {
        endTimeInMs = Number(rowData.startTimeInMs) + Number(0);
      }
      else
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);

      reqData['fpInstance'] = rowData.flowpathInstance;
      reqData['tierName'] = rowData.tierName;
      reqData['serverName'] = rowData.serverName;
      reqData['appName'] = rowData.appName;
      reqData['strStartTime'] = rowData.startTimeInMs;
      reqData['strEndTime'] = endTimeInMs;
      reqData['statusCode'] = rowData.statusCode;
      reqData['urlQueryParamStr'] = rowData.urlQueryParamStr;
    }
    this.commonService.httpData = reqData;
    this.commonService.httpFlag = true;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    if (this.commonService.isIntegratedFlowpath) {
      this.commonService.showHttp = false;
      this._changeDetection.detectChanges();
      this.checkFpInstance(rowData.flowpathInstance)
      this.commonService.showHttp = true;
      this.commonService.openFlowpath = false;
      this.commonService.openHttpTab = true;
      this.highlighttheRow();
    }
    else {
      if (this.flowBack) {
        this._ddrData.isFromtrxFlow = false;
      }
      if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
        this._router.navigate(['/home/ddrCopyLink/httpReqResp']);
      } else {
        this._router.navigate(['/ddr/httpReqResp']);
      }
    }
  }
  getProgressBar() {
    this.progress = this._timerService.getTimerSubscription().subscribe(
      value => { this.calculateProgress(value); }
    );
  }
  calculateProgress(tick: number) {
    if (this.value < 50) {
      this.value += 3;
    } else if (this.value < 70) {
      this.value += 2;
    } else if (this.value < 99) {
      this.value += 1;
    }

    if (this.loader == false) {
      this.progress.unsubscribe();
      this.value = 0;
    }
  }

  setDefaultSort(fpParam) {
    console.log("this.commonService.sortedField--", this.commonService.sortedField);
    if (fpParam != undefined && Object.keys(fpParam).length != 0) {
      if (fpParam.strOrderBy == 'btcputime_desc')
        this.commonService.sortedField = 'btCpuTime';
      else if (fpParam.strOrderBy == 'error_callout')
        this.commonService.sortedField = 'totalError';
      else if (this.checkrespTime())
        this.commonService.sortedField = 'backendMaxDur';
      else if (this.urlParam.isFromNV && this.urlParam.isFromNV === "1") {
        this.commonService.sortedField = "startTime";
        this.commonService.sortedOrder = "1";
      }
      else
        this.commonService.sortedField = 'fpDuration';
    }
    console.log("this.commonService.sortedField--", this.commonService.sortedField);
  }

  getFlowpathData() {
    this.urlAjaxParam = "";
    let pagination = "";
    let ajaxFlags = "";
    let customDataFilter = "";
    let finalUrl = "";
    if (this._ddrData.FromhsFlag != 'true') {
      pagination = '&limit=' + this.fpLimit + '&offset=' + this.fpOffset;
      ajaxFlags = '&customFlag=' + this.customFlag;
    }
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      this.url = this.getHostUrl();
      console.log("urllll formeddddd", this.url);
    } else {
      this.dcProtocol = this.commonService.protocol;

      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        this.url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        this.url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        this.url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
    }
    if (this.commonService.enableQueryCaching == 1)
      this.url += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?cacheId=' + this.urlParam.testRun + "&testRun=" + this.urlParam.testRun;
    else
      this.url += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' + this.urlParam.testRun;

    console.log("first this.commonService.fpFilters---", JSON.stringify(this.commonService.fpFilters));
    try {
      console.log("isFilterFromSideBar----" + this.commonService.isFilterFromSideBar);
      if (this._ddrData.nvCqm) {
        this.nvndData = [];
        this.nvndCount = [];
        this.nvPageIndex = [];
        this.pageNo = 1;
        this._ddrData.nvCqm = false;
      }
      
      // sidebar filters to flowpath
      if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.fpFilters).length != 0) 
      {
        if (this.commonService.fpLimit < 50) {
          this.commonService.fpLimit = 50;
        }
        this.fpLimit = this.commonService.fpLimit;
        let fpParam = this.commonService.fpFilters;
        this.selectedRowInfo = [];   //Changes regarding bug id--49272
        if (this.commonService.isValidParamInObj(fpParam, 'ndeProtocol') && this.commonService.isValidParamInObj(fpParam, 'pubicIP') && this.commonService.isValidParamInObj(fpParam, 'publicPort') && this.commonService.isValidParamInObj(fpParam, 'ndeTestRun')) {
          if (this.commonService.enableQueryCaching == 1)
            this.url = fpParam['ndeProtocol'] + "://" + fpParam['pubicIP'] + ":" + fpParam['publicPort'] + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?cacheId=' + fpParam['ndeTestRun'] + '&testRun=' + fpParam['ndeTestRun'];
          else
            this.url = fpParam['ndeProtocol'] + "://" + fpParam['pubicIP'] + ":" + fpParam['publicPort'] + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' + fpParam['ndeTestRun'];
          console.log("this.url--", this.url);
        }
        if (fpParam["isContainsNSFilters"] == true)
          this.shellForNDFilters = 0;
        else
          this.shellForNDFilters = 1;

        console.log(" COMPONENT - Flowpath, METHOD -  getFlowpathData, fpFilters got here", fpParam);
        fpParam["testRun"] = this.urlParam.testRun;
        this.urlAjaxParam = this.commonService.makeParamStringFromObj(this.commonService.fpFilters, true);
        console.log(" COMPONENT - Flowpath, METHOD -  getFlowpathData, After making url from fpFilters= " + this.urlAjaxParam);
      }

      else {
        this.commonService.fpFilters = {};
        console.log("fpFilters--", this.commonService.fpFilters);
        let fpParam = this.urlParam;

        if (fpParam["isContainsNSFilters"] == 'true') {
          this.shellForNDFilters = 0;
        } else {
          this.shellForNDFilters = 1;
        }
        this.makeAjaxParameter();
        if (!this.tierName) {
          if (this.urlParam && this.urlParam.tierName) {
            this.tierName = this.urlParam.tierName;
            console.log("tierName from urlParam ", this.urlParam.tierName)
          }
          else
            this.tierName = sessionStorage.getItem("tierName");
          console.log("tierName for sessionStorage", sessionStorage.getItem("tierName"));
        }
        console.log("this.tierName==>", this.tierName);
        // making url for Ajax Call
        this.urlAjaxParam = '&flowpathSignature=' + this.flowpathSignature +
          '&strGroup=' + this.strGroupBy +
          '&tierName=' + this.tierName +
          '&serverName=' + this.serverName +
          '&appName=' + this.appName +
          '&tierId=' + this.tierId +
          '&serverId=' + this.serverId +
          '&appId=' + this.appId +
          '&strStartTime=' + this.strStartTime +
          '&strEndTime=' + this.strEndTime +
          '&threadId=' + this.threadId +
          '&sqlIndex=' + this.sqlIndex +
          '&btCategory=' + this.btCategory +
          '&flowpathEndTime=' + this.flowpathEndTime +
          '&statusCode=' + this.statusCode +
          '&object=4' +
          '&checkBoxValForURLIndexFromURLName=' + this._ddrData.valueForCheckBox;
        if (this.urlParam.urlIndex)
          this.urlAjaxParam += "&urlIndex=" + this.urlParam.urlIndex;
        else 
          this.urlAjaxParam += '&urlName=' + this.urlName;
          
        if (this.urlParam.isFromNV && this.urlParam.isFromNV === "1") {
          this.urlAjaxParam += "&strOrderBy=stime";
          this.commonService.sortedField = "startTime";
          this.commonService.sortedOrder = "1";
          document.title = "Cavisson Netdiagnostics Enterprise";
        }
        else
          this.urlAjaxParam += "&strOrderBy=" + this.strOrderBy;

        if (this._ddrData.customToFlowpathFlag === true) {
          this.urlAjaxParam += '&urlIndex=' + this.urlIndex;
          if (this.commonService.patternflag === true && !this._ddrData.dbTofpflag) {
            this.urlAjaxParam += '&customData=' + this.customData +
              '&customFilter=' + this.CustomFilter +
              '&templateName=FP';
          }
        }
        if (this.urlParam.resTimeFlagforCustomData === '1' && this.urlParam.searchByCustomDataOptions !== "NA"
          && this._ddrData.nvFiltersFlag !== true && !this._ddrData.dbTofpflag) {
          this.urlAjaxParam += '&templateName=FP';
        } else if (sessionStorage.getItem('resTimeFlagforCustomData') === '1' && this.urlParam.searchByCustomDataOptions !== "NA"
          && !this._ddrData.dbTofpflag) {
          this.urlAjaxParam += '&templateName=FP';
        }

        if (this.urlParam.mode !== '' && this.urlParam.mode !== 'NA' && this.urlParam.mode !== 'undefined'
          && this.urlParam.mode !== undefined) {
          this.urlAjaxParam += '&mode=' + this.urlParam.mode;
        } else if (sessionStorage.getItem('mode') !== '' && sessionStorage.getItem('mode') !== 'NA'
          && sessionStorage.getItem('mode') !== 'undefined' && sessionStorage.getItem('mode') !== undefined) {
          this.urlAjaxParam += '&mode=' + sessionStorage.getItem('mode');
        }
        if (this.urlParam !== {} && this.urlParam != undefined && this.urlParam != "undefined") {
          this.urlAjaxParam += '&pageIdx=' + this.urlParam.pageIdx + '&pageName=' + this.urlParam.pageName + '&transtx=' + this.urlParam.transtx +
            '&script=' + this.urlParam.script + '&sessionIndex=' + this.urlParam.sessionIndex + '&nsUrlIdx=' + this.urlParam.nsUrlIdx +
            '&location=' + this.urlParam.location + '&access=' + this.urlParam.access + '&userBrowserIndex=' + this.urlParam.userBrowserIndex +
            '&strStatus=' + this.urlParam.strStatus + '&generatorId=' + this.urlParam.generatorId + '&generatorName=' + this.urlParam.generatorName +
            '&urlNameFC=' + this.urlParam.urlNameFC;
        }
        if (this.urlParam.customData !== "NA" && this.urlParam.customData !== null
          && this.urlParam.customData !== "undefined" && this.urlParam.customData !== undefined &&
          this.urlParam.customData !== "" && !this._ddrData.dbTofpflag) {
          this.urlAjaxParam += '&customData=' + this.customData + '&templateName=FP';
        }
        if (this.urlParam.correlationId !== "NA" && this.urlParam.correlationId !== null
          && this.urlParam.correlationId !== undefined && this.urlParam.correlationId !== "") {
          this.urlAjaxParam += '&correlationId=' + this.correlationId;
        }
        if (this.urlParam.flowpathID !== "NA" && this.urlParam.flowpathID !== null
          && this.urlParam.flowpathID !== undefined && this.urlParam.flowpathID !== "") {
          this.urlAjaxParam += '&flowpathID=' + this.flowpathID;
        }
        if (this.validateField(this._ddrData.flowpathID)) {
          this.urlAjaxParam += '&flowpathID=' + this._ddrData.flowpathID
        }
        if (this._ddrData.FromexpFlag == 'true') {
          this.urlAjaxParam += '&flowpathID=' + this.flowpathID;
        }
        if (this._ddrData.fpIdFromNSSession) {
          this.urlAjaxParam += '&flowpathID=' + this.flowpathID;
        }
        if (this.minMethods != undefined && this.minMethods >= 0) {
          this.urlAjaxParam += '&minMethods=' + this.minMethods;
        }
        if (this.responseTime != undefined && this.responseTime >= 0) {
          if (this.selectedResponse.id == 10) {
            this.urlAjaxParam += '&responseTime=' + this.responseTime + '&resptimeqmode=1';
          }
          if (this.selectedResponse.id == 11) {
            this.urlAjaxParam += '&responseTime=' + this.responseTime + '&resptimeqmode=2';
          }
          if (this.selectedResponse.id == 12) {
            this.urlAjaxParam += '&responseTime=' + this.responseTime + '&resptimeqmode=3' + '&responseTime2=' + this.responseTime;
          }
        }
        if (this._ddrData.urlIndexAgg && this._ddrData.isFromtrxFlow) {
          this.urlAjaxParam += '&urlIndex=' + this._ddrData.urlIndexAgg;
        }
        if (this._ddrData.FromexpFlag != 'true') {
          let nvParamAll, nvParamNdNv, nvParamNd;
          nvParamAll = "";
          nvParamNdNv = "";
          nvParamNd = "";
          console.log("********* ", this.urlParam);
          if (this.urlParam.nvPageId !== "NA" && this.urlParam.nvPageId !== null
            && this.urlParam.nvPageId !== undefined && this.urlParam.nvPageId !== "") {
            // this.urlAjaxParam += "&nvPageId=" + this.urlParam.nvPageId;
            nvParamAll = "&nvPageId=" + this.urlParam.nvPageId;
          }
          else if (this.nvIndex == 0) {
            this.nvIndex = 1;
          }
          if (this.urlParam.nvSessionId !== "NA" && this.urlParam.nvSessionId !== null
            && this.urlParam.nvSessionId !== undefined && this.urlParam.nvSessionId !== "") {
            //     this.urlAjaxParam += "&nvSessionId=" + this.urlParam.nvSessionId;
            nvParamAll += "&nvSessionId=" + this.urlParam.nvSessionId;
          }
          else {
            this.nvIndex = 2;
          }
          if (this.urlParam.ndSessionId !== "NA" && this.urlParam.ndSessionId !== null
            && this.urlParam.ndSessionId !== undefined && this.urlParam.ndSessionId !== "") {
            //   this.urlAjaxParam += "&ndSessionId=" + this.urlParam.ndSessionId;
            nvParamAll += "&ndSessionId=" + this.urlParam.ndSessionId;
            nvParamNd = "&ndSessionId=" + this.urlParam.ndSessionId;
            nvParamNdNv = "&nvSessionId=" + this.urlParam.nvSessionId + nvParamNd;
          }
          this.nvArr = [nvParamAll, nvParamNdNv, nvParamNd];
        }
        if (this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
          && !(sessionStorage.getItem("isMultiDCMode") == "true"
            && (!this.urlParam.flowpathID || this.urlParam.flowpathID == "NA"))) {
          if (this.urlParam.nvIndex && this.urlParam.nvIndex != "undefined")
            this.nvIndex = Number(this.urlParam.nvIndex);
          if (this.nvArr[this.nvIndex] && this.nvArr.length > 0)
            this.urlAjaxParam += this.nvArr[this.nvIndex] + "&nvIndex=" + this.nvIndex + "&isFromNV=" + this.urlParam.isFromNV;
          else
            this.urlAjaxParam += "&isFromNV=" + this.urlParam.isFromNV;
        }
        if (this._ddrData.nvFiltersFlag == true) {
          this.urlAjaxParam += "&ndSessionId=" + this.urlParam.ndSessionId + "&nvSessionId=" + this.urlParam.nvSessionId + "&nvPageId=" + this.urlParam.nvPageId;
          this.urlAjaxParam += "&NVtoNDFilterForAngular=1";
        }
        this.urlAjaxParamObject = this.commonService.makeObjectFromUrlParam(this.urlAjaxParam);
        this.commonService.fpFilters = this.urlAjaxParamObject;
        this.commonService.fpFilters['corModeValue'] = this.urlParam.mode;
        // MultiDC case - Autofill disabling causing some issue related to urlIndex as currently sidebar is not supported multidc 
        if (!this.commonService.dcNameList) {
          setTimeout(() => {
            this.messageService.sendMessage(this.commonService.fpFilters);
          }, 2000);
        }
        console.log('page loading first case --object made from urlparam ==', JSON.stringify(this.commonService.fpFilters));
        console.log('page loading first case---ajax call url for data ==', this.urlAjaxParam);

        if (this.commonService.isValidParamInObj(this.urlAjaxParamObject, 'flowpathID')) {
          this.commonService.isCheckedFlowpath = true;
          this.commonService.flowpathInstance = this.flowpathID;
        }
      }

      /* if (this._ddrData.FromhsFlag != 'true') {
         ajaxFlags = '&shellForNDFilters=1&customFlag=' + this.customFlag;
       }*/
      if (this._ddrData.IPByFPFlag === true) {
        console.log('Inside Integration Point');
        this.urlParam.backendId = this.commonService.IPByFPData.backendId;
        this.urlParam.backendRespTime = this.commonService.IPByFPData.maxresTimeOfBackend;
        this.urlParam.backendName = this.commonService.IPByFPData.backendName;
        this.urlAjaxParam += '&urlIndex=' + this._ddrData.urlIndex;
        this.urlName = this.commonService.IPByFPData.urlNameIP;
      }
      console.log(' this.commonService.IPByFPData----', this.commonService.IPByFPData, this.urlParam);
      let bId = this.urlParam['backendId'];
      if (this.urlParam && bId && bId != "undefined" && bId != "NA") {
        this.urlAjaxParam += '&backenId=' + bId +
          '&backendResTime=' + this.urlParam.backendRespTime;
      }

      this.setDefaultSort(this.commonService.fpFilters);
      finalUrl = this.url + this.urlAjaxParam + pagination + ajaxFlags + customDataFilter + '&showCount=false&shellForNDFilters=' + this.shellForNDFilters + '&queryId=' + this.queryId;

      /**commenting this code due to migration*/

      // if (this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1" && (!this.urlParam.flowpathID || this.urlParam.flowpathID === "NA") && sessionStorage.getItem("isMultiDCMode") == "true")
      //  //NV-ND ALL case
      // {
      //   this.getNVtoNDForAll(this.urlAjaxParam + ajaxFlags + customDataFilter + '&queryId=' + this.queryId).then(() => {
      //     console.log("Done resolving");
      //     this.processingInterval = setInterval(() => {
      //       if (this.checkIntervalFlag == this.ndeInfoData.length || Object.keys(this.nvPageIndex).length > 0)
      //         this.callFlowPathFromNVNForAllDC();
      //       console.log("checking Interval ", this.checkIntervalFlag, " k ", Object.keys(this.nvPageIndex).length);
      //     }, 300);
      //   });
      // }
      // else {
      //let sendUrl = "http://10.10.40.3:8004/netdiagnostics/v1/cavisson/netdiagnostics/webddr/startQuery?testRun=12321&queryId="+this.queryId;     

      // making get type request to get data

      console.log("final url for data---", finalUrl, this._ddrData.guiCancelationTimeOut);
      setTimeout(() => {
        this.openpopup();
      }, this._ddrData.guiCancelationTimeOut);

      this.ddrRequest.getDataUsingGet(finalUrl).subscribe(
        data => (this.assignFlowpathData(data))
        , error => {

          if (error.hasOwnProperty('message')) {
            this.commonService.showError(error.message);
          }
          this.loader = false;
          this.loading = false;
          this.ajaxLoader = false;
        }
      );
      //}
      this.customFlag = false;
    }
    catch (error) {
      console.log('error in getting data from rest call', error);
    }
  }

  checkAllCase() {
    let url;
    url = this.getHostUrl();
    return url;
  }

  validateField(validateParam: any) {
    if (validateParam === null) {
      return false;
    }
    if (validateParam === "null") {
      return false;
    }
    if (validateParam === "undefined") {
      return false;
    }
    if (validateParam === undefined) {
      return false;
    }
    if (validateParam === "NA") {
      return false;
    }
    if (validateParam === "") {
      return false;
    }
    if (validateParam === "NaN") {
      return false;
    }
    if (validateParam === "-") {
      return false;
    }
    return true;

  }

  makeAjaxParameter() {
    if (this._ddrData.FromexpFlag == 'true') {
      console.log(' method makeAjaxParameter and FromexpFlag is true');
      this.flowpathID = this.commonService.exptoFpData.flowPathInstance;
      this.tierName = this.commonService.exptoFpData.tierName;
      this.serverName = this.commonService.exptoFpData.serverName;
      this.appName = this.commonService.exptoFpData.appName;
      this.tierId = this.commonService.exptoFpData.tierid;
      this.serverId = this.commonService.exptoFpData.serverid;
      this.appId = this.commonService.exptoFpData.appid;
      this.strStartTime = this.commonService.exptoFpData.startTime;
      this.strEndTime = this.commonService.exptoFpData.endTime;
    }
    else if (this._ddrData.FromhsFlag == 'true') {
      console.log(' method makeAjaxParameter and FromhsFlag is true');
      this.tierName = this.commonService.hstofpData.tierName;
      this.serverName = this.commonService.hstofpData.serverName;
      this.appName = this.commonService.hstofpData.appName;
      this.tierId = this.commonService.hstofpData.tierid;
      this.serverId = this.commonService.hstofpData.serverid;
      this.appId = this.commonService.hstofpData.appid;
      this.strStartTime = this.commonService.hstofpData.hsTimeInMs;
      this.strEndTime = this.commonService.hstofpData.hsEndTime;
      this.threadId = this.commonService.hstofpData.threadId;
      this.strEndTime = this.commonService.hstofpData.hsEndTime;
      this.flowpathEndTime = this.commonService.hstofpData.flowpathEndTime;
      this.paginationFlag = false;

    } else if (this._ddrData.IPByFPFlag === true) {
      console.log('Inside Integration Point call Case');
      this.tierName = this.commonService.IPByFPData.tierName
      this.appName = this.commonService.IPByFPData.appName;
      this.serverName = this.commonService.IPByFPData.serverName;
      this.tierId = this.commonService.IPByFPData.tierId;
      this.serverId = this.commonService.IPByFPData.serverId;
      this.appId = this.commonService.IPByFPData.appId;
      this.strStartTime = this.commonService.IPByFPData.startTime;
      this.strEndTime = this.commonService.IPByFPData.endTime;
    }
    else if (this._ddrData.dbTofpflag == true) {
      console.log(' method makeAjaxParameter and dbtoflowpath is true');
      this.tierName = this.commonService._dbflowpathdata.tierName;
      this.serverName = this.commonService._dbflowpathdata.serverName;
      this.appName = this.commonService._dbflowpathdata.appName;
      this.tierId = this.commonService._dbflowpathdata.tierid;
      this.serverId = this.commonService._dbflowpathdata.serverid;
      this.appId = this.commonService._dbflowpathdata.appid;
      this.sqlIndex = this.commonService._dbflowpathdata.sqlIndex;
      this.strStartTime = this.trStartTime;
      this.strEndTime = this.trEndTime;
      this.btCategory = this.urlParam.btCategory;
      this.urlParam.strOrderBy = 'fpduration_desc';
      this.strOrderBy = this.urlParam.strOrderBy;
      console.log("this.strOrderBy---", this.urlParam.strOrderBy);

    } else if (this._ddrData.customToFlowpathFlag === true) {
      console.log('*************Inside Custom data to Flowpath*********', this.commonService.customToFlowpathData);

      this.tierName = this.urlParam.tierName;
      this.serverName = this.urlParam.serverName;
      this.appName = this.urlParam.appName;
      this.tierId = this.urlParam.tierid;
      this.serverId = this.urlParam.serverid;
      this.appId = this.urlParam.appid;
      this.urlName = this.commonService.customToFlowpathData.BusinesTransaction;
      this.urlIndex = this.commonService.customToFlowpathData.urlindex;
      this.strStartTime = this.commonService.customToFlowpathData.startTime;
      this.strEndTime = this.commonService.customToFlowpathData.endTime;
      this.btCategory = this.commonService.customToFlowpathData.btCategory;
      if (this.commonService.patternflag === true) {
        this.customData = this.commonService.customToFlowpathData.customData;
        this.CustomFilter = this.commonService.customToFlowpathData.CustomFilter;
      }
    } else if (this._ddrData.fpIdFromNSSession) {
      /**
       * From Session Timing Detail 
       */
      this.flowpathID = this._ddrData.fpIdFromNSSession;
      this.strStartTime = this.urlParam.startTime;
      this.strEndTime = this.urlParam.endTime;
    } else {
      console.log(' method makeAjaxParameter and its normal case', this.urlParam.strOrderBy);
      this.flowpathID = this.urlParam.flowPathInstance;
      this.tierName = this.urlParam.tierName;
      this.serverName = this.urlParam.serverName;
      this.appName = this.urlParam.appName;
      this.tierId = this.urlParam.tierid;
      this.serverId = this.urlParam.serverid;
      this.appId = this.urlParam.appid;
      this.urlName = this.urlParam.urlName;
      this.strStartTime = this.trStartTime;
      this.strEndTime = this.trEndTime;
      this.strOrderBy = this.urlParam.strOrderBy;

      if (this.urlParam.customData !== 'NA' && this.urlParam.customData !== null
        && this.urlParam.customData !== undefined && this.urlParam.customData !== "") {
        this.customData = this.urlParam.customData;
      }
      if (this.urlParam.correlationId !== 'NA' && this.urlParam.correlationId !== null
        && this.urlParam.correlationId !== undefined && this.urlParam.correlationId !== "") {
        this.correlationId = this.urlParam.correlationId;
      }
      if (this.urlParam.flowpathID !== 'NA' && this.urlParam.flowpathID !== null
        && this.urlParam.flowpathID !== undefined && this.urlParam.flowpathID !== ""
        && this.urlParam.flowpathID !== "undefined") {
        this.flowpathID = this.urlParam.flowpathID;
      }
      if (this.validateField(this._ddrData.flowpathID)) {
        this.flowpathID = this._ddrData.flowpathID
      }
      if (this.urlParam.sqlIndex !== 'NA' && this.urlParam.sqlIndex !== null
        && this.urlParam.sqlIndex !== undefined &&
        this.urlParam.sqlIndex !== "") {
        this.sqlIndex = this.urlParam.sqlIndex;
      }

      if (this.urlParam.btCategory == '13')
        this.statusCode = '400';

      if (this._ddrData.urlFlag === true) {
        console.log(' method makeAjaxParameter and its normal case and _ddrData.urlFlag is true');
        this.btCategory = 'All';
        this.strGroupBy = 'url';
        this.tableOptions = false;
        this.optionsButton = false;
        this._ddrData.urlFlag = false;
        this.showHeaderForGrpByBT = true;
      }
      else {
        this.btCategory = this.urlParam.btCategory;
        this.tableOptions = true;
        this.optionsButton = true;
      }
      if (this._ddrData.fpByBTFlag === true) {
        this.urlIndex = this.commonService.fpByBTData.urlIndex;
        this.urlName = this.commonService.fpByBTData.urlName;
        this.btCategory = this.convertCategory(this.commonService.fpByBTData.btCatagory);
        this._ddrData.fpByBTFlag = false;
      }
      if (this._ddrData.fpSignatureflag == true) {
        this.statusCode = '-2';
        this.strGroupBy = 'flowpathsignature';
        this.fpSignatureFlag = true;
        this.selectedTab = false;
        this.optionsButton = false;
        // this._ddrData.fpSignatureflag = false;
      }
      if (this.commonService.signatureTofpFlag === true) {
        console.log("this.commonService.signatureTofpFlag  is true ");
        this.statusCode = '-2';
        this.flowpathSignature = this.commonService.signatureTofpData.flowpathSignature;
      }
    }
  }

  getFlowpathDataCount() {
    try {

      let ajaxUrlCount = this.url + this.urlAjaxParam + '&limit=' + this.fpLimit + '&offset=' + this.fpOffset + 
      '&showCount=true&shellForNDFilters=' + this.shellForNDFilters;
      console.log('ajax url for count--------->', ajaxUrlCount);

      // making get type request to get data count
      this.ddrRequest.getDataUsingGet(ajaxUrlCount).subscribe(data => (this.assignFlowpathDataCount(data)));
    }
    catch (error) {
      console.log('error in getting data from rest call', error);
    }
  }

  assignFlowpathDataCount(res: any) {
    if (res && res.totalCount && Number(res.totalCount > 0)) {
      this.fpTotalCount = res.totalCount;
      // let nvFlag = (this.urlParam && this.nvIndex == 1
      //   && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
      //   && !(sessionStorage.getItem("isMultiDCMode") == "true"));
      // console.log("nvFlag ", nvFlag);
      if (this.fpTotalCount > 0 && this.fpLimit > this.fpTotalCount) {
        this.fpLimit = Number(this.fpTotalCount);
        /* if (nvFlag) {
           this.nvPageCount.push(this.fpTotalCount);
           if (this.nvndData.length > 0 || this.isFromPage) {
             setTimeout(() => {
               this.fpTotalCount = this.nvPageCount[0];
               this.fpLimit = Number(this.fpTotalCount);
             }, 1000);
           }
         } */
      }
      /* else if (nvFlag) {
        this.nvPageCount.push(this.fpTotalCount);
        console.log("((this.dcList && this.dcList.length == this.dcIndexForNV) && this.nvndData.length > 0)");
        if (this.nvndData.length > 0 || this.isFromPage) {
          setTimeout(() => {
            this.fpTotalCount = this.nvPageCount[0];
          }, 1000);
          //this.fpLimit = Number(this.fpTotalCount);
          console.log("this.fpTotalCount ", this.fpTotalCount, "this.fpLimit ", this.fpLimit);
        }
        else if (sessionStorage.getItem("isMultiDCMode") !== "true" && this.nvIndex != 2)
          setTimeout(() => {
            this.fpTotalCount = this.nvPageCount[0];
          }, 1000);
      } */
    }
    else if (this._ddrData.isFromNV !== "1") {
      this.fpTotalCount = 0;
    }
    console.log("check this.fpLimit ", this.fpLimit, "this.fpTotalCount ", this.fpTotalCount);
  }

  getDCData() {
    let url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.urlParam.testRun;
    //this.http.get(url).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any>res;
      console.log('COMPONENT - flowpath , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
      if (data.length == 0) {
        data = this.setNDEInfoForSingleDC();
        console.log("data is ", data);
      }
      if (this.commonService.dcNameList.indexOf(',') != -1) {
        this.getNDEInfo(data)
      } else {
        this.singleDCCase(data);
      }
    },
      error => {
        console.log("multiDC request is getting failed");
      });
  }

  setNDEInfoForSingleDC() {
    let data;
    if (this.urlParam.dcName)
      data = [{ "displayName": this.urlParam.dcName, "ndeId": 1, "ndeIPAddr": this.urlParam.dcIP, "ndeTomcatPort": this.urlParam.dcPort, "ndeCtrlrName": "", "pubicIP": this.urlParam.dcIP, "publicPort": this.urlParam.dcPort, "isCurrent": 1, "ndeTestRun": this.urlParam.testRun, "ndeProtocol": location.protocol.replace(":", "") }];
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
    this.isFromDropDown = true;
    this.ndeInfoData = res;
    this.selectedDC = this.commonService.dcNameList;
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.commonService.dcNameList == this.ndeInfoData[i].displayName) {

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.protocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.urlParam.testRun;

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
    this.loader = true;
    this.getProgressBar();
    this.getFlowpathData();
    this.getFlowpathDataCount();
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
            this.tierName = tierList;
        }
        else {
          if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
            temp = (this.commonService.tierNameList).substring(dcName.length + 1);
            tierList = temp;
            tierList = tierList.substring(0, tierList.length);
            if (tierList != "") {
              this.tierName = tierList;
              this.urlParam.tierName = tierList;
              this.commonService.fpFilters['tierName'] = tierList;
            }
          } else {
            this.tierName = this.commonService.tierNameList;
            this.urlParam.tierName = this.commonService.tierNameList;
            this.commonService.fpFilters['tierName'] = tierList;
          }
        }
        console.log('tierName=====>', this.tierName);
        this.getTieridforTierName(this.tierName).then(() => { console.log("******then aaa "); resolve() });
      });
    } catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getNDEInfo(res) {
    // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'Flowpath') {
    if (this.breadcrumb && this.breadcrumb[0].label == 'Flowpath'){
      if (sessionStorage.getItem("isMultiDCMode") != "true")
        this.showDCMenu = false;
    }
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
          url = this.checkAllCase();
          console.log("url==>", url);
        }
        url += '/' + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.urlParam.testRun + "&tierName=" + tierName;
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
      this.urlParam.tierid = temp[0].trim();
    } catch (e) {
      console.log('exception in getting tier id=====', e);
    }
  }

  getSelectedDC($event?) {
    if ($event) {
      this.selectedDC = $event.value;
      this.isFromDropDown = true;
      this.nvndData = [];
      this.nvIndex = 1;
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
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.urlParam.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.dcProtocol;
        this.commonService.testRun = this.testRun;
        this.commonService.selectedDC = this.selectedDC;
        console.log('commonservece variable--------->', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.loader = true;
      /* setting limit and offset in case of dc changed */
      this.fpLimit = 50;
      this.fpOffset = 0;
      this.getProgressBar();
      this.getFlowpathData();
      this.getFlowpathDataCount();
    })
  }

  assignFlowpathData(res: any) {
    this.isCancelQuerydata = true;
    this.commonService.isFilterFromSideBar = false;
    try {
      if (res === null || res === undefined) {
        return;
      }
      this.commonService.cmdFileName = res.fileName;
      setTimeout(() => {
        this.loader = false;
      }, 2000);
      this.value = 1;
      this.loading = false;
      this.ajaxLoader = false;
      this.commonService.edStrStartDate = res.strStartTime;
      this.commonService.edStrEndDate = res.strEndTime;
      this.showHeaderInfo(res.strStartTime, res.strEndTime);
      if (!this.nvndFirstData) {
        //commenting this method due to error of LZ string used in it.
       this.createLinkForCopy();
      }
      if (res.hasOwnProperty('Status')) {
        console.log("Status", res.Status);
        if (this._ddrData.isFromNV !== "1" || ((this._ddrData.isFromNV === "1") && (this.nvIndex == 2 || (this.urlParam.flowpathID && this.urlParam.flowpathID != "NA")) && (sessionStorage.getItem("isMultiDCMode") != "true" || (sessionStorage.getItem("isMultiDCMode") == "true"))))
          this.commonService.showError(res.Status);
        else if (this._ddrData.isFromNV === "1" && (this.dcList && this.dcList.length <= this.dcIndexForNV + 1) && (this.nvIndex == 2 || (this.urlParam.flowpathID && this.urlParam.flowpathID != "NA")))
          this.commonService.showError(res.Status);
      }
      let fpResponseTimeArr = [];
      // updating data in component variable
      this.queryData = res.data;
      this.flowpathData = res.data || [];

      if (this.flowpathData.length == 0) {
        this.empty = true;
      }
      
      if (!JSON.stringify(this.flowpathData).includes("gcPause") && this.cols[31] && this.cols[31]["field"] == "gcPause") {
        this.cols.splice(31, 1);
        this.columnOptions.splice(31, 1);
      }

      if (this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
        && !(sessionStorage.getItem("isMultiDCMode") == "true"
          && (!this.urlParam.flowpathID || this.urlParam.flowpathID == "NA")))
        // this.getNVtoND(res);       //commenting due to migration

        console.log("******************+++++++++++", res);

      if (res.hasOwnProperty('totalCount')) {
        this.fpTotalCount = res.totalCount;
        if (this.fpTotalCount > 0 && this.fpLimit > this.fpTotalCount)
          this.fpLimit = Number(this.fpTotalCount);
      }
      if (this.flowpathData.length !== 0) {
        this.flowpathData.forEach((val, index) => {
          if (val['correlationId'] === '') {
            val['correlationId'] = '-';
          }
          if (val['waitTime'] === '' || val['syncTime'] === '' || val['iotime'] === '' || val['suspensiontime'] === '') {
            val['waitTime'] = '0';
            val['syncTime'] = '0';
            val['iotime'] = '0';
            val['suspensiontime'] = '0';
          }
          if (val['QTimeInMS'] === '-1') {
            val['QTimeInMS'] = '-';
          }
        });
      }

      // For handling new columns whether to show by default or not
      // if (this.flowpathData.length !== 0) {
      //   if (this.flowpathData[0].selfResponseTime != undefined && this.flowpathData[0].selfResponseTime != 'NA' && this.flowpathData[0].selfResponseTime != '') {
      //     this.visibleCols.push('selfResponseTime');
      //     this.cols[28].action = true ;
      //   }

      //   if (this.flowpathData[0].ParentFlowpathInstance != undefined && this.flowpathData[0].ParentFlowpathInstance != 'NA' && this.flowpathData[0].ParentFlowpathInstance != '') {
      //     this.visibleCols.push('ParentFlowpathInstance');
      //     this.cols[29].action = true ;
      //   }
      //   if (this.flowpathData[0].totalCpuTime != undefined && this.flowpathData[0].totalCpuTime != 'NA' && this.flowpathData[0].totalCpuTime != '') {
      //     this.visibleCols.push('totalCpuTime');
      //     this.cols[30].action = true ;
      //   }
      // }
      if (this.flowpathData.length === 0) {
        this.showDownLoadReportIcon = false;
        document.getElementById("DDR-BOX").style.height = 'auto';
      }
      else
        this.showDownLoadReportIcon = true;
      if (this.tableOptions === true && this.flowpathData.length !== 0) {
        document.getElementById("DDR-BOX").style.height = (this.flowpathData.length * 18) + 210 + 'px';
        this.flowpathData.forEach((val, index) => {
          val.fpDuration = this.ResponseFormatter(val.fpDuration);
          val.methodsCount = this.formatter(val.methodsCount);
          val.callOutCount = this.formatter(val.callOutCount);
          val.dbCallCounts = this.formatter(val.dbCallCounts);
          val.btCatagory = this.getBTCategory(val.btCatagory);
          if (val.backendMaxDur)
            val.backendMaxDur = this.formatter(val.backendMaxDur);
          fpResponseTimeArr.push(Number(val.fpDuration));
        });
        console.log('Btcategorycount data-----------', res.btCategoryCount);
        this.createBarChart(fpResponseTimeArr);
      } else {
        this.flowpathData.forEach((val, index) => {
          fpResponseTimeArr.push(Number(val['average']));
        });
        this.createBarChart(fpResponseTimeArr);
      }
      //this.createPieChart(res);
      this.fillSelection();
    } catch (error) {
      console.log(error);
    }

  }

  convertCategory(category: any) {
    if (category === 'Very Slow') {
      category = '12';
    }
    if (category === 'Slow') {
      category = '11';
    }
    if (category === 'Error') {
      category = '13';
    }
    if (category === 'Normal') {
      category = '10';
    }
    if (category === 'Other') {
      category = '0';
    }
    return category;
  }

  getBTCategory(category) {
    if (category === '12') {
      category = 'Very Slow';
    }
    if (category === '11') {
      category = 'Slow';
    }
    if (category === '10') {
      category = 'Normal';
    }
    if (category === '13') {
      category = 'Errors';
    }
    if (category === '0') {
      category = 'Other';
    }
    return category;
  }
  ResponseFormatter(resTime: any) {
    if (Number(resTime) && Number(resTime) > 0) {
      return Number(resTime).toLocaleString();
    }
    if (Number(resTime) == 0) {
      return '< 1';
    } else {
      return resTime;
    }
  }

  formatter(data: any) {
    if (Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }

  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    this.currentvisibleCols = [this.visibleCols.length];
    let k = 0;
    if (this.visibleCols.length !== 0) {
      for (let i = 0; i < this.cols.length; i++) {
        for (let j = 0; j < this.visibleCols.length; j++) {
          if (this.cols[i].field === this.visibleCols[j]) {

            this.currentvisibleCols[k] = this.visibleCols[j];
            k++;
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    try {
      if (document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]) {
        let colWidthCSS = document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]['style'].width;
        console.log("colwidthcssss", colWidthCSS);
        if (colWidthCSS) {
          let numCSS = colWidthCSS.substring(0, colWidthCSS.indexOf('px'));
          console.log("numcsssssss", numCSS);
          if (numCSS > 20)
            document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]['style'].width = "20px";
        }
        console.log(document.getElementsByClassName("ui-state-default ui-unselectable-text ui-resizable-column ui-selection-column ng-star-inserted")[0]['style'].width, " true ", colWidthCSS);
      }
    }
    catch (error) {
      console.log("error", error);
    }

    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });

  }


  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilter() {
    // this.isEnabledColumnFilter = !this.isEnabledColumnFilter;
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
      // if(tableColumns)
      if (tableColumns) {
        if (this.isEnabledColumnFilter) {
          this.toggleFilterTitle = 'Show Column Filters';
          for (let i = 0; i < tableColumns.length; i++) {
            tableColumns[i].filter = false;
          }
        } else {
          this.toggleFilterTitle = 'Hide Column Filters';
          for (let i = 0; i < tableColumns.length; i++) {
            tableColumns[i].filter = true;
          }
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

  createBarChart(fpResponseTimeArr) {
    console.log('res tym---', fpResponseTimeArr.length);
    if (fpResponseTimeArr.length === 0 || fpResponseTimeArr.length < 5 || this.fpSignatureFlag === true) {
      this.showBarChart = false;
    } else {
      this.showBarChart = true;
    }
    this.barChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Flowpath Response Time'
      },
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
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Time (ms)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} ms</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Response Time',
          enableMouseTracking: true,
          data: fpResponseTimeArr
        }]
    }
  }



  createPieChart(res: any) {
    console.log(' inside create pie chart  for flowpath-------------', res);
    let btInfoArr = [];
    if (this.optionsButton === false) {
      this.chartData = res.data;
      if (this.chartData.length === 0 || this.flowpathData.length === 0 || this.fpSignatureFlag === true) {
        this.showChart = false;
      } else {
        this.showChart = true;
      }
      for (let j = 0; j < this.chartData.length; j++) {
        btInfoArr.push({ 'name': this.chartData[j]['urlName'], 'y': Number(this.chartData[j]['fpCount']) });
      }

    } else {
      this.chartData = res.btCategoryCount;
      if (this.chartData.length === 0 || this.flowpathData.length === 0) {
        this.showChart = false;
      } else {
        this.showChart = true;
      }
      for (let j = 0; j < this.chartData.length; j++) {
        console.log('chart data', this.chartData[j]);
        btInfoArr.push({ 'name': 'Normal', 'y': Number(this.chartData[j]['normal']), 'color': 'green' });
        btInfoArr.push({ 'name': 'Slow', 'y': Number(this.chartData[j]['slow']), 'color': 'yellow' });
        btInfoArr.push({ 'name': 'Very Slow', 'y': Number(this.chartData[j]['veryslow']), 'color': 'orange' });
        btInfoArr.push({ 'name': 'Errors', 'y': Number(this.chartData[j]['errors']), 'color': 'red' });
      }
    }
    console.log('btArrayInfo------', btInfoArr)
    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: 'BT Category', style: { 'fontSize': '13px' } },
      tooltip: {
        formatter: function () {
          return ' ' +
            '<b>' + this.point.name + '</b>' + '<br />' +
            '<b>Percentage: </b>' + this.point.percentage.toFixed(1) + '%' + '<br />' +
            '<b>Count: </b>' + this.point.y;
        }
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
        }
      },
      series: [
        {
          name: 'Percentage',
          data: btInfoArr,
          enableMouseTracking: true
        }
      ]
    };
  }

  showHeaderInfo(startTime: any, endTime: any) {
    this.headerInfo = "";
    this.URLstr = "";
    this.CompleteURL = "";
    this.filterTierName = '';
    this.filterServerName = '';
    this.filterInstanceName = '';
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    this.filterDCName = '';
    this.downloadFilterCriteria = '';

    let fpHeader = this.commonService.fpFilters;
    console.log("fpHeader --", JSON.stringify(fpHeader));
    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA' && this.selectedDC != "undefined" && this.selectedDC != "null") {
      this.filterDCName = 'DC=' + this.selectedDC + ', ';
      this.downloadFilterCriteria = this.filterDCName;
      if (this._ddrData.isFromtrxFlow && ((this._ddrData.dbTofpflag) || (this._ddrData.IPByFPFlag) || (this._ddrData.FromhsFlag == "true") || (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true"))) {
        this.filterDCName = 'DC=' + this._ddrData.dcNameTr + ', ';
        this.downloadFilterCriteria = 'DC=' + this._ddrData.dcNameTr + ', ';
      }
    }
    else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      //let dcName = this._cavConfig.getActiveDC();     //commenting due to migration
      let dcName = "ALL";
      if (dcName == "ALL") {
        if (this._ddrData.dcName)
          dcName = this._ddrData.dcName;
        else
          dcName = this._ddrData.getMasterDC();

        //resettinng ddr in cav_nav_bar in case of NF
        /*commenting for migration */
        // if (this._cavConfig.$WdinputsforDdr && !this._ddrData.isFromNVNF) {
        //   this._cavNavBar.setDDRArguments(dcName, true);
        //   this._ddrData.isFromNVNF = true;
        // }
      }

      this.filterDCName = 'DC=' + dcName + ', ';
      this.downloadFilterCriteria = this.filterDCName;
      if (this._ddrData.isFromtrxFlow && ((this._ddrData.dbTofpflag) || (this._ddrData.IPByFPFlag) || (this._ddrData.FromhsFlag == "true") || (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true"))) {
        this.filterDCName = 'DC=' + this._ddrData.dcNameTr + ', ';
        this.downloadFilterCriteria = 'DC=' + this._ddrData.dcNameTr + ', ';
      }
    }
    if (this._ddrData.cmdArgsFlag) {
      if (this.commonService.fpAnalyzeData.tierName != undefined && this.commonService.fpAnalyzeData.tierName != "undefined") {
        if (this.commonService.fpAnalyzeData.tierName.length > 32) {
          this.filterTierName = 'Tier=' + this.commonService.fpAnalyzeData.tierName.substring(0, 32) + '...';
          this.completeTier = this.commonService.fpAnalyzeData.tierName;
        } else
          this.filterTierName = 'Tier=' + this.commonService.fpAnalyzeData.tierName;
        this.downloadFilterCriteria += 'Tier=' + this.commonService.fpAnalyzeData.tierName;
      }
      if (this.commonService.fpAnalyzeData.serverName != undefined && this.commonService.fpAnalyzeData.serverName != "undefined") {
        this.filterServerName = ", Server=" + this.commonService.fpAnalyzeData.serverName;
        this.downloadFilterCriteria += ", Server=" + this.commonService.fpAnalyzeData.serverName;
      }
      if (this.commonService.fpAnalyzeData.appName != undefined && this.commonService.fpAnalyzeData.appName != "undefined") {
        this.filterInstanceName = ", Instance=" + this.commonService.fpAnalyzeData.appName;
        this.downloadFilterCriteria += ", Instance=" + this.commonService.fpAnalyzeData.appName;
      }
    } else {
      if (this.commonService.isValidParamInObj(fpHeader, "tierName")) {
        if (fpHeader['tierName'].length > 32) {
          this.filterTierName = "Tier=" + fpHeader['tierName'].substring(0, 32) + '...';
          this.completeTier = fpHeader['tierName'];
        }
        else
          this.filterTierName = "Tier=" + fpHeader['tierName'];

        this.downloadFilterCriteria += "Tier=" + fpHeader['tierName'];

        // if (fpHeader['tierName'] == 'Overall')
        //  this.cols[0].action = true;
      }

      if (this.commonService.isValidParamInObj(fpHeader, "serverName")) {
        if (fpHeader['serverName'].length > 32) {
          this.filterServerName = ", Server=" + fpHeader['serverName'].substring(0, 32) + '...';
          this.completeServer = fpHeader['serverName'];
        }
        else
          this.filterServerName = ", Server=" + fpHeader['serverName'];

        this.downloadFilterCriteria += ", Server=" + fpHeader['serverName'];

      }

      if (this.commonService.isValidParamInObj(fpHeader, "appName")) {
        if (fpHeader['appName'].length > 32) {
          this.filterInstanceName = ", Instance=" + fpHeader['appName'].substring(0, 32) + '...';
          this.completeInstance = fpHeader['appName'];
        }
        else
          this.filterInstanceName = ", Instance=" + fpHeader['appName'];

        this.downloadFilterCriteria += ", Instance=" + fpHeader['appName'];


        // if (fpHeader['appName'] == 'Overall')
        //  this.cols[2].action = true;
      }
    }
    if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      //this.headerInfo += ', StartTime=' + startTime;
      if (this.filterTierName == '' && this.filterServerName == '' && this.filterInstanceName == '')
        this.headerInfo += 'StartTime=' + startTime;
      else
        this.headerInfo += ', StartTime=' + startTime;
    }
    if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
      this.headerInfo += ', EndTime=' + endTime;
    }
    if (this.commonService.isValidParamInObj(fpHeader, "btCategory"))
      this.headerInfo += ', BT Type=' + this.commonService.getBTCategoryName(fpHeader['btCategory']);

    if (this.commonService.isValidParamInObj(fpHeader, "urlName")) {
      this.headerInfo += ', BT=' + decodeURIComponent((fpHeader['urlName']).toString());
    }
    else if (this.urlParam.urlName && this.urlParam.urlName != "undefined" && this.urlParam.urlName != "NA")
      this.headerInfo += ', BT=' + this.urlParam.urlName;
    else if (this._ddrData.IPByFPFlag === true && this.urlName)
      this.headerInfo += ', BT=' + this.urlName;
    if (this.commonService.isValidParamInObj(fpHeader, "responseTime")) {
      if ((this.commonService.isValidParamInObj(fpHeader, "responseTime2")) && (this.commonService.isValidParamInObj(fpHeader, "resVariance"))) {
        this.headerInfo += ', Response Time=' + fpHeader['responseTime'] + " to " + fpHeader['responseTime2'];
      }
      else
        this.headerInfo += ', Response Time' + fpHeader["resptimevalue"] + fpHeader['responseTime'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "minMethods")) {
      this.headerInfo += ', Method Counts >=' + fpHeader['minMethods'];
    }
    console.log("fpHeader['correlationId']--", fpHeader['correlationId']);
    if (this.commonService.isValidParamInObj(fpHeader, "correlationId")) {
      let str = decodeURIComponent(fpHeader['correlationId']).replace(/\+/g, ' ');

      str = str.replace(/>>>/g, ' , ');
      this.headerInfo += ', CorelationId-Pattern(s) =' + str;

      if (this.commonService.isValidParamInObj(fpHeader, "corModeValue")) {
        this.headerInfo += '(' + (this.commonService.getCorelationmodeValue(fpHeader['corModeValue'])).toLowerCase() + ')';
      }
    }
    if (this.commonService.isValidParamInObj(fpHeader, "strOrderBy")) {
      this.headerInfo += ', OrderBy=' + this.getOrderName(fpHeader['strOrderBy']);
    }
    else if (this.urlParam && this.urlParam.backendId && this.urlParam.backendId != "undefined" && this.urlParam.backendId != "NA") {
      this.headerInfo += ', IP Name=' + decodeURIComponent(this.urlParam.backendName);
      if (this.checkrespTime()) {
        this.headerInfo += ', OrderBy=Max IP Response Time';
        this.headerInfo += ', Max IP Response Time >=' + this.urlParam.backendRespTime;
      }
    }
    if (this.commonService.isValidParamInObj(fpHeader, "url")) {
      let val = fpHeader['url'];
      if (val.length > 40) {
        this.URLstr = ', URL=' + val.substring(0, 40) + "..";
        this.CompleteURL = val;
      }
      else {
        this.URLstr = ', URL=' + val;
        this.CompleteURL = val;
      }
    }
    if (this.commonService.isValidParamInObj(fpHeader, "statusCodeFC")) {
      this.headerInfo += ', Status =' + fpHeader['statusCodeFC'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "page")) {
      this.headerInfo += ', Page=' + fpHeader['page'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "script")) {
      this.headerInfo += ', Script=' + fpHeader['script'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "transaction")) {
      this.headerInfo += ', Transaction=' + fpHeader['transaction'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "browser")) {
      this.headerInfo += ', Browser=' + fpHeader['browser'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "access")) {
      this.headerInfo += ', Access=' + fpHeader['access'];
    }
    if (this.commonService.isValidParamInObj(fpHeader, "location")) {
      this.headerInfo += ', Location=' + fpHeader['location'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "pageName")) {
      this.headerInfo += ', Page Name=' + fpHeader['pageName'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "transtx")) {
      this.headerInfo += ', Transaction Name=' + fpHeader['transtx'];
    }

    if (this.commonService.isValidParamInObj(fpHeader, "generatorName")) {
      this.headerInfo += ', Generator Name=' + fpHeader['generatorName'];
    }


    if (this.showHeaderForGrpByBT === true) {
      this.headerInfo += ', Group By= url';
      this.showHeaderForGrpByBT = false;
    }
    if (this.commonService.isValidParamInObj(fpHeader, "customData") && this._ddrData.customToFlowpathFlag === true && this.commonService.patternflag === true) {
      this.headerInfo += ', CustomData Filter=' + this.commonService.customToFlowpathData.customFilter;
    }
    console.log('headerinfo', this.headerInfo);
    // if (this.headerInfo.startsWith(',')) {
    //   this.headerInfo = this.headerInfo.substring(1);
    // }
    // if (this.headerInfo.endsWith(',')) {
    //   this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    // }

    if (this.methselect == true)
      this.headerInfo += ', Method Count >=' + this.minMethods;
    else
      this.headerInfo += '';

    if (this.respselect == true && this.selectedResponse != "") {
      if (this.respselect == true && this.selectedResponse.id == 10)
        this.headerInfo += ', Response Time <=' + this.responseTime;
      else if (this.respselect == true && this.selectedResponse.id == 11)
        this.headerInfo += ', Response Time >=' + this.responseTime;
      else if (this.respselect == true && this.selectedResponse.id == 12)
        this.headerInfo += ', Response Time =' + this.responseTime;
    }
    else
      this.headerInfo += '';

    this.downloadFilterCriteria += this.headerInfo;
    // this.headerInfo = this.commonService.validateFilterString( this.headerInfo);
    if (this.headerInfo.endsWith(',')) {
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    }
    if (this.nvFilter && this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
      && (!this.urlParam.flowpathID || this.urlParam.flowpathID === "NA")
      && sessionStorage.getItem("isMultiDCMode") == "true") {
      this.headerInfo += ',' + this.nvFilter;
      this.downloadFilterCriteria += ',' + this.nvFilter;
    }
    else if (this._router.url.indexOf('?') != -1 && (this._router.url.indexOf('/home/ddrCopyLink/flowpath') != -1) && this.urlParam.isFromNV && this.urlParam.isFromNV != "0") {
      if (this.urlParam.nvFilter && this.urlParam.nvFilter != "undefined") {
        if (this.urlParam.nvFilter.indexOf("NVPageID") != -1) {
          this.headerInfo += ",Data Filter=NDSessionID, NVSessionID, NVPageID";
          this.downloadFilterCriteria += ",Data Filter=NDSessionID, NVSessionID, NVPageID";
        }
        else if (this.urlParam.nvFilter.indexOf("NVSessionID") != -1) {
          this.headerInfo += ",Data Filter=NDSessionID, NVSessionID";
          this.downloadFilterCriteria += ",Data Filter=NDSessionID, NVSessionID";
        }
        else {
          this.headerInfo += ",Data Filter=NDSessionID";
          this.downloadFilterCriteria += ",Data Filter=NDSessionID";
        }
      }
    }
    else if (this.urlParam.path == "/home/ddrCopyLink/flowpath" && this.urlParam.isFromNV && this.urlParam.isFromNV != "0") {
      if (this.urlParam.nvFilter && this.urlParam.nvFilter != "undefined") {
        if (this.urlParam.nvFilter.indexOf("NVPageID") != -1) {
          this.headerInfo += ",Data Filter=NDSessionID, NVSessionID, NVPageID";
          this.downloadFilterCriteria += ",Data Filter=NDSessionID, NVSessionID, NVPageID";
        }
        else if (this.urlParam.nvFilter.indexOf("NVSessionID") != -1) {
          this.headerInfo += ",Data Filter=NDSessionID, NVSessionID";
          this.downloadFilterCriteria += ",Data Filter=NDSessionID, NVSessionID";
        }
        else {
          this.headerInfo += ",Data Filter=NDSessionID";
          this.downloadFilterCriteria += ",Data Filter=NDSessionID";
        }
      }
    }
  }

  openFPStatsTab() {
    this.setHostName();
    this.selectedTab = true;
  }

  closeFPStatsTab() {
    this.setHostName();
    this.selectedTab = false;
  }

  openFPDetailTab() {
    this.setHostName();
    this.selectedTab = false;
  }

  closeFPDetailTab() {
    this.setHostName();
    this.selectedTab = true;
  }
  change() {
    if (this.flowBack) {
      this._ddrData.isFromtrxFlow = false;
    }
    this._router.navigate(['/home/ddr/flowpathToMD']);
  }
  getOrderName(orderByName) {
    if (orderByName == 'fpduration_desc')
      return 'Total Response Time'
    else if (orderByName == 'error_callout')
      return 'Callout Errors'
    else if (orderByName == 'stime' || orderByName == 'startTime')
      return 'Start Time'
    else if (orderByName == 'btcputime_desc')
      return 'Cpu Time'

    return orderByName;
  }

  clickHandler(event) {
    this.selectedTab = false;
    this.showAllOption = true;
    this.pointName = ': ' + event.point.name;
    let filterFPArray = [];
    console.log('flowpath data', event.point.name);
    this.queryData.forEach((val, index) => {
      if (val['btCatagory'].substring(val['btCatagory'].lastIndexOf('.') + 1) === event.point.name) {
        filterFPArray.push(val);
      }
    });
    console.log('filterFPArray------------', filterFPArray);
    this.flowpathData = filterFPArray;
  }

  /**Used to reset to original data to table */
  showAllData() {
    this.flowpathData = this.queryData;
    this.showAllOption = false;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - Flowpath Report - Test Run : ' + this.urlParam.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - Flowpath Report - Session : ' + this.urlParam.testRun;
    }
  }

  onRowSelectData(selectedRowData: any) {
    // this.selectedRowInfo.push(selectedRowData);
    let index: number = this.selectedRowInfo.indexOf(selectedRowData);
    if (index === -1) {
      this.selectedRowInfo.push(selectedRowData);
    }
  }

  onRowUnselectData(unSelectedRowData: any) {
    let index: number = this.selectedRowInfo.indexOf(unSelectedRowData);
    if (index !== -1) {
      this.selectedRowInfo.splice(index, 1);
    }
  }

  /***commenting below 2 methods
   * for migration purpose
   * showNFIcon to openNetForest
   */
  // showNFIcon() {
  //   let url = this.checkAllCase() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/config/NetForestUrl';
  //   this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
  //     this.netForestURL = data;
  //     console.log("this.netForestURL = ", this.netForestURL);

  //     if (data != undefined && this.netForestURL != 'NA') {
  //       this.showNF = true;
  //       url = this.checkAllCase() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/config/NetDiagnosticsQueryTimeVariance';
  //       this.ddrRequest.getDataInStringUsingGet(url).subscribe(res => {
  //         if (res)
  //           this.timeVarienceForNF = res;
  //         console.log("this.timeVarienceForNF = ", this.timeVarienceForNF);
  //       })
  //     }
  //     else {
  //       this.showNF = false;
  //     }
  //   });
  // }


  openNetForest() {
    let flowpathInstance;
    let correlationId;
    let startTimeInMs;
    let duration;
    let ndSessionId;
    let nvPageId;
    let StartTimeArr = [];
    let EndTimeArr = [];
    let startTimeISO;
    let endTimeISO;
    let query;

    if (this.selectedRowInfo.length == 0) {
      alert("No Record Selected");
      return;
    }
    if (this.selectedRowInfo.length > 1) {
      query = "";
      for (let i = 0; i < this.selectedRowInfo.length; i++) {
        flowpathInstance = this.selectedRowInfo[i]["flowpathInstance"];
        startTimeInMs = this.selectedRowInfo[i]["startTimeInMs"];
        duration = this.selectedRowInfo[i]["fpDuration"];
        let d1 = Number(startTimeInMs) - Number(this.timeVarianceInMs(this.timeVarienceForNF));
        let d2;

        if (duration == '< 1')
          d2 = Number(startTimeInMs) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
        else
          d2 = Number(startTimeInMs) + Number(duration.replace(/,/g, '')) + Number(this.timeVarianceInMs(this.timeVarienceForNF));

        StartTimeArr.push(d1);
        EndTimeArr.push(d2);

        query += "fpi:" + flowpathInstance + '%20OR%20';

      }
      / to get shortest timestamp as start time /
      StartTimeArr = StartTimeArr.sort(function (a, b) {
        var value = Number(a);
        var value2 = Number(b);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
      / to get highest timestamp as end time /
      EndTimeArr = EndTimeArr.sort(function (a, b) {
        var value = Number(a);
        var value2 = Number(b);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });

      if (query.endsWith('20')) {
        query = query.substring(0, query.length - 8);
        query = "( " + query + " )";
      }
      // startTimeISO = new Date(StartTimeArr[0]).toISOString();
      // endTimeISO = new Date(EndTimeArr[0]).toISOString();
      startTimeISO = StartTimeArr[0];
      endTimeISO = EndTimeArr[0];
      console.log("query>>>>>>>>>>", query);


    } else {
      query = "";
      flowpathInstance = this.selectedRowInfo[0]["flowpathInstance"];
      correlationId = this.selectedRowInfo[0]["correlationId"];
      startTimeInMs = this.selectedRowInfo[0]["startTimeInMs"];
      duration = this.selectedRowInfo[0]["fpDuration"];
      ndSessionId = this.selectedRowInfo[0]["ndSessionId"];
      nvPageId = this.selectedRowInfo[0]["nvPageId"];


      query = "fpi:" + flowpathInstance;
      console.log("duration = ", duration);
      let d1 = Number(startTimeInMs) - Number(this.timeVarianceInMs(this.timeVarienceForNF));
      let d2;

      if (duration == '< 1')
        d2 = Number(startTimeInMs) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      else
        d2 = Number(startTimeInMs) + Number(duration.replace(/,/g, '')) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      console.log("start time from FP To NF = " + d1);
      console.log("end time from FP To NF = " + d2);

      // startTimeISO = new Date(d1).toISOString();
      // endTimeISO = new Date(d2).toISOString();
      startTimeISO = d1;
      endTimeISO = d2;

      console.log("startTimeISO = ", startTimeISO, ", endTimeISO = ", endTimeISO);

      if (correlationId != "" && correlationId != "-")
        query += "%20AND%20corrid:\"" + correlationId + "\"";

      if (nvPageId != "" && nvPageId != "-")
        query += "%20AND%20pageid:" + nvPageId;

      if (ndSessionId != "" && ndSessionId != "-")
        query += "%20AND%20ndsessionid:" + ndSessionId;

      query = "( " + query + " )";
      console.log("query>>>>single case>>>>>>", query);

    }
    query = query.replaceAll("%20"," ");
    console.log("The value inside the starttime and endtime for the netforest is .......",startTimeISO,endTimeISO,query);
    // this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId  } }); 
    this._router.navigate(["/home/logs"], { queryParams: { queryStr: query,  startTime : startTimeISO , endTime : endTimeISO}});


    // let netForestUrl = this.netForestURL;
    // if (netForestUrl != 'NA') {
    //   netForestUrl = netForestUrl.replace(/startTimeVal/, startTimeISO);
    //   netForestUrl = netForestUrl.replace(/endTimeVal/, endTimeISO);
    //   netForestUrl = netForestUrl.replace(/queryVal/, query);
    // }
    // console.log("ddrDatauserName-----" + this._ddrData.userName, this._cavConfig.$userName);
    // if (!this._ddrData.userName) {
    //   this._ddrData.userName = this._cavConfig.$userName;
    // }
    // netForestUrl += "&sessLoginName=" + this._ddrData.userName;
    // this._ddrData.setInLogger('DDR::Flowpath', 'NetForest', 'Open NetForest');
    // window.open(netForestUrl);
}

  //This function will convert time in miliseconds. Time should be provided in formats- Nh or Nm or Ns or N or Nms where N is integer

  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time)) //If time is in minute formate- xm eg:20m means 20 minute variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time)) //If time is in second formate- xs eg:200s means 200 second variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = Number(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds 
    {
      timeVarianceInMs = Number(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");
      return Number(900000); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return Number(timeVarianceInMs);
  }

  /*commenting below 3 method 
  * i.e checkNVSessionIDAndNVURL to 
  * openFlowpathWithNvFilter
  */
  // checkNVSessionIDAndNVURL() {
  //   let url = this.checkAllCase() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/config/nd.netvision.querysession';
  //   this.ddrRequest.getDataInStringUsingGet(url).subscribe(res => {
  //     this.checkNVSessionId = res;
  //     console.log("checkNVSessionId = ", this.checkNVSessionId);
  //     this.commonService.checkNVSessionId = res;
  //   })

  //   let url1 = this.checkAllCase() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/config/NetVisionUrl';
  //   this.ddrRequest.getDataInStringUsingGet(url1).subscribe(data => {
  //     this.NVUrl = data;
  //     this.commonService.NVUrl = data;
  //   })
  // }

  openNVFromND() {
    if (sessionStorage.getItem("isMultiDCMode") != "true") {
      // if (this.NVUrl != 'NA') {
        if (this.selectedRowInfo.length == 0) {
          alert("No Flowpath is Selected");
          return;
        }
        else if (this.selectedRowInfo.length > 1) {
          alert("Select Only One Flowpath at a time");
          return;
        }
        else {
          let nvSessionId = 'NA';
          let nvPageId = 'NA';
          let urlForNV;

          // for (let k = 0; k < this.selectedRowInfo.length; k++) {
          if (this.selectedRowInfo[0]['nvSessionId'] != '-' && this.selectedRowInfo[0]['nvSessionId'] != '' && this.selectedRowInfo[0]['nvSessionId'] != "0")
            nvSessionId = this.selectedRowInfo[0]['nvSessionId'];
          else {
            alert('NV Session Id is not Available or' + this.selectedRowInfo[0]['nvSessionId']);
            return;
          }

          if (this.selectedRowInfo[0]['nvPageId'] != '-' && this.selectedRowInfo[0]['nvPageId'] != '')
            nvPageId = this.selectedRowInfo[0]['nvPageId'];
          //}

          // let params = 'strOprName=sessionDetail&nvSessionId=' + nvSessionId + '&pageInstance=' + nvPageId;
          // if (this.NVUrl.toLowerCase().indexOf("auth") == -1)
          //   urlForNV = this.NVUrl + params;
          // else
          //   urlForNV = this.NVUrl + '&' + params;
          // this._ddrData.setInLogger('DDR::Flowpath', 'NetVision', 'Open NetVision');

          // window.open(urlForNV);
          // nvSessionId= "1012840390350340096";
          this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });  
        }
      // }
      // else {
      //   alert('Please give "NVUrl" keyword  in Config.ini');
      //   return;
      // }
    }
    else {
    //  //Supporting for unified dashboard
      let nvSessionId = 'NA';
      let nvPageId = 'NA';
      //let urlForNV;

      // check only one fp is selected as in case of single dc

      if (this.selectedRowInfo.length == 0) {
        alert("No Flowpath is Selected");
        return;
      }
      else if (this.selectedRowInfo.length > 1) {
        alert("Select Only One Flowpath at a time");
        return;
      }

      // for (let k = 0; k < this.selectedRowInfo.length; k++) {
      if (this.selectedRowInfo[0]['nvSessionId'] != '-' && this.selectedRowInfo[0]['nvSessionId'] != '' && this.selectedRowInfo[0]['nvSessionId'] != "0") {
        nvSessionId = this.selectedRowInfo[0]['nvSessionId'];
        //urlForNV = "?cavNVC=" + nvSessionId;
      }
      else {
        alert('NV Session Id is not Available for ' + this.selectedRowInfo[0]['nvSessionId']);
        return;
      }

      if (this.selectedRowInfo[0]['nvPageId'] != '-' && this.selectedRowInfo[0]['nvPageId'] != '' && this.selectedRowInfo[0]['nvPageId'] != "0")
        nvPageId = this.selectedRowInfo[0]['nvPageId'];
      //urlForNV += "&cavPI=" + nvPageId;
      //}
      // this._navService.addNewNaviationLink("Overview");
      // this._navService.addDCNameForScreen("Overview", this._cavConfig.getActiveDC());
      let navigationExtras: NavigationExtras = {
        queryParams: {
          'cavNVC': nvSessionId,
          'cavPI': nvPageId
        }
      };
      if (this.flowBack) {
        this._ddrData.isFromtrxFlow = false;
      }
      sessionStorage.removeItem('__nvSessionData');
      // this._ddrData.setInLogger('DDR::Flowpath', 'NetVision', 'Open NetVision');
      // this._router.navigate(['/sessions-details']);
      this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });

    }
}

  openFlowpathWithNvFilter(filter: any) {
      this.setHostName();
      if (this.selectedRowInfo.length == 0) {
        alert("No Record Selected.");
        return;
      }
      else {
        let ndSessionId = '';
        let nvPageId = '';
        let nvSessionId = '';
        for (let k = 0; k < this.selectedRowInfo.length; k++) {
          if (filter == 'session') {
            let currentSessionId = this.selectedRowInfo[k]["ndSessionId"];
            if (k == 0 && currentSessionId != '-' && currentSessionId != '')
              ndSessionId = currentSessionId
            else if (currentSessionId != '-' && currentSessionId != '' && ndSessionId.indexOf(currentSessionId) == -1)
              ndSessionId += ',' + currentSessionId;
          }
          else if (filter == 'page') {
            let currentNVSessionId = this.selectedRowInfo[k]['nvSessionId'];
            if (k == 0 && currentNVSessionId != '' && currentNVSessionId != '-')
              nvSessionId = currentNVSessionId;
            else if (currentNVSessionId != '' && currentNVSessionId != '-' && nvSessionId.indexOf(currentNVSessionId) == -1)
              nvSessionId += "," + currentNVSessionId;
            let currentPageId = this.selectedRowInfo[k]["nvPageId"];
            if (k == 0 && currentPageId != "" && currentPageId != "-")
              nvPageId = currentPageId;
            else if (currentPageId != "" && currentPageId != "-" && nvPageId.indexOf(currentPageId) == -1)
              nvPageId += "," + currentPageId;
          }
          else if (filter == 'nvsession') {
            let currentNVSessionId = this.selectedRowInfo[k]['nvSessionId'];
            if (k == 0 && currentNVSessionId != '' && currentNVSessionId != '-')
              nvSessionId = currentNVSessionId;
            else if (currentNVSessionId != '' && currentNVSessionId != '-' && nvSessionId.indexOf(currentNVSessionId) == -1)
              nvSessionId += "," + currentNVSessionId;
          }
        }
        if (filter == 'session') {
          if (ndSessionId != '-') {
            this._ddrData.nvPageId = "";
            this._ddrData.nvSessionId = "";
            this.urlParam.nvPageId = "";
            this.urlParam.nvSessionId = "";
            this._ddrData.ndSessionId = ndSessionId;
            this.urlParam.ndSessionId = ndSessionId;
          }
          else {
            alert("ND Session  Id not available");
            return;
          }
        }
        else if (filter == 'nvsession') {
          if (nvSessionId != '-') {
            this._ddrData.ndSessionId = "";
            this.urlParam.ndSessionId = "";
            this._ddrData.nvPageId = "";
            this._ddrData.nvSessionId = "";
            this.urlParam.nvSessionId = nvSessionId;
            this._ddrData.nvSessionId = nvSessionId;
          }
          else {
            alert("NV Session Id not available");
            return;
          }
        }
        else if (filter == 'page') {
          if (nvPageId != '-') {
            this._ddrData.ndSessionId = "";
            this.urlParam.ndSessionId = "";
            this._ddrData.nvPageId = nvPageId;
            this._ddrData.nvSessionId = nvSessionId;
            this.urlParam.nvPageId = nvPageId;
            this.urlParam.nvSessionId = nvSessionId;
          }
          else {
            alert("NV Page Id not available");
            return;
          }
        }
        this.prevLimit = this.fpLimit;
        this.prevOffset = this.fpOffset;
        // console.log("prevLimit = ", this.prevLimit , " , prevOffset = " , this.prevOffset);
        this.fpLimit = 50;
        this.fpOffset = 0;
        this._ddrData.nvFiltersFlag = true;
        this.nvtondReport = true;
        this._ddrData.setInLogger('DDR::Flowpath', 'Filter', 'NvFilter Apply');
        if (sessionStorage.getItem("isMultiDCMode") == "true")
          this.commonService.host = undefined;
        this.getFlowpathData();
        this.getFlowpathDataCount();
      }
  }

  clickBack() {
    this.nvtondReport = false;
    this._ddrData.nvFiltersFlag = false;
    this.urlParam.nvSessionId = '';
    this.urlParam.nvPageId = '';
    this.urlParam.ndSessionId = '';
    this.fpLimit = this.prevLimit;
    this.fpOffset = this.prevOffset;
    //console.log("this.fpLimit = ", this.fpLimit , " , this.fpOffset = " , this.fpOffset);
    this.getFlowpathData();
    this.getFlowpathDataCount();
  }

  deleteObjProp(json, arr) {
    json.forEach((val, index) => {
      arr.forEach((key, i) => {
        if (val.hasOwnProperty(key))
          delete val[key];
      });
    });
  }

  downloadReports(reports: string) {
    let renameArray;
    let colOrder;
    let downloadData = JSON.parse(JSON.stringify(this.flowpathData));
    renameArray = {
      'tierName': 'Tier', 'serverName': 'Server', 'appName': 'Instance',
      'urlName': 'Business Transaction', 'flowpathInstance': 'FlowpathInstance', 'startTime': 'StartTime', 'fpDuration': 'Total Response Time(ms)',
      'urlQueryParamStr': 'URL', 'statusCode': 'Status', 'callOutCount': 'CallOuts', 'totalError': 'CallOut Errors', 'btCatagory': 'Category',
      'btCpuTime': 'CPU Time(ms)', 'dbCallCounts': 'DB Callouts', 'methodsCount': 'Methods', 'correlationId': 'Corr ID', 'storeId': 'Store ID',
      'terminalId': 'Terminal ID', 'nvSessionId': 'NV Session ID', 'ndSessionId': 'ND Session ID', 'nvPageId': 'NV Page ID',
      'coherenceCallOut': 'Coherence CallOut', 'jmsCallOut': 'JMS CallOut', 'waitTime': 'Wait Time(ms)', 'syncTime': 'Sync Time(ms)',
      'iotime': 'IO Time(ms)', 'suspensiontime': 'Suspension Time(ms)', 'QTimeInMS': 'QTime (ms)', 'selfResponseTime': 'Response Time(ms)',
      'ParentFlowpathInstance': 'Parent FlowpathInstance', 'totalCpuTime': 'Total CPU Time(ms)', 'gcPause': 'GC Pause', 'dcName': 'DC Name',
      'applicationName': 'Application Name'
    };
    colOrder = [
      'Tier', 'Server', 'Instance', 'Business Transaction', 'FlowpathInstance', 'StartTime',
      'Total Response Time(ms)', 'URL', 'Status', 'CallOuts', 'CallOut Errors', 'Category', 'CPU Time(ms)', 'DB Callouts', 'Methods', 'Corr ID',
      'Store ID', 'Terminal ID', 'NV Session ID', 'ND Session ID', 'NV Page ID', 'Coherence CallOut', 'JMS CallOut', 'Wait Time(ms)', 'Sync Time(ms)',
      'IO Time(ms)', 'Suspension Time(ms)', 'QTime (ms)', 'Response Time(ms)', 'Parent FlowpathInstance', 'Total CPU Time(ms)', 'GC Pause', 'DC Name',
      'Application Name'
    ];

    if (this.checkrespTime()) {
      renameArray['backendMaxDur'] = 'Max IP Res. time(ms)';
      colOrder.push('IP Res. time(ms)');
    }
    else {
      this.agdeleteFlag = true;
    }
    let tempCols = [];
    if (this.currentvisibleCols != undefined && this.currentvisibleCols != null) {
      for (var i = 0; i < this.currentvisibleCols.length; i++) {
        if (renameArray[this.currentvisibleCols[i]]) {
          tempCols.push(renameArray[this.currentvisibleCols[i]]);
        }
      }

      let allRenameKeys = Object.keys(renameArray);
      let tempKeys = allRenameKeys.filter(
        (val) => {
          return this.currentvisibleCols.indexOf(val) == -1;
        }); //filter hide column keys
      this.deleteObjProp(downloadData, tempKeys);
    }
    else {
      for (var i = 0; i < this.visibleCols.length; i++) {
        if (renameArray[this.visibleCols[i]]) {
          tempCols.push(renameArray[this.visibleCols[i]]);
        }
      }

      let allRenameKeys = Object.keys(renameArray);
      let tempKeys = allRenameKeys.filter(
        (val) => {
          return this.visibleCols.indexOf(val) == -1;
        }); //filter hide column keys

      this.deleteObjProp(downloadData, tempKeys);
    }

    downloadData.forEach((val, index) => {
      if (this.agdeleteFlag == true)
        delete val['backendMaxDur'];
      if (val.flowpathInstance)
        val.flowpathInstance = (val.flowpathInstance).concat("'").replace("'", " ");
      if (val.ndSessionId)
        val.ndSessionId = (val.ndSessionId).concat("'").replace("'", " ");
      delete val['appId'];
      delete val['tierId'];
      delete val['serverId'];
      delete val['serverid'];
      delete val['urlIndex'];
      delete val['prevFlowpathInstance'];
      delete val['threadId'];
      delete val['startTimeInMs'];
      delete val['id'];
      delete val['orderId'];
      delete val['threadName'];
      delete val['_$visited'];
      delete val["source"];
      delete val["Instance_Type"];
      delete val["flowpathtype"];
      delete val["dynamicLoggingFlag"];
      delete val["traceRequest"];
    });
    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.downloadFilterCriteria,
      strSrcFileName: 'FlowpathReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: tempCols.toString(),
      jsonData: JSON.stringify(downloadData)
    };
    let downloadFileUrl = '';
    if (this.host != undefined && this.host != '' && this.host != null) {
      downloadFileUrl = this.protocol + this.host + ':' + this.port + '/' + this.urlParam.product;
    } else {
           //Due to A9 - migration.
           if(this.sessionService.preSession.multiDc === true){
            downloadFileUrl = decodeURIComponent(this._ddrData.getHostUrl(true) + '/' + this.urlParam.product + '/tomcat' + '/ALL');
           }else{
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product);
           }
    }
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    //due to A9 - migration
    // if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      if (this.sessionService.preSession.multiDc === true || (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/ALL"))) {
      if (downloadFileUrl.includes("/tomcat"))
        downloadFileUrl = downloadFileUrl.replace("/tomcat", "/node");
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
        (this.checkDownloadType(res)));
    }
    // tomcat case or multiDc All case (fetching ip port on dc basses)
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (
        this.openDownloadReports(res)));
    }
  }
  checkDownloadType(res: any) {
    try {
      if (res) {
        res = JSON.parse(res);
        let dcinfo = res.dcInfo;
        let keys = Object.keys(dcinfo);
        for (let i = 0; i < keys.length; i++) {
          if (dcinfo[keys[i]].isMaster == true) {
            console.log("keyss valueeee==>", dcinfo[keys[i]], " res", res);
            this.openDownloadReports(res, dcinfo[keys[i]])
          }
        }
      }
    }
    catch (error) {
      console.log("Getting Error While Parsing Response From Node ");
    }
  }

  openDownloadReports(res, dcInfo?) {
    console.log('file name generate ===', res);
    let downloadFileUrl = '';
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      downloadFileUrl = location.protocol + "//" + location.host;
      res = res.tierData;
    }
    else {
      if (dcInfo) {
        downloadFileUrl = decodeURIComponent(dcInfo.protocol + "://" + dcInfo.ip + ':' + dcInfo.port);
        res = res.tierData;
        console.log("downloadFileUrl==>", downloadFileUrl)
      }
      else {
        if (this.host != undefined && this.host != '' && this.host != null) {
          if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
            downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          else
            downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        }
        else {
          downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '');
        }
      }
    }
    downloadFileUrl += '/common/' + res;
    window.open(downloadFileUrl);
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName;
    if (this._ddrData.isFromtrxFlow && ((this._ddrData.dbTofpflag) ||
      (this._ddrData.IPByFPFlag) || (this._ddrData.FromhsFlag == "true") ||
      this._ddrData.isFromAgg)) {
      console.log("********************IF **********************");
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.urlParam.testRun = this._ddrData.testRunTr;
      this.testRun = this._ddrData.testRunTr;
      if (!this._ddrData.isFromAgg) {
        this._ddrData.host = this._ddrData.hostTr;
        this._ddrData.port = this._ddrData.portTr;
        this._ddrData.protocol = this._ddrData.protocolTr;
      }
    }
    else {
      if (this._ddrData.isFromtrxFlow) {
        this.flowBack = true;
        this._ddrData.isFromtrxSideBar = true;
      }
      // Fetching HostDcName for Normal case 
      hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true") {
        this.urlParam.testRun = this._ddrData.testRun;
        this.testRun = this._ddrData.testRun;
        console.log("all case test run==>", this.urlParam.testRun);
      }
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  navigateToTransactionFlow(nodeData: any, rawData) {
    this.setHostName();
    let columnFlowpathData = JSON.parse(JSON.stringify(nodeData));
    this.commonService.showAllTabs = true;
    this.commonService.openCurrentFlowpathTab = true;
    this.commonService.loaderForDdr = true;
    this.commonService.showTransactionFlowmap = false;
    this.commonService.openFlowpath = false;
    this.showCompareReport = false;
    this.highlighttheRow();
    sessionStorage.removeItem("jsonDatatoDraw");
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    if (columnFlowpathData.fpDuration == '< 1')
      columnFlowpathData.fpDuration = 0;
    this.flowmapDataService.resetFlag();
    this.flowmapDataService.getDataForTxnFlowpath(columnFlowpathData.flowpathInstance, columnFlowpathData);
  }

  openED() {
    if (sessionStorage.getItem("enableTierStatus") && sessionStorage.getItem("enableTierStatus") == "1") {
      let obj = {
        testRun: this.urlParam.testRun,
        graphKey: "Last_60_Minutes",
        graphKeyLabel: "Last 1 Hour",
        startTime: undefined,
        endTime: undefined,
        isAllDC: false,
        multidc_mode: false,
        isDiscontGraph: false,
        dcName: [],
        isFreshOpen: true
      }
      if (this.flowBack) {
        this._ddrData.isFromtrxFlow = false;
      }
      /**commeting this 2 line for migration purpose */
      //this._cavConfig.$eDParam = obj;
      //this._navService.addNewNaviationLink('Tier Status');
      this._ddrData.setInLogger('DDR::Flowpath', 'End-to-End View', 'Open End-to-End View');
      this._router.navigate(['/home/execDashboard/main/tierStatus']);
    } else {
      var url = '';
      if (sessionStorage.getItem("isMultiDCMode") == "true") {
        this.getHostUrl();   // calling here for setting testRun for particular dc

        // getting from ddrData for opening ED for "ALL as well SINGLE DC" case -> cause /tomcat/dcname will not work in this case
        url = this._ddrData.protocol + "://" + this._ddrData.host + ':' + this._ddrData.port;
      }
      else if (this.host != undefined && this.host != '' && this.host != null) {
        if (this.protocol && this.protocol.endsWith("://"))
          url = this.protocol + this.host + ':' + this.port;
        else if (this.protocol && this.protocol.indexOf("//") == -1)
          url = this.protocol + "://" + this.host + ':' + this.port;
        else
          url = location.protocol + "//" + this.host + ':' + this.port;
      }
      else {
        let ipPort = this.getHostUrl();
        if (ipPort.startsWith("//")) {
          url = ipPort;
        }
        else {
          url = "//" + ipPort;
        }
      }
      url += '/' + "dashboard/view/edRequestHandler.jsp?testRun=" + this.urlParam.testRun + "&sesLoginName=" + this._ddrData.userName + "&sessGroupName=&sessUserType=" + "&strStarDate=" + this.commonService.edStrStartDate + "&strEndDate=" + this.commonService.edStrEndDate + "&graphTime=" + this.urlParam.strGraphKey;

      console.log("urlllllllllllllllllllllllllll>>>>>>>>>>", url)
      this._ddrData.setInLogger('DDR::Flowpath', 'End-to-End View', 'Open End-to-End View');
      window.open(url, "_blank");
    }
  }

  // sortColumnsOnCustom(event) {
  //   this.commonService.sortedField = event.field;
  //   this.commonService.sortedOrder = event.order;
  //   //for integer type data type
  //   if (event["field"] === "responseTime" ||
  //       event["field"] === "methods" ||
  //       event["field"] === "callOuts" ||
  //       event["field"] === "totalError" ||
  //       event["field"] === "dbCallouts" ||
  //       event["field"] === "Status" ||
  //       event["field"] === "coherenceCallOut" ||
  //       event["field"] === "jmsCallOut") {
  //     if (event.order == -1) {
  //       var temp = (event["field"]);
  //       event.order = 1
  //       event.data = event.data.sort(function (a, b) {
  //         var value = Number(a[temp].replace(/,/g, ''));
  //         var value2 = Number(b[temp].replace(/,/g, ''));
  //         return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //       });
  //     }
  //     else {
  //       var temp = (event["field"]);
  //       event.order = -1;
  //       //ascending order
  //       event.data = event.data.sort(function (a, b) {
  //         var value = Number(a[temp].replace(/,/g, ''));
  //         var value2 = Number(b[temp].replace(/,/g, ''));
  //         return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
  //       });
  //     }
  //   }
  //   //for floating decimal points
  //   else if (event["field"] === "cpu" ||
  //            event["field"] === "waitTime" ||
  //            event["field"] === "syncTime" ||
  //            event["field"] === "iotime" ||
  //            event["field"] === "suspensiontime") {
  //     if (event.order == -1) {
  //       var temp = (event["field"]);
  //       event.order = 1
  //       event.data = event.data.sort(function (a, b) {
  //         var value = parseFloat(a[temp].replace(/,/g, ''));
  //         var value2 = parseFloat(b[temp].replace(/,/g, ''));
  //         return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //       });
  //     }
  //     else {
  //       var temp = (event["field"]);
  //       event.order = -1;
  //       //ascending order
  //       event.data = event.data.sort(function (a, b) {
  //         var value = parseFloat(a[temp].replace(/,/g, ''));
  //         var value2 = parseFloat(b[temp].replace(/,/g, ''));
  //         return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
  //       });
  //     }
  //   }
  //   //for date format
  //   else if (event["field"] === "startTime") {
  //     if (event.order == -1) {
  //       var temp = (event["field"]);
  //       event.order = 1
  //       event.data = event.data.sort(function (a, b) {
  //         var value = Date.parse(a[temp]);
  //         var value2 = Date.parse(b[temp]);
  //         return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //       });
  //     }
  //     else {
  //       var temp = (event["field"]);
  //       event.order = -1;
  //       //ascending order
  //       event.data = event.data.sort(function (a, b) {
  //         var value = Date.parse(a[temp]);
  //         var value2 = Date.parse(b[temp]);
  //         return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
  //       });
  //     }
  //   }
  //   else {
  //     var temp = (event["field"]);
  //     if (event.order == -1) {
  //       event.data = event.data.sort(function (a, b) {
  //         var value = a[temp];
  //         var value2 = b[temp];
  //         return value.localeCompare(value2);
  //       });
  //     } else {
  //       event.order = -1;
  //       event.data = event.data.sort(function (a, b) {
  //         var value = a[temp];
  //         var value2 = b[temp];
  //         return value2.localeCompare(value);
  //       });
  //     }
  //   }
  // }
  sortEvent(event) {
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;
  }
  sortColumnsOnCustom(event, tempData) {

    //for date type
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;
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
        //ascending order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    } else if (event["field"] == "appName" || event["field"] == "correlationId" || event["field"] == "urlName" || event["field"] == "urlQueryParamStr" || event["field"] == "btCatagory" || event["field"] == "tierName" || event["field"] == "serverName")
    {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          var v1 = a[temp];
          var v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].replace(reN, ""), 10);
            value2 = parseInt(b[temp].replace(reN, ""), 10);
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          }
        });
      } else {
        var temp = (event["field"]);
        event.order = -1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let v1 = a[temp];
          let v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].toString().replace(reN, ""), 10);
            value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          }
        });
      }
    }
    else {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return 1;
          } else if (b[temp].startsWith('<')) {
            return -1;
          }

          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return -1;
          } else if (b[temp].startsWith('<')) {
            return 1;
          }
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.flowpathData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.flowpathData = this.Immutablepush(this.flowpathData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  showNotification() {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'FlowPath Link has been copied successfully' });
  }

  prevFpInstance
  // currFpInstance
  fpflag: boolean = true;
  checkFpInstance(currFpInstance) {
    console.log('currrrrent fp instance', currFpInstance);
    console.log('prev fp instance', this.prevFpInstance)
    if (this.fpflag) {
      this.prevFpInstance = currFpInstance;
      this.fpflag = false;
    }
    if (this.prevFpInstance !== currFpInstance) {
      this.commonService.showAllTabs = false;
      this.commonService.removeAllComponentFromFlowpath();
      this._changeDetection.detectChanges();
      this.commonService.showAllTabs = true;
      this.prevFpInstance = currFpInstance;
      return;
    }
    return;
  }
  expandall() {
    this.commonService.openDbTab = true;
    this.commonService.openExceptionTab = true;
    this.commonService.openFlowMapTab = true;
    this.commonService.openFlowpath = true;
    this.commonService.openHotspotTab = true;
    this.commonService.openHttpTab = true;
    this.commonService.openMethodCallingTreeTab = true;
    this.commonService.openMethodTimingTab = true;
  }

  openAggregateMethodTiming() {
    this.commonService.splitView = false;
    let flowpathInstance = "";
    let tierName = "";
    let serverName = "";
    let appName = "";
    let tierId = "";
    let serverId = "";
    let appId = "";
    this.setHostName();
    if (this.selectedRowInfo.length == 0) {
      alert("No Record Selected");
      return;
    } else {
      for (let i = 0; i < this.selectedRowInfo.length; i++) {
        flowpathInstance += this.selectedRowInfo[i]["flowpathInstance"] + ",";
        if (tierName.indexOf(this.selectedRowInfo[i]["tierName"]) == -1)
          tierName += this.selectedRowInfo[i]["tierName"] + ",";
        if (serverName.indexOf(this.selectedRowInfo[i]["serverName"]) == -1)
          serverName += this.selectedRowInfo[i]["serverName"] + ",";
        if (appName.indexOf(this.selectedRowInfo[i]["appName"]) == -1)
          appName += this.selectedRowInfo[i]["appName"] + ",";
        if (tierId.indexOf(this.selectedRowInfo[i]["tierId"]) == -1)
          tierId += this.selectedRowInfo[i]["tierId"] + ",";
        if (serverId.indexOf(this.selectedRowInfo[i]["serverId"]) == -1)
          serverId += this.selectedRowInfo[i]["serverId"] + ",";
        if (appId.indexOf(this.selectedRowInfo[i]["appId"]) == -1)
          appId += this.selectedRowInfo[i]["appId"] + ",";

      }
    }

    let reqData = {};
    reqData['tierName'] = tierName.substring(0, tierName.length - 1);
    reqData['serverName'] = serverName.substring(0, serverName.length - 1);
    reqData['appName'] = appName.substring(0, appName.length - 1);

    reqData['tierId'] = tierId.substring(0, tierId.length - 1);
    reqData['serverId'] = serverId.substring(0, serverId.length - 1);
    reqData['appId'] = appId.substring(0, appId.length - 1);
    reqData['flowpathInstance'] = flowpathInstance.substring(0, flowpathInstance.length - 1);
    if (this._ddrData.fpByBTFlag) {
      reqData['urlName'] = this.urlName;
    }
    reqData['strStartTime'] = this.strStartTime;
    reqData['strEndTime'] = this.strEndTime;
    console.log("reqData>>>>>>>>>>>>>>>>>>" + JSON.stringify(reqData));
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.openfptoAggMT = true;
    this.commonService.mtData = reqData;
    if (this.flowBack) {
      this._ddrData.isFromtrxFlow = false;
    }
    this._ddrData.setInLogger('DDR::Flowpath', 'Aggregate MethodTiming', 'Open AggregateMethodTiming Report');
    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
      this._router.navigate(['/home/ddrCopyLink/methodtiming']);
    else
      this._router.navigate(['/ddr/methodtiming']);
  }

  onTabOpen(event) {
    let i = event.index;
    console.log('intialDrafit = ', this.intialDrafit);
    if (this.intialDrafit['tabs'][i].header == 'Method Call Details') {
      this.commonService.openMethodCallingTreeTab = false;
      this.openMethodCallingTree(this.commonService.selectedData)
    }
    if (this.intialDrafit['tabs'][i].header == 'Flowpaths') {
      this.commonService.openFlowpath = true;
      this.commonService.isToLoadSideBar = true;
    }
    if (this.intialDrafit['tabs'][i].header == 'Transaction FlowMap') {
      this.commonService.openFlowMapTab = false;
      this.commonService.showTransactionFlowmap = true;
      this.navigateToTransactionFlow(this.commonService.selectedData, this.commonService.selectedData);
    }
    if (this.intialDrafit['tabs'][i].header == 'Hotspots') {
      this.commonService.openHotspotTab = false;
      this.openHotspotReport(this.commonService.selectedData);
    }
    if (this.intialDrafit['tabs'][i].header == 'Methods Timing') {
      this.commonService.openMethodTimingTab = false;
      this.openMethodTiming(this.commonService.selectedData, 'fpByResponse')
    }
    if (this.intialDrafit['tabs'][i].header == 'HTTP Headers & Custom Data') {
      this.commonService.openHttpTab = false;
      this.openHttpReport(this.commonService.selectedData);
    }
    if (this.intialDrafit['tabs'][i].header == 'Database Queries') {
      this.commonService.openDbTab = false;
      this.openDBReports(this.commonService.selectedData, 'fpByresponse');
    }
    if (this.intialDrafit['tabs'][i].header == 'Exceptions') {
      this.commonService.openExceptionTab = false;
      this.openExceptionReport(this.commonService.selectedData);
    }
    if (this.intialDrafit['tabs'][i].header == 'Flowpath Compare') {
      this.commonService.isToLoadSideBar = false;
      this.commonService.openFlowpath = false;
    }
    // }
    // this.commonService.openFlowpath = true;

  }
  onRowClick(event) {
    let data = [];
    data[0] = event.data;
    this.commonService.selectedData = data[0];
    this.commonService.openCurrentFlowpathTab = true;
  }
  highlighttheRow() {
    setTimeout(() => {
      this.selectedRowInfo = [];
      this.selectedRowInfo[0] = this.commonService.selectedData;
      this.commonService.CurrentflowpathData = this.selectedRowInfo;
    }, 300)
  }
  onTabClose(event) {

    let index = event.index;
    console.log('intialDrafit = ', this.intialDrafit);
    if (this.intialDrafit['tabs'][index].header == 'Method Call Details') {
      this.commonService.openMethodCallingTreeTab = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'Flowpaths') {
      this.commonService.openFlowpath = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'Transaction FlowMap') {
      this.commonService.openFlowMapTab = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'Hotspots') {
      this.commonService.openHotspotTab = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'Methods Timing') {
      this.commonService.openMethodTimingTab = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'HTTP Headers & Custom Data') {
      this.commonService.openHttpTab = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'Database Queries') {
      this.commonService.openDbTab = false;
    }
    if (this.intialDrafit['tabs'][index].header == 'Exceptions') {
      this.commonService.openExceptionTab = false;
    }
  }
  showError(msg: any) {
    this.errMsg = [];
    this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }
  fillSelection() {
    if ((this.urlParam.urlParam != undefined && this.urlParam.urlParam != "")
      && (this.urlParam.isFromNV != undefined && this.urlParam.isFromNV == "1")) {
      this.urlParam.urlParam = decodeURIComponent(this.urlParam.urlParam);
      let index = 0;
      if (this.flowpathData) {
        this.flowpathData.map((itemObj) => {
          if (itemObj.urlQueryParamStr && itemObj.urlQueryParamStr.indexOf(this.urlParam.urlParam) != -1) {
            this.selectedRowInfo[index] = itemObj;
            console.log("this.selectedRowInfo", this.selectedRowInfo, itemObj)
            index++;
          }
        });
      }
    }
    else if (this.commonService.selectedData !== undefined && this.commonService.selectedData !== null) {
      this.selectedRowInfo[0] = this.commonService.selectedData;
    }
  }
  compareFlowpaths() {
    if (this.selectedRowInfo.length < 2) {
      alert("Please select two flowpaths.");
      return;
    }
    else if (this.selectedRowInfo.length > 2) {
      alert("Only two flowpaths can be compared.");
      return;
    }
    this._ddrData.setInLogger('DDR::Flowpath', 'Compare Flowpaths', 'Open compareFlowpaths Reports');
    this.commonService.openCurrentFlowpathTab = true;
    this.commonService.showAllTabs = false;
    // this.showCompareReport = true;
    this.commonService.mctData = {};
    this.commonService.openFlowpath = false;
    this.compareFPInfo = this.selectedRowInfo;
    this.commonService.mctFlag = false;
    this._ddrData.isCompFlowpath = true;
    this.commonService.compareFlowpathData = this.compareFPInfo;
    this._router.navigate(['/ddr/DdrCompareFlowpath']);
  }
  openIPSummary(rowData) {
    console.log(rowData);
    this.setHostName();
    this.commonService.showAllTabs = false;
    this.commonService.openCurrentFlowpathTab = true;
    this.showCompareReport = false;
    this.showIPSummary = true;
    this.commonService.ipSummaryData = rowData;
    if (rowData != undefined) {
      if (rowData.fpDuration == '< 1') {
        this.commonService.mctData = rowData;
      } else {
        this.commonService.mctData = rowData;
      }
      this.commonService.mctFlag = true;
    }
    this.commonService.mctData['source'] = 'Flowpath';
    if (this.commonService.isIntegratedFlowpath) {
      this.commonService.showIPSummary = false;
      this.checkFpInstance(rowData.flowpathInstance);
      this._changeDetection.detectChanges();
      this.commonService.showIPSummary = true;
      this.commonService.openFlowpath = false;
      this.commonService.openIPSummary = true;
      this.highlighttheRow();

    }
  }

  // Functions for split view starts here

  flagValue(event) {
    console.log(event)
    this.toggle = event;
    this.commonService.currentReport = 'Flowpath'
    this.commonService.isToLoadSideBar = true;
    this._changeDetection.detectChanges();
    let tempData = this.flowpathData
    this.flowpathData = []
    tempData.map((rowdata) => { this.flowpathData = this.Immutablepush(this.flowpathData, rowdata) });
  }

  selectedRowData(event) {
    this.order = '';
    this.currentRowData = event;
    console.log("Parent currentFPRowData===", this.currentRowData);
  }

  getColumnField(event) {
    console.log("column name==>", event);
    this.columnName = event;
  }

  currentRowData(event) {
    this.order = '';
    this.currentRowData = event;
    console.log('Parent here===', this.currentRowData);
  }

  setPaginateData(event) {
    this.isFromDropDown = true;
    this.nvndData = [];
    if (this.urlParam.isFromNV == "1") {
      if (event.offset != 0) {
        if (this.commonService.rowspaerpage > 50) {
          this.pageNo = Math.floor(event.offset / this.commonService.rowspaerpage) + 1;
        }
        else
          this.pageNo = Math.floor(event.offset / 50) + 1;
      }
      else if (this._ddrData.nvFirstPage) {
        for (let j = 0; j < this.nvndCount.length; j++) {
          this.nvndCount[j]['count'] = undefined;
        }
        this.pageNo = 1;
        this.nvPageIndex = {};
      }
      else
        this.pageNo = 1;
    }
    console.log("paginator======", event, " this.pageNo ", this.pageNo);
    if (this.pageNo > 1 && this.urlParam
      && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
      && sessionStorage.getItem("isMultiDCMode") == "true") {
      //this.handlePaginationForNVND(event);    //commenting for migration purpose
    }
    else {

      this.fpLimit = event.limit;
      this.fpOffset = event.offset;
    }
    this.loading = true;
    this.commonService.isFilterFromSideBar = true;
    this.getFlowpathData();
  }
  setTxnToggle(event) {
    this.txnToggle = event;
  }

  openAutoInstDialog() {
    this.setHostName();
    console.log(" selectedRow  = ", this.selectedRowInfo);

    if (this.selectedRowInfo.length == 0) {
      alert("Please select atleast one row");
      return;
    }
    else if (this.selectedRowInfo.length >= 2) {
      alert("Select only one row");
      return;
    }
    else {
      let testRunStatus;
      let instanceType;
      let url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.urlParam.testRun;
      console.log('url *** ', url);
      this.ddrRequest.getDataUsingGet(url).subscribe(res => {
        console.log("data for tr status === ", res);
        testRunStatus = <any>res;
        testRunStatus = testRunStatus.data;
        if (testRunStatus.length != 0) {
          if (this.selectedRowInfo[0]['Instance_Type'].toLowerCase() == 'java')
            instanceType = 'Java';
          else if (this.selectedRowInfo[0]['Instance_Type'].toLowerCase() == 'dotnet')
            instanceType = 'DotNet';

          this.argsForAIDDSetting = [this.selectedRowInfo[0]['appName'], this.selectedRowInfo[0]['appId'], instanceType,
          this.selectedRowInfo[0]['tierName'], this.selectedRowInfo[0]['serverName'], this.selectedRowInfo[0]['serverId'], '-1',
          this.selectedRowInfo[0]['urlName'], 'DDR', testRunStatus[0].status, this.urlParam.testRun];
          console.log('this.argsForAIDDSetting>>>>>>>>>>>>****', this.argsForAIDDSetting);
          this.showAutoInstrPopUp = true;
        }
        else {
          this.showAutoInstrPopUp = false;
          alert("Could not start instrumentation, test is not running")
          return;
        }
      });

    }
  }

  startInstrumentaion(result) {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog) {
    this.showAutoInstrPopUp = isCloseAIDDDialog;
  }

  openReport(flag, nodeData, field) {
    // this.commonService.openCurrentFlowpathTab = false;
    // this.commonService.showTransactionFlowmap = true;
    // this.commonService.openFlowpath = true;
    console.log(" test open report ");
    if (this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
      && (!this.urlParam.flowpathID || this.urlParam.flowpathID === "NA")
      && sessionStorage.getItem("isMultiDCMode") == "true") {
      for (let i = 0; i < this._ddrData.ndDCNameInfo.length; i++) {
        if (this._ddrData.ndDCNameInfo[i].displayName == nodeData.dcName) {
          this._ddrData.dcName = nodeData.dcName;
          this._ddrData.testRun = this._ddrData.ndDCNameInfo[i].ndeTestRun;
          console.log(" test open report in", this._ddrData.testRun, " ", this._ddrData.dcName);
          break;
        }
      }
    }
    this.commonService.mctFlag = true;
    this.sortButtonHide = true;
    this.setClass = "ui-g-9"
    this.commonService.dbFilters['fromDBCallByBT'] = 'false';
    this._ddrData.splitViewFlag = true;
    this.commonService.httpFlag = true;
    this.commonService.hsFlag = true;
    if (this.flowBack) {
      this._ddrData.isFromtrxFlow = false;
    }
    this.commonService.hsData = undefined;
    this._ddrData.dbFlag = true;
    this._ddrData.flowpathToExFlag = true;
    this.commonService.seqDiagToExceptionFlag = false;
    if (field == 'totalError') {
      nodeData['failedQuery'] = 1;
      this._ddrData.failedQuery = 1;
    }
    else {
      this._ddrData.failedQuery = 0;
    }
    this.commonService.isToLoadSideBar = false;
    sessionStorage.setItem("dbFlag", 'true');
    this.toggle = false;
    console.log("complete details========", nodeData);
    this.currentRowData = nodeData;
    this.columnName = field;
    this.setHostName();
    if (field == 'callOutCount') {
      this.commonService.isFromFpInstance = false;
      let columnFlowpathData = JSON.parse(JSON.stringify(nodeData));
      if (columnFlowpathData.fpDuration == '< 1')
        columnFlowpathData.fpDuration = 0;
      this.flowmapDataService.resetFlag();
      this.flowmapDataService.jsonData = [];
      this.flowmapDataService.getDataForTxnFlowpath(columnFlowpathData.flowpathInstance, columnFlowpathData);
    }
    if (field == 'startTime') {
      console.log('coming here for flowmap')
      this.commonService.isFromFpInstance = true;
      let columnFlowpathData = JSON.parse(JSON.stringify(nodeData));
      if (columnFlowpathData.fpDuration == '< 1')
        columnFlowpathData.fpDuration = 0;
      this.flowmapDataService.resetFlag();
      this.flowmapDataService.getDataForTxnFlowpath(columnFlowpathData.flowpathInstance, columnFlowpathData);
    }
  }

  setHostName(): any {
    if (this._ddrData && this._ddrData.host) {
      this.commonService.host = this._ddrData.host;
      this.commonService.port = this._ddrData.port;
      this.commonService.protocol = this._ddrData.protocol;
      this.commonService.testRun = this._ddrData.testRun;
    }
    if (!this.commonService.protocol)
      sessionStorage.setItem("protocol", location.protocol.replace(":", ""));
  }

  showHide() {
    console.log(this.sideView);
    console.log(this.sideView.nativeElement.style.display);
    if (!this.sideView.nativeElement.style.display || this.sideView.nativeElement.style.display == 'block') {
      this.setClass = "ui-g-12";
      this.buttonValue = 'icons8 icons8-plus-math';
      this.buttonValueTootip = "Show Side View";
      this.sideView.nativeElement.style.display = 'none';
      this.sortButtonHide = false;
    }
    else if (this.sideView.nativeElement.style.display == 'none') {
      this.buttonValue = 'icons8 icons8-minus';
      this.buttonValueTootip = "Hide Side View";
      this.setClass = "ui-g-9";
      this.sideView.nativeElement.style.display = 'block';
      this.sortButtonHide = true;
    }
  }

  openFpTypeError(rawData) {
    console.log("We are inside this box for Error Message");
    let url = this.getHostUrl() + '/' + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/erroneousflowpath?flowpathtype=" + rawData.flowpathtype;
    return this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => (this.doAssignErrorBitValue(data)));

  }

  doAssignErrorBitValue(res) {
    var array = res.split(',');
    var arrMsg = [];
    array.forEach(val => {
      if (val == '6') {
        arrMsg.push({ "errorbit": val, "errmsg": " JIT Compilation done for some methods in context of this transaction, may impact response time." });
      }
      else if (val == '7') {
        arrMsg.push({ "errorbit": val, "errmsg": " Test stopped but current transaction found active." });
      }
      else if (val == '9') {
        arrMsg.push({ "errorbit": val, "errmsg": " Flowpath Header is missing for current  request." });
      }
      else if (val == '10') {
        arrMsg.push({ "errorbit": val, "errmsg": " This is an Incomplete Flowpath." });
      }
      else if (val == '11') {
        arrMsg.push({ "errorbit": val, "errmsg": " Current Flowpath has abnormal method entry-exit timings." });
      }
    });
    this.errormsgObj = arrMsg;
    console.log('this.errormessageObj?>>>>>>>>>>>', this.errormsgObj);
    this.fptypeErrorFlag = true;
  }

  openPopUp() {
    this.openSortPopUp = true;
    this.order = '';
  }

  setIndex(event) {
    this.index = event;
  }

  ngAfterViewInit() {
    this.setSearchFilter();
  }
  ngOnDestroy() {
    if (this.gb) {
      if (this.gb && this.gb.filters && this.gb.filters.global)
        this._ddrData.searchString = this.gb.filters.global.value;
      else if (this.gb && this.gb.nativeElement.value)
        this._ddrData.searchString = this.gb.nativeElement.value;
    }
    else if (this.searchProperty)
      this._ddrData.searchString = this.searchProperty;
    else
      this._ddrData.searchString = "";

    this._ddrData.splitViewFlag = false;
    this.sideBarFlowpath.unsubscribe();
    this.commonService.fpLimit = 0;
    if (this.flowBack) {
      this._ddrData.isFromtrxSideBar = false;

    }

  }

  setSearchFilter() {
    if (this._ddrData.searchString) {
      this.gb.nativeElement.focus();
      this.gb.nativeElement.value = this._ddrData.searchString + '\n';
      this.gb.nativeElement.onclick;
      this.searchProperty = this._ddrData.searchString + '\n';
    }
  }

  deletCachedData() {

    let url = this.getHostUrl() + '/' + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/deleteCacheFile/" + this.urlParam.testRun + "?REPORT_ID=" + this.selectedReport;
    return this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => (this.doAssigndelete(data)));

  }
  openDeleteCache() {
    this.deleteCachedFlag = true;
    this.selectedReport = "";
  }
  onApply() {
    this.deletCachedData();
    this.deleteCachedFlag = false;
  }

  doAssigndelete(res) {
    console.log(res);
    if (res == 'true') {
      this.showDeleteNotification();
    } else {
      this.showErrorNotification();
    }
  }
  showDeleteNotification() {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Cached data cleared successfully' });
  }
  showErrorNotification() {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'No Data to delete from Cache' });
  }

  /**commenting below code from method
  *  getSelectedDcForNV to getBackendIdForNF
  */
  // getSelectedDCForNV(dcName: any) {
  //   if (sessionStorage.getItem("isMultiDCMode") == "true" && dcName) {
  //     this.selectedDC = dcName;
  //     this._ddrData.dcName = dcName;
  //     this.commonService.selectedDC = this.selectedDC;
  //     this.commonService.host = undefined;
  //     console.log("calling from dcMenu select case NV ", dcName);
  //     if (this._cavConfig.getActiveDC() == 'ALL') {
  //       this._cavNavBar.setDDRArguments(dcName, true);
  //       console.log("set DcName", dcName);
  //     }
  //   }
  //   else {
  //     for (let i = 0; i < this.ndeInfoData.length; i++) {
  //       if (this.selectedDC == this.ndeInfoData[i].displayName) {

  //         this.ndeCurrentInfo = this.ndeInfoData[i];

  //         if (this.ndeInfoData[i].ndeProtocol != undefined)
  //           this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
  //         else
  //           this.dcProtocol = location.protocol.replace(":", "");

  //         if (this.ndeInfoData[i].ndeTestRun) {
  //           this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
  //           this.testRun = this.ndeInfoData[i].ndeTestRun;
  //         }
  //         else
  //           this.testRun = this.urlParam.testRun;

  //         this.host = this.ndeInfoData[i].ndeIPAddr;
  //         this.port = this.ndeInfoData[i].ndeTomcatPort;

  //         this.commonService.host = this.host;
  //         this.commonService.port = this.port;
  //         this.commonService.protocol = this.dcProtocol;
  //         this.commonService.testRun = this.testRun;
  //         this.commonService.selectedDC = this.selectedDC;
  //         console.log('commonservece variable--------->', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
  //         break;
  //       }
  //     }
  //   }
  //   this.getTierNamesForDC(this.selectedDC).then(() => {
  //     this.loader = true;
  //     /* setting limit and offset in case of dc changed */
  //     this.fpLimit = 50;
  //     this.fpOffset = 0;
  //     this.getProgressBar();
  //     this.getFlowpathData();
  //     this.getFlowpathDataCount();
  //   })
  // }
  // getNVtoND(res) {
  //   let checkDCList = 0;
  //   this._ddrData.nvFirstPage = false;
  //   if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL' && this.nvMultiDC == 0) {
  //     checkDCList = 1;
  //     this.getDCForNV().then(() => {
  //       checkDCList = 2;
  //     });
  //     this.nvMultiDC = 1;
  //   }
  //   if (sessionStorage.getItem("isMultiDCMode") != "true") {
  //     this.isFromDropDown = true;  //for NV to ND single dc
  //   }
  //   else if (sessionStorage.getItem("isMultiDCMode") == "true") {
  //     let hostDCName = this._ddrData.getHostUrl();
  //     if (hostDCName.includes("tomcat/") && hostDCName.split("tomcat/")[1]) {
  //       this._ddrData.dcName = hostDCName.split("tomcat/")[1];
  //     }
  //     if (this.nvMultiDC == 0) {
  //       this.isFromDropDown = true;
  //       this.nvMultiDC = 1;
  //     }
  //     this.selectedDC = this._ddrData.dcName;
  //   }
  //   if (this.urlParam.flowpathID && this.urlParam.flowpathID != "NA") {
  //     if (res && res.data && res.data.length != 0) {
  //       if (!this._ddrData.dcName) {
  //         this._ddrData.dcName = this._ddrData.getMasterDC();
  //       }
  //       return;
  //     }
  //     console.log("check FP dc details ", this.dcList, " lv ", this.dcIndexForNV, this.isFromDropDown, checkDCList);
  //     if (checkDCList == 2) {
  //       if ((this.dcList && this.dcList.length >= this.dcIndexForNV) && this.isFromDropDown == false && !(res && res.data && res.data.length != 0)) {
  //         console.log("best criteris is not matched for NVTO ND");
  //         this.dcIndexForNV++;
  //         console.log("this.dcList[this.dcIndexForNV]--------", this.dcList[this.dcIndexForNV], this.nvndData.length, this.dcList, "nvindex ", this.dcIndexForNV);
  //         if (this.dcList[this.dcIndexForNV] && this.dcList[this.dcIndexForNV].value && this.isFromDropDown == false)
  //           this.getSelectedDCForNV(this.dcList[this.dcIndexForNV].value);
  //       }
  //     }
  //     else if (checkDCList == 1) {
  //       this.getDCForNV().then(() => {
  //         if ((this.dcList && this.dcList.length >= this.dcIndexForNV) && this.isFromDropDown == false && !(res && res.data && res.data.length != 0)) {
  //           console.log("best criteris is not matched for NVTO ND IN");
  //           this.dcIndexForNV++;
  //           console.log("this.dcList[this.dcIndexForNV]--------IN ", this.dcList[this.dcIndexForNV], this.nvndData.length, this.dcList, "nvindex ", this.dcIndexForNV);
  //           if (this.dcList[this.dcIndexForNV] && this.dcList[this.dcIndexForNV].value && this.isFromDropDown == false)
  //             this.getSelectedDCForNV(this.dcList[this.dcIndexForNV].value);
  //         }
  //       });
  //     }
  //   }
  //   else if (res && res.data && res.data.length != 0) {
  //     this.flowpathData = res.data;
  //     if (this.nvIndex == 0) {
  //       this.nvFilter = "Data Filter=NDSessionID, NVSessionID, NVPageID";
  //     }
  //     else if (this.nvIndex == 1) {
  //       this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //     }
  //     else {
  //       this.nvFilter = "Data Filter=NDSessionID";
  //     }
  //     if (this.headerInfo.indexOf('Data Filter') == -1) {
  //       this.headerInfo += "," + this.nvFilter;
  //       this.downloadFilterCriteria += "," + this.nvFilter;
  //     }
  //     this.createLinkForCopy();
  //     return;
  //     /* let resData = [];
  //     if(this.nvIndex == 1) {
  //     for(let i = 0; i< res.data.length; i++ ){
  //       if((res.data[i].nvPageId == this.urlParam.nvPageId)){
  //         resData.push(res.data[i]);
  //       }
  //     }
  //     if(resData.length >0){
  //       this.nvPageCount[0] = resData.length;
  //       console.log("best criteris is matched for NVTO ND");
  //       this.flowpathData = resData;
  //       this.isFromPage = true;
  //       this.nvFilter = "Data Filter=NDSessionID, NVSessionID, NVPageID";
  //       if(this.headerInfo.indexOf('Data Filter') == -1){
  //       this.headerInfo += "," + this.nvFilter;
  //       this.downloadFilterCriteria += "," + this.nvFilter;
  //       }
  //       this.fpTotalCount = this.nvPageCount[0];
  //       this.createLinkForCopy();
  //       this.nvndFirstData = true;
  //        return;
  //     }
  //     else {
  //       if(sessionStorage.getItem("isMultiDCMode") === "true") {
  //        this.nvndData.push({'dcName' : this.selectedDC , 'res' : JSON.parse(JSON.stringify(res)), 'nvPagecount' : +this.nvPageCount[0]}); 
  //        this.flowpathData = [];
  //          if(!this.nvndFirstData) {
  //          this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //          this.createLinkForCopy();
  //          this.nvndFirstData = true;
  //         }
  //        this.nvndData.push({'dcName' : this.selectedDC , 'res' : JSON.parse(JSON.stringify(res)), 'nvPagecount' : +this.nvPageCount[0]}); 
  //        this.flowpathData = [];

  //       }
  //       else {
  //         this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //         if(!this.nvndFirstData) {
  //           this.createLinkForCopy();
  //           this.nvndFirstData = true;
  //         }
  //         if(this.headerInfo.indexOf('Data Filter') == -1){
  //         this.headerInfo += "," + this.nvFilter;
  //         this.downloadFilterCriteria = "," + this.nvFilter;
  //         }
  //         return;
  //       }
  //     } 
  //    } 
  //    if(this.nvIndex == 2){
  //     this.nvFilter = "Data Filter=NDSessionID";
  //     this.createLinkForCopy();
  //     if(this.headerInfo.indexOf('Data Filter') == -1){
  //     this.headerInfo += "," + this.nvFilter;
  //     this.downloadFilterCriteria +=  "," + this.nvFilter;
  //     }
  //     return;
  //    } */
  //   }
  //   if (((this.dcList && this.dcList.length >= this.dcIndexForNV) || this.isFromDropDown == true) && (!(res && res.data && res.data.length != 0) || this.flowpathData.length == 0) && (!this.urlParam.flowpathID || this.urlParam.flowpathID == "NA")) {
  //     console.log("best criteris is not matched for NVTO ND d");
  //     this.dcIndexForNV++;
  //     console.log("this.dcList[this.dcIndexForNV]-------- d", this.dcList, this.nvndData, "nvindex ", this.dcIndexForNV);
  //     if (this.dcList && this.dcList[this.dcIndexForNV] && this.dcList[this.dcIndexForNV].value && this.isFromDropDown == false)
  //       this.getSelectedDCForNV(this.dcList[this.dcIndexForNV].value);
  //     else if (this.isFromDropDown == true) {//single dc data
  //       if (this.nvIndex == 2)
  //         return;
  //       this.nvIndex += 1;
  //       this.getFlowpathData();
  //       this.getFlowpathDataCount();
  //     }
  //     else {
  //       if (this.nvIndex == 2) {
  //         return;
  //       }
  //       this.nvIndex += 1;
  //       this.dcIndexForNV = -1;
  //       let resBlank = [];
  //       resBlank["data"] = [];
  //       this.getNVtoND(resBlank);
  //       console.log("else case data ")
  //     }
  //   }
  //   /* if(((this.dcList && this.dcList.length >= this.dcIndexForNV) || this.isFromDropDown == true) && (!(res && res.data && res.data.length != 0) || this.flowpathData.length == 0)&& (!this.urlParam.flowpathID || this.urlParam.flowpathID == "NA")) {
  //       console.log("best criteris is not matched for NVTO ND");
  //       this.dcIndexForNV++; 
  //         console.log("this.dcList[this.dcIndexForNV]--------",this.dcList,this.nvndData ,"nvindex ",this.dcIndexForNV);
  //       if(this.dcList && this.dcList[this.dcIndexForNV] && this.dcList[this.dcIndexForNV].value && this.isFromDropDown == false)
  //          this.getSelectedDCForNV(this.dcList[this.dcIndexForNV].value); 
  //        else if(this.nvndData.length > 0) {// not getting dcName for further, so putting bydefault master value
  //           this.selectedDC = this.nvndData[0].dcName;
  //           this.flowpathData = this.nvndData[0].res.data;
  //           this.filterDCName = 'DC=' + this.selectedDC + ', ';
  //           if(this.headerInfo.indexOf('Data Filter') == -1){
  //           this.headerInfo = 'StartTime=' + this.nvndData[0].res.strStartTime;
  //           this.headerInfo += ', EndTime=' + this.nvndData[0].res.strEndTime;
  //           this.headerInfo += ',OrderBy=Start Time';
  //           console.log("showHeaderInfo ",this.nvndData);
  //           this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //           this.headerInfo += "," + this.nvFilter;
  //           this.downloadFilterCriteria = this.headerInfo;
  //          }
  //           this.fpTotalCount = this.nvPageCount[0];
  //           return;
  //           // this.commonService.fpLimit = +this.nvndData[0].nvPagecount;
  //           // this.fpTotalCount = +this.nvndData[0].nvPagecount;
  //           // this.commonService.fpOffset = Number(this.commonService.fpOffset);
  //           //console.log("check data ",this.flowpathData,"this.nvPageCount[0]",this.nvPageCount[0],"this.fpLimit ",this.commonService.fpLimit ,"this.fpTotalCount",this.fpTotalCount);
  //         }
  //         else if(this.isFromDropDown == true){//single dc data
  //           if(this.nvIndex == 2)
  //             return;
  //           this.nvIndex = 2;
  //           this.getFlowpathData();
  //           this.getFlowpathDataCount();
  //           this.nvFilter = "Data Filter=NDSessionID";
  //           if(this.headerInfo.indexOf('Data Filter') == -1){
  //           this.headerInfo += "," + this.nvFilter;
  //           this.downloadFilterCriteria +=  "," + this.nvFilter;
  //           }
  //           this.createLinkForCopy();
  //          // this.getSelectedDCForNV(this.selectedDC);
  //         }
  //         else {
  //           if(this.nvIndex == 2 && !this.dcList[this.dcIndexForNV]){
  //             this.nvFilter = "Data Filter=NDSessionID";
  //             if(this.headerInfo.indexOf('Data Filter') == -1){
  //             this.headerInfo += "," + this.nvFilter;
  //             this.downloadFilterCriteria +=  "," + this.nvFilter;
  //             }
  //             this.createLinkForCopy();
  //             return;
  //           }
  //           this.nvIndex = 2;
  //           this.dcIndexForNV = -1;
  //           let resBlank = [];
  //           resBlank["data"] = [];
  //           this.getNVtoND(resBlank);
  //           this.nvFilter = "Data Filter=NDSessionID";
  //           if(this.headerInfo.indexOf('Data Filter') == -1){
  //           this.headerInfo += "," + this.nvFilter;
  //           this.downloadFilterCriteria +=  "," + this.nvFilter;
  //           }
  //           this.createLinkForCopy();
  //          console.log("else case data ")
  //         }
  //    } */
  // }

  // getDCForNV() {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.ndeInfoData = [];
  //       this.dcList = [];
  //       let dcInfo = this._cavConfig.getDCInfoObj();
  //       let index = 1;
  //       for (let i = 0; i < dcInfo.length; i++) {
  //         let dcArr = {};
  //         if (dcInfo[i].productType == "netdiagnostics") {
  //           this.dcList.push({ label: dcInfo[i].dc, value: dcInfo[i].dc });
  //           dcArr["displayName"] = dcInfo[i].dc;
  //           dcArr["ndeProtocol"] = dcInfo[i].protocol;
  //           dcArr["ndeIPAddr"] = dcInfo[i].ip;
  //           dcArr["ndeTomcatPort"] = dcInfo[i].port;
  //           dcArr["ndeTestRun"] = dcInfo[i].testRun;
  //           if (dcInfo[i].isMaster == true) {
  //             /*commenting due to migration config service is not used anymore */
  //             // if (this._cavConfig.getActiveDC() == 'ALL')
  //             //   this.selectedDC = "ALL";
  //             // else
  //             //   this.selectedDC = dcInfo[i].dc;
  //               this.selectedDC = "ALL";

  //             dcArr["isCurrent"] = 1;
  //             this.dcList[0] = { label: dcInfo[i].dc, value: dcInfo[i].dc };
  //           }
  //           else {
  //             dcArr["isCurrent"] = 0;
  //             this.dcList[index] = { label: dcInfo[i].dc, value: dcInfo[i].dc };
  //             index++;
  //           }
  //           this.ndeInfoData.push(dcArr);
  //         }
  //       }
  //       resolve();
  //     }
  //     catch (e) {
  //       console.log("ERROR ", e);
  //       resolve();
  //     }
  //   })
  // }
  // setParamaterInCaseOfNVorNDCase() {

  //   console.log("checkkk  ", this.urlParam);
  //   if (this.urlParam != undefined) {
  //     // Time for NF query log
  //     if ((!this.urlParam.isFromNV || this.urlParam.isFromNV == "NA") && !this.commonService.isFirtNF) {
  //       //this.urlParam.strOrderBy = 'fpduration_desc';
  //       if (this._ddrData.timeVarianceForNetForest) {
  //         this.timeVarienceForNF = this._ddrData.timeVarianceForNetForest;
  //       }
  //       if (this.urlParam.startTime && this.urlParam.startTime != "NA") {
  //         this.urlParam.startTime = Number(this.urlParam.startTime) - Number(this.timeVarienceForNF) * 1000;
  //       }
  //       if (this.urlParam.endTime && this.urlParam.endTime != "NA") {
  //         this.urlParam.endTime = Number(this.urlParam.endTime) + Number(this.timeVarienceForNF) * 1000;
  //       }
  //       this.commonService.isFirtNF = true;
  //     }
  //     this.commonService.setParameterIntoStorage = this.urlParam;
  //     this.commonService.ajaxTimeOut = this.urlParam.ajaxTimeOut;
  //     this.commonService.dcNameList = this.urlParam.dcNameList;
  //     this.commonService.selectedDC = undefined;
  //     this.commonService.isAllCase = this.urlParam.isAll;
  //     //set argument in ddr for NF to ND through query or multiDc also
  //     this._ddrData.testRun = this.urlParam.testRun;
  //     this._ddrData.appName = this.urlParam.appName;
  //     this._ddrData.serverName = this.urlParam.serverName;
  //     this._ddrData.tierName = this.urlParam.tierName;
  //     this._ddrData.urlParam = this.urlParam.urlParam;
  //     this._ddrData.backendName = this.urlParam.backendName;
  //     this._ddrData.backendRespTime = this.urlParam.backendRespTime;
  //     this._ddrData.endTime = this.urlParam.endTime;
  //     this._ddrData.startTime = this.urlParam.startTime;
  //     this._ddrData.flowpathID = this.urlParam.flowpathID;
  //     this._ddrData.isFromNV = this.urlParam.isFromNV;
  //     this._ddrData.urlName = this.urlParam.urlName;
  //     // this._ddrData.dcNameList = this.urlParam.dcNameList;
  //     this._ddrData.ndSessionId = this.urlParam.ndSessionId;
  //     this._ddrData.nvPageId = this.urlParam.nvPageId;
  //     this._ddrData.nvSessionId = this.urlParam.nvSessionId;
  //     if (sessionStorage.getItem("isMultiDCMode") != 'true')
  //       this._ddrData.isFromNVNF = true;
  //     if (this.urlParam.tierNameList)
  //       this.commonService.tierNameList = "NA";

  //     if (this.urlParam.dcNameList) {
  //       sessionStorage.setItem("dcNameList", this.urlParam.dcNameList);
  //       sessionStorage.setItem("tierNameList", this.urlParam.tierNameList)
  //       sessionStorage.setItem("isAllCase", this.urlParam.isAll);
  //     }
  //   }
  // }
  // getBackendIdForNF() {
  //   if (this.urlParam.backendName && this.urlParam.backendName != "NA" && this.urlParam.backendName != "undefined") {
  //     let url;
  //     this.nFCase = true;
  //     if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
  //       this.showDCMenu = false;
  //       // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL') {
  //       //   url = this._ddrData.protocol + "://" + this.getHostUrl();
  //       // }
  //       // else {
  //       url = this.getHostUrl();
  //       // }

  //       console.log("urllll form NF or NV", this.url);
  //     } else {
  //       //this.showDCMenu = true;;
  //       this.dcProtocol = this.commonService.protocol;

  //       if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
  //         url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
  //         this.dcProtocol = this.commonService.protocol;
  //       } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
  //         url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
  //         this.dcProtocol = this.commonService.protocol;
  //       }
  //       else {
  //         url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
  //         this.dcProtocol = location.protocol;
  //       }
  //     }

  //     url += '/' + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/backendId?testRun=" + this.urlParam.testRun + "&backendName=" + this.urlParam.backendName;
  //     this.ddrRequest.getDataInStringUsingGet(url).subscribe(res => {
  //       let data = <any>res;
  //       this.urlParam.backendId = data;
  //       console.log('Backend Id-----', this.urlParam.backendId);
  //       if (this.urlParam.backendId.startsWith('Error')) {
  //         //alert(this.urlParam.backendId);
  //         //this.nFCase = false;
  //         this.urlParam.backendId = undefined;
  //         this.urlParam.backendRespTime = undefined;
  //         this.urlParam.strOrderBy = 'stime';
  //       }
  //       this.commonFpCode();
  //     });
  //   }
  //   else {
  //     if (!(this.urlParam.path && this.urlParam.path.includes("ddrCopyLink")))
  //       this.urlParam.strOrderBy = 'stime';
  //   }
  // }

  commonFpCode() {
    if (this._router.url.indexOf('?') != -1
      && (this._router.url.indexOf('/home/ddrCopyLink/flowpath') != -1)) {
      //this._navService.addNewNaviationLink('ddr');
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.urlParam = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      sessionStorage.setItem('hostDcName', location.host);
      if (this.urlParam.enableQueryCaching) {
        this.commonService.enableQueryCaching = this.urlParam.enableQueryCaching;
      }
      if (this.urlParam.FileName) {
        this._ddrData.cmdArgsFlag = true;
      }
      if (this.urlParam.product)
        this.urlParam.product = this.urlParam.product.replace("/", "");

      if (this.urlParam.sesLoginName)
        sessionStorage.setItem('sesLoginName', this.urlParam.sesLoginName);

      sessionStorage.setItem('port', location.port);
      sessionStorage.setItem('timeZoneId', this.urlParam.timeZoneId)
      this.commonService.removeFromStorage();
      sessionStorage.setItem("resTimeFlagforCustomData", this.urlParam.resTimeFlagforCustomData);
      sessionStorage.setItem("mode", this.urlParam.mode);
      this.commonService.setParameterIntoStorage = this.urlParam;
      this.commonService.strGraphKey = this.urlParam.strGraphKey;
      this.commonService.dcNameList = this.urlParam.dcNameList;
      this.commonService.isAllCase = this.urlParam.isAll;
      this.commonService.tierNameList = this.urlParam.tierNameList;
      this.commonService.selectedDC = this.urlParam.dcName;
      this.selectedDC = this.urlParam.dcName;
      this.commonService.ajaxTimeOut = this.urlParam.ajaxTimeout;
      if (this.urlParam.dcNameList != null && this.urlParam.dcNameList != '' && this.urlParam.dcNameList != undefined && this.urlParam.dcNameList != 'undefined') {
        sessionStorage.setItem("dcNameList", this.urlParam.dcNameList);
        sessionStorage.setItem("tierNameList", this.urlParam.tierNameList)
        sessionStorage.setItem("isAllCase", this.urlParam.isAll);
      }
      if (this.urlParam.isIntegratedFlowpath == 'true') {
        this.commonService.isIntegratedFlowpath = true;
      }
    }
    if (this.urlParam.FileName) {
      this._ddrData.cmdArgsFlag = true;
    }
    if (this.urlParam.threadId)
      this.threadId = this.urlParam.threadId;
    if (this.urlParam.flowpathEndTime)
      this.flowpathEndTime = this.urlParam.flowpathEndTime;
    if (this.urlParam.paginationFlag === "false")
      this.paginationFlag = false;
    console.log('this.urlParam************', this.urlParam, '***', sessionStorage.getItem('resTimeFlagforCustomData'), "correlationId", this._ddrData.correlationId, "mode ", this._ddrData.mode);
    this.commonService.removeFromStorage();
    this.commonService.setInStorage = this.urlParam;

    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH);
    this.breadcrumb.add({label: 'Flowpath', routerLink: '/ddr/flowpath'});
    this.randomNumber();
    this.getSecurityEnableMode();

    console.log("after apply", this.commonService._ddrSideBarOnApply);
    this.sideBarFlowpath = this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == "Flowpath") {
        console.log('temp============', temp);
        this.commonService.removeAllComponentFromFlowpath();
        this.commonService.CurrentflowpathData = [];
        this.commonService.showAllTabs = false;
        this.commonService.openFlowpath = true;
        this.commonService.isFilterFromSideBar = true;
        let keys = Object.keys(temp);
        this.loader = true;
        if (this.commonService.fpLimit < 50) {
          this.commonService.fpLimit = 50;
        }
        this.fpLimit = this.commonService.fpLimit;
        this.fpOffset = this.commonService.fpOffset;
        this.getFlowpathData();
        if (!(this.urlParam && this.urlParam.isFromNV && this.urlParam.isFromNV == "1"
          && (this.urlParam.flowpathID || this.urlParam.flowpathID === "NA")
          && sessionStorage.getItem("isMultiDCMode") == "true"))
          this.getFlowpathDataCount();
      }
    });

    if (this.commonService.openFlowpath == false && this.commonService.dbtoflowpath == false
      && sessionStorage.getItem("dcNameList") != null && sessionStorage.getItem("dcNameList") != ''
      && sessionStorage.getItem("dcNameList") != undefined && sessionStorage.getItem("dcNameList") != 'undefined') {
      this.commonService.dcNameList = sessionStorage.getItem("dcNameList");
      this.commonService.tierNameList = sessionStorage.getItem("tierNameList");
      this.commonService.isAllCase = sessionStorage.getItem("isAllCase");
    }
    this.fillData();
    //this.showNFIcon();      //commenting due to migration
    //this.checkNVSessionIDAndNVURL();  //commenting due to migration

    this.commonService.flowpathHomeDataObservable$.subscribe(() => {
      this._ddrData.FromexpFlag = 'false';
      this._ddrData.FromhsFlag = 'false';
      this._ddrData.dbTofpflag = false;
      this.loader = true;
      this.fpLimit = 50;
      this.fpOffset = 0;
      this._ddrData.customToFlowpathFlag = false;
      this.fillData();
    })
    this.fillSelection();
    //this.getKeyForMetaData();
    this.commonService.openFlowpath = true;
  }

  waitQuery() {
    this.isCancelQuery = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);

  }


  onCancelQuery() {
    let url = "";
    url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + "/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun=" + this.urlParam.testRun + "&queryId=" + this.queryId;
    console.log("Hello u got that", url);
    this.isCancelQuery = false;
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => { return data });
  }

  openpopup() {
    if (!this.isCancelQuerydata)
      this.isCancelQuery = true;
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

  /////////////////////NV-ND MultiDC Code begins here //////////////////////////////////////

  /* commenting below code for migration purpose i.e 
    from method  getNVtoNDForAll to handlePaginationForNVND */

  // getNVtoNDForAll(param: any) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.downDc = false;
  //       let exCount = 0;
  //       let countRest = 0;
  //       let url = "";
  //       let pagination;
  //       this._ddrData.getDcNameInfoFromRest().then(() => {
  //         this.ndeInfoData = this._ddrData.ndDCNameInfo;
  //         console.log("getNVtoNDForAll  ", this.nvIndex, "  this.ndeInfoData ", this.ndeInfoData);
  //         if (this.urlParam.nvIndex && this.urlParam.nvIndex != "undefined")
  //           this.nvIndex = Number(this.urlParam.nvIndex);
  //         if (this.nvArr[this.nvIndex] && this.nvArr.length > 0)
  //           url += this.nvArr[this.nvIndex] + "&nvIndex=" + this.nvIndex + "&isFromNV=" + this.urlParam.isFromNV;
  //         else
  //           url += "&isFromNV=" + this.urlParam.isFromNV;
  //         try {
  //           this.ndeInfoData.forEach((val, index) => {
  //             if (this.pageNo > 1 && this.nvPageIndex[val.displayName] && this.nvPageIndex[val.displayName][this.pageNo]['limit'] && this.nvPageIndex[val.displayName][this.pageNo]['offset']) {
  //               pagination = '&limit=' + this.nvPageIndex[val.displayName][this.pageNo]['limit'] + '&offset=' + this.nvPageIndex[val.displayName][this.pageNo]['offset'];
  //             }
  //             else
  //               pagination = '&limit=' + this.fpLimit + '&offset=' + this.fpOffset;
  //             let finalUrl = location.protocol + "//" + location.host + "/tomcat/" + val.displayName + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' + val.ndeTestRun + param + url;
  //             let dataUrl = finalUrl + '&showCount=false&shellForNDFilters=' + this.shellForNDFilters + pagination;
  //             let countUrl = finalUrl + '&showCount=true&shellForNDFilters=' + this.shellForNDFilters + pagination;
  //             if (this.pageNo == 1 && Object.keys(this.nvPageIndex).length == 0 && !this._ddrData.nvFirstPage) {
  //              this.ddrRequest.getDataUsingGet(countUrl).pipe(timeout(this.commonService.ajaxTimeOut)).subscribe(
  //                 data => {
  //                   countRest++;
  //                   this.HandleNVNDMultiDCFirstPageCount(data, val.displayName, countRest);
  //                 }
  //                 , error => {
  //                   this.downDc = true;
  //                   countRest++;
  //                   this.HandleNVNDMultiDCFirstPageCount(undefined, val.displayName, countRest);
  //                   if (index == this.ndeInfoData.length) {
  //                     this.loader = false;
  //                     this.loading = false;
  //                     this.ajaxLoader = false;
  //                   }
  //                   if (countRest == this.ndeInfoData.length && !this.nvCountFlag) {
  //                     let totalCount = 0;
  //                     for (let i = 0; i < this.nvndCount.length; i++) {
  //                       totalCount += Number(this.nvndCount[i].totalCount);
  //                     }
  //                     let resCount = {};
  //                     resCount["totalCount"] = totalCount;
  //                     console.log("resCount count From rest", resCount);
  //                     this.assignFlowpathDataCount(resCount);
  //                   }
  //                 }
  //               );
  //             }
  //             console.log("Validate NVND dataUrl ", dataUrl, "     this.nvIndex ", this.nvIndex);
  //             setTimeout(() => {
  //               this.openpopup();
  //             }, this._ddrData.guiCancelationTimeOut);
  //            this.ddrRequest.getDataUsingGet(countUrl).pipe(timeout(this.commonService.ajaxTimeOut)).subscribe(
  //               data => {
  //                 console.log(" exCount A ", exCount);
  //                 this.HandleNVNDMultiDCFirstPageData(data, val.displayName);
  //                 exCount++;
  //                 console.log(" exCount B ", exCount);
  //                 console.log("Verify data exCount ", exCount, " this.nvndData.length ", this.nvndData.length)
  //                 if ((exCount == this.ndeInfoData.length) && (this.nvndData.length > 0 || this.nvIndex == 2)) {
  //                   console.log("Done Successfully from here ");
  //                   resolve();
  //                 }
  //                 else if ((exCount == this.ndeInfoData.length) && this.nvndData.length == 0 && this.nvIndex != 2) {
  //                   this.nvIndex += 1;
  //                   this.getNVtoNDForAll(param).then(() => {
  //                     console.log("came here");
  //                     resolve();
  //                   });
  //                 }
  //               }
  //               , error => {
  //                 exCount++;
  //                 if (index == this.ndeInfoData.length) {
  //                   this.loader = false;
  //                   this.loading = false;
  //                   this.ajaxLoader = false;
  //                 }
  //                 console.log("Verify data exCount error", exCount, " this.nvndData.length ", this.nvndData.length)
  //                 if ((exCount == this.ndeInfoData.length) && (this.nvndData.length > 0 || this.nvIndex == 2)) {
  //                   console.log("Done Successfully from here error");
  //                   resolve();
  //                 }
  //                 else if ((exCount == this.ndeInfoData.length) && this.nvndData.length == 0 && this.nvIndex != 2) {
  //                   this.nvIndex += 1;
  //                   this.getNVtoNDForAll(param).then(() => {
  //                     console.log("came here");
  //                     resolve();
  //                   });
  //                 }
  //               }
  //             );
  //             console.log("check page rest ", this.pageNo, this.nvPageIndex, Object.keys(this.nvPageIndex).length);
  //           });
  //         }
  //         catch (error) {
  //           console.log('error in getting data from rest call', error);
  //         }
  //       });
  //     }
  //     catch (error) {
  //       console.log('error in getting data from rest call', error);
  //       resolve();
  //     }
  //   });
  // }
  // HandleNVNDMultiDCFirstPageCount(res, dcName, countRest): void {  //count rest response
  //   try {
  //     this.checkIntervalFlag = countRest;
  //     console.log("check toatl count", res, Number(res.totalCount));
  //     if (res && Number(res.totalCount) > 0) {
  //       this.nvndCount.push({ "dcName": dcName, "totalCount": res.totalCount })
  //     }
  //     console.log("check page ", this.nvndCount);
  //     if (countRest == this.ndeInfoData.length && !this.nvCountFlag) {
  //       let totalCount = 0;
  //       for (let i = 0; i < this.nvndCount.length; i++) {
  //         totalCount += Number(this.nvndCount[i].totalCount);
  //       }
  //       let resCount = {};
  //       resCount["totalCount"] = totalCount;
  //       console.log("resCount count From rest w", resCount);
  //       this.assignFlowpathDataCount(resCount);
  //     }
  //   }
  //   catch (error) {
  //     console.log('Getting error in handling NV-ND', error);
  //   }
  // }
  // HandleNVNDMultiDCFirstPageData(res, dcName): void { // dc by dc data response from rest
  //   try {
  //     //let resData = [];
  //     let count = 0;
  //     this.selectedDC = "ALL";
  //     if (res && res.data && res.data.length > 0) {
  //       for (let i = 0; i < res.data.length; i++) {
  //         res.data[i]["dcName"] = dcName;
  //       }
  //       this.nvndData.push({ 'dcName': dcName, 'data': res.data, 'strStartTime': res.strStartTime, 'strEndTime': res.strEndTime });
  //       if (this.nvIndex == 0) {
  //         this.nvFilter = "Data Filter=NDSessionID, NVSessionID, NVPageID";
  //       }
  //       else if (this.nvIndex == 1) {
  //         this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //       }
  //       else {
  //         this.nvFilter = "Data Filter=NDSessionID";
  //       }
  //       if (this.headerInfo.indexOf('Data Filter') == -1) {
  //         this.headerInfo += "," + this.nvFilter;
  //         this.downloadFilterCriteria += "," + this.nvFilter;
  //       }
  //       /*  if (this.nvIndex == 1 && this.urlParam.nvPageId && this.urlParam.nvPageId != 0) {
  //           for (let i = 0; i < res.data.length; i++) {
  //             if ((res.data[i].nvPageId == this.urlParam.nvPageId)) {
  //               resData[count] = {};
  //               resData[count] = res.data[i];
  //               resData[count]["dcName"] = dcName;
  //               count++;
  //             }
  //           }
  //           if (resData.length > 0) {
  //             this.nvndData.push({ 'dcName': dcName, 'data': resData, 'count': resData.length, 'strStartTime': res.strStartTime, 'strEndTime': res.strEndTime });
  //             this.nvPage = true;
  //             this.nvFilter = "Data Filter=NDSessionID, NVSessionID, NVPageID";
  //             if (this.headerInfo.indexOf('Data Filter') == -1) {
  //               this.headerInfo += "," + this.nvFilter;
  //               this.downloadFilterCriteria += "," + this.nvFilter;
  //             }
  //           }
  //           else if (!this.nvPage) {
  //             for (let i = 0; i < res.data.length; i++) {
  //               res.data[i]["dcName"] = dcName;
  //             }
  //             this.nvndData.push({ 'dcName': dcName, 'data': res.data, 'strStartTime': res.strStartTime, 'strEndTime': res.strEndTime });
  //             this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //             if (this.headerInfo.indexOf('Data Filter') == -1) {
  //               this.headerInfo += "," + this.nvFilter;
  //               this.downloadFilterCriteria += "," + this.nvFilter;
  //             }
  //           }
  //           else {
  //             return;
  //           }
  //         }
  //         else if (this.nvIndex == 1 && !this.nvPage) {
  //           for (let i = 0; i < res.data.length; i++) {
  //             res.data[i]["dcName"] = dcName;
  //           }
  //           this.nvndData.push({ 'dcName': dcName, 'data': res.data, 'strStartTime': res.strStartTime, 'strEndTime': res.strEndTime });
  //           this.nvFilter = "Data Filter=NDSessionID, NVSessionID";
  //           if (this.headerInfo.indexOf('Data Filter') == -1) {
  //             this.headerInfo += "," + this.nvFilter;
  //             this.downloadFilterCriteria += "," + this.nvFilter;
  //           }
  //         }
  //         else {
  //           for (let i = 0; i < res.data.length; i++) {
  //             res.data[i]["dcName"] = dcName;
  //           }
  //           this.nvndData.push({ 'dcName': dcName, 'data': res.data, 'strStartTime': res.strStartTime, 'strEndTime': res.strEndTime });
  //           this.nvFilter = "Data Filter=NDSessionID";
  //           if (this.headerInfo.indexOf('Data Filter') == -1) {
  //             this.headerInfo += "," + this.nvFilter;
  //             this.downloadFilterCriteria += "," + this.nvFilter;
  //           }
  //         } */
  //       console.log("check data ", this.nvndData);
  //     }
  //     else {
  //       console.log("data not getting  ", res);
  //     }
  //   }
  //   catch (error) {
  //     console.log("Error in handling NV-ND", error);
  //   }
  // }
  // callFlowPathFromNVNForAllDC() {   //Merging all dc data here
  //   try {
  //     clearInterval(this.processingInterval);
  //     console.log("Start callFlowPathFromNVNForAllDC");
  //     let res = {};
  //     res['data'] = [];
  //     let totalCount = 0;
  //     /*  if (this.nvndData.length > 0 && this.nvPage) {
  //       for (let i = 0; i < this.nvndData.length; i++) {
  //         res['data'] = res['data'].concat(this.nvndData[i].data);
  //         totalCount += this.nvndData[i].count;
  //         this.nvCountFlag = true;
  //       }
  //       let event = [];
  //       event['order'] = -1;
  //       if(this.commonService.fpFilters ) {
  //       if(this.commonService.fpFilters.strOrderBy == "fpduration_desc")
  //         event['field'] = "fpDuration";
  //       else if(this.commonService.fpFilters.strOrderBy == "error_callout")
  //         event['field'] = "totalError";
  //       else if(this.commonService.fpFilters.strOrderBy == "btcputime_desc")
  //         event['field'] = "btCpuTime";
  //       else 
  //         event['field'] = "startTime";
  //       }
  //       else
  //         event['field'] = "startTime";
  //       console.log(" Checkorde By ", this.commonService.fpFilters.strOrderBy)
  //       res['data'] = this.sortDataInStartTime(event, res['data']);  //sorting data
  //       res['strStartTime'] = this.nvndData[0].strStartTime;
  //       res['strEndTime'] = this.nvndData[0].strEndTime;
  //     } */
  //     if (this.nvndData.length > 0) {
  //       res['data'] = this.getMergeDcDataForNV();
  //       if (this.pageNo == 1 && Object.keys(this.nvPageIndex).length === 0) {
  //         if (res['data'].length < this.commonService.rowspaerpage) {
  //           totalCount = res['data'].length;
  //           this.nvCountFlag = true;
  //         }
  //       }
  //       res['strStartTime'] = this.nvndData[0].strStartTime;
  //       res['strEndTime'] = this.nvndData[0].strEndTime;
  //     }
  //     console.log("resCount data ", res);
  //     this.assignFlowpathData(res);
  //     if (this.pageNo == 1 && Object.keys(this.nvPageIndex).length === 0 && this.nvCountFlag) {
  //       let resCount = {};
  //       resCount["totalCount"] = totalCount;
  //       console.log("resCount count ", resCount);
  //       this.assignFlowpathDataCount(resCount);
  //     }
  //   }
  //   catch (error) {
  //     console.log("error in handling NVND", error);
  //   }
  // }
  // getMergeDcDataForNV() {  //Merging All DC data
  //   try {
  //     let res = {};
  //     res['data'] = [];
  //     let sortData = [];
  //     for (let i = 0; i < this.nvndData.length; i++) {
  //       sortData = sortData.concat(this.nvndData[i]['data']);
  //     }
  //     let event = [];
  //     let length = 50;
  //     event['order'] = -1;
  //     if (this.commonService.fpFilters) {
  //       if (this.commonService.fpFilters.strOrderBy == "fpduration_desc")
  //         event['field'] = "fpDuration";
  //       else if (this.commonService.fpFilters.strOrderBy == "error_callout")
  //         event['field'] = "fpDuration";
  //       else if (this.commonService.fpFilters.strOrderBy == "btcputime_desc")
  //         event['field'] = "totalError";
  //       else
  //         event['field'] = "startTime";
  //     }
  //     else
  //       event['field'] = "startTime";
  //     sortData = this.sortDataInStartTime(event, sortData);  //sorting data
  //     console.log("Sortet data ", sortData)
  //     if (sortData.length < 50)
  //       return sortData;
  //     else if (sortData.length < this.commonService.rowspaerpage)
  //       length = sortData.length;
  //     else
  //       length = this.commonService.rowspaerpage;
  //     for (let i = 0; i < length; i++) {
  //       for (let j = 0; j < this.nvndCount.length; j++) {
  //         if (sortData[i]['dcName'] == this.nvndCount[j]['dcName']) {
  //           if (this.nvndCount[j]['count'])
  //             this.nvndCount[j]['count'] += 1;
  //           else
  //             this.nvndCount[j]['count'] = 1;
  //         }
  //       }
  //       res['data'][i] = sortData[i];
  //     }
  //     //  delete res['data']['dcName'];
  //     return res['data'];
  //   }
  //   catch (error) {
  //     console.log("error in handling nv merge case", error);
  //   }
  // }
  // handlePaginationForNVND(event) { // Handle pagination in NV-ND
  //   for (let i = 0; i < this.nvndCount.length; i++) {
  //     if (!this.nvPageIndex) {
  //       this.nvPageIndex = {};
  //       this.nvPageIndex[this.nvndCount[i].dcName] = {};
  //       if (this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo - 1])
  //         this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo] = { "limit": event.limit, "offset": this.nvndCount[i].count + this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo - 1]["offset"] };
  //       else
  //         this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo] = { "limit": event.limit, "offset": this.nvndCount[i].count };
  //     }
  //     else if (!this.nvPageIndex[this.nvndCount[i].dcName]) {
  //       this.nvPageIndex[this.nvndCount[i].dcName] = {};
  //       if (this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo - 1])
  //         this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo] = { "limit": event.limit, "offset": this.nvndCount[i].count + this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo - 1]["offset"] };
  //       else
  //         this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo] = { "limit": event.limit, "offset": this.nvndCount[i].count };
  //     }
  //     else if (!this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo]) {
  //       if (this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo - 1])
  //         this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo] = { "limit": event.limit, "offset": this.nvndCount[i].count + this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo - 1]["offset"] };
  //       else
  //         this.nvPageIndex[this.nvndCount[i].dcName][this.pageNo] = { "limit": event.limit, "offset": this.nvndCount[i].count };
  //     }
  //     else
  //       break;
  //   }
  // }

  sortDataInStartTime(event, tempData) {  //Sorting data
    //for interger type data type
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;
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
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return 1;
          } else if (b[temp].startsWith('<')) {
            return -1;
          }

          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return -1;
          } else if (b[temp].startsWith('<')) {
            return 1;
          }
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    return tempData;
  }
  waningPopup: boolean = false;
  showWarningMessgae() {
    this.waningPopup = true;
  }

  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.copyFlowpathLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  openDynamicLoggerReport(node) {
    console.log("node data for dynamic logging>>>>>>>**********", node);
  }
}
export interface FlowpathDataInterface {
  tierName: string;
  tierId: string;
  serverName: string;
  serverId: string;
  appName: string;
  appId: string;
  urlName: string;
  urlIndex: string;
  flowpathInstance: string;
  prevFlowpathInstance: string;
  startTime: string;
  fpDuration: string;
  methodsCount: string;
  urlQueryParamStr: string;
  statusCode: string;
  callOutCount: string;
  threadId: string;
  btCatagory: string;
  correlationId: any;
  btCpuTime: string;
  startTimeInMs: string;
  id: number;
  orderId: string;
  totalError: string;
  nvSessionId: string;
  ndSessionId: string;
  nvPageId: string;
  dbCallCounts: string;
  coherenceCallOut: string;
  jmsCallOut: string;
  threadName: string;
  flowpathtype: string;
  selfResponseTime: String;
  totalCpuTime: String;
  ParentFlowpathInstance: String;
  backendMaxDur: String;
  gcPause: String;
  dynamicLoggingFlag: String;
  applicationName;
}

