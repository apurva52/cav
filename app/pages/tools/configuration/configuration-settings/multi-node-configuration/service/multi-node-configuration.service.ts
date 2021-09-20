import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { MultiNodeConfigurationErrorState, MultiNodeConfigurationLoadedState } from './multi-node-configuration.state';


@Injectable({
  providedIn: 'root',
})

export class MultiNodeService extends Store.AbstractService{

  constructor(private sessionService: SessionService) {
    super();
  }

  loadConfiguration(payload): Observable<Store.State>{

    const me = this;
    const output = new Subject<Store.State>();

    let path = environment.api.nodeConfig.load.endpoint;
    const subscription = me.controller.get(path, payload).subscribe(
      (data) => {

              output.next(new MultiNodeConfigurationLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new MultiNodeConfigurationErrorState(error));
            output.complete();
          }
        );

    return output;
  }
  saveConfiguration(payload): Observable<Store.State>{

    const me = this;
    const output = new Subject<Store.State>();

    let path = environment.api.saveNodeConfig.load.endpoint + "?u=" + this.sessionService.session.cctx.u + "&pk=" +  this.sessionService.session.cctx.pk;
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

              output.next(new MultiNodeConfigurationLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new MultiNodeConfigurationErrorState(error));
            output.complete();
          }
        );

    return output;
  }

  applyConfiguration(payload): Observable<Store.State>{

    const me = this;
    const output = new Subject<Store.State>();

    let path = environment.api.applyNodeConfig.load.endpoint + "?u=" + this.sessionService.session.cctx.u + "&pk=" +  this.sessionService.session.cctx.pk;
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

              output.next(new MultiNodeConfigurationLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new MultiNodeConfigurationErrorState(error));
            output.complete();
          }
        );

    return output;
  }
}
