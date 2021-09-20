
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Message, MenuItem, ConfirmationService, SelectItem } from 'primeng/api';
// import {  } from 'primeng/api';
import { ConfigRestApiService } from '../../../../pages/tools/configuration/nd-config/services/config-rest-api.service';
import { HttpClient } from "@angular/common/http";
// import { ConfirmDialogModule,  } from 'primeng/api';
// import { CommonServices } from '../../../pages/tools/configuration/nd-config/services/';
import { ConfigUtilityService } from "../../../../pages/tools/configuration/nd-config/services/config-utility.service";
import { CavConfigService } from '../../../../pages/tools/configuration/nd-config/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import * as URL from "../../../../pages/tools/configuration/nd-config/constants/config-url-constant";

@Component({
  selector: 'app-dynamic-logging',
  templateUrl: './dynamic-logging.component.html',
  styleUrls: ['./dynamic-logging.component.css']
})
export class DynamicLoggingComponent implements OnInit {
  @Output() closeDLGui: EventEmitter<any> = new EventEmitter();
  @Input() DynamicLoggingData: string;

  className: string = "Dynamic Logging Component";
  // Started dynamic logging code 

  // variables used For Enhancement 92031
  MethodArrDropDown = [];
  value1: any;
  checked: boolean = false;
  columnOptionsFORPOP: SelectItem[];
  lines: any[];
  popuData: any; //source COde json
  viewSourceCodeHeader: string;
  // variableselection: string;
  viewSourceCodeFlag: boolean;
  showDownloadSourceCodeIcon: boolean;
  selectedMethod1 = "";
  returnMethod = "";
  customLog = "";
  inpValue = "";
  inpValue1 = "";
  LineNumber = [];
  myLineHead: any;
  myMethodHead: any;
  captureVariables = [];
  selectedIndex: any;
  actualTrackPoint = [];
  viewPopHeader: any;
  section: any;
  text1 = "";
  selectionflag: boolean;
  occurences = [];
  stackTrace = [];
  dynamicLogs = [];
  tempTrace: any;
  occurence: any;
  selectedOccurence: any;
  items: MenuItem[];
  selectedLine: any;
  trackPointData: TrackPointConfig[];
  selectedTrackData: TrackPointConfig;
  openEditDialog: boolean;
  fileName: any;
  showDynLoggingPopUp: boolean = false;
  jsonData: any;
  dynTierName = "";
  dynServerName = "";
  dynAppName = "";
  dynFqc: any;
  dynFqm: any;
  confirmationPopup: boolean = false;
  popupMsg: any;
  isFromApplyToInstance: boolean = false;
  dlMessg = "";
  testRunNo: any;
  productName: any;
  dynEntrySeqNum: any;
  lineIndex = [];

  profileDetail: ProfileData;
  profileListItem: SelectItem[];

  selectedInstance: any;
  InstanceArrDropDown: SelectItem[];
  displayNewProfile: boolean = false;
  dynFpInstance: any;
  successPopup: boolean = false;

  allLocalVarList: SelectItem[];
  selectedLocalVarList: any;
  selectedLocalVariables: string = 'selectedLocalVariables';  //whether Local variables checkbox is checked or not
  selectedAllLocalVariables: string = 'selectedAllLocalVariables';

  selectedMethodArgsList: any;
  allMethodArgsList: SelectItem[];
  selectedMethodArgs: string ='selectedMethodArgs';  //whether methodargs checkbox is checked or not
  selectedAllMethodArgs: string ='selectedAllMethodArgs';

  selectedClassFieldList: any;
  allClassFieldList: SelectItem[];
  selectedClassField: string ='selectedClassField';  //whether classFields radio button is checked or not
  selectedAllClassFields: string ='selectedAllClassFields';
  metaDataJson: any; // for class metadata
  captureMessagePopup :  boolean = false; 
  captureMessage: any;
  editMessage: any;
  editMessagePopup :  boolean = false;
  isFromSource:any;
  showLowerPanel:boolean;
  nodeValue:String;
  // to show info dialog
  confirmInfoDialog:  boolean = false;
  infoMsg: any[] = []; 
  //Check to see if user wants to override all levels or not
  isOverride: boolean = false;
  dlSignature : String;
  dlFqm : String;
  selectedApplyType: any;
  ApplyArrDropDown: SelectItem[];
  infoHeader:any;
  traceMethodArgs:any;
  showdMethodArgsflag: boolean ;
  traceClassFields : any;
  showClassFieldsFlag: boolean;
  traceLocalVariables : any;
  showLocalVariablesFlag: boolean;
  DLurl: string;
  constructor(private ddrRequest: ConfigRestApiService,
    private httpClient: HttpClient, private confirmationService: ConfirmationService, private utilityService: ConfigUtilityService,
    private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService,) {
  }

