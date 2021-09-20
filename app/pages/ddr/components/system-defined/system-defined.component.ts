
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, Output, Input, EventEmitter } from '@angular/core';
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
import { Subscription } from 'rxjs/Subscription';
import { TimerService } from '../../../../main/services/timer.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Message } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { MessageService } from '../../services/ddr-message.service';
import { DDRRequestService } from '../../services/ddr-request.service';
//import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-system-defined',
  templateUrl: './system-defined.component.html',
  styleUrls: ['./system-defined.component.css']
})
export class SystemDefinedComponent implements OnInit {

  sysDefQueryData: SysDefQueryInterface[];
  loading: boolean;
  id: any;
  cols: any;
  screenHeight:any;
  userStored:any;
  queryNameList=[];
  savedQueriesData=[];
  savedQueriesObject: any=[];
  selectedRowInfo: Array<userDefinedInterface>=[];
  userCols=[]; 
  cqmFilter: any={};
  message: Message[] = [];
  constructor(public commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router,
    private _cavConfig: CavConfigService,
    private flowmapDataService: DdrTxnFlowmapDataService,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private _timerService: TimerService,
    private messageService: MessageService,
    private ddrRequest: DDRRequestService,
    private router: Router,
    private confirmationService: ConfirmationService
   ) { }

