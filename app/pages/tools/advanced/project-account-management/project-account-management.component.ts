
import { Component, OnInit, ViewChild } from '@angular/core';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { HttpClient } from '@angular/common/http';
import { MenuItem, SelectItem,MessageService } from 'primeng/api';
import { LazyLoadEvent, Table } from 'primeng';
import { Message } from 'primeng/api';
// import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { NGXLogger } from "ngx-logger";
import { SortEvent } from 'primeng/api';
import * as xml2js from 'xml2js';
import { reject } from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';


@Component({
  selector: 'project-account-management',
  templateUrl: './project-account-management.component.html',
  styleUrls: ['./project-account-management.component.scss']
})

export class ProjectAccountManagementComponent implements OnInit {
  grouplist: any;
  col: any;
  cols: any;
  cols1: any;
  xml: string
  ad: string;
  accountName: string;
  projectKey: string;
  totalRecords: number
  totalProjects: number
  loading: boolean;
  ssoKeyXml: string
  loadingforTable: boolean;
  licenseID: string;
  accountIdSelected: number;
  accountDomain: string
  selectedAccount: string;
  listOfAccounts = [];
  licenseType = [];
  ssoKeyAbsent = false;
  enableGenerateProjectKeyMode = false;
  disableShowAllProject = true;
  selectedAllProjectRow = false;
  projectAvailable = true;
  accountNameExist = true;
  accountDomainExist = true;
  projectNameExist = true;
  ssoUrlExist = true;
  urlPatterInvalid = true;
  AccountSelectedForProject = true;
  accountIdInEditMode: number
  msgs: Message[] = [];
  projectTypeList: SelectItem[];
  selectedTypeOfProject: string;
  //listOfAccounts = [];
  public searchResultForAccount: Array<any> = [];
  public listOfAccount: Array<any> = [];
  public searchResultForProject: Array<any> = [];
  public listOfProject: Array<any> = [];
  ssoIsEnabled = false;
  entityIdFromXml: string;
  showEntityId = false;
  accountProjectMode = false;
  accountDescription: string
  ssoEnabled = false;
  ssoUrl: string
  ssoKey: string;
  verifyXml = false;
  spInitiated = true;
  theCheckbox = false;
  projectName: string
  projectDescription: string
  projectType: string
  machinelist = [];
  machineToShowOnScroll = new Array();
  datasource = new Array();
  totalProjectData = new Array();
  projectsToShowOnScroll = new Array();
  machinelistToView: [];
  projectlistToView: [];
  listToFetchProject = new Array();
  machinelist1 = new Array();
  forAccountProject = new Array();
  arrToConcat = new Array();
  entityIdFromXmlAbsent: boolean
  toShowProject = new Array();
  accountList = new Array();
  projectList = new Array();
  urlPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  togglebtn: boolean = true;
  accountModal: boolean = false;
  projectModal: boolean = false;
  isEnterpriseUser: boolean = false;
  licenseModal: boolean = false;
  editAccountModal: boolean = false;
  editProjectModal: boolean = false;
  private componentName = ProjectAccountManagementComponent;
  projectNameValid: boolean = false;
  accountId: number = 0;
  isAccountDomainDuplicate: boolean = false;
  projectId: number = 0;
  jsonFile: any;
  isAccountDomainValid: boolean = false
  eventWidth: any;
  project = 0;
  account = 0;
  accountSearch = 0;
  projectSearch = 0;
  radioItems = [];
  public searchInputForProject = '';
  public searchInput: String = '';
  items: MenuItem[];



  statusFlag: string;

  @ViewChild('dtObjProject')
  dtObjProject;
  @ViewChild('dtObjProjectSearch')
  dtObjProjectSearch;
  @ViewChild('dtObjAccount')
  dtObjAccount;
  @ViewChild('dtObjAccountSearch')
  dtObjAccountSearch;
  hosturl: any;
  productKey: string;
  username: string;



