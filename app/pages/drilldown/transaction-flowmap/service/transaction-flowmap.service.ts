import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { TRANSACTION_FLOWMAP_DATA } from './transaction-flowmap.dummy';
import { TransactionFlowMapLoadingState, TransactionFlowMapLoadedState } from './transaction-flowmap.state';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TransactionFlowMapService extends Store.AbstractService {

  fp_DataID: string;
  flowpathInstance: string;
  tierName: string;
  serverName: string;
  appName: string;
  statusCode: string;
  startTimeStr: string;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  responseTime: number;
  RowData:any;


  constructor(
    private sessionService: SessionService,
   // private route: ActivatedRoute
  ) {
    super();

  }


  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TransactionFlowMapLoadingState());
    }, 0);

    /// DEV CODE ----------------->
 // getting fp data
 this.RowData = me.sessionService.getSetting("fpRowdata");
 if (this.RowData != null) {
  me.flowpathInstance = this.RowData.flowpathInstance;
  me.tierName = this.RowData.tierName;
  me.serverName = this.RowData.serverName;
  me.appName = this.RowData.appName;
  me.statusCode = this.RowData.status;
  me.startTimeStr = this.RowData.startTimeInMs;
  me.responseTimeStr = this.RowData.responseTime;
  me.startTime = parseInt(me.startTimeStr);
  me.responseTime = parseInt(me.responseTimeStr);
  me.endTime = me.startTime + me.responseTime;
}
//me.startTime = parseInt(me.startTimeStr);
//me.responseTime = parseInt(me.responseTimeStr);
//me.endTime = me.startTime + me.responseTime;

const path = environment.api.transactionFlowmapReport.load.endpoint;
const payload = {
  cctx: me.sessionService.session.cctx,
  testRun: me.sessionService.session.testRun.id,
  fpInstance: me.flowpathInstance,
  //tierName: me.tierName,
 // serverName: me.serverName,
 // appName: me.appName,
 // statusCode: me.statusCode,  
  startTime: me.startTime,
  endTime: me.endTime,
  object: "4",
  status: "-2",
  enableNewSQB: "10",
    enableDDRDebug: "2",
    ndeId: "0"
};


me.controller.post(path, payload).subscribe(
  (data) => {
    output.next(new TransactionFlowMapLoadedState(data));
    output.complete();
  },
  (e: any) => {
    output.error(new TransactionFlowMapLoadingState(e));
    output.complete();

    me.logger.error('Http Report Data loading failed', e);
  }
);
   /* setTimeout(() => {
      output.next(new TransactionFlowMapLoadedState(TRANSACTION_FLOWMAP_DATA));
      output.complete();
    }, 2000);*/

    // setTimeout(() => {
    //   output.error(new TransactionFlowMapLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: TransactionGroupTable) => {
    //     output.next(new TransactionFlowMapLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new TransactionFlowMapLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Transaction FlowMap Data loading failed', e);
    //   }
    // );

    return output;
  }
}
