
import { Component, OnInit, Inject} from '@angular/core';
import { SelectItem, Message, MessageService } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
// import { Subscription } from 'rxjs/Subscription';
import { Observable, Subscription} from 'rxjs';
import { TierGroupInfo } from './service/tier-group-info';
import { TierGroupService } from '../../../../shared/common-config-module/services/tier-group-service';
import { ConfigUiUtility, deleteMany } from '../nd-config/utils/config-utility';
// import { deleteMany } from '../../services/common-utility.service';
import { ConfigHomeService } from '../nd-config/services/config-home.service';
import { timer } from 'rxjs';
import { CommonUtilityService } from 'src/app/shared/common-config-module/services/common-utility.service';
import { SessionService } from 'src/app/core/session/session.service';
import { ConfigUtilityService } from '../nd-config/services/config-utility.service';


@Component({

    selector: 'app-nd-tier-group-component',
    templateUrl: './nd-tier-group.component.html',
    styleUrls: ['./nd-tier-group.component.css']
})
export class NDTierGroupComponent implements OnInit {
    prodKey: string;

    public tempSelectedTierGroup: TierGroupInfo[] = [];
    public tierGroupInfo: TierGroupInfo[];  // used for Table data
    public objTierGroup: TierGroupInfo;     // used for add, Edit and delete
    public selectedTierGroup: TierGroupInfo[];     // used for selected Tier Group
    public topologyList: SelectItem[];      // used for show list of topology in dropdown
    public selectedTopology: string;        // used for selected topology from dropdown
    public isAddNewTierGroup: boolean;       // used for Add or Edit Dialog open
    public addEditTierGroupDialog: boolean;  // used for open Add and edit dialog
    public typeList: SelectItem[];          // Used for select type List or pattern
    public tierList: any[];          // used for show tier list in dropdown
    public selectedTierList: any[];         // Used for select tier
    public isTierList: boolean;             // Tier List show based on pattern or list
    public componentList: any[];          // List of UI component configUI, Monitors or both
    public message: Message;
    public trNo: string;
    public selectedGroupNameForEdit ;      // Used for edit selected tier group
    isProgressBar = false;
    public selectedPatternList: string;

    ndConfig = true;
    monitors = true;
    ndeScale = true;

    flag = false;
    errDialog = false;
    errMsg = [];
    headerMsg = '';
    errHeader = '';

    color = 'primary';

    isEdit: boolean;
    // new Keyword
    selectedComponentList: any[];
    displaySessionLabel: boolean;
    isProfAppliedTierGrp: boolean;
    subscription: Subscription;
    userName: string;
    // tslint:disable-next-line:max-line-length

   cols = [
        { field: 'groupName', header: 'Group Name' },
        { field: 'component', header: 'Group Define For' },
          { field: 'type', header: 'Type' },
          { field: 'definition', header: 'Definition' },
          { field: 'userName', header: 'User Name' },
          { field: 'lastModified', header: 'Last Modified'}
        ];

    constructor(private tierGroupService: TierGroupService, private messageService: MessageService , private configUtilityService: ConfigUtilityService, private sessionService: SessionService, private configHomeService: ConfigHomeService, @Inject(DOCUMENT) private document: Document, private _utility: CommonUtilityService, ) { }

    ngOnInit() {
        this.getTierGroupInfo();
        this.prodKey = this.sessionService.session.cctx.pk;
        // this.configUtilityService.messageProvider$.subscribe(data => { this.message = data; });
        this.userName = this.sessionService.session.cctx.u;
        this.configUtilityService.progressBarProvider$.subscribe(flag => {
            // For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
            setTimeout(() => {
                this.isProgressBar = flag['flag'];
                this.color = flag['color'];
            }, 1);

        });

        this.document.body.classList.add('multiselectPanel'); // This is used to fixed css issues when we use appento body
        this.getTopologyList();
        this.getTestRunStatus();

        const timerObj = timer(30000, 30000);
        // this.subscription = timer.subscribe(t => this.getTestRunStatus());
    }

