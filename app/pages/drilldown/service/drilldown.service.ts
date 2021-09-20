import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  DrilldownLoadingState,
  DrilldownLoadedState,
  DrilldownLoadingErrorState,
} from './drilldown..state';
import { Drilldown } from './drilldown.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { DrilldownServiceInterceptor } from './drilldown.service.interceptor';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { ActivatedRoute } from '@angular/router';
import { DDRParams } from 'src/app/core/session/session.model';
@Injectable({
  providedIn: 'root',
})
export class DrilldownService extends Store.AbstractService {
  public interceptor: DrilldownServiceInterceptor;
  stateID: string;
  tierName: string;
  startTime: number;
  endTime: number;
  serverName: string;
  instanceName: string;
  btTransaction: string;
  private _filterCriteriaVal: string;
  filterCriteriaObj : any;
  selectedFilter: any;
  ddrParam: DDRParams;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    super();
    this.interceptor = new DrilldownServiceInterceptor(this, sessionService);
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']
    
  });
}


  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DrilldownLoadingState());
    }, 0);

    /// DEV CODE ----------------->
    if(me.stateID){
      if(me.stateID ==='DDRCOPYLINK'){
        me.ddrParam = me.sessionService.ddrParam;
        if(me.ddrParam.tierName){
          me.tierName = me.ddrParam.tierName;
        }
        if(me.ddrParam.serverName){
          me.serverName = me.ddrParam.serverName;
        }
        if(me.ddrParam.appName){
          me.instanceName = me.ddrParam.appName;
        }
        if(me.ddrParam.startTime){
          me.startTime = Number(me.ddrParam.startTime);
        }
        if(me.ddrParam.endTime){
          me.endTime = Number(me.ddrParam.endTime);
        }
        if(me.ddrParam.urlName){
          me.btTransaction = me.ddrParam.urlName;
        }
      }else{
        const state: WidgetDrillDownMenuItem = me.sessionService.getSetting(me.stateID, null);
    for (const subjectInfo of state.state.subject.tags) {
      if (subjectInfo.key == 'Tier') {
        me.tierName = subjectInfo.value;
      } else if (subjectInfo.key == 'Server') {
        me.serverName = subjectInfo.value;
      } else if (subjectInfo.key == 'Instance') {
        me.instanceName = subjectInfo.value;
      } else if (subjectInfo.key == 'Business Transactions') {
        me.btTransaction = subjectInfo.value;
      }
    }
    for (const timeInfo of state.time) {
      me.startTime = timeInfo.startTime;
      me.endTime = timeInfo.endTime;
    
    }
      }
    }
    


    //need to remove code WIP
    const sampleData: Drilldown[] = [
      {
        isDir: false,
        isFile: true,
        isSelected: false,
        mime: 'generic file',
        modified: '2020-05-12 06:23:12',
        name: 'angualr',
        path: '/home/cavisson/BinariTest/Test/angualr',
        size: 24,
        tierName:me.tierName,
        serverName:me.serverName,
        instanceName:me.instanceName,
        startTime:me.startTime,
        endTime:me.endTime,
        btTransaction:me.btTransaction,
      }

    ];

    console.log("value of tier"+this.tierName);

    setTimeout(() => {
      output.next(new DrilldownLoadedState(sampleData));
    }, 2000);
    
    setTimeout(() => {
      output.error(new DrilldownLoadingErrorState(new Error()));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.drilldown.load.endpoint;
    // const payload: DrilldownLoadPayload = {
    //   path: rootPath
    // };

    // me.controller.post(path, payload).subscribe(
    //   (data: Drilldown[]) => {
    //     output.next(new DrilldownLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new DrilldownLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Drilldown Directory Tree loading failed', e);
    //   }
    // );

    return output;
  }

  public get filterCriteria(): string {
    return this._filterCriteriaVal;
  }

  public set filterCriteriaVal(value: string) {
    this._filterCriteriaVal = value;
  }
}
