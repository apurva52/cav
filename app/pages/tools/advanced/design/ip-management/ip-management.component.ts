import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-ip-management',
  templateUrl: './ip-management.component.html',
  styleUrls: ['./ip-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IpManagementComponent implements OnInit {

  items: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {label: 'IP', routerLink: '/ip-management/ip'},
      {label: 'Connectivity',  routerLink: '/ip-management/connectivity'},
      {label: 'Properties', routerLink: '/ip-management/properties'},
  ];
  }

}
