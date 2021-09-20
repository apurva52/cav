import {Injectable } from '@angular/core';
import {
  DashboardWidgetLoadRes,
  DashboardTime,
  DashboardUpdateRequest,
  DashboardFavCTX,
  DashboardWidget,
  DashboardGlobalFavCTX,
  MFrequencyTsDetails,
  GraphData,
  GraphDataCTXSubject,
  DashboardGraphDataCTX,
  DashboardWidgetGraph,
  DashboardGraphs,
  DashboardDataCTX,
  DashboardDataCTXDataFilter,
  DashboardGraphDataMFrequency,

} from './dashboard.model';
import { Store } from 'src/app/core/store/store';
import {
  DashboardLoadedState,
  DashboardLoadingState,
  DashboardLoadingErrorState,
  DashboardWidgetLoadingState,
  DashboardWidgetLoadingErrorState,
  DashboardWidgetLoadedState,
  DashboardWidgetLoadingSubscriptionState,
} from './dashboard.state';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import * as _ from 'lodash';
import { DashboardComponent } from '../dashboard.component';
import { DashboardServiceInterceptor, DATA_TYPE_TIMES_STD, GRAPH_STATS_AVG, GRAPH_STATS_COUNT, GRAPH_STATS_MAX, GRAPH_STATS_MIN, GRAPH_STATS_SUMCOUNT } from './dashboard.service.interceptor';
import { AppError } from 'src/app/core/error/error.model';
import { DashboardWidgetComponent } from '../widget/dashboard-widget.component';
import { deprecate } from 'util';
import { ObjectUtility } from '../../utility/object';
import { READ_MODE } from 'src/app/pages/my-library/dashboards/service/dashboards.model';
import { TimebarService } from '../../time-bar/service/time-bar.service';
import { MessageService } from 'primeng/api';
import { PatternMatchingService } from '../../pattern-matching/service/pattern-matching.service';
import { Events } from 'src/app/pages/my-library/alert/service/alert-table.model';
import { OP_TYPE_GLOBAL_TIME, OP_TYPE_ZOOM } from '../../actions.constants';
import { OP_TYPE_WIDGET_WISE } from './../../actions.constants';

@Injectable({
  providedIn: 'root',
})


export class DashboardService extends Store.AbstractService {
  public interceptor: DashboardServiceInterceptor;
  private Indexc = 0;
  private static PRE_CAL_REQ_FOR_GRAPHS = [32,33,42,53,  13, 14, 22, 23, 24, 25,26,27,60,46,   18, 17, 39, 50,  19, 40, 51,   15, 16, 67, 84, 64,65,66];
  public static SLAB_GRAPH_TYPE = [
    8,
    45,
    46,
    47,
    48,
    49,
    52,
    53,
    54,
    55,
    58,
    82,
    90,
    92,
  ];
  public static PERCENTILE_GRAPH_TYPE = [
    7,
    36,
    37,
    38,
    41,
    42,
    43,
    44,
    57,
    59,
    60,
    81,
    89,
    91,
  ];

  //this variable is used to keep all the events which graph we need load on dashboard
  events?: Events[];
  isCallFromAlert: boolean = false;

  private isUpdateDashboardPermission = new BehaviorSubject<boolean>(true);
  private isReload = new BehaviorSubject<boolean>(true);
  private favListUpdate = new BehaviorSubject<boolean>(false);
  private isDashboardTabSelected = new BehaviorSubject<boolean>(false);
  private selectedWiget = new BehaviorSubject<DashboardWidgetComponent>(null);
  tempWidgetforStoringWidgetInfo:any;
  //previousCompareData:any;
  fromWidgetFlag:boolean;
  displayMsgOnViewByChanged : number = 0;
  constructor(private sessionService: SessionService, private timebarService: TimebarService, private messageService: MessageService,private patternMatchingService: PatternMatchingService) {
    super();
    this.interceptor = new DashboardServiceInterceptor(this, sessionService);

  }

  // Action: Load
  load(dashboardPayload: DashboardFavCTX): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardLoadingState());
    });
    var path = environment.api.dashboard.load.endpoint;

    const payload = {
      opType: 11, // TODO: Dynamic
      compareCtx: null,
      multiDc: false,
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      favCtx: dashboardPayload,
      events: me.events
    };

    if(me.isCallFromAlert)
      path = environment.api.alert.event.openGraph.endpoint;

    // if (me.sessionService.isMultiDC) {
    //   payload.multiDc = me.sessionService.isMultiDC;
    // }

    me.controller.post(path, payload).subscribe(
      (data: DashboardFavCTX) => {
        me.isCallFromAlert = false;
        me.events = null;
        // TODO: change all error objects
        if (
          data.favDetailCtx.error &&
          (data.favDetailCtx.error.code ||
            data.favDetailCtx.error.message ||
            data.favDetailCtx.error.error ||
            data.favDetailCtx.error.msg)
        ) {
          output.error(new DashboardLoadingErrorState(data.favDetailCtx.error));
          output.complete();
          me.logger.error('Dashboard loading failed', data.favDetailCtx.error);
          return;
        }

        // SAMPLE WIDGETS - DO NOT REMOVE
        // if (!data.widgets || !data.widgets.length) {
        //     output.next(new DashboardLoadedState(DASHBOARD_SAMPLE));
        //     output.complete();
        // }

        if (
          data.favDetailCtx.layout.configGrid &&
          data.favDetailCtx.layout.configGrid.widgetLayouts
        ) {
          data.favDetailCtx.layout.configGrid.widgetLayouts = null;
        }

        output.next(new DashboardLoadedState(data));
        output.complete();
      },
      (e: any) => {
        me.isCallFromAlert = false;
        me.events = null;
        output.error(new DashboardLoadingErrorState(e));
        output.complete();

        me.logger.error('Dashboard loading failed', e);
      }
    );

    me.isCallFromAlert = false;
    me.events = null;

    return output;
  }

  widgetLoad(
    dashboardComponent: DashboardComponent,
    widgetComponent: DashboardWidgetComponent
  ): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();
    let previousData: DashboardWidgetLoadRes = widgetComponent.data;
    //Bug 103373 - widget object should be null in case of widget call
    let widgetIndex = 0;
    let partialEnabled = false;

      widgetIndex = widgetComponent.widget.widgetIndex;

