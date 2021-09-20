import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TIER_GROUP_TABLE_DATA } from './service/tier-group.dummy';
import { TierGroupHeaderCols, TierGroupTable } from './service/tier-group.model';

@Component({
  selector: 'app-tier-group',
  templateUrl: './tier-group.component.html',
  styleUrls: ['./tier-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TierGroupComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: TierGroupTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TierGroupHeaderCols[] = [];
  _selectedColumns: TierGroupHeaderCols[] = [];
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
  options2: MenuItem[];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: 'Tier Group' },
     
    ];

    me.downloadOptions = [
      { label: 'WORD', icon:'icons8 icons8-word' },
      { label: 'PDF', icon:'icons8 icons8-pdf-2'},
      { label: 'EXCEL', icon:'icons8 icons8-spreadsheet-file' }
    ];
    me.options = [
      { label: 'NetOcean' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];
   




    me.data = TIER_GROUP_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): TierGroupHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TierGroupHeaderCols[]) {
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