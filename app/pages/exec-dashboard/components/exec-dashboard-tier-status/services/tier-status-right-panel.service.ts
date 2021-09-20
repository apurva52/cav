import { TierStatusDataHandlerService } from './tier-status-data-handler.service';
import { TierStatusMenuHandlerService } from './tier-status-menu-handler.service';
import { Subject } from 'rxjs';
import { ExecDashboardCommonRequestHandler } from './../../../services/exec-dashboard-common-request-handler.service';
import { ExecDashboardGraphicalKpiService } from '../../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardDataContainerService } from '../../../services/exec-dashboard-data-container.service';
import { ExecDashboardConfigService } from '../../../services/exec-dashboard-config.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ExecDashboardUtil } from '../../../utils/exec-dashboard-util';
import { TierStatusCommonDataHandlerService } from './tier-status-common-data-handler.service';
//import {TierStatusDataHandlerService } from './tier-status-data-handler.service' ;
// import { delay } from 'rxjs/operators/delay';
// import { HttpClient } from '@angular/common/http';
// import { from } from 'rxjs/observable/from';
// import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { DdrDataModelService } from 'src/app/pages/tools/actions/dumps/service/ddr-data-model.service';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { AlertTimeAgo } from 'src/app/shared/pipes/dateTime/alert/alert-timeAgo.pipe';
import { SessionService } from 'src/app/core/session/session.service';
import { AdvancedConfigurationService } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/service/advanced-configuration.service'

//import { ExecDashboardConfigService } from 'exec-dashboard-config.service';
// import { mergeMap } from 'rxjs/operators';
@Injectable()
export class TierStatusRightPanelService {

    capacityData: any = [];
    behaviorData: any = [];
    alertWindow: boolean = false;
    alertLabel: string = 'minor';
    private _ip: string;
    private _port: string;
    alertDataSubject = new Subject();
    timeAgo: AlertTimeAgo;

    private _tierListForSelectedApp: any = [];
    constructor(public requestHandler: ExecDashboardCommonRequestHandler,
        public _tierMenuHandler: TierStatusMenuHandlerService,
        public _dataHandlerService: TierStatusDataHandlerService,
        private _graphicalService: ExecDashboardGraphicalKpiService,
        private _dataContainer: ExecDashboardDataContainerService,
        private _config: ExecDashboardConfigService,
        private _requestHandler: ExecDashboardCommonRequestHandler,
        private _ddrModelService: DdrDataModelService,
        private http: HttpClient,
        private _navService: CavTopPanelNavigationService,
        private router: Router,
        private _cavConfig: CavConfigService,
        private _execDashboardUtil: ExecDashboardUtil,
//        private cavNavBar: CavNavBarComponent,
        public _commonHandler: TierStatusCommonDataHandlerService,
	private sessionService: SessionService,
	private advConfig :  AdvancedConfigurationService
    ) {
	    this.timeAgo = new AlertTimeAgo(this.sessionService, this.advConfig);
    }

