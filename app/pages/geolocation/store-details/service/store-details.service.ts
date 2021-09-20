import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { STORE_DATA } from './store-details.dummy';
import { StoreDataPayload, StoreDetailsData } from './store-details.model';
import { StoreDataLoadingState, StoreDataLoadedState, StoreDataLoadingErrorState } from './store.details.state';
import { PayLoadData } from '../../service/geolocation.model';
import { TimebarService } from '../../../../shared/time-bar/service/time-bar.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StoreDetailsService extends Store.AbstractService {
   
  payLoadData: PayLoadData;

  constructor(private sessionService: SessionService, private timebarService: TimebarService) {
    super();
    this.payLoadData = new PayLoadData();
  }
  
  load(selectedAppName, selectedStoreName, duration): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new StoreDataLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new StoreDataLoadedState(STORE_DATA));
    //   output.complete();
    // }, 2000);
    
    // setTimeout(() => {
    //   output.error(new StoreDataLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.geoLocation.list.endpoint;
    const payload ={
      // localDataCtx: me.payLoadData.localDataCtx,
      cctx:me.sessionService.session.cctx,
      dataFilter: me.payLoadData.dataFilter,
      duration: duration,
    dc: me.payLoadData.dc,
    appName: selectedAppName,
    isAll: me.payLoadData.isAll,
    multiDc: me.payLoadData.multiDc,
    opType: me.payLoadData.opType,
    storeAlertType: me.payLoadData.storeAlertType,
    storeName: selectedStoreName, 
    tr: me.sessionService.testRun.id
  }
    me.controller.post(path, payload).subscribe(
      (data: StoreDetailsData) => {
        output.next(new StoreDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new StoreDataLoadingErrorState(e));
        output.complete();

        me.logger.error('Store Data loading failed', e);
      }
    );

    return output;
  }
  
}

