import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonServices } from '../../services/common.services'
import { HttpClient } from '@angular/common/http';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment-timezone';
//import * as jQuery from 'jquery';
//declare var jQuery: any;
// import * as jQuery from 'jquery';
import * as Highcharts from 'highcharts/highcharts.src';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { SelectItem } from '../../interfaces/selectitem';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import { DdrAggFlowmapService } from './../../services/ddr-agg-flowmap.service';

@Component({
  selector: 'app-ddr-bt-trend',
  templateUrl: './ddr-bt-trend.component.html',
  styleUrls: ['./ddr-bt-trend.component.css']
})
export class DdrBtTrendComponent implements OnInit {
  highcharts = Highcharts;
  resOptions: Object;
  errOptions: Object;
  cpsOptions: Object;
  options1: Object;
  options2: Object;
  options3: Object;
  ipData = [];
  location = [];
  protocol = '';
  serverIP = '';
  port = '';
  dcName = '';
  testRun = '';
  strGraphKey = '';
  id;
  offset = 0;
  limit = 10;
  sessionLoginName = 'Cavisson';
  vectorName = '';
  btCategory = 'extbt';
  lastIndex = '';
  isPrevious = false;
  getData = false;
  critical = null;
  major = null;
  btName = '';
  health = '';
  isCompare = false;
  strCGraphKey = null;
  graphTime = 'Last 1 hour';
  nonZeroIP = true;
  isAll = null;
  flowmapName = 'default';
  actualBackendName = 'NA';
  rt = '-1.0';
  rtt = '-1';
  tps = '-1.0';
  tpst = '-1'
  es = '-1.0';
  est = '-1';
  tierFilter: string = "";
  tierToolTip: String = "";

  healthList: SelectItem[] = [];
  compareList: SelectItem[] = [];
  txtFilterBt: string = '';
  selectedResponseTime = 0;
  txtFilterResponseTime: any;
  selectedTps = 0
  txtFilterTps: any;
  selectedError = 0;
  txtFilterError: number;
  selectedHealth = ''
  cols = [];
  dialogheight: number;
  dialogwidth: number;
  urlParam: any
  displayFilterDialog: boolean = false;
  graphTab: boolean = true;
  selectedRowInfo: any;
  startTime: any;
  endTime: any;
  fullJson: any;
  showBtGraphs: boolean = false;
  headerFilter: string = '';
  BtStatHeader: string = '';
  serverOffset;
  eventDateMap: Object;
  selectedValue;
  specialDay = 'NA';
  timeLabel = '';
  appliedTimeLabel: string;
  strStartDate = '00/00/00 00:00:00';
  strEndDate = '00/00/00 23:59:59';
  endSeconds: string;
  endMinutes: string;
  endHours: string;
  startSeconds: string;
  startMinutes: string;
  startHours: string;
  currDateTime: any;
  startTimetoPass: any;
  timeFilterOptions: SelectItem[];
  eventFilterOptions: SelectItem[];
  display = false;
  timePeriodForCompare: any;
  timeCompareList: SelectItem[] = [];
  selectedCompareTime: any;
  selectedValues: boolean = false;
  tableHeight: string = '150px';
  showCustomDataIcon: boolean = false;
  customOptions = [];
  showCustomDialog: boolean = false;

  displayAutoInst: boolean = false;
  agentType: string;
  argsForAIDDSetting: any[];
  showAutoInstrPopUp: boolean = false;

  vectorArray = [];
  serverName: string = "";
  instanceName: string = "";
  isInstanceCase: boolean = false;
  marginForFilter: number = 48;
  startDate: string;
  endDate: string;
  showGraph = true;
  customFilterDisplay = false;
  totalCount = 0;
  showPagination: boolean = true;
  timeZone = '';
  showCompare: boolean = false;
  compareAppliedStrattime: any;
  compareAppliedEndtime: any;
  vecId: any;
  screenHeight: any;
  // selectedCheckBoxValue:string = 'true';
  popupHealthIcon: string;
  subscription: Subscription;
  colorThemes: String[] = window['arrColorddr'] || ['#3A99D9', '#F1C330', '#7CB5EC', '#434348'];
  customDataOtionsArr = [];

  tierName = "";
  ndeInfoData: any;
  ndeCurrentInfo: any;
  dcProtocol: string = '//';
  host = '';
  dcPort = '';
  dcList: SelectItem[];
  selectedDC;
  showDCMenu = false;
  BtRequestType = 2; //keyword for request (byDefault request = 2 for post)
  isCustomDataSelected: boolean;
  enableAggFlowmap = 1;
  startIndexForAgg: number = 0;
  lastIndexForAgg: number = 1000;
  dialogForTierMerge: boolean = false;
  loading: boolean = false;
  showDownLoadReportIcon = true;
  strTitle: any;
  downloadFilterCriteria = '';
  cacheId: string;

  // bgColorThemes: String[] = window['bgColorddr'] || ['rgba(255,255,255,0.2)', 'rgba(0,0,0,0)'];
  constructor(
    public commonService: CommonServices,
    private http: HttpClient,
    private _changeDetection: ChangeDetectorRef,
    private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService,
    public _ddrData: DdrDataModelService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: DdrBreadcrumbService,
    private ddrRequest: DDRRequestService,
    private _DdrAggFlowmapService: DdrAggFlowmapService
  ) {
  }

  setInCommonService(trun) {
    if (trun)
      this.commonService.testRun = trun;
  }
  ngOnInit() {
    console.log("param in ngonit from ddrdata model==== ", this._ddrData.btTrendParamFromStoreView);
    // console.log("this._router.url ------ " , this._router.url);
    if (this._ddrData.btTrendParamFromStoreView == undefined) {
      this.id = this.commonService.getData();
      this.testRun = this.id.testRun;
      this.setInCommonService(this.id.testRun);
    }
    this.commonService.isToLoadSideBar = false;
    // this._changeDetection.detectChanges();
    this.screenHeight = Number(this.commonService.screenHeight) - 130;
    this._ddrData.ddrThemeChangeUIObservable$.subscribe(() => {
      console.log("inside ddr chart bt trend");
      this.colorThemes = window['arrColorddr'] || ['#3A99D9', '#F1C330', '#7CB5EC', '#434348'];
      console.log("this.commonService.btTrendRowData--", this.commonService.btTrendRowData);
      setTimeout(() => {
        console.log('time out bt trend')
        this.showGraphWithInfo(this.commonService.btTrendRowData);
      }, 1000);
      //  this.showGraphWithInfo(this.commonService.btTrendRowData) ;
    });
    if (this._router.url.indexOf('/home/ddr/DdrBtTrendComponent') != -1 || this._ddrData.btTrendParamFromStoreView != undefined) {
      this.urlParam = this._ddrData.btTrendParamFromStoreView;
      this.commonService.testRun = this._ddrData.btTrendParamFromStoreView.testRun;
      console.log("urlParam from Store View ***** ", this.urlParam);
      if (this.urlParam && !this.urlParam.product.startsWith("/"))
        this.urlParam.product = "/" + this.urlParam.product;
      if (this.urlParam != undefined) {
        // set multiDC variables 
        // changes for bugid-74294 
        //        if (this.urlParam.dcNameList && this.urlParam.dcNameList != 'undefined') {
        this.commonService.dcNameList = this.urlParam.dcNameList;
        this.commonService.selectedDC = this.urlParam.dcName;
        this.commonService.isAllCase = this.urlParam.isAll;
        this.commonService.tierNameList = this.urlParam.tierNameList;
        sessionStorage.setItem("dcNameList", this.urlParam.dcNameList);
        sessionStorage.setItem("tierNameList", this.urlParam.tierNameList)
        sessionStorage.setItem("isAllCase", this.urlParam.isAll);
        //      }
        this.commonService.enableQueryCaching = this.urlParam.enableQueryCaching;

        let tiersListSize = this.urlParam.tierNameList.split(",");
        console.log("tiersListSize ***** ", tiersListSize);
        let num = 10 / (tiersListSize.length);
        console.log("num **** ", num, " , after round off **** ", Math.round(num));
        if (Math.round(num) == 0) {
          this.limit = tiersListSize.length * 2;
          //console.log("this.limit if ******** ", this.limit);
        }
        else {
          this.limit = 10;
          //console.log("this.limit else ******* ", this.limit);
        }
      }
      this.setInCommonService(this.urlParam.testRun);
    }
    else {
      if (this.commonService.paramsForBtTrend != undefined) {
        this.strGraphKey = this.urlParam.strGraphKey;
        this.urlParam = this.commonService.paramsForBtTrend;
      }
      else {
        console.log("yaha ayaa", this.urlParam,)
        this.urlParam = this.commonService.getData();
        this.urlParam.vectorName = sessionStorage.getItem('vectorName');
      }
      this.setInCommonService(this.urlParam.testRun);
    }
    this.createDropdownList();

    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.BTTREND);

    this.location = location.href.split('/');
    this.protocol = this.location[0].split(':')[0];
    //  this.serverIP = '10.10.50.15';
    //  this.port = '4432';

    //    this.testRun = this.id.testRun;
    if (this.id != undefined) {
      if (this.id.strGraphKey != undefined) {
        this.strGraphKey = this.id.strGraphKey;
      }
    } else {
      if (this.urlParam.strGraphKey != undefined) {
        this.strGraphKey = this.urlParam.strGraphKey;
      }
    }
    this.serverIP = this.location[2].split(':')[0];
    if (this.protocol == 'http')
      this.port = this.location[2].split(':')[1] || '80';
    if (this.protocol == 'https')
      this.port = this.location[2].split(':')[1] || '443';