  ngOnInit() {
    console.log("SERVICE URL ===> ", URL.SERVICE_URL);
    console.log("SERVICE URL ===> ", );
    console.log("node as dynamic logging data form ngoninit", this.DynamicLoggingData);
    this.dynTierName = this.DynamicLoggingData[0];
    this.dynServerName = this.DynamicLoggingData[1];
    this.dynAppName = this.DynamicLoggingData[2];
    this.dynFqm = this.DynamicLoggingData[3];
    this.productName = this.DynamicLoggingData[4];
    this.testRunNo = this.DynamicLoggingData[5];
    if (this.DynamicLoggingData[8]) {
      this.isFromSource =this.DynamicLoggingData[8];// ddr=0& config=1
    } else {
      this.isFromSource = "0";
    }
    console.log("values of this.isFromSource",this.isFromSource);

    this.DLurl = URL.SERVICE_URL.split("/")[0];
    //to support both cases form DL icon as well as from configUI and Methodcalling Tree
    if (this.DynamicLoggingData[6]) {
      this.dynEntrySeqNum = this.DynamicLoggingData[6];
    } else {
      this.dynEntrySeqNum = "";
    }
    if (this.DynamicLoggingData[7]) {
      this.dynFpInstance = this.DynamicLoggingData[7];
    } else {
      this.dynFpInstance = "";
    }
    if(this.isFromSource == "0"){
    this.showLowerPanel =true;
    }else{
    this.showLowerPanel =false;
    }

    this.items = [

      {
        label: 'Apply To Tier', command: () => {
          this.applyToTier();
          console.log("Apply To Tier");
        }
      },
      {
        label: 'Apply to Instance of Current Tier', command: () => {
          this.applyToInstancecall();
          console.log("Apply to Instance of Current Tier");
        }
      }
    ];
    this.getApplyDropdown();
    this.selectedApplyType = "Current Instance";
    this.createHeader();
    this.viewSourceCode(this.DynamicLoggingData);
  }

  private _protocol: string;
  public dcName: any;

  // getHostUrl(): string {
  //   var hostDcName;
  //   if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
  //     if (!this.dcName && this.isFromSource == "0")
  //           this.dcName = sessionStorage.getItem("ddrDcName");
  //     else if (!this.dcName && this.isFromSource == "1")
  //          this.dcName = sessionStorage.getItem("activeDC");
  //     else
  //       sessionStorage.setItem("ddrDcName", this.dcName);
  //     if (!this.dcName)
  //       hostDcName = location.protocol + "//" + location.host;
  //     else
  //       hostDcName = location.protocol + "//" + location.host + "/tomcat/" + this.dcName;
  //     console.log("all case url==> ddr", hostDcName);
  //   }

    // else if (this._navService.getDCNameForScreen("methodCallingTree") !== undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("methodCallingTree");
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");
    // if (this._protocol)
    //   sessionStorage.setItem("protocol", this._protocol);
    // else
    //   sessionStorage.setItem("protocol", location.protocol.replace(":", ""));
    // if (!hostDcName.startsWith("http") && !hostDcName.startsWith("//"))
    //   hostDcName = "//" + hostDcName;
  //   console.log('hostDcName ddr =', hostDcName);
  //   return hostDcName;
  // }

  getMasterDC() {
    let dcInfo = this._cavConfigService.getDCInfoObj();
    for (let i = 0; i < dcInfo.length; i++) {
      if (dcInfo[i].isMaster == true) {
        return dcInfo[i].dc;
      }
    }
    return undefined;
  }

  createHeader(){
  this.infoHeader= "";
  this.infoHeader+= " Tier=" + this.DynamicLoggingData[0]+ ", ";
  this.infoHeader+= "Server=" + this.DynamicLoggingData[1]+ ", ";
  this.infoHeader+= "Instance=" + this.DynamicLoggingData[2];
  console.log("We are inside create header===",this.infoHeader);
  }

