import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { CavConfigService } from "../../../../main/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../../main/services/cav-top-panel-navigation.service";
import { SelectItem } from '../../interfaces/selectitem';
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { GrowlModule, Message } from 'primeng/primeng';
import { MessageService } from '../../services/ddr-message.service';
import { DDRRequestService } from '../../services/ddr-request.service';


@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.css']
})
export class QueriesComponent implements OnInit {

  @Input() columnData;
  queryDetail: Object[] = [{
    "tierName": "", "tierId": "", "serverName": "", "serverId": "", "appName": "", "appId": "", "urlName": "", "count": "", "min": "", "max": "", "cumsqlexectime": "", "mincumsqlexectime": "", "maxcumsqlexectime": "", "avg": "", "failedcount": "", "sqlIndex": "", "sqlQuery": "", "urlIndex": "", "id": 0, "sqlbegintimestamp": "", "sqlendtimestamp": "", "sqlquery": ""
  }];
  queryInfo: Array<QueryInterface>;
  id: any;
  cols;
  filterInfo: string = "";
  tableHeader: string = "";
  loading: boolean = false;
  isDBCallByBT: boolean = false;
  //displayPopUp:boolean=false;
  //rowData:any[];
  queryCount: boolean = false;
  info: any;
  chartData: Object[];
  showChart: boolean = false;
  options: Object;
  restDataArrOfPie: any[];
  showAllOption: boolean = false;
  wholeData: any[];
  pointName: string;
  startTimeInMs: string;
  endTimeInMs: string;
  dataFromFPComponent: any;
  FPToDB: boolean;
  fromFP: boolean = false;
  showDownloadOption: boolean = true;
  strTitle: string;
  btName: string;
  queryName: string;
  avgRespTime: string;
  //barChartOptions:Object;
  //showBarChart:boolean=false;
  respTimeOptions: Object;
  showChartForRespTime: boolean = false;
  totalCount: any;
  limit = 50;
  offset = 0;
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
  loader: boolean = false;
  reportHeader: string;
  strCmdArgs: string = "";
  screenHeight: any;
  totalQueryCount: string;
  compurl: string;
  fpInstance: string;
  buisnessTransaction: string;
  substringUrl: string;
  visibleCols: any[];
  columnOptions: SelectItem[];
  prevColumn;
  customFlag: boolean = false;
  fpTodbFilter: any;
  filterCriteriaStr: string = "";
  isFilterFromSideBar: boolean = false;
  URLstr: string;
  CompleteURL: string;
  ajaxUrl: string = "";
  fullQueryName: string = '';
  topNQueries: string = '';
  msgs: Message[] = [];
  tierName = '';
  serverName = '';
  instanceName = '';
  completeTier = '';
  completeServer = '';
  completeInstance = '';

  //DC variables
  ndeCurrentInfo: any;
  ndeInfoData: any;
  protocol: string = '//';
  host = '';
  port = '';
  testRun: string;
  dcList: SelectItem[];
  selectedDC;
  showDCMenu = false;


  constructor(private commonService: CommonServices,
    private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private _ddrData: DdrDataModelService, private breadcrumbService: DdrBreadcrumbService, private _router: Router,private messageService: MessageService,
    private ddrRequest:DDRRequestService) {
  }

