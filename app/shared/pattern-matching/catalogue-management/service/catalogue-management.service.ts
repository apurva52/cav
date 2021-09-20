import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { onDownloadLoadedState, onDownloadLoadingErrorState, onDownloadLoadingState } from 'src/app/shared/lower-tabular-panel/service/lower-tabular-panel.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogueManagementService extends Store.AbstractService {
  private dashboard = new BehaviorSubject<DashboardComponent>(null);
  globalCatFlag:boolean;
  getGlobalCatFlag(){
    return this.globalCatFlag;
  }
  setGlobalCatFlag(globalCatFlag){
   this.globalCatFlag =globalCatFlag;
  }
  setDashboard(isReload: any) {
    this.dashboard.next(isReload);
  }
  
  isDashboard() {
    return this.dashboard.asObservable();
  }
  constructor(public sessionService: SessionService) {
    super();
   }

  downloadCatalogueTableData(type, dataArr,header,skipColumn):Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new onDownloadLoadingState());
    }, 0);

    let arrData = [];
    for (let i = 0; i < dataArr.length; i++) {
      let rowDataObj = dataArr[i];
      let rowDataArr :any []=[];
      rowDataArr.push(rowDataObj.serial);
       rowDataArr.push(rowDataObj.name);
       rowDataArr.push(rowDataObj.metricType);
       rowDataArr.push(rowDataObj.description);
       rowDataArr.push(rowDataObj.createdBy);
       rowDataArr.push(rowDataObj.creationDate);
       arrData.push(rowDataArr);
    }

 
    const payload = {
      testRun: me.sessionService.session.testRun.id,
      type: type,
      //skipColumn: skipColumn.join(),
      rowData: arrData,
      cctx: me.sessionService.session.cctx,
      title: "Catalogue Data",
      header: header,
      colWidth: [80,90,90,90,90,90],
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
      }
    );
    return output;
  }

}
