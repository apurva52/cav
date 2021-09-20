import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { SERVICE_METHOD_TIMING_DATA } from './service-method-timing.dummy';
import { ServiceMethodTimingData } from './service-method-timing.model';
import { ServiceMethodTimingLoadedState, ServiceMethodTimingLoadingErrorState, ServiceMethodTimingLoadingState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState } from './service-method-timing.state';
import { ServiceMethodTimingParams } from '../../service/method-timing.model';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceMethodTimingService extends Store.AbstractService {
  
  customFlag: string = "false";
  Duration: string;
  startTimeinDF: string;
  limit: string = "50";
  offset: string = "0";
  queryId: string;
  serviceMTParams:ServiceMethodTimingParams={};


  constructor(private sessionService: SessionService) {
    super();
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ServiceMethodTimingLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new ServiceMethodTimingLoadedState(SERVICE_METHOD_TIMING_DATA));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new ServiceMethodTimingLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.servicemethodtiming.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      testRun: me.sessionService.session.testRun.id,
      tierName: me.serviceMTParams.tierName,
      serverName: me.serviceMTParams.serverName,
      appName: me.serviceMTParams.instanceName,
      tierId: me.serviceMTParams.tierId,
      serverId: me.serviceMTParams.serverId,
      appId: me.serviceMTParams.appId,
      methodId: me.serviceMTParams.methodID,
      fpInstance: me.serviceMTParams.fpInstance,
      urlIndex: me.serviceMTParams.urlIndex,
      absStartTime: me.serviceMTParams.startTime.toString(),
      absEndtime: me.serviceMTParams.endTime.toString(),
      customFlag: me.customFlag,
      Duration: me.Duration,
      startTimeinDF: me.startTimeinDF,
      limit: me.limit,
      offset: me.offset,
      queryId: me.randomNumber()
    };

    me.controller.post(path, payload).subscribe(
      (data: ServiceMethodTimingData) => {
        output.next(new ServiceMethodTimingLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new ServiceMethodTimingLoadingErrorState(e));
        output.complete();

        me.logger.error('Method Summary loading failed', e);
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
	  rData.push(tableData[i].JSPName);
          rData.push(tableData[i].cumSelfTime);
          rData.push(tableData[i].avgSelfTime);
	  rData.push(tableData[i].cumCPUTime);
          rData.push(tableData[i].avgCPUTime);
          rData.push(tableData[i].executionTime);
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
        "reportTitle": "Service-Method-Timing Report"
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
  randomNumber() {
    return (Math.random() * 1000000).toFixed(0);
  }
}
