import { Component } from '@angular/core';
// import { NGXLogger } from "ngx-logger";
import { HttpClient } from "@angular/common/http";
// import { DdrDataModelService } from '../../../../main/services/ddr-data-model.service';
// import { CavConfigService } from '../services/cav-config.service';
import { SelectItem, ConfirmationService } from 'primeng/api';
// import { DashboardConfigDataService } from '../services/dashboard-config-data.service';
import { map } from 'rxjs/operators'
import { SessionService } from 'src/app/core/session/session.service';
import { SortEvent } from 'primeng/api';
import { DdrDataModelService } from '../service/ddr-data-model.service';

@Component({
  selector: 'app-tcp-dump',
  templateUrl: './tcp-dump.component.html',
  styleUrls: ['./tcp-dump.component.scss'],
})
export class TcpDumpComponent {
    isTCPDumpList: boolean;
    isTCPDumpSetting: boolean;

    tiersList: any[];
    selectedTierVal: string;
    serverList: any[];
    selectedServerVal: string;
    interfacesList: any[];
    selectedInterfacesVal: string;
    maxDurationVal: string;
    sizeVal: string;
    packetsVal: string;
    portVal: string;
    additionalAttributesval: string;
    destinationPathVal: string;

    TCPDumpData: any;
    tcpDumpInfo: any;
    selectedTCPDump: SelectItem[];

    /*** These variable are used for doalogBox  ****/
    dialogBoxHeader:string = "Confirmation";
    isDialogBoxVisible:boolean = false;
    dialogContent:any = '';
  
    msgs: any;
    display: any;
    isrejectVisible: boolean;
    // @BlockUI() blockUI: NgBlockUI; 

    isDumpTaken : boolean = false;

    userName : string;
    productKey : string;
    testRun : string;
    loading: boolean = false;

    constructor(private sessionService:  SessionService, private confirmationService: ConfirmationService, 
      // private log: NGXLogger, 
      // private dialog: MatDialog,
        // private _navService: CavTopPanelNavigationService,
        private http: HttpClient, 
        private id: DdrDataModelService,
        // private _cavConfigService: CavConfigService,
        // private _dashboardConfigDataService: DashboardConfigDataService,
        // public dialogRef: MatDialogRef<TcpDumpComponent> 
        ) {
            this.userName = this.sessionService.session.cctx.u;
            this.productKey = this.sessionService.session.cctx.pk;
            this.testRun = this.sessionService.testRun.id;
        }

    ngOnInit() {
        this.takeTCPDump();
        this.isTCPDumpList = false;
        this.isTCPDumpSetting = true;
        // this.blockUI.stop();

        this.maxDurationVal = "120";
        this.sizeVal = "10";
        this.packetsVal = "64000";
        this.portVal = "80";

    }

    takeTCPDump() {
        console.log('this,productKey====>',this.productKey);
        console.log('this.testRun==>',this.testRun);
        var url = this.getHostUrl() + "/DashboardServer/web/tcpDump/vectorList?productKey=" + this.productKey + "&testRun=" + this.testRun;
        this.http.get(url).pipe(map(res => res )).subscribe(data => {
          if (data["Vector_List"].length == 0 || data["Vector_List"].toString().indexOf("Error") != -1) {
              this.confirmationService.confirm({
                  rejectVisible: false,
                  message: data["Vector_List"],
                  accept: () => {
                      return;
                  },
                  reject: () => {
                      return;
                  },
              });
          }
          this.setTierServerValues(data)
          this.TCPDumpData = data;
      }
        );
    }

    setTierServerValues(data) {
        var tiersListlabel = Object.keys(data["Vector_List"])
        this.tiersList = this.createDropdown(tiersListlabel);
    }

    /**
     * Get Server Values
     * @param selectedTierVal 
     */
    getServerValue(selectedTierVal) {
        this.selectedServerVal = '--Select--';
        var serverlabel = this.TCPDumpData["Vector_List"][selectedTierVal];
        this.serverList = this.createDropdown(Object.keys(serverlabel));
        //This check is used to set default server in server dropdown.
        if(this.serverList.length > 0){
          this.selectedServerVal = this.serverList[0]['value'];
          this.getInterfaceValue(this.serverList[0]['value']);
        }
    }

