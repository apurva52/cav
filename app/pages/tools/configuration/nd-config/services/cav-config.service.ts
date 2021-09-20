import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import { WdInputs } from '../container/wd-inputs';
// import { DashboardDataCache } from '../container/dashboard-data-cache';
// import { DashboardTrendCompare } from '../container/dashboard-trend-compare';
// import { CavTestRunFilterCache } from '../container/cav-test-run-filter-cache';

@Injectable()
export class CavConfigService {
	allfeaturePermissionList: any;

	private protocol = 'http';
	private host = window.location.hostname;
	private port = window.location.port;
	private productName = 'netstorm';
	private productType = '';
	private userName: string = null;
	private userType = 'Engineer';
	private userRole = 'Standard';
	private userGroup = 'netstorm';
	private serverIP: string = null;
	private appPath: string = null;
	private serverType = '';
	private serverTitle = '';
	private productMode = '';
	private timeZone = 'IST';
        private timeZoneId = 'Asia/Kolkata';
	private workPath = '';
	private openDashboardInTab = true;
	private dashboardTestRun: number = -1;
	private dashboardStartedBy: string = null;
	private dashboardReportTestRun: number = -1;
	dashboardTestRunPermission:string = "";
        private WdinputsforDdr : any;
	private selectedDataCenter = 'ALL';
	private dcInfoArr: any[] = [];
	private aggregateDCString = '';
	private nonAggDCString = '';
	private controllerName = '';
	private serialNumberOfServer = '';
	public clientConnectionKey = null;
	wdExternalInputs = null;
        private	wdOpenOnStart = false;
	private dashboardDataCache = null;
	private aclAccessRight: string;
	private testRunAccessPrivileges: any;
	private _EDParam: {
		testRun?: string,
		graphKey?: string,
		graphKeyLabel?: string,
		startTime?: string,
		endTime?: string,
		eventDay?: string,
		isDiscontGraph?: boolean,
		dcName?: string[],
		isAllDC?: boolean,
		multidc_mode?: boolean,
		isFreshOpen?: boolean
	} = {
		testRun: sessionStorage.EDTestrun && !isNaN(sessionStorage.EDTestrun)?sessionStorage.EDTestrun:sessionStorage.runningtest,
		graphKey: sessionStorage.appliedEDGraphTime && sessionStorage.appliedEDGraphTime != "undefined"?sessionStorage.appliedEDGraphTime:"Last_60_Minutes",
		graphKeyLabel: sessionStorage.appliedEDGraphTimeLabel && sessionStorage.appliedEDGraphTimeLabel != "undefined"?sessionStorage.appliedEDGraphTimeLabel:"Last 1 Hour",
		startTime: sessionStorage.appliedEDStartTime,
		endTime: sessionStorage.appliedEDEndTime,
		eventDay: sessionStorage.appliedEDEventDay,
		isDiscontGraph: sessionStorage.appliedEDDiscGraph,
		dcName: sessionStorage.EDSelectedDCList && sessionStorage.EDSelectedDCList != "undefined"?sessionStorage.EDSelectedDCList.split(","):[],
		isAllDC: false,
		multidc_mode: false,
		isFreshOpen: false
	};

	private sessionTestNumChange = new Subject<any>();
	sessionTestNumChange$ = this.sessionTestNumChange.asObservable();

	/* variable to get test run for splash screen */
	testRunForTestInit = {};
	/*variable to get responseof starttest call to use in splash screen */
	scenarioInfoForTestInit ={};
    splashScreenFromDashboard = false;

	resForscen = "";
    /*variable for selected test runs details */
	private testRunDetails: any;
	/*variable for getting selected test run numbers */
	private testRunNumbers = null;
	/*variable for setting compare type. */
	private compareType = 0;
	private dashboardTrendCompare = null;
        private featurePermissionList: any;
 
  /** defining flag for apply Tx deatil either from compare Trend dialog or dashboard compare dialog   */
  	private isTxCompareTrendMode = false;

	private productKey : string;

