import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-infrastructure-view',
  templateUrl: './infrastructure-view.component.html',
  styleUrls: ['./infrastructure-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfrastructureViewComponent implements OnInit {

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
      { label: 'Advanced' },
      { label: 'Infracture View' },
    ]
    me.items = [
      {label: 'Overview', routerLink: '/infrastructure-view/overview'},
      {label: 'Ongoing Test',  routerLink: '/infrastructure-view/ongoing-test'},
      {label: 'Projects', routerLink: '/infrastructure-view/projects'},
      {label: 'Environment', routerLink: '/infrastructure-view/environment'},
      {label: 'Disk Usage', routerLink: '/infrastructure-view/disk-usage'},
      {label: 'Inventory', routerLink: '/infrastructure-view/inventory'},
      {label: 'Report', routerLink: '/infrastructure-view/report'},
      {label: 'Controllers', routerLink: '/infrastructure-view/controllers'}
  ];
    
  }

}
