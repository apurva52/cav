import { DerivedViewExpComponent } from './../derived-view-exp/derived-view-exp.component';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import * as _ from 'lodash';
import { ConfirmationService, MenuItem, MessageService } from 'primeng';
import { Observable, Subject, Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { AddCustomMetricesComponent } from '../add-custom-metrices/add-custom-metrices.component';
import { GraphDataComponent } from '../graph-data/graph-data.component';
import { PatternMatchingComponent } from '../pattern-matching/pattern-matching.component';
import {
  TimebarValue,
  TimebarValueInput,
} from '../time-bar/service/time-bar.model';
import { TimebarService } from '../time-bar/service/time-bar.service';
import { TimePeriodComponent } from '../time-period/time-period.component';
import { WidgetSettingComponent } from '../widget-setting/widget-setting.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { DashboardLayoutGalleryComponent } from './layouts/gallery/dashboard-layout-gallery.component';
import { DashboardLayoutGridComponent } from './layouts/grid/dashboard-layout-grid.component';
import {
  DashboardFavCTX,
  DashboardEvents,
  DashboardLayout,
  DashboardTime,
  DashboardWidget,
  DashboardFavNameCTX,
  DashboardWidgetLayout,
  DashboardWidgetSettings,
} from './service/dashboard.model';
import { DashboardService } from './service/dashboard.service';
import {
  DashboardLoadedState,
  DashboardLoadingErrorState,
  DashboardLoadingState,
} from './service/dashboard.state';
import { AdvanceOpenMergeComponent } from './sidebars/advance-open-merge/advance-open-merge.component';
import { DashboardFavListComponent } from './sidebars/dashboard-fav-list/dashboard-fav-list.component';
import { LayoutManagerComponent } from './sidebars/layout-manager/layout-manager.component';
import { ShowGraphInTreeComponent } from './sidebars/show-graph-in-tree/show-graph-in-tree.component';
import { DashboardWidgetComponent } from './widget/dashboard-widget.component';
import { LowerTabularPanelComponent } from '../lower-tabular-panel/lower-tabular-panel.component';
import { DashboardGraphService } from './service/dashboard-graph.service';
import { TimeBarComponent } from '../time-bar/time-bar.component';
import { DerivedMetricComponent } from '../derived-metric/derived-metric.component';
import { ReportsComponent } from './dialogs/reports/reports.component';
import { CustomMetricsComponent } from './sidebars/custom-metrics/custom-metrics.component';
import { MetricsSettingsComponent } from '../metrics-settings/metrics-settings.component';
import { GroupedDerivedMetricesComponent } from '../grouped-derived-metrices/grouped-derived-metrices.component';
import { AggregatedVirtualMetricesComponent } from '../aggregated-virtual-metrices/aggregated-virtual-metrices.component';
import { MetricDescriptionComponent } from './dialogs/metric-description/metric-description.component';
import { IDGenerator } from '../utility/IDGenerator';
import { RelatedmetricsComponent } from '../metrics/relatedmetrics/relatedmetrics.component';
import { MonitorDialogComponent } from '../monitor-dialog/monitor-dialog.component';
import { CopyFavoriteLinkBoxComponent } from '../copy-favorite-link-box/copy-favorite-link-box.component';
import { FilterParameterBoxComponent } from '../filter-parameter-box/filter-parameter-box.component';
import { ParametersComponent } from './sidebars/parameters/parameters.component';
import { FileManagerComponent } from '../file-manager/file-manager.component';
import { EditWidgetComponent } from './sidebars/edit-widget/edit-widget.component';
import { AddDashboardComponent } from 'src/app/pages/my-library/dashboards/dialogs/add-dashboard/add-dashboard.component';
import { SnapShot } from '../compare-data/service/compare-data.model';
import { CompareDataComponent } from '../compare-data/compare-data.component';
import { CustomTemplateDialogComponent } from './dialogs/custom-template-dialog/custom-template-dialog.component';
import { FilterByFavoriteComponent } from './sidebars/filter-by-favorite/filter-by-favorite.component';
import {GraphInTreeService} from './sidebars/show-graph-in-tree/service/graph-in-tree.service';
import { MenuService } from './menu.service';
import { indexOf } from 'lodash';
import {
  DashboardStateLoadedStatus,
  DashboardStateLoadingErrorStatus,
  DashboardStateLoadingStatus,
} from 'src/app/pages/my-library/dashboards/service/dashboards.state';
import {
  DashboardReq,
  DASHBOARD_SUCCESSFULY_SAVED,
  READ_MODE,
  READ_WRITE_MODE,
  SAVE_DASHBOARD,
  UPDATE_DASHBOARD,
} from 'src/app/pages/my-library/dashboards/service/dashboards.model';
import { DashboardsService } from 'src/app/pages/my-library/dashboards/service/dashboards.service';
import {
  DEFAULT_DATA_SETTINGS,
  DEFAULT_FILE_SETTINGS,
  DEFAULT_GRAPH_SETTINGS,
  DEFAULT_GROUP_WIDGET,
  DEFAULT_HEALTH_SETTINGS,
  DEFAULT_IMAGE_SETTINGS,
  DEFAULT_LABEL_SETTINGS,
  DEFAULT_TABULAR_SETTINGS,
} from './service/dashboard.dummy';
import {
  DashboardLayoutRequest,
  DELETE_CUSTOM_LAYOUT,
  LayoutCtx,
  LayoutNameCtx,
  LAYOUT_SUCCESSFULY_DELETED,
  LAYOUT_SUCCESSFULY_SAVED,
  OLD_GRID_MAP_ROW_HEIGHT,
  SAVE_CUSTOM_LAYOUT,
  WIDGETS_MARGIN,
  GRID_ROWHEIGHT
} from './sidebars/layout-manager/service/layout-manager.model';
import {
  DashboardLayoutDeletedState,
  DashboardLayoutDeletingErrorState,
  DashboardLayoutDeletingState,
  DashboardLayoutSavedState,
  DashboardLayoutSavingErrorState,
  DashboardLayoutSavingState,
} from './sidebars/layout-manager/service/layout-manager.state';
import { DashboardLayoutManagerService } from './sidebars/layout-manager/service/layout-manager.service';
import { GetFileDataComponent } from '../get-file-data/get-file-data.component';
import { GroupMetaDataCtx } from '../pattern-matching/pattern-matching.model';
import { RunCommandComponent } from 'src/app/pages/tools/admin/net-diagnostics-enterprise/dialogs/run-command/run-command.component';
import { truncate, truncateSync } from 'fs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private static instance: DashboardComponent = null;
  private static instanceOutput: Subject<DashboardComponent> = null;

  name: string;
  path: string;

  gridConfig: GridsterConfig = {};

  data: DashboardFavCTX;

  loading: boolean;
  error: boolean;
  empty: boolean;

  events: DashboardEvents;

  group: string;

  dashboardTime: DashboardTime;

  currentTimebarValue: TimebarValue;

  layout: DashboardLayoutComponent;
  oldLayout: DashboardLayoutComponent;

  selectedWidget: DashboardWidgetComponent = null;

  arrTreeChild = [];
  mergeMetricsValue: string;

  @Output() openSidebar = new EventEmitter<boolean>();

  isOpen: boolean;
  isShow: boolean = true;

  // defining flag for group widget
  updateGroupDashboard: boolean;

  rejectVisible: boolean = true;
  acceptLable: string = 'Yes';
  copyOfWidgetsArray: any[] = [];
  isNewDashboard: boolean = false;
  featureName:string;
  selectWidgetidx :number = 0;
  @ViewChild('layoutContainer', { read: ViewContainerRef })
  layoutContainer: ViewContainerRef;
  mode : string = 'VIEW';
  @ViewChild(AdvanceOpenMergeComponent, { read: AdvanceOpenMergeComponent })
  private sidebarAdvanceOpenMergeComponent: AdvanceOpenMergeComponent;

  @ViewChild(MetricDescriptionComponent, { read: MetricDescriptionComponent })
  private metricDescriptionComponent: MetricDescriptionComponent;

  @ViewChild(ShowGraphInTreeComponent, { read: ShowGraphInTreeComponent })
  private sidebarShowGraphInTreeComponent: ShowGraphInTreeComponent;

  @ViewChild(LayoutManagerComponent, { read: LayoutManagerComponent })
  private sidebarLayoutManagerComponent: LayoutManagerComponent;

  @ViewChild(WidgetSettingComponent, { read: WidgetSettingComponent })
  private dialogWidgetSettings: WidgetSettingComponent;

  @ViewChild(GraphDataComponent, { read: GraphDataComponent })
  private graphDataComponent: GraphDataComponent;

  @ViewChild(PatternMatchingComponent, { read: PatternMatchingComponent })
  private patternMatchingComponent: PatternMatchingComponent;

  @ViewChild(AddCustomMetricesComponent, { read: AddCustomMetricesComponent })
  private addCustomMetricesComponent: AddCustomMetricesComponent;

  @ViewChild(TimeBarComponent, { read: TimeBarComponent })
  private timeBarComponent: TimeBarComponent;

  @ViewChild(ReportsComponent, { read: ReportsComponent })
  private reportsComponent: ReportsComponent;

  @ViewChild(DashboardFavListComponent, { read: DashboardFavListComponent })
  private sidebarDashboardFavListComponent: DashboardFavListComponent;

  @ViewChild(DerivedMetricComponent, { read: DerivedMetricComponent })
  private derivedMetricComponent: DerivedMetricComponent;

  @ViewChild(DerivedViewExpComponent, { read: DerivedViewExpComponent })
  private derivedViewExpComponent: DerivedViewExpComponent;

  @ViewChild(AggregatedVirtualMetricesComponent, {
    read: AggregatedVirtualMetricesComponent,
  })
  private aggregatedVirtualMetricesComponent: AggregatedVirtualMetricesComponent;

  @ViewChild(GroupedDerivedMetricesComponent, {
    read: GroupedDerivedMetricesComponent,
  })
  private groupedDerivedMetricesComponent: GroupedDerivedMetricesComponent;

  @ViewChild(CustomMetricsComponent, { read: CustomMetricsComponent })
  private customMetricsComponent: CustomMetricsComponent;

  @ViewChild(MetricsSettingsComponent, { read: MetricsSettingsComponent })
  private metricsSettingsComponent: MetricsSettingsComponent;

  @ViewChild(TimePeriodComponent, { read: TimePeriodComponent })
  private widgetWiseTimePeriod: TimePeriodComponent;

  @ViewChild(RelatedmetricsComponent, { read: RelatedmetricsComponent })
  private relatedMetrics: RelatedmetricsComponent;

  @ViewChild(MonitorDialogComponent, { read: MonitorDialogComponent })
  private monitorDialog: MonitorDialogComponent;

  @ViewChild(FilterParameterBoxComponent, { read: FilterParameterBoxComponent })
  private filterByParam: FilterParameterBoxComponent;

  @ViewChild(CopyFavoriteLinkBoxComponent, {
    read: CopyFavoriteLinkBoxComponent,
  })
  private copyLinkDialog: CopyFavoriteLinkBoxComponent;

  @ViewChild(ParametersComponent, { read: ParametersComponent })
  private parameters: ParametersComponent;

  @ViewChild(FileManagerComponent, { read: FileManagerComponent })
  private fileManager: FileManagerComponent;

  @ViewChild(EditWidgetComponent, { read: EditWidgetComponent })
  private editWidget: EditWidgetComponent;

  @ViewChild(AddDashboardComponent, { read: AddDashboardComponent })
  private addDashboard: AddDashboardComponent;

  @ViewChild(CompareDataComponent, { read: CompareDataComponent })
  public compareDataComponent: CompareDataComponent;
  @ViewChild(RunCommandComponent, { read: RunCommandComponent })
  public runCommandComponent: RunCommandComponent;

  @ViewChild(CustomTemplateDialogComponent, {
    read: CustomTemplateDialogComponent,
  })
  private customTemplateDialog: CustomTemplateDialogComponent;

  @ViewChild(FilterByFavoriteComponent, { read: FilterByFavoriteComponent })
  private filterByFavSidebar: FilterByFavoriteComponent;

  @ViewChild(GetFileDataComponent, { read: GetFileDataComponent })
  private getFileDataComponent: GetFileDataComponent;

  private subscriptions: { [key: string]: Subscription } = {
    timebarOnChange: null,
  };

  private focusMode: boolean = false;

  public lowerPanel: LowerTabularPanelComponent = null;

  compareSnapShot: SnapShot = null;
  selectedW: boolean = false;
  compareAppliedWidgetWise:boolean=false;
  widgetIndexCompare:number =0;
  metricData: any = null;
  mergeMetricData: any = null;
  graphStatsType: number = 0;
  Include: boolean;
  groupID: number;
  filter: any;
  disableUpdateDashboard = false;
  treeData: any;
  selectedTreeObj: any;
  mergeShowGraphInTree: boolean = false;
  mergeMetricInWidget: boolean = true;
  widgetShowGraphInTree: ShowGraphInTreeComponent;
  dropTree: boolean = false;
  mergeMetric : boolean = false;
  openMerge : boolean = false;
  patternMatchingFlag: boolean = false;
  metadatapatternMatching: GroupMetaDataCtx[];
  patternMatchMetricData: any = null;
  isEditDashboard : boolean = false;
  selectedWidgetForDropTree:boolean =false;
  isOldDashboard : boolean = false;
  constructor(
    private dashboardService: DashboardService,
    private sessionService: SessionService,
    private timebarService: TimebarService,
    private cd: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver,
    private graphService: DashboardGraphService,
    private menuService: MenuService,
    private confirmationService: ConfirmationService,
    private dashboardsService: DashboardsService,
    private messageService: MessageService,
    private layoutService: DashboardLayoutManagerService,
    private treeService :GraphInTreeService,
  ) {
    DashboardComponent.instance = this;

    this.events = {
      loadingStart: new Subject<void>(),
      destroyed: new Subject<void>(),
      widgetReloadData: new Subject<void>(),
      widgetPauseAutoDataRefresh: new Subject<void>(),
      widgetResumeAutoDataRefresh: new Subject<void>(),
      widgetInit: new Subject<DashboardWidgetComponent>(),
      widgetSelected: new Subject<DashboardWidgetComponent>(),
      widgetDeselected: new Subject<DashboardWidgetComponent>(),

      dashboardTimeChanged: new Subject<DashboardTime>(),

      analysisModeChanged: new Subject<boolean>(),
      focusModeChanged: new Subject<boolean>(),
      analysisModeToggle: new Subject<boolean>(),
    };
  }

  static getInstance(): Observable<DashboardComponent> {
    const output =
      DashboardComponent.instanceOutput || new Subject<DashboardComponent>();

    if (DashboardComponent.instance) {
      setTimeout(() => {
        output.next(DashboardComponent.instance);
        output.complete();
        DashboardComponent.instanceOutput = null;
      });
    } else {
      DashboardComponent.instanceOutput = output;
    }

    return output;
  }

  ngOnDestroy(): void {
    const me = this;
    if(me.data) {
      me.removeZoomInfo(me.data);
      me.sessionService.dashboardCache = {...me.data};
    }

    me.events.destroyed.next();
    if (me.subscriptions.timebarOnChange) {
      me.subscriptions.timebarOnChange.unsubscribe();
    }
    if (me.selectedWidget) {
      me.events.widgetDeselected.next(me.selectedWidget);
      me.selectedWidget.select(false);
    }
  }

  ngOnInit(): void {
    const me = this;
    me.disableUpdateDashboard = false;
  }

  ngAfterViewInit(): void {
    const me = this;

    me.events.focusModeChanged.subscribe((isFocused: boolean) => {
      me.focusMode = isFocused;
    });

    me.events.analysisModeChanged.subscribe((isOpen: boolean) => {
      if (me.focusMode) {
    //    me.selectedWidget.resize();
      }
    });
  }

  public drawPrevfavorite(dc) {
    const me = this;
    let state = new  DashboardLoadedState();
    state.data = dc;
    me.onLoaded(state);
 }

  removeZoomInfo(data: DashboardFavCTX) {
    try {
      if(data) {
        if(data.favDetailCtx && data.favDetailCtx.widgets && data.favDetailCtx.widgets.length >0) {
          for(let i =0 ; i < data.favDetailCtx.widgets.length ; i++) {
            let widgetData = data.favDetailCtx.widgets[i];
            if(widgetData) {
              if(widgetData.zoomInfo) {
                widgetData.zoomInfo = null;
              }
            }
          }
        }
      }
    } catch (error) {

    }
  }

  widgetInit(widget: DashboardWidgetComponent) {
    const me = this;
    me.events.widgetInit.next(widget);

    if (!me.selectedWidget && widget.widget && widget.widget.type !== 'LABEL') {
      me.selectWidget(widget);
    }
    if(widget.widget.type == 'IMAGE'){
     //widget.widget.settings.types.image.imgPath = me.sessionService.session['dcData']['url']+"/"+me.sessionService.preSession.controllerName+ widget.widget.settings.types.image.imgPath;
	 widget.widget.settings.types.image.imgPath = me.sessionService.session['dcData']['url']+ widget.widget.settings.types.image.imgPath;

}
  }

  getTime(): DashboardTime {
    const me = this;

    if (!me.dashboardTime && me.data) {
      const viewBy = _.get(me.data.favDetailCtx, 'viewBy.selected', null);

      const viewByOutput: DashboardTime = {
        graphTimeKey: _.get(me.data.favDetailCtx, 'dashboardGraphTime.id'),
        graphTimeLabel:
          _.get(me.data.favDetailCtx, 'dashboardGraphTime.id') + '', // TODO: add label
        viewBy: viewBy ? Number(viewBy) : null,
        viewByLabel: viewBy, // TODO: add label
        viewByMs: null,
        time: null,
      };
      viewByOutput.viewByMs = viewByOutput.viewBy
        ? viewByOutput.viewBy * 1000
        : null;

      return viewByOutput;
    }

    return me.dashboardTime;
  }

  registerLowerPanel(lowerPanel: LowerTabularPanelComponent) {
    this.lowerPanel = lowerPanel;
  }

  public load(
    group: string,
    defaultName: string,
    defaultPath: string,
    force?: boolean
  ) {
    const me = this;
    if(me.layout && me.layout.mode && me.layout.mode == "EDIT"){
      me.rejectVisible = true;
      me.acceptLable = 'Yes';
      me.confirmationService.confirm({
        message: 'Do you want to exit canvas mode ?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          me.loadDashboard(group,
            defaultName,
            defaultPath,
            force);
            me.layout.toggleMode('VIEW');
            sessionStorage.setItem('mode','VIEW');
            me.mode = "VIEW";

        },
        reject: () => {
          return;
        },
      });
      me.cd.detectChanges();
      return;
    }
    me.events.loadingStart.next();
    me.group = group;
    const g = 'OPENED_DASHBOARD_' + group;
    let name = defaultName;
    let path = defaultPath;

    if (!force) {
      const openedDashboard = me.sessionService.getSetting(g, false);

      if (openedDashboard) {
        name = openedDashboard.name;
        path = openedDashboard.path;
      }
    }

    me.events.destroyed.next();

    if (me.subscriptions.timebarOnChange) {
      me.subscriptions.timebarOnChange.unsubscribe();
      me.subscriptions.timebarOnChange = null;
    }

    if (me.selectedWidget) {
      me.events.widgetDeselected.next(me.selectedWidget);
      me.selectedWidget.select(false);
      me.selectedWidget = null;
    }

    me.name = name;
    me.path = path;

    /* fav name and path handling for copyLink */
    if (
      me.sessionService.copyLinkParam &&
      me.sessionService.copyLinkParam.requestFrom === 'CopyLink'
    ) {
      me.name = me.sessionService.copyLinkParam.dashboardName;
      me.path = me.sessionService.copyLinkParam.dashboardPath;
    }

    me.sessionService.setSetting(g, {
      name: me.name,
      path: me.path,
    });

    me.reload(false);
  }

  public reload(force? : boolean) {
    const me = this;
    me.isOldDashboard = false;
    if(me.patternMatchingFlag){
    me.patternMatchMetricData =null;
    me.patternMatchingFlag =false;
    }

    sessionStorage.setItem('mode','VIEW');
    me.mode = "VIEW";

    if(me.dashboardService.isCallFromAlert)
    {
      me.name = "alert_graph";
      me.path = "/dashboards/system/alert";
    }

    if (me.name && me.path && me.name.length && me.path.length) {
      const payload: DashboardFavCTX = {
        favNameCtx: {
          name: me.name,
          path: me.path,
        },
        favDetailCtx: {},
      };

      me.dashboardService.load(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof DashboardLoadingState) {
            me.onLoading(state, force);
            return;
          }

          if (state instanceof DashboardLoadedState) {
            me.onLoaded(state);
            return;
          }
        },
        (state: DashboardLoadingErrorState) => {
          me.onLoadingError(state , force);
        }
      );
    }
  }

  private onLoading(state: DashboardLoadingState , force ? : boolean) {
    const me = this;
    if(!force){
    me.data = null;
    }
    me.error = null;
    me.loading = true;
    me.timebarService.setLoading(true);
    me.layoutContainer.clear();

    me.cd.detectChanges();
  }

  private onLoadingError(state: DashboardLoadingErrorState , force ? : boolean) {
    const me = this;
    if(!force){
      me.data = null;
      }
    me.error = true;
    me.loading = false;
    me.timebarService.setLoading(false);
    me.cd.detectChanges();
  }

  private onLoaded(state: DashboardLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = false;
    me.loading = false;
    me.timebarService.setLoading(false);
    sessionStorage.setItem('loadedDashboardName', me.data.favNameCtx.name);
    sessionStorage.setItem('loadedDashboardPath', me.data.favNameCtx.path);
    me.name =  me.data.favNameCtx.name;
    me.path = me.data.favNameCtx.path;
     if(state.data['status']['msg'] == "This favorite is not properly converted from old dashboard"){
        me.rejectVisible = false;
        me.acceptLable = 'Ok';
        me.confirmationService.confirm({
          message: 'This favorite is not properly converted from old dashboard',
          header: 'Information',
        });
        me.cd.detectChanges();
      return;
    }
    if (me.selectedTreeObj) me.selectedTreeObj.label = '';

    if (me.dashboardService.getUserPermissions()) {
     if (me.data.favNameCtx.path.indexOf('/dashboards/system') == 0) {
        this.disableUpdateDashboard = true;
      }  else {
        this.disableUpdateDashboard = false;
      }
      this.dashboardService.setPermissionInfoToUpdateDashboard(
        this.disableUpdateDashboard
      );

    }
    this.dashboardService.setReloadFavorite(true);
    sessionStorage.setItem('previousSessionParametrizeValue',null);
    if (me.data.favDetailCtx.layout.configGallery['enable'] == false) {
      let maxCols = me.getMaxColumns(me.data.favDetailCtx.widgets);
      let layoutCols =  me.data.favDetailCtx.layout.configGrid.cols;
      if(maxCols !== layoutCols){
        me.data.favDetailCtx.layout.configGrid.cols = maxCols;
      }
      if(me.data.favDetailCtx.layout.configGrid.rowHeight !== 1){
        me.convertRowAccToRowHeight();
        }
    }
      if(me.isEditDashboard){
        me.editMode(false,null);
      }

    me.renderLayout(() => {

      me.syncGlobalTimebar();
      me.getInstanceCommit();
      me.cd.detectChanges();
    });
     me.closeSidePanel();
  }

  private syncGlobalTimebar() {
    const me = this;

    me.timebarService.instance.getInstance().subscribe(() => {
      if (!me.subscriptions.timebarOnChange) {
        me.subscriptions.timebarOnChange = me.timebarService.events.onChange.subscribe(
          () => {
            const timebarValue: TimebarValue = me.timebarService.getValue();
            const viewBy: MenuItem = timebarValue.viewBy.selected;
            const viewByNumber: number =
              viewBy  && viewBy.id ? Number(viewBy.id) : null;
            const viewByMs: number = viewByNumber ? viewByNumber * 1000 : null;
            const timePeriod: MenuItem = timebarValue.timePeriod.selected;

            me.dashboardTime = {
              graphTimeKey: timePeriod ? timePeriod.id : null,
              graphTimeLabel: timePeriod ? timePeriod.label : null,
              viewBy: viewByNumber,
              viewByLabel: viewBy ? viewBy.label : null,
              viewByMs: viewByMs,
              time: timebarValue.time,
            };

            let updateDashboard: boolean = false;

            if (me.currentTimebarValue) {
              updateDashboard =
                me.currentTimebarValue.discontinued !==
                timebarValue.discontinued ||
                me.currentTimebarValue.running !== timebarValue.running ||
                me.currentTimebarValue.includeCurrent !==
                timebarValue.includeCurrent ||
                me.currentTimebarValue.timePeriod.selected.id !==
                timebarValue.timePeriod.selected.id ||
                me.currentTimebarValue.viewBy.selected.id !==
                timebarValue.viewBy.selected.id;

              // for giving ref to group widget
              me.updateGroupDashboard = true;
            }

            me.currentTimebarValue = timebarValue;
            if (updateDashboard) {
              // TODO: update widgets locally
              // me.dashboardService.update({
              //   graphTimeKey: me.dashboardTime.graphTimeKey,
              //   viewBy: me.dashboardTime.viewBy + '',
              //   compare: false, // TODO: dynamic
              //   online: timebarValue.running,
              //   running: timebarValue.running,
              //   includeCurrentData: timebarValue.running ? false : timebarValue.includeCurrent,
              //   showDiscontinuedGraphs: timebarValue.discontinued

              // }).subscribe(() => {
              //   me.layout.renderWidgets(true, true);
              // });
              me.data.favDetailCtx.dashboardGraphTime.id = me.currentTimebarValue.timePeriod.selected.id;
              me.data.favDetailCtx.dashboardGraphTime.name= me.currentTimebarValue.timePeriod.selected.label;
              me.layout.renderWidgets(true, true);

              return;
            }

            me.layout.renderWidgets(true);
          }
        );
      }

      const timebarValueInput: TimebarValueInput = {
        timePeriod: _.get(me.data.favDetailCtx, 'dashboardGraphTime.id', null),
        viewBy: _.get(me.data.favDetailCtx, 'viewBy.selected', null),
        running: me.sessionService.testRun.running,
        discontinued: _.get(me.data.favDetailCtx, 'showDiscontinued', true)
      };


      me.timebarService
        .prepareValue(timebarValueInput, me.timebarService.getValue())
        .subscribe((value: TimebarValue) => {
          setTimeout(() => {
            value.viewBy.previous = null;
            me.timebarService.isTimeChangedFromGlobal = false;
            me.timebarService.setValue(value);
          });
        });
    });
  }


  renderCompareData(snapShot: SnapShot, widgetWise,widgetIndex) {
    const me = this;
    me.compareSnapShot = snapShot;

    if (widgetWise) {
     // me.selectedWidget.widget.selectCompareWidget = me.selectedW;
     me.selectedW =true;
     // me.selectedWidget.widget.isWidgetWiseCompare = widgetWise;
     me.compareAppliedWidgetWise =widgetWise;
     me.widgetIndexCompare =widgetIndex;
    } else {
      me.selectedWidget.widget.selectCompareWidget = false;
      me.selectedW=false;
      me.compareAppliedWidgetWise =false;
      me.widgetIndexCompare =null;
     // me.selectedWidget.widget.isWidgetWiseCompare = widgetWise;
    }
    me.layout.renderWidgets(true, true);
  }

  private renderLayout(callback?: () => void) {
    const me = this;
    let cf: ComponentFactory<DashboardLayoutComponent> = null;

    const layoutToChange: 'GRID' | 'GALLERY' = _.get(
      me.data,
      'favDetailCtx.layout.type',
      'GRID'
    );

    switch (layoutToChange) {
      case 'GALLERY':
        cf = me.cfr.resolveComponentFactory(DashboardLayoutGalleryComponent);
        break;
      case 'GRID':
        cf = me.cfr.resolveComponentFactory(DashboardLayoutGridComponent);
        break;
    }

    me.layoutContainer.clear();

    const injector: Injector = Injector.create({
      providers: [
        {
          provide: 'mode',
          useValue: _.get(me.oldLayout, 'mode', 'VIEW'),
        },
      ],
    });
    const ccr: ComponentRef<DashboardLayoutComponent> = me.layoutContainer.createComponent(
      cf,
      undefined,
      injector
    );
    ccr.instance.dashboardComponent = me;

    if (me.layout) {
      me.oldLayout = me.layout;
    }

    me.layout = ccr.instance;

    if (me.oldLayout) {
      me.layout.toggleMode(me.oldLayout.mode, false);

    }

    callback && callback();
  }

  changeLayout(layout: DashboardLayout ) {
    const me = this;

    me.data.favDetailCtx.layout = layout;

    if (layout && layout.type === 'GRID'  ) {
      me.data.favDetailCtx.widgets.forEach(
        (widget: DashboardWidget, index: number) => {
          const widgetLayout: DashboardWidgetLayout =
            layout.configGrid.widgetLayouts[index];
          widget.layout = widgetLayout;
        }
      );
    }

    me.renderLayout(() => {
      me.cd.detectChanges();
      me.layout.onLayoutChange();
    });

  }

  selectWidget(widget: DashboardWidgetComponent, silent?: boolean) {
    const me = this;
    if (widget) {
      if (me.selectedWidget && widget.uuid === me.selectedWidget.uuid) {
        return;
      }
      if (me.selectedWidget) {
        me.selectedWidget.select(false);
        me.events.widgetDeselected.next(me.selectedWidget);
      }

      me.selectedWidget = widget;
      if (!silent) {
        me.selectedWidget.select();
      }
      me.events.widgetSelected.next(me.selectedWidget);

      me.cd.detectChanges();
    }
  }

  openMetricDesc(treeData, duration , fromDerived) {
    this.metricDescriptionComponent.loadShowDesc(treeData, duration, fromDerived);
    this.cd.detectChanges();
  }

  renderSelectedWidget(treeData,mergeGraph) {
    const me = this;
    me.mergeShowGraphInTree = true;
    me.mergeMetricInWidget = mergeGraph;
    if(this.compareSnapShot){
      this.dropTree =false;
      this.metricData=null;
      this.mergeMetricData=null;
    }
    me.widgetShowGraphInTree = treeData;
    me.layout.renderWidgets(true, true);
  }

  renderDropTree(treeData) {
    const me = this;
    if(this.compareSnapShot){
      this.mergeShowGraphInTree =false;
      this.metricData=null;
      this.mergeMetricData=null;
    }
    me.dropTree = true;
    me.selectedWidgetForDropTree =true;
    me.widgetShowGraphInTree = treeData;
    me.layout.renderWidgets(true, true);
  }

  openAdvanceOpenMerge(widget: DashboardWidgetComponent) {
    this.sidebarAdvanceOpenMergeComponent.show();
    this.cd.detectChanges();
  }

  openShowGraphInTree() {
    this.isShow = !this.isShow;
      if(this.treeService.stopCounter)
       clearInterval(this.treeService.stopCounter);
    this.menuService.openSidePanel(this.isShow, 'showGraphInTree');
    this.cd.detectChanges();
  }

  openLayoutManager() {
    this.sidebarLayoutManagerComponent.show();
    this.cd.detectChanges();
  }

  openFavList() {
    this.sidebarDashboardFavListComponent.show();
    this.cd.detectChanges();
  }

  openWidgetSettings(widget: DashboardWidgetComponent) {
    this.dialogWidgetSettings.open(widget);
    this.cd.detectChanges();
  }

  openGraphData(widget: DashboardWidgetComponent) {
    this.graphDataComponent.open(widget);
    this.cd.detectChanges();
  }
  openPatternMatching(widget: DashboardWidgetComponent) {
    this.patternMatchingComponent.open(widget);
    this.cd.detectChanges();
  }

  openAddCustomMetrices(widget: DashboardWidgetComponent) {
    this.addCustomMetricesComponent.open();
    this.cd.detectChanges();
  }

  openTimePeriodDialog(widget: DashboardWidgetComponent) {
    this.widgetWiseTimePeriod.timePeriodOpen(widget);
    this.cd.detectChanges();
  }

  openReportsDialog(widget: DashboardWidgetComponent) {
    this.reportsComponent.open();
    this.cd.detectChanges();
  }

  openDerivedMetricDialog(dashboardComponent: DashboardComponent, data) {
    this.derivedMetricComponent.openDerivedWindow(data);
    this.cd.detectChanges();
  }

  openDerivedViewExpDialog(data) {
    this.derivedViewExpComponent.openWindow(data);
    this.cd.detectChanges();
  }

  // Aggregated Custom Metrices
  openAggregatedDerivedMetricesDialog(
    treedata,
    dashboardComponent: DashboardComponent
  ) {
    this.aggregatedVirtualMetricesComponent.openAggregatedDerivedWindow(
      treedata,
      dashboardComponent
    );
    this.cd.detectChanges();
  }

  // Grouped derived metrices
  openGroupedDerivedMetricesDialog(
    treedata,
    dashboardComponent: DashboardComponent
  ) {
    this.groupedDerivedMetricesComponent.openGroupedDerivedWindow(
      treedata,
      dashboardComponent
    );
    this.cd.detectChanges();
  }

  openCustomMetrics() {
    this.isShow = !this.isShow;
    this.menuService.openSidePanel(this.isShow, 'customMetrics');
    this.cd.detectChanges();
  }

  openMetricsSettings(dashbord: DashboardComponent) {
    this.metricsSettingsComponent.showMetricsSettings(dashbord);
    this.cd.detectChanges();
  }

  openRelatedMetrics(dashbord: DashboardComponent) {
    this.relatedMetrics.showRelatedMetrics(dashbord);
    this.cd.detectChanges();
  }

  openMonitorDialog() {
    this.monitorDialog.show();
    this.cd.detectChanges();
  }

  openFilterByParam() {
    //this.filterByParam.show();
    this.filterByFavSidebar.show();
    this.cd.detectChanges();
  }

  openCopyLink() {
    this.copyLinkDialog.show();
    this.cd.detectChanges();
  }

  openParameterize() {
    this.parameters.show();
    this.cd.detectChanges();
  }

  openFileManager() {
    this.fileManager.open();
    this.cd.detectChanges();
  }

  openCompareWindow(widget: DashboardWidgetComponent) {
    this.compareDataComponent.openWidgetWiseCompare(widget.widget.widgetIndex,widget);
    this.cd.detectChanges();
  }

