import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Message } from 'primeng/api';
// import { NotificationService } from '../../../vendors/ng-notify/src/services/notification.service';
// import { CavConfigService } from './cav-config.service';
import { CavConfigService } from "./../../../../tools/configuration/nd-config/services/cav-config.service";
// import { CavTopPanelNavigationService } from './cav-top-panel-navigation.service';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { tap } from "rxjs/operators";
// import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/empty';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DDRParams } from 'src/app/core/session/session.model';



/**
 * 
 */
@Injectable({
  providedIn: 'root',
})

export class DdrDataModelService {

  private _fpIdFromNSSession: string;
  private _customToFlowpathFlag = false;
  private _ndSessionId: string;
  private _nvPageId: string;
  private _nvSessionId: string;
  private _urlParam: string;
  private _isFromNV: string;
  private _isFromNF: string;
  private _dcInfoMap: any[];
  private _testRun: string;
  private _tierName: string;
  private _serverName: string;
  private _appName: string;
  private _startTime: string;
  private _PID: string;
  private _agentType: string;
  private _endTime: string;
  private _product: string;
  private _ipWithProd: string;
  private _urlName: string;
  private _btCategory: string;
  private _dbReportCategory: string;
  private _strGroup: string;
  private _startTimeInDateFormat: string;
  private _endTimeInDateFormat: string;
  private _isZoomPanel: boolean;
  private _restDrillDownUrl: string;
  private _message: Message;
  private _userName: string;
  private _dbFlag: boolean;
  private _dbTofpflag: boolean;
  private _vecArrForGraph: any[];
  private _graphId: string;
  private _normalFlag: boolean;
  private _slowFlag: boolean;
  private _vslowFlag: boolean;
  private _errorFlag: boolean;
  private _urlFlag: boolean;
  private _FromexpFlag: string;
  private _FromhsFlag: string;
  private _fpByBTFlag: boolean;
  private _fpSignatureflag: boolean;
  private _processIdWithInstance: string;
  private _isFromND: boolean;
  private _isCompressed: any;
  private _downloadFile: any;
  private _strOrderBy: any;
  private _mtFlag: any;
  private _strGraphKey: any;
  private _viewBy: any;

  private _customdataAction: any;
  public dcName: any;
  ddrParam: DDRParams;
  private _customOptions: any;
  private _urlIdx: string;
  private _displayPopup = true;
  private _heapCmdArgs: string;
  private _reportName: string;
  private _vectorName: string;
  private _vectorMetaData: string;
  private _groupId: string;
  private _groupName: string;
  private _summaryToInstanceFlag: string;
  private _protocol: string;
  private _queryTimeMode: string;
  private _queryTime: string;
  private _host: string;
  private _port: string;
  private _pgSummaryToInstanceFlag: boolean = false;
  private _splitViewFlag = false;
  private _queryCountToDBFlag: boolean = false;
  private _valueForCheckBox: any;
  private _tierId: string;
  private _pagedump: any;
  private _serverId: string;
  private _appId: string;
  private _transactionError: boolean = false;
  private _defaultTab: string;
  private _statuscode: any;
  private _flowpathToExFlag: any;
  private _nvFiltersFlag: boolean = false;
  parentComponent: string = '';
  public _btTrendParamFromStoreView: any;
  strStatus: any;
  BtRequestType = 2; //Keyword For Bt-Trend Request Type
  isDisContinousEnable: boolean = false;
  enableQueryCaching = 0; //Keyword For Enable Query-Caching
  pidProcessDump;
  isFromProcessGrapgh;
  backendRespTime;
  backendId;
  backendName: string;
  heapPath;
  ibmAnalyzerData;
  ibmAnalyzerUrl;
  ibmHeapFileName;
  gcViewerData;
  featureName;
  filtermode: any;
  txName: string;
  transactionName: any;
  generatorName: any;
  nsErrorName: any;
  isDetailsFlag: boolean = false;
  //For Search By FlowPath
  correlationId: any;
  flowpathID: any;
  mode: any;
  searchByCustomDataOptions: any;
  customData: any;
  pattern: any;
  flagForHSToFP = '0';
  IPByFPFlag = false; //agg flowpath
  // for bug 66417
  fromReport: boolean = false; // flag to check whether traversing from graph or report.
  errorNameUrl: any;
  errorNameSession: any;
  errorUserSession: any;
  sDetailsFlag: boolean = false;
  nsFromGraph: boolean = false;
  isFromNVNF: boolean = false;
  paginationFlag: boolean = false;
  WAN_ENV: any;
  pageFailure: boolean = false;
  isPartitionMode: any;
  summaryTofailureFlag: boolean = false;
  //  changes for bug id 63226 by Rakesh,siddharth
  nsCQMFilter = {};
  nsCqmAutoFill = {}; //have to make it empty too where nsCQMFIlter is getting empty.
  // @BlockUI() blockUI: NgBlockUI;
  isFromtrxFlow: boolean = false;
  isFromtrxSideBar: boolean = false;
  hostTr: any;
  portTr: any;
  protocolTr: any;
  testRunTr: any;
  dcNameTr: any;
  urlIndexAgg: any;
  isCompFlowpath: boolean = false;
  heapFileExtension;
  failedQuery: any; //For exception error callout case
  /* use while going to exception report through web dashboard, need to reset in other cases i.e; flowpath,ED,StoreView*/
  exceptionClsName: any;
  nodeKey: any;
  /*Observable for update message sources.*/
  private _messageObser = new Subject<Message>();

