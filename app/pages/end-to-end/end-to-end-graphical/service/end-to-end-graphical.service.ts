import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { EndToEndGraphical } from './end-to-end-graphical.model';
import { EndToEndGraphicalDataLoadedState, EndToEndGraphicalDataLoadingState, EndToEndGraphicalDataLoadingErrorState} from './end-to-end-graphical.state';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { Duration } from './end-to-end-graphical.model';

@Injectable({
  providedIn: 'root',
})
export class EndToEndGraphicalService extends Store.AbstractService {
  duration : Duration
  constructor(private sessionService: SessionService) {
    super();
  }

  load(duration : Duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new EndToEndGraphicalDataLoadingState());
    }, 0);
    
    const path = environment.api.e2e.main.endpoint;
    const payload = {
      duration: duration,
      dataFilter: [0,1,2,3,4,5],
      cctx: me.sessionService.session.cctx,
      opType: 11,
      tr: me.sessionService.session.testRun.id,
    };
    me.controller.post(path, payload).subscribe(
      (data: EndToEndGraphical) => {
        output.next(new EndToEndGraphicalDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new EndToEndGraphicalDataLoadingErrorState(e));
        output.complete();

        me.logger.error('End-To-End Graphical loading failed', e);
      }
    );
     
    return output;
  }
  
  flowmapInfo(): Observable<Object> {
    const me = this;
    const output = new Subject<Object>();
    
    const path = environment.api.e2e.onlineFlowmapInfo.endpoint;
    const payload = {
      flowMapDir : ".flowmaps",
      flowMapName : "FM10"
    };
    me.controller.post(path, payload).subscribe(
      (data: Object) => {
        output.next(data);
        output.complete();
      },
      (e: any) => {
        output.error(e);
        output.complete();

        me.logger.error('End-To-End Graphical Edit failed', e);
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
