import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { GlobalTimebarTimeLoadedState } from 'src/app/shared/time-bar/service/time-bar.state';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonCommonParam } from '../../services/request-payload.model';

@Injectable({
  providedIn: 'root'
})
export class CustomQueryService extends Store.AbstractService {
  public sendBroadcaster = new Subject<any>();
  receiveProvider$ = this.sendBroadcaster.asObservable();

  constructor(private sessionService: SessionService,
    private dbmonService: DBMonitoringService) {
    super();
  }
  load(payload: DBMonCommonParam, requestedQuery: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
  
    setTimeout(() => {
        output.next(new DBMonitoringLoadingState());
    }, 0);
    const session = me.sessionService.session;
    requestedQuery = requestedQuery.replace(/\n/g, " ");
    if (session) {
            payload.cctx = me.sessionService.session.cctx;
            payload.tr = me.sessionService.testRun.id;
    }
            payload.dataSourceName = me.dbmonService.dataSource;
            payload.dbType = me.dbmonService.dbType;
           payload.globalId = me.dbmonService.globalId;//need to bind
           if(me.sessionService.isMultiDC){
            payload.subject = me.dbmonService.subject;
          }
  
        const path = environment.api.dbMonitoring.queryInfo.endpoint;
        payload.query =  requestedQuery;
  
        me.controller.post(path, payload).subscribe(
            (result: any) => {
              const state = new DBMonitoringLoadedState();
                if (result != undefined) {
                  state.data = result;
                  output.next(state);
                  me.sendBroadcaster.next(state.data['jsonArray']);
  
                    return;
                }
            },
            (e: any) => {
                output.error(new DBMonitoringLoadingErrorStatus(e));
                output.complete();
  
                me.logger.error('Service-logs is not loaded successfully');
            }
        );
        return output;
    }
    
}
