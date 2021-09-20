import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CapabilityDataInfo } from '../interfaces/capability-data-info';
import { ACCESSCONTROLLIST_REST_API_PATH, ADD_NEW_CAPABILITY, CAPABILITY_DATA_LIST, SAVE_CAPABILITY_DATA, DELETE_CAPABILITY, CUSTOM_NEXT_LEVEL_DATA, SAVE_ALL_GROUP, LOAD_DEFAULT_VALUES, DELETE_GROUPS_FROM_DB, SAVE_ALL_USER, DELETE_USERS_FROM_DB, LOAD_DEFAULT_VALUES_USER, REMOVE_USER_SESSION, LOAD_AUDIT_LOG_DATA, LOG_OUT_SESSION, REFRESH_CACHE, DOWNLOAD_AUDIT_LOG_DATA } from '../constants/rest-api-constant';
import { CUSTOM_NEXT_LEVEL_DATA_AVAILABLE_FOR_OLD, SAVE_ALL_USER_DATA, DELETE_USERS, USER_DATA_AVAILABLE, NEW_CAPABILITY_DATA_AVAILABLE, CAPABILITY_LIST_AVAILABLE, CUSTOM_NEXT_LEVEL_DATA_AVAILABLE, CAPABILITY_DELETED_SUCESSFULLY, GROUP_DATA_AVAILABLE, SAVE_ALL_GROUP_DATA, DELETE_GROUPS, UPDATE_CAPABILTY_DATA_AVAILABLE } from '../constants/access-control-constants';
import { AccessControlRestDataApiService } from '../services/access-control-rest-data-api.service';
import { AccessControlConfigDataServiceService } from '../services/access-control-config-data-service.service';
import { CanActivate } from "@angular/router";
import { AccessControlRoutingGuardService } from '../services/access-control-routing-guard.service';
import { AccessControlGroupInfo } from '../interfaces/accesControl-groupCompnent';
import { MODEL_TYPE_ALERT, MODEL_ACTION_CONFIRM, DELETION_UNSUCESSFULL, USER_SESSION_CLOSED_SUCESSFULLY, USER_SESSION_CLOSED_UNSUCESSFULLY, AUDIT_LOG_DATA_AVAILABLE, USER_MANAGEMENT, GROUP_MANAGEMENT, CAPABILITY_MANAGEMENT, AUDIT_LOG_DATA_SEARCH } from '../constants/access-control-constants';
import { ModelWinDataInfo } from '../containers/model-win-data-info';
import { ACLErrorCodes } from '../constants/access-control-error-codes-enum';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../configuration/nd-config/services/authentication.service';
//import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CavConfigService } from "../../../configuration/nd-config/services/cav-config.service";
//import { CavCommonUtils } from '../../../configuration/nd-config/services/cav-common-utils.service';
import { resolve } from 'url';
import { MessageService } from 'primeng';

@Injectable()
export class AccesControlDataService {
 // @BlockUI() blockUI: NgBlockUI;
  /*Observable string sources for user action.*/
  private AccesscontrolRoleService = new Subject<String>();

  /*Service Observable for getting derived window action changes.*/
  AccesscontrolRoleInfoProvider$ = this.AccesscontrolRoleService.asObservable();


  /*Observable string sources for user action.*/
  private AccesscontrolCapabilityService = new Subject<String>();

  /*Service Observable for getting derived window action changes.*/
  AccesscontrolCapabilityInfoProvider$ = this.AccesscontrolCapabilityService.asObservable();

  private modelActionService = new Subject<ModelWinDataInfo>();

  /*Service Observable for getting Progress Bar Toggle Action.*/
  modelActionProvider$ = this.modelActionService.asObservable();

  private capabilityData: CapabilityDataInfo[];
  // private updatedRoleData: RoleData[];
  private newcapabilitydefaultData: CapabilityDataInfo;
  private message: string;

  private selectedGrp: string;
  private accesControlGroupComp: AccessControlGroupInfo;
  modelAction: ModelWinDataInfo

  private modelReqservice = new Subject<ModelWinDataInfo>();

  modelReqProvider$ = this.modelReqservice.asObservable();

  navigateTab = new Subject<boolean>();
  naviagateTabProvider = this.navigateTab.asObservable();
  /*Observable string sources for user action.*/
  private AccesscontrolAuditLogService = new Subject<String>();

