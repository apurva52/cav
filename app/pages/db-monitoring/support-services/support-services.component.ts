import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { DBMonitoringService } from '../services/db-monitoring.services';

@Component({
  selector: 'app-support-services',
  templateUrl: './support-services.component.html',
  styleUrls: ['./support-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupportServicesComponent implements OnInit {

  items: MenuItem[];
  isShow: boolean = true;
  activeItem:MenuItem;
  toggleClass : boolean = false;

  constructor(private dbMonService : DBMonitoringService) { }

  ngOnInit(): void {
    const me = this;

    me.items = me.dbMonService.getSubMenus('SERVICES');
    // me.items = [
    //   {label: 'Support Status', routerLink: '/db-monitoring/support-services/support-status'},
    //   {label: 'Batch Jobs', routerLink: '/db-monitoring/support-services/batch-jobs'}
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
