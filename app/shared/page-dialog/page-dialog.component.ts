import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Dialog } from 'primeng';

@Component({
  selector: 'app-page-dialog',
  template: 'Page Dialog Works!',
  encapsulation: ViewEncapsulation.None,
})
export class PageDialogComponent implements OnInit {
  @ViewChild('dialog', { read: Dialog, static: true }) dialog: Dialog;
  visible: boolean;

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
