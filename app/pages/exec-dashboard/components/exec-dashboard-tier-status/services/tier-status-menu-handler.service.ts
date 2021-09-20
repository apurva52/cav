import { Injectable } from '@angular/core';
import { tap } from "rxjs/operators";
import { Observable } from 'rxjs';
import { TierStatusDataHandlerService } from './tier-status-data-handler.service';
import { ExecDashboardCommonRequestHandler } from './../../../services/exec-dashboard-common-request-handler.service';
import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { RENAME_TIER } from './../const/url-const';
import { TierStatusCommonDataHandlerService } from './tier-status-common-data-handler.service';
import { HttpClient } from '@angular/common/http';

//import { RouterModule, Routes } from '@angular/router';
import { Router} from '@angular/router';

import {ExecDashboardDataContainerService} from '../../../services/exec-dashboard-data-container.service'
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { DdrDataModelService } from 'src/app/pages/tools/actions/dumps/service/ddr-data-model.service';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';

@Injectable()
export class TierStatusMenuHandlerService {



  constructor(public _tsDataHandler: TierStatusDataHandlerService,
    public _requestHandler: ExecDashboardCommonRequestHandler,
    public _config: ExecDashboardConfigService,
    private router: Router,
    public _commonHandler: TierStatusCommonDataHandlerService,
    private _ddrData: DdrDataModelService,
    private httpClient: HttpClient,
//    private cavNavBar: CavNavBarComponent,
    private _cavConfig: CavConfigService,
    private _navService: CavTopPanelNavigationService,
//    private _cavOpenNewBrowserTab: CavOpenNewBrowserTabService,
    private _dataContainer : ExecDashboardDataContainerService
    ) {

  }

  getRenameIPRes(newName, callback) {
    try {
      //console.log('getRenameIPRes called ' + newName);
      //console.log(this._tsDataHandler.$selectedMenuNode);
      //console.log(this._tsDataHandler.$selectedMenuActualNameNode);
      //console.log(this._commonHandler.$flowMapName);
      let actualTierName = this._tsDataHandler.$selectedMenuActualNameNode;
      let newTierName = newName;
      let flowMapName = this._commonHandler.$flowMapName;
      let url = this._config.$getHostUrl + RENAME_TIER;
      url = url + '&actualTierName=' + actualTierName + '&newTierName=' + newTierName + '&flowMapName=' + flowMapName + '&globalRenaming=true' + '&flowmapDir=SCS';
      //console.log(url);
      this._requestHandler.getDataFromGetRequest(url, (data) => {
        callback(data);
      })
      let data;
      callback(data);
    } catch (error) {
      //console.log(error);
    }
  }

  responseTime: any;

  handleDdrDrillDown(msg, tsData) {

    try {

      //alert("DrillDown: " + msg);
      console.log("DDR Before : ", this._tsDataHandler.$tierStatusData);
      this._tsDataHandler = tsData;
      //this.get_Time();
      console.log("DDR After : ", this._tsDataHandler.$tierStatusData);
      if (isNaN(msg) === false) {

        this.responseTime = msg;
        console.log(" menu handler Response time: ", this.responseTime);
        msg = "flowpathsbyip";
        this._tsDataHandler.$showResponseDialog = false;

      }
      // this.resetDDRArguments();
      this.createParam(msg);  //to set all required parameters
      this.reportCase(msg);   //to route to specific report


    } catch (error) {
      console.log("error in menu handler handleDdrDrillDown ");
      console.log(error);
    }
  }

