import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { FlowMapsData } from './flowmaps-management.model';
import { FlowMapsDataLoadingState, FlowMapsDataLoadedState, FlowMapsDataLoadingErrorState } from './flowmaps-management.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FlowmapsManagementService extends Store.AbstractService {

  load(qParam: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FlowMapsDataLoadingState());
    }, 0);

    const path = environment.api.e2e.onlineFlowmap.endpoint;
    const payload = {
      flowMapDir: qParam.flowMapDir,
      dc: qParam.dc,
      user: qParam.user,
    };
    me.controller.post(path, payload).subscribe(
      (data: FlowMapsData) => {
        output.next(new FlowMapsDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new FlowMapsDataLoadingErrorState(e));
        output.complete();

        me.logger.error('Flow Map Data loading failed', e);
      }
    );
    return output;
  }

  save(qParam: any): Observable<boolean> {
    const me = this;
    const output = new Subject<boolean>();

    const path = environment.api.e2e.manageFlowmap.endpoint;
    const payload = {
      flowMapDir: qParam.flowMapDir,
      dc: qParam.dc,
      user: qParam.user,
      defaultFM: qParam.defaultFM,
      systemDefaultFM: qParam.systemDefaultFM,
      sharedFlowmap: qParam.sharedFlowmap,
    };
    me.controller.post(path, payload).subscribe(
      (data: boolean) => {
        output.next(data);
        output.complete();
      },
      (e: any) => {
        output.error(e);
        output.complete();
        me.logger.error('Error in manageFlowmap', e);
      }
    );
    return output;
  }

  delete(qParam: any): Observable<boolean> {
    const me = this;
    const output = new Subject<boolean>();

    const path = environment.api.e2e.deleteFlowmap.endpoint;
    const payload = {
      flowMapDir: qParam.flowMapDir,
      dc: qParam.dc,
      user: qParam.user,
      deleteFlowmap: qParam.deleteFlowmap,
    };
    me.controller.post(path, payload).subscribe(
      (data: boolean) => {
        output.next(data);
        output.complete();
      },
      (e: any) => {
        output.error(e);
        output.complete();
        me.logger.error('Error in deleteFlowmap ', e);
      }
    );
    return output;
  }

}

