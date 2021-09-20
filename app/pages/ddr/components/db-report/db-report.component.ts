import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { Observable } from 'rxjs';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { SelectItem } from '../../interfaces/selectitem';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { MessageService } from '../../services/ddr-message.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
    selector: 'db-report',
    templateUrl: 'db-report.component.html',
    styleUrls: ['db-report.component.scss']
})
export class DbReportComponent {
    highcharts = Highcharts;
    sortOn = "";
    queryDetail: Object[] = [{
        "tierName": "", "tierId": "", "serverName": "", "serverId": "", "appName": "", "appId": "", "urlName": "", "count": "", "min": "", "max": "", "cumsqlexectime": "", "mincumsqlexectime": "", "maxcumsqlexectime": "", "avg": "", "failedcount": "", "sqlIndex": "", "sqlQuery": "", "urlIndex": "", "id": 0, "sqlbegintimestamp": "", "sqlendtimestamp": "", "sqlquery": ""
    }];
    id: any;
    screenHeight: any;
    fullQueryName: String;
    totalQueryCount: string;
    cols: any;
    visibleCols: any;
    prevColumn;
    columnOptions: SelectItem[];
    startTimeInMs: string;
    endTimeInMs: string;
    customFlag: boolean = false;
    limit = 50;
    offset = 0;
    totalCount: Number;
    ajaxUrl: string;
    isFilterFromSideBar: boolean = false;
    showDownloadOption: boolean = true;
    loading: boolean = false;
    strTitle: string;
    queryInfo: Array<QueryInterface>;
    filterInfo: string;
    tableHeader: string = "DB Request";
    showChart: boolean = true;
    chartData: Object[];
    wholeData: any[];
    topNQueries: string = '';
    options: object;
    restDataArrOfPie: any[];
    showAllOption: boolean = false;
    dataFromFPComponent: any;
    backend_ID: any;
    numberOfRows: number = 1;
    msgs: Message[] = [];

    tierName = '';
    serverName = '';
    instanceName = '';
    completeTier = '';
    completeServer = '';
    completeInstance = '';
    URLstr: string;
    CompleteURL: string;
    headerInfo = "";
    downloadHeaderInfo = '';

    //DC variables
    ndeCurrentInfo: any;
    ndeInfoData: any;
    protocol: string = '//';
    dcProtocol: string = '//';
    host = '';
    port = '';
    testRun: string;
    dcList: SelectItem[];
    selectedDC;
    showDCMenu = false;
    filterDCName = '';
    downloadFilterCriteria = '';
    showPagination: boolean = false;
    private sideBarDbReport: Subscription;
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId: any;
    breadcrumb: BreadcrumbService;
    empty: boolean;
    
    constructor(public commonService: CommonServices,
        private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private _ddrData: DdrDataModelService, private _router: Router, private messageService: MessageService,
        private breadcrumbService: DdrBreadcrumbService,
        private ddrRequest: DDRRequestService, breadcrumb: BreadcrumbService,
        private sessionService: SessionService) {
            this.breadcrumb = breadcrumb;
        }

    ngOnInit() {
        this.commonService.isFromCQM=false;
        this.loading = true;
        var that = this;
        window.onpopstate = function (event) {
            that.commonService.isFilterFromSideBar = true;
            console.log(' window.onpopstate called ---isFilterFromSideBar--', that.commonService.isFilterFromSideBar);
        };
        this.commonService.enableQueryCaching = this._ddrData.enableQueryCaching;
        this.screenHeight = Number(this.commonService.screenHeight) - 100;
        // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.DB_REPORT);
        this.breadcrumb.add({label: 'DB Queries', routerLink: '/ddr/dbReport'});
        if (this._ddrData.splitViewFlag == false)
            this.commonService.isToLoadSideBar = true;
        this.commonService.currentReport = "DB Report";
        this.id = this.commonService.getData();
        this.randomNumber();

        this.commonService.removeFromStorage();
        this.commonService.setParameterIntoStorage = this.id;
        console.log('ngOnInit this.id==', this.id);
        if (this.commonService.signatureToDB === true) {
            this.dataFromFPComponent = this.commonService.getFPData;
        }
        if (this.id.strStartTime == undefined && this.id.strEndTime == undefined) {
            this.startTimeInMs = this.id.startTime;
            this.endTimeInMs = this.id.endTime;
        } else {
            this.startTimeInMs = this.id.strStartTime;
            this.endTimeInMs = this.id.strEndTime;
        }
        if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
            this.getDCData();
        } else {
            this.getQueryData();
            this.getQueryDataCount();
            this.commonService.host = '';
            this.commonService.port = '';
            this.commonService.protocol = '';
            this.commonService.testRun = '';
            this.commonService.selectedDC = '';
        }

