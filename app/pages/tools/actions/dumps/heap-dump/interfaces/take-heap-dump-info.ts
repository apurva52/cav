
export interface InstanceInterface {
    pid: string;
    appName: string;
    arguments: string;
    status:string;
    agentType:string;
    ndHome:string;
  }
export interface HeapDumpInterface{
    tierName:string;
    serverName:string;
    appName:string;
    fileName:string;
    location:string;
    time:string;
    status:string;
    message:string;
    action:string;
    // userNote:string;
  }
export interface FlightRecorderInterface
{
  recordingId:string;
	recordingName:string;
	status:string;
	duration:string;
	recordingFileName:string;
	fileSize:string;
	fileLastModificationTime:string;
	compression:string;
}
