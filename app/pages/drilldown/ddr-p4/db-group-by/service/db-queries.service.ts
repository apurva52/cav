import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {
  DbQueriesLoadingState,
  DbQueriesLoadedState,
  DbQueriesLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState
} from './db-queries.state';
//import { Db_Query } from './db-queries.dummy';
import { environment } from 'src/environments/environment';
import { DBReportData } from './db-queries.model';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute } from '@angular/router';
import {
  WidgetDrillDownMenuItem,
  WidgetDrillDownMenuState,
} from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { stream } from 'xlsx/types';
import { DashboardServiceInterceptor } from 'src/app/shared/dashboard/service/dashboard.service.interceptor';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root',
})
export class DbQueriesService extends Store.AbstractService {
  stateID: string;
  fp_DataID: string;
  tierName: string;
  //startTime: number;
  //endTime: number;
  serverName: string;
  instanceName: string;
  btTransaction: string;
  flowpathInstance: string;
  appName: string;
  statusCode: string;
  tierId: String;
  serverId: String;
  appId: String;
  RowData:any;
  startTimeStr: string;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  responseTime: number;


  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {
    super();
    // this.route.queryParams.subscribe((params) => {
    //   (this.stateID = params['state']), (this.fp_DataID = params['fpData']);
    // });
  }


