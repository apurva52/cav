export interface Dashboard2 {
  layout?: DashboardLayout;
  globalFavCTX?: DashboardGlobalFavCTX2;
  widgets?: DashboardWidget[];
  dashboardGraphTime?: DashboardViewByConfigList2;
  viewBy?: FavDetailCtxViewBy;
  interval?: number;
  selectedWidgetIndex?: number;
  gdfVersion?: string;
  activePartitionName?: string;
  paused?: boolean;
  showDiscontinued?: boolean;
  updatedBy?: string;
  isPublic?: boolean;
  dashboardGraphTimeMode?: boolean;
  isTrendCompareData?: boolean;
  getAllSamples?: boolean;
  settings?: DashboardSettings2;
}

export interface DashboardViewByConfigList2 {
  id?: string;
  name?: string;
}

export interface DashboardGlobalFavCTX2 {
  backToHealthWidget?: boolean;
  colorRules?: null;
  enableAlertOverlay?: boolean;
  favDesc?: string;
  favName?: string;
  favRelPath?: string;
  globalRuleInfo?: null;
  graphTime?: string;
  graphTimeLabel?: string;
  graphTimeMode?: number;
  includeCurrentData?: boolean;
  isPublic?: boolean;
  layoutId?: number;
  layoutInfo?: LayoutInfo2;
  numOfPanels?: number;
  pageInfo?: number[];
  parameteriazationMode?: boolean;
  preset?: string;
  relatedMetricsRuleInfo?: null;
  ruleType?: number;
  running?: boolean;
  showDiscontinuedGraphs?: boolean;
  strResolution?: string;
  timeFormat?: string;
  updateBy?: string;
  viewBy?: string;
}

export interface LayoutInfo2 {
  colMargin?: number;
  columns?: number;
  fitToScreen?: boolean;
  rowHeight?: number;
  rowMargin?: number;
}

export interface DashboardLayout {
  id?: string;
  type?: 'GRID' | 'GALLERY';
  configGrid?: DashboardGridLayoutConfig2;
  configGallery?: DashboardGalleryLayoutConfig2;
  name?: string;
  category?: string;
}

export interface DashboardGalleryLayoutConfig2 {
  enable?: boolean;
}

export interface DashboardGridLayoutConfig2 {
  cols?: number;
  rows?: number;
  rowHeight?: number;
  gridType?:
    | 'Fit'
    | 'ScrollVertical'
    | 'ScrollHorizontal'
    | 'Fixed'
    | 'VerticalFixed'
    | 'HorizontalFixed';
}

export interface DashboardSettings2 {
  categoryGraphInfo?: DashboardSettingsCategoryGraphInfo2;
}

export interface DashboardSettingsCategoryGraphInfo2 {
  categoryGroupId?: number;
  catGraphThreshold?: CatGraphThreshold2[];
}

export interface CatGraphThreshold2 {
  categoryGraphColor?: string;
  categoryGraphName?: string;
  categoryType?: string;
  range?: number;
}

export interface FavDetailCtxViewBy {
  selected?: string;
}

export interface DashboardWidget {
  id?: string;
  name?: string;
  description?: string;
  type?: 'GRAPH' | 'DATA' | 'TABULAR' | 'SYSTEM_HEALTH' | 'LABEL' | 'GRID';
  layout?: DashboardWidgetLayout2;
  panelJson?: DashboardPanelJSON2;
  dataCtx?: DashboardDataCtx;
  settings?: DashboardWidgetSettings;
  dataAttrName?: string;
  secondFilterValue?: number;
  scaleMode?: number;
  widgetIndex?: number;
  include?: boolean;
  icon?: string;
  iconTooltip?: string;
  graphSampleFilters?: Array<DashboardWidgetGraphSampleFilter2>;
}

export interface DashboardWidgetGraphSampleFilter2 {
  graphName?: string;
  groupId?: number;
  graphId?: number;
  filterType?: string;
  filterBasedOn?: string;
  filterValue1?: number;
  filterValue2?: number;
}

export interface DashboardDataCtx {
  gCtx?: GCtx[];
  correlated?: Correlated;
  ft?: Ft;
  selfTrend?: number;
  compare?: null;
}

export interface Correlated {
  min?: number;
  max?: number;
  buckets?: number;
}

export interface Ft {
  typ?: number;
  in?: number;
  opt?: string;
  val1?: number;
  val2?: number;
}

export interface GCtx {
  subject?: Subject;
  measure?: Measure;
  glbMetricId?: number;
  derivedFormula?: null;
}

export interface Measure {
  mgType?: string;
  mgTypeId?: number;
  mg?: string;
  mgId?: number;
  metric?: string;
  metricId?: number;
}

export interface Subject {
  tags?: Tag[];
}

export interface Tag {
  key?: string;
  value?: string;
}

export interface DashboardWidgetLayout2 {
  cols?: number;
  rows?: number;
  x?: number;
  y?: number;
}

