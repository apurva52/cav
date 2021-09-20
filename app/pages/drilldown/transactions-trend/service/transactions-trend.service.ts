import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { TRANSACTION_TREND_DATA } from './transactions-trend.dummy';
import { TransactionTrendLoadedState, TransactionTrendLoadingErrorState, TransactionTrendLoadingState } from './transactions-trend.state';
import { Store } from '../../../../core/store/store';
import { environment } from 'src/environments/environment';
import { EventsTable } from 'src/app/pages/home/events/service/event.model';
import { TransactionTrendData } from './transactions-trend.model';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TransactionTrendService extends Store.AbstractService {

  stateID: string;
  tierName: string;
  startTime: number;
  endTime: number;
  serverName: string;
  instanceName: string;
  btTransaction: string;
  vectorName: string;
  graphTimeKey: string;
  viewBy: number;

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

    setTimeout(() => {
      output.next(new TransactionTrendLoadingState());
    }, 0);

    const state: WidgetDrillDownMenuItem = me.sessionService.getSetting(me.stateID, null);

    //const state: WidgetDrillDownMenuItem = me.sessionService.getSetting("ddrMenu");

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
      me.graphTimeKey = timeInfo.graphTimeKey;
      me.viewBy = timeInfo.viewBy;
    }

    if (me.serverName && me.serverName.toLowerCase().includes("overall")) {
      if (me.instanceName && me.instanceName.toLowerCase().includes("overall"))
        me.vectorName = me.tierName;
    }
    else if (me.serverName && me.instanceName)
      me.vectorName = me.tierName + '>' + me.serverName + '>' + me.instanceName;


    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new TransactionTrendLoadedState(TRANSACTION_TREND_DATA));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new TransactionTrendLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.iphealth.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      dataFilter: [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      pk: null,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.instanceName,
      btCategory: "all",
      reqType: "BT",
      reqVecName: me.vectorName,
      duration: {
         st: me.startTime,
         et: me.endTime,
         preset: me.graphTimeKey,
         viewBy: me.viewBy,
      },
      serverType: null,
      alertSevType: null,
      all: false,
      flowMapDir: null,
      flowMapName: null,
      globalRenaming: false,
      goodStore: false,
      gRAPH_KEY: null,
      opType: 11,
      resolution: null,
      storeAlertType: 0,
      storeName: null,
      user: null,
      valueType: null,
      isIncDisGraph: false,
      isCompare: false,
      isAll: false,
      dc: "",
      nonZeroIP: false,
      multiDc: false,
      btName: "",
      health: "",
      rt: "-1.0",
      rtt: "-1",
      tps: "-1.0",
      tpst: "-1",
      es: "-1.0",
      est: "-1",
      lastIndex: "",
      isPrevious: false,
      getData: false
    };


    me.controller.post(path, payload).subscribe(
      (data: TransactionTrendData) => {
        output.next(new TransactionTrendLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TransactionTrendLoadingErrorState(e));
        output.complete();

        me.logger.error('Transaction Trend Data Loading failed', e);
      }
    );

    return output;
  }
}