  reportCase(msg) {
    try {
      this._ddrData.flagForHSToFP = '0';
      this._ddrData.tabNameObserver$.next('');
      switch (msg) {
        case "flowpathsbyresponsetime": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
	    this._ddrData.nsCqmAutoFill={};
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.strOrderBy = "fpduration_desc";
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report'); 
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "flowpathsbycallouterror": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.strOrderBy = "error_callout";
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report');
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "slowdbcallsbyresponsetime": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.strGroup = "tier";
            this._ddrData.strOrderBy = "exec_time_desc";
            this.subscribeBackendIdForDBCase();

          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "topdbcallsbycount": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.strGroup = "tier";
            this._ddrData.strOrderBy = "count_desc";
            this.subscribeBackendIdForDBCase();
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "dbcallsbybusinesstransaction": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.strGroup = "url";
            this._ddrData.strOrderBy = "count_desc";
            this.subscribeBackendIdForDBCase();
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "topdbqueriesbyerrorcount": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.strGroup = "tier";
            this._ddrData.strOrderBy = "query_count";
            this.subscribeBackendIdForDBCase();
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "hotspots": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            this._ddrData.flagForHSToFP = '1';
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.setInLogger('End-to-End View::DDR','Hotpsot','Open Hotpsot Report');                        
            this.router.navigate(['/ddr/hotspot']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "methodsbyresponsetime": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.setInLogger('End-to-End View::DDR','Method Timing','Open Method Timing Report');                        
            this.router.navigate(['/ddr/methodtiming']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }

        case "exceptions": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.setInLogger('End-to-End View::DDR','Exception','Open Exception Report');
            this.router.navigate(['/ddr/exception']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }

        case "btipsummary": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.setInLogger('End-to-End View::DDR','Ip Summary','Open Ip Summary Report');                        
            this.router.navigate(['/ddr/ipsummary']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }

        case "Normal": {
          //statements;
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.statuscode = "-2";
            this._ddrData.btCategory = "10";
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report');    
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }

          break;
        }
        case "Slow": {
          //statements; 

          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.statuscode = "-2";
            this._ddrData.btCategory = "11";
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report'); 
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "VerySlow": {
          //statements; 

          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.statuscode = "-2";
            this._ddrData.btCategory = "12";
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report');
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        case "Errors": {
          //statements; 

          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.statuscode = "-2";
            this._ddrData.btCategory = "13";
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report'); 
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }

          break;
        }

        case "flowpathsbyip": {

          // alert("flowpathsbyip");
          //this.router.navigate(['/ddr/ipsummary']);


          this._ddrData.backendName = this._tsDataHandler.$selectedMenuActualNameNode;
          this._ddrData.backendRespTime = this.responseTime;
          this.responseTime = undefined; // reset response time
          this._ddrData.tierName = "";
          this._ddrData.strOrderBy = "";
          //get BackendID

          this.subsribeBackendIDForFPCase();

          break;
        }

        //For Search By Feature
        case "searchByFlowpath": {
          //for bug 96943
          if (this._tsDataHandler.$isStoreView){
            this._ddrData.startTime = undefined;
            this._ddrData.endTime = undefined;
          }
           
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            // this._navService.addNewNaviationLink('ddr');
            this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report'); 
            this.router.navigate(['/ddr/flowpath']);
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        //For Search By Feature Logs
        case "searchByFlowpathLogs": {
          let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));
          if (isBrowserTab == 0) {
            let url = this._config.$getHostUrl + this._ddrData.product + "/integration.jsp?testRun=" + this._ddrData.testRun + "&strOprName=drilldownfromED&WAN_ENV=0&radRunPhase=0&testMode=W&breadCrumbTrackID=0&strStartTime=" + this._ddrData.startTime +
              "&strEndTime=" + this._ddrData.endTime + "&sesLoginName=" + this._cavConfig.$userName + "&sessGroupName=" + this._cavConfig.$userGroup + "&sessUserType=" + this._cavConfig.$userType +
              "&openFileName=NF&breadCrumbName=Tier%20Status&breadCrumbURL=" + encodeURIComponent(this._config.$getHostUrl) + "&strTSList=" + this._ddrData.startTime + "&endTSList=" + this._ddrData.endTime +
              "&dcIP=" + this._cavConfig.$host + "&dcPort=" + this._cavConfig.$port + "flowpathID=" + this._ddrData.flowpathID + "&strGraphKey=" + this._ddrData.strGraphKey +
              "&pattern=" + this._ddrData.pattern + "&tier=" + this._ddrData.tierName + "&correlationId=" + this._ddrData.correlationId;
            window.open(url, '_blank');
          } else {
            // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('tierStatus', '#/home/execDashboard/main/tierStatus')
          }
          break;
        }
        default: {
          console.log("menu handler Defaullt case");
          break;
        }

      }
    } catch (error) {

    }
  }

