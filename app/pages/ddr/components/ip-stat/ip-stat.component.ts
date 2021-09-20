import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../services/common.services'
import { Router } from '@angular/router'
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { SelectItem } from '../../interfaces/selectitem';
import * as moment from 'moment';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import * as jQuery from 'jquery';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-ip-stat',
  templateUrl: './ip-stat.component.html',
  styleUrls: ['./ip-stat.component.css']
})
export class IpStatComponent implements OnInit {
  product: any;
  highcharts = Highcharts;
  res: Object;
  cps: Object;
  err: Object;
  loading = false;
  fullJson;
  timeFilterOptions: SelectItem[];
  eventFilterOptions: SelectItem[];
  display = false;
  ipData = [];
  location = [];
  protocol = '';
  serverIP = '';
  port = '';
  dcName = '';
  strGraphKey = '';
  id;
  offset = 0;
  limit = 22;
  sessionLoginName = 'Cavisson';
  lastIndex = '';
  isPrevious = false;
  getData = false;
  strCGraphKey = null;
  graphTime = 'Last 1 hour';
  nonZeroIP = true;
  isAll = null;
  flowmapName = 'default';
  actualBackendName = 'NA';
  isIncDisGraph = true;
  sortedOrder = '1';
  sortedField = 'dispalyName';
  serverOffset;
  eventDateMap: Object;
  selectedValue;
  urlParam;
  specialDay = 'NA';
  timeLabel = '';
  appliedTimeLabel:string;
  strStartDate = '00/00/00 00:00:00';
  strEndDate = '00/00/00 23:59:59';
  startDate: string;
  endDate: string;
  endSeconds: string;
  endMinutes: string;
  endHours: string;
  startSeconds: string;
  startMinutes: string;
  startHours: string;
  currDateTime: any;
  showGraph = true;
  graphTab = true;
  customFilterDisplay = false;
  headerFilter: string = '';
  startTime: any;
  endTime: any;
  tierName = "";  
  ndeInfoData: any;
  ndeCurrentInfo: any;  
  dcProtocol: string = '//';
  host = '';
  dcPort = '';
  dcList: SelectItem[];
  selectedDC;
  showDCMenu = false;
  cols = [];
  isIPByRespTime: boolean;
  resData: any;
  responseTime: any;
  cacheId: string;
  breadcrumb: BreadcrumbService;

  constructor(private commonService: CommonServices,private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService, private _cavConfig: CavConfigService, private _ddrData: DdrDataModelService,
    private router: Router, private breadcrumbService: DdrBreadcrumbService,private ddrRequest:DDRRequestService,
    breadcrumb: BreadcrumbService ) { this.breadcrumb = breadcrumb; }

    setInCommonService(trun){
      if(trun)
        this.commonService.testRun = trun;
    }

  ngOnInit() {
    this.commonService.isToLoadSideBar = false;
    this.id = this.commonService.getData();
    if (this.router.url.indexOf('/home/ED-ddr/IpStatComponent') != -1 || this.router.url.indexOf('/ddr/IpStatComponent') != -1) {

      if(this.router.url.indexOf('/ddr/IpStatComponent') != -1) {
        this.urlParam = this._ddrData.btTrendParamFromStoreView;
      }
      else if (this.router.url.indexOf('?') != -1) {
        let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
        this.urlParam = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      }

      if (this.urlParam != undefined) {
        this.setInCommonService(this.urlParam.testRun);        
        this.commonService.removeFromStorage();
        if (this.urlParam.backendActualName != undefined)
          this.actualBackendName = this.urlParam.backendActualName;
        if (this.urlParam.strStartDate != undefined)
          this.strStartDate = this.urlParam.strStartDate;
        if (this.urlParam.strEndDate != undefined)
          this.strEndDate = this.urlParam.strEndDate;
        this.urlParam.product = decodeURIComponent(this.urlParam.product);
        this.commonService.setInStorage = this.urlParam;
        this.commonService.paramsForBtTrend = this.urlParam;
        sessionStorage.setItem("vectorName", this.urlParam.vectorName);
        if (this.urlParam.dcNameList && this.urlParam.dcNameList != 'undefined') {
          this.commonService.dcNameList = this.urlParam.dcNameList;
          this.commonService.selectedDC = this.urlParam.dcName;
          this.commonService.isAllCase = this.urlParam.isAll;
          this.commonService.testRun = this.urlParam.testRun;
          this.commonService.tierNameList = this.urlParam.tierNameList;
          sessionStorage.setItem("dcNameList", this.urlParam.dcNameList);
          sessionStorage.setItem("tierNameList", this.urlParam.tierNameList)
          sessionStorage.setItem("isAllCase", this.urlParam.isAll);
        }
	this.commonService.enableQueryCaching = this.urlParam.enableQueryCaching;
      }
      else {
        if (this.commonService.paramsForBtTrend != undefined) {
          this.urlParam = this.commonService.paramsForBtTrend;
        } else {
          this.urlParam = this.commonService.getData();
          this.urlParam.vectorName = sessionStorage.getItem('vectorName');
        }
        this.setInCommonService(this.urlParam.testRun);        
      }
    } else {
      if (this.commonService.paramsForBtTrend != undefined) {
        this.urlParam = this.commonService.paramsForBtTrend;
      } else {
        this.urlParam = this.commonService.getData();
        this.urlParam.vectorName = sessionStorage.getItem('vectorName');
      }
      this.setInCommonService(this.urlParam.testRun);      
    }

    if (this.urlParam.strGraphKey != undefined) {
      this.strGraphKey = this.urlParam.strGraphKey;
    } else if (this.id.strGraphKey != undefined) {
      this.strGraphKey = this.id.strGraphKey;
    }

    if (this.id.product != undefined) {
      console.log('id case', this.id.product);
      this.product = this.id.product;
    } else if (this.urlParam.product != undefined) {
      console.log('urlParam case', this.urlParam.product);
      this.product = this.urlParam.product;
    }

    // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.IPSTAT);
    this.breadcrumb.add({label: 'IP Stat', routerLink: '/ddr/IpStatComponent'});
    this.loading = true;
    this.location = location.href.split('/');
    this.protocol = this.location[0].split(':')[0];
    this.serverIP = this.location[2].split(':')[0];
    if (this.protocol == 'http')
      this.port = this.location[2].split(':')[1] || '80';
    if (this.protocol == 'https')
      this.port = this.location[2].split(':')[1] || '443';
    console.log(this.location);
    this.fillData();

  }

  fillData() {
    this.cols = [
      { field: "action", header: "Action", toolTip: "Action Links", width: 28, align: 'left' },
      { field: 'dispalyName', header: 'Integration Point', sortable: true, width: '80', align: 'left' },
      { field: 'available', header: 'Available', sortable: true, width: '30', align: 'left' },
      { field: 'health', header: 'Health', sortable: false, width: '25', align: 'center' },
      // { field: 'totalThread', header: 'Total Thread(s)', sortable: true, width: '30', align: 'left' },
      // { field: 'activeThread', header: 'Active Thread(s)', sortable: true, width: '30', align: 'left' },
      { field: 'res', header: 'Avg', sortable: true, width: '20', align: 'right' },
      { field: 'resMax', header: 'Max', sortable: true, width: '20', align: 'right' },
      { field: 'chart1', header: 'Response Time Trend', sortable: false, width: '70' },
      { field: 'cps', header: 'CPS', sortable: true, width: '25', align: 'right' },
      { field: 'chart2', header: 'CPS Trend', sortable: false, width: '70' },
      { field: 'totalCps', header: 'Total Calls', sortable: 'custom', width: '30', align: 'right' },
      { field: 'epsTotal', header: 'Total Errors', sortable: true, width: '30', align: 'right' },
      { field: 'chart3', header: 'Error Trend', sortable: false, width: '70' },
    ];

    this.updateDateTime();
    if (this.commonService.dcNameList) {
      this.getDCData();
    } else {
      this.getIPData();
      this.commonService.host = '';
      this.commonService.port = '';
      this.commonService.protocol = '';
      //this.commonService.testRun = '';
      this.commonService.selectedDC = '';
      this.setInCommonService(this.urlParam.testRun || this.id.testRun);
    }
  }

