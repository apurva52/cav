import { Injectable } from '@angular/core';
import { Store } from '../../../../../core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from  '../../../../../../environments/environment';
import {
    HttpAggListLoadedState, HttpAggListLoadingErrorState, HttpAggListLoadingState
} from './http-filter.state';
import { Util } from '../../common/util/util';
@Injectable({
  providedIn: 'root'
})

export class HttpDataService extends Store.AbstractService {
  
    LoadHttpAggListTableData(filter): Observable<Store.State> {
        let base = environment.api.netvision.base.base;
        let path = 'netvision/rest/webapi/httpAggRequestData';
        filter = JSON.parse(filter);
        if (filter.timeFilter.last == null || filter.timeFilter.last == '') {
            // change starttime and endtime in UTC format.
            filter.timeFilter.startTime = Util.convertLocalTimeZoeToUTC(filter.timeFilter.startTime);
            filter.timeFilter.endTime = Util.convertLocalTimeZoeToUTC(filter.timeFilter.endTime);
        }
        filter = JSON.stringify(filter);
        let filters = '?filterCriteria='+filter+'&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        setTimeout(() => {
          output.next(new HttpAggListLoadingState(null));
        },0);
        me.controller.get(path,null,base).subscribe((data :any) => {
            output.next(new HttpAggListLoadedState(data));
            output.complete();
            },
            (e : any) => {
                output.error(new HttpAggListLoadingErrorState(e));
                output.complete();
                 me.logger.error('Request failed', e);
            }
        );
        return output;
    }

}
