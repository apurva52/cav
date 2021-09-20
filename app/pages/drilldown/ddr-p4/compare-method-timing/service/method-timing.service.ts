import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { environment } from 'src/environments/environment';
import { METHOD_TIMING_DATA } from './method-timing.dummy';
import { MethodTimingData } from './method-timing.model';
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
     }else{
       // getting fp data
        this.RowData = me.sessionService.getSetting("fpRowdata");
        console.log("Inside Methodtiming req this.RowData >>>>>",this.RowData )
    if (me.RowData != null) {
      console.log("Inside me.rowdata req >>>>>",me.RowData);
      me.flowpathInstance = me.RowData.flowpathInstance;
      me.tierName = me.RowData.tierName;
      me.serverName = me.RowData.serverName;
      me.instanceName = me.RowData.appName;
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
        type: "method",
        entity: "0",
        customFlag: "false"
    };


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



