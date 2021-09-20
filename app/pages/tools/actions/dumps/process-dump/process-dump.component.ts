import { Component } from '@angular/core';
// import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { HttpClient } from "@angular/common/http";
import { DdrDataModelService } from '../service/ddr-data-model.service';
// import { CavConfigService } from '../../../../main/services/cav-config.service';
import { SelectItem, Message, MessageService } from 'primeng/api';
import { DashboardRESTDataAPIService } from '../service/dashboard-rest-data-api.service';
import { Subject } from 'rxjs';
import { NGXLogger } from "ngx-logger";
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  moduleId: module.id,
  selector: 'app-process-dump',
  templateUrl: './process-dump.component.html',
  styleUrls: ['./process-dump.component.scss']
})
export class ProcessDumpComponent {

    showOtherOption = false;
    showAll = false;
    showTable = 0;
    selectedServerVal: string;
    selectedTierVal: string;
    tierServerJsonList: Object;
    tierNameList: any[];
    tiers: SelectItem[];
    servers: SelectItem[];
    instanceInfo: Array<InstanceInterface>;
    selectedInstanceInfo: InstanceInterface;
    isNDCase = false;
    instanceDetail: Object[] = [{ "pid": "", "appName": "", "arguments": "", "status": "" }];
    ErrorResult: string;
    selectedRowIndex = 0;
    disableMsg = true;
    showMessageArr: any[];
    display = false;
    showDialog = false;
    maxTimeOut = 60;
    fileName = '/tmp/';
    checkCmdArgs = true;
    processDumpList: Array<HeapDumpInterface>;
    hidebutton = true;
    commandArgs: string;
    selectedValues: string[] = ['filePath', 'checkMaxTimeOut'];
    checkBlocking = false;
    checkHDForcefully = false;
    selectedFields = '2';
    selectedOption: string[] = ['isEnable'];
    selectCompressed: string[] = ['isCompressed'];
    isChecked = false;
    isCompressed = true;
    compressedVal: number;
    downloadVal = 0;
    forceFully: number;
    showRetryPopup = false;
    showList = false;
    showProcessList = false;
    showAllProcessDump = true;
    showRefresh = false;
    isFromGraph = true;
    vecArrForGraph: any;
    isEnable = true;
    public _message: Message;
    serverNameforTD: string;
    isNodeJS = true;
    loading = false;
    productKey: string;
    filterMatchMode = 'contains';
    pathFlag = false;
    /*Observable for update message sources.*/
    private _messageObser = new Subject<Message[]>();
    confirmationPopup = false;
    nodeValueToDelete;
    /*Service message commands.*/
    messageEmit(message) {
        this.messageService.add(message);
        this._messageObser.next(message);
    }

    productName : string;
    testRun : string;
    userName : string;

    constructor(
      private messageService: MessageService,
        private log : NGXLogger,
        private sessionService:  SessionService,
        // private _navService: CavTopPanelNavigationService,
        private http: HttpClient, private id: DdrDataModelService,
        // private _cavConfigService: CavConfigService,
        private _restAPI: DashboardRESTDataAPIService) {
            this.userName = this.sessionService.session.cctx.u;
            this.productKey = this.sessionService.session.cctx.pk;
            this.testRun = this.sessionService.testRun.id;
            this.productName = this.sessionService.session.cctx.prodType;
            if(this.productName == 'NetDiagnostics')
                this.productName = 'netdiagnostics';
         }
    ngOnInit() {
        console.log("Process Comp")
        if(this.id.isFromProcessGrapgh) {
            this.openFromGraph();
        } else {
            this.isFromGraph = true;
        this.getTierServerList();
        }  
     this.id.processDumpDataObservable$.subscribe(
      action => {
        this.showNotification(action);
      });
 
    }

    openFromGraph() {
        this.hidebutton = false;
        this.isFromGraph = false;
        this.showOtherOption = true;
        this.showProcessList = true;
        this.showTable = undefined;
        this.openProcessDumpList();
      }

