import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { GeolocationService } from '../../../service/geolocation.service';
import { TOP_TRANSACTION_DATA } from './top-transaction.dummy';
import { TopTransactionData } from './top-transaction.model';
import {
  TopTransactionsLoadedState,
  TopTransactionsLoadingErrorState,
  TopTransactionsLoadingState,
} from './top-transaction.state';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { AppError } from 'src/app/core/error/error.model';

@Injectable({
  providedIn: 'root',
})
export class TopTransactionService extends Store.AbstractService {
  constructor(private sessionService: SessionService, private geolocationService: GeolocationService) {
    super();
  }

  load(selectedApp, duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TopTransactionsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new TopTransactionsLoadedState(TOP_TRANSACTION_DATA));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new TopTransactionsLoadingErrorState(new Error()));
    // }, 2000);

    console.log('SelectedAPp===>',selectedApp);
    console.log('durationObj===>',duration);
    /// <----------------- DEV CODE

    const path = environment.api.geoLocation.topTransactions.endpoint;
    const payload = {
      // localDataCtx: {
      //   "fromLocal": true,
      //   "path": "/home/cavisson/work_shankar/webapps/sys/KPI/data/tsdb-dummy.json"
      // },
      dataFilter: [
        0,
        1,
        2,
        3,
        4,
        5,
        6
      ],
      cctx: me.sessionService.session.cctx,
      storeAlertType: this.geolocationService.payLoadData.storeAlertType,
      tr: me.sessionService.testRun.id,
      duration: duration,
      opType: 11,
      appName:"All",
    };

    me.controller.post(path, payload).subscribe(
      (data: TopTransactionData) => {
        output.next(new TopTransactionsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TopTransactionsLoadingErrorState(e));
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
    "title": "TOP10 TRANSACTION",
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
