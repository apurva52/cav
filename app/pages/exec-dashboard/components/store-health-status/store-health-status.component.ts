import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng';
import { ExecDashboardChartProviderService } from '../../services/exec-dashboard-chart-provider.service';
import { Subscription } from 'rxjs';
import { ExecDashboardDataContainerService } from './../../services/exec-dashboard-data-container.service';
import { ExecDashboardGraphicalKpiService } from './../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardConfigService } from './../../services/exec-dashboard-config.service';
import { CustomSelectItem } from './../../services/exec-dashboard-config.service';
import { ExecDashboardGraphTimeDataservice } from './../../services/exec-dashboard-graph-time-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TierStatusCommonDataHandlerService } from './../exec-dashboard-tier-status/services/tier-status-common-data-handler.service';
import { TierStatusMenuHandlerService } from './../exec-dashboard-tier-status/services/tier-status-menu-handler.service';
import { TierStatusDataHandlerService } from './../exec-dashboard-tier-status/services/tier-status-data-handler.service';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { DdrDataModelService } from 'src/app/pages/tools/actions/dumps/service/ddr-data-model.service';
@Component({
  selector: 'app-store-health-status',
  templateUrl: './store-health-status.component.html',
  styleUrls: ['./store-health-status.component.css']
})
export class StoreHealthStatusComponent implements OnInit, OnDestroy {

  public classReference = ExecDashboardChartProviderService;
  appSettingFlag: boolean = false;
  selectedhealthStatus: string = '0';
  healthStatusDrp: CustomSelectItem[] = [];
  appDrp: CustomSelectItem[] = [];
  selectedApp: string = 'All';
  applicationName: String = '';
  frontEndTierList: CustomSelectItem[] = [];
  tierList: CustomSelectItem[] = [];
  fetierList: CustomSelectItem[] = [];
  appList: Object = {};
  selectedTiers: any[] = [];
  selectedFETier: string = '';
  showAppView: boolean = false;
  subscription: Subscription;
  editAppName: string = '';
  toggleTimePeriod: boolean = false;
  timePeriodArr: CustomSelectItem[] = [];
  selectedTimePeriod: string = 'Last_10_Minutes';
  selectedStoreData: Object = {};
  showGeoView: boolean = false;
  storeViewInfo: any;
  appViewInfo: any;
  storesData;
  // for filtering options
  filterOptions: any;
  selectedFilter: any;
  showFilterText: boolean = false;
  filterText: any;
  selectedStoreName: string = "";
  appTierMap: Object = {};
  isEditApp: boolean = false;

  // for blockUI
  blockCheck: boolean = false;


  // For multiDC settings
  dcList: CustomSelectItem[] = [];
  selectedDCList: string[] = [];
  showDCList: boolean = false;
  isAllExist: boolean = false;

  subs: Subscription;
  aliasSV: string = "Store View";
  disableDrpDown: boolean = false;

  routeParam: any;

  //Variables for Standard
  flowpathChk: boolean;
  searchByDialog: boolean;
  selectedtierList: any = [];
  tierListOption: CustomSelectItem[] = [];
  correlationID: any[];
  flowpathID: any = "";
  mode: string;
  /* Assign dropdown values to Mode */
  modeList: CustomSelectItem[] = [];

  //Variables for Custom
  selectedtierListForCustom: any = [];
  customNameList: CustomSelectItem[] = [];

  //Variables  for Logs
  pattern: any;
  flowpathIDForLogs: any;
  correlationIDForLogs: any;
  selectedtierListForLogs: any = [];

  //New
  customRulesData: customData[];
  customDetail: customData;

  selectedCustomRules: customData[];

  /*drop down variable for Operation */
  operationList: CustomSelectItem[];
  customTypeDelete = [];

  paramObj: any = {};




