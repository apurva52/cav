import { Component, OnInit } from '@angular/core';
import { AccesControlDataService } from '../../services/acces-control-data.service'
import { Subscription } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng';

@Component({
  selector: 'app-access-control-group-add-user',
  templateUrl: './access-control-group-add-user.component.html',
  styleUrls: ['./access-control-group-add-user.component.css']
})
export class AccessControlGroupAddUserComponent implements OnInit {
  dataSubscription: Subscription;
  data = [];
  dataToPush: any;
  userToAdd: any;
  selectedGroupData: any;
  errorMessage: any = [];

  selectedvalue = [];
  tableHeaderInfo: any[];
  constructor(
    private _dataservice: AccesControlDataService,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.tableHeaderInfo = [
      { header: 'User', valueField: 'name', isSort: true },
      { header: 'Type', valueField: 'type', isSort: false },
      { header: 'DN', valueField: 'dn', isSort: false },
    ];
    this.data = JSON.parse(JSON.stringify(this._dataservice.$accesControlGroupComp.userList));
    this.loadUserTable();
    this.dataToPush = JSON.parse(JSON.stringify(this.selectedvalue));
  }

  loadUserTable() {
    try {
      let userlist = JSON.parse(JSON.stringify(this._dataservice.$accesControlGroupComp.groupList));
      let selectedGrup = this._dataservice.$selectedGrp;

      for (let i = 0; i < userlist.length; i++) {
        if (selectedGrup === userlist[i]['name']) {
          this.selectedGroupData = userlist[i];
          if (userlist[i]['mapping'] === undefined || userlist[i]['mapping'] === null) {
            continue;
          }
          userlist = userlist[i]['mapping']['user'];
          break;
        }
      }
      for (let i = 0; i < userlist.length; i++) {
        let usrToRemove = userlist[i]['name'];
        // if (userlist[i]['mapping'] === undefined) {
        //   continue;
        // }
        this.removeUserFromList(usrToRemove);
      }

    } catch (e) {
      console.error("error in loading user table-- ", e);
    }
  }
  handleClickForUser(event) {
    try {
      let selectedGrup = this._dataservice.$selectedGrp;
      let userToAdd = { 'name': event.data.name, 'id': event.data.id, 'dn': event.data.dn, 'type': event.data.type };
      this.dataToPush.push(userToAdd);
    } catch (e) {
      console.error('Error while adding user in list - ', e);
    }
  }

  handleUnRowSelectForUser(event) {
    try {
      for (let i = 0; i < this.dataToPush.length; i++) {
        if (this.dataToPush[i]['name'] === event.data.name) {
          this.dataToPush.splice(i, 1);
        }
      }
    } catch (e) {
      console.error("Error while removing selected user from list -", e);
    }
  }

  updateUsersListInGroup() {
    try {
      if (this.dataToPush.length === 0) {
        this.showError("Please select atLeast one User before adding.");
        return true;
      }
      let mappingArr: any;
      if (this.selectedGroupData['mapping'] === undefined) {
        mappingArr = this.addUserToNewGroup();
      } else {
        mappingArr = this.selectedGroupData['mapping']['user'];
        for (let i = 0; i < this.dataToPush.length; i++) {

          mappingArr.push(this.dataToPush[i]);
        }
      }
      this.selectedGroupData = mappingArr;

      let groupList = this._dataservice.$accesControlGroupComp.groupList;
      let selGroup = this._dataservice.$selectedGrp;
      for (let i = 0; i < groupList.length; i++) {
        if (selGroup === groupList[i]['name']) {
          if (groupList[i]['mapping'] === undefined) {
            groupList[i] = this.selectedGroupData;
          } else {
            groupList[i]['mapping']['user'] = this.selectedGroupData;
          }
        }
      }
      this._dataservice.updateUser();
      this.ref.close();
    } catch (e) {
      console.error("error in updating users list-- ", e);
    }
  }

  removeUserFromList(userName) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['name'] === userName) {
        this.data.splice(i, 1);
      }
    }
  }

  addUserToNewGroup() {
    try {
      let capability = [];
      let user = [];
      let projectCluster = [];
      for (let i = 0; i < this.dataToPush.length; i++) {
        user.push(this.dataToPush[i]);
      }

      let finalMap = {
        'name': this.selectedGroupData['name'],
        'type': this.selectedGroupData['type'],
        'description': this.selectedGroupData['description'],
        'mapping': { 'user': user, 'capability': capability, 'projectCluster': projectCluster }
      };
      this.selectedGroupData = finalMap;
      return finalMap;
    } catch (e) {
      console.error('Error while adding user to newly created group ', e);
    }
  }

  closeDialog() {
    this.ref.close();
  }

  addUserHeaderCheckBoxClick(event) {
    try {
      let userList = this._dataservice.$accesControlGroupComp.userList;
      if (event.checked) {
        for (let i = 0; i < this.data.length; i++) {
          let userToAdd = { 'name': this.data[i]['name'], 'id': this.data[i]['id'], 'dn': this.data[i]['dn'], 'type': this.data[i]['type'] };
          this.dataToPush.push(userToAdd);
        }
      } else {
        this.dataToPush = [];
      }
    } catch (e) {
      console.error('Error while adding all user to selected group - ', e);
    }
  }

  gettingData(event, rowData) {
    if (event.checked) {
      let userToAdd = { 'name': rowData.name, 'id': rowData.id, 'dn': rowData.dn, 'type': rowData.type };
      this.dataToPush.push(userToAdd);
    }
    else {
      this.dataToPush = [];
    }
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }
}
