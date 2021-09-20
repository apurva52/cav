//import {AppComponent} from "./../app.component";
import * as moment from 'moment';
import 'moment-timezone';
export class HttpRequest {
  /*
    "resourcename":"www.kohls.com/checkout/v2/json/checkout_data_json.jsp",
      "domainname":"www.kohls.com",
      "statuscode":200,
      "method":"POST",
      "bytestransferred":4693,
      "responsetime":675,
      "data":"%7B%22statusText%22%3A%22%22%2C%22query%22%3A%22%3F_DARGS%3D%2Fcheckout%2Fv2%2Fincludes%2Fshipping_change_forms.jsp.partial_address_form%22%2C%22timings%22%3A%7B%22opened%22%3A113758216132%2C%22requestStart%22%3A113758216132%2C%22header_received%22%3A113758216807%2C%22loading%22%3A113758216807%2C%22done%22%3A113758216807%2C%22loadEventEnd%22%3A113758216807%7D%7D",
      "exceptioncount":0,
      "timestamp":113758216,
      "flowpathinstance":"-1"
   }
   */
  
  name:string;
  domainName:string;
  statusCode:number;
  method:string;
  size:string;
  responseTime:number;
  timestamp:number;
  formatedtimestamp : any;
  formattimestamp :any;
  flowPathInstance:string;
  data:any;
  exceptionCount:number;
  timings:any;
  postData:string;
  headers:string;
  response:string;
  url:string;
  query:any;
  tooltip :any;
  resourceid : any;
  pageinstance : number;
  pageid :number;
  sid : any;
  correlationid : any;
  title: any;
  initiator:any;
 
  constructor(dbRecord)
  {
    this.resourceid = dbRecord.domainname; // taken wrong in db
    //this.domainName = dbRecord.domainname;
    this.data = JSON.parse(decodeURIComponent(dbRecord.data));
    if(this.data.query == "null")
      this.data.query = "";
    this.size = this.getKB(dbRecord.bytestransferred);
    this.responseTime = ((dbRecord.responsetime)/1000);
    this.flowPathInstance = dbRecord.flowpathinstance;
    this.method = dbRecord.method;
    this.statusCode = dbRecord.statuscode;
    this.statusCodeTitle(dbRecord.statuscode);
    let CavEpoch = 0;//AppComponent.config.cavEpochDiff;
    //let d =  ((this.timestamp + CavEpoch)*1000); 
    //let time= new Date(d);
    //let httpdatestamp = (window["toDateString"](time) + ' ' + time.toLocaleTimeString().split(' ')[0]); 
    //this.formatedtimestamp = d;
    //console.log('d formatedtimestamp ',dbRecord.timestamp ,' : ',this.timestamp);
    //this.timestamp = new Date (moment.utc((parseInt(""+dbRecord.timestamp)+CavEpoch)*1000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf();
    this.timestamp = ((parseInt(""+dbRecord.timestamp)+CavEpoch)*1000);
    this.formattimestamp =  moment.utc((parseInt(""+dbRecord.timestamp)+CavEpoch)*1000).tz(sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
    this.formatedtimestamp = (parseInt(""+dbRecord.timestamp)+CavEpoch)*1000;
    this.exceptionCount = dbRecord.exceptioncount;
    this.pageinstance = dbRecord.pageinstance;
    this.pageid = dbRecord.pageid;
    this.sid = dbRecord.sid;
    this.timings = this.getTiming(this.data.timings);
    this.tooltip = this.getTooltipTiming(this.data.timings); 
    this.correlationid = dbRecord.correlationid;
    try{
      if(this.data.postData != undefined)
        this.postData = JSON.stringify(JSON.parse(this.data.postData), null, 2);
      else
         this.postData = JSON.stringify(this.data.postData, null, 2);
    }catch(e){
      if(this.data.postData != undefined)
        this.postData = this.data.postData;
    }
    
    this.headers = JSON.stringify(this.data.headers, null, 2);
   
    if(this.data.responseText != undefined) 
      this.response = this.data.responseText;

    this.url = this.data.url;
    this.query = this.data.query;
    if(this.query !== undefined && this.query !== "")
    {
        this.query = this.query.split('&'); 
        if(this.query[0].indexOf("?") == 0)
         this.query[0] = this.query[0].substr(1);
    }
    try {
         let url = this.data.url;
         let u = new URL(url);
         this.domainName = u.host;
         //this.name = (u.search!= ""?(u.pathname + "?" +  u.search): u.pathname);
         this.name = url.substr(url.lastIndexOf("/")+1, url.length);
         if(this.name == "")
           this.name = (u.search!= ""?(u.pathname + "?" +  u.search): u.pathname);
       } catch(e) {
         // this.domainName = 'unknown';
         // this.name = '/';
         this.name = dbRecord.resourcename;
         this.domainName = dbRecord.domainname;
       }
       // default value
       this.initiator = "xhr";
       try{
        this.initiator = this.data.initiator;
       }catch(e){
         this.initiator = "xhr";
       }
  }
  
  getKB(size)
  {
    if(size < 0 )
      return "-";
    return (size>1000) ? ((size/1000) +"KB") : (size + "B");
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
  getTooltipTiming(t)
  {
     if(t == null)
       return null;
     let tArr = Object.keys(t).map(key => t[key]).sort();
     tArr = tArr.sort();
     let c = {};
     c["requestStart"] = "0ms";
     c["loading"] = this.ttgetduration((tArr[2] - tArr[1]));
     c["header_received"] = this.ttgetduration((tArr[3] - tArr[1]));
     c["loadEventEnd"] = this.ttgetduration((tArr[4] - tArr[1]));
     c["done"] =  this.ttgetduration((tArr[5] - tArr[1]));
     return c;
  }

  convertIntoTime(ms)
  {
    if((parseInt(ms)/1000) > 0)
    {
      if(parseInt((ms/1000).toString().split(".")[0]) > 10)
      {
        return "00:"+(ms/1000).toFixed(2);
      }
      else
      {
        return "00:0"+(ms/1000).toFixed(2);
      }
    }
    else if(ms == 0)
      return "00:00.00";
    else
      return "00.00:"+(ms).toFixed(2);
  }

   ttgetduration(value)
  {
    let v = parseInt(value);
    let val ="";
    //console.log("ttgetduration : " , value);
    if(v > 1000)
      val = (v/1000).toFixed(2) + "s";
    else
      val = parseInt(val) + "ms";
   
    return val;
  
  }

  statusCodeTitle(statusCode)  {
	let s = Math.trunc(statusCode/100);
	//let status = parseInt(s);
	if(statusCode == -101)
	  this.title = statusCode + "(Timeout)";
	else if(statusCode == -102)
	  this.title = statusCode + "(XHR Error)";
	else if(statusCode == -103)
	  this.title = statusCode + "(Abort)";
	else if(statusCode == -104)
	  this.title = statusCode + "(Internal Error)";
	else if(s == 2)
	  this.title = statusCode + "(Success)";
	else if(s == 3)
	  this.title = statusCode + "(Redirection)";
  	else if(s == 4)
	  this.title = statusCode + "(Client Error)";
	else if(s == 5)
	  this.title = statusCode + "(Server Error)";
	else
	  this.title = statusCode;
	//console.log("@ statusCode " , s);
	//console.log("@ this.title " , this.title);
  }
}
