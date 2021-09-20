import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import 'moment-timezone';
//import { SessionPageMenuOption } from './session-page.model';
import {
    AppCrashLoadedState, AppCrashLoadingErrorState, AppCrashLoadingState
} from './app-crash.state';


@Injectable({
    providedIn: 'root'
})

export class AppCrashService extends Store.AbstractService {
    LoadAppCrashData(session): Observable<Store.State> {
        let st = ((session.startTime) * 1000);
        let et = ((parseInt("" + session.endTime) + 7200) * 1000);
        let nst = (moment.tz(st, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
        let net = (moment.tz(et, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
        const output = new Subject<Store.State>();
        console.log("timing", nst, net)
        let path = environment.api.netvision.appcrash.endpoint;
        let base = environment.api.netvision.base.base;
        setTimeout(() => { output.next(new AppCrashLoadingState(null)) }, 0);
        let filters = ""
        if (session.sid == null) {
            filters = "?access_token=563e412ab7f5a282c15ae5de1732bfd1&sid=" + session.Sid + "&startTime=" + session.startTime + "&endTime=" + session.endTime;
        }
        else {
            filters = "?access_token=563e412ab7f5a282c15ae5de1732bfd1&sid=" + session.sid + "&startTime=" + nst + "&endTime=" + net;
        }
        path = path + filters;
        const me = this;
        me.controller.get(path, null, base).subscribe((data1) => {
            var r = { data: data1 }
            output.next(new AppCrashLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new AppCrashLoadingErrorState(e));


                me.logger.error('App Crash loading failed', e);
            }
        );
        return output;
    }

}






