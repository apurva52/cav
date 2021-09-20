import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { EndToEndTierData } from './end-to-end-tier.model';
import { environment } from 'src/environments/environment';
import { EndToEndTierLoadedState, EndToEndTierLoadingErrorState } from './end-to-end-tier.state';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
  providedIn: 'root'
})

  export class EndToEndTierService extends Store.AbstractService {
 
    constructor(private sessionService: SessionService) {
      super();
    }
    load(nodeName : string, duration): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();
      const path = environment.api.e2e.tierInfo.endpoint;
      const payload = {
        duration: duration,
        dataFilter: [0,1,2,3,4,5],
        cctx: me.sessionService.session.cctx,
        opType: 11,
        tr: me.sessionService.session.testRun.id,
        tierName : nodeName
      };
      me.controller.post(path, payload).subscribe(
        (data: EndToEndTierData) => {
          output.next(new EndToEndTierLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new EndToEndTierLoadingErrorState(e));
          output.complete();
  
          me.logger.error('TierInfo Data loading failed', e);
        }
      );
  
      return output;
    }
    
  }
  
