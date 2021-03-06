import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ImmutableArray } from '../../../../utils/immutable-array';
import { SelectItem, ConfirmationService } from 'primeng/api';

import { NVAutoInjectionPolicyRule, NVAutoInjectionTagRule, AutoInjectionData } from '../../../../containers/product-integration-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../utils/config-utility';
import { addMessage, editMessage } from '../../../../constants/config-constant'
import { KeywordList } from '../../../../containers/keyword-data';

import { deleteMany, cloneObject } from '../../../../utils/config-utility';
import { FileManagerComponent } from 'src/app/shared/file-manager/file-manager.component';

@Component({
    selector: 'app-nv-auto-inject',
    templateUrl: './nv-auto-inject.component.html',
    styleUrls: ['./nv-auto-inject.component.css']
})

export class NVAutoInjectConfiguration implements OnInit, OnDestroy {

    @Input()
    profileId: number;
    @Input()
    saveDisable: boolean;
    @Output()
    keywordData = new EventEmitter();
    subscription: Subscription;

    @ViewChild('fileManager', { read: FileManagerComponent })
    fileManager: FileManagerComponent;

    /* List to Hold Keywords */
    keywordList: string[] = ['enableNVInjectingTag', 'NVAutoInjectionRuleFile'];

    subscriptionEG: Subscription;

    /* Flag for Profile Permission */
    isProfilePerm: boolean;

    /* Object to Hold Auto Injection Policy Table Data */
    nvautoinjectionPolicyData: NVAutoInjectionPolicyRule[];

    /* Object for Auto Injection Policy Rule */
    nvAutoInjection: Object;

    /* Object to Hold Auto Inject Policy Rule Selection */
    selectedAutoInjectionPolicyRule: NVAutoInjectionPolicyRule[];

    /* Add Auto Injection Policy Rule Dialog Flag */
    addEditAutoInjectionPolicyRuleDialog: boolean = false;

    /* Object to Hold Auto Injection Policy Rule Dialog Data */
    autoInjectionPolicyRuleDialogData: NVAutoInjectionPolicyRule;

    /* List to hold drop down values for HTTP Method */
    methodTypeList: SelectItem[];

    /* Object to hold drop down values for HTTP Header Operation and Query Parameter Operation */
    operationList: SelectItem[];

    /* Flag to hold Auto Injection Policy Rule Status(new/existing) */
    isNewAutoInjectionPolicyRule: boolean = false;

    /* Flag to hold Auto Injection Tag Rule Status(new/existing) */
    isNewAutoInjectionTagRule: boolean = false;

    /* Auto Injection Tag Rule Dialog Flag */
    addEditAutoInjectionTagRule: boolean = false;

    /* Object to hold Auto Injection Tag Rule Dialog Data */
    autoInjectionTagRuleDialogData: NVAutoInjectionTagRule;

    /* Object to hold Auto Injection Tag Rule Table Data */
    nvautoinjectionTagRuleData: NVAutoInjectionTagRule[];
    /* Object to Hold Auto Inject Tag Rule Selection */
    selectedAutoInjectionTagRule: NVAutoInjectionTagRule[];

    /* To hold agentType of profile */
    agentType: string = "";

    /* Flag for Auto Injection Browse */
    isAutoInjectionBrowse: boolean = false;

    /** To open file explorer dialog */
    openFileExplorerDialog: boolean = false;

    /** Object to hold  enableNVInjectingTag keyword data */
    enableAutoInjection: AutoInjectionData;

    /** To hold options for content type multiselect */
    contentTypes: SelectItem[];

    keywordValue: Object;

    //Variable to hold value of custom cintent type
    customContentType;
    
    cols = [
        { field: 'ruleName', header: 'Rule Name' },
        { field: 'btName', header: 'BT Name' },
          { field: 'httpUrl', header: 'HTTP URL' },
          { field: 'httpMethod', header: 'HTTP Method' },
          { field: 'queryParameter', header: 'Query Parameter' },
          { field: 'httpHeader', header: 'HTTP Header'},
          {fiels: 'enabled', header: 'Enabled'}
        ];

        column = [
            { field: 'ruleName', header: 'Rule Name' },
            { field: 'htmlTag', header: 'HTML Tag' },
            { field: 'src', header: 'Script Path' }
            ];

    constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService,
        private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
        /* To hold agent type of profile */
        this.agentType = sessionStorage.getItem("agentType")
        /* Assign  dropdown values to methodTypeList */
        this.methodTypeList = [];
        let arrLabel = ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'TRACE', 'CONNECT', 'OPTIONS'];
        this.methodTypeList = ConfigUiUtility.createDropdown(arrLabel);
        /* Assign  dropdown values to operationList */
        this.operationList = [];        
        arrLabel = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];
        this.operationList = ConfigUiUtility.createDropdown(arrLabel);
        let contentTypesList = ['text/html', 'text/javascript', 'text/plain'];

        this.contentTypes = ConfigUiUtility.createDropdown(contentTypesList);
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.loadPolicyRuleData();
        this.loadTagInjectionData();
        if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
            this.saveDisable = true;
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
        this.nvAutoInjection = {};

        this.keywordList.forEach((key) => {
          if (this.keywordValue.hasOwnProperty(key)) {
            this.nvAutoInjection[key] = this.keywordValue[key];
          }
        });

        this.methodToSetValue(this.nvAutoInjection);

        // this.configKeywordsService.fileListProvider.subscribe(data => {
        //     this.uploadFile(data);
        // });
    }

    /**
     * The below method is used to set values to fields on the basis of paased arguments
     * @param data 
     */
    methodToSetValue(data) {
        this.nvAutoInjection = data;
        if ((this.nvAutoInjection["enableNVInjectingTag"].value).includes("%20")) {
            let arr = (this.nvAutoInjection["enableNVInjectingTag"].value).split("%20");
            this.enableAutoInjection = new AutoInjectionData();
            if (arr[0] === "1") {
                this.enableAutoInjection.enabledAutoInject = true;
            }
            else {
                this.enableAutoInjection.enabledAutoInject = false;
            }
            if (arr[1] === "1") {
                this.enableAutoInjection.enabledContentTypeChecking = true;
            }
            else {
                this.enableAutoInjection.enabledContentTypeChecking = false;
            }
            if (arr[2].includes("%3B")) {
                let contentTypeStr = "##";
                let contentTypeArr = arr[2].split("%3B");
                for(let i=0; i<contentTypeArr.length; i++)
                {
                    if(contentTypeArr[i] == 'text/html' || contentTypeArr[i] == 'text/javascript' || contentTypeArr[i] == 'text/plain')
                    {
                        this.enableAutoInjection.contentType.push(contentTypeArr[i]);
                        this.customContentType = null;
                    }                
                    else
                    {
                        if(this.customContentType == null || (this.customContentType != null && this.customContentType.indexOf(contentTypeArr[i]) == -1))
                        {
                            contentTypeStr = contentTypeStr + contentTypeArr[i] + "##";
                        }
                    }   
                }
                if(contentTypeStr != null && contentTypeStr != "##")
                    this.customContentType = contentTypeStr.substring(2, contentTypeStr.length-2).split("##");
                else
                    this.customContentType = null;
            }   
            else {  
                let tempArr = [];
                tempArr[0] = arr[2];
                if(tempArr[0] == 'text/html' || tempArr[0] == 'text/javascript' || tempArr[0] == 'text/plain')
                {
                    this.enableAutoInjection.contentType = tempArr;
                    this.customContentType = null;   
                } 
                else
                {
                    if(tempArr[0] != '')
                        this.customContentType = tempArr;
                    else
                        this.customContentType = null;
                }
            }
        }
        else {
            let arr = [];
            arr[0] = 'text/html';
            this.enableAutoInjection.enabledAutoInject = false;
            this.enableAutoInjection.enabledContentTypeChecking = true;
            this.enableAutoInjection.contentType = arr;
            this.customContentType = null;
        }
    }

    /**
     * The below method is used to load Auto Injection Policy Rule Data
     */
    loadPolicyRuleData() {
        this.configKeywordsService.getAutoInjectionPolicyRule(this.profileId).subscribe(data => {
            this.nvautoinjectionPolicyData = data;
            this.modifyPolicyRuleTableData();
        });
    }

    /**
     * The below method is used to modify the Policy Rule Table data
     */
    modifyPolicyRuleTableData() {
        for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
            if (this.nvautoinjectionPolicyData[i].parameterName != "-" && this.nvautoinjectionPolicyData[i].parameterName != ""
                && this.nvautoinjectionPolicyData[i].parameterName != null) {
                this.nvautoinjectionPolicyData[i].queryParameter = this.nvautoinjectionPolicyData[i].parameterName + ":"
                    + this.nvautoinjectionPolicyData[i].parameterValue + ":" + this.nvautoinjectionPolicyData[i].parameterOperation
            }
            else {
                this.nvautoinjectionPolicyData[i].queryParameter = "-";
            }
            if (this.nvautoinjectionPolicyData[i].headerName != "-" && this.nvautoinjectionPolicyData[i].headerName != ""
                && this.nvautoinjectionPolicyData[i].headerName != null) {
                this.nvautoinjectionPolicyData[i].httpHeader = this.nvautoinjectionPolicyData[i].headerName + ":" +
                    this.nvautoinjectionPolicyData[i].headerValue + ":" + this.nvautoinjectionPolicyData[i].headerOperation;
            }
            else {
                this.nvautoinjectionPolicyData[i].httpHeader = "-";
            }
        }
    }

    /**
     * The below method is used to load Auto Injection Configuration(Tag Injection) Data
     */
    loadTagInjectionData() {
        this.configKeywordsService.getAutoInjectionTagRule(this.profileId).subscribe(data => {
            this.nvautoinjectionTagRuleData = data;
        });
    }

    /**
     * The below function will be called when user clicks on Add button
     * in Auto Injection Policy Rule List
     */
    openAddPolicyRuleDialog() {
        this.isNewAutoInjectionPolicyRule = true;
        this.addEditAutoInjectionPolicyRuleDialog = true;
        this.autoInjectionPolicyRuleDialogData = new NVAutoInjectionPolicyRule();
        this.autoInjectionPolicyRuleDialogData.httpMethod = "GET";
    }

    /**
     * The below function will be called when user clicks on Edit button
     * in Auto Injection Policy Rule List
     */
    openEditPolicyRuleDialog() {
        if (!this.selectedAutoInjectionPolicyRule || this.selectedAutoInjectionPolicyRule.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedAutoInjectionPolicyRule.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        this.isNewAutoInjectionPolicyRule = false;
        this.autoInjectionPolicyRuleDialogData = new NVAutoInjectionPolicyRule();
        this.addEditAutoInjectionPolicyRuleDialog = true;
        this.autoInjectionPolicyRuleDialogData = Object.assign({}, this.selectedAutoInjectionPolicyRule[0]);
        this.modifyPolicyRuleValuesForDialog();
    }

    /**
     * The below method is used to modify the autoInjectionPolicyRuleDialogData
     * for opening dialog box edit policy rule operation
     */
    modifyPolicyRuleValuesForDialog() {
        if (this.autoInjectionPolicyRuleDialogData.btName == "-" || this.autoInjectionPolicyRuleDialogData.btName == null) {
            this.autoInjectionPolicyRuleDialogData.btName = "";
        }
        if (this.autoInjectionPolicyRuleDialogData.extension == "-" || this.autoInjectionPolicyRuleDialogData.extension == null) {
            this.autoInjectionPolicyRuleDialogData.extension = "";
        }
        if (this.autoInjectionPolicyRuleDialogData.httpMethod == "-" || this.autoInjectionPolicyRuleDialogData.httpMethod == null) {
            this.autoInjectionPolicyRuleDialogData.httpMethod = "";
        }
        if (this.autoInjectionPolicyRuleDialogData.httpUrl == "-" || this.autoInjectionPolicyRuleDialogData.httpUrl == null) {
            this.autoInjectionPolicyRuleDialogData.httpUrl = "";
        }
        if (this.autoInjectionPolicyRuleDialogData.type == "-" || this.autoInjectionPolicyRuleDialogData.type == null) {
            this.autoInjectionPolicyRuleDialogData.type = "";
        }
        if (this.autoInjectionPolicyRuleDialogData.parameterName == "-" || this.autoInjectionPolicyRuleDialogData.parameterName == null) {
            this.autoInjectionPolicyRuleDialogData.parameterName = ""
            this.autoInjectionPolicyRuleDialogData.parameterValue = "";
            this.autoInjectionPolicyRuleDialogData.parameterOperation = "";
        }
        if (this.autoInjectionPolicyRuleDialogData.headerName == "-" || this.autoInjectionPolicyRuleDialogData.headerName == null) {
            this.autoInjectionPolicyRuleDialogData.headerName = "";
            this.autoInjectionPolicyRuleDialogData.headerValue = "";
            this.autoInjectionPolicyRuleDialogData.headerOperation = "";
        }
    }

    /**
     * The below function will be called when user clicks on save button in
     * Add/Edit Auto Injection Policy Rule
     */
    saveAddEditAutoInject() {
        if (this.autoInjectionPolicyRuleDialogData.headerName == "" && this.autoInjectionPolicyRuleDialogData.headerValue == "NA") {
            this.autoInjectionPolicyRuleDialogData.headerValue = "";
        }

        if (this.autoInjectionPolicyRuleDialogData.parameterName == "" && this.autoInjectionPolicyRuleDialogData.parameterValue == "NA") {
            this.autoInjectionPolicyRuleDialogData.parameterValue = "";
        }

        if (this.autoInjectionPolicyRuleDialogData.ruleName == "NA" || this.autoInjectionPolicyRuleDialogData.btName == "NA"
            || this.autoInjectionPolicyRuleDialogData.extension == "NA" || this.autoInjectionPolicyRuleDialogData.headerName == "NA"
            || this.autoInjectionPolicyRuleDialogData.headerValue == "NA" || this.autoInjectionPolicyRuleDialogData.httpUrl == "NA"
            || this.autoInjectionPolicyRuleDialogData.parameterName == "NA" || this.autoInjectionPolicyRuleDialogData.parameterValue == "NA"
            || this.autoInjectionPolicyRuleDialogData.type == "NA") {
            this.configUtilityService.errorMessage("None of the fields can have value as:- 'NA'");
            return;
        }
        if (this.isNewAutoInjectionPolicyRule) {                // For new Auto Injection Policy Rule
            //Check for app name already exist or not
            if (!this.checkAutoInjectionPolicyRuleNameAlreadyExist()) {
                this.addEditAutoInjectionPolicyRuleDialog = false;
                this.saveNewAutoInjectionPolicyRule();
                return;
            }
        }
        else {                                                 // For existing Auto Injection Policy Rule
            if (this.selectedAutoInjectionPolicyRule[0].ruleName != this.autoInjectionPolicyRuleDialogData.ruleName) {
                if (this.checkAutoInjectionPolicyRuleNameAlreadyExist())
                    return;
            }
            this.addEditAutoInjectionPolicyRuleDialog = false;
            this.editAutoInjectionPolicyRule();
        }
    }

    /**
     * This method is used to validate the Auto Injection Policy Rule Name
     */
    checkAutoInjectionPolicyRuleNameAlreadyExist(): boolean {
        for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
            if (this.nvautoinjectionPolicyData[i].ruleName == this.autoInjectionPolicyRuleDialogData.ruleName) {
                this.configUtilityService.errorMessage("Rule Name already exist");
                return true;
            }
        }
    }

    /**
     * This method is used to save the New Auto Injection Policy Rule Data
     */
    saveNewAutoInjectionPolicyRule() {
        this.modifyPolicyRuleValuesBeforeSave();
        this.configKeywordsService.addAutoInjectionPolicyRule(this.profileId, this.autoInjectionPolicyRuleDialogData)
            .subscribe(data => {
                //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionPolicyData = ImmutableArray.push(this.nvautoinjectionPolicyData, data);
		if(data.dupEntryMsg == "DuplicateEntry")
                  this.configUtilityService.errorMessage("Rule name already exist");
                else
                  this.configUtilityService.successMessage(addMessage);
                this.loadPolicyRuleData();
                this.addEditAutoInjectionPolicyRuleDialog = false;
            });
    }

    /**
     * The below method is used to modify the value of autoInjectionPolicyRuleDialogData
     * before saving them
     */
    modifyPolicyRuleValuesBeforeSave() {
        if (this.autoInjectionPolicyRuleDialogData.btName == "" || this.autoInjectionPolicyRuleDialogData.btName == null) {
            this.autoInjectionPolicyRuleDialogData.btName = "-";
        }
        if (this.autoInjectionPolicyRuleDialogData.extension == "" || this.autoInjectionPolicyRuleDialogData.extension == null) {
            this.autoInjectionPolicyRuleDialogData.extension = "-";
        }
        if (this.autoInjectionPolicyRuleDialogData.httpMethod == "" || this.autoInjectionPolicyRuleDialogData.httpMethod == null) {
            this.autoInjectionPolicyRuleDialogData.httpMethod = "-";
        }
        if (this.autoInjectionPolicyRuleDialogData.httpUrl == "" || this.autoInjectionPolicyRuleDialogData.httpUrl == null) {
            this.autoInjectionPolicyRuleDialogData.httpUrl = "-";
        }
        if (this.autoInjectionPolicyRuleDialogData.type == "" || this.autoInjectionPolicyRuleDialogData.type == null) {
            this.autoInjectionPolicyRuleDialogData.type = "-";
        }
        if (this.autoInjectionPolicyRuleDialogData.parameterName == "" || this.autoInjectionPolicyRuleDialogData.parameterName == null) {
            this.autoInjectionPolicyRuleDialogData.parameterName = "-"
            this.autoInjectionPolicyRuleDialogData.parameterValue = "-";
            this.autoInjectionPolicyRuleDialogData.parameterOperation = "-";
        }
        if (this.autoInjectionPolicyRuleDialogData.headerName == "" || this.autoInjectionPolicyRuleDialogData.headerName == null) {
            this.autoInjectionPolicyRuleDialogData.headerName = "-";
            this.autoInjectionPolicyRuleDialogData.headerValue = "-";
            this.autoInjectionPolicyRuleDialogData.headerOperation = "-";
        }
    }

    /**
     * This method is used to save the Edited Auto Injection Data
     */
    editAutoInjectionPolicyRule() {
        this.modifyPolicyRuleValuesBeforeSave();
        this.configKeywordsService.editAutoInjectionPolicyRule(this.profileId, this.autoInjectionPolicyRuleDialogData)
            .subscribe(data => {
                let index = this.getAutoInjectionRuleIndex();
                this.selectedAutoInjectionPolicyRule.length = 0;
                //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionPolicyData = ImmutableArray.replace(this.nvautoinjectionPolicyData, data, index);
		if(data.dupEntryMsg == "DuplicateEntry")
                    this.configUtilityService.errorMessage("Rule Name already exist"); 
                else
                    this.configUtilityService.successMessage(editMessage);
                this.loadPolicyRuleData();
                this.addEditAutoInjectionPolicyRuleDialog = false;
            });
    }

    /**
     * The below method is used to return the index position of the selected row
     */
    getAutoInjectionRuleIndex(): number {
        if (this.autoInjectionPolicyRuleDialogData) {
            let id = this.autoInjectionPolicyRuleDialogData.id;
            for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
                if (this.nvautoinjectionPolicyData[i].id == id) {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * This method is called when user clicks on Delete button
     */
    deleteAutoInjectionRule() {
        if (!this.selectedAutoInjectionPolicyRule || this.selectedAutoInjectionPolicyRule.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected Auto Injection Rule id
                let selectedAutoInjectionRule = this.selectedAutoInjectionPolicyRule;
                let arrAppIndex = [];
                for (let index in selectedAutoInjectionRule) {
                    arrAppIndex.push(selectedAutoInjectionRule[index].id);
                }
                this.configKeywordsService.deleteAutoInjectionPolicyRule(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteAutoInjectionRuleFromTable(arrAppIndex);
                        this.selectedAutoInjectionPolicyRule = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete  from Data Table */
    deleteAutoInjectionRuleFromTable(arrIndex) {
        let rowIndex: number[] = [];
        for (let index in arrIndex) {
            rowIndex.push(this.getAutoInjectionRowIndex(arrIndex[index]));
        }
        this.nvautoinjectionPolicyData = deleteMany(this.nvautoinjectionPolicyData, rowIndex);
    }


    /**This method returns selected Auto Injection row on the basis of selected row */
    getAutoInjectionRowIndex(id: any): number {
        for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
            if (this.nvautoinjectionPolicyData[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * The below method is used to save the keyword data
     */
    saveKeywordData() {
        if (this.saveDisable == true) {
            return;
        }
        let filePath = '';
        this.nvAutoInjection = cloneObject(this.nvAutoInjection);
        for (let key in this.nvAutoInjection) {
            if (key == 'enableNVInjectingTag') {
                let contentTypeValue = "";
                // Creating "%3B" separated list of content types
                    let arr = [];
                    arr = this.enableAutoInjection.contentType;
                    if(this.customContentType != null && this.customContentType.length > -1)
                    {
                        for(let i=0; i<this.customContentType.length; i++)
                        {
                            if(this.customContentType[i] == 'text/html' || this.customContentType[i] == 'text/javascript' || this.customContentType[i] == 'text/plain')
                            {
                                this.configUtilityService.errorMessage("Predefined content type exist");
                                return;
                            }
                            else
                                arr.push(this.customContentType[i]);
                        }
                    }

                    if (arr.length > 1) {
                        for (var i = 0; i < arr.length; i++) {
                            contentTypeValue += arr[i];
                            if (i <= arr.length - 2) {
                                contentTypeValue += "%3B";
                            }
                        }
                    } else {
                        contentTypeValue = arr[0];
                    }

                if(contentTypeValue == null || contentTypeValue == "")
                {
                    this.configUtilityService.errorMessage("Custom content type not configured");
                    return;
                }

                let enableNVTag = this.enableAutoInjection.enabledAutoInject == true ? "1" : "0";
                let enableContentType = this.enableAutoInjection.enabledContentTypeChecking == true ? "1" : "0";
                this.nvAutoInjection[key]["value"] = enableNVTag + "%20" + enableContentType + "%20" + contentTypeValue;

                if (this.enableAutoInjection.enabledAutoInject == true) {
                    this.nvAutoInjection['NVAutoInjectionRuleFile']["value"] = "true";
                }
                else {
                    this.nvAutoInjection['NVAutoInjectionRuleFile']["value"] = "false";
                }
                this.customContentType = null;
               this.methodToSetValue(this.nvAutoInjection);
            }
            this.configKeywordsService.keywordData = cloneObject(this.configKeywordsService.keywordData);
            this.configKeywordsService.keywordData[key] = this.nvAutoInjection[key];
        }

        this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
            if (this.enableAutoInjection.enabledAutoInject == false) {
                filePath = "NA";
            }
            else {
                filePath = data;
                filePath = filePath + "/NDNVInjectTagProcessor.txt";
            }
            this.nvAutoInjection['NVAutoInjectionRuleFile'].path = filePath;
            this.keywordData.emit(this.nvAutoInjection);
        });
    }

    /**
     * The Below method is used to save Auto Injection Data on file
     */
    saveAutoInjectionDataOnFile() {
        this.saveKeywordData();
        this.configKeywordsService.saveAutoInjectionData(this.profileId)
            .subscribe(data => {
                console.log("return type", data)
            })
    }


    /**
     * The below function will be called when user clicks on Add button
     * in Tag Injection Rule List
     */
    openAddTagInjectionDialog() {
        this.isNewAutoInjectionTagRule = true;
        this.addEditAutoInjectionTagRule = true;
        this.autoInjectionTagRuleDialogData = new NVAutoInjectionTagRule();
    }


    /**
     * The below function will be called when user clicks on Edit button
     * in Auto Injection Configuration Rule List
     */
    openEditTagInjectionDialog() {
        if (!this.selectedAutoInjectionTagRule || this.selectedAutoInjectionTagRule.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedAutoInjectionTagRule.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        this.isNewAutoInjectionTagRule = false;
        this.autoInjectionTagRuleDialogData = new NVAutoInjectionTagRule();
        this.addEditAutoInjectionTagRule = true;
        this.autoInjectionTagRuleDialogData = Object.assign({}, this.selectedAutoInjectionTagRule[0]);
    }


    /**
     * The below function will be called when user clicks on save button in
     * Add/Edit Auto Injection Configuration Rule(Tag Injection)
     */
    saveAddEditTagInject() {
        this.autoInjectionTagRuleDialogData.src = this.autoInjectionTagRuleDialogData.src.trim();
        if (this.autoInjectionTagRuleDialogData.src == "") {
            this.configUtilityService.errorMessage("Please enter valid Script Path.");
            return;
        }
        if (this.autoInjectionTagRuleDialogData.ruleName == "NA" || this.autoInjectionTagRuleDialogData.ruleName == "-"
            || this.autoInjectionTagRuleDialogData.htmlTag == "NA" || this.autoInjectionTagRuleDialogData.htmlTag == "-"
            || this.autoInjectionTagRuleDialogData.src == "NA" || this.autoInjectionTagRuleDialogData.src == "-") {
            this.configUtilityService.errorMessage("None of the fields can have value as:- 'NA' or '-'");
            return;
        }
        if (this.isNewAutoInjectionTagRule) {                // For new Tag Injection Rule
            //Check for app name already exist or not
            if (!this.checkTagInjectionRuleNameAlreadyExist()) {
                this.addEditAutoInjectionTagRule = false;
                this.saveNewTagInjectionRule();
                return;
            }
        }
        else {                                       // For existing Tag Injection Rule
            if (this.selectedAutoInjectionTagRule[0].ruleName != this.autoInjectionTagRuleDialogData.ruleName) {
                if (this.checkTagInjectionRuleNameAlreadyExist())
                    return;
            }
            this.addEditAutoInjectionTagRule = false;
            this.editTagInjectionRule();
        }
    }

    /**
     * This method is used to validate the Tag Configuration Rule Rule Name
     */
    checkTagInjectionRuleNameAlreadyExist(): boolean {
        if(this.nvautoinjectionTagRuleData != undefined){
        for (let i = 0; i < this.nvautoinjectionTagRuleData.length; i++) {
            if (this.nvautoinjectionTagRuleData[i].ruleName == this.autoInjectionTagRuleDialogData.ruleName) {
                this.configUtilityService.errorMessage("Rule Name already exist");
                return true;
            }
        }}
    }

    /**
     * This method is used to save the New Tag Configuration Rule Data
     */
    saveNewTagInjectionRule() {
        this.configKeywordsService.addAutoInjectionTagRule(this.profileId, this.autoInjectionTagRuleDialogData)
            .subscribe(data => {
                //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionTagRuleData = ImmutableArray.push(this.nvautoinjectionTagRuleData, data);
		if(data.dupEntryMsg == "DuplicateEntry")
                    this.configUtilityService.errorMessage("Rule Name already exist"); 
                else
                    this.configUtilityService.successMessage(addMessage);
                this.loadTagInjectionData();
                this.addEditAutoInjectionTagRule = false;
            });
    }

    /**
     * This method is used to save the Edited Auto Injection Configuration(Tag Injection) Data
     */
    editTagInjectionRule() {
        this.configKeywordsService.editAutoInjectionTagRule(this.profileId, this.autoInjectionTagRuleDialogData)
            .subscribe(data => {
                let index = this.getTagInjectionRuleIndex();
                this.selectedAutoInjectionTagRule.length = 0;
                //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionTagRuleData = ImmutableArray.replace(this.nvautoinjectionTagRuleData, data, index);
		if(data.dupEntryMsg == "DuplicateEntry")
                    this.configUtilityService.errorMessage("Rule Name already exist"); 
                else
                    this.configUtilityService.successMessage(editMessage);
                this.loadTagInjectionData();
                this.addEditAutoInjectionTagRule = false;
            });
    }

    /**
     * The below method is used to return the index position of the selected row
     */
    getTagInjectionRuleIndex(): number {
        if (this.autoInjectionTagRuleDialogData) {
            let id = this.autoInjectionTagRuleDialogData.id;
            for (let i = 0; i < this.nvautoinjectionTagRuleData.length; i++) {
                if (this.nvautoinjectionTagRuleData[i].id == id) {
                    return i;
                }
            }
        }
        return -1;
    }


    /**
     * This method is called when user clicks on Delete button
     * in Tag Injection Rule list
     */
    deleteTagInjectionRules() {
        if (!this.selectedAutoInjectionTagRule || this.selectedAutoInjectionTagRule.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected Auto Injection Rule id
                let selectedTagRule = this.selectedAutoInjectionTagRule;
                let arrAppIndex = [];
                for (let index in selectedTagRule) {
                    arrAppIndex.push(selectedTagRule[index].id);
                }
                this.configKeywordsService.deleteAutoInjectionTagRule(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteAutoInjectionTagRuleFromTable(arrAppIndex);
                        this.selectedAutoInjectionTagRule = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete Auto injection Tag Rule from Data Table */
    deleteAutoInjectionTagRuleFromTable(arrIndex) {
        let rowIndex: number[] = [];
        for (let index in arrIndex) {
            rowIndex.push(this.getAutoInjectionTagRuleRowIndex(arrIndex[index]));
        }
        this.nvautoinjectionTagRuleData = deleteMany(this.nvautoinjectionTagRuleData, rowIndex);
    }


    /**This method returns selected Tag Rule row on the basis of selected row */
    getAutoInjectionTagRuleRowIndex(id: any): number {
        for (let i = 0; i < this.nvautoinjectionTagRuleData.length; i++) {
            if (this.nvautoinjectionTagRuleData[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * This method is called on clicking the browse button 
     * for opening the file manager
     */
    openFileManager() {
        this.fileManager.open(true);
        this.openFileExplorerDialog = true;
        this.isAutoInjectionBrowse = true;
    }


    /**
     * This method is called form ProductUI config-nd-file-explorer component with the path
     * ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\
     * @param filepath
     * filepath is the relative filepath for the selected file in the file manager
     */
    uploadFile(filepath) {
        if (this.isAutoInjectionBrowse == true) {
            this.isAutoInjectionBrowse = false;
            this.openFileExplorerDialog = false;

            if (filepath.includes(";")) {
                this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
                return;
            }

            var endsWith = filepath.substring(parseInt(filepath.lastIndexOf(".")) + 1, filepath.length);
            if (endsWith != "txt") {
                this.configUtilityService.errorMessage("Please select a valid .txt file");
                return;
            }

            // let filepath = "";
            this.configKeywordsService.uploadAutoInjectionFile(filepath, this.profileId).subscribe(data => {
                if (data.length == (this.nvautoinjectionPolicyData.length + this.nvautoinjectionTagRuleData.length)) {
                    this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
                    return;
                }

                this.loadPolicyRuleData();
                this.loadTagInjectionData();
                this.configUtilityService.successMessage("File uploaded successfully");
            });
        }
    }

    /** The below method is used to download policy rule reports in different formats  */
    downloadPolicyRuleReports(reports: string) {
        let arrHeader = { "0": "Rule Name", "1": "BT Name", "2": "HTTP URL", "3": "HTTP Method", "4": "Query Parameter", "5": "HTTP Header", "6": "Enabled" };
        let arrcolSize = { "0": 1, "1": 1, "2": 3, "3": 1, "4": 2, "5": 2, "6": 1 };
        let arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left", "3": "left", "4": "left", "5": "left", "6": "center" };
        let arrFieldName = { "0": "ruleName", "1": "btName", "2": "httpUrl", "3": "httpMethod", "4": "queryParameter", "5": "httpHeader", "6": "enabled" };
        let object =
        {
            data: this.nvautoinjectionPolicyData,
            headerList: arrHeader,
            colSize: arrcolSize,
            alignArr: arrAlignmentOfColumn,
            fieldName: arrFieldName,
            downloadType: reports,
            title: "Auto Injection Policy Rules",
            fileName: "autoInjectionPolicyRules",
        }
        this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
            this.openDownloadReports(data)
        })
    }

    /** The below method is used to download tag rule reports in different formats  */
    downloadTagRuleReports(reports: string) {
        let arrHeader = { "0": "Rule Name", "1": "HTML Tag", "2": "Script Path", "3": "Enabled" };
        let arrcolSize = { "0": 2, "1": 1, "4": 1, "3": 1 };
        let arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left", "3": "center" };
        let arrFieldName = { "0": "ruleName", "1": "htmlTag", "2": "src", "3": "enabled" };
        let object =
        {
            data: this.nvautoinjectionTagRuleData,
            headerList: arrHeader,
            colSize: arrcolSize,
            alignArr: arrAlignmentOfColumn,
            fieldName: arrFieldName,
            downloadType: reports,
            title: "Auto Injection Tag Rules",
            fileName: "autoInjectionTagRules",
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
        this.configKeywordsService.getHelpContent("Product Integration", "UX-Auto Inject", this.agentType);
    }

    /**
     * The below method is used to overwrite the parameterValue and 
     * parameterOperation when user clears the parameterName
     * @param parameterName 
     */
    onParameterNameChange(parameterName: string) {
        if (parameterName == "") {
            this.autoInjectionPolicyRuleDialogData.parameterValue = "";
            this.autoInjectionPolicyRuleDialogData.parameterOperation = "";
        }
    }

    /**
     * The below method is used to overwrite the headerValue and 
     * headerOperation when user clears the headerName
     * @param headerName 
     */
    onHeaderNameChange(headerName: string) {
        if (headerName == "") {
            this.autoInjectionPolicyRuleDialogData.headerValue = "";
            this.autoInjectionPolicyRuleDialogData.headerOperation = "";
        }
    }

    /**
     * The below method is used to reset the keyword value
     */
    resetKeywordData() {
        this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
            var keywordDataVal = {}
            this.keywordList.map(function (key) {
              keywordDataVal[key] = data[key];
            })
            this.nvAutoInjection = cloneObject(keywordDataVal);
          });
        this.methodToSetValue(this.nvAutoInjection);
    }

    /**
     * This method is used to reset the keyword data to its Default value
     */
    resetKeywordsDataToDefault() {
        let data = cloneObject(this.configKeywordsService.keywordData);
        for( let key in data){
            if(this.keywordList.includes(key)){
            this.nvAutoInjection[key] = data[key];
          }
        }
		var keywordDataVal = {}
		keywordDataVal = this.nvAutoInjection;
		this.keywordList.map(function (key) {
		keywordDataVal[key].value = data[key].defaultValue
    })
		this.nvAutoInjection = cloneObject(keywordDataVal);
        this.methodToSetValue(this.nvAutoInjection);
    }

    getPath(path) {
        console.log("path===>",path);
        this.uploadFile(path);
        console.log('isVisible===>',this.fileManager.isVisible);
      }

    ngOnDestroy(): void {
    }

}
