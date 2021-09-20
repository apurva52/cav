import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'primeng/primeng';
import { ExecDashboardConfigService } from './exec-dashboard-config.service';
import { ExecDashboardGraphTimeDataservice } from './exec-dashboard-graph-time-data.service';
import { ExecDashboardCommonRequestHandler } from './exec-dashboard-common-request-handler.service';
import { MULTIZONE_GRID_HEADER,FIELD_ICONS } from '../constants/exec-dashboard-kpi-header-const';
import { ExecDashboardUtil } from '../utils/exec-dashboard-util';

@Injectable()
export class ExecDashboardCommonKPIDataservice {
	//to hold multidc type data
	multiDcobj: any[] = [];

	private kpiDataObj: Object = {};

	private dcList: any[] = [];
	private multiDCKPIObj: Object = {};
	private sampleTime: String = '';
	private blockUI: Boolean = false;
	public kpimsgs: Message[] = [];
	private appliedTimePeriodLabelForOrderRev: string = (sessionStorage.getItem('appliedTimePeriodLabelForOrderRev')) ? sessionStorage.getItem('appliedTimePeriodLabelForOrderRev') : '';
	private enableOrdRev: Boolean = true;
	private orderRevDCName: string = '';
	private isDataReceived: Object = {};
	private orderGridDCDataObj: Object = {};

	private gridObj: Object = {
		'dmax': '-',
		'hr': '-',
		'jpdmax': '-',
		'jphr': '-',
		'jpmint': '-',
		'mint': '-',
		'pctl': '-',
		'pctl95': '-',
		'pctl99': '-'
	};

	private kpiViewJson: any[] = []
	private kpiDCInfo: Object = {}
	private sampleT: Object = {};
	private _kpiGroupView: any[] = [];
	private _kpiHeader: Object = {};
	private _kpiTableGroup: any[] = [];
	private _kpiNegativeUser: any[] = [];
        private _kpiLoadedZone:any;
	constructor(public _config: ExecDashboardConfigService, public requestHandler: ExecDashboardCommonRequestHandler, public _http: HttpClient,
		public _graphTime: ExecDashboardGraphTimeDataservice) { }

	public get $kpiDataObj(): Object {
		return this.kpiDataObj;
	}

	public set $kpiDataObj(value: Object) {
		this.kpiDataObj = value;
	}

	public get $kpiDCInfo(): Object {
		return this.kpiDCInfo;
	}

	public set $kpiDCInfo(value: Object) {
		this.kpiDCInfo = value;
	}

	public get $kpiViewJson(): any[] {
		return this.kpiViewJson;
	}

	public set $kpiViewJson(value: any[]) {
		this.kpiViewJson = value;
	}

	public get $dcList(): any[] {
		return this.dcList;
	}

	public set $dcList(value: any[]) {
		this.dcList = value;
	}

	public get $gridObj(): Object {
		return this.gridObj;
	}

	public get $sampleTime(): String {
		return this.sampleTime;
	}

	public set $sampleTime(value: String) {
		this.sampleTime = value;
	}

	public get $blockUI(): Boolean {
		return this.blockUI;
	}

	public set $blockUI(value: Boolean) {
		this.blockUI = value;
	}

	public get $appliedTimePeriodLabelForOrderRev(): string {
		return this.appliedTimePeriodLabelForOrderRev;
	}

	public set $appliedTimePeriodLabelForOrderRev(value: string) {
		sessionStorage.setItem('appliedTimePeriodLabelForOrderRev', value);
		this.appliedTimePeriodLabelForOrderRev = value;
	}

	public get $enableOrdRev(): Boolean {
		return this.enableOrdRev;
	}

	public set $enableOrdRev(value: Boolean) {
		this.enableOrdRev = value;
	}

	public get $orderRevDCName(): string {
		return this.orderRevDCName;
	}

	public set $orderRevDCName(value: string) {
		this.orderRevDCName = value;
	}

	public get kpiGroupView(): any {
		return this._kpiGroupView;
	}

	public set kpiGroupView(value: any) {
		this._kpiGroupView = value;
	}

	public set kpiHeader(value: any) {
		this._kpiHeader = value;
	}

	public get kpiHeader() {
		return this._kpiHeader;
	}

	public set kpiTableGroup(value: any) {
		this._kpiTableGroup = value;
	}

	public get kpiTableGroup() {
		return this._kpiTableGroup;
	}

	public set kpiNegativeUser(value:any){
		this._kpiNegativeUser = value;
	}

	public get kpiNegativeUser(){
		return this._kpiNegativeUser;
	}
        
        public set kpiLoadedZone(value: any) {
		this._kpiLoadedZone = value;
	}

	public get kpiLoadedZone() {
		return this._kpiLoadedZone;
	}
  
	/**
	 * Currently grouping is supported for type multizone & Stats type
	 */
	groupTable(viewData) {
		if (this.kpiGroupView == null) {
			return viewData;
		}
		let tempGroupData = [...this.kpiGroupView];
		let dcList = tempGroupData.map(e => e.DCs.split(","));
		let tmpDcLst = [];
		let tempViewInfo = viewData.map(x => Object.assign({}, x));
		tempGroupData.forEach((element, index) => {
			if (element.DCs) {
				let arrDCs = element.DCs.split(",");
				let tempObject;
				let idx;
				arrDCs.forEach(dcName => {
					if (tmpDcLst.includes(dcName)) {
						tmpDcLst.push(dcName);
						return;
					}
					tmpDcLst.push(dcName);
					idx = tempViewInfo.findIndex(x => x.DCs == dcName);
					tempObject = tempViewInfo[idx];
					tempViewInfo.splice(idx, 1);
				});
				tempObject['header'] = element.groupName;
				let counts = {};
				tmpDcLst.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
				tempObject['DCs'] = this.getFinalDCNameList(arrDCs).join("!");
				tempViewInfo.splice(idx, 0, tempObject);
			} else if (element.header) {
				let arrHeader = element.header.split(",");
				let tempObject;
				let idx;
				arrHeader.forEach(hdrName => {
					idx = tempViewInfo.findIndex(x => x.header == hdrName);
					tempObject = tempViewInfo[idx];
					tempViewInfo.splice(idx, 1);
				});
				tempObject['header'] = element.groupName;
				tempObject['DCs'] = arrHeader.join("!");
				tempViewInfo.splice(idx, 0, tempObject);
			}

		});
		return tempViewInfo;
	}

	/**
	 * Returns the final dc name list after adding the dummy dc names required to order the tiers in a table
	 * @param DCs {String[]} The actual dclist
	 * @return {String[]} returns the final dclist 
	 */
	getFinalDCNameList(DCs: string[]) {
		let dcArr = [];
		let countArr = [];
		DCs.forEach(e => {
			if (dcArr.includes(e)) {
				dcArr.push(e + "_dummy" + countArr[e]);
				countArr[e] = ++countArr[e];
			}
			else {
				dcArr.push(e);
				countArr[e] = countArr[e] ? ++countArr[e] : 1
			}
		})
		return dcArr;
	}

