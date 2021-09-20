import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    AppCrashSummaryLoadedState, AppCrashSummaryLoadingErrorState, AppCrashSummaryLoadingState
} from './app-crash-summary.state';

@Injectable({
    providedIn: 'root'
})

export class AppCrashSummaryService extends Store.AbstractService {
    LoadAllCrashData(data,startTime, endTime): Observable<Store.State> {
        let filtercriteria3 = [];
           filtercriteria3.push(startTime);
         filtercriteria3.push(endTime);
         filtercriteria3.push("stacktraceid:" + data.stacktraceid);
         if (data.hasOwnProperty('appname') == true) {
            filtercriteria3.push("appname:" + data.appname);
        }
        if (data.hasOwnProperty('appversion') == true) {
            filtercriteria3.push("appversion:" + data.appversion);
        }
        let path = environment.api.netvision.allcrash.endpoint;
        let base = environment.api.netvision.base.base;
        path = path + "?startTime=" + startTime + "&endTime=" + endTime + "&filterCriteria=" + filtercriteria3;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new AppCrashSummaryLoadingState(null)) }, 0);
        me.controller.get(path, null, base).subscribe((data1) => {
            var r = { data: data1 }
            output.next(new AppCrashSummaryLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new AppCrashSummaryLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
                output.complete();
            }
        );
        return output;
    }

}






