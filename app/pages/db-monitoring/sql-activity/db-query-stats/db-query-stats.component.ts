import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, MessageService } from 'primeng';
import { Subject, Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState } from 'src/app/shared/time-bar/service/time-bar.state';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable, DBMonTableHeader } from '../../services/dbmon-table.model';
import { DBQueryStatsParam} from './services/db-query-stats.model';
import { DbQueryStatsService } from './services/db-query-stats.service';

@Component({
  selector: 'app-db-query-stats',
  templateUrl: './db-query-stats.component.html',
  styleUrls: ['./db-query-stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DBQueryStatsComponent implements OnInit {

  dataTable: DBMonTable;
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
  selectedValue: string = 'sqlView';
  dataSubsciption: Subscription;
  timeRange: string = '';

  planJson: any;
  actualPlanJson: any;
  jsonView: any = '';

  constructor(private _dbQueryService: DbQueryStatsService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private messageService: MessageService,
    private dbmonService: DBMonitoringService) { }

    ngOnInit(): void {
      const me = this;
      
      me.cols = me.dbmonService.loadTableHeaders('ACTIVITY','DBQUERYSTATS');
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

  private scheduleLoad(){
    const me = this;
    if(me.schedulerService){
      me.schedulerService.unsubscribe('load-querystats');
    }
    me.schedulerService.subscribe('load-querystats', () => {
      if(me.dbmonService.isAnalysisMode){
        return;
      }
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
    const payload = {} as DBQueryStatsParam;
    me._dbQueryService.getPresetAndLoad(payload).subscribe(
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

    loadPlan(normMsSqlId, startOffset, endOffset, planHandle, lastExecutionTime, sqlQuery, databaseName){
      const me = this;
      const payload = {} as DBQueryStatsParam;
      payload.selectedSqlId = normMsSqlId;
      me._dbQueryService.selectedSqlId = normMsSqlId;
      payload.startOffset = startOffset;
      payload.endOffset = endOffset;
      payload.drillDownTime = lastExecutionTime;
      payload.query = sqlQuery;
      payload.databaseName = databaseName;
      me._dbQueryService.loadPlan(payload, planHandle).subscribe(
        (state: Store.State) => {          
          if (state instanceof DBMonitoringLoadedState) {
            me.onLoadedPlan(state);
            return;
          }
        });
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
      
      me.dataTable.data = state.data['sqlExecutorList'];
      if(me.dataTable.data && me.dataTable.data.length > 0){
        me.totalRecords = me.dataTable.data.length;
        me.onRowSelect(me.dataTable.data[0]);
      }else{
        me.dataTable.data = [];
      }
      if(me.dbmonService.isRealTimeAppled){
      me.timeRange = state.data['endDateTime'];
      }else{
        me.timeRange = state.data['startDateTime'] + ' to ' + state.data['endDateTime'];
      }
      // if (me.dataTable) {
      //   me.empty = !me.dataTable.data.length;
      // }
    // me.selectedUserOption = me.dataTable.options[0].label;
    // me.dataTable.headers[0].cols.forEach(c => me.globalFilterFields.push(c['valueField']));
    me.error = state.error;
    me.loading = false;
    
  }

  onLoadedPlan(state: DBMonitoringLoadedState){
    const me = this;
    me.planJson = state.data['planList'][0];
    if (this.dbmonService.$DataBaseType == 0) {
      me.actualPlanJson = state.data['planList'][1];
      if (me.actualPlanJson && me.actualPlanJson.length > 0) {
        me.actualPlanJson = JSON.parse(me.actualPlanJson);
        me.selectedValue = 'sqlView';
        setTimeout(() => {
          me.selectedValue = 'actualExecutionView';
        }, 100);
      }
    }
    if (me.planJson && me.planJson.length > 0) {
      me.planJson = JSON.parse(me.planJson);
      if (!me.actualPlanJson) {
        me.selectedValue = 'sqlView';
        setTimeout(() => {
          me.selectedValue = 'executionView';
        }, 100);
      }
    }
  }

  onRowSelect(event){
    const me = this;
    let planHandle = event.planHandle;
    if (event.planHandle == null){
      planHandle = event.sqlhandle;
    }
    let normMsSqlId = event.normmssqlid;
    let startOffset = event.startoffset;
    let endOffset = event.endoffset;
    let lastExecutionTime = event.lastexecutiontime;
    if (this.dbmonService.$DataBaseType == 3){
      lastExecutionTime = event.timestamp;
    }
    if(lastExecutionTime == null){
      lastExecutionTime = "null";
    }
    let databaseName = event.databasename;
    // this._tableDataProvider.isOpenFlowDiagram = true;
    // this._sqlDataRequestHandlerService.actualPlanDrawn = false;
    // this._sqlDataRequestHandlerService.estimatedPlanDrawn = false;
    let sqlQuery = event.sqlquery;
    me.jsonView = sqlQuery;
    if(sqlQuery && sqlQuery.endsWith("...")){
      let msg = {
        severity: 'info',
        summary: 'Selected query is truncated.',
        detail: 'Execution plan may not be available for the same'
      };
      if (document.getElementById('diagramContainer') != undefined) {
        document.getElementById('diagramContainer').innerHTML = 'Execution Plan not Available';
      }
      me.messageService.add(msg);
      return;
    }
    if(sessionStorage.getItem('sqlDataBaseType') == '2'){
      sqlQuery = encodeURIComponent(sqlQuery);
    }else{
      sqlQuery = '';
    }
    me.loadPlan(normMsSqlId, startOffset, endOffset, planHandle, lastExecutionTime, sqlQuery, databaseName);
  }

  /* Method to download the raw plan file.*/
  downloadSqlPlanXML() {
    const me = this;
    me._dbQueryService.downloadSqlPlanXML();
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-querystats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
    }
  }
  
  
}
