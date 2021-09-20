import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { DBMonitoringService } from '../services/db-monitoring.services';

@Component({
  selector: 'app-configuration-and-logs',
  templateUrl: './configuration-and-logs.component.html',
  styleUrls: ['./configuration-and-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationAndLogsComponent implements OnInit {

  items: MenuItem[];
  isShow: boolean = true;
  activeItem:MenuItem;
  toggleClass : boolean = false;

  constructor(private dbMonService : DBMonitoringService) { }

  ngOnInit(): void {

    const me = this;

    me.items = me.dbMonService.getSubMenus('CONFIG');
    // me.items = [
    //   {label: 'Services Logs', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/configuration-and-logs/service-logs'},
    //   {label: 'DB Query Logs', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/configuration-and-logs/db-query-logs'},
    //   {label: 'Query Execution', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/configuration-and-logs/query-execution'},
    // ];

    me.dbMonService.populateToggleIcons(me.items[0]);
  }

  /* used to load subMenu */
  clickOnSubMenu(activeItem) {
    const me = this;
    console.log('value of activeItem', activeItem);
    me.activeItem = activeItem;
    me.dbMonService.populateToggleIcons(activeItem);
  }

  closeSidePanel(){
    const me = this;
    me.isShow = false;
  }
  openSidePanel() {
    const me = this;
    me.isShow = true;
  }

}
