export class MemProfDTO {
  name: string = "HeapProfilingSession1";
  id: number = 1;
  duration: number=30;
  frequency: number = 10;
  topNClassToInstrument: number = 20;
  durTopClassFind: number = 30 ;
  maxStackTraceCount: number = 1000;
  stackTraceDepth: number = 20;
  //description: string = "";
  memoryProfilerType: number = 3;
  blackListClasses: string[] = [];
  whiteListClasses: string[] = [];
}

export class MemoryProfilerSettings {
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


export class MemoryProfilerData {
  tierName: string;
  serverName: string;
  instanceName: string;
  ndMsgName: string = 'MemoryProfillingRequest';
  agentType: String = 'Java';
  bodyContentType: string = 'json';
  headerContentType: string = 'json';
  // reqBody : JSON.stringify(obj);
  reqBody;
  version: string = "2.0";
  connection: string = "new";
}

export class MemProfSessionResponse {
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
