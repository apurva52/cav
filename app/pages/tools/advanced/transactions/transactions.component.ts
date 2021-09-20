import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TRANSACTION_TABLE_DATA } from './service/transaction.dummy';
import { TrabsactionTable, TransactionHeaderCols } from './service/transaction.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionsComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: TrabsactionTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TransactionHeaderCols[] = [];
  _selectedColumns: TransactionHeaderCols[] = [];
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

  constructor(
    private router : Router
  ) {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Advanced' },
      { label: 'Transaction' },
     
    ];

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
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
    
  


    me.data = TRANSACTION_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): TransactionHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TransactionHeaderCols[]) {
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
}