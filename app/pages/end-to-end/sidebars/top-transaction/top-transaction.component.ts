import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import {
  TopTransactionTable,
  TopTransactionTableHeaderCols,
} from './service/top-transaction.model';
import { TopTransactionService } from './service/top-transaction.service';
import {
  TopTransactionLoadingState,
  TopTransactionLoadedState,
  TopTransactionLoadingErrorState,
} from './service/top-transaction.state';

@Component({
  selector: 'app-top-transaction',
  templateUrl: './top-transaction.component.html',
  styleUrls: ['./top-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopTransactionComponent
  extends PageSidebarComponent
  implements OnInit {
  visible: boolean;

  data: TopTransactionTable;
  // tableData: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TopTransactionTableHeaderCols[];
  _selectedColumns: TopTransactionTableHeaderCols[];

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  tierName : string = "Cavisson";

  constructor(private topTranactionService: TopTransactionService) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    // alert(me.tierName);
    // me.load();
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

  load(duration) {
    const me = this;
    me.topTranactionService.load(me.tierName, duration).subscribe(
      (state: Store.State) => {
        if (state instanceof TopTransactionLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof TopTransactionLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TopTransactionLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TopTransactionLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: TopTransactionLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: TopTransactionLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.empty = false;

    if (me.data) {
      me.empty = false;
      if (!me.data.data && me.data.data == null) {
        me.emptyTable = true;
      }
    } else {
      me.empty = true;
    }

    me.cols = me.data.headers[0].cols;
    me._selectedColumns = me.cols;
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
}
