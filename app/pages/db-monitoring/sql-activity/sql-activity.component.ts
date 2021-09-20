import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { DBMonitoringService } from '../services/db-monitoring.services';

@Component({
  selector: 'app-sql-activity',
  templateUrl: './sql-activity.component.html',
  styleUrls: ['./sql-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SQLActivityComponent implements OnInit {

  items: MenuItem[];
  downloadOptions: MenuItem[];
  isShow: boolean = true;
  menuItems = [];
  activeItem:MenuItem;
  toggleClass : boolean = false;
  

  constructor(private dbMonService : DBMonitoringService,
    private route: Router) { }

  ngOnInit(): void {
    const me = this;

    
    me.items = me.dbMonService.getSubMenus('ACTIVITY');
    
    // me.items = [
      //   {label: 'DB Query Stats', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/db-query-stats'},
      //   {label: 'Blocking Sessions', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/blocking-session'},
      //   {label: 'Locks', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/locks'},
      //   {label: 'Sessions', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/sessions'},
      //   {label: 'I/O by File', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/io-file'},
      //   {label: 'Summary', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/summary'},
      //   {label: 'Deadlocks', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/sql-activity/deadlocks'},
      
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
