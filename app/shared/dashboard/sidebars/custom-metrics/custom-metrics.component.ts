import { getGraphPayload, graphData } from './../../../derived-metric/service/derived-metric.model';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationService, MenuItem } from 'primeng';
import { SessionService } from 'src/app/core/session/session.service';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DashboardComponent } from '../../dashboard.component';
import { MenuService } from '../../menu.service';
import { DashboardTime } from '../../service/dashboard.model';

import { CUSTOM_METRICS, GRAPH_IN_TREE, treeDropData } from './service/custom-metrics.dummy';
import { GraphDataResponse, TreeNodeMenu, TreeResult } from './service/custom-metrics.model';
import { Subscription } from 'rxjs';
import { CustomMetricsService } from './service/custom-metrics.service';
import { Store } from 'src/app/core/store/store';
//import { GroupedDerivedMetricesComponent } from '../../../grouped-derived-metrices/grouped-derived-metrices.component';
import { DerivedMetricComponent } from '../../../derived-metric/derived-metric.component';
import { deleteDerivedCreatedState, deleteDerivedCreatingErrorState, deleteDerivedCreatingState, derivedGraphCreatedState, derivedGraphCreatingErrorState, derivedGraphCreatingState, derivedGroupCreatedState, derivedGroupCreatingErrorState, derivedGroupCreatingState, derivedMenuLoadedState, derivedMenuLoadingErrorState, derivedMenuLoadingState, hierarchialDataCreatedState, hierarchialDataCreatingErrorState, hierarchialDataCreatingState, viewDerivedExpCreatedState, viewDerivedExpCreatingErrorState, viewDerivedExpCreatingState } from './service/custom-metrics.state';
import { ShowGraphInTreeComponent } from '../show-graph-in-tree/show-graph-in-tree.component';
import { RelatedMetricsService } from 'src/app/shared/metrics/relatedmetrics/service/relatedmetrics.service';
import { MetricsSettingsService } from 'src/app/shared/metrics-settings/service/metrics-settings.service';
import { TreeOperationsService } from '../show-graph-in-tree/service/tree-operations.service';