  private heapDataDataBroadcaster = new Subject<any>();
  private processDataDataBroadcaster = new Subject<any>();
  isFromAgg: boolean;
  savedQueryName: any = [];
  saveQueryField = {};
  saveMessage: string;
  public sendMessage$: any = new Subject<any>();
  public passMesssage$: Observable<any> = this.sendMessage$.asObservable();
  editQuery: boolean = false;
  httpData: {};
  ndDCNameInfo: any = [];
  isBlack: boolean; // for black theme
  nvCqm: boolean;
  nvFirstPage: boolean;
  enableViewSourceCode: any; // keyword for showing Source code in MCT

  requestFrom:string;
  getEmmiter(data) {
    this.heapDataDataBroadcaster.next(data);
  }
  getProcessEmmiter(data) {
    this.processDataDataBroadcaster.next(data);
  }
  heapDumpDataObservable$ = this.heapDataDataBroadcaster.asObservable();
  processDumpDataObservable$ = this.processDataDataBroadcaster.asObservable();
  /*Service message commands.*/
  messageEmit(message) {
    this._messageObser.next(message);
  }
  /*Service Observable for getting update message.*/
  messageProvider$ = this._messageObser.asObservable();



  public tabNameObserver$: Subject<string> = new Subject<string>();
  public tabNameObservable$: Observable<string> = this.tabNameObserver$.asObservable();

  public ddrThemeChangeUI$: Subject<Object> = new Subject<Object>();
  public ddrThemeChangeUIObservable$: Observable<Object> = this.ddrThemeChangeUI$.asObservable();
  searchString;
  cmdArgsFlag;
  stateID: string;
  reportID: any;

