import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { RuleDataLoadingState,RuleDataLoadedState,RuleDataLoadingErrorState, GroupLoadingState, GroupLoadedState, GroupLoadingErrorState, GraphLoadedState, GraphLoadingErrorState} from './alert-config.state';
import { environment } from 'src/environments/environment';
import { RulePayload } from './alert-config.model';

@Injectable({
  providedIn: 'root',
})
export class AlertConfigService extends Store.AbstractService {
  constructor() {
    super();
  }

  load(payload: RulePayload, updateRleMode: boolean): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new RuleDataLoadingState());
    }, 0);

    /// DEV CODE ----------------->
    /* setTimeout(() => {
      output.next(new RuleDataLoadedState(RULE_DATA));
      output.complete();
    }, 2000); */
    let path: any;
    if (updateRleMode)
      path = environment.api.alert.rule.update.endpoint;
    else
      path = environment.api.alert.rule.add.endpoint;
      
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        output.next(new RuleDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new RuleDataLoadingErrorState(e));
        output.complete();

        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }

  loadGroupData(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new GroupLoadingState());
    }, 0);

    const path = environment.api.alert.rule.group.endpoint;
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        output.next(new GroupLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new GroupLoadingErrorState(e));
        output.complete();

        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }

  loadGraphData(payload: RulePayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new GroupLoadingState());
    }, 0);

    const path = environment.api.alert.rule.graph.endpoint;
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        output.next(new GraphLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new GraphLoadingErrorState(e));
        output.complete();
      }
    );
    return output;
  }

  sortByField(items: any, fieldToSort: string) {
    items.sort(function (a, b) {
      return a[fieldToSort].localeCompare(b[fieldToSort]);
    });
  }
}

