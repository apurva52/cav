// 4 = Read/View
// 2 = Write/Edit/Add
// 1 = Execute/Delete

import { DataCenter } from 'src/app/shared/header/data-center-menu/service/data-center.model';

// 7 = means Admin permission which consist of all Read/Write/Execute( 4 + 2 + 1 )
export type PermissionCode = 4 | 2 | 1 | 7;

export interface FeaturePermission {
  feature: string;
  permission: PermissionCode;
}

export interface ProductPermissionGroup {
  key: string;
  permissions: FeaturePermission[];
}

export interface PreSession {
  publicKey?: string;
  captcha?: boolean;
  controllerName?: string;
  serverName?: string;
  legacyUIURL?: string;
  ssoURL?: string;
  newUIEnabled?: boolean;
  dcData?: DataCenter[];
  multiDc?: boolean;
  DWNMULFILE?: boolean;
  isTsdb?: string;
  isPartialEnable?: string;
  saasEnabled?: string;
  saasController?: string;
}

export interface PreSessionPayload {
  sessionURL: string;
}

export interface TestRun {
  id: string;
  running: boolean;
}

export interface Session {
  capabilityList:any;
  cctx: ClientCTX;
  permissions: ProductPermissionGroup[];
  testRun: TestRun;
  intervals: {
    key: string;
    interval: number;
  }[];
  defaults: {
    landingPage: string;
    dashboardName: string;
    dashboardPath: string;
    timeInfo: SessionTimeInfo;
    serverTimeInfo: SessionTimeInfo;
    clientTimeInfo: SessionTimeInfo;
    patternMatchAllGraph: string;
  };
  ddrMenuCondition: DDRMenuCondition[];
  sequence : string;
}

export interface DDRMenuCondition {
  arrGraphId: Array<number>;
  groupId: number;
}

export interface ClientCTX {
  pk: string;
  cck?: string;
  u?: string;
  prodType?: string;
}

export interface LoginPayload {
  username?: string;
  password?: string;
  productKey?: string;
  samlAuthenticated?: string;
  requestFrom?: string;
  oktagroup?: string;
}

export interface SessionTimeInfo {
  format: string;
  offset: number;
  stamp: number;
  str: string;
  zone: string;
  zoneId: string;
  timeZoneList?: TimeZoneInfo;
}

export interface CopyLinkParams {
  requestFrom?: string;
  username?: string;
  productKey?: string;
  samlAuthenticated?: string;
  oktagroup?: string;
  dashboardName?: string;
  dashboardPath?: string;
  controllerName?: string;
  st?: number;
  et?: number;
  preset?: string;
  viewBy?: string;
  id: string;
  running: boolean;
}

export interface DDRParams {
  requestFrom?: string;
  username?: string;
  productKey?: string;
  testRun?: string;
  tierName?: string;
  serverName?: string;
  appName?: string;
  startTime?: string;
  endTime?: string;
  startTimeInDateFormat?: string;
  endTimeInDateFormat?: string;
  ipWithProd?: string;
  dbReportCategory?: string;
  strGroup?: string;
  urlName?: string;
  product?: string;
  isZoomPanel?: boolean;
  restDrillDownUrl?: string;
  graphId?: string;
  vecArrForGraph?: any[];
  btCategory?: string;
  strOrderBy?: string;
  mtFlag?: string;
  strGraphKey?: string;
  urlIndex?: string;
  customData?: string;
  correlationId?: string;
  flowpathID?: string;
  customOptions?: string;
  queryTimeMode?: string;
  queryTime?: string;
  tierId?: string;
  serverId?: string;
  appId?: string;
  backendId?: string;
  backendRespTime?: string;
  backendName?: string;
  mode?: any;
  ndSessionId?: string;
  nvPageId?: string;
  nvSessionId?: string;
  urlParam?: string;
  isFromNV?: string;
  cmdArgsFlag?: any;
  ajaxTimeout?:any;
  sqlIndex?:any;
  pk: string;
  cck?: string;
  u?: string;
  prodType?: string;
  first?: number;
  rows: number;

}

export interface TimeZoneInfo {
  label?: string;
  value?: TimeZoneValueInfo;
}

export interface TimeZoneValueInfo {
  abb?: string;
  offset?: string;
  value?: string;
  zoneId?: string;
  diffTimeStamp?: number;
}
