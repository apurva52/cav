import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ADDED_GRAPH, HEALTH_CHECK_MONITOR_TABLE_DATA, PANEL_DUMMY, SEVERITY_PANEL_DUMMY } from './service/health-check-monitor.dummy';
import { HealthCheckMonitorHeaderCols, HealthCheckMonitorTable } from './service/health-check-monitor.model';

@Component({
  selector: 'app-health-check-monitor',
  templateUrl: './health-check-monitor.component.html',
  styleUrls: ['./health-check-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HealthCheckMonitorComponent implements OnInit {

  breadcrumb: MenuItem[];

  selectedValue: string;
  addedGraph: any[];
  panel: any;
  severityPanel: any;
  multipleCondition: string = 'Single';
  options: MenuItem[];
  data: HealthCheckMonitorTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: HealthCheckMonitorHeaderCols[] = [];
  _selectedColumns: HealthCheckMonitorHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  selectedValues: string[] = [];
  
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  constructor(
    private router : Router
  ) {}

  

  ngOnInit(): void {
    const me = this;

    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Advance' },
      { label: 'Design' },
      { label: 'Health Check Monitor' },
    ];

    me.options = [
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];

    me.addedGraph =  ADDED_GRAPH;
    me.panel = PANEL_DUMMY;
    me.severityPanel = SEVERITY_PANEL_DUMMY;
    me.data = HEALTH_CHECK_MONITOR_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): HealthCheckMonitorHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: HealthCheckMonitorHeaderCols[]) {
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

