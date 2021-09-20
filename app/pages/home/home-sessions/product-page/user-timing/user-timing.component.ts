import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Store } from 'src/app/core/store/store';
import { USER_TIMING_DATA } from './service/user-timing.model';
import { UserTimingService } from './service/user-timing.service';
import { UserTimingDataTableHeaderColumn, UserTimingDataTable } from './service/user-timing-data.model';
import { Session } from '../../common/interfaces/session';


import {
  UserTimingLoadedState, UserTimingLoadingErrorState, UserTimingLoadingState
} from './service/user-timing-state';
import { SessionStateService } from '../../session-state.service';
@Component({
  selector: 'app-user-timing',
  templateUrl: './user-timing.component.html',
  styleUrls: ['./user-timing.component.scss']
})
export class UserTimingComponent implements OnInit {
  breadcrumb: MenuItem[];
  globalFilterFields: string[] = [];
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  isCheckbox: boolean;
  data: UserTimingDataTable;
  error: AppError;
  loading: boolean = true;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  selectedPage: any;

  cols: UserTimingDataTableHeaderColumn[] = [];
  _selectedColumns: UserTimingDataTableHeaderColumn[] = [];
  selectedRow: any;
  tooltipzindex = 100000;
  selectedValues: string[] = [];
  selectedSession: Session;
  showdata: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private usertimingservice: UserTimingService, private stateService: SessionStateService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("params in sessions details : ", params);
    });

    let me = this;
    me.data = USER_TIMING_DATA;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('user-timing, page change - ', idx);

      me.reload();
    });

    me.reload();
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


  reload() {
    const me = this;
    me.selectedSession = me.stateService.getSelectedSession();
    me.selectedPage = me.stateService.getSelectedSessionPage();
    me.usertimingservice.LoadUserTimingData(this.selectedPage).subscribe(
      (state: Store.State) => {

        if (state instanceof UserTimingLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof UserTimingLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: UserTimingLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: UserTimingLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: UserTimingLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = true;
  }
  private onLoaded(state: UserTimingLoadedState) {
    const me = this;
    me.data = USER_TIMING_DATA;
    me.data.data = state.data.data;
    if (me.data.data.length > 0) {
    me.showdata = true;
    me.data.data.forEach(temp => {
      switch (temp.type) {
        case 0:
          temp.type = "Mark";
          temp.avgDuration = "-";
          break;
        case 1:
          temp.type = "Measure";
          break;
        case 2:
          temp.type = "Action";
          break;
        case 3:
          temp.type = "Transaction";
          break;
      }
     }
    );
  }
  me.totalRecords = me.data.data.length;
  me.empty = !me.data.data.length;
  me.error = null;
  me.loading = false;
}



}
