import { TierStatusTimeHandlerService } from './tier-status-time-handler.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { CustomSelectItem } from './../../../services/exec-dashboard-config.service';
import { Injectable } from '@angular/core';
import { ExecDashboardCommonRequestHandler } from './../../../services/exec-dashboard-common-request-handler.service';
import { TierStatusCommonDataHandlerService } from './tier-status-common-data-handler.service';
import { Observable } from "rxjs";
// import 'rxjs/add/observable/forkJoin';
import { forkJoin } from 'rxjs';
import { ExecDashboardUtil } from '../../../utils/exec-dashboard-util';

import { SystemMetrices } from './../const/tier-status-interfaces';
import { ObjectKeys } from './../utils/ts-enum';
import { DC_INFO, ONLINE_FLOWMAP_LIST, SERVER_TIME, TIER_GROUP_LIST, TIER_INFO, ONLINE_FLOWMAP_INFO } from './../const/url-const';

import * as moment from 'moment';
import 'moment-timezone';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { SessionService } from 'src/app/core/session/session.service';


export interface NodeServerPresetURLParams {
  // {servletName: servletName, serverType: serverType, dcName: dcName, host: host, nodePresetURL: nodePresetURL, testRun: testrunNumber};
  servletName: string;
  serverType: number;
  dcName: string;
  hostOrigin: string;
  presetURL: string;
  testrunNumber: string;
}

@Injectable()
export class TierStatusDataHandlerService {


  /*Observable sources for favorite data updation.*/
  private broadcaster = new Subject<string>();
  Observable$ = this.broadcaster.asObservable();
  listOfSelectedNodeForFlowmap: any = '';
  isMinMax: boolean = false;
  isMinimize: boolean = false;
  showDashboard: boolean = false;
  isDataAvailable: boolean = true;
  continuousMode: boolean=false;
  // enabeSystemMetrices: any = { 'tps-metrics': true ,  'res-metrics': true ,  'cpu-metrics': true ,  'err-metrics': true }];
  enabeSystemMetrices: any = [
    { 'metrics': true, 'name': 'TPS', src: './images/page_legend.png', tooltip: 'Transaction Per Sec' },
    { 'metrics': true, 'name': 'Res', src: './images/response_legend.png', tooltip: 'Average Response Time(ms)' },
    { 'metrics': true, 'name': 'CPU', src: './images/cpu_legend.png', tooltip: 'CPU Utilization(%)' }
    /*{ 'metrics': true, 'name': 'Error', src: './images/error.png' }*/];
  legendMetrices: any = [
    { src: '../dashboard/images/legend.png' }
    /*{ 'metrics': true, 'name': 'Error', src: './images/error.png' }*/];
  private tsObserver = new Subject;
  $tsProvider = this.tsObserver.asObservable();
  msgs = [];
  DCsInfo: any[] = [];
  dcList: CustomSelectItem[] = [];
  saveAppURL = "";
  tsBlockUI: boolean = false;

  //For right click on tier
  private rightClickObs = new Subject;
  $rightClickObs = this.rightClickObs.asObservable();
  reqVecName = ""
  /*to hold tier status json*/
  tierStatusData: any = {};
  selectedTierData: any = {};
  /**
   * for multi DC
   */
  isAllDCs: boolean = false;
  multiDCMode: boolean = false;
  MultiDCsArr: any[] = [];

  hideTierIntForselectedMenuNode: boolean = false;

  selectedNode: string = '';

  tierList = [];
  groupList = [];
  flowmapList = [];
  setDefaultList = [];//array of flowmap names which can be made default in ManageFlowmap Dialog box
  isGrouped: boolean = false;// variable to handle groups in righ panel
  saveAsFlowmap: boolean = false;
  saveFlowmap: boolean = false;
  selectedFlowmap: string = 'default';
  valueType: string = 'average';
  connectionCall: string = 'slideShowCall';
  showFlag: boolean = false;

  tierStatusCordinates: any = {};
  manageFlowMaps: boolean = false;
  flowMapJsonArr: any = [];
  sharedFlowMapList: any = [];

  systemFM : string = '';
  defaultFM : string = '';
  selectedMenuNode: string = '';
  selectedMenuActualNameNode: string = '';
  selectedMenuNodeEntity: number;

  // for renaming flowmap ---
  renameFlowMap: boolean = false;
  newFlowMapName: string = '';
  oldFmap: string = '';

  dbIntegrationName: string = 'NonIP'

  configureMetrices: any = { 'globalRenaming': true, 'nonZeroIP': true, 'tps': false, 'res': false, 'cpu': false, 'showSpecifiedTier': false, 'applyToIP': false };
  configureValues: any = { 'currentOperation': '', 'filterOption1': '', 'filterOption2': '', 'filterOption3': 'filterOption3', 'filterOption4': '' };

  hideTierObj: any = { 'hideTier': [] };
  isFlowMapSelected: boolean = false;
  editFlowmapToggle: boolean = false;
  _changeIcon: boolean = false;

  hideIntegrationTiersList: object = {};
  _serverDateTime: string = new Date().toISOString();
  _selectedNodeDCName: string = "";
  _isRefreshMode: boolean = true;
  isRefreshMode: boolean = true; //for maintaining state of play pause button
  _testRun: string = "-1";
  private _isStoreView: boolean = false;
  isTransactionScoreCardAvlbl = true;
  isNonNd: boolean = false;

  //To know is flowmap is single Tier Mode or Full Flowmap
  isSingleTierMode: boolean = false;
  //To show Grid view  or Flowmap view
  isShowGridView: boolean = true;
  constructor(public requestHandler: ExecDashboardCommonRequestHandler,
    public _config: ExecDashboardConfigService,
    public _timeHandlerService: TierStatusTimeHandlerService,
    public cavConfig: CavConfigService,
    public commonTierHandler: TierStatusCommonDataHandlerService,
    private sessionService: SessionService) { }

  /**
   * method to handle multidc urls
   * @param params 
   */
  getMultiDCsUrl(params) {
    let tempURL = "";
    let tempFlowmapName = this.commonTierHandler.flowMapName
    if (this.commonTierHandler.flowMapMode != '0') {
      tempFlowmapName = tempFlowmapName + '/' + this.commonTierHandler.reqVecName + '/Server/Instance/';
    }
    try {
      let nodeServerInfo = this.getNodePresetURL();
      let isAll = '';
      this.commonTierHandler.serverType = nodeServerInfo.serverType;
      this.commonTierHandler.dcName = nodeServerInfo.dcName;
      if(nodeServerInfo.servletName=='IntegratedServer')
        isAll = 'ALL';
      tempURL = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + nodeServerInfo.servletName + `/v2/geoend2end/ExecDashbaord/tierInfo?reqTestRunNum=` + nodeServerInfo['testrunNumber'] + `&sessLoginName=` + this._config.$userName + `&valueType=${this.commonTierHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=` + sessionStorage.getItem('dcArr') + `&resolution=${this.commonTierHandler.resolution}&serverType=${this.commonTierHandler.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${isAll}&isIncDisGraph=true&_=1528723946180&reqVecName=${this.commonTierHandler.reqVecName}`;
      // if (sessionStorage.isMultiDCMode === "true") {
      //   if (this.$MultiDCsArr.length > 1) { // checking if multiple DCs selected
      //     dcInfo = this.$DCsInfo.filter(e => e.isMaster)[0]; // getting the properties of master dc and setting into dcinfo
      //     this.$servletName = 'IntegratedServer';
      //     dcName = sessionStorage.getItem('masterDC');
      //     
      //   } else {
      //     dcInfo = this.$DCsInfo.filter(e => e.dc == this.$MultiDCsArr[0])[0]; // Only one dc selected. getting the properties like host, port, etc and setting into dcinfo
      //     this.$servletName = 'DashboardServer';
      //     this.commonTierHandler.serverType = 0;
      //   }
      //     // dcInfo = this.$DCsInfo.filter(e => e.isMaster)[0]; // getting the properties of master dc and setting into dcinfo
      //     // this.$servletName = 'IntegratedServer';
      //     // this.commonTierHandler.serverType = 1;
      //     // this.commonTierHandler.dcName = "ALL";

      //     if (this.$isStoreView) {
      //       this.$MultiDCsArr = [this.cavConfig.$eDParam.dcName];
      //     }
          
      //     this.$servletName = nodeServerInfo.servletName;
      //     // this.commonTierHandler.dcName = nodeServerInfo.dcName;
      //     this.commonTierHandler.serverType = nodeServerInfo.serverType;
      //   let dcArr = this.$MultiDCsArr;
      //   // tempURL = dcInfo['protocol'] + '://' + dcInfo['ip'] + ':' + dcInfo['port'] + `/${this.$servletName}` + `/v2/geoend2end/ExecDashbaord/tierInfo?reqTestRunNum=` + dcInfo['testRun'] + `&sessLoginName=` + sessionStorage.getItem('sesLoginName') + `&valueType=${this.commonTierHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=` + dcArr.toString() + `&resolution=${this.commonTierHandler.resolution}&serverType=${this.commonTierHandler.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=` + this._config.$isIncDisGraph + `&_=1528723946180&reqVecName=${this.commonTierHandler.reqVecName}`;
      //   tempURL = nodeServerInfo.hostOrigin + '/' + nodeServerInfo.presetURL + `/${this.$servletName}` + `/v2/geoend2end/ExecDashbaord/tierInfo?reqTestRunNum=` + nodeServerInfo['testrunNumber'] + `&sessLoginName=` + sessionStorage.getItem('sesLoginName') + `&valueType=${this.commonTierHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=` + dcArr.toString() + `&resolution=${this.commonTierHandler.resolution}&serverType=${this.commonTierHandler.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=` + this._config.$isIncDisGraph + `&_=1528723946180&reqVecName=${this.commonTierHandler.reqVecName}`;
      //   // for save data
      //   saveJsonUrl = dcInfo['protocol'] + '://' + dcInfo['ip'] + ':' + dcInfo['port'] + `/${this.$servletName}/v2/geoend2end/ExecDashbaord/tierInfo?reqTestRunNum=` + dcInfo['testRun'] + `&sessLoginName=` + sessionStorage.getItem('sesLoginName') + `&valueType=${this.commonTierHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=` + dcArr.toString() + `&resolution=${this.commonTierHandler.resolution}&serverType=1&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=ALL&isIncDisGraph=` + this._config.$isIncDisGraph + `&_=1528723946180&reqVecName=${this.commonTierHandler.reqVecName}`;
      //   this.$saveAppURL = saveJsonUrl;
      // } else {
      //   // let tempDCs = this.$MultiDCsArr && this.$MultiDCsArr.length?this.$MultiDCsArr[0]:"";
      //   // dcInfo = tempDCs.length && this.$DCsInfo && this.$DCsInfo.length ? this.$DCsInfo.filter(e => e.dc == tempDCs) : [];
      //   // if (dcInfo.length == 0) {
      //   //   dcInfo = { protocol: window.location.protocol.split(":")[0], ip: this.cavConfig.$host, port: this.cavConfig.$port, testRun: this._config.$testRun }
      //   // } else {
      //   //   dcInfo = dcInfo[0];
      //   // }
      //   tempURL = nodeServerInfo.hostOrigin + '/' + nodeServerInfo.presetURL + `/${this.$servletName}` + `/v2/geoend2end/ExecDashbaord/tierInfo?reqTestRunNum=` + nodeServerInfo['testrunNumber'] + `&sessLoginName=` + sessionStorage.getItem('sesLoginName') + `&valueType=${this.commonTierHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=` + dcArr.toString() + `&resolution=${this.commonTierHandler.resolution}&serverType=${this.commonTierHandler.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=` + this._config.$isIncDisGraph + `&_=1528723946180&reqVecName=${this.commonTierHandler.reqVecName}`;
      //   // tempURL = dcInfo['protocol'] + '://' + dcInfo['ip'] + ':' + dcInfo['port'] + `/DashboardServer` + `/v2/geoend2end/ExecDashbaord/tierInfo?reqTestRunNum=` + dcInfo['testRun'] + `&sessLoginName=` + this._config.$userName + `&valueType=${this.commonTierHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=` + tempDCs + `&resolution=${this.commonTierHandler.resolution}&serverType=0&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=` + tempDCs + `&isIncDisGraph=` + this._config.$isIncDisGraph + `&_=1528723946180&reqVecName=${this.commonTierHandler.reqVecName}`;
      //   // for save data
      //   // saveJsonUrl = dcInfo['protocol'] + '//' + dcInfo['ip'] + ':' + dcInfo['port'] + `/DashboardServer/RestService/KPIWebService/saveAppTierJson?requestType=geoMap&storeAlertType=&reqTestRunNum=` + dcInfo['testRun'];
      //   // saveJsonUrl = saveJsonUrl + '&dcName=' + this.$MultiDCsArr.toString() + '&isAll=' + 'ALL';
      //   // this.$saveAppURL = saveJsonUrl;
      // }

      return tempURL = tempURL + '&GRAPH_KEY=' + params['graphKey'];

    } catch (error) {
      console.log("error in getMultiDCsUrl");
      console.log(error);
    }
  }

