import { EventEmitter } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { DashboardWidgetComponent } from '../widget/dashboard-widget.component';
import { Observable, Subject, interval } from 'rxjs';
import { TimebarTimeConfig } from '../../time-bar/service/time-bar.model';
import { ClientCTX } from 'src/app/core/session/session.model';
import { Measurement, SnapShot } from '../../compare-data/service/compare-data.model';
import { SelectItem } from 'primeng';
import { TestInitialisationComponent } from 'src/app/pages/tools/advanced/current-sessions/test-initialisation/test-initialisation.component';

export interface DashboardEvents {
  loadingStart: Subject<void>;
  destroyed: Subject<void>;
  widgetReloadData: Subject<void>;
  widgetPauseAutoDataRefresh: Subject<void>;
  widgetResumeAutoDataRefresh: Subject<void>;
  widgetInit: Subject<DashboardWidgetComponent>;
  widgetSelected: Subject<DashboardWidgetComponent>;
  widgetDeselected: Subject<DashboardWidgetComponent>;
  dashboardTimeChanged: Subject<DashboardTime>;
  analysisModeChanged: Subject<boolean>;
  focusModeChanged: Subject<boolean>;
  analysisModeToggle: Subject<boolean>;
}

export type DashboardLayoutMode = 'VIEW' | 'EDIT';

export interface DashboardTime {
  graphTimeKey: string;
  graphTimeLabel: string;
  viewBy: number;
  viewByLabel: string;
  viewByMs: number;
  time: TimebarTimeConfig;
}

/// ---------------------------------------------

export interface DashboardUpdateRequest {
  graphTimeKey: string;
  viewBy: string;
  compare: boolean;
  online: boolean;
  running: boolean;
  includeCurrentData: boolean;
  showDiscontinuedGraphs: boolean;
}

/***---- New API Models ----***/

export interface DashboardLoadReq {
  opType?: number;
  cctx?: ClientCTX;
  tr?: number;
  compareCtx?: CompareCTX;
  multiDc?: boolean;
  favCtx?: DashboardFavCTX;
}

export interface CompareCTX {
  trx: string;
  measurements: string;
}

export interface DashboardFavCTX {
  favNameCtx?: DashboardFavNameCTX;
  favDetailCtx?: DashboardFavDetailCTX;
  oldfavNameCtx?: DashboardFavNameCTX;
}

export interface DashboardFavNameCTX {
  name: string;
  path: string;
}

export interface DashboardFavDetailCTX {
  activePartitionName?: string;
  dashboardGraphTime?: DashboardGraphTime;
  dashboardGlobalRule?: DashboardGlobalRule;
  dashboardGraphTimeMode?: boolean;
  gdfVersion?: string;
  getAllSamples?: boolean;
  globalFavCtx?: DashboardGlobalFavCTX;
  interval?: number;
  layout?: DashboardLayout;
  paused?: boolean;
  public?: boolean;
  isPublic?: boolean;
  selectedWidgetIndex?: number;
  settings?: DashboardSettings;
  showDiscontinued?: boolean;
  status?: WidgetLoadResStatus;
  trendCompareData?: boolean;
  updatedBy?: string;
  viewBy?: DashboardFavDetailCTXViewBy;
  widgets?: DashboardWidget[];
  readWriteMode?: number;
  createdDate?: string;
  owner?: string;
  description?: string;
  //TODO: Add Error para to backend
  error?: AppError;
}


export interface DashboardGlobalRule {
  subject?: GraphDataCTXSubject;
  measure?: DashboardGraphDataCTXMeasure;
  opType?: number;
}

export interface DashboardGraphTime {
  id?: string;
  name?: string;
}

export interface DashboardViewByConfigList {
  id?: string;
  name?: string;
}

export interface DashboardGlobalFavCTX {
  backToHealthWidget?: boolean;
  enableAlertOverlay?: boolean;
  favDesc?: string;
  favName?: string;
  favPublic?: boolean;
  favRelPath?: string;
  globalRuleInfo?: DashboardGlobalRuleInfo;
  includeCurrentData?: boolean;
  layoutId?: number;
  parameteriazationMode?: boolean;
  relatedMetricsRuleInfo?: RelatedMetricsRuleInfo;
  ruleType?: number;
  running?: boolean;
  isShowDiscontinuedGraphs?: boolean;
  updateBy?: string;
}

