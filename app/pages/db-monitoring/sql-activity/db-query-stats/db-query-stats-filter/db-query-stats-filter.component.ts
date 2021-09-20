import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, MessageService } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { DbQueriesService } from 'src/app/pages/dashboard-service-req/db-queries/service/db-queries.service';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { DBMonitoringComponent } from '../../../db-monitoring.component';
import { DBMonitoringService } from '../../../services/db-monitoring.services';
import { DBQueryStatsParam } from '../services/db-query-stats.model';
import { DbQueryStatsService } from '../services/db-query-stats.service';

@Component({
  selector: 'app-db-query-stats-filter',
  templateUrl: './db-query-stats-filter.component.html',
  styleUrls: ['./db-query-stats-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DbQueryStatsFilterComponent
  extends PageSidebarComponent
  implements OnInit {
  classes = 'page-sidebar';
  error: boolean;
  loading: boolean;
  // options: MenuItem[];
  // selectedValue: string = 'preset';
  // customTimeFrameMax: Moment = null;
  // timeFilterEnableApply: boolean = false;
  // customTimeFrame: Moment[] = null;
  // invalidDate: boolean = false;
  // tmpValue: TimebarValue = null;
  checked: boolean = true;
  // selectedOptions: MenuItem;
  // dbOptions: MenuItem[];
  // syncOptions: MenuItem[];
  // orderList: MenuItem[];
  

  constructor(public _dbQueryStatsService: DbQueryStatsService,
    public dbMonService: DBMonitoringService,
    public messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    
    const me = this;
    // me.dbMonService.options = me.dbMonService.$dbMonitorUIJson[sessionStorage.getItem('dbMonDbmsType')]['presetOptions'];
    // me.options = [
    //   { label: 'Last 1 Min' },
    //   { label: 'Last 5 Min' },
    //   { label: 'Last 10 Min' },
    //   { label: 'Last 15 Min' },
    // ];

    me._dbQueryStatsService.dbOptions = [{ label: 'I/O', value: 'I/O' }, { label: 'CPU', value: 'CPU' },{ label: 'ALL', value: 'ALL' }];

    // me.syncOptions = [{ label: 'Cache' }, { label: 'Hard Reload' }];

    // const dbType = me.dbMonService.getSqlDbServerList()[sessionStorage.getItem('dbMonDbmsType')];
    // Object.keys(dbType).forEach((globalId: string) => {
    //   const order =  {
    //     id : globalId,
    //     label: dbType[globalId],
    //     icon: 'icons8 icons8-up',
    //   }
    //   if(me.dbMonService.orderList == undefined || me.dbMonService.orderList.length <=0){
    //    me.dbMonService.orderList =  [order];
    //   }else{
    //   me.dbMonService.orderList.push(order);
    // }
    //   });
    
    //   {
    //     label: 'DESKTOP123YU6',
    //     icon: 'icons8 icons8-up',
    //   },
    //   {
    //     label: 'DESKTOP123YU6',
    //     icon: 'icons8 icons8-up',
    //   },
    //   {
    //     label: 'DESKTOP123YU6',
    //     icon: 'icons8 icons8-down',
    //   },
    //   {
    //     label: 'DESKTOP123YU6',
    //     icon: 'icons8 icons8-up',
    //   },
    // ];
  }

  show() {
    super.show();
  }

  closeClick() {
    const me = this;
    me.visible = !me.visible;
  }

  onFilterChange(event) {
    const me = this;
    
   if(me._dbQueryStatsService.queryBasis != 'ALL'){
    let msg  = {
      severity: 'info',
      summary: 'Getting Top ' +me._dbQueryStatsService.queryCount + ' Slow Queries Based On ' +me._dbQueryStatsService.queryBasis,
    };
    me.messageService.add(msg);
  
  }
  const payload = {} as DBQueryStatsParam;
    me._dbQueryStatsService.getPresetAndLoad(payload);
  }
  onFilterValueChange(event){
    const me = this;
    if(me._dbQueryStatsService.queryBasis != 'ALL'){
      let msg = {
        severity: 'info',
        summary: 'Getting Top ' +me._dbQueryStatsService.queryCount + ' Slow Queries Based On ' +me._dbQueryStatsService.queryBasis,
      };
      me.messageService.add(msg);
    
    }
    const payload = {} as DBQueryStatsParam;
    me._dbQueryStatsService.getPresetAndLoad(payload);
  }
}
