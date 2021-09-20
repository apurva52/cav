import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { Session } from '../../../../core/session/session.model';
import { DBMonReq, DBMonCommonParam } from '../../services/request-payload.model';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { MenuItem } from 'primeng';
import { GlobalTimebarTimeLoadedState } from 'src/app/shared/time-bar/service/time-bar.state';
@Injectable({
  providedIn: 'root'
})
export class DeadlockSessionService extends Store.AbstractService{
  /**Observable used to send response from one component to another*/
  public sendBroadcaster = new Subject<any>();
  controller: any;
  query: string;
  dbOptions: MenuItem[];
  selectedOptions: MenuItem;
  isPresetChanged
  private timeStampForBlockingStat = -1;  

  /*Service Observable for getting Tier name*/
 receiveProvider$ = this.sendBroadcaster.asObservable();
  constructor(private sessionService: SessionService,
    private dbmonService: DBMonitoringService) {
    super();
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
        payload.dataSourceName = me.dbmonService.dataSource;
        payload.dbType = me.dbmonService.dbType;
        payload.duration = me.dbmonService.duration;
        payload.globalId = me.dbmonService.globalId;
         payload.isAggregrate = me.dbmonService.isAggregate;
         payload.isFirstCall = false;
         payload.isPresetChanged = true;
         payload.drillDownTime = '';//need to bind
         if(me.sessionService.isMultiDC){
          payload.subject = me.dbmonService.subject;
        }  
        const path = environment.api.dbMonitoring.deadLockStats.endpoint;
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

                me.logger.error('DeadlockStats is not loaded successfully', e);
            }
        );
        return output;
    }
}