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
  cqmPayload: any;
  isSource: any;
  reportID: any;
  btCategory: any;
  strOrderBy: string ="exec_time_desc";
  urlIndex: any;
  strGroup: string = "tier,server,app";
  isFromSource: any;



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

    me.startTime = state.time[0].startTime ;
    me.endTime = state.time[0].endTime ;

    me.isSource = me.sessionService.getSetting("ddrSource");
    me.reportID = me.sessionService.getSetting("reportID");

    if (me.isSource == "widget" && me.reportID == "DBG_BT") {
      me.RowData = me.sessionService.getSetting("dbGroupbyRowData");
      me.urlIndex = me.RowData.urlIndex;
      me.btCategory = me.RowData.BTCategory;
      me.btTransaction =me.RowData.urlName;
      me.strOrderBy = "query";
      me.strGroup = undefined;
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
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      statusCode: '-2',
      strOrderBy: me.strOrderBy,
      object: '6',
      urlIndex: me.urlIndex,
      btcategoryId: me.btCategory,
      urlName: me.btTransaction,
     // backend_ID: 'undefined',
      strGroup: me.strGroup,
      limit: '50',
      offset: '0',
      // showCount: 'false',
      // customFlag: 'false',
      queryId: this.randomNumber(),
    };

    me.sessionService.setSetting("StartTime",me.startTime);
    me.sessionService.setSetting("EndTime",me.endTime);
    me.sessionService.setSetting("cqmPayload",payload);

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

  loadFromCqm(cqmFilter) : Observable<Store.State> {
    console.log("The value inside the cqmFilter is ......",cqmFilter);
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DbQueriesLoadingState());
    }, 0);

    me.cqmPayload = me.sessionService.getSetting("cqmPayload");

    let CqmKey = [];
    let cqmPayloadKey = [];
    CqmKey = Object.keys(cqmFilter);
    console.log("The value inside the cqmfilter keys are ....", CqmKey);
    cqmPayloadKey = Object.keys(me.cqmPayload);
    CqmKey.forEach((val, index) => {
      cqmPayloadKey.forEach((val1, i) => {
        if (cqmPayloadKey[i] == CqmKey[index]) {
          me.cqmPayload[val] = cqmFilter[val].toString();
        }
      });
    });
    if (cqmFilter["tierId"]) {
      me.cqmPayload["tierId"] = cqmFilter["tierId"];
    }
    if (cqmFilter["serverId"]) {
      me.cqmPayload["serverId"] = cqmFilter["serverId"];
    }
    if (cqmFilter["appId"]) {
      me.cqmPayload["appId"] = cqmFilter["appId"];
    }
    if(cqmFilter["selectedBTCategory"]) {
      me.cqmPayload["btCategory"] = cqmFilter["selectedBTCategory"];
    }
    if(cqmFilter["urlIndex"]) {
      me.cqmPayload["urlIndex"] = cqmFilter["urlIndex"];
    }
    if(cqmFilter["topNEntities"]) {
      me.cqmPayload["topNEntities"] = cqmFilter["topNEntities"];
    }
    
    console.log("The value inside the cqmPayload is ......",me.cqmPayload);
    const path = environment.api.flowpathqueryEx.load.endpoint;
    me.controller.post(path, me.cqmPayload).subscribe(
      (rawdata: DBReportData) => {
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
  loadFromTrxFlowmap(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DbQueriesLoadingState());
    }, 0);
    // For getting the source ...
    me.isFromSource = me.sessionService.getSetting("isSource");

    if(me.isFromSource == "isFromMain"){
    this.RowData = me.sessionService.getSetting("TxnFMData");
    console.log("Data coming from TrxFlowmap inside the DB query", this.RowData);
    if (this.RowData != null) {
      // console.log("Inside DB query  req RowData>>>>>",this.RowData);
      me.flowpathInstance = this.RowData.flowpathInstance;
      me.tierName = this.RowData.tierName;
      me.serverName = this.RowData.serverName;
      me.appName = this.RowData.appName;
      me.tierId = this.RowData.tierId;
      me.serverId = this.RowData.serverId;
      me.appId = this.RowData.appId;
      me.startTimeStr = this.RowData.startTimeInMs;
      me.responseTimeStr = this.RowData.avgBackendDuration;
    }

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;
  }
  else{
    if(me.isFromSource == "isFromTableDataDB"){
      this.RowData = me.sessionService.getSetting("TrxnDBtable");
      console.log("Data coming from TrxFlowmap Table inside the DB query", this.RowData);
      if (this.RowData != null) {
        // console.log("Inside DB query  req RowData>>>>>",this.RowData);
        me.flowpathInstance = this.RowData.flowPathInstance;
        me.tierName = this.RowData.tierName;
        me.serverName = this.RowData.serverName;
        me.appName = this.RowData.appName;
        me.tierId = this.RowData.tierId;
        me.serverId = this.RowData.serverId;
        me.appId = this.RowData.appId;
        me.startTimeStr = this.RowData.startTimeInMs;
        me.responseTimeStr = this.RowData.fpDurationExact;
      }

      me.startTime = parseInt(me.startTimeStr);
      me.responseTime = parseInt(me.responseTimeStr);
      me.endTime = me.startTime + me.responseTime;
    }
  }
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
  downloadShowDescReports(downloadType, rowData, header): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let skipColumn = [];
      let downloadDataPayload = {};

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