  /*Service Observable for getting derived window action changes.*/
  AccesscontrolAuditLogInfoProvider$ = this.AccesscontrolAuditLogService.asObservable();

  private clientConnectionKey = null;
  private activeSessions: number = 0;
  private activeUsers: number = 0;
  private activeUserList: any[] =[];
  public get $nextlevelComboboxData(): any {
    return this.nextlevelComboboxData;
  }

  public set $nextlevelComboboxData(value: any) {
    this.nextlevelComboboxData = value;
  }
  private nextlevelComboboxData: string[];

  private ldapAllGroupData: AccessControlGroupInfo;

  private isTopreventConfirmBox: boolean;

  private auditLogData: any[] = []

  private searchObj: [];
  //report
  private reportAuditLogData: any;

  constructor(private _config: AccessControlConfigDataServiceService,
    private _restAPI: AccessControlRestDataApiService,
    private modalService: AccessControlRoutingGuardService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _cavconfig: CavConfigService,
    //private _cavCommonUtils: CavCommonUtils,
    private _productConfig: CavConfigService, 
    private messageService: MessageService) { }


  public get $capabilityData(): CapabilityDataInfo[] {
    return this.capabilityData;
  }

  public set $capabilityData(value: CapabilityDataInfo[]) {
    this.capabilityData = value;
  }

  public get $newcapabilitydefaultData(): CapabilityDataInfo {
    return this.newcapabilitydefaultData;
  }

  public set $newcapabilitydefaultData(value: CapabilityDataInfo) {
    this.newcapabilitydefaultData = value;
  }

  public get $accesControlGroupComp(): AccessControlGroupInfo {
    return this.accesControlGroupComp;
  }

  public set $accesControlGroupComp(value: AccessControlGroupInfo) {
    this.accesControlGroupComp = value;
  }

  public get $selectedGrp(): string {
    return this.selectedGrp;
  }

  public set $selectedGrp(selectedGrp: string) {
    this.selectedGrp = selectedGrp;
  }

  public get $ldapGroupData(): any {
    return this.ldapAllGroupData;
  }

  public set $ldapGroupData(value) {
    this.ldapAllGroupData = value;
  }

  public get $isTopreventConfirmBox(): boolean {
    return this.isTopreventConfirmBox;
  }

  public set $isTopreventConfirmBox(value: boolean) {
    this.isTopreventConfirmBox = value;
  }

  fetchCapabiltyDatafromService() {
    try {

      let timeoutId = setTimeout(() => {
      //  this.blockUI.start("Loading capabilties data .......");
      }, 0);
      
      let capability_list_url = this._config.getURLWithBasicParamByRESTAPI(CAPABILITY_DATA_LIST);
      console.log(capability_list_url);
      let dataSubscription = this._restAPI.getDataByRESTAPI(capability_list_url, '').subscribe(
        result => {
          let timeoutId = setTimeout(() => {
          //  this.blockUI.stop();
          }, 100);
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
            return;

          }
          if (result.statusCode > 0) {
            if (result.statusCode == ACLErrorCodes.ERROR_IN_GETTING_CAPABILITY) {
              this.showError('Error in fetching Capability Data from Server');
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            return;
          } else {
            this.$capabilityData = result.data;
            this.AccesscontrolCapabilityService.next(CAPABILITY_LIST_AVAILABLE);
          }

        }, err => {
          let timeoutId = setTimeout(() => {
           // this.blockUI.stop();
          }, 100);
          console.log('Error while getting role list', err);
        },
        () => {
          let timeoutId = setTimeout(() => {
         //   this.blockUI.stop();
          }, 100);
          dataSubscription.unsubscribe();

        });
    } catch (e) {
      let timeoutId = setTimeout(() => {
      //  this.blockUI.stop();
      }, 100);
      console.log('Error in while requesting for Role List', e);
    }
  }

