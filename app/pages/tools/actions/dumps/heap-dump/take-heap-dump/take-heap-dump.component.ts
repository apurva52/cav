import { Component, OnInit, OnDestroy } from '@angular/core';
//import { MatDialog } from '@angular/material';
//import { DashboardRESTDataAPIService } from '../../services/dashboard-rest-data-api.service';
//import { Logger } from '../../../../../vendors/angular2-logger/core';
//import { DdrDataModelService } from '../../../../main/services/ddr-data-model.service';
import { Subscription } from 'rxjs';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';
// import { DdrDataModelService } from '../../service/ddr-data-model.service';
import { DashboardRESTDataAPIService } from '../../service/dashboard-rest-data-api.service';
// import { MatDialogRef } from '@angular/material/dialog';
import { NGXLogger } from "ngx-logger";
import { SessionService } from 'src/app/core/session/session.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DdrDataModelService } from '../../service/ddr-data-model.service';
import { HeapDumpService } from '../service/heap-dump.service';



@Component({
  moduleId: module.id,
  selector: 'take-heap-dump',
  templateUrl: 'take-heap-dump.component.html',
  styleUrls: ['take-heap-dump.component.scss']
})
export class TakeHeapDumpComponent {
  fileName;
  productName: any;


  constructor(private _dialog: DynamicDialogRef,
    // public config: DynamicDialogConfig,
    private log: NGXLogger,
     private _restAPI: DashboardRESTDataAPIService, public _ddrData: DdrDataModelService,
     private sessionService:  SessionService,private HeapDumpService: HeapDumpService
     ) {
      this.productName = this.sessionService.session.cctx.prodType;
      if(this.productName == 'NetDiagnostics')
        this.productName = 'netdiagnostics';
  }
  /** Thread Dump Message subscriber */
  threadDumpMsgSubscription: Subscription;


  message: Message;


  ngOnInit() {
    this.threadDumpMsgSubscription = this._ddrData.messageProvider$.subscribe(data => this.message = data);
  }

  ngOnDestroy() {
    if (this.threadDumpMsgSubscription !== null && this.threadDumpMsgSubscription !== undefined) {
      this.threadDumpMsgSubscription.unsubscribe();
    }
  }

  /*Method is used to close the dialog box */
  onClose() {
    try {
      this._dialog.close();
    } catch (e) {
      //this.log.error('Error while closing the dialog box.', e);
    }
  }

  checkFileName(fileName:string){
    if(/^[A-Za-z]:/.test(fileName) || this.fileName.includes('/') || this.fileName.includes('.hprof')){
      return true;
    }
    else{
      return false;
    }

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

   getHostUrl(): string {
    var hostDcName =  window.location.protocol + '//' + window.location.host;
    return hostDcName;
  }


  takeHeapDump() {
    console.log(this.fileName);
    if (this.fileName === undefined) {
      alert('FileName can not be empty');
    }
    if (!this.checkFileName(this.fileName)) {
      alert('Enter file name with absolute path');
    }
    else {
      if(this.HeapDumpService.heapFileExtension){
        if(this.fileName.includes(".") && !this.fileName.endsWith(".hprof")) {
            alert("Use .hprof file extension for java instance");
            return;
        }
        else if(!this.fileName.endsWith(".hprof"))
           this.fileName = this.fileName + this.HeapDumpService.heapFileExtension;
      }

      if (this._ddrData.vecArrForGraph !== undefined && this._ddrData.vecArrForGraph.length > 1) {
        let restUrl = this.setIpWithProtocol() + '/' + this.productName + '/v1/cavisson/netdiagnostics/ddr/handleMergeThreadDump?testRun=' + this._ddrData.testRun + '&vecArrForGraph=' + this._ddrData.vecArrForGraph + '&startTime=' + this._ddrData.startTime + '&endTime=' + this._ddrData.endTime + '&dumpType=0&heapFilePath=' + this.fileName + '&loginUserName=' + this._ddrData.userName;
        let dataSubscription = this._restAPI.getDataByRESTAPI(restUrl, '')
          .subscribe(
          result => {
            this.showNotification(result);
          },
          err => { this.showNotification(err); },
          () => {
            //this.log.debug('Dashboard Take Heap Dump request completed successfully.');

            /*unsubscribe/releasing resources.*/
            dataSubscription.unsubscribe();
            return null;
          }
          );
      }
      else {
        this.HeapDumpService.blockuiForTakeHeapDump=true;
        this.HeapDumpService.loading1=true;
        let restUrl = this.setIpWithProtocol() + '/' + this.productName + '/v1/cavisson/netdiagnostics/ddr/takeHeapDump?testRun=' + this._ddrData.testRun + '&tierName=' + this.HeapDumpService.tiername + '&serverName=' + this.HeapDumpService.servername + '&instanceName=' + this.HeapDumpService.appname + '&startTime=' + this.HeapDumpService.startTime + '&endTime=' + this.HeapDumpService.endTime + '&dumpType=0' + '&heapFilePath=' + this.fileName + '&processIdWithInstance=' + this.HeapDumpService.processIdWithInstance + '&isFromND=' + this.HeapDumpService.isFromND + '&loginUserName=' + this.HeapDumpService.userName + '&isCompressed=' + this.HeapDumpService.isCompressed + '&downloadFile=' + this.HeapDumpService.downloadFile;
        let dataSubscription = this._restAPI.getDataByRESTAPI(restUrl, '')
          .subscribe(
          result => {

            let data = result;
            this.HeapDumpService.getEmmiter(data);
            // this.showNotification(result);
          },
          err => { this.showNotification(err); },
          () => {
            //this.log.debug('Dashboard Take Heap Dump request completed successfully.');

            /*unsubscribe/releasing resources.*/
            dataSubscription.unsubscribe();
            return null;
          }
          );
      }
      this._ddrData.isFromND = undefined;
      this._ddrData.processIdWithInstance = undefined;
      this._ddrData.isCompressed = undefined;
      this._ddrData.downloadFile = undefined;
      this._dialog.close();
    }
  }

  showNotification(result) {
    if (result === undefined)
      this._ddrData.errorMessage('Error in Taking Heap Dump');
    console.log('result log is ', result);
    let resultArr = result[0].split('|');
    resultArr.forEach(element => {
      if (element.startsWith('Pass'))
        this._ddrData.multiSuccessMessage(element.split(':')[2], element.split(':')[1]);
      if (element.startsWith('Fail'))
        this._ddrData.multiErrorMessage(element.split(':')[2] + element.split(':')[3], element.split(':')[1]);
    });
  }

}