	mergeDataBasedOnGroup() {
		try {
			let tempDataObj = JSON.parse(JSON.stringify(this.$kpiDataObj)); //  [...this.viewInfo]; */
			let tempGroupData = this.kpiGroupView.map(x => Object.assign([], x));
			let finalObject = tempDataObj;
			tempGroupData.forEach((element, index) => {
				if (element.DCs) {
					let arrDCs = this.getFinalDCNameList(element.DCs.split(","));
					let tempDCArr = [];
					arrDCs.forEach(element => {
						let dcData = tempDataObj['grid_' + element];
						if (dcData != null) {
							tempDCArr = [...tempDCArr, ...dcData];
							//delete finalObject['grid_' + element];
						}
						// tempDCArr = [...tempDCArr, ...tempDataObj['grid_' + element]];
					});
					finalObject['grid_' + arrDCs.join("!")] = tempDCArr;
				} else if (element.header) {
					let arrHeader = element.header.split(",");
					let tempDCArr = [];
					arrHeader.forEach(element => {
						let dcData = tempDataObj['grid_' + element];
						if (dcData != null) {
							tempDCArr = [...tempDCArr, ...dcData];
							//delete finalObject['grid_' + element];
						}
						// tempDCArr = [...tempDCArr, ...tempDataObj['grid_' + element]];
					});
					finalObject['grid_' + element.groupName] = tempDCArr;
				}

			});
			this.$kpiDataObj = finalObject;
		} catch (error) {
			console.log("error in mergeDataBasedOnGroup");
			console.log(error);
		}
	}



