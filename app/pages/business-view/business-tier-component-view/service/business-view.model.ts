export interface BusinessView {
  businessTierComponent: BusinessTireComponent;
}

export interface BusinessTireComponent {
  node: BusinessTireComponentNode[];
  edge: BusinessTireComponentEdge[];
}

export interface BusinessTireComponentNode {
  businessHealthMajorCircum?: number;
  businessHealthCriticalCircum?: number;
  icon?: string;
  nodeName?: string;
  from?: string;
  to?: string;
  id?: string;
  type?: string;
  left?: number;
  top?: number;
  docs?: number;
  networks?: number;
  calls?: number;
  serverInfo?: ServerInfo[];
}

export interface BusinessTireComponentEdge {
  source: string;
  target: string;
}

export interface ServerInfo {
  serverName?: string;
  docs?: number;
  networks?: number;
  calls?: number;
  icon?:string;
}
