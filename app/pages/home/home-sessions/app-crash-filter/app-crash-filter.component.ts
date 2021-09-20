import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { APP_CRASH_FILTER_TABLE, AUTOCOMPLETE_DATA } from './service/app-crash-filter.dummy';
import { AutoCompleteData } from './service/app-crash-filter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCrashFilterService } from './service/app-crash-filter.service'
import {
  AppCrashFilterLoadedState, AppCrashFilterLoadingErrorState, AppCrashFilterLoadingState
} from './service/app-crash-filter.state';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { Store } from 'src/app/core/store/store';
@Component({
  selector: 'app-app-crash-filter',
  templateUrl: './app-crash-filter.component.html',
  styleUrls: ['./app-crash-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppCrashFilterComponent implements OnInit {

  items: MenuItem[];

  data: Table;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  autoValues: string[] = [];
  options: any[];

  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  reportitem: any[];
  error: AppError;
  loading: boolean;
  empty: boolean = true;
  emptyTable: boolean;
  totalRecords: number;
  countLoading: boolean = false;
  first: number = 0;
  starttime: any
  endtime: any;
  filterforcrash: any;
  breadcrumb: BreadcrumbService
  filterLabel: string = '';

  constructor(private appcrashfilterservice: AppCrashFilterService, breadcrumb: BreadcrumbService, private router: Router, private route: ActivatedRoute) {
    this.breadcrumb = breadcrumb;
  }

  ngOnInit(): void {

    const me = this;
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.options = [
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" }
    ];

    me.autoCompleteList = AUTOCOMPLETE_DATA;

    me.data = { ...APP_CRASH_FILTER_TABLE };
    this.countLoading = true;
    this.totalRecords = me.data.data.length;
    this.countLoading = false;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    // this.breadcrumb = [
    //   { label: 'Home', routerLink: '/home/dashboard' },
    //   { label: 'Unique Crash' }
    // ];
    this.breadcrumb.removeAll();
    this.breadcrumb.addNewBreadcrumb({ label: 'Home', routerLink: '/home' } as MenuItem);
    this.breadcrumb.addNewBreadcrumb({ label: 'Sessions', routerLink: '/home/home-sessions' });
    this.breadcrumb.add({ label: 'Unique Crash', routerLink: '/app-crash-filter' });
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

  filterFields(event) {
    const me = this;
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < me.autoCompleteList.autocompleteData.length; i++) {
      let reportitem = me.autoCompleteList.autocompleteData[i];
      if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reportitem);
      }
    }
    me.filteredReports = filtered;
  }
  applyFilter(e) {
    let me = this;
    console.log(e);

    me.filterLabel = e.filtercriteriadisplay;

    me.starttime = e.StartTime;
    me.endtime = e.EndTime;
    this.filterforcrash = e.filtercriteria;
    me.appcrashfilterservice.LoadUniqCrashData(e.StartTime, e.EndTime, e.filtercriteria).subscribe(
      (state: Store.State) => {
        if (state instanceof AppCrashFilterLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof AppCrashFilterLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: AppCrashFilterLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

  }

  private onLoading(state: AppCrashFilterLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: AppCrashFilterLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = {};
    me.error['error'] = "error";
    me.error['msg'] = "Error while loading data.";
    me.loading = false;
  }

  private onLoaded(state: AppCrashFilterLoadedState) {
    const me = this;

    me.data = { ...APP_CRASH_FILTER_TABLE };
    let error = state.data[2];
    if (error != null) {
      me.loading = false;
      me.countLoading = false;
      me.error = {};
      me.error['msg'] = error;
      return;
    }
    me.data.data = state.data.data;

    if (state.data.data.length != 0) {
      me.data.data.forEach((temp, i) => {
        let jsontemp = JSON.parse(temp.properties);
        me.data.data[i]["functionname"] = jsontemp.functionname;
        me.data.data[i]["filename"] = jsontemp.filename
        me.data.data[i]["exception_message"] = jsontemp.exception_message
        me.data.data[i]["exception_name"] = jsontemp.exception_name
        me.data.data[i]["starttime"] = me.starttime;
        me.data.data[i]["endtime"] = me.endtime;
      });
    }


    console.log(me.data.data)
    me.empty = !me.data.data.length;
    me.loading = false;
    me.error = null;

  }

  navigate_to_allcrash(row) {
    let me = this;
    console.log(row);
    if (this.filterforcrash) {
      for (let i = 2; i < this.filterforcrash.length; i++) {
        let string = this.filterforcrash[i];
        if (string.split(":")[0] === 'appname')
          row["appname"] = string.split(":")[1];
        if (string.split(":")[0] === 'appversion')
          row["appversion"] = string.split(":")[1];
      }
    }
    this.router.navigate(['/app-crash-summary'], { queryParams: { Count: JSON.stringify(row), startTime: row.starttime, endTime: row.endtime }, replaceUrl: true })
  }
}




