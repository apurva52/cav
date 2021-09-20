import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { SelectItem } from 'primeng';
import { ReportTypeLoadedState, ViewTypeLoadedState, WidgetInfoLoadedState } from './reports-data.state';

@Injectable({
  providedIn: 'root'
})
export class ReportsDataService extends Store.AbstractService {
  // Action: Load

  loadReportData(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const reportTypedata: SelectItem[] = [
      { label: 'Performance Stats', value: 'Performance_Stats' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new ReportTypeLoadedState(reportTypedata));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadViewTypeData(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const viewTypeValue: SelectItem[] = [
      {
        label: 'Tabular',
        value: 'tabular',
      },
      {
        label: 'Word',
        value: 'Word'
      },
      {
        label: 'HTML',
        value: 'html'
      },
      {
        label: 'PDF',
        value: 'pdf'
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new ViewTypeLoadedState(viewTypeValue));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadWidgetInfo(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const widgetInfo: SelectItem[] = [
      {
        label: 'Selected Widget',
        value: 'Selected_Widget',
      },
      {
        label: 'All Widget',
        value: 'All_Widget'
      }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new WidgetInfoLoadedState(widgetInfo));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }
}
