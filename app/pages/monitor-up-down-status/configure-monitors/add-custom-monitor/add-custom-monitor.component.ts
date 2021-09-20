import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { CustomMonitorService } from './services/custom-monitor.service';

export const CMD_TYPE = "cmd";
export const NF_TYPE = "nf";
export const STATSD_TYPE = "statsd";
export const DB_TYPE = "db";
export const JMX_TYPE = "jmx";
export const SNMP_TYPE = "snmp";

@Component({
  selector: 'app-add-custom-monitor',
  templateUrl: './add-custom-monitor.component.html',
  styleUrls: ['./add-custom-monitor.component.scss']
})

export class AddCustomMonitorComponent implements OnInit {

  tabs: MenuItem[];  
  
  constructor(private cmsObj: CustomMonitorService) { }

  ngOnInit(): void {
    this.tabs = [
      { label: 'JMX', routerLink: 'availCustMon/jmx', command: e => this.cmsObj.onCustomMonTabChange(JMX_TYPE)},
      { label: 'Command', routerLink: 'availCustMon/cmd', command: e => this.cmsObj.onCustomMonTabChange(CMD_TYPE) },
      { label: 'Database', routerLink: 'availCustMon/db', command: e => this.cmsObj.onCustomMonTabChange(DB_TYPE) },
      { label: 'StatsD', routerLink: 'availCustMon/statsd', command: e => this.cmsObj.onCustomMonTabChange(STATSD_TYPE) },
      { label: 'LOG METRIC', routerLink: 'availCustMon/nf', command: e => this.cmsObj.onCustomMonTabChange(NF_TYPE) },
      // { label: 'SNMP', routerLink: 'availCustMon/snmp', command: e => this.cmsObj.onCustomMonTabChange(SNMP_TYPE) },
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
