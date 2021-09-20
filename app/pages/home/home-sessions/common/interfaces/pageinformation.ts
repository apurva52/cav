import { PageName } from './page';
import { Store } from './store';
import { Metadata } from './metadata';
import { Session } from './session';
import { Event } from './event';
import { Cookie } from './cookie';
import * as moment from 'moment';
import 'moment-timezone';

export class PageInformation {
  // TODO : review all the properties too many session level properties adding only currently required properties.
  
  RESOURCE_TIMING_FLAG = 0x01;
  PAGEDUMP_FLAG = 0x02;
  OCX_INFO_MISSING_PAGE = 0x04;
  OVERALL_INFO_MISSING_PAGE = 0x08;  
 
  sid: string;
  index: number;
  pageName: PageName;
  events: Event[];
  startTime: number;
  firstByteTime: number;
  timeToLoad: number;
  timeToDOMComplete: number;
  url: string;
  referrerUrl:string;
  store: Store;
  terminalId: number;
  associatedId: number;
  percievedRenderTime: number;
  redirectionCount:number;
  domInteractiveTime:number;
  resourceTimingFlag:boolean;
  replayFlag:boolean;
  navigationType = {};
  navigationStartTime:string;
  navigationStartTimeStamp : number;
  
  // timeline variables
  redirectionDuration:number;
  cacheLookupTime:number;
  dnsTime:number;
  connectionTime:number;
  secureConnectionTime:number;
  navigationTypeTime:number;
  responseTime:number;
  unloadTime:number;
  domTime:number;
  loadEventTime:number;
  cookies = [];
  pageInstance:number;
  eventListData: string = '';
  flowpathinstances = '';
  serverresponsetime: number;
  bandWidth: any;
  bytesIn: any;
  showbandWidth: any;
  showbytesIn: any;
  tabid : number;
  pageinstance : number;
  transactionid : any;
  pagename:any;
  webviewFlag : any;
  firstpaint : any;
  firstcontentpaint : any;
  firstinputdelay : any;
  timetointeractive : any; 
  ocxDataMissing : boolean;
  overallDataMissing : boolean;
  /*
         var navtype = parseInt(arrDataValues[i][39]);
         if(navtype == 0)
           document.write("&nbsp;<i class='fa fa-mouse-pointer' aria-hidden='true' style='float:right' title='Navigation' />");
         else if(navtype == 1)
           document.write("&nbsp;<i  class='fa fa-refresh' aria-hidden='true' style='float:right' align=right  title='Reload' />");
         else if(navtype == 2)
           document.write("&nbsp;<i class='fa fa-backward' align=right title='Backward Navigation'  style='float:right' />");
         else if(navtype == 254)
           document.write("<i class='fa fa-mouse-pointer' aria-hidden='true' style='float:right;color:green-yellow;' title='Soft Navigation'></i>");
   
   */
  setNavigationType(navType)
  {
    switch(navType)
    {
      case 0 : return { "class" : "las-mouse-pointer-solid ", "title" : "Navigation" };
      case 1 : return { "class" : "las-sync-alt-solid ", "title" : "Reload" };
      case 2 : return { "class" : "las-backward-solid ", "title" : "Backward Navigation" };
      case 3 : return { "class" : "icons8 icons8-cursor ", "title" : "Soft Navigation" };
      default : return { "class" : "", "title" : "" };
    }
  }
  
