import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'primeng/api';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { SelectItem } from '../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
// import { ChartModule } from 'angular2-highcharts';
import { MessageService } from '../../services/ddr-message.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-flowpath-group-by',
  templateUrl: './flowpath-group-by.component.html',
  styleUrls: ['./flowpath-group-by.component.css']
})
export class FlowpathGroupByComponent implements OnInit {
  highcharts = Highcharts;
  loading = false;
  flowpathData: Array<FlowpathDataInterface>;
  ajaxLoader = true;
  loader: boolean = false;
  urlParam: any;
  value: number = 1;//progressbar
  paginationFlag:boolean=true;
  showHeaderForGrpByBT:boolean=false;
  headerInfo = '';
  reportHeader:string;
  trStartTime: any;
  trEndTime: any;
  strTime: string;
  endTime: string;
  showDownLoadReportIcon = true;
  fpTotalCount: any;
  paginatorArr:Number[];
  fpLimit = 50;
  fpOffset = 0;
  strTitle: any;
  screenHeight: any;
  cols :any; 
  isFilterFromSideBar:boolean = false ;
  urlAjaxParam : any ;
  urlAjaxParamObject : any ;
  CompleteURL:string;
  URLstr: string;
  chartOptions: Object;
  barData: any;
  fpDataBackup: any;
  showAllOption: boolean = false;
  showBarChart:boolean = false ;

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
  
  downloadHeaderInfo = '' ;
  prevColumn;
  visibleCols: any[];
  columnOptions: SelectItem[];
  dynamicWidthColumn : number ;   // To calculate dynamic width of column
  isEnabledColumnFilter : boolean= false ;
  toggleFilterTitle : string = 'Show Column Filters' ;
  ajaxUrl : string = '' ;
  showPagination: boolean = false;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  msgs: Message[] = [];
  breadcrumb: BreadcrumbService;

