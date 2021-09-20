import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    EventLoadedState, EventLoadingErrorState, EventLoadingState
} from './events-state';


@Injectable({
    providedIn: 'root'
})

export class EventService extends Store.AbstractService {
    LoadEventsData(page,session): Observable<Store.State> {
        let path = environment.api.netvision.events.endpoint;
        let base = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        output.next(new EventLoadingState(null));
        let filters = "?duration=" + session.duration + "&currentSessionId=" + page.sid + "&pageInstance=" + page.pageinstance + "&pageId=-1&eventList=" + page.eventListData;
        path = path + filters;
        me.controller.get(path, null, base).subscribe((data1) => {

            var r = { data: data1 }
            output.next(new EventLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new EventLoadingErrorState(e));
                me.logger.error('Event loading failed', e);
            }
        );
        return output;
    }

}
