import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import {
  TreeResult,
  TreeRequestPayload,
  TreeNodeMenu,
  //Measure
} from './service/graph-in-tree.model';
import { GraphInTreeService } from './service/graph-in-tree.service';
import { Store } from 'src/app/core/store/store';
import {
  GraphInTreeLoadingState,
  GraphInTreeLoadedState,
  GraphInTreeLoadingErrorState,
  TreeWidgetMenuLoadingState,
  TreeWidgetMenuLoadedState,
  TreeWidgetMenuLoadingErrorState,
  ColorSearchInTreeLoadingState,
  ColorSearchInTreeLoadedState,
  ColorSearchInTreeLoadingErrorState
} from './service/graph-in-tree.state';
import { MenuItem, SelectItem, TreeNode } from 'primeng/public_api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardComponent } from '../../dashboard.component';
import { GRAPH_IN_TREE } from './service/graph-in-tree.dummy';
import { MonitorDialogComponent } from 'src/app/shared/monitor-dialog/monitor-dialog.component';
import { MenuService } from '../../menu.service';
import * as _ from 'lodash';
import { DashboardTime } from '../../service/dashboard.model';
import { SessionService } from 'src/app/core/session/session.service';
import { MetricsSettingsService } from '../../../../shared/metrics-settings/service/metrics-settings.service';
import { RelatedMetricsService } from '../../../../shared/metrics/relatedmetrics/service/relatedmetrics.service';
import { TreeOperationsService } from './service/tree-operations.service'
import { Subscription } from 'rxjs';
import { CustomMetricsService } from '../custom-metrics/service/custom-metrics.service';
import { deleteDerivedCreatedState, deleteDerivedCreatingErrorState, deleteDerivedCreatingState, viewDerivedExpCreatedState, viewDerivedExpCreatingErrorState, viewDerivedExpCreatingState } from '../custom-metrics/service/custom-metrics.state';

import { trim } from 'lodash';