export interface DashboardGlobalRuleInfo {}

export interface RelatedMetricsRuleInfo {}

export interface DashboardLayout {
  category?: string;
  configGallery?: DashboardGalleryLayoutConfig;
  configGrid?: DashboardGridLayoutConfig;
  icon?: string;
  id?: string;
  name?: string;
  type?: 'GRID' | 'GALLERY';
}

export interface DashboardGalleryLayoutConfig {
  enable?: boolean;
}

export interface DashboardGridLayoutConfig {
  cols?: number;
  gridType?:
    | 'Fit'
    | 'ScrollVertical'
    | 'ScrollHorizontal'
    | 'Fixed'
    | 'VerticalFixed'
    | 'HorizontalFixed';
  row?: number;
  rowHeight?: number;
  widgetLayouts?: Array<DashboardWidgetLayout>;
}

export interface DashboardWidgetLayout {
  cols: number;
  rows: number;
  x: number;
  y: number;
  layerIndex?: 1 | 2;
}

export interface DashboardSettings {
  categoryGraphInfo?: DashboardSettingsCategoryGraphInfo;
}

export interface DashboardSettingsCategoryGraphInfo {
  categoryGroupId?: number;
  catGraphThreshold?: CatGraphThreshold[];
}

export interface CatGraphThreshold {
  categoryGraphColor?: string;
  categoryGraphName?: string;
  categoryType?: string;
  range?: number;
}

export interface DashboardFavDetailCTXViewBy {
  list?: DashboardViewByConfigList[];
  selected?: string;
}

export interface DashboardWidget {
  dataAttrName?: string;
  displayName?: string;
  dataCtx?: DashboardDataCTX;
  description?: string;
  graphs?: DashboardGraphs;
  //graphSettings?: { [key: string]: GraphSetting }; // TODO: Add object to handle Graph interaction
  graphSettings? : GraphSetting ;
  icon?: string;
  id?: string;
  iconTooltip?: string;
  include?: boolean;
  layout?: DashboardWidgetLayout;
  name?: string;
  ruleType?: number;
  scaleBySelectedGraph?: string;
  scaleMode?: number;
  settings?: DashboardWidgetSettings;
  type?:
    | 'GRAPH'
    | 'DATA'
    | 'TABULAR'
    | 'SYSTEM_HEALTH'
    | 'LABEL'
    | 'GRID'
    | 'GROUP'
    | 'IMAGE'
    | 'FILE';
  widgetIndex?: number;
  zoomInfo?: ZoomInfo;
  widgetWiseInfo?: WidgetWiseTimeInfo;
  isCompareData?: boolean;
  compareDialogIndex?: number;
  selectCompareWidget?: boolean;
  isWidgetWiseCompare?: boolean;
  isTrendCompare?: boolean;
  trendList?: Measurement[];
  isApplyCompare?: boolean;
  isSelectedWidget?: boolean;
  dropTree?: boolean;
  mergeMetric?: boolean;
  openMerge?:boolean;
  isWidgetSettingChanged?: boolean;
  patternMatchBaselineFromLowerPanel?: string;
  newWidget?:boolean;
  isLowerPaneOpen?: boolean;
  compareZoomInfo?:any;
  disableCompare?:boolean;
  opName?: string;
  compareData? : SnapShot;
  withOutCompareColor?: string;
  et? : any;
}


export interface WidgetWiseTimeInfo {
  widgetId?: number;
  widgetWise?: boolean;
  secondTime?: boolean;
  duration?: TsdbCTXDuration;
}

export interface ZoomInfo {
  widgetId?: number;
  isZoom?: boolean;
  originalSt?: number;
  originalEt?: number;
  times?: ZoomChartTimeArray[];

}


export interface ZoomChartTimeArray {
  zoomSt?: number;
  zoomEt?: number;
}

export interface GraphSetting {
  color?: string;
  garbage?: boolean;
  selected?: boolean;
  visible?: boolean;
  isForcefullyColorChange ? : boolean;
}

export interface DashboardDataCTX {
  gCtx?: DashboardGraphDataCTX[];
  correlated?: DashboardDataCTXCorrelated;
  ft?: DashboardDataCTXDataFilter;
  selfTrend?: number;
  compare?: DashboardDataCTXCompare;
}