  deleteUsers(userId) {

    try {
      let loadDefVal = this._config.getURLWithBasicParamByRESTAPI(DELETE_USERS_FROM_DB);
      let param = '?&id=' + userId;

      let dataSubscription = this._restAPI.getDataByRESTAPI(loadDefVal, param).subscribe(
        result => {
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
            return;

          }
          if (result.statusCode > 0) {
            if (result.statusCode === 108) {
              this.showError('Error while deleting User from server')
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            this.AccesscontrolCapabilityService.next(DELETION_UNSUCESSFULL);
          } else {
            this.AccesscontrolRoleService.next(DELETE_USERS);
            this.showSuccess("User deleted Successfully");
          }
        }, err => { console.log('Error while deleting users list', err); },
        () => {
          dataSubscription.unsubscribe();

        })
    } catch (e) {
      console.log('Error in while requesting to delete users', e);
    }
  }


  fetchNewCapabilityData() {
    try {

      let newCapabilityUrl = this._config.getURLWithBasicParamByRESTAPI(ADD_NEW_CAPABILITY);
      let dataSubscription = this._restAPI.getDataByRESTAPI(newCapabilityUrl, '').subscribe(
        result => {
          if (result.statusCode > 0) {
            if (result['status'] == 400) {
              if(this._cavconfig.$samlEnabled)
              {
                window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
              }else{
              this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
              }
              sessionStorage.removeItem("productKey");  
                  localStorage.removeItem("productKey");
               return;

            }
            if (result.statusCode = ACLErrorCodes.ERROR_IN_CREATING_NEW_CAPABILITY) {
              this.showError('Error while fetching data for new capability');
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            return;
          }
          else {
            this.$newcapabilitydefaultData = result.data;
            this.AccesscontrolCapabilityService.next(NEW_CAPABILITY_DATA_AVAILABLE);

          }

        },
        err => { console.log('Error while getting create new role data ', err); },
        () => {
          dataSubscription.unsubscribe();

        })
    } catch (e) {
      console.log('Error while requesting data for create new role', e);
    }
  }

  saveDataforCapability(updatedCapabiltyList: any[]) {
    try {
      let capability_data_url = this._config.getURLWithBasicParamByRESTAPI(SAVE_CAPABILITY_DATA);
      this._restAPI.getDataFromRESTUsingPOSTReq(capability_data_url, '', updatedCapabiltyList)
        .subscribe(res => {
          if (res['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
             return;

          }

         // this.blockUI.stop();
          if (res.statusCode > 0) {
            if (res.statusCode == ACLErrorCodes.ERROR_IN_SAVING_CAPABILITY) {
              this.showError('Error while saving capability Data ');
            }
            if (res.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            return;
          } else {
            //BUG-96730 ACL | Getting wrong alert message when saving permission inside any capability.
            let errorMessage = "Permission added Successfully";
            this.showSuccess(errorMessage);
            this.AccesscontrolCapabilityService.next(UPDATE_CAPABILTY_DATA_AVAILABLE);
          }
        }
        );
    } catch (e) {
     // this.blockUI.stop();
      console.log('error while requesting for save data for role list', e);
    }
  }
  deleteCapabiltyfromCapabilitylist(capabilityId) {
    try {
      let capability_data_url = this._config.getURLWithBasicParamByRESTAPI(DELETE_CAPABILITY);
      let param = "?&id=" + capabilityId
      let dataSubscription = this._restAPI.getDataByRESTAPI(capability_data_url, param).subscribe(
        result => {
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
            return;

          }
          if (result.statusCode > 0) {
            if (result.statusCode == ACLErrorCodes.ERROR_IN_DELETING_CAPABILITY) {
              this.showError(result.errorMsg);
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            this.AccesscontrolCapabilityService.next(DELETION_UNSUCESSFULL);
            return;
          }
          this.AccesscontrolCapabilityService.next(CAPABILITY_DELETED_SUCESSFULLY);
        },
        err => { console.log('Error while deleting role data ', err); },
        () => {
          dataSubscription.unsubscribe();

        })
    } catch (e) {
      console.log('error while requesting for delete data from role list', e);
    }
  }


  fetchNextlevelOfIndices(level, path, isnewAdded) {

    let capability_data_url = this._config.getURLWithBasicParamByRESTAPI(CUSTOM_NEXT_LEVEL_DATA);
    let param
    path = updateLrmPath(path);
    if (path == ' ') {
      param = "?&level=" + encodeURIComponent(level) + "&path="
    }
    else {
      param = "?&level=" + encodeURIComponent(level) + "&path=" + encodeURIComponent(path);
    }

    let dataSubscription = this._restAPI.getDataByRESTAPI(capability_data_url, param).subscribe(
      result => {
        if (result['status'] == 400) {
          if(this._cavconfig.$samlEnabled)
          {
            window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
          }else{
          this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
          }
          sessionStorage.removeItem("productKey");  
                  localStorage.removeItem("productKey");
          return;

        }
        if (result.statusCode > 0) {
          if (result.statusCode == ACLErrorCodes.ERROR_IN_GETTING_CUSTOM_TABLE_DATA) {
            this.showError('Error while fetching next level of Data');
          }
          if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
            this.showError('Could not connect to postgres server :connection refused');
          }
          return;
        } else {
          this.$nextlevelComboboxData = result.data;
          sessionStorage.setItem('aclData',JSON.stringify(result.data));
        }
        if (isnewAdded) {
          this.AccesscontrolCapabilityService.next(CUSTOM_NEXT_LEVEL_DATA_AVAILABLE);
          console.log("accessControlCapa 1111111111111111  ",this.AccesscontrolCapabilityService);
        } else {
          this.AccesscontrolCapabilityService.next(CUSTOM_NEXT_LEVEL_DATA_AVAILABLE_FOR_OLD);
          console.log("22222222222222222222222  ",this.AccesscontrolCapabilityService);
        }
      })
  }


  loadSaveDataForGroupComp() {
    try {
      let timeoutId = setTimeout(() => {
      //  this.blockUI.start("Loading group data......");
      }, 0);
      
      let loadDefVal = this._config.getURLWithBasicParamByRESTAPI(LOAD_DEFAULT_VALUES);
      let dataSubscription = this._restAPI.getDataByRESTAPI(loadDefVal, '').subscribe(
        result => {

          let timeoutId = setTimeout(() => {
           // this.blockUI.stop();
          }, 100);         
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
             return;

          }
          if (result.statusCode > 0) {
            if (result.statusCode == ACLErrorCodes.ERROR_IN_GETTING_SAVED_GROUPS_FROM_DB) {
              this.showError('Error while fetching group data from server');
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            return;
          } else {
            this.$accesControlGroupComp = result.data;
            
            this.AccesscontrolRoleService.next(GROUP_DATA_AVAILABLE);
          }
        }, err => { console.log('Error while getting role list', err); 
        let timeoutId = setTimeout(() => {
       //   this.blockUI.stop();
        }, 100);  
        },
        () => {
          let timeoutId = setTimeout(() => {
         //   this.blockUI.stop();
          }, 100);
          dataSubscription.unsubscribe();
        });
    } catch (e) {
      let timeoutId = setTimeout(() => {
     //   this.blockUI.stop();
      }, 100);
      console.log('Error in while requesting for Role List', e);
    }
  }

  saveGroupData(data) {
    try {
      let loadDefVal = this._config.getURLWithBasicParamByRESTAPI(SAVE_ALL_GROUP);
      let dataSubscription = this._restAPI.getDataFromRESTUsingPOSTReq(loadDefVal, '', data).subscribe(
        result => {
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }
            else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
                  localStorage.removeItem("productKey");
            return;

          }
         // this.blockUI.stop();
          if (result.statusCode > 0) {
            if (result.statusCode == ACLErrorCodes.ERROR_IN_SAVING_GROUP_DATA_IN_DB) {
              this.showError('Error in saving group in server');
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            return;
          } else {
            this.$accesControlGroupComp = result;
            this.showSuccess("Group added Successfully");
            this.AccesscontrolRoleService.next(SAVE_ALL_GROUP_DATA);
          }
        }, err => {
        //  this.blockUI.stop();
          console.log('Error while getting role list', err);
        },
        () => {
          dataSubscription.unsubscribe();

        })
    } catch (e) {
     // this.blockUI.stop();
      console.log('Error in while requesting for Role List', e);
    }
  }

  loadSaveDataForUserComponent() {
    try {


      let timeoutId = setTimeout(() => {
      //  this.blockUI.start("Loading user data .......");
      }, 0);

      let loadDefVal = this._config.getURLWithBasicParamByRESTAPI(LOAD_DEFAULT_VALUES_USER);

      let dataSubscription = this._restAPI.getDataByRESTAPI(loadDefVal, '').subscribe(
        result => {

          let timeoutId = setTimeout(() => {
          //  this.blockUI.stop();
          }, 100);
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
            return;

          }
          if (result.statusCode > 0) {
            if (result.statusCode === 107) {
              this.showError("Error in getting data from server");
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
          }
          else {
            this.$accesControlGroupComp = result.data;
            this.AccesscontrolRoleService.next(SAVE_ALL_USER_DATA);
          }
        }, err => { let timeoutId = setTimeout(() => {
        //  this.blockUI.stop();
        }, 100);
          console.log('Error while getting user list', err); },
        () => {
          let timeoutId = setTimeout(() => {
          //  this.blockUI.stop();
          }, 100);
          dataSubscription.unsubscribe();
        });
    } catch (e) {
      let timeoutId = setTimeout(() => {
      //  this.blockUI.stop();
      }, 100);
      console.log('Error in while requesting for user List', e);
    }
  }

  loadLDAPUserData(result, isLdap: boolean) {
    if (isLdap) {
      this.$accesControlGroupComp = result.data;
      this.AccesscontrolRoleService.next("SAVE_LDAP_USER_DATA");
    }
    else {
      this.loadSaveDataForUserComponent();
    }
  }

  saveUserData(data) {
    try {
      let loadDefVal = this._config.getURLWithBasicParamByRESTAPI(SAVE_ALL_USER);

      let dataSubscription = this._restAPI.getDataFromRESTUsingPOSTReq(loadDefVal, '', data).subscribe(
        result => {
          if (result['status'] == 400) {
            console.log("Its 400");
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
           // this.showErrorMessage('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            this.showError("Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.");
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
            return;

          }
         // this.blockUI.stop();
          if (result.statusCode > 0) {
            console.log("statusCode > 0");
            if (result.statusCode === 109) {
              //this.showErrorMessage("Error while saving data in server");
              this.showError("Error while saving data in server");
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
             // this.showErrorMessage('Could not connect to postgres server :connection refused');
              this.showError("Could not connect to postgres server :connection refused");
            }
          } else {
            console.log("SuccessFull ");
            this.$accesControlGroupComp = result;
           // this.showErrorMessage("User(s) added Successfully");
            this.showSuccess("User(s) added Successfully");
            this.AccesscontrolRoleService.next(USER_DATA_AVAILABLE);
          }
        }, err => {
         // this.blockUI.stop();
          console.log('Error while getting users data list', err);
        },
        () => {
        //  this.blockUI.stop();
          dataSubscription.unsubscribe();

        })
    } catch (e) {
     // this.blockUI.stop();
      console.log('Error in while requesting for users data List', e);
    }
  }



  deleteGroups(groupsToDelete) {
    try {
      let loadDefVal = this._config.getURLWithBasicParamByRESTAPI(DELETE_GROUPS_FROM_DB);
      let param = '?&id=' + groupsToDelete;
      let dataSubscription = this._restAPI.getDataByRESTAPI(loadDefVal, param).subscribe(
        result => {
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
                  localStorage.removeItem("productKey");
            return;

          }
          if (result.statusCode > 0) {
            if (result.statusCode == ACLErrorCodes.ERROR_IN_DELETEING_GROUP_FROM_DB) {
              this.showError(result.errorMsg);
            }
            if (result.statusCode == ACLErrorCodes.ERROR_IN_CONNECTING_POSTGRES) {
              this.showError('Could not connect to postgres server :connection refused');
            }
            this.AccesscontrolRoleService.next(DELETION_UNSUCESSFULL);
          } else {
            this.$accesControlGroupComp = result;
            this.showSuccess('Group deleted Successfully');
            this.AccesscontrolRoleService.next(DELETE_GROUPS);
          }
        }, err => { console.log('Error while deleting groups list', err); },
        () => {
          dataSubscription.unsubscribe();

        })
    } catch (e) {
      console.log('Error in while requesting to delete groups', e);
    }
  }
  updateUser() {
    this.AccesscontrolRoleService.next(GROUP_DATA_AVAILABLE);
  }
  showErrorMessage(message: string) {
    this.modelAction = new ModelWinDataInfo();
    this.modelAction.modelAction = MODEL_TYPE_ALERT
    this.modelAction.errorMessage = message;
    //   this.modelActionService.next(this.modelAction);
    this.modelReqservice.next(this.modelAction);
  }

