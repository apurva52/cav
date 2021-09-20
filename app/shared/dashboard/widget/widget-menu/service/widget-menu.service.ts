import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import {
  WidgetDrillDownMenuLoadingState,
  WidgetDrillDownMenuLoadedState,
  WidgetDrillDownMenuLoadingErrorState,
} from './widget-menu.state';
import { ActionInfo, WidgetDrillDownMenu } from './widget-menu.model';
import { environment } from 'src/environments/environment';
// import { DDR_MENU_OPTIONS } from './widget-menu.dummy';

@Injectable({
  providedIn: 'root',
})
export class WidgetMenuService extends Store.AbstractService {

  /* Making Obserables for widget settings */
public _widgetSettings = new Subject<ActionInfo>();
_widgetSettingsProviders$ = this._widgetSettings.asObservable();

  loadDrillDownMenu(payload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new WidgetDrillDownMenuLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new WidgetDrillDownMenuLoadedState(DDR_MENU_OPTIONS));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new WidgetDrillDownMenuLoadingErrorState(new Error()));
    // }, 2000);

    // <----------------- DEV CODE

    const path = environment.api.dashboardWidget.menu.endpoint;

    me.controller.post(path, payload).subscribe(
      (data: WidgetDrillDownMenu) => {
        output.next(new WidgetDrillDownMenuLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new WidgetDrillDownMenuLoadingErrorState(e));
        output.complete();

        me.logger.error('Widget Drilldown Menu loading failed', e);
      }
    );

    return output;
  }
}
