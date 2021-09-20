import { Injectable } from '@angular/core';
import { CavConfigService } from './cav-config.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CavTopPanelNavigationService } from './cav-top-panel-navigation.service';
import { GETUIDETAILS } from '../constants/db-monitoring-restApi.constants';
import { GETUIDETAILSBKP } from '../constants/db-monitoring-restApi.constants';
import { DBQUERYSTATS_GET_DBSOURCES_STATUS , DB_MONITORING} from '../constants/db-monitoring-restApi.constants';


@Injectable()
export class SqlQueryService {
	private sql_host: String = '10.10.50.10';
	private sql_port = 8090;
	private sql_clientConnectionKey: String = '';
	private sql_productName: String = 'netstorm';
	private sql_userName: String = null;
	private sql_testRun: String = '';
	private sql_startTime: number;


	private sql_endTime: number;
	private selectedPreset: String = 'Last 1 Hour';
	private selectedViewBy: String = '1 Min';
	private startDate: String;
	private endDate: String;
	private startTime: String;

	private endTime: String;
	public activePage: string;
	private dataSource: String = '';
	private isDrillDownQuery: boolean;
	private drillDownIP: string;

	private drillDownQuery: String = '';

	public isOnlineTest: boolean;

	public sqlProgressInterval: any;
	private sqlRealTimePermission: boolean;
	public isJsPlumbPlan = true;
	public mssqlFields: string;
	public postgressAction = 'DASHBOARD';
	public  sqlDbServerList: any;
	private queryCount:number=20;
  private queryBasis:string='I/O';
  private _dbMonitorUIJson = [];
  private globalId:any = -1;
	windowWidth = window.innerWidth - 22 + 'px';
  private isAggrigationFromConfig: boolean;
	private dbListAvailable = new Subject<boolean>();
	dbListAvailableObservable$ = this.dbListAvailable.asObservable();
		
	 /**Observable used to send response from one component to another*/
  public sendBroadcaster = new Subject<any>();

   /*Service Observable for getting Tier name*/
  receiveProvider$ = this.sendBroadcaster.asObservable();
	/**  used observer to sending activeServerList */
	public sendActiveServerList = new Subject<any>();
	receiveActiveServerList$ = this.sendActiveServerList.asObservable();

	/**BroadCaster */
	public dataAvail = new Subject<any>();
	dataAsObserbale$ = this.dataAvail.asObservable();

	public dataSouceInfo = new Subject<any>();
	dataSouceInfo$ = this.dataSouceInfo.asObservable();

	public messageSub = new Subject<any>();
	messageSub$ = this.messageSub.asObservable();
	databaseType = 0;
	thresoldAvg = 10;
	thresoldHigh = 60;
	postgrestThresoldAvg = 10;
	postgrestThresoldHigh = 60;
	isRequestFromDrillDown = false;
	selectedDB = 'MSSQL';
	public activeServerList: any;
	activeServerSuscription: any;

	arrWaitType = [];
	buttonValue: boolean = false;
	presetOptions: any;
	constructor(private _productConfig: CavConfigService,
		private http: HttpClient,
		private _navService: CavTopPanelNavigationService) {
		/* Initializing configuration with product ui configuration. */
		this.sql_userName = this._productConfig.$userName;
		this.sql_host = this._productConfig.$host;
		this.sql_port = parseInt(this._productConfig.$port, 10);
		this.sql_productName = this._productConfig.$productName;
		this.sql_testRun = this._productConfig.$dashboardTestRun + '';
		this.sql_clientConnectionKey = this._productConfig.$clientConnectionKey;
	}

    /**
     * Getter $isAggrigationFromConfig
     * @return {boolean}
     */
	public get $isAggrigationFromConfig(): boolean {
		return this.isAggrigationFromConfig;
	}
	    /**
     * Setter $isAggrigationFromConfig
     * @param {boolean} value
     */
		public set $isAggrigationFromConfig(value: boolean) {
			this.isAggrigationFromConfig = value;
		}

		 /**
     * Getter $isRequestFromDrillDown
     * @return {boolean}
     */
	public get $isRequestFromDrillDown(): boolean {
		return this.isRequestFromDrillDown;
	}
	    /**
     * Setter $isRequestFromDrillDown
     * @param {boolean} value
     */
		public set $isRequestFromDrillDown(value: boolean) {
			this.isRequestFromDrillDown = value;
	  }

	public get $startDate(): any {
		return this.startDate;
	}

	public set $startDate(value: any) {
		this.startDate = value;
	}

