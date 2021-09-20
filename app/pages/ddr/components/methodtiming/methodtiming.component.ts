import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'primeng/api';
//import { InputTextModule, DataTableModule, BlockUIModule, MultiSelectModule, GrowlModule, Message } from 'primeng/primeng';
//import 'rxjs/Rx';
//import { ChartModule } from 'angular2-highcharts';
import { CommonServices } from '../../services/common.services';
import { SelectItem } from '../../interfaces/selectitem';
import { MethodTimingInterface } from '../../interfaces/methodtiming-data-info';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { MessageService } from '../../services/ddr-message.service';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
    selector: 'methodtiming',
    templateUrl: 'methodtiming.component.html',
    styleUrls: ['methodtiming.component.scss']
})
export class MethodtimingComponent implements OnInit, OnChanges {
    highcharts = Highcharts;
    @Input() columnData;
    methodTimingData: Array<MethodTimingInterface>;
    columnOptions: SelectItem[];
    originalColumnOptions = [];
    id: any; //common service id
    loading: boolean = false;
    filterCriteria: string = "";
    downloadFilterCriteria = '';
    options: Object;
    cols: any;
    chartData: Object[];
    showChart = true;
    strTitle: any;
    showAllOption = false;
    pointName: string = "";
    toggleFilterTitle = '';
    isEnabledColumnFilter: boolean = false;
    showDownLoadReportIcon: boolean = true;
    dataCount: number = 0; //total json length to show in acording tab as total
    entityName: string = "";//entity name [method/class/package name]
    restDataArrOfPie: any[]; //Other's pie chart click
    wholeData: any[]; //Original data to showall
    showDialog: boolean = false;
    nTopMethod: string = ""; //apply top n methods popup
    //activeType: string = ""; //to set which tab is active
    filterType: string = "Method(s)"; //to set in dialog as top methods/classes/packages
    headerStats: string = "Method(s) Stat";
    showCountPieChart: boolean = false;
    CountPieChartOptions: Object;
    tempMTData: any; // This is used to check codition of package and class based on which method name is appended with %40 to show hyperlink on table
    queryParams: any;
    topNText: string = "";
    limit = 50;
    offset = 0;
    reportHeader: string;
    loader: boolean = false;
    display: boolean = false;
    standselect: boolean = true;
    custselect: boolean = false;
    custom: string;
    standard: string = 'standard';
    strDate: Date;
    endDate: Date;
    strTime: string;
    endTime: string;
    standardTime: SelectItem[];
    selectedTime: any;
    msg: string;
    value: number = 1;
    trStartTime: any;
    trEndTime: any;
    visibleCols: any[];
    prevColumn;
    CompleteURL;
    URLstr;
    customFlag: boolean = false;
    screenHeight: any;
    isFilterFromSideBar: boolean = false;
    urlPramObj: any;
    fptomtFilter: any;
    msgs: Message[] = [];
    Duration: any;
    startTimeinDF: any;

    // DC variables'
    ndeCurrentInfo: any;
    ndeInfoData: any;
    protocol: string = '//';
    host = '';
    port = '';
    testRun: string;
    dcList: SelectItem[];
    selectedDC;
    showDCMenu = false;
    tempcols: any;

    filterTierName = '';
    filterServerName = '';
    filterInstanceName = '';
    completeTier = '';
    completeServer = '';
    completeInstance = '';

    showAutoInstrPopUp: boolean = false;
    argsForAIDDSetting: any[];
    agentType: string;
    vecId: any;
    displayAutoInst: boolean = false;

    private sideBarMethodTiming: Subscription;
    ignoreFlag: boolean = false;
    valuechbx: boolean = false;
    isApplied: boolean = false;
    url: string;
    filterDCName = '';
    dcProtocol: string = '//';
    showPagination: boolean = false;
    breadcrumb: BreadcrumbService;

    ngOnChanges() {
        this._ddrData.setInLogger("DDR:Flowpath", "Method Timing", "Open Method Timing Report");
        if (this.columnData != undefined) {
            this.loading = true;
            this.id = this.commonService.getData();
            this.queryParams = JSON.parse(JSON.stringify(this.columnData));

            this.screenHeight = Number(this.commonService.screenHeight) - 175;
            this.commonService.mtData = JSON.parse(JSON.stringify(this.columnData));
            this.id.mtFlag = 'true';
            this.commonService.mtData.strStartTime = this.commonService.mtData.startTimeInMs;
            if (this.commonService.mtData.fpDuration.toString().includes(','))
                this.commonService.mtData.strEndTime = Number(this.commonService.mtData.startTimeInMs) + Number(this.commonService.mtData.fpDuration.toString().replace(/,/g, ""));
            else if (this.commonService.mtData.fpDuration == '< 1') {
                this.commonService.mtData.strEndTime = Number(this.commonService.mtData.startTimeInMs) + Number(0);
            }
            else
                this.commonService.mtData.strEndTime = Number(this.commonService.mtData.startTimeInMs) + Number(this.commonService.mtData.fpDuration);
            console.log(this.columnData);
            if (this.commonService.mtData.btCatagory === 'Very Slow') {
                this.commonService.mtData.btCatagory = '12';
            }
            if (this.commonService.mtData.btCatagory === 'Slow') {
                this.commonService.mtData.btCatagory = '11';
            }
            if (this.commonService.mtData.btCatagory === 'Normal') {
                this.commonService.mtData.btCatagory = '10';
            }
            if (this.commonService.mtData.btCatagory === 'Errors') {
                this.commonService.mtData.btCatagory = '13';
            }
            this.getMethodTimigData('method', '0');
        }
    }

