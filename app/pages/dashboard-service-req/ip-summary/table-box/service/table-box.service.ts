import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { TableBoxLoadingState, TableBoxLoadedState } from './table-box.state';
import { TABLE_BOX_TABLE } from './table-box.dummy';


@Injectable({
  providedIn: 'root',
})
export class TableBoxService extends Store.AbstractService {

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TableBoxLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      output.next(new TableBoxLoadedState(TABLE_BOX_TABLE));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new TableBoxLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: TableBoxQueriesTable) => {
    //     output.next(new TableBoxLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new TableBoxLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Table Box Data loading failed', e);
    //   }
    // );

    return output;
  }
}
