import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { SessionPageMenuOption } from './session-page.model';
import {
    SessionPageLoadedState, SessionPageLoadingErrorState, SessionPageLoadingState
} from './session-page.state';
import { filter } from 'lodash';


@Injectable({
    providedIn: 'root'
})

export class SessionPageService extends Store.AbstractService {
    LoadSessionPageData(filters, active:  boolean): Observable<Store.State> {
        let path = environment.api.netvision.sessionpage.endpoint;
        let base  = environment.api.netvision.base.base;
         filters.ff3 = null;
        path = path + "?access_token=563e412ab7f5a282c15ae5de1732bfd1&filterCriteria="+JSON.stringify(filters);

        if (active) {
            path = environment.api.netvision.activeSessionPages.endpoint;
            path = `${path}?access_token=563e412ab7f5a282c15ae5de1732bfd1&limit=100&channel=-1&opcode=data&filterCriteria=${encodeURIComponent(JSON.stringify({sid: filters.sid}))}`;
        }

        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new SessionPageLoadingState(null)) }, 0);
        me.controller.get(path, null, base).subscribe((data1) => {

            var r = { data: data1 }
            if (active) {
                r = {data: data1.data};
            }

            output.next(new SessionPageLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new SessionPageLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
	  	output.complete();
            }
        );
        return output;
    }

}