  dcName: string;


  subscribeBackendIdForDBCase() {
    if (this._tsDataHandler.$dbIntegrationName != "NonIP") {
      this._ddrData.backendName = this._tsDataHandler.$dbIntegrationName
      this.getBackEndId().subscribe(res => {
        console.log(res);
        let data = res.toString();
        if (data.startsWith('Error')) {
          // console.log("data>>>>>>>>>>>>>>>>>>", data);
          this._ddrData.errorMessage(data);
          return;
        }
      else {
        //  console.log("data>>>>>>>>>>>>>>>>>>", data);
        this._ddrData.backendId = data;
        console.log("this._ddrData.backendId>>>>>>>>>>>>>>>", this._ddrData.backendId);
        if (this._ddrData.strGroup === "url") {
          this._ddrData.setInLogger('End-to-End View::DDR','Db Queries','Open Group By Db Queries Report'); 
          this.router.navigate(['/ddr/dbGroupBy']);
        } else {
          this._ddrData.setInLogger('End-to-End View::DDR','Db Queries','Open Db Queries Report');
          this.router.navigate(['/ddr/dbReport']);
        }
      }
     });
    }
  else 
     { // All DB Case
       this._ddrData.backendId = '';
       this._ddrData.backendName = '';
       if (this._ddrData.strGroup === "url") {
         this._ddrData.setInLogger('End-to-End View::DDR','Db Queries','Open Group By Db Queries Report');
         this.router.navigate(['/ddr/dbGroupBy']);
       } else {
         this._ddrData.setInLogger('End-to-End View::DDR','Db Queries','Open Db Queries Report');
         this.router.navigate(['/ddr/dbReport']);
       }
     }
   }

  subsribeBackendIDForFPCase() {
    this.getBackEndId().subscribe((res: any) => {


      this._ddrData.backendId = res.toString();
      // if ( this._ddrData.backendId==undefined) {
      // 	alert('Integration Point MetaData is not available');
      // }
      console.log("menu handler subsribeBackendIDForFPCase", this._ddrData.backendId);
      console.log("menu handler Backend response time ", this._ddrData.backendRespTime);
      console.log("menu handler Backend name", this._ddrData.backendName);
      //alert(res.toString());
      console.log("menu handler subsribeBackendIDForFPCase() response: ", res.toString());
      console.log("menu handler subsribeBackendIDForFPCase() tierName: ", this._ddrData.tierName);
      // this._navService.addNewNaviationLink('ddr');
      this._ddrData.setInLogger('End-to-End View::DDR','Flowpath','Open Flowpath Report'); 
      this.router.navigate(['/ddr/flowpath']);

    },
      error => {
        alert("Integration Point MetaData is not available");
      });
  }

