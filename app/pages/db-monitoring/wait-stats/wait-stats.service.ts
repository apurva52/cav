import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { GlobalTimebarTimeLoadedState } from 'src/app/shared/time-bar/service/time-bar.state';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadingState } from '../db-monitoring.state';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { DBMonCommonParam } from '../services/request-payload.model';

@Injectable({
  providedIn: 'root'
})
export class WaitStatsService extends Store.AbstractService {
  logger: any;
 
  constructor(private sessionService: SessionService,
    private dbmonService: DBMonitoringService) {
      super();
     }

     load(payload: DBMonCommonParam): Observable<Store.State> {
  const me = this;
  const output = new Subject<Store.State>();

  setTimeout(() => {
      output.next(new DBMonitoringLoadingState());
  }, 0);
  payload = me.dbmonService.loadDefaultCommonParam(payload);
  const session = me.sessionService.session;
  if (session) {
          payload.cctx = me.sessionService.session.cctx;
          payload.tr = me.sessionService.testRun.id;
    }
       payload.updateRealTimeStamp = -1;
      const path = environment.api.dbMonitoring.waitStats.endpoint;
      me.controller.post(path, payload).subscribe(
          (result: any) => {
            const state = new DBMonitoringLoadedState();
              if (result != undefined) {
                state.data = result;
                output.next(state);

                  return;
              }
          },
          (e: any) => {
              output.error(new DBMonitoringLoadingErrorStatus(e));
              output.complete();

              me.logger.error('Wait Stats is not loaded successfully');
          }
      );
      return output;
  }
  getPresetAndLoad(): Observable<Store.State>{

    const me = this;
    const payload = {} as DBMonCommonParam;
    const output = new Subject<Store.State>();
    
      me.dbmonService.getPresetTime().subscribe(
        (state: Store.State) => {
          
          if (state instanceof GlobalTimebarTimeLoadedState) {
            me.load(payload).subscribe(
              (state: Store.State) => {
                if (state instanceof DBMonitoringLoadedState) {
                  output.next(state);
                }
              }
              );
            return;
          }
        });
  
        return output;
  }
}