  /** This is to fill the Ldap Group Data */
  loadLdapGroupData(data) {
    this.$ldapGroupData = data;
    this.AccesscontrolRoleService.next(GROUP_DATA_AVAILABLE);
  }

  showConfirmBox(message: string, title: string = null, disablecheckbox: boolean = false, dialogHeight: string = "160px", dialogWidth: string = '400px', actionBtnName: string = null, cancelBtnName: string = null) {
    try {
      let modelData = new ModelWinDataInfo();
      modelData.message = message;
      modelData.modelAction = MODEL_ACTION_CONFIRM;

      /*Checking for title availability. */
      if (title === null) {
        title = '';
      }
      /*Checking for action button name. */
      if (actionBtnName === null) {
        actionBtnName = 'OK';
      }

      /*Checking for cancel button name. */
      if (cancelBtnName === null) {
        cancelBtnName = 'Cancel';
      }

      modelData.actionBtnName = actionBtnName;
      modelData.cancelBtnName = cancelBtnName;
      modelData.headerName = title;
      modelData.disableDialogCheckbox = disablecheckbox;
      modelData.height = dialogHeight;
      modelData.width = dialogWidth;
      this.modelReqservice.next(modelData);
    } catch (e) {
      console.error('Error while showing confirm dialog model.', e);
    }
  }


