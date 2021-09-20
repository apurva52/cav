import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, Message } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { CustomQueryService } from './custom-query.service';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomQueryComponent implements OnInit {

  items: MenuItem[];

  dataTable: DBMonTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;
  noDataMsg = '';

  tableData = [];
  localArray = [];
  isPagination : boolean = false;
  lazy = false;
    /**message for severity */
    msgs: Message[] = [];
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
  private dataSubscription: Subscription;

  constructor(private dbMonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private customQueryService: CustomQueryService) { }
  ngOnInit(): void {

    const me = this;
    this.dataSubscription = me.customQueryService.receiveProvider$.subscribe(
      result => {
          console.log('Custom Query in not Proper ----->>', result);
          this.dataOfSelectedQuery(result);
      },
      err => {
        this.dataSubscription.unsubscribe();
      },
      () => {
        this.dataSubscription.unsubscribe();
      }
    );    
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
    
    // me.load();
    for (const c of me.cols) {
      me.globalFilterFields.push(c.field);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
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
    const payload = {} as DBMonCommonParam;
    if (!me.sessionSerivce.isActive()) {
      return;
    }
      me.customQueryService.load(payload,payload.query).subscribe(
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
    }
  }

  dataOfSelectedQuery(state) {
  
    if (state == undefined) {
      this.noDataMsg = 'No Record Found';
      this.dataTable.data = [];
      this.localArray = [];
      return;
    }

    if (state != null && state != undefined) {
      // console.log('data in the custom-query component ...............................', action.data);
      this.insertDataInTable(state);
    }
  }

  insertDataInTable(state) {
    this.dataTable.data = [];
    this.localArray = [];
    console.log('value in data --0', state[0]);


    for (let key in state[0]) {
      this.localArray.push({ 'header': key, 'field': key , 'title': key});
    }
    this.dataTable.data = state;
    if(state.length > 50){
      this.isPagination = true;
    } else {
      this.isPagination = false;
    }
  }
  
  exportExcel() {
    const me = this;
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(me.dataTable.data);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "customQueryOutput");
    });
}
saveAsExcelFile(buffer: any, fileName: string): void {
  import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  });
}
  ngOnDestroy() {
    const me = this;
  }
}
    
