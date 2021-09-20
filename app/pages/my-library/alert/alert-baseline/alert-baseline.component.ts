
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { ALERT_BASELINE_TABLE } from './service/alert-baseline.dummy';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';



@Component({
  selector: 'app-alert-baseline',
  templateUrl: './alert-baseline.component.html',
  styleUrls: ['./alert-baseline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertBaselineComponent extends PageDialogComponent
implements OnInit{
  breadcrumb: MenuItem[] = [];
  
  activeTab: MenuItem;
  

  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;

  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  alertSetting:MenuItem[];
  
  constructor(private router : Router,) { 
     super();
  }
  // show() {
  //   super.show();
  // }
  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'System' },
      { label: 'Alert' },
      { label: 'Alert Baseline' },
      
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
    
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.data = ALERT_BASELINE_TABLE;
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