import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { PageDialogComponent } from '../../page-dialog/page-dialog.component';



@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'], 
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent extends PageDialogComponent implements OnInit {

  visible: boolean;
  ifConfirmationNeeded: boolean;
  body: string;

  @Output() command= new EventEmitter<boolean>();

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.command.emit(false);
    this.visible = false;
  }

  open() {
    const me = this;
    this.visible = true;
  }

  saveDialog(){
    this.command.emit(true);
    this.visible = false;
  }
   
} 