  @ViewChild('mulRef') mulRef: ElementRef;
  constructor(private confirmationService: ConfirmationService, public _rendere: Renderer2, public _chartProvicer: ExecDashboardChartProviderService, public datacontainer: ExecDashboardDataContainerService, public graphicalKpiService: ExecDashboardGraphicalKpiService, private http: HttpClient, public _config: ExecDashboardConfigService, public _cavConfig: CavConfigService,
    public _graphTime: ExecDashboardGraphTimeDataservice,
    private router: Router,
    private _navService: CavTopPanelNavigationService,
    private _activedRoute: ActivatedRoute,
    private _ddrData: DdrDataModelService,
    public _tsCommonHandler: TierStatusCommonDataHandlerService,
    public _menuHandler: TierStatusMenuHandlerService,
    public _dataHandlerService: TierStatusDataHandlerService) {
    this.routeParam = this._activedRoute.queryParams.subscribe(params => {
      this.paramObj = params;
      if (params.Initialization === "true") {
        this.datacontainer.$geoFilterText = "";
        this.datacontainer.$selectedGeoMapFilter = "";
        this.datacontainer.$MultiDCsArr = [];
      } else {
        if (sessionStorage.MultiDCsArr && !sessionStorage.MultiDCsArr.includes("undefined")) {
          this.datacontainer.$MultiDCsArr = sessionStorage.MultiDCsArr.split(",");
        }
      }
    });
    this.subscription = this._chartProvicer.getMessage().subscribe((data) => {
      let dataObj = data.data;
      if (dataObj.hasOwnProperty('type')) {
        if (dataObj.type === 'Total Good Stores' || dataObj.type === 'Total Bad Stores') {
          if (dataObj.value > 0) {
            this.datacontainer.$goodBadStore = dataObj.type;
            sessionStorage.setItem("storeType",dataObj.type);
            this._navService.addNewNaviationLink('edTransaction Table');
            // this.router.navigate(['/execDashboard/main/transactionTable/' + dataObj.type]);
            this.router.navigate(['/home/execDashboard/main/transactionTable/']);
          }
          else {
            this.graphicalKpiService.showMessageGrowl('error', 'Error Message', 'No store available');
          }
        }
      }
      else {
        this.datacontainer.$selectStoreData = data;
        this.storesData = data;
        this.selectedStoreName = data.data.options.storeName;
        this.showAppView = true;
        this._cavConfig.showAppView = true;
        this.getAppData(this.storesData);
        this.startAppUpdate();
      }

    });

    this.subs = this.graphicalKpiService.$storeProvider.subscribe(data => {
      this._cavConfig.$storeViewParam = data;
      if (this.datacontainer.$MultiDCsArr.length < 1) {
        this.blockCheck = true;
        this.getStoreData((d) => {
          if (d === 'Error') {
            this.blockCheck = false;
            return;
          } else {
            this.blockCheck = false;
            this.updateGeoMap();
          }
        });
      } else {
        this.blockCheck = true;
        this.graphicalKpiService.getMultiDCsData((data1) => {
          if (data1 === 'Error') {
            this.blockCheck = false;
            return;
          } else {
            this.blockCheck = false;
            this.setDefaultData(data1);
            this.updateGeoMap();
          }
        });
      }
    });
  }

  ngOnInit() {
    this.aliasSV = (sessionStorage.getItem("aliasStoreView") !== "undefined") ? sessionStorage.getItem("aliasStoreView") : "Store View";
    if (sessionStorage.isMultiDCMode == "true") {
      this.datacontainer.$DCsInfo = this.getDCInfoObj(this.paramObj.Initialization == "true");
      this.handleMultiDC();
          } else {
      this.handleSingleDc();
      }

    // Health Status
    this.healthStatusDrp = [
      { label: 'Business', value: 0 },
      { label: 'Infrastructure', value: 1 },
    ];

    //filterOptions
    this.filterOptions = [
      { label: 'None', value: 'None' },
      { label: 'Critical', value: 'Critical' },
      { label: 'Major', value: 'Major' },
      { label: 'Store Name', value: 'Store Name' },
      { label: 'Store City', value: 'Store City' },
      { label: 'State Name', value: 'State Name' }
    ];
    this.selectedFilter = this.datacontainer.$selectedGeoMapFilter;
    this.selectedhealthStatus = this.datacontainer.$storeAlertType;
    this.frontEndTierList = [
      { label: 'T1', value: 0 },
      { label: 'T2', value: 1 },
    ];

    // Time Period Arr
    this.timePeriodArr = [
      { label: 'Today', value: 'last_day' },
      { label: 'Yesterday', value: 'Yesterday' },
      { label: 'Last 10 Minute', value: 'Last_10_Minutes' },
      { label: 'Last 30 Minute', value: 'Last_30_Minutes' },
      { label: 'Last 1 Hour', value: 'Last_60_Minutes' },
      { label: 'Last 2 Hours', value: 'Last_120_Minutes' },
      { label: 'Last 4 Hours', value: 'Last_240_Minutes' },
      { label: 'Last 6 Hours', value: 'Last_360_Minutes' },
      { label: 'Last 8 Hours', value: 'Last_480_Minutes' },
      { label: 'Last 12 Hours', value: 'Last_720_Minutes' },
      { label: 'Last 24 Hours', value: 'Last_1440_Minutes' },
      { label: 'Total Test Run', value: 'WholeScenario' },
    ];
  }

  /**
   * Executes in case multiDC
   */
  handleMultiDC() {
    this.datacontainer.$multiDCMode = true;
    for (let i in this.datacontainer.$DCsInfo) {
      if (i.toUpperCase() == "ALL") continue;
      this.dcList.push({ label: i, value: i, selected: this.datacontainer.$MultiDCsArr.includes(i)});
    }
    this.showDCList = this.dcList.length > 0;
    let activeDC = this._cavConfig.getActiveDC();
    if (activeDC == 'ALL') {
      this.datacontainer.$isAllDCs = true;
    } else {
      this.dcList.forEach(e=> e.disabled = true);
      this.datacontainer.$isAllDCs = false;
    }
    this.fetchAndProcessMultiDCData();
  }

  /**
   * Responsible to send request in case single dc
   */
  private handleSingleDc(): void {
    console.log("inside single dc character ");
    this.blockCheck = true;
    this.getStoreData(() => {
      this.blockCheck = false;
      this.selectedApp = this.datacontainer.$selectedGeoApp;
      this.getSelectedApp(this.selectedApp);
      this.startUpdate();
    });
  }

