
//class/method/local variables types
export interface VariablesArgumentsInfo {
    type:string;
    var:string;
    value:string;
}
export interface ExceptionInterface{
    timeStamp:string;
    exceptionClassName:string;
    message:string;
    throwingClassName:string;
    throwingMethodName:string;
    lineNumber:string;
    stackTrace:string;
    flowPathInstance:string;
    stackTraceID:string;
    exceptionClassId:string;
    messageId:string;
    tierName:string;
    serverName:string;
    appName:string;
    tierId:number;
    serverId:number;
    appId:number;
    cause:string;
    causeId:string;
    backendId:string;
    startTime:string;
    throwingClassId:string;
    throwingMethodId:string;
    startTimeInMS:string;
    exceptionCount:string;
}
