import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { BUSINESS_PROCESS_TABLE } from './service/business-process.dummy';
import { BusinessProcessTable } from './service/business-process.model';

@Component({
  selector: 'app-business-process',
  templateUrl: './business-process.component.html',
  styleUrls: ['./business-process.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessProcessComponent implements OnInit {
  data: BusinessProcessTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  constructor() { }

  ngOnInit(): void {
    const me = this;
   
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];

    me.data = BUSINESS_PROCESS_TABLE;
    //this.totalRecords = me.data.data.length;

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
