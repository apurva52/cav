import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { TopTransactionLoadedState, TopTransactionLoadingState, TopTransactionLoadingErrorState} from './top-transaction.state';
import { environment } from '../../../../../../environments/environment';
import { TopTransactionTable } from './top-transaction.model';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class TopTransactionService extends Store.AbstractService {
  constructor(private sessionService: SessionService) {
    super();
  }

  load(tierName, duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TopTransactionLoadingState());
    }, 0);

    const path = environment.api.e2e.top10.endpoint;
    const payload = {
      duration: duration,
      dataFilter: [0,1,2,3,4,5],
      cctx: me.sessionService.session.cctx,
      opType: 11,
      tr: me.sessionService.session.testRun.id,
      tierName: tierName,
    };

    me.controller.post(path, payload).subscribe(
      (data: TopTransactionTable) => {
        output.next(new TopTransactionLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TopTransactionLoadingErrorState(e));
        output.complete();

        me.logger.error('End-To-End To 10 Data loading failed', e);
      }
    );

    return output;
  }
  
}
