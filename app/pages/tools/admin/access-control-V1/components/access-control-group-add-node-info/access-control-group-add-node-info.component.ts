import { Component, OnInit } from '@angular/core';
import { AccesControlDataService } from '../../services/acces-control-data.service'
import { Subscription } from 'rxjs';
//import {MatDialogRef} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { CavConfigService } from '../../../../configuration/nd-config/services/cav-config.service';
import { AccessControlGroupInfo } from '../../interfaces/accesControl-groupCompnent';

@Component({
  selector: 'app-access-control-group-add-node-info',
  templateUrl: './access-control-group-add-node-info.component.html',
  styleUrls: ['./access-control-group-add-node-info.component.css']
})

export class AccessControlGroupAddNodeInfoComponent implements OnInit {
  selectedvalue = [];
  dataToPush = new Array();
  initialValue: AccessControlGroupInfo;
  dataSubscription: Subscription
  errorMessage: any[];
  pClusterToAdd: any;
  selectedGroupData: any;
  data = [];
  cols: any[]
  constructor(
    //public dialogRef: MatDialogRef<AccessControlGroupAddNodeInfoComponent>, 
    private _accessControlService: AccesControlDataService, private http: HttpClient, private _config: CavConfigService) { }
  ngOnInit() {
    this.data = JSON.parse(JSON.stringify(this._accessControlService.$accesControlGroupComp.projectClusterList));
    this.loadNodeInfoTable();
    this.dataToPush = JSON.parse(JSON.stringify(this.selectedvalue));
    this.cols = [
      { field: 'uiExternalDomain', header: 'DomainIP' },
      { field: 'externalDomain', header: 'EnvironmentName' },
      { field: 'envType', header: 'MachineType' }
    ];
  }

  updateNodeListInGroup() {
    try {
      if (this.dataToPush.length === 0) {
        this.errorMessage = [];
        this.errorMessage.push({ severity: 'error', summary: 'Error ', detail: 'Please select atLeast one project cluster before adding.' });
        return true;
      }
      let mappingArr: any;
      if (this.selectedGroupData['mapping'] === undefined) {
        mappingArr = this.addUserToNewGroup();
      } else {
        mappingArr = this.selectedGroupData['mapping']['projectCluster'];
        for (let i = 0; i < this.dataToPush.length; i++) {
          mappingArr.push(this.dataToPush[i]);
        }
      }
      this.selectedGroupData = mappingArr;
      let groupList = this._accessControlService.$accesControlGroupComp.groupList;
      let selGroup = this._accessControlService.$selectedGrp;
      for (let i = 0; i < groupList.length; i++) {
        if (selGroup === groupList[i]['name']) {
          if (groupList[i]['mapping'] === undefined) {
            groupList[i] = this.selectedGroupData;
          } else {
            groupList[i]['mapping']['projectCluster'] = this.selectedGroupData;
          }

        }
      }
      this._accessControlService.updateUser();
      // this.dialogRef.close();
    }
    catch (e) {

    }
  }


  addUserToNewGroup() {
    try {
      let capability = [];
      let user = [];
      let projectCluster = [];
      for (let i = 0; i < this.dataToPush.length; i++) {
        projectCluster.push(this.dataToPush[i]);
      }

      let finalMap = {
        'name': this.selectedGroupData['name'],
        'type': this.selectedGroupData['type'],
        'description': this.selectedGroupData['description'],
        'mapping': { 'user': user, 'capability': capability, 'projectCluster': projectCluster }
      };
      this.selectedGroupData = finalMap;
      console.error("new group by project cluster", finalMap);
      return finalMap;


    }
    catch (err) {

    }
  }

  handleClickForNode(event) {
    try {
      let selectedGroup = this._accessControlService.$selectedGrp;
      //let pClusterToAdd = {'uiExternalDomain' : event.data.uiExternalDomain , 'accountName' : event.data.externalDomain };
      this.dataToPush.push(event.data)
    }
    catch (e) {
    }
  }

  handleUnRowSelectForUser(event) {
    try {
      for (let i = 0; i < this.dataToPush.length; i++) {

        if (this.dataToPush[i]['uiExternalDomain'] === event.data.uiExternalDomain) {
          this.dataToPush.splice(i, 1);
        }
      }
    } catch (e) {
      console.error("Error while removing selected user from list -", e);
    }
  }

  loadNodeInfoTable() {
    try {
      let projectClusterList = JSON.parse(JSON.stringify(this._accessControlService.$accesControlGroupComp.groupList));
      let selectedGrup = this._accessControlService.$selectedGrp;
      for (let i = 0; i < projectClusterList.length; i++) {
        if (selectedGrup === projectClusterList[i]['name']) {
          this.selectedGroupData = projectClusterList[i];
          if (projectClusterList[i]['mapping'] === undefined || projectClusterList[i]['mapping'] === null) {
            continue;
          }
          projectClusterList = projectClusterList[i]['mapping']['projectCluster'];
          break;
        }
      }
      for (let i = 0; i < projectClusterList.length; i++) {

        let pLClusterToRemove = projectClusterList[i]['uiExternalDomain'];
        this.removeProjectClusterList(pLClusterToRemove);
      }
    } catch (e) {
      console.error(e);
    }
  }

  removeProjectClusterList(pCluster) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['uiExternalDomain'] === pCluster) {
        this.data.splice(i, 1);
      }
    }
  }

  addUserHeaderCheckBoxClick(event) {
    try {
      if (event.checked) {
        for (let i = 0; i < this.data.length; i++) {
          this.pClusterToAdd = { 'name': this.data[i]['externalDomain'], 'DoamainIp': this.data[i]['uiExternalDomain'] };
          this.dataToPush.push(this.pClusterToAdd);
        }
      } else {
        this.dataToPush = [];
      }
    } catch (e) {
      console.error('Error while adding all user to selected group - ', e);
    }
  }

  closeDialog() {
    //   this.dialogRef.close();
  }
}