  constructor(private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    console.log('comin in constructor for calling')
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']
    });
    console.log("stateID in ddrData", this.stateID)
    //this.getAjaxTimeOut();
    this.getGuiCancelationTimeOut();
    let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));

    this.reportID = this.sessionService.getSetting("reportID");
    this._testRun = this.sessionService.session.testRun.id;
    this._product = this.sessionService.session.cctx.prodType;
    if (this._product == 'NetDiagnostics')
      this._product = 'netdiagnostics';

    console.log("reportID in ddrData", this.reportID)

    if(this.stateID){
      if(this.stateID === 'DDRA9COPYLINK' || this.stateID === 'DDRCOPYLINK'){
        this.ddrParam = this.sessionService.ddrParam;
        if(this.ddrParam.ajaxTimeout)
          this.ajaxTimeOut = this.ddrParam.ajaxTimeout;
        if(this.ddrParam.requestFrom)
          this.requestFrom = this.ddrParam.requestFrom;
        if(this.ddrParam.testRun)
          this.testRun=this.ddrParam.testRun;
        if(this.ddrParam.tierName)
          this.tierName=this.ddrParam.tierName;
        if(this.ddrParam.serverName)
          this.serverName = this.ddrParam.serverName;
        if(this.ddrParam.appName)
          this.appName =this.ddrParam.appName;
        if(this.ddrParam.startTime)
          this.startTime = this.ddrParam.startTime;
        if(this.ddrParam.endTime)
          this.endTime = this.ddrParam.endTime;
        if(this.ddrParam.startTimeInDateFormat)
          this.startTimeInDateFormat = this.ddrParam.startTimeInDateFormat;
        if(this.ddrParam.endTimeInDateFormat)
          this.endTimeInDateFormat = this.ddrParam.endTimeInDateFormat;
        if(this.ddrParam.ipWithProd)
          this.ipWithProd = this.ddrParam.ipWithProd;
        if(this.ddrParam.dbReportCategory)
          this.dbReportCategory = this.ddrParam.dbReportCategory;
        if(this.ddrParam.strGroup)
          this.strGroup = this.ddrParam.strGroup;
        if(this.ddrParam.urlName)
          this.urlName = this.ddrParam.urlName;
        if(this.ddrParam.product)
          this.product = this.ddrParam.product;
        if(this.ddrParam.isZoomPanel)
          this.isZoomPanel = this.ddrParam.isZoomPanel;
        if(this.ddrParam.graphId)
          this.graphId = this.ddrParam.graphId;
        if(this.ddrParam.vecArrForGraph)
          this.vecArrForGraph = this.ddrParam.vecArrForGraph;
        if(this.ddrParam.btCategory)
          this.btCategory = this.ddrParam.btCategory;
        if(this.ddrParam.strOrderBy)
          this.strOrderBy = this.ddrParam.strOrderBy;
        if(this.ddrParam.mtFlag)
          this.mtFlag = this.ddrParam.mtFlag;
        if(this.ddrParam.strGraphKey)
          this.strGraphKey = this.ddrParam.strGraphKey;
        if(this.ddrParam.urlIndex)
          this.urlIndex = this.ddrParam.urlIndex;
        if(this.ddrParam.customData)
          this.customData = this.ddrParam.customData;
        if(this.ddrParam.correlationId)
          this.correlationId = this.ddrParam.correlationId;
        if(this.ddrParam.customOptions)
          this.customOptions = this.ddrParam.customOptions;
        if(this.ddrParam.queryTimeMode)
          this.queryTimeMode = this.ddrParam.queryTimeMode;
        if(this.ddrParam.queryTime)
          this.queryTime = this.ddrParam.queryTime;
        if(this.ddrParam.tierId)
          this.tierId = this.ddrParam.tierId;
        if(this.ddrParam.serverId)
          this.serverId = this.ddrParam.serverId;
        if(this.ddrParam.appId)
          this.appId = this.ddrParam.appId;
        if(this.ddrParam.backendId)
          this.backendId = this.ddrParam.backendId;
        if(this.ddrParam.backendRespTime)
          this.backendRespTime = this.ddrParam.backendRespTime;
        if(this.ddrParam.backendName)
          this.backendName = this.ddrParam.backendName;
        if(this.ddrParam.ndSessionId)
          this.ndSessionId = this.ddrParam.ndSessionId;
        if(this.ddrParam.nvPageId)
          this.nvPageId = this.ddrParam.nvPageId;
        if(this.ddrParam.nvSessionId)
          this.nvSessionId = this.ddrParam.nvSessionId;
        if(this.ddrParam.urlParam)
          this.urlParam = this.ddrParam.urlParam;
        if(this.ddrParam.isFromNV)
          this.isFromNV  = this.ddrParam.isFromNV;
        if(this.ddrParam.cmdArgsFlag)
          this.cmdArgsFlag = this.ddrParam.cmdArgsFlag;
      }else{
        this.getBtData(this.stateID);
        this._btCategory = this.sessionService.getSetting('ddrBtCategory')
        if (this._btCategory === "Normal")
          this._btCategory = '10';
        else if (this._btCategory === "Slow")
          this._btCategory = '11';
        else if (this._btCategory === "VerySlow")
          this._btCategory = '12';
        else if (this._btCategory === "Error")
          this._btCategory = '13';
      }
    }
    

    if (localStorage.getItem('ddrFlowPathTab') && isBrowserTab == 1) {
      let ddrFlowPathJSON = JSON.parse(localStorage.getItem('ddrFlowPathTab'));
      this._testRun = ddrFlowPathJSON['testRun'];
      this._startTime = ddrFlowPathJSON['startTime'];
      this._endTime = ddrFlowPathJSON['endTime'];
      this._product = ddrFlowPathJSON['product'];

      if (sessionStorage.getItem('isMultiDCMode')) {
        this.host = ddrFlowPathJSON['host'];
        this.port = ddrFlowPathJSON['port'];
        this.protocol = ddrFlowPathJSON['protocol'];
        this.dcName = ddrFlowPathJSON['dcName'];
      }
    }

    //this.setBtTrendParam();
    //this.getNetForestLink()
  }

  getBtData(stateId){
    const state: WidgetDrillDownMenuItem = this.sessionService.getSetting(stateId, null);
        for (const subjectInfo of state.state.subject.tags) {
          if (subjectInfo.key == 'Tier') {
            this._tierName = subjectInfo.value;
          } else if (subjectInfo.key == 'Server') {
            this._serverName = subjectInfo.value;
          } else if (subjectInfo.key == 'Instance') {
            this._appName = subjectInfo.value;
          } else if (subjectInfo.key == 'Business Transactions') {
            this._urlName = subjectInfo.value;
          }
        }
        for (const timeInfo of state.time) {
          this._startTime = timeInfo.startTime.toString();
          this._endTime = timeInfo.endTime.toString();
        }
  
  }
  public get transactionError(): boolean {
    return this._transactionError;
  }
  public set transactionError(value: boolean) {
    this._transactionError = value;
  }

  public get defaultTab(): any {
    return this._defaultTab;
  }
  public set defaultTab(value: any) {
    this._defaultTab = value;
  }

  public get statuscode(): any {
    return this._statuscode;
  }

  public set statuscode(value: any) {
    this._statuscode = value;
  }
  public set valueForCheckBox(value: any) {
    this._valueForCheckBox = value;
  }

  public get valueForCheckBox(): any {
    return this._valueForCheckBox;
  }

  public get pgSummaryToInstanceFlag(): boolean {
    return this._pgSummaryToInstanceFlag;
  }

  public set pgSummaryToInstanceFlag(value: boolean) {
    this._pgSummaryToInstanceFlag = value;
  }

  public get queryTimeMode(): string {
    return this._queryTimeMode;
  }

  public set queryTimeMode(value: string) {
    this._queryTimeMode = value;
  }

  public get queryTime(): string {
    return this._queryTime;
  }

  public set queryTime(value: string) {
    this._queryTime = value;
  }

  public get host(): string {
    return this._host;
  }
  public set host(value: string) {
    this._host = value;
  }

  public get port(): string {
    return this._port;
  }

  public set port(value: string) {
    this._port = value;
  }

  public get protocol(): string {
    return this._protocol;
  }

  public set protocol(value: string) {
    this._protocol = value;
  }

  public get summaryToInstanceFlag(): string {
    return this._summaryToInstanceFlag;
  }

  public set summaryToInstanceFlag(value: string) {
    this._summaryToInstanceFlag = value;
  }

  public get urlIdx(): string {
    return this._urlIdx;
  }

  public set urlIdx(value: string) {
    this._urlIdx = value;
  }

  public get vectorName(): string {
    return this._vectorName;
  }

  public set vectorName(value: string) {
    this._vectorName = value;
  }

  public get vectorMetaData(): string {
    return this._vectorMetaData;
  }

  public set vectorMetaData(value: string) {
    this._vectorMetaData = value;
  }

  public get groupId(): string {
    return this._groupId;
  }

  public set groupId(value: string) {
    this._groupId = value;
  }

  public get groupName(): string {
    return this._groupName;
  }

  public set groupName(value: string) {
    this._groupName = value;
  }


  public get reportName(): string {
    return this._reportName;
  }

  public set reportName(value: string) {
    this._reportName = value;
  }

  public get heapCmdArgs(): string {
    return this._heapCmdArgs;
  }

  public set heapCmdArgs(value: string) {
    this._heapCmdArgs = value;
  }

  public get displayPopup(): boolean {
    return this._displayPopup;
  }

  public set displayPopup(value: boolean) {
    this._displayPopup = value;
  }

  public get customOptions(): any {
    return this._customOptions;
  }

  public set customOptions(value: any) {
    this._customOptions = value;
  }

  public get customdataAction(): any {
    return this._customdataAction;
  }

  public set customdataAction(value: any) {
    this._customdataAction = value;
  }

  public get strGraphKey(): any {
    return this._strGraphKey;
  }

  public set strGraphKey(value: any) {
    this._strGraphKey = value;
  }

  
  public get viewBy(): any {
    return this._viewBy;
  }
  public set viewBy(value: any) {
    this._viewBy = value;
  }

  public get isCompressed(): any {
    return this._isCompressed;
  }

  public set isCompressed(value: any) {
    this._isCompressed = value;
  }

  public get downloadFile(): any {
    return this._downloadFile;
  }

  public set downloadFile(value: any) {
    this._downloadFile = value;
  }


  public get btCategory(): string {
    return this._btCategory;
  }
  public get isFromND(): boolean {
    return this._isFromND;
  }

  public set isFromND(value: boolean) {
    this._isFromND = value;
  }

  public get processIdWithInstance(): string {
    return this._processIdWithInstance;
  }

  public set processIdWithInstance(value: string) {
    this._processIdWithInstance = value;
  }
  public set btCategory(value: string) {
    this._btCategory = value;
  }

  public get testRun(): string {
    return this._testRun;
  }

  public set testRun(value: string) {
    this._testRun = value;
  }

  public get tierName(): string {
    return this._tierName;
  }

  public set tierName(value: string) {
    this._tierName = value;
  }
  public get strOrderBy(): string {
    return this._strOrderBy;
  }

  public set strOrderBy(value: string) {
    this._strOrderBy = value;
  }

  public get serverName(): string {
    return this._serverName;
  }

  public set serverName(value: string) {
    this._serverName = value;
  }

  public get appName(): string {
    return this._appName;
  }

  public set appName(value: string) {
    this._appName = value;
  }

  public get PID(): string {
    return this._PID;
  }

  public set PID(value: string) {
    this._PID = value;
  }

  public get agentType(): string {
    return this._agentType;
  }

  public set agentType(value: string) {
    this._agentType = value;
  }

  public get startTime(): string {
    return this._startTime;
  }

  public set startTime(value: string) {
    this._startTime = value;
  }

  public get endTime(): string {
    return this._endTime;
  }

  public set endTime(value: string) {
    this._endTime = value;
  }


  public get ipWithProd(): string {
    return this._ipWithProd;
  }

  public set ipWithProd(value: string) {
    this._ipWithProd = value;
  }

  public get product(): string {
    return this._product;
  }

  public set product(value: string) {
    this._product = value;
  }


  public get urlName(): string {
    return this._urlName;
  }

  public set urlName(value: string) {
    this._urlName = value;
  }

  public get dbReportCategory(): string {
    return this._dbReportCategory;
  }

  public set dbReportCategory(value: string) {
    this._dbReportCategory = value;
  }


  public get strGroup(): string {
    return this._strGroup;
  }

  public set strGroup(value: string) {
    this._strGroup = value;
  }

  public get message(): Message {
    return this._message;
  }

  public get startTimeInDateFormat(): string {
    return this._startTimeInDateFormat;
  }

  public set startTimeInDateFormat(value: string) {
    this._startTimeInDateFormat = value;
  }

  public get endTimeInDateFormat(): string {
    return this._endTimeInDateFormat;
  }

  public set endTimeInDateFormat(value: string) {
    this._endTimeInDateFormat = value;
  }

  public get isZoomPanel(): boolean {
    return this._isZoomPanel;
  }

  public set isZoomPanel(value: boolean) {
    this._isZoomPanel = value;
  }

  public set ndSessionId(value: string) {
    this._ndSessionId = value;
  }
  public get ndSessionId(): string {
    return this._ndSessionId;
  }

  public set nvPageId(value: string) {
    this._nvPageId = value;
  }
  public get nvPageId(): string {
    return this._nvPageId;
  }

  public set nvSessionId(value: string) {
    this._nvSessionId = value;
  }
  public get nvSessionId(): string {
    return this._nvSessionId;
  }

  public set urlParam(value: string) {
    this._urlParam = value;
  }
  public get urlParam(): string {
    return this._urlParam;
  }

  public get isFromNV(): string {
    return this._isFromNV;
  }

  public set isFromNV(value: string) {
    this._isFromNV = value;
  }

  public get isFromNF(): string {
    return this._isFromNF;
  }

  public set isFromNF(value: string) {
    this._isFromNF = value;
  }

  public get fpIdFromNSSession(): string {
    return this._fpIdFromNSSession;
  }

  public set fpIdFromNSSession(value: string) {
    this._fpIdFromNSSession = value;
  }
  public get customToFlowpathFlag(): boolean {
    return this._customToFlowpathFlag;
  }

  public set customToFlowpathFlag(value: boolean) {
    this._customToFlowpathFlag = value;
  }
  public get restDrillDownUrl(): string {
    return this._restDrillDownUrl;
  }

  public set restDrillDownUrl(value: string) {
    this._restDrillDownUrl = value;
  }

  public get urlIndex(): string {
    return this._urlIdx;
  }

  public get splitViewFlag(): any {
    return this._splitViewFlag;
  }

  public set splitViewFlag(value: any) {
    this._splitViewFlag = value;
  }

  public set urlIndex(value: string) {
    this._urlIdx = value;
  }

  public get getBackendName(): any {
    return this.backendName;
  }

  public set setBackendName(value: any) {
    this.backendName = value;
  }

  public errorMessage(detail: string, summary?: string) {
    if (summary == undefined)
      this._message = { severity: 'error', detail: detail };
    else
      this._message = { severity: 'error', summary: summary, detail: detail };

    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 10000);
  }

  public infoMessage(detail: string, summary?: string) {
    if (summary == undefined)
      this._message = { severity: 'info', detail: detail };
    else
      this._message = { severity: 'info', summary: summary, detail: detail };

    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 10000);
  }

  public successMessage(detail: string, summary?: string) {
    if (summary == undefined)
      this._message = { severity: 'success', detail: detail };
    else
      this._message = { severity: 'success', summary: summary, detail: detail };

    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 10000);
  }

  public multiSuccessMessage(detail: string, summary?: string) {
    this._message = { severity: 'success', summary: summary, detail: detail };
    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 10000);

  }
  public multiErrorMessage(detail: string, summary?: string) {
    if (detail && detail.includes('0 Unknown'))
      detail = "Connection refused by server. Please check Server health.";
    if (detail && detail.includes('200 '))
      detail = "No records found";
    if (summary && summary.includes('0 Unknown'))
      summary = "Connection refused by server. Please check Server health.";
    if (summary && summary.includes('200 '))
      summary = "No records found";
    this._message = { severity: 'error', summary: summary, detail: detail };
    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 10000);

  }
  /**Method is used for showing the notification message on TOP/Bottom. */
  showNotificationMessage(message: string, msgType: string, msgPosition = 'bottom', fixed = false, durationMS = 1000, targetID: string) {
    try {

      // this._notify.show(message, {
      //   type: msgType,
      //   duration: durationMS,
      //   location: '#monitorUpDownInfoDialog',
      //   position: msgPosition,
      //   sticky: fixed
      // });

    } catch (e) {
      console.error('Error while displaying notification in dashboard.', e);
    }

  }

  public set userName(value: string) {
    this._userName = value;
  }

  public get userName(): string {
    return this._userName;
  }

  public get dbFlag(): boolean {
    return this._dbFlag;
  }

  public set dbFlag(value: boolean) {
    this._dbFlag = value;
  }
  public get mtFlag(): string {
    return this._mtFlag;
  }

  public set mtFlag(value: string) {
    this._mtFlag = value;
  }

  public set vecArrForGraph(value: any[]) {
    this._vecArrForGraph = value;
  }

  public get vecArrForGraph(): any[] {
    return this._vecArrForGraph;
  }
  public get graphId(): string {
    return this._graphId;
  }

  public set graphId(value: string) {
    this._graphId = value;
  }

  public get normalFlag(): boolean {
    return this._normalFlag;
  }

  public set normalFlag(value: boolean) {
    this._normalFlag = value;
  }

  public get slowFlag(): boolean {
    return this._slowFlag;
  }

  public set slowFlag(value: boolean) {
    this._slowFlag = value;
  }

  public get vslowFlag(): boolean {
    return this._vslowFlag;
  }

  public set vslowFlag(value: boolean) {
    this._vslowFlag = value;
  }

  public get errorFlag(): boolean {
    return this._errorFlag;
  }

  public set errorFlag(value: boolean) {
    this._errorFlag = value;
  }

  public get urlFlag(): boolean {
    return this._urlFlag;
  }

  public set urlFlag(value: boolean) {
    this._urlFlag = value;
  }

  public get fpSignatureflag(): boolean {
    return this._fpSignatureflag;
  }

  public set fpSignatureflag(value: boolean) {
    this._fpSignatureflag = value;
  }

  public get FromexpFlag(): string {
    return this._FromexpFlag;
  }

  public set FromexpFlag(value: string) {
    this._FromexpFlag = value;

  }

  public get FromhsFlag(): string {
    return this._FromhsFlag;
  }

  public set FromhsFlag(value: string) {
    this._FromhsFlag = value;

  }

  public get fpByBTFlag(): boolean {
    return this._fpByBTFlag;
  }

  public set fpByBTFlag(value: boolean) {
    this._fpByBTFlag = value;
  }

  public get dbTofpflag(): boolean {
    return this._dbTofpflag;
  }

  public set dbTofpflag(value: boolean) {
    this._dbTofpflag = value;
  }

  public get queryCountToDBFlag(): any {

    return this._queryCountToDBFlag;
  }

  public set queryCountToDBFlag(value: any) {
    this._queryCountToDBFlag = value;
  }

  public get tierId(): string {
    return this._tierId;
  }

  public set tierId(value: string) {
    this._tierId = value;
  }

  public set serverId(value: string) {
    this._serverId = value;
  }

  public get serverId(): string {
    return this._serverId;
  }

  public get appId(): string {
    return this._appId;
  }

  public set appId(value: string) {
    this._appId = value;
  }

  public get dcInfoMap() {
    return this._dcInfoMap;
  }

  public set dcInfoMap(value) {
    this._dcInfoMap = value;
  }
  public get flowpathToExFlag(): boolean {
    return this._flowpathToExFlag;
  }
  public set flowpathToExFlag(value: boolean) {
    this._flowpathToExFlag = value;
  }
  public get nvFiltersFlag(): boolean {
    return this._nvFiltersFlag;
  }

  public set nvFiltersFlag(value: boolean) {
    this._nvFiltersFlag = value;
  }
  ajaxTimeOut;
  getAjaxTimeOut() {
    let url = decodeURIComponent(this.getHostUrl() + '/' + 'netstorm') + "/v1/cavisson/netdiagnostics/webddr/ajaxTimeOut"
    this.getDataInStringUsingGet(url).subscribe(data => {
      this.ajaxTimeOut = data;
      console.log('callliiinggg')
      sessionStorage.setItem('ajaxTimeOut', this.ajaxTimeOut.toString())
      if (!this.ajaxTimeOut) {
        this.ajaxTimeOut = 60000;
        sessionStorage.setItem('ajaxTimeOut', this.ajaxTimeOut.toString())
      }
    })
  }

  guiCancelationTimeOut;
  getGuiCancelationTimeOut() {
    let url = decodeURIComponent(this.getHostUrl() + '/' + 'netstorm') + "/v1/cavisson/netdiagnostics/webddr/guiCancelationTimeOut"
    this.getDataInStringUsingGet(url).subscribe(data => {
      this.guiCancelationTimeOut = data;
      console.log('guiCancelationTimeOut>>>>>>>>>>>', this.guiCancelationTimeOut)
      sessionStorage.setItem('guiCancelationTimeOut', this.guiCancelationTimeOut.toString())
      if (!this.guiCancelationTimeOut) {
        this.guiCancelationTimeOut = 30000;
        sessionStorage.setItem('guiCancelationTimeOut', this.guiCancelationTimeOut.toString())
      }
    })
  }

  // ddrSourceType;
  // getDdrSourceType() {
  //   let url = decodeURIComponent(this.getHostUrl() + '/' + 'netstorm') + "/v1/cavisson/netdiagnostics/webddr/ddrSourceType"
  //   this.getDataInStringUsingGet(url).subscribe(res => {
  //     let data = <any>res;
  //     this.ddrSourceType = data;
  //     console.log('ddrSourceTypee amannnn>>>>>>>>>>>>>')
  //     sessionStorage.setItem('ddrSourceType', this.ddrSourceType.toString());
  //     this.sessionService.setSetting('ddrSourceType', this.ddrSourceType.toString());
  //     if (!this.ddrSourceType) {
  //       this.ddrSourceType = 0;
  //       sessionStorage.setItem('ddrSourceType', this.ddrSourceType.toString());
  //       this.sessionService.setSetting('ddrSourceType', this.ddrSourceType.toString());
  //     }
  //   })
  // }

  getQueryCaching() {
    let url = decodeURIComponent(this.getHostUrl() + '/' + 'netstorm') + "/v1/cavisson/netdiagnostics/webddr/enableQueryCaching"
    this.getDataInStringUsingGet(url).subscribe(res => {
      let data = <any>res;
      this.enableQueryCaching = data;
      console.log('enableQueryCaching>>>>>>>>>>>>>')
      sessionStorage.setItem('enableQueryCaching', this.enableQueryCaching.toString());
      if (!this.enableQueryCaching) {
        this.enableQueryCaching = 0;
        sessionStorage.setItem('enableQueryCaching', this.enableQueryCaching.toString());
      }
    })
  }

  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
    return hostDcName;
  }
  public get pagedump(): any {
    return this._pagedump;
  }
  public set pagedump(value: any) {
    this._pagedump = value;
  }
  netForestURL
  timeVarianceForNetForest
  getNetForestLink() {
    let url = decodeURIComponent(this.getHostUrl() + '/' + 'netstorm') + '/v1/cavisson/netdiagnostics/ddr/config/NetForestUrl';

    this.getDataInStringUsingGet(url).subscribe(data => {
      this.netForestURL = data;
      if (data != undefined) {
        url = decodeURIComponent(this.getHostUrl() + '/' + 'netstorm') + '/v1/cavisson/netdiagnostics/ddr/config/NetDiagnosticsQueryTimeVariance';
        this.getDataInStringUsingGet(url).subscribe(data => {
          this.timeVarianceForNetForest = data;
        })
      }
    })
  }
  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time))     //If time is in minute formate- xm eg:20m means 20 minute  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time))  //If time is in second formate- xs eg:200s means 200 second  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = parseInt(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds 
    {
      timeVarianceInMs = parseInt(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");

      return parseInt('900000'); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return parseInt(timeVarianceInMs);
  }
  set btTrendParamFromStoreView(value: any) {
    this._btTrendParamFromStoreView = value;
  }

  get btTrendParamFromStoreView() {
    return this._btTrendParamFromStoreView;
  }

  /*Getting Data Through REST API in String format by using GET Method */
  getDataInStringUsingGet(url, param?) {
    console.log(`Making RestCall in ddr data model service ${url} and
    params = ${param}`);
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(
        data => data
      )
    );
  }

  /* Getting data through RestApi through Get method*/
  getDataUsingGet(url, param?) {
    console.log(`Making RestCall and getting data using Get method where url = ${url} and
    params = ${param}`);
    return this.http.get(url)
    // .catch((err: HttpErrorResponse) => {
    //    return this.catchLog(err,url);  
    //  });
  }
  /* Logging Error Function */
  catchLog(err, url) {
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', err.error.message, 'url:', url);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${err.status}, body was: ${err.error}, url:${url}`);
    }
    return Observable.throw(
      new Error(`${err.status} ${err.statusText}`)
    );
  }
  resetDDRArguments() {
    this.nvFirstPage = false;
    this._ndSessionId = undefined;
    this._nvPageId = undefined;
    this._nvSessionId = undefined;
    this._urlParam = undefined;
    this.flowpathID = undefined;
    this._isFromNV = '0'; //nv flag off
    this._isFromNF = '0'; //nf flag off
    this.searchString = "";
    this.cmdArgsFlag = false;
    this._urlName = undefined;
    this.mode = undefined;
    this.backendId = undefined;
    this.correlationId = undefined;
    this._dbTofpflag = false;
    this._FromhsFlag = 'false';
    this._FromexpFlag = 'false';
    this._fpByBTFlag = false;
    this._fpIdFromNSSession = undefined;
    this._customToFlowpathFlag = false;
    this.IPByFPFlag = false;
    this._appName = undefined;
    this._serverName = undefined;
    this._tierName = undefined;
    this._PID = undefined;
    this._agentType = undefined;
    this.backendRespTime = undefined;
    this.backendName = undefined;
    this.paginationFlag = true;
    this._btCategory = undefined;
    this.isFromtrxFlow = false;
    this.isFromtrxSideBar = false;
    this.urlIndexAgg = undefined;
    this.isFromAgg = false;
    this.isCompFlowpath = false;  // this flag for hiding the coloumn of action in agg ip info
    this._flowpathToExFlag = false;
    this._urlIdx = undefined;
    this._nvFiltersFlag = false;
    this.exceptionClsName = undefined;
    this.failedQuery = undefined;
    this.urlIndex = undefined;
    this._strOrderBy = undefined;
    this.nodeKey = undefined; // it take keyword for node handling in trasaction flowmap
    // this._cavConfigService.$WdinputsforDdr = undefined;
    this.editQuery = false;
    this.saveQueryField = undefined;
    this.flagForHSToFP = '0';
    this.ndDCNameInfo = [];
    this.nvCqm = false;
    this._strOrderBy = undefined;
    // this.isFromNVNF = undefined;

  }
  getMasterDC() {
    let dcInfo;
    // let dcInfo = this._cavConfigService.getDCInfoObj();
    for (let i = 0; i < dcInfo.length; i++) {
      if (dcInfo[i].isMaster == true) {
        return dcInfo[i].dc;
      }
    }
    return undefined;
  }
  getWanEnV(testRun?) {
    this.WAN_ENV = 0;
    if (!testRun)
      testRun = this._testRun;
    if (this.product) {
      let url = decodeURIComponent(this.getHostUrl() + '/' + this.product.toLowerCase()) + "/v1/cavisson/netdiagnostics/ddr/getWanEnv?testRun=" + this._testRun;
      this.getDataInStringUsingGet(url).subscribe(data => {
        this.WAN_ENV = Number(data);
      })
    }
    else {
      let url = decodeURIComponent(this.getHostUrl() + '/netdiagnostics') + "/v1/cavisson/netdiagnostics/ddr/getWanEnv?testRun=" + testRun;
      this.getDataInStringUsingGet(url).subscribe(data => {
        this.WAN_ENV = Number(data);
      })
    }
  }
  // Regarding to check for tables exists in database for particular testrun or not and if not present then import.
  getDbImportCheck(testRun?) {
    console.log("getDbImportCheck>>>>callled in DDRdatamodel");
    return new Promise((resolve, reject) => {
      let product = sessionStorage.getItem('productType');
      if (!testRun)
        testRun = this._testRun;
      if (product) {
        let url = decodeURIComponent(this.getHostUrl() + '/' + product.toLowerCase()) + "/v1/cavisson/netdiagnostics/webddr/getDbImportCheck?TestRun=" + testRun;
        this.getDataInStringUsingGet(url).subscribe(data => {
          console.log("getDbImportCheck>>>>>O/p====>>>", data);
          // resolve();
        },
          error => {
            if (error.hasOwnProperty('message')) {
              console.log("getDbImportCheck>>>>>Error====>>>", error.message);
            }
            // resolve();
          });
      }
      else {
        let url = decodeURIComponent(this.getHostUrl() + '/netdiagnostics') + "/v1/cavisson/netdiagnostics/webddr/getDbImportCheck?TestRun=" + testRun;
        this.getDataInStringUsingGet(url).subscribe(data => {
          console.log("getDbImportCheck else>>>>>O/p====>>>", data);
          // resolve();
        },
          error => {
            if (error.hasOwnProperty('message')) {
              console.log("getDbImportCheck> else>>>>Error====>>>", error.message);
              //  resolve();
            }
          });
      }
    });
  }
  setInLogger(module, feature, action, description?) {
    let productKey = sessionStorage.getItem('productKey');
    let userName = sessionStorage.getItem('sesLoginName');
    if (this.product) {
      let url = decodeURIComponent(this.getHostUrl() + '/' + this.product.toLowerCase()) + "/v1/cavisson/netdiagnostics/ddr/setCavAuditLog?" + "userName=" + userName + "&productKey=" + productKey + "&action=" + action + "&module=" + module + "&feature=" + feature + "&description=" + description;
      this.getDataInStringUsingGet(url).subscribe(data => {
        console.log("data *** ", data)
      })
    }
    else {
      let url = decodeURIComponent(this.getHostUrl() + '/netdiagnostics') + "/v1/cavisson/netdiagnostics/ddr/setCavAuditLog?" + "userName=" + userName + "&productKey=" + productKey + "&action=" + action + "&module=" + module + "&feature=" + feature + "&description=" + description;
      this.getDataInStringUsingGet(url).subscribe(data => {
        console.log("data *** ", data)
      })
    }
  }
  //This method for getting DC details from dcInfo
  getDcNameInfo() {
    let ndDCNameTr = [];
    let count = 0;
    let dcInfo;
    // let dcInfo = this._cavConfigService.getDCInfoObj();
    for (let i = 0; i < dcInfo.length; i++) {
      if (dcInfo[i].productType == "netdiagnostics" || dcInfo[i].productType == "netstorm") {
        ndDCNameTr[count] = { "displayName": dcInfo[i].dc, "ndeTestRun": dcInfo[i].testRun, "ndeId": count };
        count++;
      }
    }
    return ndDCNameTr;
  }

  //method for geting keyword for node handling in trasaction flowmap from config.ini
  getKeyInfo() {
    return new Promise((resolve, reject) => {
      try {
        let url = location.protocol + "//" + location.host + "/tomcat/" + this.getMasterDC() + '/netdiagnostics/v1/cavisson/netdiagnostics/webddr/enableNode';
        this.getDataInStringUsingGet(url).subscribe(data => {
          console.log("data *** ", data)
          this.nodeKey = data.toString();
          resolve(data.toString());
        },
          err => {
            this.nodeKey = "0"
            // resolve();
          }
        );
      }
      catch (e) {
        // resolve();
      }
    });
  }

  /**
   * 
   */

  setBtTrendParam() {
    let params = {};
    if (this._serverName && this._serverName.toLowerCase().includes("overall")) {
      if (this._appName && this._appName.toLowerCase().includes("overall"))
        params['vectorName'] = this._tierName;
    }
    else if (this._serverName && this._appName)
      params['vectorName'] = this._tierName + '>' + this._serverName + '>' + this._appName;

    const getGraphTimeKeyID = this.sessionService.getSetting("strGraphTime");
    const viewby = this.sessionService.getSetting("viewBy");
    if (getGraphTimeKeyID) {
      this._strGraphKey = this.getGraphKeyByTime(getGraphTimeKeyID, viewby);
      console.log("graphhhKeyyy", this.strGraphKey);
      params['strGraphKey'] = this._strGraphKey;
    } else
      params['strGraphKey'] = 'Last_240_Minutes' + '_' + "600";

    params['tierNameList'] = this._tierName;
    params['testRun'] = this._testRun;
    params['strStartTime'] = this._startTime;
    params['strEndTime'] = this._endTime;
    params['eventDay'] = undefined;
    params['product'] = this._product;
    params['serverName'] = this._serverName;
    params['appName'] = this._appName;
    params['btCategory'] = 'All';
    params['strIncDisGraph'] = false;
    if (this._urlName && this._urlName.includes("AllTransactions")) {
      params['btName'] = "";                         //AllTransactions
    }
    else if (this._urlName)
      params['btName'] = this._urlName;   //particular bt

    this._btTrendParamFromStoreView = params;
    console.log("param created in ddrDatamodel", this._btTrendParamFromStoreView);
  }

  getGraphKeyByTime(keyID, viewby) {
    if (keyID == 'LIVE0') {
      keyID = 'Last_5_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE1') {
      keyID = 'Last_10_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE2') {
      keyID = 'Last_30_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE3') {
      keyID = 'Last_60_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE4') {
      keyID = 'Last_120_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE5') {
      keyID = 'Last_240_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE6') {
      keyID = 'Last_240_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE7') {
      keyID = 'Last_480_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE8') {
      keyID = 'Last_720_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE9') {
      keyID = 'Last_1440_Minutes' + '_' + viewby;
    }
    if (keyID == 'LIVE10') {
      keyID = 'LAST_DAY';
    }
    if (keyID == 'PAST1') {
      keyID = "Yesterday";
    }
    if (keyID.includes("SPECIFIED_")) {
      return keyID;
    }
    return keyID;
  }

  //This method for getting DC details from dcInfo via rest
  getDcNameInfoFromRest() {
    // return new Promise((resolve, reject) => {
    //   try {
    //     // let ndDCNameTr = [];
    //     if (this.ndDCNameInfo && this.ndDCNameInfo.length > 0) {
    //       // resolve();
    //       return;
    //     }
    //     let count = 0;
    //     let dcInfo = [];
    //     let url = location.protocol + "//" + location.host + "/node/ALL/dcinfo";

    //     this.http.get(url).map(res => <any>res).subscribe(
    //       res => {
    //         console.log("data *** ", res)
    //         dcInfo = res;
    //         console.log(dcInfo.length);
    //         for (let i = 0; i < dcInfo.length; i++) {
    //           if (dcInfo[i].productType == "netdiagnostics" || dcInfo[i].productType == "netstorm") {
    //             this.ndDCNameInfo[count] = { "displayName": dcInfo[i].dc, "ndeTestRun": dcInfo[i].testRun, "ndeId": count };
    //             count++;
    //           }
    //         }
    //         // resolve();
    //       },
    //       err => {
    //         this.nodeKey = "0"
    //         // resolve();
    //       }
    //     );
    //   }
    //   catch (e) {
    //     // resolve();
    //   }
    // });
  }
}
