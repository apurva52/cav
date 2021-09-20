import { Component, OnInit } from '@angular/core';
import { CanComponentDeactivate, AccessControlRoutingGuardService } from '../../services/access-control-routing-guard.service';
import { Observable } from 'rxjs';
import { ModelWinDataInfo } from '../../containers/model-win-data-info';
import { MODEL_ACTION_CANCEL, MODEL_ACTION_OK } from '../../constants/access-control-constants';
import { ConfirmationService, MessageService } from 'primeng';
import { AccessControlRestDataApiService } from '../../services/access-control-rest-data-api.service';
import { AccessControlConfigDataServiceService } from '../../services/access-control-config-data-service.service';
import { AccesControlDataService } from '../../services/acces-control-data.service'
import { Subscription } from 'rxjs';
import { DELETE_USERS, SAVE_ALL_USER_DATA, USER_DATA_AVAILABLE } from '../../constants/access-control-constants';
import { AccessControlGroupInfo } from '../../interfaces/accesControl-groupCompnent';
import { AccessControlUserPasswordComponent } from '../access-control-user-password/access-control-user-password.component';
import { GET_LDAP_GROUP_OF_USER } from '../../constants/rest-api-constant';
import { AuthenticationService } from '../../../../../tools/configuration/nd-config/services/authentication.service';
import { Router } from '@angular/router';
import * as encrypt from 'jsencrypt/bin/jsencrypt.min';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';

@Component({
  selector: 'app-acces-control-user-management',
  templateUrl: './acces-control-user-management.component.html',
  styleUrls: ['./acces-control-user-management.component.css'],
})
export class AccesControlUserManagementComponent implements OnInit, CanComponentDeactivate {
  /*Data Subscriber of service.*/
  dataSubscription: Subscription;
  modelInfo = new ModelWinDataInfo();
  initialValue: AccessControlGroupInfo;

  searchUser = '';
  userName = '';
  userEMail = '';
  userMobile = '';
  userDN = '';
  userCheckBoxValue = true;
  userInformation: any;
  userInfo = [];
  sourceValue = '';
  newPassword = '';
  confirmPassword = '';
  userID = -1;
  /* It contains the value of selected user Objects when selected */
  selectedUserObject: any;
  highlightedUser = [];

  userNamesObject: any[] = [];

  groupUserObject: any; 

  capabilityObject = [];

  isToEnableUserInformation = true;
  istoAddInformationInUserTable = false;
  errorMessage: any = [];
  chkLdapSearch: boolean = false;
  enabledisableUserdetails = false
  userType = '';
  height = "340px";
  aclPermissionfrdisable = false;
  loggedinUser: string;
  istoenableguard = true;
  isUpdatePAssword = false;
  nativeUsersearch = ''
  tableHeaderInfo: any[];
  groupHeaderInfo: any[];
  capabiltiyHeaderInfo: any[];
  ref: DynamicDialogRef;
  globalFilterFields1: string[] = [];
  globalFilterFields2: string[] = [];
  rejectVisible: boolean = true;
  acceptLable: string = 'Ok';
  user: any;
  noRecordMsg: boolean = false;

  constructor(private _restAPI: AccessControlRestDataApiService,
    private _config: AccessControlConfigDataServiceService,
    private _dataservice: AccesControlDataService,
    private _routingguard: AccessControlRoutingGuardService,
    private _auth: AuthenticationService,
    private _router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private confirmationService: ConfirmationService
  ) {
    this.loggedinUser = sessionStorage.sesLoginName;
    if (parseInt(sessionStorage.aclAccessRight) <= 4) {
      this.aclPermissionfrdisable = true;
    }
    this._dataservice.loadSaveDataForUserComponent();
  }

