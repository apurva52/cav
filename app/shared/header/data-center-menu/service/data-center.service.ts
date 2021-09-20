import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DataCenterLoadedState, DataCenterLoadingState } from './data-center.state';

@Injectable({
  providedIn: 'root',
})
export class DataCenterService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DataCenterLoadingState());
    }, 0);

    // TODO: activate reload status

    setTimeout(() => {
      output.next(new DataCenterLoadedState(me.sessionService.preSession.dcData));
    }, 0);

    // const path = environment.api.dataCenters.load.endpoint;

    // me.controller.get(path).subscribe(
    //   (data: DataCenter[]) => {
    //     output.next(new DataCenterLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new DataCenterLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('DataCenters loading failed', e);
    //   }
    // );

    return output;
  }
}
