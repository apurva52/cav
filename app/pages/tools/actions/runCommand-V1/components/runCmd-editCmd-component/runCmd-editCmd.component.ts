import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/httpService';
import { TabNavigatorService } from '../../services/tab-navigator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'rumCmd-editCmd',
  templateUrl: 'runCmd-editCmd.component.html',
  styleUrls: ['runCmd-editCmd.component.scss']
})

export class EditCmdComponent implements OnInit {
  data: any[];
  data2: any[];
  selectedCar1: string;
  display: boolean = false;
  modelpanelCaption: string = "Add Command";
  editAddGroupInfo: any = {};
  public editCmdRowData: any;
  tableHeaderInfo: any[];
  isShowColumnFilter: boolean = true;
  constructor(private httpService: HttpService,
    private tabNavigatorService: TabNavigatorService,
    private router: Router,) { }

  ngOnInit() {
    this.httpService.getCmdGrpList().subscribe(res => this.getTableFromJSON(res));
    this.tabNavigatorService.pushCmdJsonDataInTableJsonProvider$.subscribe(res => this.pushDataToUserDefinedTableJson(res))
    //On init ,disable action buttons
    document.getElementById('actionButtonDiv').style.opacity = "0.3";
    document.getElementById('actionButtonDiv').style.pointerEvents = "none";
    this.tableHeaderInfo = [
      { header: 'Group Name', field: 'Group Name', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Command Display Name', field: 'Command Display Name', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Actual Command', field: 'Actual Command', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Role', field: 'Role', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Server Type', field: 'Server Type', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Filter Keyword', field: 'Filter Keyword', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'View Type', field: 'View Type', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Is Header Contains', field: 'Is Header Contains', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Separator', field: 'Separator', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'CommandUIArgs', field: 'CommandUIArgs', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Max Inline Arguments', field: 'Max Inline Arguments', isSort: true, filter: { isFilter: true, type: "contains" } },
      { header: 'Description', field: 'Description', isSort: true, filter: { isFilter: true, type: "contains" } }
    ];
  }
  ngAfterView() {

  }
  //Filling data in User and System Defined Tables
  getTableFromJSON(res: any) {
    this.httpService.setcmdGroupList(res);
    //User Defined
    this.data2 = res["Table_View"]["User_Defined"];

    //System Defined
    this.data = res["Table_View"]["System_Defined"];
  }

  //Handle Tab Change
  handleTabChange(event) {
    if (event.index == 0) {
      document.getElementById('actionButtonDiv').style.opacity = "0.3";
      document.getElementById('actionButtonDiv').style.pointerEvents = "none";
    }
    else if (event.index == 1) {
      document.getElementById('actionButtonDiv').style.opacity = "1";
      document.getElementById('actionButtonDiv').style.pointerEvents = "";
    }
  }

  pushDataToUserDefinedTableJson(value) {
    let userCmdTable = this.data2;
    this.display = false;//hide the dialogue before pushing data to the table
    for (var x = 0; x < this.data2.length; x++) {
      if (this.data2[x]["rowId"] == value["rowId"]) {
        this.data2.splice(x, 1);
        this.data2.splice(x, 0, value);
        this.data2 = [...this.data2]
        return;
      }
    }
    if (Object.keys(value).length != 0) {
      this.data2 = this.immutablePush(this.data2, value);
    }
  }

  /**
   *This is pure js function to add element in immutable array.
   */
  immutablePush(arr, newEntry) {
    return [...arr, newEntry];
  }

  /**
   *This is pure js function delete the row from table
   */
  immutableDelete(arr, index) {
    arr.splice(index, 1);
    return arr = [...arr];
  }

  checkIfDataContainsStar() {
    for (var x = 0; x < this.data2.length; x++) {
      var data = this.data2[x]["Group Name"];
      var index = data.indexOf("*");
      if (index >= 0) {
        var newGroupName = data.substr(0, index).trim();
        this.data2[x]["Group Name"] = newGroupName;
      }
    }
  }

  saveUserDefinedCommandToServer() {
    this.checkIfDataContainsStar();
    var response = "";
    this.httpService.saveDataToServer(this.data2).subscribe(res => this.showSaveCmdOutput(res));
    this.clearAllAuditLogList();
  }
  showSaveCmdOutput(msg) {
    alert(msg.status);
  }
  showRunComaandAddDialog() {
    this.editAddGroupInfo = { "mode": "Add", "editValue": [], "groupInfo": this.httpService.getCmdGroupInfo() };
    this.display = true;
  }

  //used to clear all audit log array logs.
  clearAllAuditLogList() {
    this.httpService.addCommandForAuditLog = [];
    this.httpService.deleteRowForAuditLog = [];
    this.httpService.editRowForAuditLog = [];
  }

  //Disposing Current Tab
  closeTab() {
    this.tabNavigatorService.removeTabAction("101");
    this.router.navigate(['/run-command-V1/main']);
  }

  editRow(rowData) {
    this.modelpanelCaption = "Edit Command";
    this.editAddGroupInfo = { "mode": "Edit", "editValue": rowData, "groupInfo": this.httpService.getCmdGroupInfo() };
    this.display = true;
  }
  deleteRow(rowData, index) {
    this.data2 = this.immutableDelete(this.data2, index);
    this.httpService.deleteRowForAuditLog.push(rowData['Actual Command']);
  }

}