	public get $endDate(): any {
		return this.endDate;
	}

	public set $endDate(value: any) {
		this.endDate = value;
	}

	public get $startTime(): any {
		return this.startTime;
	}

	public set $startTime(value: any) {
		this.startTime = value;
	}

	public get $activePage(): any {
		return this.activePage;
	}

	public set $activePage(value: any) {
		this.activePage = value;
	}

	public get $endTime(): any {
		return this.endTime;
	}

	public set $endTime(value: any) {
		this.endTime = value;
	}


	public get $sql_productName(): String {
		return this.sql_productName;
	}

	public set $sql_productName(value: String) {
		this.sql_productName = value;
	}


	public get $sql_testRun(): String {
		return this.sql_testRun;
	}

	public set $sql_testRun(value: String) {
		this.sql_testRun = value;
	}

	public get $sql_userName(): String {
		return this.sql_userName;
	}

	public set $sql_userName(value: String) {
		this.sql_userName = value;
	}

	public get $sql_host(): String {
		return this.sql_host;
	}

	public set $sql_host(value: String) {
		this.sql_host = value;
	}

	public get $sql_port(): number {
		return this.sql_port;
	}

	public set $sql_port(value: number) {
		this.sql_port = value;
	}

	public get $sql_clientConnectionKey(): String {
		return this.sql_clientConnectionKey;
	}

	public set $sql_clientConnectionKey(value: String) {
		this.sql_clientConnectionKey = value;
	}

	public getSqlStartTime(): number {
		return this.sql_startTime;
	}

	public setSqlStartTime(value: number) {
		this.sql_startTime = value;
	}

	public getSqlEndTime(): number {
		return this.sql_endTime;
	}

	public setSqlEndTime(value: number) {
		this.sql_endTime = value;
	}
	public isOnlineTestRun() {
		return this.isOnlineTest;
	}

	public getSqlProgressInterval() {
		return this.sqlProgressInterval;
	}


	public get $selectedPreset(): any {
		return this.selectedPreset;
	}

	public set $selectedPreset(value: any) {
		this.selectedPreset = value;
	}

	public get $selectedViewBy(): any {
		return this.selectedViewBy;
	}

	public set $selectedViewBy(value: any) {
		this.selectedViewBy = value;
	}

	public get $sqlRealTimePermission(): boolean {
		return this.sqlRealTimePermission;
	}
	public set $sqlRealTimePermission(value: boolean) {
		this.sqlRealTimePermission = value;
	}
	public isJsPlumbQueryPlan() {
		return this.isJsPlumbPlan;
	}
	public getMssqlShownFields() {
		return this.mssqlFields;
	}

	/**
	* Getter $isDrillDownQuery
	* @return {boolean}
	*/
	public get $isDrillDownQuery(): boolean {
		return this.isDrillDownQuery;
	}

	/**
	 * Setter $isDrillDownQuery
	 * @param {boolean} value
	 */
	public set $isDrillDownQuery(value: boolean) {
		this.isDrillDownQuery = value;
	}

	/**
     * Getter $drillDownIP
     * @return {string}
     */
	public get $drillDownIP(): string {
		return this.drillDownIP;
	}

	/**
	 * Setter $drillDownIP
	 * @param {string} value
	 */
	public set $drillDownIP(value: string) {
		this.drillDownIP = value;
	}


	/**
	 * Getter $drillDownQuery
	 * @return {String }
	 */
	public get $drillDownQuery(): String {
		return this.drillDownQuery;
	}

	/**
	 * Setter $drillDownQuery
	 * @param {String } value
	 */
	public set $drillDownQuery(value: String) {
		this.drillDownQuery = value;
	}
	public get $dbMonitorUIJson(): any {
		return this._dbMonitorUIJson;
	  }
	  public set $dbMonitorUIJson(value: any) {
		this._dbMonitorUIJson = value;
	  }
	public getSqlDbServerList(): any[] {
		console.log("value of getSqlDbServerList",this.sqlDbServerList);
		return this.sqlDbServerList;
	}
	public setSqlDbServerList(value : any[]) {
		this.sqlDbServerList = value;
		// this.dataAvail.next(value);
		console.log("value of setSqlDbServerList",this.sqlDbServerList);
	}

	public setDataSource(value: string) {
		this.dataSource = value;
	}
	public getDataSource() {
		return this.dataSource;
	}

