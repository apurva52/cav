import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TEST_SUITE_TABLE } from './service/test-suite-table.dummy';

@Component({
  selector: 'app-test-suite',
  templateUrl: './test-suite.component.html',
  styleUrls: ['./test-suite.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestSuiteComponent implements OnInit {

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
  isCheckbox: boolean;

  projectOptions: SelectItem[];
  subProjectOptions: SelectItem[];
  lastUpdatedOptions: SelectItem[];

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

    me.projectOptions = [
      {label:'All', value:'all'},
      {label:'Project1', value:'project1'},
      {label:'Project2', value:'project2'},
    ]

    me.subProjectOptions = [
      {label:'All', value:'all'},
      {label:'Sub Project1', value:'subproject1'},
      {label:'Sub Project2', value:'subproject2'},
    ]

    me.lastUpdatedOptions = [
      {label:'3months', value:'3months'},
      {label:'5months', value:'5months'},
      {label:'10months', value:'10months'},
    ]
    
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Advance' },
      { label: 'Design' },
      { label: 'Test Suite' },
    ]
    

    me.data = TEST_SUITE_TABLE;
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
