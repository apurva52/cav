import { Injectable } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { gitConfigCreatedState, gitConfigCreatingErrorState, gitConfigCreatingState } from './gitconfig.state';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';

@Injectable({
  providedIn: 'root'
})
export class GitConfigService extends Store.AbstractService {

  constructor() {
    super();
  }

  testGitConfig(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new gitConfigCreatingState());
    }, 0);
    let path = '/web/adminUI/getGitConfiguration';
    const subscription = me.controller.post(path).subscribe(
      (data) => {
        output.next(new gitConfigCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new gitConfigCreatingErrorState(error));
        output.complete();
      }
    );
    return output;
  }

  authorizeGitConfig(params): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new gitConfigCreatingState());
    }, 0);
    let path = '/web/adminUI/versionControl/TEST';
    const subscription = me.controller.post(path, params).subscribe(
      (data) => {
        output.next(new gitConfigCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new gitConfigCreatingErrorState(error));
        output.complete();
      }
    );
    return output;
  }

  setGitConfig(params: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new gitConfigCreatingState());
    }, 0);
    let path = '/web/adminUI/setGitConfiguration';
    const subscription = me.controller.post(path, params).subscribe(
      (data) => {
        output.next(new gitConfigCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new gitConfigCreatingErrorState(error));
        output.complete();
      }
    );
    return output;
  }
}