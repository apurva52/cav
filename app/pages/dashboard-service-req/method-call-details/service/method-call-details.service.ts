import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/core/session/session.service';
import { MethodCallDetailsLoadingState, MethodCallDetailsLoadedState, MethodCallDetailsLoadingErrorState,  DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState, childFlowpathLoadingState, childFlowpathLoadedState, childFlowpathErrorState } from './method-call-details.state';
import { MethodCallDetailsData, MethodCallDetailsTable, MethodCallDetailsTableLoadPayload } from './method-call-details.model';
import { METHOD_CALL_DETAILS_TABLE } from './method-call-details.dummy';
import { data } from 'jquery';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root',
})
export class MethodCallDetailsService extends Store.AbstractService {
  flowpathInstance: string;
  tierName: string;
  serverName: string;
  appName: string;
  statusCode: string;
  startTimeStr: any;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  responseTime: number;
  RowData:any;
  fp_DataID: string;
  methodCount: any;
  packageList:string ='';
  classList: string ='';
  methodList: string='';
  filterGreaterThan:string='0';
  filterTop:string='100';
  thresholdWallTime:string='1500';
  ignoreFilterCallouts:string='T,E,D,J,j,e,t,a,A';
  thresholdDiffElapsedTime:string ='1000';
  negativeMethods:string= '';
  FromAngular:string = '1';
  urlQueryParamStr: any;
  isFromSource:any;



  constructor (
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    super();
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // getting fp data
    this.RowData = me.sessionService.getSetting("fpRowdata");

    setTimeout(() => {
      output.next(new MethodCallDetailsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new MethodCallDetailsLoadedState(METHOD_CALL_DETAILS_TABLE));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new MethodCallDetailsLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE
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
      me.methodCount =this.RowData.methods;
      me.urlQueryParamStr =this.RowData.url;
    }else if (fp_RowData != null) {
      me.flowpathInstance = fp_RowData.flowpathInstance;
      me.tierName = fp_RowData.tierName;
      me.serverName = fp_RowData.serverName;
      me.appName = fp_RowData.appName;
      me.statusCode = fp_RowData.status;
      me.startTimeStr = fp_RowData.startTimeInMs;
      me.responseTimeStr = fp_RowData.responseTime
      me.methodCount =fp_RowData.methods;
      me.urlQueryParamStr =fp_RowData.url;
    }

    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;

    const path = environment.api.mctReport.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      // tierName: me.tierName,
      // serverName: me.serverName,
      // appName: me.appName,

      negativeMethods:me.negativeMethods,
      filterGreaterThan: me.filterGreaterThan,
      filterTop: me.filterTop,
      packageList:me.packageList ,
      classList: me.classList,
      methodList: me.methodList,
      // testRun: '4384',
      flowPathInstance: me.flowpathInstance,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      entryResponseTime: me.responseTimeStr,
      thresholdWallTime: me.thresholdWallTime,
      FromAngular: this.FromAngular,
      enableMergeCase: 'false',
      ignoreFilterCallouts: me.ignoreFilterCallouts,
      methodCount: me.methodCount,
      filterMethods: 'false',
      thresholdDiffElapsedTime: me.thresholdDiffElapsedTime,
    };
    me.controller.post(path, payload).subscribe(
      (data: MethodCallDetailsData) => {
        output.next(new MethodCallDetailsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new MethodCallDetailsLoadingErrorState(e));
        output.complete();

        me.logger.error('Method Call Details Data loading failed', e);
      }
    );

    return output;
  }
loadFromTrxFlowmap(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new MethodCallDetailsLoadingState());
    }, 0);

    // getting fp data
    var RowDataFP = me.sessionService.getSetting("fpRowdata");
    me.isFromSource = me.sessionService.getSetting("isSource");

    // getting Trxn Flowmap node data.... when 'isFromMain' keyword is true!!!
    if(me.isFromSource === "isFromMain"){
    this.RowData = me.sessionService.getSetting("TxnFMData");
    console.log("trnFmData----mct---",this.RowData);

    if (this.RowData != null) {
      me.flowpathInstance = this.RowData.flowpathInstance;
      me.tierName = this.RowData.tierName;
      me.serverName = this.RowData.serverName;
      me.appName = this.RowData.appName;
      me.statusCode = this.RowData.status;
      me.startTimeStr = this.RowData.startTimeInMs;
      me.responseTimeStr = this.RowData.avgBackendDuration;
      me.methodCount = RowDataFP.methods;
    }
    me.startTime = parseInt(me.startTimeStr);
    me.responseTime = parseInt(me.responseTimeStr);
    me.endTime = me.startTime + me.responseTime;
  }// else case for Trxn flowmap table data when 'isFromTableData' keyword is on.....
  else{
    if(me.isFromSource === "isFromTableDataMCT"){
      // getting table row data....
      me.RowData = me.sessionService.getSetting("TrxnMCTtable");
      console.log("trxTableData----mct---",this.RowData);
      if (me.RowData != null) {
        me.flowpathInstance = me.RowData.flowPathInstance;
        me.tierName = me.RowData.tierName;
        me.serverName = me.RowData.serverName;
        me.appName = me.RowData.appName;
        if(!me.RowData.status){
          me.statusCode = RowDataFP.status;
        }else{
        me.statusCode = me.RowData.status;
       }
        if(!me.RowData.startTimeInMs){
          let dateForStart = new Date(this.RowData.startTime);
          var startTimeInMs = dateForStart.getTime();
          // console.log("date & time ===", dateForStart, startTimeInMs);
          me.startTimeStr = startTimeInMs;
        }
        else{
          me.startTimeStr = me.RowData.startTimeInMs;
          // console.log("time ======", startTimeInMs);
        }
        if(!me.RowData.avgBackendDuration){
          me.responseTimeStr = me.RowData.fpDurationExact;
        }else{
          me.responseTimeStr = me.RowData.avgBackendDuration;
        }
      }
        me.methodCount = RowDataFP.methods;
        me.startTime = parseInt(me.startTimeStr);
        me.responseTime = parseInt(me.responseTimeStr);
        me.endTime = me.startTime + me.responseTime;
        // console.log("parse int value =====", me.responseTime, "start time====", me.startTime ,"end time =====", me.endTime);
      }
    }

    const path = environment.api.mctReport.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,

      negativeMethods:me.negativeMethods,
      filterGreaterThan: me.filterGreaterThan,
      filterTop: me.filterTop,
      packageList:me.packageList ,
      classList: me.classList,
      methodList: me.methodList,
      flowPathInstance: me.flowpathInstance,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      entryResponseTime: me.responseTimeStr,
      thresholdWallTime: me.thresholdWallTime,
      FromAngular: this.FromAngular,
      enableMergeCase: 'false',
      ignoreFilterCallouts: me.ignoreFilterCallouts,
      methodCount: me.methodCount,
      filterMethods: 'false',
      thresholdDiffElapsedTime: me.thresholdDiffElapsedTime,
    };
    me.controller.post(path, payload).subscribe(
      (data: MethodCallDetailsData) => {
        output.next(new MethodCallDetailsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new MethodCallDetailsLoadingErrorState(e));
        output.complete();

        me.logger.error('Method Call Details Data loading failed', e);
      }
    );

    return output;
  }
