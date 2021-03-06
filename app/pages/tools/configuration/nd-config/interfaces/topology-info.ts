export interface TopologyInfo {
    profileId: number;
    topoDesc: string;
    topoName: string;
    dcTopoId: number;
    topoState: number;
    profileName: number;
    topoId: number;
    timeStamp: string;
}

export interface TierGroupInfo {
    tierGroupId: number;
    tierGroupName: string;
    tierGroupDesc: string;
    tierGroupDefination: string;
    type: string;
    profileId: number;
    profileName: string;
}

export interface TierInfo {
    tierId: number;
    tierFileId: number;
    tierDesc: string;
    tierName: string;
    profileId: number;
    profileName: string;
}

export interface ServerInfo {
    serverId: number;
    serverFileId: number;
    serverDesc: string;
    serverDisplayName: string;
    serverName: string;
    profileId: number;
    profileName: string;
}

export interface InstanceInfo {
    instanceId: number;
    instanceFileId: number;
    instanceName: string;
    instanceDisplayName: string;
    instanceDesc: string;
    profileId: number;
    profileName: string;
    enabled: boolean;
    instanceType: string;
    aiEnable: boolean;
}

export class AutoInstrSettings{
    enableAutoInstrSession: boolean = true;
    minStackDepthAutoInstrSession: number = 10;
    autoInstrTraceLevel: number =  1;
    autoInstrSampleThreshold: number = 120;
    autoInstrPct: number = 60;
    autoDeInstrPct: number = 80;
    autoInstrPctPhp: number = 80;
    autoDeInstrPctPhp: number = 60;
    autoInstrMapSize: number = 100000;
    autoInstrMaxAvgDuration: number = 2;
    autoInstrClassWeight: number = 10;
    autoInstrSessionDuration: number = 1800;
    autoInstrRetainChanges: boolean = true;
    blackListForDebugSession: boolean = true;
    enableAutoInstrMethodLevel: boolean = false;
    count1: number = 35;
    count2: number = 25;
    count3: number = 25;
}

export class AutoIntrDTO{
    instanceName: string;
    startTime: string;
    endTime: string;
    duration: string;
    status: string;
    elapsedTime: string;
    configuration: string;
    appName: string;
    sessionName: string;
    instanceId: number;
    type: string;
    triggerScreen: string;
}

export class DDAIInfo{
    type: string = ""
    conf: string = ""
    sessionName: string = ""
    bt: string = "ALL"
    testRun: number = 2
    tier: string =""
    server: string =""
    instance: string  = ""
    duration: number = 900
    retainchanges: number = 0
    dump_data: number = 2
    stackDepthFilter: number = 10
    ddsampleInterval: number = 20
    ddtraceLevel: number = 1
    autoInstrsampleThreshold: number = 1000
    instrPct: number = 5
    removeInstrPct: number = 90
    maxMethods: number = 10000
    minAvgResponseTime: number = 1
    weightage: number = 10
    blackListForAI: string = "2"
    aiThreshold: number = 5
    ddaithreadblackList: string = ""
    ddaithreadwhiteList: string = ""
    ddaibtblackList: string = ""
    ddaibtwhiteList: string = ""
    acknowledgeMode: string = ""
    completionMode: number = 2
    applyMode: number = 0
    saveAppliedChanges: number = 1
    deleteFromServer: number = 1
    agentType: string = ""
    sessionId: number
    message: string = "";
    enableAutoInstrMethodLevel: number = 0;
    count1: number = 35;
    count2: number = 25;
    count3: number = 25;
}

//Class for Auto-Instrumentation Summary
export class AutoInstrSummaryData {
    packageName:string;
    className:string;
    methodName:string;
    count:number;
    duration:number;
}
