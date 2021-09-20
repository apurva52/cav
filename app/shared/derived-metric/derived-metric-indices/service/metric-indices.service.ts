import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { hierarchialDataCreatedState, hierarchialDataCreatingErrorState, hierarchialDataCreatingState } from './metric-indices.state';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { METRIC_INDICES_DATA } from './metric-indices.dummy';
import { hierarchicalPayload } from './metric-indices.model';

@Injectable({
  providedIn: 'root',
})


export class derivedIndicesService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  loadHierarcialData(payload: hierarchicalPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new hierarchialDataCreatingState());
    }, 0);

    let path = '/web/metrictree/hierarchical';


    const subscription = this.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new hierarchialDataCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );
    return output;
  }

}
