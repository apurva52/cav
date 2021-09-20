import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { SelectItem, Dialog, ConfirmationService, MessageService } from 'primeng';
import { FormBuilder } from '@angular/forms';
import { PatternMatchingService } from './service/pattern-matching.service';
import { merge, Subscription } from 'rxjs';
import { CategoryLoadedState, deleteCatalogueCreatedState, deleteCatalogueCreatingErrorState, deleteCatalogueCreatingState, getCatalogueCreatedState, getCatalogueCreatingErrorState, getCatalogueCreatingState, matchPatternCreatedState, matchPatternCreatingErrorState, matchPatternCreatingState, patternMatchingGraphCreatedState, patternMatchingGraphCreatingErrorState, patternMatchingGraphCreatingState, patternMatchingGroupCreatedState, patternMatchingGroupCreatingErrorState, patternMatchingGroupCreatingState, saveCatalogueCreatedState, saveCatalogueCreatingErrorState, saveCatalogueCreatingState } from './service/pattern-matching.state';
import { Store } from 'src/app/core/store/store';
import { DashboardWidgetComponent } from '../dashboard/widget/dashboard-widget.component';
import { SessionService } from 'src/app/core/session/session.service';
import { getGraphPayload, graphData, groupData } from '../derived-metric/service/derived-metric.model';
import { AppError } from 'src/app/core/error/error.model';
import { DashboardTime, DashboardWidget, DashboardWidgetLayout, ZoomInfo } from '../dashboard/service/dashboard.model';
import * as _ from 'lodash';
import { GroupInfo, MeasureCtx, MetaDataCtx, MetricSetCtx, PatternMatchMetaDataResponseDTO, patternMatchRequest, SubjectContext, SubjectMeasureCtx, SubjectTags, TargetData } from './pattern-matching.model';
import { MetricsSettingsComponent } from '../metrics-settings/metrics-settings.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from './catalogue-management/service/catalogue-management.model';
import { CONVERSION_REPORT_TABLE_DATA } from 'src/app/pages/home/home-sessions/form-analytics/conversion-report/service/conversion-report.dummy';
import { LowerTabularPanelComponent } from '../lower-tabular-panel/lower-tabular-panel.component';
import { LowerPanelService } from '../lower-tabular-panel/service/lower-tabular-panel.service';
import { CatalogueManagementService } from './catalogue-management/service/catalogue-management.service';

