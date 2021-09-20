import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonTable } from '../services/dbmon-table.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SessionStatService } from './session-stats.service';
import { EventEmitter } from '@angular/core';
import { SqlSessionService } from '../sql-activity/sql-sessions/sql-sessions.service';
import { Subscription } from 'rxjs';
import { DBMonCommonParam } from '../services/request-payload.model';

@Component({
  selector: 'app-session-stats',
  templateUrl: './session-stats.component.html',
  styleUrls: ['./session-stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SessionStatComponent implements OnInit {

  @Input() showFilter = true;
  dataTable: DBMonTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number = 0;
  downloadOptions: MenuItem[];
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 
  items: MenuItem[];
  isVisible: boolean = true;
  isOpen: boolean = false;
  dataSubsciption: Subscription;

  globalFilterFields: string[] = [];  
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;
  timeRange: string = '';
  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  @Output()   spidSessionStats= new EventEmitter<string>();
  spid: string;

  constructor( public dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private sqlSessionService: SessionStatService,
    private sessionStatsParent: SqlSessionService ) { }
    
    ngOnInit(): void {
      const me = this;
      let chkSubscribe =  this.dbmonService.scheduleDataRequestObservable$.subscribe(
        result => {
        me.dataTable.data = [];
        }, 
        error => {
          chkSubscribe.unsubscribe();
          console.error('error in getting  table data-- ', error);
        }, 
        () => {
          chkSubscribe.unsubscribe();
          console.log('getting  table data');
        }
      );
    me.cols = me.dbmonService.loadTableHeaders('ACTIVITY','SESSION');
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
    me.dbmonService.scheduleDataRequestObservable$.subscribe(
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
      me.schedulerService.unsubscribe('load-sessionstats');
    }
    me.schedulerService.subscribe('load-sessionstats', () => {
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
  payload.drilldownSessionId = Number(me.sessionStatsParent.spid);
   
      me.sqlSessionService.getPresetAndLoad(payload).subscribe(
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
      
      me.dataTable.data = state.data['session'];
      if(me.dataTable.data){
        me.totalRecords = me.dataTable.data.length;
      }else{
        me.dataTable.data = [];
      }
      if (state.data['startDateTime'] && state.data['endDateTime'] && state.data['startDateTime'] != null && state.data['endDateTime'] != null) {
        if(me.dbmonService.isRealTimeAppled){
           me.timeRange = state.data['endDateTime']; 
        }
        else{
          me.timeRange = state.data['startDateTime'] + ' to ' + state.data['endDateTime']; 
        }
        }
  }

  openSessionDetail(row){
    const me = this;
    me.sessionStatsParent.spid = row.sessionID;
    console.log('spid value before emit ',me.sessionStatsParent.spid);
    me.spidSessionStats.emit();
    console.log('spid value after emit ',me.sessionStatsParent.spid);
console.log('value of row', row);
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-sessionstats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
      }
    me.sessionStatsParent.spid = '-1';
  }

  }