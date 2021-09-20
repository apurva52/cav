import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-create-indices',
  templateUrl: './create-indices.component.html',
  styleUrls: ['./create-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateIndicesComponent
  extends PageDialogComponent
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
