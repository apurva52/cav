import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CMON_STAT_TABLE } from './service/cmon-stats.dummy';


@Component({
  selector: 'app-cmon-stats',
  templateUrl: './cmon-stats.component.html',
  styleUrls: ['./cmon-stats.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CmonStatsComponent extends PageDialogComponent
implements OnInit {

  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  selectedValues: string[]; 

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;

  isCheckbox: boolean;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  
  constructor(private router : Router,) { 
    super();
  }
  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.data = CMON_STAT_TABLE;
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

  openCmonStatDialog(){
  
    super.show();
  }
}

