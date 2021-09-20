import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { ProfileData } from '../containers/profile-data';
import { NodeData } from '../containers/node-data';

@Injectable()
export class ConfigProfileService {

  constructor(private _restApi: ConfigRestApiService) { }
  nodeData: NodeData;

  /**For Storing Profile Name. which is used to show in Meta-data component */
  private _profileName = new Subject<string>();


  profileNameProvider$ = this._profileName.asObservable();

  // private _nodeData = new Subject<NodeData>();
  // /** this  is used for maintaing data from which node configuration screen or profile is navigated to
  //  * This data is required for runTime Changes
  //  */
  // nodeDataProvider$ = this._nodeData.asObservable();

  // /***this function is called from tree-detail component whenever from any node profile is navigated to 
  //  * 
  // */
  // nodeDataObserver(nodeData:NodeData){
  //   console.log("nodeData--",nodeData)
  //   this._nodeData.next(nodeData);
  // }

  profileNameObserver(profileName: string) {
    this._profileName.next(profileName);
  }

  getProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_PROFILE_TABLEDATA}`);
  }

  getJavaTypeProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_JAVA_PROFILE_TABLEDATA}`);
  }

  getDotNetTypeProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_DOTNET_PROFILE_TABLEDATA}`);
  }

  getNodeJSTypeProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_NODEJS_PROFILE_TABLEDATA}`);
  }

  addProfileData(data): Observable<ProfileData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_PROFILE_TABLE}`, data);
  }

  getProfileName(profileId: number): Observable<string> {
    return this._restApi.getDataByGetReq(`${URL.GET_PROFILE_NAME}/${profileId}`);
  }

  /*deleteProfileData(data): Observable<any>{
    return this._restApi.getDataByPostReq(URL.DEL_PROFILE, data);
  }
*/
  deleteProfileData(data): Observable<any>{
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(URL.DEL_PROFILE, arr);
  }

  getProfileAgent(profileName): Observable<any>{
    let arr = [];
    arr.push(profileName);
    return this._restApi.getDataByPostReqWithNoJSON(URL.GET_PROFILE_AGENT, arr);
  }

  importProfile(filePath,username): Observable<any>{
    let arr = [];
    arr.push(filePath);
    arr.push(username);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.IMPORT_PROFILE}`, arr);
  }

  exportProfile(exportPath,data): Observable<any>{
    return this._restApi.getDataByPostReq(`${URL.EXPORT_PROFILE}/${exportPath}`, data);
  }

  /** To get the list of applied profile */
  getAppliedProfile(trNo): Observable<string[]>{
    let arr = [];
    arr.push(trNo);
    return this._restApi.getDataByPostReq(`${URL.GET_APPLIED_PROFILE}`, arr);
  }

    /** To get the details of applied profile */
    getAppliedProfileDetails(profileId): Observable<string>{
      let trNo = this.getTRNo()
      return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_APPLIED_PROFILE_DETAILS}/${profileId}/${trNo}`);
    }


    /**Get list of applied profiles in the topology levels */
    getListOfAppliedProfile(callback){
      let trNo = this.getTRNo();
      this.getAppliedProfile(trNo).subscribe( data => {
        callback(data)
      })
    }



  getTRNo() {
    let trNo = sessionStorage.getItem("isTrNumber");
    //If test is not running then send -1 to the backend
    if (trNo == "null") {
      trNo = "-1";
    }
    return trNo;
  }
 
  getDLAppliedProfName(): Observable<any> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_DL_APPLIED_PROF}`);
  }

}
