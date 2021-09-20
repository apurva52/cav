import { Component, OnInit, Input, OnChanges, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CommonServices } from "../../services/common.services";
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import { HttpClient } from '@angular/common/http';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { DDRRequestService } from '../../services/ddr-request.service';
import { Router,NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-ddr-details-view',
  templateUrl: './ddr-details-view.component.html',
  styleUrls: ['./ddr-details-view.component.css']
})
export class DdrDetailsViewComponent implements OnInit, OnChanges {
  @Input() flowpathData;
  txnToggle;
  @Input() column: String;
  @Output() indexValue = new EventEmitter<number>();  
  @Output() windowToggle = new EventEmitter<boolean>();
  index: number = 0;
  display: boolean = false;
  urlParam;
  NVUrl;
  checkNVSessionId;
  netForestURL: string;
  showNF: boolean = false;
  timeVarienceForNF: string;
  showLink:boolean;
  fptypeFlag:boolean = false;
  errormsgObj: Object[] = [{"errorbit": "", "errmsg": "" }];

  ngOnChanges() {
    console.log('inside details=====', this.flowpathData);
    console.log("ngonchanges of details view")
    this.flowpathData = JSON.parse(JSON.stringify(this.flowpathData));
    this.urlParam = this.commonService.getData();
    if (this.urlParam != undefined) {
      console.log('iside details=====', this.flowpathData);
      this.flowpathData.product = this.urlParam.product;
      this.flowpathData.testRun = this.urlParam.testRun;
      // this.flowpathData.startTime = this.flowpathData.startTimeInMs;
      if (this.flowpathData.fpDuration.toString().includes(','))
        this.flowpathData.fpDuration = this.flowpathData.fpDuration.replace(',', '');
      // this.flowpathData.endTime = Number(this.flowpathData.startTimeInMs) + Number(this.flowpathData.fpDuration);
      console.log('iside details=====', this.flowpathData);
    }
    this.showNFIcon();
    this.checkNVSessionIDAndNVURL();
    this.handleChange();
  }

  constructor(public commonService: CommonServices, private flowmapDataService: DdrTxnFlowmapDataService, private _ddrData: DdrDataModelService,
    private _navService: CavTopPanelNavigationService, private _cavConfigService: CavConfigService, private http:HttpClient,
    private ddrRequest:DDRRequestService,private _router: Router) {
  }

  ngOnInit() {
    this.flowpathData = JSON.parse(JSON.stringify(this.flowpathData));
    this.urlParam = this.commonService.getData();
    console.log("from parent to details data====", this.flowpathData, this.urlParam);
    this.flowpathData.product = this.urlParam.product;
    this.flowpathData.testRun = this.urlParam.testRun;
    // this.flowpathData.startTime = this.flowpathData.startTimeInMs;
    if (this.flowpathData.fpDuration.toString().includes(','))
      this.flowpathData.fpDuration = this.flowpathData.fpDuration.replace(',', '');
    // this.flowpathData.endTime = Number(this.flowpathData.startTimeInMs) + Number(this.flowpathData.fpDuration);
    console.log('this.urlParam====', this.urlParam, this.flowpathData);
  }

  handleChange() {
    console.log('handling change of tabs', this.column);
    if(this._ddrData.ndDCNameInfo && this._ddrData.ndDCNameInfo.length > 0 && this._ddrData.isFromNV && this._ddrData.isFromNV == "1"){
      for(let i=0; i<this._ddrData.ndDCNameInfo.length; i++){
        if(this._ddrData.ndDCNameInfo[i].displayName == this.flowpathData.dcName){
          this._ddrData.dcName = this.flowpathData.dcName;
          this._ddrData.testRun = this._ddrData.ndDCNameInfo[i].ndeTestRun;
          console.log(" test open report in Detail view", this._ddrData.testRun, " ",this._ddrData.dcName );
          break;
        }
      }
    } 
    if (this.column == 'methodsCount') {
      this.index = 0;
      this.column = '';
    } else if (this.column == 'btCatagory') {
      this.index = 1;
      this.column = '';
    } else if (this.column == 'dbCallCounts') {
      this.index = 2;
      this.column = '';
    } else if (this.column == 'urlQueryParamStr') {
      this.index = 3;
      this.column = '';
    } else if (this.column == 'totalError') {
      this.index = 4;
      this.column = '';
    } else if (this.column == 'fpDuration') {
      this.index = 5;
      this.column = '';
    } else if (this.column == 'urlName') {
      this.index = 6;
      this.column = '';
   } else if (this.column == 'callOutCount' || this.column == 'startTime' ) {
      this.index = 7;
      this.column = '';
    }
    else if (this.column == 'flowpathInstance') {
       this.index = 8;
       this.column = '';
    }
    this.indexValue.emit(this.index);
  }

