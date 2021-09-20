import { Injectable } from '@angular/core';
import { ExecDashboardDataContainerService } from './exec-dashboard-data-container.service';
import { ExecDashboardCommonRequestHandler } from './exec-dashboard-common-request-handler.service';
import { ExecDashboardConfigService } from './exec-dashboard-config.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { ExecDashboardAlertSeverity } from '../interfaces/exec-dashboard-alert-severity';
import { ExecDashboardGraphicalKpiService } from './exec-dashboard-graphical-kpi.service'
import { HttpClient } from '@angular/common/http';
//import { CavNavBarComponent } from './../../../main/components/cav-nav-bar/cav-nav-bar.component';
import { CavConfigService } from '../../tools/configuration/nd-config/services/cav-config.service';
import { AlertConfigService } from '../../tools/configuration/nd-config/services/alert-config-service';
import { CavTopPanelNavigationService } from '../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { DdrDataModelService } from '../../tools/actions/dumps/service/ddr-data-model.service';


@Injectable()
export class ExecDashboardStoreTransactionHandlerService {


    private _geoTransTableData: any = [];
    private _tierListForSelectedApp: any = [];
    private _ip: string;
    private _port: string;
    public showScroller: boolean = false;
    private showDBPanel: boolean = false;
    private dbArr = [];
    constructor(private _dataContainer: ExecDashboardDataContainerService,
        private _requestHandler: ExecDashboardCommonRequestHandler,
        private _config: ExecDashboardConfigService,
        private _ddrModelService: DdrDataModelService,
        private router: Router,
        private _alertConfigService: AlertConfigService,
        private _navService: CavTopPanelNavigationService,
        private _graphicalService: ExecDashboardGraphicalKpiService,
        private _cavConfig: CavConfigService,
        private http: HttpClient,
//        private cavNavBar: CavNavBarComponent
        ) {

    }

    set geoTransTableData(value: any) {
        this._geoTransTableData = value;
    }


    get geoTransTableData() {
        return this._geoTransTableData;
    }

    set tierListForSelectedApp(value: any) {
        this._tierListForSelectedApp = value;
    }

    get tierListForSelectedApp() {
        return this._tierListForSelectedApp;
    }

    get ip() {
        return this._ip;
    }

    get port() {
        return this._port;
    }

    createGeoTransTableData() {
        console.log('createGeoTransTableData called ');
        console.log(this._dataContainer.$storeData);
        console.log(this._dataContainer.$appWindowData);
        console.log(JSON.stringify(this._dataContainer.$storeData));
        try {

        } catch (error) {
            console.error('error in createGeoTransTableData ');
            console.log(error);
        }
    }

