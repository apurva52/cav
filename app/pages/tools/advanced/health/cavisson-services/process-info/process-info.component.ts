import { Component, Input, OnInit } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PROCESS_INFO_TABLE_DATA } from './service/process-info.dummy';

@Component({
  selector: 'app-process-info',
  templateUrl: './process-info.component.html',
  styleUrls: ['./process-info.component.scss']
})
export class ProcessInfoComponent extends PageSidebarComponent implements OnInit {
  data: Table;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  classes = 'process-sidebar';
  constructor() {
    super();
  }

  ngOnInit(): void {
    const me  = this;
    me.data = PROCESS_INFO_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
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

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }

}
