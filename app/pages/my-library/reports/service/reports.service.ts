import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { SchedulerEnableLoadingState, SchedulerEnableLoadedState, SchedulerEnableLoadingErrorState} from './reports.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends Store.AbstractService{
  constructor() { 
    super();
  }
  successReportGeneration: boolean = false;
  reportType: string = null;
  reportName: string = null;
  trendEnable: boolean = false;
  fromReportUI: boolean = false;
  getIsSchedulerEnable() : Observable<Store.State>{ 
   const me = this;
      const output = new Subject<Store.State>();
      setTimeout(() => {
        output.next(new SchedulerEnableLoadingState()); 
      }, 0);
      const path = environment.api.report.enableScheduler.endpoint;
      const base = environment.api.core.defaultBase;
      const payload =null;
      me.controller.post(path, payload).subscribe(
        (data) => {
          output.next(new SchedulerEnableLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new SchedulerEnableLoadingErrorState(e));
          output.complete();
          me.logger.error('loading failed', e);
        }
      );
      return output;
    }
} 
