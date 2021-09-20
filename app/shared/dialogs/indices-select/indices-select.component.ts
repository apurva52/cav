import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { Table } from 'src/app/shared/table/table.model';
import { INDICES_DROPDOWN_DATA, INDICES_SELECT_DATA } from './service/indices-select.dummy';
import { IndicesSelect } from './service/indices-select.model';

@Component({
  selector: 'app-indices-select',
  templateUrl: './indices-select.component.html',
  styleUrls: ['./indices-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndicesSelectComponent extends PageDialogComponent implements OnInit {
  data: IndicesSelect;
  isEnabledColumnFilter: boolean = false;
  selectedValue: any;
  tire: any;
  server: any;
  instance: any;
  pages: any;
  showTreeTableToggler;
  IndicesSelect: Table;
  
  constructor() {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.IndicesSelect = INDICES_SELECT_DATA;
    me.data = INDICES_DROPDOWN_DATA;

    if (me.IndicesSelect) {
      for (const c of me.IndicesSelect.headers[0].cols) {
        //me.globalFilterFields.push(c.valueField);
      }
    }
  }
  public show() {
    super.show();
  }
  public applyChanges() {
    super.hide();
  }
}
