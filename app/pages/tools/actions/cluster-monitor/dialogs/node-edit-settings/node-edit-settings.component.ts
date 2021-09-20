import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-node-edit-settings',
  templateUrl: './node-edit-settings.component.html',
  styleUrls: ['./node-edit-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeEditSettingsComponent  extends PageDialogComponent
implements OnInit {
constructor() {
  super();
}
show() {
  super.show();
}

ngOnInit(): void {}

public saveChanges() {
  super.hide();
}
}
