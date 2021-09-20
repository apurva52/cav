import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { MarketingAnalyticsOverviewFilter} from './marketing-analytics.model';
import { MarketAnalyticsErrorState, MarketAnalyticsLoadedState, MarketAnalyticsLoadingState } from './marketing-analytics.state';

@Injectable({
  providedIn: 'root'
})
export class MarketingAnalyticsService  extends Store.AbstractService {

  constructor() { 
    super();
  }

  LoadOverviewData(filter: MarketingAnalyticsOverviewFilter) : Observable<Store.State> {
    let path = environment.api.netvision.maoverview.endpoint;
    let base = environment.api.netvision.base.base;
    let access_token = "563e412ab7f5a282c15ae5de1732bfd1";

    path = `${path}?filterCriteria=${JSON.stringify(filter)}&access_token=${access_token}`;

    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new MarketAnalyticsLoadingState());
    }, 0);

    this.controller.get(path, null, base).subscribe((data: any) => {
      output.next(new MarketAnalyticsLoadedState(data));
      output.complete();
    }, (error: any) => {
      output.error(new MarketAnalyticsErrorState(error));
      output.complete();
    });

    return output;
  }

  LoadDetailCampaignData(filter: MarketingAnalyticsOverviewFilter) : Observable<Store.State> {
    let path = environment.api.netvision.macampaigndata.endpoint;
    let base = environment.api.netvision.base.base;
    let access_token = "563e412ab7f5a282c15ae5de1732bfd1";

    path = `${path}?filterCriteria=${JSON.stringify(filter)}&access_token=${access_token}`;

    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new MarketAnalyticsLoadingState());
    }, 0);

    this.controller.get(path, null, base).subscribe((data: any) => {
      output.next(new MarketAnalyticsLoadedState(data));
      output.complete();
    }, (error: any) => {
      output.error(new MarketAnalyticsErrorState(error));
      output.complete();
    });

    return output;
  }

  LoadDetailCampaignGraphData(filter: MarketingAnalyticsOverviewFilter) : Observable<Store.State> {
    let path = environment.api.netvision.macampaigngraph.endpoint;
    let base = environment.api.netvision.base.base;
    let access_token = "563e412ab7f5a282c15ae5de1732bfd1";

    path = `${path}?filterCriteria=${JSON.stringify(filter)}&access_token=${access_token}`;

    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new MarketAnalyticsLoadingState());
    }, 0);

    this.controller.get(path, null, base).subscribe((data: any) => {
      output.next(new MarketAnalyticsLoadedState(data));
      output.complete();
    }, (error: any) => {
      output.error(new MarketAnalyticsErrorState(error));
      output.complete();
    });

    return output;
  }


}