//Data for tsdb and RTG both
    let tempwidget=null;
  if (this.sessionService.preSession.isTsdb == "true"){
    tempwidget=null;
  }
  else{
    tempwidget=widgetComponent.widget;
  }

  if (this.sessionService.preSession.isPartialEnable == "true"){
    partialEnabled=true;
  }



    //zoom handling and widget wise time , no need of previous data
    if (widgetComponent.widget && (widgetComponent.widget.zoomInfo || widgetComponent.widget.compareZoomInfo || (widgetComponent.widget.widgetWiseInfo && !widgetComponent.widget.widgetWiseInfo.secondTime))) {
      previousData = null;

      if(sessionStorage.getItem('opName')){
        sessionStorage.removeItem('opName');
      }
    }


    //case when zoom is already applied, then widget wise, so resetting zoom
  if(widgetComponent.widget &&  widgetComponent.widget.widgetWiseInfo && widgetComponent.widget.zoomInfo && widgetComponent.widget.opName != OP_TYPE_ZOOM){
    widgetComponent.widget.zoomInfo = null;
    widgetComponent.widget.opName = '';
  }

    setTimeout(() => {
      output.next(new DashboardWidgetLoadingState());
    });
      if(dashboardComponent.compareSnapShot){
      widgetComponent.widget.compareData =  dashboardComponent.compareSnapShot;
      }
    if (widgetComponent.widget.compareData != null) {
      if (!dashboardComponent.compareSnapShot) {
        widgetComponent.widget.compareData.compareData.forEach(measurement => {
          measurement.startLastST = undefined;
          measurement.endLastST = undefined;
        });
        dashboardComponent.compareSnapShot = widgetComponent.widget.compareData;
      }
      if (widgetComponent.widget.compareData.trendCompare) {
       //me.getCompareData(dashboardComponent,widgetComponent,output,tempwidget,widgetIndex,previousData);
       //getCompareData(dashboardComponent: DashboardComponent, widgetComponent: DashboardWidgetComponent, output: Subject<Store.State>, tempwidget: any, widgetIndex: number, previousData: DashboardWidgetLoadRes) {
        let me =this;
        let payloadList: any[] = [];
        let type: number;
        let payload:any;
        const viewBy: string = "60";
        let startTime: any = 0;
        let endTime: any = 0;
        if (dashboardComponent.mergeShowGraphInTree && widgetComponent.isSelected) {
          let newGraphCtx = me.getmergeMetricData(dashboardComponent);
          widgetComponent.widget.dataCtx.gCtx.push(newGraphCtx);
          if (widgetComponent.widget.settings.types.graph) {
            type = widgetComponent.widget.settings.types.graph.type;
          }
          const viewBy: string = "60";
          let startTime: any = 0;
          let endTime: any = 0;
          widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
            let path = environment.api.dashboardWidget.load.endpoint;
            if (data.preset.startsWith('SPECIFIED')) {
              let split1 = data.preset.split("_");
              startTime = split1[2];
              endTime = split1[3];
            } else {
              startTime = data.start;
              endTime = data.end;
            }
            const graphTimeKey: string = data.preset;
            /* let graphSetting: any;
            for (const item in widgetComponent.widget.graphSettings) {
              widgetComponent.widget.graphSettings[item].color = data.rowBgColorField;
              graphSetting = widgetComponent.widget.graphSettings[item];
              break;
            } */
            // For Checking Graph Type
             payload = {
              globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
              tsdbCtx: {
                appId: -1,
                avgCount: 0,
                avgCounter: 0,
                cctx: me.sessionService.session.cctx,
                clientId: -1,
                dataFilter: widgetComponent.widget.settings.dataFilter,
                dataCtx: widgetComponent.widget.dataCtx,
                duration: {
                  st: startTime,
                  et: endTime,
                  preset: graphTimeKey,
                  viewBy,
                },
                opType: 11,
                tr: me.sessionService.testRun.id,
              },
              widget: tempwidget, //BugID:104808
              multiDc: false, //me.sessionService.isMultiDC,
              actionForAuditLog: "Trend Compare"
            };
            if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
            {
              payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
              }
            // Modification in payload for incremental updates
            /* if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
              if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
                payload.tsdbCtx.duration.st = startTime;
                payload.tsdbCtx.duration.et = endTime;
              } else {
                payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
                payload.tsdbCtx.duration.et = 0;
              }
            } */
            //setting action as null in case of increment calls.
            if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
              payload.actionForAuditLog = null;
            }
            if (widgetIndex !== undefined || widgetIndex !== null) {
              path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;
              payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
            }
          });
        }
        else if(dashboardComponent.dropTree && widgetComponent.isSelected){

         let newGraphCTX =  me.getDropMetricData(dashboardComponent);
         widgetComponent.widget.dataCtx.gCtx =[];
         widgetComponent.widget.dataCtx.gCtx.push(newGraphCTX);
         let panelCaption = newGraphCTX.measure.metric;
          let caption = "";
          if (newGraphCTX.subject.tags && newGraphCTX.subject.tags.length > 0) {
            for (let i = 0; i < newGraphCTX.subject.tags.length; i++) {
              if (caption == "") {
                caption = " - " + newGraphCTX.subject.tags[i].value;
              } else {
                caption = caption + ">" + newGraphCTX.subject.tags[i].value;
              }
            }
          }

          panelCaption = panelCaption + caption;
          widgetComponent.widget.description = widgetComponent.widget.id = widgetComponent.widget.name = panelCaption;
          widgetComponent.widget.settings.caption.caption = panelCaption;
         if (widgetComponent.widget.settings.types.graph) {
          type = widgetComponent.widget.settings.types.graph.type;
        }

        widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
          let path = environment.api.dashboardWidget.load.endpoint;
          if (data.preset.startsWith('SPECIFIED')) {
            let split1 = data.preset.split("_");
            startTime = split1[2];
            endTime = split1[3];
          } else {
            startTime = data.start;
            endTime = data.end;
          }
          const graphTimeKey: string = data.preset;
          let graphSetting: any;
          for (const item in widgetComponent.widget.graphSettings) {
            widgetComponent.widget.graphSettings[item].color = data.rowBgColorField;
            graphSetting = widgetComponent.widget.graphSettings[item];
            break;
          }
          // For Checking Graph Type
           payload = {
            globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
            tsdbCtx: {
              appId: -1,
              avgCount: 0,
              avgCounter: 0,
              cctx: me.sessionService.session.cctx,
              clientId: -1,
              dataFilter: widgetComponent.widget.settings.dataFilter,
              dataCtx: widgetComponent.widget.dataCtx,
              duration: {
                st: startTime,
                et: endTime,
                preset: graphTimeKey,
                viewBy,
              },
              opType: 11,
              tr: me.sessionService.testRun.id,
            },
            widget: tempwidget, //BugID:104808
            multiDc: false, //me.sessionService.isMultiDC,
            actionForAuditLog: "Trend Compare"
          };
          if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
          {
            payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
            }
          // Modification in payload for incremental updates
          if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
            if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
              payload.tsdbCtx.duration.st = startTime;
              payload.tsdbCtx.duration.et = endTime;
            } else {
              payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
              payload.tsdbCtx.duration.et = 0;
            }
          }
          //setting action as null in case of increment calls.
          if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
            payload.actionForAuditLog = null;
          }
          if (widgetIndex !== undefined || widgetIndex !== null) {
            path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;
            payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
          }
        });
        }
        else if (dashboardComponent.metricData && dashboardComponent.metricData !== null && dashboardComponent.metricData.length > 0 &&!dashboardComponent.mergeShowGraphInTree) {

          //  me.getOpenAdvanceData(dashboardComponent.metricData,widgetComponent.widget,widgetIndex);
          //

            let i =widgetComponent.widget.widgetIndex;
            widgetIndex = i;
            let panelData = [], panelCaption = '';
            previousData=null;
            widgetComponent.widget.isApplyCompare=true;
            if (i < dashboardComponent.metricData.length) {
              if(i==0){
                //  payload.actionForAuditLog = dashboardComponent.featureName;
              }
              if (dashboardComponent.metricData[i] && dashboardComponent.metricData[i].mData) {
                panelData = dashboardComponent.metricData[i].mData;
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
                   widgetComponent.widget.dataCtx.gCtx = [];
                   widgetComponent.widget.dataCtx.gCtx.push(newGraphCTX);

      if (widgetComponent.widget.settings.types.graph) {
        type = widgetComponent.widget.settings.types.graph.type;
      }

      widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
        let path = environment.api.dashboardWidget.load.endpoint;
        if (data.preset.startsWith('SPECIFIED')) {
          let split1 = data.preset.split("_");
          startTime = split1[2];
          endTime = split1[3];
        } else {
          startTime = data.start;
          endTime = data.end;
        }
        const graphTimeKey: string = data.preset;
        let graphSetting: any;
        for (const item in widgetComponent.widget.graphSettings) {
          widgetComponent.widget.graphSettings[item].color = data.rowBgColorField;
          graphSetting = widgetComponent.widget.graphSettings[item];
          break;
        }
        // For Checking Graph Type
         payload = {
          globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
          tsdbCtx: {
            appId: -1,
            avgCount: 0,
            avgCounter: 0,
            cctx: me.sessionService.session.cctx,
            clientId: -1,
            dataFilter: widgetComponent.widget.settings.dataFilter,
            dataCtx: widgetComponent.widget.dataCtx,
            duration: {
              st: startTime,
              et: endTime,
              preset: graphTimeKey,
              viewBy,
            },
            opType: 11,
            tr: me.sessionService.testRun.id,
          },
          widget: tempwidget, //BugID:104808
          multiDc: false, //me.sessionService.isMultiDC,
          actionForAuditLog: "Trend Compare"
        };
        if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
        {
          payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
          }
        // Modification in payload for incremental updates
        if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
          if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
            payload.tsdbCtx.duration.st = startTime;
            payload.tsdbCtx.duration.et = endTime;
          } else {
            payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
            payload.tsdbCtx.duration.et = 0;
          }
        }
        //setting action as null in case of increment calls.
        if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
          payload.actionForAuditLog = null;
        }
        if (widgetIndex !== undefined || widgetIndex !== null) {
          path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;
          payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
        }
      });


                 }
              }
            }
          }
      else  if (dashboardComponent.mergeMetricData && dashboardComponent.mergeMetricData !== null && dashboardComponent.mergeMetricData.length > 0 && widgetComponent.isSelected) {
        widgetIndex = widgetComponent.widget.widgetIndex;
        let panelData = [], panelCaption = '';
        previousData = null;
        widgetComponent.widget.isApplyCompare=true;
        if (dashboardComponent.mergeMetricData[0] && dashboardComponent.mergeMetricData[0].mData) {
          panelData = dashboardComponent.mergeMetricData[0].mData;
          panelCaption = dashboardComponent.mergeMetricData[0].pCaption;
          widgetComponent.widget.graphSettings = {};
          widgetComponent.widget.graphSettings = dashboardComponent.mergeMetricData[0].graphSettings;
          const newft: DashboardDataCTXDataFilter = {
            typ: 0,
            //in: 0,
            opt: "=",
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
            graphSettings: widgetComponent.widget.graphSettings,
            icon: '',
            id: '',
            iconTooltip: "Advance Settings",
            include: true,
            layout: widgetComponent.widget.layout,
            name: '',
            ruleType: 0,
            scaleMode: 1,
            settings: widgetComponent.widget.settings,
            type: "GRAPH",
            widgetIndex: widgetIndex,
            isSelectedWidget: true,
            dropTree: false,
          }
          widgetComponent.widget  = newWidget;
          widgetComponent.widget.dataCtx = newWidget.dataCtx;

          widgetComponent.widget.dataCtx.gCtx= [];
          widgetComponent.widget.graphs.widgetGraphs = [];
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
            widgetComponent.widget.dataCtx.ft = dashboardComponent.filter;
            widgetComponent.widget.dataCtx.gCtx.push(newGraphCTX);
            widgetComponent.widget.dataCtx = payload.tsdbCtx.dataCtx;
            const newwidgetGraphs: DashboardWidgetGraph = {
              vecName: panelData[idx].vectorName,
              glbMetricId: panelData[idx].glbMetricId,
              graphId: panelData[idx].measure.metricId,
              groupId: dashboardComponent.groupID,
            }
            widgetComponent.widget.graphs.widgetGraphs.push(newwidgetGraphs);
            widgetComponent.widget.description = widgetComponent.widget.id = widgetComponent.widget.name = panelCaption;
            widgetComponent.widget.settings.caption.caption = panelCaption;
            widgetComponent.widget.settings.graphStatsType = dashboardComponent.graphStatsType.toString();
            widgetComponent.widget.include = dashboardComponent.Include;

            if (widgetComponent.widget.settings.types.graph) {
              type = widgetComponent.widget.settings.types.graph.type;
            }
            //const measurementName = duplicateWidget.widget.dataCtx.gCtx[0].measure.metric ;
            widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
              let path = environment.api.dashboardWidget.load.endpoint;
              if (data.preset.startsWith('SPECIFIED')) {
                let split1 = data.preset.split("_");
                startTime = split1[2];
                endTime = split1[3];
              } else {
                startTime = data.start;
                endTime = data.end;
              }
              const graphTimeKey: string = data.preset;
              let graphSetting: any;
              for (const item in widgetComponent.widget.graphSettings) {
                widgetComponent.widget.graphSettings[item].color = data.rowBgColorField;
                graphSetting = widgetComponent.widget.graphSettings[item];
                break;
              }
              // For Checking Graph Type
               payload = {
                globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
                tsdbCtx: {
                  appId: -1,
                  avgCount: 0,
                  avgCounter: 0,
                  cctx: me.sessionService.session.cctx,
                  clientId: -1,
                  dataFilter: widgetComponent.widget.settings.dataFilter,
                  dataCtx: widgetComponent.widget.dataCtx,
                  duration: {
                    st: startTime,
                    et: endTime,
                    preset: graphTimeKey,
                    viewBy,
                  },
                  opType: 11,
                  tr: me.sessionService.testRun.id,
                },
                widget: tempwidget, //BugID:104808
                multiDc: false, //me.sessionService.isMultiDC,
                actionForAuditLog: "Trend Compare"
              };
              if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
              {
                payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
                }
              // Modification in payload for incremental updates
              if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
                if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
                  payload.tsdbCtx.duration.st = startTime;
                  payload.tsdbCtx.duration.et = endTime;
                } else {
                  payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
                  payload.tsdbCtx.duration.et = 0;
                }
              }
              //setting action as null in case of increment calls.
              if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
                payload.actionForAuditLog = null;
              }
              if (widgetIndex !== undefined || widgetIndex !== null) {
                path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;
                payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
              }
            });
          }
        }
      }
      else{
        if (widgetComponent.widget.settings.types.graph) {
          type = widgetComponent.widget.settings.types.graph.type;
        }

        // console.log("duplicateWidget.widget---->",widgetComponent.widget);
        //const measurementName = duplicateWidget.widget.dataCtx.gCtx[0].measure.metric ;
        widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
          let path = environment.api.dashboardWidget.load.endpoint;
          if (data.preset.startsWith('SPECIFIED')) {
            let split1 = data.preset.split("_");
            startTime = split1[2];
            endTime = split1[3];
          } else {
            startTime = data.start;
            endTime = data.end;
          }
          const graphTimeKey: string = data.preset;
          let graphSetting: any;
          for (const item in widgetComponent.widget.graphSettings) {
            widgetComponent.widget.graphSettings[item].color = data.rowBgColorField;
            graphSetting = widgetComponent.widget.graphSettings[item];
            break;
          }
          // For Checking Graph Type
           payload = {
            globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
            tsdbCtx: {
              appId: -1,
              avgCount: 0,
              avgCounter: 0,
              cctx: me.sessionService.session.cctx,
              clientId: -1,
              dataFilter: widgetComponent.widget.settings.dataFilter,
              dataCtx: widgetComponent.widget.dataCtx,
              duration: {
                st: startTime,
                et: endTime,
                preset: graphTimeKey,
                viewBy,
              },
              opType: 11,
              tr: me.sessionService.testRun.id,
            },
            widget: tempwidget, //BugID:104808
            multiDc: false, //me.sessionService.isMultiDC,
            actionForAuditLog: "Trend Compare"
          };
          if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
          {
            payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
            }
          // Modification in payload for incremental updates
          if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
            if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
              payload.tsdbCtx.duration.st = startTime;
              payload.tsdbCtx.duration.et = endTime;
            } else {
              payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
              payload.tsdbCtx.duration.et = 0;
            }
          }
          //setting action as null in case of increment calls.
          if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
            payload.actionForAuditLog = null;
          }
          if (widgetIndex !== undefined || widgetIndex !== null) {
            path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;
            payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
          }
        });
}
        let subscription = forkJoin(payloadList.map(payloadData => me.controller.post(payloadData.path, payloadData.payload))).subscribe(
          res => {
            const graphData = ObjectUtility.duplicate(res);
            for (let idx = 0; idx < graphData.length; idx++) {
              for (let num = 0; num < graphData[idx].grpData.mFrequency[0].data.length; num++) {
                graphData[idx].grpData.mFrequency[0].data[num].avg = [];
                graphData[idx].grpData.mFrequency[0].data[num].min = [];
                graphData[idx].grpData.mFrequency[0].data[num].max = [];
                graphData[idx].grpData.mFrequency[0].data[num].count = [];
                graphData[idx].grpData.mFrequency[0].data[num].sumCount = [];

              }
            }

            let avg: number = 0;
            let size: number = 0;
            let min: number = 0;
            let max: number = 0;
            let count: number = 0;
            let sumCount: number = 0;
            for (let idx = 0; idx < res.length; idx++) {
              for (let num = 0; num < res[idx].grpData.mFrequency[0].data.length; num++) {
                for (let i = 0; i < widgetComponent.widget.settings.graphStatsType.length; i++) {
                  if (widgetComponent.widget.settings.graphStatsType[i] === '0') {
                    for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].avg.length; k++) {
                      if (res[idx].grpData.mFrequency[0].data[num].avg[k] === -123456789) {
                        res[idx].grpData.mFrequency[0].data[num].avg[k] = 0;
                      }
                      avg += res[idx].grpData.mFrequency[0].data[num].avg[k];
                      size = res[idx].grpData.mFrequency[0].data[num].avg.length;
                    }
                    graphData[0].grpData.mFrequency[0].data[num].avg.push(Math.round(((avg / size) + Number.EPSILON) * 100) / 100);
                  }
                  if (widgetComponent.widget.settings.graphStatsType[i] === '1') {
                    for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].min.length; k++) {
                      if (res[idx].grpData.mFrequency[0].data[num].min[k] === -123456789) {
                        res[idx].grpData.mFrequency[0].data[num].min[k] = 0;
                      }
                      min += res[idx].grpData.mFrequency[0].data[num].min[k];
                      size = res[idx].grpData.mFrequency[0].data[num].min.length;
                    }
                    graphData[0].grpData.mFrequency[0].data[num].min.push(Math.round(((min / size) + Number.EPSILON) * 100) / 100);
                  }
                  if (widgetComponent.widget.settings.graphStatsType[i] === '2') {
                    for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].max.length; k++) {
                      if (res[idx].grpData.mFrequency[0].data[num].max[k] === -123456789) {
                        res[idx].grpData.mFrequency[0].data[num].max[k] = 0;
                      }
                      max += res[idx].grpData.mFrequency[0].data[num].max[k];
                      size = res[idx].grpData.mFrequency[0].data[num].max.length;
                    }
                    graphData[0].grpData.mFrequency[0].data[num].max.push(Math.round(((max / size) + Number.EPSILON) * 100) / 100);
                  }
                  if (widgetComponent.widget.settings.graphStatsType[i] === '3') {
                    for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].count.length; k++) {
                      if (res[idx].grpData.mFrequency[0].data[num].count[k] === -123456789) {
                        res[idx].grpData.mFrequency[0].data[num].count[k] = 0;
                      }
                      count += res[idx].grpData.mFrequency[0].data[num].count[k];
                      size = res[idx].grpData.mFrequency[0].data[num].count.length;
                    }
                    graphData[0].grpData.mFrequency[0].data[num].count.push(Math.round(((count / size) + Number.EPSILON) * 100) / 100);
                  }
                  if (widgetComponent.widget.settings.graphStatsType[i] === '4') {
                    for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].sumCount.length; k++) {
                      if (res[idx].grpData.mFrequency[0].data[num].sumCount[k] === -123456789) {
                        res[idx].grpData.mFrequency[0].data[num].sumCount[k] = 0;
                      }
                      sumCount += res[idx].grpData.mFrequency[0].data[num].sumCount[k];
                      size = res[idx].grpData.mFrequency[0].data[num].sumCount.length;
                    }
                    graphData[0].grpData.mFrequency[0].data[num].sumCount.push(Math.round(((sumCount / size) + Number.EPSILON) * 100) / 100);
                  }
                }

              }
              avg = 0;
              min = 0;
              max = 0;
              count = 0;
              sumCount = 0;
              graphData[0].grpData.mFrequency[0].trend = widgetComponent.widget.compareData.trendCompare;
              graphData[0].grpData.mFrequency[0].measurementName = widgetComponent.widget.compareData.compareData;
            }
            me.interceptor.onDashboardWidgetLoaded(
              graphData[0],
              previousData,
              dashboardComponent,
              widgetComponent,

              (data: DashboardWidgetLoadRes) => {
                // Calculate min freq & collect all graphs
                let minFrequency: MFrequencyTsDetails = null;

                if (data && data.grpData && data.grpData.mFrequency) {
                  for (const mFrequency of data.grpData.mFrequency) {
                    if (
                      !minFrequency ||
                      (minFrequency &&
                        minFrequency.frequency >= mFrequency.tsDetail.frequency)
                    ) {
                      minFrequency = mFrequency.tsDetail;
                    }
                  }
                }

                if (minFrequency) {
                  // ((minFrequency * (count-1))*1000+ startTime)
                  data.grpData.lastSampleTimeStamp =
                    minFrequency.frequency * (minFrequency.count - 1) * 1000 +
                    minFrequency.st;
                }

                // Save requested viewBy
                data.grpData.viewBy = viewBy;
                output.next(new DashboardWidgetLoadedState(data));
                output.complete();
              },
              (error: AppError) => {
                output.error(new DashboardWidgetLoadingErrorState(error));
                output.complete();
              }
            );

          },
          (e: any) => {
            output.error(new DashboardWidgetLoadingErrorState(e));
            output.complete();

            me.logger.error('Dashboard widget loading failed', e);
          }
        );
        output.next(new DashboardWidgetLoadingSubscriptionState(subscription));
        return output;
      //}
      }
      else {
        let duplicateWidget = ObjectUtility.duplicate({ widget: widgetComponent.widget });
        let payload:any;
        let advanceopenMergeOp:boolean =false;
        let viewBy: number = 60;
        viewBy = widgetComponent.widget.compareData.viewByValue;
        let startTime: any = 0;
        let endTime: any = 0;
        let payloadList: any[] = [];
        let type: number;
        //me.previousCompareData =null;
          if (dashboardComponent.metricData){
            advanceopenMergeOp=true;
          }
          else{
          if(previousData===null || previousData===undefined){
          duplicateWidget.widget.dataCtx.gCtx.splice(1, duplicateWidget.widget.dataCtx.gCtx.length);
          //duplicateWidget.widget.graphs.widgetGraphs.splice(1, duplicateWidget.widget.graphs.widgetGraphs.length);
         me.tempWidgetforStoringWidgetInfo = ObjectUtility.duplicate({widget :duplicateWidget.widget });
            }
          }
         /* if(previousData && dashboardComponent.mergeShowGraphInTree){
          me.previousCompareData = previousData;
         } */

       if (dashboardComponent.mergeShowGraphInTree && widgetComponent.isSelected) {
         let newGraphCtx = me.getmergeMetricData(dashboardComponent);

        duplicateWidget.widget.dataCtx.gCtx = [];
        widgetComponent.widget.isApplyCompare=true;
        this.checkAlreadyPresentGraph(duplicateWidget,dashboardComponent,newGraphCtx);

          if (dashboardComponent.mergeShowGraphInTree == true) {
            duplicateWidget.widget.dataCtx.gCtx.push(newGraphCtx);
          }
        previousData =null;
        if (duplicateWidget.widget.settings.types.graph) {
          type = duplicateWidget.widget.settings.types.graph.type;
        }
        widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
          // duplicateWidget.widget.dataCtx.gCtx[0].measure.metric=  data.name +"-"+ measurementName;
          let path = environment.api.dashboardWidget.load.endpoint;
          if (data.preset.startsWith('SPECIFIED')) {
            let split1 = data.preset.split("_");
            startTime = split1[2];
            endTime = split1[3];
          }
          else {
            if (previousData && data.startLastST && data.endLastST && !widgetComponent.widget.compareZoomInfo) {
              startTime = data.startLastST;
              endTime = data.endLastST;
            }
            else {
              startTime = data.start;
              endTime = data.end;
            }
          }
          const graphTimeKey: string = data.preset;
          let graphSetting: any;
           payload = {
            globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
            tsdbCtx: {
              appId: -1,
              avgCount: 0,
              avgCounter: 0,
              cctx: me.sessionService.session.cctx,
              clientId: -1,
              dataFilter: duplicateWidget.widget.settings.dataFilter,
              dataCtx: duplicateWidget.widget.dataCtx,
              duration: {
                st: startTime,
                et: endTime,
                preset: graphTimeKey,
                viewBy,
              },
              opType: 11,
              tr: me.sessionService.testRun.id,
            },
            widget: tempwidget, //BugID:104808
            multiDc: false, //me.sessionService.isMultiDC,
            actionForAuditLog: "Normal Compare"
          };
          if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
        {
            payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
        }
          // Modification in payload for incremental updates
          /* if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
            if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
              payload.tsdbCtx.duration.st = startTime;
              payload.tsdbCtx.duration.et = endTime;
            } else {
              payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
              payload.tsdbCtx.duration.et = 0;
            }
          } */
          //setting action as null in case of increment calls.
          if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
            payload.actionForAuditLog = null;
          }
          if (widgetIndex !== undefined || widgetIndex !== null) {
            path += '?t=' + new Date().valueOf() + '&pn=' + widgetIndex;
            payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
          }
      // //zoom handling

        });
        }
       else if (dashboardComponent.metricData && dashboardComponent.metricData !== null && dashboardComponent.metricData.length > 0 &&!dashboardComponent.mergeShowGraphInTree) {

            //  me.getOpenAdvanceData(dashboardComponent.metricData,widgetComponent.widget,widgetIndex);
            //
              let i =widgetComponent.widget.widgetIndex;
              widgetIndex = i;
              let panelData = [], panelCaption = '';
              previousData=null;
              widgetComponent.widget.isApplyCompare=true;
              if (i < dashboardComponent.metricData.length) {
                if(i==0){
                  //  payload.actionForAuditLog = dashboardComponent.featureName;
                }
                if (dashboardComponent.metricData[i] && dashboardComponent.metricData[i].mData) {
                  panelData = dashboardComponent.metricData[i].mData;
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
                     duplicateWidget.widget.dataCtx.gCtx = [];
                    duplicateWidget.widget.dataCtx.gCtx.push(newGraphCTX);

        if (duplicateWidget.widget.settings.types.graph) {
          type = duplicateWidget.widget.settings.types.graph.type;
        }


        widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
          // duplicateWidget.widget.dataCtx.gCtx[0].measure.metric=  data.name +"-"+ measurementName;
          let path = environment.api.dashboardWidget.load.endpoint;
          if (data.preset.startsWith('SPECIFIED')) {
            let split1 = data.preset.split("_");
            startTime = split1[2];
            endTime = split1[3];
          }
          else {
            if (previousData && data.startLastST && data.endLastST && !widgetComponent.widget.compareZoomInfo) {
              startTime = data.startLastST;
              endTime = data.endLastST;
            }
            else {
              startTime = data.start;
              endTime = data.end;
            }
          }
          const graphTimeKey: string = data.preset;
          let graphSetting: any;
           payload = {
            globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
            tsdbCtx: {
              appId: -1,
              avgCount: 0,
              avgCounter: 0,
              cctx: me.sessionService.session.cctx,
              clientId: -1,
              dataFilter: duplicateWidget.widget.settings.dataFilter,
              dataCtx: duplicateWidget.widget.dataCtx,
              duration: {
                st: startTime,
                et: endTime,
                preset: graphTimeKey,
                viewBy,
              },
              opType: 11,
              tr: me.sessionService.testRun.id,
            },
            widget: tempwidget, //BugID:104808
            multiDc: false, //me.sessionService.isMultiDC,
            actionForAuditLog: "Normal Compare"
          };
          if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
        {
            payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
        }
          // Modification in payload for incremental updates
          /* if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
            if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
              payload.tsdbCtx.duration.st = startTime;
              payload.tsdbCtx.duration.et = endTime;
            } else {
              payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
              payload.tsdbCtx.duration.et = 0;
            }
          } */
          //setting action as null in case of increment calls.
          if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
            payload.actionForAuditLog = null;
          }
          if (widgetIndex !== undefined || widgetIndex !== null) {
            path += '?t=' + new Date().valueOf() + '&pn=' + widgetIndex;
            payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
          }
      // //zoom handling

        });


                   }
                }
              }
            }
        else  if (dashboardComponent.mergeMetricData && dashboardComponent.mergeMetricData !== null && dashboardComponent.mergeMetricData.length > 0 && widgetComponent.isSelected) {
          widgetIndex = widgetComponent.widget.widgetIndex;
          let panelData = [], panelCaption = '';
          previousData = null;
          widgetComponent.widget.isApplyCompare=true;
          if (dashboardComponent.mergeMetricData[0] && dashboardComponent.mergeMetricData[0].mData) {
            panelData = dashboardComponent.mergeMetricData[0].mData;
            panelCaption = dashboardComponent.mergeMetricData[0].pCaption;
            duplicateWidget.widget.graphSettings = {};
            duplicateWidget.widget.graphSettings = dashboardComponent.mergeMetricData[0].graphSettings;
            const newft: DashboardDataCTXDataFilter = {
              typ: 0,
              //in: 0,
              opt: "=",
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
              graphSettings: widgetComponent.widget.graphSettings,
              icon: '',
              id: '',
              iconTooltip: "Advance Settings",
              include: true,
              layout: widgetComponent.widget.layout,
              name: '',
              ruleType: 0,
              scaleMode: 1,
              settings: widgetComponent.widget.settings,
              type: "GRAPH",
              widgetIndex: widgetIndex,
              isSelectedWidget: true,
              dropTree: false,
            }
            widgetComponent.widget  = newWidget;
            duplicateWidget.widget.dataCtx = newWidget.dataCtx;

            duplicateWidget.widget.dataCtx.gCtx= [];
            duplicateWidget.widget.graphs.widgetGraphs = [];
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
              duplicateWidget.widget.dataCtx.ft = dashboardComponent.filter;
              duplicateWidget.widget.dataCtx.gCtx.push(newGraphCTX);
              duplicateWidget.widget.dataCtx = payload.tsdbCtx.dataCtx;
              const newwidgetGraphs: DashboardWidgetGraph = {
                vecName: panelData[idx].vectorName,
                glbMetricId: panelData[idx].glbMetricId,
                graphId: panelData[idx].measure.metricId,
                groupId: dashboardComponent.groupID,
              }
              duplicateWidget.widget.graphs.widgetGraphs.push(newwidgetGraphs);
              duplicateWidget.widget.description = widgetComponent.widget.id = widgetComponent.widget.name = panelCaption;
              duplicateWidget.widget.settings.caption.caption = panelCaption;
              duplicateWidget.widget.settings.graphStatsType = dashboardComponent.graphStatsType.toString();
              duplicateWidget.widget.include = dashboardComponent.Include;

              if (duplicateWidget.widget.settings.types.graph) {
                type = duplicateWidget.widget.settings.types.graph.type;
              }
              //const measurementName = duplicateWidget.widget.dataCtx.gCtx[0].measure.metric ;
              widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
                // duplicateWidget.widget.dataCtx.gCtx[0].measure.metric=  data.name +"-"+ measurementName;
                let path = environment.api.dashboardWidget.load.endpoint;
                if (data.preset.startsWith('SPECIFIED')) {
                  let split1 = data.preset.split("_");
                  startTime = split1[2];
                  endTime = split1[3];
                }
                else {
                  if (previousData && data.startLastST && data.endLastST && !widgetComponent.widget.compareZoomInfo) {
                    startTime = data.startLastST;
                    endTime = data.endLastST;
                  }
                  else {
                    startTime = data.start;
                    endTime = data.end;
                  }
                }
                const graphTimeKey: string = data.preset;
                let graphSetting: any;
                 payload = {
                  globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
                  tsdbCtx: {
                    appId: -1,
                    avgCount: 0,
                    avgCounter: 0,
                    cctx: me.sessionService.session.cctx,
                    clientId: -1,
                    dataFilter: duplicateWidget.widget.settings.dataFilter,
                    dataCtx: duplicateWidget.widget.dataCtx,
                    duration: {
                      st: startTime,
                      et: endTime,
                      preset: graphTimeKey,
                      viewBy,
                    },
                    opType: 11,
                    tr: me.sessionService.testRun.id,
                  },
                  widget: tempwidget, //BugID:104808
                  multiDc: false, //me.sessionService.isMultiDC,
                  actionForAuditLog: "Normal Compare"
                };
                if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
              {
                  payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
              }
                // Modification in payload for incremental updates
                /* if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
                  if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
                    payload.tsdbCtx.duration.st = startTime;
                    payload.tsdbCtx.duration.et = endTime;
                  } else {
                    payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
                    payload.tsdbCtx.duration.et = 0;
                  }
                } */
                //setting action as null in case of increment calls.
                if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
                  payload.actionForAuditLog = null;
                }
                if (widgetIndex !== undefined || widgetIndex !== null) {
                  path += '?t=' + new Date().valueOf() + '&pn=' + widgetIndex;
                  payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
                }
            // //zoom handling

              });
            }
          }
        }
       else if(dashboardComponent.dropTree && widgetComponent.isSelected){
          previousData = null;
         let newGraphCTX =  me.getDropMetricData(dashboardComponent);
          duplicateWidget.widget.dataCtx.gCtx = [];
          widgetComponent.widget.isApplyCompare=true;
          duplicateWidget.widget.dataCtx.gCtx.push(newGraphCTX);
          if (duplicateWidget.widget.settings.types.graph) {
            type = duplicateWidget.widget.settings.types.graph.type;
          }

          let panelCaption = newGraphCTX.measure.metric;
          let caption = "";
          if (newGraphCTX.subject.tags && newGraphCTX.subject.tags.length > 0) {
            for (let i = 0; i < newGraphCTX.subject.tags.length; i++) {
              if (caption == "") {
                caption = " - " + newGraphCTX.subject.tags[i].value;
              } else {
                caption = caption + ">" + newGraphCTX.subject.tags[i].value;
              }
            }
          }

          panelCaption = panelCaption + caption;
          widgetComponent.widget.description = widgetComponent.widget.id = widgetComponent.widget.name = panelCaption;
          widgetComponent.widget.settings.caption.caption = panelCaption;

          //const measurementName = duplicateWidget.widget.dataCtx.gCtx[0].measure.metric ;
          widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
            // duplicateWidget.widget.dataCtx.gCtx[0].measure.metric=  data.name +"-"+ measurementName;
            let path = environment.api.dashboardWidget.load.endpoint;
            if (data.preset.startsWith('SPECIFIED')) {
              let split1 = data.preset.split("_");
              startTime = split1[2];
              endTime = split1[3];
            }
            else {
              if (previousData && data.startLastST && data.endLastST && !widgetComponent.widget.compareZoomInfo) {
                startTime = data.startLastST;
                endTime = data.endLastST;
              }
              else {
                startTime = data.start;
                endTime = data.end;
              }
            }
            const graphTimeKey: string = data.preset;
            let graphSetting: any;
             payload = {
              globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
              tsdbCtx: {
                appId: -1,
                avgCount: 0,
                avgCounter: 0,
                cctx: me.sessionService.session.cctx,
                clientId: -1,
                dataFilter: duplicateWidget.widget.settings.dataFilter,
                dataCtx: duplicateWidget.widget.dataCtx,
                duration: {
                  st: startTime,
                  et: endTime,
                  preset: graphTimeKey,
                  viewBy,
                },
                opType: 11,
                tr: me.sessionService.testRun.id,
              },
              widget: tempwidget, //BugID:104808
              multiDc: false, //me.sessionService.isMultiDC,
              actionForAuditLog: "Normal Compare"
            };
            if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
          {
              payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
          }
            // Modification in payload for incremental updates
            /* if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval && !widgetComponent.widget.compareZoomInfo) {
              if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
                payload.tsdbCtx.duration.st = startTime;
                payload.tsdbCtx.duration.et = endTime;
              } else {
                payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
                payload.tsdbCtx.duration.et = 0;
              }
            } */
            //setting action as null in case of increment calls.
            if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
              payload.actionForAuditLog = null;
            }
            if (widgetIndex !== undefined || widgetIndex !== null) {
              path += '?t=' + new Date().valueOf() + '&pn=' + widgetIndex;
              payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
            }
        // //zoom handling

          });
           }
       else{
        if (duplicateWidget.widget.settings.types.graph) {
          type = duplicateWidget.widget.settings.types.graph.type;
        }
        widgetComponent.widget.isApplyCompare=true;
        //const measurementName = duplicateWidget.widget.dataCtx.gCtx[0].measure.metric ;
        widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
          // duplicateWidget.widget.dataCtx.gCtx[0].measure.metric=  data.name +"-"+ measurementName;
          let path = environment.api.dashboardWidget.load.endpoint;
          if (data.preset.startsWith('SPECIFIED')) {
            let split1 = data.preset.split("_");
            startTime = split1[2];
            endTime = split1[3];
          }
          else {
             if (previousData && data.startLastST && data.endLastST && !widgetComponent.widget.compareZoomInfo){
              startTime = data.startLastST;
               if (data.preset.startsWith('LIVE'))
                 endTime = 0;
               else
                endTime = data.endLastST;
            }
            else{
              startTime = data.start;
              endTime = data.end;
            }
          }
          if (previousData && data.viewByValue)
            viewBy = data.viewByValue;
          const graphTimeKey: string = data.preset;
          let graphSetting: any;
           payload = {
            globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
            tsdbCtx: {
              appId: -1,
              avgCount: 0,
              avgCounter: 0,
              cctx: me.sessionService.session.cctx,
              clientId: -1,
              dataFilter: duplicateWidget.widget.settings.dataFilter,
              dataCtx: duplicateWidget.widget.dataCtx,
              duration: {
                st: startTime,
                et: endTime,
                preset: graphTimeKey,
                viewBy,
              },
              opType: 11,
              tr: me.sessionService.testRun.id,
            },
            widget: tempwidget, //BugID:104808
            multiDc: false, //me.sessionService.isMultiDC,
            actionForAuditLog: "Normal Compare"
          };
          if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
          {
            payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
          }
          if (partialEnabled) {
            if (!payload.tsdbCtx.dataFilter.includes(13))
              payload.tsdbCtx.dataFilter.push(13);
          }
          //setting action as null in case of increment calls.
          if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
            payload.actionForAuditLog = null;
          }
          if (widgetIndex !== undefined || widgetIndex !== null) {
            path += '?t=' + new Date().valueOf() + '&pn=' + widgetIndex;
            payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
          }
        });
      }
        const ttl = this.sessionService.getInterval('progressInterval');
        let subscription = forkJoin(payloadList.map(payloadData => me.controller.post(payloadData.path, payloadData.payload))).subscribe(
          res => {
            let iMax = res.length - 1;
            let compareFrequencyData: DashboardWidgetLoadRes;
            for (let cIdx = 0; cIdx < res.length; cIdx++) {
              const compareData: DashboardWidgetLoadRes = res[cIdx];
              if (compareData && compareData.grpData && compareData.grpData.mFrequency) {
                for (let mFIndex = 0; mFIndex < compareData.grpData.mFrequency.length; mFIndex++) {
                  let mFreq: DashboardGraphDataMFrequency = compareData.grpData.mFrequency[mFIndex];
                  let tsDetail = mFreq.tsDetail;
                  const isNotLiveData = this.updateCompareLastStartEndST(dashboardComponent, widgetComponent, previousData, mFreq, tsDetail, cIdx, ttl);
                  if (isNotLiveData && !widgetComponent.widget.compareData.compareData[cIdx].preset.startsWith('LIVE'))
                    mFreq.tsDetail.frequency = -1;
                  if (!compareFrequencyData) {
                    compareFrequencyData = ObjectUtility.duplicate(compareData);
                  }
                  else {
                    compareFrequencyData.grpData.mFrequency.push(mFreq);
                  }
                }
              }
              if (cIdx == iMax) {
                if (!compareFrequencyData)
                  compareFrequencyData = compareData;
                widgetComponent.widget.compareData.compareData = [...dashboardComponent.compareSnapShot.compareData];
                me.interceptor.onDashboardWidgetLoaded(
                  compareFrequencyData,
                  previousData,
                  dashboardComponent,
                  widgetComponent,
                  (data: DashboardWidgetLoadRes) => {
                    let minFrequency: MFrequencyTsDetails = null;
                    if (data && data.grpData && data.grpData.mFrequency) {
                      for (const mFrequency of data.grpData.mFrequency) {
                        if (
                          !minFrequency ||
                          (minFrequency &&
                            minFrequency.frequency >= mFrequency.tsDetail.frequency)
                        ) {
                          minFrequency = mFrequency.tsDetail;
                        }
                      }
                    }

                    if (minFrequency) {
                      data.grpData.lastSampleTimeStamp = minFrequency.frequency * (minFrequency.count - 1) * 1000 + minFrequency.st;
                    }
                    // Save requested viewBy
                    data.grpData.viewBy = viewBy + "";
                    output.next(new DashboardWidgetLoadedState(data));
                    output.complete();
                  },
                  (error: AppError) => {
                    output.error(new DashboardWidgetLoadingErrorState(error));
                    output.complete();
                  }
                );
              }
            }
          },
          (e: any) => {
            output.error(new DashboardWidgetLoadingErrorState(e));
            output.complete();

            me.logger.error('Dashboard widget loading failed', e);
          }
        );
        output.next(new DashboardWidgetLoadingSubscriptionState(subscription));
        return output;
      }
    }
    else {
      let path = environment.api.dashboardWidget.load.endpoint;
      // check widget time
      let startTime = 0;
      let endTime = 0;
      let viewBy = "";
      let graphTimeKey = "";
      const dashboardTime: DashboardTime = dashboardComponent.getTime(); // TODO: widget time instead of dashboard

      if(me.sessionService.copyLinkParam && me.sessionService.copyLinkParam.requestFrom === 'CopyLink' ){
        startTime = me.sessionService.copyLinkParam.st;
        endTime = me.sessionService.copyLinkParam.et;
        graphTimeKey = me.sessionService.copyLinkParam.preset;
        viewBy = me.sessionService.copyLinkParam.viewBy;
      }
//       else if(dashboardComponent.patternMatchingFlag){
//         //if( this.patternMatchingService.widget.widget.zoomInfo && this.patternMatchingService.widget.widget.zoomInfo.isZoom ){
//          //startTime =this.patternMatchingService.widget.widget.zoomInfo.times[0].zoomSt;
//          //endTime =this.patternMatchingService.widget.widget.zoomInfo.times[0].zoomEt;
//          graphTimeKey = "SPECIFIED_TIME_" +dashboardTime.time.frameStart.value+ "_" +dashboardTime.time.frameEnd.value;
//          viewBy = _.get(dashboardTime, 'viewBy', null);
//  //dashboardTime.time.frameStart.value = this.patternMatchingService.widget.widget.zoomInfo.times[0].zoomSt;
//          //dashboardTime.time.frameEnd.value =this.patternMatchingService.widget.widget.zoomInfo.times[0].zoomEt;
//          dashboardTime.graphTimeKey =graphTimeKey;
//          dashboardTime.graphTimeLabel ="Custom Time";
//          console.log("dashboardTime-------->",dashboardTime);
//          this.timebarService.tmpValue.time.frameStart.value=dashboardTime.time.frameStart.value;
//          startTime = this.timebarService.tmpValue.time.frameStart.value;
//          this.timebarService.tmpValue.time.frameEnd.value=dashboardTime.time.frameEnd.value;
//          endTime =this.timebarService.tmpValue.time.frameEnd.value;
//          this.timebarService.tmpValue.timePeriod.selected.label =dashboardTime.graphTimeLabel;
//          this.timebarService.tmpValue.timePeriod.selected.id =graphTimeKey;


//          //}
//        }
      else{
      startTime = _.get(
        dashboardTime,
        'time.frameStart.value',
        null
      );
      endTime = _.get(dashboardTime, 'time.frameEnd.value', null);
      graphTimeKey = _.get(dashboardTime, 'graphTimeKey', null);
      viewBy = _.get(dashboardTime, 'viewBy', null);

      }

      // For Checking Graph Type
      let type: number;
      if (widgetComponent.widget.settings.types.graph) {
        type = widgetComponent.widget.settings.types.graph.type;
      }


      const payload = {
        globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
        tsdbCtx: {
          appId: -1,
          avgCount: 0, // Data
          avgCounter: 0, // Data
          cctx: me.sessionService.session.cctx,
          clientId: -1,
          dataFilter: widgetComponent.widget.settings.dataFilter, // widget setting
          dataCtx: widgetComponent.widget.dataCtx,
          duration: {
            st: startTime,
            et: endTime,
            preset: graphTimeKey,
            viewBy,
          },
          opType: 11, // Data
          tr: me.sessionService.testRun.id,
        },
        widget: tempwidget, //BugID:104808
        multiDc: false, //me.sessionService.isMultiDC,
        actionForAuditLog: null
      };
      if(widgetComponent.widget.settings.dataSourceType.toLowerCase() == 'log') {
        payload['dataSourceCtx'] = {
          nfWidgetQuery: widgetComponent.widget.settings.nfWidgetQuery,
          nfIndexPattern: widgetComponent.widget.settings.nfIndexPattern,
          queryHostPortValue: widgetComponent.widget.settings.queryHostPortValue,
        }
      }
if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
{
  payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
}

//filter
if( widgetComponent.widget.settings.widgetFilter && widgetComponent.widget.settings.widgetFilter.enabled){
  let filtertype = [];
  let criteria : number = 0;
  switch(widgetComponent.widget.settings.widgetFilter.criteria){
    case "Avg" :
      criteria = 0;
      break;
      case "Min":
        criteria = 1;
        break;
        case "Max":
          criteria = 2;
          break;
          case "Count":
            criteria = 3;
            break;
  }
  //let includeValue = widgetComponent.widget.settings.widgetFilter.include ? 7 : 7;
 filtertype.push(criteria);
 if(widgetComponent.widget.settings.widgetFilter.include){
 filtertype.push(7); // for include we have 7 , for exclude no need to send any value
 }
 if(payload.tsdbCtx.dataCtx){
  payload.tsdbCtx.dataCtx.ft = {};
  payload.tsdbCtx.dataCtx.ft.in = widgetComponent.widget.settings.widgetFilter.include;
  payload.tsdbCtx.dataCtx.ft.opt = widgetComponent.widget.settings.widgetFilter.operator;
  payload.tsdbCtx.dataCtx.ft.val1 = widgetComponent.widget.settings.widgetFilter.firstValue;
  payload.tsdbCtx.dataCtx.ft.val2 = widgetComponent.widget.settings.widgetFilter.secondValue;
  payload.tsdbCtx.dataCtx.ft.typ = filtertype;
  var n = payload.tsdbCtx.dataFilter.includes(11);
  if(!n && widgetComponent.widget.settings.widgetFilter.enabled){
  payload.tsdbCtx.dataFilter.push(11);
  }
if(!widgetComponent.widget.settings.widgetFilter.enabled){
  var n = payload.tsdbCtx.dataFilter.includes(11);
  if(n){
    payload.tsdbCtx.dataFilter.pop();
  }
}
  //payload.tsdbCtx.dataFilter.push(11);
}
}

if(payload.tsdbCtx.dataCtx && payload.tsdbCtx.dataCtx.ft && payload.tsdbCtx.dataCtx.ft.typ.length == 0)
{
  delete payload.tsdbCtx.dataCtx["ft"];
}
      //widget wise time handling

      if(sessionStorage.getItem('opName'))   {
        if(widgetComponent.widget.opName != OP_TYPE_WIDGET_WISE)
        widgetComponent.widget.opName = sessionStorage.getItem('opName');
        // sessionStorage.removeItem('opName');
      }
      if (me.timebarService.isTimeChangedFromGlobal && widgetComponent.widget.opName == OP_TYPE_GLOBAL_TIME) {

        if(widgetComponent.widget.widgetIndex == (dashboardComponent.data.favDetailCtx.widgets.length - 1)){
          me.timebarService.isTimeChangedFromGlobal = false;
        }
        if (widgetComponent.widget.widgetWiseInfo) {
          widgetComponent.widget.widgetWiseInfo = null;
          widgetComponent.widget.opName = '';
          // me.timebarService.isTimeChangedFromGlobal = false;
        }
        if (widgetComponent.widget.zoomInfo) {
          widgetComponent.widget.zoomInfo = null;
          widgetComponent.widget.opName = '';
        }
      }

      //case of widget wise time
      if(!me.timebarService.isTimeChangedFromGlobal && widgetComponent.widget && widgetComponent.widget.widgetWiseInfo && widgetComponent.widget.widgetWiseInfo.duration){
        startTime = widgetComponent.widget.widgetWiseInfo.duration.st;
        endTime = widgetComponent.widget.widgetWiseInfo.duration.et;
        graphTimeKey = widgetComponent.widget.widgetWiseInfo.duration.preset;
        viewBy = widgetComponent.widget.widgetWiseInfo.duration.viewBy + "";
      }

      if (widgetComponent.widget.widgetWiseInfo && widgetComponent.widget.widgetWiseInfo.widgetWise
        && widgetComponent.widget.widgetWiseInfo.duration) {

        payload.actionForAuditLog = "Widget wise time period";

        if (!widgetComponent.widget.widgetWiseInfo.secondTime) {
          payload.tsdbCtx.duration.et = widgetComponent.widget.widgetWiseInfo.duration.et;
          payload.tsdbCtx.duration.st = widgetComponent.widget.widgetWiseInfo.duration.st;
        }
        else {
          if(previousData != null)
           payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
           else
           payload.tsdbCtx.duration.st = widgetComponent.widget.widgetWiseInfo.duration.st;

          payload.tsdbCtx.duration.et = 0;
        }
        payload.tsdbCtx.duration.preset = widgetComponent.widget.widgetWiseInfo.duration.preset;
        payload.tsdbCtx.duration.viewBy = `${widgetComponent.widget.widgetWiseInfo.duration.viewBy}`;


        //for defining it as now incremental call
        widgetComponent.widget.widgetWiseInfo.secondTime = true;

        widgetComponent.widget.opName = '';
      }
      // Modification in payload for incremental updates
      else if (
        previousData && previousData.grpData.lastSampleTimeStampWithInterval) {
        if (
          DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 ||
          DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1
        ) {
          payload.tsdbCtx.duration.st = startTime;
          payload.tsdbCtx.duration.et = endTime;

        } else {
          if(!(dashboardComponent.dashboardTime.graphTimeKey.startsWith('SPECIFIED_') || dashboardComponent.dashboardTime.graphTimeKey.startsWith('PAST'))){
          payload.tsdbCtx.duration.st =
            previousData.grpData.lastSampleTimeStampWithInterval;
          payload.tsdbCtx.duration.et = 0;
          payload.tsdbCtx.duration.viewBy = previousData.grpData.viewBy;
        }
      }
      }
      //zoom handling
      if (widgetComponent.widget.zoomInfo && widgetComponent.widget.zoomInfo.times && widgetComponent.widget.zoomInfo.times.length > 0) {
        //setting original time in case of undozoom , time taken from global time bar
        widgetComponent.widget.zoomInfo.originalSt = startTime;
        widgetComponent.widget.zoomInfo.originalEt = endTime;

        //checking if delay time was applied
        if(widgetComponent.widget.settings.types.graph.selectedWidgetTimeDelay >0){
          payload.tsdbCtx.duration.st = widgetComponent.widget.zoomInfo.times[widgetComponent.widget.zoomInfo.times.length - 1].zoomSt + widgetComponent.widget.settings.types.graph.selectedWidgetTimeDelay;
          payload.tsdbCtx.duration.et = widgetComponent.widget.zoomInfo.times[widgetComponent.widget.zoomInfo.times.length - 1].zoomEt + widgetComponent.widget.settings.types.graph.selectedWidgetTimeDelay;
        }
        else{
        //changing time for zoom
        payload.tsdbCtx.duration.st = widgetComponent.widget.zoomInfo.times[widgetComponent.widget.zoomInfo.times.length - 1].zoomSt;
        payload.tsdbCtx.duration.et = widgetComponent.widget.zoomInfo.times[widgetComponent.widget.zoomInfo.times.length - 1].zoomEt;

        }

        payload.actionForAuditLog = 'Zoom';
        payload.tsdbCtx.duration.viewBy = '0';

      }
      //undozoom case
      else if (widgetComponent.widget.zoomInfo && widgetComponent.widget.zoomInfo.originalSt > 0) {
        payload.tsdbCtx.duration.st = widgetComponent.widget.zoomInfo.originalSt;
        payload.tsdbCtx.duration.et = widgetComponent.widget.zoomInfo.originalEt;

        payload.actionForAuditLog = 'Undo Zoom';
        payload.tsdbCtx.duration.viewBy = '0';

        //last level undozoom, back to original
        if (widgetComponent.widget.zoomInfo.times.length < 1) {
          widgetComponent.widget.zoomInfo = null;
          payload.tsdbCtx.duration.et = endTime;
        }
      }

      //parameterise handling
       if (dashboardComponent.treeData && dashboardComponent.selectedTreeObj.label === "Parametrize") {
        previousData = null;
        let subjectTag = dashboardComponent.treeData;
        for (let j = 0; j < widgetComponent.widget.dataCtx.gCtx.length; j++) {

          let metaTags = widgetComponent.widget.dataCtx.gCtx[j].subject.tags

          for (let j = 0; j < metaTags.length; j++) {
            if (j < subjectTag.length && metaTags[j].key == subjectTag[j].key) {
              if(subjectTag[j].value !== "ANY"){
              metaTags[j].value = subjectTag[j].value;
              metaTags[j].mode = subjectTag[j].mode;
              }
            }
            else
              continue;
          }
          let graphName = widgetComponent.widget.name.split("-")[0] + '- ';
          for (let k = 0; k < metaTags.length; k++) {

            if (k == 0)
              graphName = graphName + metaTags[k]['value'];
            else
              graphName = graphName + '>' + metaTags[k]['value'];

          }
          widgetComponent.widget.id = widgetComponent.widget.name = graphName;

          if(payload.tsdbCtx.duration.et != 0)
            payload.actionForAuditLog = 'Parametrize';
          else
            payload.actionForAuditLog = null;
        }
      }

      if(dashboardComponent.treeData && dashboardComponent.selectedTreeObj.label === "FavParametrization"){

        previousData = null;

        let subjectTag = dashboardComponent.treeData;
        for (let j = 0; j < widgetComponent.widget.dataCtx.gCtx.length; j++) {

          let metaTags = widgetComponent.widget.dataCtx.gCtx[j].subject.tags;
          let measureTag = widgetComponent.widget.dataCtx.gCtx[j].measure;


          for (let i = 0; i < metaTags.length; i++) {
            for (let k = 0; k < subjectTag.length; k++) {
              for(let n = 0; n< subjectTag[k].length; n++){
                let currentTag = subjectTag[k][n][0];
                if(!currentTag){
                  currentTag = subjectTag[k][n];
                }
                if (metaTags[i].key == currentTag.key) {
                  if(subjectTag[i].value !== "ANY"){
                  metaTags[i].value = currentTag.value;
                  metaTags[i].mode = currentTag.mode;
                  }

                }

                else
                  continue;
              }
              }
            }

            if(j !== 0){
             let prevMeasureTag =  widgetComponent.widget.dataCtx.gCtx[j-1].measure;
             if(measureTag.metric == prevMeasureTag.metric){
                if(metaTags[0].key == widgetComponent.widget.dataCtx.gCtx[j-1].subject.tags[0].key){
                  widgetComponent.widget.dataCtx.gCtx.splice(j, 1);
                }
             }
            }
// console.log("gctx==================="+widgetComponent.widget.dataCtx.gCtx);

// for(let k = 0; k<widgetComponent.widget.dataCtx.gCtx.length -1;k++){
//   let metaTags = widgetComponent.widget.dataCtx.gCtx[j].subject.tags;
//  let nextTag =  widgetComponent.widget.dataCtx.gCtx[j+1].subject.tags;
// //  if(metaTags.keys === nextTag.keys && metaTags.values === nextTag.values && metaTags.mode === nextTag.mode){

// //  }
// console.log("metatags================"+metaTags);
// console.log("nextTag================="+nextTag);
// }

          // for (let j = 0; j < subjectTag.length; j++) {
          //     for(let k = 0; k< subjectTag[j].length; k++){
          //       for (let m = 0; m < metaTags.length; m++) {
          //         if (metaTags[m].key == subjectTag[j][k][0].key) {
          //           if(subjectTag[m].value !== "ANY"){
          //           metaTags[m].value = subjectTag[j][k][0].value;
          //           metaTags[m].mode = subjectTag[j][k][0].mode;
          //           }
          //         }
          //         else
          //           continue;
          //       }
          //     }
          //   // if (j < subjectTag.length && metaTags[j].key == subjectTag[j][0].key) {
          //   //   if(subjectTag[j][0].value !== "ANY"){
          //   //   metaTags[j].value = subjectTag[j][0].value;
          //   //   metaTags[j].mode = subjectTag[j][0].mode;
          //   //   }
          //   // }
          //   // else
          //   //   continue;
          // }

          let graphName = widgetComponent.widget.name.split("-")[0] + '- ';
          for (let k = 0; k < metaTags.length; k++) {

            if (k == 0)
              graphName = graphName + metaTags[k]['value'];
            else
              graphName = graphName + '>' + metaTags[k]['value'];
          }
          widgetComponent.widget.id = widgetComponent.widget.name = graphName;

          if(payload.tsdbCtx.duration.et != 0)
            payload.actionForAuditLog = 'Parametrize';
          else
            payload.actionForAuditLog = null;
        }


      }

      //filter dashboard handling
     if (dashboardComponent.treeData && dashboardComponent.selectedTreeObj.label === "dashboardFilter" && payload.tsdbCtx.duration.et != 0) {
        let array : DashboardGraphDataCTX[] = [];
        let subjectTag = dashboardComponent.treeData;
        let isGraphPresent : boolean = true;
        for (let i = 0; i < widgetComponent.widget.dataCtx.gCtx.length; i++) {
          let metaTags = widgetComponent.widget.dataCtx.gCtx[i].subject.tags;
          subjectTag.forEach((element,index) => {
            for (let j = 0; j < metaTags.length; j++) {
              if (j < element.length && metaTags[j].key == element[j].key) {

                  if(element[j].value == "ALL" && isGraphPresent){
                    isGraphPresent = true;
                  }
                else if(metaTags[j].value == element[j].value ){
                isGraphPresent = true;

                }
                else
                isGraphPresent = false;
              }

            }
            if(isGraphPresent){
          array.push({
          baselineCtx : widgetComponent.widget.dataCtx.gCtx[i].baselineCtx ? widgetComponent.widget.dataCtx.gCtx[i].baselineCtx : null,
          subject : this.deepCopyFunction(widgetComponent.widget.dataCtx.gCtx[i].subject),
          measure : this.deepCopyFunction(widgetComponent.widget.dataCtx.gCtx[i].measure),
          glbMetricId : widgetComponent.widget.dataCtx.gCtx[i].glbMetricId,
          derivedFormula : widgetComponent.widget.dataCtx.gCtx[i].derivedFormula ? widgetComponent.widget.dataCtx.gCtx[i].derivedFormula : null,
          dataCenter : widgetComponent.widget.dataCtx.gCtx[i].dataCenter ? widgetComponent.widget.dataCtx.gCtx[i].dataCenter : null

          });
        }

        });

        }
          widgetComponent.widget.dataCtx.gCtx = array;
          let graphName = widgetComponent.widget.name.split("-")[0] + '- ';
          for(let n = 0; n <  widgetComponent.widget.dataCtx.gCtx.length; n++){
        let metaTags = widgetComponent.widget.dataCtx.gCtx[n].subject.tags;
        for (let k = 0; k < metaTags.length; k++) {

          if (k == 0)
            graphName = graphName + metaTags[k]['value'];
          else
            graphName = graphName + '>' + metaTags[k]['value'];

        }
        widgetComponent.widget.id = widgetComponent.widget.name = graphName;
        payload.actionForAuditLog = 'dashboardFilter';
      }

      widgetComponent.widget.dataCtx.gCtx = array;

    }



      /* Advance open/Merge */
      if (dashboardComponent.metricData && dashboardComponent.metricData !== null && dashboardComponent.metricData.length > 0) {
        try{
        let i =widgetComponent.widget.widgetIndex;
        widgetIndex = i;
        let panelData = [], panelCaption = '';

        if (i < dashboardComponent.metricData.length) {
          previousData = null;
          if(i==0){
            payload.actionForAuditLog = dashboardComponent.featureName;
            dashboardComponent.selectWidget(widgetComponent);

          }
          if (dashboardComponent.metricData[i] && dashboardComponent.metricData[i].mData) {
            panelData = dashboardComponent.metricData[i].mData;
            //panelData = dashboardComponent.metricData[i].mData;
            payload.tsdbCtx.dataCtx.gCtx = [];
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

               payload.tsdbCtx.dataCtx.gCtx.push(newGraphCTX);

               const newwidgetGraphs: DashboardWidgetGraph = {
                vecName: panelData[idx].vectorName,
                glbMetricId: panelData[idx].glbMetricId,
                graphId: panelData[idx].measure.metricId,
                groupId: dashboardComponent.groupID,
              }

              if(widgetComponent.widget.graphs.widgetGraphs == undefined){
                const newGraph: DashboardGraphs = {
                  widgetGraphs: [],
                }
                widgetComponent.widget.graphs = newGraph;
              }
              widgetComponent.widget.graphs.widgetGraphs.push(newwidgetGraphs);
             }

          }
        }

        console.log("graphsettings coming......"  ,widgetComponent.widget.graphSettings)

        payload.tsdbCtx.duration.st = startTime;
        payload.tsdbCtx.duration.et = endTime;
        if(widgetIndex === dashboardComponent.metricData.length-1 ){
            dashboardComponent.metricData = null;
            dashboardComponent.openMerge = false;
          }
      }catch(e){
        console.error("Error are coming in the dashboardComponent.metricData --",e)
      }
      }

      /*Merge (All,Zero,Non-Zero)*/
      if (dashboardComponent.mergeMetricData && dashboardComponent.mergeMetricData !== null && dashboardComponent.mergeMetricData.length > 0 && widgetComponent.isSelected) {
        payload.actionForAuditLog = dashboardComponent.featureName;
        widgetIndex = widgetComponent.widget.widgetIndex;

        let panelData = [], panelCaption = '';
        previousData = null;
        if (dashboardComponent.mergeMetricData[0] && dashboardComponent.mergeMetricData[0].mData) {
          panelData = dashboardComponent.mergeMetricData[0].mData;
          panelCaption = dashboardComponent.mergeMetricData[0].pCaption;

          widgetComponent.widget.graphSettings = {};
          widgetComponent.widget.graphSettings = dashboardComponent.mergeMetricData[0].graphSettings;
          const newft: DashboardDataCTXDataFilter = {
            typ: 0,
            //in: 0,
            opt: "=",
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
            graphSettings: widgetComponent.widget.graphSettings,
            icon: '',
            id: '',
            iconTooltip: "Advance Settings",
            include: true,
            layout: widgetComponent.widget.layout,
            name: '',
            ruleType: 0,
            scaleMode: 1,
            settings: widgetComponent.widget.settings,
            type: "GRAPH",
            widgetIndex: widgetIndex,
            isSelectedWidget: true,
            dropTree: false,
          }
          widgetComponent.widget  = newWidget;
          if(dashboardComponent.data.favDetailCtx.widgets[widgetIndex].graphs == undefined){
            dashboardComponent.data.favDetailCtx.widgets[widgetIndex]['graphs'] = newWidget.graphs;
            dashboardComponent.data.favDetailCtx.widgets[widgetIndex].isSelectedWidget = true;
          }
          payload.tsdbCtx.dataCtx = newWidget.dataCtx;
          if(!widgetComponent.widget.dataCtx.ft){
            if(widgetComponent.widget.settings.dataFilter[widgetComponent.widget.settings.dataFilter.length -1] == 11){
              widgetComponent.widget.settings.dataFilter.pop();
            }
          }
          widgetComponent.widget.dataCtx.gCtx = payload.tsdbCtx.dataCtx.gCtx = [];
          widgetComponent.widget.graphs.widgetGraphs = [];
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
            payload.tsdbCtx.dataCtx.ft = dashboardComponent.filter;
            payload.tsdbCtx.dataCtx.gCtx.push(newGraphCTX);
            widgetComponent.widget.dataCtx = payload.tsdbCtx.dataCtx;
            const newwidgetGraphs: DashboardWidgetGraph = {
              vecName: panelData[idx].vectorName,
              glbMetricId: panelData[idx].glbMetricId,
              graphId: panelData[idx].measure.metricId,
              groupId: dashboardComponent.groupID,
            }
            widgetComponent.widget.graphs.widgetGraphs.push(newwidgetGraphs);
            widgetComponent.widget.description = widgetComponent.widget.id = widgetComponent.widget.name = panelCaption;

            widgetComponent.widget.settings.caption.caption = panelCaption;
            widgetComponent.widget.settings.graphStatsType = dashboardComponent.graphStatsType.toString();
            widgetComponent.widget.include = dashboardComponent.Include;
          }

          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].name = panelCaption;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].id = panelCaption;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].description = panelCaption;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].dataCtx = widgetComponent.widget.dataCtx ;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].settings.caption.caption = panelCaption;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].settings.graphStatsType = widgetComponent.widget.settings.graphStatsType;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].include = dashboardComponent.Include;

          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].graphs.widgetGraphs = widgetComponent.widget.graphs.widgetGraphs;
        }
        payload.tsdbCtx.duration.st = startTime;
        payload.tsdbCtx.duration.et = endTime;
        dashboardComponent.mergeMetricData = false;
        dashboardComponent.mergeMetric = false;
        //widgetComponent.widget.widgetIndex = 0;
      }
      /*Merge with active widget */
       if (dashboardComponent.mergeShowGraphInTree && widgetComponent.isSelected) {
        try {
          previousData = null;
          let dataTree: any = dashboardComponent.widgetShowGraphInTree;
          let measure = dashboardComponent.widgetShowGraphInTree[0].measureTags; //tree Hierarchy data
          let subject = dashboardComponent.widgetShowGraphInTree[0].subjectTags;


          const subCTX: GraphDataCTXSubject = {
            tags: subject
          };
          const newGraphCTX: DashboardGraphDataCTX = {
            subject: subCTX,
            measure: measure,
            glbMetricId: -1
          };

          payload.tsdbCtx.duration.st = startTime;
          payload.tsdbCtx.duration.et = endTime;

          this.checkAlreadyPresentGraph(widgetComponent,dashboardComponent,newGraphCTX);

          if (dashboardComponent.mergeShowGraphInTree == true && dashboardComponent.mergeMetricInWidget == true) {
            widgetComponent.widget.dataCtx.gCtx.push(newGraphCTX);
            payload.tsdbCtx.dataCtx = widgetComponent.widget.dataCtx;
            dashboardComponent.mergeShowGraphInTree = false;
          }
          else
          {
            widgetComponent.widget.dataCtx.gCtx = [];

            for(let  i = 0 ; i < dataTree.length;i++){
              const innersubCTX: GraphDataCTXSubject = {
                tags: dataTree[i].subjectTags
              };
            const innerNewGraphCTX: DashboardGraphDataCTX = {
              subject: innersubCTX,
              measure: dataTree[i].measureTags,
              glbMetricId: -1
            };
            widgetComponent.widget.dataCtx.gCtx.push(innerNewGraphCTX);
          }

            payload.tsdbCtx.dataCtx = widgetComponent.widget.dataCtx;
            dashboardComponent.mergeShowGraphInTree = false;
            let panelCaption = newGraphCTX.measure.metric;
            let caption = "";
            if (newGraphCTX.subject.tags && newGraphCTX.subject.tags.length > 0) {
              for (let i = 0; i < newGraphCTX.subject.tags.length; i++) {
                if (caption == "") {
                  caption = " - " + newGraphCTX.subject.tags[i].value;
                } else {
                  caption = caption + ">" + newGraphCTX.subject.tags[i].value;
                }
              }
            }

            panelCaption = panelCaption + caption;
            widgetComponent.widget.settings.caption.caption = panelCaption;
            widgetIndex = widgetComponent.widget.widgetIndex;
            dashboardComponent.data.favDetailCtx.widgets[widgetIndex].name = panelCaption;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].id = panelCaption;
          dashboardComponent.data.favDetailCtx.widgets[widgetIndex].description = panelCaption;
          }

          dashboardComponent.mergeShowGraphInTree = false;
        }
        catch (err) {
          console.error("Exception has occured while Merging the graph with already present graph", err);
        }
      }

      //Drop Tree
       if (dashboardComponent.dropTree && widgetComponent.isSelected) {
        try {
          previousData = null;
          let measure = dashboardComponent.widgetShowGraphInTree[0].measureTags;//tree Hierarchy data
          let subject = dashboardComponent.widgetShowGraphInTree[0].subjectTags

          const subCTX: GraphDataCTXSubject = {
            tags: subject
          };
          const newGraphCTX: DashboardGraphDataCTX = {
            subject: subCTX,
            measure: measure,
            glbMetricId: -1
          };

          widgetComponent.widget.dataCtx.gCtx = [];
          widgetComponent.widget.dataCtx.gCtx.push(newGraphCTX); //widget Data
          payload.tsdbCtx.dataCtx = widgetComponent.widget.dataCtx;
          payload.tsdbCtx.duration.st = startTime;
          payload.tsdbCtx.duration.et = endTime;

          let panelCaption = newGraphCTX.measure.metric;
          let caption = "";
          if (newGraphCTX.subject.tags && newGraphCTX.subject.tags.length > 0) {
            for (let i = 0; i < newGraphCTX.subject.tags.length; i++) {
              if (caption == "") {
                caption = " - " + newGraphCTX.subject.tags[i].value;
              } else {
                caption = caption + ">" + newGraphCTX.subject.tags[i].value;
              }
            }
          }

          panelCaption = panelCaption + caption;
          widgetComponent.widget.description = widgetComponent.widget.id = widgetComponent.widget.name = panelCaption;
          widgetComponent.widget.settings.caption.caption = panelCaption;
          dashboardComponent.dropTree = false;
          dashboardComponent.mergeShowGraphInTree = false;

        } catch (err) {
          console.error("Exception has occured while Dropping Graph on Widget", err);
        }
      }

      if(dashboardComponent.patternMatchingFlag &&dashboardComponent.patternMatchingFlag!==undefined && dashboardComponent.patternMatchingFlag!==null){
        try{
          let i =widgetComponent.widget.widgetIndex;
          widgetIndex = i;
          let panelData = [], panelCaption = '';

          if (i < dashboardComponent.patternMatchMetricData.length) {
            previousData = null;
            if(i==0){
              payload.actionForAuditLog = "Pattern Matching";
              dashboardComponent.selectWidget(widgetComponent);

            }
            if (dashboardComponent.patternMatchMetricData[i] && dashboardComponent.patternMatchMetricData[i].mData) {
              panelData = dashboardComponent.patternMatchMetricData[i].mData;
              //panelData = dashboardComponent.metricData[i].mData;
              payload.tsdbCtx.dataCtx.gCtx = [];
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

                 payload.tsdbCtx.dataCtx.gCtx.push(newGraphCTX);

                 const newwidgetGraphs: DashboardWidgetGraph = {
                  vecName: panelData[idx].vectorName,
                  glbMetricId: panelData[idx].glbMetricId,
                  graphId: panelData[idx].measure.metricId,
                  groupId: dashboardComponent.groupID,
                }

                if(widgetComponent.widget.graphs.widgetGraphs == undefined){
                  const newGraph: DashboardGraphs = {
                    widgetGraphs: [],
                  }
                  widgetComponent.widget.graphs = newGraph;
                }
                widgetComponent.widget.graphs.widgetGraphs.push(newwidgetGraphs);
               }

            }
          }

          console.log("graphsettings coming......"  ,widgetComponent.widget.graphSettings)

          payload.tsdbCtx.duration.st = startTime;
          payload.tsdbCtx.duration.et = endTime;
          if(me.patternMatchingService.duration && me.patternMatchingService.zoomApply){
                        payload.tsdbCtx.duration.st = me.patternMatchingService.duration.st;
                        payload.tsdbCtx.duration.et = me.patternMatchingService.duration.et;
                        payload.tsdbCtx.duration.preset=me.patternMatchingService.duration.preset;
                        payload.tsdbCtx.duration.viewBy=me.patternMatchingService.duration.viewBy;
                        this.timebarService.tmpValue.time.frameStart.value=dashboardTime.time.frameStart.value;
                         this.timebarService.tmpValue.time.frameEnd.value =dashboardTime.time.frameEnd.value;
              dashboardTime.time.frameStart.value = payload.tsdbCtx.duration.st;
             dashboardTime.time.frameEnd.value =payload.tsdbCtx.duration.et;

               this.timebarService.tmpValue.timePeriod.selected.label ="Custom Time";
               this.timebarService.tmpValue.timePeriod.selected.id =payload.tsdbCtx.duration.preset;
                      }
          if(widgetIndex === dashboardComponent.patternMatchMetricData.length-1 ){
              dashboardComponent.patternMatchMetricData = null;
              dashboardComponent.patternMatchingFlag = false;
            }
        }catch(e){
          console.error("Error are coming in the dashboardComponent.metricData --",e)
        }
      }


      //setting action as null in case of increment calls.
      if (payload.tsdbCtx.duration.et == 0){
        payload.actionForAuditLog = null;
      }

      if(widgetComponent.data &&  widgetComponent.data.grpData.mFrequency.length !=0){

       let graphLen = widgetComponent.data.grpData.mFrequency[0].data.length;
       let cumFlag = false;

      for(let i = 0; i < graphLen;i++){

        if(widgetComponent.data.grpData.mFrequency[0].data[i].cummulativeDerivedFlag)
          {
            cumFlag = true;
            break;
          }
          else
          continue;
      }

      if(widgetComponent.widget.settings.graphStatsType == "4" || cumFlag){
        payload.tsdbCtx.duration.st = startTime;
        payload.tsdbCtx.duration.et = endTime; // (startTime + widgetComponent.data.grpData.mFrequency[0].tsDetail.frequency);
      }
    }

    widgetComponent.widget.et = payload.tsdbCtx.duration.et;



      widgetComponent.errorMessage = null;
      if(this.isGraphAvailable(widgetComponent.widget)){
      if (widgetIndex !== undefined && widgetIndex !== null) {
        path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;

        if(partialEnabled){
        if(!payload.tsdbCtx.dataFilter.includes(13))
           payload.tsdbCtx.dataFilter.push(13);
        }
        const subscription = me.controller.post(path, payload).subscribe(
          (rawData: DashboardWidgetLoadRes) => {
            me.interceptor.onDashboardWidgetLoaded(
              rawData,
              previousData,
              dashboardComponent,
              widgetComponent,

              (data: DashboardWidgetLoadRes) => {
                // Calculate min freq & collect all graphs
                let minFrequency: MFrequencyTsDetails = null;
                if (data && data.grpData && data.grpData.mFrequency) {
                  for (const mFrequency of data.grpData.mFrequency) {
                    if (
                      !minFrequency ||
                      (minFrequency &&
                        minFrequency.frequency >= mFrequency.tsDetail.frequency)
                    ) {
                      minFrequency = mFrequency.tsDetail;
                    }
                  }
                }

                if (minFrequency) {
                  // ((minFrequency * (count-1))*1000+ startTime)
                  data.grpData.lastSampleTimeStamp =
                    minFrequency.frequency * (minFrequency.count - 1) * 1000 +
                    minFrequency.st;
                }

                // Save requested viewBy
                //data.grpData.viewBy = viewBy;
                if(viewBy !== "" && Number(viewBy) != 0 &&  widgetComponent.widget.widgetWiseInfo && widgetComponent.widget.widgetWiseInfo.duration.viewBy !== Number(data.grpData.viewBy) ) {
                  me.displayMsgOnViewByChanged++;

                    widgetComponent.widget.widgetWiseInfo.duration.viewBy  = Number(data.grpData.viewBy) ;


                } else if (!widgetComponent.widget.widgetWiseInfo && viewBy !== "" && Number(viewBy) != 0 && me.timebarService.getValue().viewBy.selected.id !== data.grpData.viewBy ) {
                 // dashboardComponent.data.favDetailCtx.viewBy.selected = data.grpData.viewBy;
                 me.displayMsgOnViewByChanged++;

                  me.timebarService.getValue().viewBy.selected.id = data.grpData.viewBy;


                }

                output.next(new DashboardWidgetLoadedState(data));
                output.complete();
              },
              (error: AppError) => {
                output.error(new DashboardWidgetLoadingErrorState(error));
                output.complete();
              }
            );
          },
          (e: any) => {
            output.error(new DashboardWidgetLoadingErrorState(e));
            output.complete();

            me.logger.error('Dashboard widget loading failed', e);
          }
        );

        output.next(new DashboardWidgetLoadingSubscriptionState(subscription));
      }
    }
    else{
      // console.log("calling from not in case of graphs");
      setTimeout(() => {
        output.next(new DashboardWidgetLoadingState());
      }, 0);

      setTimeout(() => {
        widgetComponent.errorMessage = this.getErrorMessage(widgetComponent.widget);
        output.next(new DashboardWidgetLoadedState(null));
        output.complete();
      }, 0);

    }
      return output;

    }
  }

  updateCompareLastStartEndST(dashboardComponent: DashboardComponent, widgetComponent: DashboardWidgetComponent, previousData: DashboardWidgetLoadRes, mFreq: DashboardGraphDataMFrequency, tsDetail: MFrequencyTsDetails, cIdx: number, ttl: number): boolean {
    let isNotLiveData: boolean = false;
    if (!widgetComponent.widget.compareZoomInfo || widgetComponent.widget.compareZoomInfo.length == 0) {
      if (tsDetail.frequency >= 0) {
        if (previousData) {
          if (dashboardComponent.compareSnapShot.compareData[cIdx].viewByValue <= ttl / 1000) {
            if (tsDetail.partial && tsDetail.count > 1) {
              dashboardComponent.compareSnapShot.compareData[cIdx].startLastST = (((tsDetail.frequency * (tsDetail.count - 2)) * 1000) + tsDetail.st);
              dashboardComponent.compareSnapShot.compareData[cIdx].endLastST = (((tsDetail.frequency * (tsDetail.count - 1)) * 1000) + dashboardComponent.compareSnapShot.compareData[cIdx].startLastST);
            }
            else {
              dashboardComponent.compareSnapShot.compareData[cIdx].startLastST = (((tsDetail.frequency * (tsDetail.count - 1)) * 1000) + tsDetail.st);
              dashboardComponent.compareSnapShot.compareData[cIdx].endLastST = (((tsDetail.frequency * (tsDetail.count)) * 1000) + dashboardComponent.compareSnapShot.compareData[cIdx].startLastST);
            }
          }
          else {
            if (dashboardComponent.compareSnapShot.compareData[cIdx].fullDataCallTS && dashboardComponent.compareSnapShot.compareData[cIdx].fullDataCallTS > dashboardComponent.compareSnapShot.compareData[cIdx].endLastST) {
              dashboardComponent.compareSnapShot.compareData[cIdx].endLastST += ttl;
              isNotLiveData = true;
            }
            else {
              if (tsDetail.partial && tsDetail.count > 1) {
                dashboardComponent.compareSnapShot.compareData[cIdx].startLastST = (((tsDetail.frequency * (tsDetail.count - 2)) * 1000) + tsDetail.st);
                dashboardComponent.compareSnapShot.compareData[cIdx].endLastST = (ttl + dashboardComponent.compareSnapShot.compareData[cIdx].startLastST);
                if (!dashboardComponent.compareSnapShot.compareData[cIdx].preset.startsWith('LIVE'))
                  dashboardComponent.compareSnapShot.compareData[cIdx].fullDataCallTS = (((tsDetail.frequency * (tsDetail.count - 1)) * 1000) + tsDetail.st);
              }
              else {
                dashboardComponent.compareSnapShot.compareData[cIdx].startLastST = (((tsDetail.frequency * (tsDetail.count - 1)) * 1000) + tsDetail.st);
                dashboardComponent.compareSnapShot.compareData[cIdx].endLastST = (ttl + dashboardComponent.compareSnapShot.compareData[cIdx].startLastST);
                if (!dashboardComponent.compareSnapShot.compareData[cIdx].preset.startsWith('LIVE'))
                  dashboardComponent.compareSnapShot.compareData[cIdx].fullDataCallTS = (((tsDetail.frequency * (tsDetail.count)) * 1000) + tsDetail.st);
              }
            }
          }
        }
        else {
          dashboardComponent.compareSnapShot.compareData[cIdx].startLastST = (((tsDetail.frequency * (tsDetail.count - 1)) * 1000) + tsDetail.st);
          const endTS = dashboardComponent.compareSnapShot.compareData[cIdx].end;
          const diff = endTS - dashboardComponent.compareSnapShot.compareData[cIdx].startLastST;
          if (diff > ttl) {
            const fraction = diff / ttl;
            let mins = Math.round(fraction);
            const fractionPoint = Math.ceil(((fraction < 1.0) ? fraction : (fraction % Math.floor(fraction))) * 10);
            if (fractionPoint < 5 && fractionPoint > 0)
              mins = mins + 1;
            dashboardComponent.compareSnapShot.compareData[cIdx].endLastST = (dashboardComponent.compareSnapShot.compareData[cIdx].startLastST + (mins * ttl));
          }
          else {
            dashboardComponent.compareSnapShot.compareData[cIdx].endLastST = ((tsDetail.frequency * 1000) + dashboardComponent.compareSnapShot.compareData[cIdx].startLastST);
          }

          if (tsDetail.frequency > ttl / 1000){
            if (!dashboardComponent.compareSnapShot.compareData[cIdx].preset.startsWith('LIVE'))
              dashboardComponent.compareSnapShot.compareData[cIdx].fullDataCallTS = (((tsDetail.frequency * (tsDetail.count)) * 1000) + tsDetail.st);
          }

          dashboardComponent.compareSnapShot.compareData[cIdx].viewByValue = tsDetail.frequency;
        }
        if (widgetComponent.widget.compareData && !widgetComponent.widget.compareData.trendCompare) {
          if (previousData) {
            for (const [preMFIndex, preMFreq] of previousData.grpData.mFrequency.entries()) {
              if (!isNotLiveData && preMFIndex == cIdx) {
                if (!tsDetail.partial) {
                  for (const [mFDataIndex, preMFreqData] of preMFreq.data.entries()) {
                    preMFreqData.compareTime = preMFreqData.compareTime + ((tsDetail.count) * 1000 * tsDetail.frequency);
                  }
                }
              }
            }
            dashboardComponent.compareSnapShot.compareData[cIdx].start += ((tsDetail.count) * 1000 * tsDetail.frequency);
            dashboardComponent.compareSnapShot.compareData[cIdx].end += ((tsDetail.count) * 1000 * tsDetail.frequency);
          }
          else {
            for (const [mFDataIndex, mFreqData] of mFreq.data.entries()) {
              mFreqData.measure.metric = widgetComponent.widget.compareData.compareData[cIdx].name + "-" + mFreqData.measure.metric;
              mFreqData.compareColor = widgetComponent.widget.compareData.compareData[cIdx].rowBgColorField;
              mFreqData.compareTime = tsDetail.st;
            }
          }
        }
      }
      return isNotLiveData;
    }
  }
  getDropMetricData(dashboardComponent: DashboardComponent) {
    let me =this;
    let measure = dashboardComponent.widgetShowGraphInTree[0].measureTags;//tree Hierarchy data
    let subject = dashboardComponent.widgetShowGraphInTree[0].subjectTags

    const subCTX: GraphDataCTXSubject = {
      tags: subject
    };
    const newGraphCTX: DashboardGraphDataCTX = {
      subject: subCTX,
      measure: measure,
      glbMetricId: -1
    };
    return newGraphCTX;
  }
  getmergeMetricData(dashboardComponent: DashboardComponent) {
    let me =this;
    let measure = dashboardComponent.widgetShowGraphInTree[0].measureTags; //tree Hierarchy data
    let subject = dashboardComponent.widgetShowGraphInTree[0].subjectTags

    const subCTX: GraphDataCTXSubject = {
      tags: subject
    };
   let newGraphCTX: DashboardGraphDataCTX = {
      subject: subCTX,
      measure: measure,
      glbMetricId: -1
    };
    return newGraphCTX;
  }

  // getOpenAdvanceData(metricData: any,widget,widgetIndex) {
  //   let me =this;
  //   try{
  //     let i =widget.widgetIndex;
  //     widgetIndex = i;
  //     let panelData = [], panelCaption = '';

  //     if (i < metricData.length) {
  //       //previousData = null;
  //       if(i==0){
  //         payload.actionForAuditLog = dashboardComponent.featureName;
  //       }
  //       if (dashboardComponent.metricData[i] && dashboardComponent.metricData[i].mData) {
  //         panelData = dashboardComponent.metricData[i].mData;
  //         //panelData = dashboardComponent.metricData[i].mData;
  //         payload.tsdbCtx.dataCtx.gCtx = [];
  //          for (let idx = 0; idx < panelData.length; idx++) {
  //            let subject = panelData[idx].subject;
  //            let measure = panelData[idx].measure;
  //            const subCTX: GraphDataCTXSubject = {
  //              tags: subject
  //            };
  //            const newGraphCTX: DashboardGraphDataCTX = {
  //              subject: subCTX,
  //              measure: measure,
  //              glbMetricId: panelData[idx].glbMetricId
  //            };

  //            payload.tsdbCtx.dataCtx.gCtx.push(newGraphCTX);

  //            const newwidgetGraphs: DashboardWidgetGraph = {
  //             vecName: panelData[idx].vectorName,
  //             glbMetricId: panelData[idx].glbMetricId,
  //             graphId: panelData[idx].measure.metricId,
  //             groupId: dashboardComponent.groupID,
  //           }

  //           if(widgetComponent.widget.graphs.widgetGraphs == undefined){
  //             const newGraph: DashboardGraphs = {
  //               widgetGraphs: [],
  //             }
  //             widgetComponent.widget.graphs = newGraph;
  //           }
  //           widgetComponent.widget.graphs.widgetGraphs.push(newwidgetGraphs);
  //          }

  //       }
  //     }

  //     payload.tsdbCtx.duration.st = startTime;
  //     payload.tsdbCtx.duration.et = endTime;
  //     if(widgetIndex === dashboardComponent.metricData.length-1 ){
  //         dashboardComponent.metricData = null;
  //       }
  //   }
  //   catch(e){
  //     console.error("Error are coming in the dashboardComponent.metricData --",e)
  //   }
  // }
  getCompareData(dashboardComponent: DashboardComponent, widgetComponent: DashboardWidgetComponent, output: Subject<Store.State>, tempwidget: any, widgetIndex: number, previousData: DashboardWidgetLoadRes) {
    let me =this;
    let payloadList: any[] = [];
    let type: number;
    if (widgetComponent.widget.settings.types.graph) {
      type = widgetComponent.widget.settings.types.graph.type;
    }
    const viewBy: string = "60";
    let startTime: any = 0;
    let endTime: any = 0;
    widgetComponent.widget.compareData.compareData.forEach((data, idx) => {
      let path = environment.api.dashboardWidget.load.endpoint;
      if (data.preset.startsWith('SPECIFIED')) {
        let split1 = data.preset.split("_");
        startTime = split1[2];
        endTime = split1[3];
      } else {
        startTime = data.start;
        endTime = data.end;
      }
      const graphTimeKey: string = data.preset;
      let graphSetting: any;
      for (const item in widgetComponent.widget.graphSettings) {
        widgetComponent.widget.graphSettings[item].color = data.rowBgColorField;
        graphSetting = widgetComponent.widget.graphSettings[item];
        break;
      }
      // For Checking Graph Type

      const payload = {
        globalFavCtx: dashboardComponent.data.favDetailCtx.globalFavCtx,
        tsdbCtx: {
          appId: -1,
          avgCount: 0,
          avgCounter: 0,
          cctx: me.sessionService.session.cctx,
          clientId: -1,
          dataFilter: widgetComponent.widget.settings.dataFilter,
          dataCtx: widgetComponent.widget.dataCtx,
          duration: {
            st: startTime,
            et: endTime,
            preset: graphTimeKey,
            viewBy,
          },
          opType: 11,
          tr: me.sessionService.testRun.id,
        },
        widget: tempwidget, //BugID:104808
        multiDc: false, //me.sessionService.isMultiDC,
        actionForAuditLog: "Trend Compare"
      };
      if(widgetComponent.widget.settings.dataFilter.length == 1 && widgetComponent.widget.settings.dataFilter[0] == 9) //here 9 is for category graph
      {
        payload.tsdbCtx.dataFilter= [0,1,2,3,4,5];
        }
      // Modification in payload for incremental updates
      if (previousData && previousData.grpData.viewBy === viewBy && previousData.grpData.lastSampleTimeStampWithInterval) {
        if (DashboardService.SLAB_GRAPH_TYPE.indexOf(type) !== -1 || DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1) {
          payload.tsdbCtx.duration.st = startTime;
          payload.tsdbCtx.duration.et = endTime;
        } else {
          payload.tsdbCtx.duration.st = previousData.grpData.lastSampleTimeStampWithInterval;
          //
          payload.tsdbCtx.duration.et = 0;
        }
      }
      //setting action as null in case of increment calls.
      if (payload.tsdbCtx.duration.et == 0 || widgetIndex > 0) {
        payload.actionForAuditLog = null;
      }
      if (widgetIndex !== undefined || widgetIndex !== null) {
        path += '?r=' + new Date().valueOf() + '&pn=' + widgetIndex;
        payloadList.push({ path: path, payload: JSON.parse(JSON.stringify(payload)) })
      }
    });

    let subscription = forkJoin(payloadList.map(payloadData => me.controller.post(payloadData.path, payloadData.payload))).subscribe(
      res => {
        const graphData = ObjectUtility.duplicate(res);
        for (let idx = 0; idx < graphData.length; idx++) {
          for (let num = 0; num < graphData[idx].grpData.mFrequency[0].data.length; num++) {
            graphData[idx].grpData.mFrequency[0].data[num].avg = [];
            graphData[idx].grpData.mFrequency[0].data[num].min = [];
            graphData[idx].grpData.mFrequency[0].data[num].max = [];
            graphData[idx].grpData.mFrequency[0].data[num].count = [];
            graphData[idx].grpData.mFrequency[0].data[num].sumCount = [];

          }
        }

        let avg: number = 0;
        let size: number = 0;
        let min: number = 0;
        let max: number = 0;
        let count: number = 0;
        let sumCount: number = 0;
        for (let idx = 0; idx < res.length; idx++) {
          for (let num = 0; num < res[idx].grpData.mFrequency[0].data.length; num++) {
            for (let i = 0; i < widgetComponent.widget.settings.graphStatsType.length; i++) {
              if (widgetComponent.widget.settings.graphStatsType[i] === '0') {
                for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].avg.length; k++) {
                  if (res[idx].grpData.mFrequency[0].data[num].avg[k] === -123456789) {
                    res[idx].grpData.mFrequency[0].data[num].avg[k] = 0;
                  }
                  avg += res[idx].grpData.mFrequency[0].data[num].avg[k];
                  size = res[idx].grpData.mFrequency[0].data[num].avg.length;
                }
                graphData[0].grpData.mFrequency[0].data[num].avg.push(Math.round(((avg / size) + Number.EPSILON) * 100) / 100);
              }
              if (widgetComponent.widget.settings.graphStatsType[i] === '1') {
                for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].min.length; k++) {
                  if (res[idx].grpData.mFrequency[0].data[num].min[k] === -123456789) {
                    res[idx].grpData.mFrequency[0].data[num].min[k] = 0;
                  }
                  min += res[idx].grpData.mFrequency[0].data[num].min[k];
                  size = res[idx].grpData.mFrequency[0].data[num].min.length;
                }
                graphData[0].grpData.mFrequency[0].data[num].min.push(Math.round(((min / size) + Number.EPSILON) * 100) / 100);
              }
              if (widgetComponent.widget.settings.graphStatsType[i] === '2') {
                for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].max.length; k++) {
                  if (res[idx].grpData.mFrequency[0].data[num].max[k] === -123456789) {
                    res[idx].grpData.mFrequency[0].data[num].max[k] = 0;
                  }
                  max += res[idx].grpData.mFrequency[0].data[num].max[k];
                  size = res[idx].grpData.mFrequency[0].data[num].max.length;
                }
                graphData[0].grpData.mFrequency[0].data[num].max.push(Math.round(((max / size) + Number.EPSILON) * 100) / 100);
              }
              if (widgetComponent.widget.settings.graphStatsType[i] === '3') {
                for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].count.length; k++) {
                  if (res[idx].grpData.mFrequency[0].data[num].count[k] === -123456789) {
                    res[idx].grpData.mFrequency[0].data[num].count[k] = 0;
                  }
                  count += res[idx].grpData.mFrequency[0].data[num].count[k];
                  size = res[idx].grpData.mFrequency[0].data[num].count.length;
                }
                graphData[0].grpData.mFrequency[0].data[num].count.push(Math.round(((count / size) + Number.EPSILON) * 100) / 100);
              }
              if (widgetComponent.widget.settings.graphStatsType[i] === '4') {
                for (let k = 0; k < res[idx].grpData.mFrequency[0].data[num].sumCount.length; k++) {
                  if (res[idx].grpData.mFrequency[0].data[num].sumCount[k] === -123456789) {
                    res[idx].grpData.mFrequency[0].data[num].sumCount[k] = 0;
                  }
                  sumCount += res[idx].grpData.mFrequency[0].data[num].sumCount[k];
                  size = res[idx].grpData.mFrequency[0].data[num].sumCount.length;
                }
                graphData[0].grpData.mFrequency[0].data[num].sumCount.push(Math.round(((sumCount / size) + Number.EPSILON) * 100) / 100);
              }
            }

          }
          avg = 0;
          min = 0;
          max = 0;
          count = 0;
          sumCount = 0;
          graphData[0].grpData.mFrequency[0].trend = widgetComponent.widget.compareData.trendCompare;
          graphData[0].grpData.mFrequency[0].measurementName = widgetComponent.widget.compareData.compareData;
        }
        me.interceptor.onDashboardWidgetLoaded(
          graphData[0],
          previousData,
          dashboardComponent,
          widgetComponent,

          (data: DashboardWidgetLoadRes) => {
            // Calculate min freq & collect all graphs
            let minFrequency: MFrequencyTsDetails = null;

            if (data.grpData.mFrequency) {
              for (const mFrequency of data.grpData.mFrequency) {
                if (
                  !minFrequency ||
                  (minFrequency &&
                    minFrequency.frequency >= mFrequency.tsDetail.frequency)
                ) {
                  minFrequency = mFrequency.tsDetail;
                }
              }
            }

            if (minFrequency) {
              // ((minFrequency * (count-1))*1000+ startTime)
              data.grpData.lastSampleTimeStamp =
                minFrequency.frequency * (minFrequency.count - 1) * 1000 +
                minFrequency.st;
            }

            // Save requested viewBy
            data.grpData.viewBy = viewBy;
            output.next(new DashboardWidgetLoadedState(data));
            output.complete();
          },
          (error: AppError) => {
            output.error(new DashboardWidgetLoadingErrorState(error));
            output.complete();
          }
        );

      },
      (e: any) => {
        output.error(new DashboardWidgetLoadingErrorState(e));
        output.complete();

        me.logger.error('Dashboard widget loading failed', e);
      }
    );
    output.next(new DashboardWidgetLoadingSubscriptionState(subscription));
    return output;
  }



  createFavoriteLink(dashboard) {
    try {
      const me = this;
      let encodeFavRelUrl = '';
      let wdFavLink = '';
      let url = window.location.protocol + '//' + window.location.host;
      const openedDashboard = me.sessionService.getSetting("OPENED_DASHBOARD_DASHBOARD", false);
      const dashboardTime: DashboardTime = dashboard.getTime();
      const startTime = _.get(
        dashboardTime,
        'time.frameStart.value',
        null
      );
      const endTime = _.get(dashboardTime, 'time.frameEnd.value', null);
      const viewBy = _.get(dashboardTime, 'viewBy', null);
      const graphTimeKey = 'SPECIFIED_TIME_' + startTime + '_' + endTime;


      encodeFavRelUrl = '&u=guest' +
        '&prodType=' + this.sessionService.session.cctx.prodType + '&testRun=' + this.sessionService.testRun.id +
        '&opType=11' + '&dashboardName=' + openedDashboard.name + '&dashboardPath=' + openedDashboard.path + '&viewby=' + viewBy +
        '&preset=' + graphTimeKey + '&st=' + startTime + '&et=' + endTime;

      wdFavLink = url + '/UnifiedDashboard/copylink.html?requestFrom=CopyLink' + encodeFavRelUrl;


      return wdFavLink;
    } catch (error) {
      console.error("error in create copy fav link", error)
    }
  }

  setPermissionInfoToUpdateDashboard(isUpdateDashboardPermission: any) {
    this.isUpdateDashboardPermission.next(isUpdateDashboardPermission);
  }

  getPermissionInfoToUpdateDashboard() {
    return this.isUpdateDashboardPermission.asObservable();
  }

  checkAlreadyPresentGraph(widgetComponent,dashboardComponent,newGraphCTX) {

    for (let j = 0; j < widgetComponent.widget.dataCtx.gCtx.length; j++) {

      let metric = widgetComponent.widget.dataCtx.gCtx[j].measure.metric;
      let subW = [], subT = [];
      let vector = '';
      let sValueW = '', sValueT = '';
      for (let k = 0; k < widgetComponent.widget.dataCtx.gCtx[j].subject.tags.length; k++) {
        subW[k] = widgetComponent.widget.dataCtx.gCtx[j].subject.tags[k].value;
        sValueW += ">" + subW[k];
      }

      vector = metric + sValueW;
      for (let l = 0; l < newGraphCTX.subject.tags.length; l++) {
        subT[l] = newGraphCTX.subject.tags[l].value;
        sValueT += ">" + subT[l];
      }
      let metricN = newGraphCTX.measure.metric;
      let newGraph = metricN + sValueT;

      if (newGraph === vector) {
        this.messageService.add({ severity: 'success', summary: 'Error', detail: "Graph Already Present" });
        dashboardComponent.mergeShowGraphInTree = false;
        return;
        // break;
      }
    }
  }
  getUserPermissions() {
    const me = this;
    let isPermission : boolean = false;
    const session = me.sessionService.session;
    const feature = session.permissions[1];
    sessionStorage.setItem("Permission","false");
    if(feature !== undefined){
    if (feature.key == "WebDashboard") {
      // const dashboardPermission = feature.permissions[session.permissions[1].permissions.length - 1];
      session.permissions[1].permissions.forEach(element => {
        if (element['feature'] == 'dashboards') {
          if (element.permission > READ_MODE) {
            isPermission = true;
            sessionStorage.setItem("Permission","true");
            return true;
          }
        }
    });

    }
  }
    return isPermission;
  }




 deepCopyFunction = (inObject) => {
  let outObject, value, key;

  if (typeof inObject !== 'object' || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = this.deepCopyFunction(value);
  }

  return outObject;
};