    showAllData() {
        this.showAll = true;
        this.showAllProcessDump = false;
        this.showRefresh = true;
        this.openProcessDumpList('All');
    }

    closeProcessDump() {
        try {
            this.log.info('Closing Process Dump window');
            // this.dialog.closeAll();
        } catch (e) {
            this.log.error('Error in closing Process Dump window', e);
        }
    }

    /** getting All java Instances */
    getJavaInstances() {
        this.loading = true;
        this.instanceInfo = [];
        this.selectedInstanceInfo = undefined;
        this.isNDCase = false;

        if (this.selectedServerVal.indexOf('(') != -1) {
            this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(') + 1, this.selectedServerVal.indexOf(')'));
        } else {
            this.serverNameforTD = this.selectedServerVal;
        }

        var url = this.getHostUrl() + '/' + this.productName +
            '/v1/cavisson/netdiagnostics/ddr/getJavaInstances?server=' + this.serverNameforTD;
        return this.http.get(url).subscribe(data => (this.doAssignValues(data)));
    }

    /** getting ND instances */
    getNDInstances() {
        this.instanceInfo = [];
        this.selectedInstanceInfo = undefined;
        this.isNDCase = true;
        this.isChecked = false;
        this.isEnable = false;

        if (this.selectedServerVal && this.selectedServerVal.indexOf('(') != -1) {
            this.serverNameforTD = this.selectedServerVal.substring(0, this.selectedServerVal.indexOf('('));
        } else {
            this.serverNameforTD = this.selectedServerVal;
        }
	let tierName = this.validateField(this.selectedTierVal);
	if(!tierName) {
	  this.errorMessage("Please select valid tier server name");
	  return;
	}
	if(!this.serverNameforTD)
	{
	  this.errorMessage("Please select valid server name");
          return;
	}
        var url = this.getHostUrl() + '/' + this.productName + '/v1/cavisson/netdiagnostics/ddr/getNDInstances?server=' +
            this.serverNameforTD + '&tier=' + tierName + '&isProcess=true';
        return this.http.get(url).subscribe(data => (this.doAssignValues(data)));
    }

    validateField(strParam) {
        if (strParam) {
            if (strParam.indexOf(':') != -1) {
                return strParam.split(':')[0];
            } else {
                return strParam;
            }
        }
    }

    doAssignValues(res: any) {
        this.showOtherOption = true;
        this.instanceDetail = res.data;
        this.loading = false;

        if (this.instanceDetail.toString().startsWith("Unable to get instance") || this.instanceDetail.toString().toLowerCase().includes("error")) {
            this.ErrorResult = this.instanceDetail.toString();
            this.showTable = 0;
            this.showOtherOption = false;
        } else {
            this.instanceInfo = this.getInstanceInfo();
            this.showTable = 1;
            if (this.instanceInfo.length > 0) {
                this.showOtherOption = true;
            } else {
                this.showOtherOption = false;
            }
        }
    }

    getInstanceInfo(): Array<InstanceInterface> {
        let instArr = [];

        for (let i = 0; i < this.instanceDetail.length; i++) {
            instArr[i] = { pid: this.instanceDetail[i]["pid"], appName: this.instanceDetail[i]["appName"], arguments: this.instanceDetail[i]["arguments"], agentType: this.instanceDetail[i]["agentType"], machineType: this.instanceDetail[i]["machineType"], status: this.instanceDetail[i]["status"].replace(",", "") };
        }
        return instArr;
    }

    /** Getting Tier,Srver list form Topology */
    getTierServerList() {
        this.selectedServerVal = '';
        this.selectedTierVal = '';
        this.showOtherOption = false;
        this.loading = false;

        var url = this.getHostUrl() + '/' + this.productName +
            '/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=' + this.testRun +
            '&user=' + this.userName + '&protocol=' + window.location.protocol + '&ip=' + window.location.host;
        // var url = window.location.protocol + '//' + window.location.host + '/netdiagnostics/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=1250&user=guest&protocol=' + window.location.protocol +'&ip='+window.location.host;
        console.log('Process dump url ', url);
        return this.http.get(url).subscribe( (data:any) => (this.setTierValues(data)));
    }

