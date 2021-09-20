import { Component, OnInit, AfterViewChecked, Injectable, OnDestroy, OnChanges, ChangeDetectorRef, SimpleChange, Renderer2, ViewChild, ElementRef, Input, ViewChildren, QueryList, AfterViewInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TreeNode, Message, MenuItem, TreeTable } from 'primeng';
import { CommonServices } from '../../services/common.services';
import { WeblogicDataInterface } from '../../interfaces/weblogic-data-info';
//import 'rxjs/Rx';
// import { ChartModule } from 'angular2-highcharts';
import { Router, ActivatedRoute } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { MethodTimingInterface } from "../../interfaces/methodtiming-data-info";
import { DdrBreadcrumbService } from "../../services/ddr-breadcrumb.service";
import * as  CONSTANTS from '../../constants/breadcrumb.constants';
import { SelectItem } from '../../interfaces/selectitem';
import { Subscription } from 'rxjs';
import { TimerService } from '../../../tools/configuration/nd-config/services/timer.service';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { TableModule } from 'primeng/table';
import * as moment from 'moment';
import 'moment-timezone';
import { DDRRequestService } from '../../services/ddr-request.service';
import { HttpClient } from "@angular/common/http";
import { ConfirmationService } from 'primeng/api';
//import { MyAreaDirective } from '../../custom-directive/area-hover-directive';
//import * as jQuery from 'jquery'; 
import { timeout } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'methodcallingtree',
  templateUrl: 'methodcallingtree.component.html',
  styleUrls: ['methodcallingtree.component.scss']
})