  ngOnInit() {
    // Disabling side bar 

    this.commonService.isToLoadSideBar = false;
    this.createColumns();
    this.screenHeight = Number(this.commonService.screenHeight) - 130;
    this._navService.addNewNaviationLink("ddr");
    this.id = this.commonService.getData();
    this.getDbImportCheck(this.id['testRun'] || sessionStorage.getItem("testRun")).then(()=>{

    this._ddrData.vectorName=undefined;
    this._ddrData.generatorName=undefined;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SYSTEM_DEFINED_QUERIES);
    let product = sessionStorage.getItem('productType');
      if(product)
        product= product.toLowerCase();

 let url = this._ddrData.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/getSystemDefinedQueries?testRun=' + (this.id['testRun'] || sessionStorage.getItem("testRun"));

 console.log("url:"+url);    


this.loading = true;
    this.ddrRequest.getDataUsingGet(url).subscribe(data => {
      this.getSystemQueryData(data);
    },
      error => {
        this.loading = false;
      });
    console.log("checkkkk time flag++++++++++  ",this.commonService.nsTimeFlag);
    if(this.commonService.nsTimeFlag == true) {
             if (product.toLowerCase() == 'netstorm') {
                  product= "NS";
             } else if (product.toLowerCase() == 'netvision') {
                  product= "NV";
             } else if (product.toLowerCase() == 'netocean') {
                 product= "NO";
             } else if (product.toLowerCase() == 'netfunction') {
                  product= "NF";
             } else if (product.toLowerCase() ==  'netcloud') {
                  product= "NC";
             }
             else {
                 product= "netdiagnostics";
             }
          let timeFilterUrl = '';
          timeFilterUrl = this.getHostUrl() + '/DashboardServer/web/commons/getDDRGraphTime?testRun=' + this._ddrData.testRun + "&productName=" + product + "&productKey=" + this._cavConfig.$productKey;
     // let timeFilterUrl = "//" + this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=' + this._ddrData.testRun + "&graphTimeKey=240"
      this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => {
       this.getnsTimeDate(data);
     },
     error => {
       this.loading = false;
     });
     }
     this.getUserDefinedQueries();

  });

}
  getUserDefinedQueries() {
    let product = sessionStorage.getItem('productType');
    if (product)
      product = product.toLowerCase();

    let url = this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/UserDefinedQueries?testRun=' +  (this.id['testRun'] || this._ddrData.testRun || sessionStorage.getItem("testRun"))+ "&saveQuery=undefined&showQuery=true&deleteQuery=undefined"
    this.ddrRequest.getDataUsingGet(url).subscribe(rest => {
    this.savedQueriesData = rest['data'];
      this.queryNameList = rest['queryName'];
      this._ddrData.savedQueryName = rest['queryName'];
    });
    console.log("show user defined query has been called");
  }

  getnsTimeDate(res) {

let graphTimeKey = res.graphTimeKey;
if(!graphTimeKey.startsWith("Whole")){
this._ddrData.startTime = res.ddrStartTime
this._ddrData.endTime = res.ddrEndTime
}
else{
this._ddrData.startTime = undefined;
this._ddrData.endTime = undefined;
}
    this.commonService.nsTimeFlag = false;
  }

  getSystemQueryData(res) {
    let data: any;
    data = res;
    console.log(data);
    this.sysDefQueryData = data.systemDefinedQueryList;
    console.log(this.sysDefQueryData);
  }



  // Regarding to check for tables exists in database for particular testrun or not and if not present then import.
  getDbImportCheck(testRun?) { 
    this.loading = true;
    return new Promise((resolve, reject) => {
    let product = sessionStorage.getItem('productType');
    if (!testRun)
      testRun = this._ddrData.testRun;
    if (product) {
      let url = decodeURIComponent(this.getHostUrl() + '/' + product.toLowerCase()) + "/v1/cavisson/netdiagnostics/webddr/getDbImportCheck?TestRun="+ testRun;
      this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
        console.log("getDbImportCheck>>>>>O/p====>>>",data);
          resolve();
      },
        error =>{    
	     if (error.hasOwnProperty('message')) {
		      console.log("getDbImportCheck>>>>>Error====>>>",error.message);
            }
            resolve();
        });
    }
    else {
      let url = decodeURIComponent(this.getHostUrl() + '/netdiagnostics') + "/v1/cavisson/netdiagnostics/webddr/getDbImportCheck?TestRun=" + testRun;
      this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
        console.log("getDbImportCheck else>>>>>O/p====>>>",data);
        resolve();
      },
        error =>{
	     if (error.hasOwnProperty('message')) {
        console.log("getDbImportCheck> else>>>>Error====>>>",error.message);
             resolve();
            }
        });
      }
  });
  }


  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    // if (!isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL') {
    //   hostDcName = this._ddrData.host + ':' + this._ddrData.port;
    //   // this.urlParam.testRun=this._ddrData.testRun;
    //   // this.testRun= this._ddrData.testRun;
    //   // console.log("all case url==>",hostDcName,"all case test run==>",this.urlParam.testRun);
    // }
    // else if (this._navService.getDCNameForScreen("flowpath") === undefined)
    //   hostDcName = this._cavConfig.getINSPrefix();
    // else
    //   hostDcName = this._cavConfig.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");

    // if (this._ddrData.protocol)
    //   sessionStorage.setItem("protocol", this._ddrData.protocol);
    // else
    //   sessionStorage.setItem("protocol", location.protocol.replace(":", ""));

    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }


  createColumns() {
    this.cols = [
       
        { field: 'label', header: 'Label', sortable: true, action: true, align: 'left' },
        { field: 'description', header: 'Description', sortable: 'true', action: true, align: 'left' },
        //    { field: 'serverName', header: 'Server', sortable: true, action: false, align: 'left', color: 'black', width: '70' },
        //   { field: 'appName', header: 'Instance', sortable: true, action: false, align: 'left', color: 'black', width: '100' }
    ];
    this.userCols=[
      { field: 'queryName', header: 'Query Name', sortable: true, action: true, align: 'left' },
    { field: 'description', header: 'Description', sortable: 'true', action: true, align: 'left' },
    { field: 'date', header: 'Date Of Modification', sortable: 'custom', action: true, align: 'left' },
    { field: 'user', header: 'User', sortable: 'true', action: true, align: 'left' }]
}

  openReports(node)  {
  // this._ddrData.getDbImportCheck();
    this._ddrData.resetDDRArguments();
    this._ddrData.fromReport = false;
    this._ddrData.errorNameUrl = undefined;
    this._ddrData.errorNameSession = undefined;
    this._ddrData.errorUserSession = undefined;
    this._ddrData.filtermode = "";
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SYSTEM_DEFINED_QUERIES;
    this.breadcrumbService.isFromHome = false;
    console.log("CODE :::::::::::::: " + node.code);
    this.clearNSObject();
    // let code:Number;
    if (node.code == '0') {
      this._ddrData.getWanEnV();
      this.commonService.nsURLSummary = {};
      this._ddrData.setInLogger('DDR::System Defined','Url Summary','Open Url Summary Report');
      this.router.navigate(['/home/ddr/nsreports/urlSummary']);
    }
    if (node.code == '1') {
      //session
      this._ddrData.getWanEnV();
      this.commonService.nsSessionSummary = {};
      this._ddrData.setInLogger('DDR::System Defined','Session Summary','Open Session Summary Report');
      this.router.navigate(['/home/ddr/nsreports/sessionSummary']);
    }
    if (node.code == '2') {
      //transaction
      this._ddrData.getWanEnV();
      console.log("clearing the saved transaction from webdashboard");
      this._ddrData.transactionName = undefined;
      // this.commonService.nsTransactionSummary['transactionName'] = undefined;
      this.commonService.nsTransactionSummary = {};
      this._ddrData.vectorName = undefined
       this._ddrData.setInLogger('DDR::System Defined','Transaction Summary','Open Transaction Summary Report');
      this.router.navigate(['/home/ddr/nsreports/TransactionSummary']);
    }
    if (node.code == '3') {
      //db
      this.commonService.dbFilters={};
      this._ddrData.setInLogger('DDR::System Defined','DB',' Open DB Report');
      this.router.navigate(['/home/ddr/dbReport']);
    }
    if (node.code == '4') {
      //exception
       this.commonService.exceptionFilters={};
      this._ddrData.setInLogger('DDR::System Defined','Exception','Open Exception Report');
      this.router.navigate(['/home/ddr/exception']);
    }
    if (node.code == '5') {
      //page
      this._ddrData.getWanEnV();
      this._ddrData.setInLogger('DDR::SystemDefined','Page Summary','Open Page Summary Report');
      this.commonService.nsPageSummary = {};
      this.router.navigate(['/home/ddr/nsreports/PageSummary']);
    } if (node.code == '6') {
      //service  
      //this.router.navigate(['/home/ddr/service']);  
    }
    if (node.code == '7') {
      //MT
      this.commonService.methodTimingFilters={};
      this._ddrData.setInLogger('DDR::System Defined','Method Timing','Open Method Timing Report');
      this.router.navigate(['/home/ddr/methodtiming']);
    }
    if (node.code == '8') {
      //logs
      //this.router.navigate(['/home/ddr/flowpath']);  
    }
    if (node.code == '9') {
      //flowpath
      this.commonService.fpFilters={};
      // Resetting session while going through the sys-def queries.
      this._ddrData.searchString="";
      this._ddrData.setInLogger('DDR::System Defined','Flowpath','Open FlowPath Report');
      this.router.navigate(['/home/ddr/flowpath']);
    }

  }
  clearNSObject(): any {
   console.log("clearing ns objects======>"); 
  this.commonService.nsTransactionSummary={};
  this.commonService.nsTRansactionSessionSummary={};
  this.commonService.nsTransactionInstance={};
  this.commonService.nsTransactionFailure={};
  this.commonService.nsTransactionDetails={};
  this.commonService.nsPageSummary={};
  this.commonService.nsPageSessionSummary={};
  this.commonService.nsPageInstance={};
  this.commonService.nsPageDetails={};
  this.commonService.nsPageFailure={};
  this.commonService.nsSessionSummary={};
  this.commonService.nsSessionTiming={};
  this.commonService.nsSessionFailure={};
  this.commonService.nsSessionInstance={};
  this.commonService.nsURLSummary={};
  this.commonService.nsURLFailure={};
  this.commonService.nsURLSession={};
  this.commonService.nsURLInstance={};
  this._ddrData.nsCQMFilter={};
  this._ddrData.nsCqmAutoFill={};
  this._ddrData.saveQueryField={};
  }
  /*  resetDDRArguments() {
        this._ddrData.ndSessionId = undefined;
        this._ddrData.nvPageId = undefined;
        this._ddrData.nvSessionId = undefined;
        this._ddrData.urlParam = undefined;
        this._ddrData.flowpathID = undefined;
        this._ddrData.isFromNV = '0'; //nv flag off
       }*/

  runSavedQuery(editable?) {
    this._ddrData.resetDDRArguments();
    console.log("running ", this.selectedRowInfo); //with selection of check box value would be stored here. from queryNameList
   
    let userName = sessionStorage.getItem('sesLoginName');
    if(this.selectedRowInfo.length ==0) {
      window.alert("Please select one row");
      return;
    }
    if (this.selectedRowInfo.length > 1) {
      window.alert("Please Select Only One Query");
      return;
    }
    else if(editable){
        if((this.userStored == userName) ||(userName == "cavisson")) {
            this._ddrData.editQuery=true;
            let msg = 'Editing query for'+ this.commonService.currentReport + ' Report ';
            this._ddrData.setInLogger('DDR::System Defined',this.commonService.currentReport,'CQM_Edit_Query',msg);
            this.savedQueryData();
      }
      else
            window.alert("This user is not allowed to edit");
     }
    else {
        this._ddrData.editQuery=false;
        let msg = 'Runing query for'+ this.commonService.currentReport + ' Report ';
        this._ddrData.setInLogger('DDR::System Defined',this.commonService.currentReport,'CQM_RUN_Query',msg);
        this.savedQueryData();
    }
  }  

  savedQueryData() {
    this.commonService.isFilterFromSideBar = true;
    let node;
    let navigateTo = '';
    this.selectedRowInfo[0]['id'];
    let id = this.selectedRowInfo[0]['id']; //id to be matched with the show query data  data in this.savedQueriesData
    let queryName = this.selectedRowInfo[0]['queryName'];
    let reportName = this.selectedRowInfo[0]['report'];
    let description = this.selectedRowInfo[0]['description'];
    this._ddrData.saveQueryField={'queryName':queryName,'description':description};
    this.savedQueriesData[id];
    console.log("this.savedQueriesData[keys[id]]; ****** ", this.selectedRowInfo[0]['report']);
    this.commonService.currentReport=reportName;
    let product = sessionStorage.getItem('productType');
    if (product) 
      product = product.toLowerCase();
      //if ()
    let url =  this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/UserDefinedQueries?testRun=' + (this.id['testRun'] || this._ddrData.testRun || sessionStorage.getItem("testRun")) + "&saveQuery=undefined&showQuery=undefined&deleteQuery=undefined&showQueryData=true" + "&queryName=" + queryName;
    this.ddrRequest.getDataUsingGet(url).subscribe(rest => {
    // this.savedQueriesData = rest['data'];
    //   this.queryNameList = rest['queryName'];
    //   this._ddrData.savedQueryName = rest['queryName'];
    this.cqmFilter = JSON.parse(rest['data']);
    this._ddrData.nsCqmAutoFill[reportName] = JSON.parse(rest['autoFill']);
    //  this.commonService.nsAutoFillSideBar(reportName);
    this.commonService.isFilterFromNSSideBar = true;
    this.commonService.sideBarUI$.next("running saved query");
    navigateTo = reportName;
    this.navigateFromSavedQuery(navigateTo);

    });

  }

 navigateFromSavedQuery(navigateTo)
 {
this._ddrData.fromReport = false;
this._ddrData.errorNameUrl = undefined;
this._ddrData.errorNameSession = undefined;
this._ddrData.errorUserSession = undefined;
this._ddrData.filtermode = "";
this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SYSTEM_DEFINED_QUERIES;
this.breadcrumbService.isFromHome = false;
console.log("open report " + navigateTo);
//this.clearNSObject();
// let code:Number;
if (navigateTo =='URL Summary') {
  this._ddrData.getWanEnV();
  this.commonService.nsURLSummary = this.cqmFilter;
  this.router.navigate(['/home/ddr/nsreports/urlSummary']);
}
if (navigateTo =='Session Summary') {
  //session
  this._ddrData.getWanEnV();
  this.commonService.nsSessionSummary = this.cqmFilter;
  console.log("Data in cqmFilter.............",this.cqmFilter);
  this.router.navigate(['/home/ddr/nsreports/sessionSummary']);
}
if (navigateTo=='Transaction Summary') {
  //transaction
  this._ddrData.getWanEnV();
  console.log("clearing the saved transaction from webdashboard");
  this._ddrData.transactionName = undefined;
  // this.commonService.nsTransactionSummary['transactionName'] = undefined;
  this.commonService.nsTransactionSummary = {};
  this.commonService.nsTransactionSummary = this.cqmFilter;
  this._ddrData.vectorName = undefined
  this.router.navigate(['/home/ddr/nsreports/TransactionSummary']);
}

if (navigateTo=='Page Summary') {
  //page
  this._ddrData.getWanEnV();
  this.commonService.nsPageSummary = this.cqmFilter;
  this.router.navigate(['/home/ddr/nsreports/PageSummary']);
} 

if (navigateTo=='FlowpathGroupBy') {
  
  this.commonService.fpGroupByFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/Flowpathgroupby']);
}

if (navigateTo=='DB Report') {
  
  this.commonService.dbFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/dbReport']);
}

if (navigateTo=='DBGroupBy') {
  
  this.commonService.dbGroupByFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/dbGroupBy']);
}

if (navigateTo=='Exception') {
  this.commonService.exceptionFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/exception']);
}

if (navigateTo=='Method Timing') {
  this.commonService.methodTimingFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/methodtiming']);
}

if (navigateTo=='Hotspot') {
  this.commonService.hotspotFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/hotspot']);
}

if (navigateTo=='IP Summary') {
  //page
  this.commonService.ipSummaryFilters=this.cqmFilter;
  this.router.navigate(['/home/ddr/ipsummary']);
}

if (navigateTo=='Flowpath') {
  //page
  //this.commonService.fpFilters;
  this.commonService.fpFilters=this.cqmFilter;
  console.log("Data in cqmFilter.............",this.cqmFilter);
  console.log("Data in Autofill.........................",this._ddrData.nsCqmAutoFill);
  this.router.navigate(['/home/ddr/flowpath']);
}

 }

  deleteSavedQuery() {
    let userName = sessionStorage.getItem('sesLoginName');
     console.log("we aree here 4 confirmation");
    if(this.selectedRowInfo.length ==0) {
      window.alert("Please select one row");
      return;
    }
    else if((this.userStored == userName) ||(userName == "cavisson")) {
      
    this.confirmationService.confirm({
      message: 'Are you sure to delete?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.removeField();
       }
   });
  }
  else{
    window.alert("This user is not allowed to delete the query");
  }
 }

 removeField() {
    let msg = 'Deleted query for'+ this.commonService.currentReport + ' Report ';
    this._ddrData.setInLogger('DDR::System Defined',this.commonService.currentReport,'CQM_Delete_Query',msg);
    console.log("this.selectedRowInfo **** ", this.selectedRowInfo);
    let ids=[]; 
    this.selectedRowInfo.forEach(
      (val) => {
           console.log("val ****** ",val);
           ids.push(val['id']);
      }
    );
    console.log("selected ID for Delete Saved Queries Are ", ids);
    let query = [];
    ids.forEach((val) => { 
      // {queryName: "y", description: "", date: "Wed Oct 16 16:50:02 IST 2019", id: 3, user: "guest", …}
      this.savedQueriesData.forEach((data)=>{
       if(data['id']==val)
       query.push(data);   
      }) 
    });
    console.log("query table ", query);
    let queryName = [];
    query.map((val) => { queryName.push(val.queryName) });
    //list of queryName and id has been made for sending into rest
    let objQueryName=JSON.stringify(queryName);
    let objIds=JSON.stringify(ids);
    objQueryName=objQueryName.replace(objQueryName[0],"{").replace(objQueryName[objQueryName.length-1],"}")  //.replace(/\"/g,"");
    objIds=objIds.replace(objIds[0],"{").replace(objIds[objIds.length-1],"}")    //.replace(/\"/g,"");
    let product = sessionStorage.getItem('productType');
    if (product)
      product = product.toLowerCase(); 
    let url =  this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/UserDefinedQueries';
    //testRun=' + this._ddrData.testRun + "&saveQuery=undefined&showQuery=undefined&deleteQuery=true&showQueryData=undefined" + "&queryArray=" + JSON.stringify(queryName) + "&indexArray=" + JSON.stringify(ids);
    console.log("objQueryName ** ",objQueryName, " ******* objIds ",objIds);
    let obj={
      testRun:this._ddrData.testRun ,
      saveQuery:undefined,showQuery:undefined,
      deleteQuery:true,
      showQueryData:undefined,
      queryArray:(objQueryName) ,
      indexArray:(objIds)
    }
    this.ddrRequest.getDataUsingPost(url,obj).subscribe(rest => {
      console.log(" query has been deleted successfully ***************** ");
      this.message= [{severity:'success', summary:'', detail:'Selected Query/queries deleted successfully.'}];
      this.getUserDefinedQueries();
      this.selectedRowInfo=[];

    });

  }
  getUserDefinedQueriesData(selectedQueries: any) {
    let product = sessionStorage.getItem('productType');
    if (product)
      product = product.toLowerCase();

    let url = this.getHostUrl() + '/' + product + '/v1/cavisson/netdiagnostics/ddr/UserDefinedQueries?testRun=' + (this.id['testRun'] || this._ddrData.testRun || sessionStorage.getItem("testRun")  )+ "&saveQuery=undefined&showQuery=undefined&deleteQuery=undefined&showQueryData=true" + "&queryName=" + selectedQueries;
    this.ddrRequest.getDataUsingGet(url).subscribe(rest => {
    this.savedQueriesObject = rest['data'];
    });
  }

  onRowSelectData(selectedRowData: any, event) {
    console.log("on row select has been called ********** ", selectedRowData, "****", event);
    // // this.selectedRowInfo.push(selectedRowData);
    // let index: number = this.selectedRowInfo.indexOf(selectedRowData);
    // if (index === -1) {
    //   this.selectedRowInfo.push(selectedRowData);
    // }
    if(!this.selectedRowInfo.includes(selectedRowData)) //if doesnt includes
    this.selectedRowInfo.push(selectedRowData);
    this.userStored = selectedRowData['user'];
  }

  onRowUnselectData(unSelectedRowData: any) {
    // let index: number = this.selectedRowInfo.indexOf(unSelectedRowData);
    // if (index !== -1) {
    //   this.selectedRowInfo.splice(index, 1);
    // }
    let index = this.selectedRowInfo.indexOf(unSelectedRowData);
    if(index)
    delete this.selectedRowInfo[index];
  }

  sortColumnsOnCustom(event, tempData) {

    tempData = tempData.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
          result = -1;
      else if (value1 != null && value2 == null)
          result = 1;
      else if (value1 == null && value2 == null)
          result = 0;
      else if (event.field == "date") {
          let temp1 = value1.substr(0,5);
          let temp2 = value2.substr(0,5);
          value1 = temp1.split('/')[1]+'/'+temp1.split('/')[0]+value1.substr(5,value1.length);
          value2 = temp2.split('/')[1]+'/'+temp2.split('/')[0]+value2.substr(5,value2.length);
          value1 = new Date(value1);
          value2 = new Date(value2);
          result = value1-value2;
      }
      return (event.order * result);
  });
  
  if (tempData) {
    this.savedQueriesData = [];
    tempData.map((rowdata) => { this.savedQueriesData = this.Immutablepush(this.savedQueriesData, rowdata) });
  }
}

Immutablepush(arr, newEntry) {
  return [...arr, newEntry]
}

}

export interface SysDefQueryInterface {
  label;
  description;
  code;
  visible;


}

export interface userDefinedInterface{
  id;
  queryName;
  description;
  date;
  user;

}
