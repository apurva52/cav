import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { DBMonitoringService } from '../services/db-monitoring.services';

@Component({
  selector: 'app-server-stats',
  templateUrl: './server-stats.component.html',
  styleUrls: ['./server-stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServerStatsComponent implements OnInit {

  items: MenuItem[];
  isShow: boolean = true;
  analyticsMode: boolean = false;
  aggregateMode: boolean = true;
  activeItem:MenuItem;
  toggleClass : boolean = false;

  constructor( private dbMonService : DBMonitoringService ) { }

  ngOnInit(): void {
    const me = this;

    // me.items = [
    //   {label: 'Configurations', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/server-stats/configurations'},
    //   {label: 'Connection Stats', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/server-stats/connection-stats'}
    // ];
    me.items = me.dbMonService.getSubMenus('SERVERSTATS');
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
