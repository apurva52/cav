import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';
import { MessageService } from 'primeng/api';
import { UtilityService } from '../../../service/utility.service';
import * as _ from "lodash";
import { MonitorupdownstatusService } from "../../../service/monitorupdownstatus.service";
import { ConfirmationService } from 'primeng/api';
import { MonConfigurationService } from '../../../service/mon-configuration.service';
import { ImmutableArray } from 'src/app/pages/generic-gdf/services/immutable-array';
import { GdfTableData } from '../../add-custom-monitor/containers/gdf-table-data';
import { TierServerComponent } from '../../tier-server/tier-server.component';
import { LogPatternData } from './log-pattern-data';
import { ConfiguredMonitorInfoComponent } from '../../configured-monitor-info/configured-monitor-info.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-pattern-monitor',
  templateUrl: './log-pattern-monitor.component.html',
  styleUrls: ['./log-pattern-monitor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogPatternMonitorComponent implements OnInit {
  @ViewChild(TierServerComponent) tierChild: TierServerComponent;
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;
  tierField: string;
  tempId: number = 0;
  logFileSelectionList: any[] = [];
  unitList: any[] = [];
  gdfData: GdfTableData = new GdfTableData();
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  formData: any[] = [];
  metricList: any[] = [];
  count: number = 0; //Counter for adding id to the tableData
  noteLabel1: string = "For multiple log files, special characters supported in file path are * ? [ ] '{' } ( ) +, else only * is supported at file level.";
  noteLabel: string = "1.If file name has regular expression, it will only use the last modified file.";
  showSrchDialog: boolean = false;
  type: number; //used to determine type of monitor json based or non json based
  displayHeader: string; // This is used to display accordion header according to monitor type
  logPatternData: LogPatternData = new LogPatternData();
  isFromAdd: boolean; // flag to know whether operation is add or edit in search pattern dailog.
  AddEditLabel: string = "Add";    //label for Add/Update Button
  tableCols: any[];
  tablePatternCols: any[];
  dialogHeaderForTable: string;
  /*This variable is used to store the selected gdf details*/
  selectedGDFdetails: GdfTableData[];
  gdfDetails: GdfTableData[] = [];
  fileName: string = '';
  tierServerInfo: any[] = [];
  loading: boolean
  operation: string = "add";  //check if it add/update mode
  tableInfo: any[] = []; // array for sending columns index user wants to show in UI.
  enabled:boolean = true;
  rejectVisible: boolean;
  acceptLable: string;
  deleteMonConf: Subscription; // to detect delete operation
  constructor(
    private cd: ChangeDetectorRef,
    public monConfigurationService: MonConfigurationService,
    private messageService: MessageService,
    private cms: ConfirmationService,
    private monitorupdownService: MonitorupdownstatusService,

  ) { }

  ngOnInit() {
    const me = this;
    this.monitorupdownService.getConfigInfo('logPattern').subscribe(response => {
      this.splitTableResponse(response);
  });
  
    this.tableInfo = [
      { field: "tierInfo", header: 'Tier-Server Information', visible: true },
      { field: "instance", header: 'Instance', visible: true },
      { field: "logPatternMon", header: 'Metric Group', visible: true },
      { field: "file", header: 'File/Command/JournaldD', visible: true },
    ]

    let metricListLabel = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
    let metricListValue = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
    this.metricList = UtilityService.createListWithKeyValue(metricListLabel, metricListValue);

    let unitListlabel = ['Per Sec', 'Per Min'];
    let unitListValue = ['PerSec', 'PerMin'];
    this.unitList = UtilityService.createListWithKeyValue(unitListlabel, unitListValue);

    me.tableCols = [
      { field: "gMonId", header: 'gMonId' },
      { field: "monInfo", header: 'Group Name' },
      { field: "tierInfo", header: 'Tier Information' },
      { field: "_id", header: '_id' },
      { field: "instances", header: 'instances' }
    ]

    me.tablePatternCols = [
      { field: "searchPattern", header: 'Search Pattern' },
      { field: "graphName", header: 'Graph Name' },
      { field: "unit", header: 'Unit' }
    ]
    let arrLabel = ['Use file name', 'Use command to get the file name', 'Use JournalD'];
    let arrValue = ['-f', '-c', '-f __journald']
    this.logFileSelectionList = UtilityService.createListWithKeyValue(arrLabel, arrValue);

   // Bug 110416
   this.deleteMonConf = this.monitorupdownService.$deleteMonConf.subscribe((res) => {
    if(res){
      this.resetUI();
    }
 });
  }

  /**This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number {
    let index = this.logPatternData['gdfDetails'].findIndex(each => each["id"] == data)
    return index;
  }

  /**For ADD Functionality-
    *This method is called when user want to ADD gdf details
    */
  openDialog() {
    this.dialogHeaderForTable = "Add Patterns";
    this.showSrchDialog = true;
    this.gdfData = new GdfTableData();
    this.isFromAdd = true;
  }

  /*This method is used to get the dropdown label in the table*/
  getDropDownLabel() {

    let key = this.gdfData['unit'];
    this.unitList.map(each => {
      if (each.value == key) {
        this.gdfData['unit-ui'] = each.label;
      }
    })
  }

  saveLogData() {
    if (this.logPatternData['gdfDetails'].length == 0) {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Please enter atleast details for one graph" });
      return false;
    }
    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }
    let options = this.createOptionsForLogMonitor()
    this.saveMonConfiguration(options);
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

    if (this.logPatternData.metric === "Custom Metrics")
      this.logPatternData.metric = this.logPatternData.customMetricName;

    body['mon'][this.logPatternData.gdfName] = {
      "options": monOptions,
      "instanceName": this.logPatternData.instance,
      "enabled": this.enabled,
      "type": "logPattern",
      "gdfName": this.logPatternData.gdfName
    };
    this.logPatternData.gdfDetails.map(each => {
      let metricObj = {
        graphNm: each.graphName,
        unit: each.unit
      }
      metricGrpInfo.push(metricObj);
    })
    gdfInfo = {
      grpN: this.logPatternData.gdfName,
      mV: this.logPatternData.metric,
      gD: "Desc",
      metricInfo: metricGrpInfo
    }
    reqBody =
    {
      "techName": "logPattern",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": this.tierServerInfo,
      "body": body,
      "gdfInfo": gdfInfo
    }

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(reqBody, "logPattern", this.objectId).subscribe(res => {
      if (res['status']) {
        this.monitorupdownService.getConfigInfo('logPattern').subscribe(response => {
          this.tierChild.clearTierServerData();
          this.logPatternData = new LogPatternData();
          this.splitTableResponse(response);
          this.loading = false;
          this.operation = "add";
          this.AddEditLabel = "Add";
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Log Pattern Monitor saved successfully' })
      });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: res['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
  }

  /**For EDIT Functionality-
 *This method is called when user want to edit the graph definiton details
 */
  editDialog() {
    if (!this.selectedGDFdetails || this.selectedGDFdetails.length < 1) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary:COMPONENT.SUMMARY_ERROR, detail: "No row is selected to edit" });
      return;
    }
    else if(this.selectedGDFdetails.length > 1){
      this.messageService.add({severity:COMPONENT.SEVERITY_ERROR,summary:COMPONENT.SUMMARY_ERROR,detail:"Select a single row to edit"});
      return;
    }

    this.showSrchDialog = true;
    this.isFromAdd = false;
    this.dialogHeaderForTable = "Edit Patterns";

    this.tempId = this.selectedGDFdetails[0]["id"];
    this.gdfData = Object.assign({}, this.selectedGDFdetails[0]);
  }

  createOptionsForLogMonitor() {
    let val = '';
    val = val + this.logPatternData.fileNameSelection + COMPONENT.SPACE_SEPARATOR;
    let textForFileName = '';
    /** -f "__journald%3A-u+specifiueJournanlD+" */
    if (this.logPatternData.fileNameSelection == "-f __journald") {
      // For JournalD - specified file case 
      if (this.logPatternData.journalType == "-u")
        textForFileName = this.logPatternData.journalType + COMPONENT.SPACE_SEPARATOR + this.logPatternData.fileName;
      else // For JournalD - all case 
        textForFileName = '';
    }
    else {
      textForFileName = this.logPatternData.fileName;
    }

    if (textForFileName != null && textForFileName != '') {
      val = val + encodeURIComponent(textForFileName) + COMPONENT.SPACE_SEPARATOR;
    }
    else // handling case for onchange in file selection type of journalD from specified to all
      val = val + COMPONENT.SPACE_SEPARATOR;

    let logPatternMonVal = '';
    logPatternMonVal = this.createDataForLogPatternMonitor(this.logPatternData);
    //for bug 80307- for multiple file support
    if (this.logPatternData.readMulFile)
      val = val + "-y" + COMPONENT.SPACE_SEPARATOR + "V2" + COMPONENT.SPACE_SEPARATOR;

    // for support of (-N) option in log pattern in case use file name option
    if (this.logPatternData.fileNameSelection == "-f" && this.logPatternData.instCount) {
      val = val + COMPONENT.SPACE_SEPARATOR + "-N" + COMPONENT.SPACE_SEPARATOR + this.logPatternData.instCount + COMPONENT.SPACE_SEPARATOR;
    }
    else {
      this.logPatternData.instCount = null;
    }

    val = val + logPatternMonVal;

    // for support of (-W) option in log pattern and log data monitor
    if (this.logPatternData.dumpServer)
      val = val + COMPONENT.SPACE_SEPARATOR + "-W" + COMPONENT.SPACE_SEPARATOR;

    return val.trim();
  }

  createDataForLogPatternMonitor(formData) {
    let val = "";
    let gdfDetails = formData.gdfDetails;
    let unitData = "-C" + COMPONENT.SPACE_SEPARATOR;
    let searchPattern = "";

    gdfDetails.map(function (each) {
      unitData = unitData + each.unit + ",";
      searchPattern = searchPattern + "-p" + COMPONENT.SPACE_SEPARATOR + encodeURIComponent(each.searchPattern) + COMPONENT.SPACE_SEPARATOR;
    })

    val = val + unitData.substring(0, unitData.length - 1) + COMPONENT.SPACE_SEPARATOR + searchPattern.trim();
    return val.trim();
  }

  /** For SAVE Functionality-
  * This method is called when user performs save operation when ADD/EDIT is done for the gdf details.
  */
  saveSrchPattData() {
    this.getDropDownLabel();
    /* for saving the details on ADD Functionality*/
    if (this.isFromAdd) {
      this.gdfData["id"] = this.count;
      this.logPatternData.gdfDetails = ImmutableArray.push(this.logPatternData.gdfDetails, this.gdfData);
      this.count = this.count + 1;
      this.showSrchDialog = false;
    }

    /*for saving the updated details on EDIT functionality*/
    else {
      this.gdfData["id"] = this.tempId;
      this.logPatternData.gdfDetails = ImmutableArray.replace(this.logPatternData.gdfDetails, this.gdfData, this.getSelectedRowIndex(this.gdfData["id"]))
      this.isFromAdd = true;
      this.showSrchDialog = false;
      this.selectedGDFdetails = [];
    }

  }

  editData(data) {
    this.logPatternData = new LogPatternData();
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
    this.logPatternData.gdfName = formData['custMonGdfDto']['logMonName'];
    this.logPatternData.instance = formData['custMonGdfDto']['instance'];
    this.enabled = formData['custMonGdfDto']['enabled'];
    if(formData['gdf']['mV'] != 'Application Metrics' && formData['gdf']['mV'] != 'System Metrics'){
      this.logPatternData.customMetricName = formData['gdf']['mV'];
      this.logPatternData.metric = "Custom Metrics"
    }
  }

  fillGDFTabledata(data) {
    let options = data['custMonGdfDto']['options'].replace(/ +/g, ' ').trim();
    let metricInfo = data['gdf']['metricInfo'];
    let gdfData = options.split(" ");
    let pattern = [];
    for (let i = 0; i < gdfData.length; i++) {
      if (gdfData[i] === "-f") {
        if (gdfData[i + 1] === "__journald") {
          this.logPatternData.fileNameSelection = "-f __journald";
        }
        else {
          this.logPatternData.fileNameSelection = "-f";
          this.logPatternData.fileName = decodeURIComponent(gdfData[i + 1]);
        }
      }
      if (gdfData[i] === "-N")
        this.logPatternData.instCount = gdfData[i + 1];
      if (gdfData[i] === "-c") {
        this.logPatternData.fileNameSelection = "-c";
        this.logPatternData.fileName = decodeURIComponent(gdfData[i + 1]);
      }
      if (gdfData[i] === "-u")
        this.logPatternData.fileName = decodeURIComponent(gdfData[i + 1]);
      if (gdfData[i] === "-y")
        this.logPatternData.readMulFile = true;
      if (gdfData[i] === "-W")
        this.logPatternData.dumpServer = true;
      if (gdfData[i] === "-p") {
        pattern.push(decodeURIComponent(gdfData[i + 1])) // for bug 112600 converted encoded data to decoded form
      }
    }

    metricInfo.forEach((value, index) => {
      this.gdfData = new GdfTableData();
      this.gdfData.searchPattern = pattern[index];
      this.gdfData.graphName = value['graphNm'];
      this.gdfData.unit = value['unit'];
      this.isFromAdd = true;
      this.saveSrchPattData();
    })
  }

  resetUI(){
    this.AddEditLabel = 'Add';
    this.operation = "add";
    this.gMonId = "-1";
    this.objectId = "-1";
    this.tierChild.clearTierServerData();
    this.logPatternData = new LogPatternData();
  }

  splitTableResponse(data){
    data.map(each=>{
      let options = each['options'].trim().split(" ");
      let fileSelection;
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
      }
      each['file'] = decodeURIComponent(fileSelection)
    })
    this.monInfoChild.getTableData(data);
  }

  deleteGDFDetails()
  {
    if (this.logPatternData['gdfDetails'].length == 0) 
    {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "No record is present to delete" });
     return;
    }

    if (!this.selectedGDFdetails || this.selectedGDFdetails.length == 0) 
    {
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
    this.selectedGDFdetails.map(function(each)
    {
      arrId.push(each["id"])
    })

    this.logPatternData['gdfDetails'] = this.logPatternData['gdfDetails'].filter(function(val)
    {
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
    if(this.deleteMonConf)
      this.deleteMonConf.unsubscribe();
  } 
}
