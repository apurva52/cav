import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-rename-integration',
  templateUrl: './rename-integration.component.html',
  styleUrls: ['./rename-integration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RenameIntegrationComponent
  extends PageDialogComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}

  show() {
    super.show();
  }

  checkToogle() {}

  closePopup() {
    super.hide();
  }
}
