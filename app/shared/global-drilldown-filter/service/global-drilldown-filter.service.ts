import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from '../../../core/store/store';

import { GLOBAL_DRILL_DOWN_FILTER_DATA } from './global-drilldown-filter.dummy';
import { GlobalDrilldownServiceInterceptor } from './global-drilldown-filter.service.interceptor';
import { GlobalDrillDownFilterLoadingState, GlobalDrillDownFilterLoadedState } from './global-drilldown-filter.state';

@Injectable({
  providedIn: 'root',
})
export class GlobalDrillDownFilterService extends Store.AbstractService {

  public sideBarUI$: Subject<Object> = new Subject<Object>();
  public sideBarUIObservable$: Observable<Object> = this.sideBarUI$.asObservable();
  currentReport: any;
  public interceptor: GlobalDrilldownServiceInterceptor;

  constructor(
    private sessionService: SessionService
  ) {
    super();
    this.interceptor = new GlobalDrilldownServiceInterceptor(this, sessionService);
  }


  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new GlobalDrillDownFilterLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new GlobalDrillDownFilterLoadedState(GLOBAL_DRILL_DOWN_FILTER_DATA));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new GlobalDrillDownFilterLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: EventsTable) => {
    //     output.next(new GlobalDrillDownFilterLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new GlobalDrillDownFilterLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Revenue Data loading failed', e);
    //   }
    // );

    return output;
  }

  isValidParameter(param: string) {
    if (param != undefined && param != "undefined" && param != "" && param != null && param != "null" && param != "NA" && param != "-")
      return true;
    else
      return false;
  }
}