@Component({
  selector: 'app-pattern-matching',
  templateUrl: './pattern-matching.component.html',
  styleUrls: ['./pattern-matching.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatternMatchingComponent implements OnInit  {
  error: AppError;
  error1: boolean;
  loading: boolean;
  isVisible = false;
  displayBasic2 = false;
  patternSlider: number =80;
  sourceData: any[];
  targetData: TargetData[];
  graphType: string = "Business Transaction";
  widget:DashboardWidgetComponent;
  // Time Perios : FormGroup;
  categoryOptions: SelectItem[];
  @Input() categoryType: string = "all_graphs";

  @ViewChild('dialog', { read: Dialog }) dialog: Dialog;
  dataGroup: groupData;
  groupList: any[];
  graphList: any[];
  groupName: any;
  dataGraph:graphData;
  baselineGraph:any;
  subjectTags:SubjectTags[]=[];
  measure:any;
  measureCtx: MeasureCtx;
  subjectMeasureCtx:SubjectMeasureCtx[] =[];
  patternMatchMetricData: PatternMatchMetaDataResponseDTO;
  subjectContext:any;
  metricSetCtx: MetricSetCtx;
  private patternMatchSubscription: Subscription;
  subjecttags = [];
  empty: boolean;
  graphSettings = {};
  metricData = [];
  data:SaveCatlogueResponse;
  metricIds= [];
  metrics=[];
  patternMatchResponse:PatternMatchMetaDataResponseDTO;
  catalogueList: any[] =[];
  metricTypeNormal:string;
  metricTypederived:string;
  datares:SaveCatlogueResponse;
  deleteCatalogue:boolean=false;
  inversePatternMatch:boolean=true;
  hierarchy:string;
  keyAndValue:string[];
  tags:any[]=[];
  tag:SubjectTags=null;
  radioButtonCheck:any;
  disable:boolean =false;
  derivedFormulaValue:string;
  correlationMode:number;
  indices:string;
  expressionForAdvance:string;
  patternMatchAppliedFlag:boolean =false;
   user:any;
   deleteDisable:boolean =false;
   metaDataNotFound1:boolean=false;
   layoutType:any;
   widgetLayouts: DashboardWidgetLayout[] = [];
   GRID_ROWHEIGHT = 1;
   GRID_MAXCOLS = 200;
   WIDGETS_MARGIN = 5;
   noCatalogueAvail:boolean =false;
  dashboard:DashboardComponent;
   inversePatternFlag:any;
   userCatalogueName =null;
   userCatalogueFlag:boolean =false;
   baselineMetricInformation :any;
   mdata :any;
   baseLineData:any;
   payloadPattern:any;
   operatorType:any;
  constructor(
    private fb: FormBuilder,
    public  patternMatchingService: PatternMatchingService,
    public sessionService: SessionService,
    public confirmation: ConfirmationService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private lowerpanelService :LowerPanelService,
    private catalogueManagemnt: CatalogueManagementService,
  ) { 
  
    this.indices = this.patternMatchingService.selectedTestIndices;
    this.expressionForAdvance = this.patternMatchingService.expressionForAdvancedSelection ;
    this.derivedFormulaValue =this.patternMatchingService.derivedFormula;
  }

  ngOnInit(): void {
    const me = this;
    // if(this.radioButtonCheck ==='all'){
    //   this.disable=true;
    // }
    // if(this.radioButtonCheck=== 'zero'){
    //   this.disable =true;
    // }
   //if(me.dashboard===undefined){
    me.catalogueManagemnt.isDashboard().subscribe(value => {
      // console.log("value----", value);
      me.dashboard =value;
    })
   //}
    me.layoutType = '3';
    me.load();
    this.sourceData = [
      {
        label: 'MRP-Cenral',
        value: 'picklist',
      },
      {
        label: 'MRP-Eastern',
        value: 'picklist',
      },
      {
        label: 'Cavisson',
        value: 'picklist',
      },
      {
        label: 'KPI',
        value: 'picklist',
      },
      {
        label: 'MRP-SnbPerf',
        value: 'picklist',
      },
      {
        label: 'AccPerf',
        value: 'picklist',
      },
      {
        label: 'Ns_Perf',
        value: 'picklist',
      },
      {
        label: 'KPI',
        value: 'picklist',
      },
    ];
    this.targetData = [];
     me.user =this.sessionService.session.cctx.u;
     if(me.user ==="guest"){
       me.deleteDisable =true;
     }
     else{
       me.deleteDisable=false;
     }
    
  }
 

  getDerievedFormula(){
    let me =this;
    this.indices = this.patternMatchingService.selectedTestIndices;
    if(this.indices==="Advance"){
      this.expressionForAdvance = this.patternMatchingService.expressionForAdvancedSelection ;
    }
    else if(this.indices==="Specified"){
      this.expressionForAdvance = this.patternMatchingService.expressionSpecified;
    }
    else{
      this.expressionForAdvance = this.patternMatchingService.derivedFormula;
    }
   
  }
  
  /**
   * This method is used to load category Type----Correlation Mode=0 means we are opening all_graphs, 
   * Coorelation mode =1 means we are opening select_metric_catalogue.
   */
  load() {
    const me = this;
    merge(
      me.patternMatchingService.loadCategory()
    ).subscribe((state: Store.State) => {
      if (state instanceof CategoryLoadedState) {
        me.onLoaded(state);
        return;
      }
    });
  }

  private onLoaded(state: Store.State) {
    const me = this;
    if (state instanceof CategoryLoadedState) {
      me.categoryOptions = state.data;
     for(let i=0;i<me.categoryOptions.length;i++){
       if(me.categoryOptions[i].value==="select_metric_catalogue"){
        me.correlationMode =1;
      }
      else if(me.categoryOptions[i].value==="select_graphs"){
        me.correlationMode=2;
        me.categoryType ="select_graphs";
        if(me.categoryType==="select_graphs"){
          let duration =null;
          if(me.widget!==undefined && me.widget!==null){
           duration = this.getDuration(me.widget);
          }
          else{
            return;
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
          me.loadGroup(gPayload);
          me.metricTypeNormal="all";
      
          }
       }
     
      else if(me.categoryOptions[i].value==="all_graphs"){
        me.correlationMode = 0;
      }

     }
    }
    me.error1 = true;
    me.loading = false;
  }

    /**
   * This method is used to load to load Pattern Matching window
   */
  open(widget:DashboardWidgetComponent) {
    const me = this;
    me.widget=widget;
    let cctx = this.sessionService.session.cctx;
    // me.metricType="all";
    let vectorName:any[];
    me.sourceData = [];
    me.targetData = [];
    me.graphList = [];
    me.graphType=null;
    me.userCatalogueFlag =false;
    let sName =null;
    me.patternSlider =80;
    me.inversePatternMatch=true;
    me.patternMatchingService.finalArrayOfSelectedIndices =null;
    me.patternMatchingService.expressionForAdvancedSelection =null;
    me.patternMatchingService.setWidget(me.widget);
    vectorName =[];
    for(let i=0;i<widget.widget.dataCtx.gCtx[0].subject.tags.length;i++){
      vectorName.push(widget.widget.dataCtx.gCtx[0].subject.tags[i].value);
    }
    for(let i=0;i<vectorName.length;i++){
      if(i===0){
      sName=vectorName[i]+">";
      }
      else{
        if(i>1){
       sName =sName +">" +vectorName[i];
        }
        else{
          sName =sName +vectorName[i];
        }
      }
    }
    
    me.baselineGraph = widget.widget.dataCtx.gCtx[0].measure.metric + "-"+ sName;
    if(widget.widget.patternMatchBaselineFromLowerPanel && !widget.widget.dropTree){
      me.baselineGraph =widget.widget.patternMatchBaselineFromLowerPanel;
     
    }
    me.metricTypeNormal="all";
    let duration =null;
    me.patternMatchingService.setFlagPattern(true);
    // if(me.widget.widget.zoomInfo ){
    //   duration = this.getDurationInCaseOfZoom(me.widget.widget.zoomInfo);
    // }
    // else 
    if(me.widget!==undefined && me.widget!==null ){
     duration = this.getDuration(me.widget);
    }
    else{
      return;
    }
    const gPayload = {
     "opType": "4",
     "cctx": cctx,
    "duration": duration,
    "tr": this.sessionService.testRun.id,
    "clientId": "Default",
    "appId": "Default",
    "selVector": null
}
me.loadGroup(gPayload);
const payload = {
  "opType": "get",
  "cctx":cctx,
}
me.getCatalogueInfo(payload);


if(me.categoryType ==='select_graphs'){
  me.categoryType = 'select_metric_catalogue';
}

me.isVisible = true;
  }


  getDurationInCaseOfZoom(zoomInfo: ZoomInfo): any {
    let me =this;
    let  dashboardTime: DashboardTime =null ;
    //console.log("me.widget.dashboardTimedata-----",widget.dashboard.getTime);
    // if(zoomInfo!==undefined && zoomInfo!==null){
    //  dashboardTime = widget.dashboard.getTime();
    // }
    // const startTime: number = _.get(
    //   dashboardTime,
    //   'time.frameStart.value',
    //   null
    // );
    // const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
    // const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
    // const viewBy: number = _.get(dashboardTime, 'viewBy', null);
    //widget.dashboardTime
    const duration = {
      st:zoomInfo.times[0].zoomSt ,
      et: zoomInfo.times[0].zoomEt ,
      preset: "Zoom",
      viewBy:60,
    }
   me.patternMatchingService.setDuration(duration);
    return duration;
  }

  /**
   * This method is used to get Catalogue list from server
   */
  getCatalogueInfo(payload){
  let me =this;
  me.patternMatchingService.getCatalogue(payload).subscribe(
    (state: Store.State) => {
      if (state instanceof getCatalogueCreatingState) {
        me.getCatalogueonLoading(state);
        return;
      }

      if (state instanceof getCatalogueCreatedState) {
        me.getCatalogueonLoaded(state);
        this.cd.detectChanges();
        return;
      }
    },
    (state: getCatalogueCreatingErrorState) => {
      me.getCatalogueonLoadingError(state);
    }
  );
}

  getCatalogueonLoaded(state: getCatalogueCreatedState) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.data =state.data;
    if(me.data.status.code===501){
      me.catalogueList = [];
      return;
    }
    else{
    me.getcatalogueList(me.data.data);
    }
  }

  getcatalogueList(data: CatalogueTableData[]) {
   let me =this;
   me.catalogueList = [];
   for(let i=0;i<data.length;i++){
     if(data[i].name ===undefined){
       data.splice(i,1);
     }
     let json = data[i];
     json['label'] = data[i].name;
     json['value'] = data[i].name;
     //me.groupList.push(json);
    me.graphType= data[0].name;
    me.catalogueList.push(json);
    //if(me.data.data.length===1){
      me.patternMatchingService.setSelectedCatalogue(me.data.data[0].name);
      me.patternMatchingService.setCatalogueTableData(me.data.data);
      me.patternMatchingService.setCatalogueList(me.catalogueList);
    //}
   }
   if(me.catalogueList===null ||me.catalogueList===undefined){
    me.noCatalogueAvail=true;
  }
  if(me.catalogueList){
       me.userCatalogueName = me.catalogueList[0].createdBy;
       if(me.sessionService.session.cctx.u === me.userCatalogueName){
         me.userCatalogueFlag =true;
       }
   }
   this.cd.detectChanges();
  }
  getCatalogueonLoadingError(state: getCatalogueCreatingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }
  getCatalogueonLoading(state: getCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = false;
  }
  

  // Form Modal Close
  showBasicDialog2() {
    this.displayBasic2 = true;
  }
   // Form Modal Close
   closeDialog() {
    const me = this;
    me.isVisible = false;
  }


  /**
   * This method is used to select correlation Mode
   */
  selectGraphs(type) {
    const me = this;
    me.graphType = type;
    if(me.graphType==="select_graphs"){
      me.sourceData = [];
      me.targetData = [];
      me.graphList = [];
    const duration = this.getDuration(me.widget);
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
    me.loadGroup(gPayload);
    me.metricTypeNormal="all";
    me.cd.detectChanges();
    }
    else if(me.graphType ==="select_metric_catalogue" ||me.graphType === "select_graphs"){
      //const duration = this.getDuration(me.widget);
      const cctx = this.sessionService.session.cctx;
      const payload = {
        "opType": "get",
        "cctx":cctx,
      }

      me.getCatalogueInfo(payload);
      me.cd.detectChanges();
    }
  }
  private onLoadingGraph(state: patternMatchingGraphCreatingState) {
    const me = this;
    me.error = null;
    me.loading = false;
  }

  private onLoadingGraphError(state: patternMatchingGraphCreatingErrorState) {
    const me = this;
    me.dataGraph = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoadedGraph(state: patternMatchingGraphCreatedState) {
    const me = this;
    me.dataGraph = state.data;
    me.error = null;
    me.loading = false;
    me.populateGraphData(me.dataGraph);
  }

  populateGraphData(dataGraph: graphData) {
    const me = this;
    let i = 0;
    me.graphList =[];
    let hierarchy =null;
    let len = dataGraph.graph.length;
    while (i < len) {
      let json = dataGraph.graph[i];
      json['label'] = dataGraph.graph[i].name;
      json['value'] = dataGraph.graph[i].name;
      me.graphList.push(json);
      i++;
    }
  // me.patternMatchingService.setGroupData(me.graphList);
  }

  getGroupNameObject(groupName: any) {
    try {
      let me =this;
       if (me.groupList && me.groupList.length > 1) {
         for (let i = 0; i < me.groupList.length; i++) {
           if (groupName === me.groupList[i].value) {
             return me.groupList[i];
 
           }
         }
       }
 
     } catch (error) {
 
     }
  }

  loadGroup(gPayload) {
    const me = this;
    merge(
      me.patternMatchingService.loadGroupCategory(gPayload)
    ).subscribe((state: Store.State) => {
      if (state instanceof patternMatchingGroupCreatingState) {
        me.onLoadingGroup(state);
        return;
      }

      if (state instanceof patternMatchingGroupCreatedState) {
        me.onLoadedGroup(state);
        me.cd.detectChanges();
        return;
      }
    },
    (state: patternMatchingGroupCreatingErrorState) => {
      me.onLoadingGroupError(state);
    }
  );
  }


  onLoadingGroup(state: patternMatchingGroupCreatingState) {
    const me = this;
    me.error = null;
    me.loading = false;
  }

  onLoadedGroup(state: patternMatchingGroupCreatedState) {
    const me = this;
    me.dataGroup = state.data;
    me.error = null;
    me.loading = false;
    me.populateGroupData(me.dataGroup);
  }

  populateGroupData(dataGroup: groupData) {
    const me = this;
    me.groupList = [];
    let i = 0;
    let len = dataGroup.group.length;
    while (i < len) {
      let json = dataGroup.group[i];
      json['label'] = dataGroup.group[i].groupName;
      json['value'] = dataGroup.group[i].groupName;
      me.groupList.push(json);
      i++;
    }
    this.patternMatchingService.setGroupData(me.dataGroup);
  }

  onLoadingGroupError(state: patternMatchingGroupCreatingErrorState) {
    const me = this;
    me.dataGroup = null;
    me.error = state.error;
    me.loading = false;
  }

  
  getDuration(widget: DashboardWidgetComponent) {
   //const dashboardTime: DashboardTime = this.dashboardComponent.getTime(); // TODO: widget time instead of dashboard
      //DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
        let me =this;
        let  dashboardTime: DashboardTime =null ;
        if(widget!==undefined && widget!==null && widget.dashboard!==undefined && widget.dashboard!==null){
         dashboardTime = widget.dashboard.getTime();
        }
        const startTime: number = _.get(
          dashboardTime,
          'time.frameStart.value',
          null
        );
        const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
        const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
        const viewBy: number = _.get(dashboardTime, 'viewBy', null);
        //widget.dashboardTime
        const duration = {
          st: startTime,
          et: endTime,
          preset: graphTimeKey,
          viewBy,
        }
       me.patternMatchingService.setDuration(duration);
        return duration;
     // });
  }


  selectGraphsForBaseline(groupType){
    let me =this;
     this.graphList = [];
     let selectedgroupObject:GroupInfo;
    const groupNameObject = this.getGroupNameObject(groupType);
    selectedgroupObject ={
      "glbMgId" :groupNameObject.glbMgId,
      "groupName":groupNameObject.groupName,
      "hierarchicalComponent":groupNameObject.hierarchicalComponent,
      "metricTypeName":groupNameObject.metricTypeName,
      "mgId":groupNameObject.mgId,
      "vectorType":groupNameObject.vectorType,
    }
    this.patternMatchingService.setGroupNameObject(selectedgroupObject);
    const duration = this.getDuration(me.widget);
    const cctx = this.sessionService.session.cctx;
    const graphPayload: getGraphPayload = {
      "opType": "5",
      "cctx": cctx,
      "duration": duration,
      "tr": this.sessionService.session.testRun.id,
      "clientId": "Default",
      "appId": "Default",
      "mgId": groupNameObject.mgId,
      "glbMgId": groupNameObject.glbMgId,
      "grpName": groupNameObject.groupName
    }
    if (groupNameObject.groupName != undefined && groupNameObject.groupName != 'undefined') {
      me.patternMatchSubscription = me.patternMatchingService.loadGraphData(graphPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof patternMatchingGraphCreatingState) {
            me.onLoadingGraph(state);
            return;
          }

          if (state instanceof patternMatchingGraphCreatedState ) {
            me.onLoadedGraph(state);
            return;
          }
        },
        (state: patternMatchingGraphCreatingErrorState) => {
          me.onLoadingGraphError(state);
        }
      );
    }
  }
  /**
   * This method is called when we click on pattern Matching
   */
matchPatternMatching(){
  let me =this;
  let duration =null; 
   if(me.widget.widget.zoomInfo){
  const duration1 = {
    st: me.widget.widget.zoomInfo.times[me.widget.widget.zoomInfo.times.length-1].zoomSt,
    et: me.widget.widget.zoomInfo.times[me.widget.widget.zoomInfo.times.length-1].zoomEt,
    preset: 'SPECIFIED_TIME_'+me.widget.widget.zoomInfo.times[0].zoomSt+ "_"+me.widget.widget.zoomInfo.times[0].zoomEt,
    viewBy:me.widget.data.grpData.mFrequency[0].tsDetail.frequency,
  }
  me.patternMatchingService.setZoomApply(true);
  me.patternMatchingService.setDuration(duration1);
  duration = duration1;
   }
   else{
   duration= this.getDuration(me.widget);
   }
  const cctx = this.sessionService.session.cctx;
  let metricSetCtx =null;
  //me.validatePatternMatching();
  if(me.categoryType ==="select_metric_catalogue" ){
    metricSetCtx =this.getMetricSetToCorrelateInCaseOfCatalogue(me.catalogueList,me.graphType);
  }
  else if(this.patternMatchingService.selectedTestIndices==='Specified' && this.patternMatchingService.finalArrayOfSelectedIndices.length!==0){
    if(me.dataGraph===undefined ||me.dataGraph===null){
      me.validation();
      this.cd.detectChanges();
     return;
    }
   metricSetCtx = this.getMetricSetToCorrelateForSame(me.targetData,me.dataGraph,this.patternMatchingService.finalArrayOfSelectedIndices);
  }
  else if(this.patternMatchingService.selectedTestIndices==='Advance' && this.patternMatchingService.expressionForAdvancedSelection){
    if(me.dataGraph===undefined ||me.dataGraph===null){
      me.validation();
      this.cd.detectChanges();
     return;
    }
   metricSetCtx = this.getMetricSetToCorrelateForAdvance(me.targetData,me.dataGraph,this.patternMatchingService.expressionForAdvancedSelection);
  }
  else{
    if(me.dataGraph===undefined ||me.dataGraph===null){
      me.validation();
      this.cd.detectChanges();
     return;
    }
   metricSetCtx = this.getMetricSetToCorrelate(me.targetData,me.dataGraph);
  }
  this.patternMatchingService.setTargetData(me.targetData);
  if(me.inversePatternMatch){
    me.inversePatternFlag =[8];
  }
  else{
    me.inversePatternFlag =[0];
  }
  const subjectMeasureCtx = this.getSubjectMeasurmentCtxBrpBy(me.widget);
  const patternMatchRequest: patternMatchRequest = {
    "opType":8,
    "appId":"Default",
    "clientId":"Default",
    "tr":parseInt(this.sessionService.session.testRun.id),
    "cctx":cctx,
    "duration":duration,
    "etag":'version_for_etag_provided_by_tsdb',
    "metricSetToLookup":metricSetCtx,
    "flags":me.inversePatternFlag,
    "grpBy": subjectMeasureCtx,
    "patternMatch":{
    "pThreshold":me.patternSlider,
    "baseLineData":me.baseLineData
    },
    "exclOverall":-1

  }
   me.payloadPattern = patternMatchRequest;
  me.patternMatchSubscription = me.patternMatchingService.getPatternMatchData(patternMatchRequest).subscribe(
    (state: Store.State) => {
      if (state instanceof matchPatternCreatingState) {
        me.onMatchPatternLoading(state);
        return;
      }

      if (state instanceof matchPatternCreatedState) {
        me.onMatchPatternLoaded(state);
        //me.isVisible = false;
        return;
      }
    },
    (state: matchPatternCreatingErrorState) => {
      me.onMatchPatternLoadingError(state);
    }
  );
  }
  getMetricSetToCorrelateForAdvance(targetData: TargetData[], dataGraph: graphData, expressionForAdvancedSelection: string): any {
    let me =this;
    let metricSetCtx =null;
    let subjectMeasureCtx=[];
   // for(let i=0;i<me.targetData.length;i++){
     subjectMeasureCtx.push(me.getSubjectMeasurmentCtxForAdvance(me.targetData,dataGraph,expressionForAdvancedSelection));
    //}
     metricSetCtx = {
     indicesInfo:subjectMeasureCtx,
     catalogueName:""
   }
   return metricSetCtx;
  }
  getSubjectMeasurmentCtxForAdvance(targetData: TargetData[], dataGraph: graphData, expressionForAdvancedSelection: string): any {
    let me =this;
    me.metrics =[];
    me.metricIds = [];
    for(let i=0;i<me.targetData.length;i++){
      me.metricIds.push(targetData[i].metricId);
      me.metrics.push(targetData[i].name);
   }
    const measure ={
      // metric :targetData.name,
     // metricId:targetData.metricId,
     //me.widget.widget.dataCtx.gCtx[0].measure.mgType,
      mgType:"NA",
		//Store the Metric type id 
		  mgTypeId:-1,
		//Store the message of metric 
		   mg:dataGraph.groupName,
		//Store the metric Id
      mgId:dataGraph.mgId,
      showTogether:0,	
      metrics:me.metrics,
      metricIds:me.metricIds,
    }
    //for(let i=0;i<me.groupList.length;i++){
     // if(me.groupList[i].groupName ===graphData.groupName){
       me.hierarchy = expressionForAdvancedSelection;
       //break;
      
    //}
    let hierarchyComponent =me.hierarchy;
    let mode=1;
    let s1 =hierarchyComponent.split("#");
    // let s2 = s1[1].split(">");
    // if(s2[1]==="*"){
    //   mode =2;
    // }
    // else{
    //   mode =1;
    // }
    let HierarchicalComponent =this.patternMatchingService.totalHierarchyList;
    let finaladvanceSubject =s1 [1];
    me.keyAndValue = finaladvanceSubject.split('>');
    me.tags=[];
    for(let j=0;j<HierarchicalComponent.length;j++){
      //me.tag.key=me.keyAndValue[j];
      if(me.keyAndValue[j]==='*'){
        mode=2;
      }
      else if(me.operatorType==4){
       mode =4;
      }
      else{
        mode =1;
      }
      me.tag ={
        key:HierarchicalComponent[j],
        value:me.keyAndValue[j],
        mode:mode
      }
      me.tags.push(me.tag);
   }

    const subject ={
      tags :me.tags
    }
    const measuresubject ={
      measure: measure,
      subject:subject
    }
    return measuresubject;
  }
  getMetricSetToCorrelateForSame(targetData: TargetData[], dataGraph: graphData, finalArrayOfSelectedIndices: string): any {
     let me =this;
     let metricSetCtx =null;
     let subjectMeasureCtx=[];
     let finalString=[];
      finalString =finalArrayOfSelectedIndices.split(",");
     for(let i=0;i<finalString.length;i++){
      //subjectMeasureCtx.push(me.getSubjectMeasurmentCtxForSame(me.targetData,dataGraph,finalArrayOfSelectedIndices));
      me.metrics =[];
      me.metricIds = [];
      for(let i=0;i<me.targetData.length;i++){
        me.metricIds.push(targetData[i].metricId);
        me.metrics.push(targetData[i].name);
     }
      const measure ={
        // metric :targetData.name,
       // metricId:targetData.metricId,
       //me.widget.widget.dataCtx.gCtx[0].measure.mgType,
        mgType:"NA",
      //Store the Metric type id 
        mgTypeId:-1,
      //Store the message of metric 
         mg:dataGraph.groupName,
      //Store the metric Id
        mgId:dataGraph.mgId,
        showTogether:0,	
        metrics:me.metrics,
        metricIds:me.metricIds,
      } 
       me.hierarchy = finalString[i];
       let HierarchicalComponent =this.patternMatchingService.totalHierarchyList;
       //break;
      //}
    
    let hierarchyComponent =me.hierarchy;
    me.keyAndValue =hierarchyComponent.split(">");
    me.tags=[];
    for(let j=0;j<me.keyAndValue.length;j++){
      //me.tag.key=me.keyAndValue[j];
      me.tag ={
        key:HierarchicalComponent[j],
        value:me.keyAndValue[j],
        mode:1
      }
      me.tags.push(me.tag);
   }
  
    const subject ={
      tags :me.tags
    }
    
    const measuresubject ={
      measure: measure,
      subject:subject
    }
    subjectMeasureCtx.push(measuresubject);
    }
      metricSetCtx = {
      indicesInfo:subjectMeasureCtx,
      catalogueName:""
    }
    return metricSetCtx;
  }
  getSubjectMeasurmentCtxForSame(targetData: TargetData[], graphData: graphData, finalArrayOfSelectedIndices: any[]): any {

    let me =this;
    me.metrics =[];
    me.metricIds = [];
    for(let i=0;i<me.targetData.length;i++){
      me.metricIds.push(targetData[i].metricId);
      me.metrics.push(targetData[i].name);
   }
    const measure ={
      // metric :targetData.name,
     // metricId:targetData.metricId,
     //me.widget.widget.dataCtx.gCtx[0].measure.mgType,
      mgType:"NA",
		//Store the Metric type id 
		  mgTypeId:-1,
		//Store the message of metric 
		   mg:graphData.groupName,
		//Store the metric Id
      mgId:graphData.mgId,
      showTogether:0,	
      metrics:me.metrics,
      metricIds:me.metricIds,
    }
    for(let i=0;i<finalArrayOfSelectedIndices.length;i++){
      //if(me.groupList[i].groupName ===graphData.groupName){
       me.hierarchy = finalArrayOfSelectedIndices[i];
       //break;
      //}
    
    let hierarchyComponent =me.hierarchy;
    me.keyAndValue =hierarchyComponent.split(">");
    me.tags=[];
   // for(let j=0;j<me.keyAndValue.length;j++){
      //me.tag.key=me.keyAndValue[j];
      me.tag ={
        key:me.keyAndValue[0],
        value:me.keyAndValue[1],
        mode:1
      }
      me.tags.push(me.tag);
   // }
  
    const subject ={
      tags :me.tags
    }
    
    const measuresubject ={
      measure: measure,
      subject:subject
    }
    return measuresubject;
  }
  }

  getMetricSetToCorrelateInCaseOfCatalogue(catalogueList: any[], graphType: string): any {
  let me =this;
  let metricSetCtx =null;
   let subjectMeasureCtx=[];
  // for(let i=0;i<me.targetData.length;i++){
 for(let i=0;i<catalogueList.length;i++){
   if(graphType ===catalogueList[i].name){
    me.targetData =catalogueList[i].targetData;
    subjectMeasureCtx =me.getSubjectMeasurmentCtxInCaseOfCatalogue(me.targetData);
    break;
   }
 }
   //}
    metricSetCtx = {
    indicesInfo:subjectMeasureCtx,
    catalogueName:graphType
  }
  return metricSetCtx;
  }
  getSubjectMeasurmentCtxInCaseOfCatalogue(targetData: TargetData[]) {
    let me =this;
    me.metrics =[];
    me.metricIds = [];
    let subjectMeasureCtx=[];
     for(let i=0;i<me.targetData.length;i++){
  //     if(me.targetData[i].mgId === me.targetData[i+1].mgId)
  me.metricIds=[];
  me.metrics=[];
       me.metricIds.push(targetData[i].metricId);
      me.metrics.push(targetData[i].name);
  //  }

    const measure ={
      mgType:"NA",
		//Store the Metric type id 
		  mgTypeId:-1,
		//Store the message of metric 
		   mg:targetData[i].mg,
		//Store the metric Id
      mgId:targetData[i].mgId,
      showTogether:0,	
      metrics:me.metrics,
      metricIds:me.metricIds,
    }
       me.hierarchy = targetData[i].vectorName.sMeta;
    let hierarchyComponent =me.hierarchy;
    me.keyAndValue =hierarchyComponent.split(">");
    me.tags=[];
    if(targetData[i].description.startsWith("*")){
      for(let j=0;j<me.keyAndValue.length;j++){
        //me.tag.key=me.keyAndValue[j];
        me.tag ={
          key:me.keyAndValue[j],
          value:"All",
          mode:2
        }
        me.tags.push(me.tag);
      }
    }
    
    else{
      let data =targetData[i].description.split(">");
      if(targetData[i].description.startsWith("PATTERN#")){
       let patternData = targetData[i].description.split("PATTERN#");
       let data1= patternData[1].split(">");
     
    for(let j=0;j<me.keyAndValue.length;j++){
      //me.tag.key=me.keyAndValue[j];
      me.tag ={
        key:me.keyAndValue[j],
        value:data1[j],
        mode:4
      }
      me.tags.push(me.tag);
    }
  }
  else{
    for(let j=0;j<me.keyAndValue.length;j++){
      //me.tag.key=me.keyAndValue[j];
      me.tag ={
        key:me.keyAndValue[j],
        value:data[j],
        mode:1
      }
      me.tags.push(me.tag);
    }
  }
  }
    const subject ={
      tags :me.tags
    }
    const measuresubject ={
      measure: measure,
      subject:subject
    }
    subjectMeasureCtx.push(measuresubject);
    
  }
  return subjectMeasureCtx;
  }
  
  // validatePatternMatching() {
  //   let me =this;
  //   if(me.categoryType ==="select_metric_catalogue" ||me.categoryType ==="select_graphs"  || me.targetData === undefined||me.targetData == null ||me.targetData.length===0) {
  //     this.confirmation.confirm({
  //       header:'Pattern Matching Error',
  //       //key: 'saveCatByName',
  //       message: 'No metric selected for pattern matching.',
  //       accept: () => {return; },
  //       rejectVisible: false
  //     });
     
  //     return;
  // }
  // }

  getSubjectMeasurmentCtxBrpBy(widget: DashboardWidgetComponent) {
    let me =this;
    let measure ={};
    let subject:any;
    let metricName =null;
    me.mdata =[];
    subject = [];
    if(this.patternMatchingService.lowerpanelSelectedGraphInfo){
      let metricName = this.patternMatchingService.lowerpanelSelectedGraphInfo.metricName;
      let splitmetric = metricName.split(" - ");
    for(let i=0;i<me.widget.widget.dataCtx.gCtx.length;i++)
    {
       if(me.widget.widget.dataCtx.gCtx[i].measure.metric === splitmetric[0]){
         measure ={
          metric :me.widget.widget.dataCtx.gCtx[i].measure.metric,
          metricId:me.widget.widget.dataCtx.gCtx[i].measure.metricId,
          mgType:me.widget.widget.dataCtx.gCtx[i].measure.mgType,
          mgTypeId:me.widget.widget.dataCtx.gCtx[i].measure.mgTypeId,
          mg:me.widget.widget.dataCtx.gCtx[i].measure.mg,
          mgId:me.widget.widget.dataCtx.gCtx[i].measure.mgId,
          showTogether:0
          //metricIds:null
        }
        metricName =me.widget.widget.dataCtx.gCtx[i].measure.metric;
        subject ={
          tags :me.widget.widget.dataCtx.gCtx[i].subject.tags
        }
       }
    }
  }
  else{
     measure ={
      metric :me.widget.widget.dataCtx.gCtx[0].measure.metric,
      metricId:me.widget.widget.dataCtx.gCtx[0].measure.metricId,
      mgType:me.widget.widget.dataCtx.gCtx[0].measure.mgType,
		  mgTypeId:me.widget.widget.dataCtx.gCtx[0].measure.mgTypeId,
		  mg:me.widget.widget.dataCtx.gCtx[0].measure.mg,
      mgId:me.widget.widget.dataCtx.gCtx[0].measure.mgId,
      showTogether:0
      //metricIds:null
    }
    metricName =me.widget.widget.dataCtx.gCtx[0].measure.metric;
     subject ={
      tags :me.widget.widget.dataCtx.gCtx[0].subject.tags
    }
  }

    const measuresubject ={
      measure: measure,
      subject:subject
    }
for(let s=0;s<me.widget.data.grpData.mFrequency[0].data.length;s++){
  if(me.widget.data.grpData.mFrequency[0].data[s].measure.metric === metricName ){
    me.mdata[0]={
      subject:subject.tags,
      measure:measure,
      glbMetricId :me.widget.data.grpData.mFrequency[0].data[s].glbMetricId,
      pMatch: 100
    } 

    me.baselineMetricInformation ={
      title:me.baselineGraph,
      mdata :me.mdata
    }

    
      me.baseLineData =me.widget.data.grpData.mFrequency[0].data[s].avg;
    console.log("me.widget.data.grpData.mFrequency[0].data[s]------->",me.widget);

    break;
  }
}
    
    return measuresubject;
  }

  onMatchPatternLoadingError(state: matchPatternCreatingErrorState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.cd.detectChanges();
  }

  onMatchPatternLoaded(state: matchPatternCreatedState) {
    const me = this;
    me.patternMatchResponse = state.data;
    me.fillDatatoApplyPatternMatch(me.patternMatchResponse);
    this.patternMatchingService.setMatchPatternFlag(true);
    me.error = null;
    me.loading = false;
    this.cd.detectChanges();
    return;
  }
  metaDataNotFound(){
    let me=this;
    me.metaDataNotFound1 = true;
    this.isVisible =true;
    this.confirmation.confirm({
      key: 'metaData',
      header: 'Meta Data',
      message: 'There are no metrics whose pattern is '+me.payloadPattern.patternMatch.pThreshold+'% matching with baseline '+" ' "+ me.payloadPattern.grpBy.measure.mg +'->'+me.baselineGraph+" ' "+'. You can try by reducing the threshold percentage.',
      acceptVisible:true,
      rejectVisible:false,
    });

  }

  fillDatatoApplyPatternMatch(data: PatternMatchMetaDataResponseDTO) {
   let me =this;
   let metaDataCtx :MetaDataCtx[] =[];
   let finalobj = [];
    let obj1 = {};
    let pCaption = '';
    let title = '';
    if(me.targetData === undefined||me.targetData == null ||me.targetData.length===0) {
      me.validation();
      this.cd.detectChanges();
     return;
   }
    if(data.grpMetaData.length===0){
     me.metaDataNotFound();
     this.cd.detectChanges();
     return;
    }

  data.grpMetaData.sort(function (a, b) {
      return b.mdata[0].pMatch - a.mdata[0].pMatch;
    });

   
   // data.grpMetaData[0] =me.baselineMetricInformation;
    data.grpMetaData.splice(0,0,me.baselineMetricInformation);
    // if (data.grpMetaData.length == 1) {
    //   let meData = data.grpMetaData[0].mdata;
    //   if (data.grpMetaData[0].title.indexOf('null') != -1) {
    //    //pCaption = data.grpMetaData[0].title.replace('null', 'All');
    //    let title = data.grpMetaData[0].title;
    //   } else {
    //     title = pCaption = data.grpMetaData[0].title;
    //   }
    //   obj1['mData'] = this.makeData(meData,title);
    //   obj1['pCaption'] = obj1['mData'][0].title;
    //   obj1['graphSettings'] =   {};  //this.graphSettings;
    //   finalobj.push(obj1);
    // } else {
      for (let i = 0; i < data.grpMetaData.length; i++) {
        let obj1 = {};
        let meData;
        let title =null;
        if(i===0){
         meData =data.grpMetaData[0].mdata;
         title= data.grpMetaData[0].title + "("+ "Baseline"+ ")"; 
        }else{
         meData = data.grpMetaData[i].mdata;
         title = data.grpMetaData[i].title;
        }
        obj1['mData'] = this.makeData(meData,title);
        obj1['pCaption'] = obj1['mData'][0].title;
        obj1['graphSettings'] =   {}; //this.graphSettings;
        finalobj.push(obj1);
      }
   // }
    me.metricData = [];
    me.metricData = finalobj;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      let length = (this.layoutType * this.layoutType);
      
      if (this.metricData.length > length) {
      length = this.metricData.length;
      }
      //if (this.metricData.length > dc.data.favDetailCtx.widgets.length) {
      dc.data.favDetailCtx.widgets = [];
      this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
      dc.data.favDetailCtx.layout.configGrid.cols = this.GRID_MAXCOLS;
      dc.data.favDetailCtx.layout.configGrid.rowHeight = this.GRID_ROWHEIGHT;
      dc.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;
      
      for (let i = 0; i < length; i++) {
      
      let newWidget = dc.getNewWidget('GRAPH')
      newWidget.name = "";
      newWidget.id = ""; 
      dc.data.favDetailCtx.widgets.push(newWidget);
      dc.data.favDetailCtx.widgets[i].widgetIndex = i;
      if(me.metricData[i]) {
      dc.data.favDetailCtx.widgets[i].id = me.metricData[i].pCaption;
      dc.data.favDetailCtx.widgets[i].name = me.metricData[i].pCaption;
      }
      
      dc.data.favDetailCtx.widgets[i].dataAttrName = "avg";
      dc.data.favDetailCtx.widgets[i].description = "";
      dc.data.favDetailCtx.widgets[i].graphs = {};
      dc.data.favDetailCtx.widgets[i].layout = dc.data.favDetailCtx.layout.configGrid.widgetLayouts[i];
      
      // dc.data.favDetailCtx.widgets[0].isSelectedWidget =true;
      }
      dc.changeLayout(dc.data.favDetailCtx.layout);
      //}
      // else {
      // length = this.metricData.length;
      // dc.data.favDetailCtx.widgets=[];
      // for (let i = 0; i < length; i++) {
      
      // if (i < this.metricData.length){
      
      // dc.data.favDetailCtx.widgets[i] = dc.getNewWidget('GRAPH');
      // dc.data.favDetailCtx.widgets[i].widgetIndex =i; 
      // // dc.data.favDetailCtx.widgets[0].isSelectedWidget =true;
      // }
      // }
      // }
      
      // dc.data.favDetailCtx.widgets.push(dc.getNewWidget('GRAPH'));
      // let layout = dc.data.favDetailCtx.widgets[i-1].layout;
      // let mod = i % 3;
      // if (mod == 0) {
      // layout.x = 10 * mod;
      // layout.y = layout.y + 4;
      // } else {
      // layout.x = 10 * mod;
      // }
      // dc.data.favDetailCtx.widgets[i].layout = layout;
      // }
     if(this.lowerpanelService.isLowerPanelValue){
       console.log("this.lowerpanelService------",this.lowerpanelService);
      this.lowerpanelService.setLowerPanelValue(false);

     }
     
      dc.applyPatternMatching(data.grpMetaData, me.metricData);
      
      
    });
    

  me.isVisible=false;
  //me.patternMatchAppliedFlag =true;
  //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Pattern Matching is Applied successfully' });
  }
  validation() {
    let me =this;
    me.metaDataNotFound1 = true;
    this.isVisible =true;
    this.confirmation.confirm({
      key: 'metaData',
      header: 'Pattern Match Error',
      message: 'No metric selected for pattern matching.',
      acceptVisible:true,
      rejectVisible:false,
    });
  }
  calculateContainerHeight() {
    if (document.getElementsByClassName('scrollVertical')[0] !== undefined) {
      let totalheight = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
      if (document.getElementsByClassName('open')[0] !== undefined) {
        let lowerPanelHeight = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
        totalheight = totalheight + lowerPanelHeight + 2;
      }
      return totalheight;
    }

    let height = Math.round(document.getElementsByClassName('selected-widget-container')[0].getBoundingClientRect().height);
    let x = Math.floor(document.getElementsByClassName('ui-carousel-items-container')[0].getBoundingClientRect().x) + Math.floor(document.getElementsByClassName('selected-widget-container')[0].getBoundingClientRect().x);
    let totalheight = height + x + (2 * this.WIDGETS_MARGIN);
    return totalheight;
  }
  getWidgetLayouts(rowsCalc, colsCalc, length) {
    const me = this;
    let viewPortContainerHeight = this.calculateContainerHeight();
    let fixedRowHeight = this.GRID_ROWHEIGHT; //rowheight of grids
    let margin = this.WIDGETS_MARGIN; // margin between widgets
    let totalRowHeight = fixedRowHeight + margin;
    let maxCols = this.GRID_MAXCOLS; // fixed cols in layout
    let totalNoOfRows = Math.floor(viewPortContainerHeight / totalRowHeight);
    let widgetPerRowHeight = Math.floor(totalNoOfRows / rowsCalc);
    let widgetHeightCalc = widgetPerRowHeight * rowsCalc;
    let wHeight = totalNoOfRows > widgetHeightCalc ? totalNoOfRows - widgetHeightCalc : widgetHeightCalc - totalNoOfRows;
    let islessHeight = totalNoOfRows > widgetHeightCalc ? true : false;
    let calc = rowsCalc;
    let counter = 1;
    let rowCounter = 1;
    let widgetPerColWidth = colsCalc <= 0 ? maxCols : Math.floor(maxCols / colsCalc);
    let widgetWidthCalc = widgetPerColWidth * colsCalc;
    let wWidth = maxCols > widgetWidthCalc ? maxCols - widgetWidthCalc : widgetWidthCalc - maxCols;
    let islessWidth = maxCols > widgetWidthCalc ? true : false;
    let colNewCalc = colsCalc - 1;
    let widgetLayouts: DashboardWidgetLayout[] = [];
    widgetLayouts.push({ cols: widgetPerColWidth, rows: widgetPerRowHeight, x: 0, y: 0 });
    //convert according to widget length

    for (let i = 0; i < length; i++) {

      //ignoring first widget
      if (i == 0) {
        continue;
      }

      else if (i % colsCalc == 0) {
        let rows = widgetPerRowHeight;
        counter++;
        if (counter == rowsCalc) {
          rows = islessHeight ? widgetPerRowHeight + wHeight : widgetPerRowHeight - wHeight;
          counter = 0;
        }

        widgetLayouts.push({ cols: widgetPerColWidth, rows: rows, x: 0, y: widgetLayouts[i - 1].rows + widgetLayouts[i - 1].y });
        continue;
      }
      //for same row for another cols
      let cols = widgetPerColWidth;
      if (rowCounter == colNewCalc) {
        cols = islessWidth ? widgetPerColWidth + wWidth : widgetPerColWidth - wWidth;
        rowCounter = 0;
      }
      rowCounter++;
      widgetLayouts.push({ cols: cols, rows: widgetLayouts[i - 1].rows, x: widgetLayouts[i - 1].cols + widgetLayouts[i - 1].x, y: widgetLayouts[i - 1].y });
      continue;
    }
    return widgetLayouts;
  }
  makeData(meData: any,title:string): any {
    let objs = [];
    this.graphSettings = {};
    for (let j = 0; j < meData.length; j++) {
      let titles = '';
      let subject = [];
      let vectorName = '';
      let measure = meData[j].measure;
      let glbMetricId = meData[j].glbMetricId;
      let subj = meData[j].subject;
      for (let k = 0; k < subj.length; k++) {
        if (k == 0)
          vectorName = subj[k].value;
        else
          vectorName = vectorName + ">" + subj[k].value;
        subject.push({ key: subj[k].key, value: subj[k].value, mode: 1 });
      }
      if(title.endsWith('(Baseline)')){
        titles = title;
      }
      else{
        // if(this.inversePatternFlag[0] ===8){
        //   titles = title + "(" + "-" + meData[j].pMatch + "%" + ")";
        // }
        // else{
          titles = title + "(" + meData[j].pMatch + "%" + ")";
        //}
      }
      // let glbMetricIdkey = glbMetricId + "-" + 0;
      // this.graphSettings[glbMetricIdkey] = this.getGraphSetting(glbMetricIdkey);
      objs.push(
        {
          "title": titles,
          "measure": measure,
          "subject": subject,
          "glbMetricId": glbMetricId,
          "vectorName": vectorName,
        }
      );
    }
    return objs;
  }

  onMatchPatternLoading(state: matchPatternCreatingState) {
    const me = this;
    me.patternMatchMetricData = null;
    me.empty = null;
    me.error = state.error;
    me.loading = true;
    me.cd.detectChanges();
  }
  

  getBaselineGraphInfo(widget:DashboardWidgetComponent){
   let me =this;
   me.subjectContext =widget.widget.dataCtx.gCtx[0].subject;
    const measure ={
      metric :widget.widget.dataCtx.gCtx[0].measure.metric,
      metricId:widget.widget.dataCtx.gCtx[0].measure.metricId,
      mgType:widget.widget.dataCtx.gCtx[0].measure.mgType,
		//Store the Metric type id 
		  mgTypeId:widget.widget.dataCtx.gCtx[0].measure.mgTypeId,
		//Store the message of metric 
		   mg:widget.widget.dataCtx.gCtx[0].measure.mg,
		//Store the metric Id
      mgId:widget.widget.dataCtx.gCtx[0].measure.mgId,
      showTogether:0,	
      metricIds:null
    }
    
   let groupBy = {
    subject: me.subjectContext,
    measure: measure,
  }
  return groupBy;
  }

  getMetricSetToCorrelate(targetData, graphData){
   let me =this;
   let metricSetCtx =null;
   let subjectMeasureCtx=[];
  // for(let i=0;i<me.targetData.length;i++){
    subjectMeasureCtx.push(me.getSubjectMeasurmentCtx(me.targetData,graphData));
   //}
    metricSetCtx = {
    indicesInfo:subjectMeasureCtx,
    catalogueName:""
  }
  return metricSetCtx;
  }

  getSubjectMeasurmentCtx(targetData:TargetData[],graphData:graphData) {
    let me =this;
    me.metrics =[];
    me.metricIds = [];
    for(let i=0;i<me.targetData.length;i++){
      me.metricIds.push(targetData[i].metricId);
      me.metrics.push(targetData[i].name);
   }
    const measure ={
      // metric :targetData.name,
     // metricId:targetData.metricId,
     //me.widget.widget.dataCtx.gCtx[0].measure.mgType,
      mgType:"NA",
		//Store the Metric type id 
		  mgTypeId:-1,
		//Store the message of metric 
		   mg:graphData.groupName,
		//Store the metric Id
      mgId:graphData.mgId,
      showTogether:0,	
      metrics:me.metrics,
      metricIds:me.metricIds,
    }
    for(let i=0;i<me.groupList.length;i++){
      if(me.groupList[i].groupName ===graphData.groupName){
       me.hierarchy = me.groupList[i].hierarchicalComponent;
       break;
      }
    }
    let hierarchyComponent =me.hierarchy;
    me.keyAndValue =hierarchyComponent.split(">");
    me.tags=[];
    for(let j=0;j<me.keyAndValue.length;j++){
      //me.tag.key=me.keyAndValue[j];
      me.tag ={
        key:me.keyAndValue[j],
        value:"All",
        mode:2
      }
      me.tags.push(me.tag);
    }
    const subject ={
      tags :me.tags
    }
    const measuresubject ={
      measure: measure,
      subject:subject
    }
    return measuresubject;

  }

  selectCatalogue(cataLogueName){
   let me =this;
   me.graphType =cataLogueName;
    me.userCatalogueName =null;
    me.userCatalogueFlag=false;
   me.patternMatchingService.setCatalogueTableData(me.data.data);
   me.patternMatchingService.setSelectedCatalogue(me.graphType);
  //     const cctx = this.sessionService.session.cctx;
  //  let payload1 = {
  //   "opType": "get",
  //   "cctx":cctx,
  // }
 //me.getCatalogueInfo(payload1);
 me.catalogueList =this.patternMatchingService.catalogueList;
 if(me.catalogueList){
   for(let i=0;i<me.catalogueList.length;i++){
     if(cataLogueName ===me.catalogueList[i].name ){
      me.userCatalogueName = me.catalogueList[i].createdBy;
      if(me.sessionService.session.cctx.u === me.userCatalogueName){
        me.userCatalogueFlag =true;
      }
      break;
     }
   }
  }
  if(me.sessionService.session.cctx.u === me.userCatalogueName){
    me.userCatalogueFlag =true;
  }
  this.cd.detectChanges();
  }
  deleteCataloguebyName(){
    let me =this;
    me.deleteCatalogue = true;
    this.confirmation.confirm({
      key: 'deleteCatByName',
      header: 'Delete Catalogue',
      message: 'Are you sure you want to delete Catalogue '+ me.graphType +'?',
      accept: () => { this.deleteCataloguebyNameCall() },
      reject: () => { return;
      }
    });
  }

  deleteCataloguebyNameCall(){
       let me =this;
    let creationDate:string;
    const cctx = this.sessionService.session.cctx;
   creationDate =new Date().toLocaleString();
    let payload: SaveCatalogue={
      'opType':"delete",
      'cctx':cctx,
      'targetData': me.targetData,
      'name':me.graphType,
      'description':"",
      'createdBy':cctx.u,
      "creationDate":creationDate,
      "metricType":"Normal",
      "chartType":"0",
	    "seriesType":"",
	   "arrPercentileOrSlabValues":[] 
    }

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Catalogue ' + me.graphType +  ' is deleted successfully' });
    me.patternMatchingService.deleteCatalogue(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof deleteCatalogueCreatingState) {
          me.deleteOnLoading(state);
          return;
        }
  
        if (state instanceof deleteCatalogueCreatedState) {
          me.deleteOnLoaded(state);
          
          return;
        }
      },
      (state: deleteCatalogueCreatingErrorState) => {
        me.deleteOnLoadingError(state);
      }
    );
}
  deleteOnLoadingError(state: deleteCatalogueCreatingErrorState) {
    const me = this;
    me.error = null;
    me.datares = null;
    me.loading = false;
  }
  deleteOnLoaded(state: deleteCatalogueCreatedState) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.datares =state.data;
    if(me.datares.status.code === 203){
      me.catalogueList =[];
    }
    const cctx = this.sessionService.session.cctx;
      const payload = {
        "opType": "get",
        "cctx":cctx,
      }
      me.getCatalogueInfo(payload);
      this.cd.detectChanges();
  
}
  deleteOnLoading(state: deleteCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = false;
  }

