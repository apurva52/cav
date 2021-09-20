import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CMON_VERSION_DATA } from './service/cmonVersion.dummy';

@Component({
  selector: 'app-cmon-version',
  templateUrl: './cmon-version.component.html',
  styleUrls: ['./cmon-version.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class CmonVersionComponent extends PageDialogComponent implements OnInit {

  showCmonVersionModel: boolean = false;
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

    me.data = CMON_VERSION_DATA;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  openCmonVersionDialog() {
    this.showCmonVersionModel = true;
  }

  close() {
    this.showCmonVersionModel = false;
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
