import { Injectable } from '@angular/core';
import { ExecDashboardDataContainerService } from './exec-dashboard-data-container.service';
import { Subject } from 'rxjs';
import { SelectItem } from 'primeng';
import { CavConfigService } from '../../tools/configuration/nd-config/services/cav-config.service';
import { SessionService } from 'src/app/core/session/session.service';

export interface NodeServerPresetURLParams {
	servletName: string; // can be only "DashboardServer" or "IntegratedServer"
	serverType: number; // can be only 0/1 . 0: DashboardServer, 1: IntegrationServer
	dcName: string; // list of DCs separated by commas
	hostOrigin: string; // hostname like "http://127.0.0.1:80/"
	presetURL: string; // can be like "node/ALL" or "node/tomcat/<dc_name>"
	testrunNumber: string; // testrun number of selected dc
	isALL: string; // if all dcs are selected. The content can be either 'ALL' or the DCs selected
}

export interface dcInfoObj {
	dc : string,
	ip : string,
	isMaster : boolean,
	port : string,
	productType : string,
	protocol : string,
	testRun : string,
	testStartTime : string
}

export interface CustomSelectItem extends SelectItem {
	selected?: boolean;
}
@Injectable()
export class ExecDashboardConfigService {

	private host = '//10.10.50.11:8003/';
	private port = '8003';
	private CONFIG_ED: number = (sessionStorage.getItem('strServerType') == "ED") ? 1 : (sessionStorage.getItem('strServerType') == "NDE") ? 0 : 0;
	private kpiRefreshInterval: number = 60000;
	private serverChk: string = 'ND';
	private appliedTimePeriodStr: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
	private appliedStartTime: string = (sessionStorage.getItem('appliedEDStartTime')) ? sessionStorage.getItem('appliedEDStartTime') : '';
	private appliedEndTime: string = (sessionStorage.getItem('appliedEDEndTime')) ? sessionStorage.getItem('appliedEDEndTime') : '';
	private appliedEventDay: string = (sessionStorage.getItem('appliedEDEventDay')) ? sessionStorage.getItem('appliedEDEventDay') : '';

	private actTimePeriod: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last_60_Minutes';
	// private isIncDisGraph: boolean = sessionStorage.appliedEDDiscGraph == "true";
	private isIncDisGraph: boolean = true;

//	private userName = 'netstorm';
	private userName = (this.sessionService.session.cctx.u) ? this.sessionService.session.cctx.u : 'netstorm';
	private userGroup = 'netstorm';
	private productName = (this.sessionService.session.cctx.prodType) ? this.sessionService.session.cctx.prodType : 'netstorm';
	private _productKey = (this.sessionService.session.cctx.pk) ? this.sessionService.session.cctx.pk : 'NA';
	private displayAlert = false;
	private alertMessage = 'Data Not Available';
	private isContinuousMode: string = (sessionStorage.getItem('productMode')) ? sessionStorage.getItem('productMode') : '';
	private protocol: string = window.location.protocol;
	private appliedEventYear: number;
	private _testRun: string = (this.sessionService.session.testRun.id) ? this.sessionService.session.testRun.id : "-1";
	private commonSubject = new Subject; // can be used in common subscriptions in any component
	private isMultiDC : boolean = false;
	$commonSubscription = this.commonSubject.asObservable();  // can be used accross the module
	private dcNameArr = [] // contains dc's name
	constructor(public _productConfig: CavConfigService,
		public _dataContainer: ExecDashboardDataContainerService,
		private sessionService: SessionService
		) {
	}
	
	/**
	 * Filters the provided dcinfo list
	 * @param dcInfo {Object[]} The dcinfo list
	 * @returns {Object[]} The filtered list
	 */
	filterDCInfo(dcInfo: any[]): any[] {
		return dcInfo?dcInfo.filter(e=>e.productType.toLowerCase() == "netdiagnostics"):[];
	}
	/**
	 * This method returns the path after host, required to send a request to node's server.
	 * @param nodeServerInfo {NodeServerPresetURLParams}
	 * @returns {string} This will return "node/ALL/" or "node/tomcat/<dc_name>/"
	 */
	appendNodePresetIfExists(nodeServerInfo: NodeServerPresetURLParams) {
		return nodeServerInfo.presetURL.length?(nodeServerInfo.presetURL.endsWith("/")?"":"/") + nodeServerInfo.presetURL + "/":"/";
	}

	/**
	 * This method returns the complete path along with the host.
	 * @param selectedDCs {string[]} selected DCs list
	 * @param nodeServerInfo {NodeServerPresetURLParams[]} pass already avaialable object
	 * @returns {string} This will return the path like "http://127.0.0.1:80/node/ALL/"
	 */
	getNodePresetURL(selectedDCs = [], nodeServerInfo: NodeServerPresetURLParams = null): string {
		if (nodeServerInfo == null) {
			nodeServerInfo = this.getNodePresetObject(selectedDCs);
		}
		return nodeServerInfo.hostOrigin + this.appendNodePresetIfExists(nodeServerInfo);
	}