    getInterfaceValue(selectedServerVal) {
        var serverName = this.TCPDumpData["Vector_List"][this.selectedTierVal][this.selectedServerVal][0];
        var url = this.getHostUrl() + "/DashboardServer/web/tcpDump/interfaceList?productKey="+this.productKey +"&serverName=" + serverName + "&testRun=" + this.testRun;
        return this.http.get(url).pipe(map(res => res )).subscribe( (data:any) => {
          if (data.length == 0 || data.toString().indexOf("ERROR") != -1) {
              this.confirmationService.confirm({
                  rejectVisible: false,
                  message: "Could not resolve selected server name.",
                  header:"ERROR",
                  accept: () => {
                      this.destinationPathVal = "";
                      this.interfacesList = [];
                      return;
                  },
                  
              });
              this.display = true;
              return;
          }
          var interfaceList = data["Interface_List"];
          this.interfacesList = this.createDropdown(interfaceList);
          this.selectedInterfacesVal = interfaceList[0];           //Showing first element as selected option
          //Setting default $CMON_HOME Path 
          this.destinationPathVal = data["cav_mon_home"];

      }
        );

    }

    getTCPDumpCommand() {
        if (this.selectedTierVal == undefined || this.selectedServerVal == undefined || this.selectedInterfacesVal == undefined || this.maxDurationVal == undefined
            || this.destinationPathVal == undefined) {
            this.confirmationService.confirm({
                rejectVisible: false,
                message: "Fill required fields",
                accept: () => {
                    return;
                },
                reject: () => {
                    return;
                },
            });
        }
        var command = "";
        var fileFormat = "";
        if (this.destinationPathVal.endsWith("/"))
            fileFormat = "tcpdump_yyyyMMddHHmmss_" + this.selectedInterfacesVal.trim() + ".pcap";
        else
            fileFormat = "/tcpdump_yyyyMMddHHmmss_" + this.selectedInterfacesVal.trim() + ".pcap";

        if (this.packetsVal != undefined && this.packetsVal != "")
            command = "tcpdump" + " -i " + this.selectedInterfacesVal + " -w " + this.destinationPathVal + fileFormat + " -c " + this.packetsVal;
        else if (this.maxDurationVal != undefined && this.maxDurationVal != "")
            command = "tcpdump" + " -i " + this.selectedInterfacesVal + " -w " + this.destinationPathVal + fileFormat + " -G " + this.maxDurationVal + " -W 1";
        else
            command = "tcpdump" + " -i " + this.selectedInterfacesVal + " -w " + this.destinationPathVal + fileFormat + " -G 100 -W 1";

        if (this.portVal != undefined && this.portVal != "")
            command = command + " port " + this.portVal;

        /*If additional attributes are provided by the user*/
        if (this.additionalAttributesval != "" && this.additionalAttributesval != undefined)
            command = command + " " + this.additionalAttributesval;

        this.isDialogBoxVisible = true;
        this.dialogBoxHeader = 'TCP Dump Command';
        this.dialogContent = command;
        /*this.confirmationService.confirm({
            rejectVisible: false,
            message: command,
            header: 'TCP Dump Command',
            accept: () => {
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
            },
            reject: () => {
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have rejected' }];
            },
        });*/

    }
    /**
     * Take Tcp Dump
     */
    getTakeTCPDump() {
        this.loading=true;
        if(this.selectedServerVal == '--Select--'){
         this.loading=false;
         console.log("Please select Server name.");
         this.isDialogBoxVisible = true;
         this.dialogBoxHeader = 'Confirmation';
         this.dialogContent = 'Please select Server name.';
         return; 
        }
        // this.blockUI.start();
        var serverName = this.TCPDumpData["Vector_List"][this.selectedTierVal][this.selectedServerVal][0];
        var url = this.getHostUrl() + '/DashboardServer/web/tcpDump/getTCPDump?productKey='+this.productKey +'&displayServerName=' + this.selectedServerVal + '&saveFilePath=' + this.destinationPathVal + '&tierName=' + this.selectedTierVal + '&serverName=' + serverName + '&testRun=' + this.testRun + '&interfaceName=' + this.selectedInterfacesVal + '&numPackets='
            + this.packetsVal + '&memorySize=' + this.sizeVal + '&maxDuration=' + this.maxDurationVal + '&port=' + this.portVal + '&addAttributes=' + this.additionalAttributesval;

            this.http.get(url).pipe(map(res => res )).subscribe(data => {
            // this.blockUI.stop();

        this.loading=false;        
        this.isDialogBoxVisible = true;
        this.dialogBoxHeader = 'Confirmation';
        this.dialogContent = data;
        this.isDumpTaken = true;
    /*        this.confirmationService.confirm({
                rejectVisible: false,
                message: data,
                header: 'Confirmation',
                accept: () => {
                    this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                },
                reject: () => {
                    this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have rejected' }];
                },
            }); */

        });
    }
  
