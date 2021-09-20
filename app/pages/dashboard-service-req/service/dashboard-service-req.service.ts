import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  DashboardServiceReqLoadingState,
  DashboardServiceReqLoadedState,
  DashboardServiceReqLoadingErrorState,
} from './dashboard-service-req.state';
import { DashboardServiceReq } from './dashboard-service-req.model';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute } from '@angular/router';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardServiceReqService extends Store.AbstractService {
  tierName: string;
  startTime: number;
  endTime: number;
  serverName:string;
  instanceName: string;
  btTransaction: string;
  stateID: string;
  RowData: any;
  isFromSource: string;
  reportID: string;
  isFromDB = false;
  private _filterCriteriaVal: string;
  public splitViewUI$: Subject<Object> = new Subject<Object>();
  public splitViewObservable$: Observable<Object> = this.splitViewUI$.asObservable();

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    super();
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']

  });
  }
  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    me.isFromSource = me.sessionService.getSetting("ddrSource");
    me.reportID = me.sessionService.getSetting("reportID");

    setTimeout(() => {
      output.next(new DashboardServiceReqLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new DashboardServiceReqLoadedState(sampleData));
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new DashboardServiceReqLoadingErrorState(new Error()));
    // }, 2000);
    
    /// DEV CODE ----------------->
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
    if(me.isFromSource == 'widget' && me.reportID == 'DBR')
    {
      this.isFromDB=true;
      for (const timeInfo of state.time) {
        me.startTime = timeInfo.startTime;
        me.endTime = timeInfo.endTime;
  
      }
      // getting fp data
      // this.RowData = me.sessionService.getSetting("fpRowdata");
      // var edTime = Number(this.RowData.startTimeInMs) + Number(this.RowData.responseTime);
  
      const sampleData: DashboardServiceReq[] = [
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
  
      setTimeout(() => {
        output.next(new DashboardServiceReqLoadedState(sampleData));
        // output.next(new DashboardServiceReqLoadedState());
      }, 2000);
  
      setTimeout(() => {
        output.error(new DashboardServiceReqLoadingErrorState(new Error()));
      }, 2000);
  
      return output;
    }
    
    else
    {
      this.isFromDB=false;
    // for (const timeInfo of state.time) {
    //   me.startTime = timeInfo.startTime;
    //   me.endTime = timeInfo.endTime;

    // }
    // getting fp data
    this.RowData = me.sessionService.getSetting("fpRowdata");
    var edTime = Number(this.RowData.startTimeInMs) + Number(this.RowData.responseTime);

    const sampleData: DashboardServiceReq[] = [
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
        startTime:this.RowData.startTime,
        endTime:edTime,
        btTransaction:me.btTransaction,
      }
    ];

    setTimeout(() => {
      output.next(new DashboardServiceReqLoadedState(sampleData));
      output.next(new DashboardServiceReqLoadedState());
    }, 2000);

    setTimeout(() => {
      output.error(new DashboardServiceReqLoadingErrorState(new Error()));
    }, 2000);



    return output;
  }
}

  loadForDBG(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardServiceReqLoadingState());
    }, 0);

    setTimeout(() => {
      output.next(new DashboardServiceReqLoadedState(sampleData));
    }, 2000);

    setTimeout(() => {
      output.error(new DashboardServiceReqLoadingErrorState(new Error()));
    }, 2000);

    /// DEV CODE ----------------->
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
    // getting fp data
    // this.RowData = me.sessionService.getSetting("fpRowdata");
    // var edTime = Number(this.RowData.startTimeInMs) + Number(this.RowData.responseTime);

    const sampleData: DashboardServiceReq[] = [
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

    setTimeout(() => {
      // output.next(new DashboardServiceReqLoadedState(sampleData));
      output.next(new DashboardServiceReqLoadedState());
    }, 2000);

    setTimeout(() => {
      output.error(new DashboardServiceReqLoadingErrorState(new Error()));
    }, 2000);

    return output;
  }
  loadForMT(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardServiceReqLoadingState());
    }, 0);

    setTimeout(() => {
      output.next(new DashboardServiceReqLoadedState(sampleData));
    }, 2000);

    setTimeout(() => {
      output.error(new DashboardServiceReqLoadingErrorState(new Error()));
    }, 2000);

    /// DEV CODE ----------------->
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
    // getting fp data
    // this.RowData = me.sessionService.getSetting("fpRowdata");
    // var edTime = Number(this.RowData.startTimeInMs) + Number(this.RowData.responseTime);

    const sampleData: DashboardServiceReq[] = [
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

    setTimeout(() => {
      // output.next(new DashboardServiceReqLoadedState(sampleData));
      output.next(new DashboardServiceReqLoadedState());
    }, 2000);

    setTimeout(() => {
      output.error(new DashboardServiceReqLoadingErrorState(new Error()));
    }, 2000);

    return output;
  }

  public get filterCriteria(): string {
    return this._filterCriteriaVal;
  }

  public set filterCriteriaVal(value: string) {
    this._filterCriteriaVal = value;
  }
}