//this method is used to check whether inverse pattern matching is applied flag is on or off.
onclickONInversePatternMatch(event){
let me =this;
if(me.inversePatternMatch){
  me.inversePatternMatch =true;
  }
   else{
  me.inversePatternMatch =false;
   }
}
 
picklistToTarget(event){
let me =this;
for(let i=0;i<me.targetData.length;i++){
  if(me.targetData[i].label.includes("|")){

  }
  else{
    if(me.patternMatchingService.expressionForAdvancedSelection==null && me.patternMatchingService.finalArrayOfSelectedIndices== null){
      me.targetData[i].description= "*";
    }
    else{
      if(me.patternMatchingService.expressionForAdvancedSelection){
        let advance =me.patternMatchingService.expressionForAdvancedSelection;
        //let finalAdvance = advance.split("PATTERN#"); 
        me.targetData[i].description = advance;
        me.operatorType =4;
      //me.targetData[i].description=me.patternMatchingService.expressionForAdvancedSelection;
      }
      else{
        me.targetData[i].description=me.patternMatchingService.finalArrayOfSelectedIndices;
        me.operatorType =1;
      }
    }
    me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name;
    if(me.patternMatchingService.expressionForAdvancedSelection !=null){
      me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name+">"+me.patternMatchingService.expressionForAdvancedSelection;
    }
    else if(me.patternMatchingService.finalArrayOfSelectedIndices !=null){
      me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name+">"+me.patternMatchingService.finalArrayOfSelectedIndices;
    }
  // me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name;
  me.targetData[i].mgId=me.patternMatchingService.groupNameObject.mgId;
  me.targetData[i].mg =me.patternMatchingService.groupNameObject.groupName;
  me.targetData[i]['vectorName']=me.patternMatchingService.groupNameObject.hierarchicalComponent;
}}
}
pickListToSource(event){
  let me =this;
  let value=null;
  for(let i=0;i<event.items.length;i++){
    if(event.items[i].label.includes('>')){
      value= event.items[i].label.split(">");
      let value1= value[0].split("|");
   event.items[i].label = value1[1];
    }
    else{
      // /value= event.items[i].label.split("|");
      let value1= event.items[i].label.split("|");
      event.items[i].label = value1[1];
    }

  }
}
checkAll(){
  let me =this;
  me.metricTypederived =null;
  if(me.metricTypeNormal== "all"){
    me.metricTypeNormal ="Normal";
  }
}

}
