import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
// import { CustomMonitorService } from './services/custom-monitor.service';

export const LOG_PATTERN = "logPattern";
export const LOG_DATA = "logData";
export const GET_LOG_FILE = "getLogFile";


@Component({
  selector: 'app-log-monitor-common',
  templateUrl: './log-monitor-common.component.html',
  styleUrls: ['./log-monitor-common.component.scss']
})

export class LogMonitorCommonComponent implements OnInit {

  tabs: MenuItem[];  
  
  constructor() { }

  ngOnInit(): void {
    this.tabs = [
      { label: 'LOG PATTERN MONITOR', routerLink: '/log-monitor-common/log-pattern-monitor'},
      { label: 'LOG DATA', routerLink: '/log-monitor-common/log-data-monitor'},
      { label: 'GET LOG FILE', routerLink: '/log-monitor-common/get-log-file'}
    ];
   
  }

  getTabOptionsFor(tab: MenuItem): MenuItem[] {

    const me = this;

    return [
      {
        label: 'Set as Default',
        command: () => {
          me.tabSetDefault(tab);
        },
        disabled: true
      },
      {
        label: 'Change Order', command: () => {
          me.tabSetDefault(tab);
        },
        disabled: true
      },
    ];
  }

  tabSetDefault(tab: MenuItem) {
    console.log('Set to defualt', tab); // TODO: Call Service
  }

  tabChangeOrder(tab: MenuItem) {
    console.log('Change the order', tab); // TODO: Call Service
  }

}
