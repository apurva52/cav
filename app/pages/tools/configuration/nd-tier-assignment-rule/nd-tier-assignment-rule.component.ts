import { Component, OnInit, Inject } from '@angular/core';
import { SelectItem, ConfirmationService, Message, MessageService } from 'primeng/api';
import { TierAssignmentRuleData } from '../../../../shared/common-config-module/containers/tier-assignment-rule';
import { TierAssignmentRulesService } from '../../../../shared/common-config-module/services/tier-assignment-rules.service';
import { ConfigUiUtility } from '../nd-config/utils/config-utility';
import { ConfigUtilityService } from '../nd-config/services/config-utility.service';
import { ImmutableArray } from '../../../../shared/common-config-module/services/immutable-array';
import { DOCUMENT } from '@angular/common';
import { SessionService } from 'src/app/core/session/session.service';


@Component({
    selector: 'app-tier-assignment-rule-component',
    templateUrl: './nd-tier-assignment-rule.component.html',
    styleUrls: ['./nd-tier-assignment-rule.component.css']
})
export class NDTierAssignmentRuleComponent implements OnInit {

    //Variables names for tier assign rule fields
    tierAssignRuleInfo: TierAssignmentRuleData[] = [];
    tierAssignRuleDetails: TierAssignmentRuleData;
    topologyList: SelectItem[];
    selectedTopology: string;
    ruleName: string;
    tierList: SelectItem[];
    selectedTier: string;
    isEnableCustomTierName: boolean = false;
    customTierName: string;
    isToggleEnable: boolean = false;
    ruleTypeList: SelectItem[];
    selectedRuleType: string;
    serverPattern: string;
    serverList: SelectItem[];
    selectedServerList = [];
    isEnableCustomServerName: boolean;
    customServerName = [];
    serverIPRange: string;
    subnetMask: number = 1;
    customServer: string;

    //To get the index while edit tier assign rule
    index: number;

    //Is tier assign rule editable
    isEditable: boolean = false;

    //Variable name to show/hide filters
    isRuleFilters: boolean = true;
    isEnableColumnFilter: boolean = false;

    //variables for rule type dropdown
    ruleTypeDropDownLabel = ['Pattern', 'List', 'IP Range'];
    ruleTypeDropDownValue = ['Pattern', 'List', 'IPRange'];

    /**To store all server name  */
    tempServerNameList = [];
    /**To store all tier name  */
    tierNameList = [];
    //variable for toast notification
    message: Message  ;
    user: string;
    isProgressBar: boolean = false;

    constructor(private messageService: MessageService, private configUtilityService: ConfigUtilityService, private sessionService: SessionService , private _tierAssignmentRulesService: TierAssignmentRulesService, private confirmationService: ConfirmationService, @Inject(DOCUMENT) private document: Document) {
        this.tierAssignRuleDetails = new TierAssignmentRuleData();
    }

    ngOnInit() {
        this.user = this.sessionService.session.cctx.u;

        this.document.body.classList.add('multiselectPanel'); // This is used to fixed css issues when we use appento body

        //For toast notification
        // this.configUtilityService.messageProvider$.subscribe(data => { this.message = data })

        //Get topology list
        this.getTopologyList();
        //Creating rule type dropdown
        this.ruleTypeList = ConfigUiUtility.createListWithKeyValue(this.ruleTypeDropDownLabel, this.ruleTypeDropDownValue);
        this.configUtilityService.progressBarProvider$.subscribe(flag => {
            // For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
            setTimeout(() => {
                this.isProgressBar = flag['flag'];
            }, 1);

        });
    }

    /*This method to for get Topology List  */
    public getTopologyList(): void { 
        this._tierAssignmentRulesService.getTopoList().subscribe(data => {
            //Sorting data
            data = data.sort(function (s1, s2) {
                var l = s1.toLowerCase(), m = s2.toLowerCase();
                return l === m ? 0 : l > m ? 1 : - 1;
            });
            this.topologyList = ConfigUiUtility.createDropdown(data); // Use utils method for create drop down
        });
    }

