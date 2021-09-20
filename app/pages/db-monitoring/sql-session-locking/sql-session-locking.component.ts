import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonTable } from '../services/dbmon-table.model';
import { LockService } from '../../db-monitoring/sql-activity/locks/lock.service';
import { LOCKS_TABLE } from '../../db-monitoring/sql-activity/locks/service/locks-table.dummy';
import { DBMonCommonParam } from '../services/request-payload.model';
import { SqlSessionService } from '../sql-activity/sql-sessions/sql-sessions.service';

@Component({
  selector: 'app-sql-session-locking',
  templateUrl: './sql-session-locking.component.html',
  styleUrls: ['./sql-session-locking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SqlSessionLockComponent implements OnInit {

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

  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  dataSubsciption: Subscription;
  enableChart :boolean = false;

  constructor(private _lockService: LockService  ,
    private dbMonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private sqlSessionService: SqlSessionService) { }

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
      payload.drilldownSessionId = Number(me.sqlSessionService.spid);
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
    if (me.dataTable.data) {
      me.totalRecords = me.dataTable.data.length;
    }
    
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
