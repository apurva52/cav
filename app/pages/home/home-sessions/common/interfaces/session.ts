declare var unescape: any;

import {Browser} from './browser';
import {Event} from './event';
import {Location} from './location';
import {OS} from './operatingsystem';
import {Channel} from './channel';
import {PageName} from './page';
import {Store} from './store';
import { Metadata } from './metadata';
import { ScreenResolution } from './screenresolution';
import { UserSegment } from './usersegment';
import { Util } from './../util/util';
import { Device } from './device';
import {nvEncoder} from './nvencode';
import {BOTSummary} from './botsummary';
import * as moment from 'moment';
import 'moment-timezone';

/*
 * {"pagecount": 4,"browserplugins":"%5Bobject%20PluginArray%5D","channel":"Dotcom","useragent":"MOZILLA%2F5.0%20(WINDOWS%20NT%206.3%3B%20WIN64%3B%20X64)%20APPLEWEBKIT%2F537.36%20(KHTML%2C%20LIKE%20GECKO)%20CHROME%2F60.0.3112.90%20SAFARI%2F537.36","appsessionid":null,"clientsessionid2":null,"screenresolution":"1366x768","mobileosversion":"8.1","storeid":-1,"ordercount":"0","ordertotal":0,"devicetype":"PC","platform":"WINDOWS","userSegment":"","sid":"490323834579189761","duration":"00:15:24","trnum":-1,"eventlist":['check.png','cursor.png'],"browser":"Chrome","clientip":"192.168.20.1","sessionstarttime":"13:15:48 08/14/17","donottrack":"0","protocolVersion":"1","event":null,"accesstype":"-1","loginid":null,"browserlanguage":"en-US","sessionexpirytime":"13:37:12 08/14/17","browsercname":"cursor.png","exitpage":"Others","terminalid":-1,"ff1":"-1","ff3":null,"ff2":"{\"pdResVersion\": 1, \"prevSid\": \"0\"}","sessionflag":"0","monitorcolordepth":"24","mobileappversion":"60.0","monitorpixeldepth":"24","entrypage":"Others","sessionendtime":"13:31:12 08/14/17","location":"Others"}
 */
export class Session {
  visited = false;
  // visited will indicate all the sessions that are visited previously
  // lastViewed will indicate the last visited session
  lastViewed = false;
  sid: string;
  pageCount: number;
  channel: Channel;
  //application:Application;
  userAgent: string;
  screenResolution: ScreenResolution;
  // Note: OS will have both mobileosversion and platform.
  os: OS;
  store: Store;
  storeid: number;
  orderCount: number;
  orderTotal: number;
  deviceType: any;
  userSegments: UserSegment[];
  // TODO: we should keep this in sec
  duration: string;
  trnum: number;
  events: Event[];

  // TODO: I think these information we can get from userAgent.
  browser: Browser;
  // Note: should be taken from mobileappversion
  browserVersion: string;

  browserLang: string;
  browserCodeName: string;
  clientIp: string;
  // TODO: create a class for all the timestamp.
  // TODO: Currently we will use DatePipe filter to show this timestamp in different format.
  // TODO: need to get timezone of the system so we can convert into proepr msec.
  startTime: number;
  expiryTime: number;
  endTime: number;

  doNotTrack: boolean;
  protocolVersion: number;
  loginId: string;