  changeTab(e) {
    this.commonService.hsData = undefined;
    console.log("event==============>", e);
    this.index = e.index;
    this.indexValue.emit(this.index);
    if(e.index == 7){
      let columnFlowpathData = JSON.parse(JSON.stringify(this.flowpathData));
      if (columnFlowpathData.fpDuration == '< 1')
      columnFlowpathData.fpDuration = 0;
      this.flowmapDataService.resetFlag();
      this.flowmapDataService.getDataForTxnFlowpath(columnFlowpathData.flowpathInstance, columnFlowpathData);
    } else {
      this.commonService.showTransactionFlowmap = false;
      
    }
  }

  openED() {
    if (sessionStorage.getItem("enableTierStatus") && sessionStorage.getItem("enableTierStatus") == "1") {
  //     this._cavConfigService.$eDParam = {
  //       testRun: this.urlParam.testRun,
  //       graphKey: "Last_60_Minutes",
  //       graphKeyLabel: "Last 1 Hour",
  //       startTime: undefined,
  //       endTime: undefined,
  //       isAllDC: false,
  //       multidc_mode: false,
  //       isDiscontGraph: false,
  //       dcName: [],
	// isFreshOpen: true
  //     }
      
      // this._cavConfig.$eDParam = obj;
      //this._navService.addNewNaviationLink('Tier Status');
      this._router.navigate(['/home/execDashboard/main/tierStatus']);
    }
    else {
    var url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if(this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = "//" + this.getHostUrl();
    }

    url += '/' + "dashboard/view/edRequestHandler.jsp?testRun=" + this.urlParam.testRun + "&sesLoginName=" + this._ddrData.userName +"&sessGroupName=&sessUserType="+"&strStarDate="+ this.commonService.edStrStartDate+ "&strEndDate="+ this.commonService.edStrEndDate +"&graphTime="+this.urlParam.strGraphKey;
console.log("urlllllllllllllllllllllllllll>>>>>>>>>>********",url)
    window.open(url, "_blank");
  }
}

  getHostUrl(): string {
    var hostDcName = this._ddrData.getHostUrl();
    // if (this._navService.getDCNameForScreen("flowpath") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  checkNVSessionIDAndNVURL() {

    let url = this.getHostUrl() + '/' + this.urlParam.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/config/nd.netvision.querysession';
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(res => {
      this.checkNVSessionId = res;
      console.log("checkNVSessionId = ", this.checkNVSessionId);
      this.commonService.checkNVSessionId = res;
    })

    let url1 = this.getHostUrl() + '/' + this.urlParam.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/config/NetVisionUrl';
    this.ddrRequest.getDataInStringUsingGet(url1).subscribe(data => {
      this.NVUrl = data;
      this.commonService.NVUrl = data;
    })
  }

