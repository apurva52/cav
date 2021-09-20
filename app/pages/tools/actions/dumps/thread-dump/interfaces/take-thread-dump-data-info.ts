export interface ThreadDumpInfo
{
  dcName:string;
  tierName:string;
  serverName:string;
  instanceName:string;
  startTime:string;
  endTime:string;
  filePath:string;
  timeStamp:string;
  userName: string;
  userNote:string;
  pid:string;
  index:string;
  agentType:string;
}

export interface ParsedThreadDumpInfo
{
  threadId:string;
  threadName:string;
  priority:string;
  threadState:string;
  nativeId:string;
  stackTrace:string;
}

export interface InstanceInterface {
  pid: string;
  appName: string;
  arguments: string;
  status:string;
}

export interface StatisticsThreadDump {
  threadId: string;
  threadName: string;
  nativeId: string;
  state1: string;
  state2: string;
}


export interface SummarizedThreadDump {
  threadId: string;
  threadName: string;
  nativeId: string;
  threadCount:string;
}


