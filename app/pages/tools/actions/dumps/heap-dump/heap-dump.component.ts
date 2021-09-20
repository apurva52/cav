import { Component} from '@angular/core';
import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material';
import { NGXLogger } from "ngx-logger";
import { CavTopPanelNavigationService } from '../../../configuration/nd-config/services/cav-top-panel-navigation.service';
import { HttpClient } from "@angular/common/http";
import { DdrDataModelService } from '../service/ddr-data-model.service';
import { CavConfigService } from '../../../configuration/nd-config/services/cav-config.service';
import { SelectItem, Message, MessageService } from 'primeng/api';
import { InstanceInterface, HeapDumpInterface } from './interfaces/take-heap-dump-info';
// import { TakeHeapDumpComponent } from '../take-heap-dump/take-heap-dump.component';
import { DashboardRESTDataAPIService } from '../service/dashboard-rest-data-api.service';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from 'src/app/core/session/session.service';
import { HeapDumpService } from './service/heap-dump.service';
import { TakeHeapDumpComponent } from './take-heap-dump/take-heap-dump.component';
// import { MatDialog } from '@angular/material/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-heap-dump',
  templateUrl: './heap-dump.component.html',
  styleUrls: ['./heap-dump.component.scss'],
})
export class HeapDumpComponent {
  uploadUrl: any;
  backendHeapPath:string;
  downloadMsg:string;
  showAll: boolean = false;
  showTable: number = 0;
  selectedServerVal: string;
  selectedTierVal: string;
  showThreadDumpOption: boolean = false;
  tierServerJsonList: Object;
  cols: any[];
  tierNameList: any[];
  tiers: SelectItem[];
  servers: SelectItem[];
  instanceInfo: Array<InstanceInterface>;
  selectedInstanceInfo: InstanceInterface;
  isNDCase: boolean = false;
  instanceDetail: Object[] = [{ "pid": "", "appName": "", "arguments": "", "status": "" }];
  ErrorResult: string;
  selectedRowIndex: number = 0;
  disableMsg: boolean = true;
  showMessageArr: any[];
  display: boolean = false;
  showDialog: boolean = false;
  maxTimeOut: number = 60;
  fileName: string = '/tmp/';
  checkCmdArgs: boolean = true;
  heapDumpList: Array<HeapDumpInterface>;
  hidebutton: boolean = true;
  commandArgs: string;
  selectedValues: string[] = ['filePath', 'checkMaxTimeOut'];
  checkBlocking: boolean = false;
  checkHDForcefully: boolean = false;
  selectedFields: string = '2';
  selectedOption: string[] = ['isEnable'];
  selectCompressed: string[] = ['isCompressed'];
  isChecked: boolean = false;
  isCompressed: boolean = false;
  compressedVal: number;
  downloadVal: number = 0;
  forceFully: number;
  showRetryPopup: boolean = false;
  showList: boolean = false;
  showHeapList: boolean = false;
  isFromGraph: boolean = true;
  vecArrForGraph: any;
  isEnable: boolean = true;
  public _message: Message;
  serverNameforTD: string;
  isNodeJS:boolean=true;
  loading = false;
  productKey: string;
  filterMatchMode="contains";
  error: string;
  empty: boolean;
  showAllHeapDumpPagination:boolean = false;

  cancelledUpload: boolean=true;
  isUploadDisable: boolean=false;

  /*Observable for update message sources.*/
  private _messageObser = new Subject<Message>();

  /*Service message commands.*/
  messageEmit(message) {
    this._messageObser.next(message);
  }
  /*Service Observable for getting update message.*/
  messageProvider$ = this._messageObser.asObservable();
  /** Thread Dump Message subscriber */
  threadDumpMsgSubscription: Subscription;

  msgs: Message;
  nodeValueToDelete;
  confirmationPopup : boolean =false;

  testRun: string;
  userName: string;
  productName: string;
  emptyInsTable:boolean = false;

  constructor(
    //private log: Logger,
    // private dialog: MatDialog,
    private dialogservice: DialogService,
    private dialog: DynamicDialogRef ,
    private messageService: MessageService,
    private log: NGXLogger,
    private sessionService:  SessionService,
    private _navService: CavTopPanelNavigationService,
    private http: HttpClient, private id: DdrDataModelService,
    private _cavConfigService: CavConfigService,
    private _router: Router,
    public heapDumpService:  HeapDumpService,
    private _restAPI: DashboardRESTDataAPIService) {
            this.userName = this.sessionService.session.cctx.u;
            this.productKey = this.sessionService.session.cctx.pk;
            this.testRun = this.sessionService.testRun.id;
            this.productName = this.sessionService.session.cctx.prodType;
            if(this.productName == 'NetDiagnostics')
              this.productName = 'netdiagnostics';
  }

