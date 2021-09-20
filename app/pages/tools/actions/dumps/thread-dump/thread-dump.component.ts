import { Component, OnInit ,OnDestroy, ViewEncapsulation, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { BlockUIModule, SelectItem, ConfirmationService, Message, MessageService } from 'primeng';
import { CommonServices } from '../service/common.services';
import { ThreadDumpInfo, ParsedThreadDumpInfo, InstanceInterface } from './interfaces/take-thread-dump-data-info';
import 'rxjs';
// import { ChartModule } from 'angular2-highcharts';
import { CavConfigService } from "../../../configuration/nd-config/services/cav-config.service";
// import { CavTopPanelNavigationService } from "services/cav-top-panel-navigation.service";
import { DdrDataModelService } from "../service/ddr-data-model.service";
// import {  } from 'primeng/primeng';
import { Subscription } from "rxjs";
import { DdrBreadcrumbService } from './service/ddr-breadcrumb.service';
import * as  CONSTANTS from './constants/breadcrumb.constants';
// import {ConfirmDialogModule,} from 'primeng/primeng';
// import "rxjs/add/operator/takeWhile";
import { DDRRequestService } from '../service/ddr-request.service';
import * as moment from 'moment';
import 'moment-timezone';
import { forkJoin } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { SessionService } from 'src/app/core/session/session.service';
@Component({
  selector: 'app-thread-dump',
  templateUrl: './thread-dump.component.html',
  styleUrls: ['./thread-dump.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThreadDumpComponent implements OnInit {
  dcinfo: any;
  isActive=false;
  agent_Type: string;
  processIDWithInstance: string;
  id: any;
  isDC=false;
  takeThreadDumpInfo: Array<ThreadDumpInfo>;
  viewThreadDumpObject = [{"dcName": "", "tierName": "", "serverName": "", "instanceName": "", "filePath": "", "timestamp": "", "endTime": "", 'partition': '', 'userName': '','agentType':'' }];
  tierWithServerObject: Object;
  serverWithAppObject: Object;
  selectedThreadDumpInfo: ThreadDumpInfo[] = [];
  threadDumpData: [{ "threadId": "", "threadName": "", "priority": "", "threadState": "", "nativeId": "", "stackTrace": "" }];
  property: string;
  analyseThreadDump: boolean = true;
  loading: boolean = false;
  threadDumpInfo: Array<ParsedThreadDumpInfo>;
  stacktrace: string;
  selectedThreadInfo: ParsedThreadDumpInfo;
  indiThreadInfo: string;
  takeTDHeader: string;
  analyzeHeader: string;
  threadTableHeader: string;
  showAllOption: boolean = false;
  tierList: SelectItem[];
  selectedTiers: string[];
  selectedServers: string[];
  serverList: SelectItem[];
  graphId: any;
  selectedApps: string[];
  appList: SelectItem[];
  // selectedCheckbox:string[];
  showBarChart: boolean;
  showDownLoadReportIcon: boolean = true;
  compareThreadDumpMethod: any;
  selectedIndexCompare: number = 0;
  disableComapre: boolean = true;
  comapreTheradDumpData = [];
  compareThreadDumpData1: string;
  compareThreadDumpData2: string;
  compareThreadDumpAnalysis: boolean = false;
  showThreadTable: boolean = true;
  commonMethods: string;
  displayPopUp: boolean = false;
  tiers: SelectItem[];
  dcNames:SelectItem[];
  selectedTierVal: string;
  selectedDcVal:string="";
  servers: SelectItem[];
  selectedServerVal: string;
  tierServerJsonList: Object;
  dcTierServerJsonList: Object;
  tierNameList: any[];
  instanceDetail: Object[] = [{ "pid": "", "appName": "", "arguments": "", "status": "" , "agentType":""}];
  instanceInfo: Array<InstanceInterface>;
  selectedInstanceInfo: InstanceInterface[] = [];
  selectedRowIndex: number = 0;
  showTable: boolean = false;
  showThreadDumpOption: boolean = false;
  ErrorResult: string;
  showMessageArr: any[];
  isNDCase: boolean = false;
  msgObj: Object[] = [{"tier":"","server":"","instance":"","time":"", "pid": "", "status": "", "msg": "" }];
  showStatusDialog: boolean = false;
  disableMsg: boolean = true;
  value: any;
  analyseData: boolean = false;
  message: Message;
  reportHeader:string;
threadDumpSummaryInfo:ThreadDumpInfo[];
 isChecked: boolean = false;
  isCompressed:any;
  /** Thread Dump Message subscriber */
  threadDumpMsgSubscription: Subscription;
  summaryThreadDump:boolean=false;
errorStatus:string="";
 threadDumpAnalysis:boolean=true;
  threadDumpView:boolean=true;
  productKey: string;
  userName: string;
  //headerCheckBoxFlag: boolean = false;
  dcTabFlag:boolean=false;
  productName:string;
  screenHeight:any;
  TDTakencount:number=1;
  timeInterval:number=10;
  showTInterval:boolean=true;
  serverNameforTD:string;
  agentType:string='';
  asyncTDaken: Observable<Object>;
  alive: boolean = true;
  filterMatchMode="contains";
  dcData: any;
  dcCkeck:string="";
  dcTierData: any;
  dataNodeDc: any;
  dcTestRun: any;
  dcCkeckCount: number=0;
  vecModList: any={};
  graphInfo: any;
  str: any;
  mergeSelectedApp: any=[];
  mergeSelectedServer: any=[];
  mergeSelectedTier: any=[];
 strDate:Date;
  endDate:Date;
   strTimeInDateFormat : string ;
  endTimeInDateFormat : string ;
schduleStartTimeinMilii:number;
schduleEndTimeinMilii:number;
scheduleAction: SelectItem[];
stopAction:SelectItem[];
cancelAction:SelectItem[];
rescheduleAction:SelectItem[];
inprogressAction:SelectItem[];
completedAction:SelectItem[];
failedAction: SelectItem[];
scheduleTDInfo:any[]=[];
displayReschedulePopup:boolean=false;
scheduledInfo:Object={};
resumedAction:SelectItem[];
loadingDialog: boolean=false;
searchInputSize=203;
sideBarToggleSubs: Subscription;
disableSelectedRemove:boolean=true;
isCheckbox: boolean=true;
serverDateTime: string = new Date().toISOString();
defaultServerTime:Date;
  testRun: string;
  @ViewChild('dt') table: Table;


  constructor(private sessionService: SessionService, private commonServices: CommonServices, public _ddrData: DdrDataModelService,private breadcrumbService :DdrBreadcrumbService,private confirmationService: ConfirmationService
    ,private ddrRequest:DDRRequestService, private messageService: MessageService) {
    //  console.log("constructor case");
  }

  ngOnInit() {
    this.productName = this.sessionService.session.cctx.prodType
    this.userName = this.sessionService.session.cctx.u;
    this.productKey = this.sessionService.session.cctx.pk;
    this.testRun = this.sessionService.testRun.id;
    if(this.productName == 'NetDiagnostics')
        this.productName = 'netdiagnostics';
    this.loading = true;
    this.breadcrumbService.itemBreadcrums = [];
    this.screenHeight = Number(this.commonServices.screenHeight)-120;
    this.commonServices.isToLoadSideBar = false ;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.THREAD_DUMP);
    this.id = this.commonServices.getData();
    
    // this.sideBarToggleSubs = this._cavConfigService.$sideBarToggleObserv.subscribe((val)=>{
    //     if(val)
    //        this.searchInputSize=203;
    //     else
    //        this.searchInputSize=215;
    // });

  //  console.log('id of ngo i',this.id);
    //this.reportHeader = 'Thread Dump Analyzer- ' + this.id.testRun;
    
    this.selectedTiers=[];
    this.selectedServers=[];
    this.selectedApps=[];
    var graphVectorArr = [];

   // console.log('data for vector ',this.id.vecArrForGraph);
    //  this.productName=this.id.product;
    /* if(str == undefined && str.length != 0)
    {
      alert("in vector sessionstorage case");
      
      graphVectorArr = str.split(',');
      this._ddrData.vecArrForGraph = graphVectorArr;
    }*/
    //this.serverDateTime = new Date().toLocaleDateString();
    this.getServerTime();
    
    // this.str = this.id.vecArrForGraph;
    // this.graphInfo=this.str.split(',');
    
    if(this.str != "" && this.str  != undefined)
    {
       this.DcTSI();
    }
    
    else
    {
          if(this.id.tierName != undefined)
            {  
              let tierArr=[];
              tierArr=this.id.tierName.split(",");
              this.selectedTiers=tierArr;
            }

          if(this.id.serverName != undefined)
            {
             let serverArr=[];
             serverArr=this.id.serverName.split(",");
            this.selectedServers=serverArr; 
            }

        if(this.id.appName != undefined)
          {
            let appArr=[];
             appArr=this.id.appName.split(",");
            this.selectedApps=appArr; 
          }
       //   this.getViewThreadDump().subscribe(data => (this.createThreadDump(data)));
    }
   
    this.productKey= sessionStorage.getItem('productKey');
    // this.userName = sessionStorage.getItem('userName');
    this.mergeTwoRequest();
    

    console.log("Data -===============> ",this.productName, this.sessionService.session);
    this.threadDumpMsgSubscription = this._ddrData.messageProvider$.subscribe(data => this.messageService.add(data));
  }
  splitVectorArray(graphInfo): any {
    let graphId = graphInfo.substring(graphInfo.indexOf('-') + 1);
        let vectorName = graphId.substring(graphId.indexOf('-') + 1);
        let vectorArr = [];
        vectorArr = vectorName.split(">");
        return vectorArr;
  }
 
 DcTSI(){
  
      for(let i=0; i<this.graphInfo.length; i++)
      {
        let vectorArr =this.splitVectorArray(this.graphInfo[i]);
        console.log("vectorArr",vectorArr);
         console.log("vectorArr",vectorArr);
        if (sessionStorage.getItem("isMultiDCMode") == "true") {
          if (this.selectedTiers.indexOf(vectorArr[1]) == -1)
          this.selectedTiers.push(vectorArr[1]);
          if (this.selectedServers.indexOf(vectorArr[2]) == -1)
          this.selectedServers.push(vectorArr[2]);
          if (this.selectedApps.indexOf(vectorArr[3]) == -1)
          this.selectedApps.push(vectorArr[3]);

        }
        else {
          if (this.selectedTiers.indexOf(vectorArr[0]) == -1)
          this.selectedTiers.push(vectorArr[0]);
          if (this.selectedServers.indexOf(vectorArr[1]) == -1)
            this.selectedServers.push(vectorArr[1]);
          if (this.selectedApps.indexOf(vectorArr[2]) == -1)
            this.selectedApps.push(vectorArr[2]);

        }
    }
      this.setSessionItems();
      // this.getViewThreadDump().subscribe(data => (this.createThreadDump(data)));
  
  }
  setSessionItems()
   {
    sessionStorage.setItem("tierName",this.selectedTiers.toString());
    sessionStorage.setItem("serverName",this.selectedServers.toString());
     sessionStorage.setItem("appName", this.selectedApps.toString());

  }


  ngOnDestroy() {

    if (this.threadDumpMsgSubscription !== null && this.threadDumpMsgSubscription !== undefined) {
      this.threadDumpMsgSubscription.unsubscribe();
    }

    if(this.sideBarToggleSubs)
       this.sideBarToggleSubs.unsubscribe();

    //clearInterval(this.takedump);
    this.alive=false;
    
  }
  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName="";
    // if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSAggrPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    // hostDcName = window.location.protocol + '//' + window.location.host;
    if (this.sessionService.preSession.multiDc === true) {
      hostDcName = this._ddrData.getHostUrl() + "/node/ALL"
      console.log('*************hostDcName =**********', hostDcName);
    } else {
      hostDcName = this._ddrData.getHostUrl();
    }
    return hostDcName;
  }
  /*Method to get DC IP PORT */
  getURLbasedOnDC(dcName,dcInfo?) {
    let dcinfo;
    if(dcInfo) 
      dcinfo = dcInfo;
    else
      dcinfo = this.dcinfo;
   
    let dcObject = dcinfo.find((dcObj) => { return dcObj.dc == dcName; });
    this.dcTestRun = dcObject.testRun;
    if(dcName)
    return location.protocol + "//" + location.host + "/tomcat/" + dcName;
   else
    return location.protocol + "//" + location.host;
  }
  
  getViewThreadDump() {
   /* if(this.id.tierName != undefined && this.selectedTiers.length ==0)
		 alert("Please select Tier(s)");

    if(this.id.serverName != undefined && this.selectedServers.length == 0)
		 alert("Please select Server(s)");
    if(this.id.appName != undefined  && this.selectedApps.length == 0)
		 alert("Please select Instance(s)");*/
	
//	if (this.selectedTiers[0] != "-- Select Tier --" && this.selectedServers[0] != "-- Select Server --" && this.selectedApps[0] != "-- Select Instance --")
    console.log("PRODUCT NAME=============> ",  this.productName);
    let view_thread_dump_url
    console.log("&tierName=", this.selectedTiers, "&serverName=", this.selectedServers, "&instanceName=", this.selectedApps)
    view_thread_dump_url =  this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/viewThreadDump?testRun=" + this.testRun + "&tierName=" + this.selectedTiers + "&serverName=" + this.selectedServers + "&instanceName=" + this.selectedApps + "&startTime=" + this.id.strStartTime + "&endTime=" + this.id.strEndTime;

    return this.ddrRequest.getDataUsingGet(view_thread_dump_url);
//.subscribe(data => (this.createThreadDump(data)));
  }
  getTierServerAppInfo()
  { 
    console.log('this.selected tiers',this.selectedTiers,JSON.stringify(this.tierWithServerObject));
   
    this.tierList = [];
      if(this.tierWithServerObject != undefined)
      {
    let arr=Object.keys(this.tierWithServerObject);
    arr.forEach((val,index)=>{
      this.tierList.push({ label: val, value: val });
    });
      }
     
    this.serverList = []; 
     if(this.selectedTiers.length == 0 && this.tierWithServerObject != undefined)
      {// show full values;
     this.selectedTiers=Object.keys(this.tierWithServerObject);
     sessionStorage.setItem("tierName",this.selectedTiers.toString());
      }  
     
    for(let k=0; k<this.tierList.length; k++)
    {
     if(this.tierWithServerObject != undefined && this.tierWithServerObject[this.tierList[k]['value']] != undefined)
     {
      this.tierWithServerObject[this.tierList[k]['value']].forEach((val,index)=>{
        if(this.serverList.findIndex(x=>x.value ==val)== -1)
          this.serverList.push({ label: val, value: val }); 
        });
     }
    }
        
    this.appList = []; 
    if(this.selectedServers.length==0)
          {
          this.serverList.forEach((val,index)=>{
                 this.selectedServers.push(val['value'] );
           });
            sessionStorage.setItem("serverName",this.selectedServers.toString());
          }

    for(let i=0; i<this.tierList.length; i++)
    {
      for(let k=0; k<this.serverList.length; k++)
      {
        
          if(this.serverWithAppObject != undefined && this.serverWithAppObject[this.tierList[i]['value']+"_"+this.serverList[k]['value']] != undefined)
          {
              this.serverWithAppObject[this.tierList[i]['value']+"_"+this.serverList[k]['value']].forEach((val,index)=>{
             if(this.appList.findIndex(x=>x.value ==val)== -1)
                this.appList.push({ label: val, value: val });
              });
          }
        
      }	
    }
  
    if(this.selectedApps.length==0)
      {
         this.appList.forEach((val,index)=>{
                 this.selectedApps.push(val['value'] );
      });
          sessionStorage.setItem("appName",this.selectedApps.toString());
      }
   this.selectedTiers=this.getfiltererdSelectedList(this.tierList,this.selectedTiers);
   this.selectedServers=this.getfiltererdSelectedList(this.serverList,this.selectedServers);
   this.selectedApps=this.getfiltererdSelectedList(this.appList,this.selectedApps);
  }
  getfiltererdSelectedList(fullList,selectList)
  {
   // console.log("slect list value",fullList,"fullist value----",selectList);
    let filteredSelectedlist=[];
       for(let i=0;i<selectList.length;i++)
       {
       //  console.log(fullList.findIndex((x)=>x.value==selectList[i]));
         if(fullList.findIndex((x)=>x.value==selectList[i]) != -1)
         filteredSelectedlist.push(selectList[i]);
       }
     //  console.log(filteredSelectedlist);
    return filteredSelectedlist;
  }
  getInstance()
  {
	this.appList = [];
  this.selectedApps =[];
	//this.appList.push({ label: "-- Select Instance --", value: "-- Select Instance --"});
  //this.selectedApps.push("-- Select Instance --");

  let tempAr= [];
  for(let i=0; i<this.selectedTiers.length; i++)
  {
    for(let k=0; k<this.selectedServers.length; k++)
    {
      let Instancekey = this.selectedTiers[i]+"_"+this.selectedServers[k] ; 
      if(this.serverWithAppObject[Instancekey] != undefined){
        this.serverWithAppObject[Instancekey].forEach((val,index)=>{
          if(tempAr.indexOf(val) == -1)
            tempAr.push(val);      
        });
      }
    }	
  }

  for(let k=0; k<tempAr.length; k++) {
       this.appList.push({ label: tempAr[k], value:tempAr[k]});
    }	
  }
  
  getServer()
  {
    this.selectedServers = [];
    this.selectedApps = [];
    this.serverList = [];
    //this.serverList.push({ label: "-- Select Server --", value:"-- Select Server --"});
    //this.selectedServers.push("-- Select Server --");
    //this.selectedApps.push("-- Select Instance --");

     let temp = [] ;
    for(let k=0; k<this.selectedTiers.length; k++)
    {
      try{
        //if(this.selectedTiers[k] != "-- Select Tier --")
        
          this.tierWithServerObject[this.selectedTiers[k]].forEach((val,index)=>{
            if(temp.indexOf(val) == -1)
              temp.push(val);  
	        });
        
      }
      catch(error)
      {
        console.log("error -- " , error);
      }
      
    }

    for(let k=0; k<temp.length; k++) {
       this.serverList.push({ label: temp[k], value:temp[k]});
    }
	
  }

  createThreadDump(data: any) {
    //  console.log(data);
    this.disableSelectedRemove = true;
    if(data.errorStatus != undefined)
    {
    this.loading=false;
    this.errorStatus=data.errorStatus;
    }
    if(data.viewThreadDump != undefined )
    {
      this.errorStatus="";
        if(data.viewThreadDump.length != 0 && data.viewThreadDump[0].dcName)
          this.isDC = true;
       
        else
        this.isDC = false;

     this.viewThreadDumpObject = data.viewThreadDump;
    }
    if(data.hasOwnProperty("dcInfo")){
      this.dcinfo = data.dcInfo;
    }
	this.tierWithServerObject = data.tierWithServer;
	this.serverWithAppObject = data.serverWithApp;
	this.getTierServerAppInfo();
    this.takeThreadDumpInfo = this.getViewThreadDumpInfo();
    this.takeTDHeader = "[Total :" + this.takeThreadDumpInfo.length + "]";
    this.loading = false;
    if (this.viewThreadDumpObject.length == 0){
      this.showDownLoadReportIcon = false;
      this.threadDumpView = false;
      this.threadDumpAnalysis = false;
      this.summaryThreadDump = false;
    }
      else{
        this.showDownLoadReportIcon=true;
      }
  }

  getViewThreadDumpInfo(): Array<ThreadDumpInfo> {
    let threadDumpInfo = [];

    for (let i = 0; i < this.viewThreadDumpObject.length; i++) {
      var obj
      if (this.isDC == true) {
        obj = { "dcName": this.viewThreadDumpObject[i]['dcName'], "tierName": this.viewThreadDumpObject[i]["tierName"], "serverName": this.viewThreadDumpObject[i]["serverName"], "instanceName": this.viewThreadDumpObject[i]["instanceName"], "timeStamp": this.viewThreadDumpObject[i]["timestamp"], "partition": this.viewThreadDumpObject[i]["partition"], 'userName': this.viewThreadDumpObject[i]['userName'], "filePath": this.viewThreadDumpObject[i]["filePath"], "userNote": this.viewThreadDumpObject[i]['userNote'], "pid": this.viewThreadDumpObject[i]['pid'], "startTime": this.viewThreadDumpObject[i]['startTime'], "endTime": this.viewThreadDumpObject[i]['endTime'], "index": this.viewThreadDumpObject[i]['index'], "agentType": this.viewThreadDumpObject[i]['agentType'].toLowerCase() };
      }
      else {
        obj = { "tierName": this.viewThreadDumpObject[i]["tierName"], "serverName": this.viewThreadDumpObject[i]["serverName"], "instanceName": this.viewThreadDumpObject[i]["instanceName"], "timeStamp": this.viewThreadDumpObject[i]["timestamp"], "partition": this.viewThreadDumpObject[i]["partition"], 'userName': this.viewThreadDumpObject[i]['userName'], "filePath": this.viewThreadDumpObject[i]["filePath"], "userNote": this.viewThreadDumpObject[i]['userNote'], "pid": this.viewThreadDumpObject[i]['pid'], "startTime": this.viewThreadDumpObject[i]['startTime'], "endTime": this.viewThreadDumpObject[i]['endTime'], "index": this.viewThreadDumpObject[i]['index'], "agentType": this.viewThreadDumpObject[i]['agentType'].toLowerCase() };
      }
      threadDumpInfo.push(obj);
      //  console.log('partition', 'user', this.viewThreadDumpObject[i]["partition"], this.viewThreadDumpObject[i]["userName"]);
  
      //  Request is going for two times 1.calling from below 2. On sort case (by default sorting on time bassis )
      
  /* if (i == 0) {
          this.showAnalysisThreadDump(obj,this.viewThreadDumpObject[this.viewThreadDumpObject.length -1]['agentType']); 
       }
       */
    }
    // console.log(threadDumpInfo);
    return threadDumpInfo;
  }
  
  // selecting all data options on header check box
  onHeaderCheckboxToggle(event: any) {
    console.log('all row data--------->', event)
    //this.headerCheckBoxFlag = true;
    this.disableSelectedRemove = false;
    let nodeAgentIdx = this.selectedThreadDumpInfo.findIndex(infoVal => (infoVal['agentType'] != undefined && infoVal['agentType'].toLowerCase() !== 'java'));
    if(event.checked && this.selectedThreadDumpInfo.length >= 2 && nodeAgentIdx == -1) {
      this.disableComapre = false;
    //  this.disableSelectedRemove = false;
    } else {
      this.disableComapre = true;
      this.summaryThreadDump = false;
      this.threadDumpAnalysis = false;
      this.compareThreadDumpAnalysis = false;
      this.threadDumpView = false;
      //this.disableSelectedRemove = true;
    }
  }

  // selecting rowdata on selection of checkbox
 onRowSelect(data: any) {
    //console.log('select data', data);
   /* this.selectedIndexCompare++;
    if (this.selectedIndexCompare >= 2) {
      this.disableComapre = false;
    } else {
      this.disableComapre = true;
      this.compareThreadDumpAnalysis = false;
    }*/
    //this.agentType = data.agentType;
    let index: number = this.selectedThreadDumpInfo.indexOf(data);
    if (index == -1) {
    this.selectedThreadDumpInfo.push(data);
    }
    console.log('selectd item', this.selectedThreadDumpInfo);

    let nodeAgentIdx = this.selectedThreadDumpInfo.findIndex(infoVal => infoVal['agentType'] != undefined &&infoVal['agentType'].toLowerCase() !== 'java' || infoVal['filePath'].endsWith("_procdump"));

    if(nodeAgentIdx != -1)
    {
      this.disableComapre = true;
      this.summaryThreadDump = false;
      this.threadDumpAnalysis = false;
      this.compareThreadDumpAnalysis = false;
      this.threadDumpView = false;
      if(this.selectedThreadDumpInfo.length >= 2){
        this.compareDcName(this.selectedThreadDumpInfo.length)
        this.disableSelectedRemove =false;
      }
    }
    else
    {
      if(this.selectedThreadDumpInfo.length >= 2){
        this.compareDcName(this.selectedThreadDumpInfo.length) 
        this.disableSelectedRemove =false;
      }
      else
      {
        this.disableComapre=true;
        this.compareThreadDumpAnalysis = false;
        this.threadDumpAnalysis = true;
        this.threadDumpView = true;
        this.disableSelectedRemove =true;
      }
    }
  }
  compareDcName(infoLength): any {
   let dcName =this.selectedThreadDumpInfo[0].dcName
    let checkSameDC=true;
   for(let i=1;i<infoLength;i++)
    {
     if(this.selectedThreadDumpInfo[i].dcName != dcName)
     {
       checkSameDC=false;    
       break;
     }
    }
   if(!checkSameDC){
     this.disableComapre=true;
     this.disableSelectedRemove =true;
   } else{
     this.disableComapre=false;
     this.disableSelectedRemove =false;
   }

  }
  // Unselecting rowData on unselecting checkbox
  onRowUnselect(data: any) {
    // console.log('unselect data->', data);
   /* this.selectedIndexCompare--;
    if (this.selectedIndexCompare >= 2) {
      this.disableComapre = false;
    } else {
      this.disableComapre = true;
      this.compareThreadDumpAnalysis = false;
      this.threadDumpAnalysis = true;
      this.threadDumpView = true;
    }*/
    //this.agentType = data.agentType;
    let index: number = this.selectedThreadDumpInfo.indexOf(data);
    if (index !== -1) {
      this.selectedThreadDumpInfo.splice(index, 1);
    }

    let nodeAgentIdx = this.selectedThreadDumpInfo.findIndex(infoVal => infoVal['agentType'] != undefined && infoVal['agentType'].toLowerCase() !== 'java' || infoVal['filePath'].endsWith("_procdump"));
   
     if(nodeAgentIdx != -1){
      this.disableComapre = true;
      this.summaryThreadDump = false;
      this.threadDumpAnalysis = false;
      this.compareThreadDumpAnalysis = false;
      this.threadDumpView = false;
      if(this.selectedThreadDumpInfo.length >= 2){
        this.compareDcName(this.selectedThreadDumpInfo.length)
        this.disableSelectedRemove =false;
      }
    }
    else
    {
      if(this.selectedThreadDumpInfo.length >=2){
        this.compareDcName(this.selectedThreadDumpInfo.length) 
        // this.disableComapre=false;
        this.disableSelectedRemove =false;
      }else{
        this.compareThreadDumpAnalysis = false;
        this.threadDumpAnalysis = true;
        this.threadDumpView = true;
        this.disableComapre=true;
        this.disableSelectedRemove =true;

        if(this.selectedThreadDumpInfo.length == 0)
        {
          this.threadDumpAnalysis = false;
          this.threadDumpView = false;
        }
      }
    }
    // console.log('after deletion', this.selectedThreadDumpInfo);
  }
  // Method to show compare ThreadDump content on button click
  compareThreadDump() {
    /*	if(this.headerCheckBoxFlag === true) {
      this.selectedThreadDumpInfo = this.takeThreadDumpInfo;
    }*/
    // console.log('length of data', this.selectedThreadDumpInfo.length);
    this.summaryThreadDump = false;
    if (this.selectedThreadDumpInfo.length >= 2) {
      this.threadDumpAnalysis = false;
      this.threadDumpView = false;
      this.compareThreadDumpAnalysis = true;
      //this.analyseThreadDump = false;
      this.commonServices.compareThreadDump = this.selectedThreadDumpInfo;
      // console.log('comp data-', this.commonServices.compareThreadDump)
      for (let i = 0; i < this.selectedThreadDumpInfo.length; i++) {
        let obj = this.selectedThreadDumpInfo[i];
        console.log('obj---', obj);
        let downloadfilPath;
        let filePath = obj.filePath;
        console.log('filepath', filePath);
        let sunstringFilePath = filePath.substring(filePath.indexOf("logs"), filePath.length);
        let ipWithProd = this.getHostUrl() + '/' + this.productName;
        if( this.dcinfo 
          // && this._cavConfigService.getActiveDC() 
          == "ALL" ) {
          ipWithProd = this.getURLbasedOnDC(this.selectedThreadDumpInfo[0].dcName) + '/' + this.id.product;
          if(ipWithProd.includes("/node"))
          ipWithProd = ipWithProd.replace("/node","/tomcat");
          downloadfilPath = ipWithProd.replace("/netstorm", "").replace("/netdiagnostics", "") + "/" + sunstringFilePath;
        
        }
        else
         downloadfilPath = ipWithProd.replace("/netstorm", "").replace("/netdiagnostics", "") + "/" + sunstringFilePath;
        console.log('downloadfilepath', downloadfilPath)
        this.ddrRequest.getDataInStringUsingGet(downloadfilPath).subscribe(data => (this.assigncompareThreadDump(data)));
      }
    }

  }
  // assigning Compre ThreadDump content 
  assigncompareThreadDump(data: any) {
    this.comapreTheradDumpData.push(data);
    if (this.comapreTheradDumpData.length === 2) {
      this.compareThreadDumpData1 = this.comapreTheradDumpData[0];
      this.compareThreadDumpData2 = this.comapreTheradDumpData[1];

    }

  }
getSummaryThreadDumps()
{
  console.log("slectedThreadDump Info ",this.selectedThreadDumpInfo);
  this.threadDumpAnalysis=false;
  this.threadDumpView=false;
  this.summaryThreadDump=true;
  this.compareThreadDumpAnalysis=false;
  this.analyseThreadDump=false;
  this.threadDumpSummaryInfo=JSON.parse(JSON.stringify(this.selectedThreadDumpInfo));
  console.log(this.threadDumpSummaryInfo);

}
  showAnalysisThreadDump(data: any,agentType?:string) {
    if(agentType)
       this.agentType = agentType;
    else
      this.agentType = data.agentType;  
    
    if((this.agentType != undefined) && this.agentType.toLowerCase() !== 'java') {
      this.summaryThreadDump = false;
      this.threadDumpAnalysis = false;
      this.compareThreadDumpAnalysis = false;
      this.disableComapre = true;
      this.selectedThreadDumpInfo = [];
      this.selectedThreadDumpInfo.push(data);
      this.threadDumpView = false; 
      this.property = undefined;
    }
    else if( !data.filePath.endsWith("_procdump")) {
      this.compareThreadDumpAnalysis = false;
      this.summaryThreadDump = false;
      this.disableComapre = true;
      this.threadDumpAnalysis = true;
      this.threadDumpView = true;
      this.selectedThreadDumpInfo = [];
      this.selectedThreadDumpInfo.push(data);
      this.value = data;
      this.analyseData = true;
      let filePath = this.value.filePath;
      if(filePath.lastIndexOf(".gz") != -1)
        filePath = filePath.substring(0,filePath.lastIndexOf(".gz"));
      let sunstringFilePath = filePath.substring(filePath.indexOf("logs"), filePath.length);
      let ipWithProd = "";
      if(data.dcName && sessionStorage.getItem("isMultiDCMode") == "true" 
      // && this._cavConfigService.getActiveDC() == "ALL"
      ){
      ipWithProd = this.getURLbasedOnDC(data.dcName) + '/' + this.id.product;        
      }
      else
      ipWithProd = this.getHostUrl() + '/' + this.productName;
      if(this.value.agentType != undefined && this.value.agentType.toLowerCase() === 'java'){
          let downloadfilPath = ipWithProd.replace("/netstorm", "").replace("/netdiagnostics", "") + "/" + sunstringFilePath;
      console.log('downloadfilepath', downloadfilPath)
      setTimeout(()=>{

        this.ddrRequest.getDataInStringUsingGet(downloadfilPath).subscribe(data => (this.assignThreadDump(data)));
      },2000);
      }
    }
    
  }

   assignThreadDump(data: string) {
    this.property = data;
  }

  takeThreadDump() {
    this.ErrorResult = "";
    this.displayPopUp = true;
    this.showTable = false;
    this.selectedServerVal = "";
    this.selectedTierVal = "";
    this.showThreadDumpOption = false;
    this.TDTakencount=1;
    this.timeInterval=10;
    this.showTInterval=true;
    this.strDate=null;
    this.endDate=null;
    //document.body.style.overflow ='hidden';
    //document.getElementById('divForScroll').style.overflow='hidden';
    // if (sessionStorage.isMultiDCMode && sessionStorage.ActiveDC == 'All')
    //   this.dcTabFlag = true;
    // else
    //   this.dcTabFlag = false;

    var url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=" + this.testRun;
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => (
    this.setTierValues(data)
    ));
  }

  assignTierData(){
    this.tierNameList = Object.keys(this.tierServerJsonList);
    /* On DC Change reset Tier server*/
    this.tiers = [];
    this.selectedTierVal ="";
    this.servers = [];
    this.selectedServerVal="";
    this.tiers.push({ label: "-- Select Tier --", value: null });
    for (var i = 0; i < this.tierNameList.length; i++) {
      this.tiers.push({ label: this.tierNameList[i], value: this.tierNameList[i] });
    }
  }

  selectDCName() {
    let keys = Object.keys(this.dcinfo);
    console.log("keys areee===>", keys);
    this.dcNames = [];
    // this.dcNames.push({ label: "-- Select DC --", value: null });
    this.selectedDcVal = this.dcinfo[keys[0]].dc;
    for (var i = 0; i < keys.length; i++) {
      this.dcNames.push({ label: this.dcinfo[keys[i]].dc, value: this.dcinfo[keys[i]].dc });
    }
    this.getDc(this.selectedDcVal);
  }

  getDc(currDc) {
    let tierKeys = Object.keys(this.dcTierServerJsonList);
    console.log("tierKeys are ---->", tierKeys , 'and length ', tierKeys.length);
    this.tierServerJsonList = {};
    let isFound = false;
    for (let i = 0; i < tierKeys.length; i++) 
    {
      console.log("dataNodeDc.tierData[tierKeys[i]].dcname--", this.dcTierServerJsonList[tierKeys[i]].dcname);
      console.log("this.selectedDcVal",currDc);
      
      if (this.dcTierServerJsonList[tierKeys[i]].dcname == currDc){
        this.tierServerJsonList = this.dcTierServerJsonList[tierKeys[i]].data;
        this.assignTierData();
        isFound = true;
        break;
      }
      else if(i == tierKeys.length-1 && !isFound )
      {
        this.assignTierData();
        alert("Topology doesn't exist for dc "+currDc);
        return;
      }
    }
    console.log("dcTierData", this.tierServerJsonList);
  }

  setTierValues(jsondata: any) {
    if(this.dcinfo || jsondata.dcInfo)
    {
      console.log("inside the req cond==>",this.dcinfo ,"  json data==>",jsondata.dcInfo);
      this.dcTierServerJsonList = jsondata.tierData;
      this.dcinfo=jsondata.dcInfo;
      this.selectDCName();
      // this.getDc(this.selectedDcVal);
    }
    else {
      this.tierServerJsonList = jsondata;
      this.assignTierData();
    }
  }

  getServerValue(selectedValue: any) {
    var serverNameList = [];
    this.servers = [];
    this.selectedServerVal = "";
 
    for (var i = 0; i < this.tierNameList.length; i++) {
      if (selectedValue == this.tierNameList[i]) {
        serverNameList.push(this.tierServerJsonList[this.tierNameList[i]]);
        //serverNameList = Object.keys(this.tierServerJsonList[this.tierNameList[i]]);        
      }
    }

    this.servers.push({ label: "-- Select Server --", value: null });
    for (var obj of serverNameList) {
      for(var str in obj){
        if(obj[str] == str)
        {
          this.servers.push({ label: str, value: str });
        }
        else
        {
          this.servers.push({ label: str+"("+obj[str]+")", value: str+"("+obj[str]+")" });
        }
      }
    }
     
    /*this.servers.push({ label: "-- Select Server --", value: null });
    for (var k = 0; k < serverNameList.length; k++) {
      this.servers.push({ label: serverNameList[k], value: serverNameList[k] });
    }*/
    //this.selectedServerVal = this.servers[0].value;
  }

  getJavaInstances() {
    this.loadingDialog = true;
    this.instanceInfo = [];
    this.selectedInstanceInfo = [];
    this.isNDCase = false;
    if(this.selectedServerVal.indexOf('(') != -1)
      this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
    else 
      this.serverNameforTD = this.selectedServerVal;

      let ipWithProd = this.getHostUrl();
      let testRun=this.id.testRun;
      if(this.dcinfo) {
        ipWithProd = this.getURLbasedOnDC(this.selectedDcVal);
	testRun= this.dcTestRun;
      }

    var url = ipWithProd + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getJavaInstances?server=" + this.serverNameforTD + "&testRun="+testRun;
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => {this.doAssignValues(data)},
    error => {
      this.loadingDialog = false;
      if (error.hasOwnProperty('message')) 
        this.commonServices.showError(error.message);
      });
  }

  getNDInstances() {
    this.loadingDialog = true;
    this.instanceInfo = [];
    this.selectedInstanceInfo = [];
    this.isNDCase = true;
    this.isChecked = false;

     if(this.selectedServerVal.indexOf('(') != -1)
      this.serverNameforTD = this.selectedServerVal.substring(0,this.selectedServerVal.indexOf('('));
    else 
      this.serverNameforTD = this.selectedServerVal;

      let ipWithProd = this.getHostUrl();
      if(this.dcinfo)
        ipWithProd = this.getURLbasedOnDC(this.selectedDcVal);
        
    var url =  ipWithProd + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/getNDInstances?server=" + this.serverNameforTD + "&tier=" + this.selectedTierVal;
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => {
      this.doAssignValues(data)
    },
    error => {
    this.loadingDialog = false;
    if (error.hasOwnProperty('message')) 
    this.commonServices.showError(error.message);
      console.log("getNDInstance Request is getting failed");
    });
  }

  doAssignValues(res: any) {
    //console.log("res --- ", res);
    this.showTable = true;
    this.showThreadDumpOption = true;
    this.instanceDetail = res.data;
    this.loadingDialog = false;
    this.getServerTime();
    //console.log("instance detail --- " , this.instanceDetail);

    if (this.instanceDetail && (this.instanceDetail.toString().startsWith("Unable to get instance") || this.instanceDetail.includes("error") || this.instanceDetail.includes("ERROR"))) {
      this.ErrorResult = this.instanceDetail.toString();
      this.showTable = false;
      this.showThreadDumpOption = false;
    }
    else {
      this.instanceInfo = this.getInstanceInfo();
      this.showTable = true;
      this.showThreadDumpOption = true;
    }
  }

  getInstanceInfo(): Array<InstanceInterface> {
    var instArr = [];
    for (var i = 0; i < this.instanceDetail.length; i++) {
      if(this.instanceDetail[i]["status"])
        this.instanceDetail[i]["status"]=this.instanceDetail[i]["status"].replace(",","");
      instArr[i] = { pid: this.instanceDetail[i]["pid"], appName: this.instanceDetail[i]["appName"], arguments: this.instanceDetail[i]["arguments"], status: this.instanceDetail[i]["status"], agentType:this.instanceDetail[i]["agentType"] };
    }

    return instArr;
  }

  onRowSelectData(selectedRowData: any) {
   // console.log("rowData ---- ", selectedRowData);
    this.selectedRowIndex++;
    let index: number = this.selectedInstanceInfo.indexOf(selectedRowData);//sometimes it adds to double times

    if (index == -1) {
    this.selectedInstanceInfo.push(selectedRowData);
    }
  }
  onRowUnselectData(unSelectedRowData: any) {
    this.selectedRowIndex--;
    let index: number = this.selectedInstanceInfo.indexOf(unSelectedRowData);
    if (index !== -1) {
      this.selectedInstanceInfo.splice(index, 1);
    }
    //console.log('after deletion --- ', this.selectedInstanceInfo);
  }
