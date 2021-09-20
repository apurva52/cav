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

@Component({
  selector: 'app-transaction-flowmap',
  templateUrl: './transaction-flowmap.component.html',
  styleUrls: ['./transaction-flowmap.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionFlowmapComponent implements OnInit {

  transactionFlowmapChart: TransactionFlowmapChart;

  autoplayCurrentSeqIndex: number;

  data: TransactionFlowMapData;
  error: AppError;
  loading: boolean;
  empty: boolean;

  menuOptions: MenuItem[];
  breadcrumb: MenuItem[];
  responseTime: any;
  showUI: boolean = false;
  isShow: boolean;
  // these are plugged in to the Surface component.
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';

  toolkit: jsPlumbToolkit;

  surface: Surface;

  // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};

  @Output() menuClick = new EventEmitter<boolean>();

  // we dont really need this, we just put it here to show you how you can do it.
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  @ViewChild('outputNode')
  outputOverlay: OverlayPanel;

  outputNodeOverlayData: NodeInfo;

  isShowRelatedGraph: boolean = false;
  isShowFlowmapTable: boolean = true;

  constructor(
    private transactionFlowmapService: TransactionFlowMapService,
    private router: Router,
    private $jsplumb: jsPlumbService
  ) {}
  showFlowpathDetails() {
    this.isShow = true;
    this.menuClick.emit(this.isShow);
  }

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
    me.load();
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Drill Down Report(Flow Path) ', routerLink: '/drilldown' },
      { label: 'Transaction Flowmap' },
    ];

    me.transactionFlowmapChart = TRANSACTION_FLOWMAP_CHART;

    me.menuOptions = [
      {
        label: 'View Flowpath Details',
        command: (event: any) => {
          this.showFlowpathDetails();
        },
      },
      {
        label: 'DB Request Report',
      },
      {
        label: 'Method Timing Report',
      },
      {
        label: 'HotSpot Threat Details',
      },
      {
        label: 'Current Instance Log',
      },
      {
        label: 'All Instance Log',
      },
      {
        label: 'Show Related Graph',
        command: (event: any) => {
          this.showRelatedGraph();
        },
      },
      {
        label: 'http Report',
      },
    ];
    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
      this.surface = s;
    });
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
          mouseover: (param: any) => {},
          mouseout: (param: any) => {},
          
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
                "<div class='edge-index'>${index}</div> <div class='edge-name'><div class='pb-3'>${rspTime}</div> <div>calls:${calls}</div></div>",
              cssClass: 'edge-label',
              labelLocationAttribute:"putMyLabelAt",
            },
          ],
        ],
        endpoint: 'Blank',
      },
    },
  };

  // we use a Spring layout, and we enable right-click on the canvas. on data load, we zoom the canvas to show all the data.
  renderParams: SurfaceRenderParams = {
    layout: {
      type: 'Hierarchical',
      parameters:{
        padding:[ 300, 50 ],
        orientation:"vertical",
        spacing: "compress"
      }
    },
    zoomToFit: true,
    consumeRightClick: false,
    enablePanButtons: false,
  };

  openOutputNodeOverlay(data) {
    this.outputNodeOverlayData = data;
    this.outputOverlay.show(event);
  }

}
