import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TEST_REPORT_TABLE_DATA } from './service/test-report.dummy';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestReportComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];

  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  constructor(
    private router : Router
  ) {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Advanced' },
      { label: 'Design' },
      { label: 'Test Report' },
    ];

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.data = TEST_REPORT_TABLE_DATA;

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

  showTestCases(){
    this.router.navigate(['/test-cases']);
  }

}
