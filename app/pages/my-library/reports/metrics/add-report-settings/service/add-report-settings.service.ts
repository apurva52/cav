import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
// import { RulePayload } from 'src/app/pages/my-library/alert/alert-rules/alert-configuration/service/alert-config.model';
import { environment } from 'src/environments/environment';
import { DefaultPercentileLoadedState, DefaultPercentileLoadingErrorState, DefaultPercentileLoadingState, ReportGraphLoadedState, ReportGraphLoadingErrorState, ReportGraphLoadingState, ReportGroupLoadedState, ReportGroupLoadingErrorState, ReportGroupLoadingState, ReportPresetLoadedState, ReportPresetLoadingErrorState, ReportPresetLoadingState } from './add-report-settings.state';

@Injectable({
  providedIn: 'root'
})
export class AddReportSettingsService extends Store.AbstractService {
  displayAlert = false;
  alertMessage = '';
  displayAlertType = 'Alert';
  reportSetData: any[];
  previousNameInUpdateRptSet: any;
  selRptSetOnUpdate: any[];
  getDefaultPctValues:any;
  loadGroupData(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new ReportGroupLoadingState());
    }, 0);
    const path = environment.api.report.group.endpoint;
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        output.next(new ReportGroupLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new ReportGroupLoadingErrorState(e));
        output.complete();

        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }

  loadGraphData(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new ReportGraphLoadingState());
    }, 0);

    const path = environment.api.report.graph.endpoint;
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        output.next(new ReportGraphLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new ReportGraphLoadingErrorState(e));
        output.complete();
      }
    );
    return output;
  }

  getDefaultPercentileValues(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new DefaultPercentileLoadingState());
    }, 0);

    const path = environment.api.configSettings.load.endpoint;
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        this.getDefaultPctValues=data;
        output.next(new DefaultPercentileLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new DefaultPercentileLoadingErrorState(e));
        output.complete();
      }
    );
    return output;
  }
  presetTimeCall(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new ReportPresetLoadingState());
    }, 0);
    const path = environment.api.globalTimebar.time.endpoint;

    me.controller.get(path, payload).subscribe(
      (data: any) => {
        output.next(new ReportPresetLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new ReportPresetLoadingErrorState(e));
        output.complete();

        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }
}

