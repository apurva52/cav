import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { NodeInformationComponent } from '../../node-information/node-information.component';
import { INFO_DATA } from './service/node-setting-info.dummy';
import { NodeSettingInfo } from './service/node-setting-info.model';

@Component({
  selector: 'app-node-setting-information',
  templateUrl: './node-setting-information.component.html',
  styleUrls: ['./node-setting-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeSettingInformationComponent
  extends PageDialogComponent
  implements OnInit {
  data: NodeSettingInfo;
  @Input() node: NodeInformationComponent;
  constructor() {
    super();
  }
  
  show() {
    super.show();
  }

  ngOnInit(): void {
    const me = this;
    me.data = INFO_DATA;
  }

  public saveChanges() {
    super.hide();
  }
}