    /* this method is used to get tier and server list from selected topology's Tier.conf and Server.conf files*/
    // Also getting the tier assignment rules from the DB for the selected topology.
    getTierServerAndTierAssignRules() {
        //To set default values for variable
        this.setDefaultValues();
        /** This method gets tier assign rules from server */
        this._tierAssignmentRulesService.getTierAssignRule(this.selectedTopology).subscribe(data => {
            this.tierAssignRuleInfo = [];
            this.tierAssignRuleInfo = data;
            //Modify data as per requirement for tier assignment rule 
            for (let i = 0; i < data.length; i++) {
                if (data[i].customServerNameStr != '')
                    this.tierAssignRuleInfo[i].customServerName = data[i].customServerNameStr.split(",");
                if (data[i].serverNameListStr != '')
                    this.tierAssignRuleInfo[i].serverNameList = data[i].serverNameListStr.split(",");
            }

            // To create tier drop down
            this._tierAssignmentRulesService.getTierList(this.selectedTopology).subscribe(data => {
                this.tierNameList = data.sort(function (s1, s2) {
                    var l = s1.toLowerCase(), m = s2.toLowerCase();
                    return l === m ? 0 : l > m ? 1 : - 1;
                });;
                this.createTierSelectItem(this.tierNameList);
            });

            // To create server drop down
            this._tierAssignmentRulesService.getServerList(this.selectedTopology).subscribe(data => {
                this.tempServerNameList = data.sort(function (s1, s2) {
                    var l = s1.toLowerCase(), m = s2.toLowerCase();
                    return l === m ? 0 : l > m ? 1 : - 1;
                });;
                this.createServerSelectItem(this.tempServerNameList);
            });
        });
    }

