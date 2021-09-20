import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../services/common.services'
import { Router } from '@angular/router'
import { DdrBreadcrumbService } from '../../services/ddr-breadcrumb.service';
import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import { CavConfigService } from '../../../../main/services/cav-config.service';
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { HttpClient } from '@angular/common/http';
import { DataTableModule, BlockUIModule, SelectItem } from 'primeng/primeng';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';

@Component({
   selector: 'app-gcManager',
   templateUrl: './gcManager.component.html',
   styleUrls: ['./gcManager.component.css']
})

export class GcManagerComponent implements OnInit {
   uploadUrl: string;
   id: any;
   selectedServerVal: string;
   selectedTierVal: string;
   showThreadDumpOption: boolean = false;
   tierServerJsonList: Object;
   tierNameList: any[];
   tiers: SelectItem[];
   servers: SelectItem[];
   loading: boolean = false;
   showDialog: boolean = false;
   errorStatus:string="";
   gcDumpList: Array<GcInterface>;
   fileName: string = '';
   fileNameWithPath: string = '';
   isActive: boolean = false;
   screenHeight: any;
   message:any;
   confirmationPopup: boolean = false; 
   nodeValueToDelete;
   productKey: string;
  serverNameforGC: string;
  disableSelectedRemove: boolean = true;
  selectedGcFileInfo: GcInterface[] = [];
   
   


   constructor(public commonService: CommonServices, private confirmationService: ConfirmationService,
      public _ddrData: DdrDataModelService,
      private _navService: CavTopPanelNavigationService,
      private _router: Router,
      private _cavConfigService: CavConfigService,
      private ddrRequest: DDRRequestService,
      private http: HttpClient,private breadcrumbService :DdrBreadcrumbService
   ) {
   }

