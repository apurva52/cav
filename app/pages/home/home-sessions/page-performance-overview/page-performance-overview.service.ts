import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { FilterByLoadedState } from 'src/app/shared/dashboard/sidebars/advance-open-merge/service/select-item.state';
import { filter, map } from 'rxjs/operators';
interface CallBackServiceEvent {
    key: any;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})

export class PagePerformanceOverviewService extends Store.AbstractService {
    private _eventCallBack = new Subject<CallBackServiceEvent>();

    constructor() {
        super();
    }
    broadcast(key: any, data?: any) {
        this._eventCallBack.next({ key, data });
    }

    on<T>(key: any): Observable<T> {
        return this._eventCallBack.asObservable()
            .pipe(filter(event => event.key === key))
            .pipe(map(event => event.data as T));
    }
}
