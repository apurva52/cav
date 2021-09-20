import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TEST_REPORT_TABLE_DATA } from '../../design/test-report/service/test-report.dummy';
import { ONGOING_TEST_TABLE_DATA } from './service/ongoing-test.dummy';

@Component({
  selector: 'app-ongoing-test',
  templateUrl: './ongoing-test.component.html',
  styleUrls: ['./ongoing-test.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OngoingTestComponent implements OnInit {
  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  isShowColumnFilter: boolean = false;
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = ONGOING_TEST_TABLE_DATA;
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
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
}
