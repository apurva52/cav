import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonTable } from '../services/dbmon-table.model';
import { TEMP_DB_TABLE } from './services/temp-db.dummy';
import { tempDbTable } from './services/temp-db.model';
import { TempDBService } from './services/temp-db.service';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { DashboardWidgetLoadRes } from 'src/app/shared/dashboard/service/dashboard.model';
import { DBMonCommonParam } from '../services/request-payload.model';

@Component({
  selector: 'app-temp-db',
  templateUrl: './temp-db.component.html',
  styleUrls: ['./temp-db.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TempDBComponent implements OnInit {
  visualChart: VisualChart;
  items: MenuItem[];
  dataChart: ChartConfig[];
  dataTable: DBMonTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number = 0;
  enableChart :boolean = false;
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 
  timeRange: string = '';
  globalFilterFields: string[] = [];  
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;
  dataSubsciption: Subscription;
  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  title1:string = 'Temp DB Space Used';
  title2: string = 'Version Store Size Change'
  constructor(public dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private tempdbService: TempDBService) { }

  ngOnInit(): void {
    const me = this;
    if(me.dbmonService.databaseType ==1){
      me.title1 = 'Temp Files Count';
      me.title2 = 'Temp Files Size';
    }
    me.items = me.dbmonService.getSubMenus('TEMPDB');
    me.dbmonService.populateToggleIcons(me.items[0]);

    me.cols = me.dbmonService.loadTableHeaders('TEMPDB','TEMPUSAGE');
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
          title: me.title1,
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
            series: [] as Highcharts.SeriesOptionsType[],
          },
        },
        {
          title: me.title2,
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
            series: [] as Highcharts.SeriesOptionsType[]
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
    me.dataSubsciption = me.dbmonService.scheduleDataRequestObservable$.subscribe(
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
      me.schedulerService.unsubscribe('load-tempdbstats');
    }
    me.schedulerService.subscribe('load-tempdbstats', () => {
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
      me.tempdbService.getPresetAndLoad(payload).subscribe(
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
    me.enableChart = false;
      me.dataTable.data = state.data['sqlDBStatusDataDTO'];
      if(me.dataTable.data){
        me.totalRecords = me.dataTable.data.length;
      }
    if (state.data != null && state.data['arrStartAndEndTimeForTable'] != null && ['arrStartAndEndTimeForTable'] != undefined) {
      if (me.dbmonService.isRealTimeAppled) {
        me.timeRange = state.data['arrStartAndEndTimeForTable'][1];
      }
      else {
        me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1];
      }
    }
      if (state.data  && state.data['panelData']) {

        for(const [pIndex, panel] of  state.data['panelData'].entries()){
          if(panel == null){
          continue;
          }
          const newData:DashboardWidgetLoadRes = panel['dataResponseDTO'];

          //iteratting for multiple frequency graphs
          if(newData.grpData != null){
            let series = [];
          for (const [mIndex, mFreq] of newData.grpData.mFrequency.entries()) {
            if (mFreq.tsDetail.frequency < 0 || mFreq.tsDetail.st == 0) {
              // console.log("frequency is negative and start time is zero")
              continue;
            }
            //checking for negative frequency case
            me.dbmonService.avgCount = mFreq.avgCount;
            me.dbmonService.avgCounter = mFreq.avgCounter;
            let chartData = [];
            for (const [dIndex, data] of mFreq.data.entries()) {
              chartData = me.dbmonService.getTimedDataArrayTSDB(data.avg, mFreq.tsDetail);
              // me.dataChart[pIndex].highchart.series[dIndex]['data'] = chartData;
              // me.dataChart[pIndex].highchart.series[dIndex]['name'] = data.measure.metric;
              series.push({'data' : chartData, 'name': data.measure.metric});
              if(me.dbmonService.databaseType != 0){
                me.dataChart[dIndex].highchart['series']= series;
                series = [];
              }
            }
          }
          if(me.dbmonService.databaseType == 0){
            me.dataChart[pIndex].highchart['series']= series;
          }
        }
        }
    }
    setTimeout(() => {
      this.enableChart = true;
    }, 100);

  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-tempdbstats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
      }
  }
}
