import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ExecDashboardDataContainerService } from './../../../services/exec-dashboard-data-container.service';
import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { ExecDashboardGraphicalKpiService } from './../../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardAlertSeverity } from '../../../interfaces/exec-dashboard-alert-severity';
import { ExecDashboardStoreTransactionHandlerService } from '../../../services/exec-dashboard-store-transaction-handler.service';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { SqlQueryService } from 'src/app/pages/tools/configuration/nd-config/services/sql-query.service';
@Component({
  selector: 'app-app-level-view',
  templateUrl: './app-level-view.component.html',
  styleUrls: ['./app-level-view.component.css']
})
export class AppLevelViewComponent implements OnInit, OnDestroy {

  @Output() updateGeoMapTimer = new EventEmitter();
  //appInfoArr:any[] = [];
  appObj = {};
  // enableDB:any;
  constructor(public dataContainer: ExecDashboardDataContainerService, public _config: ExecDashboardConfigService,
    public _graphicalKpi: ExecDashboardGraphicalKpiService, private _navService: CavTopPanelNavigationService,
    private router: Router,
    private _cavConfig: CavConfigService,
    public _transactionHandler: ExecDashboardStoreTransactionHandlerService,
    private _sqlQueryService: SqlQueryService) { }

  ngOnInit() {
    this.updateGeoMapTimer.emit('StopUpdate');
    let jsonObj = this.dataContainer.$appWindowData;
    this._transactionHandler.$dbArr = [];
    this._transactionHandler.$showDBPanel = false;
    let severityArrForCall = [ExecDashboardAlertSeverity.ED_CRITICAL, ExecDashboardAlertSeverity.MINOR, ExecDashboardAlertSeverity.MAJOR]
    let severities: any[] = [ExecDashboardAlertSeverity.MINOR, ExecDashboardAlertSeverity.MAJOR, ExecDashboardAlertSeverity.CRITICAL];

    if (jsonObj && jsonObj.hasOwnProperty('geoStoreDTO') && jsonObj['geoStoreDTO'].hasOwnProperty('appInfoList')) {
      this.appObj = jsonObj['geoStoreDTO'];
      if (this.appObj['appInfoList']) {
        let appInfoList = this.appObj['appInfoList'];
        for (let val in appInfoList) {
          let disabledAlert = true;
          let showDB = true;

          let major = (appInfoList[val].major ? appInfoList[val].major : 0) + (appInfoList[val].minor ? appInfoList[val].minor : 0);
          if ((major == 0) && (appInfoList[val].critical == 0)) {
            disabledAlert = true;
          }
          else {
            disabledAlert = false;
          }
          appInfoList[val]['disabledAlert'] = disabledAlert;
          appInfoList[val]['showDB'] = showDB;
	  appInfoList[val]['disabledDashboard'] = this._transactionHandler.disableDashboard();
        }
      }
      this.appObj['storeName'] = '';
    }

  }

