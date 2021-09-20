import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
//import 'rxjs/Rx';
import { CommonServices } from '../../services/common.services';
import { BTCalloutInfoAgg, BTCallOutInfoIndi } from '../../interfaces/ip-summary-data-info';
import { Message } from 'primeng/api';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { MessageService } from '../../services/ddr-message.service';
import { SelectItem } from '../../interfaces/selectitem';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-ip-summary',
  templateUrl: './ip-summary.component.html',
  styleUrls: ['./ip-summary.component.css']
})
export class IpSummaryComponent implements OnInit, OnChanges {

  @Input() columnData;
  btCallOutInfoAgg: Array<BTCalloutInfoAgg> = [];
  btCallOutAggColumn: Object[] = [];
  btCalloutInfoInd: Array<BTCallOutInfoIndi> = [];
  btCallOutIndColumn: Object[] = []
  urlParam: any = {};
  queryParams: any = {};
  loading: boolean = false;
  selectedRowInfo: BTCalloutInfoAgg;
  strStartTime: string;
  strEndTime: string;
  filterCriteria: string = "";
  selectedBT: string = "";
  strTitle: string = "";
  max_flow_path: number = 10000;
  showWarning: boolean = false;
  showFPConfDia: boolean = false;
  screenHeight: any;
  TotalCalloutcount: any;
  showDownLoadReportIcon: boolean = true;
  msgs: Message[] = [];
  filterTierName = '';
  filterServerName = '';
  filterInstanceName = '';
  filterIpName = '';
  completeTier = '';
  completeServer = '';
  completeInstance = '';
  completeIpName = '';
  downloadFilterCriteria = '';
  visibleCols: any[];
  columnOptions: SelectItem[];
  prevColumn;
  isFilterFromSideBar: boolean = false;

  // DC variables'
  ndeCurrentInfo: any;
  ndeInfoData: any;
  protocol: string = '//';
  host = '';
  port = '';
  testRun: string;
  dcList: SelectItem[];
  selectedDC;
  showDCMenu = false; dcProtocol: string = '//';

  showAutoInstrPopUp: boolean = false;
  argsForAIDDSetting: any[];
  agentType: string;
  vecId: any;
  displayAutoInst: boolean = false;
  backendId: string;
  ipUrl: string = '';

  private sideBarIpSummary: Subscription;
  filterCriteriaagg:any;

  aggCase:boolean=true;
  aggIpInfo=[];
  renamebackendNameMap:any={};
  actualBackendNameMap:any={};
  backendSubTypeNameMap:any={};
  limit: number;
  offset: number;
  showMessage:boolean= false 
  urlNameIP: any;
  urlIndexIP: any;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId1:any;
  queryId2:any;
  breadcrumb: BreadcrumbService;
  emptyBtCallOutInd: boolean;
  emptyBtCallOutAgg: boolean;
  constructor(private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService, public commonService: CommonServices,
    private _ddrData: DdrDataModelService, private breadcrumbService: DdrBreadcrumbService, private messageService: MessageService,
    private ddrRequest:DDRRequestService, breadcrumb: BreadcrumbService) { this.breadcrumb = breadcrumb; }

  ngOnChanges() {
  
   if(this._ddrData.splitViewFlag) 
   this._ddrData.setInLogger("DDR::Flowpath","IP Summary","Open IP Summary Report");
    console.log('ip summary=====>', this.columnData);
    this.screenHeight = Number(this.commonService.screenHeight) - 100;
    if (this.columnData != undefined) {
      this.loading = true;
      this.urlParam = this.commonService.getData();
      if(this.urlParam.enableQueryCaching)
      this.commonService.enableQueryCaching = this.urlParam.enableQueryCaching;
      this.commonService.ipSummaryData = JSON.parse(JSON.stringify(this.columnData));
      this.queryParams = JSON.parse(JSON.stringify(this.columnData));
      if (this.queryParams) {
        let fpDuration = 0;
        if (this.queryParams['fpDuration'] == '< 1')
          fpDuration = 0;
        else if (this.queryParams['fpDuration'].toString().includes(','))
          fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
        else
          fpDuration = this.queryParams.fpDuration;
        this.strEndTime = (Number(this.queryParams.startTimeInMs) + Number(fpDuration)).toString();
        this.strStartTime = this.queryParams.startTimeInMs;
      }
      this.queryId1 = this.randomNumber();
      this.getAggBTCallOutInfo();
    }

  }

