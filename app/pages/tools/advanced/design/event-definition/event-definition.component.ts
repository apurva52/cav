import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { EVENT_DEFINITION_TABLE } from './service/event-definition-table.dummy';

@Component({
  selector: 'app-event-definition',
  templateUrl: './event-definition.component.html',
  styleUrls: ['./event-definition.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventDefinitionComponent implements OnInit {

  breadcrumb: MenuItem[] = [];
  activeTab: MenuItem;

  data: Table;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  eventOptions: SelectItem[];
  isCheckbox: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  
  constructor() { }

  ngOnInit(): void {

    const me = this;

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.eventOptions = [
      {label:'netstorm_events.dat', value:'netstorm_events.dat'},
      {label:'netstorm_events2.dat', value:'netstorm_events2.dat'},
    ]
    
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Advance' },
      { label: 'Design' },
      { label: 'Event Definition' },
    ]
    me.alertSetting = [
      { 
        label: 'Alert Maintenance',
        routerLink: ['/alert-maintenance']
     },
      { 
        label: 'Alert Configuration',
        routerLink: ['/alert-configuration']
      },
    ]

    me.data = EVENT_DEFINITION_TABLE;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
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
