import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from './overall-report.state';
@Injectable({
    providedIn: 'root'
})
export class FormReportService extends Store.AbstractService {
    constructor() {
        super();
    }

    LoadFormAnalyticsDetailData(st, et, last, channel, pagename, formname): Observable<Store.State> {
        //let path = 'netvision/rest/webapi/formanalyticsreport';
        //let path = environment.api.netvision.customMetrics.endpoint;
        let newApiFlag = localStorage.getItem("fa.newApi") != "false";
        let path ;
        if (newApiFlag) {
            // call new apis
            path = environment.api.netvision.tsdbformanalyticsreport.endpoint;
        } else {
            // call old apis 
            path = environment.api.netvision.formanalyticsreport.endpoint;
        }
        let base = environment.api.netvision.base.base;
        let remoteAddress = window.location.origin + '/';
        //let remoteAddress = "https://10.20.0.81/";
        let filters = "?access_token=563e412ab7f5a282c15ae5de1732bfd1";
        filters += "&startTime=" + st +
            "&endTime=" + et +
            "&last=" + last +
            "&channel=" + channel +
            "&page=" + pagename +
            "&formName=" + formname +
            "&strOperName=formAnalytics" +
            "&remoteAddress=" + encodeURIComponent(remoteAddress);
        path = path + filters;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => {
            output.next(new OverAllReportLoadingState());
        }, 0);
        me.controller.get(path, null, base).subscribe((data: any) => {
            /* data = { "totalPageView": 2, "totalUniqueFormInteraction": 1.0, "totalUniqueFormSubmit": 0.0, "totalFormSubmit": 0.0, "totalUniqueFailedSubmit": 0.0, "avgFillDuration": 0.0, "avgBlankField": 0.0, "avgRefilledField": 0.0, "fillDurationSampleCounts": 0.0, "blankFieldSampleCounts": 60, "refilledFieldSampleCounts": 60, "fields": [{ "name": "filtername", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.753, "avgHesitationDuration": 0.392, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "filterlname", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 2.16, "avgHesitationDuration": 0.054, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "street", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 2.147, "avgHesitationDuration": 0.038, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "zip", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.321, "avgHesitationDuration": 0.007, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "tel", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.314, "avgHesitationDuration": 0.035, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "filteremail", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 3.549, "avgHesitationDuration": 0.008, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "optradio", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }, { "name": "fname", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.309, "avgHesitationDuration": 0.114, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "lname", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 2.319, "avgHesitationDuration": 0.04, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "email", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.608, "avgHesitationDuration": 0.004, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "birthday", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 4.279, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 1.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 0 }, { "name": "ocbtnfilter", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }] };
           */
            let data1 = {                'data': data, 'totalUniqueFormSubmitt': null, 'reportformdata': null, 'conversiondata': null, 'timereportdata': null, 'formfieldnamedrop': null, 'formfieldnameblank': null, 'formfieldnamehesitation': null, 'formfieldnamerefill': null, 'reportformdatafield': null, 'setPageName': null, 'formfilter': null, 'overallformfiltercriteria': null, 'setformName': null            };

            output.next(new OverAllReportLoadedState(data1));
            output.complete();
        }, (error) => {
            output.next(new OverAllReportLoadingErrorState(error));
            output.complete();
        });
        return output;
    }
}
