
import { Injectable } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';

// import {hierarchialDataCreatedState, hierarchialDataCreatingState } from './derived-metric.state'
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';

import { derivedResCreatedState, derivedResCreatingState } from './aggregate-virtual-metric.state';
import { DerivedRequestPayLoad } from './aggregated-virtual-metric.model';

@Injectable({
  providedIn: 'root'
})
export class AggregateVirualMetricService extends Store.AbstractService {

  constructor() {
    super();
  }




  loadDerivedRes(payload: DerivedRequestPayLoad): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new derivedResCreatingState());
    }, 0);

    let path = '/web/dashboard/generateDerivedGraph';
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new derivedResCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );


    return output;
  }

}
