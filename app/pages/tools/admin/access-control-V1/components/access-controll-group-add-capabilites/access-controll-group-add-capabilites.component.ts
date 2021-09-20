import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccesControlDataService } from '../../services/acces-control-data.service';
@Component({
  selector: 'app-access-controll-group-add-capabilites',
  templateUrl: './access-controll-group-add-capabilites.component.html',
  styleUrls: ['./access-controll-group-add-capabilites.component.css']
})
export class AccessControllGroupAddCapabilitesComponent implements OnInit {
  data = [];
  dataToPush: any;
  selectedvalue = [];
  selectedGroupData: any;
  errorMessage: any = [];
  tableHeaderInfo = [];

  constructor(
    private _dataservice: AccesControlDataService,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.tableHeaderInfo = [
      { header: 'Capabilities', valueField: 'name', isSort: true },
      { header: 'Description', valueField: 'description', isSort: false },
    ];
    this.data = JSON.parse(JSON.stringify(this._dataservice.$accesControlGroupComp.capabilityList));
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
          if (userlist[i]['mapping'] === undefined) {
            continue;
          }

          if (userlist[i]['mapping']['capability'])
            userlist = userlist[i]['mapping']['capability'];
        }
      }

      if (!userlist)
        return;

      if (this.selectedGroupData && !this.selectedGroupData.mapping)
        return;

      for (let i = 0; i < userlist.length; i++) {
        let usrToRemove = userlist[i]['name'];
        this.removeUserFromList(usrToRemove);
      }
    } catch (e) {
      console.error("Error in loading user table-- ", e);
    }
  }

  handleClickForUser(event) {
    try {
      let userToAdd = { 'name': event.data.name, 'id': event.data.id, 'description': event.data.description };
      this.dataToPush.push(userToAdd);
    } catch (e) {
      console.error('Error while adding capability in list - ', e);
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
      console.error('Error while removing  capability form list - ', e);
    }
  }

  updateUsersListInGroup() {
    try {
      if (this.dataToPush.length === 0) {
        this.errorMessage = [];
        this.errorMessage.push({ severity: 'error', summary: 'Error ', detail: 'Please select atLeast one Capability before adding.' });
        return true;
      }

      let mappingArr: any;
      if (this.selectedGroupData['mapping'] === undefined || !this.selectedGroupData['mapping']) {
        mappingArr = this.addCapabilityToNewGroup();
      } else {
        mappingArr = this.selectedGroupData['mapping']['capability'];

        if (!mappingArr) {
          mappingArr = [];
        }

        for (let i = 0; i < this.dataToPush.length; i++) {
          mappingArr.push(this.dataToPush[i]);
        }
      }
      this.selectedGroupData = mappingArr;

      let groupList = this._dataservice.$accesControlGroupComp.groupList;
      let selGroup = this._dataservice.$selectedGrp;
      for (let i = 0; i < groupList.length; i++) {

        if (selGroup === groupList[i]['name']) {
          if (groupList[i]['mapping'] === undefined || !groupList[i]['mapping']) {
            groupList[i] = this.selectedGroupData;
          } else {
            groupList[i]['mapping']['capability'] = this.selectedGroupData;
          }
        }
      }
      this._dataservice.updateUser();
      this.ref.close();
    } catch (e) {
      console.error("error in updating user list--- ", e);
    }
  }

  closeDialog() {
    this.ref.close();
  }

  removeUserFromList(capability) {
    if (!this.data)
      return;

    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['name'] === capability) {
        this.data.splice(i, 1);
      }
    }
  }

  addCapabilityToNewGroup() {
    try {
      let capability = [];
      let user = [];
      let projectCluster = [];
      for (let i = 0; i < this.dataToPush.length; i++) {

        capability.push(this.dataToPush[i]);
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

  addCapabilityHeaderCheckBoxClick(event) {
    try {
      if (event.checked) {
        for (let i = 0; i < this.data.length; i++) {
          let capabilityToAdd = { 'name': this.data[i]['name'], 'id': this.data[i]['id'], 'description': this.data[i]['description'] };
          this.dataToPush.push(capabilityToAdd);
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
      let userToAdd = { 'name': rowData.name, 'id': rowData.id, 'description': rowData.description };
      this.dataToPush.push(userToAdd);
    }
    else {
      this.dataToPush = [];
    }

  }
}