    setTierValues(jsondata: any) {
        this.tierServerJsonList = jsondata;
        this.tierNameList = Object.keys(jsondata);
        this.tiers = [];
        this.tiers.push({ label: '-- Select Tier --', value: null });
        for (var i = 0; i < this.tierNameList.length; i++) {
            this.tiers.push({ label: this.tierNameList[i].split(':')[0], value: this.tierNameList[i] });
        }
    }

    /**getting Tier List */
    getServerValue(selectedValue: any) {
        var serverNameList = [];
        this.servers = [];
        this.selectedServerVal = '';

        for (var i = 0; i < this.tierNameList.length; i++) {
            if (selectedValue == this.tierNameList[i]) {
                serverNameList.push(this.tierServerJsonList[this.tierNameList[i]]);
            }
        }

        this.servers.push({ label: '-- Select Server --', value: null });
        for (var obj of serverNameList) {
            for (var str in obj) {
                if (obj[str] == str) {
                    this.servers.push({ label: str, value: str });
                } else {
                    this.servers.push({ label: str + '(' + obj[str] + ')', value: str + '(' + obj[str] + ')' });
                }
            }
        }
    }

    showInstanceTable() {
        if (this.id.heapCmdArgs) {
            this.openProcessDumpList();
        } else {
            this.hidebutton = true;
            this.showTable = 1;
        }
        this.showAllProcessDump = true;
        this.showRefresh = false;
    }

    takeProcessIdHeapDump() {
        console.log('this.selectedInstanceInfo----', this.selectedInstanceInfo," this.id.heapCmdArgs ",this.id.heapCmdArgs);

        if (this.id.heapCmdArgs) {
            this.isNDCase = true;
            this.showDialog = this.id.displayPopup;
            console.log('this.isNDCase && this.showDialog', this.showDialog, this.isNDCase)
            this.commandArgs = this.id.heapCmdArgs;
        } else if (this.selectedInstanceInfo) {
            if (this.selectedInstanceInfo['agentType'].toLowerCase() === 'nodejs') {
                this.isNodeJS = false;
            } else {
                this.isNodeJS = true;
            }
            this.commandArgs = '-p ' + this.selectedInstanceInfo['pid'] + ' -u ' + this.userName;
            this.id.appName = this.selectedInstanceInfo['appName'];
            // console.log('* * * this.selectedInstanceInfo * * * ', this.selectedInstanceInfo);

            let processIDWithInstance = '';
            processIDWithInstance = this.selectedInstanceInfo['pid'];
            this.id.processIdWithInstance = processIDWithInstance + ':' + this.id.appName;
            // console.log('this.id.processIdWithInstance', this.id.processIdWithInstance);
            //this.getFileName();
            // this.captureProcessDump();
        } else {
            alert('Please select atleast one process id to capture process dump');
	    return;
        }
            this.getFileName();
    }

    checkFileName(fileName: string) {
        console.log('filename**********', fileName);
        if (/^[A-Za-z]:/.test(fileName) || this.fileName.startsWith('/') && (this.fileName.endsWith('/') || this.fileName.endsWith('\\'))) {
            return true;
        } else {
            return false;
        }
    }

