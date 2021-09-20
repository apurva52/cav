import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { EventEmitter } from '@angular/core';
import { SessionStatComponent } from '../../session-stats/session-stats.component';
import { SqlSessionService } from './sql-sessions.service';
import { DBQueryStatsParam } from '../db-query-stats/services/db-query-stats.model';
import { SessionStatService } from '../../session-stats/session-stats.service';

@Component({
  selector: 'app-sql-sessions',
  templateUrl: './sql-sessions.component.html',
  styleUrls: ['./sql-sessions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SqlSessionsComponent implements OnInit {

  @ViewChild('sessionStats')
  sessionStats : SessionStatComponent;
  dataTable: DBMonTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  downloadOptions: MenuItem[];
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 
  items: MenuItem[];
  isVisible: boolean = true;
  isOpen: boolean = false;
  sessionId:string;
  isTempDb:boolean;
  isLockStats:boolean;
  isBlockStats:boolean;
  isBatchJob:boolean;
  globalFilterFields: string[] = [];  
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;
  rowData:any;
  activeItem:MenuItem;
  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  enableTableData :boolean = false;
  
  constructor( public dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SqlSessionService,
    private sessionStatService:SessionStatService
   ) { }
    
    ngOnInit(): void {
      const me = this;
      
      // me.items = [
      //   {label: 'Temp DB', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/temp-db'},
      //   {label: 'Blocking Sessions', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/blocking-session'},
      //   {label: 'Locks', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/locks'},
      //   {label: 'Wait Stats', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/wait-statistics/session-stats'},
      //   // {label: 'Sessions Stats', icon: 'icons8 icons8-forward', routerLink: ''},
      //   // {label: 'SQL Plan', icon: 'icons8 icons8-forward', routerLink: ''},
      //   // {label: 'SQL Query', icon: 'icons8 icons8-forward', routerLink: ''},
      //   {label: 'Batch Jobs', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/support-services/batch-jobs'}
      // ];
      me.items = [

        {label: 'Session Wait Stats', icon: 'icons8 icons8-forward',id: '0'},
        {label: 'Blocking Stats', icon: 'icons8 icons8-forward',id: '1'},
        {label: 'Locks Stats', icon: 'icons8 icons8-forward',id: '2'},
        {label: 'Temp DB', icon: 'icons8 icons8-forward',id: '3'},
        {label: 'Batch Job', icon: 'icons8 icons8-forward',id: '4'}


      ]
    
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
  }

  closeSidePanel(){
    const me = this;
    me.isVisible = false;
  }
  openSidePanel() {
    const me = this;
    me.isVisible = true;
  }
  openBottomPanel() {
    const me = this;
    me.isOpen = true;
  }

  openSessionStats(){
    const me = this;
    me.isVisible = true;
    me.isOpen = true;
    me.openTab(me.items[0]);
    
  }
  openTab(activeItem) {
    const me = this;
    console.log('value of activeItem', activeItem);
    me.activeItem = activeItem;
    
  }
  showAllSessions(val){
    const me = this;
    const payload = {} as DBQueryStatsParam;
    me.sessionStatService.getPresetAndLoad(payload);
    me.sessionStatService.showAllSessions(val);
   
  }
  }
