import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Columns } from '../../interface/columns';
import { TabNavigatorService } from '../../services/tab-navigator.service';
import { HttpService } from '../../services/httpService';

@Component({
  selector: 'app-add-command',
  templateUrl: './add-command.component.html',
  styleUrls: ['./add-command.component.css']
})
export class AddCommandComponent implements OnInit {

  @Input() editAddGroupInfo;
  public displayFlag: boolean;

  /*Models */
  groupNameValueModel: string = "Archival";
  commandDisplayValueModel: string = "";
  actualCommandValueModel: string = "";
  filterKeyWordValueModel: string = "";
  selectedSeparatedValueModel: string = "NA";
  selectedHeaderOption: string = "YES";
  viewTypeValueModel: string = "Text";
  selectedRoleModel: string = "Standard";
  serverTypeModel: string[];
  descriptionValueModel: string = "";
  buttonTypeValueModel: string = "TextBox";
  inlineArgumentsValueModel: number = 4;


  /*DropDown Arrays*/
  IsHeaderValue: SelectItem[];
  IsSeparatorValues: SelectItem[];
  ViewTypeValues: SelectItem[];
  RoleValues: SelectItem[];
  ServerValues: SelectItem[];
  CommandGroupValues: SelectItem[];
  CommandArgumentRecords: Columns[];
  DomComponentsOptions: SelectItem[];

  /*Other variables*/
  selectedRowIndex: number;
  index: number;
  tableHeaderInfo: any[];
  constructor(private tabNavigatorService: TabNavigatorService, private httpService: HttpService) {
    this.CommandArgumentRecords = [];
    this.index = -1;
    this.pushCommandGroupValues();
    this.pushHeaderOptions();
    this.pushSeparatorValues();
    this.pushViewTypeValues();
    this.pushRoleValues();
    this.pushServerValues();
    this.pushDomComponentOptions();
    this.tableHeaderInfo = [
      { label: 'Button Type', field: 'Button Type' },
      { label: 'Label', field: 'label' },
      { label: 'Command Arguments', field: 'commandArgument' },
      { label: 'Default Value', field: 'defaultValue' },
      { label: 'Min Value', field: 'minValue' },
      { label: 'Max Value', field: 'maxValue' },
      { label: 'List', field: 'list' },
    ];
  }

  addCmdArgumentsInTable() {
    this.index = this.index + 1;
    let tableRow = { "defaultValue": "", "minValue": "DISABLED", "maxValue": "DISABLED", "list": "DISABLED", "index": this.index, "selectedValue": "TextBox", "label": "", "commandArgument": "" };
    this.CommandArgumentRecords = this.immutablePush(this.CommandArgumentRecords, tableRow);
  }

