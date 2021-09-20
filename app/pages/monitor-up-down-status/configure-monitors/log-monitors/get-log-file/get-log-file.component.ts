import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng';
import { UtilityService } from '../../../service/utility.service';
import { ConfiguredMonitorInfoComponent } from '../../configured-monitor-info/configured-monitor-info.component';
import { TierServerComponent } from '../../tier-server/tier-server.component';
import { LogPatternData } from '../log-pattern-monitor/log-pattern-data';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-get-log-file',
  templateUrl: './get-log-file.component.html',
  styleUrls: ['./get-log-file.component.scss']
})
export class GetLogFileComponent implements OnInit {

  @ViewChild(TierServerComponent) tierChild: TierServerComponent;
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;

  getLogData: LogPatternData = new LogPatternData();

  /*flag used to display dialog*/
  addDialog: boolean = false;

  /*List for log file name */
  logFileSelectionList: any[] = [];

  selectedLogFile: string;

  runOptionList: any[] = [];

  savefileOptList: any[] = [];

  logMonType: string;

  /*This variable is used to hold temporary id of the selected row of gdf details table used in EDIT functionality */
  tempId: number = 0;

  /*This variable is used to check whether it is ADD/EDIT functionality*/
  isFromAdd: boolean;
  categoryName: string;
  /*Counter for ADD/EDIT  */
  count: number = 0;

  /**Note label in UI for read multiple log files */
  noteLabel1: string = "For multiple log files, special characters supported in file path are * ? [ ] '{' } ( ) +, else only * is supported at file level."

  noteLabel: string = "1.If file name has regular expression, it will only use the last modified file."

  loading: boolean
  operation: string = "add";  //check if it add/update mode
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  AddEditLabel: string = "Add";    //label for Add/Update Button
  tierServerInfo: any[] = [];
  tableInfo: any[];
  enabled:boolean = true;
  deleteMonConf: Subscription; // to detect delete operation

  constructor(private messageService: MessageService, private cd: ChangeDetectorRef,
    private monitorupdownService: MonitorupdownstatusService) { }

  ngOnInit() {

    this.monitorupdownService.getConfigInfo('getLogFile').subscribe(response => {
      this.splitTableResponse(response);
  });

    let arrLabel = ['Use file name', 'Use command to get the file name', 'Use JournalD'];
    let arrValue = ['-f', '-c', '-f __journald']
    this.logFileSelectionList = UtilityService.createListWithKeyValue(arrLabel, arrValue);

    let savfileOptLabel = ['Save File in TR Directory', 'Save at location'];
    let savfileOptValue = ['', '-d'];
    this.savefileOptList = UtilityService.createListWithKeyValue(savfileOptLabel, savfileOptValue);

    this.tableInfo = [
      { field: "tierInfo", header: 'Tier-Server Information', visible: true },
      { field: "getLogFile", header: 'Metric Group', visible: true },
      { field: "file", header: 'File/Command/JournaldD', visible: true },
    ]

   // Bug 110416
   this.deleteMonConf = this.monitorupdownService.$deleteMonConf.subscribe((res) => {
    if(res){
      this.resetUI();
    }
 });
  }

  editData(data) {
    this.getLogData = new LogPatternData();
    this.loading = true;
    this.operation = "update"
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
    this.getLogData.gdfName = formData['custMonGdfDto']['logMonName'];
    this.enabled = formData['custMonGdfDto']['enabled'];
  }

  fillGDFTabledata(data) {
    let options = data['custMonGdfDto']['options'].replace(/ +/g, ' ').trim();
    let gdfData = options.split(" ");
    for (let i = 0; i < gdfData.length; i++) {
      if (gdfData[i] === "-f") {
        if (gdfData[i + 1] === "__journald") {
          this.getLogData.fileNameSelection = "-f __journald";
        }
        else {
          this.getLogData.fileNameSelection = "-f";
          this.getLogData.fileName = decodeURIComponent(gdfData[i + 1]);
        }
      }
      if (gdfData[i] === "-N")
        this.getLogData.instCount = gdfData[i + 1];
      if (gdfData[i] === "-c") {
        this.getLogData.fileNameSelection = "-c";
        this.getLogData.fileName = decodeURIComponent(gdfData[i + 1]);
      }
      if (gdfData[i] === "-u")
        this.getLogData.fileName = decodeURIComponent(gdfData[i + 1]);
      if (gdfData[i] === "-y")
        this.getLogData.readMulFile = true;
      if (gdfData[i] === "-d"){
        this.getLogData.fileLocation = gdfData[i];
        this.getLogData.fileLocationval = gdfData[i+1];
      }
      if (gdfData[i] === "-t")
        this.getLogData.truncateFile = true;
      if (gdfData[i] === "-s")
        this.getLogData.logFileSize = gdfData[i+1];
        if (gdfData[i] === "-k")
        this.getLogData.remoteServer = gdfData[i+1];
        if (gdfData[i] === "-H"){
          this.getLogData.checkLogRemote = true;
          this.getLogData.remoteHierarchy = gdfData[i+1];
        }
    }
  }

