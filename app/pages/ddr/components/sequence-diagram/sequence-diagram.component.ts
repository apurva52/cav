import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { DdrBreadcrumbService } from "../../services/ddr-breadcrumb.service";
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { SelectItem } from '../../interfaces/selectitem';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { MyAreaDirective } from '../../custom-directive/area-hover-directive';
// import * as jQuery from 'jquery';
import { DDRRequestService } from '../../services/ddr-request.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
selector: 'sequence-diagram',
templateUrl: './sequence-diagram.component.html',
styleUrls: ['./sequence-diagram.component.css']
})

export class SequenceDiagramComponent implements OnChanges {
    @Input() columnData;
    @ViewChild(MyAreaDirective)
    private myAreaDirective : MyAreaDirective;
    filterCriteria: string = ""; //To show filter criteria
    loading: boolean = false; //Loading ajax loader icon
    imagePath: any;
    showImage: boolean = false;
    sessionID: any;
    errorMsg: string;
    image: string;
    arrCoordinates=[];
    screenHeight: any;
    filterDialog: boolean = false;
    txtClassWidth:number = 300;
    txtThresholdWallTime: number = 1500;
    txtFilterWallTime: number = 1;
    txtFlterMethodLevel: number = 5;
    selectedPackageList: string[] = [];
    selectedClassList: string[] = [];
    selectedMethodList: string[] = [];
    uniqueMethodSignature: string[] = [];
    actualPackageList: Object[];
    actualClassList: Object[];
    actualMethodList: Object[];
    selectedActClss: string[] = [];
    selectedActMethod: string[] = [];
    ignoreFilterCallOutsforSD:string[]=['T','E','D','d','J','e','t','a','A'];
    negativeMethodArr:string[];
    selectedNegativeMethod:string[];
    corrInfo = [];
    callOutFPData:any;
    callOutFPFlag:boolean = false;
    imagePathObj={};
    keysArr=[];
    strCmdArgs:any;
    imageName:any;
    trStartTime: any;
    trEndTime: any;
    fpDuration: any;
    queryParams: any;
    startTimeInDateFormat: any;
    endTimeInDateFormat: any;
    id:any;
    packageList: SelectItem[];
    classList: SelectItem[];
    methodList: SelectItem[];
    sub: Subscription;
    param: any;
    pageName: any;
    testRun: any;
    fpInstance: any;
    showFilter: boolean = true;
    selectedDC;
    filterDCName = '';
    showAutoInstrPopUp:boolean = false;
    argsForAIDDSetting:any[];
    callOutObj = {};
    seqDFilter = '';
    cacheId: string;
    breadcrumb: BreadcrumbService;

