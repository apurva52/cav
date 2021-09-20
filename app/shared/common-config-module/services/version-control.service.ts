import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CavConfigService } from '../../../pages/tools/configuration/nd-config/services/cav-config.service';
import * as URL from '../constants/version-control-constant';
import { map } from 'rxjs/operators';



@Injectable()
export class VersionControlService{
    serviceUrl;
    constructor(private http : HttpClient , private productConfig : CavConfigService){
    this.serviceUrl = this.productConfig.getINSPrefix() + "/ProductUI/productSummary/ScenarioWebService/versionControl/";
    }

    getDataForVersionLogs(data){
        
     return this.http.post(this.serviceUrl + URL.GET_VERSION_LOGS, data).pipe(map(res=><any>res));
    }

    getVersionDiff(data){
        return this.http.post(this.serviceUrl + URL.GET_VERSION_DIFF, data).pipe(map(res=><any>res));
    }

    getModifiedFiles(data){
        
        return this.http.post(this.serviceUrl + URL.GET_VERSION_LOGS, data).pipe(map(res=><any>res));
    
    }
    getModifiedFilesForDropDown(data){
    
        return this.http.post(this.serviceUrl + URL.GET_MODIFIED_FILES, data).pipe(map(res=><any>res));
    }
      getRevertFiles(data){
        console.log("hello angular",data);
        return this.http.post(this.serviceUrl + URL.GET_REVERT, data).pipe(map(res=><any>res));
        
    }
    getShowStatus(data){
        return this.http.post(this.serviceUrl + URL.SHOW_STATUS, data).pipe(map(res=><any>res));
    }

    getModifiedFilesStatus(data){
        return this.http.post(this.serviceUrl + URL.GET_MODIFIED_FILES_STATUS,data).pipe(map(res=><any>res));
    }

}


