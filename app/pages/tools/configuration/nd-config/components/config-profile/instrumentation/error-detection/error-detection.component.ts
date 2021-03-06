import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ErrorDetection } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfirmationService, SelectItem } from 'primeng/api'
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ImmutableArray } from '../../../../utils/immutable-array';
import { cloneObject, deleteMany } from '../../../../utils/config-utility';

import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { Keywords } from '../../../../interfaces/keywords';
import { Messages, descMsg , addMessage , editMessage } from '../../../../constants/config-constant'

@Component({
  selector: 'app-error-detection',
  templateUrl: './error-detection.component.html',
  styleUrls: ['./error-detection.component.css']
})
export class ErrorDetectionComponent implements OnInit {
  @Input()
  profileId: number;
  @Input()
  saveDisable: boolean;
  @Output()
  keywordData = new EventEmitter();
  /**It stores error detection data */
  errorDetectionData: ErrorDetection[];
  /**It stores selected error detection data */
  selectedErrorDetection: ErrorDetection[];
  /**It stores data for add/edit error detection */
  errorDetectionDetail: ErrorDetection;

  subscription: Subscription;
  /**For add/edit error-detection flag */
  isNewErrorDetection: boolean;
  /**For open/close add/edit error detection detail */
  addEditErrorDetectionDialog: boolean = false;

