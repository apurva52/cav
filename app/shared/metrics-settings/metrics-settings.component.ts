import {
  Component, Input, OnInit, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef,
  HostBinding, QueryList, ElementRef, OnDestroy
} from '@angular/core';
import { MenuItem } from 'primeng';
import { HelpRelatedmetricsComponent } from '../metrics/relatedmetrics/helprelatedmetrics/helprelatedmetrics.component';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { METRICS_SETTINGS_DUMMY } from './service/metrics-settings.dummy';
import { AppError } from 'src/app/core/error/error.model';
import { MetricsTable, status } from './service/metrics-settings.model';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardTime, DashboardGroupWidgetConfig, DashboardWidget, DashboardDataCTXDataFilter, DashboardDataCTX, DashboardGraphs, GraphDataCTXSubject, DashboardGraphDataCTX, DashboardWidgetGraph, DashboardGraphData, GraphData, DashboardGlobalRule } from '../dashboard/service/dashboard.model';
import { MetricsSettingsService } from './service/metrics-settings.service';
import { MetricsLoadingState, MetricsLoadingErrorState, MetricsLoadedState } from './service/metrics-settings.state'
import { Store } from 'src/app/core/store/store';
import { ColorPicker } from 'primeng/colorpicker';
import { DashboardGraphService } from '../dashboard/service/dashboard-graph.service';
import { DashboardWidgetLayout } from '../dashboard/service/dashboard.model'
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DashboardWidgetComponent } from '../dashboard/widget/dashboard-widget.component';
import { DashboardWidgetLoadingState, DashboardWidgetLoadedState, DashboardWidgetLoadingErrorState } from '../dashboard/service/dashboard.state';
import { TreeOperationsService } from '../../shared/dashboard/sidebars/show-graph-in-tree/service/tree-operations.service';
import { Subject } from 'rxjs';
import * as Highcharts from 'highcharts';
import { charts } from 'highcharts';
@Component({
  selector: 'app-metrics-settings',
  templateUrl: './metrics-settings.component.html',
  styleUrls: ['./metrics-settings.component.scss'],
  encapsulation: ViewEncapsulation.None

})



export class MetricsSettingsComponent extends PageDialogComponent implements OnInit, OnDestroy {

  @HostBinding('class') class = '';
  @ViewChild(HelpRelatedmetricsComponent, { read: HelpRelatedmetricsComponent })
  private helpMetrics: HelpRelatedmetricsComponent;

  @Input() dashboard: DashboardComponent;
  @ViewChild('colorpicker') colorpicker: ColorPicker;
  dashboardCom: DashboardComponent;
  error: AppError;
  dataWidget: DashboardGraphData[] = [];

  output = new Subject<Store.State>();
  empty: boolean;
  loading: boolean;
  noData: boolean = true;
  breadcrumb: MenuItem[];
  metricTypes: MenuItem[];
  metricType: string = "advanced";
  featureName: string = "Advance open/merge";
  metricData;
  previewData;
  data;
  chartArr: Highcharts.Options[] = [];
  openWithNewLayout: boolean = true;
  disableopenWithNewLayout: boolean = true;
  forPreview: boolean = false;
  excOverallMetric: boolean = true;
  enableGraphLevel: boolean = false;
  showGraphTogether: boolean = false;
  mergeMetric: boolean = false;
  showTogether: number;
  advancevalue: SelectItem[];
  advanceSelect: string;
  filterby: MenuItem[];
  By: string;
  criteria: MenuItem[];
  selectedcriteria: string;
  criteriaChk: number = 0;
  operaters: MenuItem[];
  Value: string;
  values: MenuItem[];
  valueType: any;
  openWith: MenuItem[];
  layoutType: any;
  Value1: number = -1;
  Value2: number = -1;
  GroupId: number = -1;
  GroupName: string;
  MetaDataInfo: any;
  graphName: string = '';
  graphNames: string[] = [];
  graphID: number[] = [];
  treeVectorSelectArr: Array<string> = [];
  showTogetherSwitch: Array<boolean> = [];
  treeSameVectComponent: Array<string> = [];
  metaDataInfoList = [];
  grpBy = {};
  filter = {};
  typ = [];
  graphStatsType: number = 0;
  enableFilter: number = 0;
  graphSettings = {};
  GRID_ROWHEIGHT = 1;
  GRID_MAXCOLS = 200;
  WIDGETS_MARGIN = 5;
  chartData = [];
  prevMetaDataInfo = [];
  autoSuggestColors: SelectItem[];
  widgetLayouts: DashboardWidgetLayout[] = [];
  arrChartSeries = [];
  scrollHeight: string = '300px';
  chartFlag = false;
  isPattern: boolean = false;
  loadData = [];
  isgdfChange : boolean = false;
  constructor(private metricsSettingsService: MetricsSettingsService,
    private sessionService: SessionService,
    private ref: ChangeDetectorRef,
    private dashboardGraphService: DashboardGraphService,
    private messageService: MessageService,
    private treeOperationsService: TreeOperationsService) {
    super()
    const me = this;
    me.dropDownData();
    me.advanceSelect = "all"
    me.valueType = 'Avg';
    me.layoutType = '3';
    me.By = 'Avg';
    me.selectedcriteria = 'Include';
    me.Value = '=';
  }


  showMetricsSettings(dashboard: DashboardComponent) {
    const me = this;
    me.dashboardCom = dashboard;
    me.chartFlag = false;
    this.noData = true;
    this.isPattern = false;
    me.disableopenWithNewLayout = true;
    me.isgdfChange = false;
    me.mergeMetric = false;
    me.filter = {};
    me.show();
    me.enableFilter = 0;
    me.advanceSelect = "all"
    me.valueType = 'Avg';
    me.layoutType = '3';
    me.By = 'Avg';
    me.selectedcriteria = 'Include';
    me.Value = '=';
    me.chartData = [];
    me.arrChartSeries = [];
    me.loadData = [];
    let MetaDataInfos = me.metricsSettingsService.getMetaDataInfo();
    me.OperationType(me.advanceSelect)
    me.getMetaData(MetaDataInfos);
    me.getbreadcrumb(MetaDataInfos);
    me.openOperations(me.metricType);
    me.enabledisableGraphoption();
    me.class = "widget-container widget-group";
    if (me.treeOperationsService.stopCounter)
    clearInterval(me.treeOperationsService.stopCounter);
  }

