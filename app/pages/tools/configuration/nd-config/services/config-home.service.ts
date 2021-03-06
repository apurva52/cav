import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ConfigRestApiService } from './config-rest-api.service';

import { MainInfo, TRData } from '../interfaces/main-info';
import { EntityInfo } from '../interfaces/entity-info';
import * as URL from '../constants/config-url-constant';

@Injectable()
export class ConfigHomeService {

  private trDataSource = new Subject<TRData>();
   AIStartStopOpertation = new Subject<any>(); // for Auto instrumentation Operation
   AIStartStopOpertationList = new Subject<any>();
   _AIStartStopOpertation$ = this.AIStartStopOpertation.asObservable();
   _AIStartStopOpertationList$ = this.AIStartStopOpertationList.asObservable();
  // private _trData: TRData;

  private _trData: TRData;

  private selectedFromAD = new Subject<any>();
  selectedFromAD$ = this.selectedFromAD.asObservable();


  public loadBT(data)
  {
       this.selectedFromAD.next(data);
  }

  private BTMethodDataFromAD = new Subject<boolean>();
  getBTMethodDataFromAD$ = this.BTMethodDataFromAD.asObservable();


  public getBTMethodDataFromAD(data)
  {
       this.BTMethodDataFromAD.next(data);
  }

  private selectedValueOfBT = new Subject<Object>();
  selectedValueOfBT$ = this.selectedValueOfBT.asObservable();


  public callTosetSelectedValueOfBT(message : boolean , profileId : number)
  {
       this.selectedValueOfBT.next({ "message": message, "profileId": profileId});
  }

  public getAIStartStopOperationValue(data)
  {
       this.AIStartStopOpertation.next(data);
  }

  public AIStartStopOpertationValueList(data)
  {
       this.AIStartStopOpertationList.next(data);
  }
  public getAIStartStopOperationOnHome()
  {
    this.AIStartStopOpertationList.next("data");
  }

	public get trData(): TRData { 
    if(sessionStorage.getItem("trData") != null) {
      return JSON.parse(sessionStorage.getItem("trData"));
    }
		return this._trData;
	}

	public set trData(value: TRData) {
    sessionStorage.setItem("trData", JSON.stringify(value));
		this._trData = value;
	}
  
  // Observable string streams
  trData$ = this.trDataSource.asObservable();

  // Service message commands
  setTrData(trData: TRData) {
    this.trDataSource.next(trData);
  }

  constructor(private _restApi: ConfigRestApiService) { }

  getMainData(): Observable<MainInfo> {
    return this._restApi.getDataByGetReq(URL.HOME_SCREEN_URL);
  }

  importTopology(topoName): Observable<EntityInfo[]> {
    let arr = [];
    arr.push(topoName);
    return this._restApi.getDataByPostReq(`${URL.UPDATE_TOPOLOGY}`, arr);
  }

  getTopologyList(){
    return this._restApi.getDataByGetReq(URL.GET_TOPO_LIST);
  }

  getTestRunStatus()
  {
    return this._restApi.getDataByGetReqForRunningTestStatus(URL.GET_TEST_RUN_STATUS);
  }

 getRunningApp(trNo){
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_RUNNING_APP}/${trNo}`)
  }

}