export interface DashboardDataCTXCompare {
  trendCompare?: boolean;
  duration?: TsdbCTXDuration;
}

export interface DashboardDataCTXCorrelated {
  min?: number;
  max?: number;
  buckets?: number;
}

export interface DashboardDataCTXDataFilter {
  typ?: any;
  in?: boolean;
  opt?: string;
  val1?: number;
  val2?: number;
}

export interface DashboardGraphDataCTX {
  baselineCtx?: BaselineCTX;
  subject?: GraphDataCTXSubject;
  measure?: DashboardGraphDataCTXMeasure;
  glbMetricId?: number;
  derivedFormula?: string;
  dataCenter?: string;
}

export interface BaselineCTX {
  maxValue?: number;
  minValue?: number;
  totalBucket?: number;
}

export interface DashboardGraphDataCTXMeasure {
  mgType?: string;
  mgTypeId?: number;
  mg?: string;
  mgId?: number;
  metric?: string;
  metricId?: number;
}

export interface GraphDataCTXSubject {
  tags?: GraphDataCTXSubjectTag[];
}

export interface GraphDataCTXSubjectTag {
  appName?: string;
  key?: string;
  value?: string;
  sName?: string;
  sMeta?: string;
  mode?: number;
}

export interface DashboardGraphs {
  widgetGraphs?: DashboardWidgetGraph[];
  widgetRule?: WidgetRuleInfo;
}

export interface WidgetRuleInfo {
  groupId?: number;
  graphId?: string;
  vectorName?: string;
  operationType?: string;
  metaDataInfoList?: WidgetRuleInfoMetaDataInfo[];
  isLeafNode?: boolean;
  filterByValue?: FilterByValue;
  globalRuleStartIndex?: number;
  graphStatsType?: string;
  graphShowTogether?: boolean;
  openMemberScalarGroup?: boolean;
  excOverallMetric?: boolean;
}

export interface WidgetRuleInfoMetaDataInfo {
  metaData?: string;
  operatorName?: string;
  operatorValue?: string;
  isShowTogether?: boolean;
}

export interface FilterByValue {
  enableFilter?: boolean;
  filterOperator?: string;
  filterValue?: number;
  filterSecondValue?: number;
  filterByCriteria?: string;
  isInclude?: boolean;
}

export interface DashboardWidgetGraph {
  arrPanelGraphFieldInfo?: GraphFieldInfo;
  color?: string;
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
  graphUniqueKeyDTO?: WidgetGraphUniqueKeyDTO;
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
  glbMetricId?: string;
}

export interface GraphFieldInfo {
  name?: string;
  value?: string;
}

export interface WidgetGraphUniqueKeyDTO {
  dataCenterName?: string;
  dataSourceType?: number;
  derivedGraphFormulaInfo?: null;
  graphDataIndex?: number;
  graphDataType?: number;
  graphFieldInfo?: GraphFieldInfo;
  graphFormula?: number;
  graphId?: number;
  graphState?: number;
  graphStatsType?: number;
  graphType?: number;
  groupId?: number;
  groupIdGraphIdVectName?: string;
  vectorName?: string;
  vectorNameIdx?: number;
}

export interface DashboardWidgetLayout {
  cols: number;
  rows: number;
  x: number;
  y: number;
}

export interface DashboardWidgetSettings {
  alertOverlay?: boolean;
  alertOverlayInfo?: AlertOverlaySeverityDTO;
  baselineCompare?: DashboardBaselineCompareConfig;
  blank?: boolean;
  caption?: DashboardWidgetCaptionConfig;
  chartType?: number;
  dashboardGraphTime?: DashboardViewByConfigList;
  dataSourceType?: 'METRIC' | 'LOG';
  dataFilter?: number[];
  graphFilter?: GraphSampleFilterDTO[];
  graphStatsType?: string;
  link?: DashboardFavNameCTX;
  monochromatic?: boolean;
  multiDial?: DashboardMultiDialConfig;
  panelFavName?: string;
  panelFavRelativePath?: string;
  parametrization?: boolean;
  selectedFavLevel?: string;
  types?: DashboardWidgetSettingsTypes;
  viewBy?: DashboardFavDetailCTXViewBy;
  widgetDrillDown?: boolean;
  widgetFilter?: DashboardWidgetFilterConfig;
  plotLinesxAxis?: PlotLines[];
  plotBandsxAxis?: PlotBands[];
  nfWidgetQuery?: string;
  nfIndexPattern?: string;
  queryHostPortValue?: string;
}

