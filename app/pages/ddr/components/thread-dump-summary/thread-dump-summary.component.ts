import { Component, OnInit,Input, OnChanges, SimpleChange  } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { CavConfigService } from "../../../../main/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../../main/services/cav-top-panel-navigation.service";
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { CommonServices } from '../../services/common.services';
import { Observable } from 'rxjs/Rx';
import { StatisticsThreadDump,SummarizedThreadDump } from '../../interfaces/take-thread-dump-data-info';
import {TreeNode} from 'primeng/primeng';
import { DDRRequestService } from '../../services/ddr-request.service';

@Component({
  selector: 'app-thread-dump-summary',
  templateUrl: './thread-dump-summary.component.html',
  styleUrls: ['./thread-dump-summary.component.css']
})
export class ThreadDumpSummaryComponent implements OnInit, OnChanges {
  @Input('dcInfo') dcInfo;
@Input('value') threadDumpSummaryInfo;
 hotStackArr:Object[] = [];
  id: any;
  loading: boolean = false;
  threadDumpInfo:string[] = [];
  statisticsTDData = [];
  threadDumpSTInfo: any;
  stData1: any;
  stdata2: any;
  threadData: any;
  threadDumpInfoObject:Object[]=[];
  hotstackTree: TreeNode[] = [];
  arrKey = [];
  stackArr = [];
  headerArr = [];
  grpTableHeaderList: any;
  deadlockArr:Object[] = [];
  deadlockTree: TreeNode[] = [];
  totalThreadInfo:Array<SummarizedThreadDump> = [];
  hotstackThreadCount:number=0;
  showOption:number=0;
  threadDumpTimes:string="";
  threadDumpContent:string;
  hotstackTopFrames:number=3;
  filePathsInfo:string;
  showThreadDetails:number=1;
  showHotstack:number=1;
  showDeadlock:number=1;
  isSummary:boolean=false;
  constructor(private commonServices: CommonServices, private _cavConfigService: CavConfigService,
    private _navService: CavTopPanelNavigationService, private ddrRequest:DDRRequestService) { 
      this.id = this.commonServices.getData();
    }

