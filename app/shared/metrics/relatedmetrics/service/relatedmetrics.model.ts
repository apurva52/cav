import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import {
  TableHeaderColumn,
  Table,
  //TableHeader,
} from 'src/app/shared/table/table.model';
import { ClientCTX } from "src/app/core/session/session.model";
import { Status } from "src/app/pages/my-library/dashboards/service/dashboards.model";

export interface RelatedMetricsTableHeaderCols extends TableHeaderColumn {}
export interface RelatedMetricsTableHeader {
  cols: RelatedMetricsTableHeaderCols[];
}

export interface RelatedMetricsTable extends Table { 
  headers?: RelatedMetricsTableHeader[];
  iconsField?: any;
  metricsValues?: RelatedMetricsValues[];
  dataOperations?: RelatedMetricsOperations[];
  charts: ChartConfig[];
}

export interface RelatedMetricsOperations {
  check: string;
  label: string;
  selectValues: RelatedOperationSelectedValues[];
}

export interface RelatedMetricsValues {
  label: string;
}
export interface RelatedOperationSelectedValues {
  label: string;
  value: string;
}
export class RelatedMetricsGroupBy {
  subject?: RelatedMetricsSubject;
  measure?: RelatedMetricsMeasure;
}
export class RelatedMetricsMetricSetToLookup {
  catalogueName?: string;
  indicesInfo?: indicesInfo[];
}
export class RelatedMetricsSubject {
  tags?: tags[];
}
export class indicesInfo {
  subject?: RelatedMetricsSubject;
  measure?: RelatedMetricsMeasure;
}
export class RelatedMetricsMeasure {
  mgType?: string;
  mgTypeId?: number;
  mg?: string;
  mgId?: number;
  metrics?: metrics[];
  metricIds?: metricIds[];
  showTogether?: number;
}

export class tags {
  key?: string;
  mode?: number;
  value?: string;
}
export class metrics {}
export class metricIds {}

export class RelatedMetricsMetricFilter {
  typ?: typ[];
  in?: number;
  opt?: number;
  val1?: number;
  val2?: number;
}
export class typ {}

export interface CatalougeResponseDTO{
  status:Status;
  grpMetaData:GroupMetaDataCtx[];
  etag:string; // for faster access of incremental data
}

export interface GroupMetaDataCtx{
  title:string
mdata:MetaDataCtx;
}
export interface MetaDataCtx{
  subject?: RelatedMetricsSubject;
  measure?: RelatedMetricsMeasure;
glbMetricId:string;
pMatch:any;
}