  constructor(public log: NGXLogger,
    public confirmationService: ConfirmationService,
    private _config: CavConfigService, private http: HttpClient, private sessionService: SessionService, private messageService: MessageService 
    ) {
    this.eventWidth = [
      { width: '10%' },
      { width: '15%' },
      { width: '75%' },
    ];
    this.cols = [
      { field: 'col2', header: 'Account Name' },
      { field: 'col3', header: 'Account Description' },
      { field: 'col4', header: 'SSO URL' },
      { field: 'col5', header: 'Account Domain' },
    ];
    this.cols1 = [
      { field: 'col1', header: 'Project Name' },
      { field: 'col2', header: 'Project Description' },
      { field: 'col3', header: 'Project Key' },
      { field: 'col4', header: 'Project Type' },
      { field: 'col5', header: 'Licence ID' },
    ];
    this.projectTypeList = [{ label: 'Select Project Type', value: 'Select Project Type' }, { label: 'Trial', value: 'Trial' }, { label: 'Licensed', value: 'Licensed' }];
    this.licenseType = [{ label: 'Select license Type', value: 'Select license Type' }, { label: 'Trial', value: 'Trial' }, { label: 'Licensed', value: 'Licensed' }];
    this.listOfAccounts.push({ label: 'Select Account', value: 'Select Account' })
    this.radioItems = [{ 'name': 'SP Mode', 'value': true }, { 'name': 'IDP Mode', 'value': false }];
  }

  clickEvent() {
    this.togglebtn = !this.togglebtn;
  }
  accountDialog() {
    this.accountNameExist = true
    this.accountDomainExist = true;
    this.ssoUrlExist = true;
    this.urlPatterInvalid = true;
    this.isAccountDomainDuplicate = false;
    this.isAccountDomainValid = false;
    this.accountModal = true;
    this.selectedValue();
  }

  forGettingListOfAcounts() {
    try {
      if ('true')
        this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/getAccountLists?productKey=' + this.productKey).pipe(res => <any>res).subscribe(res => (this.listOfAccountsFromService(res)));
      else{
        this.isEnterpriseUser = true;
        this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/getAccountLists?productKey=' + this.productKey + "&username=" + this.username).pipe(res => <any>res).subscribe(res => (this.listOfAccountsFromService(res)));
      }
    }
    catch (err) {
      throw (" In Exception of forgettingListOfAcounts method....." + this.componentName + "class" + err);
    }
  }

  listOfAccountsFromService(res) {
    try {
      if(this.accountProjectMode)
      {
        this.accountProjectMode = false;
      }
      this.forAccountProject.splice(0, this.forAccountProject.length)
      this.listOfAccounts.splice(0, this.listOfAccounts.length)
      this.machinelist.splice(0, this.machinelist.length)
      this.machinelist1.splice(0, this.machinelist1.length)
      if (res != null) {
        for (let i = 0; i < res.acountList.length; i++) {
          this.forAccountProject.push({ 'name': res.acountList[i].accountName, 'object': res.acountList[i] })
          this.listOfAccounts.push({ label: res.acountList[i].accountName, value: res.acountList[i].accountName });
          this.machinelist.push({ 'col2': res.acountList[i].accountName, 'col3': res.acountList[i].accountDescription, 'col4': res.acountList[i].ssoUrl, 'accountId': res.acountList[i].accountId, 'statusFlag': res.acountList[i].statusFlag, 'col5': res.acountList[i].accountDomain, 'col6': res.acountList[i].ssoKey, 'ssoEnabled': res.acountList[i].ssoEnabled, 'spInitiated': res.acountList[i].spInitiated, 'entityIdFromXml': res.acountList[i].entityID });
          if (res.acountList[i].projects.length > 0) {
            for (let j = 0; j < res.acountList[i].projects.length; j++) {
              this.machinelist1.push({ 'col1': res.acountList[i].projects[j].projectName, 'col2': res.acountList[i].projects[j].projectDescription, "col3": res.acountList[i].projects[j].projectKey, "col4": res.acountList[i].projects[j].projectType, "col5": res.acountList[i].projects[j].licenseID, "statusFlag": res.acountList[i].projects[j].statusFlag, 'accountNameForProject': res.acountList[i].accountName, 'accountIdForProject': res.acountList[i].accountId, 'projectDescription': res.acountList[i].projects[j].projectDescription, 'projectId': res.acountList[i].projects[j].projectId })
            }
          }
        }
      }
      this.datasource = [...this.machinelist]
      this.totalRecords = this.datasource.length
      this.totalProjectData = [...this.machinelist1]
      this.totalProjects = this.totalProjectData.length
    }
    catch (error) {
      this.log.error('In Exception of listOfAccountsFromService method', error);
    }
  }

