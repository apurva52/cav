import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';

@Component({
  selector: 'app-filter-parameter-box',
  templateUrl: './filter-parameter-box.component.html',
  styleUrls: ['./filter-parameter-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterParameterBoxComponent
  extends PageDialogComponent
  implements OnInit {

  allFilterParameter: MenuItem[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    const me = this;

    me.allFilterParameter = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];
  }

  show() {
    super.show();
  }

  close() {
    super.hide();
  }
}
