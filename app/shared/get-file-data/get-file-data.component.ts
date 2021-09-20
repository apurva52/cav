import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FileUpload, MessageService, SelectItem, ConfirmationService } from 'primeng';
import { SessionService } from 'src/app/core/session/session.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { DownloadFileManagerService } from '../download-file/services/download-file.service';
import { FileManagerComponent } from '../file-manager/file-manager.component';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { environment } from 'src/environments/environment';
import { FileUploadExtService } from '../file-manager/service/upload-file-ext.service';
import { threadId } from 'worker_threads';
import { FileImportService } from '../dashboard/widget/types/file-import/service/file-import.service';

@Component({
  selector: 'app-get-file-data',
  templateUrl: './get-file-data.component.html',
  styleUrls: ['./get-file-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GetFileDataComponent
  extends PageDialogComponent
  implements OnInit {
  @ViewChild('fileManager', { read: FileManagerComponent })
  fileManager: FileManagerComponent;

  fileAndFolderPath = '';

  isDownloadFile: string = 'downloadfile';
  toUploadFiles: boolean = false;

  uploadUrl: string = '';
  uploaddata: FileUpload[];

  error: boolean = false;
  empty: boolean = false;
  errorMessage: 'Data Not Available';
  loading: boolean = false;

  isUpload: boolean = false;
  fileNote: string = 'Note: File will be downloaded on your system.';

  path: string = 'Path to download file';
  pathTitle = 'Source Path';
  uploadedFiles: any[] = [];

  delimiterList: SelectItem[];
  selectedDelimiter: any =  { label: 'Space ( )', value: ' ' };

  dialogVisible: boolean = false;
  @ViewChild('fileUpload') fileInput;
fileName : any;
  constructor(
    private filemanagerService: DownloadFileManagerService,
    private dialodService: DialogsService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    public confirmation :ConfirmationService,
    private _upload: FileUploadExtService,
    private fileImport : FileImportService
  ) {
    super();
  }

  ngOnInit(): void {
    const me = this;

    me.delimiterList = [
      { label: 'Space ( )', value: ' ' },
      { label: 'Comma (,)', value: ',' },
      { label: 'Pipe(|)', value: '|' },
      { label: 'Other', value: 'Other' },
    ];
  }

  openGetFileDataDialog() {
    const me = this;
    super.show();
    // me.isDownloadFile = 'downloadfile';
    me.fileAndFolderPath = "/home/cavisson/" + this.sessionService.preSession.serverName;
    me.isUpload = true;
    me.fileNote = 'Note: File will be uploaded on given destination path.';
    me.path = 'Path to Upload file';
    me.pathTitle = 'Destination Path';
  }

  close() {
    this.fileAndFolderPath = '';
    super.hide();
  }

  downloadBrowseFile(file, url) {
    let splitPath = file.split('/');
    let fName = splitPath[splitPath.length - 1];
    let path = url + '/netstorm/temp/' + fName;
    if(this.sessionService.preSession.DWNMULFILE) {
      window.open(path);
    }else {
      this.downloadURI(path, fName);
    }
  }

  downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;

    // Because firefox not executing the .click()
    // Hence, We need to create mouse event initialization.
    var clickEvent = document.createEvent('MouseEvent');
    clickEvent.initEvent('click', true, true);

    link.dispatchEvent(clickEvent);
  }

  eventBind(path: String) {
    this.fileAndFolderPath = path + '';
  }

  openUploadDialog() {
    this.fileInput.clear();
     this.fileInput.msgs = "";
    this.toUploadFiles = true;
    //this.uploadUrl = this.uploadUrl = environment.api.core.defaultBase.toString() + environment.api.uploadFile.load.endpoint + "?for=fileExplorer&destination=/home/cavisson/" + this.sessionService.preSession.serverName+"/webapps/sys/webdashboard/layoutFiles/tabularFile/"+this.sessionService.session.cctx.u;
    this.uploadUrl = this.uploadUrl = environment.api.core.defaultBase.toString() + environment.api.dashboard.uploadFile.endpoint + "?userName="+this.sessionService.session.cctx.u;
  }

  onUploadFile(event) {
    const me = this;
    me.toUploadFiles = false;
    for (let file of event.files) {
      me.uploadedFiles.push(file);
     // me.fileName = file.name;
    }
    me.fileName = event.originalEvent.body.file;
   // this.fileAndFolderPath= "/home/cavisson/" + this.sessionService.preSession.serverName+"/webapps/sys/webdashboard/layoutFiles/tabularFile/"+this.sessionService.session.cctx.u;
  }
  onSelect(event,fileUpload){
    let name = event.files[0].name;
    let moduleName = 'tabular-from-file-widget';
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

  getData() {
    const me = this;

    //Write Get Data Logic
    //send file to server
    let data : any = {"filePath":me.fileName,"delimiter":me.selectedDelimiter.value,"uploadFile":true,"userName":me.sessionService.session.cctx.u};
  me.fileImport.setFileImportInfo(data);

    super.hide();
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
                    this.alertMsg( filename + ":  Invalid file type, allowed file types: txt', 'csv', 'xls', 'xlsx', 'text.", "Error");
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

  alertMsg(msg,header) {
    const me = this;
    me.dialogVisible = true;
      me.confirmation.confirm({
        key: 'uploadfile',
        message: msg,
        header: header,
        accept: () => { me.dialogVisible = false; },
        reject: () => { me.dialogVisible = false;},
        rejectVisible:false
      });
      me.cd.detectChanges();
  }

}