export interface DashboardPanelJSON2 {
  alertETime?: number;
  alertGGVNotInCurPartition?: boolean;
  alertSTime?: number;
  arrGraphSampleFilterDTO?: null;
  bCritical?: string;
  bMajor?: string;
  bMinor?: string;
  btSplitInfo?: string;
  captionOverridden?: boolean;
  chartType?: number;
  checkWidget?: boolean;
  colorBandRedToGreen?: boolean;
  colorOptionForGeoMap?: number;
  compareBaselineEnable?: boolean;
  curPanelIndex?: number;
  dataCenterForPanel?: string;
  dataSourceType?: string;
  dial_Meter_Exp?: string;
  disableParametrization?: boolean;
  enableMultiDial?: boolean;
  externalFilePath?: string;
  filterByValue?: string;
  geoByUSA?: boolean;
  geoMapExtendedFilterDTO?: string;
  geoMapThreshold?: string;
  graphStatsType?: number;
  graphTime?: string;
  graphTimeLabel?: string;
  includeCurrentData?: boolean;
  isMinMaxGraph?: boolean;
  mapData?: string;
  mapKey?: string;
  monochronicColorBandHighToLow?: boolean;
  multiDialCount?: string;
  nfQueryParam?: null;
  numOfGraphs?: number;
  panelCaption?: string;
  panelFavName?: string;
  panelFavRelativePath?: string;
  panelGraphAlertOverlayInfo?: null;
  panelGraphArr?: PanelGraphArr[];
  panelRefreshInterval?: number;
  panelWiseMonochromaticTheme?: string;
  pctOrSlabValue?: number;
  preset?: string;
  primaryYAxisLabel?: string;
  running?: boolean;
  scaleBySelectedGraph?: string;
  scaleMode?: number;
  secondaryYAxisLabel?: string;
  selectedFavLevel?: string;
  selectedPanelTimeDelay?: number;
  showChartValue?: boolean;
  showLegend?: boolean;
  showLegendOnWidget?: boolean;
  showLegendPosition?: string;
  showPieData?: boolean;
  showRankAndScore?: boolean;
  strResolution?: string;
  timeFormat?: string;
  trendMode?: string;
  validGraphCountForFilters?: number;
  viewBy?: string;
  viewByList?: Array<string>;
  widget?: PanelJSONWidget;
  widgetRuleInfo?: null;
}

export interface PanelGraphArr {
  arrPanelGraphFieldInfo?: null;
  color?: null;
  dataCenterName?: string;
  dataSourceType?: number;
  derFormula?: string;
  derGraphDesc?: string;
  derGraphId?: number;
  derGraphName?: string;
  derGraphNumber?: number;
  derGroupDesc?: string;
  derGroupID?: number;
  derGroupName?: string;
  derived?: boolean;
  derivedArithmeticMultiDcProperty?: string;
  derReportName?: string;
  graphDatatype?: string;
  graphFormula?: string;
  graphId?: number;
  graphStatsType?: number;
  groupBy?: boolean;
  groupByMetaData?: string;
  groupId?: number;
  metaDataInfo?: string;
  originalFormula?: string;
  pattern?: string;
  patternFormula?: string;
  scaleFactor?: number;
  selected?: boolean;
  tavgSet?: string[];
  vecName?: string;
  visible?: boolean;
}

export interface PanelJSONWidget {
  backgroundColor?: string;
  bold?: boolean;
  col?: number;
  dataAttrName?: string;
  description?: string;
  displayWidgetFontColor?: string;
  displayWidgetFontFamily?: string;
  gridLineWidth?: number;
  gridOptions?: PanelGridOptions;
  iconColor?: string;
  iconSelected?: boolean;
  italic?: boolean;
  name?: string;
  row?: number;
  sizeX?: number;
  sizeY?: number;
  underline?: boolean;
  widgetId?: number;
  widgetType?: number;
  xAxis?: boolean;
  dataWidget?: DashboardWidgetTypeDataConfig;
  healthWidget?: DashboardWidgetTypeSystemHealthConfig;
  textWidget?: DashboardWidgetTypeTextConfig;
}

export interface DashboardWidgetTypeDataConfig {
  dataAttrName?: string;
  dataDisplayName?: string;
  dataImgName?: string;
  bgColor?: string;
  fontColor?: string;
  prefix?: string;
  suffix?: string;
  showIcon?: boolean;
  showTitleBar?: boolean;
  valueFontColor?: string;
  textFontColor?: string;
  displayFontSize?: string;
  valueFontSize?: string;
  displayFontFamily?: string;
  valueFontFamily?: string;
  decimalConverter?: string;
  format?: string;
}

