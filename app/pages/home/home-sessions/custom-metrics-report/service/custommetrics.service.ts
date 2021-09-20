import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomePageTabLoadedState, HomePageTabLoadingErrorState } from './custommetrics-service.state';
@Injectable({
    providedIn: 'root'
})
export class CustomMetricsService extends Store.AbstractService {
    constructor() {
        super();
    }
    LoadCustomMetroicsData(filtercriteria): Observable<Store.State> {
        //let path = 'netvision/rest/webapi/customMetrics';
        let path = environment.api.netvision.customMetrics.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data, 'chartspie': [], 'chartstrend': [], 'chartscorelation': [] };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
}