  handleModelAction(modelInfo: ModelWinDataInfo) {
    try {
      console.log('Handling model action.', modelInfo);
      this.modelActionService.next(modelInfo);
    } catch (e) {
      console.error('Error while handling model action.', e);
    }
  }
  logout() {
    if (this._cavconfig.$samlEnabled) {
      window.open(this._cavconfig.$serverIP + "/ProductUI/resources/pages/SamlLogout.html", "_self");
    } else {
      this.router.navigate(['/login']);
      sessionStorage.removeItem("sessUserName");		// Removing User Name
      sessionStorage.removeItem("sessUserPass");		// Removing user Password
      sessionStorage.clear();
      if (!this._cavconfig.$requestFromExtLink) {
        let _sqlUserName = localStorage.getItem('userName') + '@sql';
        let _sqlUserDefaultDS = localStorage.getItem(_sqlUserName);
        localStorage.clear();
        if (_sqlUserDefaultDS) {
          localStorage.setItem(_sqlUserName, _sqlUserDefaultDS);
        }
      }

    }
  }

  removeUserSessionforforceLogOut(sessUserName) {
    try {
      var activeDC = '';
      var url = this._cavconfig.getINSAggrPrefix();

      if (url.indexOf('node') != -1)
        activeDC = this._cavconfig.getActiveDC();

      if (url.indexOf('tomcat') != -1) {
        url = url.replace('tomcat', 'node');
        activeDC = "ALL";
      }

      let dcName = this._cavconfig.getActiveDC();

      let capability_data_url = '';
      if (sessionStorage.getItem('isMultiDCMode')) {
        capability_data_url = url + activeDC + ACCESSCONTROLLIST_REST_API_PATH + REMOVE_USER_SESSION;
      }
      else {
        capability_data_url = this._config.getURLWithBasicParamByRESTAPI(REMOVE_USER_SESSION);
      }

      let param = '?&userName=' + sessUserName;
      let dataSubscription = this._restAPI.getDataByRESTAPI(capability_data_url, param).subscribe(
        result => {
          if (result['status'] == 400) {
            if(this._cavconfig.$samlEnabled)
            {
              window.open(this._cavconfig.$serverIP+"/ProductUI/resources/pages/SamlLogout.html","_self");
            }else{
            this.showError('Session has been closed so no further operations can be performed. This may be due to idle timeout  or session has been closed forcefully.');
            }
            sessionStorage.removeItem("productKey");  
            localStorage.removeItem("productKey");
             this.AccesscontrolRoleService.next(USER_SESSION_CLOSED_SUCESSFULLY);
            return;

          }
          if (result.errorCode > 0) {
            if (result.errorCode == 900001) {
              this.showError("not able to remove");

            }
            if (result.errorCode == 900002) {
              this.showError('session is not valid');

            }
            this.AccesscontrolRoleService.next(USER_SESSION_CLOSED_UNSUCESSFULLY);
            return;
          }
          this.AccesscontrolRoleService.next(USER_SESSION_CLOSED_SUCESSFULLY);
          /* Need to Unsbscribe the Common Menu Subscribers*/
         // this._cavCommonUtils.unsubscribe();
          this.showSuccess("Session has been closed Successfully");
        },
        err => { console.log('Error while deleting role data ', err); },
        () => {
          dataSubscription.unsubscribe();

        })
    } catch (e) {
      console.log('error while requesting for delete data from role list', e);
    }
  }


