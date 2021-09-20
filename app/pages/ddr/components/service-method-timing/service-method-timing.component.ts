import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'primeng/api';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { SelectItem } from '../../interfaces/selectitem';
// import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';


@Component({
    selector: 'service-method-timing',
    templateUrl: 'service-method-timing.component.html',
    styleUrls: ['service-method-timing.component.scss']
})
export class ServiceMethodTimingComponent implements OnInit {
    id: any;
    strTitle: any;
    data: Array<ServiceMethod>;
    loading: boolean = false;
    cols: any;
    filterCriteria: string = "";
    downloadFilterCriteria: string = "";
    showDownLoadReportIcon: boolean = true;
    headerInfo = '';
    queryParams: MethodTimingData;
    limit = 50;
    offset = 0;
    totalCount = 0;
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
    columnOptions: SelectItem[];
    visibleCols: any[];
    prevColumn;
    trStartTime: any;
    trEndTime: any;
    customFlag: boolean = false;
    screenHeight: any;
    Duration: any;
    startTimeinDF:any;
    msgs: Message[] = [];

    filterTierName = '';
    completeTier = '';
    showPagination: boolean = false;
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;
    breadcrumb: BreadcrumbService;

    ngOnInit(): void {
        this.loading = true;
        this.commonService.isToLoadSideBar = false;
        this.screenHeight = Number(this.commonService.screenHeight) - 120;
        // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SERVICE_METHOD_TIMING);
        this.breadcrumb.add({label: 'Service Method Timing', routerLink: '/ddr/servicemethodtiming'});
        try {
            this.id = this.commonService.getData();
            if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
                this.id.testRun = this.id.testRun;
            }
            //this.reportHeader= 'Service MethodTiming Report- '+this.id.testRun;
            this.queryParams = this.commonService.dataForServiceMethod;
            console.log('******************', this.queryParams);
            this.randomNumber();
            this.createDropDownMenu();
            this.setTestRunInHeader();  //use for download
            this.trStartTime = this.queryParams.strStartTime;
            this.trEndTime = this.queryParams.strEndTime;
            this.getServiceMethodTimingData();
            this.cols = [
                { field: 'JSPName', header: 'JSP Name', sortable: true, action: true },
                { field: 'cumSelfTime', header: 'Cumulative Self Time(Sec)', sortable: true, action: true },
                { field: 'avgSelfTime', header: 'Avg Self Time(Sec)', sortable: true, action: true },
                { field: 'cumCPUTime', header: 'Cumulative CPU Time(Sec)', sortable: true, action: true },
                { field: 'avgCPUTime', header: 'Avg CPU Time(Ms)', sortable: 'custom', action: true },
                { field: 'executionTime', header: 'Execution Count', sortable: true, action: true },
                { field: 'waitTime', header: 'WaitTime', sortable: true, action: false },
                { field: 'syncTime', header: 'SyncTime', sortable: true, action: false },
                { field: 'iotime', header: 'IOTime', sortable: true, action: false },
                { field: 'suspensiontime', header: 'SuspensionTime', sortable: true, action: false }
            ];
            this.visibleCols = ['JSPName', 'cumSelfTime', 'avgSelfTime', 'cumCPUTime', 'avgCPUTime', 'executionTime'];
            this.columnOptions = [];
            for (let i = 0; i < this.cols.length; i++) {
                this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
            }
            //   this.getTableData(this.res);
        } catch (error) {
            console.log('error in intialization of table column ', error);
        }
    }

    constructor( public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
        private _router: Router, private _cavConfigService: CavConfigService, private activatedRoute: ActivatedRoute, private _ddrData: DdrDataModelService,
        // private breadcrumbService: DdrBreadcrumbService,
        private ddrRequest:DDRRequestService, breadcrumb: BreadcrumbService) {
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

    setTestRunInHeader() {
        if (decodeURIComponent(this.id.ipWithProd).indexOf('netstorm') !== -1) {
            this.strTitle = 'Netstorm - Service Method Timing Report - Test Run : ' + this.id.testRun;
        } else {
            this.strTitle = 'Netdiagnostics Enterprise - Service Method Timing Report - Session : ' + this.id.testRun;
        }
    }

    /**Formatter cell data for converting ms to sec field */
    secFormatter(value) {
        if (!isNaN(value)){
         let a = Number(value / 1000).toFixed(3);
            return (Number(a).toLocaleString('en-IN'));
          }

        else
            return value;
    }

    /*Formatter to convert nanoseconds to seconds*/
    nanoFormatter(value) {
        if (!isNaN(value)){
         let a = Number(value / 1000000000).toFixed(3);
            return (Number(a).toLocaleString('en-IN'));
          }

        else
            return value;
    }

    /*Formatter to convert nanoseconds to milliseconds*/
    milliFormatter(value) {
        if (!isNaN(value)){
         let a = Number(value / 1000000).toFixed(3);
            return (Number(a).toLocaleString('en-IN'));
          }

        else
            return value;
    }

    /**Simple formater for tolocalstring */
    formatter(value) {
        if (!isNaN(value)) {
            return (Number(value).toLocaleString('en-IN'));

        }
        else
            return value;
    }

    //Time Filter


    createDropDownMenu() {
        this.standardTime = [];
        this.standardTime.push({ label: 'Last 10 minutes', value: { id: 1, name: 'Last 10 minutes', code: '10min' } });
        this.standardTime.push({ label: 'Last 30 minutes', value: { id: 2, name: 'Last 30 minutes', code: '30min' } });
        this.standardTime.push({ label: 'Last 1 hour', value: { id: 3, name: 'Last 1 hour', code: '1hr' } });
        this.standardTime.push({ label: 'Last 2 hours', value: { id: 4, name: 'Last 2 hours', code: '2hrs' } });
        this.standardTime.push({ label: 'Last 4 hours', value: { id: 5, name: 'Last 4 hours', code: '4hrs' } });
        this.standardTime.push({ label: 'Last 8 hours', value: { id: 6, name: 'Last 8 hours', code: '8hrs' } });
        this.standardTime.push({ label: 'Last 12 hours', value: { id: 7, name: 'Last 12 hours', code: '12hrs' } });
        this.standardTime.push({ label: 'Last 24 hours', value: { id: 8, name: 'Last 24 hours', code: '24hrs' } });
        this.standardTime.push({ label: 'Total Test Run', value: { id: 9, name: 'Total Test Run', code: 'TTS' } });
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
                    this.getServiceMethodTimingData();
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
                let restDrillDownUrl = this.id.restDrillDownUrl;
                this.ddrRequest.getDataUsingGet(restDrillDownUrl).subscribe(data => (this.setTimeFilter(data)));
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
    showDialog() {
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
            this.getServiceMethodTimingData();
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


    getServiceMethodTimingData() {
        try {
            let url = '';
           
            if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
                if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
                  url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
                else if (this.commonService.protocol)
                  url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
                else
                  url = "// " + this.commonService.host + ':' + this.commonService.port;
              }
            //   else if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL") {
            //     url =  this._ddrData.protocol+"://"+this.getHostUrl();
            //   } 
              else {
                url = this.getHostUrl();
              }
            let testRun;
            if (this.commonService.testRun) {
                testRun = this.commonService.testRun;
            }
            else
                testRun = this.id.testRun;

            if(this.commonService.enableQueryCaching == 1)
            url += '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/serviceMethodTiming?cacheId='+ testRun;
            else
            url += '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/serviceMethodTiming?';

         url += '&testRun=' + testRun +
                '&tierName=' + this.queryParams.tierName +
                '&serverName=' + this.queryParams.serverName +
                '&appName=' + this.queryParams.appName +
                '&tierId=' + this.queryParams.tierId + 
                '&serverId=' + this.queryParams.serverId + 
                '&appId=' + this.queryParams.appId + 
                '&methodId=' + this.queryParams.methodid +
                '&fpInstance=' + this.queryParams.fpInstance +
                '&urlIndex=' + this.queryParams.urlIndex +
                '&absStartTime=' + this.trStartTime +
                '&absEndtime=' + this.trEndTime +
                '&customFlag=' + this.customFlag +
                '&Duration=' + this.queryParams.Duration +
                '&startTimeinDF=' + this.queryParams.startTimeinDF +
                '&limit=' + this.limit +
                '&offset=' + this.offset +
                '&queryId='+this.queryId;
            console.log('url is ', url);
            setTimeout(() => {
                this.openpopup();
            }, this._ddrData.guiCancelationTimeOut);
            this.ddrRequest.getDataUsingGet(url).subscribe(
                data => {(this.doAssignValues(data))},
                error => {
                    this.loading = false;
                    if (error.hasOwnProperty('message')) {
                        this.commonService.showError(error.message);
                      }
                }           
            );
            this.customFlag = false;
        }
        catch (err) {
            console.error(err);
        }
    }
    doAssignValues(res: any) {
        try {
            this.isCancelQuerydata = true;
            if (res.hasOwnProperty('Status')) {
                this.commonService.showError(res.Status);
            }
            if (res === null || res === undefined) {
                return;
            }
            this.loading = false;
            setTimeout(() => {
                this.loader = false;
            }, 500);
            this.data = res.data;
            this.totalCount = res.totalCount;
    	    if(this.totalCount > 50){ //If data is less then 50 then no pagination .
		     this.showPagination =true;
	      } else{
		      this.showPagination =false;
		    }
            if (this.limit > this.totalCount) {
                this.limit = Number(this.totalCount);
            }
            if ((this.limit + this.offset) > this.totalCount) {
                this.limit = Number(this.totalCount) - Number(this.offset);
              }

            console.log('totalCount ===== ', this.totalCount);
            this.showFilterCriteria(res.strStartTime, res.strEndTime);
            if (this.data.length === 0) {
                this.showDownLoadReportIcon = false;
            }
        } catch (err) {
            console.error(err)
        }
    }
/**
 * 
 * @param error notification
 */
    showError(msg: any) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      }
      
    getHostUrl(isDownloadCase?): string {
       
        var hostDcName;
    if(this._ddrData.isFromtrxFlow){
      hostDcName =  "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.id.testRun=this._ddrData.testRunTr;
      this.commonService.testRun = this._ddrData.testRunTr
      //   return hostDCName;
    }
       else{
           hostDcName = this._ddrData.getHostUrl(isDownloadCase);
        if( !isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
        {
          //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
          this.id.testRun=this._ddrData.testRun;
          
          console.log("all case url==>",hostDcName,"all case test run==>",this.id.testRun);
        }
    //    else if (this._navService.getDCNameForScreen("serviceMethodTiming") === undefined)
    //         hostDcName = this._cavConfigService.getINSPrefix();
    //     else
    //         hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("serviceMethodTiming");

    //     if (hostDcName.length > 0) {
    //         sessionStorage.removeItem("hostDcName");
    //         sessionStorage.setItem("hostDcName", hostDcName);
    //     }
    //     else
    //         hostDcName = sessionStorage.getItem("hostDcName");
       }
        console.log('hostDcName =', hostDcName);
        return hostDcName;
    }

    paginate(event) {
        // event.first = Index of the first record  (used  as offset in query) 
        // event.rows = Number of rows to display in new page  (used as limit in query)
        // event.page = Index of the new page
        // event.pageCount = Total number of pages
        this.offset = parseInt(event.first);
        this.limit = parseInt(event.rows);
        if (this.limit > this.totalCount) {
            this.limit = Number(this.totalCount);
         } 
        this.getServiceMethodTimingData();
    }
    showFilterCriteria(startTime: any, endTime: any) {
        this.filterCriteria = "";
        this.downloadFilterCriteria = "";
        this.completeTier = "";
        this.filterTierName = "";
        if(sessionStorage.getItem("isMultiDCMode") == "true")
        {
          let dcName = this._cavConfigService.getActiveDC();
          if(dcName == "ALL")
            dcName = this._ddrData.dcName;
            this.filterTierName= 'DC=' + dcName + ', ';
	    if(this._ddrData.isFromtrxFlow && !this._ddrData.isFromAgg){
               this.filterTierName = 'DC='+ this._ddrData.dcNameTr + ', ';
             }


        }
        if (this.commonService.dataForServiceMethod) {
            if (this.commonService.dataForServiceMethod.tierName != 'NA' && this.commonService.dataForServiceMethod.tierName != undefined && this.commonService.dataForServiceMethod.tierName != null && this.commonService.dataForServiceMethod.tierName != '' && this.commonService.dataForServiceMethod.tierName != "undefined") {
                if (this.commonService.dataForServiceMethod.tierName.length > 32) {
                    this.filterTierName = 'Tier=' + this.commonService.dataForServiceMethod.tierName.substring(0, 32) + '...,';
                    this.completeTier = this.commonService.dataForServiceMethod.tierName;
                } else
                    this.filterTierName = 'Tier=' + this.commonService.dataForServiceMethod.tierName + ',';
            }

            if (this.commonService.dataForServiceMethod.serverName != 'NA' && this.commonService.dataForServiceMethod.serverName != undefined && this.commonService.dataForServiceMethod.serverName != 'undefined' && this.commonService.dataForServiceMethod.serverName != '' && this.commonService.dataForServiceMethod.serverName != null) {
                this.filterCriteria += ', Server=' + this.commonService.dataForServiceMethod.serverName;
                console.log("filtercriteria for server11111111",this.commonService.dataForServiceMethod.serverName);
            }
            if (this.commonService.dataForServiceMethod.appName != 'NA' && this.commonService.dataForServiceMethod.appName != undefined && this.commonService.dataForServiceMethod.appName != 'undefined' && this.commonService.dataForServiceMethod.appName != null && this.commonService.dataForServiceMethod.appName != '') {
                this.filterCriteria += ', Instance=' + this.commonService.dataForServiceMethod.appName;
                console.log("filtercriteria for instance111111",this.commonService.dataForServiceMethod.appName);
            }
            if (this.commonService.dataForServiceMethod.urlName != 'NA' && this.commonService.dataForServiceMethod.urlName != undefined && this.commonService.dataForServiceMethod.urlName != 'undefined' && this.commonService.dataForServiceMethod.urlName != null && this.commonService.dataForServiceMethod.urlName != '') {
                this.filterCriteria += ', BT=' + this.commonService.dataForServiceMethod.urlName;
                console.log("filtercriteria for urlName1111",this.commonService.dataForServiceMethod.urlName);
            }
        } else {

            if (this.id.tierName !== 'undefined' && this.id.tierName !== 'NA' && this.id.tierName !== '' && this.id.tierName !== undefined && this.id.tierName !== null) {
                if (this.id.tierName.length > 32) {
                    this.filterTierName += 'Tier=' + this.id.tierName.substring(0, 32) + '...,';
                    this.completeTier = this.id.tierName;
                }
                else
                this.filterTierName += 'Tier=' + this.id.tierName + ',';
            }

            if (this.id.serverName !== 'undefined' && this.id.serverName !== 'NA' && this.id.serverName !== '' && this.id.serverName !== undefined && this.id.serverName !== null) {
                this.filterCriteria += ', Server=' + this.id.serverName;
                console.log("filtercriteria for server1",this.id.serverName);
                
            }
            if (this.id.appName !== 'undefined' && this.id.appName !== 'NA' && this.id.appName !== '' && this.id.appName !== undefined && this.id.appName !== null) {
                this.filterCriteria += ', Instance=' + this.id.appName;
                console.log("filtercriteria for instance1",this.id.appName);
                
            }
        }
      //  if (this.id.urlName !== 'undefined' && this.id.urlName !== undefined && this.id.urlName !== 'NA' && this.id.urlName !== '' && this.id.urlName !== null) {
      //      this.filterCriteria += ', BT=' + this.id.urlName;
      //  }
        if (startTime !== 'NA' && startTime !== '' && startTime !== undefined && startTime !== "undefined") {
            this.filterCriteria += ', StartTime=' + startTime;
        }
        if (endTime !== 'NA' && endTime !== '' && endTime !== undefined && endTime !== "undefined") {
            this.filterCriteria += ', EndTime=' + endTime;
        }
        if (this.filterCriteria.startsWith(',')) {
            this.filterCriteria = this.filterCriteria.substring(1);
        }
        if (this.filterCriteria.endsWith(',')) {
            this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
        }

    }

    /**For download table data */
    downloadReports(reports: string) {

        let renameArray = { "JSPName": "JSP Name", "cumSelfTime": "Cumulative Self Time(Sec)", "avgSelfTime": "Avg Self Time(Sec)", "cumCPUTime": "Cumulative CPU Time(Sec)", "avgCPUTime": "Avg CPU Time(Ms)", "executionTime": "Execution Count", "waitTime": "WaitTime", "syncTime": "SyncTime", "iotime": "IOTime", "suspensiontime": "SuspensionTime" };
        let colOrder = ['JSP Name', 'Cumulative Self Time(Sec)', 'Avg Self Time(Sec)', 'Cumulative CPU Time(Sec)', 'Avg CPU Time(Ms)', 'Execution Count', 'WaitTime', 'SyncTime', 'IOTime', 'SuspensionTime'];
        this.data.forEach((val, index) => {
            delete val['BCIArgId'];
        });

        let downData = JSON.parse(JSON.stringify(this.data));
        for(let i=0;i<downData.length;i++)
        {
            downData[i].cumSelfTime = (downData[i].cumSelfTime/1000).toFixed(3);
            downData[i].avgSelfTime = (downData[i].avgSelfTime/1000).toFixed(3);
            downData[i].cumCPUTime = (downData[i].cumCPUTime/1000000000).toFixed(3);
            downData[i].avgCPUTime = (downData[i].avgCPUTime/1000000).toFixed(3);
        }
        let downloadObj: Object = {
            downloadType: reports,
            varFilterCriteria: this.downloadFilterCriteria,
            strSrcFileName: 'ServiceMethodTimingReport',
            strRptTitle: this.strTitle,
            renameArray: JSON.stringify(renameArray),
            colOrder: colOrder.toString(),
            jsonData: JSON.stringify(downData)
        };
        let downloadFileUrl = '';
        if (this.commonService.protocol && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if (this.commonService.protocol.endsWith("://"))
                downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
            else
                downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
        }
        else
            downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
        downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
        if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (
                this.openDownloadReports(res)
            ));
        }
        else
        this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
    }

    /**To open Download file from backend to browser */
    openDownloadReports(res) {
        console.log('file name generate ===', res);
        let downloadFileUrl = '';
        if (this.commonService.protocol !=undefined && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
            if(downloadFileUrl.indexOf("://")==-1)
            downloadFileUrl = this.commonService.protocol+"://" + this.commonService.host + ':' + this.commonService.port;
            } else {
            downloadFileUrl =  decodeURIComponent(this.getHostUrl(true));
        }
       
        downloadFileUrl += '/common/' + res;
        window.open(downloadFileUrl);
    }

    sortColumnsOnCustom(event, tempData) {

        if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                var value = parseFloat(a[temp]);
                var value2 = parseFloat(b[temp]);
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            var temp = (event["field"]);
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                var value = parseFloat(a[temp]);
                var value2 = parseFloat(b[temp]);
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }

        this.data = [];
        //console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.data = this.Immutablepush(this.data, rowdata) });
        }

    }
    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }

    randomNumber(){
        this.queryId = (Math.random() * 1000000).toFixed(0);
        console.log("this.queryId:::::::::::::"+this.queryId); 
    }

    waitQuery()
    {
      this.isCancelQuery = false;
      setTimeout(() => {
        this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);
    }
s
    
    onCancelQuery(){
        let url = "";
    
       url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.id.testRun +"&queryId="+this.queryId;  
      console.log("Hello u got that",url);
        this.isCancelQuery = false;
         this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
      }

      openpopup(){
        if(!this.isCancelQuerydata)
        this.isCancelQuery =true;
      }

}
export interface ServiceMethod {
    JSPName: string;
    BCIArgId: string;
    cumSelfTime: string;
    avgSelfTime: string;
    cumCPUTime: string;
    avgCPUTime: string;
    executionTime: string;
    waitTime: string;
    syncTime: string;
    iotime: string;
    suspensiontime: string;
    totalCount: string;
}
export interface MethodTimingData {
    methodid: string;
    tierName: string;
    serverName: string;
    appName: string;
	tierId :string ;
    serverId :string ;
    appId : string ;
    strStartTime: string;
    strEndTime: string;
    fpInstance: string;
    urlIndex: string;
    Duration:string;
    startTimeinDF:string;
}
