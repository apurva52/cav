import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
import { CommonServices } from '../../services/common.services';
import 'rxjs/Rx';
import { ChartModule } from 'angular2-highcharts';
import { SelectItem } from '../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../../main/services/cav-config.service';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
import { DdrDataModelService } from '../../../../main/services/ddr-data-model.service';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Message } from 'primeng/primeng';
import { DDRRequestService } from '../../services/ddr-request.service';
// import { Logger } from '../../../../../vendors/angular2-logger/core';

@Component({
  selector: 'app-ddr-integrated-flowpath',
  templateUrl: './ddr-integrated-flowpath.component.html',
  styleUrls: ['./ddr-integrated-flowpath.component.css']
})
export class DdrIntegratedFlowpathComponent implements OnInit {

  flowpathData: Array<FlowpathDataInterface>;
  columnOptions: SelectItem[];
  urlParam: any;
  loading = false;
  ajaxLoader = true;
  loader: boolean = false;
  headerInfo = '';
  options: Object;
  barChartOptions: Object;
  cols: any;
  chartData: Object[];
  showBarChart = true;
  showChart = true;
  fpStats: any;
  btArray: any;
  showDownLoadReportIcon = true;
  strTitle: any;
  showAllOption = false;
  pointName: any;
  queryData: Array<FlowpathDataInterface>;
  fpTotalCount: any;
  fpLimit = 50;
  fpOffset = 0;
  toggleFilterTitle = '';
  isEnabledColumnFilter = true;
  display: boolean = false;
  standselect: boolean = false;
  methselect: boolean = false;
  custselect: boolean = false;
  respselect: boolean = false;
  custom: string;
  standard: string;
  strDate: Date;
  endDate: Date;
  threadId: any;
  strTime: string;
  endTime: string;
  standardTime: SelectItem[];
  respdrop: SelectItem[];
  selectedTime: any;
  selectedResponse: any;
  selectedvalue: any;
  msg: string;
  value: number = 1;
  trStartTime: any;
  trEndTime: any;
  reportHeader: string;
  minMethods: number;
  responseTime: number;
  resptimeqmode: number;
  responseTime2: number;
  timefilter: boolean = false;
  prevColumn;
  visibleCols: any[];
  tableOptions: boolean = true;
  optionsButton: boolean = true;
  selectedTab: boolean = true;
  fpSignatureFlag = false;
  signatureToFP = false;
  signatureRowData: any;
  paginationFlag: boolean = true;
  showHeaderForGrpByBT: boolean = false;
  copyFlowpathLink;
  msgs: Message[];
  customFlag: boolean = false;
  screenHeight: any;
  fromHsFlag: string = "";
  tierId: string = "NA";
  serverId: string = "NA";
  appId: string = "NA";
  correlationId: string = "NA";
  mode: string;
  responseCompare: any;
  btCategory: any;
  tierName: string = "NA";
  serverName: string = "NA";
  appName: string = "NA";
  flowpathID: any;
  strStartTime: any;
  strEndTime: any;
  showCount: any;
  flowpathEndTime: any;
  sqlIndex: any;
  urlName: string = "NA";
  urlIndex: string = "NA";
  strGroupBy: string = "NA";
  strOrderBy: string = "NA";
  statusCode: string = "NA";
  flowpathSignature: string = "NA";
  flag: any;
  url: string;   //this url will be send for ajax call to get fp data
  displayPopUp: boolean = false;
  // commonService.showTransactionFlowmap : boolean = false;
  ngOnInit() {
    this.loading = true;
    this.fpLimit = this.commonService.rowspaerpage;
    this.screenHeight = Number(this.commonService.screenHeight) - 130;
    this.breadcrumbService.setBreadcrumbs('integratedFlowpath');
    this.urlParam = this.commonService.getData();
    if(this._router.url.indexOf('?') != -1 && (this._router.url.indexOf('/home/ddrCopyLink/integratedFlowpath') != -1
    || this._router.url.indexOf('/home/ED-ddr/integratedFlowpath') != -1)) {
      // alert("in this condition"+location.search);
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.urlParam = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      sessionStorage.setItem('hostDcName', location.host);
      console.log('starttttttttttttttttttt in      ', this.urlParam, queryParams1)
      // sessionStorage.setItem("product",this.urlParam.product);
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.urlParam;
    //  this.urlParam.startTime = this.urlParam.strStartTime;
     // this.urlParam.strEndTime = this.urlParam.strEndTime;
      this.commonService.isIntegratedFlowpath = true;
    }
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    this.reportHeader = 'FlowPath Report- ' + this.urlParam.testRun;

    /*
    console.log("after apply" ,this.commonService._ddrSideBarOnApply );
    this.commonService.sideBarObservable$.subscribe((temp) => {
    console.log('temp=================================================',temp);
 
    let keys = Object.keys(temp);
    this.flag = temp['sideBarParamaterFlag']; 
    this.assignCustomQueryParam(temp);
    this.loader = true;
    this.getFlowpathData();
    }); */

    this.fillData();
  }
  constructor(private http:HttpClient, public  commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService,
    private flowmapDataService: DdrTxnFlowmapDataService,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private _changeDetection: ChangeDetectorRef,
    private ddrRequest:DDRRequestService) {

  }


  fillData() {
    try {
      this.createDropDownMenu();
      this.changeColumnFilter();
      // getting table data from server
      this.getFlowpathData();
      if (this._ddrData.FromhsFlag != 'true')
        this.getFlowpathDataCount();
      this.createLinkForCopy();
      this.setTestRunInHeader();
      this.cols = [
        { field: 'tierName', header: 'Tier', sortable: true, action: true },
        { field: 'serverName', header: 'Server', sortable: true, action: false },
        { field: 'appName', header: 'Instance', sortable: 'custom', action: true },
        { field: 'urlName', header: 'Business Transaction', sortable: true, action: true },
        { field: 'flowpathInstance', header: 'FlowpathInstance', sortable: 'custom', action: false },
        { field: 'urlQueryParamStr', header: 'URL', sortable: true, action: true },
        { field: 'btCatagory', header: 'Category', sortable: true, action: true },
        { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true },
        { field: 'fpDuration', header: 'Response Time(ms)', sortable: 'custom', action: true },
        { field: 'btCpuTime', header: 'CPU Time(ms)', sortable: 'custom', action: true },
        { field: 'methodsCount', header: 'Methods', sortable: 'custom', action: true },
        { field: 'callOutCount', header: 'CallOuts', sortable: 'custom', action: true },
        { field: 'totalError', header: 'CallOut Errors', sortable: 'custom', action: false },
        { field: 'dbCallCounts', header: 'DB Callouts', sortable: 'custom', action: true },
        { field: 'statusCode', header: 'Status', sortable: 'custom', action: false },
        { field: 'correlationId', header: 'Corr ID', sortable: 'custom', action: false },
        { field: 'ndSessionId', header: 'ND Session ID', sortable: 'custom', action: false },
        { field: 'nvPageId', header: 'NV Page ID', sortable: 'custom', action: false },
        { field: 'coherenceCallOut', header: 'Coherence CallOut', sortable: 'custom', action: false },
        { field: 'jmsCallOut', header: 'JMS CallOut', sortable: 'custom', action: false },
        { field: 'nvSessionId', header: 'NV Session ID', sortable: 'custom', action: false },
        { field: 'waitTime', header: 'Wait Time(ms)', sortable: 'custom', action: false },
        { field: 'syncTime', header: 'Sync Time(ms)', sortable: 'custom', action: false },
        { field: 'iotime', header: 'IO Time(ms)', sortable: 'custom', action: false },
        { field: 'suspensiontime', header: 'Suspension Time(ms)', sortable: 'custom', action: false },
        { field: 'storeId', header: 'Store ID', sortable: 'custom', action: false },
        { field: 'terminalId', header: 'Terminal ID', sortable: 'custom', action: false }

      ];

      this.visibleCols = [
        'tierName', 'appName', 'urlName', 'urlQueryParamStr', 'btCatagory', 'startTime', 'fpDuration', 'btCpuTime', 'methodsCount', 'callOutCount',
        'dbCallCounts'
      ];

      this.columnOptions = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
      console.log('column options', this.columnOptions);
    } catch (error) {
      console.log('error in intialization compaonent --> ', error);
    }
  }
  createLinkForCopy() {
    this.copyFlowpathLink = this.getHostUrl() + '/ProductUI/#/home/ddrCopyLink/integratedFlowpath?testRun=' + this.urlParam.testRun + "&tierName=" + this.urlParam.tierName + "&serverName=" + this.urlParam.serverName + "&appName=" + this.urlParam.appName + "&startTime=" + this.urlParam.startTime + "&endTime=" + this.urlParam.endTime + '&product=' + this.urlParam.product + "&btCategory=" + this.urlParam.btCategory + "&minMethods=" + this.minMethods + '&urlName=' + this.urlParam.urlName + "&statusCode=-2";
  }
  createDropDownMenu() {
    this.standardTime = [];
    this.respdrop = [];
    this.standardTime.push({ label: 'Last 10 minutes', value: '10' });
    this.standardTime.push({ label: 'Last 30 minutes', value: '30' });
    this.standardTime.push({ label: 'Last 1 hour', value: '60' });
    this.standardTime.push({ label: 'Last 2 hours', value: '120' });
    this.standardTime.push({ label: 'Last 4 hours', value: '240' });
    this.standardTime.push({ label: 'Last 8 hours', value: '480' });
    this.standardTime.push({ label: 'Last 12 hours', value: '720' });
    this.standardTime.push({ label: 'Last 24 hours', value: '1440' });
    this.standardTime.push({ label: 'Total Test Run', value: 'Whole Scenario' });

    this.respdrop.push({ label: '<=', value: { id: 10 } });
    this.respdrop.push({ label: '>=', value: { id: 11 } });
    this.respdrop.push({ label: '=', value: { id: 12 } });
  }

