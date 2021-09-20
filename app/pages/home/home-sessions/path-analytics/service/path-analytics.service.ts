import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
//import { PathAnalyticsFilter } from './path-analytics.model';
import { PathAnalyticsLoadingState, PathAnalyticsLoadedState, PathAnalyticsErrorState } from './path-analytics.state';

@Injectable({
  providedIn: 'root'
})

export class PathAnalyticsService  extends Store.AbstractService {

  constructor() { 
    super();
  }

/*  LoadPathAnalyticsData(filter: PathAnalyticsFilter, type: string) : Observable<Store.State> {
    let path = environment.api.netvision.pathanalytics.endpoint;
    let base = environment.api.netvision.base.base;
    let access_token = "563e412ab7f5a282c15ae5de1732bfd1";

    path = `${path}?filterCriteria=${JSON.stringify(filter)}&chkflag=${type}&access_token=${access_token}`;

    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new PathAnalyticsLoadingState());
    }, 0);

    this.controller.get(path, null, base).subscribe((data: any) => {
      output.next(new PathAnalyticsLoadedState(data));
      output.complete();
    }, (error: any) => {
      output.error(new PathAnalyticsErrorState(error));
      output.complete();
    });

    return output;
  }*/


}