  openFPByIntegrationReport(rowData: any, flag: string) {
    try {
      console.log('rowData------>', rowData);
      let backendIdUrl = '';
      if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
        this.showDCMenu = false;
      //   if(this._ddrData.protocol)
      //   backendIdUrl = this._ddrData.protocol + "://" + this.getHostUrl() ;
      // else
        backendIdUrl = this.getHostUrl() ;
        console.log("urllll formeddddd", backendIdUrl);
      }
      else {
        this.dcProtocol = this.commonService.protocol;
  
        if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
          backendIdUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
          this.dcProtocol = this.commonService.protocol;
        }
        else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
          backendIdUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
          this.dcProtocol = this.commonService.protocol;
        }
        else {
          backendIdUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
          this.dcProtocol = location.protocol;
        }
        this.serverIP = this.commonService.host;
        if (this.commonService.protocol)
          this.dcProtocol = this.commonService.protocol;
        if (this.dcProtocol.indexOf("https") != -1) {
          this.protocol = 'https';
        } else {
          this.protocol = 'http';
        }
        this.port = this.commonService.port;
      }
      if (this.product.includes('/')) {
        backendIdUrl += this.product + '/v1/cavisson/netdiagnostics/ddr/backendId?testRun='+ this.urlParam.testRun +
                       '&backendName=' + rowData.discoverName;
      } else {
        backendIdUrl += '/' + this.product + '/v1/cavisson/netdiagnostics/ddr/backendId?testRun='+ this.urlParam.testRun +
                     '&backendName=' + rowData.discoverName;
      }
      var backendId = '';
      this.ddrRequest.getDataInStringUsingGet(backendIdUrl).subscribe(data => {
        console.log('backendId--->',data);
        backendId = data;
        if (backendId.startsWith('Error')) {
          alert(backendId);
          return;
        }
        var tierID = 'NA';
    var serverID = 'NA';
    var appID = 'NA';
    let urlForid = '';
    if (this.product.includes('/')) {
      //  if(this._ddrData.protocol)
      //   urlForid = this._ddrData.protocol +'://' + this.getHostUrl() + this.product;
      //  else
        urlForid = this.getHostUrl() + this.product;
    } else {
      //  if(this._ddrData.protocol)
      //   urlForid = this._ddrData.protocol +'://' + this.getHostUrl() + '/' + this.product;
      //  else
        urlForid = this.getHostUrl() + '/' + this.product;
    }
        urlForid += '/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=' + this.urlParam.testRun
        + '&tierName=' + this.urlParam.vectorName;
        this.ddrRequest.getDataInStringUsingGet(urlForid).subscribe(data => {
        // console.log(data);
        var temp = this.getIdFortier(data);
        tierID = temp[0].trim();
        serverID = temp[1].trim();
        appID = temp[2].trim();
      let fpdata = {};
    console.log(this.id);
    fpdata['tierId'] = tierID;
    fpdata['serverId'] = serverID;
    fpdata['appId'] = appID;
    fpdata['tierName'] = this.id.tierName || this.urlParam.vectorName;
    fpdata['serverName'] = this.id.serverName;
    fpdata['appName'] = this.id.appName;
    fpdata['backendId'] = backendId;
    fpdata['backendSubType'] = rowData.backendSubType;
    fpdata['minresTimeOfBackend'] = rowData.resMin;
    if (flag === 'FPByResTime') {
     fpdata['maxresTimeOfBackend'] = this.responseTime;
    }
    fpdata['avgresTimeOfBackend'] = rowData.avgResponseTime
    fpdata['startTime']= this.id.startTime;
    fpdata['endTime']=this.id.endTime;
    fpdata['backendName'] = rowData['discoverName'];
    this._ddrData.splitViewFlag = false;
    console.log('fpdata-----', fpdata);
    if(this.commonService.enableQueryCaching){
      this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
    }
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.IPSTAT;
    this.commonService.IPByFPData = fpdata;
    this._ddrData.IPByFPFlag = true;
    this._ddrData.isFromtrxFlow = false;
    this._ddrData.isFromtrxSideBar = false;
    this.commonService.isFilterFromSideBar = false;
    this._ddrData.FromexpFlag = 'false';
    if (this.router.url.indexOf('/home/ddrCopyLink/') != -1) {
      this._ddrData.setInLogger('DDR::Bt Trend::Flowpath','Flowpath','Open Flowpath Report');      
      this.router.navigate(['/home/ddrCopyLink/flowpath']);
    } else if (this.router.url.indexOf('/home/ED-ddr') != -1) {
      this._ddrData.setInLogger('DDR::Bt Trend::Flowpath','Flowpath','Open Flowpath Report');      
      this.router.navigate(['/home/ED-ddr/flowpath']);
    } else {
      this._ddrData.setInLogger('DDR::Bt Trend::Flowpath','Flowpath','Open Flowpath Report');      
      this.router.navigate(['/ddr/flowpath']);
    }
    });
      },
        error => {
          this.commonService.loaderForDdr = false;
        });
    } catch (error) {
      console.log('Error in opening FP Report---', error);
    }
  }

  createHeaderFilter() {
    let dcName = "";
    this.headerFilter = '';
    
    if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
      this.headerFilter = " DC= " + this.selectedDC + ',';
    } else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      let dcName = this._cavConfigService.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;
      this.headerFilter = " DC= " + dcName + ',';
    }
    if (this.urlParam.vectorName) {
      this.headerFilter += " Tier=" + this.urlParam.vectorName;
    } else if (this.id.tierName && this.id.tierName != "undefined") {
      this.headerFilter += " Tier=" + this.id.tierName;
    }
    if (this.startTime != undefined && this.endTime != undefined) {
      this.headerFilter += ", Start Time=" + this.startTime;
      this.headerFilter += ", End Time=" + this.endTime;
    } else {
      this.headerFilter += ", Start Time=" + this.startDate;
      this.headerFilter += ", End Time=" + this.endDate;
    }
    
  }

  getIPData() {
    var obj = {};
    let url;
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      this.showDCMenu = false;
      url = this.getHostUrl();
      console.log("urllll formeddddd", url);
    }
    else {
      this.dcProtocol = this.commonService.protocol;

      if (this.commonService.protocol && this.commonService.protocol.endsWith("://")) {
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      }
      else {
        url = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
      this.serverIP = this.commonService.host;
      if (this.commonService.protocol)
        this.dcProtocol = this.commonService.protocol;
      if (this.dcProtocol.indexOf("https") != -1) {
        this.protocol = 'https';
      } else
        this.protocol = 'http';

      this.port = this.commonService.port;
    }

    let protocolForObj = "";
    let testRunForObj = "";
    let portForObj = "";
    let serverIPforObj = "";
    if (sessionStorage.getItem("isMultiDCMode") === "true") {
      protocolForObj = this._ddrData.protocol;
      testRunForObj = this._ddrData.testRun;
      portForObj = this._ddrData.port;
      serverIPforObj = this._ddrData.host;
    } else {
      protocolForObj = this.protocol;
      testRunForObj = this.commonService.testRun;
      portForObj = this.port
      serverIPforObj = this.serverIP;
    }
    if (this.commonService.enableQueryCaching == 1) {
      this.cacheId = testRunForObj;
    }else{
      this.cacheId = undefined;
    }

    if (this.commonService.hotspotToIP == true) {

        url += '/' + this.product + '/v1/cavisson/netdiagnostics/ddr/iphealth';

	        obj['testRun'] = testRunForObj,
          obj['protocol'] = protocolForObj,
          obj['port'] = portForObj,
          obj['serverIP'] = serverIPforObj,
          obj['btCategory'] = 'intHealth',
          obj['strGraphKey'] = this.strGraphKey,
          obj['strCGraphKey'] = this.strCGraphKey,
          obj['graphTime'] = this.graphTime,
          obj['critical'] = 'null',
          obj['major'] = 'null',
          obj['isCompare'] = 'false',
          obj['isAll'] = this.isAll,
          obj['backendActualName'] = this.commonService.hotspotToIPData.actualbackendIPname,
          obj['dcName'] = this.id.dcName,
          obj['flowmapName'] = this.flowmapName,
          obj['nonZeroIP'] = this.id.nonZeroIP,
          obj['btName'] = '',
          obj['sesLoginName'] = '',
          obj['offSet'] = this.offset,
          obj['limit'] = this.limit,
          obj['vecName'] = this.id.tierName,
          obj['lastIndex'] = this.lastIndex,
          obj['isPrevious'] = this.isPrevious,
          obj['getData'] = this.getData,
          obj['health'] = '',
          obj['rt'] = '-1.0',
          obj['rtt'] = '-1',
          obj['tps'] = '-1.0',
          obj['tpst'] = '-1',
          obj['es'] = '-1.0',
          obj['est'] = '-1',
          obj['isIncDisGraph'] = this.urlParam.strIncDisGraph || this._ddrData.isDisContinousEnable,
          obj['specialDay'] = this.specialDay,
          obj['cacheId'] =this.cacheId
        
    } else {
      if (this.product.includes('/'))
        url += this.product;
      else
        url += '/' + this.product;

        url += '/v1/cavisson/netdiagnostics/ddr/iphealth';

          obj['testRun'] = testRunForObj,
          obj['protocol'] = protocolForObj,
          obj['port'] = portForObj,
          obj['serverIP'] = serverIPforObj,
          obj['btCategory'] = this.urlParam.btCategory,
          obj['strGraphKey'] = this.urlParam.strGraphKey || this.strGraphKey,
          obj['strCGraphKey'] = this.strCGraphKey,
          obj['graphTime'] =  this.graphTime,
          obj['critical'] = 'null',
          obj['major'] = 'null',
          obj['isCompare'] = 'false',
          obj['isAll'] = this.isAll,
          obj['backendActualName'] = this.actualBackendName,
          obj['dcName'] = this.urlParam.dcName,
          obj['flowmapName'] = this.urlParam.flowmapName,
          obj['nonZeroIP'] = this.urlParam.nonZeroIP,
          obj['btName'] = '',
          obj['sesLoginName'] ='',
          obj['offSet'] = this.offset,
          obj['limit'] = this.limit,
          obj['vecName'] = this.urlParam.vectorName,
          obj['lastIndex'] = this.lastIndex,
          obj['isPrevious'] = this.isPrevious,
          obj['getData'] = this.getData,
          obj['health'] = '',
          obj['rt'] = '-1.0',
          obj['rtt'] = '-1',
          obj['tps'] = '-1.0',
          obj['tpst'] = '-1',
          obj['es'] = '-1.0',
          obj['est'] = '-1',
          obj['isIncDisGraph'] =  this.urlParam.strIncDisGraph,
          obj['specialDay'] = this.specialDay,
          obj['cacheId'] =this.cacheId
       
    }
    // this.http.get(url).subscribe(data => {
    //   this.assignData(data);
    // });
    if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC() == 'ALL')
    {
      if(url.startsWith("http") && url.includes(":"))
        url = url.substring(url.indexOf(":")+1);
      if(url.startsWith("//"))
        url = this._ddrData.protocol + ":" + url;
      else
        url = this._ddrData.protocol + "://" + url;
    }
    
    this.ddrRequest.getDataInStringUsingPost(url,obj).subscribe(data => {
      this.assignData(data);
    },
    error => {
      this.loading = false;
      this.commonService.loaderForDdr = false;
      });
  }

  assignData(res) {
    this.commonService.loaderForDdr = false;
    console.log('res data in Ipstat',res);
    try 
    {
      let dataArray;
    
    //console.log(res);
    try{
     dataArray = res.split('%%%');
    }
    catch(error){
      this.loading = false;
    }
    console.log("dataArray **** " , dataArray);
    let data;
    try {
      data = JSON.parse(dataArray[0]);
    }
    catch(error){
      this.loading = false;
    }
    if(!dataArray[2])
      this.loading = false;
    this.serverOffset = dataArray[2];
    try {
    this.eventDateMap = JSON.parse(dataArray[3]);
    }
    catch(error){
      this.loading = false;
    }
    if(!dataArray[4])
     this.loading = false;
    this.timeLabel = dataArray[4];
    let tempTimeLabel = this.timeLabel && this.timeLabel.split(":")[1];
    if(tempTimeLabel && tempTimeLabel.indexOf('/') == -1){
      this.appliedTimeLabel=this.timeLabel.split(":")[1];
    }
    
    console.log(this.eventDateMap)
     try {
    this.fullJson = JSON.parse(JSON.stringify(data));
     } 
     catch(error){
       this.loading =false;
     }
    //console.log(this.fullJson);
    this.ipData = data.extRowData;
    if (this.fullJson && this.fullJson.startTimeStamp != 0 && this.fullJson.timeZone) {
      this.id.startTime = this.fullJson.startTimeStamp;
      this.id.endTime = this.fullJson.endTimeStamp;
      this.startTime = moment(this.fullJson.startTimeStamp).tz(this.fullJson.timeZone).format("MM/DD/YY HH:mm:ss");
      this.endTime = moment(this.fullJson.endTimeStamp).tz(this.fullJson.timeZone).format("MM/DD/YY HH:mm:ss");
    }
    else
      this.loading = false;
    this.createHeaderFilter();
    if (this.ipData.length == 0) {
      this.showGraph = false;
      this.loading = false;
      return;
    }

    this.showGraph = true;
    // var toSpliceColumn = 0;
    this.ipData.forEach((val) => {
      if (val.available == "0")
        val.available = './images/reddown.png';
      else if (val.available == "1")
        val.available = './images/greenup.png';
      else
        val.available = "NA";

      if (val.totalCps != 0) {
        val.totalCps = (val.totalCps).toLocaleString();
      }

      // if (val.resMax != 0) {
      //   val.resMax = Number(val.resMax).toFixed(0);
      // }

      // if (val.totalThread != 0) {
      //   val.activeThread = (val.activeThread).toLocaleString();
      // }
      // else {
      //   val.totalThread = "-";
      //   val.activeThread = "-";
      // }

      // if (val.totalThread != "-")
      //   toSpliceColumn = toSpliceColumn + 1;

      if (val.health == "normal.png")
        val.health = "./images/" + val.health;
      else
        val.health = "./images/" + val.health;
    });

    // if (toSpliceColumn == 0)                       //If data 0, splice column
    //   this.cols.splice(3, 2);
    this.loading = false;
    this.showGraphWithInfo(this.ipData[this.ipData.length - 1]);
  }
  catch(error) {
    this.loading = false;

  }
  }

  createChartData(node) {

    let seriesArray = new Array();
    let callArray = new Array();
    let errArray = new Array();

    for (let i = 0; i < node.length; i++) {
      let dataArray = new Array();
      dataArray.push(this.fullJson.tsArray[i]);
      dataArray.push(node[i]);
      seriesArray.push(dataArray);
    }

    return seriesArray;
  }

  fillDateTime() {
    let tmpStrStarDate = this.strStartDate.split(" ");
    let tmpStrStarTime = tmpStrStarDate[1].split(":");

    let tmpStrEndDate = this.strEndDate.split(" ");
    let tmpStrEndTime = tmpStrEndDate[1].split(":");

    this.startHours = tmpStrStarTime[0];
    this.startMinutes = tmpStrStarTime[1];
    this.startSeconds = tmpStrStarTime[2];
    this.endHours = tmpStrEndTime[0];
    this.endMinutes = tmpStrEndTime[1];
    this.endSeconds = tmpStrEndTime[2];
    document.getElementById("startHours")['value'] = this.startHours;
    document.getElementById("startMinutes")['value'] = this.startMinutes;
    document.getElementById("startSeconds")['value'] = this.startSeconds;

    document.getElementById("endHours")['value'] = this.endHours;
    document.getElementById("endMinutes")['value'] = this.endMinutes;
    document.getElementById("endSeconds")['value'] = this.endSeconds;
  }

  fillYear() {
    var j = 0;
    var yearObj = document.getElementById("selectYearId");
    for (var i = 2014; i <= new Date().getFullYear(); i++) {
      yearObj['options'][j] = new Option(i.toString());
      j++;
    }
  }
  fillUpEventDays() {

    var eventDaysObj = document.getElementById("selectDayId");

    var arrayEvents = ["Black Friday", "Christmas Day", "Cyber Monday", "Good Friday", "New Years Day", "President's Day", "Thanks Giving Day", "Valentines Day"]

    for (var i = 0; i < arrayEvents.length; i++) {
      eventDaysObj['options'][i] = new Option(arrayEvents[i], arrayEvents[i]);
    }
    this.addEventListner();
    this.fillDateTime();
    this.fillYear();
    this.dateAjaxCall();
  }
  addEventListner() {

    var eventDayObj = document.getElementById("selectDayId");
    var yearObj = document.getElementById("selectYearId");

    if (eventDayObj !== null && eventDayObj != undefined) {
      eventDayObj.addEventListener("click", () => {
        console.log('callong', 'lis')
        this.dateAjaxCall()
      });
    }

    if (yearObj !== null && yearObj != undefined) {
      yearObj.addEventListener("click", () => {
        console.log('callong', 'lis')
        this.dateAjaxCall();
      });
    }



  }
  dateAjaxCall() {
    var eventDayObj = document.getElementById("selectDayId");
    var yearObj = document.getElementById("selectYearId");
    var eventDay = eventDayObj['options'][eventDayObj['selectedIndex']]['value'];
    var year = yearObj['options'][yearObj['selectedIndex']]['value'];
    var url = this.getHostUrl() + "/dashboard/view/eventDay.jsp?eventDay=" + eventDay + "&year=" + year;
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      //console.log(data);
      var response = data.trim();
      var currDate = new Date();
      var eventDate = new Date(response);
      var yyyy = currDate.getFullYear();
      var mm = currDate.getMonth() + 1;
      var dd = currDate.getDate();

      var eventYear = eventDate.getFullYear();
      var eventMonth = eventDate.getMonth() + 1;
      var eventDaySelected = eventDate.getDate();

      if (eventYear >= yyyy) {
        if (eventMonth >= mm) {
          if (eventMonth > mm) {
            alert("Data is not available for " + eventDay + " " + eventYear);
            return;
          }
          else {
            if (eventDaySelected > dd) {
              alert("Data is not available for " + eventDay + " " + eventYear);
              return;
            }
          }
        }
      }
      document.getElementById("txtStartDateId")['value'] = data['_body'].trim();
      document.getElementById("txtEndDateId")['value'] = data['_body'].trim();
      document.getElementById("txtStartDateId")['disabled'] = true;
      document.getElementById("txtEndDateId")['disabled'] = true;
    });
  }

  updateDateTime() {
    var d = new Date();
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000;
    var utcTime = localTime + localOffset;
    //var destOffset = -5;

    var destOffset = Number(this.serverOffset);
    var diffLocalOffset = Number(destOffset) + Number(localOffset);
    var destTime = Number(utcTime) + Number(diffLocalOffset);
    var destTime = Number(utcTime) + Number(destOffset);
    var nd = new Date(destTime);
    this.currDateTime = this.getDateFormat(nd);
    //document.getElementById('SystemClock').innerHTML = currDateTime;
    setTimeout(() => {
      this.updateDateTime();
    }, 1000);
  }


  getDateFormat(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;//January is 0!`

    var year = date.getFullYear();
    if (day < 10) { day = '0' + day }
    if (month < 10) { month = '0' + month }

    var hour = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();

    if (hour < 10) { hour = '0' + hour }
    if (mins < 10) { mins = '0' + mins }
    if (secs < 10) { secs = '0' + secs }
    var formatDate = month + '/' + day + '/' + year + " " + hour + ":" + mins + ":" + secs;
    return formatDate;
  }

  openDateFilter(event) {
    console.log("event==============", event);
    var value = event.value;

    this.openDateFilterOnEventDay(value);

  }

  openDateFilterOnEventDay(value) {

    //console.log("value===================>", value);
    //console.log('currDateTime=====>', this.currDateTime);
    var dateTimeFilter = document.getElementById("eventDateFilter");
    if (value == "EventDay") {
      dateTimeFilter.innerHTML = "<div class = 'ui-g-12'><div><label style='width: 30.5%'>Select Day &nbsp; : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><select id='selectDayId' onchange='dateAjaxCall()' style='width:25%;'></select>&nbsp;&nbsp;&nbsp;&nbsp;<select id='selectYearId' onchange='dateAjaxCall()' style='width:20%'></select></div> </br><div><label style='width: 30%'> From &nbsp;:</label>&nbsp;&nbsp; <input type ='text' title= 'MM/DD/YYYY' id='txtStartDateId' style='width:30%;'> </select> &nbsp;&nbsp;<input type='text' title= 'HH' name='name' id='startHours' placeholder='HH' autocomplete='off' onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' >&nbsp;&nbsp; : &nbsp;&nbsp;<input type='text' title= 'MM' name='name' id='startMinutes' onkeypress = 'return valEnteredKeyN(event);' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'>&nbsp;&nbsp;:&nbsp;&nbsp;<input type='text' title= 'SS' onkeypress = 'return valEnteredKeyN(event);'  name='name' id='startSeconds' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></div></br><div><label style='width: 30%'>To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </label>&nbsp;&nbsp;&nbsp;<input type='text' title= 'MM/DD/YYYY' id='txtEndDateId' style='width:30%;'>&nbsp;&nbsp;&nbsp;<input type='text' title= 'HH' name='name' id='endHours' placeholder='HH' autocomplete='off'  onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' >&nbsp;&nbsp; : &nbsp;&nbsp;<input type='text' title= 'MM' onkeypress = 'return valEnteredKeyN(event);' name='name' id='endMinutes' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'>&nbsp;&nbsp;:&nbsp;&nbsp;<input type='text' title= 'SS' name='name' id='endSeconds' onkeypress = 'return valEnteredKeyN(event);' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></select></div></div>"
      this.customFilterDisplay = false;
      this.fillDateTime();
      this.fillYear()
      this.fillUpEventDays();
    } else if (value == "Custom Date") {

      this.startDate = this.currDateTime.split(' ')[0];
      this.endDate = this.currDateTime.split(' ')[0];
      this.customFilterDisplay = true;
      dateTimeFilter.innerHTML = "";

      let tmpStrStarDate = this.strStartDate.split(" ");
      let tmpStrStarTime = tmpStrStarDate[1].split(":");

      let tmpStrEndDate = this.currDateTime.split(" ");
      let tmpStrEndTime = tmpStrEndDate[1].split(":");

      this.startHours = tmpStrStarTime[0];
      this.startMinutes = tmpStrStarTime[1];
      this.startSeconds = tmpStrStarTime[2];
      this.endHours = tmpStrEndTime[0];
      this.endMinutes = tmpStrEndTime[1];
      this.endSeconds = tmpStrEndTime[2];

      // this.fillDateTime();
    } else if (value == "Yesterday") {
      dateTimeFilter.innerHTML = "<div class = 'ui-g-12'><div><label style='width: 30%'> From &nbsp; : &nbsp;&nbsp; </label> <input type ='text' title= 'MM/DD/YYYY' id='txtStartDateId' style='width:30%;'> </select> &nbsp;&nbsp; <input type='text' title= 'HH' name='name' id='startHours' placeholder='HH' autocomplete='off' onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'MM' name='name' id='startMinutes' onkeypress = 'return valEnteredKeyN(event);' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'SS' onkeypress = 'return valEnteredKeyN(event);'  name='name' id='startSeconds' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></div></br> <div><label style='width: 30%'>To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </label> &nbsp;&nbsp;&nbsp; <input type='text' title= 'MM/DD/YYYY' id='txtEndDateId' style='width:30%;'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' title= 'HH' name='name' id='endHours' placeholder='HH' autocomplete='off'  onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp;&nbsp; <input type='text' title= 'MM' onkeypress = 'return valEnteredKeyN(event);' name='name' id='endMinutes' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'>&nbsp;&nbsp; : &nbsp;&nbsp;<input type='text' title= 'SS' name='name' id='endSeconds' onkeypress = 'return valEnteredKeyN(event);' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></select><div></div>"
      this.customFilterDisplay = false;
      this.fillDateTime();
      this.fillDates("Yesterday");
    }
    else if (value == "Last Week Same Day") {
      this.customFilterDisplay = false;
      dateTimeFilter.innerHTML = "<div class = 'ui-g-12'><div><label style='width: 30%'> From &nbsp; : &nbsp;&nbsp; </label> <input type ='text' title= 'MM/DD/YYYY' id='txtStartDateId' style='width:30%;'> </select> &nbsp;&nbsp; <input type='text' title= 'HH' name='name' id='startHours' placeholder='HH' autocomplete='off' onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'MM' name='name' id='startMinutes' onkeypress = 'return valEnteredKeyN(event);' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'SS' onkeypress = 'return valEnteredKeyN(event);'  name='name' id='startSeconds' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> </div> </br> <div> <label style='width: 30%'>To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </label> &nbsp;&nbsp;&nbsp; <input type='text' title= 'MM/DD/YYYY' id='txtEndDateId' style='width:30%;'> &nbsp;&nbsp; <input type='text' title= 'HH' name='name' id='endHours' placeholder='HH' autocomplete='off'  onkeypress = 'return valEnteredKeyN(event);' tabindex='1' style='width:8%' maxlength='2' > &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'MM' onkeypress = 'return valEnteredKeyN(event);' name='name' id='endMinutes' placeholder='MM' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'> &nbsp;&nbsp; : &nbsp;&nbsp; <input type='text' title= 'SS' name='name' id='endSeconds' onkeypress = 'return valEnteredKeyN(event);' placeholder='SS' autocomplete='off' tabindex='1' style='width:8%' maxlength='2'></select></div></div>"
      this.fillDateTime();
      this.fillDates("Last Week Same Day");
    } else if (value == "Total Test Run") {
      dateTimeFilter.innerHTML = "";
      this.customFilterDisplay = false;
    } else {
      dateTimeFilter.innerHTML = "";
      this.customFilterDisplay = false;
    }

    // if (value == "EventDay")
    //   this.specialDay = document.getElementById("selectDayId")['value'];
    // else if (value == "Yesterday")
    //   this.specialDay = "Yesterday";
    // else if (value == "Last Week Same Day")
    //   this.specialDay = "Last Week Same Day";
  }

  valEnteredKeyN(event) {
    //console.log(event);
    var enteredKey = this.checkBrowser(event);

    if ((enteredKey >= 48 && enteredKey <= 57) || (enteredKey == 0) || (enteredKey == 8))
      return true;
    else
      return false;
  }

  checkBrowser(event) {
    if ((navigator.appName.indexOf("Microsoft") > -1) || (navigator.appName.indexOf("MSIE") > -1)) {
      var enteredKey = event.keyCode;
    }
    else {
      var enteredKey = event.which;
    }

    return enteredKey;
  }


  fillDates(value) {
    var startDate = this.eventDateMap[value];

    document.getElementById("txtStartDateId")['value'] = startDate;
    document.getElementById("txtEndDateId")['value'] = startDate;

    if (this.graphTime == 'Last Week Same Day') {
      // jQuery("#timePeriodLbl").hide();
      document.getElementById("txtStartDateId")['disabled'] = false;
      document.getElementById("txtEndDateId")['disabled'] = false;
      // jQuery("#txtStartDateId").datepicker();
      // jQuery("#txtEndDateId").datepicker();
    } else {
      document.getElementById("txtStartDateId")['disabled'] = true;
      document.getElementById("txtEndDateId")['disabled'] = true;
    }
  }


  showGraphWithInfo(node) {
    console.log(node);

    //console.log(this.fullJson);
    this.graphTab = true;
    let rowData = this.fullJson;

    let resArray = this.createChartData(node.resData);
    let callArray = this.createChartData(node.callData);
    let errArray = this.createChartData(node.errorData);

    // let reslabelFormatter = this.labelFormatterFun('chart1',node);
    // let calllabelFormatter = this.labelFormatterFun('chart2',node);
    // let errlabelFormatter = this.labelFormatterFun('chart3',node);

    this.res = {
      chart: {
        height: 200,
        width: 400,
        responsive: true,
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Response Time (ms)',
        style: {
          fontSize: '15px'
        }
      },
      tooltip: {
        formatter: function () {
          return '<b>Time: </b>'
            + moment.tz(this.x,
              rowData.timeZone).format(
                "MM/DD/YY HH:mm:ss")
            + '<br/ ><b>Value: ' + '</b>'
            + this.y;
        }
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: 'bold',
          fontSize: '10px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function labelFormatterFun() {

          return " Max : "
            + Number(node.resMax).toFixed(1)
            + "    Avg : "
            + Number(node.res).toFixed(1)
            + " ";

        }
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        type: 'time',
        labels: {
          formatter: function () {
            return moment.tz(this.value,
              rowData.timeZone).format(
                "HH:mm:ss");
          },
          style: {
            fontSize: '10px'
          }
        },
        allowDecimals: false
      },
      yAxis: {
        title: {
          text: null,
        },
        min: 0
      },
      series: [
        {
          type: 'line',
          data: resArray
        }
      ]

    };

    this.cps = {
      chart: {
        height: 200,
        width: 400,
        responsive: true,
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'CPS',
        style: {
          fontSize: '15px'
        }
      },
      xAxis: {
        type: 'time',
        labels: {
          formatter: function () {
            return moment.tz(this.value,
              rowData.timeZone).format(
                "HH:mm:ss");
          },
          style: {
            fontSize: '10px'
          }
        },
        allowDecimals: false
      },
      yAxis: {
        title: {
          text: null,
        },
        min: 0
      },
      tooltip: {
        formatter: function () {
          return '<b>Time: </b>'
            + moment.tz(this.x,
              rowData.timeZone).format(
                "MM/DD/YY HH:mm:ss")
            + '<br/ ><b>Value: ' + '</b>'
            + this.y;
        }
      },
      exporting: {
        enabled: false
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: 'bold',
          fontSize: '10px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function labelFormatterFun() {

          return " Max : "
            + Number(node.cpsMax).toFixed(1)
            + "    Avg : "
            + Number(node.cps).toFixed(1)
            + " ";

        }
      },
      series: [
        {
          type: 'line',
          data: callArray
        }
      ]

    };

    this.err = {
      chart: {
        height: 200,
        width: 400,
        responsive: true,
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Errors',
        style: {
          fontSize: '15px'
        }
      },
      xAxis: {
        type: 'time',
        labels: {
          formatter: function () {
            return moment.tz(this.value,
              rowData.timeZone).format(
                "HH:mm:ss");
          },
          style: {
            fontSize: '10px'
          }
        },
        allowDecimals: false
      },
      yAxis: {
        title: {
          text: null,
        },
        min: 0
      },
      tooltip: {
        formatter: function () {
          return '<b>Time: </b>'
            + moment.tz(this.x,
              rowData.timeZone).format(
                "MM/DD/YY HH:mm:ss")
            + '<br/ ><b>Value: ' + '</b>'
            + this.y;
        }
      },
      exporting: {
        enabled: false
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: 'bold',
          fontSize: '10px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function labelFormatterFun() {

          return " Max : "
            + Number(node.epsMax).toFixed(1)
            + "    Avg : "
            + Number(node.eps).toFixed(1)
            + " ";

        }
      },
      series: [
        {
          type: 'line',
          data: errArray
        }
      ]

    };
  }

  // labelFormatterFun(chartID, rowData) {


  //   if (chartID == "chart1" || chartID == "chart4")
  //     return " Max : "
  //       + Number(rowData.resMax).toFixed(1)
  //       + "    Avg : "
  //       + Number(rowData.res).toFixed(1)
  //       + " ";

  //   if (chartID == "chart2" || chartID == "chart5")
  //     return " Max : "
  //       + Number(rowData.cpsMax).toFixed(3)
  //       + "   Avg : "
  //       + Number(rowData.cps).toFixed(3);

  //   if (chartID == "chart3" || chartID == "chart6")
  //     return " Max : "
  //       + Number(rowData.epsMax).toFixed(1)
  //       + "   Avg : "
  //       + Number(rowData.eps).toFixed(1);

  // }

  openExceptionInstanceReport(node) {
    console.log("rowData=======", node);
    var tierID = "NA";
    var serverID = "NA";
    var appID = "NA";
    let urlForid = '';
    if (this.product.includes('/')) {
        urlForid =  this.getHostUrl() + this.product;
    } else {
        urlForid =  this.getHostUrl() + '/' + this.product;
    }
      urlForid += "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.urlParam.testRun + "&tierName=" + this.urlParam.vectorName;
     this.ddrRequest.getDataInStringUsingGet(urlForid).subscribe(data => {
        //console.log(data);
        var temp = this.getIdFortier(data);
        tierID = temp[0].trim();
        serverID = temp[1].trim();
        appID = temp[2].trim();
        var jsonstartTimeStamp = this.fullJson.startTimeStamp;  
        var jsonendTimeStamp = this.fullJson.endTimeStamp;
        var strGraphKey = this.strGraphKey;
        if (strGraphKey.toLowerCase() == "wholescenario") {
          jsonstartTimeStamp = "NA";
          jsonendTimeStamp = "NA";
        }
        this._ddrData.vecArrForGraph = [];
        this._ddrData.testRun = this.urlParam.testRun;
        this._ddrData.tierName = this.urlParam.vectorName || this.id.tierName;
        this._ddrData.product = this.urlParam.product.replace("/", "");
        this.urlParam.tierid = tierID;
        this.urlParam.serverid = serverID;
        this.urlParam.appid = appID;
        this.urlParam.backendNameQuery = node.discoverName;
        this.urlParam.tierName = this.urlParam.vectorName || this.id.tierName;
        this.urlParam.startTime = this.id.startTime|| this.urlParam.strStartTime;
        this.urlParam.endTime = this.id.endTime || this.urlParam.strEndTime;
        this.commonService.setInStorage = this.urlParam;
        this.commonService.expDataFromED = this.urlParam;
        this.commonService.ipstatToExceptionFlag = true;
        this.commonService.fromDBtoExpFlag = false;
        this.commonService.fromhstoExpFlag = false;
        this._ddrData.flowpathToExFlag = false;
        if(this.commonService.enableQueryCaching){
          this._ddrData.enableQueryCaching = this.commonService.enableQueryCaching;
        }
        console.log("this.urlParam======>", this.urlParam);
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.IPSTAT;
        this.commonService.isFilterFromSideBar = false;
	this._ddrData.isFromtrxFlow = false;
        this._ddrData.isFromtrxSideBar = false;
        if (this.router.url.indexOf("/home/ddrCopyLink/") != -1) {
          this._ddrData.setInLogger('DDR::Ip Stat::Exception','Exception','Open Exception Report');
          this.router.navigate(['/home/ddrCopyLink/exception']);
        } else if (this.router.url.indexOf('/home/ED-ddr') != -1) {
          this._ddrData.setInLogger('DDR::Ip Stat::Exception','Exception','Open Exception Report');
          this.router.navigate(['/home/ED-ddr/exception']);
        } else {
          this._ddrData.setInLogger('DDR::Ip Stat::Exception','Exception','Open Exception Report');
          this.router.navigate(['/ddr/exception']);
        }
     });

  }

  getIdFortier(data) {
    return data.trim().split(":");
  }

  openTimeFilter() {
    this.display = true;
    //this.customFilterDisplay = false;
    this.timeFilterOptions = [];
    this.timeFilterOptions.push({ label: 'Today', value: 'Today' });
    this.timeFilterOptions.push({ label: 'EventDay', value: 'EventDay' });
    this.timeFilterOptions.push({ label: 'Last 2 Minutes', value: 'Last 2 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 5 Minutes', value: 'Last 5 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 10 Minutes', value: 'Last 10 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 15 Minutes', value: 'Last 15 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 30 Minutes', value: 'Last 30 Minutes' });
    this.timeFilterOptions.push({ label: 'Last 1 hour', value: 'Last 1 hour' });
    this.timeFilterOptions.push({ label: 'Last 2 hours', value: 'Last 2 hours' });
    this.timeFilterOptions.push({ label: 'Last 4 hours', value: 'Last 4 hours' });
    this.timeFilterOptions.push({ label: 'Last 8 hours', value: 'Last 8 hours' });
    this.timeFilterOptions.push({ label: 'Last 12 hours', value: 'Last 12 hours' });
    this.timeFilterOptions.push({ label: 'Last 24 hours', value: 'Last 24 hours' });
    this.timeFilterOptions.push({ label: 'Yesterday', value: 'Yesterday' });
    this.timeFilterOptions.push({ label: 'Last Week Same Day', value: 'Last Week Same Day' });
    this.timeFilterOptions.push({ label: 'Custom Date', value: 'Custom Date' });

    if (this.urlParam.product.replace("%2F", "") == 'netstorm' || this.id.product == 'netstorm' || this.urlParam.product.replace("/", "") == 'netstorm')
      this.timeFilterOptions.push({ label: 'Total Test Run', value: 'Total Test Run' });

    // this.selectedValue = this.selectedValue ? this.selectedValue : this.timeFilterOptions[0];
    //console.log(this.selectedValue,this.selectedValue['label'])
    this.appliedTimeLabel = this.appliedTimeLabel ? this.appliedTimeLabel : 'Select Time Period';
  }

  trimString(str) {
    // str = this != window? this : str;
    console.log("str===", str)
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }

  compareDatesForOthers(startDate, endDate) {
    var x = new Date(startDate);
    var y = new Date(endDate);

    return (x >= y);
  }

  submitFilterValue() {
    // var startTimeObj = document.getElementById("startComboBox");
    // var selectedValue = startTimeObj['value'];

    // var decodeString = '<%=decodedQueryString%>&strGraphKey=<%=strGraphKey%>' + "&isCompare=" + this.isCompare;
    // var pageName = 'rptBusinessTransaction.jsp?' + decodeString;

    // var selectedCompareValue = jQuery('#compareTime').val(); graphTime, startDateObj, endDateObj

    var strStartTimeAll = '';
    var strEndTimeAll = '';
    var strStartTimeAllMs;
    var strEndTimeAllMs;

    if (this.selectedValue == "EventDay" || this.selectedValue == "Yesterday" || this.selectedValue == "Last Week Same Day" || this.selectedValue == "By Phase") {

      var currentDateTime = this.currDateTime;
      var startDate = document.getElementById("txtStartDateId")['value'];
      var endDate = document.getElementById("txtEndDateId")['value'];

      var startHour = document.getElementById("startHours")['value'];
      var startMinute = document.getElementById("startMinutes")['value'];
      var startSecond = document.getElementById("startSeconds")['value'];


      var endHour = document.getElementById("endHours")['value'];
      var endMinute = document.getElementById("endMinutes")['value'];
      var endSecond = document.getElementById("endSeconds")['value'];


      if (this.trimString(startDate) == "" || this.trimString(startHour) == "" || this.trimString(startMinute) == "" || this.trimString(startSecond) == "" || this.trimString(endDate) == "" || this.trimString(endHour) == "" || this.trimString(endMinute) == "" || this.trimString(endSecond) == "") {
        alert("Start/End Date/Time shouldn't be blank");
        return;
      }

      if (startHour >= 24 || endHour >= 24) {
        alert("Start/End hour field shouldn't be greater than or equals to 24");
        return;
      }

      if (startMinute >= 60 || endMinute >= 60 || startSecond >= 60 || endSecond >= 60) {
        alert("Start/End Minute/Second field shouldn't be greater than or equal to 60 ");
        return;
      }

      var strStartTime = startHour + ":" + startMinute + ":" + startSecond;
      var strEndTime = endHour + ":" + endMinute + ":" + endSecond;

      var strStartTimeAll = this.trimString(startDate) + " " + this.trimString(strStartTime);
      var strEndTimeAll = this.trimString(endDate) + " " + this.trimString(strEndTime);
      strStartTimeAllMs = new Date(strStartTimeAll).getTime();
      strEndTimeAllMs = new Date(strEndTimeAll).getTime();
      var timeDiff1 = Math.abs(strStartTimeAllMs - strEndTimeAllMs);
      sessionStorage.setItem('timeDiff1', timeDiff1.toString());
      console.log(strStartTimeAll, ' ', strEndTimeAll, ' ', strStartTimeAllMs, ' ', strEndTimeAllMs)

      if (this.compareDatesForOthers(strStartTimeAll, currentDateTime)) {
        alert("Start date/time cannot be greater than current date/time");
        return;
      }
      if (this.compareDatesForOthers(strEndTimeAll, currentDateTime)) {
        alert("End date/time cannot be greater than current date/time");
        return;
      }

      if (this.compareDatesForOthers(strStartTimeAll, strEndTimeAll)) {
        alert("Start date cannot be greater than end date");
        return;
      }
      this.specialDay = "";

      if (this.selectedValue == "EventDay")
        this.specialDay = document.getElementById("selectDayId")['value'];
      else if (this.selectedValue == "Yesterday")
        this.specialDay = "Yesterday";
      else if (this.selectedValue == "Last Week Same Day")
        this.specialDay = "Last Week Same Day";
      // window.location.href = "#";


      // window.location.href = pageName + "&strStarDate=" + strStartTimeAll + "&strEndDate=" + strEndTimeAll + "&strGraphTime=" + this.selectedValue + "&strSpecialDay=" + specialDay;
      // document.getElementById("selectPhaseId")['value'];
    } else if (this.selectedValue == "Custom Date") {

      var currentDateTime = this.currDateTime;
      // var startDate = document.getElementById("txtStartDateId")['value'];
      // var endDate = document.getElementById("txtEndDateId")['value'];

      // var startHour = document.getElementById("startHours")['value'];
      // var startMinute = document.getElementById("startMinutes")['value'];
      // var startSecond = document.getElementById("startSeconds")['value'];


      // var endHour = document.getElementById("endHours")['value'];
      // var endMinute = document.getElementById("endMinutes")['value'];
      // var endSecond = document.getElementById("endSeconds")['value'];

      console.log(this.startDate, '----', this.endDate, '----', this.endSeconds);

      if (this.startDate.toString().includes(" ")) {
        console.log('here start date');
        let strDate = new Date(this.startDate);
        this.startDate = (strDate.getMonth() + 1).toString() + '/' + strDate.getDate().toString() + '/' + strDate.getFullYear().toString();
      }

      if (this.endDate.toString().includes(" ")) {
        console.log('here end date');
        let endDate = new Date(this.endDate);
        this.endDate = (endDate.getMonth() + 1).toString() + '/' + endDate.getDate().toString() + '/' + endDate.getFullYear().toString();
      }

      if (this.trimString(this.startDate) == "" || this.trimString(this.startHours) == "" || this.trimString(this.startMinutes) == "" || this.trimString(this.startSeconds) == "" || this.trimString(this.endDate) == "" || this.trimString(this.endHours) == "" || this.trimString(this.endMinutes) == "" || this.trimString(this.endSeconds) == "") {
        alert("Start/End Date/Time shouldn't be blank");
        return;
      }

      if (Number(this.startHours) >= 24 || Number(this.endHours) >= 24) {
        alert("Start/End hour field shouldn't be greater than or equals to 24");
        return;
      }

      if (Number(this.startMinutes) >= 60 || Number(this.endMinutes) >= 60 || Number(this.startSeconds) >= 60 || Number(this.endSeconds) >= 60) {
        alert("Start/End Minute/Second field shouldn't be greater than or equal to 60 ");
        return;
      }

      var strStartTime = this.startHours + ":" + this.startMinutes + ":" + this.startSeconds;
      var strEndTime = this.endHours + ":" + this.endMinutes + ":" + this.endSeconds;

      var strStartTimeAll = this.trimString(this.startDate) + " " + this.trimString(strStartTime);
      var strEndTimeAll = this.trimString(this.endDate) + " " + this.trimString(strEndTime);
      strStartTimeAllMs = new Date(strStartTimeAll).getTime();
      strEndTimeAllMs = new Date(strEndTimeAll).getTime();
      var timeDiff1 = Math.abs(strStartTimeAllMs - strEndTimeAllMs);
      sessionStorage.setItem('timeDiff1', timeDiff1.toString());
      console.log(strStartTimeAll, ' ', strEndTimeAll, ' ', strStartTimeAllMs, ' ', strEndTimeAllMs)

      if (this.compareDatesForOthers(strStartTimeAll, currentDateTime)) {
        alert("Start date/time cannot be greater than current date/time");
        return;
      }
      if (this.compareDatesForOthers(strEndTimeAll, currentDateTime)) {
        alert("End date/time cannot be greater than current date/time");
        return;
      }

      if (this.compareDatesForOthers(strStartTimeAll, strEndTimeAll)) {
        alert("Start date cannot be greater than end date");
        return;
      }
      this.specialDay = "";
    } else if (this.selectedValue == "Total Test Run") {
      this.selectedValue = "WholeScenario";
      this.specialDay = "Total Test Run";
      // window.location.href = "#";
      // window.location.href = pageName + "&strGraphTime=" + this.selectedValue + "&strSpecialDay=" + specialDay;
    }
    else {
      // window.location.href = "#";
      // window.location.href = pageName + "&strGraphTime=" + this.selectedValue;
      this.specialDay = 'NA';
    }

    let url;
    url = this.getHostUrl();

    if (this.product.includes('/'))
      url += this.product;
    else
      url += '/' + this.product;

    url += '/v1/cavisson/netdiagnostics/ddr/getGraphKey?graphTime=' + this.selectedValue +
      '&startTime=' + strStartTimeAll + '&endTime=' + strEndTimeAll;

    this.startTime = strStartTimeAll;
    this.endTime = strEndTimeAll;
    

    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any> res;
      //console.log('data========>', data);
      if (data == 'Today')
        this.strGraphKey = 'LAST_DAY';
      else
        this.strGraphKey = data;
      this.graphTime = this.selectedValue;
      console.log(this.strGraphKey);
      this.display = false;
      this.loading = true;
      this.getIPData();
    });

  }

    /*Method is used get host url*/
    getHostUrl(isDownloadCase?): string {
      var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if(!isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfig.getActiveDC() == 'ALL')
      { 
        //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
        this.urlParam.testRun=this._ddrData.testRun;
        console.log("all case url==>",hostDcName,"all case test run==>",this.urlParam.testRun);
      }
    //  else if (this._navService.getDCNameForScreen("flowpath") === undefined)
    //     hostDcName = this._cavConfig.getINSPrefix();
    //   else
    //     hostDcName = this._cavConfig.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");
  
    //   if (hostDcName.length > 0) {
    //     sessionStorage.removeItem("hostDcName");
    //     sessionStorage.setItem("hostDcName", hostDcName);
    //   }
    //   else
    //     hostDcName = sessionStorage.getItem("hostDcName");
  
    //  if(this._ddrData.protocol)
    //       sessionStorage.setItem("protocol",this._ddrData.protocol);
    //     else
    //       sessionStorage.setItem("protocol",location.protocol.replace(":",""));
  
      console.log('hostDcName getHostURL =', hostDcName);
      return hostDcName;
    }
    
  onTabClose(event) {
    this.graphTab = false;
  }
  onTabOpen(event) {
    this.graphTab = true;
  }

  sortEvent(event) {
    this.sortedField = event.field;
    this.sortedOrder = event.order;
  }

  sortColumnsOnCustom(event, tempData) {

    //for interger type data type
    let fieldValue = event["field"];
    this.sortedField = event.field;
    this.sortedOrder = event.order;
    if (event.order == -1) {
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value;
        var value2;
        if (a[fieldValue].toString().includes(","))
          value = Number(a[fieldValue].replace(/,/g, ''));
        else
          value = Number(a[fieldValue]);
        if (b[fieldValue].toString().includes(","))
          value2 = Number(b[fieldValue].replace(/,/g, ''));
        else
          value2 = Number(b[fieldValue]);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value;
        var value2;
        if (a[fieldValue].toString().includes(","))
          value = Number(a[fieldValue].replace(/,/g, ''));
        else
          value = Number(a[fieldValue]);
        if (b[fieldValue].toString().includes(","))
          value2 = Number(b[fieldValue].replace(/,/g, ''));
        else
          value2 = Number(b[fieldValue]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
    this.ipData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.ipData = this.Immutablepush(this.ipData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  formatter(val) {
    return val.toFixed(2);
  }

  getDCData() {
    let url =  this.getHostUrl() + '/' + this.urlParam.product.replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/multiDC?testRun=' + this.urlParam.testRun;
    //this.http.get(url).map(res => res.json()).subscribe(data => (this.getNDEInfo(data)));
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      let data = <any> res;
      console.log('COMPONENT - flowpath , METHOD - getDCData,  var dcNameList= ', this.commonService.dcNameList + " and NDE.csv =", data, "data.length: ", data.length);
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
    if (this.commonService.host) {
      let protocol;
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        protocol = this.commonService.protocol.replace("://", "");
      else
        protocol = location.protocol.replace(":", "");

      data = [{ "displayName": this.commonService.selectedDC, "ndeId": 1, "ndeIPAddr": this.commonService.host, "ndeTomcatPort": this.commonService.port, "ndeCtrlrName": "", "pubicIP": this.commonService.host, "publicPort": this.commonService.port, "isCurrent": 1, "ndeTestRun": this.commonService.testRun, "ndeProtocol": protocol }];
    } else if (this.urlParam.dcName)
      data = [{ "displayName": this.urlParam.dcName, "ndeId": 1, "ndeIPAddr": this.urlParam.dcIP, "ndeTomcatPort": this.urlParam.dcPort, "ndeCtrlrName": "", "pubicIP": this.urlParam.dcIP, "publicPort": this.urlParam.dcPort, "isCurrent": 1, "ndeTestRun": this.urlParam.testRun, "ndeProtocol": location.protocol.replace(":", "") }];

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
          this.protocol = location.protocol.replace(":","");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
        }
	      else
          this.urlParam.testRun = this.urlParam.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.port = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.port;
        this.commonService.protocol = this.protocol;
        this.commonService.testRun = this.urlParam.testRun;

        if (this.selectedDC == this.ndeInfoData[i].displayName)
        this.ndeCurrentInfo = this.ndeInfoData[i];
        console.log('commonservice variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.commonService.loaderForDdr = true;
      this.getIPData();
    })
  }

  getTierNamesForDC(dcName) {
    try {
      return new Promise<void>((resolve, reject) => {
        console.log('getting tiername');
        var tierList = "";
        var allTierDClistArr;
        var temp;
        console.log('this.commonService.tierNameList====>', this.commonService.tierNameList);
        if (this.commonService.tierNameList && this.commonService.tierNameList.toString().indexOf(",") !== -1) {
          allTierDClistArr = this.commonService.tierNameList.split(",");
          for (var i = 0; i < allTierDClistArr.length; i++) {
            if (allTierDClistArr[i].startsWith(dcName)) {
              temp = (allTierDClistArr[i]).substring(dcName.length + 1);
              tierList += temp + ",";
            }
          }

          console.log("after removing dcName from tirList ***** " + tierList);
	  if (tierList == "")
            tierList = this.commonService.tierNameList;

          if (tierList) 
            this.tierName = tierList;

          let selectedDCTiersArr = tierList.substring(0,tierList.length-1).split(",");
          console.log("selectedDCTiersArr length **** " , selectedDCTiersArr.length);

          // let tiersListSize = this.urlParam.tierNameList.split(",");
          // console.log("tiersListSize ***** " , allTierDClistArr);

          let num = 10 / (selectedDCTiersArr.length);
          console.log("num **** ", num, " , after round off **** ", Math.round(num));
          if (Math.round(num) == 0) {
            this.limit = selectedDCTiersArr.length * 2;
            //console.log("this.limit if case ******** ", this.limit);
          }
          else {
            this.limit = 10;
            //console.log("this.limit else case ******* ", this.limit);
          }

          this.urlParam.vectorName = this.tierName;
        }
        else {
          if (this.commonService.tierNameList && this.commonService.tierNameList.startsWith(dcName)) {
            temp = (this.commonService.tierNameList).substring(dcName.length + 1);
            tierList = temp;
            tierList = tierList.substring(0, tierList.length);
            if (tierList != "") {
              this.tierName = tierList;
              this.urlParam.vectorName = tierList;
            }
          } else {
            this.tierName = this.commonService.tierNameList;
            this.urlParam.vectorName = this.commonService.tierNameList;
          }
        }
        console.log('tierName=====>', this.tierName);
        this.getTieridforTierName(this.tierName).then(() => { console.log("******then aaa "); resolve() });

      });
    }
    catch (e) {
      console.log('exception in here==============', e);
    }
  }

  getNDEInfo(res) {
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
      if (dcName.length <= this.ndeInfoData.length && this.selectedDC == this.ndeInfoData[i].displayName) {
        this.ndeCurrentInfo = this.ndeInfoData[i];
        console.log("if length case  ", this.selectedDC);
      }
    }
    this.getSelectedDC();
  }

  getTieridforTierName(tierName) {
    return new Promise<void>((resolve, reject) => {
      // console.log('reached here');
      var url = '';
      var urlObj = {};
      if (this.ndeCurrentInfo != undefined && this.ndeCurrentInfo != null && this.ndeCurrentInfo != '') {
        if (this.ndeCurrentInfo.ndeProtocol != undefined && this.ndeCurrentInfo.ndeProtocol != null && this.ndeCurrentInfo.ndeProtocol != '') {
          let protocol = this.ndeCurrentInfo.ndeProtocol;
          if (protocol.endsWith(":"))
            protocol = protocol.replace(":", "");

          url = protocol + '://' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          console.log("url in iffff caseeeeeee", url);
        } else {
          url = '//' + this.ndeCurrentInfo.ndeIPAddr + ":" + this.ndeCurrentInfo.ndeTomcatPort;
          console.log("urllll in else case of ifffffff", url);
        }
      }
      else {
        url = this.getHostUrl();
        console.log("urllllll in else caseeeeee", url);
      }

      if (this.commonService.BtRequestType == 2) {
        url += '/' + this.urlParam.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp";

        urlObj = {
          strOperName: 'getTSAname',
          testRun: this.commonService.testRun,
          tierName: tierName
        };

        this.ddrRequest.getDataInStringUsingPost(url, urlObj).subscribe(data => {
          this.assignTierID(data);
          console.log("getTieridforTierNamegetTieridforTierNamegetTieridforTierName ");
          resolve();
        });
      } else {
        url += '/' + this.urlParam.product.replace("/", "") + "/analyze/drill_down_queries/NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.commonService.testRun + "&tierName=" + tierName;
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
          this.assignTierID(data);
          console.log("getTieridforTierNamegetTierid ");
          resolve();
        });
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
      console.log("this.selectedDC ", this.selectedDC);
      if (this.selectedDC == this.ndeInfoData[i].displayName) {

        this.ndeCurrentInfo = this.ndeInfoData[i];

        if (this.ndeInfoData[i].ndeProtocol != undefined)
          this.dcProtocol = this.ndeInfoData[i].ndeProtocol + "://";
        else
          this.dcProtocol = location.protocol.replace(":", "");

        if (this.ndeInfoData[i].ndeTestRun) {
          this.commonService.testRun = this.ndeInfoData[i].ndeTestRun;
          this.urlParam.testRun = this.ndeInfoData[i].ndeTestRun;
        }
        else
          this.urlParam.testRun = this.commonService.testRun;

        this.host = this.ndeInfoData[i].ndeIPAddr;
        this.dcPort = this.ndeInfoData[i].ndeTomcatPort;

        this.commonService.host = this.host;
        this.commonService.port = this.dcPort;
        this.commonService.protocol = this.dcProtocol;
        this.commonService.testRun = this.urlParam.testRun;
        this.commonService.selectedDC = this.selectedDC;
        console.log('commonservece variable============', this.commonService.host, '===', this.commonService.port, '======', this.commonService.protocol);
        break;
      }
    }
    this.getTierNamesForDC(this.selectedDC).then(() => {
      this.commonService.isToLoadSideBar = false;
      this.getIPData();
    })
  }
        /* Validating Number input */
        validateQty(event): boolean {
          if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57))
             return false;
          else
             return true;
         }
         isIPByResp(rowData: any) {
          this.isIPByRespTime=true
          this.responseTime = rowData.res;
          this.resData = rowData;
         }
}
