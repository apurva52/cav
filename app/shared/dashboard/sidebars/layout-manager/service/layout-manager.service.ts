import { Injectable } from '@angular/core';
import { DashboardLayoutLoadingState, DashboardLayoutLoadedState, DashboardLayoutLoadingErrorState, DashboardLayoutSavedState, DashboardLayoutSavingErrorState, DashboardLayoutSavingState, DashboardLayoutDummyLoadingState, DashboardLayoutDummyLoadedState, DashboardLayoutDeletingState, DashboardLayoutDeletedState, DashboardLayoutDeletingErrorState, DashboardLayoutCheckedState, DashboardLayoutCheckingState, DashboardLayoutCheckingErrorState } from './layout-manager.state';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { DASHBOARD_LAYOUTS } from './layout-manager.dummy';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardLayoutRequest, DashboardLayoutRequestDTO, GET_ALL_LAYOUT } from './layout-manager.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardLayoutManagerService extends Store.AbstractService {

  constructor(private sessionService: SessionService){
    super();
  }
  
  load(data : DashboardLayoutRequest): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    const session = me.sessionService.session;
    if (session) {
     
      data.cctx =   this.sessionService.session.cctx; 
      data.tr = me.sessionService.testRun.id;
    setTimeout(() => {
      output.next(new DashboardLayoutLoadingState());
    }, 0);

    const path = environment.api.dashboardLayout.load.endpoint;
    /// DEV CODE ----------------->

    me.controller.post(path, data).subscribe(
      (result : any) => {       
        output.next(new DashboardLayoutLoadedState(result));
        output.complete();
      },
      (e: any) => {
        output.error(new DashboardLayoutLoadingErrorState(e));
        output.complete();

        me.logger.error('Dashboard loading failed', e);
      }
      );
      return output;

  
  }
}

  deleteLayout(data : DashboardLayoutRequest){
    const me = this;
    const output = new Subject<Store.State>();
    const session = me.sessionService.session;
    if (session) {
     
      data.cctx =   this.sessionService.session.cctx; 
      data.tr = me.sessionService.testRun.id;
    setTimeout(() => {
      output.next(new DashboardLayoutDeletingState());
    }, 0);

    const path = environment.api.dashboardLayout.operations.endpoint;
    /// DEV CODE ----------------->

    me.controller.post(path, data).subscribe(
      (result : any) => {       
        output.next(new DashboardLayoutDeletedState(result));
        output.complete();
      },
      (e: any) => {
        output.error(new DashboardLayoutDeletingErrorState(e));
        output.complete();

        me.logger.error('Dashboard loading failed', e);
      }
      );
      return output;

  
    }
  }

    /* this api is used to getAllCustom layout list */
  listOfLayouts(): Observable<Store.State>{
      const me = this;
      const output = new Subject<Store.State>();
      const session = me.sessionService.session;
      if (session) {
       const data:  DashboardLayoutRequestDTO = {
        opType :GET_ALL_LAYOUT,
        cctx : me.sessionService.session.cctx,
        tr:  me.sessionService.testRun.id,
        layoutCtx: {},
        multiDc : false
       }
        //data.cctx =   this.sessionService.session.cctx; 
      setTimeout(() => {
        output.next(new DashboardLayoutLoadingState());
      }, 0);
  
      const path = environment.api.dashboardLayout.list.endpoint;
  
      me.controller.post(path, data).subscribe(
        (data) => {       
          output.next(new DashboardLayoutLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new DashboardLayoutLoadingErrorState(e));
          output.complete();
  
          me.logger.error('Dashboard loading failed', e);
        }
        );
        return output;
      }
    }

    loadDummy(): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();
  
      setTimeout(() => {
        output.next(new DashboardLayoutDummyLoadingState());
      }, 0);
  
      /// DEV CODE ----------------->
  
      setTimeout(() => {
        output.next(new DashboardLayoutDummyLoadedState(DASHBOARD_LAYOUTS));
      }, 2000);
  
      /// <----------------- DEV CODE
  
      // const path = environment.api.dashboardLayout.load.endpoint;
  
      // me.controller.get(path).subscribe((data: DashboardLayout[]) => {
  
      //   output.next(new DashboardLayoutLoadedState(data));
      //   output.complete();
  
      // }, (e: any) => {
  
      //   output.error(new DashboardLayoutLoadingErrorState(e));
      //   output.complete();
  
      //   me.logger.error('Dashboard layout loading failed', e);
      // });
  
      return output;
    }

    saveLayout(data : DashboardLayoutRequest): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();
      const session = me.sessionService.session;
      if (session) {
       
        data.cctx =   this.sessionService.session.cctx; 
        data.tr = me.sessionService.testRun.id;
      setTimeout(() => {
        output.next(new DashboardLayoutSavingState());
      }, 0);
  
      const path = environment.api.dashboardLayout.operations.endpoint;
      /// DEV CODE ----------------->
  
      me.controller.post(path, data).subscribe(
        (result : any) => {       
          output.next(new DashboardLayoutSavedState(result));
          output.complete();
        },
        (e: any) => {
          output.error(new DashboardLayoutSavingErrorState(e));
          output.complete();
  
          me.logger.error('Dashboard loading failed', e);
        }
        );
        return output;
  
    
    }
  }

  chkLayout(data : DashboardLayoutRequest): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    const session = me.sessionService.session;
    if (session) {
     
      data.cctx =   this.sessionService.session.cctx; 
      data.tr = me.sessionService.testRun.id;
    setTimeout(() => {
      output.next(new DashboardLayoutCheckingState());
    }, 0);

    const path = environment.api.dashboardLayout.avail.endpoint;
    /// DEV CODE ----------------->

    me.controller.post(path, data).subscribe(
      (result : any) => {       
        output.next(new DashboardLayoutCheckedState(result));
        output.complete();
      },
      (e: any) => {
        output.error(new DashboardLayoutCheckingErrorState(e));
        output.complete();

        me.logger.error('Dashboard loading failed', e);
      }
      );
      return output;
    }
  }
}
