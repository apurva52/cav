import { Component, OnInit } from "@angular/core";
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { DdrBreadcrumbService } from "../../services/ddr-breadcrumb.service";
import { HttpClient } from "@angular/common/http";
import { DDRRequestService } from '../../services/ddr-request.service';
import { CommonServices } from '../../services/common.services';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';

@Component({
  selector: "app-ibm-heap-dump-analyser",
  templateUrl: "./ibm-heap-dump-analyser.component.html",
  styleUrls: ["./ibm-heap-dump-analyser.component.scss"]
})

export class IbmHeapDumpAnalyserComponent implements OnInit {

  hostUrl ="";
  id: any;
  heapDumpView:boolean=true;
  advanceDataView:boolean=false;
  HeapData: any;
  ibmAvdInfoData:any;
  ibmDataView: boolean= true;
  ibmAdvanceUrl:any;
  showDownLoadReportIcon: boolean= true;
  isHelp: boolean= false;
  ibmHeapPathUrl: any;
  phdArgs:any;
  headerInfo: string = "Header Info: ";
  ibmHeapData: any[];
  dataKey:any[];
  downloadInfo:String ="";
  detailInstructions:String="For more detailed Analysis of heap dump use eclipse after installing MAT and DTFJ tools";
  popUpMsg:String="Type help in command box to get a list of possible commands";
  colsIBM: any[] = [
    { field: 'classname', header: 'Class Name'},
    { field: 'count', header: 'Count'},
    { field: 'size', header: 'Size (Bytes)'},

 ];
  

  constructor(public _ddrData: DdrDataModelService,private http: HttpClient,
    private ddrRequest: DDRRequestService,public commonService: CommonServices,
 private breadcrumbService :DdrBreadcrumbService) {

  }

  ngOnInit() {
    this.breadcrumbService.itemBreadcrums = [];
    this.breadcrumbService.isFromHome = true;
    //this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.IBM_HEAP_ANALYZER;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.IBM_HEAP_ANALYZER);
  //  this.heapDumpView =true;

    this.id = this.commonService.getData();
    
    this.dataKey=[];
    this.HeapData = this._ddrData.ibmAnalyzerData
    let keys = Object.keys(this.HeapData);
    for ( let i=0; i < keys.length; i++) {
      let paramKey = keys[i];
      let paramValue = this.HeapData[keys[i]];
      if(paramKey =="Heap Objects Information"){
        this.ibmHeapData =paramValue;
      }
      else{
        this.dataKey.push({"key":paramKey, "value":paramValue});
        this.downloadInfo += "\n"+paramKey + " : " + paramValue;
      }
      // console.log("paramKey>>>>>>>",paramKey,"=paramValue>>>",paramValue);
      }

    console.log("this._ddrData.ibmAnalyzerData",this._ddrData.ibmAnalyzerData);
    //console.log("this.downloadInfo>>>>>>>",this.downloadInfo);
    //console.log("this.dataKey>>>>>>>",this.dataKey);
    this.ibmHeapPathUrl = this._ddrData.ibmAnalyzerUrl;
    console.log("this.ibmHeapPathUrl>>>>>>>",this.ibmHeapPathUrl);
    this.getHeaderInfoAndUrl();
   // http://10.10.40.3:8001/netdiagnostics/v1/cavisson/netdiagnostics/ddr/analyzeHeap?testRun=1250&filePath=/home/cavisson/Controller_nitin/logs/TR1250/20191021201213/server_logs/heap_dumps/tier_14/10.10.50.14/cmon&fileName=Jetty_localhost_Instance_2020_05_11_03_14_17.hprof
    // if(this.ibmHeapPathUrl) {
    //   var urlInfo = this.ibmHeapPathUrl.split("&");
    //   for (var i = 0; i < urlInfo.length; i++) {
    //     if(urlInfo[i].startsWith("file")) 
    //     this.headerInfo += urlInfo[i]+" ,";
        
    //     }
    // }else{
    //   this.headerInfo ="Header Info: ";
    //   console.log("this._ddrData.ibmHeapFileName",this._ddrData.ibmHeapFileName);
    //   var ibmFileName = this._ddrData.ibmHeapFileName;
    //   var uploadedFilePath = sessionStorage.getItem('workPath') + "/logs/heapDump";
    //   this.headerInfo += "filePath="+ uploadedFilePath+ ",fileName="+ibmFileName;
    //   var customUrl = decodeURIComponent(this._ddrData.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
    //   customUrl += '/v1/cavisson/netdiagnostics/ddr/analyzeHeap?testRun='+this.id.testRun+'&filePath='+ uploadedFilePath +'&fileName='+ibmFileName ;
    //   this.ibmHeapPathUrl = customUrl;
      
    //   console.log("this.headerInfo>>>>>>>",this.headerInfo);
    //   console.log("customUrl>>>>>>>",customUrl);
    // }

  }


