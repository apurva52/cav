import { Component, OnInit, Input } from '@angular/core';
import { TableBoxTable } from './service/table-box.model';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TableBoxService } from './service/table-box.service';
import { Store } from 'src/app/core/store/store';
import { TableBoxLoadingState, TableBoxLoadedState, TableBoxLoadingErrorState } from './service/table-box.state';
import { LazyLoadEvent } from 'primeng';

@Component({
  selector: 'app-table-box',
  templateUrl: './table-box.component.html',
  styleUrls: ['./table-box.component.scss']
})
export class TableBoxComponent implements OnInit {

  @Input('aggIpInfo') aggIpInfo:any[];

  data: TableBoxTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  displayBasicOpen: boolean = false;

  tableData = [];
  totalRecords = 0;
  queryName: String;
  ipName: String;
  selectedFilter = "Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All";
  cols: TableHeaderColumn[];
  _selectedColumns: TableHeaderColumn[]; //p-multiselect 

  constructor(private tableBoxService: TableBoxService) { }

  ngOnInit(): void {
    const me = this;
    me.load();
  }

  showBasicDialogOpen() {
    this.displayBasicOpen = true;
  }

  load() {
    const me = this;
    me.tableBoxService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof TableBoxLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TableBoxLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TableBoxLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;

    if (field === 'sourceNW' || field === 'destNW') {
      if (Number(rowA[field]) > Number(rowB[field])) return 1;
      else return -1;
    }
    else if (field === 'endTime') {
      if (parseFloat(rowA[field]) > parseFloat(rowB[field])) return 1;
      else return -1;
    }
    else if (field === 'startTime') {
      if (Date.parse(rowA[field]) > Date.parse(rowB[field])) return 1;
      else return -1;
    }
    else {
      return rowA[field].localeCompare(rowB[field]);
    }
  }

  private onLoading(state: TableBoxLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TableBoxLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: TableBoxLoadedState) {
    const me = this;
    me.data = me.aggIpInfo[0];
    me.ipName = me.aggIpInfo[1];
    me.error = null;
    me.loading = false;
    console.log("table box data---------",me.data);
    me.cols = me.data.headers[0].cols;
    me._selectedColumns = me.cols;
    for (let i = 0; i < me.data.data.length; i++) {
      // this.totalRecords+=Number(me.data.data[i]['count']);
      if(i == 0){
        this.queryName = me.data.data[i]['queries'];
      }
    }
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  showRowInfo(RowData){
    this.queryName = RowData.queries;
  }


// need to confirm
  loadPagination(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.data) {
        for (let i = 0; i <= this.tableData.length; i++) {
            this.tableData = this.data.data.slice(event.first, (event.first + event.rows));
          
        }
        this.data.data.sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
        );
        this.loading = false;
      }
    }, 1000);
  }
}
