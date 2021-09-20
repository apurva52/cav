import { GraphDataCTXSubject, TsdbCTXDuration } from 'src/app/shared/dashboard/service/dashboard.model';
export interface DBMonReq {
    opType?: number;
    //cctx?: ClientCTX;
    cctx?: Object;
    tr?: string;
    multiDc?: boolean;
    duration?: TsdbCTXDuration;
  }

  export interface DBMonFavNameCTX {
    name: string;
    path: string;
  }
  
  export interface DBMonCommonParam extends DBMonReq{
    selectedSqlId: number;
    
    startOffset: string;
    endOffset: string;
    isRealTime: boolean;
    realTimeProgressnumbererval: number;
    updateRealTimeStamp: number;
    isAggregrate: boolean;
    drillDownTime: string;
    dataSourceName: string;
    refreshPanelGraphs: boolean;
    isFirstCall: boolean;
    databaseName: string;
    convertChart: boolean;
    fileType: string;
    isRefreshForDB: boolean;
    dbType: string;
    globalId: number;
    dbName: string;
    dataType: string;
    avgCount: number;
    avgCounter: number;
    isRewind: boolean;
    selectedPreset: any;
    isPresetChanged:boolean;
    selectedViewBy: any;
    isRealTimeAppled:boolean;
    selectedRTProgressInterval:number;
    drilldownSessionId: number;
    drilldownWaitType: string;
    selectedDB:string;
    drilldownWaitCategory: string;
    subject?: GraphDataCTXSubject;
    sessionId:string;
    query?: string;
    realTimeProgressInterval?:string;
    isSystemSessions?:boolean;
  }
  
  export interface DBMonSessionStats extends DBMonCommonParam{
    isSystemSessions: boolean;
    drilldownWaitType: string;
    drilldownSessionId: number;
    drilldownWaitCategory: string;
  }
  
  export interface DBMonWaitStats extends DBMonCommonParam{
    includeZero: boolean;
  }

  export interface MonitorConfigJson {
    dbSourceList?: Config[];
  }

  export interface Config {
    dataSource?: string;
    dbmsId?: string;
    globalId?: string;
    options?: string;
    gdfName?: string;
    agentIp?: string;
    subject?: GraphDataCTXSubject;
    trNum?: string;
    status?: boolean;
  }
  

