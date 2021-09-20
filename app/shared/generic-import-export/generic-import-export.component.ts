import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { FileManagerComponent } from '../file-manager/file-manager.component';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { SessionService } from 'src/app/core/session/session.service';
import { MessageService, ConfirmationService } from 'primeng';
import { GenericImportExportService } from './services/generic-import-export.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { FileUpload } from '../local-file-upload/service/file-upload';
import { FileUploadLoadingState, FileUploadLoadingErrorState, FileUploadLoadedState } from '../local-file-upload/service/file-upload.state';
import { FileUploadExtService } from '../file-manager/service/upload-file-ext.service';
import { ImportExportLoadedState, ImportExportLoadingErrorState, ImportExportLoadingState } from './services/generic-import-export.state';
import { AppError } from 'src/app/core/error/error.model';
import { ALERT_EXPORT, ALERT_IMPORT, EXPORT_ACTION_LOCAL, EXPORT_ACTION_SERVER, EXPORT_CONFIG_LOCAL, EXPORT_CONFIG_SERVER, EXPORT_MAINTENANCE_LOCAL, EXPORT_MAINTENANCE_SERVER, EXPORT_RULE_LOCAL, EXPORT_RULE_SERVER, IMPORT_ACTION_LOCAL, IMPORT_ACTION_SERVER, IMPORT_CONFIG_LOCAL, IMPORT_CONFIG_SERVER, IMPORT_EXPORT_MODULE_TYPE, IMPORT_MAINTENANCE_LOCAL, IMPORT_MAINTENANCE_SERVER, IMPORT_RULE_LOCAL, IMPORT_RULE_SERVER } from 'src/app/pages/my-library/alert/alert-constants';
import { ConfirmMsg } from './services/generic-import-export.model';
import { IMPORT, IMPORT_DUPLICATE, IMPORT_WITHOUT_DUPLICATE, OK_CODE } from './services/generic-import-export.dummy';
import { AlertRulesService } from 'src/app/pages/my-library/alert/alert-rules/service/alert-rules.service';




