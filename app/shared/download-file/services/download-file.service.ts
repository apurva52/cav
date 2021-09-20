import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { FileDownloadLoadedState, FileDownloadLoadingErrorState } from './download-file.state';
import { FileUploadExtService } from '../../file-manager/service/upload-file-ext.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { FileUploadLoadedState, FileUploadLoadingErrorState } from '../../local-file-upload/service/file-upload.state';

@Injectable({
  providedIn: 'root',
})
export class DownloadFileManagerService extends Store.AbstractService {
  private defaultPath: string = '/home/cavisson/';
  /*Observable sources for file explorer OK event.*/
  private fileExplorerBroadcaster = new Subject<string>();
  constructor(
    private sessionService: SessionService, private _upload: FileUploadExtService, private dialodService: DialogsService){
      super();
    }

download(rootPath) : Observable<Store.State>{
  const me = this;
  const output = new Subject<Store.State>();
  const path = environment.api.downloadFile.load.endpoint;
  console.log("-------downloaded file", rootPath);

  me.controller.post(path, rootPath).subscribe(
    (data) => {
      output.next(new FileDownloadLoadedState(data));
      output.complete();
    },
    (e: any) => {
      output.error(new FileDownloadLoadingErrorState(e));
      output.complete();

      me.logger.error('Error in uploading file', e);
    }
  )

  return output;
}

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
