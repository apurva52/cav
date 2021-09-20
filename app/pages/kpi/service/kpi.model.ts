import { TableHeader } from 'src/app/shared/table/table.model';
import { AppError } from 'src/app/core/error/error.model';
import { EventEmitter } from 'protractor';
import { DashboardFavNameCTX, } from 'src/app/shared/dashboard/service/dashboard.model';

export interface KPIPre {
  autoplay: AutoplayConfig;
  panels: KPIPanel[];
  dcs: KPIDataCenter[];
  orderRevenue: OrderRevenueConfig;
  refreshInterval: number;
  graphical: string;
  dashboards?: DashboardFavNameCTX[];
}

export interface AutoplayConfig {
  timer: AutoplayTimerConfig;
  enabled: boolean;
  ratio: string;
}

export interface AutoplayTimerConfig {
  list: AutoplayTimerOption[];
  selected: number;
}

export interface AutoplayTimerOption {
  label: string;
  value: number;
}

export interface KPIPanel {
  label: string;
  dcs: string[];
  headers: TableHeader[];
  originalHeaders?: TableHeader[];
  tiers: string[];
  zones: string[];
  selectedZones?: { [key: string]: boolean };
  data?: any[];
}

export interface KPIDataCenter {
  name: string;
  tr: string;
  zones: KPIZone[];
  url: string;
  tiers: KPITier[];
}

export interface KPIZone {
  name: string;
  selected: boolean;
}

export interface KPITier {
  name: string;
  dc: string;
}

export interface OrderRevenueConfig {
  channels: KPIChannelConfig;
  duration: KPIOrderRevenueDurationConfig;
  dc: string;
}

export interface KPIChannelConfig {
  headers: TableHeader[];
  data: TableHeader[];
}

export interface KPIOrderRevenueDurationConfig {
  list: KPIDurationConfig[];
  selected: string[];
}

export interface KPIDurationConfig {
  label: string;
  value: string;
}

export interface KPIOrderRevenueData {
  headers: TableHeader[];
  data: any[];
}

export interface KPIData {
  data: any;
  loading?: boolean;
  error?: AppError;
}

export interface KPIDCData {
  [key: string]: KPIData;
}

export interface KPITableDataRow {
  cols: KPITableDataCol[];
  tier: string;
}

export interface KPITableDataCol {
  value: string;
  tooltip: string;
  format: string;
  classes: string;
}
