import { Component, OnInit, Input, Output, EventEmitter,Inject, ViewChild } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api'
import { ActivatedRoute, Params } from '@angular/router';
import { CustomKeywordsComponentData } from '../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { cloneObject, deleteMany } from '../../../../utils/config-utility';
import { FileManagerComponent } from '../../../../../../../../shared/file-manager/file-manager.component';

import { Messages, descMsg, customKeywordMessage } from '../../../../constants/config-constant';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
// import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-custom-keywords',
  templateUrl: './custom-keywords.component.html',
  styleUrls: ['./custom-keywords.component.css']
})
export class CustomKeywordsComponent implements OnInit {

  @Input()
  profileId: number;

  @Input()
  saveDisable: boolean;

  @Output()
  keywordData = new EventEmitter();

  /**It stores custom keywords data */
  customKeywordsDataList: CustomKeywordsComponentData[] = [];

  /**It stores selected method monitor data for edit or add method-monitor */
  customKeywords: CustomKeywordsComponentData;

  /**It stores selected custom keywords data */
  selectedCustomKeywordsData: CustomKeywordsComponentData[];

  /**For add/edit  flag */
  isNew: boolean = false;

  /**For open/close add/edit  */
  addEditDialog: boolean = false;

  message: string;

  //list holding keywordsNameList
  customKeywordsList = [];

  javaCustomKeywordsList = [];
  nodeJsCustomKeywordsList = [];
  dotNetCustomKeywordsList = [];
  phpCustomKeywordsList = [];
  pythonCustomKeywordsList = [];

  subscription: Subscription;

  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;
  isCustomConfigurationBrowse: boolean = false;

  isValueDisabled: boolean = false;

  agentType: string = "";
  isProfilePerm: boolean;

  custom_keyword: object;

  customKeywordData: boolean;

  preCustomList: any[] = [];
  userConfiguredList: any[] = [];
  keywordList: any[] = [];

