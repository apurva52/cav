import { SessionService } from './../../../../../core/session/session.service';
import { EventResponse } from './../../../../../shared/header/events-menu/service/event.model';
import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { EventHistoryRequest } from './alert-filter.model';
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AlertFilterLoadedStatus, AlertFilterLoadingErrorStatus } from './alert-filter.state';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState, GlobalTimebarTimeLoadingState } from 'src/app/shared/time-bar/service/time-bar.state';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { SelectItem } from 'primeng';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class AlertFilterService extends Store.AbstractService{

  constructor(private sessionService: SessionService) {
    super();
   }

  loadTime(timePeriod: string, viewBy?: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new GlobalTimebarTimeLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new GlobalTimebarTimeLoadedState());
    // }, 2000);

    const path = environment.api.globalTimebar.time.endpoint;
    const session = me.sessionService.session;

    if (session) {
      let payload = null;
      payload = {
        cck: session.cctx.cck,
        tr: me.sessionService.testRun.id,
        pk: session.cctx.pk,
        u: session.cctx.u,
        sp: timePeriod,
      };
      

      me.controller.get(path, payload).subscribe(
        (data: number[]) => {
          output.next(new GlobalTimebarTimeLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new GlobalTimebarTimeLoadingErrorState(e));
          output.complete();

          me.logger.error('GlobalTimebar Time Loading failed', e);
        }
      );
    }

    return output;
  }

  syncPreset(timebarService: TimebarService, preset: SelectItem[])
  {
    let selectedPreset = "";

    if(timebarService && timebarService.tmpValue && timebarService.tmpValue.timePeriod)
    {
      let isCustom = timebarService.isCustomTime(
        timebarService.tmpValue.timePeriod.selected.id
      )

      if(!isCustom)
      {
        var presetOption = MenuItemUtility.
        searchByAnyKey(timebarService.tmpValue.timePeriod.selected.id, preset, "value");
  
        if(presetOption)
          selectedPreset = presetOption['value'];
        else
          selectedPreset = preset[4].value;
      }
      else
        selectedPreset = preset[preset.length - 1].value;
    }
    else
      selectedPreset = preset[4].value;

    return selectedPreset;
  }
  
}
