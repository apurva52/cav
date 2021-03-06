import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ConfigNdAgentService } from '../../configuration/nd-config/services/config-nd-agent.service';
import { NDAgentInfo, CmonInfo } from '../../configuration/nd-config/interfaces/nd-agent-info';
import { CavConfigService } from '../../configuration/nd-config/services/cav-config.service';
import { ConfigUtilityService } from '../../configuration/nd-config/services/config-utility.service';
import { map } from 'rxjs/operators';
import { timer } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
 
 

@Component({
  selector: 'app-config-nd-agent',
  templateUrl: './cav-nd-agent.component.html',
  styleUrls: ['./cav-nd-agent.component.css']
})



export class CavNdAgentComponent implements OnInit {
  prodKey: string;
  prodName: string;

  
  constructor(private configNdAgentService: ConfigNdAgentService, private sessionService: SessionService, private message: MessageService ,private _http: HttpClient, private _config: CavConfigService, private configUtilityService: ConfigUtilityService) { }

  /**Getting application list data */
  ndAgentStatusData: NDAgentInfo[];
  cmonStatusData: CmonInfo[];
  selectedCmonAgent: boolean = false;
  selectedNdAgent: boolean = false;

  totalMachineAgent: string;
  totalApplicationAgent: string;
  loading: boolean = true;

  /** Keywords for Hide or UnHide  Cmon Agents Column Filters */
  isCmonCheckFilter: boolean = true;
  isCmonCloseFilter: boolean;
  isCmonFilter: boolean;
  /** Keywords for Hide or UnHide ND Agent Columns Filters */
  isNdCheckFilter: boolean = true;
  isNdCloseFilter: boolean;
  isNdFilter: boolean;
  subscription: Subscription;

  isShowCmonConfigPath: boolean = true;
  isHideCmonConfigPath: boolean = false;

  isShowBCIConfigPath: boolean = true;
  isHideBCIConfigPath: boolean = false;

  selectedViewCols: any[];
  columnOptions: any[];

  index = 0;
  runningStatus = "";
  completedStatus = "";
  arrComplete = [];
  restartStatus = "";
  selectedCmonAgentList: any[];
  selectedCmonAgentPidList: string[];
  processId: string;

  // keywords for Cmon Env 
  cmonEnvAdvancedKeyLabelList: string[] = [];
  cmonEnvAdvancedValueList: string[] = [];

  cmonEnvNormalKeyLabelList: string[] = [];
  cmonEnvNormalValueList: string[] = [];

  cmonEnvNormalTextAreaLabelList: string[] = [];
  cmonEnvNormalTextAreaValueList: string[] = [];
  viewEditCmonDialog: boolean;
  isUpdate: boolean;
  // message: Message ;
  readWritePermission:string;
  isProgressBar: boolean = false;
  color: string = "primary";  


  rowDataServerID: string; // si for view, edit and save 
  cmonHomePath: string;
  cmonPid: string;
  cmonTier: string;
  cmonServerName: string;
  cmonMachineType: string;


  //Variables to create dropdown for table : Application Agent Status
  selectedViewColsApp: any[] = [];
  columnOptionsForApp: any[] = [];

  pathForCmon: string;
  
  