  ngOnInit() {
     this.user = this.sessionService.session.cctx.u;
    try {
      this.tableHeaderInfo = [
        { header: 'User', valueField: 'name', isSort: true },
        { header: 'Type', valueField: 'type', isSort: false },
        { header: 'DN', valueField: 'dn', isSort: false },
      ];
      this.groupHeaderInfo = [
        { header: 'Group', valueField: 'name' },
        { header: 'Type', valueField: 'type' },
      ];
      this.capabiltiyHeaderInfo = [
        { header: 'Capability', valueField: 'name' },
        { header: 'Description', valueField: 'description' },
      ];
      this.globalFilterFields1 = ['name', 'type'];
      this.globalFilterFields2 = ['name', 'description'];
      this.dataSubscription = this._dataservice.AccesscontrolRoleInfoProvider$.subscribe(
        action => {
          if (action === USER_DATA_AVAILABLE) {
            this._dataservice.loadSaveDataForUserComponent();       
          }
          if (action === SAVE_ALL_USER_DATA) {
            this.initialValue = this._dataservice.$accesControlGroupComp;
            this.userNamesObject = this.initialValue.userList;
            setTimeout(() => {
              if(this.userNamesObject && this.userNamesObject.length == 0 )
                 this.noRecordMsg = true;
               else
                  this.noRecordMsg = false; 
             }, 1000);
            this.onRowSelect(this.userNamesObject[0], true)
          }
          else if (action === "SAVE_LDAP_USER_DATA") {
            this.initialValue = this._dataservice.$accesControlGroupComp;
            this.userNamesObject = !(this.initialValue) ? [] : this.initialValue.userList;

            if (this.userNamesObject.length > 0) {
              this.selectedUserObject = null;
              this.onRowSelect(this.userNamesObject[0], true)
            }
            else {
              this.showDefaultValue();
            }
          }
        });
    } catch (e) {
      console.error('Error while getting data from Service for user ', e);
    }
  }

  deleteUserDetails(event) {
    this.removeUserDetails(event);
  }


  showDefaultValue() {
    this.selectedUserObject = null;
    this.userName = '';
    this.userDN = '';
    this.userEMail = '';
    this.userMobile = '';
    this.sourceValue = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.selectedUserObject = null;
    this.groupUserObject = [];
    this.capabilityObject = [];
    this.userType = '';
    this.userID = -1;
  }

  showSelectedUserInformation(selectedUserObject) {
    this.userName = selectedUserObject.name;
    this.confirmPassword = selectedUserObject.confirmPassword;
    this.newPassword = selectedUserObject.newPassword;
    this.sourceValue = selectedUserObject.type;
    this.userMobile = selectedUserObject.mobile;
    this.userDN = selectedUserObject.dn;
    this.userEMail = selectedUserObject.email;
    this.userID = selectedUserObject.id;
    this.height = "340px";
    this.userType = selectedUserObject.type
    if (this.userName === 'Cavisson' || this.userName === 'cavisson' || this.userName === 'guest' || this.userName === 'nsrepo.cavisson') {
      this.enabledisableUserdetails = true
    } else if (this.sourceValue == 'LDAP') {
      this.enabledisableUserdetails = true
    } else {
      this.enabledisableUserdetails = false;
    }
  }


  selectCheckBoxValue() {

    if (this.userCheckBoxValue) {
      this.sourceValue = 'Native';
    } else {
      this.sourceValue = 'LDAP';
    }

  }

  AddUserDetails(selectedUserBooleanValue) {


    if (selectedUserBooleanValue) {
      this.isToEnableUserInformation = false;
      this.istoAddInformationInUserTable = true;
      this.userName = '';
      this.userDN = '';
      this.userEMail = '';
      this.userMobile = '';
      this.sourceValue = 'Native';
      this.newPassword = '';
      this.confirmPassword = '';
      this.selectedUserObject = null;
      this.groupUserObject = [];
      this.capabilityObject = [];
      this.enabledisableUserdetails = false;
      this.height = '286px';
      this.userType = 'Native';
      this.userID = -1
      this.userCheckBoxValue = true;
    }

  }

