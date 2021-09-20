import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { IP_SUMMARY_DUMMY } from './ip-summary.dummy';
import { IndIpData, IpSummaryData } from './ip-summary.model';
import { IpSummaryLoadingState, IpSummaryLoadedState, IpSummaryLoadingErrorState, IndIpLoadingState, IndIpLoadedState, IndIpLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState} from './ip-summary.state';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root'
})

export class IpSummaryService extends Store.AbstractService {

  fp_DataID: string;
  flowpathInstance: string;
  responseTime: number;
  startTimeStr: string;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  RowData:any;
  flowpathRange:number = 10000;
  urlIndex:string;
  limit:number=10000;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    super();
    this.route.queryParams.subscribe((params) => {
      this.flowpathInstance = params['rowID'];
      this.fp_DataID = params['fpData'];
    });
  }

  ipSummaryload(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new IpSummaryLoadingState());
    }, 0);

    //const fp_RowData: any = me.sessionService.getSetting(me.fp_DataID, null);
    this.RowData = me.sessionService.getSetting("fpRowdata");

    me.startTimeStr = this.RowData.startTimeInMs;
    me.responseTimeStr = this.RowData.responseTime

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;


    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new IpSummaryLoadedState(IP_SUMMARY_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new IpSummaryLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.aggbtData.load.endpoint;
    const payload = {
      cctx: {
        cck: "",
        pk: "",
        prodType: "",
        u: ""
      },
      testRun: me.sessionService.testRun.id,
      tierName: this.RowData.tierName,
      serverName: this.RowData.serverName,
      appName: this.RowData.appName,
      tierId: this.RowData.tierId,
      serverId: this.RowData.serverId,
      appId: this.RowData.appId,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      flowpathID: "",
      strGroup: "url",
      statusCode: "-2",
      showCount: false,
      urlIndex: this.RowData.urlIndex,
      urlName: this.RowData.businessTransaction,
      integrationPointName: "NA",
      integrationPointId: "NA",
      queryId: 126958,
      limit: 50
    };
    me.controller.post(path, payload).subscribe(
      (data: IpSummaryData) => {
        output.next(new IpSummaryLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new IpSummaryLoadingErrorState(e));
        output.complete();

        me.logger.error('Ip Summary Data loading failed', e);
      }
    );

    return output;
  }

  indipload(data): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new IndIpLoadingState());
    }, 0);

    //const fp_RowData: any = me.sessionService.getSetting(me.fp_DataID, null);
    this.RowData = me.sessionService.getSetting("fpRowdata");

    me.urlIndex= me.RowData.urlIndex;
    me.startTimeStr = this.RowData.startTimeInMs;
    me.responseTimeStr = this.RowData.responseTime

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new HotspotLoadedState(HOTSPOT_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new HotspotLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.indbtData.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.testRun.id,
      tierName: this.RowData.tierName,
      tierId: this.RowData.tierId,
      serverId: this.RowData.serverId,
      appId: this.RowData.appId,
      strStartTime: me.startTime,
      strEndTime:me.endTime,
      urlIndex:me.urlIndex,
      flowpathRange: me.flowpathRange,
      limit: me.limit,
      offset: 0,
      statusCode:-2,
      showCount:false,
      queryId:200686

    };
    me.controller.post(path, payload).subscribe(
      (data: IndIpData) => {
        output.next(new IndIpLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new IndIpLoadingErrorState(e));
        output.complete();

        me.logger.error('IndIpCallout Data loading failed', e);
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
          rData.push(tableData[i].url);
          rData.push(tableData[i].minHttpCalloutCount);
          rData.push(tableData[i].maxHttpCalloutCount);
          rData.push(tableData[i].totalHttpCalloutCount);
          rData.push(tableData[i].minDBCalloutCount);
          rData.push(tableData[i].maxDBCalloutCount);
          rData.push(tableData[i].totalDBCalloutCount);
          rData.push(tableData[i].minCalloutCount);
          rData.push(tableData[i].maxCalloutCount);
          rData.push(tableData[i].fpCount);

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
        "reportTitle": "BT Callout Summary"
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
  downloadShowDescReports1(downloadType, tableData1, header1): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let skipColumn = [];
      let downloadDataPayload = {};
      let rowData:any []=[];

      for(let i =0;i<tableData1.length;i++)
      {
        let rData:string []=[];
        let number = i+1;
          rData.push(number.toString());
          rData.push(tableData1[i].renamebackendIPname);
          rData.push(tableData1[i].actualbackendIPname);
          rData.push(tableData1[i].backendType);
          rData.push(tableData1[i].totalDuration);
          rData.push(tableData1[i].avgDuration);
          rData.push(tableData1[i].maxDuration);
          rData.push(tableData1[i].minDuration);
          rData.push(tableData1[i].count);
          rData.push(tableData1[i].mincount);
          rData.push(tableData1[i].maxcount);
          rData.push(tableData1[i].errorCount);
          rData.push(tableData1[i].avgNWDelay);
          rData.push(tableData1[i].totalNWDelay);

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
        "header": header1,
        "reportTitle": "BT Callout Details"
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
