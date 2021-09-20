import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  MonitorLoadingState,
  MonitorLoadedState,
  MonitorLoadingErrorState,
} from './monitor.state';
import { MonitorResponse } from './monitor.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MonitorService extends Store.AbstractService {
  // load(): Observable<Store.State> {
  //   const me = this;
  //   const output = new Subject<Store.State>();

  //   setTimeout(() => {
  //     output.next(new MonitorLoadingState());
  //   }, 0);

  //   // const path = environment.api.monitor.load.endpoint;

  //   me.controller.get(path).subscribe(
  //     (data: MonitorResponse) => {
  //       output.next(new MonitorLoadedState(data));
  //       output.complete();
  //     },
  //     (e: any) => {
  //       output.error(new MonitorLoadingErrorState(e));
  //       output.complete();

  //       me.logger.error('Monitor Loading failed', e);
  //     }
  //   );

  //   return output;
  // }
}
