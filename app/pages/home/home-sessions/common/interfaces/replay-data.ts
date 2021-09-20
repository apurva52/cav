import { PageInformation } from './pageinformation';
import { UserActionData } from './user-action-data';
import { ReplayHandler } from './../../play-sessions/replay-handler';
import { ReplaySettings } from './../../play-sessions/service/replaysettings';
import { HttpRequest } from './httprequest';
import { JSError } from './jserror';
import { DataManager } from '../datamanager/datamanager';
import { Session } from './session';
import { DataRequestParams } from '../datamanager/datarequestparams';
import { ReplayService } from './../../play-sessions/service/replay.service';
import { SessionData } from '../datamanager/sessiondata';
import { NvhttpService, NVPreLoadedState } from './../service/nvhttp.service';
import {ReplayUtil} from './../util/replay-utils';
import { Store } from 'src/app/core/store/store';
//import { AppComponent } from '../../app.component';


class replayActionData{
 [key:number] : uaData;
}
class snapshotInfo{
  [key:number] : rsnapinfo;
}
class uaData{
  id : string;
  data : rdata[];
  cloned_data : rdata[];
  jsonDataCollected : boolean;
  nonSilentUACount : number;
  pageLoadTime : number;
  navigationStartTime : number;
  lastUserActionTime :number;
  snapshotInfo : snapshotInfo;
  lastSnapShotIdx : number;
  
  constructor(){
    this.id = "";
    this.data =[];
    this.cloned_data = [];
    this.jsonDataCollected = false;
    this.nonSilentUACount =0;
    this.pageLoadTime =0;
    this.navigationStartTime =0;
    this.lastUserActionTime = 0;
    this.snapshotInfo = {};
    this.lastSnapShotIdx = 0;
  }
}
class UAhttpReq{
  ajaxdata : boolean;
  ajaxExceptionCount : number;
  ajaxStatusCode : number;
  ajaxFPID :String;
  name : String;
  constructor(flag:boolean,exceptionCount:number,statusCode:number,flowPathInstance:string,name:string){
    this.ajaxdata  = flag;
    this.ajaxExceptionCount = exceptionCount;
    this.ajaxStatusCode  =statusCode;
    this.ajaxFPID  = flowPathInstance
    this.name = name;
  }
}

class UAJSError{
  linenumber : string;
  col : string;
  errmessage : string;
  filename : string;
  errorid : number;
  stacktrace : string;
   constructor(linenumber: string, col : string, errmessage :string, filename:string,errorid:number,stacktrace:string){
    this.linenumber=linenumber;
    this.col= col;
    this.errmessage = errmessage;
    this.filename = filename;
    this.errorid = errorid;
    this.stacktrace = stacktrace;
   }
}

interface rdata{
  timestamp : number;
  origtimestamp : number; 
  type : string;
  value : rvalue;
  isSilent : boolean;
  id: string;
  ajaxCalls : UAhttpReq[];
  jsErrors : UAJSError[];
}
interface rvalue{
 pageid: number;
 pageinstance: number;
 elementid: string;
 idtype: number;
 pagename: string;
 elementtype: string;
 elementsubtype: string;
 value:  string;
 timestamp: number;
 eventtype: number;
 encValue: number;
 prevValue: string;
 xpos: number;
 ypos: number;
 snapshotid :number;
 prevsnapshotid :any;
 height: number;
 width: number;
 iframeid : string;
}
class rsnapinfo{
 idx : number;
 uaStartIdx : number ;
 uaEndIdx : number;
 prevSnapIdx :number;
 nextSnapIdx :number;
 snapshotPath : string;
 nonSilentUACount :number;
 totalUA :number; 
 constructor(){
  this.idx = -1;
  this.uaStartIdx = 0;
  this.uaEndIdx =0;
  this.prevSnapIdx =-1;
  this.nextSnapIdx =-1;
  this.snapshotPath = null;
  this.nonSilentUACount = 0;
  this.totalUA = 0;
 }
}

interface entryObj {
  id : number ;
  sid : string;
  pages : PageInformation[];
  index : number;
  session : Session;
  pageinstance : number;
  sessionData : SessionData;
}