        	/**set a data info for the database type*/
	public set $DataBaseType(val) {
		this.databaseType = val;
		if(val == 0){
			this.selectedDB = 'MSSQL';
		}else if(val == 1){
			this.selectedDB = 'POSTGRES';
		}else if(val == 2){
			this.selectedDB = 'MYSQL';
		}
		else if(val == 3){
			this.selectedDB = 'ORACLE';
		}
		else if(val == 4){
	    this.selectedDB = 'MONGODB';
              }
	}

	/**get a database type */
	public get $DataBaseType() {
		return this.databaseType;
	}

        	/**set a avg thresold */
	public set $avgThresold(val) {
		this.thresoldAvg = val;
	}


	/**get a ang thresold */
	public get $avgThresold() {
		return this.thresoldAvg;
	}


	/**set a avg thresold */
	public set $HighThresold(val) {
		this.thresoldHigh = val;
	}


	/**get a ang thresold */
	public get $HighThresold() {
		return this.thresoldHigh;
	}
   	/**set a avg postgrestThresoldAvg */
	   public set $postgrestThresoldAvg(val) {
		this.postgrestThresoldAvg = val;
	}


	/**get a avg postgrestThresoldAvg */
	public get $postgrestThresoldAvg() {
		return this.postgrestThresoldAvg;
	}


	/**set a high postgrestThresoldHigh */
	public set $postgrestThresoldHigh(val) {
		this.postgrestThresoldHigh = val;
	}


	/**get a high postgrestThresoldHigh */
	public get $postgrestThresoldHigh() {
		return this.postgrestThresoldHigh;
	}

	/**Setter of dbServerName */
	public set $dbServer(val) {
	this.selectedDB = val;	
	}

	/**Getter of dbServerName */
	public get $dbServer() {
		return this.selectedDB;
	}
	/**Setter of dbServerName */
	public set $queryCount(val) {
		this.queryCount = val;	
		}
	
		/**Getter of dbServerName */
		public get $queryCount() {
			return this.queryCount;
		}
	
	/**Setter of dbServerName */
	public set $queryBasis(val) {
		this.queryBasis = val;	
		}
	
		/**Getter of dbServerName */
		public get $queryBasis() {
			return this.queryBasis;
		}
		/**Setter of dbServerName */
	public setGlobalId(val) {
		this.globalId = val;	
		}
	
		/**Getter of dbServerName */
		public getGlobalId() {
			return this.globalId;
		}

	resetProperties() {
		this.selectedPreset = 'Last 1 Hour';
		this.$selectedViewBy = '1 Min';
		this.dataSource = '';
		this.activePage = '';
	}

	/**get a server list */
	getDbServerList(isRefresh: boolean) {
		try {
		console.log("yyyyyyyyyyyyyyyyy");
		let sqlUrl = this.getHostUrlForDBServerList() +
			'/DashboardServer/dbMonitoring/DBQueryStats/getDbSources?'+ 'isRefreshForDB=false' + '&productKey=' + this._productConfig.$productKey;
		let urlParams = '&userName=' + this.sql_userName + '&testRun=' + this.sql_testRun +
			'&prodType=' + this.$sql_productName + '&client_connection_key=' + this.sql_clientConnectionKey + '&dbType=' + this.$dbServer;
		let sqlDBSList = this.getDataByRESTAPI(sqlUrl, urlParams).subscribe(
			(result:any) => {
				console.log('RESULT in getDbServerList cache   ------>> ', result);
				let msg = 'DB Server list reload succesfully.';
				this.messageSub.next(msg);
				// result.sort();
				this.sqlDbServerList = {};
				
				this.sendBroadcaster.next();
				if(this.isRequestFromDrillDown && this.dataSource != ''){
					return;
				}
				
				this.setSqlDbServerList(result);
				if (!isRefresh) {
					let _sqlUserDefaultDS = localStorage.getItem(localStorage.getItem('userName') + '@sql');
					if (_sqlUserDefaultDS && this.isDefaultInList(_sqlUserDefaultDS)) {
						this.dataSource = _sqlUserDefaultDS;
						// }
						// /*  in case default dbSource and selecteddbSource in not in list then selecting first dbSorce from list */
						// else if (!(this.dataSource && this.isDefaultInList(this.dataSource.toString()))) {
							// 	this.dataSource = this.sqlDbServerList[0][0];
							// 	console.log("inside else if case of yyyyy source ", this.dataSource);
						} else {
							if(result[sessionStorage.getItem('sqlDataBaseType')] != undefined){
							//  get key from list of value 
							let firstKey = Object.keys(result[sessionStorage.getItem('sqlDataBaseType')])[0];
							this.dataSource = result[sessionStorage.getItem('sqlDataBaseType')][firstKey];
							console.log("inside else case of yyyy source ", this.dataSource);
							} else {
								this.dbListAvailable.next(false);
								return;
							}
						}
						
						this.dbListAvailable.next(true);
					}
					this.dataAvail.next(result);
			},
			err => {
				sqlDBSList.unsubscribe();
			},
			() => {
				sqlDBSList.unsubscribe();
			});
		} catch (error) {
			console.error('error in getting a DB server list', error);
		}
	}

