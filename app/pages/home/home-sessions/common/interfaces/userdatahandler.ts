import { NvhttpService } from '../service/nvhttp.service';
import { UserDataRecord } from './userdatarecord';
import { Util } from '../util/util';
//import { PageComponent } from '../page.component';
import { UserDataInformation } from './userdatainformation';
import { nvEncoder} from '../interfaces/nvencode';

declare var unescape: any;
export class UserDataHandler {

  static USER_TIMING  = 0;
  static USER_ACTION  = 1;
  static XHR_DATA = 2;
  static TRANSACTION_START = -3;
  static TRANSACTION_END = -4;
  static JSERRDATA = -5;
  
  // output lists
  resultData = {
    'actionList' : [],
    'txnList' : []
  };

  
  // storing data
  userActionData = null;
  userTimingData = null;
  ajaxData = null;
  jserrorData = null; 
  nvHttpService: NvhttpService;
  sid: string;
  pageInstance: number;
  sessionStartTime: number;
  userTimingCallback = null;
  actionList = null;
  txnList = null;
  duration = 0;
  
  constructor(sid,pageInstance,sessionStartTime,duration)
  {
    this.sid = sid;
    this.pageInstance = pageInstance;
    this.sessionStartTime = sessionStartTime * 1000;
    this.duration = duration;
    return this;
  }

  getUserData(ref)
  {
      // getting user timing
      this.nvHttpService.getUserTiming(this.sid, this.pageInstance, this.duration).subscribe(
        (userTimingResponse) => {
           if(userTimingResponse === null)
           {
             return;  
           }
           this.userTimingData = userTimingResponse;
           this.nvHttpService.getUserActionData(this.sid, this.pageInstance, this.duration,null).subscribe(
             (userActionResponse : any) => {
               if(userActionResponse === null)
               {
                 return;  
               }
               // for eventype -10 data for long task and -11 for callback execution
               this.nvHttpService.getUserActionData(this.sid, this.pageInstance, this.duration, "-10, -11").subscribe(
                 (specuserActionResponse : any) => {
                   if(specuserActionResponse != null)
                   {
                      try{
                       // merging both arrays
                       for(let i=0; i<specuserActionResponse.length;i++){
                         userActionResponse.push(specuserActionResponse[i]);
                       }
                      }catch(e){
                        console.log("Exception while taking data for long task : " + e);
                      }
                   }
                }); 
               this.userActionData = userActionResponse;
               this.nvHttpService.getAjaxData(this.sid, this.pageInstance, this.duration).subscribe(
                (ajaxResponse) => {
                   if(ajaxResponse === null)
                   {
                    return;  
                   }
                   this.ajaxData = ajaxResponse;
                   this.processData();
                   ref.actionList = [];
                   ref.actionList = this.resultData.actionList;
                   ref.transactions = [];
                   ref.transactions = this.resultData.txnList;
                 }
                );
             }
           );
        }
      );
  }

