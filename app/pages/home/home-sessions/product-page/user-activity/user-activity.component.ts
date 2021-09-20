import { Component, OnInit,Input } from '@angular/core';
import { DataManager } from 'src/app/pages/home/home-sessions/common/datamanager/datamanager'
import { DataRequestParams } from 'src/app/pages/home/home-sessions/common/datamanager/datarequestparams'
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../common/interfaces/session';
import { UserActivtyService } from './service/user-activity.service';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import {USERACTIVITY_DATA} from './service/user-activity.model'
import { SessionStateService } from '../../session-state.service';
import { UserActivityLoadedState, UserActivityLoadingErrorState, UserActivityLoadingState } from './service/user-activity-state';
@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
   globalFilterFields: string[] = [];
  selectedPage: any;
  isEnabledColumnFilter: boolean;
   isCheckbox: boolean;
     emptyTable: boolean;
  filterTitle: string = 'Enable Filters';
  selectedSession: Session;
  actionList = null;
  data: Table;
  error: AppError;
  loading: boolean;
  totalRecords: number;
   cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  empty: boolean;
  constructor(private router: Router, private route: ActivatedRoute,private stateService: SessionStateService,private useractservice:UserActivtyService) { }

  ngOnInit(): void {
    let me = this;
    me.data = USERACTIVITY_DATA;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('transactions, page change - ', idx);

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
       me.useractservice.LoadUserAcitvityData(me.selectedSession, me.selectedPage).subscribe(
      (state: Store.State) => {

        if (state instanceof UserActivityLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof UserActivityLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: UserActivityLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    console.log("Action", this.actionList);
    
  }


  private onLoading(state: UserActivityLoadingState) {
    const me = this;
    me.data.data = [];
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: UserActivityLoadingErrorState) {
    const me = this;
    me.data.data = [];
    me.empty = false;
    me.error = state.error || {};
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = true;
  }
  private onLoaded(state: UserActivityLoadedState) {
    const me = this;
    me.data = USERACTIVITY_DATA;
    me.data.data = state.data.data;
    console.log(me.data.data);
    console.log('Transaction data loaded. total record - ' + (me.data.data ? me.data.data.length : 'null'));
    me.totalRecords = me.data.data.length;
    me.empty = !me.data.data.length;
    me.error = null;
    me.loading = false;
  }

}

