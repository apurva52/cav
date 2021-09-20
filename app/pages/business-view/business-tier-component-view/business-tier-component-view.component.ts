import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  jsPlumbToolkit,
  jsPlumbToolkitOptions,
  Surface,
  SurfaceRenderParams,
} from 'jsplumbtoolkit';
import { AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { Carousel, OverlayPanel } from 'primeng';
import { ActionNodeComponent } from './action-node/action-node.component';
import { OutputNodeComponent } from './output-node/output-node.component';
import { BUSINESS_VIEW_TIER_COMPONENT } from './service/business-view.dummy';
import { BusinessTireComponentNode, BusinessView } from './service/business-view.model';



@Component({
  selector: 'app-business-tier-component-view',
  templateUrl: './business-tier-component-view.component.html',
  styleUrls: ['./business-tier-component-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessTierComponentViewComponent implements OnInit {
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';
  surface: Surface;

  toolkit: jsPlumbToolkit;

  renderParams: SurfaceRenderParams;
  toolkitParams: jsPlumbToolkitOptions = {};

  @ViewChild('solarPerf')
  solarPrefOverlay: OverlayPanel;

  nodeOverlayData: BusinessTireComponentNode;
  @ViewChild('assetallocation') assetallocation: Carousel;

  data: BusinessView;

  view: AngularViewOptions = {
    nodes: {
      actionNodeParent: {
        events: {
          tap: (params: any) => {},
          mouseover: (param: any) => {
            this.openOverlayPanel(param.node.data);
          },
          mouseout: (param: any) => {
            // setTimeout(()=>{
            //   this.solarPrefOverlay.hide();
            // }, 1000)
          },
        },
      },
      outputNodeParent: {
        events: {
          mouseover: (param: any) => {},
          mouseout: (param: any) => {},
        },
      },
      actionNode: {
        parent: 'actionNodeParent',
        component: ActionNodeComponent,
        events: {
          click: function (e, originalEvent) {},
        },
      },
      outputNode: {
        parent: 'outputNodeParent',
        component: OutputNodeComponent,
      },
    },
    edges: {
      default: {
        connector: 'Straight',
        anchor: ['Right', 'Left'],
        overlays: [
          // ['Label', { location: 0.5, label: '${label}' }],
          ['Arrow', { location: 0.3, width: 8, length: 8, direction: 1 }],
        ],

        endpoint: 'Blank',
      },
    },
  };

  constructor(private $jsplumb: jsPlumbService) {}

  ngOnInit(): void {
    const me = this;
    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    me.renderParams = {
      layout: {
        type: 'Spring',
      },
      zoomToFit: true,
      consumeRightClick: false,
      enablePanButtons: false,
    };
    me.data = BUSINESS_VIEW_TIER_COMPONENT;

    this.toolkit.load({
      data: {
        nodes: me.data.businessTierComponent.node,
        edges: me.data.businessTierComponent.edge,
      },
    });
  }

  openOverlayPanel(data) {
    this.nodeOverlayData = data;
    console.log(this.nodeOverlayData);
    
    this.solarPrefOverlay.show(event);
  }
}