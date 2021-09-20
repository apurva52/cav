import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { RevenueAnalyticsFilter } from './revenue-analytics.model';
import { RevenueAnalyticsLoadingState, RevenueAnalyticsLoadedState, RevenueAnalyticsErrorState } from './revenue-analytics.state';

@Injectable({
  providedIn: 'root'
})
export class RevenueAnalyticsService  extends Store.AbstractService {

  constructor() { 
    super();
  }

  LoadRevenueAnalyticsData(filter: RevenueAnalyticsFilter, type: string) : Observable<Store.State> {
    let path = environment.api.netvision.revenueanalytics.endpoint;
    let base = environment.api.netvision.base.base;
    let access_token = "563e412ab7f5a282c15ae5de1732bfd1";

    path = `${path}?filterCriteria=${JSON.stringify(filter)}&chkflag=${type}&access_token=${access_token}`;

    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new RevenueAnalyticsLoadingState());
    }, 0);

    this.controller.get(path, null, base).subscribe((data: any) => {
      output.next(new RevenueAnalyticsLoadedState(data));
      output.complete();
    }, (error: any) => {
      output.error(new RevenueAnalyticsErrorState(error));
      output.complete();
    });

    return output;
  }


}