  processData()
  {
    // merge all records in a single list
    // timestamp, pageinstance, type, data.
    let rawList = [];
    for(let z = 0; z < this.userActionData.length; z++)
    {
      rawList.push(new UserDataRecord(UserDataHandler.USER_ACTION, this.userActionData[z]));
    }
    
    for(let z = 0; z < this.userTimingData.length; z++)
    {
      if(this.userTimingData[z].type !== 3)
      {
        rawList.push(new UserDataRecord(UserDataHandler.USER_TIMING, this.userTimingData[z]));
      }
      else 
      {
         // Note: for Transaction we will add two records. one for start and another for end. 
         rawList.push(new UserDataRecord(UserDataHandler.TRANSACTION_START, this.userTimingData[z]));
         rawList.push(new UserDataRecord(UserDataHandler.TRANSACTION_END, this.userTimingData[z]));
      }
    }
    
    for(let z = 0; z < this.ajaxData.length ;z++)
    {
      rawList.push(new UserDataRecord(UserDataHandler.XHR_DATA, this.ajaxData[z]));
    }
    // iterate for this.jserror
    for(let z = 0; z < this.jserrorData.length ;z++)
    {
      rawList.push(new UserDataRecord(UserDataHandler.JSERRDATA, this.jserrorData[z]));
    }
    // sort both data on pageindex and time. 
    rawList = rawList.sort(function(a, b)
    {
      if(a.timestamp < b.timestamp)
      {
        return -1;
      }
      else if(a.timestamp > b.timestamp)
      {
        return 1;
      }
      else
      {
        // keeping txn above xhr at same timestamp
        if(a.type === UserDataHandler.TRANSACTION_START && b.type !== UserDataHandler.TRANSACTION_START)
        {
           return -1;
        }
        else if(a.type !== UserDataHandler.TRANSACTION_START && b.type === UserDataHandler.TRANSACTION_START)
        {
          return 1;
        }
        
        return 0;
      }
    });
    return this.convertToUserData(rawList);
  }
  openTxn = [];
  convertToUserData(rawList)
  {
    // let openTxn = [];
    let lastUserAction = -1;
    let prevtimestamp = 0;
    // let entry;
    let actionList = []; 
    let txnList = [];
      
   
    for(let z = 0; z < rawList.length; z++)
    {
      let entry = null;
      if(rawList[z].recordType === UserDataHandler.USER_TIMING ||
         rawList[z].recordType === UserDataHandler.TRANSACTION_START ||
         rawList[z].recordType === UserDataHandler.TRANSACTION_END)
      {
        entry = this.convertUserTimingToUserData(rawList[z].data,rawList[z].recordType);
      }
      else if(rawList[z].recordType === UserDataHandler.JSERRDATA)  
       entry = this.convertJserrordata(rawList[z].data,rawList[z].timestamp);
      else if(rawList[z].recordType === UserDataHandler.USER_ACTION)
      {
        if(rawList[z].data.eventType === 1)
        {
         continue;
        }
        if(rawList[z].data.eventType === 0)
        {
         continue;
        }
        // Scroll event will not be shown multiple time
        if(lastUserAction === 1003 && rawList[z].data.eventType === 1003)
        {
         continue;
        }
        entry = this.convertUserActionToUserData(rawList[z].data);
        lastUserAction = rawList[z].eventType;
      }
      else if(rawList[z].recordType === UserDataHandler.XHR_DATA)
      {
        entry = this.convertAjaxData(rawList[z].data,rawList[z].timestamp);
      }
      // add entry.
      if(entry)
      {
        if(prevtimestamp > 0)
        {
          entry.prevTime = Util.formattedDuration(rawList[z].timestamp - prevtimestamp);
        }
        actionList.push(entry) ;
        prevtimestamp = rawList[z].timestamp;

        // check if it was transaction then update the openTxn.
        if(rawList[z].recordType === UserDataHandler.TRANSACTION_START)
        {
          // Note: set the index so we can close the transaction.
          rawList[z].data._seq  = this.addOpenTxn(entry);
          
        }

        this.fillInOpenTxn(entry);

         if(rawList[z].recordType === UserDataHandler.TRANSACTION_END)
         { 
           // remove by seq.
           delete this.openTxn[rawList[z].data._seq];
         }
      }
    }
      
     // create txnList
    // create txnList
    txnList = [];
    for(let z = 0; z < actionList.length; z++)
    {
      if(actionList[z].typeInfo === 'Transaction')
        {
          txnList.push(actionList[z]);
        }
    }
      
     // create txnList
    
    
    this.resultData.actionList = actionList;
    this.resultData.txnList = txnList;
  }
  
   // helping methods
   addOpenTxn(entry)
   {
     // check for free hole in openTxn.
     let next = this.openTxn.length;
     for(let z = 0; z < this.openTxn.length; z++)
     {
       if(this.openTxn[z] === undefined)
       { 
         next = z;
       }
     }
     this.openTxn[next] = entry;
     return next;
   }
    
   fillInOpenTxn(record)
   {
      for(let z = 0;z < this.openTxn.length; z++)
      {
       if(this.openTxn[z] !== undefined)
       {
         this.openTxn[z].txData = this.openTxn[z].txData || [];
         this.openTxn[z].txData.push(record);
       }
      }
   }
  
