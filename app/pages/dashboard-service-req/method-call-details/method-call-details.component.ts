import { Component, OnInit, ViewEncapsulation, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { MethodCallDetailsData, MethodCallDetailsFilterClasses, MethodCallDetailsFilterMethods, MethodCallDetailsFilterPackage, MethodCallDetailsMultiselct, MethodCallDetailsTable, MethodCallDetailsTableHeaderCols, MethodCallDetailsTableLoadPayload } from './service/method-call-details.model';
import { MethodCallDetailsService } from './service/method-call-details.service';
import { MethodCallDetailsLoadingState, MethodCallDetailsLoadedState, MethodCallDetailsLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState, childFlowpathLoadingState, childFlowpathLoadedState, childFlowpathErrorState } from './service/method-call-details.state';
import { LazyLoadEvent, MenuItem, OverlayPanel, TreeNode } from 'primeng';
import { FlowPathDialogComponent } from './flow-path-dialog/flow-path-dialog.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Subscription } from 'rxjs';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DrilldownService } from '../../drilldown/service/drilldown.service';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { SessionService } from 'src/app/core/session/session.service';
import { DDRRequestService } from '../../../pages/tools/actions/dumps/service/ddr-request.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

//import { DynamicDiagnosticsComponent } from '../../../shared/common-config-module/components/dynamic-diagnostics';
//import { DynamicLoggingComponent } from '../../../shared/common-config-module/components/dynamic-logging';


interface Package {
  name: string,
  code: string
}

@Component({
  selector: 'app-method-call-details',
  templateUrl: './method-call-details.component.html',
  styleUrls: ['./method-call-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MethodCallDetailsComponent implements OnInit {

  packages: Package[];
  data: MethodCallDetailsData;
  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  toggleCallout: boolean = false;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  selectedRow: MethodCallDetailsTable;
  displayBasic: boolean;
  isOn: number;
  displayChildRowDetails: boolean;
  mask: boolean = true;
  downloadOptions: MenuItem[];
  itemsall: MenuItem[];
  childRowInfo: any;
  displayDetails: boolean;
  displayFlowpathInstance: boolean;
  //isEnabledColumnFilter: boolean = false;
  //filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  methodcallData: TreeNode[];
  mctData: TreeNode[];
  totalRecords = 0;
  alldata: TreeNode[];
  alldatanew: TreeNode[];
  argsForflowpathDialogData: any;
  subscribeMethodcallDetails: Subscription;
  multiselectobj: MethodCallDetailsMultiselct;
  txtThresholdWallTime: number = 1500;
  txtThresholdelapsedTime: number = 1000;
  txtFilterWallTime: number = 0;
  txtFlterMethodLevel: number = 100;
  queueTime: string;
  selfTime: string;
  packageList: MethodCallDetailsFilterPackage[];
  classList: MethodCallDetailsFilterClasses[];
  methodList: MethodCallDetailsFilterMethods[];
  actualPackageList: Object[];
  actualClassList: Object[];
  actualMethodList: Object[];
  selectedActClss: string[] = [];
  selectedActMethod: string[] = [];
  selectedPackageList: string[] = [];
  selectedClassList: string[] = [];
  selectedMethodList: string[] = [];
  selectedNegativeMethod: string[] = [];
  uniqueMethodSignature: string[] = [];
  negativeMethodArr: string[];
  isExpandCount: boolean = false;
  filterDialog: boolean = false;
  txtExpandCount: number = 25;
  isEnabledQAS: boolean = true;
  showExpandBtn: boolean = false;
  mctAppliedFilter: string = "";
  reportID:any;
  ignoreFilterCallOuts: string[] = ['T,E', 'D', 'J,j', 'e', 't', 'a,A'];
  // @ViewChild('flowPathDialog', { read: FlowPathDialogComponent }) flowPathDialog: FlowPathDialogComponent;
  isFlowpathDialog: boolean = false;
  repeatedMethodData: any[] = [];
  repeatedFQM: any;
  methodName: any;
  substringFQM: any;
  dataForRepeatedMethods: any;
  repeatedMethodtable: any;
  argsForRepeatedMethods: any[];
  count1: number;
  count: number = 0;
  childrenObj: Object = {};
  preNode: Object = {};
  fpDuration: number;
  expandCollapseHint: string = "Show Callouts Expanded form";
 selectedNode: TreeNode;
  contextMenuIte: MenuItem[];
  contextMenuIteCallOut: MenuItem[];
  contextMenuIteMethod: MenuItem[];
  methodDetails: boolean = false;
  showAutoInstrPopUp:boolean = false;
  argsForAIDDSetting:any[];
  // regarding for method details
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
  threadId:any;
  pagename: any;
  returnvalue: any;
  timeStamp: any;
  methodDetailsHeaderName:string;
  queryParams:any;
  testRun: string;
  productName: string;
  values:Object[]=[];
childMCTPositionTop:number=20;
  
visibleArr:boolean[]=[];
openDLDialogFromButton:boolean=false;
fpInstanceInfoKeys: any[] = [];
fpInstanceInfo: any;
downloadMctData: any
dynFqm: any;
FQCforDL:any;
dynFpInstance:any;
dynTierName:string ="";
dynServerName:string ="";
dynAppName:string ="";
dynFqc: any;
argsForDynamicLogging:any[];
ShowCommonDLModule:boolean = false;
dynEntrySeqNum:any;
breadcrumb: BreadcrumbService;
mctNote:string='Note: Only instrumented methods shown in method call tree. There may be other non-instrumented methods called in between methods having parent child relationship in method call tree.';


  constructor(private methodCallService: MethodCallDetailsService,
    private drillDownService: DrilldownService,
    private f_ddr: DdrPipe,
    private dashboardServiceReqService: DashboardServiceReqService,
    private sessionService: SessionService,
    private ddrRequest:DDRRequestService,
    breadcrumb: BreadcrumbService
    ) {
      this.breadcrumb = breadcrumb;
  }

  ngOnInit(): void {
    const me = this;

    me.testRun = this.sessionService.testRun.id; //testrun
    me.productName = this.sessionService.session.cctx.prodType; // product name. 
    this.queryParams = me.sessionService.getSetting("fpRowdata"); //stores current flowpath row data.

    me.applyDefaultValue();
    me.loadMct();
    this.isOn = 1;

    this.subscribeMethodcallDetails = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
      me.loadMct();
  });

  this.contextMenuIte = [
    { label: 'Method Details',command: (event) => this.viewMethodDetail(this.selectedNode) },
    ];

    me.itemsall = [
      {
        label: 'Start Instrumentation',
        command: (event: any) => {
          this.openAutoInstDialog();
        },
      },
      {
        label: 'View Flowpath Instance',
        command: (event: any) => {
          this.openflowPathDialog();
        },
      },
      {
        label: this.expandCollapseHint,
        command:(event:any) =>{
          this.toggleExpandedCallout();
        }
      },
      {
        label: 'Dynamic Logging',
        command:(event:any) =>{
          this.openDLDialog();
        }
      }
    ]

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports("pdf");
        }
      }
    ]
  }

  showInstrumentationDetails() {
    this.displayDetails = true;
    this.showAutoInstrPopUp =true;
  }
  openflowPathDialog() {
    this.isFlowpathDialog = true;
  }

  showFlowpathInstance() {
    this.displayFlowpathInstance = true;
  }

  showRepeatedData(node, index, flag) {
    this.isOn = flag;
    console.log("node**************>>>>>", node);
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
    //  console.log(this.repeatedMethodData);
    let arr = this.repeatedMethodData[index][key];
    this.dataForRepeatedMethods = arr;
    this.argsForRepeatedMethods = [this.dataForRepeatedMethods, this.repeatedMethodtable]
    console.log("this.argsForRepeatedMethods------------>>>>>>>>>>>>>", this.argsForRepeatedMethods);
  }

  backToMCTReport(flag) {
    this.isOn = flag;
  }

  // selectRow(event,row: MethodCallDetailsTable, overlaypanel: OverlayPanel,rowData) {
  //   this.selectedRow = row;
  //   overlaypanel.toggle(event);
  //   //console.log("Row Data",rowData);

  // }

  onNodeRightClick(event,contextMenu){
    // console.log("inside this on node right cleck event >>>>>>>>>**********",event)
    console.log("inside this on node right cleck event this.selectedNode >>>>>>>>>**********",this.selectedNode)
    console.log("inside this on node right cleck event this.contextMenu >>>>>>>>>**********",contextMenu)
    if(this.selectedNode.data.fqm =="-" || this.selectedNode.data.fqm == ""){
      this.contextMenuIte = this.contextMenuIteCallOut;
    }else{
      this.contextMenuIte = this.contextMenuIteMethod;
    }
  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  closeDialog() {
    this.displayBasic = false;
  }

  // selectChild(rdata,e){
  //   // e.preventDefault();
  //   console.log("***************Row Data*******selectChild*********",rdata);
  //   this.childRowInfo = rdata;
  //   this.methodname = rdata.data.methodName;
  //   this.displayChildRowDetails = true;
  // }

  // to show method details in popup dialog

  viewMethodDetail(node) {   
  console.log("node value--------",node);
  this.methodname = node.data.methodName; 
  this.tiername = node.data.tierName;
  this.servername = node.data.serverName;
  this.appname = node.data.appName;
  this.servername = node.data.serverName;
  this.tiername = node.data.tierName;
  this.packagename = node.data.pacName;
  this.classname = node.data.className;
  if(node.data.methodArgument)
  this.argument = node.data.methodArgument;
  this.pagename = node.data.pageName;
  if(this.pagename === "")
  this.pagename="-";
  if(node.data.threadName)
  this.threadname = node.data.threadName
  this.threadId = node.data.threadId;
  this.starttime = node.data.startTime;
  this.walltime = node.data.wallTime;
  this.returnvalue = node.data.return;
  this.cputime = node.data.cpuTime;
  this.timeStamp = node.data.timeStamp;
  this.percentage = Number(node.data.percentage).toFixed(2);
  if(node.data.fqm == '-')
  this.methodDetailsHeaderName ="Callout Details";
  else
  this.methodDetailsHeaderName="Method Details";
    // this.methodDetails = true;
    this.displayChildRowDetails = true;
}

htmlencodeFormat(value) {
  if (value != '' && value != '-' && value != undefined) {
    return ((value).replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n"));
  }
  else {
  return '-';
  }
   
}

  loadMct() {
    const me = this;
    me.getContextMenuItem();
    me.reportID = me.sessionService.getSetting("reportID");
    if(me.reportID === "ATF" || me.reportID === "isFromTrxnTableMCT"){
      me.methodCallService.loadFromTrxFlowmap().subscribe(
        (state: Store.State) => {
          if (state instanceof MethodCallDetailsLoadingState) {
            me.onLoading(state);
            return;
          }
          if (state instanceof MethodCallDetailsLoadedState) {
            me.onLoaded(state);
            me.sessionService.setSetting("reportID", "AFT");
            return;
          }
        },
        (state: MethodCallDetailsLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }else{
     me.methodCallService.load().subscribe(
       (state: Store.State) => {
         if (state instanceof MethodCallDetailsLoadingState) {
           me.onLoading(state);
           return;
        }
         if (state instanceof MethodCallDetailsLoadedState) {
           me.onLoaded(state);
           return;
        }
      },
      (state: MethodCallDetailsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    }
  }

  private onLoading(state: MethodCallDetailsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MethodCallDetailsLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: MethodCallDetailsLoadedState) {
    const me = this;
    me.assignmctdata(state);
    me.error = null;
    me.getAppliedFilter();

    me.loading = false;
    if (me.data) {
      me.empty = false;
      if (!me.data.treeTable.data && me.data.treeTable.data == null) {
        me.emptyTable = true;
      }

    } else {
      me.empty = true;
    }
    console.log("************me.data**********", me.data);
    this.argsForflowpathDialogData = me.data.dataTable;
    this.repeatedMethodData[0] = me.data.repeatMethodsData;
    this.repeatedMethodtable = me.data.repeatedCalloutTable;
    me.cols = me.data.treeTable.headers[0].cols;
    me._selectedColumns = [];
    for (const c of me.data.treeTable.headers[0].cols)
      if (c.selected)
        me._selectedColumns.push(c);


  }

  getContextMenuItem(){
    const me =this;
    this.contextMenuIte = [
      { label: 'Method Details',command: (event) => this.viewMethodDetail(this.selectedNode) },
      ];
      this.contextMenuIteCallOut = [
        { label: 'Method Details',command: (event) => this.viewMethodDetail(this.selectedNode) },
      ];
      this.contextMenuIteMethod =[
        { label: 'Method Details',command: (event) => this.viewMethodDetail(this.selectedNode) },
      ];
      if(me.drillDownService.interceptor.enableViewSourceCode !== 1 || me.drillDownService.interceptor.enableViewSourceCode !== 0) {
        this.checkValue();
       }
       else if(me.drillDownService.interceptor.enableViewSourceCode === 1) {
        this.contextMenuIte.push(
          { label: 'View Source Code',command: (event) => this.commonModuleCall(this.selectedNode) }
        );
        this.contextMenuIteMethod.push(
          { label: 'View Source Code',command: (event) => this.commonModuleCall(this.selectedNode) }
        );
       }

  }

  checkValue() {
    const me = this;
    let url = this.getHostUrl() + '/' + this.productName.toLowerCase() + '/v1/cavisson/netdiagnostics/webddr/enableViewSourceCode';
    this.ddrRequest.getDataUsingGet(url).subscribe((data) => {
      me.drillDownService.interceptor.enableViewSourceCode = data
      if (me.drillDownService.interceptor.enableViewSourceCode === 1) {
        this.contextMenuIte.push(
          { label: 'View Source Code', command: (event) => this.commonModuleCall(this.selectedNode) }
        );
        this.contextMenuIteMethod.push(
          { label: 'View Source Code', command: (event) => this.commonModuleCall(this.selectedNode) }
        );
      }
    })
  }


  //To show Applied filters
  getAppliedFilter() {
    const me = this;
    let threadQueueTime =me.data.totalQueueTime;
    let totalSelfTime = me.data.totalSelfTime;
    // console.log("me.data.totalSelfTime****",threadQueueTime,"************-------",totalSelfTime);
    me.mctAppliedFilter = "(Max Depth=" + me.drillDownService.interceptor.MctFilterFormatter(Number(me.methodCallService.filterTop)) 
                                        + ", Min Wall Time =" + me.drillDownService.interceptor.MctFilterFormatter(Number(me.methodCallService.filterGreaterThan)) 
                                        + "ms, Threshold =" + me.drillDownService.interceptor.MctFilterFormatter(Number(me.methodCallService.thresholdWallTime)) + "ms" 
                                        + ", Elapsed Threshold=" 
                                        + me.drillDownService.interceptor.MctFilterFormatter(Number(me.methodCallService.thresholdDiffElapsedTime));
    if (this.isEnabledQAS) {
      this.mctAppliedFilter += " ,Total Thread Queue Time=" + me.drillDownService.interceptor.MctFilterFormatter(threadQueueTime) + "ms";
      this.mctAppliedFilter += " ,Total Self Time=" + me.drillDownService.interceptor.MctFilterFormatter(totalSelfTime) + "ms";
    }
    this.mctAppliedFilter += ")";

  }


  //called while expanding a perticular node
  loadNodeUpto(event) {
    try {
      this.count1 = 0;

      if (event.node.expanded || (event.node.expanded == undefined && event.node.children && event.node.children.length > 0)) {
        setTimeout(() => { this.loading = true; }, 0);

        setTimeout(() => {
          //If given node has recursive child node(s).
          this.expandChildrenOne(event.node);
          this.mctData = [...this.mctData];
        }, 100);
      }
    }
    catch (error) {
      console.log(error);
    }
  }



  expandChildrenOne(node: TreeNode) {
    if (node && node.data.repeatObj) {
      let repeatObj = node.data.repeatObj;
      this.updateMethodprop(repeatObj, node.data);
    }
    if (node && node.children) {
      if (node.children.length > 50) {
        this.childrenObj[node.data.lineNumber] = node.children;
        this.preNode[node.data.lineNumber] = node;
        this.expandSameLeveluptoFixLevel(node, 0, node.data.lineNumber, node.children.length);
      }
      else if (this.count1 < 20) {
        node.expanded = true;
        for (let cn of node.children) {
          this.count1 += 1;
          if (cn && cn.data.repeatObj) {
            let repeatObj = cn.data.repeatObj;
            this.updateMethodprop(repeatObj, cn.data);
          }
          if (cn.children != undefined && cn.children.length <= 50) {
            //recursive calling in case of further child node(s) available
            this.expandChildrenOne(cn);
          }
          else if (cn.children != undefined) {
            this.childrenObj[cn.data.lineNumber] = cn.children;
            this.preNode[cn.data.lineNumber] = cn;
            //paginate if childs availble more than 50 
            this.expandSameLeveluptoFixLevel(cn, 0, cn.data.lineNumber, cn.children.length);
          }

        }
      }
    }
    setTimeout(() => { this.loading = false }, 1000);
  }

//for thread callout tree
getChildFLowpathsData(nodeRef)
{ 
console.log("fetch child flowpath data",nodeRef);
this.childFlowpathLoad(nodeRef);

}

//For Child flowpathdata to get Thread and http callout data
childFlowpathLoad(nodeData) {
  const me = this;
  me.methodCallService.loadForchlidFlowpath(nodeData).subscribe(
    (state: Store.State) => {
      if (state instanceof childFlowpathLoadingState) {
        me.onchildFlowpathLoading(state);
        return;
      }
      if (state instanceof childFlowpathLoadedState) {
        me.onchildFlowpathLoaded(state,nodeData);
        return;
      }
    },
    (state: childFlowpathErrorState) => {
      me.onchildFlowpathLoadingError(state);
    }
  );
}


onchildFlowpathLoaded(state: childFlowpathLoadedState,noderef) {
    const me = this;
    me.error = null;
    var data = state.data;
    console.log('*********data*********',data);
    let node = noderef.node.data ;    
    let popupindex=0;
if(data.treeTable.data.length === 0)
{
  alert("No Child flowpath availabale");
}
else
{
 let subsParentMethodName = "";
 if(noderef && noderef.parent && noderef.parent.data)
  subsParentMethodName=noderef.parent.data.methodName;
 else
  subsParentMethodName = me.htmlencodeFormat(node.methodName);
//  this.repeatedMethodData[this.repeatedMethodData.length]= data.repeatMethodsData;
 if(subsParentMethodName.length >30)
    subsParentMethodName=   subsParentMethodName.substring(0,subsParentMethodName.length)+"...";
    let subCallout=me.htmlencodeFormat(node.methodName);
    if(subCallout.length >30)
    subCallout=subCallout.substring(0,subCallout.length-1)+"...";
     me.count=0;
     me.expandChildren(data.treeTable.data[0]);
if(noderef && noderef.parent && noderef.parent.data)
 me.values.push({"treeData":data.treeTable.data,"subsParentMethodName":subsParentMethodName,"parentMethodName":noderef.parent.data.methodName,"Callout":this.htmlencodeFormat(node.methodName),"subCallout":subCallout});  
else
 me.values.push({"treeData":data.treeTable.data,"subsParentMethodName":subsParentMethodName,"parentMethodName":subsParentMethodName,"Callout":this.htmlencodeFormat(node.methodName),"subCallout":subCallout});  
  if(popupindex == undefined)
    popupindex=0;
  me.visibleArr[popupindex]=true;
  me.childMCTPositionTop=this.childMCTPositionTop+150;
}
me.loading = false;
}


  onchildFlowpathLoading(state: childFlowpathLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  onchildFlowpathLoadingError(state: childFlowpathErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

// decodeHTMLString(str:string)
// {
//   return str.replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
// }
  //if repeated data available.
  updateMethodprop(repeatObj, nodeData) {
    nodeData.wallTime = repeatObj.wallTime;
    nodeData.cpuTime = repeatObj.cpuTime;
    nodeData.waitTime = repeatObj.waitTime;
    nodeData.syncTime = repeatObj.syncTime;
    nodeData.ioTime = repeatObj.ioTime;
    nodeData.suspensionTime = repeatObj.suspensionTime;
    if (this.fpDuration == 0)
      nodeData.percentage = 0;
    else
      nodeData.percentage = (repeatObj.wallTime / this.fpDuration) * 100;
    nodeData.timeStamp = repeatObj.timeStamp;
    nodeData.queueTime = repeatObj.queueTime;
    if (nodeData.queueTime == 0)
      nodeData.queueTime = "-";
    nodeData.selfTime = repeatObj.selfTime;
    if (nodeData.selfTime == 0)
      nodeData.selfTime = "-";
  }

  expandSameLeveluptoFixLevel(node, limit, parentLineNumber, childArrLength) {
    let toAddchildren = [];
    let obj = {};
    let offset = limit + 50;
    if (offset > childArrLength)
      offset = childArrLength;
    for (let j = limit; j < offset; j++) {
      obj = this.childrenObj[node.data.lineNumber][j];
      if (obj != undefined) {
        if (j != 0 && limit == j) {
          obj['data']['limit'] = limit - 50;
          obj['data']['offset'] = limit;
          obj['data']['type'] = 1;
        }
        if (j == offset - 1) {
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
    node.children = toAddchildren;
    node.expanded = true;
    this.mctData = [...this.mctData];
    this.loading = false;
    return;
  }



  expandChildren(node) {
    if (node && node.data.repeatObj) {
      let repeatObj = node.data.repeatObj;
      this.updateMethodprop(repeatObj, node.data);
    }
    if (node.children == undefined) {
      if (this.count == 0) {
        if (node.data.methodArgument == "-" || node.data.methodArgument.includes("Method Arguments")) {
          if (node.data.methodArgument == "-") {  //to be handled
            node.data.methodArgument = this.methodCallService.urlQueryParamStr   
          } else {
            node.data.methodArgument = this.methodCallService.urlQueryParamStr + '\n' + node.data.methodArgument;
          }
        }
      }
    }
    if (node.children) {
      if (node.children.length > 50) {
        this.childrenObj[node.data.lineNumber] = JSON.parse(JSON.stringify(node.children));
        this.preNode[node.data.lineNumber] = node;
        this.expandSameLeveluptoFixLevel(node, 0, node.data.lineNumber, node.children.length);
      }
      else if (this.count < this.txtExpandCount) {
        node.expanded = true;
        if (this.count == 0) {
          if (node.data.methodArgument == "-" || node.data.methodArgument.includes("Method Arguments")) {
            if (node.data.methodArgument == "-") {  //to be handled
              node.data.methodArgument = this.methodCallService.urlQueryParamStr
            } else {
              node.data.methodArgument = this.methodCallService.urlQueryParamStr + '\n' + node.data.methodArgument;
            }
          }
        }
        for (let cn of node.children) {
          this.count += 1;
          if (cn && cn.data.repeatObj) {
            let repeatObj = cn.data.repeatObj;
            this.updateMethodprop(repeatObj, cn.data);
          }
          if (cn.children != undefined && cn.children.length <= 50) {
            this.expandChildren(cn);
          }
          else if (cn.children != undefined) {
            this.childrenObj[cn.data.lineNumber] = JSON.parse(JSON.stringify(cn.children));
            this.preNode[cn.data.lineNumber] = cn;
            this.expandSameLeveluptoFixLevel(cn, 0, cn.data.lineNumber, cn.children.length);
          }
        }
      }
    }
  }


  //works like toggele button
  toggleExpandedCallout() {
    if (!this.toggleCallout) //false
    {
      this.toggleCallout = true;
      this.expandCollapseHint = "Show Callouts Collapsed form";
      this.methodCallService.FromAngular = '2';
    }
    else {                           //true 
      this.toggleCallout = false;
      this.expandCollapseHint = "Show Callouts Expanded form";
      this.methodCallService.FromAngular = '1';
    }
    this.loadMct();
  }
  toggleNode(expandedForm) {
    this.mctData.forEach((val, index) => {
      val.expanded = expandedForm;
    });
    this.mctData = [...this.mctData];
  }



  loadPagination(event: LazyLoadEvent) {
    this.loading = true;


    this.mctData.forEach((val, index) => {
      if (index == 0) {
        let node = this.mctData[index];
        this.expandChildren(node);
        this.count = 0;
      }
    });
    setTimeout(() => {
      this.mctData = [...this.mctData];
      this.loading = false;
    }, 1000)
    //   setTimeout(() => {
    //     this.loading = false;
    //     this.methodcallData = [];

    //     let node = {
    //       data: this.data.treeTable.data,
    //       leaf: false
    //     };
    //     this.methodcallData.push(node);

    //     // for (let i = 0; i < event.rows; i++) {
    //     //   let node = {
    //     //     data: this.data.treeTable.data,
    //     //     leaf: false
    //     //   };
    //     //   this.methodcallData.push(node);
    //     // }
    //     this.totalRecords = this.data.treeTable.data.length;
    //     this.alldata = this.methodcallData[0].data;
    // }, 1000);
  }


  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }



  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }



  // toggleFilters() {
  //   const me = this;
  //   me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
  //   if (me.isEnabledColumnFilter === true) {
  //     me.filterTitle = 'Disable Filters';
  //   } else {
  //     me.filterTitle = 'Enable Filters';
  //   }
  // }



  ngOnDestroy() {
    this.subscribeMethodcallDetails.unsubscribe();
  }



  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.treeTable.downloaddata;
    let header = [];
    header.push("S No.");

    // for (const c of me.data.treeTable.headers[0].cols)
    //     header.push(c.label);
    for (let i = 0; i < me.data.treeTable.headers[0].cols.length - 1; i++) {
      header.push(me.data.treeTable.headers[0].cols[i].label);
    }

    try {
      me.methodCallService.downloadShowDescReports(label, tableData, header).subscribe(
        (state: Store.State) => {
          if (state instanceof DownloadReportLoadingState) {
            me.onLoadingReport(state);

            return;
          }

          if (state instanceof DownloadReportLoadedState) {
            me.onLoadedReport(state);
            return;
          }
        },
        (state: DownloadReportLoadingErrorState) => {
          me.onLoadingReportError(state);

        }
      );
    } catch (err) {
      console.log("Exception in downloadShowDescReports method in method calling tree component :", err);
    }
  }



  private onLoadingReport(state: DownloadReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }



  private onLoadedReport(state: DownloadReportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let path = state.data.comment.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");
  }



  private onLoadingReportError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }



  assignmctdata(state: MethodCallDetailsLoadedState) {
    const me = this;
    me.data = state.data;
    me.mctData = me.data.treeTable.data;
    let fpMap = new Map();
    fpMap = me.data.dataTable.fpsInfo;
    this.downloadMctData =me.data.treeTable.downloaddata;
    this.fpInstanceInfoKeys = Object.keys(fpMap);
    this.fpInstanceInfo = fpMap;
    me.loadPagination(null);
    // me.packageList = state.data.treeTable.packages;
    // me.classList = state.data.treeTable.classes;
    // me.methodList = state.data.treeTable.methods;
    me.uniqueMethodSignature = state.data.treeTable.uniqueMethods;
    me.addPackageClassmethodList();
  }



  getClassList() {
    let classList = [];
    for (let i = 0; i < this.selectedPackageList.length; i++) {
      let pkg = this.selectedPackageList[i];
      for (let j = 0; j < this.actualClassList.length; j++) {
        let value = this.actualClassList[j]['value'];
        if (value.indexOf(pkg) != -1) {
          classList.push(this.actualClassList[j]);
        }
      }
    }
    let selectedActClss = [];
    for (let i = 0; i < classList.length; i++) {
      let classValue = classList[i]['value'];
      for (let j = 0; j < this.selectedClassList.length; j++) {
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
    }
  }



  getMethodList() {
    let methodList = [];
    let actualClass = [];
    for (let i = 0; i < this.selectedClassList.length; i++) {
      let cls = this.selectedClassList[i];
      let val = this.classList.find((obj) => { return obj.value == cls });
      actualClass.push(val['label']);
      for (let j = 0; j < this.actualMethodList.length; j++) {
        let value = this.actualMethodList[j]['value'];
        if (value.indexOf(cls) != -1) {
          methodList.push(this.actualMethodList[j]);
        }
      }
    }
    let selectedMethodList = [];
    for (let i = 0; i < methodList.length; i++) {
      let methodValue = methodList[i]['value'];
      for (let j = 0; j < this.selectedMethodList.length; j++) {
        if (methodValue.indexOf(this.selectedMethodList[j]) != -1)
          selectedMethodList.push(methodValue);
      }
    }
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



  getActualMethodList() {
    let actMethod = [];
    for (let i = 0; i < this.selectedMethodList.length; i++) {
      let val = this.selectedMethodList[i];
      actMethod.push(this.actualMethodList.find((Object) => { return Object['value'] == val })['label']);
    }
    if (this.selectedMethodList.length == 0) {
      this.selectedActMethod = [];
    }
    else {
      this.selectedActMethod = [];
      this.selectedActMethod = actMethod;
    }
  }



  searchMethodName(event) {
    const me = this;
    let arrayVal = [];
    me.uniqueMethodSignature.forEach((val, index) => {
      if (val.indexOf(event.query) != -1)
        arrayVal.push(val);
    });

    me.negativeMethodArr = arrayVal;

  }



  expandSetter() {
    if (!this.isExpandCount) {
      this.txtExpandCount = 25;
    }
  }



  applyThresholdFilter() {
    if (this.txtFlterMethodLevel == undefined || this.txtFlterMethodLevel == null || this.txtFilterWallTime == undefined || this.txtFilterWallTime == null || this.txtThresholdWallTime == undefined || this.txtThresholdWallTime == null) {
      alert('Please Fill all the values of Filter');
      return;
    }
    if (this.cmpNegPosFilters()) {
      return;
    }
    else {
      //this.filterMethods="0";
    }
    var startTimetoPass;
    var endTimetoPass;

    startTimetoPass = Number(this.methodCallService.startTime) - 900000;
    if (this.methodCallService.endTime.toString() == '' || this.methodCallService.endTime == null || this.methodCallService.endTime == undefined) {
      var strEndTime = Number(this.methodCallService.startTime) + Number(10);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.methodCallService.endTime) + 900000;
    }
    if (this.selectedPackageList == undefined)
      this.selectedPackageList = [];
    if (this.selectedActClss == undefined)
      this.selectedActClss = [];
    if (this.selectedActMethod == undefined)
      this.selectedActMethod = [];

    this.assignFiltervalue(startTimetoPass, endTimetoPass);
    this.closeDialog();
  }


  applyDefaultValue() {
    const me = this;
    me.txtFilterWallTime = 0;
    me.txtFlterMethodLevel = 100;
    me.txtThresholdWallTime = 1500;
    me.txtThresholdelapsedTime = 1000;
    me.selectedPackageList = [];
    me.selectedActClss = [];
    me.selectedActMethod = [];
    me.selectedClassList = [];
    me.selectedMethodList = [];
    me.addPackageClassmethodList();
    me.txtExpandCount = 25;
    me.isExpandCount = false;
    me.selectedNegativeMethod = [];
    me.ignoreFilterCallOuts = ['T,E', 'D', 'J,j', 'e', 't', 'a,A'];
    //  this.enableMergeCase=false;
    me.isEnabledQAS = true;

    me.methodCallService.packageList = '';
    me.methodCallService.classList = '';
    me.methodCallService.methodList = '';
    me.methodCallService.filterGreaterThan = '0';
    me.methodCallService.filterTop = this.txtFlterMethodLevel.toString();
    me.methodCallService.thresholdWallTime = me.txtThresholdWallTime.toString();
    me.methodCallService.ignoreFilterCallouts = me.ignoreFilterCallOuts.toString();
    me.methodCallService.thresholdDiffElapsedTime = this.txtThresholdelapsedTime.toString();
    me.methodCallService.negativeMethods = '';
    me.methodCallService.FromAngular = "1";

  }


  addPackageClassmethodList() {
    const me = this;
    me.multiselectobj = me.drillDownService.interceptor.getPackageClassMethod(me.uniqueMethodSignature);
    me.packageList = me.multiselectobj.packages;
    me.classList = me.multiselectobj.classes;
    me.methodList = me.multiselectobj.methods;

    this.actualPackageList = me.multiselectobj.packages;
    this.actualClassList = me.multiselectobj.classes;
    this.actualMethodList = me.multiselectobj.methods;
  }



  cmpNegPosFilters(): boolean {
    const me = this;
    if (me.selectedNegativeMethod && me.selectedNegativeMethod.length > 0) {
      //this.filterMethods="1";
      if (me.selectedPackageList.length > 0) {
        for (let k = 0; k < me.selectedNegativeMethod.length; k++) {
          let pkgClsindex = me.selectedNegativeMethod[k].lastIndexOf(".");
          let packageClassName = me.selectedNegativeMethod[k].substring(0, pkgClsindex);
          let packageName = packageClassName.substring(0, packageClassName.lastIndexOf("."));
          let className = packageClassName.substring(packageClassName.lastIndexOf(".") + 1, packageClassName.length);
          let methodName = me.selectedNegativeMethod[k].substring(pkgClsindex + 1, me.selectedNegativeMethod[k].length);
          console.log('pkgName ', packageName, ' , Class name ', className, ' ,methodName ', methodName);

          if (me.selectedPackageList.indexOf(packageName) != -1) {
            if (me.selectedActClss.indexOf(className) != -1) {
              if (me.selectedActMethod.indexOf(methodName) != -1) {
                alert('Positive and negative filter could not be same ');
                return true;
              }
            }
          }

        }
      }
    }
    return false;
  }



  assignFiltervalue(startTimetoPass, endTimetoPass) {
    const me = this;
    me.methodCallService.packageList = me.selectedPackageList.toString();
    me.methodCallService.classList = me.selectedActClss.toString();
    me.methodCallService.methodList = me.selectedActMethod.toString();
    me.methodCallService.startTime = startTimetoPass;
    me.methodCallService.endTime = endTimetoPass;
    me.methodCallService.filterGreaterThan = me.txtFilterWallTime.toString();
    me.methodCallService.filterTop = me.txtFlterMethodLevel.toString();
    me.methodCallService.thresholdWallTime = me.txtThresholdWallTime.toString();
    me.methodCallService.ignoreFilterCallouts = me.ignoreFilterCallOuts.toString();
    me.methodCallService.thresholdDiffElapsedTime = me.txtThresholdelapsedTime.toString();
    me.methodCallService.negativeMethods = me.selectedNegativeMethod.toString();
    me.methodCallService.FromAngular = "1";
    me.loadMct();
  }



  closeFlowpathDialog(isCloseFPDialog) {
    this.isFlowpathDialog = isCloseFPDialog;
  }
// For resizing of column in the given table width
  resizingColumns($event)
  {
  // console.log("elemtn value",$event.element,"delta",$event.delta);
     let headerName=$event.element.innerText.trim();
    // console.log("header name vvlaue----",headerName);
   this.data.treeTable.headers[0].cols.forEach((val,index)=>{ 
    //  console.log("index value---",index,"value------",val);
   if(headerName == val.label)
   {
    // console.log("valfilef value-------"+val.field);
       val.width= Number(val.width.replace("px",'') )+ $event.delta;
       val.width = val.width+"px";
   //    console.log("width value-------",val.width);
      // break;
   }
   else
   {  let width=0;
       if($event.delta< 0)
       width=Number(val.width.replace("px",'') )+ 20;
 else
       width=Number(val.width.replace("px",'') )- 20;
       if(width > 10)
       val.width = width+"px";
   }    
   })
  }

// for internel pagination
expandSameLeveluptoFixLevelforValue(lineNumber,limit,childArrlength)
{
  this.loading=true;
  let node =this.preNode[lineNumber];
  if(childArrlength == limit)
  {
        let value=childArrlength%100;
    if(value >50)
       value=value-50;
       limit= childArrlength-value;
  }
  setTimeout(()=>{ //alert("Hello");
  this.expandSameLeveluptoFixLevel(node,limit,lineNumber,childArrlength);
   }, 1000);
}



  commonModuleCall(rowData){
    console.log("------------RowData---------",rowData);
    this.dynFqm= rowData.fqm ||rowData.data.fqm;   //to support both cases form DL icon as well as from right click menu
    this.dynTierName =rowData.tierName ||rowData.data.tierName;
    this.dynServerName =rowData.serverName ||rowData.data.serverName;
    this.dynAppName =rowData.appName ||rowData.data.appName;
    this.dynEntrySeqNum = rowData.entrySeqNum || rowData.data.entrySeqNum;
    this.dynFpInstance = this.fpInstanceInfo[this.fpInstanceInfoKeys[0]][0];

    this.argsForDynamicLogging =[this.dynTierName,this.dynServerName,this.dynAppName,this.dynFqm,this.productName.toLowerCase(),this.sessionService.testRun.id,this.dynEntrySeqNum,this.dynFpInstance,"0"]
    this.ShowCommonDLModule= true;
  }
  openAutoInstDialog()
  {
       let testRunStatus;
       let instanceType;
       let url;
       url = this.getHostUrl() + '/' + this.productName.toLowerCase() + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.sessionService.testRun.id;
          console.log('url *** ', url);
       this.ddrRequest.getDataUsingGet(url).subscribe(resp => {
         let res = <any> resp;
           console.log("data for tr status === " , res);
           testRunStatus = res.data;
           if(testRunStatus.length != 0)
           {
              this.showAutoInstrPopUp = true;
	      if(this.queryParams.Instance_Type.toLowerCase() == 'java')
                  instanceType = 'Java';
              else if (this.queryParams.Instance_Type.toLowerCase() == 'dotnet')
                  instanceType = 'DotNet';                

              this.argsForAIDDSetting = [this.queryParams.appName,this.queryParams.appId,instanceType,this.queryParams.tierName,
              this.queryParams.serverName,this.queryParams.serverId,"-1",this.queryParams.businessTransaction,"DDR",testRunStatus[0].status,this.sessionService.testRun.id];           
           }
           else
           {
              this.showAutoInstrPopUp = false;
	      alert("Could not start instrumentation, test is not running")
              return;
           }
       }); 
  }


  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
   // console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  startInstrumentation(result)
  {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog){
    this.showAutoInstrPopUp = isCloseAIDDDialog;
   }

   openDLDialog(){
    this.openDLDialogFromButton=true;
  }

  openDLbasedOnFQC(){
    console.log("openDLbasedOnFQC()********this.downloadMctData==",this.downloadMctData);
    this.dynFqm = this.FQCforDL+".dl()"
    this.dynFpInstance = this.fpInstanceInfo[this.fpInstanceInfoKeys[0]][0];
    this.dynTierName=this.downloadMctData[0].tierName ;
    this.dynServerName= this.downloadMctData[0].serverName;
    this.dynAppName=this.downloadMctData[0].appName;

    this.argsForDynamicLogging =[this.dynTierName,this.dynServerName,this.dynAppName,this.dynFqm,this.productName.toLowerCase(),this.sessionService.testRun.id,"",this.dynFpInstance,"1"]
    this.ShowCommonDLModule= true;
    this.openDLDialogFromButton=false;

  }

  closeDynamicLogging(isCloseDLDialog){
    this.ShowCommonDLModule = isCloseDLDialog; 
   }


}