  ngOnInit() {
     
   // console.log("on init case",this.threadDumpSummaryInfo);
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.isSummary=false;
    let filePaths="";
    let fileArr = [];
    this.loading=true;
    this.threadDumpTimes="";
    let threadDumpInfo=[];
    this.hotstackTopFrames=3;
   this.threadDumpSummaryInfo.forEach((val,index)=>{
     filePaths +=val.filePath+"|";
     fileArr.push(val.filePath);
     let filePathStr=val.filePath;
     if(index <this.threadDumpSummaryInfo.length-1)
     filePathStr+=",";
     threadDumpInfo.push(filePathStr);
     this.threadDumpTimes += val.timeStamp+",";
   });
   this.threadDumpInfo=threadDumpInfo;
   this.threadDumpTimes=this.threadDumpTimes.substring(0,this.threadDumpTimes.length -1);

   filePaths= filePaths.substring(0, filePaths.length -1);
   this.filePathsInfo=filePaths;
  this.getThreadDumpSummaryInfo(filePaths);
  this.getStatisticsTDdata(fileArr);
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
    //  console.log('changes in dat----------', to);
    }
    
  }
  getThreadDumpSummaryInfo(filePaths:string)
  {
   //  console.log(filePaths);
     let fileObj={
       filePaths:filePaths,
       topFrames:this.hotstackTopFrames
     };
     let summarizedTDUrl
     let ipWithProd=this.getHostUrl() ;
     if( this.dcInfo && this._cavConfigService.getActiveDC() == "ALL")
     {
     ipWithProd=this.getURLbasedOnDC(this.threadDumpSummaryInfo[0].dcName)
     if(ipWithProd.includes("/node")) //not necessary though.
     ipWithProd = ipWithProd.replace("/node","/tomcat");
     summarizedTDUrl=  ipWithProd + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/getSummaryOfThreadDumps";
     this.ddrRequest.getDataUsingPost(summarizedTDUrl,JSON.stringify(fileObj)).subscribe(res => {(this.openSummaryThreadDump(res))},
    error => {
    this.loading = false;
      console.log("getSummary of THread Dump Request is getting failed");
    });
     }
     else
     {
       summarizedTDUrl = ipWithProd + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/getSummaryOfThreadDumps";
       if (ipWithProd.includes("/tomcat")) {
        this.ddrRequest.getDataUsingPost(summarizedTDUrl, fileObj).subscribe(res => { (this.openSummaryThreadDump(res)) },
           error => {
             this.loading = false;
             console.log("getSummary of THread Dump Request is getting failed");
           });
       }
       else {
        this.ddrRequest.getDataUsingPost(summarizedTDUrl, JSON.stringify(fileObj)).subscribe(res => { (this.openSummaryThreadDump(res)) },
           error => {
             this.loading = false;
             console.log("getSummary of THread Dump Request is getting failed");
           });
       }
     }
  
    }
   /*Method to get DC IP PORT */
   getURLbasedOnDC(dcName,dcInfo?) {
     return location.protocol + "//" + location.host + "/tomcat/" + dcName;
    // let dcinfo;
    // if(dcInfo) 
    //   dcinfo = dcInfo;
    // else
    //   dcinfo = this.dcInfo;

    // let dcObject = dcinfo.find((dcObj) => { return dcObj.dc == dcName; });
    // // this.dcTestRun = dcObject.testRun;
    // return dcObject.protocol + "://" +dcObject.ip+":"+dcObject.port;
  }
  openSummaryThreadDump(data:any)
  {
     this.loading=false;
   //  this.totalThreadInfo=data.totalThreads;
    this.convertHotStackMapToArr(data.summarizedHotStack);
    this.createHotstackTree();
    this.convertDeadlockMapToArr(data.summarizedDeadlock);
    this.createDeadlockTree();
  }
  convertDeadlockMapToArr(deadlockMap:Object)
  {
    let mainArr=[];
    let arr=Object.keys(deadlockMap);
    arr.forEach((val,index)=>{
     // console.log(val);
      let deadlockArr=deadlockMap[val];
      var obj:Object={};
      obj['deadlockInfo']=deadlockArr;
      mainArr.push(obj);
    });
    this.deadlockArr=mainArr;
  }
  showDeadocks()
  {
   /* console.log("in deadlock case");
    if(this.disableDeadlock)
    this.disableDeadlock=false;
    else
    this.disableDeadlock=true;*/
    if(this.showDeadlock == 1)
    this.showDeadlock =0;
    else
    this.showDeadlock=1;
  }
  showStatistics()
  {
    if(this.showOption ==5)
    this.showOption=0;
    else
    this.showOption =5;
  }
  showAllThreds()
  { 
    if(this.showThreadDetails ==0)
    this.showThreadDetails=1;
    else
    this.showThreadDetails =0;
  }
  createDeadlockTree()
  {
     let deadlockTree=[];
    this.deadlockArr.forEach((val,index)=>{
        var obj:Object={};
        let threadCount=index;
    obj['label']="Deadlock"+(++threadCount)+" [Thread :"+val['deadlockInfo'].length+"]";
        var childrenArr=[];
        var childrenObj:Object={};
        childrenObj['label']=index;
        childrenObj['type']='deadlock';
        childrenArr.push(childrenObj);
         obj['children']=childrenArr;
        deadlockTree.push(obj);
    });
    this.deadlockTree=deadlockTree;
  }
  createHotstackTree()
  {
    let hotstackTree=[];
    this.hotStackArr.forEach((val,index)=>{
        var obj:Object={};
        let threadCount=index;
    obj['label']="Hotstack"+(++threadCount)+" [Threads :"+val['y']+"]";
        var childrenArr=[];
        var childrenObj:Object={};
        childrenObj['label']=index;
        childrenObj['type']='hotstack';
        childrenArr.push(childrenObj);
         obj['children']=childrenArr;
        hotstackTree.push(obj);
    });
    this.hotstackTree=hotstackTree;
  }
 
convertHotStackMapToArr(hotStackMap:any)
{
   let hotStackArr = []
   let mainArr=[];
   this.hotstackThreadCount=0;
    let arr = Object.keys(hotStackMap);
    arr.forEach((val, index) => {
      let summaryTDInfo = hotStackMap[val];
    
      if (summaryTDInfo['aggregateCount'] > 1)
      {
        hotStackArr.push({ "name": val, "y":summaryTDInfo['summarizedTD'].length });
        var threadDumpInfoArr=[];
           summaryTDInfo['summarizedTD'].forEach((val1,index1)=>{
             threadDumpInfoArr.push({ "threadId": val1["threadId"], "threadName": val1["threadName"], "priority": val1["priority"], "threadState": val1["threadState"], "nativeId": val1["nativeId"], "stackTrace": val1["stackTrace"] });
           });
           this.hotstackThreadCount +=threadDumpInfoArr.length;
          let obj:Object={};
                obj['hotstack']=val;
                obj['threadDumpInfo']=threadDumpInfoArr;
            mainArr.push(obj);
      }
    });
    this.threadDumpInfoObject=mainArr;
    this.hotStackArr=hotStackArr;
  
}
  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName;
    if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
      hostDcName = this._cavConfigService.getINSPrefix();
    else
      hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

    if (hostDcName.length > 0) {
      sessionStorage.removeItem("hostDcName");
      sessionStorage.setItem("hostDcName", hostDcName);
    }
    else
      hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }
  showHotstacks()
  {
    if(this.showHotstack ==0)
    this.showHotstack =1;
    else
    this.showHotstack=0;
  }

