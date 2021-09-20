import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    TransactionsLoadedState, TransactionsLoadingErrorState, TransactionsLoadingState
} from './transactions-state';
import { PageInformation } from '../../../common/interfaces/pageinformation';
import { Session } from '../../../common/interfaces/session';
import { DataRequestParams } from '../../../common/datamanager/datarequestparams';
import { DataManager } from '../../../common/datamanager/datamanager';


@Injectable({
    providedIn: 'root'
})

export class TransactionsService extends Store.AbstractService {
    LoadTransactionData(session: Session, page: PageInformation): Observable<Store.State> {
        const me = this;
        const output = new Subject<Store.State>();
        output.next(new TransactionsLoadingState(null));

        let request : DataRequestParams = new DataRequestParams(session.sid, page.pageInstance, DataManager.TRANSACTIONS, session.startTime, session.endTime);
        DataManager.getTransactionData(request, session.duration).subscribe((data1) => {
            output.next(new TransactionsLoadedState({data: data1}));
            output.complete();
        },
        (e: any) => {
            

            output.error(new TransactionsLoadingErrorState(e));
            me.logger.error('Transaction data loading failed');
        });

        return output;
    }

}