  fetchAuditLogData(startTime, endtime, filterObj) {
    let logURl = this._config.getURLWithBasicParamByRESTAPIForGettingLogsInMultiDC(LOAD_AUDIT_LOG_DATA);
    let params = '';
    if (startTime != null && endtime != null) {
      params = "?startDate=" + startTime + '&endDate=' + endtime;
    }
    
    //this.blockUI.start();
    let dataSubscription = this._restAPI.getDataByRESTAPI(logURl, params).subscribe(result => {

      //this.blockUI.stop();
  
      //Reports
      this.reportAuditLogData = result;

      if (result.errorCode != 0) {
        if (result.errorCode == 119) {
          this.$auditLogData = [];
          this.$activeSessions = result.numberOfActiveSessions;
          this.$activeUsers = result.activeUsers;
          this.$activeUserList=result.activeUserList;     
          this.AccesscontrolAuditLogService.next(AUDIT_LOG_DATA_AVAILABLE);
          
        }
      }
      else {
        this.$auditLogData = result.logs;
        this.$activeSessions = result.numberOfActiveSessions;
        this.$activeUsers = result.activeUsers;
        this.$activeUserList=result.activeUserList;

        if(filterObj != null){
          this.searchObj = filterObj;
          this.AccesscontrolAuditLogService.next(AUDIT_LOG_DATA_SEARCH);
        } else {
          this.AccesscontrolAuditLogService.next(AUDIT_LOG_DATA_AVAILABLE);
        }

      }
    },
      err => { console.log('Error while deleting role data ', err); },
      () => {
        
        dataSubscription.unsubscribe();
      })
     
  }

