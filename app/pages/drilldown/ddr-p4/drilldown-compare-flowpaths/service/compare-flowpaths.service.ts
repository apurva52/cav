import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { COMPARE_FLOW_PATH_DATA } from './compare-flowpaths.dummy';
import { CompareFlowPathLoadedState, CompareFlowPathLoadingErrorState, CompareFlowPathLoadingState } from './compare-flowpaths.state';

@Injectable({
  providedIn: 'root'
})
export class CompareFlowpathsService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new CompareFlowPathLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new CompareFlowPathLoadedState(COMPARE_FLOW_PATH_DATA));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new CompareFlowPathLoadingErrorState(new Error()));
    // }, 2000);

    // / <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: CompareFlowPathData) => {
    //     output.next(new CompareFlowPathLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new CompareFlowPathLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Flow Path Data loading failed', e);
    //   }
    // );

    return output;
  }
}