  createParam(msg) {

    console.log("menu handler, createParam(msg) starts, Report type:  ", msg);
    let _date: string = this._tsDataHandler.$serverDateTime;
    const actMinutes = this._config.$actTimePeriod.split("_").length ? parseInt(this._config.$actTimePeriod.split("_")[1]) : 60

    if (msg != 'searchByFlowpath' && msg != 'searchByFlowpathLogs') {
      //if(!this._tsDataHandler.$selectedMenuActualNameNode) //for getting correct transaction scorecard data first time
      //this._tsDataHandler.$selectedMenuActualNameNode=this._tsDataHandler.$selectedNode;
      this.resetDDRArguments();
      this._ddrData.tierName = this._tsDataHandler.$selectedMenuActualNameNode;
      this._ddrData.correlationId = "";
      this._ddrData.flowpathID = "";
      console.log("resetDDRArguments called");
    } else {
      this._ddrData.strOrderBy = "";
      this._ddrData.serverName = "";
      this._ddrData.appName = "";
    }
    this._ddrData.testRun = this._config.$testRun;
    
    if (this._tsDataHandler.$isStoreView){
      this._ddrData.testRun = this._config.getNodePresetObject(this._dataContainer.$MultiDCsArr).testrunNumber;
      console.log("Store View case: test run: "+this._ddrData.testRun);
}
    
    console.log("menu handler this._tsDataHandler.$dbIntegrationName ==> ", this._tsDataHandler.$dbIntegrationName)

    console.log("menu handler this._ddrData.backendName ==> ", this._ddrData.backendName)

    //setting tier server instance, at Instatnce level flow map
    if (this._commonHandler.flowMapMode == '2') {

      //this._tsDataHandler.$selectedNode = this._tsDataHandler.$selectedMenuActualNameNode;
      //this._tsDataHandler.getTierData();
      var data = this._tsDataHandler.$selectedTierData;
      let arr = data.reqVectorName.split('>');

      console.log("menu handler Instance level, tierName>serverName>appName: ", arr[0] + ">" + arr[1] + ">" + arr[2]);

      this._ddrData.tierName = arr[0];
      this._ddrData.serverName = arr[1];
      this._ddrData.appName = arr[2];

    }

    if (msg != 'searchByFlowpath' && msg != 'searchByFlowpathLogs') {
      this._ddrData.strGraphKey = this._config.$actTimePeriod.split('_')[1];
    }
    this._ddrData.protocol = this._config.$protocol.replace(":", "");
    console.log("Menu Handler graph time is" + this._config.$actTimePeriod.split('_')[1]);
    //this._ddrData.port=this._config.;



    /*setting Time
      In case of today only start time will read from response data.
      In last_X_minutes cases end time will be read from response data but
         start time will be calculated on the basis of end time and graphKey.
      In case of specified time applied start/end time will be used from dialog box.
    */
    let applieTimeKey = sessionStorage.appliedEDGraphTime;
    if(applieTimeKey.toLowerCase().includes("last")){
    if (sessionStorage.getItem("isMultiDCMode") === "true") {
      //MultiDC case
      this.dcName = this.setDcName();
      this._ddrData.startTime = this.getTimeStamp(this.dcName, "start");
      this._ddrData.endTime = this.getTimeStamp(this.dcName, "end");
    }
    else {
      //single DC case
      this._ddrData.startTime = this._tsDataHandler.$tierStatusData.startTimeStamp;
      this._ddrData.endTime = this._tsDataHandler.$tierStatusData.endTimeStamp;
    }
      //calculating start time on the basis of end time and graphKey in case of last_X_minutes
      if(applieTimeKey.toLowerCase().includes("minutes")){
      let timeInMin = applieTimeKey.split("_")[1];
      this._ddrData.startTime = (Number(this._ddrData.endTime) - Number(timeInMin)*60*1000).toString() ;
      }
    }
    else{
      //specified_time case(custom/yesterday)
      if (sessionStorage.getItem("isMultiDCMode") === "true") { //for bug 80154
        this.dcName = this.setDcName();
        this._ddrData.startTime = this.getTimeStamp(this.dcName, "start");
        this._ddrData.endTime = this.getTimeStamp(this.dcName, "end");
      }
      else{  
        this._ddrData.startTime = this._tsDataHandler.$tierStatusData.startTimeStamp;
        this._ddrData.endTime = this._tsDataHandler.$tierStatusData.endTimeStamp; 
       }
    }
    console.log("Menu handler start time: ", this._ddrData.startTime);
    console.log("Menu handler End time: ", this._ddrData.endTime);

    //this.getDcUrl(this.dcName);
    //this.reportCase(msg);
    let productType = sessionStorage.productType;
    if (!productType || productType == "undefined")
      productType = "netdiagnostics";
    console.log("this._ddrData.enableQueryCaching*****************", this._ddrData.enableQueryCaching);
    console.log("this._config.$actTimePeriod*****************", this._config.$actTimePeriod);
    if (!this._config.$actTimePeriod.startsWith("Last_")) {
      if (!this._ddrData.enableQueryCaching) {
        let url = this._ddrData.getHostUrl() + '/' + productType + "/v1/cavisson/netdiagnostics/webddr/enableQueryCaching"
        this._ddrData.getDataInStringUsingGet(url).subscribe(data => {
          this._ddrData.enableQueryCaching = Number(data);
        });
      }
    } else {
      this._ddrData.enableQueryCaching = 0;
    }

    console.log("this._ddrData.guiCancelationTimeOut*****************", this._ddrData.guiCancelationTimeOut);
      if (!this._ddrData.guiCancelationTimeOut) {
        let url = this._ddrData.getHostUrl() + '/' + productType + "/v1/cavisson/netdiagnostics/webddr/guiCancelationTimeOut"
        this._ddrData.getDataInStringUsingGet(url).subscribe(data => {
          this._ddrData.guiCancelationTimeOut = Number(data);
        });
    } 

    console.log("menu handler, createParam(msg) Ends");

  }


