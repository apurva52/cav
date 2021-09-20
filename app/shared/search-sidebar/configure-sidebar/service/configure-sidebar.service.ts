import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { CONFIGURE_SIDEBAR_DATA } from './configure-sidebar.dummy';
import { ConfigureSidebarData, ConfigureSidebarLoadPayload } from './configure-sidebar.model';
import { ConfigureSidebarLoadedState, ConfigureSidebarLoadingErrorState, ConfigureSidebarLoadingState } from './configure-sidebar.state';

@Injectable({
  providedIn: 'root'
})

  export class ConfigureSidebarService extends Store.AbstractService {
 
    load(payload: ConfigureSidebarLoadPayload): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();
  
      setTimeout(() => {
        output.next(new ConfigureSidebarLoadingState());
      }, 0);
  
      /// DEV CODE ----------------->
  
      // setTimeout(() => {
      //   output.next(new ConfigureSidebarLoadedState(CONFIGURE_SIDEBAR_DATA));
      //   output.complete();
      // }, 2000);
      
      // setTimeout(() => {
      //   output.error(new ConfigureSidebarLoadingErrorState(new Error()));
      // }, 2000);
  
      /// <----------------- DEV CODE
  
      const path = environment.api.geoLocation.configure.endpoint;
      // const payload = {
      //   duration
      // };
      me.controller.post(path, payload).subscribe(
        (data: ConfigureSidebarData) => {
          console.log("ConfigureSidebarData", data);
          output.next(new ConfigureSidebarLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ConfigureSidebarLoadingErrorState(e));
          output.complete();

          me.logger.error('Flow Map Data loading failed', e);
        }
      );

      return output;
    }

    saveApplications(payload: ConfigureSidebarLoadPayload): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new ConfigureSidebarLoadingState());
      }, 0);

      const path = environment.api.geoLocation.saveApps.endpoint;

      me.controller.post(path, payload).subscribe(
        (data: ConfigureSidebarData) => {
          console.log("ConfigureSidebarData", data);
          output.next(new ConfigureSidebarLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ConfigureSidebarLoadingErrorState(e));
          output.complete();
  
          me.logger.error('Flow Map Data loading failed', e);
        }
      );
  
      return output;
    }
    
  }
  
