import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonTable } from '../services/dbmon-table.model';
import { DATABASE_CHART, DATABASE_TABLE, FILE_SIZE_USED_CHART } from './service/database-table.dummy';
import { DatabaseStatsService } from './service/database.service';
import { DBMonCommonParam } from '../services/request-payload.model';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatabaseComponent implements OnInit {

  dataTable: DBMonTable;
  error: AppError;
  dataCharts: ChartConfig[];
  items: MenuItem[];
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
  dataSubscription: Subscription;
  enableChart :boolean = false;


  constructor( public dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private databaseStatsService: DatabaseStatsService) { }

  ngOnInit(): void {

    const me = this;

    me.items = me.dbmonService.getSubMenus('DATABASE');
    me.dbmonService.populateToggleIcons(me.items[0]);

    me.cols = me.dbmonService.loadTableHeaders('DATABASE','DATABASELOGS');
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
      me.dataCharts = [
        {
          title: 'File Size Used (%)',
          highchart: {
            chart: {
              height: '200px',
            },
            title: {
              text: null,
            },
            legend: {
              enabled: true,
              align: 'right',
              verticalAlign: 'middle',
              x: 0,
              y: 0,
              layout: 'vertical',
              itemStyle: {
                width: 70,
                color: '#333333',
                fontFamily: 'Product Sans',
                fontSize: '11px',
              },
            },
            xAxis: {
              type: 'datetime'
              // allowDecimals: true,
              // categories: ['15.00', '15.10', '15.20', '15.30', '15.40', '15.50']
            },
            yAxis: {
              title: {
                text: '',
              },
            },
            tooltip: {
              formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                  this.x + ': ' + this.y;
              }
            },
            plotOptions: {
              area: {
                fillOpacity: 0.5
              }
            },
            series: [] as Highcharts.SeriesOptionsType[],
            credits: {
              enabled: false,
            },
          },
        },
        {
          title: 'File Size (MB)',
          highchart: {
            chart: {
              type: 'bar',
              height: '200px'
            },
    
            title: {
              text: null,
            },
    
            xAxis: {
              categories: []
            },
            yAxis: {
              min: 0,
              title: {
                text: ''
              }
            },
            tooltip: {
              pointFormat:
                '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
            },
            plotOptions: {
              series: {
                stacking: 'normal'
              }
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              enabled: true,
              verticalAlign: 'middle',
              x: 0,
              y: 0,
            },
            series: [] as Highcharts.SeriesOptionsType[],
            credits: {
              enabled: false,
            },
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
   me.dataSubscription =  me.dbmonService.scheduleDataRequestObservable$.subscribe(
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
      me.schedulerService.unsubscribe('load-databasestats');
    }
    me.schedulerService.subscribe('load-databasestats', () => {
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
      me.databaseStatsService.getPresetAndLoad(payload).subscribe(
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
        
      me.dataTable.data = state.data['sqlDBStatusDataDTO'];
      let dbSpaceGraph = state.data['dbSpaceGraph'];
      let dbUsedPercent = state.data['dbUsedPercent'];
      let arrTimeStamp = state.data['arrTimeStamp'];
      me.enableChart = false;
      if (state.data !=null && state.data['arrStartAndEndTimeForDB'] != null && state.data['arrStartAndEndTimeForDB'][1] && state.data['arrStartAndEndTimeForDB'][2] && state.data['arrStartAndEndTimeForDB'][1] != null && state.data['arrStartAndEndTimeForDB'][2] != null) {
        if(!me.dbmonService.isRealTimeAppled){
          me.timeRange = state.data['arrStartAndEndTimeForDB'][2];
        }
        else{
        me.timeRange = state.data['arrStartAndEndTimeForDB'][2] + ' to ' + state.data['arrStartAndEndTimeForDB'][1];
        }
         }		
      for(const key in dbUsedPercent) {
        if (dbUsedPercent.hasOwnProperty(key)) {
          const value = dbUsedPercent[key];
          me.dataCharts[0].highchart.series.push(
            {
              name: key,
              type: 'area',
              data: me.dbmonService.getTimedDataArray(arrTimeStamp, value)
            }
          )
        }
      }
      let freeMbDataArray=[];
      let usedMbDataArray=[];
      for(const key in dbSpaceGraph) {
        if (dbSpaceGraph.hasOwnProperty(key)) {
          const value = dbSpaceGraph[key];
          freeMbDataArray.push(value['Free']);
          usedMbDataArray.push(value['Used']);
          me.dataCharts[1].highchart.xAxis['categories'].push(key);
        }
        me.dataCharts[1].highchart.series = [{
          name: 'Free MB',
          data: freeMbDataArray
        }, {
          name: 'Used MB',
          data: usedMbDataArray
        }] as Highcharts.SeriesOptionsType[];
        setTimeout(() => {
          this.enableChart = true;
        }, 100);
    }
        if(me.dataTable.data){
          me.totalRecords = me.dataTable.data.length;
        }else{
          me.dataTable.data = [];
        }
      }

    ngOnDestroy() {
      const me = this;
      me.schedulerService.unsubscribe('load-databasestats');
      me.dataSubscription.unsubscribe();
    }
}
  

