import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { IndexPatternLoadingState, IndexPatternLoadedState } from './index-pattern.state';
import { INDEX_PATTERN_TABLE } from './index-pattern.dummy';

@Injectable({
  providedIn: 'root',
})
export class IndexPatternService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new IndexPatternLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new IndexPatternLoadedState(INDEX_PATTERN_TABLE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new IndexPatternLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: IndexPatternTable) => {
    //     output.next(new IndexPatternLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new IndexPatternLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Index Pattern Data loading failed', e);
    //   }
    // );

    return output;
  }
}
