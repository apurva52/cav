import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { EXCEPTION_DUMMY } from './exception.dummy';
import { ExceptionLoadPayload, ExceptionData, AggregateExceptionData, SourceCodePayload, DownloadSourceCodePayload } from './exception.model';
import { ExceptionLoadingState, ExceptionLoadedState, ExceptionLoadingErrorState, AggregateExceptionLoadingState, AggregateExceptionLoadedState, AggregateExceptionLoadingErrorState, SourceCodeLoadedState, SourceCodeLoadingErrorState, SourceCodeLoadingState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState, VarArgsLoadedState, VarArgsLoadingErrorState} from './exception.state';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute } from '@angular/router';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root'
})

export class ExceptionService extends Store.AbstractService {


  fp_DataID: string;
  flowPathInstance : string;
  exceptionClassID : string;
  tierName: string;
  tierID : string;
  serverName: string;
  serverID : string;
  appName: string;
  appID : string;
  exceptionThrowingClassID: string;
  exceptionThrowingMethodID: string;
  responseTime: number;
  startTimeStr: string;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  RowData=null;
  dbRowData: any;
  isSource: any;
  reportID: any;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute)
    {
      super();
      // this.route.queryParams.subscribe((params) => {
      //   this.fp_DataID = params['fpData'];
      // });
    }

  aggregateLoad(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AggregateExceptionLoadingState());
    }, 0);

     
    me.isSource = me.sessionService.getSetting("ddrSource");
    me.reportID = me.sessionService.getSetting("reportID");
    
    if (me.isSource == "widget" && me.reportID == "DBR") {
      me.dbRowData = me.sessionService.getSetting("dbRowData");
      me.startTime = me.sessionService.getSetting("StartTime");
      me.endTime = me.sessionService.getSetting("EndTime");
      me.flowPathInstance = "undefined";
      me.tierName = me.dbRowData.tierName;
      me.tierID = me.dbRowData.tierId;
      me.serverName = me.dbRowData.serverName;
      me.serverID = me.dbRowData.serverId;
      me.appName = me.dbRowData.appName;
      me.appID = me.dbRowData.appId;
    } else {
      //getting flowpath row data from session to create payload
    me.RowData = me.sessionService.getSetting("fpRowdata");

    const fp_RowData: any = me.sessionService.getSetting( me.fp_DataID, null);

    me.flowPathInstance = me.RowData.flowpathInstance
    me.tierName = me.RowData.tierName
    me.tierID = me.RowData.tierId
    me.serverName = me.RowData.serverName
    me.serverID = me.RowData.serverId
    me.appName = me.RowData.appName
    me.appID = me.RowData.appId
    me.startTimeStr = me.RowData.startTimeInMs;
    me.responseTimeStr = me.RowData.responseTime

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;
    }
    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new ExceptionLoadedState(EXCEPTION_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new ExceptionLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.aggExceptionData.aggregateLoad.endpoint;

    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.testRun.id,
      flowPathInstance: me.flowPathInstance,
      tierName: me.tierName,
      tierid: me.tierID,
      serverName: me.serverName,
      serverid: me.serverID,
      appName: me.appName,
      appid: me.appID,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      // backendName: "undefined",
      // backendSubType: "undefined",
      // exceptionClassId: "undefined",
      // failedQuery: "1",
      // backendid: "undefined",  //
      groupby: "excthrowingclass,excthrowingmethod,excclass",  //
      groupByFC: "Exception Class,Throwing Class,Throwing Method",
      limit: 50,
      offset: 0,
      queryId: this.randomNumber()
    };

    me.controller.post(path, payload).subscribe(
      (dataAggregate: AggregateExceptionData) => {
        output.next(new AggregateExceptionLoadedState(dataAggregate));
        output.complete();
      },
      (e: any) => {
        output.error(new AggregateExceptionLoadingErrorState(e));
        output.complete();

        me.logger.error('Aggregate Exception Data loading failed', e);
      }
    );

    return output;
  }

  exceptionLoad(data): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new ExceptionLoadingState());
    }, 0);

    // const fp_RowData: any = me.sessionService.getSetting( me.fp_DataID, null);

    me.exceptionClassID = data.exceptionclassid;
    if (data.Tierid && data.Tierid != "NA") {
      me.tierName = data.TierName;
      me.tierID = data.Tierid;
    }
    else{
      me.tierName= this.RowData.tierName;
      me.tierID= this.RowData.tierId;
    }
    if (data.Serverid && data.Serverid != "NA") {
    me.serverName = data.ServerName;
    me.serverID = data.Serverid;
    }
    else{
      me.serverName = this.RowData.serverName;
      me.serverID = this.RowData.serverId;
    }
    if (data.Appid && data.Appid != "NA") {
      me.appName = data.AppName;
      me.appID = data.Appid;
    }
    else{
      me.appName = this.RowData.appName;
      me.appID = this.RowData.appId;
    }
    me.exceptionThrowingClassID = data.exceptionthrowingclassid;
    me.exceptionThrowingMethodID = data.exceptionthrowingmethodid;


    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new ExceptionLoadedState(EXCEPTION_DUMMY));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new ExceptionLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE
    console.log("starttime",me.startTime);
    console.log("endtime",me.endTime);

    const path = environment.api.exceptionReport.exceptionLoad.endpoint;

    const payload = {

      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.testRun.id,
      flowPathInstance: this.RowData.flowpathInstance ,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.appName,
      tierid: me.tierID,
      serverId: me.serverID,
      appId: me.appID,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      // failedQuery: "1",
      pagination: " --limit 50 --offset 0",
      // backendid: "undefined",
      // backendName: "undefined",
      // backendSubType: "undefined",
      exceptionClassId: me.exceptionClassID,
      throwingMethodId: me.exceptionThrowingMethodID,
      throwingClassId: me.exceptionThrowingClassID,
      // limit: "50",
      // offset: "0",
      queryId: "308719",
      showCount: false
    }

    me.controller.post(path, payload).subscribe(
      (dataException: ExceptionData) => {
        output.next(new ExceptionLoadedState(dataException));
        output.complete();
      },
      (e: any) => {
        output.error(new ExceptionLoadingErrorState(e));
        output.complete();

        me.logger.error('Exception Data loading failed', e);
      }
    );

    return output;
  }

  sourceCodeLoad(srcArgs:SourceCodePayload):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new SourceCodeLoadingState());
    }, 0);


    const path = environment.api.sourcecode.sourcecodeLoad.endpoint;

    const payload = {

      cctx: me.sessionService.session.cctx,
      testRun:me.sessionService.testRun.id,
      fqm:srcArgs.fqm,
      j_uid:srcArgs.j_uid,
      serverName:srcArgs.serverName,
      instanceName:srcArgs.instanceName,
      tierName:srcArgs.tierName


    }

    me.controller.post(path, payload).subscribe(
      (dataSourceCode: string) => {
        output.next(new SourceCodeLoadedState(dataSourceCode));
        output.complete();
      },
      (e: any) => {
        output.error(new SourceCodeLoadingErrorState(e));
        output.complete();

        me.logger.error('Source Code Data loading failed', e);
      }
    );

    return output;
  }

  varargsload(data:string):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    const path = environment.api.varargs.varargsload.endpoint;
    const payload ={
      cctx: me.sessionService.session.cctx,
      stackTraceRow:data
    }
    me.controller.post(path, payload).subscribe(
      (vargsdata: String) => {
        output.next(new VarArgsLoadedState(vargsdata));
        output.complete();
      },
      (e: any) => {
        output.error(new VarArgsLoadingErrorState(e));
        output.complete();
        me.logger.error('Source Code Data loading failed', e);
      }
    );
    return output;
  }

  downloadsourcecode(downloadArgs?:DownloadSourceCodePayload):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    const path = environment.api.varargs.downloadsourcecode.endpoint;
    const payload ={
      cctx: me.sessionService.session.cctx,
      downloadFileName:downloadArgs.downloadFileName,
      downloadType:downloadArgs.downloadType
    }

    me.controller.post(path, payload).subscribe(
      (downloaddata: String) => {
        output.next(new DownloadReportLoadedState(downloaddata));
        output.complete();
      },
      (e: any) => {
        output.error(new DownloadReportLoadingErrorState(e));
        output.complete();
        me.logger.error('Source Code Data loading failed', e);
      }
    );
    return output;
  }

  
  randomNumber() {
    return (Math.random() * 1000000).toFixed(0);
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
          rData.push(tableData[i].ExceptionClassName);
          rData.push(tableData[i].ThrowingClassName);
          rData.push(tableData[i].ThrowingMethodName);
          rData.push(tableData[i].ExceptionCount);
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
        "reportTitle": "Aggregate Exception Report"
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
          rData.push(tableData1[i].tierName);
          rData.push(tableData1[i].appName);
          rData.push(tableData1[i].serverName);
          rData.push(tableData1[i].backendId);
          rData.push(tableData1[i].timeStamp);
          rData.push(tableData1[i].exceptionClassName);
          rData.push(tableData1[i].message);
          rData.push(tableData1[i].throwingClassName);
          rData.push(tableData1[i].cause);
          rData.push(tableData1[i].lineNumber);
          rData.push(tableData1[i].flowPathInstance);
          rData.push(tableData1[i].throwingMethodName);
          rData.push(tableData1[i].stackTrace);
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
        "reportTitle": "Exception Report"
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
