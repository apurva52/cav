import { Component, OnInit } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/api';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ConfigHomeService } from '../../services/config-home.service';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ConfigMemoryProfileService } from '../../services/config-memory-profile.service';
// import { MemProfSessionResponse } from '../../interfaces/memory-profile-info';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';

@Component({
	selector: 'app-config-mutex-lock-sessions',
	templateUrl: './config-mutex-lock-sessions.component.html',
	styleUrls: ['./config-mutex-lock-sessions.component.css']
})
export class ConfigMutexLockSessionsComponent implements OnInit {
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
	constructor(private http: HttpClient, private configMemProfService: ConfigMemoryProfileService, private configUtilityService: ConfigUtilityService, private configHomeService: ConfigHomeService, private configTopologyService: ConfigTopologyService, private configApplicationService: ConfigApplicationService, private router: Router) {
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
			{ field: 'name', header: 'Name'},
			{ field: 'totalBlockingTime', header: 'Blocking Time'},
			{ field: 'blockingCount', header: 'Lock Acquired Count'},
			{ field: 'blockCount', header: 'Blocked Thread Count'},
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
		this.getMutexLockData();
	}

	showDeleteDialog(sessionDetails) {
		//Do not delete session if it is running.
		if (sessionDetails.status == 'In progress') {
			this.configUtilityService.errorMessage("Running Session cannot be deleted.");
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
		if(configurationArr[3] != null && configurationArr[2].includes('topNMutexlocks='))
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
		//Creating MsgBody to fetch the selected Sessions data.
		let str = ["MutexProfiling_01_" + sessionDetails.sessionName + "_" + sessionDetails.id + "_" + sessionDetails.tierName + "_" + sessionDetails.serverName + "_" + sessionDetails.instanceName + ".json", "mutexLock", "MutexProfiling_02_" + sessionDetails.sessionName + "_" + sessionDetails.id + "_" + sessionDetails.tierName + "_" + sessionDetails.serverName + "_" + sessionDetails.instanceName + ".properties"];
		//let str = ["MutexProfiling_01_session_11_30_28320_Default_Localhost_Instance2_111.json", "mutexLock", "MutexProfiling_01_session_11:30_28320_Default_Localhost_Instance2_111.properties"];
		this.configMemProfService.getSessionResponse(str).subscribe(data => {
			this.mutexSessionRes = data;
			//If session is not in progress then show the session data, else display some message.
			if (sessionDetails.status != 'In progress') {
				this.isSessionInProgress = false;
				if (this.mutexSessionRes['lock_data'] == null || this.mutexSessionRes['lock_data'] == undefined) {
					this.isNoSessionData = true;
					return;
				}
			} else {
				this.isSessionInProgress = true;
				this.isShowSessionData = true;
				return;
			}
			this.isShowSessionData = true;
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
		});
	}
	//Method to add a new session from Application Topo Tree
	redirectMemProfToInstance() {
		let dcId;
		let testRunNo = sessionStorage.getItem("isTrNumber");
		if (testRunNo == "null") {
			this.configUtilityService.errorMessage("Run a Session to Start Mutex Lock Profiling.");
			return;
		}

		if (sessionStorage.getItem("isSwitch") === 'false') {
			this.configUtilityService.errorMessage("Please enable Session toggle button for Mutex Lock Profiling.");
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
    
	  if (this.selectedChart == 'Total Count') {
	    //Sorting Count Arr to show the legends in Descending order
	    this.countArray = this.countArray.sort(function(a, b){return b.value-a.value});
            if (this.countArray.length != 0) {
              for (let i = 0; i < this.countArray.length; i++) {
		//Creating Arr to display chart
                this.chartArrCount.push([this.countArray[i].name, this.countArray[i].value]);
              }
            }
	    this.getChartData(this.chartArrCount);
	  } else if (this.selectedChart == 'Total Wait Time') {
	    //Sorting Wait Arr to show the legends in Descending order
	    this.totalWaitTimeArr = this.totalWaitTimeArr.sort(function(a, b){return b.value-a.value});
            if (this.totalWaitTimeArr.length != 0) {
              for (let i = 0; i < this.totalWaitTimeArr.length; i++) {
		//Creating Arr to display chart
                this.totalWaitTimeArray.push([this.totalWaitTimeArr[i].name, this.totalWaitTimeArr[i].value]);
              }
            }
            this.getChartData(this.totalWaitTimeArray);
          } else {
	    //Sorting Block Arr to show the legends in Descending order
	    this.totalBlockTimeArr = this.totalBlockTimeArr.sort(function(a, b){return b.value-a.value});
            if (this.totalBlockTimeArr.length != 0) {
              for (let i = 0; i < this.totalBlockTimeArr.length; i++) {
		//Creating Arr to display chart
                this.totalBlockTimeArray.push([this.totalBlockTimeArr[i].name, this.totalBlockTimeArr[i].value]);
              }
            }
	    this.getChartData(this.totalBlockTimeArray);
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

	getSplineData(arrSize, arrCount) {
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
			yAxis: {
				title: {
					text: ""
				}
			},
			legend: 'false',
			tooltip: {
				valueSuffix: " bytes"
			},
			series: [{
				data: arrSize
			},
			{
				data: arrCount
			}
			]
		};
	}

	getSelectedClassData(selectedRowData) {
		this.selectedThreadName = selectedRowData.name;
		this.stackTraceData = [];
		if(this.mutexSessionRes.hasOwnProperty('properties_file') && this.mutexSessionRes['properties_file'] != null) {
			for (const [key, value] of Object.entries(this.mutexSessionRes['properties_file'])) {
				for (const [key1, value1] of Object.entries(selectedRowData['stackTrace'])) {
					// If key of properties file matches the key of selected row then show its stack trace.
					if (key == key1) {
						this.stackTraceData.push({
							//Replacing ',' in stack trace with ',\n' for proper display in UI.
							"name": this.mutexSessionRes['properties_file'][key].replace(/,/g, ",\n"),
							"count": value1['count'],
						});
					}
				}
			}
		}
	}

	changeMutexUI() {
		this.stackTraceData = [];
		this.totalBlockTime = 0;
		this.totalWaitTime = 0;
		if (this.selectedType == 'topBlockedThreads')
			this.populateTopNTable(this.mutexSessionRes['blockedLock_data']);
		else if (this.selectedType == 'topBlockingLocks')
			this.populateTopNTable(this.mutexSessionRes['lock_data']['lockmap']);
		else
			this.populateTopNTable(this.mutexSessionRes['lock_data']['blockingThreads']);
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
		//Populating The topNLocks table.
		if (sessionData != null || sessionData != undefined) {
			for (const [key, value] of Object.entries(sessionData)) {
				childrenArr = [];
				if(this.selectedType !== 'topBlockingThreads') {
				this.topNLocks.push({
					data: {
						"name": key,
						"count": value['count'],
						"totalBlockTime": value['totalBlockTime'].toFixed(3),
						"totalWaitTime": value['totalWaitTime'].toFixed(3),
					},
					children: childrenArr
				});
				this.countArray.push({ name: key, value: value['count'] });
				this.totalBlockTimeArr.push({ name: key, value: value['totalBlockTime'] });
				this.totalWaitTimeArr.push({ name: key, value: value['totalWaitTime'] });
				//Adding total Block Time and total wait time to be displayed in the UI.
				this.totalBlockTime += value['totalBlockTime'];
				this.totalWaitTime += value['totalWaitTime'];
				if(sessionData[key]['threadbean'] != null || sessionData[key]['threadbean'] != undefined) {
					for (const [key1, value1] of Object.entries(sessionData[key]['threadbean'])) {
						if(value1['stacktracebean'] != null) {
							childrenArr.push({
								"data": {
									"name": key1,
									"count": value1['count'],
									"totalBlockTime": value1['totalBlockTime'].toFixed(3),
									"totalWaitTime": value1['totalWaitTime'].toFixed(3),
									"stackTrace": value1['stacktracebean']
								}
							});
						}
					}
				}
			} else {
					this.blockingThread.push({
						name: key,
						blockCount : value['blockCount'],
						blockingCount: value['blockingCount'],
						totalBlockingTime: value['totalBlockingTime'],
						stackTrace: value['stacktracebean'],
					});
				this.totalBlockTime += value['totalBlockingTime'];
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

			if(this.selectedType !== 'topBlockingThreads') {
	      			this.changeGraph();
				this.getSplineData(this.totalAllocArr, []);
				this.topNLocks.sort((a, b) => Number(b.data.totalBlockTime) - Number(a.data.totalBlockTime));
				this.selectedNode1 = this.topNLocks[0]['children'][0]['data'];
				//Getting the stack Trace of topmost thread by default.
				this.getSelectedClassData(this.selectedNode1);
			}
		}
	}
}
