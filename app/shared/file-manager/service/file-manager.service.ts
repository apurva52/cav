import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import {
  FileManagerLoadingState,
  FileManagerLoadedState,
  FileManagerLoadingErrorState,
  NewFolderLoadedState,
  NewFolderLoadingErrorState,
} from './file-manager.state';
import { FileManager, FileManagerLoadPayload } from './file-manager.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { FileUploadLoadedState, FileUploadLoadingErrorState } from '../../local-file-upload/service/file-upload.state';
import { FileUploadExtService } from './upload-file-ext.service';
import { MessageService } from 'primeng';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService extends Store.AbstractService {
  private defaultPath: string = '/home/cavisson/';
  /*Observable sources for file explorer OK event.*/
  private fileExplorerBroadcaster = new Subject<string>();
  constructor(
    private sessionService: SessionService, private _upload: FileUploadExtService, private messageService: MessageService){
      super();
    }

  load(rootPath: string , isOpenFromDashboard:boolean): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new FileManagerLoadingState());
    }, 0);

    const path = environment.api.fileManager.load.endpoint;

    const payload: FileManagerLoadPayload = {
      path: rootPath,
      cctx: me.sessionService.session.cctx,
      callFromAlert: false,
      multiDc: false,
      type: "dirPath"
    };

    me.controller.post(path, payload).subscribe(
      (data) => {
        if(!isOpenFromDashboard){
        var filterFolderData = data.data.filter(obj=> {return !obj.isFile});
        data.data = filterFolderData;
        }
        if(data.data){
          output.next(new FileManagerLoadedState(data.data.sort(this.sortbyDirAndName)));
        }
        else{
          output.next(new FileManagerLoadedState(data));
        }
        output.complete();
      },
      (e: any) => {
        output.error(new FileManagerLoadingErrorState(e));
        output.complete();

        me.logger.error('File Manager Directory Tree loading failed', e);
      }
    );

    return output;
  }

  public sortbyDirAndName(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (a.isDir > b.isDir) { return -1; }
    if (a.isDir < b.isDir) { return 1; }
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  }

  newFolder(rootPath){
  const me = this;
  const output = new Subject<Store.State>();
  const path = environment.api.newFolder.load.endpoint;
  const payload = {
    type : "dirWithPath",
    cctx: me.sessionService.session.cctx,
    newPath: rootPath,
    action : "createFolder"
  };

  me.controller.post(path, payload).subscribe(
    (data) => {
      output.next(new NewFolderLoadedState(data));
      output.complete();
    },
    (e: any) => {
      output.error(e);
      output.complete();

      me.logger.error('File Manager Directory Tree loading failed', e);
    }
  )

  return output;
}

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

// extensionValidation(filename, moduleName) {
//   let finalExt = this._upload.fileExtensions(moduleName);
//   let result;
//   let count = 0;
//   let index = filename.lastIndexOf('.');
//   let ext = filename.substring(index + 1);
//       if (ext === 'gz') {
//           result = this.targzValidation(filename,moduleName);
//           if (result === 0) {
//            return 0;
//            }
//        }
//        if (ext !== 'gz') {
//            for (let i=0; i<finalExt.length; i++) {
//                if (ext === finalExt[i]) {
//                    count = 1;
//                   }
//            }
//            if (count === 0) {
//               let extss = this.extensionsForAlert(finalExt,moduleName);
//                   // this.showError('Invalid filename found as file extension '+ext+' is not a valid extension.The supported extensions are '+extss);
//                   this.messageService.add({
//                     severity: 'Error',
//                     summary: "Invalid filename found as file extension '+ext+' is not a valid extension.The supported extensions are '+extss"
//                   });
//                   return;
//            }
//        }
//   }

//   /* check for .tar.gz extension to be valid and no '.' character to be present in file name */
//   targzValidation(filename,moduleName) {
//     let doubleExtension = ['.tar.gz'];
//     let count = 0 ;
//     /* check whether filename ends with .tar.gz */
//     if (filename.endsWith(doubleExtension[0])) {
//         let newFileName = filename.split('.tar.gz');
//         let finalName = newFileName[0];
//         /* check for multiple '.' character in file name*/
//         for (let i = 0; i < finalName.length; i++) {
//             if (finalName[i] === '.') {
//                 count++;
//             }
//         }
//         if (count !== 0) {
//             // this.showError("Invalid filename found.The filename should not contain multiple '.' characters");
//             this.messageService.add({
//               severity: 'Error',
//               summary: "Invalid filename found.The filename should not contain multiple '.' characters"
//             });
//             return;
//         }
//     }
// }

// /* for getting string of extensions to be shown in alert*/
// extensionsForAlert (finalExt, moduleName) {
//   let extString = "'"+finalExt[0]+"'"+" ";
//   if (moduleName === 'access-log') {
//       return extString;
//   } else {
//       for (let i=1; i<finalExt.length-1; i++) {
//           extString += "'"+finalExt[i]+"'"+" ";
//       }
//       extString = extString + "'"+ finalExt[finalExt.length-1] + "'";
//       return extString;
//   }
// }

showSuccess(msg) {
  this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
}

showError(msg) {
  this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
}

}