    /**
     * Method to send request for alerts in tier status right panel
     */
    getDataForAlerts(severity, dcName?: string) {
        this.alertLabel = severity;
//        let capacityUrl = `${this._dataHandlerService._config.$getHostUrl}/${this._dataHandlerService.$servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=getAlertDetail&tierName=${this._dataHandlerService.$selectedNode}&severity=${severity}&alertType=Capacity&reqTestRunNum=${this._dataHandlerService.cavConfig.$eDParam.testRun}&dcName=${dcName}&resolution=Auto&serverType=${this._dataHandlerService.commonTierHandler.serverType}&isAll=${this._commonHandler.dcName}`;
        let capacityUrl = `${this._dataHandlerService.cavConfig.$protocol}://${this._dataHandlerService.cavConfig.$host}:${this._dataHandlerService.cavConfig.$port}/${this._dataHandlerService.$servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=getAlertDetail&tierName=${this._dataHandlerService.$selectedNode}&severity=${severity}&alertType=Capacity&reqTestRunNum=${this._dataHandlerService.cavConfig.$eDParam.testRun}&dcName=${dcName}&resolution=Auto&serverType=${this._dataHandlerService.commonTierHandler.serverType}&isAll=${this._commonHandler.dcName}`;

//        let behaviorUrl = `${this._dataHandlerService._config.$getHostUrl}/${this._dataHandlerService.$servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=getAlertDetail&tierName=${this._dataHandlerService.$selectedNode}&severity=${severity}&alertType=Behavioral&reqTestRunNum=${this._dataHandlerService.cavConfig.$eDParam.testRun}&dcName=${dcName}&resolution=Auto&serverType=${this._dataHandlerService.commonTierHandler.serverType}&isAll=${this._commonHandler.dcName}`;
	this.getDataForCapacityData(capacityUrl);
  //      this.getDataForBehavior(behaviorUrl);
    }
    getDataForCapacityData(url) {
        this.requestHandler.getDataFromGetRequest(url, (data) => {
             this.capacityData = data && data.length ? [...data] : [];
	     this.capacityData.forEach(element => {
	        element['timeAgo'] = this.timeAgo.transform(Number.parseInt(element['timeAgo']));
	     });
	    this.alertDataSubject.next('Data_Available');
            this.alertWindow = true;
        });
    }
    getDataForBehavior(url) {
        this.requestHandler.getDataFromGetRequest(url, (data) => {
            this.behaviorData = data && data.length ? [...data] : [];
	});
    }
    /**
     * Drill down Requests
     * @param key 
     * @param angularReports 
     */
    openFP(rightPanelService, key, angularReports) {
        this._dataHandlerService = rightPanelService; // service not working after migration
        this._tierMenuHandler.handleDdrDrillDown(key, rightPanelService);
    }
    openFPGroupURL(rightPanelService, key) {
        this._dataHandlerService = rightPanelService; // service not working after migration
        this.handleTierStatusBTTrendWindow(key);
    }

    handleTierStatusBTTrendWindow(key) {
        this.resetDDRArguments();
        this._ddrModelService.btTrendParamFromStoreView = this.createBTParams(key);

        let product = sessionStorage.getItem("product")
        if (!product)
            product = "netdiagnostics";
        // let ip = this._config.$getHostUrl;
        let ip = `${this._config.$protocol}//${this._config._productConfig.$host}:${this._config._productConfig.$port}/`;
        if (ip.endsWith("/"))
            ip = ip.substring(0, ip.lastIndexOf("/"));

            let fetchUrl;
            if(sessionStorage.getItem("isMultiDCMode")=="true")
             fetchUrl = this._ddrModelService.getHostUrl() + '/' + product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/bTRequestType";
            else
             fetchUrl = this._ddrModelService.getHostUrl() + "/" + product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/bTRequestType";
            this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
            this.http.get(fetchUrl).subscribe((data: any) => {
            this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
            this._ddrModelService.BtRequestType = data;

            // this._navService.addNewNaviationLink('ddr');
            this._ddrModelService.tabNameObserver$.next('');

            if (key == "intHealth") {
                this._ddrModelService.setInLogger('End-to-End View::DDR','Ip Stat','Open Ip Stat Report');
                this.router.navigate(['/ddr/IpStatComponent']);
            }
            else {
                this._ddrModelService.setInLogger('End-to-End View::DDR','BT Trend','Open BT Trend Report');
                this.router.navigate(['/ddr/DdrBtTrendComponent']);
            }
        },
            error => {
                this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
            });
    }


    getIPnPortFromHost() {
        console.log("getIPnPortFromHost called ");
        let hostName = sessionStorage.getItem('host');
        // let hostName = "http://66.220.31.140:8001/";
        let lastIdxOfColon = hostName.lastIndexOf(':')
        let lastIdxOfSlash = hostName.lastIndexOf('/');
        let lastIdxOfDblSlash = hostName.lastIndexOf('//');

        this._ip = hostName.substring(lastIdxOfDblSlash + 2, lastIdxOfColon);
        this._port = hostName.substring(lastIdxOfColon + 1, lastIdxOfSlash);

        if (this._dataContainer.$MultiDCsArr.length > 0) {
            if (this._dataContainer.$isAllDCs) {
                this._ip = this._dataContainer.$DCsInfo['All']['dataCenterIP']
                this._port = this._dataContainer.$DCsInfo['All']['dataCenterPort']
            }
            else {
                this._ip = this._dataContainer.$DCsInfo[this._dataContainer.$MultiDCsArr[0]]['dataCenterIP'];
                this._port = this._dataContainer.$DCsInfo[this._dataContainer.$MultiDCsArr[0]]['dataCenterPort'];
            }

        }

        console.log("ip is  ---->  ", this._ip);
        console.log("port is ---->  ", this._port);
    }