  ngOnInit() {
    console.log('***************ng On Init ', this.selectedFields);
    if (this.id.heapCmdArgs) {
      this.loading = true;
      this.isNodeJS = true;
      this.openFromGraph();
    }
    else {
      this.isNodeJS = true;
      this.showTable = 0;
      this.isFromGraph = true;
      this.loading = true;
      this.takeThreadDump();
    }
    this.uploadUrl = this.setIpWithProtocol() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/upload?";
    this.threadDumpMsgSubscription = this.messageProvider$.subscribe(data => this.messageService.add(data));

    this.heapDumpService.heapDumpDataObservable$.subscribe(
      action => {
	console.log('Subscribe multiple times',action);
        this.showNotification(action);
      });
      // this.productKey = sessionStorage.getItem('productKey');
      this.makecolumns(); 
  }
  makecolumns(){
  this.cols = [{ field: 'tierName', header: 'Tier', sortable: true, align: 'left', width: '15' },
               { field: 'serverName', header: 'Server', sortable: true, align: 'left', width: '15' },
               { field: 'instanceName', header: 'Instance', sortable: true, align: 'left', width: '20' },
               { field: 'timestamp', header: 'Time', sortable: 'custom', align: 'right', width: '35' },
               { field: 'userName', header: 'UserName', sortable: true, align: 'left', width: '40' },
               { field: 'location', header: 'File Path at Server', sortable: true, align: 'left', width: '40' },
               { field: 'filePath', header: 'File Path at NDE', sortable: true, align: 'left', width: '50' },
               { field: 'fileName', header: 'File Name', sortable: true, align: 'left', width: '40' },
               { field: 'action', header: 'Actions', align: 'left', width: '30' },] 
  }
  openFromGraph() {
    this.hidebutton = false;
    this.isFromGraph = false;
    this.showThreadDumpOption = true;
    this.showHeapList = true;
    this.showTable = undefined;
    this.openHeapDumpList();
  }
  ngOnDestroy() {
    if (this.threadDumpMsgSubscription !== null && this.threadDumpMsgSubscription !== undefined)
      this.threadDumpMsgSubscription.unsubscribe();
  }

  takeThreadDump() {
    this.selectedServerVal = "";
    this.selectedTierVal = "";
    this.showThreadDumpOption = false;
    this.loading = false;    

    var url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=" + this.testRun + 
    '&user='+ this.userName +
    '&protocol='+ window.location.protocol + 
    '&ip='+ window.location.host ;
    console.log('heap dump url ',url);
    return this.http.get(url).subscribe(data => (this.setTierValues(data)));
  }
  takeHeapDump() {
    this.selectedOption = ['isEnable'];
    this.isEnable = true;
    this.selectedFields = '2';
    console.log(' this.selectedFields ****** ', this.selectedFields);
    this.selectCompressed = ['isCompressed'];
    console.log(' this.selectCompressed ****** ', this.selectCompressed);
    this.isCompressed = true;
    this.checkHDForcefully = false;
    this.checkBlocking = false;
    this.maxTimeOut = 60;
    if(this.selectedInstanceInfo && this.selectedInstanceInfo["machineType"] && this.selectedInstanceInfo["machineType"].toLowerCase().startsWith("win")) {
    if(this.selectedInstanceInfo["ndHome"])
               this.fileName=this.selectedInstanceInfo["ndHome"] + "\\";
       else   
               this.fileName='C:\\';
     }
    else
    this.fileName = '/tmp/';
    this.downloadVal = 0;
    this.compressedVal = 0;
  }
  /* Close Event Viewer Table */
  closeHeapDumpWin() {
    try {
      this.log.info('Closing Heap Dump window');
      this.dialog.close();
    } catch (e) {
      this.log.error('Error in closing Heap Dump window', e);
    }
  };

  // getServerValue(selectedValue: any) {
  //   var serverNameList = [];
  //   this.servers = [];
  //   this.selectedServerVal = "";

  //   for (var i = 0; i < this.tierNameList.length; i++) {
  //     if (selectedValue == this.tierNameList[i]) {
  //       serverNameList = Object.keys(this.tierServerJsonList[this.tierNameList[i]]);
  //     }
  //   }

  //   this.servers.push({ label: "-- Select Server --", value: null });
  //   for (var k = 0; k < serverNameList.length; k++) {
  //     this.servers.push({ label: serverNameList[k], value: serverNameList[k] });
  //   }
  // }

  getServerValue(selectedValue: any) {
    var serverNameList = [];
    this.servers = [];
    this.selectedServerVal = "";
    this.instanceInfo = undefined;
    this.selectedInstanceInfo = undefined;

    for (var i = 0; i < this.tierNameList.length; i++) {
      if (selectedValue == this.tierNameList[i]) {
        serverNameList.push(this.tierServerJsonList[this.tierNameList[i]]);
      }
    }

    this.servers.push({ label: "-- Select Server --", value: null });
    for (var obj of serverNameList) {
      for (var str in obj) {
        if (obj[str] == str) {
          this.servers.push({ label: str, value: str });
        }
        else {
          this.servers.push({ label: str+"("+obj[str]+")", value: str+"("+obj[str]+")" });
        }
      }
    }
  }

