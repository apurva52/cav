import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { SessionPageMenuOption } from './session-page.model';
import {
    DeviceInfoLoadedState, DeviceInfoLoadingErrorState, DeviceInfoLoadingState
} from './device-info-state';


@Injectable({
    providedIn: 'root'
})

export class DeviceInfoService extends Store.AbstractService {
    LoadDeviceInfoData(filters): Observable<Store.State> {
        let path = environment.api.netvision.sessionlist.endpoint;
        path = path + "?access_token=563e412ab7f5a282c15ae5de1732bfd1&filterCriteria="+JSON.stringify(filters);
        const me = this;
        const output = new Subject<Store.State>();
        me.controller.get(path, 'null', '/').subscribe((data1) => {
            //var r = { data: data1 }
            let temp = JSON.parse(unescape(data1.data[0].ff3)).dinfo;
            output.next(new DeviceInfoLoadedState(temp));
            output.complete();
        },
            (e: any) => {
                output.error(new DeviceInfoLoadingErrorState(e));


                me.logger.error('Device Info loading failed', e);
            }
        );
        return output;
    }

}





