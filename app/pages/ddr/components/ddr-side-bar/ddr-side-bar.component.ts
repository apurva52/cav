import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SelectItem } from '../../interfaces/selectitem';
import { CommonServices } from '../../services/common.services';
import { Router } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
//import 'rxjs/add/operator/toPromise';
import { MessageService } from '../../services/ddr-message.service';
import { DdrDataModelService } from '../../../../pages/tools/actions/dumps/service/ddr-data-model.service';
import { DDRRequestService } from '../../services/ddr-request.service';
//import { NsCommonService } from '../ns-reports/services/ns-common-service';
import { map } from 'rxjs/operators';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-ddr-side-bar',
  templateUrl: './ddr-side-bar.component.html',
  styleUrls: ['./ddr-side-bar.component.css']
})
export class DdrSideBarComponent implements OnInit {
  urlParam: any;
  items: MenuItem[] = [];

  testRunDurationOf: SelectItem[];
  testRunDuration: string[];
  failure: boolean = false;
  screenHeight: any;

  //NV Filters
  isCheckedSessionId: boolean = false;
  isCheckedPageId: boolean = false;
  isCheckedNVSessionID: boolean = false;
  ndSessionId: string;
  nvPageId: string;
  nvSessionId: string;

  //Groupby and order by
  checkGroup: boolean;
  checkOrder: boolean;
  selectedGroupBy: string[] = [];
  groupBy: SelectItem[] = [];
  orderBy: SelectItem[] = [];
  selectedOrderBy: string[] = [];
  groupByFC: string[] = []; // variables for groupby Filter Criteria
  orderByFC: string[] = []; // variables for orderby Filter Criteria


  //Buisness Transaction 
  BTOptions: SelectItem[] = [];
  selectedBuisnessTransaction: any;
  checkedBuisnessTransaction: boolean = false;
  selectedBTVal: string[];

  //Integration Point
  IntegrationPoint: SelectItem[] = [];
  selectedIntegrationPoint: any = [];
  selectedIP: boolean;
  selectedIpName: string[] = [];

  // flowpath instance 
  selectedFp: boolean;
  fpInstance: string = "";

  // Tier Variables
  selectedTier: boolean;  //whether tier chechbox is checked or not
  selectedTierVal: string[];
  selectedServerVal: string[];
  selectedAppVal: string[];

  tierList: SelectItem[];
  tierId: string[] = [];
  tierName: any = [];
  tierMetaData: any; //used to store tierMetaData coming from query
  tierNameFC = "default";

  //Server Variables
  selectedServer: boolean;
  serverList: SelectItem[];
  serverId: string[] = [];
  serverName: any = [];
  //serverIdNameObj: object = {};
  serverMetaData: any;  //used to store data coming from query
  serverNameFC: string = "default";

  //App Variables
  selectedApp: boolean;
  appList: SelectItem[];
  appId: string[] = [];
  appName: any = [];
  //appIdNameObj: object = {};
  appMetaData: any; //used to store app meta data coming from query
  appNameFC = "default";

  //url status variables
  selectedUrlStatus: any;
  failureIdNameObj: object = {};
  failureTypes: SelectItem[];
  selectedFailureId: string[] = [];
  selectedFailureName: string;
  selectedFailureNameId: string;

  //Report Type variables
  selectedReport: boolean;
  reportList: SelectItem[] = [{ label: 'Flowpath', value: 'Flowpath' }, { label: 'Flowpath GroupBy', value: 'FlowpathGroupBy' }, { label: 'DB Report', value: 'DB Report' }, { label: 'DB GroupBy', value: 'DBGroupBy' }, { label: 'Exception', value: 'Exception' }, { label: 'Method Timing', value: 'Method Timing' }, { label: 'Hotspot', value: 'Hotspot' }, { label: 'IP Summary', value: 'IP Summary' }];
  reportType: string;
  showReportId: any;

  //Response Time Variables
  checkedResponseTime: boolean;
  resCompareOptions: SelectItem[] = [{ label: '<=', value: '1' }, { label: '>=', value: '2' }, { label: '=', value: '3' }];
  resSelectedCompareOption: string = '1';
  responseTime: any;
  responseTime1: any;
  responseTime2: any;
  resVariance: any;
  showingEqualResponseBox: boolean = false;
  responseTimeMessage: boolean = false;

  //Method Count Variables
  checkedMethodCount: boolean;
  minMethods: string;

  //CorrelationId Varibles
  checkedCorrId: boolean;
  corrId: string;
  corrIdModeOptions: SelectItem[] = [{ label: 'Exact', value: 1 }, { label: 'StartsWith', value: 2 }, { label: 'EndsWith', value: 3 }, { label: 'Contains', value: 4 }];
  selectedCorrIdMode: string;
  // --correlation_mode 1  --correlation_id "34" 

  //Bt category variables
  BTCategory: SelectItem[] = [{ label: 'Normal', value: 10 }, { label: 'Slow', value: 11 }, { label: 'Very Slow', value: 12 }, { label: 'Errors', value: 13 }];
  selectedBTCategory: string;
  queryData = {};
  selectedBT: boolean;
  selectedFP: boolean = false;

  //Query Type vriables
  queryTypeOptions: SelectItem[] = [{ label: 'Select', value: { id: 1 } }, { label: 'Insert', value: { id: 2 } }, { label: 'Update', value: { id: 3 } }, { label: 'Delete', value: { id: 4 } }, { label: 'Create', value: { id: 5 } }, { label: 'Drop', value: { id: 6 } }];
  selectedQuery: string;
  queryText: any;
  selectedQueryType: string;

  //Time filter
  timeFilter: boolean;
  standard: string;
  custom: string;
  strDate: Date;
  endDate: Date;
  threadId: any;
  strTime: string;
  endTime: string;
  strTimeInDateFormat: string;
  endTimeInDateFormat: string;
  standardTime: SelectItem[];
  selectedTime: any;
  trStartTime: any;
  trEndTime: any;
  standselect: boolean = false;
  custselect: boolean = false;

  //Exception
  selectedExceptionClass: boolean;
  selectedThrowingClass: boolean;
  selectedThrowingMethod: boolean;
  selectedExceptionCause: boolean;
  selectedStackTrace: boolean;
  selectedExceptionMessage: boolean;

  exceptionClassOptions: SelectItem[];
  throwingClassOptions: SelectItem[];
  throwingMethodOptions: SelectItem[];
  exceptionCauseOptions: SelectItem[];
  exceptionMessageOptions: SelectItem[];

  selectedException: any;
  selectedExceptionThrowingClass: any;
  selectedExceptionThrowingMethod: any;
  selectedStack: any;
  selectedExceptionCauseType: any;
  selectedExceptionMessageType: any;


  //**********----NS Filter -----------*****

  checkedUrl: boolean = false;
  checkedPage: boolean
  checkedScript: boolean
  checkedTransaction: boolean
  checkedLocation: boolean
  checkedBrowser: boolean
  checkedAccess: boolean

  urlOptions: SelectItem[] = [];
  pageOptions: SelectItem[] = [];
  scriptOptions: SelectItem[] = [];
  transactionOptions: SelectItem[] = [];
  locationOptions: SelectItem[] = [];
  browserOptions: SelectItem[] = [];
  accessOptions: SelectItem[] = [];

  selectedUrl: any;
  selectedPage: any;
  page: string;
  selectedScript: any;
  selectedTransaction: any;
  selectedLocation: any;
  selectedBrowser: any;
  selectedAccess: any;
  //FlowpathInstance
  //flowpathInstance:string;

  // pie chart filter for DB
  checkNQueryforPie: boolean;
  selectedTopNQuery: string;

  // pie chart filter for MT
  checkNEntityforPie: boolean;
  selectedTopNEntity: string;

  message: any = {};
  subscription: Subscription;

  id: any;
  mode: any;

  productKey: string;
  exceptionPopup: boolean = false;
  testRunMode: boolean = false;
  // previousReport : string ;

  //For limit and offset
  btLimit = 1000;
  btOffset = 0;
  btCount;
  nxt = false;
  btEndValue: number = 1000; // used to show the pagination in BT
  prev = false;

  //fp order by 
  fpOrderByOptions: SelectItem[] = [{ label: 'Total Response Time', value: 'fpduration_desc' }, { label: 'Callout Errors', value: 'error_callout' }, { label: 'Cpu Time', value: 'btcputime_desc' }]
  fpOrderByCheck: boolean = false;
  selectedFpOrderBy: any;

  //db order by
  dbOrderByOptions: SelectItem[] = [{ label: 'Response Time', value: 'exec_time_desc' }, { label: 'Count', value: 'count_desc' }, { label: 'Error Count', value: 'query_count' }]
  dbOrderByCheck: boolean = false;
  selectedDbOrderBy: any;


  //multidc
  isMultiDC: boolean = false;
  selectedDC: any;
  dcList: SelectItem[] = [];
  enableMultiDC: boolean;

  ndeInfoData: any;
  protocol: string = '//';
  dcProtocol: string = '//';
  ndeCurrentInfo: any;
  host = '';
  port = '';
  testRun: string;
  NDEInfoData: any;
  //akshay new design test variables
  showReportField: boolean = true;
  showScriptFilter: boolean = false;
  showCommonFilters: boolean = true;
  TickOrder: boolean = false;
  TickGroup: boolean = false;
  TickScript: boolean = false;
  TickScriptId = false;
  TickPage: boolean = false;
  TickPageId = false
  TickUrl: boolean = false;
  TickUrlId = false;
  TickTransaction: any = false;
  TickTransactionId = false;
  TickStrTime: boolean = false;
  TickEndTime: boolean = false;
  TickLocation: boolean = false;
  TickAccess: boolean = false;
  TickBrowser: boolean = false;
  TickStatus: boolean = false;
  checkBoxUrl: boolean = true;
  checkBoxPage: boolean = true;
  checkBoxTransaction: boolean = true;
  seqUrl: boolean = true;
  hintUrl: string = '';
  hintPage: string = '';
  hintTransaction: string = '';
  phaseTime: SelectItem[];
  selectedPhase: any;
  showNSFilter: boolean = false;
  nsAutoFillSubscribe$: Subscription;
  urlFilterCount: number = 0;
  urlLimit: number = 8;
  urlOffset: number = 0;
  showUrlPagination: boolean = false;
  transLimit: number = 8;
  transOffset: number = 0;
  transFilterCount: number = 0;
  showTransactionPagination: boolean = false;
  showPagePagination: boolean = false;
  pageOffset: number = 0;
  pageLimit: number = 8;
  urlEndValue: number = 0;
  nxtUrl: boolean = false;
  prevUrl: boolean = false;
  scriptGroup: boolean = false;
  groupByFilter: any = [];
  showLAB: boolean = false;
  sideheight: string = "auto";
  showStartTimeError: boolean = false;
  showEndTimeError: boolean = false;
  customStartTimeError = "Please Provide Start Time";
  customEndTimeError = "Please Provide End Time";
  showSaveError: boolean = false;
  saveQueryError = "Please Provide Query name";
  showQueryError: boolean = false;
  QueryError = "Please enter Alphanumeric Text"
  endDateObj = new Date();
  startDateObj = new Date();
  customTimeError: boolean = false;
  customTimeErrorMessage = "Start time should be less than End time";
  showSaveQuery: boolean = false;
  savedQueriesObject: any = [];
  addDescription: any = '';
  queryName: any = '';
  selectAnyCheckBoxFlag: boolean = false;
  showAnyCheckBoxErrorMessage = "Please select any check option";
  selectCheckBoxFlag: boolean = false;
  showCheckBoxErrorMessage = "Please select atleast one value";
  selectResponseCheckBoxFlag: boolean = false;
  selectResponseCheckBoxFlag1: boolean = false;
  showInputFieldErrorMessage = "Please provide some value";
  selectGroupByCheckBoxFlag: boolean = false;
  selectOrderByCheckBoxFlag: boolean = false;
  selectScriptCheckBoxFlag: boolean = false;
  selectTransactionCheckBoxFlag: boolean = false;
  selectPageCheckBoxFlag: boolean = false;
  selectUrlCheckBoxFlag: boolean = false;
  selectFailureTypeFlag: boolean = false;
  selectTierFlag: boolean = false;
  selectServerFlag: boolean = false;
  selectAppFlag: boolean = false;
  selectBTFlag: boolean = false;
  selectBTCategoryFlag: boolean = false;
  selectCheckNQuerryFlag: boolean = false;
  selectDBOrderByCheckFlag: boolean = false;
  selectIsMultiDCCheckFlag: boolean = false;
  selectExceptionClassFlag: boolean = false;
  selectedExceptionThrowingClassFlag: boolean = false;
  selectedExceptionThrowingMethodFlag: boolean = false;
  selectedExceptionCauseTypeFlag: boolean = false;
  selectedExceptionMessageTypeFlag: boolean = false;
  selectedStackFlag: boolean = false;
  selectfpInstanceFlag: boolean = false;
  selectedCorrIdModeFlag: boolean = false;
  selectedCorrIdModeFlag1: boolean = false;
  selectedCorrIdModeFlag2: boolean = false;
  selectedFpOrderByFlag: boolean = false;
  selectedminMethodsFlag: boolean = false;
  selectedTopNEntityFlag: boolean = false;
  selectIntegrationPointFlag: boolean = false;
  ndSessionIdFlag: boolean = false;
  nvPageIdFlag: boolean = false;
  nvSessionIdFlag: boolean = false;

  //DL and req/resp flag
  checkReqRespFlag: boolean = false;
  checkDLFlag: boolean = false;

  constructor(public commonServices: CommonServices,
    private _router: Router,
    private messageService: MessageService,
    private _ddrData : DdrDataModelService,
    private ddrRequest:DDRRequestService,
    private sessionService: SessionService,
    //private nsCommonData: NsCommonService
    ) {

      console.log("coming in constructor of  sidebar");
  }
  ngOnInit() {
    console.log("coming here in sidebar ngOnit");
    if (this.commonServices.currentReport == "Hotspot" ||
      this.commonServices.currentReport == "IP Summary" ||
      this.commonServices.currentReport == "DBGroupBy" ||
      this.commonServices.currentReport == "Method Timing" ||
      this.commonServices.currentReport == "FlowpathGroupBy") {
      this.sideheight = "556px";
    }
    console.log("************ddr-side-bar*********** loading");
    this.urlParam = this.commonServices.getData();
    if (sessionStorage.getItem("isMultiDCMode") !== 'true')
      this.getMultiDCInfo();
      
    this._ddrData.getWanEnV();
    setTimeout(() => {
      if (this._ddrData.WAN_ENV)
        this.showLAB = true;
      else
        this.showLAB = false;
    }, 2000);
    this.getTRMode();
    //  this.commonServices.nsAutoFill$.subscribe((data)=>{   console.log(data,"**********************========>");});

    //commenting this part due to migration prupose
    // need to change the below conditions for ED
    // if (this._router.url.indexOf('?') != -1) {
    //   console.log("ED case");
    //   let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
    //   this.urlParam = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    //   console.log("In ED case--",);
    // }
    console.log("urlParam-", this.urlParam);

    setTimeout(() => {
      this.commonServices.previousReport = this.commonServices.currentReport;
      console.log("report type inside ngonit at loading--", this.commonServices.previousReport);
    }, 2000);

    console.log('this.subscription===ngOnit==')
    this.subscription = this.messageService.getMessage().subscribe(message => {
	console.log('message====>',message);
      this.message = message;
      console.log("subscription message  =====" + this.message);
      if (this.commonServices.currentReport == 'Exception') {
        this.checkGroup = true;
        this.getGroupBy();
        this.selectedGroupBy.push('excclass');
        this.selectedGroupBy.push('excthrowingclass');
        this.selectedGroupBy.push('excthrowingmethod');
      }
      else if (this.commonServices.currentReport == 'Flowpath') {
        this.applyFilteredValueInSideBar(); // flowpath auto fill case
        this.checkGroup = false;
        this.selectedGroupBy = [];
      }
      else {
        this.checkGroup = false;
        this.selectedGroupBy = [];

      }
    });

    // this.reportType = this.commonServices.currentReport ;
    //console.log("this.urlParam--" ,this.urlParam);
    this.screenHeight = Number(this.commonServices.screenHeight) - 79;
    console.log('loading.........');
    this.id = this.urlParam;
    this.mode = this.id.product;
    console.log("not calling dc data");
    //  this.id = this.commonServices.getData();
    // if (undefined != this.commonServices.dcNameList && null != this.commonServices.dcNameList && this.commonServices.dcNameList != '') 
    // { console.log("this.commonServices.dcNameList-------",this.commonServices.dcNameList)
    //   this.getDCData().then(() => {
    //     console.log("going to call dcdata ");      
    //     console.log("after call multidc");
    //   })   
    // }
    this.checkNSFilter();
    this.showGroupBy();
    this.commonServices.nsAutoFillObservable$.subscribe(data => {
      console.log("data got sybscribed in ddr side bar ***************** ", data, " *********************", this._ddrData.nsCqmAutoFill);
      this.assignAutoFillUI(data);
    })
    this.assignAutoFillUI(this.commonServices.currentReport, 'moving forward'); // should work when ddr is destroyed and then loaded again.
  }
  assignAutoFillUI(currentReport, forwardFlow?) {
    console.log("this._ddrData.nsCqmAutoFill ********** ", this._ddrData.nsCqmAutoFill[currentReport], "****forwardFlow****", forwardFlow);
    if (currentReport == "URL Instance" || this.selectAnyCheckBoxFlag) {
      this.showSaveQuery = false;
    }
    if (this._ddrData.nsCqmAutoFill[currentReport]) {
      let keyValue = this._ddrData.nsCqmAutoFill[currentReport];
      let keyParam = Object.keys(this._ddrData.nsCqmAutoFill[currentReport]);
      console.log("keys param are******* ", keyParam);
      if (currentReport == "URL Instance" || this.selectAnyCheckBoxFlag) {
        this.showSaveQuery = false;
      }
      else {
        this.showSaveQuery = true;
      }
      // reportVal['checkedTimeFIlter']=this.timeFilter;
      if (keyValue['checkedTimeFIlter']) {

        if (keyParam.includes('startTime') && keyParam.includes('EndTime')) {

          this.timeFilter = true; //check box of time filter being set true.
          this.timeOptions();  //will be called automatically.
          if (keyValue['selectedTime'])
            this.selectedTime = keyValue['selectedTime'];

          if (keyValue['customStartTime'] && keyValue['customEndTime']) {
            this.strDate = keyValue['customStartTime'];
            this.endDate = keyValue['customEndTime'];
          }
          else {
            this.strDate = null;
            this.endDate = null;
          }
          //console.log("this.selectedTime **********",this.selectedTime);

          //if(keyParam['Custom Time'])

        }
        if (keyValue['PhaseId']) {
          this.selectedTime = 'Specified Phase';
          this.getPhaseOptions();
          this.selectedPhase.id = keyValue['PhaseId'];
          this.selectedPhase.name = keyValue['PhaseName'];
          //  console.log("selected Phase***********",this.selectedPhase);
        }

      }
      else {
        this.timeFilter = false;
        this.selectedTime = '';
      }
      if (keyValue['ResponseTime'] && keyValue['ResponseTimeMode']) {
        this.checkedResponseTime = true;
        this.responseCheck();
        this.resSelectedCompareOption = keyValue['ResponseTimeMode'];  //drop down option
        this.responseTime = keyValue['ResponseTime'];   //value

      }
      else {
        this.checkedResponseTime = false;
        this.responseCheck();
      }

      if (keyValue['Group']) {

        if (this.showGroupBy()) {
          this.checkGroup = true;

          this.getGroupBy();
          this.selectedGroupBy = keyValue['Group'];
          this.getOrderBy();
          this.enableOrderBy();
          //console.log("this.selectedGroupBy *********",this.selectedGroupBy);
        }
      }
      else {
        this.checkGroup = false;
        this.selectedGroupBy = [];
      }

      if (keyValue['Order']) {
        this.enableOrderBy();
        this.getOrderBy();
        this.checkOrder = true;
        this.selectedOrderBy = keyValue['Order'];
        //console.log("this.checkOrder *****",this.checkOrder);
      }
      if (keyValue['StrOrderBy']) {      //This is the case of Nd reports AutoFill
        this.getOrderByFC();
        this.fpOrderByCheck = true;
        this.selectedFpOrderBy = keyValue['StrOrderBy'];
      }

      if (keyValue['DBOrderBy']) {
        this.dbOrderByCheck = true;
        this.selectedDbOrderBy = keyValue['DBOrderBy'];
      }
      //  StatusName StatusId (status is 0 for Success only, positive for the Failure code, -1 for all failures -2 for All (Success and all failures))
      //positive for the Failure code  
      if (keyValue['StatusName'] && keyValue['StatusId']) {
        if (keyValue['StatusId'] == -1 || keyValue['StatusId'] == 0 || keyValue['StatusId'] == -2) {
          this.selectedUrlStatus = keyValue['StatusId'];
          this.selectedFailureId = [];
          this.failure = false;
        }
        else //getting +ve error codes thats for faliure codes.
        {
          this.selectedUrlStatus = '4'; // to make radio button of failure code get selected ****
          this.failureType();
          this.failure = true;

          let errorCode = keyValue['StatusId'].split(',');
          this.selectedFailureId = errorCode;
          //  console.log('errorCode **************', errorCode);
        }

      }
      else {
        this.failure = false;
        this.selectedFailureId = [];
        this.selectedUrlStatus = undefined;
      }

      if (keyValue['TransactionName'] && keyValue['TransactionId']) {
        this.checkBoxTransaction = true;
        this.checkedTransaction = true;
        this.getTransactionInfo();
        this.selectedTransaction = {};
        this.selectedTransaction['name'] = keyValue['TransactionName'];
        this.selectedTransaction['id'] = keyValue['TransactionId'];
        //console.log("this.selectedTransaction ******************** ",this.selectedTransaction);

      }
      else {

        this.checkedTransaction = false;
        this.selectedTransaction = null;
        //console.log("Transaction has been turned off *********");
      }
      if (keyValue['UrlName'] && keyValue['UrlId']) {
        this.checkBoxUrl = true;
        this.checkedUrl = true;
        this.getUrlInfo();
        this.selectedUrl = {};
        this.selectedUrl['name'] = keyValue['UrlName'];
        this.selectedUrl['id'] = keyValue['UrlId'];
        this.checkInfo();
        //console.log("this.selectedUrl ************ ",this.selectedUrl);  
      }
      else {
        this.checkedUrl = false;
        this.selectedUrl = null;
      }
      if (keyValue['PageName'] && keyValue['PageId']) {
        this.checkBoxPage = true;
        this.getPageInfo();
        this.checkedPage = true;
        this.selectedPage = {};
        this.selectedPage['name'] = keyValue['PageName'];
        this.selectedPage['id'] = keyValue['PageId'];
        //console.log("this.selectedPage ********************* ",this.selectedPage);
      }
      else {

        this.checkedPage = false;
        this.selectedPage = null;
      }
      if (keyValue['ScriptName'] && keyValue['ScriptId']) {
        try {

          this.checkedScript = true;
          this.getScriptInfo();
          this.selectedScript = {};
          this.selectedScript['name'] = keyValue['ScriptName'];
          this.selectedScript['id'] = keyValue['ScriptId'];
          //console.log("this.selectedScript *************  ",this.selectedScript);
        } catch (error) {
          console.log(error, " ****************error *********************");
        }

      }
      else {
        this.checkedScript = false;
        this.selectedScript = null;
      }

      if (keyValue['Location']) {
        this.getLocationInfo();
        this.selectedLocation.name = keyValue['Location'];
        //console.log(" this.selectedLocation.name ********** ",this.selectedLocation.name);
      }
      else {
        this.checkedLocation = false;
        this.selectedLocation = undefined;
      }
      if (keyValue['Browser']) {
        this.getBrowserInfo();
        this.selectedBrowser.name = keyValue['Browser'];
        // console.log("this.selectedBrowser.name ************  ",this.selectedBrowser.name);
      }
      else {
        this.checkedBrowser = false;
        this.selectedBrowser = undefined;
      }
      if (keyValue['Access']) {
        this.getAccessInfo();
        this.selectedAccess.name = keyValue['Access'];
        // console.log("this.selectedAccess.name ************ ",this.selectedAccess.name);
      }
      else {
        this.selectedAccess = undefined;
        this.checkedAccess = false;
      }

      var splitTier;
      var splitServer;
      var splitApp;

      if (keyValue['checkedTier']) {
        this.selectedTier = true;
        this.tierInfo();
        splitTier = keyValue['tierName'].split(",");
        for (let i = 0; i < splitTier.length; i++) {
          this.tierName[i] = splitTier[i];
        }
        this.tierId = keyValue["tierId"];
      }
      else {
        this.selectedTier = false;
        this.tierName = [];
      }

      if (keyValue['checkedServer']) {
        this.selectedServer = true;
        this.serverInfo();
        splitServer = keyValue['serverName'].split(",");
        for (let i = 0; i < splitServer.length; i++) {
          for (let j = 0; j < keyValue['ServerList'].length; j++) {
            if (keyValue['ServerList'][j].value.includes(splitServer[i]))
              this.serverName[i] = keyValue['ServerList'][j].value;
          }
        }
        this.serverId = keyValue['serverId'].split(",");
      }
      else {
        this.selectedServer = false;
        this.serverName = [];
      }

      if (keyValue['checkedApp']) {
        this.selectedApp = true;
        this.appInfo();
        splitApp = keyValue['appName'].split(",");
        for (let i = 0; i < splitApp.length; i++) {
          for (let j = 0; j < keyValue['AppList'].length; j++) {
            if (keyValue['AppList'][j].value.includes(splitServer[i]))
              this.appName[i] = keyValue['AppList'][j].value;
          }
        }
        this.appId = keyValue['appId'].split(",");
      }
      else {
        this.selectedApp = false;
        this.appName = [];
      }


      if (keyValue['BtCategory']) {
        this.selectedBT = true;
        this.selectedBTCategory = keyValue['BtCategory'];
      }
      else {
        this.selectedBT = false;
        this.selectedBTCategory = "";
      }

      if (keyValue['FlowpathID']) {
        this.selectedFP = true;
        this.fpInstance = keyValue['FlowpathID'];
      }
      else {
        this.selectedFP = false;
        this.fpInstance = "";
      }

      if (keyValue['MinMethods']) {
        this.checkedMethodCount = true;
        this.methodCheck();
        this.minMethods = keyValue['MinMethods'];
      }
      else {
        this.checkedMethodCount = false;
        this.minMethods = "";
      }

      if (keyValue['CorrelationId'] && keyValue['Mode']) {
        this.checkedCorrId = true;
        this.corrId = keyValue['CorrelationId'];
        this.selectedCorrIdMode = keyValue['Mode'];
      }
      else {
        this.checkedCorrId = false;
        this.corrId = "";
        this.selectedCorrIdMode = "";
      }

      if (keyValue['responseTime'] != undefined && keyValue['resptimeqmode'] != undefined) {
        this.checkedResponseTime = true;
        this.resSelectedCompareOption = keyValue['resptimeqmode'];
        if (this.resSelectedCompareOption == '3' && keyValue['resVariance'] != undefined) {
          this.responseEqualCase();
          this.resVariance = keyValue['resVariance'];
          this.responseTime = keyValue['responseTime'];
        }
        else
          this.responseTime = keyValue['responseTime']
      }

      if (keyValue['TopNEntities']) {
        this.checkNEntityforPie = true;
        this.selectedTopNEntity = keyValue['TopNEntities'];
      }
      else {
        this.checkNEntityforPie = false;
        this.selectedTopNEntity = "";
      }

      if (keyValue['TopNQueries']) {
        this.checkNQueryforPie = true;
        this.selectedTopNQuery = keyValue['TopNQueries'];
      }
      else {
        this.checkNQueryforPie = false;
        this.selectedTopNQuery = "";
      }

      if (keyValue['IntegrationPointName']) {
        this.selectedIP = true;
        this.ipInfo();
        if (keyValue['IntegrationPointName'].length == 1) {
          this.selectedIntegrationPoint[0] = { "id": "0", "name": keyValue['IntegrationPointName'][0] };
        }
        else
          this.selectedIntegrationPoint = keyValue['IntegrationPointName'];
      }
      else {
        this.selectedIP = false;
        this.selectedIntegrationPoint = undefined;
      }

      if (keyValue['ExcStackTraceName']) {
        this.selectedStackTrace = true;
        this.selectedStack = keyValue['ExcStackTraceName'];
      }
      else {
        this.selectedStackTrace = false;
        this.selectedStack = undefined;
      }

      if (keyValue['urlName'] && keyValue['urlIndex']) {   // This is used for Nd report selected BT AutoFill
        this.checkedBuisnessTransaction = true;
        this.btInfo();
        this.selectedBuisnessTransaction = {};
        this.selectedBuisnessTransaction['name'] = keyValue['urlName'];
        this.selectedBuisnessTransaction['id'] = keyValue['urlIndex'];
        console.log("the value inside the selected business transaction is ......", this.selectedBuisnessTransaction);
      }
      else {
        this.checkedBuisnessTransaction = false;
        this.selectedBuisnessTransaction = null;
      }

      if (keyValue['ExcclassIdFC'] && keyValue['ExcClassId']) {
        this.selectedExceptionClass = true;
        this.exceptionClassInfo();
        this.selectedException = {};
        this.selectedException['name'] = keyValue['ExcclassIdFC'];
        this.selectedException['id'] = keyValue['ExcClassId'];
      }
      else {
        this.selectedException = undefined;
        this.selectedExceptionClass = false;
      }

      if (keyValue['ExcThrowingClassIdFC'] && keyValue['ExcThrowingClassId']) {
        this.selectedThrowingClass = true;
        this.exceptionThrowingClassInfo();
        this.selectedExceptionThrowingClass = {};
        this.selectedExceptionThrowingClass['name'] = keyValue['ExcThrowingClassIdFC'];
        this.selectedExceptionThrowingClass['id'] = keyValue['ExcThrowingClassId'];
      }
      else {
        this.selectedThrowingClass = false;
        this.selectedExceptionThrowingClass = undefined;
      }

      if (keyValue['ExcThrowingMethodIdFC'] && keyValue['ExcThrowingMethodId']) {
        this.selectedThrowingMethod = true;
        this.exceptionThrowingMethodInfo();
        this.selectedExceptionThrowingMethod = {};
        this.selectedExceptionThrowingMethod['name'] = keyValue['ExcThrowingMethodIdFC'];
        this.selectedExceptionThrowingMethod['id'] = keyValue['ExcThrowingMethodId'];
      }
      else {
        this.selectedThrowingMethod = false;
        this.selectedExceptionThrowingMethod = undefined;
      }

      if (keyValue['ExcCauseIdFC'] && keyValue['ExcCauseId']) {
        this.selectedExceptionCause = true;
        this.exceptionCauseInfo();
        this.selectedExceptionCauseType = {};
        this.selectedExceptionCauseType['name'] = keyValue['ExcCauseIdFC'];
        this.selectedExceptionCauseType['id'] = keyValue['ExcCauseId'];
      }
      else {
        this.selectedExceptionCause = false;
        this.selectedExceptionCauseType = undefined;
      }

      if (keyValue['ExcMsgIdFC'] && keyValue['ExcMsgId']) {
        this.selectedExceptionMessage = true;
        this.exceptionMessageInfo();
        this.selectedExceptionMessageType = {};
        this.selectedExceptionMessageType['name'] = keyValue['ExcMsgIdFC'];
        this.selectedExceptionMessageType['id'] = keyValue['ExcMsgId'];
      }
      else {
        this.selectedExceptionMessage = false;
        this.selectedExceptionMessageType = undefined;
      }
    }
    else
      console.log("*************error this._ddrData.nsCqmAutoFill[currentReport] not defined yet*************** ");
  }
  showGroupBy(): any {
    if (this.commonServices.currentReport == 'FlowpathGroupBy' || this.commonServices.currentReport == 'Exception' || this.commonServices.currentReport == 'DBGroupBy' || this.commonServices.currentReport == "Transaction Instance" || this.commonServices.currentReport == "Transaction Summary"
      || this.commonServices.currentReport == "Page Summary" || this.commonServices.currentReport == "Page Instance" || this.commonServices.currentReport == "Session Summary" || this.commonServices.currentReport == "Session Instance"
      || this.commonServices.currentReport == "URL Summary" || this.commonServices.currentReport == "URL Instance")
      return true;
    else
      return false;

  }
  checkNSFilter(): any {
    if (this.commonServices.currentReport == "Transaction Instance" || this.commonServices.currentReport == "Transaction Summary"
      || this.commonServices.currentReport == "Page Summary" || this.commonServices.currentReport == "Page Instance" || this.commonServices.currentReport == "Session Summary" || this.commonServices.currentReport == "Session Instance"
      || this.commonServices.currentReport == "URL Summary" || this.commonServices.currentReport == "URL Instance") {
      this.showNSFilter = true;
      this.showReportField = false;

      this.reportList = [{ label: 'Transaction Instance', value: 'Transaction Instance' }, { label: 'Transaction Summary', value: 'Transaction Summary' }, { label: 'Page Summary', value: 'Page Summary' }, { label: 'Page Instance', value: 'Page Instance' }
        , { label: 'URL Summary', value: 'URL Summary' }, { label: 'URL Instance', value: 'URL Instance' }, { label: 'Session Summary', value: 'Session Summary' }, { label: 'Session Instance', value: 'Session Instance' }]
      if (this.commonServices.currentReport == "Transaction Summary" || this.commonServices.currentReport == "Transaction Instance") {
        this.checkBoxUrl = false;
        this.checkBoxPage = false;
        this.checkBoxTransaction = true;
        this.hintUrl = "This option is uselectable for the current report";
        this.hintPage = "This option is uselectable for the current report";
        this.hintTransaction = "Transaction";
      }
      if (this.commonServices.currentReport == "Page Summary" || this.commonServices.currentReport == "Page Instance") {
        this.checkBoxUrl = false;
        this.checkBoxPage = true;
        this.checkBoxTransaction = true;
        this.hintUrl = "This option is uselectable for the current report";
        this.hintPage = "Page";
        this.hintTransaction = "Transaction";
      }
      if (this.commonServices.currentReport == "Session Summary" || this.commonServices.currentReport == "Session Instance") {
        this.checkBoxUrl = false;
        this.checkBoxPage = false;
        this.checkBoxTransaction = false;
        this.hintUrl = "This option is uselectable for the current report";
        this.hintPage = "This option is uselectable for the current report";
        this.hintTransaction = "This option is uselectable for the current report";
      }
      if (this.commonServices.currentReport == "URL Summary" || this.commonServices.currentReport == "URL Instance") {
        this.checkBoxUrl = true;
        this.checkBoxPage = true;
        this.checkBoxTransaction = true;
      }
      this.showCommonFilters = false;
      console.log("every thing finaly==> this.checkBoxTransaction =>", this.checkBoxTransaction, " this.checkBoxPage===> ", this.checkBoxPage, " this.checkBoxUrl==>", this.checkBoxUrl)

    }
    else
      this.showNSFilter = false;
    console.log("this.showNSFilter====>", this.showNSFilter);
    if (this.commonServices.currentReport == "Transaction Summary" || this.commonServices.currentReport == "URL Summary"
      || this.commonServices.currentReport == "Session Summary" || this.commonServices.currentReport == "Page Summary"
      || this.commonServices.currentReport == "Flowpath" || this.commonServices.currentReport == "FlowpathGroupBy"
      || this.commonServices.currentReport == 'DB Report' || this.commonServices.currentReport == 'DBGroupBy'
      || this.commonServices.currentReport == 'Exception' || this.commonServices.currentReport == 'Method Timing'
      || this.commonServices.currentReport == 'Hotspot' || this.commonServices.currentReport == 'IP Summary') {
      console.log("save query ***************************** ");
      if (this._ddrData.saveQueryField && this._ddrData.saveQueryField['queryName']) {
        this.queryName = this._ddrData.saveQueryField['queryName'];
        this.addDescription = this._ddrData.saveQueryField['description'];
      }
      else {
        this.queryName = "";
        this.addDescription = "";
      }
    }

  }
  // showUserFilter(): any {   // request for showing location access browser options 
  //   let url = decodeURIComponent(this.getHostUrl()+'/' + this.id.product.replace("/", "")) + "/v1/cavisson/netdiagnostics/webddr/nsUserFilters";
  //   console.log("show user filter url", url);
  //   try {

