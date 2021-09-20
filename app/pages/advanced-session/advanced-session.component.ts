import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { ADVANCED_SESSION_TABLE } from './service/advanced-session.dummy';
import { AdvancedSessionHeaderCols, AdvancedSessionTable } from './service/advanced-session.model';

@Component({
  selector: 'app-advanced-session',
  templateUrl: './advanced-session.component.html',
  styleUrls: ['./advanced-session.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class AdvancedSessionComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  breadcrumb: MenuItem[];  
  allUser: MenuItem[];
  allSelectedUser: MenuItem;
  groupBy: MenuItem[];
  selectedGroupBy: MenuItem;

  data: AdvancedSessionTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  cols: AdvancedSessionHeaderCols[] = [];
  _selectedColumns: AdvancedSessionHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';


  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Advanced' },
      { label: 'Session' },
    ];

  
    me.allUser = [
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
    ]

    me.groupBy = [
      { label: 'NONE'},
      { label: 'NONE'},
      { label: 'NONE'},
      { label: 'NONE'},
      { label: 'NONE'},
    ]

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.data = ADVANCED_SESSION_TABLE;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  
  openFilter() {
    
  }

  @Input() get selectedColumns(): AdvancedSessionHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: AdvancedSessionHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

}
