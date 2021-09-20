import { SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { MapConfig } from 'src/app/shared/map/service/map.model';
import { Table } from 'src/app/shared/table/table.model';

export interface GeolocationData {
  geoLocationMenu?: GeolocationOptions;
  storeViewMapData?: StoreViewMapData[];
  mapOption?: MapOptions;
  appStats?: Table;
  charts?: ChartConfig;
}

export interface StoreViewMapData {
  name?: string;
  color?: string;
  count?: number;
  country?: string;
  critical?: number;
  dc?: string;
  eps?: number;
  grpCount?: number;
  lat?: string;
  lon?: string;
  major?: number;
  minor?: number;
  res?: number;
  stateName?: string;
  storeName?: string;
  tierName?: string;
  tps?: number;
  cityName?: string;
}

export interface MapOptions {
    mapKey: string[];
}

export interface GeolocationOptions {
  applications?: SelectItem[];
  health?: SelectItem[];
  search?: SelectItem[];
}

export interface Duration {
  st?: number;
  et?: number;
  preset?: string;
  viewBy?: number;
}

export class PayLoadData {
  // localDataCtx = {
  //   fromLocal: true,
  //   path: "/home/cavisson/work_shankar/webapps/sys/KPI/data/tsdb-dummy.json"
  // }
  dataFilter = [
    0,
    1,
    2,
    3,
    4,
    5,
    6
  ]
  dc = "MosaicAccount"
  isAll = false
  multiDc = false
  opType = 11
  storeAlertType = 0
}