  /*This method for breadcrumb---*/
  getbreadcrumb(metaInfo) {
    const me = this;
    me.breadcrumb = [];
    let selectedHierarcy = [];
    let breadcrumb = [];
    let selectedGroupName = "";
    let selectedGraphName = "";
    if (metaInfo.length > 0) {
      selectedHierarcy = metaInfo[0].subjectTags;
      selectedGroupName = metaInfo[0].measureTags.mg;
      selectedGraphName = metaInfo[0].measureTags.metric;
    }
    for (let i = 0; i < selectedHierarcy.length; i++) {
      breadcrumb.push({ label: selectedHierarcy[i].value })
    }
    if (metaInfo.length > 1) {
      breadcrumb.push({ label: selectedGroupName });
    } else {
      breadcrumb.push({ label: selectedGroupName }, { label: selectedGraphName });
    }
    me.breadcrumb = breadcrumb;
  }

  ngOnInit(): void {
    const me = this;
    METRICS_SETTINGS_DUMMY.charts[0].highchart.chart.type = "bar";
    me.data = METRICS_SETTINGS_DUMMY;
    me.breadcrumb = [
      { label: 'Graph_Name-Tier' },
      { label: 'Server:Processes waiting For Run Time-Cavisson' },
      { label: 'Ndapplince' }
    ]

  }

  dropDownData = function () {
    this.advancevalue = [
      { label: 'No Filter', value: 'all' },
      { label: 'All Zero Values ', value: 'zero' },
      { label: 'Non-Zero Values', value: 'nonZero' },
      { label: 'Advanced Filter', value: 'advanced_Op' }
    ]
    const me = this;
    me.metricTypes = [];
    me.metricTypes.push({ label: "Open metric", value: "openmetric" });
    me.metricTypes.push({ label: "Merge metric", value: "mergemetric" });
    me.metricTypes.push({ label: "Advance open/merge", value: "advanced" });
    me.metricTypes.push({ label: "Advance compare group metric", value: "compare" });

    me.filterby = [];
    me.filterby.push({ label: 'Avg', value: 'Avg' });
    me.filterby.push({ label: 'Min', value: 'Min' });
    me.filterby.push({ label: 'Max', value: 'Max' });
    me.filterby.push({ label: 'Count', value: 'Count' });

    me.criteria = [];
    me.criteria.push({ label: 'Including', value: 'Include' });
    me.criteria.push({ label: 'Excluding', value: 'Exclude' });

    me.operaters = [];
    me.operaters.push({ label: '=', value: '=' });
    me.operaters.push({ label: '>', value: '>' });
    me.operaters.push({ label: '<', value: '<' });
    me.operaters.push({ label: '>=', value: '>=' });
    me.operaters.push({ label: '<=', value: '<=' });
    me.operaters.push({ label: 'In Top', value: 'Top' });
    me.operaters.push({ label: 'At Bottom', value: 'Bottom' });
    me.operaters.push({ label: 'In-Between', value: 'In-Between' });


    me.values = [];
    me.values.push({ label: 'Avg', value: 'Avg' });
    me.values.push({ label: 'Min', value: 'Min' });
    me.values.push({ label: 'Max', value: 'Max' });
    me.values.push({ label: 'Count', value: 'Count' });
    me.values.push({ label: 'Sumcount', value: 'SumCount' });

    me.openWith = [];
    me.openWith.push({ label: '1 x 1', value: '1' });
    me.openWith.push({ label: '2 x 2', value: '2' });
    me.openWith.push({ label: '3 x 3', value: '3' });
    me.openWith.push({ label: '4 x 4', value: '4' });
  }

  OperationType(showSelectedOperationType) {
    this.typ = [];
    if (showSelectedOperationType !== "all" && showSelectedOperationType !== undefined) {
      this.enableFilter = 7;
    } else {
      this.enableFilter = 0;
    }
  }

  enabledisableGraphoption() {
    const me = this;
    if (me.graphName !== '' && me.graphName !== null && me.graphName !== undefined) {
      me.enableGraphLevel = false;
    } else {
      me.enableGraphLevel = true;
    }
    if (me.metricType.startsWith('openmetric')) {
      me.showGraphTogether = false;
    } else {
      // this.showGraphTogether = true;
    }

  }

  enableDisableNewLayoutSwitch() {
    const me = this;
    
    if (me.showGraphTogether == true) {
      me.openWithNewLayout = false;
      me.showTogether = 128;
    } else {
      me.openWithNewLayout = true;
      me.showTogether = 127;
    }

  }

  enableDisableNewLayout() {
    const me = this;
    for (let i = 0; i < me.showTogetherSwitch.length; i++) {
    
      if (me.showTogetherSwitch[i] == true) {
        me.openWithNewLayout = false;
        me.disableopenWithNewLayout = false;
      } 
      
      if (me.showTogetherSwitch[i] == false) 
      {
        me.openWithNewLayout = true;
        me.disableopenWithNewLayout = true;

      }
    }
  }

