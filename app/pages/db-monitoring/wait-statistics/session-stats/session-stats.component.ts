import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { SessionStatsService } from './session-stats.service';

@Component({
  selector: 'app-session-stats',
  templateUrl: './session-stats.component.html',
  styleUrls: ['./session-stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SessionStatsComponent implements OnInit {

  dataTable: DBMonTable;
  dataChart: any;
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
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';

  constructor(private sessionStatsService: SessionStatsService  ,
    private dbmonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService) { }

  ngOnInit(): void {
    const me = this;
    me.cols = me.dbmonService.loadTableHeaders('WAIT','SESSIONWAITSTATS');
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

  private scheduleLoad(){
    const me = this;
    if(me.schedulerService){
      me.schedulerService.unsubscribe('load-sessionwaittats');
    }
    me.schedulerService.subscribe('load-sessionwaittats', () => {
      me.load();
    }, 'progressInterval');
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
      me.sessionStatsService.getPresetAndLoad().subscribe(
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
      
    me.dataTable.data = state.data['sessionWaitStatsDTO'][''];
    me.dataChart = state.data['waitTimeWithTime'];
    if(me.dataTable.data){
      me.totalRecords = me.dataTable.data.length;
    }
  }
}