	/**Getting a Servevr list from DB*/
	getDBServerListFromDB() {
		try {
			console.log('hhhhhhhhhhhhhhhhhhhh');
			let sqlUrl = this.getHostUrlForDBServerList() +
			'/DashboardServer/dbMonitoring/DBQueryStats/getDbSources?' + 'isRefreshForDB=true' +'&productKey=' + this._productConfig.$productKey;
		let urlParams = '&userName=' + this.sql_userName + '&testRun=' + this.sql_testRun +
			'&prodType=' + this.$sql_productName + '&client_connection_key=' + this.sql_clientConnectionKey + '&dbType=' + this.$dbServer; 
		let sqlDBSList = this.getDataByRESTAPI(sqlUrl, urlParams).subscribe(
		(result : any) => {
				console.log('RESULT in getDbServerList config   ------>> ', result);
				let msg = 'DB Server list reload succesfully.';
				this.messageSub.next(msg);
				// result.sort();
				this.setSqlDbServerList(result);
				
				let isRefresh = false;
				if (!isRefresh) {
					let _sqlUserDefaultDS = localStorage.getItem(localStorage.getItem('userName') + '@sql');
					if (_sqlUserDefaultDS && this.isDefaultInList(_sqlUserDefaultDS)) {
						this.dataSource = _sqlUserDefaultDS;
						console.log("inside if case of hhhhhhhh source ", this.dataSource);
					}
					// /*  in case default dbSource and selecteddbSource in not in list then selecting first dbSorce from list */
					// else if (!(this.dataSource && this.isDefaultInList(this.dataSource.toString()))) {
					// 	this.dataSource = this.sqlDbServerList[0][0];
					// 	console.log("inside else if case of hhhhhhhh source ", this.dataSource);
					// }
					 else {
						 //  get key from list of value 
						let firstKey = Object.keys(this.sqlDbServerList[sessionStorage.getItem('sqlDataBaseType')])[0];
						this.dataSource = this.sqlDbServerList[sessionStorage.getItem('sqlDataBaseType')][firstKey];
						console.log("inside else case of hhhhhhhh source ", this.dataSource);
					}
					this.dbListAvailable.next(true);
				}

				this.sendBroadcaster.next();
			},
			err => {
				sqlDBSList.unsubscribe();
			},
			() => {
				sqlDBSList.unsubscribe();
			});
			
		} catch (error) {
			console.error('error in getting a DB server list', error);
		}
	}
	


	getDataByRESTAPI(url: string, param: string) {
		try {
			return this.http.get(url + param)
				.pipe((response) => response);
		} catch (e) {
			console.error('Error while getting data from REST API. url = ' + url + ', param = ' + param + ', error = ' + e);
		}
	}

	isDefaultInList(_sqlUserDefaultDS: string) {
		let dbServerMap = this.sqlDbServerList[sessionStorage.getItem('sqlDataBaseType')];
			for(let key in dbServerMap)
			{
				console.log("value of list",dbServerMap);
				
			   if(dbServerMap[key] == _sqlUserDefaultDS){
			   return true;
				}
			}
			return false;
	}

       public getHostUrlForDBServerList() {
		try {
		  if (sessionStorage.getItem('isMultiDCMode') == 'true') {
			if (sessionStorage.getItem('activeDC') == 'ALL') {
				   return this._productConfig.getINSAggrPrefix() + sessionStorage.getItem('activeDC');
				 }
				 else{
				   return this._productConfig.getINSPrefixForMssql() + sessionStorage.getItem('activeDC') ;
				 }    
			}
			//   else {
			//    return this._productConfig.getINSAggrPrefix() + this._navService.getDCNameForScreen('msSql');
		//   } 
		   
		} catch(error) {
		  console.error('error in getHOST Url for db servvr list', error);
		}
	  }

