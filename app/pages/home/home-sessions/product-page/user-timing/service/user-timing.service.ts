import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    UserTimingLoadedState, UserTimingLoadingErrorState, UserTimingLoadingState
} from './user-timing-state';


@Injectable({
    providedIn: 'root'
})

export class UserTimingService extends Store.AbstractService {
    LoadUserTimingData(session): Observable<Store.State> {
        let path = environment.api.netvision.usertiming.endpoint;
        let base = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        output.next(new UserTimingLoadingState(null));
        output.next(new UserTimingLoadingState(null));
        let filters = "?strOperName=aggregatedata&nvSessionId=" + session.sid + "&pageinstance=" + session.pageinstance;
        path = path + filters;
        me.controller.get(path, null, base).subscribe((data1) => {

            var r = { data: data1 }
            output.next(new UserTimingLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new UserTimingLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
            }
        );
        return output;
    }

}