    /** Capturing Process Dump */
    captureProcessDump() {
        console.log(' file ', this.fileName, 'time out ', this.maxTimeOut, ' command args ', this.commandArgs);
        // if (this.maxTimeOut != undefined && this.maxTimeOut > 0) {
        // if (this.fileName == undefined || this.fileName.includes('.') || !this.checkFileName(this.fileName)) {
        //     alert('Please enter the correct path');
        // } else if (this.commandArgs == undefined || this.commandArgs == "") {
        //     alert("Please enter valid command args");
        // } else {
        if (this.selectedFields) {
            if (this.selectedFields === '1') {
                this.downloadVal = 1;
            }
            if (this.selectedFields === '2') {
                this.downloadVal = 2;
            }
        }
        if (this.isCompressed) {
            this.compressedVal = 1;
        } else {
            this.compressedVal = 0;
        }
        if (this.checkHDForcefully) {
            this.forceFully = 1;
        } else {
            this.forceFully = 0;
        }
        let blockingCmd = "";
        if (this.checkBlocking) {
            blockingCmd = "run_sync_command_req";
            this.downloadVal = 0;
        } else {
            blockingCmd = "run_async_command_req";
        }
        if (this.id.vecArrForGraph && this.id.vecArrForGraph.length > 1) {
            this.vecArrForGraph = this.id.vecArrForGraph;
        } else {
            this.vecArrForGraph = undefined;
        }
        let machineType;
        let agentType;
        if (this.selectedInstanceInfo) {
            machineType = this.selectedInstanceInfo["machineType"];
            agentType = this.selectedInstanceInfo["agentType"];
        }
        let restUrl = this.getHostUrl() + "/" + this.productName + '/v1/cavisson/netdiagnostics/ddr/captureProcessDump?testRun=' + this.testRun +
            '&vecArrForGraph=' + this.vecArrForGraph + '&tierName=' + this.id.tierName + '&serverName=' + this.id.serverName +
            '&appName=' + this.id.appName + '&startTime=' + this.id.startTime + '&endTime=' + this.id.endTime + '&dumpType=0' +
            '&processFilePath=' + '/tmp' + '&processFileName=' + 'xyz' + '&processIdWithInstance=' + this.commandArgs + ' -w ' +
            (this.maxTimeOut) * 60 * 1000 + '&timeOut=' + this.maxTimeOut + '&loginUserName=' + this.userName +
            '&isCompressed=' + this.compressedVal + '&downloadFile=' + this.downloadVal + '&blockMode=' + blockingCmd + '&forceMode=' +
            this.forceFully + '&isFromND=' + this.isNDCase + '&machineType=' + machineType + '&agentType=' + agentType;
        console.log('url ********* ', restUrl);
        let dataSubscription = this._restAPI.getDataByRESTAPI(restUrl, '')
            .subscribe(
                result => {
                    this.showNotification(result);
                },

                err => { this.showNotification(err); },
                () => {

                    // console.log('Dashboard Take Process Dump request failed.');

                    /*unsubscribe/releasing resources.*/
                    dataSubscription.unsubscribe();
                }
            );
        this.showDialog = false;
        this.showRetryPopup = false;
        this.id.showNotificationMessage('Take Process dump request is initiated', 'info', 'bottom', false, 3000, '#monitorUpDownInfoDialog');
        // }
        // } else {
        //     alert('Timeout can not be empty');
        // }
    }

    showNotification(result) {
        // console.log("response of Process Dump rest call ", result);
        this.disableMsg = false;
        this.showMessageArr = [];
        if (!result) {
	    this.id.setInLogger("","Process Dump","Process Dump Taken","Error in Taking Process Dump");
            this.errorMessage('Error in Taking Process Dump, ');
	    return;
        }
        console.log('result log is ', result);
        let resultArr = result[0].split('|');

        resultArr.forEach(element => {
            if (element.startsWith('Pass')) {
                this.showRetryPopup = false;

	    	this.id.setInLogger("","Process Dump","Process Dump Taken","Process Dump Taken Successfully "+element.split(':')[2].replace('CAV_COLON', ':'));
                this.multiSuccessMessage(element.split(':')[2].replace('CAV_COLON', ':'), element.split(':')[1]);
                this.showMessageArr.push(element);

                if (this.id.heapCmdArgs) {
                    // this.openHeapDumpList();
                }
            }
            if (element.startsWith('Fail')) {
                if (element.toLowerCase().includes('timeout')) {
                    console.log('TimeOut case * * * ', element);
                    this.showRetryPopup = true;
                } else {
                    this.showMessageArr.push(element);
                    //    console.log('element.split(":")[2] ', element.split(":")[2], element.split(":")[3], element.split(":")[1]);
                    let details = 'Error in Process Dump';
                    let summarys = element.split(':')[1];
                    if (element.split(':')[2] && element.split(':')[3]) {
                        details = element.split(':')[2] + ' ' + element.split(':')[3];
                    } else if (element.split(':')[3] == undefined) {
                        details = element.split(':')[2];
                    }

		    this.id.setInLogger("","Process Dump","Process Dump Taken",details);
                    this.multiErrorMessage(details, summarys);
                }
            }

        });
    }