  ngOnInit() {
    this.loadCmonAgentData();
    let timerObj = timer(10, 10);
    this.prodKey = this.sessionService.session.cctx.pk;
    this.prodName = this.sessionService.session.cctx.prodType;
    if(this.prodName == 'NetDiagnostics')
       this.prodName =  'netdiagnostics';
       this.configUtilityService.progressBarProvider$.subscribe(flag => {
        // For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
        setTimeout(() => {
            this.isProgressBar = flag['flag'];
            this.color = flag['color'];
        }, 1);

    });

    

    let cols = [];
    cols = [
      { field: 'cp', header: 'Pid' },
      { field: 'tier', header: 'Tier' },
      { field: 'sn', header: 'Server' },
      { field: 'si', header: 'Server IP' },
      { field: 'mt', header: 'OS' },
      { field: 'cv', header: 'Version' },
      { field: 'cst', header: 'Agent Start Time' },
      { field: 'cpath', header: 'Configuration URL' },
      { field: 'ccut', header: 'Cmon Settings Update Time' },
      { field: 'aia', header: 'Status' },
      { field: 'act', header: 'Action(s)' },
    ]

    this.columnOptions = [];
    this.selectedViewCols = [];
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].field != 'cpath') {
        this.selectedViewCols.push(cols[i].field);
      }
      this.columnOptions.push({ label: cols[i].header, value: cols[i].field });
    }

  // Purpose :To make dropdown for show/hide column of table : Application Agent Status
    let colsApp = [];
    colsApp = [
      { field: 'pid', header: 'Pid' },
      { field: 'tier', header: 'Tier' },
      { field: 'server', header: 'Server' },
      { field: 'si', header: 'Server IP' },
      { field: 'instance', header: 'Instance' },
      { field: 'iD', header: 'Installation Dir' },
      { field: 'at', header: 'Agent Type' },
      { field: 'ver', header: 'Version' },
      { field: 'brs', header: 'Agent Start Time' },
      { field: 'cpath', header: 'Configuration URL' },
      { field: 'st', header: 'Status' }
    ]
    for (let i = 0; i < colsApp.length; i++) {
      if (colsApp[i].field != 'cpath') {
        this.selectedViewColsApp.push(colsApp[i].field);
      }
      this.columnOptionsForApp.push({ label: colsApp[i].header, value: colsApp[i].field });
    }

    timerObj.subscribe(t => this.loadNDAgentStatusData());

     this.readWritePermission = sessionStorage.getItem('AdminConfigurationNrestart') 

  }



  /**Getting application list data */
  loadNDAgentStatusData(): void {

    /* assign the value of ND Agent(Application Agent) in table */
    this.configNdAgentService.getNDAgentStatusData().subscribe(data => {
      /**this keyword fill the data in table */
      var count = 0;
      //Variable name to store data of active,inactive and disconnected status agent separetely. So, UI can show first all Active then Inactive then disconnected agent.
      var activeData = [], inactiveData = [], disconnectedData = [];
      /*Assign Total Agent and Active agetns */
      for (var i = 0; i < data.length; i++) {
	if (data[i].st == "-")
        {
          data[i].st = "Not Connected";
          disconnectedData.push(data[i]);
        }
        else if (data[i].st == "Active" || data[i].st == "active")
        {
          count++;
          activeData.push(data[i]);
        }
        else
        {
          inactiveData.push(data[i]);
        }
      }
      data = activeData.concat(inactiveData).concat(disconnectedData);
      this.ndAgentStatusData = data;
      this.loading = false;
      this.totalApplicationAgent = " (Total: " + data.length + ", Active: " + count + ")";
    });
    this.subscription.unsubscribe();
  }

  /* assign the value of Cmon Agent(Machine Agent) in table */
  loadCmonAgentData() {
    this.selectedCmonAgentList = [];
    this.configNdAgentService.getCmonStatusData().subscribe(data => {
      this.loading = false;
      var count = 0;
      //Variable name to store data of active and inactive status agent separetely. So, UI can show first all Active then Inactive agent.
      var activeData = [], inactiveData = [];
      /*Assign Total Agent and Active agetns */
      for (var i = 0; i < data.length; i++) {
	if (data[i].aia == "Active" || data[i].aia == "active")
        {
          count++; 
          activeData.push(data[i]);
        }
        else
        {
          inactiveData.push(data[i]);
        }
      }
      data = activeData.concat(inactiveData);
      /**this keyword fill the data in table */
      this.cmonStatusData = data;
      this.totalMachineAgent = " (Total: " + data.length + ", Active: " + count + ")";
    });
  }

  /* for download Excel, word, Pdf File */
  downloadReports(reports: string) {
    let object =
    {
      data: JSON.stringify(this.cmonStatusData),
      downloadType: reports,
      productName: this.prodName,
      agentType: "CMONAGENT",
      totalAgent: this.totalMachineAgent
    }
    //  var downloadFileUrl = "http://" + window.location.host + "/ProductUI/productSummary/SummaryWebService/downloadAgentFile";
    
    var hostDcName = window.location.protocol + '//' + window.location.host ;
    var downloadFileUrl = hostDcName + "/ProductUI/productSummary/SummaryWebService/downloadAgentFile?productKey=" + this.prodKey;
    console.log('data========>',downloadFileUrl );
    this._http.post(downloadFileUrl, JSON.stringify(object), {responseType : 'text'})
      .pipe(map(res => <any>res )).subscribe(res => (this.openDownloadReports(res)));
  }

  downloadNdReports(reports: string) {
    let object =
    {
      data: JSON.stringify(this.ndAgentStatusData),
      // tslint:disable-next-line: align
      downloadType: reports,
      productName: this.prodName,
      agentType: "NDAGENT",
      totalAgent: this.totalApplicationAgent
      
    }
    var hostDcName = window.location.protocol + '//' + window.location.host;

    var downloadFileUrl = hostDcName + "/ProductUI/productSummary/SummaryWebService/downloadAgentFile?productKey=" + this.prodKey;
    this._http.post(downloadFileUrl, JSON.stringify(object), {responseType : 'text'})
      .pipe(map(res => <any>res)).subscribe(res => (this.openDownloadReports(res)));
  }


  /* for open download reports*/
  openDownloadReports(res) {
    // window.open(this._config.getURLByActiveDC() + "common/" + res);'
    var hostDcName = window.location.protocol + '//' + window.location.host;
    console.log('value==========',hostDcName );
    window.open(hostDcName + "/common/" + res);
  }

  // openDownloadReports(res) {
  //   window.open( "/common/" + res);
  // }

  /** Method for Hide or UnHide Column Filters */
  showCmonFilter(type: string) {
    if (type == "check") {
      this.isCmonCheckFilter = false;
      this.isCmonCloseFilter = true;
      this.isCmonFilter = true;
    }
    if (type == "uncheck") {
      this.isCmonCheckFilter = true;
      this.isCmonCloseFilter = false;
      this.isCmonFilter = false;
    }
  }

  showNDFilter(type: string) {
    if (type == "check") {
      this.isNdCheckFilter = false;
      this.isNdCloseFilter = true;
      this.isNdFilter = true;
    }
    if (type == "uncheck") {
      this.isNdCheckFilter = true;
      this.isNdCloseFilter = false;
      this.isNdFilter = false;
    }
  }
  /* Cmon Pid sorting */
  myCmonSort(event, cmonStatusData) {
    if (event["field"] == "cp") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        cmonStatusData = cmonStatusData.sort(function (a, b) {
          //If a[temp] / b[temp] is coming "-" then we are connverting it to -1 so that we can sort the values
          if (a[temp] == "-")
            a[temp] = "-1";
          else if (b[temp] == "-")
            b[temp] = "-1";
          var value = parseInt(a[temp]);
          var value2 = parseInt(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        cmonStatusData = cmonStatusData.sort(function (a, b) {
          //If a[temp] / b[temp] is coming "-" then we are connverting it to -1 so that we can sort the values
          if (a[temp] == "-")
            a[temp] = "-1";
          else if (b[temp] == "-")
            b[temp] = "-1";
          var value = parseInt(a[temp]);
          var value2 = parseInt(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.cmonStatusData = [];
    cmonStatusData.forEach(element => {
      //If element.cp is coming -1 then it will reset the value of same to "-"
      if (element.cp == "-1")
        element.cp = "-";
      this.cmonStatusData = this.cmonStatusData.concat(element);
    });
  }

  /* nd Agent Pid sorting */
  mysort(event, ndAgentStatusData) {
    if (event["field"] == "pid") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        ndAgentStatusData = ndAgentStatusData.sort(function (a, b) {
          //If a[temp] / b[temp] is coming "-" then we are connverting it to "-1" so that we can sort the values
          if (a[temp] == "-")
            a[temp] = "-1";
          else if (b[temp] == "-")
            b[temp] = "-1";
          var value = parseInt(a[temp]);
          var value2 = parseInt(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        ndAgentStatusData = ndAgentStatusData.sort(function (a, b) {
          //If a[temp] / b[temp] is coming "-" then we are connverting it to "-1" so that we can sort the values
          if (a[temp] == "-")
            a[temp] = "-1";
          else if (b[temp] == "-")
            b[temp] = "-1";
          var value = parseInt(a[temp]);
          var value2 = parseInt(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.ndAgentStatusData = [];
    ndAgentStatusData.forEach(element => {
      //If element.pid is coming -1 then it will reset the value of same to "-"
      if (element.pid == "-1")
        element.pid = "-";
      this.ndAgentStatusData = this.ndAgentStatusData.concat(element);
    });
  }

  showCmonConfigPath(type: string) {
    if (type == "check") {
      this.isShowCmonConfigPath = false;
      this.isHideCmonConfigPath = true;
    }
    if (type == "uncheck") {
      this.isShowCmonConfigPath = true;
      this.isHideCmonConfigPath = false;
    }
  }

  showBCIConfigPath(type: string) {
    if (type == "check") {
      this.isShowBCIConfigPath = false;
      this.isHideBCIConfigPath = true;
    }
    if (type == "uncheck") {
      this.isShowBCIConfigPath = true;
      this.isHideBCIConfigPath = false;
    }
  }

  // This method is used for route to config setting path
  routeToConfigPath(path) {
    window.open(path.cpath);
  }

  //This Method is used to restart Cmon Agent(s)

   restartCmonAgent(): void {
    this.index = 0;
    this.selectedCmonAgentPidList = [];
    if (!this.selectedCmonAgentList || this.selectedCmonAgentList.length < 1) {
      this.message.add({ severity: 'error', detail: "Select a row to restart Machine Agent." });
      return;
    }

    for (let i = 0; i < this.selectedCmonAgentList.length; i++) {
      let serverIpAndAgent = this.selectedCmonAgentList[i]["si"] + "#" + this.selectedCmonAgentList[i]["cmonAgent"];
      this.selectedCmonAgentPidList.push(serverIpAndAgent);
    }
    this.loading = true;
    this.configNdAgentService.getCmonEnvRestartedStatus(this.selectedCmonAgentPidList, this.prodKey).subscribe(data => {
      this.selectedCmonAgentList = [];
      this.loading = false;
      this.loadCmonAgentData();
      if(data["result"] == "true")
      {
        this.message.add({ severity: 'success', detail: "Machine Agent(s) Re-Started Successfully" });
      }
      else if(data["result"] == "false")
      {
        this.message.add({ severity: 'error', detail: "Restart Operation Failed" });
      }
      else{
        let AgentInfo = "Restart Aborted for Machine(s): " + data["result"] + ". <br> Please check in Audit logs.";
        this.message.add({ severity: 'error', detail: AgentInfo });
      }

    });
  }

  // // This method is used to get status of  Restarted Cmon Agent(s) 
  // private getRestartCmonAgentInfo(data): void {
  //   this.selectedCmonAgentPidList = this.selectedCmonAgentPidList.filter(item => item !== data.cp);
  //   this.runningStatus = "running";
  //   this.processId = data.cp;
  //   setTimeout(() => {
  //     if (this.runningStatus != 'stop')
  //       this.arrComplete.push(data.cp);

  //     this.runningStatus = "complete";
  //     this.completedStatus = "complete";
  //     this.processId = data.cp;
  //     this.index++;
  //     if (this.selectedCmonAgentList.length > this.index) {
  //       this.getRestartCmonAgentInfo(this.selectedCmonAgentList[this.index])
  //     }
  //   }, 3000);

  // }

  // /**
  //  * This method is used to stop Running Cmon Agent
  //  */
  // private stopRunningCmonAgent(data): void {
  //   this.runningStatus = 'stop';
  //   this.processId = data;
  // }


  /**
   * This Method is used for ViewAndUpdateCmonEnvData
   */
   // tslint:disable-next-line: max-line-length
   
   public ViewAndUpdateCmonEnvData(type: string, cmonPid: string, rowDataServerID: any, cmonHomePath: string, cmonTier: string, cmonServerName: string, cmonMachineType: string): void {
    this.cmonEnvAdvancedKeyLabelList = [];
    this.cmonEnvAdvancedValueList = [];
    this.cmonEnvNormalKeyLabelList = [];
    this.cmonEnvNormalValueList = [];
    this.cmonEnvNormalTextAreaLabelList = [];
    this.cmonEnvNormalTextAreaValueList = [];

    // tslint:disable-next-line: triple-equals
    if (type == 'Edit') {
      // if (!this.selectedCmonAgentList || this.selectedCmonAgentList.length < 1) {
      //   this.message = [{ severity: 'error', detail: "Select a row to edit." }];
      //   return;
      // }
      // else if (this.selectedCmonAgentList.length > 1) {
      //   this.message = [{ severity: 'error', detail: "Select only one row to edit." }];
      //   return;
      // }
      this.isUpdate = true;
      this.updateSelectedCmonAgentSettings(cmonPid, rowDataServerID, cmonHomePath, cmonTier, cmonServerName, cmonMachineType);
    }
    else {
      // if (!this.selectedCmonAgentList || this.selectedCmonAgentList.length < 1) {
      //   this.message = [{ severity: 'error', detail: "Select a row to view." }];
      //   return;
      // }
      // else if (this.selectedCmonAgentList.length > 1) {
      //   this.message = [{ severity: 'error', detail: "Select only one row to view." }];
      //   return;
      // }
      this.isUpdate = false;
  
      this.viewSelectedCmonAgentSettings(cmonPid, rowDataServerID, cmonHomePath, cmonTier, cmonServerName, cmonMachineType);
    }
  }

  /**
   * This Method is used to View Settings of Selected Cmon Agent
   */
  private viewSelectedCmonAgentSettings(cmonPid, rowDataServerID, cmonHomePath, cmonTier, cmonServerName, cmonMachineType): void {
    this.cmonEnvAdvancedKeyLabelList = [];
    this.cmonEnvAdvancedValueList = [];
    this.cmonEnvNormalKeyLabelList = [];
    this.cmonEnvNormalValueList = [];
    this.cmonEnvNormalTextAreaLabelList = [];
    this.cmonEnvNormalTextAreaValueList = [];
    this.loading = true;
    let cmonInfoArr = [];
    cmonInfoArr[0] = rowDataServerID;
    cmonInfoArr[1] = cmonHomePath;
    cmonInfoArr[2] = cmonPid+ "~~" + cmonTier + "~~" + cmonServerName;
    cmonInfoArr[3] = cmonMachineType;
    
    this.configNdAgentService.getCmonEnvKeyValueForShow(cmonInfoArr, this.prodKey).subscribe(data => {
      this.loading = false;
      for (let key in data) {
	//If status of download of cmon.env fails then we don't open View dialog
        if(key == "message" && data[key] == "Failed to download"){
          this.message.add({ severity: 'error', detail: "View operation failed : Please check configuration settings" });
          return;
      }
        let str = key.split("##");

        if (str[1] == 'Normal') {
         if(str[0] == "Class Path" || str[0] == "Machine Settings" || str[0] == "Machine agent Settings")
         {
          this.cmonEnvNormalTextAreaLabelList.push(str[0]);
          this.cmonEnvNormalTextAreaValueList.push(data[key]);
         }
         else{
           this.cmonEnvNormalKeyLabelList.push(str[0]);
           this.cmonEnvNormalValueList.push(data[key]);
         }
        }
        else {
          this.cmonEnvAdvancedKeyLabelList.push(str[0]);
          this.cmonEnvAdvancedValueList.push(data[key]);
        }
      }
	this.viewEditCmonDialog = true;
    });
  }

  protocolList: any[]; 
  selectedProtocol: string;
  /**
   * This Method is used to View Settings of Selected Cmon Agent
   */
  private updateSelectedCmonAgentSettings(cmonPid, rowDataServerID, cmonHomePath, cmonTier, cmonServerName, cmonMachineType): void {
    this.cmonEnvAdvancedKeyLabelList = [];
    this.cmonEnvAdvancedValueList = [];
    this.cmonEnvNormalKeyLabelList = [];
    this.cmonEnvNormalValueList = [];
    this.cmonEnvNormalTextAreaLabelList = [];
    this.cmonEnvNormalTextAreaValueList = [];
    this.loading = true;
    this.protocolList = [
      {label: 'Select', value: ''},
      {label: 'WSS', value: 'WSS'},
      {label: 'WS', value: 'WS'},
      {label: 'TCP/IP', value: 'TCP/IP'} ];
    this.rowDataServerID = rowDataServerID;
    this.cmonHomePath = cmonHomePath;
    this.cmonPid = cmonPid;
    this.cmonTier = cmonTier;
    this.cmonServerName = cmonServerName;
    this.cmonMachineType = cmonMachineType;
    let cmonInfoArr = [];
    cmonInfoArr[0] = rowDataServerID;
    cmonInfoArr[1] = cmonHomePath;
    cmonInfoArr[2] = cmonPid + "~~" + cmonTier + "~~" + cmonServerName;
    cmonInfoArr[3] = cmonMachineType;
    console.log('kuch v-------', cmonInfoArr );
    this.configNdAgentService.getCmonEnvKeyValueForEdit(cmonInfoArr, this.prodKey).subscribe(data => {
      this.loading = false;
      for (let key in data) {
      //If status of download fails then we don't open edit dialog
        for(let subkey in data[key]){
          if(subkey === "downloadmsg" && data[key][subkey] == "Failed to download due to some Error"){
              this.message.add({ severity: 'error', detail: "Edit operation failed : Please check configuration settings" });
              return;
          }
        }
        if (data[key]["type"] == 'Normal') {
          if(data[key]["displayName"] == "Class Path" || data[key]["displayName"] == "Machine Settings" || data[key]["displayName"] == "Machine agent Settings")
          {
           this.cmonEnvNormalTextAreaLabelList.push(data[key]["displayName"]);
           this.cmonEnvNormalTextAreaValueList.push(data[key]["value"]);
          }
          else{
          this.cmonEnvNormalKeyLabelList.push(data[key]["displayName"]);
          this.cmonEnvNormalValueList.push(data[key]["value"]);
          }
        }
        else {
          this.cmonEnvAdvancedKeyLabelList.push(data[key]["displayName"]);
          this.cmonEnvAdvancedValueList.push(data[key]["value"]);
        }
      }
	this.viewEditCmonDialog = true;
    });
  }

  // This Method is used for save Edited value in cmon.env
  saveSettingsOfCmonAgent() {
    let obj = {};
    let concatlabelList = this.cmonEnvNormalKeyLabelList.concat(this.cmonEnvAdvancedKeyLabelList);
    let concatValueList = this.cmonEnvNormalValueList.concat(this.cmonEnvAdvancedValueList);
    concatlabelList = concatlabelList.concat(this.cmonEnvNormalTextAreaLabelList);
    concatValueList = concatValueList.concat(this.cmonEnvNormalTextAreaValueList);
    for (let i = 0; i < concatValueList.length; i++) {
      if (concatValueList[i].length != 0) {
        if(concatValueList[i].indexOf(",") > -1)
        {
          for (let j = 0; j < concatValueList.length; j++) {
            if (concatValueList[j].indexOf('"') > -1) {
              concatValueList[j] = concatValueList[j].replace(/"/g, "");
            }
          }
          obj[concatlabelList[i]] = concatValueList[i].replace(/,/g , "#");
        }
        else
          obj[concatlabelList[i]] = concatValueList[i];
      }
    }
    this.loading = true;
    let cmonInfoArr = new Array();
    cmonInfoArr[0] = this.rowDataServerID;
    cmonInfoArr[1] = this.cmonHomePath;
    cmonInfoArr[2] = this.cmonPid+ "~~" + this.cmonTier + "~~" + this.cmonServerName;
    //This approach is used to restrict extra backslashes added .
    //Previously , the approach of JSON.stringify for the object had been followed but in that case extra backslashes appended.
    //After the loop the string will looks as {"key1":"value","key2":"value2",... so on } 
    let strForObject = '\{';
    Object.keys(obj)
      .forEach(function eachKey(key) {
        strForObject = strForObject + '\"' + key + '\"' + '\:' + '\"' + obj[key] + '\"' + ',';
      });
    strForObject = strForObject.replace(/.$/, '\}');
    cmonInfoArr[3] = strForObject;
    cmonInfoArr[4] = this.cmonMachineType;

      this.configNdAgentService.getCmonEnvKeyValueUpdate(cmonInfoArr, this.prodKey).subscribe(data => {
      this.viewEditCmonDialog = false;
      this.loading = false;
      this.message.add({ severity: 'success', detail: "Configuration Updated Successfully." });
    });
  }
  //This Method is used for getting focus on textbox
  trackByFn(index: any, item: any) {
    return index;
  }
/**
   * Purpose : To invoke the service responsible to open Help Notification Dialog
   * related to the current component.
   */
  customDataHelpDialogMachine : boolean;
  sendHelpNotificationForMachine() {
    this.customDataHelpDialogMachine = true;
  }

  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog
   * related to the current component.
   */
  customDataHelpDialogApplication : boolean;
  sendHelpNotificationForApplication() {
    this.customDataHelpDialogApplication = true;
  }
}