takeThreadDumpBasedOnCountAndTimeInterval()
{
  this.alive=true;
  this.showMessageArr = [];
   if( this.selectedInstanceInfo.length ==0)
   {
      alert("Please select atleast one process id to take thread dump.");
	     return;
    }
   if (isNaN(this.TDTakencount) || this.TDTakencount == undefined || Number(this.TDTakencount) == 0)
    {
      alert("Please enter valid Number");
      return;
    }
    else if ( (Number(this.timeInterval) > 1) && (isNaN(this.timeInterval) || this.timeInterval == undefined || Number(this.timeInterval) == 0 ))
    {
      alert("Please enter valid time Interval");
      return;
    }

    else
    {
      try {
           console.log('came here foer loader');
            if(this.isChecked )
         this.isCompressed = 1;
      else
        this.isCompressed = 0;
      
          this.takeProcessIdThreadDump(1,undefined,this.selectedInstanceInfo,this.serverNameforTD,this.selectedTierVal,this.isNDCase,this.isCompressed,undefined); // Take thread dump first time without delay.
         if(this.TDTakencount > 1)
          {
             this.asyncTDaken = new Observable(observer => {
                let timeInterval = this.timeInterval * 1000;
                let selectedInstanceInfo=this.selectedInstanceInfo;
                let selectedServer=this.serverNameforTD;
                let selectedTierVal=this.selectedTierVal;
                let isNDCase=this.isNDCase;
                let compressedMode=this.isCompressed;
                let threadDumpCount=this.TDTakencount;
               // alert(threadDumpCount);
            let takedump = setInterval(() => { observer.next({'threadDumpCount':threadDumpCount,'takeDumpInterval':takedump,'selectInstanceInfo':selectedInstanceInfo,'selectedServerVal':selectedServer,'selectedTierVal':selectedTierVal,'isNDCase':isNDCase,'isCompressedMode':compressedMode,'observer':observer}); //resending local varible as in case of taking parallel thread dump.
           }, timeInterval); // repeatedly execute query after specified time interval.
            this.loading = false;
             let Interval=(threadDumpCount*timeInterval)-timeInterval;//execute after thread dump process initiated. so multiply thread dump count * timeinterval
           setTimeout(() => {
            observer.complete();
            clearInterval(takedump);
           },(Interval))
             });
              let subscription = this.asyncTDaken.pipe(takeWhile(()=>this.alive)).subscribe(
          data =>{ this.takeProcessIdThreadDump(data['threadDumpCount'],data['takeDumpInterval'],data['selectInstanceInfo'],data['selectedServerVal'],data['selectedTierVal'],data['isNDCase'],data['isCompressedMode'],data['observer']);},
          error => { this.alive=false;},
          () =>{}
      );
         }
            this.displayPopUp = false;
        }
        catch (err) {
          console.log(err);
        }
       
    }
 //this._dialog.close();
}
enableTimeInterval()
{
  if(this.TDTakencount >1)
this.showTInterval=false;
else
this.showTInterval=true;
}
  takeProcessIdThreadDump(count,takeDump,selectedInstanceInfo,selectedServer,selectedTier,isNDCase,compressedMode,observer) {
  //this.timer+=1;
     this.isActive = true;
     this.processIDWithInstance = "";
     this.agent_Type="";
    if (selectedInstanceInfo.length > 0) {
      for (let k = 0; k < selectedInstanceInfo.length; k++) {
        this.agent_Type +=  "," + selectedInstanceInfo[k]["agentType"];
        this.processIDWithInstance += "," + selectedInstanceInfo[k]["pid"] + ":" + selectedInstanceInfo[k]["appName"];
      }

      if (this.processIDWithInstance.startsWith(",") && this.agent_Type.startsWith(","))
        this.processIDWithInstance = this.processIDWithInstance.substring(1);
        this.agent_Type = this.agent_Type.substring(1);

       let serverNameforTD=selectedServer;
      if(selectedServer.indexOf('(') != -1)
       serverNameforTD = selectedServer.substring(0,selectedServer.indexOf('('));
       let ipWithProd;
       let testRun;
       if(this.dcinfo){
         ipWithProd = this.getURLbasedOnDC(this.selectedDcVal);
         testRun = this.dcTestRun;
       }
       else{
         ipWithProd = this.getHostUrl();
         testRun = this.testRun;
       }
       
      var restUrl = ipWithProd + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/takeThreadDump?testRun=" + testRun + "&tierName=" + selectedTier + "&serverName=" + serverNameforTD + "&instanceName=NA&startTime=NA&endTime=NA&dumpType=1&heapFilePath=NA" + "&processIdWithInstance=" + this.processIDWithInstance + "&isFromND=" + isNDCase + "&loginUserName=" + this.userName + "&isCompressed=" + compressedMode+"&agentType="+this.agent_Type;
     let dataSubscription= this.ddrRequest.getDataUsingGet(restUrl).subscribe(data => (this.showNotification(data,count))
       ,
      () => {
        console.log('Dashboard Take Thread Dump request failed.');
            this.alive=false;
            if(takeDump != undefined)
            clearInterval(takeDump);
        /*unsubscribe/releasing resources.*/
        dataSubscription.unsubscribe();
     if(observer != undefined)
        observer.complete();
     else
        this.isActive = false;
        //return null;
      }
);
   
    }
     
     return ;

  }
  closeDialog(){
    document.body.style.overflow ='auto'
    document.getElementById('divForScroll').style.overflow='auto'
    this.displayPopUp = false;
  }

  resetViewTableData(){
    this.selectedTiers = [];
    this.selectedServers = [];
    this.selectedApps = [];
   // this.getViewThreadDump().subscribe(data => (this.createThreadDump(data)));
    this.mergeTwoRequest();
  }

  showNotification(result,count) {
    this.isActive = false;
    document.body.style.overflow ='auto';
    document.getElementById('divForScroll').style.overflow='auto';
    
    this.disableMsg = false;
    //this.showMessageArr = [];
    if (result == undefined)
	{
	  this._ddrData.setInLogger("","Thread Dump","Thread Dump Taken","Error in Taking Thread Dump");
          this._ddrData.errorMessage("Error in Taking Thread Dump");
	}
    console.log("result log is ", result);
    let resultArr = result[0].split("|");
    resultArr.forEach(element => {
      if (element.startsWith("Pass")) {
	if(element.split(":")[3])
         {
          console.log('element.split(":")[3] ',element.split(":")[3])
	  this._ddrData.setInLogger("","Thread Dump","Thread Dump Taken","Thread Dump Taken Successfully "+element.split(":")[2]);
          this._ddrData.multiSuccessMessage(element.split(":")[2]+":"+element.split(":")[3], element.split(":")[1]);
         }
        else
	 {
	  this._ddrData.setInLogger("","Thread Dump","Thread Dump Taken","Thread Dump Taken Successfully "+element.split(":")[2]);
          this._ddrData.multiSuccessMessage(element.split(":")[2], element.split(":")[1]);
         }
        this.showMessageArr.push(element);
      }
      if (element.startsWith("Fail")) {
        this.showMessageArr.push(element);
        let details = element.split(":")[1];
        let msg = "Error is coming during take thread dump";  // if second and third field is coming as undefined.
        if(element.split(":")[2] && element.split(":")[3])
          msg = element.split(":")[2] + element.split(":")[3];
        else if(element.split(":")[2])
          msg = element.split(":")[2];

	this._ddrData.setInLogger("","Thread Dump","Thread Dump Taken",msg);
        this._ddrData.multiErrorMessage(msg, details);
      }
    });
     sessionStorage.removeItem("tierName");
     sessionStorage.removeItem("serverName");
     sessionStorage.removeItem("appName");
    
   return this.getViewThreadDump().subscribe((res)=> this.createThreadDump(res));
  }


  resetData() {
    //this.instanceInfo = [];
    this.selectedInstanceInfo = [];
    this.servers = [];
    this.selectedServerVal="";

    if (this.dcinfo){
      this.tierNameList=[];
      this.selectedDcVal = this.dcinfo[0].dc;
      this.getDc(this.dcinfo[0].dc);
    }

    this.selectedTierVal = this.tiers[0].value;
    this.servers.push({ label: "", value: "" });
    this.ErrorResult = "";
    this.showTable = false;
    this.showThreadDumpOption = false;
    this.isChecked = false;
  }

  showMessage() {
    this.showStatusDialog = true;
    
    var msgArr = [];
    for (let j = 0; j < this.showMessageArr.length; j++) {
      let val = this.showMessageArr[j];
      console.log("mesg idd teie  ---",val)
      let statusVal = val.substring(0, val.indexOf(":"));
      let pId = val.substring(val.indexOf(":") + 1, val.lastIndexOf(":"));
      let mesg = val.substring(val.lastIndexOf(":") + 1, val.length);
      let repMesg = mesg.replace(new RegExp('//', 'g'), '/');
      let mainArray = repMesg.split("/");
      let tier=  mainArray[mainArray.length - 4];
      let server =  mainArray[mainArray.length - 3];
      let instance = mainArray[mainArray.length - 2];
      let forDate = mainArray[mainArray.length - 1].split("_");
      let time = forDate[2]+"/"+forDate[1]+"/"+forDate[0]+" "+forDate[3]+":"+forDate[4]+":"+forDate[5]
      msgArr.push({ "tier": tier,"server":server,"instance":instance,"time":time,"pid": pId, "status": statusVal, "msg": mesg });
    }

    //console.log("msgArr --- " + msgArr);
    this.msgObj = msgArr;

    //console.log("this.msgObj --- " , this.msgObj);
  }

  downloadReport(downloadType: string) {
    let threadDumpRenameArray;
    let threadDumpColorder;
    if(this.isDC) {
     threadDumpRenameArray = { "dcName": "DC", "tierName": "Tier", "serverName": "Server", "instanceName": "Instance", "timeStamp": "Time", "filePath": "File", 'userName': 'User' , "index": "Index", "userNote":"UserNote","agentType":"Agent"};
      threadDumpColorder = ["DC", "Tier", "Server", "Instance", "Time", "File", "User", "UserNote", "Agent"];
    }
    else
    {
      threadDumpRenameArray = { "tierName": "Tier", "serverName": "Server", "instanceName": "Instance", "timeStamp": "Time", "filePath": "File", 'userName': 'User' , "index": "Index", "userNote":"UserNote","agentType":"Agent"};
      threadDumpColorder = ["Tier", "Server", "Instance", "Time", "File", "User", "UserNote", "Agent"];

    }



    this.takeThreadDumpInfo.forEach((val, index) => {
      delete val['pid'];
      delete val['partition'];
      delete val['startTime'];
      delete val['endTime'];
      delete val['_$visited'];
      delete val['index'];
    });
    // console.log("threaddump data is=========== ", JSON.stringify(this.takeThreadDumpInfo));
    let downloadObj: Object;
      downloadObj = {
      downloadType: downloadType,
      strSrcFileName: "ThreadDumpAdvanceReport",
      strRptTitle: "View Thread Dump",
      jsonData:JSON.stringify(this.takeThreadDumpInfo),
      renameArray:JSON.stringify( threadDumpRenameArray),
      varFilterCriteria: this.takeTDHeader,
      colOrder: threadDumpColorder.toString()
   
      }
      
    let ipWithProd = this.getHostUrl() + '/' + this.productName;

    console.log("ipwwithprodd===>", ipWithProd);
     if (sessionStorage.isMultiDCMode == "true")          //for multi dc single and all case changing it to node
    {
      if (ipWithProd.includes("/tomcat"))
        ipWithProd = ipWithProd.replace("/tomcat", "/node");
    }
    let downloadFileUrl = decodeURIComponent(ipWithProd) + "/v1/cavisson/netdiagnostics/ddr/downloadAngularReport";

    // MultiDC on and single DC case -> for fetching ip and port from node
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (
        this.checkDownloadType(res)
      ));
    }
    // tomcat case 
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (
        // if All case thn  this.takeThreadDumpInfo[0]['dcName'] dc values else will get undefined
        this.openDownloadReports(res, this.takeThreadDumpInfo[0]['dcName'])));

    }    
}
  checkDownloadType(res:any) {
    res = JSON.parse(res);
    let dcinfo;
      dcinfo = res.dcInfo;
      console.log("single case checkdownloadType",dcinfo);
  
    let keys = Object.keys(dcinfo);
    for (let i = 0; i < keys.length; i++) {
      if (dcinfo[keys[i]].isMaster == true) {
        console.log("keyss valueeee==>", dcinfo[keys[i]], " res", res);
        this.openDownloadReports(res, dcinfo[keys[i]].dc)
      }
    }
  }
  openDownloadReports(res:any,dcName?) {
     let ipWithProd;
     if(dcName)
     	ipWithProd = this.getURLbasedOnDC(dcName,res.dcInfo);
     else
       ipWithProd = this.getHostUrl();
    console.log("openDownloadReports ip",ipWithProd);
    console.log("file name generate ===",res)
    let fileName;
    if(res.tierData)
    {
      fileName= res.tierData;
      console.log("new res===",fileName);
    }
    else
     fileName = res;
    console.log("ipwithprod========",ipWithProd);
    window.open(decodeURIComponent(ipWithProd + '/' + this.productName).replace("/netstorm", "").replace("/netdiagnostics", "") + "/common/" + fileName);
  }
  updateUserNote(node:any)
  {
    //console.log(node);
  //  alert(node);
  let ipWithProd;
  let testRun;
  if(node.dcName){
    ipWithProd = this.getURLbasedOnDC(node.dcName);
    testRun = this.dcTestRun;
  }
  else{
    ipWithProd = this.getHostUrl();
    testRun = this.testRun;
  }

    let updateUserNoteUrl= ipWithProd + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/updateUserNoteTDLog?testRun=" + testRun + "&tierName=" + node.tierName + "&serverName=" + node.serverName + "&appName=" + node.instanceName + "&startTime=" +node.startTime + "&endTime=" + node.endTime+"&index="+node.index+"&partition="+node.partition+"&pid="+node.pid+"&userNote="+node.userNote+"&userName="+node.userName+"&timestamp="+node.timeStamp+"&filePath="+node.filePath+"&agentType="+node.agentType;

    this.ddrRequest.getDataUsingGet(updateUserNoteUrl).subscribe(data => (console.log(data)));
  }
