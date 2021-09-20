import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { Component, OnInit, AfterViewChecked, Input, OnChanges, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonServices } from '../../services/common.services';
// import { DataTableModule, BlockUIModule } from 'primeng/primeng';
//import 'rxjs/Rx';
//import { ChartModule } from 'angular2-highcharts';
import { Column } from "./coulmn";
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/api';
import { MessageService } from '../../services/ddr-message.service';
import { TimerService } from '../../../tools/configuration/nd-config/services/timer.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'exception-report',
  templateUrl: 'exception-report.component.html',
  styleUrls: ['exception-report.component.scss']
})
export class ExceptionReportComponent implements OnInit, OnChanges {
  highcharts = Highcharts;
  @Input() columnData;
  hstoexData: any;
  fromhstoExpFlag: boolean;
  seqDiagToExpData:any;
  exceptionDetail: Object[] = [{ timeStamp: "", flowPathInstance: "", exceptionClassName: "", message: "", throwingClassName: "", throwingMethodName: "", lineNumber: "", stackTrace: "", stackTraceID: "", exceptionClassId: "", messageId: "", tierName: "", serverName: "", appName: "", tierId: 0, serverId: 0, appId: 0, cause: "", causeId: "", backendId: "", startTime: "", throwingClassId: "", throwingMethodId: "", startTimeInMS: "" }];
  // aggregateExceptionDetail:Object;
  aggregateExceptionInfo: Array<ExceptionInterface>;
  filteredAggregateExceptionInfo: Array<ExceptionInterface>;
  aggHeaderInfo: string = "";
  exceptionInfo: Array<ExceptionInterface>;
  filteredexceptionInfo: Array<ExceptionInterface>
  stackData: string = "";
  stackArr: any[];
  id: any;
  strTitle: any;
  methodBody;
  newMethodBody;
  showCode: boolean = false;
  fullyQualifiedMethod: string;
  ajaxLoader: boolean = false;
  exClassName: string = "";
  cls: string = "";
  chartData: Object[];
  options: Object;
  options1: Object;
  stackObj: any[];
  backendObj: Object;
  displayLocalVariable: boolean = false;
  varArguments: Object[];
  classVariables: string = "";
  localVariables: string = "";
  methodVariables: string = "";
  insideObjVariable: any;
  dialogHeaderName: string = "";
  columns: Array<Column>;
  variablesArgumentsInfo: Array<VariablesArgumentsInfo>;
  variablesArgumentsInfoData: Object;
  showChart: boolean = false;
  expClassName: string = "";
  expMethodName: string = "";
  expLineNo: string = "";
  headerInfo: string = "";
  tableHeader: string = "";
  stackTraceHeader: string = "";
  stackTraceHeaderTooltip:string="";
  disabledAggTab: boolean = false;
  showAllOption: boolean = false;
  showInsideObjPopup: boolean = false;
  // data:any;
  dataKey: any;
  totalIndex: String = "";
  headerInsideObj: string = "";
  stackTraceJson: any;
  loading: boolean = false;
  classFileName: string = "";
  classMethodFileName: string = "";
  stackTraceHeaderInfo: string = "";
  showDownLoadReportIcon: boolean = false;
  showDownloadSourceCodeIcon: boolean = true;
  totalMethodVars: number = 0;
  toalClassVars: number = 0;
  totalLocalVars: number = 0;
  totalThreadVars: number = 0;
  toolTipText: string = "";
  reportHeader: string;
  loader: boolean = false;
  value: number = 1;
  limit: number = 50;
  offset: number = 0;
  agglimit: number = 50;
  aggoffset: number = 0;
  screenHeight: any;
  totalCount: number = 0;
  totalCountEx: any;
  totalCountST: any;
  nodeDataInfo: any;
  rowChangeKey: string = "NA";
  paginatorArr: Number[] = [10];
  paginatorArrEx: Number[];
  paginatorArrST: Number[] = [10];
  rowValue: number;
  rowValueEx: number;
  rowValueST: number;
  stackDivWidth = "ui-g-12";
  colsForException: any;
  colsForAggException: any;
  columnOptionsForException: SelectItem[];
  columnOptionsForAggException: SelectItem[];
  visibleColsForException: any[];
  visibleColsForAggException: any[];
  prevColumnForException;
  prevColumnForAggException;

  // Varibles used for column level filter
  toggleFilterTitleForException = '';
  isEnabledColumnFilterForException = true
  toggleFilterTitleForAggException = '';
  isEnabledColumnFilterForAggException = true

  isFilterFromSideBar: boolean = false;
  urlAjaxParamObject: any;
  URLstr: string;
  CompleteURL: string;
  errMsg: Message[];
  msgs: Message[] = [];
  filterTierName = '';
  filterServerName = '';
  filterInstanceName = '';
  filterGroupBy = '';
  filterOrderByStr = '';
  completeTier = '';
  completeServer = '';
  completeInstance = '';
  completeGroupBy = '';
  filterGroupByStr = '';
  completeOrderBy = '';
  isToggleColumns:boolean = false;
  isToggleColumnsExc:boolean = false;

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
  dcProtocol: string = '//';
  showPagination: boolean = false;
  showPaginationEX: boolean = false;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId1:any;
  queryId2:any;
  breadcrumb: BreadcrumbService;

  aggColOrder: any = [];
  finalUrlException: string;
  downloadHeaderInfo: string = '';
  private progress: Subscription;
  @Input('value') compareFPInfo: any = {};
  timeZoneOffset:number
  //data = {"data":{"20":[{"name":"exceptionID","val":"1","type":"Integer"},{"name":"cumCount","val":"20","type":"Long"},{"name":"prevCumCount","val":"3","type":"Long"},{"name":"isCountUpdated","val":"true","type":"Boolean"}],"12":[{"name":"exceptionID","val":"2","type":"Integer"},{"name":"cumCount","val":"6","type":"Long"},{"name":"prevCumCount","val":"0","type":"Long"},{"name":"isCountUpdated","val":"true","type":"Boolean"}],"31":[{"name":"exceptionID","val":"3","type":"Integer"},{"name":"cumCount","val":"6","type":"Long"},{"name":"prevCumCount","val":"0","type":"Long"},{"name":"isCountUpdated","val":"true","type":"Boolean"}]},"toalIndex":100};
  //dataKey = Object.keys(this.data.data);
  //totalIndex = this.data.toalIndex;
  AggData: Object[] = [{ "exceptionclassid": "", "ExceptionClassName": "", "exceptionmessageid": "", "Message": "", "exceptioncauseid": "", "Cause": "", "StackTraceCount": "", "ExceptionCount": "", "TierName": "", "Tierid": "", "ServerName": "", "Serverid": "", "AppName": "", "Appid": "", "TransactionName": "", "TransactionIndex": "", "PageName": "", "PageIndex": "", "SessionName": "", "SessionIndex": "", "URLName": "", "URLIndex": "", "FlowPathSignature": "", "exceptionthrowingclassid": "", "ThrowingClassName": "", "exceptionthrowingmethodid": "", "ThrowingMethodName": "" }];

  @Input() showLink: boolean = true;
  downloadFilterCriteria='';
  private sideBarException: Subscription; 

  constructor(public commonService: CommonServices, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private _router: Router, private _ddrData: DdrDataModelService, private messageService: MessageService, private _timerService: TimerService,
    private breadcrumbService: DdrBreadcrumbService,
    private ddrRequest:DDRRequestService, breadcrumb: BreadcrumbService) {
    this.breadcrumb = breadcrumb;
  }

  ngOnInit() {
    this.fromhstoExpFlag = this.commonService.fromhstoExpFlag;
    this.hstoexData = this.commonService.hstoexData;
    this.seqDiagToExpData = this.commonService.seqDiagToExceptionData;
    this.loading = true;
    this.queryId1 = this.randomNumber();
    if (this.breadcrumbService.parentComponent == CONSTANTS.BREADCRUMB_ITEMS.IPSTAT && this._ddrData.splitViewFlag == false){
      this.commonService.isToLoadSideBar = false ;
    this.tableHeader="";
    this.stackTraceHeader="";
    }
    if (this.commonService.exceptionFilters['source'] != "FlowpathReport")
      this.commonService.currentReport = "Exception";
   // this.commonService.exceptionFilters['source'] = "NA";
   if (this._ddrData.splitViewFlag == false)
    this.screenHeight = Number(this.commonService.screenHeight) - 88;
   else
   this.screenHeight = Number(this.commonService.screenHeight) - 135;
    if (Object.keys(this.compareFPInfo).length == 0 && this._ddrData.splitViewFlag == false)
{
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.EXCEPTION);
      this.breadcrumb.add({label: 'Exceptions', routerLink: '/ddr/exception'});
     
    this.id = this.commonService.getData();
}
     if(this._router.url.indexOf('/home/ED-ddr/exception') != -1 && this._router.url.indexOf('?') != -1) {
      let queryParams1=location.href.substring(location.href.indexOf('?')+1,location.href.length);
      this.id=JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
       if(this.id.startTime == undefined) {
         this.id.startTime = this.id.strStartTime;
         this.id.strEndTime = this.id.strEndTime; 
         this.id.endTime = this.id.strEndTime;      
       }else {
         this.id.startTime = this.id.startTime;
         this.id.strEndTime = this.id.endTime;
         this.id.endTime = this.id.endTime;        
       }
       if (this.id.enableQueryCaching){
        this.commonService.enableQueryCaching = this.id.enableQueryCaching;
      }
      sessionStorage.setItem('hostDcName', location.host);
      // sessionStorage.setItem("product",this.urlParam.product);
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.id;
      this.commonService.expDataFromED = this.id;
      this.commonService.dcNameList = this.id.dcNameList;
      this.commonService.isAllCase = this.id.isAll;
      this.commonService.tierNameList = this.id.tierNameList;
      this.commonService.selectedDC = this.id.dcName;
      this.commonService.ajaxTimeOut = this.id.ajaxTimeout;
      if (this.id.dcNameList != null && this.id.dcNameList != '' && this.id.dcNameList != undefined && this.id.dcNameList != 'undefined') {
        sessionStorage.setItem("dcNameList", this.id.dcNameList);
        sessionStorage.setItem("tierNameList", this.id.tierNameList)
        sessionStorage.setItem("isAllCase", this.id.isAll);
      }
      //this.urlParam.startTime = this.urlParam.strStartTime;
      //this.urlParam.strEndTime = this.urlParam.strEndTime;
    }

    if (this._router.url.indexOf('/home/ED-ddr/exception') != -1 && this.commonService.fromDBtoExpFlag == true && this.commonService.dbDataFromFPInED != undefined) {
      this.id.startTime = this.commonService.dbDataFromFPInED.strStartTime;
      this.id.endTime = this.commonService.dbDataFromFPInED.strEndTime;
    }
    if (this._router.url.indexOf('/home/ED-ddr/exception') != -1 && this.commonService.fromhstoExpFlag == true) {
      this.id = this.commonService.hsDataFromED;
    }
    if (this._router.url.indexOf('/home/ED-ddr/exception') != -1 && this.id.testRun == undefined && this._ddrData.flowpathToExFlag == false && this.commonService.fromhstoExpFlag == false && this.commonService.flowpathToExData == undefined && this.commonService.fromDBtoExpFlag == false && this.commonService.fromDBtoExpData == undefined && this.commonService.seqDiagToExceptionData == undefined && this.commonService.seqDiagToExceptionFlag == false) {
      this.id = this.commonService.expDataFromED;
    }
     if ((this._router.url.indexOf('/home/ED-ddr/exception') != -1 || this._router.url.indexOf('/home/ddr/exception') != -1) && this.commonService.ipstatToExceptionFlag == true) {
       this.id = this.commonService.expDataFromED;
     }

