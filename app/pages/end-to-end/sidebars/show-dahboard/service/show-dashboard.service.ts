import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { SHOW_DASHBOARD_DATA } from './show-dashboard.dummy';
import { EndToEndShowDashboardLoadingState, EndToEndShowDashboardLoadedState, EndToEndShowDashboardLoadingErrorState} from './show-dashboard.state';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { ShowDashboard } from './show-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ShowDashboardService extends Store.AbstractService {
  constructor(private sessionService: SessionService) {
    super();
  }

  load(tierName, duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    const path = environment.api.e2e.showDashboard.endpoint;
    const payload = {
      duration: duration,
      dataFilter: [0,1,2,3,4,5],
      cctx: me.sessionService.session.cctx,
      opType: 11,
      tr: me.sessionService.session.testRun.id,
      tierName: tierName,
    };

    me.controller.post(path, payload).subscribe(
      (data: ShowDashboard) => {
        output.next(new EndToEndShowDashboardLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new EndToEndShowDashboardLoadingErrorState(e));
        output.complete();

        me.logger.error('End-To-End Data loading failed', e);
      }
    );

    return output;
  }

}