    createBTParams(key) {

        let btParams = {};
        let dcName = "";
        btParams['vectorName'] = this._dataHandlerService.selectedNode;
        btParams['tierNameList'] = this._dataHandlerService.selectedNode;
        btParams['strGraphKey'] = this._config.$actTimePeriod;
        btParams['testRun'] = this._config.$testRun;
        btParams['dcPort'] = this._cavConfig.$port;
        btParams['dcIP'] = this._cavConfig.$host;
        btParams['dcProtocol'] = this._cavConfig.$protocol;
        // btParams['strStartTime'] = this._config.$appliedStartTime;
        // btParams['strEndTime'] = this._config.$appliedEndTime;
        btParams['strStartTime'] = sessionStorage.getItem('appliedEDStartTime');
        btParams['strEndTime'] = sessionStorage.getItem('appliedEDEndTime');
        btParams['eventDay'] = this._config.$appliedEventDay;
        btParams['product'] = sessionStorage.getItem('product')? sessionStorage.getItem('product') : "netdiagnostics"; // 'netdiagnostics';
        btParams['btCategory'] = key;
	btParams['btName'] = "";
        btParams['strIncDisGraph'] = this._config.$isIncDisGraph;
        this.getCachingValue().then(() => {
            btParams['enableQueryCaching'] = this._ddrModelService.enableQueryCaching;
        });

        if (sessionStorage.getItem("isMultiDCMode") == "true") {

            var dcArr = this._dataHandlerService.$tierStatusData.nodeInfo.filter(e => e.actualTierName == this._dataHandlerService.$selectedNode);
            if (dcArr.length > 0)
                dcName = dcArr[0].dc.split(",")[0]
            else {
                let nodeInfoArr = this._dataHandlerService.$tierStatusData.nodeInfo;
                for (var i = 0; i < nodeInfoArr.length; i++) {
                    var actTierArr = nodeInfoArr[i].actualTierName.split(",");
                    for (var j = 0; j < actTierArr.length; j++) {
                        if (actTierArr[j] == this._dataHandlerService.$selectedNode)
                            dcName = nodeInfoArr[i].dc.split(",")[0];                       
                    }
                    if(dcName)
                    break;
                }
            }

            if (this._dataHandlerService.$isStoreView)
              dcName = this._cavConfig.$eDParam.dcName;

            console.log("right panel DC name of slected node: " + dcName);
               
            btParams['dcName'] = dcName;
            btParams['testRun'] = this._ddrModelService.testRun;
            btParams['vectorName'] = this._dataHandlerService.selectedNode.split(".")[1];
            btParams['dcPort'] = this._ddrModelService.port;
            console.log("BT Trend DC name of slected node: " + dcName);

            if (this._cavConfig.getActiveDC().toLowerCase() === "all" && !this._cavConfig.$eDParam.fromStoreView ) {

                console.log("BT Trend: Inside all case: Tier list " + btParams['tierNameList']);
                //let tierNameArr = this._dataHandlerService.selectedNode.split(",");
                let dcArray=this._dataHandlerService.$tierStatusData.dcName.split(","); //getting all configured dcs
                console.log("BT Trend DC Array",dcArray )

                //To Remove DC Names from tier names in case of ALL
                for(let j=0; j<dcArray.length; j++){
                    var re = new RegExp(dcArray[j]+".", 'g');
                    btParams['tierNameList']=btParams['tierNameList'].replace(re,"");
                    console.log("replaced BT Param list",btParams['tierNameList']);
                }
                //if (this._commonHandler.flowMapMode != '2')
                  //  btParams['tierNameList'] = tierNameArr.join(",");
            }
                btParams['vectorName'] = btParams['tierNameList'];

            
               this._ddrModelService.dcName = dcName;
//               this.cavNavBar.setDDRArguments(dcName, true);
        }
        if (this._commonHandler.flowMapMode == '2') {
            var data = this._dataHandlerService.$selectedTierData;
            let arr = data.reqVectorName.split('>');
            console.log("menu handler Instance level, tierName>serverName>appName: ", arr[0] + ">" + arr[1] + ">" + arr[2])
            console.log("right panel Instance level, tierName>serverName>appName: ", data.reqVectorName);
            btParams['vectorName'] = data.reqVectorName;
            btParams['tierNameList'] = arr[0];
            btParams['serverName'] = arr[1];
            btParams['appName'] = arr[2];
        }
        console.log("BTParams  ----->   ", btParams);
        return btParams;
    }


