import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { COMPARE_FLOW_PATH_DATA } from './compare-flowpaths.dummy';
import { CompareFlowPathData } from './compare-flowpaths.model';
import { CompareFlowPathLoadedState, CompareFlowPathLoadingErrorState, CompareFlowPathLoadingState } from './compare-flowpaths.state';

@Injectable({
  providedIn: 'root'
})

export class CompareFlowpathsService extends Store.AbstractService {
  compareFlowpathPayload: any;
  flowpathIds:any;
  
  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute
    ) {
    super();
  }

  load(): Observable<Store.State> {
    const me = this;
        this.route.queryParams.subscribe((params) => {
      this.flowpathIds = params['rowID'];
    });
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new CompareFlowPathLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new CompareFlowPathLoadedState(COMPARE_FLOW_PATH_DATA));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new CompareFlowPathLoadingErrorState(new Error()));
    // }, 2000);

    // / <----------------- DEV CODE

    const path = environment.api.compareflowpath.load.endpoint;
    me.compareFlowpathPayload = this.sessionService.getSetting("compareflowpathpayload");
  
    me.compareFlowpathPayload.flowpathID = this.flowpathIds;
    console.log("me.compareFlowpathPayload************",me.compareFlowpathPayload);
    const payload = me.compareFlowpathPayload;
    me.controller.post(path, payload).subscribe(
      (data: CompareFlowPathData) => {
        output.next(new CompareFlowPathLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new CompareFlowPathLoadingErrorState(e));
        output.complete();

        me.logger.error('Flow Path Data loading failed', e);
      }
    );

    return output;
  }
}