  isDownloadCase(event) {
    this.isEnable = event;
    if (this.isEnable) {
      this.selectedFields = '2';
      //console.log('selectedValues******* ', this.selectedFields);
    }
    else {
      this.selectedFields = undefined;
      this.isCompressed = false;
      this.selectedOption = undefined;
    }
  }
  getHostUrl(): string {
    var hostDcName="";
    // var hostDcName =  window.location.protocol + '//' + window.location.host;
    // if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");
    if (this.sessionService.preSession.multiDc === true) {
      hostDcName = this.id.getHostUrl() + "/node/ALL"
      console.log('*************hostDcName =**********', hostDcName);
    } else {
      hostDcName = this.id.getHostUrl();
    }
    return hostDcName;
  }
  setTierValues(jsondata: any) {
    this.tierServerJsonList = jsondata;
    this.tierNameList = Object.keys(jsondata);
    this.tiers = [];
    this.tiers.push({ label: "-- Select Tier --", value: null });
    for (var i = 0; i < this.tierNameList.length; i++) {
      this.tiers.push({ label: this.tierNameList[i].split(":")[0], value: this.tierNameList[i] });
    }
  }

  getJavaInstances() {
    try{
    this.loading = true;
    this.instanceInfo = [];
    this.selectedInstanceInfo = undefined;
    this.isNDCase = false;

    if (this.selectedServerVal.indexOf('(') != -1)
      this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
    else
      this.serverNameforTD = this.selectedServerVal;

    var url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getJavaInstances?server=" + this.serverNameforTD+"&testRun="+this.testRun;
    return this.http.get(url).subscribe(data => (this.doAssignValues(data)));
    }
    catch(error)
    {
      this.loading = false;
    }
  }

  getNDInstances() {
    this.instanceInfo = [];
    this.selectedInstanceInfo = undefined;
    this.isNDCase = true;
    this.isChecked = false;
    this.isEnable = false;
    this.loading = true;

    if (this.selectedServerVal.indexOf('(') != -1)
      this.serverNameforTD = this.selectedServerVal.substring(0, this.selectedServerVal.indexOf('('));
    else
      this.serverNameforTD = this.selectedServerVal;

    var url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getNDInstances?server=" + this.serverNameforTD + "&tier=" + this.validateField(this.selectedTierVal);
    return this.http.get(url).pipe(map(res => res)).subscribe(data => (this.doAssignValues(data)));
  }

  doAssignValues(res: any) {
    this.showThreadDumpOption = true;
    this.instanceDetail = res.data;
    this.loading = false;    

    if (this.instanceDetail.toString().startsWith("Unable to get instance") || this.instanceDetail.toString().toLowerCase().includes("error")) {
      this.ErrorResult = this.instanceDetail.toString();
      this.showTable = 0;
      this.showThreadDumpOption = false;
    }
    else {
      this.instanceInfo = this.getInstanceInfo();
      this.showTable = 1;
      if(this.instanceInfo.length > 0){
        this.showThreadDumpOption = true;
      }
      else{
        this.showThreadDumpOption = false;
        this.emptyInsTable = true;
      }
    }
  }

  getInstanceInfo(): Array<InstanceInterface> {
    let instArr = [];

    for (let i = 0; i < this.instanceDetail.length; i++) {
      instArr[i] = { pid: this.instanceDetail[i]["pid"], appName: this.instanceDetail[i]["appName"], arguments: this.instanceDetail[i]["arguments"],  agentType: this.instanceDetail[i]["agentType"],  machineType: this.instanceDetail[i]["machineType"] , status: this.instanceDetail[i]["status"].replace(",", ""), ndHome: this.instanceDetail[i]["ndHome"] };
    }
    return instArr;
  }

  resetData() {
    this.selectedInstanceInfo = undefined;
    this.servers = [];
    this.selectedTierVal = this.tiers[0].value;
    this.servers.push({ label: "", value: "" });
    this.ErrorResult = "";
    this.showTable = 0;
    this.hidebutton = true;
    this.showThreadDumpOption = false;
    this.isChecked = false;
  }

