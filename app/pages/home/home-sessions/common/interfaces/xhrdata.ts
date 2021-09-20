import { Metadata } from './metadata';
import { Device } from './device';
export class XHRData {

   constructor(dbrecord : any, metadata: Metadata)
   {
      this["timestamp"] = dbrecord.timestamp;
      //this["domain"] = dbrecord.domain;
      this["statuscode"] = dbrecord.statuscode;
      this["method"] = dbrecord.method;
      this["bytestransferred"] = dbrecord.bytestransferred;
      this["responsetime"] = dbrecord.responsetime;
      this["connectionType"] = dbrecord.connectionType;
      this["location"] = metadata.getLocation(parseInt(dbrecord.location));
      this["correlationId"] = dbrecord.correlationId;
      this["devicetype"] = Device.devices[dbrecord.devicetype];
      this["domainid"] = dbrecord.domainsubid;
      this["resourceid"] = dbrecord.resourceid;
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
      this["sessionendtime"] = dbrecord.sessionendtime;
      this["sessionstarttime"] = dbrecord.sessionstarttime;
      this["responsetime"] =parseFloat(dbrecord.httpResponsetime);
      this["data"] = '';
      if(dbrecord.resourceName !== null && dbrecord.resourceName !== undefined)
{
 var a = dbrecord.resourceName;
         var b = '';
        if(a.includes("http") || a.includes("https"))
         {
         b = a.substring(a.indexOf('//') + 2);
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
            var domain =  b.split(/\/(.+)/)[0];
             if(domain.includes(":"))
             {
               domain = domain.split(":")[0];
             }
             
             this["domain"] = domain;
            }
          
      else
      {
       this["resource"] = "";
	   this["domain"] = "";
      }

      this["flowpathinstance"] = dbrecord.flowpathinstance;
      this["trnum"] = dbrecord.trnum;
      this["count2xx"] = dbrecord.count2xx;
      this["count4xx"] = dbrecord.count4xx;
      this["count5xx"] = dbrecord.count5xx;
      this["totalCount"] = dbrecord.totalCount;
     this["failureCode"] = dbrecord.totalCount - dbrecord.count2xx; 
      //this["resource"] = dbrecord.resourceName;
      this["minresponse"] =parseFloat(dbrecord.minresponse);
      this["maxresponse"] =parseFloat(dbrecord.maxresponse); 
          }
          }
                                 