	/**
	 * Getting View and DC Info JSON from server
	 */
	getKPIViewJSON(callback) {
		try {

			let url = this._config.getNodePresetURL() + 'DashboardServer/RestService/KPIWebService/KPIViewInfo';
			this.requestHandler.getDataFromGetRequest(url, (data) => {
				// let data = INFOJSON
				if (data.status === 404 || data == [] || data['displayMsg'] === 'ConnectionRefused') {
					this.kpiMessages('Configuration Not Found', 'error');
					this.blockUI = false;
					return;
				}

				this.$kpiViewJson = data.kpiViewInfoList;
				this.$kpiDCInfo = data.dataCenterMap;
				this.$enableOrdRev = data.enableOrdRev;
				this.$orderRevDCName = data.ordRevDCName;
				this.kpiGroupView = data['groupView'];
				this.kpiHeader = data['headers'];
				this.kpiNegativeUser = data['negativeUser'];
                                this.kpiLoadedZone = data['loadedZone'];
				callback();
			});
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Displaying KPI Alerts
	 * @param msg 
	 * @param severity 
	 */
	kpiMessages(msg, severity) {
		try {
			if (severity === 'warn') {
				this.kpimsgs.push({ severity: severity, summary: 'Warning', detail: msg });
			} else
				this.kpimsgs.push({ severity: severity, summary: severity, detail: msg });
			setTimeout(() => {
				this.clear();
			}, 9000);
		} catch (error) {
			console.log(error);
		}
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

	/**
	 * This method gets KPI Data from server on basic of ED Mode and NDE mode
	 * @param  dcList
	 * origin: false -> default, true -> from time period
	 */
	getKPIDataFromServer($dcList, origin?: boolean) {
		try {
			this.multiDCKPIObj = {};
			let temp = true;

			// Add check for NDE Mode
			if (this._config.$CONFIG_ED === 0) {
				//if (temp) {

				let dcInfo = this.$kpiDCInfo;

				// Creating DC List
				let dcList = [];
				for (let i = 0; i < this.$dcList.length; i++) {
					if (this.$dcList[i].indexOf(',') != -1)
						dcList.push(this.$dcList[i].split(',')[0], this.$dcList[i].split(',')[1]);
					else
						dcList.push(this.$dcList[i]);
				}

				for (let i = 0; i < dcList.length; i++) {

					// This code is done to avoid calls if previous call data is not ye arrived
					if (this.isDataReceived.hasOwnProperty(dcList[i])) {
						if (this.isDataReceived[dcList[i]] == false) {
							continue;
						}
					} else 	// For first time
						this.isDataReceived[dcList[i]] = false;

					if (!this.$kpiDCInfo[dcList[i]]) {
						this.kpiMessages('No Configurations found for ' + dcList[i], 'error');
						continue;
					}

					if (this._config.$appliedTimePeriodStr.indexOf('Last Week') != -1 || this._config.$appliedTimePeriodStr.indexOf('Yesterday') != -1 || this._config.$appliedTimePeriodStr.indexOf('Custom') != -1 || this._config.$appliedTimePeriodStr.indexOf('Event') != -1) {
						this._config.$appliedStartTime = this.dateFormatter(this._config.$appliedStartTime);
						this._config.$appliedEndTime = this.dateFormatter(this._config.$appliedEndTime);
					}

					let url = "";
					if (sessionStorage.isMultiDCMode == "true") {
						url = this._config.getNodePresetURL([dcList[i]]);
					} else {
						let dcInfo = this.$kpiDCInfo[dcList[i]];
						url = `${dcInfo.protocol}://${dcInfo.dataCenterIP}:${dcInfo.dataCenterPort}/`;
					}
					if (this._config.$appliedTimePeriodStr.toLowerCase().startsWith('last') && !this._config.$appliedTimePeriodStr.toLowerCase().endsWith('day')) {
						this._config.$appliedStartTime = '';
						this._config.$appliedEndTime = '';
					  }
					url = `${url}DashboardServer/RestService/KPIWebService/kpiInfo?requestType=KPIData&GRAPH_KEY=&sessLoginName=netstorm&reqTestRunNum=${this.$kpiDCInfo[dcList[i]].testRunNo}&dcName=${dcList[i]}&serverType=0&isAll=${dcList[i]}&isIncDisGraph=${this._graphTime.$chkIncludeDiscontineGraph}&appliedTimePeriodStr=${this._config.$appliedTimePeriodStr}&appliedStartTime=${this._config.$appliedStartTime}&appliedEndTime=${this._config.$appliedEndTime}&appliedEventDay=${this._config.$appliedEventDay}`;

					this.$blockUI = true;
					this.requestHandler.getDataFromGetRequest(url, (data) => {

						if (data['displayMsg'] === 'ConnectionRefused') {
							this.isDataReceived[dcList[i]] = true;
							this.$blockUI = false;
							return;
						}

						// Putting a check, if data has arrived or not to block next call of interval
						this.isDataReceived[dcList[i]] = true;

						if (!data[0] || !data[0].kpiDataDTO) {
							this.kpiMessages('Data not available for specific time period for ' + dcList[i], 'error');

							// If time period data is null, blank table for particular DC in case time period is applied
							if (origin) {
								if (dcList[i].indexOf(this.$orderRevDCName)) {
									this.$kpiDataObj["orderRev"] = [];
								}

								let keys = Object.keys(this.$kpiDataObj);
								for (let i = 0; i < keys.length; i++) {
									if (keys[i].indexOf(dcList[i])) {
										let dcName = keys[i].substring(keys[i].indexOf('_') + 1, keys[i].length);
										this.$kpiDataObj["grid_" + dcName] = [];
									}
								}
							}
							this.$blockUI = false;
							return;
						}

						// Creating table structure for each DC
						if (Object.getOwnPropertyNames(data[0]).length > 0)
							this.createKPIGridData(data[0].kpiDataDTO, dcList[i]);

						if (data[0] && data[0].kpiDataDTO) {
							this._graphTime.$appliedTimePeriod = (this._config.$appliedTimePeriodStr == "Event Day") ? `${this._config.$appliedEventDay} ${this._config.$appliedEventYear}` : this._config.$appliedTimePeriodStr;
							//this.$sampleTime += `${data[0].kpiDataDTO.dc}:${data[0].kpiDataDTO.date}\n`;
							this.sampleT[data[0].kpiDataDTO.dc] = `${data[0].kpiDataDTO.dc}:${data[0].kpiDataDTO.date}\n`;
						}
						this.$blockUI = false;

						// Creating sasmple time
						let dcTime = Object.keys(this.sampleT);
						this.$sampleTime = '';
						for (let k = 0; k < dcTime.length; k++) {
							if(dcTime[k].toLowerCase().indexOf("dummy") === -1){
						    	this.$sampleTime += this.sampleT[dcTime[k]];
							}
						}

						if (this.kpiGroupView != null) {
							this.mergeDataBasedOnGroup();
						}


					});

				}


			} else {  // For Config ED Mode
				let urll = this._config.getNodePresetURL([]) + 'DashboardServer/RestService/KPIWebService/kpiInfo?productType=ED&productKey=' + sessionStorage.productKey;
				// Referer:https://nde.cavisson.com/dashboard/view/dashboard_tabularView.jsp
				let request = {};
				request['type'] = 'POST';
				request['contentType'] = 'application/json; charset=utf-8';
				request['dataType'] = 'json';
				let headers = new HttpHeaders();
				this.createAuthorizationHeader(headers);
				this.$blockUI = true;
				 this._http.post(urll, request, { headers: headers }).pipe(res =><any> res)
				 	.subscribe(data => {
				
				for (let i = 0; i < data; i++) {

					if (data[i] === null)
						continue;

					// Creating table structure for each DC
					if (Object.getOwnPropertyNames(data[i]).length > 0)
						this.createKPIGridData(data[i].kpiDataDTO, '');	//Handle this case
					if (data[0] && data[0].kpiDataDTO) {
						this._graphTime.$appliedTimePeriod = (this._config.$appliedTimePeriodStr == "Event Day") ? `${this._config.$appliedEventDay} ${this._config.$appliedEventYear}` : this._config.$appliedTimePeriodStr;
						//this.$sampleTime += `${data[0].kpiDataDTO.dc}:${data[0].kpiDataDTO.date}\n`;
						this.sampleT[data[i].kpiDataDTO.dc] = `${data[i].kpiDataDTO.dc}:${data[i].kpiDataDTO.date}\n`;
					}
				}
				this.$blockUI = false;

				// Creating sasmple time
				let dcTime = Object.keys(this.sampleT);
				this.$sampleTime = '';
				for (let k = 0; k < dcTime.length; k++) {
			  	  if(dcTime[k].toLowerCase().indexOf("dummy") === -1){
				     this.$sampleTime += this.sampleT[dcTime[k]];
				  }
				}
				if (this.kpiGroupView != null) {
					this.mergeDataBasedOnGroup();
				}
				},
				error =>{
					this.$blockUI = false;
				});

			}
		} catch (error) {
			this.$blockUI = false;
			console.error(error);
		}
	}

	createAuthorizationHeader(headers: HttpHeaders) {
		headers.append('Authorization', this._config._productConfig.$serverIP + 'dashboard/view/dashboard_tabularView.jsp');
	}

	/**
	 * This function creates Grid Data for each DC
	 * @param kpiDCData 
	 */
	createKPIGridData(kpiDCData, currentDC) {
		try {

			// Looping over KPI View JSON
			for (let i = 0; i < this.kpiViewJson.length; i++) {
				if (this.kpiViewJson[i].DCs.indexOf(kpiDCData.dc) != -1) {

					// For MUlti Zone DC Grid
					if (this.kpiViewJson[i].type === 'multiZone') {
						if(kpiDCData.t3 && kpiDCData.t3.length > 0){
							this.createDataForMultiZoneDCGrid(kpiDCData.t3, this.kpiViewJson[i]);	
						}
						else
						this.createDataForMultiZoneDCGrid(kpiDCData.t2, this.kpiViewJson[i]);
					}

					// Order Revenue Grid
					if (this.$enableOrdRev) {
						let orderGridDC = this.$orderRevDCName.split(',');

						for (let j = 0; j < orderGridDC.length; j++) {
							if (currentDC === orderGridDC[j]) {
								let obj = {};
								this.orderGridDCDataObj[orderGridDC[j]] = kpiDCData.t1;
								obj = this.aggregateOrderRevGrid(this.orderGridDCDataObj);
								// this.createDataForOrderRevenueGrid(kpiDCData.t1, this.kpiViewJson[i]);
								this.createDataForOrderRevenueGrid(obj, this.kpiViewJson[i]);
							} else if (currentDC.trim().length === 0 && this.kpiViewJson[i].DCs === orderGridDC[j]) { // Case of nde cavisson
								let obj = {};
								this.orderGridDCDataObj[orderGridDC[j]] = kpiDCData.t1;
								obj = this.aggregateOrderRevGrid(this.orderGridDCDataObj);
								this.createDataForOrderRevenueGrid(obj, this.kpiViewJson[i]);
							}

						}
					}

					// For Order Revenue and MultiDC Type Grid
					if (this.kpiViewJson[i].type === 'multiDC') {
						// MultiDC Grid Types
						this.createDataForMultiDCGrid(kpiDCData, this.kpiViewJson[i]);
					}

					// For singleDc Grid
					if (this.kpiViewJson[i].type === 'singleDC') {
						this.$kpiDataObj["grid_" + this.kpiViewJson[i].DCs] = [] // code changed cause of bugid: 70715
						if(kpiDCData.t4 && kpiDCData.t4.length > 0)
						this.createDataForSingleZoneDCGrid(kpiDCData.t4, this.kpiViewJson[i]);
						//else
						this.createDataForSingleZoneDCGrid(kpiDCData.t2, this.kpiViewJson[i]);
					}

					// For statsType grid
					if (this.kpiViewJson[i].type === 'Stats') {
						if (this.kpiViewJson[i].headerType.toLowerCase() === 'redis') {
							if (kpiDCData.redisStats != null && kpiDCData.redisStats.length > 0)
								this.createDataForStatsType(kpiDCData.redisStats, this.kpiViewJson[i]);
						} else if (this.kpiViewJson[i].headerType.toLowerCase() === 'mongo') {
							if (kpiDCData.mongoDbStats != null && kpiDCData.mongoDbStats.length > 0)
								this.createDataForStatsType(kpiDCData.mongoDbStats, this.kpiViewJson[i]);
						} else if (this.kpiViewJson[i].headerType.toLowerCase() === 'mysql') {
							if (kpiDCData.mySqlStats != null && kpiDCData.mySqlStats.length > 0)
								this.createDataForStatsType(kpiDCData.mySqlStats, this.kpiViewJson[i]);
						} else{
							if (kpiDCData.commonStats != null)
								this.createDataForCommonStats(kpiDCData.commonStats, this.kpiViewJson[i]);
						}
					}

					//break; 
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * This method is used to create data for stat type - mongo/Mysql/radis
	 */
	createDataForStatsType(tableData, viewInfo) {
		try {
			if (!viewInfo.tiers) {
				console.log("tier list is null");
				return
			}
			let tempTierInfo = viewInfo.tiers.split(',');
			let tempTableData = [];
			let tempHeadeList = this.kpiHeader[viewInfo['headerType']];
			let tempHeaderKeys = [];
			for (var key in tempHeadeList) {
				if (tempHeadeList.hasOwnProperty(key)) {
					tempHeaderKeys.push(tempHeadeList[key]['hName']);
				}
			}
			tempTierInfo.forEach((element, index, array) => {
				let tempObject = {};
				let idx = tableData.findIndex(e => e[tempHeaderKeys[0]] == element);
				if(idx == -1) return;
				let rowData = tableData[idx];
				tempHeaderKeys.forEach(element => {
					if (typeof (rowData[element]) === 'number') {
						// another way
						tempObject[element] = Math.round(rowData[element] * 1000) / 1000;
						// tempObject[element] = rowData[element].toFixed(3);
					}
					else {
						tempObject[element] = rowData[element]
					}
				});
				tempTableData.push(tempObject);
			});

			this.$kpiDataObj['grid_' + this.getFinalDCNameList(viewInfo['header'].split("!")).join("!")] = tempTableData;

		} catch (error) {
			console.log('error in createDataForStatsTyper');
			console.log(error);
		}
	}

	/**
	 * This method is used to create data for stat type - mongo/Mysql/radis
	 */
	createDataForCommonStats(commonStatsData, viewInfo) {
		try {
			if (!viewInfo.tiers) {
				console.log("tier list is null");
				return
			}
			let tempTierInfo = viewInfo.tiers.split(',');
			let tempTableData = [];
			let tempHeadeList = this.kpiHeader[viewInfo['headerType']];
			let tempHeaderKeys = [];
			for (var key in tempHeadeList) {
				if (tempHeadeList.hasOwnProperty(key)) {
					tempHeaderKeys.push(tempHeadeList[key]['hName']);
				}
			}
			let tableData = commonStatsData[viewInfo['headerType']];

			tempTierInfo.forEach((element, index, array) => {
				let tempObject = {};

				let idx = tableData.findIndex(e => e[tempHeaderKeys[0]] == element);
				if(idx == -1) return;
				let rowData = tableData[idx];
				tempHeaderKeys.forEach((element, index) => {
					if (index == 0) { // the first element should be the tier name
						tempObject[element] = rowData[element]
						return
					}
					let idx = rowData.statsData.findIndex(e => e.column == element);
					let statData = rowData.statsData[idx];
					if (typeof (statData.value) === 'number') {
						// another way
						tempObject[element] = Math.round(statData.value * 1000) / 1000;
						// tempObject[element] = rowData[element].toFixed(3);
					}
					else {
						tempObject[element] = statData.value
					}
				});
				tempTableData.push(tempObject);
			});

			this.$kpiDataObj['grid_' + this.getFinalDCNameList(viewInfo['header'].split("!")).join("!")] = tempTableData;

		} catch (error) {
			console.log('error in createDataForStatsTyper');
			console.log(error);
		}
	}


	/**
	 * This method is responsible for aggragation of order rev data from multiple dc's
	 */
	aggregateOrderRevGrid(orderRevObj) {

		let obj = {
			'orders': {
				'l5m': [],
				'l1h': [],
				'today': [],
				'pt': []
			},
			'rev': {
				'l5m': [],
				'l1h': [],
				'today': [],
				'pt': []
			}
		}

		for (let dc in orderRevObj) {
			if (orderRevObj.hasOwnProperty(dc)) {

				if (Object.keys(orderRevObj[dc]).length !== 0) {
					// Orders
					for (let i = 0; i < orderRevObj[dc].orders['l1h'].length; i++) {
						obj['orders']['l1h'][i] = (obj['orders']['l1h'][i]) ? obj['orders']['l1h'][i] + parseFloat(orderRevObj[dc].orders['l1h'][i]) : parseFloat(orderRevObj[dc].orders['l1h'][i]);
					}
					for (let i = 0; i < orderRevObj[dc].orders['l5m'].length; i++) {
						obj['orders']['l5m'][i] = (obj['orders']['l5m'][i]) ? obj['orders']['l5m'][i] + parseFloat(orderRevObj[dc].orders['l5m'][i]) : parseFloat(orderRevObj[dc].orders['l5m'][i]);
					}
					for (let i = 0; i < orderRevObj[dc].orders['pt'].length; i++) {
						obj['orders']['pt'][i] = (obj['orders']['pt'][i]) ? obj['orders']['pt'][i] + parseFloat(orderRevObj[dc].orders['pt'][i]) : parseFloat(orderRevObj[dc].orders['pt'][i]);
					}
					for (let i = 0; i < orderRevObj[dc].orders['today'].length; i++) {
						obj['orders']['today'][i] = (obj['orders']['today'][i]) ? obj['orders']['today'][i] + parseFloat(orderRevObj[dc].orders['today'][i]) : parseFloat(orderRevObj[dc].orders['today'][i]);
					}

					// Revenue
					for (let i = 0; i < orderRevObj[dc].rev['l1h'].length; i++) {
						obj['rev']['l1h'][i] = (obj['rev']['l1h'][i]) ? obj['rev']['l1h'][i] + parseFloat(orderRevObj[dc].rev['l1h'][i]) : parseFloat(orderRevObj[dc].rev['l1h'][i]);
					}
					for (let i = 0; i < orderRevObj[dc].rev['l5m'].length; i++) {
						obj['rev']['l5m'][i] = (obj['rev']['l5m'][i]) ? obj['rev']['l5m'][i] + parseFloat(orderRevObj[dc].rev['l5m'][i]) : parseFloat(orderRevObj[dc].rev['l5m'][i]);
					}
					for (let i = 0; i < orderRevObj[dc].rev['pt'].length; i++) {
						obj['rev']['pt'][i] = (obj['rev']['pt'][i]) ? obj['rev']['pt'][i] + parseFloat(orderRevObj[dc].rev['pt'][i]) : parseFloat(orderRevObj[dc].rev['pt'][i]);
					}
					for (let i = 0; i < orderRevObj[dc].rev['today'].length; i++) {
						obj['rev']['today'][i] = (obj['rev']['today'][i]) ? obj['rev']['today'][i] + parseFloat(orderRevObj[dc].rev['today'][i]) : parseFloat(orderRevObj[dc].rev['today'][i]);
					}
				} else {
					obj['valid'] = false;
				}
			}
		}
		return obj;
	}

	/**
	 * Create Single DC Grid Data having Multiple Zones
	 * @param data 
	 * @param kpiViewJSON 
	 */
	createDataForMultiZoneDCGrid(data, kpiViewJSON) {
		try {
			let tiers = kpiViewJSON.tiers.split(',');
			this.$kpiDataObj["grid_" + kpiViewJSON.DCs.split(",").join("!")] = this.getDCDataForTiers(data, kpiViewJSON, tiers);
			if (Array.isArray(kpiViewJSON.extraTiers)) { // Check if object has an array entry
				// get data for each tiers available in extraTiers property
				kpiViewJSON.extraTiers.forEach((tiers,index)=> {
					this.$kpiDataObj["grid_" + kpiViewJSON.DCs + "_" + "dummy" + (index+1)] = this.getDCDataForTiers(data, kpiViewJSON, tiers.toString().split(","));
				});
			}
		} catch (error) {
			console.error(error);
		}
	}


	/**
	 * Returns the tiers data for provided DC
	 * @param data {Object} The data received from server
	 * @param kpiViewJSON {Object} The kpiViewInfo item
	 * @param tiers {String[]} The tiers
	 * @return {Object[]} the final array items data
	 */
	getDCDataForTiers(data, kpiViewJSON, tiers) {
			let zoneArr = kpiViewJSON.zone.split(',');
			let dcKPIObj = {};
			for (var i = 0; i < tiers.length; i++) {
				if (tiers[i].trim().length != 0)
					tiers[i] = tiers[i].trim();
			}

			for (var i = 0; i < zoneArr.length; i++) {
				if (zoneArr[i].trim().length != 0)
					zoneArr[i] = zoneArr[i].trim();
			}
             
			// Creating Obj of Tier having Zones data
			for (let i = 0; i < tiers.length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (data[j].tName.indexOf(tiers[i] + '_') != -1) {
						if (dcKPIObj.hasOwnProperty(tiers[i])) {	//Zone 2

							// This if else can be removed, done to maintain order of zone as of GUI
							if (data[j].tName.indexOf(zoneArr[0]) != -1) {
								dcKPIObj[tiers[i]].unshift({
									"cpu": data[j].cpu,
									"pvs": data[j].pvs,
									"res": data[j].res,
									"zone": data[j].tName.split('_')[1]
								});
							} else {
								dcKPIObj[tiers[i]].push({
									"cpu": data[j].cpu,
									"pvs": data[j].pvs,
									"res": data[j].res,
									"zone": data[j].tName.split('_')[1]
								});
							}

							// Done for removing blank fields
							let dcObj = dcKPIObj[tiers[i]];
							let blankIndex;
							for (let i = 0; i < dcObj.length; i++) {
								if (!dcObj[i].zone) {
									blankIndex = i;
									break;
								}
							}
							if (blankIndex) {
								dcKPIObj[tiers[i]].splice(blankIndex, 1);	// To remove blank entry
							}

						} else {	// Zone 1
							dcKPIObj[tiers[i]] = [];
							dcKPIObj[tiers[i]].push({
								"cpu": data[j].cpu,
								"pvs": data[j].pvs,
								"res": data[j].res,
								"zone": data[j].tName.split('_')[1]
							});
						}

						//Pushing ZONE
						if (dcKPIObj[tiers[i]].hasOwnProperty("zones")) {
							//dcKPIObj[tiers[i]]["zones"] = zoneArr;
						} else {
							dcKPIObj[tiers[i]]["zones"] = [];
							dcKPIObj[tiers[i]]["zones"] = zoneArr;
						}

						// If length is equal to 1, for multizone, we need to add '-' for other zones
						if (dcKPIObj[tiers[i]].length === 1) {
							if (data[j].tName.split('_')[1] != zoneArr[0]) {
								//tiername_green != blue..then fill blue as blank
								dcKPIObj[tiers[i]].unshift({
									'cpu': this.$gridObj,
									'res': this.$gridObj,
									'pvs': this.$gridObj
								});
							}
							else {
								dcKPIObj[tiers[i]].push({
									'cpu': this.$gridObj,
									'res': this.$gridObj,
									'pvs': this.$gridObj
								});
							}
						}
					}
				}
			}

			// Creating Grid Strucutre using dcKPIObj
			let tierKeys = Object.keys(dcKPIObj);
			let dcKPIDataArr = [];
			for (let i = 0; i < tierKeys.length; i++) {

				// Extracting Zones
				let zone1 = dcKPIObj[tierKeys[i]]["zones"][0];
				let zone2 = dcKPIObj[tierKeys[i]]["zones"][1];
				let supportedCapacity_zone1 = dcKPIObj[tierKeys[i]][0]["pvs"].noOfVM * dcKPIObj[tierKeys[i]][0]["pvs"].lodPerVM;
				let supportedCapacity_zone2 = dcKPIObj[tierKeys[i]][1]["pvs"].noOfVM * dcKPIObj[tierKeys[i]][1]["pvs"].lodPerVM;
				let availableCapacity_zone1 = supportedCapacity_zone1 - dcKPIObj[tierKeys[i]][0]["pvs"].mint;
				let availableCapacity_zone2 = supportedCapacity_zone2 - dcKPIObj[tierKeys[i]][1]["pvs"].mint;
				// Creating data for data table
				dcKPIDataArr.push(
					{
						"tier": tierKeys[i],
						"icon": "icon kpi-tier-1",
						// Zone 1 PVS
						["pvsMint_" + zone1]: dcKPIObj[tierKeys[i]][0]["pvs"].mint,
						["pvsHr_" + zone1]: dcKPIObj[tierKeys[i]][0]["pvs"].hr,
						["pvsjpmint_" + zone1]: dcKPIObj[tierKeys[i]][0]["pvs"].jpmint,
						//  for tooltip modifying here
						["actpvsjpmint_" + zone1]: `Last 2 Min/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].jpmint)}\n Last 1 Hr/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].jphr)}\nDay's Max/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].jpdmax)}\nNo. of VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].noOfVM)}`,
						["pvsJphr_" + zone1]: dcKPIObj[tierKeys[i]][0]["pvs"].jphr,
						["pvscerCap_" + zone1]: `${dcKPIObj[tierKeys[i]][0]["pvs"].cerCap}/${dcKPIObj[tierKeys[i]][0]["pvs"].lodPerVM}`,

						/********************************************************** */
						["pvsSuppCapa_" + zone1]: supportedCapacity_zone1,
						["pvsAvailCapa_" + zone1]: availableCapacity_zone1,
						["pvsAvailCapaPerc_" + zone1]: availableCapacity_zone1 * 100/supportedCapacity_zone1,
						/********************************************************** */
						["pvsDmax_" + zone1]: dcKPIObj[tierKeys[i]][0]["pvs"].dmax,
						["pvsTotal"]: ExecDashboardUtil.getPVSTotal(dcKPIObj[tierKeys[i]][0]["pvs"].mint, dcKPIObj[tierKeys[i]][1]["pvs"].mint),
						["noOfVM_" + zone1]: dcKPIObj[tierKeys[i]][0]["pvs"].noOfVM,
						// Zone2 PVS
						["pvsMint_" + zone2]: dcKPIObj[tierKeys[i]][1]["pvs"].mint,
						["pvsHr_" + zone2]: dcKPIObj[tierKeys[i]][1]["pvs"].hr,
						["pvsjpmint_" + zone2]: dcKPIObj[tierKeys[i]][1]["pvs"].jpmint,
						["actpvsjpmint_" + zone2]: `Last 2 Min/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][1]["pvs"].jpmint)}\nLast 1 Hr/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][1]["pvs"].jphr)}\nDay's Max/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][1]["pvs"].jpdmax)}\nNo. of VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][1]["pvs"].noOfVM)}`,
						["pvsJphr_" + zone2]: dcKPIObj[tierKeys[i]][1]["pvs"].jphr,
						["pvscerCap_" + zone2]: `${dcKPIObj[tierKeys[i]][1]["pvs"].cerCap}/${ExecDashboardUtil.numberFormatWithDecimal(dcKPIObj[tierKeys[i]][1]["pvs"].lodPerVM, 0)}`,

						/********************************************************** */
						["pvsSuppCapa_" + zone2]: supportedCapacity_zone2,
						["pvsAvailCapa_" + zone2]: availableCapacity_zone2,
						["pvsAvailCapaPerc_" + zone2]: availableCapacity_zone2 * 100/supportedCapacity_zone2,
						/********************************************************** */
						["pvsDmax_" + zone2]: dcKPIObj[tierKeys[i]][1]["pvs"].dmax,
						["noOfVM_" + zone2]: dcKPIObj[tierKeys[i]][1]["pvs"].noOfVM,

						// Zone 1 RES
						["resMint_" + zone1]: ExecDashboardUtil.calculateRes(dcKPIObj[tierKeys[i]][0]["res"].mint),
						["resHr_" + zone1]: ExecDashboardUtil.calculateRes(dcKPIObj[tierKeys[i]][0]["res"].hr),
						["respctl95_" + zone1]: ExecDashboardUtil.calculateRes(dcKPIObj[tierKeys[i]][0]["res"].pctl95),
						["actrespctl95_" + zone1]: `90th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].pctl))}\n95th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].pctl95))}\n99th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].pctl99))}\nDay's Max: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].dmax))}`,

						// ZONE 2 RES
						["resMint_" + zone2]: ExecDashboardUtil.calculateRes(dcKPIObj[tierKeys[i]][1]["res"].mint),
						["resHr_" + zone2]: ExecDashboardUtil.calculateRes(dcKPIObj[tierKeys[i]][1]["res"].hr),
						["respctl95_" + zone2]: ExecDashboardUtil.calculateRes(dcKPIObj[tierKeys[i]][1]["res"].pctl95),
						["actrespctl95_" + zone2]: `90th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][1]["res"].pctl))}\n95th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][1]["res"].pctl95))}\n99th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][1]["res"].pctl99))}\nDay's Max: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][1]["res"].dmax))}`,

						// Zone 1 CPU
						["cpuMint_" + zone1]: dcKPIObj[tierKeys[i]][0]["cpu"].mint,
						["cpuHr_" + zone1]: dcKPIObj[tierKeys[i]][0]["cpu"].hr,
						["cpuDmax_" + zone1]: dcKPIObj[tierKeys[i]][0]["cpu"].dmax,
						// Zone 2 CPU
						["cpuMint_" + zone2]: dcKPIObj[tierKeys[i]][1]["cpu"].mint,
						["cpuHr_" + zone2]: dcKPIObj[tierKeys[i]][1]["cpu"].hr,
						["cpuDmax_" + zone2]: dcKPIObj[tierKeys[i]][1]["cpu"].dmax
					}
				);
		}
		return dcKPIDataArr;
	}

	/**
	 * Create Single DC Grid Data for UnZones
	 * @param data 
	 * @param kpiViewJSON 
	 */
	createDataForSingleZoneDCGrid(data, kpiViewJSON) {
		try {
			let gridObj = [];
			let tiers = kpiViewJSON.tiers.split(',');
			let dcKPIObj = {};
			let existingTiers = [];
			if (this.$kpiDataObj["grid_" + kpiViewJSON.DCs]) {
				existingTiers = this.$kpiDataObj["grid_" + kpiViewJSON.DCs].map(e=> e.tier)
			}
			// removing whitespace in tiers
			for (var i = 0; i < tiers.length; i++) {
				if (tiers[i].trim().length != 0)
					tiers[i] = tiers[i].trim();
				if (existingTiers.includes(tiers[i])) {
					tiers.splice(i,1);
				}
			}

			// Creating Obj of similar Tiers in data object and tiers object
			for (let i = 0; i < tiers.length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (data[j].tName.toString().toLowerCase() == tiers[i].toString().toLowerCase()) {
						dcKPIObj[tiers[i]] = [];
						dcKPIObj[tiers[i]].push({
							"cpu": data[j].cpu,
							"pvs": data[j].pvs,
							"res": data[j].res
						});
						break;
					}
				}
			}

			// Creating Grid Strucutre using dcKPIObj
			let tierKeys = Object.keys(dcKPIObj);
			let dcKPIDataArr = [];
			for (let i = 0; i < tierKeys.length; i++) {

				// Creating data for data table
				dcKPIDataArr.push(
					{
						"tier": tierKeys[i],
						"icon": "icon kpi-tier-1",
						// PVS
						["pvsMint"]: dcKPIObj[tierKeys[i]][0]["pvs"].mint,
						["pvsHr"]: dcKPIObj[tierKeys[i]][0]["pvs"].hr,
						["pvsjpmint"]: dcKPIObj[tierKeys[i]][0]["pvs"].jpmint,
						["actpvsjpmint"]: `Last 2 Min/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].jpmint.toFixed(2))}\n Last 1 Hr/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].jphr.toFixed(2))}\nDay's Max/VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].jpdmax.toFixed(2))}\nNo. of VM: ${this.seperateByComma(dcKPIObj[tierKeys[i]][0]["pvs"].noOfVM)}`,
						["pvsJphr"]: dcKPIObj[tierKeys[i]][0]["pvs"].jphr,
						["pvscerCap"]: `${dcKPIObj[tierKeys[i]][0]["pvs"].cerCap}/${dcKPIObj[tierKeys[i]][0]["pvs"].lodPerVM}`,
						["pvsDmax"]: dcKPIObj[tierKeys[i]][0]["pvs"].dmax,
						["noOfVM"]: dcKPIObj[tierKeys[i]][0]["pvs"].noOfVM,

						// RES
						["resMint"]: parseInt(dcKPIObj[tierKeys[i]][0]["res"].mint),
						["resHr"]: parseInt(dcKPIObj[tierKeys[i]][0]["res"].hr),
						// ["respctl95"]: parseInt(dcKPIObj[tierKeys[i]][0]["res"].pctl95),
						["respctl95"]: parseInt(dcKPIObj[tierKeys[i]][0]["res"].pctl95),
						["respctl95_tooltip"]: `90th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].pctl))}\n95th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].pctl95))}\n99th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].pctl99))}\nDay's Max: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(dcKPIObj[tierKeys[i]][0]["res"].dmax))}`,


						// CPU
						["cpuMint"]: dcKPIObj[tierKeys[i]][0]["cpu"].mint,
						["cpuHr"]: dcKPIObj[tierKeys[i]][0]["cpu"].hr,
						["cpuDmax"]: dcKPIObj[tierKeys[i]][0]["cpu"].dmax,
					}
				);

			}
			// Finally pushing in main KPI OBJ
			this.$kpiDataObj["grid_" + kpiViewJSON.DCs] = [...this.$kpiDataObj["grid_" + kpiViewJSON.DCs], ...dcKPIDataArr]
			
			console.log('Single DC KPI Obj ====', this.$kpiDataObj);
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Creating Grid data for oreder revenue
	 * @param data 
	 * @param kpiViewJSON 
	 */
	createDataForOrderRevenueGrid(data, kpiViewJSON) {
		try {

			if (data.valid == false && this.$kpiDataObj["orderRev"]) {
				return;
			}

			if (data && Object.keys(data).length == 0 &&  this.$kpiDataObj["orderRev"]) {
				return;
			}
			let orderRevObj = [];
			let orderRevnueHeaders = ["totalKohls", "webstore", "mcom", "tablet", "iphone", "android", "kiosk", "csc"];

			// Creating Order Data
			let orderKeys = Object.keys(data.orders);
			let obj = {};
			for (let i = 0; i < orderKeys.length; i++) {
				obj = {};

				for (let j = 0; j < data.orders[orderKeys[i]].length; j++) {
					obj[orderRevnueHeaders[j]] = data.orders[orderKeys[i]][j];
				}

				// Calc for Total Mobile
				obj['totalMobile'] = this.getTotalMobile([obj['mcom'], obj['tablet'], obj['iphone'], obj['android']]);

				if (orderKeys[i] === 'l1h')
					obj['updated2Min'] = 'Last 1 Hour';
				else if (orderKeys[i] === 'l5m')
					obj['updated2Min'] = 'Last 5 Min';
                                else if (orderKeys[i] === 'today') {
					if (this._config.$appliedTimePeriodStr.indexOf('Last Week') != -1 || this._config.$appliedTimePeriodStr.indexOf('Yesterday') != -1 || this._config.$appliedTimePeriodStr.indexOf('Custom') != -1 || this._config.$appliedTimePeriodStr.indexOf('Event') != -1)
					  obj['updated2Min'] = 'Total';
					else
					  obj['updated2Min'] = 'Today';
				}
				else
					obj['updated2Min'] = 'Planned';
				obj['header'] = 'Orders';
				orderRevObj.push(obj);
			}

			// Creating Revenue Data
			let revKeys = Object.keys(data.rev);
			let revObj = {};
			for (let i = 0; i < revKeys.length; i++) {
				revObj = {};

				for (let j = 0; j < data.rev[revKeys[i]].length; j++) {
					revObj[orderRevnueHeaders[j]] = data.rev[revKeys[i]][j]
				}

				// TODO: DO calc for Total Mobile
				revObj['totalMobile'] = this.getTotalMobile([revObj['mcom'], revObj['tablet'], revObj['iphone'], revObj['android']]);

				if (revKeys[i] === 'l1h')
					revObj['updated2Min'] = 'Last 1 Hour';
				else if (revKeys[i] === 'l5m')
					revObj['updated2Min'] = 'Last 5 Min';
                                else if (revKeys[i] === 'today'){
					if(this._config.$appliedTimePeriodStr.indexOf('Last Week') != -1 || this._config.$appliedTimePeriodStr.indexOf('Yesterday') != -1 || this._config.$appliedTimePeriodStr.indexOf('Custom') != -1 || this._config.$appliedTimePeriodStr.indexOf('Event') != -1) 
					  revObj['updated2Min'] = 'Total';
					else
					  revObj['updated2Min'] = 'Today';
				}
				else
					revObj['updated2Min'] = 'Planned';

				revObj['header'] = 'Revenue (USD)';
				orderRevObj.push(revObj);
			}

			// Finally pushing in main KPI OBJ
			this.$kpiDataObj["orderRev"] = orderRevObj;

		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Calculates total Mobiles
	 * @param mobileArr 
	 */
	getTotalMobile(mobileArr) {
		try {

			let sum = 0;
			let nullCounter = 0;
			for (let i = 0; i < mobileArr.length; i++) {
				if (mobileArr[i] === '-') {
					nullCounter++;
					continue;
				}
				sum += parseFloat(mobileArr[i].toString().split(",").join(""));
			}

			return (nullCounter == 4) ? '-' : sum;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Creating data for Grid Type having multiple DCs
	 * @param data 
	 * @param kpiViewJSON 
	 */
	createDataForMultiDCGrid(data, kpiViewJSON) {
		try {

			let dc = data.dc;
			data = data.t2;
			let dcs = kpiViewJSON.DCs.split(",");
			let tiers = kpiViewJSON.tiers.split(",");

			// removing whitespace in tiers
			for (var i = 0; i < tiers.length; i++) {
				if (tiers[i].trim().length != 0)
					tiers[i] = tiers[i].trim();
			}

			for (let i = 0; i < tiers.length; i++) {
				for (let j = 0; j < data.length; j++) {
					let actName = (data[j].gName) ? data[j].gName : data[j].tName;
					if (tiers[i] == actName) {
						if (this.multiDCKPIObj.hasOwnProperty(tiers[i])) {
							this.multiDCKPIObj[tiers[i]].push({
								"res": data[j].res,
								"cpu": data[j].cpu,
								"pvs": data[j].pvs,
								"dc": dc
							});
							this.multiDCKPIObj[tiers[i]].splice(1, 1);	// To remove blank entry
						} else {
							this.multiDCKPIObj[tiers[i]] = [];
							this.multiDCKPIObj[tiers[i]].push({
								"res": data[j].res,
								"cpu": data[j].cpu,
								"pvs": data[j].pvs,
								"dc": dc
							});
						}

						// If length is equal to 1, untill request for other dc does not come, add '-'
						if (this.multiDCKPIObj[tiers[i]].length === 1) {
							this.multiDCKPIObj[tiers[i]].push({
								'cpu': this.$gridObj,
								'res': this.$gridObj,
								'pvs': this.$gridObj
							});
						}
					}
				}
			}

			let tierKeys = Object.keys(this.multiDCKPIObj);
			let dcKPIDataArr = [];
			for (let i = 0; i < tierKeys.length; i++) {

				// Extracting DC
				let dc1 = this.multiDCKPIObj[tierKeys[i]][0]["dc"];
				let dc2 = this.multiDCKPIObj[tierKeys[i]][1]["dc"];


				// Creating data for data table
				dcKPIDataArr.push(
					{
						"tier": tierKeys[i],
						"icon": (FIELD_ICONS[tierKeys[i]]) ? FIELD_ICONS[tierKeys[i]] : 'icon kpi-tier-1',
						// Zone 1 PVS
						["pvsMint_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["pvs"].mint,
						["pvsHr_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["pvs"].hr,
						["pvsjpmint_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["pvs"].jpmint,
						["actpvsjpmint_" + dc1]: `Last 2 Min/VM: ${this.seperateByComma(this.multiDCKPIObj[tierKeys[i]][0]["pvs"].jpmint.toFixed(2))}\n Last 1 Hr/VM: ${this.seperateByComma(this.multiDCKPIObj[tierKeys[i]][0]["pvs"].jphr.toFixed(2))}\nDay's Max/VM: ${this.seperateByComma(this.multiDCKPIObj[tierKeys[i]][0]["pvs"].jpdmax.toFixed(2))}`,
						["pvsJphr_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["pvs"].jphr,
						["pvscerCap_" + dc1]: `${this.multiDCKPIObj[tierKeys[i]][0]["pvs"].cerCap}/${this.multiDCKPIObj[tierKeys[i]][0]["pvs"].lodPerVM}`,
                                                ["pvsDmax_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["pvs"].dmax,
						["pvsTotal"]: ExecDashboardUtil.getPVSTotal(this.multiDCKPIObj[tierKeys[i]][0]["pvs"].mint, this.multiDCKPIObj[tierKeys[i]][1]["pvs"].mint),
						// Zone2 PVS
						["pvsMint_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["pvs"].mint,
						["pvsHr_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["pvs"].hr,
						["pvsjpmint_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["pvs"].jpmint,
						["actpvsjpmint_" + dc2]: `Last 2 Min/VM: ${this.seperateByComma(this.multiDCKPIObj[tierKeys[i]][1]["pvs"].jpmint)}\nLast 1 Hr/VM: ${this.seperateByComma(this.multiDCKPIObj[tierKeys[i]][1]["pvs"].jphr)}\nDay's Max/VM: ${this.seperateByComma(this.multiDCKPIObj[tierKeys[i]][1]["pvs"].jpdmax)}`,
						["pvsJphr_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["pvs"].jphr,
						["pvscerCap_" + dc2]: `${this.multiDCKPIObj[tierKeys[i]][1]["pvs"].cerCap}/${this.multiDCKPIObj[tierKeys[i]][1]["pvs"].lodPerVM}`,
						["pvsDmax_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["pvs"].dmax,

						// Zone 1 RES
						["resMint_" + dc1]: ExecDashboardUtil.calculateRes(this.multiDCKPIObj[tierKeys[i]][0]["res"].mint),
						["resHr_" + dc1]: ExecDashboardUtil.calculateRes(this.multiDCKPIObj[tierKeys[i]][0]["res"].hr),
						["respctl95_" + dc1]: ExecDashboardUtil.calculateRes(this.multiDCKPIObj[tierKeys[i]][0]["res"].pctl95),
						["actrespctl95_" + dc1]: `90th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][0]["res"].pctl))}\n95th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][0]["res"].pctl95))}\n99th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][0]["res"].pctl99))}\nDay's Max: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][0]["res"].dmax))}`,
						// ZONE 2 RES
						["resMint_" + dc2]: ExecDashboardUtil.calculateRes(this.multiDCKPIObj[tierKeys[i]][1]["res"].mint),
						["resHr_" + dc2]: ExecDashboardUtil.calculateRes(this.multiDCKPIObj[tierKeys[i]][1]["res"].hr),
						["respctl95_" + dc2]: ExecDashboardUtil.calculateRes(this.multiDCKPIObj[tierKeys[i]][1]["res"].pctl95),
						["actrespctl95_" + dc2]: `90th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][1]["res"].pctl))}\n95th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][1]["res"].pctl95))}\n99th %Tile: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][1]["res"].pctl99))}\nDay's Max: ${this.seperateByComma(ExecDashboardUtil.calculateResForTooltip(this.multiDCKPIObj[tierKeys[i]][1]["res"].dmax))}`,

						// Zone 1 CPU
						["cpuMint_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["cpu"].mint,
						["cpuHr_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["cpu"].hr,
						["cpuDmax_" + dc1]: this.multiDCKPIObj[tierKeys[i]][0]["cpu"].dmax,
						// Zone 2 CPU
						["cpuMint_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["cpu"].mint,
						["cpuHr_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["cpu"].hr,
						["cpuDmax_" + dc2]: this.multiDCKPIObj[tierKeys[i]][1]["cpu"].dmax
					}
				);
			}
			// Finally pushing in main KPI OBJ
			this.$kpiDataObj["grid_" + this.getFinalDCNameList(kpiViewJSON.DCs.split("!")).join("!")] = dcKPIDataArr;

		} catch (error) {
			console.error(error);
		}
	}

	/* Clearing KPI Msgs*/
	clear() {
		this.kpimsgs = [];
	}
	/**
 * method to fill the field as decimal or '-' based on 
 */
	getColData(data, field) {

		// return ExecDashboardUtil.numberToCommaSeperate(parseInt(value));
		if (parseFloat(data) > 0) {
			// for case of value less than 1;
			if (parseFloat(data) < 1) {
				return "< 1";
			}
			else {
				if (field['isRoundOff'] == true || field['isRoundOff'] == 'true') {
					return ExecDashboardUtil.numberToCommaSeperate(Math.round(data));
				}
				else {
					return ExecDashboardUtil.numberToCommaSeperate(data);
				}
			}
		}
		else if (data == 0) {
			//  for case of 0;
			return '0'
		} else {
			return '-'
		}
	}

	/**
	 * method for all other than stats type. 
	 */
	getColDataForOthers(data, type) {
		// console.log("getColDataForOthers ---> ", data, typeof data);
		// for certified capacity.
		if (typeof (data) === "string" && data.indexOf("/") !== -1) {
			let arr = data.split('/');
			let newValue = '';
			for (let index = 0; index < arr.length; index++) {
				let element = arr[index];

				if (isNaN(+element)) // checking if elelment is not a number
					element = undefined;

				if (element) {
					if (index === 0) {
						newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element)) + '/';
					}
					else {
						newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element));
					}
				} else {
					if (index === 0) {
						newValue = '-' + '/';
					}
					else {
						newValue = '-';
					}
				}

			}
			if (!newValue || newValue === '' || parseFloat(newValue) < 0)
				newValue = "-"
			return newValue;
		}
		if (parseFloat(data) > 0) {
			// for case of value less than 1;
			if (parseFloat(data) < 1) {
				return "< 1";
			}
			else {
				if (type === "PVS" || type === "CPU" || type === "RES") {
					return ExecDashboardUtil.numberToCommaSeperate(Math.round(data));
				} else {
					return ExecDashboardUtil.numberToCommaSeperate(Math.round(data * 1000) / 1000);
				}
			}
		}
		else if (data == 0) {
			//  for case of 0;
			return '0'
		} else {
			return '-'
		}
	}

	/**
	 * to show the tooltip with commas, and other conditions also.
	 * @param value 
	 * @param tierName 
	 */
	seperateByComma(value, tierName?) {
		// for certified capacity.
		if (typeof (value) === "string" && value.indexOf("/") !== -1) {
			let arr = value.split('/');
			let newValue = '';
			for (let index = 0; index < arr.length; index++) {
				let element = arr[index];
				if (element === 'undefined' || element === 'null')
					element = undefined;

				if (element != null) {
					if (index === 0) {
						newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element)) + '/';
					}
					else {
						newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element));
					}
				}
			}
			if (!newValue || newValue === '' || parseFloat(newValue) < 0)
				newValue = "Data is not available"
			if (tierName) {
				return tierName + ':' + '\n' + newValue
			}
			return newValue;
		}

		if (parseFloat(value) > 0) {
			if (parseFloat(value) < 1) {
				if (tierName) {
					return tierName + ':' + '\n' + Math.round(value * 1000) / 1000;
				}
				return Math.round(value * 1000) / 1000;
			}
			else {
				if (tierName) {
					return tierName + ':' + '\n' + ExecDashboardUtil.numberToCommaSeperate(Math.round(parseFloat(value) * 1000) / 1000);
				}
				return ExecDashboardUtil.numberToCommaSeperate(Math.round(parseFloat(value) * 1000) / 1000);
			}
		}
		// for case of zero
		else if (value == 0) {
			if (tierName) {
				return tierName + ':' + '\n' + value.toString();
			}
			return value.toString();
		}
		// for negative values
		else {
			// if (value != null) {
			// 	if (tierName) {
			// 		return tierName + ':' + '\n' + value.toString();
			// 	}
			// 	return value.toString();
			// }
			// else {
			// 	if (tierName) {
			// 		return tierName + ':' + '\n' + '-'
			// 	}
			// 	return '-';
			// }
			if (tierName) {
				return tierName + ':' + '\n' + "Data is not available";
			}
			return "Data is not available";
		}
	}

	modifyViewObject(value) {
		// console.log('modifyViewObject --->  ', value)
		if (value != null) {
			if (value == 0) {
				// console.log("inside zero ");

				return 0
			} else if (value < 1) {
				return '-'
			} else {
				return ExecDashboardUtil.numberToCommaSeperate(Math.round(value));
			}
		} else {
			return '-';
		}
	}
} // end of file
