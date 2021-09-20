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
  selector: 'app-sql-by-execution-time',
  templateUrl: './sql-by-execution-time.component.html',
  styleUrls: ['./sql-by-execution-time.component.css']
})
export class SqlByExecutionTimeComponent implements OnInit {

  queryInfo:Array<SQLInterface>;
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
  strTitle:string;
  filterCriteria:string="";
  showDownloadOption:boolean=true;
  dynamicWidthColumn: number;   // To calculate dynamic width of column

  constructor(private _navService: CavTopPanelNavigationService,private breadcrumbService: DdrBreadcrumbService,
    private _cavConfigService: CavConfigService, private commonService: CommonServices,private _router: Router,
    private ddrRequest:DDRRequestService, private _ddrData:DdrDataModelService){}

  ngOnInit() {
    this.loading = true;
    //this.urlParam = this.commonService.getData();
    let queryParams1=location.href.substring(location.href.indexOf('?')+1,location.href.length);
    this.urlParam =JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    console.log("this.urlParam *** " , this.urlParam);
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SQL_EXECUTION_TIME);
    this.makeColumns();
    this.getData();
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
      this.strTitle = 'Netstorm - SQL Report By Query Execution Time - Test Run : ' + this.urlParam.testRun;
    else 
      this.strTitle = 'Netdiagnostics Enterprise - SQL Report By Query Execution Time - Session : ' + this.urlParam.testRun;   
  }

  makeColumns()
  {
    this.cols = [{ field: 'sqlQuery', header: 'DB Request', sortable: true, action: true, align:'left'}, 
      { field: 'count', header: 'Query Count', sortable: true, action: true, align:'right'},
      { field: 'min', header: 'Min(ms)', sortable: true, action: true, align:'right'},
      { field: 'max', header: 'Max(ms)', sortable: true, action: true, align:'right'},
      { field: 'avg', header: 'Average(ms)', sortable: true, action: true, align:'right'},
      { field: 'variance', header: 'VMR', sortable: true, action: true, align:'right'},
    ];

    this.visibleCols = ['sqlQuery','count','min','max','avg','variance'];

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
     // return parseFloat(a.index) - parseFloat(b.index);
    //});
    let n = this.visibleCols.length;
    this.dynamicWidthColumn = Number(1300 / n);
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;
  }

  getData()
  {
    console.log(" *** get Data from Query *** ");
    let url = '';
    if(this.commonService.enableQueryCaching == 1){
      url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathquery?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
    }
    else{
      url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathquery?testRun=' + this.urlParam.testRun;
    }
    url += '&strStartTime=' + this.urlParam.startTime + '&strEndTime=' + this.urlParam.endTime + '&tierId='+ this.urlParam.tierId + '&serverId='
    + this.urlParam.serverId + '&appId=' + this.urlParam.appId + '&queryTimeMode=' + this.urlParam.queryTimeMode + '&queryTime='
    + this.urlParam.queryTime + '&strGroupBy=' + this.urlParam.strGroup + '&limit=' + this.limit + '&offset=' + this.offset;
    
    console.log(" final url = " , url);
    return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignValues(data)));
  }

  doAssignValues(res:any)
  {
    console.log(" res = " , res);
    this.loading = false;
    this.queryInfo = res.data;
    this.totalCount = res.totalCount;
    if(this.limit > this.totalCount) {
      this.limit = Number(this.totalCount);
    }
    if(this.queryInfo.length == 0)
      this.showDownloadOption = false;
    else
      this.showDownloadOption = true;
    this.showFilterCriteria(res.startTime,res.endTime);
    console.log("queryInfo = " , this.queryInfo , " , totalCount = " , this.totalCount);
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
    this.getData();
  }

  openSQLTimingReport(nodeInfo:any)
  {
    let params = {'sqlIndex':nodeInfo.sqlindex,'queryTime':this.urlParam.queryTime,'queryTimeMode':this.urlParam.queryTimeMode,'startTime':
    this.urlParam.startTime,'endTime':this.urlParam.endTime,'product':this.urlParam.product,'tierName':this.urlParam.tierName,'serverName':
    this.urlParam.serverName,'appName':this.urlParam.appName,'testRun':this.urlParam.testRun};
    console.log("params = " , params);
    this.commonService.sqlTimingData = params;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SQL_EXECUTION_TIME;
    this._router.navigate(['/home/ED-ddr/sqlTiming']);
  }

  downloadReport(type:string)
  {
    let renameArr = {'sqlQuery':'DB Request','count':'Query Count','min':'Min','max':'Max','avg':'Average','variance':'Variance'};
    let colOrder = ['DB Request','Query Count','Min','Max','Average','Variance'];      

    this.queryInfo.forEach((val,index)=>{
      delete val['sqlIndex'];
      delete val['mincumsqlexectime'];
      delete val['maxcumsqlexectime'];
      delete val['tierName'];
      delete val['serverName'];
      delete val['appName'];
      delete val['urlName'];
      delete val['urlIndex'];
    });

    //console.log("query Info for download = " , this.queryInfo);

    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'SQLExecutionTime',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArr),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.queryInfo)
    };

    let downloadFileUrl = '//' + decodeURIComponent(this.getHostUrl()+'/'+ this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>(this.openDownloadReports(res)));
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open( decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '') +'/common/' + res);
  }
}

export interface SQLInterface{
  sqlQuery:string;
  count:string;
  min:string;
  max:string;
  avg:string;
  variance:string;
}
