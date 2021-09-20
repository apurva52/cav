import { Metadata } from './../interfaces/metadata';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
//import { Http, Response} from '@angular/http';
import { Store } from  '../../../../../core/store/store';
import { environment } from 'src/environments/environment';

@Injectable({providedIn : 'root'})
export class NVAppConfigService extends Store.AbstractService {

  
  private nvconfig: any;

  refreshConfig : boolean; 
  path : any;
  base: any;
  // to  keep track , if metadata request is already in pending state
  requestInProgress : boolean;
  // array to keep observer 
  pendingConfigRequest : any[];
  
  constructor() {
    super();
    this.nvconfig = null;
    this.base =  environment.api.netvision.base.base;
    this.path = 'netvision/rest/webapi/nvAppConfigService?strOperName=getAppConfigurations&access_token=563e412ab7f5a282c15ae5de1732bfd1&isAdminUser='+localStorage.getItem('isAdminUser');
    // to refresh the metadata after every 5 minutes
    // on true, it will nullify the present metadata 
    this.refreshConfig = false;
    
    this.pendingConfigRequest = []; 
    // load metadata.
    //this.refreshMetadata(); 
  }
 
  refreshMetadata()
  {
    this.controller.get(this.path,null,this.base).subscribe(response => this.fill(response));  
  }
  
  getdata()
  {
    if(this.refreshConfig == true){
       this.nvconfig = null;
       this.refreshConfig = false;
    }
    return Observable.create(observer => {
      if (this.nvconfig !== null && this.nvconfig !== undefined)
      {
          observer.next(this.nvconfig);
          observer.complete();
      }
      else if(this.requestInProgress == true){
           this.pendingConfigRequest.push(observer);
      }
      else {
        this.requestInProgress = true;
        // make http requet and then send that
        this.controller.get(this.path,null,this.base).subscribe(response => {
          // set metadata and call observer
          this.fill(response);
          observer.next(this.nvconfig);
          observer.complete();
          this.pendingConfigRequest.forEach(observer => {
            observer.next(this.nvconfig);
            observer.complete();
          });
          this.pendingConfigRequest = [];
          this.requestInProgress = false;
        });
      }
    }); 
  }

  fill(response: any)
  {
     this.nvconfig = response;
     // once the configuration is populated, after every 5 minutes, refreshMetaData flag will turn true to again load the metadata
     let root = this;
     setTimeout(function(){root.refreshConfig = true},300000);
  }
  
}
