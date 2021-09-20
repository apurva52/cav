import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { ADD_BASELINE_TABLE } from './service/add-baseline.dummy';

@Component({
  selector: 'app-add-baseline',
  templateUrl: './add-baseline.component.html',
  styleUrls: ['./add-baseline.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AddBaselineComponent extends PageDialogComponent 
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
  
  allScope: MenuItem[];
 
  constructor() {
    super();
   }
  ngOnInit(): void {
    const me = this;
    me.allScope = [
      { label: 'All' },
      { label: 'All' },
    ];
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.data = ADD_BASELINE_TABLE;
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
  open(){
    this.visible = true;
  }
 
  closeDialog(){
    this.visible = false;
  }
}