  generateAuditLogReport(sDateTime, eDateTime) {
    try {
      let username = sessionStorage.getItem('sesLoginName');
      let testRun = sessionStorage.getItem('runningtest');
      let paremUrl = 'userName=' + username + '&testRun=' + testRun;
      if (sDateTime != undefined && eDateTime != undefined) {
        if (sDateTime != null && eDateTime != null)
          paremUrl += '&startDate=' + sDateTime + '&endDate=' + eDateTime;
      }
      let url = this._config.getHostURL() + '/DashboardServer/web/ReportRestServices/generateAuditLogReport?';

      let paremObj = this.reportAuditLogData;

      let appUrl = window.location.protocol + '//' + this._config.$host;
      if (this._config.$port != "") {
        appUrl = window.location.protocol + this._config.getHostURL();
      }
      paremObj['appUrl'] = appUrl;

      //this.blockUI.start();
      let dataSubscription = this._restAPI.getDataFromRESTUsingPOSTReq(url, paremUrl, paremObj).subscribe(
        result => {
         // this.blockUI.stop();
          window.open(this._config.getHostURL() + '/' + result['filePath']);
        },
        err => {
         // this.blockUI.stop();
          console.error('Error generateAuditLogReport data ', err);
          dataSubscription.unsubscribe();
        },
        () => {
         // this.blockUI.stop();
          dataSubscription.unsubscribe();
        }
      );

    }
    catch (error) {
      console.error("Error :", error);
    }

  }

  public get $auditLogData(): any[] {
    return this.auditLogData;
  }

  public set $auditLogData(value: any[]) {
    this.auditLogData = value;
  }

  public get $activeSessions(): number {
    return this.activeSessions;
  }

  public set $activeSessions(value: number) {
    this.activeSessions = value;
  }

  public get $activeUsers(): number {
    return this.activeUsers;
  }

  public set $activeUsers(value: number) {
    this.activeUsers = value;
  }


  public get $searchObj(): [] {
    return this.searchObj;
  }

  public set $searchObj(value: []) {
    this.searchObj = value;
  }


  public get $activeUserList(): any[] {
    return this.activeUserList;
  }

  public set $activeUserList(value:any[]) {
    this.activeUserList=value;
  }

