import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { EventLoadingState, EventLoadedState, EventLoadingErrorState } from './event.state';
import { EventsTableLoadPayload, FilterObject } from './event.model';
import { EVENTS_TABLE } from './event.dummy';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';

@Injectable({
  providedIn: 'root',
})
export class EventService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  load(filterObj: FilterObject): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // setTimeout(() => {
    //   output.next(new EventLoadingState());
    // }, 0);


    // setTimeout(() => {
    //   output.next(new EventLoadedState());
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new EventLoadingErrorState(new Error()));
    // }, 2000);

    let path = environment.api.allEvent.load.endpoint;
    const payload : EventsTableLoadPayload = {
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      type: filterObj.type,
      severity: filterObj.severity,
      sp: filterObj.sp
      }

    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

              output.next(new EventLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new EventLoadingErrorState(error));
            output.complete();
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
        rData.push(tableData[i].id);
        rData.push(tableData[i].source);
        rData.push(tableData[i].rName);
        rData.push(tableData[i].type);
        rData.push(tableData[i].sev);
        rData.push(tableData[i].time);
        rData.push(tableData[i].timeAgo);
        rData.push(tableData[i].message);
        rData.push(tableData[i].indices);
        rData.push(tableData[i].value);
        rData.push(tableData[i].cExpression);
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
        "reportTitle": "EVENT VIEW ALL"
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
      console.error("Exception has occured while Downloading Report for Show Description", err);
    }
  }
  
}
