import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { AddReportService } from '../../../metrics/add-report/service/add-report.service';

import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
import { AlertDigestListLoadingErrorState, AlertDigestTaskListLoadedState, AlertDigestTaskListLoadingState, FavoriteTaskListLoadedState, FavoriteTaskListLoadingErrorState, FavoriteTaskListLoadingState, 
FavTaskListLoadedState, 
FavTaskListLoadingErrorState,
FavTaskListLoadingState, 
TemplateTaskListLoadedState, 
TemplateTaskListLoadingErrorState, 
TemplateTaskListLoadingState, 
ReportTimebarTimeLoadingState, 
ReportTimebarTimeLoadingErrorState, 
ReportTimebarTimeLoadedState,
AddReportTaskLoadingState,
AddReportTaskLoadedState,
AddReportTaskLoadingErrorState,
UpdateReportTaskLoadingState,
UpdateReportTaskLoadedState,
UpdateReportTaskLoadingErrorState
} from './schedulereport.state';
import { TempFavList } from './schedulereport.model';
import { ReportConstant } from '../../../metrics/add-report/service/add-report-enum';
import { DeleteTemplateLoadingState, DeleteTemplateLoadedState, DeleteTemplateLoadingErrorState } from '../../../template/service/template.state';
import { DeleteTemplate } from '../../../template/service/template.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleReportService extends Store.AbstractService {
  presetData:any;
  constructor(public sessionService: SessionService) {
    super();
  }
  onTakingTempFavTaskList(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FavoriteTaskListLoadingState());
    }, 0);

    const payload = {
      cctx: me.sessionService.session.cctx,
      rT: ReportConstant.EXCEL_REPORT,
    };
    const path = environment.api.report.getTemplateFavList.endpoint;
    const base = environment.api.core.defaultBase;
    me.controller.post(path, payload).subscribe((data) => {
      output.next(new FavoriteTaskListLoadedState(data));
      output.complete();
    }, (e: any) => { 

      output.error(new FavoriteTaskListLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });
    return output;
  }

  onTakingFavTaskList(path, payload, base): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FavTaskListLoadingState());
    }, 0);

    // const payload = {
    //   cctx:  me.sessionService.session.cctx, 
    //   tr:  me.sessionService.session.testRun,   
    // };
    // const path = environment.api.report.getTemplateFavList.endpoint;
    // const base = environment.api.core.defaultBase;
    me.controller.post(path, payload).subscribe((data) => {
      output.next(new FavTaskListLoadedState(data));
      output.complete();
    }, (e: any) => {

      output.error(new FavTaskListLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

    return output;
  }
  onTakingTemplateTaskList(path, payload, base): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TemplateTaskListLoadingState());
    }, 0);

    me.controller.post(path, payload).subscribe((data) => {
      output.next(new TemplateTaskListLoadedState(data));
      output.complete();
    }, (e: any) => {

      output.error(new TemplateTaskListLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

    return output;
  }


  onTakingAlertDigestTemplateTaskList(path, payload, base): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AlertDigestTaskListLoadingState());
    }, 0);

    me.controller.post(path, payload).subscribe((data) => {
      output.next(new AlertDigestTaskListLoadedState(data));
      output.complete();
    }, (e: any) => {

      output.error(new AlertDigestListLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

    return output;
  }
  loadTime(timePeriod: string, viewBy?: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ReportTimebarTimeLoadingState());
    }, 0);

    const path = environment.api.globalTimebar.time.endpoint;
    const session = me.sessionService.session;

    if (session) {
      let payload = {
        cck: session.cctx.cck,
        tr: me.sessionService.testRun.id,
        pk: session.cctx.pk,
        u: session.cctx.u,
        // svb: viewBy,
        sp: timePeriod,
      };

      me.controller.get(path, payload).subscribe(
        (data: number[]) => {
          output.next(new ReportTimebarTimeLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ReportTimebarTimeLoadingErrorState(e));
          output.complete();

          me.logger.error('ReportTimebar Time Loading failed', e);
        }
      );
    }

    return output;
  }
  addReportTask(payload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new AddReportTaskLoadingState());
    }, 0);
    const base = environment.api.core.defaultBase;
    const path = environment.api.report.addReportTask.endpoint;
    me.controller.post(path, payload).subscribe((data) => {
      output.next(new AddReportTaskLoadedState(data));
      output.complete();
    }, (e: any) => {

      output.error(new AddReportTaskLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

    return output;
  }
  updateReportTask(payload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new UpdateReportTaskLoadingState());
    }, 0);
    const base = environment.api.core.defaultBase;
    const path = environment.api.report.updateReportTask.endpoint;
    me.controller.post(path, payload).subscribe((data) => {
      output.next(new UpdateReportTaskLoadedState(data));
      output.complete();
    }, (e: any) => {

      output.error(new UpdateReportTaskLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

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
  

}

