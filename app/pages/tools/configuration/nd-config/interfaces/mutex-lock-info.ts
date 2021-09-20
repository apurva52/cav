export class MutexLockDTO {
  name: string = "MutexProfilingSession1";
  id: number = 1;
  duration: number = 30;
  sessionOverhead: number = 10;
  topNmutexlocks: number = 20;
  durTopMutexlocksFind: number = 30;
  maxlockcount: number = 20;
  // maxthreadperlockcount: number = 50;
  maxthreadcount: number = 1000;
  maxstacktracecount: number =5000;
    // reqBody: string;
  // maxstacktracecountperthread: number = 50;
  description: string;
 
}

export class MutexLockSettings {
  id: number;
  appName: string;
  topoName: string;
  sessionName: string;
  configuration: string;
  startTime: string;
  duration: number;
  endTime: string;
  instanceId: number;
  tierName: string;
  serverName: string;
  instanceName: string;
  description: string;
  status: string;
  triggerScreen: string;
  agentType: string;
  txnId: number;
}


export class MutexLockData {
  tierName: string;
  serverName: string;
  instanceName: string;
  ndMsgName: string = 'MutexLockRequest';
  agentType: String = 'Java';
  bodyContentType: string = 'json';
  headerContentType: string = 'json';
  reqBody;
  version: string =  '2.0';
  connection: string = 'new';
}

export class MutexLockSessionResponse {
  duration: number;
  freeHeapAfter: number;
  freeHeapBefore: number;
  heapMaxSize: number;
  id: number;
  name: string;
  stackTraceElemetMap: Object[];
  stackTraceSizeCountMap: Object[];
  startTime: number;
  topNClasses: Object[];
  usedHeapAfter: number;
  usedHeapBefore: number;
}
