import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from './form-analytic-overall.state';
@Injectable({
    providedIn: 'root'
})
export class FormReportService extends Store.AbstractService {
    constructor() {
        super();
    }

    LoadFormAnalyticsData(st, et, last, channel, pagename): Observable<Store.State> {
        //let path = 'netvision/rest/webapi/formanalyticsreport';
        //let path = environment.api.netvision.formanalyticsreport.endpoint;
        // while making http call - 
        let newApiFlag = localStorage.getItem("fa.newApi") != "false";
        let path ;
        if (newApiFlag) {
            // call new apis
            path = environment.api.netvision.tsdbformanalyticsreport.endpoint;
        } else {
            // call old apis 
            path = environment.api.netvision.formanalyticsreport.endpoint;
        }
        //let path = environment.api.netvision.customMetrics.endpoint;
        let base = environment.api.netvision.base.base;
        let remoteAddress = window.location.origin + '/';
        console.log('base : ', base);
        //let remoteAddress = "https://10.20.0.81/";
        let filters = "?access_token=563e412ab7f5a282c15ae5de1732bfd1";
        filters += "&startTime=" + st +
            "&endTime=" + et +
            "&last=" + last +
            "&channel=" + channel +
            "&page=" + pagename +
            "&strOperName=overallform" +
            "&remoteAddress=" + encodeURIComponent(remoteAddress);
        path = path + filters;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => {
            output.next(new OverAllReportLoadingState());
        }, 0);
        me.controller.get(path, null, base).subscribe((data: any) => {
        /*
          data = { "pages": [{ "name": "ShoppingCheckout", "view": 10, "forms": [{ "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "shipping_addressy_form_v3", "interaction": 5.0, "submit": 2.0, "failed": 3.0 }] }, { "name": "SAIndex", "view": 4, "forms": [{ "name": "form2", "interaction": 30.0, "submit": 3.0, "failed": 1.0 }, { "name": "store_locator_form", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "kohls_login", "interaction": 100.0, "submit": 100.0, "failed": 100.0 }, { "name": "kohls_create_acct", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Home", "view": 7, "forms": [{ "name": "site-search", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "form2", "interaction": 100.0, "submit": 100.0, "failed": 100.0 }, { "name": "store_locator_form", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "SACheckout", "view": 104, "forms": [{ "name": "roboFilterForm", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Catalog", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "SearchResult", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "ShoppingBag", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Login", "view": 4, "forms": [{ "name": "kohls_login", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "kohls_create_acct", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Product", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }] };
         */
            let data1 = { 'data': data, 'formdataa': null };
            output.next(new OverAllReportLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new OverAllReportLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
}