    //Method to save rules
    saveTierAssignRule() {
        if (!this.isEditable) {
            this.tierAssignRuleDetails = new TierAssignmentRuleData();
        }

        //To check whether rule name already exist or not
        if (!this.isEditable) {
            for (let i = 0; i < this.tierAssignRuleInfo.length; i++) {
                if (this.ruleName == this.tierAssignRuleInfo[i].ruleName) {
                    // this.configUtilityService.errorMessage("Rule name already exist");
                    this.messageService.add({severity: "error", detail: "Rule name already exist"});
                    return;
                }
            }
        }

        //Validation toast for required fields
        if (this.selectedTopology == undefined) {
            // this.configUtilityService.errorMessage("Select a topology to add new tier assignment rule.");
            this.messageService.add({severity: "error", detail: "Select a topology to add new tier assignment rule."});
            return;
        }

        if (this.ruleName == undefined || this.ruleName == '') {
            // this.configUtilityService.errorMessage("Enter rule name");
            this.messageService.add({severity: "error", detail: "Enter Rule name."});
            return;
        }

        if ((this.isEnableCustomTierName && (this.customTierName == undefined || this.customTierName == '')) || (!this.isEnableCustomTierName && this.selectedTier == '')) {
            // this.configUtilityService.errorMessage("Enter Tier Name");
            this.messageService.add({severity: "error", detail: "Enter Tier Name."});
            return;
        }

        if ((this.selectedTier == undefined && this.customTierName == undefined) || (this.selectedTier == '' && this.customTierName == '')) {
            // this.configUtilityService.errorMessage("Enter Tier Name");
            this.messageService.add({severity: "error", detail: "Enter Tier Name."});
            return;
        }

        if (this.selectedRuleType == undefined || this.selectedRuleType == '') {
            // this.configUtilityService.errorMessage("Select Rule Type");
            this.messageService.add({severity: "error", detail: "Select Rule Type."});
            return;
        }

        if (!this.isEnableCustomServerName) {
            this.customServerName = [];
        }

        if (this.selectedRuleType == 'Pattern' && (this.serverPattern == undefined || this.serverPattern == '')) {
            // this.configUtilityService.errorMessage("Enter Server name");
            this.messageService.add({severity: "error", detail: "Enter Server name."});
            return;
            // } else if (this.selectedRuleType == 'List' && !this.isEnableCustomServerName && this.customServerName != null && this.customServerName.length > 0) {
            //     this.commonUtilityService.errorMessage("Enter Server Name");
            //     return
        } else if (this.selectedRuleType == 'List' && ((this.selectedServerList == null || this.selectedServerList.length == 0) && (this.customServerName == null || this.customServerName.length == 0))) {
            // this.configUtilityService.errorMessage("Enter Server Name");
            this.messageService.add({severity: "error", detail: "Enter Server name."});
            return
        } else if (this.selectedRuleType == 'IPRange' && (this.serverIPRange == undefined || this.serverIPRange == '')) {
            // this.configUtilityService.errorMessage("Enter IP address");
            this.messageService.add({severity: "error", detail: "Enter IP Address."});
            return;
        }

        //Check whether custom tier name already exist or not.
        if (this.isEnableCustomTierName && this.tierNameList.indexOf(this.customTierName) > -1) {
            // this.configUtilityService.errorMessage("Predefined tier name exist");
            this.messageService.add({severity: "error", detail: "Predefined tier name exist."});
            return;
        }

        //Check duplicate entries
        if (this.tierAssignRuleInfo != null) {
            for (let i = 0; i < this.tierAssignRuleInfo.length; i++) {
                if (this.ruleName != undefined && this.ruleName != '') {
                    if (this.ruleName != this.tierAssignRuleDetails.ruleName && this.ruleName == this.tierAssignRuleInfo[i].ruleName) {
                        // this.configUtilityService.errorMessage("Rule name already exist");
                        this.messageService.add({severity: "error", detail: "Rule name already exist."});
                        return;
                    }
                }
                if (this.isEnableCustomTierName && this.customTierName != undefined && this.customTierName != '') {
                    if (this.customTierName != this.tierAssignRuleDetails.customTierName && this.customTierName == this.tierAssignRuleInfo[i].customTierName) {
                        // this.configUtilityService.errorMessage("Custom tier name already exist");
                        this.messageService.add({severity: "error", detail: "Custom tier name already exist."});
                        return;
                    }
                } else if (this.selectedRuleType == 'List' && this.isEnableCustomServerName && this.customServerName != null && this.customServerName.length > 0) {
                    var customServerNameFlag = true;
                    var serverNotEqualCount = 0;
                    if (this.customServerName != null && this.tierAssignRuleDetails.customServerName) {
                        if (this.tierAssignRuleDetails.customServerName.length != this.customServerName.length) {
                            customServerNameFlag = true;
                        }
                        else {
                            var arr1 = this.tierAssignRuleDetails.customServerName.concat().sort();
                            var arr2 = this.customServerName.concat().sort();
                            for (let i = 0; i < arr1.length; i++) {
                                if (arr1[i] != arr2[i]) {
                                    customServerNameFlag = true;
                                    serverNotEqualCount++;
                                    break;
                                }
                            }
                            if (serverNotEqualCount == 0)
                                customServerNameFlag = false;
                        }
                    }
                    if (i == this.index)
                        continue;

                    for (let j = 0; j < this.customServerName.length; j++) {
                        if (this.tierAssignRuleInfo[i].customServerName != null) {
                            for (let k = 0; k < this.tierAssignRuleInfo[i].customServerName.length; k++) {
                                if (customServerNameFlag && this.customServerName[j] == this.tierAssignRuleInfo[i].customServerName[k]) {
                                    // this.configUtilityService.errorMessage("Custom server name already exist");
                                    this.messageService.add({severity: "error", detail: "Custom server name already exist."});
                                    return;
                                }
                            }
                        }
                    }
                } else if (this.selectedRuleType == 'Pattern' && this.serverPattern != undefined) {
                    if (this.serverPattern != this.tierAssignRuleDetails.serverName && this.serverPattern == this.tierAssignRuleInfo[i].serverName) {
                        // this.configUtilityService.errorMessage("Server name already exist");
                        this.messageService.add({severity: "error", detail: "Server name already exists."});
                        return;
                    }
                } else if (this.selectedRuleType == 'IPRange' && this.serverIPRange != undefined) {
                    if (this.serverIPRange + "/" + this.subnetMask != this.tierAssignRuleDetails.serverName && this.serverIPRange + "/" + this.subnetMask == this.tierAssignRuleInfo[i].serverName) {
                        // this.configUtilityService.errorMessage("Server name already exist");
                        this.messageService.add({severity: "error", detail: "Server name already exists."});
                        return;
                    }
                }
            }
        }

        //Check whether custom server name already exist or not.
        if (this.isEnableCustomServerName && this.customServerName != null && this.tempServerNameList != null) {
            for (let i = 0; i < this.customServerName.length; i++) {
                if (this.tempServerNameList.indexOf(this.customServerName[i]) > -1) {
                    // this.configUtilityService.errorMessage("Predefined server name exist");
                    this.messageService.add({severity: "error", detail: "Predefined server name exists."});
                    return;
                }
            }
        }

        //Assign Apply always
        this.tierAssignRuleDetails.status = this.isToggleEnable;
        //Assign rule name
        this.tierAssignRuleDetails.ruleName = this.ruleName;

        //Assign tier name
        if (this.isEnableCustomTierName) {
            this.tierAssignRuleDetails.tierName = this.customTierName;
            this.tierAssignRuleDetails.customTierName = this.customTierName;
            this.tierAssignRuleDetails.nonCustomTierName = undefined;
        } else {
            this.tierAssignRuleDetails.tierName = this.selectedTier;
            this.tierAssignRuleDetails.nonCustomTierName = this.selectedTier;
            this.tierAssignRuleDetails.customTierName = '';
        }

        //Assign server name(s) based on rule type
        if (this.selectedRuleType == 'List') {
            if (this.isEnableCustomServerName && this.customServerName != null && this.customServerName.length > 0) {
                if (this.selectedServerList != null && this.selectedServerList.length > 0) {
                    this.tierAssignRuleDetails.serverNameList = this.selectedServerList;
                    this.tierAssignRuleDetails.customServerName = this.customServerName;
                    this.customServer = this.customServerName.join(",");
                    this.tierAssignRuleDetails.serverName = this.selectedServerList + "," + this.customServer;
                } else {
                    this.tierAssignRuleDetails.customServerName = this.customServerName;
                    this.tierAssignRuleDetails.serverNameList = this.selectedServerList;
                    this.tierAssignRuleDetails.serverName = this.customServerName.join(",");

                }
            }
            else {
                this.tierAssignRuleDetails.customServerName = [];
                this.customServerName = [];
                this.tierAssignRuleDetails.serverNameList = this.selectedServerList;
                this.tierAssignRuleDetails.serverName = "" + this.selectedServerList;
            }
        } else if (this.selectedRuleType == 'Pattern') {
            this.tierAssignRuleDetails.serverName = this.serverPattern;
        } else if (this.selectedRuleType == 'IPRange') {
            this.tierAssignRuleDetails.serverName = this.serverIPRange + "/" + this.subnetMask;
        }

        //Assign rule type
        this.tierAssignRuleDetails.ruleType = this.selectedRuleType;
        //Assign user name
        // this.tierAssignRuleDetails.userName = sessionStorage.getItem("sesLoginName");
        this.tierAssignRuleDetails.userName = this.user;

        //Use this two variable to save data in db only
        if (this.customServerName != null)
            this.tierAssignRuleDetails.customServerNameStr = this.customServerName.join(",");
        if (this.selectedServerList != null)
            this.tierAssignRuleDetails.serverNameListStr = this.selectedServerList.join(",");

        //Assign topology name
        this.tierAssignRuleDetails.topoName = this.selectedTopology;

        //Push data based on Edit or Add new tier assign rule
        //if isEditable is true means tier assign rule is being edit
        if (!this.isEditable)
            this.tierAssignRuleInfo = ImmutableArray.push(this.tierAssignRuleInfo, this.tierAssignRuleDetails);
        else
            this.tierAssignRuleInfo = ImmutableArray.replace(this.tierAssignRuleInfo, this.tierAssignRuleDetails, this.index);

        /** This method sends tier assign rule on server */
        this._tierAssignmentRulesService.saveTierAssignRule(this.tierAssignRuleDetails).subscribe(data => {
            //Store value of isEditable to isTempEditable to display toast
            let isTempEditable = this.isEditable;
            //Initialize all variables to its default value
            this.setDefaultValues();
            //To get tier assign rules
            this.getTierServerAndTierAssignRules();
            if (data.id != null && !isTempEditable)
                // this.configUtilityService.successMessage("Rule added successfully");
                this.messageService.add({severity: "success", detail: "Rule added successfully."});
            else if (data.id != null && isTempEditable)
                // this.configUtilityService.successMessage("Rule edited successfully");
                this.messageService.add({severity: "success", detail: "Rule edited successfully."});
        });
    }

