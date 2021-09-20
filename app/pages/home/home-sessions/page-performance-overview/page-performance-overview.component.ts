import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { PagePerformanceOverviewService } from './page-performance-overview.service';
@Component({
  selector: 'app-page-performance-overview',
  templateUrl: './page-performance-overview.component.html',
  styleUrls: ['./page-performance-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagePerformanceOverviewComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  pageoverviewflag: boolean = true;
  constructor(private pageTabService: PagePerformanceOverviewService) { }

  ngOnInit(): void {
    const me = this;
    me.items = [
      { label: 'PAGE', routerLink: '/page-performance-overview/page' },
      { label: 'DEVICE', routerLink: '/page-performance-overview/device' },
      { label: 'BROWSER', routerLink: '/page-performance-overview/browser' },
      { label: 'BROWSER VERSION', routerLink: '/page-performance-overview/browser-version' },
      { label: 'CONNECTION', routerLink: '/page-performance-overview/connection' },
      { label: 'LOCATION', routerLink: '/page-performance-overview/location' },
      { label: 'REGION', routerLink: '/page-performance-overview/region' },
      { label: 'OS', routerLink: '/page-performance-overview/os' },
      { label: 'OS VERSION', routerLink: '/page-performance-overview/os-version' },
      { label: 'BROWSER & OS', routerLink: '/page-performance-overview/browser-os' },
    ];

    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Sessions', routerLink: '/home/home-sessions' },
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview/page' }
    ];
    this.pageTabService.on('closeChild').subscribe((value: boolean) => {
      console.log('closeChild pageoverview compo value : ', value);
      this.pageoverviewflag = value;
    });
  }
}
