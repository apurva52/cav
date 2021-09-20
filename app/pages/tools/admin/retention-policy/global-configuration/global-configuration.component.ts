import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { CleanupHeaderCols, CleanupTable, CustomPathHeaderCols, CustomPathTable } from './service/global-configuration.model';

import { CLEANUP_TABLE, CUSTOMPATH_TABLE } from './service/global-configuration.dummy';

@Component({
  selector: 'app-global-configuration',
  templateUrl: './global-configuration.component.html',
  styleUrls: ['./global-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalConfigurationComponent implements OnInit {

  serverItems: any[];
  timeItems: any[];
  logItems: any[];

  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;  
  timeOption: MenuItem[];


  data: CleanupTable;
  customPathData: CustomPathTable;

  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  
  cols: CleanupHeaderCols[] = [];
  _selectedColumns: CleanupHeaderCols[] = [];

  colsCustomPath: CustomPathHeaderCols[] = [];
  _selectedColumnsCustomPath: CustomPathHeaderCols[] = [];

  globalFilterFields: string[] = [];
  
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.serverItems = [
      {
        label: "22",
        value: "22"
      },
      {
        label: "23",
        value: "23"
      },
      {
        label: "24",
        value: "24"
      }
    ];

    me.timeItems = [
      {
        label: "Day 1",
        value: "Day 1"
      },
      {
        label: "Day 2",
        value: "Day 2"
      },
      {
        label: "Day 3",
        value: "Day 3"
      }
    ];

    me.logItems = [
      {
        label: "1",
        value: "1"
      },
      {
        label: "2",
        value: "2"
      },
      {
        label: "3",
        value: "3"
      }
    ];

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]
    
    me.data = CLEANUP_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.customPathData = CUSTOMPATH_TABLE;
    me.colsCustomPath = me.customPathData.headers[0].cols;
    for (const c of me.customPathData.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumnsCustomPath.push(c);
      }
    }

  }

    @Input() get selectedColumns(): CleanupHeaderCols[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: CleanupHeaderCols[]) {
      const me = this;
      me._selectedColumns = me.cols.filter((col) => val.includes(col));
    }

    @Input() get selectedColumnsCustomPath(): CustomPathHeaderCols[] {
      const me = this;
      return me._selectedColumnsCustomPath;
    }
    set selectedColumnsCustomPath(val: CustomPathHeaderCols[]) {
      const me = this;
      me._selectedColumnsCustomPath = me.cols.filter((col) => val.includes(col));
    }

    restart(){
      
    }

    refresh(){
      
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
  

