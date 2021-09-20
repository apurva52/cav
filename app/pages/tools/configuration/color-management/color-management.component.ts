import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { COLOR_MANAGEMENT_TABLE_DATA } from './service/color-management.dummy';
import { ColorMangementHeaderCols, ColorMangementTable } from './service/color-management.model';

@Component({
  selector: 'app-color-management',
  templateUrl: './color-management.component.html',
  styleUrls: ['./color-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColorManagementComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: ColorMangementTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: ColorMangementHeaderCols[] = [];
  _selectedColumns: ColorMangementHeaderCols[] = [];
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
      { label: ' Color Management' },

    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.options = [
      { label: 'All' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];





    me.data = COLOR_MANAGEMENT_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): ColorMangementHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: ColorMangementHeaderCols[]) {
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
