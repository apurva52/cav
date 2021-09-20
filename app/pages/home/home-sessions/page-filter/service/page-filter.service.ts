import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    PageListLoadedState, PageListLoadingErrorState, PageListLoadingState
} from './page-filter.state';
import { PageFilters } from '../../common/interfaces/pagefilter';
import { Util } from '../../common/util/util';
@Injectable({
  providedIn: 'root'
})

export class PageListService extends Store.AbstractService {
  
    LoadPageListTableData(filter: PageFilters): Observable<Store.State> {
        let base = environment.api.netvision.base.base;
        let path = 'netvision/rest/webapi/dataServicepage';

        if (filter.timeFilter.last == '' || filter.timeFilter.last == null) {
	     filter = JSON.parse(JSON.stringify(filter));
            filter.timeFilter.startTime = Util.convertLocalTimeZoeToUTC(filter.timeFilter.startTime);
            filter.timeFilter.endTime = Util.convertLocalTimeZoeToUTC(filter.timeFilter.endTime); 
        }

        let filters = '?strOprName=pageInfo&filterCriteria='+(JSON.stringify(filter))+'&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new PageListLoadingState(null));
        me.controller.get(path,null,base).subscribe((data1 :any) => {
            var r = {data: data1 , 'filtermode': null}
            output.next(new PageListLoadedState(r));
            output.complete();
        },
            (error) => {
                // output.error(new UserMenuOptionLoadingErrorState(e));
                

                //me.logger.error('User Options loading failed', e);
            }
        );
        return output;
    }

}