getFromWidgetFlag(){
return this.fromWidgetFlag;
}
setFromWidgetFlag(fromWidgetFlag){
this.fromWidgetFlag =fromWidgetFlag;
}

setSelectedWiget(selectedWidget:DashboardWidgetComponent){
  this.selectedWiget.next(selectedWidget);
}

isSelectedWidget(){
  return this.selectedWiget.asObservable();
}

setReloadFavorite(isReload: any) {
  this.isReload.next(isReload);
}

isReloadFavorite() {
  return this.isReload.asObservable();
}

setAllowFavListForcefullyUpdate(favListUpdate: any) {
  this.favListUpdate.next(favListUpdate);
}
isAllowFavListForcefullyUpdate(){
 return this.favListUpdate.asObservable();
}


isGraphAvailable(widget){
  const me = this;
  let isGraph : boolean = true;
  if(!widget.dataCtx.gCtx){
    isGraph = false;
    return false;
  }
  if(widget.dataCtx.gCtx.length == 0){
    isGraph = false;
    return false;
  }
  else if(widget.dataCtx.glbMetricId == null || widget.dataCtx.glbMetricId == -1){
    isGraph = false;
    widget.dataCtx.gCtx.forEach(element => {
      if(element.hasOwnProperty("measure") && element.hasOwnProperty("subject")){
        //for measure

        //element.measure.forEach(data => {
          if(!element.measure.hasOwnProperty("mgType")){
            element.measure.mgType = "NA";
          }
      //  });

        if(element.subject.tags && element.subject.tags.length == 0) {
          isGraph = true;
           return true;
        }
        element.subject.tags.forEach(data => {
          if(data.key && data.key !== "-" && data.value && data.value !== "NA"){
            isGraph = true;
            return true;
          }
        });
      }
    });
  }


  return isGraph;
}



