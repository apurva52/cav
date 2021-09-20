import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { ND_AUTO_INJECT_TABLE_DATA, PANEL_DUMMY } from './service/nd-auto-inject.dummy';
import { NdautoinjectTable } from './service/nd-auto-inject.model';

@Component({
  selector: 'app-nd-auto-inject',
  templateUrl: './nd-auto-inject.component.html',
  styleUrls: ['./nd-auto-inject.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NdAutoInjectComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  data: NdautoinjectTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  city: string;
  breadcrumb: MenuItem[];
  cols: TableHeaderColumn[] = [];
  statCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  isEnabledColumnFilter1: boolean = false;
  isShowColumnFilter: boolean = false;
  isCheckbox: boolean;
  filterTitle: string = 'Enable Filters';
  options:MenuItem[];
  tooltipzindex = 100000;
  panel: any;


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
    me.options = [
      { label: 'text/html' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];

    me.panel = PANEL_DUMMY;
    
    me.data = ND_AUTO_INJECT_TABLE_DATA;

    me.cols = me.data.PolicyRule.headers[0].cols;
    for (const c of me.data.PolicyRule.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.statCols = me.data.InjectionConfig.headers[0].cols;
      for (const c of me.data.InjectionConfig.headers[0].cols) {
        if (c.selected) {
          me._selectedStatColumns.push(c);
        }
      }

    
    
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedStatColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedStatColumns;
  }

  set selectedStatColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedStatColumns = me.statCols.filter((col) => val.includes(col));
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

  toggleFilters2() {
    const me = this;
    me.isEnabledColumnFilter1 = !me.isEnabledColumnFilter1;
    if (me.isEnabledColumnFilter1 === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }


}
