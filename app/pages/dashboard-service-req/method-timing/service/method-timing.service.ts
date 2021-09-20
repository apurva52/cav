import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { environment } from 'src/environments/environment';
import { METHOD_TIMING_DATA } from './method-timing.dummy';
import { MethodTimingData,ServiceMethodTimingParams } from './method-timing.model';
import { MethodTimingLoadingState, MethodTimingLoadedState, MethodTimingLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState } from './method-timing.state';
import { AppError } from 'src/app/core/error/error.model';
@Injectable({
  providedIn: 'root',
})
export class MethodTimingService extends Store.AbstractService {

  stateID: string;
  tierName: string;
  startTime: number;
  endTime: number;
  serverName: string;
  instanceName: string;
  btTransaction: string;
  fpInstance: any;
  fp_DataID: string;
  RowData=null;
  flowpathInstance: string;
  statusCode: string;
  startTimeStr: string;
  responseTimeStr: string;
  responseTime: number;
  urlName:any;
  urlIndex:any;
  BtCategory:any;
  isSource: any;
  reportID: any;
  fp_RowData: any;
  min_methods: string = null;
  type: string = "method";
  entity: string = "0";

  serviceMTParams:ServiceMethodTimingParams={};
  appId: any;
  serverId: any;
  tierId: any;

  cqmPayload: any;


