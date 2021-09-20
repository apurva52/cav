import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { NDE_CONFIG_TABLE_DATA, PANEL_DUMMY } from './service/nde-cluster-configuration.dummy';
import { NdeClusterConfigHeaderCols, NdeClusterConfigTable } from './service/nde-cluster-configuration.model';

@Component({
  selector: 'app-nde-cluster-configuration',
  templateUrl: './nde-cluster-configuration.component.html',
  styleUrls: ['./nde-cluster-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NdeClusterConfigurationComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  data: NdeClusterConfigTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: NdeClusterConfigHeaderCols[] = [];
  _selectedColumns: NdeClusterConfigHeaderCols[] = [];
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
  reportsMenu: MenuItem[];
  breadcrumb: MenuItem[];
  panel: any;
;

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
      { label: 'Dummy Text' },
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

    me.data = NDE_CONFIG_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): NdeClusterConfigHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: NdeClusterConfigHeaderCols[]) {
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