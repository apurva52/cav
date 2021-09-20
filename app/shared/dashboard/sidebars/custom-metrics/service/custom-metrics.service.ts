import { Injectable } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';


// import {hierarchialDataCreatedState, hierarchialDataCreatingState } from './derived-metric.state'
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { DeleteDerivedPayload, GraphListPayload, GroupListPayload, hierarchicalPayload, TreeNodeMenu, ViewDerivedExpPayload } from './custom-metrics.model';
import { deleteDerivedCreatedState, deleteDerivedCreatingState, derivedGraphCreatedState, derivedGraphCreatingState, derivedGroupCreatedState, derivedGroupCreatingState, derivedMenuLoadedState, derivedMenuLoadingErrorState, derivedMenuLoadingState, hierarchialDataCreatedState, hierarchialDataCreatingState, viewDerivedExpCreatedState, viewDerivedExpCreatingState } from './custom-metrics.state';
import { environment } from 'src/environments/environment';
import { TreeWidgetMenuLoadedState, TreeWidgetMenuLoadingErrorState, TreeWidgetMenuLoadingState } from '../../show-graph-in-tree/service/graph-in-tree.state';

@Injectable({
  providedIn: 'root'
})
export class CustomMetricsService extends Store.AbstractService {
  cacheData: TreeNodeMenu[];
  constructor() {
    super();
  }

  viewDerivedExp(payload: ViewDerivedExpPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new viewDerivedExpCreatingState());
    }, 0);

    let path = '/web/dashboard/getDerivedExp';


    const subscription = this.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new viewDerivedExpCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );
    return output;
  }

  deleteDerived(payload: DeleteDerivedPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new deleteDerivedCreatingState());
    }, 0);

    let path = '/web/dashboard/deleteDerived';


    const subscription = this.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new deleteDerivedCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );
    return output;
  }

  loadHierarcialData(payload: hierarchicalPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new hierarchialDataCreatingState());
    }, 0);

    let path = '/web/dashboard/generateDerivedSubjectList';


    const subscription = this.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new hierarchialDataCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );
    return output;
  }

  load(payload: GroupListPayload): Observable<Store.State> {
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

      }
    );


    return output;
  }

  loadGraphData(payload: GraphListPayload): Observable<Store.State> {
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
  loadDeriveMenu(deriveMenuPayload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new derivedMenuLoadingState());
    }, 0);

    const path = environment.api.dashboard.deriveMenu.endpoint;

    me.controller.post(path, deriveMenuPayload).subscribe(
      (data) => {
        output.next(new derivedMenuLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new derivedMenuLoadingErrorState(e));
        output.complete();

        me.logger.error('Derived Drilldown Submenu loading failed', e);
      }
    );

    return output;

  }

}
