import { Store } from 'src/app/core/store/store';
import { Observable, Subject} from 'rxjs';
import { ChartLoadedState, ChartLoadingState } from './chart.state';
import { CHART_SAMPLE } from './chart.dummy';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AbstractChartService extends Store.AbstractService {
 //abstract load(): Observable<Store.State>;

 load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ChartLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new ChartLoadedState(CHART_SAMPLE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new ChartLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: EventsTable) => {
    //     output.next(new SamplePageLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new SamplePageLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Sample Page Loading failed', e);
    //   }
    // );

    return output;
  }
}
