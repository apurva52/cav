import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { FileManagerComponent } from '../file-manager/file-manager.component';
import { ThemeService } from '../header/themes-menu/service/color-theme.service';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { SessionService } from 'src/app/core/session/session.service';
import { MessageService, ConfirmationService } from 'primeng';
import { DownloadFileManagerService } from './services/download-file.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { InfoData } from '../dialogs/informative-dialog/service/info.model';
import { CONTENT } from './services/download-file.model';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { FileUpload } from '../local-file-upload/service/file-upload';
import { FileUploadLoadingState, FileUploadLoadingErrorState, FileUploadLoadedState } from '../local-file-upload/service/file-upload.state';
import { FileUploadExtService } from '../file-manager/service/upload-file-ext.service';



@Component({
  selector: 'app-download-file',
  templateUrl: './download-file.component.html',
  styleUrls: ['./download-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DownloadFileComponent extends PageDialogComponent  implements OnInit {
  @ViewChild('fileUpload') fileInput;
  @ViewChild('fileManager', { read: FileManagerComponent })
  fileManager: FileManagerComponent;
  content : InfoData
  showDownloadModel: boolean = false;
  fileAndFolderPath = "";
  isDownloadFile: string = "downloadfile";
  toUploadFiles: boolean = false;
  uploadUrl : string = "";
  uploaddata: FileUpload[];
  error: boolean = false;
  empty: boolean = false;
  errorMessage: "Data Not Available";
  loading: boolean = false;
  isUpload: boolean = false;
  fileNote: string = "Note: File will be downloaded on your system.";
  path: string = "Path to download file";
  pathTitle = "Source Path"
  uploadedFiles: any[] = [];
  dialogVisible: boolean = false;

  constructor(private filemanagerService: DownloadFileManagerService, private sessionService: SessionService, private messageService: MessageService,
    private cd: ChangeDetectorRef, public confirmation :ConfirmationService, private _upload: FileUploadExtService) {
    super();
   }

  ngOnInit(): void {
    const me = this;
    me.content = CONTENT;
  }

  openDownloadFileDialog() {
    const me =this;
    me.fileAndFolderPath = "";
    me.showDownloadModel = true;
    me.isDownloadFile = "downloadfile"
    me.isUpload = false;
    me.fileNote = "Note: File will be downloaded on your system.";
    me.path = "Path to download file";
    me.pathTitle = "Source Path";
  }

  close() {
     this.fileAndFolderPath = "";
    this.showDownloadModel = false;
  }

  downloadFile(){
    if(this.fileAndFolderPath == ""){
      this.alertMsg("Please select any file", "Error");
      return;
    }
    else{
      let files: string[] = this.fileAndFolderPath.split(";");

            files.forEach(ele=>{

                let path =  "/home/cavisson/"+ this.sessionService.preSession.serverName;

                let file = ele.split(path)[1];
                this.filemanagerService.download(file).subscribe(res => {
                  let url = window.location.protocol + "//"+ window.location.hostname +":"+window.location.port;
                if(res['data']['status']['code'] == 0){
                  // this.showSuccess("File downloaded successfully");
                  this.downloadBrowseFile(file, url);

                 }
                  else{
                    this.alertMsg("Error in downloading file", "Error");
                    return;
                  }
                })
               // this.close();
            });
            this.messageService.add({
              severity: 'success',
              summary: "File downloaded successfully"
            });
    }
  }

  downloadBrowseFile(file,url){

    let splitPath = file.split("/");
    let fName = splitPath[splitPath.length - 1];
    let path = url + "/netstorm/temp/" + fName;
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

  eventBind(path:String){
    this.fileAndFolderPath = path + "";
   }

   openUploadDialog(){
     this.fileInput.clear();
     this.fileInput.msgs = "";
    this.toUploadFiles = true;

    this.uploadUrl = environment.api.core.defaultBase.toString() + environment.api.uploadFile.load.endpoint + "?for=fileExplorer&destination=" + this.fileAndFolderPath;
  }

  onUploadFile(event){
    const me = this;
    me.toUploadFiles = false;
    for(let file of event.files) {
      me.uploadedFiles.push(file);
  }

    this.messageService.add({
      severity: 'success',
      summary: "File(s) uploaded successfully"
    });
    // me.load(this.fileAndFolderPath, this.isOpenFromDashboard);
  }

  onSelect(event,fileUpload){
    let name = event.files[0].name;
    let moduleName = 'scenario';
     /* function call for checking whether file has valid extension or not*/
    let extensionResult = this.extensionValidation(name,moduleName);
    if (extensionResult === 0) {
      this.toUploadFiles = false;
      fileUpload.clear();
      return;
    }
     /* function call for checking whether file has double dots in its name or not */
     let doubleDotValidation = this.doubleDotValidation(name,moduleName);
     if (doubleDotValidation === 0) {
       this.toUploadFiles = false;
       fileUpload.clear();
       return;
     }
     /* function call for checking that file name does not consist of invalid special characters */
     let characterResult = this.specialCharacterValidation(name,moduleName);
     if (characterResult === 1) {
       this.toUploadFiles = false;
       fileUpload.clear();
       return;
   }
  this.toUploadFiles = true;

  }

  onLoadedUploadFile(state: FileUploadLoadedState){
    const me = this;
    me.uploaddata = state.data;
    me.empty = false;
    me.error = false;
    me.loading = false;
    me.fileAndFolderPath = "";
  }

  onUploadLoadingErrorState(state: FileUploadLoadingErrorState){
    const me = this;
    me.uploaddata = null;
    me.error = true;
    me.empty = false;
    me.loading = true;
  }

  onUploadLoadingState(state: FileUploadLoadingState){
    const me = this;
    me.uploaddata = null;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

    onChangeRadioButton(){
      const me = this;
      if(me.isDownloadFile == "downloadfile"){
         me.fileAndFolderPath = "";
         me.isUpload = false;
         me.fileNote = "Note: File will be downloaded on your system.";
         me.path = "Path to download file";
         me.pathTitle = "Source Path";
      }else{
         me.fileAndFolderPath = "/home/cavisson/" + this.sessionService.preSession.serverName;
         me.isUpload = true;
         me.fileNote = "Note: File will be uploaded on given Destination path.";
         me.path = "Path to upload file";
         me.pathTitle = "Destination Path"
      }
    }

   showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  onClear(files){
    files.clear();
  }

  alertMsg(msg,header) {
    const me = this;
    me.dialogVisible = true;
      me.confirmation.confirm({
        key: 'downloadfile',
        message: msg,
        header: header,
        accept: () => { me.dialogVisible = false; },
        reject: () => { me.dialogVisible = false;},
        rejectVisible:false
      });
      me.cd.detectChanges();
  }

  extensionValidation(filename, moduleName) {
    let finalExt = this._upload.fileExtensions(moduleName);
    let result;
    let count = 0;
    let index = filename.lastIndexOf('.');
    let ext = filename.substring(index + 1);
        if (ext === 'gz') {
            result = this.targzValidation(filename,moduleName);
            if (result === 0) {
             return 0;
             }
         }
         if (ext !== 'gz') {
             for (let i=0; i<finalExt.length; i++) {
                 if (ext === finalExt[i]) {
                     count = 1;
                    }
             }
             if (count === 0) {
                let extss = this.extensionsForAlert(finalExt,moduleName);
                    // this.showError('Invalid filename found as file extension '+ext+' is not a valid extension.The supported extensions are '+extss);
                    this.alertMsg( filename + ":  Invalid file type, allowed file types: .pem,.cer,.crt, .p7b,.p7r,.p12,.pfx.", "Error");
                    return 0;
             }
         }
    }

    /* check for .tar.gz extension to be valid and no '.' character to be present in file name */
    targzValidation(filename,moduleName) {
      let doubleExtension = ['.tar.gz'];
      let count = 0 ;
      /* check whether filename ends with .tar.gz */
      if (filename.endsWith(doubleExtension[0])) {
          let newFileName = filename.split('.tar.gz');
          let finalName = newFileName[0];
          /* check for multiple '.' character in file name*/
          for (let i = 0; i < finalName.length; i++) {
              if (finalName[i] === '.') {
                  count++;
              }
          }
          if (count !== 0) {
              // this.showError("Invalid filename found.The filename should not contain multiple '.' characters");
              this.alertMsg("Invalid filename found.The filename should not contain multiple '.' characters", "Error")
              return 0;
          }
      }
  }

  /* for getting string of extensions to be shown in alert*/
  extensionsForAlert (finalExt, moduleName) {
    let extString = "'"+finalExt[0]+"'"+" ";
    if (moduleName === 'access-log') {
        return extString;
    } else {
        for (let i=1; i<finalExt.length-1; i++) {
            extString += "'"+finalExt[i]+"'"+" ";
        }
        extString = extString + "'"+ finalExt[finalExt.length-1] + "'";
        return extString;
    }
  }

  /* check for valid special characters in file name */
  specialCharacterValidation(filename,moduleName) {
    let specialChar =  /[!"#$%&'()*+,/:;<=>?@\[\]^`{|}\\~]/;
    if (specialChar.test(filename)){
        this.alertMsg("Invalid filename found. The filename can contain characters from (0-9) and special characters like  '.'  ,  '-'  or  '_' ", "Error");
        return 1;
    }
  }

   /* check for multiple dots in file name, not ending with .tar.gz */
   doubleDotValidation(filename,moduleName) {
    let doubleExtension = ['.tar.gz'];
    let count = 0 ;
    let counts = 0;
    /* check whether filename ends with .tar.gz */
    this.targzValidation(filename,moduleName);
    /* check for multiple dots in file name, not ending with .tar.gz */
    if (!filename.endsWith(doubleExtension[0])) {
        let index = filename.lastIndexOf('.');
        let name = filename.substring(0, index);
        for (let i = 0; i < name.length; i++) {
            if (name[i] === '.') {
                counts++;
            }
        }
        if (counts !== 0) {
            this.alertMsg("Invalid filename found.The filename should not contain multiple '.' characters", "Error");
            return 0;
        }
    }
  }
}
