import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-advance-settings',
  templateUrl: './advance-settings.component.html',
  styleUrls: ['./advance-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvanceSettingsComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  activeTab: MenuItem;
  constructor( private router : Router,) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
    ];
    me.items = [
      {label: 'DEBUG LEVEL', routerLink: '/advance-settings/debug-level'},
      {label: 'MONITORS',  routerLink: '/advance-settings/monitors'},
      {label: 'PUT DELAY IN METHOD', routerLink: '/advance-settings/put-delay-in-method'},
      {label: 'GENERATE EXCEPTION', routerLink: '/advance-settings/generate-exception'},
      {label: 'CUSTOM CONFIGURATION', routerLink: '/advance-settings/custom-configuration'},
      {label: 'DEBUG TOOL', routerLink: '/advance-settings/debug-tool'},
      {label: 'DYNAMIC LOGGING', routerLink: '/advance-settings/dynamic-logging'},
    ];
  }
}
