import { Component, OnInit, Output, EventEmitter } from '@angular/core';
//import { ApiService } from '../../../file-explorer/services/api.service';
import { Subscription } from 'rxjs';
import { Message } from 'primeng/api';
//import { MatDialog } from '@angular/material';
import { RetentionPolicyCommonService } from '../../services/retention-policy-common.service'
// import { ConfigUtilityService } from '../../../nd-config/services/config-utility.service';
// import { ConfigKeywordsService } from '../../../nd-config/services/config-keywords.service';
//import { CavConfigService } from '../../../../main/services/cav-config.service';
//import {FileUploadValidationsService} from '../../../file-explorer/services/fileUploadValidation.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-retention-policy-file-explorer',
  templateUrl: 'retention-policy-file-explorer.component.html',
  styleUrls: ['./retention-policy-file-explorer.component.css']
})
export class RetentionPolicyFileExplorerComponent implements OnInit {

  @Output() files = new EventEmitter();

  msgs: Message[] = [];
  private path: string[] = [];
  private selectedFilesList: any[] = [];
  filesData: any[] = [];
  fileAndFolderPath: string = '/';
  private isSelected = false;
  private subscription: Subscription;
  private selectAllChk = false;
  private uploadUrl: string;
  public toUploadFile: boolean = false;
  isLoad: boolean = true;
  emptyMessage: string;
  searchText: string;
  originalFileData: any[] = [];
  uploadFile = false;
  moduleName: string = '';
  addPath = '';
  //If its value is 1 means secure mode, zip extension is not allowed
  isSecurityMode: any;

  constructor(//public _api: ApiService,
    private retentionService: RetentionPolicyCommonService,
    // private configUtilityService: ConfigUtilityService,
    // private configKeywordsService: ConfigKeywordsService,
    //private cavConfigService:CavConfigService,public _fileValidation: FileUploadValidationsService
  ) {
    this.uploadFile = false;
    //this.uploadUrl = this._api.getSerUploadFilesPath();
    /*Getting Files based on default Path. */
    this.fileAndFolderPath = '/home/cavisson';

    /* Fetching file on load with default path. */
    this.fetchFiles();

    /*Listening Event.*/
    // this.subscription = _api.dataObservable$.subscribe(

    //   /*Getting Event Here.*/
    //   value => {
    //     this.processFiles(value);
    //     this.isLoad = false;
    //   });

    this.emptyMessage = "emptyMessage";

    this.isSecurityMode = sessionStorage.getItem('enableSecurityMode');
  }

  processFiles(files) {
    try {
      /* Checking if data available on path/Error. */
      if (files === null || files === undefined || files === 'ERROR') {
        console.error('unable to get files from path = ' + this.fileAndFolderPath + '.');
        this.filesData = [];
      } else {
        this.filesData = files;
        /* For Back line on first row. */
        if (this.filesData.length > 0 && this.filesData[0].empty != 'none') {
          this.filesData.unshift({ 'empty': 'none' });
        }
        this.checkUncheckFiles();
        this.selectAllChk = this.isAllSelectedFiles();
        this.originalFileData = this.filesData;
      }
    } catch (e) {
      console.error(e);
    }
  }

  /* This method is used to fetch files from server */
  fetchFiles() {
    try {
      //     this._api.listFilesByPath(this.fileAndFolderPath);
      if (this.moduleName = 'nd-config') {
        /*This is used to update the url and provide the destination path where the file is to be uploaded */
        //	this.uploadUrl = this._api.getSerUploadFilesPathForConfigUI() + "?for=fileExplorer&destination=" + this.fileAndFolderPath + '&productKey=' + this.cavConfigService.$productKey;
      }
      else {
        /*This is used to update the url and provide the destination path where the file is to be uploaded */
        //	this.uploadUrl = this._api.getSerUploadFilesPath() + "?for=fileExplorer&destination=" + this.fileAndFolderPath + '&productKey=' + this.cavConfigService.$productKey;
      }
    } catch (e) {
      console.error(e);
    }
  }

  /* This method is used for search on global lavel */
  globalFilter() {
    if (this.searchText.trim() == "") {
      this.filesData = this.originalFileData;
      return;
    }

    this.filesData = [];

    for (var i = 1; i < this.originalFileData.length; i++) {
      var orgFileData = this.originalFileData[i].name.trim().toUpperCase();
      if (orgFileData.search(this.searchText.trim().toUpperCase()) !== -1) {
        this.filesData.push(this.originalFileData[i]);
      }
    }
  }

