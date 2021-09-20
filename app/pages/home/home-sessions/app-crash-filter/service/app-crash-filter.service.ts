import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    AppCrashFilterLoadedState, AppCrashFilterLoadingErrorState, AppCrashFilterLoadingState
} from './app-crash-filter.state';
import { Util } from '../../common/util/util';


@Injectable({
    providedIn: 'root'
})

export class AppCrashFilterService extends Store.AbstractService {
    LoadUniqCrashData(startTime, endTime, filters): Observable<Store.State> {
        let path = environment.api.netvision.appcrashfilter.endpoint;
        let base = environment.api.netvision.base.base;
        try{
            startTime = Util.convertLocalTimeZoeToUTC(startTime);
            endTime = Util.convertLocalTimeZoeToUTC(endTime);
        }catch(e){
            console.log("exception while converting to utc");
        }
        path = path + "?startTime=" + startTime + "&endTime=" + endTime + "&filterCriteria=" + filters;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new AppCrashFilterLoadingState(null)) }, 0);
        me.controller.get(path, null, base).subscribe((data1) => {
            var r = { data: data1 }
            output.next(new AppCrashFilterLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new AppCrashFilterLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
                output.complete();
            }
        );
        return output;
    }

}