  /* Opening exec dashboard*/
  openExecDashboard(appName, storeName) {
    let dcName = this.dataContainer.$selectStoreData.data.dc;
    let url = "";
    let gTObject = this._graphicalKpi.getGraphTimeObject();

    let host = (sessionStorage.getItem('isMultiDCMode')) ? this._graphicalKpi.getHostIPForMultiDC() : this._config.$getHostUrl;
    if (sessionStorage.enableTierStatus == "1" || sessionStorage.enableTierStatus == "true") {
      this._cavConfig.$eDParam = {
        testRun: this.dataContainer.$storeData['trNum'],
        graphKey: gTObject['graphTime'],
        graphKeyLabel: gTObject['graphTimeLabel'],
        startTime: undefined,
        endTime: undefined,
        isAllDC: this._cavConfig.getActiveDC().toLowerCase() == "all",
        multidc_mode: sessionStorage.isMultiDCMode == "true",
        dcName: dcName?dcName:"",
        host: host,
        isDiscontGraph: this._graphicalKpi.graphTime.$chkIncludeDiscontineGraph,
        appName: appName,
        storeName: storeName,
        storeAlertType: this.dataContainer.$storeAlertType,
        ofn: true,
        strSpecialDay: gTObject['strSpecialDay'],
        fromStoreView: true
      }
      this._navService.addDCNameForScreen('Tier Status', this._cavConfig.getActiveDC());
      this._navService.addNewNaviationLink('Tier Status');
      this.router.navigate(['/home/execDashboard/main/tierStatus']);
    } else {
      if (dcName === null || dcName === undefined) {
        url = host + "dashboard/view/edRequestHandler.jsp?testRun=" + this.dataContainer.$storeData['trNum'] + "&sesLoginName=" + sessionStorage.getItem('sesLoginName') + "&sessGroupName=" + sessionStorage.getItem('sessGroupName') + "&sessUserType=" + sessionStorage.getItem('sessUserType') + "&ofn=true&appName=" + appName + "&storeName=" + storeName + "&storeAlertType=" + this.dataContainer.$storeAlertType + "&graphTime=" + gTObject['graphTime'] + "&graphTimeLabel=" + gTObject['graphTimeLabel'] + "&ofn=true&strSpecialDay=" + gTObject['strSpecialDay'];
      } else {
        url = host + "dashboard/view/edRequestHandler.jsp?testRun=" + this.dataContainer.$storeData['trNum'] + "&sesLoginName=" + sessionStorage.getItem('sesLoginName') + "&sessGroupName=" + sessionStorage.getItem('sessGroupName') + "&sessUserType=" + sessionStorage.getItem('sessUserType') + "&ofn=true&appName=" + appName + "&storeName=" + storeName + "&storeAlertType=" + this.dataContainer.$storeAlertType + "&ndeName=" + dcName + "&graphTime=" + gTObject['graphTime'] + "&graphTimeLabel="+gTObject['graphTimeLabel'] + "&ofn=true&strSpecialDay=" + gTObject['strSpecialDay'];
      }
      console.log(url);
      window.open(url);
    }

  }
  openAlerts(event, appData) {
    try {
      event.stopPropagation();
      event.preventDefault();
      if (!appData.disabledAlert){
        let rowData = {};
        let alertType;
        if (appData.critical != 0) {
          alertType = 'All';
        }
        else if (appData.major != 0) {
          alertType = 'major';
        } else if (appData.minor != 0) {
          alertType = 'minor';
        }
        else {
          console.log("inside else condition, shouldn't be here!");
        }
        rowData['storeName'] = this.appObj['storeName'];
        rowData['tierName'] = appData.tierName;
        rowData['dc'] = this.dataContainer.$selectStoreData.data.dc;
        this._transactionHandler.openAlertForSelectedStore(rowData,alertType);
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * method to open web dashboard for selected app
  */
  openWebdashboard(appData, event) {
    try { 
      event.stopPropagation();
      event.preventDefault();
      if (appData.disabledDashboard == true || appData.disabledDashboard == "true") {
        return;
      }
      // var dcName = (rowObj.dcName == undefined || rowObj.dcName == '') ? this._config.getActiveDC() : rowObj.dcName;
      // if (this.dataContainer.$MultiDCsArr.length > 0) {
      //   if (this.dataContainer.$isAllDCs) {
      //     this._cavConfig.isFromEDTransactionTable['dataCenter'] = 'All';
      //   } else {
      //     this._cavConfig.isFromEDTransactionTable['dataCenter'] = this.dataContainer.$MultiDCsArr[0];
      //   }
      // }
      var dcName = this.dataContainer.$selectStoreData.data.dc;
      this._cavConfig.isFromEDTransactionTable['dataCenter'] = dcName;
      this._cavConfig.isFromEDTransactionTable['flag'] = true;
      this._cavConfig.isFromEDTransactionTable['storeName'] = this.appObj['storeName'];
      this._cavConfig.isFromEDTransactionTable['tierName'] = appData['tierName'];
      this._cavConfig.setActiveDC(dcName);
      sessionStorage.setItem('activeDC', dcName);
      this._navService.addNewNaviationLink('dashboard');
      // sessionStorage.setItem("isAllDCs", 'false')
      // sessionStorage.setItem("MultiDCsArr", "");
      this._navService.addDCNameForScreen('dashboard', dcName);
      console.log(this._cavConfig.isFromEDTransactionTable);
      this.router.navigate(['/home/dashboard']);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 
   * @param obj method to open MSSQl module
   */
  openMsSql(obj) {
    this.setDataForDB(obj);
    this._navService.addNewNaviationLink('msSql');
    this._navService.addDCNameForScreen('msSql', this._cavConfig.getActiveDC());
    this.router.navigate(['/home/msSql/sqlActivity']);
  }

  /**
   * method to set data for MS Sql module
   * @param obj 
   */
  private setDataForDB(obj) {
    let gTObject = this._graphicalKpi.getGraphTimeObject();
    if (gTObject['graphTimeLabel'] === 'Yesterday' ||
      gTObject['graphTimeLabel'] === 'Custom Date' ||
      gTObject['graphTimeLabel'] === 'Last Week Same Day') {
      this._sqlQueryService.$startTime= gTObject['startTime'];
      this._sqlQueryService.$endTime = gTObject['endTime'];
      this._sqlQueryService.$selectedPreset = 'Custom';
    }
    else{
      this._sqlQueryService.$selectedPreset = gTObject['graphTimeLabel'];
    }
    this._sqlQueryService.setDataSource(obj.srcName);
    this._sqlQueryService.$isAggrigationFromConfig = true;
    this._sqlQueryService.$sql_clientConnectionKey = sessionStorage.getItem('clientConnectionKey');
    this._sqlQueryService.$sql_testRun = sessionStorage.getItem('runningtest');
  }


  openED(obj) {
    console.log('open ed')
  }

  //method to chose which module to open,ED or MS SQl
  openModule(event, obj, params: string) {
    event.stopPropagation();
    event.preventDefault();
    params === 'db' ? this.openMsSql(obj) : this.openED(obj);
  }

  /*Stopiing appview update on geomap view*/
  ngOnDestroy() {
    this._cavConfig.showAppView = false;
    this.updateGeoMapTimer.emit('stopAppUpdate');
  }
}
