import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonServices } from './../../../services/common.services';
import { CavConfigService } from '../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../main/services/cav-top-panel-navigation.service';
import { SelectItem } from '../../../interfaces/selectitem';
import { DdrBreadcrumbService } from '../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from '../../../constants/breadcrumb.constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NsCommonService } from '../services/ns-common-service';
import { DdrDataModelService } from '../../../../../main/services/ddr-data-model.service';
import { DDRRequestService } from '../../../services/ddr-request.service';

@Component({
  selector: 'app-ns-usersessions-report',
  templateUrl: './ns-usersessions-report.component.html',
  styleUrls: ['./ns-usersessions-report.component.css']
})
export class NsUsersessionsReportComponent implements OnInit {
  //url for ajaxcall
  @Input() id: any;
  url: any;
  cols: any;
  options: any;
  visibleCols: any[];
  UserSessionsData: any;
  urlParam: any;
  limit: number = 50;
  offset: number = 0;
  loading = false;
  columnOptions = [];
  showAllOption = false;
  reportType: string;
  childIndex;
  trxnInstance;
  sessionIndex;
  scriptName;
  status;
  userId;
  pageinst;
  urlIndex;
  location;
  access;
  filterCriteria: string = "";
  commData: any;
  prevColumn;
  dynamicWidthColumn: number;   // To calculate dynamic width of column  
  strTitle: any;
  count: any;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  value: number;
  loader: boolean;

  constructor(private _router: Router, public commonService: CommonServices, private nsCommonData: NsCommonService,
    private breadcrumbService: DdrBreadcrumbService, private _cavConfigService: CavConfigService,private ddrData:DdrDataModelService,
    private _navService: CavTopPanelNavigationService, private ddrRequest:DDRRequestService) { }


