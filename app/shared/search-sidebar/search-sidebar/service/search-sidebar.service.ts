import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {  SEARCH_SIDEBAR_DATA } from './search-sidebar.dummy';
import { SearchSidebarLoadPayload } from './search-sidebar.model';
import { SearchSidebarLoadedState, SearchSidebarLoadingState } from './search-sidebar.state';

@Injectable({
  providedIn: 'root'
})

  export class SearchSidebarService extends Store.AbstractService {
 
    load(payload: SearchSidebarLoadPayload): Observable<Store.State> {
      const me = this;
      const output = new Subject<Store.State>();
  
      setTimeout(() => {
        output.next(new SearchSidebarLoadingState());
      }, 0);
  
      /// DEV CODE ----------------->
  
      setTimeout(() => {
        output.next(new SearchSidebarLoadedState(SEARCH_SIDEBAR_DATA));
        output.complete();
      }, 2000);
      
      // setTimeout(() => {
      //   output.error(new SearchSidebarLoadingErrorState(new Error()));
      // }, 2000);
  
      /// <----------------- DEV CODE
  
      // const path = environment.api.URL.load.endpoint;
      // const payload = {
      //   duration
      // };
      // me.controller.post(path, payload).subscribe(
      //   (data: SearchSidebar) => {
      //     output.next(new SearchSidebarLoadedState(data));
      //     output.complete();
      //   },
      //   (e: any) => {
      //     output.error(new SearchSidebarLoadingErrorState(e));
      //     output.complete();
  
      //     me.logger.error('Flow Map Data loading failed', e);
      //   }
      // );
  
      return output;
    }
    
  }
  
