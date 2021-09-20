import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {ConfigRestApiService} from './config-rest-api.service';
import { NDAgentInfo, CmonInfo,CmonEnvInfo } from '../interfaces/nd-agent-info';
import * as URL from '../constants/config-url-constant';
import { AutoDiscoverData } from "../containers/auto-discover-data";


@Injectable()
export class ConfigNdAgentService {

  constructor(private _restApi: ConfigRestApiService) { }

   getNDAgentStatusData(): Observable<NDAgentInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_ND_AGENT_TABLEDATA);
  }

   getCmonStatusData(): Observable<CmonInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_CMON_TABLEDATA);
  }

  getInstanceList(agentType): Observable<any[]>{
    let arr = [];
    arr.push(agentType);
    return this._restApi.getDataByPostReq(URL.FETCH_AUTO_DISCOVERED_INSTANCE,arr);
  }

     discoverData(data): Observable<AutoDiscoverData>{
    return this._restApi.getDataByPostReq(URL.DISCOVER_DATA, data);
  }

  getCmonEnvKeyValueForShow(cmonInfoArr: any, prodKey): Observable<object> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_CMON_ENV_KEYVALUE_VIEW}?productKey=${prodKey}`, cmonInfoArr);
  }

  getCmonEnvKeyValueForEdit(cmonInfoArr: any, prodKey): Observable<CmonEnvInfo> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_CMON_ENV_KEYVALUE_EDIT}?productKey=${prodKey}`, cmonInfoArr);
  }

  getCmonEnvKeyValueUpdate(cmonInfoArr: any, prodKey): Observable<any> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_CMON_ENV_KEYVALUE}?productKey=${prodKey}`, cmonInfoArr);
  }

  getCmonEnvRestartedStatus(restartedCmonAgentList: string[], prodKey): Observable<object> {
    return this._restApi.getDataByPostReq(`${URL.RESTART_CMON_ENV_AGENT}?productKey=${prodKey}`, restartedCmonAgentList);
  }

  listFiles(data: string): Observable<string[]>{
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReq(`${URL.LIST_BCI_FILES}`,arr)
  }

  downloadAgentFile(data: string, prodKey): Observable<any>{
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DOWNLOAD_BCI_FILE}?productKey=${prodKey}`,arr)
  }
}
