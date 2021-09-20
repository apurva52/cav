import { SelectItem } from 'primeng';
import { ClientCTX } from 'src/app/core/session/session.model';
import { Status } from 'src/app/pages/my-library/dashboards/service/dashboards.model';
import {
  TableHeaderColumn,
  Table,
  //TableHeader,
} from 'src/app/shared/table/table.model';
import { TargetData } from '../../pattern-matching.model';

export interface CatalogueManagementTableHeaderCols extends TableHeaderColumn {
}
export interface CatalogueManagementTableHeader {
  cols: CatalogueManagementTableHeaderCols[];
}


export interface CatalogueManagementTable extends Table {
  headers?: CatalogueManagementTableHeader[];
  iconsField?: any;
  categoryName : SelectItem[];
}
export interface SaveCatalogue{
  cctx:ClientCTX;
  opType:string;
  targetData:TargetData[];
  name:string;
  description:string;
  createdBy:string;
  creationDate:string;
  metricType:string;
   chartType:string;
   seriesType:string;
   arrPercentileOrSlabValues:number[];
}
export interface SaveCatlogueResponse{
  status:Status;
  data :CatalogueTableData[];
}

export interface  CatalogueTableData{
targetData:TargetData[];
name:string;
description:string;
createdBy:string;
creationDate:string;
metricType?:string;
}
