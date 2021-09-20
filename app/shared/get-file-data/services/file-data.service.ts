import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { FileUploadLoadedState, FileUploadLoadingErrorState } from './file-data.state';

@Injectable({
    providedIn: 'root',
  })

export class UploadFileDataService extends Store.AbstractService{
upload(rootPath) : Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    // const path = environment.api.uploadFile.load.endpoint + "?for=fileExplorer&destination=" + rootPath;
    me.controller.post(rootPath).subscribe(
      (data) => {
        output.next(new FileUploadLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new FileUploadLoadingErrorState(e));
        output.complete();
  
        me.logger.error('Error in uploading file', e);
      }
    )
  
    return output;
  }
}