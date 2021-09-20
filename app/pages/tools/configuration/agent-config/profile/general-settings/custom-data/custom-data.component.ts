import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CUSTOM_DATA_TABLE } from './service/custom-data-table.dummy';
import { customDataTable } from './service/custom-data.model';

@Component({
  selector: 'app-custom-data',
  templateUrl: './custom-data.component.html',
  styleUrls: ['./custom-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomDataComponent implements OnInit {

  data: customDataTable;
  totalRecords: number;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  sessionAttributeCols: TableHeaderColumn[] = [];
  httpRequestCols: TableHeaderColumn[] = [];
  httpResponseCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedsessionAttributeColumns: TableHeaderColumn[] = [];
  _selectedHttpRequestColumns: TableHeaderColumn[] = [];
  _selectedHttpResponseColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  isEnabledColumnFilter1: boolean = false;
  isEnabledColumnFilter2: boolean = false;
  isEnabledColumnFilter3: boolean = false;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  selectedValue: string = 'exact';
  selectedValue1: string = 'val2';

  constructor() { }

  ngOnInit(): void {

    const me = this;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.data = CUSTOM_DATA_TABLE;

    me.cols = me.data.method.headers[0].cols;
    for (const c of me.data.method.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.sessionAttributeCols = me.data.sessionAttribute.headers[0].cols;
    for (const c of me.data.sessionAttribute.headers[0].cols) {
      if (c.selected) {
        me._selectedsessionAttributeColumns.push(c);
      }
    }

    me.httpRequestCols = me.data.httpRequest.headers[0].cols;
    for (const c of me.data.httpRequest.headers[0].cols) {
      if (c.selected) {
        me._selectedHttpRequestColumns.push(c);
      }
    }

    me.httpResponseCols = me.data.httpResponse.headers[0].cols;
    for (const c of me.data.httpResponse.headers[0].cols) {
      if (c.selected) {
        me._selectedHttpResponseColumns.push(c);
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

  @Input() get selectedsessionAttributeColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedsessionAttributeColumns;
  }
  set selectedsessionAttributeColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedsessionAttributeColumns = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedHttpRequestColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedHttpRequestColumns;
  }
  set selectedHttpRequestColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedHttpRequestColumns = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedHttpResponseColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedHttpResponseColumns;
  }
  set selectedHttpResponseColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedHttpResponseColumns = me.cols.filter((col) => val.includes(col));
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

  toggleFilters3() {
    const me = this;
    me.isEnabledColumnFilter2 = !me.isEnabledColumnFilter2;
    if (me.isEnabledColumnFilter2 === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  toggleFilters4() {
    const me = this;
    me.isEnabledColumnFilter3 = !me.isEnabledColumnFilter3;
    if (me.isEnabledColumnFilter3 === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

}