export class MethodcallingtreeComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  //@ViewChild(MyAreaDirective)
  // private myAreaDirective : MyAreaDirective;
  methodName: any;
  timeStamp: any;
  repeatedMethodsDatapop = [];
  limit = 10;
  offset = 0;
  popCount: number;

  @Input() columnData;
  mctInfoDetail: Object[];
  id: any; //For common service object access
  startTime: string = "";
  //endTime:string="";
  filterCriteria: string = ""; //To show filter criteria
  loading: boolean = false; //Loading ajax loader icon
  showDownLoadReportIcon: boolean = true;
  showDownLoadReportIconMct: boolean = true;
  strTitle: any; //To show title in download  for method summary table
  strTitleMct: any; // To show title in download  for method timing report
  mctData: TreeNode[];
  reportHeader: string;
  columnOptions: SelectItem[];
  columnOptionsForMCT: SelectItem[];
  cols: any;
  colsForMCT: any[];
  origcolsForMCT: any[];
  dataCount: number = 0;
  visibleCols: any[];
  visibleColsForMCT: any[];
  prevColumn;
  prevColumnForMCT;
  //imagePath: any;
  //showImage: boolean = false;
  showResetBtn: boolean = false;
  methodTimingData: Array<MethodTimingInterface>;
  //sessionID: any;
  loader = false;
  value = 1;
  //errorMsg: string;
  //disableSeqDiag: boolean = true;
  //image: string;
  downloadMctData: any
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
  trStartTime: any;
  trEndTime: any;
  fpDuration: any;
  queryParams: any;
  startTimeInDateFormat: any;
  endTimeInDateFormat: any;
  //arrCoordinates=[];
  //callOutToolTipArr: any;
  //toolTipMessage: any;
  //areaHTML: any = "";
  screenHeight: any;
  toggleFilterTitle = '';
  isEnabledColumnFilter: boolean = false;
  private progress: Subscription;
  count: number = 0;
  count1: number = 0;
  filterDialog: boolean = false;
  //txtClassWidth:number = 300;
  txtThresholdWallTime: number = 1500;
  txtThresholdelapsedTime: number = 1000;
  txtFilterWallTime: number = 0;
  txtFlterMethodLevel: number = 100;
  showExpandBtn: boolean = false;
  fpInstanceInfoKeys: any[] = [];
  fpInstanceInfo: any;
  fpDetails: boolean = false;
  mctAppliedFilter: string = "";
  packageList: SelectItem[];
  classList: SelectItem[];
  methodList: SelectItem[];
  selectedPackageList: string[] = [];
  selectedClassList: string[] = [];
  selectedMethodList: string[] = [];
  uniqueMethodSignature: string[] = [];
  actualPackageList: Object[];
  actualClassList: Object[];
  actualMethodList: Object[];
  selectedActClss: string[] = [];
  selectedActMethod: string[] = [];
  msgs: Message[] = [];
  @Input('value') compareFPInfo = {};
  //for right click option on Method
  selectedFile2: TreeNode;
  menuIte: MenuItem[];
  menuIteCallOut: MenuItem[];
  menuIteMethod: MenuItem[];
  methodDetails: boolean = false;
  methodname: any;
  tiername: any;
  servername: any;
  appname: any;
  packagename: any;
  classname: any;
  percentage: any;
  starttime: any;
  walltime: any;
  cputime: any;
  argument: any;
  threadname: any;
  threadId: any;
  pagename: any;
  returnvalue: any;
  queueTime: string;
  selfTime: string;
  showAdjustDialog: boolean = false;
  showColumnMCT: boolean = true;
  isEnabledQAS: boolean = true;
  ignoreFilterCallOuts: string[] = ['T,E', 'D', 'J,j', 'e', 't', 'a,A'];
  //ignoreFilterCallOutsforSD:string[]=['T','E','D','J','e','t'];
  showAutoInstrPopUp: boolean = false;
  argsForAIDDSetting: any[];
  repeatedMethodData: any[] = [];
  repeatedMethodsData: any[];
  showRepeatedDialogue: boolean = false;
  colsForRepeatedData: any[];
  repeatedFQM: string = "";
  cOForRepeatedMethod: SelectItem[];
  vCForRepeatedmethod: string[];
  isExpandCount: boolean = false;
  txtExpandCount: number = 25;
  enableMergeCase: boolean = false;
  negativeMethodArr: string[];
  selectedNegativeMethod: string[];
  //corrInfo = [];
  //callOutFPData:any;
  //callOutFPFlag:boolean = false;
  //imagePathObj={};
  //keysArr=[];
  isEnableLevel: boolean = false;
  @ViewChild("setPaginate") setPaginate;
  list1 = [];
  list2 = [];
  showColumnReorderDialog: boolean = false;
  @ViewChild('treeRef') treeRef: ElementRef;
  @ViewChildren('diffElapsedTime') diffElapsedRef: QueryList<TreeTable>;
  @ViewChildren('asynCall') asyncCallRef: QueryList<ElementRef>;

  filterMethods: string = "0"; //Note 0 means not filtered, 1 means filtered
  childrenObj: Object = {};
  preNode: Object = {};
  substringFQM: string = "";
  MCTDialogFilters: boolean = false;
  //strCmdArgs:any;
  //imageName:any;
  values: Object[] = []
  childMCTPositionTop: number = 20;

  asyncExitMap: Object = {};
  methodDetailsHeaderName: string = "";
  showColor: boolean = false;
  selectedNode: TreeNode;
  visibleArr: boolean[] = [];
  minWidth: number = 1500;
  toggleCallout: boolean = false;
  mctHeaderNote: string = 'Note: Only instrumented methods shown in method call tree. There may be other non-instrumented methods called in between methods having parent child relationship in method call tree.';
  showPaginationRepeat: boolean = true;
  downloadRepeatMethod: [] = [];
  expandCollapseHint: string = "Show Callouts Expanded form";
  showErrorMessage: boolean = false;
  rowRepeatedMethodInfo = [];
  textAreaRepeatedMethod: any = "";
  contextMenu: boolean = false;
  breadcrumb: BreadcrumbService;

  constructor(private ddrRequest: DDRRequestService, public commonService: CommonServices, private _cavConfigService: CavConfigService,
    private _navService: CavTopPanelNavigationService, private activatedRoute: ActivatedRoute, private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService, private _router: Router, private _timerService: TimerService, private _ChangeDetectorRef: ChangeDetectorRef, private renderer: Renderer2, private httpClient: HttpClient,
    private confirmationService: ConfirmationService, breadcrumb: BreadcrumbService) {
      this.breadcrumb = breadcrumb;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    if (this._ddrData.splitViewFlag)
      this._ddrData.setInLogger("DDR::Flowpath", "Method Calling Tree", "Open Method Calling Tree");

    // this.loader = true;
    this.loading = true;
    this.value = 1;
    //  this.corrInfo = [];
    // this.keysArr = [];
    // this.imagePathObj = {};
    if (document.getElementById('maindibb') != undefined)
      document.getElementById('maindibb').scrollTop = 0;
    /* if(localStorage.getItem("ddrMCT_largedata")==='0')
     this.isEnableLevel=true;
     else
     this.isEnableLevel=false;*/
    // this.commonService.loaderForDdr = true;
    this.getProgressBar();
    this.commonService.showMethodCallingTree = true;
    //this.callOutFPFlag = false;
    this.id = this.commonService.getData();
    this.commonService.mctData = this.columnData;
    if (this.columnData != undefined) {
      this.queryParams = JSON.parse(JSON.stringify(this.columnData));
      if (this.queryParams['fpDuration'] != undefined) {
        if (this.queryParams['fpDuration'] == '< 1') {
          this.queryParams.fpDuration = 0;
          this.fpDuration = 0
        }
        else if (this.queryParams['fpDuration'].toString().includes(',')) {
          this.queryParams.fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
          this.fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
        } else {
          this.fpDuration = this.queryParams.fpDuration;
        }
      }
      this.trStartTime = this.queryParams.startTimeInMs;
      this.trEndTime = Number(this.queryParams.startTimeInMs) + Number(this.queryParams.fpDuration);
    } else {
      //  console.log("compareFPInfo", this.compareFPInfo);
      //    this.commonService.mctData['source'] = 'Flowpath compare';
      this.queryParams = this.compareFPInfo;
      /*if (Object.keys(this.compareFPInfo).length > 0) {
        this.disableSeqDiag = false;
      }*/
    }
    this.createFilterCriteria();
    this.setTestRunInHeader();
    this.toggleCallout = false;
    this.expandCollapseHint = "Show Callouts Expanded form";
    this.getMCTDataFunc();
    //this.showSeqDiag();
  }
  ngOnInit() {
    this.loading = true;
    // this.loader = true;
    // this.commonService.loaderForDdr = true;
    this.screenHeight = Number(this.commonService.screenHeight) - 120;
    if (this._ddrData.splitViewFlag == false)
      this.id = this.commonService.getData();
    /* if(localStorage.getItem("ddrMCT_largedata")==='0')
      this.isEnableLevel=true;
      else
      this.isEnableLevel=false;*/
    this.assignMCTColumns();
    if (this._router.url.indexOf('/home/ED-ddr/methodCallingTree') != -1 && this._router.url.indexOf('?') != -1) {
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.id = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      console.log(this.id, "fter getting urlParam ");
      sessionStorage.setItem('hostDcName', location.host);
      this.commonService.removeFromStorage();
      this.commonService.setParameterIntoStorage = this.id;
      this.queryParams = {};
      if (this.id.enableQueryCaching) {
        this.commonService.enableQueryCaching = this.id.enableQueryCaching;
      }
      if (this.id.flowpathInstance != undefined && this.id.flowpathInstance != '' && this.id.flowpathInstance != "NA")
        this.queryParams['flowpathInstance'] = this.id.flowpathInstance;
      if (this.id.completeURL != undefined && this.id.completeURL != '' && this.id.completeURL != "NA")
        this.queryParams['urlQueryParamStr'] = decodeURIComponent(this.id.completeURL);
      this.trStartTime = this.id.startTime;
      this.trEndTime = this.id.endTime;
    }
    if (this.commonService.mctFlag === true) {
      this.queryParams = this.commonService.mctData;
    }
    if (this.queryParams['source'] == 'Flowpath')
      this.commonService.isToLoadSideBar = true;
    else
      this.commonService.isToLoadSideBar = false;

    if (this.queryParams['source'] == 'TransactionFlowmap' && this._ddrData.splitViewFlag == false)
      this.commonService.showMethodCallingTree = false;

    else
      this.commonService.showMethodCallingTree = true;
    if (this._ddrData.splitViewFlag == false) {

      if (Object.keys(this.compareFPInfo).length == 0) {
        this.getProgressBar();
        // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.MCTREPORT);
        this.breadcrumb.add({label: 'Method Calls Details', routerLink: '/ddr/methodCallingTree'});
        //this.reportHeader = "Flowpath Details: "+this.id.testRun;
        this.createFilterCriteria();
        this.getMethodSummaryData();
        this.getMCTDataFunc();
        //this.showSeqDiag();
        this.setTestRunInHeader();
        this.createDropDownMenu();
      }
    }
    if (this.id.startTimeInDateFormat != "NA" && this.id.startTimeInDateFormat != "" && this.id.startTimeInDateFormat != undefined) {
      this.startTimeInDateFormat = this.id.startTimeInDateFormat;
    }
    if (this.id.endTimeInDateFormat != "NA" && this.id.endTimeInDateFormat != "" && this.id.endTimeInDateFormat != undefined) {
      this.endTimeInDateFormat = this.id.endTimeInDateFormat;
    }
    if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
      this.id.testrun = this.commonService.testRun;
    }

    if (this.commonService.testRun != undefined && this.commonService.testRun != null && this.commonService.testRun != '') {
      this.id.testRun = this.id.testRun;
    }


    this.cols = [
      { field: 'pN', header: 'Package', sortable: true, action: false },
      { field: 'cN', header: 'Class', sortable: true, action: false },
      { field: 'mN', header: 'Method', sortable: true, action: true },
      { field: 'fG', header: 'FunctionalGroup', sortable: true, action: false },
      { field: 'percent', header: 'Percentage', sortable: true, action: true },
      { field: 'sT', header: 'CumSelfTime(sec)', sortable: true, action: true },
      { field: 'avgST', header: 'AvgSelfTime(ms)', sortable: true, action: true },
      { field: 'totWT', header: 'CumWallTime(sec)', sortable: true, action: true },
      { field: 'avgWT', header: 'AvgWallTime(ms)', sortable: true, action: true },
      { field: 'cumCPUST', header: 'CumCpuSelfTime(sec)', sortable: true, action: true },
      { field: 'avgCPUST', header: 'AvgCpuSelfTime(ms)', sortable: 'custom', action: true },
      { field: 'eC', header: 'Count', sortable: true, action: true },
      { field: 'min', header: 'MinSelfTime(ms)', sortable: true, action: false },
      { field: 'max', header: 'MaxSelfTime(ms)', sortable: true, action: false },
      { field: 'variance', header: 'Variance', sortable: true, action: false },
      { field: 'waitTime', header: 'WaitTime(ms)', sortable: true, action: true },
      { field: 'syncTime', header: 'SyncTime(ms)', sortable: true, action: true },
      { field: 'iotime', header: 'IOTime(ms)', sortable: true, action: false },
      { field: 'suspensiontime', header: 'SuspensionTime(ms)', sortable: true, action: false }
    ];

    this.visibleCols = ['mN', 'percent', 'avgST', 'sT', 'totWT', 'avgWT', 'cumCPUST', 'avgCPUST', 'eC', 'waitTime', 'syncTime'];


    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    //window.addEventListener('scroll', this.scroll, true); //third parameter

    this.items = [

      {
        label: 'Apply To Tier', command: () => {
          this.applyToTier();
          console.log("Apply To Tier");
        }
      },
      {
        label: 'Apply to Instance of Current Tier', command: () => {
          this.applyToInstancecall();
          console.log("Apply to Instance of Current Tier");
        }
      }
    ];
  }
  ngAfterViewInit() {
    //console.log(this.diffElapsedRef.length);
    // console.log("diff elapse time-----------",this.diffElapsedRef);
    this.diffElapsedRef.changes.subscribe((value: any) => {
      value.forEach((val, index) => {
        val.nativeElement.parentElement.parentElement.style.backgroundColor = "yellow";
        //  console.log("value getting for parentElement", val.nativeElement.parentElement.parentElement.parentElement.children[1]);
        val.nativeElement.parentElement.parentElement.parentElement.children[1].style.backgroundColor = "yellow";
      })

    });

  }

  assignMCTColumns() {
    this.colsForMCT = [];

    this.colsForMCT = [
      { field: 'methodName', header: 'Methods', sortable: true, action: true, align: 'left', width: '300px' },
      // { field: 'dynLogFlag', header: 'Captured Details', sortable: false, action: true, align: 'left', width: '40px' },
      { field: 'api', header: 'API', sortable: false, action: false, align: 'left', width: '40px' },
      { field: 'timeStamp', header: 'ElapsedTime(ms)', sortable: false, action: true, align: 'right', width: '80px' }];

    this.colsForMCT.push({ field: 'wallTime', header: 'WallTime(ms)', sortable: false, action: true, align: 'right', width: '70px' });
    this.colsForMCT.push({ field: 'percentage', header: 'Percentage', sortable: false, action: true, align: 'right', width: '60px' });
    this.colsForMCT.push({ field: 'cpuTime', header: 'CPUTime(ms)', sortable: false, action: true, align: 'right', width: '70px' });
    if (this.isEnabledQAS) {
      this.colsForMCT.push({ field: 'queueTime', header: 'ThreadQueueTime(ms)', sortable: false, action: true, align: 'right', width: '100px' });
      this.colsForMCT.push({ field: 'selfTime', header: 'SelfTime(ms)', sortable: false, action: true, align: 'right', width: '70px' });
    }
    this.colsForMCT.push({ field: 'waitTime', header: 'WaitTime(ms)', sortable: false, action: false, align: 'right', width: '40px' });
    this.colsForMCT.push({ field: 'syncTime', header: 'SyncTime(ms)', sortable: false, action: false, align: 'right', width: '40px' });
    this.colsForMCT.push({ field: 'ioTime', header: 'IOTime(ms)', sortable: false, action: false, align: 'right', width: '40px' });
    this.colsForMCT.push({ field: 'suspensionTime', header: 'SuspensionTime(ms)', sortable: false, action: false, align: 'right', width: '40px' });
    this.colsForMCT.push({ field: 'sourceNetwork', header: 'Network Delay in Req(ms)', sortable: false, action: false, align: 'right', width: '40px' });
    this.colsForMCT.push({ field: 'destNetwork', header: 'Network Delay in Resp(ms)', sortable: false, action: false, align: 'right', width: '40px' });
    this.colsForMCT.push({ field: 'threadId', header: 'ThreadId', sortable: false, action: true, align: 'right', width: '50px' });
    this.colsForMCT.push({ field: 'threadName', header: 'Thread', sortable: false, action: true, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'methodArgument', header: 'Arguments', sortable: false, action: true, align: 'left', width: '60px' });
    this.colsForMCT.push({ field: 'instanceType', header: 'InstanceType', sortable: false, action: false, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'appName', header: 'Instance', sortable: false, action: true, align: 'left', width: '50px' });
    this.colsForMCT.push({ field: 'tierName', header: 'Tier', sortable: false, action: false, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'serverName', header: 'Server', sortable: false, action: false, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'className', header: 'Class', sortable: false, action: true, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'pacName', header: 'Package', sortable: false, action: false, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'pageName', header: 'PageName', sortable: false, action: false, align: 'left', width: '40px' });
    this.colsForMCT.push({ field: 'asyncCall', header: 'Async_call', sortable: false, action: false, align: 'left', width: '45px' });
    this.colsForMCT.push({ field: 'dynLogFlag', header: 'Captured Details', sortable: false, action: true, align: 'left', width: '80px' });
    this.colsForMCT.push({ field: 'lineNumber', header: 'S.N.', sortable: true, action: true, align: 'right', width: '30px' });
    this.origcolsForMCT = JSON.parse(JSON.stringify(this.colsForMCT));

    this.visibleColsForMCT = ['methodName', 'dynLogFlag', 'lineNumber', 'methodArgument', 'threadName', 'threadId', 'appName', 'className', 'startTime', 'wallTime', 'cpuTime', 'percentage', 'timeStamp', 'queueTime', 'selfTime'];
    //this.showHideColumnForMCT({});
    this.columnOptionsForMCT = [];
    for (let i = 0; i < this.colsForMCT.length; i++) {
      if (this.colsForMCT[i].field != "methodName") {
        if (this.colsForMCT[i].action)
          this.list1.push(this.colsForMCT[i]);
        if ((this.colsForMCT[i].field == "queueTime" || this.colsForMCT[i].field == "selfTime") && this.isEnabledQAS)
          this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
        else if (this.colsForMCT[i].field != "queueTime" && this.colsForMCT[i].field != "selfTime")
          this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
      }
    }
    // console.log("list1 value------",this.list1);  
  }
  /*scroll = (): void => {
    let referer: ElementRef = this.treeRef['el'];
    var elm = document.getElementById("maindibb");
    let scrollTop = elm.scrollTop;
    var translate = "translate(0," + scrollTop + "px)";
    this.renderer.setStyle(referer.nativeElement.querySelector('thead'), 'transform', translate);
  }*/
  showCustomHeaders: boolean = false;
  header
  getMCTDataFunc() {
    // console.log(this.queryParams);
    this.trStartTime = this.queryParams['startTimeInMs'];
    if (this.queryParams['fpDuration'] != undefined) {
      if (this.queryParams['fpDuration'] == '< 1')
        this.fpDuration = 0;
      else if (this.queryParams['fpDuration'].toString().includes(','))
        this.fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
      else
        this.fpDuration = this.queryParams.fpDuration;
    }
    //this.assignColsForMCT();

    this.menuIte = [
      { label: 'Method Details', icon: 'icons8 icons8-info', command: (event) => this.viewMethodDetail(this.selectedNode) },
    ];
    this.menuIteCallOut = [
      { label: 'Method Details', icon: 'icons8 icons8-info', command: (event) => this.viewMethodDetail(this.selectedNode) },
    ];
    this.menuIteMethod = [
      { label: 'Method Details', icon: 'icons8 icons8-info', command: (event) => this.viewMethodDetail(this.selectedNode) },
    ];

    if (this._ddrData.enableViewSourceCode !== 1 || this._ddrData.enableViewSourceCode !== 0) {
      this.checkValue();
    }
    else if (this._ddrData.enableViewSourceCode === 1) {
      this.menuIte.push(
        { label: 'View Source Code', icon: 'icons8 icons8-info', command: (event) => this.viewSourceCode(this.selectedNode) }
      );
      this.menuIteMethod.push(
        { label: 'View Source Code', icon: 'icons8 icons8-info', command: (event) => this.viewSourceCode(this.selectedNode) }
      );
    }


    /*this.visibleColsForMCT = ['methodName','lineNumber','methodArgument','threadName','threadId','appName','className','startTime','wallTime','cpuTime','percentage'];
     
    if(this.isEnabledQAS)
    this.visibleColsForMCT.push(['queueTime','selfTime']);
 
    this.columnOptionsForMCT = [];
    for (let i = 0; i < this.colsForMCT.length; i++) {
      if (this.colsForMCT[i].field != 'methodName') {
        this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
      }
    }*/


    this.getMCTData().subscribe(res => {
      let mctData = <any>res;
      this.loader = false;
      this.loading = false;
      // this.commonService.loaderForDdr = false;
      this.mctData = mctData.treedata.data;
      this.downloadMctData = mctData.data;
      this.uniqueMethodSignature = mctData.uniqueMethods;
      this.repeatedMethodData[0] = mctData.repeatMethodsData;
      this.asyncExitMap = mctData.asynCallMap;
      this.addPackageClassmethodList();
      let fpMap = new Map();
      fpMap = mctData.fpsInfo;
      this.queueTime = mctData.totalQueueTime;
      this.selfTime = mctData.totalSelfTime;
      this.mctAppliedFilter = "(Max Depth=" + this.formatter(this.txtFlterMethodLevel) + ", Min Wall Time =" + this.formatter(this.txtFilterWallTime) + "ms, Threshold =" + this.formatter(this.txtThresholdWallTime) + "ms" + ", Elapsed Threshold=" + this.formatter(this.txtThresholdelapsedTime);
      if (this.isEnabledQAS) {
        this.mctAppliedFilter += " ,Total Thread Queue Time=" + this.formatter(this.queueTime) + "ms";
        this.mctAppliedFilter += " ,Total Self Time=" + this.formatter(this.selfTime) + "ms";
      }
      this.mctAppliedFilter += ")";

      this.fpInstanceInfoKeys = Object.keys(fpMap);
      this.fpInstanceInfo = fpMap;

      if (this.downloadMctData.length == 0)
        this.showDownLoadReportIconMct = false;
      else
        this.showDownLoadReportIconMct = true;

      this.mctData.forEach((val, index) => {
        if (index == 0) {
          let node = this.mctData[index];
          this.expandChildren(node);
          this.count = 0;
        }
      });
      this.mctData = [...mctData];
      setTimeout(() => {
        this.loader = false;
      }, 300);
    });
  }
  checkValue() {

    let url = this.getHostUrl();
    url += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/webddr/enableViewSourceCode';
    this.ddrRequest.getDataUsingGet(url).subscribe((data) => {
      this._ddrData.enableViewSourceCode = data
      if (this._ddrData.enableViewSourceCode === 1) {
        this.menuIte.push(
          { label: 'View Source Code', icon: 'icons8 icons8-info', command: (event) => this.commonModuleCall(this.selectedNode) }
        );
        this.menuIteMethod.push(
          { label: 'View Source Code', icon: 'icons8 icons8-info', command: (event) => this.commonModuleCall(this.selectedNode) }
        );
      }
    })


  }
  // Started dynamic logging code 

  // variables used For Enhancement 92031
  MethodArrDropDown = [];
  value1: any;
  checked: boolean = false;
  columnOptionsFORPOP: SelectItem[];
  lines: any[];
  popuData: any; //source COde json
  viewSourceCodeHeader: string;
  // variableselection: string;
  viewSourceCodeFlag: boolean;
  showDownloadSourceCodeIcon: boolean;
  selectedMethod1 = "";
  returnMethod = "";
  customLog = "";
  inpValue = "";
  inpValueArray = [];
  inpValue1 = "";
  inpValueArray1 = [];
  LineNumber = [];
  myLineHead: any;
  captureVariables = [];
  selectedIndex: any;
  actualTrackPoint = [];
  viewPopHeader: any;
  section: any;
  text1 = "";
  selectionflag: boolean;
  occurences = [];
  stackTrace = [];
  dynamicLogs = [];
  tempTrace: any;
  occurence: any;
  selectedOccurence: any;
  items: MenuItem[];
  selectedLine: any;
  trackPointData: TrackPointConfig[];
  selectedTrackData: TrackPointConfig;
  openEditDialog: boolean;
  fileName: any;
  showDynLoggingPopUp: boolean = false;
  jsonData: any;
  dynTierName = "";
  dynServerName = "";
  dynAppName = "";
  dynFqc: any;
  dynFqm: any;
  confirmationPopup: boolean = false;
  popupMsg: any;
  isFromApplyToInstance: boolean = false;
  dlMessg = "";

  profileDetail: ProfileData;
  profileListItem: SelectItem[];

  selectedInstance: any;
  InstanceArrDropDown: SelectItem[];
  displayNewProfile: boolean = false;
  argsForDynamicLogging: any[];
  ShowCommonDLModule: boolean = false;
  dynEntrySeqNum: any;
  dynFpInstance: any;
  openDLDialogFromButton: boolean = false;
  FQCforDL: any;
  // End 92301
  commonModuleCall(rowData) {
    console.log("this.commonModuleCall*******", rowData);
    this.dynFqm = rowData.fqm || rowData.data.fqm;   //to support both cases form DL icon as well as from right click menu
    this.dynTierName = rowData.tierName || rowData.data.tierName;
    this.dynServerName = rowData.serverName || rowData.data.serverName;
    this.dynAppName = rowData.appName || rowData.data.appName;
    this.dynEntrySeqNum = rowData.entrySeqNum || rowData.data.entrySeqNum;
    this.dynFpInstance = this.fpInstanceInfo[this.fpInstanceInfoKeys[0]][0];

    this.argsForDynamicLogging = [this.dynTierName, this.dynServerName, this.dynAppName, this.dynFqm, this.id.product, this.id.testRun, this.dynEntrySeqNum, this.dynFpInstance, "0"]
    this.ShowCommonDLModule = true;

  }
  closeDynamicLogging(isCloseDLDialog) {
    this.ShowCommonDLModule = isCloseDLDialog;

  }


  viewSourceCode(node) {
    console.log("this.fpInstanceInfo********", this.fpInstanceInfo[this.fpInstanceInfoKeys[0]], "------------**************node in view source***", node)
    this.viewSourceCodeHeader = "Source Code";
    this.viewSourceCodeFlag = true;
    // this.showDynLoggingPopUp =true
    this.jsonData = node;
    //this.viewPopHeader = [];

    //this.viewPopHeader = node.fqm ||node.data.fqm;
    let fqmtemp = node.fqm || node.data.fqm;   //to support both cases form DL icon as well as from right click menu
    this.dynFqm = fqmtemp;
    this.dynTierName = node.tierName || node.data.tierName;
    this.dynServerName = node.serverName || node.data.serverName;
    this.dynAppName = node.appName || node.data.appName;
    this.dynFqc = fqmtemp.substring(0, fqmtemp.lastIndexOf("."));
    console.log("The value inisde the tier is ..", this.id.testRun);
    console.log("The value iniside the server name is....", this.dynServerName);
    console.log("The value inside the instance name is ...", this.dynAppName);
    console.log("The value inside the tierNAme is ....", this.dynTierName);
    console.log("The value inside the dynFqc is ....", this.dynFqc);
    this.getServerApp();
    let url = this.getHostUrl();
    url += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/readSourceCode?&fqm=' + fqmtemp + "&tierName=" + this.dynTierName + "&serverName=" + this.dynServerName + "&instanceName=" + this.dynAppName;
    // let url = "http://10.10.40.3:8005/netdiagnostics/v1/cavisson/netdiagnostics/ddr/readSourceCode?&fqm=com.cavisson.nsecom.ExceptionConditions.normalException(ExceptionConditions.java:134)&tierName=TOmcat8&serverName=localhost&instanceName=Instance1&testRun=1055";
    this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignValue(data, node)));
  }
  assignValue(dataVal: any, nodeInfo: any) {
    let entrySeqNumTemp = nodeInfo.entrySeqNum || nodeInfo.data.entrySeqNum; //to support both cases form DL icon as well as from right click menu
    if (!entrySeqNumTemp) {
      entrySeqNumTemp = "";
    }
    let url = this.getHostUrl() + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/webddr/actualTrackPoints?testRun=' + this.id.testRun + "&fpInstance=" + this.fpInstanceInfo[this.fpInstanceInfoKeys[0]][0] + "&methSeqNo=" + entrySeqNumTemp;
    //  let url = "http://10.10.50.15:8001/netdiagnostics/v1/cavisson/netdiagnostics/webddr/actualTrackPoints?testRun=4814&fpInstance=281474980840968&methSeqNo=13";
    this.ddrRequest.getDataUsingGet(url).subscribe(data => {
      let jsondata_url = this.getHostUrl();
      jsondata_url += '/configUI/custom/dl/getTraceDetails/' + this.id.testRun + '/' + this.dynTierName + '/' + this.dynServerName + '/' + this.dynAppName + '?fqc=' + this.dynFqc;
      console.log("the value inside the jsondata_url is", jsondata_url);
      console.log("the value inside the dataval is", dataVal);

      // let jsondata_url = "https://10.10.50.16/configUI/custom/dl/getTraceDetails/2644/T1/S2/I3?fqc=com.mkyong.controller.MyClass"; 
      this.httpClient.get(jsondata_url).subscribe(data1 => {
        this.LineNumber = [];
        this.captureVariables = [];
        this.dynamicLogs = [];
        this.stackTrace = [];
        this.occurences = [];
        this.occurence = [];
        this.fileName = dataVal.fileName;
        this.actualTrackPoint = <any>data;
        this.trackPointData = <TrackPointConfig[]>data1;
        this.popuData = dataVal.data;
        this.myLineHead = dataVal.fileName;
        for (let i = 0; i < this.trackPointData.length; i++) {
          if (Number(this.trackPointData[i].lno) != 0) {
            this.LineNumber.push(dataVal.fileName + "/linenumber:" + this.trackPointData[i].lno);
          }
          if (this.actualTrackPoint[i] && this.actualTrackPoint[i].occurences) {
            this.occurences = this.actualTrackPoint[i].occurences;
            for (let j = 0; j < this.occurences.length; j++) {
              let value = this.occurences[j]['occuerenceID']
              //this.occurence.push({ "label": value, "value": value });
              this.occurence.push({ "occuerenceID": value, "timestamp": this.occurences[j].timestamp });
              for (let k = 0; k < this.occurences[j].capturedVariables.length; k++) {
                if (this.occurences[j].capturedVariables[k] != []) {
                  this.occurences[j].capturedVariables[k]['timestamp'] = this.occurences[j].timestamp;
                  this.captureVariables.push(this.occurences[j].capturedVariables[k]);
                }
              }
              if (this.occurences[j].StackTrace[j] && this.occurences[j].StackTrace[j] != []) {
                this.tempTrace = this.occurences[j].StackTrace[j]['content'].replaceAll(":", "\n");
                this.stackTrace.push(this.tempTrace);
              }
              if (this.occurences[j].dynamicLogs[j] && this.occurences[j].dynamicLogs != []) {
                this.occurences[j].dynamicLogs[j]['timestamp'] = this.occurences[j].timestamp;
                this.dynamicLogs.push(this.occurences[j].dynamicLogs[j]);
              }
            }
          }
          for (let k = 0; k < this.popuData.length; k++) {
            if (Number(this.popuData[k].lineNumber) != 0) {
              if (Number(this.popuData[k].lineNumber) === this.trackPointData[i].lno) {
                this.popuData[k]["breakPoint"] = i + 1;
                //this.popuData[k]["color"] = "#CFD8DC";
                console.log("The vakue inside the break point is ....", this.popuData[k]["breakPoint"]);
              }
            }
          }


        }
        console.log("The value inside the dynamciLOgs whole data is ........", this.dynamicLogs);
        this.lines = []
        this.lines = [
          { field: 'lineNumber' },
          { field: 'breakPoint' },
          { field: 'code' }
        ];

        this.columnOptionsFORPOP = [];
        for (let i = 0; i < this.lines.length; i++) {
          this.columnOptionsFORPOP.push({ label: this.lines[i].header, value: this.lines[i].field });
        }
      });
    });
  }
  oldTrackPointConfig: TrackPointConfig;
  newTrackPointConfig: TrackPointConfig;
  onCancel() {
    // this.inpValueArray = [];
    // this.inpValueArray1 = [];
    // this.selectedTrackData = {}; 
    this.selectedTrackData = this.oldTrackPointConfig;
    console.log("on cancel call ");
    console.log(" track point array is ", this.trackPointData);
    console.log("selected track point ", this.selectedTrackData);
    console.log(" old trackpoint  ", this.oldTrackPointConfig)
    var index = this.trackPointData.findIndex(item => item.id === this.selectedTrackData.id);
    this.trackPointData.splice(index, 1, this.oldTrackPointConfig);

    console.log("after slices track point array is ", this.trackPointData, index);

    this.openEditDialog = false;
  }
  onSave() {
    console.log(" Data save successfully ");
    console.log("on save  call ");
    console.log(" track point array is ", this.trackPointData);
    console.log("selected track point ", this.selectedTrackData);
    console.log(" old trackpoint  ", this.oldTrackPointConfig);
    this.openEditDialog = false;
    if (this.addNewTrackPoint) {
      if (!this.selectedTrackData.fqm || this.selectedTrackData.fqm.length == 0)
        this.selectedTrackData.fqm = this.dynFqm;
      this.trackPointData.push(this.selectedTrackData);
      this.LineNumber.push(this.fileName + "/linenumber:" + this.selectedTrackData.lno);
      console.log("new addaed trancpoint data ", this.trackPointData);
      // for(let i =0 ; i< this.trackPointData.length; i++){
    }
    else {
      for (let i = 0; i < this.LineNumber.length; i++) {
        if (Number(this.LineNumber[i].split(":")[1]) == this.selectedTrackData.lno) {
          break;
        }
        else if (i == this.LineNumber.length - 1) {
          this.LineNumber.push(this.fileName + "/linenumber:" + this.selectedTrackData.lno);
        }
      }
    }
    for (let k = 0; k < this.popuData.length; k++) {
      if (Number(this.popuData[k].lineNumber) === Number(this.selectedTrackData.lno)) {
        this.popuData[k]["breakPoint"] = this.selectedTrackData.lno;
        //this.popuData[k]["color"] = "#CFD8DC";
        console.log("The vakue inside the break point is ....", this.popuData[k]["breakPoint"]);
      }
    }
    this.inpValueArray = [];
    //}
  }
  openClickedTrackPoint(colObj) {

    console.log("Line details for click track point", colObj);
    console.log("open click trackpoint calll ");
    console.log(" track point array is ", this.trackPointData);
    console.log("selected track point ", this.selectedTrackData);
    console.log(" old trackpoint  ", this.oldTrackPointConfig)
    //this.viewSourceCodeFlag = false;
    //let jsondata_url = "assets/mock_data.json"; 
    //this.variableselection = "Variable Selection";
    //this.createDropdownList();
    this.checked = true;
    this.createjsonInfo(colObj.lineNumber)
    //this.httpClient.get(jsondata_url).subscribe(data => (this.createjsonInfo(data,colObj.lineNumber)));
  }

  addNewTrackPoint: Boolean;
  resetTrackPoint(trackPoint) {

    trackPoint.id = 0;
    trackPoint.lno = 0;
    trackPoint.traceAll = false;
    trackPoint.traceAllArgs = false;
    trackPoint.traceRetVal = false;
    trackPoint.traceAllClsFlds = false;
    trackPoint.traceAllLclVars = false;
    trackPoint.localVarList = "";
    trackPoint.classFldList = "";
    trackPoint.message = "";
    trackPoint.fqm = "";
    trackPoint.hitLimit = 1;
    return trackPoint;
  }
  createjsonInfo(lineNumber) {
    let tkFlag = false;
    this.selectedTrackData = <TrackPointConfig>{};
    this.selectedTrackData = this.resetTrackPoint(this.selectedTrackData);
    //console.log("The value inside the json data is ........",data);
    //this.trackPointData = data;
    for (let i = 0; i < this.trackPointData.length; i++) {
      if (Number(this.trackPointData[i].lno) === Number(lineNumber)) {
        this.selectedTrackData = this.trackPointData[i];
        this.addNewTrackPoint = false;
        tkFlag = true;
        break;
      }
    }
    this.oldTrackPointConfig = JSON.parse(JSON.stringify(this.selectedTrackData));
    if (!tkFlag) {
      //this.selectedTrackData ={};
      this.addNewTrackPoint = true;
      console.log(" new case track ")
      this.selectedTrackData['lno'] = lineNumber;
    }
    console.log("the value inside the lineNumber is ....###..", lineNumber);
    this.viewPopHeader = [];
    this.viewPopHeader = lineNumber;
    if (lineNumber != 0) {
      this.openEditDialog = true;
    }
    else
      console.log("We cant edit for lineNumber number ", lineNumber);
  }

  selectOccurence() {
    console.log("hi.......");
  }

  clickEvent1() {
    this.section = this.section;
  }

  getCaptureVariable(line, id) {
    this.captureVariables = [];
    this.occurences = [];
    this.stackTrace = [];
    this.dynamicLogs = [];
    this.selectedOccurence = id;
    for (let i = 0; i < this.actualTrackPoint.length; i++) {
      if (this.actualTrackPoint[i].LineNumber == line) {
        this.occurences = this.actualTrackPoint[i].occurences;
        for (let j = 0; j < this.occurences.length; j++) {
          if (id === this.occurences[j]['occuerenceID']) {
            for (let k = 0; k < this.occurences[j].capturedVariables.length; k++) {
              if (this.occurences[j].capturedVariables[k] != []) {
                this.occurences[j].capturedVariables[k]['timestamp'] = this.occurences[j].timestamp;
                this.captureVariables.push(this.occurences[j].capturedVariables[k]);
              }
            }
            if (this.occurences[j].StackTrace[j] && this.occurences[j].StackTrace != []) {
              this.tempTrace = this.occurences[j].StackTrace[j]['content'].replaceAll(":", "\n");
              this.stackTrace.push(this.tempTrace);
            }
            if (this.occurences[j].dynamicLogs[j] && this.occurences[j].dynamicLogs != []) {
              this.occurences[j].dynamicLogs[j]['timestamp'] = this.occurences[j].timestamp;
              this.dynamicLogs.push(this.occurences[j].dynamicLogs[j]);
            }
            break;
          }
        }
      }
    }
  }
  getTraceDetails() {
    console.log("The value inside the data...", this.trackPointData);
    console.log("The value inside the selectedTrackPoint is ...", this.selectedTrackData);
    let url = this.getHostUrl();
    url += '/configUI/custom/dl/addTrackPoint?';
    console.log("the value inside the getTraceDetails url is", url);
    // let url = "https://10.10.50.16/configUI/custom/dl/addTrackPoint?";
    let dataObj: Object = {
      dlDtoList: this.trackPointData,
      tier: this.dynTierName,
      server: this.dynServerName,
      instance: this.dynAppName,
      tr: this.id.testRun,
      fqc: this.dynFqc,
      profName: this.profileDetail.profileName,
      copyProfName: this.profileDetail.selectedProfile,
      profDesc: this.profileDetail.profileDesc
    }
    console.log("the values of the corresponding ", dataObj);
    this.ddrRequest.getDataInStringUsingPost(url, dataObj).subscribe(data => this.getTrackPointData(data));

    this.displayNewProfile = false;
  }

  getProfileData() {
    let url = this.getHostUrl();
    url += '/configUI/custom/dl/getProfileListAndAppliedProfile/' + this.id.testRun + '/' + this.dynTierName + '/' + this.dynServerName + '/' + this.dynAppName + '/instance';
    console.log("the value inside the getProfileList url is", url);
    this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignProfileData(data)));
  }
  assignProfileData(profileData) {
    console.log("inside this we got profiledata", profileData)
    this.profileDetail = profileData;
    this.profileList(this.profileDetail.profList);
    this.popupMsg = this.profileDetail.msg[0];
    this.confirmationPopup = true;
    // this.displayNewProfile =true;  
  }

  getServerApp() {
    let url = this.getHostUrl() + '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/webddr/getServerInstance?testRun=' + this.id.testRun + "&tier=" + this.dynTierName;
    console.log("the value inside the getServerApp url is", url);
    this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.serverApplist(data)));
  }
  serverApplist(data) {
    console.log("inside this we got data", data)
    this.InstanceArrDropDown = [];
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let sAppName = data[keys[i]];     //serverName:InstanceName
      this.InstanceArrDropDown.push({ label: sAppName, value: sAppName });
    }
    console.log("this.InstanceArrDropDown=======", this.InstanceArrDropDown)
  }

  profileList(res) {
    this.profileListItem = [];
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let pName = res[keys[i]];     //ProfileName
      this.profileListItem.push({ label: pName, value: pName });
    }
    console.log("this.profileListItem=======", this.profileListItem)
  }

  saveNewProfile() {
    //to check if profile name already exists
    for (let i = 0; i < this.profileDetail.profList.length; i++) {
      if (this.profileDetail.profList[i] == this.profileDetail.profileName) {
        this.commonService.showError("Profile name already exist");
        return;
      }
    }
    console.log("this.profileDetail.selectedProfile=======", this.profileDetail.selectedProfile)
    console.log("this.profileDetail.profDesc=======", this.profileDetail.profileDesc)
    console.log("this.profileDetail.profileName=======", this.profileDetail.profileName)
    this.getTraceDetails();
    this.isFromApplyToInstance = false;
  }
  addNewProfile() {
    this.displayNewProfile = true;
    this.confirmationPopup = false;
  }
  closeConfirmation() {
    console.log("this.profileDetail.selectedProfile=======", this.profileDetail.selectedProfile)
    console.log("this.profileDetail.profDesc=======", this.profileDetail.profileDesc)
    console.log("this.profileDetail.profileName=======", this.profileDetail.profileName)
    this.profileDetail.selectedProfile = null;
    this.profileDetail.profileDesc = null;
    this.profileDetail.profileName = this.profileDetail.profile[0];
    this.getTraceDetails();
    this.confirmationPopup = false;
    this.isFromApplyToInstance = false;
  }

  applyToTier() {
    this.dynServerName = null;
    this.dynAppName = null;
    this.getProfileData();
    this.isFromApplyToInstance = false;

    console.log("Apply To Tier");
  }

  selectInstance() {
    console.log("Apply To Instance this.selectedInstance on select .......... ", this.selectedInstance);
    if (this.selectedInstance || this.selectedInstance != null || this.selectedInstance != "undefined" || this.selectedInstance != undefined) {
      let tempArr = this.selectedInstance.split(":");
      this.dynServerName = tempArr[0];
      this.dynAppName = tempArr[1];
    }
    this.getProfileData();
  }
  applyToInstancecall() {
    this.isFromApplyToInstance = true;
  }


  getTrackPointData(val) {
    console.log(val);
    this.dlMessg = val;
    this.commonService.showError(this.dlMessg);
  }


  changeToOccurenceTab(numb) {
    var line = numb.split(":")[1];
    this.getOccurence(line);
    this.selectedLine = numb;
    this.selectedOccurence = "";
  }

  deleteTrackPoint(i) {
    console.log("WE are in confirmation popup");
    this.confirmationService.confirm({
      message: 'Are you sure to delete Track Point?',
      header: 'Delete Confirmation',
      icon: 'icons8 icons8-trash',
      accept: () => {
        this.removeLine(i);
      },
      reject: () => {
        console.log("TWE are in confirmation popup reject");
      }
    })
  }

  getOccurence(line) {
    this.occurences = [];
    this.occurence = [];
    this.captureVariables = [];
    this.stackTrace = [];
    this.dynamicLogs = [];
    for (let i = 0; i < this.actualTrackPoint.length; i++) {
      if (this.actualTrackPoint[i].LineNumber == line) {
        this.occurences = this.actualTrackPoint[i].occurences;
        for (let j = 0; j < this.occurences.length; j++) {
          let value = this.occurences[j]['occuerenceID']
          this.occurence.push({ "occuerenceID": value, "timestamp": this.occurences[j].timestamp, "line": line });
          for (let k = 0; k < this.occurences[j].capturedVariables.length; k++) {
            this.captureVariables.push(this.occurences[j].capturedVariables[k]);
          }
          if (this.occurences[j].StackTrace[j] && this.occurences[j].StackTrace[j] != []) {
            this.tempTrace = this.occurences[j].StackTrace[j]['content'].replaceAll(":", "\n");
            this.stackTrace.push(this.tempTrace);
          }
          if (this.occurences[j].dynamicLogs[j] && this.occurences[j].dynamicLogs != []) {
            this.dynamicLogs.push(this.occurences[j].dynamicLogs[j]);
            this.dynamicLogs.push(this.occurences[j].timestamp);
          }
        }
      }
    }

  }



  tabSwitched(event) {
    console.log(event);
    this.selectedIndex = event;

  }

  // createDropdownList() {
  //   console.log("i am alos here.....");
  //   this.MethodArrDropDown.push({ 'label': ' Argument1, Argument2, Argument3', value: "" });
  //   console.log("the value inside the dropdown is ........",this.MethodArrDropDown);
  // }

  addclickedQuery() {
    console.log("hi", this.value1);

  }
  onSelect() {
    console.log("The value inside the classFld list is ....", this.inpValue);
    if (this.inpValue === "") {
      console.log("Enter some text in class Varaible", this.selectedTrackData.classFldList);
    } else {
      this.inpValueArray.push(this.inpValue);
      this.inpValue = "";
    }
    if (this.inpValue1 === "") {
      console.log("Enter some value in local variable", this.inpValue1);
    }
    else {
      this.inpValueArray1.push(this.inpValue1);
      this.inpValue1 = "";
    }
    console.log("The values inside the classFLdList is array ........", this.inpValueArray);
  }

  removeInp(i) {
    this.inpValueArray.splice(i, 1);
  }
  //  onApply(){
  //    let ckFlag = false;
  //    if(this.inpValueArray.length > 0){
  //   if(this.selectedTrackData.classFldList){
  //     for(let i=0; i< this.inpValueArray.length; i++){
  //     this.selectedTrackData.classFldList += "," + this.inpValueArray[i];
  //     }
  //   }
  //   else{
  //     for(let i=0; i< this.inpValueArray.length; i++){
  //       if(i != 0)
  //        this.selectedTrackData.classFldList = this.inpValueArray[i];
  //       else
  //         this.selectedTrackData.classFldList = this.inpValueArray[i];
  //       }
  //     }
  //     ckFlag = true;
  //   }
  //   if(this.inpValueArray1.length > 0){
  //     if(this.selectedTrackData.localVarList){
  //       for(let i=0; i< this.inpValueArray1.length; i++){
  //       this.selectedTrackData.localVarList += "," + this.inpValueArray1[i];
  //       }
  //     }
  //     else{
  //       for(let i=0; i< this.inpValueArray1.length; i++){
  //         if(i != 0)
  //          this.selectedTrackData.localVarList = this.inpValueArray1[i];
  //         else
  //           this.selectedTrackData.localVarList = this.inpValueArray1[i];
  //         }
  //       }
  //       ckFlag = true;
  //   }
  //   if(ckFlag){
  //     for(let i=0; i < this.trackPointData.length; i++){
  //       if(this.trackPointData[i].lno == this.selectedTrackData.lno){
  //         this.trackPointData[i] = this.selectedTrackData;
  //       }
  //       else if(i == this.trackPointData.length-1){
  //         this.trackPointData[i+1] = this.selectedTrackData;
  //         break;
  //       }
  //     }
  //   }
  //   console.log(" this.trackPointData[i+1]  ", this.trackPointData);
  //  }

  removeInp1(i) {
    this.inpValueArray1.splice(i, 1);
  }

  removeLine(i) {
    let line = this.LineNumber[i].split(":")[1];
    console.log("check  remove ", line);
    for (let k = 0; k < this.popuData.length; k++) {
      if (Number(this.popuData[k].lineNumber) == Number(line)) {
        //this.popuData.splice(k,1);
        this.popuData[k].breakPoint = null;
        console.log("remove success ", this.popuData);
        break;
      }
    }
    this.LineNumber.splice(i, 1);
    this.trackPointData.splice(i, 1);
  }
  openParam() {
    console.log("in footer");
    console.log("The value inside the class varaibles are...", this.inpValueArray);
    console.log("The value inside the local variables are ..", this.inpValueArray1);
  }

  openDLDialog() {
    console.log("openDLDialog()******this.openDLDialogFromButton=== ", this.openDLDialogFromButton);
    this.openDLDialogFromButton = true;
  }
  openDLbasedOnFQC() {
    console.log("openDLbasedOnFQC()********this.downloadMctData==", this.downloadMctData);
    this.dynFqm = this.FQCforDL + ".dl()"
    this.dynFpInstance = this.fpInstanceInfo[this.fpInstanceInfoKeys[0]][0];
    this.dynTierName = this.downloadMctData[0].tierName;
    this.dynServerName = this.downloadMctData[0].serverName;
    this.dynAppName = this.downloadMctData[0].appName;

    this.argsForDynamicLogging = [this.dynTierName, this.dynServerName, this.dynAppName, this.dynFqm, this.id.product, this.id.testRun, "", this.dynFpInstance, "1"]
    this.ShowCommonDLModule = true;
    this.openDLDialogFromButton = false;

  }

  // dynamic code end
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
  assignColsForMCT() {
    //  console.log(this.colsForMCT);
    if (this.isEnabledQAS) {
      this.visibleColsForMCT.push('queueTime');
      this.list1.push({ field: 'queueTime', header: 'Thread QueueTime', sortable: true, action: true, align: 'right', width: '20' },);
      this.visibleColsForMCT.push('selfTime');
      this.list1.push({ field: 'selfTime', header: 'Self Time(ms)', sortable: 'custom', action: true, align: 'right', width: '20' });
    }
    else {
      let index = this.visibleColsForMCT.indexOf("queueTime");
      if (index > -1) {
        this.visibleColsForMCT.splice(index, 1);
      }
      let index1 = this.visibleColsForMCT.indexOf("selfTime");
      if (index1 > -1) {
        this.visibleColsForMCT.splice(index1, 1);
      }

    }
    // console.log("visible cols for this--------", this.visibleColsForMCT);  
    if (!this.isReorder) {
      this.showHideColumnForMCT({});
      this.columnOptionsForMCT = [];
      for (let i = 0; i < this.colsForMCT.length; i++) {
        if (this.colsForMCT[i].field != 'methodName') {
          if ((this.colsForMCT[i].field == "queueTime" || this.colsForMCT[i].field == "selfTime") && this.isEnabledQAS)
            this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
          else if (this.colsForMCT[i].field != "queueTime" && this.colsForMCT[i].field != "selfTime")
            this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
        }
      }
    }
    else {
      // console.log("list1 value---------",this.list1);
      //console.log("list2 value---",this.list2);
      //  this.colsForMCT = [...Array.from(new Set([...this.list2,...this.colsForMCT]))]
      if (this.list2.length != this.list1.length) {
        for (let i = 0; i <= this.list1.length - 1; i++) {
          //  console.log(this.list2.indexOf(this.list1[i]));
          // if(this.list2.indexOf(this.list1[i]) == -1)
          this.list2.push(this.list1[i]);
        }

      }
      // console.log("list2 length-------",this.list2.length);
      //console.log("list2 value---",this.list2);
      let tempArray1 = [];
      let dummyArray = [];
      tempArray1 = JSON.parse(JSON.stringify(this.list2));


      for (let i = 0; i < this.list2.length; i++) {
        // index =this.list2.indexOf(this.colsForMCT[i]);
        // console.log("i value---------"+i);
        for (let j = 0; j < this.colsForMCT.length; j++) {
          // console.log("j value---------"+j);
          if (this.list2[i].field == this.colsForMCT[j].field) {
            // console.log("case-------",this.colsForMCT[j].field);
            dummyArray.push(this.colsForMCT[j]);
            this.colsForMCT.splice(j, 1);
            //    console.log("colsFor MCT value",this.colsForMCT);
            break;
          }
        }

      }
      // console.log("colsForMCT", this.colsForMCT);
      //console.log("dumpArray----------",dummyArray);
      for (let i = 0; i < this.colsForMCT.length; i++) {
        if (this.colsForMCT[i].field == 'methodName') {
          // tempArray1.push( this.colsForMCT[i]);
          continue;
        }
        else {
          //this.colsForMCT[i].action = false;
          tempArray1.push(this.colsForMCT[i]);
        }
      }
      //console.log("tempArray---------",tempArray1);
      //console.log( "befire check",this.colsForMCT);
      this.show = false;
      this.colsForMCT = [];
      this.colsForMCT = JSON.parse(JSON.stringify(tempArray1));
      //this.origcolsForMCT = JSON.parse(JSON.stringify(tempArray1) );
      this.colsForMCT.unshift({ field: 'methodName', header: 'Methods', sortable: true, action: true, align: 'left', width: '100' })
      // this.origcolsForMCT.unshift( { field: 'methodName', header: 'Methods', sortable: true, action: true, align: 'left', width: '100'})
      this.visibleColsForMCT = [];
      this.show = true;

      for (let i = 0; i < this.list2.length; i++) {
        this.visibleColsForMCT.push(this.list2[i].field);
      }
      // console.log("visiblecolsforMCT---------",this.visibleColsForMCT);
      //this.visibleColsForMCT.unshift('methodName');
      //console.log( "after check",this.colsForMCT);
      this.columnOptionsForMCT = [];
      // this.origcolsForMCT=[];
      //  let tempOrig=[];
      for (let i = 0; i < this.colsForMCT.length; i++) {
        if (this.colsForMCT[i].field != 'methodName') {
          if ((this.colsForMCT[i].field == "queueTime" || this.colsForMCT[i].field == "selfTime") && this.isEnabledQAS)
            this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
          else if (this.colsForMCT[i].field != "queueTime" && this.colsForMCT[i].field != "selfTime")
            this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
        }
      }
      //  this.origcolsForMCT=tempOrig;
    }
    if (!this.isReorder) {
      for (let i = 0; i < this.colsForMCT.length; i++) {
        if (this.colsForMCT[i].action == true && this.colsForMCT[i].field !== 'methodName') {
          this.list1.push(this.colsForMCT[i]);
        }
      }
    }
    else {

      this.list1 = []
      this.list1 = JSON.parse(JSON.stringify(this.list2));
      this.list2 = [];
    }
    this.list1 = this.removeDuplicates(this.list1, 'field')

  }
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  show: boolean = true;
  openColumnOrdderDialog() {
    this.showColumnReorderDialog = true;
    this.list2 = [];
  }
  isReorder: boolean = false;
  reOrderColumns() {
    this.isReorder = true;
    this.assignColsForMCT();
    this._ChangeDetectorRef.detectChanges()
    this.showColumnReorderDialog = false;
  }
  resetReorderlist() {
    this.showColumnReorderDialog = false
    this.list1 = [];
    for (let i = 0; i < this.colsForMCT.length - 1; i++) {
      if (this.colsForMCT[i].action == true && this.colsForMCT[i].field != 'methodName') {
        this.list1.push(this.colsForMCT[i]);
      }
    }
    this.list2 = [];
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

  viewMethodDetail(node) {
    //node = this.selectedFile2 ;
    //  let node=event;
    console.log("node value--------", node);
    this.methodname = node.data.methodName;
    this.tiername = node.data.tierName;
    this.servername = node.data.serverName;
    this.appname = node.data.appName;
    this.servername = node.data.serverName;
    this.tiername = node.data.tierName;
    this.packagename = node.data.pacName;
    this.classname = node.data.className;
    if (node.data.methodArgument)
      this.argument = node.data.methodArgument.replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");
    this.pagename = node.data.pageName;
    if (this.pagename === "")
      this.pagename = "-";
    if (node.data.threadName)
      this.threadname = node.data.threadName.replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
    this.threadId = node.data.threadId;
    this.starttime = node.data.startTime;
    this.walltime = node.data.wallTime;
    this.returnvalue = node.data.return;
    this.cputime = node.data.cpuTime;
    this.timeStamp = node.data.timeStamp;
    this.percentage = Number(node.data.percentage).toFixed(2);
    if (node.data.fqm == '-')
      this.methodDetailsHeaderName = "Callout Details";
    else
      this.methodDetailsHeaderName = "Method Details";
    this.methodDetails = true;

  }


  /**Used to open service method timing from Method summary table of FLowpath details report */
  openServiceMethodTiming(rowData) {
    let reqData = {};
    reqData["methodid"] = rowData.ID;
    reqData['tierName'] = this.id.tierName;
    reqData['serverName'] = this.id.serverName;
    reqData['appName'] = this.id.appName;
    reqData['strStartTime'] = this.id.startTime;
    reqData['strEndTime'] = this.id.endTime;
    this.commonService.dataForServiceMethod = reqData;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.MCTREPORT;
    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
      this._router.navigate(['/home/ddrCopyLink/servicemethodtiming']);
    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
      this._router.navigate(['/home/ED-ddr/servicemethodtiming']);
    else
      this._router.navigate(['/home/ddr/servicemethodtiming']);
  }

  showHideColumn(data: any) {
    //  alert("value");
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

  showHideColumnForMCT(data: any) {
    this.list1 = [];
    if (this.visibleColsForMCT.length !== 0) {
      for (let i = 0; i < this.colsForMCT.length; i++) {
        for (let j = 0; j < this.visibleColsForMCT.length; j++) {
          if (this.colsForMCT[i].field === this.visibleColsForMCT[j] && this.colsForMCT[i].field != "methodName") {
            if ((this.colsForMCT[i].field == "queueTime" || this.colsForMCT[i].field == "selfTime") && this.isEnabledQAS) {
              this.colsForMCT[i].action = true;
              this.list1.push(this.colsForMCT[i]);
            }
            else if ((this.colsForMCT[i].field == "queueTime" || this.colsForMCT[i].field == "selfTime") && !this.isEnabledQAS) {
              this.colsForMCT[i].action = false;
            }
            else {
              this.colsForMCT[i].action = true;
              this.list1.push(this.colsForMCT[i]);
            }
            break;
          } else {
            this.colsForMCT[i].action = false;
            // break;
          }

        }
      }
    }
    this.colsForMCT[0].action = true
    let tempOrig = [];
    for (let i = 0; i < this.colsForMCT.length; i++) {

      for (let j = 0; j < this.origcolsForMCT.length; j++) {
        if (this.colsForMCT[i].field == this.origcolsForMCT[j].field) {
          if (this.colsForMCT[i].action == true)
            this.origcolsForMCT[j].action = true;
          tempOrig.push(this.origcolsForMCT[j]);
          // break;
        }
      }

    }
    this.minWidth = this.list1.length * 100 + 300;
    this.origcolsForMCT = JSON.parse(JSON.stringify(tempOrig));
  }

  getProgressBar() {
    this.progress = this._timerService.getTimerSubscription().subscribe(
      value => { this.calculateProgress(value); }
    );
  }

  calculateProgress(tick: number) {
    if (this.value >= 99) {
      this.loader = false;
    }
    if (this.value < 50) {
      this.value += 4;
    } else if (this.value < 70) {
      this.value += 3;
    } else if (this.value < 80) {
      this.value += 2;
    } else if (this.value < 99) {
      this.value += 1;
    }
    if (this.loader == false) {
      this.progress.unsubscribe();
      this.value = 0;
    }
  }
  updateMethodprop(repeatObj, nodeData) {
    //console.log("update Method prop case");
    nodeData.wallTime = repeatObj.wallTime;
    nodeData.cpuTime = repeatObj.cpuTime;
    nodeData.waitTime = repeatObj.waitTime;
    nodeData.syncTime = repeatObj.syncTime;
    nodeData.ioTime = repeatObj.ioTime;
    nodeData.suspensionTime = repeatObj.suspensionTime;
    //console.log("fpDuration by Neeraj lodhi------"+this.fpDuration);
    if (this.fpDuration == 0)
      nodeData.percentage = 0;
    else
      nodeData.percentage = (repeatObj.wallTime / this.fpDuration) * 100;
    nodeData.timeStamp = repeatObj.timeStamp;
    nodeData.queueTime = repeatObj.queueTime;
    if (nodeData.queueTime == 0)
      nodeData.queueTime = "-";
    //alert("self time value--------"+repeatObj.selfTime);
    nodeData.selfTime = repeatObj.selfTime;
    if (nodeData.selfTime == 0)
      nodeData.selfTime = "-";

  }
  expandChildren(node) {
    //  console.log("repeate method pro case",node.data)
    if (node && node.data.repeatObj) {
      // alert("in this case");
      let repeatObj = node.data.repeatObj;
      this.updateMethodprop(repeatObj, node.data);
    }
    if (node.children == undefined) {
      if (this.count == 0) {
        if (node.data.methodArgument == "-" || node.data.methodArgument.includes("Method Arguments")) {
          if (node.data.methodArgument == "-") {
            node.data.methodArgument = this.queryParams.urlQueryParamStr
          } else {
            node.data.methodArgument = this.queryParams.urlQueryParamStr + '\n' + node.data.methodArgument;
          }
        }
      }
    }
    if (node.children) {
      // console.log(node.children.length);
      // console.log("highlightWallTime-----",this.txtThresholdWallTime);
      // console.log("walTime value------", node.data.wallTime);
      if (node.children.length > 50) {
        this.childrenObj[node.data.lineNumber] = JSON.parse(JSON.stringify(node.children));
        this.preNode[node.data.lineNumber] = node;
        this.expandSameLeveluptoFixLevel(node, 0, node.data.lineNumber, node.children.length);
      }
      else if (this.count < this.txtExpandCount) {
        // console.log('node.expandednode.expanded  ',node);
        node.expanded = true;
        // console.log('**************',node.children);
        if (this.count == 0) {
          if (node.data.methodArgument == "-" || node.data.methodArgument.includes("Method Arguments")) {
            if (node.data.methodArgument == "-") {
              node.data.methodArgument = this.queryParams.urlQueryParamStr
            } else {
              node.data.methodArgument = this.queryParams.urlQueryParamStr + '\n' + node.data.methodArgument;
            }
          }
        }
        for (let cn of node.children) {
          //  console.log("cn value-------------------",cn);
          this.count += 1;
          if (cn && cn.data.repeatObj) {
            // alert("in this case");
            let repeatObj = cn.data.repeatObj;
            this.updateMethodprop(repeatObj, cn.data);
          }
          if (cn.children != undefined && cn.children.length <= 50) {
            //  console.log("less than 50 children");
            this.expandChildren(cn);
          }
          else if (cn.children != undefined) {

            // console.log(" more than 50 children");
            this.childrenObj[cn.data.lineNumber] = JSON.parse(JSON.stringify(cn.children));
            this.preNode[cn.data.lineNumber] = cn;
            this.expandSameLeveluptoFixLevel(cn, 0, cn.data.lineNumber, cn.children.length);
          }
        }
      }
    }
  }
  getChildFLowpathsData(nodeRef) {
    let node = nodeRef.node.data;
    let popupindex =0; 
    console.log("fetch child flowpath data", node);
    var endTimetoPass;
    var startTimetoPass = Number(this.trStartTime) - 900000;
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined || isNaN(this.trEndTime)) {
      var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.trEndTime) + 900000;
    }
    //var url = "//"+ this.getHostUrl() + '/' + this.id.product+"/analyze/drill_down_queries/file.json";
    var url = '';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      url = this.getHostUrl();
    }
    else if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;

    } else {
      url = this.getHostUrl();
    }
    // console.log(this.ignoreFilterCallOuts);
    // console.log(data.seqNo);
    // console.log(this.queryParams.prevFlowpathInstance);
    let fpInstance = this.queryParams.prevFlowpathInstance;
    if (this.queryParams.prevFlowpathInstance === '0')
      fpInstance = this.queryParams.flowpathInstance;
    // console.log("fpInstance value-----------"+fpInstance);
    let methodCount = 50000;
    if (this.queryParams.methodsCount)
      methodCount = Number(this.queryParams.methodsCount.toString().replace(/,/g, ""));
    if (this.commonService.enableQueryCaching == 1) {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/getChildFlowpath?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun + "&prevFlowpathInstance=" + fpInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&beginSequenceNo=" + node.seqNo + "&filterLevel=" + this.txtFlterMethodLevel + "&filterWallTime=" + this.txtFilterWallTime + "&package=" + this.selectedPackageList.toString() + "&class=" + this.selectedActClss.toString() + "&method=" + this.selectedActMethod.toString() + "&showCallouts=" + this.ignoreFilterCallOuts + "&negativeMethods=" + this.selectedNegativeMethod + "&thresholdWallTime=" + this.txtThresholdWallTime + "&methodCount=" + methodCount + "&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    } else {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/getChildFlowpath?&testRun=" + this.id.testRun + "&prevFlowpathInstance=" + fpInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&beginSequenceNo=" + node.seqNo + "&filterLevel=" + this.txtFlterMethodLevel + "&filterWallTime=" + this.txtFilterWallTime + "&package=" + this.selectedPackageList.toString() + "&class=" + this.selectedActClss.toString() + "&method=" + this.selectedActMethod.toString() + "&showCallouts=" + this.ignoreFilterCallOuts + "&negativeMethods=" + this.selectedNegativeMethod + "&thresholdWallTime=" + this.txtThresholdWallTime + "&methodCount=" + methodCount + "&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    }
    this.loading = false;
    return this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any>res;
      // console.log("done rest call");
      // console.log(data.treedata.data);
      if (data.Status) {
        alert(data.Status);
      }
      else {
        let subsParentMethodName = "";
        if (nodeRef && nodeRef.parent && nodeRef.parent.data)
          subsParentMethodName = nodeRef.parent.data.methodName;
        else
          subsParentMethodName = this.decodeHTMLString(node.methodName);
        this.repeatedMethodData[this.repeatedMethodData.length] = data.repeatMethodsData;
        if (subsParentMethodName.length > 30)
          subsParentMethodName = subsParentMethodName.substring(0, subsParentMethodName.length) + "...";
        let subCallout = this.decodeHTMLString(node.methodName);
        if (subCallout.length > 30)
          subCallout = subCallout.substring(0, subCallout.length - 1) + "...";
        this.count = 0;
        this.expandChildren(data.treedata.data[0]);
        if (nodeRef && nodeRef.parent && nodeRef.parent.data)
          this.values.push({ "treeData": data.treedata.data, "subsParentMethodName": subsParentMethodName, "parentMethodName": nodeRef.parent.data.methodName, "Callout": this.decodeHTMLString(node.methodName), "subCallout": subCallout });
        else
          this.values.push({ "treeData": data.treedata.data, "subsParentMethodName": subsParentMethodName, "parentMethodName": subsParentMethodName, "Callout": this.decodeHTMLString(node.methodName), "subCallout": subCallout });
         if(popupindex == undefined)
           popupindex=0;
         this.visibleArr[popupindex]=true;
        // this.childMCTPositionTop = this.childMCTPositionTop + 150;
      }
    })




  }
  expandSameLeveluptoFixLevelforValue(lineNumber, limit, childArrlength) {
    this.loading = true;
    let node = this.preNode[lineNumber];
    if (childArrlength == limit) {
      let value = childArrlength % 100;
      if (value > 50)
        value = value - 50;
      limit = childArrlength - value;
    }
    setTimeout(() => { //alert("Hello");
      this.expandSameLeveluptoFixLevel(node, limit, lineNumber, childArrlength);
    }, 1000);
  }
  expandSameLeveluptoFixLevel(node, limit, parentLineNumber, childArrLength) {
    // console.log("cn value-------",node);
    // node=this.childrenObj['1'];
    //let elm=document.getElementById('maindibb').scrollTop;
    //console.log("elm value----------",elm);
    // console.log("childrenObj vlaue-------",this.childrenObj);
    let toAddchildren = [];
    let obj = {};
    //console.log
    let offset = limit + 50;
    if (offset > childArrLength)
      offset = childArrLength;
    //  console.log("offset value---",offset);
    for (let j = limit; j < offset; j++) {
      // console.log("in loop value-----"+j);
      obj = this.childrenObj[node.data.lineNumber][j];
      //console.log("obj value---------",obj);
      if (obj != undefined) {
        if (j != 0 && limit == j) {
          // console.log(limit-50)
          obj['data']['limit'] = limit - 50;
          obj['data']['offset'] = limit;
          obj['data']['type'] = 1;
        }
        if (j == offset - 1) {
          //console.log("last case value------",obj);
          //console.log("obj value-----------",obj['data']['methodName'],);
          //  obj['data']['methodName']=obj['data']['methodName']+"<a href='expandSameLeveluptoFixLevel()'>Next..</a>";
          if (Number(offset + 50) > childArrLength) {
            obj['data']['offset'] = childArrLength;
          }
          else {
            obj['data']['offset'] = offset + 50;
          }
          obj['data']['type'] = 2;
          obj['data']['limit'] = offset;
        }
        obj['data']['line'] = parentLineNumber;
        obj['data']['last'] = childArrLength;
        this.expandChildren(obj);

        toAddchildren.push(obj);
      }
      else
        break;
    }
    //console.log("toaddchildren value---",toAddchildren);
    node.children = toAddchildren;
    node.expanded = true;
    this.mctData = [...this.mctData];
    //console.log("elm value after----------",elm);
    //document.getElementById('maindibb').scrollTop=elm;
    // console.log("scroll top value after----------", document.getElementById('maindibb').scrollTop);
    this.loading = false;
    return;
  }

  getMCTData() {
    var endTimetoPass;
    var startTimetoPass = Number(this.trStartTime) - 900000;
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined || isNaN(this.trEndTime)) {
      var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.trEndTime) + 900000;
    }
    //var url = "//"+ this.getHostUrl() + '/' + this.id.product+"/analyze/drill_down_queries/file.json";
    var url = '';


    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
    }
    // else if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL") {
    //   url =  this.getHostUrl();
    // } 
    // else {
    url = this.getHostUrl();
    // }
    // console.log(this.ignoreFilterCallOuts);

    let methodCount = 50000;
    if (this.queryParams.methodsCount)
      methodCount = Number(this.queryParams.methodsCount.toString().replace(/,/g, ""));
    if (this.commonService.enableQueryCaching == 1) {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/fpDetailsMCT?cacheId=" + this.id.testRun + "&filterGreaterThan=" + this.txtFilterWallTime + "&filterTop=" + this.txtFlterMethodLevel + "&packageList=&classList=&methodList=&testRun=" + this.id.testRun + "&flowPathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&entryResponseTime=" + this.fpDuration + "&thresholdWallTime=" + this.txtThresholdWallTime + "&FromAngular=1&enableMergeCase=" + this.enableMergeCase + "&ignoreFilterCallouts=" + this.ignoreFilterCallOuts + "&methodCount=" + methodCount + "&filterMethods=false&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    } else {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/fpDetailsMCT?filterGreaterThan=" + this.txtFilterWallTime + "&filterTop=" + this.txtFlterMethodLevel + "&packageList=&classList=&methodList=&testRun=" + this.id.testRun + "&flowPathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&entryResponseTime=" + this.fpDuration + "&thresholdWallTime=" + this.txtThresholdWallTime + "&FromAngular=1&enableMergeCase=" + this.enableMergeCase + "&ignoreFilterCallouts=" + this.ignoreFilterCallOuts + "&methodCount=" + methodCount + "&filterMethods=false&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    }
    this.loading = false;
    return this.ddrRequest.getDataUsingGet(url);
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName;
    if (this._ddrData.isFromtrxFlow) {
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.id.testRun = this._ddrData.testRunTr;
      //   return hostDCName;
    }
    else {
      hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
        //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
        this.id.testRun = this._ddrData.testRun;
        // this.testRun= this._ddrData.testRun;
        console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
      }
      //  else if (this._navService.getDCNameForScreen("methodCallingTree") === undefined)
      //     hostDcName = this._cavConfigService.getINSPrefix();
      //   else
      //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("methodCallingTree");

      //   if (hostDcName.length > 0) {
      //     sessionStorage.removeItem("hostDcName");
      //     sessionStorage.setItem("hostDcName", hostDcName);
      //   }
      //   else
      //     hostDcName = sessionStorage.getItem("hostDcName");
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  getMethodSummaryData() {
    this.loading = false;
    var endTimetoPass;
    var startTimetoPass;
    if (this.trStartTime != '')
      startTimetoPass = Number(this.trStartTime) - 900000;
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined) {
      var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.trEndTime) + 900000;
    }
    var url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
    }
    // else if(sessionStorage.getItem("isMultiDCMode")=="true" &&this._cavConfigService.getActiveDC() == 'ALL')
    // {
    //   url= "//"+this.getHostUrl();
    // }
    //  else {
    url = this.getHostUrl();
    //  }
    if (this.commonService.enableQueryCaching == 1) {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/methodTimingReport?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun + "&flowpathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&tierId=" + this.queryParams.tierId + "&serverId=" + this.queryParams.serverId + "&appId=" + this.queryParams.appId + "&type=method&entity=0";
    }
    else {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/methodTimingReport?testRun=" + this.id.testRun + "&flowpathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&tierId=" + this.queryParams.tierId + "&serverId=" + this.queryParams.serverId + "&appId=" + this.queryParams.appId + "&type=method&entity=0";
    }
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignMSTValue(data)));
  }

  doAssignMSTValue(res: any) {
    this.loading = false;
    if (res.hasOwnProperty('Status')) {
      this.showError(res.Status);
    }
    this.methodTimingData = this.doHyperLinkOnMethod(res.data);
    if (this.methodTimingData.length > 0)
      this.dataCount = this.methodTimingData.length;
    if (this.methodTimingData.length == 0) {
      this.showDownLoadReportIcon = false;
      this.showErrorMessage = true;
    }
    else
      this.showErrorMessage = false;
  }

  /**Formatter cell data for percentage field */
  pctFormatter(value) {
    if (!isNaN(value) && Number(value) < 0) {
      return '-';
    } else if (!isNaN(value)) {
      // alert("in this case"+Number(value).toFixed(2).toLocaleString());
      return Number(Number(value).toFixed(2)).toLocaleString();
    } else {
      return value;
    }
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
    if (value != '' && !isNaN(value)) {
      return Number(Number(value)).toLocaleString();
    }
    else if (value === '') {
      return '-';
    }
    else
      return value;
  }

  cpuTimeFormatter(value) {
    // if (value == 0)
    //  return "-";
    if (!isNaN(value)) {
      value = (Number(value)).toLocaleString();
      if (value == 0)
        value = "<1";
      return value;
    }
    else
      return value;

  }

  openAutoInstDialog() {
    let testRunStatus;
    let instanceType;
    let url;
    //  if(sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    //  {
    //    url=  this.getHostUrl();
    //  }
    //  else
    url = this.getHostUrl();
    url += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.id.testRun;
    console.log('url *** ', url);
    this.ddrRequest.getDataUsingGet(url).subscribe(resp => {
      let res = <any>resp;
      console.log("data for tr status === ", res);
      testRunStatus = res.data;
      if (testRunStatus.length != 0) {
        this.showAutoInstrPopUp = true;
        if (this.queryParams.Instance_Type.toLowerCase() == 'java')
          instanceType = 'Java';
        else if (this.queryParams.Instance_Type.toLowerCase() == 'dotnet')
          instanceType = 'DotNet';

        this.argsForAIDDSetting = [this.queryParams.appName, this.queryParams.appId, instanceType, this.queryParams.tierName,
        this.queryParams.serverName, this.queryParams.serverId, "-1", this.queryParams.urlName, "DDR", testRunStatus[0].status, this.id.testRun];
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


  openSeqDiagram() {
    // this.showImage = true;
    var endTimetoPass;
    // need to optimize below code as it is used many times
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined || isNaN(this.trEndTime)) {
      endTimetoPass = Number(this.trStartTime) + Number(this.fpDuration);
    } else {
      endTimetoPass = Number(this.trEndTime);
    }

    var urlforJsp = '';

    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        urlforJsp = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        urlforJsp = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        urlforJsp = "// " + this.commonService.host + ':' + this.commonService.port;

    } else {
      urlforJsp = this.getHostUrl();
    }
    urlforJsp += "/" + this.id.product + "/integration.jsp?testRun=" + this.id.testRun + "&urlname=" + this.queryParams.urlName
      + "&completeURL=" + encodeURIComponent(this.queryParams.urlQueryParamStr) + "&flowpathID=" + this.queryParams.flowpathInstance + "&tierid=" + this.queryParams.tierId
      + "&serverid=" + this.queryParams.serverId + "&appid=" + this.queryParams.appId + "&tierName=" + this.queryParams.tierName
      + "&serverName=" + this.queryParams.serverName + "&appName=" + this.queryParams.appName + "&strStartTime=" + Number(this.trStartTime)
      + "&strEndTime=" + endTimetoPass + "&btCategory=" + this.queryParams.btCatagory + "&strOprName=FromAngularMCT&breadCrumbTrackID=0";
    window.open(urlforJsp, "_blank");

  }

  /*openDialogforSeqDiagfilter()
  {
    this.filterDialog = true;
    this.MCTDialogFilters = false;
  }*/

  /*showSeqDiag() {
    var endTimetoPass;
    var url = '';
    var startTimetoPass = Number(this.trStartTime) - 900000;

    console.log("callOutFP Flag *** " ,  this.callOutFPFlag ," callOut FP Data *** " , this.callOutFPData);
    
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined || isNaN(this.trEndTime)) {
      var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.trEndTime) + 900000;
    }
    this.getSessionId();
    if(this.callOutFPFlag == true)
    {
      this.strCmdArgs = " --testrun " + this.id.testRun + " --fpinstance " + this.callOutFPData[0].flowpathInstance + " --tierid " + this.callOutFPData[0].tierId 
      + " --serverid " + this.callOutFPData[0].serverId + " --appid " + this.callOutFPData[0].appId + " --urlidx " + this.callOutFPData[0].urlIndex 
      + " --methods_count " + this.callOutFPData[0].methodCount + " --abs_starttime " + startTimetoPass + " --abs_endtime " + endTimetoPass;
      this.imageName = this.callOutFPData[0].flowpathInstance + "_SequenceDiagram" + this.id.testRun + "_" + "FPDetails" + this.sessionID + ".png"; //image name of sequence diagram
    }
    else
    {
      this.strCmdArgs = " --testrun " + this.id.testRun + " --fpinstance " + this.queryParams.flowpathInstance + " --tierid " + this.queryParams.tierId 
      + " --serverid " + this.queryParams.serverId + " --appid " + this.queryParams.appId + " --abs_starttime " + startTimetoPass 
      + " --abs_endtime " + endTimetoPass;
      this.imageName = this.queryParams.flowpathInstance + "_SequenceDiagram" + this.id.testRun + "_" + "FPDetails" + this.sessionID + ".png"; //image name of sequence diagram
    }
    console.log("imageName = " , this.imageName , " , strCmdArgs = " , this.strCmdArgs);
    
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
          if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
     else if(this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
     else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
} else {
      url = "//" + this.getHostUrl();
    }
    url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/seqDiagram";

    let dataObj: Object = {
      cmdArgs: this.strCmdArgs,
      imageName: this.imageName,
      filterGreaterThan: this.txtFilterWallTime,
      classWidth: this.txtClassWidth,
      highLightWallTime: this.txtThresholdWallTime,
      filterTop: this.txtFlterMethodLevel,
      filters: this.selectedPackageList.toString(),
      testRun: this.id.testRun,
      ignoreFilterCallOuts:this.ignoreFilterCallOutsforSD.toString(),
      selectedNegativeMethod:this.selectedNegativeMethod
    }
    return this.http.post(url, JSON.stringify(dataObj)).map(res => res.json()).subscribe(data => this.getImage(data));
  }*/

  /*getSessionId() {
    var url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = "//" + this.getHostUrl();
    }
    url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/sessionInfo";
    return this.http.get(url).map(res => res.json()).subscribe(data => (this.doAssignSessionValue(data)));
  }

  doAssignSessionValue(res: any) {
    this.sessionID = res.id;
  }*/

  /*getImage(res: any) {
    this.loading = false;
    if (res.img != undefined) {
      this.image = res.img;
      console.log("unique methods for seq diag *** " , res.uniqueMethods);
      this.uniqueMethodSignature = res.uniqueMethods;
      this.addPackageClassmethodList();
      this.showImage = true;
      this.disableSeqDiag = false;
      
      if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
  if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
          this.imagePath = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + this.image;
  else if(this.commonService.protocol)
          this.imagePath = this.commonService.protocol +"://"+ this.commonService.host + ':' + this.commonService.port + this.image;
  else
    this.imagePath = "//"+ this.commonService.host + ':' + this.commonService.port + this.image;
      } else {
        this.imagePath = this.getHostUrl() + this.image;
      }
    
      let imageKey =  this.image.substring(this.image.lastIndexOf('/')+1,this.image.indexOf('_'));
      this.imagePathObj[imageKey] = this.imagePath;
      this.keysArr = Object.keys(this.imagePathObj);
      console.log( "imagePathObj **** " , this.imagePathObj , " , keys = " , Object.keys(this.imagePathObj));

      this.arrCoordinates = this.arrCoordinates.concat(res.coordinates);
      
       console.log(" length of arrCoordinates array ** " , this.arrCoordinates.length);
       console.log(" arrCordinates = " , this.arrCoordinates);
      this.createToolTipOnImageAtSpecificPoint();
    }
    else {
      this.disableSeqDiag = true;
      this.showImage = false;
      this.errorMsg = "Error in generating Sequence Diagram due to large methods.";
    }

  }*/

  /*createToolTipOnImageAtSpecificPoint() {

    let arr = [];
    for (let j = 0; j < this.arrCoordinates.length; j++) {
      let tempArray = this.arrCoordinates[j].split(":");
  
       arr[j] = {"corrdinates":tempArray[0],"pcm":tempArray[1]}; 
    }
    this.corrInfo = arr;
    console.log("corrInfo = " , this.corrInfo);
  }*/

  /*openDBReport(data:any)
  {
    this._ddrData.splitViewFlag = false;
    this.commonService.seqDiagToDBFlag = true;
    
    console.log("db report & data = " , data);
    let arVal = data.split('%%%');

    let arr = JSON.parse("[" + arVal[4] + "]");
    let uniqueSqlIndex = arr.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    let params  = {'testRun':this.queryParams.testRun,'flowpathInstance':this.queryParams.flowpathInstance,'tierId':this.queryParams.tierId,
    'serverId':this.queryParams.serverId,'appId':this.queryParams.appId,'tierName':this.queryParams.tierName,'serverName':this.queryParams.serverName,
    'appName':this.queryParams.appName,'fpDuration':this.queryParams.fpDuration,'startTimeInMs':this.trStartTime,'sqlIndex':uniqueSqlIndex.toString(),
    'product':this.id.product};

    this.commonService.seqDiagToDBData = params;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.MCTREPORT;
    if(this._router.url.indexOf('/home/ddr') != -1)
      this._router.navigate(['/home/ddr/flowpathToDB']);
    else if(this._router.url.indexOf('/home/ED-ddr') != -1)
      this._router.navigate(['/home/ED-ddr/flowpathToDB']);
    else if(this._router.url.indexOf('/home/ddrCopyLink') != -1)
      this._router.navigate(['/home/ddrCopyLink/flowpathToDB']);
  }*/

  /*openExceptionReport(data:any)
  {
    this.commonService.seqDiagToExceptionFlag = true;
    this._ddrData.flowpathToExFlag  = false;
    this._ddrData.splitViewFlag = false;
    console.log("exception report & data = " , data);
    let arVal = data.split('%%%');
    let backendId = arVal[3].split('_')[0];
    let backendSubType = arVal[3].split('_')[1];

    let endTimeInMs = Number(this.trStartTime) + Number(this.fpDuration);
    let sequenceNumber = arVal[2];
    let seqNoToPass = sequenceNumber.substring(sequenceNumber.lastIndexOf(".")+1);

    let params = {'testRun':this.id.testRun,'flowpathInstance':this.queryParams.flowpathInstance,'startTimeInMs':this.trStartTime,
    'endTimeInMs':endTimeInMs,'tierId':this.queryParams.tierId,'tierName':this.queryParams.tierName,'serverId':this.queryParams.serverId,
    'serverName':this.queryParams.serverName,'appId':this.queryParams.appId,'appName':this.queryParams.appName,'backendSubType':backendSubType,
    'backendid':backendId,'backendName':arVal[4],'product':this.id.product, 'seqNo':seqNoToPass};

    this.commonService.seqDiagToExceptionData = params;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.MCTREPORT;
    if(this._router.url.indexOf('/home/ddr') != -1)
      this._router.navigate(['/home/ddr/exception']);
    else if(this._router.url.indexOf('/home/ED-ddr') != -1)
      this._router.navigate(['/home/ED-ddr/exception']);
    else if(this._router.url.indexOf('/home/ddrCopyLink') != -1)
      this._router.navigate(['/home/ddrCopyLink/exception']);
  }*/

  /*onRightClick(event)
  {
    event.preventDefault();
    jQuery('.context-menu').toggle(100).css({
      top: event.pageY + 'px',
      left: event.pageX + 'px'
    });

    jQuery(document).click(function(event){
      event.stopPropagation();
      jQuery('.context-menu').hide();
    });
    
  }*/

  /*openCallOutFlowpathInstance(data:any)
  {
    console.log("callout fp instance data *** " , data);
    let url;
    let endTimeInMs = Number(this.trStartTime) + Number(this.fpDuration);
    let cmdArgs = " --testrun " + this.queryParams.testRun + " --prev_fpinstance " + this.queryParams.flowpathInstance + " --begin_seq_num " 
    + data.split('%%%')[2] + " --abs_starttime " + this.trStartTime + " --abs_endtime " + endTimeInMs;
    
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = "//" + this.getHostUrl();
    }
    url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/callOutFP?cmdArgs=" + cmdArgs;
    return this.http.get(url).map(res => res.json()).subscribe(data => (this.assignCallOutFPValue(data)));
  }

  assignCallOutFPValue(res:any)
  {
    console.log("res for CallOut FP **** " , res);
    if(res.data.length != 0)
    {
      this.callOutFPFlag = true;
      this.callOutFPData = res.data;
      this.showSeqDiag();
    }
    else
    {
      alert("No data found  for this Call Out");
    }
  }*/

  getBtID(btCatagoryName) {
    var btId = '10';
    if (btCatagoryName === 'Very Slow') {
      btId = '12';
    }
    if (btCatagoryName === 'Slow') {
      btId = '11';
    }
    if (btCatagoryName === 'Normal') {
      btId = '10';
    }
    if (btCatagoryName === 'Errors') {
      btId = '13';
    }
    return btId;
  }
  /**
   * Method used to create filter criteria for show in top of the section
   */
  createFilterCriteria() {
    this.filterCriteria = "";
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      let dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL") {
        if (this._ddrData.dcName)
          dcName = this._ddrData.dcName;
        else
          dcName = this._ddrData.getMasterDC();
      }
      this.filterCriteria = 'DC=' + dcName + ', ';

      if (this._ddrData.isFromtrxFlow && !this._ddrData.isFromAgg) {
        this.filterCriteria = 'DC=' + this._ddrData.dcNameTr + ',';
      }
    }
    let startTime = Number(this.trStartTime);
    let endTime = Number(this.trStartTime) + Number(this.fpDuration);
    this.trEndTime = endTime;
    console.log("value in mctdata for tiername", this.commonService.mctData);
    if (this.commonService.mctFlag == true && this.commonService.mctData) {
      if (this.commonService.mctData.tierName != "NA" && this.commonService.mctData.tierName != "" && this.commonService.mctData.tierName != "undefined" && this.commonService.mctData.tierName != undefined)
        this.filterCriteria += "Tier=" + this.commonService.mctData.tierName;
      if (this.commonService.mctData.serverName != "NA" && this.commonService.mctData.serverName != "" && this.commonService.mctData.serverName != "undefined" && this.commonService.mctData.serverName != undefined)
        this.filterCriteria += ", Server=" + this.commonService.mctData.serverName;
      if (this.commonService.mctData.appName != "NA" && this.commonService.mctData.appName != "" && this.commonService.mctData.appName != "undefined" && this.commonService.mctData.appName != undefined)
        this.filterCriteria += ", Instance=" + this.commonService.mctData.appName;

    } else {

      if (this.id.tierName != "NA" && this.id.tierName != "" && this.id.tierName != "undefined" && this.id.tierName != undefined)
        this.filterCriteria += "Tier=" + this.id.tierName;
      if (this.id.serverName != "NA" && this.id.serverName != "" && this.id.serverName != "undefined" && this.id.serverName != undefined)
        this.filterCriteria += ", Server=" + this.id.serverName;
      if (this.id.appName != "NA" && this.id.appName != "" && this.id.appName != "undefined" && this.id.appName != undefined)
        this.filterCriteria += ", Instance=" + this.id.appName;
    }
    /* if(this.trEndTime != 'NA' && this.trEndTime != '' && this.trEndTime != undefined && !isNaN(this.trEndTime)) {
          this.startTimeInDateFormat = moment(startTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY hh:mm:ss");
          this.filterCriteria += ", StartTime=" + this.startTimeInDateFormat;
          this.endTimeInDateFormat = moment(endTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY hh:mm:ss");
          this.filterCriteria += ", EndTime=" + this.endTimeInDateFormat;
        }else if(!isNaN(this.trEndTime) ){
          this.filterCriteria += ", StartTime=" + this.startTimeInDateFormat;
          this.filterCriteria += ", EndTime=" + this.endTimeInDateFormat;
        }*/
    console.log("startTime--------------", this.queryParams.startTime);
    if (this.queryParams.startTime != undefined && this.queryParams.startTime != '' && this.queryParams.startTime != 'NA')
      this.filterCriteria += ", Start Time=" + this.queryParams.startTime;
    if (this.queryParams.endTime != undefined && this.queryParams.endTime != '' && this.queryParams.endTime != 'NA')
      this.filterCriteria += ", End Time=" + this.queryParams.endTime;


    if (this.queryParams.fpDuration != undefined && this.queryParams.fpDuration != '' && this.queryParams.fpDuration != 'NA')
      this.filterCriteria += ", ResponseTime=" + this.formatter(this.queryParams.fpDuration) + "(ms)";

    if (this.queryParams.urlName != undefined && this.queryParams.urlName != '' && this.queryParams.urlName != 'NA')
      this.filterCriteria += ", BT=" + this.queryParams.urlName;

    if (this.queryParams.urlQueryParamStr != undefined && this.queryParams.urlQueryParamStr != '' && this.queryParams.urlQueryParamStr != 'NA') {
      if (this.queryParams.urlQueryParamStr.length > 45) {
        let wholeUrl = this.queryParams.urlQueryParamStr.substring(0, 45) + "...";
        this.filterCriteria += ",<span style='cursor:pointer;' title='" + this.queryParams.urlQueryParamStr + "'>" + " URL=" + wholeUrl + "</span>";
      }
      else {
        this.filterCriteria += ", URL=" + this.queryParams.urlQueryParamStr;
      }

    }
    if (this.id.pageName != null && this.id.pageName != undefined && this.id.pageName != "" && this.id.pageName != "NA")
      this.filterCriteria += ", Page=" + this.id.pageName;
    if (this.id.script != null && this.id.script != undefined && this.id.script != "" && this.id.script != "NA")
      this.filterCriteria += ", Script=" + this.id.script;
    if (this.id.transtx != null && this.id.transx != undefined && this.id.transtx != "" && this.id.transtx != "NA")
      this.filterCriteria += ", Transaction=" + this.id.transtx;
    if (this.filterCriteria.startsWith(","))
      this.filterCriteria = this.filterCriteria.substring(1);

    if (this.filterCriteria.endsWith(","))
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);

    /* setTimeout(() => {
            let showfilter = document.getElementById('filterId');
            alert(showfilter);
            showfilter.innerHTML = this.filterCriteria;
           },400);*/
  }

  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilter() {
    this.isEnabledColumnFilter = !this.isEnabledColumnFilter;
    // if (this.isEnabledColumnFilter) {
    //   this.isEnabledColumnFilter = false;
    // } else {
    //   this.isEnabledColumnFilter = true;
    // }
    this.changeColumnFilter();
  }

  /*This method is used to Enable/Disabled Column Filter*/
  changeColumnFilter() {
    try {
      let tableColumns = this.cols;
      if (this.isEnabledColumnFilter) {
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

  /**
   * This method is used to set Test Run header info which is used in download report as title
   */
  setTestRunInHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1) {
      this.strTitle = "Netstorm - Method Summary Report - Test Run : " + this.id.testRun;
      this.strTitleMct = "Netstorm - Method Calling Tree - Test Run : " + this.id.testRun;
    }
    else {
      this.strTitle = "Netdiagnostics Enterprise - Method Summary Report - Session : " + this.id.testRun;
      this.strTitleMct = "Netdiagnostics Enterprise - Method Calling Tree - Session : " + this.id.testRun;
    }
  }

  //This method is used to download the Weblogic data table
  /* downloadReport(downloadType:string)
   {
     var jsonData="[";
     let weblogicTableRenameArray={"threadName":"Thread Name", "workManager":"Work Manager", "currReq":"Current Request","totalReq": "Total Request","threadState": "Thread State"};
     let weblogicColOrder=["Thread Name","Work Manager","Current Request","Total Request","Thread State"];
     let downloadObj:Object={
                  downloadType:downloadType,
                  strSrcFileName: "WeblogicReport",
                  strRptTitle:this.strTitle,
                  weblogicData:JSON.stringify(this.mctInfoDetail),
                  weblogicTableRenameArray:JSON.stringify(weblogicTableRenameArray),
                  varFilterCriteria:this.filterCriteria.replace(/<[^>]*>/g,""),
                  weblogicColOrder:weblogicColOrder.toString()
                 }
     let downloadFileUrl="//"+decodeURIComponent(this.getHostUrl() + '/' + this.id.product)+"/v1/cavisson/netdiagnostics/ddr/downloadWeblogicReport";
      this.http.post(downloadFileUrl,JSON.stringify(downloadObj)).map(res => res["_body"]).subscribe(res => (this.openDownloadReports(res)));

   }*/
  /**For download table data */

  downloadReportMCT(reports: string) {
    let renameArray1 = { "methodName": "Methods", 'lineNumber': 'S.N.', "methodArgument": "Arguments", "threadName": "Thread", "threadId": "ThreadId", "tierName": "Tier", "serverName": "Server", "appName": "Instance", "className": "Class", "pacName": "Package", "startTime": "StartTime", "wallTime": "WallTime(ms)", "cpuTime": "CPUTime(ms)", "percentage": "Percentage", "pageName": "PageName", "api": "API", "waitTime": "WaitTime(ms)", "syncTime": "SyncTime(ms)", "ioTime": "IOTime(ms)", "suspensionTime": "SuspensionTime(ms)", "instanceType": "InstanceType", "asyncCall": "Async_Call", "queueTime": "ThreadQueueTime(ms)", "selfTime": "SelfTime(ms)", "timeStamp": "Elapsed Time(ms)", "sourceNetwork": "Network Delay in Req(ms)", "destNetwork": "Network Delay in Resp(ms)" };

    //    let colOrder1 = ["Methods", 'S.N.', "Arguments", "Thread", "ThreadId", "Tier", "Server", "Instance", "Class", "Package", "StartTime", "WallTime(ms)", "CPUTime(ms)", "Percentage", "PageName", "API", "WaitTime(ms)", "SyncTime(ms)", "IOTime(ms)", "SuspensionTime(ms)", "InstanceType", "Async_Call"];
    let colOrder1 = ["S.N.", "Methods", "Arguments", "Thread", "ThreadId", "ThreadQueueTime(ms)", "Tier", "Server", "Instance", "Class", "Package", "StartTime", "SelfTime(ms)", "WallTime(ms)", "CPUTime(ms)", "Percentage", "PageName", "API", "WaitTime(ms)", "SyncTime(ms)", "IOTime(ms)", "SuspensionTime(ms)", "InstanceType", "Async_Call", "Elapsed Time(ms)", "Network Delay in Req(ms)", "Network Delay in Resp(ms)"];

    if (this.queryParams.urlQueryParamStr == "undefined" || this.queryParams.urlQueryParamStr == undefined) // condition for transaction flowmap to method calling tree
      this.queryParams['urlQueryParamStr'] = this.queryParams.urlQueryParmStr; // because from transaction flowmap we are passing urlQueryParmStr 

    this.downloadMctData.forEach((val, index) => {
      if (index == 0) {
        if (val['methodArgument'] == "-" || val['methodArgument'].includes("Method Arguments")) {
          if (val['methodArgument'] == "-") {
            val['methodArgument'] = this.queryParams.urlQueryParamStr
          } else {
            val['methodArgument'] = this.queryParams.urlQueryParamStr + '\n' + val['methodArgument'];
          }
        }
      }
      delete val['level'];
      delete val['fqm'];
      delete val['methodId'];
      //    delete val['timeStamp'];
      delete val['subType'];
      //delete val['threadId'];     this is commented beacuse new column for threadid is shown 
      delete val['seqNo'];
      delete val['_$visited'];
      delete val['slowMethod'];
      delete val['repeatedMethodCount'];
      delete val['repeatObj'];
      delete val['keyLine'];
      delete val['uninstrumentedFlag'];
      delete val['showMethodColor'];
      delete val['eventIdLight'];
      delete val['eventIdDark'];
      delete val['calloutType'];
      delete val['eventId'];
      delete val['asyncToBeMatchedId'];
      delete val['dynLogFlag'];
      delete val['severityBgColorField'];
      delete val["severityBgColorField2"];

      val['cpuTime'] = this.cpuTimeFormatter(val['cpuTime']);
    });

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteria.replace(/<[^>]*>/g, ""),
      strSrcFileName: 'MethodCallingReport',
      strRptTitle: this.strTitleMct,
      renameArray: JSON.stringify(renameArray1),
      colOrder: colOrder1.toString(),
      jsonData: JSON.stringify(this.downloadMctData)
    };
    let downloadFileUrl = '';

    if (this.commonService.protocol && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
      else if (this.commonService.protocol)
        downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
      else
        downloadFileUrl = "//" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product);
    }
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';

    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
        (this.openDownloadReports(res)));
    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }

  }

  donwloadReportsRepeatedMethod(reports: string) {
    let renameArray = { "methodArgument": "Arguments", "timeStamp": "ElapsedTime(ms)", "wallTime": "WallTime(ms)", "percentage": "Percentage", "queueTime": "Thread QueueTime", "selfTime": "Self Time(ms)", "cpuTime": "CPU Time(ms)", "threadId": "ThreadId", "threadName": "Thread", "waitTime": "WaitTime(ms)", "syncTime": "SyncTime(ms)", "ioTime": "IOTime(ms)", "suspensionTime": "SuspensionTime(ms)", "lineNumber": "Line No." };
    let colOrder = ["Arguments", "ElapsedTime(ms)", "WallTime(ms)", "Percentage", "Thread QueueTime", "Self Time(ms)", "CPU Time(ms)", "ThreadId", "Thread", "WaitTime(ms)", "SyncTime(ms)", "IOTime(ms)", "SuspensionTime(ms)", "Line No."];
    let data = JSON.parse(JSON.stringify(this.downloadRepeatMethod))
    data.forEach((val) => {
      delete val['tierName'];
      delete val['startTime'];
      delete val['sourceNetwork'];
      delete val['showMethodColor'];
      delete val['serverName'];
      delete val['seqNo'];
      delete val['repeatedMethodCount'];
      delete val['pageName'];
      delete val['pacName'];
      delete val['methodName'];
      delete val['methodId'];
      delete val['level'];
      delete val['instanceType'];
      delete val['fqm'];
      delete val['destNetwork'];
      delete val['className'];
      delete val['asyncCall']; delete val['appName']; delete val['api'];
      delete val['repeatObj'];
      delete val['keyLine'];
      delete val['subType'];
      delete val['eventId'];
      delete val['calloutType'];
      delete val['asyncToBeMatchedId'];
      delete val['eventIdDark'];
      delete val['eventIdLight'];
      delete val['dynLogFlag'];
      delete val['severityBgColorField'];

    })
    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteria.replace(/<[^>]*>/g, ""),
      strSrcFileName: 'MethodSummaryReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(data)
    };
    let downloadFileUrl = '';

    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        downloadFileUrl = "// " + this.commonService.host + ':' + this.commonService.port;
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true));
    }
    downloadFileUrl += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
        (this.openDownloadReports(res)));
    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
  }
  downloadReports(reports: string) {


    let renameArray = { "pN": "Package", "cN": "Class", "mN": "Method", "fG": "FunctionalGroup", "percent": "Percentage", "sT": "CumSelfTime(sec)", "avgST": "AvgSelfTime(ms)", "totWT": "CumWallTime(sec)", "avgWT": "AvgWallTime(ms)", "cumCPUST": "CumCpuSelfTime(sec)", "avgCPUST": "AvgCpuSelfTime(ms)", "min": "MinSelfTime(ms)", "max": "MaxSelfTime(ms)", "eC": "Count", "variance": "Variance", "waitTime": "WaitTime(ms)", "syncTime": "SyncTime(ms)", "iotime": "IOTime(ms)", "suspensiontime": "SuspensionTime(ms)" };
    let colOrder = ['Package', 'Class', 'Method', 'FunctionalGroup', 'Percentage', 'CumSelfTime(sec)', 'AvgSelfTime(ms)', 'CumWallTime(sec)', 'AvgWallTime(ms)', 'CumCpuSelfTime(sec)', 'AvgCpuSelfTime(ms)', 'MinSelfTime(ms)', 'MaxSelfTime(ms)', 'Count', 'Variance', 'WaitTime(ms)', 'SyncTime(ms)', 'IOTime(ms)', 'SuspensionTime(ms)'];
    let pNFlag = false;
    this.methodTimingData.forEach((val, index) => {
      if (val.hasOwnProperty('pN') === false) {
        delete val['pN'];
        pNFlag = true;
      }
      delete val['ID'];
      delete val['eT'];
      delete val['eN'];
      delete val['cT'];
      delete val['_$visited'];
      delete val['avgCPU'];
      delete val['sTOrg'];
      delete val["severityBgColorField2"];
      val['sT'] = (Number(val['sT']) / 1000).toFixed(2);
      if (Number(val['percent']) != 0 && Number(val['percent']) != 100)
        val['percent'] = Number(val['percent']).toFixed(3);
      val['totWT'] = (Number(val['totWT']) / 1000).toFixed(2);
      val['avgST'] = Number(val['avgST']).toFixed(3);
      val['avgWT'] = Number(val['avgWT']).toFixed(3);
    });

    if (pNFlag) {
      delete renameArray['pN'];
      colOrder.shift();
    }

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteria.replace(/<[^>]*>/g, ""),
      strSrcFileName: 'MethodSummaryReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.methodTimingData)
    };
    let downloadFileUrl = '';

    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        downloadFileUrl = "// " + this.commonService.host + ':' + this.commonService.port;
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true));
    }
    downloadFileUrl += '/' + this.id.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
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
    if (fieldValue == "avgCPUST") {
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
    }

    //this.hotSpotInfo = hotSpotInfo;
    this.methodTimingData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.methodTimingData = this.Immutablepush(this.methodTimingData, rowdata) });
    }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  //To open the download file from the particular path 
  openDownloadReports(res) {
    let url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;

    } else {
      url = decodeURIComponent(this.getHostUrl(true));
    }
    url += "/common/" + res;
    window.open(url);
  }
  ngOnDestroy() {
    /* window.removeEventListener('scroll', this.scroll, true);
     if (this.progress !== undefined && this.progress !== null) {
       this.progress.unsubscribe();
     }*/
  }

  htmlEncode(value: string) {
    return value.replace(/&#46;/g, '.');
  }
  openDialogforfilter() {
    this.filterDialog = true;
    this.MCTDialogFilters = true;
  }

  showColorMeaning() {
    this.showColor = true;
  }
  applyThresholdFilter() {
    this.isReorder = false;
    if (this.txtFlterMethodLevel == undefined || this.txtFlterMethodLevel == null || this.txtFilterWallTime == undefined || this.txtFilterWallTime == null || this.txtThresholdWallTime == undefined || this.txtThresholdWallTime == null) {
      alert('Please Fill all the values of Filter');
      return;
    }
    /* if(this.isEnableLevel)
     localStorage.setItem("ddrMCT_largedata",'0');
     else
     localStorage.setItem("ddrMCT_largedata",'1');*/
    if (this.selectedNegativeMethod && this.selectedNegativeMethod.length > 0) {
      this.filterMethods = "1";
      if (this.selectedPackageList.length > 0) {
        for (let k = 0; k < this.selectedNegativeMethod.length; k++) {
          let pkgClsindex = this.selectedNegativeMethod[k].lastIndexOf(".");
          let packageClassName = this.selectedNegativeMethod[k].substring(0, pkgClsindex);
          let packageName = packageClassName.substring(0, packageClassName.lastIndexOf("."));
          let className = packageClassName.substring(packageClassName.lastIndexOf(".") + 1, packageClassName.length);
          let methodName = this.selectedNegativeMethod[k].substring(pkgClsindex + 1, this.selectedNegativeMethod[k].length);
          console.log('pkgName ', packageName, ' , Class name ', className, ' ,methodName ', methodName);

          if (this.selectedPackageList.indexOf(packageName) != -1) {
            //console.log('package matched ', packageName);
            if (this.selectedActClss.indexOf(className) != -1) {
              // console.log('Class matched ', className);
              if (this.selectedActMethod.indexOf(methodName) != -1) {
                //  console.log('method matched ', methodName);
                alert('Positive and negative filter could not be same ');
                return;
              }
            }
          }

        }
      }
    }
    else
      this.filterMethods = "0";
    var endTimetoPass;
    var startTimetoPass = Number(this.trStartTime) - 900000;
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined) {
      var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.trEndTime) + 900000;
    }
    //  alert(this.selectedPackageList);
    // alert(this.selectedActClss);
    // alert(this.selectedActMethod);
    this.assignColsForMCT();
    if (this.selectedPackageList == undefined)
      this.selectedPackageList = [];
    if (this.selectedActClss == undefined)
      this.selectedActClss = [];
    if (this.selectedActMethod == undefined)
      this.selectedActMethod = [];
    var url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
    }
    // else if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL") {
    //   url =  "//" + this.getHostUrl();
    // }
    //  else {
    url = this.getHostUrl();
    // }
    this.loading = true;
    this.filterDialog = false;
    //console.log(this.ignoreFilterCallOuts);

    /*if(this.MCTDialogFilters == false)
    {
      this.showSeqDiag();
    }
    else
    {*/
    let methodCount = 50000;
    if (this.queryParams.methodsCount)
      methodCount = Number(this.queryParams.methodsCount.toString().replace(/,/g, ""));
    if (this.commonService.enableQueryCaching == 1) {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/fpDetailsMCT?cacheId=" + this.id.testRun + "&filterGreaterThan=" + this.txtFilterWallTime + "&filterTop=" + this.txtFlterMethodLevel + "&packageList=" + this.selectedPackageList.toString() + "&classList=" + this.selectedActClss.toString() + "&methodList=" + this.selectedActMethod.toString() + "&testRun=" + this.id.testRun + "&flowPathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&entryResponseTime=" + this.fpDuration + "&thresholdWallTime=" + this.txtThresholdWallTime + "&FromAngular=1&enableMergeCase=" + this.enableMergeCase + "&ignoreFilterCallouts=" + this.ignoreFilterCallOuts + '&negativeMethodsFilter=' + this.selectedNegativeMethod + "&methodCount=" + methodCount + "&filterMethods=" + this.filterMethods + "&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    }
    else {
      url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/fpDetailsMCT?filterGreaterThan=" + this.txtFilterWallTime + "&filterTop=" + this.txtFlterMethodLevel + "&packageList=" + this.selectedPackageList.toString() + "&classList=" + this.selectedActClss.toString() + "&methodList=" + this.selectedActMethod.toString() + "&testRun=" + this.id.testRun + "&flowPathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&entryResponseTime=" + this.fpDuration + "&thresholdWallTime=" + this.txtThresholdWallTime + "&FromAngular=1&enableMergeCase=" + this.enableMergeCase + "&ignoreFilterCallouts=" + this.ignoreFilterCallOuts + '&negativeMethodsFilter=' + this.selectedNegativeMethod + "&methodCount=" + methodCount + "&filterMethods=" + this.filterMethods + "&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    }
    this.ddrRequest.getDataUsingGet(url).pipe(timeout(this.commonService.ajaxTimeOut)).subscribe(res => {
      let mctData = <any>res;
      this.limit = 10;
      this.offset = 0;
      this.mctData = mctData.treedata.data;
      //if(this.uniqueMethodSignature.length == 0){
      this.uniqueMethodSignature = mctData.uniqueMethods;
      this.addPackageClassmethodList();
      //       }
      this.downloadMctData = mctData.data;
      if (this.downloadMctData.length == 0)
        this.showDownLoadReportIconMct = false;
      else
        this.showDownLoadReportIconMct = true;
      let fpMap = new Map();
      fpMap = mctData.fpsInfo;
      this.fpInstanceInfoKeys = Object.keys(fpMap);
      this.fpInstanceInfo = fpMap;
      this.repeatedMethodData[0] = mctData.repeatMethodsData;
      this.asyncExitMap = mctData.asynCallMap;
      this.mctData.forEach((val, index) => {
        if (index == 0) {
          let node = this.mctData[index];
          this.expandChildren(node);
          this.count = 0;

        }
        let fpMap = new Map();
        fpMap = mctData.fpsInfo;

      })
      this.queueTime = mctData.totalQueueTime;
      this.selfTime = mctData.totalSelfTime;
      this.mctAppliedFilter = "(Max Depth=" + this.formatter(this.txtFlterMethodLevel) + ", Min Wall Time =" + this.formatter(this.txtFilterWallTime) + "ms, Threshold =" + this.formatter(this.txtThresholdWallTime) + "ms" + ", Elapsed Threshold=" + this.formatter(this.txtThresholdelapsedTime);
      if (this.isEnabledQAS) {
        this.mctAppliedFilter += ", Total Thread Queue Time =" + this.formatter(this.queueTime) + "ms";
        this.mctAppliedFilter += ", Total Self Time =" + this.formatter(this.selfTime) + "ms";
      }
      this.mctAppliedFilter += ")";
      this.loading = false;
      // setTimeout(() => {
      //   this.loader = false;
      //   this.filterDialog = false;
      // }, 2000);
    },
      error => {
        this.loading = false;
        this.loader = false;
        if (error.hasOwnProperty('message')) {
          this.showError('Method Call Tree taking time due to large data. Please increase timeout duration.');
        }
        else {
          if (error.hasOwnProperty('statusText')) {
            this.showError(error.statusText);
            console.error(error);
          }
        }
      }
    )
    //}

    //this.getProgressBar();
    this.createFilterCriteria();
    //this.getMethodSummaryData();
    //this.showSeqDiag(); 
    this.toggleCallout = false;
    this.expandCollapseHint = "Show Callouts Expanded form";
  }

  /**
* 
* @param error notification
*/
  showError(msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  /** Validating Number input */
  validateQty(event): boolean {
    if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57))
      return false;
    else
      return true;
  }
  toggleNode(expandedForm) {
    //console.log("expande form value-------",expandedForm);
    this.mctData.forEach((val, index) => {
      //    console.log("mctData-----",val)
      val.expanded = expandedForm;
    });
    this.mctData = [...this.mctData];
  }
  showFPInsanceInfo() {
    console.log('fpinstanceinfo');
    this.fpDetails = true;
  }
  addPackageClassmethodList() {
    let packageList = [];
    let classList = [];
    let methodList = [];
    for (let k = 0; k < this.uniqueMethodSignature.length; k++) {
      let tempArr = this.uniqueMethodSignature[k].split(".");
      let methodN = this.concatArrayToString(tempArr.splice(tempArr.length - 1, 1));
      let classN = this.concatArrayToString(tempArr.splice(tempArr.length - 1, 1));
      let packageN = this.concatArrayToString(tempArr);
      if (packageN != "" && packageN != "-" && packageList.findIndex(x => x.label == packageN) == -1)
        packageList.push({ "label": packageN, "value": packageN });
      if (classN != "" && classN != "-" && classList.findIndex(x => x.label == classN) == -1)
        classList.push({ "label": classN, "value": packageN + "_" + classN });
      if (methodN != "" && methodN != "-" && classList.findIndex(x => x.label == methodN) == -1)
        methodList.push({ "label": methodN, "value": packageN + "_" + classN + "_" + methodN });

    }
    this.packageList = packageList;
    this.actualPackageList = packageList;
    this.actualClassList = classList;
    this.actualMethodList = methodList;
    this.classList = classList;
    this.methodList = methodList;
  }
  getClassList() {

    let classList = [];
    // let actualClass=[];
    //console.log(this.selectedPackageList);
    for (let i = 0; i < this.selectedPackageList.length; i++) {
      let pkg = this.selectedPackageList[i];
      //console.log(pkg+"classlist length"+this.classList.length)
      for (let j = 0; j < this.actualClassList.length; j++) {
        let value = this.actualClassList[j]['value'];
        //console.log(value+"package "+pkg);
        if (value.indexOf(pkg) != -1) {
          classList.push(this.actualClassList[j]);
        }
      }
    }
    let selectedActClss = [];
    for (let i = 0; i < classList.length; i++) {
      let classValue = classList[i]['value'];
      //  console.log("classvalue", classValue);
      for (let j = 0; j < this.selectedClassList.length; j++) {
        //   console.log("selectedValue", this.selectedClassList[j], "indexof value", this.selectedClassList[j].indexOf(classValue));
        if (classValue.indexOf(this.selectedClassList[j]) != -1)
          selectedActClss.push(classValue);
      }
    }
    if (this.selectedPackageList.length == 0) {
      this.addPackageClassmethodList();
      this.selectedActClss = [];
      this.selectedClassList = [];
      this.selectedActMethod = [];
      this.selectedMethodList = [];
    }
    else {
      this.classList = [];
      this.classList = classList;
      this.selectedClassList = selectedActClss;
      this.getMethodList();

      // this.selectedActClss=actualClass;
    }
  }
  getMethodList() {
    //console.log(this.selectedClassList);
    let methodList = [];
    let actualClass = [];
    for (let i = 0; i < this.selectedClassList.length; i++) {
      let cls = this.selectedClassList[i];
      let val = this.classList.find((obj) => { return obj.value == cls });
      //console.log(val);
      actualClass.push(val['label']);
      for (let j = 0; j < this.actualMethodList.length; j++) {
        let value = this.actualMethodList[j]['value'];
        //console.log(cls+"value-----------"+value);
        if (value.indexOf(cls) != -1) {
          methodList.push(this.actualMethodList[j]);
        }
      }
    }
    let selectedMethodList = [];
    for (let i = 0; i < methodList.length; i++) {
      let methodValue = methodList[i]['value'];
      // console.log("classvalue", methodValue);
      for (let j = 0; j < this.selectedMethodList.length; j++) {
        // console.log("selectedValue", this.selectedMethodList[j], "indexof value", this.selectedMethodList[j].indexOf(methodValue));
        if (methodValue.indexOf(this.selectedMethodList[j]) != -1)
          selectedMethodList.push(methodValue);
      }
    }
    // console.log("method list vaue--",methodList.toString());
    if (this.selectedClassList.length == 0) {
      this.methodList = Object.assign(this.actualMethodList);
      this.selectedActClss = [];
      this.selectedActMethod = [];
      this.selectedMethodList = [];
    }
    else {
      this.methodList = [];
      this.methodList = methodList;
      this.selectedMethodList = selectedMethodList;
      this.selectedActClss = actualClass;
    }
  }
  concatArrayToString(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
      str = str + arr[i];
      if (arr.length - 1 != i)
        str = str + ".";
    }
    return str;
  }
  applyDefaultValue() {
    this.txtFilterWallTime = 0;
    this.txtFlterMethodLevel = 100;
    this.txtThresholdWallTime = 1500;
    this.txtThresholdelapsedTime = 1000;
    //this.txtClassWidth = 300;
    this.selectedPackageList = [];
    this.selectedActClss = [];
    this.selectedActMethod = [];
    this.selectedClassList = [];
    this.selectedMethodList = [];
    this.addPackageClassmethodList();
    this.txtExpandCount = 25;
    this.isExpandCount = false;
    this.selectedNegativeMethod = undefined;
    this.ignoreFilterCallOuts = ['T,E', 'D', 'J,j', 'e', 't', 'a,A'];
    this.enableMergeCase = false;
    this.isEnabledQAS = true;
  }
  getActualMethodList() {
    let actMethod = [];
    for (let i = 0; i < this.selectedMethodList.length; i++) {
      let val = this.selectedMethodList[i];
      actMethod.push(this.actualMethodList.find((Object) => { return Object['value'] == val })['label']);
    }
    //console.log(actMethod);
    if (this.selectedMethodList.length == 0) {
      this.selectedActMethod = [];
    }
    else {
      this.selectedActMethod = [];
      this.selectedActMethod = actMethod;
    }

  }
  openAdjustColWidDia() {
    this.showAdjustDialog = true;
  }
  applyResetValue() {
    this.showColumnMCT = false;
    this.isReorder = false;
    this.columnOptionsForMCT = [];
    this.visibleColsForMCT = [];
    this.colsForMCT = JSON.parse(JSON.stringify(this.origcolsForMCT));
    this.list1 = [];
    for (let i = 0; i < this.colsForMCT.length; i++) {
      if (this.colsForMCT[i].action == true && this.colsForMCT[i].field !== 'methodName') {
        this.list1.push(this.colsForMCT[i]);
        this.visibleColsForMCT.push(this.colsForMCT[i].field);
      }
      this.columnOptionsForMCT.push({ label: this.colsForMCT[i].header, value: this.colsForMCT[i].field });
    }
    // console.log(this.origcolsForMCT);
    // console.log(this.colsForMCT);
    this.showColumnMCT = true;
  }
  loadNodeUpto(event) {
    //console.log("browser event -------------", event.originalEvent);
    //console.log("loadnode-----",event.node);
    try {
      this.count1 = 0;

      if (event.node.expanded || (event.node.expanded == undefined && event.node.children && event.node.children.length > 0)) {
        setTimeout(() => { this.loading = true; }, 0);

        setTimeout(() => { //alert("Hello");

          this.expandChildren1(event.node);
          this.mctData = [...this.mctData];
        }, 100);
      }
    }
    catch (error) {
      console.log(error);
    }
    //  console.log("after expandChldren loadnode-----",event.node);
  }

  onNodeRightClick(event, contextMenu) {
    console.log("inside this on node right cleck event >>>>>>>>>**********", event)
    console.log("inside this on node right cleck event this.selectedNode >>>>>>>>>**********", this.selectedNode)
    console.log("inside this on node right cleck event this.contextMenu >>>>>>>>>**********", contextMenu)
    if (this.selectedNode.data.fqm == "-" || this.selectedNode.data.fqm == "") {
      // contextMenu.hide(); 
      this.menuIte = this.menuIteCallOut;
    } else {
      // contextMenu.show();
      this.menuIte = this.menuIteMethod;
    }
  }

  showRepeatedData(node, index) {
    // console.log();
    this.textAreaRepeatedMethod = ""; //for argument text clearing in text view or repeated method table.
    this.rowRepeatedMethodInfo = [];
    /* For setting default state of paginator */
    let length = this.setPaginate['pageLinkSize'];
    let arry = [];
    for (let i = 1; i <= length; i++)
      arry.push(i);
    this.setPaginate['pageLinks'] = [];
    this.setPaginate['pageLinks'] = arry;
    this.setPaginate['_rows'] = 10;
    this.setPaginate['_first'] = 0;

    this.repeatedFQM = node.fqm;
    this.methodName = (node.methodName).replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
    if (this.repeatedFQM != "-")
      this.substringFQM = node.fqm;
    else
      this.substringFQM = this.methodName;
    if (this.repeatedFQM != "-" && node.fqm.length > 100)
      this.substringFQM = node.fqm.substring(0, 100) + "...";
    else if (node.methodName.length > 100)
      this.substringFQM = node.methodName.substring(0, 100) + "...";

    //  console.log("node data ",node.data);
    let key = node.methodId + "_" + node.level + "_" + node.methodName + "_" + node.keyLine;
    console.log(this.repeatedMethodData);
    let arr = this.repeatedMethodData[index][key];
    this.downloadRepeatMethod = JSON.parse(JSON.stringify(arr));
    console.log("arrr------------", arr);
    // console.log(arr.length);
    this.createColsForRepeatedData();
    this.repeatedMethodsData = arr;
    this.popCount = this.repeatedMethodsData.length;
    this.repeatedMethodsDatapop = [];
    this.limit = 10;
    this.offset = 0;
    if (this.limit > this.popCount)
      this.limit = Number(this.popCount);
    this.paginate({ "first": this.offset, "rows": this.limit - this.offset });
    this.showRepeatedDialogue = true;
    if (this.popCount <= 10) {
      this.showPaginationRepeat = false;
    }
  }
  paginate(event) {
    this.repeatedMethodsDatapop = [];

    this.limit = parseInt(event.rows) + parseInt(event.first);
    this.offset = parseInt(event.first);

    if (this.limit > this.popCount)
      this.limit = Number(this.popCount);

    for (let j = this.offset; j < this.limit; j++) {
      this.repeatedMethodsDatapop.push(this.repeatedMethodsData[j]);
    }
    this.sortRepeatMethod({ 'field': "timeStamp", 'order': '1' }, this.repeatedMethodsDatapop);
    this.rowRepeatedMethodInfo = this.repeatedMethodsDatapop[0];// setting default case for selection in mct
    this.textAreaRepeatedMethod = this.rowRepeatedMethodInfo['methodArgument']; //default case first row selection with argumenst being shown of first row.
  }
  createColsForRepeatedData() {
    this.colsForRepeatedData =
      [
        { field: 'methodArgument', header: 'Arguments', sortable: true, action: true, align: 'left', width: '30' },
        { field: 'timeStamp', header: 'ElapsedTime(ms)', sortable: 'custom', action: true, align: 'right', width: '20' },
        { field: 'wallTime', header: 'WallTime(ms)', sortable: 'custom', action: true, align: 'right', width: '20' },
        { field: 'percentage', header: 'Percentage', sortable: 'custom', action: true, align: 'right', width: '20' },
        { field: 'queueTime', header: 'Thread QueueTime', sortable: true, action: true, align: 'right', width: '20' },
        { field: 'selfTime', header: 'Self Time(ms)', sortable: 'custom', action: true, align: 'right', width: '20' },
        { field: 'cpuTime', header: 'CPU Time(ms)', sortable: 'custom', action: true, align: 'right', width: '20' },
        { field: 'waitTime', header: 'WaitTime(ms)', sortable: true, action: false, align: 'right', width: '20' },
        { field: 'syncTime', header: 'SyncTime(ms)', sortable: true, action: false, align: 'right', width: '20' },
        { field: 'ioTime', header: 'IOTime(ms)', sortable: true, action: false, align: 'right', width: '20' },
        { field: 'suspensionTime', header: 'SuspensionTime(ms)', sortable: false, action: false, align: 'right', width: '20' },
        { field: 'threadId', header: 'ThreadId', sortable: 'custom', action: true, align: 'right', width: '20' },
        { field: 'threadName', header: 'Thread', sortable: true, action: true, align: 'left', width: '50' },
        { field: 'lineNumber', header: 'Line No.', sortable: 'custom', action: false, align: 'right', width: '20' },

      ];
    this.cOForRepeatedMethod = [];
    for (let i = 0; i < this.colsForRepeatedData.length; i++) {
      this.cOForRepeatedMethod.push({ label: this.colsForRepeatedData[i].header, value: this.colsForRepeatedData[i].field });
    }
    this.vCForRepeatedmethod = ['methodArgument', 'wallTime', 'timeStamp', 'queueTime', 'selfTime', 'cpuTime', 'percentage', 'threadId', 'threadName'];
  }
  expandChildren1(node: TreeNode) {
    //console.log("node value-------",node);  
    if (node && node.data.repeatObj) {
      let repeatObj = node.data.repeatObj;
      this.updateMethodprop(repeatObj, node.data);
    }
    if (node && node.children) {
      //  console.log("children calue----------",node.children);
      if (node.children.length > 50) {
        this.childrenObj[node.data.lineNumber] = node.children;
        this.preNode[node.data.lineNumber] = node;
        this.expandSameLeveluptoFixLevel(node, 0, node.data.lineNumber, node.children.length);
      }
      // console.log(node.children.length);
      else if (this.count1 < 20) {
        // console.log('node.expandednode.expanded  ',node);
        node.expanded = true;
        // console.log('**************',node.children);
        for (let cn of node.children) {
          this.count1 += 1;
          if (cn && cn.data.repeatObj) {
            //alert("in this case");
            let repeatObj = cn.data.repeatObj;
            this.updateMethodprop(repeatObj, cn.data);
          }
          if (cn.children != undefined && cn.children.length <= 50) {
            // console.log("less than 50 children",cn.children.length);
            this.expandChildren1(cn);
          }
          else if (cn.children != undefined) {
            // console.log(" more than 50 children");
            this.childrenObj[cn.data.lineNumber] = cn.children;
            this.preNode[cn.data.lineNumber] = cn;
            this.expandSameLeveluptoFixLevel(cn, 0, cn.data.lineNumber, cn.children.length);
          }

        }
      }
    }
    setTimeout(() => { this.loading = false }, 100);
  }

  sortRepeatMethod(event, tempData) {
    // console.log("sort Repeated Method called",event);
    let fieldValue = event["field"];
    if (fieldValue == "timeStamp" || fieldValue == "cpuTime" || fieldValue == "threadId" || fieldValue == "percentage" || fieldValue == "selfTime" || fieldValue == "lineNumber") {
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
        var temp = event["field"];
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return 1;
          } else if (b[temp].startsWith('<')) {
            return -1;
          }

          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = event["field"];
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return -1;
          } else if (b[temp].startsWith('<')) {
            return 1;
          }
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }

    this.repeatedMethodsDatapop = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.repeatedMethodsDatapop = this.Immutablepush(this.repeatedMethodsDatapop, rowdata) });
    }
  }
  valEnteredKeyN(event) {
    //console.log(event);
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode == 0) || (event.keyCode == 8))
      return true;
    else
      return false;
  }

  showHideColumnForRepeatedData() {
    if (this.vCForRepeatedmethod.length !== 0) {
      for (let i = 0; i < this.colsForRepeatedData.length; i++) {
        for (let j = 0; j < this.vCForRepeatedmethod.length; j++) {
          if (this.colsForRepeatedData[i].field === this.vCForRepeatedmethod[j]) {
            this.colsForRepeatedData[i].action = true;
            break;
          } else {
            this.colsForRepeatedData[i].action = false;
          }
        }
      }
    }
    else {
      for (let i = 0; i < this.colsForRepeatedData.length; i++) {
        this.colsForRepeatedData[i].action = false;
      }
    }
  }
  expandSetter() {
    if (!this.isExpandCount) {
      this.txtExpandCount = 25;
    }
  }
  showAllData() {
    this.txtFilterWallTime = 0;
    this.txtFlterMethodLevel = 100;
    //  this.txtClassWidth = 300;
    this.txtThresholdWallTime = 1500;
    this.txtThresholdelapsedTime = 1000;
    this.applyThresholdFilter();
  }
  searchMethodName(event) {
    let arrayVal = [];

    this.uniqueMethodSignature.forEach((val, index) => {
      //  console.log(val,">>>   val")
      if (val.indexOf(event.query) != -1)
        arrayVal.push(val);
    });

    this.negativeMethodArr = arrayVal;
  }
  callHideFunction(index) {
    this.childMCTPositionTop = this.childMCTPositionTop - 150;
    console.log("calling hide function---");
    let values = [];
    for (let i = 0; i < this.values.length; i++) {
      if (index != i)
        values.push(this.values[i]);
    }
    this.visibleArr[index] = false;
    console.log(values);
    this.values = values;
    // this.values[this.values.length-1];
    // console.log(this.values[this.values.length-1]);
    //  return true;
  }
  decodeHTMLString(str: string) {
    return str.replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
  }

  openExpandedCallouts() {
    this.loading = true;
    //this.loader=true;
    // this.commonService.loaderForDdr = true;
    // alert("In this case");
    var endTimetoPass;
    var startTimetoPass = Number(this.trStartTime) - 900000;
    if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined || isNaN(this.trEndTime)) {
      var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.trEndTime) + 900000;
    }
    //var url = "//"+ this.getHostUrl() + '/' + this.id.product+"/analyze/drill_down_queries/file.json";
    let new_MCT_url = '';


    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        new_MCT_url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        new_MCT_url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        new_MCT_url = "// " + this.commonService.host + ':' + this.commonService.port;
    }
    // else if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL")
    //   new_MCT_url = "//" + this.getHostUrl();
    // else {
    new_MCT_url = this.getHostUrl(true);
    //}
    // console.log(this.ignoreFilterCallOuts);
    let methodCount = 50000;
    if (this.queryParams.methodsCount)
      methodCount = Number(this.queryParams.methodsCount.toString().replace(/,/g, ""));
    new_MCT_url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/fpDetailsMCT?filterGreaterThan=" + this.txtFilterWallTime + "&filterTop=" + this.txtFlterMethodLevel + "&packageList=&classList=&methodList=&testRun=" + this.id.testRun + "&flowPathInstance=" + this.queryParams.flowpathInstance + "&strStartTime=" + startTimetoPass + "&strEndTime=" + endTimetoPass + "&entryResponseTime=" + this.fpDuration + "&thresholdWallTime=" + this.txtThresholdWallTime + "&FromAngular=2&enableMergeCase=" + this.enableMergeCase + "&ignoreFilterCallouts=" + this.ignoreFilterCallOuts + "&methodCount=" + methodCount + "&filterMethods=" + this.filterMethods + "&thresholdDiffElapsedTime=" + this.txtThresholdelapsedTime;
    this.loading = false;
    this.ddrRequest.getDataUsingGet(new_MCT_url).subscribe(res => {
      let data = <any>res;
      // this.loader = false;
      this.loading = false;
      // this.commonService.loaderForDdr = false;
      this.mctData = data.treedata;
      this.downloadMctData = data.data;
      this.repeatedMethodData[0] = data.repeatMethodsData;
      this.addPackageClassmethodList();
      let fpMap = new Map();
      fpMap = data.fpsInfo;
      this.queueTime = data.totalQueueTime;
      this.selfTime = data.totalSelfTime;
      this.mctAppliedFilter = "(Max Depth=" + this.formatter(this.txtFlterMethodLevel) + ", Min Wall Time =" + this.formatter(this.txtFilterWallTime) + "ms, Threshold =" + this.formatter(this.txtThresholdWallTime) + "ms" + ", Elapsed Threshold=" + this.formatter(this.txtThresholdelapsedTime);
      if (this.isEnabledQAS) {
        this.mctAppliedFilter += " ,Total Thread Queue Time=" + this.formatter(this.queueTime) + "ms";
        this.mctAppliedFilter += " ,Total Self Time=" + this.formatter(this.selfTime) + "ms";
      }
      this.mctAppliedFilter += ")";

      this.fpInstanceInfoKeys = Object.keys(fpMap);
      this.fpInstanceInfo = fpMap;
      this.asyncExitMap = data.asynCallMap;
      if (this.downloadMctData.length == 0)
        this.showDownLoadReportIconMct = false;
      else
        this.showDownLoadReportIconMct = true;
      this.mctData.forEach((val, index) => {
        if (index == 0) {
          let node = this.mctData[index];
          this.expandChildren(node);
          this.count = 0;

        }

      })
      this.mctData = [...this.mctData];
    }, err => {
      console.log('Something went wrong ', err);
      this.loading = false;
      // this.commonService.loaderForDdr = false;

    });
  }


  toggleExpandedCallout() {                                 //works like toggele button
    if (!this.toggleCallout) //false
    {
      this.toggleCallout = true;
      this.expandCollapseHint = "Show Callouts Collapsed form";
      this.openExpandedCallouts();
    }
    else {                           //true 
      this.toggleCallout = false;
      this.expandCollapseHint = "Show Callouts Expanded form";
      this.getMCTDataFunc();
    }
  }
  scrollnextTO(node) {

    let array1 = []
    try {
      this.asyncCallRef.map((item, index, array) => {
        // console.log("asyncTo be matchedd id ",node.data.asyncToBeMatchedId,"  native id-------",item.nativeElement.id);
        // console.log("method name---",node.data.methodName, "nativelenmt id ----",item.nativeElement.innerText);
        // console.log("check condition---------------",(node.data.methodName.trim() != item.nativeElement.innerText.trim()));
        if (node.asyncToBeMatchedId == item.nativeElement.id && node.methodName.trim() != item.nativeElement.innerText.trim())
          array1.push(item);
        else
          item.nativeElement.parentElement.parentElement.parentElement.classList.remove('ui-state-highlight');
      })
      console.log(array1, "-----arraylength", array1.length);
      // console.log(array1[0].nativeElement.parentElement.parentElement.parentElement);
      if (array1.length == 1) {
        array1[0].nativeElement.parentElement.parentElement.parentElement.classList.add('ui-state-highlight');
        console.log(array1[0].nativeElement.parentElement.parentElement.parentElement);
        array1[0].nativeElement.scrollIntoView(false);
        return true;
      }
    }
    catch (e) {
      console.log("exception case")
      return false;
    }
    return false;
  }
  scrollnextTOChanges(node) {

    let array1 = []

    this.asyncCallRef.changes.subscribe(list => {
      console.log("lsts value", list);
      list.map((item, index, array) => {
        //  console.log("asyncTo be matchedd id ",node.data.asyncToBeMatchedId,"  native id-------",item.nativeElement.id);
        //  console.log("method name---",node.data.methodName, "nativelenmt id ----",item.nativeElement.innerText);
        //  console.log("check condition---------------",(node.data.methodName.trim() != item.nativeElement.innerText.trim()));
        if (node.asyncToBeMatchedId == item.nativeElement.id && node.methodName.trim() != item.nativeElement.innerText.trim())
          array1.push(item);
        else
          item.nativeElement.parentElement.parentElement.parentElement.classList.remove('ui-state-highlight');
      })
      console.log(array1, "-----arraylength", array1.length);
      console.log(array1[0].nativeElement.parentElement.parentElement.parentElement);
      if (array1.length == 1) {
        array1[0].nativeElement.parentElement.parentElement.parentElement.classList.add('ui-state-highlight');
        console.log(array1[0].nativeElement.parentElement.parentElement.parentElement);
        array1[0].nativeElement.scrollIntoView(false);
      }
    });


  }

  getAsyncExit(node) {
    let alreadyExpanded = this.scrollnextTO(node);
    if (!alreadyExpanded) {
      console.log("sequence no", node.seqNo);
      let seqNo = node.seqNo;
      // let toMatchSqNo=seqNo.substring(seqNo.lastIndexOf(".")+1, seqNo.length)

      let toMatchSqNo = node.asyncToBeMatchedId;
      let lineNoAsync = this.asyncExitMap[toMatchSqNo];
      console.log("getLineNoForSeqNo------" + lineNoAsync);
      this.getParentSeqNo(node, node, lineNoAsync);
    }
  }

  getParentSeqNo(firstNode, node, lineNumber) {

    // console.log("parent seqn no vaalu-----", node,"----line number----------------",lineNumber)
    let parentInfo = node.parent;
    if (!parentInfo) {
      this.mctData.forEach((val, index) => {
        let nodeIndex = this.mctData[index];
        if (nodeIndex.data.lineNumber > node.data.lineNumber && nodeIndex.children) {
          node = nodeIndex
          node.expanded = true;
        }
      });
    }
    else
      node = node.parent;
    console.log("node value--------------", node);
    if (node.data.lineNumber < lineNumber) {
      let index1 = 0;
      let childrenArr = node.children;
      console.log("childrn arrr===", childrenArr)
      for (let i = 0; i < childrenArr.length; i++) {
        let val = childrenArr[i];
        // console.log(val.data.lineNumber,"----------------to macthed linenUmber----",lineNumber)
        if (Number(val.data.lineNumber) >= Number(lineNumber)) {
          console.log("macthed less tha case");
          index1 = i;
          break;
          //return false;
        }
      }
      //   console.log("index 1 value------------", index1);
      //   console.log("children line unumber----------",childrenArr[index1].data.lineNumber,"linenumber--",lineNumber,"check condition ",(childrenArr[index1].data.lineNumber == lineNumber))
      if (index1 == 0)
        this.getParentSeqNo(firstNode, node, lineNumber)
      else if (childrenArr[index1].data.lineNumber == lineNumber) {
        console.log("eqal to case got ");
        this.scrollnextTOChanges(firstNode);
      }
      else if (childrenArr[index1].data.lineNumber < lineNumber && childrenArr[index1 + 1].data.lineNumber) {
        this.expandChildren(childrenArr[index1]);
      }

    }
  }
  rowTrackBy(index: number, row: any) { return row.id; }
  resizingColumns($event) {
    // console.log("elemtn value",$event.element,"delta",$event.delta);
    let headerName = $event.element.innerText.trim();
    // console.log("header name vvlaue----",headerName);
    this.colsForMCT.forEach((val, index) => {
      console.log("index value---", index, "value------", val);
      if (headerName == val.header) {
        //    console.log("valfilef value-------"+val.field);
        val.width = Number(val.width.replace("px", '')) + $event.delta;
        val.width = val.width + "px";
        //    console.log("width value-------",val.width);
        // break;
      }
      else {
        let width = 0;
        if ($event.delta < 0)
          width = Number(val.width.replace("px", '')) + 20;
        else
          width = Number(val.width.replace("px", '')) - 20;
        if (width > 10)
          val.width = width + "px";
      }
    })
    //    console.log(this.colsForMCT);
    this.colsForMCT = [...this.colsForMCT];
  }

  getRowRepeatedMethodInfo(data) {
    this.textAreaRepeatedMethod = this.rowRepeatedMethodInfo['methodArgument'];
  }
  openDynamicLoggerReport(node) {
    console.log("node data for dynamic logging***", node)
  }

}
export interface TrackPointConfig {

  id: number;
  lno: number;
  traceAll: boolean;
  traceAllArgs: boolean;
  traceRetVal: boolean;
  traceAllClsFlds: boolean;
  traceAllLclVars: boolean;
  localVarList: String;
  classFldList: String;
  message: String;
  fqm: String;
  hitLimit: number;
}

export interface ProfileData {
  profList: string[];
  profile: string[];
  msg: string[];
  profileName: string;
  profileDesc: string;
  selectedProfile: string;
}
