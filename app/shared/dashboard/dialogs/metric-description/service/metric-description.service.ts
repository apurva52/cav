import { AppError } from 'src/app/core/error/error.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import {
  MetricDescLoadingState,
  MetricDescLoadedState,
  MetricDescLoadingErrorState,
  DownloadReportLoadedState,
  DownloadReportLoadingErrorState,
  DownloadReportLoadingState,
} from './metric-description.state';


@Injectable({
  providedIn: 'root'
})
export class MetricDescriptionService extends Store.AbstractService {
  tableData: any;
 
  constructor(private sessionService: SessionService) {
    super();
  }
  downloadShowDescReports(downloadType, tableData): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let header: string[] = [];
      header.push("#");
      header.push("Metric Name");
      header.push("Metric Description");

      let skipColumn = [];
      let downloadDataPayload = {};
      let rowData:any []=[];

      for(let i =0;i<tableData.length;i++)
      {
        let rData:string []=[];
        rData.push(tableData[i].metricId);
        rData.push(tableData[i].name);
        rData.push(tableData[i].description);
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
	"reportTitle":"MetricDescription"
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

  loadShowDesc(graphDescPayload): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new MetricDescLoadingState());
      }, 0);

      const showDescpath = environment.api.dashboard.graph.endpoint;
      me.controller.post(showDescpath, graphDescPayload).subscribe((descData: any) => {
        output.next(new MetricDescLoadedState(descData));
        output.complete();
      },
        (error: AppError) => {

          output.next(new MetricDescLoadingErrorState(error));
          output.complete();
        }
      );
      return output;
    } catch (err) {
      console.log("Exception has occured in load call for Show Description", err);

    }
  }

}





