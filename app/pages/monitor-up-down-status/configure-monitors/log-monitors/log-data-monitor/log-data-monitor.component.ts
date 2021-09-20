import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as _ from "lodash";
import { ConfirmationService } from 'primeng/api';
import { MonConfigurationService } from '../../../service/mon-configuration.service';
import { ImmutableArray } from 'src/app/pages/generic-gdf/services/immutable-array';
import { LogPatternData } from '../log-pattern-monitor/log-pattern-data';
import { GdfTableData } from '../../add-custom-monitor/containers/gdf-table-data';
import { UtilityService } from '../../../service/utility.service';
import * as CHECK_MON_DROPDOWN_LIST from '../../../constants/check-mon-dropdown-constants';
import { TierServerComponent } from '../../tier-server/tier-server.component';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';
import * as FIELDSET_SEPERATORATORVAL from '../../add-custom-monitor/constants/log-mon-fieldSep-constants';
import { ConfiguredMonitorInfoComponent } from '../../configured-monitor-info/configured-monitor-info.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-data-monitor',
  templateUrl: './log-data-monitor.component.html',
  styleUrls: ['./log-data-monitor.component.scss']
})
export class LogDataComponent implements OnInit {

  @ViewChild(TierServerComponent) tierChild: TierServerComponent;
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;
  tablePatternCols: any[];
  noteLabel1: string = "For multiple log files, special characters supported in file path are * ? [ ] '{' } ( ) +, else only * is supported at file level.";
  noteLabel: string = "If file name has regular expression, it will only use the last modified file.";
  logDataMonDTO: LogPatternData = new LogPatternData();
  gdfData: GdfTableData = new GdfTableData();
  metricList: any[] = [];
  selectedGDFdetails: GdfTableData[];
  AddEditLabel: string = "Add";    //label for Add/Update Button
  showSrchDialog: boolean = false;
  dialogHeaderForTable: string;
  isFromAdd: boolean; //This variable is used to check whether it is ADD/EDIT functionality
  tempId: number = 0;
  fieldTypeList: any[] = [];
  dataTypeList: any[] = [];
  formulaTypeList: any[] = [];
  logFileSelectionList: any[] = [];
  tableInfo: any[];
  count: number = 0; //Counter for adding id to the tableData
  tierServerInfo: any[] = [];
  loading: boolean
  operation: string = "add";  //check if it add/update mode
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  enabled: boolean = true;
  rejectVisible: boolean;
  acceptLable: string;
  deleteMonConf: Subscription; // to detect delete operation
  constructor(private cd: ChangeDetectorRef,
    public monConfigurationService: MonConfigurationService,
    private messageService: MessageService,
    private cms: ConfirmationService,
    private monitorupdownService: MonitorupdownstatusService
  ) { }