openRunCommand(widget:DashboardWidgetComponent){
    this.runCommandComponent.openRunCommandDialog(widget);
    this.cd.detectChanges();
  }

  renderTreeHirerachyParametrized(hirerchyData, selectedState) {
    const me = this;
    me.treeData = hirerchyData;
    me.selectedTreeObj = selectedState;
    me.layout.renderWidgets(true, true);
  }

  openParam(hirerchyData, selectedState) {
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      dc.renderTreeHirerachyParametrized(hirerchyData, selectedState);
    });
  }

  renderMetricsSetting(
    metricData,
    graphStatsType,
    selectedcriteria,
    GroupId,
    filter,
    feature,
  ) {
    const me = this;
    me.openMerge = true;
    me.metricData = metricData;
    me.featureName = feature;
    me.graphStatsType = graphStatsType;
    me.groupID = GroupId;
    me.filter = filter;
    me.name = "Open_Merge";
    me.sessionService.session.defaults.dashboardName = me.name;
    me.sessionService.session.defaults.dashboardPath = "/dashboard";
    if (selectedcriteria === 'Include')
    {
      me.Include = true;
    }
    else {
      me.Include = false;
    }
    me.layout.renderWidgets(true, true);
  }

  MergeMetrics(metricData, graphStatsType, selectedcriteria, GroupId, filter,feature) {
    const me = this;
    me.mergeMetricData = metricData;
    me.featureName = feature;
    me.mergeMetric = true;
    me.graphStatsType = graphStatsType;
    me.groupID = GroupId;
    me.filter = filter;
    me.name = "Open_Merge";
    me.sessionService.session.defaults.dashboardName = me.name;
    me.sessionService.session.defaults.dashboardPath = "/dashboard";
    if (selectedcriteria === 'Include'){
       me.Include = true;
    }
    else{
       me.Include = false;
    }
    if(this.compareSnapShot){
      this.mergeShowGraphInTree =false;
      this.dropTree=false;
    }
    me.layout.renderWidgets(true, true);
  }

  applyPatternMatching(metadatapatternMatching: GroupMetaDataCtx[],metricData:any) {
    let me =this;
    me.patternMatchingFlag=true;
    // let creationDate:string;
    // creationDate =new Date().toLocaleDateString();
    let today = new Date();

let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes();
let dateTime = date +'_'+time;
    me.patternMatchMetricData =metricData;
    me.layout.renderWidgets(true,true);

    me.name = "Pattern_Match_"+dateTime;
    me.sessionService.session.defaults.dashboardName = me.name;
    me.sessionService.session.defaults.dashboardPath = "/dashboard";
  }

  getlistHirerchy(parent: any) {
    const me = this;

    if (parent) {
      if (parent.label) {
        if (parent.label !== 'Subjects' && parent.label !== 'Metric Groups') {
          me.arrTreeChild.push(parent.label);
        }
      } else if (parent.name) {
        if (parent.name !== 'Subjects' && parent.name !== 'Metric Groups') {
          me.arrTreeChild.push(parent.name);
        }
      }
      me.getlistHirerchy(parent.parent);
    }
  }


  openMergeMetrics(hirerchyData, selectedValue) {
    const me = this;
    let arrTreeHirerchy = me.parseMergeMetricsHirerchy(
      hirerchyData,
      selectedValue
    );
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      dc.renderMergeMetrics(arrTreeHirerchy, selectedValue);
    });
  }

  parseMergeMetricsHirerchy(hirerchyData, selectedValue) {
    const me = this;
    me.arrTreeChild = [];
    let arrheader = [],
      arrValue = [],
      JsonArr = [];
    // recusively getting tree node level hirerchy
    me.getlistHirerchy(hirerchyData.node);
    let arrayHirerchy = me.arrTreeChild.length - 1;

    for (let i = 0; i < arrayHirerchy; i++) {
      if (i % 2 == 0) {
        // node value
        arrValue.push(me.arrTreeChild[i]);
      } // node type
      else arrheader.push(me.arrTreeChild[i]);
    }

    for (let j = 0; j < arrheader.length; j++) {
      JsonArr.push({ key: arrheader[j], value: arrValue[j], mode: 1 });
    }

    // this is done for All,Zero,Non-zero for merge metrics in widget menu
    for (let j = 0; j < JsonArr.length; j++) {
      if (j == 1) {
        if (selectedValue && selectedValue == 'All')
          JsonArr.push({ key: arrheader[j], value: 'All', mode: 128 });
        else JsonArr.push({ key: arrheader[j], value: arrValue[j], mode: 1 });
      } else {
        JsonArr.push({ key: arrheader[j], value: arrValue[j], mode: 1 });
      }
    }

    return JsonArr;
  }

  renderMergeMetrics(arrTreeHirerchy, selectedValue) {
    const me = this;
    me.mergeMetricsValue = selectedValue;
    me.arrTreeChild = arrTreeHirerchy;
    me.layout.renderWidgets(true, true);
  }
  openEditWidget(widget: DashboardWidgetComponent) {
    this.menuService.openSidePanel(false, 'editWidget', widget);
    this.cd.detectChanges();
  }

  openAddDashboardDialog() {
    this.addDashboard.showDialog(null, 'addOperation');
  }

  pause() {
    const me = this;
    me.timebarService.instance.getInstance().subscribe(() => {
      me.timebarService.controlPause();
    });
  }
  resume() {
    const me = this;
    me.timebarService.instance.getInstance().subscribe(() => {
      me.timebarService.controlStart();
    });
  }

  addNewWidget(
    type:
      | 'GRAPH'
      | 'DATA'
      | 'TABULAR'
      | 'SYSTEM_HEALTH'
      | 'LABEL'
      | 'GRID'
      | 'GROUP'
      | 'IMAGE'
      | 'FILE'
  ) {
    const me = this;
    me.isOldDashboard = false;
    if (me.layout.mode === 'EDIT') {
      if (me.selectedWidget) {
        if (me.selectedWidget.widget.type === 'GROUP') {
          if (type === 'GROUP') {
            me.rejectVisible = false;
            me.acceptLable = 'Ok';
            me.confirmationService.confirm({
              message: 'No permission to add group widget inside group',
              header: 'Information',
            });
            me.cd.detectChanges();
          } else {
            me.selectedWidget.widget.settings.types.group.widgets.push(
              me.getNewWidget(type)
            );
            setTimeout(() => {
              me.cd.detectChanges();
            });
          }
        } else {
          me.data.favDetailCtx.widgets.push(me.getNewWidget(type));
          // console.log(me.data.favDetailCtx.widgets);
          setTimeout(() => {
            me.cd.detectChanges();
          }, 10);
         me.layout.renderWidgets(false, false, false, true);
        }
      } else {
        me.data.favDetailCtx.widgets.push(me.getNewWidget(type));
        setTimeout(() => {
          me.cd.detectChanges();
        }, 10);
        me.layout.renderWidgets(false, false, false, true);
      }
    }
  }

  editMode(isNewDashboard: boolean, newDashObj : any) {
    const me = this;
    me.copyOfWidgetsArray.length = 0;
    me.copyOfWidgetsArray = this.deepCopyFunction(me.data);
    me.layout.toggleMode('EDIT', isNewDashboard);
    sessionStorage.setItem('mode','edit');
    me.mode = "EDIT"
    me.isNewDashboard = isNewDashboard;
    if (me.isNewDashboard && newDashObj !== null) {

      me.name = newDashObj["dashboardName"];
      me.path = newDashObj["dashboardPath"];
      me.data.favNameCtx.name = newDashObj["dashboardName"];
      me.data.favNameCtx.path = newDashObj["dashboardPath"];
      me.data.favDetailCtx.description = newDashObj["dashboarddesc"];
      me.data.favDetailCtx.public = newDashObj["dashboardPermissionMode"] == READ_MODE || newDashObj["dashboardPermissionMode"] == READ_WRITE_MODE ? true : false;
      me.data.favDetailCtx.readWriteMode = newDashObj["dashboardPermissionMode"];
      me.data.favDetailCtx.owner = this.sessionService.session.cctx.u;
      me.data.favDetailCtx.layout.configGrid.cols = 200;
      me.data.favDetailCtx.layout.configGrid.rowHeight = 1;
      me.closeFavList();
      me.removeAllWidgets(true);
    }
    else if(me.isNewDashboard && newDashObj == null){
      //handling alert check box
    }
    me.pause();
  //   if(isNewDashboard){
  //     me.pause();
  //   }
  //  else{
  //   me.loading = true;
    setTimeout(() => {
      // me.loading = false;
      // me.pause();
      me.messageService.add({ severity: 'info', summary: 'Success Message', detail: "Canvas Mode is loaded successfully." });
      me.cd.detectChanges();
    }, 800);
  // }
  }

  saveAsNewLayout(layoutName: string) {
    const me = this;
    if (me.data.favDetailCtx.layout.configGrid.widgetLayouts) {
      //  me.widgetLayouts.le
    }
     // me.data.favDetailCtx.layout.configGrid['widgetLayouts']
     let widgetLayouts = [];
     me.data.favDetailCtx.widgets.forEach(element => {
       widgetLayouts.push(element.layout);
     });
     me.data.favDetailCtx.layout.configGrid['widgetLayouts'] = widgetLayouts;


    const layoutNameCtx = {
      name: layoutName,
      path: 'cutom'
    }
    const layoutDetailCtx = me.data.favDetailCtx.layout;
    layoutDetailCtx.name = layoutName;
    layoutDetailCtx.id = layoutName;

    const layoutCtx = {
      layoutNameCtx: layoutNameCtx,
      layoutDetailCtx: layoutDetailCtx
    }

    const savePayload : DashboardLayoutRequest= {
      opType: SAVE_CUSTOM_LAYOUT,
      multiDc: false,
      cctx: null,
      tr: me.sessionService.testRun.id,
      layoutCtx: layoutCtx
    };


    me.layoutService.saveLayout(savePayload).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardLayoutSavingState) {
          me.onSavingLayout(state);
          return;
        }

        if (state instanceof DashboardLayoutSavedState) {
          me.onSavedLayout(state, layoutName);
          return;
        }
      },
      (state: DashboardLayoutSavingErrorState) => {
        me.onSavingLayoutError(state, layoutName);
      }
    );
    // Call save new layout service
    // me.data contains latest layout modifications
  }

  saveChanges() {
    const me = this;
    me.isOldDashboard = false;
    if(me.name!=me.data.favNameCtx.name && me.patternMatchingFlag){
      me.data.favNameCtx.name =me.name;
      me.data.favNameCtx.path ="/dashboards";
     }

    if (
      me.data.favNameCtx.path.indexOf('/system') == 0 ||
      me.data.favNameCtx.path.indexOf('/dashboards/system') == 0
    ) {
      me.rejectVisible = false;
      me.isOldDashboard = false;
      me.acceptLable = 'Ok';
      me.confirmationService.confirm({
        message: 'No permission to update system dashboard.',
        header: 'Information',
        icon: 'pi pi-exclamation-triangle',
      });
      me.cd.detectChanges();
      return;
    }

    if (!me.patternMatchingFlag && me.data.favNameCtx.path.indexOf("/dashboards") == 0 && (me.data.favDetailCtx.readWriteMode !== READ_WRITE_MODE) && me.data.favDetailCtx.owner !== this.sessionService.session.cctx.u) {
      me.rejectVisible = false;
      me.acceptLable = 'Ok';
      me.confirmationService.confirm({
        message: 'No permission to update read only dashboard created by other user.',
        header: 'Information',
        icon: 'pi pi-exclamation-triangle',
      });
      me.cd.detectChanges();
      return;
    }


    if (
      me.data.favDetailCtx == null ||
      me.data.favDetailCtx.widgets.length == 0
    ) {
      me.isOldDashboard = false;
      me.rejectVisible = false;
      me.acceptLable = 'Ok';
      me.confirmationService.confirm({
        message: 'No permission to update empty dashboard.',
        header: 'Information',
        icon: 'pi pi-exclamation-triangle',
      });
      me.cd.detectChanges();
      return;
    }


    let op_type = UPDATE_DASHBOARD;
    let updatedPath: string = me.data.favNameCtx.path;
    var oldData = null;
    if (me.data.favNameCtx.path.indexOf('/dashboards') !== 0) {
      op_type = SAVE_DASHBOARD;
      const oldfavNameCtx: DashboardFavNameCTX = {
        name: me.data.favNameCtx.name,
        path: me.data.favNameCtx.path,
      };
      me.isOldDashboard = true;
      if (me.path == me.data.favNameCtx.name) {
        updatedPath = '/dashboards';
      } else {
        updatedPath =
          '/dashboards' + '/' + me.path.split('/' + me.data.favNameCtx.name)[0];
      }
      oldData = oldfavNameCtx;
    } else {
      op_type = UPDATE_DASHBOARD;
      me.isOldDashboard = false;
    }
    const favNameCtx: DashboardFavNameCTX = {
      name: me.data.favNameCtx.name,
      path: updatedPath,
    };


    //setting viewby applied on current dashboard time
    me.data.favDetailCtx.viewBy.selected = me.dashboardTime.viewBy + '';
    let favObj = me.deepCopyFunction(me.data.favDetailCtx);
    me.changeGraphSettings(favObj);
    const favCtx: DashboardFavCTX = {
      favNameCtx: favNameCtx,
      favDetailCtx: favObj,
      oldfavNameCtx: oldData,
    };
    if (me.isNewDashboard ||me.patternMatchingFlag) {
      op_type = SAVE_DASHBOARD;
    }
    const payload: DashboardReq = {
      opType: op_type,
      cctx: null,
      tr: null,
      compareCtx: null,
      multiDc: false,
      favCtx: favCtx,
    };

    // resume data calls once dashboard is saved

    me.rejectVisible = true;
    me.acceptLable = 'Yes';
    me.confirmationService.confirm({
      message: 'Do you want to save this dashboard ?',
      header: 'Save Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        sessionStorage.setItem('mode','VIEW');
          me.mode = "VIEW";
          me.layout.toggleMode('VIEW');
          me.resume();
        me.updateDashboardData(payload , updatedPath);
      },
      reject: () => {
      sessionStorage.setItem('mode','VIEW');
      me.mode = "VIEW";
      me.layout.toggleMode('VIEW');
      me.resume();},
    });
  me.cd.detectChanges();
  }

  removeSelectedWidget() {
    const me = this;
    if (me.layout.mode === 'EDIT') {
      setTimeout(() => {
        //Write logic for remove selected widget
        if (me.selectedWidget) {
          me.data.favDetailCtx.widgets.forEach((widget, index) => {
            if (widget.id == me.selectedWidget.widget.id) {
              me.data.favDetailCtx.widgets.splice(index, 1);
              me.selectedWidget = null;
              me.cd.detectChanges();
            }
            if (widget.type === 'GROUP') {
              widget.settings.types.group.widgets.forEach((gWidget, i) => {
                if (gWidget.id == me.selectedWidget.widget.id) {
                  widget.settings.types.group.widgets.splice(i, 1);
                  me.selectedWidget = null;
                  me.cd.detectChanges();
                }
              });
            }
          });
        } else {
          me.isOldDashboard = false;
          me.rejectVisible = false;
          me.acceptLable = 'Ok';
          me.confirmationService.confirm({
            message: 'Please Select any Widget',
            header: 'Information',
          });
          me.cd.detectChanges();
        }
        me.cd.detectChanges();
      });
    }
  }

  removeAllWidgets(isNew) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = 'Yes';
    if(isNew){
      me.removeAllDashboardWidget();
      return;
    }
    me.confirmationService.confirm({
      message: 'Are you sure you want to delete all Widgets?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.removeAllDashboardWidget();
      },
      reject: () => { },
    });
    me.cd.detectChanges();
  }

  removeWidgetConfirmation() {
    const me = this;
    if (me.layout.mode === 'EDIT') {
      if(!me.selectedWidget){
        me.isOldDashboard = false;
          me.rejectVisible = false;
          me.acceptLable = 'Ok';
          me.confirmationService.confirm({
            message: 'Please Select any Widget',
            header: 'Information',
          });
          me.cd.detectChanges();
          return;
        }
    }
    me.isOldDashboard = false;
    me.rejectVisible = true;
    me.acceptLable = 'Yes';
    me.confirmationService.confirm({
      message: 'Do you want to delete this Widget?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.removeSelectedWidget();
      },
      reject: () => { },
    });
    me.cd.detectChanges();
  }

  switchEditMode(isSave: boolean) {
    const me = this;
    if (!isSave) {
      me.rejectVisible = true;
      me.isOldDashboard = false;
      me.acceptLable = 'Yes';
      me.confirmationService.confirm({
        message: 'Do you want to apply changes in the current favorite ?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          // me.saveChanges();
          if (me.isNewDashboard) {
            me.data.favNameCtx = me.copyOfWidgetsArray['favNameCtx'];
            me.name = me.data.favNameCtx.name;
            me.path = me.data.favNameCtx.path;
          }
          sessionStorage.setItem('mode','VIEW');
          me.mode = 'VIEW';
          me.layout.toggleMode('VIEW');
          me.resume();
        },
        reject: () => {
          if (me.selectedWidget) {
            me.events.widgetDeselected.next(me.selectedWidget);
            me.selectedWidget.select(false);
            me.selectedWidget = null;
          }
          var element = event.currentTarget;
         var elementClassList = (<HTMLElement>element).classList;
          if(elementClassList.contains("ui-dialog-titlebar-close")){
            return;
          }
          me.data = me.deepCopyFunction(me.copyOfWidgetsArray);
          me.name = me.data.favNameCtx.name;
          me.path = me.data.favNameCtx.path;
          sessionStorage.setItem('mode','VIEW');
          me.mode = "VIEW";
          me.layout.toggleMode('VIEW');
          me.resume();
        },
      });
    } else {
      me.layout.toggleMode('VIEW');
      me.resume();
    }
    me.cd.detectChanges();
  }


  public dashboardChangesNotApplied() {
    const me = this;
    me.data = me.deepCopyFunction(me.copyOfWidgetsArray);
    me.name = me.data.favNameCtx.name;
    me.path = me.data.favNameCtx.path;
    sessionStorage.setItem('mode','VIEW');
    me.mode = "VIEW";
    me.layout.toggleMode('VIEW');
    me.resume();
  }

  public getNewWidget(
     type:
      | 'GRAPH'
      | 'DATA'
      | 'TABULAR'
      | 'SYSTEM_HEALTH'
      | 'LABEL'
      | 'GRID'
      | 'GROUP'
      | 'IMAGE'
      | 'FILE'
  ): DashboardWidget {
    const me = this;
    const id = IDGenerator.newId();
    let GraphWIdgetSettings ={
      monochromatic: false,
      dataSourceType: 'METRIC',
      baselineCompare: {
        enabled: false,
        trendMode: '0',
        critical: '0',
        major: '0',
        minor: '0',
      },
      types: {
        graph: {
          type: 0,
          geomap: {
            redToGreen: false,
            extendedFilter: {
              enable: false,
              type: 0,
              healthType: 0,
              textPattern: '',
            },
            geoMapThreshold: '',
            monochronicColorBandHighToLow: false,
            colorOptionForGeoMap: 0,
          },
          gridLineWidth: 0.4,
          xAxis: true,
          yAxis: true,
          underline: false,
          italic: false,
          bold: true,
          iconSelected: true,
          displayWidgetFontColor: '',
          bgColor: 'transparent',
          iconColor: 'black',
          displayWidgetFontFamily: "'Open Sans',sans-serif",
          showLegends: false,
          showLegendOnWidget: false,
          showChartValue: false,
          selectedWidgetTimeDelay: 0,
          legendAlignmentOnWidget: 'center',
          pctOrSlabValue: 0,
          dialMeterExp: '',
        },
      },
      caption: {
        overriden: false,
        caption: '',
      },
      graphStatsType: '0',
      graphFilter: [],
      multiDial: { enabled: false, count: 2 },
      blank: false,
      alertOverlay: false,
      widgetDrillDown: false,
      selectedFavLevel: '',
      panelFavName: 'undefined',
      panelFavRelativePath: '',
      parametrization: false,
      chartType: 0,
      dataFilter: [0, 1, 2, 3, 4, 5],
    }
    switch (type) {
      case 'GRAPH':
        if (type) {
        const DEFAULT_GRAPH_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              graph: {
                type: 0,
                geomap: {
                  redToGreen: false,
                  extendedFilter: {
                    enable: false,
                    type: 0,
                    healthType: 0,
                    textPattern: '',
                  },
                  geoMapThreshold: '',
                  monochronicColorBandHighToLow: false,
                  colorOptionForGeoMap: 0,
                },
                gridLineWidth: 0.4,
                xAxis: true,
                yAxis: true,
                underline: false,
                italic: false,
                bold: true,
                iconSelected: true,
                displayWidgetFontColor: '',
                bgColor: 'transparent',
                iconColor: 'black',
                displayWidgetFontFamily:  "'Open Sans',sans-serif",
                showLegends: false,
                showLegendOnWidget: false,
                showChartValue: false,
                selectedWidgetTimeDelay: 0,
                legendAlignmentOnWidget: 'center',
                pctOrSlabValue: 0,
                dialMeterExp: '',
              },
            },
            caption: {
              overriden: false,
              caption: '',
            },
            graphStatsType: '0',
            graphFilter: [],
            multiDial: { enabled: false, count: 2 },
            blank: false,
            alertOverlay: false,
            widgetDrillDown: false,
            selectedFavLevel: '',
            panelFavName: 'undefined',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };
          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New_Graph_Widget  ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 30 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_GRAPH_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;

      case 'DATA':
        if (type) {
           const DEFAULT_DATA_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              data: {
                dataAttrName: 'avg',
                dataDisplayName: 'Data Average',
                dataImgName: 'icons8 icons8-power-bi',
                bgColor: '#009973',
                fontColor: 'black',
                bold : true,
                italic: false,
                underline: false,
                prefix: '',
                suffix: '',
                showIcon: true,
                showTitleBar: true,
                valueFontColor: '',
                textFontColor: '',
                displayFontSize: '18',
                displayFontFamily: 'Arial',
                valueFontSize: '15',
                valueFontFamily: 'Arial',
                decimalFormat: 'dec_3',
              },
            },
            caption: {
              overriden: false,
              caption: '',
            },
            graphStatsType: '0',
            graphFilter: [],
            multiDial: { enabled: false, count: 2 },
            blank: false,
            alertOverlay: false,
            widgetDrillDown: false,
            selectedFavLevel: '0',
            panelFavName: 'undefined',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };
          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 30 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_DATA_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;

      case 'TABULAR':
        if (type) {
           const DEFAULT_TABULAR_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              table: {
                enableSorting: "true",
                enableColumnResizing: "true",
                enableFiltering: "false",
                enableGridMenu: "false",
                showGridFooter: "false",
                fastWatch: "false",
                rowHeight: '16',
                tableHeight: '100',
                tableType: '0',
                cols: [
                  {
                    field: 'measure.metric',
                    width: '40%',
                    minWidth: '150',
                    headerCellClass: 'grid-align-center',
                    type: 'number',
                    displayName: 'Metric Name',
                    headerTooltip: '',
                    cellFilter: '',
                  },
                  {
                    field: 'summary.avg',
                    width: '20%',
                    minWidth: '40',
                    headerCellClass: 'grid-align-center',
                    type: 'number',
                    displayName: 'Average',
                    headerTooltip: '',
                    cellFilter: '',
                  },
                  {
                    field: 'summary.min',
                    width: '20%',
                    minWidth: '40',
                    headerCellClass: 'grid-align-center',
                    type: 'number',
                    displayName: 'Minimum',
                    headerTooltip: '',
                    cellFilter: '',
                  },
                  {
                    field: 'summary.max',
                    width: '20%',
                    minWidth: '40',
                    headerCellClass: 'grid-align-center',
                    type: 'number',
                    displayName: 'Maximum',
                    headerTooltip: '',
                    cellFilter: '',
                  },
                ],
                bgColor: 'transparent',
                format: 'dec_3',
                underline: false,
                italic: false,
                bold: true,
              },
            },
            caption: {
              overriden: false,
              caption: '',
            },
            graphStatsType: '0',
            graphFilter: [],
            multiDial: { enabled: false, count: 2 },
            blank: false,
            alertOverlay: false,
            widgetDrillDown: false,
            selectedFavLevel: '0',
            panelFavName: 'undefined',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };

          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New_Tabular_Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 30 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_TABULAR_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;

      case 'SYSTEM_HEALTH':
        if (type) {
           const DEFAULT_HEALTH_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              systemHealth: {
                dataAttrName: 'avg',
                dataImgName: 'icons8 icons8-power-bi',
                bgColor: '#FFFFFF',
                fontColor: 'black',
                showIcon: true,
                showTitleBar: true,
                underline: false,
               italic: false,
                bold: true,
                healthWidgetSeverityDef: {
                  criticalMSRString: '>',
                  criticalValue: 100.0,
                  majorMSRString: '>',
                  majorValue: 200.0,
                },
                healthWidgetRuleInfo: {
                  criticalPct: 90.0,
                  criticalSeverity: 'Major',
                  criticalCondition: '||',
                  criticalAnotherPct: 100.0,
                  criticalAnotherSeverity: 'Critical',
                  majorPct: 50.0,
                  majorSeverity: 'Major',
                  majorCondition: '||',
                  majorAnotherPct: 80.0,
                  majorAnotherSeverity: 'Critical',
                  showSecdCondForCritical: true,
                  showSecdCondForMajor: true,
                  criticalOperator: false,
                  majorOperator: false,
                },
                severity: 'Normal',
                graphNameOnTop: false,
              },
            },
            caption: {
              overriden: false,
              caption: '',
            },
            graphStatsType: '0',
            graphFilter: [],
            multiDial: { enabled: false, count: 2 },
            blank: false,
            alertOverlay: false,
            widgetDrillDown: false,
            selectedFavLevel: '0',
            panelFavName: 'undefined',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };
          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 30 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_HEALTH_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;

      case 'LABEL':
        if (type) {
           const DEFAULT_LABEL_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              text: {
                text: 'label Widget',
                bold: 'normal',
                italic: 'normal',
                underline: 'normal',
                align: 'center',
                showTextArea: false,
                fontSize: '8',
                fontFamily: "'Noto Sans', sans-serif",
                fontColor: '#000000',
                rotate: 'rotate(0deg)',
                origin: '0% 0%',
                height: '83px',
                width: '348px',
                bgColor: '#FFFFFF',
              },
            },
            caption: {
              overriden: false,
              caption: '',
            },
            graphStatsType: '0',
            graphFilter: [],
            multiDial: { enabled: false, count: 2 },
            blank: false,
            alertOverlay: false,
            widgetDrillDown: false,
            selectedFavLevel: '0',
            panelFavName: 'undefined',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };
          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 6 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_LABEL_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
          };
        }
        break;

      case 'IMAGE':
        if (type) {
          const DEFAULT_IMAGE_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              image: {
                imgPath:
                  '/sys/webdashboard/layoutFiles/images/newLayoutMap_1615458322610.PNG',
                imageTitle: 'newLayoutMap',
                editCaption: false,
                bgColor: 'transparent',
              },
            },
            caption: { overriden: false },
            graphStatsType: '0',
            multiDial: { enabled: false, count: 2 },
            blank: true,
            alertOverlay: false,
            viewBy: { selected: '600' },
            dashboardGraphTime: { id: 'LIVE5', name: 'Last 4 Hours' },
            widgetDrillDown: false,
            panelFavName: '',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };

          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 6 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_IMAGE_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;

      case 'FILE':
        if (type) {
          const DEFAULT_FILE_SETTINGS: DashboardWidgetSettings = {
            monochromatic: false,
            dataSourceType: 'METRIC',
            baselineCompare: {
              enabled: false,
              trendMode: '0',
              critical: '0',
              major: '0',
              minor: '0',
            },
            types: {
              file: {
                filePath: '',
                delimiter: ',',
                fileWidgetTitle: '',
                userName: 'cavisson',
                bgColor: 'transparent',
              },
            },
            caption: { overriden: false },
            graphStatsType: '0',
            multiDial: { enabled: false, count: 2 },
            blank: true,
            alertOverlay: false,
            viewBy: { selected: '600' },
            dashboardGraphTime: { id: 'LIVE5', name: 'Last 4 Hours' },
            widgetDrillDown: false,
            panelFavName: '',
            panelFavRelativePath: '',
            parametrization: false,
            chartType: 0,
            dataFilter: [0, 1, 2, 3, 4, 5],
          };
          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New_File_Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 6 : 4,
              x: null,
              y: null,
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            settings: DEFAULT_FILE_SETTINGS,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;

      case 'GROUP':
        if (type) {
          return {
            id: 'NEW_WIDGET_' + id,
            name: 'New Widget ' + id,
            type: type,
            layout: {
              cols: me.data.favDetailCtx.layout.configGrid.cols / 4,
              rows:
                me.data.favDetailCtx.layout.configGrid.rowHeight == 1 ? 35 : 10,
              x: null,
              y: null,
            },
            settings: {
              types: {
                group: DEFAULT_GROUP_WIDGET,
              },
            },
            dataCtx: {
              selfTrend: 0,
              gCtx: [],
            },
            ruleType: 0,
            scaleMode: 1,
            widgetIndex: me.data.favDetailCtx.widgets.length,
            newWidget: true
          };
        }
        break;
    }
  }

  private getInstanceCommit() {
    const me = this;
    if (DashboardComponent.instanceOutput) {
      DashboardComponent.instanceOutput.next(me);
      DashboardComponent.instanceOutput.complete();
    }
  }

  openCustomTemplateLayoutDialog() {
    this.customTemplateDialog.show();
    this.cd.detectChanges();
  }

  updateDashboardData(data: DashboardReq , updatedPath) {
    const me = this;
    let force = me.isNewDashboard ? false : true;
    me.dashboardsService.addDashboard(data, force).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardStateLoadingStatus) {
          me.onUpdating(state);
          return;
        }

        if (state instanceof DashboardStateLoadedStatus) {
          me.onUpdated(state, data.favCtx.favNameCtx.name,updatedPath);
          return;
        }
      },
      (state: DashboardStateLoadingErrorStatus) => {
        me.onUpdatingError(state, data.favCtx.favNameCtx.name);
      }
    );
  }

  private onUpdating(state: DashboardStateLoadingStatus) {
    const me = this;
    // me.data = null;
    me.error = null;
    me.empty = false;
    me.loading = true;
    // if(!me.isOldDashboard){
    //   me.loading = true;
    // }

    me.cd.detectChanges();
  }

  private onUpdatingError(
    state: DashboardStateLoadingErrorStatus,
    dashboardName: string
  ) {
    const me = this;
    // me.data = null;
    me.error = true;
    me.empty = false;
    me.loading = false;
    me.messageService.add({
      severity: 'error',
      summary: 'Error Message',
      detail: dashboardName + 'dashboard is not updated successfully.',
    });
    me.resume();
    me.cd.detectChanges();
  }

  private onUpdated(state: DashboardStateLoadedStatus, dashboardName: string, updatedPath : string) {
    const me = this;
    // me.data = state.data;
    me.empty = false;
    me.error = false;
    me.loading = false;
    if (state.data.code == DASHBOARD_SUCCESSFULY_SAVED && !me.isNewDashboard) {
      //handling at time of updating.

      me.messageService.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Dashboard ' + dashboardName + ' is saved successfully.',
      });
      me.dashboardService.setAllowFavListForcefullyUpdate(true);
      if(me.isOldDashboard){
        me.name = me.data.favNameCtx.name;
        me.path = updatedPath;
        me.reload(true);
        return;
      }
    } else if (
      state.data.code == DASHBOARD_SUCCESSFULY_SAVED &&
      me.isNewDashboard
    ) {
      me.messageService.add({
        severity: 'success',
        summary: 'Success Message',
        detail: dashboardName + 'dashboard is saved successfully.',
      });
      me.switchEditMode(true);
    } else {
      me.messageService.add({
        severity: 'error',
        summary: 'Error message',
        detail: dashboardName + ' is not updated successfully .',
      });
    }
    me.resume();
    me.cd.detectChanges();
    //}
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

  closeFavList() {
    this.sidebarDashboardFavListComponent.hide();
    this.cd.detectChanges();
  }

  private onSavingLayout(state: DashboardLayoutSavingState) {
    const me = this;
    // me.data = null;
    me.error = null;
    me.empty = false;
    me.loading = false;
    me.cd.detectChanges();
  }

  private onSavedLayout(state: DashboardLayoutSavedState, layoutName: string) {
    const me = this;
    // me.data = state.data;
    me.empty = false;
    me.error = false;
    me.loading = false;
    if (state.data.code == LAYOUT_SUCCESSFULY_SAVED) {
      me.messageService.add({
        severity: 'success',
        summary: 'Success Message',
        detail: layoutName + ' layout template is saved successfully.',
      });
    } else {
      me.messageService.add({
        severity: 'error',
        summary: 'Error message',
        detail: layoutName + ' is not saved successfully .',
      });
    }
    me.cd.detectChanges();
  }

  private onSavingLayoutError(
    state: DashboardLayoutSavingErrorState,
    layoutName: string
  ) {
    const me = this;
    // me.data = null;
    me.error = null;
    me.empty = false;
    me.loading = false;
    me.cd.detectChanges();
  }
  deleteSelectedLayout(layout: DashboardLayout) {
    const me = this;
    me.confirmationService.confirm({
      message: 'Do you want to delete this layout?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.deleteLayout(layout);
      },
      reject: () => { },
    });
    me.cd.detectChanges();
  }

  deleteLayout(layout) {
    const me = this;
    const layoutNameCtx: LayoutNameCtx = {
      name: layout.name.split('.layout')[0],
      path: 'custom',
    };
    const layoutCtx: LayoutCtx = {
      layoutNameCtx: layoutNameCtx,
      layoutDetailCtx: {},
    };

    const deletePayload: DashboardLayoutRequest = {
      opType: DELETE_CUSTOM_LAYOUT,
      multiDc: false,
      cctx: null,
      tr: null,
      layoutCtx: layoutCtx,
    };
    me.layoutService.deleteLayout(deletePayload).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardLayoutDeletingState) {
          me.onDeleteLayoutLoading(state);
          return;
        }

        if (state instanceof DashboardLayoutDeletedState) {
          me.onDeleteLayout(state);
          return;
        }
      },
      (state: DashboardLayoutDeletingErrorState) => {
        me.onDeleteLayoutError(state);
      }
    );
  }

  private onDeleteLayoutLoading(state: DashboardLayoutDeletingState) {
    const me = this;
    me.error = null;
    me.loading = true;

    //me.cd.detectChanges();
  }

  private onDeleteLayoutError(state: DashboardLayoutDeletingErrorState) {
    const me = this;
    me.error = true;
    me.loading = true;

    // me.cd.detectChanges();
  }

  private onDeleteLayout(state: DashboardLayoutDeletedState) {
    const me = this;
    me.error = false;
    me.loading = false;
    if (state.data.code == LAYOUT_SUCCESSFULY_DELETED) {
      me.messageService.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'layout template is deleted successfully.',
      });
      me.sidebarLayoutManagerComponent.getCustomListOfLayouts();
      //this.cd.detectChanges();
    } else {
      me.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Getting Error while deleting layout.',
      });
    }
    me.cd.detectChanges();

  }

  openGetFileDialog() {
    const me = this;
    me.getFileDataComponent.openGetFileDataDialog();
  }

  duplicateLayout(templateName) {
    const me = this;
    me.rejectVisible = true;
    me.isOldDashboard = false;
    me.acceptLable = "Ok";
    me.confirmationService.confirm({
      message: 'Layout with same name is already available. Do you want to update ?',

      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        me.saveAsNewLayout(templateName);
        me.customTemplateDialog.hide();
        // me.dashboard.saveAsNewLayout(this.templateName);
        // super.hide();

      },
      reject: () => {
        // me.customTemplateDialog.hide();
      }
    });
    me.cd.detectChanges();
  }

  getMaxColumns(widgets: any) {
    try {

      let maxCols = 0;
      for (let i = 0; i < widgets.length; i++) {
        if (maxCols < (widgets[i].layout.cols + widgets[i].layout.x)) {
          maxCols = widgets[i].layout.cols + widgets[i].layout.x;
        }
      }
      return maxCols;

    } catch (e) {
      console.error(e);
    }
  }
  convertRowAccToRowHeight(){
    const me = this;
    me.data.favDetailCtx.widgets.forEach((element: any, index: number) => {
          if(element.layout.rows >= (OLD_GRID_MAP_ROW_HEIGHT - 10)){
    //element.layout.rows = Math.floor(element.layout.rows/OLD_GRID_MAP_ROW_HEIGHT)+5;
    element.layout.rows = Math.floor(element.layout.rows/(WIDGETS_MARGIN+GRID_ROWHEIGHT));
    if(index !==0){
    element.layout.y = me.data.favDetailCtx.widgets[index-1].layout.y;
    }
    }
    });

    }
  closeSidePanel(){
     this.menuService.closeSidePanel(true);
     this.cd.detectChanges();
  }

  removeAllDashboardWidget(){
  const me = this;
if (me.layout.mode === 'EDIT') {
  if (me.selectedWidget) {
    if (me.selectedWidget.widget.type === 'GROUP') {
      setTimeout(() => {
        me.selectedWidget.widget.settings.types.group.widgets = [];
        if (me.selectedWidget) {
          me.selectedWidget = null;
         }
        me.cd.detectChanges();
      });
    } else {
      setTimeout(() => {
        //Write logic for remove all widgets
        me.data.favDetailCtx.widgets = [];
        if (me.selectedWidget) {
              me.selectedWidget = null;
           }
        me.cd.detectChanges();
      });
    }
  } else {
    setTimeout(() => {
      //Write logic for remove all widgets
      me.data.favDetailCtx.widgets = [];
      if (me.selectedWidget) {
        me.selectedWidget = null;
      }
      me.cd.detectChanges();
    });
  }
}
  }

  copyWidget(widget){
    const me = this;
    const id = IDGenerator.newId();
    let newWidget = me.deepCopyFunction(widget);
    newWidget.id = 'NEW_WIDGET_' + id,
    newWidget.name = 'New_Graph_Widget  ' + id,
    newWidget.widgetIndex = me.data.favDetailCtx.widgets.length,
   newWidget.newWidget= true;
   me.data.favDetailCtx.widgets.push(newWidget);
   setTimeout(() => {
    me.cd.detectChanges();
  }, 10);
  me.layout.renderWidgets(false, false, false, true);
  }

  loadDashboard( group: string,
    defaultName: string,
    defaultPath: string,
    force?: boolean){
    const me = this;

    me.events.loadingStart.next();
    me.group = group;
    const g = 'OPENED_DASHBOARD_' + group;
    let name = defaultName;
    let path = defaultPath;

    if (!force) {
      const openedDashboard = me.sessionService.getSetting(g, false);

      if (openedDashboard) {
        name = openedDashboard.name;
        path = openedDashboard.path;
      }
    }

    me.events.destroyed.next();

    if (me.subscriptions.timebarOnChange) {
      me.subscriptions.timebarOnChange.unsubscribe();
      me.subscriptions.timebarOnChange = null;
    }

    if (me.selectedWidget) {
      me.events.widgetDeselected.next(me.selectedWidget);
      me.selectedWidget.select(false);
      me.selectedWidget = null;
    }

    me.name = name;
    me.path = path;

    /* fav name and path handling for copyLink */
    if (
      me.sessionService.copyLinkParam &&
      me.sessionService.copyLinkParam.requestFrom === 'CopyLink'
    ) {
      me.name = me.sessionService.copyLinkParam.dashboardName;
      me.path = me.sessionService.copyLinkParam.dashboardPath;
    }

    me.sessionService.setSetting(g, {
      name: me.name,
      path: me.path,
    });

    me.reload(false);
  }

  changeGraphSettings( favObj : any){
    const me = this;
    favObj.widgets.forEach(element => {
      let obj = element.graphSettings;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var val = obj[key];
          if(!val.isForcefullyColorChange){
                   val.color = '';
                 }
        }
      }
      });
  }
}
