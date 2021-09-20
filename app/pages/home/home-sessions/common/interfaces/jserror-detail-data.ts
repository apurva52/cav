import { Metadata } from './metadata';
import { Device } from './device';
import * as moment from 'moment';
import 'moment-timezone';

export class JsErrorDetailData {

   constructor(dbrecord : any, metadata: Metadata)
   { 
      this["filename"] = dbrecord.filename;
      this["line"] = dbrecord.line;
      this["columns"] = dbrecord.col;
      this["errormessage"] = dbrecord.errormessage;
      this["page"] = dbrecord.page;
      let timesid = moment.utc(dbrecord.timestamp,"HH:mm:ss MM/DD/YYYY").valueOf();
      this["timestamp"] = moment.tz(new Date(timesid),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
      this["device"] = dbrecord.deviceType;
      this["platform"] = decodeURIComponent(dbrecord.platform);
      this["storeid"] = dbrecord.storeId;
      this["terminalid"] = dbrecord.terminalId;
       this["browser"] = metadata.getBrowser(parseInt(dbrecord.browserid));
        this["location"] = metadata.getLocation(parseInt(dbrecord.locationid));
       this["stacktrace"] = decodeURIComponent(dbrecord.stacktrace);
        this["sid"] = dbrecord.sid;
        this["pageinstance"] = dbrecord.pageinstance;
       this["tokenizedStackTrace"] = this.tokenizeScripts(decodeURIComponent(dbrecord.stacktrace));
 }
       tokenizeScripts(stacktrace)
  {
    let tokens = [];
    let urls = [];
    let urlPattern =  new RegExp(/\http.*\b/g);  // e.g. http://10.10.60.4:9026/tours/jsscript2.js:3:4

    // getting all the urls of stack trace.
    urls = stacktrace.match(urlPattern);
    console.log(urls);
    /*
       type 0 : normal text
       type 1 : script/file sources
    */

    if(urls === null) // if no urls present
        {
      tokens.push({type : 0, text : stacktrace});
          return tokens;
    }
    let startIndex = 0;
    let endIndex = 0;
    for(let i = 0; i < urls.length; i++)
     {
      endIndex = stacktrace.indexOf(urls[i])-1;
       if(i === 0)
       {
        let error = stacktrace.substring(startIndex,endIndex).split("at");
        if(error[0] != undefined)
         tokens.push({ type : -1, text : error[0].trim()});
        if(error[1] != undefined)
         tokens.push({ type : 0, text : "at " + error[1].trim()});
       }
       else
        tokens.push({ type : 0, text : stacktrace.substring(startIndex,endIndex)});
           endIndex++;
       startIndex = endIndex;
       endIndex += urls[i].length;
       let urlTokens = stacktrace.substring(startIndex,endIndex).split("/");
       let fileName = urlTokens[urlTokens.length - 1].split(":")[0];
       let fullFileName = stacktrace.substring(startIndex,endIndex).split(":")[0] + stacktrace.substring(startIndex,endIndex).split(":")[1];
       tokens.push({ type : 1, text : stacktrace.substring(startIndex,endIndex), file : fileName, url : fullFileName});
       startIndex = endIndex + 1;
    }

    return tokens;
}                                                     
	  }

