import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { getAllUserResponse, groupSaveReq, saveUserReq } from './access-control.model'
import { AccessControlLoadedState, AccessControlLoadingState, AccessControlLoadingErrorState, saveUserLoadingErrorState, saveUserLoadedState, saveUserLoadingState } from './access-control.state';
// import { ACCESS_CONTROL_DATA_TABLE } from './access-control.dummy';

@Injectable({
  providedIn: 'root',
})
export class AccessControlService extends Store.AbstractService {
  userGroupCapabiltyData: any;
  addNewUserFlag: boolean = false;
  addNewGroupFlag: boolean = false;
  userInfo: any;
  groupInfo: any;
  dataForUser: boolean = false;

  public aclDataGet() {
    return this.userGroupCapabiltyData;
  }

  public aclDataSet(data) {
    this.userGroupCapabiltyData = data
  }

  public newUserFlagSet(flag) {
    this.addNewUserFlag = flag;
  }

  public newUserFlagGet() {
    return this.addNewUserFlag;
  }


  public newGroupFlagSet(flag) {
    this.addNewGroupFlag = flag;
  }

  public newGroupFlagGet() {
    return this.addNewGroupFlag;
  }

  public setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  public getUserInfo() {
    return this.userInfo
  }

  public setGroupInfo(groupInfo) {
    this.groupInfo = groupInfo;
  }

  public getGroupInfo() {
    return this.groupInfo;
  }

  public dataFromUserComponentSet(flag) {
    this.dataForUser = flag;
  }

  public dataFromUserComponentGet() {
    return this.dataForUser
  }

  load(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AccessControlLoadingState());
    }, 0);

    let path = '/acl/session/getAllUserUnified';
    const subscription = me.controller.get(path, payload).subscribe(
      (data) => {

        console.log("get call success", data)
        output.next(new AccessControlLoadedState(data));
        output.complete();
      },
      (error: AccessControlLoadingErrorState) => {
        console.log("get call error")
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );


    return output;
  }

  saveUser(payload: saveUserReq, productKey: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AccessControlLoadingState());
    }, 0);

    let path = '/acl/session/saveAclUser?productKey=' + productKey;
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

        console.log("get call success", data)
        output.next(new saveUserLoadedState(data));
        output.complete();
      },
      (error: saveUserLoadingErrorState) => {
        console.log("get call error", error)
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );


    return output;
  }

  saveGroup(payload: groupSaveReq, productKey: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AccessControlLoadingState());
    }, 0);

    let path = '/acl/session/saveAclGroup?productKey=' + productKey;
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

        console.log("get call success", data)
        output.next(new saveUserLoadedState(data));
        output.complete();
      },
      (error: saveUserLoadingErrorState) => {
        console.log("get call error")
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );


    return output;
  }


  getAllUserInfo(productKey: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new AccessControlLoadingState());
    }, 0);

    let path = '/acl/session/getAclUserInfo?productKey=' + productKey;
    const subscription = me.controller.get(path).subscribe(
      (data) => {

        console.log("get call success", data)
        output.next(new AccessControlLoadedState(data));
        output.complete();
      },
      (error: AccessControlLoadingErrorState) => {
        console.log("get call error in /getAclUserInfo")
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );


    return output;
  }

}