    /**
     * Method Used for create drop down List
    */
    createDropdown(list: any): SelectItem[] {
        let selectItemList: SelectItem[] = [];

        for (let index in list) {
            if (list[index].indexOf("--Select") != -1) {
                selectItemList.push({ label: list[index], value: '' });
            }
            else {
                selectItemList.push({ label: list[index], value: list[index] });
            }
        }

        return selectItemList;
    }

    /**
     * TCP DUMP List 
     */
    getTCPDumpList() {
        
        // this.blockUI.start();
        var url = this.getHostUrl() + "/DashboardServer/web/tcpDump/tcpFileList?productKey="+this.productKey +"&testRun=" + this.testRun;
        return this.http.get(url).pipe(map(res => res )).subscribe((data:any) => {
          if(!(data.indexOf("ERROR") == -1)){
           this.confirmationService.confirm({
               rejectVisible: false,
               message: "ERROR: No tcp dump present inside test run",
               header: 'ERROR',
               accept: () => {
                   this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                   return;
               },
               reject: () => {
                   this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have rejected' }];
                   return;
               },
           });
       }
       else
       {
           this.isTCPDumpList = true;
           this.tcpDumpInfo = data;
           if(document.getElementsByClassName("mat-dialog-container") && document.getElementsByClassName("mat-dialog-container")[0] && document.getElementsByClassName("mat-dialog-container")[0]["style"])
           {
               document.getElementsByClassName("mat-dialog-container")[0]["style"]["overflow"]="unset";
           }
       }
           // this.blockUI.stop();
       }
        );
    }

    /**
     * Close TCP Dump Settings Window
     */
    closeTCPDumpWin() {
        this.isTCPDumpList = false;
        this.isTCPDumpSetting = false;
        // this.dialogRef.close();
    }

    /**
     * Download TCP File
     */
    downloadSelectedfile() {
        //  this.isrejectVisible = true,
        
        if( this.selectedTCPDump == undefined || this.selectedTCPDump.length < 1 )
        {
            
        this.confirmationService.confirm({
            message: 'Select atleast One file to download',
            header: 'Confirmation',
           // rejectVisible: false,
            accept: () => {
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                return;
            },
            reject: () => {
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have rejected' }];
                return;
            },
           

        });
    }
    else {    
        this.confirmationService.confirm({
            message: 'Do you want to download selected file(s)?',
            header: 'Confirmation',
            icon: 'icons8 icons8-help',
            accept: () => {
                for(let i =0; i< this.selectedTCPDump.length ; i++){
                    var fileName="";
                    if(this.selectedTCPDump[i]["partition"])
                            fileName = this.selectedTCPDump[i]["controllerPath"] + "/webapps/logs/TR" + this.testRun+ "/" + this.selectedTCPDump[i]["partition"] + "/server_logs/tcp_dumps/" + this.selectedTCPDump[i]["tier"] + "/" + this.selectedTCPDump[i]["server"] + "/" + this.selectedTCPDump[i]["name"];
                        else
                            fileName = this.selectedTCPDump[i]["controllerPath"] + "/webapps/logs/TR" + this.testRun + "/server_logs/tcp_dumps/" + this.selectedTCPDump[i]["tier"] + "/" + this.selectedTCPDump[i]["server"] + "/" + this.selectedTCPDump[i]["name"];
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                window.open("../../../../DashboardServer/web/ImportAccessLogService/service-record?productKey="+this.productKey +"&fullFilePath=" + fileName);
              }
            },
            reject: () => {
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have rejected' }];
            },
        });
    }
    }

