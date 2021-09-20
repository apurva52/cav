import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    CustomMetricsLoadedState, CustomMetricsLoadingErrorState, CustomMetricsLoadingState
} from './custom-metrics-state';


@Injectable({
    providedIn: 'root'
})

export class CustomMetricsService extends Store.AbstractService {
    LoadCustomMetricsData(session): Observable<Store.State> {
        let path = environment.api.netvision.custommetrics.endpoint;
        let base  = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new CustomMetricsLoadingState(null)) }, 0);
        let filters = "?strOperName=custommetric&access_token=563e412ab7f5a282c15ae5de1732bfd1&nvSessionId="+session.sid+"&pageinstance=-1&startTime="+session.startTime+"&endTime="+session.endTime;
        path = path + filters;
        me.controller.get(path, null, base).subscribe((data1) => {

            var r = { data: data1 }
            output.next(new CustomMetricsLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new CustomMetricsLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
 	  	output.complete();
            }
        );
        return output;
    }

}