        this.createColumns();
        this.setReportHeader();
        this.sideBarDbReport = this.commonService.sideBarUIObservable$.subscribe((temp) => {
            if (this.commonService.currentReport == "DB Report") {
                console.log('data coming from side bar to db report', temp)
                this.commonService.isFilterFromSideBar = true;
                this.limit = 50;
                this.topNQueries = this.commonService.dbFilters.topNQueries;
                this.createColumns();
                this.getQueryData();
                this.getQueryDataCount();
            }
        });
        if (sessionStorage.getItem("dcNameList") != null && sessionStorage.getItem("dcNameList") != '' && sessionStorage.getItem("dcNameList") != undefined && sessionStorage.getItem("dcNameList") != 'undefined') {
            this.commonService.dcNameList = sessionStorage.getItem("dcNameList");
            this.commonService.tierNameList = sessionStorage.getItem("tierNameList");
            this.commonService.isAllCase = sessionStorage.getItem("isAllCase");
        }
        this._ddrData.passMesssage$.subscribe((mssg) => { this.showMessage(mssg) });
    }

    createColumns() {
        this.cols = [

            { field: 'sqlQuery', header: 'Query', sortable: true, action: true, align: 'left', color: 'black', width: '200' },
            { field: 'count', header: 'Query Count', sortable: 'true', action: true, align: 'right', color: 'blue', width: '70' },
            { field: 'failedcount', header: 'Error Count', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '50' },
            { field: 'min', header: 'Min Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '50' },
            { field: 'max', header: 'Max Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '50' },
            { field: 'mincumsqlexectime', header: 'Min(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '50' },
            { field: 'maxcumsqlexectime', header: 'Max(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '50' },
            { field: 'avg', header: 'Avg(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '50' },
            { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left', color: 'black', width: '70' },
            //    { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '70' },
            //   { field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left', color: 'black', width: '100' }
        ];
        this.visibleCols = [
            'sqlQuery', 'count', 'failedcount', 'min', 'max', 'mincumsqlexectime', 'maxcumsqlexectime', 'avg'
        ];

        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
        }
    }

    randomNumber() {
        this.queryId = (Math.random() * 1000000).toFixed(0);
        console.log("this.queryId:::::::::::::" + this.queryId);
    }

    getQueryData() {
        console.log("this._ddrData.urlName--", this._ddrData.urlName);
        if (this.id.dbReportCategory == 'DB Request Report') {
            this.id.strOrderBy = 'exec_time_desc'; // beacuse undefined is passing in orderby from webdashboard
        }
        var url = "";
        let urlParam = "";
        let pagination = "&limit=" + this.limit + "&offset=" + this.offset;
        let flag = "&showCount=false&customFlag=" + this.customFlag;
        let report = "";

        if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
            this.showDCMenu = false;
            // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
            //   url = this._ddrData.protocol + "://" + this.getHostUrl();
            // }
            // else
            url = this.getHostUrl();

            console.log("urllll formeddddd", url);
        }

        else {
            //this.showDCMenu = true;
            this.dcProtocol = this.commonService.protocol;

            if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
                url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
                this.dcProtocol = this.commonService.protocol;
            } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
                url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
                this.dcProtocol = this.commonService.protocol;
            }
            else {
                url = location.protocol.replace(':', '') + "//" + this.commonService.host + ':' + this.commonService.port;
                this.dcProtocol = location.protocol.replace(':', '');
            }
        }
        if (this.commonService.enableQueryCaching == 1) {
            url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun;
        } else {
            url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?testRun=" + this.id.testRun;
        }
        if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.dbFilters).length != 0) {
            if (this._ddrData.strOrderBy && this.commonService.queryCountToDB['fromDBCallByBT'] != 'true') {
                this.commonService.dbFilters['strOrderBy'] = this._ddrData.strOrderBy
                console.log(" this.commonService.dbFilters['strOrderBy']--", this.commonService.dbFilters['strOrderBy']);
            }

            let dbParam = this.commonService.dbFilters;

            if (this.commonService.isValidParamInObj(dbParam, 'ndeProtocol') && this.commonService.isValidParamInObj(dbParam, 'pubicIP') && this.commonService.isValidParamInObj(dbParam, 'publicPort') && this.commonService.isValidParamInObj(dbParam, 'ndeTestRun')) {
                if (this.commonService.enableQueryCaching == 1) {
                    url = dbParam['ndeProtocol'] + "://" + dbParam['pubicIP'] + ":" + dbParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?cacheId=' + dbParam['ndeTestRun'] + '&testRun=' + dbParam['ndeTestRun'];
                }
                else {
                    url = dbParam['ndeProtocol'] + "://" + dbParam['pubicIP'] + ":" + dbParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?testRun=' + dbParam['ndeTestRun'];
                }
                console.log("this.url--", url);
            }
            console.log("inside this.commonService.isFilterFromSideBar---dbParam ", dbParam);
            urlParam = this.commonService.makeParamStringFromObj(dbParam);
        }
        else {

            if (this._ddrData.queryCountToDBFlag == true) {
                console.log("making urlparam from this.commonService.queryCountToDBFlag--", this._ddrData.queryCountToDBFlag);

                urlParam = "&tierName=" + this.commonService.queryCountToDB.tierName
                    + "&serverName=" + this.commonService.queryCountToDB.serverName + "&appName=" + this.commonService.queryCountToDB.appName
                    + "&strStartTime=" + this.commonService.queryCountToDB.strStartTime + "&strEndTime=" + this.commonService.queryCountToDB.strEndTime + "&statusCode=-2"
                    + "&strOrderBy=" + this.commonService.queryCountToDB.strOrder + "&object=6" + "&urlIndex=" + this.commonService.queryCountToDB.urlIdx
                    + "&btcategoryId=" + this.commonService.queryCountToDB.btcategoryId;

            }
            else {



                let group = ''
                if (this.id.tierName && this.id.tierName != 'NA' && (this.id.serverName && this.id.serverName != 'NA') && (this.id.appName && this.id.appName != 'NA'))
                    group = 'tier,server,app';
                else if (this._ddrData.strGroup == null || this._ddrData.strGroup == "tier")
                    group = 'tier';
                else
                    group = 'url';

                let btCat = this.id.btCategory;
                if (this.id.btCategory && this.id.btCategory.toLowerCase() == "all") {
                    btCat = undefined;
                }
                urlParam = "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName +
                    "&tierId=" + this.id.tierid + "&serverId=" + this.id.serverid + "&appId=" + this.id.appid + "&strStartTime=" +
                    this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&statusCode=-2" +
                    "&strOrderBy=" + this.id.strOrderBy + "&object=6" + "&urlIndex=" + this.id.urlIndex + "&btcategoryId=" + btCat +
                    "&urlName=" + this.id.urlName + "&backend_ID=" + this._ddrData.backendId;
                if (this.commonService.signatureToDB === true)
                    urlParam += '&flowpathSignature=' + this.dataFromFPComponent.flowpathSignature;
                else
                    urlParam += '&strGroup=' + group

                console.log("urlparammm---===>>>", urlParam);

            }
            let urlPramObj = this.commonService.makeObjectFromUrlParam(urlParam + report);
            this.commonService.dbFilters = urlPramObj;

        }
        this.ajaxUrl = url + urlParam; //using it as count query parameter
        let obj = this.commonService.makeObjectFromUrlParam(urlParam + report);
        this.setDefaultSort(obj['strOrderBy']);
        url += urlParam + pagination + flag;
        url += '&queryId=' + this.queryId;
        console.log(' Url------', url);
        setTimeout(() => {
            this.openpopup();
        }, this._ddrData.guiCancelationTimeOut);

        return this.ddrRequest.getDataUsingGet(url).subscribe(
            data => { this.doAssignValues(data) },
            error => {
                this.loading = false;
                if (error.hasOwnProperty('message')) {
                    this.commonService.showError(error.message);
                }
            }

        );

    }
    getQueryDataCount() {
        let flag = "&customFlag=" + this.customFlag + "&showCount=true";
        //let pagination ="&limit=" + this.limit + "&offset=" + this.offset ;
        let counturl = this.ajaxUrl + flag;
        return this.ddrRequest.getDataUsingGet(counturl).subscribe(data => (this.assignCountValues(data)));

    }
    assignCountValues(res: any) {

        this.customFlag = false;
        this.totalCount = res.totalCount;
        if (this.totalCount > 50) { //If data is less then 50 then no pagination .
            this.showPagination = true;
        } else {
            this.showPagination = false;
        }
        if (this.totalCount > 0 && this.limit > this.totalCount)
            this.limit = Number(this.totalCount);
    }
    doAssignValues(res: any) {
        console.log("data is--", res);
        this.isCancelQuerydata = true;
        if (res.hasOwnProperty('Status')) {
            this.commonService.showError(res.Status);
        }
        this.commonService.isFilterFromSideBar = false;
        this.queryDetail = res.data;
        this.loading = false;
        this.totalQueryCount = " [ Total Query Count: " + res.queryCount + "]";
        this.queryInfo = this.getQueryInfo();

        if (this.queryDetail.length === 0) {
            this.limit = 0;
            this.offset = 0;
            this.showDownloadOption = false;
            this.empty = true;
            this.fullQueryName = 'No Query is present.';
        }
        else
            this.showDownloadOption = true;

        this.commonService.dbFilters['startTimeInDateFormat'] = res.startTime;
        this.commonService.dbFilters['endTimeInDateFormat'] = res.endTime;
        this.createPieChart(res);
        this.createFilterCriteria();

    }

    getQueryInfo(): Array<QueryInterface> {
        var queryArr = [];
        // this.cols = [
        //     { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left', color: 'black', width: '75' },
        //     { field: 'sqlQuery', header: 'Query', sortable: true, action: true, align: 'left', color: 'black', width: '290' },
        //     { field: 'count', header: 'Query Count', sortable: 'true', action: true, align: 'right', color: 'blue', width: '65' },
        //     { field: 'failedcount', header: 'Error Count', sortable: true, action: true, align: 'right', color: 'blue', width: '65' },
        //     { field: 'min', header: 'Min Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '65' },
        //     { field: 'max', header: 'Max Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '65' },
        //     { field: 'mincumsqlexectime', header: 'Min(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '65' },
        //     { field: 'maxcumsqlexectime', header: 'Max(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '65' },
        //     { field: 'avg', header: 'Average(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '65' }
        //   ];     
        if (this.queryDetail.length > 0) {
            if (this.queryDetail[0]["serverName"] != "-" && this.queryDetail[0]["appName"] != "-") {
                this.cols.push({ field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '70' })
                this.cols.push({ field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left', color: 'black', width: '100' })
            }
            console.log("this.cols--", this.cols);


            for (var i = 0; i < this.queryDetail.length; i++) {
                if (this.queryDetail[i]['sqlQuery'] != undefined)
                    this.queryDetail[i]['sqlQuery'] = this.queryDetail[i]['sqlQuery'].replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");
                else
                    this.queryDetail[i]['sqlquery'] = this.queryDetail[i]['sqlquery'].replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");
                if (i == 0) {
                    /*if(this.isDBCallByBT == true)
                    this.fullQueryName = this.queryDetail[0]['urlName'];
                  else*/
                    this.fullQueryName = this.queryDetail[0]['sqlQuery'] || this.queryDetail[0]['sqlquery'];
                }

                queryArr[i] = { tierName: this.queryDetail[i]["tierName"], tierId: this.queryDetail[i]["tierId"], serverName: this.queryDetail[i]["serverName"], serverId: this.queryDetail[i]["serverId"], appName: this.queryDetail[i]["appName"], appId: this.queryDetail[i]["appId"], count: this.queryDetail[i]["count"], min: this.queryDetail[i]["min"], max: this.queryDetail[i]["max"], avg: this.queryDetail[i]["avg"], failedcount: this.queryDetail[i]["failedcount"], sqlQuery: this.queryDetail[i]["sqlQuery"], sqlIndex: this.queryDetail[i]["sqlIndex"], mincumsqlexectime: this.queryDetail[i]["mincumsqlexectime"], maxcumsqlexectime: this.queryDetail[i]["maxcumsqlexectime"], urlName: this.queryDetail[i]["urlName"], urlIndex: this.queryDetail[i]["urlIndex"], sqlquery: this.queryDetail[i]["sqlquery"], sqlbegintimestamp: this.queryDetail[i]["sqlbegintimestamp"], sqlendtimestamp: this.queryDetail[i]["sqlendtimestamp"], cumsqlexectime: this.queryDetail[i]["cumsqlexectime"] };
            }
            return queryArr;
        }
        else {
            //   this.showChart = false;
            //   this.showChartForRespTime = false;
            //this.showBarChart = false;
            return queryArr;
        }
    }
    paginate(event) {
        this.loading = true;
        this.offset = parseInt(event.first);
        this.limit = parseInt(event.rows);
        if (this.limit > this.totalCount) {
            this.limit = Number(this.totalCount);
        }
        if ((this.limit + this.offset) > this.totalCount) {
            this.limit = Number(this.totalCount) - Number(this.offset);
        }
        this.commonService.isFilterFromSideBar = true;
        this.createColumns();
        this.getQueryData();
    }

    setDefaultSort(order) {
        if (order == "exec_time_desc" || order == "undefined")
            this.sortOn = "avg";
        if (order == "count_desc")
            this.sortOn = "count";
        if (order == "query_count")
            this.sortOn = "failedcount";
        if (order == "query")
            this.sortOn = "sqlQuery";
    }

    clickHandler(event) {
        console.log("inside click handler -- event -- ", event);
        if (event.point != undefined) {
            this.showAllOption = true;
            if (event.point.name == "Other") {

                this.queryInfo = this.restDataArrOfPie;
                this.numberOfRows = this.queryInfo.length;
            }
            else {
                let filteredData = [];
                for (let k = 0; k < this.chartData.length; k++) {
                    if (this.chartData[k]["sqlQuery"] == event.point.name || this.chartData[k]["sqlquery"] == event.point.name) {
                        filteredData.push(this.chartData[k]);
                    }
                }
                this.queryInfo = filteredData;
                this.numberOfRows = 1;
            }
            this.showRowInfo(this.queryInfo[0]);
        }
    }
    showAllData() {
        this.showAllOption = false;
        this.queryInfo = this.wholeData;
        //this.pointName = "";
    }
    getOrderName(order) {
        console.log("order is --", order);
        if (order == 'exec_time_desc')
            return 'Response Time'
        else if (order == 'count_desc')
            return 'Counts'
        else if (order == 'query_count')
            return 'Error Counts'
        else if (order == 'query')
            return 'Query'
        else
            return order;

    }
    sortColumnsOnCustom(event, queryInfo) {
        console.log('sorting')
        let fieldValue = event["field"];
        if (fieldValue == "max" || fieldValue == "min" || fieldValue == "failedcount") {
            if (event.order == -1) {
                event.order = 1
                queryInfo = queryInfo.sort(function (a, b) {
                    var value = parseInt(a[fieldValue]);
                    var value2 = parseInt(b[fieldValue]);
                    return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                });
            }
            else {
                event.order = -1;
                //asecding order
                queryInfo = queryInfo.sort(function (a, b) {
                    var value = parseInt(a[fieldValue]);
                    var value2 = parseInt(b[fieldValue]);
                    return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                });
            }
            // console.log("queryInfo ----",queryInfo)
        }

        // this.queryInfo = [];
        this.queryInfo = queryInfo.slice();
        // if (queryInfo) {
        //   queryInfo.map((rowdata) => { 
        //       console.log("rowdata--",rowdata);
        //     this.queryInfo = this.Immutablepush(this.queryInfo, rowdata) });
        // }
    }
    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }
    createFilterCriteria() {
        let dbParam = this.commonService.dbFilters;
        this.headerInfo = "";
        this.downloadHeaderInfo = '';
        this.URLstr = "";
        this.CompleteURL = "";
        this.tierName = '';
        this.serverName = '';
        this.instanceName = '';
        this.completeTier = '';
        this.completeServer = '';
        this.completeInstance = '';
        this.downloadFilterCriteria = '';
        let dBHeader = this.commonService.dbFilters;
        let dcName = "";
        // for the first time when filter criteria loads for DB report
        if(!(this.commonService.isFromCQM===true))
        {
        if(dbParam['strOrderBy'] === "undefined" || dbParam['strOrderBy'] === undefined)
        {
            dbParam['strOrderBy']='exec_time_desc'; 
        }
    }

        console.log("fpHeader --", JSON.stringify(dBHeader));
        if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
            dcName = this.selectedDC;
        }
        else if (sessionStorage.getItem("isMultiDCMode") == "true") {
            let dcName = this._cavConfigService.getActiveDC();
            if (dcName == "ALL")
                dcName = this._ddrData.dcName;
            this.tierName += "DC= " + dcName + ', ';
            this.downloadHeaderInfo += "DC= " + dcName + ', ';
            if (this._ddrData.isFromtrxFlow && (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true")) {
                this.tierName = 'DC=' + this._ddrData.dcNameTr + ', ';
                this.downloadHeaderInfo = 'DC=' + this._ddrData.dcNameTr + ', ';
            }
        }

        if (this.commonService.isValidParamInObj(dbParam, "tierName")) {
            if (dcName) {
                this.tierName += "DC= " + dcName + ', ';
                this.downloadHeaderInfo += "DC= " + dcName + ', ';
                if (this._ddrData.isFromtrxFlow && (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true")) {
                    this.tierName = 'DC=' + this._ddrData.dcNameTr + ', ';
                    this.downloadHeaderInfo = 'DC=' + this._ddrData.dcNameTr + ', ';
                }

            }
            if (dbParam['tierName'].length > 32) {
                this.tierName += "Tier=" + dbParam['tierName'].substring(0, 32) + '...';
                this.completeTier = dbParam['tierName'];
            }
            else
                this.tierName += "Tier=" + dbParam['tierName'];

            this.downloadHeaderInfo += 'Tier=' + dbParam['tierName'];

        }

        if (this.commonService.isValidParamInObj(dbParam, "serverName")) {
            this.downloadHeaderInfo += ", Server=" + dbParam['serverName'];
            if (dbParam['serverName'].length > 32) {
                this.serverName = ", Server=" + dbParam['serverName'].substring(0, 32) + '...';
                this.completeServer = dbParam['serverName'];
            }
            else
                this.serverName = ", Server=" + dbParam['serverName'];

            this.downloadHeaderInfo += 'Server=' + dbParam['serverName'];

        }

        if (this.commonService.isValidParamInObj(dbParam, "appName")) {
            this.downloadHeaderInfo += ", Instance=" + dbParam['appName'];
            if (dbParam['appName'].length > 32) {
                this.instanceName += ", Instance=" + dbParam['appName'].substring(0, 32) + '...';
                this.completeInstance += dbParam['appName'];
            }
            else
                this.instanceName += ", Instance=" + dbParam['appName'];

            this.downloadHeaderInfo += 'Instance=' + dbParam['appName'];
        }

        if (this.commonService.isValidParamInObj(dbParam, "startTimeInDateFormat"))
            this.headerInfo += ", From=" + dbParam['startTimeInDateFormat'];

        if (this.commonService.isValidParamInObj(dbParam, "endTimeInDateFormat"))
            this.headerInfo += ", To=" + dbParam['endTimeInDateFormat'];

        if (this.commonService.isValidParamInObj(dbParam, "btcategoryId")) {
            this.headerInfo += ', BT Type=' + this.commonService.getBTCategoryName(dbParam['btcategoryId']);
        }

        if (this.commonService.isValidParamInObj(dbParam, "urlName")) {
            this.headerInfo += ', BT=' + dbParam['urlName'];  // BT 
        }

        if (this.commonService.isValidParamInObj(dbParam, "strOrderBy")) {
            console.log('dbParamstrOrderB--', dbParam['strOrderBy'])
            console.log("value-", this.getOrderName(dbParam['strOrderBy']));
            this.headerInfo += ', OrderBy=' + this.getOrderName(dbParam['strOrderBy']);
            console.log("headerInfo........", this.headerInfo, "Value.......",this.getOrderName );
        }
        if (this._ddrData.backendName) {
            this.headerInfo += " , DB=" + this._ddrData.backendName;

        }




        //   if (this.commonService.isValidParamInObj(dbParam, "url"))  //NS url 
        //   {
        //     let val = dbParam['url'];
        //     if (val.length > 40) {
        //       this.URLstr = ', URL=' + val.substring(0, 40) + "..";
        //       this.CompleteURL = val;
        //     }
        //     else {
        //       this.URLstr = ', URL=' + val;
        //       this.CompleteURL = val;
        //     }
        //   }
        //this.downloadHeaderInfo += this.headerInfo;

        if (!this.commonService.isValidParamInObj(dbParam, "tierName") && !this.commonService.isValidParamInObj(dbParam, "serverName") && !this.commonService.isValidParamInObj(dbParam, "appName")) {
            if (this.headerInfo.startsWith(","))
                this.headerInfo = this.headerInfo.substring(1);
        }

        this.downloadHeaderInfo += this.headerInfo;
        if (this.downloadHeaderInfo.startsWith(","))
            this.downloadHeaderInfo = this.downloadHeaderInfo.substring(1);

        if (this.downloadHeaderInfo.endsWith(","))
            this.downloadHeaderInfo = this.downloadHeaderInfo.substring(0, this.downloadHeaderInfo.length - 1);

    }

    createPieChart(pieData: any) {

        let dbParams = this.commonService.dbFilters;
        console.log("dbParams inside piechart", dbParams);
        if (this.topNQueries == '' || this.topNQueries == undefined)
            this.topNQueries = '5';

        let queryName;
        let avgRespTime;
        let dataArr = [];
        let restDataArr = [];
        let tooltipHoverType = "";
        let pieText = "Top " + this.topNQueries + " DB Queries By Response Time";
        this.chartData = pieData.data;
        console.log("this.chartData--", this.chartData);
        this.wholeData = this.chartData;
        if (this.chartData.length == 0) {
            this.showChart = false;
        }
        else {
            this.showChart = true;
        }
        if (this._ddrData.queryCountToDBFlag == true) {
            pieText = "Top " + this.topNQueries + " DB Queries By Response Time";
            this.tableHeader = "DB Request By url";
            tooltipHoverType = " Response Time: ";
        }
        else if (dbParams.strOrderBy == "exec_time_desc") {
            pieText = "Top " + this.topNQueries + " DB Queries By Response Time";
            this.tableHeader = "Slow DB Calls By Response Time";
            tooltipHoverType = " Response Time: ";
        }
        else if (dbParams.strOrderBy == "count_desc") {
            pieText = "Top " + this.topNQueries + " DB Calls By Count";
            this.tableHeader = "Top " + this.topNQueries + " DB Calls By Count";
            tooltipHoverType = " Count: ";
        }
        else if (dbParams.strOrderBy == "query_count") {
            pieText = "Top " + this.topNQueries + " DB Queries By Error Count";
            this.tableHeader = "Top DB Queries By Error Count";
            tooltipHoverType = " Error Count: ";
        }
        else {
            pieText = "Top " + this.topNQueries + " DB Queries By Response Time";
            this.tableHeader = "DB Request ";
            tooltipHoverType = " Response Time: ";

        }
        this.tableHeader += this.totalQueryCount;
        console.log("this.id inside pie--", this.id);
        for (var i = 0; i < this.chartData.length; i++) {

            if (i < Number(this.topNQueries)) {
                let queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];

                if (dbParams.strOrderBy == "exec_time_desc" || this._ddrData.queryCountToDBFlag == true) {
                    let avgRespTime = this.chartData[i]["avg"];
                    dataArr.push({ "name": queryName, "y": Number(avgRespTime.toFixed(3)) });
                }
                else if (dbParams.strOrderBy == "count_desc") {
                    let count = this.chartData[i]["count"];
                    dataArr.push({ "name": queryName, "y": Number(count) });

                }
                else if (dbParams.strOrderBy == "query_count") {

                    let errorCount = this.chartData[i]["failedcount"];
                    dataArr.push({ "name": queryName, "y": Number(errorCount) })
                }
                else {
                    let avgRespTime = this.chartData[i]["avg"];
                    dataArr.push({ "name": queryName, "y": Number(avgRespTime.toFixed(3)) });
                }
            }
            else {
                restDataArr.push(this.chartData[i]);
            }
        }
        this._ddrData.queryCountToDBFlag = false;
        if (this.chartData.length > Number(this.topNQueries)) {
            let totalRespTime = 0;
            let totalQueryCount = 0;
            let totalErrorCount = 0;
            queryName = "Other";

            for (let j = 0; j < restDataArr.length; j++) {
                totalRespTime += Number(restDataArr[j]["avg"]);
                totalQueryCount += Number(restDataArr[j]["count"]);
                totalErrorCount += Number(restDataArr[j]["failedcount"]);
            }

            if (this._ddrData.queryCountToDBFlag == true || dbParams.strOrderBy == "exec_time_desc") {
                dataArr.push({ "name": queryName, "y": Number(totalRespTime.toFixed(3)) });
            }
            else if (dbParams.strOrderBy == "count_desc") {
                dataArr.push({ "name": queryName, "y": Number(totalQueryCount) });

            }
            else if (dbParams.strOrderBy == "query_count") {
                dataArr.push({ "name": queryName, "y": Number(totalErrorCount) })
            }
            else
                dataArr.push({ "name": queryName, "y": Number(totalRespTime.toFixed(3)) });

        }
        this.restDataArrOfPie = restDataArr;
        console.log("dataArr--", dataArr);
        this.options = {
            chart: {
                type: "pie",
                width: 400
            },
            credits: {
                enabled: false
            },
            title: {
                text: pieText,
                style: { 'fontSize': '13px' }
            },
            legend: {
                itemWidth: 400
            },
            tooltip: {
                //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>,Response Time: <b>{point.y}</b>'
                style: {
                    fontSize: '7pt',
                    width: 300,
                    height: 50
                },
                formatter: function () {
                    let tooltip = "";
                    let pointName = this.point.name;
                    if (pointName.length > 60)
                        tooltip += pointName.substring(0, 60) + "...";
                    else
                        tooltip += pointName;
                    tooltip += " Percentage: " + "<b>" + this.point.percentage.toFixed(2) + "%" + "</b>" + "," + tooltipHoverType + "<b>" + this.point.y + "</b>";
                    return tooltip;
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [
                {
                    name: "Percentage",
                    data: dataArr,
                    enableMouseTracking: true
                }
            ]
        };
    }

    getHostUrl(isDownloadCase?): string {
        var hostDcName;
        if (this._ddrData.isFromtrxFlow) {
            hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
            this.id.testRun = this._ddrData.testRunTr;
            //   return hostDCName;
        }
        // Due to A-9 migration..
        // else if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
        else if (this.sessionService.preSession.multiDc == true) {
                //hostDcName = "//" + this._ddrData.host + ':' + this._ddrData.port;
                this.id.testRun = this._ddrData.testRun;
                //this.testRun= this._ddrData.testRun;
                hostDcName = this._ddrData.getHostUrl(isDownloadCase) + "/tomcat" + "/ALL";
                console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
            }
        else {
              hostDcName = this._ddrData.getHostUrl(isDownloadCase);
              console.log("Inside the else case ==", hostDcName);
            // else if (this._navService.getDCNameForScreen("dbQuery") === undefined)
            //     hostDcName = this._cavConfigService.getINSPrefix();
            // else
            //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("dbQuery");

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

    getDbFlowpathData(data) {
        this._ddrData.dbTofpflag = true;
        this.commonService.previousReport = 'Flowpath'
        this.commonService.dbflowpathdata = data;
        this.commonService.dbflowpathdata['strStartTime'] = this.commonService.dbFilters['strStartTime'];
        this.commonService.dbflowpathdata['strEndTime'] = this.commonService.dbFilters['strEndTime'];
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.DB_REPORT;
        if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
            this._router.navigate(['/home/ddrCopyLink/flowpath']);
        } else {
            this._router.navigate(['/ddr/flowpath']);
        }
    }

    openErrorCount(rowData: any) {
        if (rowData !== undefined) {
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.DB_REPORT;
            this.commonService.fromDBtoExpFlag = true;
            this.commonService.fromDBtoExpData = rowData;
            if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
                this._router.navigate(['/home/ddrCopyLink/exception']);
            } else {
                this._router.navigate(['/ddr/exception']);
            }
        }
        //let  ipWithProd = this.getHostUrl() + '/' + this.id.product;
        //var url = "//" + ipWithProd.substring(0,ipWithProd.lastIndexOf("/")) + "/WEB-DDR/index.html?testRun="+ this.id.testRun + "&tierName=" + nodeData.tierName + "&serverName=" + nodeData.serverName + "&appName=" + nodeData.appName + "&tierid=" + nodeData.tierId + "&serverid=" + nodeData.serverId + "&appid=" + nodeData.appId + "&strStartTime=" + this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&backendSubType=" + nodeData.sqlIndex + "&exceptionType=1&failedQuery=1" + "&ipWithProd=" + ipWithProd ;   
        //window.open(url);
    }
    showRowInfo(nodeInfo: any) {
        if (nodeInfo.sqlQuery == undefined)
            this.fullQueryName = nodeInfo.sqlquery;
        else
            this.fullQueryName = nodeInfo.sqlQuery;
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
    getDCData() {
        let url = this.getHostUrl() + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.id.testRun;
        this.ddrRequest.getDataUsingGet(url).subscribe(res => {
            let data = <any>res;
            console.log('COMPONENT - DbReport , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
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

    // setNDEInfoForSingleDC(){
    //     let data = [{"displayName": this.id.dcName,"ndeId": 1,"ndeIPAddr": this.id.dcIP,"ndeTomcatPort": this.id.dcPort,"ndeCtrlrName": "","pubicIP": this.id.dcIP,"publicPort": this.id.dcPort,"isCurrent": 1,"ndeTestRun":this.id.testRun,"ndeProtocol":location.protocol.replace(":","")}];
    //     return data;
    //   }

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

                if (this.ndeInfoData[i].ndeTestRun != undefined)
                    this.testRun = this.ndeInfoData[i].ndeTestRun;
                else
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
        this.limit = 50;
        this.offset = 0;
        this.getQueryData();
        this.getQueryDataCount();
    }

    getTierNamesForDC(dcName) {
        try {
            return new Promise <void>((resolve, reject) => {
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
                        this.tierName = tierList;
                }
                else {
                    if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
                        temp = (this.commonService.tierNameList).substring(dcName.length + 1);
                        tierList = temp;
                        tierList = tierList.substring(0, tierList.length);
                        if (tierList != "") {
                            this.tierName = tierList;
                            this.id.tierName = tierList;
                            this.commonService.fpFilters['tierName'] = tierList;
                        }
                    } else {
                        this.tierName = this.commonService.tierNameList;
                        this.id.tierName = this.commonService.tierNameList;
                        this.commonService.fpFilters['tierName'] = tierList;
                    }
                }
                console.log('tierName=====>', this.tierName);
                this.getTieridforTierName(this.tierName).then(() => { console.log("******then"); resolve() });
            });
        } catch (e) {
            console.log('exception in here==============', e);
        }
    }


    getNDEInfo(res) {
        // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'DB Queries')
        if (this.breadcrumb && this.breadcrumb[0].label == 'DB Queries')
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
            this.limit = 50;
            this.offset = 0;
            console.log("calling from dcMenu select case ", $event.value);
        }
        for (let i = 0; i < this.ndeInfoData.length; i++) {
            if (this.selectedDC == this.ndeInfoData[i].displayName) {

                this.ndeCurrentInfo = this.ndeInfoData[i];

                if (this.ndeInfoData[i].ndeProtocol != undefined)
                    this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
                else
                    this.dcProtocol = '//';

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
                break;
            }
        }
        this.getTierNamesForDC(this.selectedDC).then(() => {
            this.getQueryData();
            this.getQueryDataCount();
        })
    }


    setReportHeader() {
        if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
            this.strTitle = "Netstorm - DB Queries Report - Test Run : " + this.id.testRun;
        else
            this.strTitle = "Netdiagnostics Enterprise - DB Queries Report - Session : " + this.id.testRun;
    }
    deleteObjProp(json, arr) {
        json.forEach((val, index) => {
            arr.forEach((key, i) => {
                if (val.hasOwnProperty(key))
                    delete val[key];
            });
        });
    }
    downloadReport(type: string) {
        let downloadData = JSON.parse(JSON.stringify(this.queryInfo));
        let renameArray = { "tierName": "Tier", "serverName": "Server", "appName": "Instance", "sqlQuery": "Query", "count": "Query Count", "failedcount": "Error Count", "min": "Min Count", "max": "Max Count", "mincumsqlexectime": "Min(ms)", "maxcumsqlexectime": "Max(ms)", "avg": "Average(ms)" };
        let colOrder = ["Tier", "Server", "Instance", "Query", "Query Count", "Error Count", "Min Count", "Max Count", "Min(ms)", "Max(ms)", "Average(ms)"];
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
        downloadData.forEach((val, idx) => {
            delete val['tierId'];
            delete val['serverId'];
            delete val['appId'];
            delete val['urlName'];
            delete val['sqlIndex'];
            delete val['urlIndex'];
            delete val['cumsqlexectime'];
            delete val['sqlbegintimestamp'];
            delete val['sqlendtimestamp'];
            delete val['sqlquery'];
            delete val['id'];
            delete val['_$visited'];
        });
        //console.log("queryInfo for download ---" , this.queryInfo);
        let dataObj: Object = {
            downloadType: type,
            varFilterCriteria: this.downloadHeaderInfo,
            strSrcFileName: "DBQueries",
            strRptTitle: this.strTitle,
            renameArray: JSON.stringify(renameArray),
            colOrder: tempCols.toString(),
            jsonData: JSON.stringify(downloadData)
        }
        let downloadFileUrl = '';
        if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
                downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
            else
                downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        } else {
            downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
        }
        downloadFileUrl += "/v1/cavisson/netdiagnostics/ddr/downloadAngularReport";
        // if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
        if (this.sessionService.preSession.multiDc === true || (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/ALL"))) {
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (dataObj)).subscribe(res =>
                (this.showDownloadReport(res)));
        }
        else {
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(dataObj)).subscribe(res => (this.showDownloadReport(res)));
        }
    }




    showDownloadReport(res: any) {
        let url = '';
        if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
                url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
            else
                url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        }
        else {
            url = decodeURIComponent(this.getHostUrl(true));
        }

        url += "/common/" + res;
        window.open(url);
    }
    ngOnDestroy() {
        console.log("on destroy case--db report---");
        this.sideBarDbReport.unsubscribe();
    }

    waitQuery() {
        this.isCancelQuery = false;
        setTimeout(() => {
            this.openpopup();
        }, this._ddrData.guiCancelationTimeOut);
    }

    onCancelQuery() {
        let url = "";

        url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/", "")) + "/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun=" + this.id.testRun + "&queryId=" + this.queryId;
        console.log("Hello u got that", url);
        this.isCancelQuery = false;
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => { return data });
    }

    openpopup() {
        if (!this.isCancelQuerydata)
            this.isCancelQuery = true;
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

}
export interface QueryInterface {
    tierName: string;
    tierId: string;
    serverName: string;
    serverId: string;
    appName: string;
    appId: string;
    count: string;
    min: string;
    max: string;
    mincumsqlexectime: string;
    maxcumsqlexectime: string;
    avg: string;
    failedcount: string;
    sqlIndex: string;
    sqlQuery: string;
    urlName: string;
    urlIndex: string;
    id: number;
}
