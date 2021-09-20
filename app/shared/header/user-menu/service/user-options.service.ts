import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  UserMenuOptionLoadingState,
  UserMenuOptionLoadedState,
  UserMenuOptionLoadingErrorState,
} from './user-options.state';
import { UserMenuOption } from './user-options.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OptionsService extends Store.AbstractService {
  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new UserMenuOptionLoadingState());
    }, 0);

    const path = environment.api.userOptions.load.endpoint;

    me.controller.get(path).subscribe(
      (data: UserMenuOption[]) => {
        output.next(new UserMenuOptionLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new UserMenuOptionLoadingErrorState(e));
        output.complete();

        me.logger.error('User Options loading failed', e);
      }
    );

    return output;
  }
}
