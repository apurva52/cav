import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { LOGS_VISUALIZATION_TABLE } from './service/logs-visualization.dummy';
import { LogsVisualizationTable } from './service/logs-visualization.model';

@Component({
  selector: 'app-logs-visualization',
  templateUrl: './logs-visualization.component.html',
  styleUrls: ['./logs-visualization.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LogsVisualizationComponent implements OnInit {

  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  
  constructor(private router : Router) { }

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]
    
    me.data = LOGS_VISUALIZATION_TABLE;
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

  toAddReports(){
    this.router.navigate(['/add-reports']);
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
