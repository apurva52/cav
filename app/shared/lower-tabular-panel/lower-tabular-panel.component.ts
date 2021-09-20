import { ChartType } from './../dashboard/widget/constants/chart-type.enum';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostBinding,
  PipeTransform,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FilterUtils } from 'primeng/utils';
import { TableHeaderColumn } from '../table/table.model';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardWidgetComponent } from '../dashboard/widget/dashboard-widget.component';
import { LowerPanelTable } from './service/lower-tabular-panel.model';
import { AppError } from 'src/app/core/error/error.model';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { PipeService } from '../pipes/pipe.service';
import {
  DashboardTime,
  ForEachGraphArgs,
  GraphData,
} from '../dashboard/service/dashboard.model';
import { MenuModule } from 'primeng/menu';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { SessionService } from 'src/app/core/session/session.service';
import { PatternMatchingService } from '../pattern-matching/service/pattern-matching.service';
import { MenuItem } from 'primeng';
import { LowerPanelService } from './service/lower-tabular-panel.service';
import { Store } from 'src/app/core/store/store';
import { onDownloadLoadedState, onDownloadLoadingErrorState, onDownloadLoadingState } from './service/lower-tabular-panel.state';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-lower-tabular-panel',
  templateUrl: './lower-tabular-panel.component.html',
  styleUrls: ['./lower-tabular-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PipeService],
})
export class LowerTabularPanelComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private static SLAB_GRAPH_TYPE = [
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
  private static PERCENTILE_GRAPH_TYPE = [
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
  private static DIAL_METER_GRAPH_STANDARD_TYPE = [17, 18, 19, 20];
  private static DIAL_METER_GRAPH_PERCENTILE_TYPE = [39, 40];
  private static DIAL_METER_GRAPH_SLAB_GRAPH_TYPE = [50, 51];
  private dataSubscription: Subscription;
  error: AppError;
  loading: boolean;
  empty: boolean;

  showPaginator: boolean = false;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  paginatorTitle: string = 'Show Pagination';
  finalValue: any;
  tooltipzindex = 100000;

  checked: boolean = true;

  @HostBinding('class.open')
  isOpen = false;

  data: LowerPanelTable = null;

  colFilter : any = {};

  selectedGraph: any = null;

  cols: TableHeaderColumn[];
  _SELECTEDCOLUMNS: TableHeaderColumn[];
  filterColumn: TableHeaderColumn[];
  trendCompareFlag: boolean = false;
  geoMapFlag : boolean = false;
  private dashboardDestroySubscription: Subscription;
  private widgetSelectionSubscription: Subscription;
  private widgetDeselectionSubscription: Subscription;
  private widgetLoadedSubscription: Subscription;
  private widgetLoadingSubscription: Subscription;
  private widgetLoadingErrorSubscription: Subscription;
  private dashboardAnalysisModeToggleSubscription: Subscription;
  private widgetGraphOperationSubscription: Subscription;
  private dashboardLoadingStartSubscription: Subscription;

  @ViewChild('menu') menu;
  @ViewChild('dt') dt;

  @Input() container: Element;
  @Input() dashboard: DashboardComponent;
  widget: DashboardWidgetComponent;
  downloadOptions: MenuItem[];
  filterTimeout: NodeJS.Timeout;

  constructor(
    private pipeService: PipeService,
    private dashboardService: DashboardService,
    private sessionService: SessionService,
    private patternMatchService: PatternMatchingService,
    private lowerpanelService: LowerPanelService
  ) {}

  ngOnInit() {
    const me = this;
    // me.filter();
    // this.colFilter = { "Count" : ">90"};
    //     console.log("colFilter" , this.colFilter)
    me.filterColumn = [];
    me.showPaginator = true;

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadTableData("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadTableData("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadTableData("pdf");
        }
      }
    ]

    me.lowerpanelService.isLowerPanelValue().subscribe(value => {
      // console.log("value----", value);
      if (!value) {
        this.close();
      }
    })

    this.dataSubscription = this.lowerpanelService.lowerPanelUpdateProvider$.subscribe(
      /*Getting Event Here.*/
      value => {

         try {
          const me = this;
     me.widget.graphOperation(
       [value.graphName],
       'SELECTED',
       'UNSELECTED'
     );
    // me.widget.graphOperation([event.data.metricName], 'SELECTED');
     if (me.selectedGraph) {
       me.widget.widget.patternMatchBaselineFromLowerPanel = me.selectedGraph.metricName;
     }
         }catch(e) {
          this.dataSubscription.unsubscribe();
         }
    }
  );

    // me.selectToggle(true);

  }

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

  downloadTableData(type) {
    const me = this;
    let duration = me.getDuration();

    //zoom time
    if(me.widget.widget.zoomInfo && me.widget.widget.zoomInfo.isZoom && me.widget.widget.zoomInfo.times.length > 0){
      duration.st = me.widget.widget.zoomInfo.times[me.widget.widget.zoomInfo.times.length - 1].zoomSt;
      duration.et = me.widget.widget.zoomInfo.times[me.widget.widget.zoomInfo.times.length - 1].zoomEt;
    }

    //widget wise time
    if(me.widget.widget.widgetWiseInfo && me.widget.widget.widgetWiseInfo.widgetWise){
      duration.st = me.widget.widget.widgetWiseInfo.duration.st;
      duration.et = me.widget.widget.widgetWiseInfo.duration.et;
    }

    let st = this.sessionService.convertTimeToSelectedTimeZone(duration.st);
    let et = this.sessionService.convertTimeToSelectedTimeZone(duration.et);
    let timeZone =  me.sessionService.selectedTimeZone.abb;
    let header = ['S No.'];
    let skipColumn = ['Color'];
    for (const c of me.cols) {
      if (c.label != 'Color')
        header.push(c.label);
      if (!me.selectedColumns.includes(c)) {
        skipColumn.push(c.label);
      }
    }

    let lowerPanelTitle = " (" + st + " to " + et + " " + timeZone + " ) ";

    me.lowerpanelService.downloadTableData(type, me.data.data, header, skipColumn, lowerPanelTitle).subscribe(
      (state: Store.State) => {
        if (state instanceof onDownloadLoadingState) {
          me.downloadTableDataLoading(state);
          return;
        }
        if (state instanceof onDownloadLoadedState) {
          me.downloadTableDataLoaded(state);
          return;
        }
      },
      (state: onDownloadLoadingErrorState) => {
        me.downloadTableDataLoadingError(state);
      }

    );
  }
  downloadTableDataLoading(state) { }
  downloadTableDataLoaded(state) {
    let path = state.data.path.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");
  }
  downloadTableDataLoadingError(state) { }


  ngAfterViewInit() {
    const me = this;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      me.dashboardAnalysisModeToggleSubscription = dc.events.analysisModeToggle.subscribe(
        (flag: boolean) => {
          setTimeout(() => {
            me.toggle();
            if (!flag) {
              me.close();
            } else {
              me.open();
            }
          });
        }
      );
    });

  }

  ngOnDestroy() {
    const me = this;
    me.close();
    if (me.dashboardAnalysisModeToggleSubscription) {
      me.dashboardAnalysisModeToggleSubscription.unsubscribe();
    }
     if(this.dataSubscription)
    this.dataSubscription.unsubscribe();

  }

  disablePagination() {
    const me = this;
    me.showPaginator = !me.showPaginator;
    if (me.showPaginator) {
      me.paginatorTitle = 'Hide Pagination';
    } else {
      me.paginatorTitle = 'Show Pagination';
    }
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  toggleDownloadOptions(event) {
    // console.log("event ", event)
    const me = this;
    me.menu.show();
    // if (me.isOpen) {
    //   me.menu.show();
    // } else {
    //   me.menu.hide();
    // }
  }


  toggle() {
    const me = this;

    if (me.isOpen) {
      me.close();
    } else {
      me.open();
    }
  }

  close() {
    const me = this;
    me.isOpen = false;
    me.loading = false;
    me.data = null;
    me.empty = true;

    var openLowerPanelDiv = document.getElementsByClassName('open')[0];
    if(openLowerPanelDiv){
      openLowerPanelDiv['style']['height'] = '240px';
    }
    let lowerPanelDiv = document.getElementById('lowerSectionId') as HTMLFormElement;
    if(lowerPanelDiv){
    let scrollDiv = lowerPanelDiv.getElementsByClassName('ui-table-scrollable-body')[0];
    if(scrollDiv){
      scrollDiv['style']['maxHeight'] = '162px';
    }
  }

    if (me.container) {
      me.container.classList.remove('analysis-mode');
    }

    if (me.dashboardLoadingStartSubscription) {
      me.dashboardLoadingStartSubscription.unsubscribe();
    }

    if (me.dashboardDestroySubscription) {
      me.dashboardDestroySubscription.unsubscribe();
    }
    if (me.widgetSelectionSubscription) {
      me.widgetSelectionSubscription.unsubscribe();
    }

    if (me.widgetDeselectionSubscription) {
      me.widgetDeselectionSubscription.unsubscribe();
    }

    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      dc.events.analysisModeChanged.next(false);
    });
  }

  open() {
    const me = this;
    me.isOpen = true;
    me.loading = true;
    if (me.container) {
      me.container.classList.add('analysis-mode');
    }

    if (me.dashboardLoadingStartSubscription) {
      me.dashboardLoadingStartSubscription.unsubscribe();
    }

    if (me.widgetLoadingSubscription) {
      me.widgetLoadingSubscription.unsubscribe();
    }
    if (me.widgetLoadingErrorSubscription) {
      me.widgetLoadingErrorSubscription.unsubscribe();
    }

    if (me.dashboardDestroySubscription) {
      me.dashboardDestroySubscription.unsubscribe();
    }
    if (me.widgetSelectionSubscription) {
      me.widgetSelectionSubscription.unsubscribe();
    }

    if (me.widgetDeselectionSubscription) {
      me.widgetDeselectionSubscription.unsubscribe();
    }

    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      if (!dc.selectedWidget) {
        me.loading = false;
        me.empty = true;
        me.data = null;
      }

      dc.events.analysisModeChanged.next(true);

      me.dashboardLoadingStartSubscription = dc.events.loadingStart.subscribe(
        () => {
          setTimeout(() => {
            me.unload(null);
          });
        }
      );

      me.dashboardDestroySubscription = dc.events.destroyed.subscribe(() => {
        setTimeout(() => {
          me.unload(null);
        });
      });
      me.widgetSelectionSubscription = dc.events.widgetSelected.subscribe(
        (widget: DashboardWidgetComponent) => {
          me.loading = true;
          // me.widgetLoadedSubscription = widget.events.onLoaded.subscribe(() => {
          //   me.load(widget);
          // });

          // me.widgetLoadingSubscription = widget.events.onLoading.subscribe(
          //   () => {
          //     me.loading = true;
          //   }
          // );

          // me.widgetLoadingErrorSubscription = widget.events.onLoadingError.subscribe(
          //   () => {
          //     me.empty = true;
          //     me.loading = false;
          //   }
          // );

          setTimeout(() => {
            me.load(widget);
            // this.colFilter = { "Count" : ">0"};
          });
        }
      );

      me.widgetDeselectionSubscription = dc.events.widgetDeselected.subscribe(
        (widget: DashboardWidgetComponent) => {
          if (me.widgetLoadedSubscription) {
            me.widgetLoadedSubscription.unsubscribe();
          }
          if (me.widgetLoadingSubscription) {
            me.widgetLoadingSubscription.unsubscribe();
          }
          if (me.widgetLoadingErrorSubscription) {
            me.widgetLoadingErrorSubscription.unsubscribe();
          }
          setTimeout(() => {
            me.unload(widget);
          });
        }
      );

      if (dc.selectedWidget) {
        me.loading = false;
        me.empty = false;
        me.load(dc.selectedWidget);
      }
    });
  }

  load(widget: DashboardWidgetComponent) {
    const me = this;
    me.loading = false;
    /* If Dashboard lower panel is not opened then no need to make the data so we are returning from the code of lower panel */
    if(!me.isOpen) {
      return;
    }

    if (widget.widget.type === 'LABEL') {
      this.close();
      return;
    }

    me.widget = widget;
    const type = _.get(widget, 'widget.settings.types.graph.type', null);

    if(!(DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) > -1 || DashboardService.SLAB_GRAPH_TYPE.indexOf(type) > -1)) {
      let isCall  = this.dashboardService.isMetricUsesSummaryDataForGraph(me.widget);
      if(!isCall ) {
        this.dashboardService.calculateLowerPanelData(me.widget.data,widget);
      }
    }


    me.empty = widget.empty;

    if (me.widgetLoadedSubscription) {
      me.widgetLoadedSubscription.unsubscribe();
    }
    if (me.widgetLoadingSubscription) {
      me.widgetLoadingSubscription.unsubscribe();
    }
    if (me.widgetLoadingErrorSubscription) {
      me.widgetLoadingErrorSubscription.unsubscribe();
    }

    // if (me.widgetGraphOperationSubscription) {
    //   me.widgetGraphOperationSubscription.unsubscribe();
    // }
    me.widgetLoadedSubscription = me.widget.events.onLoaded.subscribe(() => {
      me.load(me.widget);
    });

    me.widgetLoadingSubscription = me.widget.events.onLoading.subscribe(() => {
      me.loading = true;
    });

    me.widgetLoadingErrorSubscription = me.widget.events.onLoadingError.subscribe(
      () => {
        me.empty = true;
        me.data = null;
        me.loading = false;
      }
    );

    // TODO: Handle widget Visible and selection
    // me.widgetGraphOperationSubscription = me.widget.events.onGraphOperation.subscribe(
    //   () => {
    //     me.reloadGraphStatus(widget);
    //   }
    // );

    if (!me.empty) {
      const data = me.getDefaultData(widget);
      const type = _.get(widget, 'widget.settings.types.graph.type', null);
      if (me.widget.data && me.widget.data.grpData && me.widget.data.grpData.mFrequency[0].trend) {
        me.trendCompareFlag = true;
        me.prepareTrendCompareTable(data, widget);
      }
      else if (LowerTabularPanelComponent.SLAB_GRAPH_TYPE.indexOf(type) !== -1) {
        me.prepareSlabTable(data, widget);
      } else if (
        LowerTabularPanelComponent.PERCENTILE_GRAPH_TYPE.indexOf(type) !== -1
      ) {
        me.preparePercentileTable(data, widget);
      } else if (
        LowerTabularPanelComponent.DIAL_METER_GRAPH_STANDARD_TYPE.indexOf(
          type
        ) !== -1
      ) {
        me.prepareDialMeterStandardTable(data, widget);
      } else if (
        LowerTabularPanelComponent.DIAL_METER_GRAPH_PERCENTILE_TYPE.indexOf(
          type
        ) !== -1
      ) {
        me.prepareDialMeterPercentileTable(data, widget);
      } else if (
        LowerTabularPanelComponent.DIAL_METER_GRAPH_SLAB_GRAPH_TYPE.indexOf(
          type
        ) !== -1
      ) {
        me.prepareDialMeterSlabGraphTable(data, widget);
      } else {
        me.prepareStandardTable(data, widget);
      }

      if (data) {
        me.empty = false;
      } else {
        me.empty = true;
        me.data = null;
      }

      me.data = data;
      // const activeDiv = document.querySelector('app-lower-tabular-panel');
      // if(me.data.data && me.data.data.length >= 5){
      //   activeDiv.className = 'opens';
      // }
      me.cols = me.data.headers[0].cols;
      if (me.filterColumn.length == 0) {
        me._SELECTEDCOLUMNS = me.cols;
      } else {
        me._SELECTEDCOLUMNS = [...me.filterColumn];
      }

      if (me.data.visibleGraph.length === me.data.data.length) {
        me.checked = true;
      } else {
        me.checked = false;
      }
    }

    if(this.dt && this.isEnabledColumnFilter) {
      this.filterTimeout = setTimeout(() => {
        let filterObj = this.dt.filters;
        let filterData = [];
        this.colFilter = {};
        for (var key in filterObj) {
          if (filterObj.hasOwnProperty(key)) {
            var val = filterObj[key];
            let json = {};
            if(key == "avg") {
              this.colFilter.Avg = val.value;
            } else if(key == "min") {
              this.colFilter.Min = val.value;
            } else if(key == "max") {
              this.colFilter.Max = val.value;
            }else if(key == "stdDev") {
              this.colFilter.StdDev = val.value;
            }else if(key == "lastSample") {
              this.colFilter.Last = val.value;
            }else if(key == "count") {
              this.colFilter.Count = val.value;
            }
            else if(key == "metricName") {
              this.colFilter['Metric Name'] = val.value;
            }

            json[key] = val;
            filterData.push(json);
          }
        }
       }, 250);
    }else {
      this.colFilter = {};
      this.isEnabledColumnFilter = false ;
      if (me.isEnabledColumnFilter === true) {
        me.filterTitle = 'Disable Filters';
      } else {
        me.filterTitle = 'Enable Filters';
      }
    }
    // this.colFilter = { "Count" : ">0"};
    // console.log("colFilter" , this.colFilter , me.dt )
    // Object.entries(this.colFilter).map(item =>
    //   me.dt.filter(item[1], 'count', 'custom')
    //   );
    me.filter();

  }

  // onLoadFilter(event, dt){
  //   console.log("event" , event, "dt" ,dt)
  //   // dt.filter(">90" , "count" ,"custom");
  //   if (this.filterTimeout) {
  //     clearTimeout(this.filterTimeout);
  //     }
  //     this.filterTimeout = setTimeout(() => {
  //     dt.filter(event.target.value, 'count', 'custom');
  //     }, 250);
  // }

  unload(widget: DashboardWidgetComponent) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.widget = null;
  }

  onRowSelect(event) {
    const me = this;
    me.widget.graphOperation(
      [event.data.metricName],
      'SELECTED',
      'UNSELECTED'
    );
   // me.widget.graphOperation([event.data.metricName], 'SELECTED');
    if (me.selectedGraph) {
      me.widget.widget.patternMatchBaselineFromLowerPanel = me.selectedGraph.metricName;
    }
  }
  onRowUnselect(event) {
    const me = this;
    me.widget.graphOperation(
      [event.data.visibleGraph],
      'SELECTED',
      'UNSELECTED'
    );
  }

  graphColorChange(row, event) {
    const me = this;
    me.widget.graphOperation([row.metricName], 'SHOW', null, event.value, true);
  }
  changeColorForGraph(event , data) {

    let color = event.target.value;
    const me = this;
 me.widget.graphOperation([data.metricName], 'SHOW', null, color);
}

  onPage(event) {
    const me = this;
    me.sessionService.setSetting('lowerTabularPanelRows', event.rows);
  }

  hideShowAllGraph(event) {
    const me = this;
    if (event) {
      me.data.visibleGraph = me.data.data;
      me.widget.graphOperation(
        _.map(me.data.visibleGraph, 'metricName'),
        'SHOW',
        'HIDE'
      );
    } else {
      me.data.visibleGraph = [];
      me.widget.graphOperation(
        _.map(me.data.visibleGraph, 'metricName'),
        'SHOW',
        'HIDE'
      );
    }
  }

  hideShowGraph(row, event) {
    const me = this;
    if (event.checked === true) {
      me.widget.graphOperation([row.metricName], 'SHOW');
      if (me.data.visibleGraph.length === me.data.data.length) {
        me.checked = true;
      } else {
        me.checked = false;
      }
    } else {
      me.widget.graphOperation([row.metricName], 'HIDE');
      if (me.data.visibleGraph.length === me.data.data.length) {
        me.checked = true;
      } else {
        me.checked = false;


      }
    }
  }

  // private reloadGraphStatus(widget) {
  //   const me = this;
  //   me.data.visibleGraph = [];
  //   me.selectedGraph = null;
  //   widget.forEachGraph((args) => {
  //     if (args.graphSettings.selected) {
  //       console.log(args.graph);
  //     }
  //   });
  // }

  private getDefaultData(widget: DashboardWidgetComponent): LowerPanelTable {
    const me = this;
    const data = {
      headers: [
        {
          cols: [],
        },
      ],
      sort: {
        fields: [],
      },
      paginator: {
        rows: me.sessionService.getSetting('lowerTabularPanelRows', 5),
        rowsPerPageOptions: [3, 5, 10, 20, 50, 100],
      },
      data: [],
      selected: [],
      visibleGraph: [],
    };

    this.geoMapFlag = this.checkGeoMapType(widget.widget.settings.chartType);

    if (widget.widget.type !== 'DATA' && !widget.widget.isTrendCompare && !this.geoMapFlag) {
      data.headers[0].cols.push({
        label: 'Color',
        value: 'color',
        classes: 'text-center',
        filter: {
          isFilter: false,
          type: null,
        },
      });
    }

    data.headers[0].cols.push({
      label: 'Metric Name',
      value: 'metricName',
      classes: 'text-left',
      filter: {
        isFilter: true,
        type: 'contains',
      },
    });

    return data;
  }

  checkGeoMapType(chartType: number): boolean {
    if(chartType == ChartType.GEO_MAP_AVG || chartType == ChartType.GEO_MAP_LAST || chartType == ChartType.GEO_MAP_MAX) {
      return true;
    }else {
      false;
    }
  }

  private prepareStandardTable(
    data: LowerPanelTable,
    widget: DashboardWidgetComponent
  ) {
    const me = this;
    const header = data.headers[0];
    let pctChangeValue = "";
    const headerCols: TableHeaderColumn[] = [
      {
        label: 'Min',
        format: 'dec_3',
        value: 'min',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Max',
        format: 'dec_3',
        value: 'max',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Avg',
        format: 'dec_3',
        value: 'avg',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'StdDev',
        format: 'dec_3',
        value: 'stdDev',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Last',
        format: 'dec_3',
        value: 'lastSample',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Count',
        format: 'num_en_us',
        value: 'count',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
    ];

    if (widget.widget.isApplyCompare) {
      headerCols.push({
        label: '%Change',
        format: 'num_en_us',
        value: 'percentChange',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      })
    }

    header.cols = [...header.cols, ...headerCols];

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        if (!widget.data && !data.data) {
          me.empty = true;
          me.data = null;
        } else {
          me.empty = false;
        }

        let baselineAvg = -1;
        // Generate table data
        // console.log("widget---------->", widget);

        widget.forEachGraph((args: ForEachGraphArgs) => {
          const row = {
            color: args.graphSettings.color,
            metricName: args.graphName,
            selected: args.graphSettings.selected,
          };
          // console.log("args.graph.compareColor------>", args.graph.compareColor);
          if (args.graph) {
            if (widget.widget.type === 'SYSTEM_HEALTH') {
            row.color = widget.widget.settings.types.systemHealth.severity;
            }
            else if (args.graph.compareColor !== null && args.graph.compareColor !== undefined) {
              row.color = args.graph.compareColor;
              let normalAvg = -1;
              if (args.gsType === "0") {
                baselineAvg = widget.data.grpData.mFrequency[0].data[0].lowerPanelSummary[args.gsType].avg;
                normalAvg = args.graph.lowerPanelSummary[args.gsType].avg;
              }
              if (args.gsType === "1") {
                baselineAvg = widget.data.grpData.mFrequency[0].data[0].lowerPanelSummary[args.gsType].min;
                normalAvg = args.graph.lowerPanelSummary[args.gsType].min;
              }
              if (args.gsType === "2") {
                baselineAvg = widget.data.grpData.mFrequency[0].data[0].lowerPanelSummary[args.gsType].max;
                normalAvg = args.graph.lowerPanelSummary[args.gsType].max;
              }
              if (args.gsType === "3") {
                baselineAvg = widget.data.grpData.mFrequency[0].data[0].lowerPanelSummary[args.gsType].count;
                normalAvg = args.graph.lowerPanelSummary[args.gsType].count;
              }
              if (args.gsType === "4") {
                baselineAvg = widget.data.grpData.mFrequency[0].data[0].lowerPanelSummary[args.gsType].stdDev;
                normalAvg = args.graph.lowerPanelSummary[args.gsType].stdDev;
              }
              if (args.gsType === "5") {
                baselineAvg = widget.data.grpData.mFrequency[0].data[0].lowerPanelSummary[args.gsType].lastSample;
                normalAvg = args.graph.lowerPanelSummary[args.gsType].lastSample;
              }
              // console.log("normalAvg-------", normalAvg);
              let pctValue = getPercentChange(normalAvg, baselineAvg);
              // console.log("pctValue-------->", pctValue);
              if (baselineAvg == 0.0) {
                pctChangeValue = "";
              }
              else if (pctValue < 0) {
                pctChangeValue = pctValue + "%";
              }
              else {
                pctChangeValue = "+" + pctValue + "%";
              }
              args.graph.lowerPanelSummary[args.gsType].percentChange = pctChangeValue;
            }
            else {
              row.color = args.graphSettings.color;
            }

            for (const col of headerCols) {
              let value = _.get(
                args.graph.lowerPanelSummary[args.gsType],
                col.value,
                null
              );
              if (typeof value === "number") {
                const formatter: PipeTransform = me.pipeService.getFormatter(
                  col.format
                );
                if (formatter) {
                  value = formatter.transform(value);
                }
              }
              row[col.value] = value;
            }

            if (args.graphSettings.visible && row['count'] && row['count'] > "0") {
              data.selected.push(row);
              data.visibleGraph.push(row);
            }
            /*This condition is edit beacause when any graph has the count value 0 then do not need to add into the lower panel */
            if(row['count'] && row['count'] > "0") {
              data.data.push(row);
            }
          }
        });
      },
      (error: AppError) => {
        // me.loading = widget.loading;
        // me.empty = widget.empty;
      }
    );
  }

  customSort(event) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      let fieldName = event.field ; // "metricName"

      if(fieldName != "metricName") {
        value1 = value1.replace(/,/g, '');
        value2 = value2.replace(/,/g, '');
      }
      if (value1 == null && value2 != null)
          result = -1;
      else if (value1 != null && value2 == null)
          result = 1;
      else if (value1 == null && value2 == null)
          result = 0;
       else if (fieldName == "metricName")
           result = value1.localeCompare(value2);
      else
          result = (Number(value1) < Number(value2)) ? -1 : (Number(value1) > Number(value2)) ? 1 : 0;

      return (event.order * result);
  });
  }

  private preparePercentileTable(
    data: LowerPanelTable,
    widget: DashboardWidgetComponent
  ) {
    const me = this;

    if (!widget.data) {
      me.empty = true;
      me.data = null;
    } else {
      me.empty = false;
    }

    const header = data.headers[0];

    const headerColsRaw = _.get(
      widget,
      'widget.settings.types.graph.arrPct',
      []
    );

    for (const slab of headerColsRaw) {
      const headerCol: TableHeaderColumn = {
        label: slab + 'th',
        value: slab,
        format: 'dec_3',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      };
      header.cols.push(headerCol);
    }

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        // Generate table data
        widget.forEachGraph((args: ForEachGraphArgs) => {
          const row = {
            color: args.graphSettings.color,
            metricName: args.graphName,
            selected: args.graphSettings.selected,
          };

          for (const col of header.cols) {
            if (!row[col.value]) {
              let value = args.graph.percentile[Number(col.value) - 1];

              const formatter: PipeTransform = me.pipeService.getFormatter(
                col.format
              );
              if (formatter) {
                value = formatter.transform(value);
              }
              row[col.value] = value;
            }
          }
          if (args.graphSettings.visible) {
            data.selected.push(row);
            data.visibleGraph.push(row);
          }
          data.data.push(row);
        });
      },
      (error: AppError) => { }
    );
  }

  prepareTrendCompareTable(data: LowerPanelTable, widget: DashboardWidgetComponent) {
    const me = this;
    if (!widget.data) {
      me.empty = true;
      me.data = null;
    } else {
      me.empty = false;
    }
    const header = data.headers[0];

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        // Generate table data
        let colorForTrend;
        for (let m = 0; m < widget.data.grpData.mFrequency[0].measurementName.length; m++) {
          const headerCol: TableHeaderColumn = {
            label: widget.data.grpData.mFrequency[0].measurementName[m].name,
            value: widget.data.grpData.mFrequency[0].measurementName[m].name,
            format: 'dec_3',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type: 'custom',
            },
          };
          //colorForTrend =  widget.data.grpData.mFrequency[0].measurementName[m].rowBgColorField;
          header.cols.push(headerCol);
        }
        let metricName = widget.widget.description;
        widget.data.grpData.mFrequency[0].data.forEach((args) => {

          const row = {
            //color: "red",
            metricName: args.measure.metric + "-" + args.subject.tags[0].sName
          };


          let i = 0;
          for (const col of header.cols) {
            if (!row[col.value] && args.avg.length != 0) {
              let value = args.avg[i];
              row[col.value] = value;
              i++;
            }
            if (!row[col.value] && args.min.length != 0) {
              let value = args.min[i];
              row[col.value] = value;
              i++;
            }
            if (!row[col.value] && args.max.length != 0) {
              let value = args.max[i];
              row[col.value] = value;
              i++;
            }
            if (!row[col.value] && args.count.length != 0) {
              let value = args.count[i];
              row[col.value] = value;
              i++;
            }
            if (!row[col.value] && args.sumCount.length != 0) {
              let value = args.sumCount[i];
              row[col.value] = value;
              i++;
            }

          }

          data.selected.push(row);
          data.visibleGraph.push(row);


          data.data.push(row);
        });
      },
      (error: AppError) => { }
    );
  }


  private prepareSlabTable(
    data: LowerPanelTable,
    widget: DashboardWidgetComponent
  ) {
    const me = this;
    if (!widget.data) {
      me.empty = true;
      me.data = null;
    } else {
      me.empty = false;
    }
    const header = data.headers[0];

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        // Generate table data
        widget.forEachGraph((args: ForEachGraphArgs) => {
          if (args.graphIndex === 0) {
            for (const slab of args.graph.slabName) {
              const headerCol: TableHeaderColumn = {
                label: slab,
                value: slab,
                format: 'dec_3',
                classes: 'text-right',
                filter: {
                  isFilter: true,
                  type: 'custom',
                },
              };
              header.cols.push(headerCol);
            }
          }

          const row = {
            color: args.graphSettings.color,
            metricName: args.graphName,
          };
          let i = 0;
          for (const col of header.cols) {
            if (!row[col.value]) {
              let value = args.graph.slabCount[i];
              const formatter: PipeTransform = me.pipeService.getFormatter(
                col.format
              );
              if (formatter) {
                value = formatter.transform(value);
              }
              row[col.value] = value;
              i++;
            }
          }

          if (args.graphSettings.visible) {
            data.selected.push(row);
            data.visibleGraph.push(row);
          }

          data.data.push(row);
        });
      },
      (error: AppError) => { }
    );
  }

  private prepareDialMeterStandardTable(
    data: LowerPanelTable,
    widget: DashboardWidgetComponent
  ) {
    const me = this;
    if (!widget.data) {
      me.empty = true;
      me.data = null;
    } else {
      me.empty = false;
    }
    const header = data.headers[0];

    // Create Table Header
    const headerCols: TableHeaderColumn[] = [
      {
        label: 'Min',
        format: 'dec_3',
        value: 'min',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Max',
        format: 'dec_3',
        value: 'max',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Avg',
        format: 'dec_3',
        value: 'avg',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'StdDev',
        format: 'dec_3',
        value: 'stdDev',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Last',
        format: 'dec_3',
        value: 'lastSample',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
      {
        label: 'Count',
        format: 'num_en_us',
        value: 'count',
        classes: 'text-right',
        filter: {
          isFilter: true,
          type: 'custom',
        },
      },
    ];

    const count = me.widget.widget.settings.multiDial.count;

    header.cols = [...header.cols, ...headerCols];

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        // Generate table data
        widget.forEachGraph((args: ForEachGraphArgs) => {
          if (args.globalGraphIndex >= count) {
            return;
          }

          const row = {
            color: args.graphSettings.color,
            metricName: args.graphName,
          };

          if (args.graph) {
            if (widget.widget.type === 'SYSTEM_HEALTH') {
              row.color = widget.widget.settings.types.systemHealth.bgColor;
            } else {
              //  (row.color = args.graphSettings.color), //TODO: Graph Settings
            }

            for (const col of headerCols) {
              let value = _.get(
                args.graph.lowerPanelSummary[args.gsType],
                col.value,
                null
              );
              const formatter: PipeTransform = me.pipeService.getFormatter(
                col.format
              );
              if (formatter) {
                value = formatter.transform(value);
              }
              row[col.value] = value;
            }

            if (args.graphSettings.visible) {
              data.selected.push(row);
              data.visibleGraph.push(row);
            }

            data.data.push(row);
          }
        });
      },
      (error: AppError) => { }
    );
  }

  private prepareDialMeterPercentileTable(
    data: LowerPanelTable,
    widget: DashboardWidgetComponent
  ) {
    const me = this;
    if (!widget.data) {
      me.empty = true;
      me.data = null;
    } else {
      me.empty = false;
    }
    const header = data.headers[0];

    const headerColsRaw = _.get(
      widget,
      'widget.settings.types.graph.arrPct',
      []
    );
    const count = me.widget.widget.settings.multiDial.count;

    // Create Table Header
    if (headerColsRaw && headerColsRaw.length) {
      for (const slab of headerColsRaw) {
        const headerCol: TableHeaderColumn = {
          label: slab + 'th',
          value: slab,
          format: 'dec_3',
          classes: 'text-right',
          filter: {
            isFilter: true,
            type: 'custom',
          },
        };
        header.cols.push(headerCol);
      }
    }

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        // Generate table data
        widget.forEachGraph((args: ForEachGraphArgs) => {
          if (args.globalGraphIndex >= count) {
            return;
          }
          const row = {
            color: args.graphSettings.color,
            metricName: args.graphName,
          };

          for (const col of header.cols) {
            if (!row[col.value]) {
              let value = args.graph.percentile[Number(col.value) - 1];
              const formater: PipeTransform = me.pipeService.getFormatter(
                col.format
              );
              if (formater) {
                value = formater.transform(value);
              }
              row[col.value] = value;
            }
          }

          if (args.graphSettings.visible) {
            data.selected.push(row);
            data.visibleGraph.push(row);
          }

          data.data.push(row);
        });
      },
      (error: AppError) => { }
    );
  }

  private prepareDialMeterSlabGraphTable(
    data: LowerPanelTable,
    widget: DashboardWidgetComponent
  ) {
    const me = this;
    if (!widget.data) {
      me.empty = true;
      me.data = null;
    } else {
      me.empty = false;
    }
    const header = data.headers[0];

    const count = me.widget.widget.settings.multiDial.count;

    // Lower Panel Interceptor
    me.dashboardService.interceptor.onLowerPanelRender(
      data,
      widget,
      () => {
        // Generate table data
        widget.forEachGraph((args: ForEachGraphArgs) => {
          if (args.globalGraphIndex >= count) {
            return;
          }

          if (args.graphIndex === 0) {
            for (const slab of args.graph.slabName) {
              const headerCol: TableHeaderColumn = {
                label: slab,
                value: slab,
                format: 'dec_3',
                classes: 'text-right',
                filter: {
                  isFilter: true,
                  type: 'custom',
                },
              };
              header.cols.push(headerCol);
            }
          }

          const row = {
            color: args.graphSettings.color,
            metricName: args.graphName,
          };
          let i = 0;
          for (const col of header.cols) {
            if (!row[col.value]) {
              let value = args.graph.slabCount[i];
              const formater: PipeTransform = me.pipeService.getFormatter(
                col.format
              );
              if (formater) {
                value = formater.transform(value);
              }
              row[col.value] = value;
              i++;
            }
          }

          if (args.graphSettings.visible) {
            data.selected.push(row);
            data.visibleGraph.push(row);
          }

          data.data.push(row);
        });
      },
      (error: AppError) => { }
    );
  }


  // Custom operator filter
  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        const operator1 = filter.slice(0, 2);
        const operator2 = filter.slice(0, 1);

        // console.log("print" ,operator1, typeof(operator1))

        // Filter if value >= ,<=, ==
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length));
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length));
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length));
              // console.log("comigng" , me.finalValue)
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length));
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length));
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') === -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') === -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter);
        }
      }
      return me.finalValue;
    };
  }

  expandLowerPaneHeight() {

    let lowerPanelDiv = document.getElementById('lowerSectionId') as HTMLFormElement;
    let scrollDiv = lowerPanelDiv.getElementsByClassName('ui-table-scrollable-body')[0];
    var openLowerPanelDiv = document.getElementsByClassName('open')[0];
    if(openLowerPanelDiv){
      var offsetHeight = openLowerPanelDiv['offsetHeight'];
      if(offsetHeight < 430){
        openLowerPanelDiv['style']['height'] = offsetHeight + 100 + 'px';
        if(scrollDiv){
       let scrollMaxHeight =  scrollDiv['style']['maxHeight'];
       let scrollHeight = scrollMaxHeight.split('px')[0];
       scrollDiv['style']['maxHeight'] =  Number(scrollHeight) + 100 + 'px';
        }
      }
    }

  }
  reduceLowerPaneHeight() {
    let lowerPanelDiv = document.getElementById('lowerSectionId') as HTMLFormElement;
    let scrollDiv = lowerPanelDiv.getElementsByClassName('ui-table-scrollable-body')[0];
    var openLowerPanelDiv = document.getElementsByClassName('open')[0];
    if(openLowerPanelDiv){
      var offsetHeight = openLowerPanelDiv['offsetHeight'];
      if(offsetHeight > 240 ){
        openLowerPanelDiv['style']['height'] = offsetHeight - 100 + 'px';
        if(scrollDiv){
          let scrollMaxHeight =  scrollDiv['style']['maxHeight'];
         let scrollHeight = scrollMaxHeight.split('px')[0];
         scrollDiv['style']['maxHeight'] =  Number(scrollHeight) - 100 + 'px';
        }
      }
    }
  }

  // Toggle Columns

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._SELECTEDCOLUMNS;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._SELECTEDCOLUMNS = me.cols.filter((col) => val.includes(col));
    me.filterColumn = me._SELECTEDCOLUMNS;
  }
}
function getPercentChange(normalAvg: number, baselineAvg: number) {
  let diffDataValueInPct = 0;


  let diffDataValue = (baselineAvg - normalAvg);

  if (normalAvg > 0) {
    diffDataValueInPct = Math.floor(((diffDataValue / normalAvg) * 100));
  }
  else {
    if (diffDataValue == 0)
      diffDataValueInPct = 0;
    else
      diffDataValueInPct = 100;
  }
  return diffDataValueInPct;
}

