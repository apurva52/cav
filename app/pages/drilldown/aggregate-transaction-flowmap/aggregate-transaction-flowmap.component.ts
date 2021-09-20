import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { AggregateTransactionFlowmapService } from './service/aggregate-transaction-flowmap.service';
import { Store } from 'src/app/core/store/store';
import {
  AggregateTransactionFlowmapLoadedState,
  AggregateTransactionFlowmapLoadingErrorState,
  AggregateTransactionFlowmapLoadingState,
} from './service/aggregate-transaction-flowmap.state';
import { Menu, MenuItem, OverlayPanel } from 'primeng';
import { Router } from '@angular/router';
import {
  jsPlumbToolkit,
  jsPlumbToolkitOptions,
  Surface,
  SurfaceRenderParams,
  ViewOptions,
} from 'jsplumbtoolkit';
import {
  AngularViewOptions,
  jsPlumbService,
  jsPlumbSurfaceComponent,
} from 'jsplumbtoolkit-angular';
import { ClusterComponent } from './cluster/cluster.component';
import { OutputNodeIndicesComponent } from './output-node-indices/output-node-indices.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import {
  AggregateTransactionFlowmapData,
  NodeInfo,
} from './service/aggregate-transaction-flowmap.model';
import { MenuService } from 'src/app/shared/dashboard/menu.service';
import { Subscription } from 'rxjs';
import { LastLevelNodeComponent } from './last-level-node/last-level-node.component';

@Component({
  selector: 'app-aggregate-transaction-flowmap',
  templateUrl: './aggregate-transaction-flowmap.component.html',
  styleUrls: ['./aggregate-transaction-flowmap.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AggregateTransactionFlowmapComponent implements OnInit {
  autoplayCurrentSeqIndex: number;

  data: AggregateTransactionFlowmapData;
  error: AppError;
  loading: boolean;
  empty: boolean;

  breadcrumb: MenuItem[];
  responseTime: any;
  showUI: boolean = false;
  isShow: boolean;
  menuType: string;
  subscription: Subscription;
  // these are plugged in to the Surface component.
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';

  toolkit: jsPlumbToolkit;

  surface: Surface;

  // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};
  // we dont really need this, we just put it here to show you how you can do it.
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  @ViewChild('outputNode')
  outputOverlay: OverlayPanel;

  outputNodeOverlayData: NodeInfo;

  constructor(
    private aggregateTransactionFlowmapService: AggregateTransactionFlowmapService,
    private router: Router,
    private $jsplumb: jsPlumbService,
    private menuService: MenuService
  ) {
    const me = this;
    me.subscription = me.menuService.getOpenCommand().subscribe((data) => {
      if (data) {
        me.isShow = data.text;
        me.menuType = data.type;
      }
    });

    me.subscription = me.menuService.getCloseCommand().subscribe((data) => {
      if (data) {
        me.isShow = data.text;
      }
    });
  }

  ngOnInit(): void {
    const me = this;
    me.load();
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Drill Down Report(Flow Path) ', routerLink: '/drilldown' },
      { label: 'Aggregate Transaction Flowmap' },
    ];

    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
      this.surface = s;
    });
  }

  load() {
    const me = this;
    me.aggregateTransactionFlowmapService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof AggregateTransactionFlowmapLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof AggregateTransactionFlowmapLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: AggregateTransactionFlowmapLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: AggregateTransactionFlowmapLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: AggregateTransactionFlowmapLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: AggregateTransactionFlowmapLoadedState) {
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
          },
          mouseover: (param: any) => {
            this.openOutputNodeOverlay(param.node.data);
          },
          mouseout: (param: any) => {
            this.outputOverlay.hide();
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
        connector:[ "Flowchart", {stub:150} ],
        anchor: ['Right', 'Left'],
        overlays: [
          ['Arrow', { location: 1, width: 8, length: 8, direction: 1 }],
        ],
        endpoint: 'Blank',
      },
      outputEdgeLabel: {
        connector:[ "Flowchart", {stub:150} ],
        anchor: ['Right', 'Left'],
        overlays: [
          ['Arrow', { location: 1, width: 8, length: 8, direction: 1 },],
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
        events: {
          tap: (params: any) => {
            // 
          },
          mouseover: (param: any) => {
            // console.log(param);
            
            this.openOutputNodeOverlay(param.edge.data);
          },
          mouseout: (param: any) => {
             this.outputOverlay.hide();
          },
        },
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