  /*This method shows the list of files inside folder when clicked*/
  onItemClick(i, value) {
    console.log("printing both value", i, value, this.filesData[i], this.filesData[i].name, this.filesData[i].path);
    if (this.filesData[i].isDir) {
      this.path = this.path.concat(this.filesData[i].name);
      this.fileAndFolderPath = this.filesData[i].path;
      this.fetchFiles();
      this.searchText = "";
    }
    else if (this.filesData[i].isFile) {
      if (value) {
        this.selectedFilesList = this.selectedFilesList.concat({ path: this.filesData[i].path, action: '' });
        console.log("Print if value is true", value, this.selectedFilesList);

      }
      else if (!value) {
        for (var index = 0; index < this.selectedFilesList.length; index++) {
          if (this.selectedFilesList[index]["path"] == this.filesData[i]["path"]) {
            this.selectedFilesList.splice(index, 1);
          }
        }
        console.log("Print if value is false", value, this.selectedFilesList);
      }
      this.selectAllChk = this.isAllSelectedFiles();
    }
    this.checkUncheckFiles();
  }

  /*This is used to navigate one step back to the path*/
  goBack($event) {
    try {

      if (this.fileAndFolderPath === '' || this.fileAndFolderPath === '/') {
        console.log('Path is already on root level. Ignoring.');
        return;
      }

      /* Going to previous Path. */
      const arrPath = this.fileAndFolderPath.split('/');
      arrPath.pop();

      this.fileAndFolderPath = arrPath.join('/');
      if (this.fileAndFolderPath === '') {
        this.fileAndFolderPath = '/';
      }
      this.fetchFiles();
      this.checkUncheckFiles();
      this.selectAllChk = this.isAllSelectedFiles();
    } catch (e) {
      console.error(e);
    }
  }

