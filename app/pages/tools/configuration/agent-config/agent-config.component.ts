import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-agent-config',
  templateUrl: './agent-config.component.html',
  styleUrls: ['./agent-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgentConfigComponent implements OnInit {
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
      {label: 'Home', routerLink: '/agent-config/agent-config-home'},
      {label: 'Application',  routerLink: '/agent-config/agent-config-application'},
      {label: 'Profile', routerLink: '/agent-config/profile'},
      {label: 'Topology', routerLink: '/agent-config/agent-config-topology'},
      {label: 'Profile Maker', routerLink: '/agent-config/profile-maker'},
      {label: 'Finder', routerLink: '/agent-config/finder'},
      {label: 'NDE Cluster Configuration', routerLink: '/agent-config/nde-cluster-config'},
      {label: 'User Configuration', routerLink: '/agent-config/user-config'},
      {label: 'Download Agent Logs', routerLink: '/agent-config/download-agent-logs'},
      {label: 'Audit Logs', routerLink: '/agent-config/audit-logs'},
  ];
  }

}