  convertUserActionToUserData(data) 
  {
    let record = new UserDataInformation(data.timestamp - this.sessionStartTime,'','', data.value);
    if(data.duration > 0)
     {
      record.duration = Util.formattedDuration(data.duration);
     }
    record.typeInfo = 'User Action';
    if(data.eventType == "-10")
      record.typeInfo = 'Long Task';
    else if (data.eventType == "-11")
      record.typeInfo = 'Callback Execution';
    record.id = data.id;
    let elementName ;
    if(data.elementName)
     { 
      elementName = data.elementName;
     }
    else 
    {
      // TODO: check for subtype.
     if(data.idtype === -1)
     {
       if(data.id)
       {
        elementName = data.id;
       }
     }
     else
     {  
      elementName = data.elementType;
      }
    }
    let value = '';
    if(data.hasOwnProperty('value'))
    {
        try{
         value = nvEncoder.decode(value);
         }
        catch(e)
         {
           value = unescape(data.value);
         }
    }
    let action = null;
    switch(data.eventType)
    {
      case 1000:
         // TODO: 
         break;
      case 0:
        action = "<b>Focus on </b>" + "<label style='color:blue'>" + elementName + "</label>";
        break;
      case 1:
        action = "<b>Blur on </b>" +  "<label style='color:blue'>" + elementName + "</label>";
        break;
      case 2:
         action = '<b>Clicked on </b>' +  "<label style='color:blue'  title = "+data.id+">" + elementName + "</label>";
        break;
      case 3:
        if(data.elementType.toLowerCase() === "input")
        {
         if(data.hasOwnProperty('elementSubType') && data.elementSubType === "text")
          {
           action = '<b>Entered  Text </b> ' +    "<label style='color:blue' title = "+data.id+">" + value + " in  " + elementName + "</label>";
          }
         else if(data.hasOwnProperty('elementSubType') && data.elementSubType === "password")
          { 
           action = '<b>Entered  Password </b> ' +    "<label style='color:blue' title = "+data.id+" >" + value + " in  " + elementName + "</label>";
          }
         else if(data.hasOwnProperty('elementSubType') && data.elementSubType === "radio")
          { 
            action = '<b>Selected Radio Button &nbsp;</b> ' +    "<label style='color:blue' title = "+data.id+">" + value + " in  " + elementName + "</label>";
          }
         else if(data.hasOwnProperty('elementSubType') && data.elementSubType === "submit")
          {
           action = '<b>Clicked </b> ' +    "<label style='color:blue' title = "+data.id+">" + value + " in  " + elementName + "</label>";
          }
         else if(data.hasOwnProperty('elementSubType') && data.elementSubType === "checkbox")
          { 
           action = '<b>Select checkbox </b> ' +    "<label style='color:blue' title = "+data.id+">" + value + " in  " + elementName + "</label>";
          }
         else
          { 
           action = '<b>Entered   </b> ' +    "<label style='color:blue' title = "+data.id+">" + value + " in  " + elementName + "</label>";
          }
        }
        if(data.elementType.toLowerCase() === "select")
          {
           action = '<b>Select  </b> ' +    "<label style='color:blue'  title = "+data.id+">" + value + " in  " + elementName + "</label>";
          }
        break;

      case 1003:
        action = '<b>Scrolled Frame</b>';
        break;
      case 1002:
        action = '<b>Resized Frame</b>';
        break;
      case 1004:
        action = "<b>ORIENTATION Change</b> ";
        break;
      case -10:
        action = '<b>Long Task</b>';
        break;
      case -11:
        action = '<b>Callback Execution path </b>';
    }
    // Note: if action not given then return.
    if(!action)
     {
      return null;
     }  
    record.action = action;
    return record;
 }
  