  keywordList: string[] = ['BTErrorRules'];
  errorDetection: Object;
  selectedValues: boolean;
  keywordValue: Object;
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean = false;
  isProfilePerm: boolean;
  agentType : any;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.configKeywordsService.toggleKeywordData();
  }

  cols = [
    { field: 'checkbox', header: '' },
    { field: 'ruleName', header: 'Exception Name' },
    { field: 'errorFrom', header: 'Display Name' },
    { field: 'errorTo', header: 'Description' },
    {field: 'enabled', header: 'Enable'},
    { field: 'ruleDesc', header: 'Description' },
  ]

  ngOnInit() {
    this.agentType = sessionStorage.getItem("agentType");
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.loadErrorDetectionList();
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
       this.saveDisable =  true;
    if (this.configKeywordsService.keywordData != undefined) {
      this.keywordValue = this.configKeywordsService.keywordData;
    }
    else {
      this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.keywordValue = cloneObject(keywordDataVal);
      });
    }
    this.errorDetection = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.errorDetection[key] = this.keywordValue[key];
        if (this.errorDetection[key].value == "true")
          this.selectedValues = true;
        else
          this.selectedValues = false;
      }
    });
    this.errorDetection = cloneObject(this.errorDetection)
  }

  saveKeywordData() {
    if(this.saveDisable == true)
      {
          return;
      }
    let filePath = '';
    for (let key in this.errorDetection) {
      if (key == 'BTErrorRules') {
        if (this.selectedValues == true) {
          this.errorDetection[key]["value"] = "true";
         // this.configUtilityService.successMessage("Error Detection settings are enabled");
        }
        else {
          this.errorDetection[key]["value"] = "false";
         // this.configUtilityService.infoMessage("Error detection settings disabled");
        }
      }
      this.configKeywordsService.keywordData = cloneObject(this.configKeywordsService.keywordData);
      this.configKeywordsService.keywordData[key] = this.errorDetection[key];
    }
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      if (this.selectedValues == false) {
        filePath = "NA";
      }
      else {
        filePath = data;
        filePath = filePath + "/btErrorRule.err";
      }
      this.errorDetection['BTErrorRules'].path = filePath;
      this.keywordData.emit(this.errorDetection);
    });
  }

  /**This method is called to load data */
  loadErrorDetectionList() {

    this.configKeywordsService.getErrorDetectionList(this.profileId).subscribe(data => {
      this.errorDetectionData = data;
    });

  }

  /**For showing add Error Detection dialog */
  openAddErrorDetectionDialog(): void {
    this.errorDetectionDetail = new ErrorDetection();
    this.isNewErrorDetection = true;
    this.addEditErrorDetectionDialog = true;
  }

  /**For showing Error Detection dialog */
  openEditErrorDetectionDialog(): void {
    if (!this.selectedErrorDetection || this.selectedErrorDetection.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedErrorDetection.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    this.errorDetectionDetail = new ErrorDetection();
    this.isNewErrorDetection = false;
    this.addEditErrorDetectionDialog = true;
    this.errorDetectionDetail = Object.assign({}, this.selectedErrorDetection[0]);
  }

  saveErrorDetection(): void {
    //When add new Error Detection
    if (this.isNewErrorDetection) {
      //Check for errorDetection name already exist or not
      if (!this.checkErrorDetectionNameAlreadyExist()) {
        this.saveErrDetection();
        return;
      }
    }
    //When add edit error Detection
    else {
      if (this.selectedErrorDetection[0].ruleName != this.errorDetectionDetail.ruleName) {
        if (this.checkErrorDetectionNameAlreadyExist())
          return;
      }
      this.editErrDetection();
    }
  }

  /**This method is used to validate the name of error Detection is already exists. */
  checkErrorDetectionNameAlreadyExist(): boolean {
    for (let i = 0; i < this.errorDetectionData.length; i++) {
      if (this.errorDetectionData[i].ruleName == this.errorDetectionDetail.ruleName) {
        this.configUtilityService.errorMessage("Error Detection Name already exist");
        return true;
      }
    }
  }
  editErrDetection(): void {
    if (this.errorDetectionDetail.ruleDesc != null) {
      if (this.errorDetectionDetail.ruleDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.configKeywordsService.editErrorDetection(this.errorDetectionDetail, this.profileId)
      .subscribe(data => {
        let index = this.getErrorDetectionIndex();
        this.selectedErrorDetection.length = 0;
        // this.selectedErrorDetection.push(data);

        //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
        this.errorDetectionData = ImmutableArray.replace(this.errorDetectionData, data, index);
	if(data.dupEntryMsg == "DuplicateEntry")
          this.configUtilityService.errorMessage("Error Detection Name already exist");
        else
          this.configUtilityService.successMessage(editMessage);
	this.loadErrorDetectionList();
        // this.errorDetectionData[index] = data;
      });
    this.addEditErrorDetectionDialog = false;
  }

  getErrorDetectionIndex(): number {
    if (this.errorDetectionDetail) {
      let errDetectionId = this.errorDetectionDetail.errDetectionId;
      for (let i = 0; i < this.errorDetectionData.length; i++) {
        if (this.errorDetectionData[i].errDetectionId == errDetectionId) {
          return i;
        }
      }
    }
    return -1;
  }
  saveErrDetection(): void {
    if (this.errorDetectionDetail.ruleDesc != null) {
      if (this.errorDetectionDetail.ruleDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.configKeywordsService.addErrorDetection(this.errorDetectionDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting Error detection in DB
        // this.errorDetectionData.push(data);

        //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
        this.errorDetectionData = ImmutableArray.push(this.errorDetectionData, data);
	if(data.dupEntryMsg == "DuplicateEntry")
          this.configUtilityService.errorMessage("Error Detection Name already exist");
        else
          this.configUtilityService.successMessage(addMessage);
	this.loadErrorDetectionList();
      });
    this.addEditErrorDetectionDialog = false;
  }

  /**This method is used to delete Error Detection */
  deleteErrorDetection(): void {
    if (!this.selectedErrorDetection || this.selectedErrorDetection.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedErrorDetection;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].errDetectionId);
        }
        this.configKeywordsService.deleteErrorDetection(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteErrorDetectionFromTable(arrAppIndex);
            this.selectedErrorDetection = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }
  /**This method is used to delete  from Data Table */
  deleteErrorDetectionFromTable(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getMethodBusinessIndex(arrIndex[index]));
    }
    this.errorDetectionData = deleteMany(this.errorDetectionData, rowIndex);
  }
  /**This method returns selected application row on the basis of selected row */
  getMethodBusinessIndex(appId: any): number {
    for (let i = 0; i < this.errorDetectionData.length; i++) {
      if (this.errorDetectionData[i].errDetectionId == appId) {
        return i;
      }
    }
    return -1;
  }

  checkFrom(from, to) {
    if (this.errorDetectionDetail.errorFrom > this.errorDetectionDetail.errorTo) {
      from.setCustomValidity('From value ranges from 400 to 504 and must be smaller than To value.');
    }
    else if (this.errorDetectionDetail.errorFrom == this.errorDetectionDetail.errorTo) {
      from.setCustomValidity('Both From and To status code values cannot be same.');
    }
    else {
      from.setCustomValidity('');
    }
    to.setCustomValidity('');

  }

  checkTo(from, to) {
    if (this.errorDetectionDetail.errorFrom > this.errorDetectionDetail.errorTo) {
      to.setCustomValidity('To value ranges from 401 to 505 and must be greater than From value.');
    }
    else if (this.errorDetectionDetail.errorFrom == this.errorDetectionDetail.errorTo) {
      to.setCustomValidity('Both From and To status code values cannot be same.');
    }
    else {
      to.setCustomValidity('');
    }
    from.setCustomValidity('');
  }
  saveErrorDetectionOnFile() {
    this.saveKeywordData();
    this.configKeywordsService.saveErrorDetectionData(this.profileId)
      .subscribe(data => {
        console.log("return type",data)

      })
  }

  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    let arrHeader = { "0": "Name", "1": "Status code from", "2": "Status code to" , "3" : "Enabled" , "4" : "Description" };
    let arrcolSize = { "0": 2, "1": 1, "2": 1 , "3" : 1 , "4" : 2 };
    let arrAlignmentOfColumn = { "0": "left", "1": "right", "2": "right" , "3" : "center" ,"4" : "left" };
    let arrFieldName = { "0": "ruleName", "1": "errorFrom", "2": "errorTo" , "3" : "enabled" , "4" : "ruleDesc" };
    let object =
      {
        data: this.errorDetectionData,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "Error Detection",
        fileName: "errordetection",
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
    this.configKeywordsService.getHelpContent("Instrumentation", "Error Detection", this.agentType);
  }

}
