import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CAVISSON_SERVICES_TABLE_DATA } from './service/cavisson-services.dummy';
import { cavissonServicesTable } from './service/cavisson-services.model';

@Component({
  selector: 'app-cavisson-services',
  templateUrl: './cavisson-services.component.html',
  styleUrls: ['./cavisson-services.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CavissonServicesComponent implements OnInit {
  breadcrumb: MenuItem[];

  selectedValue: string;
  addedGraph: any[];
  panel: any;
  options: MenuItem[];
  data: cavissonServicesTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  statCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  selectedValues: string[] = [];
  
  isEnabledColumnFilter: boolean = false;
  isEnabledColumnFilter1: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  @ViewChild('confirmDialog', { read: ConfirmationDialogComponent })
  confirmDialog: ConfirmationDialogComponent;
  constructor(
    private router : Router
  ) {}

  ngOnInit(): void {
    const me = this;

    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Advance' },
      { label: 'Health' },
      { label: 'Cavisson Services' },
    ];

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.data = CAVISSON_SERVICES_TABLE_DATA;
    me.cols = me.data.cavissonServices.headers[0].cols;
    for (const c of me.data.cavissonServices.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.statCols = me.data.allProcesses.headers[0].cols;
      for (const c of me.data.allProcesses.headers[0].cols) {
        if (c.selected) {
          me._selectedStatColumns.push(c);
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

  @Input() get selectedStatColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedStatColumns;
  }

  set selectedStatColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedStatColumns = me.statCols.filter((col) => val.includes(col));
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

  toggleFilters1() {
    const me = this;
    me.isEnabledColumnFilter1 = !me.isEnabledColumnFilter1;
    if (me.isEnabledColumnFilter1 === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

}
