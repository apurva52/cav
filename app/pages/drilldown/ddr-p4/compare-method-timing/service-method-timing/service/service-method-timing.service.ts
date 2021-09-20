import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { SERVICE_METHOD_TIMING_DATA } from './service-method-timing.dummy';
import { ServiceMethodTimingData } from './service-method-timing.model';
import { ServiceMethodTimingLoadedState, ServiceMethodTimingLoadingErrorState, ServiceMethodTimingLoadingState } from './service-method-timing.state';

@Injectable({
  providedIn: 'root',
})
export class ServiceMethodTimingService extends Store.AbstractService {
  stateID: string;
  tierName: string;
  serverName: string;
  instanceName: string;

  constructor(private sessionService: SessionService) {
    super();
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ServiceMethodTimingLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new ServiceMethodTimingLoadedState(SERVICE_METHOD_TIMING_DATA));
      output.complete();
    }, 2000);

    setTimeout(() => {
      output.error(new ServiceMethodTimingLoadingErrorState(new Error()));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.methodTiming.load.endpoint;
    // const payload = {
    //   cctx: me.sessionService.session.cctx,
    //   testRun: me.sessionService.session.testRun.id,
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: ServiceMethodTimingData) => {
    //     output.next(new ServiceMethodTimingLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new ServiceMethodTimingLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Method Summary loading failed', e);
    //   }
    // );

    return output;
  }
}
