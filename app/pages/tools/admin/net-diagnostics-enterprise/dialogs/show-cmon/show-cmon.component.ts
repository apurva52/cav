import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { SHOW_CMON_DATA } from './service/showCmon.dummy';

@Component({
  selector: 'app-show-cmon',
  templateUrl: './show-cmon.component.html',
  styleUrls: ['./show-cmon.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ShowCmonComponent extends PageDialogComponent implements OnInit {

  showCmonModel: boolean = false;
  data: any;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  constructor() {
    super();
   }

  ngOnInit(): void {
    const me = this;

    me.data = SHOW_CMON_DATA;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  openShowCmonDialog() {
    this.showCmonModel = true;
  }

  close() {
    this.showCmonModel = false;
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

}
