import { Component, OnInit, Input } from '@angular/core';
import {
  AppCrashSummaryLoadedState, AppCrashSummaryLoadingErrorState, AppCrashSummaryLoadingState
} from './service/app-crash-summary.state';
import { AppError } from 'src/app/core/error/error.model';
import { AppCrashSummaryService } from './service/app-crash-summary.service'
import { APP_CRASH_SUMMARY_TABLE } from './service/app-crash-summary.dummy';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/core/store/store';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import * as moment from 'moment';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
@Component({
  selector: 'app-app-crash-summary',
  templateUrl: './app-crash-summary.component.html',
  styleUrls: ['./app-crash-summary.component.scss']
})
export class AppCrashSummaryComponent implements OnInit {
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  first: number = 0;
  data: Table;
  count: number;
  filterTitle: string = 'Enable Filters';
  showData: boolean = false;
  globalFilterFields: string[] = [];
  starttime: any;
  endtime: any;
  cols: TableHeaderColumn[] = [];
  tooltipzindex = 100000;
  _selectedColumns: TableHeaderColumn[] = [];
  isEnabledColumnFilter: boolean;
    breadcrumb: BreadcrumbService;
    nvconfigurations : any;
  constructor(private appcrashsummary: AppCrashSummaryService,breadcrumb: BreadcrumbService, private router: Router, private route: ActivatedRoute, private nvAppConfigService : NVAppConfigService) { 
     this.breadcrumb = breadcrumb;
     this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;

    });
  }

  ngOnInit(): void {
    let me = this;
    me.data = APP_CRASH_SUMMARY_TABLE;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

     this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({label: 'Home', routerLink: '/home'} as MenuItem);
      this.breadcrumb.addNewBreadcrumb({label: 'Sessions', routerLink: '/home/home-sessions'});
       this.breadcrumb.add({label: 'Unique Crash', routerLink: '/app-crash-filter'});
            this.breadcrumb.add({label: 'All Crash', routerLink: '/app-crash-summary'});

    //console.log(this.count);

    me.route.queryParams.subscribe(params => {
      if (params == undefined || !(Object.keys(params).length)) {
        let olddata = me.data.data;
        me.data.data = olddata;
        me.showData = true;

      }
      else {
        me.count = (JSON.parse(params['Count']));
        me.starttime = (params['startTime']);
        me.endtime = (params['endTime']);
        me.reloadPage();
      }
    });


  }


  reloadPage() {
    let me = this;
    //console.log(e);
    me.appcrashsummary.LoadAllCrashData(me.count, me.starttime, me.endtime).subscribe(
      (state: Store.State) => {
        if (state instanceof AppCrashSummaryLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof AppCrashSummaryLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: AppCrashSummaryLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    me.data = APP_CRASH_SUMMARY_TABLE;
    this.totalRecords = me.data.data.length;


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


  private onLoading(state: AppCrashSummaryLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: AppCrashSummaryLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = {};
    me.error['error'] = "error";
    me.error['msg'] = "Error while loading data.";
    me.loading = false;
  }

  private onLoaded(state: AppCrashSummaryLoadedState) {
    const me = this;

    me.data = APP_CRASH_SUMMARY_TABLE;
    me.data.data = state.data.data['data'];
    if(me.data.data == null)
    {
      me.empty = true;
      me.data.data = [];
      return;
    }
    me.data.data.forEach((temp, i) => {
      me.data.data[i]["appdetails"] = temp.application + '/' + (temp.applicationVersion).split('/')[1];
      me.data.data[i]["starttime"] = me.starttime;
      me.data.data[i]["endtime"] = me.endtime;
      // converting this time from utc to given timezone
      me.data.data[i]["crashTime"] = moment.tz( me.data.data[i]["crashTime"], this.nvconfigurations.timeZone).format('MM/DD/YYYY HH:mm:ss');
    });
    if (state.data.data.length != 0) {
      me.showData = true;
    }

    console.log(me.data.data)
    me.empty = !me.data.data.length;
    me.loading = false;
    me.error = null;

  }

  openCrashReport(row) {
    let me = this;
    this.router.navigate(['/crash-report'], { queryParams: { startTime: row.starttime, endTime: row.endtime, Sid: row.sid }, replaceUrl: true })
  }
  
  openSession(row) {
    this.router.navigate(['/sessions-details'], { queryParams: { sid: row.sid, from: 'app-crash' }, replaceUrl: true });
  }
}




