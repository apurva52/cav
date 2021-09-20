import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { data } from 'jquery';
import { SessionService } from 'src/app/core/session/session.service';
import { EndToEndDataLoadedState, EndToEndDataLoadingErrorState, EndToEndDataLoadingState } from './end-to-end.state';
import { environment } from 'src/environments/environment';
import { EndToEnd, Duration } from './end-to-end.model';

@Injectable({
  providedIn: 'root',
})
export class EndToEndService extends Store.AbstractService {
  duration : Duration
  constructor(private sessionService: SessionService) {
    super();
  }

  load(duration : Duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    const path = environment.api.e2e.main.endpoint;
    const payload = {
      duration: duration,
      dataFilter: [0,1,2,3,4,5],
      cctx: me.sessionService.session.cctx,
      opType: 11,
      tr: me.sessionService.session.testRun.id,
      incTabular: true,
    };
    me.controller.post(path, payload).subscribe(
      (data: EndToEnd) => {
        output.next(new EndToEndDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new EndToEndDataLoadingErrorState(e));
        output.complete();

        me.logger.error('End-To-End Data loading failed', e);
      }
    );

    return output;
  }

  public createDuration(startTime: number, endTime: number, preset: string, viewBy: number): Duration {
    return {st: startTime, et: endTime, preset: preset, viewBy: viewBy}
  }

  public setDuration(duration: Duration) {
    this.duration = duration;
  }

  public getDuration(): Duration {
    return this.duration;
  }

}
