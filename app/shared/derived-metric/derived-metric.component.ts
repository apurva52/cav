import { DialogsService } from './../dialogs/dialogs.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { ChartConfig } from '../chart/service/chart.model';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { getGraphPayload, getGroupListPayload, graphData, groupData, DerivedRequestPayLoad, DerivedCtx, MetricExpression, DataCtx, Aggregation, Details, GCtx, Variable, Subject, Tags, Measure, DashboardWidgetLoadRes, METRIC_CHARTS, COLOR_ARR, DerivedMetricData, TEST_BUTTON, SAVE_BUTTON, ADD_UPDATE_BUTTON } from './service/derived-metric.model';
import { derivedIndicesService } from './derived-metric-indices/service/metric-indices.service';
import { DerivedMetricService } from './service/derived-metric.service';
import { derivedGraphCreatedState, derivedGraphCreatingErrorState, derivedGraphCreatingState, derivedGroupCreatedState, derivedGroupCreatingErrorState, derivedGroupCreatingState, derivedResCreatedState, derivedResCreatingErrorState, derivedResCreatingState } from './service/derived-metric.state';
import {CustomMetricsComponent} from '../dashboard/sidebars/custom-metrics/custom-metrics.component';

import {
  CONTENT,
  DERIVED_METRIC_DATA

} from './service/derived-metric.dummy';

import { DashboardFavCTX, DashboardTime } from '../dashboard/service/dashboard.model';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as _ from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';
import { DerivedMetricIndicesComponent } from './derived-metric-indices/derived-metric-indices.component';
import { InfoData } from '../dialogs/informative-dialog/service/info.model';
import { ConfirmationService } from 'primeng/api';
import { PatternMatchingService } from '../pattern-matching/service/pattern-matching.service';