calculateLowerPanelData(previousData: DashboardWidgetLoadRes,
  widget: DashboardWidgetComponent,) {
  // this.lowerPanelDataArr[widget.uuid] = [];
  let minData, maxData, avgData, stdDevData, lastValueData, totalCountData, sumData;

  const graphStatsType: string[] = widget.widget.settings.graphStatsType.split(',');

  if (previousData.grpData) {

    //iteratting for multiple frequency graphs
    for (const [mFIndex, mFreq,] of previousData.grpData.mFrequency.entries()) {
      for (const [dIndex, mfdata] of mFreq.data.entries()) {

        for (const gsType of graphStatsType) {
          if (gsType == GRAPH_STATS_AVG) {
            minData = this.calculateMinValue(mfdata.min);
            maxData = this.calculateMaxValue(mfdata.max);
            avgData = this.calculateAvgValue(mfdata.avg, mfdata.count);
            stdDevData = this.calculateStdDevValue(mfdata.avg, mfdata.count, mfdata.dataType, mfdata.sumSquare);
            lastValueData = this.calculateLastValue(mfdata.avg);
            totalCountData = this.getTotalCount(mfdata.count);
            sumData = this.getTotalCount(mfdata.avg);

          } else if (gsType == GRAPH_STATS_MIN) {
            minData = this.calculateMinValue(mfdata.min);
            maxData = this.calculateMaxValue(mfdata.min);
            avgData = this.calculateAvgValue(mfdata.min, mfdata.count);
            stdDevData = this.calculateStdDevValue(mfdata.min, mfdata.count, mfdata.dataType, null);
            lastValueData = this.calculateLastValue(mfdata.min);
            totalCountData = this.getTotalCount(mfdata.count);
            sumData = this.getTotalCount(mfdata.min);

          } else if (gsType == GRAPH_STATS_MAX) {
            minData = this.calculateMinValue(mfdata.max);
            maxData = this.calculateMaxValue(mfdata.max);
            avgData = this.calculateAvgValue(mfdata.max, mfdata.count);
            stdDevData = this.calculateStdDevValue(mfdata.max, mfdata.count, mfdata.dataType, null);
            lastValueData = this.calculateLastValue(mfdata.max);
            totalCountData = this.getTotalCount(mfdata.count);
            sumData = this.getTotalCount(mfdata.max);

          } else if (gsType == GRAPH_STATS_COUNT) {
            minData = this.calculateMinValue(mfdata.count);
            maxData = this.calculateMaxValue(mfdata.count);
            avgData = this.calculateAvgValue(mfdata.count, mfdata.count);
            stdDevData = this.calculateStdDevValue(mfdata.count, mfdata.count, mfdata.dataType, null);
            lastValueData = this.calculateLastValue(mfdata.count);
            totalCountData = this.getTotalCount(mfdata.count);
            sumData = this.getTotalCount(mfdata.count);

          } else if (gsType == GRAPH_STATS_SUMCOUNT) {
            minData = this.calculateMinValue(mfdata.sumCount);
            maxData = this.calculateMaxValue(mfdata.sumCount);
            avgData = this.calculateAvgValue(mfdata.sumCount, mfdata.count);
            stdDevData = this.calculateStdDevValue(mfdata.sumCount, mfdata.count, mfdata.dataType, null);
            lastValueData = this.calculateLastValue(mfdata.sumCount);
            totalCountData = this.getTotalCount(mfdata.count);
            sumData = this.getTotalCount(mfdata.sumCount);

          } else {
            minData = this.calculateMinValue(mfdata.min);
            maxData = this.calculateMaxValue(mfdata.max);
            avgData = this.calculateAvgValue(mfdata.avg, mfdata.count);
            stdDevData = this.calculateStdDevValue(mfdata.avg, mfdata.count, mfdata.dataType, mfdata.sumSquare);
            lastValueData = this.calculateLastValue(mfdata.avg);
            totalCountData = this.getTotalCount(mfdata.count);
            sumData = this.getTotalCount(mfdata.avg);
          }

          //for handling negative case
          if (minData == -1) minData = 0;
          if (maxData == -1) maxData = 0;
          if (avgData == -1) avgData = 0;
          if (sumData == -1) sumData = 0;

          if (stdDevData == "NaN.000" || stdDevData == "NaN" || !isFinite(stdDevData)) stdDevData = 0;
          if (avgData == "NaN.000" || avgData == "NaN" || !isFinite(avgData)) avgData = 0;
          if (maxData == "NaN.000" || maxData == "NaN" || !isFinite(maxData)) maxData = 0;
          if (minData == "NaN.000" || minData == "NaN" || !isFinite(minData)) minData = 0;
          if (sumData == "NaN.000" || sumData == "NaN" || !isFinite(sumData)) sumData = 0;


          if (!mfdata.lowerPanelSummary)
            mfdata.lowerPanelSummary = {};

          mfdata.lowerPanelSummary[gsType] = {
            min: minData,
            max: maxData,
            avg: avgData,
            stdDev: stdDevData,
            lastSample: lastValueData,
            count: totalCountData,
            sum: sumData
          }
        }


      }

    }
  }

}

