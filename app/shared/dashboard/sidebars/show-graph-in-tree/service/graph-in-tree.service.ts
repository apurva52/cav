import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import {
  GraphInTreeLoadingState,
  GraphInTreeLoadedState,
  GraphInTreeLoadingErrorState,
  TreeWidgetMenuLoadingState,
  TreeWidgetMenuLoadedState,
  TreeWidgetMenuLoadingErrorState,
  ColorSearchInTreeLoadingState,
  ColorSearchInTreeLoadedState,
  ColorSearchInTreeLoadingErrorState
} from './graph-in-tree.state';
import { TreeRequestPayload, TreeInitRequestPayload, TreeResult, TreeNodeMenu } from './graph-in-tree.model';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class GraphInTreeService extends Store.AbstractService {
  path = environment.api.dashboard.tree.endpoint;
  duration: any;
  stopCounter : any;
  cacheData: TreeNodeMenu[];
  cacheColorArr = [];
  firstLevelArr = [];
  firstTimeFlag = true;
  constructor(private sessionService: SessionService) {
    super();
  }

  // tree init call -------------------------
  loadTreeInitExpendSearch(eventData, treePayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      if (treePayload.opType != 3)
        output.next(new GraphInTreeLoadingState());
    }, 0);

    me.controller.post(me.path, treePayload).subscribe((data: TreeResult[]) => {
      let dataObj: any = data;
      if (treePayload.opType == 1) {
        //console.log("before extend dataObj :", dataObj);
        if (dataObj.tree.length > 0 && dataObj.tree[0].children.length == 1) {
          this.treeInitExpend(dataObj, output);
        }
        else {
          this.dataExpendIconCall(dataObj);
          output.next(new GraphInTreeLoadedState(dataObj));
          output.complete();
        }
        // console.log("after extend dataObj :", dataObj);
      }
      else if (treePayload.opType == 2) {
        if (dataObj.tree.typeId != 3) {
          if (dataObj.tree.typeId == 5) {
            this.treeInitExpend(dataObj, output);
          }
          this.dataExpendIconCall(dataObj);
          eventData.node.children = dataObj.tree;
        }
        output.next(new GraphInTreeLoadedState(data));
        output.complete();
      }
      else if (treePayload.opType == 3) {
        this.dataExpendIconCall(dataObj);
        output.next(new GraphInTreeLoadedState(dataObj));
        output.complete();
      }
    }, (e: any) => {

      output.error(new GraphInTreeLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });

    return output;
  }

  treeInitExpend(element, output) {
    const me = this;

    let dataID = element.tree[0].children[0].id;
    let tagss = [{key: "Tier", value: "NA", mode: 1}]
    if (dataID == undefined)
      dataID = element.tree[0].id;
    const payload = {
      opType: 2,
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      duration: me.duration,
      clientId: "Default",
      appId: "Default",
      expandLevel: 2,
      id: dataID,
      subject: {tags : tagss}
    };

    me.controller.post(me.path, payload).subscribe((data: TreeResult[]) => {
      let jsondata: any = data;

      element.tree[0].children[0]["expanded"] = true;
      element.tree[0].children[0]["children"] = jsondata.tree;
      if(this.firstTimeFlag) {
        if(jsondata.tree && jsondata.tree.length > 0) {
          this.firstLevelArr = [];
          for (let i= 0 ; i < jsondata.tree.length ; i++) {
            this.firstLevelArr.push(jsondata.tree[i].name) ;
          }
        }
        this.firstTimeFlag = false;
      }

      // console.log("updating extend dataObj :", element);
      this.dataExpendIconCall(element);
      output.next(new GraphInTreeLoadedState(element));
      output.complete();
    }, (e: any) => {
      me.logger.error('loading failed', e);
    });
  }

  dataExpendIconCall(data) {
    this.recursiveChildCall(data.tree);
  }

  recursiveChildCall(childNode) {
    if (childNode && childNode.typeId != 3) {
      childNode.forEach(element => {
        if (element.typeId && element.typeId != 3) {
          if (element.children.length == 0) {
            element.children = [{}];
          }
          this.recursiveChildCall(element.children);
        }
      });
    }
  };

  // tree menu call---------------------
  loadTreeMenu(treeMenuPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TreeWidgetMenuLoadingState());
    }, 0);

    const path = environment.api.dashboard.treeMenu.endpoint;

    me.controller.post(path, treeMenuPayload).subscribe(
      (data) => {
        output.next(new TreeWidgetMenuLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TreeWidgetMenuLoadingErrorState(e));
        output.complete();

        me.logger.error('Widget Drilldown Submenu loading failed', e);
      }
    );

    return output;
  }

  loadTreeColor(payloadForColor): Observable<Store.State> {

    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ColorSearchInTreeLoadingState());
    }, 0);

    const path = environment.api.dashboard.treeColor.endpoint;

    me.controller.post(path, payloadForColor).subscribe((result: TreeResult[]) => {
      // console.log("color result :", result);
      output.next(new ColorSearchInTreeLoadedState(result));
      output.complete();

    }, (e: any) => {

      output.error(new ColorSearchInTreeLoadingErrorState(e));
      output.complete();

      me.logger.error('loading failed', e);
    });
    return output;
  }

  getRecursiveTierName(node, previousNode) {
    try {
      if(node) {
        if(this.firstLevelArr.includes(node.name)) {
          return previousNode.name;
        }else {
          return this.getRecursiveTierName(node.parent, node);
        } 
      }else {
        return "NA";
      }
    } catch (error) {
      return "NA";
    }

  }

  getTierName(node) {
    let tierName = "NA";
    try {
      if (node && !this.firstLevelArr.includes(node.name)) {
        tierName = this.getRecursiveTierName(node.parent, node);
      }
    } catch (error) {
      return "NA";
    }

    return tierName;
  }

}
