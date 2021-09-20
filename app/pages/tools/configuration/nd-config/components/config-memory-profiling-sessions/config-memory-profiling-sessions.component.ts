import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ConfigHomeService } from '../../services/config-home.service';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ConfigMemoryProfileService } from '../../services/config-memory-profile.service';
// import { MemProfSessionResponse } from '../../interfaces/memory-profile-info';
import { TreeNode } from 'primeng/api';
import * as Highcharts from 'highcharts';

@Component({
	selector: 'app-config-memory-profiling-sessions',
	templateUrl: './config-memory-profiling-sessions.component.html',
	styleUrls: ['./config-memory-profiling-sessions.component.css']
})
export class ConfigMemoryProflingSessionsComponent implements OnInit {
  highcharts = Highcharts;
	allocatioList: any;
	editSession: boolean = false;
	stackTrace: boolean = false;
	types: SelectItem[];
	selectedType: string = 'newMemoryAllocation';

	topNclassCols: any;
	topNclass: any[] = [];

	stacTracCols: any;
	stacTrac: any[] = [];
	msgBody: any[] = [];

	memProfSessionRes: Object;
	tierName: string = "";
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
	tableData: any[] = [];
	selectedClassName: string = "";
	isStackTraceDataAvailable: boolean = false;
	isNoSessionData: boolean = false;
	isShowSessions: boolean = false;
	isShowSessionData: boolean = false;
	isOpenDeletedDialog: boolean = false;
	selectedSessionData: any;
	activeProjectIndex: boolean = false;
	chartOptions = [{ label: "Total Allocation", value: "Total Allocation" }, { label: "Total Objects Created", value: "Total Objects Created" }, { label: "Single Object Size", value: "Single Object Size" }];
	pieCharts: Object;
	chartArr: any[];
	selectedChart: string = "Total Allocation";
	isSessionInProgress: boolean = false;
	totalAllocArr: any[] = [];
	clickedSessionData: any;
	lineCharts: Object;
	message: any[] = [];
	selectedRow: any;
  topNClassLabel: any;

	constructor(private configMemProfService: ConfigMemoryProfileService, private configUtilityService: ConfigUtilityService, private configHomeService: ConfigHomeService, private configTopologyService: ConfigTopologyService, private configApplicationService: ConfigApplicationService, private router: Router) {
		this.types = [
			{ label: 'New Memory Allocation', value: 'newMemoryAllocation' },
			{ label: 'Memory Leaks', value: 'MemoryLeaks' },
		];

		this.topNclassCols = [
			{ field: 'name', header: 'Class' },
			{ field: 'count', header: 'Total Objects Created' },
			{ field: 'size', header: 'Single Object Size(KB)' },
			{ field: 'totalSize', header: 'Total Allocation(MB)' },
		];

		this.stacTracCols = [
			{ field: 'name', header: 'Stack Trace' },
			{ field: 'size', header: 'Count' },
		];

		this.getMemProfData();
	}