  ngOnInit() {
    this.loading = true;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.USER_SESSION);
    this.urlParam = this.commonService.getData();
    this.randomNumber();
    this.commonService.isToLoadSideBar=false;
    this.getDataFromRow();
    this.makeajaxcall();
    this.setTestRunInHeader();
    this.makeajaxcallCount();
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this.ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.urlParam.testRun = this.ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.urlParam.testRun);
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  makeajaxcall() {
    /*ajax call when traverse from WD*/
    {
      if(this.commonService.enableQueryCaching == 1){
        this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/nsUserSessionReport?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        this.url =this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/nsUserSessionReport?testRun=' + this.urlParam.testRun;
      }
      this.url +=  '&object=' + this.nsCommonData.objectType + '&limit=' + this.limit + '&offset=' + this.offset 
        console.log("this.commonService.isFromTransactionInstance==>",this.commonService.isFromTransactionInstance, " this.commonService.isFromPageInstance====> ",this.commonService.isFromPageInstance);
      if (this.commonService.isFromTransactionInstance || this.commonService.isFromPageInstance) {
        console.log("inside the user session report cond from other report=========>");
        console.log("start time and end time before===>", this.urlParam.startTime, "  ", this.urlParam.endTime);
        if (this.commonService.isFromTransactionInstance) {
          this.urlParam.startTime = this.commonService.nsUserSession['strStartTime'];
          this.urlParam.endTime = this.commonService.nsUserSession['strEndTime'];
        }
        if (this.commonService.isFromPageInstance || this.commonService.isFromSessionInstance) {
          this.urlParam.startTime = this.commonService.nsUserSession['startTime'];
          this.urlParam.endTime = this.commonService.nsUserSession['endTime'];
        }
        if (this.commonService.nsUserSession['access'])
          this.access = this.commonService.nsUserSession['access'];
        if (this.commonService.nsUserSession['location'])
          this.location = this.commonService.nsUserSession['location'];
        if (this.commonService.nsUserSession['page'])
          this.access = this.commonService.nsUserSession['page'];
        console.log("start time and end time after===>", this.urlParam.startTime, "  ", this.urlParam.endTime, " common service====>", this.commonService.nsSessionTiming);
      }
        this.url+=  '&startTime=' + this.urlParam.startTime +
        '&endTime=' + this.urlParam.endTime +
        '&user=' + this.userId +
        '&script=' + this.scriptName +
        '&page=' + this.pageinst +
        '&location=' + this.location +
        '&access=' + this.access +
        '&urlidx=' + this.urlIndex +
        '&child=' + this.childIndex +
        '&trans=' + this.trxnInstance;

        if(this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        this.url += '&groupName=' +this.ddrData.vectorName;
       if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
       this.url += '&generatorName=' +this.ddrData.generatorName;


      if (this.nsCommonData.objectType === '3')
        this.url += '&wanenv=NA';
      else
        this.url += '&wanenv=0';

      if (this.ddrData.errorUserSession)
        this.url += '&errorName=' + this.ddrData.errorUserSession;

      console.log("url for user session", this.url);
      let finalUrl = this.url + '&showCount=false' + '&queryId='+this.queryId;
      setTimeout(() => {
        this.openpopup();
       }, this.ddrData.guiCancelationTimeOut);
      this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => { (this.assignData(data)) });
   // this.http.get(this.url).subscribe(data => { (this.assignData(data)) });
    }
  }

  assignData(res) {
    this.isCancelQuerydata = true;
    this.UserSessionsData = res.data;
    this.loading = false;
    this.loader = false;
    this.createTable();
    this.showfilterCriteria(res.strStartTime, res.strEndTime);
  }

  createTable() {

    this.cols = [
      { field: 'scriptName', header: 'Script Name', sortable: true, color: 'black', action: true, width: '100' },
      { field: 'sessionId', header: 'Session Id', sortable: 'custom', color: 'black', action: true, width: '100' },
      { field: 'location', header: 'Location', sortable: true, color: 'black', action: false, width: '100' },
      { field: 'access', header: 'Access', sortable: true, color: 'black', action: false, width: '100' },
      { field: 'startTime', header: 'Start Time', sortable: 'custom', color: 'black', action: true, width: '100' },
      { field: 'totalTime', header: 'Total Time', sortable: 'custom', color: 'blue', action: true, width: '100' },
      { field: 'statusName', header: 'Status', sortable: true, color: 'black', action: true, width: '100' }
    ];

    this.visibleCols = ['scriptName', 'sessionId', 'startTime', 'totalTime', 'statusName'];
    if(this.ddrData.WAN_ENV < 1)
      {
      this.cols.splice(2,2);
      }

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1300 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;
  }


  /**Formatter cell data for converting ms to sec field */
  msToTimeFormate(duration) {
    if (!isNaN(duration)) {
      var milliseconds, seconds, minutes, hours, temp, time;

      time = +duration;
      time = Math.round(time);
      milliseconds = time % 1000;
      time = (time - milliseconds) / 1000;
      hours = parseInt(Number(time / 3600) + '');
      time = time % 3600;
      minutes = parseInt(Number(time / 60) + '');
      time = time % 60;
      seconds = parseInt(Number(time) + '');
      return (this.appendStringToTime(hours, minutes, seconds, milliseconds));
    }
    else
      return duration;
  }
  appendStringToTime(hh, mm, ss, msec) {
    if (msec < 10)
      msec = "0" + msec;
    if (msec < 100)
      msec = "0" + msec;
    if (mm < 10)
      mm = "0" + mm;
    if (ss < 10)
      ss = "0" + ss;
    if (hh < 10)
      hh = "0" + hh; // Make hrs 2 digit string

    return (hh + ":" + mm + ":" + ss + "." + msec);
  }

  makeSessionIndex(nodeData) {

    return this.childIndex + ":" + nodeData;
  }
  /*
  **FUnction used to custom sort 
  */
  sortColumnsOnCustom(event, tempData) {
    //for interger type data type
    if (event["field"] == 'sessionId') {
      if (event.order == -1) {
        var temp = (event["field"]);
        let arr1: any[];
        let arr2: any[];
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          arr1 = a[temp].split(":");
          arr2 = b[temp].split(":");
          if (arr1[0] == arr2[0]) {
            var value = Number(arr1[1]);
            var value2 = Number(arr2[1]);
          } else {
            var value = Number(arr1[0]);
            var value2 = Number(arr2[0]);
          }
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        let arr1: any[];
        let arr2: any[];
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          arr1 = a[temp].split(":");
          arr2 = b[temp].split(":");
          if (arr1[0] == arr2[0]) {
            var value = Number(arr1[1]);
            var value2 = Number(arr2[1]);
          } else {
            var value = Number(arr1[0]);
            var value2 = Number(arr2[0]);
          }
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    } else {
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
    }
    this.UserSessionsData = [];
    if (tempData) {
      tempData.map((rowdata) => { this.UserSessionsData = this.Immutablepush(this.UserSessionsData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  ngOnDestroy() {
    this.id = false;
    this.commonService.isFromTransactionInstance=false;
    this.commonService.isFromPageInstance=false;
  }

  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    if (this.visibleCols.length !== 0) {
      for (let i = 0; i < this.cols.length; i++) {
        for (let j = 0; j < this.visibleCols.length; j++) {
          if (this.cols[i].field === this.visibleCols[j]) {
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    // data.value.sort(function (a, b) {
    //   return parseFloat(a.index) - parseFloat(b.index);
    // });
    let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1300 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;
  }


  showfilterCriteria(startTime: any, endTime: any) {
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filterCriteria += ", DC=" + this.ddrData.dcName;

    if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      this.filterCriteria += ', From=' + startTime;
    }
    if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
      this.filterCriteria += ', To=' + endTime;
    }

    if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filterCriteria += ', Generator Name=' +this.ddrData.generatorName;
    
    if(this.ddrData.vectorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filterCriteria += ', Group Name=' +this.ddrData.vectorName;
    
    if (this.filterCriteria.startsWith(',')) {
      this.filterCriteria = this.filterCriteria.substring(1);
    }
  }

  openSessionName(rowData: any) {
    let url = this.getHostUrl() + '/' + this.urlParam.product +
      '/recorder/recorder.jsp?openFrom=TR' + this.urlParam.testRun +
      '&scriptName=' + rowData.scriptName;
    console.log('JNLP Launcher url ', url);

    window.open(url, "_blank");
  }

  getDataFromRow() {
    if (!this.nsCommonData.currRowData["userid"] && !this.nsCommonData.currRowData["userId"]) {
     // console.log("nsCommonDataaaaaaaa1111111111", this.nsCommonData.currRowData);
      this.commData = JSON.parse(sessionStorage.getItem("currRow"));
    //  console.log("commmData111111111111111",this.commData);
    }
    else {
     // console.log("nsCommonDataaaaaaaa", this.nsCommonData.currRowData);
      this.commData = JSON.parse(JSON.stringify(this.nsCommonData.currRowData));
     // console.log("commData222222222222222",this.commData);
    }

    if (this.nsCommonData.objectType === '2') //transaction
    {
      this.reportType = 'Transacion';
      this.userId = this.commData["userInst"];
      this.childIndex = this.commData["childIndex"];
      this.trxnInstance = this.commData["TransactionName"];
      this.scriptName = this.commData["scriptName"];
      this.location = this.commData["location"];
      this.access = this.commData["access"];
      this.filterCriteria += ', Transaction= ' + this.trxnInstance;
      this.filterCriteria += ', Script= ' + this.scriptName;
      this.filterCriteria += ', User Id= ' + this.userId;

    }
    else if (this.nsCommonData.objectType === '1') //page 
    {
      this.reportType = 'Page';
      let uId = this.commData["userId"];
      this.userId = uId.substring(uId.indexOf(':') + 1, uId.length);
      this.childIndex = this.commData["childIndex"];
      this.pageinst = this.commData["pageName"];
      this.scriptName = this.commData["scriptName"];
      this.location = this.commData["location"];
      this.access = this.commData["access"];
      this.filterCriteria += ', Script= ' + this.scriptName;
      this.filterCriteria += ', Page= ' + this.pageinst;
      this.filterCriteria += ', UserId= ' + this.userId;
    }
    else if (this.nsCommonData.objectType === '0') //url
    {
      this.reportType = 'Url';
      this.userId = this.commData["userId"];
      this.childIndex = this.commData["childIndex"];
      this.pageinst = this.commData["pageName"];
      this.scriptName = this.commData["scriptName"];
      this.urlIndex = this.commData["urlIndex"];
      this.filterCriteria += ', Script= ' + this.scriptName;
      this.filterCriteria += ', Page= ' + this.pageinst;
      this.filterCriteria += ', URL= ' + this.urlIndex;
      this.filterCriteria += ', UserId= ' + this.userId;
    }
    else if (this.nsCommonData.objectType === '3') //Session
    {
      this.reportType = 'Session';
      // console.log("userrrrrrrr iiiiid",this.commData);
      if (this.commData["userid"])
        this.userId = this.commData["userid"];
      if (this.commData["userId"])
        this.userId = this.commData["userId"];    // for url case
      if (this.commData["userInst"])
        this.userId = this.commData["userInst"];   //for transaction case

      let uId = this.commData["userId"];
      if (this.commData["userId"])
        this.userId = uId.substring(uId.indexOf(':') + 1, uId.length);  // for page case

      this.scriptName = this.commData["scriptName"];
      if (this.commData["childindex"])
        this.childIndex = this.commData["childindex"];
      if (this.commData["childIndex"])
        this.childIndex = this.commData["childIndex"];

      this.trxnInstance = this.commData["TransactionName"];     // for user-session via session timing in case of transaction instance
      this.pageinst = this.commData["pageName"];                //  for user-session via session timing in case of page
      this.location = this.commData["location"];
      this.access = this.commData["access"];
      this.urlIndex = this.commData["urlIndex"];

      if (this.trxnInstance)
        this.filterCriteria += ', Transaction= ' + this.trxnInstance; 
      if (this.pageinst)
        this.filterCriteria += ', Page= ' + this.pageinst;
      if (this.urlIndex)
        this.filterCriteria += ', URL= ' + this.urlIndex;
      if (this.userId)
        this.filterCriteria += ', UserId= ' + this.userId;   
      this.filterCriteria += ', Script= ' + this.scriptName;

    }
  }

  openSessionDetailReport(nodeData) {
    // console.log("userid....... ",this.nsCommonData.currRowData);
    if (this.nsCommonData.currRowData["userid"] || this.nsCommonData.currRowData["userId"]) {
      sessionStorage.removeItem("currRow");
      sessionStorage.setItem("currRow", JSON.stringify(this.nsCommonData.currRowData));
      // console.log('this.nsCommonData---------',sessionStorage.getItem("currRow"));
    }
    this.nsCommonData.currRowData = nodeData;
    this.nsCommonData.userId = this.userId;
    this.nsCommonData.objectType = '3';
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.USER_SESSION;
    this._router.navigate(['/home/ddr/nsreports/sessionTiming'])
  }

  makeajaxcallCount() {
    let countUrl = this.url + '&showCount=true';
    this.ddrRequest.getDataUsingGet(countUrl).subscribe(data => { (this.assignCountData(data)) });
  }

  assignCountData(res: any){
    console.log("res>>>>>>>>>>>>>"+JSON.stringify(res));
            this.count = res.totalCount;
            if(this.limit > this.count)
              this.limit = Number(this.count);
    }

/**  Pagination method */
paginate(event) {
  
   this.offset = parseInt(event.first); 
   this.limit = parseInt(event.rows); 
 
    if(this.limit > this.count)
      this.limit = Number(this.count);     
      this.loader = true;
      this.getProgressBar(); 
   if((this.limit + this.offset) > this.count)
     this.limit = Number(this.count) - Number(this.offset);
     this.makeajaxcall();
 }
  /** Method for progressbar */
  getProgressBar() {
    this.value =1;
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(interval);
      }
    }, 300);
  }
  setTestRunInHeader() {
    if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm') {
      this.strTitle = 'Netstorm - User Session Report - Test Run : ' + this.urlParam.testRun;
    }
    else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - User Session Report - Test Run : ' + this.urlParam.testRun;
     else {
      this.strTitle = 'Netdiagnostics Enterprise - User Session Report - Session : ' + this.urlParam.testRun;
    }
  }
/* Download report for URL SUmmary report  */
downloadReports(reports: string) {
  let downloadUserSessionInfo =JSON.parse(JSON.stringify(this.UserSessionsData));
  // console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaa down",this.userSessionDownloadData);

  let renameArray = { "scriptName": "Script Name", "sessionId": "Session Id", "location": "Location", "access": "Access", "startTime": "Start Time", "totalTime": "Total Time", "statusName": "Status"}
  let colOrder = ['Script Name', 'Session Id', 'Location', 'Access', 'Start Time', 'Total Time', 'Status'];

  downloadUserSessionInfo.forEach((val, index) => {

    val['startTime']= this.msToTimeFormate(val['startTime']);
    val['totalTime']= this.msToTimeFormate(val['totalTime']);
    val['sessionId']= (val['childIndex']+":"+val['sessionId']);
    delete val['browser'];
    delete val['childIndex'];
    delete val['abStarTime'];
    delete val['status'];
  
  });

  //console.log("down dataaaaaaaaaaaaaaaaaaaaaaaaaa down",this.userSessionDownloadData);

  let downloadObj: Object = {
    downloadType: reports,
    strRptTitle: this.strTitle,
    varFilterCriteria: this.filterCriteria,
    strSrcFileName: 'UserSession',
    renameArray: JSON.stringify(renameArray),
    colOrder: colOrder.toString(),
    jsonData: JSON.stringify(downloadUserSessionInfo)
  };
  let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product) +
    '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
  if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
      (this.openDownloadReports(res)));
  else
  this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
    (this.openDownloadReports(res)));
}
openDownloadReports(res) {
  console.log('file name generate ===', res);
  window.open(decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
   }

    
   randomNumber(){
    this.queryId = (Math.random() * 1000000).toFixed(0);
    console.log("queryId:::::::::::::"+this.queryId);
  }
  waitQuery()
  {
    this.isCancelQuery = false;
    setTimeout(() => {
      this.openpopup();
  }, this.ddrData.guiCancelationTimeOut);
  }
  
  onCancelQuery(){
      let url = "";
     url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.urlParam.testRun +"&queryId="+this.queryId;  
    console.log("Hello u got that",url);
      this.isCancelQuery = false;
       this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
    }
  
    openpopup(){
      if(!this.isCancelQuerydata)
      this.isCancelQuery =true;
    }


}


