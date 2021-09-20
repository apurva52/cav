import { Injectable } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DashboardFavCTX } from 'src/app/shared/dashboard/service/dashboard.model';
import { environment } from 'src/environments/environment';
import { COPY_DASHBOARD, DashboardReq, DUPLICATE_DASHBOARD_NAME, EDIT_DASHBOARD, MyDashboardsTable, READ_WRITE_MODE, SAVE_DASHBOARD, Status, UPDATE_DASHBOARD } from './dashboards.model';
import { DashboardDataLoadedState, DashboardDataLoadingErrorState, DashboardDataLoadingState, DashboardStateLoadedStatus, DashboardStateLoadingErrorStatus, DashboardStateLoadingStatus, FileDownloadLoadingErrorState, FileDownloadLoadedState } from './dashboards.state';


@Injectable({
  providedIn: 'root'
})
export class DashboardsService extends Store.AbstractService {
  freq: number = 0;
  completeTreeData: TreeNode[] = [];
  parentfreq: number = 0;
  permission: boolean = true;
  userArray : any = [];
  private cache: MenuItem[];
  constructor(private sessionService: SessionService) {
    super();
  }

  load(data: MyDashboardsTable): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    me.freq = 0;
    me.parentfreq = 0;
    me.permission = true;
    setTimeout(() => {
      output.next(new DashboardDataLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new DashboardDataLoadedState());
    //   output.complete();
    // }, 2000)
    // setTimeout(() => {
    //   output.error(new DashboardDataLoadingErrorState(new Error()));
    // }, 2000);

    const session = me.sessionService.session;

    if (session) {
      const payload = {
        cck: session.cctx.cck,
        tr: me.sessionService.testRun.id,
        pk: session.cctx.pk,
        u: session.cctx.u,

        isMultiDc:  false   //me.sessionService.isMultiDC
      };
      const path = environment.api.dashboard.list.endpoint;
        sessionStorage.setItem("isLoad","true");
      me.controller.get(path, payload).subscribe((result: MenuItem[]) => {
        me.userArray.length = 0;
        me.userArray.push("All Users");
        data.data = me.convertToTreeTable(result);
        data.options.length = 0;
    var userFilteredArray = me.userArray.filter(function(item, pos){
         return me.userArray.indexOf(item)== pos;

    });

//put into p-dropdown format;
userFilteredArray.forEach(element => {
  if(element == "All Users"){
    data.options.push({label: element, value: ''})
  }
  else{
  data.options.push({label: element, value: element})
  }
});

        output.next(new DashboardDataLoadedState(data));
        output.complete();

      }, (e: any) => {

        output.error(new DashboardDataLoadingErrorState(e));
        output.complete();

        me.logger.error('Dashboard layout loading failed', e);
      });

      return output;
    }
  }

  addDashboard(data: DashboardReq , force?: boolean): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardStateLoadingStatus());
    }, 0);

    const session = me.sessionService.session;

    if (session) {

      data.cctx = me.sessionService.session.cctx;
      data.tr = me.sessionService.testRun.id;
      const availPath = environment.api.dashboard.avail.endpoint;
      const path = environment.api.dashboard.operations.endpoint;
      if (data.opType == SAVE_DASHBOARD || data.opType == EDIT_DASHBOARD || data.opType == COPY_DASHBOARD) {
        me.controller.post(availPath, data).subscribe(
          (result: any) => {
            if (result.code !== DUPLICATE_DASHBOARD_NAME || force) {
              if(force && result.code == DUPLICATE_DASHBOARD_NAME){
                data.favCtx.favDetailCtx.updatedBy = session.cctx.u;
                data.favCtx.oldfavNameCtx = null;
              }
              else if(force){
                data.favCtx.favDetailCtx.public = data.favCtx.favDetailCtx.isPublic;
                data.favCtx.favDetailCtx.updatedBy = session.cctx.u;
                data.favCtx.favDetailCtx.owner = session.cctx.u;
                data.favCtx.favDetailCtx.readWriteMode = READ_WRITE_MODE;
                data.favCtx.favDetailCtx.public = data.favCtx.favDetailCtx.isPublic;
                data.favCtx.favDetailCtx.createdDate = new Date().toDateString();
              }
              me.controller.post(path, data).subscribe((status: any) => {
                output.next(new DashboardStateLoadedStatus(status));
                output.complete();
              });
            }
            else {
              output.next(new DashboardStateLoadedStatus(result));
              output.complete();
            }
          },
          (e: any) => {
            output.error(new DashboardStateLoadingErrorStatus(e));
            output.complete();

            me.logger.error('Dashboard is not saved successfully', e);
          }
        );
      }
      else if (data.opType == UPDATE_DASHBOARD) {
        if(force){
          data.favCtx.favDetailCtx.public = data.favCtx.favDetailCtx.isPublic;
          data.favCtx.favDetailCtx.updatedBy = session.cctx.u;
          data.favCtx.oldfavNameCtx = null;
        }
        me.controller.post(path, data).subscribe(
          (result: any) => {
            output.next(new DashboardStateLoadedStatus(result));
            output.complete();

          },
          (e: any) => {
            output.error(new DashboardStateLoadingErrorStatus(e));
            output.complete();

            me.logger.error('Dashboard is not saved successfully', e);
          }
        );
      }

      return output;
    }
  }

  deleteData(dashboardPayload: DashboardReq): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardStateLoadingStatus());
    });
    const path = environment.api.dashboard.operations.endpoint;
    const session = me.sessionService.session;

    if (session) {

      dashboardPayload.cctx = this.sessionService.session.cctx;
      dashboardPayload.tr = me.sessionService.testRun.id;
      me.controller.post(path, dashboardPayload).subscribe(
        (data: Status) => {
          // TODO: change all error objects
          if (data) {
            output.next(new DashboardStateLoadedStatus(data));
            output.complete();
            me.logger.error('Dashboard loading failed', data);
            return;
          }

          output.next(new DashboardStateLoadingErrorStatus(data));
          output.complete();
        },
        (e: any) => {
          output.error(new DashboardStateLoadingErrorStatus(e));
          output.complete();

          me.logger.error('Dashboard loading failed', e);
        }
      );

      return output;
    }
  }

  private convertToTreeTable1(items: any[]): TreeNode[] {

    const me = this;

    if (this.completeTreeData.length !== 0 && items.length != 0) {
      me.freq = 0;
      me.permission = true;
      this.completeTreeData = [];
    }
    const completeTreeData: TreeNode[] = [];
    if (items && items.length) {
      for (const [i, item] of items.entries()) {
        me.freq = item.frequency == -1 ? 0  : item.frequency + me.freq;
        me.parentfreq =  item.frequency == -1 ? 0 + me.parentfreq : item.frequency + me.parentfreq;
        if (item.access == 0 || item.access == 4) {
          me.permission = false;
        }

        const tree: TreeNode = {
          data: {
            icon: item.icon ? item.icon : (item.state && item.state.path ? 'icons8 icons8-view-all' : 'icons8 icons8-folder'),
            label: item.label,
            data: item.state,
            key: item.state ? JSON.stringify(item.state) : JSON.stringify(item.label + '' + Math.random()),
            type: item.state && item.state.path ? 'File' : 'Folder',
            path: item.path,
            owner: item.owner,
            creationDate: item.creationDate,
            access: item.access,
            selectedNode: false,
            frequency: item.frequency,
            modifiedDate: item.modified,
            frequ: me.freq,
            permission: me.permission
            // TODO: PrimeNG tree bug need to check if upgread solves this
          },

          children: me.convertToTreeTable1(item.items),
        };
        if (tree.data.label == "dashboards" && tree.data.path.indexOf("/dashboards") == 0 && tree.data.type == "Folder") {
          tree.data.frequ = me.parentfreq;
        }
        else {
          tree.data.frequ = me.freq;
          tree.data.permission = me.permission;
        }
        completeTreeData.push(tree);
        this.completeTreeData = completeTreeData;
      }

    }
    return completeTreeData;
  }

  private convertToTreeTable(items: any[]): TreeNode[] {

    const me = this;
    const completeTreeData: TreeNode[] = [];
    if (items && items.length) {
      for (const [i, item] of items.entries()) {
        const tree: TreeNode = {
          data: {
            icon: item.icon ? item.icon : (item.state && item.state.path ? 'icons8 icons8-view-all' : 'icons8 icons8-folder'),
            label: item.label,
            data: item.state,
            key: item.state ? JSON.stringify(item.state) : JSON.stringify(item.label + '' + Math.random()),
            type: item.state && item.state.path ? 'File' : 'Folder',
            path: item.path,
            owner: item.owner,
            creationDate: item.creationDate,
            access: item.access,
            selectedNode: false,
            frequency: item.frequency,
            modifiedDate: item.modified,
            isSelected : false
          },

          children: me.convertToTreeTable(item.items),
        };
        completeTreeData.push(tree);
        if(tree.data.owner !="" && tree.data.owner !=null && tree.data.owner !=undefined){
        me.userArray.push(tree.data.owner);
        }
      }

    }
    return completeTreeData;
  }

  setUserProjectDefault(payload:DashboardReq){

    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardStateLoadingStatus());
    }, 0);

    const session = me.sessionService.session;

    if (session) {

      payload.cctx = me.sessionService.session.cctx;
      payload.tr = me.sessionService.testRun.id;
      const path = environment.api.dashboard.setUserOrProjDefault.endpoint;
        me.controller.post(path, payload).subscribe(
          (result: any) => {
            if (result) {
              output.next(new DashboardStateLoadedStatus(result));
              output.complete();
              me.logger.error('Dashboard loading failed', result);
              return;
            }
          },
          (e: any) => {
            output.error(new DashboardStateLoadingErrorStatus(e));
            output.complete();

            me.logger.error('Dashboard is not saved successfully', e);
          }
        );
      return output;
    }

  }

  chkAvailableDashboard(data: DashboardReq): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardStateLoadingStatus());
    }, 0);

    const session = me.sessionService.session;

    if (session) {

      data.cctx = me.sessionService.session.cctx;
      data.tr = me.sessionService.testRun.id;
      const availPath = environment.api.dashboard.avail.endpoint;
        me.controller.post(availPath, data).subscribe(
          (result: any) => {
              output.next(new DashboardStateLoadedStatus(result));
              output.complete();
          },
          (e: any) => {
            output.error(new DashboardStateLoadingErrorStatus(e));
            output.complete();

            me.logger.error('Dashboard availability', e);
          }
        );
      //}
      return output;
    }
  }

  download(rootPath) : Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    const path = environment.api.downloadFile.load.endpoint;

    me.controller.post(path, rootPath).subscribe(
      (data) => {
        output.next(new FileDownloadLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new FileDownloadLoadingErrorState(e));
        output.complete();

        me.logger.error('Error in uploading file', e);
      }
    )

    return output;
  }
}
