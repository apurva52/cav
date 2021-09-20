import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import 'rxjs/Rx';
import { CavConfigService } from '../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { SelectItem } from '../../interfaces/selectitem';
import { Router } from '@angular/router';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { DDRRequestService } from '../../services/ddr-request.service';
import { DdrDataModelService } from '../../../../main/services/ddr-data-model.service';

@Component({
  selector: 'app-sql-timing',
  templateUrl: './sql-timing.component.html',
  styleUrls: ['./sql-timing.component.css']
})
export class SqlTimingComponent implements OnInit {

  sqlTimingData : Object[] = [{'tierName':'','serverName':'','appName':'','urlName':'','sqlbegintimeStamp':'','sqlexectime':'','sqlQuery':'','queryType':''}];
  sqlTimingInfo:Array<SQLTimingInterface>;
  cols:any[];
  visibleCols: any[];
  columnOptions: SelectItem[];
  urlParam:any;
  loading:boolean=false;
  screenHeight:any;
  limit:number = 50;
  offset:number = 0;
  totalCount:any;
  prevColumn:any;
  filterCriteria:string="";
  strTitle:string;
  showDownloadOption:boolean=true;
  dynamicWidthColumn: number;   // To calculate dynamic width of column

  constructor(private _navService: CavTopPanelNavigationService,private breadcrumbService: DdrBreadcrumbService,
    private _cavConfigService: CavConfigService, private commonService: CommonServices,private _router: Router,
    private ddrRequest:DDRRequestService,private _ddrData:DdrDataModelService) { }