isEmptyORNaNSample(graphData) {
  try {
    //check for exponent and skip
    let testExponent = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/;

    /**
     * Checking for double value for NaN(Not a Number). If double value is NaN/Infinite
     * then it return true while comparing with != operator.
     */
    if (isNaN(graphData) || !isFinite(graphData) || graphData < 0 || testExponent.test(graphData))
      return true;

    return false;
  } catch (e) {
    console.error('isEmptyORNaNSample method', e);
    return false;
  }
}

 /////calculation part
 calculateMinValue(arrSampleData) {
  try {
    if (arrSampleData == null || arrSampleData.length == 0) return -1;

    // Initialize with first value of array.
    let minData = arrSampleData[0];

    for (let i = 0; i < arrSampleData.length; i++) {
      if (this.isEmptyORNaNSample(arrSampleData[i])) continue;

      if (this.isEmptyORNaNSample(minData)) {
        minData = arrSampleData[i];
      } else {
        if (arrSampleData[i] < minData) minData = arrSampleData[i];
      }
    }

    if (this.isEmptyORNaNSample(minData)) {
      return -1;
    }

    if (minData > 0) {
      minData = Math.round(minData * 1000) / 1000;
    }

    return minData;
  } catch (e) {
    console.error('calculateMinValue', e);
    return -1;
  }
}

