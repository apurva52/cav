import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomePageTabLoadedState, HomePageTabLoadingErrorState } from './user-segment.state';
@Injectable({
    providedIn: 'root'
})
export class UserSegmentService extends Store.AbstractService {
    constructor() {
        super();
    }
    LoadUserSegmentData(): Observable<Store.State> {
        let path = environment.api.netvision.showUserSegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filters = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }


    addUserSegmentData(filter): Observable<Store.State> {
        let path = environment.api.netvision.addusersegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        let filters = "&name=" + filter.name + "&description=" + filter.description + "&icon=" + filter.icons;

        path = path + filterss + filters;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }

    updateUserSegmentData(filter): Observable<Store.State> {
        let path = environment.api.netvision.updateUserSegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        let filters = "&name=" + filter.name + "&description=" + filter.description + "&icon=" + filter.icons + "&ids=" + filter.usersegmentid;

        path = path + filterss + filters;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
    getBusinessProcessData(): Observable<Store.State> {
        let path = environment.api.netvision.showbusinessdata.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filterss;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }

    deleteUserSegmentData(id): Observable<Store.State> {
        let path = environment.api.netvision.deleteUserSegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        let url = "&ids=" + id;
        path = path + filterss + url;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }

    getrulesdata(): Observable<Store.State> {
        let path = environment.api.netvision.showUserSegmentRule.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filterss;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null,base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
    addnewRulessegment(filter): Observable<Store.State> {
        let path = environment.api.netvision.addanotherrulesusersegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        let filters = "&type=" + filter.type + "&arg1=" + encodeURIComponent(filter.arg1) + "&arg2=" + filter.arg2 + "&page=" + filter.pageidlist + "&ids=" + filter.usersegmentid;
        path = path + filterss + filters;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
    deleteRulessegment(filter): Observable<Store.State> {
        let path = environment.api.netvision.deleteruleUserSegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        let url = "&ids=" + filter;
        path = path + filterss + url;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
    editRulessegment(filter): Observable<Store.State> {
        let path = environment.api.netvision.addupdaterulesusersegment.endpoint;
        let base = environment.api.netvision.base.base;
        let filterss = '?access_token=563e412ab7f5a282c15ae5de1732bfd1';
        //let filters = "&type=" + filter.type + "&arg1=" + encodeURIComponent(filter.arg1) + "&arg2=" + filter.arg2 + "&page=" + filter.pageidlist + "&ids=" + filter.usersegmentid;
        let filters = "&type=" + filter.type + "&arg1=" + encodeURIComponent(filter.arg1) + "&arg2=" + filter.arg2 + "&page=" + filter.pageidlist + "&ids=" + filter.usersegmentid;
        path = path + filterss + filters;
        const me = this;

        const output = new Subject<Store.State>();
        me.controller.get(path, null, base).subscribe((data: any) => {
            let data1 = { 'data': data };
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new HomePageTabLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
}
