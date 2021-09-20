import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-add-ip',
  templateUrl: './add-ip.component.html',
  styleUrls: ['./add-ip.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddIpComponent extends PageDialogComponent implements OnInit {
  visible: boolean;
  options: MenuItem[];

  selectedOptions: any;
  constructor() {
    super();
  }

  ngOnInit(): void {
    const me = this;

    me.options = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];
  }

  closeDialog() {
    this.visible = false;
  }

  open() {
    const me = this;
    this.visible = true;
  }
}
