import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AUTO_INSTRUMENT_TABLE } from './service/auto-instrument.dummy';
import { AutoInstrumentTable } from './service/auto-instrument.model';

@Component({
  selector: 'app-auto-instrument',
  templateUrl: './auto-instrument.component.html',
  styleUrls: ['./auto-instrument.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutoInstrumentComponent implements OnInit {

  data: AutoInstrumentTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  statCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];

  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;
  isEnabledColumnFilter1: boolean = false;
  filterTitle: string = 'Enable Filters';

  constructor() { }

  ngOnInit(): void {
    const me = this;   

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.data = AUTO_INSTRUMENT_TABLE;
    
    me.cols = me.data.activeInstrumentationTable.headers[0].cols;
    for (const c of me.data.activeInstrumentationTable.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.statCols = me.data.autoInstrumentationTable.headers[0].cols;
      for (const c of me.data.autoInstrumentationTable.headers[0].cols) {
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

}