  ngOnInit() {
    this.monitorupdownService.getConfigInfo('logData').subscribe(response => {
      this.splitTableResponse(response);
    });
    this.tablePatternCols = [
      { field: "fieldType", header: 'Field Type' },
      { field: "fieldNumber", header: 'Field Number' },
      { field: "searchPattern", header: 'Pattern' },
      { field: "graphName", header: 'Graph Name' },
      { field: "dataType", header: 'Data Type' },
      { field: "formulaType", header: 'Formula Type' },
      { field: "formulaValue", header: 'Formula Value' }
    ]

    this.tableInfo = [
      { field: "tierInfo", header: 'Tier-Server Information', visible: true },
      { field: "instance", header: 'Instance', visible: true },
      { field: "logDataMon", header: 'Metric Group', visible: true },
      { field: "file", header: 'File Name', visible: true },
      { field: "jFile", header: 'JournalId File Name', visible: true },
      { field: "tChar", header: 'Trailing Characters', visible: true },
      { field: "lPat", header: 'Log Line Pattern', visible: true }
    ]

    this.logFileSelectionList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FILE_SELECTION_LABEL, CHECK_MON_DROPDOWN_LIST.FILE_SELECTION_VALUE);
    this.metricList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.METRICS_LIST_LABEL, CHECK_MON_DROPDOWN_LIST.METRICS_LIST_VALUE);
    this.fieldTypeList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FIELD_TYPE_LABEL, CHECK_MON_DROPDOWN_LIST.FIELD_TYPE_VALUE);
    this.dataTypeList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.DATA_TYPE_LABEL, CHECK_MON_DROPDOWN_LIST.DATA_TYPE_VALUE);
    this.formulaTypeList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FORMULA_TYPE_LABEL, CHECK_MON_DROPDOWN_LIST.FORMULA_TYPE_VALUE);

    // Bug 110416
    this.deleteMonConf = this.monitorupdownService.$deleteMonConf.subscribe((res) => {
      if (res) {
        this.resetUI();
      }
    });
  }

  saveLogData() {
    if (this.logDataMonDTO['gdfDetails'].length == 0) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please enter atleast details for one graph" });
      return false;
    }

    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }
    let options = this.createOptionsForLogMonitor()
    this.saveMonConfiguration(options);
  }

  createOptionsForLogMonitor() {
    let val = '';
    val = val + this.logDataMonDTO.fileNameSelection + COMPONENT.SPACE_SEPARATOR;
    let textForFileName = '';
    /** -f "__journald%3A-u+specifiueJournanlD+" */
    if (this.logDataMonDTO.fileNameSelection == "-f __journald") {
      // For JournalD - specified file case 
      if (this.logDataMonDTO.journalType == "-u")
        textForFileName = this.logDataMonDTO.journalType + COMPONENT.SPACE_SEPARATOR + this.logDataMonDTO.fileName;
      else // For JournalD - all case 
        textForFileName = '';
    }
    else {
      textForFileName = this.logDataMonDTO.fileName;
    }

    if (textForFileName != null && textForFileName != '') {
      val = val + encodeURIComponent(textForFileName) + COMPONENT.SPACE_SEPARATOR;
    }
    else // handling case for onchange in file selection type of journalD from specified to all
      val = val + COMPONENT.SPACE_SEPARATOR;

    let logPatternMonVal = '';
    if (this.logDataMonDTO.headerLines != null && this.logDataMonDTO.headerLines != "")
      val = val + "-h" + COMPONENT.SPACE_SEPARATOR + this.logDataMonDTO.headerLines + COMPONENT.SPACE_SEPARATOR;

    if (this.logDataMonDTO.trailingChar != "")
      val = val + "-T " + this.logDataMonDTO.trailingChar + COMPONENT.SPACE_SEPARATOR;

    // for bug 77321- support of -j option with encoding in Log Data Monitor.	
    if (this.logDataMonDTO.logLinePattern != null && this.logDataMonDTO.logLinePattern != "")
      val = val + "-j " + encodeURIComponent(this.logDataMonDTO.logLinePattern) + COMPONENT.SPACE_SEPARATOR;
    //for bug 80307- for multiple file support
    if (this.logDataMonDTO.readMulFile)
      val = val + "-y" + COMPONENT.SPACE_SEPARATOR + "V2" + COMPONENT.SPACE_SEPARATOR;
    logPatternMonVal = this.createDataForLogDataMonitor(this.logDataMonDTO);


    val = val + logPatternMonVal;

    // for support of (-N) option in log pattern in case use file name option
    if (this.logDataMonDTO.fileNameSelection == "-f" && this.logDataMonDTO.instCount) {
      val = val + COMPONENT.SPACE_SEPARATOR + "-N" + COMPONENT.SPACE_SEPARATOR + this.logDataMonDTO.instCount + COMPONENT.SPACE_SEPARATOR;
    }
    else {
      this.logDataMonDTO.instCount = null;
    }
    // for support of (-W) option in log pattern and log data monitor
    if (this.logDataMonDTO.dumpServer)
      val = val + COMPONENT.SPACE_SEPARATOR + "-W" + COMPONENT.SPACE_SEPARATOR;

    return val.trim();
  }

  saveMonConfiguration(monOptions) {
    let reqBody: any = {};
    let body: any = { "mon": {} };
    let gdfInfo: any = {};
    let metricGrpInfo = [];
    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }

    if (!this.monitorupdownService.validateDuplicateTier(this.tierServerInfo)) { return false; }
    body['mon'][this.logDataMonDTO.gdfName] = {
      "options": monOptions,
      "instanceName": this.logDataMonDTO.instance,
      "enabled": this.enabled,
      "type": "logData",
      "gdfName": this.logDataMonDTO.gdfName
    };

    if (this.logDataMonDTO.metric === "Custom Metrics")
      this.logDataMonDTO.metric = this.logDataMonDTO.customMetricName;

    this.logDataMonDTO.gdfDetails.map(each => {
      let metricObj = {
        graphNm: each.graphName,
        unit: each.unit,
        fL: each.formulaValue,
        dT: each.dataType,
        fVal: each.fVal,
        gT: each.type
      }
      metricGrpInfo.push(metricObj);
    })
    gdfInfo = {
      grpN: this.logDataMonDTO.gdfName,
      mV: this.logDataMonDTO.metric,
      gD: "Desc",
      metricInfo: metricGrpInfo
    }
    reqBody =
    {
      "techName": "logData",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": this.tierServerInfo,
      "body": body,
      "gdfInfo": gdfInfo
    }

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(reqBody, "logData", this.objectId).subscribe(res => {
      if (res['status']) {
        this.tierChild.clearTierServerData();
        this.monitorupdownService.getConfigInfo('logData').subscribe(response => {
          this.logDataMonDTO = new LogPatternData();
          this.splitTableResponse(response);
          this.operation = "add";
          this.AddEditLabel = "Add";
          this.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res['msg'] })
          this.loading = false;
        });
      }
      else {
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
  }

  /**For ADD Functionality-
*This method is called when user want to ADD gdf details
*/
  openDialog() {
    this.dialogHeaderForTable = "Add Graph Definition Details";
    this.showSrchDialog = true;
    this.gdfData = new GdfTableData();
    this.isFromAdd = true;
  }

  /**For EDIT Functionality-
 *This method is called when user want to edit the graph definiton details
 */
  editDialog() {
    if (!this.selectedGDFdetails || this.selectedGDFdetails.length < 1) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "No row is selected to edit" });
      return;
    }
    else if (this.selectedGDFdetails.length > 1) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select a single row to edit" });
      return;
    }

    this.showSrchDialog = true;
    this.isFromAdd = false;
    this.dialogHeaderForTable = "Edit Patterns";

    this.tempId = this.selectedGDFdetails[0]["id"];
    this.gdfData = Object.assign({}, this.selectedGDFdetails[0]);
  }

  /** For SAVE Functionality-
  * This method is called when user performs save operation when ADD/EDIT is done for the gdf details.
  */
  saveSrchPattData() {
    /* for saving the details on ADD Functionality*/
    if (this.isFromAdd) {
      this.gdfData["id"] = this.count;
      this.logDataMonDTO.gdfDetails = ImmutableArray.push(this.logDataMonDTO.gdfDetails, this.gdfData);
      this.count = this.count + 1;
      this.showSrchDialog = false;
    }

    /*for saving the updated details on EDIT functionality*/
    else {
      this.gdfData["id"] = this.tempId;
      this.logDataMonDTO.gdfDetails = ImmutableArray.replace(this.logDataMonDTO.gdfDetails, this.gdfData, this.getSelectedRowIndex(this.gdfData["id"]))
      this.isFromAdd = true;
      this.showSrchDialog = false;
      this.selectedGDFdetails = [];
    }
  }

  /**This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number {
    let index = this.logDataMonDTO.gdfDetails.findIndex(each => each["id"] == data)
    return index;
  }

  createDataForLogDataMonitor(formData) {
    let val = "";
    let gdfDetails = formData.gdfDetails;
    let fieldSetSeperator = "";

    if (formData.enableSpace)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.spaceVal;

    if (formData.enableTab)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.tabVal;

    if (formData.enableDoubleQuotes)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.doubleQuotesVal;

    if (formData.enableSingleQuotes)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.singleQuotesVal;

    if (formData.enableComma)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.commaVal;

    if (formData.enableBackslash)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.backSlashVal;

    if (formData.enableSemiColon)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.semiColonVal;

    if (formData.enableDash)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.dashVal;

    if (formData.enableEqual)
      fieldSetSeperator = fieldSetSeperator + FIELDSET_SEPERATORATORVAL.equalVal;

    if (formData.enablefieldSepOthers)
      fieldSetSeperator = fieldSetSeperator + formData.fieldSepOthersVal;

    if (fieldSetSeperator.trim() != '') {
      fieldSetSeperator = COMPONENT.SPACE_SEPARATOR + "-d " + COMPONENT.SPACE_SEPARATOR + "\"" + fieldSetSeperator + "\"";
    }

    let dataType = "-t" + COMPONENT.SPACE_SEPARATOR;
    let formulaTypeVal = "-C" + COMPONENT.SPACE_SEPARATOR;
    let fieldTypeVal = "-F" + COMPONENT.SPACE_SEPARATOR + "\"";

    gdfDetails.map(function (each) {
      dataType = dataType + each.dataType + ",";
      if (each.formulaValue != null && each.formulaValue != '') {
        if (each.formulaType == 'Multiply By')
          formulaTypeVal = formulaTypeVal + "M_" + each.formulaValue + ",";
        else if (each.formulaType == 'Divide By')
          formulaTypeVal = formulaTypeVal + "D_" + each.formulaValue + ",";
      }
      else {
        formulaTypeVal = formulaTypeVal + "NA" + ","
      }

      if (each.fieldType == 'Field Number')
        fieldTypeVal = fieldTypeVal + "N:" + each.fieldNumber + ",";
      else if (each.fieldType == 'Pattern')
        fieldTypeVal = fieldTypeVal + "P:" + "\"" + encodeURIComponent(each.searchPattern) + "\"" + ",";
      else if (each.fieldType == 'Field Number and Pattern')
        fieldTypeVal = fieldTypeVal + "NP:" + each.fieldNumber + ":\"" + encodeURIComponent(each.searchPattern) + "\"" + ",";
    })

    val = val + dataType.substring(0, dataType.length - 1) + COMPONENT.SPACE_SEPARATOR
      + formulaTypeVal.substring(0, formulaTypeVal.length - 1) + COMPONENT.SPACE_SEPARATOR
      + fieldSetSeperator + COMPONENT.SPACE_SEPARATOR
      + fieldTypeVal.substring(0, fieldTypeVal.length - 1) + "\"";

    return val.trim();
  }

  editData(data) {
    this.logDataMonDTO = new LogPatternData();
    this.loading = true;
    this.operation = "update";
    this.AddEditLabel = 'Update';
    this.gMonId = data['gmonID'];
    this.objectId = data['objID'];
    this.tierChild.fillTierDataAtEit(data['tierInfo']);
    this.fillDataAtEdit(data);
    this.loading = false;
    this.cd.detectChanges();
  }

  fillDataAtEdit(formData) {
    this.fillGDFTabledata(formData);
    this.logDataMonDTO.gdfName = formData['custMonGdfDto']['logMonName'];
    this.logDataMonDTO.instance = formData['custMonGdfDto']['instance'];
    this.enabled = formData['custMonGdfDto']['enabled'];
    if (formData['gdf']['mV'] != 'Application Metrics' && formData['gdf']['mV'] != 'System Metrics') {
      this.logDataMonDTO.customMetricName = formData['gdf']['mV'];
      this.logDataMonDTO.metric = "Custom Metrics"
    }
  }

  fillGDFTabledata(data) {
    let options = data['custMonGdfDto']['options'].replace(/ +/g, ' ').trim();
    let metricInfo = data['gdf']['metricInfo'];
    let gdfData = options.split(" ");
    let pattern = [];
    let type = [];
    let formVal = [];
    let fNum = [];
    let fType = [];
    let fieldType = [];
    for (let i = 0; i < gdfData.length; i++) {
      if (gdfData[i] === "-f") {
        if (gdfData[i + 1] === "__journald") {
          this.logDataMonDTO.fileNameSelection = "-f __journald";
        }
        else {
          this.logDataMonDTO.fileNameSelection = "-f";
          this.logDataMonDTO.fileName = decodeURIComponent(gdfData[i + 1]);
        }
      }
      if (gdfData[i] === "-N")
        this.logDataMonDTO.instCount = gdfData[i + 1];
      if (gdfData[i] === "-c") {
        this.logDataMonDTO.fileNameSelection = "-c";
        this.logDataMonDTO.fileName = decodeURIComponent(gdfData[i + 1]);
      }
      if (gdfData[i] === "-u")
        this.logDataMonDTO.fileName = decodeURIComponent(gdfData[i + 1]);
      if (gdfData[i] === "-y")
        this.logDataMonDTO.readMulFile = true;
      if (gdfData[i] === "-W")
        this.logDataMonDTO.dumpServer = true;
      if (gdfData[i] === "-T")
        this.logDataMonDTO.trailingChar = gdfData[i + 1];
      if (gdfData[i] === "-p") {
        pattern.push(gdfData[i + 1])
      }
      //\"NP:100:\"ppppp111\",NP:900000:\"patt900000\"\"
      if (gdfData[i] === "-F") {
        let val = gdfData[i + 1].substring(1, gdfData[i + 1].length - 1);
        let splitVal = val.split(",");
        splitVal.map(each => {
          let patt = each.split(":");
          fieldType.push(patt[0]);
          if (patt[0] === "NP") {
            fNum.push(patt[1]);
           // pattern.push(patt[2]);
           pattern.push(decodeURIComponent(patt[2]))
          }
          else if (patt[0] === "N") {
            fNum.push(patt[1]);
            pattern.push("");
          }
          else if (patt[0] === "P") {
            //pattern.push(patt[1]);
            pattern.push(decodeURIComponent(patt[1]))
            fNum.push("");
          }
        })
      }
      if (gdfData[i] === "-t") {
        type = gdfData[i + 1].split(",");
      }
      if (gdfData[i] === "-C") {
        let val = gdfData[i + 1].split(",");
        val.map(each => {
          let fVal = each.split("_");
          fType.push(fVal[0]);
          formVal.push(fVal[1]);
        })
      }
      if (gdfData[i] === "-j") {
        this.logDataMonDTO.logLinePattern = gdfData[i + 1];
      }
      if (gdfData[i] === "-h") {
        this.logDataMonDTO.headerLines = gdfData[i + 1];
      }
      if (gdfData[i] === "-d") {
        let val = gdfData[i + 1].substring(1, gdfData[i + 1].length - 1).split("%");
        val.map((eachVal, index) => {
          if (eachVal !== "+" && eachVal !== "-")
            eachVal = "%" + eachVal;
          if (eachVal.includes("-"))
            this.logDataMonDTO.enableDash = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.spaceVal)
            this.logDataMonDTO.enableSpace = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.tabVal)
            this.logDataMonDTO.enableTab = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.doubleQuotesVal)
            this.logDataMonDTO.enableDoubleQuotes = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.singleQuotesVal)
            this.logDataMonDTO.enableSingleQuotes = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.commaVal)
            this.logDataMonDTO.enableComma = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.backSlashVal)
            this.logDataMonDTO.enableBackSlash = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.semiColonVal)
            this.logDataMonDTO.enableSemiColon = true;
          if (eachVal === FIELDSET_SEPERATORATORVAL.equalVal)
            this.logDataMonDTO.enableEqual = true;
          if (val.length - 1 === index) {
            if (eachVal.length > 3) {
              this.logDataMonDTO.enablefieldSepOthers = true;
              this.logDataMonDTO.fieldSepOthersVal = eachVal.substring(3, eachVal.length)
            }
          }
        })
      }
    }

    metricInfo.forEach((value, index) => {
      this.gdfData = new GdfTableData();
      if (pattern[index])
        this.gdfData.searchPattern = pattern[index].substring(1, pattern[index].length - 1);
      this.gdfData.graphName = value['graphNm'];
      this.gdfData.unit = value['unit'];
      this.gdfData.formulaValue = formVal[index];
      this.gdfData.dataType = type[index];
      this.gdfData.fieldNumber = fNum[index];
      this.gdfData.fieldType = this.getFieldType(fieldType[index]) // for bug 112312

      if (fType.length > 0) {
        if (fType[index] === "M") {
          this.gdfData.formulaType = "Multiply By"
        }
        if (fType[index] === "D") {
          this.gdfData.formulaType = "Divide By"
        }
      }
      //'None','Multiply By','Divide By','Bytes To kbps'
      this.isFromAdd = true;
      this.saveSrchPattData();
    })
  }

  resetUI() {
    this.AddEditLabel = 'Add';
    this.operation = "add";
    this.gMonId = "-1";
    this.objectId = "-1";
    this.tierChild.clearTierServerData();
    this.logDataMonDTO = new LogPatternData();
  }

  splitTableResponse(data) {
    data.map(each => {
      let options = each['options'].trim().split(" ");
      let fileSelection;
      let tChar;
      let linePat;
      for (let i = 0; i < options.length; i++) {
        if (options[i] === "-f") {
          if (options[i + 1] === "__journald") {
            fileSelection = "journald";
          }
          else {
            fileSelection = options[i + 1];
          }
        }
        if (options[i] === "-c") {
          fileSelection = options[i + 1];
        }
        if (options[i] === "-T") {
          tChar = options[i + 1];
        }
        if (options[i] === "-j") {
          linePat = options[i + 1];
        }
      }
      each['file'] = decodeURIComponent(fileSelection);
      each['tChar'] = tChar;
      each['lPat'] = linePat;
    })
    this.monInfoChild.getTableData(data);
  }

  deleteGDFDetails() {
    if (this.logDataMonDTO['gdfDetails'].length == 0) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "No record is present to delete" });
      return;
    }

    if (!this.selectedGDFdetails || this.selectedGDFdetails.length == 0) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select a row to delete" });
      return;
    }

    this.rejectVisible = true;
    this.acceptLable = "Yes";

    this.cms.confirm({
      message: 'Are you sure to remove this data?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        let arrId = [];
        this.selectedGDFdetails.map(function (each) {
          arrId.push(each["id"])
        })

        this.logDataMonDTO['gdfDetails'] = this.logDataMonDTO['gdfDetails'].filter(function (val) {
          return arrId.indexOf(val["id"]) == -1;  //value to be deleted should return false
        })

        /**clearing object used for storing data */
        this.selectedGDFdetails = [];
      },
      reject: () => {
        this.selectedGDFdetails = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.deleteMonConf)
      this.deleteMonConf.unsubscribe();
  }

  //Method added to get field type at edit mode for bug 112312
  getFieldType(each) {
    let localFieldType;
    if (each === "NP")
      return localFieldType = "Field Number and Pattern";
    else if (each === "N")
      return localFieldType = "Field Number";
    else if (each === "P")
      return localFieldType = "Pattern";
  }
}