    constructor(public commonService: CommonServices, private _cavConfigService: CavConfigService, 
        private _navService: CavTopPanelNavigationService, private _ddrData: DdrDataModelService, private _router: Router,
        private breadcrumbService: DdrBreadcrumbService,private route: ActivatedRoute,private _cavConfig: CavConfigService,
        private ddrRequest:DDRRequestService, breadcrumb: BreadcrumbService, private sessionService: SessionService){ this.breadcrumb = breadcrumb; }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }){
    
        if(this._ddrData.splitViewFlag) 
        this._ddrData.setInLogger("DDR:Flowpath","Sequence Diagram","Open Sequence Diagram");
        this.loading = true;
        this.showFilter = true;
        this.corrInfo = [];
        this.keysArr = [];
        this.imagePathObj = {};
        this.callOutFPFlag = false;
        this.id = this.commonService.getData();
        if (this.columnData != undefined) {
            this.queryParams = JSON.parse(JSON.stringify(this.columnData));
            if (this.queryParams['fpDuration'] != undefined) {
                if (this.queryParams['fpDuration'] == '< 1') {
                    this.queryParams.fpDuration = 0;
                    this.fpDuration = 0
                }
                else if (this.queryParams['fpDuration'].toString().includes(',')) {
                    this.queryParams.fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
                    this.fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
                } else {
                    this.fpDuration = this.queryParams.fpDuration;
              }
            }
            this.trStartTime = this.queryParams.startTimeInMs;
            this.trEndTime = Number(this.queryParams.startTimeInMs) + Number(this.queryParams.fpDuration);
        }
        //this.createFilterCriteria();
        this.getSessionId();
        // this.showSeqDiag();
        this.seqDFilter = '(Class Name Width(px)= ' + this.formatter(this.txtClassWidth) +
                          ', Top Methods= ' + this.formatter(this.txtFlterMethodLevel) +
                          ', Wall Time= ' + this.formatter(this.txtFilterWallTime) +
                          'ms, Threshold Wall Time= ' + this.formatter(this.txtThresholdWallTime) + 'ms)'
    }

    ngOnInit()
    {
        this.loading = true;
        // console.log('this.id ********* ',this.id);
        this.sub = this.route.params.subscribe(params => {
            this.param = params['param'];
        });
        if (this.param == 'fromPage'){
            this.showFilter = false;
            // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SEQ_DIAG);
            this.breadcrumb.add({label: 'Sequence Diagram', routerLink: '/ddr/sequencediagram/:param'});
            this.id = this._ddrData.pagedump;
            this.getSessionId();
        // console.log('/:id/:id',this.param);
        }
        
            //this.screenHeight = Number(this.commonService.screenHeight) - 120;
        
    }

    /*Method is used get host url*/
    getHostUrl(): string {
        var hostDcName;
        if(this._ddrData.isFromtrxFlow){
            hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
            this.id.testRun=this._ddrData.testRunTr;
            //   return hostDCName;
        }
        else{
            hostDcName = this._ddrData.getHostUrl();
        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
            //hostDcName =   this._ddrData.host + ':' + this._ddrData.port;
            this.id.testRun = this._ddrData.testRun;
            this.testRun = this._ddrData.testRun;
            console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
        }
        // else if (this._navService.getDCNameForScreen("sequenceDiagram") === undefined)
        //     hostDcName = this._cavConfigService.getINSPrefix();
        // else
        //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("sequenceDiagram");

        // if (hostDcName.length > 0) {
        // sessionStorage.removeItem("hostDcName");
        // sessionStorage.setItem("hostDcName", hostDcName);
        // }
        // else
        // hostDcName = sessionStorage.getItem("hostDcName");
        }
        // console.log('hostDcName =', hostDcName);
        return hostDcName;
    }

    createFilterCriteria(startTime:any,endTime:any)
    { this.filterCriteria = '' ;

        if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
          this.filterCriteria = 'DC=' + this.selectedDC + ', ';
        }
        else if(sessionStorage.getItem("isMultiDCMode") == "true")
              {
                let dcName = this._cavConfig.getActiveDC();
                if(dcName == "ALL")
                  dcName = this._ddrData.dcName;
                 
                  this.filterCriteria = 'DC=' + dcName + ', ';

              }
        if (this.queryParams != undefined && this.param !== 'fromPage') {
             if (this.queryParams.tierName != "NA" && this.queryParams.tierName != "" && this.queryParams.tierName != "undefined" && this.queryParams.tierName != undefined)
                 this.filterCriteria += "Tier=" + this.queryParams.tierName;
             if (this.queryParams.serverName != "NA" && this.queryParams.serverName != "" && this.queryParams.serverName != "undefined" && this.queryParams.serverName != undefined)
                 this.filterCriteria += ", Server=" + this.queryParams.serverName;
             if (this.queryParams.appName != "NA" && this.queryParams.appName != "" && this.queryParams.appName != "undefined" && this.queryParams.appName != undefined)
                 this.filterCriteria += ", Instance=" + this.queryParams.appName;
        }
       else {
        if (this.id.tierName != "NA" && this.id.tierName != "" && this.id.tierName != "undefined" && this.id.tierName != undefined)
            this.filterCriteria = "Tier=" + this.id.tierName;
        if (this.id.serverName != "NA" && this.id.serverName != "" && this.id.serverName != "undefined" && this.id.serverName != undefined)
            this.filterCriteria += ", Server=" + this.id.serverName;
        if (this.id.appName != "NA" && this.id.appName != "" && this.id.appName != "undefined" && this.id.appName != undefined)
            this.filterCriteria += ", Instance=" + this.id.appName;
        }
	if (startTime != undefined && startTime != '' && startTime != 'NA')
            this.filterCriteria += ", Start Time=" + startTime;
        if (endTime != undefined && endTime != '' && endTime != 'NA')
            this.filterCriteria += ", End Time=" + endTime; 
        if (this.queryParams.fpDuration != undefined && this.queryParams.fpDuration != '' && this.queryParams.fpDuration != 'NA')
            this.filterCriteria += ", ResponseTime=" + this.formatter(this.queryParams.fpDuration) + "(ms)";
        if (this.queryParams.urlName != undefined && this.queryParams.urlName != '' && this.queryParams.urlName != 'NA')
            this.filterCriteria += ", BT=" + this.queryParams.urlName;
        if (this.queryParams.urlQueryParamStr != undefined && this.queryParams.urlQueryParamStr != '' && this.queryParams.urlQueryParamStr != 'NA') {
            if (this.queryParams.urlQueryParamStr.length > 45) {
                let wholeUrl = this.queryParams.urlQueryParamStr.substring(0, 45) + "...";
                this.filterCriteria += ",<span style='cursor:pointer;' title='" + this.queryParams.urlQueryParamStr + "'>" + " URL=" + wholeUrl + "</span>";
            }
            else {
                this.filterCriteria += ", URL=" + this.queryParams.urlQueryParamStr;
            }
        }

        if (this.filterCriteria.startsWith(","))
            this.filterCriteria = this.filterCriteria.substring(1);
      
        if (this.filterCriteria.endsWith(","))
            this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
    }

    formatter(value) {
        if (value != '' && !isNaN(value)) {
           return (Number(value)).toLocaleString();
        }
        else if(value === ''){
            return '-';
        }
        else
           return value;
    }
    
    showSeqDiag() {
        var endTimetoPass;
        var url = '';
        var startTimetoPass = Number(this.trStartTime) - 900000;
        if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined || isNaN(this.trEndTime)) {
            var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
            endTimetoPass = Number(strEndTime) + 900000;
        } else {
            endTimetoPass = Number(this.trEndTime) + 900000;
        }

        // this.getSessionId();
        if(this.param){
            // let obj = JSON.parse(this.param);
            this.pageName = this.id.pageName;
            // this.testRun =this.id.testRun;
            this.fpInstance= this.id.flowPathInstance;

            this.strCmdArgs = " --testrun " + this.id.testRun + " --fpinstance " + this.fpInstance + " --page "+ this.pageName;
            this.imageName = this.fpInstance + "_SequenceDiagram" + this.id.testRun + "_" + "FPDetails" + this.sessionID + ".png"; //image name of sequence diagram
        }
        else if(this.callOutFPFlag == true)
        {
            this.strCmdArgs = " --testrun " + this.id.testRun + " --fpinstance " + this.callOutFPData[0].flowpathInstance + " --tierid " + this.callOutFPData[0].tierId 
            + " --serverid " + this.callOutFPData[0].serverId + " --appid " + this.callOutFPData[0].appId + " --urlidx " + this.callOutFPData[0].urlIndex 
            + " --methods_count " + this.callOutFPData[0].methodCount + " --abs_starttime " + startTimetoPass + " --abs_endtime " + endTimetoPass;
            this.imageName = this.callOutFPData[0].flowpathInstance + "_SequenceDiagram" + this.id.testRun + "_" + "FPDetails" + this.sessionID + ".png"; //image name of sequence diagram
        }
        else
        {
            this.strCmdArgs = " --testrun " + this.id.testRun + " --fpinstance " + this.queryParams.flowpathInstance + " --tierid " + this.queryParams.tierId 
            + " --serverid " + this.queryParams.serverId + " --appid " + this.queryParams.appId + " --abs_starttime " + startTimetoPass 
            + " --abs_endtime " + endTimetoPass;
            this.imageName = this.queryParams.flowpathInstance + "_SequenceDiagram" + this.id.testRun + "_" + "FPDetails" + this.sessionID + ".png"; //image name of sequence diagram
        }
        console.log("imageName = " , this.imageName , " , strCmdArgs = " , this.strCmdArgs);

        // if(sessionStorage.getItem("isMultiDCMode") == "true") {
          if(this.sessionService.preSession.multiDc === true) {

            url = this._ddrData.getHostUrl() + '/tomcat' + '/ALL';
    }
        else {
           if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
            url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          else
          url = this.commonService.protocol + "://" +this.commonService.host + ':' + this.commonService.port;
            //  url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
           
        }
        else
        {
	url = this.getHostUrl();
                 
        }
    }
    if (this.commonService.enableQueryCaching == 1) {
        this.cacheId = this.id.testRun;
      }else{
        this.cacheId = undefined;
      }
        url += '/' + this.id.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/seqDiagram";
    
        let dataObj: Object = {
            cmdArgs: this.strCmdArgs,
            imageName: this.imageName,
            filterGreaterThan: this.txtFilterWallTime,
            classWidth: this.txtClassWidth,
            highLightWallTime: this.txtThresholdWallTime,
            filterTop: this.txtFlterMethodLevel,
            filters: this.selectedPackageList.toString(),
            testRun: this.id.testRun,
            ignoreFilterCallOuts:this.ignoreFilterCallOutsforSD.toString(),
            selectedNegativeMethod:this.selectedNegativeMethod+"",
            startTimeINMS:Number(this.trStartTime),
            endTimeINMS:Number(this.trStartTime) + Number(this.fpDuration),
	    cacheId: this.cacheId
        }
        // if (sessionStorage.getItem("isMultiDCMode") == "true" && (url.includes("/tomcat")||url.includes("/node")))
        if (this.sessionService.preSession.multiDc === true || (url.includes("/tomcat")||url.includes("/ALL")))
        return this.ddrRequest.getDataUsingPost(url, (dataObj)).subscribe(data => this.getImage(data));
        
        else
        return this.ddrRequest.getDataUsingPost(url, JSON.stringify(dataObj)).subscribe(data => this.getImage(data));
        
    
     
    }

    getSessionId() {
        var url = '';
        if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
      url = this.commonService.protocol + "://" +this.commonService.host + ':' + this.commonService.port;

        } else {
            url = this.getHostUrl();
        }
        url += '/' + this.id.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/sessionInfo";
        return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignSessionValue(data)));
    }
    
    doAssignSessionValue(res: any) {
        this.sessionID = res.id;
        this.showSeqDiag();
    }

    openAutoInstDialog()
    {
        console.log('this.queryParams>>>>>>>>>>>>****',this.queryParams);
      
         let testRunStatus;
         let instanceType;
         let url;
        //  if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
        //  url = "//" + this.getHostUrl()+ '/' + this.id.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun='+this.id.testRun;
        //  else
         url = this.getHostUrl()+ '/' + this.id.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun='+this.id.testRun;
         
         //console.log('url *** ', url);
         this.ddrRequest.getDataUsingGet(url).subscribe(res => {
            // console.log("data for tr status === " , res);
            testRunStatus = <any> res;
             testRunStatus = testRunStatus.data;
             if(testRunStatus.length != 0)
             {
                 if(this.queryParams.Instance_Type.toLowerCase() == 'java')
                 instanceType = 'Java';
                 else if (this.queryParams.Instance_Type.toLowerCase() == 'dotnet')
                 instanceType = 'DotNet';                
                 
                 this.showAutoInstrPopUp = true;
                 
                this.argsForAIDDSetting = [this.queryParams.appName,this.queryParams.appId,instanceType,this.queryParams.tierName,
                this.queryParams.serverName,this.queryParams.serverId,"-1",this.queryParams.urlName,"DDR",testRunStatus[0].status,this.id.testRun];           
                console.log('this.argsForAIDDSetting>>>>>>>>>>>>****',this.argsForAIDDSetting);

            }
             else
             {
                this.showAutoInstrPopUp = false;
            alert("Could not start instrumentation, test is not running")
                return;
             }
         }); 
    }
  
    startInstrumentation(result)
    {
      this.showAutoInstrPopUp = false;
      alert(result);
    }
  
    closeAIDDDialog(isCloseAIDDDialog){
      this.showAutoInstrPopUp = isCloseAIDDDialog;
     }
  
  

    getImage(res: any) {
        this.loading = false;
        this.createFilterCriteria(res.startTimeInDateFormat,res.endTimeInDateFormat);
        //console.log("res to get Image ***** " , res);
        if (res.hasOwnProperty('img')) {
            this.image = res.img;
            this.uniqueMethodSignature = res.uniqueMethods;
            this.addPackageClassmethodList();
            this.showImage = true;
          
            if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
                
                if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
                this.imagePath = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port +this.image;
              else
             this.imagePath = this.commonService.protocol + "://" +this.commonService.host + ':' + this.commonService.port + this.image;
                
            } else {
                // if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
                // this.imagePath = "//" + this.getHostUrl() + this.image;
                // else
                this.imagePath = this.getHostUrl() + this.image;
            }
        
            let imageKey =  this.image.substring(this.image.lastIndexOf('/')+1,this.image.indexOf('_'));
            this.imagePathObj[imageKey] = this.imagePath;
            this.keysArr = Object.keys(this.imagePathObj);
            // console.log( "imagePathObj **** " , this.imagePathObj , " , keys = " , Object.keys(this.imagePathObj));
    
            this.arrCoordinates = this.arrCoordinates.concat(res.coordinates);
          
           //console.log(" length of arrCoordinates array ** " , this.arrCoordinates.length);
            // console.log(" arrCordinates = " , this.arrCoordinates);
            this.createToolTipOnImageAtSpecificPoint();
        }
        else if(res.hasOwnProperty('errorMsg')){
            this.showImage = false;
            this.errorMsg = res.errorMsg;
            // alert('this.errorMsg '+this.errorMsg);
        }
    }

    createToolTipOnImageAtSpecificPoint() {
        let arr = [];
        for (let j = 0; j < this.arrCoordinates.length; j++) {
            let tempArray = this.arrCoordinates[j].split(":");
            arr[j] = {"corrdinates":tempArray[0],"pcm":tempArray[1]}; 
        }
        this.corrInfo = arr;
        //console.log("corrInfo = " , this.corrInfo);
    }

    openSeqDiagInNewTab()
    {
        if(this.showImage == true)
            window.open(this.imagePath,"_blank");        
    }
    openDBReport(data:any, index: any)
    {
        this._ddrData.splitViewFlag = false;
        this.commonService.seqDiagToDBFlag = true; 
        let sqlIndex;
 
        //console.log("db report & data = " , data);
        let arVal = data.split('%%%');
	if(arVal[0].startsWith("DB Error"))
            sqlIndex = arVal[3].split("_")[1]; // arVal[3] is backendId
        else
            sqlIndex = arVal[4];

        let arr = JSON.parse("[" + sqlIndex + "]");
        let uniqueSqlIndex = arr.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
        console.log('CalloutJson', this.callOutObj);
        console.log('Index----', index);
        let callOutData = this.callOutObj[index];
         if(callOutData)
         callOutData= callOutData[0];
         console.log("callout Data-----------",callOutData);
        if (this.param) {
            
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SEQ_DIAG;
            // console.log('this.id ****************** ',this.id);
            this.commonService.seqDiagToDBData = this.id;
        }  else {
            if (callOutData) {
                console.log('Inside Callout');
                let params = {
                    'testRun': this.queryParams.testRun, 'flowpathInstance': callOutData.flowpathInstance,
                    'tierId': callOutData.tierId, 'serverId': callOutData.serverId,
                    'appId': callOutData.appId, 'tierName': callOutData.tierName,
                    'serverName': callOutData.serverName, 'appName': callOutData.appName,
                    'fpDuration': this.queryParams.fpDuration, 'startTimeInMs': this.trStartTime,
                    'sqlIndex': uniqueSqlIndex.toString(), 'product': this.id.product
                };
                this.commonService.seqDiagToDBData = params;
            } else {
                console.log('Inside Normal Case');
                let params = {
                    'testRun': this.queryParams.testRun, 'flowpathInstance': this.queryParams.flowpathInstance,
                    'tierId': this.queryParams.tierId, 'serverId': this.queryParams.serverId, 'appId': this.queryParams.appId,
                    'tierName': this.queryParams.tierName, 'serverName': this.queryParams.serverName, 'appName': this.queryParams.appName,
                    'fpDuration': this.queryParams.fpDuration, 'startTimeInMs': this.trStartTime, 'sqlIndex': uniqueSqlIndex.toString(),
                    'product': this.id.product
                };
                this.commonService.seqDiagToDBData = params;
            }
        }
        if(this._router.url.indexOf('/home/ddr') != -1)
        this._router.navigate(['/home/ddr/flowpathToDB']);
        else if(this._router.url.indexOf('/home/ED-ddr') != -1)
        this._router.navigate(['/home/ED-ddr/flowpathToDB']);
        else if(this._router.url.indexOf('/home/ddrCopyLink') != -1)
        this._router.navigate(['/home/ddrCopyLink/flowpathToDB']);
    }

    openExceptionReport(data:any,index:number,caseValue:string)
    {
    //    alert("open exception report");
        this.commonService.seqDiagToExceptionFlag = true;
        this._ddrData.flowpathToExFlag  = false;
        this._ddrData.splitViewFlag = false;
        //console.log("exception report & data = " , data);
        let arVal = data.split('%%%');
        let backendId = undefined;
        let backendSubType =undefined;
        if(arVal.length >3)
        {
        backendId=arVal[3].split('_')[0]; 
        backendSubType= arVal[3].split('_')[1];
        }
        let failedQuery=1;
        if(caseValue == "exception")
         failedQuery=undefined;
        let endTimeInMs = Number(this.trStartTime) + Number(this.fpDuration);
        let sequenceNumber = arVal[2];
        let seqNoToPass = sequenceNumber.substring(sequenceNumber.lastIndexOf(".")+1);
         let callOutData = this.callOutObj[index];
         if(callOutData)
         callOutData= callOutData[0];
         console.log("callout Data-----------",callOutData);
        if (this.param){
            
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SEQ_DIAG;
            this.commonService.seqDiagToDBData = this.id;
        }
        else{
           if (callOutData) {
                console.log('Inside Callout');
                let params = { 
                    'testRun': this.queryParams.testRun, 'flowpathInstance': callOutData.flowpathInstance,
                    'tierId': callOutData.tierId, 'serverId': callOutData.serverId,
                    'appId': callOutData.appId, 'tierName': callOutData.tierName,
                    'serverName': callOutData.serverName, 'appName': callOutData.appName,
                    'fpDuration': this.queryParams.fpDuration, 'startTimeInMs': this.trStartTime,
                    'backendSubType':backendSubType,'backendid':backendId,'backendName':arVal[4], 'product': this.id.product,'failedQuery':failedQuery
                };
                this.commonService.seqDiagToExceptionData = params;
            } else {

            let params = {'testRun':this.id.testRun,'flowpathInstance':this.queryParams.flowpathInstance,'startTimeInMs':this.trStartTime,
            'endTimeInMs':endTimeInMs,'tierId':this.queryParams.tierId,'tierName':this.queryParams.tierName,'serverId':this.queryParams.serverId,
            'serverName':this.queryParams.serverName,'appId':this.queryParams.appId,'appName':this.queryParams.appName,'backendSubType':backendSubType,
            'backendid':backendId,'backendName':arVal[4],'product':this.id.product, 'seqNo':seqNoToPass,'failedQuery':failedQuery};
                         
            this.commonService.seqDiagToExceptionData = params;
		}
        }
        //this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
        if(this._router.url.indexOf('/home/ddr') != -1)
        this._router.navigate(['/home/ddr/exception']);
        else if(this._router.url.indexOf('/home/ED-ddr') != -1)
        this._router.navigate(['/home/ED-ddr/exception']);
        else if(this._router.url.indexOf('/home/ddrCopyLink') != -1)
        this._router.navigate(['/home/ddrCopyLink/exception']);
    }

    onRightClick(event)
    {
        event.preventDefault();
        jQuery('.context-menu').toggle(100).css({
            top: (event.pageY - 40) + 'px',
            left: event.pageX + 'px'
        });

        jQuery(document).click(function(event){
            event.stopPropagation();
            jQuery('.context-menu').hide();
        });
        //this.myAreaDirective.showContextMenu();
    } 

    openCallOutFlowpathInstance(data:any, index: any)
    {
        console.log("callout fp instance data *** " , data);
        let url;
        let endTimeInMs = Number(this.trStartTime) + Number(this.fpDuration) + 6000;
        let startTimeInMs = Number(this.trStartTime) - 60000;
	let childflowpaths=this.queryParams.flowpathInstance;
         if(this.queryParams.prevFlowpathInstance != '0')
         childflowpaths= this.queryParams.prevFlowpathInstance;

        let cmdArgs = " --testrun " + this.queryParams.testRun + " --prev_fpinstance " + childflowpaths + " --begin_seq_num " 
        + data.split('%%%')[2] + " --abs_starttime " + startTimeInMs + " --abs_endtime " + endTimeInMs;
        
        if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
            url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          else
          url = this.commonService.protocol + "://" +this.commonService.host + ':' + this.commonService.port;

        //url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        } else {
            // if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
            // url = "//" + this.getHostUrl();
            // else
            url =  this.getHostUrl();
        }
        url += '/' + this.id.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/callOutFP?cmdArgs=" + cmdArgs;
        return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.assignCallOutFPValue(data, index)));
    }

    assignCallOutFPValue(res:any, index: any)
    {
        // console.log("res for CallOut FP **** " , res);
        if(res.data.length != 0)
        {
            this.callOutFPFlag = true;
            this.callOutFPData = res.data;
            this.callOutObj[index]=this.callOutFPData;
            this.getSessionId();
            // this.showSeqDiag();
        }
        else
        {
            alert("No data found  for this Call Out");
        }
    }

    addPackageClassmethodList() {
        let packageList = [];
        let classList = [];
        let methodList = [];
        for (let k = 0; k < this.uniqueMethodSignature.length; k++) {
            let tempArr = this.uniqueMethodSignature[k].split(".");
            let methodN = this.concatArrayToString(tempArr.splice(tempArr.length - 1, 1));
            let classN = this.concatArrayToString(tempArr.splice(tempArr.length - 1, 1));
            let packageN = this.concatArrayToString(tempArr);
            if (packageN != "" && packageN != "-" && packageList.findIndex(x => x.label == packageN) == -1)
                packageList.push({ "label": packageN, "value": packageN });
            if (classN != "" && classN != "-" && classList.findIndex(x => x.label == classN) == -1)
                classList.push({ "label": classN, "value": packageN + "_" + classN });
            if (methodN != "" && methodN != "-" && classList.findIndex(x => x.label == methodN) == -1)
                methodList.push({ "label": methodN, "value": packageN + "_" + classN + "_" + methodN });
        }
        this.packageList = packageList;
        this.actualPackageList = packageList;
        this.actualClassList = classList;
        this.actualMethodList = methodList;
        this.classList = classList;
        this.methodList = methodList;
    }

    getClassList() {
        let classList = [];
        // let actualClass=[];
        //console.log(this.selectedPackageList);
        for (let i = 0; i < this.selectedPackageList.length; i++) {
            let pkg = this.selectedPackageList[i];
            //console.log(pkg+"classlist length"+this.classList.length)
            for (let j = 0; j < this.actualClassList.length; j++) {
                let value = this.actualClassList[j]['value'];
            //console.log(value+"package "+pkg);
                if (value.indexOf(pkg) != -1) {
                classList.push(this.actualClassList[j]);
                }
            }
        }
        let selectedActClss = [];
        for (let i = 0; i < classList.length; i++) {
            let classValue = classList[i]['value'];
        //  console.log("classvalue", classValue);
            for (let j = 0; j < this.selectedClassList.length; j++) {
         //   console.log("selectedValue", this.selectedClassList[j], "indexof value", this.selectedClassList[j].indexOf(classValue));
            if (classValue.indexOf(this.selectedClassList[j]) != -1)
                selectedActClss.push(classValue);
            }
        }
        
        if (this.selectedPackageList.length == 0) {
            this.addPackageClassmethodList();
            this.selectedActClss = [];
            this.selectedClassList = [];
            this.selectedActMethod = [];
            this.selectedMethodList = [];
        }
        else {
            this.classList = [];
            this.classList = classList;
            this.selectedClassList = selectedActClss;
            this.getMethodList();
    
          // this.selectedActClss=actualClass;
        }
      }

    getMethodList() {
        //console.log(this.selectedClassList);
        let methodList = [];
        let actualClass = [];
        for (let i = 0; i < this.selectedClassList.length; i++) {
            let cls = this.selectedClassList[i];
            let val = this.classList.find((obj) => { return obj.value == cls });
           //console.log(val);
            actualClass.push(val['label']);
            for (let j = 0; j < this.actualMethodList.length; j++) {
                let value = this.actualMethodList[j]['value'];
                //console.log(cls+"value-----------"+value);
                if (value.indexOf(cls) != -1) {
                    methodList.push(this.actualMethodList[j]);
                }
            }
        }
        let selectedMethodList = [];
        for (let i = 0; i < methodList.length; i++) {
            let methodValue = methodList[i]['value'];
            // console.log("classvalue", methodValue);
            for (let j = 0; j < this.selectedMethodList.length; j++) {
           // console.log("selectedValue", this.selectedMethodList[j], "indexof value", this.selectedMethodList[j].indexOf(methodValue));
                if (methodValue.indexOf(this.selectedMethodList[j]) != -1)
                    selectedMethodList.push(methodValue);
                }     
        }
        // console.log("method list vaue--",methodList.toString());
        if (this.selectedClassList.length == 0) {
            this.methodList = Object.assign(this.actualMethodList);
            this.selectedActClss = [];
            this.selectedActMethod = [];
            this.selectedMethodList = [];
        }
        else {
            this.methodList = [];
            this.methodList = methodList;
            this.selectedMethodList = selectedMethodList;
            this.selectedActClss = actualClass;
        }
    }

    concatArrayToString(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            str = str + arr[i];
            if (arr.length - 1 != i)
                str = str + ".";
        }
        return str;
    }

    applyDefaultValue() {
        this.txtFilterWallTime = 5;
        this.txtFlterMethodLevel = 5;
        this.txtThresholdWallTime = 1500;
        this.txtClassWidth = 300;
        this.selectedPackageList = [];
        this.selectedActClss = [];
        this.selectedActMethod = [];
        this.selectedClassList = [];
        this.selectedMethodList = [];
        this.addPackageClassmethodList();
        this.selectedNegativeMethod = undefined;
        this.ignoreFilterCallOutsforSD=['T','E','D','d','J','e','t','a','A'];
    }

    getActualMethodList() {
        let actMethod = [];
        for (let i = 0; i < this.selectedMethodList.length; i++) {
            let val = this.selectedMethodList[i];
            actMethod.push(this.actualMethodList.find((Object) => { return Object['value'] == val })['label']);
        }
        //console.log(actMethod);
        if (this.selectedMethodList.length == 0) {
            this.selectedActMethod = [];
        }
        else {
            this.selectedActMethod = [];
            this.selectedActMethod = actMethod;
        }
    }
    
    showAllData()
    {
        this.txtFilterWallTime=0;
        this.txtFlterMethodLevel=100;
        this.txtClassWidth = 300;
        this.txtThresholdWallTime = 1500;
        this.applyThresholdFilter();
    }

    openDialogforfilter()
    {
        this.filterDialog = true;
    }

    applyThresholdFilter()
    {
        if (this.txtClassWidth == undefined || this.txtClassWidth == null || this.txtFlterMethodLevel == undefined || this.txtFlterMethodLevel == null || this.txtFilterWallTime == undefined || this.txtFilterWallTime == null || this.txtThresholdWallTime == undefined || this.txtThresholdWallTime == null) {
            alert('Please Fill all the values of Filter');
            return;
        }
        if(this.txtClassWidth < 150)
        {
            alert("Please enter class name width greater than 150 pixel");
            return;
        }

        this.seqDFilter = '(Class Name Width(px)= ' + this.formatter(this.txtClassWidth) +
                          ', Top Methods= ' + this.formatter(this.txtFlterMethodLevel) +
                          ', Wall Time= ' + this.formatter(this.txtFilterWallTime) +
                          'ms, Threshold Wall Time= ' + this.formatter(this.txtThresholdWallTime) + 'ms)';

        if (this.selectedNegativeMethod && this.selectedNegativeMethod.length > 0) {
            if (this.selectedPackageList.length > 0) {
                for (let k = 0; k < this.selectedNegativeMethod.length; k++) {
                    let pkgClsindex = this.selectedNegativeMethod[k].lastIndexOf(".");
                    let packageClassName = this.selectedNegativeMethod[k].substring(0, pkgClsindex);
                    let packageName = packageClassName.substring(0, packageClassName.lastIndexOf("."));
                    let className = packageClassName.substring(packageClassName.lastIndexOf(".") + 1, packageClassName.length);
                    let methodName = this.selectedNegativeMethod[k].substring(pkgClsindex + 1, this.selectedNegativeMethod[k].length);
                    // console.log('pkgName ', packageName, ' , Class name ', className, ' ,methodName ', methodName);
      
                    if (this.selectedPackageList.indexOf(packageName) != -1) {
                        if (this.selectedActClss.indexOf(className) != -1) {
                            if (this.selectedActMethod.indexOf(methodName) != -1) {
                                alert('Positive and negative filter could not be same ');
                                return;
                            }
                        }
                    }
                }
            }
        }
        this.arrCoordinates = [];
        var endTimetoPass;
        var startTimetoPass = Number(this.trStartTime) - 900000;
        if (this.trEndTime == '' || this.trEndTime == null || this.trEndTime == undefined) {
            var strEndTime = Number(this.trStartTime) + Number(this.fpDuration);
            endTimetoPass = Number(strEndTime) + 900000;
        } else {
            endTimetoPass = Number(this.trEndTime) + 900000;
        }
        if (this.selectedPackageList == undefined)
            this.selectedPackageList = [];
        if (this.selectedActClss == undefined)
            this.selectedActClss = [];
        if (this.selectedActMethod == undefined)
            this.selectedActMethod = [];

        var url = '';
        if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
            if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
            url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          else
          url = this.commonService.protocol + "://" +this.commonService.host + ':' + this.commonService.port;
           // url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        } else {
            //if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
             url = this.getHostUrl();
            //else
            // url =  this.getHostUrl();
        }
        this.loading = true;
        this.filterDialog = false;
        this.getSessionId();
        // this.showSeqDiag();
        //this.createFilterCriteria();
    }

    /** Validating Number input */
    validateQty(event): boolean {
        if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57))
            return false;
        else
            return true;
    }

    searchMethodName(event){
        this.negativeMethodArr = JSON.parse(JSON.stringify(this.uniqueMethodSignature));
    }
}
