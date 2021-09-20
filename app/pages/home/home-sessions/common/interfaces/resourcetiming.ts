export class ResourceTiming {
  
  entries : any;
  duration : number;
  starttime: number;
  bloaddata :any;
  bresponsedata :any;
  bdnsdata : any;
  bconnectdata : any;
  hostdata : any;
  contentdata : any;
  totalbytes : any;
  bandwidth : any;
  
  constructor(dbRecord)
  {
    this.starttime = dbRecord.starttime;
    this.duration = dbRecord.duration;
    this.totalbytes = dbRecord.totalbytes || -1;
    this.bandwidth = dbRecord.bandwidth;
    this.entries = dbRecord.entries;
    this.bloaddata = dbRecord.bloaddata;
    this.bresponsedata = dbRecord.bresponsedata;
    this.bdnsdata = dbRecord.bdnsdata;
    this.bconnectdata = dbRecord.bconnectdata;
    this.hostdata = dbRecord.hostdata;
    this.contentdata = dbRecord.contentdata;
  
  }
  
  
}

