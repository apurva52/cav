export class MemProfDTO {
  name: string = "HeapProfilingSession1";
  id: number = 1;
  duration: number = 1800;
  frequency: number = 120;
  topNClassToInstrument: number = 10
  freqTopClassFind: number = 120;
  durTopClassFind: number = 600;
  maxStackTraceCount: number = 10000;
  maxStackTraceCountPerClass: number = 1000;
  durStackTraceCapture: number = 1200;
  freqStackTraceCapture: number = 5;
  stackTraceDepth: number = 25;
  maxMapSize: number = 10000;
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

export class  MemoryProfilerData {
  tierName : string;
  serverName : string;
  instanceName : string;
  ndMsgName : string = 'MemoryProfillingRequest';
  agentType : String = 'Java';
  bodyContentType : string = 'json';
  headerContentType : string = 'json';
  // reqBody : JSON.stringify(obj);
  reqBody;
}