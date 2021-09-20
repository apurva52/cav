import { ChartConfig } from 'src/app/shared/chart/service/chart.model';

export interface EndToEndTierData {
  allServers?: AllServers[];
  instances?: AllInstance[];
  charts?: ChartConfig[];
}

export interface AllServers {
  servers?: string;
  value?: string;
  severityColor?: string;
  selected?: boolean;
}

export interface AllInstance {
  instances?: string;
  value?: string;
  severityColor?: string;
  selected?: boolean;
  icon?: string;
}
