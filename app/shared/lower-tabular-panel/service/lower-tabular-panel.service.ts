import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { onDownloadLoadedState, onDownloadLoadingErrorState, onDownloadLoadingState } from './lower-tabular-panel.state';
@Injectable({
  providedIn: 'root'
})
export class LowerPanelService extends Store.AbstractService {
 /*Observable string sources.*/
 private lowerPanelTableUpdateService = new Subject<any>();

 /*Service Observable for getting data update for lower panel.*/
 lowerPanelUpdateProvider$ = this.lowerPanelTableUpdateService.asObservable();

  templateList: any;
  editAddedTemplate: any;
  isEdit = false;
  previousTempName = "";
  previousReportSetName = "";
  private value = new BehaviorSubject<boolean>(true);
  constructor(public sessionService: SessionService,) {
    super();
  }
  setLowerPanelValue(isReload: any) {
    this.value.next(isReload);
  }

  isLowerPanelValue() {
    return this.value.asObservable();
  }
  downloadTableData(type, dataArr,header,skipColumn, title):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new onDownloadLoadingState());
    }, 0);

    let arrData = [];
    for (let i = 0; i < dataArr.length; i++) {
      let rowDataObj = dataArr[i];
      // console.log("row data comiggg" , rowDataObj)
      let rowDataArr :any []=[];
      rowDataArr.push((i+1).toString());
       rowDataArr.push(rowDataObj.metricName);
      // rowDataArr.push(rowDataObj.color);
      for (var prop in rowDataObj) {
        if (rowDataObj.hasOwnProperty(prop) && (prop != 'color' && prop != 'selected' && prop != 'metricName')) {
           var innerObj = {};
           innerObj[prop] = rowDataObj[prop];
           rowDataArr.push(innerObj[prop]);
        }
     }

      // rowDataArr.push( rowDataObj.min);
      // rowDataArr.push( rowDataObj.max);
      // rowDataArr.push(rowDataObj.avg);
      // rowDataArr.push( rowDataObj.stdDev);
      // rowDataArr.push(rowDataObj.lastSample);
      // rowDataArr.push(rowDataObj.count);

      // console.log("row array " , rowDataArr)
      arrData.push(rowDataArr);
    }
    const payload = {
      testRun: me.sessionService.session.testRun.id,
      type: type,
      skipColumn: skipColumn.join(),
      rowData: arrData,
      cctx: me.sessionService.session.cctx,
      title: "Metric Statistics",
      lowerPanelTitle : title,
      header: header,
      colWidth: [80,90,200,90,90,90,90,90],
     };
    const path = environment.api.downloadData.load.endpoint;
    const base = environment.api.core.defaultBase;

    me.controller.post(path,payload,base).subscribe((data) => {

      output.next(new onDownloadLoadedState(data));
      output.complete();
      },
      (e: any) => {
        output.error(new onDownloadLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );
    return output;
  }

  updateLowerPanel(actionInfo: any) {
    /*Observable string streams.*/
    this.lowerPanelTableUpdateService.next(actionInfo);
  }

}
