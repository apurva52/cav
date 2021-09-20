import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { Util } from '../../../common/util/util'
import { environment } from 'src/environments/environment';
import {
    HttpLoadedState, HttpLoadingErrorState, HttpLoadingState
} from './http-request-state';


@Injectable({
    providedIn: 'root'
})

export class HttpService extends Store.AbstractService {
    LoadHttpData(page,session): Observable<Store.State> {
        let path = environment.api.netvision.httprequest.endpoint;
        let base = environment.api.netvision.base.base;
        const me = this;
        let duration = Util.FormattedDurationToSec(session.duration);
        const output = new Subject<Store.State>();
        output.next(new HttpLoadingState(null));
        let filters = "?strOperName=getAjaxdata&nvSessionId=" + page.sid + "&pageinstance=" + page.pageinstance + "&duration=" + duration;
        path = path + filters;
        me.controller.get(path, null, base).subscribe((data1) => {

            var r = { data: data1 }
            output.next(new HttpLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new HttpLoadingErrorState(e));
                me.logger.error('User Options loading failed', e);
            }
        );
        return output;
    }

}
