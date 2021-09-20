import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-upgrade-cmon',
  templateUrl: './upgrade-cmon.component.html',
  styleUrls: ['./upgrade-cmon.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class UpgradeCmonComponent extends PageDialogComponent implements OnInit {

  showUpgradeCmonModel: boolean = false;

  constructor() { 
    super();
  }

  ngOnInit(): void {
  }

  openUpgradeCmonDialog() {
    this.showUpgradeCmonModel = true;
  }

  close() {
    this.showUpgradeCmonModel = false;
  }

}
