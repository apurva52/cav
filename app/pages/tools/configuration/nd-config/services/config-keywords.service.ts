import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { KEYWORD_DATA } from '../reducers/keyword-reducer';

import { BusinessTransGlobalInfo } from '../interfaces/business-Trans-global-info';
// import { BusinessTransPatternInfo } from '../interfaces/business-trans-pattern-info';
import { BusinessTransMethodInfo } from '../interfaces/business-trans-method-info';
import { Subscription } from 'rxjs';

import { BusinessTransMethodData, BusinessTransPatternData, SessionAtrributeComponentsData, HTTPRequestHdrComponentData, RulesHTTPRequestHdrComponentData, AddIPDetection, BTResponseHeaderData, HTTPResponseHdrComponentData, RulesHTTPResponseHdrComponentData } from '../containers/instrumentation-data';
import { ServiceEntryPoint, IntegrationPT, EndPoint, ErrorDetection, MethodMonitorData, NamingRuleAndExitPoint, HttpStatsMonitorData, BTHTTPHeaderData, ExceptionMonitor, ExceptionMonitorData, AsynchronousRuleType, BTHTTPBody, InterfacePoint, InterfaceEndPoint } from '../containers/instrumentation-data';
import { GroupKeyword } from '../containers/group-keyword';
import { NVAutoInjectionPolicyRule, NVAutoInjectionTagRule} from '../containers/product-integration-data';

import { BackendInfo, ServiceEntryType } from '../interfaces/instrumentation-info';
import { UserConfiguredKeywords } from '../containers/keyword-data';
import { UserConfiguredNDCKeywords } from '../containers/keyword-data';
import { httpReqHeaderInfo } from '../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../services/config-utility.service';
import { Messages, customKeywordMessage } from '../constants/config-constant'
import { NDE, NDERoutingRules } from './../containers/nde-cluster-data';
import { httpRepHeaderInfo } from '../interfaces/httpRepHeaderInfo';
import {GlobalSettings} from '../interfaces/globalSettings';

@Injectable()
export class ConfigKeywordsService {

  /**
  *To support Help Notification the getHelpContent()
  *method is made in this class
  */
  private helpContent = new Subject<Object>();

  helpContent$ = this.helpContent.asObservable();

  public getHelpContent(component: string, module: string, agentType: string) {
    console.log("com", component)
    console.log("mod", module)
    this.helpContent.next({ "component": component, "module": module, "agentType": agentType });

  }
  /**It stores keyword data */
  private _keywordData: Object;

  public get keywordData(): Object {
    return this._keywordData;
  }

  public set keywordData(value: Object) {
    this._keywordData = value;
  }
  private keywordGroupSubject = new Subject<GroupKeyword>();

  keywordGroupProvider$ = this.keywordGroupSubject.asObservable();

  /**For Configuration Screen-
   * Handled Toggle Button and Enable/Disable keyword information.
   */
  keywordGroup: GroupKeyword = {
    general: { flowpath: { enable: false, keywordList: ["bciInstrSessionPct", "enableCpuTime", "enableForcedFPChain", "correlationIDHeader", "captureMethodForAllFP", "enableMethodBreakDownTime", "methodResponseTimeFilter", "dumpOnlyMethodExitInFP"] }, hotspot: { enable: false, keywordList: ["ASSampleInterval", "ASThresholdMatchCount", "ASReportInterval", "ASDepthFilter", "ASTraceLevel", "ASStackComparingDepth"] }, thread_stats: { enable: false, keywordList: ["enableJVMThreadMonitor"] }, exception: { enable: false, keywordList: ["instrExceptions", "enableSourceCodeFilters", "enableExceptionsWithSourceAndVars"] }, header: { enable: false, keywordList: ["captureHTTPReqFullFp", "captureHTTPRespFullFp"] }, custom_data: { enable: false, keywordList: ["captureCustomData"] }, instrumentation_profiles: { enable: false, keywordList: ["instrProfile"] } },
    advance: {
      debug: { enable: false, keywordList: ['enableBciDebug', 'enableBciError', 'InstrTraceLevel', 'ndMethodMonTraceLevel'] }, delay: { enable: false, keywordList: ['putDelayInMethod'] },
      // backend_monitors: { enable: false, keywordList: ['enableBackendMonitor'] },
      generate_exception: { enable: false, keywordList: ['generateExceptionInMethod'] },
      monitors: { enable: false, keywordList: ["enableBTMonitor", "enableBackendMonitor"] }
    },
    product_integration: { nvcookie: { enable: false, keywordList: ["enableNDSession"] } }
  }

  constructor(private _restApi: ConfigRestApiService, private store: Store<Object>, private configUtilityService: ConfigUtilityService) { }

