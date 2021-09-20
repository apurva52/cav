import {Browser} from './browser';
import {Event} from './event';
import {Location} from './location';
import {OS} from './operatingsystem';
import {Channel} from './channel';
import { Device } from './device';
import { Metadata } from './metadata';
import * as moment from 'moment';
import 'moment-timezone';


export class PageFilterInformation {
  trnum : string;
  sid: string;
  pageName: string;
  pageid: any;
  pageinstance: number; 
  events: Event[];
  firstByteTime: number;
  timeToLoad: number;
  url: string;
  referrerUrl:string;
  referralUrl :string;
  percievedRenderTime: number;
  redirection:number;
  domInteractiveTime:number;
  navigationStartTime:string;
  browser:Browser;
  device: Device;
  os:OS
  channel: Channel
  location:Location
  onLoad:number;
  domTime:number;
  dnsTime:number;
  bandWidth:any;
  bytesIn: any;
  clientIp: any;
  navType: any;
  status: any;
  flowpathInstance: any;
  mobileAppVersion: any;
  mobileOSVersion: any;
  formattedTime: any;
  resourceTimingFlag: any;
  navigationType: any;
  replayFlag: any;
  flowpathinstances: any;
  RESOURCE_TIMING_FLAG = 0x01;
  PAGEDUMP_FLAG = 0x02;
  transactionid  :any;
  connectiontime : any;
  responsetime : any;
  tabid : any;
  firstpaint : any;
  firstcontentpaint : any;
  firstinputdelay : any;
  timetointeractive : any;

