import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import {ConfigRestApiService} from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { MethodBasedCustomData } from '../containers/method-based-custom-data';
import { METHOD_BASED_CUSTOMDATA } from '../reducers/customdata-reducer';


@Injectable()
export class ConfigCustomDataService {

  constructor(private _restApi: ConfigRestApiService,private store: Store<Object>) { }

  //applicationData: ApplicationInfo[];

   /** For Getting all MethodBased Custom data */
  getMethodBasedCustomData(profileId) :Observable<Object[]>{
   return this._restApi.getDataByGetReq(`${URL.FETCH_METHOD_BASED_CUSTOMDATA}/${profileId}`)
  }

  addMethodBasedCustomData(data,profileId):Observable<MethodBasedCustomData>{
   return this._restApi.getDataByPostReq(`${URL.ADD_METHOD_BASED_CAPTURING}/${profileId}`,data)
  }
  
   deleteJavaMethodData(data): Observable<MethodBasedCustomData>{
    return this._restApi.getDataByPostReq(URL.DEL_METHOD_BASED_CAPTURING, data);
  }

  updateCaptureCustomDataFile(profileId){
    this._restApi.getDataByGetReqWithNoJson(`${URL.UPDATE_CUSTOM_CAPTURE_DATA_FILE}/${profileId}`).subscribe();
  }

  editMethodBasedCustomData(data):Observable<MethodBasedCustomData>{
    return this._restApi.getDataByPostReq(`${URL.EDIT_METHODBASED_CUSTOMDATA}/${data.methodBasedId}`,data)
  }

  deleteReturnRules(data){
    return this._restApi.getDataByPostReq(`${URL.DEL_CUSTOM_METHOD_RETURN_VALUE}`,data);
  }

  deleteArgumentRules(data){
    return this._restApi.getDataByPostReq(`${URL.DEL_CUSTOM_METHOD_ARG_VALUE}`,data);
  }

  

}