   convertUserTimingToUserData(data,typetr) {
    let record = new UserDataInformation(data.timestamp - this.sessionStartTime , data.duration, data.actionName, data.value);
    // Note: skipping measure.
    if(data.type === 1) 
    { 
     return null;
    }
    let action = null;
    let type = null;
    if(typetr === UserDataHandler.USER_TIMING)
    {
     if(data.type === 0)
     {
      action = "<b>mark </b><label style='color:blue'>" + data.actionName + "</label>";
      type = "Mark";
     }
     else if(data.type === 2)
     {
      action = "<b> Action </b><label style='color:blue'>" +  data.actionName + "</label> Completed";
      type = "Action";
     }
     else if(data.type === 3)
     {
      action = "<b> Transaction </b><label style='color:blue'>" +  data.actionName + "</label> Completed";
      type = "Transaction";
     }
    }
    else if(typetr === UserDataHandler.TRANSACTION_START)
    {
      action = "<b> Transaction </b><label style='color:blue'>" +  data.actionName + "</label> Started";
      type = "Transaction";
      //stimestamp and mduration used for method trace log
      record["stimestamp"] = data.timestamp;
      record["mduration"] = data.duration;
    }
    else if(typetr === UserDataHandler.TRANSACTION_END)
    {
      action = "<b> Transaction </b><label style='color:blue'>" +  data.actionName + "</label> End";
      type = "Transaction";
      record["stimestamp"] = data.timestamp;
      record["mduration"] = data.duration;
    }

    if(!action)
     { 
      return null;
     }
    record.typeInfo = type;
    record.action = action;
    return record;
  }
 
 // make for js error data
   convertJserrordata(data,timestamp)
   {
     let record = new UserDataInformation(timestamp - this.sessionStartTime ,'' ,'',''); 
     //record.duration = '';
     record.typeInfo= "JS Error";
     let jstitle = data.errmessage  + "&#13;" +data.filename  + " (" +data.linenumber + "," + data.col +")&#13; "+ unescape(data.stacktrace);
     let action = "";
     action +=  "<b>Error : </b> <label title='"+jstitle+"'>" + data.errmessage + "  </label>";
     record.action = action;
     return record;
   }

  

getFileName(url)
{
if(url.substring(url.lastIndexOf('/')+1) == "")
 return this.getHostName(url);
else if(url.indexOf("?") > -1)
 return url.substring(url.lastIndexOf('/')+1, url.lastIndexOf("?"));
else
 return url.substring(url.lastIndexOf('/')+1);

}

getHostName(url)
{
  return url.replace(/^https?:\/\/([^\/]*)\/.*$/, "$1");
}
   

 
 convertAjaxData(data,timestamp)
 {
   let record = new UserDataInformation(timestamp - this.sessionStartTime ,'' ,'', '');
   record.duration = Util.formattedDuration(data.responsetime);
   let js = decodeURIComponent(data.data);
   let jsob = JSON.parse(js);
   let name = "";
   let domain = "";
   let url = "";
   try {
     url = jsob.url;
     record.url = url;
     let u = new URL(url);
     domain = u.host;
     name = (u.search!= ""?(u.pathname + "?" +  u.search): u.pathname);
   } catch(e) {
     domain = 'unknown';
     name = '/';
   }
   if(jsob.timings)
   {
    if(jsob.timings.header_received && jsob.timings.requestStart)
    {
     record.server = Util.formattedDuration(jsob.timings.header_received - jsob.timings.requestStart);
    } 
    if(jsob.timings.header_received && jsob.timings.done)
    { 
     record.network = Util.formattedDuration(jsob.timings.done - jsob.timings.header_received);
    } 
    else if(jsob.timings.header_received && jsob.timings.loadEventEnd)
    {
     record.network = Util.formattedDuration(jsob.timings.loadEventEnd - jsob.timings.header_received);
    }
   }
   record.typeInfo = "XHR";
   let action = "";
    record.flowpathInstance = data.flowpathinstance;
    action += "<b>Ajax Call with URL </b><label style='color:blue;' title=" + url + " > http://"+ domain + "/" + name + "</label><b>Status Code</b> <label style='color:blue;'>" + data.statuscode + "</label>";
   record.action = action;
   return record;
 }
}