	/**
	 * This method returns the object containing information required to forward a request to node's server
	 * @param selectedDCs {string[]} selected DCs list
	 * @param dcsInfo {Object[]} Node's dcinfo
	 * @returns {NodeServerPresetURLParams}
	 */
	getNodePresetObject(selectedDCs: string[], dcsInfo: any[] = []): NodeServerPresetURLParams {
		// let masterTemp = dcsInfo.filter(e => e.isMaster);
		let masterDC = sessionStorage.getItem('masterDC');
		let servletName: string = "IntegratedServer";
		let serverType: number = 1;
		let dcName: string = "ALL";
		let host : string = window.location.origin;
		let nodePresetURL: string = "tomcat/" + (masterDC != undefined ? masterDC : "");
		let testrunNumber: string = sessionStorage.getItem('EDTestrun');
		if (sessionStorage.isMultiDCMode == "true") {
			// if (selectedDCs.length != dcsInfo.length) { no provision for active DC concept
			// 	if (selectedDCs.length == 1) {
			// 		if (selectedDCs[0].toUpperCase() == "ALL") {
			// 			dcName = dcsInfo.map(e=>e.dc).toString();
			// 		} else {
			// 		servletName = "DashboardServer";
			// 		serverType = 0;
			// 		dcName = selectedDCs.toString();
			// 		nodePresetURL = "tomcat/" + dcName;
			// 		let tmpDC = dcsInfo.filter(e => e.dc == dcName);
			// 		testrunNumber = dcsInfo.length > 0 ? tmpDC.length>0?tmpDC[0].testRun:"":"";
			// 		}
			// 	} else {
			// 		dcName = selectedDCs.toString();
			// 	}
			// }
		} else {
			servletName = "DashboardServer";
			serverType = 0;
			dcName = '';
			nodePresetURL = "";
			testrunNumber = sessionStorage.getItem('EDTestrun');
		}
		// let isALL = selectedDCs.length == dcsInfo.length || selectedDCs.length > 1 ?"ALL":dcName;
		let isALL = dcName;
		return { servletName: servletName, serverType: serverType, dcName: dcName, hostOrigin: host, presetURL: nodePresetURL, testrunNumber: testrunNumber, isALL: isALL };
	}

	/**Initializing dashboard configuration. */
	public initConfiguration() {
		try {
			/*Checking for availability of session. */
			if (sessionStorage.getItem('sesLoginName') == null) {
				//this._productConfig.restoreConfiguration();
			}

			/* Initializing configuration with product ui configuration. */
			// this.userName = this._productConfig.$userName;
			// this.productName = this._productConfig.$productName;
			// this.userGroup = this._productConfig.$userGroup;
			this.$userName =  this.sessionService.session.cctx.u;
			this.productName = this.sessionService.session.cctx.prodType;
			this.$isMultiDC = this.sessionService.isMultiDC;
			this.userGroup = this._productConfig.$userGroup;
			this.host = this._productConfig.$serverIP;
			this.port = this._productConfig.$port;
			this.setDCInfo();

		} catch (e) {
			console.log('error in initConfiguration method ', e);
		}
	}

	/* set dcInfo of cav config from session service*/
	setDCInfo(){
		var dcArr  = [];
		const dcData = this.sessionService.preSession.dcData;
		dcData.forEach(element=>{
			if(element.master && element.name!='ALL'){
				sessionStorage.masterDC = element.name;
			}
			if(element.name!='ALL'){
				this.dcNameArr.push(element.name);
			}
			let dcInfoObj = {};
			dcInfoObj['dc'] = element.name;
			dcInfoObj['ip'] = '';
			dcInfoObj['isMaster'] = element.master;
			dcInfoObj['port'] = '';
			dcInfoObj['productType'] = 'netdiagnostics';
			dcInfoObj['protocol'] = '';
			dcInfoObj['testRun'] = element.testRun.id;
			dcInfoObj['testStartTime'] = '0';
			dcArr.push(dcInfoObj);
		});
		this._productConfig.setDCInfoObj(dcArr);
		this.$dcNameArr = this.dcNameArr;
	}
	/* Show Alert Dialog. */
	showAlert(message: string) {
		try {
			this.displayAlert = true;
			this.alertMessage = message;
		} catch (e) {
			console.log('Error while showing alert model.', e);
		}
	}


