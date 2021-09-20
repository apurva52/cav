export interface ConfigSetting{
    debugLevelValue: string;
     hmModuleDebugLevel: Object;
     arrPercentileValues: number[];
     arrPercentileTxDetailValues: number[];
     arrDefaultPercentileValues: number[];
     arrDefaultTxPercentileValues: number[];
     saveSettings: boolean;
     favoriteSetting: string;
     gradientColorDTO: GradientColorInfo;
     loadCompareSettingWithFav: string;
     numOfDivisionForScaleInGeoMap: string;
     arrGeoMapGroupIdValue: number[];
     isGeoMapCityLevelData: number;
     arrGeoMapExtendedGroupIdValue: number[];
     geoMapExtMapPointSize: number;
     geoMapExtCountryMap: string;
     enableDynamicWebDashboard: number;
     errorCode: number;
     wDConfigurationDTO: {};
     showdecimalDigitsOfYAxis: number;
     txPercentileSetting: boolean;
     transactionInAutoMode:boolean;
     storeFav: string;
     storeRelPath: string;
     refreshTreeOnGdfChange: string;
     txRefreshTimeInterval: number;
     sharedTooltipThreshold: number;
     seriesBoostThreshold: number;
     interWidgetUpdateDelayTime: number;
     maxLimitForTimeDelay : number;
     txPaginationThreshold: number;
     enableGraphScaling : number;
     monochromaticColorEnable:boolean;
     paginationThreshold: number;
     lowerPaginationEnable:boolean;
     enableAlertOverlay: boolean;
     compareGroupMemberLevel: number;
     dynamicWDRefreshInterval :number;
     handleSeriesGapBy: number;
     queryTimeout: number;
     scalingThreshold: number;
     parameterFavoriteLevel: number;
     enableWidgetWiseUpdate: number;
     executeRefreshOutsideAngularZone:number;
     queryHostPortValue: string;
     backgroundColor : string;
     enabledBackgroundColor :boolean;
     maxLimitForDial: number;
}

export interface GradientColorInfo {
    lineChart: number;
    areaChart: number;
    pieChart: number;
    donutChart: number;
    stackedBarChart: number;
    slabChart: number;
    stackedAreaChart: number;
    barChart: number;
    dualLineBar: number;
    percentileGraph: number;
    dialChartAVG: number;
    dailChartLast: number;
    dualAxisLine: number;
    lineStacked: number;
    minMaxGraph: number;
}

export interface ConfigResponse {
    saveAndUpdateConfigFile: boolean;
}