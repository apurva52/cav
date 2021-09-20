import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { COMMAND_LIST_TABLE_DATA } from './service/command.dummy';
import { CommandListTable } from './service/command.model';

@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommandListComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  data: CommandListTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  city: string;
  breadcrumb: MenuItem[];
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
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  settings:string = 'agentsetting';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const me = this;
   
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

   
    
    me.data = COMMAND_LIST_TABLE_DATA;

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

  showaddusercommand(){
   
    this.router.navigate(['app-command-list/add-user-defined-command']);

}

}





