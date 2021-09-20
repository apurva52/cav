import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilterByLoadedState } from 'src/app/shared/dashboard/sidebars/advance-open-merge/service/select-item.state';
import { HttpErrorResponse } from '@angular/common/http';
import { HomePageTabLoadedState, HomePageTabLoadingErrorState, HomePageTabLoadingState } from './resouce-performance.state';
@Injectable({
    providedIn: 'root'
})
export class ResourcePerformanceService extends Store.AbstractService {
    constructor() {
        super();
    }
    LoadResourceAggData(filtercriteria): Observable<Store.State> {
        //environment.api.session.login.endpoint
        filtercriteria["bucket"] = "3600";
        filtercriteria['limit'] = "250";
        //let path = 'netvision/rest/webapi/aggregateResource';
        let path = environment.api.netvision.aggregateResource.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?strOperName=aggregateResource&filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            console.log('LoadDomainAggData rest ', data);
            let a: any;
            let data1 = { 'data': data, 'charts': [], 'datarequest': [] };
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
    LoadResourceTrendData(filtercriteria): Observable<Store.State> {
        //environment.api.session.login.endpoint
        filtercriteria["bucket"] = "3600";
        //let path = 'netvision/rest/webapi/domainTrend';
        let path = environment.api.netvision.domainTrend.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?strOperName=domainTrend&filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new HomePageTabLoadingState());

        me.controller.get(path, null, base).subscribe((data: any) => {
            console.log('LoadDomainAggData rest ', data);
            let a: any;
            let data1 = { 'data': data, 'charts': [], 'datarequest': [] };
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

    LoadResourceAllTrendData(filtercriteria): Observable<Store.State> {
        //environment.api.session.login.endpoint
        filtercriteria["bucket"] = "3600";
        //let path = 'netvision/rest/webapi/allresourceTrend';
        let path = environment.api.netvision.allresourceTrend.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?strOperName=multiResourceTrend&filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new HomePageTabLoadingState());

        me.controller.get(path, null,base).subscribe((data: any) => {
            console.log('LoadDomainAggData rest ', data);
            let a: any;
            let data1 = { 'data': data, 'charts': [], 'datarequest': [] };
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
    getAllDomainTData(filtercriteria): Observable<Store.State> {
        //environment.api.session.login.endpoint
        filtercriteria["bucket"] = "3600";
        //let path = 'netvision/rest/webapi/alldomainTrend';
        let path = environment.api.netvision.alldomainTrend.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?strOperName=multiDomainTrend&filterCriteria=' + JSON.stringify(filtercriteria) + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new HomePageTabLoadingState());

        me.controller.get(path, null,base).subscribe((data: any) => {
            console.log('LoadDomainAggData rest ', data);
            let a: any;
            let data1 = { 'data': data, 'charts': [], 'datarequest': [] };
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
