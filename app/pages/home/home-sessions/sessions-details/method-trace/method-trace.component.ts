import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { METHOD_TRACE_TABLE, PANEL_DUMMY } from './service/method-trace.dummy';
import { methodTraceTable } from './service/method-trace.model';

@Component({
  selector: 'app-method-trace',
  templateUrl: './method-trace.component.html',
  styleUrls: ['./method-trace.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MethodTraceComponent implements OnInit {

  data: methodTraceTable;
  totalRecords: number;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  statCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  selectedRow: any;

  isEnabledColumnFilter: boolean = false;
  isEnabledColumnFilter1: boolean = false;
  isCheckbox: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  panel: any;

  constructor() { }

  ngOnInit(): void {

    const me = this;

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.panel = PANEL_DUMMY;

    me.data = METHOD_TRACE_TABLE;
    
    me.cols = me.data.methodCollectionTree.headers[0].cols;
    for (const c of me.data.methodCollectionTree.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.statCols = me.data.methodTimingTable.headers[0].cols;
      for (const c of me.data.methodTimingTable.headers[0].cols) {
        if (c.selected) {
          me._selectedStatColumns.push(c);
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

  @Input() get selectedStatColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedStatColumns;
  }

  set selectedStatColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedStatColumns = me.statCols.filter((col) => val.includes(col));
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

  toggleFilters2() {
    const me = this;
    me.isEnabledColumnFilter1 = !me.isEnabledColumnFilter1;
    if (me.isEnabledColumnFilter1 === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

}
