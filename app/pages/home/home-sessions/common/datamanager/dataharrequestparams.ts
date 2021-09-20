import { DataRequestParams } from './datarequestparams';

export class DataHarRequestParams extends DataRequestParams {
  
  sid:string;
  pageInstance:number;
  sessionStartTime: string;
  sessionEndTime : string;
  // 0: session
  // 1: page
  dataLevel:number;
  dataType:number; // codes to be used refer data manager class.
  pageName: string;
  onLoadTime: number;
  domContentloadedTime: number;
  navigationStartTime: string;
  bandwidth : any;
  
  constructor(sid,pageInstance,dataType,sessionStartTime, sessionEndTime, pageName, onLoadTime, domContentloadedTime, navigationStartTime,bw)
  {
    //call the super constuctor. 
    super(sid, pageInstance, dataType, sessionStartTime, sessionEndTime);
    this.pageName = pageName;
    this.onLoadTime = onLoadTime;
    this.domContentloadedTime = domContentloadedTime;
    this.navigationStartTime = navigationStartTime;
    this.bandwidth = bw;
    return this;
  }
}