  private sideBarFlowpathGroupBy: Subscription;  
  ngOnInit() {
    this.commonService.currentReport = "FlowpathGroupBy" ;
    this.commonService.isToLoadSideBar = true ;

    this.loading = true;
	  this.screenHeight = Number(this.commonService.screenHeight)-130;   
    // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FLOWPATHGROUPBY);
    this.breadcrumb.add({label: 'Flowpaths Group By BT', routerLink: '/ddr/Flowpathgroupby'});
    this.commonService.enableQueryCaching = this._ddrData.enableQueryCaching;
    this.urlParam = this.commonService.getData();
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    //this.reportHeader = 'FlowPath Group By Business Transaction- ' + this.urlParam.testRun;
    this.sideBarFlowpathGroupBy = this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if(this.commonService.currentReport == "FlowpathGroupBy")
      {   
     // console.log('temp============',temp);
      this.isFilterFromSideBar = true ;
      this.commonService.isFilterFromSideBar = true ;
	  this.fpLimit = 50;
      let keys = Object.keys(temp);
      this.loading = true;
      this.fillData();
      }
      this._ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessage(mssg)});
      }); 
    this.fillData();
    
}
  
  constructor(public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
    private messageService: MessageService,
    private ddrRequest:DDRRequestService, breadcrumb: BreadcrumbService ) {
      this.breadcrumb = breadcrumb;
  }
    fillData()
    {
       try {
	this.randomNumber();
      // getting table data from server
      this.getFlowpathData();
      this.getFlowpathDataCount();
      this.createDynamicColumn();
      this.setTestRunInHeader();

       }
    catch(error){
        console.log('error in intialization compaonent --> ', error);
    }

    }
    createDynamicColumn() {
      this.visibleCols = ['fpCount'];
      this.columnOptions = [{ label: 'Flowpath Count', value: 'fpCount' }];
      let fpParam = this.commonService.fpGroupByFilters;
      this.cols = [
        { field: 'tierName', header: 'Tier', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'urlName', header: 'Business Transaction', sortable: true, action: false, align: 'left', width: '100' },
        //{ field: 'flowpathSignature', header: 'Flowpath Signature', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'btCatagory', header: 'BT Category', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'page', header: 'Page', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'session', header: 'Session', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'transaction', header: 'Transaction', sortable: true, action: false, align: 'left', width: '100' },
        { field: 'fpCount', header: 'Flowpath Count', sortable: 'custom', action: true, align: 'right', width: '100' }];
      for (let value of this.cols) {

        if (fpParam['strGroup'].indexOf('url') != -1 && value['field'] == 'urlName') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Business Transaction', value: 'urlName' });
          this.visibleCols.push("urlName");
        }

        if (fpParam['strGroup'].indexOf('tier') != -1 && value['field'] == 'tierName') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Tier', value: 'tierName' });
          this.visibleCols.push("tierName");
        }
        if (fpParam['strGroup'].indexOf('server') != -1 && value['field'] == 'serverName') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Server', value: 'serverName' });
          this.visibleCols.push("serverName");
        }
        if (fpParam['strGroup'].indexOf('app') != -1 && value['field'] == 'appName') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Instance', value: 'appName' });
          this.visibleCols.push("appName");
        }
        /*  if(fpParam['strGroup'].indexOf('flowpathsignature') != -1 && value['field'] == 'flowpathSignature'){
            value['action'] = true ;
          } */

        if (fpParam['strGroup'].indexOf('btcategory') != -1 && value['field'] == 'btCatagory') {
          value['action'] = true;
          this.columnOptions.push({ label: 'BT Category', value: 'btCatagory' });
          this.visibleCols.push("btCatagory");
        }
        if (fpParam['strGroup'].indexOf('page') != -1 && value['field'] == 'page') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Page', value: 'page' });
          this.visibleCols.push("page");
        }

        if (fpParam['strGroup'].indexOf('session') != -1 && value['field'] == 'session') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Session', value: 'session' });
          this.visibleCols.push("session");
        }

        if (fpParam['strGroup'].indexOf('transaction') != -1 && value['field'] == 'transaction') {
          value['action'] = true;
          this.columnOptions.push({ label: 'Transaction', value: 'transaction' });
          this.visibleCols.push("transaction");
        }
      }
      let n = this.visibleCols.length ;
      this.dynamicWidthColumn = Number(1180/n) ;
      this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
    }
    getFlowpathData(){
      let url = '';
      let finalUrl = '';
      this.ajaxUrl = '' ;
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      //   url = this._ddrData.protocol + "://" + this.getHostUrl();
      // else
        url = this.getHostUrl()

 if(this.commonService.enableQueryCaching == 1) {
   url += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun ;
 }    
else{
  url += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' + this.urlParam.testRun ;
}
      if (this.commonService.isFilterFromSideBar && Object.keys(this.commonService.fpGroupByFilters).length != 0 ) // sidebar filters to flowpath  groupby
      {
      let fpParam = this.commonService.fpGroupByFilters;
      if(this.commonService.isValidParamInObj(fpParam ,'ndeProtocol' ) && this.commonService.isValidParamInObj(fpParam ,'pubicIP' ) && this.commonService.isValidParamInObj(fpParam ,'publicPort' )  && this.commonService.isValidParamInObj(fpParam ,'ndeTestRun' ) )
      { 
if(this.commonService.enableQueryCaching == 1){
  url =  fpParam['ndeProtocol'] + "://" +  fpParam['pubicIP'] + ":" + fpParam['publicPort'] + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?cacheId='+ fpParam['ndeTestRun'] + '&testRun=' + fpParam['ndeTestRun'] ;
}
else {
  url =  fpParam['ndeProtocol'] + "://" +  fpParam['pubicIP'] + ":" + fpParam['publicPort'] + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' + fpParam['ndeTestRun'] ;
}

// this.commonHostUrl = fpParam['ndeProtocol'] + "://" +  fpParam['pubicIP'] + ":" + fpParam['publicPort'] ;
console.log("this.url--",url);
// console.log("this.commonHostUrl--",this.commonHostUrl);

// this.commonTestRun = fpParam['ndeTestRun'] ;
}
      
        console.log(" COMPONENT - Flowpath group by, METHOD -  getFlowpathData, fpGroupByFilters got here",  fpParam);
        this.urlAjaxParam = this.commonService.makeParamStringFromObj(fpParam);
        console.log(" COMPONENT - Flowpath group by, METHOD -  getFlowpathData, After making url from fpGroupByFilters= "+ this.urlAjaxParam);
      }
      else
      {
         this.urlAjaxParam = 
          '&flowPathInstance=' + this.urlParam.flowPathInstance +
          '&tierName=' + this.urlParam.tierName +
          '&serverName=' + this.urlParam.serverName +
          '&appName=' + this.urlParam.appName +
          '&tierId=' + this.urlParam.tierid +
          '&serverId=' + this.urlParam.serverid +
          '&appId=' + this.urlParam.appid +
          '&urlName=' + this.urlParam.urlName +
          '&strStartTime=' + this.trStartTime +
          '&strEndTime=' + this.trEndTime+
          '&statusCode=-2'+
         '&btCategory=All' + '&strGroup=url' + '&strOrder=url' + "&groupByFC=BT" ;
         
         this.urlAjaxParamObject = this.commonService.makeObjectFromUrlParam(this.urlAjaxParam);
         this.commonService.fpGroupByFilters = this.urlAjaxParamObject;
         setTimeout(() => {
          this.messageService.sendMessage(this.commonService.fpGroupByFilters);
        }, 2000);
         console.log("this.commonService.fpGroupByFilters---", JSON.stringify(this.commonService.fpGroupByFilters));
  
      }
         finalUrl += url+ this.urlAjaxParam  + '&limit=' + this.fpLimit + '&offset=' + this.fpOffset + '&showCount=false&shellForNDFilters=1' + '&queryId='+this.queryId;
          this._ddrData.urlFlag = false;

          this.ajaxUrl = url+ this.urlAjaxParam
      console.log('finalUrl------>', finalUrl);

      setTimeout(() => {
        this.openpopup();
      }, this._ddrData.guiCancelationTimeOut);
      // making get type request to get data
      this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => (this.assignFlowpathData(data)));
    } catch (error) {
      console.log('error in getting data from rest call', error);
    }
      
    assignFlowpathData(res: any) {
      this.commonService.isFilterFromSideBar = false ;
      this.loading = false;
      this.isCancelQuerydata =true;
    try {
      if (res === null || res === undefined) {
        return;
      }
      setTimeout(() => {
        this.loader = false;
      }, 2000);
      this.value = 1;
      
      this.ajaxLoader = false;
      this.commonService.fpGroupByFilters['startTimeInDateFormat'] =res.strStartTime ;
      this.commonService.fpGroupByFilters['endTimeInDateFormat'] =res.strEndTime ;
      this.showHeaderInfo();
      let fpResponseTimeArr = [];
      // updating data in component variable
      this.flowpathData = res.data;
     
      this.flowpathData.forEach((val,index) =>
      {
       val.btCatagory= this.commonService.getBTCategoryName(val.btCatagory);
      });

      this.fpDataBackup = this.flowpathData ;
     // console.log(" res.data--"+  JSON.stringify(res.data) );
      // this.fpTotalCount = res.totalCount;

      if (this.flowpathData.length === 0) {
        this.showDownLoadReportIcon = false;
      }
      else
      this.showDownLoadReportIcon = true;
    this.flowpathData.forEach((val, index) => {
        val.fpCount = this.formatter(val.fpCount);
          });
    
          this.createChart(this.flowpathData);
    }catch (error) {
    console.log(error);
  }
}
    formatter(data: any) {
      if(Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
      } else {
      return data;
      }
      }

  
   
    getFlowpathDataCount(){
      try {
     //  let  url = '//' + this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?' ;
      let finalUrl = '';
  
      finalUrl = this.ajaxUrl + '&limit=' + this.fpLimit + '&offset=' + this.fpOffset + '&showCount=true&shellForNDFilters=1';
      console.log('finalUrl count--------->', finalUrl);
      // making get type request to get data count
      this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => (this.assignFlowpathDataCount(data)));
    } catch (error) {
      console.log('error in getting data from rest call', error);
    }
  }

    assignFlowpathDataCount(res:any) {
    this.fpTotalCount = res.totalCount;
    if(this.fpTotalCount > 50){ //If data is less then 50 then no pagination .
      this.showPagination =true;
    } else{
      this.showPagination =false;
    }
    this.paginatorArr = this.dynamicPaginator(res.totalCount);
    if(this.fpLimit > this.fpTotalCount)
      this.fpLimit = Number(this.fpTotalCount);
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
      this.dynamicWidthColumn = Number(1180 / n);
      this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)) - 2;
    }

 toggleColumnFilter() {
    // if (this.isEnabledColumnFilter) {
    //   this.isEnabledColumnFilter= false;
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
  dynamicPaginator(length:any)
 {
   let paginatorArr = [];
 
   if(length == 0)
    this.fpLimit = 0;

  if (length >= 0 && length <= 100)
       {
     if(length<=10)
          paginatorArr=[10];
     
	   else if(length<=20) 
          paginatorArr=[10,20];  
     
	   else if(length<=30) 
          paginatorArr=[10,20,30]; 
     
	   else if(length<=50)
          paginatorArr=[10,20,30,50]; 
       
	   else if(length<=100) 
          paginatorArr=[10,30,50,100];
     }
  
  else if  (length>100 && length<=400)
  {
     if(length<=200)
          paginatorArr=[10,50,100,200];
     
         
	   else if(length<=300)
          paginatorArr=[10,50,100,200,300];
      
         
	   else if(length<=400)
          paginatorArr=[10,50,100,200,400]; 
        
  }  
 return paginatorArr;
}

    /**used to open Flowpath Report from Flowpath by BT report */
    openFlowPathCount(rowData: any) {
    console.log('rowData-----------', rowData)
    this._ddrData.fpByBTFlag = true;
    this._ddrData.dbTofpflag = false;
    this.commonService.fpByBTData = rowData;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATHGROUPBY;

      if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
        this._router.navigate(['/home/ddrCopyLink/flowpath']);
      else
        this._router.navigate(['/ddr/flowpath']);
  }  

       /*Method is used get host url*/

    getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if( !isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    {
     // hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      this.urlParam.testRun=this._ddrData.testRun;
      console.log("all case url==>",hostDcName,"all case test run==>",this.urlParam.testRun);
    }
    //  else if (this._navService.getDCNameForScreen("flowpath") === undefined)
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

  paginate(event) {
    this.fpOffset = parseInt(event.first);
    this.fpLimit = parseInt(event.rows);
    if(this.fpLimit > this.fpTotalCount) {
      this.fpLimit = Number(this.fpTotalCount);
    }
    if((this.fpLimit + this.fpOffset) > this.fpTotalCount) {
      this.fpLimit = Number(this.fpTotalCount) - Number(this.fpOffset);
    }
    this.commonService.isFilterFromSideBar = true ;
    this.loader = true;
    this.commonService.isFilterFromSideBar = true ;
    this.getProgressBar();
    this.getFlowpathData();
  }

  createChart(res: any) {
    console.log("res in chart--", res);

    let fpParam = this.commonService.fpGroupByFilters;
    let dataFP = [];
    let dataCategories = [];
    let groupChart = '';
    if (res.length == 0) 
      this.showBarChart = false;
    else 
      this.showBarChart = true;

    this.barData = res;
    for (var i = 0; i < this.barData.length; i++) {
      groupChart = ''

      if (fpParam['strGroup'].indexOf('url') != -1)
        groupChart = this.barData[i]["urlName"] + ",";

      if (fpParam['strGroup'].indexOf('tier') != -1) {
        groupChart += this.barData[i]["tierName"] + ",";
      }
      if (fpParam['strGroup'].indexOf('server') != -1) {
        groupChart += this.barData[i]["serverName"] + ",";
      }
      if (fpParam['strGroup'].indexOf('app') != -1) {
        groupChart += this.barData[i]["appName"] + ",";
      }
      if (fpParam['strGroup'].indexOf('btcategory') != -1) {
        groupChart += this.barData[i]["btCatagory"] + ",";
      }
      if (fpParam['strGroup'].indexOf('page') != -1)
        groupChart += this.barData[i]["page"] + ",";

      if (fpParam['strGroup'].indexOf('session') != -1)
        groupChart += this.barData[i]["session"] + ",";

      if (fpParam['strGroup'].indexOf('transaction') != -1)
        groupChart += this.barData[i]["transaction"];

      if (groupChart.endsWith(','))
        groupChart = groupChart.substring(0, groupChart.length - 1);

      let count = res[i]["fpCount"];
      count = count.replace(/\,/g, '');
      dataCategories.push(groupChart);
      dataFP.push({ "name": groupChart, "y": Number(count) });

    }

    this.chartOptions = {
      chart: {
        type: 'column',
        width: 1310
      },
      title: {
        text: 'Grouped Flowpath Counts'
      },

      xAxis: {
        categories: dataCategories
      },
      yAxis: {
        min: 0,
        title: {
          text: ""
        }
      },
      legend: {
        title: {
          style: {
            fontStyle: 'italic'
          }
        }

      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0"></td></tr> '  +
        '<tr><td style="padding:0">{series.nae}:<b>{point.y} </b></td></tr>',

      },
	  credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        events: {
          click: function (event) {
            this.clickHandler(event);
          }.bind(this)
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: " Count",
          data: dataFP,
          enableMouseTracking: true,
          colorByPoint: true,
        }

      ]
    };

  }
  clickHandler(event) {
    console.log("event --", event);
    this.showAllOption = true;
    let filteredData = [];
    for (let k = 0; k < this.barData.length; k++) {
      let count = this.barData[k]['fpCount'].toString();

      count = count.replace(/\,/g, '');
      if (event.point.y == count) {
        filteredData.push(this.barData[k]);
        break;
      }
    }
    this.flowpathData = filteredData;
  }

  showAllData() {
    this.showAllOption = false;
    this.flowpathData = this.fpDataBackup;
  }
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

  sortColumnsOnCustom(event) {
    //for integer type data type

    if (event["field"] === "fpCount") {
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      event.data = event.data.sort(function (a, b) {
        var value = Number(a[temp].replace(/,/g, ''));
        var value2 = Number(b[temp].replace(/,/g, ''));
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      event.data = event.data.sort(function (a, b) {
        var value = Number(a[temp].replace(/,/g, ''));
        var value2 = Number(b[temp].replace(/,/g, ''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
  }else{
    var temp = (event["field"]);
    if (event.order == -1) {
     event.data = event.data.sort(function (a, b) {
      var value = a[temp];
      var value2 = b[temp];
        return value.localeCompare(value2);
      });
    }else{
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

  showHeaderInfo() {
    let fpGroupByFilters = this.commonService.fpGroupByFilters;
    this.headerInfo = "" ;
    this.downloadHeaderInfo = '' ;
    
    this.filterTierName = '';
    this.filterServerName = '';
    this.filterInstanceName = '';
    this.filterGroupByStr = '' ;
    this.filterOrderByStr = ''; 
    this.completeTier = '';
    this.completeServer = '';
    this.completeInstance = '';
    this.completeGroupBy = '';
    this.completeOrderBy = '' ;
    if(sessionStorage.getItem("isMultiDCMode") == "true")
    {
      let dcName = this._cavConfigService.getActiveDC();
      if(dcName == "ALL")
        dcName = this._ddrData.dcName;
       this.filterTierName = 'DC=' + dcName + ', ';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "tierName")) {
      if (fpGroupByFilters['tierName'].length > 32) {
        this.filterTierName += 'Tier=' + fpGroupByFilters['tierName'].substring(0, 32) + '..' + ' ,';
        this.completeTier = fpGroupByFilters['tierName'];
      } else
        this.filterTierName += 'Tier=' + fpGroupByFilters['tierName'] + ' ,';

      this.downloadHeaderInfo += 'Tier=' + fpGroupByFilters['tierName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "serverName")) {
      if (fpGroupByFilters['serverName'].length > 32) {
        this.filterServerName = 'Server=' + fpGroupByFilters['serverName'].substring(0, 32) + '..' + ' ,';
        this.completeServer = fpGroupByFilters['serverName'];
      } else
        this.filterServerName = 'Server=' + fpGroupByFilters['serverName'] + ' ,';

      this.downloadHeaderInfo += 'Server=' + fpGroupByFilters['serverName'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "appName")) {
      if (fpGroupByFilters['appName'].length > 32) {
        this.filterInstanceName = ', Instance=' + fpGroupByFilters['appName'].substring(0, 32) + '..' + ' ,';
        this.completeInstance = fpGroupByFilters['appName'];
      } else
        this.filterInstanceName = 'Instance=' + fpGroupByFilters['appName'] + ' ,';

      this.downloadHeaderInfo += 'Instance=' + fpGroupByFilters['appName'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "groupByFC")) {
      if (fpGroupByFilters['groupByFC'].length > 32) {
        this.filterGroupByStr = 'Group By=' + fpGroupByFilters['groupByFC'].substring(0, 32) + '..' + ' ,';
        this.completeGroupBy = fpGroupByFilters['groupByFC'];
      }
      else
        this.filterGroupByStr = 'Group By=' + fpGroupByFilters['groupByFC'] + ' ,';

      this.downloadHeaderInfo += 'Group By=' + fpGroupByFilters['groupByFC'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "orderByFC")) {
      if (fpGroupByFilters['orderByFC'].length > 32) {
        this.filterOrderByStr = 'Order By=' + fpGroupByFilters['orderByFC'].substring(0, 32) + '..' + ' ,';
        this.completeOrderBy = fpGroupByFilters['orderByFC'];
      }
      else
        this.filterOrderByStr = 'Order By=' + fpGroupByFilters['orderByFC'] + ' ,';

      this.downloadHeaderInfo += 'Order By=' + fpGroupByFilters['orderByFC'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "startTimeInDateFormat")) {
      this.headerInfo += 'StartTime=' + fpGroupByFilters['startTimeInDateFormat'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "endTimeInDateFormat")) {
      this.headerInfo += 'EndTime=' + fpGroupByFilters['endTimeInDateFormat'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "btCategory"))
      this.headerInfo += 'BT Type=' + this.commonService.getBTCategoryName(fpGroupByFilters['btCategory']) + ' ,';

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "urlName")) {
      this.headerInfo += 'BT=' + decodeURIComponent((fpGroupByFilters['urlName']).toString()) + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "url")) {
      let val = fpGroupByFilters['url'];
      if (val.length > 40) {
        this.URLstr = 'URL=' + val.substring(0, 40) + ".." + ' ,';
        this.CompleteURL = val;
      }
      else {
        this.URLstr = 'URL=' + val + ' ,';
        this.CompleteURL = val;
      }
      this.downloadHeaderInfo += 'URL=' + fpGroupByFilters['url'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "statusCodeFC")) {
      this.headerInfo += 'Status =' + fpGroupByFilters['statusCodeFC'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "page")) {
      this.headerInfo += 'Page=' + fpGroupByFilters['page'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "script")) {
      this.headerInfo += 'Script=' + fpGroupByFilters['script'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "transaction")) {
      this.headerInfo += 'Transaction=' + fpGroupByFilters['transaction'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "browser")) {
      this.headerInfo += 'Browser=' + fpGroupByFilters['browser'] + ' ,';
    }

    if (this.commonService.isValidParamInObj(fpGroupByFilters, "access")) {
      this.headerInfo += 'Access=' + fpGroupByFilters['access'] + ' ,';
    }
    if (this.commonService.isValidParamInObj(fpGroupByFilters, "location")) {
      this.headerInfo += 'Location=' + fpGroupByFilters['location'] + ' ,';
    }
    console.log('headerinfo', this.headerInfo);
    if (this.headerInfo.startsWith(',')) {
      this.headerInfo = this.headerInfo.substring(1);
    }
    if (this.headerInfo.endsWith(',')) {
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    }

    this.downloadHeaderInfo += this.headerInfo;
  }

  setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - Flowpath Group By Business Transaction- Test Run : ' + this.urlParam.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - Flowpath Group By Business Transaction- Session : ' + this.urlParam.testRun;
    }
  }

    downloadReports(reports: string) {
    let renameArray= {};
    let colOrder = [];
    let fpParam = this.commonService.fpGroupByFilters;
       // console.log("flowpathData=========== ", JSON.stringify(this.flowpathData));
    renameArray = { 'urlName': 'Business Transaction', 'fpCount': 'Flowpath Count', 'tierName': 'Tier', 'serverName': 'Server', 'appName': 'Instance', 'btCatagory': 'BT Category', 'page': 'Page', 'session': 'Session', 'transaction': 'Transaction' }


    if (fpParam['strGroup'].indexOf('url') != -1)
      colOrder.push('Business Transaction');

    if (fpParam['strGroup'].indexOf('tier') != -1) {
      colOrder.push('Tier');
    }
    if (fpParam['strGroup'].indexOf('server') != -1) {
      colOrder.push('Server');
    }
    if (fpParam['strGroup'].indexOf('app') != -1) {
      colOrder.push('Instance');
    }
    if (fpParam['strGroup'].indexOf('btcategory') != -1) {
      colOrder.push('BT Category');
    }
    if (fpParam['strGroup'].indexOf('page') != -1)
      colOrder.push('Page');

    if (fpParam['strGroup'].indexOf('session') != -1)
      colOrder.push('Session');

    if (fpParam['strGroup'].indexOf('transaction') != -1)
      colOrder.push('Transaction');

    colOrder.push('Flowpath Count');

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
        delete val['tierId'];
        delete val['serverId'];
        delete val['appId'];
          delete val["backendMaxDur"];
      
       });
             

   let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.downloadHeaderInfo,
      strSrcFileName: 'FlowpathReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.flowpathData)
    };
    let downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product) +
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
    window.open( decodeURIComponent(this.getHostUrl(true) + '/' +
     this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '') +
      '/common/' + res);
  }
  ngOnDestroy()
  {
    console.log("on destroy case---flowpath group by--");
      this.sideBarFlowpathGroupBy.unsubscribe();
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
    }, this._ddrData.guiCancelationTimeOut);
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

    showMessage(mssg: any) {
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
  fpCount: string;
  methodsCount: string;
  urlQueryParamStr: string;
  statusCode: string;
  threadId: string;
  btCatagory: string;
  startTimeInMs: string;
  id: number;
  totalError: string;
  nvSessionId: string;
  ndSessionId: string;
  nvPageId: string;
  threadName: string;
}