	private reportOption: any;       // for opening report from test run gui in case of trend
	private isTrendReuse = false;    // setting true if open trend report else false for side by side compare
	private cmpMsrDataJSON: any = [];   // for setting json in case of advance option to open report 

	private edKPIQueryParam: Object = {};
	private edGKPIQueryParam: Object = {};

	private cavTestRunFilterCache = null;
    private isGitIsConfigured:string;

	private isOnlineTest =  false;   //used for checking testrun status in ScirptExecutionLog module.	
    
	  // chart data 
    private chartData = [null,null,null,null,null,null,null,null,null];

	 /**
          * evvironment array
          */
 
    private environmmentarray: any;
	private tierStatusParam: any;
	private refreshScenarioDataOnGitRefresh = new Subject<any>();
    refreshScenarioDataOnGitRefresh$ = this.refreshScenarioDataOnGitRefresh.asObservable();
	
	public productsIntegration = new Subject<any[]>();
	/* Service for product integrations*/
	productsIntegration$ = this.productsIntegration.asObservable();

	

	private storeViewParam: any;

    private samlEnabled : boolean = false;
    
	private requestFromExtLink :boolean= false;
        private _isFromEDTransactionTable: object = { };

	// selected app
	private _selectedGeoApp: String;
        private _showAppView: boolean = false;

	/**hashkey used to encript useName and password */
	private hashKeyUserToEncript = 'NA';

	/*used to store server's time stamp of user when it gets login in productUI.* */
	private serverCurrentTime :any; 

	/**used to store client's time stamp of user when it gets login in productUI. */
	private clientTimeStamp: any;

	private progressInterval : number = 10000;

	public updateUserSessionRateObservable = new Subject();
	public $updateUserSessionRateObservable = this.updateUserSessionRateObservable.asObservable();
	private enableNCserver =false;
	constructor() {
		// this.openDashboardInTab = true;
		this.serverIP = '//' + this.host + ':' + this.port + '/';
		this.appPath = this.serverIP + 'ProductUI';
	}

 /* Getting values from session storage if browser refresh happend. */
        public restoreConfiguration() {
                try {
                        console.info('Restoring configuration from session.');

                        this.userName = sessionStorage.getItem('sesLoginName');
                        this.userGroup = sessionStorage.getItem('sessGroupName');
                        this.userType = sessionStorage.getItem('sessUserType');
                        this.userRole = sessionStorage.getItem('sesRole');
                        this.productType = sessionStorage.getItem('strServerType');
                        this.serverTitle = sessionStorage.getItem('sessServerTitle');
                        this.productMode = sessionStorage.getItem('productType');
                        this.workPath = sessionStorage.getItem('workPath');
                        this.productName = sessionStorage.getItem('sessServerTitle');
                        this.timeZone = sessionStorage.getItem('timeZone');
                        this.timeZoneId = sessionStorage.getItem('timeZoneId');
                        this.controllerName = sessionStorage.getItem('controllerName');
                        this.serialNumberOfServer = sessionStorage.getItem('serialNumber');
						this.productKey = sessionStorage.getItem("productKey");
						try{ 
							this.allfeaturePermissionList =JSON.parse( sessionStorage.getItem("featurePermission") );
						}
						catch(e) {
							console.log("error in getting permission from session object ");
						}
					
                        if (sessionStorage.getItem('dashboardTestRun') !== null && sessionStorage.getItem('dashboardTestRun') !== undefined) {
                                this.dashboardTestRun = parseInt(sessionStorage.getItem('dashboardTestRun'), 10);
                                if (sessionStorage.getItem('clientConnectionKey') !== null && sessionStorage.getItem('clientConnectionKey') !== undefined) {
                                        this.clientConnectionKey = sessionStorage.getItem('clientConnectionKey');
                                }
                        }

						let samlEnabled = sessionStorage.getItem("samlEnabled");
                        console.log("samlEnabled" , samlEnabled)
                        if(samlEnabled == "true"){
                                this.samlEnabled = true;
						}
						let ncServerMenu =  sessionStorage.getItem("isEnableNetcloudServerManagement");
						if(ncServerMenu =="true") {
							this.enableNCserver = true;
						}else {
							this.enableNCserver= false;
						}
					
                } catch (e) {
                        console.error('Error in restoring session.');
                        console.error(e);
                }
        }

