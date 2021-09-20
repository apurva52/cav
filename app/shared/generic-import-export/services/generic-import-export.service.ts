import { EventEmitter, Injectable, Output } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { ImportExportLoadedState, ImportExportLoadingErrorState } from './generic-import-export.state';
import { MessageService } from 'primeng';
import { EXPORT_ACTION_LOCAL,EXPORT_CONFIG_LOCAL,EXPORT_RULE_LOCAL,IMPORT_EXPORT_MODULE_TYPE, EXPORT_MAINTENANCE_LOCAL} from 'src/app/pages/my-library/alert/alert-constants';
import { FileDownload } from './generic-import-export.model';

@Injectable({
  providedIn: 'root',
})
export class GenericImportExportService extends Store.AbstractService {
  request: any;
  opType: number;
  selectedRows: any[];
  moduleType: number;
  exportedFile: string;
  constructor(
    private sessionService: SessionService,
    private messageService: MessageService){
      super();
    }

download(rootPath) : Observable<Store.State>{
  const me = this;
  const output = new Subject<Store.State>();
  const path = environment.api.downloadFile.load.endpoint;
  me.controller.post(path, rootPath).subscribe(
    (data) => {
      output.next(new ImportExportLoadedState(data));
      output.complete();
    },
    (e: any) => {
      output.error(new ImportExportLoadingErrorState(e));
      output.complete();
      me.logger.error('Error in uploading file', e);
    }
  )
  return output;
}

//this is generic method to upload the file before import
// upload(rootPath) : Observable<Store.State>{
//   const me = this;
//   const output = new Subject<Store.State>();
//   // const path = environment.api.uploadFile.load.endpoint + "?for=fileExplorer&destination=" + rootPath;
//   me.controller.post(rootPath).subscribe(
//     (data) => {
//       output.next(new FileUploadLoadedState(data));
//       output.complete();
//     },
//     (e: any) => {
//       output.error(new FileUploadLoadingErrorState(e));
//       output.complete();

//       me.logger.error('Error in uploading file', e);
//     }
//   )

//   return output;
// }



//Generic Method to handle all the import requests from any component
import(files: string): Observable<Store.State>{
  const me = this;
  const output = new Subject<Store.State>();
  const path = this.makeImportPath(files);
  me.controller.post(path, me.request).subscribe((result: FileDownload) => {
        output.next(new ImportExportLoadedState(result));
        output.complete();
    }, (e: any) => {
        output.error(new ImportExportLoadingErrorState(e));
        output.complete();
        console.log('Import layout loading failed', e);
    });
    return output;
  }

//this is generic method to handle all the export requests from any component.
export(): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    const path = me.makeExportPath();
    me.controller.post(path, me.request).subscribe((result: any) =>
    {
      me.exportedFile = result.exportedFile;
      if(me.request.opType == EXPORT_MAINTENANCE_LOCAL || me.request.opType == EXPORT_RULE_LOCAL || me.request.opType == EXPORT_ACTION_LOCAL || me.request.opType == EXPORT_CONFIG_LOCAL)
        me.downloadFile(result);
      output.next(new ImportExportLoadedState(result));
      output.complete();
    }, (e: any) => {
      output.error(new ImportExportLoadingErrorState(e));
      console.log('Export layout loading failed', e);
      output.complete();
    });
    return output;
}

//generic method to download the exported files to the system
downloadFile(result: any){
  const me = this;
  let file: string = "webapps/common/unifiedConfig/alert/" + result.exportedFile;

  let path = "/home/cavisson/"+ this.sessionService.preSession.serverName;

  //let file = ele.split(path)[1];
  me.download(file).subscribe(res => {
  let url = window.location.protocol + "//"+ window.location.hostname +":"+window.location.port;
  if(res['data']['status']['code'] == 0){
  // this.showSuccess("File downloaded successfully");
  me.downloadBrowseFile(file, url);
  me.messageService.add({
  severity: 'success',
  summary: "File downloaded successfully"
          });
        }
  else{
    return;
      }
    })
  }

  downloadBrowseFile(file,url){

  let splitPath = file.split("/");
  let fName = splitPath[splitPath.length - 1];
  console.log("fName === ", fName);
  let path = url + "/common/unifiedConfig/alert/" + fName;
  if(this.sessionService.preSession.DWNMULFILE) {
    window.open(path);
  }else {
    this.downloadURI(path,fName);
  }

  }

  downloadURI(uri, name)
  {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;

  // Because firefox not executing the .click()
  // Hence, We need to create mouse event initialization.
  var clickEvent = document.createEvent("MouseEvent");
  clickEvent.initEvent("click", true, true);

  link.dispatchEvent(clickEvent);
  }

//Generic method to get Import Path
  makeImportPath(files: string)
  {
    const me = this;
    if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_MAINTENANCE){
     return environment.api.alert.maintenance.import.endpoint+"?file="+files;
    }
    else if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_RULES){
      return environment.api.alert.rule.import.endpoint+"?file="+files;
    }
    else if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_ACTION){
      return environment.api.alert.action.import.endpoint+"?file="+files;
    }
    else if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_CONFIG){
      return environment.api.alert.config.import.endpoint+"?file="+files;
    }
  }

//Generic method to get Export path
  makeExportPath()
  {
    const me = this;
    if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_MAINTENANCE){
      return environment.api.alert.maintenance.export.endpoint;
    }
    else if(me.moduleType ==IMPORT_EXPORT_MODULE_TYPE.ALERT_RULES){
      return environment.api.alert.rule.export.endpoint;
    }
    else if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_ACTION){
      return environment.api.alert.action.export.endpoint;
    }
    else if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_CONFIG){
      return environment.api.alert.config.export.endpoint;
    }
  }

}