  openFlowPathCount(rowData: any, flag) {
    console.log('rowData-----------', rowData)
    this.signatureRowData = {};
    if (flag === 'grpByBT') {
      this._ddrData.fpByBTFlag = true;
      this.commonService.fpByBTData = rowData;
      this.tableOptions = true;
    } else if (flag === 'fpSignature') {
      this.signatureToFP = true;
      this.signatureRowData = rowData;
      this.fpSignatureFlag = false;
    }
    this.getFlowpathData();
    this.getFlowpathDataCount();
  }

  openDBReports(data: any, flag) {

    this.commonService.showDbreport = false;
    this.commonService.openFlowpath = false;
    this.checkFpInstance(data.flowpathInstance);
    this._changeDetection.detectChanges();
    console.log('data items', data);
    if (flag === 'signature') {
      console.log('inside signature to DB')
      if (data.fpDuration == '< 1') {
        data.fpDuration = 0;
        this.commonService.setFPData = data;
      } else {
        this.commonService.setFPData = data;
      }
      this.commonService.signatureToDB = true;
      this.setInStorage(data, 'signature');
    } else {
      if (data.fpDuration == '< 1') {
        data.fpDuration == 0;
        this.commonService.setFPData = data;
      } else {
        this.commonService.setFPData = data;
      }
      this._ddrData.dbFlag = true;
      this.setInStorage(data, 'fptoDB');
    }
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.showDbreport = true;
    this.commonService.openDbTab = true
    //  if(this._router.url.indexOf('/home/ddrCopyLink') != -1) {
    //   this._router.navigate(['/home/ddrCopyLink/query']);
    //  } else {
    //   this._router.navigate(['/home/ddr/query']);
    //  }
  }

