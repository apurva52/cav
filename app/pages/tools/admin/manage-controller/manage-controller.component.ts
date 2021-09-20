import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MANAGE_CONTROLLER_TABLE, RECORDER_PORT_TABLE, SERVICE_PORT_TABLE } from './service/manage-controller.dummy';

@Component({
  selector: 'app-manage-controller',
  templateUrl: './manage-controller.component.html',
  styleUrls: ['./manage-controller.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageControllerComponent implements OnInit {

  manageTableData: Table;
  serviceTableData: Table;
  recordedTableData: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';

  constructor(private router : Router) { }

  ngOnInit(): void {
    const me = this;

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.manageTableData = MANAGE_CONTROLLER_TABLE;

    me.serviceTableData = SERVICE_PORT_TABLE;

    me.recordedTableData = RECORDER_PORT_TABLE;

    me.cols = me.manageTableData.headers[0].cols;
    for (const c of me.manageTableData.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

  }

  addNewController(){
    const me = this;
    me.router.navigate(['/new-controller']);
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
