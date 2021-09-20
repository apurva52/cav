import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
//import { HttpClient, HttpErrorResponse } from "@angular/common/http";
@Injectable({
    providedIn: 'root'
})
export class NVDDRService extends Store.AbstractService {

    /* List of Group Id's to check for Drill down menu's in Netvision product type. */
    static groupIdArrayListForDrillDownMenu = [10233, 10231, 10234, 10232, 10235, 10230, 10748, 10229, 10225, 10211,
            10209, 10580, 10488, 10210, 10268, 10208, 10213, 10212, 10216, 10214, 10579, 10215, 10269, 10218, 10217,
            10396, 10267, 14019, 14020, 10408, 10390, 10391, 10393, 10394, 10392, 10395, 10370, 10371, 10403, 10407,
            10406, 10404, 10557, 10687, 10559, 10558, 10409, 10685, 10402, 10399, 10401, 10554, 10553, 10555, 10686,
            10684, 10400, 10397, 10398, 10743, 10480, 10478, 10455];


    //http: HttpClient;
    ddrtonv(event, mgId, me) : boolean {
        // check if NV DDR.
        let isNvGroup = NVDDRService.groupIdArrayListForDrillDownMenu.indexOf(parseInt(mgId)) != -1;
        if (!isNvGroup) return false;

        console.log('event NVDDRService : ', event);
         let vectorname = "";
            let vectormetadata = "";
            for (let i = 0; i < event.item.state.subject.tags.length; i++) {
              if (i == 0) {
                vectorname = event.item.state.subject.tags[i].value;
                vectormetadata = event.item.state.subject.tags[i].key;
              }
              else {
                vectorname += ">" + event.item.state.subject.tags[i].value;
                vectormetadata += ">" + event.item.state.subject.tags[i].key;
              }
            }
        let url = '/netvision/integration.jsp?strOprName=drillDownFromWD' + '&startTime=' + me.getTime()[0]["startTime"] + '&endTime=' +
            me.getTime()[0]["endTime"] + '&vectorName=' + vectorname + '&vectorMetaData=' + vectormetadata
            + '&groupId=' + event.item.state.measure.mgId + '&groupName=' + event.item.state.measure.mg + '&graphId=' + event.item.state.measure.metricId +
            '&graphName=' + event.item.state.measure.metric + '&isOnline=true' +
            '&graphTimeKey=' + me.getTime()[0]["graphTimeKey"] + '&userName=guest' +
            '&opHierarchy=' + event.item.state.menuHierarchy + '&customData=';

        me.http.get(url, { responseType: 'text' }).subscribe((response) => {
            let pagesurl: any = response;

            // some script was coming in response so to avoid garbage thing -
            pagesurl = pagesurl.trim().split('\n')[0];

            if (pagesurl.trim().includes('/home/netvision/')) {
                if (pagesurl.trim().includes('/home/netvision/sessions'))
                    pagesurl = pagesurl.replace('/home/netvision/sessions', '/home/home-sessions');
                 else if(pagesurl.trim().includes('/home/netvision/pages'))
                    pagesurl = pagesurl.replace('/home/netvision/pages','/page-filter');
                 else if (pagesurl.trim().includes('/home/netvision/rumperformance'))
                    pagesurl = pagesurl.replace('/home/netvision/rumperformance', '/performance-details');
                else if (pagesurl.trim().includes('/home/netvision/xhrAggRequest'))
                    pagesurl = pagesurl.replace('/home/netvision/xhrAggRequest', '/http-filter');
                const ddrurlfinal = pagesurl.trim().split('?');
                if (ddrurlfinal[1].includes('&')) {
                    const urlextrapart = ddrurlfinal[1].split('&');
                    const queryParams = {};
                    urlextrapart.forEach(function (entry) {
                        const e = entry.split('=');
                        queryParams[e[0]] = e[1];
                    });
                    queryParams['from'] = 'dashboard';
                    console.log('ddrurlfinal if : ', ddrurlfinal);
                    me.router.navigate([ddrurlfinal[0]], { queryParams: queryParams, replaceUrl: true });
                } else {
                    console.log('ddrurlfinal else : ', ddrurlfinal);
                    me.router.navigate([ddrurlfinal[0]], { queryParams: { 'filterCriteria': ddrurlfinal[1].split('=')[1], from: 'dashboard' }, replaceUrl: true });
                }
            } else {
                window.open(url);
            }
        });

        return true;
    }

    ddrToNVForGeoMap(geoMapObj, startTime, endTime, graphTimeKey, http , router) : boolean {


       let url = '/netvision/integration.jsp?strOprName=drillDownFromWD' + '&startTime=' + startTime + '&endTime=' +
       endTime + "&vectorName=" + geoMapObj['vectorName'] + "&groupId=" + geoMapObj['groupId'] + "&graphName=" +
       geoMapObj['metricName'] + "&isOnline=true" + "&graphTimeKey=" + graphTimeKey + "&userName=guest";
        http.get(url, { responseType: 'text' }).subscribe((response) => {
            let pagesurl: any = response;

            // some script was coming in response so to avoid garbage thing -
            pagesurl = pagesurl.trim().split('\n')[0];

            if (pagesurl.trim().includes('/home/netvision/')) {
                if (pagesurl.trim().includes('/home/netvision/sessions'))
                    pagesurl = pagesurl.replace('/home/netvision/sessions', '/home/home-sessions');
                 else if(pagesurl.trim().includes('/home/netvision/pages'))
                    pagesurl = pagesurl.replace('/home/netvision/pages','/page-filter');
                 else if (pagesurl.trim().includes('/home/netvision/rumperformance'))
                    pagesurl = pagesurl.replace('/home/netvision/rumperformance', '/performance-details');
                else if (pagesurl.trim().includes('/home/netvision/xhrAggRequest'))
                    pagesurl = pagesurl.replace('/home/netvision/xhrAggRequest', '/http-filter');
                const ddrurlfinal = pagesurl.trim().split('?');
                if (ddrurlfinal[1].includes('&')) {
                    const urlextrapart = ddrurlfinal[1].split('&');
                    const queryParams = {};
                    urlextrapart.forEach(function (entry) {
                        const e = entry.split('=');
                        queryParams[e[0]] = e[1];
                    });
                    queryParams['from'] = 'dashboard';
                    console.log('ddrurlfinal if : ', ddrurlfinal);
                    router.navigate([ddrurlfinal[0]], { queryParams: queryParams, replaceUrl: true });
                } else {
                    console.log('ddrurlfinal else : ', ddrurlfinal);
                    router.navigate([ddrurlfinal[0]], { queryParams: { 'filterCriteria': ddrurlfinal[1].split('=')[1], from: 'dashboard' }, replaceUrl: true });
                }
            } else {
                window.open(url);
            }
        });

        return true;
    }
}