        public set $tierStatusParam(val: any) {
			this.tierStatusParam = val;
		}
	
		public get $tierStatusParam() {
			return this.tierStatusParam;
		}
	
		public set $eDParam(obj: any) {
			Object.keys(obj).forEach(element => {
				this._EDParam[element] = obj[element]
			})
		}
		public get $eDParam() {
			return this._EDParam;
		}
	
	//changes
	public get $testRunForTestInit() {
		return this.testRunForTestInit;
	}
	public set $testRunForTestInit(value: Object) {
		this.testRunForTestInit = value;
	}
	public getINSPrefixForMssql() {
		return `//${this.host}:${this.port}/tomcat/`;
		}

	public get $scenarioInfoForTestInit() {
		return this.scenarioInfoForTestInit;
	}
	public set $scenarioInfoForTestInit(value: Object) {
		this.scenarioInfoForTestInit = value;
	}

	public get $resForScen() {
		return this.resForscen;
	}
	public set $resForScen(value: string) {
		this.resForscen = value;
	}

	public get $splashScreenFromDashboard(): boolean {
		return this.splashScreenFromDashboard;
	}

	public set $splashScreenFromDashboard(value: boolean) {
		this.splashScreenFromDashboard = value;
	}

       	public get $isTxCompareTrendMode(): boolean {
		return this.isTxCompareTrendMode;
	}

	public set $isTxCompareTrendMode(value: boolean) {
		this.isTxCompareTrendMode = value;
	}

	public get $protocol(): string {
		return this.protocol;
	}

	public set $protocol(value: string) {
		this.protocol = value;
	}
        
         public get $wdOpenOnStart(): boolean{
		return this.wdOpenOnStart;
	}
        public set $wdOpenOnStart(value: boolean){
		  this.wdOpenOnStart = value;
	}

	public get $host(): string {
		return this.host;
	}

	public set $host(value: string) {
		this.host = value;
	}

	public get $port(): string {
		return this.port;
	}

	public set $port(value: string) {
		this.port = value;
	}

	public get $productName(): string {
		return this.productName;
	}

	public set $productName(value: string) {
		this.productName = value;
	}

	public get $userName(): string {
		return this.userName;
	}

	public set $userName(value: string) {
		this.userName = value;
	}

	public get $userType(): string {
		return this.userType;
	}

	public set $userType(value: string) {
		this.userType = value;
	}

	public get $serverIP(): string {
		return this.serverIP;
	}
              /**
      * Getter $WdinputsforDdr
      * @return {any}
      */
       public get $WdinputsforDdr(): any {
               return this.WdinputsforDdr;
       }
     /**
      * Setter $WdinputsforDdr
      * @param {any} value
      */
       public set $WdinputsforDdr(value: any) {
               this.WdinputsforDdr = value;
       }
	public set $serverIP(value: string) {
		this.serverIP = value;
	}

	public set $dashboardDataCache(dashboardDataCache) {
		this.dashboardDataCache = dashboardDataCache;
	}

	public get $dashboardDataCache() {
		return this.dashboardDataCache;
	}

	public get $appPath(): string {
		if (sessionStorage.getItem('isMultiDCMode')) {
			return sessionStorage.getItem('appPathForDC');
		}
		else {
			return this.appPath;
		}
	}

	public set $appPath(value: string) {
		this.appPath = value;
	}

	public get $openDashboardInTab(): boolean {
		return this.openDashboardInTab;
	}

	public set $openDashboardInTab(value: boolean) {
		this.openDashboardInTab = value;
	}

	public get $dashboardTestRun(): number {
		return this.dashboardTestRun;
	}

	public set $dashboardTestRun(value: number) {
		console.log('Opening dashboard with testRun =', value);
		this.dashboardTestRun = value;
		this.sessionTestNumChange.next(value);
		/*On Every new Test Run connection key got reset. */
		this.clientConnectionKey = null;
		/**On Every new Test Run cache is cleared. */
		this.dashboardDataCache = null;
	}

