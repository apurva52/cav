import { Component, Input, OnInit } from '@angular/core';
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
import { DeadlockSessionService } from './deadlock.service';

@Component({
  selector: 'app-deadlocks',
  templateUrl: './deadlocks.component.html',
  styleUrls: ['./deadlocks.component.scss']
})
export class DeadlocksComponent implements OnInit {
    downloadOptions: MenuItem[];
    items: MenuItem[];
    dataTable: DBMonTable;
    dataChart: any;
    // data: blockingSessionTable;
    error: AppError;
    loading: boolean;
    empty: boolean;
    emptyTable: boolean;
    totalRecords: number = 0;
    timeRange: string = '';
    cols: TableHeaderColumn[] = []; 
    _selectedColumns: TableHeaderColumn[] = []; 
  
    globalFilterFields: string[] = [];  
    selectedRow: any;
    isShow: boolean = false;
    inputValue: any;
    isCheckbox: boolean;
    isShowColumnFilter: boolean = false;
    finalValue: any;
    enableChart:boolean = false;
    dataSubsciption: Subscription;
    isEnabledColumnFilter: boolean = false;  
    filterTitle: string = 'Enable Filters';
    constructor(private deadlockService: DeadlockSessionService,
      private schedulerService: SchedulerService,
      private sessionSerivce: SessionService,
      private dbMonService: DBMonitoringService) {
       }
  
    ngOnInit(): void {
      const me = this;
     
      me.cols = me.dbMonService.loadTableHeaders('ACTIVITY','DEADLOCK');
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
        data:[],
        tableFilter: true,
      };
      me.dataChart = [
        {
          title: 'Graphical Representation of Blocked Process',
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
        me.schedulerService.unsubscribe('load-deadlockstats');
      }
      if(me.dbMonService.isAnalysisMode){
        return;
      }
      me.schedulerService.subscribe('load-deadlockstats', () => {
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
      me.deadlockService.getPresetAndLoad().subscribe(
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
      
      me.dataTable.data = state.data['msSQLDeadlock'];
      me.enableChart = false;
      if(me.dbMonService.isRealTimeAppled){
      me.timeRange = state.data['endDateTime'];
      }else{
        me.timeRange = state.data['startDateTime'] + ' to ' + state.data['endDateTime'];
      }
      if(me.dataTable.data){
        me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
      
    me.error = state.error;
    me.loading = false;
     
  }
  
  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-deadlockstats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
      }
  }
  
}
