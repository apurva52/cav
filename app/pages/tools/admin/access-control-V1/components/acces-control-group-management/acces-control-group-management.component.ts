import { Component, OnInit } from '@angular/core';
import { AccessControlGroupInfo } from '../../interfaces/accesControl-groupCompnent';
import { AccesControlDataService } from '../../services/acces-control-data.service'
import { Subscription } from 'rxjs';
import { GROUP_DATA_AVAILABLE, DELETE_GROUPS, SAVE_ALL_GROUP_DATA } from '../../constants/access-control-constants';
import { AccessControlGroupAddUserComponent } from '../access-control-group-add-user/access-control-group-add-user.component';
import { AccessControlGroupAddNodeInfoComponent } from '../access-control-group-add-node-info/access-control-group-add-node-info.component';
import { AccessControllGroupAddCapabilitesComponent } from '../access-controll-group-add-capabilites/access-controll-group-add-capabilites.component'
import { CanComponentDeactivate, AccessControlRoutingGuardService } from '../../services/access-control-routing-guard.service';
import { MODEL_ACTION_CANCEL, MODEL_ACTION_OK } from '../../constants/access-control-constants';
import { ModelWinDataInfo } from '../../containers/model-win-data-info';
import { AuthenticationService } from '../../../../../tools/configuration/nd-config/services/authentication.service';
import { Observable } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-acces-control-group-management',
  templateUrl: './acces-control-group-management.component.html',
  styleUrls: ['./acces-control-group-management.component.css']
})
export class AccesControlGroupManagementComponent implements OnInit, CanComponentDeactivate {
  /*Data Subscriber of service.*/
  dataSubscription: Subscription;
  cols: any;
  data = [];
  selectedvalue = [];
  dataForcapablities = [];
  initialValue: AccessControlGroupInfo;
  dataForUser = [];
  dataForProjectCluster = [];
  userArr = [];
  name: string;
  groupSource: string;
  groupName: string;
  errorMessage: any = [];
  isToEnableFiled = true;
  placeHolderForGrpName = '';
  placeHolderForGrpDis = '';
  disabledAddBtn = true;
  isToAddNewGroup = true;
  isToAddNewProjectCluster = true;
  previousGroupName = [];
  modelInfo = new ModelWinDataInfo();
  userCheckBoxValue = true;
  toShowClusterAddWindow: boolean;
  selectedGroupType: boolean = false;
  aclPermissionfrdisable = false;
  tableHeaderInfo: any[];
  ref: DynamicDialogRef;
  groupHeaderInfo: any[];
  userHeaderInfo: any[];
  capabilityHeaderInfo: any[];
  globalFilterFields1: string[] = [];
  globalFilterFields2: string[] = [];
  globalFilterFields3: string[] = [];
  rejectVisible: boolean = true;
  acceptLable: string = 'Ok';
  noRecordMsg: boolean = false;
  clusterHeaderInfo: any[];
  saasValue: any;

  constructor(
    private _dataservice: AccesControlDataService,
    private _routingguard: AccessControlRoutingGuardService,
    private _auth: AuthenticationService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sessionService: SessionService
  ) {
    if (parseInt(sessionStorage.aclAccessRight) <= 4) {
      this.aclPermissionfrdisable = true;
    }
    this._dataservice.loadSaveDataForGroupComp();

    if (sessionStorage.getItem('saasEnabled') == '1')
      this.toShowClusterAddWindow = true;

  }
  ngOnInit() {
    const me = this;
    try {
      me.saasValue = me.sessionService.preSession.saasEnabled;
      this.groupHeaderInfo = [
        { header: 'Group', valueField: 'name', isSort: true },
        { header: 'Type', valueField: 'type', isSort: false },
      ];
      this.userHeaderInfo = [
        { header: 'User', valueField: 'name' },
        { header: 'Type', valueField: 'type' },
        { header: 'DN', valueField: 'dn' },
      ];
      this.capabilityHeaderInfo = [
        { header: 'Capability', valueField: 'name' },
        { header: 'Description', valueField: 'description' },
      ];
      this.clusterHeaderInfo =[
        {header: 'Account Name', valueField:'name'},
        {header: 'DomainIP', valueField:'domainIp'},
      ];
      this.globalFilterFields1 = ['name', 'type'];
      this.globalFilterFields2 = ['name', 'type', 'dn'];
      this.globalFilterFields3 = ['name', 'description'];
      this.dataSubscription = this._dataservice.AccesscontrolRoleInfoProvider$.subscribe(
        action => {
          if (action === GROUP_DATA_AVAILABLE) {
            this.initialValue = this._dataservice.$accesControlGroupComp;
            this.loadTabels();
          }
          if (action === SAVE_ALL_GROUP_DATA) {
            this._dataservice.loadSaveDataForGroupComp();
            // this.loadTabels();
          }
        });
    } catch (e) {
      console.error('Error while getting data from Service  ', e);
    }
  }