  // adding each event obj corresponding to the id in the session.
   // adding each event obj corresponding to the id in the session.
  public fillEventsForSession (events: string, metadata: Metadata)
  {
    let eventLists: Event[] = [];
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
          if(metadata.getEventFromName(record) !== undefined)
            eventLists.push(metadata.getEventFromName(record));
          else
          {
           let event = {iconCls : null, icon : "/netvision/images/countryIcons/questionmark.png", name : "Others", description : "Others", id : parseInt(record), count:1,sid : "", pageid : -1, pageinstance : -1};
                      eventLists.push(event);
          }
        }
        else
        {
          for(let i = 0 ; i <= eventLists.length; i++)
          {
            if(record === eventLists[i].name)
             eventLists[i].count++;
          }
        }
        
      }
    );
    return eventLists;
  }

 
  
  
  fillFromDBRecordVersion1(dbRecord: any, index: number, metadata: Metadata)
  {
    this.sid = dbRecord.sessionId;
    this.index = index;
    this.pageName = metadata.getPageFromName(dbRecord.pagename);
    this.pagename = dbRecord.pagename;
    this.events = this.fillEventsForSession(dbRecord.event, metadata);
    this.firstByteTime = dbRecord.firstbytetime/1000 >= 0 ? dbRecord.firstbytetime/1000 : 0;
    this.timeToDOMComplete = dbRecord.timetodomcomplete/1000 >= 0 ? dbRecord.timetodomcomplete/1000 : 0;
    this.timeToLoad = dbRecord.timetoload/1000 >= 0 ? dbRecord.timetoload/1000 : 0;
    this.url = unescape(dbRecord.url);
    // this.store = metadata.getStore(dbRecord.storeid);
    this.terminalId = dbRecord.terminalid;
    this.tabid = dbRecord.tabid;
    this.associatedId = -1;
    this.percievedRenderTime = dbRecord.perceivedRenderTime/1000 >= 0 ? dbRecord.perceivedRenderTime/1000 : 0;
    this.domInteractiveTime = dbRecord.domInteractiveTime/1000 >= 0 ? dbRecord.domInteractiveTime/1000 : 0;
    this.redirectionCount = dbRecord.redirectioncount;
    this.referrerUrl = unescape(dbRecord.referrer);
    this.replayFlag = ((dbRecord.status & this.PAGEDUMP_FLAG) !== 0) ? true : false;
    this.resourceTimingFlag = ((dbRecord.status & this.RESOURCE_TIMING_FLAG) !== 0) ? true : false;
    this.ocxDataMissing = ((dbRecord.status & this.OCX_INFO_MISSING_PAGE) !== 0)  ? true : false; 
    this.overallDataMissing = ((dbRecord.status & this.OVERALL_INFO_MISSING_PAGE) !== 0) ? true : false; 
    this.navigationType = this.setNavigationType(dbRecord.navType);
    let timesid = moment.utc(dbRecord.navigationstarttime,"HH:mm:ss MM/DD/YYYY").valueOf();
    this.navigationStartTime =  moment.tz(new Date(timesid),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
    this.navigationStartTimeStamp = new Date (moment.utc(dbRecord.navigationstarttimestamp *1000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf()/1000;
    this.redirectionDuration = dbRecord.redirectionduration/1000 >= 0 ? dbRecord.redirectionduration/1000 : 0;
    this.cacheLookupTime = dbRecord.cachelookuptime/1000 >= 0 ? dbRecord.cachelookuptime/1000 : 0;
    this.dnsTime = dbRecord.dnstime/1000 >= 0 ? dbRecord.dnstime/1000 : 0;
    this.connectionTime = dbRecord.connectiontime/1000 >= 0 ? dbRecord.connectiontime/1000 : 0;
    this.secureConnectionTime = dbRecord.secureconnectiontime/1000 >= 0 ? dbRecord.secureconnectiontime/1000 : 0;
    this.navigationTypeTime = dbRecord.navigationtype;
    this.responseTime = dbRecord.responsetime/1000 >= 0 ? dbRecord.responsetime/1000 : 0;
    this.unloadTime = dbRecord.unloadtime/1000 >= 0 ? dbRecord.unloadtime/1000 : 0;
    this.domTime = dbRecord.domtime/1000 >= 0 ? dbRecord.domtime/1000 : 0;
    this.loadEventTime = dbRecord.loadeventtime/1000 >= 0 ? dbRecord.loadeventtime/1000 : 0;
    this.cookies = this.processCookies(dbRecord.cookie);
    this.pageInstance = dbRecord.pageinstance;
    this.eventListData = "";
    this.serverresponsetime = dbRecord.interestingPageFlag/1000 >= 0 ? dbRecord.interestingPageFlag/1000 : 0;
    this.bandWidth = dbRecord.bandWidth > 0  ?  dbRecord.bandWidth/1000 : 0;
    this.bytesIn = dbRecord.bytesIn > 0 ? dbRecord.bytesIn/1000 : 0;
    this.showbandWidth = dbRecord.bandWidth >= 0 ? this.getShowBandWidth(dbRecord.bandWidth) : 0;
    this.showbytesIn =  dbRecord.bytesIn >= 0 ? this.getShowbytesIn(dbRecord.bytesIn) : 0;
    this.transactionid  = dbRecord.transactionid;
    this.webviewFlag = false;
    var durl = unescape(dbRecord.url);
    if(durl && durl.trim() != "" && (durl.trim().startsWith("http:") == true || durl.trim().startsWith("https:") == true))
     this.webviewFlag = true;
    for(let i = 0;i< this.events.length;i++)
    {
      if(i !== 0) 
         this.eventListData += ",";
      this.eventListData +=  this.events[i].id;
    }
    this.flowpathinstances = dbRecord.flowpathid ? dbRecord.flowpathid : dbRecord.flowpathinstances;
    this.pageinstance = dbRecord.pageinstance;
    this.firstpaint = dbRecord.firstpaint/1000 >= 0 ? dbRecord.firstpaint/1000 : 0;
    this.firstcontentpaint = dbRecord.firstcontentpaint/1000 >= 0 ? dbRecord.firstcontentpaint/1000 : 0;
    this.firstinputdelay = dbRecord.firstinputdelay/1000 >= 0 ? dbRecord.firstinputdelay/1000 : 0;
    this.timetointeractive = dbRecord.timetointeractive/1000 >= 0 ? dbRecord.timetointeractive/1000 : 0;
    
  }

  // bug : 86873
  //Megabits
  getShowBandWidth(val)
  {
   let temp = '';
   if(val === null || val === '' || val == 0)
    return '-';
   else
    {
      if(val > 1000)
       temp = (val/1000).toFixed(3) + ' Mbps';
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
  
  
  constructor(dbRecord: any, index: number, metadata: Metadata) {
    // TODO: Fix the key name once it is modified in api.
    // check for record version. To take case migration. 
    const apiVersion: number = dbRecord.apiVersion || 1;
    
    if (apiVersion === 1)
    {
      this.fillFromDBRecordVersion1(dbRecord, index, metadata);
    }
  }
 
  processCookies(cookies)
  {
    try {
    cookies = decodeURIComponent(cookies);
    }
    catch(e)
    {
      return [];
    }
    let cookieList = cookies.split(";");
    let cookiesList = [];
    for(let i = 0;i < cookieList.length ; i++)
    {
      // cookie format getting from url:
      // CavSID=000161488485440552960; CavLTS=37599468; CavPI=1; CavSF=1
      // cases: split by ";" then "="
      // get the first index of =
      // if found then get the key and value of cookie 
      let index = cookieList[i].indexOf("=");
      if(index > 0)
      { 
          let nvCookie = false;
          if(cookieList[i].substr(0, index).trim().substr(0,3) === "Cav")
          {
            nvCookie = true;
          }
          cookiesList.push(
             new Cookie(
              cookieList[i].substr(0, index),
              //Cookie.addline(cookieList[i].substr(index+1),130),
              cookieList[i].substr((index+1),cookieList[i].length),
              nvCookie
             )
          );
      }
      else
      {
          continue;
      }
    }
    return cookiesList;
  }
}
