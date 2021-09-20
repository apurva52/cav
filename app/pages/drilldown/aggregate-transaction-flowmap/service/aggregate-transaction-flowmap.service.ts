import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { AGGREGATE_TRANSACTION_FLOWMAP_DATA } from './aggregate-transaction-flowmap.dummy';
import { AggregateTransactionFlowmapLoadingState, AggregateTransactionFlowmapLoadedState } from './aggregate-transaction-flowmap.state';

@Injectable({
  providedIn: 'root',
})
export class AggregateTransactionFlowmapService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AggregateTransactionFlowmapLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new AggregateTransactionFlowmapLoadedState(AGGREGATE_TRANSACTION_FLOWMAP_DATA));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new TransactionGroupLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: TransactionGroupTable) => {
    //     output.next(new TransactionGroupLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new TransactionGroupLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Transaction Group Data loading failed', e);
    //   }
    // );

    return output;
  }
}
