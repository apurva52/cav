import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Dialogs, FactoryCallback, jsPlumbToolkit, jsPlumbToolkitOptions, LoadOptions, Node, SurfaceRenderParams } from 'jsplumbtoolkit';
import { AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { ConfirmationService, MessageService } from 'primeng';
import { ActionApiList } from '../../common/interfaces/action-api';
import { Action, ActionApiData, ActionNode, Callback, ConditionData, ConditionNode, JtkNodeParam } from '../../common/interfaces/callback';
import { ActionNodeComponent } from '../callback-nodes/action-node/action-node.component';
import { PlaceholderNodeComponent } from '../callback-nodes/placeholder-node/placeholder-node.component';
import { QuestionNodeComponent } from '../callback-nodes/question-node/question-node.component';
import { StartNodeComponent } from '../callback-nodes/start-node/start-node.component';
import { CallbackDesignerService } from '../service/callback-designer.service';


@Component({
  selector: 'app-callback-flowchart',
  templateUrl: './callback-flowchart.component.html',
  styleUrls: ['./callback-flowchart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallbackFlowchartComponent implements OnInit, OnChanges {
  @Input() action: Action;
  @Input() callback: Callback;

  toolkit: jsPlumbToolkit;

  toolkitId: string;
  surfaceId: string;

  view: AngularViewOptions;
  renderParams: SurfaceRenderParams;
  toolkitParams: jsPlumbToolkitOptions;
  lastPlaceHolderSource: string;
  lastPlaceHolderLabel: any;

  showApiForm: boolean;
  showConditionForm: boolean;
  conditionData: any;
  apiData: any;
  /** this variable stores the data of newly added / selected node */
  selectedNodeData: any;
  addedByMouse: boolean = false;

  editorOptions = { language: 'javascript', automaticLayout: true };
  code: string;

  showEditorDialog: boolean;
  showCodeEditor: boolean;
  editor: monaco.editor.IEditor;

  constructor(private $jsplumb: jsPlumbService, private messageService: MessageService, private cbService: CallbackDesignerService, private confirmationService: ConfirmationService) {
    this.toolkitId = 'flowchart';
    this.surfaceId = 'flowchartSurface';



    this.renderParams = {
      layout: {
        type: 'Spring',
      },
      events: {
        canvasClick: () => {
          this.clearSelection(true);
        },
        nodeAdded: (param: any) => {
          const me = this;
          // on node added , connect with the above node
          console.log('FlowChart | Node Added  - ', param.node);
          console.log('current callback : ', me.callback);

          const data = param.node.data;
          // ISSUE: eventInfo is deprecated
          if (me.addedByMouse) {
            me.addedByMouse = false;
            // try to add to previous node.
            // if (me.lastPlaceHolderSource != null) {
            //   me.toolkit.addEdge({
            //     source: me.lastPlaceHolderSource,
            //     target: data.id,
            //     data: {
            //       label: me.lastPlaceHolderLabel,
            //       type: 'connection'
            //     }
            //   });

            // } else {
            const aboveNode = me.getClosestNode(data);

            if (aboveNode) {
              console.log('aboveNode : ', aboveNode);

              if (aboveNode.data.type === 'question') {
                me.confirmationService.confirm({
                  header: 'Select Edge Type',
                  key: 'callback',

                  accept: () => {
                    me.toolkit.addEdge({
                      source: aboveNode.data.id,
                      target: data.id,
                      data: {
                        type: 'connection',
                        label: 'yes'
                      }
                    });
                  },
                  reject: () => {
                    // no type edge selected
                    me.toolkit.addEdge({
                      source: aboveNode.data.id,
                      target: data.id,
                      data: {
                        type: 'connection',
                        label: 'no'
                      }
                    });
                  }
                });

              } else {
                me.toolkit.addEdge({
                  source: aboveNode.data.id,
                  target: data.id
                });
              }


            }
            // }

            // me.lastPlaceHolderSource = null;
            // me.lastPlaceHolderLabel = null;

            if (data.type === 'action') {

            } else if (data.type === 'question') {
              // add paceholder nodesif added node if of type question

              // set placeholder nodes position
              // const leftPHNodePos = { left: data.left - 100, top: data.top + 100 };
              // const righPHNodePos = { left: data.left + 100, top: data.top + 100 };

              //  add placeholder nodes
              // me.toolkit.addNodes([
              //   {
              //     type: 'placeholder',
              //     id: data.id + '_left_ph',
              //     text: 'Drag here.',
              //     top: leftPHNodePos.top,
              //     left: leftPHNodePos.left,
              //     data: {
              //       label: 'yes',
              //       type: 'connection',
              //     }
              //   },
              //   {
              //     type: 'placeholder',
              //     id: data.id + '_right_ph',
              //     text: 'Drag here.',
              //     top: righPHNodePos.top,
              //     left: righPHNodePos.left,
              //     data: {
              //       label: 'no',
              //       type: 'connection',
              //     }
              //   }
              // ]);

            }
          }
          //  else if (data.type === 'placeholder') {
          //   // connect placeholder nodes with the condition node
          //   const parentId = data.id.replace(/_left_ph$/, '').replace(/_right_ph$/, '');
          //   me.toolkit.addEdge({
          //     source: parentId,
          //     target: data.id,
          //     data: {
          //       type: 'connection',
          //       label: data.id.endsWith('_left_ph') ? 'yes' : 'no',
          //     }
          //   });

          //   me.action.placeHolderNodes++;
          // }
        },
        edgeAdded: (param: any) => {
          if (param.addedByMouse) {
            console.log('edge Added', param);
            this.updateEdge(param.edge);
          }
        }
      },
      zoomToFit: false,
      consumeRightClick: false,
      enablePanButtons: false,

    };

    this.view = {
      nodes: {
        start: {
          component: StartNodeComponent,
          parent: 'selectable'
        },
        action: {
          component: ActionNodeComponent,
          parent: 'selectable'
        },
        question: {
          component: QuestionNodeComponent,
          parent: 'selectable'
        },
        placeholder: {
          component: PlaceholderNodeComponent,
          parent: 'selectable'
        },
        selectable: {
          events: {
            tap: (params) => {
              this.toggleSelection(params.node);
            },
            dbltap: (params) => {
              this.removeNode(params.node.data);
            }
          }
        }
      },
      edges: {
        default: {
          connector: ['Flowchart', { curviness: 10 }],
          anchor: 'AutoDefault',
          overlays: [
            ['Arrow', { location: 1, width: 8, length: 8, direction: 1 }],
          ],
          endpoint: 'Blank',
          events: {
            dbltap: (param: any) => {
              this.confirmationService.confirm({
                header: 'Confirmation',
                message: 'Are you sure you want to delete this Edge?',
                key: 'callback',

                accept: () => {
                  this.removeEdge(param.edge);
                }
              });
            },
          }
        },
        connection: {
          parent: 'default',
          overlays: [
            [
              'Label', {
                label: '${label}'
              }
            ]
          ]
        }
      },
      ports: {
        start: {
          endpoint: 'Blank',
          anchor: 'Continuous',
          uniqueEndpoint: true,
          edgeType: 'default',
          maxConnections: 1
        },
        astart: {
          endpoint: 'Blank',
          anchor: 'Continuous',
          uniqueEndpoint: true,
          edgeType: 'default',
          maxConnections: 1
        },
        source: {
          endpoint: 'Blank',
          paintStyle: { fill: '#84acb3' },
          anchor: 'AutoDefault',
          maxConnections: 2,
          edgeType: 'connection'
        },
        target: {
          maxConnections: 1,
          endpoint: 'Blank',
          anchor: 'AutoDefault',
          paintStyle: { fill: '#84acb3' },
          isTarget: true
        }
      }
    };

    this.toolkitParams = {
      nodeFactory: (type: string, data: any, callback: FactoryCallback) => {
        const me = this;
        console.log('flowchart | nodeFactory | type : ', type, ' | data : ', data);

        if (!me.action) {
          me.messageService.add({ key: 'callback', severity: 'error', summary: 'Alert', detail: 'No Action Selected' });
          return;
        }

        // check for placeholder nodes is present
        // for (const node of me.toolkit.getNodes()) {
        //   if (node.data.type === 'placeholder') {
        //     //  check if the new node is dropped on the placeholder node
        //     if (data.left > node.data.left && data.top < node.data.top && Math.abs(data.left - node.data.left) < 100 && Math.abs(data.top - node.data.top) < 50) {
        //       data.left = node.data.left;
        //       data.top = node.data.top;

        //       const edges = node.getAllEdges();
        //       if (edges.length) {
        //         me.lastPlaceHolderSource = edges[0].source.id;
        //         me.lastPlaceHolderLabel = !!edges[0].data ? edges[0].data.label : null;
        //       }
        //       console.log('node removed');
        //       me.toolkit.removeNode(node);

        //       me.action.placeHolderNodes--;

        //       // make these node droppable.
        //       setTimeout(() => {
        //         me.makePlaceHolderDroppable(node.data.id);
        //       }, 100);

        //     }
        //   }
        // }

        if (type === 'action') {
          const api = ActionApiList.getApiData(data.api);
          if (!api) {
            return;
          }
          // add Node
          data.text = api.label + '(...)';
          data.id = 'api_' + me.callback.counter.api++;
          // FIXME
          data.data = { api, argument: null };
          // mark the node as dirty
          data.dirty = true;
          // add node to action.aNode
          const aNode = new ActionNode(data.id, data.text, data.data, data.dirty);
          me.action.data.aNOdes.push(aNode);
          // mark the action and callback as dirty
          me.action.dirty = true;
          me.callback.dirty = true;

          me.selectedNodeData = data;

          if (data.api === 'code') {
            this.toggleEditorDialog();
          } else {
            me.openActionForm(data);
          }

          me.addedByMouse = true;
          callback(data);

        } else if (type === 'question') {
          // add Node
          data.text = '...';
          data.id = 'condition_' + me.callback.counter.condition++;
          // mark the node dirty
          data.dirty = true;


          const condition = new ConditionNode(data.id, data.text, null, data.dirty);
          // push the condition node
          me.action.data.cNodes.push(condition);
          // mark the action and callback as dirty
          me.action.dirty = true;
          me.callback.dirty = true;

          me.selectedNodeData = data;

          me.openConditionForm(data);

          me.addedByMouse = true;
          callback(data);
        }

      },
      beforeStartConnect: (node: any, edgeType: string) => {
        return { label: '...' };
      }
    };

    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);
  }

  makePlaceHolderDroppable(nodeid: any) {    // search for Element.
    const element: any = document.querySelector('[nodeid="' + nodeid + '"]');
    if (element != null) {
      element.addEventListener('drop', (event) => {
        console.log('Dropped in Placeholder ' + nodeid + '. EventData - ', event);
        event.stopPropagation();
      }, true);

      element.addEventListener('dragover', (event) => {
        console.log('dragover in placeholder ' + nodeid + '.');
        event.preventDefault();
      }, true);
    }
  }

  getClosestNode(cdata: any): Node {
    let closestNode, minDist, offset;


    this.toolkit.getNodes().forEach((node) => {
      if (node.id !== cdata.id) {
        const pdata = node.data;
        offset = { left: pdata.left, top: pdata.top };
        offset.left += pdata.w / 2;
        offset.top += pdata.h / 2;
        const dist = Math.sqrt(
          (offset.left - cdata.left) * (offset.left - cdata.left) + (offset.top - cdata.top) * (offset.top - cdata.top)
        );
        if (!minDist || dist < minDist) {
          minDist = dist;
          closestNode = node;
        }
      }
    });

    if (closestNode) {
      // check for it's edges.
      const edges = closestNode.getAllEdges();
      if (!edges.some(edge => {
        if (edge.source.id === closestNode.data.id) {
          return true;
        }
      })) {
        return closestNode;
      }

    }
    return null;
  }

  /** This method is called when the node is selected.
   * Also, it opens the respective action or conditon forms
   */
  toggleSelection(node: Node): void {
    // to allow only single node Selection
    this.clearSelection(true);

    this.toolkit.toggleSelection(node);

    // hide previously opened dialogs
    this.showApiForm = false;
    this.showConditionForm = false;
    this.showEditorDialog = false;
    this.showCodeEditor = false;

    // set the node data
    this.selectedNodeData = node.data;
    // open forms
    if (node.data.type === 'action') {
      if (node.data.api === 'code' || node.data.data.api.api === 'code') {
        this.toggleEditorDialog();
      } else {
        this.openActionForm(node.data);
      }

    } else if (node.data.type === 'question') {
      this.openConditionForm(node.data);
    }
  }

  /** this method is used to deselect all the selected nodes.
   *  Also close all the open action and condition forms 
   * @param clear - this flag is for toolkit clearSelection
  */
  clearSelection(clear?: boolean): void {
    if (clear) {
      this.toolkit.clearSelection();
    }
    //  hide all the open forms
    this.showApiForm = false;
    this.showConditionForm = false;
  }

  /** This method is used to open condition form */
  openConditionForm(data: any): void {
    const cNode = this.getCNode(data.id);

    if (cNode) {
      this.conditionData = cNode.data;
      this.showConditionForm = true;
    }

  }

  /** This method is used to open action form */
  openActionForm(data: any): void {
    const aNode = this.getANode(data.id);

    if (aNode) {
      this.apiData = aNode.data;
      this.showApiForm = true;
    }

  }

  getANode(id: string): ActionNode {
    return this.getNode(id, 'a');
  }

  getCNode(id: string): ConditionNode {
    return this.getNode(id, 'c');
  }

  getNode(id: string, type: string): any {
    if (this.action == null) {
      return null;
    }

    const list: any[] = type === 'a' ? this.action.data.aNOdes : this.action.data.cNodes;
    let qnode = null;
    list.some((node: any) => {
      if (node.id === id) {
        qnode = node;
        return true;
      }
    });
    return qnode;
  }


  ngOnChanges() {
    if (this.callback) {
      this.toolkit.clear();
    }

    if (this.action) {
      this.toolkit.clear();
      this.toolkit.load(this.getFlowchartData());
    }

    // hide all the open forms
    this.clearSelection();

  }

  getFlowchartData(): LoadOptions {
    const fdData = {
      nodes: [],
      edges: []
    };

    //  push start state at the beginning
    fdData.nodes.push(
      {
        type: 'start',
        text: 'start',
        id: 'start',
        w: 70,
        h: 70,
        left: 355,
        top: 0
      }
    );

    this.copyJData(this.action.data.startNodeJData, fdData.nodes[fdData.nodes.length - 1]);

    // also insert previously added nodes
    // collectiong api nodes
    for (const node of this.action.data.aNOdes) {
      const args = [];
      // tslint:disable-next-line: forin
      for (const i in node.data.argument) {
        args.push(i + ':' + node.data.argument[i]);
      }

      fdData.nodes.push({
        id: node.id,
        text: node.data.api.label + '(' + args.join(', ') + ')',
        type: 'action',
        data: node.data,
        w: 180,
        h: 50
      });

      this.copyJData(node.jData, fdData.nodes[fdData.nodes.length - 1]);

    }

    // collecting condition nodes
    for (const node of this.action.data.cNodes) {
      const text = `'${node.data.lhs}' ${node.data.operator['name']} ${node.data.rhs}`;
      fdData.nodes.push({
        id: node.id,
        text,
        type: 'question',
        data: node.data,
        w: 180,
        h: 50
      });

      this.copyJData(node.jData, fdData.nodes[fdData.nodes.length - 1]);

    }

    fdData.edges = this.action.data.edges;

    return { data: fdData };
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


  ngOnInit(): void {
    this.toolkit.bind('dataUpdated', this.dataUpdateListener.bind(this));

    this.cbService.on('deleteFlowchartNode').subscribe((obj: any) => {
      this.removeNode(obj);
    });

    this.cbService.on('editFlowchartNode').subscribe((obj: any) => {
      this.editNode(obj);
    });
  }

  dataUpdateListener() {
    // TODO: update jsplumb data.
    const tempToolkitData = Object(this.toolkit.exportData());
    this.action.data.edges = tempToolkitData.edges;

    // filter placeholder edges.
    this.action.data.edges = tempToolkitData.edges.filter(edge => {
      return (!(edge.source.endsWith('_right_ph') || edge.source.endsWith('_left_ph') ||
        edge.target.endsWith('_right_ph') || edge.target.endsWith('_left_ph')));
    });

    this.updateBTInfo(tempToolkitData);

  }

  updateBTInfo(toolKitData: any) {
    // console.log("updateListner called ===>",toolKitData);
    toolKitData.nodes.forEach((node: any) => {
      if (node.type === 'start') {
        if (!this.action.data.startNodeJData) {
          this.action.data.startNodeJData = new JtkNodeParam();
        }
        return this.copyJData(node, this.action.data.startNodeJData);
      }
      if (node.type === 'action') {
        // this.callback.actions.forEach(action => {
        this.action.data.aNOdes.some(n => {
          if (node.id === n.id) {
            if (n.jData === undefined) {
              n.jData = new JtkNodeParam();
            }
            return this.copyJData(node, n.jData);
          }
        });
        return false;
        // });
      }
      if (node.type === 'question') {
        // this.callback.actions.forEach(action => {
        this.action.data.cNodes.some(nq => {
          if (node.id === nq.id) {
            if (nq.jData === undefined) {
              nq.jData = new JtkNodeParam();
            }
            return this.copyJData(node, nq.jData);
          }
        });
        // })
      }
    });


  }

  onActionSubmit(event: ActionApiData): void {
    console.log('Action Api Submitted | event - ', event);

    // set the arguments.
    let args = '';
    event.api.arguments.forEach(arg => {
      if (args !== '') {
        args += ',';
      }
      args += `${arg.name}:${event.argument[arg.name]}`;
    });

    const aNode = this.getANode(this.selectedNodeData.id);

    console.log('aNode : ', aNode);

    if (aNode) {
      aNode.data.argument = event.argument;
      aNode.text = `${event.api.api}(${args})`;
      aNode.dirty = false;

      // update node too
      this.selectedNodeData.text = `${event.api.label}(${args})`;
      this.selectedNodeData.dirty = false;

      const selectedNode = this.toolkit.getNode(this.selectedNodeData.id)

      this.toolkit.updateNode(selectedNode, this.selectedNodeData);

      // mark action and callback as dirty
      this.action.dirty = true;
      this.callback.dirty = true;

      if (event.api.id === 'gotoState') {
        this.cbService.broadcast('refreshSDEdges', event.argument['stateName']);
      }

    }

    // hide the dialog
    this.showApiForm = false;
  }

  onConditionSubmit(event: ConditionData): void {
    console.log('Action Condition Submitted | event - ', event);
    const cNode = this.getCNode(this.selectedNodeData.id);

    if (cNode) {
      cNode.data = event;
      cNode.text = `'${event.lhs}' ${event.operator['name']} ${event.rhs}`;
      cNode.dirty = false;

      this.selectedNodeData.text = cNode.text;
      this.selectedNodeData.dirty = false;

      const selectedNode = this.toolkit.getNode(this.selectedNodeData.id)
      // this.update Node
      this.toolkit.updateNode(selectedNode, this.selectedNodeData);

      this.action.dirty = false;
      this.callback.dirty = false;

      // hide the dialog
      this.showConditionForm = false;
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

        switch (data.type) {
          case 'action':
            const aIndex = this.action.data.aNOdes.findIndex((item) => item.id === data.id);
            if (aIndex > -1) {
              this.action.data.aNOdes.splice(aIndex, 1);
            }
            break;


          case 'question':

            const cIndex = this.action.data.cNodes.findIndex((item) => item.id === data.id);
            if (cIndex > -1) {
              this.action.data.cNodes.splice(cIndex, 1);
            }
            break;

          case 'placeholder':
            this.action.placeHolderNodes--;
            return;
        }

        // hide the api and condition forms if open
        this.showApiForm = false;
        this.showConditionForm = false;
      }
    });

  }

  editNode(data): void {
    switch (data.type) {
      case 'action':
        this.showApiForm = true;
        break;

      case 'question':
        this.showConditionForm = true;
        break;
    }
  }

  removeEdge(edge): void {
    this.toolkit.removeEdge(edge);
  }

  updateEdge(edge) {
    if (edge.source.getType() !== 'question') {
      return;
    }

    this.confirmationService.confirm({
      header: 'Select Edge Type',
      key: 'callback',

      accept: () => {
        // yes type edge selected
        this.toolkit.updateEdge(edge, { label: 'yes' });
      },
      reject: () => {
        // no type edge selected
        this.toolkit.updateEdge(edge, { label: 'no' });
      }


    });
  }

  saveCode() {
    console.log('code : ', this.code);
    // this.form.get('code').patchValue(this.code);
    this.selectedNodeData.data.argument = { code: this.code };

    this.onActionSubmit(this.selectedNodeData.data);

    this.showCodeEditor = false;
    this.showEditorDialog = false;
  }

  toggleEditorDialog() {
    this.showEditorDialog = true;
    this.code = this.selectedNodeData.data.argument != null ? this.selectedNodeData.data.argument.code : '';
    setTimeout(() => {
      this.showCodeEditor = true;
    });
  }

  onEditorInit(editor: monaco.editor.IEditor): void {
    // on editor load, save the editor reference
    this.editor = editor;
    this.editor.layout();
  }

  onResizeEnd() {
    this.editor.layout();
  }

}
