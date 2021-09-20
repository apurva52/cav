import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { jsPlumbToolkit, jsPlumbToolkitOptions, Surface, SurfaceRenderParams } from 'jsplumbtoolkit';
import { AngularViewOptions, jsPlumbService, jsPlumbSurfaceComponent } from 'jsplumbtoolkit-angular';
import { MenuItem, OverlayPanel } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { ClusterComponent } from './cluster/cluster.component';
import { LastLevelNodeComponent } from './last-level-node/last-level-node.component';
import { OutputNodeIndicesComponent } from './output-node-indices/output-node-indices.component';
import { TRANSACTION_FLOWMAP_CHART } from './service/transaction-flowmap.dummy';
import { NodeInfo, TransactionFlowmapChart, TransactionFlowMapData } from './service/transaction-flowmap.model';
import { TransactionFlowMapService } from './service/transaction-flowmap.service';
import { TransactionFlowMapLoadedState, TransactionFlowMapLoadingErrorState, TransactionFlowMapLoadingState } from './service/transaction-flowmap.state';
import { Subscription } from 'rxjs';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { SessionService } from 'src/app/core/session/session.service';
import { TransactionFlowMapServiceInterceptor } from './service/transaction-flowmap.service.interceptor';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { DDRRequestService } from '../../ddr/services/ddr-request.service';