  deleteCmdArgumentsFromTable(event) {
    var index = event.index;
    for (var i = 0; i < this.CommandArgumentRecords.length; i++) {
      if (this.CommandArgumentRecords[i].index == index) {
        this.CommandArgumentRecords = this.immutableDelete(this.CommandArgumentRecords, i);
      }
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
    return arr.slice(0, index).concat(arr.slice(index + 1))
  }

  pushSeparatorValues() {
    this.IsSeparatorValues = [];

    var separatorArr = ['NA', 'Tab', 'Space', 'Comma', 'Pipe', 'Semicolon', 'Hash', 'Colon', 'Dollar', 'Dash', 'BackSlash'];
    this.pushElementInArray(this.IsSeparatorValues, separatorArr);

  }

  pushHeaderOptions() {
    this.IsHeaderValue = [];
    var headerValuesArr = ["YES", "NO"];
    this.pushElementInArray(this.IsHeaderValue, headerValuesArr);
  }

  pushViewTypeValues() {
    this.ViewTypeValues = [];
    var viewTypeValuesArr = ["Text", "Tabular"];
    this.pushElementInArray(this.ViewTypeValues, viewTypeValuesArr);
  }

  pushRoleValues() {
    this.RoleValues = [];
    var rowValuesArr = ["Standard", "Admin", "All"];
    this.pushElementInArray(this.RoleValues, rowValuesArr);
  }

  pushServerValues() {
    this.ServerValues = [];
    var serverValuesArr = ["Linux", "LinuxEx", "Solaris", "Windows", "AIX_Shared_LPAR", "AIX_Dedicated_LPAR"];
    this.pushElementInArray(this.ServerValues, serverValuesArr);
  }

  pushCommandGroupValues() {
    this.CommandGroupValues = [];
    var commandGroupValuesArr = ["Archival", "File System", "Network Management", "Process Management", "System Commands", "Memory Management", "System Management", "CavMon Command"];
    this.pushElementInArray(this.CommandGroupValues, commandGroupValuesArr);
  }

  pushDomComponentOptions() {
    this.DomComponentsOptions = [];
    var domComponentArr = ["TextBox", "TextBoxNumeric", "Spinner", "ListBox", "CheckBox", "RadioButton"];
    this.pushElementInArray(this.DomComponentsOptions, domComponentArr);
  }

  pushElementInArray(newArr, arr) {
    for (var i = 0; i < arr.length; i++) {
      newArr.push({ label: arr[i], id: i + 1, value: arr[i] });
    }
  }

  pickDomComponent(rowIndex, data, event) {
    this.changeSelectedValueInTableJson(event.value, rowIndex);
  }

  changeSelectedValueInTableJson(value, index) {
    for (var i = 0; i < this.CommandArgumentRecords.length; i++) {
      if (this.CommandArgumentRecords[i].index == index) {
        this.setRowValuesAccToButtonType(i, value, this.CommandArgumentRecords[i]);
        break;
      }
    }
  }

  setRowValuesAccToButtonType(rowIndex, value, arr: Columns) {
    if (value == "TextBox") /** TextBox T T T F F F */ {
      this.doEnableDisableCell(arr, "", "", "", "DISABLED", "DISABLED", "DISABLED");
    }
    else if (value == "TextBoxNumeric") /** TextBoxNumeric T T T T T F*/ {
      this.doEnableDisableCell(arr, "", "", "", "", "", "DISABLED");
    }
    else if (value == "Spinner") /** Spinner T T T T T F*/ {
      this.doEnableDisableCell(arr, "", "", "", "", "", "DISABLED");
    }
    else if (value == "ListBox") /** ListBox T T T F F T */ {
      this.doEnableDisableCell(arr, "", "", "", "DISABLED", "DISABLED", "");
    }
    else if (value == "CheckBox") /** CheckBox T T F F F F*/ {
      this.doEnableDisableCell(arr, "", "", "DISABLED", "DISABLED", "DISABLED", "DISABLED");
    }
    else if (value == "RadioButton") /** RadioBuiton F F T F F T*/ {
      this.doEnableDisableCell(arr, "DISABLED", "DISABLED", "", "DISABLED", "DISABLED", "");
    }
    else /** Default T T T T T T */ {
      this.doEnableDisableCell(arr, "", "", "", "", "", "");
    }
  }
  /**This method will set the column enable disable functionality*/
  doEnableDisableCell(arr: Columns, label, commandArgument, defaultValue, minValue, maxValue, list) {
    arr.label = label;
    arr.commandArgument = commandArgument;
    arr.defaultValue = defaultValue;
    arr.minValue = minValue;
    arr.maxValue = maxValue;
    arr.list = list;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    /**Two modes are there.... */
    /**Add Command Mode */

    /**Edit Command Mode */
    if (this.editAddGroupInfo.mode == 'Edit') {
      //populate table Data
      this.populateTableData(this.editAddGroupInfo.editValue);
    }
  }

  populateTableData(obj) {
    this.groupNameValueModel = obj["Group Name"];
    this.commandDisplayValueModel = obj["Command Display Name"];
    this.actualCommandValueModel = obj["Actual Command"];
    this.filterKeyWordValueModel = obj["Filter Keyword"];
    this.selectedSeparatedValueModel = obj["Separator"];
    this.selectedHeaderOption = obj["Is Header Contains"];
    this.viewTypeValueModel = obj["View Type"];
    this.selectedRoleModel = obj["Role"];
    this.serverTypeModel = obj["Server Type"].split(",");
    this.descriptionValueModel = obj["Description"];
    this.inlineArgumentsValueModel = parseInt(obj["Max Inline Arguments"]);
    var cmdArgsObj = obj["CommandUIArgsJson"];
    //var cmdArgsObj1 = obj.CommandUIArgsJson;
    this.CommandArgumentRecords = cmdArgsObj;
  }

  closeAddEditDialog() {
    this.tabNavigatorService.pushCmdJsonDataInTableJson({});
  }
  eventApplyData() {
    var rowData;
    try {
      if (this.isValidData() && this.validateCommandArgsTableInput()) {
        rowData = this.getDataFromFields();
        /**validate rowData */
        if (Object.keys(this.editAddGroupInfo.groupInfo["Select_View"]).indexOf(rowData["Group Name"]) >= 0) {
          if (this.editAddGroupInfo.mode == 'Edit') {
            /**to get the same id which we got from userdefined table */
            rowData["rowId"] = this.editAddGroupInfo.editValue["rowId"];
            // rowData = [...rowData]; // For bug Id: 41086
            if (this.httpService.editRowForAuditLog.indexOf(rowData['Actual Command']) <= -1)
              this.httpService.editRowForAuditLog.push(rowData['Actual Command']);
          }
          else {
            var cmdList = Object.keys(this.editAddGroupInfo.groupInfo["Select_View"][rowData["Group Name"]]);
            for (var i = 0; i < cmdList.length; i++) {
              if (rowData["Command Display Name"] == cmdList[i]) {
                alert("Command Name already exist")
                return false;
              }
            }
          }
        } else if (Object.keys(this.editAddGroupInfo.groupInfo["Select_View"]).indexOf(rowData["Group Name"]) == -1 && this.editAddGroupInfo.mode == 'Edit') {
          rowData["rowId"] = this.editAddGroupInfo.editValue["rowId"];
        }

        if (this.editAddGroupInfo.mode == "Add")
          this.httpService.addCommandForAuditLog.push(rowData['Actual Command']);

        this.tabNavigatorService.pushCmdJsonDataInTableJson(rowData);
      }
    }
    catch (e) {
      console.error("Error from apply - " + e);
    }
  }

  getValueFromTable(): string {
    var dataFromParseTable = "";
    try {
      for (var i = 0; i < this.CommandArgumentRecords.length; i++) {
        var tmpRowValue = "";
        var dataObj = this.CommandArgumentRecords[i];
        if (dataObj.selectedValue == "CheckBox") {
          tmpRowValue = "$CheckBox(\"" + dataObj.label + "\"," + "\"" + dataObj.commandArgument + "\")";
        }
        else if (dataObj.selectedValue == "TextBox") {
          tmpRowValue = "$TextBox(\"" + dataObj.label + "\",\"" + dataObj.commandArgument + "\",\"" + dataObj.defaultValue + "\")";
        }

        else if (dataObj.selectedValue == "Spinner") {

          tmpRowValue = "$Spinner(\"" + dataObj.label + "\"," + "\"" + dataObj.commandArgument + "\"," + "\"" + dataObj.defaultValue + "\"," + "\"" + dataObj.minValue + "\"," + "\"" + dataObj.maxValue + "\")";

        }
        else if (dataObj.selectedValue == "ListBox") {
          tmpRowValue = "$ListBox(\"" + dataObj.label + "\"," + "\"" + dataObj.commandArgument + "\"," + "\"" + dataObj.defaultValue + "\"," + "\"" + dataObj.list + "\")";
        }

        else if (dataObj.selectedValue == "RadioButton") {
          tmpRowValue = "$RadioButton(\"" + dataObj.defaultValue + "\"," + "\"" + dataObj.list + "\")";
        }
        else if (dataObj.selectedValue == "TextBoxNumeric") {
          tmpRowValue = "$TextBoxNumeric(\"" + dataObj.label + "\"," + "\"" + dataObj.commandArgument + "\"," + "\"" + dataObj.defaultValue + "\"," + "\"" + dataObj.minValue + "\"," + "\"" + dataObj.maxValue + "\")";
        }

        dataFromParseTable = dataFromParseTable + tmpRowValue;
      }

    }
    catch (e) {
      console.error(e);

    }
    if (String(dataFromParseTable).trim() == "")
      dataFromParseTable = "NA";

    return dataFromParseTable;
  }

  getCommandUIArgsJson(): any {
    var cmdArgsJsonArray = [];
    for (var i = 0; i < this.CommandArgumentRecords.length; i++) {
      var tableDataObj = this.CommandArgumentRecords[i];
      var cmdArgsJsonObj = {
        "commandArgument": tableDataObj.commandArgument, "buttonType": tableDataObj.selectedValue, "label": tableDataObj.label,
        "defaultValue": tableDataObj.defaultValue, "minValue": tableDataObj.minValue, "maxValue": tableDataObj.maxValue, "list": tableDataObj.list, "selectedValue": tableDataObj.selectedValue
      };
      cmdArgsJsonArray.push(cmdArgsJsonObj);
    }
    return cmdArgsJsonArray;
  }
  getCheckedServersValueFromComboBox(selectedServerArr): string {
    var selectedServerCommaSeparated = "";
    for (var i = 0; i < selectedServerArr.length; i++) {
      if (i == 0)
        selectedServerCommaSeparated = selectedServerCommaSeparated + selectedServerArr[i];
      else
        selectedServerCommaSeparated = selectedServerCommaSeparated + "," + selectedServerArr[i];
    }
    return selectedServerCommaSeparated;
  }
  refreshSeparator() {
    if (this.viewTypeValueModel == 'Tabular') {
      this.IsSeparatorValues.shift();
      this.selectedSeparatedValueModel = "Space";
    }
    else {
      this.pushSeparatorValues();
      this.selectedSeparatedValueModel = "NA";
    }
  }
  getDataFromFields(): any {
    var data = "";
    var txtFilterData = "";
    var commandUIArgs = "";
    var obj = {};
    var CommandUIArgsJson = this.getCommandUIArgsJson();
    var selectedServer = this.getCheckedServersValueFromComboBox(this.serverTypeModel);
    try {
      commandUIArgs = this.getValueFromTable();
      if (this.filterKeyWordValueModel == undefined || this.filterKeyWordValueModel.trim() == "")
        txtFilterData = "NA";
      else
        txtFilterData = this.filterKeyWordValueModel.trim();
      obj = { "Group Name": this.groupNameValueModel, "Actual Command": this.actualCommandValueModel, "Role": this.selectedRoleModel, "Filter Keyword": txtFilterData, "View Type": this.viewTypeValueModel, "Is Header Contains": this.selectedHeaderOption, "Separator": this.selectedSeparatedValueModel, "CommandUIArgs": commandUIArgs, "Max Inline Arguments": this.inlineArgumentsValueModel, "Description": this.descriptionValueModel, "CommandUIArgsJson": CommandUIArgsJson, "Server Type": selectedServer, "Command Display Name": this.commandDisplayValueModel, "rowId": new Date().getTime() }
    }
    catch (e) {
      console.error(e);
    }
    return obj;
  }

  isValidData(): boolean {
    /*check for groupName except for * | and blank*/
    var cmdGrpName = this.groupNameValueModel;
    if (cmdGrpName == "" || cmdGrpName.indexOf("*") >= 0 || cmdGrpName.indexOf("|") >= 0) {
      if (cmdGrpName == "") {
        alert("Command group name cannot be blank");
      }
      else {
        alert("Group name can not contain special character pipe(|) and star");
      }
      return false;
    }

    var cmdDisplayName = this.commandDisplayValueModel;

    /** Validation for the command display name */
    if (cmdDisplayName == undefined || cmdDisplayName == "" || cmdDisplayName.indexOf("|") >= 0) {
      if (cmdDisplayName == "" || cmdDisplayName == undefined) {
        alert("Command display name cannot be blank");
      }
      else {
        alert("Command display name can not contain special character pipe(|)");
      }
      return false;
    }

    var cmdActualName = this.actualCommandValueModel;
    if (cmdActualName == undefined || cmdActualName == "" || cmdActualName.indexOf("|") >= 0) {
      if (cmdActualName == "" || cmdActualName == undefined) {
        alert("Actual command name cannot be blank");
      }
      else {
        alert("Actual name can not contain special character pipe(|).");
      }
      return false;
    }
    /*Need to handle multiselect box for the server type*/
    if (!this.isAnyServerSelected()) {
      alert("Select atleast one server.");
      return false;
    }
    var description = this.descriptionValueModel;
    if (description == undefined || description == "" || description.indexOf("|") >= 0) {
      if (description == "" || description == undefined) {
        alert("Description cannot be blank.");
      }
      else {
        alert("Description can not contain special character pipe(|).");
      }
      return false;
    }

    var filterKeyword = this.filterKeyWordValueModel;
    if (filterKeyword != undefined && filterKeyword.indexOf("|") >= 0) {
      alert("Filter Keyword can not contain special character pipe(|).");
      return false;
    }

    var maxInlineArguments = this.inlineArgumentsValueModel;
    var regexNum = new RegExp("^[0-9]*$");
    if (maxInlineArguments == undefined || !regexNum.test(String(maxInlineArguments))) {
      alert("MaxInlineArguments should be number.");
      return false;
    }

    if (!this.isValidTableData()) {
      return false;
    }
    return true;
  }

  /**Used to validate that any server is selected or not*/
  isAnyServerSelected(): boolean {
    if (this.serverTypeModel != undefined && this.serverTypeModel.length > 0) {
      return true;
    }
    return false;
  }
  isValidTableData(): boolean {
    var tableDataArr = this.CommandArgumentRecords;
    for (var i = 0; i < tableDataArr.length; i++) {
      var dataOb = tableDataArr[i];
      var keys = Object.keys(dataOb);
      for (var j = 0; j < keys.length; j++) {
        var cellValue = dataOb[keys[j]];
        if ((keys[j] != "index") && (cellValue.indexOf(",") >= 0 || cellValue.indexOf("|") >= 0 || cellValue.indexOf("\"") >= 0 || cellValue.indexOf("$") >= 0)) {
          alert("Table data for row: " + (i + 1) + " of column " + keys[j] + " can not contain special characters like comman (,) , pipe (|), quotes (\") and " + "dollar($) in Command User Interface Arguments table.");
          return false;
        }
        if (keys[j] == "maxValue" || keys[j] == "minValue") {
          var value = 0;
          var regexNum = new RegExp("^[0-9]*$");
          if (cellValue != "DISABLED") {
            value = cellValue;
            if (!regexNum.test(cellValue)) {
              alert("Enter only numeric data in Max and Min value columns of Command User Interface Arguments table for row: " + (i + 1) + ".");
              return false;
            }
            if (keys[j] == "maxValue") {
              try {
                var minValue = parseInt(dataOb.minValue);
                if (value <= minValue) {
                  alert("Min value cannot be greater than or equal to MaxValue in Command User Interface Arguments table for row: " + (i + 1) + ".");
                  return false;
                }
                var buttonType = dataOb.selectedValue;
                if (buttonType == "Spinner" || buttonType == "TextBoxNumeric") {
                  var defaultValue = parseInt(dataOb.defaultValue);
                  if (defaultValue > value || defaultValue < minValue) {
                    alert("Default value should be in range of Max and Min values (inclusive) in Command User Interface Arguments table for row: " + (i + 1) + ".");
                    return false;
                  }
                }
              }
              catch (e) {
                alert("Enter only numeric data in Max , Min and default value columns of Command User Interface Arguments table for row: " + (i + 1) + ".");
                return false;
              }
            }
          }
        }
        if ((cellValue == undefined || cellValue == "") && keys[j] != "defaultValue" && keys[j] != "commandArgument" && keys[j] != "index") {
          alert("Column" + keys[j] + " cannot be blank for row : " + (i + 1) + " in Command User Interface Arguments table.");
          return false;
        }
      }
    }
    return true;
  }

  validateCommandArgsTableInput(): boolean {
    try {
      var tableDataArr = this.CommandArgumentRecords;
      for (var i = 0; i < tableDataArr.length; i++) {
        var valueArray = [];
        var labelList = [];
        var lableValue = "";
        if (tableDataArr[i].selectedValue == "RadioButton" || tableDataArr[i].selectedValue == "ListBox") {
          var strListCellvalue = tableDataArr[i].list;
          var defaultListValue = tableDataArr[i].defaultValue;

          if (tableDataArr[i].selectedValue == "RadioButton")
            valueArray = strListCellvalue.split(";");
          else
            valueArray = strListCellvalue.split(":");
          for (var j = 0; j < valueArray.length; j++) {
            if (tableDataArr[i].selectedValue == "RadioButton") {
              var ValueIndividual = valueArray[j].split(":");
              labelList.push(ValueIndividual[0]);

              if ((j != valueArray.length - 1))
                lableValue = lableValue + ValueIndividual[0] + ",";
              else
                lableValue = lableValue + ValueIndividual[0];
            }
            else {
              labelList.push(valueArray[j]);

              if ((j != valueArray.length - 1))
                lableValue = lableValue + valueArray[j] + ",";
              else
                lableValue = lableValue + valueArray[j];
            }
          }
          if (labelList.length > 0) {
            for (var k = 0; k < labelList.length; k++) {
              if (labelList != undefined && labelList.indexOf(defaultListValue) < 0) {
                alert("Default value for list should be one of these value ( " + lableValue + " )  for Command User Interface Arguments table for row: " + (i + 1) + ".");
                return false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
}
