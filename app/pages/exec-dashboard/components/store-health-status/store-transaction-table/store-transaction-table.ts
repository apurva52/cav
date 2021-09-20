import { ExecDashboardUtil } from './../../../utils/exec-dashboard-util';
import { ExecDashboardDataContainerService } from './../../../services/exec-dashboard-data-container.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { ExecDashboardGraphicalKpiService } from '../../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardStoreTransactionHandlerService } from '../../../services/exec-dashboard-store-transaction-handler.service';
import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { ExecDashboardDownloadService } from './../../../services/exec-dashboard-download.service';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
@Component({
    selector: 'app-store-transaction-table',
    templateUrl: './store-transaction-table.html',
    styleUrls: ['./store-transaction-table.css']
})
export class StoreTransactionTable implements OnInit, OnDestroy {
    table2Arr: any[] = [];
    totalCount = 0;
    storeType;
    appType;
    routeParam: any;
    showAlerts: boolean = true;
    showBackArrow: boolean =true;
    aliasSV: string = "Store View";
    constructor(private _navService: CavTopPanelNavigationService,
        private router: Router,
        private _dataContainerService: ExecDashboardDataContainerService,
        public _graphicalKPIService: ExecDashboardGraphicalKpiService,
        private _cavConfig: CavConfigService,
        public _transactionHandler: ExecDashboardStoreTransactionHandlerService,
        private _activeRoute: ActivatedRoute,
        public _config: ExecDashboardConfigService,
        public _downloadService: ExecDashboardDownloadService) {
        this.routeParam = this._activeRoute.params.subscribe(params => {
            console.log(params);
            if (params && params['type']) {
                if (params['type'].toLowerCase().indexOf('bad') !== -1) {
                    this.storeType = 'Bad Stores';
                } else if (params['type'].toLowerCase().indexOf('good') !== -1) {
                    this.storeType = 'Good Stores';
                    this.showAlerts = false;
                }
            }else{
                if(sessionStorage.getItem("storeType").toLowerCase().includes("good")){
                    this.storeType = 'Good Stores';
                    this.showAlerts = false;
                }                
                else if(sessionStorage.getItem("storeType").toLowerCase().includes("bad")){
                    this.storeType = 'Bad Stores';
                }
            }
            this.appType = this._dataContainerService.$selectedGeoApp
        });
    }

    ngOnInit() {
        this._cavConfig.showAppView = true;
        this.table2Arr = this._dataContainerService.$storeTransactionTableData;
        console.log("Store type: ", sessionStorage.getItem("storeType"));
        this._transactionHandler.getGoodBadStoreData(sessionStorage.getItem("storeType"), (data) => {
            console.log('inside store transaction table ');
	    if(data == ""){
                this.table2Arr = [];
                this.totalCount = 0;
            }
            this.table2Arr = data;
            if (this.table2Arr.length > 0) {
                this.totalCount = this.table2Arr.length;
            }
        });
    }

    ngOnDestroy() {
        this._dataContainerService.$storeTransactionTableData = [];
        this._cavConfig.showAppView = false;
        this.routeParam.unsubscribe();
    }

    openDashboard(tableData, event) {
        console.log('openDashboard called  ------------- ' + this._dataContainerService.$selectedGeoApp);
        console.log(event);
        console.log(tableData);
        console.log(this._dataContainerService.$MultiDCsArr);
        console.log(this._dataContainerService.$isAllDCs);
        // var dcName = (rowObj.dcName == undefined || rowObj.dcName == '') ? this._config.getActiveDC() : rowObj.dcName;
        let disableDashboard = false;
        let dcName = '';
        if (tableData['dc']) {
            console.log("dcName available in table data ");
            dcName = tableData['dc']
        } else {
            dcName = this._dataContainerService.$MultiDCsArr[0]
        }
        // console.log("dcName ---- ", dcName);
        disableDashboard = this._transactionHandler.disableDashboard(dcName);
        // console.log("disableDashboard ------  " + disableDashboard);
        if (disableDashboard) {
            alert("Dashboard is not setup in multiDC mode.\n Please configure to open dashboard");
            return;
        }
        // if (this._dataContainerService.$MultiDCsArr.length > 0) {
        //    if (this._dataContainerService.$isAllDCs) {
        //        this._cavConfig.isFromEDTransactionTable['dataCenter'] = 'All';
        //    } else {
        //        this._cavConfig.isFromEDTransactionTable['dataCenter'] = this._dataContainerService.$MultiDCsArr[0];
        //    }
        // }
        this._cavConfig.isFromEDTransactionTable['dataCenter'] = dcName;
        this._cavConfig.isFromEDTransactionTable['flag'] = true;
        this._cavConfig.isFromEDTransactionTable['storeName'] = tableData.storeName;
        this._cavConfig.isFromEDTransactionTable['tierName'] = tableData.tierName;
        // console.log("inside openDashboard  ----> ");
        // console.log(this._cavConfig.isFromEDTransactionTable);
        this._cavConfig.setActiveDC(dcName);
        sessionStorage.setItem('activeDC', dcName);
        // sessionStorage.setItem("isAllDCs", 'false')
        // sessionStorage.setItem("MultiDCsArr", "");
        this._navService.addNewNaviationLink('dashboard');
        this._navService.addDCNameForScreen('dashboard', dcName);
        this.router.navigate(['/home/dashboard']);
    }
    /**
     * This method is use to download store transaction table for Good bad store
     * based on its type: pdf, word and excel;
     * @param fileType
     */
    onDownload(fileType) {
        try {
            let tableHeader = [];
            if (this.showAlerts) {
                tableHeader = ['Store Name', 'Critical', 'Major', 'Response Time(ms)', 'PVS', 'Error(%)']
            }
            else {
                tableHeader = ['Store Name', 'Response Time(ms)', 'PVS', 'Error(%)']
            }
            let tempObj = [];
            tempObj.push(tableHeader);
            this.table2Arr.forEach(element => {
                let rowArr = [];
                if (this.showAlerts)
                    rowArr.push(element.storeName, element.critical, element.major, ExecDashboardUtil.numberFormatWithDecimal(element.resTime, 3), ExecDashboardUtil.numberFormatWithDecimal(element.pvs, 3), element.error);
                else {
                    rowArr.push(element.storeName, ExecDashboardUtil.numberFormatWithDecimal(element.resTime, 3), ExecDashboardUtil.numberFormatWithDecimal(element.pvs, 3), element.error);
                }
                tempObj.push(rowArr);
            });
           this._downloadService.commonDownload(fileType, this._dataContainerService.$goodBadStore + ' = ' + this.totalCount + ' , App Name = ' + this._dataContainerService.selectedGeoApp, '_StoreView' + '_', '', [tempObj], 'Executive Dashboard- Store View');
        }
        catch (e) {
            console.log('Getting error inside StoreTransactionTable onDownload()', e)
        }
    }
    onButtonClick(){
        console.log("Back button clicked");
        // this._navService.addNewNaviationLink('dashboard');
        this.router.navigate(['/home/execDashboard/main/storeView']);
    }

}
