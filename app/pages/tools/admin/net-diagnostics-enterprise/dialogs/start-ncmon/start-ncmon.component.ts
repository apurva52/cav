import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-start-ncmon',
  templateUrl: './start-ncmon.component.html',
  styleUrls: ['./start-ncmon.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class StartNcmonComponent extends PageDialogComponent implements OnInit {

  showStartNcmonModel: boolean = false;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

  openStartNcmonDialog() {
    this.showStartNcmonModel = true;
  }

  close() {
    this.showStartNcmonModel = false;
  }

}
