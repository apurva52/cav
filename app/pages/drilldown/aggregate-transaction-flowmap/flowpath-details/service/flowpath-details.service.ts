import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { FlowpathDetailsLoadingState, FlowpathDetailsLoadedState } from './flowpath-details.state';
import { FLOWPATH_DETAILS_TABLE } from './flowpath-details.dummy';

@Injectable({
  providedIn: 'root',
})
export class FlowpathDetailsService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FlowpathDetailsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new FlowpathDetailsLoadedState(FLOWPATH_DETAILS_TABLE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new FlowpathLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: FlowpathTable) => {
    //     output.next(new FlowpathLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new FlowpathLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Transaction Group Data loading failed', e);
    //   }
    // );

    return output;
  }
}