 constructor(dbRecord: any,metadata)
 {
   //console.log("db :" ,dbRecord);  
   this.sid= dbRecord[0];
    this.pageinstance = parseInt(dbRecord[1]);
    
    //this.navigationStartTime = (new Date (moment.utc(dbRecord[2]*1000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf()/1000).toString();
    this.navigationStartTime = dbRecord[2]
    this.pageName= dbRecord[3];
    this.pageid = dbRecord[4];
    this.events = this.fillEventsForSession(dbRecord[22], metadata);
    this.firstByteTime= dbRecord[5]/1000 >= 0 ? dbRecord[5]/1000 : 0;
    this.timeToLoad= dbRecord[7]/1000 >= 0 ? dbRecord[7]/1000 : 0;
    try
    { 
      this.url= (dbRecord[11] != null) ? unescape(dbRecord[11]) : "-" ; 
    }
    catch(e){ console.log("Invalid URL"); this.url = "-";  }
    try
    {
      this.referrerUrl= (dbRecord[12] != null) ? new URL(unescape(dbRecord[12])).host : "-" ;
      this.referralUrl = (dbRecord[12] != null) ? (unescape(dbRecord[12])) : "-" ;
    }
    catch(e){ console.log("Invalid URL"); this.referrerUrl = "-";   }
    this.percievedRenderTime= dbRecord[8]/1000 >= 0 ? dbRecord[8]/1000 : 0; ;
    this.redirection= dbRecord[13];
    this.domInteractiveTime= dbRecord[9]/1000 >= 0 ? dbRecord[9]/1000 : 0; ;
    this.browser= metadata.getBrowser(parseInt(dbRecord[16]));
    this.device=Device.devices[dbRecord[17]];
    this.os= metadata.getOS(parseInt(dbRecord[18]));
    this.channel= metadata.getChannel(parseInt(dbRecord[19]));
    this.location=  metadata.getLocation(parseInt(dbRecord[20])) ;
    this.onLoad=dbRecord[6]/1000 >= 0 ? dbRecord[6]/1000 : 0; 
    this.bandWidth= dbRecord[14] >= 0 ? this.getShowBandWidth(dbRecord[14]) : 0;;
    this.bytesIn=  dbRecord[15] >= 0 ? this.getShowbytesIn(dbRecord[15]) : 0;
    this.clientIp= dbRecord[21];
    this.navType = dbRecord[23];
    this.status = dbRecord[24];
    this.flowpathInstance = dbRecord[25]; 
    this.mobileAppVersion = dbRecord[26];
    this.mobileOSVersion = dbRecord[27];
    let timesid = moment.utc(dbRecord[28],"HH:mm:ss MM/DD/YY").valueOf();
    this.formattedTime = moment.tz(new Date(timesid),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
    this.resourceTimingFlag = ((dbRecord[24] & this.RESOURCE_TIMING_FLAG) !== 0) ? true : false;
    this.navigationType = this.setNavigationType(dbRecord[23]);
    this.replayFlag = ((dbRecord[24] & this.PAGEDUMP_FLAG) !== 0) ? true : false;
    this.flowpathinstances = dbRecord.flowpathid;
    this.transactionid  = dbRecord[29];
    this.dnsTime = dbRecord[30]/1000 >= 0 ? dbRecord[30]/1000 : 0;
    this.domTime = dbRecord[10]/1000 >= 0 ? dbRecord[10]/1000 : 0;
    this.responsetime = dbRecord[32] /1000 >= 0 ? dbRecord[32]/1000 : 0;
    this.connectiontime = dbRecord[31] /1000 >= 0 ? dbRecord[31]/1000 : 0;
    this.trnum = dbRecord[33];
    this.tabid = dbRecord[34];
    this.firstpaint = dbRecord[35]/1000 >= 0 ? dbRecord[35]/1000 : '-';
    this.firstcontentpaint = dbRecord[36]/1000 >= 0 ? dbRecord[36]/1000 : '-';
    this.firstinputdelay = dbRecord[37]/1000 >= 0 ? dbRecord[37]/1000 : '-';
    this.timetointeractive = dbRecord[38]/1000 >= 0 ? dbRecord[38]/1000 : '-';

 }

 getShowBandWidth(val)
  {
   let temp = '';
   if(val === null || val === '' || val == 0)
    return '-';
   else
    {
      if(val > 1024)
       temp = (val/1024).toFixed(3) + ' Mbps';
      else
       temp =  val + ' Kbps';
     return temp;
    }
  }

 getShowbytesIn(val)
  {
    let temp = '';
   if(val === null || val === '' || val == 0)
    return '-';
   else
    {
      if(val/1024 > 1024)
       temp = (val/(1024*1024)).toFixed(3) + ' MB';
      else
       temp = (val/1024).toFixed(3) + ' KB';
     return temp;
    }
  }




// adding each event obj corresponding to the id in the session.
  public fillEventsForSession (events: string, metadata: Metadata)
  {
    let eventLists: Event[] = [];
    if(events === undefined)
     return [];
    if (!events)
    {
      return eventLists;
    }
    const eventIds = events.split(',');
    let distinctEvents = [];
    eventIds.forEach(
      function(record)
        {
        let exist = false;
        for(let i = 0; i < distinctEvents.length; i++)
        {
          if(distinctEvents[i] === record)
          {
            exist = true;
          }
        }

        if(!exist === true)
        {
          distinctEvents.push(record);
          if(metadata.eventMap.get(parseInt(record)) !== undefined)
            eventLists.push(metadata.eventMap.get(parseInt(record)));
          else
          {
           let event = { iconCls: null, icon : "/netvision/images/countryIcons/questionmark.png", name : "Others", description : "Others", id : parseInt(record), count:1 ,sid : "", pageid : -1, pageinstance : -1};
           eventLists.push(event);
          }
        }
        else
        {
          for(let i = 0 ; i < eventLists.length; i++)
          {
            if(parseInt(record) === eventLists[i].id)
             eventLists[i].count++;
          }
        }
      }
    );
    return eventLists;
  }


  setNavigationType(navType)
  {
    switch(navType)
    {
      case 0 : return { "class" : "las-mouse-pointer-solid", "title" : "Navigation" };
      case 1 : return { "class" : "las-sync-alt-solid", "title" : "Reload" };
      case 2 : return { "class" : "las-backward-solid ", "title" : "Backward Navigation" };
      case 3 : return { "class" : "icons8 icons8-cursor", "title" : "Soft Navigation" };
      default : return { "class" : "", "title" : "" };
    }
  }


}




















