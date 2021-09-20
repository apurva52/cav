import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { SavedSearchLoadedState, SavedSearchLoadingErrorState } from './search.state';

@Injectable({
  providedIn: 'root'
})
export class SearchService extends Store.AbstractService{

  constructor() { 
    super()
  }

  getSavedSearch() {
    const output = new Subject<Store.State>();
    const getVis = environment.api.logs.msearch.endpoint;
    const payload = {
      requestType:'_search',
      type: 'logSearch'
    }
    this.controller.post(getVis, payload).subscribe((data) => {
      output.next(new SavedSearchLoadedState(data));
      output.complete();
    },
      (e: any) => {
        output.error(new SavedSearchLoadingErrorState(e));
        output.complete();
        this.logger.error('loading failed', e);
      });
    return output;
  }

  deleteSavedSearch(deldata) {
    const output = new Subject<Store.State>();
    const getVis = environment.api.logs.msearch.endpoint;
    const payload = deldata
    Object.assign(payload,{"requestType":"delete_object"})
    this.controller.post(getVis, payload).subscribe((data) => {
      output.next(new SavedSearchLoadedState(data));
      output.complete();
    },
      (e: any) => {
        output.error(new SavedSearchLoadingErrorState(e));
        output.complete();
        this.logger.error('loading failed', e);
      });
    return output;
  }
}