    public multiSuccessMessage(detail: string, summary?: string) {
      this._message = { severity: 'success', summary: summary, detail: detail };
      this.messageEmit(this._message);
      setTimeout(() => {
          this._message = {};
          this.messageEmit(this._message);
      }, 30000);

  }
  public multiErrorMessage(detail: string, summary?: string) {
      this._message = { severity: 'error', summary: summary, detail: detail };
      this.messageEmit(this._message);
      setTimeout(() => {
          this._message = {};
          this.messageEmit(this._message);
      }, 30000);
  }

  public errorMessage(detail: string, summary?: string) {
      if (summary == undefined) {
          this._message = { severity: 'error', detail: detail };
      } else {
          this._message = { severity: 'error', summary: summary, detail: detail };
      }
      this.messageEmit(this._message);
      setTimeout(() => {
          this._message = {};

          this.messageEmit(this._message);
      }, 30000);
  }

  public infoMessage(detail: string, summary?: string) {
      if (summary == undefined) {
          this._message = { severity: 'info', detail: detail };
      } else {
          this._message = { severity: 'info', summary: summary, detail: detail };
      }
      this.messageEmit(this._message);
      setTimeout(() => {
          this._message = {};

          this.messageEmit(this._message);
      }, 30000);
  }

  public successMessage(detail: string, summary?: string) {
      if (summary == undefined) {
          this._message = { severity: 'success', detail: detail };
      } else {
          this._message = { severity: 'success', summary: summary, detail: detail };
      }
      this.messageEmit(this._message);
      setTimeout(() => {
          this._message = {};

          this.messageEmit(this._message);
      }, 30000);
  }


    getFileName() {
	if(!this.id.heapCmdArgs)
            this.id.tierName = this.validateField(this.selectedTierVal);

        if (this.selectedServerVal && this.selectedServerVal.indexOf('(') != -1) {
            this.serverNameforTD = this.selectedServerVal.substring(0, this.selectedServerVal.indexOf('('));
        } else {
            this.serverNameforTD = this.selectedServerVal;
        }
	if(!this.id.heapCmdArgs)
        	this.id.serverName = this.serverNameforTD;
        if (this.isNDCase) {
            this.showDialog = true;
    //         this.dialog.open(CaptureProcessDumpComponent, {
    //             height: 'auto',
    //             width: 'auto',
		// disableClose: true
    //         });
        } else {
            this.id.isFromND = false;
            if (this.selectedServerVal.indexOf('(') != -1) {
                this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(') + 1, this.selectedServerVal.indexOf(')'));
            } else {
                this.serverNameforTD = this.selectedServerVal;
            }
            this.id.serverName = this.serverNameforTD;
            console.log('When ND Mode is false = ', this.id.vecArrForGraph);
            //   this.dialog.open(CaptureProcessDumpComponent, {
            //     height: 'auto',
            //     width: 'auto'
            //   });
        }
    }

    resetInstanceTableData() {

    }

