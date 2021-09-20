import { Injectable } from '@angular/core';
import { Store } from '../../../../../core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from  '../../../../../../environments/environment';
import {
  JsErrorAggListLoadedState, JsErrorAggListLoadingErrorState,JsErrorAggListLoadingState
} from './js-error.state';
import { Util } from '../../common/util/util';
@Injectable({
  providedIn: 'root'
})

export class JsErrorService extends Store.AbstractService {
  
    LoadJsErrorAggListTableData(filter): Observable<Store.State> {
        //console.log("LoadJsErrorAggListTableData called");
        let f= JSON.parse(filter);
        if (f.timeFilter.startTime != '' && f.timeFilter.endTime != '') {
           f.timeFilter.startTime = Util.convertLocalTimeZoeToUTC(f.timeFilter.startTime);
           f.timeFilter.endTime = Util.convertLocalTimeZoeToUTC(f.timeFilter.endTime);
        }
        filter = encodeURIComponent(JSON.stringify(f));
        let base = environment.api.netvision.base.base;
        let path = 'netvision/rest/webapi/jserrors';
        let filters =  `?filterCriteria=`+filter+`&access_token=563e412ab7f5a282c15ae5de1732bfd1`;
        path = path + filters;
        //console.log("LoadJsErrorAggListTableData called with url : base : ", base + " and  path : " + path);
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        setTimeout(() => {
          output.next(new JsErrorAggListLoadingState(null));
        },0);
        me.controller.get(path,null,base).subscribe((data :any) => {
            //console.log(data);
            output.next(new JsErrorAggListLoadedState(data));
            output.complete();
            },
            (e : any) => {
                output.error(new JsErrorAggListLoadingErrorState(e));
                output.complete();
                 me.logger.error('Request failed', e);
            }
        );
        return output;
    }

}
