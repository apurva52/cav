import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { STATE_DATA } from './service/state.dummy';
import { StateData } from './service/state.model';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StateComponent implements OnInit {
  loading: boolean;
  empty: boolean;
  error: AppError;
  data: StateData;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  totalRecords: any;

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = STATE_DATA;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];
    me.totalRecords = me.data.tableData.data.length;
    me.cols = me.data.tableData.headers[0].cols;
    for (const c of me.data.tableData.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
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
}