  selectedValue() {
    this.accountName = '';
    this.accountDescription = '';
    this.ssoEnabled = false;
    this.verifyXml = false;
    this.ssoUrl = '';
    this.ssoKey = '';
    this.projectDescription = '';
    this.showEntityId = false
    this.entityIdFromXml = '';
    this.projectName = '';
    this.projectType = '';
    this.projectId = 0;
    this.ssoKeyAbsent = false
    this.searchInput = '';
    this.searchInputForProject = '';
    this.selectedTypeOfProject = '',
      this.projectKey = '',
      this.licenseID = '',
      this.accountDomain = '',
      this.statusFlag = ''
    this.entityIdFromXmlAbsent = false;
  }

  toggleForXmlVerify() {
    this.ssoKeyXml = this.ssoKey
    if (this.spInitiated) {
      let entityIDString;
      let ssoFile = this.ssoKeyXml.split("\n");
      for (let i = 0; i < ssoFile.length; i++) {
        if (ssoFile[i].includes("onelogin.saml2.idp.entityid")) {
          entityIDString = ssoFile[i].split("=");
          this.entityIdFromXml = entityIDString[1];
          break;
        }
      }
    } else {
      const parser = new xml2js.Parser({ strict: false, trim: true });
      parser.parseString(this.ssoKeyXml, (err, result) => {
        this.xml = result;
        this.entityIdFromXml = this.xml['MD:ENTITYDESCRIPTOR']['$']['ENTITYID'];
      });
    }
  }
  saveDataForAccount() {
    this.msgs = []
    try {
      let data: any;
      let testdomain = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
      this.accountNameExist = true
      this.accountDomainExist = true;
      this.ssoUrlExist = true;
      this.urlPatterInvalid = true;
      this.isAccountDomainDuplicate = false;
      this.isAccountDomainValid = false;
      if (this.editAccountModal)
        this.accountId = this.accountIdInEditMode
      else this.accountId = 0;

      if (!this.accountDomain || !this.accountName) {
        if (!this.accountName)
          this.accountNameExist = false
        else
          this.accountDomainExist = false;
        return;
      }
      if (this.accountDomain) {
        let uniqueAccountDomain = [];
        let testAccountDomain = this.accountDomain.split(",");
        let accountListTemp = [...this.forAccountProject];
        for (let i = 0; i < accountListTemp.length; i++) {
          if (accountListTemp[i].object.accountId == this.accountId) {
            continue;
          }
          uniqueAccountDomain.push(accountListTemp[i].object.accountDomain.split(","));
        }
        for (let i = 0; i < testAccountDomain.length; i++) {
          if (!(testdomain.test(testAccountDomain[i]))) {
            this.isAccountDomainValid = true;
            return;
          }
          if (uniqueAccountDomain.includes(testAccountDomain[i])) {
            this.isAccountDomainDuplicate = true;
            return;
          }
        }
      }

      if (this.ssoEnabled) {
        if (!this.ssoUrl) {
          this.ssoUrlExist = false;
          return;
        }
        if (!this.ssoKey || this.ssoKey == '') {
          this.ssoKeyAbsent = true;
          return;
        }
        if (!this.entityIdFromXml || this.entityIdFromXml == '') {
          this.entityIdFromXmlAbsent = true;
          return;
        }
        else {
          this.entityIdFromXml = this.entityIdFromXml.trim();
        }

        if (this.urlPattern.test(this.ssoUrl) == false) {
          this.urlPatterInvalid = false;
          return;
        }
      }
      data = {
        "accountId": this.accountId,
        "accountName": this.accountName,
        "accountDescription": this.accountDescription,
        "ssoEnabled": this.ssoEnabled ? 1 : 0,
        "ssoUrl": this.ssoUrl,
        "ssoKey": this.ssoKey,
        "accountDomain": this.accountDomain,
        "spInitiated": this.spInitiated,
        "entityID": this.entityIdFromXml
      }

      this.machinelist.push({ 'col2': this.accountName, 'col3': this.accountDescription, 'col4': this.ssoUrl, 'col5': this.accountDomain, 'col6': this.ssoKey });
      this.http.post(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saveAccount?productKey=' + this.productKey, data).pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
          if (res['message']) {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: res['message'] }];
          } else {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'Eror IN  Saving Account' }];
          }
        }
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Account Saved Successfully' }];
          this.forGettingListOfAcounts();
          this.accountModal = false
          this.editAccountModal = false
          this.selectedValue();
          this.showNotification(this.msgs);

        }
      });
    }
    catch (error) {
      this.log.error('In Exception of saveData method', error);
    }
  }

  toggleVisibilityAccount(e) {
    this.ssoEnabled = e.target.checked;
  }

  SpIdpModeSelection(radiobutton) {
    console.log('mode selected  = = = = ', radiobutton)
    if (radiobutton.name == 'SP Mode') {
      this.spInitiated = true;
    }
    else {
      this.spInitiated = false;
    }
  }

  forAccountUpdate(rowdata) {
    console.log('account data', rowdata);
    this.accountNameExist = true
    this.accountDomainExist = true;
    this.ssoUrlExist = true;
    this.urlPatterInvalid = true;
    this.isAccountDomainDuplicate = false;
    this.isAccountDomainValid = false;
    this.editAccountModal = true;
    this.accountName = rowdata.col2;
    this.ssoUrl = rowdata.col4;
    this.accountDomain = rowdata.col5;
    this.accountDescription = rowdata.col3;
    this.spInitiated = rowdata.spInitiated;
    this.accountIdInEditMode = rowdata.accountId;
    this.ssoKey = rowdata.col6;
    this.entityIdFromXml = rowdata.entityIdFromXml;
    if (this.entityIdFromXml && this.entityIdFromXml != '')
      this.verifyXml = true;
    else this.verifyXml = false;
    if (rowdata.ssoEnabled && rowdata.ssoEnabled != 0) {
      this.ssoEnabled = true;
    }
    else {
      this.ssoEnabled = false;
    }
  }

  loadCarsLazy(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.machineToShowOnScroll = this.datasource.slice(event.first, (event.first + event.rows));
        console.log(
          event.first,
          event.rows,
          event.first + event.rows
        );
        this.loading = false;
      }
    }, 1000);
  }

  loadProjectsLazy(event: LazyLoadEvent) {
    this.loadingforTable = true;
    setTimeout(() => {
      if (this.datasource) {
        this.projectsToShowOnScroll = this.totalProjectData.slice(event.first, (event.first + event.rows));
        console.log(
          event.first,
          event.rows,
          event.first + event.rows
        );
        this.loadingforTable = false;
      }
    }, 1000);
  }

  saveProjectInfo() {
    try {
      let testregex = /[ $%^*()+\=\[\]{};':"\\|,<>\/?]/;
      this.projectNameExist = true;
      this.AccountSelectedForProject = true;
      this.projectNameValid = false;

      if (!this.projectName) {
        this.projectNameExist = false;
        return;
      }

      if (!this.editProjectModal) {
        if (this.selectedAccount == undefined || this.selectedAccount == 'undefined') {
          this.AccountSelectedForProject = false
          return;
        }
        let newArrOfAccount = [];
        newArrOfAccount = [...this.machinelist];
        for (let i = 0; i < newArrOfAccount.length; i++) {
          if (newArrOfAccount[i].col2 == this.selectedAccount) {
            this.accountIdSelected = newArrOfAccount[i].accountId;
          }
        }
      } else {
        let newArrOfAccount = [];
        newArrOfAccount = [...this.machinelist];
        for (let i = 0; i < newArrOfAccount.length; i++) {
          if (newArrOfAccount[i].col2 == this.accountName) {
            this.accountIdSelected = newArrOfAccount[i].accountId;
          }
        }
      }
      if (this.projectName.indexOf(' ') >= 0) {
        this.projectNameValid = true;
        return;
      } else if (this.projectName.indexOf('..') >= 0) {
        this.projectNameValid = true;
        return;
      } else if (testregex.test(this.projectName)) {
        this.projectNameValid = true;
        return;
      }
      let data = { "projectId": this.projectId, "projectName": this.projectName, "projectDescription": this.projectDescription, "projectType": this.selectedTypeOfProject, "projectKey": "", "license": "" }
      this.forSavingProject(data);
    }
    catch (error) {
      this.log.error('In Exception of saveProjectInfo method', error);
    }
  }

  enableDisableAccount(rowData) {
    this.msgs = []
    try {
      let status: any;
      let newStatus: number;
      if (rowData.statusFlag === 1) {
        status = 'deActivate'
        newStatus = 0;
      } else {
        status = 'activate'
        newStatus = 1;
      }
      console.log('value of rowdata', rowData);
      //this.blockUI.start();
      this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saasOperations?productKey=' + this.productKey + '&Id=' + rowData.accountId + '&statusFlag=' + newStatus + '&type=account').pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
        // this.blockUI.stop();
          if (res['message']) {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: res['message'] }];
          } else {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'Error to ' + status + ' Account' }];
          }
        }
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
          //this.blockUI.stop();
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Account ' + status + 'd Successfully' }];
          this.forGettingListOfAcounts();
          this.selectedValue();
          this.showNotification(this.msgs);
        }
      });
    } catch (error) {
      this.log.error('In Exception of enableDisableAccount method', error);
    }
  }

  /**For deActivating operation */
  enableDisableProject(rowData) {
    this.msgs = []
    try {
      this.machinelistToView=[];
      let status: any;
      let newStatus: number;
      if (rowData.statusFlag === 1) {
        status = 'deActivate'
        newStatus = 0;
      } else {
        status = 'activate'
        newStatus = 1;
      }
      console.log('value of rowdata', rowData);
      //this.blockUI.start();
      this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saasOperations?productKey=' + this.productKey + '&Id=' + rowData.projectId + '&statusFlag=' + newStatus + '&type=project').pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
        //  this.blockUI.stop();
          if (res['message']) {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: res['message'] }];
          } else {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'Error to ' + status + ' Project' }];
          }
        }
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
          //this.blockUI.stop();
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Project ' + status + 'd Successfully' }];
          this.forGettingListOfAcounts();
          this.selectedValue();
          this.showNotification(this.msgs);
        }
      });
    } catch (error) {
      this.log.error('In Exception of enableDisableProject method', error);
    }
  }

  /**For deleting operation */
  deleteProject(rowData) {
    this.msgs = []
    try {
      this.machinelistToView=[];
     // this.blockUI.start();
      this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saasOperations?productKey=' + this.productKey + '&Id=' + rowData.projectId + '&statusFlag=2&type=project').pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
       //   this.blockUI.stop();
          if (res['message']) {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: res['message'] }];
          } else {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'Error in deleting Project' }];
          }
        }
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
         // this.blockUI.stop();
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Project deleted Successfully' }];
          this.forGettingListOfAcounts();
          this.selectedValue();
          this.showNotification(this.msgs);
        }
      });
    } catch (error) {
      this.log.error('In Exception of deleteProject method', error);
    }
  }

  deleteAccount(rowData) {
    this.msgs = []
    try {
     // this.blockUI.start();
      this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saasOperations?productKey=' + this.productKey + '&Id=' + rowData.accountId + '&statusFlag=2&type=account').pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
       //   this.blockUI.stop();
          if (res['message']) {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: res['message'] }];
              // this.messageService.add({ severity: 'error', summary: 'Error!', detail: res['message'] });
          } else {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'Error in deleting Account' }];
          }
        }
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
         // this.blockUI.stop();
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Account deleted Successfully' }];
          this.forGettingListOfAcounts();
          this.selectedValue();
          this.showNotification(this.msgs);
        }
      });
    } catch (error) {
      this.log.error('In Exception of deleteAccount method', error);
    }
  }

  projectDialog() {
    this.projectNameExist = true;
    this.AccountSelectedForProject = true;
    this.projectNameValid = false;
    this.projectModal = true;
    this.selectedValue();
  }

  getLicense(rowdata) {
    this.msgs = []
    this.machinelistToView=[];

    this.projectId = rowdata.projectId;
    console.log('projectid - ', rowdata.projectId);
    try {
      this.http.get(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/getLicenseForm?productKey=' + this.productKey + '&projectID=' + rowdata.projectId).pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error In fetching license' }];
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
          this.jsonFile = res['JSON'];
          this.showNotification(this.msgs);
          console.log('license json - ', this.jsonFile);
        }
      });
      setTimeout(() => { this.licenseModal = true; }, 300);

    }
    catch (error) {
      this.log.error('In Exception of getLicense method', error);
    }
  }

  saveLicense(event) {
    this.msgs = []
    this.licenseModal = false;
    console.log('license data - ', event);
    // Chnages regarding the BUG 98524(SAAS| In license form, it should not accept higher start validity date than end validity date.)
    let StartDate = new Date(event['undefined']['General']['Validity Start Date']);
    let EndDate = new Date(event['undefined']['General']['Validity End Date']);
    if (StartDate > EndDate) {
      alert(
        'Start Time Cannot Be Greater Than End Time.'
      );
      return;
    }
    try {
      this.http.post(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saveLicenseForm?productKey=' + this.productKey + '&projectID=' + this.projectId, event).pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error In saving license' }];
        this.showNotification(this.msgs);

        if (res['status'] == 'success') {
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'license form Saved Successfully' }];
          this.forGettingListOfAcounts();
          this.showNotification(this.msgs);
        }
      });
    }
    catch (error) {
      this.log.error('In Exception of saveLicense method', error);
    }
  }

  forSavingProject(data) {
    this.msgs = []
    try {
      this.http.post(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/saveProject?productKey=' + this.productKey + '&accountId=' + this.accountIdSelected, data).pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
          if (res['message']) {
            //  this.messageService.add({severity: 'error', summary: 'Error!', detail: res['message'] });
             this.msgs = [{severity: 'error', summary: 'Error!', detail: res['message'] }];
      
          } else {
            this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'Eror IN  Saving Project' }];
          }
        }
        this.showNotification(this.msgs);

        if (res['status'] == 'success') {
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Project Saved Successfully' }];
          this.forGettingListOfAcounts();
          this.showNotification(this.msgs);
        }
      });
      this.selectedValue();
      this.projectModal = false;
      this.editProjectModal = false;
    }
    catch (error) {
      this.log.error('In Exception of forSavingProject method', error);
    }
  }


  editProjectDialog(rowdata) {
    this.machinelistToView=[];
    this.editProjectModal = true;
    this.projectNameExist = true;
    this.AccountSelectedForProject = true;
    this.projectNameValid = false;
    this.projectName = rowdata.col1
    this.accountName = rowdata.accountNameForProject;
    this.accountIdSelected = rowdata.accountIdForProject;
    this.projectDescription = rowdata.projectDescription;
    this.projectId = rowdata.projectId;
    this.licenseID = rowdata.licenseID;
    this.statusFlag = rowdata.statusFlag;
    this.selectedTypeOfProject = rowdata.col4;
  }

  selectedAllProject(rowdata) {
    this.enableGenerateProjectKeyMode = true;
    if (!this.selectedAllProjectRow) {
      this.selectedAllProjectRow = true;
      this.projectList.splice(0, this.projectList.length)
      for (let i = 0; i < rowdata.length; i++)      this.projectList.push({ 'projectId': rowdata[i].projectId, 'licenseID': rowdata[i].col5, 'statusFlag': rowdata[i].statusFlag, 'projectDescription': rowdata[i].projectDescription, 'projectKey': rowdata[i].col3, 'projectName': rowdata[i].col1, 'selectedTypeOfProject': rowdata[i].col4 })
    }
    else {
      this.projectList.splice(0, this.projectList.length)
      this.selectedAllProjectRow = false;
    }
  }

  unselectedproject(event) {
    if (this.projectList.length > 0) {
      for (let i = 0; i < this.projectList.length; i++) if (event.data.col1 === this.projectList[i].projectName) this.projectList.splice(i, 1);
    }
  }

  addProjects(event) {
    this.enableGenerateProjectKeyMode = true
    this.projectList.push({ 'projectId': event.data.projectId, 'statusFlag': event.data.statusFlag, 'projectDescription': event.data.projectDescription, 'projectKey': event.data.col3, 'projectName': event.data.col1, 'projectType': event.data.col4 })
  }

  generateProjectKeyList(dtObjProject:Table) {
    this.msgs = []
    if (this.enableGenerateProjectKeyMode) {
      if (this.projectList.length == 0) {
        this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'No Project Selected For Generating ProjectKey' }]
        return;
      }
      this.showNotification(this.msgs);
      let arrOfProjectList = [...this.projectList];
      let data = this.arrToConcat.concat(arrOfProjectList);
      this.http.post(this._config.$serverIP + 'DashboardServer/acl/EnterPrise/generateProjectKey?productKey=' + this.productKey, data).pipe(res => <any>res).subscribe(res => {
        if (res['status'] == 'failure') {
          this.msgs = [{ severity: 'error', summary: '!Error', detail: 'Error in generating project Keys' }];
        }
        this.showNotification(this.msgs);
        if (res['status'] == 'success') {
          this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Project Key Generated Successfully' }];
          this.forGettingListOfAcounts();
          this.selectedValue();
          this.showNotification(this.msgs);
        }
      });

      this.projectList.splice(0, this.projectList.length)

    }
    else {
      this.msgs = [{ severity: 'error', summary: 'Error!', detail: 'No Project Selected For Generating ProjectKey' }]
      this.showNotification(this.msgs);
    }
     dtObjProject.reset();
  }
  
  forGettingProjects(event) {
    this.projectlistToView = [];
    this.accountProjectMode = true;
    let accountName = event.data.col2;
    this.disableShowAllProject = false;
    if (this.toShowProject.length > 0)
      this.toShowProject.splice(0, this.toShowProject.length);

    this.accountList = [...this.forAccountProject];
    for (let i = 0; i < this.accountList.length; i++) {
      if (this.accountList[i].name === accountName) {
        if (this.accountList[i].object.projects.length == 0) {
          this.projectAvailable = false;
          return;
        }
        else {
          this.projectAvailable = true;
          for (let j = 0; j < this.accountList[i].object.projects.length; j++) this.toShowProject.push({ 'col1': this.accountList[i].object.projects[j].projectName,'col2': this.accountList[i].object.projects[j].projectDescription, "col3": this.accountList[i].object.projects[j].projectKey, "col4": this.accountList[i].object.projects[j].projectType, "col5": this.accountList[i].object.projects[j].licenseID, "statusFlag": this.accountList[i].object.projects[j].statusFlag, 'accountNameForProject': this.accountList[i].object.accountName, 'accountIdForProject': this.accountList[i].object.accountId, 'projectDescription': this.accountList[i].object.projects[j].projectDescription, 'projectId': this.accountList[i].object.projects[j].projectId })

        }
      }
    }
  }

  disableAccountProjectMode(event) {
    this.projectlistToView = [];
    this.accountProjectMode = false;
    this.projectAvailable = true;
    this.disableShowAllProject = true;
  }

  fetchAccounts(event: any) {
    if (event.target.value === '') return this.searchResultForAccount = [];

    this.searchResultForAccount = this.machinelist.filter((series) => {
      return series.col2.toLowerCase().includes(event.target.value.toLowerCase());
    })
  }

  fetchProjects(event: any) {
    if (event.target.value === '') return this.searchResultForProject = [];


    //this.accountProjectMode=false;
    if (this.accountProjectMode) {
      this.listToFetchProject = [...this.toShowProject]
    }
    else {
      this.accountProjectMode = false;
      this.listToFetchProject = [...this.machinelist1]
    }
    this.searchResultForProject = this.listToFetchProject.filter((series) => {
      console.log('seriesdata',series)
      return series.col1.toLowerCase().includes(event.target.value.toLowerCase());
    })
  }

  ngOnInit() {
   // this.hosturl = this.sessionService.session['dcData'].url;
    this.productKey =  this.sessionService.session.cctx.pk;
    this.username =  this.sessionService.session.cctx.u;
    this.forGettingListOfAcounts();
    this.items = [
      {label: 'Account', command: () => {
          this.accountDialog();
      }},
      {label: 'Project', command: () => {
          this.projectDialog();
      }},
  ];


  }

  ngInit() {

  }

  customSort(event: SortEvent, value: string) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });

    let timeoutId = setTimeout(() => {

      /*Checking previous paginator is true then need to set the old status of paginator*/
      if (value === 'project') {
        if (this.project !== 0) {
          this.dtObjProject.first = this.project;
        }
      }
      else if (value === 'projectSearch') {
        if (this.projectSearch !== 0) {
          this.dtObjProjectSearch.first = this.projectSearch;
        }
      }

      else if (value === 'account') {
        if (this.account !== 0) {
          this.dtObjAccount.first = this.account;
        }
      }

      else if (value === 'accountSearch') {
        if (this.accountSearch !== 0) {
          this.dtObjAccountSearch.first = this.accountSearch;
        }
      }


    }, 0);
  }
  paginate(event, value: string) {
    if (value === "project") {
      this.project = event.first;
    }
    else if (value === "projectSearch") {
      this.projectSearch = event.first;
    }
    else if (value === "account") {
      this.account = event.first;
    }
    else if (value === "accountSearch") {
      this.accountSearch = event.first;
    }

  }

  showNotification(msgs){
    this.messageService.addAll(msgs);
  }
}

