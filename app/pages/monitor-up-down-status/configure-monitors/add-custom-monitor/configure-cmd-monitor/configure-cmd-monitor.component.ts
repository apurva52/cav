import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from 'primeng';
import { MetricConfData } from '../../../../generic-gdf/containers/metric-configuration-data';
import { MetricHierarchyData } from '../../../../generic-gdf/containers/metric-hierarchy-data';
import { Router } from "@angular/router";
import { MonitorupdownstatusService } from "../../../service/monitorupdownstatus.service";
import { metricHierarchyTable } from "../containers/configure-cmd-monitor.table";
import { CustomMonitorService } from "../services/custom-monitor.service";
import * as CMD_MON_CONSTANTS from "../../add-custom-monitor/constants/configure-cmd-mon-constant"
import { RemoteConnectionData } from "../../add-monitor/containers/remote-connection-data";
import { APIData } from "../containers/api-data";
import { CmdMonData } from "../containers/configure-cmd-mon-data";
import { UtilityService } from "src/app/pages/generic-gdf/services/utility.service";
import * as _ from "lodash";
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';

const NO_OUTPUT_MSG = "Run command/script for auto fill.";

@Component({
  selector: "configure-cmd-monitor",
  templateUrl: "./configure-cmd-monitor.component.html",
  styleUrls: ["./configure-cmd-monitor.component.scss"]
})

export class ConfigureCmdMonitorComponent implements OnInit {
  dropDownList: any;
  showdialog: boolean = false;
  showRunDialog: boolean = false;
  delimeter: string;
  topList: any;
  skipLineTop: string = '';
  bottomList: any;
  skipLineBottom: string = '';
  useColNameAsMetricName: boolean = false;
  settingType: string = "ts";
  metricList: any;
  metrics: string = '';
  technology: string = '';
  products: metricHierarchyTable[];
  scriptOut: string = '';// script in output
  inputOpt: string = '';
  apiData = new APIData();
  _tierForRunCmd: string = ''; // dropdown value to hold the tier name from the tier list in run dialog
  _serverForRunCmd: string = ''; // dropdown value to hold the server name for server list in run dialog
  skipLineList: SelectItem[]; // User can skip first n or last n lines from output using skip line list.
  oTypeList: SelectItem[];   // Output type list- default is String.
  delimiterList: SelectItem[]; // variable to store the delimiters such as comma, space etc.
  filterList: SelectItem[];  // filterList user can configure positive/negative filter on each vector attribute.
  mTypeList: SelectItem[];
  indexList: SelectItem[];
  hierarchyList: SelectItem[];
  showRundialog: boolean = false;   //for selecting tier & server
  tierList: any[] = [];// for storing tier list obj 
  serverList: any[] = [];
  arrMetricHier: any[] = []; // array for sending columns index user wants to show in UI.
  arrMetricConf: any[] = []; // array for sending columns index user wants to show in UI.
  monitorType: string = 'command'; // monitor type for showing columns based on type
  headerLine: boolean = false; // for display header line in metric configuration fieldset 
  cusCat: string = ''; // custom category name
  authenticationList: SelectItem[]; // list for authentication at executing cmd/script.
  auth: string = '1'; // default value for authentication is 'Password' - 1
  osList: any = []; // os type list
  serverNameList: any = [];
  noEdit: boolean = false;
  categoryList: any[] = [];
  dMeter: string = '';
  tierHeadersList: any[];
  cmdMonData: CmdMonData = new CmdMonData();
  loading: boolean;

  constructor(
    private customMonService: CustomMonitorService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private monUpdown: MonitorupdownstatusService,
    private msgService: MessageService
  ) { }

