import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { ConfigUtilityService } from '../../configuration/nd-config/services/config-utility.service';
import { ConfigApplicationService } from '../../configuration/nd-config/services/config-application.service';
import { ConfigTopologyService } from '../../configuration/nd-config/services/config-topology.service';
import { ConfigHomeService } from '../../configuration/nd-config/services/config-home.service';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../configuration/nd-config/constants/config-url-constant';
import { ConfigMemoryProfileService } from '../../configuration/nd-config/services/config-memory-profile.service';
// import { MemProfSessionResponse } from '../../interfaces/memory-profile-info';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import { SessionService } from 'src/app/core/session/session.service';
import { TRData } from '../../configuration/nd-config/interfaces/main-info';

@Component({
	selector: 'app-mutex-lock-sessions',
	templateUrl: './mutex-lock-sessions.component.html',
	styleUrls: ['./mutex-lock-sessions.component.css']
})
export class MutexLockSessionsComponent implements OnInit {
	highcharts = Highcharts;
	allocatioList: any;
	editSession: boolean = false;
	stackTrace: boolean = false;
	types: SelectItem[];
	selectedType: string = 'topBlockingLocks';
	topNclass: any[] = [];
	stacTracCols: any;
	topNLocks: TreeNode[] = [];
	msgBody: any[] = [];
	serverName: string = "";
	instanceName: string = "";
	duration: string = "";
	maxLiveSizeArray: { name: string, value: any }[] = [];
	countArray: { name: string, value: any }[] = [];
	totalSizeArray: { name: string, value: any }[] = [];
	chartArrCount: any[] = [];
	chartArrTotalSize: any[] = [];
	chartArrLiveSize: any[] = [];
	noSessionDataAvailable: boolean = false;
	topNLocksCols: any[];
	totalBlockTime: number = 0;
	totalWaitTime: number = 0;
	totalBlockTimeArr: any;
	totalWaitTimeArr: any;
	totalBlockTimeArray: any;
	totalWaitTimeArray: any;
	mutexSessionRes: Object;
	isNoSessionData: boolean = false;
	blockingThread: any[] = [];
	topBlockingThreadCol: any[] = [];
	totalBlockTimeMins: number;
	totalBlockTimeSecs: number;
	totalWaitTimeMins: number;
	totalWaitTimeSecs: number;

	blockTimeArr: any[] = [];
	lockAcquireArr: any[] = [];
	blockedThrdArr: any[] = [];
	blockTimeGraphArr: any[] = [];
	lockAcquireGraphArr: any[] = [];
	blockedThrdGraphArr: any[] = [];
	clickedSessionData: any;
	isProgressBar: any;
	isNoData: boolean = false;
	noDataMessage: string = "";
	selectedSessionName: any;

	showeditSession() {
		this.editSession = true;
	}
	showestackTrac() {
		this.stackTrace = true;
	}