    handleBTTrendWindow() {
        // http://66.220.31.137/DashboardServer/RestService/KPIWebService/storeInfo?
        // requestType=geoMapStoreList
        // &storeAlertType=0&reqTestRunNum=11111&GRAPH_KEY=&appliedTimePeriodStr=Last%201%20Hour
        // &alertSevType=2

        this._tierListForSelectedApp = [];

        let timeObject = this._graphicalService.getGraphTimeObject();
        let tempTR = sessionStorage.getItem('runningtest');
        let tempServerName = 'DashboardServer';
        let tempDCObject;
        let tempUrl;
        let dcName = '';
        let isMultiDC = false;
        let isAll = 'ALL'
        if (this._dataContainer.$MultiDCsArr.length > 0) {
            let tempDCName;
            if (this._dataContainer.$MultiDCsArr.length == 1) {
                tempDCName = this._dataContainer.$MultiDCsArr;
                isAll = tempDCName;
            }
            else {
                tempDCName = 'All';
            }
            isMultiDC = true;
            tempDCObject = this._config.getDCObject(tempDCName);
            tempServerName = tempDCObject['server'];
            dcName = tempDCObject['dcName'];
            tempTR = tempDCObject['testRunNo'];
            tempUrl = tempDCObject['protocol'] + '//' + tempDCObject['dataCenterIP'] + ':' + tempDCObject['port'] + '/'
        } else {
            tempUrl = this._config.$getHostUrl;
            tempTR = sessionStorage.getItem('runningtest');
        }



        console.log("this.datacontainer.$storeAlertType " + this._dataContainer.$storeAlertType);
        let url = this._config.getNodePresetURL(dcName.split(","));
        url = url + tempServerName + `/RestService/KPIWebService/storeInfo`
            + `?requestType=geoMapStoreList&storeAlertType=${this._dataContainer.$storeAlertType}&reqTestRunNum=${tempTR}` +
            `&GRAPH_KEY=&appliedTimePeriodStr=${timeObject['graphTimeLabel']}&appName=${this._dataContainer.$selectedGeoApp}` +
            `&dcName=${dcName}&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`

        if (isMultiDC)
            url = url + '&isAll=' + isAll;

        this._requestHandler.getDataFromGetRequest(url, (data) => {
            console.log('data ---- ');
            console.log(data);
            if (!data['geoStoreDTO']['appTierListMap']) {
                console.error("Tier list is not available for BT Trend");
            }
            else {
                console.log("dcName ----  " + dcName);

                if (dcName == '') {
                    console.log("dcName is null ");
                    this._tierListForSelectedApp = data['geoStoreDTO']['appTierListMap']["null"];
                } else {
                    let keys = Object.keys(data['geoStoreDTO']['appTierListMap']);
                    console.log("keys ------------------  ");
                    console.log(keys);
                    for (let i = 0; i < keys.length; i++) {
                        console.log("keys[i] -----> " + keys[i]);
                        if (keys[i] === "null") {
                            console.log("null check ----> ")
                            this._tierListForSelectedApp = data['geoStoreDTO']['appTierListMap']["null"];
                        }
                        else if (keys.length === 1) {
                            console.log("keys length is one ");
                            let tempArr = data['geoStoreDTO']['appTierListMap'][keys[i]];
                            this._tierListForSelectedApp = tempArr;
                        }
                        else {
                            console.log(" multiple check ----> ")
                            let tempArr = data['geoStoreDTO']['appTierListMap'][keys[i]];
                            let tierList = tempArr.map(e => keys[i] + "." + e);
                            this._tierListForSelectedApp = [...this._tierListForSelectedApp, ...tierList];
                        }
                    }

                }
            }
            console.log("_tierListForSelectedApp final ----> ");
            console.log(this._tierListForSelectedApp);
            this.getIPnPortFromHost();
            this._ddrModelService.btTrendParamFromStoreView = this.createBTParams();
            let product = sessionStorage.getItem("productType")
            if (!product)
                product = "netdiagnostics";
            let ip = this._config.$getHostUrl;
            if (ip.endsWith("/"))
                ip = ip.substring(0, ip.lastIndexOf("/"));
           let fetchUrl;
            if(sessionStorage.getItem("isMultiDCMode")=="true")
             fetchUrl = this._ddrModelService.getHostUrl() +'/'+ product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/bTRequestType";
            else
             fetchUrl = this._ddrModelService.getHostUrl() + "/" + product.replace("/", "") + "/v1/cavisson/netdiagnostics/webddr/bTRequestType";
            this.http.get(fetchUrl).subscribe((data:any) => {
                this._ddrModelService.BtRequestType = data;
                this._navService.addNewNaviationLink('ddr');
                this._ddrModelService.setInLogger('Store View::DDR','Bt Trend','Open Bt trend Report');
                this.router.navigate(['/home/ddr/DdrBtTrendComponent']);
                console.log('callliiinggg')
            },
                error => {
                    this._ddrModelService.BtRequestType = 2;
                    this._navService.addNewNaviationLink('ddr');
                    this._ddrModelService.setInLogger('Store View::DDR','Bt Trend','Open Bt trend Report');
                    this.router.navigate(['/home/ddr/DdrBtTrendComponent']);
                });
        });
    }

