import { AlertActionService } from './../../alert-actions/service/alert-actions.service';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng';
import { ALGO_TYPE, Bounds, CHANGE, COLOR_ARR, CONDITION_TYPE, DATA_TYPE, DATA_TYPE_THRESHOLD,DATA_TYPE_ANOMALY, ForecastModel, ForecastType, IMAGE_PATH, METRIC_ATTRIBUTE, METRIC_COLOR_ARR, OPERATOR, OUTLIER_WINDOW_TYPE, PANEL_DUMMY, PAYLOAD_TYPE, PCT_TYPE, RULE_DATA, SCHEDULE_TYPE, SEVERITY_PANEL_DUMMY, Sevrity, TIME_WINDOW_UNIT, TOLERANCE, UseMad, Usetheta, WINDOW_TYPE, CRITICAL_SEVERITY, MINOR_SEVERITY, MAJOR_SEVERITY, OPERATOR_ANOMALY, GRAPH_REQEST, TAGS } from './service/alert-config.dummy';
import { AlertConfigService } from './service/alert-config.service';
import { RulePayload, RuleConfig, SubjectTags, Subject, Measure, Metric, ThresholdType, ChangeType, AnomalyType, OutliersType, ForcastType, Condition, AttributesConfig, Severity, Tag, Actions, ScheduleConfiguration, ScheduleConfig, WidgetLoadReq, GCtx, Tags } from './service/alert-config.model';
import { Store } from 'src/app/core/store/store';
import { GraphLoadedState, GraphLoadingErrorState, GraphLoadingState, GroupLoadedState, GroupLoadingErrorState, RuleDataLoadedState, RuleDataLoadingErrorState, RuleDataLoadingState, ActionListLoadingState, ActionListLoadedState, ActionListLoadingErrorState, GenerateChartLoadedState, GenerateChartLoadingState, GenerateChartLoadingErrorState } from './service/alert-config.state';
import { AppError } from 'src/app/core/error/error.model';
import * as _ from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';
import { DerivedMetricIndicesComponent } from 'src/app/shared/derived-metric/derived-metric-indices/derived-metric-indices.component';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { Action, Email } from '../../alert-actions/service/alert-actions.model';
import { AddActionComponent } from '../../alert-actions/add-action/add-action.component';
import { AlertRulesService } from '../service/alert-rules.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { AdvancedConfigurationComponent } from '../../alert-configuration/advanced-configuration/advanced-configuration.component';
import { environment } from 'src/environments/environment';
import { AlertDownloadService } from '../../service/alert-download.service';
import { DownloadedState, DownloadingErrorState } from '../../service/alert-table.state';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { Moment } from 'moment-timezone';
import { ACTION_OPERATONS } from '../../alert-actions/service/alert-action-constants';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { METRIC_CHARTS } from 'src/app/shared/derived-metric/service/derived-metric.model';
import { DashboardWidgetLoadRes } from 'src/app/shared/dashboard/service/dashboard.model';
import { AlertFilterService } from '../../alert-filter/services/alert-filter.service';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState } from 'src/app/shared/time-bar/service/time-bar.state';
import { TimeOptions, XAxisOptions } from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { GroupHierarchy } from '../service/alert-rules.model';
import { MODULE } from '../../alert-configuration/advanced-configuration/service/advanced-configuration.dummy';
import { ALERT_MODULES } from '../../alert-constants';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-alert-configuration',
  templateUrl: './alert-configuration.component.html',
  styleUrls: ['./alert-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AlertConfigurationComponent implements OnInit, OnDestroy {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  //breadcrumb: MenuItem[];
  selectedValue: string;
  addedGraph: any[] = [];
  panel: any;
  severityPanel: any;
  actionName: any[] = [];
  emailId: String = "";
  selectedTag: any;
  // multipleCondition: string = 'Single';

  dashboardComponent: DashboardComponent;
  data: RulePayload;
  error: AppError;
  viewMode: boolean;
  loading: boolean;
  indices: string = "All";
  groupList = [];
  graphList = [];
  metricAttributeList: SelectItem[] = [];
  groupName: any;
  graphName: any;
  metricAttribute: any;
  updateGraphMode: boolean;
  updateCoditionMode: boolean;
  fromIndicesWindow: boolean = false;
  dataFromSpecifed: string;
  tagListFromIndices: SubjectTags[] = [];
  indexOfGraphSelected: number;
  indexOfCoditionSelected: number;
  graphDataSelected: any;
  scheduleTypeList: SelectItem[] = [];
  totalHierarchyList: GroupHierarchy[] = [];
  conditionTypeList: SelectItem[] = [];
  dataTypeList: SelectItem[] = [];
  operatorList: SelectItem[] = [];
  changeList: SelectItem[] = [];
  metricList: SelectItem[] = [];
  timeWindowUnitList: SelectItem[] = [];
  bounds: SelectItem[] = [];
  pctType: SelectItem[] = [];
  checkCondition: SelectItem[] = [];
  checkOutlier: SelectItem[] = [];
  severityList: SelectItem[] = [];
  useMad: SelectItem[] = [];
  useTheta:SelectItem[] = [];
  algoType: SelectItem[] = [];
  tolerance: SelectItem[] = [];
  forecastModel: SelectItem[] = [];
  forecastType: SelectItem[] = [];
  ruleConfigPayload: RulePayload;
  tagItems: Tag[];
  updateRleMode: boolean;
  rules: RuleConfig;
  attributes: AttributesConfig;
  severity: Severity;
  condition: Condition;
  criticalCondition: Condition;
  majorCondition: Condition;
  minorCondition: Condition;

  customTimeFrame: Moment[];
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  preset: SelectItem[];
  days: SelectItem[];
  custom: SelectItem[];
  week: SelectItem[];
  weekdays: SelectItem[];
  weekMonthDays: SelectItem[];
  monthList: SelectItem[];
  scheduleConfig: ScheduleConfiguration;

  addedScheduleConfig: any[] = [];
  scheduleType: any = 4;
  updateScheduleMode: boolean;
  indexOfSchedulerSelected: number;

  thresholdType: ThresholdType;
  criticalThreshold: number;
  criticalRecovery: number;
  majorThreshold: number ;
  majorRecovery: number;
  minorThreshold: number;
  minorRecovery: number;

  changeType: ChangeType;
  criticalChangeTypeThreshold: number;
  criticalChangeTypeRecovery: number;
  majorChangeTypeThreshold: number;
  majorChangeTypeRecovery: number;
  minorChangeTypeThreshold: number;
  minorChangeTypeRecovery: number;

  anomalyAndForcastSeverity: number = CRITICAL_SEVERITY;
  anomalyType: AnomalyType;
  outliersType: OutliersType;
  forcastType: ForcastType;

  groupAppanderStr: string;
  indicesMode: number = 0;
  dataTypeListThreshold: SelectItem[];
  dataTypeListAnomaly:SelectItem[];
  operatorListAnomaly: SelectItem[];
  @ViewChild('sevConditionExpId') sevConditionExpId: ElementRef;
  @ViewChild('addActionDialog', { read: AddActionComponent })
  addActionDialog: AddActionComponent;
  isEmailFromRule: boolean;
  isRuleAddReq: boolean;
  defaultEmailForThisRule: String;
  defaultEmailIdForThisRule: number;
  rSeverityLevel: number = 2;
  advance: boolean;
  //for action window
  showAddAction: boolean;
  action: Action = new Action();
  /** This is used to hold alert icon path*/
  imagePath: string;
  //call from active alert
  callFromActiveAlert: boolean = false;
  isAdding: boolean = false;
  @ViewChild('advancedConfig') advancedConfig: AdvancedConfigurationComponent;
  generatedChart: ChartConfig;
  stopCounter: any;
  graphTime: number = 30;
  singleSubMetrics: boolean = false;
  groups: GroupHierarchy;
  tags: Tags[] = [];
  isTagTheRule: boolean = false;
  tagToAdd: string;
  chkStatusTime: number = 15;  
  isOnlyReadable: boolean;
  
  constructor(
    private router: Router,
    public alertConfigService: AlertConfigService,
    public alertRuleService: AlertRulesService,
    private sessionService: SessionService,
    private actionServices: AlertActionService,
    private messageService: MessageService,
    private alertDownloadService: AlertDownloadService,
    private timebarService: TimebarService,
    private alertFilterService: AlertFilterService,
    private cd: ChangeDetectorRef,
    private alertCapability: AlertCapabilityService,
    
    public breadcrumb: BreadcrumbService) {}

  ngOnInit(): void {
    const me = this;
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_RULE);
    me.imagePath = IMAGE_PATH;
    me.generatedChart = METRIC_CHARTS;
    me.generatedChart.highchart.series = [];
    me.generatedChart = { ...this.generatedChart };
    me.actionServices.showActionDialog$.subscribe(visible =>{
      me.showAddAction = visible;
    })
    me.severityPanel = ObjectUtility.duplicate(SEVERITY_PANEL_DUMMY);
    if(!history.state.data){
      me.updateSeverityLevel();
      me.updateActionList();
    }
    me.alertRuleService.isHideProgress = true;
    me.initRuleConfig();
    me.breadcrumb.addNewBreadcrumb({ label: 'Alert Rule Configuration', routerLink: ['/alert-configuration'] });
    /* me.breadcrumb = [
      { label: 'Home', routerLink: ['/home'] },
      { label: 'my-library', routerLink: ['/my-library'] },
      { label: 'Alert', routerLink: ['/my-library/alert'] },
      { label: 'Alert Rules', routerLink: ['/alert-rules'] },
      { label: 'Alert Rule Configuration', routerLink: ['/alert-configuration'] },
    ]; */
    me.algoType = ALGO_TYPE;
    me.tolerance = TOLERANCE;
    me.scheduleTypeList = SCHEDULE_TYPE
    me.ruleConfigPayload = RULE_DATA;
    me.conditionTypeList = CONDITION_TYPE;
    me.dataTypeListThreshold = DATA_TYPE_THRESHOLD;
    me.dataTypeListAnomaly = DATA_TYPE_ANOMALY;
    me.operatorListAnomaly = OPERATOR_ANOMALY;
    me.operatorList = OPERATOR;
    me.changeList = CHANGE;
    me.timeWindowUnitList = TIME_WINDOW_UNIT;
    me.bounds = Bounds;
    me.pctType = PCT_TYPE;
    me.checkCondition = WINDOW_TYPE;
    me.checkOutlier = OUTLIER_WINDOW_TYPE
    me.severityList = Sevrity;
    me.useMad = UseMad;
    me.useTheta = Usetheta;
    me.tolerance = TOLERANCE;
    me.forecastModel = ForecastModel;
    me.forecastType = ForecastType;
    me.metricAttributeList = METRIC_ATTRIBUTE;
    //me.addedGraph =  ADDED_GRAPH;
    me.panel = PANEL_DUMMY;
    me.getGroupList();
    if (history.state.data)
    {
      if (history.state.viewData && history.state.viewData.callFrom == 'ACTIVE_ALERT'){
        me.viewMode = true;
        me.callFromActiveAlert = true;
      }
      me.updateSeverityLevel();
      me.updateActionList()
      me.upDateRuleInEditMode(history.state.data);
    }
    else{
      me.severityPanel.panels[0].state = [];
      me.severityPanel.panels[1].state = [];
      me.severityPanel.panels[2].state = [];
      me.alertRuleService.actionsList = [];
      me.actionName = [];
    }

  }

  updateProgressIntervalforGeneratedChart(idx: number){
    const me = this;
    if (me.stopCounter)
      clearInterval(me.stopCounter);
    me.stopCounter = setInterval(() => {
      me.openGeneratedChart(idx, null);
    }, me.sessionService.session.intervals[0].interval);
  }

  openGeneratedChart(idx: number, graph: any) {
    const me = this;
    if (graph && graph.updateGraph){
      me.closeGraph();
      return;
    }
    let preset = "LIVE2"
    if (me.timebarService.getValue())
      preset = me.timebarService.getValue().timePeriod.selected.id;
    else
      preset = JSON.parse(sessionStorage.getItem('timePresets')).selectedPreset;
    this.alertFilterService.loadTime(preset).subscribe(
      (state: Store.State) => {
        if (state instanceof GlobalTimebarTimeLoadedState) {
          me.openGeneratedChartForPreset(state, idx);
        }
      },
      (state: GlobalTimebarTimeLoadingErrorState) => {
        console.error("Error in auto update", state.error);
      }
    )
  }
  openGeneratedChartForPreset(state: GlobalTimebarTimeLoadedState, idx: number) {
    const me = this;
    const path = environment.api.alert.rule.widgetload.endpoint;
    let graphData = me.addedGraph[idx];

    /* if(graphData.indices == "ALL")
    {
      let hierarchy:string[] = graphData.hierarchy.split(">");
      let tag = ObjectUtility.duplicate(graphData.metric.subject[0].tags[0]);
      graphData.metric.subject[0].tags = [];

      for(let i = 0; i < hierarchy.length; i++)
      {
        tag.key = hierarchy[i];
        graphData.metric.subject[0].tags.push(ObjectUtility.duplicate(tag));
      }
    } */

    //const payloads = GRAPH_REQEST;
    const payload: WidgetLoadReq = {
      multiDc: false,
      tsdbCtx: {
        appId: "Default",
        clientId: "Default",
        avgCount: 0,
        avgCounter: 0,
        cctx: me.sessionService.session.cctx,
        dataFilter: [graphData.attribute.value],
        dataCtx: {
          derivedFlag: -1,
          gCtx: (me.viewMode && history.state.viewData) ? me.getGCtxList(history.state.viewData.metrics[0]) : me.getGCtxList(graphData.metric),
          selfTrend: 0,
          limit: 0
        },
        duration: me.getDuration(state.data),
        opType: 11,
        tr: parseInt(me.sessionService.session.testRun.id, 0),
      },
      actionForAuditLog: null
    }
    me.alertRuleService.genericLoad(false, 11, GenerateChartLoadingState, GenerateChartLoadedState, GenerateChartLoadingErrorState, path, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof GenerateChartLoadedState) {
          me.onLoadedGenerateChart(state, idx);
          return;
        }
      },
      (state: GenerateChartLoadingErrorState) => {
        console.error("Error is coming while Generate Chart ", state.error);
        me.generatedChart.highchart.series = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Chart can not be loaded due to some server side error' });
      });
  }
  getGCtxList(metrics: any): GCtx[] {
    let gCtx: GCtx[] = [];
    try {
      const metric: Metric = metrics;
      metric.subject.forEach(subject => {
        const tmpGCtx: GCtx = {
          measure: metric.measure,
          subject: subject
        }
        gCtx.push(tmpGCtx);
      });
    } catch (error) {
      console.error("Exception is coming inside getGCtx mrthod ", error);
    }
    return gCtx;
  }
  private getDateTimeLabelFormats(): Highcharts.AxisDateTimeLabelFormatsOptions {
    return {
      millisecond: '%H:%M:%S.%L',
      second: '%H:%M:%S',
      minute: '%H:%M',
      hour: '%H:%M',
      day: '%e. %b',
      week: '%e. %b',
      month: "%b '%y",
      year: '%Y',
    };
  }
  onLoadedGenerateChart(state: GenerateChartLoadedState, idx: number) {
    const me = this;
    const xAxis: XAxisOptions = {
      dateTimeLabelFormats: me.getDateTimeLabelFormats(),
      type: 'datetime'
    };

    if (me.viewMode && history.state.viewData) {
      xAxis["plotBands"] = [{
        color: '#EE8C40',
        from: this.sessionService.selectedTimeZone.diffTimeStamp == 0? history.state.viewData.st : this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(history.state.viewData.st),
        to: this.sessionService.selectedTimeZone.diffTimeStamp == 0? history.state.viewData.et : this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(history.state.viewData.et)
      }]
    }

    me.generatedChart.highchart.xAxis = xAxis;
    const time: TimeOptions = {
      useUTC: true,
    }
    let seriesData = me.getSeriesData(state.data, idx);
    me.generatedChart.highchart.time = time;
    me.generatedChart.highchart.series = [...seriesData];
    me.generatedChart = { ...me.generatedChart };
    //console.log("seriesData=== ", me.generatedChart);
    if (!me.viewMode)
      me.updateProgressIntervalforGeneratedChart(idx);
  }

  getSeriesData(data: DashboardWidgetLoadRes, idx: number) {
    const me = this;
    let series = [];
    try {
      if (data && data.grpData && data.grpData.mFrequency && data.grpData.mFrequency.length > 0) {
        for (let i = 0; i < data.grpData.mFrequency.length; i++) {
          let mFrequency = data.grpData.mFrequency[i];
          let tsDetail = mFrequency.tsDetail;
          if (mFrequency.data && mFrequency.data.length > 0) {
            for (let j = 0; j < mFrequency.data.length; j++) {
              let seriesData = mFrequency.data[j];
              let arrData = [];
              if (seriesData && seriesData.avg && seriesData.avg.length > 0) {
                for (let k = 0; k < seriesData.avg.length; k++) {
                  let data = seriesData.avg[k];
                  if (data === -123456789) {
                    arrData.push(0.0);
                  } else {
                    arrData.push(data);
                  }
                }
              }
              if (seriesData && seriesData.min && seriesData.min.length > 0) {
                for (let k = 0; k < seriesData.min.length; k++) {
                  let data = seriesData.min[k];
                  if (data === -123456789) {
                    arrData.push(0.0);
                  }
                  else if (data === -123456789) {
                    arrData.push(0.0);
                  } else {
                    arrData.push(data);
                  }
                }
              }
              if (seriesData && seriesData.max && seriesData.max.length > 0) {
                for (let k = 0; k < seriesData.max.length; k++) {
                  let data = seriesData.max[k];
                  if (data === -123456789) {
                    arrData.push(0.0);
                  } else {
                    arrData.push(data);
                  }
                }
              }
              if (seriesData && seriesData.count && seriesData.count.length > 0) {
                for (let k = 0; k < seriesData.count.length; k++) {
                  let data = seriesData.count[k];
                  if (data === -123456789) {
                    arrData.push(0.0);
                  } else {
                    arrData.push(data);
                  }
                }
              }
              if (idx > 25 || j > 25)
                break;
              let name = me.getSeriesName(seriesData, me.addedGraph[idx].index);
              let seriesObj = {};
              seriesObj['name'] = name,
              seriesObj['color'] = mFrequency.data.length == 1 ? METRIC_COLOR_ARR[idx].color : METRIC_COLOR_ARR[j].color,
              seriesObj['data'] = arrData,
              seriesObj['pointStart'] = this.sessionService.selectedTimeZone.diffTimeStamp == 0? tsDetail.st : this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(tsDetail.st),
              seriesObj['pointInterval'] = tsDetail.frequency * 1000
              series.push(seriesObj);
            }
          }
        }
      }
    } catch (error) {
      console.error("Exception in getSeriesData method...", error);
    }
    return series;
  }

  getSeriesName(seriesData, seriesName: string) {
    let name = "";

    try {
      if (seriesData && seriesData.measure) {
        name = seriesName;

        name = "<b>" + name + ": " + "</b>";
        name = name + seriesData.measure.metric;
        if (seriesData.subject && seriesData.subject.tags && seriesData.subject.tags.length > 0) {
          name = name + " - " + seriesData.subject.tags[0].sName;
        }

      }
    } catch (error) {
      console.error("Exception in getSeriesName method = ", error);
    }
    return name;
  }
  openActionDialog(){
    this.actionServices.showHideDialogue = true;
  }
  closeActionDialog(){
    this.actionServices.showHideDialogue = false;
  }
  updateSeverityLevel() {
    const me = this;
    const path = environment.api.alert.config.all.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
    }
    me.alertDownloadService.load(path, payload).subscribe(
    (state: Store.State) => {
        if (state instanceof DownloadedState) {
        me.onConfigLoaded(state);
        return;
      }
    },
      (state: DownloadingErrorState) => {
      console.error("Error is coming while getting the Config object ", state.error);
    });
  }

  private onConfigLoaded(state: DownloadedState) {
    const me = this;
    if (history.state.viewData) {
      me.graphTime = state.data.config.graphTime;
    }
    if(state.data.config.rSeverityLevel == CRITICAL_SEVERITY) {
      me.anomalyAndForcastSeverity = CRITICAL_SEVERITY;
      me.severityList = [{ label: 'Critical', value: 3 }];
      me.rSeverityLevel = 0;
    }
    else if(state.data.config.rSeverityLevel == MAJOR_SEVERITY){
      me.anomalyAndForcastSeverity = CRITICAL_SEVERITY;
      me.severityList = [{ label: 'Critical', value: 3 },{ label: 'Major', value: 2 }];
      me.rSeverityLevel = 1;
    }
    else if(state.data.config.rSeverityLevel == MINOR_SEVERITY){
      me.anomalyAndForcastSeverity = CRITICAL_SEVERITY;
      me.severityList = Sevrity;
      me.rSeverityLevel = 2;
    }
  }

  updateActionList()
  {
    const me = this;
    me.actionServices.all().subscribe(
      (state: Store.State) => {
        if (state instanceof ActionListLoadingState) {
          me.onActionLoading(state);
          return;
        }

        if (state instanceof ActionListLoadedState) {
          me.onActionLoaded(state);
          return;
        }
      },
      (state: ActionListLoadingErrorState) => {
        me.onActionLoadingError(state);
      }
    )
  }

  upDateRuleInEditMode(data: RuleConfig) {
    const me = this;
    me.updateRleMode = true;
    me.initUpdateRuleConfig(data);
    if (data.attributes.schedule)
      me.openAdvancedConfig(true);

    if(data.attributes.tags.length > 0)
      me.isTagTheRule = true;

    for (let metricIdx = 0; metricIdx < data.attributes.metric.length; metricIdx++) {
      const metric = data.attributes.metric[metricIdx];
      me.indicesMode = metric.mode;
      me.metricAttribute = METRIC_ATTRIBUTE[metric.attribute];
      const maxSize = metric.subject.length - 1;
      gctxIdx:
      for (let gctxIdx = 0; gctxIdx < metric.subject.length; gctxIdx++) {
        const subject = metric.subject[gctxIdx];
        let hierarchicalComponent: string;
        if (gctxIdx > 0)
          me.dataFromSpecifed += ",";
        if (metric.mode == 0 || metric.mode == 1)
          me.tagListFromIndices = [];
        else
          me.tagListFromIndices = subject.tags;
        for (let tagIdx = 0; tagIdx < subject.tags.length; tagIdx++) {
          const tag = subject.tags[tagIdx];
          if (metric.mode == 0) {
            me.indices = 'All';
            if (tagIdx == 0)
              hierarchicalComponent = tag.key;
            else
              hierarchicalComponent += ">" + tag.key;
          }
          else if (metric.mode == 1) {
            me.indices = 'Specified';
            if (tagIdx == 0) {
              hierarchicalComponent = tag.key;
              if (gctxIdx == 0)
                me.dataFromSpecifed = tag.value;
              else
                me.dataFromSpecifed += tag.value;
            }
            else {
              hierarchicalComponent += ">" + tag.key;
              me.dataFromSpecifed += ">" + tag.value;
            }
          }
          else if (metric.mode == 2) {
            me.indices = 'Specified';
            if (tagIdx == 0) {
              hierarchicalComponent = tag.key;
              me.dataFromSpecifed = "PATTERN#";
              if (tag.mode == 1 || tag.mode == 4)
                me.dataFromSpecifed += tag.value;
              else if (tag.mode == 2)
                me.dataFromSpecifed += "*";
            }
            else {
              hierarchicalComponent += ">" + tag.key;
              if (tag.mode == 1 || tag.mode == 4)
                me.dataFromSpecifed += ">" + tag.value;
              else if (tag.mode == 2)
                me.dataFromSpecifed += ">" + "*";
            }
          }
        };
        if (maxSize != gctxIdx)
          continue gctxIdx;
        me.graphName = { 'value': metric.measure.metric, 'metricId': metric.measure.metricId };
        me.groupName = {
          'value': metric.measure.mg,
          'hierarchicalComponent': hierarchicalComponent,
          'mgId': metric.measure.mgId,
          'metricTypeName': metric.measure.mgType
        };
      };
      me.addUpdateMetric(true);
      me.addUpdateHierarchical(false);
    };
    me.severityPanel.panels[0].state = [];
    me.severityPanel.panels[1].state = [];
    me.severityPanel.panels[2].state = [];
    data.attributes.severity.forEach(severity => {
      if (data.attributes.conditionType == 1){
        //me.severityPanel.panels[severity.id == 3 ? 0 : severity.id == 2 ? 1 : 2].state = [];
        me.severityPanel.panels[severity.id == 3 ? 0 : severity.id == 2 ? 1 : 2].severity.condition = null;
        severity.conditionList.forEach(condition => {
          const panel = {
            condition: {
              type: condition.type == CONDITION_TYPE[0].value ? CONDITION_TYPE[0].value : condition.type == CONDITION_TYPE[1].value ? CONDITION_TYPE[1].value : condition.type == CONDITION_TYPE[2].value ? CONDITION_TYPE[2].value : condition.type == CONDITION_TYPE[3].value ? CONDITION_TYPE[3].value : CONDITION_TYPE[4].value,
              mName: condition.mName
            },
          }
          if (condition.type == CONDITION_TYPE[0].value){
            if (condition.thresholdType.frThreshold == -1)
              condition.thresholdType.frThreshold = null;
            panel['thresholdType'] = condition.thresholdType;
          }
          else if (condition.type == CONDITION_TYPE[1].value){
            if (condition.changeType.dataType < DATA_TYPE_THRESHOLD[5].value)
              condition.changeType.pct = null;
            if (condition.changeType.frThreshold == -1)
              condition.changeType.frThreshold = null;
            panel['changeType'] = condition.changeType;
          }
          else if (condition.type == CONDITION_TYPE[2].value){
            if (condition.anomalyType.dataType < DATA_TYPE_THRESHOLD[5].value)
              condition.anomalyType.pct = null;
            panel['anomalyType'] = condition.anomalyType;
          }
          else if (condition.type == CONDITION_TYPE[3].value)
            panel['outliersType'] = condition.outliersType;
          else if (condition.type == CONDITION_TYPE[4].value){
            if (condition.forcastType.dataType < DATA_TYPE_THRESHOLD[5].value)
              condition.forcastType.pct = null;
            if (condition.forcastType.frThreshold == -1)
              condition.forcastType.frThreshold = null;
            panel['forcastType'] = condition.forcastType;
          }
          me.addUpdateMultiCodition(severity.condition, panel, severity.id == 3 ? 0 : severity.id == 2 ? 1 : 2)
        });
      }else{
        me.anomalyAndForcastSeverity = severity.id;
        severity.conditionList.forEach(condition => {
          me.condition = { type: condition.type, mName: condition.mName};
          if (condition.type == CONDITION_TYPE[0].value){
            me.thresholdType = condition.thresholdType;
            if (severity.id == 3){
              me.criticalThreshold = me.thresholdType.fThreshold;
              if (me.thresholdType.frThreshold == -1)
                me.criticalRecovery = null;
              else
                me.criticalRecovery = me.thresholdType.frThreshold;
            }
            else if (severity.id == 2) {
              me.majorThreshold = me.thresholdType.fThreshold;
              if (me.thresholdType.frThreshold == -1)
                me.majorRecovery = null;
              else
                me.majorRecovery = me.thresholdType.frThreshold;
            }
            else if (severity.id == 1) {
              me.minorThreshold = me.thresholdType.fThreshold;
              if (me.thresholdType.frThreshold == -1)
                me.minorRecovery = null;
              else
                me.minorRecovery = me.thresholdType.frThreshold;
            }
          }
          else if (condition.type == CONDITION_TYPE[1].value) {
            me.changeType = condition.changeType;
            if (me.changeType.dataType < DATA_TYPE_THRESHOLD[5].value)
              me.changeType.pct = null;
            if (severity.id == 3) {
              me.criticalChangeTypeThreshold = me.changeType.fThreshold;
              if (me.changeType.frThreshold == -1)
                me.criticalChangeTypeRecovery = null;
              else
                me.criticalChangeTypeRecovery = me.changeType.frThreshold;
            }
            else if (severity.id == 2) {
              me.majorChangeTypeThreshold = me.changeType.fThreshold;
              if (me.changeType.frThreshold == -1)
                me.majorChangeTypeRecovery = null;
              else
                me.majorChangeTypeRecovery = me.changeType.frThreshold;
            }
            else if (severity.id == 1) {
              me.minorChangeTypeThreshold = me.changeType.fThreshold;
              if (me.changeType.frThreshold == -1)
                me.minorChangeTypeRecovery = null;
              else
                me.minorChangeTypeRecovery = me.changeType.frThreshold;
            }
          }
          else if (condition.type == CONDITION_TYPE[2].value) {
            me.anomalyType =  condition.anomalyType;
            if (me.anomalyType.dataType < DATA_TYPE_THRESHOLD[5].value)
              me.anomalyType.pct = null;
          }
          else if (condition.type == CONDITION_TYPE[3].value) {
            me.outliersType = condition.outliersType;
          }
          else if (condition.type == CONDITION_TYPE[4].value) {
            me.forcastType = condition.forcastType;
            if (me.forcastType.frThreshold == -1)
              me.forcastType.frThreshold = null;
            if (me.forcastType.dataType < DATA_TYPE_THRESHOLD[5].value)
              me.forcastType.pct = null;
          }
        })
      }
    });
    me.openGeneratedChart(me.addedGraph.length-1, null);
  }
  initUpdateRuleConfig(data: RuleConfig) {
    const me = this;
    me.rules = {
      name: data.name,
      id: data.id
    }
    me.severity = {
      id: -1,
      condition: null,
      conditionList: []
    }

    me.attributes = {
      enable: data.attributes.enable,
      chkStatus: data.attributes.chkStatus,
      chkStatusTime: data.attributes.chkStatusTime/60,
      level: data.attributes.level,
      conditionType: data.attributes.conditionType,
      groups: data.attributes.groups,
      skipSamples: data.attributes.skipSamples,
      applyRuleAfter: data.attributes.applyRuleAfter,
      genAlertForNaN: data.attributes.genAlertForNaN,
      severity: [],
      actions: [],
      tags: data.attributes.tags,
      metric: data.attributes.metric,
      schedule: data.attributes.schedule,
      mailIds: data.attributes.mailIds,
      extensions: data.attributes.extensions,
      message: data.attributes.message,
      description: data.attributes.description,
      recommendation: data.attributes.recommendation,
      scheduleConfig: data.attributes.scheduleConfig
    }
    me.chkStatusTime = me.attributes.chkStatusTime;
  }

  initRuleConfig() {
    const me = this;
    me.tags = TAGS;
    me.rules =  {
      name: null,
      id: -1
    }
    me.severity = {
      id: -1,
      condition: null,
      conditionList: []
    }
    me.attributes = {
      enable: true,
      chkStatus: true,
      chkStatusTime: 15,
      level: 0,
      conditionType: 0,
      groups: null,
      skipSamples: false,
      applyRuleAfter: 5,
      genAlertForNaN: false,
      severity: [],
      actions: [],
      tags: [],
      metric: [],
      schedule: false,
      mailIds: [],
      extensions: [],
      message: null,
      description: null,
      recommendation: null,
    }
    me.condition = {
      type: 0,
      mName: null
    };
    me.thresholdType = {
      dataType: DATA_TYPE_THRESHOLD[0].value,
      operator: OPERATOR[0].value,
      windowType: WINDOW_TYPE[0].value,
      fThreshold: null,
      sThreshold: null,
      frThreshold: null,
      srThreshold: null,
      pctType: PCT_TYPE[0].value,
      pct: 100,
      timeWindow: 5,
      twUnit: TIME_WINDOW_UNIT[0].value
    }
    me.changeType = {
      dataType: DATA_TYPE_THRESHOLD[0].value,
      operator: OPERATOR[0].value,
      change: CHANGE[0].value,
      fThreshold: null,
      sThreshold: null,
      frThreshold: null,
      srThreshold: null,
      windowType: WINDOW_TYPE[0].value,
      pctType: PCT_TYPE[0].value,
      pct: 100,
      timeWindow: 5,
      twUnit: TIME_WINDOW_UNIT[0].value,
      pastWindow: 5,
      pwUnit: TIME_WINDOW_UNIT[0].value
    }
    me.anomalyType = {
      dataType: DATA_TYPE_ANOMALY[0].value,
      operator: OPERATOR_ANOMALY[0].value,
      windowType: WINDOW_TYPE[1].value,
      timeWindow: 5,
      twUnit: TIME_WINDOW_UNIT[0].value,
      pctType: PCT_TYPE[0].value,
      pct: 100,
      algoType: Usetheta[0].value,
      deviation: 2
    }
    me.outliersType = {
      dataType: DATA_TYPE_ANOMALY[0].value,
      timeWindow: 5,
      pctType: PCT_TYPE[0].value,
      pct: 100,
      twUnit: TIME_WINDOW_UNIT[0].value,
      windowType: OUTLIER_WINDOW_TYPE[0].value,
      algoType: UseMad[0].value,
      tolerance: TOLERANCE[0].value
    }
    me.forcastType = {
      dataType: DATA_TYPE_THRESHOLD[0].value,
      operator: OPERATOR[0].value,
      fThreshold: null,
      sThreshold: null,
      frThreshold: null,
      srThreshold: null,
      timeWindow: 5,
      twUnit: TIME_WINDOW_UNIT[0].value,
      windowType: WINDOW_TYPE[0].value,
      trendWindow: 5,
      trendWindowUnit: TIME_WINDOW_UNIT[0].value,
      pctType: PCT_TYPE[0].value,
      pct: 100,
      forecastModel: ForecastModel[0].value,
      forecastType: ForecastType[0].value
    }

    me.tagItems = [
      {
        name: 'Infra',
        code: 'infra',
        id: 0,
        type: -1
      },
      {
        name: 'Business',
        code: 'business',
        id: 1,
        type: -1
      }
    ]

    me.attributes.actions = [];

    if(!me.attributes.actions.length)
    {
      me.actionName.push({name: "Select Action", code: 'Select Action', id: -1, type: -1});
    }
    me.attributes.actionsEvents = {
      minorToMajor: true,
      minorToCritical: false,
      majorToMinor: true,
      majorToCritical: false,
      criticalToMajor: false,
      criticalToMinor: false,
      forceClear: false,
      continuousEvent: false,
      endedMinor: false,
      endedMajor: false,
      endedCritical: false,
      startedMinor: false,
      startedMajor: false,
      startedCritical: false
    }
  }

  clearTagForRule()
  {
    const me = this;
    if(!me.isTagTheRule)
      me.attributes.tags = [];
  }

  addNewTag()
  {
    const me = this;

    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (!me.tagToAdd || !me.tagToAdd.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Tag name is empty. Provide tag name to Add.' });
      return;
    }

    if (me.tagToAdd.trim().match(format)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Tag name with only special characters are not allowed. Please enter a valid tag name.' });
      return;
    }
    console.log("me.tagToAdd == ", me.tagToAdd)

    me.tags.push({id: me.tags.length, name: me.tagToAdd, type: 1});
    me.tags = [...me.tags];
    me.attributes.tags.push(me.tags[me.tags.length - 1]);
    me.attributes.tags = [...me.attributes.tags];
    me.tagToAdd = "";
  }

  private onLoading(state: RuleDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;

  }

  private onLoadingError(state: RuleDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.isAdding = !me.isAdding;
    me.alertRuleService.progressValue = 100;
    me.alertRuleService.isHideProgress = true;
  }

  private onLoaded(state: RuleDataLoadedState, isCalledFor: boolean) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.data = state.data;
    me.isAdding = !me.isAdding;
    me.initRuleConfig();
    me.alertRuleService.progressValue = 100;
    me.alertRuleService.isHideProgress = true;
    me.router.navigate(['/alert-rules'], { state: { data: state.data, viewData: { callFrom: isCalledFor}}});
  }

  private onActionLoading(state: ActionListLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;

  }

  private onActionLoadingError(state: ActionListLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onActionLoaded(state: ActionListLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    const data: Action[] = state.data.actions;
    me.alertRuleService.actionsList = [];
    me.alertRuleService.extensionsList = [];
    state.data.extensions.forEach(extension => {
      me.alertRuleService.extensionsList.push({ icon: extension.extName, label: extension.displayName, value: extension.extName})
    });

    let i = 0;
    let len = state.data.actions.length;
    while (i < len) {
      if(history.state.data && data[i].name.indexOf(me.rules.name) > -1)
      {
        me.defaultEmailForThisRule = data[i].actions[0].email.receiver;
        me.defaultEmailIdForThisRule = data[i].id;
      }

      me.alertRuleService.actionsList.push({ name: data[i].name, code: data[i].name, id: data[i].id, type: data[i].actions[0].type});
      i++;
    }

    if(!history.state.data)
    {
      //me.alertRuleService.actionsList.unshift({name: "Select Action", code: 'Select Action', id: -1, type: -1});
      me.emailId = "";
      me.isEmailFromRule = true;
    }
    else if(history.state.data && !me.defaultEmailForThisRule)
    {
      //me.isEmailFromRule = true;
      //me.alertRuleService.actionsList.unshift({ name: "Select Action", code: 'Select Action', id: -1, type: -1});
    }
    if(history.state.data)
    {
      me.actionName = [];
      if(history.state.data.attributes.actions && history.state.data.attributes.actions.length == 1 && history.state.data.attributes.actions[0].name.indexOf(history.state.data.name) > -1)
      {
        me.isEmailFromRule = true;
        me.emailId = me.defaultEmailForThisRule;
      }

      history.state.data.attributes.actions.forEach(action => {
        me.actionName.push({ name: action.name, code: action.name, id: action.id, type: action.type });
      });
    }
    me.alertRuleService.actionsList = [...me.alertRuleService.actionsList];
  }

  getGroupList() {
    const me = this;
    const payload = {
      opType: 4,
      cctx: me.sessionService.session.cctx,
      duration: me.getDuration(null),
      tr: this.sessionService.testRun.id,
      clientId: "Default",
      appId: "Default",
      selVector: null
    }

    me.alertConfigService.loadGroupData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof GraphLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof GroupLoadedState) {
          me.onLoadedGroup(state);
          return;
        }
      },
      (state: GroupLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  onLoadedGroup(state: GroupLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.groupList = [];
    let i = 0;
    let len = state.data.group.length;
    while (i < len) {
      let json = state.data.group[i];
      json['label'] = state.data.group[i].groupName;
      json['value'] = state.data.group[i].groupName;
      me.groupList.push(json);
      i++;
    }

    me.alertConfigService.sortByField(me.groupList, "label");
  }

  /**
   * This method is call when user changed the group name.
   */
  changedGroupName(graphName: string) {
    const me = this;
    me.graphList = [];
    const groupNameObject = me.getGroupNameObject(me.groupName.value);
    const payload = {
      opType: 5,
      cctx: me.sessionService.session.cctx,
      duration: me.getDuration(null),
      tr: me.sessionService.session.testRun.id,
      clientId: "Default",
      appId: "Default",
      mgId: groupNameObject.mgId,
      glbMgId: groupNameObject.glbMgId,
      grpName: me.groupName.value
    }
    if (me.groupName) {
      me.alertConfigService.loadGraphData(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof GraphLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof GraphLoadedState) {
            me.onLoadedGraph(state, graphName);
            return;
          }
        },
        (state: GraphLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );

    }
  }

  private onLoadedGraph(state: GraphLoadedState, graphName: string) {
    const me = this;
    me.error = null;
    me.loading = false;
    let i = 0;
    let len = state.data.graph.length;
    while (i < len) {
      const json = state.data.graph[i];
      json['label'] = state.data.graph[i].name;
      json['value'] = state.data.graph[i].name;
      me.graphList.push(json);
      i++;
    }

    me.graphList = [...me.graphList];
    me.alertConfigService.sortByField(me.graphList, "label");
    if (graphName)
      me.graphName = me.getGraphNameObject(graphName);
  }

  /**
   * This is used for find the group name object from the group name list.
   */
  getGroupNameObject(groupName) {
    const me = this;
    try {
        if (me.groupList && me.groupList.length > 1) {
        for (let i = 0; i < me.groupList.length; i++) {
          if (groupName === me.groupList[i].value)
            return me.groupList[i];
        }
      }
    } catch (error) {

    }
  }

  /**
   * This is used for find the group name object from the group name list.
   */
  getGraphNameObject(graphName) {
    const me = this;
    try {
      if (me.graphList && me.graphList.length > 1) {
        for (let i = 0; i < me.graphList.length; i++) {
          if (graphName === me.graphList[i].value) {
            return me.graphList[i];
          }
        }
      }
    } catch (error) {

    }
  }

  /**
   * This method is used for get the duration object from the dashboard component
   */
  getDuration(data: number[]) {
    try {
      const me = this;
      let sTime: number = 0;
      let eTime: number = 0;
      let gTimeKey: string = "";
      if (me.viewMode && history.state.viewData){
        sTime = history.state.viewData.st - (me.graphTime * 60000);
        eTime = history.state.viewData.et + (me.graphTime * 60000) >= data[2] ? data[2] : history.state.viewData.et + (me.graphTime * 60000)
        gTimeKey = "SPECIFIED_TIME_" + sTime + "_" + eTime;
      }
      if (me.timebarService.getValue()){
        const startTime: number = data == null ? me.timebarService.getValue().time.frameStart.value : me.viewMode ? sTime : data[1];
        const endTime: number = data == null ? me.timebarService.getValue().time.frameEnd.value : me.viewMode ? eTime : data[2];
        const graphTimeKey: string = me.viewMode ? gTimeKey : me.timebarService.getValue().timePeriod.selected.id ;
        const viewBy: string = me.timebarService.getValue().viewBy.selected.id;

        const duration = {
          st: startTime,
          et: endTime,
          preset: graphTimeKey,
          viewBy: viewBy
        }
        sessionStorage.setItem('duration', JSON.stringify(duration));
        return duration;
      }else{
        const obj = JSON.parse(sessionStorage.getItem('timePresets'));

        const duration = {
          st: data == null ? obj.times[0] : me.viewMode ? sTime : data[1],
          et: data == null ? obj.times[obj.times.length - 1] : me.viewMode ? eTime : data[2],
          preset: me.viewMode ? gTimeKey : obj.selectedPreset,
          viewBy: obj.selectedViewBy
        }

        return duration;
      }
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
    const me = this;
    if (!me.groupName && !me.updateGraphMode) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the group name.' });
      return;
    }

    if (!me.graphName && !me.updateGraphMode) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the graph name.' });
      return;
    }
    dmIndices.openDerivedIndecesWindowForRule(me.getDuration(null), me.groupName.value, me.groupList);
  }

  getDataFromIndices(data: string, tagList: any[]) {
    const me = this;
    me.dataFromSpecifed = `${data}`;
    if (me.dataFromSpecifed && me.dataFromSpecifed != "" && me.dataFromSpecifed.indexOf("PATTERN#") == -1) {
      let specifiedData = ""
      let arrSpecified: string[] = me.dataFromSpecifed.split(",");
      if (arrSpecified && arrSpecified.length > 0) {
        arrSpecified.sort();
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

  addUpdateGraph()
  {
    const me = this;
    if (!me.groupName && !me.updateGraphMode) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the group name.' });
      return;
    }

    if (!me.graphName && !me.updateGraphMode) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the graph name.' });
      return;
    }

    if (!me.metricAttribute && !me.updateGraphMode) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the Metric Attribute.' });
      return;
    }
    if (me.indices == 'Specified' && !me.dataFromSpecifed) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Specifed indices.' });
      return;
    }
    me.addUpdateMetric(true);
    me.addUpdateHierarchical(false);
  }
  updateRuleMetric() {
    const me = this;
    me.attributes.metric = [];
    me.addedGraph.forEach(graph => {
      graph.metric['name'] = graph.index;
      graph.metric['mode'] = graph.mode;
      /* const metric: Metric = {
        name: graph.index,
        mode: graph.mode,
        measure: graph.metric.measure,
        subject: graph.metric.subject,
        glbMetricId: graph.metric.glbMetricId,
        derivedFormula: graph.metric.derivedFormula
      } */
      /* graph.gctx.forEach(gctxElement => {
        metric.gctx.push(gctxElement);
      }); */
      me.attributes.metric.push(graph.metric);
    });
  }

  addUpdateHierarchical(update: boolean) {
    let me = this;
    let tmp: any[] = me.groupName.hierarchicalComponent.split(">");
    if ((tmp.length - 1) == me.totalHierarchyList.length || (tmp.length - 1) < me.totalHierarchyList.length){
      me.groupName = null;
      me.graphName = null;
      me.metricAttribute = null;
      me.indices = "All";
      return;
    }
    if ((tmp.length - 1) > me.totalHierarchyList.length) {
      me.totalHierarchyList = [];
    }

    tmp.splice(tmp.length - 1, 1);

    let hierarchical: string;
    tmp.forEach((element, idx) => {
      if (idx > 0)
        hierarchical = hierarchical + ">" + element;
      else
        hierarchical = element;
      const hierarchy: GroupHierarchy = {
        label: element,
        value: hierarchical,
        key: idx + ""
      }
      me.totalHierarchyList.push(hierarchy);
    });
    me.totalHierarchyList = [...me.totalHierarchyList];
    me.groupName = null;
    me.graphName = null;
    me.metricAttribute = null;
    me.indices = "All";
    me.groups = me.totalHierarchyList[0];

    
    if(!me.attributes.groups || me.attributes.groups == "")
    {
      me.attributes.groups = me.totalHierarchyList[0].key;
    }
    else
    {
      me.groups = me.totalHierarchyList[Number.parseInt(me.attributes.groups)];
    }
  }
  updateGroup(){
    const me = this;
    me.attributes.groups = me.groups.key;
  }
  addUpdateMetric(isTags: boolean) {
    let me = this;
    let metric: Metric[] = [];
    if (isTags) {
      if (me.indices == 'All') {
        let tagListFromAll: SubjectTags[] = [];
        me.indicesMode = 0;
        let arrHierarchy: string[] = me.groupName.hierarchicalComponent.split(">");

        for(let i = 0; i < arrHierarchy.length; i++)
        {
          const tags: SubjectTags = {
            key: arrHierarchy[i],
            mode: 2,
            value: "ALL"
          }
          tagListFromAll.push(tags);
        }
        
        me.updategctxList(metric, tagListFromAll);
        me.singleSubMetrics = true;
      } else {
        if (me.tagListFromIndices && me.tagListFromIndices.length == 0) {
          me.indicesMode = 1;
          let hierarchicalList: any[] = me.groupName.hierarchicalComponent.split(">");
          let dataFromSpecifedList = me.dataFromSpecifed.split(",");

          if(dataFromSpecifedList.length > 1 && hierarchicalList.length > 1)
              me.singleSubMetrics = true;

          dataFromSpecifedList.forEach(specifed => {
            let specifedList = specifed.split(">");
            let tagListFromAll: SubjectTags[] = [];

            specifedList.forEach((element, idx) => {
              const tags: SubjectTags = {
                key: hierarchicalList[idx].trim(),
                mode: 1,
                value: element.trim()
              }
              tagListFromAll.push(tags);
            });
            me.updategctxList(metric, tagListFromAll);
          });
        } else {
          me.singleSubMetrics = true;
          me.indicesMode = 2;
          me.updategctxList(metric, me.tagListFromIndices);
        }
      }
    } else {
      me.updategctxList(metric, me.tagListFromIndices);
    }
    if (me.addedGraph.length == 0) {
      const metricData = {
        index: METRIC_COLOR_ARR[0].name,
        colorForGraph: METRIC_COLOR_ARR[0].color,
        metricGroup: me.groupName.value,
        metricName: me.graphName.value,
        indices: me.indices == 'All' ? 'ALL' : me.dataFromSpecifed,
        attribute: me.metricAttribute,
        mode: me.indicesMode,
        metric: metric[0],
        hierarchy: me.groupName.hierarchicalComponent,
        updateGraph: false
      }

      me.condition.mName = metricData.index;
      me.severityPanel.panels.forEach(severity => {
        severity.condition.mName = metricData.index;
      });

      me.addedGraph.push(metricData);
      const metrix: SelectItem = {
        label: metricData.index,
        value: metricData.index
      }
      me.metricList.push(metrix);
    }else{
      const lastUsedChar = me.addedGraph[me.addedGraph.length - 1].index;
      const lastCharIdx = me.updateGraphMode ? me.indexOfGraphSelected-1 : METRIC_COLOR_ARR.findIndex(element => element.name === lastUsedChar);
      const metricData = {
        index: METRIC_COLOR_ARR[lastCharIdx+1].name,
        colorForGraph: METRIC_COLOR_ARR[lastCharIdx+1].color,
        metricGroup: me.groupName.value,
        metricName: me.graphName.value,
        indices: me.indices == 'All' ? 'ALL' : me.dataFromSpecifed,
        attribute: me.metricAttribute,
        mode: me.indicesMode,
        metric: metric[0],
        hierarchy: me.groupName.hierarchicalComponent,
        updateGraph: false
      }

      for(let i = 0; i < me.addedGraph.length; i++)
      {
        //console.log("JJJ", MenuItemUtility.deepEqual(me.addedGraph[i], metricData, ['index', 'colorForGraph']), i)
        if(me.updateGraphMode? me.indexOfGraphSelected != i && MenuItemUtility.deepEqual(me.addedGraph[i], metricData, ['index', 'colorForGraph', 'updateGraph']) : MenuItemUtility.deepEqual(me.addedGraph[i], metricData, ['index', 'colorForGraph', 'updateGraph']))
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Same graph is alredy configured for this rule' });
            return;
        }
      }

      if (me.updateGraphMode)
      {
        me.addedGraph[me.indexOfGraphSelected] = metricData;
        me.updateGraphMode = !me.updateGraphMode;
      }
      else{
        me.addedGraph.push(metricData);
        const metrix: SelectItem = {
          label: metricData.index,
          value: metricData.index
        }
        me.metricList.push(metrix);
      }
    }
    me.addedGraph = [...me.addedGraph];
    me.metricList = [...me.metricList];
    
    if (!history.state.data && me.addedGraph.length == 1)
      me.openGeneratedChart(0, null);
  }

  updategctxList(metric: Metric[], tagListFromAll: SubjectTags[]) {
    const me = this;
    const subject: Subject = {
      tags: tagListFromAll
    }
    if (metric.length == 0){
      const measure: Measure = {
        metric: me.graphName.value,
        metricId: me.graphName.metricId,
        mg: me.groupName.value,
        mgId: me.groupName.mgId,
        mgType: me.groupName.metricTypeName,
        mgTypeId: -1
      }
      const tmetric: Metric = {
        subject: [subject],
        measure: measure,
        glbMetricId: null,
        derivedFormula: null,
        attribute: me.metricAttribute.value
      }
      metric.push(tmetric);
    }
    else{
      metric[0].subject.push(subject);
    }
    /* const gctx: Gctx = {
      subject: subject,
      measure: measure,
      glbMetricId: null,
      derivedFormula: null
    }
    gctxList.push(gctx); */
  }

  deleteGraph(idx) 
  {
    const me = this;

    /* if(me.attributes.conditionType == 0)
    {
      if(me.condition.mName == me.addedGraph[idx].index)
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Metric is already used in condition' });
        return;
      }
    } */
    if (me.attributes.conditionType == 1)
    {
      for(let i = 0; i < me.severityPanel.panels.length; i++)
      {
        if(MenuItemUtility.searchByAnyKey(me.addedGraph[idx].index, me.severityPanel.panels[i].state, 'metric'))
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Metric is already used in condition' });
          return;
        }
      }
    }

    const lastIdx = me.metricList.findIndex(element => element.label === me.addedGraph[idx].index);
    me.metricList.splice(lastIdx, 1);
    me.addedGraph.splice(idx, 1);    
    me.singleSubMetrics = false;
    let maxHierarchyLength = 0;
    for(let i = 0; i < me.addedGraph.length; i++)
    {
      let hierachyLen = me.addedGraph[i].hierarchy.split(">").length - 1;
      if(maxHierarchyLength < hierachyLen)
        maxHierarchyLength = hierachyLen;

      if(me.addedGraph[i].mode == 1)
      {
        for(let j = 0; j < me.addedGraph[i].metric.subject.length; i++)
        {
          if(me.addedGraph[i].metric.subject.length > 1 && me.addedGraph[i].metric.subject[0].tags.length > 1)
          {
            me.singleSubMetrics = true;
            break;
          }
        }

        if(me.singleSubMetrics)
          break;
      }
      else
      {
        if(me.addedGraph[i].metric.subject[0].tags.length > 1)
          me.singleSubMetrics = true;

        if(me.singleSubMetrics)
          break;
      }
    }

    if(me.addedGraph.length == 0)
    {
      me.generatedChart.highchart.series = [];
      me.attributes.groups = "";
      me.groups = null;
      me.attributes.level = 0;
      me.graphList = [];
      me.singleSubMetrics = false;
    }
    else
    {
       if(maxHierarchyLength < me.totalHierarchyList.length)
       {
         me.totalHierarchyList.splice(maxHierarchyLength, (me.totalHierarchyList.length - maxHierarchyLength));
         me.totalHierarchyList = [...me.totalHierarchyList];
       }

       if(Number.parseInt(me.attributes.groups) > (maxHierarchyLength - 1) && (maxHierarchyLength - 1) > -1)
       {
         me.attributes.groups = (maxHierarchyLength - 1) + "";
         me.groups = me.totalHierarchyList[maxHierarchyLength - 1];
       }
    }

    if(me.updateGraphMode)
      me.updateGraphMode = !me.updateGraphMode;

    if(!me.singleSubMetrics)
    {
      me.attributes.groups = "";
      me.attributes.level = 0;
      me.groups = null;
    }

    me.groupName = null;
    me.graphName = null;
    me.metricAttribute = METRIC_ATTRIBUTE[0];
    if (me.attributes.conditionType == 0)
      me.condition.mName = null;
    else{
      me.severityPanel.panels.forEach(severity => {
        severity.condition.mName = null;
      });
    }
    me.messageService.add({ severity: 'success', summary: 'Success', detail: 'Selected metric deleted successfully' });
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
        if (graphData.indices == 'ALL')
          me.indices = 'All';
        else
          me.indices = 'Specified';
        me.groupName = me.getGroupNameObject(graphData.metricGroup);
        if (me.groupName)
          me.changedGroupName(graphData.metricName);

          me.metricAttribute = graphData.attribute;
      }
      else {
        //me.resetMetricExpValues();
        me.groupName = null;
        me.graphName = null;
        me.metricAttribute = null;
        me.indices = "All";
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

  selectMultiCodition(panelIdx: number, index: number, coditionData: any) {
    try {
      const me = this;
      me.indexOfCoditionSelected = index;
      me.severityPanel.panels[panelIdx].state[index].updateCodition = !me.severityPanel.panels[panelIdx].state[index].updateCodition;
      me.updateCoditionMode = me.severityPanel.panels[panelIdx].state[index].updateCodition;
      me.severityPanel.panels[panelIdx].updateCodition =  me.severityPanel.panels[panelIdx].state[index].updateCodition;
      if (me.updateCoditionMode) {
        me.severityPanel.panels[panelIdx].condition = {
          type: coditionData.condition.value,
          mName: coditionData.metric
        }
        if (coditionData.condition.value == CONDITION_TYPE[0].value){
          const thresholdType: ThresholdType = {
            dataType: coditionData.dataType.value,
            operator: coditionData.operator.value,
            windowType: coditionData.windowType.value,
            fThreshold: coditionData.fThreshold,
            sThreshold: coditionData.sThreshold,
            frThreshold: coditionData.frThreshold,
            srThreshold: coditionData.srThreshold,
            pctType: coditionData.pctType.value,
            pct: coditionData.pct,
            timeWindow: coditionData.timeWindow,
            twUnit: coditionData.twUnit.value
          }
          me.severityPanel.panels[panelIdx].thresholdType = thresholdType;
        }
        else if (coditionData.condition.value == CONDITION_TYPE[1].value) {
          const changeType: ChangeType = {
            dataType: coditionData.dataType.value,
            operator: coditionData.operator.value,
            change: coditionData.change.value,
            fThreshold: coditionData.fThreshold,
            sThreshold: coditionData.sThreshold,
            frThreshold: coditionData.frThreshold,
            srThreshold: coditionData.srThreshold,
            windowType: coditionData.windowType.value,
            pctType: coditionData.pctType.value,
            pct: coditionData.pct,
            timeWindow: coditionData.timeWindow,
            twUnit: coditionData.twUnit.value,
            pastWindow: coditionData.pastWindow,
            pwUnit: coditionData.pwUnit.value
          }
          me.severityPanel.panels[panelIdx].changeType = changeType;
        }
        else if (coditionData.condition.value == CONDITION_TYPE[2].value) {
          const anomalyType: AnomalyType = {
            dataType: coditionData.dataType.value,
            operator: coditionData.operator.value,
            windowType: coditionData.windowType.value,
            timeWindow: coditionData.timeWindow,
            twUnit: coditionData.twUnit.value,
            pctType: coditionData.pctType.value,
            pct: coditionData.pct,
            algoType: coditionData.algoType.value,
            deviation: coditionData.deviation
          }
          me.severityPanel.panels[panelIdx].anomalyType = anomalyType;
        }
        else if (coditionData.condition.value == CONDITION_TYPE[3].value) {
          const outliersType: OutliersType = {
            dataType: coditionData.dataType.value,
            timeWindow: coditionData.timeWindow,
            twUnit: coditionData.twUnit.value,
            pctType: coditionData.pctType.value,
            pct: coditionData.pct,
            windowType: coditionData.windowType.value,
            algoType: coditionData.algoType.value,
            tolerance: coditionData.tolerance
          }
          me.severityPanel.panels[panelIdx].outliersType = outliersType;
        }
        else if (coditionData.condition.value == CONDITION_TYPE[4].value) {
          const forcastType: ForcastType = {
            dataType: coditionData.dataType.value,
            operator: coditionData.operator.value,
            fThreshold: coditionData.fThreshold,
            sThreshold: coditionData.sThreshold,
            frThreshold: coditionData.frThreshold,
            srThreshold: coditionData.srThreshold,
            timeWindow: coditionData.timeWindow,
            twUnit: coditionData.twUnit.value,
            windowType: coditionData.windowType.value,
            trendWindow: coditionData.trendWindow,
            trendWindowUnit: coditionData.trendWindowUnit.value,
            pctType: coditionData.pctType.value,
            pct: coditionData.pct,
            forecastModel: coditionData.forecastModel.value,
            forecastType: coditionData.forecastType.value
          }
          me.severityPanel.panels[panelIdx].forcastType = forcastType;
        }
      }
      else {
        me.resetMultiCodition(panelIdx);
      }

      let i = 0;
      while (i < me.severityPanel.panels[panelIdx].state.length) {
        if (me.severityPanel.panels[panelIdx].state[i].updateCodition && i != index) {
          me.severityPanel.panels[panelIdx].state[i].updateCodition = false;
        }
        i++;
      }
    } catch (error) {
      console.error("Exception in selectGraph method = ", error);
    }
  }

  resetMultiCodition(panelIdx: number) {
    const me = this;
    me.severityPanel.panels[panelIdx].condition.mName = me.addedGraph[0].index;
    const type = me.severityPanel.panels[panelIdx].condition.type;
    if (type == CONDITION_TYPE[0].value) {
      const thresholdType: ThresholdType = {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        windowType: WINDOW_TYPE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value
      }
      me.severityPanel.panels[panelIdx].thresholdType = thresholdType;
    }
    else if (type == CONDITION_TYPE[1].value) {
      const changeType: ChangeType = {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        change: CHANGE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        windowType: WINDOW_TYPE[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pastWindow: 5,
        pwUnit: TIME_WINDOW_UNIT[0].value
      }
      me.severityPanel.panels[panelIdx].changeType = changeType;
    }
    else if (type == CONDITION_TYPE[2].value) {
      const anomalyType: AnomalyType = {
        dataType: DATA_TYPE_ANOMALY[0].value,
        operator: OPERATOR_ANOMALY[0].value,
        windowType: WINDOW_TYPE[1].value,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        algoType: Usetheta[0].value,
        deviation: 2
      }
      me.severityPanel.panels[panelIdx].anomalyType = anomalyType;
    }
    else if (type == CONDITION_TYPE[3].value) {
      const outliersType: OutliersType = {
        dataType: DATA_TYPE_ANOMALY[0].value,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        algoType: UseMad[0].value,
        tolerance: TOLERANCE[0].value
      }
      me.severityPanel.panels[panelIdx].outliersType = outliersType;
    }
    else if (type == CONDITION_TYPE[4].value) {
      const forcastType: ForcastType = {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        trendWindow: 5,
        trendWindowUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        forecastModel: ForecastModel[0].value,
        forecastType: ForecastType[0].value
      }
      me.severityPanel.panels[panelIdx].forcastType = forcastType;
    }
  }

  addUpdateMultiCodition(sevExp: string, panel: any, panelIdx: number){
    const me = this;
    me.severityPanel.panels[panelIdx].collapsed = false;
    const tmpCondition: Condition  = {};
    if (panel.condition.type == 0) {
      if (!panel.condition.mName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name to add condition.' });
        return;
      }
      if (!panel.thresholdType.timeWindow || panel.thresholdType.timeWindow < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid timeWindow to add condition.' });
        return;
      }
      if (!panel.thresholdType.fThreshold || panel.thresholdType.fThreshold < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid threshold to add condition.' });
        return;
      }
      if (panel.thresholdType.dataType == DATA_TYPE_THRESHOLD[5].value){
        if (!panel.thresholdType.pct || panel.thresholdType.pct < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
          return;
        }
      }
      tmpCondition.type = 0;
      tmpCondition.thresholdType = ObjectUtility.duplicate(panel.thresholdType);
      if (!tmpCondition.thresholdType.sThreshold)
        tmpCondition.thresholdType.sThreshold = -1;
      if (!tmpCondition.thresholdType.frThreshold)
        tmpCondition.thresholdType.frThreshold = -1;
      if (!tmpCondition.thresholdType.srThreshold)
        tmpCondition.thresholdType.srThreshold = -1;
      if (!tmpCondition.thresholdType.pct)
        tmpCondition.thresholdType.pct = -1;
      if (!tmpCondition.thresholdType.timeWindow)
        tmpCondition.thresholdType.timeWindow = -1;
    }
    else if (panel.condition.type == 1) {
      if (!panel.condition.mName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name to add condition.' });
        return;
      }
      if (!panel.changeType.timeWindow || panel.changeType.timeWindow < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid timeWindow to add condition.' });
        return;
      }
      if (!panel.changeType.fThreshold || panel.changeType.fThreshold < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid threshold to add condition.' });
        return;
      }
      if (!panel.changeType.pastWindow || panel.changeType.pastWindow < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide compare time window to add condition.' });
        return;
      }
      if (panel.changeType.dataType == DATA_TYPE_THRESHOLD[5].value) {
        if (!panel.changeType.pct || panel.changeType.pct < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
          return;
        }
      }
      tmpCondition.type = 1;
      tmpCondition.changeType = ObjectUtility.duplicate(panel.changeType);
      if (!tmpCondition.changeType.sThreshold)
        tmpCondition.changeType.sThreshold = -1;
      if (!tmpCondition.changeType.frThreshold)
        tmpCondition.changeType.frThreshold = -1;
      if (!tmpCondition.changeType.srThreshold)
        tmpCondition.changeType.srThreshold = -1;
      if (!tmpCondition.changeType.pct)
        tmpCondition.changeType.pct = -1;
      if (!tmpCondition.changeType.timeWindow)
        tmpCondition.changeType.timeWindow = -1;
      if (!tmpCondition.changeType.pastWindow)
        tmpCondition.changeType.pastWindow = -1;
    }
    else if (panel.condition.type == 2) {
      if (!panel.condition.mName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name to add condition.' });
        return;
      }
      if (!panel.anomalyType.timeWindow) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide anomaly time window to add condition.' });
        return;
      }
      if (!panel.anomalyType.deviation) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide anomaly deviation to add condition.' });
        return;
      }
      if (panel.anomalyType.dataType == DATA_TYPE_THRESHOLD[5].value) {
        if (!panel.anomalyType.pct || panel.anomalyType.pct < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
          return;
        }
      }
      tmpCondition.type = 2;
      tmpCondition.anomalyType = ObjectUtility.duplicate(panel.anomalyType);
      if (!tmpCondition.anomalyType.timeWindow)
        tmpCondition.anomalyType.timeWindow = -1;
      if (!tmpCondition.anomalyType.pct)
        tmpCondition.anomalyType.pct = -1;
      if (!tmpCondition.anomalyType.deviation)
        tmpCondition.anomalyType.deviation = -1;
    }
    else if (panel.condition.type == 3) {
      if (!panel.condition.mName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name to add condition.' });
        return;
      }
      if (!panel.outliersType.timeWindow) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide outliers time window to add condition.' });
        return;
      }
      tmpCondition.type = 3;
      tmpCondition.outliersType = ObjectUtility.duplicate(panel.outliersType);
      if (!tmpCondition.outliersType.timeWindow)
        tmpCondition.outliersType.timeWindow = -1;
    }
    else if (panel.condition.type == 4) {
      if (!panel.forcastType.fThreshold || panel.forcastType.fThreshold < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid threshold to add condition.' });
        return;
      }
      if (!panel.condition.mName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name to add condition.' });
        return;
      }
      if (!panel.forcastType.timeWindow) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide forcast time window to add condition.' });
        return;
      }
      if (!panel.forcastType.trendWindow) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide forcast trend window to add condition.' });
        return;
      }
      if (panel.forcastType.dataType == DATA_TYPE_THRESHOLD[5].value) {
        if (!panel.forcastType.pct || panel.forcastType.pct < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
          return;
        }
      }
      tmpCondition.type = 4;
      tmpCondition.forcastType = ObjectUtility.duplicate(panel.forcastType);
      if (!tmpCondition.forcastType.sThreshold)
        tmpCondition.forcastType.sThreshold = -1;
      if (!tmpCondition.forcastType.frThreshold)
        tmpCondition.forcastType.frThreshold = -1;
      if (!tmpCondition.forcastType.srThreshold)
        tmpCondition.forcastType.srThreshold = -1;
      if (!tmpCondition.forcastType.timeWindow)
        tmpCondition.forcastType.timeWindow = -1;
      if (!tmpCondition.forcastType.trendWindow)
        tmpCondition.forcastType.trendWindow = -1;
      if (!tmpCondition.forcastType.pct)
        tmpCondition.forcastType.pct = -1;
    }
    let graphName = "";
    me.addedGraph.forEach(graph => {
      if (graph.index === panel.condition.mName)
        graphName = graph.metricName;
    });
    var metricData;
    if (me.severityPanel.panels[panelIdx].state.length == 0) {
      metricData = {
        index: COLOR_ARR[0].name,
        colorForGraph: COLOR_ARR[0].color,
        condition: CONDITION_TYPE[panel.condition.type],
        metricName: graphName,
        metric: panel.condition.mName,
        dataType: panel.condition.type == 0 ? DATA_TYPE_THRESHOLD[panel.thresholdType.dataType] : panel.condition.type == 1 ? DATA_TYPE_THRESHOLD[panel.changeType.dataType] : panel.condition.type == 2 ? DATA_TYPE_THRESHOLD[panel.anomalyType.dataType] : panel.condition.type == 3 ? DATA_TYPE_THRESHOLD[panel.outliersType.dataType] : DATA_TYPE_THRESHOLD[panel.forcastType.dataType],
        operator: panel.condition.type == 0 ? OPERATOR[panel.thresholdType.operator] : panel.condition.type == 1 ? OPERATOR[panel.changeType.operator] : panel.condition.type == 2 ? OPERATOR_ANOMALY[panel.anomalyType.operator == 0 ? 0 : panel.anomalyType.operator == 2 ? 1 : 2] : panel.condition.type == 4 ? OPERATOR[panel.forcastType.operator] : { label: '', value: -1 },
        change: panel.condition.type == 1 ? CHANGE[panel.changeType.change] : { label: '', value: -1 },
        pastWindow: panel.condition.type == 1 ? panel.changeType.pastWindow : -1,
        pwUnit: panel.condition.type == 1 ? TIME_WINDOW_UNIT[panel.changeType.pwUnit] : { label: '', value: -1 },
        windowType: panel.condition.type == 0 ? WINDOW_TYPE[panel.thresholdType.windowType] : panel.condition.type == 1 ? WINDOW_TYPE[panel.changeType.windowType] : panel.condition.type == 2 ? WINDOW_TYPE[panel.anomalyType.windowType] : panel.condition.type == 3 ? WINDOW_TYPE[panel.outliersType.windowType] : WINDOW_TYPE[panel.forcastType.windowType],
        fThreshold: panel.condition.type == 0 ? panel.thresholdType.fThreshold : panel.condition.type == 1 ? panel.changeType.fThreshold : panel.condition.type == 4 ? panel.forcastType.fThreshold : -1,
        frThreshold: panel.condition.type == 0 ? panel.thresholdType.frThreshold : panel.condition.type == 1 ? panel.changeType.frThreshold : panel.condition.type == 4 ? panel.forcastType.frThreshold : -1,
        pctType: panel.condition.type == 0 ? PCT_TYPE[panel.thresholdType.pctType] : panel.condition.type == 1 ? PCT_TYPE[panel.changeType.pctType] : panel.condition.type == 2 ? PCT_TYPE[panel.anomalyType.pctType] : panel.condition.type == 3 ? PCT_TYPE[panel.outliersType.pctType] : PCT_TYPE[panel.forcastType.pctType],
        pct: panel.condition.type == 0 ? panel.thresholdType.pct : panel.condition.type == 1 ? panel.changeType.pct : panel.condition.type == 2 ? panel.anomalyType.pct : panel.condition.type == 3 ? panel.outliersType.pct : panel.forcastType.pct,
        timeWindow: panel.condition.type == 0 ? panel.thresholdType.timeWindow : panel.condition.type == 1 ? panel.changeType.timeWindow : panel.condition.type == 2 ? panel.anomalyType.timeWindow : panel.condition.type == 3 ? panel.outliersType.timeWindow : panel.forcastType.timeWindow,
        twUnit: panel.condition.type == 0 ? TIME_WINDOW_UNIT[panel.thresholdType.twUnit] : panel.condition.type == 1 ? TIME_WINDOW_UNIT[panel.changeType.twUnit] : panel.condition.type == 2 ? TIME_WINDOW_UNIT[panel.anomalyType.twUnit] : panel.condition.type == 3 ? TIME_WINDOW_UNIT[panel.outliersType.twUnit] : TIME_WINDOW_UNIT[panel.forcastType.twUnit],
        algoType: panel.condition.type == 2 ? Usetheta[panel.anomalyType.algoType] : panel.condition.type == 3 ? UseMad[panel.outliersType.algoType] : { label: '', value: -1 },
        deviation: panel.condition.type == 2 ? panel.anomalyType.deviation : -1,
        tolerance: panel.condition.type == 3 ? panel.outliersType.tolerance: -1,
        trendWindow: panel.condition.type == 4 ? panel.forcastType.trendWindow : -1,
        trendWindowUnit: panel.condition.type == 4 ? TIME_WINDOW_UNIT[panel.forcastType.trendWindowUnit] : { label: '', value: -1 },
        forecastModel: panel.condition.type == 4 ? ForecastModel[panel.forcastType.forecastModel] : { label: '', value: -1 },
        forecastType: panel.condition.type == 4 ? ForecastType[panel.forcastType.forecastType] : { label: '', value: -1 }
      }
      if (sevExp)
      {
        me.severityPanel.panels[panelIdx].severity.condition = sevExp.split(" ");
      }
      else
      {
        me.severityPanel.panels[panelIdx].severity.condition = [];
        me.severityPanel.panels[panelIdx].severity.condition.push(COLOR_ARR[0].name);
      }
      //me.severityPanel.panels[panelIdx].state.push(metricData);
    } else {
        metricData = {
        index: COLOR_ARR[me.updateCoditionMode ? me.indexOfCoditionSelected : me.severityPanel.panels[panelIdx].state.length].name,
        colorForGraph: COLOR_ARR[me.updateCoditionMode ? me.indexOfCoditionSelected : me.severityPanel.panels[panelIdx].state.length].color,
        condition: CONDITION_TYPE[panel.condition.type],
        metricName: graphName,
        metric: panel.condition.mName,
        dataType: panel.condition.type == 0 ? DATA_TYPE_THRESHOLD[panel.thresholdType.dataType] : panel.condition.type == 1 ? DATA_TYPE_THRESHOLD[panel.changeType.dataType] : panel.condition.type == 2 ? DATA_TYPE_THRESHOLD[panel.anomalyType.dataType] : panel.condition.type == 3 ? DATA_TYPE_THRESHOLD[panel.outliersType.dataType] : DATA_TYPE_THRESHOLD[panel.forcastType.dataType],
        operator: panel.condition.type == 0 ? OPERATOR[panel.thresholdType.operator] : panel.condition.type == 1 ? OPERATOR[panel.changeType.operator] : panel.condition.type == 2 ? OPERATOR_ANOMALY[panel.anomalyType.operator == 0 ? 0 : panel.anomalyType.operator == 2 ? 1 : 2] : panel.condition.type == 4 ? OPERATOR[panel.forcastType.operator] : { label: '', value: -1 },
        change: panel.condition.type == 1 ? CHANGE[panel.changeType.change] : { label: '', value: -1 },
        pastWindow: panel.condition.type == 1 ? panel.changeType.pastWindow : -1,
        pwUnit: panel.condition.type == 1 ? TIME_WINDOW_UNIT[panel.changeType.pwUnit] : { label: '', value: -1 },
        windowType: panel.condition.type == 0 ? WINDOW_TYPE[panel.thresholdType.windowType] : panel.condition.type == 1 ? WINDOW_TYPE[panel.changeType.windowType] : panel.condition.type == 2 ? WINDOW_TYPE[panel.anomalyType.windowType] : panel.condition.type == 3 ? WINDOW_TYPE[panel.outliersType.windowType] : WINDOW_TYPE[panel.forcastType.windowType],
        fThreshold: panel.condition.type == 0 ? panel.thresholdType.fThreshold : panel.condition.type == 1 ? panel.changeType.fThreshold : panel.condition.type == 4 ? panel.forcastType.fThreshold : -1,
        frThreshold: panel.condition.type == 0 ? panel.thresholdType.frThreshold : panel.condition.type == 1 ? panel.changeType.frThreshold : panel.condition.type == 4 ? panel.forcastType.frThreshold : -1,
        pctType: panel.condition.type == 0 ? PCT_TYPE[panel.thresholdType.pctType] : panel.condition.type == 1 ? PCT_TYPE[panel.changeType.pctType] : panel.condition.type == 2 ? PCT_TYPE[panel.anomalyType.pctType] : panel.condition.type == 3 ? PCT_TYPE[panel.outliersType.pctType] : PCT_TYPE[panel.forcastType.pctType],
        pct: panel.condition.type == 0 ? panel.thresholdType.pct : panel.condition.type == 1 ? panel.changeType.pct : panel.condition.type == 2 ? panel.anomalyType.pct : panel.condition.type == 3 ? panel.outliersType.pct : panel.forcastType.pct,
        timeWindow: panel.condition.type == 0 ? panel.thresholdType.timeWindow : panel.condition.type == 1 ? panel.changeType.timeWindow : panel.condition.type == 2 ? panel.anomalyType.timeWindow : panel.condition.type == 3 ? panel.outliersType.timeWindow : panel.forcastType.timeWindow,
        twUnit: panel.condition.type == 0 ? TIME_WINDOW_UNIT[panel.thresholdType.twUnit] : panel.condition.type == 1 ? TIME_WINDOW_UNIT[panel.changeType.twUnit] : panel.condition.type == 2 ? TIME_WINDOW_UNIT[panel.anomalyType.twUnit] : panel.condition.type == 3 ? TIME_WINDOW_UNIT[panel.outliersType.twUnit] : TIME_WINDOW_UNIT[panel.forcastType.twUnit],
        algoType: panel.condition.type == 2 ? Usetheta[panel.anomalyType.algoType] : panel.condition.type == 3 ? UseMad[panel.outliersType.algoType] : { label: '', value: -1 },
        deviation: panel.condition.type == 2 ? panel.anomalyType.deviation : -1,
        tolerance: panel.condition.type == 3 ? panel.outliersType.tolerance : -1,
        trendWindow: panel.condition.type == 4 ? panel.forcastType.trendWindow : -1,
        trendWindowUnit: panel.condition.type == 4 ? TIME_WINDOW_UNIT[panel.forcastType.trendWindowUnit] : { label: '', value: -1 },
        forecastModel: panel.condition.type == 4 ? ForecastModel[panel.forcastType.forecastModel] : { label: '', value: -1 },
        forecastType: panel.condition.type == 4 ? ForecastType[panel.forcastType.forecastType] : { label: '', value: -1 }
      }
    }
    if (me.updateCoditionMode)
      tmpCondition.id = me.indexOfCoditionSelected;
    else
      tmpCondition.id = me.severityPanel.panels[panelIdx].state.length - 1;

    tmpCondition.name = metricData.index;
    tmpCondition.mName = panel.condition.mName;
    if (panelIdx == 0){
      let isSevFound = -1;
      me.attributes.severity.forEach((severity,idx) => {
        if (severity.id == 3)
          isSevFound = idx;
      });

      if (isSevFound != -1){

        for(let i = 0; i < me.attributes.severity[isSevFound].conditionList.length; i++)
        {
          if(me.updateCoditionMode? me.attributes.severity[isSevFound].conditionList[i].id != me.indexOfCoditionSelected && MenuItemUtility.deepEqual(me.attributes.severity[isSevFound].conditionList[i], tmpCondition, ["id", "name"]) : MenuItemUtility.deepEqual(me.attributes.severity[isSevFound].conditionList[i], tmpCondition, ["id", "name"]))
          {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Same condition configuration is already added for this severity' });
              return;
          }
        }

        if (me.updateCoditionMode)
        {
          me.attributes.severity[isSevFound].conditionList[me.indexOfCoditionSelected] = ObjectUtility.duplicate(tmpCondition);
        }
        else{
          me.attributes.severity[isSevFound].condition = me.severityPanel.panels[panelIdx].severity.condition;
          me.attributes.severity[isSevFound].conditionList.push(ObjectUtility.duplicate(tmpCondition));
        }
      }else{
        const tmpSeverity: Severity = {
          id: 3,
          condition: me.severityPanel.panels[panelIdx].severity.condition,
          conditionList: [ObjectUtility.duplicate(tmpCondition)]
        }
        me.attributes.severity.push(ObjectUtility.duplicate(tmpSeverity));
      }
    }
    else if (panelIdx == 1) {
      let isSevFound = -1;
      me.attributes.severity.forEach((severity, idx) => {
        if (severity.id == 2)
          isSevFound = idx;
      });

      if (isSevFound != -1) {
        for(let i = 0; i < me.attributes.severity[isSevFound].conditionList.length; i++)
        {
          if(me.updateCoditionMode? me.attributes.severity[isSevFound].conditionList[i].id != me.indexOfCoditionSelected && MenuItemUtility.deepEqual(me.attributes.severity[isSevFound].conditionList[i], tmpCondition, ["id", "name"]) : MenuItemUtility.deepEqual(me.attributes.severity[isSevFound].conditionList[i], tmpCondition, ["id", "name"]))
          {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Same condition configuration is already added for this severity' });
              return;
          }
        }
        if (me.updateCoditionMode)
          me.attributes.severity[isSevFound].conditionList[me.indexOfCoditionSelected] = ObjectUtility.duplicate(tmpCondition);
        else {
          me.attributes.severity[isSevFound].condition = me.severityPanel.panels[panelIdx].severity.condition;
          me.attributes.severity[isSevFound].conditionList.push(ObjectUtility.duplicate(tmpCondition));
        }
      } else {
        const tmpSeverity: Severity = {
          id: 2,
          condition: me.severityPanel.panels[panelIdx].severity.condition,
          conditionList: [ObjectUtility.duplicate(tmpCondition)]
        }
        me.attributes.severity.push(ObjectUtility.duplicate(tmpSeverity));
      }
    }
    else if (panelIdx == 2) {
      let isSevFound = -1;
      me.attributes.severity.forEach((severity, idx) => {
        if (severity.id == 1)
          isSevFound = idx;
      });

      if (isSevFound != -1) {
        for(let i = 0; i < me.attributes.severity[isSevFound].conditionList.length; i++)
        {
          if(me.updateCoditionMode? me.attributes.severity[isSevFound].conditionList[i].id != me.indexOfCoditionSelected && MenuItemUtility.deepEqual(me.attributes.severity[isSevFound].conditionList[i], tmpCondition, ["id", "name"]) : MenuItemUtility.deepEqual(me.attributes.severity[isSevFound].conditionList[i], tmpCondition, ["id", "name"]))
          {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Same condition configuration is already added for this severity' });
              return;
          }
        }
        if (me.updateCoditionMode)
          me.attributes.severity[isSevFound].conditionList[me.indexOfCoditionSelected] = ObjectUtility.duplicate(tmpCondition);
        else {
          me.attributes.severity[isSevFound].condition = me.severityPanel.panels[panelIdx].severity.condition;
          me.attributes.severity[isSevFound].conditionList.push(ObjectUtility.duplicate(tmpCondition));
        }
      } else {
        const tmpSeverity: Severity = {
          id: 1,
          condition: me.severityPanel.panels[panelIdx].severity.condition,
          conditionList: [ObjectUtility.duplicate(tmpCondition)]
        }
        me.attributes.severity.push(ObjectUtility.duplicate(tmpSeverity));
      }
    }

    if (me.severityPanel.panels[panelIdx].state.length == 0)
      me.severityPanel.panels[panelIdx].state.push(metricData);
    else
    {
      if (me.updateCoditionMode)
      me.severityPanel.panels[panelIdx].state[me.indexOfCoditionSelected] = metricData;
      else{
        if (!sevExp)
        {
          if(isOperationType(me.severityPanel.panels[panelIdx].severity.condition[me.severityPanel.panels[panelIdx].severity.condition.length - 1]))
            me.severityPanel.panels[panelIdx].severity.condition.push(metricData.index);
          else
          {
            me.severityPanel.panels[panelIdx].severity.condition.push("||");
            me.severityPanel.panels[panelIdx].severity.condition.push(metricData.index);
          }
          //me.severityPanel.panels[panelIdx].severity.condition += " || " + metricData.index;
        }
        me.severityPanel.panels[panelIdx].state.push(metricData);
      }
    }

    if (me.updateCoditionMode)
      me.updateCoditionMode = !me.updateCoditionMode;
    
    if(me.severityPanel.panels[panelIdx].updateCodition)
      me.severityPanel.panels[panelIdx].updateCodition = !me.severityPanel.panels[panelIdx].updateCodition;

    me.resetMultiCodition(panelIdx);
  }

  clearConditionExp(panelIdx: number)
  {
    const me = this;
    me.severityPanel.panels[panelIdx].severity.condition = [];
  }

  deleteMultiCondition(panelIdx: number, condIdx: number){
    const me = this;
    const maxSize = me.severityPanel.panels[panelIdx].state.length;
    let condname = me.severityPanel.panels[panelIdx].state[condIdx].index;
    let conExp = me.severityPanel.panels[panelIdx].severity.condition;
    /* let idx = conExp.indexOf(condname);

    me.severityPanel.panels[panelIdx].severity.condition.splice(idx, 1);

    me.severityPanel.panels[panelIdx].severity.condition = [...me.severityPanel.panels[panelIdx].severity.condition];
    console.log("conExp == ", me.severityPanel.panels[panelIdx].severity.condition, " , idx == ", idx); */
    /* let res;
    if (idx == 0)
      res = postFix;
    else
      res = conExp.splice(0, (idx - 3)) + postFix;
    me.severityPanel.panels[panelIdx].severity.condition = res; */
    me.severityPanel.panels[panelIdx].state.splice(condIdx, 1);
    me.attributes.severity.forEach((severity, idx) => {
      if (severity.id == 3 && panelIdx == 0)
      {
        severity.conditionList.splice(condIdx, 1);

        if(severity.conditionList.length == 0)
          me.attributes.severity.splice(idx, 1);
      }
      else if (severity.id == 2 && panelIdx == 1)
      {
        severity.conditionList.splice(condIdx, 1);

        if(severity.conditionList.length == 0)
          me.attributes.severity.splice(idx, 1);
      }
      else if (severity.id == 1 && panelIdx == 2)
      {
        severity.conditionList.splice(condIdx, 1);

        if(severity.conditionList.length == 0)
          me.attributes.severity.splice(idx, 1);
      }
    });
    for (let i = 0; i < me.severityPanel.panels[panelIdx].state.length; i++) {
      me.severityPanel.panels[panelIdx].state[i]['index'] = COLOR_ARR[i].name;
      me.severityPanel.panels[panelIdx].state[i]['colorForGraph'] = COLOR_ARR[i].color;
      me.attributes.severity[panelIdx].conditionList.forEach(condition => {
        condition.id = i;
        condition.name = COLOR_ARR[i].name;
      })
    }
  }

  sortById(items: any) {
    items.sort(function (a, b) {
      return b.id - a.id
    });
  }

  applyRules(){
    const me = this;
    let isCalledFor: boolean;
    if(!me.isAdding){
    me.isAdding = !me.isAdding;
    if (me.actionName){
      me.attributes.actions = [];
        me.actionName.forEach(element => {
          const action: Actions = {
            id: element.id,
            name: element.name,
            type: element.type
          }
          me.attributes.actions.push(action);
        });
      }
    me.attributes.chkStatusTime = me.chkStatusTime;
    me.rules.attributes = me.attributes;
    me.rules.attributes.chkStatusTime = me.rules.attributes.chkStatusTime * 60;
    me.sortById(me.rules.attributes.severity);
    me.updateRuleMetric();
    let opType: number;
    if (me.updateRleMode)
      opType = PAYLOAD_TYPE.UPDATE_RULE;
    else
      opType = PAYLOAD_TYPE.ADD_RULE;
    const payload: RulePayload = {
      cctx: me.sessionService.session.cctx,
      opType: opType,
      clientId: "-1",
      appId: "-1",
      rules: [me.rules]
    }

    if(!history.state.data)
      me.alertRuleService.showProgressBar("Going to Add New Rule. Please wait...");
    else{
      isCalledFor = true;
      me.alertRuleService.showProgressBar("Going to Update Rule. Please wait...");
    }

    me.alertConfigService.load(payload, me.updateRleMode).subscribe(
      (state: Store.State) => {
        if (state instanceof RuleDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof RuleDataLoadedState) {
          me.onLoaded(state, isCalledFor);
          return;
        }
      },
      (state: RuleDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
}

  applyRuleWithAction()
  {
    const me = this;

    let specialCharsForName = "|\\,";
    let specialCharsForOther = "|";
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    let mailformat = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
    if (!me.rules.name || !me.rules.name.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule name is empty. Provide rule name to Add.' });
      return;
    }

    if (me.rules.name.trim().match(format)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule name with only special characters are not allowed. Please enter a valid rule name.' });
      return;
    }

    var addEditRuleData: any = MenuItemUtility.searchByAnyKey(me.rules.name, me.alertRuleService.data.data, 'ruleName');
    if(history.state.data? (addEditRuleData && Number.parseInt(addEditRuleData.ruleId) != me.rules.id) : addEditRuleData)
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Already a rule present with this rule name. Please, enter a different rule name'});
      return;
    }

    if (specialCharsForName.length != 0) {
      for (let i = 0; i < specialCharsForName.length; i++) {
        if (me.rules.name.trim().indexOf(specialCharsForName[i]) > -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'These Charactars \\ , | and , are not allowed in rule name. Please enter a valid rule name.' });
          return;
        }
      }
    }

    if (me.rules.name.trim().length > 63) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule Name should contain less then equal to 63 character. Please enter a valid Rule Name.' });
      return;
    }

    if (me.addedGraph.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add at least one metric to add rule.' });
      return;
    }
    if (me.attributes.conditionType == 0) {
      if (me.condition.type == 0) {
        if (!me.criticalThreshold && !me.majorThreshold && !me.minorThreshold) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide atleast one threshold in condition to add rule.' });
          return;
        }
        if (!me.condition.mName) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name in condition to add rule.' });
          return;
        }
        me.attributes.severity = [];
        if (me.criticalThreshold) {
          me.severity.conditionList = [];
          me.thresholdType.fThreshold = me.criticalThreshold;
          me.thresholdType.frThreshold = me.criticalRecovery;
          me.condition.thresholdType = ObjectUtility.duplicate(me.thresholdType);
          if (!me.condition.thresholdType.fThreshold)
            me.condition.thresholdType.fThreshold = -1;
          if (!me.condition.thresholdType.sThreshold)
            me.condition.thresholdType.sThreshold = -1;
          if (!me.condition.thresholdType.frThreshold)
            me.condition.thresholdType.frThreshold = -1;
          if (!me.condition.thresholdType.srThreshold)
            me.condition.thresholdType.srThreshold = -1;
          if (!me.condition.thresholdType.pct)
            me.condition.thresholdType.pct = -1;
          if (!me.condition.thresholdType.timeWindow)
            me.condition.thresholdType.timeWindow = -1;
          me.condition.id = 0;
          me.condition.name = COLOR_ARR[0].name;
          me.severity.id = CRITICAL_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }
        if (me.majorThreshold) {
          me.severity.conditionList = [];
          me.thresholdType.fThreshold = me.majorThreshold;
          me.thresholdType.frThreshold = me.majorRecovery;
          me.condition.thresholdType = ObjectUtility.duplicate(me.thresholdType);
          if (!me.condition.thresholdType.fThreshold)
            me.condition.thresholdType.fThreshold = -1;
          if (!me.condition.thresholdType.sThreshold)
            me.condition.thresholdType.sThreshold = -1;
          if (!me.condition.thresholdType.frThreshold)
            me.condition.thresholdType.frThreshold = -1;
          if (!me.condition.thresholdType.srThreshold)
            me.condition.thresholdType.srThreshold = -1;
          if (!me.condition.thresholdType.pct)
            me.condition.thresholdType.pct = -1;
          if (!me.condition.thresholdType.timeWindow)
            me.condition.thresholdType.timeWindow = -1;
          me.condition.id = 0;
          me.condition.name = COLOR_ARR[0].name;
          me.severity.id = MAJOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }

        if (me.minorThreshold) {
          me.severity.conditionList = [];
          me.thresholdType.fThreshold = me.minorThreshold;
          me.thresholdType.frThreshold = me.minorRecovery;
          me.condition.thresholdType = ObjectUtility.duplicate(me.thresholdType);
          if (!me.condition.thresholdType.fThreshold)
            me.condition.thresholdType.fThreshold = -1;
          if (!me.condition.thresholdType.sThreshold)
            me.condition.thresholdType.sThreshold = -1;
          if (!me.condition.thresholdType.frThreshold)
            me.condition.thresholdType.frThreshold = -1;
          if (!me.condition.thresholdType.srThreshold)
            me.condition.thresholdType.srThreshold = -1;
          if (!me.condition.thresholdType.pct)
            me.condition.thresholdType.pct = -1;
          if (!me.condition.thresholdType.timeWindow)
            me.condition.thresholdType.timeWindow = -1;
          me.condition.id = 0;
          me.condition.name = COLOR_ARR[0].name;
          me.severity.id = MINOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }

      }
      else if (me.condition.type == 1) {
        if (!me.criticalChangeTypeThreshold && !me.majorChangeTypeThreshold && !me.minorChangeTypeThreshold) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide atleast one threshold in condition to add rule.' });
          return;
        }
        if (!me.condition.mName) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name in condition to add rule.' });
          return;
        }
        if (!me.changeType.timeWindow || me.changeType.timeWindow < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide time window in condition to add rule.' });
          return;
        }
        if (!me.changeType.pastWindow || me.changeType.pastWindow < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide past window in condition to add rule.' });
          return;
        }
        if (me.changeType.dataType == DATA_TYPE_THRESHOLD[5].value) {
          if (!me.changeType.pct || me.changeType.pct < 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
            return;
          }
        }
        me.attributes.severity = [];
        if (me.criticalChangeTypeThreshold) {
          me.severity.conditionList = [];
          me.changeType.fThreshold = me.criticalChangeTypeThreshold;
          me.changeType.frThreshold = me.criticalChangeTypeRecovery;
          me.condition.changeType = ObjectUtility.duplicate(me.changeType);
          if (!me.condition.changeType.fThreshold)
            me.condition.changeType.fThreshold = -1;
          if (!me.condition.changeType.sThreshold)
            me.condition.changeType.sThreshold = -1;
          if (!me.condition.changeType.frThreshold)
            me.condition.changeType.frThreshold = -1;
          if (!me.condition.changeType.srThreshold)
            me.condition.changeType.srThreshold = -1;
          if (!me.condition.changeType.pct)
            me.condition.changeType.pct = -1;
          if (!me.condition.changeType.timeWindow)
            me.condition.changeType.timeWindow = -1;
          me.condition.id = 0;
          me.condition.name = COLOR_ARR[0].name;
          me.severity.id = CRITICAL_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));

        }
        if (me.majorChangeTypeThreshold) {
          me.severity.conditionList = [];
          me.changeType.fThreshold = me.majorChangeTypeThreshold;
          me.changeType.frThreshold = me.majorChangeTypeRecovery;
          me.condition.changeType = ObjectUtility.duplicate(me.changeType);
          if (!me.condition.changeType.fThreshold)
            me.condition.changeType.fThreshold = -1;
          if (!me.condition.changeType.sThreshold)
            me.condition.changeType.sThreshold = -1;
          if (!me.condition.changeType.frThreshold)
            me.condition.changeType.frThreshold = -1;
          if (!me.condition.changeType.srThreshold)
            me.condition.changeType.srThreshold = -1;
          if (!me.condition.changeType.pct)
            me.condition.changeType.pct = -1;
          if (!me.condition.changeType.timeWindow)
            me.condition.changeType.timeWindow = -1;
          me.condition.id = 0;
          me.condition.name = COLOR_ARR[0].name;
          me.severity.id = MAJOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }

        if (me.minorChangeTypeThreshold) {
          me.severity.conditionList = [];
          me.changeType.fThreshold = me.minorChangeTypeThreshold;
          me.changeType.frThreshold = me.minorChangeTypeRecovery;
          me.condition.changeType = ObjectUtility.duplicate(me.changeType);
          if (!me.condition.changeType.fThreshold)
            me.condition.changeType.fThreshold = -1;
          if (!me.condition.changeType.sThreshold)
            me.condition.changeType.sThreshold = -1;
          if (!me.condition.changeType.frThreshold)
            me.condition.changeType.frThreshold = -1;
          if (!me.condition.changeType.srThreshold)
            me.condition.changeType.srThreshold = -1;
          if (!me.condition.changeType.pct)
            me.condition.changeType.pct = -1;
          if (!me.condition.changeType.timeWindow)
            me.condition.changeType.timeWindow = -1;
          me.condition.id = 0;
          me.condition.name = COLOR_ARR[0].name;
          me.severity.id = MINOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }
      }
      else if (me.condition.type == 2) {
        if (!me.condition.mName) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name in condition to add rule.' });
          return;
        }
        if (!me.anomalyType.timeWindow || me.anomalyType.timeWindow < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide time window in condition to add rule.' });
          return;
        }
        if (!me.anomalyType.deviation || me.anomalyType.deviation < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide deviation in condition to add rule.' });
          return;
        }
        if (me.anomalyType.dataType == DATA_TYPE_THRESHOLD[5].value) {
          if (!me.anomalyType.pct || me.anomalyType.pct < 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
            return;
          }
        }
        me.attributes.severity = [];
        me.severity.conditionList = [];
        me.condition.id = 0;
        me.condition.name = COLOR_ARR[0].name;
        me.condition.anomalyType = me.anomalyType;
        if (me.anomalyAndForcastSeverity == CRITICAL_SEVERITY)
          me.severity.id = CRITICAL_SEVERITY;
        else if (me.anomalyAndForcastSeverity == MAJOR_SEVERITY)
          me.severity.id = MAJOR_SEVERITY;
        else if (me.anomalyAndForcastSeverity == MINOR_SEVERITY)
          me.severity.id = MINOR_SEVERITY;
        me.severity.condition = COLOR_ARR[0].name;
        me.severity.conditionList.push(me.condition);
        me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
      }
      else if (me.condition.type == 3){
        if (!me.condition.mName) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name in condition to add rule.' });
          return;
        }
        if (!me.outliersType.timeWindow || me.outliersType.timeWindow < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide time window in condition to add rule.' });
          return;
        }
        if (me.outliersType.dataType == DATA_TYPE_THRESHOLD[5].value) {
          if (!me.outliersType.pct || me.outliersType.pct < 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
            return;
          }
        }
        me.attributes.severity = [];
        me.condition.id = 0;
        me.condition.name = COLOR_ARR[0].name;
        me.condition.outliersType = me.outliersType;

        if (me.anomalyAndForcastSeverity == CRITICAL_SEVERITY)
          me.severity.id = CRITICAL_SEVERITY;
        else if (me.anomalyAndForcastSeverity == MAJOR_SEVERITY)
          me.severity.id = MAJOR_SEVERITY;
        else if (me.anomalyAndForcastSeverity == MINOR_SEVERITY)
          me.severity.id = MINOR_SEVERITY;

        if (me.condition.outliersType.dataType < 5)
          me.condition.outliersType.pct = -1;

        me.severity.conditionList = [];
        //me.severity.id = CRITICAL_SEVERITY;
        me.severity.condition = COLOR_ARR[0].name;
        me.severity.conditionList.push(me.condition);
        me.attributes.severity.push(ObjectUtility.duplicate(me.severity));

        /* if (me.rSeverityLevel == 0){
          me.severity.conditionList = [];
          //me.severity.id = CRITICAL_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }
        else if (me.rSeverityLevel == 1) {
          me.severity.conditionList = [];
          //me.severity.id = CRITICAL_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
          me.severity.conditionList = [];
          //me.severity.id = MAJOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        }
        else if (me.rSeverityLevel == 2) {
          me.severity.conditionList = [];
          //me.severity.id = CRITICAL_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
          me.severity.conditionList = [];
          //me.severity.id = MAJOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
          me.severity.conditionList = [];
          //me.severity.id = MINOR_SEVERITY;
          me.severity.condition = COLOR_ARR[0].name;
          me.severity.conditionList.push(me.condition);
          me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
        } */
      }
      else if (me.condition.type == 4) {
        if (!me.forcastType.fThreshold) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide atleast one threshold in condition to add rule.' });
          return;
        }
        if (!me.condition.mName) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric name in condition to add rule.' });
          return;
        }
        if (!me.forcastType.timeWindow || me.forcastType.timeWindow < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide time window in condition to add rule.' });
          return;
        }
        if (!me.forcastType.trendWindow || me.forcastType.trendWindow < 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide trend window in condition to add rule.' });
          return;
        }
        if (me.forcastType.dataType == DATA_TYPE_THRESHOLD[5].value) {
          if (!me.forcastType.pct || me.forcastType.pct < 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid % Samples to add condition.' });
            return;
          }
        }
        me.attributes.severity = [];
        me.severity.conditionList = [];
        me.condition.id = 0;
        me.condition.name = COLOR_ARR[0].name;
        me.condition.forcastType = me.forcastType;
        if (!me.condition.forcastType.fThreshold)
          me.condition.forcastType.fThreshold = -1;
        if (!me.condition.forcastType.sThreshold)
          me.condition.forcastType.sThreshold = -1;
        if (!me.condition.forcastType.frThreshold)
          me.condition.forcastType.frThreshold = -1;
        if (!me.condition.forcastType.srThreshold)
          me.condition.forcastType.srThreshold = -1;
        if (me.condition.forcastType.dataType < 5)
          me.condition.forcastType.pct = -1;
        if (me.anomalyAndForcastSeverity == CRITICAL_SEVERITY)
          me.severity.id = CRITICAL_SEVERITY;
        else if (me.anomalyAndForcastSeverity == MAJOR_SEVERITY)
          me.severity.id = MAJOR_SEVERITY;
        else if (me.anomalyAndForcastSeverity == MINOR_SEVERITY)
          me.severity.id = MINOR_SEVERITY;
        me.severity.condition = COLOR_ARR[0].name;
        me.severity.conditionList.push(me.condition);
        me.attributes.severity.push(ObjectUtility.duplicate(me.severity));
      }
    }
    else {
      if (me.severityPanel.panels[0].state.length == 0 && me.severityPanel.panels[1].state.length == 0 && me.severityPanel.panels[2].state.length == 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide atleast one condition per rule.' });
        return;
      }

      for(let i = 0; i < me.attributes.severity.length; i++)
      {
        let severity: Severity = me.attributes.severity[i];
        if(!me.validateConditionExpression(me.severityPanel.panels[findPanelIndex(severity.id)].severity.condition, findSeverity(severity.id), severity.conditionList))
          return;

        severity.condition = me.makeConditionExpression(me.severityPanel.panels[findPanelIndex(severity.id)].severity.condition);
      }
    }

    if (!me.actionName && !me.emailId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Notify via Actions or Enter Email' });
      return;
    }

    if (me.emailId && !me.emailId.match(mailformat)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter valid email id in email receiver.' });
      return;
    }

    /* if (specialCharsForOther.length != 0) {
        for (let i = 0; i < specialCharsForOther.length; i++) {
          if (me.attributes.message.indexOf(specialCharsForOther[i]) > -1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Character ' |' is not allowed in Alert message. Please enter a valid message." });
            return;
          }
          else if (me.attributes.description.indexOf(specialCharsForOther[i]) > -1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Character '|' is not allowed in Alert Description. Please enter a valid Description" });
            return;
          }
          else if (me.attributes.recommendation.indexOf(specialCharsForOther[i]) > -1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Character '|' is not allowed in recommendation. Please enter a valid recommendation" });
            return;
          }
        }
      } */

    if((me.actionName.length == 1 && me.actionName[0].id == -1 && me.emailId != "") || (!me.defaultEmailForThisRule && me.emailId != "") || (me.emailId != "" && me.emailId != me.defaultEmailForThisRule))
    {
      me.isRuleAddReq = true
      if(!me.defaultEmailForThisRule)
      {
        me.addActionDialog.action.name = me.rules.name + '_Email';
        me.addActionDialog.action.id = -1;
      }
      else
      {
        me.addActionDialog.action.name = me.actionName[0].name;
        me.addActionDialog.action.id = me.actionName[0].id;
      }


      const email: Email = {
        receiver: me.emailId,
        postText: '',
        preText: '',
        subject: ''
      }

      me.addActionDialog.action.actions[0].email = email;
      //me.addActionDialog.addEmailConf(email);
      if(!me.defaultEmailForThisRule)
        me.addActionDialog.actionApply();
      else
        me.addActionDialog.actionUpdated();
    }
    else
      me.applyRules();
  }

  updateActionTable(event: any)
  {
    const me = this;
    me.alertRuleService.actionsList.push({ name: event.name, code: event.name, id: event.id, type: event.type});

    if(!(me.emailId == null ||  me.emailId == undefined || me.emailId == "")
    || (me.actionName.length == 1 && me.actionName[0].id == -1)
    || !(me.rules.name.indexOf(event.name) > -1))
    {
      me.actionName = [];
      if(!(event.name.indexOf(me.rules.name) > -1))
      {
        me.emailId = "";
        me.isEmailFromRule = false;
      }
    }

    me.actionName.push({ name: event.name, code: event.name, id: event.id, type: event.type });
    me.actionName = [...me.actionName];
    me.alertRuleService.actionsList = [...me.alertRuleService.actionsList];

    if(me.isRuleAddReq)
      me.applyRules();

      me.isRuleAddReq = false;
  }

  /* groupAppander() {
    let me = this;
    me.groupAppanderStr = "";

    console.log("me.totalHierarchyList == ", me.totalHierarchyList);

    me.totalHierarchyList.forEach(element => {
      if(element.label == me.attributes.groups)
      {
        if(me.groupAppanderStr == "")
          me.groupAppanderStr = me.groupAppanderStr + me.attributes.groups;
        else
          me.groupAppanderStr = me.groupAppanderStr + ">" + me.attributes.groups;

        return;
      }

      if(me.groupAppanderStr == "")
          me.groupAppanderStr = me.groupAppanderStr + me.attributes.groups;
      else
        me.groupAppanderStr = me.groupAppanderStr + ">" + me.attributes.groups;
    });
  } */

  onActionNameChange(event: any){
    const me = this;

    if(event.itemValue.id == -1)
    {
      if(me.actionName.length > 0)
      {
        me.actionName = [];
        me.actionName.push(event.itemValue);
        me.emailId = "";
        me.isEmailFromRule = true;
      }
      else
        return;
    }

    if(me.actionName.length == 1 && event.itemValue.name.indexOf(me.rules.name) > -1)
    {
      me.isEmailFromRule = true;
      me.emailId = me.defaultEmailForThisRule;
      return;
    }
    else if(me.actionName.length > 1)
    {
      if(event.itemValue.name.indexOf(me.rules.name) > -1)
      {
        me.actionName = [];
        me.actionName.push(event.itemValue);
        me.isEmailFromRule = true;
        me.emailId = me.defaultEmailForThisRule;
      }
      else if(MenuItemUtility.searchById(-1, me.actionName) == null)
      {
        if(me.emailId != "" || MenuItemUtility.searchById(me.defaultEmailIdForThisRule, me.actionName))
          me.actionName = [];
        else
          return;

        me.actionName.push(event.itemValue);
        me.emailId = "";
        me.isEmailFromRule = false;
      }
      else if(MenuItemUtility.searchById(-1, me.actionName) != null)
      {
        me.actionName = [];
        me.actionName.push(event.itemValue);
        me.emailId = "";
        me.isEmailFromRule = false;
      }
    }
    else
    {
      me.emailId = "";
      me.isEmailFromRule = false;
    }
  }

  onChangeForcast(event: any, isRecovery: boolean){
    const me = this;
    if (isRecovery){
      if(event.value == OPERATOR[0].value || event.value == OPERATOR[2].value)
        me.forcastType.operator = OPERATOR[1].value;
      else
        me.forcastType.operator = OPERATOR[0].value;
    }
    else {
      /* if(event.value == OPERATOR[0].value || event.value == OPERATOR[2].value)
        me.forcastType.recovery.operator = OPERATOR[1].value;
      else
        me.forcastType.recovery.operator = OPERATOR[0].value; */
    }
  }

  onChangeSeverityForcast(forcastType: any, isRecovery: boolean) {
    const me = this;
    if (isRecovery) {
      if (forcastType.recovery.operator == OPERATOR[0].value || forcastType.recovery.operator == OPERATOR[2].value)
        forcastType.operator = OPERATOR[1].value;
      else
        forcastType.operator = OPERATOR[0].value;
    }
    else {
      if (forcastType.operator == OPERATOR[0].value || forcastType.operator == OPERATOR[2].value)
        forcastType.recovery.operator = OPERATOR[1].value;
      else
        forcastType.recovery.operator = OPERATOR[0].value;
    }
  }

  openAdvancedConfig(isOpen){
    const me = this;
    if (isOpen){
      setTimeout(() => {
        me.advancedConfig.open(me.attributes.schedule, me.attributes.scheduleConfig, MODULE.ALERT_RULE);
      }, 2000);
    }
    else
      me.advancedConfig.open(me.attributes.schedule, me.attributes.scheduleConfig, MODULE.ALERT_RULE);
  }

  setAdvaceConfigration(isAdd: boolean, idx: number, schedule: ScheduleConfig) {
    const me = this;
    if (!me.attributes.scheduleConfig || me.attributes.scheduleConfig.length == 0)
      me.attributes.scheduleConfig = [];
    if (isAdd)
      me.attributes.scheduleConfig.push(schedule);
    else{
      if (schedule)
        me.attributes.scheduleConfig[idx] = schedule;
      else
        me.attributes.scheduleConfig.splice(idx, 1);
    }
  }

  updateExtensions(data: any) {
    const me = this;
    if (data.opType == ACTION_OPERATONS.ADD_ACTIONS) {
      data.actions.forEach(action => {
        me.alertRuleService.actionsList.push({ name: action.name, code: action.name, id: action.id, type: action.actions[0].type });
      });
      me.alertRuleService.actionsList = [...me.alertRuleService.actionsList];
    }
    else {
      me.alertRuleService.actionsList.forEach((element, index) => {
        if (element.id == data.actions[0].id) {
          me.alertRuleService.actionsList[index] = data.actions[0];
        }
      });
      me.alertRuleService.actionsList = [...me.alertRuleService.actionsList];
    }
  }
  mailAdd(event: any){
    let mailformat = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
    if(!event.value.trim().match(mailformat)){
      this.attributes.mailIds.pop();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter a valid e-mail id' });
    }
  }

  closeGraph(){
    const me = this;
    me.generatedChart.highchart.series = [];
    clearInterval(me.stopCounter);
  }

  addCondInConditionExp(panelIdx: number, condition: string)
  {
    const me = this;

    if(me.severityPanel.panels[panelIdx].severity.condition)
      me.severityPanel.panels[panelIdx].severity.condition.push(condition);
    else
    {
      me.severityPanel.panels[panelIdx].severity.condition = [];
      me.severityPanel.panels[panelIdx].severity.condition.push(condition);
    }
  }

  addOperatorInConditionExp(panelIdx: number, operator: string){
    const me = this;
    if(me.severityPanel.panels[panelIdx].severity.condition)
      me.severityPanel.panels[panelIdx].severity.condition.push(operator);
    else
    {
      me.severityPanel.panels[panelIdx].severity.condition = [];
      me.severityPanel.panels[panelIdx].severity.condition.push(operator);
    }
    /* me.severityPanel.panels[panelIdx].severity.condition = me.severityPanel.panels[panelIdx].severity.condition.split('');
    me.severityPanel.panels[panelIdx].severity.condition.splice(oField.selectionStart, 0, " " + operator);
    const conditionExp = me.severityPanel.panels[panelIdx].severity.condition.join('');
    me.sevConditionExpId.nativeElement.selectionStart = me.sevConditionExpId.nativeElement.selectionEnd = conditionExp.length;
    (me.sevConditionExpId.nativeElement as any)['focus'].apply(me.sevConditionExpId.nativeElement);
    me.severityPanel.panels[panelIdx].severity.condition = conditionExp; */
  }

  /* keyCheck(event: any, panelIdx: number, oField)
  {
    const me = this;
    const conditionExp = me.severityPanel.panels[panelIdx].severity.condition;
    console.log("event == ", event.keyCode, document.getSelection());
    console.log("oField.selectionStart == ", oField.selectionStart, oField)
    console.log("single char == ", conditionExp.substring(oField.selectionStart -1, oField.selectionStart));

    //oField.selectionStart = oField.selectionEnd = conditionExp.length;
    (oField as any)['focus'].apply(oField);

    if(event.keyCode == 8)
    {
      let deleteStPos = oField.selectionStart;
      let charToDelete = conditionExp.substring(oField.selectionStart -1, oField.selectionStart);

      while(charToDelete != " " && charToDelete != "" && charToDelete)
      {
        conditionExp.slice(deleteStPos, 1);
        --deleteStPos;
        charToDelete = conditionExp.substring(deleteStPos -1, deleteStPos);
      }

      oField.selectionStart = deleteStPos;
    }
  } */

  /* getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == '0') {
       console.log("oField.selectionStart == ", oField.selectionStart)
    }
  } */

  makeConditionExpression(conditionExp: string[])
  {
    let conExp = "";
    conditionExp.forEach(exp => {
      if(conExp == "")
        conExp = exp;
      else
        conExp = conExp + " " + exp;
    });

    console.log("conditionExp == ", conditionExp, ", conExp = ", conExp);

    return conExp;
  }

  validateConditionExpression(conditionExp: string[], serityBlo: string, condList: Condition[])
  {
    const me = this;
    let countRParanthis = 0;
    let countLParanthis = 0;

    for(let idx = 0; idx < conditionExp.length; idx++)
    {
      let exp = conditionExp[idx];
      if((idx < conditionExp.length - 1) && isOperatorType(exp) && isOperatorType(conditionExp[idx + 1]))
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Multiple operator cannot be placed togather for ' + serityBlo + " severity expression" });
        return false;
      }

      if((idx <= conditionExp.length - 1) && isConditionnType(exp) && (conditionExp[idx + 1]? isConditionnType(conditionExp[idx + 1]): false))
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Multiple condition cannot be placed togather for ' + serityBlo + " severity expression" });
        return false;
      }

      if((idx < conditionExp.length - 1) && isRightParathisisType(exp) && isLeftParathisisType(conditionExp[idx + 1]))
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Left and right parenthesis cannot be placed togather for ' + serityBlo + " severity expression" });
        return false;
      }

      if((idx == 0) && (isRightParathisisType(exp) || isOperatorType(exp)))
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Right parenthesis or operators cannot be placed at first index for ' + serityBlo + " severity expression" });
        return false;
      }

      if((idx == (conditionExp.length - 1)) && (isLeftParathisisType(exp) || isOperatorType(exp)))
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Left parenthesis or operators cannot be placed at last index for ' + serityBlo + " severity expression" });
        return false;
      }

      if(idx > 0 && idx < conditionExp.length - 1 && (isRightParathisisType(exp) || isLeftParathisisType(exp)))
      {
        if(isOperatorType(conditionExp[idx - 1]) && isOperatorType(conditionExp[idx + 1]))
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operator cannot be placed either side of parenthesis  for ' + serityBlo + " severity expression" });
          return false;
        }

        if(isConditionnType(conditionExp[idx - 1]) && isConditionnType(conditionExp[idx + 1]))
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Condtion cannot be placed either side of parenthesis for ' + serityBlo + " severity expression" });
          return false;
        }
      }

      if(isConditionnType(exp))
      {
        var isConditionPresent: any = MenuItemUtility.searchByAnyKey(exp, condList, 'name');
        if(!isConditionPresent)
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Condition '" + exp + "' in expression is not present in " + serityBlo + " severity condition list"});
          return false;
        }
      }

      if(isRightParathisisType(exp))
        countRParanthis++;

      if(isLeftParathisisType(exp))
        countLParanthis++;
    }

    if(countRParanthis != countLParanthis)
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Number of right parenthesis should be equal to left parenthesis for ' + serityBlo + " severity expression" });
      return false;
    }

    return true;
  }

  /**destroying a component */
  ngOnDestroy() {
    try {
      clearInterval(this.stopCounter);
    } catch (error) {
      console.log('error in unsubscribe', error);
    }
  }
}

function findPanelIndex(id: number) {
  return id == 3? 0 : id == 2? 1: 2;
}

function findSeverity(id: number) {
  return id == 3? 'Critical' : id == 2? 'Major' : 'Minor';
}

function isOperationType(operator: string)
{
  return operator == '&&'? true : operator == '||'? true :
         operator == '('? true : operator == ')'? true : false;
}

function isOperatorType(operator: string)
{
  return operator == '&&'? true : operator == '||'? true : false;
}

function isConditionnType(operator: string)
{
  return operator == '&&'? false : operator == '||'? false :
         operator == '('? false : operator == ')'? false : true;
}

function isRightParathisisType(operator: string)
{
  return operator == ')'? true : false;
}

function isLeftParathisisType(operator: string)
{
  return operator == '('? true : false;
}