@Component({
  selector: 'app-transaction-flowmap',
  templateUrl: './transaction-flowmap.component.html',
  styleUrls: ['./transaction-flowmap.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class TransactionFlowmapComponent implements OnInit {

  transactionFlowmapChart: TransactionFlowmapChart;

  autoplayCurrentSeqIndex: number;

  data: TransactionFlowMapData;
  error: AppError;
  loading: boolean;
  empty: boolean;

  menuOptions: MenuItem[];
  // breadcrumb: MenuItem[];
  responseTime: any;
  showUI: boolean = false;
  isShow: boolean;
  // these are plugged in to the Surface component.
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';

  toolkit: jsPlumbToolkit;

  surface: Surface;
  subscribeTrxFlow:Subscription;
  isShowDbTable:boolean = false;
  isShowHttpTable:boolean = false;
  isShowHsTable:boolean = false;
  isShowMTTable:boolean = false;
  isShowMCTTable:boolean = false;
  timeVarianceForNetForest:any;
  //for Instace type = 'backend'..
  tierName:any;
  serverName:any;
  instanceName:any;

  // for auto instrumentation
  itemsall: MenuItem[];
  showAutoInstrPopUp:boolean = false;
  queryParams:any;
  argsForAIDDSetting:any[];
  productName: string;

  // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};

  @Output() menuClick = new EventEmitter<boolean>();

  // we dont really need this, we just put it here to show you how you can do it.
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  @ViewChild('outputNode')
  outputOverlay: OverlayPanel;

  @ViewChild('edgeData')
  edgeData: OverlayPanel;

  outputNodeOverlayData: NodeInfo;
  outputNodeOverlayDataOnEdge: any;

  isShowRelatedGraph: boolean = false;
  isShowFlowmapTable: boolean = true;
  breadcrumb: BreadcrumbService;
overlayPositionStyle: { left?: string; top?: string; display?: string };

  constructor(
    private transactionFlowmapService: TransactionFlowMapService,
    private router: Router,
    private $jsplumb: jsPlumbService,
    private dashboardServiceReqService: DashboardServiceReqService,
    private sessionService: SessionService,
    private interceptor: TransactionFlowMapServiceInterceptor,
    private ddrRequest: DDRRequestService,
    breadcrumb: BreadcrumbService
  ) {
    this.breadcrumb = breadcrumb;
  }
  // showFlowpathDetails() {
  //   this.isShow = true;
  //   this.menuClick.emit(this.isShow);
  // }

  searchSummaryHide($event) {
    this.isShow = $event;
  }
  showDetails($event) {
    this.isShow = $event;
  }

  showRelatedGraph() {
    this.isShowRelatedGraph = true;
    this.isShowFlowmapTable = false;
  }

  showFlowmapTable() {
    this.isShowRelatedGraph = false;
    this.isShowFlowmapTable = true;
  }

  ngOnInit(): void {
    const me = this;
    this.subscribeTrxFlow = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.toolkit.clear();
      me.load();
    });
    me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
    me.load();
    this.getNetForestVarinace();
    me.queryParams = me.sessionService.getSetting("fpRowdata");
    me.productName = this.sessionService.session.cctx.prodType; //product name
    // me.breadcrumb = [
    //   { label: 'Home', routerLink: '/home/dashboard' },
    //   { label: 'Drill Down Report(Flow Path) ', routerLink: '/drilldown' },
    //   { label: 'Transaction Flowmap' },
    // ];

    me.transactionFlowmapChart = TRANSACTION_FLOWMAP_CHART;

    // me.menuOptions = [
    //   {
    //     label: 'View Flowpath Details',
    //     command: (event: any) => {
    //       this.showFlowpathDetails();
    //     },
    //   },
    //   {
    //     label: 'DB Request Report',
    //   },
    //   {
    //     label: 'Method Timing Report',
    //   },
    //   {
    //     label: 'HotSpot Threat Details',
    //   },
    //   {
    //     label: 'Current Instance Log',
    //   },
    //   {
    //     label: 'All Instance Log',
    //   },
    //   {
    //     label: 'Show Related Graph',
    //     command: (event: any) => {
    //       this.showRelatedGraph();
    //     },
    //   },
    //   {
    //     label: 'http Report',
    //   },
    // ];
    me.itemsall = [
      {
        label: 'Start Instrumentation',
        command: (event: any) => {
          this.openAutoInstDialog();
        }
      }
      ];
    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
      this.surface = s;
    });

     //Tier,server,Instance is required, when Instance Type is "backend" and Tier is "-"...
     var data = this.sessionService.getSetting("TrxFMBackEndData");
     //console.log("on hover data===", data);
     this.tierName = data.panels[0].data.dtoList[0].tierName;
     this.serverName = data.panels[0].data.dtoList[0].serverName;
     this.instanceName = data.panels[0].data.dtoList[0].appName;
  }

  load() {
    const me = this;
    me.transactionFlowmapService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionFlowMapLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TransactionFlowMapLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TransactionFlowMapLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TransactionFlowMapLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TransactionFlowMapLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: TransactionFlowMapLoadedState) {
    const me = this;
    //me.baseNodeComponent.obj=[];
    me.data = state.data;
    me.error = null;
    me.loading = false;

    if (me.data) {
      this.toolkit.load({
        data: {
          nodes: me.data.nodeInfoData.node,
          edges: me.data.nodeInfoData.edge,
        },
      });
    }
  }
  // the view in this demonstration declares a component to use to render each node type, and the appearance and behaviour of
  // a single edge type.
  view: AngularViewOptions = {
    nodes: {
      nodeIndicesParent: {
        events: {
          tap: (params: any) => {
            this.openOutputNodeOverlay(params.node.data)
          },
          mouseover: (params: any) => {
            this.openOutputNodeOverlay1(params.node.data)
          },
          mouseout: (param: any) => {
            this.closeOutputNodeOverlay(null);
          },

        },
      },
      cluster: {
        component: ClusterComponent,

      },
      nodeIndices: {
        parent: 'nodeIndicesParent',
        component: OutputNodeIndicesComponent,
      },
      lastLevelNodeIndices:{
        parent: 'nodeIndicesParent',
        component: LastLevelNodeComponent,
      }
    },
    edges: {
      default: {
        connector: 'Flowchart',
        anchor: ['Right', 'Left'],
        overlays: [
          ['Arrow', { location: 1, width: 8, length: 8, direction: 1 }],
        ],

        endpoint: 'Blank',
      },
      outputEdgeLabel: {
        connector: 'Flowchart',
        anchor: ['Right', 'Left'],
        overlays: [
          ['Arrow', { location: 1, width: 8, length: 8, direction: 1 }],
          [
            'Label',
            {
              label:
                "<div class='edge-index'>${index}</div> <div class='edge-name pb-3'> calls:${calls}, ${rspTime}</div>",
              cssClass: 'edge-label',
              labelLocationAttribute: 'putMyLabelAt',
            },
          ],
        ],
        events: {
          mouseover: (params: any) => {

            const positionLeft = params.e.pageX + 'px';
            const positionTop = params.e.pageY + 'px';
            this.overlayPositionStyle = {
              left: positionLeft,
              top: positionTop,
              display: 'block'
            };

              this.openOutputNodeOverlayOnEdge(
                params.edge.data,
                params.e.pageX,
                params.e.pageY
              );


          },
          mouseout: (params: any) => {
            //this.closeOutputNodeOverlayOnEdge();
            const positionLeft = params.e.pageX + 'px';
            const positionTop = params.e.pageY + 15 + 'px';
            this.overlayPositionStyle = {
              display: 'none'
            };
          },
        },
        endpoint: 'Blank',
      },
    },
  };

  // we use a Spring layout, and we enable right-click on the canvas. on data load, we zoom the canvas to show all the data.
  renderParams: SurfaceRenderParams = {
    layout: {
      type: 'Hierarchical',
      parameters: {
        padding: [300, 50],
        orientation: 'vertical',
        spacing: 'compress',
      },
    },
    zoomToFit: true,
    consumeRightClick: false,
    enablePanButtons: false,
  };

  openOutputNodeOverlay(data) {
    this.outputNodeOverlayData = data;
    // console.log("node id -----", data.id);
    this.sessionService.setSetting("nodeId", data.id);
    this.interceptor.getNodeData();
    console.log("Inside the show details of node", data);
    // this.outputOverlay.show(event);
  }
  openOutputNodeOverlay1(data) {
    this.outputNodeOverlayData = data;
    // console.log("node id -----", data.id);
    // this.sessionService.setSetting("nodeId", data.id);
    // this.interceptor.getNodeData();
    console.log("Inside the show details of node", data);
    this.outputOverlay.show(event);
  }

  closeOutputNodeOverlay(data) {
    // this.outputNodeOverlayData = data;
    this.outputOverlay.hide();
  }
  openOutputNodeOverlayOnEdge(data, left, top) {
    this.outputNodeOverlayDataOnEdge = data;

    this.edgeData.show(event);
  }

  closeOutputNodeOverlayOnEdge() {
    // this.outputNodeOverlayData = data;
    this.edgeData.hide();
  }

  openDbReport(){
    const me = this;
    me.isShowDbTable = true;
  }
  openHttpReport(){
    const me = this;
    me.isShowHttpTable = true;
  }
  openHotSpotReport(){
    const me = this;
    me.isShowHsTable = true;
  }
  openMethodTimingReport(){
    const me = this;
    me.isShowMTTable = true;
  }
  openMCTReport(){
    const me = this;
    me.isShowMCTTable = true;
  }
  //this is method is to open the net forest from context menu when keyword is present in config UI(Triggered from output-node-indices component)
  openNetForest(entryInstance) {
    // this._ddrData.splitViewFlag = false;
    let CurrentNodeData = this.sessionService.getSetting('TxnFMData');
    let FpRowData = this.sessionService.getSetting('fpRowdata');
    console.log("fp row data :-", FpRowData);
    var flowpathIns = CurrentNodeData.flowpathInstance;
    var correlationId = CurrentNodeData.correlationid;
    var corrId = "";
    var query = "";
    //let NetForestUrl = this.flowmapData.netForestURL;
    //this.getNetForestVarinace();
    console.log("time variance for NF:-", this.timeVarianceForNetForest);

    let timeVar = this.timeVarianceInMs(this.timeVarianceForNetForest);

    console.log("Time variance from TRX To NF = " + timeVar);
    console.log("Start time in TRX  = " + FpRowData.startTimeInMs);

    var d1 = parseInt(FpRowData.startTimeInMs) - timeVar;
    var d2 = parseInt(FpRowData.startTimeInMs) + parseInt(FpRowData.responseTime) + timeVar;

    console.log("start time from TRX To NF = " + d1);
    console.log("end time from TRX To NF = " + d2);

    var startTimeISO = new Date(d1).toISOString();
    var endTimeISO = new Date(d2).toISOString();

    if (correlationId != "" && correlationId != 'undefined' && correlationId != "-")
      // corrId = "%20OR%20corRID%3A"+correlationId;
      corrId = "%20AND%20corRID:" + correlationId;
    if (entryInstance == '1') {
      //query = "%27entryFPI%3D"+entryFPI+corrId+"%27";
      query = "entryFPI:" + this.interceptor.entryFPI + corrId;
    }
    else
      //query = "%27FPI%3D"+flowpathIns+corrId+"%27";
      query = "FPI:" + flowpathIns + corrId;

    // New navigation to NF from Trxn Flowmap -- LRM
      query = query.replace("%20", ' ');
      console.log("The value inside the starttime and endtime and query for the netforest is .......",startTimeISO,endTimeISO,query);
      // this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId  } });
      this.router.navigate(["/home/logs"], { queryParams: { queryStr: query,  startTime : startTimeISO , endTime : endTimeISO}});

  }
  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time))     //If time is in minute formate- xm eg:20m means 20 minute  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time))  //If time is in second formate- xs eg:200s means 200 second  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = parseInt(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds
    {
      timeVarianceInMs = parseInt(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");

      return parseInt('900000'); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return parseInt(timeVarianceInMs);
  }
  getHostUrl(): string {
    // var productName = this.sessionService.session.cctx.prodType.toLowerCase().replace("/", "");
    var hostDcName = window.location.protocol + '//' + window.location.host + '/';

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }
  getNetForestVarinace(){
    // let timeVarianceForNetForest:any;
    let url = this.getHostUrl() + 'netdiagnostics/v1/cavisson/netdiagnostics/ddr/config/NetDiagnosticsQueryTimeVariance';
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      this.timeVarianceForNetForest = data;
    })
    // console.log("value inside the timeVariance :-", timeVarianceForNetForest);
    // return timeVarianceForNetForest;
  }
  openAutoInstDialog() {
    let testRunStatus;
    let instanceType;
    let url;
    url = this.getHostUrl() + this.productName.toLowerCase() + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.sessionService.testRun.id;
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
        this.queryParams.serverName, this.queryParams.serverId, "-1", this.queryParams.businessTransaction, "DDR", testRunStatus[0].status, this.sessionService.testRun.id];
      }
      else {
        this.showAutoInstrPopUp = false;
        alert("Could not start instrumentation, test is not running")
        return;
      }
    });
  }
  startInstrumentation(result)
  {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog){
    this.showAutoInstrPopUp = isCloseAIDDDialog;
   }
  close(){
    const me = this;
    me.isShowDbTable = false;
    me.isShowHttpTable = false;
    me.isShowHsTable = false;
    me.isShowMTTable = false;
    me.isShowMCTTable = false;
  }
  ngOnDestroy() {
    const me = this;
    me.subscribeTrxFlow.unsubscribe();
    me.toolkit.clear();
  }

}