    // get enableQueryCaching value
    getCachingValue() {

        console.log("this._ddrData.enableQueryCaching****>>", this._ddrModelService.enableQueryCaching);
        return new Promise((resolve, reject) => {
            let product = sessionStorage.getItem("productType")
            if (!product)
                product = "netdiagnostics";
            // let ip = this._config.$getHostUrl;
            // if (ip.endsWith("/"))
            //     ip = ip.substring(0, ip.lastIndexOf("/"));

            console.log("this._ddrData.enableQueryCaching*********", this._ddrModelService.enableQueryCaching);
            console.log("this._config.$actTimePeriod***********", this._config.$actTimePeriod);
            if (!this._config.$actTimePeriod.startsWith("Last_")) {
                if (!this._ddrModelService.enableQueryCaching) {
                    let url = this._ddrModelService.getHostUrl() + "/" + product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/enableQueryCaching"
                    this._ddrModelService.getDataInStringUsingGet(url).subscribe(data => {
                        this._ddrModelService.enableQueryCaching = Number(data);
//                        resolve();
                    });
                } 
                // else {
                //     resolve();
                // }
            } else {
                this._ddrModelService.enableQueryCaching = 0;
                // resolve();
            }
        });
    }

    //TODO: handling multidc
    //setter getters
    public set $behaviorData(value: any) {
        this.behaviorData = value;
    }
    public get $behaviorData() {
        return this.behaviorData;
    }
    public set $capacityData(value: any) {
        this.capacityData = value;
    }
    public get $capacityData() {
        return this.capacityData;
    }
    public set $alertWindow(value: boolean) {
        this.alertWindow = value;
    }
    public get $alertWindow() {
        return this.alertWindow;
    }
    public set $alertLabel(value: string) {
        this.alertLabel = value;
    }
    public get $alertLabel() {
        return this.alertLabel;
    }
    public set $alertDataSubject(value: any) {
        this.alertDataSubject = value;
    }
    public get $alertDataSubject() {
        return this.alertDataSubject;
    }
    // getItems(ids: number[]): Observable<Object> {
    //     return from(ids).pipe(
    //         mergeMap((id, index) => {
    //             if (index === 0) {
    //                 return <Observable<Object>>this.httpClient.get(`${id}`).pipe(delay(2500));
    //             }
    //             return <Observable<Object>>this.httpClient.get(`${id}`);
    //             ) 
    //     );
    // }
    resetDDRArguments() {
        this._ddrModelService.resetDDRArguments();
        /*  this._ddrModelService.ndSessionId = undefined;
          this._ddrModelService.nvPageId = undefined;
          this._ddrModelService.nvSessionId = undefined;
          this._ddrModelService.urlParam = undefined;
          this._ddrModelService.flowpathID = undefined;
          this._ddrModelService.isFromNV = '0'; //nv flag off
          this._ddrModelService.urlName = undefined;
          this._ddrModelService.btCategory = undefined;
          this._ddrModelService.mode = undefined;
          this._ddrModelService.backendId = undefined;
          this._ddrModelService.correlationId = undefined; */
    }
}
