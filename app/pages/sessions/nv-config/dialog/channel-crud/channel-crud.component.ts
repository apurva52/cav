import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-channel-crud',
  templateUrl: './channel-crud.component.html',
  styleUrls: ['./channel-crud.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelCrudComponent
  extends PageDialogComponent
  implements OnInit {
  showFields: boolean;
  visible: boolean;
  channelName: string;
  items: SelectItem[];
  channelType: any;
  sectionRule: any;
  sectionItems: SelectItem[];
  url: string;
  cookieName: string;
  cookieValue: string;

  constructor() {
    super();
  }

  showDialog(row, isShowFields) {
    console.log(row);
    super.show();
    if (row) {
      this.channelName = row.name;
      this.channelType = row.type;
      this.sectionRule = row.rule;
      this.cookieName = row.name;
      this.cookieValue = row.ruleName;
    } else {
      this.channelName = null;
      this.channelType = null;
      this.sectionRule = null;
      this.url = null;
    }
    this.showFields = isShowFields;
  }

  ngOnInit(): void {
    const me = this;
    (me.items = [{ label: 'Native Application', value: 'Native Application' }]),
      (me.sectionItems = [
        {
          label: 'Cookie',
          value: 'Cookie',
        },
      ]);
  }

  open() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