export interface PlotBands {
  color?: string;
  from?: number;
  to?: number;
}

export interface PlotLines {
  color?: string;
  value?: number;
  width?: number;
}

export interface AlertOverlaySeverityDTO {
  critical?: boolean;
  major?: boolean;
  minor?: boolean;
  normal?: boolean;
  all?: boolean;
  info?: boolean;
}

export interface DashboardBaselineCompareConfig {
  critical?: string;
  enabled?: boolean;
  major?: string;
  minor?: string;
  trendMode?: string;
}

export interface DashboardWidgetCaptionConfig {
  overriden?: boolean;
  caption?: string;
}

export interface GraphSampleFilterDTO {
  graphName?: string;
  groupId?: number;
  graphid?: number;
  filterType?: string;
  filterBasedOn?: string;
  filterValue2?: number;
  filterValue1?: number;
}

export interface DashboardMultiDialConfig {
  count?: number;
  enabled?: boolean;
}

export interface DashboardWidgetSettingsTypes {
  data?: DashboardWidgetTypeDataConfig;
  file?: DashboardWidgetTypeFileConfig;
  graph?: DashboardWidgetTypeGraphConfig;
  grid?: DashboardWidgetTypeGridConfig;
  image?: DashboardWidgetTypeImageConfig;
  systemHealth?: DashboardWidgetTypeSystemHealthConfig;
  table?: DashboardWidgetTypeTableConfig;
  text?: DashboardWidgetTypeTextConfig;
  group?: DashboardGroupWidgetConfig; // load dashboard inside Widget
}

export interface DashboardWidgetTypeDataConfig {
  bgColor?: string;
  dataAttrName?: string;
  dataDisplayName?: string;
  dataImgName?: string;
  dataWidgetSeverityDefDTO?: DataWidgetSeverityDefDTO;
  decimalFormat?: string;
  displayFontFamily?: string;
  displayFontSize?: string;
  fontColor?: string;
  prefix?: string;
  showIcon?: boolean;
  showTitleBar?: boolean;
  suffix?: string;
  textFontColor?: string;
  valueFontColor?: string;
  valueFontFamily?: string;
  valueFontSize?: string;
  iconColor?: string;
  bold ? : boolean;
  italic ? : boolean;
  underline? : boolean;
  boldCaption ? : boolean;
  italicCaption ? : boolean;
  underlineCaption? : boolean;
  fontFamily?: string;
  widgetBgColor?: string;
  fontSize?: string;
}

export interface DataWidgetSeverityDefDTO {
  criticalMSRString?: string;
  criticalValue?: number;
  majorMSRString?: string;
  majorValue?: number;
  colorChecked?: boolean;
  severityColor?: string;
}

// TODO: change with final object
export interface DashboardWidgetTypeFileConfig {
  bgColor?: string;
  delimiter?: string;
  filePath?: string;
  fileWidgetTitle?: string;
  userName?: string;
}
export interface DashboardWidgetTypeGraphConfigCustom {
  dialMeterExpForGkpi?: any[];
}
export interface DashboardWidgetTypeGraphConfig
  extends DashboardWidgetTypeGraphConfigCustom {
  arrPct?: number[];
  bgColor?: string;
  bold?: boolean;
  dialMeterExp?: string;
  displayWidgetFontColor?: string;
  displayWidgetFontFamily?: string;
  geomap?: DashboardWidgetTypeGraphGeomapConfig;
  gridLineWidth?: number;
  iconColor?: string;
  iconSelected?: boolean;
  italic?: boolean;
  legendAlignmentOnWidget?: string;
  pctOrSlabValue?: number;
  primaryYAxisLabel?: string;
  secondaryYAxisLabel?: string;
  selectedWidgetTimeDelay?: number;
  showChartValue?: boolean;
  showLegendOnWidget?: boolean;
  showLegends?: boolean;
  type?: number;
  underline?: boolean;
  xAxis?: boolean;
  yAxis?: boolean;
  boldCaption?: boolean;
  italicCaption?:boolean;
}

