import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { TABLE_JSON } from './template.dummy';
import { environment } from 'src/environments/environment';
import { DeleteTemplate, EditTemplate, TemplateTable } from './template.model';
import { TemplateTableLoadingState, TemplateTableLoadedState, TemplateTableLoadingErrorState, DeleteTemplateLoadingState, DeleteTemplateLoadingErrorState, DeleteTemplateLoadedState, EditTemplateLoadingState, EditTemplateLoadingErrorState, EditTemplateLoadedState, onDownloadLoadingState, onDownloadLoadedState, onDownloadLoadingErrorState } from './template.state';
@Injectable({
  providedIn: 'root'
})
export class TemplateService extends Store.AbstractService {

  templateList: any;
  editAddedTemplate: any;
  isEdit = false;
  previousTempName = "";
  previousReportSetName = "";
  paginateEventTemplate:any;
  constructor(public sessionService: SessionService,) {
    super();
  }

  loadTemplate(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TemplateTableLoadingState());
    }, 0);
    const path = environment.api.report.availableTemplates.endpoint;
    const base = environment.api.core.defaultBase;
    const payload = {
      cctx: me.sessionService.session.cctx,

    };
    me.controller.post(path, payload).subscribe(
      (data: TemplateTable[]) => {
        output.next(new TemplateTableLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TemplateTableLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );

    return output;
  }
  deleteTemplateList(tempInfoList): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new DeleteTemplateLoadingState());
    }, 0);
    const path = environment.api.report.deleteTemplate.endpoint;
    const base = environment.api.core.defaultBase;
    const payload = {
      cctx: me.sessionService.session.cctx,
      temInfo: tempInfoList,
    };
    me.controller.post(path, payload).subscribe(
      (data: DeleteTemplate[]) => {
        output.next(new DeleteTemplateLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new DeleteTemplateLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );
    return output;
  }
  editTemplateList(editInfoList): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new EditTemplateLoadingState());
    }, 0);
    const path = environment.api.report.editTemplate.endpoint;
    const base = environment.api.core.defaultBase;
    const payload = {
      cctx: me.sessionService.session.cctx,
      temInfo: [editInfoList],
    };
    me.controller.post(path, payload).subscribe(
      (data: EditTemplate[]) => {
        output.next(new EditTemplateLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new EditTemplateLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );
    return output;
  }

  downloadTableData(type, dataArr,header,skipColumn): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new onDownloadLoadingState());
    }, 0);


    let arrData :any []=[];
 
    for (let i = 0; i < dataArr.length; i++) {
      let rowDataObj = dataArr[i];
      let rowDataArr :any []=[];
      rowDataArr.push((i+1).toString);
      rowDataArr.push(rowDataObj.tn);
      rowDataArr.push(rowDataObj.type);
      rowDataArr.push(rowDataObj.rptSetNum);
      rowDataArr.push(rowDataObj.md);
      rowDataArr.push(rowDataObj.un);
      rowDataArr.push( rowDataObj.des);
      arrData.push(rowDataArr);
    }
    let widthData = [];
    if(type !== "excel"){
      widthData = [300, 60, 90, 90, 60, 400];
    }
    const payload = {
      testRun : parseInt(me.sessionService.session.testRun.id),
      type: type,
      skipColumn: skipColumn.join(),
      rowData: arrData,
      cctx: me.sessionService.session.cctx,
      title: "Template",
      header: header,
      colWidthinPct: widthData,
    };
    const path = environment.api.downloadData.load.endpoint;
    const base = environment.api.core.defaultBase;

    me.controller.post(path, payload).subscribe((data) => {
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
  paginate(event){
    this.paginateEventTemplate = event;
  }
}
