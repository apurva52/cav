import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { DashboardFavListLoadingState, DashboardFavListLoadedState, DashboardFavListLoadingErrorState } from './dashboard-fav-list-state';
import { MenuItem, TreeNode } from 'primeng';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { NO_ACCESS } from 'src/app/pages/my-library/dashboards/service/dashboards.model';
import { ɵInternalFormsSharedModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DashboardFavListService extends Store.AbstractService {

  private cache: MenuItem[];

  constructor(private sessionService: SessionService) {
    super();
  }

  load(force?: boolean): Observable<Store.State> {
    const me = this;
    if(sessionStorage.getItem("isLoad") == "true"){
      force = true;
    }
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardFavListLoadingState());
    }, 0);

    if (me.cache && !force) {
      setTimeout(() => {
        output.next(new DashboardFavListLoadedState(me.cache));
        output.complete();
      }, 0);
    } else {

      const session = me.sessionService.session;

      if (session) {
        const payload = {
          cck: session.cctx.cck,
          tr: me.sessionService.testRun.id,
          pk: session.cctx.pk,
          u: session.cctx.u,

          isMultiDc: false //me.sessionService.isMultiDC
        };

        const path = environment.api.dashboard.list.endpoint;

        me.controller.get(path, payload).subscribe((data: MenuItem[]) => {

          me.cache = me.convertToTree(data, payload.u);
          console.log("data coming in list...", data, "cache", me.cache)
          sessionStorage.setItem('favList', JSON.stringify(data));
          sessionStorage.setItem("isLoad", "false");
          output.next(new DashboardFavListLoadedState(me.cache));
          output.complete();

        }, (e: any) => {

          output.error(new DashboardFavListLoadingErrorState(e));
          output.complete();

          me.logger.error('Dashboard layout loading failed', e);
        });
      }

    }
    return output;
  }


  private convertToTree(items: any[], userName: string): TreeNode[] {
    const me = this;
    const forest: TreeNode[] = [];
   // let isAddDashboard: boolean = true;
    if (items && items.length) {
   // const validItem  = items.filter(i => !i.path ? i : i.access == 0 ? !i.owner ? i : i.owner== userName : i);
      for (const item of items) {
        const tree: TreeNode = {
          icon: item.icon ? item.icon : (item.state && item.state.path ? 'icons8 icons8-view-all' : 'icons8 icons8-folder'),
          children: me.convertToTree(item.items, userName),
          label: item.label,
          data: item.state,
          // key: item.state ? JSON.stringify(item.state) : JSON.stringify(item.label + '' + Math.random()), // TODO: PrimeNG tree bug need to check if upgread solves this
        key: item.label + '' + Math.random(), // TODO: PrimeNG tree bug need to check if upgread solves this

        };
        forest.push(tree);
      }
    }
    return forest;
  }

}
