import { Metadata } from './../interfaces/metadata';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
//import { Http, Response} from '@angular/http';
import { Store } from 'src/app/core/store/store';
import { SourceCodeLoadingErrorState } from 'src/app/pages/dashboard-service-req/exception/service/exception.state';
import { environment } from 'src/environments/environment';

@Injectable({providedIn : 'root'})
export class MetadataService extends Store.AbstractService {

  
  private metadata: Metadata;

  refreshMetaData : boolean; 
  path : any;
  base : any;
  // to  keep track , if metadata request is already in pending state
  requestInProgress : boolean;
  // array to keep observer 
  pendingMetadataRequest : any[];
  
  constructor() {
    super();
    this.metadata = null;
    this.base =  environment.api.netvision.base.base;
    this.path = 'netvision/rest/webapi/metadata?access_token=563e412ab7f5a282c15ae5de1732bfd1';
    // to refresh the metadata after every 5 minutes
    // on true, it will nullify the present metadata 
    this.refreshMetaData = false;
    
    this.pendingMetadataRequest = []; 
    // load metadata.
    //this.refreshMetadata(); 
  }
  
  refreshMetadata()
  {
    this.controller.get(this.path,null,this.base).subscribe(response => this.fillMetaData(response));  
  }
  
  getMetadata()
  {
    if(this.refreshMetaData == true){
       this.metadata = null;
       this.refreshMetaData = false;
    }
    return Observable.create(observer => {
      if (this.metadata !== null && this.metadata !== undefined)
      {
          observer.next(this.metadata);
          observer.complete();
      }
      else if(this.requestInProgress == true){
           this.pendingMetadataRequest.push(observer);
      }
      else {
        this.requestInProgress = true;
        // make http requet and then send that
        this.controller.get(this.path,null,this.base).subscribe(response => {
          // set metadata and call observer
          this.fillMetaData(response);
          observer.next(this.metadata);
          observer.complete();
          this.pendingMetadataRequest.forEach(observer => {
            observer.next(this.metadata);
            observer.complete();
          });
          this.pendingMetadataRequest = [];
          this.requestInProgress = false;
        });
      }
    }); 
  }

  fillMetaData(response: any)
  {
     this.metadata = Metadata.getMetaDataObj(response);
     // once the metadata is populated, after every 5 minutes, refreshMetaData flag will turn true to again load the metadata
     let root = this;
     setTimeout(function(){root.refreshMetaData = true},300000);
  }
  
}