  ngOnInit() {
    // this.commonService.isToLoadSideBar = false;
    this.screenHeight = Number(this.commonService.screenHeight) - 100;
   // if (this.commonService.ipSummaryFilters['source'] != "FlowpathReport")
      this.commonService.currentReport = "IP Summary";
      this.queryId1 = this.randomNumber();
    //this.commonService.ipSummaryFilters['source'] = "NA";
    if (this._ddrData.splitViewFlag == false) {
      this.urlParam = this.commonService.getData();
      this.commonService.isToLoadSideBar = true;
      console.log("this.urlParam---",this.urlParam);
      this.queryParams = this.urlParam ; 
      console.log("this.queryParams 000---",this.queryParams);
  //   	if(this.commonService.ipSummaryData != undefined)
  //   {  this.queryParams = this.commonService.ipSummaryData;
  //   console.log("inside iffffffffffffff---",this.queryParams);
  //   }
      if (this.queryParams == undefined) {
        this.queryParams = this.commonService.ipSummaryFilters;
        console.log("his.commonService.ipSummaryFilters--",this.commonService.ipSummaryFilters);
      }
      if (this.queryParams && this.queryParams.fpDuration != undefined) {
        let fpDuration = 0;
        if (this.queryParams['fpDuration'] == '< 1')
          fpDuration = 0;
        else if (this.queryParams['fpDuration'].toString().includes(','))
          fpDuration = this.queryParams.fpDuration.toString().replace(/,/g, "");
        else
          fpDuration = this.queryParams.fpDuration;
        this.strEndTime = this.queryParams.startTimeInMs + Number(fpDuration);
        this.strStartTime = this.queryParams.startTimeInMs;

      }
      else if (this.queryParams) {
        this.strEndTime = this.queryParams.endTime;
        this.strStartTime = this.queryParams.startTime
      }

    }
    this.sideBarIpSummary = this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == "IP Summary") {
        console.log("inside subsribe IP Summary from sidebar");
        this.commonService.isFilterFromSideBar = true;
        let keys = Object.keys(temp);

        console.log('data coming from side bar to IP Summary report', temp);
        this.getAggBTCallOutInfo();
      }
    });
    if (this._router.url.indexOf('?') != -1 && this._router.url.indexOf('/home/ED-ddr/ipsummary') != -1) {
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.urlParam = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      this.queryParams = this.urlParam;
      console.log("inside url making");
      this.strStartTime = this.urlParam.startTime;
      this.strEndTime = this.urlParam.endTime;
      this.screenHeight = Number(this.commonService.screenHeight) - 80;
      if (this.urlParam.enableQueryCaching){
        this.commonService.enableQueryCaching = this.urlParam.enableQueryCaching;
      }
      this.commonService.ajaxTimeOut = this.urlParam.ajaxTimeout;
      this.commonService.dcNameList = this.urlParam.dcNameList;
      this.commonService.isAllCase = this.urlParam.isAll;
      this.commonService.selectedDC = this.urlParam.dcName;
      this.commonService.tierNameList = this.urlParam.tierNameList;
      if (this.urlParam.dcNameList != null && this.urlParam.dcNameList != '' && this.urlParam.dcNameList != undefined && this.urlParam.dcNameList != 'undefined') {
        sessionStorage.setItem("dcNameList", this.urlParam.dcNameList);
        sessionStorage.setItem("tierNameList", this.urlParam.tierNameList)
        sessionStorage.setItem("isAllCase", this.urlParam.isAll);
    }
      sessionStorage.setItem('hostDcName', location.host);
      // sessionStorage.setItem("product",this.urlParam.product);
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.urlParam;
    }

    console.log("ip summary Query Param", this.queryParams);
    if (this._ddrData.splitViewFlag == false)
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.IPSUMMARY);
      this.breadcrumb.add({label: 'BT IP Summary', routerLink: '/ddr/ipsummary'});
    this.btCallOutAggColumn = [
      { field: 'url', header: 'Business Transaction', sortable: true, action: true, width: '150' },
      { field: 'minHttpCalloutCount', header: 'Min HTTP Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'maxHttpCalloutCount', header: 'Max HTTP Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'totalHttpCalloutCount', header: 'Total HTTP Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'minDBCalloutCount', header: 'Min DB Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'maxDBCalloutCount', header: 'Max DB Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'totalDBCalloutCount', header: 'Total DB Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'minCalloutCount', header: 'Min Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'maxCalloutCount', header: 'Max Callout', sortable: 'custom', action: true, width: '75' },
      { field: 'fpCount', header: 'Flowpath(s)', sortable: 'custom', action: 'custom', width: '75' },

    ];
    this.btCallOutIndColumn = [
      { field: "action", header: "Action", toolTip: "Action Links", width: '50', action: true, align: 'left' },
      { field: 'backendName', header: 'Integration Point', sortable: true, action: true, width: '200' },
      { field: 'minCount', header: 'Min Count', sortable: 'custom', action: true, width: '100' },
      { field: 'maxCount', header: 'Max Count', sortable: 'custom', action: true, width: '100' },
      { field: 'totalCount', header: 'Total Count', sortable: 'custom', action: true, width: '100' },
      { field: 'minRespTime', header: 'Min Time(ms)', sortable: 'custom', action: true, width: '100' },
      { field: 'maxRespTime', header: 'Max Time(ms)', sortable: 'custom', action: true, width: '100' },
      { field: 'avgResponseTime', header: 'Avg Time(ms)', sortable: 'custom', action: true, width: '100' },
      { field: 'totalRespTime', header: 'Total Time(ms)', sortable: 'custom', action: true, width: '100' },
      { field: 'minNetworkDelay', header: 'Min Network Delay(ms)', sortable: 'custom', action: false, width: '100' },
      { field: 'maxNetworkDelay', header: 'Max Network Delay(ms)', sortable: 'custom', action: false, width: '100' },
      { field: 'AverageNetworkDelay', header: 'Average Network Delay(ms)', sortable: 'custom', action: false, width: '100' },
      { field: 'totalNetworkDelay', header: 'Total Network Delay(ms)', sortable: 'custom', action: false, width: '100' },

    ];

    this.visibleCols = [
      'backendName', 'minCount', 'maxCount', 'totalCount', 'minRespTime', 'maxRespTime', 'avgResponseTime',
      'totalRespTime'];


    this.columnOptions = [];
    for (let i = 0; i < this.btCallOutIndColumn.length; i++) {
      let val =
        this.columnOptions.push({ label: this.btCallOutIndColumn[i]["header"], value: this.btCallOutIndColumn[i]["field"] });
    }

    if (undefined != this.commonService.dcNameList && null != this.commonService.dcNameList && this.commonService.dcNameList != '') {
      this.getDCData();
    } else {
      if (this._ddrData.splitViewFlag == false)
        this.getAggBTCallOutInfo();
      this.setTestRunInHeader();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      this.commonService.testRun = '';
      this.commonService.selectedDC = '';
    }
    this._ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessageSave(mssg)});
  }


  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    if (this.visibleCols.length !== 0) {
      for (let i = 0; i < this.btCallOutIndColumn.length; i++) {
        for (let j = 0; j < this.visibleCols.length; j++) {
          if (this.btCallOutIndColumn[i]["field"] === this.visibleCols[j]) {
            this.btCallOutIndColumn[i]["action"] = true;
            break;
          } else {
            this.btCallOutIndColumn[i]["action"] = false;
          }
        }
      }
    }
    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });

  }

  createFilterCriteria() {
    this.filterCriteria = '';
    this.filterTierName = '';
    this.filterServerName = '';
    this.filterInstanceName = '';
    this.filterIpName = '';
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    this.completeIpName = '';
    this.downloadFilterCriteria = '';
    let ipFilters = this.commonService.ipSummaryFilters;
    let dcName = "";

    // if (sessionStorage.getItem("isMultiDCMode") == "true") {
    //   let dcName = this._cavConfigService.getActiveDC();
    //   if (dcName == "ALL")
    //     dcName = this._ddrData.dcName;

    //   this.filterCriteria += 'DC=' + dcName + ', ';
    // }

    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
      dcName = this.selectedDC;
      // this.downloadFilterCriteria = this.filterCriteria + ",";
    }
    else if(sessionStorage.getItem("isMultiDCMode") == "true")
          {
            dcName = this._cavConfigService.getActiveDC();
            if(dcName == "ALL")
              dcName = this._ddrData.dcName;
              // this.downloadFilterCriteria = this.filterCriteria + ",";
          }

    if (this.columnData != undefined) {
      if(dcName)
       this.filterCriteria += "DC= " + dcName + ', ';

      if (this.queryParams.tierName)
        this.filterCriteria += " Tier=" + this.queryParams.tierName;
      if (this.queryParams.serverName && this.queryParams.serverName != "NA")
        this.filterCriteria += ", Server=" + this.queryParams.serverName;
      if (this.queryParams.appName && this.queryParams.appName != "NA")
        this.filterCriteria += ", Instance=" + this.queryParams.appName;
    } else {

      if(dcName) {
      this.filterTierName += "DC= " + dcName + ', ';
      this.downloadFilterCriteria += "DC= " + dcName + ', ';
	}	

      if (this.commonService.isValidParamInObj(ipFilters, "tierName")) {
        if (ipFilters['tierName'].length > 32) {
          this.filterTierName += 'Tier=' + ipFilters['tierName'].substring(0, 32) + '...';
          this.completeTier = ipFilters['tierName'];
        } else
          this.filterTierName += 'Tier=' + ipFilters['tierName'];

        this.downloadFilterCriteria += 'Tier=' + ipFilters['tierName'];
      }

      if (this.commonService.isValidParamInObj(ipFilters, "serverName")) {
        if (ipFilters['serverName'].length > 32) {
          this.filterServerName = ', Server=' + ipFilters['serverName'].substring(0, 32) + '...';
          this.completeServer = ipFilters['serverName'];
        } else
          this.filterServerName = ', Server=' + ipFilters['serverName'];

        this.downloadFilterCriteria += ', Server=' + ipFilters['serverName'];
      }

      if (this.commonService.isValidParamInObj(ipFilters, "appName")) {
        if (ipFilters['appName'].length > 32) {
          this.filterInstanceName = ', Instance=' + ipFilters['appName'].substring(0, 32) + '...';
          this.completeInstance = ipFilters['appName'];
        } else
          this.filterInstanceName = ', Instance=' + ipFilters['appName'];

        this.downloadFilterCriteria += ', Instance=' + ipFilters['appName'];

      }
    }
    if (this.commonService.isValidParamInObj(ipFilters, "startTimeInDateFormat")) {
      this.filterCriteria += ', Start Time=' + ipFilters['startTimeInDateFormat'];
    }
    if (this.commonService.isValidParamInObj(ipFilters, "endTimeInDateFormat")) {
      this.filterCriteria += ', End Time=' + ipFilters['endTimeInDateFormat'];
    }

    if (this.commonService.isValidParamInObj(ipFilters, "urlName")) {
      this.filterCriteria += ', BT=' + decodeURIComponent(ipFilters['urlName']);
    }
    if (this.commonService.isValidParamInObj(ipFilters, "integrationPointName")) {
      let ipSummaryIntegationPoint = ipFilters['integrationPointName'].toString().replace(/&#46;/g, ".");
      if (ipSummaryIntegationPoint.length > 32) {
        this.filterIpName = ', IntegrationPoint=' + ipSummaryIntegationPoint.substring(0, 32) + '...';
        this.completeIpName = ipSummaryIntegationPoint;
      } else
        this.filterIpName = ', IntegrationPoint=' + ipSummaryIntegationPoint;

      this.downloadFilterCriteria += ', IntegrationPoint=' + ipSummaryIntegationPoint;

    }

    console.log(this.filterCriteria);
    if (!this.commonService.isValidParamInObj(ipFilters, "tierName") && !this.commonService.isValidParamInObj(ipFilters, "serverName") && !this.commonService.isValidParamInObj(ipFilters, "appName") && this.filterCriteria.startsWith(',')) {
      this.filterCriteria = this.filterCriteria.substring(1);
    }
    // if (this.filterCriteria.endsWith(',')) {
    //     this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
    // }

    this.downloadFilterCriteria += this.filterCriteria;
  }

  openFPByIntegrationReport(rowData: any, flag: string) {
    try {
      console.log('rowData------>', rowData);
      let backendIdUrl = '';
      if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
        this.showDCMenu = false;
        backendIdUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""));
        this.ipUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""));
      }
  
      else {
        //this.showDCMenu = true;;
        this.dcProtocol = this.commonService.protocol;
        if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
          backendIdUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          this.ipUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          this.dcProtocol = this.commonService.protocol;
        } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
          backendIdUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
          this.ipUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
          this.dcProtocol = this.commonService.protocol;
        }
        else {
          backendIdUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
          this.ipUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
          this.dcProtocol = location.protocol;
        }
          backendIdUrl +=  '/' + this.urlParam.product.replace("/","");
          this.ipUrl +=  '/' + this.urlParam.product.replace("/","");

      }

      backendIdUrl += '/v1/cavisson/netdiagnostics/ddr/backendId?testRun='+ this.urlParam.testRun + '&backendName=' + rowData.backendName;
      this.ddrRequest.getDataInStringUsingGet(backendIdUrl).subscribe(res => {
        let data = <any> res;
        this.backendId = data;
        this.commonService.IPByFPData.backendName = rowData.backendName;
        console.log('Backend Id-----', this.backendId, this.commonService.IPByFPData.backendName);
        if (this.backendId.startsWith('Error')) {
          alert(this.backendId);
          return;
        }
      let fpdata = {};
    console.log('urlParam---', this.urlParam, 'backendId---', this.backendId);
    fpdata["tierId"] = this.commonService.ipSummaryData.tierId || this.queryParams.tierId;
    fpdata["serverId"] = this.commonService.ipSummaryData.serverid || this.queryParams.serverId;
    fpdata["appId"] = this.commonService.ipSummaryData.appid || this.queryParams.appId;
    fpdata["tierName"] = this.commonService.ipSummaryData.tierName || this.queryParams.tierName;
    fpdata["serverName"] = this.commonService.ipSummaryData.serverName || this.queryParams.serverName;
    fpdata["appName"] = this.commonService.ipSummaryData.appName || this.queryParams.appName;
    fpdata["backendId"] = this.backendId;
    fpdata['minresTimeOfBackend'] = rowData.minRespTime;
    if (flag === 'FPByResTime') {
      fpdata['maxresTimeOfBackend'] = rowData.maxRespTime;
    }
    fpdata['avgresTimeOfBackend'] = rowData.avgResponseTime
    fpdata["startTime"]= this.commonService.ipSummaryData.startTime || this.queryParams.startTime;
    fpdata['endTime']=this.commonService.ipSummaryData.endTime || this.queryParams.endTime;

   this._ddrData.splitViewFlag = false;
    console.log("Flwpath Data---x", fpdata);
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.IPSUMMARY;
    this._ddrData.IPByFPFlag = true;
    this._ddrData.isFromtrxFlow = false;
    this._ddrData.isFromtrxSideBar = false;
    this.commonService.isFilterFromSideBar = false;
    this._ddrData.FromexpFlag = 'false';
    this.commonService.IPByFPData = fpdata;
    if (this._router.url.indexOf("/home/ddrCopyLink/") != -1)
      this._router.navigate(['/home/ddrCopyLink/flowpath']);
    else
      this._router.navigate(['/ddr/flowpath']);
      },
        error => {
          this.commonService.loaderForDdr = false;
        });
    } catch (error) {
      console.log('Error in opening FP Report---', error);
    }
  }


  getAggBTCallOutInfo() {
    this.loading = true;
    let rowData: any;
    if (this.commonService.openIPSummary === true) {
      rowData = this.commonService.ipSummaryData;
    }
    let url = '';
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   url =  decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""));
      //   this.ipUrl =  "//" + decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""));
      // }
      // else{
        url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""));
        this.ipUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""));
     // }
    }

    else {
      //this.showDCMenu = true;;
      this.dcProtocol = this.commonService.protocol;
      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.ipUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.ipUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.ipUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
      url +=  '/' + this.urlParam.product.replace("/","");
      this.ipUrl +=  '/' + this.urlParam.product.replace("/","");
    }
    if(this.commonService.enableQueryCaching == 1){
      url += "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/AGG?cacheId="+ this.urlParam.testRun + "&testRun=" + this.urlParam.testRun;
      this.ipUrl += "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/IND?cacheId="+ this.urlParam.testRun + "&testRun=" + this.urlParam.testRun;
    }
    else{
      url += "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/AGG?testRun=" + this.urlParam.testRun;
      this.ipUrl += "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/IND?testRun=" + this.urlParam.testRun;
    }
    console.log("isFilterFromSideBar--", this.commonService.isFilterFromSideBar);
    let urlParam1 = "";

    if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.ipSummaryFilters).length != 0) // sidebar filters to Ip Summary 
    {
      let ipSummaryParam = this.commonService.ipSummaryFilters;

      if (this.commonService.isValidParamInObj(ipSummaryParam, 'ndeProtocol') && this.commonService.isValidParamInObj(ipSummaryParam, 'pubicIP') && this.commonService.isValidParamInObj(ipSummaryParam, 'publicPort') && this.commonService.isValidParamInObj(ipSummaryParam, 'ndeTestRun')) {
        if(this.commonService.enableQueryCaching == 1){
          url = ipSummaryParam['ndeProtocol'] + "://" + ipSummaryParam['pubicIP'] + ":" + ipSummaryParam['publicPort'] + '/' + this.urlParam.product.replace("/","") + '/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/AGG?cacheId='+ ipSummaryParam['ndeTestRun'] + '&testRun=' + ipSummaryParam['ndeTestRun'];
          this.ipUrl = ipSummaryParam['ndeProtocol'] + "://" + ipSummaryParam['pubicIP'] + ":" + ipSummaryParam['publicPort'] + '/' + this.urlParam.product.replace("/","") + "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/IND?cacheId="+ ipSummaryParam['ndeTestRun'] + "&testRun=" + ipSummaryParam['ndeTestRun'];  
        }
        else{
          url = ipSummaryParam['ndeProtocol'] + "://" + ipSummaryParam['pubicIP'] + ":" + ipSummaryParam['publicPort'] + '/' + this.urlParam.product.replace("/","") + '/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/AGG?testRun=' + ipSummaryParam['ndeTestRun'];
          this.ipUrl = ipSummaryParam['ndeProtocol'] + "://" + ipSummaryParam['pubicIP'] + ":" + ipSummaryParam['publicPort'] + '/' + this.urlParam.product.replace("/","") + "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/IND?testRun=" + ipSummaryParam['ndeTestRun'];  
        }
        //   this.commonHostUrl = ipSummaryParam['ndeProtocol'] + "://" +  ipSummaryParam['pubicIP'] + ":" + ipSummaryParam['publicPort'] ;
        console.log("this.url--", url);
        //   console.log("this.commonHostUrl--",this.commonHostUrl);

        //   this.commonTestRun = ipSummaryParam['ndeTestRun'] ;
      }
      console.log("this.ipUrl--", this.ipUrl)
      urlParam1 = this.commonService.makeParamStringFromObj(ipSummaryParam);
      url += urlParam1;
      console.log("side bar case --IP Summary param filter---", ipSummaryParam);
      console.log("side bar case --IP Summary final url---", url);      


    } else if (rowData == undefined) // ED TO DDR CASE - ROWDATA WILL BE UNDEFINED
    {
      console.log("this.queryParams--", this.queryParams);
      // if(this.queryParams == undefined)
      // this.queryParams = this.commonService.getData();
      // let aggBTCallOutInfo_url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) +"/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/AGG?
      urlParam1 =
        "&tierId=" + this.queryParams.tierId +
        "&serverId=" + this.queryParams.serverId +
        "&appId=" + this.queryParams.appId +
        "&tierName=" + this.queryParams.tierName +
        "&serverName=" + this.queryParams.serverName +
        "&appName=" + this.queryParams.appName +
        "&strStartTime=" + this.strStartTime +
        "&strEndTime=" + this.strEndTime +
        "&flowpathID=" + this.queryParams.flowpathID +
        "&strGroup=url&statusCode=-2" +
        "&showCount=false&urlIndex=" + this.queryParams.urlIndex +
        "&urlName=" + this.queryParams.urlName +
        "&integrationPointName=NA" +
        "&integrationPointId=NA";

      this.commonService.ipSummaryFilters = this.commonService.makeObjectFromUrlParam(urlParam1);
      setTimeout(() => {
        this.messageService.sendMessage(this.commonService.ipSummaryFilters);
      }, 2000);
      url += urlParam1 + '&queryId='+this.queryId1;
    }
    this.isCancelQuerydata = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);
    console.log("final url created in ED to ip summary case---", url);
    console.log("ipSummaryFilters--", JSON.stringify(this.commonService.ipSummaryFilters));
    console.log("ip url before returning",this.ipUrl);
    return this.ddrRequest.getDataUsingGet(url).subscribe(
      data => { this.assignAggBTCalOutInfo(data) },
      error => {
        this.loading = false;
        this.showMessage = false;
        // console.log("checkk ", error);
        if (error.hasOwnProperty('message')) {
          this.commonService.showError(error.message);
        }
         else if (error.hasOwnProperty('statusText')) {
            this.commonService.showError(error.statusText);
            console.error(error);
          }
          else
          console.error(error);     
      });
  
    // let aggBTCallOutInfo_url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) + "/v1/cavisson/netdiagnostics/webddr/BTCalloutInfo/AGG?testRun=" + this.urlParam.testRun + "&tierId=" + this.queryParams.tierId + "&serverId=" + this.queryParams.serverId + "&appId=" + this.queryParams.appId + "&strStartTime=" + this.strStartTime + "&strEndTime=" + this.strEndTime + "&strGroup=url&statusCode=-2" + "&showCount=false&urlIndex=" + this.queryParams.urlIndex + "&urlName=" + this.queryParams.urlName;
    // this.http.get(aggBTCallOutInfo_url).timeout(this.commonService.ajaxTimeOut).subscribe(
    //   data => { this.assignAggBTCalOutInfo(data) },
    //   error => {
    //     this.loading = false;
    //     if(error.hasOwnProperty('message')){
    //      this.showError('Query taking more time than ' + this.commonService.ajaxTimeOut + ' ms to give response');
    //     }
    //     else{
    //      if(error.hasOwnProperty('statusText')){
    //       this.showError(error.statusText);
    //       console.error(error);
    //      }
    //     }
    //  }
    // );
  }

  assignAggBTCalOutInfo(data: any) {
    this.loading = false;
    this.commonService.isFilterFromSideBar = false;
    this.isCancelQuerydata =true;
    if (data.hasOwnProperty('Status')) {
      if (data.Status !== "" && data.Status !== "NA" && data.Status !== undefined) {
        this.commonService.showError(data.Status);
      }
    }
    // console.log(data);
    this.btCallOutInfoAgg = data.data;
    if (this.queryParams && this.queryParams.Instance_Type) {
      this.displayAutoInst = true;

    } else {
      this.getVectorIds();
    }

    this.defaultSort(this.btCallOutInfoAgg, 'maxCalloutCount', '-1');
    this.commonService.ipSummaryFilters['startTimeInDateFormat'] = data.strStartTime;
    this.commonService.ipSummaryFilters['endTimeInDateFormat'] = data.strEndTime;

    this.createFilterCriteria();
    if (this.btCallOutInfoAgg.length > 0) {
       console.log("r We Here************",this.btCallOutInfoAgg.length);
      this.queryId1 = undefined;
      this.queryId2 = this.randomNumber();
      this.openIndIP(this.btCallOutInfoAgg[0]);

    } else if (this.btCallOutInfoAgg.length == 0) {
      this.loading = false;
      this.btCalloutInfoInd = [];
      this.selectedBT = '';
      this.TotalCalloutcount = '';
      this.showDownLoadReportIcon = false;
      this.emptyBtCallOutAgg = true;
    }
  }

  /**
  * @param error notification
  */
  showError(msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }
  openIndIP(rowData) {
    this.isCancelQuerydata =false;
    console.log("url in openIndIP=",this.ipUrl);
    this.selectedBT = " [ BT= " + rowData.url;
    this.loading = true;

    this.selectedRowInfo = rowData
   // console.log("row date value",rowData,"max_flow case",this.max_flow_path,"condition value",rowData.fpCount >= this.max_flow_path)
    if (Number(rowData.fpCount) >= Number(this.max_flow_path)) {
      this.showWarning = true;
    }
    else{
      this.showWarning = false;
    }
      if(Number(rowData.fpCount) >= 10000){
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 5000);
      }
      else
        this.showMessage = false;    
    //  console.log("showwarning value in hotspot--------"+ this.showWarning );
    let urlInd1 = "";
    let indiBTCallOutInfo_url = this.ipUrl;
    this.limit = this.max_flow_path;
    this.offset = 0;
    this.urlNameIP = rowData.url;
    this.urlIndexIP = rowData.urlID;
    if (this.commonService.isFilterFromSideBar)     // side bar applied filter
    {
      let ipSummaryParam = this.commonService.ipSummaryFilters;
      urlInd1 = "&tierName=" + ipSummaryParam.tierName  + "&tierId=" + ipSummaryParam.tierId + "&serverId=" + ipSummaryParam.serverId + "&appId=" + ipSummaryParam.appId + "&strStartTime=" + ipSummaryParam.strStartTime + "&strEndTime=" + ipSummaryParam.strEndTime + "&statusCode=-2" + "&showCount=false&urlIndex=" + rowData.urlID + "&flowpathRange=" + this.max_flow_path + "&limit=" + this.limit + "&offset=" + this.offset;
    } else {
      console.log('this.queryParams****************>>>>>>>', this.queryParams);
      urlInd1 = "&tierName=" + this.queryParams.tierName + "&tierId=" + this.queryParams.tierId + "&serverId=" + this.queryParams.serverId + "&appId=" + this.queryParams.appId + "&strStartTime=" + this.strStartTime + "&strEndTime=" + this.strEndTime + "&statusCode=-2" + "&showCount=false&urlIndex=" + rowData.urlID + "&flowpathRange=" + this.max_flow_path + "&limit=" + this.limit + "&offset=" + this.offset;
    }
    indiBTCallOutInfo_url = this.ipUrl + urlInd1 +'&queryId='+this.queryId2;
    this.isCancelQuerydata = false;
    setTimeout(() => {
      this.openpopup();
    }, this._ddrData.guiCancelationTimeOut);

    this.ddrRequest.getDataUsingGet(indiBTCallOutInfo_url).subscribe(data => { this.assignIndBTCallOutData(data) });
}

  assignIndBTCallOutData(data) {
    this.showMessage = false;
    this.loading = false;
    this.isCancelQuerydata =true;
    if(this.aggCase == true) {
     this.TotalCalloutcount = ", Total Callout = " + this.formatter((Object.keys(data['actualBackendNameMap'])).length) + " ]";
     this.filterCriteriaagg = this.selectedBT + this.TotalCalloutcount;
    }
    if (data.hasOwnProperty('Status')) {
      if (data.Status !== "" && data.Status !== "NA" && data.Status !== undefined) {
        this.commonService.showError(data.Status);
      }
    }

    this.commonService.isFilterFromSideBar = false;
    let backendCalloutInfo = data.dataObj;
    let actualBackendNameMap = data.actualBackendNameMap;
    if(data.aggDataForBackends && Object.keys(data.aggDataForBackends).length > 0)
    {
      console.log("aggregate case-------------");
    this.aggCase=true;
    this.renamebackendNameMap=data.renamebackendNameMap;
    this.actualBackendNameMap=data.actualBackendNameMap;
    this.backendSubTypeNameMap=data.backendSubTypeNameMap
    this.aggIpInfo=data.aggDataForBackends;
    }
    else
    {
      console.log("previous  case-------------");
      this.aggCase=false;
    this.btCalloutInfoInd = this.convertMaptoArr(backendCalloutInfo, actualBackendNameMap);
    if (this.btCalloutInfoInd.length == 0){
      this.showDownLoadReportIcon = false;
      this.emptyBtCallOutInd = true;
    }
    else
      this.showDownLoadReportIcon = true;
    }
    
  }

  convertMaptoArr(backendCalloutInfo, actualBackendNameMap) {
    let arr = Object.keys(backendCalloutInfo);
    let bakendCallInfoModified = [];
    let count = 0;
    arr.forEach((val, index) => {
      let backend = backendCalloutInfo[val];
      // console.log(actualBackendNameMap[backend['backendID']]);
      if (this.commonService.ipSummaryFilters['integrationPointName'] !== 'NA' && this.commonService.ipSummaryFilters['integrationPointName'] !== undefined) {
        this.commonService.ipSummaryFilters['integrationPointName'].forEach((val, index) => {
          let IPname = this.commonService.ipSummaryFilters['integrationPointName'][index];
          if (IPname == actualBackendNameMap[backend['backendID']]) {
            bakendCallInfoModified.push({
              "backendName": actualBackendNameMap[backend['backendID']].replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n"),
              "minCount": backend['minCount'],
              "maxCount": backend['maxCount'], "totalCount": backend['totalCount'], "minRespTime": backend['minRespTime'],
              "maxRespTime": backend['maxRespTime'], "avgResponseTime": backend['avgResponseTime'], "totalRespTime": backend['totalRespTime'],
              "minNetworkDelay": this.formatterFixed(backend['minNetworkDelay']), "maxNetworkDelay": this.formatterFixed(backend['maxNetworkDelay']),
              "AverageNetworkDelay": this.formatterFixed(backend['AverageNetworkDelay']), "totalNetworkDelay": this.formatterFixed(backend['totalNetworkDelay'])
            });
            count += backend['totalCount'];
          }
        });
      } else {
        bakendCallInfoModified.push({
          "backendName": actualBackendNameMap[backend['backendID']].replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n"), "minCount": backend['minCount'], "maxCount": backend['maxCount'], "totalCount": backend['totalCount'], "minRespTime": backend['minRespTime'], "maxRespTime": backend['maxRespTime'], "avgResponseTime": backend['avgResponseTime'], "totalRespTime": backend['totalRespTime']
          , "minNetworkDelay": this.formatterFixed(backend['minNetworkDelay']), "maxNetworkDelay": this.formatterFixed(backend['maxNetworkDelay']),
          "AverageNetworkDelay": this.formatterFixed(backend['AverageNetworkDelay']), "totalNetworkDelay": this.formatterFixed(backend['totalNetworkDelay'])
        });
        count += backend['totalCount'];
      }
    });
     if(this.aggCase == false)
      this.TotalCalloutcount = ", Total Callout = " + this.formatter(count) + " ]";
    return bakendCallInfoModified;
  }

  openIPHealth(rowData) {

  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
     // hostDcName = this._ddrData.host + ':' + this._ddrData.port;
      this.urlParam.testRun = this._ddrData.testRun;
      // this.testRun= this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.urlParam.testRun);
    }
    // else if (this._navService.getDCNameForScreen("flowpath") === undefined)
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
  formatter(data: any) {
    if (Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }

  downloadReportForAgg(reportType) {
    console.log(reportType);
    let renameArray = {
      'url': 'Business Transaction', 'minHttpCalloutCount': 'Min HTTP Callout', 'maxHttpCalloutCount': 'Max HTTP Callout',
      'totalHttpCalloutCount': 'Total HTTP Callout', 'minDBCalloutCount': 'Min DB Callout', 'maxDBCalloutCount': 'Max DB Callout', 'totalDBCalloutCount': 'Total DB Callout',
      'minCalloutCount': 'Min Callout', 'maxCalloutCount': 'Max Callout', 'fpCount': 'Flowpath(s)'
    };
    let colOrder = [
      'Business Transaction', 'Min HTTP Callout', 'Max HTTP Callout', 'Total HTTP Callout', 'Min DB Callout', 'Max DB Callout',
      'Total DB Callout', 'Min Callout', 'Max Callout', 'Flowpath(s)'
    ];
    let btCallOutInfoAgg = JSON.parse(JSON.stringify(this.btCallOutInfoAgg));
    btCallOutInfoAgg.forEach((val, index) => {
      delete val['fpSignatureCount'];
      delete val['variance'];
      delete val['urlID'];
      delete val['avgDur'];
      delete val['min'];
      delete val['max'];
      delete val['totalCalloutCount'];
      delete val['_$visited'];
    });
    let downloadObj: Object = {
      downloadType: reportType,
      varFilterCriteria: this.downloadFilterCriteria,
      strSrcFileName: 'btipsummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(btCallOutInfoAgg)
    };
    let downloadFileUrl = '';
    downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product);
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    let downloadFileUrl = '';

    downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/common/' + res);
    window.open(downloadFileUrl);
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - BT IP Summary - Test Run : ' + this.urlParam.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - BT IP Summary- Session : ' + this.urlParam.testRun;
    }
  }

  downloadReportForInd(reportType) {
    console.log(reportType);
    let renameArray = {
      'backendName': 'Integration Point', 'minCount': 'Min Count', 'maxCount': 'Max Count',
      'totalCount': 'Total Count', 'minRespTime': 'Min Time(ms)', 'maxRespTime': 'Max Time(ms)', 'avgResponseTime': 'Avg Time(ms)',
      'totalRespTime': 'Total Time(ms)', "minNetworkDelay": "Min Network Delay(ms)",
      "maxNetworkDelay": "Max Network Delay(ms)",
      "totalNetworkDelay": "Total Network Delay(ms)",
      "AverageNetworkDelay": "Average Network Delay(ms)"
    };
    let colOrder = [
      'Integration Point', 'Min Count', 'Max Count', 'Total Count', 'Min Time(ms)', 'Max Time(ms)',
      'Avg Time(ms)', 'Total Time(ms)', 'Min Network Delay(ms)', 'Max Network Delay(ms)', 'Average Network Delay(ms)', 'Total Network Delay(ms)'];
    this.btCalloutInfoInd.forEach((val, index) => {
      val.minRespTime = Number(val.minRespTime.toFixed(3));
      val.maxRespTime = Number(val.maxRespTime.toFixed(3));
      val.avgResponseTime = Number(val.avgResponseTime.toFixed(3));
      val.totalRespTime = Number(val.totalRespTime.toFixed(3));
      delete val['backendID'];
      delete val['_$visited'];
    });
    let downloadObj: Object = {
      downloadType: reportType,
      varFilterCriteria: this.selectedBT + this.TotalCalloutcount,
      strSrcFileName: 'btipsummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.btCalloutInfoInd)
    };
    let downloadFileUrl = '';
    downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product);
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));

    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
  }

  sortColumnsOnCustomForAgg(event, tempData) {
    //for interger type data type
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
          return 0;
        } else if (a[temp].startsWith('<')) {
          return 1;
        } else if (b[temp].startsWith('<')) {
          return -1;
        }

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
        if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
          return 0;
        } else if (a[temp].startsWith('<')) {
          return -1;
        } else if (b[temp].startsWith('<')) {
          return 1;
        }
        var value = Number(a[temp].replace(/,/g, ''));
        var value2 = Number(b[temp].replace(/,/g, ''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
    this.btCallOutInfoAgg = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.btCallOutInfoAgg = this.Immutablepush(this.btCallOutInfoAgg, rowdata) });
    }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  sortColumnsOnCustomForInd(event, tempData) {
    //for interger type data type
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;

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
    this.btCalloutInfoInd = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.btCalloutInfoInd = this.Immutablepush(this.btCalloutInfoInd, rowdata) });
    }
  }

  defaultSort(tempData, field, order) {
    //for interger type data type
    //console.log('tempdata>>>>>',tempData,'field>>>>>',field,'order>>>>>>>',order);

    if (order == -1) {
      var temp = (field);
      order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp]);
        var value2 = Number(b[temp]);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp]);
        var value2 = Number(b[temp]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
    this.btCallOutInfoAgg = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.btCallOutInfoAgg = this.Immutablepush(this.btCallOutInfoAgg, rowdata) });
    }
  }

  valEnteredKeyN(event) {
    console.log(event);
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode == 0) || (event.keyCode == 8))
      return true;
    else
      return false;
  }

  showflowpathConfDialogue() {
    this.showFPConfDia = true;
  }
  applyFlowpathConfiguration() {
    this.showFPConfDia = false;
    this.openIndIP(this.selectedRowInfo);
  }

  closeDialog() {
    // document.body.style.overflow ='auto'
    // document.getElementById('divForScroll').style.overflow='auto'
    this.showFPConfDia = false;
  }
  formatterFixed(value) {
    if (!isNaN(value)) {
      value = (Number(value)).toFixed(3).toLocaleString();
      if (value == 0)
        value = "0";
      return value;
    }
    else
      return value;
  }

  /** Auto Instrumentation DDAI */
  getIdFortier(data) {
    return data.trim().split(":");
  }


  getVectorIds() {
    console.log('this.ipSummaryFilters>>>>>>>>>>>>getVectorIds****', this.commonService.ipSummaryFilters);
    let ipFilter = this.commonService.ipSummaryFilters;
    if (this.commonService.isValidParameter(ipFilter['serverName']) && this.commonService.isValidParameter(ipFilter['appName'])) {
      //let vecArr = this.urlParam.vectorName.split('>');
      this.displayAutoInst = true;
      let urlForid
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == "ALL")
      //   urlForid ="//" + this.getHostUrl() + "/" + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.urlParam.testRun + "&tierName=" + ipFilter['tierName'] + "&serverName=" + ipFilter['serverName'] + "&appName=" + ipFilter['appName'];
      // else
        urlForid = this.getHostUrl() + "/" + this.urlParam.product + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.urlParam.testRun + "&tierName=" + ipFilter['tierName'] + "&serverName=" + ipFilter['serverName'] + "&appName=" + ipFilter['appName'];
      return this.ddrRequest.getDataUsingGet(urlForid).subscribe(data => {
        this.getAgentInfo(data)
      });
    }
    else {
      this.displayAutoInst = false;
    }
  }

  getAgentInfo(res: any) {
    console.log('this.ipSummaryFilters>>>>>>>>>>>>****', this.commonService.ipSummaryFilters);

    this.vecId = this.getIdFortier(res['_body']);
    // key = appName_tierId_serverId_appId
    this.commonService.ipSummaryFilters['tierId'] = this.vecId[0].trim();
    this.commonService.ipSummaryFilters['serverId'] = this.vecId[1].trim();
    this.commonService.ipSummaryFilters['appId'] = this.vecId[2].trim();
    let url;
    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == "ALL")
    //   url = "//" + this.getHostUrl();
    // else
      url = this.getHostUrl();

    url = url + "/" + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/getAgent?testRun=" + this.urlParam.testRun +
      "&tierId=" + this.vecId[0].trim() + "&serverId=" + this.vecId[1].trim() + "&appId=" + this.vecId[2].trim();

      this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      console.log("data for Agent = ", data);
      this.agentType = data;
    });
  }

  openAutoInstDialog() {
    console.log('this.ipSummaryFilters>>>>>>>>>>>>****', this.commonService.ipSummaryFilters);

    let testRunStatus;
    let AgentType;
    let ipFilter = this.commonService.ipSummaryFilters;
    let url;
    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == "ALL")
    //   url = "//" + this.getHostUrl();
    // else
      url = this.getHostUrl();
    url = url + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.urlParam.testRun;
    //  console.log('url *** ', url);
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      //    console.log("data for tr status === " , res);
      testRunStatus = <any> res;
      testRunStatus = testRunStatus.data;
      if (testRunStatus.length != 0) {
        if (this.queryParams && this.queryParams.Instance_Type) {
          this.agentType = this.queryParams.Instance_Type;
        } else {
          this.agentType = this.agentType;
        }

        if (this.agentType.toLowerCase() == 'java')
          AgentType = 'Java';
        else if (this.agentType.toLowerCase() == 'dotnet')
          AgentType = 'DotNet';

        this.showAutoInstrPopUp = true;

        this.argsForAIDDSetting = [ipFilter['appName'], ipFilter['appId'], AgentType, ipFilter['tierName'],
        ipFilter['serverName'], ipFilter['serverId'], "-1", ipFilter['urlName'], "DDR", testRunStatus[0].status, this.urlParam.testRun];
        console.log('this.argsForAIDDSetting>>>>>>>>>>>>****', this.argsForAIDDSetting);
      }
      else {
        this.showAutoInstrPopUp = false;
        alert("Could not start instrumentation, test is not running")
        return;
      }
    });
  }

  startInstrumentation(result) {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog) {
    this.showAutoInstrPopUp = isCloseAIDDDialog;
  }

  ngOnDestroy() {
    console.log("on destroy case--ip summary report---");
    this.sideBarIpSummary.unsubscribe();
  }

  getDCData() {
    let url = this.getHostUrl() + '/' + this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.urlParam.testRun;
    //this.http.get(url).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any> res;
      console.log('COMPONENT - BT/IP Summary , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
      if (data.length == 0) {
        data = this.setNDEInfoForSingleDC();
        console.log("data is ", data);
      }
      if (this.commonService.dcNameList.indexOf(',') != -1) {
        this.getNDEInfo(data)
      } else {
        this.singleDCCase(data);
      }
    },
      error => {
        console.log("multiDC request is getting failed");
      });
  }

  setNDEInfoForSingleDC() {
    let data;
    if (this.urlParam.dcName)
      data = [{ "displayName": this.urlParam.dcName, "ndeId": 1, "ndeIPAddr": this.urlParam.dcIP, "ndeTomcatPort": this.urlParam.dcPort, "ndeCtrlrName": "", "pubicIP": this.urlParam.dcIP, "publicPort": this.urlParam.dcPort, "isCurrent": 1, "ndeTestRun": this.urlParam.testRun, "ndeProtocol": location.protocol.replace(":", "") }];
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
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
          this.testRun = this.ndeInfoData[i].ndeTestRun;
        } else
          this.testRun = this.urlParam.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.protocol;
        this.commonService.testRun = this.testRun;
        console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getAggBTCallOutInfo();
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
            this.urlParam.tierName = tierList;
        }
        else {
          if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
            temp = (this.commonService.tierNameList).substring(dcName.length + 1);
            tierList = temp;
            tierList = tierList.substring(0, tierList.length);
            if (tierList != "") {
              this.urlParam.tierName = tierList;
              this.commonService.fpFilters['tierName'] = tierList;
            }
          } else {
            this.urlParam.tierName = this.commonService.tierNameList;
            this.commonService.fpFilters['tierName'] = this.commonService.tierNameList;
          }
        }
        console.log('tierName=====>', this.urlParam.tierName);
        this.getTieridforTierName(this.urlParam.tierName).then(() => { console.log("******then aaa "); resolve() });
      });
    } catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getNDEInfo(res) {
    // if (this.breadcrumbService.itemBreadcrums && this.breadcrumbService.itemBreadcrums[0].label == 'BT IP Summary')
    if (this.breadcrumb && this.breadcrumb[0].label == 'BT IP Summary')  
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
        console.log("esle case")
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
          // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
          //   url = "//" + this.getHostUrl();
          // }
          // else
            url = this.getHostUrl();
        }
        url += '/' + this.urlParam.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.urlParam.testRun + "&tierName=" + tierName;
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
          this.assignTierID(data)
          resolve();
        });
      } catch (e) {
        console.log('exception in making rest=====', e);
      }
    });
  }

  assignTierID(res) {
    try {
      var temp = res.split(":");
      this.urlParam.tierid = temp[0].trim();
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
          this.testRun = this.ndeInfoData[i].ndeTestRun;
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.testRun = this.urlParam.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.dcProtocol;
        this.commonService.testRun = this.testRun;
        this.commonService.selectedDC = this.selectedDC;
        console.log('commonservice variable------->', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {

      this.getAggBTCallOutInfo();
    })

  }
  assignCallOutCount(event)
  {
    console.log("callout count---",event)
    this.TotalCalloutcount=", Total Callout = " + this.formatter(event)+" ]";
    this.filterCriteriaagg = this.selectedBT + this.TotalCalloutcount;

  }
  closeMessageDialog(){
    this.showMessage = false;
  }

  
  randomNumber(){
    var queryId = (Math.random() * 1000000).toFixed(0);
    console.log("queryId:::::::::::::"+queryId);
     return queryId;
}
  waitQuery()
  {
    this.isCancelQuery = false;
    setTimeout(() => {
      this.openpopup();
  }, this._ddrData.guiCancelationTimeOut);
  }
  
  onCancelQuery(){
      let url = "";
      let queryId ="";
      if(this.queryId1){
        queryId =this.queryId1;
      }else{
        queryId =this.queryId2;
      }
  
     url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.urlParam.testRun +"&queryId="+queryId;  
    console.log("Hello u got that",url);
      this.isCancelQuery = false;
       this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
    }

    openpopup(){
      if(!this.isCancelQuerydata)
      this.isCancelQuery =true;
    }
  
    showMessageSave(mssg: any) {
      this.msgs = [];
      if(mssg=="Query Saved"){
       let smsg = "Query Saved as " + this._ddrData.saveMessage;
       this.msgs.push({ severity: 'success', summary: 'Success Message', detail: smsg });
      }
      else if(mssg=="Query Already Defined")
       this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
      else
       this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    }
}
