import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { DBQueryLogService } from './service/db-query-log.service';
import { DB_QUERY_LOGS_TABLE } from './service/db-query-logs.dummy';

@Component({
  selector: 'app-db-query-logs',
  templateUrl: './db-query-logs.component.html',
  styleUrls: ['./db-query-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DbQueryLogsComponent implements OnInit {

  items: MenuItem[];

  dataTable: DBMonTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  isShowColumnFilter: boolean = false;
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  dataSubsciption: Subscription;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  constructor(private dbQueryLogService: DBQueryLogService  ,
    private dbMonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService) { }
  ngOnInit(): void {

    const me = this;
    me.cols = me.dbMonService.loadTableHeaders('CONFIG','QUERYLOGS');
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
      me.schedulerService.unsubscribe('load-dbquerylog');
    }
    if(me.dbMonService.isAnalysisMode){
      return;
    }
    me.schedulerService.subscribe('load-dbquerylog', () => {
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
      me.dbQueryLogService.getPresetAndLoad().subscribe(
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
    me.dataTable.data = state.data as any[];
    if(me.dataTable.data){
      me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
  }

// Making custom function for sorting numbers, dates and strings
customSort(event) {
  event.data.sort((data1, data2) => {
    let value1 = data1[event.field];
    let value2 = data2[event.field];
    let result = null;
    
    // Sorting null values
    if (value1 == null && value2 != null)
      result = -1;
    else if (value1 != null && value2 == null)
      result = 1;
    else if (value1 == null && value2 == null)
      result = 0;
      else if (event['field'] == 'executionTime') {
       let  newarr1 = data1[event.field].split("ms");
        let newarr2 = data2[event.field].split("ms");
        value1 = Number(newarr1[0]);
        value2 = Number(newarr2[0]);      
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
     } 

      //Checking fields individually for their type and sort data accordingly.
    else  if (event['field'] == 'timestamp' || event['field'] == 'dbName' || event['field'] == 'className' || event['field'] == 'methodName' || event['field'] == 'query') 
      //for string type fields
        result = value1.localeCompare(value2);
    else
         {result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;}
    return (event.order * result);
  });
}


  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-dbquerylog');
    me.dataSubsciption.unsubscribe();
  }
}
