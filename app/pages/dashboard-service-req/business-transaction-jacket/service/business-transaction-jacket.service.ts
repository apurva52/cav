import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {
  BusinessTransactionJacketLoadingState,
  BusinessTransactionJacketLoadedState,
} from './business-transaction-jacket.state';
import { BUSINESS_TRANSACTION_JACKET_DATA } from './business-transaction-jacket.dummy';

@Injectable({
  providedIn: 'root',
})
export class BusinessTransactionJacketService extends Store.AbstractService {
  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new BusinessTransactionJacketLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(
        new BusinessTransactionJacketLoadedState(
          BUSINESS_TRANSACTION_JACKET_DATA
        )
      );
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new BusinessTransactionJacketLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: BusinessTransactionJacketTable) => {
    //     output.next(new BusinessTransactionJacketLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new BusinessTransactionJacketLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Business Transaction Jacket Data loading failed', e);
    //   }
    // );

    return output;
  }
}