  sendIbmAnalyserReq(){
    this.getHeaderInfoAndUrl();
    if(this.phdArgs) {
      this.ibmHeapPathUrl += "&phdargs=" + this.phdArgs;
  }
  console.log("this.ibmHeapPathUrl",this.ibmHeapPathUrl);
    this.http.get(this.ibmHeapPathUrl).subscribe( (data:any) => {
      this.ibmAnalyzeHeapPath(data);
  },
  error => {
    console.log("error",error);
  });
  }

  ibmAnalyzeHeapPath(data){
    if(data) {
      this.advanceDataView =true;
     this.ibmAvdInfoData= data[this.phdArgs];
     this.ibmHeapPathUrl = this._ddrData.ibmAnalyzerUrl;
    }
  }


  showData(){
    if(this.ibmAvdInfoData) {
        return this.ibmAvdInfoData;
    }
  }
     /**Simple formater for tolocalstring */
     formatter(value) {
      if (!isNaN(value)) {
          return (Number(value)).toLocaleString();

      }
      else
          return value;
  }


  getHeaderInfoAndUrl(){
    if(this.ibmHeapPathUrl) {
      if(this.headerInfo.indexOf("filePath") == -1 ){
      var urlInfo = this.ibmHeapPathUrl.split("&");
      for (var i = 0; i < urlInfo.length; i++) {
        if(urlInfo[i].startsWith("file")) 
        this.headerInfo += urlInfo[i]+" ,";
        }
      }
    }else{
      this.headerInfo ="Header Info: ";
      console.log("this._ddrData.ibmHeapFileName",this._ddrData.ibmHeapFileName);
      var ibmFileName = this._ddrData.ibmHeapFileName;
      var uploadedFilePath = sessionStorage.getItem('workPath') + "/logs/heapDump";
      this.headerInfo += "filePath="+ uploadedFilePath+ ",fileName="+ibmFileName;
      var customUrl = decodeURIComponent(this._ddrData.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
      customUrl += '/v1/cavisson/netdiagnostics/ddr/analyzeHeap?testRun='+this.id.testRun+'&filePath='+ uploadedFilePath +'&fileName='+ibmFileName ;
      this.ibmHeapPathUrl = customUrl;
      
      console.log("this.headerInfo>>>>>>>",this.headerInfo);
      console.log("customUrl>>>>>>>",customUrl);
    }
    if (this.headerInfo.endsWith(',')) {
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    }
  }
/**Help Popup fro Run Command */
  openHelpPopup(){
    console.log("we are Herei  popup>>>>>>>>>>>")
    this.isHelp =true;
  }

  /**Download whole data in any format */
    downloadReports(reports: string) {
      console.log("reports>>>>>>>>>>>",reports)
      let renameArray;
      let colOrder;
      let strTitle = "IBM Heap Analysis Report"
      let filterCriteria = this.headerInfo + "\n" +  this.downloadInfo.toString();
      let downloadData = JSON.parse(JSON.stringify(this.ibmHeapData));
      renameArray = {
        'classname': 'Class Name', 'count': 'Count', 'size': 'Size (Bytes)'
      };
      colOrder = [
        'Class Name', 'Count', 'Size (Bytes)'
      ];
      let downloadObj: Object = {
        downloadType: reports,
        varFilterCriteria: filterCriteria,
        strSrcFileName: 'IbmHeapDumpAnalyser',
        strRptTitle: strTitle,
        renameArray: JSON.stringify(renameArray),
        colOrder: colOrder.toString(),
        jsonData: JSON.stringify(downloadData)
      };
          let downloadFileUrl = '';
          if (this.commonService.protocol && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
              if (this.commonService.protocol.endsWith("://"))
                  downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
              else
                  downloadFileUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
          }
          else
              downloadFileUrl = decodeURIComponent(this._ddrData.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
          downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
          if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
              this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (
                  this.openDownloadReports(res)
              ));
          }
          else
          this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
                  (this.openDownloadReports(res)));
      }
  
      /**To open Download file from backend to browser */
      openDownloadReports(res) {
          console.log('file name generate ===', res);
          let downloadFileUrl = '';
          if (this.commonService.protocol !=undefined && this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
              downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
              if(downloadFileUrl.indexOf("://")==-1)
              downloadFileUrl = this.commonService.protocol+"://" + this.commonService.host + ':' + this.commonService.port;
              } else {
              downloadFileUrl =  decodeURIComponent(this._ddrData.getHostUrl(true));
          }
         
          downloadFileUrl += '/common/' + res;
          window.open(downloadFileUrl);
      }
  
}
