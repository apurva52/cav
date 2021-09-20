import { Component, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-delete-entry',
  templateUrl: './delete-entry.component.html',
  styleUrls: ['./delete-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteEntryComponent extends PageDialogComponent
  implements OnInit {

  visible: boolean;
  @Output() deleteusersegment: EventEmitter<any>;
  constructor() {
    super();
    this.deleteusersegment = new EventEmitter();
  }

  ngOnInit(): void {
  }


  open() {
    this.visible = true;
  }
  deleteconfirm() {
    this.deleteusersegment.emit(true);
    this.visible = false;
  }
  closeDialog() {
    this.deleteusersegment.emit(false);
    this.visible = false;
  }
}