calculateMaxValue(arrSampleData) {
  try {
    if (arrSampleData == null || arrSampleData.length == 0) return -1;

    let maxData = 0.0;
    for (let i = 0; i < arrSampleData.length; i++) {
      if (arrSampleData[i] > maxData) maxData = arrSampleData[i];
    }

    if (maxData > 0) {
      maxData = Math.round(maxData * 1000) / 1000;
    }
    return maxData;
  } catch (e) {
    console.error('calculateMaxValue', e);
    return -1;
  }
}

calculateAvgValue(arrSampleData, arrCountData) {
  try {
    let total = 0;
    if (arrSampleData == null || arrCountData == null || arrSampleData.length == 0 || arrCountData.length == 0) return -1;

    for (let i = 0; i < arrSampleData.length; i++) {
      if (
        this.isEmptyORNaNSample(arrSampleData[i]) ||
        this.isEmptyORNaNSample(arrCountData[i])
      )
        continue;

      total = total + arrSampleData[i] * arrCountData[i];
    }

    let totalCount = this.getTotalCount(arrCountData);
    var avgValue = total / totalCount;
    avgValue = avgValue ? avgValue : 0;
    //  console.log("avgValue----------",avgValue);

    if (avgValue > 0) {
      avgValue = Math.round(avgValue * 1000) / 1000;
    }
    return avgValue;
  } catch (e) {
    console.error('calculateAvgValue method', e);
    return -1;
  }
}
calculateStdDevValue(arrSampleData, arrCountData, dataType, squareArray) {
  try {

    if (arrSampleData == null || arrSampleData.length == 0) return 0.0;

    let totalSumSqr = 0;
    let sum = 0;
    let avg = 0;
    let totalCount = this.getTotalCount(arrCountData);

    for (let i = 0; i < arrSampleData.length; i++) {


      if (this.isEmptyORNaNSample(arrSampleData[i]) || this.isEmptyORNaNSample(arrCountData[i]))
        continue;
      sum = sum + (arrSampleData[i] * arrCountData[i]);

    }

    if (totalCount != 0)
      avg = sum / totalCount;

    if (squareArray == null) {

      squareArray = [];
      for (let i = 0; i < arrSampleData.length; i++) {
        if (this.isEmptyORNaNSample(arrSampleData[i]))
          continue;
        squareArray[i] = arrSampleData[i] * arrSampleData[i];

      }
    }

    for (let i = 0; i < squareArray.length; i++) {

      if (this.isEmptyORNaNSample(squareArray[i]))
        continue;

      totalSumSqr = totalSumSqr + squareArray[i];
      if (dataType == DATA_TYPE_TIMES_STD)
        totalSumSqr = totalSumSqr / 1000;
    }
    // console.log("sumSq arr", squareArray)
    // console.log("count arr", arrCountData)
    // console.log("arrSampleData", arrSampleData)

    if (arrSampleData.length > 1)
      var stdValue = Math.sqrt(Math.abs(totalSumSqr - (sum * avg)) / (totalCount - 1));
    // console.log("....sum....", sum, "...avg..... ", avg, "//totalCount.....", totalCount, ".....totalSumSqr......", totalSumSqr, "std...", stdValue, "...arrSampleData.length...", arrSampleData.length)
    stdValue = stdValue ? stdValue : 0;
    if (stdValue > 0) {
      stdValue = Math.round(stdValue * 1000) / 1000;
    }
    return stdValue;
  } catch (e) {
    console.error('calculateStdDevValue method', e);
    return 0.0;
  }
}