  ngOnInit() {
    this.headerLine = true;
    this.arrMetricHier = [
      { field: '_metadata', header: 'Metric Hierarchy Component', visible: false },
      { field: '_keyInd', header: 'Field Number', visible: false },
    ]
    this.arrMetricConf = [
      { field: '_mN', header: 'Metric Name', visible: false },
      { field: '_unit', header: 'Unit', visible: false },
      { field: '_metKeyIdx', header: 'Field Number', visible: false },
      { field: '_metType', header: 'Metric Type', visible: true },
      { field: '_dT', header: 'Data type', visible: false },
      { field: '_mF', header: 'Metric Formula', visible: false },
      { field: '_metDesc', header: 'Description', visible: false },
    ]

    this.getDropDown();

    this.tierHeadersList = this.customMonService.getTierHeaderList();
    let tierNameList = []
    this.tierHeadersList.map(function (each) {
      if (each.value > -1) // for skipping tierGroups and All tiers
        tierNameList.push(each.label)
    })
    this.tierList = UtilityService.createDropdown(tierNameList);

    if (this.customMonService.isFromEdit) // check whether UI is from "ADD" or "EDIT"  mode
    {
      // this.customMonService.isFromEdit = false;
      this.cmdMonData = Object.assign({}, this.customMonService.getCmdEditData)
      this.getSkipLineInfoAtEdit(this.cmdMonData);

      //set use column name checkbox value at edit time
      if (this.cmdMonData.oType == '2') {
        this.useColNameAsMetricName = true;
        this.setOutputTypeOnChange(this.cmdMonData.oType)
      }
      this.getCustomDelimiter(); // for bug 91195
      this.customMonService.outputLength = 0;  //setting outputLength to 0 for metric hierarchy tree in edit mode
    }
    //skipping 0 values in UI
    if (this.cmdMonData.hl == 0) {
      this.cmdMonData.hl = null
    }

    if (this.cmdMonData.top == 0) {
      this.cmdMonData.top = null
    }

    if (this.cmdMonData.bottom == 0) {
      this.cmdMonData.bottom = null
    }
    const me = this
    this.apiData['cmdMonData'] = this.cmdMonData;
  }
  //Method called when executing executing command or script/batch created.
  run() {
    this.isCommand();
    //  this.showRundialog = false; //close dialog on "OK" click

    if (this.settingType == 'remote') { //to execute command/script via remote settings
      //clearing fields on switch in radiobutton
      this.clearExecuteOnServerFields()

      this.cmdMonData.cmdScript = this.cmdMonData.inputOpt;
      this.customMonService.getCMDOutput(this.cmdMonData.rCon, this.cmdMonData.inputOpt)
        .subscribe(data => {
          if (data['status'] == "true") {
            this.cmdMonData.output = data.result;
          }
          else {
            this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: CMD_MON_CONSTANTS.ERROR_MSG_ON_RUN_CMD });
          }
        })
    }
    else { //to execute command/script on tier/server
      //clearing fields on switch in radiobutton
      this.clearRemoteFields();

      if (this._tierForRunCmd == "") {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: CMD_MON_CONSTANTS.ERROR_MSG_FOR_RUN_CMD_ON_TIER });
        return;
      }

      if (this._tierForRunCmd != "" && this._serverForRunCmd == "") {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: CMD_MON_CONSTANTS.ERROR_MSG_FOR_RUN_CMD_ON_SERVER });
        return;
      }

      let ip = this.getActualServerName(this.serverList, this._serverForRunCmd) //get actual server ip
      let osType = this.getOSType(this.serverNameList.indexOf(this._serverForRunCmd));
      osType = 'LinuxEx';
      this.cmdMonData.cmdScript = this.cmdMonData.inputOpt;
      this.cmdMonData['ip'] = ip;
      this.cmdMonData['os'] = osType;
      this.apiData['cmdMonData'] = this.cmdMonData;

      this.customMonService.runCMDOnServer(this.apiData).subscribe(data => {
        if (data != null && data.length != 0) {
          if (data['status'] == "true") {
            this.msgService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: CMD_MON_CONSTANTS.SUCCESS_MSG_ON_RUN_CMD });
            this.cmdMonData.output = data.result;
          }
          else {
            this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: CMD_MON_CONSTANTS.ERROR_MSG_ON_RUN_CMD });
          }
        }
      })
    }
    this.showRundialog = false; //close dialog on "OK" click
  }

  // Method called after run is clicked to execute command/script so that all form fields are cleared.
  clearRunDailog() {
    this.settingType = "ts"; //setting to default 
    this.clearExecuteOnServerFields();
    this.clearRemoteFields();
  }

  // Method called to open dialog for creating/uploading script
  openScriptDialog() {
    this.showdialog = true;

    this.isCommand();
    if (this.cmdMonData.inpType == CMD_MON_CONSTANTS.INP_TYPE_SCRIPT)
      this.scriptOut = this.cmdMonData.inputOpt;
    else
      this.scriptOut = "";
  }

  //Method called to upload the script in textarea provided in create/upload script dialog
  uploadFile(fileList: FileList) {
    let file = fileList[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = (e) => {
      this.scriptOut = fileReader.result.toString(); // showing the contents of uploaded file in the textArea.
      this.msgService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: "Script uploaded successfully" });
    }
  }

  //Method called on 'OK' click in create/upload script dialog.
  saveScript() {
    this.cmdMonData.inputOpt = this.scriptOut; // copying the created/uploaded script in the textField labeled as 'Command/script'
    this.showdialog = false;
  }

  getDropDown() {
    this.oTypeList = UtilityService.createListWithKeyValue(CMD_MON_CONSTANTS.OUTPUT_TYPE_LABEL, CMD_MON_CONSTANTS.OUTPUT_TYPE_VALUE);
    this.delimiterList = UtilityService.createListWithKeyValue(CMD_MON_CONSTANTS.DELIMETER_LABEL, CMD_MON_CONSTANTS.DELIMETER_VALUE);
    this.skipLineList = UtilityService.createListWithKeyValue(CMD_MON_CONSTANTS.SKIPLINE_LABEL, CMD_MON_CONSTANTS.SKIPLINE_VALUE);
    this.topList = UtilityService.createListWithKeyValue(CMD_MON_CONSTANTS.SKIPLINE_TOP_LABEL, CMD_MON_CONSTANTS.SKIPLINE_TOP_VALUE);
    this.bottomList = UtilityService.createListWithKeyValue(CMD_MON_CONSTANTS.SKIPLINE_BOTTOM_LABEL, CMD_MON_CONSTANTS.SKIPLINE_BOTTOM_VALUE);
    this.authenticationList = UtilityService.createListWithKeyValue(CMD_MON_CONSTANTS.AUTH_LABEL, CMD_MON_CONSTANTS.AUTH_VALUE);
  }

  //Method called on "BACK" button click
  exitConfigurationCmdMon() {
    //this.cmsObj.exitConfiguration();
  }

  //Method called to clear the output value on radiobutton change
  onChangeInputType() {
    this.cmdMonData.inputOpt = ""; //clear entered in command/script if value is present 
  }

  //Method called when run button is clicked to run command/script.
  openRunDialog() {
    if (this.cmdMonData.inputOpt == '') {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: CMD_MON_CONSTANTS.ERROR_MSG_FOR_EMPTY_CMD });
      return;
    }

    let tierHeaderList = this.customMonService.getTierHeaderList()
    let tierNameList = [];
    if (tierNameList) {
      tierHeaderList.map(function (each) {
        if (each.value > -1) // for skipping tierGroups 
        {
          tierNameList.push(each.label)
        }
      })
    }

    this.tierList = UtilityService.createDropdown(tierNameList);
    this.showRundialog = true;
  }

  //Method called on save click to save command based monitor configuration
  saveMonitorsConfigurationData() {
    this.customMonService.saveMonitorConfProvider(true);

    if (!this.customMonService.validateConfigurationData(this.cmdMonData))
      return false;

    //adding custom category name to category tag in json backend
    if (this.cmdMonData.cat == 'addNewTechnology') {
      this.cmdMonData.cat = this.cmdMonData.cusCat;
    }

    this.cmdMonData.monN = this.cmdMonData.gdfInfo.grpN;
    this.apiData['cmdMonData'] = this.cmdMonData;
    this.apiData.objectId = this.customMonService.objectID;
    this.loading = true
    this.customMonService.saveCmdConf(this.apiData).subscribe(res => {
      if (res['status']) {
        this.msgService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res['msg'] })
        this.apiData = new APIData(); // for clearing fields of the form after save
        this.cmdMonData = new CmdMonData();
        this.loading = false
        setTimeout(() => {
          this.router.navigate(["/custom-monitors/availCustMon/cmd"]);
        }, 500)
      }
      else {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['msg'] })
        this.loading = false;
      }
    })

  }

  metricTableData(data) {
    if (data.depMHComp)
      this.cmdMonData.gdfInfo.depMHComp = data.depMHComp;

    this.cmdMonData.gdfInfo.mD = data.mD;
  }

  metricConfTableData(data) {
    this.cmdMonData.gdfInfo.metricInfo = data;
  }

  ngOnDestroy() {
    this.noEdit = false;
    this.customMonService.objectID = "-1";
  }

  onTierChange(tier) {
    let tierInfo = _.find(this.tierHeadersList, function (each) { return each['label'] == tier })

    /*** To get the server list in the dropdown ****/
    /*** Here unshift is used to insert element at 0 position of array 
     *** if Others is slectede for tiername then there should not be any request send to the server for getting the serverList**/

    if (tierInfo != undefined) {
      this.getServerListData(tierInfo.value)
    }
  }

  getServerListData(tierId) {
    this.monUpdown.getServerList(tierId)
      .subscribe(res => {
        if (res != null) {
          let sName = [];
          let dName = [];
          res.map(each => {
            if (each['id'] >= 0) {
              sName.push(each['sName']);
              dName.push(each['dName']);
            }
          })
          this.serverList = UtilityService.createListWithKeyValue(dName, sName);
        }
      })
  }

  /**
   * This method is used to get the actual server name for the specified server display name
   * @param serverList 
   * @param selectedServerName 
   */
  getActualServerName(serverList, selectedServerName) {
    let serverSelectedObj = _.find(serverList, function (each) { return each['value'] == selectedServerName })
    let serverLabel = serverSelectedObj['label']
    let actualServerName;
    actualServerName = serverLabel.substring(serverLabel.indexOf("(") + 1, serverLabel.length)
    if (actualServerName.substr(-1) == ")")
      actualServerName = actualServerName.substring(0, actualServerName.length - 1);

    return actualServerName;
  }

  /**
   * Method called at edit time to get the skip line dropDown values in UI
   * @param data 
   */
  getSkipLineInfoAtEdit(data) {
    if (data.topActionStr != "")
      data.skipLineTop = "topActionStr";
    else if (data.top > 0)
      data.skipLineTop = "top"
    else
      data.skipLineTop = '';

    if (data.bottomActionStr != "")
      data.skipLineBottom = "bottomActionStr";

    else if (data.bottom > 0)
      data.skipLineBottom = "bottom"
    else
      data.skipLineBottom = '';

  }

  getIndexListOnSave(metricHierarchyTableData, metricConfData) {
    let arrOfIndexFromMetricHierarchyTable = [];
    let arrOfIndexFromMetricConfTable = [];
    let flag: boolean = false;
    if (metricHierarchyTableData && metricHierarchyTableData.length != 0) {
      metricHierarchyTableData.map(function (each) {
        if (metricHierarchyTableData._keyInd != "")
          arrOfIndexFromMetricHierarchyTable.push(each._keyInd);

      })

      if (metricConfData) {
        metricConfData.map(function (item) {
          let depComp = item['depMConf'];
          if (depComp.length != 0) {
            depComp.map(function (eachItem) {
              if (eachItem['_metKeyIdx'] != "") {
                arrOfIndexFromMetricConfTable.push(eachItem._metKeyIdx);
              }
            })
          }
        })
      }
      flag = this.findCommonElement(arrOfIndexFromMetricHierarchyTable, arrOfIndexFromMetricConfTable)
    }
    return flag;
  }

  findCommonElement(array1, array2) {
    // Loop for array1 
    for (let i = 0; i < array1.length; i++) {

      // Loop for array2 
      for (let j = 0; j < array2.length; j++) {

        // Compare the element of each and 
        // every element from both of the 
        // arrays 
        if (array1[i] === array2[j]) {

          // Return if common element found 
          return true;
        }
      }
    }

    // Return if no common element exist 
    return false;
  }

  //Method called to set the new output type when dropdown is changed for changing output type
  setOutputTypeOnChange(outputType) {
    if (outputType == "2") //Output type (string-1/keyValue-2/JSON-3/JMX-4)
    {
      this.customMonService.OTypeChange("Column Key");
    }
    else {
      this.customMonService.OTypeChange("Field Number");
    }
  }

  //Method called on click of radiobutton for change of input type i.e. from cmd to script or vice-versa.
  changeInpType() {
    this.cmdMonData.inputOpt == ''; //clearing fields on switch between radiobuttons.
  }

  getOutputTypeVal() {
    if (this.useColNameAsMetricName)
      this.cmdMonData.oType = '2'; // Key
    else
      this.cmdMonData.oType = '1'; // string
  }


  //autofill details of gdf datatable	
  autoFillData() {
    let splitOuputByNewLine;
    let splitByHeaderLine;
    let splitByDelimiter;

    let dataLine, dataLineWithValues;

    if (!this.validateAutoFill(this.cmdMonData.output))
      return false;

    splitOuputByNewLine = this.cmdMonData.output.split("\n");
    this.customMonService.outputLength = splitOuputByNewLine.length - 1;
    splitByHeaderLine = splitOuputByNewLine[this.cmdMonData.hl - 1]; // for user 0 headerline is 1 so subtracting 
    dataLine = splitOuputByNewLine[this.cmdMonData.hl];
    let delimiter = this.cmdMonData.delimiter;
    if (this.cmdMonData.delimiter == 'custom')
      delimiter = this.cmdMonData['cD'];


    let newSplitByHeaderLine = splitByHeaderLine.trim().replace(/  +/g, ' ');
    splitByDelimiter = newSplitByHeaderLine.split(delimiter);

    let dataLineByDelimiter = dataLine.trim().replace(/  +/g, ' ');
    dataLineWithValues = dataLineByDelimiter.split(delimiter);

    this.customMonService.createMetricHierarchyData(splitOuputByNewLine, delimiter);
    this.autoFillMetricHierarchy(splitByDelimiter, dataLineWithValues);
  }

  /**
   * Method called for validation at auto fill 
   * @param output 
   * @param headerLine 
   */
  validateAutoFill(output) {
    if (output.trim() === '') {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: NO_OUTPUT_MSG });
      return false;
    }
    return true;
  }

  // Callback to invoke on dropdown change in skip line from top.
  onSkipTopChange() {
    //clear text number
    if (this.cmdMonData.skipLineTop == 'topActionStr') {
      this.cmdMonData.top = null;
    }

    // //clear textField
    if (this.cmdMonData.skipLineTop == 'top') {
      this.cmdMonData.topActionStr = '';
    }

    // //clear both 
    if (this.cmdMonData.skipLineTop == '') {
      this.cmdMonData.top = null;
      this.cmdMonData.topActionStr = '';
    }
  }

  // Callback to invoke on dropdown change in skip line from bottom.
  onSkipBottomChange() {
    //clear text number
    if (this.cmdMonData.skipLineBottom == 'bottomActionStr') {
      this.cmdMonData.bottom = null;
    }

    //clear textField
    if (this.cmdMonData.skipLineBottom == 'bottom') {
      this.cmdMonData.bottomActionStr = '';
    }

    //clear both 
    if (this.cmdMonData.skipLineBottom == '') {
      this.cmdMonData.bottomActionStr = '';
      this.cmdMonData.bottom = null;
    }

  }

  autoFillMetricHierarchy(splitByDelimiter, dataLineWithValues) {
    let arr = [];
    let arr1 = [];
    for (let j = 0; j < dataLineWithValues.length; j++) {
      let metricHierObj = new MetricHierarchyData();
      let obj = new MetricConfData();
      if (isNaN(dataLineWithValues[j])) {
        metricHierObj._metadata = splitByDelimiter[j];
        metricHierObj._keyInd = splitByDelimiter[j];
        metricHierObj.id = j;
      }
      else {
        obj['_mN'] = splitByDelimiter[j];
        // if (this.cmdMonData['oType'] != "1") {
        obj['_metKeyIdx'] = splitByDelimiter[j];
        obj['_metDesc'] = splitByDelimiter[j];
        obj['id'] = j;
      }
      if (metricHierObj._metadata != '')
        arr.push(metricHierObj)

      if (obj._mN != '')
        arr1.push(obj);

    }
    this.customMonService.autoFillMetricInfoData(arr1);
    this.customMonService.autoFillMetricHierarchyData(arr);
  }


  //to check whether input text is command/script
  isCommand() {
    this.cmdMonData.inpType = CMD_MON_CONSTANTS.INP_TYPE_CMD;
    let count = 0;
    let str = this.cmdMonData.inputOpt.split("\n");
    if (str.length != 0) {
      for (let i = 0; i < str.length; i++) {
        count++;
      }
    }
    if (count > 1) {
      this.cmdMonData.inpType = CMD_MON_CONSTANTS.INP_TYPE_SCRIPT;
    }
  }

  clearExecuteOnServerFields() {
    this._tierForRunCmd = ""; // tier
    this._serverForRunCmd = ""; //server ip

  }

  clearRemoteFields() {
    this.cmdMonData.rCon = new RemoteConnectionData();
  }

  oTypeChange() {
    this.getOutputTypeVal();
    setTimeout(() => {
      let showCmsMsg: boolean = true;//flag to show confirmation dialog only if metric hierarchy and metric configuration table are having values
      if ((this.cmdMonData.gdfInfo.depMHComp == undefined || this.cmdMonData.gdfInfo.depMHComp == null ||
        this.cmdMonData.gdfInfo.depMHComp.length == 0) && (this.cmdMonData.gdfInfo.metricInfo == undefined || this.cmdMonData.gdfInfo.metricInfo == null ||
          this.cmdMonData.gdfInfo.metricInfo.length == 0)) {
        showCmsMsg = false;
      }

      if (showCmsMsg) {
        this.confirmationService.confirm({
          message: CMD_MON_CONSTANTS.CONFIRMATION_MSG_ON_CHANGE_IN_OUTPUT_TYPE,
          header: 'Discard Changes',
          icon: 'fa fa-trash',
          accept: () => {
            this.getOutputTypeVal();
            this.setOutputTypeOnChange(this.cmdMonData.oType)
          },
          reject: () => {
            if (this.useColNameAsMetricName) {
              this.useColNameAsMetricName = false;
            }
            else {
              this.useColNameAsMetricName = true;
            }
          }
        });
      }
      else {
        this.setOutputTypeOnChange(this.cmdMonData.oType)
      }
    }, 1);
  }

  //method added for setting custom delimiter values at edit time - bug 91195
  getCustomDelimiter() {
    if (this.cmdMonData.delimiter != ' ' &&
      this.cmdMonData.delimiter != ',' &&
      this.cmdMonData.delimiter != '\t' &&
      this.cmdMonData.delimiter != '|') {
      this.cmdMonData.cD = this.cmdMonData.delimiter; //first set the delimiter value in custom delimiter model.
      this.cmdMonData.delimiter = "custom"; // set to custom if not 'Space','Comma','Tab','Pipe'
    }
  }

  getOSType(index) {
    let os;
    if (index != -1) // if not found 
      os = this.osList[index];

    return os;
  }
}
