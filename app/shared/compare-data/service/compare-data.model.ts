import {
  TableHeaderColumn,
  Table,
  //TableHeader,
} from 'src/app/shared/table/table.model';

export interface CompareDataTableHeaderCols extends TableHeaderColumn {
  rowColorField?: boolean;
}
export interface TableHeader {
  cols: CompareDataTableHeaderCols[];
}

export interface CompareDataTable extends Table {
  headers?: TableHeader[];
  iconsField?: any;
  rowBgColorField?: any;
  snapshots?: CompareDataSavedSnapshot[];
  preset?: CompareDataPreset[];
  snapshotsData?:SnapShot[];
  status?: CompareStatus;
}

export interface SnapShot{
  saveMeasurement? :boolean;
  snapShotName?: any;
  trendCompare?:boolean;
  opType?: any;
  snapshopIndex?: number;
  includeDefaultBaseline?: boolean;
  compareData?: Measurement[];
  applyAllWidget?: boolean;
  viewByLevel?:any;
  viewByValue?:any;
} 
export interface SnapShotList{
  snapShotList?:SnapShot[];
}
export interface Measurement{
  id?: number;
  name?:string;
  preset?: string;
  presetlabel?:string;
  start?: any;
  end?: any;
  startLastST?: any;
  endLastST?: any;
  icon?: any;
  rowBgColorField?: any;
  viewByLevel?: any;
  viewByValue?: any;
  fullDataCallTS?: any;
}
export interface CompareSnapShotResponse{
  snapShotList?:SnapShot[];
  status?: CompareStatus;
}
export interface CompareStatus{
	 code?: number;
	 msg?: string;
	
}
export interface CompareDataSavedSnapshot {
  label: string;
  value: string;
}
export interface CompareDataPreset {
  label: string;
  value: string;
}

export interface CompareGetData{
  data:SnapShot[];
}