  get_Time(msg) {

    let url: string = this._config.$getHostUrl + sessionStorage.getItem('productType') + "/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=" + this._config.$testRun + "&graphTimeKey=" + this._config.$actTimePeriod.split('_')[1];
    //baseUrl:string = "http://10.10.40.3:8012/netdiagnostics/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=1278&graphTimeKey=60";
    this.httpClient.get(url).subscribe((res: any) => {
      //console.log("RestUrlashish " + this.url);
      //console.log("REst Call Json output", res);
      // //console.log("start time --",res.ddrStartTime);
      //alert(res.toString());

      this._ddrData.startTime = res.ddrStartTime;
      this._ddrData.endTime = res.ddrEndTime;

      console.log("menu handler TimeStamp Start Time: " + this._ddrData.startTime);
      console.log("menu handler TimeStamp End Time: " + this._ddrData.endTime);

      this.reportCase(msg);



    });
  }


  getBackEndId() {

    console.log("menu handler, getBackEndId() starts");

    let url = "";
    let dcArray=this._tsDataHandler.$tierStatusData.dcName.split(","); //getting all configured dcs

    if (sessionStorage.getItem("isMultiDCMode") === "true" && this._cavConfig.getActiveDC().toLowerCase() === "all") {
      // let backendDC = this._ddrData.backendName.split(".")[0];
      // this.cavNavBar.setDDRArguments(backendDC, true);
      // let backnd = this._ddrData.backendName.substr(this._ddrData.backendName.indexOf('.') + 1);
      //this._ddrData.backendName = backnd;

      let backendDC = this._tsDataHandler.$tierStatusData.nodeInfo.filter(e => e.actualTierName == this._tsDataHandler.$selectedMenuActualNameNode)[0].dc.split(",")[0];
    //  this.cavNavBar.setDDRArguments(backendDC, true);

      console.log("backendDC name", backendDC);

      let backnd = this._ddrData.backendName;
      //To Remove DC Names from tier names in case of ALL
      for (let j = 0; j < dcArray.length; j++) {
        var re = new RegExp(dcArray[j] + ".", 'g');
        backnd = backnd.replace(re, "");
        console.log("new BackenName", backnd);
      }
      this._ddrData.backendName = backnd;
      this._ddrData.dcName = this.dcName;
      let productType = sessionStorage.getItem('product');
      if (!productType || productType == "undefined")
        productType = "netdiagnostics";
      url = this._ddrData.getHostUrl() + '/' + productType + "/v1/cavisson/netdiagnostics/ddr/backendId?testRun=" + this._ddrData.testRun + "&backendName=" + backnd;
    }
    else {
      let productType = sessionStorage.getItem('product');
      if (!productType || productType == "undefined")
        productType = "netdiagnostics";
      const hostURI = `${this._config._productConfig.$protocol}://${this._config._productConfig.$host}:${this._config._productConfig.$port}/`;
      // console.log({hostURI});
      url = this._ddrData.getHostUrl() + '/' + productType + "/v1/cavisson/netdiagnostics/ddr/backendId?testRun=" + this._config.$testRun + "&backendName=" + this._ddrData.backendName;
    }
    //return this.httpClient.get(url);
    return this.getDataInStringUsingGet(url);
    //   console.log("menu handler, getBackEndIdUrl() ends");
  }


