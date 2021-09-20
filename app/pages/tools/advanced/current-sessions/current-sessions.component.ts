import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SESSION_TABLE_DATA } from './service/sessions.dummy';
import { SessionHeaderCols, SessionTable } from './service/sessions.model';

@Component({
  selector: 'app-current-sessions',
  templateUrl: './current-sessions.component.html',
  styleUrls: ['./current-sessions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CurrentSessionsComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: SessionTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: SessionHeaderCols[] = [];
  _selectedColumns: SessionHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  reportsMenu: MenuItem[];;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Advance' },
      { label: 'Current Sessions' },
    ];
    me.reportsMenu = [
      {
        label: 'Test Initialization Screen',
        routerLink: ['/test-initialisation'],
      },
      {
        label: 'Web DDR',
        routerLink: ['/view-partition'],
      },
    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.options = [
      { label: 'All' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];
    me.options1 = [
      { label: 'Last 4 Hours' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];
    me.options2 = [
      { label: 'Last 4 Hours' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];
    me.data = SESSION_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): SessionHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: SessionHeaderCols[]) {
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
  showviewpartition() {

    this.router.navigate(['/view-partition']);
  }
  showclassicdashboard() {

    this.router.navigate(['/classic-dashboard']);
  }
}
