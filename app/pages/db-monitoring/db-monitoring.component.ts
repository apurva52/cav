import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { DBMonitoringService } from './services/db-monitoring.services';

@Component({
  selector: 'app-db-monitoring',
  templateUrl: './db-monitoring.component.html',
  styleUrls: ['./db-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DBMonitoringComponent implements OnInit {

  items: MenuItem[];
  checked: boolean = true;
  realTimeRefreshOptions: any [];

  constructor(public dbMonService: DBMonitoringService,
    private router: Router,
    private timebarService: TimebarService) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function() {
    //   return false;
    // };
   }

  ngOnInit(): void {
    const me = this;
    me.realTimeRefreshOptions = [{ label: '15 sec', value: 15 }, { label: '30 sec', value: 30 },{ label: '45 sec', value: 45 }];
    me.items = me.dbMonService.getMenus();
    me.dbMonService.dbmsList = [];
    let i = 0;
    me.dbMonService.$dbMonitorUIJson.forEach(element => {
      if (me.dbMonService.sqlDbServerList.dbSourceList.some(config => Number(config.dbmsId) == i)) {
        me.dbMonService.dbmsList.push({
          label: element['displayName'],
          id: i
        });
      }
      i++;
    });
    console.log('value of dblist', me.dbMonService.dbmsList);

    // me.items = [
    //   {label: 'SQL Activity', routerLink: '/db-monitoring/sql-activity'},
    //   {label: 'Wait Statistics', routerLink: '/db-monitoring/wait-statistics'},
    //   {label: 'Database', routerLink: '/db-monitoring/database'},
    //   {label: 'Support Services', routerLink: '/db-monitoring/support-services'},
    //   {label: 'Temp DB', routerLink: '/db-monitoring/temp-db'},
    //   {label: 'Server Stats', routerLink: '/db-monitoring/server-stats'},
    //   {label: 'Configuration & Logs', routerLink: '/db-monitoring/configuration-and-logs'}
    // ];
  }
  controlPrevious() {
    const me = this;
    if (me.dbMonService.duration) {
      const diff = me.dbMonService.duration.et - me.dbMonService.duration.st;
      const timePeriod = me.timebarService.getCustomTime(
        me.dbMonService.duration.st - diff,
        me.dbMonService.duration.st
      );
      me.dbMonService.selectedPreset = timePeriod;
      
      me.dbMonService.scheduleDataRequest.next();
      
    }
  }
  controlPause() {
    const me = this;
    me.dbMonService.isAnalysisMode = true;
    me.timebarService.controlPause();
    // me.dbMonService.unsuscribe
  }

  controlStart() {
    const me = this;
    me.dbMonService.isAnalysisMode = false;
    me.dbMonService.selectedPreset = 'LIVE0';
    me.dbMonService.scheduleDataRequest.next();
  }

  controlNext() {
    const me = this;
    if (me.dbMonService.duration) {
      const diff = me.dbMonService.duration.et - me.dbMonService.duration.st;
      const timePeriod = me.timebarService.getCustomTime(
        me.dbMonService.duration.et,
        me.dbMonService.duration.et + diff
      );
      me.dbMonService.selectedPreset = timePeriod;
      
      me.dbMonService.scheduleDataRequest.next();
      
    }
  }

  changeAggregateMode(){
    const me = this;
    me.dbMonService.scheduleDataRequest.next();
  }
  changeRealTimeMode(){
    const me = this;
    me.dbMonService.scheduleDataRequest.next();
  }

  onFilterValueChange(event) {
    const me = this;
    me.dbMonService.scheduleDataRequest.next();
  } 
  ngOnDestroy() {
    const me = this;
    me.dbMonService.isAnalysisMode = false;
    me.dbMonService.selectedPreset = 'LIVE3';
    me.dbMonService.isRealTimeAppled = false;
    me.dbMonService.isShowRealtimeToggle = false;
    me.dbMonService.isAggregate = true;
  }
}