@Component({
  selector: 'app-custom-metrics',
  templateUrl: './custom-metrics.component.html',
  styleUrls: ['./custom-metrics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomMetricsComponent
  implements OnInit {
  @Input() dashboard: DashboardComponent;
  //@Input() groupedDerivedMetrics :GroupedDerivedMetricesComponent;
  @Input() derivedMetric :DerivedMetricComponent;
  @Input() showMenuItem : ShowGraphInTreeComponent;
  @ViewChild('menu1') menu1;
  classes = 'page-sidebar custom-metrics-manager';
  menuData: MenuItem[];
  metricData: TreeResult[];
  treePath: MenuItem[];
  visible: boolean;
  showSearch: boolean;
  data: TreeNodeMenu[];
  items: MenuItem[];
  customTreeSubscription: Subscription;
  selectedFile: any[];
  hierarchyFromGroup: string = '';
  totalHierarchy: string = '';
  subjectTagFromGraphClick:any=[];
  hierarchyData = [];

  graphsResponse: GraphDataResponse = {};
  error: boolean;
  empty: boolean;
  colorArr = [];
  iconArr = [];
  countColor = 0;
  countIcon = 0;
  iconObj = {};
  dataObj = {};
  finalArr = [];
  treeSearchLimit: number;
  menuDataArr: any[];
  dialogVisible: boolean = false;
  selectedTreeNodeDataArray: any[];
  constructor(private menuService: MenuService, public sessionService: SessionService, private customMetricsService: CustomMetricsService, private ref: ChangeDetectorRef, private metricsSettingsService: MetricsSettingsService,
    private relatedMetricsService: RelatedMetricsService,private treeOperations: TreeOperationsService, public confirmation :ConfirmationService) {
  }

  treeNodeSelected(event: { originalEvent: MouseEvent; node }) {
    try {
      this.totalHierarchy = '';
      this.subjectTagFromGraphClick = [];
      //this.nodeContentMenu(event);
      if (this.selectedFile['leaf'] == true || this.selectedFile['leaf'] == 'true') {
        if (this.selectedFile['parent']) {
          //this.totalHierarchy = this.selectedFile['parent']['data']
          let tempdata = this.selectedFile['parent']
          if (tempdata.parent)
          this.recursiveHierarchies(this.selectedFile['parent']);

        }

        if (this.totalHierarchy && this.totalHierarchy.length > 0) {
          let totalSubjects: any = this.totalHierarchy.split('<>');
          let bb = totalSubjects;
          let json: any = [];
          let i = bb.length - 3;
          while (i >= 0) {
            let key = bb[i];
            let value = bb[i - 1];
            let cons = { 'key': key, 'value': value, "mode": 1 };
            json.push(cons);
            i = i - 2;
          }
          this.subjectTagFromGraphClick = json;
        }

        let tempData = [
          {
            'measureTags': {
              "metric": this.selectedFile['data'],
              "metricId": this.selectedFile['metricId'],
              "mg": this.selectedFile['groupName'],
              "mgId": this.selectedFile['mgId'],
              "mgType": this.selectedFile['metricTypeName'],
              "mgTypeId": this.selectedFile['typeId'],
              "showTogether": 0
            },
            'subjectTags' : this.subjectTagFromGraphClick
          }
        ]
        this.dashboard.renderDropTree(tempData);
      }
      else {
        if(event.node.expanded == false) {
          event.node.expanded = true;
          this.loadCustomTreeExpandCall(event.node.level, event.node)
        }else {
          event.node.expanded = false;
        }
      }

      this.ref.detectChanges();
    } catch (error) {

    }
  }

  recursiveHierarchies(pdata) {
    if (this.totalHierarchy != '')
      this.totalHierarchy = this.totalHierarchy + '<>' + pdata.data;
    else
      this.totalHierarchy = pdata.data;

    if (pdata.parent)
      this.recursiveHierarchies(pdata.parent);

  }


  nodeExpand(event) {
    this.loadCustomTreeExpandCall(event.node.level, event.node)
  }

  loadCustomTreeExpandCall(level, parent) {
    try {

      let gPayload = {};
      let duration = this.getDuration();
      let cctx = this.sessionService.session.cctx;
      if (level == 0) {

        gPayload = {
          "opType": "16",
          "cctx": cctx,
          "duration": duration,
          "tr": this.sessionService.testRun.id,
          "clientId": "Default",
          "appId": "Default",
          "selVector": null
        }
        this.getExpandTreeCallResForGroup(gPayload, parent);

      } else if (level == 1) {
        let graphPayload: getGraphPayload = {
          "opType": "17",
          "cctx": cctx,
          "duration": duration,
          "tr": this.sessionService.session.testRun.id,
          "clientId": "Default",
          "appId": "Default",
          "mgId": parent.mgId,
          "glbMgId": parent.glbMgId,
          "grpName": parent.groupName
        }
        this.getExpandTreeCallResForGraph(graphPayload, parent);
      }


    } catch (error) {

    }
  }

  getExpandTreeCallResForChild(payload, parent) {
    try {
      const me = this;
      this.customTreeSubscription = this.customMetricsService.loadHierarcialData(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof hierarchialDataCreatingState) {
            me.onLoadingChild(state);
            return;
          }

          if (state instanceof hierarchialDataCreatedState) {
            me.onLoadedChild(state, parent);
            return;
          }
        },
        (state: hierarchialDataCreatingErrorState) => {
          me.onLoadingEroorForChild(state);
        }
      );
    } catch (error) {

    }
  }

  onLoadingEroorForChild(state: hierarchialDataCreatingErrorState) {

  }

  onLoadedChild(state: hierarchialDataCreatedState, parent) {
    try {
      let hierarchy = state.data['hierarchy'];

      if (hierarchy && hierarchy.length > 0) {
        this.loadHierchyData(state.data, parent);
      }else{
        this.hierarchyData = hierarchy;
      }
    } catch (error) {

    }
  }
  onLoadingChild(state: hierarchialDataCreatingState) {

  }

  loadHierarchyRecursion(sub, parent) {
    let subLabel: TreeNodeMenu = {};
    try {
      subLabel = {
        tree: null,
        children: [],
        parent: parent,
        typeId: -1,
        name: "",
        gdfId: -1,
        id: "",
        matched: false,
        label: sub[0]['metadata'],
        data: sub[0]['metadata'],
        icon: "icons8 icons8-folder",
        expandedIcon: null,
        collapsedIcon: null,
        leaf: false,
        expanded: false,
        type: "",
        partialSelected: false,
        styleClass: null,
        draggable: false,
        droppable: false,
        selectable: true,
        key: "",
        showMenu: false,
        showSecondLevelMenu: false,
        level: -1,
        mgId: -1,
        glbMgId: "",
        metricTypeName: "",
        vectorType: false,
        hierarchicalComponent: "",
        description: "",
        metricId: -1,
        groupName: "",
        groupDesc: "",
      }
      let subChilder = [];

      for (var k = 0; k < sub.length; k++) {
        var subRec = sub[k].subjects;
        let recVal: TreeNodeMenu = {};
        recVal = {
          tree: null,
          children: [],
          parent: parent,
          typeId: -1,
          name: "",
          gdfId: -1,
          id: "",
          matched: false,
          label: sub[k].vector,
          data: sub[k].vector,
          icon: "icons8 icons8-folder",
          expandedIcon: null,
          collapsedIcon: null,
          leaf: false,
          expanded: false,
          type: "",
          partialSelected: false,
          styleClass: null,
          draggable: false,
          droppable: false,
          selectable: true,
          key: "",
          showMenu: false,
          showSecondLevelMenu: false,
          level: 2,
          mgId: -1,
          glbMgId: "",
          metricTypeName: "",
          vectorType: false,
          hierarchicalComponent: "",
          description: "",
          metricId: -1,
          groupName: "",
          groupDesc: "",

        }
        let recValChil = [];
        if (subRec.length > 0) {
          let k = this.loadHierarchyRecursion(subRec, parent);
          if (k) {
            recValChil.push(k);
          }
        } else {
          recValChil = this.addGraphMetcName();
        }
        recVal["children"] = recValChil;
        subChilder.push(recVal);
      }
      subLabel["children"] = subChilder;
      return subLabel;
    }
    catch (e) {
      console.error("Exception in recursive function = ", e);
      return null;
    }
  }

  loadHierchyData(res, parent) {

    try {
      let tierLabel: TreeNodeMenu = {};
      let tierChilder = [];
      tierLabel = {
        tree: null,
        children: [],
        parent: parent,
        typeId: -1,
        name: "",
        gdfId: -1,
        id: "",
        matched: false,
        label: res.hierarchy[0]['metadata'],
        data: res.hierarchy[0]['metadata'],
        icon: "icons8 icons8-folder",
        expandedIcon: null,
        collapsedIcon: null,
        leaf: false,
        expanded: false,
        type: "",
        partialSelected: false,
        styleClass: null,
        draggable: false,
        droppable: false,
        selectable: true,
        key: "",
        showMenu: false,
        showSecondLevelMenu: false,
        level: -1,
        mgId: -1,
        glbMgId: "",
        metricTypeName: "",
        vectorType: false,
        hierarchicalComponent: "",
        description: "",
        metricId: -1,
        groupName: "",
        groupDesc: "",
      }


      for (var i = 0; i < res.hierarchy.length; i++) {
        let sub = res.hierarchy[i].subjects;
        let tierValChil = [];

        if (sub.length > 0) {
          let tierVal: TreeNodeMenu = {};
          tierVal = {
            tree: null,
            children: [],
            parent: parent,
            typeId: -1,
            name: "",
            gdfId: -1,
            id: "",
            matched: false,
            label: res.hierarchy[i].vector,
            data: res.hierarchy[i].vector,
            icon: "icons8 icons8-folder",
            expandedIcon: null,
            collapsedIcon: null,
            leaf: false,
            expanded: false,
            type: "",
            partialSelected: false,
            styleClass: null,
            draggable: false,
            droppable: false,
            selectable: true,
            key: "",
            showMenu: false,
            showSecondLevelMenu: false,
            level: 2,
            mgId: -1,
            glbMgId: "",
            metricTypeName: "",
            vectorType: false,
            hierarchicalComponent: "",
            description: "",
            metricId: -1,
            groupName: "",
            groupDesc: "",
          }
          let k = this.loadHierarchyRecursion(sub, parent);
          if (k) {
            tierValChil.push(k);
          }

          tierVal["children"] = tierValChil;
          tierChilder.push(tierVal);
        } else {
          if (res.hierarchy[i].vectorList && res.hierarchy[i].vectorList.length > 0) {
            tierChilder = this.getVectorListArr(res.hierarchy[i].vectorList, parent);

          }
        }

      }
      tierLabel["children"] = [...tierChilder];
      parent.children = [];
      parent.children.push(tierLabel);
      this.sessionService.cacheCustomTreeData = [...this.data];
      this.ref.detectChanges();
    }
    catch (e) {
      console.error("Exception in loadHierchyData Method", e);
    }
  }

  getVectorListArr(verctorList, parent) {
    try {

      let finalArr = [];
      for (let i = 0; i < verctorList.length; i++) {
        let tierLabel: TreeNodeMenu = {};
        let subJectList = this.addGraphMetcName();

        tierLabel = {
          tree: null,
          children: subJectList,
          parent: parent,
          typeId: -1,
          name: "",
          gdfId: -1,
          id: "",
          matched: false,
          label: verctorList[i],
          data: verctorList[i],
          icon: "icons8 icons8-folder",
          expandedIcon: null,
          collapsedIcon: null,
          leaf: false,
          expanded: false,
          type: "",
          partialSelected: false,
          styleClass: null,
          draggable: false,
          droppable: false,
          selectable: true,
          key: "",
          showMenu: false,
          showSecondLevelMenu: false,
          level: 2,
          mgId: -1,
          glbMgId: "",
          metricTypeName: "",
          vectorType: false,
          hierarchicalComponent: "",
          description: "",
          metricId: -1,
          groupName: "",
          groupDesc: "",
        }

        finalArr.push(tierLabel);
      }

      return finalArr;

    } catch (error) {
      return [];
    }
  }




  getExpandTreeCallResForGraph(graphPayload, parent) {
    try {
      this.customTreeSubscription = this.customMetricsService.loadGraphData(graphPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof derivedGraphCreatingState) {
            this.onLoadingGraph(state);
            return;
          }

          if (state instanceof derivedGraphCreatedState) {
            this.onLoadedGraph(state, parent);
            return;
          }
        },
        (state: derivedGraphCreatingErrorState) => {
          this.onLoadingGraphError(state);
        }
      );
    } catch (error) {

    }
  }


  private onLoadingGraph(state: derivedGraphCreatingState) {
    const me = this;
  }

  private onLoadingGraphError(state: derivedGraphCreatingErrorState) {
    const me = this;

  }

  private onLoadedGraph(state: derivedGraphCreatedState, parent) {
    const me = this;
    me.getSubjectMeasureList(state.data, parent);
  }

  getSubjectMeasureList(dataToPopulate, parent) {
    try {
      this.graphsResponse = dataToPopulate;
      if(parent.hierarchicalComponent !== "") {
        if (this.graphsResponse.graph && this.graphsResponse.graph.length > 0) {

          let firstGraphObj = this.graphsResponse.graph[0];

          let duration = this.getDuration();
          let cctx = this.sessionService.session.cctx;
          let gPayLoad = {
            "opType": 18,
            "cctx": cctx,
            "duration": duration,
            "tr": this.sessionService.session.testRun.id,
            "clientId": "Default",
            "appId": "Default",
            "glbMgId": parent.glbMgId,
            "derivedMetricId": firstGraphObj.metricId
          }

          this.getExpandTreeCallResForChild(gPayLoad, parent);
          if(this.hierarchyData.length == 0){
            this.fillGraphInTree(parent);
          }
        }
      }else {
        this.fillGraphInTree(parent);
      }



    } catch (error) {

    }
  }

  populateGraphData(dataToPopulate, parent) {
    try {
      let children = [];
      if (dataToPopulate.graph && dataToPopulate.graph.length > 0) {
        for (let i = 0; i < dataToPopulate.graph.length; i++) {

          let child: TreeNodeMenu = {};
          child = {
            tree: null,
            children: [{}],
            parent: parent,
            typeId: -1,
            name: "",
            gdfId: -1,
            id: "",
            matched: false,
            label: dataToPopulate.graph[i].name,
            data: dataToPopulate.graph[i].name,
            icon: "icons8 icons8-folder",
            expandedIcon: null,
            collapsedIcon: null,
            leaf: false,
            expanded: false,
            type: "",
            partialSelected: false,
            styleClass: null,
            draggable: false,
            droppable: false,
            selectable: true,
            key: "",
            showMenu: false,
            showSecondLevelMenu: false,
            level: 2,
            mgId: dataToPopulate.mgId,
            glbMgId: dataToPopulate.glbMgId,
            metricTypeName: "NA",
            vectorType: false,
            hierarchicalComponent: "NA",
            description: dataToPopulate.graph[i].description,
            metricId: dataToPopulate.graph[i].metricId,
            groupName: dataToPopulate.groupName,
            groupDesc: dataToPopulate.groupDesc
          }

          children.push(child);

        }
        parent.children = children;

        this.ref.detectChanges();
      }
    } catch (error) {

    }
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

  getExpandTreeCallResForGroup(gPayload, parent) {
    try {
      const me = this;

      me.customTreeSubscription = me.customMetricsService.load(gPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof derivedGroupCreatingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof derivedGroupCreatedState) {
            me.onLoaded(state, parent);
            return;
          }
        },
        (state: derivedGroupCreatingErrorState) => {
          me.onLoadingError(state);
        }
      );
    } catch (error) {

    }
  }


  /** Append the Graph Metric Name  */

  addGraphMetcName() {

    let arrGraphData = this.graphsResponse.graph;

    let finalArr = [];
    for (let i = 0; i < arrGraphData.length; i++) {
      let tierLabel: TreeNodeMenu = {};
      tierLabel = {
        tree: null,
        children: [],
        parent: parent,
        typeId: -1,
        name: "",
        gdfId: -1,
        id: "",
        matched: false,
        label: arrGraphData[i].name,
        data: arrGraphData[i].name,
        icon: null,
        expandedIcon: null,
        collapsedIcon: null,
        leaf: true,
        expanded: false,
        type: "",
        partialSelected: false,
        styleClass: null,
        draggable: false,
        droppable: false,
        selectable: true,
        key: "",
        showMenu: false,
        showSecondLevelMenu: false,
        level: 3,
        mgId: this.graphsResponse.mgId,
        glbMgId: this.graphsResponse.glbMgId,
        metricTypeName: "",
        vectorType: false,
        hierarchicalComponent: "",
        description: "",
        metricId: arrGraphData[i].metricId,
        groupName: this.graphsResponse.groupName,
        groupDesc: this.graphsResponse.groupDesc
      }

      finalArr.push(tierLabel);
    }

    return finalArr;
  }
  private onLoading(state: derivedGroupCreatingState) {
    const me = this;

  }

  private onLoadingError(state: derivedGroupCreatingErrorState) {
    const me = this;
    ;
  }

  private onLoaded(state: derivedGroupCreatedState, parent) {
    const me = this;
    me.populateGroupData(state.data, parent);
  }

  private onLoadingDeleteDerived(state: deleteDerivedCreatingState) {
    const me = this;

  }

  private onLoadingDeleteDerivedError(state: deleteDerivedCreatingErrorState) {
    const me = this;
    ;
  }

  private onLoadedDeleteDerived(state: deleteDerivedCreatedState) {
    const me = this;
    try {
      if(state['data']['status']['code'] == 200) {
        this.refreshTree();
        this.dialogVisible = true;
        this.confirmation.confirm({
        key: 'customMetrics',
        message: "Derived node has been removed successfully.",
        header: "Success",
        accept: () => { this.dialogVisible = false;


        },
        reject: () => { this.dialogVisible = false;
          },
        rejectVisible:false
      });
      }
    } catch (error) {
      console.error("Exception in method onLoadedDeleteDerived " , error);
    }


  }

  private onLoadingViewDerivedExp(state: deleteDerivedCreatingState) {
    const me = this;

  }

  private onLoadingViewDerivedExpError(state: deleteDerivedCreatingErrorState) {
    const me = this;
  }

  private onLoadedViewDerivedExp(state: deleteDerivedCreatedState) {
    const me = this;
    try {
       if(state['data']['metricExpression'] && state['data']['metricExpression'].length > 0)
       {
         me.dashboard.openDerivedViewExpDialog(state['data']);
       }


    } catch (error) {
      console.error("Exception in method onLoadedDeleteDerived " , error);
    }


  }

  fillGraphInTree(parent) {
    if(this.graphsResponse) {
      let metricList = this.addGraphMetcName();
      parent.children = metricList;
      this.data = [...this.data];
      this.sessionService.cacheCustomTreeData = [...this.data];
      this.ref.detectChanges();
    }
  }

  populateGroupData(dataToPopulate, parent) {
    const me = this;
    let children = [];
    if (dataToPopulate.group && dataToPopulate.group.length > 0) {
      for (let i = 0; i < dataToPopulate.group.length; i++) {

        let child: TreeNodeMenu = {};
        child = {
          tree: null,
          children: [{}],
          parent: parent,
          typeId: -1,
          name: dataToPopulate.group[i].groupName,
          gdfId: -1,
          id: "",
          matched: false,
          label: dataToPopulate.group[i].groupName,
          data: dataToPopulate.group[i].groupName,
          icon: "icons8 icons8-folder",
          expandedIcon: null,
          collapsedIcon: null,
          leaf: false,
          expanded: false,
          type: "",
          partialSelected: false,
          styleClass: null,
          draggable: false,
          droppable: false,
          selectable: true,
          key: "",
          showMenu: false,
          showSecondLevelMenu: false,
          level: 1,
          mgId: dataToPopulate.group[i].mgId,
          glbMgId: dataToPopulate.group[i].glbMgId,
          metricTypeName: dataToPopulate.group[i].metricTypeName,
          vectorType: dataToPopulate.group[i].vectorType,
          hierarchicalComponent: dataToPopulate.group[i].hierarchicalComponent,
          description: "",
          metricId: -1,
          groupName: "",
          groupDesc: "",
        }

        children.push(child);

      }
      parent.children = children;
      this.data = [...this.data];
      this.sessionService.cacheCustomTreeData = [...this.data];
      this.ref.detectChanges();
    }
  }

  getDuration() {
    try {

      if(!this.dashboard)
        {
          return null;
        }

      const dashboardTime: DashboardTime = this.dashboard.getTime(); // TODO: widget time instead of dashboard

      const startTime: number = _.get(
        dashboardTime,
        'time.frameStart.value',
        null
      );
      const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
      const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
      const viewBy: number = _.get(dashboardTime, 'viewBy', null);

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy,
      }

      return duration;

    } catch (error) {
      console.error("Error is coming while getting the duration object ", error);
      return null;
    }
  }


  nodeContentMenu(event) {

    const me = this;
    me.menuData = [];
    this.selectedTreeNodeDataArray = [];
    if (event.node.level== 3) {
      me.menuData = me.menuDataArr[0].TreeMenu.GraphLevel;
    }
    else if (event.node.level== 1) {
      me.menuData = me.menuDataArr[0].TreeMenu.GroupLevel;
    }
    else if (event.node.level == 2) {
      me.menuData = me.menuDataArr[0].TreeMenu.NodeLevel;
    }
     else if (event.node.level == 0) {
       me.menuData = me.menuDataArr[0].TreeMenu.RootLevel;
     }
    if (event.node.level !== 1 && event.node.level !== 3 && event.node.level !== 2 &&event.node.level !== 0) {
      me.menu1.hide();
    }
    this.totalHierarchy = '';
    this.subjectTagFromGraphClick = [];
    //if (this.selectedFile['leaf'] == true || this.selectedFile['leaf'] == 'true') {
      if (this.selectedFile['parent']) {
        this.totalHierarchy = this.selectedFile['data']
        let tempdata = this.selectedFile['parent']
        if (tempdata.parent)
        this.recursiveHierarchies(this.selectedFile['parent']);
      }
    if (this.selectedFile || this.selectedFile['leaf'] == 'true') {
      if (this.totalHierarchy && this.totalHierarchy.length > 0) {
        let totalSubjects: any = this.totalHierarchy.split('<>');
        let bb = totalSubjects;
        let json: any = [];
        let i = bb.length - 3;
        while (i > 0) {
          let key = bb[i];
          let value = bb[i - 1];
          let cons = { 'key': key, 'value': value, "mode": 1 };
          json.push(cons);
          i = i - 2;
        }
        this.subjectTagFromGraphClick = json.reverse();
      }

      let tempData = [
        {
          'measureTags': {
            "glbMgId": this.selectedFile['glbMgId'],
            "metric": this.selectedFile['data'],
            "metricId": this.selectedFile['metricId'],
            "mg": this.selectedFile['groupName'],
            "mgId": this.selectedFile['mgId'],
            "mgType": this.selectedFile['metricTypeName'],
            "mgTypeId": this.selectedFile['typeId'],
            "showTogether": 0
          },
          'subjectTags' : this.subjectTagFromGraphClick
        }
      ]
      if (me.menuData.length > 0)
      me.setActionCommandOnMenuItems(me.menuData,tempData);
    }
  //}

  }

  setActionCommandOnMenuItems(arrNavMenu,tempData) {
    for (let i = 0; i < arrNavMenu.length; i++) {
      const item = arrNavMenu[i].items;
      if (item && item.length > 0) {
        for (let j = 0; j < item.length; j++) {
          if (!item[j].items) {
            item[j]['command'] = (event) => {
              this.commonMenuClickActionHandler(event, arrNavMenu[i].label, item[j],item[j].lable,tempData);
            };
          } else if (item[j].items && item[j].items.length > 0) {
            for (let k = 0; k < item[j].items.length; k++) {
              if (!item[j].items[k].items) {
                item[j].items[k]['command'] = (event) => {
                  this.commonMenuClickActionHandler(event, arrNavMenu[i].label, item[j],item[j].items[k].label,tempData);
                };
              } else if (item[j].items[k].items && item[j].items[k].items.length > 0) {
                for (let l = 0; l < item[j].items[k].items.length; l++) {
                  if (!item[j].items[k].items[l].items) {
                    item[j].items[k].items[l]['command'] = (event) => {
                      this.commonMenuClickActionHandler(event, arrNavMenu[i].label, item[j],item[j].items[k].label,tempData);
                    };
                  }
                }
              }
            }
          }
        }
      } else if (!arrNavMenu[i].items) {
        arrNavMenu[i]['command'] = (event) => {
          this.commonMenuClickActionHandler(event, arrNavMenu[i].label, arrNavMenu[i].items,null,tempData);
        };
      }
    }
  }
  commonMenuClickActionHandler(event, label, item,itemsLable,tempData) {
    const me = this;
    let dataMenuObj = {};
    if (label === "Open Related Metrics" ) {
      me.relatedMetricsService.setOpenRelatedsubjectsTags(tempData);
      me.dashboard.openRelatedMetrics(me.dashboard);
    }
    else if (label === "Open/Merge/Compare Metrics" && (event.item.label === "Advance...")) {
      me.metricsSettingsService.setMetaDataInfo(tempData);
      me.dashboard.openMetricsSettings(me.dashboard);
    }
    else if (label === "Open/Merge/Compare Metrics" && (item.label === "Merge" || item.label === "Open" || item.label === "Compare Members" || itemsLable === "Group Metrics") &&
      (event.item.label === "All" || event.item.label === "Zero" || event.item.label === "Non Zero")) {
      dataMenuObj['label'] = label;
      dataMenuObj['Sublabel'] = item.label;
      dataMenuObj['selectedItem'] = event.item.label;
      dataMenuObj['itemsLable']  = itemsLable;
      dataMenuObj['duration'] = me.getDuration();
      me.treeOperations.openMergeMetrics(tempData, dataMenuObj)
    }
    else if (event.item.label == 'Rollup By...') {
      let tempTreedata = tempData;
      // me.finalArr = [];
      me.dashboard.openAggregatedDerivedMetricesDialog(tempTreedata, me.dashboard);
    }
    else if(event.item.label == 'Group By...') {
      let tempTreedata = tempData;
      // me.finalArr = [];
      me.dashboard.openGroupedDerivedMetricesDialog(tempTreedata, me.dashboard);
    }else if (event.item.label == 'Advance...') {
      let tempTreedata = tempData;
      // me.finalArr = [];
      let data = []
      if(tempTreedata && tempTreedata.length > 0) {
        data.push(tempTreedata[0]);
      }
      me.dashboard.openDerivedMetricDialog(me.dashboard, []);
    }
    else if (event.item.label === "Show Description") {
      let customTreeData = tempData[0].measureTags;
      me.dashboard.openMetricDesc(customTreeData, this.getDuration(), true);
    }
    else if (label === "Open/Merge/Compare Metrics" && item.label === "Merge" && event.item.label === "With Active Widget") {
      let mergeDataArr = tempData;
      if (mergeDataArr && mergeDataArr.length > 0) {
        for (let i = 0; i < mergeDataArr.length; i++) {
          let data = mergeDataArr[i].subjectTags;
          if (data) {
            mergeDataArr[i].subjectTags.reverse();
          }
        }
      }
      me.dashboard.renderSelectedWidget(mergeDataArr,true);
    }
    else if (label === "Parametrize") {
      let dataMenuObj = {};
      dataMenuObj['label'] = label;
      dataMenuObj['selectedItem'] = label;
      let tempTreedata =tempData;
      let subjectArr = tempTreedata[1].subjectTags.reverse();
      // me.finalArr = [];
      me.dashboard.openParam(subjectArr, dataMenuObj);
    //   me.messageService.add({ severity: 'success', summary: 'Success', detail: ' Parametrize applied successfully' });
    }else if(label === "Remove Node") {
      let duration = this.getDuration();
      let cctx = this.sessionService.session.cctx;
      let gPayLoad = {
        opType: "21",
        cctx: cctx,
        duration: duration,
        tr: this.sessionService.session.testRun.id,
        clientId: "Default",
        appId: "Default",
        glbMgId: tempData[0].measureTags.glbMgId,
        derivedMetricId: -1,
        flag : 2,
        rollUpLevel : "",
        mgName: tempData[0].measureTags.metric,
        fromExistingTree: false
      }

      this.deleteDerived(gPayLoad);

    }else if(label === "Remove Metric") {
      let duration = this.getDuration();
      let cctx = this.sessionService.session.cctx;
      let gPayLoad = {
        opType: 21,
        cctx: cctx,
        duration: duration,
        tr: this.sessionService.session.testRun.id,
        clientId: "Default",
        appId: "Default",
        glbMgId: tempData[0].measureTags.glbMgId,
        derivedMetricId: tempData[0].measureTags.metricId,
        flag : 4,
        rollUpLevel : "",
        mgName: tempData[0].measureTags.mg,
        metricName : tempData[0].measureTags.metric,
        fromExistingTree: false
      }

      this.deleteDerived(gPayLoad);
    }else if(label === "View Expression") {
      let duration = this.getDuration();
      let cctx = this.sessionService.session.cctx;
      let gPayLoad = {
        opType: 22,
        cctx: cctx,
        duration: duration,
        tr: this.sessionService.session.testRun.id,
        clientId: "Default",
        appId: "Default",
        metricGroupId: tempData[0].measureTags.mgId,
        metricId: tempData[0].measureTags.metricId,
        type : 4,
        mgName: tempData[0].measureTags.mg,
        metricName : tempData[0].measureTags.metric,
      }

      this.viewDerivedExp(gPayLoad);

    }
  }

  refreshTree() {
    let defaultCustomTreeData = [
      {
        "label": "Derived Metrics",
        "data": "Derived Metrics 1",
        "icon": "icons8 icons8-folder",
        "expanded": false,
        "selectable": true,
        "level": 0,
        "expandedIcon" : "icons8 icons8-folder",
        "collapsedIcon": "icons8 icons8-folder",
        "children": [
          {}
        ]
      }
    ];

    this.data = [];
    this.data = [...defaultCustomTreeData];
    this.sessionService.cacheCustomTreeData = [...this.data];
    this.loadCustomTreeExpandCall(0,this.data[0]);
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    const me = this;
    me.loadDeriveMenu();
    let defaultCustomTreeData = [
      {
        "label": "Derived Metrics",
        "data": "Derived Metrics 1",
        "icon": "icons8 icons8-folder",
        "expanded": false,
        "selectable": true,
        "level": 0,
        "expandedIcon" : "icons8 icons8-folder",
        "collapsedIcon": "icons8 icons8-folder",
        "children": [
          {}
        ]
      }
    ];

    if(!this.sessionService.cacheCustomTreeData) {
      me.data = [...defaultCustomTreeData];
      this.sessionService.cacheCustomTreeData = [...me.data];
      this.loadCustomTreeExpandCall(0,me.data[0]);
    }else {
      me.data = [...this.sessionService.cacheCustomTreeData];
    }



    me.metricData = CUSTOM_METRICS;
    this.ref.detectChanges();
    me.treePath = [
      {
        label: 'Custom',
      },
    ];
    // me.menuData = [
    //   { label: 'Open With Selected Widget' },
    //   {
    //     label: 'Show Description',
    //     // command: () => {
    //     //   me.dashboard.openMetricDesc();
    //     // }
    //   },
    //   {
    //     label: 'Add Derived Metrics',
    //     items: [
    //       {
    //         label: 'Advance...',
    //         command: () => {
    //           me.dashboard.openDerivedMetricDialog(me.dashboard,[]);
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Open Metrics',
    //     items: [
    //       {
    //         label: 'All Zero',
    //         items: [
    //           { label: 'All Tirers' },
    //           { label: 'All Server of Same Tire (cavisson)' },
    //           {
    //             label: 'Same Server (NDApplication)',
    //             items: [
    //               {
    //                 label: 'All Tier',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         label: 'Non Zero',
    //         items: [
    //           { label: 'All Tirers' },
    //           { label: 'All Server of Same Tire (cavisson)' },
    //           {
    //             label: 'Same Server (NDApplication)',
    //             items: [
    //               {
    //                 label: 'All Tier',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         label: 'Zero',
    //         items: [
    //           { label: 'All Tirers' },
    //           { label: 'All Server of Same Tire (cavisson)' },
    //           {
    //             label: 'Same Server (NDApplication)',
    //             items: [
    //               {
    //                 label: 'All Tier',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Metrics Settings',
    //     command: () => {
    //       me.dashboard.openMetricsSettings(me.dashboard)
    //     },
    //   },
    //   {
    //     label: 'Parameterize',
    //   },
    // ];

    me.hierarchyData = [];
  }

  toggleSearch() {
    const me = this;
    me.showSearch = !me.showSearch;
  }

  refreshTreefromDerived(dashboardComponent){
    this.dashboard = dashboardComponent;
    this.sessionService.cacheCustomTreeData = [];
    this.refreshTree();
    this.ref.detectChanges();

  }
  closePanel() {
    const me = this;
    me.data = [];
    me.menuService.closeSidePanel(true);
  }

  loadDeriveMenu() {
    const me =this;
    const payload = {
      groupLevel: 0,
      graphLevel: 0
    };
    me.customMetricsService.loadDeriveMenu(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof derivedMenuLoadingState) {
          me.onLoadingMenu(state);
          return;
        }
        if (state instanceof derivedMenuLoadedState) {
          me.onLoadedMenu(state);
          return;
        }
      },
      (state: derivedMenuLoadingErrorState) => {
        me.onLoadingMenuError(state);
      }
    );
  }
  private onLoadingMenu(state: derivedMenuLoadingState) {
    const me = this;
    // me.data = null;
    me.empty = false;
    me.error = null;
    // me.loading = true;
  }
  private onLoadingMenuError(state: derivedMenuLoadingErrorState) {
    const me = this;
    // me.data = null;
    me.empty = false;
    me.error = true;
    // me.loading = true;
  }
  private onLoadedMenu(state: derivedMenuLoadedState) {
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
    me.menuDataArr = dataArr;
    me.treeSearchLimit = me.menuDataArr[0].treeSearchLimit;
    me.empty = !me.menuDataArr.length;
    me.error = false;
    // me.loading = false;
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


}