@Component({
  selector: 'app-show-graph-in-tree',
  templateUrl: './show-graph-in-tree.component.html',
  styleUrls: ['./show-graph-in-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowGraphInTreeComponent implements OnInit , OnDestroy {
  @Input() dashboard: DashboardComponent;
  @ViewChild('menu1') menu1;

  // data: TreeNode[];
  selectedFile: any[];
  duration: any;
  data: TreeNodeMenu[];
  error: boolean;
  empty: boolean;
  loading: boolean;
  checked: boolean;
  treePath: MenuItem[] = [];
  items: MenuItem[];
  payloadPath: MenuItem[];
  metricOptions: MenuItem[];
  showCheck: boolean = false;
  showSearch: boolean = false;
  showButton: boolean = false;
  gdfChange : boolean = false;
  pause : boolean = true;
  level: SelectItem[];
  @Input() selectedLevel: number = 1;
  @Input() searchTextInTree: string;
  stopCounter: any;
  map:any;

  parentTreeHirerchyData: any;
  selectedData: TreeNode;
  dataExpend: TreeNodeMenu[];
  menuData: any;
  arrTreeChild = [];
  arrHirerchyNamelist = [];
  dataIdForExpend: string;
  subjectsTags = [];
  metricsubjectsTags = [];
  measureTags: any;
  isEnabledFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  isEnabledMultiSelect: boolean = false;
  MultiSelectTitle: string = 'Enable MultiSelect';
  errorData: boolean = false;
  colorArr = [];
  iconArr = [];
  countColor = 0;
  countIcon = 0;
  dataObj = {};
  iconObj = {};
  finalArr = [];
  selectedTreeNodeDataArray = [];
  clientAppID = "Default";
  searchTxt: string;
  expandLoad =false;
  expandName: string;
  parentName: string;
  treeSearchLimit : number;
  customTreeSubscription: Subscription;
  subjectFlag : boolean = false;
  expandedNodeArray= [];
  treeLoadMap = new Map();

  constructor(
    private graphInTreeService: GraphInTreeService,
    private menuService: MenuService,
    private ref: ChangeDetectorRef,
    public sessionService: SessionService,
    private metricsSettingsService: MetricsSettingsService,
    private relatedMetricsService: RelatedMetricsService,
    private treeOperations: TreeOperationsService,
    private customMetricsService : CustomMetricsService,
    private messageService: MessageService
  ) { }
  // ngOnDestroy(): void {
  //   throw new Error("Method not implemented.");
  // }
  ngOnInit(): void {
    const me = this;
     me.map =[];
     me.graphInTreeService.firstTimeFlag = true;
     me.treeLoadMap = new Map();
     me.gdfChange = false;
    const breadcrumbHome = {
      icon: 'icons8 icons8-home',
      command: me.getBreadcrumbCommand({
        hasChildren: true,
        graphID: 1,
        groupID: 2,
        groupTypeVector: false,
        lastHierarchicalComponent: false,
        matched: true,
        metricsName: null,
        nodeType: 0,
        specialNode: true,
        state: 'OPENED',
        text: 'string',
        type: 'string',
      }),
    };

    me.treePath.push(breadcrumbHome);

    const test = {
      groupID: 2,
    };
    // me.load(test);

    //me.payloadPath = [{ label: 'Stores' }, { label: 'Tiers' }];
    me.iconArr = [
      "icons8 icons8-sync-settings",
      "icons8 icons8-ssd",
      "icons8 icons8-database",
      "icons8 icons8-checkmark",
      "icons8 icons8-pulse",
      "icons8 icons8-cloud-database",
      "icons8 icons8-eye",
      "icons8 icons8-power-bi",
      "icons8 icons8-line-chart",
      "icons8 icons8-settings"
    ];

    me.level = [
      { label: 'All', value: 1 , title:'Search will apply on all nodes'},
      { label: 'Metrics Group', value: 3,title:'Search will apply on metric group only' },
      { label: 'Metrics', value: 4 , title:'Search will apply on metrics'},
      { label: 'Subject', value: 2 ,title:'Search will apply on subjects'},

    ];

    me.metricOptions = [
      { label: 'All' },
      { label: 'Metrics Group' },
      { label: 'Metrics' },
      { label: 'Subject' },
    ];

    // me.data = GRAPH_IN_TREE;

    if (me.sessionService.cacheTreeData == null) {

      me.loadTree();
      me.loadTreeColor();
    }
    else {
      me.data = me.sessionService.cacheTreeData;
      me.colorArr = me.sessionService.cacheTreeColor;
    }

    me.graphInTreeService.duration = this.getDuration();
    me.countColor = 0;
    me.countIcon = 0;
    me.loadTreeMenu();

   //me.loading = false;
  }

  closeClick() {
    const me = this;
    if(me.graphInTreeService.stopCounter)
       clearInterval(me.graphInTreeService.stopCounter);
    me.gdfChange = false;
    me.map = [];
    me.dashboard.isShow = !me.dashboard.isShow;
    me.menuService.closeSidePanel(true);
  }

  loadTree() {
    const me = this;
    const payload = {
      opType: 1,
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      duration: this.getDuration(),
      clientId: me.clientAppID,
      appId: me.clientAppID
    };
    me.graphInTreeService.loadTreeInitExpendSearch(null, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof GraphInTreeLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof GraphInTreeLoadedState) {
          me.onLoaded(state);

          if(me.subjectFlag)
            me.removeSubjectFromData(me.data);

            me.ref.detectChanges();
          return;
        }
      },
      (state: GraphInTreeLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: GraphInTreeLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.ref.detectChanges();
  }

  private onLoadingError(state: GraphInTreeLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = false;
    me.errorData = true;
    me.ref.detectChanges();
  }

  private onLoaded(state: GraphInTreeLoadedState) {
    const me = this;

    let jsondata: any = state.data;
    if (jsondata.tree && jsondata.status.code != 0 && jsondata.tree.length == 0) {
      me.loading = false;
      if(me.searchTextInTree){
        me.errorData = false;
       me.messageService.add({ severity: 'error', summary: 'Error', detail: "No Result Found On Applied Search" });
       me.graphInTreeService.firstTimeFlag = true;
       me.loadTree();
      }
      else
      me.errorData = true;
      //me.data = null;
      return;
    }
    me.data = jsondata.tree;
    me.sessionService.cacheTreeData = me.data;


    if (
      jsondata.tree &&
      jsondata.tree !== undefined &&
      jsondata.tree.length > 0
    ) {
      let payloadPath = jsondata.tree[0].name;
      me.payloadPath = [{ label: payloadPath }];
    }

    me.empty = !me.data.length;
    me.error = false;

    if(me.data.length > 0){
     me.loading = false;
    }

    me.ref.detectChanges();
  }

  treeNodeSelected(event: { originalEvent: MouseEvent; node }) {

    if (event.node.typeId == 3) {
      const me = this;
      let treeDropDataArr = me.nodeContentMenu(event);
      if (treeDropDataArr && treeDropDataArr.length > 0) {
        for (let i = 0; i < treeDropDataArr.length; i++) {
          let data = treeDropDataArr[i].subjectTags;
          if (data) {
            treeDropDataArr[i].subjectTags.reverse();
          }
        }
      }
      if(me.treeOperations.stopCounter)
      clearInterval(me.treeOperations.stopCounter);
      me.dashboard.renderDropTree(treeDropDataArr);

      // if(me.sessionService.testRun.id && me.sessionService.testRun.running){
      //   me.stopCounter = setInterval(() => {
      //     me.dashboard.renderDropTree(treeDropDataArr);
      // },5000*60);
      //  }
    }
    if (event.node.parent && event.node.typeId !== 3)
      this.loadTreeExpend(event);
    event.node.expanded = !event.node.expanded;
  }

  creatingMeasure(arrTreeChild: any[], herarchy) {
    let measure = [];
    let metricsArr = [], metricsIdArr = [];

    if (herarchy.typeId == 3) {
      let mesureObj = {};
      metricsArr.push(arrTreeChild[0]);
      metricsIdArr.push(herarchy.gdfId);

      mesureObj['metric'] = arrTreeChild[0];
      mesureObj['metricId'] = herarchy.gdfId;
      mesureObj['mg'] = arrTreeChild[1];
      mesureObj['mgId'] = herarchy.parent.gdfId; //10108;
      mesureObj['mgType'] = "NA";
      mesureObj['mgTypeId'] = -1;
      mesureObj['showTogether'] = 0;
      measure.push(mesureObj);
    }
    else if (herarchy.typeId == 5) {
      let childArr = herarchy.children;
      for (let k = 0; k < childArr.length; k++) {
        let mesureObj = {};
        mesureObj['metric'] = childArr[k].name;
        mesureObj['metricId'] = childArr[k].gdfId;
        mesureObj['mg'] = herarchy.name;
        mesureObj['mgId'] = herarchy.gdfId; //10108;
        mesureObj['mgType'] = "NA";
        mesureObj['mgTypeId'] = -1;
        mesureObj['showTogether'] = 0;
        measure.push(mesureObj);
      }

    }

    this.measureTags = measure;
    return measure;
  }

  MetricsGroupGraph(parent) {
    const me = this;
    //This is for Group
    if (parent.typeId === 5) {
      me.metricsSettingsService.setGroupId(parent.gdfId);
      if (parent.label !== undefined) {
        me.metricsSettingsService.setGroupName(parent.label);
      } else if (parent.name !== undefined) {
        me.metricsSettingsService.setGroupName(parent.name);
      }
    }
    //This is for graph
    if (parent.typeId === 3) {
      if (parent.label !== undefined) {
        me.metricsSettingsService.setGraphName(parent.label);
      } else if (parent.name !== undefined) {
        me.metricsSettingsService.setGraphName(parent.name);
      }
    }
  }

  nodeExpand(event) {

    this.expandLoad = true;
    this.gdfChange = true;
    if (event.node.parent)
    {
      this.expandName = event.node.name;
      this.parentName = event.node.parent;
      this.loadTreeExpend(event);
    }
  }

  loadTreeExpend(dataEvent) {
    const me = this;

    if(me.expandedNodeArray){
      if(me.expandedNodeArray.includes(dataEvent.node.id)){
      let expand = me.getExpanedData(me.sessionService.cacheTreeData);
      me.dataExpend = expand;

      me.ref.detectChanges();
      return;
      }
    }
    me.map.push(dataEvent);


    let tagss = [{key: "Tier", value: me.graphInTreeService.getTierName(dataEvent.node), mode: 1}]
    const payload = {
      opType: 2,
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      duration: this.getDuration(),
      clientId: me.clientAppID,
      appId: me.clientAppID,
      expandLevel: 2,
      id: dataEvent.node.id,
      subject: {tags : tagss}

    };
    me.TreeLoadcall(dataEvent, payload);

  }

  TreeLoadcall(dataEvent, payload){
    const me = this;
    me.graphInTreeService.loadTreeInitExpendSearch(dataEvent, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof GraphInTreeLoadingState) {
          me.onTreeExpendLoading(state);
          return;
        }
        if (state instanceof GraphInTreeLoadedState) {
          me.onTreeExpendLoaded(state);

          if(me.subjectFlag)
           me.removeSubjectFromData(me.dataExpend);

          me.ref.detectChanges();
          return;
        }
      },
      (state: GraphInTreeLoadingErrorState) => {
        me.onTreeExpendLoadingError(state);
      }
    );

    if(!this.expandedNodeArray.includes(dataEvent.node.id))
       this.expandedNodeArray.push(dataEvent.node.id);

    if(!me.dashboard.isShow && me.sessionService.testRun.id && me.sessionService.testRun.running && me.gdfChange){
      if (me.graphInTreeService.stopCounter)
          clearInterval(me.graphInTreeService.stopCounter);

      me.graphInTreeService.stopCounter =  setInterval(() => {
      me.handleGdfChange();               //call treeLoadCall in each and every 5 min
    }, 5000*60);


    }

  }

  private onTreeExpendLoading(state: GraphInTreeLoadingState) {
    const me = this;
    me.dataExpend = null;
    me.empty = false;
    me.error = null;
    //me.loading = true;
    me.ref.detectChanges();
  }

  private onTreeExpendLoaded(state: GraphInTreeLoadedState) {
    const me = this;
    let jsondata: any = state.data;
    me.dataExpend = jsondata.tree;
    me.empty = !me.data.length;
    me.error = false;
    me.expandLoad = false;
    me.ref.detectChanges();
  }

  private onTreeExpendLoadingError(state: GraphInTreeLoadingErrorState) {
    const me = this;
    me.dataExpend = null;
    me.empty = false;
    me.error = true;
    //me.loading = true;
    me.ref.detectChanges();
  }

  // menu for group, graph and node value level
  loadTreeMenu() {
    const me = this;
    const payload = {
      groupLevel: 0,
      graphLevel: 0
    };
    me.graphInTreeService.loadTreeMenu(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof TreeWidgetMenuLoadingState) {
          me.onLoadingMenu(state);
          return;
        }
        if (state instanceof TreeWidgetMenuLoadedState) {
          me.onLoadedMenu(state);
          return;
        }
      },
      (state: TreeWidgetMenuLoadingErrorState) => {
        me.onLoadingMenuError(state);
      }
    );
  }

  private onLoadingMenu(state: TreeWidgetMenuLoadingState) {
    const me = this;
    // me.data = null;
    me.empty = false;
    me.error = null;
    // me.loading = true;
  }

  private onLoadingMenuError(state: TreeWidgetMenuLoadingErrorState) {
    const me = this;
    // me.data = null;
    me.empty = false;
    me.error = true;
    // me.loading = true;
  }

  private onLoadedMenu(state: TreeWidgetMenuLoadedState) {
    const me = this;
    let dataArr = [];

    let jsondata: any = state.data;
    // jsondata.replace(/\n/g, '');
    let parseJson;
    try {
      parseJson = JSON.parse(jsondata);
    }
    catch{
      parseJson = jsondata;
    }
    dataArr.push(parseJson);
    me.menuData = dataArr;
    me.treeSearchLimit = me.menuData[0].treeSearchLimit;
    me.subjectFlag = me.menuData[0].showSubjects;

    me.empty = !me.menuData.length;
    me.error = false;
    // me.loading = false;
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  expandAll() {
    const me = this;
    me.data.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    const me = this;
    me.data.forEach((node) => {
      this.expandRecursive(node, false);
    });
    me.map  = [];
    if(me.graphInTreeService.stopCounter)
       clearInterval(me.graphInTreeService.stopCounter);
  }

  drill(path: TreeResult) {
    const me = this;
    if (!me.loading && path && path.hasChildren) {
      const breadcrumbItem: MenuItem = {
        label: path.text,
        command: me.getBreadcrumbCommand(path),
      };
      me.treePath.push(breadcrumbItem);
    }
  }

  private getBreadcrumbCommand(path: TreeResult): (event?: any) => void {
    const me = this;
    const i = me.treePath.length;
    return (event?: any) => {
      //me.load(path.text);
      const ii = i + 1;
      if (ii < me.treePath.length) {
        me.treePath.splice(ii, me.treePath.length);
      }
    };
  }

  searchInTree() {
    const me = this;
    me.searchTxt=trim(me.searchTextInTree);
     if (me.searchTxt !== undefined && me.searchTxt.length > 0) {
    me.loadTreeSearch(me.searchTxt, me.selectedLevel);
      }

    else {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: "Please Enter Search Input." });
    }

  }

  loadTreeSearch(searchTxt, selectedLevel) {
    const me = this;
    const searchPayload = {
      opType: 3,
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      duration: this.getDuration(),
      clientId: me.clientAppID,
      appId: me.clientAppID,
      searchPattern: searchTxt,
      searchLevel: selectedLevel,
      searchMode: 3,
      searchLimit: 2000 //this.treeSearchLimit,
    };
    me.graphInTreeService
      .loadTreeInitExpendSearch(searchTxt, searchPayload)
      .subscribe((state: Store.State) => {
        if (state instanceof GraphInTreeLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof GraphInTreeLoadedState) {

          me.onLoaded(state);
          return;
        }
        (state: GraphInTreeLoadingErrorState) => {
          me.onLoadingError(state);
        };
      });
  }

  nodeCollapse(event) {
    const me = this;
    
    for(let i = 0; i<this.map.length; i++){
      if(this.map[i].node.id == event.node.id){
        this.map.splice(i,1);
      }
    }
    me.expandedNodeArray.splice(me.expandedNodeArray.indexOf(event.node.id),me.expandedNodeArray.length);
  }

  applyOnTree() { }
  cancelOnTree() { }

  getDuration() {
    try {
      const dashboardTime: DashboardTime = this.dashboard.getTime(); // TODO: widget time instead of dashboard

      const startTime: number = _.get(
        dashboardTime,
        'time.frameStart.value',
        null
      );
      const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
      const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
      const viewBy: string = _.get(dashboardTime, 'viewBy', null);

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy,
      };


      return duration;
    } catch (error) {
      console.error(
        'Error is coming while getting the duration object ',
        error
      );
      return null;
    }
  }
  toggleFilters() {
    const me = this;
    me.isEnabledFilter = !me.isEnabledFilter;
    if (me.isEnabledFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  MultiSelect() {
    const me = this;
    me.isEnabledMultiSelect = !me.isEnabledMultiSelect;
    if (me.isEnabledMultiSelect === true) {
      me.MultiSelectTitle = 'Disable MultiSelect';
    } else {
      me.MultiSelectTitle = 'Enable MultiSelect';
    }
  }

  refreshClick() {
    const me = this;
    me.countColor = 0;
    me.countIcon = 0;
    me.errorData = false;
    me.map = [];
    me.expandedNodeArray=[];
    me.graphInTreeService.firstTimeFlag = true;
    me.treeLoadMap = new Map();
    if(me.graphInTreeService.stopCounter)
       clearInterval(me.graphInTreeService.stopCounter);
    me.loadTree();
    me.searchTextInTree = "";
    me.selectedLevel = 1;
  }

  // fetch color for Node from Server
  loadTreeColor() {
    const me = this;
    const payload = {
      groupLevel: 0,
      graphLevel: 0
    }
    me.graphInTreeService.loadTreeColor(payload).subscribe(

      (state: Store.State) => {
        if (state instanceof ColorSearchInTreeLoadingState) {
          me.onLoadingColor(state);
          return;
        }
        if (state instanceof ColorSearchInTreeLoadedState) {
          me.onLoadedColor(state);
          return;
        }
      },
      (state: ColorSearchInTreeLoadingErrorState) => {
        me.onLoadingColorError(state);
      }
    );
  }

  private onLoadingColor(state: ColorSearchInTreeLoadingState) {
    const me = this;
    me.empty = false;
    me.error = null;
    //me.loading = true;
  }

  private onLoadingColorError(state: ColorSearchInTreeLoadedState) {
    const me = this;
    me.empty = false;
    me.error = true;
    //me.loading = true;
  }

  private onLoadedColor(state: ColorSearchInTreeLoadingErrorState) {
    const me = this;
    let dataArr = [];
    let count = 0, len = 52;

    let hexColorArr = state.data.data;

    for (let i = 12; i < len; i++) {
      dataArr[count] = hexColorArr[i];
      count = count + 1;
    }
    me.colorArr = dataArr;
    me.sessionService.cacheTreeColor = me.colorArr;
    //me.graphInTreeService.cacheColorArr = me.colorArr;
    me.empty = !me.colorArr.length;
    me.error = false;
    //me.loading = false;
  }
  viewDetails(selectedFile, contextMenu) {
    if (selectedFile.length > 0) {
      contextMenu.show();
    } else {
      contextMenu.hide();
    }
  }

  calculateClasses(node) {

    if (this.colorArr.length == this.countColor) {
      this.countColor = 0;
    }

    if (this.dataObj[node.parent.name] == undefined) {
      this.dataObj[node.parent.name] = this.colorArr[this.countColor];
      this.countColor = this.countColor + 1;
    }
    let styleData = { color: this.dataObj[node.parent.name] };

    return styleData;
  }

  nodeContentMenu(event) {
    let me = this;
    this.selectedTreeNodeDataArray = [];
    if (this.selectedFile && this.selectedFile.length > 0) {

      for (let i = 0; i < this.selectedFile.length; i++) {
        let variable = this.parseDataHirerchyForRollUp(this.selectedFile[i]);
        this.selectedTreeNodeDataArray.push(variable);
      }

      this.finalArr = [];
      for (let i = 0; i < this.selectedTreeNodeDataArray.length; i++) {
        let data = this.selectedTreeNodeDataArray[i];
        let mesureTag = data.measureTag;
        let subjectTag = data.subjectTag;
        if (mesureTag.length == 0) {
          let mesure = mesureTag[0];
          let json = {};
          json['measureTags'] = mesure;
          json['subjectTags'] = subjectTag;
          this.finalArr.push(json);
        } else {
          for (let k = 0; k < mesureTag.length; k++) {
            let json = {};
            json['measureTags'] = mesureTag[k];
            json['subjectTags'] = subjectTag;
            this.finalArr.push(json);
          }
        }
      }
    }

    me.items = [];
    if (event.node.typeId == 3) {
      me.items = [...me.menuData[0].TreeMenu.GraphLevel];
      if(event.node.gdfId == 0 || event.node.gdfId >= 1000) {
        me.items.push({"label" : "Remove Metric"});
        me.items.push({"label" : "View Expression"});
      }
    }
    else if (event.node.typeId == 5) {
      me.items = me.menuData[0].TreeMenu.GroupLevel;
    }
    else if (event.node.typeId == 2) {
      me.items = me.menuData[0].TreeMenu.NodeLevel;
    }

    if (event.node.typeId !== 3 && event.node.typeId !== 5 && event.node.typeId !== 2) {
      me.menu1.hide();
    }

    if (me.items.length > 0)
      this.setActionCommandOnMenuItems(me.items);

    return this.finalArr;
  }

  commonMenuClickActionHandler(event, label, item,itemsLable) {
    const me = this;
    let dataMenuObj = {};
    if (label === "Open Related Metrics" ) {
      me.relatedMetricsService.setOpenRelatedsubjectsTags(me.finalArr);
      me.dashboard.openRelatedMetrics(me.dashboard);
    }
    else if (label === "Open/Merge/Compare Metrics" && (event.item.label === "Advance...")) {
      me.metricsSettingsService.setMetaDataInfo(me.finalArr);
      me.dashboard.openMetricsSettings(me.dashboard);
    }
    else if (label === "Open/Merge/Compare Metrics" && (item.label === "Merge" || item.label === "Open" || item.label === "Compare Members" || itemsLable === "Group Metrics") &&
      (event.item.label === "All" || event.item.label === "Zero" || event.item.label === "Non Zero")) {
      dataMenuObj['label'] = label;
      dataMenuObj['Sublabel'] = item.label;
      dataMenuObj['selectedItem'] = event.item.label;
      dataMenuObj['itemsLable']  = itemsLable;
      dataMenuObj['duration'] = me.getDuration();
      
          // identify mergeAll here
      if(item.label !== "Merge")
      me.treeOperations.openMergeMetrics(me, dataMenuObj)
   else
      {
       let mergeDataArr =[];
       
        mergeDataArr = [...this.finalArr];
       
         if( itemsLable === "Group Metrics"){

           if(event.item.label == "All")
             {
               // this case firstly needs to be handle.
               //all level will be as same and it includes all the metrics on the same widget of that particular Group.
                 
               if (mergeDataArr && mergeDataArr.length > 0) {
                 for (let i = 0; i < mergeDataArr.length; i++) {
                   let data = [...mergeDataArr[i].subjectTags];
                 
                   let c = 0;
                   for(let j = data.length -1 ; j >= 0;j--){
                     let val = data[j];
                     mergeDataArr[i].subjectTags[c] = val;
                     c = c +1;
                   }
                  }
                }
             }
       
         }
         else if(event.item.label == "All" && item.items[0].label == "Group Metrics"){
      
        
          if (mergeDataArr && mergeDataArr.length > 0) {
            for (let i = 0; i < 1; i++) {
              let datachk1 = [...mergeDataArr[i].subjectTags];
              datachk1[0].mode = 130;
              datachk1[0].value ="ALL";
              if (datachk1) {
                mergeDataArr[i].subjectTags.reverse();
               }
             }
           }
         }
       else{
         if (mergeDataArr && mergeDataArr.length > 0) {
          for (let i = 0; i < mergeDataArr.length; i++) {
            let data = mergeDataArr[i].subjectTags;
            data[0].mode = 130;
            data[0].value ="ALL";
            if (data) {
               mergeDataArr[i].subjectTags.reverse();
             }
           }
         }
       
       }
     
   me.dashboard.renderSelectedWidget(mergeDataArr, false);
      }

    }
    else if (event.item.label == 'Rollup By...') {
      let tempTreedata = [...me.finalArr];
      me.finalArr = [];
      me.dashboard.openAggregatedDerivedMetricesDialog(tempTreedata, me.dashboard);
    }
    else if(event.item.label == 'Group By...') {
      let tempTreedata = [...me.finalArr];
      me.finalArr = [];
      me.dashboard.openGroupedDerivedMetricesDialog(tempTreedata, me.dashboard);
    }else if (event.item.label == 'Advance...') {
      let tempTreedata = [...me.finalArr];
      me.finalArr = [];
      let data = []
      if(tempTreedata && tempTreedata.length > 0) {
        data.push(tempTreedata[0]);
      }
      me.dashboard.openDerivedMetricDialog(me.dashboard, data);
    }
    else if (event.item.label === "Show Description") {
      me.dashboard.openMetricDesc(me, this.getDuration(), false);
    }
    else if (label === "Open/Merge/Compare Metrics" && item.label === "Merge" && event.item.label === "With Active Widget") {
      if (me.dashboard.compareSnapShot && !me.dashboard.compareSnapShot.trendCompare) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'In case of without trend compare cannot merge graph in widget.' });
        me.ref.detectChanges();
        return;
      }
      let mergeDataArr = [...this.finalArr];
      if (mergeDataArr && mergeDataArr.length > 0) {
        for (let i = 0; i < mergeDataArr.length; i++) {
          let data = mergeDataArr[i].subjectTags;
          if (data) {
            mergeDataArr[i].subjectTags.reverse();
          }
        }
      }
      me.dashboard.renderSelectedWidget(mergeDataArr, true);

         if(me.sessionService.testRun.id && me.sessionService.testRun.running){
          if(me.treeOperations.stopCounter)
          clearInterval(me.treeOperations.stopCounter);
          me.stopCounter = setInterval(() => {
         me.dashboard.renderSelectedWidget(mergeDataArr, true);
        },5000*60);
         }
    }
    else if (label === "Parametrize") {
      let dataMenuObj = {};
      dataMenuObj['label'] = label;
      dataMenuObj['selectedItem'] = label;
      let tempTreedata = [...me.finalArr];
      let subjectArr = tempTreedata[0].subjectTags.reverse();
      me.finalArr = [];
      me.dashboard.openParam(subjectArr, dataMenuObj);
      me.messageService.add({ severity: 'success', summary: 'Success', detail: ' Parametrize applied successfully' });
    }

    else if(label === "Remove Metric") {
      let duration = this.getDuration();
      let cctx = this.sessionService.session.cctx;
      let gPayLoad = {
        opType: 21,
        cctx: cctx,
        duration: duration,
        tr: this.sessionService.session.testRun.id,
        clientId: "Default",
        appId: "Default",
        glbMgId: me.finalArr[0].measureTags.mgId,
        derivedMetricId: me.finalArr[0].measureTags.metricId,
        flag : 8,
        rollUpLevel : "",
        mgName: me.finalArr[0].measureTags.mg,
        metricName : me.finalArr[0].measureTags.metric,
        fromExistingTree: true
      }
      this.deleteDerived(gPayLoad);
    }
    else if(label === "View Expression") {
      let duration = this.getDuration();
      let cctx = this.sessionService.session.cctx;
      let gPayLoad = {
        opType: 22,
        cctx: cctx,
        duration: duration,
        tr: this.sessionService.session.testRun.id,
        clientId: "Default",
        appId: "Default",
        metricGroupId: me.finalArr[0].measureTags.mgId,
        metricId: me.finalArr[0].measureTags.metricId,
        type : 1,
        mgName: me.finalArr[0].measureTags.mg,
        metricName : me.finalArr[0].measureTags.metric,
        fromExistingTree: true
      }
      this.viewDerivedExp(gPayLoad);
    }
  }

  private onLoadingDeleteDerivedError(state: deleteDerivedCreatingErrorState) {
    const me = this;
    ;
  }

  private onLoadedDeleteDerived(state: deleteDerivedCreatedState) {
    const me = this;
    try {
      if(state['data']['status']['code'] == 200)
      this.refreshClick();
    } catch (error) {
      console.error("Exception in method onLoadedDeleteDerived " , error);
    }


  }

  private onLoadingDeleteDerived(state: deleteDerivedCreatingState) {
    const me = this;

  }

  private onLoadingViewDerivedExpError(state: deleteDerivedCreatingErrorState) {
    const me = this;
    ;
  }

  private onLoadedViewDerivedExp(state: deleteDerivedCreatedState) {
    const me = this;
    try {
      if(state['data']['status']['code'] == 200) {
        me.dashboard.openDerivedViewExpDialog(state['data']);

      }

    } catch (error) {
      console.error("Exception in method onLoadedDeleteDerived " , error);
    }


  }

  private onLoadingViewDerivedExp(state: deleteDerivedCreatingState) {
    const me = this;

  }

  deleteDerived(payload) {
    try {
      const me = this;
      this.customTreeSubscription = this.customMetricsService.deleteDerived(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof deleteDerivedCreatingState) {
            me.onLoadingDeleteDerived(state);
            return;
          }

          if (state instanceof deleteDerivedCreatedState) {
            me.onLoadedDeleteDerived(state);
            return;
          }
        },
        (state: deleteDerivedCreatingErrorState) => {
          me.onLoadingDeleteDerivedError(state);
        }
      );
    } catch (error) {
      console.error("Exception in method deleteDerived " , error);
    }
  }

  viewDerivedExp(payload) {
    try {
      const me = this;
      this.customTreeSubscription = this.customMetricsService.viewDerivedExp(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof viewDerivedExpCreatingState) {
            me.onLoadingViewDerivedExp(state);
            return;
          }

          if (state instanceof viewDerivedExpCreatedState) {
            me.onLoadedViewDerivedExp(state);
            return;
          }
        },
        (state: viewDerivedExpCreatingErrorState) => {
          me.onLoadingViewDerivedExpError(state);
        }
      );
    } catch (error) {
      console.error("Exception in method deleteDerived " , error);
    }
  }

  setActionCommandOnMenuItems(arrNavMenu) {

    for (let i = 0; i < arrNavMenu.length; i++) {
      const item = arrNavMenu[i].items;
      if (item && item.length > 0) {
        for (let j = 0; j < item.length; j++) {
          if (!item[j].items) {

            item[j]['command'] = (event) => {
              this.commonMenuClickActionHandler(event, arrNavMenu[i].label, item[j],item[j].lable);
            };
          } else if (item[j].items && item[j].items.length > 0) {
            for (let k = 0; k < item[j].items.length; k++) {
              if (!item[j].items[k].items) {
                item[j].items[k]['command'] = (event) => {
                  this.commonMenuClickActionHandler(event, arrNavMenu[i].label, item[j],item[j].items[k].label);
                };
              } else if (item[j].items[k].items && item[j].items[k].items.length > 0) {
                for (let l = 0; l < item[j].items[k].items.length; l++) {
                  if (!item[j].items[k].items[l].items) {
                    item[j].items[k].items[l]['command'] = (event) => {
                      this.commonMenuClickActionHandler(event, arrNavMenu[i].label, item[j],item[j].items[k].label);
                    };
                  }
                }
              }
            }

          }

        }

      } else if (!arrNavMenu[i].items) {
        arrNavMenu[i]['command'] = (event) => {
          this.commonMenuClickActionHandler(event, arrNavMenu[i].label, arrNavMenu[i].items,null);
        };

      }
    }
  }

  toolTipCall(node) {
    let title = "";
    if (node.parent == undefined) {
      title = "Root node";
    }
    else if (node.typeId == 4) {
      title = "Hierarchy meta data component";
    }
    else if (node.typeId == 6) {
      title = "Hierarchical meta data components comes under it";
    }
    else if (node.typeId == 7) {
      title = "All metric groups belongs to this subject";
    }
    return title;
  }

  getlistHirerchyForRollUp(parent: any, arrTreeChild: any[]) {
    const me = this;
    if (parent) {
      if (parent.label) {
        if (
          parent.typeId !== 6 &&
          parent.typeId !== 7 &&
          parent.typeId !== 8
        ) {
          arrTreeChild.push(parent.label);
          if (parent.typeId === 5 || parent.typeId === 3)
            me.MetricsGroupGraph(parent);
        }
      } else if (parent.name) {
        if (
          parent.typeId !== 6 &&
          parent.typeId !== 7 &&
          parent.typeId !== 8
        ) {
          arrTreeChild.push(parent.name);
          if (parent.typeId === 5 || parent.typeId === 3)
            me.MetricsGroupGraph(parent);
        }
      }
      me.getlistHirerchyForRollUp(parent.parent, arrTreeChild);
    }
  }

  parseDataHirerchyForRollUp(herarchy) {
    const me = this;
    let arrTreeChild = [];
    let subjectTag = [];
    me.getlistHirerchyForRollUp(herarchy, arrTreeChild);
    let measureTag = me.creatingMeasure(arrTreeChild, herarchy);
    let arrayHirerchy = arrTreeChild.length;
    let arrheader = [],
      arrValue = [];
    for (let i = 0; i < arrayHirerchy; i++) {
      if (arrayHirerchy % 2 == 0) {
        if (i % 2 == 0) {
          // node value
          arrValue.push(arrTreeChild[i]);
        }
        else // node type
          arrheader.push(arrTreeChild[i]);
      } else {
        if (i % 2 == 0) {
          // node type
          arrheader.push(arrTreeChild[i]);
        }
        else // node value
          arrValue.push(arrTreeChild[i]);
      }
    }

    let JsonArr = [];
    if (herarchy.typeId == 3) {
      arrValue.splice(0, 1);
    }
    if (herarchy.typeId == 5 || herarchy.parent.typeId == 5) {
      arrheader.splice(0, 1);
    }
    for (let j = 0; j < arrheader.length; j++) {
      JsonArr.push({ key: arrheader[j], value: arrValue[j], mode: 1 });
    }
    subjectTag = JsonArr;
    let json = {};
    json['measureTag'] = measureTag;
    json['subjectTag'] = subjectTag;

    return json;
  }

  Fill() {
    let dataObj = this.data;
    this.datefillingCheckingId(this.data);
  }

  datefillingCheckingId(childData) {
    childData.forEach((element) => {
      if (element.id === this.dataIdForExpend) {
        element.children = this.dataExpend;
      } else this.datefillingCheckingId(childData.children);
    });
  }

  changeIcons(node) {
    if (this.iconArr.length == this.countIcon) {
      this.countIcon = 0;
    }

    if (this.iconObj[node.parent.name] == undefined) {
      this.iconObj[node.parent.name] = this.iconArr[this.countIcon];
      this.countIcon = this.countIcon + 1;
    }
    let iconString = this.iconObj[node.parent.name];

    return iconString;

  }


  handleGdfChange(){
    const me = this;
    me.gdfChange = false;
    me.map.forEach(element => {
           me.getTreeLoadCallData(element);
    });
  }

  getTreeLoadCallData(element){
    const me =this;
    let tagss = [{key: "Tier", value: me.graphInTreeService.getTierName(element.node), mode: 1}];
    const payload = {
      opType: 2,
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      duration: this.getDuration(),
      clientId: me.clientAppID,
      appId: me.clientAppID,
      expandLevel: 2,
      id: element.node.id,
      subject: {tags : tagss}

    };


     me.treeUpdateOnSampleInterval(element, payload);
  }

   treeUpdateOnSampleInterval(element,payload){
     const me =this;
      me.graphInTreeService.loadTreeInitExpendSearch(element, payload).subscribe(
        (state: Store.State) => {
          if (state instanceof GraphInTreeLoadingState) {
            me.onTreeExpendUpdateCallLoading(state);
            return;
          }
          if (state instanceof GraphInTreeLoadedState) {
            me.treeLoadMap.set(payload.id,state);
            if(me.treeLoadMap.size === this.expandedNodeArray.length){
              this.expandedNodeArray.forEach(el =>{
                me.onTreeExpendUpdateCallLoaded(me.treeLoadMap.get(el), el);


            });
            }

            if(me.subjectFlag)
               me.removeSubjectFromData(me.data);

              me.ref.detectChanges();
            return;
          }
        },
        (state: GraphInTreeLoadingErrorState) => {
          me.onTreeExpendUpdateCallLoadingError(state);
        }
      );

  }


    private onTreeExpendUpdateCallLoading(state: GraphInTreeLoadingState) {
      const me = this;
      me.dataExpend = null;
      me.empty = false;
      me.error = null;
      //me.loading = true;
      me.ref.detectChanges();
    }

    private onTreeExpendUpdateCallLoaded(state: GraphInTreeLoadedState, idVal) {
      const me = this;
      let jsondata: any = state.data['tree'];
      jsondata[jsondata.length-1].expanded = true;
      me.dataExpend = [...jsondata];
      me.data = [...me.processTree(me.data)];
      me.empty = !me.data.length;
      me.error = false;
      me.expandLoad = false;
      me.ref.detectChanges();
    }

    processTree(treeNodes){
      const me = this;
      for(let treeNode of treeNodes) {
        if(me.expandedNodeArray.includes(treeNode.id)){
         treeNode.expanded = true;
         if(treeNode.children.length == 1)
         treeNode.children[0].expanded = true;
        }

        if(treeNode.children != null)
        me.processTree(treeNode.children);

      }
      return treeNodes;
    }

    private onTreeExpendUpdateCallLoadingError(state: GraphInTreeLoadingErrorState) {
      const me = this;
      me.dataExpend = null;
      me.empty = false;
      me.error = true;
      //me.loading = true;
      me.ref.detectChanges();
    }

 /**destroying a component */
 ngOnDestroy() {
  try {
    clearInterval(this.graphInTreeService.stopCounter);
    clearInterval(this.treeOperations.stopCounter);
  } catch (error) {
    console.error('error in unsubscribe', error);
  }
}

