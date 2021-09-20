import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { AdvanceException, EnableSourceCodeFilters } from '../containers/exception-capture-data';
import { NodeData } from '../containers/node-data';

@Injectable()
export class ConfigExceptionFilterService {

  constructor(private _restApi: ConfigRestApiService) { }
  nodeData: NodeData;


  // addExceptionFilterData(data,profileId): Observable<EnableSourceCodeFilters> {
  //   let url = `${URL.ADD_ADVANCE_EXCEPTION_FILTER}/${profileId}`
  //   return this._restApi.getDataByPostReq(url, data);
  // }


 addExceptionFilterData(data, profileId): Observable<EnableSourceCodeFilters> {
    return this._restApi.getDataByPostReq(`${URL.ADD_ADVANCE_EXCEPTION_FILTER}/${profileId}`, data);
  }


  getExceptionFilterData(profileId): Observable<EnableSourceCodeFilters[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_EXCETION_FILTERS_MON_TABLEDATA}/${profileId}`);
  }

  editExceptionFilterData(data, profileId): Observable<EnableSourceCodeFilters> {
    let url = `${URL.EDIT_ROW_EXCEPTION_FILTER_URL}/${profileId}/${data.advanceExceptionFilterId}`
    return this._restApi.getDataByPostReq(url, data);
  }


  deleteExceptionFilterData(data, profileId): Observable<EnableSourceCodeFilters> {
    return this._restApi.getDataByPostReq(`${URL.DEL_EXCEPTION_FILTER}/${profileId}`, data);
  }

   /** Method to upload file excetion filter file */
   uploadExceptionFilterFile(filePath, profileId){
    let arr = [];
    arr.push(filePath);
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_EXCEPTION_FILTER_FILE}/${profileId}`, arr);
  }
  
  /** Writing the exception filters to the file when save button in header field is clicked*/
  writeExceptionFilterFile(profileId): Observable<EnableSourceCodeFilters> {
    return this._restApi.getDataByGetReqWithNoJson(`${URL.SAVE_ADVANCE_EXCEPTION_FILTER}/${profileId}`);
  }

  /** Writing the include and exclude exception to the file when save button is clicked*/
  writeTryCatchInstrumenationFile(profileId, data){
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReq(`${URL.SAVE_TRY_CATCH_INSTRUMENTATION}/${profileId}`, arr);
  }

  writeAdvExcepDataToFile(profileId, data): Observable<AdvanceException> {
    return this._restApi.getDataByPostReq(`${URL.SAVE_ADV_EXCEP_DATA}/${profileId}`, data);
  }

}
