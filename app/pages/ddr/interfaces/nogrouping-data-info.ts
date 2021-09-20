//Hotspot data interface with all fields with their datatype
export interface NoGroupingInterface {
 tierid:string;
 serverid:string,
 appid:string,
 threadid:string;
 hotspotstarttimestamp:string;
 hotspotduration:string;
 threadstate:string;
 threadpriority:string;
 threadstackdepth:string;
 FlowPathInstance:string;
 threadname:string;
 hsTimeInMs:string;
 hsDurationInMs:string;
 toolTipTextForHsDur:string;
 hotspotElapsedTime:string;
 startTime:string;
 endTime:string;
 instanceType:string;
}

export interface IPInfoInterface {
  renamebackendIPname:string;
  actualbackendIPname:string;
  backendType:string;
  backendStartTime:string;
  backendDuration:string;
  errorCount:string;
  Query:string;
  starttimeInMs:string;
}

//Stacktrace data interface with all fields with their datatype
export interface StackTraceInterface {
 0:string;
 1:string;
 2:string;
 3:string;
 4:string;
 5:string;
 6:string;
 7:string;
}