//DB UserAction Code.
const DBUA_FOCUS : number = 0;
const DBUA_BLUR : number = 1;
const DBUA_CLICK : number = 2;
const DBUA_CHANGE : number = 3;
const DBUA_MM : number = 6;

const DBUA_LOAD : number = 1000;
const DBUA_UNLOAD : number = 1001;
const DBUA_RESIZE : number = 1002;
const DBUA_SCROLL : number = 1003;
const DBUA_OCHANGE : number = 1004;
const DBUA_TOUCHEND : number = 1005;
//Other events.
const DBUA_ENCRYPTION : number = -7;
const DBUA_RESOURCE_TIMING : number = -6;
const DBUA_INTERNAL_TIMING_DATA : number = -5
const DBUA_LONGPRESS : number = 13;
const DBUA_ONFLING : number = 14;
const DBUA_ANDSCROLL : number = 7;
const DBUA_AUTOFILL : number = 30;

export class ReplayData {
 
  session : Session;
  userActionData : replayActionData;
  pages : PageInformation[];
  totalRecords : number;
  protocolversion : number;
  totalUserAction :number = 0; 
  entryID : number ;
  prevoffset :any="0_0";
  newoffset :any="0_0";
  nvhttp: NvhttpService;
  rh : ReplayHandler;
  ajax_req_in_progress : boolean = false;
  
  constructor(session: Session, pages:PageInformation[], totalRecords: number, protocolversion : number, entryID : number, rh:ReplayHandler)
  {
     this.session = session;
     this.userActionData = new replayActionData();
     this.pages = pages; 
     this.totalRecords = Number(totalRecords);
     this.protocolversion = protocolversion;
     this.entryID = entryID;
     this.nvhttp = rh.httpService; 
     this.rh = rh;
    //console.log("this.userActionData in constructor : ", JSON.stringify(this.userActionData));
  }

  // just fill the pageinstances
  initUserActionData(){
   for(let i=0; i < this.pages.length; i++)
   {
     let page = this.pages[i];
     this.userActionData[page.pageInstance] = new uaData(); 
     this.userActionData[page.pageInstance].id = page.pageInstance +"_"; 
     this.userActionData[page.pageInstance].snapshotInfo = new snapshotInfo();
     this.userActionData[page.pageInstance].snapshotInfo[0] = new rsnapinfo();
     this.userActionData[page.pageInstance].pageLoadTime = ((page.timeToLoad *1000 ) + (page.navigationStartTimeStamp*1000));
     this.userActionData[page.pageInstance].navigationStartTime = page.navigationStartTimeStamp*1000;
   } 
  } 
  