  /** For Getting all keywordData data */
  getProfileKeywords(profileId) {
    this._restApi.getDataByGetReq(`${URL.GET_KEYWORDS_DATA}/${profileId}`)
      .subscribe(data => {
        this.keywordData = data;
        // Calling toggleKeywordData for set enable/disabled keyword group data.
        this.toggleKeywordData();
        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
  }

  /** For save all keywordData data */
  saveProfileKeywords(profileId, toggle?: string) {
    this._restApi.getDataByPostReq(`${URL.UPDATE_KEYWORDS_DATA}/${profileId}`, this.keywordData)
      .subscribe(data => {
        this.keywordData = data;
        if (toggle != "toggle")
          this.configUtilityService.successMessage(Messages);

        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
  }

  /** For save all keywordData data */
  saveProfileCustomKeywords(profileId, message: string) {
    this._restApi.getDataByPostReq(`${URL.UPDATE_CUSTOM_KEYWORDS_DATA}/${profileId}`, this.keywordData)
      .subscribe(data => {
        this.keywordData = data;
        if (!message.includes("Deleted"))
          this.configUtilityService.successMessage(message);
        else
          this.configUtilityService.infoMessage(message);

        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
  }

  /**
 * This method is used to enable/disable toggle button.
 */
  toggleKeywordData() {
    let data = this.keywordData;

    //First time doesn't have keyword data then we return default keyword group data.
    if (!data)
      return this.keywordGroup;

    //moduleName -> general, advance, product_integration, instrumentation
    for (let moduleName in this.keywordGroup) {

      //keywordGroupList -> { flowpath: { enable: false, keywordList: ["k1", "k2"]}, hotspot: { enable: false, keywordList: ["k1", "k2"] }, ....}
      let keywordGroupList = this.keywordGroup[moduleName];

      //keywordKey -> flowpath, hotspot...
      for (let keywordKey in keywordGroupList) {

        //keywordInfo -> { enable: false, keywordList: ["k1", "k2"]}
        let keywordInfo = keywordGroupList[keywordKey];

        //keywordList -> ["k1", "k2"]
        let keywordList = keywordInfo.keywordList;

        for (let i = 0; i < keywordList.length; i++) {
          //If group of keywords value is not 0 that's means groupkeyword is enabled.
          if (data[keywordList[i]].value != 0 || data[keywordList[i]].value != "0") {
            //Enabling groupkeyword
            keywordInfo.enable = true;
          }
        }
      }
    }
    this.keywordGroupSubject.next(this.keywordGroup);
    //Updating groupkeyword values after reading keyword data object.
    //this.keywordGroup = this.configKeywordsService.keywordGroup;
  }

  /** Config-nd File explorer */
  private fileList = new Subject();
  fileListProvider = this.fileList.asObservable();

  updateFileList(fileList) {
    this.fileList.next(fileList);
  }

  /**Service Entry Point */
  getServiceEntryPointList(profileId): Observable<ServiceEntryPoint[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SERVICE_POINTS_TABLEDATA}/${profileId}`);
  }

  /**For getting Entry Point Type List */
  getEntryPointTypeList(): Observable<ServiceEntryType[]> {
    return this._restApi.getDataByGetReq(URL.FETCHING_SERVICE_ENTRYPOINTS_FORM);
  }

  /**Service Entry Point */
  enableServiceEntryPointList(serviceEntryId, isEnable): Observable<ServiceEntryPoint[]> {
    return this._restApi.getDataByPostReq(`${URL.ENABLE_SERVICE_ENTRY_POINTS}/${serviceEntryId}/${isEnable}`);
  }

  addServiceEntryPointData(data, profileId): Observable<ServiceEntryPoint> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_SERVICE_ENTRY_POINTS}/${profileId}`, data);
  }

  deleteServiceEntryData(data, profileId): Observable<ServiceEntryPoint> {
    return this._restApi.getDataByPostReq(`${URL.DEL_SERVICE_ENTRY_POINTS}/${profileId}`, data);
  }

  editServiceEntryPointData(data, profileId): Observable<ServiceEntryPoint> {
    let url = `${URL.EDIT_SERVICE_ENTRY_POINTS}/${profileId}/${data.id}`
    return this._restApi.getDataByPostReq(url, data);
  }

  saveServiceEntryData(profileId): Observable<ServiceEntryPoint> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_SERVICE_ENTRY_POINTS}/${profileId}`);
  }

  /**For Integration PT Detection */
  getIntegrationPTDetectionList(profileId): Observable<IntegrationPT[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_TABLEDATA}/${profileId}`);
  }

  deleteIntegrationPointData(assoId, profileId): Observable<EndPoint> {
    return this._restApi.getDataByPostReq(`${URL.DEL_INTEGRATION_POINTS}/${profileId}/${assoId}`);
  }

  getBackendList(profileId): Observable<BackendInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_TYPES}/${profileId}`);
  }

  addIntegrationPTDetectionData(profileId, data): Observable<AddIPDetection> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_BACKEND_POINT}/${profileId}`, data);
  }

  saveIntegrationPointData(profileId): Observable<AddIPDetection> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_NEW_BACKEND_POINT}/${profileId}`);
  }

  addIPNamingAndExit(profileId, backendId, data): Observable<NamingRuleAndExitPoint> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_BACKEND_POINT}/${profileId}/${backendId}`, data);
  }


  /**Transaction Configuration */

  /**Instrument Monitors */

  /**Error Detection */
  getErrorDetectionList(profileId): Observable<ErrorDetection[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_ERROR_DETECTION_TABLEDATA}/${profileId}`);
  }

  addErrorDetection(data, profileId): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_ERROR_DETECTION}/${profileId}`, data);
  }

  editErrorDetection(data, profileId): Observable<ErrorDetection> {
    let url = `${URL.EDIT_ERROR_DETECTION}/${profileId}/${data.errDetectionId}`
    return this._restApi.getDataByPostReq(url, data);
  }

  deleteErrorDetection(data, profileId): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(`${URL.DEL_ERROR_DETECTION}/${profileId}`, data);
  }

  saveErrorDetectionData(profileId): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_ERROR_DETECTION}/${profileId}`);
  }

  getExceptionMonitorList(profileId): Observable<ExceptionMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_EXCEPTION_MON_TABLEDATA}/${profileId}`);
  }

  editExceptionMonitorData(data, profileId): Observable<ExceptionMonitorData> {
    let url = `${URL.EDIT_ROW_EXCEPTION_MONITOR_URL}/${profileId}/${data.exceptionId}`
    return this._restApi.getDataByPostReq(url, data);
  }

  addExceptionMonitorData(data, profileId): Observable<ExceptionMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_EXCEPTION_MONITOR}/${profileId}`, data);
  }

  deleteExceptionMonitorData(data, profileId): Observable<ExceptionMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_EXCEPTION_MONITOR}/${profileId}`, data);
  }

  getMethodMonitorList(profileId): Observable<MethodMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_METHOD_MON_TABLEDATA}/${profileId}`);
  }

  editMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    let url = `${URL.EDIT_ROW_METHOD_MONITOR_URL}/${profileId}/${data.methodId}`
    return this._restApi.getDataByPostReq(url, data);
  }

  addMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_METHOD_MONITOR}/${profileId}`, data);
  }

  deleteMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_METHOD_MONITOR}/${profileId}`, data);
  }
  /** Method to upload EXCEPTION MONITOR file */
  uploadExceptionMonitorFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_EXCEPTION_MONITOR_FILE}/${profileId}`, arr);
  }

  saveExceptionMonitorData(profileId): Observable<ExceptionMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_EXCEPTION_MONITOR}/${profileId}`);
  }
  getListOfXmlFiles(profileId, agentType): Observable<string[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_INSTR_PROFILE_LIST}/${agentType}`);
  }


  /*  FETCH SESSION ATTRIBUTE TABLEDATA
   */

  getFetchSessionAttributeTable(profileId): Observable<SessionAtrributeComponentsData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SESSION_ATTR_TABLEDATA}/${profileId}`);
  }

  deleteSessionAttributeData(data): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_SESSION_ATTR}`, data)
  }

  addSessionAttributeData(data, profileId): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_SPECIFIC_ATTR}/${profileId}`, data);
  }

  getSessionAttributeValue(data, profileId): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_SESSION_TYPE}/${profileId}`, data);
  }

  editSessionAttributeData(data): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_SESSION_ATTR}/${data.sessAttrId}`, data)
  }


  //HTTP Stats Monitors

  addHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_HTTP_STATS_COND}/${profileId}`, data);
  }

  getHttpStatsMonitorList(profileId): Observable<HttpStatsMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_HTTP_STATS_COND_TABLEDATA}/${profileId}`);
  }

  editHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    let url = `${URL.EDIT_ROW_HTTP_STATS_MONITOR_URL}/${profileId}/${data.hscid}`
    return this._restApi.getDataByPostReq(url, data);
  }

  deleteHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_STATS_COND}/${profileId}`, data);
  }

  saveHttpStatsMonitorData(profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_HTTP_STATS_COND}/${profileId}`);
  }

  uploadHttpStatsMonitorFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_HTTPSTATS_MONITOR_FILE}/${profileId}`, arr);
  }



  /**
  *  Business Transaction Service
  *
  */

  /* Fetch  Business Trans Global Info */
  getBusinessTransGlobalData(profileId): Observable<BusinessTransGlobalInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BT_GLOBAL_DATA}/${profileId}/bussinessTransGlobal`);
  }

  /* Fetch  Business Trans Pattern Info */
  getBusinessTransPatternData(profileId): Observable<BusinessTransPatternData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BT_PATTERN_TABLEDATA}/${profileId}`);
  }

  /* Fetch  Business Trans Method Info */
  getBusinessTransMethodData(profileId): Observable<BusinessTransMethodData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BTMETHOD_URL}/${profileId}`);
  }

  /* Fetch  Business Trans Method Info */
  deleteBusinessTransMethodData(data, profileId): Observable<BusinessTransMethodInfo> {
    return this._restApi.getDataByPostReq(`${URL.DEL_METHOD_BT}/${profileId}`, data);
  }
  /* add  Business Trans Method Info */
  addBusinessTransMethod(data, profileId): Observable<BusinessTransMethodData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT_METHOD}/${profileId}`, data);
  }

  /* Edit  Business Trans Method Info */
  editBusinessTransMethod(data): Observable<BusinessTransMethodData> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_BTMETHOD}/${data.btMethodId}`, data);
  }

  /*Add Pattern Bt Data*/
  addBusinessTransPattern(data, profileId, parentBtId): Observable<BusinessTransPatternData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_BT_PATTERN_DETAILS}/${profileId}/${parentBtId}`, data);
  }

  /*EDIT Pattern Bt Data*/
  editBusinessTransPattern(data, profileId): Observable<BusinessTransPatternData> {
    let url = `${URL.EDIT_BT_PATTERN_TABLEDATA}/${profileId}/${data.id}`;
    return this._restApi.getDataByPostReq(url, data);
  }

  /*Add Pattern Bt Data*/
  addGlobalData(data, profileId): Observable<BusinessTransPatternData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT}/${profileId}`, data);
  }

  /*Get sub BT Pattern data*/
  fetchBtNames(profileId): Observable<string[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BT_NAMES}/${profileId}`);
  }

  /* Save data on file for BT Transaction window*/
  saveBusinessTransMethodData(profileId): Observable<BusinessTransMethodInfo> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_BT_TRANSACTION}/${profileId}`);
  }

  /*Add Pattern Bt Data*/
  deleteBusinessTransPattern(data, profileId): Observable<BusinessTransPatternData[]> {
    return this._restApi.getDataByPostReq(`${URL.DEL_BT_PATTERN_DETAILS}/${profileId}`, data);
  }
 
  /** Read Global threshold file */
  readGlobalThresholdFile(profileId){
    return this._restApi.getDataByGetReqWithNoJson(`${URL.READ_GLOBAL_THRESHOLD_FILE}/${profileId}`);
  }

  /**Save threshold values in globalThreshold file */
  saveGlobalThresholdFile(profileId, data){
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.SAVE_GLOBAL_THRESHOLD_FILE}/${profileId}`, arr);
  }

  
  /**Save threshold values in globalThreshold file */
  updateBTWithGlobalThreshold(btIdArr, profileId){
    return this._restApi.getDataByPostReq(`${URL.UPDATE_BT_WITH_GLOBAL_THRESHOLD}/${profileId}`, btIdArr);
  }

  /*  FETCH HTTP REQUEST HEADER TABLEDATA */
  getFetchHTTPReqHeaderTable(profileId): Observable<httpReqHeaderInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_HTTPREQ_HDR}/${profileId}`);
  }

  /* delete  Business Trans Method Info */
  deleteHTTPReqHeaderData(data, profileId): Observable<HTTPRequestHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_REQ_HDR}`, data);
  }

  /* Fetch  Business Trans Method Info */
  addHTTPReqHeaderData(data, profileId): Observable<HTTPRequestHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_HTTP_REQ_HDR}/${profileId}`, data);
  }

  /** get the HTTP Request Header Type */
  getHTTPRequestValue(data, profileId): Observable<HTTPRequestHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_HTTP_REQ_TYPE}/${profileId}`, data);
  }

  // /* Edit  Business Trans Method Info */
  // editHTTPReqHeaderData(data, profileId): Observable<HTTPRequestHdrComponentData> {
  //   let url = `${URL.UPDATE_HTTPREQHDR}/${profileId}`;
  //   return this._restApi.getDataByPostReq(url, data);
  // }

  // /* Edit  Business Trans Method Info */
  // editHTTPReqHeaderRulesData(data, ReqId): Observable<RulesHTTPRequestHdrComponentData> {
  //   let url = `${URL.ADD_RULES_HTTPREQHDR}/${ReqId}`;
  //   return this._restApi.getDataByPostReq(url, data);
  // }

  //Need more testing.
  sendRunTimeChange(url, data, profileId, callback) {
    let rtcMsg
    let rtcErrMsg;
    let URL = `${url}/${profileId}`;
    this._restApi.getDataByPostReq(URL, data).subscribe(
      data => {
        //For partial RTC
        /**
         * nd_control_rep:action=modify;result=PartialError;NodeJS:Mew:Instance1=48978;
         * NodeJS:Mew:Instance2=Currently disconnected trying to reconnect;
         */
        if (data[0].includes("PartialError")) {
          this.saveProfileKeywords(profileId);
          let arrPartialErr = []
          let arrPartialID = []
          let arr = data[0].split(";");
          for (let i = 2; i < arr.length - 1; i++) {

            //if instance is equal to numeric, then RTC is applied on that insatnce
            if (isNaN(parseInt(arr[i].substring(arr[i].lastIndexOf("=") + 1))))
              arrPartialErr.push(arr[i]);
            else
              arrPartialID.push(arr[i]);
          }
          rtcMsg = arrPartialID;
          rtcErrMsg = arrPartialErr;
        }

        //When runtime changes are applied then result=Ok
        else if (data[0].includes("result=OK") || data[0].includes("result=Ok")) {
          this.configUtilityService.infoMessage("Runtime changes applied");
          let that = this;

          //Setting timeout of 2 seconds 
          setTimeout(function () {
            // Whatever you want to do after the wait        
            that.saveProfileKeywords(profileId);
          }, 1000);

          rtcMsg = [];
          rtcErrMsg = [];
        }
        else if (data[0].includes("NoChangesInConfiguration")) {
          this.configUtilityService.errorMessage("No changes in Configuration !!!");
          rtcMsg = [];
          rtcErrMsg = [];
        }
        //When result=Error, then no RTC applied
        else {
          this.configUtilityService.errorMessage(" No runtime changes applied");
          rtcMsg = [];
          rtcErrMsg = [];
        }
        callback(rtcMsg, rtcErrMsg);
      },
      error => {
        //When runtime changes are not applied
        this.configUtilityService.errorMessage("Error : See the agent logs");
        return;
      }
    );

  }

  deleteSpecificAttrValues(listOfIDs) {
    let url = `${URL.DELETE_ATTR_RULES}`;
    return this._restApi.getDataByPostReq(url, listOfIDs);
  }

  /* Delete Http Request Header Rules  */
  deleteHttpRules(data) {
    return this._restApi.getDataByPostReq(`${URL.DELETE_HTTPREQHDR_RULES}`, data);
  }

  /* Edit Http Request Header Info */
  editHTTPReqHeaderData(data): Observable<HTTPRequestHdrComponentData> {
    let url = `${URL.UPDATE_HTTPREQHDR}/${data.httpAttrId}`;
    return this._restApi.getDataByPostReq(url, data);
  }

  //  / Delete Method Bt Rules  /
  deleteMethodBtRules(listOfIds) {
    return this._restApi.getDataByPostReq(`${URL.DEL_METHOD_RULES_BT}`, listOfIds);
  }



  /** Add BT HTTP REQUEST HEADERS */
  addBtHttpHeaders(data, profileId) {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT_HTTP_HDR_URL}/${profileId}`, data);
  }
  /** Get all BT Http header data */
  getBTHttpHdrData(profileId): Observable<BTHTTPHeaderData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BTHTTP_HDR_URL}/${profileId}`);
  }

  /** Delete BT HTTP headers Info */
  deleteBTHTTPHeaders(data, profileId): Observable<BTHTTPHeaderData> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_BT_HDR}/${profileId}`, data);
  }

  /** Delete HTTP Headers Conditions  */
  deleteHTTPHdrConditions(listOfIds) {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_HDR_COND}`, listOfIds);
  }

  /* Edit  BT HTTP Headers Info */
  editBTHTTPHeaders(data): Observable<BTHTTPHeaderData> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_BTHTTP_HEADER}/${data.headerId}`, data);
  }
  /** Method to upload file */
  uploadBTHTTPHdrFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_BT_HTTP_HDR_FILE}/${profileId}`, arr);
  }
  /** Add BT HTTP RESPONSE HEADERS */
  addBtResponseHeaders(data, profileId) {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT_RESPONSE_HDR_URL}/${profileId}`, data);
  }
  /** Get all BT RESPONSE header data */
  getBTResponseHdrData(profileId): Observable<BTResponseHeaderData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BTRESPONSE_HDR_URL}/${profileId}`);
  }

  /** Delete BT RESPONSE headers Info */
  deleteBTResponseHeaders(data, profileId): Observable<BTResponseHeaderData> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_BT_RESPONSE_HDR}/${profileId}`, data);
  }

  /** Delete RESPONSE Headers Conditions  */
  deleteResponseHdrConditions(listOfIds) {
    return this._restApi.getDataByPostReq(`${URL.DEL_RESPONSE_HDR_COND}`, listOfIds);
  }

  /* Edit  BT RESPONSE Headers Info */
  editBTResponseHeaders(data): Observable<BTResponseHeaderData> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_BTRESPONSE_HEADER}/${data.headerId}`, data);
  }
  /** Method to upload file */
  uploadFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_FILE}/${profileId}`, arr);
  }

  /** Method to upload file method monitors file */
  uploadMethodMonitorFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_METHOD_MONITOR_FILE}/${profileId}`, arr);
  }

  saveMethodMonitorData(profileId) {
    return this._restApi.getDataByPostReq(`${URL.SAVE_METHOD_MONITOR_FILE}/${profileId}`);
  }

  /** Method to copy selected xml files in instrProfiles */
  copyXmlFiles(filesWithPath, profileId): Observable<string[]> {
    let arr = [];
    arr.push(filesWithPath);
    return this._restApi.getDataByPostReq(`${URL.COPY_XML_FILES}/${profileId}`, arr);
  }

  /** Get file path */
  getFilePath(profileId): Observable<string> {
    return this._restApi.getDataByGetReqWithNoJson(`${URL.GET_FILE_PATH}/${profileId}`);

  }
  /*this method is used for get selected text instrumnetation profile in xml format*/
  getInstrumentationProfileXMLData(data) {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_IMPORT_INSTRUMENT_PROFILE_XML}`, arr);
  }

  /*this method is used for get all xml files for a particular path*/
  getInstrumentationProfileXMLFileList(agent) {
    return this._restApi.getDataByGetReq(`${URL.GET_XML_INSTRUMENT_PROFILE}/${agent}`);
  }

  /*this method is used for get selected xml instrumnetation profile in xml format*/
  getXMLDataFromSelectedXMLFile(data, agentType) {
    return this._restApi.getXMLDataByPostReq(`${URL.GET_XML_DATA_FROM_SELECTED_XML_FILE}/${agentType}/${data}`);
  }

  /*this method is used for get selected xml instrumnetation profile in xml format*/
  editXMLDataFromSelectedXMLFile(data) {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByGetReq(`${URL.EDIT_XML_DATA_FROM_SELECTED_XML_FILE}?filePath=${arr}`);
  }

  /*this method is resposible for saving XML data after Editing */
  saveInstrumentedDataInXMLFile(dataArr) {
    return this._restApi.getDataByPostReq(`${URL.SAVE_EDITED_XML_DATA_FROM_SELECTED_XML_FILE}`, dataArr);
  }

  /*this method is used for get selected json instrumnetation profile in json format*/
  editJSONDataFromSelectedJSONFile(data) {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByGetReq(`${URL.EDIT_JSON_DATA_FROM_SELECTED_JSON_FILE}?filePath=${arr}`);
  }

   /*this method is resposible for saving JSON data after Editing */
   saveInstrumentedDataInJSONFile(JSONdataArr) {
    return this._restApi.getDataByPostReq(`${URL.SAVE_EDITED_JSON_DATA_FROM_SELECTED_XML_FILE}`, JSONdataArr);
  }

  /* Delete File */
  deleteFile(fileName) {
    let arr = [];
    arr.push(fileName);
    return this._restApi.getDataByGetReq(`${URL.DELETE_FILE}?fileName=${arr}`);
  }

  getAutoDiscoverTreeData(adrFile, reqId, fileName) {
    let arr = [];
    arr.push(adrFile);
    return this._restApi.getDataByPostReq(`${URL.GET_AUTO_DISCOVER_TREE_DATA}?reqId=${reqId + ',' + fileName}`, arr);
  }

  getClassDiscoverTreeData(nodeInfo, reqId, fileName) {
    return this._restApi.getDataByPostReq(`${URL.GET_CLASS_DISCOVER_TREE_DATA}?reqId=${reqId + ',' + fileName}`, nodeInfo);
  }

  getSelectedNodeInfo(nodeInfo, reqId, fileName) {
    return this._restApi.getDataByPostReq(`${URL.GET_SELECTED_NODE_TREE_DATA}?reqId=${reqId + ',' + fileName}`, nodeInfo);
  }

  getUninstrumentaionTreeData(nodeInfo, reqId, fileName) {
    return this._restApi.getDataByPostReq(`${URL.GET_UNINSTRUMENTATION_NODE_TREE_DATA}?reqId=${reqId + ',' + fileName}`, nodeInfo);
  }

  saveInsrumentationFileInXMLFormat(xmlFileName, reqId, fileName) {
    let arr = [];
    arr.push(xmlFileName);
    return this._restApi.getDataByPostReq(`${URL.SAVE_INSTRUEMENTATION_DATA_XML}?reqId=${reqId + ',' + fileName}`, arr);
  }

  getAutoDiscoverSelectedTreeData(adrFile, reqId, fileName) {
    let arr = [];
    arr.push(adrFile);
    return this._restApi.getDataByPostReq(`${URL.GET_AUTO_DISCOVER_SELECTED_TREE_DATA}?reqId=${reqId + ',' + fileName}`, arr);
  }
  /* GEt Activity Log Data */
  getActivityLogData() {
    return this._restApi.getDataByGetReq(`${URL.GET_ACTIVITY_LOG_DATA}`);
  }

  /* Get NDC Keywords data */
  getNDCKeywords(appId): Observable<any[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_NDC_KEYWORDS}/${appId}`);
  }

  /* Save NDC Keywords data */
  saveNDCKeywords(data, appId, flag): Observable<any[]> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_NDC_KEYWORDS}/${appId}/${flag}`, data);
  }

  /* Delete applied NDC Keywords data */
  deleteNDCKeywords(data, appId): Observable<any> {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DELETE_NDC_KEYWORDS}/${appId}`, data);
  }

  /* Save NDC Keywords data on file */
  saveNDCKeywordsOnFile(data, appId): Observable<any[]> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_NDC_KEYWORDS_ON_FILE}/${appId}`, data);
  }

  /** This method is for auto instrumetation */
  getRemovedPackageData(textFile, reqId) {
    let arr = [];
    arr.push(textFile);
    return this._restApi.getDataByPostReq(`${URL.GET_REMOVED_PACKAGE_DATA}?reqId=${reqId}`, arr);
  }
  getAutoInstrumentatedData(textFile, reqId) {
    let arr = [];
    arr.push(textFile);
    return this._restApi.getDataByPostReq(`${URL.GET_INSTRUEMENTATED_PACKAGE_DATA}?reqId=${reqId}`, arr);
  }

  getClassMethodTreeData(nodeInfo, reqId) {
    return this._restApi.getDataByPostReq(`${URL.GET_CLASS_METHOD_RAW_DATA}?reqId=${reqId}`, nodeInfo);
  }

  getSelectedInstrumentaionInfo(nodeInfo, reqId) {
    return this._restApi.getDataByPostReq(`${URL.GET_SELECTED_REMOVED_INSTRUMENTED_DATA}?reqId=${reqId}`, nodeInfo);
  }

  getUninstrumentaionData(nodeInfo, reqId) {
    return this._restApi.getDataByPostReq(`${URL.GET_UNINSTRUMENTATION_TREE_DATA}?reqId=${reqId}`, nodeInfo);
  }

  saveInsrumentationFileXMLFormat(xmlFileName, reqId) {
    let arr = [];
    arr.push(xmlFileName);
    return this._restApi.getDataByPostReq(`${URL.SAVE_INSTRUEMENTATION_DATA_FILE}?reqId=${reqId}`, arr);
  }
  checkInsrumentationXMLFileExist(xmlFileName, reqId) {
    let arr = [];
    arr.push(xmlFileName);
    return this._restApi.getDataByPostReq(`${URL.CHECK_INSTRUEMENTATION_XML_FILE_EXIST}?reqId=${reqId}`, arr);
  }

  /*this method is used to get details of selected instr profile*/
  getSelectedProfileDetails(data, msg) {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_INSTR_PROFILE_DETAILS}/${msg}`, arr);
  }

  /**Sending RTC for instrumentation profile maker */
  rtcInstrProfile(data, userName): Observable<String[]> {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReq(`${URL.RUNTIME_CHANGE_INSTR_PROFILE}/${userName}`, arr)
  }

  /* Edit Http Response Header Info */
  editHTTPRepHeaderData(data): Observable<HTTPResponseHdrComponentData> {
    let url = `${URL.UPDATE_HTTPREPHDR}/${data.httpAttrId}`;
    return this._restApi.getDataByPostReq(url, data);
  }

  /* Add Http response header Info */
  addHTTPRepHeaderData(data, profileId): Observable<HTTPResponseHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_HTTP_REP_HDR}/${profileId}`, data);
  }

  /* delete Http response header Info */
  deleteHTTPRepHeaderData(data, profileId): Observable<HTTPResponseHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_REP_HDR}`, data);
  }

  /** get the HTTP Response Header Type */
  getHTTPResponseValue(data, profileId): Observable<HTTPResponseHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_HTTP_REP_TYPE}/${profileId}`, data);
  }

  /*  FETCH HTTP RESPONSE HEADER TABLEDATA */
  getFetchHTTPRepHeaderTable(profileId): Observable<httpRepHeaderInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_HTTPREP_HDR}/${profileId}`);
  }

  /* Delete Http Response Header Rules  */
  deleteHttpRespRules(data) {
    return this._restApi.getDataByPostReq(`${URL.DELETE_HTTPREPHDR_RULES}`, data);
  }

  /**Asynchronous Rule */
  getAsynchronousRuleList(profileId): Observable<AsynchronousRuleType[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_ASYNCHRONOUS_RULE_TABLEDATA}/${profileId}`);
  }

  saveAsynchronousRule(profileId): Observable<AsynchronousRuleType> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_ASYNCHRONOUS_RULE}/${profileId}`);
  }

  enableAsyncRuleTypeList(assocId, isEnable): Observable<AsynchronousRuleType[]> {
    return this._restApi.getDataByPostReq(`${URL.ENABLE_ASYNCHRONOUS_RULE_TYPE}/${assocId}/${isEnable}`);
  }

  getTopoName(trNo, instanceName): Observable<String> {
    let arr = [];
    arr.push(instanceName);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_TOPO_NAME}/${trNo}`, arr);
  }

  /** Method to upload file */
  uploadBTMethodFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_BT_METHOD_FILE}/${profileId}`, arr);
  }

  /** URL for creating method monitor from auto discover */
  addMethodMonitorFromAutoDiscover(methodMonitorMap, profileIdList, methodFrom) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.ADD_METHOD_MONITOR_FROM_AD}/${profileIdList}/${methodFrom}`, methodMonitorMap);
  }

  /** URL for creating method monitor from auto discover */
  createMethodMonitorAndValidateFQMFromAD(nodeInfo, reqId, instanceFileName): Observable<any> {
    return this._restApi.getDataByPostReq(`${URL.CREATE_METHOD_MONITOR_AND_VALIDATE_FQM_FROM_AD}/${reqId + ',' + instanceFileName}`, nodeInfo);
  }


  /** URL for creating method monitor from auto instrumentation */
  addMethodMonitorFromAutoInstr(methodMonitorMap, profileIdList, methodFrom) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.ADD_METHOD_MONITOR_FROM_AI}/${profileIdList}/${methodFrom}`, methodMonitorMap);
  }
  /** URL for creating method monitor from auto instrumentation */
  createMethodMonitorAndValidateFQMFromAI(nodeInfo, reqId) {
    return this._restApi.getDataByPostReq(`${URL.CREATE_METHOD_MONITOR_AND_VALIDATE_FQM_FROM_AI}/${reqId}`, nodeInfo);
  }


  downloadReports(data) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DOWNLOAD_REPORTS}`, data)
  }

  /** Add BT HTTP BODY */
  addBtHttpBody(data, profileId) {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT_HTTP_BODY_URL}/${profileId}`, data);
  }

  /** Get all BT Http body data */
  getBtHttpBodyData(profileId): Observable<BTHTTPBody[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BTHTTP_BODY_URL}/${profileId}`);
  }

  /* Edit  BT HTTP Body Info */
  editBTHTTPBody(data): Observable<BTHTTPBody> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_BTHTTP_BODY}/${data.id}`, data);
  }

  /** Delete HTTP Body Conditions  */
  deleteHTTPBodyConditions(listOfIds) {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_BODY_COND}`, listOfIds);
  }

  /** Delete BT HTTP Body Info */
  deleteBTHTTPBody(data, profileId): Observable<BTHTTPBody> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_BT_BODY}/${profileId}`, data);
  }


  saveNDEData(data): Observable<NDE> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NDE_URL}`, data);
  }

  getNDEData(): Observable<NDE[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_NDE_DATA_URL}`)
  }

  deleteNDEData(data): Observable<NDE[]> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_NDE_DATA_URL}`, data)
  }

  editNDEData(data): Observable<NDE> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_NDE_DATA_URL}/${data.id}`, data)
  }

  getTierGroupNames(): Observable<string[]> {
    return this._restApi.getDataByGetReq(`${URL.LOAD_TIER_GROUP_NAME_URL}`)
  }

  saveNDERoutingRules(data): Observable<NDERoutingRules> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NDE_ROUTING_ROUTES_URL}`, data)
  }

  getNDEServerFromNDEName(data): Observable<NDE> {
    return this._restApi.getDataByGetReq(`${URL.GET_NDE_SERVER_OBJ_URL}/${data}`)
  }

  getNDERoutingRulesData(): Observable<NDERoutingRules[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_ND_ROUTING_RULES_DATA_URL}`)
  }

  deleteNDERoutingRules(data): Observable<any[]> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_NDE_ROUTING_RULES_URL}`, data)
  }

  editNDERoutingRules(data): Observable<NDERoutingRules> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_NDE_ROUTING_RULES_URL}/${data.id}`, data)
  }

  saveUserConfiguredKeywords(data): Observable<UserConfiguredKeywords> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_USER_CONFIGURED_KEYWORDS}`, data)
  }

  getUserConfiguredKeywords(): Observable<UserConfiguredKeywords[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_USER_CONFIGURED_KEYWORDS}`)
  }

  deleteUserConfiguredKeywords(data): Observable<any[]> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_USER_CONFIGURED_KEYWORDS}`, data)
  }

  getCustomKeywordsList(): Observable<any[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_CUSTOM_KEYWORDS_LIST}`)
  }

  // For NDC keywords

  saveUserConfiguredNDCKeywords(data): Observable<UserConfiguredNDCKeywords> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_USER_CONFIGURED_NDC_KEYWORDS}`, data)
  }

  getUserConfiguredNDCKeywords(): Observable<UserConfiguredNDCKeywords[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_USER_CONFIGURED_NDC_KEYWORDS}`)
  }


  deleteUserConfiguredNDCKeywords(data): Observable<any[]> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_USER_CONFIGURED_NDC_KEYWORDS}`, data)
  }

  getCustomNDCKeywordsList(): Observable<any[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_CUSTOM_NDC_KEYWORDS_LIST}`)
  }

  checkIfKeywordIsAssoc(data): Observable<any[]> {
    return this._restApi.getDataByGetReq(`${URL.CHECK_KEYWORD_ASSOCIATION}/${data}`)
  }

  checkIfNDCKeywordIsAssoc(data): Observable<any[]> {
    return this._restApi.getDataByGetReq(`${URL.CHECK_NDC_KEYWORD_ASSOCIATION}/${data}`)
  }

  editAgentKeyword(data): Observable<UserConfiguredKeywords> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_AGENT_KEYWORDS}/${data.keyId}`, data)
  }

  editNDCKeyword(data): Observable<UserConfiguredNDCKeywords> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_NDC_KEYWORDS}/${data.keyId}`, data)
  }


  /**For Integration PT Detection */
  getInterfaceTypeList(profileId): Observable<IntegrationPT[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_INTERFACE_TABLEDATA}/${profileId}`);
  }

  updateProfileInterfaceAssoc(profileId, data): Observable<InterfacePoint> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_BACKEND_POINT_INTERFACE}/${profileId}`, data);
  }

  saveInterfacePointDataOnFile(profileId): Observable<InterfaceEndPoint> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_INTERFACE_END_POINT}/${profileId}`);
  }

  /** For Adding Auto Injection Policy Rule */
  addAutoInjectionPolicyRule(profileId,data): Observable<NVAutoInjectionPolicyRule> {
    return this._restApi.getDataByPostReq(`${URL.ADD_AUTO_INJECTION_POLICY_DATA}/${profileId}`, data);
  }

  /** For Getting Auto Injection Policy Rule */
  getAutoInjectionPolicyRule(profileId): Observable<NVAutoInjectionPolicyRule[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_AUTO_INJECTION_POLICY_DATA}/${profileId}`);
  }

  /** For Editing Auto Injection Policy Rule */
  editAutoInjectionPolicyRule(profileId,data): Observable<NVAutoInjectionPolicyRule> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_AUTO_INJECTION_POLICY_DATA}/${profileId}`, data);
  }

  /** For Deleting Auto Injection Policy Rule */
  deleteAutoInjectionPolicyRule(data, profileId): Observable<NVAutoInjectionPolicyRule> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_AUTO_INJECTION_POLICY_DATA}/${profileId}`, data);
  }

  /** For Adding Auto Injection Tag Rule*/
  addAutoInjectionTagRule(profileId,data): Observable<NVAutoInjectionTagRule> {
    return this._restApi.getDataByPostReq(`${URL.ADD_AUTO_INJECTION_TAG_DATA}/${profileId}`, data);
  }

  /** For Getting Auto Injection Tag Rule */
  getAutoInjectionTagRule(profileId): Observable<NVAutoInjectionTagRule[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_AUTO_INJECTION_TAG_DATA}/${profileId}`);
  }

  /** For Editing Auto Injection Tag Rule */
  editAutoInjectionTagRule(profileId,data): Observable<NVAutoInjectionTagRule> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_AUTO_INJECTION_TAG_DATA}/${profileId}`, data);
  }

  /** For Deleting Auto Injection Tag Rule */
  deleteAutoInjectionTagRule(data, profileId): Observable<NVAutoInjectionTagRule> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_AUTO_INJECTION_TAG_DATA}/${profileId}`, data);
  }

  /** For saving auto Injection Data on File */
  saveAutoInjectionData(profileId): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_AUTO_INJECTION_DATA_ON_FILE}/${profileId}`);
  }

  /** For Uploading Auto Injection file */
  uploadAutoInjectionFile(filePath, profileId) {
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_AUTO_INJECTION_FILE}/${profileId}`, arr);
  }
  /** Get Global Settings List */
  getGlobalSettings(): Observable<GlobalSettings> {
    return this._restApi.getDataByGetReq(`${URL.GET_GLOBAL_SETTINGS}`)
  }
  
  /** Save Global Settings List into DB */
  saveGlobalSettings(data): Observable<GlobalSettings> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_GLOBAL_SETTINGS}`, data)
  }

  //Services Added as per new design of BT
  updateReqParentId(currentId, currentRuleId, data): Observable<any[]>{
    return this._restApi.getDataByPostReq(`${URL.UPDATE_REQ_PARENT_ID}/${currentId}/${currentRuleId}`, data)
  }

    /** Set btpattern and parent rule id in btmethod */
    updateParentId(currentId, currentRuleId, data): Observable<any[]>{
      return this._restApi.getDataByPostReq(`${URL.UPDATE_BT_METHOD_PARENT_ID}/${currentId}/${currentRuleId}`, data)
    }

    getAssocBTMethod(id): Observable<any[]>{
      return this._restApi.getDataByGetReq(`${URL.GET_BTMETHOD_ON_EDIT}/${id}`)
    }
    updateResParentId(currentId, currentRuleId, data): Observable<any[]>{
      return this._restApi.getDataByPostReq(`${URL.UPDATE_RES_PARENT_ID}/${currentId}/${currentRuleId}`, data)
    }

  getAssocReqHdr(id): Observable<any[]>{
    return this._restApi.getDataByGetReq(`${URL.GET_ASSOC_REQ_HDR}/${id}`)
  }

  getAssocResHdr(id): Observable<any[]>{
    return this._restApi.getDataByGetReq(`${URL.GET_ASSOC_RES_HDR}/${id}`)
  }

  getAssocHttpBody(id): Observable<any[]>{
    return this._restApi.getDataByGetReq(`${URL.GET_ASSOC_HTTP_BODY}/${id}`)
  }
  updateBodyParentId(currentId, currentRuleId, data): Observable<any[]>{
    return this._restApi.getDataByPostReq(`${URL.UPDATE_BODY_PARENT_ID}/${currentId}/${currentRuleId}`, data)
  }

  //Get Tier List basis on Topology 
  getTierList(data): Observable<string[]> {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReq(`${URL.GET_TIER_LIST}`, arr);
  }
  
  getDLFqcList(profId) {
    return this._restApi.getDataByGetReq(`${URL.GET_DL_FQC_LIST}/${profId}`)
  }

  getDLFqmListUsingFqc(profId, fqc) {
    return this._restApi.getDataByGetReq(`${URL.GET_DL_FQM_LIST}/${profId}?fqc=${fqc}`)
  }

  getTierServerInstanceName(nodeId, topoName) {
    return this._restApi.getDataByGetReq(`${URL.GET_TOPO_DETAILS}/${nodeId}/${topoName}`)
  }

  getTrNoFromFile() {
    return this._restApi.getDataByGetReq(`${URL.GET_TR_NO_FROM_FILE}`);
  }
}