  onRowSelect(event: any, newDataFlag) {
    try {
      if (this.selectedUserObject != undefined && this.selectedUserObject !== null && Object.keys(this.selectedUserObject.length > 0)) {

        if (!(this.selectedUserObject['type'] == 'LDAP')) {

          if (this.validateUserDetails()) {
            return;
          }
          if (this.EMailValidation()) {
            return;
          }
        }
        this.selectedUserObject.name = this.userName;
        this.selectedUserObject.newPassword = this.newPassword;
        this.selectedUserObject.confirmPassword = this.confirmPassword;
        this.selectedUserObject.email = this.userEMail;
        this.selectedUserObject.type = this.sourceValue;
        this.selectedUserObject.mobile = this.userMobile;
        this.selectedUserObject.dn = this.userDN;
        this.selectedUserObject.userUpdate = this.isUpdatePAssword;

      }

      this.isUpdatePAssword = false;
      if (newDataFlag) {
        this.selectedUserObject = event;
        this.highlightedUser = event;
      } else {
        this.selectedUserObject = event.data;
      }

      this.showSelectedUserInformation(this.selectedUserObject);

      //this.istoAddInformationInUserTable = false;
      this.istoAddInformationInUserTable = !(this.selectedUserObject) ? false : (this.selectedUserObject['type'] == 'LDAP') ? true : false;
      //this.isToEnableUserInformation = false;
      this.isToEnableUserInformation = !(this.selectedUserObject) ? false : (this.selectedUserObject['type'] == 'LDAP') ? true : false;

      //this is to check the LDAP User, if selected, then need to disbale the Native Check box from GUI
      this.userCheckBoxValue = !(this.selectedUserObject) ? true : (this.selectedUserObject['type'] == 'LDAP') ? false : true;

      let selectedUserName = this.selectedUserObject.name;

      for (let i = 0; i < this.userNamesObject.length; i++) {

        let userName = this.userNamesObject[i].name;

        if (userName === selectedUserName) {
          let mappingObject = this.userNamesObject[i].mapping;

          if (mappingObject === undefined || !mappingObject) {

            this.groupUserObject = [];
            this.capabilityObject = [];
            return;
          } else {
            this.userNamesObject[i].name = this.userName;
            this.userNamesObject[i].confirmPassword = this.confirmPassword;
            this.userNamesObject[i].newPassword = this.newPassword;
            this.userNamesObject[i].dn = this.userDN;
            this.userNamesObject[i].mobile = this.userMobile;
            this.userNamesObject[i].type = this.sourceValue;
            this.userNamesObject[i].email = this.userEMail;

            this.groupUserObject = !(mappingObject.group) ? [] : mappingObject.group;
            this.capabilityObject = !(mappingObject.capability) ? [] : mappingObject.capability;
          }
        }
      }
    } catch (e) {
      console.error("Error while selecting row== ", e);
    }
  }

  EMailValidation() {
    try {

      let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (emailFormat.test(this.userEMail)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.error("Error in email validation-- ", e);
    }
  }

  validateUserName(userNameValue, userID) {
    if (this.userNamesObject != null) {

      for (let i = 0; i < this.userNamesObject.length; i++) {
        if (this.userID == this.userNamesObject[i].id) {
          continue;
        }
        if (userNameValue === this.userNamesObject[i].name) {
          return true;
        }

      }
    }
    return false;

  }

  validateUserDetails() {
    let testregex = /[ $%^*()+\=\[\]{};':"\\|,<>\/?]/;
    let passregex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,64})$/;
    if (this.userName.length < 4 || this.userName.length > 30) {
      this.showError("Please use between 4 and 30 characters for user name.Please use only letters (a-z), numbers, and special character ( periods ,!,-,_,@,#,&  ) for user name.");
      return true;
    } else if (this.validateUserName(this.userName, this.userID)) {
      this.showError("This User name is Taken . Please specify different user Name");
      return true;
    } else if (this.userName.indexOf(' ') >= 0) {
      this.showError("Please use only letters (a-z), numbers, and special character (periods ,!,-,_,@,#,& ) for user name.");
      return true;
    } else if (this.userName.indexOf('..') >= 0) {
      this.showError('A fan of punctuation! Alas, User name cannot have consecutive periods for eg "Cavisson.."');
      return true;
    } else if (testregex.test(this.userName)) {
      this.showError("Please use only letters (a-z), numbers, and special character (periods ,!,-,_,@,#,&) for user name.");
      return true;
    }

    if (this.userEMail === 'undefined' || this.userEMail === '' || this.EMailValidation()) {
      this.showError("Please enter the valid user Email Id");
      return true;
    }

    if (this.userMobile === 'undefined' || this.userMobile === '' || this.userMobile == null) {
      this.showError("Please enter the Mobile No.");
      return true;
    }
    if (! /^\d+$/.test(this.userMobile)) {
      this.showError("Please enter numeric values in mobile number. Alphabets and special characters are not allowed.");
      return true;
    }
    if (this.userMobile.toString().length != 10) {
      this.showError("Please enter 10 digit Mobile no");
      return true
    }
    if (this.istoAddInformationInUserTable) {
      if (this.newPassword === 'undefined' || this.newPassword === '') {
        this.showError("Please enter the new password ");
        return true;
      } else if (this.newPassword.length < 8 || this.newPassword.length > 64) {
        this.showError("Please use between 8 and 64 Alphanumeric characters and special character For Password");
        return true;
      }

      if (this.confirmPassword === 'undefined' || this.confirmPassword === '') {
        this.showError("Please enter the confirm password ");
        return true;
      }

      else if (!passregex.test(this.newPassword)) {
        this.showError("Password must be containing 8-64 characters including minimum 1(A-Z),1(a-z),1(0-9) and special symbols like ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ `{ | }~");
        return true;
      }
      if (this.confirmPassword !== this.newPassword) {
        this.showError("Confirm password is not same as New password . Please Enter same Password");
        return true;
      }
    }

    return false;
  }