  getFileName() {
    this.id.tierName = this.validateField(this.selectedTierVal);

    

    if (this.selectedServerVal.indexOf('(') != -1)
      this.serverNameforTD = this.selectedServerVal.substring(0, this.selectedServerVal.indexOf('('));
    else
      this.serverNameforTD = this.selectedServerVal;

    this.id.serverName = this.serverNameforTD;
    if (this.isNDCase)
        this.showDialog = true;
    else {
      this.id.isFromND = false;
      if (this.selectedServerVal.indexOf('(') != -1)
        this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
      else
        this.serverNameforTD = this.selectedServerVal;

      this.id.serverName = this.serverNameforTD;

      //setting values in service for take heap dump component
      this.heapDumpService.tiername= this.id.tierName
      this.heapDumpService.servername= this.id.serverName;
      this.heapDumpService.isFromND= false;
      this.heapDumpService.processIdWithInstance= this.id.processIdWithInstance;
      this.heapDumpService.appname= this.id.appName;
      this.heapDumpService.userName= this.userName;
      this.heapDumpService.downloadFile=  this.downloadVal;
      this.heapDumpService.startTime= this.id.startTime;
      this.heapDumpService.endTime= this.id.endTime;
      this.heapDumpService.isCompressed= this.compressedVal;

      console.log('When ND Mode is false = ', this.id.vecArrForGraph);
      this.dialogservice.open(TakeHeapDumpComponent, {
        header: 'Enter file name with absolute path',
        width: '40%',
      });
      
    }
  }
  takeProcessIdHeapDump() {
  //  this.loading = true;
    this.takeHeapDump();
    if (this.id.heapCmdArgs) {
      console.log("Inisde the if condition");
      this.isNDCase = this.id.isFromND;
      this.showDialog = this.id.displayPopup;
      console.log('this.isNDCase && this.showDialog', this.showDialog, this.isNDCase)
      this.commandArgs = this.id.heapCmdArgs;
    }
    else if (this.selectedInstanceInfo) {
      if (this.selectedInstanceInfo["agentType"].toLowerCase() === 'nodejs')
        this.isNodeJS = false;
      else
        this.isNodeJS = true;
      this.commandArgs = '-p ' + this.selectedInstanceInfo["pid"] + ' -u ' + this.userName;
      this.id.appName = this.selectedInstanceInfo["appName"];
     // console.log('* * * this.selectedInstanceInfo * * * ', this.selectedInstanceInfo);

      let processIDWithInstance = "";
      processIDWithInstance = this.selectedInstanceInfo["pid"];
      this.id.processIdWithInstance = processIDWithInstance + ":" + this.id.appName;
     // console.log('this.id.processIdWithInstance', this.id.processIdWithInstance);

      if(this.selectedInstanceInfo["arguments"]) {
        if(this.selectedInstanceInfo["arguments"].includes("java "))
           this.heapDumpService.heapFileExtension = ".hprof";
        else
        this.heapDumpService.heapFileExtension = undefined;
      }
     else
     this.heapDumpService.heapFileExtension = undefined;

      this.getFileName();
      // this.loading=false;
    }
    else {
      this.loading=false;
      alert("Please select atleast one process id to take heap dump");
    }
  }

  showNotification(result) {
    //console.log("response of Heap Dump rest call ", result);
    this.heapDumpService.blockuiForTakeHeapDump=false;
    this.heapDumpService.loading1=false;
    this.loading= false;
    this.disableMsg = false;
    this.showMessageArr = [];
    if (!result) {
      this.id.setInLogger("","Heap Dump","Heap Dump Taken","Error in Taking Heap Dump");
      this.errorMessage("Error in Taking " +"\n" + " Heap Dump, ");
    }
    console.log("result log is ", result);
    let resultArr = result[0].split("|");

    resultArr.forEach(element => {
      if (element.startsWith("Pass")) {
        this.showRetryPopup = false;

	
        this.id.setInLogger("","Heap Dump","Heap Dump Taken","Heap Dump Taken Successfully "+element.split(":")[2].replace("CAV_COLON",":"));
        // console.log('element.split(":")[2] ', element.split(":")[2], element.split(":")[3], element.split(":")[1], element.split("...")[1]);
        this.multiSuccessMessage(element.split(":")[2].replace("CAV_COLON",":"), element.split(":")[1]);
        this.showMessageArr.push(element);

        if (this.id.heapCmdArgs)
          this.openHeapDumpList();
      }
      if (element.startsWith("Fail")) {
        if (element.toLowerCase().includes("timeout")) {
          console.log('TimeOut case * * * ', element);
          this.showRetryPopup = true;
        }
        else {
          this.showMessageArr.push(element);
      //    console.log('element.split(":")[2] ', element.split(":")[2], element.split(":")[3], element.split(":")[1]);
          let details = "Error in Heap Dump" + '\n';
          let summarys = element.split(":")[1] + '\n';
          if (element.split(":")[2] && element.split(":")[3])
            details = element.split(":")[2] + ' ' + element.split(":")[3];
          else if (element.split(":")[3] == undefined)
            details = element.split(":")[2];

	  this.id.setInLogger("","Heap Dump","Heap Dump Taken",details);
          this.multiErrorMessage(details, summarys);
        }
      }

    });
  }
  doAssignHeapList(data) {
    if(data.errorStatus){
      this.error = data.errorStatus;
      
    }
    if(data.heapDumpList){
      this.heapDumpList = data.heapDumpList;
      this.showAllHeapDumpPagination =true;
      if(this.heapDumpList.length <=1){
        this.empty =true;
        this.showAllHeapDumpPagination =false;
      }
    }  
    this.loading = false;
    this.hidebutton = false;
    this.confirmationPopup = false;
  }
  openHeapDumpList(isAll? : string) {
    try{

    if (isAll)
      this.showAll = true;
    else
      this.showAll = false;
      
      let selectedTierValue = this.selectedTierVal;
      if (this.selectedTierVal)
        selectedTierValue = this.selectedTierVal.trim();
      if (selectedTierValue === "") {  // As vector array graph is not present
        isAll = "All";
      }
      // if(selectedTierValue === "" && this.id.vecArrForGraph.length == 0)
      //      isAll = "All";
    this.showTable = 2;
    let heap_dump_list_url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getHeapDumpList?testRun=" + this.testRun +
    '&tierName=' +this.validateField(this.selectedTierVal) +
    '&server=' + this.selectedServerVal +
    '&vecArrForGraph=' + this.id.vecArrForGraph +
    '&isAllData='+isAll;
    this.http.get(heap_dump_list_url).subscribe((data :any) => { this.doAssignHeapList(data) })
  }
  catch(error)
  {
    this.loading=false;
  }
}