  ngOnInit() {
    this.loading = true;
    this.urlParam = this.commonService.sqlTimingData;
    console.log("this.urlParam *** " , this.urlParam);
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SQL_TIMING);
    this.makeColumns();
    this.getSQLTimingData();
    this.setTestRunHeader();
  }

  getHostUrl(): string {
    var hostDcName = this._ddrData.getHostUrl();
    // if (this._navService.getDCNameForScreen("nsreports") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("nsreports");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  setTestRunHeader()
  {
    if (this.urlParam.product == 'netstorm') 
      this.strTitle = 'Netstorm - SQL Timings - Test Run : ' + this.urlParam.testRun;
    else 
      this.strTitle = 'Netdiagnostics Enterprise - SQL Timings - Session : ' + this.urlParam.testRun;   
  }

  makeColumns()
  {
    this.cols = [{ field: 'tierName', header: 'Tier', sortable: true, action: true, align:'left'}, 
      { field: 'serverName', header: 'Server', sortable: true, action: true, align:'left'},
      { field: 'appName', header: 'Instance', sortable: true, action: true, align:'left'},
      { field: 'urlName', header: 'Business Transaction', sortable: true, action: true, align:'left'},
      { field: 'sqlbegintimeStamp', header: 'Start Time', sortable: true, action: true, align:'right'},
      { field: 'queryType', header: 'Query Type', sortable: true, action: true, align:'left'},
      { field: 'sqlQuery', header: 'Query', sortable: true, action: true, align:'left'},
    ];

    this.visibleCols = ['tierName','serverName','appName','urlName','sqlbegintimeStamp','queryType','sqlQuery'];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
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
        for(let j = 0; j < this.visibleCols.length; j++) {
          if (this.cols[i].field === this.visibleCols[j]) {
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    //data.value.sort(function (a, b) {
      //return parseFloat(a.index) - parseFloat(b.index);
    //});
     let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1300 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;

  }

  getSQLTimingData()
  {
    let url = '';
    if(this.commonService.enableQueryCaching == 1){
      url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathquery?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
    }
    else{
      url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathquery?testRun=' + this.urlParam.testRun;
    }

    url += '&strStartTime=' + this.urlParam.startTime + '&strEndTime=' + this.urlParam.endTime + '&queryTimeMode=' + this.urlParam.queryTimeMode 
    + '&queryTime=' + this.urlParam.queryTime + '&sqlndex=' + this.urlParam.sqlIndex + '&limit=' + this.limit + '&offset=' + this.offset;
    
    console.log(" final url = " , url);
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignValues(data)));
  }

  doAssignValues(res:any)
  {
    this.loading = false;
    this.sqlTimingInfo = res.data;
    this.totalCount = res.totalCount;
    if(this.limit > this.totalCount) {
      this.limit = Number(this.totalCount);
    }
    if(this.sqlTimingInfo.length == 0)
      this.showDownloadOption = false;
    else
      this.showDownloadOption = true;
    this.sqlTimingData = this.getSQLTimingInfo();
    this.showFilterCriteria(res.startTime,res.endTime);
  }

  getSQLTimingInfo():Array<SQLTimingInterface>
  {
    let arr =[];
    for(let i=0; i<this.sqlTimingInfo.length; i++)
    {
      arr[i] = {"tierName":this.sqlTimingInfo[i]['tierName'],"serverName":this.sqlTimingInfo[i]['serverName'],"appName":this.sqlTimingInfo[i]['appName'],
      "urlName":this.sqlTimingInfo[i]['urlName'],"sqlbegintimeStamp":this.sqlTimingInfo[i]['sqlbegintimeStamp'],"sqlQuery":this.sqlTimingInfo[i]['sqlQuery'],
      "sqlexectime":this.sqlTimingInfo[i]['sqlexectime'],"queryType":this.getQueryTypeName(this.sqlTimingInfo[i]['queryType'])};
    }
    return arr;
  }

  getQueryTypeName(queryType:string)
  {
    if(queryType=="0")
			return "Unknown";
		else if(queryType=="1")
			return "Select";
		else if(queryType=="2")
			return "Insert";
		else if(queryType=="3")
			return "Update";
		else if(queryType=="4")
			return "Delete";
		else if(queryType=="5")
			return "Create";
		else if(queryType=="6")
			return "Drop";
		else if(queryType=="7")
			return "Call";
		else if(queryType=="8")
			return "XA Transaction";
		else
			return "Others";
  }

  paginate(event){
    this.loading = true;
    this.offset = parseInt(event.first);
    this.limit = parseInt(event.rows);
    if(this.limit > this.totalCount) {
      this.limit = Number(this.totalCount);
    }
    if((this.limit + this.offset) > this.totalCount) {
      this.limit = Number(this.totalCount) - Number(this.offset);
    }
    this.getSQLTimingData();
  }

  showFilterCriteria(startTimeInDateFormat:any,endTimeInDateFormat:any)
  {
    if(this.urlParam.tierName != "NA" && this.urlParam.tierName != "" && this.urlParam.tierName != "undefined" && this.urlParam.tierName != undefined)
      this.filterCriteria += "Tier=" + this.urlParam.tierName;
    if(this.urlParam.serverName != "NA" && this.urlParam.serverName != "" && this.urlParam.serverName != "undefined" && this.urlParam.serverName != undefined)
      this.filterCriteria += ", Server=" + this.urlParam.serverName;
    if(this.urlParam.appName != "NA" && this.urlParam.appName != "" && this.urlParam.appName != "undefined" && this.urlParam.appName != undefined)
      this.filterCriteria += ", Instance=" + this.urlParam.appName;
    if(startTimeInDateFormat != "NA" && startTimeInDateFormat != "" && startTimeInDateFormat != undefined && startTimeInDateFormat != "undefined")
      this.filterCriteria += ", From=" + startTimeInDateFormat;
    if(endTimeInDateFormat != "NA" && endTimeInDateFormat != "" && endTimeInDateFormat != undefined && endTimeInDateFormat != "undefined")
      this.filterCriteria += ", To=" + endTimeInDateFormat;
    
    if (this.filterCriteria.startsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(1);
      
    if (this.filterCriteria.endsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  downloadReport(type:string)
  {
    let renameArr = {'tierName':'Tier','serverName':'Server','appName':'Instance','urlName':'Business Transaction','queryType':'Query Type',
    'sqlbegintimeStamp':'Start Time', 'sqlQuery':'Query'};
    let colOrder = ['Tier','Server','Instance','Business Transaction','Start Time','Query Type','Query'];      

    this.sqlTimingInfo.forEach((val,index)=>{
      delete val['tierId'];
      delete val['serverId'];
      delete val['appId'];
      delete val['threadId'];
      delete val['mincumsqlexectime'];
      delete val['maxcumsqlexectime'];
      delete val['sqlIndex'];
      delete val['count'];
      delete val['min'];            
      delete val['max'];   
      delete val['avg'];   
      delete val['urlIndex'];   
      delete val['failedcount'];   
      delete val['id'];   
    });

    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'SQLTiming',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArr),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.sqlTimingInfo)
    };

    let downloadFileUrl = decodeURIComponent(this.getHostUrl()+'/'+ this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>(this.openDownloadReports(res)));
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open( decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '') +'/common/' + res);
  }
}

export interface SQLTimingInterface{
  tierName:string;
  serverName:string;
  appName:string;
  urlName:string;
  sqlbegintimeStamp:string;
  sqlexectime:string;
  sqlQuery:string;
  queryType:string;
}
