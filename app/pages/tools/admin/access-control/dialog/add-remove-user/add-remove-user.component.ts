import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { ADDREMOVEUSER_TABLE } from './service/add-remove-user.dummy';
import { AddRemoveUserHeaderCols, AddRemoveUserTable } from './service/add-remove-user.model';

@Component({
  selector: 'app-add-remove-user',
  templateUrl: './add-remove-user.component.html',
  styleUrls: ['./add-remove-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddRemoveUserComponent extends PageDialogComponent implements OnInit {
  visible: boolean;
  data: AddRemoveUserTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;

  cols: AddRemoveUserHeaderCols[] = [];
  _selectedColumns: AddRemoveUserHeaderCols[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  constructor() {
    super();
  }

  show() {
    super.show();
  }

  ngOnInit(): void {
const me = this;
me.downloadOptions = [
  { label: 'WORD'},
  { label: 'PDF'},
  { label: 'EXCEL'}
]
me.data = ADDREMOVEUSER_TABLE;

me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
    @Input() get selectedColumns(): AddRemoveUserHeaderCols[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: AddRemoveUserHeaderCols[]) {
      const me = this;
      me._selectedColumns = me.cols.filter((col) => val.includes(col));
    }
closeDialog(){
  this.visible = false;
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


