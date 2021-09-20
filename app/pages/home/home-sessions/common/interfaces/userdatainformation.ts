import { Util } from '../util/util';
export class UserDataInformation {
  timestamp:number;
  duration:string;
  name:string;
  startTime: string;
  prevTime: string;
  _duration: number;
  server: string;
  network: string;
  action: string;
  typeInfo: string;
  txData: any[];
  endTime: string;
  flowpathInstance: string;
  id: string;
  url: string;
  value: string;
  
  constructor(timestamp, duration , name, value)
  {
    this.timestamp = timestamp;
    this.startTime = Util.msToOffset(timestamp);
    this.prevTime = '0 ms';
    this.duration = '0 ms';
    this.server = '-';
    this.network = '-';
    this.action = '';
    this.typeInfo = '';
    this.name = name;
    this.endTime = timestamp;
    this.txData = [];
    this.flowpathInstance =  '';
    if (duration > 0)
     {
       this.endTime += duration;   
       this.duration = Util.formattedDuration(duration); 
     }
    this.url = '';
    this.value = value;
  }
}
