import { Metadata } from './metadata';
import { Device } from './device';
import * as moment from 'moment';
import 'moment-timezone';
export class HttpDetailData {

   constructor(dbrecord : any, metadata: Metadata,index : any)
   { 
      let timesid = moment.utc(dbrecord.timestamp,"HH:mm:ss MM/DD/YYYY").valueOf();
      this["timestamp"] = moment.tz(new Date(timesid),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
      this["domain"] = dbrecord.domain;
      this["parameter"] = JSON.parse(unescape(dbrecord.data)).query === "" ? "-" : JSON.parse(unescape(dbrecord.data)).query;
      this["statuscode"] = dbrecord.statuscode;
      this["method"] = dbrecord.method;
      this["bytestransferred"] = dbrecord.bytestransferred;
      this["responsetime"] = dbrecord.httpResponsetime;
      this["connectionType"] = dbrecord.connectionType; 
      this["location"] = metadata.getLocation(parseInt(dbrecord.location));
      this["correlationId"] = dbrecord.correlationId;
      this["devicetype"] = Device.devices[dbrecord.devicetype];
      //this["browser"] = dbrecord.browser;
      this["browser"] = metadata.getBrowser(parseInt(dbrecord.browser));
      this["browserVersion"] = dbrecord.mobileappversion;
      this["sid"] = dbrecord.sid;
      this["os"] = dbrecord.os;
      this["mobileCarrier"] = metadata.getMobileCarrier(parseInt(dbrecord.mobileCarrier));
      this["terminalid"] = dbrecord.terminalid;
      this["store"] = metadata.getStore(dbrecord.storeid);
      this["pageName"] = dbrecord.pageName;
      this["pageInstance"] = dbrecord.pageinstance;
      //this["sessionendtime"] = (new Date (moment.tz(new Date(dbrecord.sessionendtime),sessionStorage.getItem('_nvtimezone')).format('HH:mm:ss MM/DD/YY'))).valueOf();
      //this["sessionstarttime"] = (new Date (moment.tz(new Date(dbrecord.sessionstarttime),sessionStorage.getItem('_nvtimezone')).format('HH:mm:ss MM/DD/YY'))).valueOf();
      this["sessionendtime"] = dbrecord.sessionendtime;
      this["sessionstarttime"] = dbrecord.sessionstarttime;
      this["timings"] = this.getTiming(JSON.parse(decodeURIComponent(dbrecord.data)).timings);
      this["data"] = JSON.parse(decodeURIComponent(dbrecord.data));
      if(JSON.parse(decodeURIComponent(dbrecord.data)).url !== null && JSON.parse(decodeURIComponent(dbrecord.data)).url !== undefined)
{       
 var a = JSON.parse(decodeURIComponent(dbrecord.data)).url;
         var b = '';
        if(a.includes("//"))
         {
         b = a.split("//")[1];
         }
         else 
         {
         b = a;
         }
         var completeResource  =  "/"+b.split(/\/(.+)/)[1];
         this["completeresource"] = completeResource;
         if(completeResource.length > 65)
         {
           this["resource"] = completeResource.substr(0, 62) + "...";
         }
         else
         {  
           this["resource"] =  completeResource;
         }
 }
      else
      {
       this["resource"] = "";
      }
      this["flowpathinstance"] = dbrecord.flowpathinstance;
      this["trnum"] = dbrecord.trnum;
      this["index"] = index;
	  }

         convertIntoTime(ms)
  {
    if((parseInt(ms)/1000) > 0)
    {
      if(parseInt((ms/1000).toString().split(".")[0]) > 10)
      {
        return "00:"+(ms/1000);
      }
      else
      {
        return "00:0"+(ms/1000);
      }
    }
    else if(ms == 0)
      return "00:00.00";
    else
      return "00.00:"+ms;
  }

  
  
  getTiming(t)
  {
     if(t == null)
       return null;
     let tArr = Object.keys(t).map(key => t[key]).sort();
     tArr = tArr.sort();
     let c = {};
     c["opened"] = "00:00.000";
     c["requestStart"] = this.convertIntoTime(tArr[1] - tArr[0]);
     c["loading"] = this.convertIntoTime(tArr[2] - tArr[0]);
     c["header_received"] = this.convertIntoTime(tArr[3] - tArr[0]);
     c["loadEventEnd"] = this.convertIntoTime(tArr[4] - tArr[0]);
     c["done"] =  this.convertIntoTime(tArr[5] - tArr[0]);
     return c;
  }

	  }
