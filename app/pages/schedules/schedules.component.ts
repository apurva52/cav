import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { SCHEDULES_TABLE } from './service/schedules.dummy';
import {
  // SchedulesHeaderCols,
  SchedulesTable,
  Session,
  User,
} from './service/schedules.model';
import { SchedulesHeaderCols } from '../my-library/reports/schedules/service/schedules.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class SchedulesComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  session: Session[];
  users: User[];
  selectedSession: Session;
  selectedUser: User;
  allUser: MenuItem[];
  allSelectedUser: MenuItem;
  groupBy: MenuItem[];
  selectedGroupBy: MenuItem;

  data: SchedulesTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: SchedulesHeaderCols[] = [];
  _selectedColumns: SchedulesHeaderCols[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  flowPathData = [];
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';

  rowGroupMetadata: any;

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Schedules' },
    ];

    me.session = [
      { label: 'New York', time: '31/12/2020 11:59:00' },
      { label: 'Rome', time: '31/12/2020 11:59:00' },
      { label: 'London', time: '31/12/2020 11:59:00' },
      { label: 'Istanbul', time: '31/12/2020 11:59:00' },
      { label: 'Paris', time: '31/12/2020 11:59:00' },
    ];

    me.users = [
      {
        label: 'User1',
        time: '31/12/2020 11:59:00',
        icon: 'icons8 icons8-user',
      },
      {
        label: 'User1',
        time: '31/12/2020 11:59:00',
        icon: 'icons8 icons8-user',
      },
      {
        label: 'User1',
        time: '31/12/2020 11:59:00',
        icon: 'icons8 icons8-user',
      },
      {
        label: 'User1',
        time: '31/12/2020 11:59:00',
        icon: 'icons8 icons8-user',
      },
      {
        label: 'User1',
        time: '31/12/2020 11:59:00',
        icon: 'icons8 icons8-user',
      },
    ];

    me.allUser = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];

    me.groupBy = [
      { label: 'NONE' },
      { label: 'NONE' },
      { label: 'NONE' },
      { label: 'NONE' },
      { label: 'NONE' },
    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];

    me.data = SCHEDULES_TABLE;
    me.updateRowGroupMetaData();

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {

    this.rowGroupMetadata = {};

    if (this.data.data) {
     
      for (let i = 0; i < this.data.data.length; i++) {
        let rowData = this.data.data[i];
       
        let groupData = rowData.groupData.name;

        if (i == 0) {
          this.rowGroupMetadata[groupData] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.data.data[i - 1];
          let previousRowGroup = previousRowData.groupData.name;         
          if (groupData === previousRowGroup)
            this.rowGroupMetadata[groupData].size++;
          else
            this.rowGroupMetadata[groupData] = { index: i, size: 1 };
        }
      }
    }
  }

  openFilter() {}

  @Input() get selectedColumns(): SchedulesHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: SchedulesHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
}