export interface DashboardWidgetTypeGraphGeomapConfig {
  colorOptionForGeoMap?: number;
  extendedFilter?: DashboardWidgetTypeGraphGeomapExtendedFilter;
  geoMapThreshold?: string;
  highToLow?: string;
  monochronicColorBandHighToLow?: boolean;
  redToGreen?: boolean;
}

export interface DashboardWidgetTypeGraphGeomapExtendedFilter {
  enable?: boolean;
  healthType?: number;
  textPattern?: string;
  type?: number;
}

// TODO: change with final object
export interface DashboardWidgetTypeGridConfig {
  key: string;
}

// TODO: change with final object
export interface DashboardWidgetTypeImageConfig {
  editCaption?: boolean;
  imageTitle?: string;
  imgPath?: string;
  bgColor?: string;
}

export interface DashboardWidgetTypeSystemHealthConfig {
  bgColor?: string;
  dataAttrName?: string;
  showMetric?:boolean;
  dataImgName?: string;
  graphNameOnTop?: boolean;
  isGraphNameOnTop?: boolean;
  healthWidgetSeverityDef?: HealthWidgetSeverityDef;
  healthWidgetRuleInfo?: HealthWidgetRuleInfo;
  prefix?: string;
  severity?: string;
  showIcon?: boolean;
  showTitleBar?: boolean;
  suffix?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  boldCaption ? : boolean;
  italicCaption ? : boolean;
  underlineCaption? : boolean;
  iconColor?: string;
  displayFontFamily?:string;
  fontColor?: string;
  fontFamily?: string;
  fontSize?: string;
  //displayFontSize?: string;
}

export interface HealthWidgetRuleInfo {
  criticalAnotherPct?: number;
  criticalAnotherSeverity?: string;
  criticalCondition?: string;
  criticalOperator?: boolean;
  criticalPct?: number;
  criticalPerc?: boolean;
  criticalSeverity?: string;
  isThresholdCritical?: boolean;
  isThresholdMajor?: boolean;
  majorAnotherPct?: number;
  majorAnotherSeverity?: string;
  majorCondition?: string;
  majorOperator?: boolean;
  majorPct?: number;
  majorPerc?: boolean;
  majorSeverity?: string;
  showSecdCondForCritical?: boolean;
  showSecdCondForMajor?: boolean;
}

export interface HealthWidgetSeverityDef {
  criticalMSRString?: string;
  criticalValue?: number;
  majorMSRString?: string;
  majorValue?: number;
}

export interface DashboardWidgetTypeTableConfig {
  bgColor?: string;
  cols?: Array<DashboardWidgetTypeTableColumnDef>;
  format?: string;
  enableColumnResizing?: string;
  enableFiltering?: string;
  enableGridMenu?: string;
  enableSorting?: string;
  fastWatch?: string;
  rowHeight?: string;
  showColumnFooter?: string;
  showGridFooter?: string;
  tableHeight?: string;
  tableType?: string;
  showRankScore?: boolean;
  bold?: boolean;
  displayWidgetFontColor?: string;
  displayWidgetFontFamily?: string;
  italic?: boolean;
  underline?: boolean;
  iconColor?: string;
  fontColor?: string;
  fontFamily?:string;

}

export interface DashboardWidgetTypeTableColumnDef {
  cellFilter?: string;
  dataAttrName?: string;
  displayName?: string;
  field?: string;
  headerCellClass?: string;
  headerTooltip?: string;
  minWidth?: string;
  type?: string;
  width?: string;
}

export interface DashboardWidgetTypeTextConfig {
  align?: string;
  bgColor?: string;
  bold?: string;
  fontColor?: string;
  fontFamily?: string;
  fontSize?: string;
  italic?: string;
  height?: string;
  origin?: string;
  rotate?: string;
  showTextArea?: boolean;
  text?: string;
  underline?: string;
  width?: string;
  iconColor?: string;

}

export interface DashboardWidgetFilterConfig {
  criteria?: string;
  enabled?: boolean;
  operator?: string;
  firstValue?: number;
  include?: boolean;
  secondValue?: number;
  basedOn?: string;
}

export interface DashboardWidgetLoadReq {
  globalFavCtx: DashboardGlobalFavCTX;
  multiDc: boolean;
  actionForAuditLog?: string;
  tsdbCtx: TsdbCTX;
  widget: DashboardWidget;
}

