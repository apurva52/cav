import { Metadata } from './metadata';
import { Device } from './device';
export class JSErrorData {

   constructor(dbrecord : any , metadata:Metadata)
   { 
      this["filename"] = dbrecord.filename;
      this["line"] = dbrecord.line;
      this["columns"] = dbrecord.col;
      this["errormessage"] = dbrecord.errormessage;
      this["count"] = dbrecord.count;
      if(dbrecord.page !== "All")
      this["page"] = dbrecord.page;
      else
      this["page"] = "All";
      if(dbrecord.browserid !== "All")
     {
      this["browser"] = metadata.getBrowser(parseInt(dbrecord.browserid)); 
      this["browserid"] = dbrecord.browserid;
     }
      else
      {
      this["browser"] = "All";
      this["browserid"] = "All";
      }
     if(dbrecord.platform !== "All")
      this["os"] = metadata.getOS(parseInt(dbrecord.platform.split('|').join('')));
       else
       this["os"] = "All";
      if(dbrecord.mobileappversion === "All")
       this["browserversion1"] = "All";
       else
        this["browserversion1"] = dbrecord.mobileappversion;
       if(dbrecord.mobileosversion === "All")
       this["osversion1"] = "All";
       else
       this["osversion1"] = dbrecord.mobileosversion;
 }
	  }

