import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

import { ConfigRestApiService } from '../../nd-config/services/config-rest-api.service';
import * as URL from '../common-url-constant';

@Injectable()
export class TierGroupService {

    constructor(private _restApi: ConfigRestApiService) { };

    public getTopoList(): Observable<any> {
        return this._restApi.getDataByGetReq(`${URL.GET_TOPOLOGY_LIST}`);
    }

    public getTierList(data, selectedTierGroup): Observable<any> {
        return this._restApi.getDataByPostReq(`${URL.GET_TIER_LIST}/${selectedTierGroup}`, data);
    }

    public saveTierGroup(data, trNo, prodKey): Observable<any> {
        return this._restApi.getDataByPostReq(`${URL.SAVE_TIER_GROUP}/${trNo}?productKey=${prodKey}`, data);
    }

    public getTierGroupInfo(data): Observable<any> {
	let arr = [];
	arr.push(data);
        return this._restApi.getDataByPostReq(`${URL.GET_TIER_GROUP_INFO}`, arr);
    }

    public getSelectedTierGroupDelete(data, trNo, isProfAppliedTopo, prodKey): Observable<String[]> {
        return this._restApi.getDataByPostReq(`${URL.GET_DELETE_TIER_GROUP}/${trNo}/${isProfAppliedTopo}?productKey=${prodKey}`, data);
    }

    public getSelectedTierGroupUpdate(data, trNo, selectedTierGroup, isProfAppliedTopo, prodKey): Observable<String[]> {
        return this._restApi.getDataByPostReq(`${URL.GET_UPDATE_TIER_GROUP}/${trNo}/${selectedTierGroup}/${isProfAppliedTopo}?productKey=${prodKey}`, data);
    }

    public getPatternExistsOrNot(data,selectedTierGroup, prodKey): Observable<any> {
        return this._restApi.getDataByPostReqWithNoJSON(`${URL.PATTERN_EXISTS_OR_NOT}/${selectedTierGroup}?productKey=${prodKey}`, data);
    }
   

}