  viewSourceCode(node) {
    // console.log("this.fpInstanceInfo********",this.fpInstanceInfo[this.fpInstanceInfoKeys[0]],"------------**************node in view source***",node)

    console.log("node as dynamic logging data form ddr data", node);
    this.viewSourceCodeHeader = "Source Code";
    this.viewSourceCodeFlag = true;
    // this.showDynLoggingPopUp =true
    this.jsonData = node;
    //this.viewPopHeader = [];

    //this.viewPopHeader = node.fqm ||node.data.fqm;
    // let fqmtemp= node.fqm ||node.data.fqm;   //to support both cases form DL icon as well as from right click menu
    // this.dynTierName =node.tierName ||node.data.tierName;
    // this.dynServerName =node.serverName ||node.data.serverName;
    // this.dynAppName =node.appName ||node.data.appName;
    this.dynFqc = this.dynFqm.substring(0, this.dynFqm.lastIndexOf("."));
    console.log("The value inisde the tier is ..", this.testRunNo);
    console.log("The value iniside the server name is....", this.dynServerName);
    console.log("The value inside the instance name is ...", this.dynAppName);
    console.log("The value inside the tierNAme is ....", this.dynTierName);
    console.log("The value inside the dynFqc is ....", this.dynFqc);
    this.getServerApp();
    // let url = this.getHostUrl();
    // url += '/' + this.productName.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/readSourceCode?&fqm=' + this.dynFqm + "&tierName=" + this.dynTierName + "&serverName=" + this.dynServerName + "&instanceName=" + this.dynAppName;
    // let DLurl = URL.SERVICE_URL.split("/")[0];
    let url = this.DLurl+'/netdiagnostics/v1/cavisson/netdiagnostics/ddr/readSourceCode?&fqm=' + this.dynFqm + "&tierName=" + this.dynTierName + "&serverName=" + this.dynServerName + "&instanceName=" + this.dynAppName;
    //    let url = "http://10.10.40.3:8001/netdiagnostics/v1/cavisson/netdiagnostics/ddr/readSourceCode?&fqm=com.cavisson.nsecom.ExceptionConditions.normalException(ExceptionConditions.java:134)&tierName=TOmcat8&serverName=localhost&instanceName=Instance1&testRun=1055";
    this.ddrRequest.getDataByGetReq(url).subscribe(data => (this.assignValue(data, node)));
  }
  assignValue(dataVal: any, nodeInfo: any) {
    //    let  entrySeqNumTemp = nodeInfo.entrySeqNum || nodeInfo.data.entrySeqNum; //to support both cases form DL icon as well as from right click menu
    //     if(!entrySeqNumTemp){
    //       entrySeqNumTemp = "";
    //     }
    // let DLurl = URL.SERVICE_URL.split("/")[0];
    console.log("DL URL ===> ", this.DLurl);
    let url = this.DLurl+'/netdiagnostics/v1/cavisson/netdiagnostics/webddr/actualTrackPoints?testRun=' + this.testRunNo + "&fpInstance=" + this.dynFpInstance + "&methSeqNo=" + this.dynEntrySeqNum;
    // let url = this.getHostUrl() + '/' + this.productName.replace("/", "") + '/v1/cavisson/netdiagnostics/webddr/actualTrackPoints?testRun=' + this.testRunNo + "&fpInstance=" + this.dynFpInstance + "&methSeqNo=" + this.dynEntrySeqNum;
    //    let url = "http://10.10.40.3:8001/netdiagnostics/v1/cavisson/netdiagnostics/webddr/actualTrackPoints?testRun=4814&fpInstance=281474980840968&methSeqNo=13";
    this.ddrRequest.getDataByGetReq(url).subscribe(data => {
      // let jsondata_url = this.getHostUrl();
      
      let jsondata_url = URL.SERVICE_URL + '/custom/dl/getTraceDetails/' + this.testRunNo + '/' + this.dynTierName + '/' + this.dynServerName + '/' + this.dynAppName + '?fqc=' + this.dynFqc;
      console.log("the value inside the jsondata_url is", jsondata_url);
      console.log("the value inside the dataval is", dataVal);
      // let jsondata_url = "https://10.10.50.16/configUI/custom/dl/getTraceDetails/2644/T1/S2/I3?fqc=com.mkyong.controller.MyClass"; 
      this.httpClient.get(jsondata_url).subscribe(data1 => {
        this.LineNumber = [];
        this.captureVariables = [];
        this.dynamicLogs = [];
        this.stackTrace = [];
        this.occurences = [];
        this.occurence = [];
        //this.fileName = dataVal.fileName;
        this.actualTrackPoint = <any>data;
        this.trackPointData = <TrackPointConfig[]>data1;
        this.popuData = dataVal.data;
        this.myLineHead = dataVal.fileName;
        this.trackPointData.sort((a, b) => Number(a.lno) - Number(b.lno));
        this.populateVarSelectionMenu();
        for (let i = 0; i < this.trackPointData.length; i++) {
          if (Number(this.trackPointData[i].lno) != 0) {
            //this.LineNumber.push(dataVal.fileName+"/Line:"+this.trackPointData[i].lno);
            this.lineIndex.push(this.trackPointData[i].lno);
            for (let k = 0; k < this.popuData.length; k++) {
              if (Number(this.popuData[k].lineNumber) != 0) {
                if (Number(this.popuData[k].lineNumber) == Number(this.trackPointData[i].lno)) {
                  this.popuData[k]["breakPoint"] = i + 1;
                  //this.popuData[k]["color"] = "#CFD8DC";
                  console.log("The vakue inside the break point is ....", this.popuData[k]["breakPoint"]);
                }
              }
            }
          }
        }
        for (let i = 0; i < this.actualTrackPoint.length; i++) {
          var pos;
          var lno = this.actualTrackPoint[i].LineNumber;
          for (let x = 0; x < this.lineIndex.length; x++) {
            if (this.lineIndex[x] == lno) {
              pos = x + 1;
            }
          }
          console.log("The value inside the pos for the first time is ......", pos);
          if (this.actualTrackPoint[i] && this.actualTrackPoint[i].occurences) {
            this.occurences = this.actualTrackPoint[i].occurences;
            //var line = this.actualTrackPoint[i].LineNumber;
            for (let j = 0; j < this.occurences.length; j++) {
              let value = this.occurences[j]['occuerenceID']
              //this.occurence.push({ "label": value, "value": value });
              this.occurence.push({ "occuerenceID": value, "timestamp": this.occurences[j].timestamp, "colNo": pos, "line":this.actualTrackPoint[i].LineNumber });
              //this.occurence.push({ "occuerenceID": value, "timestamp": this.occurences[j].timestamp, "colNo": pos });
              for (let k = 0; k < this.occurences[j].capturedVariables.length; k++) {
                if (this.occurences[j].capturedVariables[k] != []) {
                  this.occurences[j].capturedVariables[k]['timestamp'] = this.occurences[j].timestamp;
                  this.captureVariables.push(this.occurences[j].capturedVariables[k]);
                }
              }
              if (this.occurences[j].StackTrace[j] && this.occurences[j].StackTrace[j] != []) {
                this.tempTrace = this.occurences[j].StackTrace[j]['content'].replaceAll("):", "\n");
                this.tempTrace = this.tempTrace+")";
                this.stackTrace.push(this.tempTrace);
              }
              if (this.occurences[j].dynamicLogs[j] && this.occurences[j].dynamicLogs != []) {
                this.occurences[j].dynamicLogs[j]['timestamp'] = this.occurences[j].timestamp;
                this.dynamicLogs.push(this.occurences[j].dynamicLogs[j]);
              }
            }
            console.log("The value inside the occurence array is .....", this.occurence);
          }
          // for (let k = 0; k < this.popuData.length; k++) {
          //   if (Number(this.popuData[k].lineNumber) != 0) {
          //     if (Number(this.popuData[k].lineNumber) == Number(this.trackPointData[i].lno)) {
          //       this.popuData[k]["breakPoint"] = i + 1;
          //       //this.popuData[k]["color"] = "#CFD8DC";
          //       console.log("The vakue inside the break point is ....", this.popuData[k]["breakPoint"]);
          //     }
          //   }
          // }

        }
        console.log("The value inside the dynamciLOgs whole data is ........", this.dynamicLogs);
        this.lines = []
        this.lines = [
          { field: 'lineNumber' },
          { field: 'breakPoint' },
          { field: 'code' }
        ];

        this.columnOptionsFORPOP = [];
        for (let i = 0; i < this.lines.length; i++) {
          this.columnOptionsFORPOP.push({ label: this.lines[i].header, value: this.lines[i].field });
        }
      });
    });
  }
  oldTrackPointConfig: TrackPointConfig;
  newTrackPointConfig: TrackPointConfig;
  onCancel() {
    this.selectedTrackData = this.oldTrackPointConfig;
    console.log("on cancel call ");
    console.log(" track point array is ", this.trackPointData);
    console.log("selected track point ", this.selectedTrackData);
    console.log(" old trackpoint  ", this.oldTrackPointConfig)
    var index = this.trackPointData.findIndex(item => item.id === this.selectedTrackData.id);
    this.trackPointData.splice(index, 1, this.oldTrackPointConfig);

    console.log("after slices track point array is ", this.trackPointData, index);

    this.openEditDialog = false;
  }
  onSave() {
    console.log(" Data save successfully ");
    console.log("on save  call ");
    console.log(" track point array is ", this.trackPointData);
    console.log("selected track point ", this.selectedTrackData);
    console.log(" old trackpoint  ", this.oldTrackPointConfig);
    this.openEditDialog = false;
    if (this.addNewTrackPoint) {
      this.trackPointData.push(this.selectedTrackData);
      this.LineNumber.push(this.fileName + "/Line:" + this.selectedTrackData.lno);
      console.log("new addaed trancpoint data ", this.trackPointData);
      // for(let i =0 ; i< this.trackPointData.length; i++){
    }
    else {
      for (let i = 0; i < this.LineNumber.length; i++) {
        if (Number(this.LineNumber[i].split(":")[1]) == this.selectedTrackData.lno) {
          break;
        }
        else if (i == this.LineNumber.length - 1) {
          this.LineNumber.push(this.fileName + "/Line:" + this.selectedTrackData.lno);
        }
      }
    }
    for (let k = 0; k < this.popuData.length; k++) {
      if (Number(this.popuData[k].lineNumber) === Number(this.selectedTrackData.lno)) {
        this.popuData[k]["breakPoint"] = this.selectedTrackData.lno;
        //this.popuData[k]["color"] = "#CFD8DC";
        console.log("The value inside the break point is ....", this.popuData[k]["breakPoint"]);
      }
    }
    this.selectedClassFieldList = [];
    this.selectedLocalVarList = [];
    this.selectedTrackData.fqm = this.dlFqm;
    //}
  }