    /*This method use for get Topology List  */
    public getTopologyList(): void {
        this.tierGroupService.getTopoList().subscribe(data => {
            this.topologyList = ConfigUiUtility.createDropdown(data); // Use utils method for create drop down
        });
    }

    /* this method is used for get info of tier group */
    public getTierGroupInfo() {
        this.selectedTierGroup = [];
        if (this.selectedTopology === undefined || this.selectedTopology === 'undefined') {
            // this.configUtilityService.errorMessage('Select Topology to add new Tier Group.');
            this.messageService.add({ severity: 'error', detail: "Select Topology to add new Tier Group." });
            return;
        }
        this.tierGroupService.getTierGroupInfo(this.selectedTopology).subscribe(data => {
            this.getComponentValueFromBitValue(data);
            this.tierGroupInfo = data;

        });
    }

    // This method is called when click on test button and type is Pattern
    public getListOfPatternTier() {
        if (this.objTierGroup.type === 'List') {
            return;
        }

        // If Pattern field is blank and click on test button
        if (this.selectedPatternList === '') {
            // this.configUtilityService.errorMessage('Enter Pattern Name for Tier List');
            this.messageService.add({severity: "error", detail: "Enter Pattern Name for Tier List."});
        }

        this.tierList = [];
        this.objTierGroup.tierPatternList = [];
        this.objTierGroup.tierPatternList[0] = this.selectedPatternList;
        // var str = this.objTierGroup.tierPatternList[0];
        // if (str.includes("*") || str.includes("?")) {
        //     //For cases like - *AT.*G*P?Tier.?
        //     str = str.replace(".*", "*")
        //     str = str.replace(".?", "?")
        //     //Now make all * and ? - .* and .?
        //     str = str.replace(/\*/g, ".*")
        //     str = str.replace(/\?/g, ".?")
        //     this.objTierGroup.tierPatternList[0] = str;
        // }
        // else
        //     this.objTierGroup.tierPatternList[0] = str + ".*";

        this.getListOfPatternListTier((data) => {
            this.tierList = ConfigUiUtility.createDropdown(data);
        });
    }

