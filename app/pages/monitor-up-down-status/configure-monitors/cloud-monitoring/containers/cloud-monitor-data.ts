
export class CloudMonitorData{
    monName:string = "";
	enabled:boolean = false;
	monInfos:MonitorInfo[];
	acMonList:string[];
}

export interface MonitorInfo {
	gdfName: string;
	description: string;
  }