getExpanedData(treeNodes){
  const me = this;
  for(let treeNode of treeNodes) {

    me.expandedNodeArray.forEach((childNode) => {
       if(childNode.id == treeNode.id){
         me.expandLoad = false;
        return treeNode;
       }
    });

    if(treeNode.children != null)
    me.getExpanedData(treeNode.children);

  }
  return treeNodes;
}


removeSubjectFromData(treeNodes){
  const me = this;
  for(let treeNode of treeNodes) {

       if(treeNode.name == "Subjects"){
        if(treeNode.parent){
          treeNode.parent.children.pop();
             treeNode.children.forEach(element => {
               treeNode.parent.children.push(element);
             });

             if(treeNode.parent.length == 1)
             treeNode.parent[0].expanded = true;
          continue;
        }
       }

    if(treeNode.children != null)
    me.getExpanedData(treeNode.children);

    }

  }
  controlPause(){
    const me = this;
    me.pause = false;
    if (me.graphInTreeService.stopCounter)
          clearInterval(me.graphInTreeService.stopCounter);
}

  controlStart(){
    const me = this;
    me.pause = true;
    me.graphInTreeService.stopCounter =  setInterval(() => {
      me.handleGdfChange();               //call treeLoadCall in each and every 5 min
    }, 5000*60);
  }

}
   

  

