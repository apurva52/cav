import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { TransactionGroupLoadingState, TransactionGroupLoadedState } from './transactions-group.state';
import { TRANSACTION_GROUP_TABLE } from './transactions-group.dummy';

@Injectable({
  providedIn: 'root',
})
export class TransactionGroupService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TransactionGroupLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new TransactionGroupLoadedState(TRANSACTION_GROUP_TABLE));
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