  /*
   name:setDcName
   input: nil
   output: dc Name
   descrip: to get and Initialize DCName & remove DC from Tier Names in case  of MultiDC All case
   @Author: Ashish Upadhyay
  */
  setDcName(): string {
    //to set DC name in case of multi DC only

    console.log("menu handler setDcName() starts ");
    let dcName = "";

    //dcName = this._tsDataHandler.$selectedNodeDCName.split(",")[0];
    if (this._tsDataHandler.$isStoreView){
      dcName = this._cavConfig.$eDParam.dcName;
	}
    else{
	dcName = this._tsDataHandler.$tierStatusData.nodeInfo.filter(e => e.actualTierName == this._tsDataHandler.$selectedMenuActualNameNode)[0].dc.split(",")[0];
	}
    console.log("menu handler DC name of slected node: " + dcName);

    console.log("menu handler cav nav bar value: ", this._cavConfig.getActiveDC());
    console.log("from store view: ", this._tsDataHandler.$isStoreView);
    if (!this._tsDataHandler.$isStoreView && this._cavConfig.getActiveDC().toLowerCase() === "all" ) {

      //if(this._commonHandler.flowMapMode != '2')
      //dcName = this._tsDataHandler.selectedMenuActualNameNode.split(".")[0];
      console.log("menu handler Inside all case: Tier list " + this._ddrData.tierName);
      let tierNameArr = this._tsDataHandler.$selectedMenuActualNameNode.split(",");
      let tempTierName = this._tsDataHandler.$selectedMenuActualNameNode;
      let dcArray=this._tsDataHandler.$tierStatusData.dcName.split(","); //getting all configured dcs
      console.log("Menu Handler DC Array",dcArray );

      //to remove dc names from tier names in case of ALL
      // for (let i = 0; i < tierNameArr.length; i++) {

      //   var firstIndex = tierNameArr[i].indexOf('.');
      //   tierNameArr[i] = tierNameArr[i].substr(firstIndex + 1);
      //   console.log(tierNameArr[i]);
      // }
      //NEW CODE 
      //To Remove DC Names from tier names in case of ALL
      for(let j=0; j<dcArray.length; j++){
        var re = new RegExp(dcArray[j]+".", 'g');
        tempTierName = tempTierName.replace(re,"");
        console.log("replaced BT Param list",tempTierName);
      }

      if (this._commonHandler.flowMapMode != '2')
      //this._ddrData.tierName = tierNameArr.join(",");
      this._ddrData.tierName = tempTierName;
      console.log("menu handler Tier name list before Routing: ", this._ddrData.tierName);
    }
    this._ddrData.dcName = dcName;
  //  this.cavNavBar.setDDRArguments(dcName, true);

    console.log("menu handler setDcName() Ends dcName: ", dcName);
    return dcName;
  }