    createBTParams() {
        // sessionStorage.getItem('runningtest');
        // this._dataContainer.$isAllDCs
        // if (DCIndexOfAll > -1)
        //   dcArr.splice(DCIndexOfAll, 1);
        let timeObject = this._graphicalService.getGraphTimeObject();
        let btParams = {};
        btParams['vectorName'] = this._tierListForSelectedApp.toString();
        btParams['tierNameList'] = this._tierListForSelectedApp.toString();
        btParams['strGraphKey'] = timeObject['graphTime'];
        // btParams['testRun'] = '11111';
        btParams['testRun'] = sessionStorage.getItem('runningtest');
        btParams['dcPort'] = this._port;
        btParams['dcIP'] = this._ip;
        btParams['strStartTime'] = timeObject['startTime'];
        btParams['strEndTime'] = timeObject['endTime'];
        btParams['eventDay'] = timeObject['strSpecialDay'];
        // btParams['product'] = 'netdiagnostics';
        btParams['product'] = sessionStorage.getItem('productType'); // 'netdiagnostics';
        btParams['btCategory'] = 'All';

        if (this._dataContainer.$MultiDCsArr.length > 0) {
            if (this._dataContainer.$isAllDCs) {
                //btParams['dcNameList'] = this._dataContainer.$MultiDCsArr.filter(e => e != "All").toString();
                //btParams['dcName'] = 'ALL';
                btParams['dcName'] = this._dataContainer.$MultiDCsArr[0];
                this._ddrModelService.dcName=btParams['dcName'];

                let tierNameArr = btParams['vectorName'].split(",");

                //To Remove DC Names from tier names in case of ALL
                for (let i = 0; i < tierNameArr.length; i++) {
                    var firstIndex = tierNameArr[i].indexOf('.');
                    tierNameArr[i] = tierNameArr[i].substr(firstIndex + 1);
                    console.log(tierNameArr[i]);
                }
                btParams['vectorName'] = tierNameArr.join(",");
            }
            else {
                //btParams['dcNameList'] = this._dataContainer.$MultiDCsArr[0];
                btParams['dcName'] = this._dataContainer.$MultiDCsArr[0];
                this._ddrModelService.dcName=btParams['dcName'];
            }


        } else {
            btParams['dcNameList'] = '';
            btParams['dcName'] = '';
        }

        //if(btParams['dcNameList'])
       // this.cavNavBar.setDDRArguments(btParams['dcName'], true);
        //this.cavNavBar.setDDRArguments(btParams['dcNameList'].split(",")[0], true);+

        console.log("BTParams  ----->   ");
        console.log(btParams);
        console.log(JSON.stringify(btParams));
        return btParams;
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


    getTop10Transactions(callback) {

        var timeObject = this._graphicalService.getGraphTimeObject();
        let tempTR = sessionStorage.getItem("runningtest");
        let tempServerName = 'DashboardServer';
        let tempDCObject;
        let tempUrl;
        let dcName = '';
        let isMultiDC = false;
        let isAll = 'ALL'
        if (this._dataContainer.$MultiDCsArr.length > 0) {
            let tempDCName;
            if (this._dataContainer.$MultiDCsArr.length == 1) {
                tempDCName = this._dataContainer.$MultiDCsArr;
                isAll = tempDCName;
            }
            else {
                tempDCName = 'All';
            }
            isMultiDC = true;
            tempDCObject = this._config.getDCObject(tempDCName);
            tempServerName = tempDCObject['server'];
            dcName = tempDCObject['dcName'];
            tempTR = tempDCObject['testRunNo'];
            tempUrl = tempDCObject['protocol'] + '//' + tempDCObject['dataCenterIP'] + ':' + tempDCObject['port'] + '/'
        } else {
            tempUrl = this._config.$getHostUrl;
        }
        let url = this._config.getNodePresetURL(dcName.split(","));
        url = url + tempServerName + "/RestService/KPIWebService/storeInfo?requestType=storeTopTrans&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + tempTR + "&GRAPH_KEY=&appliedTimePeriodStr=" + timeObject["graphTimeLabel"] + "&appName=" + this._dataContainer.$selectedGeoApp + '&dcName=' + dcName
            + `&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
        if (isMultiDC)
            url = url + '&isAll=' + isAll;

        this._requestHandler.getDataFromGetRequest(url, (data) => {
            let dataArr: any[] = [];
            let btName: string = 'No data available';
            let tps: number = 0;
            let avgResponse: number = 0;
            if (data && data.btTableData) {
                let dataArr: any[] = [];
                let btName: string = '';
                let tps: number = 0;
                let avgResponse: number = 0;
                if (data.btTableData.edTierNodeList) {
                    for (let x of data.btTableData.edTierNodeList) {
                        for (let y of x.data) {
                            btName = y.btName;
                            tps = y.TPS;
                            avgResponse = y.RES;
                            dataArr.push({ btName, tps, avgResponse });
                        }
                    }
                }
                else
                    callback([{ btName, tps, avgResponse }])
                callback(dataArr);
            }
            else {
                callback([{ btName, tps, avgResponse }])
            }
        });
    }


    getGoodBadStoreData(storeType, cb) {

        console.log('getGoodBadStoreData  called  ----  ');
        console.log(this._dataContainer.$MultiDCsArr);
        let tempTR = sessionStorage.getItem("runningtest")
        let timeObject = this._graphicalService.getGraphTimeObject();
        let isGoodStore = 0;
        if (storeType == "Total Good Stores") {
            // alert(storeType);
            isGoodStore = 0
        }
        else {
            // alert(storeType);
            isGoodStore = 1
        }
        let url = this._config.getNodePresetURL() + "DashboardServer/RestService/KPIWebService/storeInfo?requestType=goodBadStrInfo&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + tempTR + "&GRAPH_KEY=&appliedTimePeriodStr=" + timeObject["graphTimeLabel"] + "&isGoodStore=" + isGoodStore + "&appName=" + this._dataContainer.$selectedGeoApp
            + `&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
        if (this._dataContainer.$MultiDCsArr.length > 0) {
            let tempDCName = '';
            let isAll = 'ALL';
            if (this._dataContainer.$MultiDCsArr.length == 1) {
                tempDCName = this._dataContainer.$MultiDCsArr;
                isAll = tempDCName;
            }
            else {
                tempDCName = 'All';
            }

            let tempDCObject = this._config.getDCObject(tempDCName);
            tempTR = tempDCObject["testRunNo"];
            url = this._config.getNodePresetURL(tempDCObject['dcName'].split(",")) + tempDCObject['server']
                + "/RestService/KPIWebService/storeInfo?requestType=goodBadStrInfo&storeAlertType=" + this._dataContainer.storeAlertType + "&reqTestRunNum=" + tempTR + "&GRAPH_KEY=&appliedTimePeriodStr=" + timeObject["graphTimeLabel"] + "&isGoodStore="
                + isGoodStore + "&appName=" + this._dataContainer.$selectedGeoApp + "&dcName=" + tempDCObject['dcName'] + "&isAll=" + isAll
                + `&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
        }

        this.showScroller = true;
        this._requestHandler.getDataFromGetRequest(url, (data) => {
            if (data) {
                this.showScroller = false;
                if (data.geoStoreDTO == null) {
                    cb("");
                }
                let tempData = data.geoStoreDTO.storeInfoList;
                let tableDataArr: any[] = [];
                if (tempData) {
                    for (let val of tempData) {

                        let disableDashboard = false;
                        let dcName = '';
                        if (val.dc) {
                            dcName = val.dc
                        } else {
                            dcName = this._dataContainer.$MultiDCsArr[0]
                        }
                        disableDashboard = this.disableDashboard(dcName);

                        tableDataArr.push({
                            storeName: val.storeName,
                            critical: val.critical,
                            major: val.major + val.minor,
                            error: val.eps,
                            pvs: val.tps,
                            resTime: val.res,
                            tierName: val.tierName,
                            dc: val.dc,
                            disableDash: disableDashboard
                        });
                    }
                    this._dataContainer.$storeTransactionTableData = tableDataArr;
                    cb(tableDataArr);
                }
            }
            this.showScroller = false;
        });
    }

    getAlertDataBasedOnSeverity(severity, rowData, index) {
        let severityArr: any[] = [];
        let severityArrForCall: any[] = []
        //if severity is Major pass 1,2 else pass 3
        if (severity == 'MAJOR') {
            severityArr.push(...[ExecDashboardAlertSeverity[severity], ExecDashboardAlertSeverity.MINOR]);
            severityArrForCall.push(...[ExecDashboardAlertSeverity[severity], ExecDashboardAlertSeverity.MINOR])
        }
        else {
            severityArr.push(ExecDashboardAlertSeverity[severity])
            severityArrForCall.push(ExecDashboardAlertSeverity.ED_CRITICAL);
        }
        //in case of transaction table call severity is set as -1;
        severityArrForCall = [-1];
        if (rowData.operationValue[index] > 0)
            this.setDataForAlert(true, severityArr, severityArrForCall);
        else
            this._graphicalService.showMessageGrowl('error', 'Error Message', 'No alert available');
    }

    setDataForAlert(isEd: boolean, severityArr, severityArrForCall) {
        console.log('inside setDataForAlert severityArrForCall = ', severityArrForCall, severityArrForCall.toString());
        this._alertConfigService.$callFromED = isEd;
        this._alertConfigService.$severityFromED = severityArr;
        sessionStorage.setItem('severityFromED', JSON.stringify(severityArr));
        sessionStorage.setItem('callFromED', JSON.stringify(isEd));
        let timeObject = this._graphicalService.getGraphTimeObject();
        let tempTR = sessionStorage.getItem("runningtest");
        let tempServerName = 'DashboardServer';
        let tempDCObject;
        let tempUrl;
        let dcName = '';
        let isMultiUrl = false;
        let isAll = 'ALL'
        if (this._dataContainer.$MultiDCsArr.length > 0) {
            let tempDCName;
            if (this._dataContainer.$MultiDCsArr.length == 1) {
                tempDCName = this._dataContainer.$MultiDCsArr;
                isAll = tempDCName;
            }
            else {
                tempDCName = 'All';
            }
            isMultiUrl = true
            tempDCObject = this._config.getDCObject(tempDCName);
            tempServerName = tempDCObject['server'];
            dcName = tempDCObject['dcName'];
            tempTR = tempDCObject['testRunNo'];
            tempUrl = tempDCObject['protocol'] + '//' + tempDCObject['dataCenterIP'] + ':' + tempDCObject['port'] + '/'
        } else {
            tempUrl = this._config.$getHostUrl;
        }
        let url = this._config.getNodePresetURL(dcName.split(",")) + tempServerName + `/RestService/KPIWebService/storeInfo?requestType=geoMapStoreList&storeAlertType=${this._dataContainer.$storeAlertType}&reqTestRunNum=${tempTR}&GRAPH_KEY=&appliedTimePeriodStr=${timeObject["graphTimeLabel"]}&alertSevType=${severityArrForCall}&appName=${this._dataContainer.$selectedGeoApp}&dcName=${dcName}`
            + `&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
        if (isMultiUrl)
            url = url + '&isAll=' + isAll
        this._requestHandler.getDataFromGetRequest(url, (data) => {
            if (data && data.geoStoreDTO) {
                if (data.geoStoreDTO.hasOwnProperty('appTierListMap') && data.geoStoreDTO.appTierListMap) {
                    let tierList = data.geoStoreDTO.appTierListMap;
                    if (Object.keys(tierList).length > 0) {
                        /**
                         * if node is disabled and ed is in multidc i.e datacenterprop is enabled, then
                         * user can only see alert of current dc, else error message should be invoked
                         */
                        if (!sessionStorage.getItem('isMultiDCMode') && this._dataContainer.$DCsInfo && Object.keys(this._dataContainer.$DCsInfo).length > 0) {
                            if (this._dataContainer.$MultiDCsArr.length == 1) {
                                if (Object.keys(this._dataContainer.$DCsInfo)[0] != this._dataContainer.$MultiDCsArr[0]) {
                                    this._graphicalService.showMessageGrowl('error', 'Error Message', 'Node is disabled can not open alert for ED with multiDC');
                                    return;
                                }
                                else {
                                    tierList = Object.assign({}, { 'null': tierList[Object.keys(tierList)[0]] });
                                }
                            }
                            else {
                                this._graphicalService.showMessageGrowl('error', 'Error Message', 'Node is disabled can not open alert for ED with multiDC');
                                return;
                            }
                        }
                        sessionStorage.setItem("moduleName", "active");
                        this._alertConfigService.$storeNameFromED = tierList;
                        sessionStorage.setItem('storeNameFromED', JSON.stringify(tierList));
                        /* disabling this in case if webdashboard had been opened from store view previously */
                        this._cavConfig.isFromEDTransactionTable['flag'] = false;
                        this._navService.addNewNaviationLink('alert');
                        this._navService.activateNavigationLink('alert');
                        sessionStorage.setItem('activeDC', sessionStorage.getItem('activeDC'));
                        this._cavConfig.setActiveDC(sessionStorage.getItem('activeDC'));
                        this._navService.addDCNameForScreen("alert", sessionStorage.getItem('activeDC'));
                        this.router.navigate(['/home/alert/active']);
                    }
                    else {
                        sessionStorage.setItem('storeNameFromED', JSON.stringify({}));
                        this._alertConfigService.$storeNameFromED = {};
                    }
                    console.log('data for alert');
                    console.log(severityArr);
                    console.log(tierList);
                }
            }
        });
    }
    /**
     * @param rowData 
     * Method to open alert for specific tier by appending current front end tier of selected app.
     */
    openAlertForSelectedStore(rowData, alertType) {
        try {
            let map = {};
            let dcName: string = 'null';
            let alertSeverity: any[] = [];
            let tierList: any[] = [];
            /*
            * if node is disabled and ed is in multidc i.e datacenterprop is enabled, then
            * user can only see alert of current dc, else error message should be invoked
            */
            if (!sessionStorage.getItem('isMultiDCMode') && this._dataContainer.$DCsInfo && Object.keys(this._dataContainer.$DCsInfo).length > 0) {
                if (Object.keys(this._dataContainer.$DCsInfo)[0] != rowData.dc) {
                    this._graphicalService.showMessageGrowl('error', 'Error Message', 'Node is disabled can not open alert for ED with multiDC');
                    return;
                }
            }
            else if (sessionStorage.getItem('isMultiDCMode') && Object.keys(this._dataContainer.$DCsInfo).length > 0) {
                dcName = rowData.dc;
            }
            if (alertType == 'critical') {
                alertSeverity.push(ExecDashboardAlertSeverity.CRITICAL);
            }
            else if (alertType == 'major') {
                alertSeverity.push(...[ExecDashboardAlertSeverity.MAJOR, ExecDashboardAlertSeverity.MINOR]);
            }
            else if (alertType == 'minor') {
                alertSeverity.push(...[ExecDashboardAlertSeverity.MINOR]);
            }
            else {
                alertSeverity.push(...[ExecDashboardAlertSeverity.CRITICAL, ExecDashboardAlertSeverity.MAJOR, ExecDashboardAlertSeverity.MINOR]);
            }
            tierList.push(rowData.storeName + '!' + rowData.tierName);
            map[dcName] = tierList;
            console.log('map of good and bad stores---', map);
            console.log('severity---', alertSeverity);
            sessionStorage.setItem("moduleName", "active");
            this._alertConfigService.$callFromED = true;
            this._alertConfigService.$severityFromED = alertSeverity;
            sessionStorage.setItem('severityFromED', JSON.stringify(alertSeverity));
            sessionStorage.setItem('callFromED', "true");
            this._alertConfigService.$storeNameFromED = map;
            sessionStorage.setItem('storeNameFromED', JSON.stringify(map));
            /* disabling this in case if webdashboard had been opened from store view previously */
            this._cavConfig.isFromEDTransactionTable['flag'] = false;
            this._navService.addNewNaviationLink('alert');
            this._navService.activateNavigationLink('alert');
            sessionStorage.setItem('activeDC', dcName);
            this._cavConfig.setActiveDC(dcName);
            this._navService.addDCNameForScreen("alert", dcName);
            this.router.navigate(['/home/alert/active']);

        } catch (error) {
            console.log('getting error inside openAlertForSelectedStore()');
        }
    }

    disableDashboard(dcName?: any) {
        // this._dataContainer.$selectStoreData.data.dc;
        //console.log("desableDashboard called ---- ", dcName, this._dataContainer.$isAllDCs);
        // console.log(this._dataContainer.$DCsInfo);
        // console.log(sessionStorage.getItem('isMultiDCMode'))
        // console.log(this._cavConfig.getActiveDC().toLowerCase() === 'all')
        // console.log(this._dataContainer.$MultiDCsArr)
        let disableDasboard = false;
        let selectedDCname = ''
        try {
            if (dcName) {
                // from transaction table
                selectedDCname = dcName;
            }
            else {
                // from app view 
                // adding a check because in normal mode dc name is not available.
                if (this._dataContainer.$selectStoreData !== undefined) {
                    selectedDCname = this._dataContainer.$selectStoreData.data.dc;
                }
            }
            // console.log("selectedDCname  --- " + selectedDCname);
            // Inside  single dc mode.
            if (!sessionStorage.getItem('isMultiDCMode')) {
                // console.log("inside non multidc check ---- ")
                if (this._dataContainer.$MultiDCsArr.length > 0) {
                    if (this._dataContainer.$MultiDCsArr.length === 1) {
                        //       console.log("multidc lenth is one ");
                        if (Object.keys(this._dataContainer.$DCsInfo)[0] === selectedDCname) {
                            //         console.log("inside selected matched ");
                            disableDasboard = false;
                        }
                        else {
                            //       console.log("inside selected unmatched ");
                            disableDasboard = true;
                        }
                    } else {
                        // console.log("multidc lenth is more than one ");
                        disableDasboard = true;
                    }
                } else {
                    disableDasboard = false;
                }
            }
            // multiDC mode.
            else {
                if (this._cavConfig.getActiveDC().toLowerCase() === 'all') {
                    disableDasboard = false;
                } else {
                    // need to check for selected DC
                    if (this._dataContainer.$MultiDCsArr[0].toLowerCase() === this._cavConfig.getActiveDC().toLowerCase()) {
                        disableDasboard = false;
                    }
                    // it means selected dc of dropdown & activeDC are not matched.
                    else {
                        disableDasboard = true;
                    }
                }
            }
            // console.log("disable dashboard before returning ------- " + disableDasboard);
            return disableDasboard;
        } catch (error) {
            console.log("error in disableDashboard");
            console.log(error);
        }
    }

    /**
     * 
     * @param event method to get db data from server
     * @param app 
     * @param storeName 
     */
    getDbStatsFromServer(event, app, storeName) {
        try {
            event.stopPropagation();
            event.preventDefault();
            let timeObject = this._graphicalService.getGraphTimeObject();
            this.$showDBPanel = true;
            this._dataContainer.$selectedApp['name'] = app.appName;
            this._dataContainer.$selectedApp['dbAvailable'] = false;                
            let arr = [];
            let url = `${this._config.getNodePresetURL()}DashboardServer/RestService/KPIWebService/storeInfo?requestType=dbStats&storeName=${storeName}!${app.tierName}&appName=${app.appName}&storeAlertType=${this._dataContainer.$storeAlertType}&reqTestRunNum=${this._dataContainer.$storeData['trNum']}&GRAPH_KEY=&appliedTimePeriodStr=${timeObject['graphTimeLabel']}&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
            this._requestHandler.getDataFromGetRequest(url, (data) => {
                if (data && data['geoStoreDTO']['storeDBInfoList'].length > 0){
                    for (let key of data['geoStoreDTO']['storeDBInfoList']) {
                        let obj = {};
                        obj = key;
                        console.log(obj)
                        arr.push(obj);
                    }
                    this.$dbArr = arr;
                    this.$dbArr = [...this.$dbArr];
                    this.$showDBPanel = true;
                    this._dataContainer.$selectedApp['dbAvailable'] = true;
                }
                else {
                    this._dataContainer.$selectedApp['dbAvailable'] = false;                
                }
            })
        }
        catch (e) {
            console.log('getting error inside getDbStatsFromServer in ED', e);
        }
    }

    public set $showDBPanel(value: boolean) {
        this.showDBPanel = value;
    }

    public get $showDBPanel(): boolean {
        return this.showDBPanel;
    }
    public set $dbArr(value: any) {
        this.dbArr = value;
    }

    public get $dbArr(): any {
        return this.dbArr;
    }

}// end of file.
