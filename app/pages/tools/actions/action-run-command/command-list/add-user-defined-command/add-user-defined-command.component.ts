import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PANEL_DUMMY, USER_TABLE_DATA } from './service/add-user-defined-command.dummy';
import { adduserdefinedcommandTable } from './service/add-user-defined-command.model';

@Component({
  selector: 'app-add-user-defined-command',
  templateUrl: './add-user-defined-command.component.html',
  styleUrls: ['./add-user-defined-command.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddUserDefinedCommandComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  breadcrumb: MenuItem[];
  options: MenuItem[];
  checked: Boolean = true
  selectedValue: string;
  addedGraph: any[];
  panel: any;
  severityPanel: any;
  multipleCondition: string = 'Single';
  data: adduserdefinedcommandTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  reportsMenu: MenuItem[];
 
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

    me.data = USER_TABLE_DATA;

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
   
