import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Edge, FactoryCallback, jsPlumbToolkit, jsPlumbToolkitOptions, LoadOptions, Node, SurfaceRenderParams } from 'jsplumbtoolkit';
import { AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { ConfirmationService } from 'primeng';
import { Action, ActionNode, Callback, Edges, JtkNodeParam, State, StateType, Trigger } from '../../common/interfaces/callback';
import { EndNodeComponent } from '../callback-nodes/end-node/end-node.component';
import { StartNodeComponent } from '../callback-nodes/start-node/start-node.component';
import { StateNodeComponent } from '../callback-nodes/state-node/state-node.component';
import { CallbackDesignerService } from '../service/callback-designer.service';

@Component({
  selector: 'app-callback-state-diagram',
  templateUrl: './callback-state-diagram.component.html',
  styleUrls: ['./callback-state-diagram.component.scss']
})

export class CallbackStateDiagramComponent implements OnInit, OnChanges {
  @Input() callback: Callback;
  @Output() currentState: EventEmitter<State> = new EventEmitter<State>();
  @Output() openFlowchart = new EventEmitter<any>();

  toolkit: jsPlumbToolkit;

  toolkitId: string;
  surfaceId: string;

  view: AngularViewOptions;
  renderParams: SurfaceRenderParams;
  toolkitParams: jsPlumbToolkitOptions;
  edit_edge: boolean;

  display: boolean;
  edgeLabel: string;
  edge: any;
  stateEdge: any[] = [];
  editStateDialog: boolean;
  /** this variable is used to store the state information on edit state */
  state: any;
  invalidStateLabel: boolean;
  stateLabel: string;

  constructor(private $jsplumb: jsPlumbService, private cbService: CallbackDesignerService, private confirmationService: ConfirmationService) {
    this.toolkitId = 'stateDiagram';
    this.surfaceId = 'stateDiagramSurface';

    this.renderParams = {
      layout: {
        type: 'Spring',
      },
      events: {
        canvasClick: () => {
          this.toolkit.clearSelection();
        },
        edgeAdded: (params: any) => {
          console.log('edge added : ', params);
        }
      },
      consumeRightClick: false,
      enablePanButtons: false,
      refreshLayoutOnEdgeConnect: true
    };

    this.view = {
      nodes: {
        start: {
          component: StartNodeComponent,
          parent: 'selectable'
        },
        state: {
          component: StateNodeComponent,
          parent: 'selectable'
        },
        end: {
          component: EndNodeComponent,
        },
        selectable: {
          events: {
            tap: (params) => {
              this.toggleSelection(params.node);
            },
            dblclick: (params) => {
              // start node can't be deleted
              if (params.node.data.type !== 'start') {
                this.removeNode(params.node.data);
              }
            }
          }
        }
      },
      edges: {
        default: {

          connector: 'Flowchart',
          anchor: ['Right', 'Left'],
          overlays: [
            ['Arrow', { location: 1, width: 8, length: 8, direction: 1 }],
            ['Label', {
              label: '${label}',
              location: 0.4,
              events: {
                tap: (params: any) => {
                  this.edit_edge = true;
                  this.editEdge(params.edge);
                },
                mouseover: (params: any) => {
                  params.e.target.setAttribute('title', params.edge.data.title);
                  params.e.target.style.cursor = 'pointer';
                },
              }

            }]
          ],
          endpoint: 'Blank',
          events: {
            click: (params: any) => {
              if (!this.edit_edge) {
                this.openFlowchart.emit(params);
              }
            }
          }
        },
        connection: {
          parent: 'default',
          overlays: [
            [
              'Label', {
                label: '${label}'
              },

            ]
          ],
          events: {
            click: (params: any) => {
              this.openFlowchart.emit(params);
            }
          },
        }
      },
    };

    this.toolkitParams = {
      nodeFactory: (type: string, data: any, callback: FactoryCallback) => {
        const me = this;
        console.log('nodeFactory Called | type : ', type, ' | data : ', data);

        const jData = { w: 70, h: 70 };
        const state = new State(`State_${me.callback.counter.state}`, StateType.NORMAL, jData, `state_${me.callback.counter.state}`);
        me.callback.counter.state++;

        me.callback.states.push(state);

        data.text = state.text;
        data.id = state.id;
        data.jData = state.jData;

        // mark the callback dirty
        me.callback.dirty = true;

        callback(data);
      },
      beforeStartConnect: (node: any, edgeType: string) => {
        return { label: '...' };
      }
    };

    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

  }

  ngOnChanges(): void {
    this.toolkit.clear();
    if (this.callback) {
      this.toolkit.load(this.getStateDiagramData());
      setTimeout(() => {
        this.refreshEdges();
      });

    }

  }

  ngOnInit(): void {
    this.cbService.on('refreshSDEdges').subscribe((data: string) => {
      this.refreshEdges();
    });

    this.cbService.on('deleteStateNode').subscribe((obj: any) => {
      this.removeNode(obj);
    });

    this.cbService.on('editStateNode').subscribe((obj: any) => {
      this.editNode(obj);
    })

    this.toolkit.bind('dataUpdated', this.dataUpdateListener.bind(this));

  }

  dataUpdateListener() {
    // TODO: update jsplumb data.
    const tempToolkitData = Object(this.toolkit.exportData());
    this.updateBTInfo(tempToolkitData);
  }

  updateBTInfo(toolKitData: any) {
    toolKitData.edges = this.stateEdge;
    if (toolKitData) {
      toolKitData.nodes.forEach((node: any) => {

        if (node.type === 'state' || node.type === 'start' || node.type === 'end') {
          this.callback.states.some(state => {
            if (node.id === state.id) {
              if (state.jData === undefined) {
                state.jData = new JtkNodeParam();
              }

              return this.copyJData(node, state.jData);
            }
            return false;
          });
        } else if (node.type === 'trigger') {
          this.callback.triggers.some(trigger => {
            if (node.id === trigger.id) {
              if (trigger.jData === undefined) {
                trigger.jData = new JtkNodeParam();
              }
              return this.copyJData(node, trigger.jData);
            }
            return false;
          });
        } else if (node.type === 'action') {
          this.callback.actions.some(action => {
            if (node.id === action.id) {
              if (action.jData === undefined) {
                action.jData = new JtkNodeParam();
              }
              return this.copyJData(node, action.jData);
            }
            return false;
          });
        }
      });
    }

  }

  copyJData(input: any, out: any) {
    if (!input) { return; }

    const keys = ['w', 'h', 'top', 'left'];
    keys.forEach(key => {
      if (input[key] !== undefined) {
        out[key] = input[key];
      }
    });

    return true;
  }

  refreshEdges() {
    console.log('refreshing edges ...');
    console.log('this.toolkit : ', this.toolkit);
    const edges = [];
    this.callback.actions.forEach((action: Action) => {
      action.data.aNOdes.forEach((node: ActionNode) => {
        if (node.data.api.api === 'CAVNV.sb.gotoState') {

          // get source and target to create edge
          const source = action.stateId;
          let target = node.data.argument['stateName'];

          // set label and title for edges
          let label = '';
          let title = '';

          this.callback.triggers.forEach((trigger: Trigger) => {
            if (trigger.id === action.triggerId) {
              label = this.getEdgeLabel(action.id);

              if (label === '') {
                switch (trigger.type.toLowerCase()) {
                  case 'click':
                    label = 'Click on ' + (trigger.domSelector.length > 30 ? trigger.domSelector.slice(0, 30) + '...' : trigger.domSelector) + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = 'Click on ' + trigger.domSelector + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    break;

                  case 'input_change':
                    label = 'Input Change in ' + (trigger.domSelector.length > 30 ? trigger.domSelector.slice(0, 30) + '...' : trigger.domSelector) + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = 'Input Change in ' + trigger.domSelector + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    break;

                  case 'visibility_change':
                    label = 'Visibility Change in ' + (trigger.domSelector.length > 30 ? trigger.domSelector.slice(0, 30) + '...' : trigger.domSelector) + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = 'Visibility Change in ' + trigger.domSelector + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    break;

                  case 'content_change':
                    label = 'Content Change in ' + (trigger.domSelector.length > 30 ? trigger.domSelector.slice(0, 30) + '...' : trigger.domSelector) + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = 'Content Change in ' + trigger.domSelector + ' (T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    break;

                  case 'hashchange':
                    label = 'Hash Change ' + '(T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = label;
                    break;

                  case 'xhr_complete':
                    label = 'XHR Complete for ' + (trigger.urlPattern.length > 30 ? trigger.urlPattern.slice(0, 30) + '...' : trigger.urlPattern) + '(T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = 'XHR Complete for ' + trigger.urlPattern + '(T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    break;

                  case 'xhr_failed':
                    label = 'XHR Failed for ' + (trigger.urlPattern.length > 30 ? trigger.urlPattern.slice(0, 30) + '...' : trigger.urlPattern) + '(T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = 'XHR Failed for ' + trigger.urlPattern + '(T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    break;

                  case 'timeout':
                    label = 'Timeout of ' + trigger.timeOut + 'ms' + '(T' + trigger.id.split('_')[1] + ',A' + action.id.split('_')[1] + ')';
                    title = label;
                    break;

                  default:
                    break;
                }
              }
            }
          });

          // add edge
          edges.push({
            source,
            target,
            data: {
              label,
              title,
              actionId: action.id,
              triggerId: action.triggerId
            }
          });
        }
      });
    });

    // remove any existing nodes
    this.toolkit.getAllEdges().forEach(edge => this.toolkit.removeEdge(edge));

    // create new edges
    edges.forEach(edge => {
      this.callback.states.forEach(state => {
        if (edge.source === state.id) {
          this.toolkit.addEdge(edge);
        }
      });
    });
  }

  getEdgeLabel(id: string): string {
    if (this.callback.edges) {
      for (const edge of this.callback.edges) {
        if (edge.actionId === id) {
          return edge.label;
        }
      }
    }
    return '';
  }

  getStateDiagramData(): LoadOptions {
    const sdData = {
      nodes: [],
      edges: []
    };
    for (const state of this.callback.states) {
      switch (state.type) {
        case StateType.Start:
          sdData.nodes.push({
            id: 'start',
            type: 'start',
            text: 'Start',
            w: 70,
            h: 70,
            top: 0,
            left: 350
          });


          break;

        case StateType.End:
          sdData.nodes.push({
            id: 'end',
            type: 'end',
            text: 'End',
            w: 70,
            h: 70,
            top: 200,
            left: 350
          });
          break;

        default:
          sdData.nodes.push({
            id: state.id,
            type: 'state',
            text: state.text,
            w: 70,
            h: 70
          });
          break;
      }

      this.copyJData(state.jData, sdData.nodes[sdData.nodes.length - 1]);

    }

    console.log('data : ', sdData);
    return { data: sdData };
  }

  dataGenerator(el: HTMLElement) {
    return {
      type: el.getAttribute('data-node-type'),
      w: 70,
      h: 70
    };
  }

  toggleSelection(node: Node): void {
    this.toolkit.clearSelection();
    this.toolkit.toggleSelection(node);
    console.log('State Diagram | Selected Node - ', node);

    for (const state of this.callback.states) {
      if (state.id === node.data.id) {
        this.currentState.emit(state);
      }
    }
  }

  removeNode(data): void {

    console.log('removeNode : ', data);

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to delete the node ${data.text}?`,
      key: 'callback',

      accept: () => {
        this.toolkit.removeNode(data);

        // check for associated triggers and actions for the node to be deleted
        // deleting associated trigger
        const tindex = this.callback.triggers.findIndex((trigger) => data.id === trigger.stateId);
        if (tindex > -1) {
          this.callback.triggers.splice(tindex, 1);
        }

        // deleting associated actions
        const aindex = this.callback.actions.findIndex((action) => data.id === action.stateId);
        if (aindex > -1) {
          this.callback.actions.splice(aindex, 1);
        }

        // and finally deleting the state
        const sindex = this.callback.states.findIndex((state) => data.id === state.id);
        if (sindex > -1) {
          this.callback.states.splice(sindex, 1);
        }

      }
    });

  }

  editNode(data): void {
    this.editStateDialog = true;
    this.stateLabel = data.text;
    this.state = data;
  }

  /** this method is used to update the state label */
  saveStateLabel() {
    if (this.stateLabel == null || this.stateLabel.trim() === '') {
      this.invalidStateLabel = true;
      return;
    }

    this.state.text = this.stateLabel;

    this.invalidStateLabel = false;
    this.editStateDialog = false;
    // update the label
    this.callback.states.forEach(state => {
      if (state.id === this.state.id) {
        state.text = this.state.text;
      }
    });
  }

  removeEdge(edge): void {
    this.toolkit.removeEdge(edge);
  }

  editEdge(edge) {
    // removing (T1,A1) from edit edge label from the dialog
    let label = edge.data.label;
    const suffix = label.match(/(\(T[0-9],A[0-9)])\)/);
    label = label.replace(suffix[0], '');

    this.edgeLabel = label;
    this.display = true;
    this.edge = edge;
  }

  updateEdge() {
    this.edit_edge = false;
    this.edge.data.label = (this.edgeLabel.length > 30 ? this.edgeLabel.slice(0, 30) + '...' : this.edgeLabel) + '(T' + this.edge.data.triggerId.split('_')[1] + ',A' + this.edge.data.actionId.split('_')[1] + ')';
    this.edge.data.title = this.edgeLabel + '(T' + this.edge.data.triggerId.split('_')[1] + ',A' + this.edge.data.actionId.split('_')[1] + ')';

    this.toolkit.removeEdge(this.edge);
    this.toolkit.addEdge(this.edge);

    if (this.callback.edges) {
      this.callback.edges.forEach(e => {
        if (this.edge.data.actionId === e.actionId) {
          e.label = this.edge.data.label;
          e.title = this.edge.data.title;
          return;

        }
      });
    }

    this.callback.edges.push(this.edge.data);

    this.display = false;
  }

  onEditEdgeHide(): void {
    this.edit_edge = false;
  }

}
