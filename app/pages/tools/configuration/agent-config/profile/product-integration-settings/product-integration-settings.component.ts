import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-product-integration-settings',
  templateUrl: './product-integration-settings.component.html',
  styleUrls: ['./product-integration-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductIntegrationSettingsComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  activeTab: MenuItem;
  constructor(
    private router : Router,
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
    ];
    me.items = [
      {label: 'ND-ND SESSIONS', routerLink: '/product-integration-settings/nd-sessions'},
      {label: 'ND-ND AUTO INJECT',  routerLink: '/product-integration-settings/nd-auto-inject'},
      {label: 'ND-ND SETTINGS', routerLink: '/product-integration-settings/nd-settings'},
    ];
  }
}