	getDCObject(dcName) {
		if (dcName != undefined) dcName = dcName.toString();
		console.log("getDCObject called ---- ", dcName, this._dataContainer.$isAllDCs);
		console.log(this._dataContainer.$DCsInfo);
		let tempobject = {};
		let dcObject;
		try {
			dcObject = this._dataContainer.$DCsInfo[dcName];
			tempobject['dcName'] = dcName;
			if (this._dataContainer.$isAllDCs) {
				tempobject['dcName'] = this._dataContainer.$MultiDCsArr.filter(e => e !== 'All').toString();
				tempobject['server'] = 'IntegratedServer';
			}
			else {
				tempobject['server'] = 'DashboardServer';
			}

			tempobject['port'] = dcObject['dataCenterPort'];
			tempobject['protocol'] = dcObject['protocol'];
			tempobject['testRunNo'] = dcObject['testRunNo'];
			tempobject['dataCenterIP'] = dcObject['dataCenterIP'];

			console.log('tempobject getDCObject before returning ');
			console.log(tempobject);
			return tempobject

		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * This method is used in varius locations like node search icon clicked
	 * @param eventData {Object} This comes in format {message: string, data: any}
	 */
	public emmitSubscription(eventData: { message: string, data?: any }) {
		this.commonSubject.next(eventData);
	}
	public set $displayAlert(value: boolean) {
		this.displayAlert = value;
	}

	public get $displayAlert(): boolean {
		return this.displayAlert;
	}

	public set $alertMessage(value: string) {
		this.alertMessage = value;
	}

	public get $alertMessage(): string {
		return this.alertMessage;
	}

	public get $getHostUrl(): any {
		return `${this.host}`;
	}
	public get productKey() {
		return this._productKey;
	}
	public set productKey(value) {
		this._productKey = value;
	}

	public set $setHostUrl(host: string) {
		this.host = host;
	}

	public get $CONFIG_ED(): number {
		return this.CONFIG_ED;
	}

	public set $CONFIG_ED(value: number) {
		this.CONFIG_ED = value;
	}

	public get $kpiRefreshInterval(): number {
		return this.kpiRefreshInterval;
	}

	public set $kpiRefreshInterval(value: number) {
		this.kpiRefreshInterval = value;
	}

	public get $serverChk(): string {
		return this.serverChk;
	}

	public set $serverChk(value: string) {
		this.serverChk = value;
	}

	public get $appliedTimePeriodStr(): string {
		return this.appliedTimePeriodStr;
	}

	public set $appliedTimePeriodStr(value: string) {
		sessionStorage.setItem('appliedEDGraphTime', value);
		this.appliedTimePeriodStr = value;
	}

	public get $appliedStartTime(): string {
		return this.appliedStartTime;
	}

	public set $appliedStartTime(value: string) {
		sessionStorage.setItem('appliedEDStartTime', value);
		this.appliedStartTime = value;
	}

	public get $appliedEndTime(): string {
		return this.appliedEndTime;
	}

	public set $appliedEndTime(value: string) {
		sessionStorage.setItem('appliedEDEndTime', value);
		this.appliedEndTime = value;
	}

	public get $appliedEventDay(): string {
		return this.appliedEventDay;
	}

	public set $appliedEventDay(value: string) {
		sessionStorage.setItem('appliedEDEventDay', value);
		this.appliedEventDay = value;
	}

	public get $actTimePeriod(): string {
		return this.actTimePeriod;
	}

	public set $actTimePeriod(value: string) {
		sessionStorage.setItem('appliedEDGraphTime', value);
		this.actTimePeriod = value;
	}

	public get $isIncDisGraph(): boolean {
		return this.isIncDisGraph;
	}

	public set $isIncDisGraph(value: boolean) {
		sessionStorage.setItem('appliedEDDiscGraph', "true");
		this.isIncDisGraph = value;
	}

	public get $userName(): string {
		return this.userName;
	}

	public set $userName(value: string) {
		this.userName = value;
	}

	public get $userGroup(): string {
		return this.userGroup;
	}

	public set $userGroup(value: string) {
		this.userGroup = value;
	}

	public get $productName(): string {
		return this.productName;
	}

	public set $productName(value: string) {
		this.productName = value;
	}

	public get $protocol(): string {
		return this.protocol;
	}

	public set $protocol(value: string) {
		this.protocol = value;
	}

	public get $appliedEventYear(): number {
		return this.appliedEventYear;
	}

	public set $appliedEventYear(value: number) {
		this.appliedEventYear = value;
	}
	
	public set $testRun(value: string) {
		this._testRun = value;
		sessionStorage.EDTestrun = value;
	}
	public get $testRun(): string {
		return this._testRun;
	}

	public set $isMultiDC(value: boolean) {
		this.isMultiDC = value;
		sessionStorage.isMultiDCMode = value.toString();
		sessionStorage.activeDC = this.sessionService.dataCenter.name;
	}
	public get $isMultiDC(): boolean {
		return this.isMultiDC;
	}

	public set $dcNameArr(value) {
		sessionStorage.dcArr = value.toString();
		this.dcNameArr = value;
	}
	public get $dcNameArr(): any {
		return this.dcNameArr;
	}
}