loadForchlidFlowpath(nodedata): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new childFlowpathLoadingState());
    }, 0);

    let beginSequenceNo ;
    let methodCount=50000;
    var endTimetoPass;
    var startTimetoPass = Number(this.startTime) - 900000;
    if ( this.endTime == null || this.endTime == undefined || isNaN(this.endTime)) {
      var strEndTime = Number(this.startTime) + Number(this.responseTime);
      endTimetoPass = Number(strEndTime) + 900000;
    } else {
      endTimetoPass = Number(this.endTime) + 900000;
    }
    beginSequenceNo= nodedata.node.data.seqNo;

   let prevfpInstance=nodedata.node.data.prevFlowpathInstance;
      if(prevfpInstance == undefined || (prevfpInstance === '0'))
      prevfpInstance=me.flowpathInstance;
      
      console.log("prevfpInstance value-----------"+prevfpInstance);
 
  if(nodedata.methodsCount)
      methodCount=nodedata.methodsCount;

    const path = environment.api.getChildFlowpath.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
        
      // prevFlowpathInstance: prevfpInstance,
      flowPathInstance:prevfpInstance,
      beginSequenceNo:beginSequenceNo,
      filterWallTime: 0,
      negativeMethods:me.negativeMethods,
      filterLevel: me.filterTop,
      packageList:me.packageList ,
      classList: me.classList,
      methodList: me.methodList,
      strStartTime: startTimetoPass,
      strEndTime: endTimetoPass,
      thresholdWallTime: me.thresholdWallTime,
      showCallouts: me.ignoreFilterCallouts,
      methodCount: methodCount,
      thresholdDiffElapsedTime: me.thresholdDiffElapsedTime,
    };
    me.controller.post(path, payload).subscribe(
      (data: MethodCallDetailsData) => {
        output.next(new childFlowpathLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new childFlowpathErrorState(e));
        output.complete();

        me.logger.error('Method Call Details Data loading failed', e);
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
          rData.push(tableData[i].methodName);
          if(!tableData[i].dynLogFlag){
            rData.push("0");
          }else{
            rData.push(tableData[i].dynLogFlag);
          }
          rData.push(tableData[i].api);
          rData.push(tableData[i].timeStamp.toString());
          rData.push(tableData[i].wallTime);
          rData.push(tableData[i].percentage);
          rData.push(tableData[i].cpuTime);
          rData.push(tableData[i].queueTime);
          rData.push(tableData[i].selfTime);
          rData.push(tableData[i].waitTime);
          rData.push(tableData[i].syncTime);
          rData.push(tableData[i].ioTime);
          rData.push(tableData[i].suspensionTime);
          rData.push(tableData[i].sourceNetwork);
          rData.push(tableData[i].destNetwork);
          rData.push(tableData[i].threadId);
          rData.push(tableData[i].threadName);
          rData.push(tableData[i].methodArgument);
          rData.push(tableData[i].instanceType);
          rData.push(tableData[i].appName);
          rData.push(tableData[i].tierName);
          rData.push(tableData[i].serverName);
          rData.push(tableData[i].className);
          rData.push(tableData[i].pacName);
          rData.push(tableData[i].pageName);
          rData.push(tableData[i].asyncCall);
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
        "reportTitle": "Method Calling Details Report"
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
