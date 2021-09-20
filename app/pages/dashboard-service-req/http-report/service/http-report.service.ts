import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { FlowPathTable } from 'src/app/pages/drilldown/flow-path/service/flow-path.model';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { environment } from 'src/environments/environment';
import { HTTP_REPORT_DUMMY } from './http-report.dummy';
import { HttpReportData } from './http-report.model';
import {
  HttpReportLoadedState,
  HttpReportLoadingErrorState,
  HttpReportLoadingState, DownloadReportLoadingState, DownloadReportLoadedState, DownloadReportLoadingErrorState
} from './http-report.state';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root',
})
export class HttpReportService extends Store.AbstractService {

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
    private route: ActivatedRoute
  ) {
    super();

  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    // this.route.queryParams.subscribe((params) => {
    //   this.RowData = JSON.parse(params['rowID']);
    //   console.log("Inside http req >>>>>",this.RowData)
    //   this.fp_DataID = params['fpData'];
    // });

    // getting fp data
    this.RowData = me.sessionService.getSetting("fpRowdata");

    setTimeout(() => {
      output.next(new HttpReportLoadingState());
    }, 0);

    const fp_RowData: any = me.sessionService.getSetting( me.fp_DataID, null);
    console.log("Inside http req fp_RowData>>>>>",fp_RowData)
    if (this.RowData != null) {
      me.flowpathInstance = this.RowData.flowpathInstance;
      me.tierName = this.RowData.tierName;
      me.serverName = this.RowData.serverName;
      me.appName = this.RowData.appName;
      me.statusCode = this.RowData.status;
      me.startTimeStr = this.RowData.startTimeInMs;
      me.responseTimeStr = this.RowData.responseTime;
    }else if (fp_RowData != null) {
      me.flowpathInstance = fp_RowData.flowpathInstance;
      me.tierName = fp_RowData.tierName;
      me.serverName = fp_RowData.serverName;
      me.appName = fp_RowData.appName;
      me.statusCode = fp_RowData.status;
      me.startTimeStr = fp_RowData.startTimeInMs;
      me.responseTimeStr = fp_RowData.responseTime
    }

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;


    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new HttpReportLoadedState(HTTP_REPORT_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new HttpReportLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.httpReport.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      fpInstance: me.flowpathInstance,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.appName,
      statusCode: me.statusCode,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      queryId: '425254',
      strCmdArgs: '',
    };


    me.controller.post(path, payload).subscribe(
      (data: HttpReportData) => {
        output.next(new HttpReportLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new HttpReportLoadingErrorState(e));
        output.complete();

        me.logger.error('Http Report Data loading failed', e);
      }
    );

    return output;
  }
  loadFromTrxFlowmap(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    // this.route.queryParams.subscribe((params) => {
    //   this.RowData = JSON.parse(params['rowID']);
    //   console.log("Inside http req >>>>>",this.RowData)
    //   this.fp_DataID = params['fpData'];
    // });

    // getting Trx FM data
    this.RowData = me.sessionService.getSetting("TxnFMData");
    // console.log("http report---trnFMData----",this.RowData)
    setTimeout(() => {
      output.next(new HttpReportLoadingState());
    }, 0);

    if (this.RowData != null) {
      me.flowpathInstance = this.RowData.flowpathInstance;
      me.tierName = this.RowData.tierName;
      me.serverName = this.RowData.serverName;
      me.appName = this.RowData.appName;
      me.statusCode = this.RowData.status;
      me.startTimeStr = this.RowData.startTimeInMs;
      me.responseTimeStr = this.RowData.avgBackendDuration;
    }

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;


    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new HttpReportLoadedState(HTTP_REPORT_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new HttpReportLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.httpReport.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      fpInstance: me.flowpathInstance,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.appName,
      statusCode: me.statusCode,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      queryId: '425254',
      strCmdArgs: '',
    };


    me.controller.post(path, payload).subscribe(
      (data: HttpReportData) => {
        output.next(new HttpReportLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new HttpReportLoadingErrorState(e));
        output.complete();

        me.logger.error('Http Report Data loading failed', e);
      }
    );

    return output;
  }
  downloadShowDescReports(downloadType, rowData, header, title): Observable<Store.State> {
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
        "reportTitle": title
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