  /**
   * Returns the dcInfo object with existing dcInfo format
   */
  getDCInfoObj(selectAll?: boolean) {
    let dcInfoObj = {};
    let selectedDCs = [];
    this._cavConfig.getDCInfoObj().forEach(e => {
      dcInfoObj[e.dc] = {
        "dataCenterIP": e.ip,
        "dataCenterName": e.dc,
        "dataCenterPort": e.port,
        "protocol": e.protocol,
        "testRunNo": e.testRun
      }
      if (selectAll) {
        selectedDCs.push(e.dc);
      }
      if (e.isMaster) {
        dcInfoObj["All"] = dcInfoObj[e.dc];
        dcInfoObj["All"].dataCenterName = "All";
      }
    });
    this.datacontainer.$MultiDCsArr = this._cavConfig.getActiveDC().toUpperCase() != "ALL"?[this._cavConfig.getActiveDC()]:selectedDCs.length?selectedDCs:this.datacontainer.$MultiDCsArr;
    return dcInfoObj;
  }

  /**
   * Fetches data from node server
   */
  private fetchAndProcessMultiDCData(): void {
    this.blockCheck = true;
    this.graphicalKpiService.getMultiDCsData((data) => {
      this.blockCheck = false;
      if (data != 'Error') {
        this.selectedApp = this.datacontainer.$selectedGeoApp;
        this.getSelectedApp(this.selectedApp);
        this.setDefaultData(data);
        this.updateGeoMap();
        this.startUpdate();
      }
    });
  }

  getStoreData(callback) {
    try {
      // Getting Geo Map data from server
      this.graphicalKpiService.getStoreDataFromServer((data) => {
        if (data !== 'Error') {
          this.setDefaultData(data);
          callback(data);
        } else {
          callback(data);
        }
      });
    } catch (error) {
      console.log('Error in getStoreData ');
      console.log(error);
    }
  }

  private dcSelectetionTimer = null; // contains the dcSelectetionTimer object
  handleClickOfDCs() {
    if (this.dcSelectetionTimer != null) {
      clearTimeout(this.dcSelectetionTimer); // clear timeout if it exists
    }
    this.dcSelectetionTimer = setTimeout(() => { // hold the http request to fetch store data while user selecting DC(s)
      this.onDCSelection();
      this.dcSelectetionTimer = null;
    }, 1500);
  }


  onDCSelection() {
    if (this.datacontainer.$MultiDCsArr.length == 1 && this.datacontainer.$MultiDCsArr.length != this.dcList.length) {
      this.datacontainer.$isAllDCs = false;
    } else {
        this.datacontainer.$isAllDCs = true;
    }
    this.blockCheck = true;
    this.graphicalKpiService.getMultiDCsData((data) => {
      this.blockCheck = false;
      this.setDefaultData(data);
      this.updateGeoMap();
    });
  }



  /**
 * creating this method to remove redundency as same code in done in case of multi Dc & normal
 * code also
 */
  setDefaultData(data) {
    this.datacontainer.$storeData = data;
    if (this.datacontainer.$updateGeoMap) {
      this.showGeoView = true;
    }
    this.datacontainer.$tableArr = this.datacontainer.$storeData['geoStoreDTO']['appInfoList'];
    // tier List
    this.tierList = [];
    for (let i = 0; i < this.datacontainer.$storeData['geoStoreDTO']['tierList'].length; i++) {
      this.tierList.push({
        label: this.datacontainer.$storeData['geoStoreDTO']['tierList'][i],
        value: this.datacontainer.$storeData['geoStoreDTO']['tierList'][i],
      });
    }
    // Front end tier List
    this.fetierList = [];
    this.fetierList.push({ label: "-- Select Tier --", value: null });
    for (let i = 0; i < this.datacontainer.$storeData['geoStoreDTO']['tierList'].length; i++) {
      this.fetierList.push({
        label: this.datacontainer.$storeData['geoStoreDTO']['tierList'][i],
        value: this.datacontainer.$storeData['geoStoreDTO']['tierList'][i],
      });
    }
    this.datacontainer.$frontEndTierArr = [];
    this.appDrp = [];
    // Application List
    for (let i = 0; i < this.datacontainer.$storeData['geoStoreDTO']['appInfoList'].length; i++) {
      this.appDrp.push(
        { label: this.datacontainer.$storeData['geoStoreDTO']['appInfoList'][i]['appName'], value: this.datacontainer.$storeData['geoStoreDTO']['appInfoList'][i]['appName'] }
      );
    }

    this.appDrp.push(
      { label: 'All', value: 'All' }
    );
    if (!this.datacontainer.$storeData['geoStoreDTO']['appTierMap']) {
      this.appList = {};
    } else {
      this.appList = this.datacontainer.$storeData['geoStoreDTO']['appTierMap'];
      this.appTierMap = Object.assign(this.appList);
      for (const key in this.appTierMap) {
        if (this.appTierMap.hasOwnProperty(key)) {
          const element = this.appTierMap[key];
          this.datacontainer.$frontEndTierArr.push({ 'app': key, 'tier': element['frontTier'] });
        }
      }
    }
    //if geostore data is present and appinfolist is blank then user need to configure the app first
    if (this.datacontainer.$storeData.hasOwnProperty('geoStoreDTO') && this.datacontainer.$storeData['geoStoreDTO']) {
      if (this.datacontainer.$storeData['geoStoreDTO']['appInfoList'].length == 0) {
        this.appSettingFlag = true;
        let msg = 'There is no app configured for Store';
        this.showGeoView = true;
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        return;
      }
    }
    else {
      let msg = 'Data not available for geomap';
      this.graphicalKpiService.msgs = [];
      this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
    }

    if (this.datacontainer.$storeData && this.datacontainer.$storeData.geoStoreDTO.hasOwnProperty('graphTimeLabel')) {
      let tempGraphTimeLabel = this.datacontainer.$storeData.geoStoreDTO.graphTimeLabel;
      if (tempGraphTimeLabel)
        this._graphTime.$appliedTimePeriod = tempGraphTimeLabel.substring(tempGraphTimeLabel.indexOf(':') + 1);
    }

  }