  // Review these fields again.
  appSessionId: string;
  clientSessionId: string;
  entryPage: string;
  exitPage: string;
  terminalId: number;
  // TODO: get from ff1.
  associateId: string;
  ff3 : string;
  // TODO: ff3 - what is this field for ?
  // Note: these fields will come from ff2 - "{\"pdResVersion\": 1, \"prevSid\": \"0\"}"
  resourceVersion: number = -1;
  prevSID: number = -1;
  // TODO: this flag is being used to decide if replay is enable etc. For this there should be method.
  // It should not be use directly
  private sessionFlag: number;
  monitorColorDepth: number;
  monitorPixelDepth: number;
  location: Location;
  partitionID: string;
  formattedStartTime: string;
  formattedEndTime: string;
  flowpathInstances: string;
  osVersion: string;
  struggling: boolean;
  sessionHasTxn: boolean; 
 // crashSessions: boolean;
  maxOnLoad:number = 0;
  avgOnLoad:number = 0;
  maxTTDI:number = 0;
  avgTTDI:number = 0;
  uuid: string;
  botFlag = false;
  botData = null;
  badBot = true;
  authFailed = false;
  authentic = false;
  windowsBrowserFlag  = false;
  browserFlag  = false;
  androidflag = false;
  windowsappflag = false;
  AndroidBrowserFlag  = false;
  //Flag For App Crash when browser id is 20, 9,10(WindowsApp,Iphone,Anderoid)
  appcrashflag : boolean = false;
  //Flag for device and location info when browser id is 9, 10 (Iphone,Anderoid)
  device_location_infoflag : boolean = false;
  //Flag for device info when browser id is 9, 10, 20(Iphone,Anderoid,WindowsApp)
  // location will not be shown in case of  WindowsApp
  device_infoflag : boolean = false;
  //Flag For DevicePerformance when browser id is 10 (Anderoid)
  deviceperformanceflag : boolean = false;
  methodtraceflag  : boolean = false;
  applicationName : any;
  applicationVersion : any;
  conType : any;
  jsVersion : any;
  configVersion : any;
  appstarttime : any;

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
           let event = { iconCls : null, icon : "/netvision/images/countryIcons/questionmark.png", name : "Others", description : "Others", id : parseInt(record), count:1, sid : "", pageid : -1, pageinstance : -1};
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

  // adding each user segment obj corresponding to the id in the session.
  fillUserSegmentForSession (userSegments:string , metadata: Metadata)
  {
    if(!userSegments || (userSegments === undefined) || userSegments === "")
     return [];
    const segmentIds = userSegments.split(',');
    let segmentLists: UserSegment[] = [];
    try
    {
      segmentIds.forEach(
      function(record)
        {
        segmentLists.push(metadata.getUserSegment(parseInt(record)));
      }
      );
    }
    catch (e)
    {
      return null;
    }
    return segmentLists;
  }

