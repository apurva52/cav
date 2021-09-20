import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  EventGroupLoadingState,
  EventGroupLoadedState,
  EventGroupLoadingErrorState,
} from './event.state';
import { EventGroup, EventResponse } from './event.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService extends Store.AbstractService {

  load(tr: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new EventGroupLoadingState());
    }, 0);

    const path = environment.api.events.load.endpoint;
    const payload = {
      tr
    };

    me.controller.get(path, payload).subscribe(
      (data: EventResponse) => {
        output.next(new EventGroupLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new EventGroupLoadingErrorState(e));
        output.complete();

        me.logger.error('Events loading failed', e);
      }
    );

    return output;
  }
}
