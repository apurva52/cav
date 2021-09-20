export interface DashboardWidgetLoadReq {
  globalFavCtx: DashboardGlobalFavCTX;
  multiDc: boolean;
  tsdbCtx: TsdbCTX;
  widget: DashboardWidget;
}

export interface DashboardGlobalFavCTX {
  backToHealthWidget: boolean;
  enableAlertOverlay: boolean;
  favDesc: string;
  favName: string;
  favPublic: boolean;
  favRelPath: string;
  globalRuleInfo: null;
  includeCurrentData: boolean;
  layoutId: number;
  parameteriazationMode: boolean;
  relatedMetricsRuleInfo: null;
  ruleType: number;
  running: boolean;
  showDiscontinuedGraphs: boolean;
  updateBy: string;
}

export interface TsdbCTX {
  opType: number;
  appId: string;
  clientId: number;
  cctx: ClientCTX;
  dataFilter: number[];
  duration: Duration;
  tr: number;
  avgCount: number;
  avgCounter: number;
  dataCtx: DataCTX;
}

export interface ClientCTX {
  cck: string;
  pk: string;
  u: string;
  prodType: string;
}

export interface DataCTX {
  compare: null;
  ft: null;
  gCtx: GraphCTX[];
  selfTrend: number;
}

export interface GraphCTX {
  baselineCtx: BaselineCTX;
  derivedFormula: null;
  glbMetricId: number;
  measure: Measure;
  subject: Subject;
}

export interface BaselineCTX {
  maxValue: number;
  minValue: number;
  totalBucket: number;
}

export interface Measure {
  metric: string;
  metricId: number;
  mg: string;
  mgId: number;
  mgType: string;
  mgTypeId: number;
}

export interface Subject {
  tags: Tag[];
}

export interface Tag {
  key: string;
  value: string;
}

export interface Duration {
  st: number;
  et: number;
  preset: string;
  viewBy: number;
}

export interface DashboardWidget {
  dataAttrName: string;
  dataCtx: DataCTX;
  description: string;
  graphs: DashboardWidgetGraphs;
  icon: string;
  iconTooltip: string;
  id: string;
  include: boolean;
  layout: DashboardWidgetLayout;
  name: string;
  ruleType: number;
  scaleBySelectedGraph: null;
  scaleMode: number;
  settings: DashboardWidgetSettings;
  type: string;
  widgetIndex: number;
}

export interface DashboardWidgetGraphs {
  widgetGraphs: WidgetGraph[];
  widgetRule: null;
}

export interface WidgetGraph {
  arrPanelGraphFieldInfo: null;
  color: null;
  dataCenterName: null;
  dataSourceType: number;
  derFormula: null;
  derGraphDesc: null;
  derGraphId: number;
  derGraphName: null;
  derGraphNumber: number;
  derGroupDesc: null;
  derGroupID: number;
  derGroupName: null;
  derived: boolean;
  derivedArithmeticMultiDcProperty: null;
  derReportName: null;
  graphDatatype: null;
  graphFormula: null;
  graphId: number;
  graphStatsType: number;
  graphUniqueKeyDTO: GraphUniqueKeyDTO;
  groupBy: boolean;
  groupByMetaData: null;
  groupId: number;
  metaDataInfo: null;
  originalFormula: null;
  pattern: null;
  patternFormula: null;
  scaleFactor: number;
  selected: boolean;
  tavgSet: null;
  vecName: string;
  visible: boolean;
}

export interface GraphUniqueKeyDTO {
  dataCenterName: null;
  dataSourceType: number;
  derivedGraphFormulaInfo: null;
  graphDataIndex: number;
  graphDataType: number;
  graphFieldInfo: null;
  graphFormula: number;
  graphId: number;
  graphState: number;
  graphStatsType: number;
  graphType: number;
  groupId: number;
  groupIdGraphIdVectName: string;
  vectorName: string;
  vectorNameIdx: number;
}

export interface DashboardWidgetLayout {
  cols: number;
  rows: number;
  x: number;
  y: number;
}

export interface DashboardWidgetSettings {
  alertOverlay: boolean;
  alertOverlayInfo: null;
  baselineCompare: BaselineCompare;
  blank: boolean;
  caption: WidgetCaption;
  chartType: number;
  dashboardGraphTime: DashboardGraphTime;
  dataSourceType: string;
  graphFilter: null;
  graphStatsType: string;
  link: null;
  monochromatic: boolean;
  multiDial: MultiDial;
  panelFavName: string;
  panelFavRelativePath: string;
  parametrization: boolean;
  selectedFavLevel: null;
  types: WidgetTypes;
  viewBy: ViewBy;
  widgetDrillDown: boolean;
  widgetFilter: null;
}

export interface BaselineCompare {
  critical: string;
  enabled: boolean;
  major: string;
  minor: string;
  trendMode: string;
}

export interface WidgetCaption {
  caption: string;
  overriden: boolean;
}

export interface DashboardGraphTime {
  id: string;
  name: string;
}

export interface MultiDial {
  count: number;
  enabled: boolean;
}

export interface WidgetTypes {
  data: null;
  file: null;
  graph: WidgetTypesGraph;
  grid: null;
  image: null;
  systemHealth: null;
  table: null;
  text: null;
}

export interface WidgetTypesGraph {
  arrPct: null;
  bgColor: string;
  bold: boolean;
  dialMeterExp: null;
  displayWidgetFontColor: string;
  displayWidgetFontFamily: string;
  geomap: WidgetGraphGeomap;
  gridLineWidth: number;
  iconColor: string;
  iconSelected: boolean;
  italic: boolean;
  legendAlignmentOnWidget: string;
  pctOrSlabValue: number;
  primaryYAxisLabel: null;
  secondaryYAxisLabel: null;
  selectedWidgetTimeDelay: number;
  showChartValue: boolean;
  showLegendOnWidget: boolean;
  showLegends: boolean;
  type: number;
  underline: boolean;
  xAxis: boolean;
  yAxis: boolean;
}

export interface WidgetGraphGeomap {
  colorOptionForGeoMap: number;
  extendedFilter: null;
  geoMapThreshold: string;
  highToLow: null;
  monochronicColorBandHighToLow: boolean;
  redToGreen: boolean;
}

export interface ViewBy {
  list: DashboardGraphTime[];
  selected: string;
}

// ================================ //

export interface DashboardWidgetDataRes {
  cctx: ClientCTX;
  grpData: WidgetGraphData[];
  status: Status;
}

export interface WidgetGraphData {
  mFrequency: GraphMFrequencyData[];
}

export interface GraphMFrequencyData {
  avgCount: number;
  avgCounter: number;
  bucketName: null;
  data: Data[];
  tsDetail: TimeStampDetail;
}

export interface Data {
  avg: number[];
  count: null;
  dataType: number;
  dcName: null;
  glbMetricId: number;
  max: null;
  measure: Measure;
  min: null;
  nativeFreq: number;
  percentile: null;
  slabCount: null;
  slabName: null;
  subject: Subject;
  sumCount: null;
  summary: Summary;
}

export interface Summary {
  avg: number;
  count: number;
  lastSample: number;
  max: number;
  min: number;
  stdDev: number;
}

export interface TimeStampDetail {
  count: number;
  frequency: number;
  st: number;
}

export interface Status {
  code: number;
  msg: string;
  rsTime: number;
}