  javaConfiguredKeyList: any[];
  nodeConfiguredKeyList: any[];
  dotConfiguredKeyList: any[];
  phpConfiguredKeyList: any[];
  pythonConfiguredKeyList: any[];
  // store : any;
  @ViewChild('fileManager', { read: FileManagerComponent })
  fileManager: FileManagerComponent;
  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<Object>,@Inject(DOCUMENT) private document: Document) {
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      this.getCustomKeywordList(() => {

        this.agentType = sessionStorage.getItem("agentType");
        this.createDataForTable(data)
        var keywordDataVal = {}
        if (this.agentType == "Java") {
          this.javaConfiguredKeyList.map(function (key) {
            keywordDataVal[key] = data[key];
          })
        }
        else if (this.agentType == "NodeJS") {
          this.nodeConfiguredKeyList.map(function (key) {
            keywordDataVal[key] = data[key]; 
          })
        }
        else if (this.agentType == "Dot Net") {
          this.dotConfiguredKeyList.map(function (key) {
            keywordDataVal[key] = data[key];
          })
        }
        if (this.agentType == "Php") {
          this.phpConfiguredKeyList.map(function (key) {
            keywordDataVal[key] = data[key];
          })
        }
        if (this.agentType == "Python") {
          this.pythonConfiguredKeyList.map(function (key) {
            keywordDataVal[key] = data[key];
          })
        }
        this.custom_keyword = cloneObject(keywordDataVal);
      });
    });

  }

  cols = [
    { field: 'checkbox', header: '' },
    { field: 'keywordName', header: 'Name' },
    { field: 'value', header: 'Value' },
    { field: 'description', header: 'Description'}
  ]
  //constructing tableData for table [all custom keywords list]

  createDataForTable(data) {
    let tableData = [];
    this.customKeywordsList = [];
    // this.customKeywordsList.push({ value: -1, label: '--Select --' });
    for (let key in data) {

      if (!(data[key]['assocId'] == -1) && data[key]['enable'] == true && (data[key]['type'] == 'custom' || data[key]['type'] == 'user-custom')) {
        this.customKeywords = new CustomKeywordsComponentData();
        this.customKeywords.id = data[key]["keyId"];
        this.customKeywords.keywordName = key;
        this.customKeywords.value = data[key]["value"];
        this.customKeywords.description = data[key]['desc'];
        this.customKeywords.enable = data[key]['enable'];
        for(var index = 0; index< this.keywordList.length; index++){
          if(this.keywordList[index]['keyName'] == key){
          this.customKeywords.kmdId = this.keywordList[index]['kmdId']
          break;
          }

        }
        tableData.push(this.customKeywords);
        // this.customKeywordsList.push({ 'value': key, 'label': key});
      }
      else if (data[key]['type'] == 'pre-custom' || data[key]['type'] == 'custom' || data[key]['type'] == 'user-configured' || data[key]['type'] == 'user-custom') {
        //  this.customKeywordsList.push({ 'value': key, 'label': key});
      }
    }
    this.getKeyList();
    this.customKeywordsDataList = tableData
    console.log("Custom Data ====> ", this.customKeywordsDataList);
  }


  getKmdIdFromName(keyName){
    for(var index = 0; index< this.keywordList.length; index++){
      if(this.keywordList[index]['keyName'] == keyName){
      this.customKeywords.kmdId = this.keywordList[index]['kmdId']
      break;
      }

    }
  }

  private getKeyList() {
    let customKeywordsList = [];
    if (this.agentType == "Java") {
      for (let i = 0; i < this.customKeywordsDataList.length; i++) {
        this.javaCustomKeywordsList = this.javaCustomKeywordsList.filter(item => item !== this.customKeywordsDataList[i].keywordName);
      }
      for (let i = 0; i < this.javaCustomKeywordsList.length; i++) {
        customKeywordsList.push({ 'value': this.javaCustomKeywordsList[i], 'label': this.javaCustomKeywordsList[i] });
      }
    }
    if (this.agentType == "NodeJS") {
      for (let i = 0; i < this.customKeywordsDataList.length; i++) {
        this.nodeJsCustomKeywordsList = this.nodeJsCustomKeywordsList.filter(item => item !== this.customKeywordsDataList[i].keywordName);
      }
      for (let i = 0; i < this.nodeJsCustomKeywordsList.length; i++) {
        customKeywordsList.push({ 'value': this.nodeJsCustomKeywordsList[i], 'label': this.nodeJsCustomKeywordsList[i] });
      }
    }
    if (this.agentType == "Php") {
      for (let i = 0; i < this.customKeywordsDataList.length; i++) {
        this.phpCustomKeywordsList = this.phpCustomKeywordsList.filter(item => item !== this.customKeywordsDataList[i].keywordName);
      }
      for (let i = 0; i < this.phpCustomKeywordsList.length; i++) {
        customKeywordsList.push({ 'value': this.phpCustomKeywordsList[i], 'label': this.phpCustomKeywordsList[i] });
      }
    }
    if (this.agentType == "Python") {
      for (let i = 0; i < this.customKeywordsDataList.length; i++) {
        this.pythonCustomKeywordsList = this.pythonCustomKeywordsList.filter(item => item !== this.customKeywordsDataList[i].keywordName);
      }
      for (let i = 0; i < this.pythonCustomKeywordsList.length; i++) {
        customKeywordsList.push({ 'value': this.pythonCustomKeywordsList[i], 'label': this.pythonCustomKeywordsList[i] });
      }
    }

    if (this.agentType == "Dot Net") {
      for (let i = 0; i < this.customKeywordsDataList.length; i++) {
        this.dotNetCustomKeywordsList = this.dotNetCustomKeywordsList.filter(item => item !== this.customKeywordsDataList[i].keywordName);
      }
      for (let i = 0; i < this.dotNetCustomKeywordsList.length; i++) {
        customKeywordsList.push({ 'value': this.dotNetCustomKeywordsList[i], 'label': this.dotNetCustomKeywordsList[i] });
      }
    }
    this.customKeywordsList = customKeywordsList.sort(function(s1, s2){
      var l=s1.label.toLowerCase(), m=s2.label.toLowerCase();
      return l === m ? 0 : l > m ? 1 : - 1;
      });;
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => { this.profileId = params['profileId']; })
    // this.configKeywordsService.fileListProvider.subscribe(data => {
    //   this.uploadFile(data);
    // });
    this.document.body.classList.add('customsearchfield');
  }

  /**For showing add  dialog */
  openAddDialog(): void {
    this.customKeywordsList = [];
    this.customKeywords = new CustomKeywordsComponentData();
    this.isNew = true;
    this.getKeyList();
    this.addEditDialog = true;
  }

  /**For showing edit dialog */
  openEditDialog(): void {
    if (!this.selectedCustomKeywordsData || this.selectedCustomKeywordsData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedCustomKeywordsData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    this.customKeywords = new CustomKeywordsComponentData();
    this.isNew = false;
    this.addEditDialog = true;
    this.customKeywords = Object.assign({}, this.selectedCustomKeywordsData[0]);
  }

  //enabling /disabling keyword in ndsettings.txt
  // enableKeyword(keyword) {
  //   this.configKeywordsService.keywordData[keyword.keywordName].enable = !keyword.enable;
  //   this.configKeywordsService.saveProfileKeywords(this.profileId); 
  // }

  // This method is used to delete(disable) the keyword
  deleteCustomKeywords() {
    this.configKeywordsService.keywordData = cloneObject(this.configKeywordsService.keywordData);
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        for (let key in this.custom_keyword) {
          for (let i = 0; i < this.selectedCustomKeywordsData.length; i++) {
            if (key == this.selectedCustomKeywordsData[i].keywordName) {
              this.custom_keyword[key].enable = false;
              this.custom_keyword[key].value = this.custom_keyword[key].defaultValue;
            }
          }
        }
        for (let key in this.custom_keyword) {
          this.configKeywordsService.keywordData[key] = this.custom_keyword[key];
        }
        this.message = "Deleted Successfully"
        this.configKeywordsService.saveProfileCustomKeywords(this.profileId, this.message);
        this.message = "";
        this.selectedCustomKeywordsData = [];
      },
      reject: () => {
      }
    });
  }

  /* After saving custom keywords,store is updated and constructor of this component
  * is called,where it created table data from the store which is now
  * updated .There by increasing length of tabledata by 1.i.e updating tabledata
  */

  saveCustomKeywords() {
    //flag used to determine if keyword entered by user exist in db or not
    let keywordExistFlag = false;

    for (let key in this.custom_keyword) {
      if (key == this.customKeywords.keywordName) {
        this.custom_keyword[key].value = this.customKeywords.value;
        this.custom_keyword[key].desc = this.customKeywords.description;
        if (this.preCustomList.includes(this.customKeywords.keywordName)) {
          this.custom_keyword[key].type = "custom";
        }
        else {
          this.custom_keyword[key].type = "user-custom";

        }
        this.custom_keyword[key].enable = true;
        keywordExistFlag = true;
      }
    }

    this.configKeywordsService.keywordData = cloneObject(this.configKeywordsService.keywordData);
    for (let key in this.custom_keyword) {
      this.configKeywordsService.keywordData[key] = this.custom_keyword[key];
    }
    if (this.isNew) {
      this.message = "Added Successfully";
    }
    else {
      this.message = "Edited Successfully";
    }
    this.configKeywordsService.saveProfileCustomKeywords(this.profileId, this.message);
    this.message = "";

    if (!keywordExistFlag) {
      this.configUtilityService.errorMessage(customKeywordMessage);
      return;
    }

    this.addEditDialog = false;
    this.isNew = false;

    this.selectedCustomKeywordsData = [];
  }

  // This method is called when user click on the save button given in header field
  saveKeywordData() {
    this.keywordData.emit(this.custom_keyword);
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
  }

  openFileManager() {
    this.fileManager.open(true);
    this.openFileExplorerDialog = true;
    this.isCustomConfigurationBrowse = true;
  }
  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isCustomConfigurationBrowse == true) {
      this.isCustomConfigurationBrowse = false;
      this.openFileExplorerDialog = false;
      if(filepath.includes(".zip")){
        this.configUtilityService.errorMessage("Invalid file extension");
         return;
       }
      this.customKeywords.value = filepath;
      this.isValueDisabled = true;
    }
  }

  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    let arrHeader = { "0": "Name", "1": "Value", "2": "Description" };
    let arrcolSize = { "0": 1, "1": 1, "2": 1 };
    let arrAlignmentOfColumn = { "0": "left", "1": "right", "2": "left" };
    let arrFieldName = { "0": "keywordName", "1": "value", "2": "description" };
    let object =
    {
      data: this.customKeywordsDataList,
      headerList: arrHeader,
      colSize: arrcolSize,
      alignArr: arrAlignmentOfColumn,
      fieldName: arrFieldName,
      downloadType: reports,
      title: "Custom Configuration",
      fileName: "customconfiguration",
    }
    this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
      this.openDownloadReports(data)
    })
  }

  /* for open download reports*/
  openDownloadReports(res) {
    window.open("/common/" + res);
  }
  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog 
   * related to the current component.
   */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Advance", "Custom Configuration", this.agentType);
  }


  getPath(path)
  {  
        console.log("path===>",path);
        this.uploadFile(path);
        console.log('isVisible===>',this.fileManager.isVisible);
    }
  /* change Browse boolean value on change component */
  ngOnDestroy() {
    this.isCustomConfigurationBrowse = false;
  }
  
  getCustomKeywordList(callback) {
    this.nodeJsCustomKeywordsList = []
    this.javaCustomKeywordsList = []
    this.dotNetCustomKeywordsList = []
    this.phpCustomKeywordsList = []
    this.pythonCustomKeywordsList = []
    this.configKeywordsService.getCustomKeywordsList().subscribe(data => {
      this.keywordList = data
      for (let index in data) {

        let bitValueOfComponent = parseInt(data[index].agentMode).toString(2);
        bitValueOfComponent = bitValueOfComponent.split("").reverse().join("");

        if (data[index].type == 'pre-custom' || data[index].type == 'custom') {
          this.preCustomList.push(data[index].keyName)
        }
        else {
          this.userConfiguredList.push(data[index].keyName)
        }
        
        if (bitValueOfComponent[0] == "1") {
          this.javaCustomKeywordsList.push(data[index].keyName);
        }
        if (bitValueOfComponent[1] == "1") {
          this.nodeJsCustomKeywordsList.push(data[index].keyName)
        }
        if (bitValueOfComponent[2] == "1") {
          this.dotNetCustomKeywordsList.push(data[index].keyName)
          // }
        }
        if (bitValueOfComponent[3] == "1") {
          this.phpCustomKeywordsList.push(data[index].keyName)
        }
        if (bitValueOfComponent[4] == "1") {
          this.pythonCustomKeywordsList.push(data[index].keyName)
        }
      }
      this.javaConfiguredKeyList= this.javaCustomKeywordsList;
      this.nodeConfiguredKeyList = this.nodeJsCustomKeywordsList;
      this.dotConfiguredKeyList = this.dotNetCustomKeywordsList;
      this.phpConfiguredKeyList = this.phpCustomKeywordsList;
      this.pythonConfiguredKeyList = this.pythonCustomKeywordsList;
      callback();
    })
  }


  checkMinMax(minmax) {

    for (let index in this.keywordList) {
      if (this.keywordList[index].keyName == this.customKeywords.keywordName) {
        if (this.keywordList[index].min != '') {
          if (+this.customKeywords.value < +this.keywordList[index].min) {
            minmax.setCustomValidity('Value should be greater than or equal to ' + this.keywordList[index].min)
          }
          else if (+this.customKeywords.value > +this.keywordList[index].max) {
            minmax.setCustomValidity('Value should be less than or equal to ' + this.keywordList[index].max)
          }
          else if (+this.customKeywords.value == +this.keywordList[index].defaultValue) {
            minmax.setCustomValidity('Provided value should be different from default value')
          }
          else {
            minmax.setCustomValidity('')
          }
        }
      }
    }
  }
}