export interface TsdbCTX {
  opType?: number;
  appId?: string;
  clientId?: number;
  cctx?: ClientCTX;
  dataFilter: Array<number>;
  duration?: TsdbCTXDuration;
  tr?: number;
  tsAr?: number; // TODO: ('0->N/1->Y')
  tst?: number;
  avgCount?: number;
  avgCounter?: number;
  dataCtx?: DashboardDataCTX;
}

export interface TsdbCTXDuration {
  st?: number;
  et?: number;
  preset?: string;
  viewBy?: number;
}

export interface DashboardWidgetLoadRes {
  cctx?: ClientCTX;
  grpData?: DashboardGraphData;
  status?: WidgetLoadResStatus;
}

interface DashboardGraphDataCustom {
  lastSampleTimeStamp?: number; // Calculated ((minFrequency * (count-1))*1000+ startTime)
  lastSampleTimeStampWithInterval?: number;
  viewBy: string;
}

export interface DashboardGraphData extends DashboardGraphDataCustom {
  mFrequency?: DashboardGraphDataMFrequency[];
}

export interface DashboardGraphDataMFrequencyCustom {
  incrementalData?: GraphData[];
  trend?: boolean;
  measurementName?: Measurement[];
}

export interface DashboardGraphDataMFrequency
  extends DashboardGraphDataMFrequencyCustom {
  avgCount?: number;
  avgCounter?: number;
  bucketName?: string[];
  data?: GraphData[];
  tsDetail?: MFrequencyTsDetails;
}

export interface GraphDataCustom {
  lowerPanelSummary?: { [key: string]: GraphDataSummary };
  trendList?: string[];
  compareColor?: string;
  lowerPanelChecked?: boolean;
  compareTime:number;
  compareZoomSt: number;
}
export interface GraphData extends GraphDataCustom {
  avg?: number[];
  count?: number[];
  baselineGraph?: boolean;
  dataType?: number;
  cummulativeDerivedFlag?: boolean;
  glbMetricId?: number;
  max?: number[];
  measure?: DashboardGraphDataCTXMeasure;
  min?: number[];
  nativeFreq?: number;
  percentile?: number[];
  sumSquare?: number[];
  slabCount?: number[];
  slabName?: string[];
  subject?: GraphDataCTXSubject;
  sumCount?: number[];
  summary?: GraphDataSummary;
}

export interface GraphDataSummary {
  avg?: number;
  count?: number;
  lastSample?: number;
  max?: number;
  min?: number;
  stdDev?: number;
  percentChange? :any;
  sum ?: number;
}

export interface MFrequencyTsDetails {
  count?: number;
  frequency?: number;
  st?: number;
  partial?: boolean;
}

export interface WidgetLoadResStatus {
  code?: number;
  mgs?: string;
  rsTime?: number;
}

export interface ForEachGraphArgs {
  graph: GraphData;
  incrementalData: GraphData;
  tsDetail: MFrequencyTsDetails;
  graphSettings: GraphSetting;
  graphIndex: number;
  mFrequencyIndex: number;
  globalGraphIndex: number;
  gsType: string;
  graphName: string;
  globalTotalGraphs: number;
}

export const DataFilterLabel = {
  '0': 'Average',
  '1': 'Min',
  '2': 'Max',
  '3': 'Count',
  '4': 'Sum count',
  '5': 'Sum square',
  '6': 'Summary data',
  '7': 'Percentile',
  '8': 'Slab count',
  '9': 'Category',
  '10': 'Correlated',
  '11': 'Metric filter',
  '12': 'Sample filter',
};

export interface LayoutCreationForm {
  options: {
    rows: SelectItem[];
    columns: SelectItem[];
  };

  error: AppError;

  model: {
    rows: any;
    columns: any;
    name: string;
    applyToCurrentDashboard: boolean;
    applyToExistingDashboard: boolean;
  };
}

// Interface for Group of Widgets
export interface DashboardGroupWidgetConfig {
  id?: string;
  name?: string;
  type?: 'GROUP';
  layout?: GroupDashboardLayout;
  widgets?: DashboardWidget[];
}

//Layout Interface for Group
export interface GroupDashboardLayout {
  category?: string;
  configGrid?: DashboardGridLayoutConfig;
  id?: string;
  name?: string;
  type?: 'GRID';
}
