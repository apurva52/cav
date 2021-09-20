import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadingState, DBMonitoringLoadingStatus } from '../../../db-monitoring.state';
import { DBMonitoringService } from '../../../services/db-monitoring.services';
import { DBMonCommonParam } from '../../../services/request-payload.model';
import { DBQueryStatsParam } from './db-query-stats.model';
import { MenuItem, TreeNode } from 'primeng';
import { Duration } from 'src/assets/dummyData/data-call-res.model';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState } from 'src/app/shared/time-bar/service/time-bar.state';

@Injectable({
  providedIn: 'root'
})
export class DbQueryStatsService extends Store.AbstractService{
  /**Observable used to send response from one component to another*/
  public sendBroadcaster = new Subject<any>();
  public queryCount:number=20;
  queryBasis:string='I/O';
  query: string;
  dbOptions: any [];
  selectedOptions: MenuItem;
  selectedSqlId: number;
  /*Service Observable for getting Tier name*/
 receiveProvider$ = this.sendBroadcaster.asObservable();
  constructor(private sessionService: SessionService,
    private dbmonService: DBMonitoringService) {
    super();
  }
  /**Setter of dbServerName */
	public set $queryCount(val) {
		this.queryCount = val;	
		}
	
		/**Getter of dbServerName */
		public get $queryCount() {
			return this.queryCount;
		}

    /**Setter of dbServerName */
	public set $queryBasis(val) {
		this.queryBasis = val;	
		}
	
		/**Getter of dbServerName */
		public get $queryBasis() {
			return this.queryBasis;
		}

    
getPresetAndLoad(payload: DBQueryStatsParam): Observable<Store.State>{

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

load(payload: DBQueryStatsParam): Observable<Store.State> {
  const me = this;
  
  const output = new Subject<Store.State>();
  setTimeout(() => {
      output.next(new DBMonitoringLoadingState());
  }, 0);
  const session = me.sessionService.session;
  if (session) {
    payload.cctx = session.cctx;
    payload.tr = me.sessionService.testRun.id;
  }    
  payload.dataSourceName = me.dbmonService.dataSource;
  payload.dbType = me.dbmonService.dbType;
  payload.duration = me.dbmonService.duration;
  // payload.duration = {
  //   // st : 123,
  //   // et: 345,
  //   preset : me.dbmonService.selectedPreset
  // }
  // payload.endOffset = 
  // payload.startOffset = ;
  payload.queryBasis = me.queryBasis;
  payload.queryCount = me.queryCount;
  payload.globalId = me.dbmonService.globalId;
  payload.isAggregrate = me.dbmonService.isAggregate;
  payload.isFirstCall = false;
  payload.isPresetChanged = true;
  payload.drillDownTime = '';//need to bind
  if(me.sessionService.isMultiDC){
    payload.subject = me.dbmonService.subject;
  }
  // payload.isRealTime = false;
  
  // payload.isRealTimeAppled = me.dbmonService.isRealTimeAppled;

      const path = environment.api.dbMonitoring.executionStats.endpoint;
      me.controller.post(path, payload).subscribe(
          (result: any) => {
            const state = new DBMonitoringLoadedState();
              if (result != undefined) {
                state.data = result;
                  output.next(state); 
                // me.sendBroadcaster.next(true);
                  return;
              }
          },
          (e: any) => {
              output.error(new DBMonitoringLoadingErrorStatus(e));
              output.complete();

              me.logger.error('DBQueryStats is not loaded successfully', e);
          }
      );
      return output;
  }

  

loadPlan(payload: DBQueryStatsParam, planHandle): Observable<Store.State> {
  const me = this;
  
  const output = new Subject<Store.State>();
  setTimeout(() => {
      output.next(new DBMonitoringLoadingState());
  }, 0);
  const session = me.sessionService.session;
  if (session) {
    payload.cctx = session.cctx;
    payload.tr = me.sessionService.testRun.id;
  }
  payload.dataSourceName = me.dbmonService.dataSource;
  payload.dbType = me.dbmonService.dbType;
  payload.duration = me.dbmonService.duration;
  payload.queryBasis = me.queryBasis;
  payload.queryCount = me.queryCount;
  payload.globalId = me.dbmonService.globalId;
  payload.isAggregrate = me.dbmonService.isAggregate;
  payload.isFirstCall = false;
  payload.isPresetChanged = true;
  // payload.drillDownTime = '';//need to bind
  // payload.isRealTime = false;
  
  // payload.isRealTimeAppled = me.dbmonService.isRealTimeAppled;

      const path = environment.api.dbMonitoring.executionPlan.endpoint + '/' + planHandle;
      me.controller.post(path, payload).subscribe(
          (result: any) => {
            const state = new DBMonitoringLoadedState();
              if (result != undefined) {
                state.data = result;
                  output.next(state); 
                // me.sendBroadcaster.next(true);
                  return;
              }
          },
          (e: any) => {
              output.error(new DBMonitoringLoadingErrorStatus(e));
              output.complete();

              me.logger.error('Execution plan is not loaded successfully', e);
          }
      );
      return output;
  }

  /* Method to download the raw plan file.*/
  downloadSqlPlanXML() {
    const me = this;
    let payload={} as DBMonCommonParam;
    try {
      const session = me.sessionService.session;
      if (session) {
        payload.cctx = session.cctx;
        payload.tr = me.sessionService.testRun.id;
      }
      payload.dataSourceName = me.dbmonService.dataSource;
      payload.dbType = me.dbmonService.dbType;
      payload.duration = me.dbmonService.duration;
      payload.globalId = me.dbmonService.globalId;
      payload.isAggregrate = me.dbmonService.isAggregate;
      payload.selectedSqlId = me.selectedSqlId;
      let path = environment.api.dbMonitoring.downloadExecutionPlan.endpoint;
      
      let  isActual = false;
      // if(document.getElementById('actualPlanScrollDiv').style.display == 'block')
      // path += '&isActual=' + !isActual;
      // else
      path += '/' + isActual;

      this.logger.debug('Downloading downloadExecutionPlan... downloadUrl= ', path);
      me.controller.postReceiveBlob(path, payload).subscribe(
        (res) => {
            if (res != undefined) {
              import('file-saver').then(FileSaver => {
                FileSaver.saveAs(res, 'ExecutionPlan.xml');
              });
                return;
            }
        },
        (e: any) => {
            me.logger.error('Execution plan is not downloaded successfully', e);
        }
      );
    } catch (e) {
      me.logger.error('Error in downloadSqlPlanXML() ', e);
    }
  }
}