	public get $dashboardStartedBy(): string {
		return this.dashboardStartedBy;
	}

	public set $dashboardStartedBy(value: string) {
		this.dashboardStartedBy = value;
	}

	public get $dashboardTestRunPermission(): string {
		return this.dashboardTestRunPermission;
	}

	public set $dashboardTestRunPermission(value: string) {
		this.dashboardTestRunPermission = value;
	}

	public get $dashboardReportTestRun(): number {
		return this.dashboardReportTestRun;
	}

	public set $dashboardReportTestRun(value: number) {
	    sessionStorage.setItem('dashboardReportTestRun', value+'');
		this.dashboardReportTestRun = value;
	}

	/* using for external link such as copy favorite link */
	public get $wdExternalInputs() {
		return this.wdExternalInputs;
	}

	public set $wdExternalInputs(value) {
		this.wdExternalInputs = value;
	}

	public get $userGroup(): string {
		return this.userGroup;
	}

	public set $userGroup(value: string) {
		this.userGroup = value;
	}

	public get $userRole(): string {
		return this.userRole;
	}

	public set $userRole(value: string) {
		this.userRole = value;
	}

	public get $productType(): string {
		return this.productType;
	}

	public set $productType(value: string) {
		this.productType = value;
	}

	public get $serverType(): string {
		return this.serverType;
	}

	public set $serverType(value: string) {
		this.serverType = value;
	}

	public get $serverTitle(): string {
		return this.serverTitle;
	}

	public set $serverTitle(value: string) {
		this.serverTitle = value;
	}

	public get $productMode(): string {
		return this.productMode;
	}

	public set $productMode(value: string) {
		this.productMode = value;
	}

	public get $timeZone(): string {
		return this.timeZone;
	}

	public set $timeZone(value: string) {
		this.timeZone = value;
	}
        public get $timeZoneId(): string {
		return this.timeZoneId;
	}

	public set $timeZoneId(value: string) {
		this.timeZoneId = value;
	}

	public get $workPath(): string {
		return this.workPath;
	}

	public set $workPath(value: string) {
		this.workPath = value;
	}

	public get $controllerName(): string {
		return this.controllerName;
	}

	public set $controllerName(value: string) {
		this.controllerName = value;
	}
	/**client connection key for the access log */
	public get $clientConnectionKey(): string {
		return this.clientConnectionKey;
	}

	public set $clientConnectionKey(value: string) {
		this.clientConnectionKey = value;
	}

	public get $serialNumberOfServer(): string {
		return this.serialNumberOfServer;
	}

	public set $serialNumberOfServer(value: string) {
		this.serialNumberOfServer = value;
	}

	/* Getter Setter For Multi DC Env  */

	// Prefix for Aggreagte Specific URL's
	public setINSAggrPrefix(url) {
		this.aggregateDCString = url;
	}

	public getINSAggrPrefix() {
		if (sessionStorage.getItem('isMultiDCMode') === undefined || sessionStorage.getItem('isMultiDCMode') === null) {
			return `//${this.host}:${this.port}`;
		} else {
			if (this.getActiveDC() !== 'ALL') {
				return `//${this.host}:${this.port}/tomcat/`;
			}
			return sessionStorage.getItem('INSAggrPrefix');
		}
	}

	// Prefix for Non Aggr Specific URL
	public setINSPrefix(url) {
		this.nonAggDCString = url;
	}

	public getINSPrefix() {
		if (sessionStorage.getItem('isMultiDCMode') === undefined || sessionStorage.getItem('isMultiDCMode') === null)
			return `//${this.host}:${this.port}`;
		else
			return sessionStorage.getItem('INSPrefix');
	}

	/*Setting Active DC*/
	public setActiveDC(dcName) {
		this.selectedDataCenter = dcName;
	}

	public getActiveDC() {
		if (sessionStorage.getItem('isMultiDCMode'))
			return sessionStorage.getItem('activeDC');
		else
			return this.selectedDataCenter;
	}