  constructor (
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    super();
    // this.route.queryParams.subscribe((params) => {
    //   this.stateID = params['state'];
    //   // this.RowData = params['rowID'];
    //   // this.fp_DataID = params['id'];
    //   this.RowData = JSON.parse(params['rowID']);
    //   console.log("Inside method timing req >>>>>",this.RowData)
    //   this.fp_DataID = params['fpData'];
    // });
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    //   this.route.queryParams.subscribe((params) => {
    //   this.stateID = params['state'];
    //   this.RowData = JSON.parse(params['rowID']);
    //   console.log("Inside method timing req >>>>>",this.RowData,me.stateID)
    //   this.fp_DataID = params['fpData'];
    // });


    setTimeout(() => {
      output.next(new MethodTimingLoadingState());
    }, 0);

    me.isSource= me.sessionService.getSetting("ddrSource");
    me.reportID= me.sessionService.getSetting("reportID");
    if(this.isSource == "widget" && me.reportID =="MT"){

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
       me.flowpathInstance = undefined;
       me.urlIndex= undefined ;
       me.urlName= undefined;
       me.BtCategory =undefined;
       me.startTime= state.time[0].startTime;
       me.endTime =state.time[0].endTime;
     }
    else if (this.isSource == "widget" && me.reportID == "FP") {
      let tierName = "";
      this.RowData = me.sessionService.getSetting("aggMtRowData");
      me.flowpathInstance = this.RowData.flowpathInstance;
      me.tierName = this.RowData.tierName;
      me.serverName = this.RowData.serverName;
      me.instanceName = me.RowData.appName;
      me.tierId = this.RowData.tierId;
      me.serverId = this.RowData.serverId;
      me.appId = this.RowData.appId;
      me.urlIndex = undefined;
      me.urlName = undefined;
      me.BtCategory = undefined;
      me.startTime = null;
      me.endTime = null;
    }
     else if (me.reportID === "ATF") {
      this.RowData = me.sessionService.getSetting("TxnFMData");
      // console.log("methodTiming---trnFMData1----",this.RowData)
      if (this.RowData != null) {
        me.flowpathInstance = this.RowData.flowpathInstance;
        me.tierName = this.RowData.tierName;
        me.serverName = this.RowData.serverName;
        me.instanceName = me.RowData.appName;
        //me.appName = this.RowData[0].appName;
        me.tierId = this.RowData.tierId;
        me.serverId = this.RowData.serverId;
        me.appId = this.RowData.appId;
        me.startTimeStr = this.RowData.startTimeInMs;
        me.responseTimeStr = this.RowData.avgBackendDuration;
        me.urlIndex = me.RowData.urlIndex;
        me.sessionService.setSetting("reportID", "FP");
      }
      me.startTime = parseInt(me.startTimeStr);
      me.responseTime = parseInt(me.responseTimeStr);
      me.endTime = me.startTime + me.responseTime;
    } // This case for getting Trxn flowmap table when 'isFromTrxnTableMT' keyword is true...
    else if (me.reportID === "isFromTrxnTableMT") {
      this.RowData = me.sessionService.getSetting("TrxnMTtable");
      console.log("methodTiming---trxnTableData----",this.RowData)
      if (this.RowData != null) {
        me.flowpathInstance = this.RowData.flowPathInstance;
        me.tierName = this.RowData.tierName;
        me.serverName = this.RowData.serverName;
        me.instanceName = me.RowData.instanceName;
        //me.appName = this.RowData[0].appName;
        me.tierId = this.RowData.tierId;
        me.serverId = this.RowData.serverId;
        me.appId = this.RowData.appId;
        me.startTimeStr = this.RowData.startTimeInMs;
        me.responseTimeStr = this.RowData.fpDurationExact ;
        me.urlIndex = me.RowData.urlIndex;
        me.sessionService.setSetting("reportID", "FP");
      }
      me.startTime = parseInt(me.startTimeStr);
      me.responseTime = parseInt(me.responseTimeStr);
      me.endTime = me.startTime + me.responseTime;
    }

    else{
       // getting fp data
        this.RowData = me.sessionService.getSetting("fpRowdata");
        console.log("Inside Methodtiming req this.RowData >>>>>",this.RowData )
    if (me.RowData != null) {
      console.log("Inside me.rowdata req >>>>>",me.RowData);
      me.flowpathInstance = me.RowData.flowpathInstance;
      me.tierName = me.RowData.tierName;
      me.serverName = me.RowData.serverName;
      me.instanceName = me.RowData.appName;
      me.appId= me.RowData.appId;
      me.serverId= me.RowData.serverId;
      me.tierId= me.RowData.tierId;
      me.statusCode = me.RowData.status;
      me.startTimeStr = me.RowData.startTimeInMs;
      me.responseTimeStr = me.RowData.responseTime;
      me.urlName= me.RowData.url;
      me.urlIndex=  me.RowData.urlIndex;
      me.BtCategory = me.RowData.category;
      ///for time set for particular flowpath
      me.startTime = parseInt(me.startTimeStr);
      me.responseTime = parseInt(me.responseTimeStr);
      me.endTime = me.startTime + me.responseTime;
    }
  }

  me.serviceMTParams ={
    tierName : me.tierName,
    serverName:  me.serverName,
    instanceName: me.instanceName,
    appId: me.appId,
    serverId: me.serverId,
    tierId: me.tierId,
    fpInstance: me.flowpathInstance,
    urlIndex: me.urlIndex,
    startTime :me.startTime,
    endTime:me.endTime
  }
    // for (const timeInfo of state.time) {
    //   me.startTime = timeInfo.startTime;
    //   me.endTime = timeInfo.endTime;
    // }

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new MethodTimingLoadedState(METHOD_TIMING_DATA));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new MethodTimingLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.methodTiming.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.instanceName,
        // tierId: "NA",
        // serverId: "NA",
        // appId: "NA",
        urlName: me.btTransaction,
        urlIndex: me.urlIndex,
        flowpathInstance: me.flowpathInstance,
        btCatagory:  me.BtCategory,
        strStartTime: me.startTime,
        strEndTime: me.endTime,
        url: me.urlName,
        // nsUrlIdx: "NA",
        // page: "NA",
        // transaction: "NA",
        // Duration: "undefined",
        // startTimeinDF: "undefined",
        //script: "NA",
        type: me.type,
        entity: me.entity,
        customFlag: "false",
        min_methods: me.min_methods
    };
    me.sessionService.setSetting("cqmPayload",payload);


    me.controller.post(path, payload).subscribe(
      (data: MethodTimingData) => {
        output.next(new MethodTimingLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new MethodTimingLoadingErrorState(e));
        output.complete();

        me.logger.error('Service Method loading failed', e);
      }
    );

    return output;

  }
  loadFromCqm(cqmFilter) : Observable<Store.State> {
    console.log("The value inside the cqmFilter is ......",cqmFilter);
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new MethodTimingLoadingState());
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
    if (cqmFilter["flowpathID"]) {
      me.cqmPayload["flowpathID"] = cqmFilter["flowpathID"];
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
    const path = environment.api.methodTiming.load.endpoint;
    me.controller.post(path, me.cqmPayload).subscribe(
      (data: MethodTimingData) => {
        output.next(new MethodTimingLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new MethodTimingLoadingErrorState(e));
        output.complete();

        me.logger.error('Service Method loading failed', e);
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
          rData.push(tableData[i].pN);
          rData.push(tableData[i].cN);
          rData.push(tableData[i].mN);
          rData.push(tableData[i].fG);
          rData.push(tableData[i].eN);
          rData.push(tableData[i].percent);
          rData.push(tableData[i].sTOrg);
          rData.push(tableData[i].avgST);
          rData.push(tableData[i].totWT);
          rData.push(tableData[i].avgWT);
          rData.push(tableData[i].cumCPUST);
          rData.push(tableData[i].avgCPUST);
          rData.push(tableData[i].eC);
          rData.push(tableData[i].min);
          rData.push(tableData[i].max);
          rData.push(tableData[i].variance);
          rData.push(tableData[i].waitTime);
          rData.push(tableData[i].syncTime);
          rData.push(tableData[i].iotime);
          rData.push(tableData[i].suspensiontime);


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
        "reportTitle": "Method Timing Report"
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