  loadTabels() {
    try {
      this.selectedvalue = [];
      let groupInfo = this.initialValue.groupList;
      this.isToAddNewGroup = false;

      /**
       * This is to get data from LDAP Group
       */
      if (this._dataservice.$ldapGroupData) {
        let ldapGroupInfo: Object[] = this._dataservice.$ldapGroupData['groupList'];

        for (let kk = 0; kk < ldapGroupInfo.length; kk++) {
          groupInfo = groupInfo.filter(obj => {
            if (obj['name'] != ldapGroupInfo[kk]['name']) {
              return obj;
            }
            else {
              ldapGroupInfo[kk] = obj;
            }
          });

          groupInfo.push(ldapGroupInfo[kk]);
        }
      }

      this._dataservice.$accesControlGroupComp.groupList = groupInfo;
      this.data = groupInfo;
      setTimeout(() => {
       if(this.data && this.data.length == 0 )
          this.noRecordMsg = true;
        else
           this.noRecordMsg = false; 
      }, 1000);

      for (let i = 0; i < this.data.length; i++) {
        let selectedGrp = this._dataservice.$selectedGrp;
        if (selectedGrp !== undefined) {
          if (selectedGrp === this.data[i]['name']) {
            this.selectedvalue.push(this.data[i]);
            this.handleClickForGroup(this.data[i]);
          }
        } else {
          this.selectedvalue.push(this.data[0]);
          this.handleClickForGroup(this.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }


  handleClickForGroup(event) {
    try {
      let grpName = '';
      let userArray = '';
      this.selectedvalue = event;
      if (event.data !== undefined) {
        grpName = event.data.name;
        userArray = event.data['mapping'];
      } else {
        grpName = event.name;
        userArray = event['mapping'];
      }
      this.previousGroupName.push(grpName);
      let group = this.groupName;
      if (group !== undefined || group !== '' && event === undefined) {
        let groupNameToChange = this.previousGroupName[this.previousGroupName.length - 2];
        if (groupNameToChange !== group && group !== '' && this.isToAddNewGroup === false && groupNameToChange != undefined) {
          this.addGroup();
        }
        if (this.isToAddNewGroup === true && group !== '') {
          this.addGroup();
        }
      }
      this.dataForUser = [];
      this.dataForcapablities = [];
      this.dataForProjectCluster = [];
      this.isToAddNewGroup = false;
      //this.createNewGroup(this.selectedvalue);
      this.createNewGroup(event);
      this._dataservice.$selectedGrp = grpName;
      if (event.data !== undefined) {
        this.userCheckBoxValue = !(event.data['type']) ? true : (event.data['type'] == 'LDAP') ? false : true;
      } else {
        this.userCheckBoxValue = !(event['type']) ? true : (event['type'] == 'LDAP') ? false : true;
      }
      if (userArray === undefined) {
        return;
      }

      let userToAdd;
      let capbilitiesToAdd;
      let pClusterToAdd;
      userToAdd = userArray['user'];
      capbilitiesToAdd = userArray['capability'];
      pClusterToAdd = userArray['projectCluster'];
      this.putDataInTable(userToAdd, this.dataForUser);
      this.putDataInTable(capbilitiesToAdd, this.dataForcapablities);
      this.putDataInTable(pClusterToAdd, this.dataForProjectCluster)
    } catch (e) {
      console.error('error in selecting row-- ', e);
    }
  }

  putDataInTable(datatoAdd, tablename) {
    if (datatoAdd === undefined || !datatoAdd) {
      return;
    }

    for (let i = 0; i < datatoAdd.length; i++) {
      tablename.push(datatoAdd[i]);

    }
  }
  deleteselectedGroup(event, index) {
    this.removeGroupDetails(event);
  }


  createNewGroup(selectedGroup) {
    try {
      this.isToEnableFiled = false;
      this.selectedGroupType = false; //this check to handle case of LDAP

      if (selectedGroup == 'true') {
        this.dataForUser = [];
        this.dataForcapablities = [];
        this.dataForProjectCluster = [];
        this.isToAddNewGroup = true;
        this._dataservice.$selectedGrp = '';
      }
      if (this.isToAddNewGroup) {
        this.placeHolderForGrpName = 'Entre group';
        this.placeHolderForGrpDis = 'Entre Discription';
        this.disabledAddBtn = false;
        this.groupName = '';
        this.groupSource = '';
        this.selectedvalue = [];
        this.previousGroupName = [];
      } else {
        if (selectedGroup['name'] === undefined) {
          selectedGroup = selectedGroup[0];
        }
        this.groupName = selectedGroup['name'];
        this.groupSource = selectedGroup['description'];

        if (this.groupName === 'SystemDefault') {
          this.isToEnableFiled = true;
        } else {
          this.isToEnableFiled = (selectedGroup['type'] == 'LDAP') ? true : false;
        }
        this.selectedGroupType = (selectedGroup['type'] == 'LDAP') ? true : false;
      }
    } catch (e) {
      console.error("Error while creating new group-- ", e);
    }
  }

  addGroup() {
    try {

      let group = this.groupName;

      this.data = this.initialValue.groupList;

      let boolFlg = false;
      if (this.initialValue.groupList.length > 0) {
        boolFlg = this.validateNewGroupToAdd(group);
        if (boolFlg) {
          if (this.isToAddNewGroup) {
            let test = this.validateCharcterLengthInGroup();
            if (!test) {
              return;
            }
            this.data.push({ 'name': group, 'type': 'Native', 'description': this.groupSource });
          } else {
            this.updateGroup();
          }
        } else {
          this.showError('group is already present..\n Unique group can be added');
          return false;
        }
      } else {
        this.data.push({ 'name': group, 'type': 'Native', 'description': this.groupSource });
      }
    } catch (e) {
      console.error("error while adding Group-- ", e);
    }
  }



  saveData() {
    try {
      if (this.isToAddNewGroup) {
        if (this.groupName) {
          let test = this.validateCharcterLengthInGroup();
          if (!test) {
            return;
          }
          let flag = this.addGroup();
          if (flag == false) {
            return;
          }
        }
      }

      if (this.selectedvalue['name'] !== this.groupName || this.selectedvalue['description'] !== this.groupSource) {
        let groupNameToUpdate = this.selectedvalue['name'];
        let groupListObj = this.initialValue.groupList;
        for (let i = 0; i < groupListObj.length; i++) {
          if (groupNameToUpdate === groupListObj[i]['name']) {
            let test = this.validateCharcterLengthInGroup();
            if (!test) {
              return;
            }
            groupListObj[i]['name'] = this.groupName;
            groupListObj[i]['description'] = this.groupSource;
          }
        }
        let test = this.validateCharcterLengthInGroup();
        if (!test) {
          return;
        }
        if (this.groupName == "" || this.groupSource == "") {
          this.showError("Group Name or Description should not be blank.")
          return false;
        }
      }
      //this._dataservice.$selectedGrp = undefined;
      this.previousGroupName = [];
      this.isToAddNewGroup = false;
      this._dataservice.saveGroupData(this.initialValue);
      this.groupName = '';
      this.groupSource = '';
    } catch (e) {
      console.error("error while saving data-- ", e);
    }
  }

  addUser() {
    if (this.isToAddNewGroup) {
      if (this.groupName) {
        this.addGroup();
      }
      this._dataservice.$selectedGrp = this.groupName;
    }
    this.ref = this.dialogService.open(AccessControlGroupAddUserComponent, {
      width: '700px',
      header: 'Add Users'
      //disableClose: true
    });

    this.ref.onClose.subscribe(result => {
      let index = this.getIndexOfGroupByGroupName(this.groupName);
      if (this.isToAddNewGroup && this.initialValue.groupList[index]['mapping'] === undefined) {
        this.data.splice(index, 1);
        this.loadTabels();
        this.isToAddNewGroup = true;
      }

    });

  }

  addpClusters() {
    if (this.isToAddNewGroup) {
      if (this.groupName) {
        this.addGroup();
      }
      this._dataservice.$selectedGrp = this.groupName;
    }
    this.ref = this.dialogService.open(AccessControlGroupAddNodeInfoComponent, {
      width: '700px',
      // disableClose: true
    });

    this.ref.onClose.subscribe(result => {
      let index = this.getIndexOfGroupByGroupName(this.groupName);
      if (this.isToAddNewGroup && this.initialValue.groupList[index]['mapping'] === undefined) {
        this.data.splice(index, 1);
        this.loadTabels();
        this.isToAddNewGroup = true;
      }
    });

  }


  addCapabilities() {
    if (this.isToAddNewGroup) {
      if (this.groupName) {
        this.addGroup();
      }
      this._dataservice.$selectedGrp = this.groupName;
    }
    this.ref = this.dialogService.open(AccessControllGroupAddCapabilitesComponent, {
      width: '800px',
      header: 'Add Capabilities'
      //disableClose: true
    });
    this.ref.onClose.subscribe(result => {
      let index = this.getIndexOfGroupByGroupName(this.groupName);
      if (this.isToAddNewGroup && this.initialValue.groupList[index]['mapping'] === undefined) {
        this.data.splice(index, 1);
        this.loadTabels();
        this.isToAddNewGroup = true;
      }
    });
  }


  validateNewGroupToAdd(newGroup) {
    try {
      let status = false;
      for (let i = 0; i < this.initialValue.groupList.length; i++) {
        if (this.initialValue.groupList[i]['name'] === newGroup) {
          status = false;
          break;
        } else {
          status = true;
          continue;
        }

      }
      return status;
    } catch (e) {
      console.error("error in Validation -- ", e);
    }
  }

  updateGroup() {
    try {
      let test = this.validateCharcterLengthInGroup();
      if (!test) {
        return;
      }
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i]['name'] === this.previousGroupName[this.previousGroupName.length - 2]) {
          this.data[i]['name'] = this.groupName;
          this.data[i]['description'] = this.groupSource;
        }
      }
    } catch (e) {
      console.error("Error while updating Group-- ", e);
    }
  }

  deleteselectedUser(user) {
    try {
      let userNameToDelete = user.name;
      for (let i = 0; i < this.dataForUser.length; i++) {
        if (userNameToDelete === this.dataForUser[i]['name']) {
          this.dataForUser.splice(i, 1);
        }
      }
      this.removeThisCapFromMapping(userNameToDelete, 'user', this.dataForUser);
    } catch (e) {
      console.error('error while removing user == ', e);
    }
  }

  deleteselectedcapability(capability) {
    try {
      let capNameToDelete = capability.name;
      for (let i = 0; i < this.dataForcapablities.length; i++) {
        if (capNameToDelete === this.dataForcapablities[i]['name']) {
          this.dataForcapablities.splice(i, 1);
        }
      }

      this.removeThisCapFromMapping(capNameToDelete, 'capability', this.dataForcapablities);
    } catch (e) {
      console.error('error while removing capability -- ', e);
    }
  }

  deleteselectedCluster(pCluster) {
    try {
      let pClusterToDelete = pCluster.uiExternalDomain;
      for (let i = 0; i < this.dataForProjectCluster.length; i++) {
        if (pClusterToDelete === this.dataForProjectCluster[i]['uiExternalDomain']) {
          this.dataForProjectCluster.splice(i, 1);
        }
      }
      this.removeThisCapFromMapping(pClusterToDelete, 'projectCluster', this.dataForProjectCluster);
    } catch (e) {
      console.error('error while removing user == ', e);
    }
  }

  removeThisCapFromMapping(name, mappingType, tableName) {
    try {

      let selectedGrp = this._dataservice.$selectedGrp;
      let groupData = this.initialValue.groupList;
      for (let i = 0; i < groupData.length; i++) {
        if (selectedGrp === groupData[i]['name']) {
          let mappingData = groupData[i]['mapping'][mappingType];
          for (let i1 = 0; i1 < mappingData.length; i1++) {
            if (name === mappingData[i1]['name']) {
              mappingData.splice(i1, 1);
              this.initialValue.groupList[i]['mapping'][mappingType] = tableName;
            }
          }
          if (mappingType == 'projectCluster') {
            for (let a = 0; a < mappingData.length; a++) {
              if (name === mappingData[a]['uiExternalDomain']) {
                mappingData.splice(a, 1);
                this.initialValue.groupList[i]['mapping'][mappingType] = tableName;
              }
            }
          }


        }
      }

    } catch (e) {
      console.error('Error while removing from mapping', e);
    }
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {

    if (this._auth.$canDeactivatelogoutFlag) {
      this._auth.$canDeactivatelogoutFlag = false;
      return true
    }
    if (localStorage.$isTopreventConfirmBox == 'true') {
      return true;
    }

    this._dataservice.showConfirmBox("Are you sure you want to navigate away from this tab?", "Warning", true, "171px");

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


  validateCharcterLengthInGroup() {
    try {
      let value = true;
      if (this.groupName.length < 4 || this.groupName.length > 64) {
        this.showError("Please use between 4 and 64 characters for Group name");
        value = false;
      }
      if (this.groupSource.length > 256) {
        this.showError("Only 256 characters are allowed in Group description");
        value = false;
      }
      return value;
    } catch (error) {
      console.error('error while validating characters ', error);
    }
  }

  getIndexOfGroupByGroupName(name) {
    try {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i]['name'] === name) {
          return i;
        }
      }
    } catch (error) {
      console.error('error while getting index of group with name = ', name);
    }
  }