    openProcessDumpList(isAll?: string) {
        if (isAll) {
            this.showAll = true;
        } else {
            this.showAll = false;
        }
        this.showTable = 2;
        let heap_dump_list_url = this.getHostUrl() + '/' + this.productName +
            '/v1/cavisson/netdiagnostics/ddr/getProcessDumpList?testRun=' + this.testRun + '&tierName=' + this.validateField(this.selectedTierVal)
            + '&server=' + this.selectedServerVal + '&vecArrForGraph=' + this.id.vecArrForGraph + '&isAllData=' + isAll;
        // let heap_dump_list_url = this.getHostUrl() + '/' + 
        //     'netdiagnostics/v1/cavisson/netdiagnostics/ddr/getProcessDumpList?testRun=1250&tierName=' + this.validateField(this.selectedTierVal)
        //     + '&server=' + this.selectedServerVal + '&vecArrForGraph=' + this.id.vecArrForGraph + '&isAllData=' + isAll;
        this.http.get(heap_dump_list_url).subscribe( (data :any) => { this.doAssignProcessDumpList(data) })
    }

    doAssignProcessDumpList(data: any) {
        this.processDumpList = data.processDumpList;
        this.loading = false;
	if(data.errorStatus)
	  this.infoMessage(data.errorStatus); 
        this.hidebutton = false;
        this.confirmationPopup = false;
    }

    showFileName(fileName) {
        if (fileName.trim().lastIndexOf('.gz.gz') !== -1) {
            return fileName.substring(0, fileName.lastIndexOf('.gz'));
        } else {
            return fileName;
        }
    }

    refresh() {
        if (this.showAll) {
            this.openProcessDumpList('isAll');
        } else {
            this.openProcessDumpList();
        }
    }

    downloadFile(node: any) {
        console.log('filePath is ', node);
        let urlInfo = '&tierName=' + node.tierName + '&serverName=' + node.serverName + '&instanceName=' + node.instanceName +
            '&pid=' + node.pid + '&partition=' + node.partition + '&startTime=' + node.startTime + '&endTime=' + node.endTime + '&timestamp=' +
            node.timestamp + '&fileName=' + node.fileName + '&filePath=' + node.filePath + '&userName=' + node.userName + '&mode=' + node.mode +
            '&isFrom=' + node.isFrom + '&index=' + node.index + '&location=' + node.location;

        let url = this.getHostUrl() + '/' + this.productName + '/v1/cavisson/netdiagnostics/ddr/downloadProcessDumpFile?testRun=' +
            this.testRun + urlInfo;
        console.log('download url ', url);
        window.open(url);
        // this.refreshGui =  setInterval(() => { this.openHeapDumpList() }, 10000);
        setTimeout(() => {
            this.openProcessDumpList();
        }, 10000);
    }


    assignNodevalueToDelete(node) {
        let tierName = this.selectedTierVal;
        console.log('tierName--', tierName);
        if (tierName) {
            if (tierName.indexOf(':') !== -1) {
                tierName = tierName.split(':')[1];
                if (Number(tierName) !== 7) {
                   // this.confirmationPopup = false;
                  //  this.errorMessage('user do not have permission to delete Process dump for ' +
                   // this.validateField(this.selectedTierVal), this.id.userName);
                   // return;
                }
            }
        }
        this.nodeValueToDelete = node;
    }

