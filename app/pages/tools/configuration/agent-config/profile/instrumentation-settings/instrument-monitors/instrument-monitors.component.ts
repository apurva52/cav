import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-instrument-monitors',
  templateUrl: './instrument-monitors.component.html',
  styleUrls: ['./instrument-monitors.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InstrumentMonitorsComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.items = [
      {label: 'METHOD MONITOR', routerLink: './instrument-monitors/method-monitor'},
      {label: 'HTTP STATS MONITOR',  routerLink: './instrument-monitors/stats-monitor'},
      {label: 'EXCEPTION MONITOR', routerLink: './instrument-monitors/exception-monitor'},
      {label: 'JAM THREAD CPU MONITOR', routerLink: './instrument-monitors/jam-thread-cpu-monitor'}
  ];
  }

}
