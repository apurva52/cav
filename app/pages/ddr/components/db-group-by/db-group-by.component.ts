import { Component } from '@angular/core';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { SelectItem } from '../../interfaces/selectitem';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
// import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { MessageService } from '../../services/ddr-message.service';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'db-group-by',
  templateUrl: 'db-group-by.component.html',
  styleUrls: ['db-group-by.component.scss']
})
export class DbGroupByComponent {
  highcharts = Highcharts;
  filterInfo: any;
  urlStr: any;
  screenHeight: any;
  id: any;
  startTimeInMs: any;
  endTimeInMs: any;
  ajaxUrl: any;
  limit = 50;
  offset = 0;
  cols: any;
  dbQueryData: Array<DBQueryDataInterface>;
  headerInfo: string;
  CompleteURL: string;
  isFilterFromSideBar: boolean = false;
  showDownloadOption: boolean = true;
  totalCount: number;
  btOptions: any;
  respOptions: any
  totalQueryCount: string;
  topNQueries: any;
  btName: string;
  count: number;
  strTitle: string;
  loading: boolean;
  showChartForBT: boolean = true;
  showChartForRespTime: boolean = true;
  pieData: any;
  showAllOption: boolean = false;
  wholeData: any;
  headerName: string;

  filterTierName = '';
  filterServerName = '';
  filterInstanceName = '';
  filterGroupByStr = '';
  filterOrderByStr = '';
  completeTier = '';
  completeServer = '';
  completeInstance = '';
  completeGroupBy = '';
  completeOrderBy = '';

  downloadHeaderInfo = '';
  prevColumn;
  visibleCols: any[];
  columnOptions: SelectItem[];
  dynamicWidthColumn: number;  //  To calculate dynamic width of column
  isEnabledColumnFilter: boolean = false;
  toggleFilterTitle: string = 'Show Column Filters';

  //DC variables
  ndeCurrentInfo: any;
  ndeInfoData: any;
  protocol: string = '//';
  host = '';
  port = '';
  testRun: string;
  dcList: SelectItem[];
  selectedDC;
  showDCMenu = false;
  dcProtocol: string = '';
  tierName: string = "NA";
  showPagination: boolean = false;
  queryId: any;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  msgs: Message[] = [];
  private sideBarDbGroupBy: Subscription;
  //dataArr : any ;
  breadcrumb: BreadcrumbService;