    ngOnInit(): void {
        this.loading = true;
        this.commonService.currentReport = "Method Timing";
        if (this._ddrData.splitViewFlag == false) {
            this.commonService.isToLoadSideBar = true;
            this.screenHeight = Number(this.commonService.screenHeight) - 105;
        }

        this.sideBarMethodTiming = this.commonService.sideBarUIObservable$.subscribe((temp) => {
            if (this.commonService.currentReport == "Method Timing") {
                this.loading = true;
                this.commonService.isFilterFromSideBar = true;
                let keys = Object.keys(temp);
                console.log('data coming from side bar to method timing report', temp);
                console.log("inside subscribe method timing ...........");
                this.getMethodTimigData('method', '0');//By defult method tab will open
            }
        });
        try {
            if (this._ddrData.splitViewFlag == false)
                this.id = this.commonService.getData();
            console.log(this.id, "in case splitvew false ");
            if (this.id.enableQueryCaching) {
                this.commonService.enableQueryCaching = this.id.enableQueryCaching;
            }
            if (this.commonService.openfptoAggMT == true) {
                // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.METHOD_TIMING);
                this.breadcrumb.add({label: 'Aggregate Method Timing', routerLink: '/ddr/methodtiming'});
            }
            else if (this._ddrData.splitViewFlag == false)
                // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.METHOD_TIMING);
                this.breadcrumb.add({label: 'Method Timing', routerLink: '/ddr/methodtiming'});

            if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
                this.id.testrun = this.commonService.testRun;
            }


            if (this.commonService.mtFlag == false && sessionStorage.getItem("dcNameList") != null && sessionStorage.getItem("dcNameList") != '' && sessionStorage.getItem("dcNameList") != undefined && sessionStorage.getItem("dcNameList") != 'undefined') {
                this.commonService.dcNameList = sessionStorage.getItem("dcNameList");
                this.commonService.tierNameList = sessionStorage.getItem("tierNameList");
                this.commonService.isAllCase = sessionStorage.getItem("isAllCase");
            }

            //this.reportHeader= 'MethodTiming Report- '+this.id.testRun;
            this.fillData();
            this.trStartTime = this.id.startTime;
            this.trEndTime = this.id.endTime;
        } catch (error) {
            console.log('error in intialization of table column ', error);
        }
        this._ddrData.passMesssage$.subscribe((mssg) => { this.showMessage(mssg) });
    }

    fillData() {

        this.setTestRunInHeader();
        this.changeColumnFilter();
        if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
            this.getDCData();
        } else {
            if (this._ddrData.splitViewFlag == false)
                this.getMethodTimigData('method', '0');//By defult method tab will open
            this.commonService.host = '';
            this.commonService.port = '';
            this.commonService.protocol = '';
            this.commonService.testRun = '';
            this.commonService.selectedDC = '';
        }


        this.cols = [
            { field: 'pN', header: 'Package', sortable: true, action: true, width: '230' },
            { field: 'cN', header: 'Class', sortable: true, action: true, width: '210' },
            { field: 'mN', header: 'Method', sortable: true, action: true, width: '260' },
            { field: 'fG', header: 'FunctionalGroup', sortable: true, action: false, width: '130' },
            { field: 'eN', header: 'Fully Qualified Name With Signature', sortable: true, action: false, width: '260' },
            { field: 'percent', header: 'Percentage', sortable: 'custom', action: true, width: '100' },
            { field: 'sTOrg', header: 'CumSelfTime(sec)', sortable: 'custom', action: true, width: '130' },
            { field: 'avgST', header: 'AvgSelfTime(ms)', sortable: 'custom', action: true, width: '130' },
            { field: 'totWT', header: 'CumWallTime(sec)', sortable: 'custom', action: false, width: '130' },
            { field: 'avgWT', header: 'AvgWallTime(ms)', sortable: 'custom', action: false, width: '130' },
            { field: 'cumCPUST', header: 'CumCpuSelfTime(sec)', sortable: 'custom', action: false, width: '130' },
            { field: 'avgCPUST', header: 'AvgCpuSelfTime(ms)', sortable: 'custom', action: true, width: '130' },
            { field: 'eC', header: 'Count', sortable: 'custom', action: true, width: '80' },
            { field: 'min', header: 'MinSelfTime(ms)', sortable: 'custom', action: false, width: '130' },
            { field: 'max', header: 'MaxSelfTime(ms)', sortable: 'custom', action: false, width: '130' },
            { field: 'variance', header: 'Variance', sortable: 'custom', action: false, width: '130' },
            { field: 'waitTime', header: 'WaitTime(ms)', sortable: 'custom', action: false, width: '130' },
            { field: 'syncTime', header: 'SyncTime(ms)', sortable: 'custom', action: false, width: '130' },
            { field: 'iotime', header: 'IOTime(ms)', sortable: 'custom', action: false, width: '130' },
            { field: 'suspensiontime', header: 'SuspensionTime(ms)', sortable: 'custom', action: false, width: '130' }
        ];
        this.tempcols = JSON.parse(JSON.stringify(this.cols)),
            this.visibleCols = ['pN', 'cN', 'mN', 'percent', 'avgST', 'sTOrg', 'avgCPUST', 'eC'];
        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
        }
        this.originalColumnOptions = JSON.parse(JSON.stringify(this.columnOptions));
    }
    constructor(
        private commonService: CommonServices,
        private _router: Router,
        private _cavConfigService: CavConfigService,
        private breadcrumbService: DdrBreadcrumbService,
        private _ddrData: DdrDataModelService,
        private messageService: MessageService,
        private ddrRequest: DDRRequestService,
        breadcrumb: BreadcrumbService
    ) {
        this.breadcrumb = breadcrumb;
    }


    showHideColumn(data: any) {
        if (this.visibleCols.length === 1) {
            this.prevColumn = this.visibleCols[0];
        }
        if (this.visibleCols.length === 0) {
            this.visibleCols.push(this.prevColumn);
        }
        if (this.visibleCols.length !== 0) {
            for (let i = 0; i < this.cols.length; i++) {
                for (let j = 0; j < this.visibleCols.length; j++) {
                    if (this.cols[i].field === this.visibleCols[j]) {
                        this.cols[i].action = true;
                        break;
                    } else {
                        this.cols[i].action = false;
                    }
                }
            }
        }
    }

    /*When user click on method/class/package icon table and pie chart data will change*/
    changeData(type, entity) {

        this.urlPramObj['entity'] = entity;
        this.urlPramObj['type'] = type;
        this.getMethodTimigData(type, entity);
        //this.getMethodTimigData(type, entity);
        console.log("method timing entity ==", this.urlPramObj[entity], "type is ", type);
    }

    /*Used for download report table header*/
    setTestRunInHeader() {
        if (decodeURIComponent(this.id.ipWithProd).indexOf('netstorm') !== -1) {
            this.strTitle = 'Netstorm - MethodTiming Report - Test Run : ' + this.id.testRun;
        } else {
            this.strTitle = 'Netdiagnostics Enterprise - MethodTiming Report - Session : ' + this.id.testRun;
        }
    }

    //to enable ntop value popup
    /* showDialogBox() {
         this.topNText = "";
         this.showDialog = true;
     }*/

    /*method used to apply popup value and create pie chart based on filtering of json*/
    /*applyNtopMethod(topNval) {
        if(isNaN(topNval) || topNval == null || topNval.trim() == "" || (Number(topNval) <= 0) || topNval.indexOf('.') != -1)
        {
            alert("Please enter valid number");
            return;
        }
        else
        {
             this.nTopMethod = topNval;
            if (this.activeType == '')
                this.createPieChart(this.wholeData, 'method');
            if (this.activeType == 'package')
                this.createPieChart(this.wholeData, 'package');
            if (this.activeType == 'class')
                this.createPieChart(this.wholeData, 'class');
            if (this.activeType == 'method')
                this.createPieChart(this.wholeData, 'method');

        this.showDialog = false;
        }  
    } */

    /*Method is used get host url*/
    getHostUrl(isDownloadCase?): string {
        var hostDcName;
        if (this._ddrData.isFromtrxFlow) {
            hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
            this.id.testRun = this._ddrData.testRunTr;
            this.testRun = this._ddrData.testRunTr;
            //   return hostDCName;
        }
        else {
            hostDcName = this._ddrData.getHostUrl(isDownloadCase);
            if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
                //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
                this.id.testRun = this._ddrData.testRun;
                this.testRun = this._ddrData.testRun;
                console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
            }
            // else if (this._navService.getDCNameForScreen("methodtiming") === undefined)
            //     hostDcName = this._cavConfigService.getINSPrefix();
            // else
            //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("methodtiming");

            // if (hostDcName.length > 0) {
            //     sessionStorage.removeItem("hostDcName");
            //     sessionStorage.setItem("hostDcName", hostDcName);
            // }
            // else
            //     hostDcName = sessionStorage.getItem("hostDcName");
        }
        console.log('hostDcName =', hostDcName);
        return hostDcName;
    }


    //Time filter


    createDropDownMenu() {
        this.standardTime = [];
        this.standardTime.push({ label: 'Last 10 minutes', value: '10' });
        this.standardTime.push({ label: 'Last 30 minutes', value: '30' });
        this.standardTime.push({ label: 'Last 1 hour', value: '60' });
        this.standardTime.push({ label: 'Last 2 hours', value: '120' });
        this.standardTime.push({ label: 'Last 4 hours', value: '240' });
        this.standardTime.push({ label: 'Last 8 hours', value: '480' });
        this.standardTime.push({ label: 'Last 12 hours', value: '720' });
        this.standardTime.push({ label: 'Last 24 hours', value: '1440' });
        this.standardTime.push({ label: 'Total Test Run', value: 'Whole Scenario' });
    }

    onStrDate(event) {
        let date = new Date(event);
        this.strTime = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        console.log("this.strTime*******", this.strTime);
    }

    onEndDate(event) {
        let date = new Date(event);
        this.endTime = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();;
        console.log("this.endTime*******", this.endTime);

    }

    applyFilter() {
        if (this.custselect == true) {
            if (this.strDate == null || this.endDate == null) {
                if (this.strDate == null && this.endDate != null)
                    this.msg = "Start time cannot be empty";
                else if (this.endDate == null && this.strDate != null)
                    this.msg = "End time cannot be empty"
                else
                    this.msg = "Start time and end time cannot be empty";
            }
            else {
                if (this.strDate > this.endDate)
                    this.msg = "Start time cannot be greater than end time";
                else {
                    this.customFlag = true;
                    this.trStartTime = this.strTime;
                    this.trEndTime = this.endTime;
                    this.display = false;
                    this.loader = true;
                    this.getProgressBar();
                    this.getMethodTimigData('method', '0');
                    this.custselect = false;
                    this.standselect = true;
                    this.strDate = null;
                    this.endDate = null;
                    this.msg = "";
                    this.value = 1;
                }
            }
        }
        else if (this.standselect == true) {
            if (this.selectedTime == "" || this.selectedTime == undefined)
                this.msg = 'Selected time is not valid';
            else {
                let timeFilterUrl = '';
                if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
                    if (this.commonService.protocol.endsWith("://"))
                        timeFilterUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
                    else
                        timeFilterUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
                } else {
                    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
                    //     timeFilterUrl = "//"+ this.getHostUrl();
                    // }
                    //   else
                    timeFilterUrl = this.getHostUrl();

                }
                timeFilterUrl += "/DashboardServer/web/commons/getTimeStampForDDR?testRun=" + this.id.testRun + "&graphTimeKey=" + this.selectedTime;
                this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => (this.setTimeFilter(data)));
            }
        }
    }

    close() {
        this.display = false;
        this.standselect = true;
        this.custselect = false;
        this.strDate = null;
        this.endDate = null;
        this.selectedTime = "";

    }

    standFunction() {
        this.msg = "";
        this.standselect = false;
        this.custselect = true;
        this.selectedTime = "";
    }
    custFunction() {
        this.strDate = null;
        this.endDate = null;
        this.msg = "";
        this.custselect = false;
        this.standselect = true;
    }
    showTimeDialog() {
        this.display = true;
        this.msg = "";
    }

    getProgressBar() {
        let interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 100;
                clearInterval(interval);
            }
        }, 300);
    }

    setTimeFilter(res: any) {
        this.trStartTime = res.ddrStartTime;
        this.trEndTime = res.ddrEndTime;
        this.getStandardTime();
    }
    getStandardTime() {
        if (this.trStartTime != "" || this.trStartTime != undefined) {
            let time;
            if (this.selectedTime.name == "Last 10 minutes") {
                time = 600000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 10 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 30 minutes") {
                time = 1800000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 30 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 1 hour") {
                time = 3600000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 1 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 2 hours") {
                time = 7200000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 2 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 4 hours") {
                time = 14400000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 4 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 8 hours") {
                time = 28800000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 8 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 12 hours") {
                time = 43200000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 12 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Last 24 hours") {
                time = 86400000;
                this.trStartTime = this.trEndTime - time;
                console.log(" last 24 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
            }
            else if (this.selectedTime.name == "Total Test Run") {
                this.trStartTime = "";
                this.trEndTime = "";
            }
            this.loader = true;
            this.getProgressBar();
            this.getMethodTimigData('method', '0');
            this.standselect = true;
            this.custselect = false;
            this.display = false;
            this.strDate = null;
            this.endDate = null;
            this.msg = "";
            this.value = 1;
            this.selectedTime = "";
        }
    }


    /**Rest call to get data for method timing */
    getMethodTimigData(type, entity) {
        console.log("inside getMethodTimigData and type is --", type, "and entity --", entity);
        let url = '';

        if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
            this.showDCMenu = false;
            // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
            //   url = "//" + this.getHostUrl();
            // }
            // else
            url = this.getHostUrl();

            console.log("urllll formeddddd", this.url);
        }

        else {
            //this.showDCMenu = true;;
            this.dcProtocol = this.commonService.protocol;

            if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
                url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
                this.dcProtocol = this.commonService.protocol;
            } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
                url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
                this.dcProtocol = this.commonService.protocol;
            }
            else {
                url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
                this.dcProtocol = location.protocol;
            }
        }

        if (this.commonService.enableQueryCaching == 1)
            url += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/methodTimingReport?cacheId=' + this.id.testRun + '&testRun=' + this.id.testRun;
        else
            url += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/methodTimingReport?testRun=' + this.id.testRun;
        let urlParam = "";
        let flag = '&customFlag=' + this.customFlag;
        let pagination = '&limit=' + this.limit + '&offset=' + this.offset;

        try {
            let fromFlowpath: boolean = false;
            let flowpathInstance = "NA";
            let tierName = "NA";
            let serverName = "NA";
            let appName = "NA";
            let tierId = "NA";
            let serverId = "NA";
            let appId = "NA";
            let urlName = "NA";
            let urlIndex = "NA";
            let strStartTime = "NA";
            let strEndTime = "NA";
            let btCatagory = "NA";
            let signature = 'NA';
            let urlQueryParamStr = 'NA';

            console.log(" method timing isFilterFromSideBar == " + this.commonService.isFilterFromSideBar)
            if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.methodTimingFilters).length != 0) {
                let mtParam = this.commonService.methodTimingFilters;
                if (this.commonService.isValidParamInObj(mtParam, 'pubicIP') && this.commonService.isValidParamInObj(mtParam, 'publicPort') && this.commonService.isValidParamInObj(mtParam, 'ndeTestRun')) {
                    if (this.commonService.enableQueryCaching == 1)
                        url = mtParam['ndeProtocol'] + "://" + mtParam['pubicIP'] + ":" + mtParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/methodTimingReport?cacheId=' + mtParam['ndeTestRun'] + '&testRun=' + mtParam['ndeTestRun'];
                    else
                        url = mtParam['ndeProtocol'] + "://" + mtParam['pubicIP'] + ":" + mtParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/methodTimingReport?testRun=' + mtParam['ndeTestRun'];

                    console.log("url--", url);
                }

                console.log("side bar case----methodTimingAjaxParams in method timing report = ", JSON.stringify(mtParam));
                this.nTopMethod = mtParam.topNEntities;
                let ajaxurl = this.commonService.makeParamStringFromObj(mtParam, true);
                console.log("side bar case---- ajax url in method timing report from side bar == ", ajaxurl);

                urlParam = ajaxurl;
                this.urlPramObj = this.commonService.makeObjectFromUrlParam(urlParam);

                console.log("ajax url param for side bar mt---", url);
                //console.log("sidebar case --type is ", this.urlPramObj[type], "and entity is ", this.urlPramObj[entity]);
            }

            else {
                if (this.id.mtFlag == 'true' || this.commonService.mtFlag == true || this.commonService.openfptoAggMT == true) {
                    this.fptomtFilter = true;
                    if (this.commonService.mtData.flowpathInstance !== undefined) {
                        flowpathInstance = this.commonService.mtData.flowpathInstance;
                    }
                    if (this.commonService.mtData.tierName !== undefined) {
                        tierName = this.commonService.mtData.tierName;
                    }
                    if (this.commonService.mtData.serverName !== undefined) {
                        serverName = this.commonService.mtData.serverName;
                    }
                    if (this.commonService.mtData.appName !== undefined) {
                        appName = this.commonService.mtData.appName;
                    }
                    if (this.commonService.mtData.tierId !== undefined) {
                        tierId = this.commonService.mtData.tierId;
                    }
                    if (this.commonService.mtData.serverId !== undefined) {
                        serverId = this.commonService.mtData.serverId;
                    }
                    if (this.commonService.mtData.appId !== undefined) {
                        appId = this.commonService.mtData.appId;
                    }
                    if (this.commonService.mtData.btCatagory !== undefined) {
                        btCatagory = this.getBTCategoryID(this.commonService.mtData.btCatagory);
                    }
                    if (this.commonService.mtData.urlIndex !== undefined) {
                        urlIndex = this.commonService.mtData.urlIndex;
                    }
                    if (this.commonService.mtData.urlName !== undefined) {
                        urlName = this.commonService.mtData.urlName;
                    }
                    if (this.commonService.mtData.urlQueryParamStr !== undefined) {
                        urlQueryParamStr = this.commonService.mtData.urlQueryParamStr;

                    }
                    if (this.commonService.mtData.strStartTime !== undefined) {
                        this.trStartTime = this.commonService.mtData.strStartTime;
                    }
                    if (this.commonService.mtData.strEndTime !== undefined) {
                        this.trEndTime = this.commonService.mtData.strEndTime;
                    }
                    if (this.commonService.mtData.StartTimeDF) {
                        this.startTimeinDF = this.commonService.mtData.StartTimeDF;
                    }
                    if (this.commonService.mtData.Duration) {
                        this.Duration = this.commonService.mtData.Duration;
                    }

                } else if (this.commonService.signatureTomt === true) {
                    if (this.commonService.mtData.flowpathSignature !== undefined) {
                        signature = this.commonService.mtData.flowpathSignature;
                    }
                    if (this.commonService.mtData.strStartTime !== undefined) {
                        this.trStartTime = this.commonService.mtData.strStartTime;
                    }
                    if (this.commonService.mtData.strEndTime !== undefined) {
                        this.trEndTime = this.commonService.mtData.strEndTime;
                    }
                } else {
                    this.fptomtFilter = false;
                    tierName = this.id.tierName;
                    serverName = this.id.serverName;
                    appName = this.id.appName;
                    urlName = this.id.urlName;
                    urlIndex = this.id.urlIndex;
                    btCatagory = this.id.btCatagory;
                    this.trStartTime = this.id.startTime;
                    this.trEndTime = this.id.endTime;
                }

                if (this.commonService.flowpathInstance != undefined && this.commonService.flowpathInstance != 'NA' && this.commonService.flowpathInstance != 'undefined') {
                    this.commonService.flowpathInstance = flowpathInstance;
                }
                else
                    this.commonService.flowpathInstance = "";
                let nsUrlIdx = "NA";
                let script = "NA";
                let page = "NA";
                let transtx = "NA";

                if (this.id.flowpathInstance != null && this.id.flowpathInstance != undefined && this.id.flowpathInstance != 'NA' && this.id.flowpathInstance != '')
                    flowpathInstance = this.id.flowpathInstance;
                if (this.id.nsUrlIndex != null && this.id.nsUrlIndex != undefined && this.id.nsUrlIndex != 'NA' && this.id.nsUrlIndex != '')
                    nsUrlIdx = this.id.nsUrlIndex;
                if (this.id.script != null && this.id.script != undefined && this.id.script != 'NA' && this.id.script != '')
                    script = this.id.script;
                if (this.id.transtx != null && this.id.transtx != undefined && this.id.transtx != "NA" && this.id.transtx != '')
                    transtx = this.id.transtx;
                if (this.id.pageName != null && this.id.pageName != undefined && this.id.pageName != "NA" && this.id.pageName != '')
                    page = this.id.pageName;
                if (this.id.completeURL != null && this.id.completeURL != undefined && this.id.completeURL != "NA" && this.id.completeURL != '')
                    urlQueryParamStr = this.id.completeURL


                urlParam =
                    '&tierName=' + tierName +
                    '&serverName=' + serverName +
                    '&appName=' + appName +
                    '&tierId=' + tierId +
                    '&serverId=' + serverId +
                    '&appId=' + appId +
                    '&urlName=' + urlName +
                    '&urlIndex=' + urlIndex +
                    '&flowpathInstance=' + flowpathInstance +
                    '&btCatagory=' + btCatagory +
                    '&strStartTime=' + this.trStartTime +
                    '&strEndTime=' + this.trEndTime +
                    '&url=' + encodeURIComponent(urlQueryParamStr) +
                    '&nsUrlIdx=' + nsUrlIdx +
                    '&page=' + page +
                    '&transaction=' + transtx +

                    '&Duration=' + this.Duration +
                    '&startTimeinDF=' + this.startTimeinDF +
                    '&script=' + script;
                if (this.commonService.signatureTomt === true) {
                    urlParam += '&fpSignature=' + signature;
                }
                //making ajaxurlparam to set all parameters into commonservice
                this.urlPramObj = this.commonService.makeObjectFromUrlParam(urlParam);


            }
            urlParam += '&type=' + type + '&entity=' + entity;
            url += urlParam + flag;
            if (this.valuechbx && this.isApplied) {
                url += '&min_methods=2';
            }
            this.urlPramObj = this.commonService.makeObjectFromUrlParam(urlParam);
            console.log("urlparm value---", this.urlPramObj);
            this.commonService.methodTimingFilters = this.urlPramObj;

            if (!this.commonService.dcNameList && this._cavConfigService.getActiveDC() != "ALL") {
                setTimeout(() => {
                    this.messageService.sendMessage(this.commonService.methodTimingFilters);
                }, 2000);
            }
            console.log(" final url   == " + url);

            this.ddrRequest.getDataUsingGet(url).subscribe(
                data => (this.assignMethodTimingData(data, type))
                , error => {
                    this.loading = false;
                    this.loader = false;
                    if (error.hasOwnProperty('message')) {
                        this.commonService.showError(error.message);
                    }
                    else {
                        if (error.hasOwnProperty('statusText')) {
                            this.commonService.showError(error.statusText);
                            console.error(error);
                        }
                    }
                }
            );
        } catch (error) {
            console.log('error in getting data from rest call', error);
        }

        console.log("methodTimingAjaxParams--", this.commonService.methodTimingFilters);
    }

    getBTCategoryID(category) {
        if (category === 'Very Slow') {
            category = '12';
        }
        if (category === 'Slow') {
            category = '11';
        }
        if (category === 'Normal') {
            category = '10';
        }
        if (category === 'Errors') {
            category = '13';
        }
        if (category === 'Other') {
            category = '0';
        }
        return category;
    }
    /**Used to open service method timing from Method timing */
    openServiceMethodTiming(rowData) {
        let mtParam = this.commonService.methodTimingFilters;
        let reqData = {};
        if (this.commonService.mtFlag == true) {
            if (rowData != undefined)
                reqData["methodid"] = rowData.ID;
            reqData["fpInstance"] = this.commonService.mtData.flowpathInstance;
            reqData["urlIndex"] = this.commonService.mtData.urlIndex;
            reqData["tierId"] = mtParam['tierId'];
            reqData["serverId"] = mtParam['serverId'];
            reqData["appId"] = mtParam['appId'];
            reqData['tierName'] = mtParam['tierName'];
            reqData['serverName'] = mtParam['serverName'];
            reqData['appName'] = mtParam['appName'];
            reqData["strStartTime"] = this.commonService.mtData.strStartTime;
            reqData["strEndTime"] = this.commonService.mtData.strEndTime;
            reqData["startTimeinDF"] = mtParam['startTimeinDF'];
            reqData["Duration"] = mtParam['Duration'];

            console.log("case 1--reqdata", JSON.stringify(reqData));
        }
        else {

            if (rowData != undefined)
                reqData["methodid"] = rowData.ID;
            reqData["tierId"] = mtParam['tierId'];
            reqData["serverId"] = mtParam['serverId'];
            reqData["appId"] = mtParam['appId'];
            reqData['tierName'] = mtParam['tierName'];
            reqData['serverName'] = mtParam['serverName'];
            reqData['appName'] = mtParam['appName'];
            console.log("case 2--reqdata", JSON.stringify(reqData));
            /*   if( this.commonService.signatureTomt == true)
                   {
                   reqData["strStartTime"] = this.commonService.mtData.strStartTime;;
                   reqData["strEndTime"] = this.commonService.mtData.strEndTime;
                   }
               else{
       
                  reqData['strStartTime'] = this.id.startTime;
                  reqData['strEndTime'] = this.id.endTime;
                   } */
        }
        reqData['urlName'] = mtParam['urlName'];
        reqData['strStartTime'] = mtParam['strStartTime'];
        reqData['strEndTime'] = mtParam['strEndTime'];
        this.commonService.dataForServiceMethod = reqData;
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.METHOD_TIMING;
        if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
            this._router.navigate(['/home/ddrCopyLink/servicemethodtiming']);
        else
            this._router.navigate(['/ddr/servicemethodtiming']);
    }
    /**Assign the rest call response data to global variable */
    assignMethodTimingData(res: any, type) {
        this.commonService.isFilterFromSideBar = false;
        try {
            if (res === null || res === undefined) {
                return;
            }
            if (res.hasOwnProperty('Status')) {
                if (res.Status !== "" && res.Status !== "NA" && res.Status !== 'undefined' && res.Status !== undefined) {
                    this.commonService.showError(res.Status);
                }
            }
            setTimeout(() => {
                this.loader = false;
            }, 2000);
            this.loading = false;
            this.commonService.methodTimingFilters['startTimeInDateFormat'] = res.strStartTime;
            this.commonService.methodTimingFilters['endTimeInDateFormat'] = res.strEndTime;
            this.showFilterCriteria(res.strStartTime, res.strEndTime);
            this.methodTimingData = res.data;
            this.methodTimingData.forEach((val, index) => {
                // console.log('pn avalue---', val['pN']);
                if (val['pN'] === undefined || val['pN'] === '' || val['pN'] === '0' || val['pN'] === 'undefined') {
                    val['pN'] = '-';
                }
                if (val['fG'] === undefined || val['fG'] === '' || val['fG'] === '0' || val['fG'] === 'undefined') {
                    val['fG'] = '-';
                }
            })
            this.tempMTData = this.doHyperLinkOnMethod(res.data);
            this.dataCount = this.methodTimingData.length;

            if (this.methodTimingData.length > 50) { //If data is less then 10 then no pagination .
                this.showPagination = true;
            } else {
                this.showPagination = false;
            }
            if (this.methodTimingData.length === 0) {
                this.showDownLoadReportIcon = false;
            }
            else
                this.showDownLoadReportIcon = true;
            if (type == 'package') {
                this.cols = [];
                this.cols = JSON.parse(JSON.stringify(this.tempcols));
                //this.activeType = "package";
                this.filterType = "Package(s)";
                this.headerStats = "Package(s) Stat";
                this.visibleCols = ['pN', 'percent', 'avgST', 'sTOrg', 'avgCPUST', 'eC'];
                this.columnOptions = JSON.parse(JSON.stringify(this.originalColumnOptions));
                this.columnOptions.splice(1, 3);
                this.cols[1].action = false;
                this.cols[2].action = false;
            }
            if (type == 'class') {
                this.cols = [];
                this.cols = JSON.parse(JSON.stringify(this.tempcols));
                //this.activeType = "class";
                this.filterType = "Class(es)";
                this.headerStats = "Class(es) Stat";
                this.visibleCols = ['pN', 'cN', 'percent', 'avgST', 'sTOrg', 'avgCPUST', 'eC'];
                this.columnOptions = JSON.parse(JSON.stringify(this.originalColumnOptions));
                this.columnOptions.splice(2, 2);
                this.cols[1].action = true;
                this.cols[2].action = false;
            }
            if (type == 'method') {
                this.cols = [];
                this.cols = JSON.parse(JSON.stringify(this.tempcols));
                //this.activeType = "method";
                this.filterType = "Method(s)";
                this.headerStats = "Method(s) Stat";
                this.visibleCols = ['pN', 'cN', 'mN', 'percent', 'avgST', 'sTOrg', 'avgCPUST', 'eC'];
                this.columnOptions = JSON.parse(JSON.stringify(this.originalColumnOptions));
                this.cols[1].action = true;
                this.cols[2].action = true;
            }
            this.createPieChart(res.data, type);
            this.createCountPieChart(res.data, type);
            console.log("this.queryParams   this.displayAutoInst>>>>", this.queryParams);
            if (this.queryParams && this.queryParams.Instance_Type) {
                this.displayAutoInst = true;
            } else {
                this.getVectorIds();
            }

        } catch (error) {
            console.log(error);
        }

    }

    /**
    * @param error notification
    */
    showError(msg: any) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
    }

    /**Used to hyper link method for opening service method timing report 
    This is used to check codition of package and class based on which method name is appended with %40 to show hyperlink on table */
    doHyperLinkOnMethod(val): any {
        let doHyperLink: boolean = false;
        for (let i = 0; i < val.length; i++) {
            if (val[i]["pN"] == "weblogic.servlet.internal" && val[i]["cN"] == "FilterChainImpl")
                val[i]["mN"] = val[i]["mN"] + "%40";
            else if (val[i]["pN"] == "javax.servlet.http" && val[i]["cN"] == "HttpServlet")
                val[i]["mN"] = val[i]["mN"] + "%40";
            else if (val[i]["pN"] == "com.sun.jersey.spi.container.servlet" && val[i]["cN"] == "WebComponent")
                val[i]["mN"] = val[i]["mN"] + "%40";
            else if (val[i]["pN"] == "org.glassfish.jersey.servlet" && val[i]["cN"] == "ServletContainer")
                val[i]["mN"] = val[i]["mN"] + "%40";
            else if (val[i]["pN"] == "weblogic.servlet.jsp" && val[i]["cN"] == "JspBase")
                val[i]["mN"] = val[i]["mN"] + "%40";
            else if (val[i]["pN"] == "org.apache.jasper.runtime" && val[i]["cN"] == "HttpJspBase")
                val[i]["mN"] = val[i]["mN"] + "%40";
        }
        return val;
    }

    /** Auto Instrumentation DDAI */
    getIdFortier(data) {
        return data.trim().split(":");
    }


    getVectorIds() {
        console.log('this.methodTimingFilters>>>>>>>>>>>>getVectorIds****', this.commonService.methodTimingFilters);
        let mtFilter = this.commonService.methodTimingFilters;
        if (this.commonService.isValidParameter(mtFilter['serverName']) && this.commonService.isValidParameter(mtFilter['appName'])) {
            let urlForid;
            this.displayAutoInst = true;
            //  if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
            //      urlForid = "//" + this.getHostUrl();
            //  else
            urlForid = this.getHostUrl();
            urlForid += "/" + this.id.product.replace("/", "") + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.id.testRun + "&tierName=" + mtFilter['tierName'] + "&serverName=" + mtFilter['serverName'] + "&appName=" + mtFilter['appName'];
            //console.log("urlForid>>>>>>>>", urlForid);
            return this.ddrRequest.getDataInStringUsingGet(urlForid).subscribe(data => {
                this.getAgentInfo(data)
            });
        }
        else {
            this.displayAutoInst = false;
        }
    }

    getAgentInfo(res: any) {
        console.log('this.methodTimingFilters>>>>>>>>>>>>****', this.commonService.methodTimingFilters);

        this.vecId = this.getIdFortier(res);
        // key = appName_tierId_serverId_appId
        this.commonService.methodTimingFilters['tierId'] = this.vecId[0].trim();
        this.commonService.methodTimingFilters['serverId'] = this.vecId[1].trim();
        this.commonService.methodTimingFilters['appId'] = this.vecId[2].trim();
        let url
        //   if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
        //   url = "//" + this.getHostUrl();
        // else
        url = this.getHostUrl();
        url += "/" + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/getAgent?testRun=" + this.id.testRun +
            "&tierId=" + this.vecId[0].trim() + "&serverId=" + this.vecId[1].trim() + "&appId=" + this.vecId[2].trim();

        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
            console.log("data for Agent = ", data);
            this.agentType = data;
        });
    }

    openAutoInstDialog() {
        console.log('this.methodTimingFilters>>>>>>>>>>>>****', this.commonService.methodTimingFilters);

        let testRunStatus;
        let AgentType;
        let mtFilter = this.commonService.methodTimingFilters;
        let url
        // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
        //     url =  "//" + this.getHostUrl();
        // else
        url = this.getHostUrl();
        url += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.id.testRun;
        //console.log('url *** ', url);
        this.ddrRequest.getDataUsingGet(url).subscribe(res => {
            //  console.log("data for tr status === " , res);
            testRunStatus = <any>res;
            testRunStatus = testRunStatus.data;
            if (testRunStatus.length != 0) {
                if (this.queryParams && this.queryParams.Instance_Type) {
                    this.agentType = this.queryParams.Instance_Type;
                } else {
                    this.agentType = this.agentType;
                }

                if (this.agentType.toLowerCase() == 'java')
                    AgentType = 'Java';
                else if (this.agentType.toLowerCase() == 'dotnet')
                    AgentType = 'DotNet';

                this.showAutoInstrPopUp = true;

                this.argsForAIDDSetting = [mtFilter['appName'], mtFilter['appId'], AgentType, mtFilter['tierName'],
                mtFilter['serverName'], mtFilter['serverId'], "-1", mtFilter['urlName'], "DDR", testRunStatus[0].status, this.id.testRun];
                console.log('this.argsForAIDDSetting>>>>>>>>>>>>****', this.argsForAIDDSetting);

            }
            else {
                this.showAutoInstrPopUp = false;
                alert("Could not start instrumentation, test is not running")
                return;
            }
        });
    }

    startInstrumentation(result) {
        this.showAutoInstrPopUp = false;
        alert(result);
    }

    closeAIDDDialog(isCloseAIDDDialog) {
        this.showAutoInstrPopUp = isCloseAIDDDialog;
    }




    /**To show filter criteria */
    showFilterCriteria(startTime: any, endTime: any) {
        this.filterCriteria = "";
        this.URLstr = "";
        this.CompleteURL = "";
        this.filterTierName = '';
        this.filterServerName = '';
        this.filterInstanceName = '';
        this.completeTier = '';
        this.completeServer = '';
        this.completeInstance = '';
        this.downloadFilterCriteria = '';
        let mtFilters = this.commonService.methodTimingFilters;
        let dcName = "";

        console.log("fpHeader --", JSON.stringify(mtFilters));
        if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
            dcName = this.selectedDC;
            //this.downloadFilterCriteria = this.filterDCName + ', ';
        }

        else if (sessionStorage.getItem("isMultiDCMode") == "true") {
            dcName = this._cavConfigService.getActiveDC();
            if (dcName == "ALL")
                dcName = this._ddrData.dcName;

            //this.filterCriteria = 'DC=' + dcName + ', ';
            this.filterTierName = 'DC=' + dcName + ', ';
            this.downloadFilterCriteria = "DC= " + dcName + ', ';
            if (this._ddrData.isFromtrxFlow && (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true")) {
                this.filterTierName = 'DC=' + this._ddrData.dcNameTr + ', ';
                this.downloadFilterCriteria = 'DC=' + this._ddrData.dcNameTr + ', ';
            }

        }
        /*  if(dcName)
      {
          this.filterCriteria += ", DC= " + dcName + ', ';
          
      }*/
        if (this.commonService.mtFlag == true) {

            if (this.commonService.mtData.tierName != 'NA' && this.commonService.mtData.tierName != undefined && this.commonService.mtData.tierName != null && this.commonService.mtData.tierName != '') {
                this.filterCriteria += 'Tier=' + this.commonService.mtData.tierName;
            }

            if (this.commonService.mtData.serverName != 'NA' && this.commonService.mtData.serverName != undefined && this.commonService.mtData.serverName != '' && this.commonService.mtData.serverName != null) {
                this.filterCriteria += ', Server=' + this.commonService.mtData.serverName;
            }

            if (this.commonService.mtData.appName != 'NA' && this.commonService.mtData.appName != undefined && this.commonService.mtData.appName != '' && this.commonService.mtData.appName != null) {
                this.filterCriteria += ', Instance=' + this.commonService.mtData.appName;
            }
        } else {
            if (dcName) {
                //this.filterTierName += "DC= " + dcName + ', ';
                //this.downloadFilterCriteria += "DC= " + dcName + ', ';            
            }
            if (this.commonService.isValidParamInObj(mtFilters, "tierName")) {
                if (mtFilters['tierName'].length > 32) {
                    this.filterTierName += 'Tier=' + mtFilters['tierName'].substring(0, 32) + '...';
                    this.completeTier = mtFilters['tierName'];
                } else
                    this.filterTierName += 'Tier=' + mtFilters['tierName'];

                this.downloadFilterCriteria += 'Tier=' + mtFilters['tierName'];


            }

            if (this.commonService.isValidParamInObj(mtFilters, "serverName")) {
                if (mtFilters['serverName'].length > 32) {
                    this.filterServerName = ', Server=' + mtFilters['serverName'].substring(0, 32) + '...';
                    this.completeServer = mtFilters['serverName'];
                } else
                    this.filterServerName = ', Server=' + mtFilters['serverName'];

                this.downloadFilterCriteria += ', Server=' + mtFilters['serverName'];


            }

            if (this.commonService.isValidParamInObj(mtFilters, "appName")) {
                if (mtFilters['appName'].length > 32) {
                    this.filterInstanceName = ', Instance=' + mtFilters['appName'].substring(0, 32) + '...';
                    this.completeInstance = mtFilters['appName'];
                } else
                    this.filterInstanceName = ', Instance=' + mtFilters['appName'];

                this.downloadFilterCriteria += ', Instance=' + mtFilters['appName'];


            }
        }
        if (this.commonService.isValidParamInObj(mtFilters, "startTimeInDateFormat")) {
            this.filterCriteria += ', StartTime=' + mtFilters['startTimeInDateFormat'];
        }
        if (this.commonService.isValidParamInObj(mtFilters, "endTimeInDateFormat")) {
            this.filterCriteria += ', EndTime=' + mtFilters['endTimeInDateFormat'];
        }

        if (this.commonService.isValidParamInObj(mtFilters, "page")) {
            this.filterCriteria += ', Page=' + mtFilters['page'];
        }

        if (this.commonService.isValidParamInObj(mtFilters, "script")) {
            this.filterCriteria += ', Script=' + mtFilters['script'];
        }

        if (this.commonService.isValidParamInObj(mtFilters, "transaction")) {
            this.filterCriteria += ', Transaction=' + mtFilters['transaction'];
        }

        if (this.commonService.isValidParamInObj(mtFilters, "browser")) {
            this.filterCriteria += ', Browser=' + mtFilters['browser'];
        }

        if (this.commonService.isValidParamInObj(mtFilters, "access")) {
            this.filterCriteria += ', Access=' + mtFilters['access'];
        }
        if (this.commonService.isValidParamInObj(mtFilters, "location")) {
            this.filterCriteria += ', Location=' + mtFilters['location'];
        }

        if (this.commonService.isValidParamInObj(mtFilters, "btCatagory")) {
            this.filterCriteria += ', BT Type=' + this.commonService.getBTCategoryName(mtFilters['btCatagory']);
        }
        if (this.commonService.isValidParamInObj(mtFilters, "urlName")) {
            this.filterCriteria += ', BT=' + decodeURIComponent(mtFilters['urlName']);
        }

        if (this.commonService.isValidParamInObj(mtFilters, "url")) {
            let val = decodeURIComponent(mtFilters['url']);
            if (val.length > 40) {
                this.URLstr = ', URL=' + val.substring(0, 40) + "..";
                this.CompleteURL = val;
            }
            else {
                this.URLstr = ', URL=' + val;
                this.CompleteURL = val;
            }

        }

        /* if(this.id.mtFlag == 'true'){
          if ( this.commonService.mtData.btCatagory !== 'undefined' && this.commonService.mtData.btCatagory !== undefined && this.commonService.mtData.btCatagory !== 'NA' && this.commonService.mtData.btCatagory !== '' &&
             this.commonService.mtData.btCatagory !== null) {
             this.filterCriteria += ', BT Type=' + this.commonService.mtData.btCatagory;
         }
         if (this.commonService.mtData.urlName !== 'undefined' && this.commonService.mtData.urlName !== undefined && this.commonService.mtData.urlName !== 'NA' && this.commonService.mtData.urlName !== '' &&
             this.commonService.mtData.urlName !== null) {
             this.filterCriteria += ', BT=' + this.commonService.mtData.urlName;
         }
         if (this.commonService.mtData.urlQueryParamStr !== 'undefined' && this.commonService.mtData.urlQueryParamStr !== undefined && this.commonService.mtData.urlQueryParamStr !== 'NA' && this.commonService.mtData.urlQueryParamStr !== '' &&
             this.commonService.mtData.urlQueryParamStr !== null) {
         if(this.commonService.mtData.urlQueryParamStr.length > 45){
            this.URLstr = ', URL=' +(this.commonService.mtData.urlQueryParamStr).substring(0,45)+ "...";
            this.CompleteURL = this.commonService.mtData.urlQueryParamStr;
             
         }else{
             this.URLstr = ', URL=' +this.commonService.mtData.urlQueryParamStr;
              this.CompleteURL = this.commonService.mtData.urlQueryParamStr;
             }
         }
         } */

        console.log(this.filterCriteria);
        if (!this.commonService.isValidParamInObj(mtFilters, "tierName") && !this.commonService.isValidParamInObj(mtFilters, "serverName") && !this.commonService.isValidParamInObj(mtFilters, "appName") && this.filterCriteria.startsWith(',')) {
            this.filterCriteria = this.filterCriteria.substring(1);
        }

        this.downloadFilterCriteria += this.filterCriteria;
    }



    /*This Method is used for handle the Column Filter Flag*/
    toggleColumnFilter() {
        this.isEnabledColumnFilter = !this.isEnabledColumnFilter;
        // if (this.isEnabledColumnFilter) {
        //     this.isEnabledColumnFilter = false;
        // } else {
        //     this.isEnabledColumnFilter = true;
        // }
        this.changeColumnFilter();
    }

    /*This method is used to Enable/Disabled Column Filter*/
    changeColumnFilter() {
        try {
            let tableColumns = this.cols;
            if (!this.isEnabledColumnFilter) {
                this.toggleFilterTitle = 'Show Column Filters';
                for (let i = 0; i < tableColumns.length; i++) {
                    tableColumns[i].filter = false;
                }
            } else {
                this.toggleFilterTitle = 'Hide Column Filters';
                for (let i = 0; i < tableColumns.length; i++) {
                    tableColumns[i].filter = true;
                }
            }
        } catch (error) {
            console.log('Error while Enable/Disabled column filters', error);
        }
    }

    /**Formatter cell data for percentage field */
    pctFormatter(value) {
        if (!isNaN(value) && (value != 100 && value != 0)) {
            return Number(value).toFixed(3);
        }
        else
            return value;
    }

    /**Formatter cell data for converting ms to sec field */
    secFormatter(value) {
        if (!isNaN(value))
            return Number(value / 1000).toFixed(2);

        else
            return value;
    }

    /**Simple formater for tolocalstring */
    formatter(value) {
        if (!isNaN(value)) {
            return (Number(value)).toLocaleString();

        }
        else
            return value;
    }
    formatterForClass(value) {

        if (value == "")
            return "-";

        if (!isNaN(value)) {
            return (Number(value)).toLocaleString();

        }
        else
            return value;
    }

    /**Used to create custom tooltip in pie chart(package/class/method) */
    formatPointName(pack, clas, method) {
        var temp = "";
        if (pack != "" && clas != "" && method != "") {
            if (method.indexOf("%40") != -1)
                temp += "<b>Method: </b> " + method.substring(0, method.indexOf("%40")) + "<br/>" + "<b>Class: </b> " + clas + "<br/>" + "<b>Package: </b> " + pack + "<br/>";
            else
                temp += "<b>Method: </b> " + method + "<br/>" + "<b>Class: </b> " + clas + "<br/>" + "<b>Package: </b> " + pack + "<br/>";
        }
        else if (pack != "" && clas != "") {
            temp += "<b>Class: </b> " + clas + "<br/>" + "<b>Package: </b> " + pack + "<br/>";
        }
        else if (pack != "") {
            temp += "<b>Package: </b> " + pack + "<br/>";
        }
        return temp;

    }

    /**used to calculate sum of all Others(Rest)json to show in pie chart */
    sumOfRestPercentage(restJsonData) {
        let totalPct = 0;
        for (var i = 0; i < restJsonData.length; i++) {
            totalPct += restJsonData[i].percent;
        }
        return totalPct.toFixed(3);
    }
    /**used to calculate sum of all Others(Rest)json to show in pie chart for Count */
    sumOfRestCount(restJsonData) {
        let totalcount = 0;
        for (var i = 0; i < restJsonData.length; i++) {
            totalcount += restJsonData[i].eC;
        }
        return totalcount;
    }
    /**Used to reset to original data to table */
    showAllData() {
        this.showAllOption = false;
        this.methodTimingData = this.wholeData;
        this.dataCount = this.methodTimingData.length;
        this.pointName = "";
    }

    /**used when click on pie chart table data will change accordingly */
    clickHandler(event) {
        this.showAllOption = true;
        try {
            if (event.point.name != undefined && event.point.name != 'undefined') {
                if (event.point.name != "")
                    this.pointName = "[ " + event.point.name + " ]";
                if (event.point.name == "Other") {
                    this.methodTimingData = this.restDataArrOfPie;
                    this.dataCount = this.methodTimingData.length;
                }
                else {
                    let filteredData = [];
                    this.chartData.forEach((val, index) => {
                        //console.log("val found.....", val['eN']);

                        // if(val['pN'] == event.point.name || val['cN'] == event.point.name || val['mN'].substring(0,val['mN'].indexOf('%40')) == event.point.name || val['mN'] == event.point.name){
                        if (event.point.ClickText.indexOf("%") != -1) {
                            //console.log("event.point.ClickText.substring", event.point.ClickText.substring(0, event.point.ClickText.indexOf("%")));
                            if (val['eN'].indexOf(event.point.ClickText.substring(0, event.point.ClickText.indexOf("%"))) != -1)
                                filteredData.push(val);
                        }
                        else {
                            if (val['eN'].indexOf(event.point.ClickText) != -1) {
                                filteredData.push(val);
                            }
                        }

                    });

                    this.methodTimingData = filteredData;
                    this.dataCount = this.methodTimingData.length;
                }
            }
        }
        catch (error) {
            console.log("Error in event click:" + error);
        }
    }
    paginate(event) {
        this.offset = parseInt(event.first);
        this.limit = parseInt(event.rows);
        this.getMethodTimigData('method', '0')
    }
    /**Used to create pie chart based on Percentage */
    createPieChart(pieData: any, type: string) {

        if (this.nTopMethod == "" || this.nTopMethod == undefined)
            this.nTopMethod = "5";
        var pieText;
        let pct;
        let dataArr = [];
        let restDataArr = [];
        this.chartData = pieData;
        let totalRestPct;
        this.wholeData = this.chartData;

        if (this.chartData.length == 0)
            this.showChart = false;
        else
            this.showChart = true;

        for (var i = 0; i < this.chartData.length; i++) {
            if (i < Number(this.nTopMethod)) {
                if (type == 'method') {
                    if (this.chartData[i]["mN"].indexOf("%40") != -1)
                        this.entityName = this.chartData[i]["mN"].substring(0, this.chartData[i]["mN"].indexOf("%40"));
                    else
                        this.entityName = this.chartData[i]["mN"];
                    pct = this.chartData[i]["percent"];

                    dataArr.push({ "name": this.entityName, "y": Number(pct), "text": this.formatPointName(this.chartData[i]['pN'], this.chartData[i]['cN'], this.chartData[i]['mN']), "ClickText": this.chartData[i]['pN'] + '.' + this.chartData[i]['cN'] + '.' + this.chartData[i]['mN'] });
                }
                else if (type == 'class') {
                    this.entityName = this.chartData[i]["cN"];
                    pct = this.chartData[i]["percent"];
                    dataArr.push({ "name": this.entityName, "y": Number(pct), "text": this.formatPointName(this.chartData[i]['pN'], this.chartData[i]['cN'], ""), "ClickText": this.chartData[i]['pN'] + '.' + this.chartData[i]['cN'] });
                }
                else if (type == 'package') {
                    this.entityName = this.chartData[i]["pN"];
                    pct = this.chartData[i]["percent"];
                    dataArr.push({ "name": this.entityName, "y": Number(pct), "text": this.formatPointName(this.chartData[i]['pN'], "", ""), "ClickText": this.chartData[i]['pN'] });
                }
            }
            else
                restDataArr.push(this.chartData[i]);
        }

        totalRestPct = this.sumOfRestPercentage(restDataArr);

        if (this.chartData.length > Number(this.nTopMethod)) {
            this.entityName = "Other";
            pct = totalRestPct;
            dataArr.push({ "name": this.entityName, "y": Number(pct) });
        }

        this.restDataArrOfPie = restDataArr;
        this.options = {
            chart: {
                type: "pie"
            },
            credits: {
                enabled: false
            },
            title: {
                text: this.filterType + ' By Percentage',
                style: { 'fontSize': '13px' }
            },
            legend: {
                itemWidth: 400
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<br>{point.text}<b>Percentage:</b>{point.y}%'
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    allowPointSelect: true,
                    size: '50%',
                    turboThreshold: 5000,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        // formatter: function () {
                        //     return this.point.name + ' : ' + this.y + " %";
                        // },
                        // style: { textShadow: 'none' }
                    },
                    events: {
                        click: function (e) {
                            this.clickHandler(e);
                        }.bind(this)
                    }
                }
            },
            series: [
                {
                    data: dataArr,
                    enableMouseTracking: true
                }
            ]

        };
    }

    /**Method used to create Pie chart based on Count>>>>>>>>>>>>>> */
    createCountPieChart(pieData: any, type: string) {
        if (this.nTopMethod == "" || this.nTopMethod == undefined)
            this.nTopMethod = "5";
        var pieText;
        let count;
        let dataArr = [];
        let restDataArr = [];
        this.chartData = pieData;
        let totalRestCount;
        this.wholeData = this.chartData;

        if (this.chartData.length == 0)
            this.showCountPieChart = false;
        else
            this.showCountPieChart = true;

        for (var i = 0; i < this.chartData.length; i++) {
            if (i < Number(this.nTopMethod)) {
                if (type == 'method') {
                    if (this.chartData[i]["mN"].indexOf("%40") != -1)
                        this.entityName = this.chartData[i]["mN"].substring(0, this.chartData[i]["mN"].indexOf("%40"));
                    else
                        this.entityName = this.chartData[i]["mN"];
                    count = this.chartData[i]["eC"];

                    dataArr.push({ "name": this.entityName, "y": Number(count), "text": this.formatPointName(this.chartData[i]['pN'], this.chartData[i]['cN'], this.chartData[i]['mN']), "ClickText": this.chartData[i]['pN'] + '.' + this.chartData[i]['cN'] + '.' + this.chartData[i]['mN'] });
                }
                else if (type == 'class') {
                    this.entityName = this.chartData[i]["cN"];
                    count = this.chartData[i]["eC"];
                    dataArr.push({ "name": this.entityName, "y": Number(count), "text": this.formatPointName(this.chartData[i]['pN'], this.chartData[i]['cN'], ""), "ClickText": this.chartData[i]['pN'] + '.' + this.chartData[i]['cN'] });
                }
                else if (type == 'package') {
                    this.entityName = this.chartData[i]["pN"];
                    count = this.chartData[i]["eC"];
                    dataArr.push({ "name": this.entityName, "y": Number(count), "text": this.formatPointName(this.chartData[i]['pN'], "", ""), "ClickText": this.chartData[i]['pN'] });
                }
            }
            else
                restDataArr.push(this.chartData[i]);
        }

        totalRestCount = this.sumOfRestCount(restDataArr);

        if (this.chartData.length > Number(this.nTopMethod)) {
            this.entityName = "Other";
            count = totalRestCount;
            dataArr.push({ "name": this.entityName, "y": Number(count) });
        }

        this.restDataArrOfPie = restDataArr;
        this.CountPieChartOptions = {
            chart: {
                type: "pie"
            },
            credits: {
                enabled: false
            },
            title: {
                text: this.filterType + ' By Count',
                style: { 'fontSize': '13px' }
            },
            legend: {
                itemWidth: 400
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<br>{point.text}<b>Count:</b>{point.y}'
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    allowPointSelect: true,
                    size: '50%',
                    turboThreshold: 5000,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    events: {
                        click: function (e) {
                            this.clickHandler(e);
                        }.bind(this)
                    }
                }
            },
            series: [
                {
                    data: dataArr,
                    enableMouseTracking: true
                }
            ]

        };
    }

    /**Method used to create bar charts */
    //  createBarChart(barData:any) {
    //     let dataArr=[];
    //     let avgRespTime:string;

    //     if (barData.length == 0) {
    //       this.showBarChart = false;
    //     } else {
    //       this.showBarChart = true;
    //     }

    //     for(let i=0; i< barData.length; i++) {
    //        avgRespTime = barData[i]["avgST"];
    //        dataArr.push(avgRespTime);
    //     }

    //     this.barChartOptions = {
    //       chart :{
    //         type : 'column'
    //       },
    //       credits: {
    //         enabled :false
    //       },
    //       title :{
    //         text : 'Methods Avg. SelfTime',
    //         style:{'fontSize':'13px'}
    //       },
    //       xAxis : {
    //         labels: { enabled: false }
    //       },
    //       yAxis : {
    //         min : 0,
    //         title : {
    //           text : 'Avg. SelfTime'
    //         }
    //       },
    //       tooltip: {
    //         headerFormat : '',
    //         pointFormat : '{series.name}: <b>{point.y}</b>',
    //       },
    //       plotOptions : {
    //         column : {
    //          pointPadding: 0.20
    //         }
    //       },
    //       series : [{
    //         name : 'Self Time',
    //         data : dataArr
    //       }]
    //     }
    //   }

    deleteObjProp(json, arr) {
        json.forEach((val, index) => {
            arr.forEach((key, i) => {
                if (val.hasOwnProperty(key))
                    delete val[key];
            });
        });
    }

    /**For download table data */
    downloadReports(reports: string) {

        let downloadData = JSON.parse(JSON.stringify(this.methodTimingData));
        let renameArray = { "pN": "Package", "cN": "Class", "mN": "Method", "fG": "FunctionalGroup", "eN": "Fully Qualified Name With Signature", "percent": "Percentage", "sTOrg": "CumSelfTime(sec)", "avgST": "AvgSelfTime(ms)", "totWT": "CumWallTime(sec)", "avgWT": "AvgWallTime(ms)", "cumCPUST": "CumCpuSelfTime(sec)", "avgCPUST": "AvgCpuSelfTime(ms)", "min": "MinSelfTime(ms)", "max": "MaxSelfTime(ms)", "eC": "Count", "variance": "Variance", "waitTime": "WaitTime(ms)", "syncTime": "SyncTime(ms)", "iotime": "IOTime(ms)", "suspensiontime": "SuspensionTime(ms)" };
        let colOrder = ['Package', 'Class', 'Method', 'FunctionalGroup', 'Fully Qualified Name With Signature', 'Percentage', 'CumSelfTime(sec)', 'AvgSelfTime(ms)', 'CumWallTime(sec)', 'AvgWallTime(ms)', 'CumCpuSelfTime(sec)', 'AvgCpuSelfTime(ms)', 'MinSelfTime(ms)', 'MaxSelfTime(ms)', 'Count', 'Variance', 'WaitTime(ms)', 'SyncTime(ms)', 'IOTime(ms)', 'SuspensionTime(ms)'];

        let tempCols = [];
        for (var i = 0; i < this.visibleCols.length; i++) {
            if (renameArray[this.visibleCols[i]]) {
                tempCols.push(renameArray[this.visibleCols[i]]);
            }
        }
        let allRenameKeys = Object.keys(renameArray);
        let tempKeys = allRenameKeys.filter(
            (val) => {
                return this.visibleCols.indexOf(val) == -1;
            }); //filter hide column keys

        this.deleteObjProp(downloadData, tempKeys);

        downloadData.forEach((val, index) => {
            delete val['ID'];
            delete val['eT'];
            // delete val['eN'];
            delete val['cT'];
            delete val['_$visited'];
            delete val['avgCPU'];
            delete val['sT'];

            if (val['mN']) {
                if (val['mN'].toString().includes('-'))
                    val['mN'] = '-';
                if (val['mN'].endsWith('%40')) {
                    val['mN'] = val['mN'].substr(0, val['mN'].length - 3);
                }
            }

            //if (val['sT'])
            // val['sT'] = (Number(val['sT']) / 1000).toFixed(2);
            if (val['percent']) {
                if (Number(val['percent']) != 0 && Number(val['percent']) != 100)
                    val['percent'] = Number(val['percent']).toFixed(3);
            }
            if (val['totWT'])
                val['totWT'] = (Number(val['totWT']) / 1000).toFixed(2);
            if (val['avgST'])
                val['avgST'] = Number(val['avgST']).toFixed(3);
            if (val['avgWT'])
                val['avgWT'] = Number(val['avgWT']).toFixed(3);
        });
        let downloadObj: Object = {
            downloadType: reports,
            varFilterCriteria: this.downloadFilterCriteria,
            strSrcFileName: 'MethodTimingReport',
            strRptTitle: this.strTitle,
            renameArray: JSON.stringify(renameArray),
            colOrder: tempCols.toString(),
            jsonData: JSON.stringify(downloadData)
        };
        let downloadFileUrl = '';
        if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if (this.commonService.protocol.endsWith("://"))
                downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
            else
                downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        } else {
            downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
        }
        downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
        if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
        }
        else {
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
        }
    }
    sortColumnsOnCustom(event, tempData) {
        // console.log(event)
        let fieldValue = event["field"];
        if (fieldValue == "avgST" || fieldValue == "avgCPUST" || fieldValue == "percent" || fieldValue == "avgWT" || fieldValue == "sTOrg" || fieldValue == "totWT" || fieldValue == "cumCPUST") {
            if (event.order == -1) {
                event.order = 1
                tempData = tempData.sort(function (a, b) {
                    var value = parseFloat(a[fieldValue]);
                    var value2 = parseFloat(b[fieldValue]);
                    return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                });
            }
            else {
                event.order = -1;
                //asecding order
                tempData = tempData.sort(function (a, b) {
                    var value = parseFloat(a[fieldValue]);
                    var value2 = parseFloat(b[fieldValue]);
                    return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                });
            }
        } else {
            if (event.order == -1) {
                var temp = (event["field"]);
                event.order = 1
                tempData = tempData.sort(function (a, b) {
                    var value = Number(a[temp]);
                    var value2 = Number(b[temp]);
                    return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                });
            }
            else {
                var temp = (event["field"]);
                event.order = -1;
                //asecding order
                tempData = tempData.sort(function (a, b) {
                    var value = Number(a[temp]);
                    var value2 = Number(b[temp]);
                    return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                });
            }
        }

        this.methodTimingData = [];
        //console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.methodTimingData = this.Immutablepush(this.methodTimingData, rowdata) });
        }
    }

    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }

    getDCData() {
        let url = this.getHostUrl() + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.id.testRun;
        //this.http.get(url).map(res => res.json()).subscribe(data => (this.getNDEInfo(data)));
        this.ddrRequest.getDataUsingGet(url).subscribe(res => {
            let data = <any>res;
            console.log('COMPONENT - MethodTiming , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
            if (data.length == 0) {
                data = this.setNDEInfoForSingleDC();
                console.log("data is ", data);
            }
            if (this.commonService.dcNameList.indexOf(',') != -1) {
                this.getNDEInfo(data)
            } else {
                this.singleDCCase(data);
            }
        },
            error => {
                console.log("multiDC request is getting failed");
            });
    }

    setNDEInfoForSingleDC() {
        let data;
        if (this.id.dcName)
            data = [{ "displayName": this.id.dcName, "ndeId": 1, "ndeIPAddr": this.id.dcIP, "ndeTomcatPort": this.id.dcPort, "ndeCtrlrName": "", "pubicIP": this.id.dcIP, "publicPort": this.id.dcPort, "isCurrent": 1, "ndeTestRun": this.id.testRun, "ndeProtocol": location.protocol.replace(":", "") }];
        else if (this.commonService.host) {
            let protocol;
            if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
                protocol = this.commonService.protocol.replace("://", "");
            else
                protocol = location.protocol.replace(":", "");

            data = [{ "displayName": this.commonService.selectedDC, "ndeId": 1, "ndeIPAddr": this.commonService.host, "ndeTomcatPort": this.commonService.port, "ndeCtrlrName": "", "pubicIP": this.commonService.host, "publicPort": this.commonService.port, "isCurrent": 1, "ndeTestRun": this.commonService.testRun, "ndeProtocol": protocol }];
        }
        return data;
    }

    singleDCCase(res) {
        this.ndeInfoData = res;
        this.selectedDC = this.commonService.dcNameList;
        for (let i = 0; i < this.ndeInfoData.length; i++) {
            if (this.commonService.dcNameList == this.ndeInfoData[i].displayName) {

                if (this.ndeInfoData[i].ndeProtocol != undefined)
                    this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
                else
                    this.protocol = location.protocol.replace(":", "");

                if (this.ndeInfoData[i].ndeTestRun) {
                    this.id.testRun = this.ndeInfoData[i].ndeTestRun;
                    this.testRun = this.ndeInfoData[i].ndeTestRun;
                } else
                    this.testRun = this.id.testRun;

                this.host = this.ndeInfoData[i].ndeIPAddr;
                this.port = this.ndeInfoData[i].ndeTomcatPort;

                this.commonService.host = this.host;
                this.commonService.port = this.port;
                this.commonService.protocol = this.protocol;
                this.commonService.testRun = this.testRun;
                console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
                break;
            }
        }
        this.loader = true;
        this.getProgressBar();
        this.getMethodTimigData('method', '0');//By defult method tab will open
    }


    getTierNamesForDC(dcName) {
        try {
            return new Promise<void>((resolve, reject) => {
                console.log('getting tiername');
                var tierList = "";
                console.log('this.commonService.tierNameList====>', this.commonService.tierNameList);
                if (this.commonService.tierNameList && this.commonService.tierNameList.toString().indexOf(",") !== -1) {
                    var allTierDClistArr = this.commonService.tierNameList.split(",");
                    for (var i = 0; i < allTierDClistArr.length; i++) {
                        if (allTierDClistArr[i].startsWith(dcName)) {
                            var temp = (allTierDClistArr[i]).substring(dcName.length + 1);
                            tierList += temp + ",";
                        }
                    }
                    console.log("after removing dcName from tierList ***** " + tierList);
                    if (tierList == "")
                        tierList = this.commonService.tierNameList;

                    if (tierList)
                        this.id.tierName = tierList;
                }
                else {
                    if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
                        temp = (this.commonService.tierNameList).substring(dcName.length + 1);
                        tierList = temp;
                        tierList = tierList.substring(0, tierList.length);
                        if (tierList != "") {
                            this.id.tierName = tierList;
                            this.commonService.fpFilters['tierName'] = tierList;
                        }
                    } else {
                        this.id.tierName = this.commonService.tierNameList;
                        this.commonService.fpFilters['tierName'] = this.commonService.tierNameList;
                    }
                }
                console.log('tierName=====>', this.id.tierName);
                this.getTieridforTierName(this.id.tierName).then(() => { console.log("******then aaa "); resolve() });
            });
        } catch (e) {
            console.log('exception in here==============', e);
        }
    }

    getNDEInfo(res) {
        // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'Method Timing')
        if (this.breadcrumb && this.breadcrumb[0].label == 'Method Timing')
            this.showDCMenu = true;

        this.ndeInfoData = res;
        this.dcList = [];
        let dcName = this.commonService.dcNameList.split(',');
        let isFirst = false;

        for (let i = 0; i < this.ndeInfoData.length; i++) {
            if (dcName[i])
                this.dcList.push({ label: dcName[i], value: dcName[i] });

            if (this.commonService.selectedDC && this.commonService.selectedDC !== 'ALL') {
                this.selectedDC = this.commonService.selectedDC;
                console.log("this selected dc ", this.selectedDC);
            }
            else {
                console.log("esle case")
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

    getTieridforTierName(tierName) {
        return new Promise<void>((resolve, reject) => {
            try {

                console.log('reached here');
                var url = '';
                if (this.ndeCurrentInfo != undefined && this.ndeCurrentInfo != null && this.ndeCurrentInfo != '') {
                    if (this.ndeCurrentInfo.ndeProtocol != undefined && this.ndeCurrentInfo.ndeProtocol != null && this.ndeCurrentInfo.ndeProtocol != '') {
                        let protocol = this.ndeCurrentInfo.ndeProtocol;
                        if (protocol.endsWith(":"))
                            protocol = protocol.replace(":", "");

                        url = protocol + '://' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
                    }
                    else
                        url = '//' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
                }
                else {
                    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
                    //     url = "//" + this.getHostUrl();
                    // }
                    // else
                    url = this.getHostUrl();
                }
                url += '/' + this.id.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.id.testRun + "&tierName=" + tierName;
                this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
                    this.assignTierID(data)
                    resolve();
                });
            } catch (e) {
                console.log('exception in making rest=====', e);
            }
        });
    }

    assignTierID(res) {
        try {
            var temp = res.split(":");
            this.id.tierid = temp[0].trim();
        } catch (e) {
            console.log('exception in getting tier id=====', e);
        }
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
                    this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
                else
                    this.dcProtocol = location.protocol.replace(":", "");

                if (this.ndeInfoData[i].ndeTestRun) {
                    this.testRun = this.ndeInfoData[i].ndeTestRun;
                    this.id.testRun = this.ndeInfoData[i].ndeTestRun;
                }
                else
                    this.testRun = this.id.testRun;

                this.host = this.ndeInfoData[i].ndeIPAddr;
                this.port = this.ndeInfoData[i].ndeTomcatPort;

                this.commonService.host = this.host;
                this.commonService.port = this.port;
                this.commonService.protocol = this.dcProtocol;
                this.commonService.testRun = this.testRun;
                this.commonService.selectedDC = this.selectedDC;
                console.log('commonservice variable------->', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
                break;
            }
        }
        this.getTierNamesForDC(this.selectedDC).then(() => {
            this.loader = true;
            this.getProgressBar();
            this.getMethodTimigData('method', '0');//By defult method tab will open           
        })
    }

    /**To open Download file from backend to browser */
    openDownloadReports(res) {
        let url = '';
        if (this.commonService.protocol && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if (this.commonService.protocol.endsWith("://"))
                url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
            else
                url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        }
        else {
            url = decodeURIComponent(this.getHostUrl(true));
        }

        url += '/common/' + res;
        window.open(url);
    }

    ApplyignoreFP() {
        this.loading = true;
        this.ignoreFlag = false;
        this.isApplied = true;
        // console.log("this.urlPramObj['type']",this.urlPramObj['type']);
        //console.log("this.urlPramObj['entity']",this.urlPramObj['entity']);
        this.getMethodTimigData(this.urlPramObj['type'], this.urlPramObj['entity']);
    }

    showMessage(mssg: any) {
        this.msgs = [];
        if (mssg == "Query Saved") {
            let smsg = "Query Saved as " + this._ddrData.saveMessage;
            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: smsg });
        }
        else if (mssg == "Query Already Defined")
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
        else
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    }

    ngOnDestroy() {
        console.log("on destroy case--methodtiming report---");
        this.sideBarMethodTiming.unsubscribe();
    }
}
