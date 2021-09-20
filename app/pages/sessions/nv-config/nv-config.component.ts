import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-nv-config',
  templateUrl: './nv-config.component.html',
  styleUrls: ['./nv-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NvConfigComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  widgetReportItems: MenuItem[];
  activeTab: MenuItem;

  constructor(private router: Router,) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' }
    ]
    me.widgetReportItems = [
      {
        label: 'EVENTS',
        command: (event: any) => {
          me.router.navigate(['/nv-config/events']);
        },
      },
      {
        label: 'PAGE NAME',
        command: (event: any) => {
          me.router.navigate(['/nv-config/page-name']);
        },
      },
      {
        label: 'CUSTOM DATA',
        command: (event: any) => {
          me.router.navigate(['/nv-config/custom-data']);
        },
      },
      {
        label: 'USER SEGMENT',
        command: (event: any) => {
          me.router.navigate(['/nv-config/user-segment']);
        },
      },
      {
        label: 'CLUSTER',
        command: (event: any) => {
          me.router.navigate(['/nv-config/cluster']);
        },
      },
      {
        label: 'CHANNEL',
        command: (event: any) => {
          me.router.navigate(['/nv-config/channel']);
        },
      },
      {
        label: 'CHECK POINT',
        command: (event: any) => {
          me.router.navigate(['/nv-config/check-point']);
        },
      },
      {
        label: 'BUSINESS PROCESS',
        command: (event: any) => {
          me.router.navigate(['/nv-config/business-process']);
        },
      }
    ];
    this.activeTab = this.widgetReportItems[0];
  }

}

