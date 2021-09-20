import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table } from 'src/app/shared/table/table.model';

export interface TransactionFlowMapData {
  nodeInfoData?: FlowmapNodeInfoData;
  businessJacket?: Table;
}

export interface FlowmapNodeInfoData {
  node: NodeInfo[];
  edge: EdgeInfo[];
}

export interface EdgeInfo {
  source?: string;
  target?: string;
  data?: any;
  type?: string;
}

export interface NodeInfo {
  id?: string;
  type?: string;
  left?: number;
  top?: number;
  tier?: string;
  server?: string;
  instance?: string;
  startTime?: string;
  totalDuration?: string;
  percentage?: string;
  nodeName?: string;
  calls?: number;
  rspTime?: number;
  icon?: string;
  serverHealthMajorCircum?: number;
  serverHealthCriticalCircum?: number;
  bt?: string;
  error?: string;
  instanceType?: string;
  backendType?: string;
}

export interface TransactionFlowmapChart {
  charts: ChartConfig[];
}
