import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { CALL_DETAILS_DATA } from './service/call-details.dummy';

@Component({
  selector: 'app-call-details',
  templateUrl: './call-details.component.html',
  styleUrls: ['./call-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CallDetailsComponent
  extends PageDialogComponent
  implements OnInit {
  data;
  empty: boolean;
  error: Error;
  loading: boolean;
  tooltipzindex:number = 100000111

  isCallDetailsEnabledColumnFilter: boolean;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.data = CALL_DETAILS_DATA;
  }

  show() {
    super.show();
  }

  checkToogle() {}

  closePopup() {
    super.hide();
  }
}