    // This method is called when click on type List in dorpdown
    public getListOfTier(): void {

        if (this.objTierGroup.type === 'Pattern') {
            if (!this.isEdit) {
                this.selectedPatternList = '';
            }
            this.isEdit = false;
            this.isTierList = false;
            return;
        }

        this.getListOfPatternListTier((data) => {
            this.objTierGroup.tierPatternList = [];
            this.tierList = ConfigUiUtility.createDropdown(data);
            // this check for Edit and check Edited row configure tier List match with tier List or not
            if (this.isAddNewTierGroup === false && this.selectedTierGroup.length === 1) {
                const arrDef = this.selectedTierGroup[0].definition.split(',');
                const arrConfigTierList = [];
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < arrDef.length; i++) {
                    // data contians the list of Tier
                    if (data.includes(arrDef[i].trim())) {
                        arrConfigTierList.push(arrDef[i].trim());
                    }
                    else {
                        if (this.objTierGroup.type === 'List' && this.selectedTierGroup[0].type === 'List') {
                            this.tierList = [];
                            arrConfigTierList.push(arrDef[i].trim());
                            data.push(arrDef[i].trim());
                            this.tierList = ConfigUiUtility.createDropdown(data);
                        }
                    }
                }
                this.objTierGroup.tierPatternList = arrConfigTierList;
            }
        });
    }

    // Get list of Tier for type List and Pattern
    getListOfPatternListTier(callback) {
        // check for show dropdown of Tier list
        this.isTierList = true;

        // get bit mash value of selected component
        this.getBitValueFromComponentList();

        this.objTierGroup.topology = this.selectedTopology;
        this.tierGroupService.getTierList(this.objTierGroup, this.selectedGroupNameForEdit).subscribe(data => {

            callback(data);
        });
    }

    // Open Add Tier Group Dialog
    public openAddTierGroupDialog(): void {
        if (this.selectedTopology === undefined || this.selectedTopology === 'undefined') {
            // this.configUtilityService.errorMessage('Select Topology to add new Tier Group.');
            this.messageService.add({severity: "error", detail: "Select Topology to add new Tier Group.."});
            return;
        }

        this.objTierGroup = new TierGroupInfo();

        this.defaultSelectedComponentList();
        this.selectedTierGroup = [];
        this.selectedGroupNameForEdit = undefined;
        this.selectedPatternList = '';
        this.isTierList = false;
        this.getDefaultValuesForAddEdit();
        this.addEditTierGroupDialog = true;
        this.isAddNewTierGroup = true; // used for open Add or Edit Dialog
    }

    // open Edit tier dialog
    openEditTierGroupDialog() {
        this.objTierGroup = new TierGroupInfo();
        this.flag = true;
        if (this.selectedTierGroup.length === 0) {
            // this.configUtilityService.errorMessage('Select one record to update Tier Group.');
            this.messageService.add({severity: "error", detail: "Select one record to update Tier Group."});
            return;
        }
        else if (this.selectedTierGroup.length > 1) {
            // this.configUtilityService.errorMessage('Select only one record to update Tier Group.');
            this.messageService.add({severity: "error", detail: "Select only one record to update Tier Group."});
            return;
        }
        this.isTierList = true;
        this.addEditTierGroupDialog = true;
        this.isAddNewTierGroup = false;

        this.getDefaultValuesForAddEdit();

        // get component List from bit value
        this.getComponentFromSelectedTierGroup();
    }

    getComponentFromSelectedTierGroup() {
        const arrComponentList = this.selectedTierGroup[0].component.split(',');
        const arrConfigureComponent = [];
        const componentLable = ['NDConfig', 'Monitor', 'NDE Scale'];
        const componentValue = ['0', '1', '2'];
        this.componentList = ConfigUiUtility.createListWithKeyValue(componentLable, componentValue);
        for (let i = 0; i < this.componentList.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < arrComponentList.length; j++) {
                if (this.componentList[i].label === arrComponentList[j].trim()) {
                    arrConfigureComponent.push(i.toString());
                }
            }
        }

        this.selectedGroupNameForEdit = this.selectedTierGroup[0].groupName;

        this.objTierGroup = Object.assign({}, this.selectedTierGroup[0]);
        this.objTierGroup.selectedComponentList = arrConfigureComponent;

        if (this.selectedTierGroup[0].type === 'Pattern') {
            this.isEdit = true;
            this.selectedPatternList = this.objTierGroup.definition;
        }

        this.getListOfTier();
    }

    // save TierGroup for add and Edit
    public saveTierGroup() {
        if (this.isAddNewTierGroup) {
            this.getAddTierGroup();
        }
        else {
            this.getUpdatedTierGroup();
        }
    }

    // Default Selected Component List
    defaultSelectedComponentList() {
        const componentLable = ['NDConfig', 'Monitor', 'NDE Scale'];
        const componentValue = ['0', '1', '2'];
        this.componentList = ConfigUiUtility.createListWithKeyValue(componentLable, componentValue);

        // this.objTierGroup.selectedComponentList = componentValue;
    }

    // This method is used for get bit value of selected Component List like NDConfig, Montior and NDE scale is 7
     getBitValueFromComponentList() {
        let componentValue = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.objTierGroup.selectedComponentList.length; i++) {
            componentValue += Math.pow(2, this.objTierGroup.selectedComponentList[i]);
        }
        this.objTierGroup.component = componentValue.toString();
    }

    // This Method is used for get selected component list from bit bash value like 7 is NDConfig, Montior and NDE scale
    getComponentValueFromBitValue(tierGroupInfo) {
        let bitValueOfComponent = '';
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < tierGroupInfo.length; j++) {
            const arrComponentValue = [];
            let strComponent = '';
            // tslint:disable-next-line:radix
            bitValueOfComponent = parseInt(tierGroupInfo[j].component).toString(2);
            console.log("bitValueOfComponent ===> ", bitValueOfComponent);
            bitValueOfComponent = bitValueOfComponent.split('').reverse().join('');
            console.log("bitValueOfComponent 1 ===> ", bitValueOfComponent);
            // this.objTierGroup.selectedComponentList = [];
            for (let i = 0; i < bitValueOfComponent.length; i++) {
                if (bitValueOfComponent[i] === '1') {
                    arrComponentValue.push(i);
                }
            }
            const componentLable = ['NDConfig', 'Monitor', 'NDE Scale'];
            const componentValue = ['0', '1', '2'];
            this.componentList = ConfigUiUtility.createListWithKeyValue(componentLable, componentValue);

            for (let i = 0; i < this.componentList.length; i++) {
                for (let k = 0; k < arrComponentValue.length; k++) {
                    if (this.componentList[i].value == arrComponentValue[k]) {
                        if (strComponent === '') {
                            strComponent = this.componentList[i].label;
                        }
                        else {
                            strComponent = strComponent + ', ' + this.componentList[i].label;
                        }
                    }
                }
            }
            tierGroupInfo[j].component = strComponent;
        }
    }
    public getAddTierGroup() {
        // This method is used for get bit value of selected Component List
        this.getBitValueFromComponentList();

        // this.objTierGroup.userName = sessionStorage.getItem('sesLoginName');
        this.objTierGroup.userName = this.userName;
        console.log("GDF === > " , this.objTierGroup.selectedComponentList);
        console.log("GDF === > " , this.objTierGroup.component);
        if (this.objTierGroup.groupName === 'Default' || this.objTierGroup.groupName === 'default') {
            // this.configUtilityService.errorMessage('Group name cannot be \'default\'');
            this.messageService.add({severity: "error", detail: "Group name cannot be 'default'"})
            return;
        }

        this.getListPatternvalidateData(() => {
            // Add a new Tier Group Name
            if (this.objTierGroup.type === 'Pattern') {

                // if this.objTierGroup.tierPatternList is not blank and click on test or save button.
                this.objTierGroup.tierPatternList = [];
                this.objTierGroup.tierPatternList.push(this.selectedPatternList);
            }

            this.tierGroupService.saveTierGroup(this.objTierGroup, this.trNo, this.prodKey).subscribe(data => {
                // this.configUtilityService.successMessage('Tier Group created Successfully.');
                this.messageService.add({detail: 'Tier Group created Successfully.', severity: "success"});
                this.getTierGroupInfo();

                this.addEditTierGroupDialog = false;
            });
        });
    }

    // get Pattern validate data
    getListPatternvalidateData(callback) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.tierGroupInfo.length; i++) {
            if (this.objTierGroup.groupName.toLocaleUpperCase() === this.tierGroupInfo[i].groupName.toLocaleUpperCase()) {
                // this.configUtilityService.errorMessage('Same Group Name is Already Exists.');
                this.messageService.add({severity: "error", detail: "Same Group Name Already Exists."});
                return;
            }
        }

        // set selected topology for get data from Tier.conf and TierGroup.conf
        this.objTierGroup.topology = this.selectedTopology;
        // this.getListOfTier();
        if (this.objTierGroup.type === 'Pattern') {

            // if this.objTierGroup.tierPatternList is not blank and click on test or save button.
            this.objTierGroup.tierPatternList = [];
            this.objTierGroup.tierPatternList[0] = this.selectedPatternList;

            // var str = this.objTierGroup.tierPatternList[0];
            // if (str.includes("*") || str.includes("?")) {
            //     //For cases like - *AT.*G*P?Tier.?
            //     str = str.replace(".*", "*")
            //     str = str.replace(".?", "?")
            //     //Now make all * and ? - .* and .?
            //     str = str.replace(/\*/g, ".*")
            //     str = str.replace(/\?/g, ".?")
            //     this.objTierGroup.tierPatternList[0] = str;
            // }
            // else
            //     this.objTierGroup.tierPatternList[0] = str + ".*";

            this.tierGroupService.getPatternExistsOrNot(this.objTierGroup, this.selectedGroupNameForEdit, this.prodKey).subscribe(data => {
                // if pattern match with configure tier list and pattern list
                if (data.body === 'true') {
                    // this.configUtilityService.errorMessage('Pattern already Exists.');
                    this.messageService.add({severity: "error", detail: "Pattern already Exists."});
                    return;
                }
                else {
                    callback();
                }
            });
        }
        else {
            callback();
        }
    }

    // This method is used for Update selected tier group
    public getUpdatedTierGroup() {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.tierGroupInfo.length; i++) {
            if (this.objTierGroup.groupName.toLocaleUpperCase() === this.selectedGroupNameForEdit.toLocaleUpperCase()) {
            }
            else if (this.objTierGroup.groupName.toLocaleUpperCase() === this.tierGroupInfo[i].groupName.toLocaleUpperCase()) {
                // this.configUtilityService.errorMessage('Same Group Name is Already Exists.');
                this.messageService.add({severity: "error", detail: "Same Group Name Already Exists."});
                return;
            }
        }
        this.objTierGroup.userName = sessionStorage.getItem('sesLoginName');

        this.getBitValueFromComponentList();
        if (this.objTierGroup.groupName === 'Default' || this.objTierGroup.groupName === 'default') {
            // this.configUtilityService.errorMessage('Group name cannot be \'Default\'');
            this.messageService.add({severity: "error", detail: "Group name cannot be 'Default'"});
            return;
        }

        if (this.objTierGroup.type === 'Pattern') {
            if (this.selectedPatternList === '') {
                // this.configUtilityService.errorMessage('Enter Pattern Name for Tier List');
                this.messageService.add({severity: "error", detail: "Enter Pattern Name for Tier List"});
            }
            this.tierList = [];
            this.objTierGroup.tierPatternList = [];
            this.objTierGroup.tierPatternList[0] = this.selectedPatternList;

            // set selected topology for get data from Tier.conf and TierGroup.conf
            this.objTierGroup.topology = this.selectedTopology;
        }

        this.tierGroupService.getPatternExistsOrNot(this.objTierGroup, this.selectedGroupNameForEdit, this.prodKey).subscribe(res => {
            // if pattern match with configure tier list and pattern list
            if (res.body === 'true') {
                // this.configUtilityService.errorMessage('Pattern already Exists.');
                this.messageService.add({severity: "error", detail: "Pattern already Exists."});
                return;
            }
            else {
                // tslint:disable-next-line:max-line-length
                this.tierGroupService.getSelectedTierGroupUpdate(this.objTierGroup, this.trNo, this.selectedGroupNameForEdit, true, this.prodKey).subscribe(data => {
                    if (data == null || data.length === 0) {
                        // this.configUtilityService.successMessage('Tier Group updated Successfully');
                        this.messageService.add({severity: "success", detail: "Tier Group Updated Successfully."});
                    }
                    else {
                        this.errDialog = true;
                        this.errHeader = 'Details';
                        this.errMsg = data;
                        this.headerMsg = 'Group name modification is not allowed:';
                        return;
                    }
                    this.getTierGroupInfo();
                    this.addEditTierGroupDialog = false;
                });
            }
        });
    }

    // Default values for Edit and Add dialog box
    getDefaultValuesForAddEdit() {
        //  this.objTierGroup = new TierGroupInfo();

        const type = ['List', 'Pattern'];
        this.typeList = ConfigUiUtility.createDropdown(type); // Use utils method for create drop down
    }

    // This method is used to selected delete selected group
    public deleteSelectedTierGroup() {
        if (this.selectedTierGroup.length === 0) {
            // this.configUtilityService.errorMessage('Select atleast one Tier Group to delete');
            this.messageService.add({severity: "error", detail: "Select atleast one Tier Group to delete."});
            return;
        }
        if (this.selectedTierGroup.length > 1) {
            // this.configUtilityService.errorMessage('Select only one Tier Group to delete');
            this.messageService.add({severity: "error", detail: "Select only one Tier Group to delete."});
            return;
        }
        this.isProfAppliedTierGrp  = false;
        const arrComponentList = this.selectedTierGroup[0].component.split(',');
        const arrConfigureComponent = [];
        const componentLable = ['NDConfig', 'Monitor', 'NDE Scale'];
        const componentValue = ['0', '1', '2'];
        const componentList = ConfigUiUtility.createListWithKeyValue(componentLable, componentValue);
        for (let i = 0; i < componentList.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < arrComponentList.length; j++) {
                if (componentList[i].label === arrComponentList[j].trim()) {
                    arrConfigureComponent.push(i.toString());
                }
            }
        }

        this.selectedTierGroup[0].topology = this.selectedTopology;
        let count = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < arrConfigureComponent.length; i++) {
            count += Math.pow(2, arrConfigureComponent[i]);
        }
        this.selectedTierGroup[0].component = count.toString();
	       this.tempSelectedTierGroup[0] = this.selectedTierGroup[0];
        this.tierGroupService.getSelectedTierGroupDelete(this.selectedTierGroup[0], this.trNo, true, this.prodKey).subscribe(data => {
            if (data == null || data.length === 0) {
                // this.configUtilityService.infoMessage('Deleted Successfully');
                this.messageService.add({severity: "info", detail: "Deleted Successfully"});
                this.deleteTierGroupFromTable(this.selectedTierGroup[0].groupName);
            }
            else {
		if (data[0].includes('Do you still want to delete Tier Group'))
                {
                    this.isProfAppliedTierGrp = true;
                }
  this.errDialog = true;
  this.errHeader = 'Details';
  this.errMsg = data;
  this.headerMsg = 'Delete aborted :';
  this.getTierGroupInfo();
            }
	           this.selectedTierGroup = [];
        });
    }

    /**This method is used to delete  from Data Table */
    deleteTierGroupFromTable(arrIndex) {
        const rowIndex: number[] = [];
        rowIndex.push(this.getTierGroup(arrIndex));
        this.tierGroupInfo = deleteMany(this.tierGroupInfo, rowIndex);
    }
    /**This method returns selected application row on the basis of selected row */
    getTierGroup(groupName: any): number {
        for (let i = 0; i < this.tierGroupInfo.length; i++) {
            if (this.tierGroupInfo[i].groupName === groupName) {
                return i;
            }
        }
        return -1;
    }

    // Get Status of running test run
    getTestRunStatus() {
        this.configHomeService.getTestRunStatus().subscribe(data => {
           this.trNo = data.trData.trNo;
           if (this.trNo == null) {
                this.trNo = '0';
                this.displaySessionLabel = false;
            }
            else {
            this.displaySessionLabel = true;
            }
       });
    }

    // This method is called when we click on component check boxes
    getComponentRelatedTierList() {
        if (this.objTierGroup.type !== undefined) {
            this.getListOfTier();
            // this.getListOfPatternTier();
        }
    }

// This methos is used to delete tier group if its topology is assigned with any other profile rather than default profile.
deleteTierGroup()
{
	this.isProfAppliedTierGrp  = false;
 this.tierGroupService.getSelectedTierGroupDelete(this.tempSelectedTierGroup[0], this.trNo, false, this.prodKey).subscribe(data => {
            if (data == null || data.length === 0) {
                // this.configUtilityService.infoMessage('Deleted Successfully');
                this.messageService.add({severity: "info", detail: "Deleted Successfully"});
                this.deleteTierGroupFromTable(this.tempSelectedTierGroup[0].groupName);
            }
            else {
		if (data[0].includes('Do you still want to delete Tier Group'))
                {
                    this.isProfAppliedTierGrp = true;
                }
                     this.errDialog = true;
                     this.errHeader = 'Details';
                     this.errMsg = data;
                     this.headerMsg = 'Delete aborted :';
                     this.getTierGroupInfo();
            }
            this.errDialog = false;
	           // tslint:disable-next-line:indent
	           this.tempSelectedTierGroup = [];
        });
}

}
