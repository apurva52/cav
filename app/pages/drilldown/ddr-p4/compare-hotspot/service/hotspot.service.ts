import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { HOTSPOT_DUMMY } from './hotspot.dummy';
import { HotspotData, HotspotLoadPayload, StackTraceData } from './hotspot.model';
import { HotspotLoadingState, HotspotLoadedState, HotspotLoadingErrorState, StackTraceLoadedState, StackTraceLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState } from './hotspot.state';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
@Injectable({
  providedIn: 'root',
})
export class HotspotService extends Store.AbstractService {

  fp_DataID: string;
  responseTime: number;
  startTimeStr: string;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  RowData:any;
  flowpathInstance: string;
  tierName: string;
  serverName: string;
  appName: string;
  statusCode: string; 
  urlName: string;
  urlIndex: string; 
  BtCategory: string;
  threadId: string;
  tierId: string;
  serverId: string;
  appId: string;
  Instance_Type:String;
  



  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute) {
    super();
  }
  //hotspotload(payload: HotspotLoadPayload): Observable<Store.State> {
  hotspotload(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    // this.route.queryParams.subscribe((params) => {
    //   this.RowData = JSON.parse(params['rowID']);
    //   console.log("Inside hotspot req >>>>>",this.RowData)
    //   this.fp_DataID = params['fpData'];
    // });

    //getting flowpath row data from session to create payload
    me.RowData = me.sessionService.getSetting("fpRowdata");
    setTimeout(() => {
      output.next(new HotspotLoadingState());
    }, 0);

    const fp_RowData: any = me.sessionService.getSetting(me.fp_DataID, null);
    console.log("Inside hotspot req fp_RowData>>>>>",fp_RowData)
    if (me.RowData != null) {
      console.log("Inside me.rowdata req >>>>>",me.RowData);
      me.flowpathInstance = me.RowData.flowpathInstance;
      me.tierName = me.RowData.tierName;
      me.serverName = me.RowData.serverName;
      me.appName = me.RowData.appName;
      me.tierId = me.RowData.tierId;
      me.serverId= me.RowData.serverId;
      me.appId= me.RowData.appId;
      me.statusCode = me.RowData.status;
      me.startTimeStr = me.RowData.startTimeInMs;
      me.responseTimeStr = me.RowData.responseTime;
      me.urlName= me.RowData.url;
      me.urlIndex=  me.RowData.urlIndex; 
      me.BtCategory = me.RowData.category;
      me.threadId =me.RowData.threadId;
      me.Instance_Type =me.RowData.Instance_Type;
      ///for time set for particular flowpath
      me.startTime = parseInt(me.startTimeStr);
      me.responseTime = parseInt(me.responseTimeStr);
      me.endTime = me.startTime + me.responseTime;
    }else if (fp_RowData != null) {
      me.flowpathInstance = fp_RowData.flowpathInstance;
      me.tierName = fp_RowData.tierName;
      me.serverName = fp_RowData.serverName;
      me.appName = fp_RowData.appName;
      me.tierId = fp_RowData.tierId;
      me.serverId= fp_RowData.serverId;
      me.appId= fp_RowData.appId;
      me.statusCode = fp_RowData.status;
      me.startTimeStr = fp_RowData.startTimeInMs;
      me.responseTimeStr = fp_RowData.responseTime;
      me.urlName= fp_RowData.url;
      me.urlIndex=  fp_RowData.urlIndex; 
      me.BtCategory = fp_RowData.category;
      me.threadId =fp_RowData.threadId;
      me.Instance_Type =fp_RowData.Instance_Type;

      ///for time set for particular flowpath
      me.startTime = parseInt(me.startTimeStr);
      me.responseTime = parseInt(me.responseTimeStr);
      me.endTime = me.startTime + me.responseTime;
    }
  // else{   
  //  for (const subjectInfo of me.state.state.subject.tags) {
  //     if (subjectInfo.key == 'Tier') {
  //       me.tierName = subjectInfo.value;
  //     } else if (subjectInfo.key == 'Server') {
  //       me.serverName = subjectInfo.value;
  //     } else if (subjectInfo.key == 'Instance') {
  //       me.instanceName = subjectInfo.value;
  //     } else if (subjectInfo.key == 'Business Transactions') {
  //       me.btTransaction = subjectInfo.value;
  //     }
  //   }
  //   me.startTime= me.state.time[0].startTime;
  //   me.endTime =me.state.time[0].endTime;
  // }

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new HotspotLoadedState(HOTSPOT_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new HotspotLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.hotspotData.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.testRun.id,
      flowpathInstance: me.flowpathInstance,
      tierName: me.tierName,
      tierId: me.tierId,
      serverName: me.serverName,
      serverId: me.serverId,
      appName: me.appName,
      appId: me.appId,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      threadId: me.threadId,
      btCategory: me.BtCategory,
      urlName: me.urlName,
      urlIndex: me.urlIndex,
      instanceType: me.Instance_Type
     
    };
    me.controller.post(path, payload).subscribe(
      (data: HotspotData) => {
        output.next(new HotspotLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new HotspotLoadingErrorState(e));
        output.complete();

        me.logger.error('Hotspot Data loading failed', e);
      }
    );

    return output;
  }

  stacktraceload(data): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new HotspotLoadingState());
    }, 0);

    // const fp_RowData: any = me.sessionService.getSetting(me.fp_DataID, null);


    // me.startTimeStr = fp_RowData.startTimeInMs;
    // me.responseTimeStr = fp_RowData.responseTime

    // me.startTime = parseInt(me.startTimeStr);
    // me.responseTime = parseInt(me.responseTimeStr);
    // me.endTime = me.startTime + me.responseTime;

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new HotspotLoadedState(HOTSPOT_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new HotspotLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.stackTraceData.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.testRun.id,
      flowpathInstance: me.flowpathInstance,
      // tierName: me.tierName,
      tierId: data.tierId,
      // serverName: me.serverName,
      serverId: data.serverId,
      // appName: fp_RowData.appName,
      appId: data.appId,
      // strStartTime: me.startTime,
      // strEndTime: me.endTime,
      threadId: data.threadId,
      //btCategory: "Slow",
      //  urlName: "ATGSubCategory",
      //  urlIndex: "1073741827",
      hsTimeInMs:data.hsTimeInMs,
      hotSpotDuration: data.hotSpotDuration,
      instanceType:data.instanceType,
      hsDuration: data.hsDurationInMs

    };
    me.controller.post(path, payload).subscribe(
      (data: StackTraceData) => {
        output.next(new StackTraceLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new StackTraceLoadingErrorState(e));
        output.complete();

        me.logger.error('StackTrace Data loading failed', e);
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
          rData.push(tableData[i].tierName);
          rData.push(tableData[i].appName);
          rData.push(tableData[i].threadName);
          rData.push(tableData[i].threadId);
          rData.push(tableData[i].hotspotStartTimeStamp);
          rData.push(tableData[i].hotspotDuration);
          rData.push(tableData[i].threadState);
          rData.push(tableData[i].methods);
          rData.push(tableData[i].threadStackdepth);
          rData.push(tableData[i].threadPriority);

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
        "reportTitle": "Hotspot Report"
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
          rData.push(tableData1[i].data.methodName);
          rData.push(tableData1[i].data.className);
          rData.push(tableData1[i].data.lineNo);
          rData.push(tableData1[i].data.packageName);
          rData.push(tableData1[i].data.elapsedTime);
          rData.push(tableData1[i].data.frameNo);
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
        "reportTitle": "Hotspot StackTrace Report"
      }

      let downloadPath1 = environment.api.dashboard.download.endpoint;
      me.controller.post(downloadPath1, downloadDataPayload).subscribe((DownloadReportData1: any) => {
      output.next(new DownloadReportLoadedState(DownloadReportData1));
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