  fillUserActionData(dbData:any, type:string, index:number,prev_dbData:any, flag:string)
  {
    let data = null;
    
    let totalNonSiletUserAction =0;
    if(type == "db")
    {
        
        data = dbData.split('|');       
        //data[9] is the useraction type  - scroll, click
        if(!this.supportedDBUA(data[9])) 
          return;
       try{
        if(data[9] == DBUA_MM && flag != "recursive"){
             if(data[6].includes(";")){
              let mvalue = "";
              let pre_dbdata = "";
              let post_dbdata =  "";
              let new_dbdata = "";
              let new_timestamp = 0;
              let main_timestamp = 0;
              let t =0;
              let epoch = 0;//AppComponent.config.cavEpochDiff;
               var len = data[6].split(";").length;
               for(var q=0;q<len; q=q+2)
               {
                  // splitting by value i.e. data[6] and adding a new value
                  mvalue = data[6].split(";")[q+1]; //+ "," +data[6].split(";")[q+1];
                  if(q == 0)
                    main_timestamp = Number(data[6].split(";")[q]); 
                  pre_dbdata = dbData.split(dbData.split("|")[6])[0];
                  post_dbdata =  dbData.split(dbData.split("|")[6])[1];
                  new_dbdata = pre_dbdata + mvalue + post_dbdata;
                  // after saving the data , save the new timestamp
                  // splitting by value i.e. data[8] and adding a new timestamp
                  if(q>0)
                    t += Number(data[6].split(";")[q])/1000;
                  pre_dbdata = new_dbdata.split(new_dbdata.split("|")[8])[0];
                  post_dbdata =  new_dbdata.split(new_dbdata.split("|")[8])[1];
                  new_timestamp = (((main_timestamp/1000) - epoch) + t)*1000;
                  new_dbdata = pre_dbdata + new_timestamp + post_dbdata;

                  /*just to set it is recursive calling */
                  this.fillUserActionData(new_dbdata, "db", index,prev_dbData,"recursive");
                  //return;
               }
             }
        }
      }catch(e){
        console.log("Exception in fillUserActionData : ", e.message);
      }
        if(data[9] == DBUA_ENCRYPTION)
        {
          //encryptValue(data);
          //continue;
        }
        let uaObj : rvalue = {
        pageid: data[0],
        pageinstance: data[1],
        elementid: unescape(data[2]),
        idtype: data[3],
        pagename: data[7],
        elementtype: data[4],
        elementsubtype: data[5],
        //FIXME: value should be at last.
        value:  (data[6] == "null")?"":data[6],
        timestamp: data[8],
        eventtype: data[9],
        encValue: (data[10] == "null")?"":data[10],
        //Note: prevValue will be filled whild doing forward replay. 
        prevValue: "",
        xpos: data[11],
        ypos: data[12],
        snapshotid :data[10],
        prevsnapshotid :"",
        height: data[13],
        width: data[14],
        iframeid : (data[15] == "null")?"":data[15]
       }
       let dataObj : rdata= {
                timestamp : Number(uaObj.timestamp),
                origtimestamp: Number(uaObj.timestamp),
                type : "db",
                value : uaObj,
                isSilent: false,
                id: null,
                ajaxCalls : [],
                jsErrors : []
               };

    dataObj.id = uaObj.pageinstance + "_" +  this.totalUserAction;
    this.totalUserAction++;
    // we pick useraction for each page instance, but that page instance may not be actually present. so just filtering it out. 
     if(this.userActionData[uaObj.pageinstance] == undefined){
        this.userActionData[uaObj.pageinstance] = new uaData();
     }
    if(!this.isSiletDBUA(uaObj.eventtype))
    {
      this.userActionData[uaObj.pageinstance].nonSilentUACount ++;
      totalNonSiletUserAction++;
    }
    else
      dataObj.isSilent = true;

    this.userActionData[uaObj.pageinstance].data.push(dataObj);
    this.userActionData[uaObj.pageinstance].cloned_data.push(dataObj);
    //check for lastUserActionTime.
    if(this.userActionData[uaObj.pageinstance].lastUserActionTime < dataObj.timestamp)
      this.userActionData[uaObj.pageinstance].lastUserActionTime = dataObj.timestamp;
    
    }
    else
    {
      /* let dataArray;
      //Check if array then set that as dataArray.
      //Note: right now just checking for length attribute. 
      if(dbData.hasOwnProperty("length"))
        dataArray = dbData;
      else
        dataArray = [dbData];

      for(var y = 0; y < dataArray.length; y++)
      {
      //filter unexpected records if enabled.
      if(ReplaySettings.replayUnexpectedMutation == true)
      {
        if(dataArray[y].m.state == UNEXPECTED_MUTATION)
          continue;
      }
      let isSiletv=true;
      //Check if useraction is snapshot change then it will not be silent. 
      if(dataArray[y].s != undefined)
        isSiletv = false;

     }*/
       if(dbData.hasOwnProperty("o") == true)
       {
         
          dbData["timestamp"]= prev_dbData["t"]+1;
          dbData["origtimestamp"]= prev_dbData["t"]+1;
          console.log('insidenewcondition replay-data',dbData,'timestapmp=',dbData["timestamp"]); 

          this.prevoffset =this.newoffset;
          this.newoffset =index+"_"+dbData.o;
          dbData["prevoffset"]= this.prevoffset;
          dbData["newoffset"] = this.newoffset;

          this.userActionData[index].data.push(dbData);
          console.log('insidenewcondition replay-data',this.userActionData);
          return;
       }
        //console.log(" handled for json");
        let dataObj : rdata = {
          timestamp: Number(dbData.t),
          origtimestamp: Number(dbData.t),
          type: "json",
          value: dbData,
          isSilent: true,
          id: null,
          ajaxCalls : [],
          jsErrors : []
        };
        if(dbData.s != undefined)
          dataObj.isSilent = false;
        dataObj.id = index + "_" + this.totalUserAction;
        this.totalUserAction ++;
        if(this.userActionData[index] == undefined){
          this.userActionData[index] = new uaData();
        }
        this.userActionData[index].data.push(dataObj);
        this.userActionData[index].cloned_data.push(dataObj);
        if(this.userActionData[index].lastUserActionTime < dataObj.timestamp)
          this.userActionData[index].lastUserActionTime = dataObj.timestamp;
          this.userActionData[index].jsonDataCollected = true;
    }
     
  }
  fillRequestData()
  {
    //console.log("fillRequestData called");
    for(let i=0; i < this.pages.length; i++){
      this.fillAjaxData(this.session, this.pages[i].pageInstance);
      this.fillJSErrorData(this.session, this.pages[i].pageInstance);
    } 
  }
  supportedDBUA(type){
    return (type == DBUA_CLICK ||
     type == DBUA_CHANGE ||
     type == DBUA_SCROLL ||
     type == DBUA_ENCRYPTION ||
     type == DBUA_LONGPRESS ||
     type == DBUA_ONFLING ||
     type == DBUA_ANDSCROLL ||
     type == DBUA_AUTOFILL ||
     type == DBUA_MM);
  }
  isSiletDBUA(type)
  {
    //TODO: check what else can be added.
    //if(ReplaySettings.replayAutoFillSilently)
      //return (type == DBUA_ATTRIB_CHANGE || type == DBUA_SCROLL || type == DBUA_AUTOFILL);
    //else
      return (type == DBUA_SCROLL || type == DBUA_MM);
  }
  //Note: this method can be called to sort complete useraction table.
//Or we can provide offset to sort already sorted table.
sortUserActionDataOnTimestamp(offset:number)
{
  //Note: this is the original last useraction time.
  let prevPageLastUserActionTime : number= -1;
  let pageNavDiff : number = -1, loadTime : number;
  let pageInstance : number, prevPageInstance : number= -1;
  let count : number ;
  
  //FIXME: 
  if(offset > 0)
  {
    prevPageInstance = this.pages[offset - 1].pageInstance;
    count = this.userActionData[prevPageInstance].data.length;
    if(count > 0)
    {
      prevPageLastUserActionTime = this.userActionData[prevPageInstance].data[count - 1].timestamp;
    }
    else 
      prevPageLastUserActionTime = this.userActionData[prevPageInstance].pageLoadTime;
  }
  let totalPages = this.totalRecords;
  for(let ana = 0; ana < totalPages; ana++) 
  {
    if(offset > ana)
      continue;
    if(ana > 0)
      prevPageInstance = this.pages[ana - 1].pageInstance;
  
    pageInstance = this.pages[ana].pageInstance;
  
    //update navigationstart time and pageload time.
    loadTime = this.userActionData[pageInstance].pageLoadTime - this.userActionData[pageInstance].navigationStartTime;
    //need not to change anything for first page.
    let diff : number =0;
    if(ana > 0){
      diff = this.userActionData[pageInstance].navigationStartTime - prevPageLastUserActionTime;
      //check atleast this much of differene should be in navigation start time.
      if(diff < 0)
        diff = 0;

      this.userActionData[pageInstance].navigationStartTime = this.userActionData[prevPageInstance].lastUserActionTime + diff;
      this.userActionData[pageInstance].pageLoadTime = this.userActionData[pageInstance].navigationStartTime + loadTime;
    }
    //update prevPageLastUserActionTime.
    count = this.userActionData[pageInstance].data.length;
    if(count > 0)
      prevPageLastUserActionTime = this.userActionData[pageInstance].data[count - 1].timestamp;
    else 
      prevPageLastUserActionTime = this.userActionData[pageInstance].pageLoadTime;
  
  
    let uaData = this.userActionData[pageInstance];
    //check if alreay processed.
    uaData.data = uaData.data.sort(function(A, B) {
      return(Number(A.origtimestamp)- Number(B.origtimestamp)); 
    });

    uaData.lastUserActionTime = uaData.pageLoadTime;
    //update timestamp.
    //will keep track for previous useraction actual timestamp.
    //This will adjust all the timings from pageLoadTime.
    let prevOrigTimestamp;
    for(let z = 0; z < uaData.data.length; z++)
    {
      if(z == 0) {
        prevOrigTimestamp = uaData.data[z].origtimestamp;
        if(uaData.data[z].timestamp < uaData.pageLoadTime)
        {
          prevOrigTimestamp = uaData.data[z].origtimestamp;
          uaData.data[z].timestamp = uaData.pageLoadTime;
        }
      }
      else {
        //just take diff from previous value.
        diff = uaData.data[z].origtimestamp - prevOrigTimestamp;
        prevOrigTimestamp = uaData.data[z].origtimestamp;
        uaData.data[z].timestamp = uaData.data[z - 1].timestamp + diff;
      }
      //update lastUserActionTime.
     
      if(uaData.lastUserActionTime < uaData.data[z].timestamp)
        uaData.lastUserActionTime = uaData.data[z].timestamp;
    }

    if(this.userActionData[pageInstance].jsonDataCollected)
      this.fillSnapshotInfo(this.userActionData[pageInstance]);
  }
 }
 fillSnapshotInfo(uaData : uaData)
 {
   // reset old snapshotInfo
   /*
   uaData.snapshotInfo = {};
   uaData.snapshotInfo[0] =  new rsnapinfo();
   uaData.snapshotInfo[0].idx = -1;
   uaData.lastSnapShotIdx = 0;
   */

  let curSnapshotIdx = 0;
  let prevSnapshotIdx = -1;
  
  let d;
  for(let z = 0; z < uaData.data.length; z++)
  {

   // if we are having offset in data
   // consider this as last action of the page
   // handling of offset in useractionrecord
   if(uaData.data[z].hasOwnProperty("o"))
   {
     console.log("fillSnapshotInfo , handling offset ", JSON.stringify(uaData.data[z]));
     uaData.snapshotInfo[curSnapshotIdx].uaEndIdx = z; 
     uaData.snapshotInfo[curSnapshotIdx].totalUA ++;
     // this should be last record
     continue;
   }

    
    //Check if snapshot changed.
    if(uaData.data[z].type != "Unload")
    {  
      
      d = uaData.data[z].value;
      if (!d) 
        continue;
      if(this.protocolversion != 1)
        d.s = Number(d.snapshotid);
      if(d.s != undefined && !isNaN(d.s) && d.s > 0)
      {
        //set endIndex in prev one.
        if(z != 0)
          uaData.snapshotInfo[curSnapshotIdx].uaEndIdx = z - 1;

        //add a new one only if curSnapshotIdx has changed.
        if(d.s != curSnapshotIdx && !uaData.snapshotInfo[d.s]) 
        {
          uaData.snapshotInfo[curSnapshotIdx].nextSnapIdx = d.s;
          prevSnapshotIdx = curSnapshotIdx;
          curSnapshotIdx = d.s;
          uaData.snapshotInfo[curSnapshotIdx] = new rsnapinfo();
          uaData.snapshotInfo[curSnapshotIdx].idx = z;
          //set the prevSnapshotIdx.
          uaData.snapshotInfo[curSnapshotIdx].prevSnapIdx = prevSnapshotIdx;
          uaData.lastSnapShotIdx = curSnapshotIdx;
        }
        continue;
      }
    }

    //Update snapshot.
    //Check if uaStartIdx is -1 then set.
    if(uaData.snapshotInfo[curSnapshotIdx].uaStartIdx == -1)
      uaData.snapshotInfo[curSnapshotIdx].uaStartIdx = z;
    //Note: this will keep updating as records will come 
    uaData.snapshotInfo[curSnapshotIdx].uaEndIdx = z; 
    uaData.snapshotInfo[curSnapshotIdx].totalUA ++;
    //Check if non silent then increase nonSilentUACount
    if(uaData.data[z].isSilent == false)
      uaData.snapshotInfo[curSnapshotIdx].nonSilentUACount++;
  }

 }
 