  showInstanceTable() {
    if (this.id.heapCmdArgs)
      this.openHeapDumpList();
    else {
      this.hidebutton = true;
      if(this.instanceInfo == undefined || this.instanceInfo.length == 0){
        this.emptyInsTable = true;
      }else{
        this.emptyInsTable = false;
      }
      this.showTable = 1;
    }
    this.cancelledUpload=true;
  }
  checkFileName(fileName:string){
      console.log("filename**********",fileName);
    if(/^[A-Za-z]:/.test(fileName) || this.fileName.startsWith('/') && (this.fileName.endsWith('/') || this.fileName.endsWith("\\"))){
      return true;
    }
    else{
      return false;
    }

  }
  takeHeapDumpBasedOnSettings() {
    console.log(' file ', this.fileName, 'time out ', this.maxTimeOut, ' command args ', this.commandArgs);
    if (this.maxTimeOut != undefined && this.maxTimeOut > 0) {
      if (this.fileName == undefined  || this.fileName.includes('.') || !this.checkFileName(this.fileName)) {
        alert('Please enter the correct path');
      }
      else if (this.commandArgs == undefined || this.commandArgs == "") {
        alert("Please enter valid command args");
      }
      else {
        if (this.selectedFields) {
          if (this.selectedFields === '1')
            this.downloadVal = 1;
          if (this.selectedFields === '2')
            this.downloadVal = 2;
        }
        if (this.isCompressed)
          this.compressedVal = 1;
        else
          this.compressedVal = 0;

        if (this.checkHDForcefully)
          this.forceFully = 1;
        else
          this.forceFully = 0;

        let blockingCmd = "";
        if (this.checkBlocking) {
          blockingCmd = "run_sync_command_req";
          this.downloadVal = 0;
        }
        else {
          blockingCmd = "run_async_command_req";
        }
        if (this.id.vecArrForGraph && this.id.vecArrForGraph.length > 1)
          this.vecArrForGraph = this.id.vecArrForGraph;
        else
          this.vecArrForGraph = undefined;
          let machineType;
	  let agentType;
	  if(this.selectedInstanceInfo) {
		machineType = this.selectedInstanceInfo["machineType"];
                agentType = this.selectedInstanceInfo["agentType"]; 
 	   }
      this.heapDumpService.blockuiForTakeHeapDump=true;
      this.heapDumpService.loading1= true;
        let restUrl = this.getHostUrl() + "/" + this.productName + '/v1/cavisson/netdiagnostics/ddr/takeHeapDump?testRun=' + this.testRun + '&vecArrForGraph=' + this.vecArrForGraph + '&tierName=' + this.id.tierName + '&serverName=' + this.id.serverName + '&instanceName=' + this.id.appName + '&startTime=' + this.id.startTime + '&endTime=' + this.id.endTime + '&dumpType=0' + '&heapFilePath=' + this.fileName + '&processIdWithInstance=' + this.commandArgs + ' -w ' + (this.maxTimeOut) * 60 * 1000 + '&timeOut=' + this.maxTimeOut + '&loginUserName=' + this.userName + '&isCompressed=' + this.compressedVal + '&downloadFile=' + this.downloadVal + '&blockMode=' + blockingCmd + '&forceMode=' + this.forceFully + '&isFromND=' + this.isNDCase + '&machineType=' + machineType + '&agentType=' +agentType ;
        console.log('url ********* ', restUrl);
        let dataSubscription = this._restAPI.getDataByRESTAPI(restUrl, '')
          .subscribe(
          result => {
            this.showNotification(result);
          },

          err => { this.showNotification(err); },
          () => {

            // console.log('Dashboard Take Heap Dump request failed.');

            /*unsubscribe/releasing resources.*/
            dataSubscription.unsubscribe();
          }
          );
        this.showDialog = false;
        this.showRetryPopup = false;
        this.id.showNotificationMessage('Take heap dump request is initiated', 'info', 'bottom', false, 3000, '#monitorUpDownInfoDialog');
      }
    }
    else {
      alert('Timeout can not be empty');
    }

  }
  close() {
    this.showDialog = false;
  }
  refresh() {
    if (this.showAll)
      this.openHeapDumpList('isAll');
    else
      this.openHeapDumpList();
  }
  downloadFile(node: any) {
    this._message = {};
    console.log('filePath is ', node);
    let urlInfo = '&tierName=' + node.tierName + '&serverName=' + node.serverName + '&instanceName=' + node.instanceName + '&pid=' + node.pid + '&partition=' + node.partition + '&startTime=' + node.startTime + '&endTime=' + node.endTime + '&timestamp=' + node.timestamp + '&fileName=' + node.fileName + '&filePath=' + node.filePath + '&userName=' + node.userName + '&mode=' + node.mode + '&isFrom=' + node.isFrom + '&index=' + node.index + '&location=' + node.location;

    let url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/downloadHeapFile?testRun=" + this.testRun + urlInfo;
    console.log('download url ', url);
    this.id.setInLogger('','Heap Dump','Heap Dump Download','Heap Dump Download Successfully');
    window.open(url);
    // this.refreshGui =  setInterval(() => { this.openHeapDumpList() }, 10000);

    setTimeout(() => {
      if (this.showAll)
      this.openHeapDumpList('isAll');
      else
      this.openHeapDumpList();
    }, 10000);
  }