    /**
     * This method is used for perform action on OK btn in dialogBox.
     */
    dialogOkAction(){
      this.isDialogBoxVisible = false;
      if(this.isDumpTaken){
          this.resetValues();
          this.isDumpTaken = false;
      }
    }

    dialogClose() {
      this.isDialogBoxVisible = false;
      if(this.isDumpTaken){
        this.resetValues();
        this.isDumpTaken = false;
    }
    }

    resetValues() {
        this.selectedServerVal = "--Select--";
        this.selectedTierVal = "--Select--";   
        this.selectedInterfacesVal = "";
        this.interfacesList = [];
        this.destinationPathVal = "";
    }
   
    /**
     * Delete TCP Dump list 
     */
    deleteTCPDumpList() {
        var fullFilePath = [];
        var fileList = [];

        // Getting file List and Full File Path to send it to server to delete TCP Dump file
        if (this.selectedTCPDump == undefined || this.selectedTCPDump.length < 1) {
            this.confirmationService.confirm({
                message: 'Select atleast one record to remove',
                header: 'Confirmation',
                rejectVisible: false,
                accept: () => {
                    this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                    return;
                },
                reject: () => {
                this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
                 return;
            }
         });
        } 
        else{
        this.confirmationService.confirm({
            message: 'Do you want to remove selected file(s)?',
            header: 'Confirmation',
            icon: 'icons8 icons8-help',
            accept: () => {
                this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                this.deleteTCPDumpFromServer(fullFilePath, fileList);
            },
            reject: () => {
                this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
                 return;
            }
        });
    }

     /*   for (var i in this.selectedTCPDump) {
            let selectedRules = this.selectedTCPDump;
            let arrRulesIndex = [];
            for (let index in selectedRules) {
                arrRulesIndex.push(selectedRules[index]);
            }

            this.blockUI.start();

            fileList.push(this.selectedTCPDump[i]["name"]);
            var path = this.selectedTCPDump[i]["controllerPath"] + "/webapps/logs/TR" + this._dashboardConfigDataService.$testRun + "/server_logs/tcp_dumps/" + this.selectedTCPDump[i]["tier"] + "/" + this.selectedTCPDump[i]["server"];
            fullFilePath.push(path + "/" + this.selectedTCPDump[i]["name"]);

            var deleteUrl = "//" + this.getHostUrl() + '/DashboardServer/web/tcpDump/deleteFileList?productKey='+this.productKey +'&userName=' + this._dashboardConfigDataService.$userName + '&deleteFileListPath=' + fullFilePath + '&testRun=' + this._dashboardConfigDataService.$testRun + '&deleteFileList=' + fileList;
            this.http.get(deleteUrl).map(res => res ).subscribe(data => {
                this.blockUI.stop();
                this.deleteTCPDumpFromTable(arrRulesIndex);
            });

        } */

    }