getStatisticsTDdata(filepaths: any) {
    console.log('inside st data', filepaths);
    let arrData = [];
    let arrFile = [];
    console.log('main data', this.threadDumpSummaryInfo)
    // this.arrKey.push('threadName');
    if(filepaths.length >= 2) {
      for(let i = 0; i < this.threadDumpSummaryInfo.length; i++) {
        let fileTime = this.threadDumpSummaryInfo[i].timeStamp;
        let fileName = this.threadDumpSummaryInfo[i].filePath;
        fileName = fileName.substring(fileName.lastIndexOf('/')+1);
        this.headerArr.push(fileTime);
        arrData.push(fileTime);
        arrFile.push(fileName);
      }
      this.stackArr = arrFile;
      if(this.stackArr.length != 0) {
        for(let m = 0; m < this.stackArr.length; m++) {
          this.stackArr[m] = this.stackArr[m].replace(/_/g, '').replace(/\./, '');
          console.log('meeeee--->', this.stackArr[m])
        }
      }
      this.arrKey = arrData;
      if(this.arrKey.length != 0) {
        for(let m = 0; m < this.arrKey.length; m++) {
          this.arrKey[m] = this.arrKey[m].replace(/\//g, '').replace(/:/g, '').split(' ').join('');
          console.log('meeeee--->', this.arrKey[m])
        }
      }
      console.log('arrKey------->', this.arrKey, this.stackArr);
      console.log('file content--', arrData);
      if(arrData.length == 2) {
        this.stData1 = arrData[0];
        this.stdata2 = arrData[1];
      }
      let fileArray = filepaths.join();
      let forParseThreadDumpUrl
      let ipWithProd=this.getHostUrl() ;
      if( this.dcInfo && this._cavConfigService.getActiveDC() == "ALL")
      {
      ipWithProd=this.getURLbasedOnDC(this.threadDumpSummaryInfo[0].dcName);
      forParseThreadDumpUrl =  ipWithProd  + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/ThreadDumpStatistics?filePath=" + fileArray;
      }
      else
      forParseThreadDumpUrl = this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/ThreadDumpStatistics?filePath=" + fileArray;
      
      this.ddrRequest.getDataUsingGet(forParseThreadDumpUrl).subscribe(data => {
        this.doAssignValueParseSattisticsTD(data);
        this.createTotalThreadInfo(data);
      });
    }
  }
createTotalThreadInfo(data:Object)
{
  let totalThreadInfo=[];
  let statistics=Object.keys(data);
  statistics.forEach((val,index)=>{
        totalThreadInfo.push({"threadId":data[val]['threadId'],"threadName":data[val]['threadName'],"nativeId":data[val]['nativeId'],"threadCount":data[val]['threadStateList'].length});
  });
  totalThreadInfo.sort((val,val1)=> ((val['threadName'] < val1['threadName']) ? -1 : (val['threadName'] > val1['threadName']) ? 1 : 0));
  this.totalThreadInfo=totalThreadInfo;
  //alert("after total Thread info");
 // console.log(this.totalThreadInfo);
}
  doAssignValueParseSattisticsTD(data: any) {
    try {
      console.log('inside assign data', data);
      console.log(data);
      let stInfo = [];
      this.statisticsTDData = this.convertMaptoArr(data);
      this.statisticsTDData.sort((val,val1)=> ((val['threadName'] < val1['threadName']) ? -1 : (val['threadName'] > val1['threadName']) ? 1 : 0));
      this.grpTableHeaderList = [];
      console.log('length' , this.statisticsTDData.length, 'data->', this.statisticsTDData) ;  
      let colField = [];
      colField.push('threadName');
      for(let m = 0; m < this.arrKey.length; m++) {
        colField.push(this.arrKey[m]);
      }
      console.log('column fields------>', colField);
      let colHeader = [];
      colHeader.push('Thread Name');
      for(let k = 0; k < this.headerArr.length; k++) {
        colHeader.push(this.headerArr[k]);
      }
      console.log('column header-->', colHeader, this.headerArr);
      this.threadDumpSTInfo = stInfo;
      for(let key in colField) {
        this.grpTableHeaderList.push({ 'field': colField[key], 'header': colHeader[key], 'align': 'right', 'sortable': true})
      }
      let obj = {};
      console.log('columns with fields', this.grpTableHeaderList);
      for(let i = 0; i < this.statisticsTDData.length; i++) {
        for(let j = 0; j < colField.length; j++) {
          obj['threadId'] = this.statisticsTDData[i].threadId;
          obj['nativeId'] = this.statisticsTDData[i].nativeId;
          obj[colField[j]] = this.statisticsTDData[i][colField[j]];
          obj['ST'+colField[j]] = this.statisticsTDData[i]['ST'+colField[j]];
        }
        // console.log('Object------------>', obj);
        stInfo.push(obj);        
      }
      // console.log('jsn object->', stInfo);
      this.threadDumpSTInfo = stInfo;
      // this.statisticsThreadDumpData(this.threadDumpSTInfo[0], this.threadDumpSTInfo[0]);
      console.log('table data', this.threadDumpSTInfo);
      this.statisticsThreadDumpData(this.statisticsTDData[0], this.statisticsTDData[0].threadName);
    } catch (error) {
      
    }
  }

  convertMaptoArr(stmap: any) {
    let tableArr = [];
    let arr = Object.keys(stmap);
    arr.forEach((val, index) => {
      let stCount = stmap[val];
      let Obj = {};
        Obj['threadId'] = stCount.threadId
        Obj['threadName'] = stCount.threadName;
       if(stCount.nativeId === undefined || stCount.nativeId === null) {
          Obj['nativeId'] = '-';
                } else {
           Obj['nativeId'] = stCount.nativeId;
         }

        for(let j = 0; j < this.arrKey.length; j++) {
          if(stCount.threadStateList[j] === undefined || stCount.threadStateList[j] === null) {
            Obj[this.arrKey[j]] = '-';
          } else {
            Obj[this.arrKey[j]] = stCount.threadStateList[j];
          }
          
        }
        for(let k =0; k < this.stackArr.length; k++) {
          if(stCount.stackTraceList[k] === undefined || stCount.stackTraceList[k] === null) {
            Obj['ST'+this.arrKey[k]] = '-';
          } else {
            Obj['ST'+this.arrKey[k]] = stCount.stackTraceList[k];
          }
          
        }
        tableArr.push(Obj);
        
    });
   // console.log('Main Array List------->', tableArr);
    return tableArr;
  }

  statisticsThreadDumpData(data: any, field: any) {
    console.log('stack data---', data);
    console.log('feild---', data[field]);
      this.isSummary=true;
      this.threadData = 'Thread Name: '+ data.threadName +
      '\n Thread ID: ' + data.threadId +
      '\n Native ID: ' + data.nativeId +
      '\n Thread State: '+ data[field] +
      '\n Stack Trace: '+ data['ST'+field];
    
  }
  showFiles(filePath:string)
  {
    this.showOption=4;
    let sunstringFilePath ="";
    if(filePath.indexOf(",") != -1)
     sunstringFilePath= filePath.substring(filePath.indexOf("logs"), filePath.length-1);
     else
      sunstringFilePath= filePath.substring(filePath.indexOf("logs"), filePath.length);
    let ipWithProd = this.getHostUrl() + '/' + this.id.product;
    let downloadfilPath = ipWithProd.replace("/netstorm", "").replace("/netdiagnostics", "") + "/" + sunstringFilePath;
    // console.log('downloadfilepath', downloadfilPath)
    this.ddrRequest.getDataInStringUsingGet(downloadfilPath).subscribe(data => (this.assignThreadDump(data)));
  }

  assignThreadDump(data: string) {
    this.threadDumpContent = data;
  }
  getTopFramedHotstackForSummary()
  {
  let fileObj:Object={
    filePaths:this.filePathsInfo,
    topFrames:this.hotstackTopFrames
  };
   let summarizedTDUrl= this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/getSummaryOfThreadDumps";
   this.ddrRequest.getDataUsingPost(summarizedTDUrl,JSON.stringify(fileObj)).subscribe(res =>{
     let data = <any> res;
          //  this.totalThreadInfo=data.totalThreads;
    this.convertHotStackMapToArr(data.summarizedHotStack);
    this.createHotstackTree();
     });
  }
}