  getIndexOfLdapGroup(name) {
    try {
      if (!this._dataservice.$ldapGroupData || !this._dataservice.$ldapGroupData['groupList'])
        return -1;

      let ldapGrpArr = this._dataservice.$ldapGroupData['groupList'];
      return ldapGrpArr.findIndex(function (grpData, index) { return (grpData["name"] == name) });
    }
    catch (error) {
    }
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

  removeGroupDetails(event) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = 'Ok';

    me.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Delete Group',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (event.id === undefined) {
          this.data.splice(this.data.length - 1, 1);
        } else {
          this._dataservice.deleteGroups(event.id);
          try {
            let dataSubscription = this._dataservice.AccesscontrolRoleInfoProvider$.subscribe(
              action => {
                if (action === DELETE_GROUPS) {
                  let index1 = this.getIndexOfGroupByGroupName(event.name);
                  this.data.splice(index1, 1);

                  let ldapIndex = this.getIndexOfLdapGroup(event.name);
                  this._dataservice.$ldapGroupData['groupList'].splice(ldapIndex, 1);

                  //   this.initialValue.groupList.splice(index, 1);
                  this.initialValue.groupList = this.data;

                  if (this._dataservice.$selectedGrp === event.name) {
                    this._dataservice.$selectedGrp = undefined;
                  }

                  this.loadTabels();
                }
                dataSubscription.unsubscribe();
              });
          } catch (e) {
            console.error('Error while getting data from Service  ', e);
          }
        }
        this.groupName = '';
        this.groupSource = '';
      },
      reject: () => { },
    });
  }
}