  onMethodArgs() {
      this.showdMethodArgsflag =true;
      this.selectedTrackData.traceAllArgs = false;
    console.log("The value inisde the flag value is .......", this.traceMethodArgs);
  }

  onAllMethodArgs() {
  this.showdMethodArgsflag =false;
  this.selectedTrackData.traceAllArgs = true;
  console.log("The value inisde the flag value is .......", this.traceMethodArgs);
  }

  openClassField() {
    this.showClassFieldsFlag = true;
    this.selectedTrackData.traceAllClsFlds = false;
  }

  openAllClassField() {
    this.showClassFieldsFlag = false;
    this.selectedTrackData.traceAllClsFlds = true;
  }

  openLocalVariable() {
    this.showLocalVariablesFlag = true;
    this.selectedTrackData.traceAllLclVars = false;
  }

  openAllLocalVariable(){
    this.showLocalVariablesFlag = false;
    this.selectedTrackData.traceAllLclVars = true;
  }

  openClickedTrackPoint(colObj) {

    console.log("Line details for click track point", colObj);
    console.log("open click trackpoint calll ");
    console.log(" track point array is ", this.trackPointData);
    console.log("selected track point ", this.selectedTrackData);
    console.log(" old trackpoint  ", this.oldTrackPointConfig);
    //this.viewSourceCodeFlag = false;
    //let jsondata_url = "assets/mock_data.json"; 
    //this.variableselection = "Variable Selection";
    //this.createDropdownList();
    //this.checked = true;
    this.createjsonInfo(colObj.lineNumber);
    //this.httpClient.get(jsondata_url).subscribe(data => (this.createjsonInfo(data,colObj.lineNumber)));
  }

  openTrackPoint(numb) {
    let line = numb.split(":")[1];
    this.createjsonInfo(line);
  }