	  /*used to call dbJson for generic */
getUIDetails() {
	try {
	  let sqlUrl = this.getHostUrlForDBServerList() + GETUIDETAILS;
	    let sqlDataSubscription =  this.http.get(sqlUrl)
					.pipe((response) => response).subscribe(
					result =>{
		  console.log('Data recieved successfully for getUIDetails from getUIDetailsjson.', result);
		  if (result != undefined) {
			this.$dbMonitorUIJson = result; 
			this.settingWholeScenarioData();
			this.sendBroadcaster.next();
			console.log("json result of dbMonitorUIJson ", this.$dbMonitorUIJson);
		  }
		},
  
		err => { console.error('Error while getUIDetails from server', err); },
		() => {
			console.log('getUIDetails Request completed successfully.');
		  sqlDataSubscription.unsubscribe();
		});
	   } catch (error) {
	  console.error('error in getting dbMonitorUIJson')
	}
  }

	  /*used to when dbMonitorUI.json is not present */
getUIDetailsBkp() {
	try {
	  let sqlUrl = this.getHostUrlForDBServerList() + GETUIDETAILSBKP;
					
	  let sqlDataSubscription = this.getDataByRESTAPI(sqlUrl, '').subscribe(
		result => {
		  console.log('Data recieved successfully for getUIDetails from server.', result);
  
		  if (result != undefined) {
			this.$dbMonitorUIJson = result; 
		console.log("json result of dbMonitorUIJson ", this.$dbMonitorUIJson);
  
		  }
		},
		err => { console.error('Error while getUIDetails from backup json', err); },
		() => {
			console.log('getUIDetails Request completed successfully.');
		  sqlDataSubscription.unsubscribe();
		});
	   } catch (error) {
	  console.error('error in  getUIDetailsBkp')
	}
  }
  
/* method to getSubMenuList  */
getSubMenuDetail(menuName: String, subMenuName: String) {
	try{
	let menuList = this.$dbMonitorUIJson[sessionStorage.getItem('sqlDataBaseType')]['menus'];
	for (let j = 0; j < menuList.length; j++) {
	  if (menuList[j]['name'] == menuName) {
		for (let a = 0; a < menuList[j]['subMenus'].length; a++) {
		  if (menuList[j]['subMenus'][a]['name'] == subMenuName) {
			return menuList[j]['subMenus'][a];
		  }
		}
	  }
	}
	} catch (e) {
	  console.error('Error while getSubMenuList', e);
	}
  }
	/* Method to set the whole scenario preset data.*/
	settingWholeScenarioData() {
		try {

			this.presetOptions = this.$dbMonitorUIJson[sessionStorage.getItem('sqlDataBaseType')]['presetOptions'];

		} catch (error) {
			console.error('Error in settingWholeScenarioData', error);
		}
	}
	
	/* uesd to get class name for status column */
	getClassForStatus(value)
	{
		if (typeof(value) != 'string'){
			return '';
		}
		switch(value.toLowerCase()){
			case 'sleeping':
			case 'idle':
			case 'inactive':
			case 'statistics': 
			case 'init':
			case 'cached': 
				return 'setSleep';
			case 'running': 
			case 'active': 
			case 'sending data': 
			case 'executing': 
			case 'preparing': 
				return 'setrunning';
			case 'blocking': 
			case 'idle in transaction': 
			case 'killed': 
			case 'sniped': 
				return 'setblocking';
			default:  {
				if(value.toLowerCase().includes(' lock'))
					return 'setblocking';
				else
				 	return '';
			}
		}
	}

	/* used for getting dbServer status */
	getServerStatus()
	{
		try {
			let sqlUrl = this.getHostUrlForDBServerList() + DB_MONITORING + DBQUERYSTATS_GET_DBSOURCES_STATUS  +'?client_connection_key=' +
			this.$sql_clientConnectionKey + '&userName=' + this.$sql_userName + '&testRun=' +
			this.$sql_testRun + '&prodType=' + this.$sql_productName + '&productKey=' + this._productConfig.$productKey
			 + '&dbType=' + this.$dbServer + '&globalId=' + this.getGlobalId(); 
			
			this.activeServerSuscription = this.getDataByRESTAPI(sqlUrl, '').subscribe(
				result => {
				  console.log('Data recieved successfully for getServerStatus from server.', result);
		  
				  if (result != undefined) {
					this.activeServerList = result; 
					console.log("result of activeServerList ", this.activeServerList);
					this.sendActiveServerList.next(result);
				}
		},
		err => { console.error('Error while getServerStatus result', err); },
		() => {
			console.log('getServerStatus Request completed successfully.');
			this.activeServerSuscription.unsubscribe();
		});

	}catch(error){
		console.error('error in  getServerStatus')
	}
}
}
