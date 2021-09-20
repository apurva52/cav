export class EventInformation {
  id: number;
  name: string;
  icon: string;
  description: string;  
  count:number; // for instances
  eventdata: string;
  sid: any;
  pageid: number;
  pageinstance : number;
  constructor(dbrecord: any)
  {
    this.id = dbrecord.eventId;
    this.name = dbrecord.name;
    this.icon = dbrecord.icon;
    this.description = dbrecord.description || "-";
    this.count = 2;
    this.eventdata = dbrecord.eventData;
    this.sid = dbrecord.sid;
    this.pageinstance = dbrecord.pageinstance;
    this.pageid = dbrecord.pageid;
    console.log('eventinfo',this.eventdata );
  }
}
