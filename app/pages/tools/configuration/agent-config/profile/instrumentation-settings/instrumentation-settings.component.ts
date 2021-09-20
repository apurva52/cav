import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-instrumentation-settings',
  templateUrl: './instrumentation-settings.component.html',
  styleUrls: ['./instrumentation-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InstrumentationSettingsComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
    ]
    me.items = [
      {label: 'SERVICE ENTRY POINT', routerLink: '/instrumentation-settings/service-entry-point'},
      {label: 'INTEGRATION POINT',  routerLink: '/instrumentation-settings/integration-point'},
      {label: 'BUSINESS TRANSACTION', routerLink: '/instrumentation-settings/business-transaction'},
      {label: 'INSTRUMENT MONITORS', routerLink: '/instrumentation-settings/instrument-monitors'},
      {label: 'ERROR DETECTION', routerLink: '/instrumentation-settings/error-detection'},
      {label: 'ASYNCHRONOUS TRANSACTION', routerLink: '/instrumentation-settings/asynchronous-transaction'},
  ];
  }

}
