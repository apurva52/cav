import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng';

import {
  jsPlumbToolkit,
  jsPlumbToolkitOptions,
  ViewOptions,
  SurfaceRenderParams,
} from 'jsplumbtoolkit';
import {
  jsPlumbSurfaceComponent,
  jsPlumbService,
} from 'jsplumbtoolkit-angular';
import { ClusterComponent } from './cluster/cluster.component';
import { ClusterNodeComponent } from './cluster-node/cluster-node.component';
import { OutputNodeIndicesComponent } from './output-node-indices/output-node-indices.component';

@Component({
  selector: 'app-cluster-diagram',
  templateUrl: './cluster-diagram.component.html',
  styleUrls: ['./cluster-diagram.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClusterDiagramComponent implements OnInit {
  breadcrumb: MenuItem[];
  nodeInfo: SelectItem[];
  indices: any[];

  // these are plugged in to the Surface component.
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';

  toolkit: jsPlumbToolkit;

  // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};

  constructor(private router: Router, private $jsplumb: jsPlumbService) {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'System' },
      { label: 'Cluster Monitor' },
      { label: 'Cluster Diagram' },
    ];
    me.nodeInfo = [{ label: 'Cq22zz', value: 'cq22zz' }];
    me.indices = [
      {
        label: 'netForest',
        value: 'netForest',
      },
      {
        label: 'netForest1',
        value: 'netForest1',
      },
      {
        label: 'netForest',
        value: 'netForest',
      },
      {
        label: 'netForest1',
        value: 'netForest1',
      },
    ];

    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.toolkit.load({
      data: {
        nodes: [
          { id: '1', type: 'cluster', left: 58.5392, top: 6.59954 },
          { id: '2', type: 'clusterNode', left: 308.907, top: -128.071 },
          { id: '3', type: 'clusterNode', left: 308.502, top: 145.334 },
          { id: '4', type: 'nodeIndices', left: 602.84, top: -198.501 },
          { id: '5', type: 'nodeIndices', left: 603.992, top: -58.9403 },
          { id: '6', type: 'nodeIndices', left: 601.023, top: 224.42 },
          { id: '7', type: 'nodeIndices', left: 601.283, top: 73.0466 },
          { id: '8', type: 'nodeIndices', left: 602.104, top: 144.946 },
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '1', target: '3' },
          { source: '2', target: '4' },
          { source: '2', target: '5' },
          { source: '3', target: '6' },
          { source: '3', target: '7' },
          { source: '3', target: '8' },
        ],
      },
    });
  }

  nodeChanged(event) {
    const me = this;
    console.log(event);
    me.router.navigate(['/node-info']);
  }

  // the view in this demonstration declares a component to use to render each node type, and the appearance and behaviour of
  // a single edge type.
  view: ViewOptions = {
    nodes: {
      cluster: {
        component: ClusterComponent,
      },
      clusterNode: {
        component: ClusterNodeComponent,
      },
      nodeIndices: {
        component: OutputNodeIndicesComponent,
      },
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
    },
  };

  // we use a Spring layout, and we enable right-click on the canvas. on data load, we zoom the canvas to show all the data.
  renderParams: SurfaceRenderParams = {
    layout: {
      type: 'Spring',
    },
    zoomToFit: true,
    consumeRightClick: false,
    enablePanButtons: false,
  };
}