  createNewUserDetails() {

    if (this.sourceValue === "" || this.sourceValue === undefined) {
      this.sourceValue = "LDAP";
    }
    let publicMetadata = this.sessionService.preSession.publicKey;
    if (publicMetadata != 'NA') {
      let encryptAPI = new encrypt.JSEncrypt();
      encryptAPI.setKey(publicMetadata);
      this.newPassword = encryptAPI.encrypt(this.newPassword);
      this.confirmPassword = this.newPassword;
    }


    this.userInformation = {

      'dn': this.userDN,
      'name': this.userName,
      'type': this.sourceValue,
      'newPassword': this.newPassword,
      'confirmPassword': this.confirmPassword,
      'email': this.userEMail,
      'mobile': this.userMobile,
      'userUpdate': true
    };

    this.userNamesObject.push(this.userInformation);

  }


  saveData() {
    try {
      //This is to handle, if LDAP user is there, then no need to save data in DataBase
      if (!this.sourceValue || this.sourceValue == 'LDAP') {
        return;
      }

      if (this.validateUserDetails()) {
        return;
      }
      if (this.istoAddInformationInUserTable) {
        this.createNewUserDetails();

      } else {
        this.selectedUserObject.name = this.userName;
        this.selectedUserObject.confirmPassword = this.confirmPassword;
        this.selectedUserObject.newPassword = this.newPassword;
        this.selectedUserObject.dn = this.userDN;
        this.selectedUserObject.mobile = this.userMobile;
        this.selectedUserObject.type = this.sourceValue;
        this.selectedUserObject.email = this.userEMail;
        this.selectedUserObject.userUpdate = this.isUpdatePAssword;
      }

      this.initialValue.userList = this.userNamesObject;
      this._dataservice.saveUserData(this.initialValue);
      this.isUpdatePAssword = false;
    } catch (e) {
      console.error("error while saving data-- ", e);
    }

  }


  /**Method to search user  */
  searchData(str) {
    try {
      let strToSend = str.trim();
      if (strToSend.includes('#')) {
        strToSend = strToSend.replace('#', '%23');
      } else if (strToSend.includes('&')) {
        strToSend = strToSend.replace('&', '%26');
      }
      if (this.chkLdapSearch) {
        let url = this._config.getURLWithBasicParamByRESTAPI(GET_LDAP_GROUP_OF_USER);
        let param = '?&search=' + strToSend;
        let dataSubscription = this._restAPI.getDataByRESTAPI(url, param).subscribe(
          result => {
            if (result) {
              if (result['statusCode'] && result['statusCode'] == '102') {
                alert('LDAP Configuration is not enabled.');
                return;
              }
            }
            this._dataservice.loadLDAPUserData(result, this.chkLdapSearch);
          });
      }
      else {
        if (strToSend == "") {
          this.selectedUserObject = null;
          this._dataservice.loadSaveDataForUserComponent();
        }
      }

    } catch (e) {
      console.error('error ', e);
    }
  }

