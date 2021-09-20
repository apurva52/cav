import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { RepeatedCalloutDetailsLoadingState, RepeatedCalloutDetailsLoadedState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState } from './repeated-callout-details.state';
import { REPEATED_CALLOUT_DETAILS_TABLE } from './repeated-callout-details.dummy';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';


@Injectable({
  providedIn: 'root',
})
export class RepeatedCalloutDetailsService extends Store.AbstractService {

  constructor (
    private sessionService: SessionService
  ) {
    super();
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new RepeatedCalloutDetailsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new RepeatedCalloutDetailsLoadedState(REPEATED_CALLOUT_DETAILS_TABLE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new RepeatedCalloutDetailsLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: RepeatedCalloutDetailsTable) => {
    //     output.next(new RepeatedCalloutDetailsLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new RepeatedCalloutDetailsLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Repeated Callout Details Data loading failed', e);
    //   }
    // );

    return output;
  }
  downloadShowDescReports(downloadType, rowData, header): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let skipColumn = [];
      let downloadDataPayload = {};
      downloadDataPayload = {
        "testRun": me.sessionService.testRun.id,
        "clientconnectionkey": me.sessionService.session.cctx.cck,
        "userName": me.sessionService.session.cctx.u,
        "productName": me.sessionService.session.cctx.prodType,
        "downloadType": downloadType,
        "skipColumn": skipColumn,
        "rowData": rowData,
        "header": header,
        "reportTitle": "Repeated Method Details Report"
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