  setInStorage(data: any, flag) {
    if (flag === 'signature') {
      console.log('insdie signature case')
      sessionStorage.removeItem('dbData');
      sessionStorage.setItem('dbData', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('dbData');
      sessionStorage.removeItem('dbFlag');
      sessionStorage.setItem('dbData', JSON.stringify(data));
      sessionStorage.setItem('dbFlag', 'true');
    }
  }
  /**used to open MethodTiming Report from Flowpath report */
  openMethodTiming(rowData, flag) {
    this.commonService.showMethodTiming = false;
    this.commonService.openFlowpath = false;
    this.checkFpInstance(rowData.flowpathInstance)
    this._changeDetection.detectChanges();
    let reqData = {};
    console.log('Row data is:', rowData);
    let endTimeInMs = 0;
    if (rowData !== undefined) {
      if (rowData.fpDuration.toString().includes(','))
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration.toString().replace(/,/g, ""));
      else if (rowData.fpDuration == '< 1') {
        rowData.fpDuration = 0
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);
      }
      else
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);
      reqData['flowpathInstance'] = rowData.flowpathInstance;
      reqData['urlIndex'] = rowData.urlIndex;
      reqData['tierId'] = rowData.tierId;
      reqData['serverId'] = rowData.serverId;
      reqData['appId'] = rowData.appId;
      reqData['strStartTime'] = rowData.startTimeInMs;
      reqData['strEndTime'] = endTimeInMs;
      reqData['urlName'] = rowData.urlName;
      reqData['urlQueryParamStr'] = rowData.urlQueryParamStr;
      reqData['btCatagory'] = rowData.btCatagory;
    }
    this.commonService.mtData = reqData;
    this._ddrData.mtFlag = 'true';

    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.showMethodTiming = true;
    this.commonService.openMethodTimingTab = true
    // if(this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
    //   this._router.navigate(['/home/ddrCopyLink/methodtiming']);
    // } else {
    //   this._router.navigate(['/home/ddr/methodtiming']);
    // }
  }

  openExceptionReport(rowData: any) {
    console.log('rowData-->', rowData);
    this.commonService.showExceptionReport = false;
    this.commonService.openFlowpath = false;
    this.checkFpInstance(rowData.flowpathInstance)
    this._changeDetection.detectChanges();

    if (rowData !== undefined) {
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
      this._ddrData.flowpathToExFlag = true;
      if (rowData.fpDuration == '< 1') {
        rowData.fpDuration = 0;
        this.commonService.flowpathToExData = rowData;
      } else {
        this.commonService.flowpathToExData = rowData;
      }
      this.commonService.showExceptionReport = true;
      this.commonService.openExceptionTab = true;
      // if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
      //   this._router.navigate(['/home/ddrCopyLink/exception']);
      // } else {
      //   this._router.navigate(['/home/ddr/exception']);
      // }
    }
  }

  // openHotspotReport(data: any) {
  //   console.log('row data------------->', data);
  //   if(data !== undefined) {
  //     this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
  // if(data.fpDuration == '< 1') {
  //   data.fpDuration = 0;
  //   this.commonService.hsData = data;
  // }else {
  //   this.commonService.hsData = data;        
  // }
  //     this.commonService.hsFlag = true;
  // if(this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
  //   this._router.navigate(['/home/ddrCopyLink/hotspot']);
  // }else if(this._router.url.indexOf('/home/ED-ddr') != -1)
  //    {
  //      this._router.navigate(['home/ED-ddr/hotspot']);
  //    } else{
  //   this._router.navigate(['/home/ddr/hotspot']);
  // }
  // }
  // }

  openHotspotReport(data: any) {
    console.log('row data------------->', data);
    if (data !== undefined) {

      let fpinstance = data.flowpathInstance
      if (undefined != data.fpDuration) {

        if (data.fpDuration == '< 1')
          data.fpDuration = 0;

        var endTime;
        if (data.fpDuration.toString().includes(','))
          endTime = Number(data.startTimeInMs) + Number(data.fpDuration.toString().replace(/,/g, ""));
        else
          endTime = Number(data.startTimeInMs) + Number(data.fpDuration);
      }

      //Ajax Call To Check Whether The Data in Hotspot is present or not.
      let url = '&tierId=' + data.tierId +
        '&appId=' + data.appId +
        '&serverId=' + data.serverId +
        '&strStartTime=' + data.startTimeInMs +
        '&strEndTime=' + endTime +
        '&threadId=' + data.threadId +
        '&btCategory=' + data.btCatagory +
        '&appName=' + data.appName +
        '&serverName' + data.serverName +
        '&tierName' + data.tierName +
        '&flowpathInstance=' + data.flowpathInstance;
      var endpoint_url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) +
        "/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?testRun=" + this.urlParam.testRun + url;
      return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.hotspotData(data, fpinstance)));

    }
  }

  hotspotData(data, fpinstance) {
    if (data.data.length <= 0) {
      // Display msg in Flowpath Component that no data is present for hotspot.
      this.displayPopUp = true;
    }
    else {
      // Else route to Hotspot component with ajax call Data.
      this.commonService.showHotspot = false;
      this.checkFpInstance(fpinstance)
      this._changeDetection.detectChanges();
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
      this.commonService.hsFlag = true;
      this.commonService.hsData = data;
      this.commonService.showHotspot = true
      this.commonService.openFlowpath = false;
      this.commonService.openHotspotTab = true;
      //  if(this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
      //   this._router.navigate(['/home/ddrCopyLink/hotspot']);
      // }else if(this._router.url.indexOf('/home/ED-ddr') != -1)
      //    {
      //      this._router.navigate(['home/ED-ddr/hotspot']);
      //    } else{
      //   this._router.navigate(['/home/ddr/hotspot']);
      // }
    }
  }


  paginate(event) {
    // event.first = Index of the first record  (used  as offset in query) 
    // event.rows = Number of rows to display in new page  (used as limit in query)
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    this.commonService.rowspaerpage = event.rows;
    this.fpOffset = parseInt(event.first);
    this.fpLimit = parseInt(event.rows);
    if (this.fpLimit > this.fpTotalCount) {
      this.fpLimit = Number(this.fpTotalCount);
    }
    if ((this.fpLimit + this.fpOffset) > this.fpTotalCount) {
      this.fpLimit = Number(this.fpTotalCount) - Number(this.fpOffset);
    }
    this.loader = true;
    this.getProgressBar();
    this.getFlowpathData();
  }
  hello() {
    alert('hello');
  }
  openMethodCallingTree(rowData) {
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.showMethodCallingTree = false;
    this.checkFpInstance(rowData.flowpathInstance);
    this._changeDetection.detectChanges();
    if (rowData != undefined) {
      if (rowData.fpDuration == '< 1') {
        rowData.fpDuration = 0;
        this.commonService.mctData = rowData;
      } else {
        this.commonService.mctData = rowData;
      }
      this.commonService.mctFlag = true;
    }
    this.commonService.showMethodCallingTree = true;
    this.commonService.openFlowpath = false;
    this.commonService.openMethodCallingTreeTab = true;
    //this._changeDetection.detectChanges();
    // if(this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
    //   this._router.navigate(['/home/ddrCopyLink/methodCallingTree']);
    // } else {
    //   this._router.navigate(['/home/ddr/methodCallingTree']);
    // }
  }

  openHttpReport(rowData) {
    let reqData = {};
    let endTimeInMs = 0;
    //this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.showHttp = false;
    this._changeDetection.detectChanges();
    this.checkFpInstance(rowData.flowpathInstance)
    
    if (rowData !== undefined) {
      if (rowData.fpDuration.toString().includes(','))
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration.toString().replace(/,/g, ""));
      else if (rowData.fpDuration == '< 1') {
        rowData.fpDuration = 0
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);
      }
      else
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);

      reqData['fpInstance'] = rowData.flowpathInstance;
      reqData['tierName'] = rowData.tierName;
      reqData['serverName'] = rowData.serverName;
      reqData['appName'] = rowData.appName;
      reqData['strStartTime'] = rowData.startTimeInMs;
      reqData['strEndTime'] = endTimeInMs;
    }
    this.commonService.httpData = reqData;
    this.commonService.httpFlag = true;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    this.commonService.showHttp = true;
    this.commonService.openFlowpath = false;
    this.commonService.openHttpTab = true;
    // this._changeDetection.detectChanges();
    // if(this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
    //   this._router.navigate(['/home/ddrCopyLink/httpReqResp']);
    // } else {
    //   this._router.navigate(['/home/ddr/httpReqResp']);
    // }
  }

  onStrDate(event) {
    console.log(event);
    let date = new Date(event);
    this.strTime = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log(this.strTime);
  }

  onEndDate(event) {
    let date = new Date(event);
    this.endTime = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log(this.endTime);
  }

  applyFilter() {
    if (this.timefilter == true || this.respselect == true || this.methselect == true) {

      if (this.timefilter == true) {

        if (this.custselect == true) {
          if (this.strDate == null || this.endDate == null) {
            if (this.strDate == null && this.endDate != null)
              this.msg = "Start time cannot be empty";
            else if (this.endDate == null && this.strDate != null)
              this.msg = "End time cannot be empty"
            else
              this.msg = "Start time and end time cannot be empty";
          }
          else {
            if (this.strDate > this.endDate)
              this.msg = "Start time cannot be greater than end time";
            else {
              this.customFlag = true;
              this.trStartTime = this.strTime;
              this.trEndTime = this.endTime;

              if (this.respselect == true) {
                if (this.selectedResponse != "") {
                  this.custselect = false;
                  this.standselect = false;
                  this.strDate = null;
                  this.endDate = null;
                  this.msg = "";
                  this.loader = true;
                  this.getProgressBar();
                  this.getFlowpathData();
                  this.display = false;
                }
                else
                  this.msg = "Response Time is not Selected";
              }

              if (this.respselect == false) {
                this.custselect = false;
                this.standselect = false;
                this.strDate = null;
                this.endDate = null;
                this.msg = "";
                this.loader = true;
                this.getProgressBar();
                this.getFlowpathData();
                this.display = false;
              }
            }
          }
        }

        else if (this.standselect == true) {
          if (this.selectedTime == "" || this.selectedTime == undefined)
            this.msg = 'Selected time is not valid';
          else {
            if (this.respselect == true) {
              if (this.respselect == true && this.selectedResponse != "") {
                let restDrillDownUrl = this.urlParam.restDrillDownUrl;
                this.ddrRequest.getDataUsingGet(restDrillDownUrl).subscribe(data => (this.setTimeFilter(data)));
              }
              else
                this.msg = "Response time is not Selected";
            }

            if (this.respselect == false) {
              let timeFilterUrl = this.getHostUrl() + "/DashboardServer/web/commons/getTimeStampForDDR?testRun=" + this.urlParam.testRun + "&graphTimeKey=" + this.selectedTime;
              this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => (this.setTimeFilter(data)));
            }

          }
        }
      }

      else {
        if ((this.respselect == true && this.selectedResponse != "") && this.methselect == true) {
          this.custselect = false;
          this.standselect = false;
          this.standard = '';
          this.msg = "";
          this.loader = true;
          this.getProgressBar();
          this.getFlowpathData();
          this.display = false;

        }

        if (this.methselect == true) {
          if (this.respselect == true && this.selectedResponse == "")
            this.msg = "Response Time is not Selected";
          if (this.respselect == false) {
            this.custselect = false;
            this.standselect = false;
            this.standard = '';
            this.msg = "";
            this.loader = true;
            this.getProgressBar();
            this.getFlowpathData();
            this.display = false;

          }

        }

        if (this.respselect == true && this.selectedResponse != "") {
          if (this.methselect == false) {
            this.custselect = false;
            this.standselect = false;
            this.standard = '';
            this.msg = "";
            this.loader = true;
            this.getProgressBar();
            this.getFlowpathData();
            this.display = false;
          }
        }

        if (this.respselect == true && this.selectedResponse == "")
          this.msg = "Response Time is not Selected"


      }

    }
    else {
      this.msg = 'No Filter is Selected';
      this.loading = false;
    }
  }

  close() {
    this.display = false;
    this.standselect = false;
    this.custselect = false;
    this.strDate = null;
    this.endDate = null;
    this.timefilter = false;
    this.standard = '';
    this.msg = "";
    this.selectedTime = "";

  }

  standFunction() {
    this.msg = "";
    this.standselect = false;
    this.custselect = true;
    this.selectedTime = "";
  }

  custFunction() {
    this.strDate = null;
    this.endDate = null;
    this.msg = "";
    this.custselect = false;
    this.standselect = true;
  }

  methFunction() {
    if (this.methselect == false)
      this.methselect = true;
    else
      this.methselect = false;

    this.minMethods = 0;

  }

  respFunction() {
    if (this.respselect == false)
      this.respselect = true;
    else
      this.respselect = false;

    this.selectedResponse = "";
    this.responseTime = 0;
  }


  timefiltersFunction() {
    if (this.timefilter == false) {
      this.timefilter = true;
      this.standard = 'standard';
      this.standselect = true;
    }
    else {
      this.timefilter = false;
      this.standselect = false;
      this.custselect = false;
      this.standard = '';
      this.msg = "";
    }

  }


  showDialog() {
    this.display = true;
    this.timefilter = false;
    this.methselect = false;
    this.respselect = false;
    this.custselect = false;
    this.standselect = false;
    this.standard = '';
    this.msg = "";
    this.minMethods = 0;
    this.responseTime = 0;
    this.selectedResponse = '';
  }

  getProgressBar() {
    this.value = 1;
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(interval);
      }
    }, 300);
  }

  getFlowpathData() {
    try {
      this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
        this.urlParam.testRun;
      this.makeAjaxParameter();
      /* if (this._ddrData.FromexpFlag == 'true') {
         console.log('Inside exptofpflag block..');
         console.log('in this case data is: ', this.commonService.exptoFpData);
         url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
             this.urlParam.testRun +
           '&flowpathID=' + this.commonService.exptoFpData.flowPathInstance +
           '&tierName=' + this.commonService.exptoFpData.tierName +
           '&serverName=' + this.commonService.exptoFpData.serverName +
           '&appName=' + this.commonService.exptoFpData.appName +
           '&tierid=' + this.commonService.exptoFpData.tierid +
           '&serverId=' + this.commonService.exptoFpData.serverid +
           '&appId=' + this.commonService.exptoFpData.appid +
           '&urlName=' + this.urlParam.urlName +
           '&FPstatusCode=-2' +
           '&object=4' +
           '&strStartTime=' + this.trStartTime +
           '&strEndTime=' + this.trEndTime;
           
       }
       
       else if (this._ddrData.FromhsFlag == 'true') {
         this.paginationFlag=false;
         this.fromHsFlag = this._ddrData.FromhsFlag;
           url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
             this.urlParam.testRun +
           '&tierName=' + this.commonService.hstofpData.tierName +
           '&serverName=' + this.commonService.hstofpData.serverName +
           '&appName=' + this.commonService.hstofpData.appName +
           '&tierId=' + this.commonService.hstofpData.tierId +
           '&serverId=' + this.commonService.hstofpData.serverId +
           '&appId=' + this.commonService.hstofpData.appId +
           '&strStartTime=' + this.commonService.hstofpData.hsTimeInMs +
           '&threadId=' + this.commonService.hstofpData.threadId+
           '&strEndTime=' + this.commonService.hstofpData.hsEndTime+
           '&urlName=' + this.urlParam.urlName +
           '&showCount=false'+
           '&flowpathEndTime=' + this.commonService.hstofpData.flowpathEndTime;
 
           if(this.commonService.hstofpData.threadId != undefined || this.commonService.hstofpData.threadId != "NA")
           url += '&threadId=' + this.commonService.hstofpData.threadId;
       }
      else if (this.commonService.dbtoflowpath == true)
       {    console.log("Db queries to flowpath case") ;
       url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
             this.urlParam.testRun + 
           '&tierName=' + this.commonService._dbflowpathdata.tierName +
           '&serverName=' + this.commonService._dbflowpathdata.serverName +
           '&appName=' + this.commonService._dbflowpathdata.appName +
           '&tierid=' + this.commonService._dbflowpathdata.tierId +
           '&serverId=' + this.commonService._dbflowpathdata.serverId +
           '&appId=' + this.commonService._dbflowpathdata.appId +
           '&sqlIndex=' + this.commonService._dbflowpathdata.sqlIndex +
           '&urlName=' + this.urlParam.urlName +
           '&strStartTime=' + this.trStartTime +
           '&strEndTime=' + this.trEndTime;
       } else {
         console.log('Inside Normal Block..');
         url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
           this.urlParam.testRun +
           '&flowPathInstance=' + this.urlParam.flowPathInstance +
           '&tierName=' + this.urlParam.tierName +
           '&serverName=' + this.urlParam.serverName +
           '&appName=' + this.urlParam.appName +
           '&tierid=' + this.urlParam.tierid +
           '&serverId=' + this.urlParam.serverid +
           '&appId=' + this.urlParam.appid +
           '&urlName=' + this.urlParam.urlName +
           '&strStartTime=' + this.trStartTime +
           '&strEndTime=' + this.trEndTime+
           '&btCategory='+this.urlParam.btCategory+"&strOrderBy="+this.urlParam.strOrderBy+"&statusCode=-2&objectType=4";
         if (this.urlParam.btCategory == '13')
            url += '&statusCode=400';   
         if (this._ddrData.urlFlag === true) {
           this.tableOptions = false;
           this.optionsButton = false;
           url += '&btCategory=All' + '&strGroup=url';
           this._ddrData.urlFlag = false;
           this.showHeaderForGrpByBT = true;
         } else {
           url += '&btCategory='+this.urlParam.btCategory;
           this.tableOptions = true;
           this.optionsButton = true;
         }
         if (this._ddrData.fpByBTFlag === true) {
           url += '&urlIdx=' + this.commonService.fpByBTData.urlIndex +
             '&urlName=' + this.commonService.fpByBTData.urlName;
         }
         if (this._ddrData.fpSignatureflag == true) {
           url += '&statusCode=-2&strGroup=flowpathsignature';
           this.fpSignatureFlag = true;
           this.selectedTab = false;
           this.optionsButton = false;
           // this._ddrData.fpSignatureflag = false;
         }
         if (this.commonService.signatureTofpFlag === true) {
           url += '&FPstatusCode=-2&flowpathSignature='+ this.commonService.signatureTofpData.flowpathSignature;
         }
         if (this.minMethods != undefined && this.minMethods >= 0) {
           url += '&minMethods=' + this.minMethods;
         }
         if (this.responseTime != undefined && this.responseTime >= 0) {
           if (this.selectedResponse.id == 10) {
             url += '&responseTime=' + this.responseTime + '&resptimeqmode=1';
           }
           if (this.selectedResponse.id == 11) {
             url += '&responseTime=' + this.responseTime + '&resptimeqmode=2';
           }
           if (this.selectedResponse.id == 12) {
             url += '&responseTime=' + this.responseTime + '&resptimeqmode=3' + '&responseTime2=' + this.responseTime;
           }
         }
       }
 
       if (this._ddrData.FromhsFlag != 'true') {
         this.fromHsFlag="";
         url += '&limit=' + this.fpLimit + '&offset=' + this.fpOffset + '&showCount=false&shellForNDFilters=1' +
           '&customFlag=' + this.customFlag;
       }
       console.log('url------>', this.url);
       // making get type request to get data
       this.http.get(url).subscribe(data => (this.assignFlowpathData(data)));
       this.customFlag = false;*/

      //making url for Ajax Call
      this.url += '&flowpathID=' + this.flowpathID +
        '&flowpathSignature=' + this.flowpathSignature +
        '&strGroup=' + this.strGroupBy +
        "&strOrderBy=" + this.strOrderBy +
        '&tierName=' + this.tierName +
        '&serverName=' + this.serverName +
        '&appName=' + this.appName +
        '&tierid=' + this.tierId +
        '&serverId=' + this.serverId +
        '&appId=' + this.appId +
        '&strStartTime=' + this.strStartTime +
        '&strEndTime=' + this.strEndTime +
        '&threadId=' + this.threadId +
        '&sqlIndex=' + this.sqlIndex +
        '&urlName=' + this.urlName +
        '&btCategory=' + this.btCategory +
        '&flowpathEndTime=' + this.flowpathEndTime;

      if (this.minMethods != undefined && this.minMethods >= 0) {
        this.url += '&minMethods=' + this.minMethods;
      }
      if (this.responseTime != undefined && this.responseTime >= 0) {
        if (this.selectedResponse.id == 10) {
          this.url += '&responseTime=' + this.responseTime + '&resptimeqmode=1';
        }
        if (this.selectedResponse.id == 11) {
          this.url += '&responseTime=' + this.responseTime + '&resptimeqmode=2';
        }
        if (this.selectedResponse.id == 12) {
          this.url += '&responseTime=' + this.responseTime + '&resptimeqmode=3' + '&responseTime2=' + this.responseTime;
        }
      }
      let pagination = "";
      let ajaxFlags = "";

      if (this._ddrData.FromhsFlag != 'true') {
        pagination = '&limit=' + this.fpLimit + '&offset=' + this.fpOffset;
        ajaxFlags = '&shellForNDFilters=1&customFlag=' + this.customFlag;
      }

      let ajaxUrl = this.url + pagination + ajaxFlags + '&showCount=false';
      console.log('ajax call url for data ==', ajaxUrl);

      // making get type request to get data
      this.ddrRequest.getDataUsingGet(ajaxUrl).subscribe(data => (this.assignFlowpathData(data)));
      this.customFlag = false;

    }
    catch (error) {
      console.log('error in getting data from rest call', error);
    }
  }
  makeAjaxParameter() {
    if (this._ddrData.FromexpFlag == 'true') {
      console.log(' method makeAjaxParameter and FromexpFlag is true');
      this.flowpathID = this.commonService.exptoFpData.flowPathInstance;
      this.tierName = this.commonService.exptoFpData.tierName;
      this.serverName = this.commonService.exptoFpData.serverName;
      this.appName = this.commonService.exptoFpData.appName;
      this.tierId = this.commonService.exptoFpData.tierid;
      this.serverId = this.commonService.exptoFpData.serverid;
      this.appId = this.commonService.exptoFpData.appid;
      this.strStartTime = this.trStartTime;
      this.strEndTime = this.trEndTime;

    }
    else if (this._ddrData.FromhsFlag == 'true') {
      console.log(' method makeAjaxParameter and FromhsFlag is true');
      this.tierName = this.commonService.hstofpData.tierName;
      this.serverName = this.commonService.hstofpData.serverName;
      this.appName = this.commonService.hstofpData.appName;
      this.tierId = this.commonService.hstofpData.tierid;
      this.serverId = this.commonService.hstofpData.serverid;
      this.appId = this.commonService.hstofpData.appid;
      this.strStartTime = this.commonService.hstofpData.hsTimeInMs;
      this.strEndTime = this.commonService.hstofpData.hsEndTime;
      this.threadId = this.commonService.hstofpData.threadId;
      this.strEndTime = this.commonService.hstofpData.hsEndTime;
      this.flowpathEndTime = this.commonService.hstofpData.flowpathEndTime;
      this.paginationFlag = false;

    }
    else if (this.commonService.dbtoflowpath == true) {
      console.log(' method makeAjaxParameter and dbtoflowpath is true');
      this.tierName = this.commonService._dbflowpathdata.tierName;
      this.serverName = this.commonService._dbflowpathdata.serverName;
      this.appName = this.commonService._dbflowpathdata.appName;
      this.tierId = this.commonService._dbflowpathdata.tierid;
      this.serverId = this.commonService._dbflowpathdata.serverid;
      this.appId = this.commonService._dbflowpathdata.appid;
      this.sqlIndex = this.commonService._dbflowpathdata.sqlIndex;
      this.strStartTime = this.trStartTime;
      this.strEndTime = this.trEndTime;


    }
    else {
      console.log(' method makeAjaxParameter and its normal case');
      this.flowpathID = this.urlParam.flowPathInstance;
      this.tierName = this.urlParam.tierName;
      this.serverName = this.urlParam.serverName;
      this.appName = this.urlParam.appName;
      this.tierId = this.urlParam.tierid;
      this.serverId = this.urlParam.serverid;
      this.appId = this.urlParam.appid;
      this.urlName = this.urlParam.urlName;
      this.strStartTime = this.trStartTime;
      this.strEndTime = this.trEndTime;
      this.strOrderBy = this.urlParam.strOrderBy;

      if (this.urlParam.btCategory == '13')
        this.statusCode = '400';
      if (this._ddrData.urlFlag === true) {
        console.log(' method makeAjaxParameter and its normal case and _ddrData.urlFlag is true');
        this.btCategory = 'All';
        this.strGroupBy = 'url';
        this.tableOptions = false;
        this.optionsButton = false;
        this._ddrData.urlFlag = false;
        this.showHeaderForGrpByBT = true;
      }
      else {
        this.btCategory = this.urlParam.btCategory;
        this.tableOptions = true;
        this.optionsButton = true;
      }
      if (this._ddrData.fpByBTFlag === true) {
        this.urlIndex = this.commonService.fpByBTData.urlIndex;
        this.urlName = this.commonService.fpByBTData.urlName;

      }
      if (this._ddrData.fpSignatureflag == true) {
        this.statusCode = '-2';
        this.strGroupBy = 'flowpathsignature';
        this.fpSignatureFlag = true;
        this.selectedTab = false;
        this.optionsButton = false;
        // this._ddrData.fpSignatureflag = false;
      }
      if (this.commonService.signatureTofpFlag === true) {
        console.log("this.commonService.signatureTofpFlag  is true ");
        this.statusCode = '-2';
        this.flowpathSignature = this.commonService.signatureTofpData.flowpathSignature;
      }
    }
  }
  assignCustomQueryParam(temp: any) {
    console.log(" method - assignCustomQueryParam  and data passed to it is -temp ", temp);
    if (temp['tierId'] !== null && temp['tierId'] !== undefined) {
      this.tierId = temp['tierId'].toString();
    }
    if (temp['serverId'] !== null && temp['serverId'] !== undefined) {
      this.serverId = temp['serverId'].toString();
    }
    if (temp['appId'] !== null && temp['appId'] !== undefined)
      this.appId = temp['appId'].toString();

    if (temp['corrId'] !== null && temp['corrId'] !== undefined)
      this.correlationId = temp['corrId'].toString();

    if (temp['corrIdModeOptions'] !== null && temp['corrIdModeOptions'] !== undefined)
      this.mode = temp['corrIdModeOptions'].id;

    if (temp['minMethods'] !== null && temp['minMethods'] !== undefined)
      this.minMethods = temp['minMethods'].toString();

    if (temp['responseTime'] !== null && temp['responseTime'] !== undefined)
      this.responseTime = temp['responseTime'].toString();

    if (temp['resCompareOption'] !== null && temp['resCompareOption'] !== undefined)
      this.responseCompare = temp['resCompareOption'].id;

    if (temp['selectedBTCategory'] !== null && temp['selectedBTCategory'] !== undefined)
      this.btCategory = temp['selectedBTCategory'].id;

    if (temp['startTime'] !== null && temp['startTime'] !== undefined)
      this.strStartTime = temp['startTime'];

    if (temp['endTime'] !== null && temp['endTime'] !== undefined)
      this.strEndTime = temp['endTime'];

    console.log("start timeis", this.strStartTime);
    console.log("end timeis", this.strEndTime);
  }
  getFlowpathDataCount() {
    try {

      /*let url = '';
      if (this._ddrData.FromexpFlag == 'true') {
        console.log('Inside exptofpflag data count block..');
        console.log('in this case data is: ', this.commonService.exptoFpData);
        url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
          this.urlParam.testRun +
          '&flowpathID=' + this.commonService.exptoFpData.flowPathInstance +
          '&tierName=' + this.commonService.exptoFpData.tierName +
          '&serverName=' + this.commonService.exptoFpData.serverName +
          '&appName=' + this.commonService.exptoFpData.appName +
          '&tierid=' + this.commonService.exptoFpData.tierid +
          '&serverId=' + this.commonService.exptoFpData.serverid +
          '&appId=' + this.commonService.exptoFpData.appid +
          '&urlName=' + this.urlParam.urlName +
          '&strStartTime=' + this.trStartTime +
          '&strEndTime=' + this.trEndTime;
      } else if (this.commonService.dbtoflowpath == true) {
        console.log("Db queries to flowpath case");
        url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
          this.urlParam.testRun +
          '&tierName=' + this.commonService._dbflowpathdata.tierName +
          '&serverName=' + this.commonService._dbflowpathdata.serverName +
          '&appName=' + this.commonService._dbflowpathdata.appName +
          '&tierid=' + this.commonService._dbflowpathdata.tierId +
          '&serverId=' + this.commonService._dbflowpathdata.serverId +
          '&appId=' + this.commonService._dbflowpathdata.appId +
          '&sqlIndex=' + this.commonService._dbflowpathdata.sqlIndex +
          '&urlName=' + this.urlParam.urlName +
          '&strStartTime=' + this.trStartTime +
          '&strEndTime=' + this.trEndTime;
      } else {
        url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' +
          this.urlParam.testRun +
          '&flowPathInstance=' + this.urlParam.flowPathInstance +
          '&tierName=' + this.urlParam.tierName +
          '&serverName=' + this.urlParam.serverName +
          '&appName=' + this.urlParam.appName +
          '&tierid=' + this.urlParam.tierid +
          '&serverId=' + this.urlParam.serverid +
          '&appId=' + this.urlParam.appid +
          '&urlName=' + this.urlParam.urlName +
          '&strStartTime=' + this.trStartTime +
          '&strEndTime=' + this.trEndTime+ 
          '&btCategory='+this.urlParam.btCategory+
          '&strOrderBy='+this.urlParam.strOrderBy;
         if (this.urlParam.btCategory == '13')
           url += '&statusCode=400'; 
        if (this._ddrData.urlFlag === true) {
          url += '&btCategory=All' + '&strGroup=url';
        }
        if (this._ddrData.fpByBTFlag === true) {
          url += '&urlIdx=' + this.commonService.fpByBTData.urlIndex +
            '&urlName=' + this.commonService.fpByBTData.urlName;
        }
        if (this.fpSignatureFlag === true) {
          url += '&statusCode=-2&strGroup=flowpathsignature';
        }
        if (this.commonService.signatureTofpFlag === true) {
          url += '&FPstatusCode=-2&flowpathSignature='+ this.commonService.signatureTofpData.flowpathSignature;
        }
      }
      url += '&limit=' + this.fpLimit + '&offset=' + this.fpOffset + '&showCount=true&shellForNDFilters=1';
      console.log('url count--------->', url);
      // making get type request to get data count
      this.http.get(url).subscribe(data => (this.assignFlowpathDataCount(data)));
    */
      let ajaxUrl = this.url + '&limit=' + this.fpLimit + '&offset=' + this.fpOffset + '&showCount=true&shellForNDFilters=1';
      console.log('ajax url for count--------->', ajaxUrl);

      // making get type request to get data count
      this.ddrRequest.getDataUsingGet(ajaxUrl).subscribe(data => (this.assignFlowpathDataCount(data)));
    }
    catch (error) {
      console.log('error in getting data from rest call', error);
    }
  }

  assignFlowpathDataCount(res: any) {
    this.fpTotalCount = res.totalCount;
    if (this.fpLimit > this.fpTotalCount)
      this.fpLimit = Number(this.fpTotalCount);
  }

  setTimeFilter(res: any) {
    this.trStartTime = res.ddrStartTime;
    this.trEndTime = res.ddrEndTime;
    this.getStandardTime();
  }
  getStandardTime() {
    if (this.trStartTime != '' || this.trStartTime != undefined) {
      let time;
      if (this.selectedTime.name == "Last 10 minutes") {
        time = 600000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 10 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 30 minutes") {
        time = 1800000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 30 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 1 hour") {
        time = 3600000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 1 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 2 hours") {
        time = 7200000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 2 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 4 hours") {
        time = 14400000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 4 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 8 hours") {
        time = 28800000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 8 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 12 hours") {
        time = 43200000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 12 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 24 hours") {
        time = 86400000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 24 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Total Test Run") {
        this.trStartTime = "";
        this.trEndTime = "";
      }
      this.loader = true;
      this.getProgressBar();
      this.getFlowpathData();
      this.display = false;
      this.standselect = false;
      this.custselect = false;
      this.strDate = null;
      this.endDate = null;
      this.msg = "";
      this.value = 1;
      this.selectedTime = "";

    }
  }
  assignFlowpathData(res: any) {
    try {
      if (res === null || res === undefined) {
        return;
      }
      setTimeout(() => {
        this.loader = false;
      }, 2000);
      this.value = 1;
      this.loading = false;
      this.ajaxLoader = false;
      this.showHeaderInfo(res.strStartTime, res.strEndTime);
      let fpResponseTimeArr = [];
      // updating data in component variable
      this.queryData = res.data;
      this.flowpathData = res.data;
      // this.fpTotalCount = res.totalCount;
      if (this.flowpathData.length !== 0) {
        this.flowpathData.forEach((val, index) => {
          if (val['correlationId'] === '') {
            val['correlationId'] = '';
          }
          if (val['waitTime'] === '' || val['syncTime'] === '' || val['iotime'] === '' || val['suspensiontime'] === '') {
            val['waitTime'] = '0';
            val['syncTime'] = '0';
            val['iotime'] = '0';
            val['suspensiontime'] = '0';
          }
        });
      }
      if (this.flowpathData.length === 0) {
        this.showDownLoadReportIcon = false;
      }
      if (this.tableOptions === true && this.flowpathData.length !== 0) {
        this.flowpathData.forEach((val, index) => {
          val.fpDuration = this.ResponseFormatter(val.fpDuration);
          val.methodsCount = this.formatter(val.methodsCount);
          val.callOutCount = this.formatter(val.callOutCount);
          val.dbCallCounts = this.formatter(val.dbCallCounts);
          val.btCatagory = this.getBTCategory(val.btCatagory);
          fpResponseTimeArr.push(Number(val.fpDuration));
        });
        console.log('Btcategorycount data-----------', res.btCategoryCount);
        this.createBarChart(fpResponseTimeArr);
      } else {
        this.flowpathData.forEach((val, index) => {
          fpResponseTimeArr.push(Number(val['average']));
        });
        this.createBarChart(fpResponseTimeArr);
      }
      this.createPieChart(res);
    } catch (error) {
      console.log(error);
    }

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
    return category;
  }
  ResponseFormatter(resTime: any) {
    if (Number(resTime) && Number(resTime) > 0) {
      return Number(resTime).toLocaleString();
    }
    if (Number(resTime) == 0) {
      return '< 1';
    } else {
      return resTime;
    }
  }

  formatter(data: any) {
    if (Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
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
    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });

  }


  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilter() {
    if (this.isEnabledColumnFilter) {
      this.isEnabledColumnFilter = false;
    } else {
      this.isEnabledColumnFilter = true;
    }

    this.changeColumnFilter();
  }

  /*This method is used to Enable/Disabled Column Filter*/
  changeColumnFilter() {
    try {
      let tableColumns = this.cols;
      if (this.isEnabledColumnFilter) {
        this.toggleFilterTitle = 'Show Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitle = 'Hide Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

  createBarChart(fpResponseTimeArr) {
    console.log('res tym---', fpResponseTimeArr.length);
    if (fpResponseTimeArr.length === 0 || fpResponseTimeArr.length < 5 || this.fpSignatureFlag === true) {
      this.showBarChart = false;
    } else {
      this.showBarChart = true;
    }
    this.barChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Flowpath Response Time'
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Time (ms)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} ms</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Response Time',
          enableMouseTracking: true,
          data: fpResponseTimeArr
        }]
    }
  }



  createPieChart(res: any) {
    console.log(' inside create pie chart  for flowpath-------------', res);
    let btInfoArr = [];
    if (this.optionsButton === false) {
      this.chartData = res.data;
      if (this.chartData.length === 0 || this.flowpathData.length === 0 || this.fpSignatureFlag === true) {
        this.showChart = false;
      } else {
        this.showChart = true;
      }
      for (let j = 0; j < this.chartData.length; j++) {
        btInfoArr.push({ 'name': this.chartData[j]['urlName'], 'y': Number(this.chartData[j]['fpCount']) });
      }

    } else {
      this.chartData = res.btCategoryCount;
      if (this.chartData.length === 0 || this.flowpathData.length === 0) {
        this.showChart = false;
      } else {
        this.showChart = true;
      }
      for (let j = 0; j < this.chartData.length; j++) {
        console.log('chart data', this.chartData[j]);
        btInfoArr.push({ 'name': 'Normal', 'y': Number(this.chartData[j]['normal']), 'color': 'green' });
        btInfoArr.push({ 'name': 'Slow', 'y': Number(this.chartData[j]['slow']), 'color': 'yellow' });
        btInfoArr.push({ 'name': 'Very Slow', 'y': Number(this.chartData[j]['veryslow']), 'color': 'orange' });
        btInfoArr.push({ 'name': 'Errors', 'y': Number(this.chartData[j]['errors']), 'color': 'red' });
      }
    }
    console.log('btArrayInfo------', btInfoArr)
    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: 'BT Category', style: { 'fontSize': '13px' } },
      tooltip: {
        formatter: function () {
          return ' ' +
            '<b>' + this.point.name + '</b>' + '<br />' +
            '<b>Percentage: </b>' + this.point.percentage.toFixed(1) + '%' + '<br />' +
            '<b>Count: </b>' + this.point.y;
        }
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
        }
      },
      series: [
        {
          name: 'Percentage',
          data: btInfoArr,
          enableMouseTracking: true
        }
      ]
    };
  }

  showHeaderInfo(startTime: any, endTime: any) {
    if (this.urlParam.tierName !== 'NA' && this.urlParam.tierName !== '' && this.urlParam.tierName !== undefined &&
      this.urlParam.tierName !== null) {
      this.headerInfo = 'Tier=' + this.urlParam.tierName;
    }

    if (this.urlParam.serverName !== 'NA' && this.urlParam.serverName !== '' && this.urlParam.serverName !== undefined &&
      this.urlParam.serverName !== null) {
      this.headerInfo += ', Server=' + this.urlParam.serverName;
    }
    if (this.urlParam.appName !== 'NA' && this.urlParam.appName !== '' && this.urlParam.appName !== undefined &&
      this.urlParam.appName !== null) {
      this.headerInfo += ', Instance=' + this.urlParam.appName;
    }
    if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      this.headerInfo += ', StartTime=' + startTime;
    }
    if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
      this.headerInfo += ', EndTime=' + endTime;
    }
    if (this.urlParam.btCategory !== 'NA' && this.urlParam.btCategory !== '' && this.urlParam.btCategory !== 'undefined' &&
      this.urlParam.btCategory !== null && this.urlParam.btCategory !== undefined) {
      if (this.urlParam.btCategory == '10' || this.urlParam.btCategory == '11' || this.urlParam.btCategory == '12' ||
        this.urlParam.btCategory == '13') {
        this.headerInfo += ', BT Type=' + this.getBTCategory(this.urlParam.btCategory);
      } else
        this.headerInfo += ', BT Type=' + this.urlParam.btCategory;
    }
    else {
      this.headerInfo += ', BT Type= All';
    }
    if (this.urlParam.urlName !== 'NA' && this.urlParam.urlName !== '' && this.urlParam.urlName !== 'undefined' &&
      this.urlParam.urlName !== null && this.urlParam.urlName !== undefined) {
      this.headerInfo += ', BT= ' + this.urlParam.urlName;
    }

    if (this.showHeaderForGrpByBT === true) {
      this.headerInfo += ', Group By= url';
      this.showHeaderForGrpByBT = false;
    }

    console.log('headerinfo', this.headerInfo);
    if (this.headerInfo.startsWith(',')) {
      this.headerInfo = this.headerInfo.substring(1);
    }
    if (this.headerInfo.endsWith(',')) {
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    }

    if (this.methselect == true)
      this.headerInfo += ', Method Count >=' + this.minMethods;
    else
      this.headerInfo += '';

    if (this.respselect == true && this.selectedResponse != "") {
      if (this.respselect == true && this.selectedResponse.id == 10)
        this.headerInfo += ', Response Time <=' + this.responseTime;
      else if (this.respselect == true && this.selectedResponse.id == 11)
        this.headerInfo += ', Response Time >=' + this.responseTime;
      else if (this.respselect == true && this.selectedResponse.id == 12)
        this.headerInfo += ', Response Time =' + this.responseTime;
    }
    else
      this.headerInfo += '';


  }

  openFPStatsTab() {
    this.selectedTab = true;
  }

  closeFPStatsTab() {
    this.selectedTab = false;
  }

  openFPDetailTab() {
    this.selectedTab = false;
  }

  closeFPDetailTab() {
    this.selectedTab = true;
  }

  clickHandler(event) {
    this.selectedTab = false;
    this.showAllOption = true;
    this.pointName = ': ' + event.point.name;
    let filterFPArray = [];
    console.log('flowpath data', event.point.name);
    this.queryData.forEach((val, index) => {
      if (val['btCatagory'].substring(val['btCatagory'].lastIndexOf('.') + 1) === event.point.name) {
        filterFPArray.push(val);
      }
    });
    console.log('filterFPArray------------', filterFPArray);
    this.flowpathData = filterFPArray;
  }


  /**Used to reset to original data to table */
  showAllData() {
    this.flowpathData = this.queryData;
    this.showAllOption = false;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - Flowpath Report - Test Run : ' + this.urlParam.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - Flowpath Report - Session : ' + this.urlParam.testRun;
    }
  }

  downloadReports(reports: string) {
    let renameArray;
    let colOrder;
    if (this.fpSignatureFlag) {
      renameArray = { 'flowpathCount': 'FlowPath Count', 'min': 'Min (ms)', 'max': 'Max (ms)', 'average': 'Average (ms)', 'vmr': 'VMR' }

      colOrder = ['FlowPath Count', 'Min (ms)', 'Max (ms)', 'Average (ms)', 'VMR'];

      this.flowpathData.forEach((val, index) => {
        delete val['flowpathSignature'];
        delete val['id'];
        delete val['coherenceCallOut'];
        delete val['jmsCallOut'];
        delete val['waitTime'];
        delete val['syncTime'];
        delete val['iotime'];
        delete val['suspensiontime'];
        delete val['threadName'];

      });
      // console.log("flowpathData=========== ", JSON.stringify(this.flowpathData));

    } else if (this.tableOptions === false) {
      console.log('inside group by bt');
      renameArray = { 'urlName': 'Business Transaction', 'fpCount': 'FlowPath Count' }

      colOrder = ['Business Transaction', 'FlowPath Count'];
      this.flowpathData.forEach((val, index) => {
        delete val['urlIndex'];
        delete val['id'];
        delete val['coherenceCallOut'];
        delete val['jmsCallOut'];
        delete val['waitTime'];
        delete val['syncTime'];
        delete val['iotime'];
        delete val['suspensiontime'];
        delete val['threadName'];
        delete val['min'];
        delete val['max'];
        delete val['average'];
        delete val['vmr'];
        delete val['fpSignatureCount'];
      });
    } else {
      renameArray = {
        'tierName': 'Tier', 'serverName': 'Server', 'appName': 'Instance',
        'urlName': 'Business Transaction', 'flowpathInstance': 'FlowpathInstance', 'startTime': 'StartTime', 'fpDuration': 'Response Time(ms)',
        'urlQueryParamStr': 'URL', 'statusCode': 'Status', 'callOutCount': 'CallOuts', 'totalError': 'CallOut Errors', 'btCatagory': 'Category',
        'btCpuTime': 'CPU Time(ms)', 'dbCallCounts': 'DB Callouts', 'methodsCount': 'Methods', 'correlationId': 'Corr ID', 'storeId': 'Store ID',
        'terminalId': 'Terminal ID', 'nvSessionId': 'NV Session ID', 'ndSessionId': 'ND Session ID', 'nvPageId': 'NV Page ID',
        'coherenceCallOut': 'Coherence CallOut', 'jmsCallOut': 'JMS CallOut', 'waitTime': 'Wait Time(ms)', 'syncTime': 'Sync Time(ms)',
        'iotime': 'IO Time(ms)', 'suspensiontime': 'Suspension Time(ms)'
      };
      colOrder = [
        'Tier', 'Server', 'Instance', 'Business Transaction', 'FlowpathInstance', 'StartTime',
        'Response Time(ms)', 'URL', 'Status', 'CallOuts', 'CallOut Errors', 'Category', 'CPU Time(ms)', 'DB Callouts', 'Methods', 'Corr ID',
        'Store ID', 'Terminal ID', 'NV Session ID', 'ND Session ID', 'NV Page ID', 'Coherence CallOut', 'JMS CallOut', 'Wait Time(ms)', 'Sync Time(ms)',
        'IO Time(ms)', 'Suspension Time(ms)'
      ];
      this.flowpathData.forEach((val, index) => {
        val.flowpathInstance = (val.flowpathInstance).concat("'").replace("'", " ");
        val.ndSessionId = (val.ndSessionId).concat("'").replace("'", " ");
        delete val['appId'];
        delete val['tierId'];
        delete val['serverId'];
        delete val['serverid'];
        delete val['urlIndex'];
        delete val['prevFlowpathInstance'];
        delete val['threadId'];
        delete val['startTimeInMs'];
        delete val['id'];
        delete val['orderId'];
        delete val['threadName'];
      });
    }
    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.headerInfo,
      strSrcFileName: 'FlowpathReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.flowpathData)
    };
    let downloadFileUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) +
      '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
      (this.openDownloadReports(res)));
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open( decodeURIComponent(this.getHostUrl() + '/' +
      this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '') +
      '/common/' + res);
  }

  /*Method is used get host url*/
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
  navigateToTransactionFlow(columnFlowpathData, rawData) {
    this.commonService.loaderForDdr = true;
    this.commonService.showTransactionFlowmap = false;
    this.commonService.openFlowpath = false;
    this.checkFpInstance(columnFlowpathData.flowpathInstance)
    sessionStorage.removeItem("jsonDatatoDraw");
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH;
    if (columnFlowpathData.fpDuration == '< 1')
      columnFlowpathData.fpDuration = 0
    this.flowmapDataService.getDataForTxnFlowpath(columnFlowpathData.flowpathInstance, columnFlowpathData);

  }
  openED() {
    var url = this.getHostUrl() + '/' + "dashboard/view/edRequestHandler.jsp?testRun=" + this.urlParam.testRun + "&sesLoginName=&sessGroupName=&sessUserType=";
    window.open(url, "_blank");
  }
  sortColumnsOnCustom(event, tempData) {

    //for interger type data type
    if (event["field"] == "startTime") {
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
    } else if (event["field"] == "appName") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          var v1 = a[temp];
          var v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].replace(reN, ""), 10);
            value2 = parseInt(b[temp].replace(reN, ""), 10);
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          }
        });
      } else {
        var temp = (event["field"]);
        event.order = -1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let v1 = a[temp];
          let v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].toString().replace(reN, ""), 10);
            value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          }
        });
      }
    }
    else {
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
    }
    this.flowpathData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.flowpathData = this.Immutablepush(this.flowpathData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }
  showNotification() {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'FlowPath Link has been copied successfully' });
  }
  prevFpInstance
  // currFpInstance
  fpflag: boolean = true;
  checkFpInstance(currFpInstance) {
    console.log('currrrrent fp instance', currFpInstance);
    console.log('prev fp instance', this.prevFpInstance)
    if (this.fpflag) {
      this.prevFpInstance = currFpInstance;
      this.fpflag = false;
    }
    if (this.prevFpInstance !== currFpInstance) {
      this.removeAllDiv()
      this.prevFpInstance = currFpInstance;
      return;
    }
    return;
  }
  removeAllDiv() {
    this.breadcrumbService.itemBreadcrums.splice(1, this.breadcrumbService.itemBreadcrums.length - 1);
    this.commonService.showDbreport = false;
    this.commonService.showHotspot = false;
    this.commonService.showHttp = false;
    this.commonService.showMethodCallingTree = false;
    this.commonService.showMethodTiming = false;
    this.commonService.showTransactionFlowmap = false;
    this.commonService.showExceptionReport = false;
  }
  // setFpInstance(event) {
  //   console.log('eeeeeeeeeeeeeeeeeeeeeee', event)
  //   this.currFpInstance = event.data.flowpathInstance;
  //   if (this.fpflag) {
  //     this.prevFpInstance = event.data.flowpathInstance;
  //     this.fpflag = true
  //   }
  //   if (this.prevFpInstance !== this.currFpInstance) {

  //   }

  // }

  onTabOpen(event) {
    this.commonService.openFlowpath = true;
  }
}

export interface FlowpathDataInterface {
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
  fpDuration: string;
  methodsCount: string;
  urlQueryParamStr: string;
  statusCode: string;
  callOutCount: string;
  threadId: string;
  btCatagory: string;
  correlationId: string;
  btCpuTime: string;
  startTimeInMs: string;
  id: number;
  orderId: string;
  totalError: string;
  nvSessionId: string;
  ndSessionId: string;
  nvPageId: string;
  dbCallCounts: string;
  coherenceCallOut: string;
  jmsCallOut: string;
  threadName: string;
}

