import { Component, OnInit } from '@angular/core';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DbQueryStatsService } from '../../sql-activity/db-query-stats/services/db-query-stats.service';
import { Router } from '@angular/router';
import { Config } from '../../services/request-payload.model';

@Component({
  selector: 'app-datasource-navigation',
  templateUrl: './datasource-navigation.component.html',
  styleUrls: ['./datasource-navigation.component.scss']
})
export class DatasourceNavigationComponent implements OnInit {

  public selectedDbms: any;
  public selectedDataSources = [];
  constructor(public dbMonService: DBMonitoringService,
    private route: Router) { }

  ngOnInit(): void {
    const me = this;
    const dbServerConfig = me.dbMonService.getSqlDbServerList().dbSourceList.filter(
      (config: Config) => config.dbmsId == me.dbMonService.$DataBaseType.toString()
  );
    
    me.dbMonService.orderList = [];
    dbServerConfig.forEach((config: Config) => {
      const order = {
        id: config.globalId,
        label: config.dataSource,
        icon: config.status ? 'icons8 icons8-up' : 'icons8 icons8-down',
      }
      // if (me.dbMonService.orderList == undefined || me.dbMonService.orderList.length <= 0) {
      //   me.dbMonService.orderList = [order];
      // } else {
        me.dbMonService.orderList.push(order);
      // }
    });
    me.setSelectedDataSource();
    me.getSelectedDbms();
  }

  toggle(event) {
    const me = this;
    me.selectedDbms = event.target.innerText;
    me.dbMonService.dbmsList.forEach(element => {
      if (element.label == me.selectedDbms) {
        me.dbMonService.$DataBaseType = element.id;
        let dbServerConfig = me.dbMonService.sqlDbServerList.dbSourceList.filter(
          (value: Config) => value.dbmsId == element.id.toString()
        );
        me.dbMonService.setDefaultGlobalVariables(dbServerConfig[0]);
        // sessionStorage.setItem('dbMonDbmsType', newDbmsId.toString());
        me.dbMonService.loadingToBlockUI = true;
        me.route.navigateByUrl('/home/system');
        setTimeout(() => {
          me.route.navigateByUrl('/db-monitoring');
        }, 100);
        me.dbMonService.loadingToBlockUI = false;
        return;
      }
    });
  }

  getSelectedDbms(){
    const me = this;
    me.dbMonService.dbmsList.forEach(element => {
      if (element.id.toString() == sessionStorage.getItem('dbMonDbmsType')) {
        me.selectedDbms = element.label;
        return;
      }
    });
  }

  onDataSourceChange(event) {
    const me = this;
    me.dbMonService.dataSource = event['value'][0].label;
    // let dataSourceMap = me.dbMonService.sqlDbServerList[sessionStorage.getItem('dbMonDbmsType')];
    // for (const key in dataSourceMap) {
    //   if (dataSourceMap.hasOwnProperty(key)) {
    //     if(me.dbMonService.dataSource == dataSourceMap[key]){
    //       me.dbMonService.globalId = Number(key);      
    //     }
    //   }
    // }
    me.dbMonService.globalId = event['value'][0].id;
    me.dbMonService.scheduleDataRequest.next();
  }

  refresh(event){
    const me = this;
    me.dbMonService.isSelectedDB = me.selectedDbms;
    me.dbMonService.getDbServerList();
  }

  setSelectedDataSource(){
    const me = this;
    me.dbMonService.orderList.forEach(element => {
      if(element.label == me.dbMonService.dataSource){
        me.selectedDataSources = [element];
      }
    });
  }

}