  public multiSuccessMessage(detail: string, summary?: string) {
    this._message = {};
    this._message = { severity: 'success', summary: summary, detail: detail };
    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 60000);

  }
  public multiErrorMessage(detail: string, summary?: string) {
    this._message = {};
    this._message = { severity: 'error', summary: summary, detail: detail };
    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 60000);

  }
  public errorMessage(detail: string, summary?: string) {
    this._message = {};
    if (summary == undefined)
      this._message = { severity: 'error', detail: detail };
    else
      this._message = { severity: 'error', summary: summary, detail: detail };

    this.messageEmit(this._message);
    setTimeout(() => {
      this._message ={};

      this.messageEmit(this._message);
    }, 40000);
  }

  public infoMessage(detail: string, summary?: string) {
    this._message = {};
    if (summary == undefined)
      this._message = { severity: 'info', detail: detail };
    else
      this._message = { severity: 'info', summary: summary, detail: detail };

    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 60000);
  }

  public successMessage(detail: string, summary?: string) {
    this._message = {};
    if (summary == undefined)
      this._message = { severity: 'success', detail: detail };
    else
      this._message = { severity: 'success', summary: summary, detail: detail };

    this.messageEmit(this._message);
    setTimeout(() => {
      this._message = {};

      this.messageEmit(this._message);
    }, 60000);
  }

  closeRetry() {
    this.showRetryPopup = false;
  }

  removeFile() {
    if(this.nodeValueToDelete.filePath === "-"){
      this.confirmationPopup = false;
      alert("File doesn't exist at NDE, So couldn't be deleted.");
      return;
    }
    // tierName|serverName|instanceName|pid|partition|startTime|endTime|timestamp|fileName|filePath|userName|mode|isFrom
    // let url = '&tierName='+node.tierName+'&serverName='+node.serverName+'&instanceName='+node.instanceName+
    // +'&pid='+node.pid+'&partition='+node.partition+'&startTime='+node.startTime+'&endTime='+node.endTime+'&timestamp='+node.timestamp+
    // +'&fileName='+node.fileName+'&filePath='+node.filePath+'&userName='+node.userName+'&mode='+node.mode+'&isFrom='+node.isFrom+'&index='+node.index;

    let urlInfo = '&tierName=' + this.nodeValueToDelete.tierName + '&serverName=' + this.nodeValueToDelete.serverName + '&instanceName=' + this.nodeValueToDelete.instanceName + '&pid=' + this.nodeValueToDelete.pid + '&partition=' + this.nodeValueToDelete.partition + '&startTime=' + this.nodeValueToDelete.startTime + '&endTime=' + this.nodeValueToDelete.endTime + '&timestamp=' + this.nodeValueToDelete.timestamp + '&fileName=' + this.nodeValueToDelete.fileName + '&filePath=' + this.nodeValueToDelete.filePath + '&userName=' + this.nodeValueToDelete.userName + '&mode=' + this.nodeValueToDelete.mode + '&isFrom=' + this.nodeValueToDelete.isFrom + '&index=' + this.nodeValueToDelete.index + '&location=' + this.nodeValueToDelete.location + '&productKey=' + this.productKey;
    let heap_dump_list_url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/removeHeapDump?testRun=" + this.testRun + '&removeFile=' + this.nodeValueToDelete.filePath + '/' + this.nodeValueToDelete.fileName + urlInfo;
    this._restAPI.getDataByRESTAPIInString(heap_dump_list_url,'').subscribe( data => {
                   this.confirmationPopup = false;
                if(data == 'Successfully updated')
                 {
		this.successMessage('Deleted '+this.nodeValueToDelete.fileName+ '\n' + ' heap dump successfully.');
                  if (this.showAll)
                  this.openHeapDumpList('isAll');
                  else
                   this.openHeapDumpList();
                 }
                else
                  this.errorMessage(data);
        },
        err =>
                {
                   this.confirmationPopup = false;
                  this.errorMessage('Error is coming while '+ '\n'+ 'removing Heap dump ');
                });
  }
  assignNodevalueToDelete(node) {
    this.confirmationPopup = true;
    let tierName = this.selectedTierVal;
    if (tierName) {
      if (tierName.indexOf(":") != -1){
        tierName = tierName.split(":")[1];
        if(Number(tierName) !== 7)
          {
          //  this.confirmationPopup = false;
            // alert(this.id.userName+" user don't have permission to delete heap dump for "+this.selectedTierVal.split(":")[0]); 
    //        this.errorMessage('user do not have permission to delete heap dump for '+this.validateField(this.selectedTierVal),this.id.userName);
      //      return;
          }
        }
    }
    this.nodeValueToDelete = node;
    
  }
  /*Custom Sorting*/
 CustomsortForPID(event, tempData){

      //for interger type data type
        if (event.order == -1) {
          var temp = (event["field"]);
          event.order = 1
          tempData = tempData.sort(function (a, b) {
            var value = Number(a[temp]);
            var value2 = Number(b[temp]);
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          });
        }
        else {
          var temp = (event["field"]);
          event.order = -1;
          //asecding order
          tempData = tempData.sort(function (a, b) {
            var value = Number(a[temp]);
            var value2 = Number(b[temp]);
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          });
        }
   
      this.instanceInfo = [];
      //console.log(JSON.stringify(tempData));
      if (tempData) {
         tempData.map((rowdata) => { this.instanceInfo = this.Immutablepush(this.instanceInfo, rowdata) });
      }
  
    }
 
  Customsort(event, tempData) {

    //for interger type data type
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
 
    this.heapDumpList = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
       tempData.map((rowdata) => { this.heapDumpList = this.Immutablepush(this.heapDumpList, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  resetInstanceTableData(){
    this.instanceInfo = undefined;
    this.selectedInstanceInfo = undefined;
  }
   migrateHeapDumpList() {
      //  if (this.selectedServerVal.indexOf('(') != -1)
      //    this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(') + 1, this.selectedServerVal.indexOf(')'));
      //  else
      //    this.serverNameforTD = this.selectedServerVal;
     this.showTable = 2;
    let heap_dump_list_url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/migrateHeapDumpList?testRun=" + this.testRun +
    '&tierName=' +this.validateField(this.selectedTierVal) +
    '&server=' + this.selectedServerVal +
    '&vecArrForGraph=' + this.id.vecArrForGraph ;
    this.http.get(heap_dump_list_url).subscribe((data:any) => { this.doAssignHeapList(data.heapDumpList) })
  }

  validateField(strParam)
  {
    if(strParam)
    {
      if(strParam.indexOf(":") != -1)
        return strParam.split(":")[0];
      else
        return strParam;
    }
  }

  showAllData()
  {
  
    this.showAll = true;
    this.openHeapDumpList("All");
  }

  showFileName(fileName) {
    if(fileName.trim().lastIndexOf(".gz.gz") != -1)
       return fileName.substring(0,fileName.lastIndexOf(".gz"));
    else
       return fileName;
  }
  analyzeHeapDump(node) {
    if(node.filePath == "-") {
      this.heapDumpService.blockuiForTakeHeapDump =true;
      this.loading = true;
      this.downloadHeapFile(node).then(() => {
        this.heapDumpService.blockuiForTakeHeapDump = false;
        this.loading = false;
              if(this.downloadMsg.startsWith("Error:")){
                    this.errorMessage(this.downloadMsg);
                    return;
                   }
                   else {
                     node.filePath = this.downloadMsg;
                     this.heapAnalyzeRest(node);
        }
                });
     }
    else if(node.isFrom.toLowerCase() !== "java" && node.isFrom.toLowerCase() !== "cmon") {
       this.errorMessage("We Supported only Java heap dump","Unsupported format");
       return; 
     }
    else
       this.heapAnalyzeRest(node); 
    }

    heapAnalyzeRest(node,path?:string) {
      this.heapDumpService.blockuiForTakeHeapDump =true;
      this.loading = true;
      let analyzeUrl ="";
      if(path)
           analyzeUrl = path; 
    else if(node){
        analyzeUrl = this.setIpWithProtocol() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/analyzeHeap?testRun=" + this.testRun +'&filePath=' + node.filePath +'&fileName=' + node.fileName;
       this.id.ibmAnalyzerUrl = analyzeUrl;
       //For IBM Heap Analyzer UI
       this.heapDumpService.$ibmAnalyzerUrl = analyzeUrl;
      }
    else
      {
       this.heapDumpService.blockuiForTakeHeapDump =false;
       this.loading = false;
       this.errorMessage("Error not able to ana " + "\n" + " lyze heap dump due to invalid file ");
       return;
      }
  
      this.http.get(analyzeUrl).subscribe( (data:any) => {
          this.analyzeHeapPath(data);
      },
      error => {
        this.heapDumpService.blockuiForTakeHeapDump =false;
          this.loading = false;
      });
    }

    setIpWithProtocol() {
      let hostUrl="";
     
      if(this.getHostUrl().startsWith("http"))
          hostUrl = this.getHostUrl();
      else if(this.getHostUrl().startsWith("//")) 
          hostUrl = location.protocol + this.getHostUrl();
      else 
         hostUrl = location.protocol + "//" +this.getHostUrl();
     
      return hostUrl;
     }
    analyzeHeapPath(data){
       this.heapDumpService.blockuiForTakeHeapDump =false;
       this.loading = false;
     if(data && !data.error)
     {
       //this._navService.addNewNaviationLink('ddr');
       if(!data.path){
         this.id.ibmAnalyzerData = data;
	 //For ibm heap analyzer UI.
         this.heapDumpService.$ibmAnalyzerData = data;
         this._router.navigate(['/ibm-heap-analyser-dump']);
        }
        else{
        this.id.heapPath = data.path;
	this.heapDumpService.$heapPath = data.path;
        this._router.navigate(['/heap-analyser-dump']);
        }
       this.closeHeapDumpWin();
       return;
     }
     else if(data.error)
       this.errorMessage(data.error);
     else
       this.errorMessage("Error is coming during " + "\n" + " analysing heap dump");

     return;
    }

   onRemove(event){

    this.cancelledUpload=true;	
    this.isUploadDisable= false;

		
   }
   onProgress($event){
     this.isUploadDisable= true;
  }

   analyzeHeapFromLocal(){
	
	this.cancelledUpload= false;

	}

 
    onUpload($evt) {
      console.log("onupload",$evt);
      //let data = $evt.xhr.response;
      //data = JSON.parse(data); 	 
      let data = $evt.originalEvent.body;
      this.loading = false;
      console.log("data in on",data);
      if(data && !data.error)
       {
         //this._navService.addNewNaviationLink('ddr');
        if(!data.path){
          this.id.ibmHeapFileName = $evt.files[0].name;
          this.id.ibmAnalyzerData = data;
	  //For ibm heap analyzer UI.
          this.heapDumpService.$ibmHeapFileName = $evt.files[0].name;
          this.heapDumpService.$ibmAnalyzerData = data;
          this._router.navigate(['/ibm-heap-analyser-dump']);
         }
         else{
         this.id.heapPath = data.path;
	 //Created heapDumpService to get heapPath in heap analyzer dump UI.
          this.heapDumpService.$heapPath = data.path;
         this._router.navigate(['/heap-analyser-dump']);
         }
          this.closeHeapDumpWin();
        return;
       }
      else if(data.error){
        this.errorMessage(data.error);
        this.isUploadDisable=false;
      }
      else{
        this.errorMessage("Error is coming during " + "\n" + " analysing heap dump");
        this.isUploadDisable=false;
      }
   
      return;
   
   }
   
   downloadHeapFile(node:any) {
      return new Promise((resolve, reject) => {
      this.downloadMsg = "";
     console.log('filePath is ', node);
       let urlInfo = '&tierName=' + node.tierName + '&serverName=' + node.serverName + '&instanceName=' + node.instanceName + '&pid=' + node.pid + '&partition=' + node.partition + '&startTime=' + node.startTime + '&endTime=' + node.endTime + '&timestamp=' + node.timestamp + '&fileName=' + node.fileName + '&filePath=' + node.filePath + '&userName=' + node.userName + '&mode=' + node.mode + '&isFrom=' + node.isFrom + '&index=' + node.index + '&location=' + node.location + '&isAnalyze=true';
   
       let url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/downloadHeapFile?testRun=" + this.testRun + urlInfo;
       this._restAPI.getDataByRESTAPIInString(url,'').subscribe(data => {
                       this.downloadMsg = data;
   //		    console.log("downloadMsg *********  ",this.downloadMsg); 
                     resolve(this.downloadMsg);
                   },
     error => {
       this.loading = false;
       }); 
       });
    }

    downloadReport(filetype)
    {

    }
   
   heapAnalyzeAtBackend(path){
     if(path)
       {
         if(!path.startsWith("/")){
            this.errorMessage("Please make sure you " + "\n" + " entered absolute file path");
            return;
         }
         if(!path.includes(".hprof")){
            this.errorMessage("Incorrect file, we supp " + "\n" + "orted only .hprof format");
            return;
         }
         else
          {
            let filePath="";
            let fileName="";
            let index = path.lastIndexOf("/");
            if(index != -1) {
              filePath = path.substring(0,index+1);
              fileName = path.substring(index+1);
              let analyzeUrl = this.setIpWithProtocol() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/analyzeHeap?testRun=" + this.testRun + '&filePath=' + filePath + '&fileName=' + fileName + '&isFromBackend=true' ;
             return this.heapAnalyzeRest(undefined,analyzeUrl);
           }
          }
       }
     else {
       this.errorMessage("Given path is inval" + "\n" + " id, please enter a valid path");
       return;
     }
   }

}