@Component({
  selector: 'app-derived-metric',
  templateUrl: './derived-metric.component.html',
  styleUrls: ['./derived-metric.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DerivedMetricComponent
  extends PageDialogComponent
  implements OnInit {
  @Input() dashboardComponent: DashboardComponent;
  data: DerivedMetricData;
  addedGraph = [];
  selectedOperators: any[] = [];
  groupName: any;
  graphName: any;
  function: any;
  indices: string = "All";
  groupList = [];
  graphList = [];
  rollUpList = [];
  byList = [];
  onList = [];
  selected: boolean = false;
  showFormula: boolean = false;
  dataGroup: groupData;
  dataDerivedRes: DashboardWidgetLoadRes;
  dataGraph: graphData;
  error: AppError;
  visible: boolean;
  loading: boolean;
  isBlockUI: boolean = false;
  enableSelect = false;
  displayExpression: boolean = false;
  derivedExpressionValue: string = '';
  generatedChart: ChartConfig;
  derivedFormula: string = '';
  tooltipZIndex = 100000
  graphOperationExpression: any;
  fromIndicesWindow: boolean = false;
  dataFromSpecifed: string = "";
  specifiedWindowData : any = null;
  updateGraph: boolean = false;
  updateGraphMode: boolean;
  indexOfGraphSelected: number;
  graphDataSelected: any;
  expressionAllSpecfied: any;
  private derivedSubscription: Subscription;
  rollup;
  by;
  on;
  disableRollUp = true;
  disableBy = true;
  disableOn = true;
  derivedName = "";
  derivedGroupName = "";
  description = "";
  derivedReqPayload: DerivedRequestPayLoad;
  derivedFlag: number = 1;
  tagListFromIndices: any = [];
  buttonValue: number = 0;
  disabledGroupName: boolean = false;
  content: InfoData;
  dialogVisible: boolean = false;
  treeData = [];
  customTree:CustomMetricsComponent;

  constructor(private derivedService: derivedIndicesService, private derivedMetricService: DerivedMetricService, public sessionService: SessionService, private ref: ChangeDetectorRef, public confirmation :ConfirmationService,private patternMatchingService: PatternMatchingService) {
    super();
    this.dialogVisible = false;

  }

  /**
   *
   * @param dashboardCom
   * This is used for upen the advanced derived window
   */
  openDerivedWindow(data) {
    this.treeData = [];
    this.treeData = [...data];
    this.show();
  }

  /**
   * This method is used for get the duration object from the dashboard component
   */
  getDuration() {
    try {

      const dashboardTime: DashboardTime = this.dashboardComponent.getTime(); // TODO: widget time instead of dashboard

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

  /**
   * This method is used for open the derived Indices window
   * @param dmIndices
   */
  openDerivedIndecesWindow(dmIndices: DerivedMetricIndicesComponent) {
    let tempForIndicesWindow = 'ALL';
    let isSpecified = false;
    if (!this.groupName && !this.updateGraphMode) {
      this.alertMsg("Please Select the group name", "Error");
      return;
    }

    if (!this.graphName && !this.updateGraphMode) {
      this.alertMsg("Please Select the graph name", "Error");
      return;
    }

    /* Checking the update mode */
    if (this.updateGraphMode) {
      if (this.graphDataSelected.expression.includes("PATTERN#")) {
        isSpecified = false;
        tempForIndicesWindow = 'val1'

      }
      else {
        isSpecified = true
        tempForIndicesWindow = 'val2'
      }
    }

    /* Checking the update mode */
    if (this.updateGraphMode) {

      if(this.graphDataSelected.groupName !== this.groupName || this.graphDataSelected.indices == "All") {
        dmIndices.openDerivedIndecesWindow(this.dashboardComponent, this.groupName, this.groupList , null , false);
      }else {
        dmIndices.openDerivedIndecesWindow(this.dashboardComponent, this.groupName, this.groupList , this.graphDataSelected.specifiedWindowData , isSpecified);
      }

    }
    else {
      dmIndices.openDerivedIndecesWindow(this.dashboardComponent, this.groupName, this.groupList , null , false);
    }
  }

  show() {

    const me = this;
    this.dialogVisible = false;
    me.graphOperationExpression = "";
    me.disabledGroupName = false;
    me.addedGraph = [];
    me.graphName = undefined;
    me.function = "AVG";
    me.buttonValue = 0;
    me.derivedName = "";
    me.derivedGroupName = "";
    me.description = "";
    me.rollup = undefined;
    me.disableRollUp = true;
    me.by = undefined;
    me.disableBy = true;
    me.on = undefined;
    me.disableOn = true;
    this.generatedChart = null;
    this.generatedChart = METRIC_CHARTS;
    this.generatedChart.highchart.series = [];
    this.generatedChart = { ...this.generatedChart };
    me.isBlockUI = false;
    super.show();
    let duration =null;

    if(this.patternMatchingService && this.patternMatchingService.flagPattern){
      duration =this.patternMatchingService.duration;
    }
    else{
     duration = this.getDuration();
    }
    const cctx = this.sessionService.session.cctx;
    const gPayload = {
      "opType": "4",
      "cctx": cctx,
      "duration": duration,
      "tr": this.sessionService.testRun.id,
      "clientId": "Default",
      "appId": "Default",
      "selVector": null
    }
    me.getGroupListOnComponentLoad(gPayload);

  }

  applyTest() {

    if (!this.derivedName || this.derivedName.trim() == "") {
      this.alertMsg("Please add derived metric name", "Error");
      this.derivedName = "";
      return;
    }

    if(this.derivedName.trim().length > 256) {
      this.alertMsg("Derived metric name accept maximum 256 character" , "Error");
      return;
    }

    if (!this.derivedGroupName || this.derivedGroupName.trim() == "") {
      this.alertMsg("Please add derived Group name", "Error");
      this.derivedGroupName = "";
      return;
    }

    if(this.derivedGroupName.trim().length > 256) {
      this.alertMsg("Derived group name accept maximum 256 character" , "Error");
      return;
    }

    if (!this.description || this.description.trim() == "") {
      this.alertMsg("Please add description", "Error");
      return;
    }

    if(this.description.trim().length > 128) {
      this.alertMsg("Description accept maximum 128 character" , "Error");
      return;
    }

    if (this.addedGraph.length == 0) {
      this.alertMsg("Please add the derived component", "Error");
      return;
    }

    if (!this.graphOperationExpression || this.graphOperationExpression.trim() == "") {
      this.alertMsg("Please add the Derived formula", "Error");
      return;
    }

    if ((!this.on || this.on.length == 0) && (this.rollup == "Rollup By" || this.rollup == "Group By")) {
      this.alertMsg("Please select atleast one level", "Error");
      return;
    }

    this.graphOperationExpression = this.graphOperationExpression.toLocaleUpperCase();

    let error = this.checkValidationOfFormula();

    if (error && error.flag == false) {
      this.alertMsg(error.errorMsg, "Error");
      return;
    }

    let args = this.getArgs();
    let isValid = this.isValidFn(this.graphOperationExpression, args);
    if(!isValid) {
      this.alertMsg("Derived Formula is not valid", "Error");
      return;
    }

    this.derivedFlag = 6;
    this.buttonValue = TEST_BUTTON;
    this.derivedReqPayload = this.getDerivedRequestPayload(this.buttonValue);
    this.generateDerivedResponse(this.derivedReqPayload);
    this.ref.detectChanges();
  }

  getArgs() {
    let arr = [];
    try {
      if (this.addedGraph && this.addedGraph.length > 0) {
        for (let i = 0; i < this.addedGraph.length; i++) {
          let rowData = this.addedGraph[i];
          if (rowData) {
            arr.push(rowData.index.toLocaleUpperCase());
          }
        }
      }

    } catch (error) {

    }

    return arr;
  }

  isValidFn(fn, args) {
    var argList = args.join(', ');
    var dummyArgs = Array(args.length).fill(1);
    try {

      var f = new Function(argList, 'return ' + fn + ';');
      f.apply(this, dummyArgs);
    } catch(e) {
      //console.log();
      return false;
    }
    return true;
  }

  checkValidationOfFormula() {
    try {
      let err = { 'flag': true, 'errorMsg': "" };
      if (this.addedGraph && this.addedGraph.length > 0) {
        for (let i = 0; i < this.addedGraph.length; i++) {
          let rowData = this.addedGraph[i];
          if (rowData) {
            if (this.graphOperationExpression.indexOf(rowData.index) == -1) {
              err.flag = false;
              err.errorMsg = "Component " + rowData.index + " is not present in the formula";
              return err;
            }
          }
        }


        let formula = this.graphOperationExpression;
        if (formula && formula.length > 0) {
          let arr = [];
          for (let i = 0; i < formula.length; i++) {
            let ch = formula[i];
            let index = ch.charCodeAt(0);
            if (index >= 65 && index <= 90) {
              arr.push(ch);
            }
          }

          if (arr.length > 0) {
            for (let j = 0; j < arr.length; j++) {
              let isPresent = this.checkAvailable(this.addedGraph, arr[j]);
              if (isPresent == false) {
                err.flag = false;
                err.errorMsg = "Component " + arr[j] + " is not present into the derived component list";
                return err;
              }
            }
          }
        }

      }

      return err;

    } catch (error) {

    }
  }


  checkAvailable(addedGraph, value) {
    let available = false;
    try {
      for (let i = 0; i < addedGraph.length; i++) {
        if (value === addedGraph[i].index) {
          available = true;
          break;
        }
      }
    } catch (error) {
      return false;
    }

    return available;
  }
  getSeriesData(data) {
    let series = [];

    try {

      if (data && data.grpData && data.grpData.mFrequency && data.grpData.mFrequency.length > 0) {
        for (let i = 0; i < data.grpData.mFrequency.length; i++) {
          let mFrequency = data.grpData.mFrequency[i];
          let tsDetail = mFrequency.tsDetail;
          if (mFrequency.data && mFrequency.data.length > 0) {
            for (let j = 0; j < mFrequency.data.length; j++) {
              let seriesData = mFrequency.data[j];
              if (seriesData && seriesData.avg && seriesData.avg.length > 0) {
                let arrData = [];
                for (let k = 0; k < seriesData.avg.length; k++) {
                  let data = seriesData.avg[k];
                  if (data === -123456789) {
                    arrData.push(0.0);
                  } else {
                    arrData.push(data);
                  }
                }


                let name = this.getSeriesName(seriesData);
                let color = this.getComponentColor(seriesData.componentName);
                let seriesObj = {};
                seriesObj['name'] = name,
                  seriesObj['color'] = color,
                  seriesObj['data'] = arrData,
                  seriesObj['pointStart'] = this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(tsDetail.st),
                  seriesObj['pointInterval'] = tsDetail.frequency * 1000
                series.push(seriesObj);
              }


            }
          }
        }
      }
    } catch (error) {
      console.error("Exception in getSeriesData method...", error);
    }

    return series;
  }

  getComponentColor(componentName) {
    let color = "#10AEF2";
    if (componentName == "NA") {
      return color;
    } else {
      for (let i = 0; i < COLOR_ARR.length; i++) {
        let colorObj = COLOR_ARR[i];
        if (componentName == COLOR_ARR[i].name) {
          color = COLOR_ARR[i].color;
        }
      }
    }

    return color;


  }
  getSeriesName(seriesData) {
    let name = "";

    try {
      if (seriesData && seriesData.measure) {
       name = seriesData.componentName;

        if (name == "NA") {
          name = this.graphOperationExpression;
        }

        name = "<b>" + name + ": " + "</b>";
        name = name + seriesData.measure.metric;
        if (seriesData.subject && seriesData.subject.tags && seriesData.subject.tags.length > 0) {
          if(seriesData.subject.tags[0].sName && seriesData.subject.tags[0].sName != "NA") {
            name = name + " - " + seriesData.subject.tags[0].sName;
          }
        }

      }
    } catch (error) {
        console.error("Exception in getSeriesName method = " , error);
    }
    return name;
  }
  ngOnInit(): void {
    const me = this;
    me.data = DERIVED_METRIC_DATA;
    me.rollUpList = me.data.rollup;
    me.byList = me.data.by;
    me.onList = me.data.on;
    me.content = CONTENT;
    this.dialogVisible = false;

  }



  /**
   * This is used when user click on the row of derived componet table
   */
  selectGraph(index, graphData) {
    try {
      const me = this;
      me.indexOfGraphSelected = index;
      me.addedGraph[index].updateGraph = !me.addedGraph[index].updateGraph;
      me.updateGraphMode = me.addedGraph[index].updateGraph;
      if (me.updateGraphMode) {
        me.graphDataSelected = graphData;
        me.graphList = graphData.graphList;
        me.groupName = graphData.groupName;
        me.graphName = graphData.graphName;
        me.indices = graphData.indices;
        me.function = graphData.function;
        me.selectedOperators = graphData.operator;
      }
      else {
        me.resetMetricExpValues();
      }

      let i = 0;
      while (i < me.addedGraph.length) {
        if (me.addedGraph[i].updateGraph && i != index) {
          me.addedGraph[i].updateGraph = false;
        }
        i++;
      }
    } catch (error) {
      console.error("Exception in selectGraph method = ", error);
    }

  }


  generateDerivedResponse(payload: DerivedRequestPayLoad) {
    try {
      const me = this;

      me.derivedSubscription = me.derivedMetricService.loadDerivedRes(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof derivedResCreatingState) {
            me.onLoadingDerivedRes(state);
            return;
          }

          if (state instanceof derivedResCreatedState) {
            me.onLoadedDerivedRes(state);
            return;
          }
        },
        (state: derivedResCreatingErrorState) => {
          me.onLoadingErrorDerivedRes(state);
        }
      );

    } catch (error) {

    }
  }
  /**
   * This is used for get the group name list from rest services.
   */
  getGroupListOnComponentLoad(gPayload) {
    const me = this;

    me.derivedSubscription = me.derivedMetricService.load(gPayload).subscribe(
      (state: Store.State) => {
        if (state instanceof derivedGroupCreatingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof derivedGroupCreatedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: derivedGroupCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }
  private onLoading(state: derivedGroupCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: derivedGroupCreatingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoadedDerivedRes(state: derivedResCreatedState) {
    const me = this;
    me.dataDerivedRes = state.data;
    me.error = null;
    me.loading = false;
    me.isBlockUI = false;
    me.populateDerivedResData(me.dataDerivedRes);
  }

  private onLoadingDerivedRes(state: derivedResCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.isBlockUI = false;

  }

  private onLoadingErrorDerivedRes(state: derivedResCreatingErrorState) {
    const me = this;
    me.dataDerivedRes = null;
    me.error = state.error;
    me.loading = false;
    me.isBlockUI = false;
  }


  private onLoaded(state: derivedGroupCreatedState) {
    const me = this;
    me.dataGroup = state.data;
    me.error = null;
    me.loading = false;
    me.populateGroupData(me.dataGroup);
  }

  /**
   * This is used for fill the group name list
   */
  populateGroupData(dataToPopulate) {
    const me = this;
    me.groupList = [];
    let i = 0;
    let len = dataToPopulate.group.length;
    //me.groupList.unshift({ label: 'Select Group', value: null });
    if(len > 0) {
      dataToPopulate.group = this.sessionService.sort_by_key(dataToPopulate.group, "groupName");
    }

    while (i < len) {
      let json = dataToPopulate.group[i];
      json['label'] = dataToPopulate.group[i].groupName;
      json['value'] = dataToPopulate.group[i].groupName;
      me.groupList.push(json);
      i++;
    }

    if( me.groupList.length > 0 && me.treeData.length > 0) {
        me.groupName = me.treeData[0].measureTags.mg;
        this.changedGroupName();
    }
    this.ref.detectChanges();
  }

  populateDerivedResData(dataToPopulate) {
    try {

      if(this.buttonValue === SAVE_BUTTON) {
        let msg = "";
      if(dataToPopulate && dataToPopulate.grpData && dataToPopulate.grpData.derivedResCtx) {
        if(dataToPopulate.grpData.derivedResCtx.type == 1) {
          msg = "Virtual metric " +  "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricName + "</span>" + " is successfully added in group " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricGName + "</span>" + " at " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.derivedMtricPath + "</span>" + " hierarchy."
        }else {
          msg = "Derived metric " + "<span class='text-highlight'>" +dataToPopulate.grpData.derivedResCtx.metricName + "</span>"+  " is successfully added in group " + "<span class='text-highlight'>" + dataToPopulate.grpData.derivedResCtx.metricGName + "</span>" + " at " +  "<span class='text-highlight'>" +dataToPopulate.grpData.derivedResCtx.derivedMtricPath + "</span>"+" hierarchy."

        }

        this.dialogVisible = true;
        this.confirmation.confirm({
        key: 'derivedMetrics',
        message: msg,
        header: "Success",
        accept: () => { this.dialogVisible = false; this.closeDerivedWindow(); this.customTree.refreshTreefromDerived(this.dashboardComponent);


        },
        reject: () => { this.dialogVisible = false; this.closeDerivedWindow(); this.customTree.refreshTreefromDerived(this.dashboardComponent);
          },
        rejectVisible:false
      });

      }else  {
        this.alertMsg(dataToPopulate.status.msg, "Error");
      }

      }else {
        let ChartData = dataToPopulate;
        let seriesData = this.getSeriesData(ChartData);
        this.generatedChart.highchart.series = [...seriesData];
        this.generatedChart = { ...this.generatedChart };
      }
      this.ref.detectChanges();


    } catch (error) {
      console.error("Exception in method populateDerivedResData")
    }
  }

  /**
   * This is used for find the group name object from the group name list.
   */
  getGroupNameObject(groupName) {
    try {

      if (this.groupList && this.groupList.length > 1) {
        for (let i = 0; i < this.groupList.length; i++) {
          if (groupName === this.groupList[i].value) {
            return this.groupList[i];

          }
        }
      }

    } catch (error) {

    }
  }

  /**
   * This method is call when user changed the group name.
   */
  changedGroupName() {
    const me = this;
    this.graphList = [];
    me.graphName = undefined;
    const groupNameObject = this.getGroupNameObject(this.groupName);
    const cctx = this.sessionService.session.cctx;
    let duration =null
    if(this.patternMatchingService.flagPattern){
      duration =this.patternMatchingService.duration;
    }
    else{
     duration = this.getDuration();
    }
    const graphPayload: getGraphPayload = {
      "opType": "5",
      "cctx": cctx,
      "duration": duration,
      "tr": this.sessionService.session.testRun.id,
      "clientId": "Default",
      "appId": "Default",
      "mgId": groupNameObject.mgId,
      "glbMgId": groupNameObject.glbMgId,
      "grpName": this.groupName
    }
    if (me.groupName != undefined && me.groupName != 'undefined') {
      me.derivedSubscription = me.derivedMetricService.loadGraphData(graphPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof derivedGraphCreatingState) {
            me.onLoadingGraph(state);
            return;
          }

          if (state instanceof derivedGraphCreatedState) {
            me.onLoadedGraph(state);
            return;
          }
        },
        (state: derivedGraphCreatingErrorState) => {
          me.onLoadingGraphError(state);
        }
      );

    }

  }

  private onLoadingGraph(state: derivedGraphCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingGraphError(state: derivedGraphCreatingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoadedGraph(state: derivedGraphCreatedState) {
    const me = this;
    me.dataGraph = state.data;
    me.error = null;
    me.loading = false;
    me.populateGraphData(me.dataGraph);
  }

  /**
   * This method is used for fill the graph name list
   */
  populateGraphData(dataToPopulate) {
    const me = this;
    if(dataToPopulate && dataToPopulate.graph && dataToPopulate.graph.length > 0) {
      dataToPopulate.graph = this.sessionService.sort_by_key(dataToPopulate.graph, "name");
    }
    for(let i = 0 ; i < dataToPopulate.graph.length ; i++) {
      let json = dataToPopulate.graph[i];
      if(json.metricId >= 1000) {
        continue;
      }
      json['label'] = dataToPopulate.graph[i].name;
      json['value'] = dataToPopulate.graph[i].name;
      me.graphList.push(json);
    }

    if(me.graphList.length > 0 && me.treeData.length > 0) {
      me.graphName = undefined;
      me.graphName = me.treeData[0].measureTags.metric;
    }
    this.ref.detectChanges();
  }

  getGraphNameObject(graphName: String, graphList) {
    try {

      if (graphList && graphList.length > 0) {
        for (let i = 0; i < graphList.length; i++) {
          if (graphName === graphList[i].value) {
            return graphList[i];

          }
        }
      }

    } catch (error) {

    }
  }


  public open() {
    const me = this;
    me.visible = true;
  }

  /**
   * This method is used for close the derived window
   */
  public closeDerivedWindow() {
    const me = this;
    me.groupName = null;
    me.graphList = null;
    me.addedGraph = []
    me.function = "AVG"
    me.selectedOperators = null
    me.indices = 'All'
    me.visible = false;
    me.isBlockUI = false;
    this.ref.detectChanges();

  }

  /**
   * This is used for add or update the derived component.
   */
  addUpdateGraph(event) {
    const me = this;
    me.derivedFormula = '';

    if (me.indices == "Specified" && (!me.fromIndicesWindow || me.dataFromSpecifed == "")) {
      this.alertMsg("Please select graphs from the specified window", "Error");
      return;
    }

    if (me.updateGraphMode) {
      me.updateGraphData(me.indexOfGraphSelected, me.graphDataSelected)
    }
    else {

      if (!me.groupName) {
        this.alertMsg("Please Select the group name", "Error");
        return;
      }
      if (!me.graphName) {
        this.alertMsg("Please Select the graph name", "Error");
        return;
      }

      const groupNameObject = this.getGroupNameObject(me.groupName);
      const graphObject = this.getGraphNameObject(me.graphName, me.graphList);
      let newOperator = "";
      if (me.selectedOperators && me.selectedOperators.length > 0) {
        for (let i = 0; i < me.selectedOperators.length; i++) {
          if (newOperator == "") {
            newOperator = me.selectedOperators[i];
          } else {
            newOperator = newOperator + ", " + me.selectedOperators[i];
          }
        }
      }

      me.derivedFormula = me.getDerivedExpression(null);
      const graphCalculation = {
        index: COLOR_ARR[me.addedGraph.length].name,
        groupName: me.groupName,
        graphName: me.graphName,
        indices: me.indices,
        function: me.function,
        operator: me.selectedOperators,
        newOperator: newOperator,
        expression: me.derivedFormula,
        hierarchy: groupNameObject.hierarchicalComponent,
        updateGraph: false,
        graphList: me.graphList,
        graphInfo: graphObject.description,
        groupInfo: groupNameObject.metricTypeName,
        expressionAllSpecfied: me.expressionAllSpecfied,
        tagListFromIndices: me.tagListFromIndices,
        colorForGraph: COLOR_ARR[me.addedGraph.length].color,
        specifiedAdvExpValue: this.getExp(me.expressionAllSpecfied),
        specifiedWindowData: this.specifiedWindowData
      }

      const derivedConstant = this.checkDerivedConstant(graphCalculation);
      graphCalculation['isConstant'] = derivedConstant;

      let nonConstantRow = this.getNonConstantRow(me.addedGraph);


      if (nonConstantRow) {
        let isValid = this.checkValiDation(nonConstantRow, graphCalculation);
        if (isValid.valid == false) {
          this.alertMsg(isValid.errorMsg, "Error");
          me.fromIndicesWindow = false;
          me.dataFromSpecifed = "";
          return;
        }
      }

      if(this.sessionService.preSession.multiDc && graphCalculation['indices'] == "All" && graphCalculation['function'] !== "None" ) {
        this.alertMsg("Applying a function on the subjects residing on two or more cluster nodes is not supported in a multi-node cluster environment.Please either choose subjects from a single cluster node using specified option instead of using “All” option or use function as “None”. " , "Error");
        return;
      }

      if (me.addedGraph.length <= 26) {
        me.addedGraph.push(graphCalculation);
        // me.fromIndicesWindow = false;
        // me.dataFromSpecifed = "";
        this.disableOn = true;
        this.disableBy = true;
        this.on = undefined;
        this.by = undefined;
        this.rollup = "No Aggregation";
        let nonConstRow = this.getNonConstantRow(me.addedGraph);
        if (nonConstRow) {
          this.disableRollUp = false;
          this.disableBy = true;
          this.disableOn = true;
        } else {
          this.disableRollUp = true;
          this.disableBy = true;
          this.disableOn = true;
        }

        let firstConstantRow = this.getFirstConstantRow(me.addedGraph);
        let differentHeirchy = false;
        differentHeirchy = this.checkDifferentHeirchy();
        let constant = false ;
        if(firstConstantRow) {
          constant = true;
        }
        /*--------------------------For group Name ------------------------------- */
        this.calculationOnGroupName(nonConstRow, constant, differentHeirchy);
        /*--------------------------For Derived Metric Name ------------------------*/
        this.calculationOnMetricName(nonConstRow);
        me.createDerivedGraphFormula();
        this.buttonValue = ADD_UPDATE_BUTTON;
        this.derivedFlag = 4;
        this.derivedReqPayload = this.getDerivedRequestPayload(this.buttonValue);
        this.generateDerivedResponse(this.derivedReqPayload);
        //me.resetMetricExpValues();
        this.ref.detectChanges();

      } else  {
        this.alertMsg('maximum 26 Graph can be added', "Error");
      }

      // me.fromIndicesWindow = false;
      // me.dataFromSpecifed = "";

    }

  }

  getFirstConstantRow(addedGraph) {
    let constantRow = null;
    try {
      if(addedGraph && addedGraph.length > 0) {
        for(let i = 0 ; i < addedGraph.length ; i++) {
          if(addedGraph[i].isConstant) {
            constantRow = addedGraph[i];
            break;
          }
        }
      }
    } catch (error) {

    }
    return constantRow;
  }

  calculationOnMetricName(nonConstantRow) {
    try {
      if (nonConstantRow) {
        let isAll = this.checkAllForDerivedMetricName(nonConstantRow);
        if (isAll && (!this.rollup || this.rollup == "No Aggregation")) {
          if (this.derivedName != "" ) {
            this.derivedName = "";
          }
        } else {
          this.derivedName = nonConstantRow.graphName;
        }
      } else {
        if (this.function == "None") {
          this.derivedName = this.addedGraph[0].graphName;
        } else {
          this.derivedName = this.function + " of " + this.addedGraph[0].graphName;
        }
      }
    } catch (error) {

    }
  }

  checkAllForDerivedMetricName(nonConstsntRow) {
    let isAll = false;
    try {
      if (nonConstsntRow.indices == "All") {
        isAll = true;
      } else if (nonConstsntRow.indices == "Specified" && nonConstsntRow.expression.indexOf("PATTERN") !== -1) {
        let matchedPattern = true;
        let firstBracet = nonConstsntRow.expression.indexOf("[");
        let lastBracket = nonConstsntRow.expression.indexOf("]");

        if (firstBracet >= 0 && lastBracket >= 0) {
          let value = nonConstsntRow.expression.substring(firstBracet + 1, lastBracket);
          let pattern = value.split("PATTERN#")[1];
          if (pattern) {
            let arrPattern = pattern.split(">");
            if (arrPattern && arrPattern.length > 0) {
              for (let i = 0; i < arrPattern.length; i++) {
                if (arrPattern[i] !== "*") {
                  matchedPattern = false;
                  break;
                }
              }
            }
          }

        }

        if (matchedPattern) {
          isAll = true;
        }
      }
    } catch (error) {
      return false;
    }

    return isAll;
  }
  /**
 *
 * @param {Component} c1
 * @param {Component} c2
 * @returns - It will return
 *   0 - If both components match
 *  -1 - If hierarchy not matched.
 *  -2 - If subject not matched.
 */
compareComponent(c1, c2) {
  // first compare hierarcy.
  let match = c1.hierarchy.split('>').length > c2.hierarchy.split('>').length ? (c1.hierarchy.indexOf(c2.hierarchy) == 0): (c2.hierarchy.indexOf(c1.hierarchy) == 0);

  if (!match) return -1;

  // if constant then don't match.
  if (c1.isConstant || c2.isConstant) return 0;

  // If only one is all then mismatch.
  if ((c1.indices == "All" && !(c2.indices == "All")) || (!(c1.indices == "All") && c2.indices == "All")) return -2;

  // now compare both subject list.
  if (!this.compareSubjectList(c1, c2)) return -2;

  return 0;
}

/**
 *
 * @param { Component } c1
 * @param { Component } c2
 * @returns {boolean} It returns true if matched and false if not matched.
 */
compareSubjectList(c1, c2) {

  c1.expressionArray = c1.expressionAllSpecfied.split(',').map(e => e.trim());
  c2.expressionArray = c2.expressionAllSpecfied.split(',').map(e => e.trim());

  // sort both the array.
  c1.expressionArray.sort();
  c2.expressionArray.sort();

  let sarr1, sarr2;
  if (c1.hierarchy.split('>').length > c2.hierarchy.split('>').length) {
    sarr1 = c1.expressionArray;
    sarr2 = c2.expressionArray;
  } else {
    sarr1 = c2.expressionArray;
    sarr2 = c1.expressionArray;
  }


  // now compare one by one.
  let i = 0, j = 0;
  while (i < sarr1.length && j < sarr2.length) {
    if (sarr1[i].indexOf(sarr2[j]) == 0) {
      i++;
    } else {
      j++;
    }
  }

  // if both the array consumed then fine else it is failed.
  return (i == sarr1.length && j >= (sarr2.length - 1));
}

  getIsAll(nonConstsntRow) {
    let isAll = false;
    try {
      if (nonConstsntRow.indices == "All" && nonConstsntRow.isConstant == false && (!this.rollup || (this.rollup && this.rollup !== "Group By" && this.rollup !== "Rollup By"))) {
        isAll = true;
      } else if (nonConstsntRow.indices == "Specified" && nonConstsntRow.expression.indexOf("PATTERN") !== -1 && nonConstsntRow.isConstant == false && (!this.rollup || (this.rollup && this.rollup !== "Group By" && this.rollup !== "Rollup By"))) {

        let matchedPattern = true;
        let firstBracet = nonConstsntRow.expression.indexOf("[");
        let lastBracket = nonConstsntRow.expression.indexOf("]");

        if (firstBracet >= 0 && lastBracket >= 0) {
          let value = nonConstsntRow.expression.substring(firstBracet + 1, lastBracket);
          let pattern = value.split("PATTERN#")[1];
          if (pattern) {
            let arrPattern = pattern.split(">");
            if (arrPattern && arrPattern.length > 0) {
              for (let i = 0; i < arrPattern.length; i++) {
                if (arrPattern[i] !== "*") {
                  matchedPattern = false;
                  break;
                }
              }
            }
          }

        }

        if (matchedPattern) {
          isAll = true;
        }
      }

    } catch (error) {
      return false;
    }
    return isAll;
  }

  getExp(value) {
    let exp = "";
    if (value && value.length > 0) {
      if (value.length > 30) {
        exp = value.substring(0, 30) + "..";
      } else {
        exp = value;
      }
    }

    return exp;
  }

  /**
   * This method is used for return the derived expression
   */
  getDerivedExpression(data) {
    const me = this;
    me.expressionAllSpecfied = '';
    let tempGroupName = me.groupName ? me.groupName : data.groupName;
    let tempGraphName = me.graphName ? me.graphName : data.graphName;

    me.derivedFormula = '{' + tempGroupName + '}' + '{' + tempGraphName + '}'

    if (me.dataFromSpecifed != "" && me.fromIndicesWindow) {
      me.expressionAllSpecfied = me.dataFromSpecifed;
      me.derivedFormula = me.derivedFormula + '[' + me.dataFromSpecifed + ']';
    }
    if (me.indices == "All") {
      me.expressionAllSpecfied = me.indices;
      me.derivedFormula = me.derivedFormula + '[' + me.indices + ']';
    }

    if (me.function && me.function !== "None") {
      me.derivedFormula = me.function + '(' + me.derivedFormula + ')';
    }

    if (me.selectedOperators && me.selectedOperators.length > 0) {
      for (let i = 0; i < me.selectedOperators.length; i++) {
        me.derivedFormula = me.selectedOperators[i] + "(" + me.derivedFormula + ")";
      }
    }

    return me.derivedFormula;
  }

  /**
   * This method is used for check is this row is constant or not
   */
  checkDerivedConstant(data) {
    try {

      if (data) {
        if (data.function) {
          if (data.function !== "None") {
            return true;
          }
        }


        if ((data.function == "None") && data.indices == "Specified" && data.expression.indexOf("PATTERN") !== -1) {
          let firstBracet = data.expression.indexOf("[");
          let lastBracket = data.expression.indexOf("]");

          if (firstBracet >= 0 && lastBracket >= 0) {
            let value = data.expression.substring(firstBracet + 1, lastBracket);
            if (value.indexOf("*") == -1) {
              return true;
            } else {
              return false;
            }
          }
        }
        else if ((data.function == "None") && data.indices == "Specified" && data.expression.indexOf("PATTERN") == -1) {
          let firstBracet = data.expression.indexOf("[");
          let lastBracket = data.expression.indexOf("]");

          if (firstBracet >= 0 && lastBracket >= 0) {
            let value = data.expression.substring(firstBracet + 1, lastBracket);
            if (value.indexOf(",") == -1) {
              return true;
            } else {
              return false;
            }
          }
        }
      }

      return false;
    } catch (error) {
      console.error("exception in checkDerivedConstant method = ", error);
    }
  }

  /**
   * This method is used for reset the metric expression values .
   */
  resetMetricExpValues() {
    this.groupName = undefined;
    this.graphName = undefined;
    this.function = "AVG";
    this.selectedOperators = [];
  }

  /**
   * This method is called when user click on the delete icon
   */
  deleteGraph(j) {
    const me = this;
    me.addedGraph.splice(j, 1);
    for (let i = 0; i < me.addedGraph.length; i++) {
      me.addedGraph[i]['index'] = COLOR_ARR[i].name;
      me.addedGraph[i]['colorForGraph'] = COLOR_ARR[i].color;
    }

    this.createDerivedGraphFormula();
    if (me.addedGraph.length > 0) {
      this.disableOn = true;
      this.disableBy = true;
      this.on = undefined;
      this.by = undefined;
      this.rollup = "No Aggregation";
      /* --------------------Get the first non constant row --------*/
      let nonConstantRow = this.getNonConstantRow(me.addedGraph);
      let firstConstantRow = this.getFirstConstantRow(me.addedGraph);
      let differentHeirchy = false;
      differentHeirchy = this.checkDifferentHeirchy();
      // let lastRow = me.addedGraph[me.addedGraph.length -1];
        let constant = false ;
        if(firstConstantRow) {
          constant = true;
        }
      if (nonConstantRow) {
        this.disableRollUp = false;
        this.disableBy = true;
        this.disableOn = true;
      } else {
        this.disableRollUp = true;
        this.disableBy = true;
        this.disableOn = true;
      }

      /*--------------------------For group Name ------------------------------- */
      this.calculationOnGroupName(nonConstantRow, constant, differentHeirchy);
      /*--------------------------For Derived Metric Name ------------------------*/
      this.calculationOnMetricName(nonConstantRow);


      this.buttonValue = ADD_UPDATE_BUTTON;
      this.derivedFlag = 4;
      this.derivedReqPayload = this.getDerivedRequestPayload(this.buttonValue);
      this.generateDerivedResponse(this.derivedReqPayload);
      this.ref.detectChanges();
    }else {
      this.derivedName = "";
      this.derivedGroupName = "";
      this.description = "";
      this.generatedChart = null;
      this.generatedChart = METRIC_CHARTS;
      this.generatedChart.highchart.series = [];
      this.generatedChart = { ...this.generatedChart };
    }

  }


  checkDifferentHeirchy() {
    let flag = false;
    try {

      if(this.addedGraph && this.addedGraph.length > 0) {
        let level = this.addedGraph[0].hierarchy;
        for(let i = 1 ; i < this.addedGraph.length ;i++) {
          if(level !==  this.addedGraph[i].hierarchy) {
              return true;
          }
        }
      }

    }catch(e){

    }

    return flag;
  }

  calculationOnGroupName(nonConstantRow, isConstant, differentHeirchy) {
    try {
      if (nonConstantRow) {
        let isAll = this.getIsAll(nonConstantRow);
        if (isAll && !isConstant && !differentHeirchy) {
          this.derivedGroupName = nonConstantRow.groupName;
          this.disabledGroupName = true;
        } else {
          this.derivedGroupName = nonConstantRow.groupName;
          this.disabledGroupName = false;
        }
      } else {
        this.derivedGroupName = this.addedGraph[0].groupName;
        this.disabledGroupName = false;
      }
    } catch (error) {

    }
  }

  public saveChanges(customTree:CustomMetricsComponent) {
    this.customTree = customTree;
    if (!this.derivedName || this.derivedName.trim() == "") {
      this.alertMsg("Please add derived metric name" , "Error");
      this.derivedName = "";
      return;
    }

    if(this.derivedName.trim().length > 256) {
      this.alertMsg("Derived metric name accept maximum 256 character" , "Error");
      return;
    }

    if (!this.derivedGroupName || this.derivedGroupName.trim() == "") {
      this.alertMsg("Please add derived Group name" , "Error");
      this.derivedGroupName = "";
      return;
    }

    if(this.derivedGroupName.trim().length > 256) {
      this.alertMsg("Derived group name accept maximum 256 character" , "Error");
      return;
    }

    if (!this.description || this.description.trim() == "") {
      this.alertMsg("Please add description" , "Error");
      this.description = "";
      return;
    }

    if(this.description.trim().length > 128) {
      this.alertMsg("Description accept maximum 128 character" , "Error");
      return;
    }

    if (this.addedGraph.length == 0) {
      this.alertMsg("Please add the derived component" , "Error");
      return;
    }

    if (!this.graphOperationExpression || this.graphOperationExpression.trim() == "") {
      this.alertMsg("Please add the Derived formula" , "Error");
      this.graphOperationExpression = "";
      return;
    }

    if ((!this.on || this.on.length == 0) && (this.rollup == "Rollup By" || this.rollup == "Group By")) {
      this.alertMsg("Please select atleast one level" , "Error");
      return;
    }

    this.graphOperationExpression = this.graphOperationExpression.toLocaleUpperCase();

    let error = this.checkValidationOfFormula();

    if (error && error.flag == false) {
      this.alertMsg(error.errorMsg , "Error");
      return;
    }

    let args = this.getArgs();
    let isValid = this.isValidFn(this.graphOperationExpression, args);
    if(!isValid) {
      this.alertMsg("Derived Formula is not valid", "Error");
      return;
    }

    this.derivedFlag = 1;
    this.buttonValue = SAVE_BUTTON;
    this.derivedReqPayload = this.getDerivedRequestPayload(this.buttonValue);
    this.isBlockUI = true;

    // this.dashboardComponent.renderDerivedData(CHART_DUMMY_DATA, true);

    this.generateDerivedResponse(this.derivedReqPayload);
    this.ref.detectChanges();

  }

  /**
   *
   * @param data
   * This merhod is called when user select the data from the derived indices window
   */
  getDataFromIndices(data, tagList , specifiedWindowData?: any ) {
    const me = this;
    if(specifiedWindowData) {
      this.specifiedWindowData = specifiedWindowData;
    }
    me.dataFromSpecifed = `${data}`;
    if (me.dataFromSpecifed && me.dataFromSpecifed != "" && me.dataFromSpecifed.indexOf("PATTERN#") == -1) {
      let specifiedData = ""
      let arrSpecified = me.dataFromSpecifed.split(",");
      if (arrSpecified && arrSpecified.length > 0) {
        for (let i = 0; i < arrSpecified.length; i++) {
          if (specifiedData == "") {
            specifiedData = arrSpecified[i];
          } else {
            specifiedData = specifiedData + ", " + arrSpecified[i];
          }
        }
      }
      me.dataFromSpecifed = specifiedData;
    }
    me.fromIndicesWindow = true;
    me.tagListFromIndices = tagList;
  }

  /**
   * This method is used for update the row of derived component table.
   * @param index
   * @param data
   */
  updateGraphData(index, data) {
    const me = this;
    me.derivedFormula = me.getDerivedExpression(data);

    let groupName = me.groupName ? me.groupName : data.groupName;
    const groupNameObject = this.getGroupNameObject(groupName);
    const graphObject = this.getGraphNameObject(me.graphName, me.graphList);
    let operator = me.selectedOperators ? me.selectedOperators : data.selectedOperators;

    let newOperator = "";
    if (operator && operator.length > 0) {
      for (let i = 0; i < operator.length; i++) {
        if (newOperator == "") {
          newOperator = operator[i];
        } else {
          newOperator = newOperator + ", " + operator[i];
        }
      }
    }
    const graphCalculation = {
      index: data.index,
      groupName: me.groupName ? me.groupName : data.groupName,
      graphName: me.graphName ? me.graphName : data.graphName,
      indices: me.indices ? me.indices : data.indices,
      function: me.function ? me.function : data.function,
      operator: operator,
      newOperator: newOperator,
      expression: me.derivedFormula,
      hierarchy: data.hierarchy,
      graphList: me.graphList ? me.graphList : data.graphList,
      groupInfo: groupNameObject.metricTypeName,
      graphInfo: graphObject.description,
      expressionAllSpecfied: me.expressionAllSpecfied ? me.expressionAllSpecfied : data.expressionAllSpecfied,
      tagListFromIndices: me.tagListFromIndices,
      colorForGraph: COLOR_ARR[index].color,
      specifiedAdvExpValue: this.getExp(me.expressionAllSpecfied),
      specifiedWindowData: this.specifiedWindowData ? this.specifiedWindowData : data.specifiedWindowData
    };

    let tempArray = [...me.addedGraph];
    tempArray.splice(index, 1);

    // ----------------------check row has constant or not--------------------
    const derivedConstant = this.checkDerivedConstant(graphCalculation);

    graphCalculation['isConstant'] = derivedConstant;

    /* --------------------Get the first non constant row --------*/
    let nonConstantRow = this.getNonConstantRow(tempArray);



    // checking if table has the non constant row
    if (nonConstantRow) {
      //checking the validation
      let isValid = this.checkValiDation(nonConstantRow, graphCalculation);
      if (isValid.valid == false) {
        this.alertMsg(isValid.errorMsg , "Error");
        me.fromIndicesWindow = false;
        me.dataFromSpecifed = "";
        return;
      }
    }

    if(this.sessionService.preSession.multiDc && graphCalculation['indices'] == "All" && graphCalculation['function'] !== "None") {
      this.alertMsg("Applying a function on the subjects residing on two or more cluster nodes is not supported in a multi-node cluster environment.Please either choose subjects from a single cluster node using specified option instead of using “All” option or use function as “None”. " , "Error");
      return;
    }

    // update the index with new values
    me.addedGraph[index] = graphCalculation;
    me.addedGraph[index].updateGraph = false;
    me.updateGraphMode = false;
    // me.fromIndicesWindow = false;
    // me.dataFromSpecifed = "";
    this.disableOn = true;
    this.disableBy = true;
    this.on = undefined;
    this.by = undefined;
    this.rollup = "No Aggregation";
    let nonConstRow = this.getNonConstantRow(me.addedGraph)
    let firstConstantRow = this.getFirstConstantRow(me.addedGraph);
    let differentHeirchy = false;
    differentHeirchy = this.checkDifferentHeirchy();
        let constant = false ;
        if(firstConstantRow) {
          constant = true;
        }

    if (nonConstRow) {
      this.disableRollUp = false;
      this.disableBy = true;
      this.disableOn = true;
    } else {
      this.disableRollUp = true;
      this.disableBy = true;
      this.disableOn = true;
    }

    /*--------------------------For group Name ------------------------------- */
    this.calculationOnGroupName(nonConstRow, constant , differentHeirchy);
    /*--------------------------For Derived Metric Name ------------------------*/
    this.calculationOnMetricName(nonConstRow);

    this.buttonValue = ADD_UPDATE_BUTTON;
    this.derivedFlag = 4;
    this.derivedReqPayload = this.getDerivedRequestPayload(this.buttonValue);
    this.generateDerivedResponse(this.derivedReqPayload);
    //  me.resetMetricExpValues();
    this.ref.detectChanges();
  }

  isProperSubSet(a, b) {
    if (a.length > b.length)
       return a.indexOf(b) != -1;

   return b.indexOf(a) != -1;
 }
  /**
   * This is used for the validation when user add or update the derived component into the table
   */
  checkValiDation(nonConstantRow, graphCalculation) {
    try {
      let isValid = { "valid": true, "errorMsg": "" };
      if (nonConstantRow && graphCalculation) {

        //Case: when hierarchy not matched.
        if (!this.isProperSubSet(nonConstantRow.hierarchy , graphCalculation.hierarchy) ) {
          isValid.valid = false;
          isValid.errorMsg = "Hierarchy not matched.";
        }
        // Case 1: when non constant row has the All indices
        else if (nonConstantRow.indices == "All") {
          //Case 1.1 : when new added graph has the specified indices and has non constant
          if (graphCalculation.indices == "Specified" && graphCalculation.expression.indexOf("PATTERN") == -1 && graphCalculation.isConstant == false) {
            isValid.valid = false;
            isValid.errorMsg = "components have different patterns.";
          }
          //Case 1.2: when new added graph has the Pattern and has non constant
          else if (graphCalculation.indices == "Specified" && graphCalculation.expression.indexOf("PATTERN") !== -1 && graphCalculation.isConstant == false) {

            let matchedPattern = true;
            let firstBracet = graphCalculation.expression.indexOf("[");
            let lastBracket = graphCalculation.expression.indexOf("]");

            if (firstBracet >= 0 && lastBracket >= 0) {
              let value = graphCalculation.expression.substring(firstBracet + 1, lastBracket);
              let pattern = value.split("PATTERN#")[1];
              if (pattern) {
                let arrPattern = pattern.split(">");
                if (arrPattern && arrPattern.length > 0) {
                  for (let i = 0; i < arrPattern.length; i++) {
                    if (arrPattern[i] !== "*") {
                      matchedPattern = false;
                      break;
                    }
                  }
                }
              }

            }

            if (!matchedPattern) {
              isValid.valid = false;
              isValid.errorMsg = "components have different patterns.";
            }
          }


        }
        // Case 2 : when non constant row has the Specified indices
        else if (nonConstantRow.indices == "Specified" && nonConstantRow.expression.indexOf("PATTERN") == -1) {
          //Case 2.1 : when new added graph has the All indices and also non constant
          if (graphCalculation.indices == "All" && graphCalculation.isConstant == false) {
            isValid.valid = false;
            isValid.errorMsg = "components have different patterns.";
          }
          //Case 2.2 : when new added graph has the Specified indices and also non constant
          else if (graphCalculation.indices == "Specified" && graphCalculation.expression.indexOf("PATTERN") == -1 && graphCalculation.isConstant == false) {
            let index = this.compareComponent(nonConstantRow, graphCalculation);
            if(index < 0) {
              isValid.valid = false;
              isValid.errorMsg = "components have different patterns.";
            }

          }
          //Case 2.3 : when new added graph has the Pattern indices and also non constant
          else if (graphCalculation.indices == "Specified" && graphCalculation.expression.indexOf("PATTERN") !== -1 && graphCalculation.isConstant == false) {
            isValid.valid = false;
            isValid.errorMsg = "components have different patterns.";

          }
        }
        // Case 3 : when the non constant row has the Pattern indices
        else if (nonConstantRow.indices == "Specified" && nonConstantRow.expression.indexOf("PATTERN") !== -1) {
          //Case 3.1 : when new added graph has the All indices and also non constant
          if (graphCalculation.indices == "All" && graphCalculation.isConstant == false) {
            let matchedPattern = true;
            let firstBracet = graphCalculation.expression.indexOf("[");
            let lastBracket = graphCalculation.expression.indexOf("]");
            if (firstBracet >= 0 && lastBracket >= 0) {
              let value = graphCalculation.expression.substring(firstBracet + 1, lastBracket);
              let pattern = value.split("PATTERN#")[1];
              if (pattern) {
                let arrPattern = pattern.split(">");
                if (arrPattern && arrPattern.length > 0) {
                  for (let i = 0; i < arrPattern.length; i++) {
                    if (arrPattern[i] !== "*") {
                      matchedPattern = false;
                      break;
                    }
                  }
                }
              }

            }

            if (!matchedPattern) {
              isValid.valid = false;
              isValid.errorMsg = "components have different patterns.";
            }


          }
          //Case 3.2 :when new added graph has the Specified indices and also non constant
          else if (graphCalculation.indices == "Specified" && graphCalculation.expression.indexOf("PATTERN") == -1 && graphCalculation.isConstant == false) {
            isValid.valid = false;
            isValid.errorMsg = "components have different patterns.";
          }
          //Case 3.3 : when the new added graphs has the pattern indices and also non constant
          else if (graphCalculation.indices == "Specified" && graphCalculation.expression.indexOf("PATTERN") !== -1 && graphCalculation.isConstant == false) {
            let index = this.compareComponent(nonConstantRow,graphCalculation);
            if(index< 0) {
              isValid.valid = false;
              isValid.errorMsg = "components have different patterns.";
            }
          }
        }
      }

      return isValid;
    } catch (error) {
      console.error("exception coming in method checkValiDation = ", error);
    }
  }

  /**
   * This is used for make the derived formula in input box
   */
  createDerivedGraphFormula() {
    const me = this;
    let derivedExp = "";
    if (me.addedGraph && me.addedGraph.length == 0) {
      me.graphOperationExpression = derivedExp;
    }

    if (me.addedGraph && me.addedGraph.length > 0) {

      for (let i = 0; i < me.addedGraph.length; i++) {
        if (derivedExp == "") {
          derivedExp = me.addedGraph[i].index;
        } else {
          derivedExp += "+" + me.addedGraph[i].index;
        }
      }

      me.graphOperationExpression = derivedExp;
    }
  }


  getNonConstantRowOfMaxLevel(data: any[]) {
    try {

      let maxLevel = "";
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let row = data[i];
          if (row.isConstant === false) {
            if(maxLevel == "") {
              maxLevel = row.hierarchy;
            }else if(maxLevel.split(">").length < row.hierarchy.split(">").length ) {
              maxLevel = row.hierarchy;
            }

          }
        }
      }
      return maxLevel;
    } catch (error) { }
  }
  /**
   * This is used for get the Non constant row from the derived component table
   */
  getNonConstantRow(data: any[]) {
    try {
      let nonContRow;
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let row = data[i];
          if (row.isConstant === false) {
            nonContRow = row;
            break;
          }
        }
      }
      return nonContRow;
    } catch (error) { }
  }

  changedRollUp() {
    if (this.rollup == "No Aggregation") {
      this.disableOn = true;
      this.disableBy = true;
      this.on = undefined;
      this.by = undefined;
    }
    else if (this.rollup == "Group By") {
      this.disableOn = false;
      this.disableBy = false;
      this.by = "Average";
      this.on = undefined;
      let hierarchy = this.getNonConstantRowOfMaxLevel(this.addedGraph);
      if (hierarchy && hierarchy !== "") {
        if (hierarchy) {
          let arrHierarchy = hierarchy.split(">");
          if (arrHierarchy && arrHierarchy.length > 0) {
            let arr = [];
            for (let i = 0; i < arrHierarchy.length; i++) {
              let json = {};
              arr.push({ "label": arrHierarchy[i], "value": arrHierarchy[i] });
            }
            if (arr.length > 0) {
              this.onList = [...arr];
            }
          }
        }
      }
    } else if (this.rollup == "Rollup By") {
      this.disableOn = false;
      this.disableBy = false;
      this.by = "Average";
      this.on = undefined;
      let hierarchy = this.getNonConstantRowOfMaxLevel(this.addedGraph);
      if (hierarchy && hierarchy !== "") {
        if (hierarchy) {
          let arrHierarchy = hierarchy.split(">");
          if (arrHierarchy && arrHierarchy.length > 0) {
            let arr = [];
            for (let i = 0; i < arrHierarchy.length -1 ; i++) {
              let json = {};
              arr.push({ "label": arrHierarchy[i], "value": arrHierarchy[i] });
            }
            if (arr.length > 0) {
              if(arr.length == 1) {
                this.on = [];
                this.on.push(arr[0].label);
              }
              this.onList = [...arr];
            }
          }
        }
      }
    }
    else {
      this.disableOn = false;
      this.disableBy = false;
    }

    if (this.addedGraph.length > 0) {
      /* --------------------Get the first non constant row --------*/
      let nonConstantRow = this.getNonConstantRow(this.addedGraph);
      let firstConstantRow = this.getFirstConstantRow(this.addedGraph);
      let differentHeirchy = false;
      differentHeirchy = this.checkDifferentHeirchy();
      let constant = false ;
      if(firstConstantRow) {
        constant = true;
      }
      /*--------------------------For group Name ------------------------------- */
      this.calculationOnGroupName(nonConstantRow, constant, differentHeirchy);
      /*--------------------------For Derived Metric Name ------------------------*/
      this.calculationOnMetricName(nonConstantRow);

    }




  }

  changedOn(event) {
    try {
      if (this.rollup == "Rollup By") {

        if (event.value.indexOf(event.itemValue) !== -1) {
          let index = this.getIndex(this.onList, event.itemValue);
          if (index > -1) {
            this.on = [];
            for (let i = 0; i <= index; i++) {
              this.on.push(this.onList[i].label);
            }
          }
        } else {
          let index = this.getIndex(this.onList, event.itemValue);
          if (index > -1) {
            this.on = [];
            for (let i = 0; i < this.onList.length; i++) {
              if (index >= i && event.itemValue.length > 0 && event.value.indexOf(this.onList[i].label) !== -1) {
                this.on.push(this.onList[i].label);
              }
            }
          }
        }
      }

    } catch (error) {
      console.error("exception in changedOn method ", error);
    }
  }

  getIndex(arr, value) {
    try {

      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (value == arr[i].label) {
            return i;
          }
        }
      }
    } catch (error) {
      console.error("exception in getIndex method ", error);
      return -1;
    }
  }


  getDerivedRequestPayload(buttonValue) {
    let finalReqPayload: DerivedRequestPayLoad = {}
    try {
      let duration =null
      if(this.patternMatchingService.flagPattern){
        duration =this.patternMatchingService.duration;
      }
      else{
       duration = this.getDuration();
      }
      finalReqPayload = {
        opType: 19,
        cctx: this.sessionService.session.cctx,
        dataFilter: [0,1,2,3,4,5],
        duration: duration,
        tr: parseInt(this.sessionService.session.testRun.id, 0),
        clientId: "Default",
        appId: "Default",
        dataCtx: this.getDataCtx(buttonValue)
      }
      if(this.patternMatchingService.flagPattern){
      this.patternMatchingService.setDerivedFormula(finalReqPayload.dataCtx.derivedCtx.metricExpression[0].variable[0].varExp);
      }
    } catch (error) {
      console.error("Error in the getDerivedRequestPayload method ", error);
    }

    return finalReqPayload;
  }


  getDataCtx(buttonValue) {
    let dataCtx: DataCtx = {};
    try {
      dataCtx = {
        ft: null,
        limit: 10,
        derivedFlag: this.derivedFlag,
        derivedCtx: this.getDerivedCtx(buttonValue)
      }

    } catch (error) {

    }
    return dataCtx;
  }

  getDerivedCtx(buttonValue) {
    let derivedCtx: DerivedCtx = {}
    try {
      let gdf_mg_id = 0;

      // need to pass gdf_mg_id in case of virtual metric. later we do in roll up also.
      if(this.disabledGroupName) {
        let groupNameObj = this.getGroupNameObject(this.derivedGroupName);

        if(groupNameObj)
          gdf_mg_id = groupNameObj.mgId;
      }

      derivedCtx = {
        gdf_mg_id: gdf_mg_id,
        details: this.getDetails(buttonValue),
        metricExpression: this.getMetricExpression(buttonValue)
      }

    } catch (error) {
      console.error("Exception in getDerivedCtx method", error);
    }

    return derivedCtx;
  }

  getDetails(buttonValue) {
    let details: Details = {};
    try {

      if (buttonValue == ADD_UPDATE_BUTTON) {
        details = {
          gName: "NA",
          desc: "NA"
        }
      } else {
        details = {
          gName: this.derivedGroupName.trim(),
          desc: this.description.trim()
        }
      }


    } catch (error) {
      console.error("Exception in getDetails method", error);
    }
    return details;
  }

  getMetricExpression(buttonValue) {
    let metricExpresion = [];
    try {
      let metricExpObj: MetricExpression = {};
      if (buttonValue == ADD_UPDATE_BUTTON) {
        metricExpObj = {
          variable: this.getVariable(),
          formula: "NA",
          aggregation: this.getAggregation(),
          derivedMName: "NA",
          derivedMDesc: "NA",
        }
      } else {
        metricExpObj = {
          variable: this.getVariable(),
          formula: this.graphOperationExpression,
          aggregation: this.getAggregation(),
          derivedMName: this.derivedName.trim(),
          derivedMDesc: this.description.trim(),
        }
      }


      metricExpresion.push(metricExpObj);

    } catch (error) {
      console.error("Exception in getMetricExpression method", error);
    }

    return metricExpresion;
  }

  getVariable() {
    let variable: Variable[] = [];
    try {

      if (this.addedGraph && this.addedGraph.length > 0) {
        for (let i = 0; i < this.addedGraph.length; i++) {
          let variableObj: Variable = {};
          let rowData = this.addedGraph[i];
          if (rowData) {
            let function1 = rowData.function;
            let functionValue = 0;
            if(function1 == "None") {
              functionValue = 0;
            }else if(function1 == "AVG") {
              functionValue = 2;
            }else if(function1 == "MAX") {
              functionValue = 4;
            }else if(function1 == "MIN") {
              functionValue = 3;
            }else if(function1 == "COUNT") {
              functionValue = 6;
            }else if(function1 == "SUMCOUNT") {
              functionValue = 5;
            }else if(function1 == "SUM") {
              functionValue = 1;
            }

            let operator = [];
            if (!rowData.operator || rowData.operator.length == 0) {
            //  operator = [0];
            } else {

              for (let j = 0; j < rowData.operator.length; j++) {
                if (rowData.operator[j] == "Log2") {
                  operator.push(1);
                } else if (rowData.operator[j] == "Log10") {
                  operator.push(2);
                } else if (rowData.operator[j] == "SampleDiffPct") {
                  operator.push(3);
                } else if (rowData.operator[j] == "PctAwayFromTAvg") {
                  operator.push(4);
                } else if (rowData.operator[j] == "SampleDiff") {
                  operator.push(5);
                }
              }
            }

            variableObj = {
              name: rowData.index,
              varExp: rowData.expression,
              gCtx: this.getGCtx(rowData),
              aggFn: functionValue,
              operators: operator
            }

            variable.push(variableObj);
          }


        }
      }

    } catch (error) {
      console.error("Exception in getVariable method", error);
    }

    return variable;
  }

  getGCtx(rowData) {
    let gCtx: GCtx[] = [];
    try {
      let gCtxObj: GCtx = {};
      if (rowData) {
        let indices = rowData.indices;
        if (indices == "All") {
          gCtxObj = {
            glbMetricId: "-1",
            subject: this.getSubject(rowData, indices, ""),
            measure: this.getMeasure(rowData)

          }

          gCtx.push(gCtxObj);
        } else if (rowData && indices == "Specified" && rowData.expressionAllSpecfied.indexOf("PATTERN#") !== -1) {
          gCtxObj = {
            glbMetricId: "-1",
            subject: this.getSubject(rowData, indices, ""),
            measure: this.getMeasure(rowData)

          }

          gCtx.push(gCtxObj);
        } else if (rowData && indices == "Specified" && rowData.expressionAllSpecfied.indexOf("PATTERN#") == -1) {
          let specifiedValue = rowData.expressionAllSpecfied;
          let arrValue = specifiedValue.split(",");
          if (arrValue && arrValue.length > 0) {
            for (let i = 0; i < arrValue.length; i++) {
              gCtxObj = {
                glbMetricId: "-1",
                subject: this.getSubject(rowData, indices, arrValue[i]),
                measure: this.getMeasure(rowData)
              }
              gCtx.push(gCtxObj);
            }
          }

        }
      }

    } catch (error) {
      console.error("Exception is coming inside getGCtx mrthod ", error);
    }

    return gCtx;
  }

  getSubject(rowData, indices, value) {
    let subject: Subject = {};
    let tag: Tags[] = [];
    try {
      if (rowData && indices == "All") {
        let hierarchy = rowData.hierarchy;
        if (hierarchy) {
          let arrhierarchy = hierarchy.split(">");
          if (arrhierarchy && arrhierarchy.length > 0) {
            for (let i = 0; i < arrhierarchy.length; i++) {
              let tagObj: Tags = {};
              tagObj = {
                key: arrhierarchy[i],
                value: "*",
                mode: 2
              }
              tag.push(tagObj);
            }
          }
        }

        subject = {
          tags: tag
        }
      } else if (rowData && indices == "Specified" && rowData.expressionAllSpecfied.indexOf("PATTERN#") !== -1) {

        subject = {
          tags: rowData.tagListFromIndices
        }


      } else if (rowData && indices == "Specified" && rowData.expressionAllSpecfied.indexOf("PATTERN#") == -1) {
        let hierarchy = rowData.hierarchy;
        let arrHierarchy = hierarchy.split(">");
        let arrValue = value.split(">");
        if (arrHierarchy && arrHierarchy.length > 0 && arrValue && arrValue.length > 0 && arrHierarchy.length == arrValue.length) {
          for (let i = 0; i < arrHierarchy.length; i++) {
            let tagObj: Tags = {};
            tagObj = {
              key: arrHierarchy[i],
              value: arrValue[i].trim(),
              mode: 1
            }
            tag.push(tagObj);
          }
        }

        subject = {
          tags: tag
        }
      }
    } catch (error) {
      console.error("Exception is coming inside getSubject mrthod ", error);
    }

    return subject;
  }

  getMeasure(rowData) {
    let measureObj: Measure = {};
    try {
      if (rowData) {

        let groupObj = this.getGroupNameObject(rowData.groupName);
        let graphObj = this.getGraphNameObject(rowData.graphName, rowData.graphList);
        measureObj = {
          metric: rowData.graphName,
          metricId: graphObj.metricId,
          mg: rowData.groupName,
          mgId: groupObj.mgId,
          mgType: "NA",
          mgTypeId: -1,
          showTogether: 0
        }
      }


    } catch (error) {
      console.error("Exception is coming inside getMeasure mrthod ", error);
    }

    return measureObj;
  }


  getAggregation() {
    let aggregationObj: Aggregation = {}
    try {
      aggregationObj = {
        type: this.getType(),
        by: this.getBy(),
        level: this.getLevel()
      }
    } catch (error) {
      console.error("Exception is coming inside getAggregation mrthod ", error);
    }
    return aggregationObj;
  }

  getType() {
    let type = 2;
    try {
      if (this.rollup) {
        if (this.rollup == "Rollup By") {
          type = 0;
        } else if (this.rollup == "Group By") {
          type = 1;
        }
      }
    } catch (error) {
      type = 2;
    }
    return type;
  }


  getBy() {
    let by = 2;
    try {
      if (this.by) {
        if (this.by == "Average") {
          by = 0;
        } else if (this.by == "Sum") {
          by = 1;
        }
      }
    } catch (error) {
      by = 2;
    }
    return by;
  }

  getLevel() {
    let level = "";
    try {
      if (this.on && this.on.length > 0 && (this.rollup == "Rollup By" || this.rollup == "Group By")) {
        for (let i = 0; i < this.onList.length; i++) {
          if (this.on.indexOf(this.onList[i].label) !== -1) {
            if (level == "") {
              level = this.onList[i].label;
            } else {
              level += "," + this.onList[i].label;
            }
          }

        }
      }
    } catch (error) {
      level = "";
    }
    return level;
  }

  ngOnDestroy(): void {
    const me = this;
    if (me.derivedSubscription)
      me.derivedSubscription.unsubscribe();
  }

  alertMsg(msg,header) {
    this.dialogVisible = true;
      this.confirmation.confirm({
        key: 'derivedMetrics',
        message: msg,
        header: header,
        accept: () => { this.dialogVisible = false; },
        reject: () => { this.dialogVisible = false;},
        rejectVisible:false
      });

      this.ref.detectChanges();
  }


}
