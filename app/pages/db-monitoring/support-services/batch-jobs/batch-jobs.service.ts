import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { GlobalTimebarTimeLoadedState } from 'src/app/shared/time-bar/service/time-bar.state';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { SqlSessionService } from '../../sql-activity/sql-sessions/sql-sessions.service';

@Injectable({
  providedIn: 'root'
})
export class BatchService extends Store.AbstractService {
  logger: any;
 
  constructor(private sessionService: SessionService,
    private dbmonService: DBMonitoringService,
    private sqlSessionService: SqlSessionService) {
      super();
     }
/*call to get table data */
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
       payload.avgCount = me.dbmonService.avgCount;
       payload.avgCounter = me.dbmonService.avgCounter;
       payload.sessionId = me.sqlSessionService.spid;

      const path = environment.api.dbMonitoring.batchJobs.endpoint;
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

              me.logger.error('Lock Stats is not loaded successfully');
          }
      );
      return output;
  }
  getPresetAndLoad(payload: DBMonCommonParam): Observable<Store.State>{

    const me = this;
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

/*call to get history table data */
loadHistory(jobId, historyIntervalInDays): Observable<Store.State> {
  const me = this;
  const output = new Subject<Store.State>();
  var payload = {} as DBMonCommonParam;
  setTimeout(() => {
      output.next(new DBMonitoringLoadingState());
  }, 0);
  payload = me.dbmonService.loadDefaultCommonParam(payload);
  const session = me.sessionService.session;
  if (session) {
          payload.cctx = me.sessionService.session.cctx;
          payload.tr = me.sessionService.testRun.id;
    }
      
       payload.avgCount = me.dbmonService.avgCount;
       payload.avgCounter = me.dbmonService.avgCounter;
     
      const path = environment.api.dbMonitoring.batchHistory.endpoint + '/' + jobId + '/' + historyIntervalInDays;
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

              me.logger.error('Job History Stats is not loaded successfully');
          }
      );
      return output;
  }
}