  addNewTrackPoint: Boolean;
  resetTrackPoint(trackPoint) {

    trackPoint.id = 0;
    trackPoint.lno = 0;
    trackPoint.traceAll = false;
    trackPoint.traceAllArgs = false;
    trackPoint.traceRetVal = false;
    trackPoint.traceAllClsFlds = false;
    trackPoint.traceAllLclVars = false;
    trackPoint.localVarList = [];
    trackPoint.classFldList = [];
    trackPoint.methodArgList = [];
    trackPoint.message = "";
    trackPoint.fqm = "";
    trackPoint.hitLimit = 1;
    return trackPoint;
  }



  getMethodIndexFromLineNumber(lineNum) {
    if(lineNum!=0) {
    for (let j = 0; j < this.metaDataJson.methods.length; j++) {
      if ((lineNum <= (Number(this.metaDataJson.methods[j].endLineNo))) &&
        (lineNum >= (Number(this.metaDataJson.methods[j].startLineNo)))) {
        console.log("The value of index is.......", j);
        this.fileName = this.metaDataJson.methods[j].name;
        this.dlSignature = this.metaDataJson.methods[j].signature;
        this.dlFqm = this.metaDataJson.fqc+"."+this.fileName+this.dlSignature;
        return j;         
      }
    }
  }
  }

  createjsonInfo(lineNumber) {
    this.allLocalVarList = [];
    this.allClassFieldList = [];
    this.allMethodArgsList = [];
    this.myMethodHead="";
    this.dlSignature = "";
    this.dlFqm = "";
    var index;
      index = this.getMethodIndexFromLineNumber(lineNumber);
      index = index+1;
      console.log("The value inside the selected trackdata['methodName'] is.......", this.fileName);
      this.myMethodHead = this.fileName;
      if(index) {
      if (this.metaDataJson.methods[index]["localVar"]) {
        for (let k = 0; k < this.metaDataJson.methods[index]["localVar"].length; k++) {
            this.allLocalVarList.push({ label: this.metaDataJson.methods[index].localVar[k].name, value: this.metaDataJson.methods[index].localVar[k].name });
        }
      }
      if (this.metaDataJson.methods[index]["methodArgs"]) {
        for (let k = 0; k < this.metaDataJson.methods[index]["methodArgs"].length; k++) {
          this.allMethodArgsList.push({ label: this.metaDataJson.methods[index].methodArgs[k].name, value: this.metaDataJson.methods[index].methodArgs[k].name });
        }
      }

    for (let j = 0; j < this.metaDataJson.classFields.length; j++) {
      this.allClassFieldList.push({ label: this.metaDataJson.classFields[j].name, value: this.metaDataJson.classFields[j].name });
    }
    }
    else {
     this.editMessagePopup = true;
     this.editMessage = "Applying trace point is not allowed outside Method boundary";
    } 
    let tkFlag = false;
    this.selectedTrackData = <TrackPointConfig>{};
    this.selectedTrackData = this.resetTrackPoint(this.selectedTrackData);
    for (let i = 0; i < this.trackPointData.length; i++) {
      if (Number(this.trackPointData[i].lno) === Number(lineNumber)) {
        this.selectedTrackData = this.trackPointData[i];
        this.addNewTrackPoint = false;
        tkFlag = true;
        if(this.selectedTrackData.traceAllArgs){
          this.showdMethodArgsflag =false;
          this.traceMethodArgs = this.selectedAllMethodArgs;
          this.selectedTrackData.traceAllArgs = true;
        }
        if(this.selectedTrackData.methodArgList.length!=0) {
          this.showdMethodArgsflag =true;
          this.traceMethodArgs = this.selectedMethodArgs;
          this.selectedTrackData.traceAllArgs = false;
        }
        if(this.selectedTrackData.traceAllClsFlds) {
          this.showClassFieldsFlag = false;
          this.traceClassFields = this.selectedAllClassFields;
          this.selectedTrackData.traceAllClsFlds = true;
        }
        if(this.selectedTrackData.classFldList.length!=0){
          this.showClassFieldsFlag = true;
          this.traceClassFields = this.selectedClassField;
          this.selectedTrackData.traceAllClsFlds = false;
        }
        if(this.selectedTrackData.traceAllLclVars) {
          this.showLocalVariablesFlag = false;
          this.traceLocalVariables = this.selectedAllLocalVariables;
          this.selectedTrackData.traceAllLclVars = true;
        }
        if(this.selectedTrackData.localVarList.length!=0) {
          this.showLocalVariablesFlag = true;
          this.traceLocalVariables = this.selectedLocalVariables;
          this.selectedTrackData.traceAllLclVars = false;
        }
	if(this.selectedTrackData.message) {
          this.checked = true;
        }
        else { 
          this.checked = false;
        }
        break;
      }
    }
    this.oldTrackPointConfig = JSON.parse(JSON.stringify(this.selectedTrackData));
    if (!tkFlag) {
      //this.selectedTrackData ={};
      this.addNewTrackPoint = true;
      this.selectedTrackData.traceRetVal = true;
      this.traceMethodArgs = this.selectedAllMethodArgs;
      this.showdMethodArgsflag =false;
      this.selectedTrackData.traceAllArgs = true;
      this.traceClassFields=false;
      this.showClassFieldsFlag = false;
      this.traceLocalVariables = false;
      this.showLocalVariablesFlag = false;
      this.checked = false;
      console.log(" new case track ")
      this.selectedTrackData['lno'] = lineNumber;
    }
    console.log("the value inside the lineNumber is ....###..", lineNumber);
    this.viewPopHeader = [];
    this.viewPopHeader = lineNumber;
    if (lineNumber != 0 && index) {
      this.openEditDialog = true;
      //this.populateVarSelectionMenu();
    }
    else
      console.log("We cant edit for lineNumber number ", lineNumber);
  }

