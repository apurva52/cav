import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SCENARIOS_TABLE_DATA } from '../../design/scenarios/service/scenarios.dummy';
import { ScenariosTable, ScenariosHeaderCols } from '../../design/scenarios/service/scenarios.model';
import { PERIPHERAL_TABLE_DATA } from './service/peripheral.dummy';
import { PeripheralDeviceHeaderCols, PeripheralDeviceTable } from './service/peripheral.model';

@Component({
  selector: 'app-peripheral-devices',
  templateUrl: './peripheral-devices.component.html',
  styleUrls: ['./peripheral-devices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PeripheralDevicesComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: PeripheralDeviceTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: PeripheralDeviceHeaderCols[] = [];
  _selectedColumns: PeripheralDeviceHeaderCols[] = [];
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

  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;  
  timeOption: MenuItem[];

  constructor(
    private router : Router
  ) {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Advance' },
      { label: 'System Logs' },
      { label: 'Peripheral Devices' },
    ];

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];
    me.options = [
      { label: 'custom' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];
   
    
  


    me.data = PERIPHERAL_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): PeripheralDeviceHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: PeripheralDeviceHeaderCols[]) {
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