  getNodePresetURL(dcsInfo = [], selectedDCs = []): NodeServerPresetURLParams {
    return this.createNodePresetURL(dcsInfo, selectedDCs);
  }

  createNodePresetURL(dcsInfo: any[], selectedDCs: string[]): NodeServerPresetURLParams {
    let masterDC = sessionStorage.getItem('masterDC');
    let servletName: string = "IntegratedServer";
    let serverType: number = 1;
    let dcName: string = this._config.$dcNameArr.toString();
    // let host: string = window.location.origin.includes("/localhost:")?this.cavConfig.$serverIP:window.location.origin;
    let host : string = window.location.origin;
    let nodePresetURL: string = "tomcat/" + (masterDC != undefined ? masterDC : "");
    let testrunNumber: string = sessionStorage.getItem('EDTestrun');
    let flowmapDir = ".flowmapsAll";
    if (sessionStorage.isMultiDCMode == "true") {
      // if (selectedDCs.length != dcsInfo.length) {
      //   if (selectedDCs.length <= 1) {
      //     servletName = "DashboardServer";
      //     serverType = 0;
      //     dcName = selectedDCs.toString();
      //     nodePresetURL = "tomcat/" + dcName;
      //     testrunNumber = dcsInfo.filter(e => e.dc == dcName)[0].testRun;
      //     flowmapDir = ".flowmaps";
      //   } else {
      //     dcName = selectedDCs.toString();
      //   }
      // }
    } else {
      servletName = "DashboardServer";
      serverType = 0;
      dcName = '';
      nodePresetURL = "";
      testrunNumber = sessionStorage.getItem('EDTestrun');
      flowmapDir = ".flowmaps";
    }
    this.commonTierHandler.flowMapDir = flowmapDir;
    // if (sessionStorage.isMultiDCMode != "true" || activeDC != "ALL") {
    //   servletName = dcsInfo.length == 1?"IntegratedServer":"DashboardServer";
    //   serverType = dcsInfo.length == 1?1:0;
    //   dcName = sessionStorage.isMultiDCMode != "true"?"":selectedDCs.toString();
    //   nodePresetURL = sessionStorage.isMultiDCMode != "true"?"":"tomcat/" + activeDC;
    //   testrunNumber = dcsInfo.filter(e => e.dc == activeDC)[0].testRun;
    // } else if (sessionStorage.isMultiDCMode == "true" && activeDC == "ALL") {
    //   if (selectedDCs.length == dcsInfo.length) {
    //     dcName = "ALL";
    //   } else {
    //     dcName = selectedDCs.toString();
    //   }
    // }
    return {servletName: servletName, serverType: serverType, dcName: dcName, hostOrigin: host, presetURL: nodePresetURL, testrunNumber: testrunNumber};
  }

  /**
  * method for handling multi dc 
  * @param callback 
  */
  getMultiDCsData(callback) {
    let url = this.getMultiDCsUrl(this.cavConfig.$tierStatusParam);
    try {
      this.requestHandler.getDataFromGetRequest(url, (data) => {
        if (data === null || data.status === 404 || data == [] || data.displayMsg === 'ConnectionRefused') {
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          callback('Error');
        }
        if (data.errorCode === 102 || data.errorCode === 101) {
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          callback('Error');
        }
        this.$tierStatusData = data;
        callback(data);
      });

    } catch (error) {
      console.log('Error in getMultiDCsData ');
      console.log(error);
    }
  }

  /**
   * this method is used for sending request to server for server time, flowmap list and group list
   */
  getDataForFirstCall(callback) {
    this.getServerTime();
    this.getGroupList();
    callback();
  }
  /**
   * For tier status time period apply
   */
  getTSData(obj) {
    this.tsObserver.next(obj);
  }
  getDcInfo(callback) {
    // DC_INFO
    // let url = window.location.origin + '/' + DC_INFO;
    // this.requestHandler.getDataFromGetRequest(url, data => {
      // let data = this.cavConfig.getDCInfoObj();
      // this.$DCsInfo = data.filter(e => e.productType == "netdiagnostics" || e.toString().toLowerCase().productType == "ed");
      // this.$dcList.length = 0;
      // this.$DCsInfo.forEach(e => { this.$dcList.push({ label: e.dc, value: e.dc, selected: this.$MultiDCsArr && this.$MultiDCsArr.includes(e.dc) ? true : false });});

      if (this.cavConfig.getActiveDC() == 'ALL') {
        this.$isAllDCs = true;
        // if (this.$MultiDCsArr.length == 0) {
        //   this.$MultiDCsArr = this.$DCsInfo.map(e => { return e.dc });
        // }
        this.commonTierHandler.flowMapDir = '.flowmapsAll';
        // this._config.$setHostUrl = this.$DCsInfo.map(e => { if (e.isMaster == true) return e.protocol + "://" + e.ip + ":" + e.port + "/"; else return false }).filter(e => e).toLocaleString();
        this._config.$setHostUrl = window.location.origin + '/';
        this.$servletName = 'IntegratedServer';
        this.commonTierHandler.serverType = 1;
        this.commonTierHandler.dcName = 'ALL';
        this.cavConfig.$eDParam.testRun = sessionStorage.getItem("EDTestrun");
      } else {
        // // checking if selected dc is available in this.$DCsInfo list
        // if (this.$DCsInfo.filter(e => e.dc == this.cavConfig.getActiveDC()).length == 0) {
        //   this.$noLoadDetected = true; // showing no load detected
        //   callback(null);
        // }
        // this.$isAllDCs = false;
        // this.commonTierHandler.flowMapDir = '.flowmaps';
        // this.$MultiDCsArr = this.cavConfig.getActiveDC().length ? [this.cavConfig.getActiveDC()] : [this.$DCsInfo[0].dc];
        // this.$dcList.forEach((e, i) => this.$dcList[i].disabled = true);
        // this._config.$setHostUrl = this.$DCsInfo.map(e => { if (e.dc == this.$MultiDCsArr.toLocaleString()) return e.protocol + "://" + e.ip + ":" + e.port + "/"; else return false }).filter(e => e).toLocaleString();
        // this.$servletName = 'DashboardServer';
        // this.commonTierHandler.serverType = 0;
        // this.commonTierHandler.dcName = this.$MultiDCsArr.toString();
        // this.cavConfig.$eDParam.testRun = this.$DCsInfo.filter(e => e.dc == this.commonTierHandler.dcName)[0].testRun;
      }

      callback({});
    // })
  }