    removeFile() {
        if (this.nodeValueToDelete.filePath == '-') {
            this.confirmationPopup = false;
            alert('File does not exist at NDE, So could not be deleted.');
            return;
        }
        // tierName|serverName|instanceName|pid|partition|startTime|endTime|timestamp|fileName|filePath|userName|mode|isFrom

        let urlInfo = '&tierName=' + this.nodeValueToDelete.tierName + '&serverName=' + this.nodeValueToDelete.serverName +
            '&instanceName=' + this.nodeValueToDelete.instanceName + '&pid=' + this.nodeValueToDelete.pid +
            '&partition=' + this.nodeValueToDelete.partition + '&startTime=' + this.nodeValueToDelete.startTime +
            '&endTime=' + this.nodeValueToDelete.endTime + '&timestamp=' + this.nodeValueToDelete.timestamp +
            '&fileName=' + this.nodeValueToDelete.fileName + '&filePath=' + this.nodeValueToDelete.filePath +
            '&userName=' + this.nodeValueToDelete.userName + '&mode=' + this.nodeValueToDelete.mode +
            '&isFrom=' + this.nodeValueToDelete.isFrom + '&index=' + this.nodeValueToDelete.index +
            '&location=' + this.nodeValueToDelete.location + '&productKey=' + this.productKey;
        let process_dump_list_url = this.getHostUrl() + '/' + this.productName + '/v1/cavisson/netdiagnostics/ddr/removeProcessDump?testRun=' +
            this.testRun + '&removeFile=' + this.nodeValueToDelete.filePath + '/' + this.nodeValueToDelete.fileName + urlInfo;
        console.log('processFile url', process_dump_list_url);
        this._restAPI.getDataByRESTAPIInString(process_dump_list_url,'').subscribe( data => { 
		   this.confirmationPopup = false;
		if(data == 'Successfully updated')
		 {
		   this.openProcessDumpList();
		 }
		else
		  this.errorMessage(data);
	},
	err => 
		{
		   this.confirmationPopup = false;
		  this.errorMessage('Error is coming while removing Process dump');
		});
    }

    /*Custom Sorting*/
    CustomsortForPID(event, tempData) {
        // for interger type data type
        if (event.order === -1) {
            var temp = (event['field']);
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                var value = Number(a[temp]);
                var value2 = Number(b[temp]);
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        } else {
            var temp = (event['field']);
            event.order = -1;
            // asecding order
            tempData = tempData.sort(function (a, b) {
                var value = Number(a[temp]);
                var value2 = Number(b[temp]);
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }

        this.instanceInfo = [];
        // console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.instanceInfo = this.Immutablepush(this.instanceInfo, rowdata) });
        }

    }

    Customsort(event, tempData) {
        // for interger type data type
        if (event.order === -1) {
            var temp = (event['field']);
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                var value = Date.parse(a[temp]);
                var value2 = Date.parse(b[temp]);
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        } else {
            var temp = (event['field']);
            event.order = -1;
            // asecding order
            tempData = tempData.sort(function (a, b) {
                var value = Date.parse(a[temp]);
                var value2 = Date.parse(b[temp]);
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }

        this.processDumpList = [];
        // console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.processDumpList = this.Immutablepush(this.processDumpList, rowdata) });
        }
    }
    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }

    /** Setting host port */
    getHostUrl(): string {
        // var hostDcName = window.location.protocol + '//' + window.location.host;
        // if (this._navService.getDCNameForScreen('viewThreadDump') === undefined) {
        //     hostDcName = this._cavConfigService.getINSPrefix();
        // } else {
        //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen('viewThreadDump');
        // }
        // if (hostDcName.length > 0) {
        //     sessionStorage.removeItem('hostDcName');
        //     sessionStorage.setItem('hostDcName', hostDcName);
        // } else {
        //     hostDcName = sessionStorage.getItem('hostDcName');
        // }

        if (this.sessionService.preSession.multiDc === true) {
            var hostDcName = this.id.getHostUrl() + "/node/ALL"
            console.log('*************hostDcName =**********', hostDcName);
          } else {
            hostDcName = this.id.getHostUrl();
          }
        return hostDcName;
    }
}

export interface InstanceInterface {
  pid: string;
  appName: string;
  arguments: string;
  status:string;
  agentType:string;
  ndHome:string;
}
export interface HeapDumpInterface{
  tierName:string;
  serverName:string;
  appName:string;
  fileName:string;
  location:string;
  time:string;
  status:string;
  message:string;
  action:string;
  // userNote:string;
}
