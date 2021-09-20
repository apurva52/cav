import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { HierarchialDataLoadedState, HierarchialDataLoadingErrorState, HierarchialDataLoadingState  } from './filter-by-favorite.state';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { ParametersData, hierarchicalPayload } from './filter-by-favorite.model';

@Injectable({
  providedIn: 'root',
})


export class ParameterService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

loadHierarcialData(payload: hierarchicalPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // setTimeout(() => {
    //   output.next(new HierarchialDataLoadedState());
    // }, 0);

    let path = environment.api.dashboard.hierarchical.endpoint;


    this.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new HierarchialDataLoadedState(data));
        output.complete();
      },
      (error: AppError) => {
        console.log("post call error")
        output.error(new HierarchialDataLoadingErrorState(error));
        output.complete();
      }
    );
    return output;
  }
}