	isShowSessions: boolean = false;
	isShowSessionData: boolean = false;
	isOpenDeletedDialog: boolean = false;
	selectedSessionData: any;
	activeProjectIndex: boolean = false;
	chartOptions = [{ label: "Total Count", value: "Total Count" }, { label: "Total Wait Time", value: "Total Wait Time" }, { label: "Total Block Time", value: "Total Block Time" }];
	pieCharts: Object;
	selectedChart: string = "Total Block Time";
	isSessionInProgress: boolean = false;
	totalAllocArr: any[] = [];
	mutexLockData: any;
	stackTraceData: any[] = [];
	selectedThreadName: string = "";
	selectedNode1: any;
	tierName: string = "";
	topNLocksLabel: any;
	trData: TRData;
	constructor(private messageService: MessageService, private configMemProfService: ConfigMemoryProfileService, private configUtilityService: ConfigUtilityService, private configHomeService: ConfigHomeService, private configTopologyService: ConfigTopologyService, private configApplicationService: ConfigApplicationService, private router: Router
		, private sessionService: SessionService) {
		this.configUtilityService.progressBarProvider$.subscribe(flag => {
			// For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
			setTimeout(() => {
				this.isProgressBar = flag['flag'];
			}, 1);

		});
		//Types of Split button
		this.types = [
			{ label: 'Top Blocking Locks', value: 'topBlockingLocks' },
			{ label: 'Top Blocked Threads', value: 'topBlockedThreads' },
			{ label: 'Top Blocking Threads', value: 'topBlockingThreads' },
		];
		//Columns of TopNLocks Table
		this.topNLocksCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'count', header: 'Count' },
			{ field: 'totalBlockTime', header: 'BlockTime(sec)' },
			{ field: 'totalWaitTime', header: 'WaitTime(sec)' },
		];
		//Columns of Stack Trace Table
		this.stacTracCols = [
			{ field: 'name', header: 'Stack' },
			{ field: 'count', header: 'Count' },
		];
		//Columns for Top Blocking Threads Screen.
		this.topBlockingThreadCol = [
			{ field: 'name', header: 'Name' },
			{ field: 'totalBlockingTime', header: 'Blocking Time' },
			{ field: 'blockingCount', header: 'Lock Acquired Count' },
			{ field: 'blockCount', header: 'Blocked Thread Count' },
		];
	}

	// ---------------line charts----------------
	lineCharts = {
		chart: {
			type: "spline"
		},
		title: {
			text: ""
		},
		subtitle: {
			text: ""
		},
		colors: ['#17a0b3', '#f7912d', '#413684', '#de2c3a'],
		// xAxis:{
		//    categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		// },
		xAxis: {
			categories: [],
		},
		yAxis: {
			title: {
				text: ""
			}
		},
		legend: 'false',
		tooltip: {
			valueSuffix: " °C"
		},
		series: [{
			data: [7.0, 15.9, 25.5, 40.5, 18.2, 50.5]
		},
		{
			data: [3.9, 30.2, 35.7, 18.5, 11.9, 65.2]
		}]
	};


	ngOnInit() {
		this.configHomeService.getTestRunStatus().subscribe(data => {
			this.trData = data.trData;
		});
		this.getMutexLockData();
	}

	showDeleteDialog(sessionDetails) {
		//Do not delete session if it is running.
		if (sessionDetails.status == 'In progress') {
			this.messageService.add({severity: 'error', summary: 'Error', detail: "Running Session cannot be deleted."});
			return;
		}
		this.isOpenDeletedDialog = true;
		this.selectedSessionData = sessionDetails;
	}



	deleteSession() {
		//Creating MsgBosy for deleting a session.
		this.msgBody = ["MutexProfiling_01_" + this.selectedSessionData.sessionName + "_" + this.selectedSessionData.id + "_" + this.selectedSessionData.tierName + "_" + this.selectedSessionData.serverName + "_" + this.selectedSessionData.instanceName + ".json", "mutexLock", "MutexProfiling_02_" + this.selectedSessionData.sessionName + "_" + this.selectedSessionData.id + "_" + this.selectedSessionData.tierName + "_" + this.selectedSessionData.serverName + "_" + this.selectedSessionData.instanceName + ".properties"];
		this.configMemProfService.deleteMemProfSession(+this.selectedSessionData.id, this.msgBody).subscribe(recData => {
			this.isOpenDeletedDialog = false;
			this.getMutexLockData();
		});
	}


	selectedSessionDetails(sessionDetails, index) {
		//Fetching total number of Locks to be displayed in place of 'N' in topNLocks Table.
		this.topNLocksLabel = 'N';
		let configurationArr = sessionDetails['configuration'].split(";");
		if (configurationArr[3] != null && configurationArr[2].includes('topNMutexlocks='))
			this.topNLocksLabel = configurationArr[2].split("=")[1];
		else
			this.topNLocksLabel = 'N';

		this.tierName = this.allocatioList[index].tierName;
		this.serverName = this.allocatioList[index].serverName;
		this.instanceName = this.allocatioList[index].instanceName;
		this.duration = this.allocatioList[index].duration;
		this.isNoSessionData = false;
		this.isShowSessionData = false;
		this.selectedType = "topBlockingLocks";
		this.activeProjectIndex = index;
		this.isNoData = false;
		this.isSessionInProgress = false;
		this.selectedSessionName = sessionDetails.sessionName;
		//Creating MsgBody to fetch the selected Sessions data.
		let str = ["MutexProfiling_01_" + sessionDetails.sessionName + "_" + sessionDetails.id + "_" + sessionDetails.tierName + "_" + sessionDetails.serverName + "_" + sessionDetails.instanceName + ".json", "mutexLock", "MutexProfiling_02_" + sessionDetails.sessionName + "_" + sessionDetails.id + "_" + sessionDetails.tierName + "_" + sessionDetails.serverName + "_" + sessionDetails.instanceName + ".properties"];
		//let str = ["MutexProfiling_01_session_11_30_28320_Default_Localhost_Instance2_111.json", "mutexLock", "MutexProfiling_01_session_11:30_28320_Default_Localhost_Instance2_111.properties"];
		// this.http.post('http://localhost:8090/custom/memoryprof/readsessionresponse', str).subscribe(data => {
		this.configMemProfService.getSessionResponse(str).subscribe(data => {
			this.mutexSessionRes = data;
			//If session is not in progress then show the session data, else display some message.
			if (sessionDetails.status != 'In progress') {
				this.isSessionInProgress = false;
				if (this.mutexSessionRes == null || this.mutexSessionRes['lock_data'] == null || this.mutexSessionRes['lock_data'] == undefined) {
					this.isNoSessionData = true;
					return;
				}
			} else {
				this.isSessionInProgress = true;
				this.isShowSessionData = true;
				return;
			}
			this.isShowSessionData = true;

			this.clickedSessionData = sessionDetails;
			//Populating data in topNLocks Table.
			this.populateTopNTable(this.mutexSessionRes['lock_data']['lockmap']);
		});
	}

	getMutexLockData() {
		this.configMemProfService.getMemProfSessionData("mutexLock").subscribe(data => {
			this.allocatioList = data;
			//Modifying time to display on UI.
			for (let i = 0; i < this.allocatioList.length; i++) {
				this.allocatioList[i].startTime = this.allocatioList[i].startTime;
				this.allocatioList[i].splitStartTime = this.allocatioList[i].startTime.split(" ")[1];
				this.allocatioList[i].duration = +this.allocatioList[i].duration / 60;
			}
			if (this.allocatioList.length != 0)
				this.isShowSessions = true;
			else
				this.isShowSessions = false;

			this.selectedSessionDetails(this.allocatioList[0], 0);
		});
	}
	//Method to add a new session from Application Topo Tree
	redirectMemProfToInstance() {
		let dcId;
		let testRunNo = this.trData.trNo;
		if (testRunNo == null) {
			this.messageService.add({severity: 'error', summary: 'Error', detail: "Run a Session to Start Mutex Lock Profiling."});
			return;
		}

		if (this.trData.switch === false) {
			this.messageService.add({severity: 'error', summary: 'Error', detail: "Please enable Session toggle button for Mutex Lock Profiling."});
			return;
		}

		if (this.configHomeService.getTestRunStatus)
			this.configTopologyService.getTopologyDCID(testRunNo).subscribe(data => {
				dcId = data;

				sessionStorage.setItem("showserverinstance", "true");
				this.configApplicationService.getApplicationList().subscribe(data => {
					for (let i = 0; i < data.length; i++) {
						if (data[i].dcId.toString() == dcId) {
							this.configApplicationService.applicationNameObserver(data[i].appName)
							this.router.navigate([ROUTING_PATH + '/tree-main/' + dcId]);
						}
					}
				});
			})
	}

	changeGraph() {
		this.totalBlockTimeArray = [];
		this.totalWaitTimeArray = [];
		this.chartArrCount = [];
		this.blockTimeGraphArr = [];
		this.lockAcquireGraphArr = [];
		this.blockedThrdGraphArr = [];
		if (this.selectedType != "topBlockingThreads") {
			if (this.selectedChart == 'Total Count') {
				//Sorting Count Arr to show the legends in Descending order
				this.countArray = this.countArray.sort(function (a, b) { return b.value - a.value });
				if (this.countArray.length != 0) {
					for (let i = 0; i < this.countArray.length; i++) {
						//Creating Arr to display chart
						this.chartArrCount.push([this.countArray[i].name, this.countArray[i].value]);
					}
				}
				this.getChartData(this.chartArrCount);
			} else if (this.selectedChart == 'Total Wait Time') {
				//Sorting Wait Arr to show the legends in Descending order
				this.totalWaitTimeArr = this.totalWaitTimeArr.sort(function (a, b) { return b.value - a.value });
				if (this.totalWaitTimeArr.length != 0) {
					for (let i = 0; i < this.totalWaitTimeArr.length; i++) {
						//Creating Arr to display chart
						this.totalWaitTimeArray.push([this.totalWaitTimeArr[i].name, this.totalWaitTimeArr[i].value]);
					}
				}
				this.getChartData(this.totalWaitTimeArray);
			} else {
				//Sorting Block Arr to show the legends in Descending order
				this.totalBlockTimeArr = this.totalBlockTimeArr.sort(function (a, b) { return b.value - a.value });
				if (this.totalBlockTimeArr.length != 0) {
					for (let i = 0; i < this.totalBlockTimeArr.length; i++) {
						//Creating Arr to display chart
						this.totalBlockTimeArray.push([this.totalBlockTimeArr[i].name, this.totalBlockTimeArr[i].value]);
					}
				}
				this.getChartData(this.totalBlockTimeArray);
			}
		} else {
			if (this.selectedChart == "Blocking Time") {
				//Sorting the Block Time arr to show the legends in Desc. order
				this.blockTimeArr = this.blockTimeArr.sort((a, b) => { return b.value - a.value });
				if (this.blockTimeArr.length != 0) {
					for (let i = 0; i < this.blockTimeArr.length; i++) {
						this.blockTimeGraphArr.push([this.blockTimeArr[i].name, this.blockTimeArr[i].value]);
					}
				}
				this.getChartData(this.blockTimeGraphArr);
			} else if (this.selectedChart == "Lock Acquired Count") {
				//Sorting the Lock Acquired Array to show the legend in Desc. order
				this.lockAcquireArr = this.lockAcquireArr.sort((a, b) => { return b.value - a.alue });
				if (this.lockAcquireArr.length != 0) {
					for (let i = 0; i < this.lockAcquireArr.length; i++) {
						this.lockAcquireGraphArr.push([this.lockAcquireArr[i].name, this.lockAcquireArr[i].value]);
					}
				}
				this.getChartData(this.lockAcquireGraphArr);
			} else {
				this.blockedThrdArr = this.blockedThrdArr.sort((a, b) => { return b.value - a.alue });
				if (this.blockedThrdArr.length != 0) {
					for (let i = 0; i < this.blockedThrdArr.length; i++) {
						this.blockedThrdGraphArr.push([this.blockedThrdArr[i].name, this.blockedThrdArr[i].value]);
					}
				}
				this.getChartData(this.blockedThrdGraphArr);
			}
		}
	}

	getChartData(chartArr) {
		this.pieCharts = {
			title: {
				text: this.selectedChart,
				style: {
					fontWeight: '600',
					fontSize: '11'
				}
			},
			// colors: ['#413684', '#f7912d', '#17a0b3', '#de2c3a'],
			chart: {
				plotBorderWidth: null,
				plotShadow: false
			},

			tooltip: {
				pointFormat: '<b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false,
						connectorColor: 'transparent',
						connectorPadding: 10,
						distance: 0,
						// format: '{point.name}%: {point.percentage:.1f} %',
						format: '{point.percentage:.1f} %',
					},
					showInLegend: true
				}
			},
			legend: {
				itemMarginTop: 3,
				itemMarginBottom: 3,
				borderWidth: 0,
				width: 150,
				padding: 3,
				itemStyle: {
					fontWeight: '500',
					fontSize: '11'
				},
				align: 'right',
				verticalAlign: 'top',
				layout: 'vertical',
				x: 0,
				y: 50

			},
			series: [{
				minPointSize: 2,
				innerSize: '50%',
				zMin: 0,
				type: 'pie',
				legend: 'false',
				// name: 'Currency value',
				data: chartArr,
			}]
		};
	}

	getSplineData(arrCount, selectedSessionData) {
		let timeDurationArr: any[] = [];
		let durationArr = [];
		timeDurationArr = this.getTimeDurationArr(selectedSessionData);
		let lengthDiff = timeDurationArr.length - arrCount.length;
		for (let i = lengthDiff; i < timeDurationArr.length; i++)
			durationArr.push(timeDurationArr[i]);

		if (this.selectedType !== "topBlockingLocks") {
			arrCount = [];
		}

		this.lineCharts = {
			chart: {
				type: "spline"
			},
			title: {
				text: ""
			},
			subtitle: {
				text: ""
			},
			colors: ['#17a0b3', '#f7912d', '#413684', '#de2c3a'],
			// xAxis:{
			// categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			// "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			// },
			xAxis: {
				categories: durationArr
			},
			yAxis: {
				title: {
					text: ""
				}
			},
			legend: 'false',
			tooltip: {
				valueSuffix: " bytes"
			},
			series: [
				//{
				//	data: arrSize
				//},
				{
					data: arrCount
				}
			]
		};
	}

	getSelectedClassData(selectedRowData) {
		console.log("Row Data === > ", selectedRowData);
		this.selectedThreadName = selectedRowData.name;
		this.stackTraceData = [];

		if (this.mutexSessionRes['lock_data'].lockmap != null) {
			for (const [key, value] of Object.entries(this.mutexSessionRes['lock_data'].lockmap)) {
				if (selectedRowData.name == key && this.selectedType == "topBlockingLocks") {
					let chartArrSize = [];
					for (let i = 0; i < value['graph'].length; i++) {
						chartArrSize.push([selectedRowData.name, value['graph'][i]])
					}
					this.getSplineData(chartArrSize, this.selectedSessionData)
				}
			}
		}

		if (this.mutexSessionRes.hasOwnProperty('properties_file') && this.mutexSessionRes['properties_file'] != null) {
			for (const [key, value] of Object.entries(this.mutexSessionRes['properties_file'])) {
				for (const [key1, value1] of Object.entries(selectedRowData['stackTrace'])) {
					// If key of properties file matches the key of selected row then show its stack trace.
					if (key == key1) {
						this.stackTraceData.push({
							//Replacing ',' in stack trace with ',\n' for proper display in UI.
							data: {
								name: this.mutexSessionRes['properties_file'][key].substring(1, this.mutexSessionRes['properties_file'][key].indexOf(",")),
								count: (+value1['count']).toLocaleString(),
							}, 
							children: [{
								data: {
									name: this.mutexSessionRes['properties_file'][key].replace(/,/g, ",\n\t    "),
									count: ""
								}
							}]
							
						});
					}
				}
			}
			console.log("Stack Trace ==> ");
			console.log(this.stackTraceData);
		}
	}

	changeMutexUI() {
		this.stackTraceData = [];
		this.totalBlockTime = 0;
		this.totalWaitTime = 0;
		this.totalAllocArr = [];
		this.chartOptions = [];
		this.isNoData = false;
		this.chartOptions = [{ label: "Total Count", value: "Total Count" }, { label: "Total Wait Time", value: "Total Wait Time" }, { label: "Total Block Time", value: "Total Block Time" }];
		if (this.selectedType == 'topBlockedThreads')
			this.populateTopNTable(this.mutexSessionRes['blockedLock_data']);
		else if (this.selectedType == 'topBlockingLocks')
			this.populateTopNTable(this.mutexSessionRes['lock_data']['lockmap']);
		else {
			this.chartOptions = [{ label: "Blocking Time", value: "Blocking Time" }, { label: "Lock Acquired Count", value: "Lock Acquired Count" }, { label: "Blocked Thread Count", value: "Blocked Thread Count" }];
			this.selectedChart = "Blocking Time";
			this.populateTopNTable(this.mutexSessionRes['lock_data']['blockingThreads']);
		}
	}

	populateTopNTable(sessionData) {
		this.countArray = [];
		this.chartArrCount = [];
		this.totalAllocArr = [];
		this.totalBlockTimeArray = [];
		this.totalBlockTimeArr = [];
		this.totalWaitTimeArray = [];
		this.totalWaitTimeArr = [];
		this.totalBlockTime = 0;
		this.totalWaitTime = 0;
		this.topNLocks = [];
		let childrenArr = [];
		this.blockingThread = [];
		this.totalAllocArr = [];
		this.blockedThrdArr = [];
		this.blockTimeArr = [];
		this.lockAcquireArr = [];
		//Populating The topNLocks table.
		if (sessionData != null || sessionData != undefined) {
			for (const [key, value] of Object.entries(sessionData)) {
				childrenArr = [];
				if (this.selectedType === "topBlockingLocks") {
					if (value['graph'] !== null && value['graph'] !== undefined) {
						for (let i = 0; i < value['graph'].length; i++) {
							if (this.totalAllocArr[i] == null) {
								this.totalAllocArr[i] = 0;
								this.totalAllocArr[i] = this.totalAllocArr[i] + value['graph'][i];
							}
						}
					}
				}
				if (this.selectedType !== 'topBlockingThreads') {
					this.topNLocks.push({
						data: {
							"name": key,
							"count": (+value['count']).toLocaleString(),
							"totalBlockTime": (+value['totalBlockTime'].toFixed(3)).toLocaleString(),
							"totalWaitTime": (+value['totalWaitTime'].toFixed(3)).toLocaleString(),
						},
						children: childrenArr
					});
					this.countArray.push({ name: key, value: value['count'] });
					this.totalBlockTimeArr.push({ name: key, value: value['totalBlockTime'] });
					this.totalWaitTimeArr.push({ name: key, value: value['totalWaitTime'] });
					//Adding total Block Time and total wait time to be displayed in the UI.
					this.totalBlockTime += value['totalBlockTime'];
					this.totalWaitTime += value['totalWaitTime'];
					if (sessionData[key]['threadbean'] != null || sessionData[key]['threadbean'] != undefined) {
						for (const [key1, value1] of Object.entries(sessionData[key]['threadbean'])) {
							if (value1['stacktracebean'] != null) {
								childrenArr.push({
									"data": {
										"name": key1,
										"count": (+value1['count']).toLocaleString(),
										"totalBlockTime": (+value1['totalBlockTime'].toFixed(3)).toLocaleString(),
										"totalWaitTime": (+value1['totalWaitTime'].toFixed(3)).toLocaleString(),
										"stackTrace": value1['stacktracebean']
									}
								});
							}
						}
					}
				} else {
					this.blockingThread.push({
						name: key,
						blockCount: value['blockCount'],
						blockingCount: value['blockingCount'],
						totalBlockingTime: value['totalBlockingTime'],
						stackTrace: value['stacktracebean'],
					});
					this.totalBlockTime += value['totalBlockingTime'];
					this.blockTimeArr.push({ name: key, value: value['totalBlockingTime'] });
					this.lockAcquireArr.push({ name: key, value: value['blockingCount'] });
					this.blockedThrdArr.push({ name: key, value: value['blockCount'] });
				}
			}
			//Converting time from seconds to minutes and seconds to be display.
			// 769 Seconds --> 12 Minutes and 49 Seconds
			//For Block Time
			this.totalBlockTimeMins = Math.floor(this.totalBlockTime / 60);
			this.totalBlockTimeSecs = this.totalBlockTime - this.totalBlockTimeMins * 60;
			//For Wait Time
			this.totalWaitTimeMins = Math.floor(this.totalWaitTime / 60);
			this.totalWaitTimeSecs = this.totalWaitTime - this.totalWaitTimeMins * 60;
			this.changeGraph();
			if (this.selectedType !== 'topBlockingThreads') {
				this.getSplineData(this.totalAllocArr, this.clickedSessionData);
				this.topNLocks.sort((a, b) => Number(b.data.totalBlockTime) - Number(a.data.totalBlockTime));
				console.log("Top n Locks === > ", this.topNLocks);
				this.selectedNode1 = this.topNLocks[0]?.children[0]?.data;
				//Getting the stack Trace of topmost thread by default.
				this.getSelectedClassData(this.selectedNode1);
			} else {
				this.blockingThread.sort((a, b) => Number(b.totalBlockingTime) - Number(a.totalBlockingTime));
				this.selectedNode1 = this.blockingThread[0];
				this.getSelectedClassData(this.selectedNode1);
				this.getSplineData(this.totalAllocArr, this.clickedSessionData);
			}
		} else {
			this.noDataMessage = "No Data Available For This Session."
			this.isNoData = true;
		}
	}

	getTimeDurationArr(selectedSessionData) {
		let timeDrationArr = [];
		let startTime = selectedSessionData.startTime;
		let duration = selectedSessionData.duration;
		let endTime = selectedSessionData.endTime;
		let splitst = startTime.split(" ")[1].split(":");
		let firstIndex = splitst[0] + ":" + splitst[1];
		let splitset = endTime.split(" ")[1].split(":");
		let lastIndex = splitset[0] + ":" + splitset[1];
		timeDrationArr.push(firstIndex);
		let mins = +splitst[1];
		for (let i = 1; i < duration; i++) {
			let hrs = splitst[0];
			mins = mins + 1;
			if (mins == 60) {
				mins = 0;
				hrs++;
				splitst[0] = hrs;
			}
			timeDrationArr.push(('0' + hrs).slice(-2) + ":" + ('0' + mins).slice(-2));
		}
		timeDrationArr.push(lastIndex);
		return timeDrationArr;
	}

	customSort(event, tableType) {
		if(tableType === 'topClass') {
			if (event["field"] === "count" ||
			event["field"] === "rate" ||
			event["field"] === "size" ||
			event["field"] === "totalSize") {
				if (event.order == -1) {
					var temp = (event["field"]);
					event.data = event.data.sort(function (a, b) {
						var value = Number(a[temp].replace(/,/g, ''));
						var value2 = Number(b[temp].replace(/,/g, ''));
						return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
					});
				} else {
					var temp = (event["field"]);
					event.order = -1;
					//ascending order
					event.data = event.data.sort(function (a, b) {
					var value = Number(a[temp].replace(/,/g, ''));
					var value2 = Number(b[temp].replace(/,/g, ''));
					return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
					});
				}
			} else {
				var temp = (event["field"]);
				if (event.order == -1) {
					event.data = event.data.sort(function (a, b) {
					var value = a[temp];
					var value2 = b[temp];
					return (''+value).localeCompare(value2);
					});
				} else {
					event.order = -1;
					event.data = event.data.sort(function (a, b) {
					  var value = a[temp];
					  var value2 = b[temp];
					  return (''+value2).localeCompare(value);
					});
				}
			}
		} else {
			if (event["field"] === "count") {
				if (event.order == -1) {
					var temp = (event["field"]);
					event.data = event.data.sort(function (a, b) {
						var value = Number(a['data'][temp].replace(/,/g, ''));
						var value2 = Number(b['data'][temp].replace(/,/g, ''));
						return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
					});
				} else {
					var temp = (event["field"]);
					event.order = -1;
					//ascending order
					event.data = event.data.sort(function (a, b) {
						var value = Number(a['data'][temp].replace(/,/g, ''));
						var value2 = Number(b['data'][temp].replace(/,/g, ''));
						return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
					});
				}
			}
		}
	}
}
