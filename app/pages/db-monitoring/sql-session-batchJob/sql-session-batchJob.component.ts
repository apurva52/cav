import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonTable } from '../services/dbmon-table.model';
import { DBMonCommonParam } from '../services/request-payload.model';
import { SqlSessionService } from '../sql-activity/sql-sessions/sql-sessions.service';
import { BatchService } from '../support-services/batch-jobs/batch-jobs.service';


@Component({
  selector: 'app-sql-session-batchJob',
  templateUrl: './sql-session-batchJob.component.html',
  styleUrls: ['./sql-session-batchJob.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SqlSessionBatchJobsComponent implements OnInit {

  dataTable: DBMonTable;
  historyDataTable: DBMonTable;
  dataChart: any;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  errorHistory: AppError;
  loadingHistory: boolean;
  emptyHistoryTable: boolean;
  totalRecords: number = 0;
  totalRecordsHistory: number = 0;
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = [];
  
  colsHistory: TableHeaderColumn[] = []; 
  _selectedColumnsHistory: TableHeaderColumn[] = []; 

  globalFilterFields: string[] = []; 
  globalFilterFieldsHistory: string[] = []; 
  dataSubsciption: Subscription;
  isShow: boolean = false;   
  isShowColumnFilter: boolean = false;
  isShowColumnFilterHistory: boolean = false;
  finalValue: any;
  arrWeek: string[];
  selectedInterval: string;
  selectedJobId: string;

  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  enableChart: boolean = false;

  constructor(private dbMonService: DBMonitoringService,
    private sessionSerivce: SessionService,
    private schedulerService: SchedulerService,
    private batchService: BatchService,
    private sqlSessionService: SqlSessionService) { }

  ngOnInit(): void {
    const me = this;

    me.cols = me.dbMonService.loadTableHeaders('SERVICES','BATCH');
    me.colsHistory = me.dbMonService.loadTableHeaders('SERVICES','BATCHHIS');
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
    me.historyDataTable = {
      paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 30, 50, 100],
      },
      headers: [
        {
          cols: me.colsHistory,
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
  for (const c of me.colsHistory) {
    me.globalFilterFieldsHistory.push(c.field);
    if (c.selected) {
      me._selectedColumnsHistory.push(c);
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

private scheduleLoad(){
  const me = this;
  if(me.schedulerService){
    me.schedulerService.unsubscribe('load-batchjobstats');
  }
  if(me.dbMonService.isAnalysisMode){
    return;
  }
  me.schedulerService.subscribe('load-batchjobstats', () => {
    me.load();
  }, 'progressInterval');
}

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedColumnsHistory(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumnsHistory;
  }

  set selectedColumnsHistory(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumnsHistory = me.colsHistory.filter((col) => val.includes(col));
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
     payload.drilldownSessionId = Number(me.sqlSessionService.spid);
      me.batchService.getPresetAndLoad(payload).subscribe(
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
      me.emptyTable = false;
      me.loading = true;
    }
  
    private onLoadingError(state: DBMonitoringLoadingErrorState) {
      const me = this;
      //me.dataTable.data = null;
      me.error = state.error;
      me.emptyTable = false;
      me.loading = false;
    }

  private onLoaded(state: DBMonitoringLoadedState) {
    const me = this;

    me.dataTable.data = state.data['msSqlJobStats'];
    if (me.dataTable.data) {
      me.totalRecords = me.dataTable.data.length;
    }
    me.arrWeek = state.data['arrWeek'];
    me.selectedInterval = me.arrWeek[0];
    me.selectedJobId = me.dataTable.data[0]['jobId'];
    let data = {'jobId': me.selectedJobId}; 
    me.getJobHistoryData(data);
    me.error = state.error;
    me.loading = false;
  }

    public onIntervalChange(event){
      const me = this;
      me.selectedInterval = event.target.innerText;
      let data = {'jobId': me.selectedJobId}; 
      me.getJobHistoryData(data);
    }

    getJobHistoryData(data) {
      const me = this;
      me.selectedJobId = data.jobId;
      me.batchService.loadHistory(me.selectedJobId, me.selectedInterval).subscribe(
        (state: Store.State) => {
          if (state instanceof DBMonitoringLoadedState) {
            me.onHistoryLoaded(state);
            return;
          }
        }
        );
  }

  private onHistoryLoaded(state: DBMonitoringLoadedState) {
    const me = this;

    me.historyDataTable.data = state.data['msSqlJobHistoryStats'];
    if (me.historyDataTable.data) {
      me.totalRecordsHistory = me.historyDataTable.data.length;
    }
    me.enableChart = false;
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
    me.errorHistory = state.error;
    me.loadingHistory = false;
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-batchjobstats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
      }
  }
}
