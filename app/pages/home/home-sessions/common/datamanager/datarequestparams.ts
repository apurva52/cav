export class DataRequestParams {
  
    sid:string;
    pageInstance:number;
    sessionStartTime: string;
    sessionEndTime ; string;
    // 0: session
    // 1: page
    dataLevel:number;
    dataType:number; // codes to be used refer data manager class.
   
    constructor(sid,pageInstance,dataType,sessionStartTime,sessionEndTime)
    {
      this.sid = sid;
      this.pageInstance = pageInstance;
      this.dataType = dataType;
      this.dataLevel = 0;
      if(pageInstance !== null)
      {
        this.dataLevel = 1;
      }
        this.sessionStartTime = sessionStartTime;
        this.sessionEndTime = sessionEndTime;
      return this;
    }
  }
  
  