	/*Setting DC Obj*/
	public setDCInfoObj(dcArrObj) {
		this.dcInfoArr = dcArrObj;
	}
	public getDCInfoObj() {
		return this.dcInfoArr;
	}

	/** Get IP for Selected DC in case of MultiDC else return current host IP */
	public getURLByActiveDC(dc?) {
		try {
			if (sessionStorage.getItem('isMultiDCMode') === undefined)
				return this.serverIP;
			else {
				let dcName = (dc === undefined) ? this.getActiveDC() : dc;

				// In case ALL is selected, open JSP with Master DC IP
				if (dcName === 'ALL') {
					for (let property in this.dcInfoArr) {
						if (this.dcInfoArr[property].isMaster === true) {
							dcName = this.dcInfoArr[property].dc;
							break;
						}
						else
							continue;
					}
				}

				let host = this.dcInfoArr.find((info) => {
					return info.dc === dcName;
				});
				if (host === null || host === undefined) {
				  return this.serverIP;
 				} else {
				  return `${host.protocol}://${host.ip}:${host.port}/`;
				}
			}
		} catch (e) {
			console.log('In method getIPForJSP. Error while getting IP.', e);
			return this.serverIP;
		}
	}
	public get $aclAccessRight(): string {
		return this.aclAccessRight;
	}

	public set $aclAccessRight(value: string) {
		this.aclAccessRight = value;
	} 

	public get $testRunAccessPrivileges(): any {
		return this.testRunAccessPrivileges;
	}

	public set $testRunAccessPrivileges(value: any) {
		this.testRunAccessPrivileges = value;
	}

	public get $testRunDetails(): any {
		return this.testRunDetails;
	}

	public set $testRunDetails(value: any) {
		this.testRunDetails = value;
	}

	public get $testRunNumbers(): any {
		return this.testRunNumbers;
	}

	public set $testRunNumbers(value: any) {
		this.testRunNumbers = value;
	}

	public get $compareType(): number {
		return this.compareType;
	}

	public set $compareType(value: number) {
		this.compareType = value;
	}

	public set $dashboardTrendCompare(dashboardTrendCompare) {
		this.dashboardTrendCompare = dashboardTrendCompare;
	}

	public get $dashboardTrendCompare() {
		return this.dashboardTrendCompare;
	}
   
        public getTestRunForDC(dcName) {
	  let trNum;
	   if (dcName === 'ALL') 
  	   {
		for(var  i= 0 ; i < this.dcInfoArr.length ; i++) {
                  if(this.dcInfoArr[i].isMaster == true){
                    trNum = this.dcInfoArr[i].testRun;
                    break;
                  }
                }
		
          } else {
 		for(var  i= 0 ; i < this.dcInfoArr.length ; i++) {
		  if(this.dcInfoArr[i].dc == dcName){ 
		    trNum = this.dcInfoArr[i].testRun;
		    break;
		  }
		}
	  }	   
	  console.log("Method: getTestRunForDC. DC Name: ", dcName, ". DC Info Arr = ", this.dcInfoArr, ". TR = ", trNum); 
	  return parseInt(trNum);
       }
       
        public set $featurePermissionList(data: any) {
                this.featurePermissionList = data;
        }

        public get $featurePermissionList(): any{
                return this.featurePermissionList;
        }
   public get $productKey(): string {
		return this.productKey;
	}

	public set $productKey(value: string) {
		this.productKey = value;
	}

	public set $reportOption(value: any) {
		this.reportOption = value;
	}

	public get $reportOption(): any{
		return this.reportOption;
	}

	public set $isTrendReuse(value: boolean) {
		this.isTrendReuse = value;
	}

	public get $isTrendReuse(): boolean{
		return this.isTrendReuse;
	}   
	
	public set $cmpMsrDataJSON(value: any) {
		this.cmpMsrDataJSON = value;
	}

	public get $cmpMsrDataJSON(): any {
		return this.cmpMsrDataJSON;
	}

        /**For ED */
	public set $edKPIQueryParam(value: any) {
		this.edKPIQueryParam = value;
	}

