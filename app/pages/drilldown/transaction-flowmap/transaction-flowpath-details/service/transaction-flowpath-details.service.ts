import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { TRANSACTION_FLOWPATH_DETAILS_TABLE } from './transaction-flowpath-details.dummy';
import { TransactionFlowpathDetailsLoadedState, TransactionFlowpathDetailsLoadingErrorState, TransactionFlowpathDetailsLoadingState } from './transaction-flowpath-details.state';

@Injectable({
  providedIn: 'root',
})
export class TransactionFlowpathDetailsService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TransactionFlowpathDetailsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new TransactionFlowpathDetailsLoadedState(TRANSACTION_FLOWPATH_DETAILS_TABLE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new TransactionFlowpathDetailsLoadingErrorState(new Error()));
    // }, 2000);

    // / <----------------- DEV CODE

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
