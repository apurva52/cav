import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import {
  KPIPreLoadedState,
  KPIPreLoadingErrorState,
  KPIORDataLoadedState,
  KPIDataLoadedState,
  KPIDataLoadingErrorState,
  KPIDataLoadingState,
  KPIORDataLoadingErrorState,
  KPIORDataLoadingState,
  KPIPreLoadingState,
} from './kpi.state';
import { KPIPre, KPIOrderRevenueData, KPIData, KPIDataCenter } from './kpi.model';
import { PRE_KPI_DUMMY_2, PRE_KPI_DUMMY_1, KPI_DATA_DUMMY, KPI_ORDER_REVENUE_DATA } from './kpi.dummy';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class KPIService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  loadKPIPre(timeperiod: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new KPIPreLoadingState());
    }, 0);

    const path = environment.api.kpi.pre.endpoint;
    const base = environment.api.core.defaultBase;

    const payload = {
      appliedTime: timeperiod
    };

    me.controller.get(path, payload, base).subscribe(
      (data: KPIPre) => {
        output.next(new KPIPreLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new KPIPreLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output;
  }

  loadKPIOrderRevenueData(dc: KPIDataCenter, duration: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new KPIORDataLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new KPIORDataLoadedState(KPI_ORDER_REVENUE_DATA));
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new KPIORDataLoadingErrorState(new Error()));
    // }, 2000);

    const payload = {
      cck: me.sessionService.session.cctx.cck,
      tr: dc.tr,
      pk: me.sessionService.session.cctx.pk,
      u: me.sessionService.session.cctx.u,
      reqType: 'KPIData',
      appliedTime: duration,
      dc: dc.name,
      fromTSDB : me.sessionService.preSession.isTsdb ? me.sessionService.preSession.isTsdb : "false"
    };

    const path = environment.api.kpi.orderRevenueData.endpoint;
    const base = environment.api.core.defaultBase;

    me.controller.get(path, payload, base).subscribe(
      (data: KPIOrderRevenueData) => {
        output.next(new KPIORDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new KPIORDataLoadingErrorState(e));
        output.complete();

        me.logger.error('loading failed', e);
      }
    );

    return output;
  }

  loadKPIData(dc: KPIDataCenter, timePeriod: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new KPIDataLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new KPIDataLoadedState(KPI_DATA_DUMMY));
    // }, 2000);

    const payload = {
      cck: me.sessionService.session.cctx.cck,
      tr: dc.tr,
      pk: me.sessionService.session.cctx.pk,
      u: me.sessionService.session.cctx.u,
      reqType: 'KPIData',
      isIncDisGraph: false,
      eventDay: null,
      startTime: null,
      endTime: null,
      appliedTime: timePeriod,
      dc: dc.name,
      fromTSDB : me.sessionService.preSession.isTsdb ? me.sessionService.preSession.isTsdb : "false"
    };

    const path = environment.api.kpi.data.endpoint;

    me.controller.get(path, payload, dc.url).subscribe(
      (data: KPIData) => {
        output.next(new KPIDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new KPIDataLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output;
  }
}
