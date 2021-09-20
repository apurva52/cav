import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { ConnectionStatsService } from './connection-stats.service';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { DashboardWidgetLoadRes, GraphDataCTXSubject } from 'src/app/shared/dashboard/service/dashboard.model';
import { state } from '@angular/animations';
import { DBMonCommonParam } from '../../services/request-payload.model';

@Component({
  selector: 'app-connection-stats',
  templateUrl: './connection-stats.component.html',
  styleUrls: ['./connection-stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectionStatsComponent implements OnInit {

  dataTable: DBMonTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  downloadOptions: MenuItem[];
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 
  dataChart: ChartConfig[];
  enableChart :boolean = false;
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
  timeRange: string = '';

  constructor(private connStatsService: ConnectionStatsService  ,
    public dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService) { }

  ngOnInit(): void {
    const me = this;
    
    me.cols = me.dbmonService.loadTableHeaders('SERVERSTATS','CONNECTIONSTATS');
    
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
        title: 'Active Connections',
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
              events: {
                click: function (event) {
                   let ddrTime = event['point']['category'];
     
                  
                   let dbName = this.name;
                   me.connStatsService.loadConnectionTable(ddrTime,dbName);
                   
               } 
              }
            }
          },
          credits: {
            enabled: false,
          },
          series: [] as Highcharts.SeriesOptionsType[],
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
    me.loadTableData();
  }

  ngAfterViewInit() {
    const me = this;
    me.scheduleLoad();
  }

  private scheduleLoad(){
    const me = this;
    if(me.schedulerService){
      me.schedulerService.unsubscribe('load-connectionstats');
    }
    me.schedulerService.subscribe('load-connectionstats', () => {
      me.load();
    }, 'progressInterval');
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
      me.connStatsService.getPresetAndLoad().subscribe(
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
    me.connStatsService.loadConnectionTable('','');
    
    }

    loadTableData() {
      const me = this;
      if (!me.sessionSerivce.isActive()) {
        return;
      }
        me.connStatsService.loadConnectionTable('','').subscribe(
        (state: Store.State) => {
          if (state instanceof DBMonitoringLoadedState) {
            me.onLoadedTableData(state);
            return;
          }
        },
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
      
      
      if (state.data  && state.data['panelData']) {
        let panel = state.data['panelData'];
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
              series.push({'data' : chartData, 'name': me.getDbName(data.subject)});
            }
          }
          me.dataChart[0].highchart['series']= series;
        }
    }
    setTimeout(() => {
      this.enableChart = true;
    }, 100);

  }


  onLoadedTableData(state: DBMonitoringLoadedState){
    const me = this;
    me.dataTable.data = state.data['connectionLoginDetailList'];
    if (state.data['arrStartAndEndTimeForTable'][1] && state.data['arrStartAndEndTimeForTable'][0] && state.data['arrStartAndEndTimeForTable'][1] != null && state.data['arrStartAndEndTimeForTable'][0] != null) {
      if(me.dbmonService.isRealTimeAppled){
      me.timeRange = state.data['arrStartAndEndTimeForTable'][1];
      }else{
      me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1];
      }
       }

    if(me.dataTable.data){
      me.totalRecords = me.dataTable.data.length;
    }
    else{
      me.dataTable.data = [];
    }
    
  }

  getDbName(subject: GraphDataCTXSubject){
   var sName = subject.tags[0].sName;
   var dName = sName.split('>')[3];
    return dName;
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-connectionstats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
      }
  }
}
