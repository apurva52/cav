import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { TreeSubMenuLoadedState, TreeSubMenuLoadingState,TreeSubMenuLoadingErrorState } from './tree-submenu.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TreeSubmenuService extends Store.AbstractService {
    loadTreeSubMenu(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // setTimeout(() => {
    //   output.next(new WidgetDrillDownMenuLoadingState());
    // }, 0);

    /// DEV CODE ----------------->
    // const optionsData: MenuItem[] =
    // [
    //     {
    //       "label": "Monitor",
    //       "items": [
    //         {
    //           "label": "Start Monitor",
    //           "items": [
    //             {
    //               "label": "Select Monitor on Selected Server"
    //             },
    //             {
    //               "label": "All Monitor on Selected Server"
    //             }
    //           ]
    //         },
    //         {
    //           "label": "Stop Monitor",
    //           "items": [
    //             {
    //               "label": "Select Monitor on Selected Server"
    //             },
    //             {
    //               "label": "All Monitor on Selected Server"
    //             }
    //           ]
    //         },
    //         {
    //           "label": "Restart Monitor",
    //           "items": [
    //             {
    //               "label": "Select Monitor on Selected Server"
    //             },
    //             {
    //               "label": "All Monitor on Selected Server"
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       "label": "Open Related Metrics",
    //       "items": [
    //         {
    //           "label": "Same Tier (Tomcat_work4)"
    //         },
    //         {
    //           "label": "Same Server (overall)"
    //         }
    //       ]
    //     },
    //     {
    //       "label": "Parameterized"
    //     }
    //   ]
    
    setTimeout(() => {
      output.next(new TreeSubMenuLoadingState());
    }, 0);

    const path = environment.api.dashboard.treeMenu.endpoint;
    const payload = {
        groupLevel : 0,
        graphLevel : -1
    }
    me.controller.post(path,payload).subscribe(
      (data) => {
        output.next(new TreeSubMenuLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TreeSubMenuLoadingErrorState(e));
        output.complete();

        me.logger.error('Widget Drilldown Submenu loading failed', e);
      }
    );

    return output;
  }

}