  /* Toggle Time Period Dialog*/
  openTimePeriod() {
    this.toggleTimePeriod = true;
  }

  /* Toggle App setting diloag*/
  showAppSettingDialog() {
    this.appSettingFlag = true;
  }

  /* Function to track index*/
  trackByFn(index, item) {
    return index; // or item.id
  }
  /*Validating first app we create in app settings*/
  createFirstAppList(name, feTier, tiers) {
    let msg;
    if (!name) {
      msg = "App name can not be blank";
      this.graphicalKpiService.msgs = [];
      this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      return false;
    }
    if (tiers.length == 0) {
      msg = "Selected atleast one tier for app configuration.";
      this.graphicalKpiService.msgs = [];
      this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      return false;
    }
    else {
      let fePresent = 0;
      for (let list of tiers) {
        if (feTier == list) {
          fePresent = 1;
        }
      }
      if (fePresent == 1) {
        return true;
      }
      else {
        msg = "Front end tier must belong to the above selected tiers.";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        return false;
      }
    }
  }
  /*validating if app window is already configured*/
  validateApp(name, feTier, tiers) {
    let msg;
    if (!name) {
      msg = "App name can not be blank";
      this.graphicalKpiService.msgs = [];
      this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      return false;
    }
    if (tiers.length == 0) {
      msg = "Selected atleast one tier for app configuration.";
      this.graphicalKpiService.msgs = [];
      this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      return false;
    }
    else {
      let fePresent = 0;
      let duplicateAppName = 0;
      let duplicateFeTier = 0;
      for (let list of tiers) {
        if (feTier == list) {
          fePresent = 1;
        }
      }
      if (fePresent == 0) {
        msg = "Front end tier must belong to the above selected tiers.";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        return false;
      }
      else {
        for (let list of this.datacontainer.$frontEndTierArr) {
          if (list['tier'] == feTier && this.isEditApp == false) {
            duplicateFeTier = 1;
          }
        }
        for (let app of this.datacontainer.$frontEndTierArr) {
          if ((app['app'].toUpperCase() == name.toUpperCase()) && this.isEditApp == false) {
            duplicateAppName = 1;
          }
        }
      }
      if (duplicateAppName == 1) {
        msg = "App with the same name is already configured.";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        return false;
      }
      if (duplicateFeTier == 1) {
        msg = "Selected FrontEnd Tier is already configured for another app.";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        return false;
      }
    }
    return true;
  }
  /* Saving edited app setting to reflect changes on table*/
  saveAppSettings() {
    try {

      const appName = this.applicationName.trim();
      const tiers = this.selectedTiers;
      const frontendTier = this.selectedFETier;
      if (this.datacontainer.$storeData['geoStoreDTO']['appInfoList'].length == 0 && this.datacontainer.$frontEndTierArr.length == 0) {
        if (this.createFirstAppList(appName, frontendTier, tiers) == false) {
          return;
        }
        else {
          this.datacontainer.$frontEndTierArr.push({ 'app': appName, 'tier': frontendTier });
        }
      }
      else {
        if (this.validateApp(appName, frontendTier, tiers) == false) {
          return;
        }
        else if (this.isEditApp == true) {
          let flag = 0;
          for (let i = 0; i < this.datacontainer.$frontEndTierArr.length; i++) {
            if (appName.toUpperCase() == this.datacontainer.$frontEndTierArr[i]['app'].toUpperCase()) {
              let newObj = { 'app': appName, 'tier': frontendTier };
              this.datacontainer.$frontEndTierArr.splice(i, 1);
              this.datacontainer.$frontEndTierArr.push(newObj);
            }
          }
        } else {
          this.datacontainer.$frontEndTierArr.push({ 'app': appName, 'tier': frontendTier });
        }
      }
      if (this.appList && this.appList.hasOwnProperty(this.editAppName)) {
        delete this.appList[this.editAppName];
      } else if (Object.keys(this.appList).length == 0) {
        this.appList = {};
      }

      this.appList[appName] = {};
      this.appList[appName] = {
        tierList: tiers,
        frontTier: frontendTier
      };
      this.clearSettingWindow();
    }
    catch (err) {
      console.log('Getting error in save app', err);
    }
  }

