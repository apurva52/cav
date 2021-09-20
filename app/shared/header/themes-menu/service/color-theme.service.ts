import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  ThemeLoadingErrorState,
  ThemeLoadedState,
  ThemeLoadingState,
} from './color-theme.state';
import { Theme } from './color-theme.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ThemeService extends Store.AbstractService {
  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ThemeLoadingState());
    }, 0);


    const path = environment.api.themes.load.endpoint;

    me.controller.get(path).subscribe(
      (data: Theme[]) => {
        output.next(new ThemeLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new ThemeLoadingErrorState(e));
        output.complete();

        me.logger.error('Themes loading failed', e);
      }
    );

    return output;
  }
}