  selectOccurence() {
    console.log("hi.......");
  }

  clickEvent1() {
    this.section = this.section;
  }

  getCaptureVariable(line, id) {
    this.captureVariables = [];
    this.occurences = [];
    this.stackTrace = [];
    this.dynamicLogs = [];
    this.selectedOccurence = id;
    for (let i = 0; i < this.actualTrackPoint.length; i++) {
      if (this.actualTrackPoint[i].LineNumber == line) {
        this.occurences = this.actualTrackPoint[i].occurences;
        for (let j = 0; j < this.occurences.length; j++) {
          if (id === this.occurences[j]['occuerenceID']) {
            for (let k = 0; k < this.occurences[j].capturedVariables.length; k++) {
              if (this.occurences[j].capturedVariables[k] != []) {
                this.occurences[j].capturedVariables[k]['timestamp'] = this.occurences[j].timestamp;
                this.captureVariables.push(this.occurences[j].capturedVariables[k]);
              }
            }
            if (this.occurences[j].StackTrace[j] && this.occurences[j].StackTrace != []) {
              this.tempTrace = this.occurences[j].StackTrace[j]['content'].replaceAll("):", "\n");
              this.tempTrace = this.tempTrace+")";
              this.stackTrace.push(this.tempTrace);
            }
            if (this.occurences[j].dynamicLogs[j] && this.occurences[j].dynamicLogs != []) {
              this.occurences[j].dynamicLogs[j]['timestamp'] = this.occurences[j].timestamp;
              this.dynamicLogs.push(this.occurences[j].dynamicLogs[j]);
            }
            break;
          }
        }
      }
    }
  }
  getTraceDetails() {
    console.log("The value inside the data...", this.trackPointData);
    console.log("The value inside the selectedTrackPoint is ...", this.selectedTrackData);
    // let url = this.getHostUrl();
    let url = URL.SERVICE_URL;
    url += '/custom/dl/addTrackPoint?';
    console.log("the value inside the getTraceDetails url is", url);
    // let url = "https://10.10.50.16/configUI/custom/dl/addTrackPoint?";
    let dataObj: Object = {
      dlDtoList: this.trackPointData,
      tier: this.dynTierName,
      server: this.dynServerName,
      instance: this.dynAppName,
      tr: this.testRunNo,
      fqc: this.dynFqc,
      profName: this.profileDetail.profileName,
      copyProfName: this.profileDetail.selectedProfile,
      profDesc: this.profileDetail.profileDesc,
      overrideAll:this.isOverride
    }
    console.log("the values of the corresponding ", dataObj);
    this.ddrRequest.getDataByPostReqWithNoJSON(url, dataObj).subscribe(data => this.getTrackPointData(data));

    this.confirmInfoDialog = false;
    this.isOverride = false;
    this.displayNewProfile = false;
  }

  getProfileData(nodeValue) {
    // let url = this.getHostUrl();
    let url = URL.SERVICE_URL;
    url += '/custom/dl/getProfileListAndAppliedProfile/' + this.testRunNo + '/' + this.dynTierName + '/' + this.dynServerName + '/' + this.dynAppName +'/'+nodeValue;
    console.log("the value inside the getProfileList url is", url);
    this.ddrRequest.getDataByGetReq(url).subscribe(data => (this.assignProfileData(data)));
  }
  assignProfileData(profileData) {
    console.log("inside this we got profiledata", profileData)
    this.profileDetail = profileData;
    this.profileList(this.profileDetail.profList);
    if(this.profileDetail.msg.length>0){
      this.popupMsg =this.profileDetail.msg[0];
      this.confirmationPopup = true;
    }else{
     if(this.profileDetail.profList.length==0){
      this.profileDetail.profileName = this.profileDetail.profile[0];
      this.profileDetail.selectedProfile = null;
      // this.getTraceDetails();
      if(this.nodeValue =="tier"){
        this.getChildLevelDetails();
      }else{
        this.getTraceDetails();
      }
    }
    if(this.profileDetail.profile.length==0 && this.profileDetail.profList.length>0){
      this.displayNewProfile =true;
      this.confirmationPopup = false;
    }

    }   
}