  ngOnChanges() {
    if (this.columnData != undefined) {
      this.loading = true;
      this.dataFromFPComponent = JSON.parse(JSON.stringify(this.columnData));
      this.commonService.setFPData = JSON.parse(JSON.stringify(this.columnData));
      this.id = JSON.parse(JSON.stringify(this.columnData));
      this.startTimeInMs = this.dataFromFPComponent.startTimeInMs;
      if (this.dataFromFPComponent.fpDuration.includes(','))
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(this.dataFromFPComponent.fpDuration.replace(',', ''))).toString();
      else
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(this.dataFromFPComponent.fpDuration)).toString();
      this.FPToDB = true;
      this.limit = 50;
      this.getQueryData();
    }
  }

  ngOnInit() {
    this.loading = true;
    if (this._ddrData.splitViewFlag == false)
      this.commonService.isToLoadSideBar = true;
    if (this.commonService.dbFilters["source"] != "FlowpathReport")
      this.commonService.currentReport = "DB Report";
    this.commonService.dbFilters["source"] = "NA";
    this.screenHeight = Number(this.commonService.screenHeight) - 100;
    if (this._ddrData.splitViewFlag == false)
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.DB_QUERIES);
    if (this._ddrData.splitViewFlag == false)
      this.id = this.commonService.getData();
    console.log('in ngOnInit', this.id);

    this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == "DB Report") {
        console.log('data coming from side bar to db report', temp)
        this.isFilterFromSideBar = true;
        this.limit = 50 ;
		this.fillData();
        this.getQueryData();
      }
    });

    if ((this._router.url.indexOf('?') != -1) && (this._router.url.indexOf('/home/ED-ddr/query') != -1)) {
      this.fpTodbFilter = false;
      let queryParams1 = location.href.substring(location.href.indexOf("?") + 1, location.href.length);
      this.id = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      sessionStorage.setItem("hostDcName", location.host);
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.id;
      this.commonService.dbDataFromFPInED = this.id
      this.commonService.dcNameList = this.id.dcNameList;
      this.commonService.isAllCase = this.id.isAll;
      this.commonService.tierNameList = this.id.tierNameList;
      this.commonService.ajaxTimeOut = this.id.ajaxTimeout;
      if (this.id.dcNameList != null && this.id.dcNameList != '' && this.id.dcNameList != undefined && this.id.dcNameList != 'undefined') {
        sessionStorage.setItem("dcNameList", this.id.dcNameList);
        sessionStorage.setItem("tierNameList", this.id.tierNameList)
        sessionStorage.setItem("isAllCase", this.id.isAll);
      }
    }
    console.log('This.id after ED_ddr', this.id);
    if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
      this.id.testRun = this.id.testRun;
    }

    
    if(this._router.url.indexOf('/home/ED-ddr/query') != -1 && this._ddrData.dbFlag ==  false && this.commonService.getFPData == '')
    {
      if(this.commonService.isFromBTTrend == true)
        this.id = this.commonService.getData();
      else
        this.id =  this.commonService.dbDataFromFPInED;
    }

    //this.reportHeader = 'DB Report- '+ this.id.testRun;
    /** get from storage in case of */
    if (this.commonService.getFPData == undefined || this._ddrData.dbFlag == undefined || this.commonService.getFPData == null ||
      this._ddrData.dbFlag == null || this.commonService.getFPData == 'undefined' || this.commonService.getFPData == "") {
      let data = sessionStorage.getItem("dbData");
      if (data != undefined && data != 'undefined' && data != "") {
        this.dataFromFPComponent = JSON.parse(data);
      }
      if (this.commonService.signatureToDB === true) {
        this.dataFromFPComponent = JSON.parse(data);
      }
      let value = sessionStorage.getItem("dbFlag");
      if (value == 'true') {
        this.FPToDB = true;
      }
      if (value == 'false') {
        this.FPToDB = false;
      }

    } else {
      if (this.commonService.signatureToDB === true) {
        this.dataFromFPComponent = this.commonService.getFPData;
        this.FPToDB = this._ddrData.dbFlag;
      } else {
        this.dataFromFPComponent = this.commonService.getFPData;
        this.FPToDB = this._ddrData.dbFlag;
        this.fpInstance = this.dataFromFPComponent.flowpathInstance;
        this.buisnessTransaction = this.dataFromFPComponent.urlName;
        this.compurl = this.dataFromFPComponent.urlQueryParamStr || this.dataFromFPComponent.urlQueryParmStr;
        if (this.compurl.length > 45) {
          this.substringUrl = this.compurl.substring(0, 45) + "...";
        }
        else {
          this.substringUrl = this.compurl;
        }
      }
    }
    if (this.FPToDB == true) {
      this.startTimeInMs = (this.dataFromFPComponent.startTimeInMs).toString();
      if (this.dataFromFPComponent.fpDuration.toString() == '< 1')
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(0)).toString();
      else if (this.dataFromFPComponent.fpDuration.toString().indexOf(',') != -1)
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(this.dataFromFPComponent.fpDuration.toString().replace(/,/g, ""))).toString();
      else
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(this.dataFromFPComponent.fpDuration)).toString();
    } else {
      /** set here for Direct opening DB Report  */
      console.log('Direct DB ', )
      this.commonService.setFPData = "";
      this._ddrData.dbFlag = false;
      this.setInStorage(this.commonService.getFPData);
      if (this.id.strStartTime == undefined && this.id.strEndTime == undefined) {
        this.startTimeInMs = this.id.startTime;
        this.endTimeInMs = this.id.endTime;
      } else {
        this.startTimeInMs = this.id.strStartTime;
        this.endTimeInMs = this.id.strEndTime;
      }
    }
    if (this.FPToDB == false && sessionStorage.getItem("dcNameList") != null && sessionStorage.getItem("dcNameList") != '' && sessionStorage.getItem("dcNameList") != undefined && sessionStorage.getItem("dcNameList") != 'undefined') {
      this.commonService.dcNameList = sessionStorage.getItem("dcNameList");
      this.commonService.tierNameList = sessionStorage.getItem("tierNameList");
      this.commonService.isAllCase = sessionStorage.getItem("isAllCase");
    }
    this.fillData();
  }

  setInStorage(data: any) {
    sessionStorage.removeItem("dbData");
    sessionStorage.removeItem("dbFlag");
    sessionStorage.setItem("dbData", JSON.stringify(data));
    sessionStorage.setItem("dbFlag", "false");
  }

  fillData() {
    let dbParam = this.commonService.dbFilters ;
   console.log("this.commonService.dbFilters in filldata function--",this.commonService.dbFilters ); 
   this.cols = [
    { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left', color: 'black', width: '70' } ]; 
  
  if(dbParam.serverName != 'NA' && dbParam.serverName != '-' ) 
  this.cols.push({ field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '70' });
      if(dbParam.appName != 'NA' && dbParam.appName != '-' ) 
   this.cols.push({ field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left', color: 'black', width: '100' });
   
this.cols.push(
    { field: 'sqlQuery', header: 'Query', sortable: true, action: true, align: 'left', color: 'black', width: '250' },
    { field: 'count', header: 'Query Count', sortable: 'true', action: true, align: 'right', color: 'blue', width: '70' },
    { field: 'failedcount', header: 'Error Count', sortable: true, action: true, align: 'right', color: 'blue', width: '70' },
    { field: 'min', header: 'Min Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '70' },
    { field: 'max', header: 'Max Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '70' },
    { field: 'mincumsqlexectime', header: 'Min(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '70' },
    { field: 'maxcumsqlexectime', header: 'Max(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '70' },
    { field: 'avg', header: 'Average(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '70' }
     );
    this.visibleCols = [
      'sqlQuery', 'count', 'failedcount', 'min', 'max', 'mincumsqlexectime', 'maxcumsqlexectime', 'avg'
    ];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
      this.getDCData();
    } else {
      if (this._ddrData.splitViewFlag == false)
        this.getQueryData();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      this.commonService.testRun = '';
      this.commonService.selectedDC = '';
    }
    this.setReportHeader();
    this.createDropDownMenu();
  }

  getDbFlowpathData(data) {
    this._ddrData.dbTofpflag = true;
    this.commonService.dbflowpathdata = data;
    this.commonService.dbflowpathdata['strStartTime'] = this.startTimeInMs;
    this.commonService.dbflowpathdata['strEndTime'] = this.endTimeInMs;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.DB_QUERIES;
    if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
      this._router.navigate(['/home/ddrCopyLink/flowpath']);
    } else if (this._router.url.indexOf('/home/ED-ddr') != -1) {
      this._router.navigate(['/home/ED-ddr/flowpath']);
    } else {
      this._router.navigate(['/home/ddr/flowpath']);
    }
  }

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
  }

  onEndDate(event) {
    let date = new Date(event);
    this.endTime = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();;
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
        this.customFlag = true;
        if (this.strDate > this.endDate)
          this.msg = "Start time cannot be greater than end time";
        else {
          this.startTimeInMs = this.strTime;
          this.endTimeInMs = this.endTime;
          this.display = false;
          this.loader = true;
          this.getProgressBar();
          this.getQueryData();
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
          timeFilterUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        } else {
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
    if (this.FPToDB == true) {
      this.startTimeInMs = this.dataFromFPComponent.startTime;

      if (this.dataFromFPComponent.fpDuration.toString() == '< 1')
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(0)).toString();
      else if (this.dataFromFPComponent.fpDuration.toString().includes(','))
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(this.dataFromFPComponent.fpDuration.toString().replace(/,/g, ""))).toString();
      else
        this.endTimeInMs = (Number(this.dataFromFPComponent.startTimeInMs) + Number(this.dataFromFPComponent.fpDuration)).toString();
    }
    else {
      this.startTimeInMs = res.ddrStartTime;
      this.endTimeInMs = res.ddrEndTime;
    }
    this.getStandardTime();
  }
  getStandardTime() {
    if (this.startTimeInMs != "" || this.startTimeInMs != undefined) {
      let time;
      if (this.selectedTime.name == "Last 10 minutes") {
        time = 600000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 30 minutes") {
        time = 1800000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 1 hour") {
        time = 3600000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 2 hours") {
        time = 7200000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 4 hours") {
        time = 14400000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 8 hours") {
        time = 28800000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 12 hours") {
        time = 43200000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Last 24 hours") {
        time = 86400000;
        this.startTimeInMs = (Number(this.endTimeInMs) - time).toString();
      }
      else if (this.selectedTime.name == "Total Test Run") {
        this.startTimeInMs = "";
        this.endTimeInMs = "";
      }
      this.loader = true;
      this.getProgressBar();
      this.getQueryData();
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

  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName = this._ddrData.getHostUrl();
    // if (this._navService.getDCNameForScreen("dbQuery") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("dbQuery");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  setReportHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
      this.strTitle = "Netstorm - DB Queries Report - Test Run : " + this.id.testRun;
    else
      this.strTitle = "Netdiagnostics Enterprise - DB Queries Report - Session : " + this.id.testRun;
  }

  getQueryData() {
    var url = "";
    let urlParam = "";
    let pagination = "&limit=" + this.limit + "&offset=" + this.offset;
    let flag = "&showCount=false&customFlag=" + this.customFlag;
    let report = "";
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = this.getHostUrl();
    }

    let dbParam = this.commonService.dbFilters;
    if (this.isFilterFromSideBar || dbParam['fromDBCallByBT'] == 'true') {
      this.isDBCallByBT = false;
      this.topNQueries = dbParam.topNQueries;
     if(dbParam['fromDBCallByBT'] == 'true')  
      this.queryCount = true;
  
      urlParam = this.commonService.makeParamStringFromObj(dbParam);

      url += '/' + this.id.product;
      if (this.commonService.isValidParamInObj(dbParam, "flowpathInstance"))
        url += "/v1/cavisson/netdiagnostics/ddr/dbRequestEx?";
      else {
        // this.isDBCallByBT = true;
        this.isDBCallByBT = false;
        this.fromFP = false ;
        this.FPToDB = false ;
        url += "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?";
      }

    }
    else if (this.FPToDB == true) {
      report = "&report=dbRequest";
      this.fromFP = true;
      this.fpTodbFilter = this._ddrData.dbFlag;

      url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/dbRequestEx?";
      urlParam = "testRun=" + this.id.testRun + "&object=6" + "&urlIdx=" + this.dataFromFPComponent.urlIndex + "&tierId=" + this.dataFromFPComponent.tierId +
        "&serverId=" + this.dataFromFPComponent.serverId + "&appId=" + this.dataFromFPComponent.appId + "&flowpathInstance=" + this.dataFromFPComponent.flowpathInstance +
        "&strStartTime=" + this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&statusCode=-2";

      let urlPramObj = this.commonService.makeObjectFromUrlParam(urlParam + report);
      this.commonService.dbFilters = urlPramObj;
      this.commonService.isCheckedFlowpath = true;
      this.commonService.flowpathInstance = this.commonService.dbFilters['flowpathInstance'];
    } else if (this.id.flagScreenEight === '1') {
      let dbParamEx = this.id;
      this.makeFilterCriteriaStr(dbParamEx);
      // urlParam = this.commonService.makeParamStringFromObj(dbParamEx);
      url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/dbRequestEx?";
      urlParam = 'cmdArgs=' + ' --testrun ' + this.id.testRun + ' --object ' + this.id.objectType + ' --status -2' + ' --fpinstance ' +
        this.id.flowPathInstance + ' --group query' + '&testRun=' + this.id.testRun;
    } else {
      report = "&report=dbQuery";
      this.fromFP = false;
      this.fpTodbFilter = false;
      if (this.queryCount == true) {
        url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?";
        urlParam = "testRun=" + this.id.testRun + "&object=6" + "&urlIdx=" + this.info.urlIndex + "&tierId=" + this.info.tierId +
          "&serverId=" + this.info.serverId + "&appId=" + this.info.appId + "&statusCode=" + this.id.statusCode +
          "&strStartTime=" + this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&templateName=CustomDB" + "&urlName=" + this.id.urlName;
      } else {
        url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?";
        urlParam = "testRun=" + this.id.testRun;
        if (this.commonService.signatureToDB === true) {
          urlParam += '&flowpathSignature=' + this.dataFromFPComponent.flowpathSignature;
        }
        urlParam += "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName +
          "&tierId=" + this.id.tierid + "&serverId=" + this.id.serverid + "&appId=" + this.id.appid + "&strStartTime=" +
          this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&statusCode=-2" + "&strGroup=" + this.id.strGroup +
          "&strOrderBy=" + this.id.strOrderBy + "&object=6" + "&urlIndex=" + this.id.urlIndex + "&btcategoryId=" + this.id.btCategory + 
          "&urlName=" + this.id.urlName;
      }

      let urlPramObj = this.commonService.makeObjectFromUrlParam(urlParam + report);
      this.commonService.dbFilters = urlPramObj;
	  
	    setTimeout(() => {
        this.messageService.sendMessage(this.commonService.dbFilters);
      }, 2000);
    }

    this.ajaxUrl = url + urlParam; //using it as count query parameter
    url += urlParam + pagination + flag;
    console.log('Ajax Url------', url, '***', this.ajaxUrl);
    return this.ddrRequest.getDataUsingGet(url).timeout(this.commonService.ajaxTimeOut).subscribe(
      data => {this.doAssignValues(data)},
      error => {
        this.loading = false;
        this.loader = false;
        if(error.hasOwnProperty('message')){
         this.showError('Query taking more time than ' + this.commonService.ajaxTimeOut + ' ms to give response');
        }
        else{
         if(error.hasOwnProperty('statusText')){
          this.showError(error.statusText);
          console.error(error);
         }
        }
     }
    );
  }

  doAssignValues(res: any) {
    this.loading = false;
    this.loader = false;
    if (res.hasOwnProperty('Status')) {
      this.showError(res.Status);
    }
    this.queryDetail = res.data;
    //this.totalCount =  res.totalCount;
    this.totalQueryCount = "DB Stats [ Total Query Count: " + res.queryCount + "]";
    this.getQueryDataCount();
    if (this.queryDetail.length === 0) {
      this.showDownloadOption = false;
      this.loading = false;
      this.fullQueryName = 'No Query is present.';
    }
    else
      this.showDownloadOption = true;

    this.commonService.dbFilters['startTimeInDateFormat'] = res.startTime;
    this.commonService.dbFilters['endTimeInDateFormat'] = res.endTime;


    if (this.isFilterFromSideBar || this.commonService.dbFilters['fromDBCallByBT'] == 'true') {
      this.makeFilterCriteriaStr(this.commonService.dbFilters);
    }
    else
      this.showFilterCriteria(res.startTime, res.endTime);

    this.showTableHeader();
    this.queryInfo = this.getQueryInfo();
    this.createPieChart(res);
    //this.createBarChart(res);
  }


  getDCData() {
    let url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.id.testRun;
    //this.http.get(url).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(data => {
      if (this.commonService.dcNameList.indexOf(',') != -1) {
        this.getNDEInfo(data)
      } else {
        this.singleDCCase(data);
      }
    });
  }

  singleDCCase(res) {
    this.ndeInfoData = res;
    this.selectedDC = this.commonService.dcNameList;
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.commonService.dcNameList == this.ndeInfoData[i].displayName) {

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.protocol = '//';

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
        break;
      }
    }
    this.getQueryData();
  }


  getTierNamesForDC(dcName) {
    try {
      return new Promise((resolve, reject) => {
        var tierList = "";
        var allTierDClistArr = this.commonService.tierNameList.split(",");

        for (var i = 0; i < allTierDClistArr.length; i++) {
          if (allTierDClistArr[i].startsWith(dcName)) {
            // var temp = allTierDClistArr[i].split(".")
            var temp = (allTierDClistArr[i]).substring(dcName.length + 1);
            //tierList += temp[1]+ ",";
            tierList += temp + ",";
          }
        }
        tierList = tierList.substring(0, tierList.length - 1);
        if (tierList != "") {
          //  this.tierName = tierList;
          this.id.tierName = tierList;
          this.commonService.fpFilters['tierName'] = tierList;
        }
        this.getTieridforTierName(this.id.tierName).then(() => resolve());
      }
      );
    } catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getNDEInfo(res) {
    this.showDCMenu = true;
    this.ndeInfoData = res;
    this.dcList = [];
    let dcName = this.commonService.dcNameList.split(',');
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      this.dcList.push({ label: dcName[i], value: dcName[i] });
      if (this.commonService.selectedDC == undefined) {
        if (this.ndeInfoData[i].isCurrent == 1)
          this.selectedDC = this.ndeInfoData[i].displayName;
      } else {
        this.selectedDC = this.commonService.selectedDC;
      }

      if (this.selectedDC == this.ndeInfoData[i].displayName) {
        this.ndeCurrentInfo = this.ndeInfoData[i];
      }
    }
    this.getSelectedDC();
  }

  getTieridforTierName(tierName) {
    return new Promise((resolve, reject) => {
      try {
        var url = '';
        if (this.ndeCurrentInfo != undefined && this.ndeCurrentInfo != null && this.ndeCurrentInfo != '') {
          if (this.ndeCurrentInfo.protocol != undefined && this.ndeCurrentInfo.protocol != null && this.ndeCurrentInfo.protocol != '')
            url = this.ndeCurrentInfo.protocol + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          else
            url = '//' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
        }
        else {
          url = this.getHostUrl();
        }
        url += '/' + this.id.product + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.id.testRun + "&tierName=" + tierName;
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
  getSelectedDC() {
    this.getTierNamesForDC(this.selectedDC).then(() => {

      for (let i = 0; i < this.ndeInfoData.length; i++) {
        if (this.selectedDC == this.ndeInfoData[i].displayName) {

          if (this.ndeInfoData[i].ndeProtocol != undefined)
            this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
          else
            this.protocol = '//';

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
          this.commonService.selectedDC = this.selectedDC;
          break;
        }
      }
      this.getQueryData();
    })
  }


  /**
 * 
 * @param error notification
 */
  showError(msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }
  

  getQueryInfo() : Array<QueryInterface>{
    var queryArr = [];
    if (this.queryDetail.length > 0) {
      if (this.queryDetail[0]["serverName"] == "-" && this.queryDetail[0]["appName"] == "-") {
        this.cols = [
          { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left', color: 'black', width: '75' },
          { field: 'sqlQuery', header: 'Query', sortable: true, action: true, align: 'left', color: 'black', width: '290' },
          { field: 'count', header: 'Query Count', sortable: 'true', action: true, align: 'right', color: 'blue', width: '65' },
          { field: 'failedcount', header: 'Error Count', sortable: true, action: true, align: 'right', color: 'blue', width: '65' },
          { field: 'min', header: 'Min Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '65' },
          { field: 'max', header: 'Max Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '65' },
          { field: 'mincumsqlexectime', header: 'Min(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '65' },
          { field: 'maxcumsqlexectime', header: 'Max(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '65' },
          { field: 'avg', header: 'Average(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '65' }
        ];

        this.visibleCols = [
          'sqlQuery', 'count', 'failedcount', 'min', 'max', 'mincumsqlexectime', 'maxcumsqlexectime', 'avg'
        ];

        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
          this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
        }
      }
      for (var i = 0; i < this.queryDetail.length; i++) {
        if (this.queryDetail[i]['sqlQuery'] != undefined)
          this.queryDetail[i]['sqlQuery'] = this.queryDetail[i]['sqlQuery'].replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
        else
          this.queryDetail[i]['sqlquery'] = this.queryDetail[i]['sqlquery'].replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
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
      this.showChart = false;
      this.showChartForRespTime = false;
      //this.showBarChart = false;
      return queryArr;
    }
  }

  showFilterCriteria(startTime: any, endTime: any) {
    if (this.filterCriteriaStr != "") {
      this.filterInfo = this.filterCriteriaStr;
    } else if (this.FPToDB == true) {
      if (this.dataFromFPComponent.tierName != "NA" && this.dataFromFPComponent.tierName != "" && this.dataFromFPComponent.tierName != undefined && this.dataFromFPComponent.tierName != "undefined")
        this.filterInfo = "Tier=" + this.dataFromFPComponent.tierName;
      if (this.dataFromFPComponent.serverName != "NA" && this.dataFromFPComponent.serverName != "" && this.dataFromFPComponent.serverName != undefined && this.dataFromFPComponent.serverName != "undefined")
        this.filterInfo += ", Server=" + this.dataFromFPComponent.serverName;
      if (this.dataFromFPComponent.appName != "NA" && this.dataFromFPComponent.appName != "" && this.dataFromFPComponent.appName != undefined && this.dataFromFPComponent.appName != "undefined")
        this.filterInfo += ", Instance=" + this.dataFromFPComponent.appName;
      if (startTime != "NA" && startTime != "" && startTime != undefined && startTime != "undefined")
        this.filterInfo += ", From=" + startTime;
      if (endTime != "NA" && endTime != "" && endTime != undefined && endTime != "undefined")
        this.filterInfo += ", To=" + endTime;
      if (this.dataFromFPComponent.btCatagory != "NA" && this.dataFromFPComponent.btCatagory != "" && this.dataFromFPComponent.btCatagory != undefined && this.dataFromFPComponent.btCatagory != "undefined")
        this.filterInfo += ', BT Type=' + this.dataFromFPComponent.btCatagory;

      if (this.dataFromFPComponent.urlName != "NA" && this.dataFromFPComponent.urlName != "" && this.dataFromFPComponent.urlName != undefined && this.dataFromFPComponent.urlName != "undefined")
        this.filterInfo += ', BT=' + decodeURIComponent(this.dataFromFPComponent.urlName);
    }
    else {
      if (this.id.tierName != "NA" && this.id.tierName != "" && this.id.tierName != undefined && this.id.tierName != "undefined")
        this.filterInfo = "Tier=" + this.id.tierName;
      if (this.id.serverName != "NA" && this.id.serverName != "" && this.id.serverName != undefined && this.id.serverName != "undefined")
        this.filterInfo += ", Server=" + this.id.serverName;
      if (this.id.appName != "NA" && this.id.appName != "" && this.id.appName != undefined && this.id.appName != "undefined")
        this.filterInfo += ", Instance=" + this.id.appName;
      if (startTime != "NA" && startTime != "" && startTime != undefined && startTime != "undefined")
        this.filterInfo += ", From=" + startTime;
      if (endTime != "NA" && endTime != "" && endTime != undefined && endTime != "undefined")
        this.filterInfo += ", To=" + endTime;


      if (this.queryCount == true) {
        if (this.info.urlName != "-" && this.info.urlName != "" && this.info.urlName != "NA" && this.info.urlName != undefined && this.info.urlName != "undefined")
          this.filterInfo += ", BT=" + decodeURIComponent(this.info.urlName);
      }
      else {
        if (this.id.urlName != "NA" && this.id.urlName != "" && this.id.urlName != undefined && this.id.urlName != "undefined")
          this.filterInfo += ", BT=" + decodeURIComponent(this.id.urlName);
        if (this.id.strGroup != "NA" && this.id.strGroup != "" && this.id.strGroup != undefined && this.id.strGroup != "undefined")
          this.filterInfo += ", Group By=" + this.id.strGroup;
        if (this.id.strOrderBy != "NA" && this.id.strOrderBy != "" && this.id.strOrderBy != undefined && this.id.strOrderBy != "undefined")
          this.filterInfo += ", Order By=" + this.id.strOrderBy;
      }
    }

  }

  showTableHeader() {
    if (this.FPToDB == true) {
      this.tableHeader = "FlowPath DB Request";
      this.fromFP = true;
      this.cols = [
        { field: 'sqlquery', header: 'Query', sortable: true, action: true, align: 'left', color: 'black', width: '280' },
        { field: 'sqlbegintimestamp', header: 'First Query Time', sortable: true, action: true, align: 'right', color: 'black', width: '85' },
        { field: 'sqlendtimestamp', header: 'Last Query Time', sortable: true, action: true, align: 'right', color: 'black', width: '85' },
        { field: 'count', header: 'Query Count', sortable: true, action: true, align: 'right', color: 'black', width: '70' },
        { field: 'failedcount', header: 'Error Count', sortable: true, action: true, align: 'right', color: 'blue', width: '70' },
        { field: 'min', header: 'Min Count', sortable: true, action: true, align: 'right', color: 'black', width: '65' },
        { field: 'max', header: 'Max Count', sortable: true, action: true, align: 'right', color: 'black', width: '65' },
        { field: 'mincumsqlexectime', header: 'Min(ms)', sortable: true, action: false, align: 'right', color: 'black', width: '70' },
        { field: 'maxcumsqlexectime', header: 'Max(ms)', sortable: true, action: false, align: 'right', color: 'black', width: '70' },
        { field: 'avg', header: 'Average(ms)', sortable: true, action: true, align: 'right', color: 'black', width: '70' },
        { field: 'cumsqlexectime', header: 'Execution Time(ms)', sortable: true, action: true, align: 'right', color: 'black', width: '100' }
      ];
      this.visibleCols = [
        'sqlquery', 'sqlbegintimestamp', 'sqlendtimestamp', 'count', 'failedcount', 'min', 'max', 'avg', 'cumsqlexectime'
      ];

      this.columnOptions = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
    }
    else {
      this.fromFP = false;
      if (this.queryCount == true) {
        this.tableHeader = "DB Request By Url";
        this.isDBCallByBT = false;
      }
      else {
        if (this.id.dbReportCategory == "Adv Slow DB Calls By Response Time")
          this.tableHeader = "Slow DB Calls By Response Time";
        else if (this.id.dbReportCategory == "Adv Top DB Calls By Count")
          this.tableHeader = "Top DB Calls By Count";
        else if (this.id.dbReportCategory == "Adv DB Calls By BT") {
          this.isDBCallByBT = true;
          this.tableHeader = "DB Calls By BT";
        }
        else if (this.id.dbReportCategory == "Adv Top DB Queries By ErrorCount")
          this.tableHeader = "Top DB Queries By Error Count";
        else if (this.id.dbReportCategory == "DB Request Report")
          this.tableHeader = "DB Request Report";
        else if (this.id.dbReportCategory == "DB Request Group By Business Transaction") {
          this.isDBCallByBT = true;
          this.tableHeader = "DB Request Group By Business Transaction";
        }
       else if(this.commonService.isFromBTTrend)
          {
            //console.log(" DB Request group by BT ");
            this.tableHeader = "DB Request Report";
          }
      }
    }
  }

  openErrorCount(rowData: any) {
    if (rowData !== undefined) {
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.DB_QUERIES;
      this.commonService.fromDBtoExpFlag = true;
      this.commonService.fromDBtoExpData = rowData;
      if(this.columnData != undefined && this.columnData != 'undefined'){
      this.commonService.fromDBtoExpData['tierName'] = this.columnData.tierName;
      this.commonService.fromDBtoExpData['serverName'] = this.columnData.serverName;
      this.commonService.fromDBtoExpData['appName'] = this.columnData.appName;
      }
      else{
        this.commonService.fromDBtoExpData['tierName'] = this.id.tierName;
        this.commonService.fromDBtoExpData['serverName'] = this.id.serverName;
        this.commonService.fromDBtoExpData['appName'] = this.id.appName;
      }
      this._ddrData.splitViewFlag = false;
      this._ddrData.flowpathToExFlag =false;
      if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
        this._router.navigate(['/home/ddrCopyLink/exception']);
      } else if (this._router.url.indexOf('/home/ED-ddr') != -1) {
        this._router.navigate(['/home/ED-ddr/exception']);
      } else {
        this._router.navigate(['/home/ddr/exception']);
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
    /*var arr =[];
    this.displayPopUp = true;
    var query;
    if(nodeInfo.sqlQuery == undefined)
      query = nodeInfo.sqlquery;
    else
      query = nodeInfo.sqlQuery;

    arr.push({"tierName":nodeInfo.tierName,"serverName":nodeInfo.serverName,"appName":nodeInfo.appName,"min":nodeInfo.min,"max":nodeInfo.max,"avg":nodeInfo.avg,"count":nodeInfo.count,"failedcount":nodeInfo.failedcount,"mincumsqlexectime":nodeInfo.mincumsqlexectime,"maxcumsqlexectime":nodeInfo.maxcumsqlexectime,"sqlQuery":query,"sqlbegintimestamp":nodeInfo.sqlbegintimestamp,"sqlendtimestamp":nodeInfo.sqlendtimestamp});
    this.rowData = arr;*/
  }

  openQueryCount(nodeQueryInfo: any) {
    this.queryCount = true;
    this.info = nodeQueryInfo;
    this.getQueryData();
    this.loading = true;
  }

  clickBack() {
    let dbParam = this.commonService.dbFilters;
    dbParam["urlIdx"] = "NA";
    dbParam["strGroup"] = "url";

    this.queryCount = false;
    this.loading = true;
    this.getQueryData();
  }

  /* createBarChart(barData:any) {
     let dataArr=[];
     this.chartData = barData.data;
 
     if (this.chartData.length == 0) {
       this.showBarChart = false;
     } else {
       this.showBarChart = true;
     }
 
     for(let i=0; i< this.chartData.length; i++) {
        this.avgRespTime = this.chartData[i]["avg"];
        dataArr.push(this.avgRespTime);
     }
 
     this.barChartOptions = {
       chart :{
         type : 'column'
       },
       credits: {
         enabled :false
       },
       title :{
         text : 'DB By Response Time',
         style:{'fontSize':'13px'}
       },
       xAxis : {
         labels: { enabled: false }
       },
       yAxis : {
         min : 0,
         title : {
           text : 'Average Response Time'
         }
       },
       tooltip: {
         headerFormat : '',
         pointFormat : '{series.name}: <b>{point.y}</b>',
       },
       plotOptions : {
         column : {
           pointWidth: 10
         }
       },
       series : [{
         name : 'Resp Time',
         enableMouseTracking: true,
         data : dataArr
       }]
     }
   }*/

  createPieChart(pieData: any) {
    //console.log(' create pie chart method called  with this.topNQueries = ' , this.topNQueries );
    if (this.topNQueries == '' || this.topNQueries == undefined)
      this.topNQueries = '5';
    var pieText;
    var pieText2;
    let count;
    //var avgRespTime;
    //var btName;
    let dataArr = [];
    let dataArrForRespTime = [];
    let restDataArr = [];
    this.chartData = pieData.data;
    this.wholeData = this.chartData;

    if (this.chartData.length == 0) {
      this.showChart = false;
      this.showChartForRespTime = false;
    }
    else {
      this.showChart = true;
      this.showChartForRespTime = true;
    }

    for (var i = 0; i < this.chartData.length; i++) {
      if (i < Number(this.topNQueries)) {
        if (this.FPToDB == true) {
          pieText = "Top " + this.topNQueries + " DB Queries By Count";
          pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
          this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
          this.avgRespTime = this.chartData[i]["avg"];
          count = this.chartData[i]["count"];
          dataArr.push({ "name": this.queryName, "y": Number(count) });
          dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
        } else {
          if (this.queryCount == true) {
            pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
            pieText = "Top " + this.topNQueries + " DB Queries By Count";
            this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
            this.avgRespTime = this.chartData[i]["avg"];
            count = this.chartData[i]["count"];
            dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
            dataArr.push({ "name": this.queryName, "y": Number(count) });
          } else if (this.commonService.signatureToDB === true) {
            pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
            pieText = "Top " + this.topNQueries + " DB Queries By Count";
            this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
            this.avgRespTime = this.chartData[i]["avg"];
            dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
            dataArr.push({ "name": this.queryName, "y": Number(count) });
          } else {
            if (this.id.dbReportCategory == "Adv Slow DB Calls By Response Time") {
              pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
              pieText = "Top " + this.topNQueries + " DB Queries By Count";
              this.avgRespTime = this.chartData[i]["avg"];
              this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
              count = this.chartData[i]["count"];
              dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
              dataArr.push({ "name": this.queryName, "y": Number(count) });
            }
            else if (this.id.dbReportCategory == "Adv Top DB Calls By Count" || this.id.dbReportCategory == "DB Request Report") {
              pieText = "Top " + this.topNQueries + " DB Queries By Count";
              pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
              this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
              count = this.chartData[i]["count"];
              this.avgRespTime = this.chartData[i]["avg"];
              dataArr.push({ "name": this.queryName, "y": Number(count) });
              dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
            }
            else if (this.id.dbReportCategory == "Adv DB Calls By BT" || this.id.dbReportCategory == "DB Request Group By Business Transaction") {
              pieText = "Top " + this.topNQueries + " DB Queries By BT Count ";
              pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
              this.btName = this.chartData[i]["urlName"];
              count = this.chartData[i]["count"];
              this.avgRespTime = this.chartData[i]["avg"];
              dataArr.push({ "name": this.btName, "y": Number(count) });
              dataArrForRespTime.push({ "name": this.btName, "y": Number(this.avgRespTime) });
            }
            else if (this.id.dbReportCategory == "Adv Top DB Queries By ErrorCount") {
              pieText = "Top " + this.topNQueries + " DB Queries By Error Count";
              pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
              count = this.chartData[i]["failedcount"];
              this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
              this.avgRespTime = this.chartData[i]["avg"];
              dataArr.push({ "name": this.queryName, "y": Number(count) });
              dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
            }
            else {
              pieText = "Top " + this.topNQueries + " DB Queries By Count";
              pieText2 = "Top " + this.topNQueries + " DB Queries By Response Time";
              this.queryName = this.chartData[i]["sqlquery"] || this.chartData[i]["sqlQuery"];
              this.avgRespTime = this.chartData[i]["avg"];
              count = this.chartData[i]["count"];
              dataArr.push({ "name": this.queryName, "y": Number(count) });
              dataArrForRespTime.push({ "name": this.queryName, "y": Number(this.avgRespTime) });
            }
          }
        }
      }
      else {
        restDataArr.push(this.chartData[i]);
      }
    }

    if (this.chartData.length > Number(this.topNQueries)) {
      let totalRespTime = 0;
      let totalQueryCount = 0;
      let totalErrorCount = 0;
      this.queryName = "Other";
      this.btName = "Other";

      for (let j = 0; j < restDataArr.length; j++) {
        totalRespTime += Number(restDataArr[j]["avg"]);
        totalQueryCount += Number(restDataArr[j]["count"]);
        totalErrorCount += Number(restDataArr[j]["failedcount"]);
      }

      if (this.FPToDB == true) {
        dataArr.push({ "name": this.queryName, "y": totalQueryCount });
        dataArrForRespTime.push({ "name": this.queryName, "y": totalRespTime });
      }
      else {
        if (this.queryCount == true || this.commonService.signatureToDB === true) {
          dataArrForRespTime.push({ "name": this.queryName, "y": totalRespTime });
          dataArr.push({ "name": this.queryName, "y": totalQueryCount })
        }
        else {
          if (this.id.dbReportCategory == "Adv Slow DB Calls By Response Time") {
            dataArrForRespTime.push({ "name": this.queryName, "y": totalRespTime });
            dataArr.push({ "name": this.queryName, "y": totalQueryCount });
          }
          else if (this.id.dbReportCategory == "Adv Top DB Calls By Count" || this.id.dbReportCategory == "DB Request Report") {
            dataArr.push({ "name": this.queryName, "y": totalQueryCount });
            dataArrForRespTime.push({ "name": this.queryName, "y": totalRespTime });
          }
          else if (this.id.dbReportCategory == "Adv DB Calls By BT" || this.id.dbReportCategory == "DB Request Group By Business Transaction") {
            dataArr.push({ "name": this.btName, "y": totalQueryCount });
            dataArrForRespTime.push({ "name": this.btName, "y": totalRespTime });
          }
          else if (this.id.dbReportCategory == "Adv Top DB Queries By ErrorCount") {
            dataArr.push({ "name": this.queryName, "y": totalErrorCount });
            dataArrForRespTime.push({ "name": this.queryName, "y": totalRespTime });
          }
          else {
            dataArr.push({ "name": this.queryName, "y": totalQueryCount });
            dataArrForRespTime.push({ "name": this.queryName, "y": totalRespTime });
          }
        }
      }
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
        text: pieText,
        style: { 'fontSize': '13px' }
      },
      legend: {
        itemWidth: 400
      },
      tooltip: {
        //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, Count: <b> {point.y}</b>',
        style: { fontSize: '7pt' },
        formatter: function () {
          let tooltip = "";
          let pointName = this.point.name;
          if (pointName.length > 60)
            tooltip += pointName.substring(0, 60) + "...";
          else
            tooltip += pointName;
          tooltip += " Percentage: " + "<b>" + this.point.percentage.toFixed(2) + "%" + "</b>" + ", Count: " + "<b>" + this.point.y + "</b>";
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

    this.respTimeOptions = {
      chart: {
        type: "pie"
      },
      credits: {
        enabled: false
      },
      title: {
        text: pieText2,
        style: { 'fontSize': '13px' }
      },
      legend: {
        itemWidth: 400
      },
      tooltip: {
        //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>,Response Time: <b>{point.y}</b>'
        style: { fontSize: '7pt' },
        formatter: function () {
          let tooltip = "";
          let pointName = this.point.name;
          if (pointName.length > 60)
            tooltip += pointName.substring(0, 60) + "...";
          else
            tooltip += pointName;
          tooltip += " Percentage: " + "<b>" + this.point.percentage.toFixed(2) + "%" + "</b>" + ", Response Time: " + "<b>" + this.point.y + "</b>";
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
          data: dataArrForRespTime,
          enableMouseTracking: true
        }
      ]

    };
  }

  clickHandler(event) {
    this.fullQueryName = event.point.name;
    this.showAllOption = true;
    this.pointName = ": " + event.point.name;
    if (event.point.name == "Other") {
      this.queryInfo = this.restDataArrOfPie;
    }
    else {
      let filteredData = [];
      for (let k = 0; k < this.chartData.length; k++) {
        if (this.chartData[k]["sqlQuery"] == event.point.name || this.chartData[k]["urlName"] == event.point.name || this.chartData[k]["sqlquery"] == event.point.name) {
          filteredData.push(this.chartData[k]);
        }
      }
      this.queryInfo = filteredData;
    }
  }

  showAllData() {
    this.showAllOption = false;
    this.queryInfo = this.wholeData;
    this.pointName = "";
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
    this.getQueryData();
  }

  getQueryDataCount() {
    let flag = "&customFlag=" + this.customFlag + "&showCount=true";
    //let pagination ="&limit=" + this.limit + "&offset=" + this.offset ;
    let counturl = this.ajaxUrl + flag;
    /*if(this.FPToDB == true)
    {
      this.fromFP = true;
      counturl = this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/dbRequestEx?testRun=" +
      this.id.testRun + "&object=6" + "&urlIdx=" + this.dataFromFPComponent.urlIndex + "&tierId=" + this.dataFromFPComponent.tierId +
      "&serverId=" + this.dataFromFPComponent.serverId + "&appId=" + this.dataFromFPComponent.appId + "&flowpathInstance=" + this.dataFromFPComponent.flowpathInstance +
      "&strStartTime=" + this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&limit=" + this.limit + "&offset=" +
      this.offset +'&customFlag=' + this.customFlag+ "&showCount=true" + "&statusCode=-2";
    }
    else
    {
      this.fromFP = false;
      if(this.queryCount == true)	
        counturl = this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?testRun=" + this.id.testRun + "&object=6" + "&urlIdx=" + this.info.urlIndex + "&tierId=" + this.info.tierId + "&serverId=" + this.info.serverId + "&appId=" + this.info.appId + "&statusCode=" + this.id.statusCode + "&strStartTime=" + this.startTimeInMs + "&strEndTime=" + this.endTimeInMs +'&customFlag=' + this.customFlag+"&templateName=CustomDB&showCount=true";  
      else
        counturl = this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?testRun=" + this.id.testRun + "&tierName=" + this.id.tierName + "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&tierId=" + this.id.tierid + "&serverId=" + this.id.serverid + "&appId=" + this.id.appid + "&strStartTime=" + this.startTimeInMs + "&strEndTime=" + this.endTimeInMs + "&statusCode=-2" + "&strGroup=" + this.id.strGroup + "&strOrderBy=" + this.id.strOrderBy + "&object=6" + '&customFlag=' + this.customFlag+ "&templateName=CustomDB&showCount=true"  + "&urlIndex=" + this.id.urlIndex + "&btcategoryId=" + this.id.btCategory; 
    
       if (this.commonService.signatureToDB === true) {
           counturl += '&flowpathSignature=' + this.dataFromFPComponent.flowpathSignature;
}

     return this.http.get(counturl).subscribe(data => (this.assignCountValues(data)));
    }*/

    return this.ddrRequest.getDataUsingGet(counturl).subscribe(data => (this.assignCountValues(data)));

  }

  assignCountValues(res: any) {
    this.customFlag = false;
    this.totalCount = res.totalCount;
    if (this.limit > this.totalCount)
      this.limit = Number(this.totalCount);
  }

  downloadReport(type: string) {
    let renameArray;
    let colOrder;
    //console.log("queryInfo --- " , this.queryInfo);

    if (this.FPToDB === true) {
      renameArray = { "sqlquery": "Query", "sqlbegintimestamp": "FirstQueryTime", "sqlendtimestamp": "LastQueryTime", "count": "Query Count", "failedcount": "Error Count", "min": "Min Count", "max": "Max Count", "mincumsqlexectime": "Min(ms)", "maxcumsqlexectime": "Max(ms)", "avg": "Average(ms)", "cumsqlexectime": "Execution Time(ms)" };
      colOrder = ["Query", "FirstQueryTime", "LastQueryTime", "Query Count", "Error Count", "Min Count", "Max Count", "Min(ms)", "Max(ms)", "Average(ms)", "Execution Time(ms)"];
      this.queryInfo.forEach((val, idx) => {
        delete val['tierid'];
        delete val['tiername'];
        delete val['serverid'];
        delete val['servername'];
        delete val['appid'];
        delete val['appname'];
        delete val['flowpathinstance'];
        delete val['id'];
        delete val['urlname'];
        delete val['querytype'];
        delete val['sqlexectime'];
        delete val['sqlindex'];
        delete val['ThreadId'];
        delete val['_$visited'];
      });
       // this._ddrData.dbFlag = false; // Commenting this line to resolve bug-45288 
    }
    else {
      if (!this.queryCount && (this.id.dbReportCategory == "DB Request Group By Business Transaction" || this.id.dbReportCategory == "Adv DB Calls By BT")) {
        renameArray = { "urlName": "Business Transaction", "tierName": "Tier", "serverName": "Server", "appName": "Instance", "count": "Query Count" }
        colOrder = ["Business Transaction", "Query Count"];

        this.queryInfo.forEach((val, idx) => {
          if (val['tierName'] != '-') {
            if (colOrder.indexOf("Tier") == -1)
              colOrder.push("Tier");
          }
          else {
            delete val['tierName'];
          }
          if (val['serverName'] != '-') {
            if (colOrder.indexOf("Server") == -1)
              colOrder.push("Server");
          }
          else {
            delete val['serverName'];
          }
          if (val['appName'] != '-') {
            if (colOrder.indexOf("Instance") == -1)
              colOrder.push("Instance");
          }
          else {
            delete val['appName'];
          }
          delete val['appId'];
          delete val['avg'];
          delete val['cumsqlexectime'];
          delete val['failedcount'];
          delete val['max'];
          delete val['maxcumsqlexectime'];
          delete val['min'];
          delete val['mincumsqlexectime'];
          delete val['serverId'];
          delete val['sqlIndex'];
          delete val['sqlQuery'];
          delete val['sqlbegintimestamp'];
          delete val['sqlendtimestamp'];
          delete val['sqlquery'];
          delete val['tierId'];
          delete val['urlIndex'];
          delete val['id'];
          delete val['_$visited'];
        });
      }

      else if (!this.queryCount || this.id.dbReportCategory == "Adv Top DB Queries By ErrorCount" || this.id.dbReportCategory == "Adv Slow DB Calls By Response Time" || this.id.dbReportCategory == "Adv Top DB Calls By Count" || this.id.dbReportCategory == "DB Request Report") {
        renameArray = { "tierName": "Tier", "sqlQuery": "Query", "count": "Query Count", "failedcount": "Error Count", "min": "Min Count", "max": "Max Count", "mincumsqlexectime": "Min(ms)", "maxcumsqlexectime": "Max(ms)", "avg": "Average(ms)" };
        colOrder = ["Tier", "Query", "Query Count", "Error Count", "Min Count", "Max Count", "Min(ms)", "Max(ms)", "Average(ms)"];
        this.queryInfo.forEach((val, idx) => {
	  delete val['serverName'];
	  delete val['appName'];
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
      } else if (this.queryCount) {
        renameArray = { "tierName": "Tier", "serverName": "Server", "appName": "Instance", "sqlQuery": "Query", "count": "Query Count", "failedcount": "Error Count", "min": "Min Count", "max": "Max Count", "mincumsqlexectime": "Min(ms)", "maxcumsqlexectime": "Max(ms)", "avg": "Average(ms)" };
        colOrder = ["Tier", "Server", "Instance", "Query", "Query Count", "Error Count", "Min Count", "Max Count", "Min(ms)", "Max(ms)", "Average(ms)"];
        this.queryInfo.forEach((val, idx) => {
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
      }
    }

    //console.log("queryInfo for download ---" , this.queryInfo);
    let dataObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterInfo,
      strSrcFileName: "DBQueries",
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.queryInfo)
    }
    let downloadFileUrl = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product;
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl() + '/' + this.id.product);
    }
    downloadFileUrl += "/v1/cavisson/netdiagnostics/ddr/downloadAngularReport";
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(dataObj)).subscribe(data => this.showDownloadReport(data));
  }


  sortColumnsOnCustom(event, queryInfo) {
    let fieldValue = event["field"];
    if (fieldValue == "max" || fieldValue == "min" ) {
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
    }
    this.queryInfo = [];
    if (queryInfo) {
      queryInfo.map((rowdata) => { this.queryInfo = this.Immutablepush(this.queryInfo, rowdata) });
    }
  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
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

  showDownloadReport(res: any) {
    let url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product).replace("/netstorm", "").replace("/netdiagnostics", "");
    }
    url += "/common/" + res;
    window.open(url);
  }

  makeFilterCriteriaStr(dbParam) {
    let fcStr = "";
    this.URLstr = "";
    this.CompleteURL = "";
    this.tierName = '';
    this.serverName = '';
    this.instanceName = '';
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    if (this.commonService.isValidParamInObj(dbParam, "tierName")) {
      if (dbParam['tierName'].length > 32) {
        this.tierName = "Tier=" + dbParam['tierName'].substring(0, 32) + '...';
        this.completeTier = dbParam['tierName'];
      }
      else
        this.tierName = "Tier=" + dbParam['tierName'];
    }

    if (this.commonService.isValidParamInObj(dbParam, "serverName")) {
      if (dbParam['serverName'].length > 32) {
        this.serverName = ", Server=" + dbParam['serverName'].substring(0, 32) + '...';
        this.completeServer = dbParam['serverName'];
      }
      else
        this.serverName = ", Server=" + dbParam['serverName'];
    }
    if (this.commonService.isValidParamInObj(dbParam, "serverName") && this.commonService.isValidParamInObj(dbParam, "serverName") && this.commonService.isValidParamInObj(dbParam, "appName"))
      if (this.commonService.isValidParamInObj(dbParam, "appName")) {
        if (dbParam['appName'].length > 32) {
          this.instanceName += ", Instance=" + dbParam['appName'].substring(0, 32) + '...';
          this.completeInstance += dbParam['appName'];
        }
        else
          this.instanceName += ", Instance=" + dbParam['appName'];
      }

    if (this.commonService.isValidParamInObj(dbParam, "startTimeInDateFormat"))
      fcStr += ", From=" + dbParam['startTimeInDateFormat'];

    if (this.commonService.isValidParamInObj(dbParam, "endTimeInDateFormat"))
      fcStr += ", To=" + dbParam['endTimeInDateFormat'];

    if (this.commonService.isValidParamInObj(dbParam, "btcategoryId")) {
      fcStr += ', BT Type=' + this.commonService.getBTCategoryName(dbParam['btcategoryId']);
    }

    if (this.commonService.isValidParamInObj(dbParam, "urlName")) {
      fcStr += ', BT=' + dbParam['urlName'];
      3
    }

    if (this.commonService.isValidParamInObj(dbParam, "url")) {
      let val = dbParam['url'];
      if (val.length > 40) {
        this.URLstr = ', URL=' + val.substring(0, 40) + "..";
        this.CompleteURL = val;
      }
      else {
        this.URLstr = ', URL=' + val;
        this.CompleteURL = val;
      }
    }

    if (dbParam.strGroup != "NA" && dbParam.strGroup != "" && dbParam.strGroup != undefined && dbParam.strGroup != "undefined") {
      fcStr += ", Group By=" + dbParam['strGroup'];
    }
    if (dbParam.strOrderBy != "NA" && dbParam.strOrderBy != "" && dbParam.strOrderBy != undefined && dbParam.strOrderBy != "undefined")
      fcStr += ", Order By=" + dbParam['strOrderBy'];

    if (this.commonService.isValidParamInObj(dbParam, "page")) {
      fcStr += ', Page=' + dbParam['page'];
    }

    if (this.commonService.isValidParamInObj(dbParam, "script")) {
      fcStr += ', Script Name=' + dbParam['script'];
    }

    if (this.commonService.isValidParamInObj(dbParam, "transaction")) {
      fcStr += ', Transaction=' + dbParam['transaction'];
    }

    if (this.commonService.isValidParamInObj(dbParam, "access")) {
      fcStr += ', Access=' + dbParam['access'];
    }
    if (this.commonService.isValidParamInObj(dbParam, "location")) {
      fcStr += ', Location=' + dbParam['location'];
    }

    if (this.commonService.isValidParamInObj(dbParam, "pageName")) {
      fcStr += ', Page Name=' + dbParam['pageName'];
    }

    if (this.commonService.isValidParamInObj(dbParam, "transactionName")) {
      fcStr += ', Transaction Name=' + dbParam['transactionName'];
    }
    if (this.commonService.isValidParamInObj(dbParam, "generatorName")) {
      fcStr += ', Generator Name=' + dbParam['generatorName'];
    }
    if (!this.commonService.isValidParamInObj(dbParam, "tierName") && !this.commonService.isValidParamInObj(dbParam, "serverName") && !this.commonService.isValidParamInObj(dbParam, "appName")) {
      if (fcStr.startsWith(","))
        fcStr = fcStr.substring(1);
    }
    this.filterInfo = fcStr;

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
  cumsqlexectime: string;
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
