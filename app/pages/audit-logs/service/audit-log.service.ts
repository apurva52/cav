import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { environment } from 'src/environments/environment';
import { AUDIT_LOG_TABLE } from './audit-log.dummy';
import { AuditLogsTableLoadPayload } from './audit-log.model';
import {
  AuditLoadedState,
  AuditLoadingErrorState,
  AuditLogLoadingState,
} from './audit-log.state';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService extends Store.AbstractService {
  sp: string;
  include: boolean;
  st:string;
  et:string;
  constructor(private sessionService: SessionService) {
    super();
  }

  load(payload: AuditLogsTableLoadPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // setTimeout(() => {
    //   output.next(new AuditLogLoadingState());
    // }, 0);

    // setTimeout(() => {
    //   output.next(new AuditLoadedState());
    //   output.complete();
    // }, 2000);
    // setTimeout(() => {
    //   output.error(new AuditLoadingErrorState(new Error()));
    // }, 2000);

    let path = environment.api.auditlog.load.endpoint;

    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {
        // console.log("post call success", data)
        output.next(new AuditLoadedState(data));
        output.complete();
      },
      (error: AppError) => {
       // console.log('post call error', error);
        output.error(new AuditLoadingErrorState(error));
        output.complete();
      }
    );
    return output;
  }

  public getSelectedPreset(): string {
    return this.sp;
  }

  public setSelectedPreset(value: string) {
    this.sp = value;
  }

  public getInclude(): boolean {
    return this.include;
  }

  public setInclude(value: boolean) {
    return this.include = value;
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
        "lowerPanelTitle": "( "+ me.st + " to " + me.et + " )",
        "rowData": rowData,
        "header": header,
        "title": "AUDIT LOGS",
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
