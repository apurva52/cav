import { Injectable } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { GraphDataLoadingState, GraphDataLoadedState } from './graph-data.state';
import { GRAPH_DATA_TABLE } from './graph-data.dummy';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
import { DownloadShowGrapDataLoadedState, DownloadShowGrapDataLoadingErrorState, DownloadShowGrapDataLoadingState } from './graph-data.state';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  downloadShowGraphData(downloadType, tableData,cols): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadShowGrapDataLoadingState());
      }, 3000);

      let header: string[] = [];
      for(let i= 0;i<cols.length;i++){
      header.push(cols[i].label);
    }

      let skipColumn = [];
      let downloadDataPayload = {};
      let rowData:any []=[];
      let objs = Object.keys(tableData[0]);
      for(let i =0;i<tableData.length;i++)
      {
        let rData:string []=[];
       for(let j= 0;j<header.length;j++){
        rData[j] = me.makeRowData(cols[j].valueField,objs,tableData[i]) ;
       }
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
	      "reportTitle":"MetricGraph"
      }

      let downloadPath = environment.api.dashboard.download.endpoint;
      me.controller.post(downloadPath, downloadDataPayload).subscribe((DownloadtData: any) => {
      output.next(new DownloadShowGrapDataLoadedState(DownloadtData));
      output.complete();
      },
        (error: AppError) => {
          output.next(new DownloadShowGrapDataLoadingErrorState(error));
          output.complete();
        }
      );
      return output;
    } catch (err) {
      console.log("Exception has occured while Downloading Report for Show Graph Data", err);
    }
  }

  makeRowData(header,objs,tableData){
  let rows:string = "";
  if(objs.indexOf(header) != -1){
  rows = tableData[header];
  }  
   return rows;
  }

}
