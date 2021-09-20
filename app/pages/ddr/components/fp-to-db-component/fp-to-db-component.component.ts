import { Component, OnInit, Input } from '@angular/core';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { Observable } from 'rxjs';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { SelectItem } from '../../interfaces/selectitem';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { SqlQueryService } from '../../services/sql-query.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-fp-to-db-component',
  templateUrl: './fp-to-db-component.component.html',
  styleUrls: ['./fp-to-db-component.component.css']
})
export class FpToDbComponentComponent implements OnInit {

  highcharts = Highcharts;
  @Input() columnData: any;
  queryDetail: Object[] = [{
    "tiername": "", "tierid": "", "servername": "", "serverid": "", "appname": "", "appid": "", "urlName": "", "count": "", "min": "", "max": "", "cumsqlexectime": "", "mincumsqlexectime": "", "maxcumsqlexectime": "", "avg": "", "failedcount": "", "sqlindex": "", "sqlQuery": "", "urlIndex": "", "id": 0, "sqlbegintimestamp": "", "sqlendtimestamp": "", "sqlquery": ""
  }];
  queryInfo: Array<DataInterface>;
  id: any;
  cols = [];
  loading: boolean = false;
  limit = 50;
  offset = 0;
  visibleCols: any[];
  columnOptions: SelectItem[];
  prevColumn;
  url: string;
  endTimeInMs: string;
  dynamicWidthColumn: number;
  totalCount: any;
  screenHeight: any;
  showChart: boolean = false;
  options: Object;
  topNQueries: number = 0;
  fullQueryName: string;
  filterInfo: string;
  chartData: any;
  wholeData: any;
  restDataArrOfPie: any[];
  showAllOption: boolean = false;
  showDownloadOption: boolean = false;
  strTitle: string;
  pieChartMessage: string = "No Pie Chart found based on current Filter Settings."
  rowData: any = {};
  userName: any;
  clientConnectionKey: any = null;
  selectedRowInfo: any = [];
  display: boolean = false;
  hostIndex: number = 2;
  enableMsSql: boolean = false;
  showPagination: boolean = false;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId: any;
  breadcrumb: BreadcrumbService;
  empty: boolean;

  constructor(
    public commonService: CommonServices,
    private _cavConfigService: CavConfigService,
    private _navService: CavTopPanelNavigationService,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private _router: Router,
    private sqlQueryService: SqlQueryService,
    private ddrRequest: DDRRequestService,
    breadcrumb: BreadcrumbService,
    private sessionService:SessionService
  ) { this.breadcrumb = breadcrumb; }

  ngOnChanges() {
    if (this._ddrData.splitViewFlag)
      this._ddrData.setInLogger("DDR::Flowpath", "DB Query", "Open DB Query Report");
    console.log("columnData ==== ", this.columnData);
    if (this.columnData != undefined) {
      this.loading = true;
      this.id = JSON.parse(JSON.stringify(this.columnData));
      this.commonService.setFPData = JSON.parse(JSON.stringify(this.columnData));
      console.log("id *** ", this.id);
    }
    this.limit = 50;
    this.randomNumber();
    this.getData();
    this.makeColumns();
    this.setReportHeader();
  }

  ngOnInit() {
    this.loading = true;
    this.commonService.isToLoadSideBar = false;
    console.log("in ngonittt");
    if (this._ddrData.splitViewFlag == false) {
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTODB);
      this.breadcrumb.add({label: 'DB Queries', routerLink: '/ddr/flowpathToDB'});
      this.screenHeight = Number(this.commonService.screenHeight) - 97;
    }
    else
      this.screenHeight = Number(this.commonService.screenHeight) - 157;

    if (this.commonService.seqDiagToDBFlag == true)
      this.id = this.commonService.seqDiagToDBData;
    else {
      this.id = this.commonService.getFPData;
      if (this.id.testRun == undefined || this.id.product == undefined) {
        this.id.testRun = this.commonService.testRun;
        this.id.product = this.commonService.productName.replace("/", "");
      }
    }
    this.getMsSqlKeyword();