  openChangePasswdWindow() {
    this.ref = this.dialogService.open(AccessControlUserPasswordComponent, {
      header: 'Change Password',
      width: '400px',
      height: '235px',
      // disableClose: true,
      data: { password: this.newPassword }
    });

    this.ref.onClose.subscribe(result => {
      if (result) {
        this.isUpdatePAssword = true;
        this.newPassword = result;
        this.confirmPassword = result;
        this.showSuccess("Password changed successfully . Please save user to save password ");
      }
    });
  }
 

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {

    if (this._auth.$canDeactivatelogoutFlag) {
      this._auth.$canDeactivatelogoutFlag = false;
      return true
    }
    if (localStorage.$isTopreventConfirmBox == 'true') {
      return true;
    }
    if (!this.istoenableguard) {
      return true;
    }
    this._dataservice.showConfirmBox("Are you sure you want to navigate away from this tab?", "Warning", true, '171px');
    let modelsubscription = this._dataservice.modelActionProvider$.subscribe(
      actn => {

        modelsubscription.unsubscribe();
        if (actn.modelAction == MODEL_ACTION_OK) {
          this.modelInfo.modelAction = MODEL_ACTION_OK;

          this._routingguard.handleModelAction(this.modelInfo);
          this._dataservice.navigateTab.next(true);

          return true;
        }
        else if (actn.modelAction == MODEL_ACTION_CANCEL) {
          this.modelInfo.modelAction = MODEL_ACTION_CANCEL
          this._routingguard.handleModelAction(this.modelInfo);
          this._dataservice.navigateTab.next(false);
          return false;
        }


      })
    return this._dataservice.naviagateTabProvider;
  }
  //This function is called to re-fill the user table, if Seach in Ldap check-box is disabled.
  ldapSearchEvent(): void {

    if (!this.chkLdapSearch) {
      this.selectedUserObject = null;
      this.nativeUsersearch = '';
      this._dataservice.loadSaveDataForUserComponent();
    }
    else {
      this.searchUser = '';
    }

  }

  removeUserfromSession(event) {
    this.removeForceLogout(event);
  }

  openAuditLog() {
    this._router.navigate(['/audit-logs']);
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  removeUserDetails(event) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = 'Ok';

    me.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Delete User',
      icon: 'pi pi-info-circle',
      accept: () => {
        this._dataservice.deleteUsers(event.id);
        let dataSubscription = this._dataservice.AccesscontrolRoleInfoProvider$.subscribe(
          actn => {
            if (actn === DELETE_USERS) {
              let index = this.userNamesObject.map(function (e) { return e.id }).indexOf(event.id);
              let deleteduserobj = this.userNamesObject.splice(index, 1);
              if (deleteduserobj[0].name == this.loggedinUser) {
                this._dataservice.logout();
                this.istoenableguard = false;
              }
              if (event.id == this.userID) {
                this.selectedUserObject = null;
                this.userName = '';
                this.userDN = '';
                this.userEMail = '';
                this.userMobile = '';
                this.sourceValue = 'Native';
                this.newPassword = '';
                this.confirmPassword = '';
                this.selectedUserObject = null;
                this.groupUserObject = [];
                this.capabilityObject = [];
                this.userType = '';
                this.userID = -1;
              }

            }
            dataSubscription.unsubscribe();
          });
      },
      reject: () => { },
    });
  }


  removeForceLogout(event) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = 'Ok';

    me.confirmationService.confirm({
      message: 'Are you sure you want to forcefully logout the session ?',
      header: 'Log Out',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.sessionService.forceLogout(event.name).subscribe((state: Store.State) => {
          let index = this.userNamesObject.map(function (e) { return e.id }).indexOf(event.id);
          this.userNamesObject[index].sessionActive = false;
          this.showSuccess("Session forced logout successfully.");
          if(me.user === event.name)
             me._router.navigate(['/login']);

       }, (error) => {
          console.error("error --------  ", error);
        });
      },
      reject: () => { },
    });
  }
}
