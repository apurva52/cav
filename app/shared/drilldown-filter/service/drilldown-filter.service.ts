import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '../../../core/store/store';
import { DRILL_DOWN_FILTER_DATA } from './drilldown-filter.dummy';

import { DrillDownFilterLoadingState, DrillDownFilterLoadedState, DrillDownFilterLoadingErrorState } from './drilldown-filter.state';

@Injectable({
  providedIn: 'root',
})
export class DrillDownFilterService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DrillDownFilterLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new DrillDownFilterLoadedState(DRILL_DOWN_FILTER_DATA));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new DrillDownFilterLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: EventsTable) => {
    //     output.next(new DrillDownFilterLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new DrillDownFilterLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Revenue Data loading failed', e);
    //   }
    // );

    return output;
  }
}