    /**
   * This method is used to delete TCPDump from server.
   * @FullFilePath 
   * @fileList
   */
  deleteTCPDumpFromServer(fullFilePath, fileList){
      for (var i in this.selectedTCPDump) {
            let selectedRules = this.selectedTCPDump;
            let arrRulesIndex = [];
            for (let index in selectedRules) {
                arrRulesIndex.push(selectedRules[index]);
            }

            // this.blockUI.start();

            fileList.push(this.selectedTCPDump[i]["name"]);
            var path = this.selectedTCPDump[i]["controllerPath"] + "/webapps/logs/TR" + this.testRun + "/server_logs/tcp_dumps/" + this.selectedTCPDump[i]["tier"] + "/" + this.selectedTCPDump[i]["server"];
            fullFilePath.push(path + "/" + this.selectedTCPDump[i]["name"]);

            var deleteUrl = this.getHostUrl() + '/DashboardServer/web/tcpDump/deleteFileList?productKey='+this.productKey +'&userName=' + this.userName + '&deleteFileListPath=' + fullFilePath + '&testRun=' + this.testRun + '&deleteFileList=' + fileList;
            this.http.get(deleteUrl).pipe(map(res => res )).subscribe(data => {
                // this.blockUI.stop();
                this.deleteTCPDumpFromTable(arrRulesIndex);
            });
      }
  }

    /**This method is used to delete Rules from Data Table */
    deleteTCPDumpFromTable(arrRulesIndex: any[]): void {
        //For stores table row index
        let rowIndex: number[] = [];

        for (let index in arrRulesIndex) {
            rowIndex.push(this.getRulesIndex(arrRulesIndex[index]["name"]));
        }
        this.tcpDumpInfo = this.deleteMany(this.tcpDumpInfo, rowIndex);
    }

    /**This method returns selected application row on the basis of selected row */
    getRulesIndex(name: any): number {
        for (let i = 0; i < this.tcpDumpInfo.length; i++) {
            if (this.tcpDumpInfo[i]["name"] == name) {
                return i;
            }
        }
        return -1;
    }

    deleteMany(array, indexes = []) {
        this.selectedTCPDump = [];
        return array.filter((item, idx) => indexes.indexOf(idx) === -1);
    }

    /**
     * Cancel TCP Dump list Window
     */
    cancelTCPListWin() {
        this.isTCPDumpList = false;
        this.isTCPDumpSetting = true;
        this.selectedTCPDump = [];
    }

    getHostUrl(): string {
        // var hostDcName = window.location.protocol + '//' + window.location.host;
        // if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
        //     hostDcName = this._cavConfigService.getINSPrefix();
        // else
        //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

        // if (hostDcName.length > 0) {
        //     sessionStorage.removeItem("hostDcName");
        //     sessionStorage.setItem("hostDcName", hostDcName);
        // }
        // else

        //     hostDcName = sessionStorage.getItem("hostDcName");

        if (this.sessionService.preSession.multiDc === true) {
            var hostDcName = this.id.getHostUrl() + "/node/ALL"
            console.log('*************hostDcName =**********', hostDcName);
          } else {
            hostDcName = this.id.getHostUrl();
          }
          return hostDcName;
    }
    Customsort(event: SortEvent) {
        console.log("event",event);
        if (event["field"] === "duration_Tcp" ||
            event["field"] === "duration_User" ||
            event["field"] === "packets" ||
            event["field"] === "size" ||
            event["field"] === "size_User" ){
          if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1
            event.data = event.data.sort(function (a, b) {
              var value = Number(a[temp].replace(/,/g, ''));
              var value2 = Number(b[temp].replace(/,/g, ''));
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
          }
          else {
            var temp = (event["field"]);
            event.order = -1;
            //ascending order
            event.data = event.data.sort(function (a, b) {
              var value = Number(a[temp].replace(/,/g, ''));
              var value2 = Number(b[temp].replace(/,/g, ''));
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
          }
        }
        else {
          var temp = (event["field"]);
          if (event.order == -1) {
            event.data = event.data.sort(function (a, b) {
              var value = a[temp];
              var value2 = b[temp];
              return value.localeCompare(value2);
            });
          } else {
            event.order = -1;
            event.data = event.data.sort(function (a, b) {
              var value = a[temp];
              var value2 = b[temp];
              return value2.localeCompare(value);
            });
          }
        }
      }
}
