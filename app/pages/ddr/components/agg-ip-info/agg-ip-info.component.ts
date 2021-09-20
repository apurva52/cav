import { Component, OnInit,OnChanges, Input,Output,EventEmitter } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import { Router } from '@angular/router';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DdrBreadcrumbService } from '../../services/ddr-breadcrumb.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-agg-ip-info',
  templateUrl: './agg-ip-info.component.html',
  styleUrls: ['./agg-ip-info.component.css']
})
export class AggIpInfoComponent implements OnInit,OnChanges {

  @Input('aggIpInfo') aggIpInfo:any[];
  @Input('renamebackendNameMap') renamebackendNameMap: any;
  @Input('actualBackendNameMap') actualBackendNameMap: any;
  @Input('backendSubTypeNameMap') backendSubTypeNameMap: any;
  @Input('urlParam') urlParam: any;
  @Input('filterCriteriaagg') filterCriteriaagg: any;
  @Input ('showWarning') showWarning:boolean=false;
  @Input('maxFlowPath') maxFlowPath:number;
  @Input('urlNameIP') urlNameIP: any;
  @Input('urlIndexIP') urlIndexIP: any;

  @Output() calloutCount= new EventEmitter<number>();
  actualAggIPInfo:any[];
  indIPInfo:any[];

  colsForAGGIP=[];
  colsForIndIP=[];

  queryParams: any = {};
  loading: boolean = false;
  showDownLoadReportIcon: boolean = false;
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
  fullQueryName:string;
  selectedRowInfo :any;

  protocol: string = '//';
  host = '';
  port = '';
  showDCMenu = false; 
  dcProtocol: string = '//';

  showAutoInstrPopUp: boolean = false;
  displayAutoInst: boolean = false;
  backendId: string;
  ipUrl: string = '';
  showPagination: boolean = false;
  showPaginationIP: boolean = false;


  showIndIPInfo:boolean=false;


  toggleFilterTitleForIP:string = '';
  isEnabledColumnFilterForIP:boolean = false;
  strTitle: string;
  public isIPByRespTime:boolean = false;
  public responseTime= '';
  ipName:string="";
  resData: any;

  constructor(public commonService: CommonServices,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private ddrRequest:DDRRequestService,
    private _navService: CavTopPanelNavigationService) { }

  ngOnInit() {
    this.initializeColsForAggreate();
    if (this.aggIpInfo.length !== 0) {
      this.showDownLoadReportIcon = true;
    }
  }

  ngOnChanges()
  {
    console.log(this.aggIpInfo, "check filter ",this.filterCriteriaagg);
    this.convertIntoAggIPInfo();
    console.log("warning value----", this.showWarning);
    this.selectedRowInfo={};
    this.fullQueryName='';
    if (this.aggIpInfo.length !== 0) {
      this.showDownLoadReportIcon = true;
    }
  }

