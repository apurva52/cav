import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { DashboardWidgetLoadRes } from 'src/app/shared/dashboard/service/dashboard.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { LockService } from './lock.service';
import { LOCKS_TABLE } from './service/locks-table.dummy';

@Component({
  selector: 'app-locks',
  templateUrl: './locks.component.html',
  styleUrls: ['./locks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocksComponent implements OnInit {

  dataTable: DBMonTable;
  dataChart: ChartConfig[];
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number = 0;
  downloadOptions: MenuItem[];
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 

  globalFilterFields: string[] = [];  
  selectedRow: any;  
  isShowColumnFilter: boolean = false;
  finalValue: any;
  timeRange: string = '';
  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  dataSubsciption: Subscription;
  enableChart :boolean = false;

  constructor(private _lockService: LockService  ,
    public dbMonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService) { }

  ngOnInit(): void {

    const me = this;

    me.cols = me.dbMonService.loadTableHeaders('ACTIVITY','LOCK');
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
    me.dataChart = [
      {
        title: 'Lock Types',
        highchart: {
          chart: {
            height: '200px',
            zoomType: 'x',
            type: 'spline'
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
              text: null,
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
          series: [{
            name: 'Lock Waits/Sec',
            data: []
          },{
            name: 'Lock Timeouts/Sec',
            data: []
          },{
            name: 'Lock Requests/Sec',
            data: []
          }] as Highcharts.SeriesOptionsType[],
        },
      },
      {
        title: 'Latches',
        highchart: {
          chart: {
            height: '200px',
            zoomType: 'x',
            type: 'spline'
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
              text: null,
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
          series: [{
            name: 'Latch Waits/Sec',
            data: []
          },{
            name: 'Latch Wait Time (ms)/Sec',
            data: []
          }] as Highcharts.SeriesOptionsType[]
        },
      }
    ];
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

  private subscribeScheduleLoad(){
    const me = this;
    me.dataSubsciption = me.dbMonService.scheduleDataRequestObservable$.subscribe(
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

  private scheduleLoad(){
    const me = this;
    if(me.schedulerService){
      me.schedulerService.unsubscribe('load-lockstats');
    }
    if(me.dbMonService.isAnalysisMode){
      return;
    }
    me.schedulerService.subscribe('load-lockstats', () => {
      me.load();
    }, 'progressInterval');
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
      me._lockService.getPresetAndLoad(payload).subscribe(
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
    // me.dataTable.data = null;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  private onLoadingError(state: DBMonitoringLoadingErrorState) {
    const me = this;
    //me.dataTable.data = null;
    me.error = state.error;
    me.empty = false;
    me.loading = false;
  }

  private onLoaded(state: DBMonitoringLoadedState) {
    const me = this;
    me.dataTable.data = state.data['msSqlLockStats'];
    if (state.data['arrStartAndEndTimeForTable'][1] && state.data['arrStartAndEndTimeForTable'][0] && state.data['arrStartAndEndTimeForTable'][1] != null && state.data['arrStartAndEndTimeForTable'][0] != null) {
      if(me.dbMonService.isRealTimeAppled){
      me.timeRange = state.data['arrStartAndEndTimeForTable'][1];
      }else{
        me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1];
      }
    }
    if (me.dataTable.data) {
      me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
    if (state.data && state.data['panelDataForLockStat']) {
        me.enableChart = false;
      
          const newData:DashboardWidgetLoadRes = state.data['panelDataForLockStat']['dataResponseDTO'];
          //iterating for multiple frequency graphs
          if(newData.grpData != null){
          for (const [mIndex, mFreq] of newData.grpData.mFrequency.entries()) {

            //checking for negative frequency case
            if (mFreq.tsDetail.frequency < 0 || mFreq.tsDetail.st == 0) {
              // console.log("frequency is negative and start time is zero")
              continue;
            }
            me.dbMonService.avgCount = mFreq.avgCount;
            me.dbMonService.avgCounter = mFreq.avgCounter;
            let chartIndex = 0;
            let seriesIndex = 0;
            let chartData = [];
            for (const [dIndex, data] of mFreq.data.entries()) {

              if (dIndex == 3) {
                chartIndex = 1;
                seriesIndex = 0;
              }
              chartData = me.dbMonService.getTimedDataArrayTSDB(data.avg, mFreq.tsDetail);
              me.dataChart[chartIndex].highchart.series[seriesIndex]['data'] = chartData;
              seriesIndex++;
            }
          }
        }
        setTimeout(() => {
          this.enableChart = true;
        }, 100);
      }
      // if (me.dataTable) {
      //   me.empty = !me.dataTable.data.length;
      // }
    me.error = state.error;
    me.loading = false;
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-lockstats');
    if(me.dataSubsciption){
    me.dataSubsciption.unsubscribe();
    }
  }
}