isMetricUsesSummaryDataForGraph( widget : DashboardWidgetComponent) {
  if(widget) {
    if(widget.widget && widget.widget.type == "GRAPH") {
     if(DashboardService.PRE_CAL_REQ_FOR_GRAPHS.indexOf(widget.widget.settings.chartType) !== -1) {
       return true;
     }
     return false;
    }
  }

  return true;


}

calculateLastValue(arrSampleData) {
  try {
    if (arrSampleData == null || arrSampleData.length == 0) return 0.0;

    if (this.isEmptyORNaNSample(arrSampleData[arrSampleData.length - 1]))
      return 0.0;

    let lastSampleValue = arrSampleData[arrSampleData.length - 1];
    return lastSampleValue;

  } catch (e) {
    console.error('calculateLastValue method', e);
    return 0.0;
  }
}


getTotalCount(arrSampleData) {
  try {
    let total = 0;
    if (arrSampleData == null || arrSampleData.length == 0) return 0;

    for (let i = 0; i < arrSampleData.length; i++) {
      if (this.isEmptyORNaNSample(arrSampleData[i])) continue;

      total = total + arrSampleData[i];
    }
    return total;
  } catch (e) {
    console.error('getTotalCount', e);
    return 0;
  }
}

getErrorMessage(widget){
  if(!widget.dataCtx.gCtx){
    return "Metric is not available.";
  }
  if(widget.dataCtx.gCtx.length == 0){
    return "Metric is not available.";
  }
  else{
    return "Scalar Graphs are not supported."
  }
}

setDashboardSelected(isDashboardTabSelected: any) {
  this.isDashboardTabSelected.next(isDashboardTabSelected);
}

getDashboardTabSelected() {
  return this.isDashboardTabSelected.asObservable();
}

}
