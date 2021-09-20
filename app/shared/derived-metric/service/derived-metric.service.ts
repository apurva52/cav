import { Injectable } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { getGroupListPayload, getGraphPayload, DerivedRequestPayLoad } from './derived-metric.model';
import { derivedGraphCreatedState, derivedGraphCreatingState, derivedGraphCreatingErrorState, derivedGroupCreatedState, derivedGroupCreatingErrorState, derivedGroupCreatingState, derivedResCreatingState, derivedResCreatedState } from './derived-metric.state';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';

@Injectable({
  providedIn: 'root'
})
export class DerivedMetricService extends Store.AbstractService {

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

  load(payload: getGroupListPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new derivedGroupCreatingState());
    }, 0);

    let path = '/web/metrictree/group';
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new derivedGroupCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );

    return output;
  }

  loadGraphData(payload: getGraphPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new derivedGraphCreatingState());
    }, 0);

    let path = '/web/metrictree/graph';


    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new derivedGraphCreatedState(data));
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