@Component({
  selector: 'app-generic-import-export',
  templateUrl: './generic-import-export.component.html',
  styleUrls: ['./generic-import-export.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GenericImportExportComponent extends PageDialogComponent  implements OnInit {
  @ViewChild('fileUpload') fileInput;
  @ViewChild('fileManager', { read: FileManagerComponent })
  fileManager: FileManagerComponent;
  visible: boolean = false;
  fileAndFolderPath = "";
  serverIP: string = "";
  isDownloadFile: string = "";
  toUploadFiles: boolean = false;
  uploadUrl : string = "";
  uploaddata: FileUpload[];
  error: AppError; 
  empty: boolean = false;
  errorMessage: "Data Not Available";
  loading: boolean = false;
  moduleName: string = '';
  moduleType: number;
  filePath: string;
  isUpload: boolean = false;
  fileNote: string = "";
  path: string = "";
  pathTitle = "Source Path"
  uploadedFileName: string = "";
  dialogVisible: boolean = false;
  type: string = "";
  //this will holds the message to display 
  confirmMessage: ConfirmMsg[] = [];
  prefixOfButton: string = "";
  subModuleName: string = "";
  @Output() importedData = new EventEmitter<any>();
  constructor(
    private genericImportExportService: GenericImportExportService, 
    private sessionService: SessionService, 
    private messageService: MessageService,
    private cd: ChangeDetectorRef, 
    public confirmation :ConfirmationService, 
    private _upload: FileUploadExtService,
    public alertRuleService: AlertRulesService) {
    super();
   }

  ngOnInit(): void {
    const me = this;
  }

//generic method to open the Import Export Dialog box 
  openImportExportDialog(subModuleName?: string, msgPrefix?: string,  imEx?: number,moduleName?: any, filePath?:string) {
    const me =this;
    me.isDownloadFile = "";
    me.type = "";
    me.prefixOfButton = msgPrefix;
    me.subModuleName = subModuleName;
    me.moduleName = moduleName;
    me.filePath = filePath;
    if (imEx == ALERT_IMPORT){
      me.isUpload = true;
      me.visible = false;
      me.fileNote = "Note: Import Format Supported is 'json'";
      me.pathTitle = "Destination Path";
      me.isDownloadFile = "importLocal";
      me.fileAndFolderPath ="/home/cavisson/" + this.sessionService.preSession.serverName+filePath;
      me.uploadUrl = environment.api.core.defaultBase.toString() + environment.api.uploadFile.load.endpoint + "?for=fileExplorer&destination=" + me.fileAndFolderPath;
      me.onChangeRadioButton();
    }
    else if (imEx == ALERT_EXPORT){
      me.fileAndFolderPath = "/home/cavisson/" + this.sessionService.preSession.serverName+filePath;
      me.isDownloadFile = "exportLocal";
      me.type = "exportLocal";
      me.visible = true;
      me.isUpload = false;
      me.fileNote = "Note: File will be exported.";
      me.pathTitle = "Source Path";
      me.submit(0);
    }
  }

  close() {
    this.fileAndFolderPath = "";
    this.visible = false;
  }

  //method to dynamically change with the change in radio button
  onChangeRadioButton(){
    const me = this;

    if(me.isDownloadFile == "importServer"){
      me.type = "importServer";
      me.fileNote = "Note: Import Format Supported is 'json'";
    }else if(me.isDownloadFile == "importLocal"){
       me.type = "importLocal";
       me.openUploadDialog();
       me.fileNote = "Note: Import Format Supported is 'json'";
    }
    else if(me.isDownloadFile == "exportServer"){
      me.type = "exportServer";
      me.fileNote = "Note: File will be exported on the given path.";
    }
    else if(me.isDownloadFile == "exportLocal"){
      me.type = "exportLocal";

      me.fileNote = "Note: File will be exported on the System.";
    }
  }

  //generic method to be called on OK button
  submit(impOpType: number){
    const me = this;
    if(impOpType > 0)
      me.genericImportExportService.request.impOpType = impOpType;
    else
      me.genericImportExportService.request.impOpType = IMPORT;
    me.genericImportExportService.request.opType = me.getOpType();
    if(me.type == "importLocal"){
      me.genericImportExportService.import(me.uploadedFileName).subscribe(
        (state: Store.State) => {
          if(state instanceof ImportExportLoadingState){
            me.onImportExportLoading();
          }
          if(state instanceof ImportExportLoadedState){
            me.onImportExportLoaded(state);
            me.visible = false;            
          }
        },
        (state: ImportExportLoadingErrorState) => {
          me.onImportExportLoadingError(state);
        }
      );
    }
    if(me.type == "importServer"){
      me.genericImportExportService.import(me.uploadedFileName).subscribe(
        (state: Store.State) => {
          if(state instanceof ImportExportLoadingState){
            me.onImportExportLoading();
          }
          if(state instanceof ImportExportLoadedState){
            me.onImportExportLoaded(state);
            me.visible = false;
          }
        },
        (state: ImportExportLoadingErrorState) => {
          me.onImportExportLoadingError(state);
        }
      );
    }
    if(me.type == "exportLocal"){
      me.genericImportExportService.export().subscribe(
        (state: Store.State) => {
          if(state instanceof ImportExportLoadingState){
            me.onImportExportLoading();
          }
          if(state instanceof ImportExportLoadedState){
            me.onImportExportLoaded(null);  
            me.alertRuleService.isHideProgress = true;
            me.messageService.add({ severity: 'success', summary: 'Success', detail: " The file " + me.genericImportExportService.exportedFile + " exported successfully to local machine."});
            me.visible = false;
            
          }
        },
        (state: ImportExportLoadingErrorState) => {
          me.onImportExportLoadingError(state);
        }
      );
      me.visible = false;
    }
    if(me.type == "exportServer"){
      me.genericImportExportService.request.serverIP = me.serverIP;
      me.genericImportExportService.request.path = me.path;
      me.genericImportExportService.export().subscribe(
        (state: Store.State) => {
          if(state instanceof ImportExportLoadingState){
            me.onImportExportLoading();
          }
          if(state instanceof ImportExportLoadedState){
            me.onImportExportLoaded(null);
            me.messageService.add({ severity: 'success', summary: 'Success', detail: me.genericImportExportService.exportedFile+' successfully exported to ' +me.serverIP  +' at path ' + me.path  });
            me.visible = false;
            
          }
        },
        (state: ImportExportLoadingErrorState) => {
          me.onImportExportLoadingError(state);
        }
      );
    }
  }
  getOpType(){
    const me = this;
    if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_MAINTENANCE){
      if(me.type == "importLocal"){
        return IMPORT_MAINTENANCE_LOCAL;
      }
      else if(me.type == "importServer"){
        return IMPORT_MAINTENANCE_SERVER;
      }
      else if(me.type == "exportLocal"){
        return EXPORT_MAINTENANCE_LOCAL;
      }
      else if(me.type == "exportServer"){
        return EXPORT_MAINTENANCE_SERVER;
      }
    }
    if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_RULES){
      if(me.type == "importLocal"){
        return IMPORT_RULE_LOCAL;
      }
      else if(me.type == "importServer"){
        return IMPORT_RULE_SERVER;
      }
      else if(me.type == "exportLocal"){
        return EXPORT_RULE_LOCAL;
      }
      else if(me.type == "exportServer"){
        return EXPORT_RULE_SERVER;
      }
    }
    if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_ACTION){
      if(me.type == "importLocal"){
        return IMPORT_ACTION_LOCAL;
      }
      else if(me.type == "importServer"){
        return IMPORT_ACTION_SERVER;
      }
      else if(me.type == "exportLocal"){
        return EXPORT_ACTION_LOCAL;
      }
      else if(me.type == "exportServer"){
        return EXPORT_ACTION_SERVER;
      }
    }
    if(me.moduleType == IMPORT_EXPORT_MODULE_TYPE.ALERT_CONFIG){
      if(me.type == "importLocal"){
        return IMPORT_CONFIG_LOCAL;
      }
      else if(me.type == "importServer"){
        return IMPORT_CONFIG_SERVER;
      }
      else if(me.type == "exportLocal"){
        return EXPORT_CONFIG_LOCAL;
      }
      else if(me.type == "exportServer"){
        return EXPORT_CONFIG_SERVER;
      }
    }

  }

  eventBind(path:string){
    const me = this;
    me.uploadedFileName = path ;
   }

   openUploadDialog(){
     this.fileInput.clear();
     this.fileInput.msgs = "";
    this.toUploadFiles = true;
    //this.uploadUrl = environment.api.core.defaultBase.toString() + environment.api.uploadFile.load.endpoint + "?for=fileExplorer&destination=" + this.fileAndFolderPath;
  }

  onUploadFile(event){
    const me = this;
    me.toUploadFiles = false;
    for(let file of event.files) {
      me.uploadedFileName = file.name;
  }
    
    this.messageService.add({
      severity: 'success',
      summary: "Success",
      detail: "File(s) uploaded successfully"
    });

    me.submit(0);
   
  }

  onSelect(event,fileUpload){
    let name = event.files[0].name;
    let moduleName = this.moduleName;
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
    me.error = null;
    me.loading = false;
    me.fileAndFolderPath = "";
  }

  onUploadLoadingErrorState(state: FileUploadLoadingErrorState){
    const me = this;
    me.uploaddata = null;
    me.error = state.error;
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

  /* onClear(files){
    files.clear();
  } */

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
                    this.alertMsg( filename + ":  Invalid file type, Allowed file types: "+finalExt, "Error");
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

  public onImportExportLoading() {
    const me = this;
    me.error = null;
    me.loading = true;

  }

  public onImportExportLoadingError(state: ImportExportLoadingErrorState) {
    const me = this;
    me.error = state.error;
    me.loading = false;
    me.uploadedFileName = "";
    me.visible = false;
    me.messageService.add({ severity: 'error', summary: 'Error', detail: "Unable to map uploaded JSON file to " + me.subModuleName + " Object. Please verify JSON file" });
  }

  public onImportExportLoaded(state: ImportExportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    if (state){
      if (state.data.status && state.data.status.code == OK_CODE) {
        me.importedData.emit(state.data);
        me.messageService.add({ severity: 'success', summary: 'Success', detail: state.data.status.msg });
      }
      else if (state.data.status && state.data.status.code == IMPORT_DUPLICATE){
        me.uploadedFileName = me.uploadedFileName + ";" + state.data.status.msg;
        this.showConfirmMessage("Confirmation", true, me.subModuleName + " - " + state.data.status.msg + " are already present. Do you still want to", false, false, false, false, false, 375, 126)
      } 
      else if (state.data.configStatus && state.data.configStatus[0] != null  && state.data.configStatus[0].status && state.data.configStatus[0].status.code == 200){
        me.importedData.emit(state.data);
        me.messageService.add({ severity: 'success', summary: 'Success', detail: "Successfully imported the selected file(s)."});
      }else{
        if (state.data.status)
          me.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.status.msg });
        else if (state.data.configStatus)
          me.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.configStatus[0].status.msg });
      }      
    }
  }

  showConfirmMessage(header: string, display: boolean, body: string, ok: boolean, cancel: boolean, apply: boolean, yes: boolean, no: boolean, width: number, height: number) {
    const me = this;
    me.confirmMessage.splice(0);
    let mess = { header: header, display: display, body: body, ok: ok, cancel: cancel, yes: yes, no: no, apply: apply, width: width, height: height };
    me.confirmMessage.push(mess);
  }

  closeImport(){
    const me = this;
    me.confirmMessage[0].display = false;
  }

  saveImport(saveAll: boolean) {
    const me = this;
    me.confirmMessage[0].display = false;
    if (saveAll) {
      me.submit(IMPORT_DUPLICATE);
    }
    else {
      me.submit(IMPORT_WITHOUT_DUPLICATE);
    }
  }
}
