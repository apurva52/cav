import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-nd-setting',
  templateUrl: './nd-setting.component.html',
  styleUrls: ['./nd-setting.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NdSettingComponent implements OnInit {

  breadcrumb: MenuItem[] = [];
  items: MenuItem[];

  constructor() { }

  ngOnInit(): void {

    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Agent Config' },
      { label: 'Application' },
    ]
    me.items = [
      {label: 'SETTINGS', routerLink: '/nd-setting/setting'},
      {label: 'CUSTOM CONFIGURATION',  routerLink: '/nd-setting/custom-configuration'},
  ];

  }

}
