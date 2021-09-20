import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddNoteComponent extends PageDialogComponent implements OnInit {
  checkOutBusiness: SelectItem[];
  pageType: SelectItem[];
  checkOutBP: any;
  pageT: any;
  constructor() {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.checkOutBusiness = [
      { label: 'CheckOut', value: 'checkout' },
      { label: 'CheckOut 1', value: 'checkout1' },
    ];
    me.pageType = [
      { label: 'Page 1', value: 'page1' },
      { label: 'Page 2', value: 'page2' },
    ];
  }

  openDialog() {
    const me = this;
    me.show();
  }

  saveChanges() {
    super.hide();
  }
}
