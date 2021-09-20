import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { jsPlumbToolkit, jsPlumbToolkitOptions, Surface, SurfaceRenderParams, ViewOptions } from 'jsplumbtoolkit';
import { jsPlumbService } from 'jsplumbtoolkit-angular';
import { DBMonitoringService } from '../../../services/db-monitoring.services';
import { DbClusterNodeComponent } from './db-cluster-node/db-cluster-node.component';
import { DbClusterComponent } from './db-cluster/db-cluster.component';
import { DbNodeIndicesComponent } from './db-node-indices/db-node-indices.component';
import { ExecutionPlanDetailComponent } from './execution-plan-detail/execution-plan-detail.component';

@Component({
  selector: 'app-execution-plan-diagram',
  templateUrl: './execution-plan-diagram.component.html',
  styleUrls: ['./execution-plan-diagram.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExecutionPlanDiagramComponent implements OnInit {

  @Input('planJson')
  planJson: JSON;
  // these are plugged in to the Surface component.
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';
  surface: Surface;
  zoomLevel: number;
  toolkit: jsPlumbToolkit;
  nodes = [];
  edges = [];
  edgeLabelVisible = true;

  // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};
  view: ViewOptions;

  constructor(
    private router: Router, 
    private $jsplumb: jsPlumbService,
    private dbmonService: DBMonitoringService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const me = this;

    me.edgeLabelVisible = me.dbmonService.$DataBaseType != 3;
    // the view in this demonstration declares a component to use to render each node type, and the appearance and behaviour of
  // a single edge type.
    me.view = {
      nodes: {
        cluster: {
          component: DbClusterComponent,
          events:{
            click:function(params) {
              // params.toolkit is the Toolkit instance
              // params.renderer is the Surface widget
              // params.e is the original mouse event 
              // params.node is the Toolkit Node
              // params.el is the element from the DOM representing the Node
              console.log('node clicked-' + params.node.data);
              let dialogRef = me.dialog.open(ExecutionPlanDetailComponent, {
                data: params.node.data,
                height: 'auto',
                width: '45%',
              })
            }
          }
        },
        clusterNode: {
          component: DbClusterNodeComponent,
        },
        nodeIndices: {
          component: DbNodeIndicesComponent,
        },
      },
      edges: {
        default: {
          connector: ["Straight", {stub: 30, gap: 0}],
          anchor: ['Right', 'Left'],
          overlays: [
              ['Arrow', { location: 0.9, width: 8, length: 8, direction: 1 }],
              [ 'Label', {
                location: [0.5],
                label: '${label}',
                visible: me.edgeLabelVisible,
          } ]
          ],
          endpoint: 'Blank',
        },
      },
    };
    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);
    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
      this.surface = s;
    });
    me.nodes = [];
    me.edges = [];
    if(me.planJson && me.planJson['statements']){
      me.parsePlanJsonArray('0', me.planJson['statements']);
    }
    
    this.toolkit.load({
      data: {
        nodes: me.nodes,
        // [
          // { id: '1', type: 'cluster' },
          // { id: '2', type: 'clusterNode'},
          // { id: '3', type: 'clusterNode' },
          // { id: '4', type: 'nodeIndices'},
          // { id: '5', type: 'nodeIndices' },
          // { id: '6', type: 'nodeIndices' },
          // { id: '7', type: 'nodeIndices'},
          // { id: '8', type: 'nodeIndices' },
          // { id: '9', type: 'nodeIndices' },
          // { id: '10', type: 'nodeIndices' },
          // { id: '11', type: 'nodeIndices'},
          // { id: '12', type: 'nodeIndices' },
          // { id: '13', type: 'nodeIndices' },
          // { id: '14', type: 'nodeIndices'},
          // { id: '15', type: 'nodeIndices' },
          // { id: '1', type: 'cluster', left: 2207.32, top: 47.5814 },
          // { id: '2', type: 'clusterNode', left: 1887.53, top: -72.0586 },
          // { id: '3', type: 'clusterNode', left: 1887.53, top: 173.117 },
          // { id: '4', type: 'nodeIndices', left: 1518, top: -184.351 },
          // { id: '5', type: 'nodeIndices', left: 1518, top: -69.0586 },
          // { id: '6', type: 'nodeIndices', left: 1518, top: 272.059 },
          // { id: '7', type: 'nodeIndices', left: 1518, top: 179.176 },
          // { id: '8', type: 'nodeIndices', left: 1518, top: 85.7657 },
          // { id: '9', type: 'nodeIndices', left: 1183.99, top: -183.297 },
          // { id: '10', type: 'nodeIndices', left: 1183.99, top: -68.3514 },
          // { id: '11', type: 'nodeIndices', left: 866.467, top: -182.004 },
          // { id: '12', type: 'nodeIndices', left: 866.467, top: -67 },
          // { id: '13', type: 'nodeIndices', left: 1220.4, top: 228.234 },
          // { id: '14', type: 'nodeIndices', left: 1220.4, top: 321.703 },
          // { id: '15', type: 'nodeIndices', left: 898.974, top: 228 },
        // ],
        edges: me.edges
        // [
        //   { source: '1', target: '2', data: {label: 'Count: 2ms'}, },
        //   { source: '1', target: '3' },
        //   { source: '2', target: '4' },
        //   { source: '2', target: '5' },
        //   { source: '3', target: '6' },
        //   { source: '3', target: '7' },
        //   { source: '3', target: '8' },
        //   { source: '4', target: '9' },
        //   { source: '5', target: '10' },
        //   { source: '9', target: '11' },
        //   { source: '10', target: '12' },
        //   { source: '6', target: '13' },
        //   { source: '6', target: '14' },
        //   { source: '13', target: '15' },
        // ],
      },
    });
  }

  nodeChanged(event) {
    const me = this;
    me.router.navigate(['/node-info']);
  }

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
  parsePlanJsonArray(sourceNodeId, jsonArray) {
    const me = this;
    jsonArray.forEach(element => {
      let imgsrc = 'UnifiedDashboard/cavisson/assets/images/' + element.imgName;
      let nodeImageDisplay = true;
      if(element.imgName.indexOf(".png") == -1){
        nodeImageDisplay = false;
        // this.postgresImgBack = jsonObj.imgName;
      }
      let node = {
        id: (element.nodeId + 2).toString(),
        type: 'cluster',
        label: element.label,
        cost: element.cost,
        imgsrc: imgsrc,
        nodeImageDisplay: nodeImageDisplay,
        completeElementInfo: element
      };
      me.nodes.push(node);
      if(Number(sourceNodeId) >= 1){
        let edgeLabel:string = '';
        let edgeLabelVisible = false;
        if((element.AvgRowSize && element.AvgRowSize != null && element.AvgRowSize != '') || element.AvgRowSize > 0){
          edgeLabel = element.AvgRowSize.toString();
          edgeLabelVisible = true;
        }
        me.edges.push(
            { source: sourceNodeId, target: (element.nodeId + 2).toString(), data: {label: edgeLabel, edgeLabelVisible: edgeLabelVisible}, }
          );
      }
      if (element.hasOwnProperty('children')) {
        me.parsePlanJsonArray((element.nodeId + 2).toString(), element['children']);
      }
    });
  }

  zoomToFit() {
    this.surface.getToolkit().clearSelection();
    this.surface.zoomToFit();
  }

  zoomToLevel(level) {
    this.zoomLevel = (level * 100);
    this.surface.setZoom(level);

    var divContainer = document.getElementById("myDIV");
    // Get all div  with class="1x" inside the container
    var btns = divContainer.getElementsByClassName("1x");

    // Loop through the divs and add the selected class to the current/clicked div
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("selected");
        current[0].className = current[0].className.replace(" selected", "");
        this.className += " selected";
      });
    }
  }
  // zoomToLevelTwo() {
  //   this.surface.setZoom(0.4);
  // }
  // zoomToLevelThree() {
  //   this.surface.setZoom(0.7);
  // }
  // zoomToLevelFour() {
  //   this.surface.setZoom(1);
  // }

  zoomChange(e){
    this.surface.setZoom(e.value/100);
  }

  ngOnDestroy() {
    const me = this;
    me.toolkit.clear();
  }

}