  /**
     * This method is used for get the duration object from the dashboard component
     */
  getDuration() {
    try {

      const dashboardTime: DashboardTime = this.dashboardCom.getTime(); // TODO: widget time instead of dashboard

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

  getMetaData(MetaData) {
    const me = this;
    me.prevMetaDataInfo = [];
    me.graphNames = [], me.graphID = [];
    if (MetaData.length > 1) {
      me.graphName = '';
    } else {
      me.graphName = MetaData[0].measureTags.metric;
    }
    for (let i = 0; i < MetaData.length; i++) {

      me.graphNames.push(MetaData[i].measureTags.metric);
      me.graphID.push(MetaData[i].measureTags.metricId);
      //me.graphID.push(i + 1);
      if (i == 0) {
        me.GroupId = MetaData[i].measureTags.mgId;
        me.GroupName = MetaData[i].measureTags.mg;
        let subjecttags = MetaData[i].subjectTags.reverse();
        me.MetaDataInfo = [];
        let vList = [];
        vList.push({ label: 'All', value: 'All' })
        vList.push({ label: 'Same', value: 'Same' })
        vList.push({ label: 'Pattern', value: 'Pattern' })
        for (let j = 0; j < subjecttags.length; j++) {
          me.MetaDataInfo.push({ metaData: subjecttags[j].key, vector: vList, check: 'Show Together', value: subjecttags[j].value });
          me.prevMetaDataInfo = me.MetaDataInfo;
        }
      }
    }
  }
  /*This method is for changing operation type to advance settings in case of when we change graph operations*/
  openOperations = function (metricType) {
    if (metricType == "advanced") {
      this.featureName = "Advance open/merge";
    } else if (metricType == "openmetric") {
      this.featureName = "Open metric";
    } else if (metricType == "mergemetric") {
      this.featureName = "Merge metric";
    } else if (metricType == "compare") {
      this.featureName = "Advance compare group metric";
    }
    this.loadDefaultValues(metricType);
    this.chartData = [];
    this.arrChartSeries = [];
  };

  /**this method is called for setting values to metadata list. */
  loadDefaultValues(metricType) {
    try {
      const me = this;
      /*This loop is for filling default value in operations accordian*/
      for (let i = 0; i < me.MetaDataInfo.length; i++) {
        this.treeSameVectComponent[i] = me.MetaDataInfo[i].value;
        if (i !== this.MetaDataInfo.length - 1) {
          if (metricType.startsWith('compare')) {
            me.treeVectorSelectArr[i] = 'Same';
            me.showTogetherSwitch[i] = false;
          } else {
            me.treeVectorSelectArr[i] = 'Same';
            me.showTogetherSwitch[i] = true;
          }

        } else {
          if (me.graphName !== '' && me.graphName !== null && me.graphName !== undefined) {
            if (metricType.startsWith('openmetric') || metricType.startsWith('advanced')) {
              this.treeVectorSelectArr[i] = 'All';
              this.showTogetherSwitch[i] = false;
            } else {
              this.treeVectorSelectArr[i] = 'All';
              this.showTogetherSwitch[i] = true;
            }
          } else {
            if (metricType.startsWith('openmetric') || metricType.startsWith('advanced')) {
              this.treeVectorSelectArr[i] = 'Same';
              this.showTogetherSwitch[i] = true;
            } else {
              this.treeVectorSelectArr[i] = 'All';
              this.showTogetherSwitch[i] = true;
            }
          }
        }
      }
      this.enableDisableNewLayoutSwitch();
      this.enableDisableNewLayout();
    } catch (e) {
      console.error('getting error while seting values in metadata list.');
    }
  }

  basicInfoForSelectVector(event, index) {
    if (this.treeVectorSelectArr[index] === 'Same') {
      this.treeSameVectComponent[index] = this.MetaDataInfo[index].value;
      this.showTogetherSwitch[index] = true;
      this.enableDisableNewLayout();
    }
    this.chartData = [];
    this.arrChartSeries = [];
  }

  apply() {
    try {
      const me = this;
      me.filter = null;
      me.metaDataInfoList = [];
      let showTogetherCount = 0;
      for (let i = 0; i < me.MetaDataInfo.length; i++) {

        /* Asigining default value to show together switch */
        if (me.showTogetherSwitch[i] === undefined) {
          me.showTogetherSwitch[i] = false;
        }
        if (me.treeVectorSelectArr[i] == 'Pattern' && (me.treeSameVectComponent[i] == "" || me.treeSameVectComponent[i] == undefined)) {
          let msg = 'Please fill Selected Pattern value in the text box.'
          me.messageService.add({ severity: 'error', summary: 'Error message', detail: msg });
          return;
        }
        
        if(me.showTogetherSwitch[i])
        showTogetherCount = showTogetherCount + 1;

        me.metaDataInfoList.push(me.operations(me.MetaDataInfo[i].metaData, me.treeVectorSelectArr[i], me.treeSameVectComponent[i], me.showTogetherSwitch[i]));
      }

      if(showTogetherCount == me.MetaDataInfo.length )
      {

        let mergeMetricData = [];
        //me.metaDataInfoList
        let subjectTag = {
          'tags': me.metaDataInfoList,
        }
        let json = {};
        if(me.enableGraphLevel && me.showGraphTogether == true)
        {
            // need to add condition for adding multiple metrics
          for(let i = 0 ;i < me.graphID.length;i++){

            let json = {};
            let mesure = {
              "mgType": "NA",
              "mgTypeId": -1,
              "mg": me.GroupName,
              "mgId": me.GroupId,
              "metric": me.graphNames[i],
              "metricId": me.graphID[i],
              "showTogether": me.showTogether
            }
    
              json['measureTags'] = mesure;
              json['subjectTags'] = subjectTag.tags;
              mergeMetricData.push(json);

          }
        }
        else{

            if(!me.enableGraphLevel){
                let mesure = {
                "mgType": "NA",
                "mgTypeId": -1,
                "mg": me.GroupName,
                "mgId": me.GroupId,
                "metric": me.graphNames[0],
                "metricId": me.graphID[0],
                "showTogether": me.showTogether
              }
          
            json['measureTags'] = mesure;
            json['subjectTags'] = subjectTag.tags;
            mergeMetricData.push(json);
      

            if(me.openWithNewLayout){
             me.dashboardCom.renderSelectedWidget(mergeMetricData,false);
             this.visible = false;
             this.class = "";
              return -1;
            }
      }
      }
      }

      me.MetricSettingJson();
      let exclOverall = 0;
      if (me.excOverallMetric === true) {
        exclOverall = 1;
      } else {
        exclOverall = 0;
      }
      /*****Making payload regarding the operation and sending through /metaData RestApi */
      const metricsSettingPayload = {
        opType: 6,
        cctx: me.sessionService.session.cctx,
        duration: me.getDuration(),
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        etag: "version_for_etag_provided_by_tsdb",
        grpBy: me.grpBy,
        ft: me.filter,
        exclOverall: exclOverall,
      };
      me.metaDataCall(metricsSettingPayload);

    } catch (e) {
      console.error("error in Metrics-Setting--", e);
    }
  }


  metaDataCall(metricsSettingPayload) {
    const me = this;
    
    me.metricsSettingsService.loadMetricSetting(metricsSettingPayload).subscribe(
      (state: Store.State) => {
        if (state instanceof MetricsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof MetricsLoadedState) {
          if (me.loadData.length == 0) {
            me.onLoaded(state);
          }
          else {
            me.checkData(state);
          }
          return;
        }
      },
      (state: MetricsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

    if (!this.forPreview && me.sessionService.testRun.id && me.sessionService.testRun.running) {
      if (me.treeOperationsService.stopCounter)
        clearInterval(me.treeOperationsService.stopCounter);

      me.treeOperationsService.stopCounter = setInterval(() => {
        me.metaDataCall(metricsSettingPayload);
      }, 5000 * 60);
    }

  }

  private onLoading(state: MetricsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MetricsLoadingErrorState) {
    const me = this;
    me.metricData = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
  }

  private onLoaded(state: MetricsLoadedState) {
    const me = this;
    me.loadData = [];
    let msg = "Data Not Available.";
    let status: status = {
      code: -1,
      detailedMsg: "",
      msg: ""
    };
    if (state.data && state.data['grpMetaData'] !== undefined) {
      me.loadData = state.data['grpMetaData'];
      status = state.data['status'];
    }
    if (me.loadData.length == 0) {
      if (status.msg.includes("Metric not found for the applied filter")) {
        msg = status.msg;
      }
      me.messageService.add({ severity: 'error', summary: 'Error message', detail: msg });
      this.visible = true;
      return;
    } else {


      if (!this.forPreview) {
        me.noData = true;
        me.dashboardInstance(me.loadData);

      }
      else {
        let finalobj = [];
        let data = me.loadData;
        me.loadData = [];
        let obj1 = {};
        if (data.length == 1) {
          let meData = data[0].mdata;
          obj1['mData'] = this.makeData(meData);
          if (data[0].grpKey.includes("->*>")) {
            let title = data[0].grpKey.split("->*>");
            obj1['pCaption'] = title[0] + "-" + obj1['mData'][0].vectorName;
          } else if (data[0].grpKey.includes(">*>*") || data[0].grpKey.includes(">*")) {
            obj1['pCaption'] = data[0].title + ">" + "All";
          }
          else if (data[0].title.includes("->")) {
            obj1['pCaption'] = data[0].title;
          }

          else {
            obj1['pCaption'] = data[0].title + "-" + obj1['mData'][0].vectorName;
          }


          obj1['graphSettings'] = {};
          finalobj.push(obj1);
        } else {
          for (let i = 0; i < data.length; i++) {
            let obj1 = {};
            let meData = data[i].mdata;
            obj1['mData'] = this.makeData(meData);
            if (data[i].grpKey.includes("->*>")) {
              let title = data[i].grpKey.split("->*>");
              obj1['pCaption'] = title[0] + "-" + obj1['mData'][0].vectorName;
            } else if (data[i].grpKey.includes(">*>*") ||data[i].grpKey.includes(">*")) {
              obj1['pCaption'] = data[i].title + ">" + "All";
            }
            else if (data[i].title.includes("->")) {
              obj1['pCaption'] = data[i].title;
            }

            else {
              obj1['pCaption'] = data[i].title + "-" + obj1['mData'][0].vectorName;
            }

            obj1['graphSettings'] = {};
            finalobj.push(obj1);
          }
        }
        me.previewData = [];
        me.previewData = finalobj;

        this.createPayloadForData();
        this.visible = this.forPreview;
        this.ref.detectChanges();
        return;

      }
    }
    me.error = null;
    me.loading = false;
    this.ref.detectChanges();
  }

  public checkData(state: MetricsLoadedState) {
    const me = this;
    let tempData = [];
    if (state.data && state.data['grpMetaData'] !== undefined) {
      tempData = state.data['grpMetaData'];

      if ( tempData.length > 0 && !this.forPreview) {
        me.isgdfChange = me.treeOperationsService.getGdfChange(tempData,me.loadData);
        if(me.isgdfChange){
          me.loadData = tempData;
          me.noData = true;
          me.dashboardInstance(tempData);
        }
      }
    }
    me.error = null;
    me.loading = false;
  }

  dashboardInstance(data) {
    const me = this;
    me.graphSettings = {};
    let finalobj = [];
    let obj1 = {};
    if (data.length == 1) {
      let meData = data[0].mdata;
      obj1['mData'] = this.makeData(meData);
      if (data[0].grpKey.includes("->*>")) {
        let title = data[0].grpKey.split("->*>");
        obj1['pCaption'] = title[0] + "-" + obj1['mData'][0].vectorName;
      } else if (data[0].grpKey.includes(">*>*") || data[0].grpKey.includes(">*")) {
        obj1['pCaption'] = data[0].title + ">" + "All";
      }
      else if (data[0].title.includes("->")) {
        obj1['pCaption'] = data[0].title;
      }
      else {
        obj1['pCaption'] = data[0].title + "-" + obj1['mData'][0].vectorName;
      }
      obj1['graphSettings'] = {};
      finalobj.push(obj1);
    } else {
      for (let i = 0; i < data.length; i++) {
        let obj1 = {};
        let meData = data[i].mdata;
        obj1['mData'] = this.makeData(meData);
        if (data[i].grpKey.includes("->*>")) {
          let title = data[i].grpKey.split("->*>");
          obj1['pCaption'] = title[0] + "-" + obj1['mData'][0].vectorName;
        } else if (data[i].grpKey.includes(">*>*") || data[0].grpKey.includes(">*")) {
          obj1['pCaption'] = data[i].title + ">" + "All";
        } else if (data[i].title.includes("->")) {
          obj1['pCaption'] = data[i].title;
        }else {
          obj1['pCaption'] = data[i].title + "-" + obj1['mData'][0].vectorName;
        }
        obj1['graphSettings'] = {};
        finalobj.push(obj1);
      }
    }
    me.metricData = [];
    me.metricData = finalobj;
    if(!me.isgdfChange){
      me.makeDashboardInstance(me.metricData);
    }else{
      me.makeDashboardInstanceForGdf(me.metricData);
      }
    
    this.visible = false;
    this.class = "";
  }

  makeDashboardInstance(metricData){
    const me = this;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {

      let length = 0;

      if (me.openWithNewLayout) {
        if(dc.selectedWidget)
        dc.selectedWidget.widget.widgetIndex = 0;

        me.dashboardCom.data.favDetailCtx.widgets = [];
        length = (this.layoutType * this.layoutType);
        if (this.metricData.length > length)
          length = this.metricData.length;

        this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
        me.dashboardCom.data.favDetailCtx.layout.configGrid.cols = this.GRID_MAXCOLS;
        me.dashboardCom.data.favDetailCtx.layout.configGrid.rowHeight = this.GRID_ROWHEIGHT;
        me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;
        if(dc.selectedWidget)
        dc.selectedWidget.widget.widgetIndex = 0;

        me.dashboardCom.data.favDetailCtx.widgets = [];
        for (let i = 0; i < length; i++) {
          let newWidget = me.dashboardCom.getNewWidget('GRAPH');
          newWidget.name = "";
          newWidget.id = "";
          me.dashboardCom.data.favDetailCtx.widgets.push(newWidget);
          me.setPanelCaption(i);
        }
      } else {
        if (this.metricData.length > me.dashboardCom.data.favDetailCtx.widgets.length) {
          length = this.metricData.length;

          this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
          me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;


          me.dashboardCom.data.favDetailCtx.widgets = [];
          for (let i = 0; i < length; i++) {
            let newWidget = me.dashboardCom.getNewWidget('GRAPH');
            newWidget.name = "";
            newWidget.id = "";
            me.dashboardCom.data.favDetailCtx.widgets.push(newWidget);
            me.setPanelCaption(i);
          }
        }
        else {
          length = me.dashboardCom.data.favDetailCtx.widgets.length;
          if (this.metricData.length == 1 && me.disableopenWithNewLayout == false) {
            me.mergeMetric = true;
            dc.MergeMetrics(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
          } else {
            this.widgetLayouts = [];
            // this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
            // me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;
            if (me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts == undefined || me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts == null) {
              for (let i = 0; i < length; i++) {
                this.widgetLayouts.push(me.dashboardCom.data.favDetailCtx.widgets[i].layout);
              }
              me.dashboardCom.data.favDetailCtx.layout.configGrid['widgetLayouts'] = this.widgetLayouts;
            }

            for (let i = 0; i < length; i++) {
              if (i < this.metricData.length) {
                let newWidget = me.dashboardCom.getNewWidget('GRAPH');
                newWidget.name = "";
                newWidget.id = "";
                me.dashboardCom.data.favDetailCtx.widgets[i] = newWidget;

                me.setPanelCaption(i);
              }
            }
          }
        }
      }

      if (me.mergeMetric == false) {
        me.dashboardCom.changeLayout(me.dashboardCom.data.favDetailCtx.layout);
        dc.renderMetricsSetting(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
      }
    });
  }

  makeDashboardInstanceForGdf(metricData){
    const me = this;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      length = me.dashboardCom.data.favDetailCtx.widgets.length;

    if (this.metricData.length > me.dashboardCom.data.favDetailCtx.widgets.length) {
      length = this.metricData.length;
      this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
      me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;
    }else{
      this.widgetLayouts = [];
        if (me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts == undefined || me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts == null) {
          for (let i = 0; i < length; i++) {
            this.widgetLayouts.push(me.dashboardCom.data.favDetailCtx.widgets[i].layout);
          }
          me.dashboardCom.data.favDetailCtx.layout.configGrid['widgetLayouts'] = this.widgetLayouts;
        }
    }
      
      if (this.metricData.length == 1 && me.disableopenWithNewLayout == false) {
          me.mergeMetric = true;
         dc.MergeMetrics(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
      }else {
        for (let i = 0; i < length; i++) {
          if (i < this.metricData.length) {
          if( i >= me.dashboardCom.data.favDetailCtx.widgets.length){
            let newWidget = me.dashboardCom.getNewWidget('GRAPH');
            newWidget.name = "";
            newWidget.id = "";
            me.dashboardCom.data.favDetailCtx.widgets[i] = newWidget;
            me.setPanelCaption(i);
          }
          me.setPanelCaptionForWidgets(i);
          }
        }

        me.dashboardCom.changeLayout(me.dashboardCom.data.favDetailCtx.layout);
        dc.renderMetricsSetting(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
      }
  });
  }


  setPanelCaption(i) {
    const me = this;
    me.dashboardCom.data.favDetailCtx.widgets[i].widgetIndex = i;
    if (me.metricData[i]) {
      me.dashboardCom.data.favDetailCtx.widgets[i].id = me.metricData[i].pCaption;
      me.dashboardCom.data.favDetailCtx.widgets[i].name = me.metricData[i].pCaption;
    }
    me.dashboardCom.data.favDetailCtx.widgets[i].dataAttrName = "avg";
    me.dashboardCom.data.favDetailCtx.widgets[i].description = "";
    me.dashboardCom.data.favDetailCtx.widgets[i].graphs = {};
    me.dashboardCom.data.favDetailCtx.widgets[i].layout = me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts[i];
  }

  setPanelCaptionForWidgets(i) { 
    const me = this;
    me.dashboardCom.data.favDetailCtx.widgets[i].widgetIndex = i;
    if (me.metricData[i]) {
      me.dashboardCom.data.favDetailCtx.widgets[i].id = me.metricData[i].pCaption;
      me.dashboardCom.data.favDetailCtx.widgets[i].name = me.metricData[i].pCaption;
    }
    me.dashboardCom.data.favDetailCtx.widgets[i].layout = me.dashboardCom.data.favDetailCtx.layout.configGrid.widgetLayouts[i];
  }

  makeData(meData) {
    let objs = [];
    for (let j = 0; j < meData.length; j++) {
      let subject = [];
      let vectorName = '';
      let subj = meData[j].subject;
      for (let k = 0; k < subj.length; k++) {
        if (k == 0)
          vectorName = subj[k].value;
        else
          vectorName = vectorName + ">" + subj[k].value;
        subject.push({ key: subj[k].key, value: subj[k].value, mode: 1 });
      }
      objs.push(
        {
          "measure": meData[j].measure,
          "subject": subject,
          "glbMetricId": meData[j].glbMetricId,
          "vectorName": vectorName,
        }
      );
    }
    return objs;
  }

  /*This method is to make json for operation*/
  operations = function (metData, optValue, optName, isToShowtogether) {
    let mode: number;
    if (optValue === 'Pattern')
      this.isPattern = true;

    if (optValue === 'Pattern' && !optName.startsWith("*")) {
      optName = "*" + optName;
    }
    if (optValue === 'All' && isToShowtogether) {
      mode = 130;
    } else if (optValue === 'Pattern' && isToShowtogether) {
      mode = 132;
    } else if (optValue !== 'Same' && optValue !== 'All' && isToShowtogether) {
      mode = 129;
    } else if (optValue !== 'Same' && optValue !== 'All' && !isToShowtogether) {
      mode = 1;
    } else if (optValue === 'Pattern' && !isToShowtogether) {
      mode = 4;
    } else if (optValue === 'All' && !isToShowtogether) {
      mode = 2;
    } else {
      mode = 1;
    }
    let a = {
      'key': metData,
      'value': optName,
      'mode': mode,
    };
    return a;
  };

  MetricSettingJson() {
    const me = this;
    let opt = "=";
    let filter = {};
    me.typ = [];
    let subject = {
      'tags': me.metaDataInfoList,
    }
    let measure = {
      "mgType": "NA",
      "mgTypeId": -1,
      "mg": me.GroupName,
      "mgId": me.GroupId,
      "metrics": me.graphNames,
      "metricIds": me.graphID,
      "showTogether": me.showTogether
    }
    let groupBy = {
      "subject": subject,
      "measure": measure,
    }
    if (me.dashboardCom.data.favDetailCtx.dashboardGlobalRule == undefined) {
      let dashboardGlobalRule: DashboardGlobalRule = {
        subject: subject,
        measure: measure,
        opType: 6
      }
      me.dashboardCom.data.favDetailCtx.dashboardGlobalRule = dashboardGlobalRule;
    }

    if (me.advanceSelect !== "all" && me.advanceSelect !== undefined) {
      this.enableFilter = 7;
    } else {
      this.enableFilter = 0;
    }
    me.layoutType = me.layoutType;
    let type = 0;
    if (this.valueType === 'undefined') {
      type = 0;
    } else if (this.valueType === 'Avg') {
      type = 0;
    }
    else if (this.valueType === 'Min') {
      type = 1;
    } else if (this.valueType === 'Max') {
      type = 2;
    } else if (this.valueType === 'Count') {
      type = 3;
    } else if (this.valueType === 'SumCount') {
      type = 4;
    }
    me.graphStatsType = type;
    /**Instansiating TreeOperaionsFilterByValueInfo. */
    if (this.enableFilter == 0) {
      filter = null
    } else {
      if (this.advanceSelect == 'nonZero') {
        const me = this;
        me.typ.push(1);
        me.typ.push(this.enableFilter);
        me.Value2 = -1;
        me.Value1 = 0;
        opt = ">";
      }
      else if (this.advanceSelect == 'zero') {
        const me = this;
        me.typ.push(2);
        me.typ.push(this.enableFilter);
        me.Value2 = -1;
        me.Value1 = 0;
        opt = "=";
      }
      else if (this.advanceSelect == 'advanced_Op') {
        let AdvFiltertype = 0;
        if (this.By === 'undefined') {
          AdvFiltertype = 0;
        } else if (this.By === 'Avg') {
          AdvFiltertype = 0;
        }
        else if (this.By === 'Min') {
          AdvFiltertype = 1;
        } else if (this.By === 'Max') {
          AdvFiltertype = 2;
        } else if (this.By === 'Count') {
          AdvFiltertype = 3;
        }
        me.typ.push(AdvFiltertype);
        me.typ.push(this.enableFilter);
        if (me.Value === 'undefined') {
          opt = "=";
        } else if (me.Value === '=') {
          opt = me.Value;
        } else if (me.Value === '>') {
          opt = me.Value;
        } else if (me.Value === '>=') {
          opt = me.Value;
        } else if (me.Value === '<') {
          opt = me.Value;
        } else if (me.Value === '<=') {
          opt = me.Value;
        } else if (me.Value === 'In-Between') {
          opt = me.Value;
        } else if (me.Value === 'Top') {
          opt = me.Value;
        } else if (me.Value === 'Bottom') {
          opt = me.Value;
        }
        /* Changing Include value of Criteria to true otherwise false */
        // if (me.selectedcriteria === 'Include') {
        //   me.criteriaChk = 1;
        // } else {
        //   me.criteriaChk = 0;
        // }


      }
      filter = {
        "typ": me.typ,
        "opt": opt.toString(),
        "val1": Number(me.Value1),
        "val2": Number(me.Value2)
      }
    }
    me.filter = filter;
    me.grpBy = groupBy;

  }

  closeDialog() {
    this.visible = false;
    this.class = "";
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

  getWidgetLayouts(rowsCalc, colsCalc, length,) {
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

  clickPreview() {
    const me = this;
    me.chartFlag = true;
    me.loading = true;
    this.dataWidget = [];
    this.forPreview = true;
    this.noData = false;
    this.apply();



    this.ref.detectChanges();
  }


  createPayloadForData() {
    const me = this;
    let startTime = 0;
    let endTime = 0;
    let viewBy = "";
    let graphTimeKey = "";
    const dashboardTime: DashboardTime = this.dashboardCom.getTime();
    startTime = _.get(
      dashboardTime,
      'time.frameStart.value',
      null
    );
    endTime = _.get(dashboardTime, 'time.frameEnd.value', null);
    graphTimeKey = _.get(dashboardTime, 'graphTimeKey', null);
    viewBy = _.get(dashboardTime, 'viewBy', null);

    let count  = me.previewData.length;




    // if(count > me.previewData.length)
    //     count = me.previewData.length;

    for (let i = 0; i < count; i++) {


      if (me.previewData && me.previewData !== null && me.previewData.length > 0) {

        let payload = {
          globalFavCtx: me.dashboardCom.data.favDetailCtx.globalFavCtx,
          tsdbCtx: {
            appId: -1,
            avgCount: 0, // Data
            avgCounter: 0, // Data
            cctx: me.sessionService.session.cctx,
            clientId: -1,
            dataFilter: this.dashboardCom.data.favDetailCtx.widgets[0].settings.dataFilter,
            dataCtx: this.dashboardCom.data.favDetailCtx.widgets[0].dataCtx,
            duration: {
              st: startTime,
              et: endTime,
              preset: graphTimeKey,
              viewBy,
            },
            opType: 11, // Data
            tr: me.sessionService.testRun.id,
          },
          widget: this.dashboardCom.data.favDetailCtx.widgets[0],
          multiDc: false, //me.sessionService.isMultiDC,
          actionForAuditLog: null
        };

        if (!this.previewData[i]) {
          //payload.widget.dataCtx.gCtx = payload.tsdbCtx.dataCtx.gCtx = [];
          //payload.widget.graphs.widgetGraphs = [];
        } else {
          let panelData = [], panelCaption = '';

          if (i < this.previewData.length) {

            if (this.previewData[i] && this.previewData[i].mData) {
              panelData = this.previewData[i].mData;
              panelCaption = this.previewData[i].pCaption;
              //payload.widget.graphSettings = {};
              //payload.widget.graphSettings = this.previewData[i].graphSettings;
              const newft: DashboardDataCTXDataFilter = {
                typ: 0,
                in: false,
                opt: "1",
                val1: 0,
                val2: -1,
              }
              const dataCtx: DashboardDataCTX = {
                gCtx: [],
                ft: null,
                selfTrend: 0,
              };
              const newGraph: DashboardGraphs = {
                widgetGraphs: [],
              }

              const newWidget: DashboardWidget = {
                dataAttrName: "avg",
                displayName: "",
                dataCtx: dataCtx,
                description: '',
                graphs: newGraph,
                graphSettings: payload.widget.graphSettings,
                icon: '',
                id: '',
                iconTooltip: "Advance Settings",
                include: true,
                layout: this.dashboardCom.data.favDetailCtx.widgets[0].layout,
                name: '',
                ruleType: 0,
                scaleMode: 1,
                settings: payload.widget.settings,
                type: "GRAPH",
                widgetIndex: i,
                isSelectedWidget: false,
                dropTree: false,
              }

              payload.tsdbCtx.dataCtx = newWidget.dataCtx;

              payload.widget.dataCtx.gCtx = payload.tsdbCtx.dataCtx.gCtx = [];
              payload.widget.graphs.widgetGraphs = [];
              for (let idx = 0; idx < panelData.length; idx++) {
                let subject = panelData[idx].subject;
                let measure = panelData[idx].measure;
                const subCTX: GraphDataCTXSubject = {
                  tags: subject
                };
                const newGraphCTX: DashboardGraphDataCTX = {
                  subject: subCTX,
                  measure: measure,
                  glbMetricId: panelData[idx].glbMetricId
                };
                payload.tsdbCtx.dataCtx.ft = this.dashboardCom.filter;
                payload.tsdbCtx.dataCtx.gCtx.push(newGraphCTX);
                payload.widget.dataCtx = payload.tsdbCtx.dataCtx;
                const newwidgetGraphs: DashboardWidgetGraph = {
                  vecName: panelData[idx].vectorName,
                  glbMetricId: panelData[idx].glbMetricId,
                  graphId: panelData[idx].measure.metricId,
                  groupId: this.dashboardCom.groupID,
                }
                payload.widget.graphs.widgetGraphs.push(newwidgetGraphs);
                //payload.widget.description = payload.widget.id = payload.widget.name = panelCaption;
                //payload.widget.settings.caption.caption = panelCaption;
                payload.widget.settings.graphStatsType = this.dashboardCom.graphStatsType.toString();
                payload.widget.include = this.dashboardCom.Include;

              }
            }
          }
        }
        payload.widget.widgetIndex = i;
        me.metricsSettingsService.loadMetricData(payload).subscribe(

          (state: Store.State) => {
            if (state instanceof DashboardWidgetLoadingState) {
              // return;
            }

            if (state instanceof DashboardWidgetLoadedState) {
              let widgetData: DashboardGraphData;
              widgetData = state.data.grpData;
              this.dataWidget.push(widgetData);

              if (this.dataWidget.length == count) {
                this.createChartData(this.dataWidget);

              }
            }
          },
          (state: DashboardWidgetLoadingErrorState) => {

          }
        );

        //}
      }
    }


  }

  createChartData(chartDataArr) {
    const me = this;
    me.chartData = [];
    for (let i = 0; i < chartDataArr.length; i++) {

      me.chartData.push({ ...me.createChartObject(me.previewData[i], chartDataArr[i].mFrequency) });
    }


    if (me.chartData.length > 0) {
      me.forPreview = false;
      me.loading = false;
      this.ref.detectChanges();
    }
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

  getGraphData(graphArr) {
    let gData = []
    for (const avgData of graphArr) {
      gData.push(this.isCavissonNullVal(avgData));
    }
    return gData;
  }


  makeSeriesData(mdata, chData, timeData) {
    const arrsChartSeries = [];

    for (let i = 0; i < mdata.length; i++) {
      let seriesData = [];

      let name = mdata[i].measure.metric + " > " + mdata[i].vectorName;
      if (chData.dataType === 0)
        seriesData = this.getGraphData(chData.avg);
      else if (chData.dataType === 1)
        seriesData = this.getGraphData(chData.min);
      else if (chData.dataType === 2)
        seriesData = this.getGraphData(chData.max);
      else if (chData.dataType === 3)
        seriesData = this.getGraphData(chData.count);
      else if (chData.dataType === '4')
        seriesData = this.getGraphData(chData.sumCount);
      else
        seriesData = this.getGraphData(chData.sumSquare);

      const chartSeries = {
        data: seriesData,
        name: name,
        color: null,
        marker: { enabled: false },
        pointStart: timeData.st,
        pointInterval: timeData.frequency * 1000,
      };
      arrsChartSeries.push(chartSeries);
    }
    return arrsChartSeries;
  }


  createChartObject(metricsData, chartData) {
    const me = this;
    this.arrChartSeries = [];
    let title = ' ';
    if (metricsData && chartData) {
      let mdata = metricsData.mData;
      this.arrChartSeries = me.makeSeriesData(mdata, chartData[0].data[0], chartData[0].tsDetail);
      title = metricsData.pCaption;
    }


    let chartValue =
    {
      title: title,
      highchart: {
        chart: {
          type: "line",
          height: "60",
          width: "220",
          renderTo: 'container',
          style: {
            fontSize: "9"
          },
          marginBottom: 20
        },
        credits: {
          enabled: false,
        },
        title: {
          text: null,
        },
        tooltip: {
          pointFormat:
            '{series.name}  <b>{point.y:,.0f}</b><br/> {point.x}',
          enabled: true,
          backgroundColor: '#ffffff17',
          animation: false,
          followPointer: false,
          valueDecimals: 3,
          style: {
            width: 90,
            fontSize: '9px',
            whiteSpace: 'wrap',
          },
        },
        legend: {
          enabled: false,
          itemStyle: {
            color: '#333333',
            fontFamily: 'Product Sans',
            fontSize: '8px',
          },
          labelFormatter: function () {
            return "";
          },
        },
        plotOptions: {
        },
        xAxis: {
          visible: true,
          type: 'datetime',
          crosshair: true,
          dateTimeLabelFormats: me.getDateTimeLabelFormats(),
          labels: {
            formatter: function () {
              return Highcharts.dateFormat('%H:%M', this.value);
            },
            style: {
              color: '#9b9b9b',
              fontSize: '8px'
            },
          },
        },
        yAxis: [
          {
            visible: true,
            crosshair: true,
            gridLineWidth: 2,
            labels: {
              style: {
                color: '#9b9b9b',
                fontSize: '8px'
              },
            },
            title: {
              text: "",//me.dashboardCom.data.favDetailCtx.widgets[0].settings.types.graph.primaryYAxisLabel,
              style: {
                color: "",//me.dashboardCom.data.favDetailCtx.widgets[0].settings.types.graph.displayWidgetFontColor,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: 60,
                height: 60,
                fontSize: '8px',
                textAlign: 'center',
                position: 'middle',
              },
            },
            plotLines: ''
          },
          // Secondary yAxis
          {
            visible: false,
            crosshair: true,
            gridLineWidth: 1,
            labels: {
              style: {
                color: '#9b9b9b',
              },
            },
            title: {
              text: "",
              style: {
                color: "",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: 60,
                height: 60,
                fontSize: '8px',
                textAlign: 'center',
                position: 'middle',
              },
            },
            opposite: true,
          },
        ],
        series: this.arrChartSeries as Highcharts.SeriesOptionsType[],
        time: {
          useUTC: true,
        },
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '8px',
            color: '#303030',
          },
        },
      }
    }

    return chartValue;
  }

  private isCavissonNullVal(val: number): number {
    if (val === -123456789) {
      return (val = 0);
    } else {
      return val;
    }
  }


  reset() {
    const me = this;
    me.MetaDataInfo = [];
    me.chartFlag = false; 
    me.chartData = [];
    me.arrChartSeries = [];
    me.filter = {};
    me.enableFilter = 0;
    me.advanceSelect = "all"
    me.valueType = 'Avg';
    me.layoutType = '3';
    me.By = 'Avg';
    me.selectedcriteria = 'Include';
    me.Value = '=';
    me.metricType = "advanced";
    me.featureName = "Advance open/merge";
    me.OperationType(me.advanceSelect)
    me.MetaDataInfo = me.prevMetaDataInfo;
    me.openOperations(me.metricType);
    me.enabledisableGraphoption();
  }

  /**destroying a component */
  ngOnDestroy() {
    try {
      clearInterval(this.treeOperationsService.stopCounter);
    } catch (error) {
      console.error('error in unsubscribe', error);
    }
  }

}