  openNVFromND() {
    console.log("Hello iam inside the Nv method");
    if(sessionStorage.getItem("isMultiDCMode") != "true") {
    if (this.NVUrl != 'NA') {
      if (this.flowpathData.length == 0) {
        alert("No Flowpath is Selected");
        return;
      }
      else if (this.flowpathData.length > 1) {
        alert("Select Only One Flowpath at a time");
        return;
      }
      else {
        let nvSessionId = 'NA';
        let nvPageId = 'NA';
        let urlForNV;

       // for (let k = 0; k < this.flowpathData.length; k++) {
        if (this.flowpathData) {
          if (this.flowpathData['nvSessionId'] != '-' && this.flowpathData['nvSessionId'] != '' && this.flowpathData['nvSessionId'] != "0")
            nvSessionId = this.flowpathData['nvSessionId'];
          else{
            alert('NV Session Id is not Available or' + this.flowpathData['nvSessionId']);
            return;
         }  

          if (this.flowpathData['nvPageId'] != '-' && this.flowpathData['nvPageId'] != '')
            nvPageId = this.flowpathData['nvPageId'];
        //}

        // let params = 'strOprName=sessionDetail&nvSessionId=' + nvSessionId + '&pageInstance=' + nvPageId;
        // if (this.NVUrl.toLowerCase().indexOf("auth") == -1)
        //   urlForNV = this.NVUrl + params;
        // else
        //   urlForNV = this.NVUrl + '&' + params;

        // window.open(urlForNV);
        this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });  
      }
    }
    }
    // else {
    //   alert('Please give "NVUrl" keyword  in Config.ini');
    //   return;
    // }
  }
  else {
  //Supporting for unified dashboard
        let nvSessionId = 'NA';
        let nvPageId = 'NA';
        //let urlForNV;

        // check only one fp is selected as in case of single dc

        if (this.flowpathData.length == 0) {
          alert("No Flowpath is Selected");
          return;
        }
        else if (this.flowpathData.length > 1) {
          alert("Select Only One Flowpath at a time");
          return;
        }

       // for (let k = 0; k < this.flowpathData.length; k++) {
        if (this.flowpathData) {
          if (this.flowpathData['nvSessionId'] != '-' && this.flowpathData['nvSessionId'] != '' && this.flowpathData['nvSessionId'] != "0"){
            nvSessionId = this.flowpathData['nvSessionId'];
            //urlForNV = "?cavNVC=" + nvSessionId;
          }
          else{
            alert('NV Session Id is not Available for ' + this.flowpathData['nvSessionId']);
            return;
          }  

          if (this.flowpathData['nvPageId'] != '-' && this.flowpathData['nvPageId'] != '' && this.flowpathData['nvPageId'] != "0")
            nvPageId = this.flowpathData['nvPageId'];
            //urlForNV += "&cavPI=" + nvPageId;
        //}
        //this._navService.addNewNaviationLink("Overview");
        //this._navService.addDCNameForScreen("Overview", this._cavConfigService.getActiveDC());
        let navigationExtras: NavigationExtras = {
          queryParams: { 'cavNVC': nvSessionId,
                          'cavPI': nvPageId }
        };
        sessionStorage.removeItem('__nvSessionData');
        // this._router.navigate(['/home/netvision/sessions'],navigationExtras);
        this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });
   }
  }
  }

  openErrorMsg(){
    console.log("We are inside this box for Error Message");
    let url = this.getHostUrl() + '/' + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/erroneousflowpath?flowpathtype=" + this.flowpathData.flowpathtype ;
    return this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => (this.doAssignErrorBitValue(data)));
 //this.fptypeFlag= true;
  }
  doAssignErrorBitValue(res){
    var array = res.split(',');
   // console.log("array",array);
    var arrMsg =[];
    array.forEach(val => {
        if (val=='6'){
        arrMsg.push({ "errorbit" : val , "errmsg": " JIT Compilation done for some methods in context of this transaction, may impact response time." });
        }
        else if(val=='7'){
        arrMsg.push({ "errorbit" : val , "errmsg": " Test stopped but current transaction found active." });
        }
        else if(val=='9'){
        arrMsg.push({ "errorbit" : val , "errmsg": " Flowpath Header is missing for current  request." });
        }
        else if(val=='10'){
        arrMsg.push({ "errorbit" : val , "errmsg": " This is an Incomplete Flowpath." });
        }
        else if(val=='11'){
        arrMsg.push({ "errorbit" : val , "errmsg": " Current Flowpath has abnormal method entry-exit timings." });
        }
    });
    this.errormsgObj = arrMsg;
    console.log('this.errormessageObj?>>>>>>>>>>>',this.errormsgObj);  
    this.fptypeFlag= true;
  }
  showNFIcon() {

    let url = this.getHostUrl() + '/' + this.urlParam.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/config/NetForestUrl';
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      this.netForestURL = data;
      console.log("this.netForestURL = ", this.netForestURL);

      if (data != undefined && this.netForestURL != 'NA') {
        this.showNF = true;
        url = this.getHostUrl() + '/' + this.urlParam.product.replace("/","") + '/v1/cavisson/netdiagnostics/ddr/config/NetDiagnosticsQueryTimeVariance';
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(res => {
          this.timeVarienceForNF = res;
          console.log("this.timeVarienceForNF = ", this.timeVarienceForNF);
        })
      }
      else {
        this.showNF = false;
      }
    });
  }

  openNetForest() {
    let flowpathInstance;
    let correlationId;
    let startTimeInMs;
    let duration;
    let ndSessionId;
    let nvPageId;
    let query;

    if (this.flowpathData.length == 0) {
      alert("No Record Selected");
      return;
    } else if (this.flowpathData.length > 1) {
      alert("Please select only one flowpath.");
      return;
    } else {
      // for (let i = 0; i < this.flowpathData.length; i++) {
        flowpathInstance = this.flowpathData["flowpathInstance"];
        correlationId = this.flowpathData["correlationId"];
        startTimeInMs = this.flowpathData["startTimeInMs"];
        duration = this.flowpathData["fpDuration"];
        ndSessionId = this.flowpathData["ndSessionId"];
        nvPageId = this.flowpathData["nvPageId"];
      // }

      query = "fpi:" + flowpathInstance;
      console.log("duration = ", duration);
      let d1 = Number(startTimeInMs) - Number(this.timeVarianceInMs(this.timeVarienceForNF));
      let d2;

      if (duration == '< 1')
        d2 = Number(startTimeInMs) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      else
        d2 = Number(startTimeInMs) + Number(duration.replace(/,/g, '')) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      console.log("start time from FP To NF = " + d1);
      console.log("end time from FP To NF = " + d2);

      // let startTimeISO = new Date(d1).toISOString();
      // let endTimeISO = new Date(d2).toISOString();

      let startTimeISO = d1;
      let endTimeISO = d2;

      console.log("startTimeISO = ", startTimeISO, ", endTimeISO = ", endTimeISO);

      if (correlationId != "" && correlationId != "-")
        query += "%20AND%20corrid:" + correlationId;

      if (nvPageId != "" && nvPageId != "-")
        query += "%20AND%20pageid:" + nvPageId;

      if (ndSessionId != "" && ndSessionId != "-")
        query += "%20AND%20ndsessionid:" + ndSessionId;

      query = "( " + query + " )";

      // if (this.netForestURL != 'NA') {
      //   this.netForestURL = this.netForestURL.replace(/startTimeVal/, startTimeISO);
      //   this.netForestURL = this.netForestURL.replace(/endTimeVal/, endTimeISO);
      //   this.netForestURL = this.netForestURL.replace(/queryVal/, query);
      // }

      query = query.replaceAll("%20"," ");
      this._router.navigate(["/home/logs"], { queryParams: { queryStr: query,  startTime : startTimeISO , endTime : endTimeISO}});

      //window.open(this.netForestURL);
    }
  }

  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time)) //If time is in minute formate- xm eg:20m means 20 minute variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time)) //If time is in second formate- xs eg:200s means 200 second variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = Number(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds 
    {
      timeVarianceInMs = Number(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");
      return Number(900000); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return Number(timeVarianceInMs);
  }

  closeSession() {
    this._ddrData.splitViewFlag = false;
    this._ddrData.dbFlag = false;
    this._ddrData.flowpathToExFlag = false;
    this.commonService.httpFlag = false;
    this.commonService.hsFlag = false;
    sessionStorage.setItem("dbFlag", 'false');
    this.windowToggle.emit(true);
  }
}