/* Custom Sorting */
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
  
  mysort(event,tempData){
    if (event["field"] == "timeStamp") {
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
  }
  this.takeThreadDumpInfo = [];
  //console.log(JSON.stringify(tempData));
  if (tempData) {
     tempData.map((rowdata) => { this.takeThreadDumpInfo = this.Immutablepush(this.takeThreadDumpInfo, rowdata) });
  }
 if(this.takeThreadDumpInfo.length >0)
  this.showAnalysisThreadDump(this.takeThreadDumpInfo[0],this.takeThreadDumpInfo[0]['agentType']);
  console.log('called from ssssssssssss');
}
Immutablepush(arr, newEntry) {
  return [...arr, newEntry]
}
downloadFile(node:any)
{
  let ipWithProd = this.getHostUrl();
  // if(this._cavConfigService.getActiveDC() == "ALL" && sessionStorage.getItem("isMultiDCMode") == "true" )
  if(sessionStorage.getItem("isMultiDCMode") == "true" )
      ipWithProd = this.getURLbasedOnDC(node.dcName);

  let filePath = node.filePath;
  if (filePath.endsWith("_procdump"))
    filePath = filePath.substring(0, filePath.lastIndexOf("_procdump"));///Bug-87866

  let url = ipWithProd + "/" + this.productName + "/v1/cavisson/netdiagnostics/ddr/downloadThreadDump?filePath="+filePath;
  this._ddrData.setInLogger('','Thread Dump','Thread Dump Download','Thread Dump Download Successfully');
  window.open(url);
}
removeFile(node:any)
{
  this.confirmationService.confirm({
            message: 'Are you sure to delete?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
              this.deleteThreadDump(node);
            }
        });
}
deleteThreadDump(node:any)
{
  let ipWithProd;
  let testRun;
  if(node.dcName){
    ipWithProd = this.getURLbasedOnDC(node.dcName);
    testRun = this.dcTestRun;
  }
  else{
    ipWithProd = this.getHostUrl();
    testRun = this.testRun;
  }

  let filePath = node.filePath;
  if (filePath.endsWith("_procdump"))
    filePath = filePath.substring(0, filePath.lastIndexOf("_procdump"));

let delete_TD_url = ipWithProd + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/removeThreadDumpFile?testRun=" + testRun+'&filePath='+node.filePath+'&index='+node.index + '&productKey=' + this.productKey + '&userName=' + this.userName ;
this.ddrRequest.getDataInStringUsingGet(delete_TD_url).subscribe( (data) =>{  
    this.getViewThreadDump().subscribe(data=> this.createThreadDump(data));
    if(data.toString().indexOf("Successfully updated") != -1)
    this.message= {severity:'success', summary:'', detail:'Thread Dump deleted successfully.'};
    else
    this.message= {severity:'error', summary:'', detail:'Error while deleting Thread Dump.'};

    this._ddrData.messageEmit(this.message);
  });  
}
searchText:string;
 highlight() {
  // console.log("highlight value-");
        if(!this.searchText) {
            return this.property;
        }
        
   return  this.property.replace(new RegExp(this.escapeRegExp(this.searchText.replace(/\s\t/g, '\n\t').replace("    ","\n   ")), "mgi"), match => {
            return '<span class="ddr-highlightText">' + match + '</span>';
        });
    }
   escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\u000A\\]/g, '\\$&'); // $& means the whole matched string
}
/*
rest Call to thread dump
*/
scheduleThreadDump()
{
 //  let currMillis = Date.now();
//  var CurrentDate = moment().tz(sessionStorage.getItem('timeZoneId')).format();
this.getServerTime();
var CurrentDateTimeinMilii = moment.tz(this.serverDateTime, "M/D/YYYY H:mm:ss", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
 console.log(this.serverDateTime,"----time scheduleThreadDump moment value---CurrentDateTimeinMilii",CurrentDateTimeinMilii);

console.log(CurrentDateTimeinMilii ," and stat milli ", this.schduleStartTimeinMilii);
if( this.selectedInstanceInfo.length ==0)
   {
      alert("Please select atleast one process id to take thread dump.");
             return;
    }
if(!this.strDate){
      alert("Please select start Date.");
        return;
    }
    if(!this.endDate){
      alert("Please select End Date.");
        return;
    }

if(CurrentDateTimeinMilii > this.schduleStartTimeinMilii)
{
	alert("Schedule Start Time should be greater than current time");
	return;
  }
  if(this.schduleStartTimeinMilii > this.schduleEndTimeinMilii)
{
alert("End Date/Time should be greater than Start Date/Time");
return;
}
 // alert("strDate------------"+this.strDate);
 // alert("endDate--------------"+this.endDate);
   this.processIDWithInstance="";
  if (this.selectedInstanceInfo.length > 0) {
      for (let k = 0; k < this.selectedInstanceInfo.length; k++) {
        this.processIDWithInstance += "," + this.selectedInstanceInfo[k]["pid"] + ":" + this.selectedInstanceInfo[k]["appName"];
      }
  }
      if (this.processIDWithInstance.startsWith(","))
        this.processIDWithInstance = this.processIDWithInstance.substring(1);

       let serverNameforTD=this.serverNameforTD;
      if(serverNameforTD.indexOf('(') != -1)
       serverNameforTD = serverNameforTD.substring(0,serverNameforTD.indexOf('('));
   let timeInterval = this.timeInterval * 1000;
              
   if(this.isChecked )
         this.isCompressed = 1;
      else
        this.isCompressed = 0;
  let schedule_Url=this.getHostUrl()+"/"+this.productName+"/scheduleDumps?testRun=" + this.testRun + "&tierName=" + this.selectedTierVal + "&serverName=" +serverNameforTD + "&processIdWithInstance=" + this.processIDWithInstance+ "&isFromND=" + this.isNDCase + "&loginUserName=" + this.userName + "&isCompressed=" + this.isCompressed+"&count="+this.TDTakencount+"&interval="+timeInterval+"&strDate="+ this.strTimeInDateFormat+"&endDate="+this.endTimeInDateFormat+"&action=Scheduled";
  console.log("schdule_Url-----------------",schedule_Url);
  this.ddrRequest.getDataInStringUsingGet(schedule_Url).subscribe(res=>{
    this.displayPopUp=false;
   if(res.indexOf("Successfully") != -1)
    this.message= {severity:'success', summary:'', detail:res};
    else
    this.message= {severity:'error', summary:'', detail:res};  

    this._ddrData.messageEmit(this.message);
    this.getScheduleThreadDumpList().subscribe(res=>this.assignScheduleTDList(res));
  });
}
calculateCount()
{
console.log(this.schduleStartTimeinMilii);
console.log("enda time-",this.schduleEndTimeinMilii);
console.log("time interval", this.timeInterval * 1000);
if(this.schduleStartTimeinMilii ==undefined)
return ;
if(this.schduleEndTimeinMilii ==undefined)
return ;
if(this.timeInterval ==0 )
return ;
if(this.schduleStartTimeinMilii > this.schduleEndTimeinMilii)
{
  alert("Start Time can't be greater than End Time.");
	return;
}
console.log("schedule start Time in millis eond ---",this.schduleEndTimeinMilii-this.schduleStartTimeinMilii);
let count=(this.schduleEndTimeinMilii-this.schduleStartTimeinMilii)/(this.timeInterval*1000);
console.log("count value-------------"+count)
this.TDTakencount=parseInt(count+"");
this.showTInterval=false;
}
calculateInterval()
{
  console.log(this.schduleStartTimeinMilii);
console.log("enda time-",this.schduleEndTimeinMilii);
console.log("time interval", this.timeInterval * 1000);
if(this.schduleStartTimeinMilii ==undefined)
return ;
if(this.schduleEndTimeinMilii ==undefined)
return ;
if(this.TDTakencount==0)
return;
let interval=(this.schduleEndTimeinMilii-this.schduleStartTimeinMilii)/(this.TDTakencount);
let calculatedInterval=parseInt(interval+"");
this.timeInterval=parseInt((calculatedInterval/1000)+"");
//this.showTInterval=false;
}

getScheduleThreadDumpList()
{
  let get_schedule_td_Url=this.getHostUrl()+"/"+this.productName+"/v1/cavisson/netdiagnostics/webddr/getScheduleTDList?testRun=" + this.testRun + "&userName="+this.userName+"&tierName="+this.selectedTiers+"&serverName="+this.selectedServers+"&instanceName="+this.selectedApps;
  console.log("schdule_Url-----------------",get_schedule_td_Url);
 return this.ddrRequest.getDataUsingGet(get_schedule_td_Url);
 ////.subscribe(res=>{
 // this.scheduleTDInfo=res;
 //  console.log("schedule list lenegth----------",res.length);
  //if(res.length > 0)
  //{
  // this.initializeScheduleTDAction();
 // }

 //});
}

initializeScheduleTDAction()
{
  this.scheduleAction=[
    {label:'--Select--', value:'null'},
    {label:'Reschedule', value:'Rescheduled'},
    {label:'Cancel', value:'Cancelled'}
];
this.stopAction=[
  {label:'--Select--', value:'null'},
  {label:'Resume', value:'Resumed'}
];
this.cancelAction=[
  {label:'--Select--', value:'null'},
  {label:'Reschedule', value:'Rescheduled'}
];
this.rescheduleAction=[
  {label:'--Select--', value:'null'},
  {label:'Cancel', value:'Cancelled'}
];
this.inprogressAction=[
  {label:'--Select--', value:'null'},
  {label:'Cancel', value:'Cancelled'},
  {label:'Stop', value:'Stopped'}
];
this.completedAction=[
  {label:'--Select--', value:'null'},
  {label:'Reschedule', value:'Rescheduled'}
];
this.failedAction= [
  {label:'--Select--', value:'null'},
  {label:'Reschedule', value:'Rescheduled'}
];
this.resumedAction=[
  {label:'--Select--', value:'null'},
  {label:'Cancel', value:'Cancelled'},
  {label:'Stop', value:'Stopped'},
]
}

onStrDate(event) {
  // let d = new Date(Date.parse(event));
  // this.strTime = `${d.getTime()}`;
  // console.log(this.strTime);
  let date = new Date(event);
  console.log("start date----",date);
  this.strTimeInDateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';
  if (this.strTimeInDateFormat > this.serverDateTime){
    this.schduleStartTimeinMilii = moment.tz(this.strTimeInDateFormat, "M/D/YYYY H:mm:ss", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
  }
  else{
    alert("Schedule Start Date/Time is less than Current Time.");
    this.schduleStartTimeinMilii = moment.tz(this.strTimeInDateFormat, "M/D/YYYY H:mm:ss", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
    return;
  } 
  console.log("The start time should be this...", this.schduleStartTimeinMilii);
  //this.schduleStartTimeinMilii=date.getTime();
  //  this.calculateCount();
 // console.log("onStrDate(event) ",this.strTime);
}
onEndDate(event) {
  // let d = new Date(Date.parse(event));
  // this.endTime = `${d.getTime()}`;
  // console.log(this.endTime);
  let date = new Date(event);
  console.log("end date----",date);
  this.endTimeInDateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';
  if (this.endTimeInDateFormat > this.serverDateTime){
    this.schduleEndTimeinMilii = moment.tz(this.endTimeInDateFormat, "M/D/YYYY H:mm:ss", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
  }
  else{
    alert("Schedule End Date/Time is less than Current Time.");
    this.schduleEndTimeinMilii = moment.tz(this.endTimeInDateFormat, "M/D/YYYY H:mm:ss", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
    //return;
  }
  // this.schduleEndTimeinMilii=date.getTime();
   this.calculateCount();
 // console.log("onEndDate(event)",this.endTime);
}
   
  updateScheduledTD(node)
  {
    console.log(node);
    if(node.Status== "Cancelled" || node.Status== "Stopped" || node.Status== "Resumed")
    {
      // var CurrentDate = moment().format();

      var CurrentDateTimeinMilii = moment.tz(this.serverDateTime, sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
      console.log(this.serverDateTime,"----time moment value---CurrentDateTimeinMilii",CurrentDateTimeinMilii);
      console.log(new Date().getTime(),"----time vlue---",node.scheduleEndTime);

      if(node.Status== "Resumed" && node.scheduleEndTime < this.serverDateTime)
      {
        alert("Schedule End Date/Time is greater than Current Time.")
      return;
      }
       console.log("cancelled case-----");
       this.updateScheduledTDAction(node);
    }
    else if(node.Status== "Rescheduled")
    {
            console.log("rescheduled case");
           // alert("open popup case");
           this.getServerTime();

            this.scheduledInfo=node;
            this.displayReschedulePopup=true;
    }
    
  }      
  updateScheduledTDAction(node)
  {
    let updatescheduleTD_action=this.getHostUrl()+"/"+this.productName+"/scheduleDumps?testRun=" + this.testRun + "&loginUserName="+node.userName+"&tierName="+node.tierName+"&serverName="+node.serverName+"&processIdWithInstance="+node.processId+":"+node.instanceName+"&strDate="+node.scheduleSTInDate+"&endDate="+node.scheduleETInDate+"&action="+node.Status+"&agentType="+node.agentType+"&isCompressed="+node.isCompressed+"&index="+node.index+"&isFromND="+node.isNDCase+"&count="+node.scheduleCount+"&interval="+node.interval;
    console.log("schdule_Url-----------------",updatescheduleTD_action);
    this.ddrRequest.getDataInStringUsingGet(updatescheduleTD_action).subscribe(res=>{
            // console.log("update scheulde TD ",res);
             if(res.indexOf("Successfully") != -1)
             this.message= {severity:'success', summary:'', detail:res};
             else
             this.message= {severity:'error', summary:'', detail:res};

             this._ddrData.messageEmit(this.message);
      this.getScheduleThreadDumpList().subscribe(res=>this.assignScheduleTDList(res));
    });
  }
  schedulesort(event,scheduleTDInfo)
  {
    if (event["field"] == "scheduleSTInDate" || event["field"] == "scheduleETInDate") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        scheduleTDInfo = scheduleTDInfo.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        scheduleTDInfo = scheduleTDInfo.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
  }
  this.scheduleTDInfo = [];
  //console.log(JSON.stringify(tempData));
  if (scheduleTDInfo) {
    scheduleTDInfo.map((rowdata) => { this.scheduleTDInfo = this.Immutablepush(this.scheduleTDInfo, rowdata) });
  }
  }
  assignScheduleTDList(res)
  {
    this.scheduleTDInfo=res.scheduleList;
  if(this.scheduleTDInfo.length > 0)
   this.initializeScheduleTDAction();
   }
   mergeTwoRequest()
   {
     this._ddrData.messageEmit({severity:'success', summary:'', detail:'Thread Dump data is updated after applying filter.'});
    forkJoin(
      this.getViewThreadDump(),
    this.getScheduleThreadDumpList()).subscribe((res)=>{
      let data = <any> res;
      console.log("getting both data");
      this.createThreadDump(data[0]);
      this.assignScheduleTDList(data[1]);

      this.tierWithServerObject = data[0].tierWithServer;
  this.serverWithAppObject = data[0].serverWithApp;
    if(this.tierWithServerObject && data[1].tierWithServer)
    this.mergerTwoObject(this.tierWithServerObject,data[1].tierWithServer);
   if(this.serverWithAppObject && data[1].serveWithApp)
  this.mergerTwoObject(this.serverWithAppObject,data[1].serveWithApp);
	this.getTierServerAppInfo();
    });
   }
   mergerTwoObject(firstObject:Object,secondObject:Object)
   {
      let arr= Object.keys(secondObject);
      arr.forEach((val,index)=> {
        if(firstObject.hasOwnProperty(val))
        {
            let arr1= firstObject[val];
            arr1=arr1.concat(secondObject[val]);
           // console.log(arr1);
            firstObject[val]=arr1;
        }
        else{
          firstObject[val]=secondObject[val];
        }
      })
   }
   rescheduleThreadDump()
   {
     
     let processwihInstance=this.scheduledInfo['processId']+":"+this.scheduledInfo['instanceName'];
     let timeInterval=this.timeInterval*1000;
this.getServerTime();
var CurrentDateTimeinMilii = moment.tz(this.serverDateTime, "M/D/YYYY H:mm:ss", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
if(!this.strDate){
      alert("Please select start Date.");
	return;
    }
    if(!this.endDate){
      alert("Please select End Date.");
        return;
    }

if(CurrentDateTimeinMilii > this.schduleStartTimeinMilii)
{
        alert("Schedule Start Time should be greater than current time");
        return;
  }
  if(this.schduleStartTimeinMilii > this.schduleEndTimeinMilii)
{
alert("End Date/Time should be greater than Start Date/Time");
return;
}
   
 let schedule_Url=this.getHostUrl()+"/"+this.productName+"/scheduleDumps?testRun=" + this.testRun + "&tierName=" + this.scheduledInfo['tierName'] + "&serverName=" +this.scheduledInfo['serverName'] + "&processIdWithInstance=" + processwihInstance+ "&isFromND=" + this.scheduledInfo['isNDCase'] + "&loginUserName=" + this.scheduledInfo['userName'] + "&isCompressed=" + this.scheduledInfo['isCompressed']+"&count="+this.TDTakencount+"&interval="+timeInterval+"&strDate="+ this.strTimeInDateFormat+"&endDate=" +this.endTimeInDateFormat+"&action=" +this.scheduledInfo["Status"]+"&index=" +this.scheduledInfo['index']+"&agentType=" +this.scheduledInfo['agentType']+"&prevStrDate="+this.scheduledInfo['scheduleSTInDate'] +"&prevEndDate="+this.scheduledInfo['scheduleETInDate'];
    console.log("schdule_Url-----------------",schedule_Url);
    this.ddrRequest.getDataInStringUsingGet(schedule_Url).subscribe(res=>{
this.displayReschedulePopup=false;     
 this.displayPopUp=false;
     if(res.indexOf("Successfully") != -1)
      this.message= {severity:'success', summary:'', detail:res};
      else
      this.message= {severity:'error', summary:'', detail:res};
      
      this._ddrData.messageEmit(this.message)
      this.getScheduleThreadDumpList().subscribe(res=>this.assignScheduleTDList(res));
    });
   }
   closeRescheduleDialog()
   {
    this.getScheduleThreadDumpList().subscribe(res=>this.assignScheduleTDList(res)); 
    this.displayReschedulePopup=false;
   }

   RemoveSelectedFiles(){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all selected Thread Dumps',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteSelectedThreadDumps();
      }
    });
   }

   deleteSelectedThreadDumps(){
    let ipwithProd ="";
    let delete_TD_url = "";
    var testRun = "";
    var fullFilePathList = [];
    var fileIndexList = [];
    // if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == "ALL" && this.dcinfo){
    if(sessionStorage.getItem("isMultiDCMode") == "true" && this.dcinfo){

      for (var i in this.dcinfo) {
         fullFilePathList = [];
         fileIndexList = [];

        for (var j in this.selectedThreadDumpInfo) {
          if(this.dcinfo[i].dc == this.selectedThreadDumpInfo[j].dcName){

            let filePath = this.selectedThreadDumpInfo[j]["filePath"];
            if (filePath.endsWith("_procdump"))
              filePath = filePath.substring(0, filePath.lastIndexOf("_procdump"));
       
           fullFilePathList.push(filePath);
           fileIndexList.push(this.selectedThreadDumpInfo[j]["index"]);
   
          }
        }
          ipwithProd = this.getURLbasedOnDC(this.dcinfo[i].dc);
          testRun= this.dcTestRun;

	if(fullFilePathList &&  fullFilePathList.length!=0 && fileIndexList && fileIndexList.length!=0){
          delete_TD_url = ipwithProd + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/removeSelectedThreadDump?testRun=" + testRun +'&filePathList='+fullFilePathList+'&indexList='+fileIndexList + '&productKey=' + this.productKey + '&userName=' + this.userName ;
          this.runRemoveReq(delete_TD_url);
	}
      
      }  
  }else{
    for (var i in this.selectedThreadDumpInfo) {

      let filePath = this.selectedThreadDumpInfo[i]["filePath"];
       if (filePath.endsWith("_procdump"))
         filePath = filePath.substring(0, filePath.lastIndexOf("_procdump"));
  
      fullFilePathList.push(filePath);
      fileIndexList.push(this.selectedThreadDumpInfo[i]["index"]);
   }
   delete_TD_url = this.getHostUrl() + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/removeSelectedThreadDump?testRun=" + this.testRun+'&filePathList='+fullFilePathList+'&indexList='+fileIndexList + '&productKey=' + this.productKey + '&userName=' + this.userName ;
   this.runRemoveReq(delete_TD_url);
  }

  }


  runRemoveReq(delete_TD_url){
      //  delete_TD_url = this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/removeSelectedThreadDump?testRun=" + this.id.testRun+'&filePathList='+fullFilePathList+'&indexList='+fileIndexList + '&productKey=' + this.productKey + '&userName=' + this.userName ;
      this.ddrRequest.getDataInStringUsingGet(delete_TD_url).subscribe( (data) =>{  
        this.getViewThreadDump().subscribe(data=> this.createThreadDump(data));
        if(data.toString().indexOf("Successfully updated") != -1)
        this.message= {severity:'success', summary:'', detail:'Thread Dump deleted successfully.'};
        else
        this.message= {severity:'error', summary:'', detail:'Error while deleting Thread Dump.'};

        this._ddrData.messageEmit(this.message);
      });  
  }

  getServerTime(){
    try {
          let url = this.getHostUrl() +"/netdiagnostics/v1/cavisson/netdiagnostics/webddr/getServerCurrentTime" ;
          this.ddrRequest.getDataInStringUsingGet(url).subscribe((data) => {
            this.serverDateTime = data.toString();
            this.defaultServerTime = new Date(this.serverDateTime);
        //    console.log("defaultServerTime>>>>>>>>",this.defaultServerTime );
          //  console.log("serverDateTime>>>>>>>>",this.serverDateTime );
          }) ;
     }catch(e) {
        console.error("error in assignServerDateTime ", e)
    }
}
}
