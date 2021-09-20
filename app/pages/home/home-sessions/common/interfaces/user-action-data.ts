
import { Util } from 'util/util';
import { nvEncoder } from "./nvencode";
//import { AppComponent } from './../../../../app.component';
import * as moment from 'moment';
import 'moment-timezone';

export class UserActionData {

offset:number;
action:any = '-';
inputType:any = '-';
tagName: any = '-';
value: any = '-';
preValue: any = '-';
position: any = '-';
id: any = '-';
index:number = 0;
starttimeoffset: number;
curroffset: number = 0.0
timestamp: any;
eventType : any;
idType : any;
pageinstance : number;
pageId : number;
sid : any;

constructor(record,offset)
{
 this.offset = offset;
 this.action = record.eventname;
 this.inputType = (record.elementType !== undefined) ? record.elementType : '-';
 this.tagName = (record.elementName !== undefined) ? record.elementName: '-';
 try
 {
   this.value = (record.value !== undefined)? nvEncoder.decodeText(record.value, nvEncoder.decode): '-';
 }
 catch(e)
 {
   console.log("Error decoding value ",record.value,e);
   this.value = record.value;
 }
 this.preValue = (record.preValue !== undefined ) ? record.preValue : '-';
 this.position= '(' + record.xpos + ',' + record.ypos + ')';
 this.id = (record.id !== undefined ) ? record.id : '-';
 this.timestamp = moment.utc(record.timestamp+1388534400000).tz(sessionStorage.getItem("_nvtimezone")).format('YYYY-MM-DD hh:mm:ss');
 //this.timestamp = new Date(record.timestamp + 1388534400000).toLocaleDateString() + " " + new Date(record.timestamp + 1388534400000).toTimeString().split(" ")[0];
 this.eventType = record.eventType;
 this.idType = record.idType;
 this.pageinstance = record.pageInstance;
 this.pageId = record.pageId;
 this.sid = record.sid;
 }



}