    if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
      this.id.testRun = this.commonService.testRun;
    }
    console.log("this.id--",this.id);
    if (this.id.product == undefined && this.commonService.seqDiagToExceptionFlag == false)
      this.id.product = this.id.ipWithProd.split("%2F")[1];
    this.reportHeader = 'Exception Report- ' + this.id.testRun;
    if (this.commonService.fromhstoExpFlag == false && this._ddrData.flowpathToExFlag == false && this.commonService.fromDBtoExpFlag == false && sessionStorage.getItem("dcNameList") != null && sessionStorage.getItem("dcNameList") != '' && sessionStorage.getItem("dcNameList") != undefined && sessionStorage.getItem("dcNameList") != 'undefined') {
      this.commonService.dcNameList = sessionStorage.getItem("dcNameList");
      this.commonService.tierNameList = sessionStorage.getItem("tierNameList");
      this.commonService.isAllCase = sessionStorage.getItem("isAllCase");
    }
    if (Object.keys(this.compareFPInfo).length == 0 && this._ddrData.splitViewFlag == false) {
      this.commonService.isToLoadSideBar = true ;
      this.fillData();
     // this.setTestRunInHeader();
    }
    if (this._ddrData.splitViewFlag) {
      this.fillData();
    }
    this.setTestRunInHeader();

    this.sideBarException = this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == "Exception") {
        console.log('temp============', temp);
        this.commonService.isFilterFromSideBar = true;
        let keys = Object.keys(temp);
        this.loading = true;
     //   this.fillData();
     this.agglimit = 50
     this.offset = 0;
     this.getaggregatedData();
      }
    this._ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessage(mssg)});
    });
  }
  updateIdParam() {
    let endTime = 0;
    if (undefined != this.compareFPInfo.fpDuration) {
      if (this.compareFPInfo.fpDuration.toString().includes(','))
        endTime = Number(this.compareFPInfo.startTimeInMs) + Number(this.compareFPInfo.fpDuration.toString().replace(/,/g, ""));
      else if (this.compareFPInfo.fpDuration == '< 1')
        endTime = Number(this.compareFPInfo.startTimeInMs) + Number(0);
      else
        endTime = Number(this.compareFPInfo.startTimeInMs) + Number(this.compareFPInfo.fpDuration);
    }
    this.id['startTime'] = this.compareFPInfo['startTimeInMs'];
    this.id['endTime'] = endTime + "";
    this.id['tierId'] = this.compareFPInfo['tierId'];
    this.id['serverId'] = this.compareFPInfo['serverId'];
    this.id['appId'] = this.compareFPInfo['appId'];
    this.id['tierName'] = this.compareFPInfo['tierName'];
    this.id['serverName'] = this.compareFPInfo['serverName'];
    this.id['appName'] = this.compareFPInfo['appName'];
    this.id['flowPathInstance'] = this.compareFPInfo['flowpathInstance'];
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
  
        if(this._ddrData.splitViewFlag) 
        this._ddrData.setInLogger('DDR::Flowpath',"Exception","Open Exception Summary Report");
  this.queryId1 = this.randomNumber();
  if (this.columnData != undefined) {
      this.loading = true;
      this.tableHeader="";
      this.stackTraceHeader="";
      this.commonService.flowpathToExData = JSON.parse(JSON.stringify(this.columnData));
      this._ddrData.flowpathToExFlag = true;
      this.id = JSON.parse(JSON.stringify(this.columnData));
      console.log("this.commonService.enableQueryCaching",this.commonService.enableQueryCaching);
      this.commonService.enableQueryCaching = this.commonService.enableQueryCaching;
      // this.id.failedQuery = this.columnData.totalError;
      this.getaggregatedData();
    } else {
      console.log("compareFPInfo", this.compareFPInfo);
      this.id = this.commonService.getData();
      this.updateIdParam();
       console.log("after update id param");
      if (Object.keys(this.compareFPInfo).length > 0)
        this.fillData();
     console.log("after filldata Case");
    }
  }
  fillData() {
    if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
     this.getDCData();
    } else {
      //this.getGroupedExceptionData(); // now making single rest call for pie chart and aggregrate table
      if (this._ddrData.splitViewFlag == false)
        this.getaggregatedData();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      this.commonService.testRun = '';
      this.commonService.selectedDC = '';
    }
   // this.createDynamicColumns();
  }
  createDynamicColumns() {
    let exParam = this.commonService.exceptionFilters;

    this.visibleColsForAggException = ['exceptionCount'];
    this.columnOptionsForAggException = [{ label: 'Exception Count', value: 'exceptionCount' }];
    this.aggColOrder = [];
    this.colsForException = [
      { field: 'tierName', header: 'Tier', sortable: true, action: true, align: 'left', color: 'black', width: '60' },
      { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '60' },
      { field: 'appName', header: 'Instance', sortable: true, action: true, align: 'left', color: 'black', width: '60' },
      { field: 'flowPathInstance', header: 'FlowpathInstance', sortable: true, action: false, align: 'right', color: 'black', width: '140' },
      { field: 'backendId', header: 'Integration Point', sortable: true, action: true, align: 'left', color: 'black', width: '80' },
      { field: 'timeStamp', header: 'Time', sortable: true, action: true, align: 'right', color: 'black', width: '120' },
      { field: 'exceptionClassName', header: 'Exception Class', sortable: true, action: true, align: 'left', color: 'blue', width: '120' },
      { field: 'message', header: 'Message', sortable: true, action: true, align: 'left', color: 'black', width: '120' },
      { field: 'throwingClassName', header: 'Throwing Class', sortable: true, action: true, align: 'left', color: 'black', width: '120' },
      { field: 'throwingMethodName', header: 'Throwing Method', sortable: true, action: true, align: 'left', color: 'blue', width: '120' },
      { field: 'lineNumber', header: 'Line No.', sortable: true, action: false, align: 'right', color: 'black', width: '80' },
      { field: 'cause', header: 'Cause', sortable: true, action: false, align: 'left', color: 'black', width: '120' },
    ];

    this.colsForAggException = [
      { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'URLName', header: 'Business Transaction', sortable: false, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'pageName', header: 'Page', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'sessionName', header: 'Session', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'transactionName', header: 'Transaction', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'exceptionClassName', header: 'Exception Class', sortable: false, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'message', header: 'Message', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'cause', header: 'Cause', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'throwingClassName', header: 'Throwing Class', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'throwingMethodName', header: 'Throwing Method', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'exceptionCount', header: 'Exception Count', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '80' },
      { field: 'Tierid', header: 'Tierid', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'Serverid', header: 'Serverid', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'Appid', header: 'Appid', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
      { field: 'URLIndex', header: 'URLIndex', sortable: true, action: false, align: 'left', color: 'black', width: '80' },
    ];
    for (let value of this.colsForAggException) {
      if ( exParam['groupby'].indexOf('url') != -1 && value['field'] == 'URLName') {
        value['action'] = true;
        this.visibleColsForAggException.push("URLName");
        this.columnOptionsForAggException.push({ label: 'Business Transaction', value: 'URLName' });
        this.aggColOrder.push("Business Transaction");
        this.filterGroupBy += "URL";
      }
      if (exParam['groupby'].indexOf('tier') != -1 && value['field'] == 'tierName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Tier', value: 'tierName' });
        this.visibleColsForAggException.push("tierName");
        this.aggColOrder.push("Tier");
      }
      if (exParam['groupby'].indexOf('server') != -1 && value['field'] == 'serverName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Server', value: 'serverName' });
        this.visibleColsForAggException.push("serverName");
        this.aggColOrder.push("Server");
      }
      if (exParam['groupby'].indexOf('app') != -1 && value['field'] == 'appName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Instance', value: 'appName' });
        this.visibleColsForAggException.push("appName");
        this.aggColOrder.push("Instance");
      }
      if (exParam['groupby'].indexOf('page') != -1 && value['field'] == 'pageName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Page', value: 'pageName' });
        this.visibleColsForAggException.push("pageName");
        this.aggColOrder.push("Page");

      }
      if (exParam['groupby'].indexOf('session') != -1 && value['field'] == 'sessionName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Session', value: 'sessionName' });
        this.visibleColsForAggException.push("sessionName");
        this.aggColOrder.push("Session");
      }

      if (exParam['groupby'].indexOf('transaction') != -1 && value['field'] == 'transactionName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Transaction', value: 'transactionName' });
        this.visibleColsForAggException.push("transactionName");
        this.aggColOrder.push("Transaction");

      }
      if ( exParam['groupby'].indexOf('excclass') != -1 && value['field'] == 'exceptionClassName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Exception Class', value: 'exceptionClassName' });
        this.visibleColsForAggException.push("exceptionClassName");
        this.aggColOrder.push("Exception Class");
      }
      if (exParam['groupby'].indexOf('excthrowingclass') != -1 && value['field'] == 'throwingClassName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Throwing Class', value: 'throwingClassName' });
        this.visibleColsForAggException.push("throwingClassName");
        this.aggColOrder.push("Throwing Class");
      }

      if (exParam['groupby'].indexOf('excthrowingmethod') != -1 && value['field'] == 'throwingMethodName') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Throwing Method', value: 'throwingMethodName' });
        this.visibleColsForAggException.push("throwingMethodName");
        this.aggColOrder.push("Throwing Method");
      }
      if (exParam['groupby'].indexOf('excmessage') != -1 && value['field'] == 'message') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Message', value: 'message' });
        this.visibleColsForAggException.push("message");
        this.aggColOrder.push("Message");
      }


      if (exParam['groupby'].indexOf('exccause') != -1 && value['field'] == 'cause') {
        value['action'] = true;
        this.columnOptionsForAggException.push({ label: 'Cause', value: 'cause' });
        this.visibleColsForAggException.push("cause");
        this.aggColOrder.push("Cause");
      }

    }
    this.filterGroupBy = this.aggColOrder.toString();
    this.visibleColsForException = [
      'tierName',  'appName', 'backendId', 'timeStamp', 'exceptionClassName', 'message', 'throwingClassName', 'throwingMethodName'
    ];

    this.columnOptionsForException = [];
    for (let i = 0; i < this.colsForException.length; i++) {
      this.columnOptionsForException.push({ label: this.colsForException[i].header, value: this.colsForException[i].field });
    }

    /* this.visibleColsForAggException = [
       'exceptionClassName', 'ThrowingClassName', 'throwingMethodName', 'exceptionCount'
     ]; */

    /*    for (let i = 0; i < this.colsForAggException.length; i++) {
          this.columnOptionsForAggException.push({ label: this.colsForAggException[i].header, value: this.colsForAggException[i].field });
        }*/


  }
  //For Pie chart data
  /* getGroupedExceptionData() {
    this.agglimit=50 ; 
       if(this.id.strGraphKey == "WholeScenario")
      {
        this.id.strStartTime = "NA";
        this.id.strEndTime = "NA";
      }
      let url = '';
      let finalUrl= '' ;
      let urlAjaxParam = '' ;
      let flags = '';
      if(this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      }else {
        url = this.getHostUrl();
      }
      url += '/' + this.id.product+"/v1/cavisson/netdiagnostics/ddr/groupExceptionData?" ;
   if (this.commonService.isFilterFromSideBar) // sidebar filters to Exception
    {
        let exParam = this.commonService.exceptionFilters;
        console.log(" COMPONENT - Exception, METHOD -  getGroupedExceptionData, exFilters got here",  exParam);  
        urlAjaxParam = this.commonService.makeParamStringFromObj(exParam);
        console.log(" COMPONENT - Exception, METHOD -  getGroupedExceptionData, After making url from exFilters= "+ urlAjaxParam);
      } 
   else {
      if (this._ddrData.flowpathToExFlag === true) {
        let endTime = Number(this.commonService.flowpathToExData.startTimeInMs  ) + Number(this.commonService.flowpathToExData.fpDuration);
        urlAjaxParam = "testRun="+this.id.testRun + "&flowPathInstance=" + this.commonService.flowpathToExData.flowpathInstance +
          "&tierName=" + this.commonService.flowpathToExData.tierName + "&tierid=" + this.commonService.flowpathToExData.tierId +
          "&serverName=" + this.commonService.flowpathToExData.serverName + "&serverid=" + this.commonService.flowpathToExData.serverId +
          "&appName=" + this.commonService.flowpathToExData.appName + "&appid=" + this.commonService.flowpathToExData.appId +
          "&strStartTime=" + this.commonService.flowpathToExData.startTimeInMs + "&strEndTime=" + endTime +
          "&failedQuery=" + this.commonService.flowpathToExData.failedQuery + "&pagination=" + "&backendid=" + this.id.backendid +
          "&backendName=" + this.id.backendNameQuery + "&backendSubType=" + this.id.backendSubType +
          "&exceptionClassId=" + this.id.exceptionClassId + "&groupby=excthrowingclass,excthrowingmethod,excclass";
          this._ddrData.flowpathToExFlag = false;
      } else if (this.commonService.fromDBtoExpFlag == true) {
        urlAjaxParam =  "testRun="+this.id.testRun +  "&tierName=" + this.commonService.fromDBtoExpData.tierName + "&tierid=" + this.commonService.fromDBtoExpData.tierId +
         "&serverName=" + this.commonService.fromDBtoExpData.serverName + "&serverid=" + this.commonService.fromDBtoExpData.serverId +
         "&appName=" + this.commonService.fromDBtoExpData.appName + "&appid=" + this.commonService.fromDBtoExpData.appId +
         "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime +
         "&failedQuery=1" + "&pagination=" + "&backendid=" + this.id.backendid +
         "&backendName=" + this.id.backendNameQuery + "&backendSubType=" + this.commonService.fromDBtoExpData.sqlIndex +
         "&exceptionClassId=" + this.id.exceptionClassId + "&groupby=excthrowingclass,excthrowingmethod,excclass";
          flags = "&exceptionType=1" ;
     } else {
      urlAjaxParam =  "testRun="+this.id.testRun +  "&flowPathInstance=" + this.id.flowPathInstance + "&tierName=" + this.id.tierName +
          "&serverName=" + this.id.serverName + "&appName=" + this.id.appName + "&tierid=" + this.id.tierid + "&serverid=" +
          this.id.serverid + "&appid=" + this.id.appid + "&strStartTime=" + this.id.startTime + "&strEndTime=" +
          this.id.endTime + "&failedQuery=" + this.id.failedQuery + "&pagination=" + "&backendid=" + this.id.backendid +
          "&backendName=" + this.id.backendNameQuery + "&backendSubType=" + this.id.backendSubType + "&exceptionClassId=" +
          this.id.exceptionClassId + "&groupby=excthrowingclass,excthrowingmethod,excclass";
      }

      this.urlAjaxParamObject = this.commonService.makeObjectFromUrlParam(urlAjaxParam);
      this.commonService.exceptionFilters = this.urlAjaxParamObject;
    }
    finalUrl = url  + urlAjaxParam + flags  +  "&templateName=ExceptionGroupBy" ;
    console.log('urlAjaxParam for pie--->', urlAjaxParam);
      console.log('finalUrl for pie--->', finalUrl);
     return this.http.get(finalUrl).subscribe(data => (this.createPieChart(data)));
  } */

  //For Aggregate table
  getaggregatedData() {

    console.log('rowData from flowpath to Ex', this.commonService.flowpathToExData);
    if(this.agglimit == 0)
    this.agglimit = 50 ;

    let url = '';
    let finalUrl = '';
    let urlAjaxParam = '';
    let flag = '';
 
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
      console.log("URLLLLLLL",url);
    }
    let testRun;
    if(this.commonService.testRun)
    testRun= this.commonService.testRun;  //Handling multi dc side bar case
    else
    testRun= this.id.testRun;
    if(this.commonService.enableQueryCaching == 1){
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/groupExceptionData?cacheId="+ testRun + "&testRun=" + testRun ;
    }else{
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/groupExceptionData?testRun=" + testRun ;
    }

    console.log("Url after test run-",url);
    if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.exceptionFilters).length!=0) // sidebar filters to Exception
    {
      this.isFilterFromSideBar = true ;
      let exParam = this.commonService.exceptionFilters;
      if(this.commonService.isValidParamInObj(exParam ,'pubicIP' ) && this.commonService.isValidParamInObj(exParam ,'publicPort' )  && this.commonService.isValidParamInObj(exParam ,'ndeTestRun' ) )
      {
        if(this.commonService.enableQueryCaching == 1){
          url =  exParam['ndeProtocol'] + "://" + exParam['pubicIP'] + ":" + exParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/groupExceptionData?cacheId='+ exParam['ndeTestRun'] + '&testRun=' + exParam['ndeTestRun'];  
        }
        else{
          url =  exParam['ndeProtocol'] + "://" + exParam['pubicIP'] + ":" + exParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/groupExceptionData?testRun=' + exParam['ndeTestRun'];
        }
        console.log("url--", url);
      }

      console.log(" COMPONENT - Exception, METHOD -  getaggregatedData, exFilters got here", exParam);
      urlAjaxParam = this.commonService.makeParamStringFromObj(exParam);
      console.log(" COMPONENT - Exception, METHOD -  getaggregatedData, After making url from exFilters= " + urlAjaxParam);
      this.limit = 50; // setting limit for second table
    }
    else {
      if (this._ddrData.flowpathToExFlag === true) {
        if(this.commonService.flowpathToExData.totalError && Number(this.commonService.flowpathToExData.totalError)>0){
          this.commonService.flowpathToExData.failedQuery=1;
        }
        let endTime = Number(this.commonService.flowpathToExData.startTimeInMs) + Number(this.commonService.flowpathToExData.fpDuration.toLocaleString().replace(/,/g, ""));
        urlAjaxParam += "&flowPathInstance=" + this.commonService.flowpathToExData.flowpathInstance +
          "&tierName=" + this.commonService.flowpathToExData.tierName + "&tierid=" + this.commonService.flowpathToExData.tierId +
          "&serverName=" + this.commonService.flowpathToExData.serverName + "&serverid=" + this.commonService.flowpathToExData.serverId +
          "&appName=" + this.commonService.flowpathToExData.appName + "&appid=" + this.commonService.flowpathToExData.appId +
          "&strStartTime=" + this.commonService.flowpathToExData.startTimeInMs + "&strEndTime=" + endTime +
          "&backendName=" + this.id.backendNameQuery + "&backendSubType=" + this.id.backendSubType +
          "&exceptionClassId=" + this.id.exceptionClassId + "&failedQuery=" + this.commonService.flowpathToExData.failedQuery +
          "&backendid=" + this.id.backendid;
           this.id.failedQuery = this.commonService.flowpathToExData.failedQuery;//updating as because of no case for flowpathToExFlag in exception report rest call
        this.id.flowPathInstance=this.commonService.flowpathToExData.flowpathInstance;
         this.id.serverId=this.commonService.flowpathToExData.serverId;
         this.id.appId=this.commonService.flowpathToExData.appId;
          this.id.startTime=this.commonService.flowpathToExData.startTimeInMs;
          this.id.endTime=endTime;
           this.limit = 50; // setting limit for second table
          console.log('this.limit---', this.limit);
      } else if (this.commonService.fromDBtoExpFlag == true) {
        urlAjaxParam += "&flowPathInstance=" + this.commonService.fromDBtoExpData.flowpathInstance +
          "&tierName=" + this.commonService.fromDBtoExpData.tierName + "&tierid=" + this.commonService.fromDBtoExpData.tierId +
          "&serverName=" + this.commonService.fromDBtoExpData.serverName + "&serverid=" + this.commonService.fromDBtoExpData.serverId +
          "&appName=" + this.commonService.fromDBtoExpData.appName + "&appid=" + this.commonService.fromDBtoExpData.appId +
          "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime +
          "&backendName=" + this.id.backendNameQuery + "&backendSubType=" + this.commonService.fromDBtoExpData.sqlIndex +
          "&exceptionClassId=" + this.id.exceptionClassId + "&failedQuery=1" +
          "&backendid=" + this.id.backendid;
      } else if (this.fromhstoExpFlag) {
        urlAjaxParam +=  "&tierName=" + this.hstoexData.tierName + "&tierid=" + this.hstoexData.tierId +
          "&serverName=" + this.hstoexData.serverName + "&serverid=" + this.hstoexData.serverId +
          "&appName=" + this.hstoexData.appName + "&appid=" + this.hstoexData.appId + "&flowPathInstance=" + this.hstoexData.fpInst +
          "&strStartTime=" + this.hstoexData.startTime + "&strEndTime=" + this.hstoexData.endTime +
          "&backendid=" + this.hstoexData.backendId + "&seqno=" + this.hstoexData.seqno + "&groupby=excthrowingclass,excthrowingmethod,excclass" + "&calloutError=true";
           this.id.startTime=this.hstoexData.startTime;
           this.id.endTime=this.hstoexData.endTime;
      } else if(this.commonService.seqDiagToExceptionFlag == true) {
        console.log("seqDiagToExpData ******* " , this.seqDiagToExpData);
        urlAjaxParam += "&flowPathInstance=" +  this.seqDiagToExpData.flowpathInstance + "&tierName="
        + this.seqDiagToExpData.tierName + "&serverName=" + this.seqDiagToExpData.serverName + "&appName=" + this.seqDiagToExpData.appName +
        "&tierid=" + this.seqDiagToExpData.tierId + "&serverid=" + this.seqDiagToExpData.serverId + "&appid=" + this.seqDiagToExpData.appId +
        "&strStartTime=" + this.seqDiagToExpData.startTimeInMs + "&strEndTime=" + this.seqDiagToExpData.endTimeInMs + "&failedQuery=" + this.seqDiagToExpData.failedQuery+
        "&backendid=" + this.seqDiagToExpData.backendid  + "&seqno=" + this.seqDiagToExpData.seqNo + "&backendSubType=" + this.seqDiagToExpData.backendSubType;
      }
      else {
        urlAjaxParam += "&flowPathInstance=" + this.id.flowPathInstance + "&tierName=" + this.id.tierName + "&serverName=" +
          this.id.serverName + "&appName=" + this.id.appName + "&tierid=" + this.id.tierid + "&serverid=" + this.id.serverid +
          "&appid=" + this.id.appid + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime +
          "&failedQuery=" + this.id.failedQuery + "&pagination=" + "&backendid=" + this.id.backendid + "&backendName=" +
          this.id.backendNameQuery + "&backendSubType=" + this.id.backendSubType + "&exceptionClassId=" +
          this.id.exceptionClassId;
      }
      urlAjaxParam += "&groupby=excthrowingclass,excthrowingmethod,excclass" + "&groupByFC=Exception Class,Throwing Class,Throwing Method"

      if (this._ddrData.exceptionClsName)
        urlAjaxParam += "&excepClsName=" + this._ddrData.exceptionClsName;

      this.urlAjaxParamObject = this.commonService.makeObjectFromUrlParam(urlAjaxParam);
      this.commonService.exceptionFilters = this.urlAjaxParamObject;
	        setTimeout(() => {
        this.messageService.sendMessage(this.commonService.exceptionFilters);
      }, 2000);
    }
    finalUrl = url + urlAjaxParam + "&limit=" + this.agglimit + "&offset=" + this.aggoffset + "&queryId="+this.queryId1 ;
    this.isCancelQuerydata = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);
    console.log('urlAjaxParam for goupData--->', urlAjaxParam);
    console.log('finalUrl for goupData--->', finalUrl);
    return this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => (this.getAggData(data))
	, error => {
     	 this.loading = false;
      	this.loader = false;
       if(error.hasOwnProperty('message') ){
       this.commonService.showError(error.message);
      }
    });
  }
  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName;
    if(this._ddrData.isFromtrxFlow){
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.id.testRun=this._ddrData.testRunTr;
    
    }
    else{
    hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //hostDcName = "//" + this._ddrData.host + ':' + this._ddrData.port;
      this.id.testRun = this._ddrData.testRun;
      this.testRun = this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
    }

    // else if (this._navService.getDCNameForScreen("exception") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("exception");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  createPieChart(res: any) {
    let groupChart = '';
    this.commonService.exceptionFilters['startTimeInDateFormat'] = res.startTime;
    this.commonService.exceptionFilters['endTimeInDateFormat'] = res.endTime;
    this.loading = false;
    this.chartData = res.data;
    let exParam = this.commonService.exceptionFilters;
    if (this.chartData.length == 0) {
      this.showChart = false;
    }
    else {
      this.showChart = true;
    }
    if (res.hasOwnProperty('Status')) {
      this.commonService.showError(res.Status);
    }
    var exceptionInfoArr = [];
    for (var j = 0; j < this.chartData.length; j++) {
      groupChart = '';
      if (exParam['groupby'].indexOf('excclass') != -1) {
        groupChart = this.chartData[j]["ExceptionClassName"] + ",";
      }

      if (exParam['groupby'].indexOf('excthrowingclass') != -1) {
        groupChart += this.chartData[j]["ThrowingClassName"] + ",";
      }
      if (exParam['groupby'].indexOf('excthrowingmethod') != -1) {
        groupChart += this.chartData[j]["ThrowingMethodName"] + ",";

      }
      if (exParam['groupby'].indexOf('tier') != -1) {
        groupChart += this.chartData[j]["TierName"] + ",";
      }
      if (exParam['groupby'].indexOf('server') != -1) {
        groupChart += this.chartData[j]["ServerName"] + ",";
      }
      if (exParam['groupby'].indexOf('app') != -1) {
        groupChart += this.chartData[j]["appName"] + ",";
      }
      if ( exParam['groupby'].indexOf('url') != -1) {
        groupChart += this.chartData[j]["URLName"] + ",";
      }
      if ( exParam['groupby'].indexOf('AppName') != -1) {
        groupChart += this.chartData[j]["BTCategory"] + ",";
      }
      if ( exParam['groupby'].indexOf('page') != -1)
        groupChart += this.chartData[j]["PageName"] + ",";

      if ( exParam['groupby'].indexOf('session') != -1)
        groupChart += this.chartData[j]["SessionName"] + ",";

      if ( exParam['groupby'].indexOf('transaction') != -1)
        groupChart += this.chartData[j]["TransactionName"] + ",";

      if (exParam['groupby'].indexOf('excmessage') != -1)
        groupChart += this.chartData[j]["Message"] + ",";

      if ( exParam['groupby'].indexOf('exccause') != -1)
        groupChart += this.chartData[j]["Cause"];

      if (groupChart.endsWith(',')) {
        groupChart = groupChart.substring(0, groupChart.length - 1);
      }

      var exClass = this.chartData[j]["ExceptionClassName"];
      //var exName = exClass.substring(exClass.lastIndexOf('.')+1,exClass.length); 
      //exceptionInfoArr.push({"name":this.chartData[j]["ExceptionClassName"],"y":Number(this.chartData[j]["ExceptionCount"])});
      exceptionInfoArr.push({ "name": groupChart, "y": Number(this.chartData[j]["ExceptionCount"]) });
      // console.log("exceptionInfoArr--",exceptionInfoArr);
    }

    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: 'Group By Exceptions', style: { 'fontSize': '13px' } },
      legend: {
        itemWidth: 400
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, Count: <b> {point.y}</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: false,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
          showInLegend: true
        }
      },
      series: [
        {
          name: 'Percentage',
          data: exceptionInfoArr,
          enableMouseTracking: true
        }
      ]
    };
  }
  /*onPointSelect (e) {
    this.disabledAggTab=true;
    this.tableHeader="Exception(s)";
    let filteredExceptionArr=[];
     for(var i=0; i< this.exceptionInfo.length; i++)
    {
       if(this.exceptionInfo[i]['startTimeInMS'] == e.context.x)
       {
              filteredExceptionArr.push(this.exceptionInfo[i]);  
       }
   }
   this.filteredexceptionInfo=filteredExceptionArr;

   }*/
  showExceptions(nodeData: any, type) {
    this.loading=true;
    this.showCode = false;
    this.stackDivWidth = 'ui-g-12';
    if(nodeData.data != undefined)
    nodeData = nodeData.data ;
    console.log("nodeData------",JSON.stringify(nodeData) );
    this.getExceptionData(nodeData);
    this.getExceptionDataCount(nodeData);
    //let filterAggEx=[];
    this.tableHeader = '';
    this.stackTraceHeader = '';
    if (nodeData['exceptionClassName'] != 'NA'){
      this.tableHeader = ":" + nodeData['exceptionClassName'];
      this.stackTraceHeader = "Exception: " + nodeData['exceptionClassName'];
    }
    if (nodeData['throwingClassName'] != 'NA'){
      this.tableHeader += ", Throwing Class: " + nodeData['throwingClassName'];
      this.stackTraceHeader += ", Throwing Class: " + nodeData['throwingClassName'];
    }
    if (nodeData['throwingMethodName'] != 'NA'){
      this.tableHeader += ", Throwing Method: " + nodeData['throwingMethodName'];
      this.stackTraceHeader += ", Throwing Method: " + nodeData['throwingMethodName'];
    }
   if (nodeData['URLName'] != 'NA'){
      this.tableHeader += ", BT: " + nodeData['URLName'];
      this.stackTraceHeader += ", BT: " + nodeData['URLName'];
    }
    if (nodeData['message'] && nodeData['message'] != 'NA' && nodeData['message'] != "-"){
      this.tableHeader += ", Message: " + nodeData['message'];
      // this.stackTraceHeader += ", Message: " + nodeData['message'];
    }

    if(this.tableHeader.startsWith(','))
    this.tableHeader = this.tableHeader.substring(1)

    if(this.stackTraceHeader.startsWith(','))
    this.stackTraceHeader = this.stackTraceHeader.substring(1)
    /*this.exceptionInfo.forEach((val,index) =>{
      if(nodeData['exceptionClassName']==val['exceptionClassName'] && nodeData['throwingClassName'] == val['throwingClassName'] && nodeData['throwingMethodName']== val['throwingMethodName'])
      filterAggEx.push(val)
    })
    this.filteredexceptionInfo=filterAggEx;
    
    
    this.createSplineChart(this.filteredexceptionInfo,type);

    if(filterAggEx.length > 0)
    {
       //console.log("in stack trace case");
         this.openStackTrace(filterAggEx[0]);
    }*/
  }
  createSplineChart(data, type) {
    //if(type == 1) // 1: For Group Data,  0: For Particular exception data
    data = this.exceptionInfo;

    let items: Object = {};
    var key;
    for (var k = 0; k < data.length; k++) {
      var key: any = data[k]['startTimeInMS'];
      if (!items[key]) {
        items[key] = 1;
      }
      else
        items[key] = items[key] + 1;
    }
    let outputArr = [];
    let timestamp = [];
    timestamp = Object.keys(items);
    timestamp.forEach((val, index) => {
      outputArr.push([+val, items[val]]);
    });
    outputArr.sort(function (a, b) {
      var value = a[0];
      var value1 = b[0];
      return (value > value1) ? 1 : ((value < value1) ? -1 : 0);
    });

    this.options1 = {
      chart: {
        type: 'spline',
        zoomType: 'x'
      },
      title: {
        text: 'Exceptions',
        style: { 'fontSize': '13px' }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        /*  dateTimeLabelFormats: {
                second: '%Y-%m-%d<br/>%H:%M:%S',
                minute: '%Y-%m-%d<br/>%H:%M',
                hour: '%Y-%m-%d<br/>%H:%M',
                day: '%Y<br/>%m-%d',
                week: '%Y<br/>%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },*/
        title: {
          text: 'Exception By Time'
        }
      },
      yAxis: {
        title: {
          text: 'Exception By Count'
        },
        allowDecimals: false,
        min: 0
      },
      tooltip: {
        headerFormat: '<b>{series.name}:</b>{point.x:%m/%d/%y %H:%M:%S}<br>',
        pointFormat: '<b>Count:</b> {point.y}'
      },
       time:{
    timezoneOffset:this.timeZoneOffset
    },
      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },

      series: [{
        showInLegend: false,
        name: 'StartTime',
        data: outputArr,
        //allowPointSelect: true,
        tooltip: { xDateFormat: '%d-%m-%Y %H:%M:%S', valueSuffix: '' }
      }]
    };
  }
  showAllAggData() {

    this.filteredAggregateExceptionInfo = this.aggregateExceptionInfo;
    //this.createSplineChart(this.filteredAggregateExceptionInfo,1); // Have to show group data in splieline chart in case of show all ,show passing 1
    this.aggHeaderInfo = "";
    this.showAllOption = false;
  }
  getExceptionData(nodeData) {
    this.nodeDataInfo = nodeData;
    let exParam = this.commonService.exceptionFilters;
    let commonParam = '';
    let ajaxParam = '';
    var url = '';

    if (this.limit === 0) {
      this.limit = 50;
    }
    if (this.rowChangeKey == "NA")
      this.rowChangeKey = nodeData.exceptionclassid + "_" + nodeData.throwingClassId + "_" + nodeData.throwingMethodId;

    if (this.rowChangeKey != "NA") {
      var newKey = nodeData.exceptionclassid + "_" + nodeData.throwingClassId + "_" + nodeData.throwingMethodId;

      if (this.rowChangeKey != newKey) {
        this.rowChangeKey = newKey;
        this.limit = 50;
        this.offset = 0;
      }
    }
    if (this.id.strGraphKey == "WholeScenario") {
      this.id.startTime = "NA";
      this.id.endTime = "NA";
    }

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
      //this.showDCMenu = true;;
      this.dcProtocol = this.commonService.protocol;
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
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
      console.log("URLLLLLLL", url);
    }
    if(this.commonService.enableQueryCaching == 1){
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/exceptionReport?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun;
    }
    else{
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/exceptionReport?testRun=" + this.id.testRun;
    }

    if (nodeData.Tierid && nodeData.Tierid != "NA") {
      console.log("node data case");
      commonParam += "&tierid=" + nodeData.Tierid + "&tierName=" + nodeData.TierName;
    }
    else {
      commonParam += "&tierid=" + this.id.tierid + "&tierName=" + this.id.tierName;
    }
    if (nodeData.Serverid && nodeData.Serverid != "NA") {
      commonParam += "&serverid=" + nodeData.Serverid + "&serverName=" + nodeData.ServerName;
    }
    else {
      commonParam += "&serverid=" + this.id.serverid + "&serverName=" + this.id.serverName;
    }
    if (nodeData.Appid && nodeData.Appid != "NA") {
      commonParam += "&appid=" + nodeData.Appid + "&appName=" + nodeData.AppName;
    }
    else {
      commonParam += "&appid=" + this.id.appid + "&appName=" + this.id.appName;
    }
    commonParam += "&exceptionClassId=" + nodeData.exceptionclassid + "&throwingMethodId=" +
      nodeData.throwingMethodId + "&throwingClassId=" + nodeData.throwingClassId + "&pagination= --limit " +
      this.limit + " --offset " + this.offset;

    if (this.isFilterFromSideBar) {
      if (this.commonService.isValidParamInObj(exParam, 'pubicIP') && this.commonService.isValidParamInObj(exParam, 'publicPort') && this.commonService.isValidParamInObj(exParam, 'ndeTestRun')) {
        if(this.commonService.enableQueryCaching == 1){
          url = exParam['ndeProtocol'] + "://" + exParam['pubicIP'] + ":" + exParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/exceptionReport?cacheId='+ exParam['ndeTestRun'] + '&testRun=' + exParam['ndeTestRun'];
        }
        else{
          url = exParam['ndeProtocol'] + "://" + exParam['pubicIP'] + ":" + exParam['publicPort'] + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/exceptionReport?testRun=' + exParam['ndeTestRun'];
        }

        console.log("url--", url);
      }
      commonParam = "";
      console.log("exParam.groupby--", exParam.groupby);
      let group = exParam['groupby'];

      if (group.indexOf("tier") != -1)
        commonParam = "&tierid=" + nodeData.Tierid + "&tierName=" + nodeData.tierName
      else
        commonParam = "&tierid=" + exParam.tierid + "&tierName=" + exParam.tierName

      if (group.indexOf("server") != -1)
        commonParam += "&serverid=" + nodeData.Serverid + "&serverName=" + nodeData.serverName
      else if(exParam.ServerName)
        commonParam += "&serverid=" + exParam.serverid + "&serverName=" + exParam.ServerName
      else
        commonParam += "&serverid=" + exParam.serverid + "&serverName=" + exParam.serverName
      if (group.indexOf("app") != -1)
        commonParam += "&appid=" + nodeData.Appid + "&appName=" + nodeData.appName
      else
        commonParam += "&appid=" + exParam.appid + "&appName=" + exParam.appName

      if (group.indexOf("excclass") != -1)
        commonParam += "&exceptionClassId=" + nodeData.exceptionclassid;
      else
        commonParam += "&exceptionClassId=" + exParam.excClassId;

      if (group.indexOf("excthrowingclass") != -1)
        commonParam += "&throwingClassId=" + nodeData.throwingClassId;
      else
        commonParam += "&throwingClassId=" + exParam.excThrowingClassId;

      if (group.indexOf("excthrowingmethod") != -1)
        commonParam += "&throwingMethodId=" + nodeData.throwingMethodId;
      else
        commonParam += "&throwingMethodId=" + exParam.excThrowingMethodId;

      if (group.indexOf("excmessage") != -1)
        commonParam += "&excMsgId=" + nodeData.exceptionmessageid;
      else
        commonParam += "&excMsgId=" + exParam.excMsgId;

      if (group.indexOf("exccause") != -1)
        commonParam += "&excCauseId=" + nodeData.exceptioncauseid
      else
        commonParam += "&excCauseId=" + exParam.excCauseId;

       if(group.indexOf("url")!= -1 )
      commonParam +=  "&urlIdx=" + nodeData.URLIndex

      if (group.indexOf("page") != -1)
        commonParam += "&page=" + nodeData.pageName;
      else
        commonParam += "&page=" + exParam.page;

      if (group.indexOf("session") != -1)
        commonParam += "&session=" + nodeData.sessionName;
      else
        commonParam += "&session=" + exParam.session;

      if (group.indexOf("transaction") != -1)
        commonParam += "&transaction=" + nodeData.transactionName
      else
        commonParam += "&transaction=" + exParam.transaction;

      //commonParam += "&excStackTraceName=" + exParam.excStackTraceName 

      commonParam += "&pagination= --limit " + this.limit + " --offset " + this.offset;

      ajaxParam = "&strStartTime=" + exParam['strStartTime'] + "&strEndTime=" + exParam['strEndTime'];
    }

    else if (this.commonService.fromDBtoExpFlag == true) {
      ajaxParam = "&failedQuery=1" + "&backendid=" + this.id.backendid + "&backendName=" + this.id.backendNameQuery +
        "&backendSubType=" + this.commonService.fromDBtoExpData.sqlIndex + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime;
    }
    else if (this.commonService.fromhstoExpFlag == true) {
      ajaxParam += "&flowPathInstance=" + this.hstoexData.fpInst +
        "&backendid=" + this.hstoexData.backendId + "&seqno=" + this.hstoexData.seqno + "&calloutError=true" + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime;
    }
    else if (this.commonService.seqDiagToExceptionFlag == true) {
      ajaxParam += "&flowPathInstance=" + this.seqDiagToExpData.flowpathInstance + "&strStartTime=" + this.seqDiagToExpData.startTimeInMs +
        "&strEndTime=" + this.seqDiagToExpData.endTimeInMs + "&failedQuery="+this.seqDiagToExpData.failedQuery + "&backendid=" + this.seqDiagToExpData.backendid +
        "&seqno=" + this.seqDiagToExpData.seqNo + "&backendSubType=" + this.seqDiagToExpData.backendSubType;
    }
    else {
      ajaxParam = "&flowPathInstance=" + this.id.flowPathInstance + "&failedQuery=" + this.id.failedQuery +
        "&backendid=" + this.id.backendid + "&backendName=" + this.id.backendNameQuery +
        "&backendSubType=" + this.id.backendSubType + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime;
    }
    this.finalUrlException = url + commonParam + ajaxParam + "&queryId="+this.queryId2 ;

    url = this.finalUrlException + "&showCount=false" ;
    this.isCancelQuerydata = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);

    return this.ddrRequest.getDataUsingGet(url).subscribe(
      data => { (this.doAssignExceptionValue(data)) },
      error => {
        this.loading = false;
        this.commonService.showError(error.message);
      });
  }

  getExceptionDataCount(nodeData) {
    /* console.log('*********GrapgKey', this.id.strGraphKey);
     if (this.id.strGraphKey == "WholeScenario") {
       this.id.startTime = "NA";
       this.id.endTime = "NA";
     }
     var url = '';
     
     if(this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
       url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
     }else {
       url = this.getHostUrl();
     }
      if (this.commonService.fromDBtoExpFlag == true) {
        url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/exceptionReport?testRun=" + this.id.testRun
          + "&tierName=" + this.commonService.fromDBtoExpData.tierName + "&serverName=" + this.commonService.fromDBtoExpData.serverName + "&appName=" +
          this.commonService.fromDBtoExpData.appName + "&tierid=" + this.commonService.fromDBtoExpData.tierid + "&serverid=" + this.commonService.fromDBtoExpData.serverid + "&appid=" + this.commonService.fromDBtoExpData.appid + "&strStartTime=" +
          this.id.startTime + "&strEndTime=" + this.id.endTime + "&failedQuery=1" + "&pagination= --limit " +
          this.limit + " --offset " + this.offset + "&backendid=" + this.id.backendid + "&backendName=" + this.id.backendNameQuery +
          "&backendSubType=" + this.commonService.fromDBtoExpData.sqlIndex + "&exceptionClassId=" + nodeData.exceptionclassid + "&throwingMethodId=" +
          nodeData.throwingMethodId + "&throwingClassId=" + nodeData.throwingClassId + "&templateName=Exception&showCount=true";
      } else {
       url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/exceptionReport?testRun=" +
      this.id.testRun + "&flowPathInstance=" + this.id.flowPathInstance + "&tierName=" + this.id.tierName + "&serverName=" +
       this.id.serverName + "&appName=" + this.id.appName + "&tierid=" + this.id.tierid + "&serverid=" + this.id.serverid +
        "&appid=" + this.id.appid + "&strStartTime=" + this.id.startTime + "&strEndTime=" + this.id.endTime + "&failedQuery=" +
         this.id.failedQuery + "&pagination= --limit " + this.limit + " --offset " + this.offset + "&backendid=" + this.id.backendid +
          "&backendName=" + this.id.backendNameQuery + "&backendSubType=" + this.id.backendSubType + "&exceptionClassId=" +
           nodeData.exceptionclassid + "&throwingMethodId=" + nodeData.throwingMethodId + "&throwingClassId=" + nodeData.throwingClassId +
            "&templateName=Exception&showCount=true";
      } */

    let url = this.finalUrlException + "&showCount=true";
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignExceptionCountValue(data)));
  }

  assignExceptionCountValue(res: any) {
    this.totalCount = res.totalCount;

     if(this.totalCount > 10)
     this.showPagination = true;
     else
     this.showPagination = false;

    this.paginatorArr = this.dynamicPaginator(res.totalCount);
    if (this.limit > this.totalCount)
      this.limit = Number(this.totalCount);
  }

  paginateAgg(event) {
    this.aggoffset = parseInt(event.first);

    this.agglimit = parseInt(event.rows);

    if (this.agglimit > this.totalCountEx)
      this.agglimit = Number(this.totalCountEx);

    if ((this.agglimit + this.aggoffset) > this.totalCountEx)
      this.agglimit = Number(this.totalCountEx) - Number(this.aggoffset);
this.commonService.isFilterFromSideBar = true ;
    this.getaggregatedData();
  }

  paginate(event) {
    this.offset = parseInt(event.first);

    this.limit = parseInt(event.rows);

    if (this.limit > this.totalCount)
      this.limit = Number(this.totalCount);

    if ((this.limit + this.offset) > this.totalCount)
      this.limit = Number(this.totalCount) - Number(this.offset);

    this.getExceptionData(this.nodeDataInfo);
  }

  dynamicPaginator(length: any) {
    let paginatorArr = [];

    if (length == 0)
      this.limit = 0;

    if (length >= 0 && length <= 100) {
      if (length <= 10) {
        paginatorArr = [10];
        this.rowValue = 10;
      }
      else if (length <= 20) {
        paginatorArr = [10, 20];
        this.rowValue = 20;
      }
      else if (length <= 30) {
        paginatorArr = [10, 20, 30];
        this.rowValue = 30;
      }
      else if (length <= 50) {
        paginatorArr = [10, 20, 30, 50];
        this.rowValue = 50;
      }

      else if (length <= 100) {
        paginatorArr = [10, 30, 50, 100];
        this.rowValue = 50;
      }

    }

    else if (length > 100 && length <= 400) {
      if (length <= 200) {
        paginatorArr = [10, 50, 100, 200];
        this.rowValue = 50;
      }

      else if (length <= 300) {
        paginatorArr = [10, 50, 100, 200, 300];
        this.rowValue = 50;
      }

      else if (length <= 400) {
        paginatorArr = [10, 50, 100, 200, 400];
        this.rowValue = 50;
      }
    }
    else if (length > 400) {
      paginatorArr = [10, 50, 100, 200, 400];
      this.rowValue = 50;
    }
    return paginatorArr;
  }



  getDCData() {
    let url = this.getHostUrl() + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.id.testRun;
    //this.http.get(url).map(res => res.json()).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any> res;
      console.log('COMPONENT - Exception , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data ,"data.length: ",data.length);
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
    error =>{
	 console.log("multiDC request is getting failed");  
    });
  }

  // setNDEInfoForSingleDC(){
  //   let data = [{"displayName": this.id.dcName,"ndeId": 1,"ndeIPAddr": this.id.dcIP,"ndeTomcatPort": this.id.dcPort,"ndeCtrlrName": "","pubicIP": this.id.dcIP,"publicPort": this.id.dcPort,"isCurrent": 1,"ndeTestRun":this.id.testRun,"ndeProtocol":location.protocol.replace(":","")}];
  //   return data;
  // }

  setNDEInfoForSingleDC(){
    let data;
     if(this.commonService.host)
    {
        let protocol;
        if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
            protocol = this.commonService.protocol.replace("://","");
        else
            protocol = location.protocol.replace(":","");
        
        data = [{"displayName": this.commonService.selectedDC,"ndeId": 1,"ndeIPAddr": this.commonService.host,"ndeTomcatPort": this.commonService.port,"ndeCtrlrName": "","pubicIP": this.commonService.host,"publicPort": this.commonService.port,"isCurrent": 1,"ndeTestRun":this.commonService.testRun,"ndeProtocol":protocol}];
    } else if(this.id.dcName)
        data = [{"displayName": this.id.dcName,"ndeId": 1,"ndeIPAddr": this.id.dcIP,"ndeTomcatPort": this.id.dcPort,"ndeCtrlrName": "","pubicIP": this.id.dcIP,"publicPort": this.id.dcPort,"isCurrent": 1,"ndeTestRun":this.id.testRun,"ndeProtocol":location.protocol.replace(":","")}];

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
          this.protocol = location.protocol.replace(":","");

        if (this.ndeInfoData[i].ndeTestRun)
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
    this.loader = true;
    this.getProgressBar();
    // this.getGroupedExceptionData();
    this.getaggregatedData();
  }

    getProgressBar() {
    this.progress = this._timerService.getTimerSubscription().subscribe(
      value => { this.calculateProgress(value); }
    );
  }

  calculateProgress(tick: number) {

    if (this.value < 50) {
      this.value += 3;
    } else if (this.value < 70) {
      this.value += 2;
    } else if (this.value < 99) {
      this.value += 1;
    }
      console.log("loader value------------",this.loader);
    if (this.loader == false) {
      this.progress.unsubscribe();
      this.value = 0;
    }
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
            this.commonService.fpFilters['tierName'] = tierList;
          }
        }
        console.log('tierName=====>', this.id.tierName);
        this.getTieridforTierName(this.id.tierName).then(() => { console.log("******then aaa "); resolve() });
      });
    } catch (e) {
      console.log('exception in here==============', e);
    }
  }

  // getNDEInfo(res) {
  //   this.showDCMenu = true;
  //   this.ndeInfoData = res;
  //   this.dcList = [];
  //   let dcName = this.commonService.dcNameList.split(',');
  //   for (let i = 0; i < this.ndeInfoData.length; i++) {
  //     this.dcList.push({ label: dcName[i], value: dcName[i] });
  //     if (this.commonService.selectedDC == undefined) {
  //       if (this.ndeInfoData[i].isCurrent == 1)
  //         this.selectedDC = this.ndeInfoData[i].displayName;
  //     } else {
  //       this.selectedDC = this.commonService.selectedDC;
  //     }

  //     if (this.selectedDC == this.ndeInfoData[i].displayName) {
  //       this.ndeCurrentInfo = this.ndeInfoData[i];
  //     }
  //   }
  //   this.getSelectedDC();
  // }

  getNDEInfo(res) {
    // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'Exceptions')  
	  if (this.breadcrumb && this.breadcrumb[0].label == 'Exceptions')
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
          // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
          //   url = this._ddrData.protocol + "://" + this.getHostUrl();
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
    //this.getTierNamesForDC(this.selectedDC).then(() => {
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
        console.log('commonservece variable---------->', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.loader = true;
      this.getProgressBar();
      // this.getGroupedExceptionData();
      this.getaggregatedData();
    })
  }

  getAggData(data: any) {
    this.isCancelQuerydata = true;
    this.createDynamicColumns();
    this.commonService.isFilterFromSideBar = false ;
    this.createPieChart(data);
    this.AggData = data.data;
    this.queryId1 = undefined;
    this.queryId2 = this.randomNumber();
    this.filteredAggregateExceptionInfo = this.getagginfo();
    this.aggregateExceptionInfo = this.filteredAggregateExceptionInfo;
    // console.log("getAggData---------"+ JSON.stringify(data));
    this.totalCountEx = data.totalCount;

     if(this.totalCountEx > 10)
     this.showPaginationEX = true;
     else
     this.showPaginationEX = false;

    if (this.agglimit > this.totalCountEx)
      this.agglimit = Number(this.totalCountEx);
     if(this.aggregateExceptionInfo.length >0)
    this.showDownLoadReportIcon = true;
   if(this.aggregateExceptionInfo.length == 0)
    {
    this.loader=false;
     }
     
     if (this.filteredAggregateExceptionInfo && this.filteredAggregateExceptionInfo.length !== 0) {
      this.filteredAggregateExceptionInfo.forEach((val, index) => {
        val['exceptionCount'] = this.formatter(val['exceptionCount']);
      });
    }

    this.paginatorArrEx = this.dynamicPaginatorEx(this.totalCountEx);

  }

  dynamicPaginatorEx(length: any) {
    let paginatorArrEx = [];

    if (length == 0)
      this.agglimit = 0;

    if (length >= 0 && length <= 100) {
      if (length <= 10) {
        paginatorArrEx = [10];
        this.rowValueEx = 10;
      }
      else if (length <= 20) {
        paginatorArrEx = [10, 20];
        this.rowValueEx = 20;
      }
      else if (length <= 30) {
        paginatorArrEx = [10, 20, 30];
        this.rowValueEx = 30;
      }
      else if (length <= 50) {
        paginatorArrEx = [10, 20, 30, 50];
        this.rowValueEx = 50;
      }

      else if (length <= 100) {
        paginatorArrEx = [10, 30, 50, 100];
        this.rowValueEx = 50;
      }

    }

    else if (length > 100 && length <= 400) {
      if (length <= 200) {
        paginatorArrEx = [10, 50, 100, 200];
        this.rowValueEx = 50;
      }

      else if (length <= 300) {
        paginatorArrEx = [10, 50, 100, 200, 300];
        this.rowValueEx = 50;
      }

      else if (length <= 400) {
        paginatorArrEx = [10, 50, 100, 200, 400];
        this.rowValueEx = 50;
      }
    }
    else if (length > 400) {
      paginatorArrEx = [10, 50, 100, 200, 400];
      this.rowValueEx = 50;
    }
    return paginatorArrEx;
  }

  clickHandler(event) {
    this.aggHeaderInfo = ": " + event.point.name;
    this.showAllOption = true;
    // let aggKey =[];
    // aggKey= Object.keys(this.aggregateExceptionDetail);

    //  console.log("aggregate exception ---",aggKey.length);
    // let aggregateException=[];
    //  aggKey.forEach((val,index) => {
    //  console.log("exception class ",this.aggregateExceptionDetail[val]["ExceptionClassName"].substring(this.aggregateExceptionDetail[val]['ExceptionClassName'].lastIndexOf(".")+1));
    //  if(this.aggregateExceptionDetail[val]["ExceptionClassName"].substring(this.aggregateExceptionDetail[val]['ExceptionClassName'].lastIndexOf(".")+1) == event.point.name)
    //  {
    //  console.log("aggregate exception detail-------if conditioj case");
    //  aggregateException.push(this.aggregateExceptionDetail[val]);
    //   }
    //  });

    let filteredAggExArr = [];
    for (let k = 0; k < this.chartData.length; k++) {
      if (event.point.y == this.chartData[k]['ExceptionCount']) {
        filteredAggExArr.push({ exceptionClassName: this.chartData[k]["ExceptionClassName"], throwingClassName: this.chartData[k]["ThrowingClassName"], throwingMethodName: this.chartData[k]["ThrowingMethodName"], exceptionCount: this.chartData[k]["ExceptionCount"], throwingMethodId: this.chartData[k]["exceptionthrowingmethodid"], throwingClassId: this.chartData[k]["exceptionthrowingclassid"], exceptionclassid: this.chartData[k]["exceptionclassid"], tierName: this.chartData[k]["TierName"], serverName: this.chartData[k]["ServerName"], appName: this.chartData[k]["AppName"], URLName: this.chartData[k]["URLName"], pageName: this.chartData[k]["PageName"], sessionName: this.chartData[k]["SessionName"], transactionName: this.chartData[k]["TransactionName"], message: this.chartData[k]["Message"], cause: this.chartData[k]["Cause"], exceptionmessageid: this.chartData[k]["exceptionmessageid"], Tierid: this.chartData[k]["Tierid"], Serverid: this.chartData[k]["Serverid"], Appid: this.chartData[k]["Appid"] });
        break;
      }
    }
    /*  this.aggregateExceptionInfo.forEach((val,index) =>{
               if(val['exceptionClassName'].substring(val['exceptionClassName'].lastIndexOf(".")+1) == event.point.name)
         {
                filteredAggExArr.push(val);  
         }
 
      }); */

    if (filteredAggExArr.length == 0) {
      this.stackObj = [];
      this.filteredexceptionInfo = [];
    }
    if (filteredAggExArr.length > 0)
      this.showExceptions(filteredAggExArr[0], 0); // When click on a particular exp - that exception spline chart should be generate
    // this.getAggExceptionDetail()
    this.filteredAggregateExceptionInfo = filteredAggExArr;
  }
  doAssignExceptionValue(res: any) {
    this.isCancelQuerydata = true;
    this.loading = false;
    this.ajaxLoader=false;
    this.backendObj = res.backendidandName;
    setTimeout(() => {
        this.loader = false;
      }, 500);

  //  this.ajaxLoader = false;
    this.showHeaderInfo();

    if (res.hasOwnProperty('Status')) {
      this.commonService.showError(res.Status);
    }
    // this.filteredexceptionInfo=this.exceptionInfo;

    //console.log("json aggregate",res.aggregateData);
    //this.aggregateExceptionDetail=res.aggregateData;
    //console.log("exception detail",res.aggregateData);
    this.exceptionDetail = res.data;

    if (this.exceptionDetail.length == 0)
      this.showDownLoadReportIcon = false;

    this.exceptionInfo = this.getExceptionInfo();
    this.timeZoneOffset=res.timeZoneOffset;
    //this.aggregateExceptionInfo=this.getAggExceptionDetail(res.aggregateData);
    //this.filteredAggregateExceptionInfo=this.aggregateExceptionInfo;

    //console.log("aggregate exception info",this.aggregateExceptionInfo)
    this.createSplineChart(this.exceptionInfo, 0);



  }

  getAggExceptionDetail(aggregateException: Object): Array<ExceptionInterface> {
    this.loading = false;
    //console.log("aggregate exception case------",aggregateException);
    let aggKey = [];
    aggKey = Object.keys(aggregateException);

    let aggregateException1 = [];
    aggKey.forEach((val, index) => {
      // console.log("index ",index);
      /* if(index == 0)
       {
       this.showExceptions({exceptionClassName:aggregateException[val]["ExceptionClassName"],throwingClassName:aggregateException[val]["ThrowingClassName"],throwingMethodName:aggregateException[val]["ThrowingMethodName"],exceptionCount:aggregateException[val]["ExceptionCount"]},1); // Intially when load have to show all group data for spline chart
       }*/
      //console.log("exception class ",aggregateException[val]["ExceptionCount"]);
      aggregateException1.push({ exceptionClassName: aggregateException[val]["ExceptionClassName"], throwingClassName: aggregateException[val]["ThrowingClassName"], throwingMethodName: aggregateException[val]["ThrowingMethodName"], exceptionCount: aggregateException[val]["ExceptionCount"] });
    });

    return aggregateException1;
  }

  getagginfo(): Array<ExceptionInterface> {
    var arrAggData = [];
    if (this.AggData.length == 0) {
      this.showHeaderInfo();
      this.exceptionInfo = [];
      this.stackObj = [];
      this.totalCount = 0;
      this.limit = 0;
    }

    for (var i = 0; i < this.AggData.length; i++) {
      
            arrAggData[i] = { exceptionClassName: this.AggData[i]["ExceptionClassName"], throwingClassName: this.AggData[i]["ThrowingClassName"], throwingMethodName: this.AggData[i]["ThrowingMethodName"], exceptionCount: this.AggData[i]["ExceptionCount"], throwingMethodId: this.AggData[i]["exceptionthrowingmethodid"], throwingClassId: this.AggData[i]["exceptionthrowingclassid"], exceptionclassid: this.AggData[i]["exceptionclassid"], tierName: this.AggData[i]["TierName"], serverName: this.AggData[i]["ServerName"], appName: this.AggData[i]["AppName"], URLName: this.AggData[i]["URLName"],URLIndex: this.AggData[i]["URLIndex"], pageName: this.AggData[i]["PageName"], sessionName: this.AggData[i]["SessionName"], transactionName: this.AggData[i]["TransactionName"], message: this.AggData[i]["Message"], cause: this.AggData[i]["Cause"],exceptioncauseid: this.AggData[i]["exceptioncauseid"], exceptionmessageid: this.AggData[i]["exceptionmessageid"], Tierid: this.AggData[i]["Tierid"], Serverid: this.AggData[i]["Serverid"], Appid: this.AggData[i]["Appid"] };
            if (i == 0)
              this.showExceptions({ exceptionClassName: this.AggData[i]["ExceptionClassName"], throwingClassName: this.AggData[i]["ThrowingClassName"], throwingMethodName: this.AggData[i]["ThrowingMethodName"], exceptionCount: this.AggData[i]["ExceptionCount"], throwingMethodId: this.AggData[i]["exceptionthrowingmethodid"], throwingClassId: this.AggData[i]["exceptionthrowingclassid"], exceptionclassid: this.AggData[i]["exceptionclassid"], tierName: this.AggData[i]["TierName"], serverName: this.AggData[i]["ServerName"], appName: this.AggData[i]["AppName"],URLName: this.AggData[i]["URLName"], URLIndex: this.AggData[i]["URLIndex"], pageName: this.AggData[i]["PageName"], sessionName: this.AggData[i]["SessionName"], transactionName: this.AggData[i]["TransactionName"], message: this.AggData[i]["Message"], cause: this.AggData[i]["Cause"],exceptioncauseid: this.AggData[i]["exceptioncauseid"], exceptionmessageid: this.AggData[i]["exceptionmessageid"], Tierid: this.AggData[i]["Tierid"], Serverid: this.AggData[i]["Serverid"], Appid: this.AggData[i]["Appid"] }, 0);
      
          }
      
     return arrAggData;
  }

  showHeaderInfo() {
    let excFilters = this.commonService.exceptionFilters;
    this.headerInfo = "";
    this.filterTierName = '';
    this.filterServerName = '';
    this.filterInstanceName = '';
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    this.completeGroupBy = '';
    this.filterGroupByStr = '';
    this.filterOrderByStr = '';
    this.completeOrderBy = '';
    this.downloadHeaderInfo = '';
    //this.downloadFilterCriteria='';

    let eXHeader = this.commonService.exceptionFilters;
    console.log("eXHeader --", JSON.stringify(eXHeader));
    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
      this.filterTierName = 'DC=' + this.selectedDC + ', ';
      this.downloadHeaderInfo = this.filterTierName + ', ';
    }
    else if(sessionStorage.getItem("isMultiDCMode") == "true")
          {
            let dcName = this._cavConfigService.getActiveDC();
            if(dcName == "ALL")
              dcName = this._ddrData.dcName;
             
              this.filterTierName = 'DC=' + dcName + ', ';
              this.downloadHeaderInfo = this.filterTierName + ', ';
	      if(this._ddrData.isFromtrxFlow && (!this._ddrData.isFromAgg || sessionStorage.getItem("isMultiDCMode") == "true")){
                 this.filterTierName = 'DC='+ this._ddrData.dcNameTr + ', ';
               this.downloadHeaderInfo = 'DC='+ this._ddrData.dcNameTr + ', ';
             }
          }

    if (this.commonService.isValidParamInObj(excFilters, "groupByFC")) {
      if (excFilters['groupByFC'].length > 32) {
        this.filterGroupByStr = ' GroupBy=' + excFilters['groupByFC'].substring(0, 32) + '..' + ' ,';
        this.completeGroupBy = excFilters['groupByFC'];
      }
      else
        this.filterGroupByStr = ' GroupBy=' + excFilters['groupByFC'] + ' ,';

      this.downloadHeaderInfo += ' GroupBy=' + excFilters['groupByFC'] + ' ,';
    }


    if (this.commonService.isValidParamInObj(excFilters, "orderByFC")) {
      let orderExc = excFilters['orderByFC'];
      if (orderExc.length > 40) {
        this.filterOrderByStr = ' OrderBy=' + orderExc.substring(0, 40) + ".." + ",";
        this.completeOrderBy = orderExc;
      }
      else {
        this.filterOrderByStr = ' OrderBy=' + orderExc + ",";
        this.completeOrderBy = orderExc;
      }
      this.downloadHeaderInfo += ' OrderBy=' + excFilters['orderByFC'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(excFilters, "tierName")) {
      if (excFilters['tierName'].length > 32) {
        this.filterTierName += 'Tier=' + excFilters['tierName'].substring(0, 32) + '...' + ",";
        this.completeTier = excFilters['tierName'];
      } else
        this.filterTierName += 'Tier=' + excFilters['tierName'] + ",";

      this.downloadHeaderInfo += 'Tier=' + excFilters['tierName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(excFilters, "serverName")) {
      if (excFilters['serverName'].length > 32) {
        this.filterServerName = ' Server=' + excFilters['serverName'].substring(0, 32) + '...' + ",";
        this.completeServer = excFilters['serverName'];
      } else
        this.filterServerName = ' Server=' + excFilters['serverName'] + ",";

      this.downloadHeaderInfo += ' Server=' + excFilters['serverName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(excFilters, "appName")) {
      if (excFilters['appName'].length > 32) {
        this.filterInstanceName = ' Instance=' + excFilters['appName'].substring(0, 32) + '...' + ",";
        this.completeInstance = excFilters['appName'];
      } else
        this.filterInstanceName = ' Instance=' + excFilters['appName'] + ",";

      this.downloadHeaderInfo += ' Instance=' + excFilters['appName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(excFilters, "startTimeInDateFormat")) {
      this.headerInfo += ' StartTime=' + excFilters['startTimeInDateFormat'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "endTimeInDateFormat")) {
      this.headerInfo += ' EndTime=' + excFilters['endTimeInDateFormat'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "statusCodeFC")) {
      this.headerInfo += ' Status =' + excFilters['statusCodeFC'] + ",";
    }

    if (this.commonService.isValidParamInObj(excFilters, "url")) {
      let val = excFilters['url'];
      if (val.length > 40) {
        this.URLstr = ', URL=' + val.substring(0, 40) + ".." + ",";
        this.CompleteURL = val;
      }
      else {
        this.URLstr = ', URL=' + val + ",";
        this.CompleteURL = val;
      }

      this.downloadHeaderInfo += 'URL=' + excFilters['url'] + ' ,';

    }

    if (this.commonService.isValidParamInObj(excFilters, "excepClsName")) {
      this.headerInfo += ' Exception Class=' + excFilters['excepClsName'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "excClassIdFC")) {
      this.headerInfo += ' Exception Class=' + excFilters['excClassIdFC'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "excThrowingClassIdFC")) {
      this.headerInfo += ' Throwing Class=' + excFilters['excThrowingClassIdFC'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "excThrowingMethodIdFC")) {
      this.headerInfo += ' Throwing Method=' + excFilters['excThrowingMethodIdFC'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "excCauseIdFC")) {
      this.headerInfo += ' Cause=' + excFilters['excCauseIdFC'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "excMsgIdFC")) {
      this.headerInfo += ' Exception Message=' + excFilters['excMsgIdFC'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "excStackTraceName")) {
      this.headerInfo += ' Stack Trace=' + excFilters['excStackTraceName'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "page")) {
      this.headerInfo += ' Page=' + excFilters['page'] + ",";
    }

    if (this.commonService.isValidParamInObj(excFilters, "script")) {
      this.headerInfo += ' Script=' + excFilters['script'] + ",";
    }

    if (this.commonService.isValidParamInObj(excFilters, "transaction")) {
      this.headerInfo += ' Transaction=' + excFilters['transaction'] + ",";
    }

    if (this.commonService.isValidParamInObj(excFilters, "browser")) {
      this.headerInfo += ' Browser=' + excFilters['browser'] + ",";
    }

    if (this.commonService.isValidParamInObj(excFilters, "access")) {
      this.headerInfo += ' Access=' + excFilters['access'] + ",";
    }
    if (this.commonService.isValidParamInObj(excFilters, "location")) {
      this.headerInfo += ' Location=' + excFilters['location'];
    }

    /*if (this.headerInfo.startsWith(","))
      this.headerInfo = this.headerInfo.substring(1);*/

    if (this.headerInfo.endsWith(","))
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);

    this.downloadHeaderInfo += this.headerInfo;

    if (this.downloadHeaderInfo.endsWith(","))
      this.downloadHeaderInfo = this.downloadHeaderInfo.substring(0, this.downloadHeaderInfo.length - 1);
  }

  //Object for class/Method/local varibales json data
  classDataObj: any;
  localDataObj: any;
  methodDataObj: any;
  threadLocalDataObj: any;

  //Flag to set if data not present
  showClassTableData: boolean;
  showMethodTableData: boolean;
  showLocalTableData: boolean;
  showThreadLocalTableData: boolean;

  showClassNoDataLbl: boolean;
  showMethodNoDataLbl: boolean;
  showLocalNoDataLbl: boolean;
  showThreadLocalNoDataLbl: boolean;

  //This method is responsible for getting inside object JSON
  openInsideObject(objData: any) {
    // console.log("DATA insdide object var is = ",objData);
    var fqm = objData.substring(0, objData.indexOf("("));
    var packVar = "";
    var clsVar = "";
    let url = '';

    if (fqm.indexOf(".") != -1 && fqm.indexOf("@") != -1) {
      packVar = fqm.substring(0, fqm.lastIndexOf("."));
      clsVar = fqm.substring(fqm.lastIndexOf(".") + 1, fqm.indexOf("@"));

      this.headerInsideObj = "Package : " + packVar + " , Class : " + clsVar;
    }
    else
      this.headerInsideObj = fqm;

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
      //this.showDCMenu = true;;
      this.dcProtocol = this.commonService.protocol;
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
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
      console.log("URLLLLLLL", url);
    }
    url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/getInsideObject";
    this.ajaxLoader = true;

    return this.ddrRequest.getDataUsingPost(url, encodeURIComponent(objData)).subscribe(data => (this.assignInsideObjValue(data)));
  }

  //This method is used to assign the value from JSON object
  assignInsideObjValue(obj: any) {
    this.showInsideObjPopup = true;
    this.ajaxLoader = false;
    this.insideObjVariable = obj;
    this.dataKey = Object.keys(this.insideObjVariable.data);
    this.totalIndex = this.insideObjVariable.toalIndex;
  }

  //This method is used to show the varibales and arguments for the class/local and methods
  displayVariableArgumentsPopup() {
    this.displayLocalVariable = true;
    this.classDataObj = this.variablesArgumentsInfoData["classVariables"];
    this.methodDataObj = this.variablesArgumentsInfoData["methodVariables"];
    this.localDataObj = this.variablesArgumentsInfoData["localVariables"];
    this.threadLocalDataObj = this.variablesArgumentsInfoData["threadLocalVariables"];
    this.totalThreadVars = this.threadLocalDataObj.var.length;

    if (this.classDataObj.var.length == 0) {
      this.showClassTableData = false;
      this.showClassNoDataLbl = true;
    }
    else {
      this.showClassTableData = true;
      this.showClassNoDataLbl = false;
    }

    if (this.methodDataObj.var.length == 0) {
      this.showMethodTableData = false;
      this.showMethodNoDataLbl = true;
    }
    else {
      this.showMethodTableData = true;
      this.showMethodNoDataLbl = false;
    }

    if (this.localDataObj.var.length == 0) {
      this.showLocalTableData = false;
      this.showLocalNoDataLbl = true;
    }
    else {
      this.showLocalTableData = true;
      this.showLocalNoDataLbl = false;
    }

    if (this.threadLocalDataObj.var.length == 0) {
      this.showThreadLocalTableData = false;
      this.showThreadLocalNoDataLbl = true;
    }
    else {
      this.showThreadLocalTableData = true;
      this.showThreadLocalNoDataLbl = false;
    }

  }
  // commenting due to migration
  // ngAfterViewChecked() {
  //   window["PR"].prettyPrint();
  // }

  setTestRunInHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
      this.strTitle = "Netstorm - Exceptions - Test Run : " + this.id.testRun;
    else
      this.strTitle = "Netdiagnostics Enterprise - Exceptions - Session : " + this.id.testRun;
  }

  /**
   * This method is used to open Flowpath report from advance exception report
   * @param data 
   */
  openFPReport(rowData) {
    //  //console.log("OPEN FP REPORT DATA: ",data);
    //  var url=decodeURIComponent(this.getHostUrl() + '/' + this.id.product)+"/integration.jsp?strOprName=drilldownfromED&testRun="+this.id.testRun+"&flowpathID="+data.flowPathInstance+"&tierId=" + data.tierId+"&serverId=" + data.serverId + "&appId=" + data.appId +"&tierName="+data.tierName + "&serverName=" +data.serverName+"&appName="+data.appName+"&strStartTime="+ this.id.strStartTime + "&strEndTime="+this.id.strEndTime+"&graphKey="+this.id.strGraphKey+"&openFileName=flowpath";
    //  //console.log("url -----"+url);
    //  window.open(url); //Open Flowpath report in a new tab
    let reqData = {};
    console.log("Row data is:", rowData);
    if (rowData != undefined) {
      reqData["flowPathInstance"] = rowData.flowPathInstance;
      reqData["tierId"] = rowData.tierId;
      reqData["serverId"] = rowData.serverId;
      reqData["appId"] = rowData.appId;
      reqData["tierName"] = rowData.tierName;
      reqData["serverName"] = rowData.serverName;
      reqData["appName"] = rowData.appName;
      reqData["startTime"] = this.id.startTime;
      reqData["endTime"] = this.id.endTime;

    }
    // this.commonService.removeAllComponentFromFlowpath();
    this.commonService.openFlowpath = true;
    // if (this._ddrData.splitViewFlag == false)
    //   this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.EXCEPTION;
    this.commonService.exptoFpData = reqData;
    this._ddrData.FromexpFlag = 'true';
    this._ddrData.IPByFPFlag = false;
    this.commonService.isFilterFromSideBar = false;
    if (this._router.url.indexOf('/home/ddrCopyLink') != -1) {
      this._router.navigate(['/home/ddrCopyLink/flowpath']);
    } else
      this._router.navigate(['/ddr/flowpath']);

  }
  openStackTrace(nodeData: any) {
    this.showCode = false;
    if (nodeData['message'] && nodeData['message'] != 'NA' && nodeData['message'] != "-"){
        if (nodeData['message'] && nodeData['message'] != 'NA' && nodeData['message'] != "-"){
          if(this.stackTraceHeader && this.stackTraceHeader.includes(", Message:")){
            this.stackTraceHeader = this.stackTraceHeader.substring(0,this.stackTraceHeader.indexOf(", Message:"));
          }
          this.stackTraceHeader += ", Message: " + nodeData['message'];
         }
     }
    this.stackDivWidth = 'ui-g-12';
    this.expClassName = nodeData.exceptionClassName.toString();
    this.expMethodName = nodeData.throwingMethodName.toString();
    this.expLineNo = nodeData.lineNumber.toString();
    this.stackData = "Tier:" + nodeData.tierName + ",Server:" + nodeData.serverName + ",Instance:" + nodeData.appName + ",Exception Class:" + nodeData.exceptionClassName;
    if (nodeData.stackTrace.indexOf("%7C") != -1) {
      this.stackArr = nodeData.stackTrace.split("%7C");
    }
    else {
      this.stackArr = Array(nodeData.stackTrace);
    }
    this.cls = nodeData.exceptionClassName;
    this.exClassName = this.cls.substring(this.cls.lastIndexOf('.') + 1, this.cls.length);
    this.createStackJson(this.stackArr, this.expClassName, this.expMethodName, this.expLineNo);
  }

  getSourceCode(nodeInfo,type) {
    this.stackDivWidth = 'ui-g-6';
    var fqm;
    if(type == '%40')
     fqm = nodeInfo.substring(nodeInfo.indexOf("%50") + 3, nodeInfo.indexOf("%40"));
    else
     fqm = nodeInfo.substring(0,nodeInfo.indexOf('%70')) + "." + nodeInfo.substring(nodeInfo.indexOf('%70')+3,nodeInfo.length);
    var pcm = fqm.substring(0, fqm.indexOf("(")); //com.cavisson.nsecom.localVariablesServlet.methodWithLocalVarsUCE
    var pkgCls = pcm.substring(0, pcm.lastIndexOf("."));//com.cavisson.nsecom.localVariablesServlet
    var method = pcm.substring(pcm.lastIndexOf(".") + 1, pcm.length); //Method
    var cls = pkgCls.substring(pkgCls.lastIndexOf(".") + 1, pkgCls.length);//Class
    var pac = pkgCls.substring(0, pkgCls.lastIndexOf("."));
    var fileName = fqm.substring(fqm.indexOf("(") + 1, fqm.indexOf(")"));

    this.classFileName = cls + ".rtf";
    this.classMethodFileName = cls + "_" + method + ".rtf";
    this.stackTraceHeaderInfo = " [" + cls + "." + method + "(" + fileName + ")" + "]";
    if(type == '%40'){
      var uidArr = nodeInfo.split("%4");
      var uid = uidArr[1].substring(1);
     }
    this.showCode = true;
    this.fullyQualifiedMethod = fqm;
    var secUrl = '';


    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   secUrl = this._ddrData.protocol + "://" + this.getHostUrl();
      // }
      // else
        secUrl = this.getHostUrl();

      console.log("secUrl formeddddd", secUrl);
    }
    else {
      //this.showDCMenu = true;;
      this.dcProtocol = this.commonService.protocol;
      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        secUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        secUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        secUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
      console.log("URLLLLLLL", secUrl);
    }
    let tName = this.stackData.split(",")[0].split(":")[1];
    let sName = this.stackData.split(",")[1].split(":")[1];
    let aName = this.stackData.split(",")[2].split(":")[1];
    if(this.commonService.enableQueryCaching == 1){
      secUrl += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/readMethodBody?cacheId="+ this.id.testRun + "&fqm=" + fqm + "&j_uid=" + uid + "&tierName=" + tName + "&serverName=" + sName + "&instanceName=" + aName + "&testRun=" + this.id.testRun;
    }else{
      secUrl += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/readMethodBody?&fqm=" + fqm + "&j_uid=" + uid + "&tierName=" + tName + "&serverName=" + sName + "&instanceName=" + aName + "&testRun=" + this.id.testRun;
    }
    //this.ajaxLoader = true;
    this.loader = true;
    this.getProgressBar();
    return this.ddrRequest.getDataUsingGet(secUrl).subscribe(data => (this.assignValue(data, nodeInfo)));
  }

  //Ajax call for getting value and arguments of method stacktrace
  getVariableAndArguments(stackTraceRow: any) {
    var variableArgs = '';

    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   variableArgs = this._ddrData.protocol + "://" + this.getHostUrl();
      // }
      // else
        variableArgs = this.getHostUrl();

      console.log("secUrl formeddddd", variableArgs);
    }
    else {
      //this.showDCMenu = true;;
      this.dcProtocol = this.commonService.protocol;
      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        variableArgs = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        variableArgs = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        variableArgs = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
      console.log("URLLLLLLL", variableArgs);
    }
    variableArgs += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/getVariableAndArguments";
    return this.ddrRequest.getDataUsingPost(variableArgs, stackTraceRow).subscribe(data => (this.assignValueForVariables(data)));
  }

  //Assigning the values of varibales and arguments to the local field and update
  assignValueForVariables(dataVal: any) {
    this.variablesArgumentsInfoData = dataVal;
    this.variablesArgumentsInfo = this.getVarArgsData();
    this.columns = this.getColumns();
    this.classVariables = dataVal.classVariables;
    this.localVariables = dataVal.localVariables;
    this.methodVariables = dataVal.methodVariables;

    this.totalMethodVars = dataVal.methodVariables.var.length;
    this.toalClassVars = dataVal.classVariables.var.length;
    this.totalLocalVars = dataVal.localVariables.var.length;

    console.log("Local = ", this.totalLocalVars);
    console.log("method = ", this.totalMethodVars);
    console.log("class = ", this.toalClassVars);

  }

  assignValue(dataVal: any, nodeInfo: any) {
    //this.ajaxLoader = false;
    setTimeout(() => {
      this.loader = false;
    }, 500);

    if (dataVal.methodBody.startsWith("Unable") || dataVal.methodBody.startsWith("Something") || dataVal.methodBody.startsWith("Error"))
      this.showDownloadSourceCodeIcon = false;
    else
      this.showDownloadSourceCodeIcon = true;

    let preStart = '<pre class="prettyprint lang-java">';
    let preEnd = '</pre>';
    this.methodBody = preStart + dataVal.methodBody + preEnd;
    this.newMethodBody = this.replaceAll(dataVal.methodBody, "<mark>", "");
    this.newMethodBody = this.replaceAll(this.newMethodBody, "</mark>", "");
    this.newMethodBody = this.replaceAll(this.newMethodBody, "&lt;", "<");
    this.newMethodBody = this.replaceAll(this.newMethodBody, "&gt;", ">");

    this.getVariableAndArguments(nodeInfo); //fetching varibales and arguments for that stacktrace
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
  }

  downLoadSourceCode(type: any) {
    var url;
    var codeDownloadURL;
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        codeDownloadURL = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port
      }
      else {
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        codeDownloadURL = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port
      }
    //  url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
     // codeDownloadURL = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    } else {
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC()=="ALL") {
      
      //   url = this._ddrData.protocol+"://" + this.getHostUrl();
      //   codeDownloadURL = this._ddrData.protocol+"://" + decodeURIComponent(this.getHostUrl() + '/' + this.id.product).replace("/netstorm", "").replace("/netdiagnostics", "");
      
      // }
      // else {
        url = this.getHostUrl();
        codeDownloadURL = decodeURIComponent(this.getHostUrl() + '/' + this.id.product).replace("/netstorm", "").replace("/netdiagnostics", "");
     // }
    }
    if (type == 1)// For Method Body
    {
      codeDownloadURL += "/common/" + this.classMethodFileName;
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/downLoadSourceCode?downloadFileName=" + this.classMethodFileName + "&downloadType=" + type;
      this.ddrRequest.getDataUsingGet(url).subscribe(res => this.downloadFromBackend(codeDownloadURL));
      //  window.open(codeDownloadURL);
    }
    else // For whole class file
    {
      codeDownloadURL += "/common/" + this.classFileName;
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/downLoadSourceCode?downloadFileName=" + this.classFileName + "&downloadType=" + type;
      this.ddrRequest.getDataUsingGet(url).subscribe(res => this.downloadFromBackend(codeDownloadURL));
      //  window.open(codeDownloadURL);
    }

  }
  downloadFromBackend(codeDownloadURL) {
    // console.log("after response");
    window.open(codeDownloadURL);
  }

  //set value for class/method/local variables
  getVarArgsData(): Array<VariablesArgumentsInfo> {
    var arrArgsData = [];
    for (var i = 0; i < this.variablesArgumentsInfoData["classVariables"]["type"].length; i++) {
      arrArgsData[i] = { type: this.variablesArgumentsInfoData["classVariables"]["type"][i], var: this.variablesArgumentsInfoData["classVariables"]["var"][i], value: this.variablesArgumentsInfoData["classVariables"]["value"][i] };
    }
    return arrArgsData;
  }

  getExceptionInfo(): Array<ExceptionInterface> {
    this.loading = false;
    var arrException = [];
    //console.log("exceptionDetail ===================================== ",this.exceptionDetail);
    for (var i = 0; i < this.exceptionDetail.length; i++) {
      if (i == 0) {
        this.stackTraceHeaderTooltip=`Exception Class: ${this.exceptionDetail[i]['exceptionClassName']} \nThrowing Class: ${this.exceptionDetail[i]['throwingClassName']} \nThrowing Method: ${this.exceptionDetail[i]['throwingMethodName']} \n Message: ${this.exceptionDetail[i]["message"]}`;
        this.stackData = "Tier:" + this.exceptionDetail[i]["tierName"] + ",Server:" + this.exceptionDetail[i]["serverName"] + ",Instance:" + this.exceptionDetail[i]["appName"] + ",Exception Class:" + this.exceptionDetail[i]["exceptionClassName"];
        if(this.stackTraceHeader && this.stackTraceHeader.includes(",Time =")){
          this.stackTraceHeader = this.stackTraceHeader.substring(0,this.stackTraceHeader.indexOf(",Time ="));
        }
        this.stackTraceHeader+=",Time ="+this.exceptionDetail[i]["timeStamp"]
        if (this.exceptionDetail[i]["stackTrace"].indexOf("%7C") != -1)
          this.stackArr = this.exceptionDetail[i]["stackTrace"].split("%7C");
        else
          this.stackArr = Array(this.exceptionDetail[i]["stackTrace"]);

        this.cls = this.exceptionDetail[i]["exceptionClassName"];
        this.exClassName = this.cls.substring(this.cls.lastIndexOf('.') + 1, this.cls.length);
        if (this.exceptionDetail[i]['message'] && this.exceptionDetail[i]['message'] != 'NA' && this.exceptionDetail[i]['message'] != "-"){
          if(this.stackTraceHeader && this.stackTraceHeader.includes(", Message:")){
            this.stackTraceHeader = this.stackTraceHeader.substring(0,this.stackTraceHeader.indexOf(", Message:"));
          }
          this.stackTraceHeader += ", Message: " + this.exceptionDetail[i]['message'];
         }
        this.createStackJson(this.stackArr, this.exceptionDetail[i]["exceptionClassName"], this.exceptionDetail[i]["throwingMethodName"], this.exceptionDetail[i]["lineNumber"]);
      }
      if (this.exceptionDetail[i]["backendId"] != "-" && this.backendObj != null && this.backendObj != undefined) {
        this.exceptionDetail[i]["backendId"] = this.backendObj[this.exceptionDetail[i]["backendId"]];
      }
      arrException[i] = { timeStamp: this.exceptionDetail[i]["timeStamp"], exceptionClassName: this.exceptionDetail[i]["exceptionClassName"], message: this.exceptionDetail[i]["message"], throwingClassName: this.exceptionDetail[i]["throwingClassName"], throwingMethodName: this.exceptionDetail[i]["throwingMethodName"], lineNumber: this.exceptionDetail[i]["lineNumber"], stackTrace: this.exceptionDetail[i]["stackTrace"], flowPathInstance: this.exceptionDetail[i]["flowPathInstance"], stackTraceID: this.exceptionDetail[i]["stackTraceID"], exceptionClassId: this.exceptionDetail[i]["exceptionClassId"], messageId: this.exceptionDetail[i]["messageId"], tierName: this.exceptionDetail[i]["tierName"], serverName: this.exceptionDetail[i]["serverName"], appName: this.exceptionDetail[i]["appName"], tierId: this.exceptionDetail[i]["tierId"], serverId: this.exceptionDetail[i]["serverId"], appId: this.exceptionDetail[i]["appId"], cause: this.exceptionDetail[i]["cause"], causeId: this.exceptionDetail[i]["causeId"], backendId: this.exceptionDetail[i]["backendId"], startTime: this.exceptionDetail[i]["startTime"], throwingClassId: this.exceptionDetail[i]["throwingClassId"], throwingMethodId: this.exceptionDetail[i]["throwingMethodId"], startTimeInMS: this.exceptionDetail[i]["startTimeInMS"] };
    }
    return arrException;
  }

  createStackJson(res: any[], expClassName, expMethodName, expLineNo) {
    var arr = [];
    var clsWithMethod = "-";
    var method;
    var cls;
    // console.log("expLineNo--" ,expLineNo);
    var fileName = "";
    for (var m = 0; m < res.length; m++) {
      if (res[m] == "-") {
        arr.push({ "stack": "%70No Stack Trace Found" });
      }
      else {
        if (res[m].indexOf("(") != -1) {

          var lastBracket = res[m].substring(0, res[m].indexOf("("));
          fileName = res[m].substring(res[m].indexOf("("), res[m].indexOf(")") + 1);
          // console.log("File name = "+fileName);
          method = lastBracket.substring(lastBracket.lastIndexOf(".") + 1, lastBracket.length) + fileName;
          var pc = lastBracket.substring(0, lastBracket.lastIndexOf("."));
          var packg = pc.substring(0, pc.lastIndexOf("."));
          cls = pc.substring(pc.lastIndexOf(".") + 1, pc.length);
        }

        if (res[m].indexOf('%40') == -1) {
          // this.showCode = false;
          if (cls != undefined && method != undefined)
            clsWithMethod = packg + "%70" + cls + "." + method;
        }
        else {
          //this.showCode = true;
          clsWithMethod = cls + "." + method + "%50" + res[m];
        }

        arr.push({ "stack": clsWithMethod });
      }
    }
    this.stackObj = arr;
    this.totalCountST = this.stackObj.length;
    this.paginatorArrST = this.dynamicPaginatorST(this.totalCountST);

    this.createStackTraceJSONForDownload(res);
    //Making dynamic popup header
    this.dialogHeaderName = "Exception:  " + expClassName + " , Method:  " + expMethodName;
  }

  dynamicPaginatorST(length: any) {
    let paginatorArrST = [];

    if (length == 0)
      this.limit = 0;

    if (length >= 0 && length <= 100) {
      if (length <= 10) {
        paginatorArrST = [10];
        this.rowValueST = 10;
      }
      else if (length <= 20) {
        paginatorArrST = [10, 20];
        this.rowValueST = 20;
      }
      else if (length <= 30) {
        paginatorArrST = [10, 20, 30];
        this.rowValueST = 30;
      }
      else if (length <= 50) {
        paginatorArrST = [10, 20, 30, 50];
        this.rowValueST = 50;
      }

      else if (length <= 100) {
        paginatorArrST = [10, 30, 50, 100];
        this.rowValueST = 100;
      }

    }

    else if (length > 100 && length <= 400) {
      if (length <= 200) {
        paginatorArrST = [10, 50, 100, 200];
        this.rowValueST = 200;
      }

      else if (length <= 300) {
        paginatorArrST = [10, 50, 100, 200, 300];
        this.rowValueST = 300;
      }

      else if (length <= 400) {
        paginatorArrST = [10, 50, 100, 200, 400];
        this.rowValueST = 400;
      }
    }
    else if (length > 400) {
      paginatorArrST = [10, 50, 100, 200, 400];
      this.rowValueST = 400;
    }
    return paginatorArrST;
  }

  createStackTraceJSONForDownload(res: any) {
    //console.log("v------------> " ,res);
    this.stackTraceJson = "[";
    try {
      for (var m = 0; m < res.length; m++) {
        if (res[m] != "-") {
          if (res[m].indexOf("%40") != -1)
            res[m] = res[m].substring(0, res[m].indexOf("%40"));
          //  else
          //  res[m] = res[m];
          this.stackTraceJson += '{"stackTrace":"' + res[m] + '"}';
          if (m < res.length - 1)
            this.stackTraceJson += ',';
        }
        else
          this.stackTraceJson += '{"stackTrace":"No Stack Trace Found"}';
      }
      this.stackTraceJson += ']';
    }
    catch (e) {
      console.log("Exception in createStackTraceJSONForDownload ", e);
    }
  }
  //Methods to create cloumn header 
  getColumns(): Array<Column> {
    return [
      new Column('var', 'Name'),
      // new Column('value','Value'),
      new Column('type', 'Type')
    ];
  }

  showToolTipForValueLength(type, valLength) {
    var title;
    if (valLength == undefined || type == "Integer" || type == "Boolean" || type == "Byte" || type == "Short" || type == "Long" || type == "Double") {
      title = "";
    }
    else {
      title = "Total Length: " + valLength;
    }
    return title;
  }

  createtoolTip(fqm) {
    fqm = fqm.replace("%70", ".");
    if (!fqm.startsWith(".No Stack Trace Found")) {
      var pcm = fqm.substring(0, fqm.indexOf("(")); //com.cavisson.nsecom.localVariablesServlet.methodWithLocalVarsUCE
      var pkgCls = pcm.substring(0, pcm.lastIndexOf("."));//com.cavisson.nsecom.localVariablesServlet
      var method = pcm.substring(pcm.lastIndexOf(".") + 1, pcm.length); //Method
      var cls = pkgCls.substring(pkgCls.lastIndexOf(".") + 1, pkgCls.length);//Class
      var pac = pkgCls.substring(0, pkgCls.lastIndexOf("."));
      var fileName = fqm.substring(fqm.indexOf("(") + 1, fqm.indexOf(")"));
      var fN = fileName.substring(0, fileName.indexOf(":"));
      var lineNum = fileName.substring(fileName.indexOf(":") + 1, fileName.length)

      this.toolTipText = "Package: " + pac + "\nClass: " + cls + "\nMethod: " + method + "\nFileName: " + fN + "\nLineNo: " + lineNum;
    }
    return this.toolTipText;
  }

  //This method is used to download the exception data table
  downloadReport(downloadType: string) { //console.log("this.filteredAggregateExceptionInfo--",JSON.stringify(this.filteredAggregateExceptionInfo) ); 
    let exParam = this.commonService.exceptionFilters;
    var jsonData = "[";
    let aggregateTableRenameArray = { "exceptionClassName": "Exception Class", "throwingClassName": "Throwing Class", "throwingMethodName": "Throwing Method", "exceptionCount": "Exception Count", "throwingMethodId": "throwingMethodId", "throwingClassId": "throwingClassId", "tierName": "Tier", "serverName": "Server", "appName": "Instance", "URLName": "Business Transaction", "pageName": "Page", "sessionName": "Session", "transactionName": "Transaction", "message": "Message", "cause": "Cause" };
    let exceptionTableRenameArray = { "tierName": "Tier", "serverName": "Server", "appName": "Instance","flowPathInstance":"FlowpathInstance", "timeStamp": "Time", "exceptionClassName": "Exception Class", "message": "Message", "throwingClassName": "Throwing Class", "throwingMethodName": "Throwing Method", "lineNumber": "Line No.", "cause": "Cause" ,"backendId":"Integration Point"};
    let stackTraceRenameArray = { "stackTrace": "Stack Trace" };
    if(this.aggColOrder.toString().indexOf("Exception Count") ==-1)
    this.aggColOrder.push("Exception Count");
    //  let aggColOrder=["Exception Class","Throwing Class","Throwing Method","Exception Count"];
    let expColOrder = ["Tier", "Server", "Instance","Integration Point","FlowpathInstance", "Time", "Exception Class", "Message", "Throwing Class", "Throwing Method", "Line No.", "Cause"];
    let stackTraceColOrder = ["Stack Trace"];
    this.exceptionDetail.forEach((val, index) => {
      delete val['appId'];
      delete val['tierId'];
      delete val['serverId'];
      delete val['serverid'];
      delete val['causeId'];
      delete val['stackTraceID'];
      //delete val['flowPathInstance'];
      delete val['exceptionClassId'];
      delete val['throwingClassId'];
      delete val['throwingMethodId'];
//      delete val['backendId'];
      delete val['startTimeInMS'];
      delete val['stackTrace'];
      delete val['messageId'];
    });
    this.filteredAggregateExceptionInfo.forEach((val, index) => {
      delete val['exceptionclassid'];
      delete val['exceptionmessageid'];
      delete val['exceptioncauseid'];
      delete val['StackTraceCount'];
      delete val['Tierid'];
      delete val['Serverid'];
      delete val['Appid'];
      delete val['TransactionIndex'];
      delete val['PageIndex'];
      delete val['SessionIndex'];
      delete val['URLIndex'];
      delete val['FlowPathSignature'];
      delete val['exceptionthrowingclassid'];
      delete val['_$visited'];
      delete val['throwingClassId'];
      delete val['throwingMethodId'];

      if (exParam['groupby'].indexOf('url') == -1) {
        delete val['URLName'];
      }
      if (exParam['groupby'].indexOf('tier') == -1) {
        delete val['tierName'];
      }
      if (exParam['groupby'].indexOf('server') == -1) {
        delete val['serverName'];
      }
      if (exParam['groupby'].indexOf('app') == -1) {
        delete val['appName'];
      }
      if (exParam['groupby'].indexOf('page') == -1) {
        delete val['pageName'];
      }
      if (exParam['groupby'].indexOf('session') == -1) {
        delete val['sessionName'];
      }

      if (exParam['groupby'].indexOf('transaction') == -1) {
        delete val['transactionName'];
      }
      if (exParam['groupby'].indexOf('excclass') == -1) {
        delete val['exceptionClassName'];
      }
      if (exParam['groupby'].indexOf('excthrowingclass') == -1) {
        delete val['throwingClassName'];
      }

      if (exParam['groupby'].indexOf('excthrowingmethod') == -1) {
        delete val['throwingMethodName'];
      }
      if (exParam['groupby'].indexOf('excmessage') == -1) {
        delete val['message'];
      }

      if (exParam['groupby'].indexOf('exccause') == -1) {
        delete val['cause'];
      }


    });

    // console.log("Second stringify-----"+JSON.stringify(this.exceptionDetail)); 
    console.log("First stringify-----" + JSON.stringify(this.filteredAggregateExceptionInfo));
    //console.log("Stack trace stringify-----"+JSON.stringify(this.stackTraceJson)); 
    let downloadObj: Object = {
      downloadType: downloadType,
      strSrcFileName: "advanceExpReport",
      strRptTitle: this.strTitle,
      aggData: JSON.stringify(this.filteredAggregateExceptionInfo),
      aggregateTableRenameArray: JSON.stringify(aggregateTableRenameArray),
      expData: JSON.stringify(this.exceptionDetail),
      exceptionTableRenameArray: JSON.stringify(exceptionTableRenameArray),
      stackTraceData: this.stackTraceJson,
      stackTraceRenameArray: JSON.stringify(stackTraceRenameArray),
      varFilterCriteria: this.downloadHeaderInfo,
      aggColOrder: this.aggColOrder.toString(),
      expColOrder: expColOrder.toString(),
      stackTraceColOrder: stackTraceColOrder.toString()
    }
    let downloadFileUrl = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
      downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
      downloadFileUrl = this.commonService.protocol + "://" +this.commonService.host + ':' + this.commonService.port;
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) );
    }
    downloadFileUrl += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/downloadAdvanceExpReport";
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
       (this.openDownloadReports(res)));
   else
     this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
       (this.openDownloadReports(res)));
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open( decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
  }
  sortColumnsOnCustom(event, tempData) {
    //for interger type data type
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;
    if (event["field"] == "startTime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    } else if (event["field"] == "appName") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          var v1 = a[temp];
          var v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].replace(reN, ""), 10);
            value2 = parseInt(b[temp].replace(reN, ""), 10);
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          }
        });
      } else {
        var temp = (event["field"]);
        event.order = -1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let v1 = a[temp];
          let v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].toString().replace(reN, ""), 10);
            value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          }
        });
      }
    }
    else {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.filteredAggregateExceptionInfo = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.filteredAggregateExceptionInfo = this.Immutablepush(this.filteredAggregateExceptionInfo, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  formatter(data: any) {
    if (Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }

  showHideColumnForException(data: any) {
    if (this.visibleColsForException.length === 1) {
      this.prevColumnForException = this.visibleColsForException[0];
    }
    if (this.visibleColsForException.length === 0) {
      this.visibleColsForException.push(this.prevColumnForException);
    }
    if (this.visibleColsForException.length !== 0) {
      for (let i = 0; i < this.colsForException.length; i++) {
        for (let j = 0; j < this.visibleColsForException.length; j++) {
          if (this.colsForException[i].field === this.visibleColsForException[j]) {
            this.colsForException[i].action = true;
            break;
          } else {
            this.colsForException[i].action = false;
          }
        }
      }
    }
  }

  showHideColumnForAggException(data: any) {

    if (this.visibleColsForAggException.length === 1) {
      this.prevColumnForAggException = this.visibleColsForAggException[0];
    }
    if (this.visibleColsForAggException.length === 0) {
      this.visibleColsForAggException.push(this.prevColumnForAggException);
    }
    if (this.visibleColsForAggException.length !== 0) {
      for (let i = 0; i < this.colsForAggException.length; i++) {
        for (let j = 0; j < this.visibleColsForAggException.length; j++) {

          if (this.colsForAggException[i].field === this.visibleColsForAggException[j]) {
            this.colsForAggException[i].action = true;
            break;
          } else {
            this.colsForAggException[i].action = false;
          }
        }

      }
    }

  }

  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilterForException() {
    this.isToggleColumnsExc = !this.isToggleColumnsExc;
    // if (this.isEnabledColumnFilterForException) {
    //   this.isEnabledColumnFilterForException = false;
    // } else {
    //   this.isEnabledColumnFilterForException = true;
    // }
    // this.changeColumnFilterForException();
  }

  toggleColumnFilterForAggException() {
    this.isToggleColumns = !this.isToggleColumns;
    // if (this.isEnabledColumnFilterForAggException) {
    //   this.isEnabledColumnFilterForAggException = false;
    // } else {
    //   this.isEnabledColumnFilterForAggException = true;
    // }
    // this.changeColumnFilterForAggException();
  }

  /*This method is used to Enable/Disabled Column Filter*/
  changeColumnFilterForException() {
    try {
      let tableColumns = this.colsForException;
      if (this.isEnabledColumnFilterForException) {
        this.toggleFilterTitleForException = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForException = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

  changeColumnFilterForAggException() {
    try {
      let tableColumns = this.colsForAggException;
      if (this.isEnabledColumnFilterForAggException) {
        this.toggleFilterTitleForAggException = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForAggException = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }
  showError(msg: any) {
    this.errMsg = [];
    this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }
  ngOnDestroy()
  {
    console.log("on destroy case---exception report--");
      this.sideBarException.unsubscribe();
  }

  
  randomNumber(){
    var queryId = (Math.random() * 1000000).toFixed(0);
    console.log("queryId:::::::::::::"+queryId);
     return queryId;
}
  waitQuery()
  {
    this.isCancelQuery = false;
    setTimeout(() => {
      this.openpopup();
  }, this._ddrData.guiCancelationTimeOut);
  }
  
  onCancelQuery(){
      let url = "";
      let queryId ="";
      if(this.queryId1){
        queryId =this.queryId1;
      }else{
        queryId =this.queryId2;
      }
  
     url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.id.testRun +"&queryId="+queryId;  
    console.log("Hello u got that",url);
      this.isCancelQuery = false;
       this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
    }

    openpopup(){
      if(!this.isCancelQuerydata)
      this.isCancelQuery =true;
    }
    showMessage(mssg: any) {
      this.msgs = [];
      if(mssg=="Query Saved"){
       let smsg = "Query Saved as " + this._ddrData.saveMessage;
       this.msgs.push({ severity: 'success', summary: 'Success Message', detail: smsg });
      }
      else if(mssg=="Query Already Defined")
       this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
      else
       this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    }
}

//class/method/local variables types
export interface VariablesArgumentsInfo {
  type: string;
  var: string;
  value: string;
}
export interface ExceptionInterface {
  timeStamp: string;
  exceptionClassName: string;
  message: string;
  throwingClassName: string;
  throwingMethodName: string;
  lineNumber: string;
  stackTrace: string;
  flowPathInstance: string;
  stackTraceID: string;
  exceptionClassId: string;
  messageId: string;
  tierName: string;
  serverName: string;
  appName: string;
  tierId: number;
  serverId: number;
  appId: number;
  cause: string;
  causeId: string;
  backendId: string;
  startTime: string;
  throwingClassId: string;
  throwingMethodId: string;
  startTimeInMS: string;
  exceptionCount: string;
}
