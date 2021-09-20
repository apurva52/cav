import * as moment from "moment";
import { ReplayUtil } from "../util/replay-utils";
import { PageInformation } from "./pageinformation";
import {Session} from "./session";

class accord_data {
    color : string;
    duration : string;// page offset
    uaOffset : string;
    iconTriangle : boolean;
    iconcursor : boolean;
    iconmenu : boolean;
    label : String;
    uadetail : UAdetails;
    details : tdd[];
    id : string;
    icon : string;
    iconTitle : string;
}
interface tdd{
  label : String,
  value : String,
  ajaxFPID ?: String;
  title ?:  string;
}
class UAdetails{
    action : string;
    actionTitle : string;
    id : string;
    value : String;
    shortValue : String;
    tagName : string;
    selector : string; 
    ajaxurl : string;
    ajaxFPID : string;
    errmsg : string;
   }
   
export class playsession{
    accordion : accord_data[];
    collapsed : boolean;
    duration : string;
    label : string;
    menuOption : boolean;
    id : string;
    navigationTitle : String;
    navigationClass : String;
    nonSiletUseractios: any;
    silentUseractions : any;
    events : any;
    pageinfo : PageInformation;
    constructor(uadata,pageinfo : PageInformation,cavEpochDiff,session : Session, firstpage : PageInformation){
        this.accordion = this.fillData(uadata,pageinfo,cavEpochDiff, session, firstpage);
        this.collapsed = false;
        this.duration = pageinfo.navigationStartTime;
        this.label = pageinfo.pageName.name;
        this.menuOption = true; // no use of this
        this.id = "";
        this.navigationTitle = pageinfo.navigationType['title'];
        this.nonSiletUseractios = uadata.nonSilentUACount;
        this.silentUseractions = uadata.data.length - uadata.nonSilentUACount;
        this.events = pageinfo.events;
        this.pageinfo = pageinfo;
    }
    
