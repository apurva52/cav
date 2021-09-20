import { Injectable, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {
  FlowPathLoadingState,
  FlowPathLoadedState,
  FlowPathLoadingErrorState,
} from './flow-path.state';
import { environment } from 'src/environments/environment';
import { FlowPathTable } from './flow-path.model';
import { SessionService } from 'src/app/core/session/session.service';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { ActivatedRoute } from '@angular/router';
import { symlink } from 'fs';
import {
  DownloadReportLoadingState,
  DownloadReportLoadedState,
  DownloadReportLoadingErrorState,
} from './flow-path.state';
import { AppError } from 'src/app/core/error/error.model';
import { TablePagination } from 'src/app/shared/table/table.model';
import { ClientCTX, DDRParams } from 'src/app/core/session/session.model';

@Injectable({
  providedIn: 'root',
})
export class FlowPathService extends Store.AbstractService {
  stateID: string;
  getTimeData = [];
  tierName: string;
  startTime: number;
  endTime: number;
  serverName: string;
  instanceName: string;
  btTransaction: string;
  btCategory: any;
  isSource: any;
  reportID: any;
  RowData: any;
  sqlIndex: any;
  flowpathID: any;
  urlIndex:any;
  selectedData: any;
  cqmPayload: any;
  ndSessionId: string = null;
  nvSessionId: string = null;
  nvPageId: string = null;
  NVtoNDFilterForAngular: string = null;
  cctx: ClientCTX ={
    pk:"",
    cck:"",
    u:"",
    prodType:""
  };
  testRun:any;
  ddrParam: DDRParams;
  requestFrom:string;
  compareFlowpathData: any[];

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    super();
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']
    });
  }
  load(def_pagination?: TablePagination): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new FlowPathLoadingState());
    }, 0);
    if(me.stateID === 'DDRCOPYLINK'){
      me.ddrParam = me.sessionService.ddrParam;
      me.requestFrom = me.ddrParam.requestFrom;
      if(me.ddrParam.testRun){
        me.testRun = me.ddrParam.testRun;
      }
      if(me.ddrParam.tierName){
        me.tierName = me.ddrParam.tierName;
      }
      if(me.ddrParam.serverName){
        me.serverName = me.ddrParam.serverName;
      }
      if(me.ddrParam.appName){
        me.instanceName = me.ddrParam.appName;
      }
      if(me.ddrParam.flowpathID){
        me.flowpathID = me.ddrParam.flowpathID;
      }
      if(me.ddrParam.startTime){
        me.startTime = Number(me.ddrParam.startTime);
      }
      if(me.ddrParam.endTime){
        me.endTime = Number(me.ddrParam.endTime);
      }
      if(me.ddrParam.sqlIndex){
        me.sqlIndex = me.ddrParam.sqlIndex;
      }
      if(me.ddrParam.urlIndex){
        me.urlIndex = me.ddrParam.urlIndex;
      }
      if(me.ddrParam.btCategory){
        me.btCategory = me.ddrParam.btCategory;
      }
      if(me.ddrParam.urlName){
        me.btTransaction = me.ddrParam.urlName;
      }
      if(me.ddrParam.pk && me.ddrParam.cck && me.ddrParam.u && me.ddrParam.prodType){
        me.cctx.pk = me.ddrParam.pk;
        me.cctx.u = me.ddrParam.u;
        me.cctx.cck = me.ddrParam.cck;
        me.cctx.prodType = me.ddrParam.prodType;
      }
      if(me.ddrParam.first && me.ddrParam.rows){
        def_pagination.first = me.ddrParam.first;
        def_pagination.rows = me.ddrParam.rows;
      }


    }else {
      const state: WidgetDrillDownMenuItem = me.sessionService.getSetting(me.stateID, null);
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
      for (const timeInfo of state.time) {
        me.startTime = timeInfo.startTime;
        me.endTime = timeInfo.endTime;
      }
      me.btCategory = me.sessionService.getSetting('ddrBtCategory')
      if (me.btCategory === "Normal")
        me.btCategory = '10';
      else if (me.btCategory === "Slow")
        me.btCategory = '11';
      else if (me.btCategory === "VerySlow")
        me.btCategory = '12';
      else if (me.btCategory === "Error")
        me.btCategory = '13';
      me.cctx = me.sessionService.session.cctx;
      me.testRun = me.sessionService.testRun.id;
      // // DEV CODE ----------------->
      // setTimeout(() => {
      //   output.next(new FlowPathLoadedState(FLOW_PATH_TABLE));
      //   output.complete();
      // }, 2000);
      // setTimeout(() => {
      //   output.error(new FlowPathLoadingErrorState(new Error()));
      // }, 2000);
      // // <----------------- DEV CODE
      me.sqlIndex = 'undefined';
      me.isSource = me.sessionService.getSetting("ddrSource");
      me.reportID = me.sessionService.getSetting("reportID");
      if (me.isSource == "widget" && (me.reportID == "DBR" || me.reportID == "DBG_BT")) {
        me.RowData = me.sessionService.getSetting("dbRowData");
        me.tierName = me.RowData.tierName;
        me.serverName = me.RowData.serverName;
        me.instanceName = me.RowData.appName;
        me.btTransaction = '';
        me.btCategory = 'undefined';
        me.sqlIndex = me.RowData.sqlIndex;
      }
      if (me.isSource == "widget" && me.reportID == "FPG_BT") {
        me.RowData = me.sessionService.getSetting("fpGroupbyRowData");
        me.urlIndex = me.RowData.urlIndex;
        me.btTransaction = me.RowData.urlName;
        me.btCategory = me.RowData.btCatagory;
      }
    }
    const path = environment.api.flowpath.load.endpoint;
    const payload = {
      cctx: me.cctx,
      testRun: me.testRun,
      flowpathSignature: 'NA',
      strGroup: 'NA',
      tierName: me.tierName,
      serverName: me.serverName,
      appName: me.instanceName,
      tierId: 'undefined',
      serverId: 'undefined',
      appId: 'undefined',
      flowpathID: me.flowpathID,
      strStartTime: me.startTime,
      strEndTime: me.endTime,
      threadId: 'undefined',
      sqlIndex: me.sqlIndex,
      urlIndex: me.urlIndex,
      btCategory: me.btCategory,
      flowpathEndTime: 'undefined',
      statusCode: '-2',
      object: 4,
      checkBoxValForURLIndexFromURLName: 'undefined',
      urlName: me.btTransaction,
      strOrderBy: 'fpduration_desc',
      mode: null,
      pageIdx: 'undefined',
      pageName: 'undefined',
      transtx: 'undefined',
      script: 'undefined',
      sessionIndex: 'undefined',
      nsUrlIdx: 'undefined',
      location: 'undefined',
      access: 'undefined',
      userBrowserIndex: 'undefined',
      strStatus: 'undefined',
      generatorId: 'undefined',
      generatorName: 'undefined',
      urlNameFC: 'undefined',
      limit: def_pagination.rows,
      offset: def_pagination.first,
      shellForNDFilters: '1',
      customFlag: false,
      showCount: false,
      queryId: '309531',
      ndSessionId: me.ndSessionId,
      nvSessionId: me.nvSessionId,
      nvPageId: me.nvPageId,
      NVtoNDFilterForAngular: me.NVtoNDFilterForAngular
    };

    /*setting flowpathID's in payload */
    if (me.reportID == "FPA") {
      payload['flowpathID'] = me.sessionService.getSetting('fpIDs');
    }
    if (me.reportID == "EXC") {
      payload['flowpathID'] = me.sessionService.getSetting('fpIDs');
    }
    me.sessionService.setSetting("def_pagination", def_pagination);
    me.sessionService.setSetting("compareflowpathpayload", payload);
    me.sessionService.setSetting("cqmPayload", payload);
    me.controller.post(path, payload).subscribe(
      (data: FlowPathTable) => {
        output.next(new FlowPathLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new FlowPathLoadingErrorState(e));
        output.complete();
        me.logger.error('Flow Path Data loading failed', e);
      }
    );
    return output;
  }

  loadFromCqm(cqmFilter): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FlowPathLoadingState());
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
    if (cqmFilter["flowpathID"]) {
      me.cqmPayload["flowpathID"] = cqmFilter["flowpathID"];
    }
    if (cqmFilter["corModeValue"] && cqmFilter["correlationId"]) {
      me.cqmPayload["corModeValue"] = cqmFilter["corModeValue"];
      me.cqmPayload["correlationId"] = cqmFilter["correlationId"];
    }
    if (cqmFilter["strOrderBy"]) {
      me.cqmPayload["strOrderBy"] = cqmFilter["strOrderBy"];
    }
    if (cqmFilter["selectedBTCategory"]) {
      me.cqmPayload["btCategory"] = cqmFilter["selectedBTCategory"];
    }
    if (cqmFilter["minMethods"]) {
      me.cqmPayload["minMethods"] = cqmFilter["minMethods"];
    }
    if(cqmFilter["checkDLFlag"]) {
      me.cqmPayload["checkDLFlag"] = cqmFilter["checkDLFlag"];
    }
    if(cqmFilter["checkReqRespFlag"]) {
      me.cqmPayload["checkReqRespFlag"] = cqmFilter["checkReqRespFlag"];
    }
    console.log("The value inside the cqmFlowpath payload is ....", me.cqmPayload);
    const path = environment.api.flowpath.load.endpoint;
    me.controller.post(path, me.cqmPayload).subscribe(
      (data: FlowPathTable) => {
        output.next(new FlowPathLoadedState(data));
        console.log("Hi i am inside this on loaded state", data);
        output.complete();
      },
      (e: any) => {
        output.error(new FlowPathLoadingErrorState(e));
        output.complete();
        me.logger.error('Flow Path Data loading failed', e);
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
      let rowData: any[] = [];
      for (let i = 0; i < tableData.length; i++) {
        let rData: string[] = [];
        let number = i + 1;
        rData.push(number.toString());
        rData.push(tableData[i].businessTransaction);
        rData.push(tableData[i].url);
        rData.push(tableData[i].catagoryName);
        rData.push(tableData[i].startTime);
        rData.push(tableData[i].responseTime);
        rData.push(tableData[i].cpu);
        rData.push(tableData[i].methods);
        rData.push(tableData[i].callOuts);
        rData.push(tableData[i].dbCallouts);
        rData.push(tableData[i].status);
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
        "reportTitle": "FlowPath Report"
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