  initializeColsForAggreate()
  {

    this.colsForAGGIP=[
        { field: 'renamebackendIPname', header: 'Integration Point', sortable: true, action: true, align: 'left', width: '70' },
        { field: 'actualbackendIPname', header: 'Discovered IPName', sortable: true, action: true, align: 'left', width: '70' },
        { field: 'backendType', header: 'Type', sortable: true, action: true, align: 'left', width: '30' },
        { field: 'totalDuration', header: 'Total Duration(ms)', sortable: 'custom', action: true, align: 'right', width: '50' },
        { field: 'avgDuration', header: 'Avg Duration(ms)', sortable: 'custom', action: true, align: 'right', width: '45' },
        { field: 'maxDuration', header: 'Max Duration(ms)', sortable: 'custom', action: true, align: 'right', width: '45' },
        { field: 'minDuration', header: 'Min Duration(ms)', sortable: 'custom', action: true, align: 'right', width: '45' },
        { field: 'count', header: 'Total count', sortable: 'custom', action: true, align: 'right', width: '45' },
        { field: 'mincount', header: 'Min count', sortable: 'custom', action: true, align: 'right', width: '40' },
        { field: 'maxcount', header: 'Max count', sortable: 'custom', action: true, align: 'right', width: '40' },
        { field: 'errorCount', header: 'Error(s)', sortable: 'custom', action: true, align: 'right', width: '40' },
        { field: 'avgNWDelay', header: 'Average Network Delay(ms)', sortable: 'custom', action: true, align: 'right', width: '45' },
        { field: 'totalNWDelay', header: 'Total Network Delay(ms)', sortable: 'custom', action: true, align: 'right', width: '45' },

    ];
    if ((this.commonService.showIPSummary == false || this.commonService.hsFlag  == false) && this._ddrData.splitViewFlag == false && this._ddrData.isCompFlowpath == false) {
      console.log('making action calls for colsForAGGIP');
      this.colsForAGGIP.splice(0,0,{ field: 'action', header: 'Action', toolTip: 'Action Links', width: '50', action: true, align: 'left' });
    }
      this.colsForIndIP=[
      { field: 'callOutType', header: 'CallOut Type', sortable: true, action: true, align: 'left', width: '50' },
        { field: 'queries', header: 'Queries', sortable: true, action: true, align: 'left', width: '80' },       
        { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true, align: 'right', width: '60' },
        { field: 'endTime', header: 'Duration', sortable: 'custom', action: true, align: 'right', width: '40' },
       // { field: 'statusCode', header: 'Status Code', sortable: false, action: true, align: 'right', width: '60' },
        { field: 'sourceNW', header: 'Network Delay Res(ms)', sortable: 'custom', action: true, align: 'right', width: '60' },
        { field: 'destNW', header: 'Network Delay Req(ms)', sortable: 'custom', action: true, align: 'right', width: '60' },
    ]
    this.visibleCols = [
      'renamebackendIPname', 'actualbackendIPname', 'backendType', 'totalDuration', 'avgDuration', 'maxDuration', 'minDuration', 'count', 'mincount', 'maxcount', 'errorCount', 'avgNWDelay', 'totalNWDelay'
    ];
  }
  convertIntoAggIPInfo()
  {
    let aggIPArr=[];
    let totalCalloutCount=0;
    if(this.aggIpInfo)
    {
    let backendsArr=Object.keys(this.aggIpInfo);
    backendsArr.forEach((val,index)=>{
      console.log(index, val);
      console.log(this.aggIpInfo[val]);
      if(this.aggIpInfo[val]["backendID"] != -1)
      {
        let dur=this.aggIpInfo[val]['duration'];
        let splicedValue=dur.shift();
        let arr = [];
        arr[0] = splicedValue;

        this.aggIpInfo[val]['duration'] = arr.concat(this.aggIpInfo[val]['duration']);   //changes for bug:-65886
       // console.log("value in duration",this.aggIpInfo[val]['duration']);
        // console.log("this.aggIpInfo[val]['agg_count']---------- value",this.aggIpInfo[val]['agg_count']);
        let count:number[]=Object.keys(this.aggIpInfo[val]['agg_count']).map((item)=>{ return this.aggIpInfo[val]['agg_count'][item]});
      // console.log("count value-----------",count);
      // console.log("min count and max count-------------", Math.min(...count),Math.max(...count));
       // count.shift();
       // let arr1 = [];
       // arr1[0] = splicedValue1;

      //  let modiCount = arr1.concat(count);
      let max = this.getMax(dur);
      let min = this.getMin(dur);

      aggIPArr.push({ renamebackendIPname: this.renamebackendNameMap[this.aggIpInfo[val]["backendID"]],
      actualbackendIPname: this.getActualBackendMap(this.actualBackendNameMap[this.aggIpInfo[val]["backendID"]]),
      backendType: this.commonService.BackendTypeName(this.aggIpInfo[val]["backendType"]),
      backendID:this.aggIpInfo[val]["backendID"],
      totalDuration:this.commonService.formatterFixed(this.aggIpInfo[val]['duration'][0]),
      avgDuration: this.commonService.formatter(this.aggIpInfo[val]['duration'][0]/(this.aggIpInfo[val]['countIndex']+this.aggIpInfo[val]['errorCountIndex'])),
      maxDuration:max,
      minDuration:min,
      count:this.commonService.formatter(this.aggIpInfo[val]['countIndex']+this.aggIpInfo[val]['errorCountIndex']),
      mincount:Math.min(...count),
      maxcount:Math.max(...count),
      errorCount: this.commonService.formatter(this.aggIpInfo[val]['errorCountIndex']),
      totalNWDelay: this.calulateTotalNetworkDelay(this.aggIpInfo[val]['senderNWDelay'][0], this.aggIpInfo[val]['receiveNWDelay'][0]),
      avgNWDelay: this.calAvgNWDelay(this.aggIpInfo[val]['senderNWDelay'][0], this.aggIpInfo[val]['receiveNWDelay'][0],(this.aggIpInfo[val]['countIndex']+this.aggIpInfo[val]['errorCountIndex']))
       })
       totalCalloutCount +=(this.aggIpInfo[val]['countIndex']+this.aggIpInfo[val]['errorCountIndex']);
     }

    })
  }
  console.log("callout count value",totalCalloutCount);
  try
  {
  this.calloutCount.emit(totalCalloutCount);
  }
  catch(e)
  {
    console.error(e);
  }
    console.log(aggIPArr);
    this.actualAggIPInfo=aggIPArr;

     if(this.actualAggIPInfo.length > 10)
     this.showPagination = true;
     else
     this.showPagination = false;

  }
  getMin(dur: any) {
  
      let len = dur.length;
      let min = Infinity;
  
      while (len--) {
          min = dur[len] < min ? dur[len] : min;
      }
      return min;
  }
  getMax(dur: any) {
    let len = dur.length;
    let max = -Infinity;

    while (len--) {
        max = dur[len] > max ? dur[len] : max;
    }
    return max;
  }
  calAvgNWDelay(senderNwDelay,receNWDelay,count)
  {
    if(count == 0)
    return 0;
    //console.log("count value---------",count);
    console.log("avg network delay---",((senderNwDelay+receNWDelay)/count));
    return this.commonService.formatterFixed((senderNwDelay+receNWDelay)/count);
  }
  calulateTotalNetworkDelay(senderNwDelay,receNWDelay)
   {
     return this.commonService.formatterFixed((senderNwDelay+receNWDelay));
   }
  openIndIpInfoPopUp(node)
  {
    console.log("bacendID----------",node.backendID);
    this.ipName= "[Integration Point = "+node.renamebackendIPname+"]";
    this.showIndIPInfo=true;
    let INDRawIPInfo=this.aggIpInfo[node.backendID];
    this.assignINDIPData(INDRawIPInfo);
  }
  assignINDIPData(INDRawIPInfo)
  {
    console.log(INDRawIPInfo);
    let indIPInfo=[];
    INDRawIPInfo['callOutType'].forEach((val,index)=>{
     var obj={ 
      queries:this.commonService.getBackendSubType(INDRawIPInfo['backendSubType'][index],this.backendSubTypeNameMap),
      callOutType:this.getCallOutType(val,INDRawIPInfo['backendType']),
      //startTime:this.commonService.formatter(INDRawIPInfo['startTime'][index+1]),
      startTime:INDRawIPInfo['startTime'][index+1],
      endTime:this.commonService.formatter(INDRawIPInfo['duration'][index+1]),
      sourceNW:this.commonService.formatterFixed(INDRawIPInfo['senderNWDelay'][index+1]),
      destNW:this.commonService.formatterFixed(INDRawIPInfo['receiveNWDelay'][index+1])
    };

    if(index ==0)
    {
    this.selectedRowInfo = obj;
    this.fullQueryName=obj.queries;
    }
    indIPInfo.push(obj);
    })
    console.log("indivual ip ifo",indIPInfo);
    this.indIPInfo=indIPInfo;

     if(this.indIPInfo.length > 10)
     this.showPaginationIP = true;
     else
     this.showPaginationIP = false;

  }

