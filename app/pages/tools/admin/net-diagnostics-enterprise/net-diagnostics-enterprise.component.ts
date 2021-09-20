import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-net-diagnostics-enterprise',
  templateUrl: './net-diagnostics-enterprise.component.html',
  styleUrls: ['./net-diagnostics-enterprise.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NetDiagnosticsEnterpriseComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  diagnosticsItems: MenuItem[];
  activeTab: MenuItem;
  
  constructor(
    private router : Router,
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Net Diagnostics Enterprise' },
    ]
    me.diagnosticsItems = [
      {
        label: 'PROJECTS',      
        command: (event: any) => {          
          me.router.navigate(['/net-diagnostics-enterprise/projects']);
        },
      },
      {
        label: 'SERVERS',
        command: (event: any) => {
          me.router.navigate(['/net-diagnostics-enterprise/servers']);
        },
      },
      
    ];
    this.activeTab = this.diagnosticsItems[0];
  }

}