  initRS(){
    //console.log("initRS called for RC");
    //console.log("Default REPLAY SETTINGS : ", JSON.stringify(ReplaySettings));
    // disabling the auto replay mode, if was set.. 
    try{
       ReplaySettings.replayMode = 0;
    }catch(e){
        console.log("Exception in init RS : ", e);
    }
   let rc = localStorage.getItem("ReplaySettings");
   if(rc == null ) return;
   let r = JSON.parse(rc);
   for(let i =0; i < Object.keys(r).length; i++){
       let key = Object.keys(r)[i];
       ReplaySettings[key] = r[key];
   }
   ReplaySettings.replayMode = 0;
   //  set replay mode and speed related configuration as default value. Do not want to save this for next session
   ReplaySettings.autoSpeedType = 1;
   ReplaySettings.autoSpeedValue = 1000;
   //console.log("After REPLAY SETTINGS : ", JSON.stringify(ReplaySettings));
 }

 fillAjaxData(session,pageinstance)
 {
    if(this.ajax_req_in_progress == true) return;
    let page =null;
    // if session was already stored in replayArray, we can get information from entry.sessionData
    let entry : entryObj = ReplayService.idToEntity(this.entryID);
    try{
       if(entry != null && entry.sessionData != null)
       // when hitting a new replay session, we wont get this
       page = entry.sessionData.pageDetails.get(pageinstance);
    }catch(e){console.log("Exception in getting details from entry sessiondata : ",e);}
    // if not present in entry , then find in DataManager
    if(page == null || page == undefined)
      page = DataManager.sessionData.get(session.sid).pageDetails.get(pageinstance);
    // if data is not present in both  datamanger and entry, then request again
    if(page == null || (page != null && page.httpRequests == null))
    {
      // no use of requesting here, and if doing, apply a loader for user to wait
      // to handle above, we will call this method again
      //console.log("ANJALI : Ajax Request not loaded for sid : ", session.sid  ," and page instance :  ", pageinstance, ". Requested again");
      // check if data is not present for that page instance, request the data and populate
      //let request = new DataRequestParams(session.sid, pageinstance, DataManager.HTTP_REQUESTS, session.startTime,session.endTime);
      // calling for all pages at once
      this.ajax_req_in_progress = true;
      this.nvhttp.getHttpRequests(session.sid,-1,"-1")
      //.subscribe((response : any) => { 
        .subscribe(
          (state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;
             this.ajax_req_in_progress = false; 
             this.processHttpData(response);
        }
      });
      return;
    }
    //if(page == null || (page != null && page.httpRequests == null)) return;
    //when hitting a new replay session, we will save this data
    // only set , when not present in entry
    if(entry && (entry.sessionData == null || entry.sessionData == undefined))
      entry.sessionData = DataManager.sessionData.get(session.sid);

    
    let  ajaxCallArray: HttpRequest[] = page.httpRequests["entries"]; 
    //console.log("ajaxCallArray.length- "+ ajaxCallArray.length);
    if(ajaxCallArray.length == 0) return ;
    this.processAjaxDataInUA(ajaxCallArray,pageinstance,"fillAjaxData");
    
 }

 processAjaxDataInUA(ajaxCallArray,pageinstance,caller){
  if(this.userActionData.hasOwnProperty(pageinstance))
  {
     var d = this.userActionData[pageinstance].data;
     for(var j =0; j< d.length; j++)
     {  
        var plus = 0;
        if(d[j].type == "db") 
        {
           // now check for timestamps
           for( var r=0; r < ajaxCallArray.length ; r++)
           {
              //console.log("r--> " +r );        
              var t = 0;
              if(ajaxCallArray[r].data.hasOwnProperty("timings")){
                //console.log("initializing t as : ",ajaxCallArray[r].data.timings.requestStart);
                t = Number(ajaxCallArray[r].data.timings.requestStart);
                //console.log(" t initialized as : ",t);
              }
              plus = j+1;
             if((plus+1) < d.length && d[plus].type != "db" ) 
               plus += 1;
             //console.log("t--> " + t + " j ---> "+ j + "d[j].origtimestamp  ---> " + d[j].origtimestamp + " plus --> " +plus + "d.length -- " + d.length);
             //console.log("diffffff--> " + (t - Number(d[j].origtimestamp) ));
             if(t >= Number(d[j].origtimestamp) && t - Number(d[j].origtimestamp) <= 100 && plus < d.length && Number(d[plus].origtimestamp) > t)
             {
               //console.log("to next --> " + (parseFloat(d[plus].origtimestamp) - t));
               //console.log("Ajax request filled for pageinatnce : ", pageinstance, " at " , j, " index");
               let ajaxobj = new UAhttpReq(true,ajaxCallArray[r].exceptionCount,ajaxCallArray[r].statusCode, ajaxCallArray[r].flowPathInstance,ajaxCallArray[r].name);
               d[j].ajaxCalls.push(ajaxobj);
             }
             else
              continue;
           }
        }
        else
          continue;
     }
  } 
 }
 fillJSErrorData(session : Session, pageInstance: number)
 {
    let page =null;
    // if session was already stored in replayArray, we can get information from entry.sessionData
    let entry : entryObj = ReplayService.idToEntity(this.entryID);
    try{
       if(entry != null && entry.sessionData != null)
       // when hitting a new replay session, we wont get this
       page = entry.sessionData.pageDetails.get(pageInstance);
    }catch(e){console.log("Exception in getting details from entry sessiondata : ",e);}
    // if not present in entry , then find in DataManager
    if(page == null || page == undefined)
     page = DataManager.sessionData.get(session.sid).pageDetails.get(pageInstance);
    
    if(page == null || (page != null && page.jsErrors == null)){
      /*let request = new DataRequestParams(session.sid, pageInstance, DataManager.JS_ERRORS, session.startTime,session.endTime);
      let ref = {"session":session};
      DataManager.handleRequest(request,ref);*/
      //page = DataManager.sessionData.get(session.sid).pageDetails.get(pageInstance);
      //console.log("JSError  not loaded for sid : ", session.sid  ," and page instance :  ", pageInstance);
    }
    if(page == null || (page != null && page.jsErrors == null)) return;
    let jserrors = page.jsErrors;
    if(jserrors && jserrors.length  != 0)
    {      
      
    if(this.userActionData.hasOwnProperty(pageInstance))
    {
       var d = this.userActionData[pageInstance].data;
       for(var j =0; j< d.length; j++)
       {  
          var plus = 0;
          if(d[j].type == "db") 
          {
             // now check for timestamps
             for( var r=0; r <jserrors.length ; r++)
             {
                //console.log("r--> " +r );         
                // step 1 : take timestamp from jserroerrorr
		            var t = jserrors[r].timestamp;
		            var c = Date.parse(t);
                // step 2 : convert this to ms  and minus the epoch value
		            var b=	((c/1000 -1388534400))*1000;
                //var b = 133170891736;
                // step 3 : then compare
               plus = j+1;
               if((plus+1) < d.length && d[plus].type != "db" ) 
                 plus += 1;
               //console.log("t--> " + t + " j ---> "+ j + "d[j].origtimestamp  ---> " + d[j].origtimestamp + " plus --> " +plus + "d.length -- " + d.length);
               //console.log("diffffff--> " + (t - Number(d[j].origtimestamp) ));
               if(b >= Number(d[j].origtimestamp) && plus < d.length && Number(d[plus].origtimestamp) > b)
               {
                 //console.log("to next --> " + (parseFloat(d[plus].origtimestamp) - t));
                 var jsobj = new UAJSError(jserrors[r].lineNumber,jserrors[r].col, jserrors[r].message,jserrors[r].file,jserrors[r].id,jserrors[r].stackTrace);
                 d[j].jsErrors.push(jsobj);
               }
               else
                continue;
             }
          }
          else
            continue;
       }
    }
  }
 }
  // fill data to datamanger
 processHttpData(data){
   let htarray ={};
   htarray["entries"]=[];
   data.forEach(record => {
    let httpRequest = new HttpRequest(record);
     htarray["entries"].push(httpRequest);
   });
   let  ajaxCallArray: HttpRequest[] = htarray["entries"]; 
    //console.log("ajaxCallArray.length- "+ ajaxCallArray.length);
    if(ajaxCallArray.length == 0) return ;
    for(var i=0; i < Object.keys(this.userActionData).length; i++){
      let pageinstance = Object.keys(this.userActionData)[i];
      this.processAjaxDataInUA(ajaxCallArray,pageinstance,"processHttpData");
    }
    //  we will only send message if we have not got this data for the first time, 
    // as on this message we will again fill data in page action  tab
     // this is a flag to indicate that http data is filled in useractiondata, will be handled in replay-data
    let obj = {"key" : "ajaxdatafilled", "data" : 'true'};
    this.rh.broadcast('msg',obj);
     
 }


 
}