  /*
   name:getTimeStamp
   input:DC name, Type of time(start/end)
   output: start/end time
   descrip:get time on basis of DC name and time type(startTime:EndTime)
   @Author: Ashish Upadhyay
  */
  getTimeStamp = function (dcName, timeType) {
    console.log("menu handler getTimeStamp() starts dcName : timeType:: " + dcName + " : " + timeType);
    try {
      var dcNameArr = this._tsDataHandler.$tierStatusData.dcName.split(",");
      var index = dcNameArr.indexOf(dcName);
      if (timeType == "start") {

        if (this._tsDataHandler.$isStoreView) {
          return this._tsDataHandler.$tierStatusData.startTimeStamp;
        } else {
          var strTSArr = this._tsDataHandler.$tierStatusData.startTimeStamp.split(",");
          console.log("menu handler getTimeStamp start time: ", strTSArr[index]);
          return strTSArr[index];
        }
      }
      else if (timeType == "end") {

        if (this._tsDataHandler.$isStoreView) {
          return this._tsDataHandler.$tierStatusData.endTimeStamp;
        } else {
          var endTSArr = this._tsDataHandler.$tierStatusData.endTimeStamp.split(",");
          console.log("menu handler getTimeStamp end time: ", endTSArr[index]);
          return endTSArr[index];
        }
      }
      else
        return "NA";
    }
    catch (e) {
      console.log("menu handler getTimeStamp method called. Exception occur : " + e);
    }
    console.log("menu handler getTimeStamp() ends");
  }


  /*
   name:getDcUrl
   input:DC name
   output:DC url(protocol+ip+port+product)
   Descrip:creates url on the bases of DCName
   @Author: Ashish Upadhyay
  */
  getDcUrl(dcName: string): string {
    let dcUrl: string;
    var x;
    let productType = sessionStorage.productType;
    if (!productType || productType == "undefined")
      productType = "netdiagnostics";
 
    if(!this._tsDataHandler.$isStoreView){
      x = this._tsDataHandler.$DCsInfo.filter(e => e.dc.toUpperCase() == dcName.toUpperCase())[0];
      dcUrl = x.protocol + '://' + x.ip + ':' + x.port + '/' + productType; //protocol+ip+port+product
    }
    else{
      x = this._dataContainer.$DCsInfo[dcName];
      dcUrl = x.protocol + '://' + x.dataCenterIP + ':' + x.dataCenterPort + '/' + productType; //protocol+ip+port+product
    }
    console.log("menu handler getDcUrl() ends, DC URL: ", dcUrl);
    return dcUrl;
  }

   /*Getting Data Through REST API in String format by using GET Method */
   getDataInStringUsingGet(url, param?) {
    console.log(`Making RestCall and getting data using Get method for String where url = ${url} and
  params = ${param}`);
    return this.httpClient.get(url, { responseType: 'text' }).pipe(
      tap(
        data => data
      )
    );
  }
  /*Logging Error Function*/
  catchLog(err, url) {
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', err.error.message, 'url:', url);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${err.status}, body was: ${err.error}, url:${url}`);
    }
    return Observable.throw(
      new Error(`${err.status} ${err.statusText}`)
    );
  }

  resetDDRArguments() {
    console.log("menu handler resetDDRArguments called");
    this._ddrData.resetDDRArguments();
    this._ddrData.serverName = "";
    this._ddrData.appName = "";
    /*this._ddrData.ndSessionId = undefined;
    this._ddrData.nvPageId = undefined;
    this._ddrData.nvSessionId = undefined;
    this._ddrData.urlParam = undefined;
    this._ddrData.flowpathID = undefined;
    this._ddrData.isFromNV = '0'; //nv flag off
    this._ddrData.strOrderBy="";
    this._ddrData.serverName ="";
    this._ddrData.appName = "";
    this._ddrData.urlName = undefined;
    this._ddrData.btCategory = undefined;
    this._ddrData.mode = undefined;
    this._ddrData.backendId = undefined;
    this._ddrData.correlationId = undefined; */
  }
}

