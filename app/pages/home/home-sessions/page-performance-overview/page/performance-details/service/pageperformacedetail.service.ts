import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilterByLoadedState } from 'src/app/shared/dashboard/sidebars/advance-open-merge/service/select-item.state';
import { HttpErrorResponse } from '@angular/common/http';
import { HomePageTabLoadedState, HomePageTabLoadingErrorState, HomePageTabLoadingState } from './page-service.state';
@Injectable({
    providedIn: 'root'
})
export class PagePerformaceDetailService extends Store.AbstractService {
    constructor() {
        super();
    }
    LoadPageTabData(filtercriteria): Observable<Store.State> {
        //environment.api.session.login.endpoint
        filtercriteria["bucket"] = "3600";
        let path = environment.api.netvision.performancedetailaggdata.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?strOperName=aggregatePage&filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new HomePageTabLoadingState());

        me.controller.get(path, null, base).subscribe((data: any) => {
            console.log(data);
            let data1 = { 'dataLoaded': data, 'charts': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            //output.error("[]");
            console.log("request error");
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
    LoadPageTrendData(filtercriteria): Observable<Store.State> {
        filtercriteria["bucket"] = "3600";
        let path = environment.api.netvision.performancedetailtrenddata.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?strOperName=pageTrend&filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new HomePageTabLoadingState());

        me.controller.get(path, null, base).subscribe((data: any) => {
            console.log(data);
            let data1 = { 'dataLoaded': data, 'charts': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            //output.error("[]");
            console.log("request error");
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
}
