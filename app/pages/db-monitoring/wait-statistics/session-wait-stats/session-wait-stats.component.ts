import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { SessionWaitStatService } from './session-wait-stats.service';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { DashboardWidgetLoadRes } from 'src/app/shared/dashboard/service/dashboard.model';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { DBMonCommonParam } from '../../services/request-payload.model';

@Component({
  selector: 'app-session-wait-stats',
  templateUrl: './session-wait-stats.component.html',
  styleUrls: ['./session-wait-stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SessionWaitStatsComponent implements OnInit {

  dataTable: DBMonTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number = 0;
  downloadOptions: MenuItem[];
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 
  dataDB:any;
  Tstamp:any;
  globalFilterFields: string[] = [];  
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;
  @Output()   waitDataChart= new EventEmitter<ChartConfig>();
  dataChart: ChartConfig;
  enableChart :boolean = false;
  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  dataSubscription: Subscription;
  public timeRange: string = '';

  constructor(private sessionStatsService: SessionWaitStatService  ,
    private dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService) { }

  ngOnInit(): void {
    const me = this;
    me.cols = me.dbmonService.loadTableHeaders('WAIT','SESSIONWAITSTATS');
    me.dataTable = {
      paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 30, 50, 100],
      },
  
      headers: [
        {
          cols: me.cols,
        },
      ],
      data: [],
      tableFilter: true,
    };
    me.dataChart = 
      {
        title: 'Wait Statistics',
        highchart: {
          chart: {
            height: '200px',
            zoomType: 'x',
            type: 'area'
          },
          title: {
            text: null,
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            layout: 'horizontal',
            itemStyle: {
              // width: 70,
              color: '#333333',
              fontFamily: 'Product Sans',
              fontSize: '11px',
            },
          },
          xAxis: {
            type: 'datetime'
          },
          yAxis: {
            title: {
              text: 'Average Wait Time(ms)',
            },
          },
          tooltip: {
            pointFormat:
              '<b>{point.y:,.0f}</b>',
          },
          plotOptions: {
            spline: {
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            }
          },
          credits: {
            enabled: false,
          },
          series: [] as Highcharts.SeriesOptionsType[],
        },
      };
  me.load();
  for (const c of me.cols) {
      me.globalFilterFields.push(c.field);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.subscribeScheduleLoad();
  }

  ngAfterViewInit() {
    const me = this;
    me.scheduleLoad();
  }

  private scheduleLoad(){
    const me = this;
    if(me.schedulerService){
      me.schedulerService.unsubscribe('load-sessionwaittats');
    }
    me.schedulerService.subscribe('load-sessionwaittats', () => {
      me.load();
    }, 'progressInterval');
  }
  private subscribeScheduleLoad(){
    const me = this;
    me.dataSubscription = me.dbmonService.scheduleDataRequestObservable$.subscribe(
      result => {
        me.load();
        me.scheduleLoad();
    });
  }
  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
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

  load() {
    const me = this;
    if (!me.sessionSerivce.isActive()) {
      return;
    }
    const payload = {} as DBMonCommonParam;
    
      me.sessionStatsService.getPresetAndLoad(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof DBMonitoringLoadingState) {
          me.onLoading(state);
          return;
        }
        
        if (state instanceof DBMonitoringLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DBMonitoringLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    
    }

  private onLoading(state: DBMonitoringLoadingState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  private onLoadingError(state: DBMonitoringLoadingErrorState) {
    const me = this;
    me.error = state.error;
    me.empty = false;
    me.loading = false;
  }

  private onLoaded(state: DBMonitoringLoadedState) {
    const me = this;
      
    me.dataTable.data = state.data['sessionWaitStats'];
    if(me.dataTable.data){
      me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
    if (state.data !=null && state.data['arrStartAndEndTimeForDB'] !=null && ['arrStartAndEndTimeForDB'][1] && state.data['arrStartAndEndTimeForDB'][2] && state.data['arrStartAndEndTimeForDB'][1] != null && state.data['arrStartAndEndTimeForDB'][2] != null) {
      if(me.dbmonService.isRealTimeAppled){
      me.timeRange = state.data['arrStartAndEndTimeForDB'][2]; 
      }else{
        me.timeRange = state.data['arrStartAndEndTimeForDB'][2] + ' to ' + state.data['arrStartAndEndTimeForDB'][1]; 
      }
    }
    if (state.data['waitTimeWithTime'] != null && state.data['waitTimeWithTime']['graphData'] != null) {
      // let series = [];
      let arrTimeStamp = state.data['waitTimeWithTime']['timeStamp'];
      let graphData = state.data['waitTimeWithTime']['graphData'];
      let series = [];
      for (let graphName in graphData) {
        series.push({ name : graphName, type: 'area', data: me.dbmonService.getTimedDataArray(arrTimeStamp, graphData[graphName]['averageWaitList'])});
        // me.dataChart.highchart.series.push(
        //   {
        //     name: graphName,
        //     type: 'area',
        //     data: me.dbmonService.getTimedDataArray(arrTimeStamp, graphData[graphName]['averageWaitList'])
        //   }
        // )
      }
      me.dataChart.highchart['series']= series;
    }
    me.waitDataChart.emit(me.dataChart);
    setTimeout(() => {
      me.enableChart = true;
    }, 100);
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-sessionwaittats');
    if(me.dataSubscription){
    me.dataSubscription.unsubscribe();
    }
  }

}