	public get $edKPIQueryParam(): any {
		return this.edKPIQueryParam;
	}

	public set $edGKPIQueryParam(value: any) {
		this.edGKPIQueryParam = value;
	}

	public get $edGKPIQueryParam(): any {
		return this.edGKPIQueryParam;
	}
          public set $isGitIsConfigured(value: string) {
                this.isGitIsConfigured = value;
        }

    public get $isGitIsConfigured(): string {
                return this.isGitIsConfigured;
        }

	public updateScenarioData(value:string){
          this.refreshScenarioDataOnGitRefresh.next(value);
        }

	public set $cavTestRunFilterCache(cavTestRunFilterCache) {
		this.cavTestRunFilterCache = cavTestRunFilterCache;
	}

	public get $cavTestRunFilterCache() {
		return this.cavTestRunFilterCache;
	}

        public set $isOnlineTest(value:any){
                this.isOnlineTest = value;
        }

        public get $isOnlineTest():any{
                return this.isOnlineTest;
        }
	
        public set $chartData(val: any) {
                this.chartData = val;
        }
       
        public get $chartData() {
                return this.chartData;
        }
       
        public set $environmmentarray(val: any) {
                this.environmmentarray = val;
        }
       
        public get $environmmentarray() {
                return this.environmmentarray;
        }

	public set $storeViewParam(val: any) {
                sessionStorage.setItem('storeViewParam',JSON.stringify(val));
		this.storeViewParam = val;
  	}
 
	public get $storeViewParam() {
		return this.storeViewParam;
	}

       /**
     * Getter $samlEnabled
     * @return {boolean}
     */
	public get $samlEnabled(): boolean {
		return this.samlEnabled;
	}

    /**
     * Setter $samlEnabled
     * @param {boolean} value
     */
	public set $samlEnabled(value: boolean) {
		this.samlEnabled = value;
	}


    /**
     * Getter $requestFromExtLink
     * @return {boolean}
     */
	public get $requestFromExtLink(): boolean {
		return this.requestFromExtLink;
	}

    /**
     * Setter $requestFromExtLink
     * @param {boolean} value
     */
	public set $requestFromExtLink(value: boolean) {
		this.requestFromExtLink = value;
	}

       get isFromEDTransactionTable(){
		return this._isFromEDTransactionTable;
	}

	set isFromEDTransactionTable(value: any){
		this._isFromEDTransactionTable = value;
	}

	set selectedGeoApp(value:any){
		this._selectedGeoApp = value;
	}

	get selectedGeoApp(){
		return this._selectedGeoApp;
	}

        set showAppView(value: any) {
                this._showAppView = value;
        }

        get showAppView() {
                return this._showAppView;
        }

	public get $hashKeyUserToEncript(): string {
		return this.hashKeyUserToEncript;
	}

	public set $hashKeyUserToEncript(value: string) {
		this.hashKeyUserToEncript = value;
	}

	public set $serverCurrentTime(value: any) {
		this.serverCurrentTime = value;
	}

	public get $serverCurrentTime(): any{
		return this.serverCurrentTime;
	}
	public set $clientTimeStamp(value: any) {
		this.clientTimeStamp = value;
	}

	public get $clientTimeStamp(): any{
		return this.clientTimeStamp;
	}	


	  public set $allfeaturePermissionList(data: any) {
                this.allfeaturePermissionList = data;
        }

        public get $allfeaturePermissionList(): any{
                return this.allfeaturePermissionList;
		}
		
			public set $progressInterval(value: any) {
		this.progressInterval = value;
	}

	public get $progressInterval(): any{
		return this.progressInterval;
	}

	public emitUpdateUserSessionRateObservable(){
		this.updateUserSessionRateObservable.next();
	}
	
	
	/* Getter $enableNCserver
	* @return {Boolean }
	*/
   public get $enableNCserver(): boolean  {
	   return this.enableNCserver;
   }
/**
	* Setter $enableNCserver
	* @param {Boolean } value
	*/
   public set $enableNCserver(value: boolean ) {
	   this.enableNCserver = value;
	}

}

