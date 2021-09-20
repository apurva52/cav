import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserActivityLoadedState, UserActivityLoadingErrorState, UserActivityLoadingState } from './user-activity-state';
import { PageInformation } from '../../../common/interfaces/pageinformation';
import { Session } from '../../../common/interfaces/session';
import { DataRequestParams } from '../../../common/datamanager/datarequestparams';
import { DataManager } from '../../../common/datamanager/datamanager';


@Injectable({
    providedIn: 'root'
})

export class UserActivtyService extends Store.AbstractService {
    LoadUserAcitvityData(session: Session, page: PageInformation): Observable<Store.State> {
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => {output.next(new UserActivityLoadingState(null))},0);
        let request : DataRequestParams = new DataRequestParams(session.sid, page.pageInstance, DataManager.USER_ACTIVITIES, session.startTime, session.endTime);
        DataManager.getTransactionData(request, session.duration).subscribe((data1) => {
            output.next(new UserActivityLoadedState({data: data1}));
            output.complete();
        },
        (e: any) => {
            

            output.error(new UserActivityLoadingErrorState(e));
            me.logger.error('Transaction data loading failed');
        });

        return output;
    }

}