   ngOnInit() {

      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.GC_MANAGER);
      this.uploadUrl = this.getHostUrl() + '/' + this._ddrData.product + "/v1/cavisson/netdiagnostics/ddr/uploadgclog?";
      console.log("this.upload url",this.uploadUrl );
      this.id = this.commonService.getData();
      this.getTierServerInfo();
      this.getGcDumpInfo("All");
      this.productKey = sessionStorage.getItem('productKey');
   }


   onUpload($evt) {
    console.log("onupload",$evt);
 
    let data = $evt.xhr.response;
    data = JSON.parse(data); 	 
    this.loading = false;
    console.log("data in on",data);
    if(data)
     {
      this._ddrData.gcViewerData = data;
      this._navService.addNewNaviationLink('ddr');
      this._router.navigate(['/home/ddr/gcViewer']);
     // this.closeHeapDumpWin();
      return;
     }
    else if(data.error)
    this.commonService.showError(data.error);
    else
      this.commonService.showError("Error is coming during analysing GC Log file");
 
    return;
 
 }




   getHostUrl(isDownloadCase?): string {
      var hostDcName;
      hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
         this.id.testRun = this._ddrData.testRun;
         console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
      }
      console.log('hostDcName =', hostDcName);
      return hostDcName;
   }

   getTierServerInfo(){
      this.selectedServerVal = "";
      this.selectedTierVal = "";
      this.showThreadDumpOption = false;
      this.loading = false;    
  
      var url = "//" + this._ddrData.getHostUrl() + '/' + this._ddrData.product + "/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=" + this._ddrData.testRun + 
      '&user='+ this._ddrData.userName +
      '&protocol='+ this._ddrData.protocol + 
      '&ip='+ this._ddrData.host+':'+this._ddrData.port ;
      console.log('getTierServerListFromTopology url ',url);
      return this.http.get(url).subscribe(data => (this.setTierValues(data)));
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
   getServerValue(selectedValue: any) {
      var serverNameList = [];
      this.servers = [];
      this.selectedServerVal = "";
  
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
getGcDumpInfo(isAll? : string){
   let gc_dump_url
   isAll = "All";
 //  console.log("&tierName=", this.selectedTiers, "&serverName=", this.selectedServers, "&instanceName=", this.selectedApps)
   // gc_dump_url =  this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/viewThreadDump?testRun=" + this.id.testRun + "&tierName=" + this.selectedTiers + "&serverName=" + this.selectedServers + "&instanceName=" + this.selectedApps + "&startTime=" + this.id.strStartTime + "&endTime=" + this.id.strEndTime;
    gc_dump_url = "//" + this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/webddr/getGcDumpList?testRun=" + this.id.testRun +
   '&tierName=' +this.selectedTierVal +
   '&server=' + this.selectedServerVal +
   '&vecArrForGraph=' + this.id.vecArrForGraph +
   '&isAllData='+isAll;
   return this.ddrRequest.getDataUsingGet(gc_dump_url).subscribe(data => (this.createGCDumpInfo(data)));
 }

 createGCDumpInfo(data:any){

   if(data.errorStatus != undefined)
   {
   this.loading=false;
   this.errorStatus=data.errorStatus;
   }
   if(data.gcDumpList != undefined )
   {
      this.errorStatus="";
      this.gcDumpList = data.gcDumpList;
      this.loading=false;
   }
   
 }

    GetGcFileFromServer(){
      console.log("this.selectedTierVal>>>>",this.selectedTierVal);
      console.log("this.selectedServerVal>>>>>>",this.selectedServerVal);
      if (this.selectedTierVal === undefined|| this.selectedTierVal === null || this.selectedTierVal === "") {
        alert('Please select any Tier before Download');
      }
      else if (this.selectedServerVal === undefined || this.selectedServerVal === null || this.selectedServerVal === "") {
        alert('Please select any Server with related tier before Download');
      }else
      this.showDialog = true;
      this.fileNameWithPath = "";
    }

    downloadGcFile() {
      
      console.log(this.fileNameWithPath);
      if (this.fileNameWithPath === undefined || this.fileNameWithPath === null || this.fileNameWithPath === "") {
        alert('FileName can not be empty');
      }
      else if (!this.checkFileName(this.fileNameWithPath)) {
        alert('Enter file name with absolute path');
      }
      // else {
      //   if(this._ddrData.gcFileExtension){
      //     if(this.fileName.includes(".") && !this.fileName.endsWith(".log")) {
      //         alert("Use .log file extension for GC File");
      //         return;
      //     }
      //     else if(!this.fileName.endsWith(".log"))
      //        this.fileName = this.fileName + this._ddrData.gcFileExtension;
      //   }
      // }
      else{
    console.log('fileNameWithPath is ', this.fileNameWithPath);
    console.log('selectedTierVal is ', this.selectedTierVal);
    console.log('selectedServerVal is ', this.selectedServerVal);
    let location = this.fileNameWithPath.substring(0,this.fileNameWithPath.lastIndexOf("/"));
    let filename = this.fileNameWithPath.substring(this.fileNameWithPath.lastIndexOf("/")+1);
    
    if (this.selectedServerVal.indexOf('(') != -1)
      this.serverNameforGC = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
    else
      this.serverNameforGC = this.selectedServerVal;

   

   let urlInfo = '&tierName=' + this.selectedTierVal + '&serverName=' + this.serverNameforGC + "&startTime=undefined&endTime=undefined&timestamp=" + '&fileName=' + filename + '&filePath=' + '-' + '&userName=' + this._ddrData.userName + '&location=' + location;

    let url = "//" + this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/webddr/downloadGCFile?testRun=" + this.id.testRun+ urlInfo ;
    console.log('download GC File url ', url);
    this._ddrData.setInLogger('','GC File','GC File Download','GC File Download Successfully');
    this.showDialog = false;
    window.open(url);
      }
    setTimeout(() => {
      this.getGcDumpInfo('isAll');
    }, 10000);
  }

  showFileName(fileName) {
   if(fileName.trim().lastIndexOf(".gz.gz") != -1)
      return fileName.substring(0,fileName.lastIndexOf(".gz"));
   else
      return fileName;
 }


 checkFileName(fileName:string){

   if(/^[A-Za-z]:/.test(fileName) || fileName.includes('/')){
     return true;
   }
   else{
     return false;
   }

 }

 assignNodevalueToDelete(node) {
   this.confirmationPopup = true;
   let tierName = this.selectedTierVal;
   if (tierName) {
     if (tierName.indexOf(":") != -1){
       tierName = tierName.split(":")[1];
       }
   }
   this.nodeValueToDelete = node;
   
 }
 removeFile() {
   if(this.nodeValueToDelete.filePath === "-"){
     this.confirmationPopup = false;
     alert("File doesn't exist at NDE, So couldn't be deleted.");
     return;
   }
   //let urlInfo = '&tierName=' + this.nodeValueToDelete.tierName + '&serverName=' + this.nodeValueToDelete.serverName + '&instanceName=' + this.nodeValueToDelete.instanceName + '&pid=' + this.nodeValueToDelete.pid + '&partition=' + this.nodeValueToDelete.partition + '&startTime=' + this.nodeValueToDelete.startTime + '&endTime=' + this.nodeValueToDelete.endTime + '&timestamp=' + this.nodeValueToDelete.timestamp + '&fileName=' + this.nodeValueToDelete.fileName + '&filePath=' + this.nodeValueToDelete.filePath + '&userName=' + this.nodeValueToDelete.userName + '&mode=' + this.nodeValueToDelete.mode + '&isFrom=' + this.nodeValueToDelete.isFrom + '&Index=' + this.nodeValueToDelete.index + '&location=' + this.nodeValueToDelete.location + '&productKey=' + this.productKey;
   console.log("this.nodeValueToDelete************----------",this.nodeValueToDelete);
   let Gc_log_remove_url = "//" + this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/webddr/removeGcLogFile?testRun=" + this.id.testRun + '&filePath=' + this.nodeValueToDelete.filePath + '/' + this.nodeValueToDelete.fileName +  '&userName=' + this.nodeValueToDelete.userName + '&index=' + this.nodeValueToDelete.index + '&productKey=' + this.productKey;
   console.log("Gc_log_remove_url************----------",Gc_log_remove_url);
   this.ddrRequest.getDataInStringUsingGet(Gc_log_remove_url).subscribe( data => {
                  this.confirmationPopup = false;
               if(data == 'Successfully updated')
                {
     console.log('Deleted '+this.nodeValueToDelete.fileName+' Gc file successfully.');
               //  if (this.showAll)
                 this.getGcDumpInfo('isAll');
               //  else
               //   this.getGcDumpInfo();
                }
               else
               this.commonService.showError(data);
       },
       err =>
               {
                  this.confirmationPopup = false;
                  this.commonService.showError('Error is coming while removing Gc file');
               });
 }

 RemoveSelectedFiles(){
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete all selected GC Files',
    header: 'Delete Confirmation',
    icon: 'fa fa-trash',
    accept: () => {
      this.deleteSelectedGcFiles();
    }
  });
 }

 deleteSelectedGcFiles(){
  let ipwithProd ="";
  let delete_GC_url = "";
  var fullFilePathList = [];
  var fileIndexList = [];

  for (var i in this.selectedGcFileInfo) {

    let filePath = this.selectedGcFileInfo[i]["filePath"] +  '/' + this.selectedGcFileInfo[i]["fileName"] ;
    fullFilePathList.push(filePath);
    fileIndexList.push(this.selectedGcFileInfo[i]["index"]);
 }
 delete_GC_url = this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/removeSelectedGcFile?testRun=" + this.id.testRun+'&filePathList='+fullFilePathList+'&indexList='+fileIndexList + '&productKey=' + this.productKey + '&userName=' + this._ddrData.userName ;
 this.runRemoveReq(delete_GC_url);
}



  runRemoveReq(delete_GC_url){
    this.ddrRequest.getDataInStringUsingGet(delete_GC_url).subscribe( (data) =>{this.getGcDumpInfo();
      if(data.toString().indexOf("Successfully updated") != -1)
      this.message= [{severity:'success', summary:'', detail:'Gc File deleted successfully.'}];
      else
      this.message= [{severity:'error', summary:'', detail:'Error while deleting Gc File.'}];
    });  
}
// selecting rowdata on selection of checkbox
onRowSelect(data: any) {
  console.log('select data', data);
  let index: number = this.selectedGcFileInfo.indexOf(data);
  if (index == -1) {
  this.selectedGcFileInfo.push(data);
  }
  console.log('selectd item', this.selectedGcFileInfo);
  
  
  if(this.selectedGcFileInfo.length >= 2){
  this.disableSelectedRemove =false;
  }
  else
  {
  this.disableSelectedRemove =true;
  }
  console.log('after addition', this.selectedGcFileInfo);
  }
  
  // Unselecting rowData on unselecting checkbox
  onRowUnselect(data: any) {
   console.log('unselect data->', data);
  
  let index: number = this.selectedGcFileInfo.indexOf(data);
  if (index !== -1) {
  this.selectedGcFileInfo.splice(index, 1);
  }
  
  if(this.selectedGcFileInfo.length >=2){
  this.disableSelectedRemove =false;
  }
  
  else{
  this.disableSelectedRemove =true;
  
  }
  console.log('after deletion', this.selectedGcFileInfo);
  }


   // selecting all data options on header check box
   onHeaderCheckboxToggle(event: any) {
    console.log('all row data--------->', event)
    console.log('all row selectedGcFileInfo--------->', this.selectedGcFileInfo)
    if(event.checked && this.selectedGcFileInfo.length >= 2 ) {
      this.disableSelectedRemove = false;  
    }else{
      this.disableSelectedRemove = true; 
    }
   }


 analyzeGCFile(node){
  this.loading = true;
  let analyzeUrl ="";
  console.log("Data in Node********",node);
  if(node){
    analyzeUrl = "//" + this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/webddr/analyzeGcFile?testRun=" + this._ddrData.testRun +'&filePath=' + node.filePath +'&fileName=' + node.fileName; 
  }
else
  {
   this.loading = false;
   this.commonService.showError("Error not able to analyze GC File due to invalid file ");
   return;
  }
  console.log("rest url for analyzeUrl********",analyzeUrl);
  this.http.get(analyzeUrl).subscribe( (data:any) => {
      this.analyzeGcData(data);
  },
  error => {
      this.loading = false;
      this.commonService.showError(error);
  });

 }
 analyzeGcData(data){
  console.log("Data in analyzeGcData*******>>>>>>*",data);
  this.loading = false;
  if(data && !data.error)
  {
    this._navService.addNewNaviationLink('ddr');
    if(data){
      this._ddrData.gcViewerData = data;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.GC_MANAGER;
      this._router.navigate(['/home/ddr/gcViewer']);
     }
    return;
  }
  else if(data.error)
  this.commonService.showError(data.error);
  else
  this.commonService.showError("Error is coming during analysing GC File");

  return;
 }


   close(){
      this.showDialog = false; 
   }

/* Custom sorting for data */
 
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

   this.gcDumpList = [];
   //console.log(JSON.stringify(tempData));
   if (tempData) {
      tempData.map((rowdata) => { this.gcDumpList = this.Immutablepush(this.gcDumpList, rowdata) });
   }

 }
 Immutablepush(arr, newEntry) {
   return [...arr, newEntry]
 }

 
}


export interface GcInterface{
   tierName:string;
   serverName:string;
   fileName:string;
   location:string;
   time:string;
   status:string;
   message:string;
   action:string;
 }

 
 
