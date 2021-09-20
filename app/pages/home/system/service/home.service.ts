import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { HomeStateLoadedStatus, HomeStateLoadingErrorStatus, HomeStateLoadingStatus } from './home.state';
@Injectable({
    providedIn: 'root'
  })

export class HomeService extends Store.AbstractService {
    constructor(private sessionService: SessionService) {
        super();
      }

    setUserSequence(payload:any){

        const me = this;
        const output = new Subject<Store.State>();
    
        setTimeout(() => {
          output.next(new HomeStateLoadingStatus());
        }, 0);
        const session = me.sessionService.session;

        if (session) {
            const path = environment.api.dashboard.setUserSequence.endpoint;
            me.controller.post(path, payload).subscribe(
                (result: any) => {
                  if (result) {
                    output.next(new HomeStateLoadedStatus(result));
                    output.complete();
                    me.logger.error('Dashboard loading failed', result);
                    return;
                  }
                },
                (e: any) => {
                  output.error(new HomeStateLoadingErrorStatus(e));
                  output.complete();
      
                  me.logger.error('Dashboard is not saved successfully', e);
                }
              );
            return output;
        }
    }
}