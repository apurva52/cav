import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
//import { MonConfigurationService } from '../../monitor-up-down-status/services/mon-configuration.service';
//import { MonDataService } from '../../monitor-up-down-status/services/mon-data.service';
//import { RestApiService } from '../../monitor-up-down-status/services/rest-api.service';

@Injectable()
export class UtilityService {

    constructor() { }

    static createDropdown(list: any): SelectItem[] {
        let selectItemList: SelectItem[] = [];

        for (let index in list) {
            if (list[index].indexOf("--Select") != -1) {
                selectItemList.push({ label: list[index], value: '' });
            }
            else {
                selectItemList.push({ label: list[index], value: list[index] });
            }
        }

        return selectItemList;
    }

    static createListWithKeyValue(arrLabel: string[], arrValue: string[]): SelectItem[] {
        let selectItemList = [];

        for (let index in arrLabel) {
            selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
        }

        return selectItemList;
    }

    // getServerList(tierId) {
    //     let url =  this.monDataService.getserviceURL() + `getServerList` + "?topoName=" + this.monConfigurationService.getTopoName()
    //                + "&tierId=" + `${tierId}` + "&productKey="+this.monDataService.getProductKey();
    //     return this._restApi.getDataByGetReq(url);
    // }
}



