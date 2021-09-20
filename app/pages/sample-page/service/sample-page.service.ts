import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { SAMPLE_PAGE } from './sample-page.dummy';
import { SamplePageLoadPayload } from './sample-page.model';
import { SamplePageLoadingState, SamplePageLoadedState, SamplePageLoadingErrorState } from './sample-page.state';


@Injectable({
  providedIn: 'root',
})
export class SamplePageService extends Store.AbstractService {

  load(payload: SamplePageLoadPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new SamplePageLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new SamplePageLoadedState(SAMPLE_PAGE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new SamplePageLoadingErrorState(new Error()));
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
