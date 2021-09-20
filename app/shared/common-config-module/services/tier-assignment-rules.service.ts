import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TierAssignmentRuleData } from '../containers/tier-assignment-rule';

import { CommonRestApiService } from './common-rest-api-services';
import * as URL from '../constants/common-url-constant';


@Injectable()
export class TierAssignmentRulesService {

    constructor(private _restApi: CommonRestApiService) { };

    /** Save Global Settings List into DB */
    saveTierAssignRule(data): Observable<TierAssignmentRuleData> {
        return this._restApi.getDataByPostReq(`${URL.SAVE_TIER_ASSIGN_RULE}`, data)
    }

    /** For Getting Tier Assign Rule */
    getTierAssignRule(topoName): Observable<TierAssignmentRuleData[]> {
        return this._restApi.getDataByGetReq(`${URL.GET_TIER_ASSIGN_RULE}/${topoName}`);
    }

    /** For Deleting Tier Assign Rule */
    deleteTierAssignRule(tierAssignRuleId): Observable<TierAssignmentRuleData> {
        let arr = [];
        arr.push(tierAssignRuleId);
        return this._restApi.getDataByPostReq(`${URL.DELETE_TIER_ASSIGN_RULE}`, arr);
    }

    /** Save Tier Assign Rule in File */
    saveTierAssignRuleOnFile(topoName): Observable<any> {
        let arr = [];
        arr.push(topoName);
        return this._restApi.getDataByPostReq(`${URL.SAVE_TIER_ASSIGN_RULE_ON_FILE}`, arr);
    }

    //Get Tier List basis on Topology 
    getTierList(data): Observable<string[]> {
        let arr = [];
        arr.push(data);
        return this._restApi.getDataByPostReq(`${URL.GET_TIER_LIST_FOR_TIER_ASSIGN}`, arr);
    }

    //Get Server List basis on Topology 
    getServerList(data): Observable<string[]> {
        let arr = [];
        arr.push(data);
        return this._restApi.getDataByPostReq(`${URL.GET_SERVER_LIST}`, arr);
    }

    //Get topology list
    public getTopoList(): Observable<any> {
        return this._restApi.getDataByGetReq(`${URL.GET_TOPOLOGY_LIST}`);
    }
}
