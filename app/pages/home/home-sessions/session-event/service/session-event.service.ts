import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    SessionEventLoadedState, SessionEventLoadingErrorState, SessionEventLoadingState
} from './session-event.state';


@Injectable({
    providedIn: 'root'
})

export class SessionEventService extends Store.AbstractService {
   // LoadSessionEventData(session): Observable<Store.State> {
        LoadSessionEventData(last,eventname): Observable<Store.State> {
        //console.log("Session1",session);
        console.log("last1",last);
        let path = environment.api.netvision.sessionevent.endpoint;
        let base  = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        output.next(new SessionEventLoadingState(null));
        output.next(new SessionEventLoadingState(null));
        let filters = "?strOprName=eventAgg&access_token=563e412ab7f5a282c15ae5de1732bfd1"+"&lastTime="+last+"&eventname="+eventname;
        path = path + filters;
        me.controller.get(path, null, base).subscribe((data1) => {
            console.log( "Data1",data1)
            var r = { data: data1 }
            output.next(new SessionEventLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new SessionEventLoadingErrorState(e));


                me.logger.error('User Options loading failed', e);
            }
        );
        return output;
    }

}