	ngOnInit() {
		//Get the memory Profiling Data

	}
	//Open the dialog on delete button click
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
		//delete session
		this.msgBody = ["MemoryProfiling_01_" + this.selectedSessionData.sessionName + "_" + this.selectedSessionData.id + "_" + this.selectedSessionData.tierName + "_" + this.selectedSessionData.serverName + "_" + this.selectedSessionData.instanceName + ".json", "memoryProfiler", "MemoryProfiling_01_" + this.selectedSessionData.sessionName + "_" + this.selectedSessionData.id + "_" + this.selectedSessionData.tierName + "_" + this.selectedSessionData.serverName + "_" + this.selectedSessionData.instanceName + ".properties"];
		// this.msgBody = ["HeapMemory_" + this.selectedSessionData.tierName + "_" + this.selectedSessionData.serverName + "_" + this.selectedSessionData.instanceName + "_" + this.selectedSessionData.txnId + ".json"]
		this.configMemProfService.deleteMemProfSession(+ this.selectedSessionData.id, this.msgBody).subscribe(recData => {
			this.isOpenDeletedDialog = false;
			this.getMemProfData();
		});
	}

	selectedSessionDetails(sessionDetails, index) {
    this.topNClassLabel = 'N';
    let configurationArr = sessionDetails['configuration'].split(";");
    if(configurationArr[3] != null && configurationArr[3].includes('topNClassToInstrument='))
      this.topNClassLabel =  configurationArr[3].split("=")[1];
    else
      this.topNClassLabel = 'N';
		this.clickedSessionData = sessionDetails;
		this.topNclass = [];
		this.totalSizeArray = [];
		this.countArray = [];
		this.maxLiveSizeArray = [];
		this.chartArrCount = [];
		this.chartArrTotalSize = [];
		this.chartArrLiveSize = [];
		this.totalAllocArr = [];
		this.stacTrac = [];
		//save tier, server and Instance name.
		this.tierName = this.allocatioList[index].tierName;
		this.serverName = this.allocatioList[index].serverName;
		this.instanceName = this.allocatioList[index].instanceName;
		this.duration = this.allocatioList[index].duration;
		this.activeProjectIndex = index;
		this.isNoSessionData = false;
		this.isShowSessionData = false;
		// let str = ["/home/cavisson/work/instrprof/.memory_profiler/HeapMemory_" + sessionDetails.tierName + "_" + sessionDetails.serverName + "_" + sessionDetails.instanceName + "_" + sessionDetails.txnId + ".json"];
		// let str = ["MemoryProfiling_01_"+ this.selectedSessionData.sessionName + "_" + this.selectedSessionData.id + "_" + this.selectedSessionData.tierName+"_"+this.selectedSessionData.serverName+"_"+this.selectedSessionData.instanceName+".json", "memoryProfiler", "MemoryProfiling_01_"+ this.selectedSessionData.sessionName + "_" + this.selectedSessionData.id + "_" + this.selectedSessionData.tierName+"_"+this.selectedSessionData.serverName+"_"+this.selectedSessionData.instanceName+".properties"];
		// let str = ["MemoryProfiling_01_HeapProfilingSession18_21_ST1_SS1_SI1_2.json", "memoryProfiler", "MemoryProfiling_01_HeapProfilingSession18_21_1616055947329.properties"];
		let str = ["MemoryProfiling_01_"+ sessionDetails.sessionName + "_" + sessionDetails.id + "_" + sessionDetails.tierName+"_"+sessionDetails.serverName+"_"+sessionDetails.instanceName+".json", "memoryProfiler", "MemoryProfiling_02_"+ sessionDetails.sessionName + "_" + sessionDetails.id + "_" + sessionDetails.tierName+"_"+sessionDetails.serverName+"_"+sessionDetails.instanceName+".properties"];
		this.configMemProfService.getSessionResponse(str).subscribe(data => {
			this.memProfSessionRes = data;
			// this.tableData = [];
			// this.tableData.push(data);
			if (sessionDetails.status != 'In progress') {
				this.isSessionInProgress = false;
				if (this.memProfSessionRes['profiler_data'] == null || Object.keys(this.memProfSessionRes['profiler_data'].stackTraceSizeCountMap).length == 0) {
					this.isNoSessionData = true;
					return;
				}
			} else {
				this.isSessionInProgress = true;
				this.isShowSessionData = true;
				return;
			}
			this.isShowSessionData = true;
			//Convering into GB & fixed decimal values by 3 places.
			if(this.memProfSessionRes['profiler_data'] != null) {
				this.memProfSessionRes['profiler_data'].heapMaxSize = +(this.memProfSessionRes['profiler_data'].heapMaxSize / Math.pow(1024, 3)).toFixed(3);
				this.memProfSessionRes['profiler_data'].usedHeapBefore = +(this.memProfSessionRes['profiler_data'].usedHeapBefore / Math.pow(1024, 3)).toFixed(3);
				this.memProfSessionRes['profiler_data'].usedHeapAfter = +(this.memProfSessionRes['profiler_data'].usedHeapAfter / Math.pow(1024, 3)).toFixed(3);
				this.memProfSessionRes['profiler_data'].freeHeapBefore = +(this.memProfSessionRes['profiler_data'].freeHeapBefore / Math.pow(1024, 3)).toFixed(3);
				this.memProfSessionRes['profiler_data'].freeHeapAfter = +(this.memProfSessionRes['profiler_data'].freeHeapAfter / Math.pow(1024, 3)).toFixed(3);
			}

			let arrCount = [];
			let arrSize = [];
			for (const [key, value] of Object.entries(this.memProfSessionRes['profiler_data'].stackTraceSizeCountMap)) {
				for (let i = 0; i < value['graph']['count'].length; i++) {
					if (arrCount[i] == null)
						arrCount[i] = 0;
					arrCount[i] = arrCount[i] + value['graph']['count'][i];
				}

				for (let i = 0; i < value['graph']['size'].length; i++) {
					if (arrSize[i] == null)
						arrSize[i] = 0;
					arrSize[i] = arrSize[i] + value['graph']['size'][i];
				}

				//storing data to show in topNClass table
				if (value['hashCodeStackTraceCount'] != null) {
					this.topNclass.push({
						name: key,
						size: (value['size'] / 1024).toFixed(3),
						count: value['count'],
						totalSize: (value['totalSize'] / Math.pow(1024, 2)).toFixed(3),
						stackTrace: value['hashCodeStackTraceCount']
					});
				}
				//Storing data into array to display in pie chart.
				this.maxLiveSizeArray.push({ name: key, value: value['size'] });
				this.countArray.push({ name: key, value: value['count'] });
				this.totalSizeArray.push({ name: key, value: value['totalSize'] });
				this.totalAllocArr.push(value['totalSize']);
			}

			
			// this.getChartData(this.chartArrTotalSize);
      this.changeGraph();
			this.getSplineData(arrSize, arrCount, sessionDetails);
			//Sorting the topNclass table on the basis of count column.
			// this.topNclass.sort((a, b) => Number(b.count) - Number(a.count));
			this.selectedRow = this.topNclass[0];
			this.getSelectedClassData(this.selectedRow);
		});
	}

	getMemProfData() {
		this.configMemProfService.getMemProfSessionData("memoryProfiler").subscribe(data => {
			this.allocatioList = data;
			//Modifying time to display on UI.
			for (let i = 0; i < this.allocatioList.length; i++) {
				this.allocatioList[i].startTime = this.allocatioList[i].startTime;
				this.allocatioList[i].splitStartTime = this.allocatioList[i].startTime.split(" ")[1];
				this.allocatioList[i].duration = +this.allocatioList[i].duration / 60;
			}
			//setting the boolean variable for showing the message on UI
			if (this.allocatioList.length != 0)
				this.isShowSessions = true;
			else
				this.isShowSessions = false;
		});
	}

	redirectMemProfToInstance() {
		let dcId;
		let testRunNo = sessionStorage.getItem("isTrNumber");
		if (testRunNo == "null") {
			this.configUtilityService.errorMessage("Run a Session to Start Memory Profiling");
			return;
		}

		if (sessionStorage.getItem("isSwitch") === 'false') {
			this.configUtilityService.errorMessage("Please enable Session toggle button for Memory Profiling");
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
    this.chartArrCount = [];
    this.chartArrLiveSize = [];
    this.chartArrTotalSize = [];
		//Changing the graph from the dropdown
		if (this.selectedChart == 'Total Objects Created') {
      this.countArray = this.countArray.sort(function(a, b){return b.value-a.value});
      if (this.countArray.length != 0) {
        for (let i = 0; i < this.countArray.length; i++) {
          this.chartArrCount.push([this.countArray[i].name, this.countArray[i].value]);
        }
      }
			this.getChartData(this.chartArrCount);
		} else if (this.selectedChart == 'Single Object Size') {
      this.maxLiveSizeArray = this.maxLiveSizeArray.sort(function(a, b){return b.value-a.value});
      if (this.maxLiveSizeArray.length != 0) {
        for (let i = 0; i < this.maxLiveSizeArray.length; i++) {
          this.chartArrLiveSize.push([this.maxLiveSizeArray[i].name, this.maxLiveSizeArray[i].value]);
        }
      }
			this.getChartData(this.chartArrLiveSize);
		} else {
      this.totalSizeArray = this.totalSizeArray.sort(function(a, b){return b.value-a.value});
      if (this.totalSizeArray.length != 0) {
        for (let i = 0; i < this.totalSizeArray.length; i++) {
          this.chartArrTotalSize.push([this.totalSizeArray[i].name, this.totalSizeArray[i].value]);
        }
      }
			this.getChartData(this.chartArrTotalSize);
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

	getSelectedClassData(data) {
		this.selectedClassName = data.name;
		if(this.memProfSessionRes['profiler_data'].stackTraceSizeCountMap != null) {
			for (const [key, value] of Object.entries(this.memProfSessionRes['profiler_data'].stackTraceSizeCountMap)) {
				if (data.name == key) {
					let chartArrSize = [];
					for (let i = 0; i < value['graph']['size'].length; i++) {
						chartArrSize.push([data.name, value['graph']['size'][i]])
					}
					this.getSplineData(chartArrSize, value['graph']['count'], this.clickedSessionData)
				}
			}
		}
		this.stacTrac = [];
		if(data['stackTrace'] != null && this.memProfSessionRes['properties_file']) {
			for (const [key, value] of Object.entries(data['stackTrace'])) {
				for (const [key1] of Object.entries(this.memProfSessionRes['properties_file'])) {
					if (key == key1) {
						// console.log("Stack Trace =========> ", this.memProfSessionRes['properties_file'][key1].replaceAll(",", "\n"));
						// let str = 'X, Y, Z, A, B, C, D, E, F, G, H, I, J, K';
						// console.log("STR ===========================> ", str.replace(/,/g, "\n"))
						// str = str.replace(/,/g, "\n");
						// console.log("STR ===========================> ", str)
						this.stacTrac.push({
								"name": this.memProfSessionRes['properties_file'][key1].replace(/,/g, ",\n"),
								"size": value,
						});
					}
				}
			}
		}
		if (this.stacTrac.length == 0) {
			this.isStackTraceDataAvailable = false;
		} else {
			this.isStackTraceDataAvailable = true;
		}
	}

	getSplineData(arrSize, arrCount, selectedSessionData) {
		let timeDurationArr: any[] = [];
		let durationArr = [];
		timeDurationArr = this.getTimeDurationArr(selectedSessionData);

		//Showing only size and count of second phase(i.e, in stackTraceSizeCountMap object).
		let lengthDiff = timeDurationArr.length - arrSize.length;
		for (let i = lengthDiff; i < timeDurationArr.length; i++)
			durationArr.push(timeDurationArr[i]);

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
			xAxis: {
				categories: durationArr
			},
			yAxis: {
				title: {
					// text: "Size (bytes)"
					text: ""
				}
			},
			lineWidth: 2,
			tooltip: {
				crosshairs: true,
				shared: true,
			},
			series: [{
				data: arrSize,
				name: 'Size(b)'
			},
			{
				data: arrCount,
				name: 'Count'
			}
			]
		};
	}
}