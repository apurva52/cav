import { LowerPanelService } from './../../lower-tabular-panel/service/lower-tabular-panel.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { GridsterItemComponent } from 'angular-gridster2';
import { Subscription, Subject } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { PipeService } from '../../pipes/pipe.service';
import { IDGenerator } from '../../utility/IDGenerator';
import { ObjectUtility } from '../../utility/object';
import { DashboardComponent } from '../dashboard.component';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout.component';
import {
  DashboardFavCTX,
  DashboardGraphDataMFrequency,
  DashboardGraphs,
  DashboardLayoutMode,
  DashboardTime,
  DashboardWidget,
  DashboardWidgetGraph,
  DashboardWidgetLoadReq,
  DashboardWidgetLoadRes,
  DataFilterLabel,
  ForEachGraphArgs,
  GraphData,
  GraphSampleFilterDTO,
  GraphSetting,
} from '../service/dashboard.model';
import { DashboardService } from '../service/dashboard.service';
import {
  DashboardWidgetLoadedState,
  DashboardWidgetLoadingErrorState,
  DashboardWidgetLoadingState,
  DashboardWidgetLoadingSubscriptionState,
} from '../service/dashboard.state';
import * as _ from 'lodash';
import { DashboardGraphService } from '../service/dashboard-graph.service';
import { TimebarService } from './../../time-bar/service/time-bar.service';
import { FileImportService } from './types/file-import/service/file-import.service';
import {TreeOperationsService} from '../../dashboard/sidebars/show-graph-in-tree/service/tree-operations.service';
import { HttpClient } from '@angular/common/http';
import { NVDDRService } from './widget-menu/service/nvddrservice.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dashboard-widget',
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardWidgetComponent implements OnInit, AfterViewInit {
  @Input() widget: DashboardWidget;
  @Input() data: DashboardWidgetLoadRes;
  @Input() parentWidget: DashboardWidgetComponent;
  @Input() layout: DashboardLayoutComponent;
  @Input() gridContainer: GridsterItemComponent;

  @HostBinding('class.selected') isSelected: boolean = false;

  graphs: { [key: string]: GraphData } = {};

  events: { [key: string]: Subject<void> } = {};

  dashboardTime: DashboardTime;
  error: AppError;
  empty: boolean;
  loading: boolean;
  uuid: string = IDGenerator.newId();
  lastLoadedAt: number = null;
  errorMessage : string = null;

  get isFocused(): boolean {
    if (this.gridContainer) {
      return this.gridContainer.el.hasAttribute('focus');
    }
    return false;
  }

  protected hasDataCall = true;

  private loadingSubscription: Subscription;

  private timerLoading: NodeJS.Timeout = null;

  get dashboard(): DashboardComponent {
    return this.layout.dashboardComponent;
  }

  constructor(
    @Inject('mode') public mode: DashboardLayoutMode,
    public element: ElementRef,
    private dashboardService: DashboardService,
    protected sessionService: SessionService,
    protected pipeService: PipeService,
    private dashboardGraphService: DashboardGraphService,
    protected fileImportService : FileImportService,
    protected cd: ChangeDetectorRef,
    private treeOperationsService :TreeOperationsService,
    protected httpClient: HttpClient,
    private lowerPanelService: LowerPanelService,
    private _nvddrservice: NVDDRService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private timebarService : TimebarService
  ) {}

  ngOnInit(): void {
    const me = this;

    if (!me.dashboard || !me.widget) {
      return;
    }

    me.events.onLoaded = new Subject<void>();
    me.events.onLoading = new Subject<void>();
    me.events.onLoadingError = new Subject<void>();
    me.events.onGraphOperation = new Subject<void>();
``
    me.init();
  }

  ngAfterViewInit(): void {
    const me = this;
    me.loading = true;
    me.dashboard.widgetInit(this);
  }

  protected saveGraph(graph: GraphData, index: number) {
    const me = this;

    if (!me.graphs[graph.measure.metric]) {
      // graph.index = index;
      me.graphs[graph.measure.metric] = graph;
    }
  }

  protected getGraph(name: string): GraphData {
    const me = this;
    return me.graphs[name] || null;
  }

  public toggleFocus() {
    if(this.dashboard.layout.mode == "VIEW"){
    this.focus(this.isFocused);
    }
  }

  public focus(defocus?: boolean) {
    const me = this;

    me.select(true);

    if (me.gridContainer) {
      if (me.parentWidget) {
        me.parentWidget.focus(defocus);
      }
      if (!defocus) {
        me.gridContainer.el.setAttribute('focus', null);
        me.layout.el.nativeElement.setAttribute('focus-mode', null);
        me.dashboard.events.focusModeChanged.next(true);
        me.dashboard.events.analysisModeToggle.next(true);
      } else {
        me.gridContainer.el.removeAttribute('focus');
        me.layout.el.nativeElement.removeAttribute('focus-mode');
        me.dashboard.events.focusModeChanged.next(false);
        me.dashboard.events.analysisModeToggle.next(false);
      }

      setTimeout(() => {
        me.resize();
      }, 200);
    }
  }

  public getLowerPanelService() {
    return this.lowerPanelService;
  }

  public select(select?: boolean) {
    const me = this;
    if (select === undefined) {
      select = true;
    }
    me.isSelected = select;
    me.dashboard.selectWidget(me, true);
  }

  public graphOperation(
    graphNames: string[],
    match: 'SHOW' | 'HIDE' | 'SELECTED' | 'UNSELECTED',
    unmatch?: 'SHOW' | 'HIDE' | 'SELECTED' | 'UNSELECTED',
    color?: string, isForcefullyColorChange ? : boolean
  ) {
    const me = this;

    me.forEachGraph((args: ForEachGraphArgs) => {
      if (graphNames.indexOf(args.graphName) !== -1) {
        switch (match) {
          case 'SHOW':
            args.graphSettings.visible = true;
            if (args.graph.compareColor != null) {
              args.graph.lowerPanelChecked = false;
            }
            if (color) {
              args.graphSettings.color = color;
            }
            args.graphSettings.isForcefullyColorChange = isForcefullyColorChange == true ? true : false;
            break;
          case 'HIDE':
            if (args.graph.compareColor != null) {
              args.graphSettings = {};
              args.graphSettings.color = args.graph.compareColor;

            }
            args.graphSettings.garbage = false;
            args.graphSettings.selected = false;
            args.graphSettings.visible = false;
            args.graph.lowerPanelChecked = true;
            if (color) {
              args.graphSettings.color = color;
            }
            break;
          case 'SELECTED':
            args.graphSettings.selected = true;
            if (color) {
              args.graphSettings.color = color;
            }
            break;
          case 'UNSELECTED':
            args.graphSettings.selected = false;
        }
        if (graphNames.length === 1) {
          return;
        }
      } else if (unmatch) {
        switch (unmatch) {
          case 'SHOW':
            args.graphSettings.visible = true;
            if (args.graph.compareColor != null) {
              args.graph.lowerPanelChecked = false;
            }
            break;
          case 'HIDE':
            if (args.graph.compareColor != null) {
              args.graphSettings = {};
              args.graphSettings.color = args.graph.compareColor;

            }
            args.graphSettings.garbage = false;
            args.graphSettings.selected = false;
            args.graphSettings.visible = false;
            args.graph.lowerPanelChecked = true;
            break;
          case 'SELECTED':
            args.graphSettings.selected = true;
            break;
          case 'UNSELECTED':
            args.graphSettings.selected = false;
        }
      }
    });

    me.events.onGraphOperation.next();

    setTimeout(() => {
      me.render();
    });
  }

  public init() {}

  public render() {
    const me = this;
    setTimeout(() => {
      me.cd.detectChanges();
    });
  }

  public resize() {}

  public clear() {
    const me = this;
    me.data = null;
    me.error = null;
    me.loading = false;
    me.empty = false;

    me.cd.detectChanges();
  }

  public load() {
    const me = this;

    // Stop Loading
    // return false;
if(me.sessionService.testRun.running === false){
  if (me.treeOperationsService.stopCounter)
   clearInterval(me.treeOperationsService.stopCounter);
}
    if (!me.hasDataCall) {
      return;
    }


    const isVisible = me.element.nativeElement.getAttribute('visible');
    if (isVisible === '0' || !isVisible) {
      return;
    }

    // add code for resolved the bug - 110523  when the global Custom Time period has been applied and user scroll the widget then call was not going when the data is present on widget .
    const tempDashboardTime: DashboardTime = me.dashboard.getTime();
    const previousData = me.data;
    if(previousData && tempDashboardTime.graphTimeKey && tempDashboardTime.graphTimeKey.startsWith("SPECIFIED_TIME") && me.widget.opName !== "zoom_operation" && me.widget.opName !== "widget_wise_operation" && me.widget.opName !== "undo_zoom_operation" && me.timebarService.isTimeChangedFromGlobal == false) {
      return ;
    }

    if (me.timerLoading) {
      clearTimeout(me.timerLoading);
      me.lastLoadedAt = null;
    }

    if (me.loadingSubscription) {
      me.loadingSubscription.unsubscribe();
    }

    me.lastLoadedAt = new Date().valueOf();
    me.timerLoading = setTimeout(() => {
      me.dashboardService.widgetLoad(me.dashboard, me).subscribe(
        (state: Store.State) => {
          if (state instanceof DashboardWidgetLoadingSubscriptionState) {
            me.loadingSubscription = state.data;
            return;
          }

          if (state instanceof DashboardWidgetLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof DashboardWidgetLoadedState) {
            me.onLoaded(state);
            return;
          }
        },
        (state: DashboardWidgetLoadingErrorState) => {
          me.onLoadingError(state);
          me.lastLoadedAt = null;
        }
      );

      setTimeout(() => {
        me.cd.detectChanges();
      });
    }, 500);




  }

  highlightGraph(graphName, selected) {
    const me = this;
    if(!selected) {
      me.graphOperation([graphName],'SELECTED','UNSELECTED');
    }else {
      me.graphOperation([undefined],'SELECTED','UNSELECTED');
    }
  }

  getTime() {
    const me = this;
    const selectedTime = [];

    const dashboardTime: DashboardTime = me.dashboard.getTime(); // TODO: widget time instead of dashboard

    selectedTime.push({
      startTime: _.get(dashboardTime, 'time.frameStart.value', null),
      endTime: _.get(dashboardTime, 'time.frameEnd.value', null),
      graphTimeKey: _.get(dashboardTime, 'graphTimeKey', null),
      viewBy: _.get(dashboardTime, 'viewBy', null),
    });

    return selectedTime;
  }

  handleGeoMapEvent(geoMapObj) {
   try {
     if(geoMapObj) {
       const dashboardTime = this.getTime();
       console.log("Dashboard Time = " , dashboardTime);
       let startTime = dashboardTime[0].startTime;
       let endTime = dashboardTime[0].endTime;
       let graphTimeKey = dashboardTime[0].graphTimeKey;

       if(this._nvddrservice.ddrToNVForGeoMap(geoMapObj,startTime,endTime,graphTimeKey , this.http , this.router)) {
         return;
       }

     }


   } catch (error) {

   }
  }

  private onLoading(state: DashboardWidgetLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.widget.newWidget = false;
    setTimeout(() => {
      me.events.onLoading.next();
      me.cd.detectChanges();
    });
  }

  private onLoadingError(state: DashboardWidgetLoadingErrorState) {
    const me = this;
    me.error = state.error;
    me.loading = false;
    if(me.data){
    me.empty = false;
    }
    else{
      me.empty = true;
    }
   var error : any;
   if(state.error && state.error['error'] && state.error['error']['status']){
     error = state.error['error']['status'];
   if(error && error.msg){
    me.errorMessage = error['msg'];
   }
   else if(error && error.detailedMsg){
     me.errorMessage = error['detailedMsg'];

   }

   else{
    me.errorMessage = "No error message is provided."
   }
  }
   if(me.error['status'] == 500){
    me.errorMessage = "Internal Server Error."
   }
    me.widget.newWidget = false;
     // Rendering performance
    setTimeout(() => {
      me.render();
      me.cd.detectChanges();
    });
    setTimeout(() => {
      me.events.onLoadingError.next();
      me.cd.detectChanges();
    });
  }

  private onLoaded(state: DashboardWidgetLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.data = state.data;
    me.timebarService.isTimeChangedFromGlobal = false;
    let previousData =[];
    if (me.dashboard.mergeShowGraphInTree && me.widget.compareData.trendCompare) {
      me.dashboard.mergeShowGraphInTree = false;
      /* if(me.dashboardService.previousCompareData){
        for(let i=0;i<me.dashboardService.previousCompareData.grpData.mFrequency[0].data.length;i++){
          me.data.grpData.mFrequency[0].data.push(me.dashboardService.previousCompareData.grpData.mFrequency[0].data[i]);
          me.data.grpData.mFrequency[0].incrementalData.push(me.dashboardService.previousCompareData.grpData.mFrequency[0].data[i]);
         }
      } */
    }
    me.widget.newWidget = false;
    if (me.data && me.data.grpData && me.data.grpData.mFrequency) {
      me.empty = false;
    }
    // change flag after data loaded
    me.widget.isWidgetSettingChanged = false;

    // Rendering performance
    setTimeout(() => {
      me.render();

      me.cd.detectChanges();
    });

    setTimeout(() => {
      if(me.dashboardService.displayMsgOnViewByChanged == 1 ) {
        this.messageService.add({severity:'info', summary:'info', detail:'View By of some widget have been auto updated '});
        me.dashboardService.displayMsgOnViewByChanged = 0;
      }
      me.events.onLoaded.next();
      me.cd.detectChanges();
    });
  }

  public hasLink(): boolean {
    const me = this;
    return (
      _.has(me.widget, 'settings.link.name') &&
      _.has(me.widget, 'settings.link.path')
    );
  }

  private getGraphSettings(graph: GraphData, gsType: string): GraphSetting {
    const me = this;

    const graphId: string = graph.glbMetricId + '-' + gsType;

    const graphSettings = {};
    if(me.widget.graphSettings === undefined){              //This method call when widget is null and Data not available on widget.
      const graphSetting = {};
      const obj : GraphSetting  = {
        color: "",
        garbage: false,
        selected: false,
        visible: true,
        isForcefullyColorChange: false,
      };
      obj.color = me.dashboardGraphService.getColor(graphId);

      graphSetting[graphId] = obj;

      graphSettings['graphSettings'] = graphSetting;

      Object.assign(me.widget,graphSettings);

    }


    if (!me.widget.graphSettings[graphId]) {
      // if(me.widget.dropTree && me.isSelected){
      //   me.widget.graphSettings[graphId] = {
      //     color: me.dashboardGraphService.getColor(graphId),
      //     garbage: false,
      //     selected: true,
      //     visible: true,
      //   };
      //  }
      //  else{
      me.widget.graphSettings[graphId] = {
        color: me.dashboardGraphService.getColor(graphId),
        garbage: false,
        selected: false,
        visible: true,
        isForcefullyColorChange: false,
      };

    }

    if(me.widget.graphSettings[graphId]){
      if(me.widget.graphSettings[graphId].color == "" || !me.widget.graphSettings[graphId].color){
        me.widget.graphSettings[graphId].color = me.dashboardGraphService.getColor(graphId);
        me.widget.graphSettings[graphId].isForcefullyColorChange = false;
      }
      else{
        me.widget.graphSettings[graphId].isForcefullyColorChange = true;
      }
    }
     if (graph.compareColor != null) {
       if (!me.widget.withOutCompareColor)
         me.widget.withOutCompareColor = me.widget.graphSettings[graphId].color;
    //   console.log('enter here-1');
      me.widget.graphSettings[graphId] = {
        color: graph.compareColor,
        garbage: false,
        selected: false,
        visible: true,
        isForcefullyColorChange : false,
      };
    }
    else if (me.widget.withOutCompareColor)
    {
      me.widget.graphSettings[graphId].color = me.widget.withOutCompareColor;
      me.widget.withOutCompareColor = null;
    }
    me.widget.graphSettings[graphId].garbage = false;
    return me.widget.graphSettings[graphId];
  }

  public getSelectedGraph(graph: GraphData, selected: boolean): GraphData {
    if (selected) {
      return graph;
    }
  }

  public goToLink(): boolean {
    const me = this;

    if (me.hasLink()) {
      me.dashboard.load(
        me.dashboard.group,
        me.widget.settings.link.name,
        me.widget.settings.link.path,
        true
      );
      return true;
    }

    return false;
  }

  public pauseWidgetDataAutoRefresh() {}

  public resumeWidgetDataAutoRefresh() {}

  public forEachGraph(fn: (args: ForEachGraphArgs) => void) {
    const me = this;

    // const graphIndex = _.keyBy(
    //   me.widget.graphs.widgetGraphs,
    //   (o: DashboardWidgetGraph) => {
    //     return o.glbMetricId;
    //   }
    // );

    const graphStatsType: string[] = me.widget.settings.graphStatsType.split(
      ','
    );

    let ggi: number = 0;
    let ggl: number = 0;

    if (me.data && me.data.grpData) {
      for (const imf in me.data.grpData.mFrequency) {
        if (me.data.grpData.mFrequency[imf]) {
          const mf = me.data.grpData.mFrequency[imf];
          for (const ig in mf.data) {
            if (mf.data[ig]) {
              ggl++;
            }
          }
        }
      }
      ggl *= graphStatsType.length;
      ggl--;

      if (ggl < 0) {
        return;
      }

      for (const imf in me.data.grpData.mFrequency) {
        if (me.data.grpData.mFrequency[imf]) {
          const mf = me.data.grpData.mFrequency[imf];
          for (const ig in mf.data) {
            if (mf.data[ig]) {
              for (const gsType of graphStatsType) {
                let graphToFilter: boolean = false;
                if (
                  me.widget.settings.widgetFilter &&
                  me.widget.settings.widgetFilter.enabled && me.widget.settings.dataFilter.length == 5
                ) {
                  // console.log("coming here after interceptor", mf.data[ig].avg)
                  graphToFilter = me.applyGraphFiltersBasedOnWidgetSettings(
                    mf.data[ig],
                    gsType
                  );
                  if (graphToFilter) {
                    mf.data.splice(parseInt(ig), 1);
                  }
                }

                if (
                  me.widget.settings.graphFilter &&
                  me.widget.settings.graphFilter.length > 0
                ) {
                  if (
                    me.widget.settings.graphFilter[ig] &&
                    me.widget.settings.graphFilter[ig].graphName ==
                      mf.data[ig].measure.metric
                  )
                    mf.data[ig] = me.applySampleFilterBasedOnWidgetSettings(
                      mf.data[ig],
                      me.widget.settings.graphFilter[ig]
                    );
                }


                  if(me.widget.dropTree && me.isSelected){
                   me.widget.graphSettings = {};
                   me.widget.dropTree = false;
                  }

                if (mf.data[ig]) {
                  var g = mf.data[ig];
                  var graphSetting = me.getGraphSettings(g, gsType); // TODO write a comman Fun
                }

              //  console.log("after filters applied", me.widget.graphSettings);
                if (!g.lowerPanelSummary) {
                  g.lowerPanelSummary = {};
                }

                if (!g.lowerPanelSummary[gsType]) {
                  g.lowerPanelSummary[gsType] = {};
                }

                const incrementalG = mf.incrementalData
                  ? mf.incrementalData[ig]
                  : null;

                if (incrementalG && !incrementalG.lowerPanelSummary) {
                  incrementalG.lowerPanelSummary = {};
                }

                if (incrementalG && !incrementalG.lowerPanelSummary[gsType]) {
                  incrementalG.lowerPanelSummary[gsType] = {};
                }

                let graphName;
                if (g.subject.tags[0].sName === 'NA') {
                  graphName = g.measure.metric;
                  if (gsType !== '0') {
                    graphName =
                      DataFilterLabel[gsType] + ' ' + g.measure.metric;
                  }
                } else {
                  graphName =
                    g.measure.metric + ' - ' + g.subject.tags[0].sName;
                  if (gsType !== '0') {
                    graphName =
                      DataFilterLabel[gsType] +
                      ' ' +
                      g.measure.metric +
                      ' - ' +
                      g.subject.tags[0].sName;
                  }
                }

                fn({
                  graph: g,
                  tsDetail: mf.tsDetail,
                  graphIndex: Number(ig),
                  globalGraphIndex: ggi,
                  mFrequencyIndex: Number(imf),
                  gsType: gsType,
                  graphName: graphName,
                  incrementalData: incrementalG,
                  graphSettings: graphSetting,
                  globalTotalGraphs: ggl,
                } as ForEachGraphArgs);
                ggi++;
              }
            }
          }
        }
      }
    }
  }

  applySampleFilterBasedOnWidgetSettings(
    graph: GraphData,
    sampleFilter: GraphSampleFilterDTO
  ) {
    try {
      const me = this;
    //  console.log('coming....', graph, '......filters..', sampleFilter);
      let arrToFilter = graph[sampleFilter.filterBasedOn];
     // console.log('original arr', arrToFilter);
      let newArr = [];
     // console.log('operator', sampleFilter.filterType);
      switch (sampleFilter.filterType) {
        case '>=':
          // newArr = me.filterBasedOnGreaterThan();
          for (let i = 0; i < arrToFilter.length; i++) {
            if (arrToFilter[i] >= sampleFilter.filterValue1)
              newArr.push(arrToFilter[i]);
            else newArr.push(null);
          }

          console.log('newArr coming..', newArr);
          break;
        case '<=':
          // newArr = me.filterBasedOnLessThan();
          for (let i = 0; i < arrToFilter.length; i++) {
            if (arrToFilter[i] <= sampleFilter.filterValue1)
              newArr.push(arrToFilter[i]);
            else newArr.push(null);
          }
          break;
        case 'In-Between':
          // newArr = me.filterBasedOnBetween();
          for (let i = 0; i < arrToFilter.length; i++) {
            if (
              arrToFilter[i] >= sampleFilter.filterValue1 &&
              arrToFilter[i] <= sampleFilter.filterValue2
            )
              newArr.push(arrToFilter[i]);
            else newArr.push(null);
          }
          break;

        default:
          newArr;
      }
      // }
      graph[sampleFilter.filterBasedOn] = newArr;
      console.log('arrToFilter', arrToFilter);
    } catch (error) {
      console.error('Error in applying sample filters in graphs.');
    }

    console.log('graph return', graph);
    return graph;
  }

  applyGraphFiltersBasedOnWidgetSettings(graph: GraphData, gsType: string) {
    let arrName;
    try {
      switch (gsType) {
        case '0':
          arrName = 'avg';
          break;
        case '1':
          arrName = 'min';
          break;
        case '2':
          arrName = 'max';
          break;
        case '3':
          arrName = 'count';
          break;
        case '4':
          arrName = 'sumSquare';
          break;
        case '4':
          arrName = 'sumCount';
          break;
      }
      let tmpArray = [...graph[arrName]];
      if (this.widget.settings.widgetFilter.criteria == 'Non-Zero') {
        //checking if all elements contain 0.
        const isAllZero = tmpArray.every(
          (item) =>
            item == 0 ||
            item == -123456789 ||
            Number.isNaN(item) ||
            item == '0' ||
            item == '-123456789' ||
            item == 'NaN'
        );
        return isAllZero;
      } else if (this.widget.settings.widgetFilter.criteria == 'Zero') {
        //checking if all elements contain any value .
        const found = tmpArray.some((r) => r > 0);
        return found;
      } else if (this.widget.settings.widgetFilter.criteria == 'Advanced') {
      }
    } catch (error) {
      console.error('Error is filtering graph', error);
    }
  }
}
