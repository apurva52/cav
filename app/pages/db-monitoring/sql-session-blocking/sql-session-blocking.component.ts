import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonTable, DBMonTableHeader } from '../services/dbmon-table.model';
import { DBMonCommonParam } from '../services/request-payload.model';
// import { BLOCKING_SESSION_TABLE } from './services/blocking-session.dummy';
// import { blockingSessionTable } from './services/blocking-session.model';
import { BlockingSessionService } from '../../db-monitoring/sql-activity/blocking-session/services/blocking-session.service';
import { SqlSessionService } from '../sql-activity/sql-sessions/sql-sessions.service';

@Component({
  selector: 'app-sql-session-blocking',
  templateUrl: './sql-session-blocking.component.html',
  styleUrls: ['./sql-session-blocking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SqlSessionBlockingComponent implements OnInit {
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
  constructor(private _blockingService: BlockingSessionService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private dbMonService: DBMonitoringService,
    private sqlSessionService: SqlSessionService) {
     }

  ngOnInit(): void {
    const me = this;
   
    me.cols = me.dbMonService.loadTableHeaders('ACTIVITY','BLOCKING');
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
      me.schedulerService.unsubscribe('load-blockingstats');
    }
    if(me.dbMonService.isAnalysisMode){
      return;
    }
    me.schedulerService.subscribe('load-blockingstats', () => {
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
    me._blockingService.getPresetAndLoad(payload).subscribe(
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
    
    if(state.data && state.data['msSqlBlockingStatusDTO']){
      me.dataTable.data = state.data['msSqlBlockingStatusDTO']['data'];
      if(me.dataTable.data){
        me.totalRecords = me.dataTable.data.length;
      }
    }
   
  me.error = state.error;
  me.loading = false;
   
}

ngOnDestroy() {
  const me = this;
  me.schedulerService.unsubscribe('load-blockingstats');
  if(me.dataSubsciption){
    me.dataSubsciption.unsubscribe();
    }
}

}
