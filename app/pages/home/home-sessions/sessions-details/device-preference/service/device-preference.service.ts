import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    DevicePreferenceLoadedState, DevicePreferenceLoadingErrorState, DevicePreferenceLoadingState
} from './device-preference.state';


@Injectable({
    providedIn: 'root'
})

export class DevicePreferenceService extends Store.AbstractService {
    LoadDevicePreferenceData(session): Observable<Store.State> {
        let path = environment.api.netvision.deviceperformance.endpoint;
        let base = environment.api.netvision.base.base;
        path = path + "?sid=" + session.sid + "&startTime=" + session.startTime + "&endTime=" + session.endTime;
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => { output.next(new DevicePreferenceLoadingState(null)) }, 0);
        me.controller.get(path, 'null', base).subscribe((data1) => {
            var r = { data: data1 }
            output.next(new DevicePreferenceLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new DevicePreferenceLoadingErrorState(e));
                me.logger.error('Device Info loading failed', e);
                output.complete();
            }
        );
        return output;
    }

}