  getCallOutType(callOutType,backendType)
  {
      if(callOutType == 'a')
       return "Async Init";
       else if(callOutType == 'A')
       return "Async Exit";
       else if(callOutType== 'x')
       return "Asynchronous Thread Call";
       else if(callOutType == "T" && backendType == 24)
       return "LDAP";
       else if(callOutType == "T" && backendType == 26)
       return "SOCKET";
       else if(callOutType == "T"  && (backendType == 2|| backendType == 10||backendType==15 || backendType == 16 || backendType == 25))
       return "DATABASE";
       else if(callOutType == 'T')
       return "HTTP";
       else if(callOutType == 'E')
       return "CallOut Error";
       else 
       return "OTHERS";
  }
  changeColumnFilterForIP() {
    try {
      let tableColumns = this.colsForAGGIP;
      if (!this.isEnabledColumnFilterForIP) {
        this.toggleFilterTitleForIP = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForIP = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }
  toggleColumnFilterForIP() {
    this.isEnabledColumnFilterForIP = !this.isEnabledColumnFilterForIP;
    // if (this.isEnabledColumnFilterForIP) {
    //   this.isEnabledColumnFilterForIP = false;
    // } else {
    //   this.isEnabledColumnFilterForIP = true;
    // }
    this.changeColumnFilterForIP();
  }
  getActualBackendMap(actualbackendMap)
  {
    if(actualbackendMap)
    return actualbackendMap.replace(/&#46;/g, '.');
    return actualbackendMap;
  }
  openFPByIntegrationReport(rowData: any, flag: string) {
    try {
     if(flag=='FPByID' || this.responseTime ){
      this.urlParam = this.commonService.getData();
      console.log('this.urlParam=== ',this.urlParam);
      console.log('rowData------>', rowData);
      console.log("  hh", flag);
      
      let fpdata = {};
      console.log('urlParam---', this.urlParam, 'backendId---', this.backendId);
      fpdata["tierId"] = this.urlParam.tierId ;
      fpdata["serverId"] = this.urlParam.serverid;
      fpdata["appId"] = this.urlParam.appid;
      fpdata["tierName"] = this.urlParam.tierName;
      fpdata["serverName"] = this.urlParam.serverName;
      fpdata["appName"] = this.urlParam.appName;
      fpdata["backendId"] = rowData.backendID;
      fpdata['minresTimeOfBackend'] = rowData.totalDuration;
      if (flag === 'FPByResTime') {
        console.log("cherkkkk", rowData.totalDuration)
        fpdata['maxresTimeOfBackend'] = this.responseTime;
      }
      fpdata['avgresTimeOfBackend'] = rowData.avgResponseTime
      fpdata["startTime"]= this.urlParam.startTime;
      fpdata['endTime']=this.urlParam.endTime
      fpdata['backendName'] = rowData.actualbackendIPname;
      fpdata['urlNameIP'] = this.urlNameIP;
      this._ddrData.urlIndex = this.urlIndexIP;
      //this._ddrData.splitViewFlag = false;
      console.log("Flwpath Data---x", fpdata,"this._ddrData.urlIndex",this._ddrData.urlIndex);
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.IPSUMMARY;
      this._ddrData.IPByFPFlag = true;
      this._ddrData.FromexpFlag = 'false';
      this.commonService.isFilterFromSideBar = false;
      this.commonService.IPByFPData = fpdata;
      if (this._router.url.indexOf("/home/ddrCopyLink/") != -1)
        this._router.navigate(['/home/ddrCopyLink/flowpath']);
      else if (this._router.url.indexOf("/home/ED-ddr") != -1)
        this._router.navigate(['/home/ED-ddr/flowpath']);
      else
        this._router.navigate(['/home/ddr/flowpath']);
    }
    else{
       this.commonService.showError("Response time cannot be empty");
    }
   }
    catch(error){
      console.log("error   ",error);
    }
  }
  
  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //hostDcName = this._ddrData.host + ':' + this._ddrData.port;
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

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    let downloadFileUrl = '';

    downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/common/' + res);
    window.open(downloadFileUrl);
  }

  downloadReportForInd(reportType) {
    this.urlParam = this.commonService.getData();
    this.setTestRunInHeader();
    console.log(reportType);
    let renameArray = {
      'actualbackendIPname': 'Integration Point', 'renamebackendIPname': 'Discovered IPName', 'backendType': 'Type',
      'totalDuration': 'Total Duration(ms)', 'avgDuration':'Avg Duration(ms)','minDuration':'Min Duration(ms)','maxDuration':'Max Duration(ms)','count': 'Total count', 'mincount':'Min count','maxcount':'Max count','errorCount': 'Error(s)',"avgNWDelay": "Average Network Delay(ms)",
      "totalNWDelay": "Total Network Delay(ms)",
    };
    let colOrder = [ 'Integration Point','Discovered IPName', 'Type', 'Total Duration(ms)','Avg Duration(ms)', 'Max Duration(ms)','Min Duration(ms)','Total count', 'Min count','Max count', 'Error(s)',
   'Average Network Delay(ms)', 'Total Network Delay(ms)'];
     this.actualAggIPInfo.forEach((val, index) => {
      //val.minRespTime = Number(val.minRespTime.toFixed(3));
      //val.maxRespTime = Number(val.maxRespTime.toFixed(3));
     // val.avgResponseTime = Number(val.avgResponseTime.toFixed(3));
     // val.totalRespTime = Number(val.totalRespTime.toFixed(3));
      delete val['backendID'];
      delete val['_$visited'];
  if(val['count'] == undefined || val['count'] == 'undefined'){
        console.log('insideeee couuunt');
        val['count'] = '-';
      }
    });
       let downloadObj: Object = {
      downloadType: reportType,
      varFilterCriteria: this.filterCriteriaagg,
      strSrcFileName: 'btipsummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.actualAggIPInfo)
    };
    let downloadFileUrl = '';
    downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product.replace('/',''));
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
  setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam['ipWithProd']).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - BT IP Summary - Test Run : ' + this.urlParam.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - BT IP Summary- Session : ' + this.urlParam.testRun;
    }
  }

  showRowInfo(rowData:any)
  {
    console.log("rowData ** " , rowData);
    if(rowData.queries)
      this.fullQueryName = rowData.queries;
  }

  sortAggIPTable(event,tempData)
{
  if (event.order == -1) {
    var temp = (event["field"]);
    event.order = 1
    tempData = tempData.sort(function (a, b) {
     
      var value = Number(a[temp].toString().replace(/,/g, ''));
      var value2 = Number(b[temp].toString().replace(/,/g, ''));
      return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
    });
  }
  else {
    var temp = (event["field"]);
    event.order = -1;
    //asecding order
    tempData = tempData.sort(function (a, b) {
      var value = Number(a[temp].toString().replace(/,/g, ''));
      var value2 = Number(b[temp].toString().replace(/,/g, ''));
      return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
    });
  }
      
    this.actualAggIPInfo = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.actualAggIPInfo = this.Immutablepush(this.actualAggIPInfo, rowdata) });
    }
  }

    Immutablepush(arr, newEntry) {
      return [...arr, newEntry]
    }

    sortIndIPTable(event,tempData)
    {

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
      } else {
       
          if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1
            tempData = tempData.sort(function (a, b) {
             
              var value = Number(a[temp].toString().replace(/,/g, ''));
              var value2 = Number(b[temp].toString().replace(/,/g, ''));
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
          }
          else {
            var temp = (event["field"]);
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
              var value = Number(a[temp].toString().replace(/,/g, ''));
              var value2 = Number(b[temp].toString().replace(/,/g, ''));
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
          }
        }
        this.indIPInfo = [];
        //console.log(JSON.stringify(tempData));
        if (tempData) {
          tempData.map((rowdata) => { this.indIPInfo = this.Immutablepush(this.indIPInfo, rowdata) });
        }
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
    this.resData = rowData;
   }
}
