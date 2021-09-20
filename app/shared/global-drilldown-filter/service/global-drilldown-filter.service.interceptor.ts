import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
//import { data } from 'jquery';
import { GlobalDrillDownFilterService } from './global-drilldown-filter.service';
import { reject } from 'lodash';



export class GlobalDrilldownServiceInterceptor extends Store.AbstractService {
    data1: any;
    // private output = new Subject<any>();
    constructor(
        private globalDrillDownFilterService: GlobalDrillDownFilterService,
        private sessionService: SessionService
    ) {
        super();
    }

    loadSomeRest() {
        console.log("I am inside the load function of the interceptor...");
        const me = this;
        const output = new Subject<any>();
        let type = me.sessionService.getSetting("metaDataType");
        const path = environment.api.metadata.load.endpoint;
        const payload = {
            metaDataType: type,
            testRun: me.sessionService.testRun.id,
        };

        me.controller.post(path, payload).subscribe(
            (data: any) => {
                output.next(data);
                output.complete();
            });
        return output;
    }

}