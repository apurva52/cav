import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng';
import { ConfigSetting, GradientColorInfo } from './services/configuration-settings.model';
import { ConfigSettingLoadingState, ConfigSettingLoadingErrorState, ConfigSettingLoadedState } from './services/configuration-settings.state';
import { ConfigurationSettingService } from './services/configuration-settings.services';
import { Store } from 'src/app/core/store/store';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
import { SessionService } from 'src/app/core/session/session.service';
import { ActionInfo } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
// import { UPDATE_MONOCHROMATIC_WINDOW } from 'src/app/shared/actions.constants';

@Component({
  selector: 'app-configuration-settings',
  templateUrl: './configuration-settings.component.html',
  styleUrls: ['./configuration-settings.component.scss']
})
export class ConfigurationSettingsComponent implements OnInit {
  error: boolean;
  empty: boolean;
  errorMessage = "loading";
  loading: boolean;
  data: ConfigSetting[];

  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  activeTab: MenuItem;
  debugValue: SelectItem[];
  selectedOptions: MenuItem;
  selectedValues: string = 'saveConfigFile';
  selectedDebugValue: String = '0';
  selectedModuleDebugVale: String = '0';
  moduleDebugLevel: SelectItem[];
  options: SelectItem[];
  chkAllowPectData: boolean = false;
  percentileTxOpt: SelectItem[];
  selectedTxnPerctValue: any[] = [];
  arrDefaultTxnPctValue = [90];
  txnDetailThresholdValue: number = 300
  chkSelectedAllTxnValue: boolean = false;
  refreshTimeIntervalOpt: SelectItem[];
  selectedRefreshTime: number = 5;
  percentileOpt: SelectItem[];
  selectedPercentileValue: any[] = [];
  arrDefaultPctValue = [50, 80, 90, 95, 99];
  chkSelectedAllPctValues: boolean = false;
  setDynamicDashboardIntrvl: number = 1;
  chkDynamicWebDashboard: boolean = false;
  chkLoadFavCompSetting: boolean = false;
  chkLoadGraphTimeFav: boolean = false;
  chkScrollEvntZone: boolean = false;
  isRefreshGraphChecked: boolean = false;
  compareGroupMemberValue: number = -1;
  setQueryTimeoutValue: number = 300;
  tabIndex: number = 0;
  unifiedHostValue:string = '';
  val : string;
  module: any[] = [];
  selectedModuleName: string = "";
  isBackgroundColor: boolean = false;
  isColorPicker: boolean = false;
  isMonochromaticColor: boolean = false;
  isShowCrosshair: boolean = false;
  isGridLineEnable: boolean = false;
  setDecimalValue: number = 0;
  setTooltipThreshold: number = 0;
  setBoostThreshold: number = 200;
  setScalingThreshold: number = 10;
  selectedGraphScale: number = 0;
  graphSclaingOpt: SelectItem[];
  isLowerPanelEnable: boolean = true;
  setPaginationThreshold: number = 25;
  interWidgetUpdateDelayTime: number = 0;
  maxLimitForTimeDelay : number = 1440;
  maxLimitForDial: number = 10;
  areaGraphThreshold: number = -1;
  dialogVisible: boolean = false;
  content: InfoData;
  hmModuleDebugLevelWithName: Object;
  isAreaChartEnable: boolean = false;
  isPieChartEnable: boolean = false;
  isDonutChartEnable: boolean = false;
  isBarChartEnable: boolean = false;
  isStackedAreaEnable: boolean = false;
  isStackedBarEnable: boolean = false;
  gradientInChart: GradientColorInfo;
  isGeoMapCityLevelData: number = 1;
  numOfDivisionForScaleInGeoMap: string = 5 + '';
  geoMapExtMapPointSize: number = 3;
  geoMapExtCountryMap: string = 'USA';
  storeFav = '';
  storeRelPath = '';
  arrGeoMapGroupIdValue = [10210, 10215, 107, 3, 4, 6];
  arrGeoMapExtendedGroupIdValue = [10267, 10456, 107];
  isSaveConfig: boolean = false;
  color;