    console.log("this.id = ", this.id);
    if (this._ddrData.splitViewFlag == false) {
      this.getData();
      this.makeColumns();
      this.setReportHeader();

    }
  }
  getMsSqlKeyword() {
    let url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = this.getHostUrl();
    }

    url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/msSqlFromDB"
    try {
      this.ddrRequest.getDataUsingGet(url).subscribe(data => {
        console.log("data---", data);
        // if (data == "1")
        //   this.enableMsSql = true;
        // else
        //   this.enableMsSql = false;
      })
    }
    catch (e) {
      console.log("error--", e);
      this.enableMsSql = false;
    }

  }
  setReportHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1)
      this.strTitle = "Netstorm - DB Queries Report - Test Run : " + this.id.testRun;
    else
      this.strTitle = "Netdiagnostics Enterprise - DB Queries Report - Session : " + this.id.testRun;
  }

  makeColumns() {
    this.cols = [{ field: 'sqlquery', header: 'Query', sortable: true, action: true, align: 'left', color: 'black', width: '150' }];

    if (this.commonService.seqDiagToDBFlag == true) {
      this.cols = this.cols.concat({ field: 'tiername', header: 'Tier', sortable: true, action: false, align: 'left', color: 'black', width: '50' },
        { field: 'servername', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '50' },
        { field: 'appname', header: 'Instance', sortable: true, action: false, align: 'left', color: 'black', width: '50' });
    }
    else {
      this.cols = this.cols.concat({ field: 'sqlbegintimestamp', header: 'First Query Time', sortable: true, action: true, align: 'left', color: 'black', width: '125' },
        { field: 'sqlendtimestamp', header: 'Last Query Time', sortable: true, action: true, align: 'left', color: 'black', width: '125' });
    }

    this.cols = this.cols.concat({ field: 'count', header: 'Query Count', sortable: 'true', action: true, align: 'right', color: 'blue', width: '50' },
      { field: 'failedcount', header: 'Error Count', sortable: true, action: true, align: 'right', color: 'blue', width: '50' },
      // { field: 'min', header: 'Min Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '45' },
      // { field: 'max', header: 'Max Count', sortable: 'custom', action: true, align: 'right', color: 'black', width: '45' },
      { field: 'mincumsqlexectime', header: 'Min(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '60' },
      { field: 'maxcumsqlexectime', header: 'Max(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '60' },
      { field: 'avg', header: 'Average(ms)', sortable: 'true', action: true, align: 'right', color: 'black', width: '70' },
      { field: 'cumsqlexectime', header: 'Execution Time(ms)', sortable: true, action: true, align: 'right', color: 'black', width: '70' },
      { field: 'sqlindex', header: 'Sql Index', sortable: true, action: false, align: 'right', color: 'black', width: '50' }
    );

    //  if(this.commonService.seqDiagToDBFlag == true)
    //   this.cols = this.cols.concat({ field: 'cumsqlexectime', header: 'Execution Time(ms)', sortable: true, action: true, align: 'right', color: 'black', width: '70' });

    this.visibleCols = ['sqlquery', 'sqlQuery', 'sqlbegintimestamp', 'sqlendtimestamp', 'count', 'failedcount', 'mincumsqlexectime', 'maxcumsqlexectime', 'avg',
      'cumsqlexectime'];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    console.log('column options', this.columnOptions);

    let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1300 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 6;
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName;
    if (this._ddrData.isFromtrxFlow) {
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.id.testRun = this._ddrData.testRunTr;
      //   return hostDCName;
    }
    // Due to A-9 migration
    //  else if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      else if (this.sessionService.preSession.multiDc === true) {
        //  if(this._ddrData.protocol)
        //   hostDcName = this._ddrData.protocol + "://" + this._ddrData.host + ':' + this._ddrData.port;
        //  else
        //   hostDcName = "//" + this._ddrData.host + ':' + this._ddrData.port;
        this.id.testRun = this._ddrData.testRun;
        hostDcName = this._ddrData.getHostUrl(isDownloadCase) + "/tomcat" + "/ALL";
        console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
      }
      else {
        hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      // else if (this._navService.getDCNameForScreen("dbQuery") === undefined)
      //   hostDcName = this._cavConfigService.getINSPrefix();
      // else
      //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("dbQuery");

      // if (hostDcName.length > 0) {
      //   sessionStorage.removeItem("hostDcName");
      //   sessionStorage.setItem("hostDcName", hostDcName);
      // }
      // else
      //   hostDcName = sessionStorage.getItem("hostDcName");
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  // sortColumnsOnCustom(event, queryInfo) {
  //   let fieldValue = event["field"];
  //   if (fieldValue == "max" || fieldValue == "min") {
  //     if (event.order == -1) {
  //       event.order = 1
  //       queryInfo = queryInfo.sort(function (a, b) {
  //         var value = parseInt(a[fieldValue]);
  //         var value2 = parseInt(b[fieldValue]);
  //         return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //       });
  //     }
  //     else {
  //       event.order = -1;
  //       //asecding order
  //       queryInfo = queryInfo.sort(function (a, b) {
  //         var value = parseInt(a[fieldValue]);
  //         var value2 = parseInt(b[fieldValue]);
  //         return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
  //       });
  //     }
  //   }
  //   this.queryInfo = [];
  //   if (queryInfo) {
  //     queryInfo.map((rowdata) => { this.queryInfo = this.Immutablepush(this.queryInfo, rowdata) });
  //   }
  // }

  sortColumnsOnCustom(event) {
    //console.log("Inside sorting method ===", event);
    //for integer type data type
    if (event["field"] === "count" ||
      event["field"] === "failedcount" || event["field"] === "sqlindex") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    //for floating decimal points
    else if (event["field"] === "mincumsqlexectime" ||
      event["field"] === "maxcumsqlexectime" ||
      event["field"] === "avg" ||
      event["field"] === "cumsqlexectime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = parseFloat(a[temp]);
          var value2 = parseFloat(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = parseFloat(a[temp]);
          var value2 = parseFloat(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    //for date format
    else if (event["field"] === "sqlbegintimestamp" ||
      event["field"] === "sqlendtimestamp") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
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

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
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
    let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1300 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 6;
  }

  getData() {
    let finalURL;
    let pagination = '&limit=' + this.limit + '&offset=' + this.offset;
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        this.url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        this.url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        this.url = "// " + this.commonService.host + ':' + this.commonService.port;
    } else {
      this.url = this.getHostUrl();
    }

    if (this.id.fpDuration) {
      if (this.id.fpDuration.toString() == '< 1')
        this.endTimeInMs = (Number(this.id.startTimeInMs) + Number(0)).toString();
      else if (this.id.fpDuration.toString().includes(','))
        this.endTimeInMs = (Number(this.id.startTimeInMs) + Number(this.id.fpDuration.toString().replace(/,/g, ""))).toString();
      else
        this.endTimeInMs = (Number(this.id.startTimeInMs) + Number(this.id.fpDuration)).toString();
    }
    if (this.commonService.enableQueryCaching == 1) {
      this.url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/dbRequestEx?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun + "&object=6" + "&tierId=" + this.id.tierId +
        "&serverId=" + this.id.serverId + "&appId=" + this.id.appId + "&flowpathInstance=" + this.id.flowpathInstance + "&statusCode=-2" +
        "&strStartTime=" + this.id.startTimeInMs + "&strEndTime=" + this.endTimeInMs + '&sqlIndex=' + this.id.sqlIndex;
    } else {
      this.url += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/dbRequestEx?testRun=" + this.id.testRun + "&object=6" + "&tierId=" + this.id.tierId +
        "&serverId=" + this.id.serverId + "&appId=" + this.id.appId + "&flowpathInstance=" + this.id.flowpathInstance + "&statusCode=-2" +
        "&strStartTime=" + this.id.startTimeInMs + "&strEndTime=" + this.endTimeInMs + '&sqlIndex=' + this.id.sqlIndex;
    }
    this.url += '&queryId=' + this.queryId;
    finalURL = this.url + pagination + "&showCount=false";
    this.isCancelQuerydata = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);
    console.log("final url *** ", finalURL);
    return this.ddrRequest.getDataUsingGet(finalURL).subscribe(
      data => { (this.doAssignValue(data)) },
      error => {
        this.loading = false;
        if (error.hasOwnProperty('message')) {
          this.commonService.showError(error.message);
        }
      });
  }

  doAssignValue(res: any) {
    this.isCancelQuerydata = true;
    this.loading = false;
    if (res.hasOwnProperty('Status')) {
      this.commonService.showError(res.Status);
    }
    this.queryDetail = res.data;
    console.log("queryDetail = ", this.queryDetail);
    if (this.queryDetail.length == 0) {
      this.fullQueryName = 'No Query is present';
      this.showDownloadOption = false;
      this.empty = true;
    }
    else
      this.showDownloadOption = true;
    this.queryInfo = this.getQueryInfo();
    this.getDataCount();
    this.createPieChart(res);
    this.createFilterCriteria(res.startTime, res.endTime);

  }

  getDataCount() {
    this.url += '&showCount=true';
    console.log("url  = ", this.url);
    return this.ddrRequest.getDataUsingGet(this.url).subscribe(data => this.doAssignCountValue(data));
  }

  doAssignCountValue(res: any) {
    this.totalCount = res.totalCount;

    if (this.totalCount > 50) { //If data is less then 50 then no pagination .
      this.showPagination = true;
    } else {
      this.showPagination = false;
    }
    if (this.limit > Number(this.totalCount))
      this.limit = Number(this.totalCount);
  }


  paginate(event) {
    this.loading = true;
    this.offset = parseInt(event.first);
    this.limit = parseInt(event.rows);
    if (this.limit > this.totalCount) {
      this.limit = Number(this.totalCount);
    }
    if ((this.limit + this.offset) > this.totalCount) {
      this.limit = Number(this.totalCount) - Number(this.offset);
    }
    this.getData();
  }
  getRowInfo(event: any) {
    this.rowData = event.data;
    console.log("event.data--", event.data);
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  openMssqlPopUp() {
    console.log("this.selectedRowInfo--", this.selectedRowInfo);
    if (this.selectedRowInfo.length == 0) {
      alert("No Record Selected. Please Select One Row");
      return;
    }
    this.display = true;
  }
  getMssqlData() {
    if (this.hostIndex.toString() == '') {
      this.hostIndex = 2;
    }
    console.log("hostIndex--", this.hostIndex);
    let timestamp = new Date().getTime();
    console.log("$clientConnectionKey----", this._cavConfigService.$clientConnectionKey);
    console.log("$userName----", this._cavConfigService.$userName);
    this.clientConnectionKey = this._cavConfigService.$clientConnectionKey
    this.userName = this._cavConfigService.$userName

    if (this._cavConfigService.$userName == null || this._cavConfigService.$clientConnectionKey == null) {
      console.log("getting from restoreconfiguration");
      this._cavConfigService.restoreConfiguration();
      this.clientConnectionKey = this._cavConfigService.$clientConnectionKey
      this.userName = this._cavConfigService.$userName
      console.log("$clientConnectionKey 2----", this.clientConnectionKey);
      console.log("$userName 2----", this.userName);
    }

    if (this.clientConnectionKey === null || this.clientConnectionKey === undefined) {
      this.clientConnectionKey = this.userName + '.' + this.id.testRun + '.' + timestamp;
      console.log("$clientConnectionKey 3----", this.clientConnectionKey);
      console.log("$userName 3----", this.userName);

    }


    //  this.rowData = node ;
    let msSQL_URL = "";
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        msSQL_URL = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        msSQL_URL = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        msSQL_URL = "// " + this.commonService.host + ':' + this.commonService.port;
    } else {
      msSQL_URL = this.getHostUrl();
    }
    if (this.commonService.enableQueryCaching == 1) {
      msSQL_URL += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/getIPNameForSqlIndex?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun + "&object=6" + "&tierId=" + this.id.tierId +
        "&serverId=" + this.id.serverId + "&appId=" + this.id.appId + "&fpInstance=" + this.id.flowpathInstance + "&statusCode=-2" +
        "&strStartTime=" + this.id.startTimeInMs + "&strEndTime=" + this.endTimeInMs + '&sqlIndex=' + this.rowData.sqlindex;
    } else {
      msSQL_URL += '/' + this.id.product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/getIPNameForSqlIndex?testRun=" + this.id.testRun + "&object=6" + "&tierId=" + this.id.tierId +
        "&serverId=" + this.id.serverId + "&appId=" + this.id.appId + "&fpInstance=" + this.id.flowpathInstance + "&statusCode=-2" +
        "&strStartTime=" + this.id.startTimeInMs + "&strEndTime=" + this.endTimeInMs + '&sqlIndex=' + this.rowData.sqlindex;
    }
    console.log()
    this.ddrRequest.getDataUsingGet(msSQL_URL).subscribe(data => this.redirectToMSSQLReport(data));
  }
  redirectToMSSQLReport(res) {
    let backendIp = '';
    console.log("now res in redirectToMSSQLReport", res);
    let BackendName = res.backendName.replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n")
    console.log("BackendName---", BackendName);
    let str = BackendName.split("_");
    let index = this.hostIndex - 1;
    backendIp = str[index];
    console.log("BackendIP---", backendIp);
    console.log("row data to open MSSQLReport---", this.rowData);
    let beginTime = this.rowData.sqlbegintimestamp.split(" ");
    let endTime = this.rowData.sqlendtimestamp.split(" ");

    if (this.rowData.sqlquery == undefined) {
      console.log("this.rowData.sqlquery is undefined");
      return;
    }
    else {
      console.log("else this.rowData.sqlquery--", this.rowData.sqlquery);
      if (this.rowData.sqlquery.length > 1000) {
        let query = this.rowData.sqlquery.substring(0, 1000)
        this.sqlQueryService.$drillDownQuery = encodeURIComponent(query);
      }
      else {
        this.sqlQueryService.$drillDownQuery = encodeURIComponent(this.rowData.sqlquery);
      }
      console.log("this.sqlQueryService.$drillDownQuery", this.sqlQueryService.$drillDownQuery);
    }

    console.log('this.sqlQueryService.$drillDownQuery--', this.sqlQueryService.$drillDownQuery);
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      this.sqlQueryService.$sql_host = this.commonService.host
      this.sqlQueryService.$sql_port = Number(this.commonService.port);
    }
    else {
      let hostUrlString = this.getHostUrl().substring(2);
      console.log("hostUrlString--", hostUrlString);
      let hostUrl = hostUrlString.split(":");
      console.log("hostUrl--", hostUrl);
      this.sqlQueryService.$sql_host = hostUrl[0];
      this.sqlQueryService.$sql_port = Number(hostUrl[1]);
      console.log("this.sqlQueryService.$sql_host--", this.sqlQueryService.$sql_host);
      console.log("this.sqlQueryService.$sql_port--", this.sqlQueryService.$sql_port);
    }

    this.sqlQueryService.$sql_testRun = this.id.testRun;
    this.sqlQueryService.$sql_clientConnectionKey = this.clientConnectionKey
    this.sqlQueryService.$sql_productName = this.id.product.replace("/", "");
    this.sqlQueryService.$sql_userName = this.userName;
    this.sqlQueryService.isOnlineTest = false;
    this.sqlQueryService.$startDate = beginTime[0];
    this.sqlQueryService.$startTime = beginTime[1];
    this.sqlQueryService.$endDate = endTime[0];
    this.sqlQueryService.$endTime = endTime[1];
    this.sqlQueryService.$drillDownIP = backendIp;
    this.sqlQueryService.$selectedPreset = 'Custom';
    this.sqlQueryService.$isDrillDownQuery = true;
    //  this.sqlQueryService.$isAgg = true;
    if (this.sqlQueryService.$dbMonitorUIJson == undefined || this.sqlQueryService.$dbMonitorUIJson.length < 1) {
      //this.sqlQueryService.getUIDetails();
    }
    this.sqlQueryService.$DataBaseType = 0;
    sessionStorage.setItem('sqlDataBaseType', '0');
    // sessionStorage.setItem('sqlPlanThresold', this._dataService.getDashboardConfigData().msSqlPlanThreshold.toString());


    // this.sqlQueryService.getDbServerList(false);
    let dataSubscription = this.sqlQueryService.dbListAvailableObservable$.subscribe(
      value => {
        if (value) {
          this._navService.addNewNaviationLink('msSql');
          this._navService.addDCNameForScreen('msSql', this._cavConfigService.getActiveDC());
          this._router.navigate(['/home/msSql/sqlActivity/dbQueryStats']);
        } else {
          alert('No DB Servers configured for MSSQL Monitoring.');
        }
      },
      err => {
        dataSubscription.unsubscribe();
      },
      () => {
        dataSubscription.unsubscribe();
      });
  }
  createFilterCriteria(startTime: any, endTime: any) {
    let dcName = "";
    this.filterInfo = '';
    if (this.commonService.selectedDC) {
      dcName = this.commonService.selectedDC;
      console.log("valueee of dcName", dcName);
    }
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;

      console.log("valueeeeeeeeeee inside dcName", dcName);
    }
    if (this.validateField(dcName)) {
      this.filterInfo = "DC= " + dcName + ',';
      if (this._ddrData.isFromtrxFlow && !this._ddrData.isFromAgg) {
        this.filterInfo = 'DC=' + this._ddrData.dcNameTr + ', ';
      }
    }

    if (this.validateField(this.id.tierName))
      this.filterInfo += " Tier= " + this.id.tierName;
    if (this.validateField(this.id.serverName))
      this.filterInfo += ", Server= " + this.id.serverName;
    if (this.validateField(this.id.appName))
      this.filterInfo += ", Instance= " + this.id.appName;
    if (this.validateField(startTime))
      this.filterInfo += ", From= " + startTime;
    if (this.validateField(endTime))
      this.filterInfo += ", To= " + endTime;
    if (this.validateField(this.id.urlName))
      this.filterInfo += ", BT= " + decodeURIComponent(this.id.urlName);
    if (this.validateField(this.id.btCatagory))
      this.filterInfo += ", BT Type= " + this.getBTCategory(this.id.btCatagory);

    if (this.filterInfo && this.filterInfo.startsWith(','))
      this.filterInfo = this.filterInfo.substring(1);
  }

  getBTCategory(category) {
    if (category === '12') {
      category = 'Very Slow';
    }
    if (category === '11') {
      category = 'Slow';
    }
    if (category === '10') {
      category = 'Normal';
    }
    if (category === '13') {
      category = 'Errors';
    }
    if (category === '0') {
      category = 'Other';
    }
    return category;
  }

  validateField(param: string) {
    if (param == null || param == 'NA' || param == '' || param == 'undefined' || param == undefined || param == '-')
      return false;
    else
      return true;
  }

  createPieChart(res: any) {
    this.pieChartMessage = "No Pie Chart found based on current Filter Settings.";
    if (res.isAvgTotalZero) {
      this.pieChartMessage = "No Pie chart is found as Avg Response Time of query is zero"
      this.showChart = false;
      console.log("inside condition");
      return;
    }
    console.log("oustide condition");
    if (this.topNQueries == 0)
      this.topNQueries = 5;

    this.chartData = res.data;
    this.wholeData = this.chartData;
    let dataArr = [];
    let restDataArr = [];
    let queryName;
    let totalResTime = 0;
    let pieText;

    if (this.chartData.length != 0) {
      this.showChart = true;
      for (let i = 0; i < this.chartData.length; i++) {
        if (i < this.topNQueries) {
          pieText = 'Top ' + this.topNQueries + ' DB Queries By Response Time';
          queryName = this.chartData[i]['sqlquery'];
          dataArr.push({ 'name': queryName, 'y': Number(this.chartData[i]['avg']) });
        }
        else
          restDataArr.push(this.chartData[i]);
      }
      this.restDataArrOfPie = restDataArr;

      if (this.chartData.length > this.topNQueries) {
        queryName = 'Other';
        for (let j = 0; j < restDataArr.length; j++) {
          totalResTime += Number(restDataArr[j]['avg']);
        }
        dataArr.push({ 'name': queryName, 'y': totalResTime });
      }

      this.options = {
        chart: {
          type: "pie",
          width: 380,
          height: 350
        },
        credits: {
          enabled: false
        },
        title: {
          text: pieText,
          style: { 'fontSize': '13px' }
        },
        legend: {
          itemWidth: 380
        },
        tooltip: {
          //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, Count: <b> {point.y}</b>',
          style: { fontSize: '7pt', width: '300px' },
          formatter: function () {
            let tooltip = "";
            let pointName = this.point.name;
            if (pointName.length > 60)
              tooltip += pointName.substring(0, 60) + "...";
            else
              tooltip += pointName;
            tooltip += " Percentage: " + "<b>" + this.point.percentage.toFixed(2) + "%" + "</b>" + ", Response Time: " + "<b>" + this.point.y + "</b>";
            return tooltip;
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: "Percentage",
            data: dataArr,
            enableMouseTracking: true
          }
        ]
      };
    }
    else
      this.showChart = false;
  }

  getQueryInfo(): Array<DataInterface> {
    let dataArr = [];

    for (let i = 0; i < this.queryDetail.length; i++) {
      if (this.queryDetail[i]['sqlQuery'] != undefined)
        this.queryDetail[i]['sqlQuery'] = this.queryDetail[i]['sqlQuery'].replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");
      else
        this.queryDetail[i]['sqlquery'] = this.queryDetail[i]['sqlquery'].replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");

      if (i == 0) {
        this.fullQueryName = this.queryDetail[i]['sqlQuery'] || this.queryDetail[i]['sqlquery'];
      }
      dataArr[i] = {
        tiername: this.queryDetail[i]["tiername"], tierid: this.queryDetail[i]["tierid"], servername: this.queryDetail[i]["servername"],
        serverid: this.queryDetail[i]["serverid"], appname: this.queryDetail[i]["appname"], appid: this.queryDetail[i]["appid"],
        count: this.queryDetail[i]["count"], min: this.queryDetail[i]["min"], max: this.queryDetail[i]["max"], avg: this.queryDetail[i]["avg"],
        failedcount: this.queryDetail[i]["failedcount"], sqlQuery: this.queryDetail[i]["sqlQuery"], sqlindex: this.queryDetail[i]["sqlindex"], sqlIndex: this.queryDetail[i]["sqlIndex"],
        mincumsqlexectime: this.queryDetail[i]["mincumsqlexectime"], maxcumsqlexectime: this.queryDetail[i]["maxcumsqlexectime"],
        urlName: this.queryDetail[i]["urlName"], urlIndex: this.queryDetail[i]["urlIndex"], sqlquery: this.queryDetail[i]["sqlquery"],
        sqlbegintimestamp: this.queryDetail[i]["sqlbegintimestamp"], sqlendtimestamp: this.queryDetail[i]["sqlendtimestamp"],
        cumsqlexectime: this.queryDetail[i]["cumsqlexectime"]
      };
    }

    console.log("dataArr--", dataArr);
    console.log("colsss---", this.cols)
    return dataArr;
  }

  showRowInfo(rowData: any) {
    console.log("rowData ** ", rowData);
    if (rowData.sqlQuery == undefined)
      this.fullQueryName = rowData.sqlquery;
    else
      this.fullQueryName = rowData.sqlQuery;
  }

  clickHandler(event) {
    this.showAllOption = true;
    let filteredDataArr = [];
    if (event.point.name == 'Other')
      this.queryInfo = this.restDataArrOfPie;
    else {
      for (let j = 0; j < this.chartData.length; j++) {
        if (this.chartData[j]['sqlquery'] == event.point.name || this.chartData[j]['sqlQuery'] == event.point.name)
          filteredDataArr.push(this.chartData[j]);
      }
      this.queryInfo = filteredDataArr;
    }
    this.showRowInfo(this.queryInfo[0]);
  }

  showAllData() {
    this.showAllOption = false;
    this.queryInfo = this.wholeData;
  }

  deleteObjProp(json, arr) {
    json.forEach((val, index) => {
      arr.forEach((key, i) => {
        if (val.hasOwnProperty(key))
          delete val[key];
      });
    });
  }

  downloadReport(type) {
    let downloadData = JSON.parse(JSON.stringify(this.queryInfo));
    let renameArray = { "tiername": "Tier", "servername": "Server", "appname": "Instance", "sqlquery": "Query", "sqlbegintimestamp": "FirstQueryTime", "sqlendtimestamp": "LastQueryTime", "count": "Query Count", "failedcount": "Error Count", "mincumsqlexectime": "Min(ms)", "maxcumsqlexectime": "Max(ms)", "avg": "Average(ms)", "cumsqlexectime": "Execution Time(ms)", "sqlindex": "Sql Index" };
    let colOrder = ["Tier", "Server", "Instance", "Query", "FirstQueryTime", "LastQueryTime", "Query Count", "Error Count", "Min(ms)", "Max(ms)", "Average(ms)", "Execution Time(ms)"];

    let tempCols = [];
    for (var i = 0; i < this.visibleCols.length; i++) {
      if (renameArray[this.visibleCols[i]]) {
        tempCols.push(renameArray[this.visibleCols[i]]);
      }
    }

    let allRenameKeys = Object.keys(renameArray);
    let tempKeys = allRenameKeys.filter(
      (val) => {
        return this.visibleCols.indexOf(val) == -1;
      }); //filter hide column keys

    this.deleteObjProp(downloadData, tempKeys);

    downloadData.forEach((val, idx) => {
      delete val['tierid'];
      delete val['serverid'];
      delete val['appid'];
      delete val['flowpathinstance'];
      delete val['id'];
      delete val['urlName'];
      delete val['querytype'];
      delete val['sqlexectime'];
      delete val['urlIndex'];
      delete val['urlname'];
      delete val['sqlIndex'];
      delete val['ThreadId'];
      delete val['_$visited'];
      delete val['min'];
      delete val['max'];
    });

    console.log("downloadData for download *** ", downloadData);
    let dataObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterInfo,
      strSrcFileName: "DBQueries",
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: tempCols.toString(),
      jsonData: JSON.stringify(downloadData)
    }
    let downloadFileUrl = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {

      if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
        downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
      }
      else {
        downloadFileUrl = this.commonService.protocol + '://' + this.commonService.host + ':' + this.commonService.port + '/' + this.id.product.replace("/", "");
      }
    } else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product.replace("/", ""));
    }
    downloadFileUrl += "/v1/cavisson/netdiagnostics/ddr/downloadAngularReport";
    // Due to A9 migration
    // if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      if (this.sessionService.preSession.multiDc === true || (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/ALL"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (dataObj)).subscribe(res =>
        (this.showDownloadReport(res)));
    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(dataObj)).subscribe(res =>
        (this.showDownloadReport(res)));
    }
  }

  showDownloadReport(res) {
    let url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = decodeURIComponent(this.getHostUrl(true));
    }
    url += "/common/" + res;
    window.open(url);
  }

  randomNumber() {
    this.queryId = (Math.random() * 1000000).toFixed(0);
    console.log("queryId:::::::::::::" + this.queryId);
  }
  waitQuery() {
    this.isCancelQuery = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);
  }

  onCancelQuery() {
    let url = "";

    url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/", "")) + "/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun=" + this.id.testRun + "&queryId=" + this.queryId;
    console.log("Hello u got that", url);
    this.isCancelQuery = false;
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => { return data });
  }

  openpopup() {
    if (!this.isCancelQuerydata)
      this.isCancelQuery = true;
  }


}

export interface DataInterface {
  tiername: string;
  tierid: string;
  servername: string;
  serverid: string;
  appname: string;
  appid: string;
  count: string;
  min: string;
  max: string;
  cumsqlexectime: string;
  mincumsqlexectime: string;
  maxcumsqlexectime: string;
  avg: string;
  failedcount: string;
  sqlIndex: string;
  sqlQuery: string;
  urlName: string;
  urlIndex: string;
  sqlbegintimestamp: string;
  sqlendtimestamp: string;
  id: number;
}
