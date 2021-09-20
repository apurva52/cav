import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { GlobalTimebarTimeLoadedState } from 'src/app/shared/time-bar/service/time-bar.state';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { DBQueryStatsParam } from '../db-query-stats/services/db-query-stats.model';

@Injectable({
  providedIn: 'root'
})
export class IOService extends Store.AbstractService {
  logger: any;
 
  constructor(private sessionService: SessionService,
    private dbmonService: DBMonitoringService) {
      super();
     }
/*load table data */
load(payload: DBMonCommonParam): Observable<Store.State> {
  const me = this;
  const output = new Subject<Store.State>();

  setTimeout(() => {
      output.next(new DBMonitoringLoadingState());
  }, 0);
  const session = me.sessionService.session;
  payload = me.dbmonService.loadDefaultCommonParam(payload);
  if (session) {
          payload.cctx = me.sessionService.session.cctx;
          payload.tr = me.sessionService.testRun.id;
    }
        
      payload.updateRealTimeStamp = -1;
      payload.drilldownSessionId = -1;
      const path = environment.api.dbMonitoring.ioFileStats.endpoint;
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

  /*load graph Data*/
loadGraph(dbName, fileType): Observable<Store.State> {
  const me = this;
  const output = new Subject<Store.State>();
  let payload = {} as DBMonCommonParam;
  payload.fileType = fileType;
  payload.databaseName = dbName;
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
      
      const path = environment.api.dbMonitoring.ioFileStatGraphData.endpoint;
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

              me.logger.error('Lock Stats Graph is not loaded successfully');
          }
      );
      return output;
  }
}