  fillData(uadata, page, cavEpochDiff, session,firstpage) : accord_data[]{
      let acc  = [];
       for(let j=0; j< uadata.data.length; j++)
       {
            let obj : accord_data  = new accord_data();
            obj.color = '#53b771';
            obj.iconTriangle = true;
            obj.iconcursor = true;
            obj.iconmenu = false;
            obj.uaOffset = "";
            obj.duration = "";
            obj.details = [];
            
         let uActionData = uadata.data[j];

         if(uActionData.hasOwnProperty("o"))
         continue;
         
         if(uActionData.type == "json" || uActionData.isSilent) 
           continue;
         let uAction = uActionData.value;
         let elevalue = ReplayUtil.checkEncryptDecrypt(uAction.pageinstance, uAction.value, uAction.encValue);
         let actionString = this.setActionString(uAction,elevalue);
         let a = this.setAction(actionString);
         let uadetail = new UAdetails();
         uadetail.actionTitle = a.ttl;
         obj.label  = this.shortTextContent(elevalue, null ,null); 

          let curroffset = 0.0;
          let timestamp = new Date(page.navigationStartTime).getTime();
          let recordTime = new Date(moment.utc(uActionData.timestamp + 1388534400000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD HH:mm:ss')).valueOf();
          curroffset = (recordTime - timestamp) / 1000;
          obj.uaOffset = ReplayUtil.toHHMMSS(curroffset+"");

          let pageoffset = (Number(page.navigationStartTimeStamp) - Number(firstpage.navigationStartTimeStamp)).toString();
          console.log("pageoffset : ", ReplayUtil.toHHMMSS(pageoffset));
          obj.duration = ReplayUtil.toHHMMSS(pageoffset);

         uadetail.action = a.iconsrc;
         
         obj.icon = uadetail.action;
         obj.iconTitle = uadetail.actionTitle;

         uadetail.id =  uActionData.id;
         obj.id = uActionData.id;
         uadetail.value = elevalue;
         uadetail.shortValue = this.shortTextContent(elevalue, null ,null); 
         uadetail.selector = uAction.elementid;
         if (uAction.elementsubtype != null && uAction.elementsubtype != 'null') {
           uadetail.tagName = uAction.elementtype + "(" + uAction.elementsubtype + ")";
         } else {
           uadetail.tagName = uAction.elementtype;
         }
         let t1 = {'label':'Tag' , 'value' : uadetail.tagName, 'ajaxFPID' : ''};
         obj.details.push(t1);
         t1 = {'label':'Selector' , 'value' : uadetail.selector, 'ajaxFPID' : ''};
         obj.details.push(t1);
         t1 = {'label':'Value' , 'value' : uadetail.value+'', 'ajaxFPID' : ''};
         obj.details.push(t1);
         uadetail.ajaxurl = '';
         uadetail.errmsg = '';
         if(uActionData.ajaxCalls.length > 0){
          uadetail.ajaxFPID = uActionData.ajaxCalls[0].ajaxFPID; 
          uadetail.ajaxurl = uActionData.ajaxCalls[0].name;
          t1 = {'label':'Ajax' , 'value' : uadetail.ajaxurl , 'ajaxFPID' : uadetail.ajaxFPID};
         obj.details.push(t1);
         }
         if(uActionData.jsErrors.length > 0){        
           uadetail.errmsg = uActionData.jsErrors[0].errmessage;
           t1 = {'label':'JSerror' , 'value' :  uadetail.errmsg, 'ajaxFPID' : ''};
           obj.details.push(t1);
         }
         obj.uadetail = uadetail;
         
         acc.push(obj);
       }       
    //}
    return acc;   
  }
  setActionString(uAction:any,elevalue:String)
  {
     // not showing the field if any of the element is null.
    let eletype1 = (uAction.elementtype == "null") ? "" : "ElementType:"+ uAction.elementtype ;
    let elesubtype1 =(uAction.elementsubtype == "null") ? "" : "ElementSubType:"+uAction.elementsubtype + "<br>" ;
    let elevalue1 =(uAction.value == "null") ? "" : "ElementValue:"+ elevalue + "<br>";
    let elesubtype2 =(uAction.elementsubtype == "null") ? "" : ""+uAction.elementsubtype ;

    let actionString = "";  
    if(uAction.eventtype == "3" )
    {
     if(uAction.elementtype.toLowerCase() == "input")
     {
       if(uAction.elementsubtype == "text")
         actionString = "Entered Text";
       else if(uAction.elementsubtype == "password")
         actionString = "Entered Password";
       else if(uAction.elementsubtype== "radio")
         actionString = "Selected Radio Button &nbsp;";
       else if(uAction.elementsubtype == "submit")
         actionString = "Clicked ";
       else 
        actionString = "Entered " + this.camelize(elesubtype2);
     }
     else if(uAction.elementtype.toLowerCase() == "textarea")
        actionString = "Entered Text";
     else if(uAction.elementtype.toLowerCase() == "select")
       actionString = "Selected Option";
     else 
       actionString = "Changed";
   }
   else if(uAction.eventtype == "30" )
   {
     if(uAction.elementtype.toLowerCase() == "input")
     {
       if(uAction.elementsubtype == "text")
         actionString = "Auto Entered Text";
       else if(uAction.elementsubtype == "password")
         actionString = "Auto Entered Password";
       else if(uAction.elementsubtype== "radio")
         actionString = "Auto Selected Radio Button &nbsp;";
       else if(uAction.elementsubtype == "submit")
         actionString = "Auto Submit ";
       else 
        actionString = "Auto Entered " + this.camelize(elesubtype2);
     }
     else if(uAction.elementtype.toLowerCase() == "textarea")
        actionString = "Auto Entered Text";
     else if(uAction.elementtype.toLowerCase() == "select")
       actionString = "Auto Selected Option";
     else 
       actionString = "Auto Changed";
   }
   else if(uAction.eventtype == "2")
   {
      let a = uAction.elementtype;
      if(uAction.elementtype.toLowerCase() == "img")
        a = "image";
      actionString = "Clicked "+  this.camelize(a) + "";
   }
   else if(uAction.eventtype == "-2")
    actionString = "Added " +  this.camelize(uAction.elementtype);
   else if(uAction.eventtype == "-3")
    actionString = "Hide " + this.camelize(uAction.elementtype);
   else if(uAction.eventtype == "-11" || uAction.eventtype == "-12" || uAction.eventtype == "-10")
    actionString = "Added " +  this.camelize(uAction.elementtype);
   else if(uAction.eventtype == "1003")
     actionString ="Scrolled at position:" +  uAction.xpos +","+ uAction.ypos;
   else if(uAction.eventtype == "13")
     actionString ="LongKeyPress" + uAction.value;
   else if(uAction.eventtype == "14")
     actionString ="FLING" + uAction.value;
   else if(uAction.eventtype == "7")
    actionString ="Scrolled at position:" + uAction.xpos +","+ uAction.ypos;
   else if(uAction.eventtype == "12")
    actionString ="DoubleTap" + uAction.value; 
   return actionString;
  }

  setAction(action)
  {
      let iconsrc : string= '';
      let ttl : string = action;
      let actionObj = {iconsrc : "",ttl :"" };
      if(action.indexOf('Auto') > -1)
      {
        iconsrc = 'pi pi-pencil rfill';
        ttl = action;
        //ttl = 'Auto Fill';
      }
      else if(action.indexOf('Entered') > -1)
      {
        iconsrc = 'icons8 icons8-natural-user-interface-2 renterd';
        //ttl = 'Eneterd';
        ttl = action;
      }
      else if(action.indexOf('Clicked') > -1)
      {
        iconsrc = 'las-mouse-pointer-solid rclicked';
        //ttl = 'Clicked';
        ttl = action;
      }
      else if(action.indexOf('Scrolled') > -1)
      {
        iconsrc = 'pi pi-ellipsis-v rscrolled';
        //ttl = 'Scrolled'
        ttl = action;
      }
      else if(action.indexOf('Selected') > -1)
      {
        iconsrc = 'pi pi-sort-amount-down rselected';
        //ttl = 'Selected';
        ttl = action;
      }
      else if(action.indexOf('Changed') > -1)
      {
         iconsrc = 'icons8 icons8-natural-user-interface-2 rchanged';
         //ttl = 'Changed';
         ttl = action;
      }
      else if(action.indexOf('Long') > -1)
      {
         iconsrc = 'pi pi-podcast rlongpressed';
         //ttl = 'LongPressed';
         ttl = action;
      }
      else if(action.indexOf('FLING') > -1)
      {
         iconsrc = 'pi pi-random rswipe';
         //ttl = 'Fling/Swipe';
         ttl = action;
      }
      else if(action.indexOf('DoubleTap') > -1)
      {
        iconsrc = 'icons8 icons8-email-send rdoubletap';
        //ttl = 'DoubleTap';
        ttl = action;
      }
      actionObj.iconsrc = iconsrc;
      actionObj.ttl = ttl;
      return actionObj;
  }
  //Note: max limit of text content is 50.
  //we will try to find the complete text within 50 chars.
  shortTextContent(text : String, lmt : number, action : string)
  {
    if (!lmt) lmt = 50;

    text = text.trim();
    // no limit check for text like 
    if(action != undefined && action == "hide" && text.indexOf('\n') > -1)
      return text.substr(0, text.indexOf('\n')+1) + "...";

    if(text.length <= lmt)
      return text;
    else if(action && action == "hide")
    {
      if(text.indexOf('\n') <= -1)
        return text.substr(0,lmt)+ "...";
      else
        return text.substr(0, text.indexOf('\n')+1) + "...";
    }  

    //split the content by \n, \t and space \r \b.
    let lastComplete = -1;
    for(let z = 0;  z < text.length; z++)  
    {
      if(text[z] == ' ' || text[z] == '\r' || text[z] == '\n' || text[z] == '\t' )
        lastComplete = z;
      if(z + 1 == 50)
        break;
    }
  
    if(lastComplete != -1)
      return text.substr(0, lastComplete + 1);
    else 
      return text.substr(0, 50);
  }
  camelize(str: String) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toUpperCase() : match.toLowerCase();
    });
  }
}