  /*This method is used for searching files based on user input */
  searchByName(event, searchText) {
    try {
      console.log(event, searchText);
      this.fileAndFolderPath = searchText;
      this.fetchFiles();
    } catch (e) {
      console.error(e);
      this.msgs = this.msgs.concat({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
    }
  }


  checkUncheckFiles() {
    for (var k = 0; k < this.filesData.length; k++) {
      if (this.filesData[k].isFile) {
        this.filesData[k]["isSelected"] = false;
        if (this.filesData[k].path != null) {
          for (var j = 0; j < this.selectedFilesList.length; j++) {
            if (this.selectedFilesList[j]["path"] == this.filesData[k]["path"]) {
              this.filesData[k]["isSelected"] = true;
              break;
            }
          }
        }
      }
    }
  }


  addFiles(i, event) {
    this.retentionService.globalAddPath = this.filesData[i].path;
    this.retentionService.getDataBroadCasterForFileExplorer.next(this.filesData[i].path);

  }


  setSelectedFiles() {



    // if (!this.selectedFilesList || this.selectedFilesList.length < 1) {
    //   this.configUtilityService.errorMessage("Select a file to import");
    //   return;
    // }
    let filesWithPath = "";
    console.log("check selectd files", this.selectedFilesList)
    if (this.selectedFilesList != undefined && this.selectedFilesList.length > 0) {


      for (let i = 0; i < this.selectedFilesList.length; i++) {

        if (i == 0)
          filesWithPath = this.selectedFilesList[0]["path"];
        else
          filesWithPath = filesWithPath + ";" + this.selectedFilesList[i]["path"];
      }
      console.log("files with path", filesWithPath);
      this.fileAndFolderPath = filesWithPath;
    }
    // this.configKeywordsService.updateFileList(filesWithPath);
    // this.uploadFiles();

    console.log("Printing path", this.addPath, this.fileAndFolderPath);
    this.retentionService.globalAddPath = this.fileAndFolderPath;
    console.log("Printing path vglobal", this.retentionService.globalAddPath);
    this.retentionService.getDataBroadCasterForFileExplorer.next(this.fileAndFolderPath);

  }


  /*** 
   * This Method is used to return the index of files
   */
  getIndexForFiles(fileDataPath) {
    for (var indexofFiles = 0; indexofFiles < this.selectedFilesList.length; indexofFiles++) {
      if (this.selectedFilesList[indexofFiles]['path'] == fileDataPath) {
        return indexofFiles;
      }
    }
    return -1;
  }

  /*** 
   * This method is used to check all files are selected or not.
   */
  isAllSelectedFiles(): boolean {
    for (var l = 0; l < this.filesData.length; l++) {
      if (this.filesData[l].isFile) {
        let indexFile = this.getIndexForFiles(this.filesData[l]['path']);
        if (indexFile == -1) return false;
      }
    }
    return true;
  }

  onSelect(event, fileUpload) {
    let name = event.files[0].name;
    if (this.isSecurityMode == '0')
      this.moduleName = 'nd-config';
    else if (this.isSecurityMode == '1')
      this.moduleName = 'nd-config-secure-mode';
    /* function call for checking whether file has valid extension or not*/
    //let extensionResult = this._fileValidation.extensionValidation(name,this.moduleName);
    // if (extensionResult === 0) {
    //   this.uploadFile = false;
    //   fileUpload.clear();
    //   return;
    // }
    /* function call for checking whether file has double dots in its name or not */
    // let doubleDotValidation = this._fileValidation.doubleDotValidation(name,this.moduleName);
    // if (doubleDotValidation === 0) {
    //   this.uploadFile = false;
    //   fileUpload.clear();
    //   return;
    // }
    // /* function call for checking that file name does not consist of invalid special characters */
    //   let characterResult = this._fileValidation.specialCharacterValidation(name,this.moduleName);
    //   if (characterResult === 1) {
    //     this.uploadFile = false;
    //     fileUpload.clear();
    //     return;
    // }
    this.uploadFile = true;

  }


  /**
* This event is used to close the dialog and show message when upload is done.
*/
  onUpload(event) {
    this.toUploadFile = false;
    this.fetchFiles();
    this.msgs = [];
    //this.msgs.push({ severity: 'Success', summary: '', detail: 'File Uploaded Succesfully' });
    alert("File Uploaded Succesfully");
  }
  /**
  * This method is used to open the dialog for upload files.
  */
  uploadFiles() {
    this.toUploadFile = true;

  }

  ngOnInit() {
  }

  /* Files Data sorting */
  myfilesDataSort(event, filesData) {
    if (event["field"] == "modified") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        filesData = filesData.sort(function (a, b) {
          if (a[temp] == undefined || a[temp] == '')
            a[temp] = '1945-03-14 01:23:43';
          if (b[temp] == undefined || b[temp] == '')
            b[temp] = '1945-03-14 01:23:43';

          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        filesData = filesData.sort(function (a, b) {
          if (a[temp] == undefined || a[temp] == '')
            a[temp] = '1945-03-14 01:23:43';
          if (b[temp] == undefined || b[temp] == '')
            b[temp] = '1945-03-14 01:23:43';

          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else if (event["field"] == "mime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        filesData = filesData.sort(function (a, b) {
          if (a[temp] == undefined)
            a[temp] = '';
          if (b[temp] == undefined)
            b[temp] = '';

          var value = a[temp];
          var value2 = b[temp];
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        filesData = filesData.sort(function (a, b) {
          if (a[temp] == undefined)
            a[temp] = '';
          if (b[temp] == undefined)
            b[temp] = '';

          var value = a[temp];
          var value2 = b[temp];
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }

    else if (event["field"] == "size") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        filesData = filesData.sort(function (a, b) {
          if (a[temp] == undefined || a[temp] == '')
            a[temp] = '0';
          if (b[temp] == undefined || b[temp] == '')
            b[temp] = '0';

          var value = parseInt(a[temp]);
          var value2 = parseInt(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        filesData = filesData.sort(function (a, b) {
          if (a[temp] == undefined || a[temp] == '')
            a[temp] = '0';
          if (b[temp] == undefined || b[temp] == '')
            b[temp] = '0';

          var value = parseInt(a[temp]);
          var value2 = parseInt(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.filesData = [];
    filesData.forEach(element => {
      console.log(" == ", element)
      if (element.modified == '1945-03-14 01:23:43' && element.empty == 'none')
        element.modified = '';

      if (element.size == '0' && element.empty == 'none')
        element.size = '';

      this.filesData = this.filesData.concat(element);
    });
  }

  showErrorMessage() {
    alert("Error while uploading file. Please provide file with valid file extension.");
  }

  //Omit enter key only. 
  omit_enter_key(event) {
    var k;
    k = event.charCode;
    return (k != 13);
  }

}