  constructor(private http: HttpClient, public commonService: CommonServices,
    private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private _ddrData: DdrDataModelService, private _router: Router, private messageService: MessageService,
    // private breadcrumbService: DdrBreadcrumbService,
    private ddrRequest: DDRRequestService, breadcrumb: BreadcrumbService) {
      this.breadcrumb = breadcrumb;
  }
  ngOnInit() {
    this.screenHeight = Number(this.commonService.screenHeight) - 100;
    this.commonService.isToLoadSideBar = true;
    this.commonService.currentReport = "DBGroupBy";
    this.commonService.enableQueryCaching = this._ddrData.enableQueryCaching;
    this.loading = true;
    this.headerName = "DB Request";
    // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.DB_GROUPBY);
    this.breadcrumb.add({label: 'DB Group By BT', routerLink: '/ddr/dbGroupBy'});
    this.id = this.commonService.getData();
    this.randomNumber();
    console.log("this.id--", this.id);
    if ((this._router.url.indexOf('?') != -1) && (this._router.url.indexOf('/home/ED-ddr/dbGroupBy') != -1)) {
      let queryParams1 = location.href.substring(location.href.indexOf("?") + 1, location.href.length);
      this.id = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      sessionStorage.setItem("hostDcName", location.host);
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.id;
      this.commonService.dbDataFromFPInED = this.id
      this.commonService.dcNameList = this.id.dcNameList;
      this.commonService.selectedDC = this.id.dcName;
      this.commonService.isAllCase = this.id.isAll;
      this.commonService.tierNameList = this.id.tierNameList;
      if (this.id.dcNameList != null && this.id.dcNameList != '' && this.id.dcNameList != undefined && this.id.dcNameList != 'undefined') {
        sessionStorage.setItem("dcNameList", this.id.dcNameList);
        sessionStorage.setItem("tierNameList", this.id.tierNameList)
        sessionStorage.setItem("isAllCase", this.id.isAll);
      }
    }
    if (this._router.url.indexOf('/home/ED-ddr/dbGroupBy') != -1 && this.commonService.dbFilters['fromDBCallByBT'] == 'true')
      this.id = this.commonService.dbDataFromFPInED;
    console.log("this.id--from ed--", this.id);
    if (this.id.enableQueryCaching) {
      this.commonService.enableQueryCaching = this.id.enableQueryCaching;
    }
    if (this.id.strStartTime == undefined && this.id.strEndTime == undefined) {
      this.startTimeInMs = this.id.startTime;
      this.endTimeInMs = this.id.endTime;
    } else {
      this.startTimeInMs = this.id.strStartTime;
      this.endTimeInMs = this.id.strEndTime;
    }
    this.sideBarDbGroupBy = this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == "DBGroupBy") {
        console.log('data coming from side bar to db group by report', temp)
        this.commonService.isFilterFromSideBar = true;
        this.headerName = "DB Request";
        this.loading = true;
        this.limit = 50;
        this.offset = 0;
        this.getQueryData();

        /*  setTimeout(()=>{
            this.loading = false;
          },1000); */


      }
    })
    if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
      this.getDCData();
    } else {
      this.getQueryData();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      this.commonService.testRun = '';
      this.commonService.selectedDC = '';
    }

    this.setTestRunInHeader();
    this._ddrData.passMesssage$.subscribe((mssg) => { this.showMessage(mssg) });
  }
  getDCData() {
    let url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.id.testRun;
    //this.http.get(url).map(res => res.json()).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any>res;
      console.log('COMPONENT - db group by , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
      if (data.length == 0) {
        data = this.setNDEInfoForSingleDC();
        console.log("data is ", data);
      }
      if (this.commonService.dcNameList.indexOf(',') != -1) {
        this.getNDEInfo(data)
        console.log("111");
      } else {
        this.singleDCCase(data);
        console.log("222");
      }
    });
  }
  setNDEInfoForSingleDC() {
    let data;
    if (this.id.dcName)
      data = [{ "displayName": this.id.dcName, "ndeId": 1, "ndeIPAddr": this.id.dcIP, "ndeTomcatPort": this.id.dcPort, "ndeCtrlrName": "", "pubicIP": this.id.dcIP, "publicPort": this.id.dcPort, "isCurrent": 1, "ndeTestRun": this.id.testRun, "ndeProtocol": location.protocol.replace(":", "") }];
    else if (this.commonService.host) {
      let protocol;
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        protocol = this.commonService.protocol.replace("://", "");
      else
        protocol = location.protocol.replace(":", "");

      data = [{ "displayName": this.commonService.selectedDC, "ndeId": 1, "ndeIPAddr": this.commonService.host, "ndeTomcatPort": this.commonService.port, "ndeCtrlrName": "", "pubicIP": this.commonService.host, "publicPort": this.commonService.port, "isCurrent": 1, "ndeTestRun": this.commonService.testRun, "ndeProtocol": protocol }];
    }
    return data;
  }
  singleDCCase(res) {
    this.ndeInfoData = res;
    this.selectedDC = this.commonService.dcNameList;
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.commonService.dcNameList == this.ndeInfoData[i].displayName) {

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.protocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.protocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.id.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.id.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.protocol;
        this.commonService.testRun = this.testRun;
        console.log("this.commonService.testRun---", this.commonService.testRun);
        console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.loading = true;
    this.limit = 50;
    this.offset = 0;
    this.totalCount = 0;
    console.log("inside getselecteddc function ..going to call getquery data func");
    this.getQueryData();
  }


  getTierNamesForDC(dcName) {
    try {
      return new Promise<void>((resolve, reject) => {
        console.log('getting tiername');
        var tierList = "";
        console.log('this.commonService.tierNameList====>', this.commonService.tierNameList);
        if (this.commonService.tierNameList && this.commonService.tierNameList.toString().indexOf(",") !== -1) {
          var allTierDClistArr = this.commonService.tierNameList.split(",");
          for (var i = 0; i < allTierDClistArr.length; i++) {
            if (allTierDClistArr[i].startsWith(dcName)) {
              var temp = (allTierDClistArr[i]).substring(dcName.length + 1);
              tierList += temp + ",";
            }
          }
          console.log("after removing dcName from tierList ***** " + tierList);
          if (tierList == "")
            tierList = this.commonService.tierNameList;

          if (tierList)
            this.tierName = tierList;
        }
        else {
          if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
            temp = (this.commonService.tierNameList).substring(dcName.length + 1);
            tierList = temp;
            tierList = tierList.substring(0, tierList.length);
            if (tierList != "") {
              this.tierName = tierList;
              this.id.tierName = tierList;
              this.commonService.fpFilters['tierName'] = tierList;
            }
          } else {
            this.tierName = this.commonService.tierNameList;
            this.id.tierName = this.commonService.tierNameList;
            this.commonService.fpFilters['tierName'] = tierList;
          }
        }
        console.log('tierName=====>', this.tierName);
        this.getTieridforTierName(this.tierName).then(() => { console.log("******then aaa "); resolve() });
      });
    } catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getNDEInfo(res) {
    // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'DB Group By BT')
    if (this.breadcrumb && this.breadcrumb[0].label == 'DB Group By BT')
      this.showDCMenu = true;
    this.ndeInfoData = res;
    this.dcList = [];
    let dcName = this.commonService.dcNameList.split(',');
    let isFirst = false;

    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (dcName[i])
        this.dcList.push({ label: dcName[i], value: dcName[i] });

      if (this.commonService.selectedDC && this.commonService.selectedDC !== 'ALL') {
        this.selectedDC = this.commonService.selectedDC;
        console.log("this selected dc ", this.selectedDC);
      }
      else {
        console.log("else case")
        if (this.ndeInfoData[i].isCurrent == 1 && dcName.indexOf(this.ndeInfoData[i].displayName) != -1) {
          this.selectedDC = this.ndeInfoData[i].displayName;
          isFirst = true;
          console.log("Else case this selected dc ", this.selectedDC);
        } else if (i == (this.ndeInfoData.length - 1) && !isFirst)
          this.selectedDC = this.dcList[0];
        console.log("else if case isFirst false ", this.selectedDC);
      }
      if (this.selectedDC == this.ndeInfoData[i].displayName) {
        this.ndeCurrentInfo = this.ndeInfoData[i];
        console.log("if length case  ", this.selectedDC);
      }
    }

    if (dcName.length > this.ndeInfoData.length) {
      this.dcList = [];
      for (let k = 0; k < dcName.length; k++) {
        this.dcList.push({ label: dcName[k], value: dcName[k] });
      }
      console.log("this.dcList ==== ", this.dcList)
    }
    this.getSelectedDC();
  }

  getTieridforTierName(tierName) {
    return new Promise<void>((resolve, reject) => {
      try {
        console.log('reached here');
        var url = '';
        if (this.ndeCurrentInfo != undefined && this.ndeCurrentInfo != null && this.ndeCurrentInfo != '') {
          if (this.ndeCurrentInfo.ndeProtocol != undefined && this.ndeCurrentInfo.ndeProtocol != null && this.ndeCurrentInfo.ndeProtocol != '') {
            let protocol = this.ndeCurrentInfo.ndeProtocol;
            if (protocol.endsWith(":"))
              protocol = protocol.replace(":", "");

            url = protocol + '://' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          }
          else
            url = '//' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
        }
        else {
          url = this.checkAllCase();
          console.log("url==>", url);
        }
        url += '/' + this.id.product + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.id.testRun + "&tierName=" + tierName;
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
          this.assignTierID(data)
          resolve();
        });
      } catch (e) {
        console.log('exception in making rest=====', e);
      }
    });
  }
  checkAllCase() {
    let url;
    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
    //   url = this._ddrData.protocol + "://" + this.getHostUrl();
    // }
    // else
    url = this.getHostUrl();

    return url;
  }
  assignTierID(res) {
    try {
      var temp = res.split(":");
      this.id.tierid = temp[0].trim();
    } catch (e) {
      console.log('exception in getting tier id=====', e);
    }
  }
  getSelectedDC($event?) {
    if ($event) {
      this.selectedDC = $event.value;
      console.log("calling from dcMenu select case ", $event.value);
    }
    for (let i = 0; i < this.ndeInfoData.length; i++) {
      if (this.selectedDC == this.ndeInfoData[i].displayName) {

        this.ndeCurrentInfo = this.ndeInfoData[i];

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.dcProtocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.id.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.id.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.dcProtocol;
        this.commonService.testRun = this.testRun;
        this.commonService.selectedDC = this.selectedDC;
        console.log("this.commonService.testRun--", this.commonService.testRun);
        console.log('commonservece variable--------->', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.loading = true;
      /* setting limit and offset in case of dc changed */
      this.limit = 50;
      this.offset = 0;
      this.totalCount = 0;


      this.getQueryData();
    })
  }
  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      // hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      this.id.testRun = this._ddrData.testRun;
      this.testRun = this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
    }
    // else if(this._navService.getDCNameForScreen("dbQuery") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("dbQuery");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }
  createDynamicColumns() {
    this.visibleCols = ['count'];
    this.columnOptions = [{ label: 'Query Count', value: 'count' }];
    let dbParam = this.commonService.dbGroupByFilters;
    this.cols = [
      { field: 'urlName', header: 'Business Transaction', sortable: true, action: false, align: 'left' },
      { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left' },
      { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left' },
      { field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left' },

      //{ field: 'flowpathSignature', header: 'Flowpath Signature', sortable: true, action: false, align: 'left'},
      { field: 'BTCategory', header: 'BT Category', sortable: true, action: false, align: 'left' },
      { field: 'page', header: 'Page', sortable: true, action: false, align: 'left' },
      { field: 'session', header: 'Session', sortable: true, action: false, align: 'left' },
      { field: 'transaction', header: 'Transaction', sortable: true, action: false, align: 'left' },
      { field: 'count', header: 'Query Count', sortable: 'custom', action: true, align: 'right' },
    ];

    for (let value of this.cols) {

      if (dbParam['strGroup'].indexOf('url') != -1 && value['field'] == 'urlName') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Business Transaction', value: 'urlName' });
        this.visibleCols.push("urlName");
      }

      if (dbParam['strGroup'].indexOf('tier') != -1 && value['field'] == 'tierName') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Tier', value: 'tierName' });
        this.visibleCols.push("tierName");
      }
      if (dbParam['strGroup'].indexOf('server') != -1 && value['field'] == 'serverName') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Server', value: 'serverName' });
        this.visibleCols.push("serverName");
      }
      if (dbParam['strGroup'].indexOf('app') != -1 && value['field'] == 'appName') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Instance', value: 'appName' });
        this.visibleCols.push("appName");
      }
      /*   if (dbParam['strGroup'].indexOf('flowpathsignature') != -1 && value['field'] == 'flowpathSignature') {
           value['action'] = true;
         } */
      if (dbParam['strGroup'].indexOf('btcategory') != -1 && value['field'] == 'BTCategory') {
        value['action'] = true;
        this.columnOptions.push({ label: 'BT Category', value: 'BTCategory' });
        this.visibleCols.push("BTCategory");
      }
      if (dbParam['strGroup'].indexOf('page') != -1 && value['field'] == 'page') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Page', value: 'page' });
        this.visibleCols.push("page");
      }

      if (dbParam['strGroup'].indexOf('session') != -1 && value['field'] == 'session') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Session', value: 'session' });
        this.visibleCols.push("session");
      }

      if (dbParam['strGroup'].indexOf('transaction') != -1 && value['field'] == 'transaction') {
        value['action'] = true;
        this.columnOptions.push({ label: 'Transaction', value: 'transaction' });
        this.visibleCols.push("transaction");
      }
    }
    let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1180 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;

    console.log("this.cols--", JSON.stringify(this.cols));
  }
  openQueryCount(nodeInfo: any) {
    //let param = this.commonService.makeParamStringFromObj(nodeInfo);
    this._ddrData.queryCountToDBFlag = true;
    this.commonService.previousReport = 'DB Report';
    this.commonService.queryCountToDB = JSON.parse(JSON.stringify(nodeInfo));
    this.commonService.queryCountToDB['urlIndex'] = 'NA'; // because from nodeinfo we are copying urlIndex to queryCountToDB and in queryCountToDB we make changes in urlIdx
    this.commonService.queryCountToDB['testRun'] = this.id.testRun;
    this.commonService.queryCountToDB['product'] = this.id.product;
    this.commonService.queryCountToDB['urlIdx'] = nodeInfo.urlIndex;
    this.commonService.queryCountToDB['strStartTime'] = this.commonService.dbGroupByFilters['strStartTime'];
    this.commonService.queryCountToDB['tierName'] = this.commonService.dbGroupByFilters['tierName'];
    this.commonService.queryCountToDB['serverName'] = this.commonService.dbGroupByFilters['serverName'];
    this.commonService.queryCountToDB['appName'] = this.commonService.dbGroupByFilters['appName'];
    this.commonService.queryCountToDB['strEndTime'] = this.commonService.dbGroupByFilters['strEndTime'];
    this.commonService.queryCountToDB['sqlIndex'] = "NA";
    this.commonService.queryCountToDB['strGroup'] = "NA";
    this.commonService.queryCountToDB['strOrder'] = "query";
    if (this.commonService.isValidParameter(nodeInfo.BTCategory)) {
      this.commonService.queryCountToDB['btcategoryId'] = this.commonService.getBTCategoryID(nodeInfo.BTCategory);
    }

    this.commonService.queryCountToDB['fromDBCallByBT'] = 'true';
    console.log(" this.commonService.dbGroupByFilters--", this.commonService.dbGroupByFilters);
    if (this._router.url.indexOf('/home/ddrCopyLink') != -1) {
      this._router.navigate(['/home/ddrCopyLink/dbReport']);
    } else {
      this._router.navigate(['/ddr/dbReport']);
    }
  }
  getQueryData() {

    let urlParam;
    let url = "";
    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      url = this.getHostUrl();
    }
    else if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      if (url.indexOf("://") == -1)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = this.getHostUrl();
    }
    if (this.commonService.enableQueryCaching == 1) {
      url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?cacheId=" + this.id.testRun + "&testRun=" + this.id.testRun;
    }
    else {
      url += '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?" + "testRun=" + this.id.testRun;
    }

    console.log("url===== ", url);
    if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.dbGroupByFilters).length != 0) {
      let dbParam = this.commonService.dbGroupByFilters;

      if (this.commonService.isValidParamInObj(dbParam, 'ndeProtocol') && this.commonService.isValidParamInObj(dbParam, 'pubicIP') && this.commonService.isValidParamInObj(dbParam, 'publicPort') && this.commonService.isValidParamInObj(dbParam, 'ndeTestRun')) {
        if (this.commonService.enableQueryCaching == 1) {
          url = dbParam['ndeProtocol'] + "://" + dbParam['pubicIP'] + ":" + dbParam['publicPort'] + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?cacheId=' + dbParam['ndeTestRun'] + '&testRun=' + dbParam['ndeTestRun'];
        } else {
          url = dbParam['ndeProtocol'] + "://" + dbParam['pubicIP'] + ":" + dbParam['publicPort'] + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/flowpathqueryEx?testRun=' + dbParam['ndeTestRun'];
        }
        console.log("this.url--", url);
      }
      console.log(" COMPONENT - Flowpath group by, METHOD -  getFlowpathData, fpGroupByFilters got here", dbParam);
      urlParam = this.commonService.makeParamStringFromObj(dbParam);
    }
    else {
      urlParam =
        "&tierName=" + this.id.tierName +
        "&serverName=" + this.id.serverName +
        "&appName=" + this.id.appName +
        "&tierId=" + this.id.tierid +
        "&serverId=" + this.id.serverid +
        "&appId=" + this.id.appid +
        "&strStartTime=" + this.startTimeInMs +
        "&strEndTime=" + this.endTimeInMs +
        "&statusCode=-2" +
        "&strGroup=" + "url" +
        "&strOrderBy=count_desc" +
        "&object=6" +
        "&urlIndex=" + this.id.urlIndex +
        "&btcategoryId=" + this.id.btCategory +
        "&urlName=" + this.id.urlName +
        "&groupByFC=BT" +
        "&backend_ID=" + this._ddrData.backendId;

      let urlAjaxParamObject = this.commonService.makeObjectFromUrlParam(urlParam);
      this.commonService.dbGroupByFilters = urlAjaxParamObject;
      console.log(" this.commonService.dbGroupByFilters --", this.commonService.dbGroupByFilters);

      setTimeout(() => {
        this.messageService.sendMessage(this.commonService.dbGroupByFilters);
      }, 2000);
    }

    this.ajaxUrl = url + urlParam;
    let finalUrl = this.ajaxUrl + "&limit=" + this.limit + "&offset=" + this.offset + "&showCount=false" + "&queryId=" + this.queryId;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);
    console.log("finalUrl===== ", finalUrl);

    return this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => (this.assignDataValues(data)));

  }

  assignDataValues(res: any) {
    //console.log("data is", JSON.stringify(res));
    this.commonService.isFilterFromSideBar = false;
    this.loading = false;
    this.isCancelQuerydata = true;
    this.dbQueryData = res.data;
    this.wholeData = this.dbQueryData;
    if (this.dbQueryData.length == 0) {
      this.showDownloadOption = false;
      this.limit = 0;
      this.offset = 0;
    }
    else
      this.showDownloadOption = true;
    this.dbQueryData.forEach((val, index) => {
      val.BTCategory = this.commonService.getBTCategoryName(val.BTCategory);
      val.count = this.formatter(val.count);

    });
    this.getQueryDataCount();
    this.createDynamicColumns();
    this.createPieChart(this.dbQueryData);
    this.totalQueryCount = "DB Stats [ Total Query Count : " + res.queryCount + "]";
    this.commonService.dbGroupByFilters['startTimeInDateFormat'] = res.startTime;
    this.commonService.dbGroupByFilters['endTimeInDateFormat'] = res.endTime;
    this.showHeaderInfo();
  }
  formatter(data: any) {
    if (Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }
  getQueryDataCount() {
    let finalUrl = this.ajaxUrl + "&showCount=true" + "&queryId=" + this.queryId;
    return this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => (this.assignCountValues(data)));
  }
  assignCountValues(res) {
    this.totalCount = res.totalCount;
    if (this.totalCount > 50) { //If data is less then 50 then no pagination .
      this.showPagination = true;
    } else {
      this.showPagination = false;
    }
    if (this.totalCount > 0 && this.limit > this.totalCount)
      this.limit = Number(this.totalCount);
  }


  paginate(event) {
    console.log("event is --", event);
    this.offset = parseInt(event.first);
    this.limit = parseInt(event.rows);
    if (this.limit > this.totalCount) {
      this.limit = Number(this.totalCount);
    }
    if ((this.limit + this.offset) > this.totalCount) {
      this.limit = Number(this.totalCount) - Number(this.offset);
    }
    this.commonService.isFilterFromSideBar = true;
    this.getQueryData();
  }
  createPieChart(chartData: any) {

    let dataArr = [];
    let dataArrForRespTime = [];
    let dbParam = this.commonService.dbGroupByFilters;
    let groupChart = '';
    this.pieData = chartData;

    let avgRespTime = '';
    let count;
    let pieText = " DB Queries By Count";
    let pieText2 = " DB Queries By Response Time";
    if (this.pieData.length == 0) {
      this.showChartForBT = false;
      this.showChartForRespTime = false;
    }
    else {
      this.showChartForBT = true;
      this.showChartForRespTime = true;
    }
    for (var i = 0; i < this.pieData.length; i++) {
      groupChart = '';

      if (dbParam['strGroup'].indexOf('url') != -1)
        groupChart = this.pieData[i]["urlName"] + ",";

      if (dbParam['strGroup'].indexOf('tier') != -1) {
        groupChart += this.pieData[i]["tierName"] + ",";
      }
      if (dbParam['strGroup'].indexOf('server') != -1) {
        groupChart += this.pieData[i]["serverName"] + ",";
      }
      if (dbParam['strGroup'].indexOf('app') != -1) {
        groupChart += this.pieData[i]["appName"] + ",";
      }
      if (dbParam['strGroup'].indexOf('btcategory') != -1) {
        groupChart += this.pieData[i]["BTCategory"] + ",";
      }
      if (dbParam['strGroup'].indexOf('page') != -1)
        groupChart += this.pieData[i]["page"] + ",";

      if (dbParam['strGroup'].indexOf('session') != -1)
        groupChart += this.pieData[i]["session"] + ",";

      if (dbParam['strGroup'].indexOf('transaction') != -1)
        groupChart += this.pieData[i]["transaction"];

      if (groupChart.endsWith(','))
        groupChart = groupChart.substring(0, groupChart.length - 1);

      count = this.pieData[i]["count"];
      avgRespTime = this.pieData[i]["avg"];
      count = count.replace(/\,/g, '');
      dataArr.push({ "name": groupChart, "y": Number(count) });
      dataArrForRespTime.push({ "name": groupChart, "y": Number(avgRespTime) });
      // console.log("dataArr--", JSON.stringify(dataArr[i]));
    }
    this.btOptions = {
      chart: {
        type: "pie"
      },
      credits: {
        enabled: false
      },
      title: {
        text: pieText,
        style: { 'fontSize': '13px' }
      },
      legend: {
        itemWidth: 600
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, Count: <b> {point.y}</b>'
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
    this.respOptions = {
      chart: {
        type: "pie"
      },
      credits: {
        enabled: false
      },
      title: {
        text: pieText2,
        style: { 'fontSize': '13px' }
      },
      legend: {
        itemWidth: 600
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, Response Time: <b> {point.y}</b>'
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
          data: dataArrForRespTime,
          enableMouseTracking: true
        }
      ]

    };
  }

  clickHandlerBTCount(event) {
    //console.log("event--",event);
    this.headerName = "DB Request ";
    this.showAllOption = true;
    let filteredData = [];
    for (let k = 0; k < this.pieData.length; k++) {
      let count = this.pieData[k]['count'];
      count = count.replace(/\,/g, '');
      if (event.point.y == count) {
        filteredData.push(this.pieData[k]);
        break;
      }
    }
    //console.log("filteredData---",filteredData);
    this.dbQueryData = filteredData;
  }
  clickHandlerResponseTime(event) {
    this.showAllOption = true;
    let filteredData = [];
    for (let k = 0; k < this.pieData.length; k++) {
      if (event.point.y == this.pieData[k]['avg']) {
        this.headerName = "DB Request [ Response Time : " + this.pieData[k]['avg'] + " (in ms)]";
        filteredData.push(this.pieData[k]);
        break;
      }
    }
    // console.log("filteredData---",filteredData);
    this.dbQueryData = filteredData;
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
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;
  }


  toggleColumnFilter() {
    // if (this.isEnabledColumnFilter) {
    //   this.isEnabledColumnFilter = false;
    // } else {
    //   this.isEnabledColumnFilter = true;
    // }
    this.isEnabledColumnFilter = !this.isEnabledColumnFilter;
    this.changeColumnFilter();
  }


  /*This method is used to Enable/Disabled Column Filter*/
  changeColumnFilter() {
    try {
      let tableColumns = this.cols;
      if (this.isEnabledColumnFilter) {
        this.toggleFilterTitle = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitle = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }
  showAllData() {
    this.headerName = "DB Request";
    this.showAllOption = false;
    this.dbQueryData = this.wholeData;

  }

  sortColumnsOnCustom(event, tempData) {

    //for integer type data type

    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].replace(/,/g, ''));
        var value2 = Number(b[temp].replace(/,/g, ''));
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].replace(/,/g, ''));
        var value2 = Number(b[temp].replace(/,/g, ''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
    this.dbQueryData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.dbQueryData = this.Immutablepush(this.dbQueryData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  showHeaderInfo() {
    let dbGroupByFilters = this.commonService.dbGroupByFilters;
    this.headerInfo = "";
    this.downloadHeaderInfo = '';

    this.filterTierName = '';
    this.filterServerName = '';
    this.filterInstanceName = '';
    this.filterGroupByStr = '';
    this.filterOrderByStr = '';
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    this.completeGroupBy = '';
    this.completeOrderBy = '';
    let dcName;
    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
      dcName = this.selectedDC;
      this.downloadHeaderInfo = 'DC=' + dcName + ', ';
      this.filterTierName = 'DC=' + dcName + ', ';
    }

    else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;

      this.filterTierName = 'DC=' + dcName + ', ';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "tierName")) {
      if (dbGroupByFilters['tierName'].length > 32) {
        this.filterTierName += 'Tier=' + dbGroupByFilters['tierName'].substring(0, 32) + '..' + ' ,';
        this.completeTier = dbGroupByFilters['tierName'];
      } else
        this.filterTierName += 'Tier=' + dbGroupByFilters['tierName'] + ' ,';

      this.downloadHeaderInfo += 'Tier=' + dbGroupByFilters['tierName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "serverName")) {
      if (dbGroupByFilters['serverName'].length > 32) {
        this.filterServerName = 'Server=' + dbGroupByFilters['serverName'].substring(0, 32) + '..' + ' ,';
        this.completeServer = dbGroupByFilters['serverName'];
      } else
        this.filterServerName = 'Server=' + dbGroupByFilters['serverName'] + ' ,';

      this.downloadHeaderInfo += 'Server=' + dbGroupByFilters['serverName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "appName")) {
      if (dbGroupByFilters['appName'].length > 32) {
        this.filterInstanceName = ', Instance=' + dbGroupByFilters['appName'].substring(0, 32) + '..' + ' ,';
        this.completeInstance = dbGroupByFilters['appName'];
      } else
        this.filterInstanceName = 'Instance=' + dbGroupByFilters['appName'] + ' ,';

      this.downloadHeaderInfo += 'Instance=' + dbGroupByFilters['appName'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(dbGroupByFilters, "groupByFC")) {
      if (dbGroupByFilters['groupByFC'].length > 32) {
        this.filterGroupByStr = 'Group By=' + dbGroupByFilters['groupByFC'].substring(0, 32) + '..' + ' ,';
        this.completeGroupBy = dbGroupByFilters['groupByFC'];
      }
      else
        this.filterGroupByStr = 'Group By=' + dbGroupByFilters['groupByFC'] + ' ,';

      this.downloadHeaderInfo += 'Group By=' + dbGroupByFilters['groupByFC'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(dbGroupByFilters, "orderByFC")) {
      if (dbGroupByFilters['orderByFC'].length > 32) {
        this.filterOrderByStr = ', Order By=' + dbGroupByFilters['orderByFC'].substring(0, 32) + '..' + ' ,';
        this.completeOrderBy = dbGroupByFilters['orderByFC'];
      }
      else
        this.filterOrderByStr = 'Order By=' + dbGroupByFilters['orderByFC'] + ' ,';

      this.downloadHeaderInfo += 'Order By=' + dbGroupByFilters['orderByFC'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "startTimeInDateFormat")) {
      this.headerInfo += 'StartTime=' + dbGroupByFilters['startTimeInDateFormat'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(dbGroupByFilters, "endTimeInDateFormat")) {
      this.headerInfo += 'EndTime=' + dbGroupByFilters['endTimeInDateFormat'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "btcategoryId"))
      this.headerInfo += 'BT Type=' + this.commonService.getBTCategoryName(dbGroupByFilters['btcategoryId']) + ' ,';

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "urlName")) {
      this.headerInfo += 'BT=' + decodeURIComponent((dbGroupByFilters['urlName']).toString()) + ' ,';
    }
    if (this.commonService.isValidParamInObj(dbGroupByFilters, "url")) {
      let val = dbGroupByFilters['url'];
      if (val.length > 40) {
        this.urlStr = 'URL=' + val.substring(0, 40) + ".." + ' ,';
        this.CompleteURL = val;
      }
      else {
        this.urlStr = 'URL=' + val + ' ,';
        this.CompleteURL = val;
      }
      this.downloadHeaderInfo += 'URL=' + dbGroupByFilters['url'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(dbGroupByFilters, "statusCodeFC")) {
      this.headerInfo += 'Status =' + dbGroupByFilters['statusCodeFC'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "page")) {
      this.headerInfo += 'Page=' + dbGroupByFilters['page'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "script")) {
      this.headerInfo += 'Script=' + dbGroupByFilters['script'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "transaction")) {
      this.headerInfo += 'Transaction=' + dbGroupByFilters['transaction'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "browser")) {
      this.headerInfo += 'Browser=' + dbGroupByFilters['browser'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(dbGroupByFilters, "access")) {
      this.headerInfo += 'Access=' + dbGroupByFilters['access'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(dbGroupByFilters, "location")) {
      this.headerInfo += 'Location=' + dbGroupByFilters['location'] + ' ,';
    }

    if (this.headerInfo.startsWith(',')) {
      this.headerInfo = this.headerInfo.substring(1);
    }

    if (this.headerInfo.endsWith(',')) {
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    }

    this.downloadHeaderInfo += this.headerInfo;

  }
  setTestRunInHeader() {
    if (decodeURIComponent(this.id.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - DB Group By Report- Test Run : ' + this.id.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - DB Group By Report- Session : ' + this.id.testRun;
    }
  }

  downloadReport(reports: string) {
    let renameArray = {};
    let colOrder = [];
    let dbParam = this.commonService.dbGroupByFilters;
    // console.log("dbQueryData=========== ", JSON.stringify(this.dbQueryData));

    renameArray = { 'urlName': 'Business Transaction', 'count': 'FlowPath Count', 'tierName': 'Tier', 'serverName': 'Server', 'appName': 'Instance', 'BTCategory': 'BT Category', 'page': 'Page', 'session': 'Session', 'transaction': 'Transaction' }

    if (dbParam['strGroup'].indexOf('url') != -1)
      colOrder.push('Business Transaction');

    if (dbParam['strGroup'].indexOf('tier') != -1) {
      colOrder.push('Tier');
    }
    if (dbParam['strGroup'].indexOf('server') != -1) {
      colOrder.push('Server');
    }
    if (dbParam['strGroup'].indexOf('app') != -1) {
      colOrder.push('Instance');
    }
    if (dbParam['strGroup'].indexOf('btcategory') != -1) {
      colOrder.push('BT Category');
    }
    if (dbParam['strGroup'].indexOf('page') != -1)
      colOrder.push('Page');

    if (dbParam['strGroup'].indexOf('session') != -1)
      colOrder.push('Session');

    if (dbParam['strGroup'].indexOf('transaction') != -1)
      colOrder.push('Transaction');

    colOrder.push('FlowPath Count');

    this.dbQueryData.forEach((val, index) => {

      delete val['tierId'];
      delete val['serverId'];
      delete val['appId'];
      delete val['sqlQuery'];
      delete val['mincumsqlexectime'];
      delete val['maxcumsqlexectime'];
      delete val['sqlIndex'];
      delete val['min'];
      delete val['max'];
      delete val['avg'];
      delete val['urlIndex'];
      delete val['failedcount'];
      delete val['id'];

      if (dbParam['strGroup'].indexOf('tier') == -1) {
        delete val['tierName'];
      }
      if (dbParam['strGroup'].indexOf('server') == -1) {
        delete val['serverName'];
      }
      if (dbParam['strGroup'].indexOf('app') == -1) {
        delete val['appName'];
      }
    });

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.downloadHeaderInfo,
      strSrcFileName: 'FlowpathReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.dbQueryData)
    };
    let downloadFileUrl = '';

    downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product) +
      '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';

    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
        (this.openDownloadReports(res)));
    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    let url = this.getHostUrl(true) + '/' + '/common/' + res

    window.open(decodeURIComponent(url));
  }

  ngOnDestroy() {
    console.log("on destroy case--db report---");
    this.sideBarDbGroupBy.unsubscribe();
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

  showMessage(mssg: any) {
    this.msgs = [];
    if (mssg == "Query Saved") {
      let smsg = "Query Saved as " + this._ddrData.saveMessage;
      this.msgs.push({ severity: 'success', summary: 'Success Message', detail: smsg });
    }
    else if (mssg == "Query Already Defined")
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    else
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
  }


}
export interface DBQueryDataInterface {
  count: any;
  tierName: string;
  tierId: string;
  serverName: string;
  serverId: string;
  appName: string;
  appId: string;
  urlName: string;
  urlIndex: string;
  flowpathInstance: string;
  prevFlowpathInstance: string;
  startTime: string;
  fpCount: string;
  methodsCount: string;
  urlQueryParamStr: string;
  statusCode: string;
  threadId: string;
  BTCategory: string;
  startTimeInMs: string;
  id: number;
  totalError: string;
  nvSessionId: string;
  ndSessionId: string;
  nvPageId: string;
  threadName: string;
}