  loadFromWidget(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DbQueriesLoadingState());
    }, 0);

    // const state: WidgetDrillDownMenuItem = me.sessionService.getSetting(me.stateID,null);

    const state: WidgetDrillDownMenuItem = me.sessionService.getSetting("ddrMenu");

    for (const subjectInfo of state.state.subject.tags) {
      if (subjectInfo.key == 'Tier') {
        me.tierName = subjectInfo.value;
      } else if (subjectInfo.key == 'Server') {
        me.serverName = subjectInfo.value;
      } else if (subjectInfo.key == 'Instance') {
        me.instanceName = subjectInfo.value;
      } else if (subjectInfo.key == 'Business Transactions') {
        me.btTransaction = subjectInfo.value;
      }
    }

    // for (const timeInfo of state.time) {
    //   me.startTime = timeInfo.startTime;
    //   me.endTime = timeInfo.endTime;
    // }


    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new DbQueriesLoadedState(DB_QUERIES_TABLE));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new DbQueriesLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.flowpathqueryEx.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.instanceName,
      // tierId: 'undefined',
      // serverId: 'undefined',
      // appId: 'undefined',
      strStartTime: state.time[0].startTime,
      strEndTime: state.time[0].endTime,
      statusCode: '-2',
      strOrderBy: 'exec_time_desc',
      object: '6',
      // urlIndex: 'undefined',
      // btcategoryId: 'undefined',
      urlName: me.btTransaction,
     // backend_ID: 'undefined',
      strGroup: 'tier,server,app',
      limit: '50',
      offset: '0',
      // showCount: 'false',
      // customFlag: 'false',
      queryId: this.randomNumber(),
    };

    me.controller.post(path, payload).subscribe(
      (rawdata: DBReportData) => {
        // me.dashboardService.interceptor.getDecodedQuery(
        //   rawdata,

        //   () => {
        //     output.next(new DbQueriesLoadedState(rawdata));
        //     output.complete();
        //   },
        //   (error: AppError) => {
        //     output.error(new DbQueriesLoadingErrorState(error));
        //     output.complete();
        //   }
        // );
        output.next(new DbQueriesLoadedState(rawdata));
       output.complete();
      },
      (e: any) => {
        output.error(new DbQueriesLoadingErrorState(e));
        output.complete();

        me.logger.error('Db Queries Data loading failed', e);
      }
    );
    return output;
  }
  randomNumber() {
     return (Math.random() * 1000000).toFixed(0);
   }
  loadFromFlowPath(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DbQueriesLoadingState());
    }, 0);

    // getting fp data
    this.RowData = me.sessionService.getSetting("fpRowdata");

    const fp_RowData: any = me.sessionService.getSetting(me.fp_DataID, null);

    console.log("Inside DB query req fp_RowData>>>>>",fp_RowData)
    if (this.RowData != null) {
      console.log("Inside DB query  req RowData>>>>>",this.RowData)
      me.flowpathInstance = this.RowData.flowpathInstance;
      me.tierName = this.RowData.tierName;
      me.serverName = this.RowData.serverName;
      me.appName = this.RowData.appName;
      me.tierId = this.RowData.tierId;
      me.serverId = this.RowData.serverId;
      me.appId = this.RowData.appId;
      me.startTimeStr = this.RowData.startTimeInMs;
      me.responseTimeStr = this.RowData.responseTime;
    }else if (fp_RowData != null) {
      me.flowpathInstance = fp_RowData.flowpathInstance;
      me.tierName = fp_RowData.tierName;
      me.serverName = fp_RowData.serverName;
      me.appName = fp_RowData.appName;
      me.tierId = fp_RowData.tierId;
      me.serverId = fp_RowData.serverId;
      me.appId = fp_RowData.appId;
      me.startTimeStr = fp_RowData.startTimeInMs;
      me.responseTimeStr = fp_RowData.responseTime
    }

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new DbQueriesLoadedState(DB_QUERIES_TABLE));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new DbQueriesLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.dbRequestEx.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      object: '6',
      tierId: me.tierId,
      serverId: me.serverId,
      appId: me.appId,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.appName,
      flowpathInstance: me.flowpathInstance,
      statusCode: '-2',
      strStartTime:me.startTime,
      strEndTime: me.endTime,
      sqlIndex: 'undefined',
      queryId: me.randomNumber(),
      limit: '50',
      offset: '0',
      showCount: 'false',
    };

    me.controller.post(path, payload).subscribe(
      (rawdata: DBReportData) => {
        // me.dashboardService.interceptor.getDecodedQuery(
        //   rawdata,

        //   () => {
        //     output.next(new DbQueriesLoadedState(rawdata));
        //     output.complete();
        //   },
        //   (error: AppError) => {
        //     output.error(new DbQueriesLoadingErrorState(error));
        //     output.complete();
        //   }
        // );
            output.next(new DbQueriesLoadedState(rawdata));
            output.complete();
      },
      (e: any) => {
        output.error(new DbQueriesLoadingErrorState(e));
        output.complete();

        me.logger.error('Db Queries Data loading failed', e);
      }
    );
    return output;
  }
  downloadShowDescReports(downloadType, tableData, header): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let skipColumn = [];
      let downloadDataPayload = {};
      let rowData:any []=[];

      for(let i =0;i<tableData.length;i++)
      {
        let rData:string []=[];
        let number = i+1;
          rData.push(number.toString());
          rData.push(tableData[i].sqlquery);
          rData.push(tableData[i].sqlbegintimestamp);
          rData.push(tableData[i].sqlendtimestamp);
          rData.push(tableData[i].count);
          rData.push(tableData[i].failedcount);
          rData.push(tableData[i].mincumsqlexectime);
          rData.push(tableData[i].maxcumsqlexectime);
          rData.push(tableData[i].avg);
          rData.push(tableData[i].cumsqlexectime);
          rData.push(tableData[i].sqlindex);

        rowData.push(rData);
      }

      downloadDataPayload = {
        "testRun": me.sessionService.testRun.id,
        "clientconnectionkey": me.sessionService.session.cctx.cck,
        "userName": me.sessionService.session.cctx.u,
        "productName": me.sessionService.session.cctx.prodType,
        "downloadType": downloadType,
        "skipColumn": skipColumn,
        "rowData": rowData,
        "header": header,
        "reportTitle": "DB Query Report"
      }

      let downloadPath = environment.api.dashboard.download.endpoint;
      me.controller.post(downloadPath, downloadDataPayload).subscribe((DownloadReportData: any) => {
      output.next(new DownloadReportLoadedState(DownloadReportData));
      output.complete();
      },
        (error: AppError) => {
          output.next(new DownloadReportLoadingErrorState(error));
          output.complete();
        }
      );
      return output;
    } catch (err) {
      console.log("Exception has occured while Downloading Report for Show Description", err);
    }
  }
}