  /* Edit action on app setting*/
  editSelection(key, values, ft) {
    try {
      let isTiersValid = true;
      values.forEach(value => {
        if (this.tierList.find(myObj => myObj.value === value) === undefined) {
          this.graphicalKpiService.msgs = [];
          this.graphicalKpiService.msgs.push({ severity: 'info', summary: 'Invalid Tier Name', detail: `Tier ${value} not present in tier list` });
          isTiersValid = false;
        }
      });
      if (isTiersValid) {
        this.editAppName = key;
        this.applicationName = key;
        this.selectedTiers = values;
        this.isEditApp = true;
        this.selectedFETier = ft;
      } else {
        this.applicationName = this.editAppName = '';
        this.selectedTiers = [];
        this.isEditApp = false;
        this.selectedFETier = null;
      }
    }
    catch (error) {
      console.log('getting error', error);
    }
  }

  /* Delete action on app setting*/
  deleteSelection(key) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        delete this.appList[key];
        delete this.appTierMap[key];
        for (let i = 0; i < this.datacontainer.$frontEndTierArr.length; i++) {
          if (this.datacontainer.$frontEndTierArr[i]['app'] == key) {
            this.datacontainer.$frontEndTierArr.splice(i, 1);
          }
        }
      }
    });
  }

  /* Saving modified app config*/
  saveAppConfig() {
    console.log('Data to be sent: ', this.appList);
    this.datacontainer.$storeData['geoStoreDTO']['appTierMap'] = this.appList;
    console.log(this.datacontainer.$storeData);
    // Sending AJAX
    let host = this._config.getNodePresetURL();
    let url = '';
    if (this.datacontainer.$multiDCMode) {
      let urlOBJ = new URL(this.datacontainer.$saveAppURL);
      url = urlOBJ.href + '&GRAPH_KEY=' + this.selectedTimePeriod + '&productKey=' + sessionStorage.productKey;
    } else {
      url = `${host}DashboardServer/RestService/KPIWebService/saveAppTierJson?productKey=${sessionStorage.productKey}&requestType=geoMap&storeAlertType=${this.selectedhealthStatus}&reqTestRunNum=${this.datacontainer.$storeData['trNum']}&GRAPH_KEY=${this.selectedTimePeriod}`;
    }
    this.http.post(url, this.appList).subscribe(data => {
      this.appDrp = [{
        label: 'All', value: 'All'
      }];
      this.appSettingFlag = false;
      this.datacontainer.$storeData = JSON.parse(data['_body']);

      // console.log(JSON.stringify(this.datacontainer.$storeData));
      // Application List
      for (let i = 0; i < this.datacontainer.$storeData['geoStoreDTO']['appInfoList'].length; i++) {
        this.appDrp.unshift(
          { label: this.datacontainer.$storeData['geoStoreDTO']['appInfoList'][i]['appName'], value: this.datacontainer.$storeData['geoStoreDTO']['appInfoList'][i]['appName'] }
        );
      }

      this.selectedApp = 'All';	// Remove This
      this.updateGeoMap();
      this.getSelectedApp('All');
    });
  }

  updateGeoMap() {
    this.graphicalKpiService.getUpdateDataForGeoMap();
  }

  /* Change Health Status from dropdown*/
  changeHealthStatus() {
    this.datacontainer.$storeAlertType = this.selectedhealthStatus;
    this.blockCheck = true;
    if (this.datacontainer.$MultiDCsArr.length < 1) {
      this.getStoreData(() => {
        this.updateGeoMap();
        this.blockCheck = false;
      });
    }
    else {
      this.graphicalKpiService.getMultiDCsData((data) => {
        this.blockCheck = false;
        this.setDefaultData(data);
        this.updateGeoMap();
      });
    }
  }
  /* Apply Time Period*/
  applyTimePeriod() {
    this.toggleTimePeriod = false;
    this.datacontainer.$storeAppliedTimePeriod = this.selectedTimePeriod;
  }
  /*method for filtering app table*/
  getSelectedApp(selectedApp) {
    this.datacontainer.$selectedGeoApp = selectedApp;
    this._cavConfig.selectedGeoApp = selectedApp;
    this.graphicalKpiService.getFilteredData(selectedApp);
  }

  /**method on click of apps options  */
  filterApps(selectedApp) {
    this.getSelectedApp(selectedApp); //Calls emitter
    this.blockCheck = true;
    if (this.datacontainer.$MultiDCsArr.length < 1) {
      this.getStoreData(() => {
        this.updateGeoMap();  //Calls emitter
        this.blockCheck = false;
      });
    }
    else {
      this.graphicalKpiService.getMultiDCsData((data) => {
        this.blockCheck = false;
        this.setDefaultData(data);
        this.updateGeoMap();
      });
    }
  }

  filterGoeMap() {
    this.filterText = '';
    this.datacontainer.$selectedGeoMapFilter = this.selectedFilter;
    if (this.selectedFilter !== 'Critical' && this.selectedFilter !== 'Major' && this.selectedFilter !== 'None')
      this.showFilterText = true;
    else {
      this.showFilterText = false;
      this.graphicalKpiService.getUpdateDataForGeoMap();
    }
  }

  validateFilter() {
    if (!this.filterText || this.filterText.trim() === '') {
      alert("Please fill search options");
      return;
    }
    this.datacontainer.$geoFilterText = this.filterText;
    this.graphicalKpiService.getUpdateDataForGeoMap();
  }

  startUpdate() {
    // update should be disabled in case of yesterday , specified time and event day.
    this.storeViewInfo = setInterval(() => {
      let object = this._cavConfig.$storeViewParam['graphTimeLabel'];
      let tempTime = object.toLowerCase();
      if (tempTime.indexOf('last') > -1 && (tempTime.indexOf('hour') > -1 || tempTime.indexOf('minute') > -1)) {
        if (this.datacontainer.$MultiDCsArr.length < 1) {
          this.blockCheck = true;
          this.getStoreData(() => {
            this.blockCheck = false;
            this.updateGeoMap();
          });
        }
        else {
          this.graphicalKpiService.getMultiDCsData((data) => {
            this.blockCheck = false;
            this.setDefaultData(data);
            this.updateGeoMap();
          });
        }
      }
    }, 120000);

  }



  stopUpdate() {
    clearInterval(this.storeViewInfo);
  }


  onButtonClick() {
    this.startUpdate();
    this._cavConfig.showAppView = false;
    if (this.dcList.length < 1) {
      this.showDCList = false;
    } else {
      this.showDCList = true;
    }
  }

  updateTimer(event) {
    try {
      if (event == "StopUpdate") {
        this.stopUpdate();
        this.showDCList = false;
      }
      if (event == "stopAppUpdate") {
        this.stopAppUpdate();
      }
    } catch (error) {
      console.log(error);
    }
  }
  getAppData(storesData) {

    let url = "";
    let timeObject = this.graphicalKpiService.getGraphTimeObject();
    if (this.datacontainer.$MultiDCsArr.length > 0) {
      let dcName = this.storesData.data.options.dc;
      let host = this._config.getNodePresetURL([dcName]);
      let tempObject = this._config.getDCObject(dcName);
      this.blockCheck = true;
      url = host + "DashboardServer"
        + `/RestService/KPIWebService/storeInfo?productKey=${sessionStorage.productKey}&requestType=appInfo&storeName=${this.storesData.data.options.storeName}&appName=${this.selectedApp}&storeAlertType=${this.selectedhealthStatus}&reqTestRunNum=${tempObject['testRunNo']}&GRAPH_KEY=&appliedTimePeriodStr=${timeObject['graphTimeLabel']}&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
    }
    else {
      this.blockCheck = true;
      let host = this._config.getNodePresetURL();
      url = `${host}DashboardServer/RestService/KPIWebService/storeInfo?productKey=${sessionStorage.productKey}&requestType=appInfo&storeName=${this.storesData.data.options.storeName}&appName=${this.selectedApp}&storeAlertType=${this.selectedhealthStatus}&reqTestRunNum=${this.datacontainer.$storeData['trNum']}&GRAPH_KEY=&appliedTimePeriodStr=${timeObject['graphTimeLabel']}&appliedStartTime=${timeObject['startTime']}&appliedEndTime=${timeObject['endTime']}&appliedEventDay=${timeObject['strSpecialDay']}`;
    }

    console.log(url);

    this.http.get(url).subscribe(d => {
      this.datacontainer.$appWindowData = d;
      this.showGeoView = false;
      this.blockCheck = false;
    });
  }

  getDCObject() {

    // console.log(this.datacontainer.$MultiDCsArr);
    // console.log(this.datacontainer.$MultiDCsArr);
    // console.log(this.datacontainer.$isAllDCs);
    // console.log(this.storesData.data.options.dc);
    let tempobject = {};
    let dcObject;
    let dcName = this.storesData.data.options.dc;
    {
      dcObject = this.datacontainer.$DCsInfo[dcName];
      tempobject['dcName'] = dcName;
      tempobject['server'] = '/DashboardServer/';
    };
    tempobject['port'] = dcObject['dataCenterPort'];
    tempobject['protocol'] = dcObject['protocol'];
    tempobject['testRunNo'] = dcObject['testRunNo'];
    tempobject['dataCenterIP'] = dcObject['dataCenterIP'];

    return tempobject;
  }

  startAppUpdate() {
    let object = this._cavConfig.$storeViewParam['graphTimeLabel'];
    let tempTime = object.toLowerCase();
    // update should be disabled in case of yesterday , specified time and event day.
    this.appViewInfo = setInterval(() => {
      if (tempTime.indexOf('last') > -1 && (tempTime.indexOf('hour') > -1 || tempTime.indexOf('minute') > -1)) {
        this.getAppData(this.storesData);
      }
    }, 120000);
  }

  stopAppUpdate() {
    clearInterval(this.appViewInfo);
  }
  /*Cleaning app setting window on closing,saving and cancelling */
  clearSettingWindow() {
    this.isEditApp = false;
    this.applicationName = '';
    this.selectedFETier = '';
    this.selectedTiers = [];
  }
  /* method to set value for multiselection dc drop down */
  setMultiSelectionText() {
    let isAll: boolean = false;
    if ("All" == this.datacontainer.$MultiDCsArr.find(e => e == "All"))
      isAll = true;
    if (this.mulRef) {
      var el: ElementRef = this.mulRef['el'];
      var childList = el.nativeElement['children'][0];
      var childElement = childList['children'][1];
      var label: Element = childElement['children'][0];
      if (this.datacontainer.$MultiDCsArr.length > 3) {
        if (isAll) {
          label.textContent = (this.datacontainer.$MultiDCsArr.length - 1) + ' items selected';
        }
        else {
          label.textContent = (this.datacontainer.$MultiDCsArr.length) + ' items selected';
        }
      }
      else {
        label.textContent = this.datacontainer.$MultiDCsArr.toString();
        if (this.datacontainer.$MultiDCsArr.length == 0) {
          label.textContent = "";
        }
      }
    }
  }

  //SearchBy correlation ID code starts from here


  closeSearchByDialog() {
    this.searchByDialog = false;
    this.tierListOption = [];
    this.selectedtierList = [];
    this.correlationID = [];
    this.modeList = [];
    this.selectedtierListForCustom = [];
    this.selectedtierListForLogs = [];
    this.flowpathIDForLogs = '';
    this.correlationIDForLogs = '';
    this.pattern = '';
    this._dataHandlerService.$isStoreView = false;
  }

  //Method to search on the basis of selected header (i.e standard,custom and logs)
  searchBy(event) {
    let msg;
    this._dataHandlerService.$isStoreView = true;
    if (event == 'standard') {
      if ((this.flowpathID == '') && (this.correlationID.length == 0)) {
        msg="Enter either Correlation ID or  FlowpathID";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        //this.showErrorMsg("Enter either Correlation ID or  FlowpathID");
        return;
      }
      else if (this.flowpathID == '' && this.correlationID.length != 0) {
        this.flowpathID = '';
      }
      else if (this.flowpathID == '' && this.correlationID.length == 0) {
        this.correlationID = [];
      }

      this._ddrData.searchByCustomDataOptions = '';
      this._ddrData.customData = '';

      this._ddrData.correlationId = this.correlationID.join(",");
      this._ddrData.tierName = this.selectedtierList.join(",");
      this._ddrData.flowpathID = this.flowpathID;
      this._ddrData.product = this._config.$productName.toLocaleLowerCase();
      this._ddrData.dcName = this._tsCommonHandler.dcName;
      this._ddrData.strGraphKey = this._config.$actTimePeriod;
      this._ddrData.mode = this.mode;
      //this._dataHandlerService.$isStoreView = true;
      this._cavConfig.$eDParam.dcName = this.datacontainer.$MultiDCsArr[0];

      this._menuHandler.handleDdrDrillDown("searchByFlowpath", this._dataHandlerService);

    }
    else if (event == 'custom') {
      if (this.selectedtierListForCustom == undefined || this.customRulesData.length == 0) {
        msg="Please fillup the required field(s)";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        //this.showErrorMsg("Please fillup the required field(s)");
        return;
      }

      // finalVal : To make data of custom to send to ddr
      let finalVal = '';
      for (let key in this.customRulesData) {
        finalVal += this.customRulesData[key].name + ':-:' + this.customRulesData[key].value + ':' + this.customRulesData[key].operationName + ':1:';
      }
      finalVal = finalVal.substring(0, finalVal.length - 3);
      let searchByCustomArr = [];
      for (let key in this.customNameList) {
        searchByCustomArr.push(this.customNameList[key].value);
      }
      let searchByCustomDataOptions = searchByCustomArr.join(',');
      this._ddrData.correlationId = '';
      this._ddrData.flowpathID = '';
      this._ddrData.mode = '';

      this._ddrData.tierName = this.selectedtierList.join(",");
      this._ddrData.product = this._config.$productName.toLocaleLowerCase();
      this._ddrData.dcName = this._tsCommonHandler.dcName;
      this._ddrData.strGraphKey = this._config.$actTimePeriod;
      this._ddrData.searchByCustomDataOptions = searchByCustomDataOptions;
      this._ddrData.customData = finalVal;
      this._menuHandler.handleDdrDrillDown("searchByFlowpath", this._dataHandlerService);

    }
    else if (event == 'logs') {
      if (this.correlationIDForLogs == undefined || this.flowpathIDForLogs == undefined || this.pattern == null || this.selectedtierListForLogs == undefined) {
        msg="Enter the required field(s)";
        this.graphicalKpiService.msgs = [];
        this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
        //this.showErrorMsg("Enter the required field(s)");
        return;
      }

      this._ddrData.correlationId = this.correlationIDForLogs;
      this._ddrData.tierName = this.selectedtierListForLogs.join(",");
      this._ddrData.flowpathID = this.flowpathIDForLogs;
      this._ddrData.product = this._config.$productName.toLocaleLowerCase();
      this._ddrData.testRun = this._dataHandlerService.cavConfig.$eDParam.testRun;
      this._ddrData.strGraphKey = this._config.$actTimePeriod;
      this._ddrData.pattern = this.pattern;

      this._menuHandler.createParam('searchByFlowpathLogs');
      //Close Dialog of Search FlowPath
      this.closeSearchByDialog();
    }

  }

  showErrorMsg(msg) {
    this._dataHandlerService.msgs = [];
    this._dataHandlerService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  /**This method returns selected Custom row on the basis of selected row */
  getCustomRulesIndex(appId: any): number {
    for (let i = 0; i < this.customRulesData.length; i++) {
      if (this.customRulesData[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  //For Custom Rule Table
  saveCustomRules() {
    this.customRulesData = ImmutableArray.push(this.customRulesData, this.customDetail);
    this.customDetail = new customData();
  }

  //deletimg Custom rules
  deleteCustomRules(): void {
    if (!this.selectedCustomRules || this.selectedCustomRules.length < 1) {
      let msg="Select row(s) to delete";
      this.graphicalKpiService.msgs = [];
      this.graphicalKpiService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      //this.showErrorMsg("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedCustomRules;
    let arrArgIndex = [];
    for (let index in selectedRules) {
      arrArgIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('name')) {
        this.customTypeDelete.push(selectedRules[index].name);
      }
    }
    this.deleteCustomRulesFromTable(arrArgIndex);
    this.selectedCustomRules = [];

  }

  /**This method is used to delete  Custom Rules from Data Table */
  deleteCustomRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];
    for (let index in arrRulesIndex) {
      rowIndex.push(this.getCustomRulesIndex(arrRulesIndex[index]));
    }
    this.customRulesData = this.deleteMany(this.customRulesData, rowIndex);
  }

  //To Delete >=1 id's from a table
  deleteMany(array, indexes = []) {
    return array.filter((item, idx) => indexes.indexOf(idx) === -1);
  }

  //Generic Method to create Dropdown label-value
  createListWithKeyValue(arrLabel: string[], arrValue: string[]): CustomSelectItem[] {
    let selectItemList = [];

    for (let index in arrLabel) {
      selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
    }

    return selectItemList;
  }


  showSearchDialog() {

    let tempInstance = this.datacontainer.$storeData['geoStoreDTO']['storeInfoList'];
    console.log("Store view store list: ", tempInstance);

    // tempTierList is used to Store all Tiers
    let tempTierList = [];
    for (let i = 0; i < tempInstance.length; i++) {                                  //for storeInfoList
      for (let j = 0; j < tempInstance[i]['storeName'].split(",").length; j++) {     //for storeName.split(",")
        for (let k = 0; k < tempInstance[i]['tierName'].split(",").length; k++) {    //for tierNmae.split(",")
          let tier = tempInstance[i]['storeName'].split(",")[j] + "!" +  tempInstance[i]['tierName'].split(",")[k]; //group case
          tempTierList.push(tier);
        }
      }

    }

    //Here object is a reference of selected Node
    let object = tempTierList[0];
    let arrTier = [];

    arrTier.push(tempTierList[0]);

    //For Standard Dropdown key-value
    let arrLabelForMode = ['Exact', 'Starts With', 'Ends With', 'Contains'];
    let arrValForMode = ['1', '2', '3', '4'];

    //For Custom Dropdown key-value
    let arrLabelForCustom = ['Equal', 'Starts With', 'Ends With', 'Contains'];
    let arrValForCustom = ['EQ', 'SW', 'EW', 'CON'];

    //Creating Dropdown for Tier Options
    for (let key in tempTierList) {
      this.tierListOption.push({ value: tempTierList[key], label: tempTierList[key] });
    }
    //Empty the variables of Standard
    this.selectedtierList = [];
    this.selectedtierList = [...arrTier];
    this.modeList = [];
    this.modeList = this.createListWithKeyValue(arrLabelForMode, arrValForMode);
    this.flowpathID = '';
    this.correlationID = [];

    //For Operation of Custom
    this.customDetail = new customData();
    this.operationList = [];
    this.operationList = this.createListWithKeyValue(arrLabelForCustom, arrValForCustom);
    this.customRulesData = [];
    this.selectedtierListForCustom = [...arrTier];
    this.customNameList = [];
    //Array to hold data(splitted data on basis of comma i.e ',') coming from server
    let arrCustomName = [];
    let host = this._config.getNodePresetURL();
    // let urlName = this._config.$getHostUrl + ":" + "80" + "/" +this._config.$productName.toLocaleLowerCase() + ('/v1/cavisson/netdiagnostics/ddr/config/searchByCustomDataOptions');
    let urlName = host + this._config.$productName.toLocaleLowerCase() + ('/v1/cavisson/netdiagnostics/ddr/config/searchByCustomDataOptions?productKey='+ sessionStorage.productKey);
    //Method : GET ,Getting data from backend to create dropdown for Name in Custom
    this.http.get(urlName, { responseType: 'text' })
      .subscribe(data => {
        if (data) {
          arrCustomName = data.toString().split(",");
          this.customNameList = this.createListWithKeyValue(arrCustomName, arrCustomName);
        }
      });

    //For Operation of Logs
    this.selectedtierListForLogs = [];
    this.selectedtierListForLogs = [...arrTier];

    this.searchByDialog = true;
  }



  /*when we close the store and again open from productui, appview was opening because in constructor we are making appview as true and geomap as false..to handle this we added this ngOnestroy*/
  ngOnDestroy() {
    this.datacontainer.$updateGeoMap = true;
    this.blockCheck = false;
    this.stopUpdate();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subs) {
      this.subs.unsubscribe();
    }

    if (this.routeParam) {
      this.routeParam.unsubscribe();
    }


  }
}

//To push Data into Array
export class ImmutableArray {
  //to add data in table
  static push(arr, newEntry) {
    console.log("[...arr, newEntry]--", [...arr, newEntry]);
    return [...arr, newEntry];
  }
}
//Used as DTO in Search By feature : Custom
export class customData {
  value: string;
  name: string;
  operationName?: { dropDownVal: string };
}