  //     this.ddrRequest.getDataUsingGet(url).subscribe(data => {
  //       console.log("data---", data);
  //       if (data == "1")
  //         this.showNsUserFilter = true;
  //       else
  //         this.showNsUserFilter = false;
  //     })
  //   }
  //   catch (e) {
  //     console.log("error--", e);
  //     this.showNsUserFilter = false;
  //   }
  // }

  getTRMode() {
    console.log("gettrmode--", this.urlParam);
    let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/getTestRunMode?testRun=' + this.urlParam.testRun;
    console.log("test run mode url-", url);
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      console.log("testRunMode--", this.testRunMode);
      let data = <any>res;
      this.testRunMode = data;
      console.log("testRunMode--after", this.testRunMode);
    });
  }
  isMultiDcEnable() {
    this.selectIsMultiDCCheckFlag = false;
    console.log("this.isMultiDC===", this.isMultiDC);
    if (this.isMultiDC) {
      this.getMultiDCInfo()
    }
    else {
      console.log("this.selectedDC--", this.selectedDC)
      this.selectedDC = [];
      this.dcList = [];
      this.selectedTier = false;
      this.setDefaultTierServerAppFilter();
      this.tierMetaData = undefined;
      this.serverMetaData = undefined;
      this.appMetaData = undefined;


      this.checkedBuisnessTransaction = false;
      this.BTOptions = [];
      this.selectedBuisnessTransaction = [];
    }
  }

  getMultiDCInfo() {
    console.log('this.dcListttttttt', this.dcList);
    console.log("this.urlParam--", this.urlParam);
    if (this.dcList.length == 0) {
      let url = this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")
        + '/v1/cavisson/netdiagnostics/ddr/multiDCForSidebar?testRun=' + this.urlParam.testRun;
      console.log("getMultiDCInfo urlllllll---", url);
      this.ddrRequest.getDataUsingGet(url).subscribe(data => {
        this.getMultiDcData(data)
      });
    }
  }
  getMultiDcData(res: any) {
    this.NDEInfoData = res;
    if (res.length == 0) {
      this.enableMultiDC = false;
    }
    else
      this.enableMultiDC = true;
    console.log("getMultiDcData-- data--", res);
    let i = 0;
    for (i = 0; i < res.length; i++) {
      console.log("res[i]--", res[i]);
      console.log("res[i].displayName--", res[i].displayName);
      this.dcList.push({ label: res[i].displayName, value: { displayName: res[i].displayName, pubicIP: res[i].pubicIP, publicPort: res[i].publicPort, ndeProtocol: res[i].ndeProtocol, isCurrent: res[i].isCurrent, ndeTestRun: res[i].ndeTestRun } });
      console.log("this.dcList--", this.dcList);

    }
    let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", ""))

    console.log("this.urlParam.product-", this.urlParam.product);
    console.log("this.getHostUrl()--", this.getHostUrl());
    console.log("url--", url);
  }

  changeMultiDC() {
    console.log("this.selectedDC--", this.selectedDC);
    this.selectedTier = false;
    this.selectTierFlag = false;
    this.selectServerFlag = false;
    this.selectAppFlag = false;
    this.setDefaultTierServerAppFilter();
    this.tierMetaData = undefined;
    this.serverMetaData = undefined;
    this.appMetaData = undefined;

    this.checkedBuisnessTransaction = false;
    this.BTOptions = [];
    this.selectedBuisnessTransaction = [];
  }
  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName;
    if (this._ddrData.isFromtrxFlow && !this._ddrData.isFromtrxSideBar) {
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.urlParam.testRun = this._ddrData.testRunTr;
      //   return hostDCName;
    }
    else {
      hostDcName = this._ddrData.getHostUrl();
      if (sessionStorage.getItem("isMultiDCMode") == "true") {
        this.urlParam.testRun = this._ddrData.testRun;
        console.log("all case test run==>", this.urlParam.testRun);
      }
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }
  getDCData() {
    return new Promise<void>((resolve, reject) => {
      //   this.isFirstTimeGetDcDataFunctionCall = true;
      //   let url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.urlParam.testRun;
      //this.http.get(url).map(res => res.json()).subscribe(data => (this.getNDEInfo(data)));
      //    this.http.get(url).map(res => res.json()).subscribe(data => {
      let data = this.NDEInfoData;
      console.log('COMPONENT - SIdebar , METHOD - getDCData,  var dcNameList= ', this.commonServices.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
      if (data.length == 0) {
        data = this.setNDEInfoForSingleDC();
        console.log("data is ", data);
      }
      if (this.commonServices.dcNameList.indexOf(',') != -1) {
        this.getNDEInfo(data)
      } else {
        this.singleDCCase(data);
      }
      //  },

      resolve();
    });

  }

  setNDEInfoForSingleDC() {
    let data;
    if (this.urlParam.dcName)
      data = [{ "displayName": this.urlParam.dcName, "ndeId": 1, "ndeIPAddr": this.urlParam.dcIP, "ndeTomcatPort": this.urlParam.dcPort, "ndeCtrlrName": "", "pubicIP": this.urlParam.dcIP, "publicPort": this.urlParam.dcPort, "isCurrent": 1, "ndeTestRun": this.urlParam.testRun, "ndeProtocol": location.protocol.replace(":", "") }];
    else if (this.commonServices.host) {
      let protocol;
      if (this.commonServices.protocol && this.commonServices.protocol.endsWith("://"))
        protocol = this.commonServices.protocol.replace("://", "");
      else
        protocol = location.protocol.replace(":", "");

      data = [{ "displayName": this.commonServices.selectedDC, "ndeId": 1, "ndeIPAddr": this.commonServices.host, "ndeTomcatPort": this.commonServices.port, "ndeCtrlrName": "", "pubicIP": this.commonServices.host, "publicPort": this.commonServices.port, "isCurrent": 1, "ndeTestRun": this.commonServices.testRun, "ndeProtocol": protocol }];
    }
    return data;
  }

  getNDEInfo(res) {
    this.ndeInfoData = res;
    this.dcList = [];
    let dcName = this.commonServices.dcNameList.split(',');
    let isFirst = false;

    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (dcName[i])
        this.dcList.push({ label: dcName[i], value: dcName[i] });

      if (this.commonServices.selectedDC && this.commonServices.selectedDC !== 'ALL') {
        this.selectedDC = this.commonServices.selectedDC;
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


  getSelectedDC($event?) {
    if ($event) {
      this.selectedDC = $event.value;
      console.log("calling from dcMenu select case ", $event.value);
    }
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.selectedDC == this.ndeInfoData[i].displayName) {

        this.ndeCurrentInfo = this.ndeInfoData[i];

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.dcProtocol = this.ndeInfoData[i].ndeProtocol;
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

        this.commonServices.host = this.host;
        this.commonServices.port = this.port;
        this.commonServices.protocol = this.dcProtocol;
        this.commonServices.testRun = this.testRun;
        this.commonServices.selectedDC = this.selectedDC;
        console.log('commonservece variable--------->', this.commonServices.host, '===', this.commonServices.port, '======', this.commonServices.protocol);
        break;
      }
    }

  }

  singleDCCase(res) {
    this.ndeInfoData = res;
    this.selectedDC = this.commonServices.dcNameList;
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.commonServices.dcNameList == this.ndeInfoData[i].displayName) {

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

        this.commonServices.host = this.host;
        this.commonServices.port = this.port;
        this.commonServices.protocol = this.protocol;
        this.commonServices.testRun = this.testRun;
        console.log('commonServices variable============', this.commonServices.host, '===', this.commonServices.port, '======', this.commonServices.protocol);
        break;
      }
    }

  }

  applyFilteredValueInSideBar() {

    if (this.commonServices.isValidParamInObj(this.message, "tierName")) {
      this.selectedTier = true;
      let tierArr = [];
      tierArr.push(this.message.tierName);
      this.tierName = tierArr;
      this.tierInfo();
    }

    if (this.commonServices.isValidParamInObj(this.message, "serverName")) {
      this.selectedServer = true;
      if (this.tierName.length == 1) {
        if (this.tierName[0] == this.message.tierName)
          var serverArr = [];
        serverArr.push(this.message.tierName + ":" + this.message.serverName);
        this.serverName = serverArr;
        this.serverInfo();
      }
    }
    if (this.commonServices.isValidParamInObj(this.message, "appName")) {
      this.selectedApp = true;
      if (this.tierName.length == 1) {
        if (this.tierName[0] == this.message.tierName)
          var appArr = [];
        appArr.push(this.message.tierName + ":" + this.message.serverName + ":" + this.message.appName);
        this.appName = appArr;
      }
      this.appInfo();
    }

    if (this.commonServices.isValidParamInObj(this.message, "urlName")) {
      this.checkedBuisnessTransaction = true;
      this.btInfo();
    }
    if (this.commonServices.isValidParamInObj(this.message, "btCategory")) {
      this.selectedBT = true;
      this.selectedBTCategory = this.commonServices.getBTCategoryID(this.message.btCategory);
    }

    /* this.selectedBTCategory = this.commonServices.getBTCategoryID(this.message.btCatagory);
     this.fpInstance =  this.message.flowpathInstance;
     this.selectedBuisnessTransaction = this.message.urlName;
     
     
     if(this.selectedBuisnessTransaction.length >0)
     this.checkedBuisnessTransaction = false;
     
    // if(this.fpInstance.length >0)
    // this.commonServices.isCheckedFlowpath = true;
    /* if(this.selectedBTCategory.length >0)
       this.selectedBT = true;

     if(this.fpInstance.length > 0)
       this.selectedFP = true;

     this.selectedTierVal = ["val1"];
     this.selectedServerVal = ["val2"];
     this.selectedAppVal = ["val3"];
     this.selectedBTVal = ["val5"];

     this.tierInfo(true);
     setTimeout(()=>
     {
       this.serverInfo(true);
     },2000);
     
     setTimeout(()=>
     {
       this.appInfo(true);
     },2000);
     
     this.btInfo(true); */

  }
  getResponseTimeModeValue(resMode) {
    if (resMode == "1")
      return "<=";
    else if (resMode == "2")
      return ">=";
    else if (resMode == "3")
      return "==";
  }

  getCorelationmodeValue(resMode) {

    if (resMode == "1")
      return "Exact";
    else if (resMode == "2")
      return "Starts With";
    else if (resMode == "3")
      return "Ends With";
    else if (resMode == "4")
      return "Contains";
  }
  Reset() {
    this.timeFilter = false;
    this.selectedTime = '';
    this.checkedResponseTime = false;
    this.responseCheck();
    this.checkGroup = false;
    this.selectedGroupBy = [];
    this.checkOrder = false;
    this.selectedOrderBy = [];
    this.selectedUrlStatus = undefined;
    this.selectedFailureId = undefined;
    this.selectedFailureNameId = undefined;
    this.selectedFailureName = undefined;
    this.failure = false;
    this.checkedScript = false;
    this.selectedScript = null;
    this.checkedTransaction = false;
    this.selectedTransaction = null;
    this.checkedPage = false;
    this.selectedPage = null;
    this.checkedUrl = false;
    this.selectedUrl = null;
    this.selectedTier = false;
    this.setDefaultTierServerAppFilter();
    this.selectedServer = false;
    this.setDefaultServerAppFilter();
    this.selectedApp = false;
    this.appName = [];
    this.appId = [];
    this.appNameFC = "NA";
    this.selectedFP = false;
    this.commonServices.flowpathInstance = "";
    this.fpInstance = "";
    this.checkedBuisnessTransaction = false;
    this.selectedBuisnessTransaction = "";
    this.nxt = false;
    this.prev = false;
    this.btCount = '';
    this.btLimit = 1000;
    this.btOffset = 0;
    this.selectedBT = false;
    this.selectedBTCategory = "";
    this.checkNQueryforPie = false;
    this.selectedTopNQuery = '';
    this.dbOrderByCheck = false;
    this.selectedDbOrderBy = [];
    this.isMultiDC = false;
    console.log("this.selectedDC--", this.selectedDC);
    this.selectedDC = [];
    this.dcList = [];
    this.selectedTier = false;
    this.setDefaultTierServerAppFilter();
    this.tierMetaData = undefined;
    this.serverMetaData = undefined;
    this.appMetaData = undefined;
    this.checkedBuisnessTransaction = false;
    this.BTOptions = [];
    this.selectedBuisnessTransaction = [];
    this.selectedExceptionClass = false;
    this.selectedException = null;
    this.selectedThrowingClass = false;
    this.selectedExceptionThrowingClass = null;
    this.selectedThrowingMethod = false;
    this.selectedExceptionThrowingMethod = null;
    this.selectedExceptionCause = false;
    this.selectedExceptionCauseType = null;
    this.selectedExceptionMessage = false;
    this.selectedExceptionMessageType = null;
    this.selectedStackTrace = false;
    this.selectedStack = "";
    this.checkedCorrId = false;
    this.selectedCorrIdMode = "";
    this.corrId = "";
    this.fpOrderByCheck = false;
    this.selectedFpOrderBy = [];
    this.checkedMethodCount = false;
    this.minMethods = "";
    this.checkNEntityforPie = false;
    this.selectedTopNEntity = '';
    this.selectedIP = false;
    this.selectedIntegrationPoint = [];
    this.isCheckedSessionId = false;
    this.ndSessionId = "";
    this.isCheckedPageId = false;
    this.nvPageId = "";
    this.isCheckedNVSessionID = false;
    this.nvSessionId = "";
    this.queryName = '';
    this.showQueryError = false;
    this.showSaveError = false;
    this.addDescription = '';
    this.selectAnyCheckBoxFlag = false;
    this.selectCheckBoxFlag = false;
    this.selectResponseCheckBoxFlag = false;
    this.selectResponseCheckBoxFlag1 = false;
    this.selectGroupByCheckBoxFlag = false;
    this.selectOrderByCheckBoxFlag = false;
    this.selectScriptCheckBoxFlag = false;
    this.selectTransactionCheckBoxFlag = false;
    this.selectPageCheckBoxFlag = false;
    this.selectUrlCheckBoxFlag = false;
    this.selectFailureTypeFlag = false;
    this.selectTierFlag = false;
    this.selectServerFlag = false;
    this.selectAppFlag = false;
    this.selectBTFlag = false;
    this.selectBTCategoryFlag = false;
    this.selectCheckNQuerryFlag = false;
    this.selectDBOrderByCheckFlag = false;
    this.selectIsMultiDCCheckFlag = false;
    this.selectExceptionClassFlag = false;
    this.selectedExceptionThrowingClassFlag = false;
    this.selectedExceptionThrowingMethodFlag = false;
    this.selectedExceptionCauseTypeFlag = false;
    this.selectedExceptionMessageTypeFlag = false;
    this.selectedStackFlag = false;
    this.selectfpInstanceFlag = false;
    this.selectedCorrIdModeFlag = false;
    this.selectedCorrIdModeFlag1 = false;
    this.selectedCorrIdModeFlag2 = false;
    this.selectedFpOrderByFlag = false;
    this.selectedminMethodsFlag = false;
    this.selectedTopNEntityFlag = false;
    this.selectIntegrationPointFlag = false;
    this.ndSessionIdFlag = false;
    this.nvPageIdFlag = false;
    this.nvSessionIdFlag = false;
  }
  onApply() {
    //this.fpInstance = this.commonServices.flowpathInstance;
    this.productKey = sessionStorage.getItem('productKey');
    console.log("this.isMultiDC--", this.isMultiDC)
    console.log("this.dcList--", this.dcList)
    console.log("this.selectedDC--", this.selectedDC);

    //For the UI Filter when we are not selecting any time period.
    //For Multi DC
    if (this.isMultiDC == true) {
      if (!this.selectedDC || this.selectedDC == [] || this.selectedDC == "" || this.selectedDC == null || this.selectedDC.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectIsMultiDCCheckFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectIsMultiDCCheckFlag) {
          return;
        }
      }
      else {
        this.selectIsMultiDCCheckFlag = false;
        console.log("No Message");
      }
    }
    //TimeFilter
    if (this.timeFilter == true) {
      if (!this.selectedTime || this.selectedTime == "") {
        this.selectAnyCheckBoxFlag = false;
        this.selectCheckBoxFlag = true;
        console.log("Without Selecting any dropdown-----", this.showCheckBoxErrorMessage);
        if (this.selectCheckBoxFlag) {
          return;
        }
      } else {
        this.selectCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    //Response time
    if (this.checkedResponseTime == true) {
      if (this.resSelectedCompareOption == "1") {
        if (!this.responseTime || this.responseTime == "") {
          this.selectAnyCheckBoxFlag = false;
          this.selectResponseCheckBoxFlag = true;
          console.log("Response Error message is ....", this.showInputFieldErrorMessage)
          if (this.selectResponseCheckBoxFlag) {
            return;
          }
        }
        else {
          this.selectResponseCheckBoxFlag = false;
          console.log("No message");
        }
      }
      if (this.resSelectedCompareOption == "2" || this.resSelectedCompareOption == "3") {
        if (!this.responseTime || this.responseTime == "") {
          this.selectAnyCheckBoxFlag = false;
          this.selectResponseCheckBoxFlag = false;
          this.selectResponseCheckBoxFlag1 = true;
          console.log("Response Error message is ....", this.showInputFieldErrorMessage)
          if (this.selectResponseCheckBoxFlag1) {
            return;
          }
        }
        else {
          this.selectResponseCheckBoxFlag1 = false;
          console.log("No message");
        }
      }
    }
    //Group By
    if (this.checkGroup == true) {
      if (!this.selectedGroupBy || this.selectedGroupBy == [] || this.selectedGroupBy == null || this.selectedGroupBy.length == 0 || !this.groupBy || this.groupBy == []) {
        this.selectAnyCheckBoxFlag = false;
        this.selectGroupByCheckBoxFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectGroupByCheckBoxFlag) {
          return;
        }
      }
      else {
        this.selectGroupByCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    // Order By
    if (this.checkOrder == true) {
      if (!this.selectedOrderBy || this.selectedOrderBy == [] || this.selectedOrderBy == null || this.selectedOrderBy.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectOrderByCheckBoxFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectOrderByCheckBoxFlag) {
          return;
        }
      }
      else {
        this.selectOrderByCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    //For script 
    if (this.checkedScript == true) {
      if (!this.selectedScript || this.selectedScript == null || this.selectedScript == [] || this.selectedScript.length == 0 || this.selectedScript == "" || !this.selectedScript.name || this.selectedScript.name == null || !this.selectedScript.id || this.selectedScript.id == null) {
        this.selectAnyCheckBoxFlag = false;
        this.selectScriptCheckBoxFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectScriptCheckBoxFlag) {
          return;
        }
      }
      else {
        this.selectScriptCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    //For Transaction
    if (this.checkedTransaction == true) {
      if (!this.selectedTransaction || this.selectedTransaction == null || this.selectedTransaction == [] || this.selectedTransaction.length == 0 || !this.selectedTransaction.name || this.selectedTransaction.name == null || !this.selectedTransaction.id || this.selectedTransaction.id == null) {
        this.selectAnyCheckBoxFlag = false;
        this.selectTransactionCheckBoxFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectTransactionCheckBoxFlag) {
          return;
        }
      }
      else {
        this.selectTransactionCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    //For Page
    if (this.checkedPage == true) {
      if (!this.selectedPage || this.selectedPage == null || this.selectedPage == [] || !this.selectedPage.name || this.selectedPage.name == null || !this.selectedPage.id || this.selectedPage.id == null) {
        this.selectAnyCheckBoxFlag = false;
        this.selectPageCheckBoxFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectPageCheckBoxFlag) {
          return;
        }
      }
      else {
        this.selectPageCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    //For URL
    if (this.checkedUrl == true) {
      if (!this.selectedUrl || this.selectedUrl == null || this.selectedUrl == [] || this.selectedUrl.name == null || !this.selectedUrl.name || this.selectedUrl.id == null || !this.selectedUrl.id) {
        this.selectAnyCheckBoxFlag = false;
        this.selectUrlCheckBoxFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectUrlCheckBoxFlag) {
          return;
        }
      }
      else {
        console.log("select url", this.selectedUrl);
        this.selectUrlCheckBoxFlag = false;
        console.log("No Message");
      }
    }
    //For the case ... when any URL status has been choosen
    if (this.selectedUrlStatus == 4) {
      console.log("selected Url status", this.selectedUrlStatus);
      if (!this.selectedFailureId || this.selectedFailureId == [] || this.selectedFailureId == null || this.selectedFailureId.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectFailureTypeFlag = true;
        console.log("Without selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectFailureTypeFlag) {
          return;
        }
      }
      else {
        this.selectFailureTypeFlag = false;
        console.log("No Message");
      }
    }
    //Common filters started from here..
    //Tier case
    if (this.selectedTier == true) {
      if (!this.tierName || this.tierName == [] || this.tierName.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectTierFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectTierFlag) {
          return;
        }
      }
      else {
        this.selectTierFlag = false;
        console.log("No Message");
      }
    }
    //Server case
    if (this.selectedServer == true) {
      if (!this.serverName || this.serverName == [] || this.serverName.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectServerFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectServerFlag) {
          return;
        }
      }
      else {
        this.selectServerFlag = false;
        console.log("No Message");
      }
    }
    //Instance case
    if (this.selectedApp == true) {
      if (!this.appName || this.appName == [] || this.appName.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectAppFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectAppFlag) {
          return;
        }
      }
      else {
        this.selectAppFlag = false;
        console.log("No Message");
      }
    }
    //Flowpath Instance case
    if (this.selectedFP == true) {
      if (!this.fpInstance || this.fpInstance == "" || this.fpInstance == null) {
        this.selectAnyCheckBoxFlag = false;
        this.selectfpInstanceFlag = true;
        console.log("Without selecting any option", this.showInputFieldErrorMessage);
        if (this.selectfpInstanceFlag) {
          return;
        }
      }
      else {
        this.selectfpInstanceFlag = false;
        console.log("No Message");
      }
    }
    //BT case
    if (this.checkedBuisnessTransaction == true) {
      if (!this.selectedBuisnessTransaction || this.selectedBuisnessTransaction == [] || this.selectedBuisnessTransaction == "" || this.selectedBuisnessTransaction.length == 0 || !this.selectedBuisnessTransaction.name || this.selectedBuisnessTransaction.name == null || !this.selectedBuisnessTransaction.id || this.selectedBuisnessTransaction.id == null) {
        this.selectAnyCheckBoxFlag = false;
        this.selectBTFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectBTFlag) {
          return;
        }
      }
      else {
        this.selectBTFlag = false;
        console.log("No Message");
      }
    }
    //BT Category
    if (this.selectedBT == true) {
      if (!this.selectedBTCategory || this.selectedBTCategory == "") {
        this.selectAnyCheckBoxFlag = false;
        this.selectBTCategoryFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectBTCategoryFlag) {
          return;
        }
      }
      else {
        this.selectBTCategoryFlag = false;
        console.log("No Message");
      }
    }
    //For Top N Querry
    if (this.checkNQueryforPie == true) {
      if (!this.selectedTopNQuery || this.selectedTopNQuery == "" || this.selectedTopNQuery == null) {
        this.selectAnyCheckBoxFlag = false;
        this.selectCheckNQuerryFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectCheckNQuerryFlag) {
          return;
        }
      }
      else {
        this.selectCheckNQuerryFlag = false;
        console.log("No Message");
      }
    }
    //For DB OrderBy
    if (this.dbOrderByCheck == true) {
      if (!this.selectedDbOrderBy || this.selectedDbOrderBy == [] || this.selectedDbOrderBy == null || this.selectedDbOrderBy.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectDBOrderByCheckFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectDBOrderByCheckFlag) {
          return;
        }
      }
      else {
        this.selectDBOrderByCheckFlag = false;
        console.log("No Message");
      }
    }
    //For Exception Class
    if (this.selectedExceptionClass === true) {
      if (!this.selectedException || this.selectedException == null || this.selectedException == "" || !this.selectedException.id || !this.selectedException.name) {
        this.selectAnyCheckBoxFlag = false;
        this.selectExceptionClassFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectExceptionClassFlag) {
          return;
        }
      }
      else {
        this.selectExceptionClassFlag = false;
        console.log("No Message");
      }
    }
    //For Throwing Class
    if (this.selectedThrowingClass === true) {
      if (!this.selectedExceptionThrowingClass || this.selectedExceptionThrowingClass == null || this.selectedExceptionThrowingClass == "" || !this.selectedExceptionThrowingClass.id || !this.selectedExceptionThrowingClass.name) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedExceptionThrowingClassFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectedExceptionThrowingClassFlag) {
          return;
        }
      }
      else {
        this.selectedExceptionThrowingClassFlag = false;
        console.log("No Message");
      }
    }
    //For Throwing Method
    if (this.selectedThrowingMethod === true) {
      if (!this.selectedExceptionThrowingMethod || this.selectedExceptionThrowingMethod == null || this.selectedExceptionThrowingMethod == "" || !this.selectedExceptionThrowingClass.id || !this.selectedExceptionThrowingClass.name) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedExceptionThrowingMethodFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectedExceptionThrowingMethodFlag) {
          return;
        }
      }
      else {
        this.selectedExceptionThrowingMethodFlag = false;
        console.log("No Message");
      }
    }
    //For Exception Cause
    if (this.selectedExceptionCause === true) {
      if (!this.selectedExceptionCauseType || this.selectedExceptionCauseType == null || this.selectedExceptionCauseType == "" || !this.selectedExceptionCauseType.id || !this.selectedExceptionCauseType.name) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedExceptionCauseTypeFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectedExceptionCauseTypeFlag) {
          return;
        }
      }
      else {
        this.selectedExceptionCauseTypeFlag = false;
        console.log("No Message");
      }
    }
    //For Exception Message
    if (this.selectedExceptionMessage === true) {
      if (!this.selectedExceptionMessageType || this.selectedExceptionMessageType == null || this.selectedExceptionMessageType == "" || !this.selectedExceptionMessageType.id || !this.selectedExceptionMessageType.name) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedExceptionMessageTypeFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectedExceptionMessageTypeFlag) {
          return;
        }
      }
      else {
        this.selectedExceptionMessageTypeFlag = false;
        console.log("No Message");
      }
    }
    //For Stack Trace
    if (this.selectedStackTrace === true) {
      if (!this.selectedStack || this.selectedStack == null || this.selectedStack == "") {
        this.selectAnyCheckBoxFlag = false;
        this.selectedStackFlag = true;
        console.log("Without selecting any option", this.showInputFieldErrorMessage);
        if (this.selectedStackFlag) {
          return;
        }
      }
      else {
        this.selectedStackFlag = false;
        console.log("No Message");
      }
    }
    //For Corr ID
    if (this.checkedCorrId == true) {
      if ((!this.selectedCorrIdMode || this.selectedCorrIdMode == null || this.selectedCorrIdMode == "") && (!this.corrId || this.corrId == null || this.corrId == "")) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedCorrIdModeFlag = true;
        this.selectedCorrIdModeFlag1 = false;
        this.selectedCorrIdModeFlag2 = false;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage, this.showInputFieldErrorMessage);
        if (this.selectedCorrIdModeFlag) {
          return;
        }
      }
      else if ((!this.selectedCorrIdMode || this.selectedCorrIdMode == null || this.selectedCorrIdMode == "") && !(!this.corrId || this.corrId == null || this.corrId == "")) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedCorrIdModeFlag2 = true;
        this.selectedCorrIdModeFlag = false;
        this.selectedCorrIdModeFlag1 = false;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectedCorrIdModeFlag2) {
          return;
        }
      } else if ((!this.corrId || this.corrId == null || this.corrId == "") && !(!this.selectedCorrIdMode || this.selectedCorrIdMode == null || this.selectedCorrIdMode == "")) {
        //this.selectAnyCheckBoxFlag = false;
        this.selectedCorrIdModeFlag1 = true;
        this.selectedCorrIdModeFlag = false;
        this.selectedCorrIdModeFlag2 = false;
        console.log("Without selecting any option", this.showInputFieldErrorMessage);
        if (this.selectedCorrIdModeFlag1) {
          return;
        }
      }
      else {
        this.selectedCorrIdModeFlag = false;
        this.selectedCorrIdModeFlag1 = false;
        this.selectedCorrIdModeFlag2 = false;
        console.log("No Message");
      }
    }
    //For Order By
    if (this.fpOrderByCheck == true) {
      if (!this.selectedFpOrderBy || this.selectedFpOrderBy == null || this.selectedFpOrderBy == [] || this.selectedFpOrderBy.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectedFpOrderByFlag = true;
        console.log("Without selecting any option", this.showCheckBoxErrorMessage);
        if (this.selectedFpOrderByFlag) {
          return;
        }
      }
      else {
        this.selectedFpOrderByFlag = false;
        console.log("No Message");
      }
    }
    //For Methods FpFilters
    if (this.checkedMethodCount == true) {
      if (!this.minMethods || this.minMethods == null || this.minMethods == "") {
        this.selectAnyCheckBoxFlag = false;
        this.selectedminMethodsFlag = true;
        console.log("Without selecting any option", this.showInputFieldErrorMessage);
        if (this.selectedminMethodsFlag) {
          return;
        }
      }
      else {
        this.selectedminMethodsFlag = false;
        console.log("No Message");
        this.checkNEntityforPie == true
      }
    }
    //For Method Timing  (Top N Entities for pie chart)
    if (this.checkNEntityforPie == true) {
      if (!this.selectedTopNEntity || this.selectedTopNEntity == null || this.selectedTopNEntity == "") {
        this.selectAnyCheckBoxFlag = false;
        this.selectedTopNEntityFlag = true;
        console.log("Without selecting any option", this.showInputFieldErrorMessage);
        if (this.selectedTopNEntityFlag) {
          return;
        }
      }
      else {
        this.selectedTopNEntityFlag = false;
        console.log("No Message");
      }
    }
    //For IP
    if (this.selectedIP == true) {
      if (!this.selectedIntegrationPoint || this.selectedIntegrationPoint == null || this.selectedIntegrationPoint == [] || this.selectedIntegrationPoint.length == 0) {
        this.selectAnyCheckBoxFlag = false;
        this.selectIntegrationPointFlag = true;
        console.log("When we not selecting any value", this.showCheckBoxErrorMessage);
        if (this.selectIntegrationPointFlag) {
          return;
        }
      }
      else {
        this.selectIntegrationPointFlag = false;
        console.log("No Message");
      }
    }
    //For Session Id
    if (this.isCheckedSessionId == true) {
      if (!this.ndSessionId || this.ndSessionId == "" || this.ndSessionId == null) {
        this.selectAnyCheckBoxFlag = false;
        this.ndSessionIdFlag = true;
        console.log("When we are not selecting any value", this.showInputFieldErrorMessage);
        if (this.ndSessionIdFlag) {
          return;
        }
      }
      else {
        this.ndSessionIdFlag = false;
        console.log("No Message");
      }
    }
    //For Page Id
    if (this.isCheckedPageId == true) {
      if (!this.nvPageId || this.nvPageId == "" || this.nvPageId == null) {
        this.selectAnyCheckBoxFlag = false;
        this.nvPageIdFlag = true;
        console.log("When we are not selecting any value", this.showInputFieldErrorMessage);
        if (this.nvPageIdFlag) {
          return;
        }
      }
      else {
        this.nvPageIdFlag = false;
        console.log("No Message");
      }
    }
    //For NVSession Id
    if (this.isCheckedNVSessionID == true) {
      if (!this.nvSessionId || this.nvSessionId == "" || this.nvSessionId == null) {
        this.selectAnyCheckBoxFlag = false;
        this.nvSessionIdFlag = true;
        console.log("When we are not selecting any value", this.showInputFieldErrorMessage);
        if (this.nvSessionId) {
          return;
        }
      }
      else {
        this.nvSessionIdFlag = false;
        console.log("No Message");
      }
    }


    if (this.isMultiDC == true || this.timeFilter == true || this.checkedResponseTime == true || this.checkGroup == true || this.checkOrder == true || this.checkedScript == true || this.checkedTransaction == true || this.checkedPage == true || this.checkedUrl == true || this.selectedUrlStatus == -2 || this.selectedUrlStatus == -1 || this.selectedUrlStatus == 0 || this.selectedUrlStatus == 4 || this.selectedTier == true || this.selectedServer == true || this.selectedApp == true || this.selectedFP == true || this.checkedBuisnessTransaction == true || this.selectedBT == true || this.checkNQueryforPie == true || this.dbOrderByCheck == true || this.selectedStackTrace === true || this.selectedExceptionMessage === true || this.selectedExceptionCause === true || this.selectedThrowingMethod === true || this.selectedThrowingClass === true || this.selectedExceptionClass === true || this.checkedMethodCount == true || this.checkNEntityforPie == true || this.checkedCorrId == true || this.fpOrderByCheck == true || this.selectedIP == true || this.isCheckedSessionId == true || this.isCheckedPageId == true || this.isCheckedNVSessionID == true) {
      this.selectAnyCheckBoxFlag = false;
    }
    else {
      this.selectAnyCheckBoxFlag = true;
      console.log("this is the message for that case when we are not selecting time filter", this.showAnyCheckBoxErrorMessage);
      if (this.selectAnyCheckBoxFlag) {
        return;
      }
    }




    //Here it's work has finished.
    if (this.selectedTime == 'Custom Time') {

      if (this.startDateObj > this.endDateObj) {
        this.customTimeError = true;
      }
      else {
        this.customTimeError = false;
      }
      if (!this.strDate) {
        this.showStartTimeError = true;
        //alert("Please Provide Start Time");
      }
      if (!this.endDate) {
        this.showEndTimeError = true;
        //alert("Please Provide End Time");
      }
      if (this.showStartTimeError || this.showEndTimeError || this.customTimeError)
        return;
      if (this.commonServices.isValidParameter(this.strTimeInDateFormat) && this.commonServices.isValidParameter(this.endTimeInDateFormat)) {
        let url = '';

        if (this.isMultiDC && this.dcList.length != 0) {
          url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + '/' + this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/timeHandling?testRun=' + this.selectedDC.ndeTestRun + '&startTimeInDateFormat=' + this.strTimeInDateFormat + '&endTimeInDateFormat=' + this.endTimeInDateFormat;
        }
        else { url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/timeHandling?testRun=' + this.urlParam.testRun + '&startTimeInDateFormat=' + this.strTimeInDateFormat + '&endTimeInDateFormat=' + this.endTimeInDateFormat; }

        console.log("url for custom time--", url);
        this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignCustomTime(data)));
      }
    }
    else if ( /*this.timeFilter == true && */this.commonServices.isValidParameter(this.selectedTime) && this.selectedTime != "Whole Scenario") {
      // let restDrillDownUrl = this.urlParam.restDrillDownUrl;
      // console.log("restDrillDownUrl--", restDrillDownUrl);
      let timeFilterUrl = '';
      if (this.isMultiDC && this.dcList.length != 0) {

        timeFilterUrl = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=' + this.selectedDC.ndeTestRun;
      }

      else {
        timeFilterUrl = this.getHostUrl() + '/' + this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=' + this.urlParam.testRun
      }

      timeFilterUrl = timeFilterUrl + "&graphTimeKey=" + this.selectedTime;
      console.log("time filter call outgoing ddrsideBar", timeFilterUrl);
      this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => (this.setTimeFilter(data)));
    }
    else {
      console.log("this.selectedTime   ", this.selectedTime);
      if (this.selectedTime == "Whole Scenario") {
        this.strTime = "";
        this.endTime = "";
        console.log("start time and end time set undefined");
      }
      this.applyFilter();
    }

  }
  assignCustomTime(res: any) {
    console.log("res data for custom time--", res);
    this.strTime = res.strStartTime;
    this.endTime = res.strEndTime;

    this.applyFilter();
  }

  applyFilter() {
    // this.commonServices.currentReport = this.reportType ;this.previousReport == this.commonServices.currentReport
    console.log("this.commonServices.currentReport inside apply filter--", this.commonServices.currentReport);
    console.log("this.previousReport--", this.commonServices.previousReport);
    let msg = 'Filter for ' + this.commonServices.currentReport + ' Report is applied successfully';

    this._ddrData.setInLogger('DDR::Filter', this.commonServices.currentReport, 'Filters Apply', msg);
    if (this.tierName.length != 0)  //default value blank array
    {
      // if (this.tierName.toString().indexOf('Overall') != -1) {
      //   this.tierNameFC = 'NA';
      //   this.tierId = ['NA'];

      // }
      // else   //getID
      // {
      this.tierId = [];
      for (let i = 0; i < this.tierName.length; i++) {
        let tierid = this.tierMetaData[this.tierName[i]];
        if (this.tierId.indexOf(tierid) == -1)  //for unique ids
          this.tierId.push(tierid);
      }
      this.tierNameFC = this.tierName.toString();

      // }
    }

    if (this.serverName.length != 0) {
      // if (this.serverName.indexOf('Overall') != -1)   //if tier Overall selected
      // {
      //   this.serverNameFC = "NA";
      //   this.serverId = ["NA"];
      // }
      // else {
      this.serverId = [];
      for (let i = 0; i < this.serverName.length; i++) {
        let serverid = this.serverMetaData[this.serverName[i]];
        if (this.serverId.indexOf(serverid) == -1)
          this.serverId.push(serverid);

        let serverNameArr = this.serverName[i].split(":");
        if (i == 0)
          this.serverNameFC = serverNameArr[1];
        else if (this.serverNameFC.indexOf(serverNameArr[1]) == -1)
          this.serverNameFC += "," + serverNameArr[1];

      }
      // }
    }

    if (this.appName.length != 0) {
      // if (this.appName.toString().indexOf('Overall') != -1) {
      //   this.appNameFC = "NA";
      //   this.appId = ["NA"];
      // }
      // else  //getID
      // {
      this.appId = [];
      for (let i = 0; i < this.appName.length; i++) {
        let appid = this.appMetaData[this.appName[i]];
        if (this.appId.indexOf(appid) == -1)
          this.appId.push(appid);

        let appNameArr = this.appName[i].split(":");

        if (i == 0)
          this.appNameFC = appNameArr[2];
        else if (this.appNameFC.indexOf(appNameArr[2]) == -1)
          this.appNameFC += "," + appNameArr[2];
      }
      // }
    }

    if (this.selectedFailureId != undefined) {
      for (let i = 0; i < this.selectedFailureId.length; i++) {
        if (i == 0) {
          this.selectedFailureName = this.failureIdNameObj[this.selectedFailureId[i]];
          this.selectedFailureNameId = this.selectedFailureId[i];
        }
        else {
          this.selectedFailureName += "," + this.failureIdNameObj[this.selectedFailureId[i]];
          this.selectedFailureNameId += "," + this.selectedFailureId[i];

        }
      }
    }

    //variable selectedPage has default value - undefined and is -null when it's unchecked 
    if (this.selectedPage != undefined && this.selectedPage != null) {
      let scriptPage = this.selectedPage.name.split(":"); // 0-script, 1-page
      this.page = scriptPage[1];
    }
    else
      this.page = "NA";

    this.queryData['reportType'] = this.commonServices.currentReport;

    this.queryData['fpInstance'] = this.fpInstance;
    this.queryData['tierName'] = this.tierName;
    this.queryData['serverName'] = this.serverName;
    this.queryData['appName'] = this.appName;
    this.queryData['tierId'] = this.tierId;
    this.queryData['serverId'] = this.serverId;
    this.queryData['appId'] = this.appId;
    this.queryData['resCompareOption'] = this.resSelectedCompareOption;

    if (this.resVariance != null && this.resVariance != "" && this.responseTime != null && this.responseTime != '') {
      console.log("this.resVariance before---", this.resVariance);
      this.responseTime1 = parseInt(this.responseTime) - parseInt(this.resVariance);
      console.log("this.resVariance after---", this.resVariance);
      console.log("responsetime1---", this.responseTime1);
      this.responseTime2 = parseInt(this.responseTime) + parseInt(this.resVariance);
      console.log("responsetime2 is---", this.responseTime2);

      if ((Number(this.resVariance) > Number(this.responseTime))) {
        this.responseTimeMessage = true;
      }
      else
        this.responseTimeMessage = false;
    }
    else {
      this.responseTimeMessage = false;
      this.responseTime1 = this.responseTime;
      this.responseTime2 = "";
    }

    this.queryData['responseTime'] = this.responseTime;
    this.queryData['responseTime2'] = this.responseTime2;
    this.queryData['minMethods'] = this.minMethods;
    this.queryData['corrId'] = this.corrId;
    this.queryData['corrIdModeOptions'] = this.selectedCorrIdMode;
    this.queryData['selectedBTCategory'] = this.selectedBTCategory;
    this.queryData['startTime'] = this.trStartTime;
    this.queryData['endTime'] = this.trEndTime;

    this.queryData['groupBy'] = this.selectedGroupBy;
    this.queryData['orderBy'] = this.selectedOrderBy;

    this.queryData['urlId'] = this.selectedUrlStatus;
    this.queryData['FailureId'] = this.selectedFailureId;
    this.queryData['FailureName'] = this.selectedFailureName;

    this.queryData['queryText'] = this.queryText;
    this.queryData['QueryType'] = this.selectedQueryType;

    this.queryData['Exception'] = this.selectedException;
    this.queryData['ExceptionThrowingClass'] = this.selectedExceptionThrowingClass;
    this.queryData['ExceptionThrowingMethod'] = this.selectedExceptionThrowingMethod;
    this.queryData['ExceptionCauseType'] = this.selectedExceptionCauseType;
    this.queryData['Stack'] = this.selectedStack;
    this.queryData['ExceptionMessageType'] = this.selectedExceptionMessageType;

    this.queryData['selectedUrl'] = this.selectedUrl;
    this.queryData['selectedPage'] = this.selectedPage;
    this.queryData['selectedScript'] = this.selectedScript;
    this.queryData['selectedTransaction'] = this.selectedTransaction;
    this.queryData['selectedLocation'] = this.selectedLocation;
    this.queryData['selectedBrowser'] = this.selectedBrowser;
    this.queryData['selectedAccess'] = this.selectedAccess;

    console.log("main start time", this.trStartTime);
    console.log("main end time", this.trEndTime);
    console.log("this.tierId");

    console.log('called on apply', this.queryData);
    console.log("this.commonServices._ddrSideBarOnApply is ", this.commonServices._ddrSideBarOnApply);

    if (this.commonServices.currentReport == 'DB Report') {

      if (this.commonServices.previousReport == this.commonServices.currentReport) {
        console.log("same report case in DB Report")
        this.assignDBFilters();
        this.commonServices.sideBarUI$.next(this.queryData);
      }
      else {
        console.log("changed report case routing from DB Report");
        this.assignDBDefaultFilters();
        this.commonServices.previousReport = 'DB Report'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
        this.commonServices.isFilterFromSideBar = true;
        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
          this._router.navigate(['/home/ddrCopyLink/dbReport']);
        else
          this._router.navigate(['/ddr/dbReport']);
      }
    }

    if (this.commonServices.currentReport == "Transaction Summary") {

      this.TickStrTime = true;
      this.TickEndTime = true;
      this.TickTransaction = true;
      this.TickTransactionId = true;
      this.TickUrl = true;
      this.TickUrlId = true;
      this.TickScript = true;
      this.TickScriptId = true;
      this.TickGroup = true;
      this.TickOrder = true;
      this.TickLocation = true;
      this.TickBrowser = true;
      this.TickAccess = true;
      this.TickStatus = true;
      this.commonServices.nsTransactionSummary = this.assignCommonFilters(this.commonServices.nsTransactionSummary);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "Transaction Instance") {
      this.TickStrTime = true;
      this.TickEndTime = true;
      this.TickTransaction = true;
      this.TickUrl = true;
      this.TickScript = true;
      this.TickGroup = true;
      this.TickOrder = true;
      this.TickPage = true;
      this.TickLocation = true;
      this.TickAccess = true;
      this.TickBrowser = true;
      this.TickStatus = true;
      this.commonServices.nsTransactionInstance = this.assignCommonFilters(this.commonServices.nsTransactionInstance);

      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "Page Instance") {
      this.TickStrTime = true;
      this.TickEndTime = true;
      this.TickTransaction = true;
      this.TickScript = true;
      this.TickGroup = true;
      this.TickOrder = true;
      this.TickPage = true;
      this.TickLocation = true;
      this.TickAccess = true;
      this.TickBrowser = true;
      this.TickStatus = true;
      this.commonServices.nsPageInstance = this.assignCommonFilters(this.commonServices.nsPageInstance);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "Page Summary") {
      this.TickStrTime = true;
      this.TickEndTime = true;
      this.TickTransaction = true;
      this.TickTransactionId = true;
      this.TickScript = true;
      this.TickScriptId = true;
      this.TickGroup = true;
      this.TickOrder = true;
      this.TickPage = true;
      this.TickPageId = true;
      this.TickLocation = true;
      this.TickBrowser = true;
      this.TickAccess = true;
      this.TickStatus = true;
      this.commonServices.nsPageSummary = this.assignCommonFilters(this.commonServices.nsPageSummary);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "Session Summary") {
      this.TickStrTime = true;
      this.TickEndTime = true;
      this.TickTransaction = true;
      this.TickTransactionId = true;
      this.TickUrl = true;
      this.TickUrlId = true;
      this.TickScript = true;
      this.TickScriptId = true;
      this.TickGroup = true;
      this.TickOrder = true;
      this.TickPage = true;
      this.TickPageId = true;
      this.TickStatus = true;
      this.TickLocation = true;
      this.TickBrowser = true;
      this.TickAccess = true;
      this.commonServices.nsSessionSummary = this.assignCommonFilters(this.commonServices.nsSessionSummary);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "Session Instance") {
      this.TickStrTime = true;
      this.TickEndTime = true;
      this.TickTransaction = true;
      this.TickUrl = true;
      this.TickScript = true;
      this.TickGroup = true;
      this.TickOrder = true;
      this.TickPage = true;
      this.TickLocation = true;
      this.TickAccess = true;
      this.TickBrowser = true;
      this.TickStatus = true;
      this.commonServices.nsSessionInstance = this.assignCommonFilters(this.commonServices.nsSessionInstance);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "URL Summary") {
      console.log("inside url summary side bar")
      this.commonServices.nsURLSummary = this.assignUrlFilters(this.commonServices.nsURLSummary);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }
    if (this.commonServices.currentReport == "URL Instance") {
      console.log("inside url summary side bar")
      this.commonServices.nsURLInstance = this.assignUrlFilters(this.commonServices.nsURLInstance);
      this.commonServices.isFilterFromNSSideBar = true;
      this.commonServices.sideBarUI$.next(this.queryData);
    }

    if (this.commonServices.currentReport == 'Method Timing') {

      if (this.commonServices.previousReport == this.commonServices.currentReport) {
        console.log("same report case in method timing")
        this.assignMethodTimingFilters();
        this.commonServices.sideBarUI$.next(this.queryData);
      }
      else {
        console.log("changed report case routing from method timing");
        this.assignMethodTimingDefaultFilters();
        this.commonServices.previousReport = 'Method Timing'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
        this.commonServices.isFilterFromSideBar = true;
        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
          this._router.navigate(['/home/ddrCopyLink/methodtiming']);
        else
          this._router.navigate(['/ddr/methodtiming']);
      }
    }

    if (this.commonServices.currentReport == 'Hotspot') {
      if (this.commonServices.previousReport == this.commonServices.currentReport) {
        console.log("same report case in hotspot")
        this.assignHotspotFilters();
        this.commonServices.sideBarUI$.next(this.queryData);
      }
      else {
        console.log("changed report case routing from hotspot");
        this.assignHotspotDefaultFilters();
        this.commonServices.previousReport = 'Hotspot'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
        this.commonServices.isFilterFromSideBar = true;
        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
          this._router.navigate(['/home/ddrCopyLink/hotspot']);
        else
          this._router.navigate(['/ddr/hotspot']);
      }
    }
    if (this.commonServices.currentReport == 'IP Summary') {

      if (this.commonServices.previousReport == this.commonServices.currentReport) {
        console.log("same report case in ipsummary")
        this.assignIPSummaryFilters();
        this.commonServices.sideBarUI$.next(this.queryData);
      }
      else {
        console.log("changed report case routing from ipsummary");
        this.assignIPSummaryDefaultFilters();
        this.commonServices.previousReport = 'IP Summary'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
        this.commonServices.isFilterFromSideBar = true;
        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
          this._router.navigate(['/home/ddrCopyLink/ipsummary']);
        else
          this._router.navigate(['/ddr/ipsummary']);
      }
    }

    if (this.commonServices.currentReport == 'Flowpath') {

      if (this.responseTimeMessage)
        alert("Response Time Variance must be less than or equal to actual response time");
      else {

        if (this.commonServices.previousReport == this.commonServices.currentReport) {
          console.log("same report case")
          this.assignFlowpathFilters();
          this.commonServices.sideBarUI$.next(this.queryData);
        }
        else {
          console.log("changed report case routing");
          this.assignFlowpathDefaultFilters();
          this.commonServices.previousReport = 'Flowpath'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
          this.commonServices.isFilterFromSideBar = true;
          if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
            this._router.navigate(['/home/ddrCopyLink/flowpath']);
          else
            this._router.navigate(['/ddr/flowpath']);
        }
      }
    }

    if (this.commonServices.currentReport == 'Exception') {
      if ((this.selectedExceptionClass == true && this.selectedGroupBy.indexOf("excclass") != -1) || (this.selectedThrowingClass == true && this.selectedGroupBy.indexOf("excthrowingclass") != -1) || (this.selectedThrowingMethod == true && this.selectedGroupBy.indexOf("excthrowingmethod") != -1) ||
        (this.selectedExceptionCause == true && this.selectedGroupBy.indexOf("exccause") != -1) || (this.selectedExceptionMessage == true && this.selectedGroupBy.indexOf("excmessage") != -1)) {
        this.exceptionPopup = true;
        return;
      }
      else {

        if (this.commonServices.previousReport == this.commonServices.currentReport) {
          console.log("same report case in exception")
          this.assignExceptionFilters();
          this.commonServices.sideBarUI$.next(this.queryData);
        }
        else {
          console.log("changed report case routing from exception");
          this.assignExceptionDefaultFilters();
          this.commonServices.previousReport = 'Exception'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
          this.commonServices.isFilterFromSideBar = true;
          // this._router.navigate(['/home/ddr/exception']);
          if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
            this._router.navigate(['/home/ddrCopyLink/exception']);
          else
            this._router.navigate(['/ddr/exception']);
        }
      }
    }
    if (this.commonServices.currentReport == 'FlowpathGroupBy') {

      if (this.commonServices.previousReport == this.commonServices.currentReport) {
        console.log("same report case in flowpathgroupby")
        this.assignFlowpathGroupByFilters();
        this.commonServices.sideBarUI$.next(this.queryData);
      }
      else {
        console.log("changed report case routing from flowpathgroupby");
        this.assignFlowpathGroupByDefaultFilters();
        this.commonServices.previousReport = 'FlowpathGroupBy'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
        this.commonServices.isFilterFromSideBar = true;

        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
          this._router.navigate(['/home/ddrCopyLink/Flowpathgroupby']);
        else
          this._router.navigate(['/ddr/Flowpathgroupby']);
      }
    }
    if (this.commonServices.currentReport == 'DBGroupBy') {

      if (this.commonServices.previousReport == this.commonServices.currentReport) {
        console.log("same report case in dbgroupby")
        this.assignDBGroupByFilters();
        this.commonServices.sideBarUI$.next(this.queryData);
      }
      else {
        console.log("changed report case routing from dbgroupby");
        this.assignDBGroupByDefaultFilters();
        this.commonServices.previousReport = 'DBGroupBy'; // doing this so that now when user comes to flowpath report and then applying others filter without changing the report type
        this.commonServices.isFilterFromSideBar = true;
        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
          this._router.navigate(['/home/ddrCopyLink/dbGroupBy']);
        else
          this._router.navigate(['/ddr/dbGroupBy']);
      }
    }
    this.commonServices.closeUISideBar$.next();
    if (this.commonServices.currentReport == "Transaction Summary" || this.commonServices.currentReport == "URL Summary"
      || this.commonServices.currentReport == "Session Summary" || this.commonServices.currentReport == "Page Summary"
      || this.commonServices.currentReport == "Flowpath" || this.commonServices.currentReport == "FlowpathGroupBy"
      || this.commonServices.currentReport == 'DB Report' || this.commonServices.currentReport == 'DBGroupBy'
      || this.commonServices.currentReport == 'Exception' || this.commonServices.currentReport == 'Method Timing'
      || this.commonServices.currentReport == 'Hotspot' || this.commonServices.currentReport == 'IP Summary') {
      this.showSaveQuery = true;
    }
  }

  // reportTypeChange() {
  //   this.checkGroup = false;
  //   this.selectedGroupBy = [];
  //   this.checkOrder = false;
  //   this.selectedOrderBy = [];
  // }

  changeReport() {
    this.selectAnyCheckBoxFlag = false;
    console.log("check8888888888", this.sideheight);
    if (this.commonServices.currentReport == "Hotspot" || this.commonServices.currentReport == "IP Summary" || this.commonServices.currentReport == "DBGroupBy" || this.commonServices.currentReport == "Method Timing" || this.commonServices.currentReport == "FlowpathGroupBy") {
      this.sideheight = "556px";
    }
    else {
      this.sideheight = "auto";
    }

    // this.newReport = this.commonServices.currentReport
    this.selectedGroupBy = [];
    // if(this.testRunMode)
    // { console.log("this.commonServices.currentReport ",this.commonServices.currentReport,"  this.commonServices.previousReport",this.commonServices.previousReport)
    //   if(this.commonServices.currentReport!=this.commonServices.previousReport)
    //   {
    //     this.checkNSFilter();
    //   }
    // }                        this has been commented out for future when we will support report changes.
    this.getGroupBy();


  }
  checkInfo() {
    console.log("url value--", this.selectedUrl);
  }
  getGroupBy() {
    this.selectGroupByCheckBoxFlag = false;
    this.groupBy = [];

    if (this.showNSFilter) {

      if (this.commonServices.currentReport == 'Transaction Summary' || this.commonServices.currentReport == 'Transaction Instance') {
        this.groupBy.push({ label: 'Session', value: 'session' });
        this.groupBy.push({ label: 'Status', value: 'status' });
        this.groupBy.push({ label: 'Generator', value: 'generator' });
      }
      if (this.commonServices.currentReport == 'Session Summary' || this.commonServices.currentReport == 'Session Instance') {
        this.groupBy.push({ label: 'Status', value: 'status' });
        this.groupBy.push({ label: 'Generator', value: 'generator' });
      }
      if (this.commonServices.currentReport == 'Page Summary' || this.commonServices.currentReport == 'Page Instance') {
        this.groupBy.push({ label: 'Transaction', value: 'transaction' });
        this.groupBy.push({ label: 'Session', value: 'session' });
        this.groupBy.push({ label: 'Status', value: 'status' });
        this.groupBy.push({ label: 'Generator', value: 'generator' });
      }
      if (this.commonServices.currentReport == 'URL Summary' || this.commonServices.currentReport == 'URL Instance') {
        this.groupBy.push({ label: 'Transaction', value: 'transaction' });
        this.groupBy.push({ label: 'Session', value: 'session' });
        this.groupBy.push({ label: 'Page', value: 'page' });
        this.groupBy.push({ label: 'Status', value: 'status' });
        this.groupBy.push({ label: 'Generator', value: 'generator' });
      }

    }
    else {
      this.groupBy.push({ label: 'BT', value: 'url' });
      //this.groupBy.push({ label: 'FlowPath Signature', value: 'flowpathsignature' });
      this.groupBy.push({ label: 'Tier', value: 'tier' });
      this.groupBy.push({ label: 'Server', value: 'server' });
      this.groupBy.push({ label: 'Instance', value: 'app' });

      if (this.commonServices.currentReport != "Exception")
        this.groupBy.push({ label: 'BT Category', value: 'btcategory' });

      //this.groupBy.push({ label: 'Generator', value: 'generator' });

      /*   if (this.commonServices.currentReport == "DB Request") {
        this.groupBy.push({ label: 'Query Type', value: 'Query Type' });
      } */
      if (this.commonServices.currentReport == "Exception") {
        this.groupBy.push({ label: 'Exception Class', value: 'excclass' });
        this.groupBy.push({ label: 'Exception Throwing Class', value: 'excthrowingclass' });
        this.groupBy.push({ label: 'Exception Throwing Method', value: 'excthrowingmethod' });
        this.groupBy.push({ label: 'Exception Message', value: 'excmessage' });
        this.groupBy.push({ label: 'Exception Cause', value: 'exccause' });
      }
    }
    if (this.checkGroup == false) {
      this.selectedGroupBy = [];
      this.selectedOrderBy = []; // because when we disable groupby , the orderby options should not contains the groupby options
      this.checkOrder = false;
      this.selectOrderByCheckBoxFlag = false;
    }
  }

  getOrderBy() {
    this.selectOrderByCheckBoxFlag = false;
    this.orderBy = [];
    this.selectedOrderBy = [];
    this.checkOrder == false;
    console.log("this.selectedGroupBy list ---", this.selectedGroupBy);

    if (this.commonServices.currentReport == "Flowpath") {
      this.orderBy.push({ label: 'Average FP Duration ASC', value: 'avgfpduration' });
      this.orderBy.push({ label: 'Average FP Duration DESC', value: 'avgfpduration_desc' });
    }
    /* else if (this.commonServices.currentReport == "Exception") {
       this.orderBy.push({ label: 'Exception Class', value: 'excclass' });
       this.orderBy.push({ label: 'Exception Throwing Class', value: 'excthrowingclass' });
       this.orderBy.push({ label: 'Exception Throwing Method', value: 'excthrowingmethod' });
       this.orderBy.push({ label: 'Exception Message', value: 'excmessage' });
       this.orderBy.push({ label: 'Exception Cause', value: 'exccause' });
     }
     else {
       //this.orderBy.push({ label: 'Start Time', value: 'Exception Class' });
      // this.orderBy.push({ label: 'Execution Time Desc', value: 'avgfpduration' });
      // this.orderBy.push({ label: 'Execution Time ASC', value: 'avgfpduration_desc' });
     }*/
    console.log("selected group by===>", this.selectedGroupBy);
    if (this.selectedGroupBy.length != 0) {
      this.checkOrder == true;
      for (let i = 0; i < this.selectedGroupBy.length; i++) {
        if (this.selectedGroupBy[i] == 'url' && this.commonServices.currentReport != 'URL Summary' && this.commonServices.currentReport != 'URL Instance')
          this.orderBy.push({ label: 'BT', value: 'url' });
        else if (this.selectedGroupBy[i] == 'page' && this.commonServices.currentReport != 'Page Summary' && this.commonServices.currentReport != 'Page Instance')
          this.orderBy.push({ label: 'Page', value: 'page' });
        else if (this.selectedGroupBy[i] == 'transaction' && this.commonServices.currentReport != 'Transaction Summary' && this.commonServices.currentReport != 'Transaction Instance')
          this.orderBy.push({ label: 'Transaction', value: 'transaction' });
        else if (this.selectedGroupBy[i] == 'session' && this.commonServices.currentReport != 'Session Summary' && this.commonServices.currentReport != 'Session Instance')
          this.orderBy.push({ label: 'Session', value: 'session' });
        else if (this.selectedGroupBy[i] == 'tier')
          this.orderBy.push({ label: 'Tier', value: 'tier' });
        else if (this.selectedGroupBy[i] == 'server')
          this.orderBy.push({ label: 'Server', value: 'server' });
        else if (this.selectedGroupBy[i] == 'app')
          this.orderBy.push({ label: 'Instance', value: 'app' });
        else if (this.selectedGroupBy[i] == 'btcategory')
          this.orderBy.push({ label: 'BT Category', value: 'btcategory' });
        else if (this.selectedGroupBy[i] == 'excclass')
          this.orderBy.push({ label: 'Exception Class', value: 'excclass' });
        else if (this.selectedGroupBy[i] == 'excthrowingclass')
          this.orderBy.push({ label: 'Exception Throwing Class', value: 'excthrowingclass' });
        else if (this.selectedGroupBy[i] == 'excthrowingmethod')
          this.orderBy.push({ label: 'Exception Throwing Method', value: 'excthrowingmethod' });
        else if (this.selectedGroupBy[i] == 'excmessage')
          this.orderBy.push({ label: 'Exception Message', value: 'excmessage' });
        else if (this.selectedGroupBy[i] == 'exccause')
          this.orderBy.push({ label: 'Exception Cause', value: 'exccause' });
        else if (this.selectedGroupBy[i] == 'generator')
          this.orderBy.push({ label: 'Generator', value: 'generator' });
        else if (this.selectedGroupBy[i] == 'status')
          this.orderBy.push({ label: 'Status', value: 'status' });
      }
    }
    if (this.commonServices.currentReport == 'Transaction Summary' || this.commonServices.currentReport == 'Transaction Instance') {
      this.orderBy.push({ label: 'Transaction', value: 'transaction' });
    }
    else if (this.commonServices.currentReport == 'Session Summary' || this.commonServices.currentReport == 'Session Instance') {
      this.orderBy.push({ label: 'Session', value: 'session' });
    }
    else if (this.commonServices.currentReport == 'Page Summary' || this.commonServices.currentReport == 'Page Instance') {
      this.orderBy.push({ label: 'Page', value: 'page' });
    }
    else if (this.commonServices.currentReport == 'URL Summary' || this.commonServices.currentReport == 'URL Instance') {
      this.orderBy.push({ label: 'Url', value: 'url' });
    }

    if (this.checkOrder == false) {
      this.selectedOrderBy == [];
    }
  }

  getgroupByFC() {
    this.groupByFC = [];

    for (let i = 0; i < this.selectedGroupBy.length; i++) {
      if (this.selectedGroupBy[i] == 'url')
        this.groupByFC.push('BT');
      else if (this.selectedGroupBy[i] == 'page')
        this.groupByFC.push('Page');
      else if (this.selectedGroupBy[i] == 'transaction')
        this.groupByFC.push('Transaction');
      else if (this.selectedGroupBy[i] == 'session')
        this.groupByFC.push('Session');
      else if (this.selectedGroupBy[i] == 'tier')
        this.groupByFC.push('Tier');
      else if (this.selectedGroupBy[i] == 'server')
        this.groupByFC.push('Server');
      else if (this.selectedGroupBy[i] == 'app')
        this.groupByFC.push('Instance');
      else if (this.selectedGroupBy[i] == 'btcategory')
        this.groupByFC.push('BT Category');
      else if (this.selectedGroupBy[i] == 'excclass')
        this.groupByFC.push('Exception Class');
      else if (this.selectedGroupBy[i] == 'excthrowingclass')
        this.groupByFC.push('Exception Throwing Class');
      else if (this.selectedGroupBy[i] == 'excthrowingmethod')
        this.groupByFC.push('Exception Throwing Method');
      else if (this.selectedGroupBy[i] == 'excmessage')
        this.groupByFC.push('Exception Message');
      else if (this.selectedGroupBy[i] == 'exccause')
        this.groupByFC.push('Exception Cause');
    }
    console.log("groupByFC--", this.groupByFC);
  }
  getOrderByFC() {
    this.orderByFC = [];
    for (let i = 0; i < this.selectedOrderBy.length; i++) {
      if (this.selectedOrderBy[i] == 'url')
        this.orderByFC.push('BT');
      else if (this.selectedOrderBy[i] == 'page')
        this.orderByFC.push('Page');
      else if (this.selectedOrderBy[i] == 'transaction')
        this.orderByFC.push('Transaction');
      else if (this.selectedOrderBy[i] == 'session')
        this.orderByFC.push('Session');
      else if (this.selectedOrderBy[i] == 'tier')
        this.orderByFC.push('Tier');
      else if (this.selectedOrderBy[i] == 'server')
        this.orderByFC.push('Server');
      else if (this.selectedOrderBy[i] == 'app')
        this.orderByFC.push('Instance');
      else if (this.selectedOrderBy[i] == 'btcategory')
        this.orderByFC.push('BT Category');
      else if (this.selectedOrderBy[i] == 'excclass')
        this.orderByFC.push('Exception Class');
      else if (this.selectedOrderBy[i] == 'excthrowingclass')
        this.orderByFC.push('Exception Throwing Class');
      else if (this.selectedOrderBy[i] == 'excthrowingmethod')
        this.orderByFC.push('Exception Throwing Method');
      else if (this.selectedOrderBy[i] == 'excmessage')
        this.orderByFC.push('Exception Message');
      else if (this.selectedOrderBy[i] == 'exccause')
        this.orderByFC.push('Exception Cause');

    }

  }

  fpInstanceInfo() {
    this.selectfpInstanceFlag = false;
    if (this.selectedFP == false) {
      this.commonServices.flowpathInstance = "";
      this.fpInstance = "";
    }
    //else
    // this.fpInstance = this.commonServices.flowpathInstance; 
  }
  ipInfo() {
    this.selectIntegrationPointFlag = false;
    if (this.selectedIP == false) {
      this.selectedIntegrationPoint = [];
    } else {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product.replace("/", "")
          + '/v1/cavisson/netdiagnostics/ddr/metadata/integrationPoint?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/metadata/integrationPoint?testRun=' + this.urlParam.testRun;
      } this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.ipData(data)));
    }
  }

  ipData(res: any) {

    this.IntegrationPoint = [];
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {

      this.IntegrationPoint.push({ label: res[keys[i]].replace(/&#46;/g, "."), value: { id: keys[i], name: res[keys[i]] } });
      console.log("InegrationPoint data", res[keys[i]]);

      //this.exceptionClassOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }
  }
  btInfo() {
    this.selectBTFlag = false;
    this.selectedUrl = "";
    this.urlOptions = [];

    if (this.checkedBuisnessTransaction == true) {
      if (this.isMultiDC && this.dcList.length != 0) {
        this.btInfoCount();
      }
      if (this.btCount == undefined || this.btCount == '') {
        this.btInfoCount();
      }
      let url = '';

      this.productKey = sessionStorage.getItem('productKey');
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product.replace("/", "")
          + '/v1/cavisson/netdiagnostics/ddr/metadata/businessTransaction?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/metadata/businessTransaction?testRun=' + this.urlParam.testRun;
      }


      url = url + '&limit=' + this.btLimit + '&offset=' + this.btOffset;


      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.btData(data)));
    }
    else {
      this.selectedBuisnessTransaction = "";
      this.nxt = false;
      this.prev = false;
      this.btCount = '';
      this.btLimit = 1000;
      this.btOffset = 0;
    }
  }

  btInfoCount() {

    let url = '';

    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product.replace("/", "")
        + '/v1/cavisson/netdiagnostics/ddr/metadata/businessTransactionCount?testRun=' + this.selectedDC.ndeTestRun;
    }
    else {
      url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", ""))
        + '/v1/cavisson/netdiagnostics/ddr/metadata/businessTransactionCount?testRun=' + this.urlParam.testRun;

    }

    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      this.btCount = JSON.parse(data)[1];
      if (this.btCount > 1000) {
        this.nxt = true;
        this.btEndValue = 1000;
      }
      else
        this.btEndValue = this.btCount;
    });
  }

  btData(res: any) {

    this.BTOptions = [];
    // console.log('BTOptions  res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {

      if (this.message.urlName != undefined && this.message.urlName == keys[i])
        this.message.urlIndex = res[keys[i]];
      this.BTOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
      //console.log("bt url", keys[i]);
    }
    //this.selectedBuisnessTransaction =  { id: this.message.urlIndex, name: this.message.urlName };

  }

  nvFilters(type) {
    this.ndSessionIdFlag = false;
    this.nvPageIdFlag = false;
    this.nvSessionIdFlag = false;
    if (type == 'ndSessionID') {
      if (this.isCheckedSessionId == false) {
        this.ndSessionId = "";
      }
    }

    if (type == 'nvPageID') {
      if (this.isCheckedPageId == false) {
        this.nvPageId = "";
      }
    }
    if (type == 'nvSessionID') {
      if (this.isCheckedNVSessionID == false) {
        this.nvSessionId = "";
      }
    }
  }

  setDefaultTierServerAppFilter() {
    this.tierName = [];
    this.tierId = [];
    this.tierNameFC = 'NA';
    this.setDefaultServerAppFilter();
  }

  setDefaultServerAppFilter() {
    this.selectServerFlag = false;
    this.selectAppFlag = false;
    if (this.tierName.length > 20) {
      alert("Selected Tiers must be less than or equal to 20");
      this.tierName.length = this.tierName.length - 1;
      return;
    }

    this.serverList = [];

    this.serverName = [];
    this.serverId = [];
    this.selectedServer = false;
    this.serverNameFC = 'NA';

    this.appList = [];

    this.appName = [];
    this.appId = [];
    this.selectedApp = false; //uncheck   app checkbox
    this.appNameFC = "NA";
    this.tierId = [];
    this.selectedAppVal = undefined;
    this.selectedServerVal = undefined;

  }

  setDefaultAppFilter() {
    this.selectAppFlag = false;
    if (this.serverName.length > 20) {
      alert("Selected Servers must be less than or equal to 20");
      this.serverName.length = this.serverName.length - 1;
      return;
    }

    this.appList = [];
    this.appName = [];
    this.appId = [];
    this.selectedApp = false; //uncheck   app checkbox
    this.appNameFC = "NA";
    this.selectedAppVal = undefined;
    //  this.selectedServerVal = undefined;

  }

  appFilter() {
    if (this.appName.length > 20) {
      alert("Selected Instances must be less than or equal to 20");
      this.appName.length = this.appName.length - 1;
      return;
    }
  }

  tierInfo() {
    this.selectTierFlag = false;
    //pending case - remove TSA filters on uncheck

    if (this.selectedTier === false)  //uncheck case
    {
      this.setDefaultTierServerAppFilter();
    }
    else  //check case
    {
      if (this.tierMetaData == undefined)  //query for the first time
      {
        //let url = '//' + decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/metadata/tier?testRun=' + this.urlParam.testRun
        let url = "";
        if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
          console.log("this.isMultiDcEnable--", this.isMultiDcEnable);
          console.log("this.dcList--", this.dcList);
          url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product.replace("/", "")
            + '/v1/cavisson/netdiagnostics/ddr/metadata/tier?testRun=' + this.selectedDC.ndeTestRun;
          console.log("isMultiDcEnable--url--", url);
        }
        else {
          url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", ""))
            + '/v1/cavisson/netdiagnostics/ddr/metadata/tier?testRun=' + this.urlParam.testRun;
          console.log("not multidc--url--", url);
        }
        this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.tierData(data)));
      }
      else
        this.tierData(this.tierMetaData);
    }
  }

  //This function is called every time Server checkbox is clicked ( either checked or unchecked)
  serverInfo() {
    this.selectServerFlag = false;
    if (this.selectedServer === false) {
      //this.serverName = ['Overall'];
      /*this.serverName = [];
      this.serverId = [];
      this.serverNameFC = 'NA';*/
      this.setDefaultServerAppFilter();
      this.selectServerFlag = false;
    }
    else {
      if (this.serverMetaData == undefined) {
        let url = '';
        if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
          url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product.replace("/", "")
            + '/v1/cavisson/netdiagnostics/ddr/metadata/server?testRun=' + this.selectedDC.ndeTestRun;
        }
        else {
          url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/metadata/server?testRun=' + this.urlParam.testRun;
        }
        this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.serverData(data)));
      }
      else
        this.serverData(this.serverMetaData);

    }
  }

  //This function is called every time Instance checkbox is clicked ( either checked or unchecked)
  appInfo() {
    this.selectAppFlag = false;
    if (this.selectedApp === false)  //uncheck   app checkbox
    {
      this.appName = [];
      this.appId = [];
      // this.appName= ['Overall'];
      this.appNameFC = "NA";
    }
    else {
      if (this.appMetaData == undefined) {
        let url = '';
        if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
          url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product.replace("/", "")
            + '/v1/cavisson/netdiagnostics/ddr/metadata/app?testRun=' + this.selectedDC.ndeTestRun;
        }
        else {
          url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/metadata/app?testRun=' + this.urlParam.testRun;
        }
        this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.appData(data)));
      }
      else
        this.appData(this.appMetaData);
    }
  }

  tierData(res: any) {
    console.log("method - tierData and tierMataData =", res)
    this.tierMetaData = res;
    this.tierList = [];
    let keys = Object.keys(res);

    //this.tierList.push({ label: 'Overall', value: 'Overall' });
    for (let i = 0; i < keys.length; i++) {
      let id = res[keys[i]];    //tierId
      let tName = keys[i];     //tierName
      this.tierList.push({ label: tName, value: tName });
    }

    /*  let tierArr = [];
      tierArr.push(this.message.tierName);
        this.tierName = tierArr;
        console.log("TierName after push---",this.tierName);*/
    console.log('method - tierData and tierlist ===', this.tierList);
  }

  serverData(res: any) {
    console.log("method - serverData and serverMataData =", res)
    this.serverMetaData = res;
    this.serverList = [];
    let keys = Object.keys(res);

    //this.serverList.push({ label: 'Overall', value: 'Overall' });
    for (let i = 0; i < keys.length; i++) {
      let id = res[keys[i]];   // serverId
      let tsName = keys[i];    //  tierName:serverName i.e - Tier29:AppServer29
      let tierServerName = tsName.split(":");  //index  0- tierName, 1- serverName

      //this.serverIdNameObj[id] =tierServerName[1];
      if (this.tierName.indexOf(tierServerName[0]) > -1)    //serverNames of only selected tiers 
      {
        this.serverList.push({ label: tsName, value: tsName });
      }
      else if (this.tierName.length == 0)  //when no tier is selected , show all servers 
      {
        this.serverList.push({ label: tsName, value: tsName });
      }
    }

    /*if(this.tierName.length ==  1){
      if(this.tierName[0] ==  this.message.tierName)
      var serverArr = [];
      serverArr.push(this.message.tierName+":"+this.message.serverName);
        this.serverName =serverArr;
    }
    console.log("After push server:-->",this.serverName);*/
    console.log('method - serverData and serverlist====', this.serverList);
  }

  appData(res: any) {
    console.log(" method - appData and appMataData =  =", res);
    this.appMetaData = res;
    this.appList = [];
    let keys = Object.keys(res);
    //this.appList.push({ label: 'Overall', value: 'Overall' });
    for (let i = 0; i < keys.length; i++) {
      let tsaName = keys[i];  //tierName:serverName:appName
      let tsaNameArr = tsaName.split(':');
      let tsName = tsaNameArr[0] + ":" + tsaNameArr[1];
      let tName = tsaNameArr[0];

      if (this.serverName.indexOf(tsName) > -1)  //show instances of only selected servres
      {
        this.appList.push({ label: tsaName, value: tsaName });
      }
      else if (this.serverName.length == 0 && this.tierName.indexOf(tName) > -1) //when no server is selected then show instances of selected Tier
      {
        this.appList.push({ label: tsaName, value: tsaName });
      }
      else if (this.serverName.length == 0 && this.tierName.length == 0)  //if no tier, no server is selected, show all instances 
      {
        this.appList.push({ label: tsaName, value: tsaName });
      }
    }
    /*if(this.tierName.length ==  1)
    {
      if(this.tierName[0] ==  this.message.tierName)
      var appArr  = [];
      appArr.push(this.message.tierName+":"+this.message.serverName+":"+this.message.appName);
        this.appName = appArr;
    }*/
    console.log(' method - appData and applist ===', this.appList);
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  onlyNumberKeyAndComma(event) {
    if (this.fpInstance.slice(-1) == "," && event.charCode == 44) {
      return false;
    }
    else {
      return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 44;
    }
  }
  responseCheck() {
    this.selectResponseCheckBoxFlag = false;
    this.selectResponseCheckBoxFlag1 = false;
    if (this.checkedResponseTime == false) {
      this.showingEqualResponseBox = false;
      this.resSelectedCompareOption = "1";
      this.responseTime = "";
      this.resVariance = "";
      this.responseTimeMessage = false;

    }

  }

  responseEqualCase() {
    this.selectResponseCheckBoxFlag = false;
    this.selectResponseCheckBoxFlag1 = false;
    this.responseTimeMessage = false;
    console.log("initial value is", this.resSelectedCompareOption);
    if (this.resSelectedCompareOption == "3")
      this.showingEqualResponseBox = true;
    else {
      this.showingEqualResponseBox = false;
      this.resVariance = "";
    }
  }

  methodCheck() {
    this.selectedminMethodsFlag = false;
    if (this.checkedMethodCount == false)
      this.minMethods = "";

  }

  DLCheck() {
    console.log("i am in DL change");
  }
  ReqRespCheck() {
    console.log("i am in Request responce change");
  }

  corelationcheck() {
    this.selectedCorrIdModeFlag = false;
    this.selectedCorrIdModeFlag1 = false;
    this.selectedCorrIdModeFlag2 = false;
    if (this.checkedCorrId == false)
      this.selectedCorrIdMode = "";
    this.corrId = "";
  }

  btcheck() {
    this.selectBTCategoryFlag = false;
    if (this.selectedBT == false)
      this.selectedBTCategory = "";

  }

  checkTopNQuery() {
    this.selectCheckNQuerryFlag = false;
    if (this.checkNQueryforPie == false)
      this.selectedTopNQuery = '';
  }

  checkTopNEntity() {
    this.selectedTopNEntityFlag = false;
    if (this.checkNEntityforPie == false)
      this.selectedTopNEntity = '';
  }

  urlRadioButton() {
    this.selectFailureTypeFlag = false;
    console.log("inside urlbutton function");
    this.failure = false;
    this.selectedFailureId = [];
    this.selectedFailureName = "";
    this.selectedFailureNameId = "";
    if (this.selectedUrlStatus == -1) {
      this.selectedFailureNameId = "-1";
      this.selectedFailureName = 'Failures';
    }

    else if (this.selectedUrlStatus == 0) {
      this.selectedFailureNameId = "0";
      this.selectedFailureName = 'Success';
    }

    else {
      this.selectedFailureName = 'All';
      this.selectedFailureNameId = "-2";
    }

    console.log("select radio button id is ", this.selectedUrlStatus);
  }

  failureType() {
    this.selectFailureTypeFlag = false;
    this.failure = true;
    this.selectedFailureNameId = "";
    console.log("se radio button id is ", this.selectedUrlStatus);
    let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/metadata/errorcodes';
    this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.failureTypeData(data)));
  }

  failureTypeData(res: any) {
    this.failureTypes = [];
    console.log('failure type res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);

    for (let i = 0; i < keys.length; i++) {
      let errorCodeId = keys[i];
      let errorCodeName = res[keys[i]];
      if (errorCodeName != '1xx' && errorCodeName != '2xx' && errorCodeName != '3xx') {
        this.failureTypes.push({ label: errorCodeName, value: errorCodeId });
        this.failureIdNameObj[errorCodeId] = errorCodeName;
      }
    }
  }

  fpOrderCheck() {
    this.selectedFpOrderByFlag = false;
    if (this.fpOrderByCheck == false)
      this.selectedFpOrderBy = [];
  }

  dbOrderBy() {
    this.selectDBOrderByCheckFlag = false;
    if (this.dbOrderByCheck == false)
      this.selectedDbOrderBy = [];
  }
  //***************************------------exception -----------------******************************
  exceptionClassInfo() {
    this.selectExceptionClassFlag = false;
    if (this.selectedExceptionClass === true) {

      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionclassname?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionclassname?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.exceptionClassData(data)));
    }
    else
      this.selectedException = null;
  }

  exceptionClassData(res: any) {
    this.exceptionClassOptions = [];
    console.log('exception res====', res, '======res.length===', Object.keys(res).length);

    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      this.exceptionClassOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }

  }
  exceptionThrowingClassInfo() {
    this.selectedExceptionThrowingClassFlag = false;
    if (this.selectedThrowingClass === true) {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionthrowingclassname?testRun=' + this.selectedDC.ndeTestRun;
      }

      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionthrowingclassname?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.exceptionThrowingClassData(data)));
    }

    else
      this.selectedExceptionThrowingClass = null;
  }
  exceptionThrowingClassData(res: any) {
    this.throwingClassOptions = [];
    console.log('exception throwing res====', res, '======res.length===', Object.keys(res).length);

    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      this.throwingClassOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }


  }

  exceptionThrowingMethodInfo() {
    this.selectedExceptionThrowingMethodFlag = false;
    if (this.selectedThrowingMethod === true) {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionthrowingmethodname?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionthrowingmethodname?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.exceptionThrowingMethodData(data)));
    }
    else
      this.selectedExceptionThrowingMethod = null;
  }
  exceptionThrowingMethodData(res: any) {
    this.throwingMethodOptions = [];
    console.log('exception throwing method res====', res, '======res.length===', Object.keys(res).length);

    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      this.throwingMethodOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }

  }

  exceptionCauseInfo() {
    this.selectedExceptionCauseTypeFlag = false;
    if (this.selectedExceptionCause === true) {

      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptioncause?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptioncause?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.exceptionCauseData(data)));
    }
    else
      this.selectedExceptionCauseType = null;
  }

  exceptionCauseData(res: any) {
    this.exceptionCauseOptions = [];
    console.log('exception cause  res====', res, '======res.length===', Object.keys(res).length);

    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      this.exceptionCauseOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }

  }
  exceptionMessageInfo() {
    this.selectedExceptionMessageTypeFlag = false;
    if (this.selectedExceptionMessage === true) {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionmsg?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/exceptionmsg?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.exceptionMessageData(data)));
    }
    else
      this.selectedExceptionMessageType = null;
  }

  exceptionMessageData(res: any) {
    this.exceptionMessageOptions = [];
    console.log('exception cause  res====', res, '======res.length===', Object.keys(res).length);

    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      this.exceptionMessageOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }

  }
  stackTraceInfo() {
    this.selectedStackFlag = false;
    if (this.selectedStackTrace == false) {
      this.selectedStack = "";
    }
  }
  // ********************************NS Filters ***********************************

  getUrlInfo(page?, script?) {
    this.selectedBuisnessTransaction = "";
    this.BTOptions = [];
    if (this.checkedUrl === true) {
      let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/metadata/url?testRun=' + this.urlParam.testRun;
      let modUrl = "";
      if (page) {
        console.log("in case of url where page is selcted **** ", page);
        modUrl += '&page=' + page.name;
      }
      if (script) {
        console.log("in case of url where script was selcted **** ", script);
        modUrl += '&script=' + script.name;
      }
      if (!this.urlFilterCount)        //initially its 0     
        //this.getScriptFilterCount(url,"url"); 
        // this.urlFilterCount = this.getScriptFilterCount(url);
        // if(this.urlFilterCount >=10)
        // {

        // }
        //  url+="&limit="+ this.urlLimit+ "&offset="+this.urlOffset ;     for pagination 
        url += modUrl;
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getUrlData(data)));
    }

    else {
      this.selectedUrl = null;
    }
  }
  getScriptFilterCount(url: string, reportType) {
    url += '&get_count=1';
    let count;

    // this.ddrRequest.getDataUsingGet(url).pipe(map(data => (count=data)).subscribe(()=>{  // did hold it here but still query processing?? time wtf
    //   count=count.Rows;
    //   console.log("count value here ****** ",count);
    //   if(reportType=="url")
    //   {
    //     this.urlFilterCount=count;
    //     this.urlLimit=8;
    //     this.urlOffset=0;
    //     this.getLimtOffsetUpdate(this.urlLimit,this.urlOffset,this.urlFilterCount,reportType);
    //   }
    //     if(reportType=="transaction")
    //     {
    //       this.transFilterCount=count;
    //       this.transLimit=8;
    //       this.transOffset=0;
    //       this.getLimtOffsetUpdate(this.transLimit,this.transOffset,this.transFilterCount,reportType);
    //     }
    // }));

    //return count;
  }
  getLimtOffsetUpdate(limit, offset, count, reportType) {
    let difference;
    if (limit >= offset) {
      console.log(" Limit Offset cond 1 ** ", limit, " ", offset)
      difference = limit - offset;
    }
    else {
      console.log(" limit offset cond 2 ** ", limit, " ", offset)
      difference = offset - limit;
    }

    if (count > difference) {
      if (reportType == "url") {
        this.showUrlPagination = true;
        if (this.urlFilterCount > this.urlLimit) {
          this.nxtUrl = true;
          this.prevUrl = true;
          this.urlEndValue = this.urlLimit;
        }
        else
          this.urlEndValue = this.btCount;
      }
      if (reportType == "transaction")
        this.showTransactionPagination = true;
      if (reportType == "page")
        this.showPagePagination = true;
    }
    else                          //get this condition checked.
    {
      if (reportType == "url")
        this.showUrlPagination = false;
      if (reportType == "transaction")
        this.showTransactionPagination = false;
      if (reportType == "page")
        this.showPagePagination = false;

    }

  }

  nextFilterData(reportType) {
    if (reportType == "url") {
      console.log("offset before **** ", this.urlOffset);

      this.urlOffset += this.urlLimit;
      if ((this.urlLimit + this.urlOffset) >= this.urlFilterCount) {
        this.nxtUrl = false;
        this.prevUrl = true;
        this.urlEndValue = this.urlFilterCount;
      } else {
        this.nxtUrl = true;
        this.prevUrl = true;
        this.urlEndValue = this.urlLimit + this.urlOffset;
      }
      console.log("offset after **** ", this.urlOffset);
      this.validateUrlCheck();
    }
    if (reportType == "page") {
      console.log("offset before **** ", this.pageOffset);
      this.pageOffset += this.pageLimit;
      console.log("offset after **** ", this.pageOffset);
      this.validatePageCheck();
    }
    if (reportType == "transaction") {
      console.log("offset before **** ", this.transOffset);
      this.transOffset += this.transLimit;
      console.log("offset after **** ", this.transOffset);
      this.validateTransactionCheck();
    }

  }
  previousFilter(reportType) {

    if (reportType == "url") {
      this.urlOffset -= this.urlLimit;
      if (this.urlOffset <= 0) {
        this.prevUrl = false;
        this.nxtUrl = true;
        this.urlEndValue = this.urlLimit;
      } else {
        this.prevUrl = true;
        this.nxtUrl = true;
        this.urlEndValue = this.urlLimit + this.urlOffset;
      }


    }
  }

  getUrlData(res: any) {
    this.urlOptions = [];
    console.log('url  res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let val = keys[i];
      // console.log("value is ", res[keys[i]]);
      // console.log("id is", val)
      // if (val.length > 40)
      //   val = val.substring(0, 40) + "..";
      this.urlOptions.push({ label: res[keys[i]], value: { id: keys[i], name: res[keys[i]] } });
      //  console.log("substring value is ", val);
    }
  }


  getPageInfo() {
    if (this.checkedPage === true) {

      let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/metadata/page?testRun=' + this.urlParam.testRun;
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getPageData(data)));
    }
    else {
      this.selectedPage = null;
    }
  }


  getPageData(res: any) {
    this.pageOptions = [];
    console.log('page res====', res, '======res.length===', Object.keys(res).length);

    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let sessionPage = res[keys[i]];
      let data = {};
      data[sessionPage.split(":")[0]] = sessionPage.substr(sessionPage.indexOf(":") + 1);
      let dataKey = Object.keys(data);
      console.log("data ****", data);
      console.log("res[keys[i]] ", res[keys[i]]);

      if (this.checkedScript == true && this.selectedScript) {

        let script = dataKey[0];

        if (this.selectedScript.name == script)          // this will show only those page snames with script whose script matches with the selected script.
        {
          console.log("script value in page ", script);
          this.pageOptions.push({ label: res[keys[i]], value: { id: keys[i], name: data[dataKey[0]] } });
        }
      }
      else {
        this.pageOptions.push({ label: res[keys[i]], value: { id: keys[i], name: data[dataKey[0]] } });
        // page name will be directly page name 
      }
    }
  }
  getScriptInfo() {
    console.log("this.checkedScript=====>", this.checkedScript);
    if (this.checkedScript === true) {
      let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/metadata/script?testRun=' + this.urlParam.testRun;
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getScriptData(data)));
    }

    else
      this.selectedScript = null;
  }


  getScriptData(res: any) {
    this.scriptOptions = [];
    console.log('script res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++)
      this.scriptOptions.push({ label: res[keys[i]], value: { id: keys[i], name: res[keys[i]] } });
  }
  getTransactionInfo() {
    if (this.checkedTransaction === true) {
      let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/metadata/transaction?testRun=' + this.urlParam.testRun;
      //    this.getScriptFilterCount(url,"transaction");  for count  
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getTransactionData(data)));
    }

    else
      this.selectedTransaction = null;
  }

  getTransactionData(res: any) {
    this.transactionOptions = [];
    console.log('transaction res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++)
      this.transactionOptions.push({ label: res[keys[i]], value: { id: keys[i], name: res[keys[i]] } });
  }

  //***************************---------Other NS Filters ------------********************
  getLocationInfo() {
    if (this.checkedLocation === true) {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/location?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/location?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getLocationData(data)));
    }
    else
      this.selectedLocation = null;

  }

  getLocationData(res: any) {
    this.locationOptions = [];
    console.log('location res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++)
      this.locationOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
  }
  getBrowserInfo() {
    if (this.checkedBrowser === true) {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/browser?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/browser?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getBrowserData(data)));
    }
    else
      this.selectedBrowser = null;
  }

  getBrowserData(res: any) {
    this.browserOptions = [];
    console.log('browser res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++)
      this.browserOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
  }
  getAccessInfo() {
    if (this.checkedAccess === true) {
      let url = '';
      if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
        url = this.selectedDC.ndeProtocol + "://" + this.selectedDC.pubicIP + ":" + this.selectedDC.publicPort + "/" + this.urlParam.product
          + '/v1/cavisson/netdiagnostics/ddr/metadata/access?testRun=' + this.selectedDC.ndeTestRun;
      }
      else {
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product)
          + '/v1/cavisson/netdiagnostics/ddr/metadata/access?testRun=' + this.urlParam.testRun;
      }
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getAccessData(data)));
    }

    else
      this.selectedAccess = null;
  }

  getAccessData(res: any) {
    this.accessOptions = [];
    console.log('access res====', res, '======res.length===', Object.keys(res).length);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++)
      this.accessOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
  }

  //*********************----------------Time Filter-------------------------****************************

  createDropDownMenu() {
    this.standardTime = [];
    this.phaseTime = [];
    this.standardTime.push({ label: 'Last 10 minutes', value: '10' });
    this.standardTime.push({ label: 'Last 30 minutes', value: '30' });
    this.standardTime.push({ label: 'Last 1 hour', value: '60' });
    this.standardTime.push({ label: 'Last 2 hours', value: '120' });
    this.standardTime.push({ label: 'Last 4 hours', value: '240' });
    this.standardTime.push({ label: 'Last 8 hours', value: '480' });
    this.standardTime.push({ label: 'Last 12 hours', value: '720' });
    this.standardTime.push({ label: 'Last 24 hours', value: '1440' });
    if (this.showNSFilter) {
      this.standardTime.push({ label: 'Total Test Run', value: 'Whole Scenario' });
      this.standardTime.push({ label: 'Specified Phase', value: 'Specified Phase' });

    }
    this.standardTime.push({ label: 'Custom Time', value: 'Custom Time' });
  }

  onStrDate(event) {
    // let d = new Date(Date.parse(event));
    // this.strTime = `${d.getTime()}`;
    // console.log(this.strTime);
    if (event && event['inputType'] == "insertText") {
      if (this.strDate == new Date("1/1/1970 5:30:0"))
        this.showStartTimeError = true;
      else
        this.showStartTimeError = false;
      event = this.strDate;
    }
    else
      this.showStartTimeError = false;
    let date = new Date(event);
    this.startDateObj = date;
    this.strTimeInDateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log("onStrDate(event) ", this.strTime, this.strDate, this.strTimeInDateFormat);
  }

  onEndDate(event) {
    // let d = new Date(Date.parse(event));
    // this.endTime = `${d.getTime()}`;
    // console.log(this.endTime);
    if (event && event['inputType'] == "insertText") {
      if (this.endDate == new Date("1/1/1970 5:30:0"))
        this.showEndTimeError = true;
      else
        this.showEndTimeError = false;
      event = this.endDate;
    }
    else
      this.showEndTimeError = false;
    let date = new Date(event);
    this.endDateObj = date;
    this.endTimeInDateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log("onEndDate(event)", this.endTime, this.endDate, this.endTimeInDateFormat);
  }

  /* customFilter() {
     this.standselect = false;
     this.custselect = true;
     this.selectedTime = "";
   }
 
   standardFilter() {
     this.strDate = null;
     this.endDate = null;
     this.custselect = false;
     this.standselect = true;
 
   } */

  setTimeFilter(res: any) {
    console.log("set time filter is ", res);
    //this.trStartTime = res.ddrStartTime;
    //this.trEndTime = res.ddrEndTime;

    this.strTime = res.ddrStartTime;
    this.endTime = res.ddrEndTime;
    // this._ddrData.startTime = this.strTime;
    // this._ddrData.endTime = this.endTime;
    this.commonServices.nsTimeFlag = true;
    //this.standselect = false;
    //this.custselect = false;
    this.strDate = null;
    this.endDate = null;

    //console.log("ddr start time", this.trStartTime);
    //console.log("ddr end time", this.trEndTime);
    //this.getStandardTime();
    this.applyFilter();
  }
  getStandardTime() {

    console.log("checking before trStartTime", this.trStartTime);
    if (this.trStartTime != '' || this.trStartTime != undefined) {
      console.log("checking trStartTime", this.trStartTime);
      console.log("checking trStartTime", this.selectedTime.name);
      let time;
      if (this.selectedTime == 10) {
        time = 600000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 10 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 30) {
        time = 1800000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 30 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 60) {
        time = 3600000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 1 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 120) {
        time = 7200000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 2 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 240) {
        time = 14400000;
        console.log("before stsrt", this.trStartTime);
        this.trStartTime = this.trEndTime - time;
        console.log(" last 4 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 480) {
        time = 28800000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 8 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 720) {
        time = 43200000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 12 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == 1440) {
        time = 86400000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 24 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime == "Total Test Run") {
        this.trStartTime = "";
        this.trEndTime = "";
      }
      // this.standselect = false;
      // this.custselect = false;
      this.strDate = null;
      this.endDate = null;
      this.selectedTime = "";
      this.strTime = this.trStartTime;
      this.endTime = this.trEndTime;
      //  alert("start time inside standard filter--"+this.strTime);
    }

  }

  timeOptions() {
    this.selectCheckBoxFlag = false;
    this.createDropDownMenu();
    if (this.timeFilter == false) {
      this.selectedTime = "240";
      this.standardTime = [];

    }
  }
  getPhaseOptions() {
    if (this.selectedTime == 'Specified Phase') {
      let url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/", "")) + "/v1/cavisson/netdiagnostics/ddr/metadata/phaseList?testRun=" + this.urlParam.testRun;;
      console.log("Specified Phase url", url);
      this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.getPhaseData(data)));
    }
  }

  getPhaseData(res: any) {
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++)
      this.phaseTime.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });

  }
  // *********************************Assigning default filter to open report****************************************************
  assignFlowpathDefaultFilters() {
    console.log("this.id in dfault filter--", this.id);
    let fpParams = {};

    fpParams["testRun"] = this.id.testRun;
    fpParams["tierName"] = this.id.tierName
    fpParams["tierId"] = this.id.tierId
    fpParams["appId"] = this.id.appId
    fpParams["appName"] = this.id.appName
    fpParams["serverId"] = this.id.serverId
    fpParams["serverName"] = this.id.serverName
    fpParams["strStartTime"] = this.id.startTime
    fpParams["strEndTime"] = this.id.endTime
    fpParams["urlName"] = this.id.urlName

    this.commonServices.fpFilters = fpParams;
    console.log("fparams--", fpParams)
    this.assignFlowpathFilters();
  }


  assignHotspotDefaultFilters() {
    let hsParams = {};
    hsParams['testRun'] = this.id.testRun
    hsParams['tierId'] = this.id.tierId
    hsParams['appId'] = this.id.appId
    hsParams['serverId'] = this.id.serverId
    hsParams['appName'] = this.id.appName
    hsParams['serverName'] = this.id.serverName
    hsParams['tierName'] = this.id.tierName
    hsParams['strStartTime'] = this.id.startTime
    hsParams['strEndTime'] = this.id.endTime

    this.commonServices.hotspotFilters = hsParams;
    this.assignHotspotFilters();

  }

  assignIPSummaryDefaultFilters() {
    let ipParams = {};

    ipParams['testRun'] = this.id.testRun
    ipParams['tierId'] = this.id.tierId
    ipParams['appId'] = this.id.appId
    ipParams['serverId'] = this.id.serverId
    ipParams['appName'] = this.id.appName
    ipParams['serverName'] = this.id.serverName
    ipParams['tierName'] = this.id.tierName
    ipParams['strStartTime'] = this.id.startTime
    ipParams['strEndTime'] = this.id.endTime
    ipParams['strGroup'] = 'url'
    ipParams['statusCode'] = '-2'
    ipParams['showCount'] = 'false'

    this.commonServices.ipSummaryFilters = ipParams;
    this.assignIPSummaryFilters();
  }

  assignDBDefaultFilters() {

    let dbParams = {};
    dbParams['testRun'] = this.id.testRun
    dbParams['tierId'] = this.id.tierId
    dbParams['appId'] = this.id.appId
    dbParams['serverId'] = this.id.serverId
    dbParams['appName'] = this.id.appName
    dbParams['serverName'] = this.id.serverName
    dbParams['tierName'] = this.id.tierName
    dbParams['strStartTime'] = this.id.startTime
    dbParams['strEndTime'] = this.id.endTime
    dbParams['strOrderBy'] = 'exec_time_desc';


    this.commonServices.dbFilters = dbParams;
    this.assignDBFilters();

  }



  assignMethodTimingDefaultFilters() {
    let mtParams = {};
    mtParams['testRun'] = this.id.testRun
    mtParams['tierId'] = this.id.tierId
    mtParams['appId'] = this.id.appId
    mtParams['serverId'] = this.id.serverId
    mtParams['appName'] = this.id.appName
    mtParams['serverName'] = this.id.serverName
    mtParams['tierName'] = this.id.tierName
    mtParams['strStartTime'] = this.id.startTime
    mtParams['strEndTime'] = this.id.endTime
    mtParams['urlName'] = this.id.urlName
    mtParams['urlIndex'] = this.id.urlIndex

    this.commonServices.methodTimingFilters = mtParams;
    this.assignMethodTimingFilters();

  }
  assignUrlFilters(commonParam) {

    let reportVal = {};
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportVal;


    if (this.selectedTime == 'Custom Time') {
      if (this.commonServices.isValidParameter(this.strTimeInDateFormat) && this.commonServices.isValidParameter(this.endTimeInDateFormat))
        reportVal['customStartTime'] = this.strTimeInDateFormat;
      reportVal['customEndTime'] = this.endTimeInDateFormat;
      reportVal['checkedTimeFIlter'] = this.timeFilter;
    }

    if (this.strTime != undefined && this.strTime != null) {
      commonParam["startTime"] = this.strTime;
      reportVal['startTime'] = this.strTime;
      reportVal['selectedTime'] = this.selectedTime;
      reportVal['checkedTimeFIlter'] = this.timeFilter;
    }
    if (this.endTime != undefined && this.endTime != null) {
      commonParam["endTime"] = this.endTime;
      reportVal['EndTime'] = this.endTime;
    }
    console.log("this.selectedTransaction--", this.selectedTransaction)

    if (this.checkedTransaction && this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined) {
      commonParam["transactionName"] = this.selectedTransaction.name;
      //  commonParam["transidx"] = this.selectedTransaction.id
      reportVal['TransactionName'] = this.selectedTransaction.name;
      reportVal['TransactionId'] = this.selectedTransaction.id;
    }
    else if (this.checkedTransaction == false) {
      commonParam["transactionName"] = undefined;
      commonParam["transidx"] = undefined;
    }

    if (this.checkedUrl && this.selectedUrl != undefined && this.selectedUrl.name !== null && this.selectedUrl.name !== undefined) {
      commonParam["url"] = encodeURIComponent(this.selectedUrl.name);
      commonParam["urlidx"] = this.selectedUrl.id;
      reportVal['UrlName'] = this.selectedUrl.name;
      reportVal['UrlId'] = this.selectedUrl.id;
    }
    else if (this.checkedUrl == false) {

      commonParam["url"] = undefined;
      commonParam["urlidx"] = undefined;

    }

    if (this.checkedPage && this.selectedPage != undefined && this.selectedPage.name !== null && this.selectedPage.name !== undefined) {
      commonParam["pageName"] = this.selectedPage.name;
      commonParam["pageidx"] = this.selectedPage.id;
      reportVal['PageName'] = this.selectedPage.name;
      reportVal['PageId'] = this.selectedPage.id;
    }
    else if (this.checkedPage == false) {
      commonParam["pageName"] = undefined;
      commonParam["pageidx"] = undefined;
    }

    if (this.checkedScript && this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined) {
      commonParam["scriptName"] = encodeURIComponent(this.selectedScript.name);
      commonParam["scriptidx"] = this.selectedScript.id;
      reportVal['ScriptName'] = this.selectedScript.name;
      reportVal['ScriptId'] = this.selectedScript.id;
    }
    // commenting this due to migration
    // else if (this.checkedScript === false) {
    //   if (this.nsCommonData.urlsessionsummarydata && this.nsCommonData.urlsessionsummarydata.scriptName) {
    //     commonParam["ScriptName"] = this.nsCommonData.urlsessionsummarydata.scriptName;
    //   }
    //   else {
    //     commonParam["scriptName"] = undefined;
    //     commonParam["scriptidx"] = undefined;
    //   }
    // }

    console.log("this.checkedBrowser-", this.checkedBrowser);
    if (this.checkedLocation && this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined) {
      commonParam["location"] = this.selectedLocation.name;
      reportVal['Location'] = this.selectedLocation.name;
    }
    else if (this.checkedLocation === false)
      delete commonParam["location"];

    if (this.checkedBrowser && this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined) {
      commonParam["browser"] = this.selectedBrowser.name;
      reportVal['Browser'] = this.selectedBrowser.name;
    }
    else if (this.checkedBrowser === false)
      delete commonParam["browser"];

    if (this.checkedAccess && this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined) {
      commonParam["access"] = this.selectedAccess.name;
      reportVal['Access'] = this.selectedAccess.name;
    }
    else if (this.checkedAccess === false)
      delete commonParam["access"]

    if (this.selectedFailureNameId != "" && this.selectedFailureNameId != undefined) {
      commonParam["statusCode"] = this.selectedFailureNameId;
      commonParam["statusCodeFC"] = this.selectedFailureName;
      reportVal['StatusName'] = this.selectedFailureName;
      reportVal['StatusId'] = this.selectedFailureNameId;
    }
    else {
      commonParam["statusCode"] = -2;
      commonParam["statusCodeFC"] = "";
    }
    if ((this.checkGroup && this.selectedGroupBy != undefined && this.selectedGroupBy != null && this.selectedGroupBy.length != 0)
      || this.scriptGroup) {

      let mergeGroup = [];
      mergeGroup = this.selectedGroupBy.concat(this.groupByFilter);
      //console.log("before merge ******* group ",mergeGroup);
      mergeGroup = mergeGroup.filter((e, i) => mergeGroup.indexOf(e) >= i);
      //console.log("after merge ***** group ",mergeGroup);

      commonParam['strGroupBy'] = mergeGroup;
      reportVal['Group'] = this.selectedGroupBy;
    }
    else
      commonParam["strGroupBy"] = [''];

    if (this.checkOrder && this.selectedOrderBy != undefined && this.selectedOrderBy != null && this.selectedOrderBy.length != 0) {
      commonParam["order"] = this.selectedOrderBy;
      reportVal['Order'] = this.selectedOrderBy;
    }
    else
      delete commonParam["order"];

    if (this.selectedTime == 'Specified Phase' && this.timeFilter && this.selectedPhase != undefined && this.selectedPhase != null && this.selectedPhase != '') {
      commonParam["phaseidx"] = this.selectedPhase.id;
      commonParam["phaseName"] = this.selectedPhase.name;
      reportVal['PhaseName'] = this.selectedPhase.name;
      reportVal['PhaseId'] = this.selectedPhase.id;
    }
    else {
      delete commonParam["phaseidx"];
      delete commonParam['phaseName'];
    }

    if (this.checkedResponseTime && this.responseTime != '' && this.checkedResponseTime == true) {
      commonParam["responsetime"] = this.responseTime;
      commonParam["resptimeqmode"] = this.resSelectedCompareOption;
      reportVal['ResponseTime'] = this.responseTime;
      reportVal['ResponseTimeMode'] = this.resSelectedCompareOption;

    }
    else {
      delete commonParam["responsetime"];
      delete commonParam["resptimeqmode"];
    }
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportVal;

    //console.log("common param for URL===>",commonParam);
    return commonParam;
  }
  assignCommonFilters(commonParam) {
    // when user click on apply button we are making a object for data i.e whatever filter he has selected as well as for the CQM user UI.
    let reportVal = {};
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportVal; //for CQM UI
    if (this.selectedTime == 'Custom Time') {
      if (this.commonServices.isValidParameter(this.strTimeInDateFormat) && this.commonServices.isValidParameter(this.endTimeInDateFormat))
        reportVal['customStartTime'] = this.strTimeInDateFormat;
      reportVal['customEndTime'] = this.endTimeInDateFormat;
      reportVal['checkedTimeFIlter'] = this.timeFilter;
    }
    if (this.commonServices.currentReport == 'Transaction Summary' || this.commonServices.currentReport == 'Transaction Instance') {
      if (this.strTime != undefined && this.strTime != null) {
        commonParam["strStartTime"] = this.strTime;
        reportVal['startTime'] = this.strTime;
        reportVal['selectedTime'] = this.selectedTime;
        reportVal['checkedTimeFIlter'] = this.timeFilter;
      }
      if (this.endTime != undefined && this.endTime != null) {
        commonParam["strEndTime"] = this.endTime;
        reportVal['EndTime'] = this.endTime;
      }
    }
    else {
      if (this.strTime != undefined && this.strTime != null) {
        commonParam["startTime"] = this.strTime;
        reportVal['startTime'] = this.strTime;
        reportVal['selectedTime'] = this.selectedTime;
        reportVal['checkedTimeFIlter'] = this.timeFilter;
      }
      if (this.endTime != undefined && this.endTime != null) {
        commonParam["endTime"] = this.endTime;
        reportVal['EndTime'] = this.endTime;
      }
    }
    if (this.TickTransaction && this.checkedTransaction && this.selectedTransaction != undefined && this.selectedTransaction != null) {
      commonParam["transactionName"] = this.selectedTransaction.name;
      if (this.TickTransactionId)
        commonParam["transidx"] = this.selectedTransaction.id;
      // this._ddrData.transactionName=undefined;
      reportVal['TransactionName'] = this.selectedTransaction.name;
      reportVal['TransactionId'] = this.selectedTransaction.id;

    }
    else {
      if (this._ddrData.transactionName != undefined) {
        commonParam["transactionName"] = this._ddrData.transactionName;
      }
      else {
        delete commonParam["transactionName"];
      }
      delete commonParam["transidx"];
    }
    if (this.TickUrl && this.checkedUrl && this.selectedUrl != undefined && this.selectedUrl != null) {
      commonParam["url"] = encodeURIComponent(this.selectedUrl.name);
      if (this.TickUrlId)
        commonParam["urlidx"] = this.selectedUrl.id;

      reportVal['UrlName'] = this.selectedUrl.name;
      reportVal['UrlId'] = this.selectedUrl.id;
    }
    else {
      delete commonParam["url"];
      delete commonParam["urlidx"];
    }
    if (this.TickPage && this.checkedPage && this.selectedPage != undefined && this.selectedPage != null) {
      if (this.commonServices.currentReport.indexOf("Page") != -1) {    // in case of all page reports.
        commonParam["pageName"] = this.selectedPage.name;
        if (this.TickPageId)
          commonParam["pageIndex"] = this.selectedPage.id;
      }
      else {
        commonParam["page"] = this.selectedPage.name;
        if (this.TickPageId)
          commonParam["pageidx"] = this.selectedPage.id;
      }
      reportVal['PageName'] = this.selectedPage.name;
      reportVal['PageId'] = this.selectedPage.id;
    }
    else {
      delete commonParam["pageName"];
      delete commonParam["pageIndex"];
      delete commonParam["page"];
      delete commonParam["pageidx"];
    }
    if (this.TickScript && this.checkedScript && this.selectedScript != undefined && this.selectedScript != null) {
      if (this.commonServices.currentReport == 'Page Instance' || this.commonServices.currentReport == "Page Summary"
        || this.commonServices.currentReport == "Session Summary" || this.commonServices.currentReport == "Session Instance")
        commonParam["scriptName"] = encodeURIComponent(this.selectedScript.name);
      else
        commonParam["script"] = encodeURIComponent(this.selectedScript.name);
      if (this.TickScriptId)
        commonParam["scriptidx"] = this.selectedScript.id;
      reportVal['ScriptName'] = this.selectedScript.name;
      reportVal['ScriptId'] = this.selectedScript.id;
    }
    else {
      delete commonParam["scriptName"];
      delete commonParam["script"];
      delete commonParam["scriptidx"];
    }
    if (this.TickLocation && this.checkedLocation && this.selectedLocation != undefined && this.selectedLocation != null) {
      commonParam["location"] = this.selectedLocation.name;
      reportVal['Location'] = this.selectedLocation.name;
    }
    else {
      delete commonParam["location"];
    }
    if (this.TickAccess && this.checkedAccess && this.selectedAccess != undefined && this.selectedAccess != null) {
      commonParam["access"] = this.selectedAccess.name;
      reportVal['Access'] = this.selectedAccess.name;
    }
    else {
      delete commonParam["access"];
    }
    if (this.TickBrowser && this.checkedBrowser && this.selectedBrowser != undefined && this.selectedBrowser != null) {
      commonParam["browser"] = this.selectedBrowser.name;
      reportVal['Browser'] = this.selectedBrowser.name;
    }
    else {
      delete commonParam["browser"];
    }
    if ((this.TickGroup && this.checkGroup && this.selectedGroupBy != undefined && this.selectedGroupBy != null && this.selectedGroupBy.length != 0)
      || this.scriptGroup) {
      let mergeGroup = []
      mergeGroup = this.selectedGroupBy.concat(this.groupByFilter);
      //console.log("before merge ******* group ",mergeGroup);
      mergeGroup = mergeGroup.filter((e, i) => mergeGroup.indexOf(e) >= i);
      //console.log("after merge ***** group ",mergeGroup);
      if (this.commonServices.currentReport == 'Session Summary')
        commonParam["strGroupBy"] = mergeGroup;
      else
        commonParam["group"] = mergeGroup;

      reportVal['Group'] = this.selectedGroupBy;  //this will store value in slected Group by as its UI filter applied by user.      
    }
    else {
      if (this.commonServices.currentReport == 'Session Summary')
        commonParam["strGroupBy"] = [''];
      else
        commonParam["group"] = [''];
    }
    if (this.TickOrder && this.checkOrder && this.selectedOrderBy != undefined && this.selectedOrderBy != null && this.selectedOrderBy.length != 0) {
      commonParam["order"] = this.selectedOrderBy;
      reportVal['Order'] = this.selectedOrderBy;
    }
    else {
      delete commonParam["order"];
    }

    if (this.TickStatus && this.selectedUrlStatus && this.selectedFailureNameId != undefined && this.selectedFailureNameId != null) {
      if (this.commonServices.currentReport == 'Session Instance')
        commonParam["strStatus"] = this.selectedFailureNameId;
      else {
        if (commonParam.status != undefined || commonParam.status != null)
          commonParam["status"] = this.selectedFailureNameId;
        if (commonParam.statusCode != undefined || commonParam.statusCode != null)
          commonParam["statusCode"] = this.selectedFailureNameId;
        commonParam["statusName"] = this.selectedFailureName;
      }
      reportVal['StatusName'] = this.selectedFailureName;
      reportVal['StatusId'] = this.selectedFailureNameId;
    }
    if (this.selectedTime == 'Specified Phase' && this.timeFilter && this.selectedPhase != undefined && this.selectedPhase != null && this.selectedPhase != '') {
      commonParam["phaseidx"] = this.selectedPhase.id;
      commonParam["phaseName"] = this.selectedPhase.name;
      reportVal['PhaseName'] = this.selectedPhase.name;
      reportVal['PhaseId'] = this.selectedPhase.id;
    }
    else {
      delete commonParam["phaseName"];
      delete commonParam["phaseidx"];
    }
    if (this.checkedResponseTime && this.responseTime != '' && this.checkedResponseTime == true) {
      commonParam["responsetime"] = this.responseTime;
      commonParam["resptimeqmode"] = this.resSelectedCompareOption;
      reportVal['ResponseTime'] = this.responseTime;
      reportVal['ResponseTimeMode'] = this.resSelectedCompareOption;

      console.log("inside the response condition===>");
    }
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportVal;
    //  console.log("common param are===>",commonParam);

    return commonParam;
  }
  assignExceptionDefaultFilters() {
    console.log("inside default filter method");
    let exParams = {};
    exParams['testRun'] = this.id.testRun
    exParams['tierId'] = this.id.tierId
    exParams['appId'] = this.id.appId
    exParams['serverId'] = this.id.serverId
    exParams['appName'] = this.id.appName
    exParams['serverName'] = this.id.serverName
    exParams['tierName'] = this.id.tierName
    exParams['strStartTime'] = this.id.startTime
    exParams['strEndTime'] = this.id.endTime

    this.checkGroup = true;
    this.getGroupBy();
    this.selectedGroupBy = [];
    this.selectedGroupBy.push('excclass');
    this.selectedGroupBy.push('excthrowingclass');
    this.selectedGroupBy.push('excthrowingmethod');

    // exParams['urlName'] = this.id.urlName
    // exParams['urlIndex'] = this.id.urlIndex

    this.commonServices.exceptionFilters = exParams;
    this.assignExceptionFilters();
    console.log("in the end this.commonServices.exceptionFilters--", this.commonServices.exceptionFilters);
  }
  assignFlowpathGroupByDefaultFilters() {

    let fpGroupByParams = {};
    fpGroupByParams["testRun"] = this.id.testRun;
    fpGroupByParams["tierName"] = this.id.tierName
    fpGroupByParams["tierId"] = this.id.tierId
    fpGroupByParams["appId"] = this.id.appId
    fpGroupByParams["appName"] = this.id.appName
    fpGroupByParams["serverId"] = this.id.serverId
    fpGroupByParams["serverName"] = this.id.serverName
    fpGroupByParams["strStartTime"] = this.id.startTime
    fpGroupByParams["strEndTime"] = this.id.endTime

    fpGroupByParams["btCategory"] = 'All'
    fpGroupByParams["strGroup"] = 'url'
    fpGroupByParams["strOrder"] = 'url'
    //   fpGroupByParams["strEndTime"] = this.id.endTime

    // '&btCategory=All' + '&strGroup=url' + '&strOrder=url' + "&groupByFC=BT"
    this.commonServices.fpGroupByFilters = fpGroupByParams;
    this.assignFlowpathGroupByFilters();
  }

  assignDBGroupByDefaultFilters() {
    let dbGroupByParams = {};
    dbGroupByParams["testRun"] = this.id.testRun;
    dbGroupByParams["tierName"] = this.id.tierName
    dbGroupByParams["tierId"] = this.id.tierId
    dbGroupByParams["appId"] = this.id.appId
    dbGroupByParams["appName"] = this.id.appName
    dbGroupByParams["serverId"] = this.id.serverId
    dbGroupByParams["serverName"] = this.id.serverName
    dbGroupByParams["strStartTime"] = this.id.startTime
    dbGroupByParams["strEndTime"] = this.id.endTime

    dbGroupByParams["strGroup"] = 'url'
    dbGroupByParams["strOrder"] = 'count_desc'
    dbGroupByParams["urlName"] = 'AllTransactions'
    // this.selectedGroupBy= ['url'] ;
    this.commonServices.dbGroupByFilters = dbGroupByParams;
    console.log("inside DBGroupByDefaultFilters --", this.commonServices.dbGroupByFilters)
    this.assignDBGroupByFilters();


  }

  // ********************************end of functions used for assigning default values to open report********************************************************************


  assignMethodTimingFilters() {
    let reportUI = {};
    let mtParams = this.commonServices.methodTimingFilters;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignMethodTimingFilters mtFilters before assigning values = ", mtParams);

    if (this.tierNameFC != 'default') {
      mtParams["tierName"] = this.tierNameFC.toString();
      mtParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      mtParams["serverName"] = this.serverNameFC;
      mtParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      mtParams["appName"] = this.appNameFC;
      mtParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    if (this.selectedBuisnessTransaction != undefined) {
      if (this.selectedBuisnessTransaction.name !== undefined) {
        mtParams["urlName"] = this.selectedBuisnessTransaction.name;
        mtParams["urlIndex"] = this.selectedBuisnessTransaction.id;
        reportUI["urlName"] = this.selectedBuisnessTransaction.name;
        reportUI["urlIndex"] = this.selectedBuisnessTransaction.id;
      }
      else if (this.checkedBuisnessTransaction === false)  //if someone uncheck BT Filter, pass NA (means remove that filter)
      {
        mtParams["urlName"] = 'NA';
        mtParams["urlIndex"] = 'NA';
      }
    }

    if (this.fpInstance !== null && this.fpInstance !== undefined) {
      mtParams["flowpathInstance"] = this.fpInstance;
      reportUI['FlowpathID'] = this.fpInstance;
    }
    if (this.strTime !== null && this.strTime !== undefined) {
      mtParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }

    if (this.endTime !== null && this.endTime !== undefined) {
      mtParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }

    if (this.selectedUrl != undefined && this.selectedUrl.name !== undefined) {
      mtParams["url"] = this.selectedUrl.name;
      mtParams["nsUrlIdx"] = this.selectedUrl.id;
    }
    else if (this.checkedUrl === false) {
      mtParams["url"] = 'NA';
      mtParams["nsUrlIdx"] = 'NA';
    }


    mtParams["page"] = this.page;

    if (this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined)
      mtParams["script"] = this.selectedScript.name;
    else if (this.checkedScript === false)
      mtParams["script"] = 'NA';

    if (this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined)
      mtParams["transaction"] = this.selectedTransaction.name;
    else if (this.checkedTransaction === false)
      mtParams["transaction"] = 'NA';

    if (this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined)
      mtParams["location"] = this.selectedLocation.name;
    else if (this.checkedLocation === false)
      mtParams["location"] = 'NA';

    if (this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined)
      mtParams["access"] = this.selectedBrowser.name;
    else if (this.checkedBrowser === false)
      mtParams["access"] = 'NA';

    if (this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined)
      mtParams["browser"] = this.selectedAccess.name;
    else if (this.checkedAccess === false)
      mtParams["browser"] = 'NA';
    if (this.selectedBTCategory != undefined) {
      mtParams["btCatagory"] = this.selectedBTCategory;
      reportUI["BtCategory"] = this.selectedBTCategory;
    }
    if (this.selectedTopNEntity != undefined && this.selectedTopNEntity !== null) {
      mtParams['topNEntities'] = this.selectedTopNEntity;
      reportUI['TopNEntities'] = this.selectedTopNEntity;
    }
    this.commonServices.methodTimingFilters = mtParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;

    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      mtParams['pubicIP'] = this.selectedDC.pubicIP
      mtParams['publicPort'] = this.selectedDC.publicPort
      mtParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      mtParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      mtParams['pubicIP'] = ''
      mtParams['publicPort'] = ''
      mtParams['ndeTestRun'] = ''
      mtParams['ndeProtocol'] = ''
    }


    console.log(" method - assignMethodTimingFilters mtFilters after assigning values = ", mtParams);
  }
  assignIPSummaryFilters() {
    let ipSummaryParams = this.commonServices.ipSummaryFilters;
    let reportUI = {};
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignipSummaryFilters ipSummaryFilters before assigning values = ", ipSummaryParams);



    if (this.tierNameFC != 'default') {
      ipSummaryParams["tierName"] = this.tierNameFC.toString();
      ipSummaryParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      console.log("data in the tier before assigning..................", this.tierName);
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      ipSummaryParams["serverName"] = this.serverNameFC;
      ipSummaryParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      console.log("the value inside the sever ;lost is ..........", this.serverList);
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      ipSummaryParams["appName"] = this.appNameFC;
      ipSummaryParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    if (this.fpInstance !== null && this.fpInstance !== undefined) {
      ipSummaryParams["flowpathID"] = this.fpInstance;
      reportUI['FlowpathID'] = this.fpInstance;
    }
    if (this.selectedBuisnessTransaction != undefined) {
      if (this.selectedBuisnessTransaction.name !== undefined) {
        ipSummaryParams["urlName"] = this.selectedBuisnessTransaction.name;
        ipSummaryParams["urlIndex"] = this.selectedBuisnessTransaction.id;
        reportUI["urlName"] = this.selectedBuisnessTransaction.name;
        reportUI["urlIndex"] = this.selectedBuisnessTransaction.id;
      }
      else if (this.checkedBuisnessTransaction === false)  //if someone uncheck BT Filter, pass NA (means remove that filter)
      {
        ipSummaryParams["urlName"] = 'NA';
        ipSummaryParams["urlIndex"] = 'NA';
      }
    }
    if (this.selectedIntegrationPoint !== null && this.selectedIntegrationPoint != undefined && this.selectedIP == true && this.selectedIntegrationPoint.length != 0) {
      this.selectedIpName = [];
      for (let i = 0; i < this.selectedIntegrationPoint.length; i++) {
        let selectedIpname = this.selectedIntegrationPoint[i].name;
        if (this.selectedIpName.indexOf(selectedIpname) == -1)  //for unique ids
          this.selectedIpName.push(selectedIpname);
      }
      // console.log("this.selectedIntegrationPoint>>>>>",this.selectedIntegrationPoint);
      ipSummaryParams["integrationPointName"] = this.selectedIpName;
      reportUI['IntegrationPointName'] = this.selectedIpName;

    } else {
      ipSummaryParams["integrationPointName"] = 'NA';                             // for uncheck integration point 
    }

    if (this.strTime !== null && this.strTime !== undefined) {
      ipSummaryParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }
    if (this.endTime !== null && this.endTime !== undefined) {
      ipSummaryParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }


    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      ipSummaryParams['pubicIP'] = this.selectedDC.pubicIP
      ipSummaryParams['publicPort'] = this.selectedDC.publicPort
      ipSummaryParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      ipSummaryParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      ipSummaryParams['pubicIP'] = ''
      ipSummaryParams['publicPort'] = ''
      ipSummaryParams['ndeTestRun'] = ''
      ipSummaryParams['ndeProtocol'] = ''
    }
    this.commonServices.ipSummaryFilters = ipSummaryParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignHotspotFilters hotspotFilters after assigning values = ", ipSummaryParams);
    console.log("value inside the nsCqMAutoFill in the ipsummary report is ...........", reportUI);
  }

  assignHotspotFilters() {
    let hsParams = this.commonServices.hotspotFilters;
    let reportUI = {};
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignHotspotFilters hotspotFilters before assigning values = ", hsParams);

    if (this.fpInstance !== null && this.fpInstance !== undefined) {
      hsParams["flowpathInstance"] = this.fpInstance;
      reportUI['FlowpathID'] = this.fpInstance;
    }
    if (this.tierNameFC != 'default') {
      hsParams["tierName"] = this.tierNameFC.toString();
      hsParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      console.log("data in the tier before assigning..................", this.tierName);
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      hsParams["serverName"] = this.serverNameFC;
      hsParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      console.log("the value inside the sever ;lost is ..........", this.serverList);
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      hsParams["appName"] = this.appNameFC;
      hsParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    if (this.strTime !== null && this.strTime !== undefined) {
      hsParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }

    if (this.endTime !== null && this.endTime !== undefined) {
      hsParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }


    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      hsParams['pubicIP'] = this.selectedDC.pubicIP
      hsParams['publicPort'] = this.selectedDC.publicPort
      hsParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      hsParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      hsParams['pubicIP'] = ''
      hsParams['publicPort'] = ''
      hsParams['ndeTestRun'] = ''
      hsParams['ndeProtocol'] = ''
    }
    this.commonServices.hotspotFilters = hsParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignHotspotFilters hotspotFilters after assigning values = ", hsParams);
    console.log("Values inside the nsCQMAUTOFILL in hotspot is ", reportUI);


  }

  assignFlowpathFilters() {
    let reportUI = {};
    let fpParams = this.commonServices.fpFilters;
    console.log(" method - assignFlowpathFilters fpFilters before assigning values = ", fpParams);
    fpParams["templateName"] = "NA";
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    fpParams["isContainsNSFilters"] = false;
    fpParams["customData"] = "NA";
    if (this.fpInstance !== null && this.fpInstance !== undefined) {
      fpParams["flowpathID"] = this.fpInstance;
      reportUI['FlowpathID'] = this.fpInstance;
    }
    if (this.tierNameFC != 'default') {
      fpParams["tierName"] = this.tierNameFC.toString();
      fpParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      fpParams["serverName"] = this.serverNameFC;
      fpParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      fpParams["appName"] = this.appNameFC;
      fpParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    if (this.strTime !== null && this.strTime !== undefined) {
      fpParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }
    if (this.endTime !== null && this.endTime !== undefined) {
      fpParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }
    if (this.selectedTime == 'Custom Time') {
      if (this.commonServices.isValidParameter(this.strTimeInDateFormat) && this.commonServices.isValidParameter(this.endTimeInDateFormat)) {
        reportUI['customStartTime'] = this.strTimeInDateFormat;
        reportUI['customEndTime'] = this.endTimeInDateFormat;
      }
    }
    if (this.selectedFailureNameId != "" && this.selectedFailureNameId != undefined) {
      fpParams["statusCode"] = this.selectedFailureNameId;
      fpParams["statusCodeFC"] = this.selectedFailureName;
      reportUI['statusCode'] = this.selectedFailureNameId;

      reportUI["statusCodeFC"] = this.selectedFailureName;
    }
    else {
      fpParams["statusCode"] = -2;
      fpParams["statusCodeFC"] = "";
    }
    //alert("this.selectedFailureNameId---"+ this.selectedFailureNameId + "this.selectedUrlStatus --" + this.selectedUrlStatus );
    if (this.strTime !== null && this.strTime !== undefined)
      fpParams["strStartTime"] = this.strTime;

    //selectedBuisnessTransaction = undefined (default value). If this variable has default value don't update 'urlName' and 'urlIndex'
    //selectedBuisnessTransaction = ""  (uncheck value)
    if (this.selectedBuisnessTransaction != undefined) {
      if (this.selectedBuisnessTransaction.name !== undefined) {
        fpParams["urlName"] = this.selectedBuisnessTransaction.name;
        fpParams["urlIndex"] = this.selectedBuisnessTransaction.id;
        reportUI["urlName"] = this.selectedBuisnessTransaction.name;
        reportUI["urlIndex"] = this.selectedBuisnessTransaction.id;
      }
      else if (this.checkedBuisnessTransaction === false)  //if someone uncheck BT Filter, pass NA (means remove that filter)
      {
        fpParams["urlName"] = 'NA';
        fpParams["urlIndex"] = 'NA';
      }
    }

    if (this.selectedBTCategory != undefined) {
      fpParams["btCategory"] = this.selectedBTCategory;
      reportUI["BtCategory"] = this.selectedBTCategory;
    }
    // changes for filter in flowpath for Dynamic logging and request response
    console.log("dl flag value==", this.checkDLFlag, "***********Req and resp flag value", this.checkReqRespFlag)
    if (this.checkDLFlag != null && this.checkDLFlag != undefined) {
      fpParams["checkDLFlag"] = this.checkDLFlag;
      reportUI['checkDLFlag'] = this.checkDLFlag;
    }
    if (this.checkReqRespFlag != null && this.checkReqRespFlag != undefined) {
      fpParams["checkReqRespFlag"] = this.checkReqRespFlag;
      reportUI['checkReqRespFlag'] = this.checkReqRespFlag;
    }

    if (this.selectedCorrIdMode != null && this.selectedCorrIdMode != "" && this.selectedCorrIdMode != undefined) {
      fpParams["correlationId"] = encodeURIComponent(this.corrId);
      reportUI['CorrelationId'] = encodeURIComponent(this.corrId);
      fpParams["mode"] = this.selectedCorrIdMode;
      fpParams["corModeValue"] = this.selectedCorrIdMode;
      reportUI['Mode'] = this.selectedCorrIdMode;
      console.log("The value inside the reportUI['CorrelationId']", reportUI['CorrelationId']);
      console.log("The value inside the reportUI['Mode']", reportUI['Mode']);
    }

    if (this.minMethods != "" && this.minMethods != undefined) {
      fpParams["minMethods"] = this.minMethods;
      reportUI['MinMethods'] = this.minMethods;
    }
    fpParams["responseTime"] = this.responseTime1;
    console.log(" ", this.responseTime1);
    //reportUI['responseTime'] = this.responseTime1;
    if (this.responseTime != undefined && this.responseTime != '') {
      console.log("value insisde the response time is ", this.responseTime);
      fpParams["resptimeqmode"] = this.resSelectedCompareOption;
      reportUI['resptimeqmode'] = this.resSelectedCompareOption;
      reportUI['responseTime'] = this.responseTime;
    }
    else
      fpParams["resptimeqmode"] = '';
    fpParams['resptimevalue'] = this.getResponseTimeModeValue(fpParams["resptimeqmode"]);
    fpParams['resVariance'] = this.resVariance;
    reportUI['resVariance'] = this.resVariance;
    if (this.resSelectedCompareOption == '3' && (this.resVariance == undefined || this.resVariance == "")) {
      fpParams['responseTime2'] = this.responseTime1;
      //reportUI['responseTime2'] = this.responseTime1;
      console.log("Value inside the responseTime1 in equal case is ............//", this.responseTime1);
    }
    else {
      fpParams['responseTime2'] = this.responseTime2;
      //reportUI['responseTime2']  = this.responseTime2;
      console.log("Value inside the responseTime2 in not equal is ...........//", this.responseTime2);
    }


    if (this.selectedFpOrderBy != undefined && this.selectedFpOrderBy != [] && this.selectedFpOrderBy.length != 0) {
      fpParams["strOrderBy"] = this.selectedFpOrderBy;
      reportUI['StrOrderBy'] = this.selectedFpOrderBy;
      console.log("the value inside the order by for the flowpath ...............", reportUI['StrOrderBy'])

    }
    else if (this.fpOrderByCheck == false) {
      fpParams['strOrderBy'] = 'fpduration_desc';
    }

    if (this.selectedUrl != undefined && this.selectedUrl.name !== undefined) {
      fpParams["url"] = this.selectedUrl.name;
      fpParams["nsUrlIdx"] = this.selectedUrl.id;
    }
    else if (this.checkedUrl === false) {
      fpParams["url"] = 'NA';
      fpParams["nsUrlIdx"] = 'NA';
    }

    fpParams["page"] = this.page;

    if (this.page != "NA")
      fpParams["isContainsNSFilters"] = true;

    /*if (this.selectedPage != undefined && this.selectedPage.name !== null && this.selectedPage.name !== undefined)
    {
      fpParams["isContainsNSFilters"] = true;
      fpParams["page"] = this.selectedPage.name;
    }  
    else if (this.checkedPage === false)
      fpParams["page"] = 'NA';
    */
    if (this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined) {
      fpParams["isContainsNSFilters"] = true;
      fpParams["script"] = this.selectedScript.name;
    }
    else if (this.checkedScript === false)
      fpParams["script"] = 'NA';

    if (this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined) {
      fpParams["isContainsNSFilters"] = true;
      fpParams["transaction"] = this.selectedTransaction.name;
    }
    else if (this.checkedTransaction === false)
      fpParams["transaction"] = 'NA';

    if (this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined) {
      fpParams["isContainsNSFilters"] = true;
      fpParams["location"] = this.selectedLocation.name;
    }
    else if (this.checkedLocation === false)
      fpParams["location"] = 'NA';

    if (this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined) {
      fpParams["isContainsNSFilters"] = true;
      fpParams["access"] = this.selectedBrowser.name;
    }
    else if (this.checkedBrowser === false)
      fpParams["access"] = 'NA';

    if (this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined) {
      fpParams["isContainsNSFilters"] = true;
      fpParams["browser"] = this.selectedAccess.name;
    }
    else if (this.checkedAccess === false)
      fpParams["browser"] = 'NA';

    if (this.ndSessionId != undefined)
      fpParams["ndSessionId"] = this.ndSessionId;

    if (this.nvPageId != undefined)
      fpParams["nvPageId"] = this.nvPageId;

    if (this.nvSessionId != undefined)
      fpParams["nvSessionId"] = this.nvSessionId;

    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      fpParams['pubicIP'] = this.selectedDC.pubicIP
      fpParams['publicPort'] = this.selectedDC.publicPort
      fpParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      fpParams['ndeProtocol'] = this.selectedDC.ndeProtocol

    }
    else {
      fpParams['pubicIP'] = ''
      fpParams['publicPort'] = ''
      fpParams['ndeTestRun'] = ''
      fpParams['ndeProtocol'] = '';
    }
    this.commonServices.fpFilters = fpParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    if (this._ddrData.isFromNV == "1") {
      this._ddrData.nvCqm = true;
    }
    console.log(" method - assignFlowpathFilters fpFilters after assigning values = ", fpParams);
  }
  assignFlowpathGroupByFilters() {
    this.getgroupByFC();
    this.getOrderByFC();
    let reportUI = {};
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    let fpGroupByParams = this.commonServices.fpGroupByFilters;
    fpGroupByParams["isContainsNSFilters"] = false;

    console.log(" method - assignFlowpathGroupByFilters fpGroupByParam before assigning values = ", fpGroupByParams);

    if (this.tierNameFC != 'default') {
      fpGroupByParams["tierName"] = this.tierNameFC.toString();
      fpGroupByParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      console.log("data in the tier before assigning..................", this.tierName);
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      fpGroupByParams["serverName"] = this.serverNameFC;
      fpGroupByParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC;
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      console.log("the value inside the sever ;lost is ..........", this.serverList);
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      fpGroupByParams["appName"] = this.appNameFC;
      fpGroupByParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    if (this.strTime !== null && this.strTime !== undefined) {
      fpGroupByParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }

    if (this.endTime !== null && this.endTime !== undefined) {
      fpGroupByParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }

    if (this.selectedGroupBy.length == 0) //uncheck case or default case
    {
      fpGroupByParams["strGroup"] = 'url';
      fpGroupByParams["groupByFC"] = 'BT';
    }
    else {
      fpGroupByParams["strGroup"] = this.selectedGroupBy;
      reportUI['Group'] = this.selectedGroupBy;
      fpGroupByParams["groupByFC"] = this.groupByFC.toString();

    }


    if (this.checkOrder == false) {
      fpGroupByParams["strOrder"] = 'url';
      fpGroupByParams["orderByFC"] = '';
    }
    if (this.selectedOrderBy !== null && this.selectedOrderBy !== undefined && this.selectedOrderBy.length != 0) {
      fpGroupByParams["strOrder"] = this.selectedOrderBy;
      fpGroupByParams["orderByFC"] = this.orderByFC.toString();
      reportUI['Order'] = this.selectedOrderBy;
    }
    if (this.selectedFailureNameId != "" && this.selectedFailureNameId != undefined) {
      fpGroupByParams["statusCode"] = this.selectedFailureNameId;
      fpGroupByParams["statusCodeFC"] = this.selectedFailureName;
    }
    else {
      fpGroupByParams["statusCode"] = -2;
      fpGroupByParams["statusCodeFC"] = "";
    }

    if (this.selectedBuisnessTransaction != undefined) {
      if (this.selectedBuisnessTransaction.name !== undefined) {
        fpGroupByParams["urlName"] = this.selectedBuisnessTransaction.name;
        fpGroupByParams["urlIdx"] = this.selectedBuisnessTransaction.id;
        reportUI["urlName"] = this.selectedBuisnessTransaction.name;
        reportUI["urlIndex"] = this.selectedBuisnessTransaction.id;
      }
      else if (this.checkedBuisnessTransaction === false)  //if someone uncheck BT Filter, pass NA (means remove that filter)
      {
        fpGroupByParams["urlName"] = 'NA';
        fpGroupByParams["urlIdx"] = 'NA';
      }
    }

    if (this.selectedBTCategory != undefined) {
      fpGroupByParams["btCategory"] = this.selectedBTCategory;
      reportUI["BtCategory"] = this.selectedBTCategory;
    }

    if (this.selectedUrl != undefined && this.selectedUrl.name !== undefined) {
      fpGroupByParams["url"] = this.selectedUrl.name;
      fpGroupByParams["nsUrlIdx"] = this.selectedUrl.id;
    }
    else if (this.checkedUrl === false) {
      fpGroupByParams["url"] = 'NA';
      fpGroupByParams["nsUrlIdx"] = 'NA';
    }

    fpGroupByParams["page"] = this.page;

    if (this.page != "NA")
      fpGroupByParams["isContainsNSFilters"] = true;

    if (this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined) {
      fpGroupByParams["isContainsNSFilters"] = true;
      fpGroupByParams["script"] = this.selectedScript.name;
    }
    else if (this.checkedScript === false)
      fpGroupByParams["script"] = 'NA';

    if (this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined) {
      fpGroupByParams["isContainsNSFilters"] = true;
      fpGroupByParams["transaction"] = this.selectedTransaction.name;
    }
    else if (this.checkedTransaction === false)
      fpGroupByParams["transaction"] = 'NA';

    if (this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined) {
      fpGroupByParams["isContainsNSFilters"] = true;
      fpGroupByParams["location"] = this.selectedLocation.name;
    }
    else if (this.checkedLocation === false)
      fpGroupByParams["location"] = 'NA';

    if (this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined) {
      fpGroupByParams["isContainsNSFilters"] = true;
      fpGroupByParams["access"] = this.selectedBrowser.name;
    }
    else if (this.checkedBrowser === false)
      fpGroupByParams["access"] = 'NA';

    if (this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined) {
      fpGroupByParams["isContainsNSFilters"] = true;
      fpGroupByParams["browser"] = this.selectedAccess.name;
    }
    else if (this.checkedAccess === false)
      fpGroupByParams["browser"] = 'NA';

    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      fpGroupByParams['pubicIP'] = this.selectedDC.pubicIP
      fpGroupByParams['publicPort'] = this.selectedDC.publicPort
      fpGroupByParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      fpGroupByParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      fpGroupByParams['pubicIP'] = ''
      fpGroupByParams['publicPort'] = ''
      fpGroupByParams['ndeTestRun'] = ''
      fpGroupByParams['ndeProtocol'] = ''
    }


    this.commonServices.fpGroupByFilters = fpGroupByParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignFlowpathGroupByFilters fpFilters after assigning values = ", fpGroupByParams);

  }
  assignDBGroupByFilters() {
    let reportUI = {};
    this.getgroupByFC();
    this.getOrderByFC();
    let dbGroupByParams = this.commonServices.dbGroupByFilters;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    dbGroupByParams["isContainsNSFilters"] = false;

    console.log(" method - --assignDBGroupByFilters dbGroupByParam before assigning values = ", dbGroupByParams);

    if (this.tierNameFC != 'default') {
      dbGroupByParams["tierName"] = this.tierNameFC.toString();
      dbGroupByParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      dbGroupByParams["serverName"] = this.serverNameFC;
      dbGroupByParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      dbGroupByParams["appName"] = this.appNameFC;
      dbGroupByParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    if (this.strTime !== null && this.strTime !== undefined) {
      dbGroupByParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }

    if (this.endTime !== null && this.endTime !== undefined) {
      dbGroupByParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }
    console.log("this.selectedGroupBy.length--", this.selectedGroupBy.length);
    if (this.selectedGroupBy.length == 0) //uncheck case or default case
    {
      dbGroupByParams["strGroup"] = 'url';
      dbGroupByParams["groupByFC"] = 'BT';
    }
    else {
      dbGroupByParams["strGroup"] = this.selectedGroupBy;
      reportUI['Group'] = this.selectedGroupBy;
      dbGroupByParams["groupByFC"] = this.groupByFC.toString();
    }

    if (this.selectedOrderBy.length == 0) //uncheck case or default case
    {
      dbGroupByParams["strOrderBy"] = 'count_desc';
      dbGroupByParams["orderByFC"] = '';
    }
    else {
      dbGroupByParams["strOrderBy"] = this.selectedOrderBy;
      dbGroupByParams["orderByFC"] = this.orderByFC.toString();
      reportUI['Order'] = this.selectedOrderBy;
    }

    if (this.selectedFailureNameId != "" && this.selectedFailureNameId != undefined) {
      dbGroupByParams["statusCode"] = this.selectedFailureNameId;
      dbGroupByParams["statusCodeFC"] = this.selectedFailureName;
    }
    else {
      dbGroupByParams["statusCode"] = -2;
      dbGroupByParams["statusCodeFC"] = "";
    }

    if (this.selectedBuisnessTransaction != undefined) {
      if (this.selectedBuisnessTransaction.name !== undefined) {
        dbGroupByParams["urlName"] = this.selectedBuisnessTransaction.name;
        dbGroupByParams["urlIndex"] = this.selectedBuisnessTransaction.id;
        reportUI["urlName"] = this.selectedBuisnessTransaction.name;
        reportUI["urlIndex"] = this.selectedBuisnessTransaction.id;
      }
      else if (this.checkedBuisnessTransaction === false)  //if someone uncheck BT Filter, pass NA (means remove that filter)
      {
        dbGroupByParams["urlName"] = 'NA';
        dbGroupByParams["urlIndex"] = 'NA';
      }
    }

    if (this.selectedBTCategory != undefined) {
      dbGroupByParams["btcategoryId"] = this.selectedBTCategory;
      reportUI["BtCategory"] = this.selectedBTCategory;
    }

    if (this.selectedUrl != undefined && this.selectedUrl.name !== undefined) {
      dbGroupByParams["url"] = this.selectedUrl.name;
      dbGroupByParams["nsUrlIdx"] = this.selectedUrl.id;
    }
    else if (this.checkedUrl === false) {
      dbGroupByParams["url"] = 'NA';
      dbGroupByParams["nsUrlIdx"] = 'NA';
    }

    dbGroupByParams["page"] = this.page;

    if (this.page != "NA")
      dbGroupByParams["isContainsNSFilters"] = true;

    if (this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined) {
      dbGroupByParams["isContainsNSFilters"] = true;
      dbGroupByParams["script"] = this.selectedScript.name;
    }
    else if (this.checkedScript === false)
      dbGroupByParams["script"] = 'NA';

    if (this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined) {
      dbGroupByParams["isContainsNSFilters"] = true;
      dbGroupByParams["transaction"] = this.selectedTransaction.name;
    }
    else if (this.checkedTransaction === false)
      dbGroupByParams["transaction"] = 'NA';

    if (this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined) {
      dbGroupByParams["isContainsNSFilters"] = true;
      dbGroupByParams["location"] = this.selectedLocation.name;
    }
    else if (this.checkedLocation === false)
      dbGroupByParams["location"] = 'NA';

    if (this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined) {
      dbGroupByParams["isContainsNSFilters"] = true;
      dbGroupByParams["access"] = this.selectedBrowser.name;
    }
    else if (this.checkedBrowser === false)
      dbGroupByParams["access"] = 'NA';

    if (this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined) {
      dbGroupByParams["isContainsNSFilters"] = true;
      dbGroupByParams["browser"] = this.selectedAccess.name;
    }
    else if (this.checkedAccess === false)
      dbGroupByParams["browser"] = 'NA';

    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      dbGroupByParams['pubicIP'] = this.selectedDC.pubicIP
      dbGroupByParams['publicPort'] = this.selectedDC.publicPort
      dbGroupByParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      dbGroupByParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      dbGroupByParams['pubicIP'] = ''
      dbGroupByParams['publicPort'] = ''
      dbGroupByParams['ndeTestRun'] = ''
      dbGroupByParams['ndeProtocol'] = ''
    }


    this.commonServices.dbGroupByFilters = dbGroupByParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assigndbGroupByFilters fpFilters after assigning values = ", dbGroupByParams);

  }
  assignExceptionFilters() {
    let reportUI = {};
    this.getgroupByFC();
    this.getOrderByFC();
    let exceptionParams = this.commonServices.exceptionFilters;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignExceptionFilters exceptionFilters before assigning values = ", exceptionParams);

    if (this.tierNameFC != 'default') {
      exceptionParams["tierName"] = this.tierNameFC.toString();
      exceptionParams["tierid"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      console.log("data in the tier before assigning..................", this.tierName);
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      exceptionParams["serverName"] = this.serverNameFC;
      exceptionParams["serverid"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      console.log("the value inside the sever ;lost is ..........", this.serverList);
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      exceptionParams["appName"] = this.appNameFC;
      exceptionParams["appid"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    // exceptionParams["flowPathInstance"] = 
    if (this.strTime !== null && this.strTime !== undefined) {
      exceptionParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }

    if (this.endTime !== null && this.endTime !== undefined) {
      exceptionParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }
    if (this.selectedFailureNameId != "" && this.selectedFailureNameId != undefined) {
      exceptionParams["statusCode"] = this.selectedFailureNameId;
      exceptionParams["statusCodeFC"] = this.selectedFailureName;
    }
    else {
      exceptionParams["statusCode"] = -2;
      exceptionParams["statusCodeFC"] = "";
    }

    if (this.selectedUrl != undefined && this.selectedUrl.name !== undefined) {
      exceptionParams["url"] = this.selectedUrl.name;
      exceptionParams["nsUrlIdx"] = this.selectedUrl.id;
    }
    else if (this.checkedUrl === false) {
      exceptionParams["url"] = 'NA';
      exceptionParams["nsUrlIdx"] = 'NA';
    }

    exceptionParams["page"] = this.page;

    if (this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined)
      exceptionParams["script"] = this.selectedScript.name;
    else if (this.checkedScript === false)
      exceptionParams["script"] = 'NA';

    if (this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined)
      exceptionParams["transaction"] = this.selectedTransaction.name;
    else if (this.checkedTransaction === false)
      exceptionParams["transaction"] = 'NA';

    if (this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined)
      exceptionParams["location"] = this.selectedLocation.name;
    else if (this.checkedLocation === false)
      exceptionParams["location"] = 'NA';

    if (this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined)
      exceptionParams["access"] = this.selectedBrowser.name;
    else if (this.checkedBrowser === false)
      exceptionParams["access"] = 'NA';

    if (this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined)
      exceptionParams["browser"] = this.selectedAccess.name;
    else if (this.checkedAccess === false)
      exceptionParams["browser"] = 'NA';

    if (this.selectedException != undefined && this.selectedException.id !== null && this.selectedException.id !== undefined) {
      exceptionParams["excClassId"] = this.selectedException.id;
      exceptionParams["excClassIdFC"] = this.selectedException.name;
      reportUI['ExcclassIdFC'] = this.selectedException.name;
      reportUI['ExcClassId'] = this.selectedException.id;
    }
    else if (this.selectedExceptionClass === false) {
      exceptionParams["excClassId"] = 'NA';
      exceptionParams["excClassIdFC"] = 'NA';
    }

    if (this.selectedExceptionThrowingClass != undefined && this.selectedExceptionThrowingClass.id !== null && this.selectedExceptionThrowingClass.id !== undefined) {
      exceptionParams["excThrowingClassId"] = this.selectedExceptionThrowingClass.id;
      exceptionParams["excThrowingClassIdFC"] = this.selectedExceptionThrowingClass.name;
      reportUI['ExcThrowingClassIdFC'] = this.selectedExceptionThrowingClass.name;
      reportUI['ExcThrowingClassId'] = this.selectedExceptionThrowingClass.id;
    }
    else if (this.selectedThrowingClass === false) {
      exceptionParams["excThrowingClassId"] = 'NA';
      exceptionParams["excThrowingClassIdFC"] = 'NA';
    }

    if (this.selectedExceptionThrowingMethod != undefined && this.selectedExceptionThrowingMethod.id !== null && this.selectedExceptionThrowingMethod.id !== undefined) {
      exceptionParams["excThrowingMethodId"] = this.selectedExceptionThrowingMethod.id;
      exceptionParams["excThrowingMethodIdFC"] = this.selectedExceptionThrowingMethod.name;
      reportUI['ExcThrowingMethodIdFC'] = this.selectedExceptionThrowingMethod.name;
      reportUI['ExcThrowingMethodId'] = this.selectedExceptionThrowingMethod.id;
    }
    else if (this.selectedThrowingMethod === false) {
      exceptionParams["excThrowingMethodId"] = 'NA';
      exceptionParams["excThrowingMethodIdFC"] = 'NA';
    }

    if (this.selectedStack != undefined && this.selectedStack !== null) {
      exceptionParams["excStackTraceName"] = this.selectedStack;
      reportUI['ExcStackTraceName'] = this.selectedStack;
    }
    else if (this.selectedStackTrace === false) {
      exceptionParams["excStackTraceName"] = '';
    }

    if (this.selectedExceptionCauseType != undefined && this.selectedExceptionCauseType.id !== null && this.selectedExceptionCauseType.id !== undefined) {
      exceptionParams["excCauseId"] = this.selectedExceptionCauseType.id;
      exceptionParams["excCauseIdFC"] = this.selectedExceptionCauseType.name;
      reportUI["ExcCauseIdFC"] = this.selectedExceptionCauseType.name;
      reportUI['ExcCauseId'] = this.selectedExceptionCauseType.id;
    }
    else if (this.selectedExceptionCause === false) {
      exceptionParams["excCauseId"] = 'NA';
      exceptionParams["excCauseIdFC"] = 'NA';
    }

    if (this.selectedExceptionMessageType != undefined && this.selectedExceptionMessageType.id !== null && this.selectedExceptionMessageType.id !== undefined) {
      exceptionParams["excMsgId"] = this.selectedExceptionMessageType.id;
      exceptionParams["excMsgIdFC"] = this.selectedExceptionMessageType.name;
      reportUI["ExcMsgIdFC"] = this.selectedExceptionMessageType.name;
      reportUI['ExcMsgId'] = this.selectedExceptionMessageType.id;
    }
    else if (this.selectedExceptionMessage === false) {
      exceptionParams["excMsgId"] = 'NA';
      exceptionParams["excMsgIdFC"] = 'NA';
    }

    if (this.selectedGroupBy.length == 0) //uncheck case or default case
    {
      exceptionParams["groupby"] = 'excclass';
      exceptionParams["groupByFC"] = 'Exception Class';

    }
    else {
      exceptionParams["groupby"] = this.selectedGroupBy;
      exceptionParams["groupByFC"] = this.groupByFC.toString();
      reportUI['Group'] = this.selectedGroupBy;

    }
    if (this.checkOrder == false) {
      exceptionParams["orderby"] = '';
      exceptionParams["orderByFC"] = '';
    }

    if (this.selectedOrderBy !== null && this.selectedOrderBy !== undefined && this.selectedOrderBy != []) {
      exceptionParams["orderby"] = this.selectedOrderBy;
      exceptionParams["orderByFC"] = this.orderByFC.toString();
      reportUI['Order'] = this.selectedOrderBy;
    }

    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      exceptionParams['pubicIP'] = this.selectedDC.pubicIP
      exceptionParams['publicPort'] = this.selectedDC.publicPort
      exceptionParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      exceptionParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      exceptionParams['pubicIP'] = ''
      exceptionParams['publicPort'] = ''
      exceptionParams['ndeTestRun'] = ''
      exceptionParams['ndeProtocol'] = ''
    }
    console.log(" method - assignExceptionFilters fpFilters after assigning values = ", exceptionParams);
    this.commonServices.exceptionFilters = exceptionParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
  }

  assignDBFilters() {
    this.commonServices.isFromCQM=true;
    let reportUI = {};
    let dbParams = this.commonServices.dbFilters;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignDBFilters dbFilters before assigning values = ", dbParams);

    if (this.tierNameFC != 'default') {
      dbParams["tierName"] = this.tierNameFC.toString();
      dbParams["tierId"] = this.tierId.toString();
      reportUI['tierName'] = this.tierNameFC.toString();
      reportUI['tierId'] = this.tierId.toString();
      reportUI['checkedTier'] = this.selectedTier;
    }

    if (this.serverNameFC != 'default') {
      dbParams["serverName"] = this.serverNameFC;
      dbParams["serverId"] = this.serverId.toString();
      reportUI['serverName'] = this.serverNameFC.toString();
      reportUI['serverId'] = this.serverId.toString();
      reportUI['checkedServer'] = this.selectedServer;
      reportUI['ServerList'] = this.serverList;
    }

    if (this.appNameFC != 'default') {
      dbParams["appName"] = this.appNameFC;
      dbParams["appId"] = this.appId.toString();
      reportUI['appName'] = this.appNameFC.toString();
      reportUI['appId'] = this.appId.toString();
      reportUI['checkedApp'] = this.selectedApp;
      reportUI['AppList'] = this.appList;
    }

    dbParams["flowpathInstance"] = this.fpInstance;
    reportUI['FlowpathID'] = this.fpInstance;

    //No need as in query ,by default group is tier server instance and  query will apply
    //  if((this.fpInstance == "" ||  this.fpInstance == undefined) && !this.commonServices.isValidParamInObj(dbParams, "strGroup") )
    //    dbParams["strGroup"] ='tier';


    if (this.selectedBuisnessTransaction != undefined) {
      if (this.selectedBuisnessTransaction.name !== undefined) {
        dbParams["urlName"] = this.selectedBuisnessTransaction.name;
        dbParams["urlIdx"] = this.selectedBuisnessTransaction.id;
        reportUI["urlName"] = this.selectedBuisnessTransaction.name;
        reportUI["urlIndex"] = this.selectedBuisnessTransaction.id;
      }
      else if (this.checkedBuisnessTransaction === false)  //if someone uncheck BT Filter, pass NA (means remove that filter)
      {
        dbParams["urlName"] = 'NA';
        dbParams["urlIdx"] = 'NA';
      }
    }


    if (this.selectedBTCategory != undefined) {
      dbParams["btcategoryId"] = this.selectedBTCategory;
      reportUI["BtCategory"] = this.selectedBTCategory;
    }
    if (this.strTime !== null && this.strTime !== undefined) {
      dbParams["strStartTime"] = this.strTime;
      reportUI['checkedTimeFIlter'] = this.timeFilter;
      reportUI['startTime'] = this.strTime;
      reportUI['selectedTime'] = this.selectedTime;
    }

    if (this.endTime !== null && this.endTime !== undefined) {
      dbParams["strEndTime"] = this.endTime;
      reportUI['EndTime'] = this.endTime;
    }
    if (this.selectedUrl != undefined && this.selectedUrl.name !== undefined) {
      dbParams["url"] = this.selectedUrl.name;
      dbParams["nsUrlIdx"] = this.selectedUrl.id;
    }
    else if (this.checkedUrl === false) {
      dbParams["url"] = 'NA';
      dbParams["nsUrlIdx"] = 'NA';
    }

    dbParams["page"] = this.page;

    if (this.selectedScript != undefined && this.selectedScript.name !== null && this.selectedScript.name !== undefined)
      dbParams["script"] = this.selectedScript.name;
    else if (this.checkedScript === false)
      dbParams["script"] = 'NA';

    if (this.selectedTransaction != undefined && this.selectedTransaction.name !== null && this.selectedTransaction.name !== undefined)
      dbParams["transaction"] = this.selectedTransaction.name;
    else if (this.checkedTransaction === false)
      dbParams["transaction"] = 'NA';

    if (this.selectedLocation != undefined && this.selectedLocation.name !== null && this.selectedLocation.name !== undefined)
      dbParams["location"] = this.selectedLocation.name;
    else if (this.checkedLocation === false)
      dbParams["location"] = 'NA';

    if (this.selectedBrowser != undefined && this.selectedBrowser.name !== null && this.selectedBrowser.name !== undefined)
      dbParams["browser"] = this.selectedBrowser.name;
    else if (this.checkedBrowser === false)
      dbParams["browser"] = 'NA';

    if (this.selectedAccess != undefined && this.selectedAccess.name !== null && this.selectedAccess.name !== undefined)
      dbParams["access"] = this.selectedAccess.name;
    else if (this.checkedAccess === false)
      dbParams["access"] = 'NA';

    if (this.selectedTopNQuery != undefined && this.selectedTopNQuery !== null) {
      dbParams['topNQueries'] = this.selectedTopNQuery;
      reportUI['TopNQueries'] = this.selectedTopNQuery;
      console.log("The value of the topNqueries inside the db report is", this.selectedTopNQuery);
    }
    if (this.selectedDbOrderBy != undefined && this.selectedDbOrderBy != []) {
      dbParams['strOrderBy'] = this.selectedDbOrderBy;
      reportUI['DBOrderBy'] = this.selectedDbOrderBy;
    }
    else if (this.selectedDbOrderBy == [])
      dbParams['strOrderBy'] = 'exec_time_desc';

    console.log("this.dcList--", this.dcList);
    console.log("this.dcList--", this.dcList);
    console.log("this.selectedDC--", this.selectedDC);
    if (this.isMultiDC && this.dcList.length != 0 && this.selectedDC != undefined) {
      dbParams['pubicIP'] = this.selectedDC.pubicIP
      dbParams['publicPort'] = this.selectedDC.publicPort
      dbParams['ndeTestRun'] = this.selectedDC.ndeTestRun
      dbParams['ndeProtocol'] = this.selectedDC.ndeProtocol
    }
    else {
      dbParams['pubicIP'] = ''
      dbParams['publicPort'] = ''
      dbParams['ndeTestRun'] = ''
      dbParams['ndeProtocol'] = ''
    }


    this.commonServices.dbFilters = dbParams;
    this._ddrData.nsCqmAutoFill[this.commonServices.currentReport] = reportUI;
    console.log(" method - assignDBFilters dbFilters after assigning values = ", dbParams);

  }
  next() {
    this.btOffset += this.btLimit;
    if ((this.btLimit + this.btOffset) >= this.btCount) {
      this.nxt = false;
      this.prev = true;
      this.btEndValue = this.btCount;
    } else {
      this.nxt = true;
      this.prev = true;
      this.btEndValue = this.btLimit + this.btOffset;
    }
    this.btInfo();
  }

  previous() {
    this.btOffset -= this.btLimit;
    if (this.btOffset <= 0) {
      this.prev = false;
      this.nxt = true;
      this.btEndValue = this.btLimit;
    } else {
      this.prev = true;
      this.nxt = true;
      this.btEndValue = this.btLimit + this.btOffset;
    }
    this.btInfo();
  }
  enableOrderBy() {
    if (this.showNSFilter)
      return false;
    else {
      if (this.checkGroup == true && this.selectedGroupBy.length > 0)
        return false;
    }
  }
  enableGroupBy() {
    if (this.commonServices.currentReport == "Transaction Instance" || this.commonServices.currentReport == "Session Instance"
      || this.commonServices.currentReport == "Page Instance" || this.commonServices.currentReport == "URL Instance") {
      return true;
    }
    else
      return false;

  }
  validateTransactionCheck() {
    this.selectTransactionCheckBoxFlag = false;
    if (this.checkedTransaction) {
      this.getTransactionInfo();
    }
    else {
      this.transLimit = 8;
      this.transOffset = 0;
      this.showTransactionPagination = false;
      this.selectedTransaction = {};
    }
  }
  validateScriptCheck(change?) {
    this.selectScriptCheckBoxFlag = false;
    this.selectPageCheckBoxFlag = false;
    this.selectUrlCheckBoxFlag = false;
    if (this.checkedScript || change)   // will work if the value has been changed or chekc box got selected 
    {                                   // also if the value or script is changed unselect the page and url
      this.scriptGroup = true;
      this.checkedUrl = false;
      this.checkedPage = false;
      this.selectPageCheckBoxFlag = false;
      this.selectUrlCheckBoxFlag = false;
      this.getScriptInfo();

      //adds group by session 
      if (this.checkedScript /*&& this.selectedScript*/ && this.commonServices.currentReport.indexOf("Instance") == -1)   // in case user
      {
        console.log("inside group ***");
        this.scriptGroup = true;
        this.getGroupBy();
        if (this.groupByFilter.indexOf("session") == -1) //i.e push once only
          this.groupByFilter.push("session");
      }

    }
    else {
      this.groupByFilter = []; //group array  directly setting it false cz it will unselect page filter therfore removing every elemet from array.
      this.scriptGroup = false;                   // setting group by option false in case if user havennt selected anyother value in group by.

      // for unselecting everything in case script filer has been unselcted
      this.selectedScript = {};
      this.checkedUrl = false;
      this.checkedPage = false;
      this.selectedUrl = {};
      this.selectedPage = undefined;
    }

  }
  validatePageCheck(change?) {
    this.selectPageCheckBoxFlag = false;
    this.selectUrlCheckBoxFlag = false;
    // if value of page has been changed unselect the value of page.
    if (this.checkedPage || change) {
      this.scriptGroup = true;
      this.checkedUrl = false;
      this.selectedUrl = {};
      this.getPageInfo();
      this.selectUrlCheckBoxFlag = false;
      if (this.groupByFilter.indexOf("session") == -1 && this.commonServices.currentReport.indexOf("Instance") == -1)
        this.groupByFilter.push("page");   //incase page was selected but script was not

    }
    else {
      this.selectedPage = undefined;    // made undefined cz of a condition in apply filter method confilcting in case i set ={}


      if (this.scriptGroup) {
        if (this.checkedScript == false && this.checkedPage == false) {
          this.groupByFilter = [];
        }
        else if (this.checkedPage == false) //page has been unselcted
        {
          this.groupByFilter = this.groupByFilter.filter(val => { return val != "page" }) //removes page from array.
        }
      }

      // on apply button a fucntion callled applyComonParam || apylURLFilter is called and there we will merge this group filter array and the actual group UI filter array and if user has selcted session in UI 
      //and script filter was selcted then it means new merged array will have 2 session value there we will filter array once more to get all the unique value.

      this.showPagePagination = false;
      this.pageLimit = 8;
      this.pageOffset = 0;
    }
    console.log("validate page********")


  }
  validateUrlCheck() {
    this.selectUrlCheckBoxFlag = false;
    if (this.checkedUrl) {
      if (this.checkedPage && this.checkedScript)
        this.getUrlInfo(this.selectedPage, this.selectedScript); //inscase page and script were selcted before going to slect url.
      else if (this.checkedScript) {
        this.getUrlInfo(undefined, this.selectedScript);// inscase only script was selcted
      }
      else if (this.checkedPage) {
        this.getUrlInfo(this.selectedPage, undefined);
      }
      else
        this.getUrlInfo();

    }
    else {
      this.urlLimit = 8;
      this.urlOffset = 0;
      this.urlEndValue = 0;
      this.showUrlPagination = false;
      this.selectedUrl = {};
    }

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.commonServices.isToLoadSideBar = false;
    if (this.nsAutoFillSubscribe$ && !this.nsAutoFillSubscribe$.closed) {
      this.nsAutoFillSubscribe$.unsubscribe();
    }


  }

  saveQuery() { //save query support for only Summary Report's
    let autoFill = {};
    let pattern = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (this.queryName == '') {
      this.showQueryError = false;
      console.error("enter query Name");
      this.showSaveError = true;
    }
    else if (!this.queryName.match(pattern)) {
      this.showSaveError = false;
      console.error("Please enter valid parameter name");
      this.showQueryError = true;
    }
    else {
      let msg = 'Query saved for ' + this.commonServices.currentReport + ' Report Successfully';
      this._ddrData.setInLogger('DDR::CQM_SaveQuery', this.commonServices.currentReport, 'CQM_Save_Query', msg);
      this._ddrData.saveMessage = this.queryName;
      if (this.commonServices.currentReport == "Transaction Summary") {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.nsTransactionSummary, autoFill);
      }
      if (this.commonServices.currentReport == "Session Summary") {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.nsSessionSummary, autoFill);
      }
      if (this.commonServices.currentReport == "URL Summary") {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.nsURLSummary, autoFill);
      }
      if (this.commonServices.currentReport == "Page Summary") {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.nsPageSummary, autoFill);
      }

      if (this.commonServices.currentReport == 'DB Report') {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.dbFilters, autoFill);
      }

      if (this.commonServices.currentReport == 'DBGroupBy') {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.dbGroupByFilters, autoFill);
      }

      if (this.commonServices.currentReport == 'Exception') {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.exceptionFilters, autoFill);
      }

      if (this.commonServices.currentReport == 'Method Timing') {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.methodTimingFilters, autoFill);
      }

      if (this.commonServices.currentReport == 'Hotspot') {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.hotspotFilters, autoFill);
      }

      if (this.commonServices.currentReport == 'IP Summary') {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.ipSummaryFilters, autoFill);
      }

      if (this.commonServices.currentReport == "FlowpathGroupBy") {
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.fpGroupByFilters, autoFill);
      }

      if (this.commonServices.currentReport == "Flowpath") {
        console.log("Data in the fpFilters ................", this.commonServices.fpFilters);
        autoFill = this._ddrData.nsCqmAutoFill[this.commonServices.currentReport];
        console.log("Data in autoFill...............", autoFill);
        this.saveUserDefinedQueries(this.queryName, this.urlParam.testRun, this.addDescription, this.commonServices.fpFilters, autoFill);
      }
      this.commonServices.closeUISideBar$.next();
      this.showSaveError = false;
      this.showQueryError = false;
    }
    this.queryName = '';
    this.addDescription = '';
  }

  saveUserDefinedQueries(queryName, testRun, description, data, autoFill) {

    if (this._ddrData.editQuery == false) {
      if (this.confirmUniqeQuery(queryName)) //incase same query name exist
      {
        this._ddrData.sendMessage$.next("Query Already Defined");
        return;
      }
    }

    if (description.includes("|") || queryName.includes("|")) {
      this._ddrData.sendMessage$.next("Please Remove '|' from description");

    }
    else {
      let product = sessionStorage.getItem('productType');
      if (product)
        product = product.toLowerCase();
      console.log('&openReport=  ', this.commonServices.currentReport);
      let currReport = this.commonServices.currentReport;
      let userName = "";
      if (localStorage['userName'])
        userName = localStorage['userName'];
      else
        userName = sessionStorage['sesLoginName']
      let url = this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/UserDefinedQueries?testRun=' + testRun + "&saveQuery=true&showQuery=undefined&deleteQuery=undefined&showQueryData=undefined" + "&queryName=" + queryName + "&description=" + description + "&queryData=" + JSON.stringify(data) + "&queryAutofill=" + JSON.stringify(autoFill) + "&user=" + userName + '&openReport=' + currReport;
      if (this._ddrData.editQuery == true)
        url += "&modify=true";
      this.ddrRequest.getDataUsingGet(url).subscribe(rest => {
        this.savedQueriesObject = rest['data'];
        this._ddrData.sendMessage$.next("Query Saved");
        console.log(this.savedQueriesObject, "************************************");

        //sendig show query request to update the queryname list for all the queries user have just saved so that multiple save would be restricted.
        url = this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/UserDefinedQueries?testRun=' + testRun + "&saveQuery=undefined&showQuery=true&deleteQuery=undefined"
        this.ddrRequest.getDataUsingGet(url).subscribe(rest => {
          this._ddrData.savedQueryName = rest['queryName'];
        });

      },
        error => {
          this._ddrData.sendMessage$("Error While Saving Query");
        }
      );


    }
  }

  confirmUniqeQuery(queryName: any) {
    console.log("this._ddrData.savedQueryName ", this._ddrData.savedQueryName, " queryName ", queryName);
    //this._ddrData.savedQueryName.includes(queryName)
    if (this._ddrData.savedQueryName && this._ddrData.savedQueryName.includes(queryName))
      return true;
    else
      return false;
  }

}

