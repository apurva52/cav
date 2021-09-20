import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FileManager, UploadFilePayload, CONTENT } from './service/file-manager.model';
import { FileManagerService } from './service/file-manager.service';
import { Store } from 'src/app/core/store/store';
import {
  FileManagerLoadingState,
  FileManagerLoadedState,
  FileManagerLoadingErrorState,
} from './service/file-manager.state';
import { Dialog } from 'primeng';
import { FormControl } from '@angular/forms';
import { SessionService } from 'src/app/core/session/session.service';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { environment } from 'src/environments/environment';
import { FileUpload } from '../local-file-upload/service/file-upload';
import { FileUploadLoadedState, FileUploadLoadingErrorState, FileUploadLoadingState } from '../local-file-upload/service/file-upload.state';
import { DialogsService } from '../dialogs/dialogs.service';
import { InfoData } from '../dialogs/informative-dialog/service/info.model';
// import { DataTable } from '../../../../../vendors/prime-ng/components/datatable/datatable';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService]
})
export class FileManagerComponent  implements OnInit {
  @ViewChild('dialog', { read: Dialog }) dialog: Dialog;
  @Output() eventBind = new EventEmitter<String>();
  @Output() pathBind = new EventEmitter<String>();
  data: FileManager[];
  content: InfoData
  error: boolean;
  empty: boolean;
  errorMessage = "loading";
  loading: boolean;
  breadcrumb: MenuItem[] = [];
  isVisible: boolean;
  cols: any[];
  value1: string;
  fileAndFolderPath: string = "/home/cavisson/" + this.sessionService.preSession.serverName;
  path : string[] =[];
  txtForNewFolder: string = "";
  msg = [];
  rows: number = 10;
  rowsPerPageOptions: any[] = [10,20,30,40,50];
  displayNewFolderDialog: boolean = false;
  toUploadFiles : boolean = false;
  uploadUrl = "";
  isFileUploader = true;
  isFileUpload: boolean = false;
  moduleName: string = "";
  isOpenFromDashboard = true;
  @ViewChild("files") fileUploadRef;
  dashboardRootPath : string = "/home/cavisson/" + this.sessionService.preSession.serverName+"/webapps/sys/webdashboard/dashboards";
  dashboardRootPath1 : string = "/home/cavisson/" + this.sessionService.preSession.serverName+"/webapps/sys/webdashboard";
  filePath : string ="/home/cavisson/" + this.sessionService.preSession.serverName;
  pathTitle  : string = "Current Dir";
  displayPath : string = "/dashboards"
  // @BlockUI() blockUI: NgBlockUI;
  isBack:boolean = true;
  selectedFilesList: any[] = [];
  uploaddata: FileUpload[];
  selectedFileData : string[] =[];
  backTitle = "Back"
  disabledBackBtn: boolean = false;
  dialogVisible: boolean = false;
  uploadDownTooltip = "Select Path to download";
  @ViewChild('fileExplorer') dtable;
  controllerRootPath : string = "/home/cavisson/" + this.sessionService.preSession.serverName;
  isCallFromRetentionPolicy = false;
  constructor(private fileManagerService: FileManagerService, private messageService : MessageService, private dialogService: DialogsService, private sessionService : SessionService, private cd: ChangeDetectorRef, public confirmation :ConfirmationService) {
    //super();
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'modified', header: 'Modification-Date & Time' },
      { field: 'mime', header: 'Type' },
      { field: 'size', header: 'Size', filter: 'filesize' },
    ];

    this.isVisible = false;
  }

  ngOnInit() {
    const me = this;
    me.content = CONTENT;
  }

  folderName = new FormControl('');

  load(rootPath: string, openFromDashboard:boolean) {
    const me = this;

    me.fileManagerService.load(rootPath,openFromDashboard).subscribe(
      (state: Store.State) => {
        if (state instanceof FileManagerLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof FileManagerLoadedState) {
          me.onLoaded(state,rootPath);
          return;
        }
      },
      (state: FileManagerLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: FileManagerLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: FileManagerLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: FileManagerLoadedState , rootPath) {
    const me = this;
    if(state['data']['status'] != undefined){
      if(state['data']['status']['code'] == 401){
        // me.errorMessage = state.data['status']['msg'];
        me.errorMessage = "Path does not exist";
        //this.dialogService.showInformativeBox("Error", "Path does not exist", "OK");
        this.alertMsg("Path does not exist", "Error");
        return;
      }
    }
    else{
      me.errorMessage = "loading"
    }
    me.dtable.reset();
    (<HTMLInputElement>document.getElementById("searchFile")).value = "";
    me.data = state.data;

    me.empty = !me.data.length;
    me.error = false;
    me.loading = false;
  if(!me.isOpenFromDashboard){
    me.displayPath = rootPath.split(this.dashboardRootPath1)[1];
    if(!me.displayPath){
      me.displayPath = "/dashboards";
    }
    this.pathBind.emit(this.displayPath); 
  }
  if(me.fileAndFolderPath == me.controllerRootPath){
    me.backTitle = "Path is already on root level";
  }
  else{
    me.backTitle = "Back";
  }
    me.cd.detectChanges();
  }

  /*This method shows the list of files inside folder when clicked*/
  onItemClick(i, value,filename) {
    //getting index of currently selected file index based on name
    this.isBack = true;
    this.disabledBackBtn = false;
    if(!this.isOpenFromDashboard){
   if(i.path.split(this.dashboardRootPath)[1].indexOf("/system") == 0){
     return ;
   }
    }
    for (var index = 0; index < this.data.length; index++) {
      if(filename == this.data[index].name)
        i=index;
    }

   if (this.data[i].isDir) {
     this.path.push(this.data[i].name);
     this.fileAndFolderPath  = this.data[i].path;
     if(this.isOpenFromDashboard){
       this.displayPath=this.fileAndFolderPath;
       this.pathBind.emit(this.displayPath); 
     }
     else{
      this.displayPath = this.fileAndFolderPath.split(this.dashboardRootPath1)[1];
      this.pathBind.emit(this.displayPath); 
     }
     this.load(this.fileAndFolderPath, this.isOpenFromDashboard);
   }
   else if(this.data[i].isFile){
    if (value) {
      this.selectedFileData.push(this.data[i].path);
    }
    else if (!value) {
      for (var index = 0; index < this.selectedFilesList.length; index++) {
        if (this.selectedFilesList[index]["path"] == this.data[i]["path"]) {
          this.selectedFileData.push(this.data[i].path);
        }
      }
    }
   }
   this.cd.detectChanges();
 }

 goBack($event) {
  try {
    if(this.fileAndFolderPath === this.dashboardRootPath && !this.isOpenFromDashboard){
      this.disabledBackBtn = true;
      this.messageService.add({
        severity: 'info',
        summary: "Path is already on root level."
      });
      return;
    }
    
    /* Going to previous Path. */
    const arrPath = this.fileAndFolderPath.split('/');
    arrPath.pop();

    this.fileAndFolderPath = arrPath.join('/');
    this.displayPath = this.fileAndFolderPath;
    this.pathBind.emit(this.displayPath); 
    if (this.fileAndFolderPath === '') {
      this.fileAndFolderPath = '/';
    }
    if(this.fileAndFolderPath === this.dashboardRootPath && !this.isOpenFromDashboard){
      this.isBack = false;
    }

    if(this.fileAndFolderPath == this.controllerRootPath){
      this.disabledBackBtn = true;
      this.backTitle = "Path is already on root level";
      
    }
 
    if(!this.isOpenFromDashboard){
      this.displayPath = this.fileAndFolderPath.split(this.dashboardRootPath)[1];
      if(!this.displayPath){
        this.displayPath = "/";
      }
      this.pathBind.emit(this.displayPath); 
    }
    this.load(this.fileAndFolderPath, this.isOpenFromDashboard);
    // this.checkUncheckFiles();
    // this.selectAllChk = this.isAllSelectedFiles();
  
 } catch (e) {
    console.error(e);
  }
}
  /*This method is used for searching files based on user input */
  searchByName(event, searchText) {
    try {
      this.fileAndFolderPath = searchText;
        this.load(this.fileAndFolderPath, this.isOpenFromDashboard);
        if(this.fileAndFolderPath == this.controllerRootPath){
          this.disabledBackBtn = true;
        }
        else{
          this.disabledBackBtn = false;
        }
    } catch (e) {
      console.error(e);
        // this.msgs.push({severity:'info', summary:'Info Message', detail:'Error'});
    }
  }

  private getBreadcrumbCommand(dir: FileManager): (event?: any) => void {
    const me = this;
    const i = me.breadcrumb.length;
    return (event?: any) => {
      me.load(dir.path,me.isOpenFromDashboard);
      const ii = i + 1;
      if (ii < me.breadcrumb.length) {
        me.breadcrumb.splice(ii, me.breadcrumb.length);
      }
    };
  }

  goUp() {
    const me = this;
    const i = me.breadcrumb.length;
    me.breadcrumb.splice(i, me.breadcrumb.length - i);
  }

  open(isFileUploader?:boolean, isUpload?:boolean, moduleName?: string, isRetentionPolicy?:boolean) {
    const me = this;
    me.isVisible = true;
    me.moduleName = moduleName;
    if(!isFileUploader){
      this.fileAndFolderPath = this.dashboardRootPath;
      this.isOpenFromDashboard = false;
      this.isBack = false;
      this.pathTitle ="Directory";
      this.displayPath = "/";
      this.pathBind.emit(this.displayPath); 
      if(this.fileAndFolderPath == this.dashboardRootPath){
        this.disabledBackBtn = true;
      }
    }
    else{
      this.isOpenFromDashboard = true;
      this.fileAndFolderPath = this.filePath;
      this.isFileUpload = isUpload;
      this.txtForNewFolder = "";
      this.isBack = true;
      this.pathTitle = "Current Directory";
      this.displayPath = this.fileAndFolderPath;
      this.pathBind.emit(this.displayPath); 
      this.selectedFileData = [];
      this.isCallFromRetentionPolicy = isRetentionPolicy;
      if(this.fileAndFolderPath == this.controllerRootPath){
        this.disabledBackBtn = true;
      }
      if(isUpload){
        this.uploadDownTooltip = "Select Path to upload";
      }
      else{
        this.uploadDownTooltip = "Select Path to download";
      }
    }
    this.colsData(this.isOpenFromDashboard);
    me.load(this.fileAndFolderPath, this.isOpenFromDashboard);
    if(me.breadcrumb.length >0){
    me.breadcrumb[0].command();
  }

  }

  showDialog() {
    const me = this;
    me.displayNewFolderDialog = true;
  }

  cancel() {
    const me = this;
    me.txtForNewFolder = "";
    me.displayNewFolderDialog = false;
  }

  closeDialog(){
       this.isVisible = false;
      }

  createFolder() {
    let path : string = this.fileAndFolderPath.split(this.dashboardRootPath)[1];
    this.eventBind.emit(path);
    this.pathBind.emit(this.displayPath); 
    this.isVisible = false;
  }

  addFolder(){
    try {
    //  this.txtForNewFolder = "";
     if(this.txtForNewFolder == "")
       {
        //this.alertMsg("Field cannot be empty", "Error");
        this.messageService.add({
          severity: 'error',
          summary: "Field cannot be empty"
        })
        return;
     }else if (this.txtForNewFolder.startsWith('_') || /^[0-9]/.test(this.txtForNewFolder)){
      this.messageService.add({
        severity: 'error',
        summary: "Folder name should start with alphabet."
      })
      return;
     }
     if (/[-!$%^&*()+|~=`{}:/<>?,.@# ]/g.test(this.txtForNewFolder) || this.txtForNewFolder.includes('[') || this.txtForNewFolder.includes(']')) {
      //this.dialogService.showInformativeBox("Error","Please Enter valid folder name", "OK");
      //this.alertMsg("Please Enter valid folder name", "Error");
      this.messageService.add({
        severity: 'error',
        summary: "Please Enter valid folder name"
      })
      return;
       }
     for (var matchIndex = 0; matchIndex < this.data.length; matchIndex++) {
        if(this.txtForNewFolder == this.data[matchIndex]['name'])
        {
        //  this.fileManagerService.showError("Folder name already exists, specify another name");
        //this.dialogService.showInformativeBox("Error", "Folder name already exists, specify another name", "OK");
        //this.alertMsg("Folder name already exists, specify another name", "Error");
        this.messageService.add({
          severity: 'error',
          summary: "Folder name already exists, specify another name"
        });
        return;
        }
     }

         if (this.fileAndFolderPath.charAt(this.fileAndFolderPath.length - 1) == "/") {
           this.fileManagerService.newFolder(this.fileAndFolderPath + this.txtForNewFolder).subscribe(res => {
            //  this.fileManagerService.showError("New Folder created successfully");
            this.messageService.add({
              severity: 'success',
              summary: "New Directory created successfully"
            });
             this.load(this.fileAndFolderPath, this.isOpenFromDashboard);
           },
             error => (console.log("error = ", error))
           );
         }
         else {
           this.fileManagerService.newFolder(this.fileAndFolderPath + "/" + this.txtForNewFolder).subscribe(res => {
            this.messageService.add({
              severity: 'success',
              summary: "New Directory created successfully"
            });
             this.load(this.fileAndFolderPath,this.isOpenFromDashboard);
           },
             error => (console.log("error = ", error))
           );
         }
         this.cd.detectChanges();

    } catch (e) {
         console.error(e);
     }

       this.cancel();
   }


  openDir(fileData)
  {
    console.log("adding method because it does not exist while using in dashboardpagecomponent html file")
  }

  colsData(isOpenFromDashboard){
    if(!isOpenFromDashboard){
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'modified', header: 'Modification-Date & Time' },
      { field: 'size', header: 'Size', filter: 'filesize' },
    ];
  }
  else{
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'modified', header: 'Modification-Date & Time' },
      { field: 'mime', header: 'Type' },
      { field: 'size', header: 'Size', filter: 'filesize' },
    ];
  }
  }

  fileToDownload(){
    let filesWithPath = "";
      if(this.selectedFileData == undefined && this.selectedFileData.length == 0){
        this.alertMsg("Please select atleast one file to download", "Error");
        return;
      }
      // if(fileData['isSelected'] == true){
      //   filesWithPath = fileData["path"];
      // }
    // }
    if(this.selectedFileData != undefined && this.selectedFileData.length > 0){
      for(var i=0; i <this.selectedFileData.length ; i++){

        if(i == 0)
          filesWithPath = this.selectedFileData[0];
        else
          filesWithPath = filesWithPath +";"+ this.selectedFileData[i];
      }
    }
    this.eventBind.emit(this.selectedFileData[0]);

    if(filesWithPath)
      this.pathBind.emit(filesWithPath);
      
    this.isVisible = false;

    // this.fileManagerService.emitSelectedFiles(filesWithPath);
  }

  fileToUpload(){
    if(this.isFileUpload &&!this.moduleName){
      if(this.isFileUpload){
        for(let i = 0; i < this.data.length; i++){
         if(this.data[i].isSelected){
          this.alertMsg("Cannot select any file while uploading", "Error");
          return;
         }
        }
      }
      this.eventBind.emit(this.fileAndFolderPath);
    }
    else{
      this.fileToDownload();
    } 
    this.isVisible = false;
  }

  alertMsg(msg,header) {
    this.dialogVisible = true;
      this.confirmation.confirm({
        key: 'fileManager',
        message: msg,
        header: header,
        accept: () => { this.dialogVisible = false; },
        reject: () => { this.dialogVisible = false;},
        rejectVisible:false
      });
      this.cd.detectChanges();
  }
   
  preventBackspcase(event, searchText){
    const me = this;
    if(searchText == me.controllerRootPath){
      me.alertMsg("Path is already on root level", "Error");
      return;
    }
  }


}