    //Method to delete a tier rule row  
    deleteTierAssignRule(rowData) {
        this.confirmationService.confirm({
            message: 'Are you sure want to delete ?',
            header: 'Delete Confirmation',
            icon: 'icons8-trash',
            accept: () => {
                this._tierAssignmentRulesService.deleteTierAssignRule(rowData.id)
                    .subscribe(data => {
                        this.tierAssignRuleInfo.splice(this.tierAssignRuleInfo.indexOf(rowData), 1);
                        this.tierAssignRuleInfo = [... this.tierAssignRuleInfo];
                        this.getTierServerAndTierAssignRules();
                        // this.configUtilityService.successMessage("Rule deleted Successfully");
                        this.messageService.add({severity: "success", detail: "Rule deleted successfully."});
                    })
            },
            reject: () => {
            }
        });
    }

    //Method to edit a tier rule Row
    editTierAssignRule(rowData) {
        //Assign this variable true to maintain stats of tier assign rule while addition
        this.isEditable = true;
        //Assign editted row in this.tierAssignRuleDetails
        this.tierAssignRuleDetails = new TierAssignmentRuleData();
        this.tierAssignRuleDetails = rowData;
        //To get the index of edit tier assign rule
        this.index = this.tierAssignRuleInfo.indexOf(rowData);
        console.log('row data--------->' , rowData);
        console.log('value--------->' , this.tierAssignRuleInfo);
        
        //Create tier dropdown
        this.createTierSelectItem(this.tierNameList);
        // //Create server multiselect
        // this.createServerSelectItem(this.tempServerNameList);

        //Push editted tier name in tierList dropdown if it is non custom tier
        if (rowData.nonCustomTierName != undefined) {
            this.tierList.push({ label: rowData.nonCustomTierName, value: rowData.nonCustomTierName });
        }

        //Push editted server name in serverList dropdown if it is non custom server
        this.pushEdittedServerInServerList(rowData);

        //Set values of editable row in respective fields to show on GUI 
        this.isToggleEnable = rowData.status;
        this.ruleName = rowData.ruleName;
        this.selectedRuleType = rowData.ruleType;

        if (rowData.customTierName != '' && rowData.customTierName != undefined) {
            this.customTierName = rowData.customTierName;
            this.isEnableCustomTierName = true;
        }
        if (rowData.nonCustomTierName != '' && rowData.nonCustomTierName != undefined) {
            this.selectedTier = rowData.nonCustomTierName;
            this.isEnableCustomTierName = false;
            this.customTierName = '';
        }

        if (rowData.ruleType == 'IPRange' && rowData.serverName.includes("/")) {
            this.serverIPRange = rowData.serverName.substring(0, rowData.serverName.indexOf("/"));
            this.subnetMask = rowData.serverName.substring(rowData.serverName.indexOf("/") + 1);
        }
        if (rowData.ruleType == 'Pattern') {
            this.serverPattern = rowData.serverName;
        }
        if (rowData.ruleType == 'List') {
            if (rowData.customServerName != null && rowData.customServerName.length > 0) {
                this.customServerName = rowData.customServerName;
                this.isEnableCustomServerName = true;
            }
            this.selectedServerList = rowData.serverNameList;
        }
    }