  getServerApp() {
    let url = this.DLurl +'/netdiagnostics/v1/cavisson/netdiagnostics/webddr/getServerInstance?testRun=' + this.testRunNo + "&tier=" + this.dynTierName;
    console.log("the value inside the getServerApp url is", url);
    this.ddrRequest.getDataByGetReq(url).subscribe(data => (this.serverApplist(data)));
  }
  serverApplist(data) {
    console.log("inside this we got data", data)
    this.InstanceArrDropDown = [];
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let sAppName = data[keys[i]];     //serverName:InstanceName
      this.InstanceArrDropDown.push({ label: sAppName, value: sAppName });
    }
    console.log("this.InstanceArrDropDown=======", this.InstanceArrDropDown)
  }

  profileList(res) {
    this.profileListItem = [];
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let pName = res[keys[i]];     //ProfileName
      this.profileListItem.push({ label: pName, value: pName });
    }
    console.log("this.profileListItem=======", this.profileListItem)
  }

  saveNewProfile() {
    //to check if profile name already exists
    for (let i = 0; i < this.profileDetail.allProfList.length; i++) {
      if (this.profileDetail.allProfList[i] == this.profileDetail.profileName) {
        this.utilityService.errorMessage("Profile name already exist");
        return;
      }
    }
    console.log("this.profileDetail.selectedProfile=======", this.profileDetail.selectedProfile)
    console.log("this.profileDetail.profDesc=======", this.profileDetail.profileDesc)
    console.log("this.profileDetail.profileName=======", this.profileDetail.profileName)
    if(this.nodeValue =="tier"){
      this.getChildLevelDetails();
    }else{
      this.getTraceDetails();
    }
    // this.isFromApplyToInstance = false;
  }
  addNewProfile() {
    this.displayNewProfile = true;
    this.confirmationPopup = false;
  }
  getChildLevelDetails(){
    // let url = this.getHostUrl();
    let url = URL.SERVICE_URL;
    url += '/custom/dl/getChildLevelDetails/' + this.testRunNo + '/' + this.dynTierName + '/' + this.dynServerName + '/'+this.nodeValue;
    console.log("the value inside the getChildLevelDetails url is", url);
    this.ddrRequest.getDataByGetReq(url).subscribe(data => (this.showChildInfo(data)));
  }
   //Show dialog at all levels if any profile is applied at any level
   showChildInfo(data: any) {
    this.displayNewProfile = false;
    if(data.includes("None")){
      this.getTraceDetails();
    }
    else{ 
      this.confirmInfoDialog = true;
      this.infoMsg = data;
    }
  }


  closeConfirmation() {
    console.log("this.profileDetail.selectedProfile=======", this.profileDetail.selectedProfile)
    console.log("this.profileDetail.profDesc=======", this.profileDetail.profileDesc)
    console.log("this.profileDetail.profileName=======", this.profileDetail.profileName)
    this.profileDetail.selectedProfile = this.profileDetail.profile[0];
    this.profileDetail.profileDesc = null;
    this.profileDetail.profileName = null;
    if(this.nodeValue =="tier"){
      this.getChildLevelDetails();
    }else{
      this.getTraceDetails();
    }
    this.confirmationPopup = false;
    // this.isFromApplyToInstance =false;
  }
  getApplyDropdown(){
    this.ApplyArrDropDown =[];
    this.ApplyArrDropDown.push({ label: "Tier", value: "Tier" });
    this.ApplyArrDropDown.push({ label: "Current Instance", value: "Current Instance" });
    this.ApplyArrDropDown.push({ label: "Selected Instance of Current Tier", value: "Selected Instance of Current Tier" });
    console.log("Inside To getApplyDropdown",this.ApplyArrDropDown);
  }
  checkApplyDetails(){
    console.log("Inside To checkApplyDetails");
    if(this.selectedApplyType == "Tier"){
      this.applyToTier();
    }
    if(this.selectedApplyType == "Current Instance"){
      this.applyToCurrentInstance();
    }
    if(this.selectedApplyType == "Selected Instance of Current Tier"){
      this.applyToInstancecall();
    }
  }

  selectApplyType(){
    console.log("Inside To selectApplyType");
  }
  applyToTier() {
    this.dynServerName = null;
    this.dynAppName = null;
    this.nodeValue = "tier";
    this.getProfileData(this.nodeValue);
    //   this.isFromApplyToInstance = false;

    console.log("Apply To Tier");
  }

  selectInstance() {
    console.log("Apply To Instance this.selectedInstance on select .......... ", this.selectedInstance);
    if (this.selectedInstance && this.selectedInstance != null && this.selectedInstance != "undefined" && this.selectedInstance != undefined) {
      let tempArr = this.selectedInstance.split(":");
      this.dynServerName = tempArr[0];
      this.dynAppName = tempArr[1];
    }

  }
  applyToInstancecall() {

    console.log("Apply To Instance", this.dynServerName, this.dynAppName);
    console.log("Apply To Instance this.selectedInstance .......... ", this.selectedInstance);
    if (this.selectedInstance != undefined) {
      this.nodeValue = "instance";
      this.getProfileData(this.nodeValue);
    } else {
      alert("Please select one Instance from dropdown list")
      return;
    }
  }

  applyToCurrentInstance() {

    this.dynTierName = this.DynamicLoggingData[0];
    this.dynServerName = this.DynamicLoggingData[1];
    this.dynAppName = this.DynamicLoggingData[2];
    this.nodeValue = "instance";
    this.getProfileData(this.nodeValue);
    
    console.log("Apply To CurrentInstance");
  }


  getTrackPointData(val) {
    console.log(val);
    this.dlMessg = val;
    this.successPopup = true;
    //this.commonService.showError(this.dlMessg);
  }
  successConfirmPopup() {
    this.successPopup = false;
    this.captureMessagePopup = false;
    this.editMessagePopup = false;
  }


  changeToOccurenceTab(numb, id) {
    var line = numb.split(":")[1];
    this.getOccurence(line, id);
    this.selectedLine = numb;
    this.selectedOccurence = "";
  }

  deleteTrackPoint(i) {
    console.log("WE are in confirmation popup");
    console.log("The value inside the delete track point is ...", i);
    this.confirmationService.confirm({
      message: 'Are you sure to delete Track Point?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.removeLine(i);
      },
      reject: () => {
        console.log("TWE are in confirmation popup reject");
      }
    })
  }


  removeLine(i) {
    let line = this.LineNumber[i].split(":")[1];
    console.log("check  remove ", line);
    for (let k = 0; k < this.popuData.length; k++) {
      if (Number(this.popuData[k].lineNumber) == Number(line)) {
        //this.popuData.splice(k,1);
        this.popuData[k].breakPoint = null;
        console.log("remove success ", this.popuData);
        break;
      }
    }
    this.LineNumber.splice(i, 1);
    this.trackPointData.splice(i, 1);
  }
  getOccurence(line, id?) {
    this.occurences = [];
    this.occurence = [];
    this.captureVariables = [];
    this.stackTrace = [];
    this.dynamicLogs = [];
    console.log("The value inside the id is ..........", id);
    for (let i = 0; i < this.actualTrackPoint.length; i++) {
      if (this.actualTrackPoint[i].LineNumber == line) {
        this.occurences = this.actualTrackPoint[i].occurences;
        for (let j = 0; j < this.occurences.length; j++) {
          let value = this.occurences[j]['occuerenceID']
          this.occurence.push({ "occuerenceID": value, "timestamp": this.occurences[j].timestamp, "line": line, "colNo": id + 1 });
          for (let k = 0; k < this.occurences[j].capturedVariables.length; k++) {
            this.captureVariables.push(this.occurences[j].capturedVariables[k]);
          }
          if (this.occurences[j].StackTrace[j] && this.occurences[j].StackTrace[j] != []) {
            this.tempTrace = this.occurences[j].StackTrace[j]['content'].replaceAll("):", "\n");
            this.tempTrace = this.tempTrace + ")";
            this.stackTrace.push(this.tempTrace);
          }
          if (this.occurences[j].dynamicLogs[j] && this.occurences[j].dynamicLogs != []) {
            this.dynamicLogs.push(this.occurences[j].dynamicLogs[j]);
            this.dynamicLogs.push(this.occurences[j].timestamp);
          }
        }
      }
    }

  }


  closeDLDialog() {
    this.closeDLGui.emit(false);
    this.viewSourceCodeFlag = false;
  }


  populateVarSelectionMenu() {
    //let jsondata_url = "http://10.10.40.3:8005/ProductUI/assets/mock_data.json";
    let jsondata_url = this.DLurl + '/netdiagnostics/v1/cavisson/netdiagnostics/ddr/getResponseMsg?fqc=' + this.dynFqc + "&tierName=" + this.dynTierName+ "&serverName="+this.dynServerName + "&instanceName="+this.dynAppName;
    console.log("the value inside the getServerApp url is", jsondata_url);
    this.httpClient.get(jsondata_url).subscribe(data => (this.createjsonDlInfo(data)));
  }


  getIndexFromLineNumber() {
    for (let i = 0; i < this.trackPointData.length; i++) {
      if (Number(this.trackPointData[i].lno) != 0) {
        for (let j = 0; j < this.metaDataJson.methods.length; j++) {
          if ((Number(this.trackPointData[i].lno) <= (Number(this.metaDataJson.methods[j].endLineNo))) &&
            (Number(this.trackPointData[i].lno) >= (Number(this.metaDataJson.methods[j].startLineNo)))) {
            this.LineNumber.push(this.metaDataJson.methods[j].name + "/Line:" + this.trackPointData[i].lno);
            this.fileName = this.metaDataJson.methods[j].name;
            console.log("The value inside the selected trackdata['methodName'] is.......", this.fileName);
          }
        }
      }
    }
  }


  createjsonDlInfo(data) {
    let checkLineNumber;
    if(data && data.msg && data.msg.includes('Failed')) {
      this.utilityService.errorMessage(data.msg);
    }else{
      this.metaDataJson = data;
      this.getIndexFromLineNumber();
	}	
  }
  setParamsOfDL() {
    console.log("The value inside the selected varaible is ....", this.selectedLocalVarList);
    console.log("The value inside the selected methodargs is .......", this.selectedMethodArgsList);
    console.log("The value inside the selected classfields list is ........", this.selectedClassFieldList);
    // if (this.selectedClassFieldList)
    //   this.selectedTrackData.classFldList = this.selectedClassFieldList.toString();
    // if (this.selectedLocalVarList)
    //   this.selectedTrackData.localVarList = this.selectedLocalVarList.toString();
  }

  openCustomLogsPopUp(i){
      console.log("The value inisde the i is ......",i);
        //this.captureMessage = this.selectedTrackData.message;
        this.captureMessage = "To capture variable value, use double braces like {{variable name}}";
        this.captureMessagePopup = true;
  }

}

export interface TrackPointConfig {

  id: number;
  lno: number;
  traceAll: boolean;
  traceAllArgs: boolean;
  traceRetVal: boolean;
  traceAllClsFlds: boolean;
  traceAllLclVars: boolean;
  localVarList: [];
  classFldList: [];
  methodArgList:[];
  message: String;
  fqm: String;
  hitLimit: number;
}

export interface ProfileData {
  profList: string[];
  profile: string[];
  allProfList:string[];
  msg: string[];
  profileName: string;
  profileDesc: string;
  selectedProfile: string;
}
