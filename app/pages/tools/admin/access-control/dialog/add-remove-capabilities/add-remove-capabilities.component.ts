import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { ADDREMOVECAPABILITIES_TABLE } from './service/add-remove-capabilities.dummy';
import { addRemoveCapabilitiesHeaderCols, addRemoveCapabilitiesTable } from './service/add-remove-capabilities.model';

@Component({
  selector: 'app-add-remove-capabilities',
  templateUrl: './add-remove-capabilities.component.html',
  styleUrls: ['./add-remove-capabilities.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddRemoveCapabilitiesComponent extends PageDialogComponent implements OnInit {
  visible: boolean;
  data: addRemoveCapabilitiesTable;
  error: AppError
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;

  cols: addRemoveCapabilitiesHeaderCols[] = [];
  _selectedColumns: addRemoveCapabilitiesHeaderCols[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  constructor() {super(); }
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
me.data = ADDREMOVECAPABILITIES_TABLE;

me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
    @Input() get selectedColumns(): addRemoveCapabilitiesHeaderCols[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: addRemoveCapabilitiesHeaderCols[]) {
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
