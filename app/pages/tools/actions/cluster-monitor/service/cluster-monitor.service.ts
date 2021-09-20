import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { ClusterMonitorLoadedState, ClusterMonitorLoadingErrorState, ClusterMonitorLoadingState, ClusterMonitorStateLoadedState, ClusterMonitorStateLoadingErrorState, ClusterMonitorStateLoadingState, ClusterMonitorStatsLoadedState, ClusterMonitorStatsLoadingErrorState, ClusterMonitorStatsLoadingState, IndicesStatsLoadedState, IndicesStatsLoadingErrorState, IndicesStatsLoadingState } from './cluster-monitor.state';

@Injectable({
  providedIn: 'root'
})
export class ClusterMonitorService extends Store.AbstractService{
  requestpayload:object
  constructor() { 
    super()
  }
clusterHealth():Observable<Store.State>{
  const output = new Subject<Store.State>();

  setTimeout(() => {
  output.next(new ClusterMonitorLoadingState());
  }, 0);
  this.requestpayload={"requestType":"cluster/health"}

  const msearch_url=environment.api.logs.msearch.endpoint
  this.controller.post(msearch_url,this.requestpayload).subscribe((data)=>{ 
    output.next(new ClusterMonitorLoadedState(data));
    output.complete();
    },
    (e: any) => {
    output.error(new ClusterMonitorLoadingErrorState(e));
    output.complete();
    this.logger.error('loading failed', e);
    });
    return output
}

ClusterState():Observable<Store.State>{
  const output = new Subject<Store.State>();

  setTimeout(() => {
  output.next(new ClusterMonitorStateLoadingState());
  }, 0);
  this.requestpayload={"requestType":"cluster/state"}

  const msearch_url=environment.api.logs.msearch.endpoint
  this.controller.post(msearch_url,this.requestpayload).subscribe((data)=>{ 
    output.next(new ClusterMonitorStateLoadedState(data));
    output.complete();
    },
    (e: any) => {
    output.error(new ClusterMonitorStateLoadingErrorState(e));
    output.complete();
    this.logger.error('loading failed', e);
    });
    return output

}


ClusterStats():Observable<Store.State>{
  const output = new Subject<Store.State>();

  setTimeout(() => {
  output.next(new ClusterMonitorStatsLoadingState());
  }, 0);
  this.requestpayload={"requestType":"_nodes/stats"}

  const msearch_url=environment.api.logs.msearch.endpoint
  this.controller.post(msearch_url,this.requestpayload).subscribe((data)=>{ 
    output.next(new ClusterMonitorStatsLoadedState(data));
    output.complete();
    },
    (e: any) => {
    output.error(new ClusterMonitorStatsLoadingErrorState(e));
    output.complete();
    this.logger.error('loading failed', e);
    });
    return output

}
IndicesStats():Observable<Store.State>{
  const output = new Subject<Store.State>();

  setTimeout(() => {
  output.next(new IndicesStatsLoadingState());
  }, 0);
  this.requestpayload={"requestType":"_stats"}

  const msearch_url=environment.api.logs.msearch.endpoint
  this.controller.post(msearch_url,this.requestpayload).subscribe((data)=>{ 
    output.next(new IndicesStatsLoadedState(data));
    output.complete();
    },
    (e: any) => {
    output.error(new IndicesStatsLoadingErrorState(e));
    output.complete();
    this.logger.error('loading failed', e);
    });
    return output

}

}
