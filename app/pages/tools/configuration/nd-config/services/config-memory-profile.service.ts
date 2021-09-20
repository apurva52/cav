import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { ConfigRestApiService } from './config-rest-api.service';
import { ApplicationInfo } from '../interfaces/application-info';
import * as URL from '../constants/config-url-constant';
import { EntityInfo } from '../interfaces/entity-info';

@Injectable()
export class ConfigMemoryProfileService {

    constructor(private _restApi: ConfigRestApiService) { }

    saveConfiguration(data) {
        return this._restApi.getDataByPostReq(`${URL.SAVE_MEM_PROF_DATA}`, data);
    }

    memProfNDCConn(data) {
        return this._restApi.getDataByPostReq(`${URL.NDC_CONN_FOR_MEM_PROF}`, data);
    }

    updateMemProfTxnId(id, txnId) {
        return this._restApi.getDataByPostReq(`${URL.UPDATE_MEM_PROF_TXN_ID}/${id}/${txnId}`);
    }

    deleteMemProfSession(id, data) {
        return this._restApi.getDataByPostReq(`${URL.DELETE_MEM_PROF_SESSION}/${id}`, data);
    }

    getMemProfSessionData(triggerScreen) {
        return this._restApi.getDataByGetReq(`${URL.GET_MEMORY_PROFILE_SESSIONS}/${triggerScreen}`);
    }

    getSessionResponse(name) {
        return this._restApi.getDataByPostReq(`${URL.GET_SESSION_RESPONSE_DATA}`, name);
    }
}