  removeUsersessionOnLogOut() {
    var activeDC = '';
    var url = this._cavconfig.getINSAggrPrefix();

    if (url.indexOf('node') != -1)
      activeDC = this._cavconfig.getActiveDC();

    if (url.indexOf('tomcat') != -1) {
      url = url.replace('tomcat', 'node');
      activeDC = "ALL";
    }

    let dcName = this._cavconfig.getActiveDC();

    if (sessionStorage.getItem('isMultiDCMode')) {
      url = url + activeDC + ACCESSCONTROLLIST_REST_API_PATH + LOG_OUT_SESSION;
    }
    else {
      url = this._config.getURLWithBasicParamByRESTAPI(LOG_OUT_SESSION);
    }

    let dataSubscription = this._restAPI.getDataByRESTAPI(url, '').subscribe(
      result => {

        if (result.errorCode > 0) {
          if (result.errorCode == 900001) {
            this.showError("not able to remove");

          }
          if (result.errorCode == 900002) {
            this.showError('session is not valid');
            return;
          }
        }
        this.showSuccess("Session has been closed Successfully");

        /* Need to Unsbscribe the Common Menu Subscribers which are coming from dashboard Actions*/
        dataSubscription.unsubscribe();

        /* Need to Unsbscribe the Common Menu Subscribers*/
       // this._cavCommonUtils.unsubscribe();
      },

      err => {
        console.log('Error while deleting role data ', err);
        dataSubscription.unsubscribe();
      },
      () => {
        dataSubscription.unsubscribe();

      })


  }

  refreshDatabase(entity) {
    let url = this._config.getURLWithBasicParamByRESTAPI(REFRESH_CACHE);
    let dataSubscription = this._restAPI.getDataByRESTAPI(url, "").subscribe(result => {

      if (result && result.status && result.status == "success") {
        if (entity === USER_MANAGEMENT) {
          this.loadSaveDataForUserComponent();
        } else if (entity == GROUP_MANAGEMENT) {
          this.loadSaveDataForGroupComp()
        } else if (entity == CAPABILITY_MANAGEMENT) {
          this.fetchCapabiltyDatafromService();
        }
      } else {
        this.showError("Error in refreshing cache");
      }
     // this.blockUI.stop();

    })
  }

  removeUsersessionOnRouterError() {
    let url = this._config.getURLWithBasicParamByRESTAPI(LOG_OUT_SESSION);
    let dataSubscription = this._restAPI.getDataByRESTAPIByHttp(url, '').subscribe(
      result => {

        if (result.errorCode > 0) {
          if (result.errorCode == 900001) {
            this.showError("not able to remove");

          }
          if (result.errorCode == 900002) {
            this.showError('session is not valid');
            return;
          }
        }
        this.showSuccess("Session has been closed Successfully");
        dataSubscription.unsubscribe();
      },

      err => {
        console.log('Error while deleting role data ', err);
        dataSubscription.unsubscribe();
      },
      () => {
        dataSubscription.unsubscribe();

      })


  }

  /**Method to download the logs */
  downloadLog(downloadType: String, filteredRow: any, fieldArr: any, header: any,dateTime:any,filterValues:any) {

    let url = this._config.getURLWithBasicParamByRESTAPI(DOWNLOAD_AUDIT_LOG_DATA);
    let username = sessionStorage.getItem('sesLoginName');
    let testRun = sessionStorage.getItem('runningtest');
    let timestamp = new Date().getTime();

    this.clientConnectionKey = this._productConfig.$clientConnectionKey;
    if (this.clientConnectionKey === null || this.clientConnectionKey === undefined) {
      this.clientConnectionKey = username + '.' + testRun + '.' + timestamp;
    }
    let object =
    {
      data: JSON.stringify(filteredRow),
      downloadType: downloadType,
      fieldArr: fieldArr,
      header: header,
      productName: sessionStorage.getItem('sessServerTitle'),
      clientConnectionKey: this.clientConnectionKey,
      dateTime : dateTime,
      filterValues : filterValues
    }
    let dataSubscription = this._restAPI.getDataFromRESTUsingPOSTReq(url, '', object).subscribe(
      res => (this.openDownloadLogs(res)));


  }

  /*This method is used to open the downloaded data*/
  openDownloadLogs(res) {
    window.open('' + this._cavconfig.getURLByActiveDC() + 'common/' + res['status']);
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }
}

function updateLrmPath(path: any) {
  if(path == "Alert Configuration")
    return "Alert Settings";
  else
    return path;
}

