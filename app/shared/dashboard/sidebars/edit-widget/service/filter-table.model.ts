import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';
import { SelectItem } from 'primeng';

export interface FilterHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface FilterTableHeader {
  cols: FilterHeaderCols[];
}

export interface FilterTable extends Table {
  headers?: FilterTableHeader[];
  severityBgColorField?: string;
  iconsField?: any;
}

export interface WidgetSettingsDropDownData {
  dataSourceOptions?: SelectItem[];
  widgetTypeOptions?: SelectItem[];
  graphTypeOptions?: SelectItem[];
  chartTypeDataOptions?: SelectItem[];
  dataFieldOptions?: SelectItem[];
  operatorOptions?: SelectItem[];
  tableTypeDataOptions?: SelectItem[];
  formulaTypeDataOptions?: SelectItem[];
  FieldDataOptions?: SelectItem[];
  queryTypeOptions?: SelectItem[];
  legendPositionOptions?: SelectItem[];
  indexPatternDataOptions?: SelectItem[];
  environmentTypeOptions?: SelectItem[];
  valueLabelOptions?: SelectItem[];
  drillDownOptions?: SelectItem[];
  decimalOptions?: SelectItem[];
  fontFamilyOptions?: SelectItem[];
  fontSizeOptions?: SelectItem[];
  gridLineOptions?: SelectItem[];
  compareTrendOptions?: SelectItem[];
  basedOnPercentileOptions?: SelectItem[];
  basedOnSlabOptions?: SelectItem[];
  criteriaSampleData?: SelectItem[];
  filterBySampleData?: SelectItem[];
  opratersSampleData?: SelectItem[];
  valueSampleData?: SelectItem[];
  criticalSeverityOperatorOptions?: SelectItem[];
  majorSeverityOperatorOptions?: SelectItem[];
  criticalhealthSeverityOptions?: SelectItem[];
  criticalhealthSeverityOperators?: SelectItem[];
  majorhealthSeverityOptions?: SelectItem[];
  majorhealthSeverityOperators?: SelectItem[];
  operatersData?: SelectItem[];
  filterByData?: SelectItem[];
  criteriaData?: SelectItem[];
  dialMeterOperatorOptions?: SelectItem[];
  sampleFilterOperatorOptions?: SelectItem[];
  graphNameOptions?: SelectItem[];
  categoryTypeDataOptions ? : SelectItem[];
  corelatedTypeDataOPrions? : SelectItem[];
  normalChartTypeDataOptions? : SelectItem[];
  geoMapValueOptions? :  SelectItem[];
  geoMapColorBandOptions? : SelectItem[];
}