    console.log("port ******** ", this.port);
    console.log(this.location);
    if (this.urlParam.btCategory !== 'extbt') {
      this.tableHeight = 'auto';
    }
    this.fillData();
    this.dialogheight = screen.height - 30;
    this.dialogwidth = screen.width - 30;
    this.getVectorIds();
    this.customOptions = this.getCustomDataOptions();
  }

  /**
   * To get the Custom Data options for DDR
   */
  getCustomDataOptions() {
    let options: any;
    let protocol = location.protocol;
    let restDrillDownUrl1 = "";
    if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL') {
      protocol = this._ddrData.protocol + ":";
    }
    restDrillDownUrl1 = this.getHostUrl() + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/config/customDataOptions';
    this.ddrRequest.getDataInStringUsingGet(restDrillDownUrl1).subscribe(
      data => {
        this.assignCustomData(data);
      });
    return options;
  }

  assignCustomData(data: any) {
    // console.log('response---', response);
    let optn = data.split(',');
    console.log('options-------', optn);
    for (let k = 0; k < optn.length; k++) {
      this.customDataOtionsArr.push({ id: optn[k], modal: '', label: optn[k] });
    }
  }

  getVectorIds() {
    console.log("vector Array === ", this.vectorArray, " , vector array length == ", this.vectorArray.length);
    let urlObj = {};
    if (this.vectorArray.length > 1) {
      if (this.commonService.BtRequestType == 2) {
        //let vecArr = this.urlParam.vectorName.split('>');
        this.displayAutoInst = true;
        urlObj = {
          srOperName: 'getTSAname',
          testRun: this.commonService.testRun,
          tierName: this.vectorArray[0],
          serverName: this.vectorArray[1],
          appName: this.vectorArray[2]
        }
        let urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
        return this.ddrRequest.getDataInStringUsingPost(urlForid, urlObj).subscribe(data => {
          this.getAgentInfo(data)
        })
      } else {
        let urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + this.vectorArray[0] + "&serverName=" + this.vectorArray[1] + "&appName=" + this.vectorArray[2];
        return this.ddrRequest.getDataInStringUsingGet(urlForid).subscribe(data => {
          this.getAgentInfo(data)
        });
      }
    } else {
      this.displayAutoInst = false;
    }
  }

  getAgentInfo(res: any) {
    console.log("res ==== ", res);
    this.vecId = this.getIdFortier(res);
    // key = appName_tierId_serverId_appId

    let url = this.getHostUrl() + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/getAgent?testRun=" + this.commonService.testRun +
      "&tierId=" + this.vecId[0].trim() + "&serverId=" + this.vecId[1].trim() + "&appId=" + this.vecId[2].trim();

    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      console.log("data for Agent = ", data);
      this.agentType = data;
    });
  }

  openAutoInstDialog(rowData: any) {
    let testRunStatus;
    let instanceType;
    let url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.commonService.testRun;
    console.log('url *** ', url);
    this.ddrRequest.getDataUsingGet(url).subscribe(resp => {
      let res = <any>resp;
      console.log("data for tr status === ", res);
      testRunStatus = res.data;
      //console.log("status ****** " , testRunStatus[0].status);
      if (testRunStatus.length != 0) {
        this.showAutoInstrPopUp = true;
        if (this.agentType.toLowerCase() == 'java')
          instanceType = 'Java';
        else if (this.agentType.toLowerCase() == 'dotnet')
          instanceType = 'DotNet';

        this.argsForAIDDSetting = [this.vectorArray[2], this.vecId[2], instanceType, this.vectorArray[0], this.vectorArray[1], this.vecId[1],
          '-1', rowData.bt, 'DDR', testRunStatus[0].status, this.commonService.testRun];
      }
      else {
        this.showAutoInstrPopUp = false;
        alert("Could not start instrumentation, test is not running");
        return;
      }
    });
  }

  startInstrumentation(result) {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog) {
    this.showAutoInstrPopUp = isCloseAIDDDialog;
  }

  createDropdownList() {
    this.healthList.push({ 'label': '-select-', value: '' });
    this.healthList.push({ 'label': 'Critical', value: 'critical' });
    this.healthList.push({ 'label': 'Major', value: 'major' });
    this.healthList.push({ 'label': 'Normal', value: 'normal' });

    this.compareList.push({ label: '>', value: '0' });
    this.compareList.push({ label: '<', value: '1' });
    this.compareList.push({ label: '=', value: '2' });
  }

  fillData() {
    console.log('bt category', this.urlParam);
    console.log('bt category', this.urlParam.btCategory);
    if (this.urlParam.btCategory == "extbt") {
      this.cols = [
        { id: "0", header: "Action", field: "action", toolTip: "Action Links", width: 30, alignment: 'left' },
        { id: "bt", header: "Business Transaction", field: "bt", sortable: true, width: 46, alignment: 'left' },
        { id: "health", header: "Health", field: "health", cssClass: "cell-center", headerCssClass: "cell-center", width: 15, alignment: 'left' },
        { id: "res", header: "Response Time(ms)", field: "res", sortable: 'custom', cssClass: "cell-right", headerCssClass: "cell-right", width: 40, alignment: 'right' },
        { id: "chart1", header: "Response Time Trend", field: "chart1", sortable: false, width: 63, rerenderOnResize: true },
        { id: "oPct", header: "BT (%)", field: "oPct", sortable: 'custom', cssClass: "cell-right", headerCssClass: "cell-right", width: 20, alignment: 'right' },
        { id: "calls", header: "Total Count", field: "calls", sortable: 'custom', cssClass: "cell-right", headerCssClass: "cell-right", width: 30, alignment: 'right' },
        { id: "cps", header: "TPS", field: "cps", sortable: 'custom', cssClass: "cell-right", headerCssClass: "cell-right", width: 18, alignment: 'right' },
        { id: "chart2", header: "TPS Trend", width: 70, field: "chart2", },
        { id: "eps", header: "Errors/Sec", field: "eps", sortable: 'custom', cssClass: "cell-right", headerCssClass: "cell-right", width: 35, alignment: 'right' },
        { id: "chart3", field: "chart3", header: "Error/Sec Trend", width: 70 },
        { id: "tier", field: "tier", header: "Tier", width: 35 }

      ]
    }
    else if (this.urlParam.btCategory == "VerySlow") {
      this.cols = [
        { header: "Action", field: "action", width: 30 },
        { header: "Very Slow Business Transaction", field: "bt", sortable: true, width: 40 },
        { header: "Very Slow Count", field: "count", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Total Count", field: "totalCount", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Very Slow Percentage(%)", field: "percentage", width: 30, alignment: 'right', sortable: 'custom' },
        { header: "Very Slow Min(ms)", field: "min", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Very Slow Max(ms)", field: "max", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Average", field: "avg", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Tier", field: "tier", width: 20, sortable: true },
      ]
    }
    else if (this.urlParam.btCategory == "Normal") {
      this.cols = [
        { header: "Action", field: "action", width: 30 },
        { header: "Normal Business Transaction", field: "bt", sortable: true, width: 40 },
        { header: "Normal Count", field: "count", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Total Count", field: "totalCount", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Normal Percentage(%)", field: "percentage", width: 25, alignment: 'right', sortable: 'custom' },
        { header: "Normal Min(ms)", field: "min", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Normal Max(ms)", field: "max", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Average", field: "avg", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Tier", field: "tier", width: 20, sortable: true },

      ]
    }
    else if (this.urlParam.btCategory == "Slow") {
      this.cols = [
        { header: "Action", field: "action", width: 30 },
        { header: "Slow Business Transaction", field: "bt", sortable: true, width: 40 },
        { header: "Slow Count", field: "count", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Total Count", field: "totalCount", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Slow Percentage(%)", field: "percentage", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Slow Min(ms)", field: "min", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Slow Max(ms)", field: "max", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Average", field: "avg", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Tier", field: "tier", width: 20, sortable: true },

      ]
    }
    else if (this.urlParam.btCategory == "Errors") {
      this.cols = [
        { header: "Action", field: "action", width: 30 },
        { header: "Error Business Transaction", field: "bt", sortable: true, width: 40 },
        { header: "Error Count", field: "count", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Total Count", field: "totalCount", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Error Percentage(%)", field: "percentage", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Error Min(ms)", field: "min", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Error Max(ms)", field: "max", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Average", field: "avg", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Tier", field: "tier", width: 20, sortable: true },

      ]
    }
    else if (this.urlParam.btCategory == "All") {
      this.cols = [
        { header: "Action", field: "action", width: 30 },
        { header: "Business Transaction", field: "bt", sortable: true, width: 40 },
        { header: "Overall Count", field: "totalCount", width: 15, alignment: 'right', sortable: 'custom' },
        { header: "BT(%)", field: "oPct", width: 15, alignment: 'right', sortable: 'custom' },
        { header: "Overall TPS", field: "totalTPS", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Overall Avg(ms)", field: "totalAvg", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Normal Count", field: "normalCount", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Normal Pct(%)", field: "normalPct", width: 18, sortable: true },
        { header: "Normal Avg", field: "normalAvg", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Slow Count", field: "slowCount", width: 15, alignment: 'right', sortable: 'custom' },
        { header: "Slow Pct(%)", field: "slowPct", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Slow Avg(ms)", field: "slowAvg", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Very Slow Count", field: "vslowCount", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Very Slow Pct(%)", field: "vslowPct", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Very Slow Avg(ms)", field: "vslowAvg", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Error Count", field: "errorCount", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Error Pct(%)", field: "errorPct", width: 18, alignment: 'right', sortable: 'custom' },
        { header: "Error Avg(ms)", field: "errorAvg", width: 20, alignment: 'right', sortable: 'custom' },
        { header: "Tier", field: "tier", width: 20, sortable: 'custom' },

      ]
    }
    if (this.isInstanceCase) {
      this.cols.splice(this.cols.length - 1, 1);
      this.cols.push({ header: "Instance", field: "instance", width: 25, sortable: 'custom' })
    }
    this.updateDateTime();
    if (this.commonService.dcNameList) {
      this.getDCData();
    } else {
      this.getIPData();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      //this.commonService.testRun = '';
      this.commonService.selectedDC = '';
      this.setInCommonService(this.urlParam.testRun || this.id.testRun);
    }
    this.setTestRunInHeader();
  }
  isIncDisGraph: boolean = true;

  getIPData() {
    let url;
    this.getAggKeywordData();
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      console.log("********** if***********  , location **** ", this.location);
      this.showDCMenu = false;
      // this.serverIP = this.location[2].split(':')[0];
      // if (this.protocol == 'http')
      //   this.port = this.location[2].split(':')[1] || '80';
      // if (this.protocol == 'https')
      //   this.port = this.location[2].split(':')[1] || '443';

      // let newIpPort = this.getHostUrl().split(":");
      // console.log("newIpPort ****** ", newIpPort);
      // if (newIpPort[1] == "")
      //   url = this.getHostUrl() + this.port + "/";
      // else
      url = this.getHostUrl();
    } else {
      this.dcProtocol = this.commonService.protocol;

      if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
      this.serverIP = this.commonService.host;
      if (this.commonService.protocol)
        this.dcProtocol = this.commonService.protocol;
      if (this.dcProtocol.indexOf("https") != -1) {
        this.protocol = 'https';
      } else
        this.protocol = 'http';

      this.port = this.commonService.port;
    }

    if (this.showCustomDialogforCompare) {
      this.showCustomDialogforCompare = false;
      this.showCompare = true;
    }
    this.commonService.loaderForDdr = true;

    if (url.endsWith("/")) {

      url += this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/iphealth';
    }
    else {
      url += "/" + this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/iphealth';
    }



    let protocolForObj = "";
    let testRunForObj = "";
    let portForObj = "";
    let serverIPforObj = "";
    if (sessionStorage.getItem("isMultiDCMode") === "true") {
      protocolForObj = this._ddrData.protocol;
      testRunForObj = this._ddrData.testRun;
      portForObj = this._ddrData.port;
      serverIPforObj = this._ddrData.host;
      let dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;
      this.getVectorNamesForDC(dcName);

    } else {
      protocolForObj = this.protocol;
      testRunForObj = this.commonService.testRun;
      portForObj = this.port
      serverIPforObj = this.serverIP;
    }
    if (this.commonService.enableQueryCaching == 1) {
      this.cacheId = testRunForObj;
    } else {
      this.cacheId = undefined;
    }

    if (this.commonService.BtRequestType == 2) {
      var obj = {

        testRun: testRunForObj,
        protocol: protocolForObj,
        port: portForObj,
        serverIP: serverIPforObj,
        btCategory: this.urlParam.btCategory,
        strGraphKey: this.strGraphKey,
        strCGraphKey: this.strCGraphKey,
        graphTime: this.graphTime,
        critical: this.critical,
        major: this.major,
        isCompare: this.isCompare,
        isAll: this.isAll,
        backendActualName: this.actualBackendName,
        dcName: this.dcName,
        flowmapName: this.urlParam.flowmapName,
        nonZeroIP: this.nonZeroIP,
        btName: this.urlParam.btName,
        sesLoginName: this.sessionLoginName,
        offSet: this.offset,
        limit: this.limit,
        vecName: this.urlParam.vectorName,
        lastIndex: this.lastIndex,
        isPrevious: this.isPrevious,
        getData: this.getData,
        health: this.health,
        rt: this.rt,
        rtt: this.rtt,
        tps: this.tps,
        tpst: this.tpst,
        es: this.es,
        est: this.est,
        isIncDisGraph: this.urlParam.strIncDisGraph,
        cacheId: this.cacheId
      };
      if (this.showCustomDialogforCompare) {
        this.showCustomDialogforCompare = false;
        this.showCompare = true;
      }
      console.log('after making url=====', this.strGraphKey);
      console.log('url For ajax', url);


      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL') {
        if (url.startsWith("http") && url.includes(":"))
          url = url.substring(url.indexOf(":") + 1);
        if (url.startsWith("//"))
          url = this._ddrData.protocol + ":" + url;
        else
          url = this._ddrData.protocol + "://" + url;
      }

      this.ddrRequest.getDataInStringUsingPost(url, obj).subscribe(data => {
        this.assignData(data);
      },
        error => {
          this.commonService.loaderForDdr = false;
        });
    }
    else {

      url += '?testRun=' + this.commonService.testRun + '&protocol=' + protocolForObj + '&port=' + this.port + '&serverIP=' + this.serverIP + '&btCategory=' + this.urlParam.btCategory + '&strGraphKey=' + this.strGraphKey +
        '&strCGraphKey=' + this.strCGraphKey + '&graphTime=' + this.graphTime + '&critical=' + this.critical + '&major=' + this.major + '&isCompare='
        + this.isCompare + '&isAll=' + this.isAll + '&backendActualName=' + this.actualBackendName + '&dcName=' + this.dcName + '&flowmapName=' +
        this.urlParam.flowmapName + '&nonZeroIP=' + this.nonZeroIP + '&btName=' + this.btName + '&sesLoginName=' + this.sessionLoginName + '&offSet=' +
        this.offset + '&limit=' + this.limit + '&vecName=' + this.urlParam.vectorName + '&lastIndex=' + this.lastIndex + '&isPrevious=' +
        this.isPrevious + '&getData=' + this.getData + '&health=' + this.health + '&rt=' + this.rt + '&rtt=' + this.rtt + '&tps=' + this.tps +
        '&tpst=' + this.tpst + '&es=' + this.es + '&est=' + this.est + '&isIncDisGraph=' + this.urlParam.strIncDisGraph + '&cacheId=' + this.cacheId;

      this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
        this.assignData(data);
      },
        error => {
          this.commonService.loaderForDdr = false;
        });
    }
  }

  isTotalTestRun: boolean = true;

  assignData(res) {
    console.log('res data in btTrend', res);
    try {
      let data;
      try {
        data = JSON.parse(res.split('%%%')[0]);
      }
      catch (error) {
        this.commonService.loaderForDdr = false;
        console.error("error while parsing response data ", error);
      }

      let dataArray = res.split('%%%');
      if (!dataArray[2])
        this.commonService.loaderForDdr = false;

      this.serverOffset = dataArray[2];
      this.eventDateMap = JSON.parse(dataArray[3]);
      this.timeLabel = dataArray[4];
      this.appliedTimeLabel = this.timeLabel.split(":")[1];
      this.timeZone = dataArray[6];

      this.marginForFilter = this.timeLabel.length;
      this.totalCount = data.count;
      this.createHeaderFilter();


      this.fullJson = JSON.parse(JSON.stringify(data));
      this.startTimetoPass = this.fullJson.startTimeStamp;
      if (dataArray[5] != '') {
        this.showCustomDataIcon = true;
        this.customOptions = dataArray[5].split(',')
      }
      this.commonService.loaderForDdr = false;
      var applieTimeKey = this.strGraphKey;
      if (this.urlParam.btCategory == 'extbt') {
        this.ipData = data.extRowData;
        if (data.extRowData.length == 0) {
          this.showPagination = false;
        }
        else {
          this.showPagination = true;
        }

        //this.fullJson = JSON.parse(JSON.stringify(data));
        if (this.ipData.length == 0) {
          this.displayFilterDialog = false;
          this.showDownLoadReportIcon = false;
          this.showBtGraphs = false;
          if (this.fullJson.startTimeStamp != 0) {
            this.startTime = moment(this.fullJson.startTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.createHeaderFilter();
          }
          return;
        }
        this.showDownLoadReportIcon = true;
        this.showBtGraphs = true;
        console.log("data.extRowData[0]--", data.extRowData[0]);
        this.showGraphWithInfo(data.extRowData[0])
        this.displayFilterDialog = false;
        if (this.fullJson.startTimeStamp != 0 && this.selectedValue != 'Custom Date') {
          if (applieTimeKey.toLowerCase().includes("minutes")) {
            let timeInMin = applieTimeKey.split("_")[1];
            this.startTimetoPass = (Number(this.fullJson.endTimeStamp) - Number(timeInMin) * 60 * 1000);
            this.startTime = moment(this.startTimetoPass).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
          }
          else {
            this.startTimetoPass = this.fullJson.startTimeStamp;
            this.startTime = moment(this.fullJson.startTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
          }
        }
        this.showBtCompare();
      }
      else if (this.urlParam.btCategory == 'All') {
        // console.log('rjgfh', data);
        let val = data.allrowdata;
        if (data.allrowdata.length == 0) {
          this.showPagination = false;
        }

        val.forEach((val) => {
          if (val.errorAvg) {
            val.errorAvg = val.errorAvg.toLocaleString();
          }
          if (val.errorCount) {
            val.errorCount = val.errorCount.toLocaleString();
          }
          if (val.normalAvg) {
            val.normalAvg = val.normalAvg.toLocaleString();
          }
          if (val.normalCount) {
            val.normalCount = val.normalCount.toLocaleString();
          }
          if (val.slowAvg) {
            val.slowAvg = val.slowAvg.toLocaleString();
          }
          if (val.slowCount) {
            val.slowCount = val.slowCount.toLocaleString();
          }
          if (val.totalAvg) {
            val.totalAvg = val.totalAvg.toLocaleString();
          }
          if (val.totalCount) {
            val.totalCount = val.totalCount.toLocaleString();
          }
          if (val.totalTPS) {
            val.totalTPS = val.totalTPS.toLocaleString();
          }
          if (val.vslowAvg) {
            val.vslowAvg = val.vslowAvg.toLocaleString();
          }
          if (val.vslowCount) {
            val.vslowCount = val.vslowCount.toLocaleString();
          }
        })
        if (!this.fullJson.timeZone) {
          this.fullJson.timeZone = 'Asia/Kolkata';
        }
        //this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
        //this.startTime = moment(this.fullJson.startTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
        if (this.fullJson.startTimeStamp != 0 && this.selectedValue != 'Custom Date') {
          //var applieTimeKey = this.strGraphKey;
          if (applieTimeKey.toLowerCase().includes("minutes")) {
            let timeInMin = applieTimeKey.split("_")[1];
            this.startTimetoPass = (Number(this.fullJson.endTimeStamp) - Number(timeInMin) * 60 * 1000);
            this.startTime = moment(this.startTimetoPass).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
          }
          else {
            this.startTimetoPass = this.fullJson.startTimeStamp;
            this.startTime = moment(this.fullJson.startTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
          }
        }
        this.ipData = val;
      }
      else {
        //console.log('res for ajax', res)
        //console.log('rjgfh', data);
        this.ipData = data.data;
        if (this.ipData.length == 0) {
          this.showPagination = false;
        }
        console.log('ip data', this.ipData)
        if (this.ipData.length == 0) {
          this.displayFilterDialog = false
          return;
        }
        this.showBtGraphs = false;
        this.displayFilterDialog = false;
        //this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
        //this.startTime = moment(this.fullJson.startTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
        // this.selectedRowInfo = this.ipData[0];
        if (this.fullJson.startTimeStamp != 0 && this.selectedValue != 'Custom Date') {
          //var applieTimeKey = this.strGraphKey;
          if (applieTimeKey.toLowerCase().includes("minutes")) {
            let timeInMin = applieTimeKey.split("_")[1];
            this.startTimetoPass = (Number(this.fullJson.endTimeStamp) - Number(timeInMin) * 60 * 1000);
            this.startTime = moment(this.startTimetoPass).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
          }
          else {
            this.startTimetoPass = this.fullJson.startTimeStamp;
            this.startTime = moment(this.fullJson.startTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
            this.endTime = moment(this.fullJson.endTimeStamp).tz(this.timeZone).format("MM/DD/YY HH:mm:ss");
          }
        }
      }
      //  this.highlighttheRow();
      this.createHeaderFilter();
    }
    catch (error) {
      console.error("Error is fetching data ", error);
      this.commonService.loaderForDdr = false;
    }

  }

  getVectorNamesForDC(dcName) {
    try {
      return new Promise((resolve, reject) => {
        var vectorNameList = "";
        var allTierDClistArr;
        var temp;
        console.log('this.urlParamFromStoreView.tierNameList====>', this.urlParam.tierNameList);
        if (this.urlParam.tierNameList && this.urlParam.tierNameList.toString().indexOf(",") !== -1) {
          allTierDClistArr = this.urlParam.tierNameList.split(",");
          for (var i = 0; i < allTierDClistArr.length; i++) {
            if (allTierDClistArr[i].startsWith(dcName)) {
              temp = (allTierDClistArr[i]).substring(dcName.length + 1);
              vectorNameList += temp + ",";
            }
          }

          console.log("after removing dcName from vectorNames ***** " + vectorNameList);

          if (vectorNameList)
            this.urlParam.vectorName = vectorNameList;

          console.log('vectorName=====>', this.urlParam.vectorName);
        }
      });
    }
    catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getDCData() {
    let url = this.getHostUrl() + '/' + this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.urlParam.testRun;
    //this.http.get(url).map(res => res.json()).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(resp => {
      let data = <any>resp;
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
    if (this._ddrData.btTrendParamFromStoreView) {
      data = [{ "displayName": this._ddrData.btTrendParamFromStoreView.dcName, "ndeId": 1, "ndeIPAddr": this._ddrData.btTrendParamFromStoreView.host, "ndeTomcatPort": this._ddrData.btTrendParamFromStoreView.port, "ndeCtrlrName": "", "pubicIP": this._ddrData.btTrendParamFromStoreView.host, "publicPort": this._ddrData.btTrendParamFromStoreView.port, "isCurrent": 1, "ndeTestRun": this._ddrData.btTrendParamFromStoreView.testRun, "ndeProtocol": this._ddrData.btTrendParamFromStoreView.protocol }];
    }
    else if (this.urlParam.dcName) {
      let testRun = this.urlParam.testRun || this.commonService.testRun;
      data = [{ "displayName": this.urlParam.dcName, "ndeId": 1, "ndeIPAddr": this.urlParam.dcIP, "ndeTomcatPort": this.urlParam.dcPort, "ndeCtrlrName": "", "pubicIP": this.urlParam.dcIP, "publicPort": this.urlParam.dcPort, "isCurrent": 1, "ndeTestRun": testRun, "ndeProtocol": location.protocol.replace(":", "") }];
    }
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
    // this.getTierNamesForDC(this.selectedDC).then(() => {
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.commonService.dcNameList == this.ndeInfoData[i].displayName) {

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.protocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.commonService.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.commonService.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.protocol;
        this.commonService.testRun = this.testRun;
        if (this.selectedDC == this.ndeInfoData[i].displayName)
          this.ndeCurrentInfo = this.ndeInfoData[i];
        console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.commonService.loaderForDdr = true;
      this.getIPData();
    })
  }


  getTierNamesForDC(dcName) {
    try {
      return new Promise<void>((resolve, reject) => {
        console.log('getting tiername');
        var tierList = "";
        var allTierDClistArr;
        var temp;
        console.log('this.commonService.tierNameList====>', this.commonService.tierNameList);
        if (this.commonService.tierNameList && this.commonService.tierNameList.toString().indexOf(",") !== -1) {
          allTierDClistArr = this.commonService.tierNameList.split(",");
          for (var i = 0; i < allTierDClistArr.length; i++) {
            if (allTierDClistArr[i].startsWith(dcName)) {
              temp = (allTierDClistArr[i]).substring(dcName.length + 1);
              tierList += temp + ",";
            }
          }

          console.log("after removing dcName from tirList ***** " + tierList);
          if (tierList == "")
            tierList = this.commonService.tierNameList;

          if (tierList)
            this.tierName = tierList;

          let selectedDCTiersArr = tierList.substring(0, tierList.length - 1).split(",");
          console.log("selectedDCTiersArr length **** ", selectedDCTiersArr.length);

          // let tiersListSize = this.urlParam.tierNameList.split(",");
          // console.log("tiersListSize ***** " , allTierDClistArr);

          let num = 10 / (selectedDCTiersArr.length);
          console.log("num **** ", num, " , after round off **** ", Math.round(num));
          if (Math.round(num) == 0) {
            this.limit = selectedDCTiersArr.length * 2;
            //console.log("this.limit if case ******** ", this.limit);
          }
          else {
            this.limit = 10;
            //console.log("this.limit else case ******* ", this.limit);
          }

          this.urlParam.vectorName = this.tierName;
        }
        else {
          if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
            temp = (this.commonService.tierNameList).substring(dcName.length + 1);
            tierList = temp;
            tierList = tierList.substring(0, tierList.length);
            if (tierList != "") {
              this.tierName = tierList;
              this.urlParam.vectorName = tierList;
            }
          } else {
            this.tierName = this.commonService.tierNameList;
            this.urlParam.vectorName = this.commonService.tierNameList;
          }
        }
        console.log('tierName=====>', this.tierName);
        this.getTieridforTierName(this.tierName).then(() => { console.log("******then aaa "); resolve() });

      });
    }
    catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getNDEInfo(res) {
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
        console.log("esle case")
        if (this.ndeInfoData[i].isCurrent == 1 && dcName.indexOf(this.ndeInfoData[i].displayName) != -1) {
          this.selectedDC = this.ndeInfoData[i].displayName;
          isFirst = true;
          console.log("Else case this selected dc ", this.selectedDC);
        } else if (i == (this.ndeInfoData.length - 1) && !isFirst)
          this.selectedDC = this.dcList[0];
        console.log("else if case isFirst false ", this.selectedDC);
      }
      if (dcName.length <= this.ndeInfoData.length && this.selectedDC == this.ndeInfoData[i].displayName) {
        this.ndeCurrentInfo = this.ndeInfoData[i];
        console.log("if length case  ", this.selectedDC);
      }
    }
    this.getSelectedDC();
  }

  getTieridforTierName(tierName) {
    return new Promise<void>((resolve, reject) => {
      // console.log('reached here');
      var url = '';
      var urlObj = {};
      if (this.ndeCurrentInfo != undefined && this.ndeCurrentInfo != null && this.ndeCurrentInfo != '') {
        if (this.ndeCurrentInfo.ndeProtocol != undefined && this.ndeCurrentInfo.ndeProtocol != null && this.ndeCurrentInfo.ndeProtocol != '') {
          let protocol = this.ndeCurrentInfo.ndeProtocol;
          if (protocol.endsWith(":"))
            protocol = protocol.replace(":", "");

          url = protocol + '://' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          console.log("url in iffff caseeeeeee", url);
        } else {
          url = '//' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          console.log("urllll in else case of ifffffff", url);
        }
      }
      else {
        url = this.getHostUrl();
        console.log("urllllll in else caseeeeee", url);
      }

      if (this.commonService.BtRequestType == 2) {
        url += '/' + this.urlParam.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp";

        urlObj = {
          strOperName: 'getTSAname',
          testRun: this.commonService.testRun,
          tierName: tierName
        };

        this.ddrRequest.getDataInStringUsingPost(url, urlObj).subscribe(data => {
          this.assignTierID(data);
          console.log("getTieridforTierNamegetTieridforTierNamegetTieridforTierName ");
          resolve();
        });
      } else {
        url += '/' + this.urlParam.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + tierName;
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
          this.assignTierID(data);
          console.log("getTieridforTierNamegetTierid ");
          resolve();
        });
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
      console.log("calling from dcMenu select case ", $event.value);
    }
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      console.log("this.selectedDC ", this.selectedDC);
      if (this.selectedDC == this.ndeInfoData[i].displayName) {

        this.ndeCurrentInfo = this.ndeInfoData[i];

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.dcProtocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.commonService.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.commonService.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.dcPort = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.dcPort;
        this.commonService.protocol = this.dcProtocol;
        this.commonService.testRun = this.testRun;
        this.commonService.selectedDC = this.selectedDC;
        console.log('commonservece variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.commonService.isToLoadSideBar = false;
      this.getIPData();
    })
  }

  changeCompare() {
    console.log('this.seke', this.selectedValues, this.timeLabel)
    if (this.timeLabel == 'Time Period : Total Test Run') {
      this.isTotalTestRun = true;
      console.log('is it coming her');
    }
    else {
      this.isTotalTestRun = false;
    }

    if (this.selectedValues) {
      this.isCompare = true;
    }
    else {
      this.isCompare = false;
      this.showCompare = false;
      this.isTotalTestRun = true;
      this.selectedCompareTime = null;
      this.getIPData();
    }
  }
  showBtCompare() {
    // if (this.isCompare) {
    //   this.selectedValues = true;
    // }
    this.timePeriodForCompare = this.timeLabel.substring(14, this.timeLabel.length);
    this.timeCompareList = [];
    if (this.timePeriodForCompare == "Today" || this.timePeriodForCompare == "Total Test Run") {
      //this.timeCompareList.push({ label: "Specified Time", value: "Compare Custom Date" });
    }
    else if (this.timePeriodForCompare == "Custom Date") {
      // this.timeCompareList.push({ label: "Specified Time", value: "Compare Custom Date" });
    }
    else if (this.timePeriodForCompare != "Today" || this.timePeriodForCompare != "Total Test Run") {
      this.timeCompareList.push({ label: this.timePeriodForCompare, value: this.timePeriodForCompare });
      this.timeCompareList.push({ label: "Specified Time", value: "Compare Custom Date" });
      // this.timeCompareList.push({ label: "Specified Time", value: "Compare Custom Date" });
    }
  }
  showCustomDialogforCompare: boolean = false;
  getCompareData() {
    if (this.selectedCompareTime.startsWith('Last')) {
      this.graphTime = this.selectedCompareTime;
      this.strCGraphKey = null;
      this.isCompare = true;
      this.showCompare = false;
      this.getIPData();
    }
    else if (this.selectedCompareTime.startsWith('Compare')) {
      this.showCustomDialogforCompare = true;
      //this.showCompare= true;
    }
  }


  applyBTCompare() {
    // var decodeString = '<%=decodedQueryString%>&strGraphKey=<%=strGraphKey%>'+"&isCompare="+isCompare;
    // var pageName = 'rptBusinessTransaction.jsp?'+decodeString;
    // var selectedValue ='<%=GraphTimeWindowUtils.getGraphTimeLabel(strGraphKey, specialDay)%>';
    // selectedValue=(selectedValue.substring(14,selectedValue.length)).trim();
    //   if(document.getElementById('compareTime').value == "Compare Custom Date")
    // {
    //  changeCompareTime("Compare Custom Date");
    // }
    //   else if(document.getElementById('compareTime').value == "Select")
    // {
    //   jQuery('#showSelectedTime').fadeIn('slow');
    //   jQuery('#showSelectedTime').html("&nbsp;&nbsp;Please select value to compare ");
    //   jQuery('#showSelectedTime').fadeOut('slow');
    // }
    //   else if(selectedValue.startsWith('Yesterday') || selectedValue.startsWith('Last Week Same Day') || selectedValue.startsWith('Event Day'))
    // {
    //     window.location.href = pageName + "&strStarDate=<%=strStarDate%>&strEndDate=<%=strEndDate%>&strGraphTime=<%=graphTime%>&strSpecialDay=<%=specialDay%>";
    // }
    //   else if(selectedValue.startsWith('Last'))
    // {
    //      window.location.href =  pageName  + "&strGraphTime=" + selectedValue;
    // }
  }
  changeCompareTime(val) {
    //openPopUpForOthers(true);
    this.openDateFilterOnEventDay(val);

    if (val == 'Compare Custom Date')
      jQuery("#timePeriodLbl").hide();
  }

  createHeaderFilter() {

    this.downloadFilterCriteria = '';
    this.headerFilter = "";
    let dcName = "";
    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
      //dcName = this.selectedDC;
      this.headerFilter = " DC= " + this.selectedDC;
      this.downloadFilterCriteria = this.headerFilter;
    } else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      let dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;
      this.headerFilter = " DC= " + dcName + ',';
      this.downloadFilterCriteria = this.headerFilter;
    }

    if (this.urlParam.tierNameList.length > 45) {
      this.tierFilter = "";
      this.tierToolTip = "";
      let tierAfterSub = this.urlParam.tierNameList.substring(0, 45) + "...";
      console.log("vector name in filter criteria **** ", this.urlParam.tierNameList);
      this.tierToolTip = this.urlParam.tierNameList;
      this.tierFilter = "Tier=" + tierAfterSub;
    }
    else
      this.headerFilter += "Tier=" + this.urlParam.tierNameList;

    if (this.isInstanceCase) {
      this.headerFilter += ", " + "Server=" + this.urlParam.serverName;
      this.headerFilter += ", " + "Instance=" + this.urlParam.instanceName;
    }

    if (this.urlParam.serverName && this.urlParam.appName) {
      this.headerFilter += ", " + "Server=" + this.urlParam.serverName;
      this.headerFilter += ", " + "Instance=" + this.urlParam.appName;
    }

    if (this.startTime != undefined && this.endTime != undefined) {
      this.headerFilter += ", " + "Start Date/Time=" + this.startTime;
      this.headerFilter += ", " + "End Date/Time=" + this.endTime;
    }

    if (this.urlParam.btCategory == 'All' || this.urlParam.btCategory == 'extbt') {
      this.headerFilter += ", " + "BT Type=All";
    }
    else {
      this.headerFilter += ", " + "BT Type=" + this.urlParam.btCategory;
    }

    if (this.urlParam.btName) {
      this.headerFilter += ", " + "BT Name=" + this.urlParam.btName;
    }

    this.downloadFilterCriteria += this.headerFilter;
    if (this.headerFilter.endsWith(',')) {
      this.headerFilter = this.headerFilter.substring(0, this.headerFilter.length - 1);
    }

  }

  // onRowSelect(event){
  //   let data =[];
  //   data[0] = event.data;
  //   this.commonService.selectedRowInfoOfBtTrend =  data[0];
  //   console.log('tan tana tan tan tan tara',this.commonService.selectedRowInfoOfBtTrend,this.selectedRowInfo)

  // }
  // highlighttheRow(){
  //   setTimeout(() =>{
  //     this.selectedRowInfo = [];
  //     this.selectedRowInfo = this.commonService.selectedRowInfoOfBtTrend;
  //     console.log('behtreen',this.commonService.selectedRowInfoOfBtTrend,this.selectedRowInfo)
  //    },300) 
  // }

  createChartData(node) {
    if (!node) {
      return [];
    }
    let seriesArray = new Array();
    let callArray = new Array();
    let errArray = new Array();

    for (let i = 0; i < node.length; i++) {
      let dataArray = new Array();
      dataArray.push(this.fullJson.tsArray[i]);
      dataArray.push(node[i]);
      seriesArray.push(dataArray);
    }

    return seriesArray;
  }
  createCompareChartData(node) {
    console.log('ll', node)
    if (!this.isCompare) {
      return [];
    }
    var strCSeriesData = JSON.stringify(node);

    //Plotting Compare Data
    if ("\"[undefined]\"" != strCSeriesData) {
      // node = JSON.parse(node);
      var cseriesArray = new Array();
      for (var i = 0; i < node.length; i++) {
        var dataArray = new Array();
        dataArray.push(this.fullJson.ctsArray[i]);
        dataArray.push(node[i]);
        cseriesArray.push(dataArray);
      }

      return cseriesArray;

    }
  }
  count = 0;
  countCps = 0
  countEps = 0
  onClickshowGraphWithInfo(event) {
    console.log("evenrt --", event);
    let node = event.data;
    this.showGraphWithInfo(node);
  }
  showGraphWithInfo(node) {
    console.log("node data for chart--", node)
    if (node != undefined && node != "undefined") {
      this.commonService.btTrendRowData = node;
    }
    this.selectedRowInfo = node;
    this.graphTab = true;
    let rowData = this.fullJson;
    let resseriesOptions = [];
    let callseriesOptions = [];
    let errseriesOptions = [];
    this.BtStatHeader = "BT Stats - " + node.bt;
    resseriesOptions.push({ 'type': 'line', 'data': this.createChartData(node.resData) });
    callseriesOptions.push({ 'type': 'line', 'data': this.createChartData(node.callData) });
    errseriesOptions.push({ 'type': 'line', 'data': this.createChartData(node.errorData) });

    if (this.selectedCompareTime) {
      resseriesOptions.push({ 'type': 'line', 'data': this.createCompareChartData(node.cResData), 'xAxis': 1, 'color': this.colorThemes[2] });
      callseriesOptions.push({ 'type': 'line', 'data': this.createCompareChartData(node.cCallData), 'xAxis': 1, 'color': this.colorThemes[2] });
      errseriesOptions.push({ 'type': 'line', 'data': this.createCompareChartData(node.cErrorData), 'xAxis': 1, 'color': this.colorThemes[2] });
    }
    console.log(resseriesOptions, callseriesOptions, errseriesOptions);
    let that = this;
    var xAxisObj = [];
    this.count = 0
    this.countCps = 0;
    this.countEps = 0;

    xAxisObj = [{
      type: 'time',
      labels: {
        formatter: function () {
          return moment.tz(this.value,
            rowData.timeZone).format(
              "HH:mm:ss");
        },
        style: {
          fontSize: '10px'
        }
      }
    }];
    if (this.selectedCompareTime) {
      xAxisObj.push({
        type: 'time',
        opposite: true,
        labels: {
          formatter: function () {
            return moment.tz(this.value,
              rowData.timeZone).format(
                "HH:mm:ss");
          },
          style: {
            fontSize: '10px'
          }
        },
        tickInterval: 100
      });
    }

    this.options1 = {
      chart: {
        height: 200,
        width: 290,
        responsive: true,
        zoomType: 'x',
        backgroundColor: 'transparent',
        style: {
          fontFamily: "'Roboto', sans-serif"
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          color: this.colorThemes[1]
        }
      },
      title: {
        text: 'Response Time (ms)',
        style: {
          fontSize: '12px',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: '500',
          color: this.colorThemes[3]
        }
      },
      tooltip: {
        formatter: function () {
          return '<b>Time: </b>'
            + moment.tz(this.x,
              rowData.timeZone).format(
                "MM/DD/YY HH:mm:ss")
            + '<br/ ><b>Value: ' + '</b>'
            + this.y;
        }
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: '500',
          fontSize: '10px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function labelFormatterFun() {
          return that.formatterForResponse(node)
        }
      },
      exporting: {
        enabled: false
      },
      xAxis: xAxisObj,
      yAxis: {
        title: {
          text: null,
        },
      },
      series: resseriesOptions

    };

    this.options2 = {
      chart: {
        height: 200,
        width: 290,
        responsive: true,
        zoomType: 'x',
        backgroundColor: 'transparent',
        style: {
          fontFamily: "'Roboto', sans-serif"
        }
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'TPS',
        style: {
          fontSize: '12px',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: '500',
          color: this.colorThemes[3]
        }
      },
      tooltip: {
        formatter: function () {
          return '<b>Time: </b>'
            + moment.tz(this.x,
              rowData.timeZone).format(
                "MM/DD/YY HH:mm:ss")
            + '<br/ ><b>Value: ' + '</b>'
            + this.y;
        }
      },
      plotOptions: {
        series: {
          color: this.colorThemes[1]
        }
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: '500',
          fontSize: '10px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function labelFormatterFun() {
          return that.formatterForCps(node)

        }
      },
      exporting: {
        enabled: false
      },
      xAxis: xAxisObj,
      yAxis: {
        title: {
          text: null,
        },
      },
      series: callseriesOptions
    };

    this.options3 = {
      chart: {
        height: 200,
        width: 290,
        reponsive: true,
        zoomType: 'x',
        backgroundColor: 'transparent',
        style: {
          fontFamily: "'Roboto', sans-serif"
        }
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Error/Sec',
        style: {
          fontSize: '12px',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: '500',
          color: this.colorThemes[3]
        }
      },
      plotOptions: {
        series: {
          color: this.colorThemes[1]
        }
      },
      xAxis: xAxisObj,
      yAxis: {
        title: {
          text: null,
        },
      },
      tooltip: {
        formatter: function () {
          return '<b>Time: </b>'
            + moment.tz(this.x,
              rowData.timeZone).format(
                "MM/DD/YY HH:mm:ss")
            + '<br/ ><b>Value: ' + '</b>'
            + this.y;
        }
      },
      exporting: {
        enabled: false
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: '500',
          fontSize: '10px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function labelFormatterFun() {
          return that.formatterForEps(node)

        }
      },
      series: errseriesOptions
    };
    setTimeout(() => {
      this.getPieChart('piechartid', node.normalPct, node.slowPct, node.vslowPct, node.errorPct);
    }, 200)
  }
  formatterForResponse(resseriesOptions) {
    // console.log('count',this.count,resseriesOptions.epsMax,resseriesOptions.eps,resseriesOptions.cEpsMax,resseriesOptions.cEps)
    if (this.count == 0) {
      this.count++;
      return " Max : "
        + Number(resseriesOptions.resMax).toFixed(1)
        + "    Avg : "
        + Number(resseriesOptions.res).toFixed(1)
        + " ";
    }
    else {
      return " Max : "
        + Number(resseriesOptions.cResMax).toFixed(1)
        + "    Avg : "
        + Number(resseriesOptions.cRes).toFixed(1)
        + " ";
    }
  }
  formatterForCps(resseriesOptions) {
    //console.log('count',this.countCps,resseriesOptions.epsMax,resseriesOptions.eps,resseriesOptions.cEpsMax,resseriesOptions.cEps)
    if (this.countCps == 0) {
      this.countCps++;
      return " Max : "
        + Number(resseriesOptions.cpsMax).toFixed(1)
        + "    Avg : "
        + Number(resseriesOptions.cps).toFixed(1)
        + " ";
    }
    else {
      return " Max : "
        + Number(resseriesOptions.cCpsMax).toFixed(1)
        + "    Avg : "
        + Number(resseriesOptions.cCps).toFixed(1)
        + " ";
    }
  }
  formatterForEps(resseriesOptions) {
    //  console.log('count',this.countEps,resseriesOptions.epsMax,resseriesOptions.eps,resseriesOptions.cEpsMax,resseriesOptions.cEps)
    if (this.countEps == 0) {
      this.countEps++;
      return " Max : "
        + Number(resseriesOptions.epsMax).toFixed(1)
        + "    Avg : "
        + Number(resseriesOptions.eps).toFixed(1)
        + " ";
    }
    else {
      return " Max : "
        + Number(resseriesOptions.cEpsMax).toFixed(1)
        + "    Avg : "
        + Number(resseriesOptions.cEps).toFixed(1)
        + " ";
    }
  }

  // btChart1;
  // btChart2;
  // btChart3;

  // showBtGraph(node) {
  //   console.log(node);

  //   console.log(this.fullJson);
  //   let rowData = this.fullJson;

  //   let resArray = this.createChartData(node.resData);
  //   let callArray = this.createChartData(node.callData);
  //   let errArray = this.createChartData(node.errorData);

  //   // let reslabelFormatter = this.labelFormatterFun('chart1',node);
  //   // let calllabelFormatter = this.labelFormatterFun('chart2',node);
  //   // let errlabelFormatter = this.labelFormatterFun('chart3',node);


  //   // for (let i = 0; i < node.resData.length; i++) {
  //   //   let dataArray = new Array();
  //   //   dataArray.push(rowData.tsArray[i]);
  //   //   dataArray.push(node.resData[i]);
  //   //   resArray.push(dataArray);
  //   // }
  //   // for (let i = 0; i < node.callData.length; i++) {
  //   //   let dataArray = new Array();
  //   //   dataArray.push(rowData.tsArray[i]);
  //   //   dataArray.push(node.callData[i]);
  //   //   callArray.push(dataArray);
  //   // }
  //   // for (let i = 0; i < node.errorData.length; i++) {
  //   //   let dataArray = new Array();
  //   //   dataArray.push(rowData.tsArray[i]);
  //   //   dataArray.push(node.errorData[i]);
  //   //   errArray.push(dataArray);
  //   // }


  //   this.btChart1 = {
  //     chart: {
  //       height: 200,
  //       width: 200,
  //       responsive: true
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: 'Response Time (ms)',
  //       style: {
  //         fontSize: '15px'
  //       }
  //     },
  //     tooltip: {
  //       formatter: function () {
  //         return '<b>Time: </b>'
  //           + moment.tz(this.x,
  //             rowData.timeZone).format(
  //             "MM/DD/YY HH:mm:ss")
  //           + '<br/ ><b>Value: ' + '</b>'
  //           + this.y;
  //       }
  //     },
  //     legend: {
  //       itemStyle: {
  //         color: 'rgb(29, 181, 18)',
  //         fontWeight: 'bold',
  //         fontSize: '10px'
  //       },
  //       itemHoverStyle: {
  //         color: 'rgb(29, 220, 20)'
  //       },
  //       itemDistance: 5,
  //       padding: 0,
  //       margin: 0,
  //       labelFormatter: function labelFormatterFun() {

  //         return " Max : "
  //           + Number(node.resMax).toFixed(1)
  //           + "    Avg : "
  //           + Number(node.res).toFixed(1)
  //           + " ";

  //       }
  //     },
  //     xAxis: {
  //       type: 'time',
  //       labels: {
  //         formatter: function () {
  //           return moment.tz(this.value,
  //             rowData.timeZone).format(
  //             "HH:mm:ss");
  //         },
  //         style: {
  //           fontSize: '10px'
  //         }
  //       },
  //       allowDecimals: false
  //     },
  //     yAxis: {
  //       title: {
  //         text: null,
  //       },
  //     },
  //     series: [
  //       {
  //         type: 'line',
  //         data: resArray
  //       }
  //     ]

  //   };

  //   this.btChart2 = {
  //     chart: {
  //       height: 200,
  //       width: 400
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: 'CPS',
  //       style: {
  //         fontSize: '15px'
  //       }
  //     },
  //     xAxis: {
  //       type: 'time',
  //       labels: {
  //         formatter: function () {
  //           return moment.tz(this.value,
  //             rowData.timeZone).format(
  //             "HH:mm:ss");
  //         },
  //         style: {
  //           fontSize: '10px'
  //         }
  //       },
  //       allowDecimals: false
  //     },
  //     yAxis: {
  //       title: {
  //         text: null,
  //       },
  //     },
  //     tooltip: {
  //       formatter: function () {
  //         return '<b>Time: </b>'
  //           + moment.tz(this.x,
  //             rowData.timeZone).format(
  //             "MM/DD/YY HH:mm:ss")
  //           + '<br/ ><b>Value: ' + '</b>'
  //           + this.y;
  //       }
  //     },
  //     legend: {
  //       itemStyle: {
  //         color: 'rgb(29, 181, 18)',
  //         fontWeight: 'bold',
  //         fontSize: '10px'
  //       },
  //       itemHoverStyle: {
  //         color: 'rgb(29, 220, 20)'
  //       },
  //       itemDistance: 5,
  //       padding: 0,
  //       margin: 0,
  //       labelFormatter: function labelFormatterFun() {

  //         return " Max : "
  //           + Number(node.cpsMax).toFixed(1)
  //           + "    Avg : "
  //           + Number(node.cps).toFixed(1)
  //           + " ";

  //       }
  //     },
  //     series: [
  //       {
  //         type: 'line',
  //         data: callArray
  //       }
  //     ]

  //   };

  //   this.btChart3 = {
  //     chart: {
  //       height: 200,
  //       width: 400
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: 'Error/Sec',
  //       style: {
  //         fontSize: '15px'
  //       }
  //     },
  //     xAxis: {
  //       type: 'time',
  //       labels: {
  //         formatter: function () {
  //           return moment.tz(this.value,
  //             rowData.timeZone).format(
  //             "HH:mm:ss");
  //         },
  //         style: {
  //           fontSize: '10px'
  //         }
  //       },
  //       allowDecimals: false
  //     },
  //     yAxis: {
  //       title: {
  //         text: null,
  //       },
  //     },
  //     tooltip: {
  //       formatter: function () {
  //         return '<b>Time: </b>'
  //           + moment.tz(this.x,
  //             rowData.timeZone).format(
  //             "MM/DD/YY HH:mm:ss")
  //           + '<br/ ><b>Value: ' + '</b>'
  //           + this.y;
  //       }
  //     },
  //     legend: {
  //       itemStyle: {
  //         color: 'rgb(29, 181, 18)',
  //         fontWeight: 'bold',
  //         fontSize: '10px'
  //       },
  //       itemHoverStyle: {
  //         color: 'rgb(29, 220, 20)'
  //       },
  //       itemDistance: 5,
  //       padding: 0,
  //       margin: 0,
  //       labelFormatter: function labelFormatterFun() {

  //         return " Max : "
  //           + Number(node.epsMax).toFixed(1)
  //           + "    Avg : "
  //           + Number(node.eps).toFixed(1)
  //           + " ";

  //       }
  //     },
  //     series: [
  //       {
  //         type: 'line',
  //         data: errArray
  //       }
  //     ]

  //   };
  // }

  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName = this._ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL') {
      //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      this.urlParam.testRun = this._ddrData.testRun;
      this.testRun = this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.urlParam.testRun);
    }
    //  else if (this._navService.getDCNameForScreen("flowpath") === undefined)
    //     hostDcName = this._cavConfig.getINSPrefix();
    //   else
    //     hostDcName = this._cavConfig.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");

    //   if (hostDcName.length > 0) {
    //     sessionStorage.removeItem("hostDcName");
    //     sessionStorage.setItem("hostDcName", hostDcName);
    //   }
    //   else
    //     hostDcName = sessionStorage.getItem("hostDcName");

    //  if(this._ddrData.protocol)
    //       sessionStorage.setItem("protocol",this._ddrData.protocol);
    //     else
    //       sessionStorage.setItem("protocol",location.protocol.replace(":",""));

    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  displayBtStatsDialog: boolean = false
  openBTTrendPopup(rowData) {
    console.log('fffffffff', rowData);
    this.displayBtStatsDialog = true;
    this.loading = true;
    setTimeout(() => {
      var filterTitle = this.getFilterTitle(rowData.bt, rowData.health, rowData.res, rowData.calls, rowData.tps, rowData.eps,
        rowData.tier, rowData.server, rowData.instance, rowData.normalCount, rowData.normalAvg, rowData.normalPct,
        rowData.slowCount, rowData.slowAvg, rowData.slowPct, rowData.vslowCount, rowData.vslowAvg, rowData.vslowPct,
        rowData.errorCount, rowData.errorAvg, rowData.errorPct);
      document.getElementById('pieTable').innerHTML = filterTitle;
      // jQuery("#upperDiv").html(filterTitle);
      this.addlistenerTotable(rowData);
    }, 4000);
    // this.showBTGraphs('popupchart1', JSON.parse(resData), "[undefined]", timeZone,
    //   "Response Time (ms)", indx);
    // this.showBTGraphs('popupchart2', JSON.parse(callData), "[undefined]", timeZone,
    //   "TPS", indx);
    // this.showBTGraphs('popupchart3', JSON.parse(errorData), "[undefined]", timeZone,
    //   "Errors/Sec", indx);
    // this.showBtGraph(rowData);



  }
  addlistenerTotable(rowData) {

    let that = this;
    let arr = ['normal', 'slow', 'veryslow', 'error', 'total'];
    let elm = [];
    for (let i = 0; i <= 4; i++) {
      elm[i] = document.getElementById(arr[i]);
    }

    if (elm[0] !== null && elm[0] != undefined) {
      elm[0].addEventListener("click", () => {
        console.log('callong', 'lis')
        that.openTransactionTracingForSpecific(rowData.tier, rowData.server, (rowData.app || rowData.instance), rowData.bt, 'Normal')
      });
    }
    if (elm[1] !== null && elm[1] != undefined) {
      console.log('callong', 'lis1')
      elm[1].addEventListener("click", () => {
        console.log('callong', 'lis2')
        that.openTransactionTracingForSpecific(rowData.tier, rowData.server, (rowData.app || rowData.instance), rowData.bt, 'Slow')
      });
    }
    if (elm[2] !== null && elm[2] != undefined) {
      elm[2].addEventListener("click", () => {
        that.openTransactionTracingForSpecific(rowData.tier, rowData.server, (rowData.app || rowData.instance), rowData.bt, 'VerySlow')
      });
    }
    if (elm[3] !== null && elm[3] != undefined) {
      elm[3].addEventListener("click", () => {
        that.openTransactionTracingForSpecific(rowData.tier, rowData.server, (rowData.app || rowData.instance), rowData.bt, 'Errors')
      });
    }
    if (elm[4] !== null && elm[4] != undefined) {
      console.log('callong', 'lis4')
      elm[4].addEventListener("click", () => {
        console.log('callong', 'lis4')
        that.openTransactionTracingForSpecific(rowData.tier, rowData.server, (rowData.app || rowData.instance), rowData.bt, 'all')
      });
    }
  }

  getPieChart(id, normalPct, slowPct, vslowPct, errorPct) {
    console.log('valures', normalPct, slowPct)
    var colorArray = Array();

    var piechartArray = new Array();
    piechartArray[0] = new Array(3);
    piechartArray[0][0] = "Normal";
    piechartArray[0][1] = parseFloat(normalPct);
    piechartArray[0][2] = "#50B432";

    piechartArray[1] = new Array(3);
    piechartArray[1][0] = "Slow";
    piechartArray[1][1] = parseFloat(slowPct);
    piechartArray[1][2] = "#330066";

    piechartArray[2] = new Array(3);
    piechartArray[2][0] = "Very Slow";
    piechartArray[2][1] = parseFloat(vslowPct);
    piechartArray[2][2] = "#FF6600";

    piechartArray[3] = new Array(3);
    piechartArray[3][0] = "Error";
    piechartArray[3][1] = parseFloat(errorPct);
    piechartArray[3][2] = "#F00";
    console.log(piechartArray);

    for (var i = 0; i < piechartArray.length; i++) {
      colorArray[i] = piechartArray[i][2];
    }
    Highcharts.setOptions({
      colors: colorArray
    });
    console.log(jQuery, "hh");
    console.log("this.colorThemes inside pie---", this.colorThemes[3]);
    var chart = new Highcharts.Chart({

      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      chart: {
        //alignTicks: false,
        // type: 'piechart',
        renderTo: 'piechartid',
        backgroundColor: null,
        height: 200,
        // width : 200,
        style: {
          fontFamily: "'Roboto', sans-serif"
        }
      },
      title: {
        text: null,
        style: {
          color: "#000",
          fontSize: '11px',
          fontWeight: '500',
          fontFamily: "'Roboto', sans-serif"
        }
      },
      tooltip: {

        formatter: function () {
          console.log("point--", this.point['name']);
          return " BT Category  : <b>" + this.point['name']
            + "</b> <br></br>Percentage : <b>"
            + this.point.y + "</b>";
        }

      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: 100,
          dataLabels: {
            enabled: true,
            style: {

              fontWeight: '500',
              fontSize: '12px',
              textShadow: false,
              textOutline: false + '',
              color: this.colorThemes[3] + ''

            },
            format: '<b style = "fontWeight:500;">{point.name}</b>: {point.y} %'
          },
          shadow: false,
        }
      },
      series: [{
        type: 'pie',
        name: "BT Category",
        data: piechartArray,
      }]
    });
  }

  getFilterTitle(bt, health, resp, calls, tps, eps, tier, server,
    instance, normalCount, normalAvg, normalPct, slowCount, slowAvg,
    slowPct, vslowCount, vslowAvg, vslowPct, errorCount, errorAvg,
    errorPct) {
    try {
      // this.popupHeader = "BT Category Stats" ;
      console.log('health for === ', health);
      this.popupHealthIcon = health;
      var htmlText = ''
      var htmlTextforflter = "<span title=" + bt + " style='font-size:11px;'><b>BT:  </b>";
      if (bt.length > 25) {
        var btsort = bt.substring(0, 22) + "..."
        htmlTextforflter += btsort;
        // htmlTextforflter += "<br>";
      } else {
        htmlTextforflter += bt;
      }
      if (server != undefined && instance != undefined)
        htmlTextforflter = + " <b>Tier:  </b>"
          + tier + "<b style='padding-left:3px;'> Server:  </b>"
          + server + "<b style='padding-left:3px;'>Instance:  </b>"
          + instance + "<b style='padding-left:3px;'> From: </b>"
          + this.startTime + "<b style='padding-left:3px;'> To: </b>"
          + this.endTime + "</span>";
      else
        htmlTextforflter += " <b>Tier:  </b>"
          + tier + "<b style='padding-left:3px;'> From: </b>"
          + this.startTime + "<b style='padding-left:3px;'> To: </b>"
          + this.endTime + "</span>";
      console.log("htmlTextforflter>>>>>>>", htmlTextforflter);

      // htmlText += "<br></br>";
      document.getElementById('filter').innerHTML = htmlTextforflter;
      htmlText += "<div style='display:table;'><div style='width:100% !important;float:right;margin-top: 10px;'><table width='100%' style='height:220px;width:440px' class='tableCurrent table-bordered table-striped table-hover'><thead><tr class='info headerImage' style='font-size:10px; white-space:nowrap;height: 38px;'><th style='text-align:left;font-size:12px'>BT Category</th><th style='text-align:right;font-size:12px'>Count</th><th style='text-align:right;font-size:12px'>Response Time (ms)</th><th style='text-align:right;font-size:12px'>Pct(%)</th></tr></thead><tbody >";

      if (Number(normalCount) != 0)
        htmlText += "<tr style='font-size:10px; white-space:nowrap;'><td sty>Normal</td><td style='text-align:right'><a style='text-align:right;color:blue;cursor:pointer' id='normal' title='View Flowpath'>"
          + Number(normalCount).toLocaleString()
          + "</a></td><td style='text-align:right'>"
          + Number(normalAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + normalPct
          + "</td></tr>";
      else
        htmlText += "<tr style='font-size:10px; white-space:nowrap;'><td>Normal</td><td style='text-align:right'>"
          + Number(normalCount).toLocaleString()
          + "</td><td style='text-align:right'>"
          + Number(normalAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + normalPct
          + "</td></tr>";

      if (Number(slowCount) != 0)
        htmlText += "<tr style='font-size:10px; white-space:nowrap;background-color:#f9f9f9;'><td>Slow</td><td style='text-align:right'><a id='slow' style='color:blue;cursor:pointer' title='View Flowpath'>"
          + Number(slowCount).toLocaleString()
          + "</a></td><td style='text-align:right'>"
          + Number(slowAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + slowPct
          + "</td></tr>";
      else
        htmlText += "<tr style='font-size:10px; white-space:nowrap;background-color:#f9f9f9;'><td>Slow</td><td style='text-align:right'>"
          + Number(slowCount).toLocaleString()
          + "</td><td style='text-align:right'>"
          + Number(slowAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + slowPct
          + "</td></tr>";

      if (Number(vslowCount) != 0)
        htmlText += "<tr style='font-size:10px; white-space:nowrap;'><td>Very Slow</td><td style='text-align:right'  ><a id='veryslow' title='View Flowpath' style='cursor:pointer;color:blue'>"
          + Number(vslowCount).toLocaleString()
          + "</a></td><td style='text-align:right'>"
          + Number(vslowAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + vslowPct
          + "</td></tr>";
      else
        htmlText += "<tr style='font-size:10px; white-space:nowrap;'><td>Very Slow</td><td style='text-align:right'>"
          + Number(vslowCount).toLocaleString()
          + "</td><td style='text-align:right'>"
          + Number(vslowAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + vslowPct
          + "</td></tr>";

      if (Number(errorCount) != 0)
        htmlText += "<tr style='font-size:10px; white-space:nowrap;background-color:#f9f9f9;'><td>Errors</td><td style='text-align:right' ><a id='error' title='View Flowpath'  style='cursor:pointer;color:blue'>"
          + Number(errorCount).toLocaleString()
          + "</a></td><td style='text-align:right'></a>"
          + Number(errorAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + errorPct
          + "</td></tr>";
      else
        htmlText += "<tr style='font-size:10px; white-space:nowrap;background-color:#f9f9f9;'><td>Errors</td><td style='text-align:right'>"
          + Number(errorCount).toLocaleString()
          + "</td><td style='text-align:right'>"
          + Number(errorAvg).toLocaleString()
          + "</td><td style='text-align:right'>"
          + errorPct
          + "</td></tr>";

      if (Number(calls) != 0)
        htmlText += "<tr class='tableHighLight' style='font-size:10px; font-weight: bold;'><td>Overall</td><td style='text-align:right' ><a id='total'style='color:blue;cursor:pointer' title='View Flowpath'>"
          + Number(calls).toLocaleString()
          + "</a></td><td style='text-align:right'>"
          + Number(resp).toLocaleString()
          + "</td><td style='text-align:right'>100</td></tr></tbody></table></div>";
      else
        htmlText += "<tr class='tableHighLight' style='font-size:10px; font-weight: bold;'><td>Overall</td><td style='text-align:right'>"
          + Number(calls).toLocaleString()
          + "</td><td style='text-align:right'>"
          + Number(resp).toLocaleString()
          + "</td><td style='text-align:right'>100</td></tr></tbody></table></div>";

      htmlText += "<div style='width:50%;max-height:170px;max-width:50%;float:left' id='piechartid' ></div></div>";
      this.loading = false;
      return htmlText;
    }
    catch (error) {
      this.loading = false;
      return "";
    }
  }
  capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  openFpReport(rowData, btName) {
    console.log('data require to open fp', rowData);
    this.commonService.isFilterFromSideBar = false;
    this._ddrData.IPByFPFlag = false;
    this._ddrData.cmdArgsFlag = false;
    let tierID = "NA";
    let serverID = "NA";
    let appID = "NA";
    let bt = 'NA'
    var urlIndex = "NA";
    if (this.urlParam.btCategory == 'All') {
      if (btName == 'totalCount') {
        bt = 'all';
      }
      if (btName == 'normalCount') {
        bt = 'Normal'
      }
      if (btName == 'slowCount') {
        bt = 'Slow'
      }
      if (btName == 'vslowCount') {

        bt = 'VerySlow'
      }
      if (btName == 'errorCount') {
        bt = 'Errors'
      }
    }
    else {
      if (btName == 'Total Count') {
        bt = 'all';
      }
      if (btName == 'Normal Count') {
        bt = 'Normal'
      }
      if (btName == 'Slow Count') {
        bt = 'Slow'
      }
      if (btName == 'Very Slow Count') {

        bt = 'VerySlow'
      }
      if (btName == 'Error Count') {
        bt = 'Errors'
      }
    }

    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL') {
        urlForid = this.getHostUrl();
      }
    } else {
      if (this.commonService.protocol.endsWith("://"))
        urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
        urlForid = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
    }

    if (this.commonService.BtRequestType == 2) {
      urlForid += this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp";
    } else {
      urlForid += this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + this.urlParam.vectorName + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance) + '&btName=' + rowData.bt;
    }

    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: this.urlParam.vectorName,
      serverName: rowData.server,
      appName: (rowData.app || rowData.instance),
      btName: rowData.bt
    };

    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(data => {
      console.log(data);
      var temp = this.getIdFortier(data)
      tierID = temp[0].trim();
      serverID = temp[1].trim();
      appID = temp[2].trim();
      urlIndex = temp[3];
      var btCategoryId = "";
      if (bt.toUpperCase() != "ALL")
        btCategoryId = this.getBTCategoryId(bt);

      var jsonstartTimeStamp = this.startTimetoPass;
      var jsonendTimeStamp = this.fullJson.endTimeStamp;
      var strGraphKey = this.strGraphKey;
      if (strGraphKey.toLowerCase() == "wholescenario") {
        jsonstartTimeStamp = "NA";
        jsonendTimeStamp = "NA";
      }
      this._ddrData.testRun = this.commonService.testRun;
      this._ddrData.tierName = rowData.tier;
      this._ddrData.serverName = rowData.server;
      this._ddrData.appName = rowData.instance;
      this._ddrData.startTime = jsonstartTimeStamp;
      this._ddrData.endTime = jsonendTimeStamp
      // this._ddrData.tierId = tierID;
      this._ddrData.vecArrForGraph = [];
      this._ddrData.urlName = rowData.bt;
      this._ddrData.urlIndex = urlIndex;
      // this._ddrData.btCategory =  rowData.bt;
      if (this.urlParam.product.toString().includes("/"))
        this._ddrData.product = this.urlParam.product.replace("/", "");
      else
        this._ddrData.product = this.urlParam.product;

      this._ddrData.btCategory = btCategoryId;
      this._ddrData.valueForCheckBox = 'true';
      this._ddrData.tierId = tierID;
      this._ddrData.serverId = serverID;
      this._ddrData.appId = appID;
      // if (this.vectorArray.length > 1) {
      //   this._ddrData.serverName = this.vectorArray[1];
      //   this._ddrData.appName = this.vectorArray[2];
      // }
      if (this.commonService.enableQueryCaching) {
        this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
      }
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
      this.commonService.removeAllComponentFromFlowpath();
      this._changeDetection.detectChanges();
      this._ddrData.isFromtrxFlow = false;
      this._ddrData.isFromtrxSideBar = false;
      this._ddrData.setInLogger('DDR::Bt Trend::Flowpath', 'Flowpath', 'Open Flowpath Report');
      this._router.navigate([this.getRoutePath() + '/flowpath'],{state: {btTrend: true}});
      // if (this.urlParam.btCategory != 'Errors') {
      //   this._router.navigate(['/home/ED-ddr/flowpath'])
      // }
      // else {
      //   this._ddrData.product = this.urlParam.product.replace("/","");
      //   console.log("id=====*******>", this.id)
      //   console.log("rowdataa=====*******>", rowData)   
      //   console.log('tierID>>',tierID,'serverID>>>>>',serverID,'appId>>>>>>',appID)         
      //   if (this.urlParam.product.toString().includes("/"))
      //     this.id.product = this.urlParam.product.replace("/", "");
      //   else
      //     this.id.product = this.urlParam.product;
      //   console.log("this.urlParam.product=========>", this._ddrData.product, '<=============>', this.id.product);
      //   this.id.testRun = this.commonService.testRun;
      //   this.id.tierid = tierID;
      //   this.id.serverid = serverID;
      //   this.id.appid = appID;
      //   this.id.backendNameQuery = rowData.actualBackendName;
      //   console.log("this.urlParam======--------->", this.urlParam)
      //   this.commonService.setInStorage = this.urlParam;
      //   this.commonService.expDataFromED = this.urlParam;
      //   this._router.navigate(['/home/ED-ddr/exception'])
      // }
      // this._router.navigate(['/home/ED-ddr/flowpath?testRun=5406&statusCode=-2&tierName=rowData.tier&serverName=NA&appName=NA&strGraphKey=Last_60_Minutes&startTime=1510894560000&endTime=1510895821000&tierId=1&serverId=NA&isAll=&tierNameList=Tier30&dcNameList=&dcName=&appId=NA&product=netstorm&strOrderBy=NA&resTimeFlagforCustomData=NA&searchByCustomDataOptions=NA&timeZoneId=Asia%2FKolkata&flowpathID=NA&customData=NA&correlationId=NA&btCategory=&urlName=NsecomAddToBag&isIntegratedFlowpath=false'])
      // var url = "//"+window.location.host+""+'<%=currPath%>'+"integration.jsp?strOprName=drilldownfromED&openFileName=openAdvanceFlowpath&testRun=" + this.testRun  + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance) + "&strGraphKey=" + this.strGraphKey + "&strStartTime=" + jsonstartTimeStamp + "&strEndTime=" + jsonendTimeStamp + "&tierId=" + tierID + "&serverId=" + serverID + "&appId=" + appID + "&product=" + '<%=currPath%>' + "&strOrderBy=NA&locationHost="+window.location.host  + "&dcName=" + '<%=dcName%>' + "&isAll=" + '<%=dcName%>' + "&dcNameList="+'<%=dcNameList%>' + "&tierNameList=" + '<%=tierName%>';
      // url +="&btCategory=" + bt+"&urlName="+ encodeURIComponent(rowData.bt);

      // if(bt=='Errors')
      //     url +="&statusCode=400";
      //   else
      //     url +="&statusCode="+'<%=statusCode%>';

      //  window.open(url,'drillDownReport');
    });
  }

  getBTCategoryId(btCategory) {
    var btType = "";
    if (btCategory == "Normal")
      btType = "10";
    else if (btCategory == "Slow")
      btType = "11";
    else if (btCategory == "VerySlow")
      btType = "12";
    else if (btCategory == "Errors")
      btType = "13";
    else if (btCategory == "Stalled")
      btType = "14";
    else if (btCategory == "Unknown")
      btType = "0";
    return btType;
  }
  getIdFortier(data) {
    return data.trim().split(":");
  }

  openPieWindow(rowData) {
    this.commonService.isFilterFromSideBar = false;
    var dcName = this.urlParam.dcName;
    var btCategory = this.urlParam.btCategory;
    var tierID = "NA";
    var serverID = "NA";
    var appID = "NA";
    var urlIndex = "NA";
    var strGraphKey = this.urlParam.strGraphKey;
    var jsonstartTimeStamp = this.startTimetoPass;
    var jsonendTimeStamp = this.fullJson.endTimeStamp;

    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
        urlForid = this.getHostUrl();

    } else {
      urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    }
    if (this.commonService.BtRequestType == 2) {
      // if(this._ddrData.protocol)
      //  urlForid = this._ddrData.protocol + "://" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
      // else
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
    } else {
      // if(this._ddrData.protocol)
      //  urlForid = this._ddrData.protocol + "://" +this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + rowData.instance + '&btName=' + rowData.bt;
      // else
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + rowData.instance + '&btName=' + rowData.bt;
    }
    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: rowData.tier,
      serverName: rowData.server,
      appName: rowData.instance,
      btName: rowData.bt
    };

    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(data => {
      console.log(data);
      var temp = this.getIdFortier(data)
      tierID = temp[0].trim();
      serverID = temp[1].trim();
      appID = temp[2].trim();
      urlIndex = temp[3];

      if (strGraphKey.toLowerCase() == "wholescenario") {
        jsonstartTimeStamp = "NA";
        jsonendTimeStamp = "NA";
      }

      if (btCategory != "All") {

        this._ddrData.btCategory = this.getBTId(btCategory);
      }
      this._ddrData.testRun = this.commonService.testRun;
      this._ddrData.tierName = rowData.tier;
      this._ddrData.serverName = rowData.server;
      this._ddrData.appName = rowData.instance;
      this._ddrData.startTime = jsonstartTimeStamp;
      this._ddrData.endTime = jsonendTimeStamp
      // this._ddrData.tierId = tierID;
      this._ddrData.vecArrForGraph = [];
      this._ddrData.urlName = rowData.bt;
      if (this.commonService.enableQueryCaching) {
        this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
      }

      if (this.urlParam.product.toString().includes("/"))
        this._ddrData.product = this.urlParam.product.replace("/", "");
      else
        this._ddrData.product = this.urlParam.product;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
      this._ddrData.setInLogger('DDR::Bt Trend::Method Timng', 'Method Timing', 'Open Method Timing Report');
      this._router.navigate([this.getRoutePath() + '/methodtiming']);

    });
  }

  openLogAndQuery(rowData) {
    this.commonService.isFilterFromSideBar = false;
    console.log("rowData---", rowData);
    var dcName = this.urlParam.dcName;
    var btCategory = this.urlParam.btCategory;
    var tierID = "NA";
    var serverID = "NA";
    var appID = "NA";
    var urlIndex = "NA";
    var strGraphKey = this.urlParam.strGraphKey;
    var jsonstartTimeStamp = this.startTimetoPass;
    var jsonendTimeStamp = this.fullJson.endTimeStamp;


    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
        urlForid = this.getHostUrl();

    } else {
      if (this.commonService.protocol.endsWith("://"))
        urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
        urlForid = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
    }
    if (this.commonService.BtRequestType == 2) {
      urlForid += this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
    } else {
      urlForid += this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance) + '&btName=' + rowData.bt;
    }

    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: rowData.tier,
      serverName: rowData.server,
      appName: (rowData.app || rowData.instance),
      btName: rowData.bt
    };
    //urlForid = "//" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + rowData.app+ '&btName='+ rowData.bt,
    //this.http.get(urlForid).subscribe(
    // this.http.post(urlForid,urlObj).subscribe(
    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(
      data => {
        console.log(data);
        var temp = this.getIdFortier(data)
        tierID = temp[0].trim();
        serverID = temp[1].trim();
        appID = temp[2].trim();
        urlIndex = temp[3];

        if (strGraphKey.toLowerCase() == "wholescenario") {
          jsonstartTimeStamp = "NA";
          jsonendTimeStamp = "NA";
        }

        //commenting this to not show bt type in db report 
        // if (btCategory != "All") {
        //   this._ddrData.btCategory = this.getBTId(btCategory);
        //   }
        this._ddrData.testRun = this.commonService.testRun;
        this._ddrData.tierName = rowData.tier;
        this._ddrData.startTime = jsonstartTimeStamp;
        this._ddrData.endTime = jsonendTimeStamp
        // this._ddrData.tierId = tierID;
        this._ddrData.vecArrForGraph = [];

        this._ddrData.urlName = rowData.bt;
        this._ddrData.urlIndex = urlIndex;
        if (this.commonService.enableQueryCaching) {
          this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
        }
        console.log("this._ddrData.urlIndex--", this._ddrData.urlIndex);

        if (this.urlParam.product.toString().includes("/"))
          this._ddrData.product = this.urlParam.product.replace("/", "");
        else
          this._ddrData.product = this.urlParam.product;
        this.commonService.isFromBTTrend = true;
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
        this._ddrData.setInLogger('DDR::Bt Trend::DB Queries', 'Db Queries', 'Open Db Queries Report ');
        this._router.navigate([this.getRoutePath() + '/dbReport']);
      });
  }

  openFPAnalyzer(rowData) {
    //console.log('rowdata and urlparam----------->', rowData, '****', this.testRun, '----', this.urlParam);
    var dcName = this.urlParam.dcName;
    var btCategory = this.urlParam.btCategory;
    var tierID = "NA";
    var serverID = "NA";
    var appID = "NA";
    var urlIndex = "NA";
    var strGraphKey = this.urlParam.strGraphKey;
    var jsonstartTimeStamp = this.startTimetoPass;
    var jsonendTimeStamp = this.fullJson.endTimeStamp;


    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
        urlForid = this.getHostUrl();

    } else {
      urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    }
    if (this.commonService.BtRequestType == 2) {
      //  if(this._ddrData.protocol) 
      //   urlForid = this._ddrData.protocol + "://" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
      //  else
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
    } else {
      // if(this._ddrData.protocol) 
      //  urlForid = this._ddrData.protocol + "://" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance)+ '&btName='+ rowData.bt;
      // else
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance) + '&btName=' + rowData.bt;
    }
    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: rowData.tier,
      serverName: rowData.server,
      appName: (rowData.app || rowData.instance),
      btName: rowData.bt
    }
    //urlForid = "//" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + rowData.app+ '&btName='+ rowData.bt,
    //this.http.get(urlForid).subscribe(
    // this.http.post(urlForid,urlObj).subscribe(

    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(
      data => {
        console.log(data);
        var temp = this.getIdFortier(data)
        tierID = temp[0].trim();
        serverID = temp[1].trim();
        appID = temp[2].trim();
        urlIndex = temp[3];

        if (strGraphKey.toLowerCase() == "wholescenario") {
          jsonstartTimeStamp = "NA";
          jsonendTimeStamp = "NA";
        }


        var btCategoryId = "";
        if (btCategory.toUpperCase() != "ALL")
          btCategoryId = this.getBTCategoryId(btCategory);

        let obj = {};
        obj['testRun'] = this.commonService.testRun;
        obj['tierName'] = this.urlParam.tierName;
        obj['startTime'] = jsonendTimeStamp
        obj['urlName'] = rowData.bt;
        obj['product'] = this.urlParam.product;
        obj['tierId'] = tierID;
        obj['serverId'] = serverID;
        obj['appId'] = appID;
        obj['btCatagory'] = btCategoryId;
        obj['urlIndex'] = urlIndex;
        obj['endTime'] = jsonendTimeStamp;
        obj['strGraphKey'] = strGraphKey;
        this.commonService.fpAnalyzeData = obj;
        this._ddrData.btCategory = btCategoryId;
        this._ddrData.testRun = this.commonService.testRun;
        this._ddrData.tierName = rowData.tier;
        this._ddrData.startTime = jsonstartTimeStamp;
        this._ddrData.endTime = jsonendTimeStamp;
        this._ddrData.strGraphKey = strGraphKey;
        this._ddrData.urlIndex = urlIndex;
        this._ddrData.tierId = tierID;
        // this._ddrData.tierId = tierID;
        this._ddrData.vecArrForGraph = [];
        this._ddrData.urlName = rowData.bt;
        if (this.commonService.enableQueryCaching) {
          this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
        }
        if (this.urlParam.product.toString().includes("/")) {
          this._ddrData.product = this.urlParam.product.replace("/", "");
        } else {
          this._ddrData.product = this.urlParam.product;
        }
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
        this._ddrData.setInLogger('DDR::Bt Trend::Flowpath Analyzer', 'Flowpath Analyzer', 'Open Flowpath Analyzer Report');
        this._router.navigate([this.getRoutePath() + '/flowpathAnalyzer']);
      });
  }

  //Getting the btcategory id from bt name
  getBTId(btName) {
    var btId = "10";
    if (btName == "Normal")
      btId = "10";
    else if (btName == "Slow")
      btId = "11";
    else if (btName == "VerySlow")
      btId = "12";
    else if (btName == "Errors")
      btId = "13";
    else if (btName == "Stalled")
      btId = "14";
    return btId;
  }
  openTransactionTracingForSpecific(tier, server, app, btName, btCategory) {
    this.commonService.isFilterFromSideBar = false;
    let tierID = "NA";
    let serverID = "NA";
    let appID = "NA";
    // let bt = 'NA'
    var urlIndex = "NA";
    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
        urlForid = this.getHostUrl();

    } else {
      urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    }

    if (this.commonService.BtRequestType == 2) {
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
    } else {
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + tier + "&serverName=" + server + "&appName=" + app + '&btName=' + btName;
    }
    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: tier,
      serverName: server,
      appName: app,
      btName: btName
    };
    //urlForid = "//" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + tier + "&serverName=" + server + "&appName=" + app+ '&btName='+ btName,
    //this.http.get(urlForid).subscribe(
    //this.http.post(urlForid,urlObj).subscribe(

    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(
      data => {
        console.log(data);
        var temp = this.getIdFortier(data)
        tierID = temp[0].trim();
        serverID = temp[1].trim();
        appID = temp[2].trim();
        urlIndex = temp[3];

        var btCategoryId = "";
        if (btCategory.toUpperCase() != "ALL")
          btCategoryId = this.getBTCategoryId(btCategory);

        var jsonstartTimeStamp = this.startTimetoPass;
        var jsonendTimeStamp = this.fullJson.endTimeStamp;
        var strGraphKey = this.strGraphKey;
        if (strGraphKey.toLowerCase() == "wholescenario") {
          jsonstartTimeStamp = "NA";
          jsonendTimeStamp = "NA";
        }
        this._ddrData.testRun = this.commonService.testRun;
        this._ddrData.tierName = tier;
        this._ddrData.startTime = jsonstartTimeStamp;
        this._ddrData.endTime = jsonendTimeStamp
        // this._ddrData.tierId = tierID;
        this._ddrData.vecArrForGraph = [];
        this._ddrData.urlName = btName;
        this._ddrData.btCategory = btCategoryId;
        if (this.urlParam.product.toString().includes("/"))
          this._ddrData.product = this.urlParam.product.replace("/", "");
        else
          this._ddrData.product = this.urlParam.product;
        if (this.commonService.enableQueryCaching) {
          this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
        }
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
        this.commonService.removeAllComponentFromFlowpath();
        this._ddrData.isFromtrxFlow = false;
        this._ddrData.isFromtrxSideBar = false;
        this._ddrData.setInLogger('DDR::Bt Trend::Flowpath', 'Flowpath', 'Open Flowpath Report ');
        this._router.navigate([this.getRoutePath() + '/flowpath'])


        // if(btCategory=='Errors')
        //   url +="&statusCode=400";
        // else
        //   url +="&statusCode="+'<%=statusCode%>';
        //   	}

      });
  }
  sortColumnsOnCustom(event, tempData) {

    //for interger type data type
    //this.commonService.sortedField = event.field; 
    // this.commonService.sortedOrder = event.order;

    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].toString().replace(/,/g, ''));
        var value2 = Number(b[temp].toString().replace(/,/g, ''));
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].toString().replace(/,/g, ''));
        var value2 = Number(b[temp].toString().replace(/,/g, ''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }

    this.ipData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.ipData = this.Immutablepush(this.ipData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }
  formatter(val) {
    return val.toLocaleString();
  }

  formatterCPS(val) {
    return val.toFixed(2);
  }

  displayFilter() {
    this.displayFilterDialog = true
    this.rt = '-1.0';
    this.rtt = '-1';
    this.tps = '-1.0';
    this.tpst = '-1'
    this.es = '-1.0';
    this.est = '-1';
  }

  applyFilter() {
    console.log(this.selectedResponseTime, this.txtFilterResponseTime, this.selectedHealth);
    console.log(this.selectedTps, this.selectedResponseTime, this.selectedError);
    //this.limit = 10;
    if (this.txtFilterResponseTime && this.txtFilterResponseTime != 0) {
      this.rt = Number(this.txtFilterResponseTime).toFixed(3);
      this.rtt = this.selectedResponseTime.toString();
    }
    if (this.txtFilterTps) {
      this.tps = Number(this.txtFilterTps).toString();
      this.tpst = this.selectedTps.toString();
    }
    if (this.txtFilterError) {
      this.es = Number(this.txtFilterError).toString();
      this.est = this.selectedError.toString();
    }
    this.health = this.selectedHealth.toString();
    this.urlParam.btName = this.txtFilterBt;

    this.getIPData();

  }
  applyDefaultValue() {
    this.rt = '-1.0';
    this.txtFilterResponseTime = null;
    this.selectedResponseTime = 0;
    this.txtFilterTps = null;
    this.selectedTps = 0;
    this.txtFilterError = null;
    this.selectedError = 0;
    this.rtt = '-1';
    this.tps = '-1.0';
    this.tpst = '-1'
    this.es = '-1.0';
    this.est = '-1';
    this.urlParam.btName = ""
    this.selectedHealth = ''
    this.txtFilterBt = '';
    //this.getIPData()
  }

  onTabClose(event) {
    this.graphTab = false;
  }
  onTabOpen(event) {
    this.graphTab = true;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - BT Trend Report - Test Run : ' + this.urlParam.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - BT Trend Report - Session : ' + this.urlParam.testRun;
    }
  }


  downloadReports(reports: string) {
    let renameArray;
    let colOrder;
    let downloadData = JSON.parse(JSON.stringify(this.ipData));
    console.log('bt category', this.urlParam.btCategory);
    if (this.urlParam.btCategory == "extbt") {
      renameArray = { 'bt': 'Business Transaction', 'calls': 'Total Count', 'oPct': 'BT (%)', 'res': 'Response Time(ms)', 'cps': 'TPS', 'eps': 'Errors/Sec', 'tier': 'tier' }
      colOrder = ['Business Transaction', 'Response Time(ms)', 'BT (%)', 'Total Count', 'TPS', 'Errors/Sec', 'tier'];

      downloadData.forEach((val, index) => {
        delete val['action'];
        delete val['health'];
        delete val['server'];
        delete val['instance'];
        delete val['chart1'];
        delete val['chart2'];
        delete val['chart3'];
        delete val['resMin'];
        delete val['resMax'];
        delete val['cpsMin'];
        delete val['cpsMax'];
        delete val['epsMin'];
        delete val['epsMax'];
        delete val['compareFlag'];
        delete val['cCalls'];
        delete val['cCps'];
        delete val['cCpsMin'];
        delete val['cCpsMax'];
        delete val['cEps'];
        delete val['cEpsMin'];
        delete val['cEpsMax'];
        delete val['_$visited'];
        delete val['resData'];
        delete val['callData'];
        delete val['errorData'];
        delete val['normalCount'];
        delete val['normalAvg'];
        delete val['normalPct'];
        delete val['slowCount'];
        delete val['slowAvg'];
        delete val['slowPct'];
        delete val['vslowCount'];
        delete val['vslowAvg'];
        delete val['vslowPct'];
        delete val['errorCount'];
        delete val['errorAvg'];
        delete val['errorPct'];
        delete val['groupCount'];
        delete val['cRes'];
        delete val['cResMin'];
        delete val['cResMax'];
      });

    }
    else if (this.urlParam.btCategory == "VerySlow") {

      renameArray = {
        'bt': 'Very Slow Business Transaction', 'count': 'Very Slow Count', 'totalCount': 'Total Count', 'percentage': 'Very Slow Percentage(%)',
        'min': 'Very Slow Min(ms)', 'max': 'Very Slow Max(ms)', 'avg': 'Average', 'tier': 'Tier'
      }
      colOrder = ['Very Slow Business Transaction', 'Very Slow Count', 'Total Count', 'Very Slow Percentage(%)', 'Very Slow Min(ms)', 'Very Slow Max(ms)', 'Average', 'Tier']

      downloadData.forEach((val, index) => {
        delete val['action'];
        delete val['health'];
        delete val['server'];
        delete val['instance'];
        delete val['chart1'];
        delete val['chart2'];
        delete val['chart3'];
        delete val['resMin'];
        delete val['resMax'];
        delete val['cpsMin'];
        delete val['cpsMax'];
        delete val['epsMin'];
        delete val['epsMax'];
        delete val['compareFlag'];
        delete val['cCalls'];
        delete val['cCps'];
        delete val['cCpsMin'];
        delete val['cCpsMax'];
        delete val['cEps'];
        delete val['cEpsMin'];
        delete val['cEpsMax'];
        delete val['_$visited'];
        delete val['resData'];
        delete val['callData'];
        delete val['errorData'];
        delete val['normalCount'];
        delete val['normalAvg'];
        delete val['normalPct'];
        delete val['slowCount'];
        delete val['slowAvg'];
        delete val['slowPct'];
        // delete val['vslowCount'];
        // delete val['vslowAvg'];
        // delete val['vslowPct'];
        delete val['errorCount'];
        delete val['errorAvg'];
        delete val['errorPct'];
        delete val['groupCount'];
        delete val['cRes'];
        delete val['cResMin'];
        delete val['cResMax'];
      });

    }
    else if (this.urlParam.btCategory == "Normal") {

      renameArray = {
        'bt': 'Normal Business Transaction', 'count': 'Normal Count', 'totalCount': 'Total Count', 'percentage': 'Normal Percentage(%)',
        'min': 'Normal Min(ms)', 'max': 'Normal Max(ms)', 'avg': 'Average', 'tier': 'Tier'
      }
      colOrder = ['Normal Business Transaction', 'Normal Count', 'Total Count', 'Normal Percentage(%)', 'Normal Min(ms)', 'Normal Max(ms)', 'Average', 'Tier']
      downloadData.forEach((val, index) => {
        delete val['action'];
        delete val['health'];
        delete val['server'];
        delete val['instance'];
        delete val['chart1'];
        delete val['chart2'];
        delete val['chart3'];
        delete val['resMin'];
        delete val['resMax'];
        delete val['cpsMin'];
        delete val['cpsMax'];
        delete val['epsMin'];
        delete val['epsMax'];
        delete val['compareFlag'];
        delete val['cCalls'];
        delete val['cCps'];
        delete val['cCpsMin'];
        delete val['cCpsMax'];
        delete val['cEps'];
        delete val['cEpsMin'];
        delete val['cEpsMax'];
        delete val['_$visited'];
        delete val['resData'];
        delete val['callData'];
        delete val['errorData'];
        // delete val['normalCount'];
        // delete val['normalAvg'];
        // delete val['normalPct'];
        delete val['slowCount'];
        delete val['slowAvg'];
        delete val['slowPct'];
        delete val['vslowCount'];
        delete val['vslowAvg'];
        delete val['vslowPct'];
        delete val['errorCount'];
        delete val['errorAvg'];
        delete val['errorPct'];
        delete val['groupCount'];
        delete val['cRes'];
        delete val['cResMin'];
        delete val['cResMax'];
      });

    }
    else if (this.urlParam.btCategory == "Slow") {
      renameArray = {
        'bt': 'Slow Business Transaction', 'count': 'Slow Count', 'totalCount': 'Total Count', 'percentage': 'Slow Percentage(%)',
        'min': 'Slow Min(ms)', 'max': 'Slow Max(ms)', 'avg': 'Average', 'tier': 'Tier'
      }
      colOrder = ['Slow Business Transaction', 'Slow Count', 'Total Count', 'Slow Percentage(%)', 'Slow Min(ms)', 'Slow Max(ms)', 'Average', 'Tier']
      downloadData.forEach((val, index) => {
        delete val['action'];
        delete val['health'];
        delete val['server'];
        delete val['instance'];
        delete val['chart1'];
        delete val['chart2'];
        delete val['chart3'];
        delete val['resMin'];
        delete val['resMax'];
        delete val['cpsMin'];
        delete val['cpsMax'];
        delete val['epsMin'];
        delete val['epsMax'];
        delete val['compareFlag'];
        delete val['cCalls'];
        delete val['cCps'];
        delete val['cCpsMin'];
        delete val['cCpsMax'];
        delete val['cEps'];
        delete val['cEpsMin'];
        delete val['cEpsMax'];
        delete val['_$visited'];
        delete val['resData'];
        delete val['callData'];
        delete val['errorData'];
        delete val['normalCount'];
        delete val['normalAvg'];
        delete val['normalPct'];
        // delete val['slowCount'];
        // delete val['slowAvg'];
        // delete val['slowPct'];
        delete val['vslowCount'];
        delete val['vslowAvg'];
        delete val['vslowPct'];
        delete val['errorCount'];
        delete val['errorAvg'];
        delete val['errorPct'];
        delete val['groupCount'];
        delete val['cRes'];
        delete val['cResMin'];
        delete val['cResMax'];
      });
    }
    else if (this.urlParam.btCategory == "Errors") {
      renameArray = {
        'bt': 'Error Business Transaction', 'count': 'Error Count', 'totalCount': 'Total Count', 'percentage': 'Error Percentage(%)',
        'min': 'Error Min(ms)', 'max': 'Error Max(ms)', 'avg': 'Average', 'tier': 'Tier'
      }
      colOrder = ['Error Business Transaction', 'Error Count', 'Total Count', 'Error Percentage(%)', 'Error Min(ms)', 'Error Max(ms)', 'Average', 'Tier']
      downloadData.forEach((val, index) => {
        delete val['action'];
        delete val['health'];
        delete val['server'];
        delete val['instance'];
        delete val['chart1'];
        delete val['chart2'];
        delete val['chart3'];
        delete val['resMin'];
        delete val['resMax'];
        delete val['cpsMin'];
        delete val['cpsMax'];
        delete val['epsMin'];
        delete val['epsMax'];
        delete val['compareFlag'];
        delete val['cCalls'];
        delete val['cCps'];
        delete val['cCpsMin'];
        delete val['cCpsMax'];
        delete val['cEps'];
        delete val['cEpsMin'];
        delete val['cEpsMax'];
        delete val['_$visited'];
        delete val['resData'];
        delete val['callData'];
        delete val['errorData'];
        delete val['normalCount'];
        delete val['normalAvg'];
        delete val['normalPct'];
        delete val['slowCount'];
        delete val['slowAvg'];
        delete val['slowPct'];
        delete val['vslowCount'];
        delete val['vslowAvg'];
        delete val['vslowPct'];
        // delete val['errorCount'];
        // delete val['errorAvg'];
        // delete val['errorPct'];
        delete val['groupCount'];
        delete val['cRes'];
        delete val['cResMin'];
        delete val['cResMax'];
      });
    }

    else if (this.urlParam.btCategory == "All") {
      renameArray = {
        'bt': 'Business Transaction', 'totalCount': 'Overall Count', 'oPct': 'BT(%)', 'totalTPS': 'Overall TPS', 'totalAvg': 'Overall Avg(ms)',
        'normalCount': 'Normal Count', 'normalPct': 'Normal Pct(%)', 'normalAvg': 'Normal Avg', 'slowCount': 'Slow Count', 'slowPct': 'Slow Pct(%)',
        'slowAvg': 'Slow Avg(ms)', 'vslowCount': 'Very Slow Count', 'vslowPct': 'Very Slow Pct(%)', 'vslowAvg': 'Very Slow Avg(ms)',
        'errorCount': 'Error Count', 'errorPct': 'Error Pct(%)', 'errorAvg': 'Error Avg(ms)', 'tier': 'Tier'
      }
      colOrder = ['Business Transaction', 'Overall Count', 'BT(%)', 'Overall TPS', 'Overall Avg(ms)', 'Normal Count', 'Normal Pct(%)', 'Normal Avg', 'Slow Count'
        , 'Slow Pct(%)', 'Slow Avg(ms)', 'Very Slow Count', 'Very Slow Pct(%)', 'Very Slow Avg(ms)', 'Error Count', 'Error Pct(%)', 'Error Avg(ms)', 'Tier']
      downloadData.forEach((val, index) => {
        delete val['action'];
        delete val['health'];
        delete val['server'];
        delete val['instance'];
        delete val['chart1'];
        delete val['chart2'];
        delete val['chart3'];
        delete val['resMin'];
        delete val['resMax'];
        delete val['cpsMin'];
        delete val['cpsMax'];
        delete val['epsMin'];
        delete val['epsMax'];
        delete val['compareFlag'];
        delete val['cCalls'];
        delete val['cCps'];
        delete val['cCpsMin'];
        delete val['cCpsMax'];
        delete val['cEps'];
        delete val['cEpsMin'];
        delete val['cEpsMax'];
        delete val['_$visited'];
        delete val['resData'];
        delete val['callData'];
        delete val['errorData'];
        // delete val['normalCount'];
        // delete val['normalAvg'];
        // delete val['normalPct'];
        // delete val['slowCount'];
        // delete val['slowAvg'];
        // delete val['slowPct'];
        // delete val['vslowCount'];
        // delete val['vslowAvg'];
        // delete val['vslowPct'];
        // delete val['errorCount'];
        // delete val['errorAvg'];
        // delete val['errorPct'];
        delete val['groupCount'];
        delete val['cRes'];
        delete val['cResMin'];
        delete val['cResMax'];
      });
    }

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.downloadFilterCriteria,
      strSrcFileName: 'BTTrendReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(downloadData)
    };
    let downloadFileUrl = '';
    if (this.host != undefined && this.host != '' && this.host != null) {
      downloadFileUrl = this.protocol + this.host + ':' + this.port + '/' + this.urlParam.product.replace("/", "");
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", ""));
    }

    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      if (downloadFileUrl.includes("/tomcat"))
        downloadFileUrl = downloadFileUrl.replace("/tomcat", "/node");
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
        (this.checkDownloadType(res)));
    }
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
            downloadFileUrl = this.protocol + this.host + ':' + this.port;
        } else {
          downloadFileUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '');
        }
      }
    }
    downloadFileUrl += '/common/' + res;
    window.open(downloadFileUrl);
  }

  fillDateTime() {
    let tmpStrStarDate = this.strStartDate.split(" ");
    let tmpStrStarTime = tmpStrStarDate[1].split(":");

    let tmpStrEndDate = this.strEndDate.split(" ");
    let tmpStrEndTime = tmpStrEndDate[1].split(":");

    this.startHours = tmpStrStarTime[0];
    this.startMinutes = tmpStrStarTime[1];
    this.startSeconds = tmpStrStarTime[2];
    this.endHours = tmpStrEndTime[0];
    this.endMinutes = tmpStrEndTime[1];
    this.endSeconds = tmpStrEndTime[2];
    document.getElementById("startHours")['value'] = this.startHours;
    document.getElementById("startMinutes")['value'] = this.startMinutes;
    document.getElementById("startSeconds")['value'] = this.startSeconds;

    document.getElementById("endHours")['value'] = this.endHours;
    document.getElementById("endMinutes")['value'] = this.endMinutes;
    document.getElementById("endSeconds")['value'] = this.endSeconds;
  }

  fillYear() {
    var j = 0;
    var yearObj = document.getElementById("selectYearId");
    for (var i = 2014; i <= new Date().getFullYear(); i++) {
      yearObj['options'][j] = new Option(i.toString());
      j++;
    }
  }
  fillUpEventDays() {

    var eventDaysObj = document.getElementById("selectDayId");

    var arrayEvents = ["Black Friday", "Christmas Day", "Cyber Monday", "Good Friday", "New Years Day", "President's Day", "Thanks Giving Day", "Valentines Day"]

    for (var i = 0; i < arrayEvents.length; i++) {
      eventDaysObj['options'][i] = new Option(arrayEvents[i], arrayEvents[i]);
    }
    this.addEventListner();
    this.fillDateTime();
    this.fillYear();
    this.dateAjaxCall();
  }
  addEventListner() {

    var eventDayObj = document.getElementById("selectDayId");
    var yearObj = document.getElementById("selectYearId");

    if (eventDayObj !== null && eventDayObj != undefined) {
      eventDayObj.addEventListener("click", () => {
        console.log('callong', 'lis')
        this.dateAjaxCall()
      });
    }

    if (yearObj !== null && yearObj != undefined) {
      yearObj.addEventListener("click", () => {
        console.log('callong', 'lis')
        this.dateAjaxCall()
      });
    }



  }
  dateAjaxCall() {
    var eventDayObj = document.getElementById("selectDayId");
    var yearObj = document.getElementById("selectYearId");
    var eventDay = eventDayObj['options'][eventDayObj['selectedIndex']]['value'];
    var year = yearObj['options'][yearObj['selectedIndex']]['value'];
    var url = this.getHostUrl() + "/dashboard/view/eventDay.jsp?eventDay=" + eventDay + "&year=" + year;
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      console.log(data);
      var response = data.trim();
      var currDate = new Date();
      var eventDate = new Date(response);
      var yyyy = currDate.getFullYear();
      var mm = currDate.getMonth() + 1;
      var dd = currDate.getDate();

      var eventYear = eventDate.getFullYear();
      var eventMonth = eventDate.getMonth() + 1;
      var eventDaySelected = eventDate.getDate();

      if (eventYear >= yyyy) {
        if (eventMonth >= mm) {
          if (eventMonth > mm) {
            alert("Data is not available for " + eventDay + " " + eventYear);
            return;
          }
          else {
            if (eventDaySelected > dd) {
              alert("Data is not available for " + eventDay + " " + eventYear);
              return;
            }
          }
        }
      }
      document.getElementById("txtStartDateId")['value'] = data.trim();
      document.getElementById("txtEndDateId")['value'] = data.trim();
      document.getElementById("txtStartDateId")['disabled'] = true;
      document.getElementById("txtEndDateId")['disabled'] = true;
    });
  }

  updateDateTime() {
    var d = new Date();
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000;
    var utcTime = localTime + localOffset;
    //var destOffset = -5;

    var destOffset = Number(this.serverOffset);
    var diffLocalOffset = Number(destOffset) + Number(localOffset);
    var destTime = Number(utcTime) + Number(diffLocalOffset);
    var destTime = Number(utcTime) + Number(destOffset);
    var nd = new Date(destTime);
    this.currDateTime = this.getDateFormat(nd);
    //document.getElementById('SystemClock').innerHTML = currDateTime;
    setTimeout(() => {
      this.updateDateTime();
    }, 1000);
  }


  getDateFormat(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;//January is 0!`

    var year = date.getFullYear();
    if (day < 10) { day = '0' + day }
    if (month < 10) { month = '0' + month }

    var hour = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();

    if (hour < 10) { hour = '0' + hour }
    if (mins < 10) { mins = '0' + mins }
    if (secs < 10) { secs = '0' + secs }
    var formatDate = month + '/' + day + '/' + year + " " + hour + ":" + mins + ":" + secs;
    return formatDate;
  }

  openDateFilter(event) {
    console.log("event==============", event);
    var value = event.value;

    this.openDateFilterOnEventDay(value);

  }

  openDateFilterOnEventDay(value) {

    console.log("value===================>", value);
    console.log('currDateTime=====>', this.currDateTime);
    var dateTimeFilter = document.getElementById("eventDateFilter");
    if (value == "EventDay") {
      dateTimeFilter.innerHTML = "<div class = 'ui-g-12'><div><label style='width: 30.5%'>Select Day &nbsp; : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><select id='selectDayId' onchange='dateAjaxCall()' style='width:25%;'></select>&nbsp;&nbsp;&nbsp;&nbsp;<select id='selectYearId' onchange='dateAjaxCall()' style='width:20%'></select></div> </br><div><label style='width: 30%'> From &nbsp;:</label>&nbsp;&nbsp; <input type ='text' title= 'MM/DD/YYYY' id='txtStartDateId' style='width:30%;'> </select> &nbsp;&nbsp;<input type='text' title= 'HH' name='name' id='startHours' placeholder='HH' autocomplete='off' onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' >&nbsp;&nbsp; : &nbsp;&nbsp;<input type='text' title= 'MM' name='name' id='startMinutes' onkeypress = 'return valEnteredKeyN(event);' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'>&nbsp;&nbsp;:&nbsp;&nbsp;<input type='text' title= 'SS' onkeypress = 'return valEnteredKeyN(event);'  name='name' id='startSeconds' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></div></br><div><label style='width: 30%'>To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </label>&nbsp;&nbsp;&nbsp;<input type='text' title= 'MM/DD/YYYY' id='txtEndDateId' style='width:30%;'>&nbsp;&nbsp;&nbsp;<input type='text' title= 'HH' name='name' id='endHours' placeholder='HH' autocomplete='off'  onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' >&nbsp;&nbsp; : &nbsp;&nbsp;<input type='text' title= 'MM' onkeypress = 'return valEnteredKeyN(event);' name='name' id='endMinutes' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'>&nbsp;&nbsp;:&nbsp;&nbsp;<input type='text' title= 'SS' name='name' id='endSeconds' onkeypress = 'return valEnteredKeyN(event);' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></select></div></div>"
      this.customFilterDisplay = false;
      this.fillDateTime();
      this.fillYear()
      this.fillUpEventDays();
    } else if (value == "Custom Date") {

      this.startDate = this.currDateTime.split(' ')[0];
      this.endDate = this.currDateTime.split(' ')[0];
      this.customFilterDisplay = true;
      dateTimeFilter.innerHTML = "";

      let tmpStrStarDate = this.strStartDate.split(" ");
      let tmpStrStarTime = tmpStrStarDate[1].split(":");

      let tmpStrEndDate = this.currDateTime.split(" ");
      let tmpStrEndTime = tmpStrEndDate[1].split(":");

      this.startHours = tmpStrStarTime[0];
      this.startMinutes = tmpStrStarTime[1];
      this.startSeconds = tmpStrStarTime[2];
      this.endHours = tmpStrEndTime[0];
      this.endMinutes = tmpStrEndTime[1];
      this.endSeconds = tmpStrEndTime[2];

      // this.fillDateTime();
    } else if (value == "Yesterday") {
      dateTimeFilter.innerHTML = "<div class = 'ui-g-12'><div><label style='width: 30%'> From &nbsp; : &nbsp;&nbsp; </label> <input type ='text' title= 'MM/DD/YYYY' id='txtStartDateId' style='width:30%;'> </select> &nbsp;&nbsp; <input type='text' title= 'HH' name='name' id='startHours' placeholder='HH' autocomplete='off' onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'MM' name='name' id='startMinutes' onkeypress = 'return valEnteredKeyN(event);' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'SS' onkeypress = 'return valEnteredKeyN(event);'  name='name' id='startSeconds' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></div></br> <div><label style='width: 30%'>To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </label> &nbsp;&nbsp;&nbsp; <input type='text' title= 'MM/DD/YYYY' id='txtEndDateId' style='width:30%;'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' title= 'HH' name='name' id='endHours' placeholder='HH' autocomplete='off'  onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp;&nbsp; <input type='text' title= 'MM' onkeypress = 'return valEnteredKeyN(event);' name='name' id='endMinutes' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'>&nbsp;&nbsp; : &nbsp;&nbsp;<input type='text' title= 'SS' name='name' id='endSeconds' onkeypress = 'return valEnteredKeyN(event);' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></select><div></div>"
      this.customFilterDisplay = false;
      this.fillDateTime();
      this.fillDates("Yesterday");
    }
    else if (value == "Last Week Same Day") {
      this.customFilterDisplay = false;
      dateTimeFilter.innerHTML = "<div class = 'ui-g-12'><div><label style='width: 30%'> From &nbsp; : &nbsp;&nbsp; </label> <input type ='text' title= 'MM/DD/YYYY' id='txtStartDateId' style='width:30%;'> </select> &nbsp;&nbsp; <input type='text' title= 'HH' name='name' id='startHours' placeholder='HH' autocomplete='off' onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'MM' name='name' id='startMinutes' onkeypress = 'return valEnteredKeyN(event);' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'SS' onkeypress = 'return valEnteredKeyN(event);'  name='name' id='startSeconds' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> </div> </br> <div> <label style='width: 30%'>To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </label> &nbsp;&nbsp;&nbsp; <input type='text' title= 'MM/DD/YYYY' id='txtEndDateId' style='width:30%;'> &nbsp;&nbsp; <input type='text' title= 'HH' name='name' id='endHours' placeholder='HH' autocomplete='off'  onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'MM' onkeypress = 'return valEnteredKeyN(event);' name='name' id='endMinutes' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'SS' name='name' id='endSeconds' onkeypress = 'return valEnteredKeyN(event);' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></select></div></div>"
      this.fillDateTime();
      this.fillDates("Last Week Same Day");
    } else if (value == "Total Test Run") {
      dateTimeFilter.innerHTML = "";
      this.customFilterDisplay = false;
    } else {
      dateTimeFilter.innerHTML = "";
      this.customFilterDisplay = false;
    }

    // if (value == "EventDay")
    //   this.specialDay = document.getElementById("selectDayId")['value'];
    // else if (value == "Yesterday")
    //   this.specialDay = "Yesterday";
    // else if (value == "Last Week Same Day")
    //   this.specialDay = "Last Week Same Day";
  }

  valEnteredKeyN(event) {
    console.log(event);
    var enteredKey = this.checkBrowser(event);

    if ((enteredKey >= 48 && enteredKey <= 57) || (enteredKey == 0) || (enteredKey == 8) || (enteredKey == 46))
      return true;
    else
      return false;
  }


  validateRpts(data, type) {
    console.log("check data", data);

    let RptsVall = data.target.value;

    if (data.keyCode == 46) {

      if (type === "tps" && (this.txtFilterTps && this.txtFilterTps.includes("."))) {
        console.log("tps");
        return false;
      }
      if (type === "res" && (this.txtFilterResponseTime && this.txtFilterResponseTime.includes("."))) {
        console.log("res");
        return false;
      }


    }
    if (RptsVall.indexOf(".") >= 0) {

      data.target.value = (RptsVall.substr(0, RptsVall.indexOf(".")) + RptsVall.substr(RptsVall.indexOf("."), 3))
    }
    else {
      data.target.value = RptsVall;

    }
    if ((data.keyCode >= 48 && data.keyCode <= 57) || (data.keyCode == 0) || (data.keyCode == 8) || (data.keyCode == 46)) {

      return true;
    }
    else {
      return false;
    }


  }


  checkBrowser(event) {
    if ((navigator.appName.indexOf("Microsoft") > -1) || (navigator.appName.indexOf("MSIE") > -1)) {
      var enteredKey = event.keyCode;
    }
    else {
      var enteredKey = event.which;
    }

    return enteredKey;
  }


  fillDates(value) {
    var startDate = this.eventDateMap[value];

    document.getElementById("txtStartDateId")['value'] = startDate;
    document.getElementById("txtEndDateId")['value'] = startDate;

    if (this.graphTime == 'Last Week Same Day') {
      // jQuery("#timePeriodLbl").hide();
      document.getElementById("txtStartDateId")['disabled'] = false;
      document.getElementById("txtEndDateId")['disabled'] = false;
      // jQuery("#txtStartDateId").datepicker();
      // jQuery("#txtEndDateId").datepicker();
    } else {
      document.getElementById("txtStartDateId")['disabled'] = true;
      document.getElementById("txtEndDateId")['disabled'] = true;
    }
  }
  openTimeFilter() {
    this.display = true;
    this.customFilterDisplay = false;
    this.timeFilterOptions = [];
    this.timeFilterOptions.push({ label: 'Today', value: 'Today' });
    this.timeFilterOptions.push({ label: 'EventDay', value: 'EventDay' });
    this.timeFilterOptions.push({ label: 'Last 2 Minutes', value: 'Last 2 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 5 Minutes', value: 'Last 5 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 10 Minutes', value: 'Last 10 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 15 Minutes', value: 'Last 15 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 30 Minutes', value: 'Last 30 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 1 hour', value: 'Last 1 hour' });
    this.timeFilterOptions.push({ label: 'Last 2 hours', value: 'Last 2 hours' });
    this.timeFilterOptions.push({ label: 'Last 4 hours', value: 'Last 4 hours' });
    this.timeFilterOptions.push({ label: 'Last 8 hours', value: 'Last 8 hours' });
    this.timeFilterOptions.push({ label: 'Last 12 hours', value: 'Last 12 hours' });
    this.timeFilterOptions.push({ label: 'Last 24 hours', value: 'Last 24 hours' });
    this.timeFilterOptions.push({ label: 'Yesterday', value: 'Yesterday' });
    this.timeFilterOptions.push({ label: 'Last Week Same Day', value: 'Last Week Same Day' });
    this.timeFilterOptions.push({ label: 'Custom Date', value: 'Custom Date' });

    if (this.urlParam.product.replace("%2F", "") == 'netstorm' || this.id.product == 'netstorm' || this.urlParam.product.replace("/", "") == 'netstorm')
      this.timeFilterOptions.push({ label: 'Total Test Run', value: 'Total Test Run' });

    this.selectedValue = this.timeFilterOptions[0];
  }

  trimString(str) {
    // str = this != window? this : str;
    console.log("str===", str)
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }

  compareDatesForOthers(startDate, endDate) {
    var x = new Date(startDate);
    var y = new Date(endDate);

    return (x >= y);
  }

  submitFilterValue() {
    //      this.limit = 10;
    // var startTimeObj = document.getElementById("startComboBox");
    // var selectedValue = startTimeObj['value'];

    // var decodeString = '<%=decodedQueryString%>&strGraphKey=<%=strGraphKey%>' + "&isCompare=" + this.isCompare;
    // var pageName = 'rptBusinessTransaction.jsp?' + decodeString;

    // var selectedCompareValue = jQuery('#compareTime').val(); graphTime, startDateObj, endDateObj

    var strStartTimeAll = '';
    var strEndTimeAll = '';
    var strStartTimeAllMs;
    var strEndTimeAllMs;

    if (this.selectedValue == "EventDay" || this.selectedValue == "Yesterday" || this.selectedValue == "Last Week Same Day" || this.selectedValue == "By Phase") {

      var currentDateTime = this.currDateTime;
      var startDate = document.getElementById("txtStartDateId")['value'];
      var endDate = document.getElementById("txtEndDateId")['value'];

      var startHour = document.getElementById("startHours")['value'];
      var startMinute = document.getElementById("startMinutes")['value'];
      var startSecond = document.getElementById("startSeconds")['value'];


      var endHour = document.getElementById("endHours")['value'];
      var endMinute = document.getElementById("endMinutes")['value'];
      var endSecond = document.getElementById("endSeconds")['value'];


      if (this.trimString(startDate) == "" || this.trimString(startHour) == "" || this.trimString(startMinute) == "" || this.trimString(startSecond) == "" || this.trimString(endDate) == "" || this.trimString(endHour) == "" || this.trimString(endMinute) == "" || this.trimString(endSecond) == "") {
        alert("Start/End Date/Time shouldn't be blank");
        return;
      }

      if (startHour >= 24 || endHour >= 24) {
        alert("Start/End hour field shouldn't be greater than or equals to 24");
        return;
      }

      if (startMinute >= 60 || endMinute >= 60 || startSecond >= 60 || endSecond >= 60) {
        alert("Start/End Minute/Second field shouldn't be greater than or equal to 60 ");
        return;
      }

      var strStartTime = startHour + ":" + startMinute + ":" + startSecond;
      var strEndTime = endHour + ":" + endMinute + ":" + endSecond;

      var strStartTimeAll = this.trimString(startDate) + " " + this.trimString(strStartTime);
      var strEndTimeAll = this.trimString(endDate) + " " + this.trimString(strEndTime);
      strStartTimeAllMs = new Date(strStartTimeAll).getTime();
      strEndTimeAllMs = new Date(strEndTimeAll).getTime();
      var timeDiff1 = Math.abs(strStartTimeAllMs - strEndTimeAllMs);
      sessionStorage.setItem('timeDiff1', timeDiff1.toString());
      console.log(strStartTimeAll, ' ', strEndTimeAll, ' ', strStartTimeAllMs, ' ', strEndTimeAllMs)

      if (this.compareDatesForOthers(strStartTimeAll, currentDateTime)) {
        alert("Start date/time cannot be greater than current date/time");
        return;
      }
      if (this.compareDatesForOthers(strEndTimeAll, currentDateTime)) {
        alert("End date/time cannot be greater than current date/time");
        return;
      }

      if (this.compareDatesForOthers(strStartTimeAll, strEndTimeAll)) {
        alert("Start date cannot be greater than end date");
        return;
      }
      this.specialDay = "";

      if (this.selectedValue == "EventDay")
        this.specialDay = document.getElementById("selectDayId")['value'];
      else if (this.selectedValue == "Yesterday")
        this.specialDay = "Yesterday";
      else if (this.selectedValue == "Last Week Same Day")
        this.specialDay = "Last Week Same Day";
      // window.location.href = "#";


      // window.location.href = pageName + "&strStarDate=" + strStartTimeAll + "&strEndDate=" + strEndTimeAll + "&strGraphTime=" + this.selectedValue + "&strSpecialDay=" + specialDay;
      // document.getElementById("selectPhaseId")['value'];
    } else if (this.selectedValue == "Custom Date") {

      var currentDateTime = this.currDateTime;
      // var startDate = document.getElementById("txtStartDateId")['value'];
      // var endDate = document.getElementById("txtEndDateId")['value'];

      // var startHour = document.getElementById("startHours")['value'];
      // var startMinute = document.getElementById("startMinutes")['value'];
      // var startSecond = document.getElementById("startSeconds")['value'];


      // var endHour = document.getElementById("endHours")['value'];
      // var endMinute = document.getElementById("endMinutes")['value'];
      // var endSecond = document.getElementById("endSeconds")['value'];

      console.log(this.startDate, '----', this.endDate, '----', this.endSeconds);

      if (this.startDate.toString().includes(" ")) {
        console.log('here start date');
        let strDate = new Date(this.startDate);
        this.startDate = (strDate.getMonth() + 1).toString() + '/' + strDate.getDate().toString() + '/' + strDate.getFullYear().toString();
      }

      if (this.endDate.toString().includes(" ")) {
        console.log('here end date');
        let endDate = new Date(this.endDate);
        this.endDate = (endDate.getMonth() + 1).toString() + '/' + endDate.getDate().toString() + '/' + endDate.getFullYear().toString();
      }

      if (this.trimString(this.startDate) == "" || this.trimString(this.startHours) == "" || this.trimString(this.startMinutes) == "" || this.trimString(this.startSeconds) == "" || this.trimString(this.endDate) == "" || this.trimString(this.endHours) == "" || this.trimString(this.endMinutes) == "" || this.trimString(this.endSeconds) == "") {
        alert("Start/End Date/Time shouldn't be blank");
        return;
      }

      if (Number(this.startHours) >= 24 || Number(this.endHours) >= 24) {
        alert("Start/End hour field shouldn't be greater than or equals to 24");
        return;
      }

      if (Number(this.startMinutes) >= 60 || Number(this.endMinutes) >= 60 || Number(this.startSeconds) >= 60 || Number(this.endSeconds) >= 60) {
        alert("Start/End Minute/Second field shouldn't be greater than or equal to 60 ");
        return;
      }

      var strStartTime = this.startHours + ":" + this.startMinutes + ":" + this.startSeconds;
      var strEndTime = this.endHours + ":" + this.endMinutes + ":" + this.endSeconds;

      var strStartTimeAll = this.trimString(this.startDate) + " " + this.trimString(strStartTime);
      var strEndTimeAll = this.trimString(this.endDate) + " " + this.trimString(strEndTime);
      strStartTimeAllMs = new Date(strStartTimeAll).getTime();
      strEndTimeAllMs = new Date(strEndTimeAll).getTime();
      var timeDiff1 = Math.abs(strStartTimeAllMs - strEndTimeAllMs);
      sessionStorage.setItem('timeDiff1', timeDiff1.toString());
      console.log(strStartTimeAll, ' ', strEndTimeAll, ' ', strStartTimeAllMs, ' ', strEndTimeAllMs)

      if (this.compareDatesForOthers(strStartTimeAll, currentDateTime)) {
        alert("Start date/time cannot be greater than current date/time");
        return;
      }
      if (this.compareDatesForOthers(strEndTimeAll, currentDateTime)) {
        alert("End date/time cannot be greater than current date/time");
        return;
      }

      if (this.compareDatesForOthers(strStartTimeAll, strEndTimeAll)) {
        alert("Start date cannot be greater than end date");
        return;
      }
      this.specialDay = "";
    } else if (this.selectedValue == "Total Test Run") {
      this.selectedValue = "WholeScenario";
      this.specialDay = "Total Test Run";
      // window.location.href = "#";
      // window.location.href = pageName + "&strGraphTime=" + this.selectedValue + "&strSpecialDay=" + specialDay;
    }
    else {
      // window.location.href = "#";
      // window.location.href = pageName + "&strGraphTime=" + this.selectedValue;
      this.specialDay = 'NA';
    }

    let url;
    let protocolForObj = "";
    if (sessionStorage.getItem("isMultiDCMode") === "true") {
      protocolForObj = this._ddrData.protocol;
    } else {
      protocolForObj = this.protocol;
    }
    url = this.getHostUrl() + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getGraphKey?graphTime=' + this.selectedValue +
      '&startTime=' + strStartTimeAll + '&endTime=' + strEndTimeAll;

    this.startTime = strStartTimeAll;
    this.endTime = strEndTimeAll;
    //this.headerFilter = '';
    //this.createHeaderFilter();

    this.ddrRequest.getDataUsingGet(url).subscribe(resp => {
      let data = <any>resp;
      console.log('data========>', data);
      if (data == 'Today') {
        this.strGraphKey = 'LAST_DAY';
        this.graphTime = data;
      }
      else {
        this.strGraphKey = data;
        this.graphTime = this.selectedValue;
      }
      console.log(this.strGraphKey);
      this.display = false;
      this.commonService.loaderForDdr = true;
      this.getIPData();
    });


  }




  noNegativeValue(event) {
    if (event.keyCode == 45 || event.keyCode == 43 || event.keyCode == 42 || event.keyCode == 47 || event.keyCode == 43)
      return false;
    else
      return true;
  }
  showStoreId: boolean = false;
  showTerminalId: boolean = false;
  showAssociateId: boolean = false;
  dataForCustomScreen: any;
  chckStoreId: boolean = false;
  chckTerminalId: boolean = false;
  chckAssociateId: boolean = false;

  openCustomPopUp(node) {
    this.dataForCustomScreen = node;
    this.showCustomDialog = true;
    this.customOptions.map(val => {
      if (val.toLowerCase() == 'storeid') {
        this.showStoreId = true;
        this.storeId = val;
      }
      if (val.toLowerCase() == 'terminalid') {
        this.showTerminalId = true;
        this.terminalId = val;
      }
      if (val.toLowerCase() == 'associateid') {
        this.showAssociateId = true;
        this.associateId = val;
      }
    })

  }

  storeId
  terminalId
  associateId
  openCustomDataScreen() {
    //console.log('cutom method data---->', this.dataForCustomScreen, '***', this.urlParam, '--', this.fullJson);
    let tierID = "NA";
    let serverID = "NA";
    let appID = "NA";
    let urlIndex = "NA";
    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
        urlForid = this.getHostUrl();
    } else {
      urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    }

    if (this.commonService.BtRequestType == 2) {
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
    } else {
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + this.dataForCustomScreen.tier + "&serverName=" + this.dataForCustomScreen.server + "&appName=" + this.dataForCustomScreen.app + "btName=" + this.dataForCustomScreen.bt;
    }
    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: this.dataForCustomScreen.tier,
      serverName: this.dataForCustomScreen.server,
      appName: (this.dataForCustomScreen.instance || this.dataForCustomScreen.app),
      btName: this.dataForCustomScreen.bt,
    };

    //this.http.get(urlForid).subscribe(
    //this.http.post(urlForid,urlObj).subscribe(
    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(data => {
      console.log(data);
      var temp = this.getIdFortier(data)
      tierID = temp[0].trim();
      serverID = temp[1].trim();
      appID = temp[2].trim();
      urlIndex = temp[3];

      var btCategoryId = '';
      var btCategory = this.urlParam.btCategory;
      if (btCategory.toUpperCase() != "ALL")
        btCategoryId = this.getBTCategoryId(btCategory);

      var jsonstartTimeStamp = this.startTimetoPass;
      var jsonendTimeStamp = this.fullJson.endTimeStamp;
      var strGraphKey = this.strGraphKey;
      if (strGraphKey.toLowerCase() == "wholescenario") {
        jsonstartTimeStamp = "NA";
        jsonendTimeStamp = "NA";
      }
      this._ddrData.testRun = this.commonService.testRun;
      this._ddrData.tierName = this.dataForCustomScreen.tier;
      this._ddrData.startTime = jsonstartTimeStamp;
      this._ddrData.endTime = jsonendTimeStamp
      // this._ddrData.tierId = tierID;
      this._ddrData.vecArrForGraph = [];
      this._ddrData.urlName = this.dataForCustomScreen.btName;
      this._ddrData.urlIndex = urlIndex;
      // this._ddrData.btCategory =  rowData.bt;
      if (this.urlParam.product.toString().includes("/"))
        this._ddrData.product = this.urlParam.product.replace("/", "");
      else
        this._ddrData.product = this.urlParam.product;

      let customData = '';
      if (this.chckStoreId) {
        customData = this.storeId + ','
      }
      if (this.chckTerminalId) {
        customData += this.terminalId + ','
      }
      if (this.chckAssociateId) {
        customData += this.associateId + ','
      }
      let customArr = [];
      this.isCustomDataSelected = false;
      for (let i = 0; i < this.customDataOtionsArr.length; i++) {
        if (this.customDataOtionsArr[i].modal.length === 1) {
          console.log('---------------?>', this.customDataOtionsArr[i].label)
          customArr.push(this.customDataOtionsArr[i].label);
          this.isCustomDataSelected = true;
        }

      }
      if (!this.isCustomDataSelected) {
        this._ddrData.multiErrorMessage("Please select any one of the given option", "No option selected");
        return;
      }
      console.log('customdata option ', customArr);
      this._ddrData.customOptions = customArr;    //Bug 56870 
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
      this.commonService.removeAllComponentFromFlowpath();
      this._router.navigate([this.getRoutePath() + '/CustomDataByBTSplitting'])


      // if(btCategory=='Errors')
      //   url +="&statusCode=400";
      // else
      //   url +="&statusCode="+'<%=statusCode%>';

      //   	}
    });
  }
  resetCustomValues() {
    this.chckAssociateId = false;
    this.chckStoreId = false;
    this.chckTerminalId = false;
    this.showCustomDialog = false;
  }


  startCDate: string = '';
  endCDate: string = '';
  endCSeconds: string = '';
  startCHours: string = '';
  startCMinutes: string = '';
  startCSeconds: string = '';
  endCHours: string = '';
  endCMinutes: string = '';


  getSpecifiedData() {
    let currentDateTime = this.currDateTime;
    let strStartTimeAllMs;
    let strEndTimeAllMs;

    console.log(this.startCDate, '----', this.endCDate, '----', this.endCSeconds);

    if (this.startCDate.toString().includes(" ")) {
      console.log('here start date');
      let strDate = new Date(this.startCDate);
      this.startCDate = (strDate.getMonth() + 1).toString() + '/' + strDate.getDate().toString() + '/' + strDate.getFullYear().toString();
    }

    if (this.endCDate.toString().includes(" ")) {
      console.log('here end date');
      let endDate = new Date(this.endCDate);
      this.endCDate = (endDate.getMonth() + 1).toString() + '/' + endDate.getDate().toString() + '/' + endDate.getFullYear().toString();
    }

    if (this.trimString(this.startCDate) == "" || this.trimString(this.startCHours) == "" || this.trimString(this.startCMinutes) == "" || this.trimString(this.startCSeconds) == "" || this.trimString(this.endCDate) == "" || this.trimString(this.endCHours) == "" || this.trimString(this.endCMinutes) == "" || this.trimString(this.endCSeconds) == "") {
      alert("Start/End Date/Time shouldn't be blank");
      return;
    }

    if (Number(this.startCHours) >= 24 || Number(this.endCHours) >= 24) {
      alert("Start/End hour field shouldn't be greater than or equals to 24");
      return;
    }

    if (Number(this.startCMinutes) >= 60 || Number(this.endCMinutes) >= 60 || Number(this.startCSeconds) >= 60 || Number(this.endCSeconds) >= 60) {
      alert("Start/End Minute/Second field shouldn't be greater than or equal to 60 ");
      return;
    }

    var strStartTime = this.startCHours + ":" + this.startCMinutes + ":" + this.startCSeconds;
    var strEndTime = this.endCHours + ":" + this.endCMinutes + ":" + this.endCSeconds;

    var strStartTimeAll = this.trimString(this.startCDate) + " " + this.trimString(strStartTime);
    var strEndTimeAll = this.trimString(this.endCDate) + " " + this.trimString(strEndTime);
    strStartTimeAllMs = new Date(strStartTimeAll).getTime();
    strEndTimeAllMs = new Date(strEndTimeAll).getTime();
    if (this.selectedCompareTime.startsWith('Compare')) {
      this.compareAppliedStrattime = strStartTimeAll;
      this.compareAppliedEndtime = strEndTimeAll;
    }
    var timeDiff1 = Math.abs(strStartTimeAllMs - strEndTimeAllMs);
    sessionStorage.setItem('timeDiff1', timeDiff1.toString());
    console.log(strStartTimeAll, ' ', strEndTimeAll, ' ', strStartTimeAllMs, ' ', strEndTimeAllMs)

    if (this.compareDatesForOthers(strStartTimeAll, currentDateTime)) {
      alert("Start date/time cannot be greater than current date/time");
      return;
    }
    if (this.compareDatesForOthers(strEndTimeAll, currentDateTime)) {
      alert("End date/time cannot be greater than current date/time");
      return;
    }

    if (this.compareDatesForOthers(strStartTimeAll, strEndTimeAll)) {
      alert("Start date cannot be greater than end date");
      return;
    }

    let url;
    let protocolForObj = "";
    if (sessionStorage.getItem("isMultiDCMode") === "true") {
      protocolForObj = this._ddrData.protocol;
    } else {
      protocolForObj = this.protocol;
    }
    url = this.getHostUrl() + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getGraphKey?graphTime=' + 'Custom Date' +
      '&startTime=' + strStartTimeAll + '&endTime=' + strEndTimeAll;

    this.startTime = strStartTimeAll;
    this.endTime = strEndTimeAll;

    this.ddrRequest.getDataUsingGet(url).subscribe(data => {
      console.log('data========>', data);
      this.strCGraphKey = data;
      //this.graphTime = this.selectedValue;
      this.isCompare = true;
      console.log(this.strGraphKey);
      // this.showCustomDialogforCompare = false;
      this.commonService.loaderForDdr = true;
      this.getIPData();
    });

  }

  validateQty(event): boolean {
    if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57))
      return false;

    return true;
  }

  paginate(event) {
    // event.first = Index of the first record  (used  as offset in query) 
    // event.rows = Number of rows to display in new page  (used as limit in query)
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    // this.commonService.rowspaerpage = event.rows;
    //  this.offset = parseInt(event.first);
    //this.limit = parseInt(event.rows);
    //if(this.totalCount > 0){
    //if(this.limit > this.totalCount) {
    //this.limit = Number(this.totalCount);
    //}
    //if((this.limit + this.offset) > this.totalCount) {
    //this.limit = Number(this.totalCount) - Number(this.offset);
    // }
    // }
    // this.lastIndex = this.offset + "";
    // this.commonService.loaderForDdr = true;
    // this.getIPData()
  }
  openBTIPSummary(rowData) {
    this.commonService.isFilterFromSideBar = false;
    var dcName = this.urlParam.dcName;
    var btCategory = this.urlParam.btCategory;
    var tierID = "NA";
    var serverID = "NA";
    var appID = "NA";
    var urlIndex = "NA";
    var strGraphKey = this.urlParam.strGraphKey;
    var jsonstartTimeStamp = this.startTimetoPass;
    var jsonendTimeStamp = this.fullJson.endTimeStamp;
    let ddrData: any = {};
    let urlForid = '';
    let urlObj = {};
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
        urlForid = this.getHostUrl();

    } else {
      urlForid = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    }
    if (this.commonService.BtRequestType == 2) {
      //  if(this._ddrData.protocol)
      //   urlForid = this._ddrData.protocol + "://" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
      //  else
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/NDAjaxController.jsp";
    } else {
      // if(this._ddrData.protocol)
      //  urlForid = this._ddrData.protocol + "://" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance)+ '&btName='+ rowData.bt;
      // else
      urlForid = this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + (rowData.app || rowData.instance) + '&btName=' + rowData.bt;
    }
    urlObj = {
      strOperName: 'getTSAname',
      testRun: this.commonService.testRun,
      tierName: rowData.tier,
      serverName: rowData.server,
      appName: (rowData.app || rowData.instance),
      btName: rowData.bt
    };
    //urlForid = "//" + this.getHostUrl() + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + rowData.tier + "&serverName=" + rowData.server + "&appName=" + rowData.app+ '&btName='+ rowData.bt,

    //this.http.get(urlForid).subscribe(
    //this.http.post(urlForid,urlObj).subscribe(
    this.commonService.getNDAjaxData(urlForid, urlObj).subscribe(
      data => {
        console.log(data);
        var temp = this.getIdFortier(data)
        tierID = temp[0].trim();
        serverID = temp[1].trim();
        appID = temp[2].trim();


        var btCategoryId = "";
        if (btCategory.toUpperCase() != "ALL")
          btCategoryId = this.getBTCategoryId(btCategory);

        var strGraphKey = this.strGraphKey;
        if (strGraphKey.toLowerCase() == "wholescenario") {
          jsonstartTimeStamp = "NA";
          jsonendTimeStamp = "NA";
        }
        if (btCategory != "All") {
          this._ddrData.btCategory = this.getBTId(btCategory);
        }
        ddrData.testRun = this.commonService.testRun;
        ddrData.tierId = tierID;
        ddrData.serverId = serverID;
        ddrData.appId = appID;
        ddrData.tierName = rowData.tier;
        ddrData.serverName = rowData.server;
        ddrData.appName = rowData.instance;
        ddrData.startTime = jsonstartTimeStamp;
        ddrData.endTime = jsonendTimeStamp
        // this._ddrData.tierId = tierID;
        this._ddrData.vecArrForGraph = [];
        ddrData.urlName = rowData.bt;
        if (this.commonService.enableQueryCaching) {
          this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
        }
        this._ddrData.testRun = this.commonService.testRun;
        if (this.urlParam.product.toString().includes("/"))
          this._ddrData.product = this.urlParam.product.replace("/", "");
        else
          this._ddrData.product = this.urlParam.product;

        //Setting for bug 63820
        this._ddrData.tierId = tierID;
        this._ddrData.serverId = serverID;
        this._ddrData.appId = appID;
        this._ddrData.testRun = this.commonService.testRun;
        this._ddrData.tierName = rowData.tier;
        this._ddrData.serverName = rowData.server;
        this._ddrData.appName = rowData.instance;
        this._ddrData.startTime = jsonstartTimeStamp;
        this._ddrData.endTime = jsonendTimeStamp;
        this._ddrData.urlName = rowData.bt;


        this._ddrData.splitViewFlag = false;
        this.commonService.ipSummaryData = ddrData;
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
        this._ddrData.setInLogger('DDR::Bt Trend::Ip Summary', 'Ip Summary', 'Open Ip Summary Report ');
        this._router.navigate([this.getRoutePath() + '/ipsummary']);

      });
  }

  getRoutePath() {
    if (this._ddrData.btTrendParamFromStoreView != undefined)
      return '/ddr';
  }
  getAggKeywordData() {
    let url = "";
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      //   if(this._ddrData.protocol)
      //    url += this._ddrData.protocol + "://" + this.getHostUrl() + '/';
      //  else
      url += this.getHostUrl() + '/';
    } else {
      if (this.commonService.protocol.endsWith("://"))
        url += this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/';
      else
        url += this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/';
    }
    if (this.urlParam.product.toString().includes("/"))
      url += this.urlParam.product.replace("/", "");
    else
      url += this.urlParam.product;

    url += '/v1/cavisson/netdiagnostics/webddr/enableAggFlowmap'
    this.http.get(url).subscribe(res => {
      let data = <any>res
      this.enableAggFlowmap = data;

    });

  }
  currentNodeData: any;
  /* openAggFlowmap(row) {
    // https://10.206.96.8:4431/netdiagnostics/v1/cavisson/netdiagnostics/ddr/TrxFlowMapData/33333?testRun=33333
    // &strStartTime=1547184600000&strEndTime=1547185860000&statusCode=-2&btName=SnBUISearch&start=0&end=7&refresh=0&isCompress=0&isMDC=1&isSDC=1

     // &strStartTime=1547184600000&strEndTime=1547185860000&statusCode=-2&btName=SnBUISearch&start=0&end=7&refresh=0&isCompress=0&isMDC=1&isSDC=1
    this.dialogForTierMerge = true;
    this.currentNodeData = row;
    if(this.commonService.enableQueryCaching){
      this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
    }
  } */

  gettierData(node) {
    this.currentNodeData = node;
    let row = this.currentNodeData
    let url = "";
    if (this.startIndexForAgg < 0) {
      alert("Start Index should not be less than 0");
      return;
    }
    if (this.startIndexForAgg > this.lastIndexForAgg || this.startIndexForAgg == this.lastIndexForAgg) {
      alert("Last index should be greater than Start Index");
      return;
    }
    if (this.lastIndexForAgg < 1) {
      alert("Last Index should be greater than 1");
      return;
    }
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      //   if(this._ddrData.protocol)
      //    url += this._ddrData.protocol + "://" + this.getHostUrl() + '/';
      //  else
      url += this.getHostUrl() + '/';
    } else {
      if (this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + "/";
      else
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + "/";
    }
    if (this.urlParam.product.toString().includes("/"))
      url += this.urlParam.product.replace("/", "");
    else
      url += this.urlParam.product;

    let lastIndexUrl = url + '/v1/cavisson/netdiagnostics/webddr/lastIndexOfAgg';

    this.ddrRequest.getDataInStringUsingGet(lastIndexUrl).subscribe(
      data => {
        if (data) {
          this.lastIndexForAgg = Number(data);
          console.log("last index from config ", data);
        }
        this._DdrAggFlowmapService.startTime = this.fullJson.startTimeStamp;
        this._DdrAggFlowmapService.endTime = this.fullJson.endTimeStamp;
        /*  let date = new Date(this.startTime); // some mock date
        this._DdrAggFlowmapService.startTime = date.getTime();
        date  = new Date(this.endTime);
        this._DdrAggFlowmapService.endTime  = date.getTime();*/
        this._DdrAggFlowmapService.btName = row.bt;
        this._DdrAggFlowmapService.tierName = row.tier;
        let btcat = this.getBTCategoryId(this.urlParam.btCategory);
        if (btcat)
          this._ddrData.btCategory = btcat;
        let refresh = "1";
        if (this.commonService.enableQueryCaching == 1) {
          refresh = "0";
        }
        let displayName;
        if (!this._ddrData.dcName)
          displayName = '-';
        else
          displayName = this._ddrData.dcName;
        let keyUrl = url + '/v1/cavisson/netdiagnostics/webddr/enableAggView'  //it for get key of enabling the agg view
        url += '/v1/cavisson/netdiagnostics/ddr/TrxFlowMapDataToDraw/' + this.urlParam.testRun + '?&testRun=' + this.urlParam.testRun + '&strStartTime=' + this._DdrAggFlowmapService.startTime + '&strEndTime=' + this._DdrAggFlowmapService.endTime + '&statusCode=-2'
          + '&tierName=' + this._DdrAggFlowmapService.tierName + '&btName=' + row.bt + '&start=' + this.startIndexForAgg + '&end=' + this.lastIndexForAgg + '&btCategory=' + btcat + '&refresh=' + refresh + '&isCompress=0&isMDC=1&isSDC=1&enableIps=true&displayName=' + displayName;

        console.log("urlll formeeddddd", url);
        this.dialogForTierMerge = false;
        this._DdrAggFlowmapService.isRefreshCase = false;
        this.commonService.loaderForDdr = true;
        this._DdrAggFlowmapService.getKeyForView(keyUrl);
        this._DdrAggFlowmapService.createFirstLevelJson(url);
      });
  }
}