    //This method is used to save tier assignment rules in file.
    saveTierAssignRuleFile() {
        this._tierAssignmentRulesService.saveTierAssignRuleOnFile(this.selectedTopology).subscribe(data => {
            if (data == true)
                // this.configUtilityService.successMessage("File saved successfully");
                this.messageService.add({severity: "success", detail: "File saved successfully."});
        })
    }

    /***** This method is used to create tier select item object *****/
    createTierSelectItem(data) {
        let appTierArr = [];
        this.tierAssignRuleInfo.map(function (val) {
            if (val.nonCustomTierName != null)
                appTierArr.push(val.nonCustomTierName)
        })
        this.tierList = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (!(appTierArr.indexOf(data[i]) > -1)) {
                    this.tierList.push({ value: data[i], label: data[i] });
                }
            }
        }
    }

    /***** This method is used to create server select item object *****/
    createServerSelectItem(data) {
        let appServerArr = [];
        this.tierAssignRuleInfo.map(function (val) {
            appServerArr.push(...val.serverNameList)
        })
        this.serverList = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (!(appServerArr.indexOf(data[i]) > -1)) {
                    this.serverList.push({ value: data[i], label: data[i] });
                }
            }
        }
    }

    //Method to push editted servers in serverList
    pushEdittedServerInServerList(rowData) {
        if (rowData.serverNameList != null) {
            for (let i = 0; i < rowData.serverNameList.length; i++) {
                let flag = true;
                for (let j = 0; j < this.serverList.length; j++) {
                    if (rowData.serverNameList[i] == this.serverList[j].label.trim()) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    this.serverList.push({ label: rowData.serverNameList[i], value: rowData.serverNameList[i] });
                }
            }
        }
    }

    //Method to show/hide column filters
    showHideColumnFilter() {
        if (this.isRuleFilters) {
            this.isEnableColumnFilter = true;
            this.isRuleFilters = false;
        }
        else {
            this.isEnableColumnFilter = false;
            this.isRuleFilters = true;
        }
    }


    
    //Set variable values
    setDefaultValues() {
        this.ruleName = '';
        this.isToggleEnable = false;
        this.isEnableCustomServerName = false;
        this.isEnableCustomTierName = false;
        this.selectedTier = '';
        this.customTierName = '';
        this.selectedRuleType = '';
        this.serverPattern = '';
        this.selectedServerList = [];
        this.customServerName = [];
        this.serverIPRange = '';
        this.subnetMask = 1;
        this.isEditable = false;
    }

    //To black Rule Definition fields while on change of rule Type
    blankServerFields() {
        this.serverPattern = '';
        this.selectedServerList = [];
        this.customServerName = [];
        this.serverIPRange = '';
        this.subnetMask = 1;
        this.isEnableCustomServerName = false;
    }
}