export interface PanelGridOptions {
  enableSorting?: boolean;
  enableColumnResizing?: boolean;
  enableFiltering?: boolean;
  enableGridMenu?: boolean;
  showGridFooter?: boolean;
  showColumnFooter?: boolean;
  fastWatch?: boolean;
  rowHeight?: number;
  tableHeight?: number;
  tableType?: string;
  columnDefs?: Array<DashboardWidgetTypeTableColumnDef>;
}

export interface DashboardWidgetTypeSystemHealthConfig {
  dataAttrName?: string;
  dataImgName?: string;
  bgColor?: string;
  fontColor?: string;
  healthWidgetSeverityDef?: HealthWidgetSeverityDef;
  healthWidgetRuleInfo?: HealthWidgetRuleInfo;
  severity?: string;
  status_font_family?: string;
  status_font_size?: string;
  value_font_family?: string;
  value_font_size?: string;
  title_font_family?: string;
  title_font_size?: string;
  isGraphNameOnTop?: boolean;
}

export interface HealthWidgetRuleInfo {
  criticalPct?: number;
  criticalSeverity?: string;
  criticalCondition?: string;
  criticalAnotherPct?: number;
  criticalAnotherSeverity?: string;
  majorPct?: number;
  majorSeverity?: string;
  majorCondition?: string;
  majorAnotherPct?: number;
  majorAnotherSeverity?: string;
  showSecdCondForCritical?: boolean;
  showSecdCondForMajor?: boolean;
  isCriticalOperator?: boolean;
  isMajorOperator?: boolean;
}

export interface HealthWidgetSeverityDef {
  criticalMSRString?: string;
  criticalValue?: number;
  majorMSRString?: string;
  majorValue?: number;
}

export interface DashboardWidgetTypeTextConfig {
  text?: string;
  bold?: string;
  italic?: string;
  underline?: string;
  align?: string;
  showTextArea?: boolean;
  fontSize?: string;
  fontFamily?: string;
  fontColor?: string;
  rotate?: string;
  origin?: string;
  height?: string;
  width?: string;
  bgColor?: string;
}

export interface DashboardWidgetSettings {
  monochromatic?: boolean;
  dataSourceType?: 'METRIC' | 'LOG';
  baseline?: DashboardBaselineConfig2;
  baselineCompare?: DashboardBaselineCompareConfig;
  types?: DashboardWidgetSettingsTypes;
  caption?: DashboardWidgetCaptionConfig;
  graphStatsType?: string;
  multiDial?: DashboardMultiDialConfig2;
  blank?: boolean;
  alertOverlay?: boolean;
  viewBy?: DashboardViewByConfig2;
  ruleType?: number;
}

export interface DashboardBaselineConfig2 {
  critical?: string;
  major?: string;
  minor?: string;
}

export interface DashboardBaselineCompareConfig {
  enabled?: boolean;
  trendMode?: string;
}

export interface DashboardWidgetCaptionConfig {
  overriden?: boolean;
  caption?: string;
}

export interface DashboardMultiDialConfig2 {
  enabled?: string;
  count?: string;
}

export interface DashboardWidgetSettingsTypes {
  graph?: DashboardWidgetTypeGraphConfig;
  data?: DashboardWidgetTypeDataConfig;
  table?: DashboardWidgetTypeTableConfig;
  systemHealth?: DashboardWidgetTypeSystemHealthConfig;
  text?: DashboardWidgetTypeTextConfig;
}

export interface DashboardWidgetTypeGraphConfig {
  type?: string;
  gridLineWidth?: number;
  xAxis?: boolean;
  yAxis?: boolean;
  underline?: boolean;
  italic?: boolean;
  bold?: boolean;
  iconSelected?: boolean;
  displayWidgetFontColor?: string;
  bgColor?: string;
  iconColor?: string;
  displayWidgetFontFamily?: string;
  showLegends?: boolean;
  showLegendOnWidget?: boolean;
  showChartValue?: boolean;
  selectedWidgetTimeDelay?: number;
  legendAlignmentOnWidget?: string;
  selectedFavLevel?: string;
  arrPct?: number[];
}

export interface DashboardWidgetTypeTableConfig {
  enableSorting?: string;
  enableColumnResizing?: string;
  enableFiltering?: string;
  enableGridMenu?: string;
  showGridFooter?: string;
  fastWatch?: string;
  rowHeight?: string;
  tableHeight?: string;
  tableType?: string;
  cols?: Array<DashboardWidgetTypeTableColumnDef>;
  bgColor?: string;
  format?: string;
}

export interface DashboardWidgetTypeTableColumnDef {
  field?: string;
  width?: string;
  minWidth?: string;
  cellClass?: string;
  dataAttrName?: string;
  headerCellClass?: string;
  type?: string;
  displayName?: string;
  headerTooltip?: string;
  cellFilter?: string;
}

export interface DashboardViewByConfig2 {
  selected: string;
  list: DashboardViewByConfigList2[];
}

export interface DashboardRequest2 {
  name: string;
  path: string;
}