  getTierStatusDataFromServer(callback) {
    let gTObject = this._timeHandlerService.getGraphTimeObject();
    this.$tsBlockUI = true;
    let nodeServerInfo = this.getNodePresetURL();
    nodeServerInfo.testrunNumber = this.sessionService.testRun.id;
    let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + this.$servletName + TIER_INFO + `?GRAPH_KEY=${gTObject['graphTime']}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=&flowMapName=${this.selectedFlowmap}&dcName=${this.commonTierHandler.dcName}&resolution=${this.commonTierHandler.resolution}&serverType=${this.commonTierHandler.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=true&_=1528723946180`
    url = this.getMultiDCsUrl(this.cavConfig.$eDParam);
    this.requestHandler.getDataFromGetRequest(url, (data) => {
      if (data === null || data.status === 404 || data == []) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Data Not available' });
        this.$tsBlockUI = false;
        return;
      }
      this.$tsBlockUI = false;
      if (this._timeHandlerService.$appliedTimePeriod === 'Yesterday' || this._timeHandlerService.$appliedTimePeriod === 'Last Week Same Day' || gTObject['strSpecialDay']) {
        if (this._timeHandlerService.$appliedTimePeriod === 'Yesterday') {
          // Getting Previous date
          this._timeHandlerService.$graphTimeLabel = 'Yesterday';
        } else if (this._timeHandlerService.$appliedTimePeriod === 'Last Week Same Day') {
          this._timeHandlerService.$graphTimeLabel = 'Last Week Same Day ' + gTObject['graphTimeLabel'];
        }
        else if (gTObject['strSpecialDay']) {
          this._timeHandlerService.$graphTimeLabel = gTObject['strSpecialDay'];
        }
      }
      else {
        this._timeHandlerService.$graphTimeLabel = gTObject['graphTimeLabel'];
      }
      this.$tierStatusData = data;
      //for passing data for default selected
      this.selectedNode = data.nodeInfo[0].actualTierName;
      this.getTierData();
      sessionStorage.setItem('graphTimeLabel', this._timeHandlerService.$graphTimeLabel);
      callback(data);
    });
  }

  /**
   * request to get date and time from server
   */
  getServerTime() {
    let nodeServerInfo = this.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + SERVER_TIME;
    this.requestHandler.getDataFromGetTextRequest(url, (data) => {
      if (data.toString().startsWith("\"")) {
        data = data.toString().trim().slice(1,-1);
      }
      this.$serverDateTime = data;
    });
  }

   //Purpose : To show check(Green Check) on selected Flowmap
  onSelectFlowmap(flowmapName) {
    for (let index = 0; index < this.$flowmapList.length; index++) {
      if (this.$flowmapList[index].value == flowmapName) {
        this.$flowmapList[index].selected = true
      }
      else {
        this.$flowmapList[index].selected = false
      }
    }
  }

  getPresetURLIfExists(nodeServerInfo: NodeServerPresetURLParams, addForwardSlash: boolean = true, addBackwardSlash: boolean = true) {
    return nodeServerInfo.presetURL.length?((addForwardSlash?"/":"") + nodeServerInfo.presetURL + (addBackwardSlash?"/":"")):(addBackwardSlash?"/":"");
  }

  getOnlineFlowMapList(callback) {
    let nodeServerInfo = this.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + ONLINE_FLOWMAP_LIST + `?sessLoginName=${this._config.$userName}&flowMapName=${this.selectedFlowmap}&flowMapDir=${nodeServerInfo.dcName == "ALL"?".flowmapsAll":this.commonTierHandler.flowMapDir}&DCs=${nodeServerInfo.dcName}`;
    this.requestHandler.getDataFromGetRequest(url, (data) => {
      this.flowMapJsonArr = [];
      this.sharedFlowMapList = [];
      this.flowmapList = [];
      let sharedList: any;
      if (data) {
	this.$systemFM = data.systemDefaultFM;
      this.$defaultFM = data.defaultFlowmap;
        let flowmaparr: any = []
        if (!sessionStorage.EDSelectedFlowmap || sessionStorage.EDSelectedFlowmap == "undefined") {
         if(data.systemDefaultFM != "" && data.defaultFlowmap == 'default'){
            this.$selectedFlowmap = data.systemDefaultFM;
          }
          else{
            this.$selectedFlowmap = data.defaultFlowmap;
          }
	}
        this.commonTierHandler.$flowMapName = this.$selectedFlowmap;
        if (data.flowmapList && data.flowmapList.split(',').length > 0) {
          flowmaparr = data.flowmapList.split(',');
        }
        flowmaparr.unshift('default');

        let finArr = [...flowmaparr];
        let shareArr = data.sharedFlowmapList.split(',');
        if (shareArr.length > 0) {
          for (let s of shareArr) {
            if (s.trim().length && !finArr.includes(s)) {
              finArr.push(s);
            }
          }
        }
        this.flowmapList = ExecDashboardUtil.createSelectItem(finArr);
        let n = finArr.length;
        for (let index = 0; index < n; index++) {// Iterating over finArr to add selected property for shared flowmap in flowmaplist
          const element = finArr[index];
          /**
           * for first time we need to make default flowmap as selected flowmap
           * and if a flowmap is selected then we need to maintain it as selected.
           */
          if (this.isFlowMapSelected == false) {
            if (this.selectedFlowmap == this.flowmapList[index].value)
              this.flowmapList[index]['selected'] = true;
            else
              this.flowmapList[index]['selected'] = false;
          }
          else {
            //TODO: add code to provice selected flowmap from previous flowmap
            if (element == this.selectedFlowmap) {
              this.flowmapList[index]['selected'] = true;
            }
            else {
              this.flowmapList[index]['selected'] = false;
            }
          }
        }
      }
      let flowmapData = data;
      let flowMapObj = this.flowmapInfo(flowmapData);//returns a sorted object of flowmapInfo

      for (let key in flowMapObj) {
        if (flowMapObj.hasOwnProperty(key)) {
          const element = flowMapObj[key];
          element['check'] = false;
          this.sharedFlowMapList.push({ 'name': element['name'], 'shared': element.shared });
          this.flowMapJsonArr.push(element);
        }
      }
      let tempArr = this.flowMapJsonArr.filter(e => e.owner).map(e => e.name);//filtering flowmap which are specific for logged-in user
      this.setDefaultList = this.flowmapList.filter(e => tempArr.includes(e.label) || e.label == "default");
      this.commonSort(this.setDefaultList, "label");//sorts the list in lexicographical order in basis of label
      callback();

    });
  }

  /**
   * getting group list if exist on the server
   */
  getGroupList() {
    let nodeServerInfo = this.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + TIER_GROUP_LIST + `?flowMapName=${this.commonTierHandler.$flowMapName}&flowMapDir=${nodeServerInfo.dcName == "ALL"?".flowmapsAll":this.commonTierHandler.flowMapDir}`;
    this.requestHandler.getDataFromGetRequest(url, (data: []) => {
      if (data && data.length !== 0) {
        this.groupList = [...data];
        console.log(this.groupList);
      }
    })
  }

  dateFormatter(d) {
    var sMonth = d.split(" ")[0].split('/')[0];
    var sDay = d.split(" ")[0].split('/')[1];
    if (parseInt(sMonth) < 10 && sMonth.charAt(0) != '0') {
      sMonth = '0' + sMonth;
    }
    if (parseInt(sDay) < 10 && sDay.charAt(0) != '0') {
      sDay = '0' + sDay;
    }
    d = sMonth + "/" + sDay + "/" + d.split(" ")[0].split('/')[2] + " " + d.split(" ")[1];
    return d;
  }



  leftPanelLayoutHandler(msg) {
    this.tsObserver.next(msg);
  }

  flowChartActionHandler(msg) {
    this.tsObserver.next(msg);
  }

  rightClickActionHandler(actualTierName) {
    this.rightClickObs.next(actualTierName);
  }


  getPercentageForServer(instancecolorpct, totalServers) {
    var instancecolorpctObj = {};

    if (totalServers > 0) {
      //alert("instancecolorpct " + JSON.stringify(instancecolorpct));
      instancecolorpctObj['major'] = Math.round((instancecolorpct.major / totalServers) * 100) + Math.round((instancecolorpct.normal / totalServers) * 100);
      instancecolorpctObj['critical'] = Math.round((instancecolorpct.critical / totalServers) * 100);
      instancecolorpctObj['normal'] = 100 - ((instancecolorpctObj['critical']) + (instancecolorpctObj['major']));
      //alert("instancecolorpct 1" + JSON.stringify(instancecolorpctObj));
      //alert("major " + instancecolorpct.major + ", critical " + instancecolorpct.critical + ", minor " + instancecolorpct.normal );
    }
    else {
      instancecolorpctObj['normal'] = 100;
      instancecolorpctObj['major'] = 0;
      instancecolorpctObj['critical'] = 0;
    }
    return instancecolorpctObj;
  }


  //used for calculate percentage of alert (Normal, Major, Critical)
  getPercentage(instancecolorpct) {
    var objinstancecolorpct = {};
    let sum = (parseInt(instancecolorpct.normal) + parseInt(instancecolorpct.major) + parseInt(instancecolorpct.critical));

    if (sum > 0) {
      objinstancecolorpct['normal'] = Math.round((instancecolorpct.normal / sum) * 100);
      objinstancecolorpct['major'] = Math.round((instancecolorpct.major / sum) * 100);
      objinstancecolorpct['critical'] = Math.round((instancecolorpct.critical / sum) * 100);
    }
    else {
      objinstancecolorpct['normal'] = 100;
      objinstancecolorpct['major'] = 0;
      objinstancecolorpct['critical'] = 0;
    }
    return objinstancecolorpct;
  }

  /**
   * method to create the data for right panel
   * called for each flowmap when loaded.
   * creating data for Alert,Integration point health and Transaction score card
   */
  getTierData() {
    try {
      console.log('getTierData called ' + this.selectedNode);
      // this.selectedNode = 'WCS-DELIVERY-STAGE';
      console.log(this.tierStatusData);

      let tempObject = {};
      if (this.tierStatusData.hasOwnProperty('reqVectorName')) {
        tempObject['reqVectorName'] = this.tierStatusData.reqVectorName;
      }
      else {
        tempObject['reqVectorName'] = '';
      }
      let critical;
      let major;
      let normal;

      let serverHealth;
      let criticalPer;
      let majorPer;
      let normalPer;
      let serverCritical;
      let serverMajor;
      let serverNormal;

      let criticalIntegrationPer;
      let majorIntegrationPer;
      let normalIntegrationPer;

      let integerationCritical;
      let integerationMajor;
      let integerationNormal;

      let eventCritical;
      let eventMajor;
      let eventNormal;
      let eventCriticalPer;
      let eventMajorPer;
      let eventNormalPer;

      let totalCount = 0;
      let totalServer = 0;
      let totalIntegration = 0;

      let isGroupSelected = false;
      let isIndividualTier = false;

      const tempNodeData = this.tierStatusData.nodeInfo;
      for (let i = 0; i < tempNodeData.length; i++) {
        let arrTier = tempNodeData[i].actualTierName.split(',');
        // console.log('arrTiers ---------- ' ,arrTier);
        if (arrTier.toString().indexOf(this.selectedNode) !== -1) {
          // console.log("hello inside " + tempNodeData[i].actualTierName + ' ' + this.selectedNode);
          if (tempNodeData[i].actualTierName === this.selectedNode) {
            // console.log('inside check ---- ')
            if (tempNodeData[i].hasOwnProperty('groupName')) {
              // console.log('inside group check ');
              // isGroup = true;
              isGroupSelected = true;
              tempObject['groupNames'] = tempNodeData[i].groupName;
              tempObject['actualTierName'] = tempNodeData[i].actualTierName;
            }
            else {
              // selectedTierInfo = selectedTierName
            }

          }
        }

        // for actual Tier Name
        if (tempNodeData[i].actualTierName === this.selectedNode) {
          isIndividualTier = false;
          let tempData ;    //change 
          if (this.tierStatusData.hasOwnProperty('reqVectorName')) {
            tempData = tempNodeData[i].instanceColorPct;
          }
          else{
            tempData = tempNodeData[i].serverColorPct
          }
          serverHealth = this.getPercentageForServer(tempData, tempNodeData[i].servers);

          criticalPer = serverHealth['critical'];
          majorPer = criticalPer + serverHealth['major'];
          normalPer = majorPer + serverHealth['normal'];

          serverCritical = serverHealth['critical'];
          serverMajor = serverHealth['major'];
          serverNormal = serverHealth['normal'];

          var ipObj = tempNodeData[i]['integrationPointPCT'];
          var integrationhealth = this.getPercentageForServer(ipObj, tempNodeData[i]['integration']);
          // var integrationhealth = this.getPercentage(ipObj);


          // Integration point health
          criticalIntegrationPer = integrationhealth['critical'];
          majorIntegrationPer = criticalIntegrationPer + integrationhealth['major'];
          normalIntegrationPer = majorIntegrationPer + integrationhealth['normal'];



          integerationCritical = integrationhealth['critical'];
          integerationMajor = integrationhealth['major'];
          integerationNormal = integrationhealth['normal'];

          console.log("data handler integerationCritical: ", integerationCritical);
          console.log("data handler integerationMajor: ", integerationMajor);
          console.log("data handler integerationNormal: ", integerationNormal);

          // event data don't know about it now.
          eventCritical = tempNodeData[i].eventAlerts.critical;
          eventMajor = tempNodeData[i].eventAlerts.major;
          eventNormal = tempNodeData[i].eventAlerts.normal;

          let eventData = this.getPercentage(tempNodeData[i].eventAlerts);
          eventCriticalPer = eventData['critical'];
          eventMajorPer = eventCriticalPer + eventData['major'];
          eventNormalPer = eventMajorPer + eventData['normal'];

          if (tempNodeData[i]["TransactionScorecard"] != undefined) {
            critical = Math.round(tempNodeData[i]["TransactionScorecard"].VerySlow.percentage) + Math.round(tempNodeData[i]["TransactionScorecard"].Errors.percentage);
            major = Math.round(tempNodeData[i]["TransactionScorecard"].Slow.percentage);
            normal = (100 - (critical + major));
          }

          //if (tempNodeData[i].srvCnt != undefined)
          //totalServer = tempNodeData[i].srvCnt;
          if (tempNodeData[i].servers != undefined) {
            totalServer = tempNodeData[i].servers;
            console.log("data handler service Total Servers 1: " + totalServer);
          }
          tempObject['TransactionScorecard'] = tempNodeData[i]['TransactionScorecard'];

        }
        else if (tempNodeData[i].hasOwnProperty('individualTierStats') && tempNodeData[i].individualTierStats) {
          console.log('inside individual data  ---- ');
          console.log(tempNodeData[i].individualTierStats);
          console.log(this.selectedNode);

          for (let j = 0; j < tempNodeData[i].individualTierStats.length; j++) {
            let tempIndividualTierStats = tempNodeData[i].individualTierStats[j];
            if (tempIndividualTierStats.tierName === this.selectedNode) {
              isIndividualTier = true;
              isGroupSelected = true;
              tempObject['groupNames'] = '';
              tempObject['groupNames'] = tempNodeData[i].groupName + '.' + this.selectedNode;
              // tempObject['groupNames'] = tempObject['groupNames'] + '.' + this.selectedNode;
              totalCount = tempIndividualTierStats.count;
              //totalServer = tempIndividualTierStats.srvCnt
              totalServer = tempIndividualTierStats.servers
              console.log("data handler service Total Servers 2: " + totalServer);
              totalIntegration = tempIndividualTierStats.intregation;
              var serverNo = 0;
              var integrationNo = 0;
              if (tempIndividualTierStats.srvCnt != undefined)
                serverNo = tempIndividualTierStats.srvCnt;

              if (tempIndividualTierStats.intregation != undefined)
                // url = `https://204.62.12.119:4431/DashboardServer/RestService/KPIWebService/CreateNewGroup?sessLoginName=Cavisson&flowMapDir=.flowmaps&selectedGroupName=${this.newGrpName}&tiersName=${tiers}&flowMapName=default`
                // url = `https://204.62.12.119:4431/DashboardServer/RestService/KPIWebService/CreateNewGroup?sessLoginName=Cavisson&flowMapDir=.flowmaps&selectedGroupName=${this.newGrpName}&tiersName=${tiers}&flowMapName=default`
                // url = `https://204.62.12.119:4431/DashboardServer/RestService/KPIWebService/CreateNewGroup?sessLoginName=Cavisson&flowMapDir=.flowmaps&selectedGroupName=${this.newGrpName}&tiersName=${tiers}&flowMapName=default`
                // url = `https://204.62.12.119:4431/DashboardServer/RestService/KPIWebService/CreateNewGroup?sessLoginName=Cavisson&flowMapDir=.flowmaps&selectedGroupName=${this.newGrpName}&tiersName=${tiers}&flowMapName=default`
                // url = `https://204.62.12.119:4431/DashboardServer/RestService/KPIWebService/CreateNewGroup?sessLoginName=Cavisson&flowMapDir=.flowmaps&selectedGroupName=${this.newGrpName}&tiersName=${tiers}&flowMapName=default`
                integrationNo = tempIndividualTierStats.intregation;

              var obj = tempIndividualTierStats.serverColorPct;
              let serverhealth = this.getPercentageForServer(obj, serverNo);

              criticalPer = serverhealth['critical'];
              majorPer = criticalPer + serverhealth['major'];
              normalPer = majorPer + serverhealth['normal'];

              serverCritical = serverhealth['critical'];
              serverMajor = serverhealth['major'];
              serverNormal = serverhealth['normal'];

              var ipObj1 = tempIndividualTierStats.intregationColorPct;

              var integerationhealth = this.getPercentageForServer(ipObj1, integrationNo);
              criticalIntegrationPer = integerationhealth['critical'];
              majorIntegrationPer = criticalIntegrationPer + integerationhealth['major'];
              normalIntegrationPer = majorIntegrationPer + integerationhealth['normal'];

              integerationCritical = integerationhealth['critical'];
              integerationMajor = integerationhealth['major'];
              integerationNormal = integerationhealth['normal'];

              eventCritical = tempIndividualTierStats.eventAlerts.critical;
              eventMajor = tempIndividualTierStats.eventAlerts.major;
              eventNormal = tempIndividualTierStats.eventAlerts.normal;

              let eventData = this.getPercentage(tempIndividualTierStats.eventAlerts);
              eventCriticalPer = eventData['critical'];
              eventMajorPer = eventCriticalPer + eventData['major'];
              eventNormalPer = eventMajorPer + eventData['normal'];

              if (tempIndividualTierStats["TransactionScorecard"] != undefined) {
                critical = Math.round(tempIndividualTierStats["TransactionScorecard"].VerySlow.percentage) + Math.round(tempIndividualTierStats["TransactionScorecard"].Errors.percentage);
                major = Math.round(tempIndividualTierStats["TransactionScorecard"].Slow.percentage);
                normal = (100 - (critical + major));
              }

              tempObject['TransactionScorecard'] = tempIndividualTierStats['TransactionScorecard'];

            }
          }
        }
        else {
          // isIndividualTier = false;
        }
        tempObject['isIndividualTier'] = isIndividualTier;
        tempObject['isGroup'] = isGroupSelected;
        tempObject['alertCritical'] = eventCritical;
        tempObject['alertMajor'] = eventMajor;
        tempObject['alertNormal'] = eventNormal;

        
        let sum;
        if(normal)
          sum = critical + major + normal;
        else{
          critical = 0;
          major = 0;
          normal = 100;
          sum = critical + major + normal;
        }
        let businessCriticalPer = Math.round((critical / sum) * 100);
        let businessMajorPer = businessCriticalPer + Math.round((major / sum) * 100);
        let businessNormalPer = businessMajorPer + Math.round((normal / sum) * 100);


        if ((normal == 0) && (major == 0) && (critical == 0))
          normal = 100;

        // totalServer  
        tempObject['businessCriticalPer'] = businessCriticalPer;
        tempObject['businessMajorPer'] = businessMajorPer;
        tempObject['businessNormalPer'] = businessNormalPer;
        tempObject['businessCritical'] = critical;
        tempObject['businessMajor'] = major;
        tempObject['businessNormal'] = normal;

        tempObject['TotalServer'] = totalServer;
        tempObject['serverCritical'] = serverCritical;
        tempObject['serversMajor'] = serverMajor;
        tempObject['serverNormal'] = serverNormal;

        tempObject['integrationCritical'] = integerationCritical;
        tempObject['integrationMajor'] = integerationMajor;
        tempObject['integrationNormal'] = integerationNormal;
      }
      console.log('getTierData before returning ');
      console.log(tempObject);
      this.$selectedTierData = tempObject;
      this.broadcaster.next('PanelDataAvailable');
    } catch (error) {
      console.log('error in getTierData');
      console.log(error);
    }
  }


  /******************** method to get data in handler service *******************/
  getConnectionDetails(callback) {
    try {
      let arr = [];
      let individualNodes = this.$selectedMenuActualNameNode.split(",");
      let tempData = this.tierStatusData;
      let tempNodeData = this.selectedMenuNode;
      {
        for (let i = 0; i < tempData['callData'].length; i++) {
          for (let j = 0; j < tempData['callData'][i].backEnd.length; j++) {
            if (tempNodeData === tempData['callData'][i].backEnd[j].name) {
              // Check if node is a JMS type 
              if(tempData['callData'][i].backEnd[j].consumer || tempData['callData'][i].backEnd[j].producer){
                if (tempData['callData'][i].backEnd[j].consumer) { // swap the source and target if true
                  arr.push(this.getCallDetailsInfoFromObj(true, tempNodeData, tempData['callData'][i].name, tempData['callData'][i].backEnd[j].consumer.data, true));
                }
                if (tempData['callData'][i].backEnd[j].producer) { // Do not change the position of source and target
                  arr.push(this.getCallDetailsInfoFromObj(false, tempNodeData, tempData['callData'][i].name, tempData['callData'][i].backEnd[j].producer.data, true));
                }
              } else {
                arr.push(this.getCallDetailsInfoFromObj(false, tempNodeData, tempData['callData'][i].name, tempData['callData'][i].backEnd[j].data[0], false));
              }
            }
          }
        }

      }
      callback(arr);
    } catch (error) {
      console.log('Error in getConnectionDetails');
      console.log(error);

    }
  }

  /**
   * @param isJMSCNode {boolean} used to store if selected node contains a JMSC node
   * @param tempNodeData {string} Selected node name
   * @param name {string} callout target/source name
   * @param data {object} Call details data of the current selected node
   * @optional @param isJMSType {boolean} if selected node is a JMS type no matter JMSC/JMSP
   * @return {object} Returns an object needed to show the information in the call details window
   */
  getCallDetailsInfoFromObj(isJMSCNode, tempNodeData: string, name: string, data: any, isJMSType?: boolean) {
    let tempObj = {};
    if (isJMSCNode) {
      tempObj['from'] = tempNodeData;
      tempObj['to'] = name;
    } else {
      tempObj['from'] = name;
      tempObj['to'] = tempNodeData;
    }
    tempObj['response'] = isJMSType?data.totalResTime:data.resCalls;
    if (tempObj['response'] != undefined) {
      tempObj['response'] = (+tempObj['response']).toFixed(3);
    }
    let tempCalls = isJMSType?data.totalCalls:data.calls;
              if (!isNaN(tempCalls)) {
                if (tempCalls < 1 && tempCalls > 0) {
                  tempObj['cps'] = (+tempCalls).toFixed(3);
                } else {
                  tempObj['cps'] = Math.round(tempCalls);
                }
              } else {
                tempObj['cps'] = tempCalls;
              }
    tempObj['count'] = isJMSType?data.totalCallCount:data.callCount
    let tempError = isJMSType?data.totalErrors:data.totalErrors;
    if (tempError == null || tempError == undefined || tempError == '-') {
                tempError = 0
              }
              tempObj['error'] = tempError;
    let tempErrPer = +(isJMSType?data.totalErrorsPerSec:data.totalErrors / this.getTimeInSeconds()) ;
    if (tempErrPer == null || tempErrPer == undefined) {
                tempErrPer = 0
              }
              tempObj['eps'] = tempErrPer;
    return tempObj;
  }
  /**
      * Sends two http GET requests to a backend and waits for all of them to finish. In this example,
      * there are only two parallel HTTP requests, but you can use as many as you need
      * @returns {Observable<any[]>}
      */
  getDataFromTwoResources(url1, url2) {
    // The URLs in this example are dummy
    try {
      let urlData1 = this.requestHandler._httpClientService.get(url1);
      console.log('urlData1--', urlData1);
      let urlData2 = this.requestHandler._httpClientService.get(url2);
      console.log('urlData2--', urlData2);
      // return Observable.forkJoin([urlData1, urlData2]);
      return forkJoin(urlData1, urlData2);
    }
    catch (e) {
      console.log(e);

    }
  }

  postDataFromTwoResources(request1, request2) {
    try {
      console.log("postDataFromTwoResources called ------->  ");
      console.log(request1);
      console.log(request2);
      let url1 = 'https://204.62.12.119:4431/dashboard/view/tierInfoUtils.jsp?';
      let url2 = 'https://204.62.12.119:4431/dashboard/view/tierInfoUtils.jsp?';
      let urlData1 = this.requestHandler._httpClientService.post(url1, request1);
      let urlData2 = this.requestHandler._httpClientService.post(url2, request2);

      return forkJoin(urlData1, urlData2);
    } catch (error) {

    }
  }

  getInstanceFlowMapData(InstanceInfo, callback) {
    try {
      console.log('getInstanceFlowData called ', InstanceInfo);
      let instance = InstanceInfo['Instance'];
      let reqVecName = InstanceInfo['Tier'] + '>' + InstanceInfo['Server'] + '>' + InstanceInfo['Instance'];
      this.reqVecName = reqVecName
      let sessLoginName = reqVecName + '/Server/Instance/'
      let flowMapName = 'default/' + sessLoginName;
      let nodeServerInfo = this.getNodePresetURL();
      let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `${this.$servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=instanceFlowMap&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${sessLoginName}&valueType=${this.commonTierHandler.valueType}&reqVecName=${reqVecName}&GRAPH_KEY=${this._config.$actTimePeriod}&flowMapName=${flowMapName}&dcName=${InstanceInfo.dc}&resolution=${this.commonTierHandler.resolution}&serverType=${nodeServerInfo.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=true`;
      if (InstanceInfo['Tier'] && InstanceInfo['Server'] && InstanceInfo['Instance'])
        this.requestHandler.getDataFromGetRequest(url, (data) => {
          console.log(data);
          callback(data);
        })

    } catch (error) {
      console.log('Error in getInstanceFlowData');
      console.log(error);
    }
  }

  onRightClickEvent(msg) {
    // alert('onRightClickEvent called ');
    console.log('onRightClickEvent');
    console.log(msg);
    this.showFlag = msg.event;
    this.tsObserver.next(msg);
  }

  getTopTransactionData(obj, type, callback) {
     //console.log("ashish getTopTransactionData called");
    try {
      //To handle TPS of Tier and Instance,In case of Instance obj['actualTierName'] should be Tier>Server>Instance
      let multipleDC : boolean = false;
      let urlArr = [];
      this.$selectedNode = this.$selectedMenuActualNameNode;
      this.getTierData();
      let reqData = this.$selectedTierData;
      let arr = reqData.reqVectorName.split('>');
      if (arr.length > 1) {
        let tierServerInstance = arr.join('%3E')
        obj['actualTierName'] = tierServerInstance;
      }
      let url = '';
      let nodeServerInfo = this.getNodePresetURL();
      //console.log("ashish actualTierName", obj['actualTierName']);
      //console.log("ashish isMultiDCMode",sessionStorage.getItem("isMultiDCMode"));
      //In case of MultiDC the tierName is coming as DCName.TierName,but in url tierName should be passed in order to get data
      if (obj['actualTierName'].includes(".") && sessionStorage.getItem("isMultiDCMode") === "true") {

        let dcSize;
        if (obj['tooltip']['dc']) {
          dcSize = obj['tooltip']['dc'].split(',').length;

        }
        
        if(obj.groupName == undefined){
          //Single Tier case
  	  //console.log("ashish single Tier Case")
          // let tierName = obj['actualTierName'].split(".")[1];
          let tierName = obj['actualTierName'];
          //console.log("ashish dcArray",obj['tooltip']['dc'].split(','));
          if(obj['tooltip']['dc'].split(',').indexOf(obj['actualTierName'].split(".")[0])>-1)
             tierName = obj['actualTierName'].split(".").splice(1).join(".");
          //console.log("ashish tierName:",tierName);
          url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=BTTableData&GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&arrBTTier=${tierName}&arrBTActualTier=&transType=${type}&dcName=${obj['tooltip']['dc']}&resolution=Auto&serverType=${nodeServerInfo.serverType}&isAll=ALL&isIncDisGraph=true`;
        }
        else{
          if (dcSize == 1) {
            let tierName;
            let tierList = obj['actualTierName'].split(",");
            for (let i = 0; i < tierList.length; i++) {
              tierList[i] = tierList[i].split(".")[1];
            }
            let tierTemp = tierList.join(",");
            let groupWithTierName = obj.groupName + ":" + tierTemp;
          url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=BTTableData&GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&arrBTTier=&arrBTActualTier=${groupWithTierName}&transType=${type}&dcName=${obj['tooltip']['dc']}&resolution=Auto&serverType=${nodeServerInfo.serverType}&isAll=${obj['tooltip']['dc']}&isIncDisGraph=true`;
          }
          else {
            multipleDC = true;
            let dcTierObj = {};
            /*
            dcTierObj = {
              ND1 : 'A,B,C',
              ND2 : 'D,E'
              .
              .
              where key is DC and value is a String containing Tiername
            }
            */
            let tierArr = obj['actualTierName'].split(",");
            tierArr.forEach(e=>{
              let arr = e.split('.');
              let tier : string;
              if(!dcTierObj.hasOwnProperty(arr[0])){
                dcTierObj[arr[0]] = '';
                tier = dcTierObj[arr[0]]; // get the value of key(DC)
                tier = tier.concat(arr[1]); //adding tiername to tier with same key(DC)  e.g 'A,B,C'........
              }
              else{
                tier = dcTierObj[arr[0]]; // get the value of key(DC)
                tier = tier.concat(',' + arr[1]); //adding tiername to tier with same key(DC)  e.g 'A,B,C'........
              }

              dcTierObj[arr[0]] = tier; // assign the new tiername string to key
            });
            console.log("DC Tier Obj : ", dcTierObj);

            for(var key in dcTierObj){
              if(dcTierObj.hasOwnProperty(key)){
                let groupWithTierName = obj.groupName + ":" + dcTierObj[key];
                let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=BTTableData&GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&arrBTTier=&arrBTActualTier=${groupWithTierName}&transType=${type}&dcName=${key}&resolution=Auto&serverType=${nodeServerInfo.serverType}&isAll=ALL&isIncDisGraph=true`;
                urlArr.push(url);
              }
            }
          }
        }
      }
      else {
        //Single DC - Group
        if (obj.groupName != undefined) {
          let groupWithTierName = obj.groupName + ":" + obj.actualTierName;
          url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=BTTableData&GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&arrBTTier=&arrBTActualTier=${groupWithTierName}&transType=${type}&dcName=${obj['tooltip']['dc']}&resolution=Auto&serverType=${nodeServerInfo.serverType}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=true`;
        }
        else {
          //Single DC - Single Tier
          url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=BTTableData&GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&arrBTTier=${obj['actualTierName']}&arrBTActualTier=&transType=${type}&dcName=${obj['tooltip']['dc']}&resolution=Auto&serverType=${nodeServerInfo.serverType}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=true`;

          }
      }
      /*
       let url = this._config.$getHostUrl + `${this.$servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=BTTableData&GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${this._config.$testRun}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&arrBTTier=${obj['actualTierName']}&arrBTActualTier=&transType=${type}&dcName=${obj['tooltip']['dc']}&resolution=Auto&serverType=${this.commonTierHandler.serverType}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=false`;
      */

      if(multipleDC){
        let observableArr = [];
        urlArr.forEach(element=>{
          observableArr.push(this.requestHandler.getRequest(element));
        });
        forkJoin(observableArr).subscribe(data=>{
          let n = data.length;
          let finalData = data[0];
          for (let i = 1; i <n; i++) {
            const element = data[i];
            // concat all the data array of response in final array
            finalData['edTierNodeList'][0]['data'] = finalData['edTierNodeList'][0]['data'].concat(element['edTierNodeList'][0]['data'])
        }
          this.commonSortInt(finalData['edTierNodeList'][0]['data'], 'TPS','des');
          let tableData = this.getTopTransactionTableData(finalData);
          callback(tableData);
        });
      }
      else{
        this.requestHandler.getDataFromGetRequest(url, (data) => {
          let tableData = this.getTopTransactionTableData(data);
          console.log(data);
          callback(tableData);
        });
      }
    } catch (error) {
      console.log('error in getTopTransactionData ');
      console.log(error);
    }
  }

  getTopTransactionTableData(data) {
    try {
      console.log('getTopTransactionTableData called ');
      let tempData = Object.assign({}, data);
      let tableDataArr = []
      console.log(data);
      for (let i = 0; i < tempData['edTierNodeList'].length; i++) {
        let tabArr = [];
        for (let j = 0; j < tempData['edTierNodeList'][i]['data'].length; j++) {
          let tempObj = {};
          tempObj[ObjectKeys.tname] = tempData['edTierNodeList'][0]['tierName'];
          tempObj[ObjectKeys.btname] = tempData['edTierNodeList'][i]['data'][j]['btName'];
          tempObj[ObjectKeys.tps] = tempData['edTierNodeList'][i]['data'][j]['TPS'];
          tempObj[ObjectKeys.res] = tempData['edTierNodeList'][i]['data'][j]['RES'];
          tempObj[ObjectKeys.count] = tempData['edTierNodeList'][i]['data'][j]['count'];
          tempObj[ObjectKeys.min] = tempData['edTierNodeList'][i]['data'][j]['min'];
          tempObj[ObjectKeys.max] = tempData['edTierNodeList'][i]['data'][j]['max'];
          tempObj[ObjectKeys.avg] = tempData['edTierNodeList'][i]['data'][j]['avg'];
          tabArr.push(tempObj);
        }
        tableDataArr.push(tabArr);
      }
      console.log('getTopTransactionTableData before returning --- ');
      console.log(tableDataArr);
      return tableDataArr;
    } catch (error) {
      console.log('error in getTopTransactionTableData method ');
      console.log(error);
    }
  }

  getNodesCoordinateForSave = () => {
    let arr: any = [];
    // $.each(json.nodeInfo, function (index, val) {
    //   / iterate through nodeInfo and get ID /
    //   var id = val.name.replace(/[:\[\].{}\\&@?=/]/g, '');
    //   var actualID = val.actualTierName;
    //   arr[index] = actualID + "=" + parseInt($('#' + id).css('top').replace('px', '')) + "," + parseInt($('#' + id).css('left').replace('px', ''));
    // });
    let nodeInfo = this.tierStatusData.nodeInfo;
    for (let i = 0; i < nodeInfo.length; i++) {
      let nodeInfoObj = {};
      nodeInfoObj['id'] = nodeInfo[i].name.replace(/[:\[\].{}\\&@?=/]/g, '');
      nodeInfoObj['name'] = nodeInfo[i].actualTierName;
      nodeInfoObj['x'] = nodeInfo[i].cordinate[0];
      nodeInfoObj['y'] = nodeInfo[i].cordinate[1];
      arr[i] = nodeInfoObj['name'] + nodeInfoObj['x'];
    }
    arr = arr.join("|");

    return arr;
  }
  manageFlowMapWindow() {
    this.getOnlineFlowMapList(() => {
      this.manageFlowMaps = !this.manageFlowMaps;
    });
  }

  editFlowMapWindow() {
    this.$editFlowmapToggle = true;
    //this.commonTierHandler.$visibleTiers = [...this.tierList];
    //this.commonTierHandler.$visibleTiers = this.commonTierHandler.$visibleTiers.filter(val => !this.commonTierHandler.$hiddenTiers.includes(val));
  }


  /**
 * 
 * commmon method for sorting
 * Args 1 = List on which sorting is to be performed
 * Args 2 = Property of list on basis of which sorting is to be performed
 */
  commonSort(tempArr: any[], property: string) {
    tempArr.sort((a, b) => a[property].localeCompare(b[property]));
  }

  commonSortInt(tempArr: any[], property: string, order : string) {
    if(order=='asc'){
      tempArr.sort((a, b) => a[property] - b[property]);
    }
    else{
      tempArr.sort((a, b) => b[property] - a[property]);
    }
  }

  flowmapInfo = function (flowListJson) {
    var arrFMList = new Array();
    var arrSharedList = new Array();
    var arrRestrictedList = new Array();
    for (const key in flowListJson) {
      if (flowListJson.hasOwnProperty(key)) {
        const value = flowListJson[key];
        if (key == "flowmapList") {
          if (value != "")
            arrFMList = value.split(",");
        }
        else if (key == "sharedFlowmapList") {
          if (value != "")
            arrSharedList = value.split(",");
          if (arrSharedList.includes("")) {
            let n = arrSharedList.indexOf("");
            arrSharedList.splice(n, 1);
          }
        }
        else if (key == "restrictedFlowmapList") {
          if (value != "")
            arrRestrictedList = value.split(",");
        }
      }
    }

    var json = {};
    for (let i = 0; i < arrFMList.length; i++) {
      if (arrSharedList.indexOf(arrFMList[i]) == -1) {
        json[arrFMList[i]] = { "shared": false, "owner": true };
      }
    }
    for (let i = 0; i < arrSharedList.length; i++) {
      if (arrFMList.indexOf(arrSharedList[i]) != -1) {
        json[arrSharedList[i]] = { "shared": true, "owner": true };
      }
      else {
        if (arrFMList.indexOf(arrSharedList[i]) == -1)
          json[arrSharedList[i]] = { "shared": true, "owner": false };
      }
    }
    for (let i = 0; i < arrRestrictedList.length; i++) {
      if (json.hasOwnProperty(arrRestrictedList[i]))
        delete json[arrRestrictedList[i]];
    }
    for (let k in json) {
      json[k]['name'] = k;
    }

    let sortedArr = Object.keys(json).map(e => json[e]);//converts json into array
    this.commonSort(sortedArr, "name");
    let n = sortedArr.length;
    let sortedObj = {};

    for (let index = 0; index < n; index++) {
      const item = sortedArr[index];
      sortedObj[item['name']] = item;
    }

    return sortedObj;

  }

  getReqForManageFlowMap(url) {
    try {
      console.log('inside sharedFlowMap');
      this.requestHandler.getDataFromGetRequest(url, () => {
        console.log('success');
      });
    } catch (error) {
      console.log('error inside sharedFlowMap()', error);

    }
  }

  /**
   *  to get dashboard data for selected Node
   *  params: selectedNode.
   */

  getDashboardDataForSelectedNode(node, callback) {
    try {
      let tempNode = node;
      let selectedDC = this.$selectedNodeDCName;
      let nodeServerInfo = this.getNodePresetURL();
      let isAll = nodeServerInfo.servletName=='IntegratedServer' ? 'ALL' : '';
      let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo)  + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=chartData&tierName=${tempNode}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&GRAPH_KEY=${this._config.$actTimePeriod}&dcName=${selectedDC}&resolution=${this.commonTierHandler.resolution}&serverType=${nodeServerInfo.serverType}&isAll=${isAll}&isIncDisGraph=true`;
      this.requestHandler.getDataFromGetRequest(url, (data) => {
        callback(data);
      })
    } catch (error) {
      console.log('error in getDashboardDataForSelectedNode ');
      console.log(error);
    }
  }

  /**
   * Called after Flowmap changed. No configuration like group list, hidden tiers, etc changed if default flowmap is selected
   * @param flowmapName Newly selected flowmap name
   */
  searchNodesDropdownList = {display: 'none'}; //change regarding 77667(show/ hide search node)
  showSearch=true;
  onClickOfFlowmap(flowmapName,) {
    console.log("onClickOfFlowmap ");
    this.searchNodesDropdownList = {display: 'none'};//hide search bar on new flowmap selection
    this.showSearch=false; // to manage if/else condition in left panel showSearchNodes method
    this.$selectedFlowmap = flowmapName; //setting selected flowmap
    this.commonTierHandler.$flowMapName = flowmapName;
    sessionStorage.EDSelectedFlowmap = flowmapName;
    this.clearFlowmapConfig(); // clearing all the active settings applied in the flowmap
    this.getOnlineFlowmapInfo((data) => {
      if (data != undefined && data != true) {
        let jsonStructure = this.stringToJSON(data);
        this.commonTierHandler.updateServiceParameters(jsonStructure);
      }
      else {
        this.commonTierHandler.cleanServiceParameters();
      }
      this.getDataForFirstCall(() => { // getting server time and grouplist for the selected group
        this.tsObserver.next('FLOWMAP_CHANGED') // calling the subscriber of flowmap panel component to update the full flowmap view
      })
    }, flowmapName);
  }

  /**
   * Converts string|Object to corresponding JSON
   * @param data {any} The desired string|Object
   */
  stringToJSON(data: any) : any {
    return typeof(data) == "object"?data:JSON.parse(data.trim());
  }
  /**
   * calling this function when user selects flowmaps from dropdown of menu bar in top panel 
   * this method creats an AJAX and after getting data from ajax this bradcast an observable message
   * we get that message in flowmap panel component and render the gui for the selected flowmap
   * @param flowmap 
   */
  openOnlineCopyFlowMap(flowmap) {
    let nodeServerInfo = this.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + `/DashboardServer/v2/geoend2end/ExecDashbaord/tierInfo?GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&valueType=${this.commonTierHandler.valueType}&flowMapName=${flowmap}&dcName=${this.commonTierHandler.dcName}&resolution=${this.commonTierHandler.resolution}&serverType=${nodeServerInfo.serverType}&nonZeroIP=${this.commonTierHandler.nonZeroIP}&globalRenaming=${this.commonTierHandler.globalRenaming}&isAll=${this.commonTierHandler.dcName}&isIncDisGraph=true&_=1528981435064`;
    try {
      this.requestHandler.getDataFromGetRequest(url, (data) => {
        if (data) {
          this.tierStatusData = data;
          for (let i = 0; i < this.flowmapList.length; i++) {
            if (this.flowmapList[i].value == flowmap) {
              this.flowmapList[i].selected = true;
              this.selectedFlowmap = flowmap;
            }
            else {
              this.flowmapList[i].selected = false;
            }
          }
          this.$tierStatusData = data;
          this.selectedNode = data.nodeInfo[0].actualTierName;
          this.getTierData();
          let emitData = {};
          emitData['msg'] = 'REFLECT_LAYOUT';
          emitData['json'] = data;
          this.tsObserver.next(emitData)
        }
      })
    } catch (e) {
      console.log(`getting error in openOnlineCopyFlowMap`, e)
    }
  }

  /**
   * get online flowmap info if flowmap name is not default
   * to get all the informations regarding flowmaps like flowmapmode,
   * hiddenTierList, filters and other properties.
   */
  getOnlineFlowmapInfo(callback, flowmap?) {
    try {
      if ((this.selectedFlowmap == 'default' && flowmap == undefined) || (flowmap != undefined && flowmap == 'default')) {
        callback(true);
      }
      else {
        let tempFlowMap = this.selectedFlowmap;
        if (flowmap != undefined) {
          tempFlowMap = flowmap;
        }
        let nodeServerInfo = this.getNodePresetURL();
        let flowmapInfoUrl = nodeServerInfo.hostOrigin + this.getPresetURLIfExists(nodeServerInfo) + ONLINE_FLOWMAP_INFO + `?flowMapDir=${nodeServerInfo.dcName == "ALL"?".flowmapsAll":this.commonTierHandler.flowMapDir}&flowMapName=${tempFlowMap}&sessLoginName=${this._config.$userName}`
        this.requestHandler.getDataFromGetRequest(flowmapInfoUrl, (data) => {
          callback(data);
        });
      }
    } catch (error) {
      console.log("error in getOnlineFlowmapInfo");
      console.log(error);
    }
  }

  /**
   * clears all the configurations of currently selected flowmap
   * @returns void
   */
  public clearFlowmapConfig() {
    this.commonTierHandler.flowMapMode = '0';
    this.$isSingleTierMode = false;
    this.groupList = [];
    this.$hideIntegrationTiersList = {};
    this.commonTierHandler.cleanServiceParameters();
    this.listOfSelectedNodeForFlowmap = '';
  }

  /**
   * checks if the selected flowmap is the user's flowmap or shared flowmap
   * @param selected_flowmap 
   */
   checkOwner(flowmap: string): boolean {
    
     if(flowmap=="default"){//bcuz there is no entry in of default in flowMapJsonArr
      return true;
    }

    let n = this.$flowMapJsonArr.length;// array containing name, owner, shared and selected property of flowmaps
    for (let index = 0; index < n; index++) {
      const element = this.$flowMapJsonArr[index];
      if (element.name == flowmap) {
        return element.owner;
      }
    }
  }


  /**
   * setter and getter for handling view minimize and maximize
   */
  public set $isMinMax(value: any) {
    this.isMinMax = value;
  }
  public get $isMinMax() {
    return this.isMinMax;
  }

  /**
   * Setter and getter for handling show minimize when user double clicks on node
   */
  public set $isMinimize(value: any) {
    this.isMinimize = value;
  }
  public get $isMinimize() {
    return this.isMinimize;
  }

  /**
   * setter and getter for handling dashboard hide and show
   */
  public set $showDashboard(value: any) {
    this.showDashboard = value;
  }
  public get $showDashboard() {
    return this.showDashboard;
  }

  /**
   * keyword to show and hide the right panel based on data availablity
   */
  public set $isDataAvailable(value: any) {
    this.isDataAvailable = value;
  }
  public get $isDataAvailable() {
    return this.isDataAvailable;
  }

  /**
   * show hide system metrics and graphs 
   */
  public set $enabeSystemMetrices(value: any) {
    this.enabeSystemMetrices = value;
  }
  public get $enabeSystemMetrices() {
    return this.enabeSystemMetrices;
  }
  public set $legendMetrices(value: any) {
    this.legendMetrices = value;
  }
  public get $legendMetrices() {
    return this.legendMetrices;
  }

  /*
   *variable to carry dcINfo
   */
  public set $DCsInfo(value: any) {
    this.DCsInfo = value;
  }
  public get $DCsInfo() {
    return this.DCsInfo;
  }

  public set $systemFM(value: string) {
    this.systemFM = value;
  }
  public get $systemFM() {
    return this.systemFM;
  }
  public set $defaultFM(value: string) {
    this.defaultFM = value;
  }
  public get $defaultFM() {
    return this.defaultFM;
  }

  public set $dcList(value: CustomSelectItem[]) {
    this.dcList = value;
  }
  public get $dcList(): CustomSelectItem[] {
    return this.dcList
  }
  // isAllDCsSelected
  public set $isAllDCs(value: any) {
    this.isAllDCs = value;
  }
  public get $isAllDCs() {
    return this.isAllDCs;
  }

  // multiDCMode
  public set $multiDCMode(value: any) {
    this.multiDCMode = value;
  }
  public get $multiDCMode() {
    return this.multiDCMode;
  }
  //MultiDCsArr 
  public set $MultiDCsArr(value: any) {
    sessionStorage.setItem("EDSelectedDCList", value);
    this.MultiDCsArr = value;
  }
  public get $MultiDCsArr() {
    return this.MultiDCsArr && this.MultiDCsArr.length ? this.MultiDCsArr:[];
  }
  // saveAppURL
  public set $saveAppURL(value: any) {
    this.saveAppURL = value;
  }
  public get $saveAppURL() {
    return this.saveAppURL;
  }
  public set $tierStatusData(value: any) {
    this.tierStatusData = value;
  }
  public get $tierStatusData() {
    return this.tierStatusData;
  }
  public set $selectedNode(value: any) {
    this.selectedNode = value;
  }
  public get $selectedNode() {
    return this.selectedNode;
  }

  public set $tierList(value: any) {
    this.tierList = value;
  }
  public get $tierList() {
    return this.tierList;
  }

  public set $groupList(value: any) {
    this.groupList = value;
  }
  public get $groupList() {
    return this.groupList;
  }

  public set $flowmapList(value: any) {
    this.flowmapList = value;
  }
  public get $flowmapList() {
    return this.flowmapList;
  }
  public set $setDefaultList(value: any) {
    this.setDefaultList = value;
  }
  public get $setDefaultList() {
    return this.setDefaultList;
  }
  /*For loader handling*/
  public set $tsBlockUI(value: boolean) {
    this.tsBlockUI = value;
  }
  public get $tsBlockUI(): boolean {
    return this.tsBlockUI;
  }
  // selectedTierData
  public set $selectedTierData(value: any) {
    this.selectedTierData = value;
  }
  public get $selectedTierData() {
    return this.selectedTierData;
  }
  // SelectedTierIsGroup
  public set $isGrouped(value: any) {
    this.isGrouped = value;
  }
  public get $isGrouped() {
    return this.isGrouped;
  }

  public set $saveAsFlowmap(value: boolean) {
    this.saveAsFlowmap = value;
  }
  public get $saveAsFlowmap() {
    return this.saveAsFlowmap;
  }
  public set $saveFlowmap(value: boolean) {
    this.saveFlowmap = value;
  }
  public get $saveFlowmap() {
    return this.saveFlowmap;
  }
  public set $selectedFlowmap(value: any) {
    this.selectedFlowmap = value;
    sessionStorage.setItem("EDSelectedFlowmap",this.selectedFlowmap);
  }
  public get $selectedFlowmap() {
    return this.selectedFlowmap;
  }
  // valueType
  public set $valueType(value: any) {
    this.valueType = value;
  }
  public get $valueType() {
    return this.valueType;
  }
  public set $connectionCall(value: any) {
    this.connectionCall = value;
  }
  public get $connectionCall() {
    return this.connectionCall;
  }
  // showFlag
  public set $showFlag(value: any) {
    this.showFlag = value;
  }
  public get $showFlag() {
    return this.showFlag;
  }

  //holding tier status cordinates value
  public set $tierStatusCordinates(value: any) {
    this.tierStatusCordinates = value;
  }
  public get $tierStatusCordinates() {
    return this.tierStatusCordinates;
  }
  public set $manageFlowMaps(value: boolean) {
    this.manageFlowMaps = value;
  }
  public get $manageFlowMaps() {
    return this.manageFlowMaps;
  }
  public set $flowMapJsonArr(value: any) {
    this.flowMapJsonArr = value;
  }
  public get $flowMapJsonArr() {
    return this.flowMapJsonArr;
  }
  public set $sharedFlowMapList(value: any) {
    this.sharedFlowMapList = value;
  }
  public get $sharedFlowMapList() {
    return this.sharedFlowMapList;
  }

  public set $selectedMenuNode(value: any) {
    this.selectedMenuNode = value;
  }
  public get $selectedMenuNode() {
    return this.selectedMenuNode;
  }
  public set $selectedMenuActualNameNode(value: any) {
    this.selectedMenuActualNameNode = value;
  }
  public get $selectedMenuActualNameNode() {
    return this.selectedMenuActualNameNode;
  }
  public set $selectedMenuNodeEntity(value: any) {
    this.selectedMenuNodeEntity = value;
  }
  public get $selectedMenuNodeEntity() {
    return this.selectedMenuNodeEntity;
  }

  public set $renameFlowMap(value: boolean) {
    this.renameFlowMap = value;
  }
  public get $renameFlowMap() {
    return this.renameFlowMap;
  }
  public set $newFlowMapName(value: any) {
    this.newFlowMapName = value;
  }
  public get $newFlowMapName() {
    return this.newFlowMapName;
  }
  public set $oldFmap(value: any) {
    this.oldFmap = value;
  }
  public get $oldFmap() {
    return this.oldFmap;
  }

  //to store the selected Tiers DB integration point name to send to DDR
  public set $dbIntegrationName(value: any) {
    this.dbIntegrationName = value;
  }
  public get $dbIntegrationName() {
    return this.dbIntegrationName;
  }

  public set $configureMetrices(value: any) {
    this.configureMetrices = value;
  }
  public get $configureMetrices() {
    return this.configureMetrices;
  }
  public set $configureValues(value: any) {
    this.configureValues = value;
  }
  public get $configureValues() {
    return this.configureValues;
  }

  public set $hideTierObj(value: any) {
    this.hideTierObj = value;
  }
  public get $hideTierObj() {
    return this.hideTierObj;
  }

  public set $editFlowmapToggle(value: boolean) {
    this.editFlowmapToggle = value;
  }
  public get $editFlowmapToggle() {
    return this.editFlowmapToggle;
  }
  public set $changeIcon(value: boolean) {
    this._changeIcon = value;
  }
  public get $changeIcon() {
    return this._changeIcon;
  }

  public set $hideIntegrationTiersList(value) {
    this.hideIntegrationTiersList = value;
  }

  public get $hideIntegrationTiersList() {
    return this.hideIntegrationTiersList;
  }

  public set $serverDateTime(value) {
    this._serverDateTime = value;
  }

  public get $serverDateTime() {
    return this._serverDateTime;
  }

  public set $isRefreshMode(val) {
    this._isRefreshMode = val;
  }
  public get $isRefreshMode(): boolean {
    return this._isRefreshMode;
  }
  public set $selectedNodeDCName(value: string) {
    this._selectedNodeDCName = value;
  }
  public get $selectedNodeDCName(): string {
    return this._selectedNodeDCName;
  }
  public set $testRun(value: string) {
    this._testRun = value;
  }
  public get $testRun(): string {
    return this._testRun;
  }

  _showResponseDialog: boolean = false;

  public set $showResponseDialog(value: boolean) {
    this._showResponseDialog = value;
  }
  public get $showResponseDialog(): boolean {
    return this._showResponseDialog;
  }

  public set $isStoreView(flag: boolean) {
    this._isStoreView = flag;
  }
  public get $isStoreView(): boolean {
    return this._isStoreView;
  }
  private _serverInfo: string = "";
  public set $serverInfo(t: string) {
    this._serverInfo = t;
  }
  public get $serverInfo(): string {
    return this._serverInfo;
  }
  // servletName will be either DashboardServer or IntegratedServer
  private servletName: string = "DashboardServer";
  public set $servletName(t: string) {
    this.servletName = t;
  }
  public get $servletName(): string {
    return this.servletName;
  }
  /**
   * setter and getter for handling listOfSelectedNodeForFlowmap 
   */
  public set $listOfSelectedNodeForFlowmap(value: any) {
    this.listOfSelectedNodeForFlowmap = value;
  }
  public get $listOfSelectedNodeForFlowmap() {
    return this.listOfSelectedNodeForFlowmap;
  }

  /**
   * This property is used to set the Z-Index of CSS property for the selected node
   */
  private _global_Z_Index = 100;
  public get $globalZIndex() {
    return ++this._global_Z_Index;
  }

  private _tooltipObject: any[] = []
  public get $tooltipObject() {
    return this._tooltipObject
  }
  public set $tooltipObject(obj: any) {
    this._tooltipObject.push(obj)
  }

  public clearTooltipObjects() {
    this.$tooltipObject.forEach(e => {
      e.renderer.setStyle(e.nativeElement, 'display', 'none');
    });
    this._tooltipObject = [];
  }

  // this object holds last node right clicked
  private _rightClickNode: any = null;
  public get $rightClickNode(): any {
    return this._rightClickNode;
  }
  public set $rightClickNode(node: any) {
    this._rightClickNode = node;
  }

  // This property holds node name of single mode flowmap opened
  private _flowmapForSelectedTierName: string = "";
  public get $flowmapForSelectedTierName(): string {
    return this._flowmapForSelectedTierName;
  }
  public set $flowmapForSelectedTierName(_n: string) {
    this._flowmapForSelectedTierName = _n;
  }

  public set $hideTierIntForselectedMenuNode(value: any) {
    this.hideTierIntForselectedMenuNode = value;
  }
  public get $hideTierIntForselectedMenuNode() {
    return this.hideTierIntForselectedMenuNode;
  }

  private _noLoadDetected: boolean = false;
  public get $noLoadDetected(): boolean {
    return this._noLoadDetected;
  }
  public set $noLoadDetected(flag: boolean) {
    this._noLoadDetected = flag;
    if (flag) {
      this.requestHandler.configUtilityService.progressBarEmit({ flag: false, forceWait: false }); // remove loading spinner
    }
  }

  // This returns the time interval for refresh data in milliseconds
  public get $refreshInterval(): number {
    return sessionStorage.refreshInterval ? (+sessionStorage.refreshInterval) : 120000;
  }
  //Getter and Setter for isSingleTierMode
  public get $isSingleTierMode(): boolean {
    return this.isSingleTierMode;
  }
  public set $isSingleTierMode(flag: boolean) {
    this.isSingleTierMode = flag;
  }
  public get $isShowGridView(): boolean {
    return this.isShowGridView
  }
  public set $isShowGridView(value: boolean) {
    this.isShowGridView = value;
  }

  private _singletonFlowmapSubscriber: boolean = false;
  public get $singletonFlowmapSubscriber(): boolean {
    return this._singletonFlowmapSubscriber;
  }
  public set $singletonFlowmapSubscriber(flag: boolean) {
    this._singletonFlowmapSubscriber = flag;
  }

  /* This variable set to true if tier status loaded for first time, false otherwise */
  private _flowmapLoadedFirstTime: boolean = false;
  public get $flowmapLoadedFirstTime(): boolean {
    return this._flowmapLoadedFirstTime;
  }
  public set $flowmapLoadedFirstTime(v: boolean) {
    this._flowmapLoadedFirstTime = v;
  }

  //Get Time applied in seconds
  getTimeInSeconds() {
    let value = this._config.$actTimePeriod.toLowerCase();
    if (value.startsWith('last')) {
      let arrTimeData = value.split("_");
      if (arrTimeData.length == 3) {
        if (arrTimeData[2] == 'minutes') {
          return (+arrTimeData[1] * 60);
        }
      }
      else if (arrTimeData.length == 2) {
        if (arrTimeData[1] == 'day') {
          let cuurentMoment = moment.tz(moment(), sessionStorage.getItem('timeZoneId'));
          let cuurentMomentValue = cuurentMoment.utcOffset(0).valueOf();
          let startDay = cuurentMoment.startOf('day');
          let startDayValue = startDay.utcOffset(0).valueOf();
          let timeDiffinSec = (cuurentMomentValue - startDayValue) / 1000;
          return timeDiffinSec;
        }
      }
    }
    else if (value.startsWith('yesterday')) {
      return (24 * 3600);
    }
    //Sample data :  SPECIFIED_TIME_1563820200000_1563906540000
    else if (value.startsWith('specified')) {
      let tempArr = value.split("_");
      let actualTimeInSec = ((+tempArr[3]) - (+tempArr[2])) / 1000;
      return actualTimeInSec;
    }
  }
} // end of file

