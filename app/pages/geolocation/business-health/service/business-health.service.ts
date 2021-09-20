import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { BUSINESS_HEALTH_TABLE } from './business-health.dummy';
import { BusinessHealthTable, BusinessHealthTableLoadPayload } from './business-health.model';
import { BusinessHealthLoadedState, BusinessHealthLoadingErrorState, BusinessHealthLoadingState } from './business-health.state';
import { PayLoadData } from '../../service/geolocation.model';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessHealthService extends Store.AbstractService {
    payLoadData : PayLoadData;
   constructor(private sessionService: SessionService) {
    super();
    this.payLoadData = new PayLoadData();
  }
  
  load(selectedAppName, duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new BusinessHealthLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new BusinessHealthLoadedState(BUSINESS_HEALTH_TABLE));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new BusinessHealthLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.geoLocation.businessHealth.endpoint;
    const payload = {
      //localDataCtx: me.payLoadData.localDataCtx,
      cctx:me.sessionService.session.cctx,
      dataFilter: me.payLoadData.dataFilter,
      duration: duration,
      dc: me.payLoadData.dc,
      appName: selectedAppName,
      isAll: me.payLoadData.isAll,
      multiDc: me.payLoadData.multiDc,
      opType: me.payLoadData.opType,
      storeAlertType: me.payLoadData.storeAlertType,
      isGoodStore: "0",   // not needed [TBD]
      tr: me.sessionService.testRun.id
  }
    me.controller.post(path, payload).subscribe(
      (data: BusinessHealthTable) => {
        output.next(new BusinessHealthLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new BusinessHealthLoadingErrorState(e));
        output.complete();

        me.logger.error('Business Health Data loading failed', e);
      }
    );

    return output;
  }
  downloadShowDescReports(downloadType, rowData, header, colWidth): Observable<Store.State> {
    try {
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
    output.next(new DownloadReportLoadingState());
    }, 3000);
    
    let skipColumn = "";
    let downloadDataPayload = {};
    
    downloadDataPayload = {
    "testRun": me.sessionService.testRun.id,
    "cctx": me.sessionService.session.cctx,
    "type": downloadType,
    "skipColumn": skipColumn,
    "rowData": rowData,
    "header": header,
    "title": "BUSINESS HEALTH",
    "colWidth": colWidth
    }
    
    let downloadPath = environment.api.downloadData.load.endpoint;
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
    console.error("Exception has occured while Downloading Report for Show Description", err);
    }
    }
}