  resetUI() {
    this.AddEditLabel = 'Add';
    this.operation = "add";
    this.gMonId = "-1";
    this.objectId = "-1";
    this.tierChild.clearTierServerData();
    this.getLogData = new LogPatternData();
  }

  saveLogData() {
    this.tierServerInfo = this.tierChild.getTierServerInfo();
    if (this.tierServerInfo.length == 0) {
      return false;
    }
    let options = this.createOptionsForLogMonitor()
    this.saveMonConfiguration(options);
  }

  createOptionsForLogMonitor() {
    let val = '';
    val = val + this.getLogData.fileNameSelection + COMPONENT.SPACE_SEPARATOR;
    let textForFileName = '';
    /** -f "__journald%3A-u+specifiueJournanlD+" */
    if (this.getLogData.fileNameSelection == "-f __journald") {
      // For JournalD - specified file case 
      if (this.getLogData.journalType == "-u")
        textForFileName = this.getLogData.journalType + COMPONENT.SPACE_SEPARATOR + this.getLogData.fileName;
      else // For JournalD - all case 
        textForFileName = '';
    }
    else {
      textForFileName = this.getLogData.fileName;
    }

    if (textForFileName != null && textForFileName != '') {
      val = val + encodeURIComponent(textForFileName) + COMPONENT.SPACE_SEPARATOR;
    }
    else // handling case for onchange in file selection type of journalD from specified to all
      val = val + COMPONENT.SPACE_SEPARATOR;

    let getLogMonVal = '';
    if (this.getLogData.readMulFile)
      val = val + "-y" + COMPONENT.SPACE_SEPARATOR + "V2" + COMPONENT.SPACE_SEPARATOR;
    getLogMonVal = this.createDataForGetLogData(this.getLogData);

    val = val + getLogMonVal;

    return val.trim();
  }

  createDataForGetLogData(formData) {
    let val = "";
    if (formData.fileLocation === "-d")
      val = val + formData.fileLocation + COMPONENT.SPACE_SEPARATOR + formData.fileLocationval + COMPONENT.SPACE_SEPARATOR;
    if (formData.truncateFile)
      val = val + "-t" + COMPONENT.SPACE_SEPARATOR;
    val = val + COMPONENT.SPACE_SEPARATOR + "-s" + COMPONENT.SPACE_SEPARATOR + this.getLogData.logFileSize 
          + COMPONENT.SPACE_SEPARATOR;
    if (formData.checkLogRemote) {
      val = val + COMPONENT.SPACE_SEPARATOR + "-k " + formData.remoteServer
        + COMPONENT.SPACE_SEPARATOR + "-H " +  formData.remoteHierarchy;
    }
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
    body['mon'][this.getLogData.gdfName] = {
      "options": monOptions,
      "instance": this.getLogData.instance,
      "enabled": this.enabled,
      "type": "getLogFile",
      "gdfName": this.getLogData.gdfName
    };
    gdfInfo = {
      grpN: this.getLogData.gdfName,
      mV: "TestMetrics",
      gD: "Desc",
      metricInfo: metricGrpInfo
    }
    reqBody =
    {
      "techName": "getLogFile",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": this.tierServerInfo,
      "body": body,
      "gdfInfo": gdfInfo
    }

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(reqBody, "getLogFile", this.objectId).subscribe(res => {
      if (res['status']) {
        this.tierChild.clearTierServerData();
        this.monitorupdownService.getConfigInfo('getLogFile').subscribe(response => {
          this.getLogData = new LogPatternData();
          this.splitTableResponse(response);
          this.loading = false;
          this.operation = "add";
          this.AddEditLabel = "Add";
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Get log File saved successfully' })
      });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: res['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
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
      each['file'] = decodeURIComponent(fileSelection);
    })
    this.monInfoChild.getTableData(data);
  }

  ngOnDestroy() {
    if(this.deleteMonConf)
      this.deleteMonConf.unsubscribe();
  } 
}
