import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Session } from '../../common/interfaces/session';
import { SessionStateService } from '../../session-state.service';
import { TransactionsLoadedState, TransactionsLoadingErrorState, TransactionsLoadingState } from './service/transactions-state';
import { TRANSACTION_DATA } from './service/transactions.model';
import { TransactionsService } from './service/transactions.service';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  breadcrumb: MenuItem[];
  globalFilterFields: string[] = [];
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  isCheckbox: boolean;
  data: Table;
  error: AppError;
  loading: boolean = true;
  empty: boolean;
  emptyTable: boolean;
  selectedPage: any;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  selectedRow: any;
  tooltipzindex = 100000;
  selectedValues: string[] = [];
  selectedSession: Session;
  showdata: boolean = false;
  transactions: any = [];
  path = 'this.alltransactions';
  alltransactions = null;

  constructor(private router: Router, private route: ActivatedRoute, private stateService: SessionStateService, private transactionService: TransactionsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("params in sessions details : ", params);
    });

    let me = this;
    me.data = TRANSACTION_DATA;
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
    me.transactionService.LoadTransactionData(this.selectedSession, this.selectedPage).subscribe(
      (state: Store.State) => {

        if (state instanceof TransactionsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TransactionsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TransactionsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TransactionsLoadingState) {
    const me = this;
    me.data.data = [];
    me.alltransactions = [];
    me.transactions = [];
    me.path = 'this.alltransactions';
    me.breadcrumb = [{
      label: 'All',
      id: me.path
    }];
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: TransactionsLoadingErrorState) {
    const me = this;
    me.data.data = [];
    me.empty = false;
    me.error = state.error || {};
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = false;

  }
  private onLoaded(state: TransactionsLoadedState) {
    const me = this;
    me.data = TRANSACTION_DATA;
    me.data.data = state.data.data;
    // initially it will open all trnsactions. 
    me.alltransactions = state.data.data;
    me.transactions = me.alltransactions;
    me.path = 'this.alltransactions';
    me.breadcrumb = [{
      label: 'All',
      id: me.path
    }];
    console.log('Transaction data loaded. total record - ' + (me.data.data ? me.data.data.length : 'null'));
    
    me.empty = !me.data.data.length;
    me.error = null;
    me.loading = false;
  }

  expandTxn($event) {
    let index = $event.index;

    // FIXME: Need to find a fix of this problem. 
    if (index === undefined) {
      // in this case iterate transactions and identify index.
      console.log('transactions, onSelect event returned index undefined. Searching. ');
      this.transactions.some((item, idx) => {
        if (item == $event.data) {
          index = idx;
          return true;
        }
      });

      if (index == undefined) {
        console.log('transactions, no record match corresponding to selected row. returning.');
        return ;
      }
    }

    let oldPath = this.path;

    this.path += "[" + index + "]";
    let data = eval(this.path);
    if (!data.txData || !data.txData.length) {
      this.path = oldPath;
      return;
    }

    this.path += ".txData";
    console.log('Breadcrumb - ' +  JSON.stringify(this.breadcrumb) + ', path - ' +  this.path);
    //Remove extra element from link.
    let maxB = this.path.split('.').length - 2;
    while(this.breadcrumb.length > maxB)
    {
       this.breadcrumb.pop();

    }
    this.addBreadCrumb(data.name);
    this.transactions = data.txData;
  }

  addBreadCrumb(namevar) {
    let flag = false;
    if (this.breadcrumb.length > 0) {
      this.breadcrumb.forEach(temp => {
        if (temp.label == namevar)
          flag = true;
      })
    }
    if (!flag)
      this.breadcrumb.push({ label: namevar, title: namevar, id: this.path });
  }
  openLink($event) {
    let link = $event.item;
    let data = eval(link.id);

    if (link.label == 'All') {
      this.transactions = data;
      this.path = 'this.alltransactions';
    } else {
      this.transactions = data;
      this.path = link.id;
    }

    // remove breadcrumb from current. 
    while(this.breadcrumb.length && this.breadcrumb[this.breadcrumb.length - 1].id != this.path) {
      this.breadcrumb.pop();
    }
  }


}
