
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { TransactionGroupService } from './service/transactions-group.service';
import { Store } from 'src/app/core/store/store';
import { TransactionGroupLoadingState, TransactionGroupLoadedState, TransactionGroupLoadingErrorState } from './service/transactions-group.state';
import { TransactionGroupTable} from './service/transactions-group.model';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { FilterUtils } from 'primeng/utils';
import { Router } from '@angular/router';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';

@Component({
  selector: 'app-transactions-group',
  templateUrl: './transactions-group.component.html',
  styleUrls: ['./transactions-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class TransactionsGroupComponent implements OnInit {
  autoplayCurrentSeqIndex: number;
  selectedRow: any;

  data: TransactionGroupTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  selectedFilter = "Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All";
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  downloadOptions: MenuItem[];
  showUI: boolean = false;
  
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  isCheckbox:boolean;
  finalValue: any;

  groupData =[];
  totalRecords = 0;
  items1: MenuItem[];

  constructor(private sampleDemoService: TransactionGroupService, private router: Router) {
    // this.showUI = !!localStorage.getItem('SHOW_EVENTS_UI');
    // this.timesDropDown = [
    //   { label: 'Specified Time', value: null },

    // ];
  }

  ngOnInit(): void {
    const me = this;
    me.load();

    me.downloadOptions = [
      {
        label : 'Word'
      },
      {
        label : 'Excel'
      },
      {
        label : 'PDF'
      }
    ],
    (me.items1 = [
      {
        label: 'Aggregate Transaction Flowmap',
        command: (event: any) => {
          this.router.navigate(['/aggregate-transaction-flowmap']);
        },
      },
      {
        label: 'Dashboard Service Request',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req']);
        },
      },
    ]);
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

  load() {
    const me = this;
    me.sampleDemoService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionGroupLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TransactionGroupLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TransactionGroupLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TransactionGroupLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TransactionGroupLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: TransactionGroupLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    if (me.data) {
      me.empty = false;
      if(!me.data.data && me.data.data == null){
        me.emptyTable = true;
      }
      let check = {}
      me.loadPagination(check);
      this.totalRecords = this.data.data.length;
    } else {
      me.empty = true;
    }
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me.cols.push(c);
      }
    }
    // me.cols = me.data.headers[0].cols;
    me._selectedColumns = me.cols;
  }

  // readField() {
  //   console.log('its work');
  // }


  loadPagination(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
        if (this.data.data) {
            this.groupData = this.data.data.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
}

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }


  autoplayTimerChanged(){
    
  }
}