  constructor(
    private router : Router, private configSettings: ConfigurationSettingService, private sessionService: SessionService, private cd: ChangeDetectorRef, public confirmation :ConfirmationService
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration Setting' },
      { label: 'Dashboard Setting' },
    ]

    me.graphSclaingOpt = [
      {label: 'On' + '', value: 1 },
      {label: 'Off' + '', value: 0 }
    ]

      me.fillDebugValue();
      me.load();
  }

  load(){
    const me = this;
    if(!me.sessionService.dashboardConfigSettingData) {
      me.configSettings.load().subscribe(
        (state: Store.State) => {
          if(state instanceof ConfigSettingLoadingState){
            me.onLoading(state);
            return;
          }
          else if(state instanceof ConfigSettingLoadedState){
            me.onLoaded(state);
            return;
          }
        },
        (state: ConfigSettingLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }else {
      let state = new  ConfigSettingLoadedState();
      state.data = {...me.sessionService.dashboardConfigSettingData};
      me.onLoaded(state);
    }

  }

  private onLoading(state: ConfigSettingLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: ConfigSettingLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: ConfigSettingLoadedState){
    const me = this;
    me.data = state.data;
    console.log("value of data ???? ", me.data);
    me.empty = !me.data.length;
    me.error = false;
    me.loading = false;

    me.initializeConfigurationdata(me.data);
  }

  initializeConfigurationdata(data){
    const me = this;
    console.log("-initialize data", me.data);
    me.selectedDebugValue = data.debugLevelValue;
    me.isSaveConfig = data.saveSettings;
    me.arrDefaultPctValue = data.arrDefaultPercentileValues;
    me.selectedPercentileValue = data.arrPercentileValues;
    me.selectedTxnPerctValue = data.arrPercentileTxDetailValues;
    me.fillModuleDebugLevelName(data)
    me.fillTxRefreshValue(data);
    me.fillPercentileTxnValue();
    me.fillPercentileValues();
    me.fillFavoriteSettingsValue(data);
    me.fillGraphSettingCheckBox(data);
    me.fillGraphTreeValue(data);
    me.fillModuleDebugValue();
    me.fillDBAndQuerySettingValue(data);

  }

  fillPercentileTxnValue(){
    const me = this;
    me.percentileTxOpt = [];
        for (let i = 100; i >= 1; i--) {
            me.percentileTxOpt.push({label: i + '', value: i + ''});
        }
  }

  setDefaultTxnPctValue(){
    const me = this;
    me.selectedTxnPerctValue = [];
        for (let i = 0; i < me.arrDefaultTxnPctValue.length; i++) {
            me.selectedTxnPerctValue.push(me.arrDefaultTxnPctValue[i] + '');
        }
  }

  fillAllTxnPctValue(){
    const me = this;
    me.selectedTxnPerctValue = [];
      if (me.chkSelectedAllTxnValue === false) {
        me.selectedTxnPerctValue = [];
      } else {
         for (let i = 100; i >= 1; i--) {
            me.selectedTxnPerctValue.push(i + '');
        }
      }
  }

  fillPercentileValues(){
    this.percentileOpt = [];
        for (let i = 100; i >= 1; i--) {
            this.percentileOpt.push({label: i + '', value: i + ''});
        }
  }

  setDefaultPerctValue(){
    const me = this;
    me.selectedPercentileValue = [];
        for (let i = 0; i < me.arrDefaultPctValue.length; i++) {
            me.selectedPercentileValue.push(me.arrDefaultPctValue[i] + '');
        }
  }

  fillAllPerctValue(){
    const me = this;
    me.selectedPercentileValue = [];
      if (me.chkSelectedAllPctValues === false) {
        me.selectedPercentileValue = [];
      } else {
         for (let i = 100; i >= 1; i--) {
            me.selectedPercentileValue.push(i + '');
        }
      }
  }

  fillDebugValue(){
    const me = this;
    me.debugValue = [
      {label: "0", value: 0},
      {label: "1", value: 1},
      {label: "2", value: 2},
      {label: "3", value: 3},
      {label: "4", value: 4},
    ]
  }

  /**Fill module debug level name*/
  fillModuleDebugLevelName(data) {
    const me = this;
    try {
      me.module = [];
      let index = 0;
      for (let moduleName in me.data['hmModuleDebugLevel']) {
          let value = me.data['hmModuleDebugLevel'][moduleName] + '#' + moduleName;
              me.module.push({label: moduleName , value: value});
              console.log("-module list????" , me.module);
              if(index === 0) {
                  me.selectedModuleName = value;
                  me.selectedModuleDebugVale = me.data['hmModuleDebugLevel'][moduleName];

                }
              index++;
      }
      me.fillModuleDebugValue();
      me.selectedModuleDebugVale = this.selectedModuleName.split('#')[0];
     }catch (error) {
      console.error('Error in fillModuleDebugLevelName.');
     }
    }

    /**Fill module debug level value*/
    fillModuleDebugValue() {
      try {
        const me = this;
        this.moduleDebugLevel = [];
        for (let i = 0; i <= 4; i++) {
            this.moduleDebugLevel.push({label: i + '', value: i + ''});
        }
      }catch (error) {
         console.error('Error in fillModuleDebugValue.');
      }
    }

    /**Fill module debug level name to save on server*/
    onChangeModuleDebugLevelName(event, moduleDebugName) {
      try {
        let value = event.value.split('#');
        this.selectedModuleDebugVale = value[0];
        this.selectedModuleName = event.value;
      }catch (error) {
         console.error('Error in onChangeModuleDebugLevelName.');
      }
    }

    /**Fill module debug level value to save on server*/
    onChangeModuleDebugLevelValue(event, selectedModuleLevel) {
      try {
        let selectModule = this.selectedModuleName.split('#');
        let i = 0;
        for (var moduleName in this.data['hmModuleDebugLevel']) {
          if (moduleName == selectModule[1]) {
            let value = event.value + '#' + moduleName;
            this.module[i] = {label: moduleName , value: value};
            this.selectedModuleName = value;
          }
          i++;
        }

      }catch (error) {
         console.error('Error in onChangeModuleDebugLevelValue.');
      }
    }

  fillTxRefreshValue(data){
    const me = this;
    me.refreshTimeIntervalOpt = [];
    for (let i = 1 ; i <= 60; i++) {
      me.refreshTimeIntervalOpt.push({label: i + '', value: i});
    }
    me.selectedRefreshTime = data.txRefreshTimeInterval;
    me.txnDetailThresholdValue = data.txPaginationThreshold;
    me.chkAllowPectData = data.txPercentileSetting;

  }

  /**fill favorite settings */
  fillFavoriteSettingsValue(data){
    try{
      const me = this;
      me.setDynamicDashboardIntrvl = data.dynamicWDRefreshInterval;

      if(data.favoriteSetting === 'on'){
        me.chkLoadGraphTimeFav = true
      }
      if(data.loadCompareSettingWithFav === 'on'){
        me.chkLoadFavCompSetting = true;
      }
      if(data.enabledynamicwebdashboard === 1){
        me.chkDynamicWebDashboard = true;
      }
      if(data.executeRefreshOutsideAngularZone === 1){
        me.chkScrollEvntZone = true;
      }
    }catch(error){

    }
  }

  /**Fill check box of graph setting*/
  fillGraphSettingCheckBox(data){
    try{
      const me = this;
      if(data.enabledBackgroundColor === true){
        me.isBackgroundColor = true;
        me.isColorPicker = false;
      }
      else{
        me.isBackgroundColor = false;
        me.isColorPicker = true;
      }

      if(data.isEnableCrosshairInChart === true){
        me.isShowCrosshair = true;
      }
      else{
        me.isShowCrosshair = false;
      }

      if(data.isEnableGridLineInChart === true){
        me.isGridLineEnable = true;
      }
      else{
        me.isGridLineEnable = false;
      }

      if(data.gradientColorDTO.areaChart === 1){
        me.isAreaChartEnable = true;
      }

      if(data.gradientColorDTO.barChart === 1){
        me.isBarChartEnable = true;
      }

      if(data.gradientColorDTO.stackedAreaChart === 1){
        me.isStackedAreaEnable = true;
      }

      if(data.gradientColorDTO.stackedBarChart === 1){
        me.isStackedBarEnable = true;
      }

      if(data.gradientColorDTO.donutChart === 1){
        me.isDonutChartEnable = true;
      }

      if(data.gradientColorDTO.pieChart === 1){
        me.isPieChartEnable = true;
      }

      me.isMonochromaticColor = data.monochromaticColorEnable;
      me.setDecimalValue = data.showdecimalDigitsOfYAxis;
      me.setTooltipThreshold = data.sharedTooltipThreshold;
      me.setBoostThreshold = data.seriesBoostThreshold;
      me.setScalingThreshold = data.scalingThreshold;
      me.selectedGraphScale = data.enableGraphScaling;
      me.isLowerPanelEnable = data.lowerPaginationEnable;
      me.setPaginationThreshold = data.paginationThreshold;
      me.interWidgetUpdateDelayTime = data.interWidgetUpdateDelayTime;
      me.maxLimitForTimeDelay = data.maxLimitForTimeDelay;
      me.maxLimitForDial = data.maxLimitForDial;
      me.color = data.backgroundColor;
      me.areaGraphThreshold = data.areaRangeEnabledThreshold;

    }catch(error){

    }
  }

  fillGraphTreeValue(data){
    try{
      const me = this;
      if(data.refreshTreeOnGdfChange === 1){
        me.isRefreshGraphChecked = true;
      }
      me.compareGroupMemberValue = data.compareGroupMemberLevel;

    }catch(error){

    }
  }

  /**fill value of DB Setting and Query Setting fields */
  fillDBAndQuerySettingValue(data){
    try{
     const me = this;
      me.setQueryTimeoutValue = data.queryTimeout;
      me.unifiedHostValue = data.queryHostPortValue;
    }
    catch(error){

    }
  }

  /**method to save config setting */
  saveConfigurationSettings(){
     try{
       const me = this;

       if(me.setDecimalValue == null || !me.setDecimalValue){
         me.alertMsg("Show Decimal Digits cannot be blank", "Error");
         return;
       }

       if(me.setTooltipThreshold > 100 || me.setTooltipThreshold < 0){
         me.alertMsg("Please Enter Shared Tooltip Threshold from 0 to 100", "Error");
         return;
       }

       if(me.setTooltipThreshold == null || !me.setTooltipThreshold){
         me.alertMsg("Shared Tooltip Threshold field cannot be blank", "Error");
         return;
       }

       if(me.setBoostThreshold == null || !me.setBoostThreshold){
         me.alertMsg("Series Boost Threshold filed cannot be blank", "Error");
         return;
       }

       if(me.setBoostThreshold > 10000 || me.setBoostThreshold <= 0){
         me.alertMsg("Please Enter Series Boost Threshold from 0 to 10000", "Error");
         return;
       }

       if(me.maxLimitForDial == null || !me.maxLimitForDial){
        me.alertMsg("Maximum limit for Dial/Meter cannot be blank", "Error");
        return;
       }

       if(me.maxLimitForDial > 50 || me.maxLimitForDial <= 0){
         me.alertMsg("Please Enter maximum limit for Dial/Meter from 1 to 50", "Error");
         return;
       }

       if(me.interWidgetUpdateDelayTime == null || !me.interWidgetUpdateDelayTime){
        me.alertMsg("Delay Time field cannot be blank", "Error");
        return;
       }

       if(me.interWidgetUpdateDelayTime > 1000 || me.interWidgetUpdateDelayTime < 0){
         me.alertMsg("Please Enter Delay Time between 0 to 1000", "Error");
         return;
       }

       if(me.txnDetailThresholdValue == null || !me.txnDetailThresholdValue){
        me.alertMsg("Threshold for pagination field cannot be blank", "Error");
        return;
       }

       if(me.txnDetailThresholdValue > 1000 || me.txnDetailThresholdValue < 20){
         me.alertMsg("Please enter threshold for pagination from 20 to 1000 in Transaction Details .", "Error");
         return;
       }

       if(me.setPaginationThreshold == null || !me.setPaginationThreshold){
        me.alertMsg("Lower Panel Pagination Threshold field cannot be blank", "Error");
        return;
       }

       if(me.setPaginationThreshold > 5000 || me.setPaginationThreshold < 1){
         me.alertMsg("Please Enter Lower Panel Pagination Threshold from 1 to 5000", "Error");
         return;
       }

       if(me.setDynamicDashboardIntrvl == null || !me.setDynamicDashboardIntrvl){
        me.alertMsg("Dynamic WebDashboard field cannot be blank", "Error");
        return;
       }

       if(me.setDynamicDashboardIntrvl > 1000 || me.setDynamicDashboardIntrvl < 1){
         me.alertMsg("Please enter refresh interval For Dynamic WebDashboard from 1 to 1000", "Error");
         return;
       }

       if(me.setQueryTimeoutValue == null || !me.setQueryTimeoutValue){
        me.alertMsg("Query Timeout field cannot be blank", "Error");
        return;
       }

       if(me.setQueryTimeoutValue > 99999 || me.setQueryTimeoutValue < 1){
         me.alertMsg("Please enter QueryTimeout value from 1 to 99999", "Error");
         return;
       }

       if(me.areaGraphThreshold == null || !me.areaGraphThreshold){
         me.alertMsg("Area-Range graph threshold cannot be blank", "Error");
         return;
       }

       me.hmModuleDebugLevelWithName = me.data['hmModuleDebugLevel'];
       me.hmModuleDebugLevelWithName = {};

       for (let i = 0; i < me.module.length; i++) {
        let arrvalue = me.module[i].value.split('#');
        let module_name = me.module[i].label;
        let module_debuglevel = arrvalue[0];
        this.hmModuleDebugLevelWithName[module_name] = module_debuglevel;
       }

       me.setGradientColorValue();

      /**to set geo map value */
       let arrGeoMapGroupIdValue = me.data['arrGeoMapGroupIdValue'];
       me.numOfDivisionForScaleInGeoMap = me.data['numOfDivisionForScaleInGeoMap'];
       me.isGeoMapCityLevelData = me.data['isGeoMapCityLevelData'];
       me.geoMapExtMapPointSize = me.data['geoMapExtMapPointSize'];
       me.geoMapExtCountryMap = me.data['geoMapExtCountryMap'];

       me.storeFav = me.data['storeFav'];
       me.storeRelPath = me.data['storeRelPath'];

       me.sessionService.$thresholdForScaling = me.setScalingThreshold;

       /*check if arrGeoMapGroupIdValue in null if it is null then take the Default Group Id value*/
      if (arrGeoMapGroupIdValue !== null) {
        me.arrGeoMapGroupIdValue = arrGeoMapGroupIdValue;
      }

      let arrGeoMapExtendedGroupIdValue = me.data['arrGeoMapExtendedGroupIdValue'];
      if (arrGeoMapExtendedGroupIdValue !== null) {
        me.arrGeoMapExtendedGroupIdValue = arrGeoMapExtendedGroupIdValue;
      }

      let loadFav = 'off';
      let loadFavWithCmp = 'off';
      let loadFavWithWebDash = 0;
      let enableWidgetWiseUpdate = 0;
      let executeRefreshOutsideAngularZone =0;
      if(me.chkLoadGraphTimeFav){
        loadFav = 'On';
      }
      if(me.chkLoadFavCompSetting){
        loadFavWithCmp = 'On';
      }
      if(me.chkDynamicWebDashboard){
        loadFavWithWebDash = 1;
      }
      if(me.chkScrollEvntZone){
         me.sessionService.executeRefreshOutsideAngularZone = me.chkScrollEvntZone;
         executeRefreshOutsideAngularZone = 1;
      }
      else{
        me.sessionService.executeRefreshOutsideAngularZone = false;
      }

      me.CheckRefreshTreeGraph(me.isRefreshGraphChecked);

      /* sorting tx percentile array in asc order */
     me.selectedPercentileValue =  me.selectedPercentileValue.sort(function(a, b){return a-b});

     /* sorting tx percentile array in asc order */
      me.selectedTxnPerctValue =  me.selectedTxnPerctValue.sort(function(a, b){return a-b});

      let configData = {
        debugLevelValue : me.selectedDebugValue,
        arrPercentileValues: me.selectedPercentileValue,
        arrPercentileTxDetailValues: me.selectedTxnPerctValue,
        saveSettings: me.isSaveConfig,
        hmModuleDebugLevel: me.hmModuleDebugLevelWithName,
        arrDefaultPercentileValues: me.arrDefaultPctValue,
        arrDefaultTxPercentileValues: me.arrDefaultTxnPctValue,
        gradientColorDTO: me.gradientInChart,
        favoriteSetting: loadFav,
        loadCompareSettingWithFav: loadFavWithCmp,
        enabledynamicwebdashboard: loadFavWithWebDash,
        arrGeoMapGroupIdValue: me.arrGeoMapGroupIdValue,
        arrGeoMapExtendedGroupIdValue: me.arrGeoMapExtendedGroupIdValue,
        numOfDivisionForScaleInGeoMap: me.numOfDivisionForScaleInGeoMap,
        isGeoMapCityLevelData: me.isGeoMapCityLevelData,
        geoMapExtMapPointSize: me.geoMapExtMapPointSize,
        geoMapExtCountryMap: me.geoMapExtCountryMap,
        showdecimalDigitsOfYAxis: me.setDecimalValue,
        sharedTooltipThreshold: me.setTooltipThreshold,
        seriesBoostThreshold: me.setBoostThreshold,
        maxLimitForDial: me.maxLimitForDial,
        maxLimitForTimeDelay: me.maxLimitForTimeDelay,
        interWidgetUpdateDelayTime: me.interWidgetUpdateDelayTime,
        txPercentileSetting: me.chkAllowPectData,
        storeFav: me.storeFav,
        storeRelPath: me.storeRelPath,
        refreshTreeOnGdfChange: me.data['refreshTreeOnGdfChange'],
        isEnableGridLineInChart: me.isGridLineEnable,
        isEnableCrosshairInChart: me.isShowCrosshair,
        txRefreshTimeInterval: me.selectedRefreshTime,
        txPaginationThreshold: me.txnDetailThresholdValue,
        enableGraphScaling: me.selectedGraphScale,
        monochromaticColorEnable: me.isMonochromaticColor,
        paginationThreshold: me.setPaginationThreshold,
        lowerPaginationEnable: me.isLowerPanelEnable,
        compareGroupMemberLevel: me.compareGroupMemberValue,
        areaRangeEnabledThreshold: me.areaGraphThreshold,
        dynamicWDRefreshInterval: me.setDynamicDashboardIntrvl,
        queryTimeout: me.setQueryTimeoutValue,
        queryHostPortValue: me.unifiedHostValue,
        scalingThreshold: me.setScalingThreshold,
        enableWidgetWiseUpdate: 1,
        executeRefreshOutsideAngularZone: executeRefreshOutsideAngularZone,
        backgroundColor: me.color,
        enabledBackgroundColor: me.isBackgroundColor
      }


      /*This is used for keep the information that graph scaling will be changed or not. */
      let isScalingChanges = false;
      let prevScalingMode = me.data['enableGraphScaling'];
      let prevScalingThreshold = me.data['scalingThreshold'];

      if(prevScalingMode !== me.selectedGraphScale){
        isScalingChanges = true;
      }

      /*checking with the previous graph scaling threshold value if previous graph scaling threshold value
      will be changed then we need to load the panel with current favorite . */
      let isScalingThresholdChanged = false;
      if (prevScalingThreshold !== me.setScalingThreshold) {
        isScalingThresholdChanged = true;
      }

      me.sessionService.dashboardConfigSettingData = {...configData};
      if(me.isSaveConfig) {
        me.configSettings.saveConfigSetting(configData).subscribe(res => {
          me.alertMsg("Configuration Data is updated successfully.", "Succcess");
        }
      )
      } else {
        me.alertMsg("Configuration Data is updated successfully.", "Succcess");
      }
    
        /* This is used to check if monochromatic is enable or not*/
       let colorInfo = new ActionInfo();
      //  colorInfo.action = UPDATE_MONOCHROMATIC_WINDOW;
       me.configSettings._configSettings.next(colorInfo);
     }
     catch(error){
       console.error("Error in saving config settings");
     }
  }

  setGradientColorValue(){
    try{
       const me = this;
       me.gradientInChart = me.data['gradientColorDTO'];
       if(me.isAreaChartEnable)
          me.gradientInChart.areaChart = 1;
       else
          me.gradientInChart.areaChart = 0;

       if(me.isPieChartEnable)
          me.gradientInChart.pieChart = 1;
       else
          me.gradientInChart.pieChart = 0;

       if(me.isDonutChartEnable)
          me.gradientInChart.donutChart = 1;
       else
          me.gradientInChart.donutChart = 0;

       if(me.isBarChartEnable)
          me.gradientInChart.barChart = 1;
       else
          me.gradientInChart.barChart = 0;

       if(me.isStackedAreaEnable)
          me.gradientInChart.stackedAreaChart = 1;
       else
          me.gradientInChart.stackedAreaChart = 0;

       if(me.isStackedBarEnable)
          me.gradientInChart.stackedBarChart = 1;
       else
          me.gradientInChart.stackedBarChart = 0;
    }
    catch(error){
      console.error("Error in setGradientColorValue")
    }
  }

  /** Check true or false for Refresh Graph Tree */
  CheckRefreshTreeGraph(isRefreshGraphChecked) {
    try {
      if (isRefreshGraphChecked) {
        this.data['refreshTreeOnGdfChange'] = '1';
      } else {
        this.data['refreshTreeOnGdfChange'] = '0';
      }
    } catch (error) {
       console.error('Error in CheckRefreshTreeGraph.');
    }
  }

  onTabChange(event){
     const me = this;
     me.tabIndex = event.index;
     if(me.tabIndex == 0)
         me.fillDebugValue();
     else if(me.tabIndex == 1)
         me.fillPercentileValues();
     else if(me.tabIndex == 2)
         me.fillPercentileTxnValue();
    //  else if(me.tabIndex == 3)

  }

   /* Method to change the value to display in slider. */
   formatThumbLabel(value: number | null) {
    try {
      if (!value) {
        return 0 + 'X';
      }
      return value + 'X';
    } catch (error) {
      console.error('Error in formatThumbLabel.');
    }
  }

  resetConfigSettings(){
    const me = this;
    me.initializeConfigurationdata(me.data);
  }

  onBackgroundColor() {
    try {
     if(this.isBackgroundColor) {
       this.isColorPicker = false;
     } else {
       this.isColorPicker = true;
       this.color = undefined;
     }
    } catch(e) {
      console.error(e);
    }
  }
 /**method to display error box */
  alertMsg(msg,header) {
    this.dialogVisible = true;
      this.confirmation.confirm({
        key: 'configSetting',
        message: msg,
        header: header,
        accept: () => { this.dialogVisible = false; },
        reject: () => { this.dialogVisible = false; },
        rejectVisible:false
      });
      this.cd.detectChanges();
  }
}
