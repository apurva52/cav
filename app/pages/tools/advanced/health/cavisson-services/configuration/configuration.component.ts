import { Component, OnInit } from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent
  extends PageSidebarComponent
  implements OnInit {
  classes = 'configuration-sidebar';
  constructor() {
    super();
  }

  ngOnInit(): void {}

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }
}
