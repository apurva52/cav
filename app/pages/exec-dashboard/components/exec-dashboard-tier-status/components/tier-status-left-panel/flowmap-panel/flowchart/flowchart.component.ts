import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Dialogs, DrawingTools, Node, Port, Edge, Group, jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { jsPlumbSurfaceComponent, BaseNodeComponent } from 'jsplumbtoolkit-angular';

import { ActionNodeComponent } from '../action-node/action-node.component';
import { OutputNodeComponent } from '../output-node/output-node.component';

import { NODE, NODE_MEASUREMENTS, PORT, RENDER_PARAM, EDGE_DEFAULT, EDGE_BIDIRECTIONAL } from '../../../../const/flowchart-const';

import { TierStatusDataHandlerService } from '../../../../services/tier-status-data-handler.service';
export interface abc {
  from, to, response, cps, count, error, eps
}
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})

export class FlowchartComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  /*Observable sources for favorite data updation.*/
  // private flowmapBroadcaster = new Subject<Object>();
  // flowmapObservable$ = this.flowmapBroadcaster.asObservable();

  toolkit: jsPlumbToolkit;
  surface: Surface;

  toolkitId: string;
  surfaceId: string;
  view: Object;
  renderParams: Object;
  zIndex: number = 13;

  nodeTypes = NODE_MEASUREMENTS;


  //node after double click
  selectedNodeOnDblClck = {node:""};

  constructor(private _dataContainer: TierStatusDataHandlerService) {
    this.toolkitId = 'flowchart';
    this.surfaceId = 'flowchartSurface';

    const nodeObj = NODE;
    
    nodeObj['selectable'] = {
      events: {
          dblclick: (params: any) => {
          console.log(params);

          //Keeping selected node on double click event
          this.selectedNodeOnDblClck = params;
          this.toggleSelection(params.node);

          //opening right side panel on selecting any node
          if(!this._dataContainer.$isMinimize){
            this._dataContainer.$isMinMax = true

          }
        },
        click: (params: any) => {
          params.el.style.zIndex = this._dataContainer.$globalZIndex // increasing the z-index of the selected node to show it on top
        },
        mousedown: (params: any) => {
	  if (params.node != this.selectedNodeOnDblClck.node) {
             this.toolkit.clearSelection();
	  }
          // this.toolkit. 
        },
        mouseup: (params: any) => {
	 if(undefined != this.selectedNodeOnDblClck && this.selectedNodeOnDblClck.node != "" ){
	   if (params.node != this.selectedNodeOnDblClck.node) {
             params = this.selectedNodeOnDblClck
             this.toolkit.toggleSelection(params.node);
	   }
	 }
        },
        contextmenu: (params: any) => {
		this._dataContainer.rightClickActionHandler(params);
        },
      }
    };

    this.view = {
      nodes: nodeObj,
      edges: {
        'default': EDGE_DEFAULT,
        'twoway': EDGE_BIDIRECTIONAL,
        'bidirectional': {
          parent: 'twoway',
          overlays: [
            [
              'Label', {
                label: '${label}',
                events: {
                  click: (params: any) => {
                    this.editLabel(params.edge);
                  }
                }
              }
            ]
          ]
        },
        'connection': {
          parent: 'default',
          overlays: [
            [
              'Label', {
                label: '${label}',
                events: {
                  click: (params: any) => {
                    this.editLabel(params.edge);
                  }
                }
              }
            ]
          ]
        }
      },
      ports: PORT
    };

    this.renderParams = RENDER_PARAM;

  }

  resolveNode(typeId: string) {
    return ({
      'ActionNode': ActionNodeComponent,
      'OutputNode': OutputNodeComponent
    })[typeId];
  }

  getToolkit(): jsPlumbToolkit {
    return this.toolkit;
  }

  toggleSelection(node: any) {
    this.toolkit.clearSelection();
    this.toolkit.toggleSelection(node);
    // this._dataContainer.$selectedNode = node.data.id;
    if (node.data.type != 'action') {
      this._dataContainer.$showDashboard = false;
    }
    this._dataContainer.$selectedNode = node.data.actualTierName;
    this._dataContainer.$selectedMenuActualNameNode = node.data.actualTierName;
   // to get entity on DBClick
    this._dataContainer.selectedMenuNodeEntity= node.data.entity;
    this._dataContainer.$selectedMenuNode = node.data.id;
    let msg = 'TOGGLE_SELECTION';
    this._dataContainer.flowChartActionHandler(msg);
    // this.flowmapBroadcaster.next(msg);
  }

  removeEdge(edge: any) {
    this.toolkit.removeEdge(edge);
  }

  /*method to create call details
  *when user click on connection's label then to open a dialogue with data
  */
  
  editLabel(edge: any) {
    let source = edge.source.data.id;
    let target = edge.target.data.id;

    let tempTarget = target;
    if (edge.source.data.actualTierName.trim().toLocaleLowerCase().includes("jmsc")) { // show inboud arrow in case jmsc
      tempTarget = source;
    }

    const callDetailArr = edge.data.backEnd.find((e) => {
      if(e.name === tempTarget){
        return e.name;
      }
    });
    let timeInSec = this._dataContainer.getTimeInSeconds();
    //For Instance level
    if(callDetailArr.data[0].totalErrors == undefined){
      callDetailArr.data[0].totalErrors = callDetailArr.data[0].errors;
    }
    //create an interface for this

    let callDetailsObj:any = [];
    callDetailsObj['msg'] = 'CALL_DETAILS_IP';
    callDetailsObj['data'] = [];
    if (callDetailArr.producer || callDetailArr.consumer) {
      if (callDetailArr.producer) {
        // callDetailsObj['data'].push({ from: source, to: callDetailArr.producer.name == callDetailArr.name?callDetailArr.producer.actualName:callDetailArr.producer.name, response: callDetailArr.producer.data.totalResTime, cps: callDetailArr.producer.data.totalCalls, count: callDetailArr.producer.data.totalCallCount, error: callDetailArr.producer.data.totalErrors, eps: callDetailArr.producer.data.totalErrorsPerSec });
        callDetailsObj['data'].push({ from: target == callDetailArr.name?source:target, to: callDetailArr.name, response: callDetailArr.producer.data.totalResTime, cps: callDetailArr.producer.data.totalCalls, count: callDetailArr.producer.data.totalCallCount, error: callDetailArr.producer.data.totalErrors, eps: callDetailArr.producer.data.totalErrorsPerSec });
      }
      if (callDetailArr.consumer) {
        // callDetailsObj['data'].push({ from: callDetailArr.consumer.name == callDetailArr.name?callDetailArr.consumer.actualName:callDetailArr.consumer.name, to: source, response: callDetailArr.consumer.data.totalResTime, cps: callDetailArr.consumer.data.totalCalls, count: callDetailArr.consumer.data.totalCallCount, error: callDetailArr.consumer.data.totalErrors, eps: callDetailArr.consumer.data.totalErrorsPerSec });
        callDetailsObj['data'].push({ from: callDetailArr.name, to: target, response: callDetailArr.consumer.data.totalResTime, cps: callDetailArr.consumer.data.totalCalls, count: callDetailArr.consumer.data.totalCallCount, error: callDetailArr.consumer.data.totalErrors, eps: callDetailArr.consumer.data.totalErrorsPerSec });
      }
      // callDetailsObj['data'].push({ from: 'Total', to: '', response: callDetailArr.data[0].resCalls, cps: callDetailArr.data[0].calls, count: callDetailArr.data[0].callCount, error: callDetailArr.data[0].totalErrors, eps: (+callDetailArr.data[0].totalErrors)/timeInSec });
    } else {
      callDetailsObj['data'].push({ from: source, to: target, response: callDetailArr.data[0].resCalls, cps: callDetailArr.data[0].calls, count: callDetailArr.data[0].callCount, error: callDetailArr.data[0].totalErrors, eps: (+callDetailArr.data[0].totalErrors)/timeInSec });
    }

    this._dataContainer.flowChartActionHandler(callDetailsObj);

  }

  typeExtractor(el: Element) {
    return el.getAttribute('jtk-node-type');
  }

  dataGenerator(type: string, el: Element) {
    return {
      type: el.getAttribute('jtk-node-type'),
      w: parseInt(el.getAttribute('jtk-width'), 10),
      h: parseInt(el.getAttribute('jtk-height'), 10)
    };
  }

  changeIndex(tierId) {

    if (this.zIndex > 90) {
      this.zIndex = 13;
    }
    tierId.data.zIndex = this.zIndex;
    this.toolkit.updateNode(tierId.id, tierId.data);
    this.zIndex++;
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.getToolkit();

    new DrawingTools({
      renderer: this.surface
    });
  }

  ngOnDestroy() {
    console.log('flowchart being destroyed');
  }

  ngOnInit() {
  }

}
 