  fillFromDBRecordVersion1 (dbrecord: any, metadata: Metadata,active:boolean)
  {
   this.sid = dbrecord.sid;
   this.pageCount = dbrecord.pagecount;
   this.channel = metadata.getChannel(parseInt(dbrecord.channel));
   if(dbrecord.useragent !== undefined && dbrecord.useragent !== null)
     this.userAgent = unescape(dbrecord.useragent);
   else
     this.userAgent = "-";

   // in case of active session , screen id "816x489" or id , that needs to map
    if((""+dbrecord.screenresolution).indexOf("x") !== -1)
      this.screenResolution = new ScreenResolution({"id":-1, "name":dbrecord.screenresolution});
    else
      this.screenResolution = metadata.getScreen(parseInt(dbrecord.screenresolution));
   if(dbrecord.platform)
     this.os = metadata.getOS(parseInt(dbrecord.platform.split('|').join('')));
   if(dbrecord.platform === "")
     this.os = metadata.getOS(dbrecord.platform);
   this.storeid = parseInt(dbrecord.storeid);  
   this.store = metadata.getStore(dbrecord.storeid);
   this.orderTotal = dbrecord.ordertotal || 0;
   this.orderCount = dbrecord.ordercount || 0;
   this.deviceType = Device.devices[dbrecord.devicetype];
   this.applicationName = ""; 
   this.applicationVersion = ""; 
   this.userSegments = this.fillUserSegmentForSession(dbrecord.userSegment, metadata);
   this.duration = Util.SecToFormattedDuration(dbrecord.duration);
   this.trnum = dbrecord.trnum;
   // There are two fields event and eventlist using event for now with assumption that it will comma separated id's
   this.events =  this.fillEventsForSession(dbrecord.event, metadata);
   //if(dbrecord.event)
     this.struggling = metadata.isStrugglingUser(dbrecord.event,metadata);
     this.sessionHasTxn = ((dbrecord.sessionflag & 0x20000) != 0);
   this.browser = metadata.getBrowser(parseInt(dbrecord.browser));
   if(parseInt(dbrecord.browser) === 20)
   {
   this.appcrashflag = true;
   this.windowsBrowserFlag = true;
   this.windowsappflag = true;
   this.browserFlag = true;
   this.device_infoflag = true;
 
   }
   else if(parseInt(dbrecord.browser) === 10 || parseInt(dbrecord.browser) === 21)
   {
   this.appcrashflag = true;
   this.device_location_infoflag = true;
   this.device_infoflag = true;
   this.deviceperformanceflag = true;
   this.methodtraceflag = true;
   this.AndroidBrowserFlag = true;
   this.androidflag = true;
   this.browserFlag = true;
   }
   else if(parseInt(dbrecord.browser) === 9)
   {
     this.appcrashflag = true;
     this.device_location_infoflag = true;
     this.device_infoflag = true;
   }
   else
   {
      this.appcrashflag = false;
      this.device_infoflag = false;
      this.appcrashflag = false;
      this.device_location_infoflag = false;
      this.deviceperformanceflag = false;
      this.methodtraceflag = false;
   }

   this.browserVersion = dbrecord.mobileappversion;
   this.browserLang = dbrecord.browserlanguage;
   this.browserCodeName = dbrecord.browsercname;
   this.clientIp = dbrecord.clientip;
   //console.log("dbrecord.sessionstarttime : ",dbrecord.sessionstarttime ," dbrecord.sessionendtime : ",dbrecord.sessionendtime);
   //this.startTime = new Date (moment.utc(parseInt(""+dbrecord.sessionstarttime)*1000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf()/1000;
   //this.endTime = new Date (moment.utc(parseInt(""+dbrecord.sessionendtime)*1000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf()/1000;
   this.startTime = dbrecord.sessionstarttime;
   this.endTime = dbrecord.sessionendtime;
   //console.log("this.startTime ",this.startTime," this.endTime : ",this.endTime);
   this.expiryTime = dbrecord.sessionexpirytime;
   this.doNotTrack = dbrecord.donottrack;
   this.protocolVersion = dbrecord.protocolVersion;
   this.loginId = dbrecord.loginid;
   
   //Bug 76202: In case of native app + was coming in encoded login Id and because of which decode was throwing exception. Replace + by ''
   if(this.loginId !== null)
   {
     this.loginId = this.loginId.replace(/\+/g, '');
     try
    { 
      this.loginId = nvEncoder.decode(dbrecord.loginid);
    }
    catch(e)
    {
     this.loginId = dbrecord.loginid;
    }
   }
   this.appSessionId = dbrecord.appsessionid;
   this.clientSessionId = dbrecord.clientsessionid2;
   this.entryPage = metadata.getPageName(parseInt(dbrecord.entrypage)).name;
   this.exitPage = metadata.getPageName(parseInt(dbrecord.exitpage)).name;
   this.terminalId =parseInt(dbrecord.terminalid); 
   this.associateId = dbrecord.ff1;
   this.ff3= dbrecord.ff3;
   let botff2 = null;
   try
   { 
     if (dbrecord.ff2)
     {
       let ff2record = "";
       if(!active){
        ff2record = dbrecord.ff2;
     }
     else
     {
       ff2record = dbrecord.ff2.split('}{').join(',').split("{").join("{\"").split(':').join("\":").split(',').join(",\"");
     }
     const ff2 = JSON.parse(ff2record);
     botff2 = ff2;
     this.resourceVersion = ff2.pdResVersion || -1;
     this.prevSID = ff2.prevSid || -1;
     if(ff2.maxOnload > 0)
       this.maxOnLoad = parseFloat((ff2.maxOnload/1000).toFixed(2)) ;
     if(ff2.maxTTDI > 0)
       this.maxTTDI = parseFloat((ff2.maxTTDI/1000).toFixed(2));
     if(ff2.avgTTDI > 0)
       this.avgTTDI = parseFloat((ff2.avgTTDI/1000).toFixed(2));
     if(ff2.avgOnLoad > 0)
      this.avgOnLoad = parseFloat((ff2.avgOnLoad/1000).toFixed(2));
     if(ff2.uuid != null && ff2.uuid != undefined)
      this.uuid = ff2.uuid;
     if(ff2.cv != null && ff2.cv != undefined)
      this.jsVersion = ff2.cv;
     if(ff2.cvf != null && ff2.cvf != undefined)
      this.configVersion = parseInt(ff2.cvf , 16);
    }
   }
   catch(e)
   {
     console.log("error parsing ff2 field");
      if (dbrecord.ff2) {
     let s = '(function() {return '+dbrecord.ff2+';})();'
     let ff3 = {};
     try{
       ff3 = eval(s);
       botff2 = ff3;
       this.resourceVersion = ff3["pdResVersion"] || -1;
       this.prevSID = ff3["prevSid"] || -1;
       if(ff3["maxOnload"] && ff3["maxOnload"] > 0)
         this.maxOnLoad = parseFloat((ff3["maxOnload"]/1000).toFixed(2)) ;
       if(ff3["maxTTDI"] && ff3["maxTTDI"] > 0)
         this.maxTTDI = parseFloat((ff3["maxTTDI"]/1000).toFixed(2));
       if(ff3["avgTTDI"] && ff3["avgTTDI"] > 0)
         this.avgTTDI = parseFloat((ff3["avgTTDI"]/1000).toFixed(2));
       if(ff3["avgOnLoad"] && ff3["avgOnLoad"] > 0)
        this.avgOnLoad = parseFloat((ff3["avgOnLoad"]/1000).toFixed(2));
     }catch(e){console.log("error in evaluating ff2 field");};
    }
   }
   let sessionflag = dbrecord.sessionflag;

    // handling for bot information.
   if(sessionflag != null && sessionflag != undefined)
   {

      if((sessionflag  & 0x2000) != 0)
      {
         this.botFlag = true;
         if((sessionflag & 0x4000) != 0)
          this.badBot = false;
         if((sessionflag & 0x8000) != 0)
          this.badBot = true;
      }
       try
         {

           if(botff2 != null && botff2.botSummary != undefined)
           {
             this.botData = new BOTSummary(botff2.botSummary);
           }
 }
         catch(e)
         {
           console.log("error in parsing ff2 field");
           this.botData = null;
         }

   }

   // handling for auth failed
   if(sessionflag != null && sessionflag != undefined)
   {
      if(!((sessionflag  &  0x1000) != 0))
      {
         this.authentic = false;
         this.authFailed = false;
      }
      else
      {
         this.authentic = true;
         if(!((sessionflag & 0x800) != 0))
          this.authFailed = true;
         else
          this.authFailed = true;
      }
   }
   else
   {
      this.authentic = false;
      this.authFailed = false;
   }


   this.sessionFlag = dbrecord.sessionflag;
   this.monitorColorDepth = dbrecord.monitorcolordepth;
   this.monitorPixelDepth = dbrecord.monitorpixeldepth;
   this.location = metadata.getLocation(parseInt(dbrecord.location));
   this.partitionID = dbrecord.partitionID;
   //console.log("dbrecord.formattedStartTime ",dbrecord.formattedStartTime , " dbrecord.formattedEndTime ",dbrecord.formattedEndTime," _nvtimezone : ",sessionStorage.getItem("_nvtimezone"));
   let timesid = moment.utc(dbrecord.formattedStartTime,"HH:mm:ss MM/DD/YYYY").valueOf();
   this.formattedStartTime = moment.tz(new Date(timesid),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
   let timesidd = moment.utc(dbrecord.formattedEndTime,"HH:mm:ss MM/DD/YYYY").valueOf();
   this.formattedEndTime = moment.tz(new Date(timesidd),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
   //console.log("this.formattedStartTime ", this.formattedStartTime ," this.formattedEndTime ",this.formattedEndTime);
   this.flowpathInstances = dbrecord.flowpathinstances;
   this.osVersion = dbrecord.mobileosversion;
   this.conType = metadata.getConnectionType(parseInt(dbrecord.conType));
   this.appstarttime = "";
   if(dbrecord.appStartTime != null && dbrecord.appStartTime != undefined && dbrecord.appStartTime > 0)  
     this.appstarttime = parseInt(dbrecord.appStartTime) / 1000;  
 }

constructor(dbRecord: any, metadata: Metadata,active: boolean) {
    // TODO: Fix the key name once it is modified in api.
    // check for record version. To take case migration.
    const apiVersion: number = dbRecord.apiVersion || 1;
    if (apiVersion === 1)
    {
      this.fillFromDBRecordVersion1(dbRecord, metadata,active);

    }
  }
 
}
