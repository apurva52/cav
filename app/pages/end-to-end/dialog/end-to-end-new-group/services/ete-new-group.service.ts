import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { EndToEndNewGroupData } from './ete-new-group.model';
import {
  EndToEndNewGroupDataLoadingState,
  EndToEndNewGroupDataLoadedState,
  EndToEndNewGroupDataLoadingErrorState
} from './ete-new-group.state';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EteNewGroupService extends Store.AbstractService {
  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    const path = environment.api.e2e.groupList.endpoint;
    const payload = {
      flowMapDir : ".flowmaps",
      flowMapName : "FM10"
    };
    me.controller.post(path, payload).subscribe(
      (data: EndToEndNewGroupData) => {
        output.next(new EndToEndNewGroupDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new EndToEndNewGroupDataLoadingErrorState(e));
        output.complete();

        me.logger.error('End-To-End Group Data loading failed', e);
      }
    );
    return output;
  }

  group(tierName : string, selectedGroupName : string): Observable<boolean> {
    const me = this;
    const output = new Subject<boolean>();

    const path = environment.api.e2e.createGroup.endpoint;
    const payload = {
      flowMapDir : ".flowmaps",
      flowMapName : "FM10",
      tierName : tierName,
      selectedGroupName : selectedGroupName
    };
    me.controller.post(path, payload).subscribe(
      (data: boolean) => {
        output.next(data);
        output.complete();
      },
      (e: any) => {
        output.error(e);
        output.complete();
        me.logger.error('End-To-End Group Data loading failed', e);
      }
    );
    return output;
  }
}
