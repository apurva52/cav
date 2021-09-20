import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageInformation } from './../../common/interfaces/pageinformation';
import { Session } from './../../common/interfaces/session';
import { DataRequestParams } from './../../common/datamanager/datarequestparams';
import { DataManager } from './../../common/datamanager/datamanager';
import { MetadataService } from './../../common/service/metadata.service';
import { ParseSessionFilters } from './../../common/interfaces/parsesessionfilters';
import { SessionData } from './../../common/datamanager/sessiondata';
import { Observable } from 'rxjs';
import { ReplayUtil } from './../../common/util/replay-utils';
import { NvhttpService, NVPreLoadedState } from '../../common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';


interface replayObj {
  id: number ;
  sid: string;
  pages: PageInformation[];
  index: number;
  session: Session;
  pageinstance: number;
  sessionData: any;
  isactive: boolean;
}

class userdata {
  [key: number]: uaData;
}
class uaData {
  pagedump_path: string;
  pagedump_data: any;
  /*
  * snapshots format : 
  * { snapshot_id : {path : {SnaprequestInProgress : false, response :""} , pagedump: {SnaprequestInProgress : false, response: ""}},
  *   snapshot_id : ......
  */
  snapshots: snapdata;
  // {"offset_value" : [data]}, {"0":[data],"10":[data],"23":[data]...}
  // if offset is not present , useractions : {"0": [data]}
  useractions: {};
  pendingUARequest: any[];
  UArequestInProgress = false;
  pendingSnapRequest : any[];

  constructor() {
    this.snapshots = new snapdata();
    this.useractions = null;
    this.pendingUARequest = [];
    this.UArequestInProgress = false;
    this.pendingSnapRequest = [];
  }
}

class snapdata{
 [key: number]: snapObj;
}

class snapObj{
  path : {};
  pagedump  : {};
  constructor(){
   this.path = {"SnaprequestInProgress": false, "response": ""};
   this.pagedump = {"SnaprequestInProgress": false, "response": ""};
 }
}

@Injectable({
  providedIn: 'root'
})

export class ReplayService {
  
  constructor(private router: Router,private route: ActivatedRoute,@Inject(NvhttpService) httpService, @Inject(MetadataService) metadataService) { 
    this.httpService = httpService;
    DataManager.httpService = this.httpService;
    this.metadataService  =  metadataService;
    this.metadata = null;
    // will have objects of replays 
    ReplayService.replayArray = [];
    this.userdatamap = new userdata();
    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      DataManager.metadata = this.metadata;
    }); 

  }

  static replayArray : replayObj[];
  httpService: NvhttpService;
  metadataService: MetadataService;
  metadata: any;
  parsesessionfilter: ParseSessionFilters;
  // for prefetch 
  useractiondata : any;
  currentPI: number;
  pendingUARequest: any[];
  UArequestInProgress: boolean = false;
  all_pages: any;
  currentSession : Session;
  currentpageindex: any;
  userdatamap : userdata;
  snapshotMap = new Map();

  //this method will take id as input
  // and will give the replayArray obj corresponding to that id
  static idToEntity(id : number) : replayObj
  {
    for(let i=0; i < ReplayService.replayArray.length; i++){
      let r = ReplayService.replayArray;
      if(id == r[i].id){
        return r[i];
      }
    }  
    return null;
  }
  // if replayArray has  this sid, open same replay session and return its id, 
  //else return -1,
  initNew(sid:string) : number{
    let id = -1;
    for(let i=0; i < ReplayService.replayArray.length; i++){
      let r = ReplayService.replayArray;
      if(sid == r[i].sid){
        return r[i].id;
      }
    }  
    return id;
  }

  // iterate the array , and return id + 1 of max id
  generateId() : number{
    if( ReplayService.replayArray.length == 0)
       return 0;
    let id = -1;
    let ids =[];
    for(let i=0; i < ReplayService.replayArray.length; i++){
      let r = ReplayService.replayArray;
       ids.push(r[i].id); 
    }
    let s = ids.sort();  
    let largestId = s[s.length -1]; 
    return (largestId + 1);
  }
    // whatever is null, make request and get data and fill it to replaysArray
    //return new entry id
    // sid, can not be null
    // index will only be null in case of page filter
    // handling pageinstance and page index, while requesting for pages
    // for other things, start requesting for data and open replay mean while
    // sessionData , this will be sessiondata object as  maintained by datamanager, 
    //this has the completed session data, with page list and other page details such as http request / js error 
    makeEntry(sid : string ,session : Session, pagelist : PageInformation [],index:number , pageinstance : number, isActive:boolean) : number{
      
      let newid = this.generateId();
      let obj : replayObj ={
        id : newid,
        index : index,
        isactive : isActive,
        sid : sid,
        pages : pagelist,
        session : session,
        pageinstance : pageinstance,
        sessionData : null
      }
      ReplayService.replayArray.push(obj);
      if(session == null){
          this.getSession(sid,newid, pagelist, isActive);
      }
      if(session != null && pagelist == null){
        this.getSessionPages(sid,session, newid, isActive);
      }
      // means start replay from first page of session
      if(index == null){
        index = 0;
      }
      return newid;
    }
    
    // keeping sid, as may be id is missing
    // other components will call this method to open replay 
    openReplay(sid : string ,session: Session, pagelist : PageInformation [],index:number, pageinstance : number, isActive : boolean)
    {
      if(isActive != true || isActive == null || isActive == undefined){
        isActive = false;
      }
      // if session is active session, dont store them in replayArray as when it will be completed, due to saved in replay array it will search in active session only
      
      //max count for replahy is 10
      if(ReplayService.replayArray.length == 10)
        ReplayService.replayArray = [];
      let msg = "session with sid : "+ sid + " having index : " + index + " & pageinstance as : "+ pageinstance;  
      this.console("log","Replay Service : openReplay " ,msg);
      // first check whether replay service has entry for it , os is it opening for first time
      let id = this.initNew(sid);
      // if session is active do not store in replay array
      if(isActive)
        id = -1;
      this.console("log","ReplayService , openReplay called , id : ", id);
      let entry :replayObj =null;
      // if got -1, means new replay to be opened, so first make entry in replayArray
      if(id == -1)
       id = this.makeEntry(sid,session,pagelist,index,pageinstance,isActive);
      else
      {
       entry = ReplayService.idToEntity(id);
       entry.index = index;
       entry.pageinstance = pageinstance;
        // else it will be having id, update  the same entry with new page index
        //if same session has again clicked for replay but with a different page
      }
      // this entry was eralier stored when this session was active  and now it is in completed state
      if(entry != null && entry.isactive == true  && isActive == false){
        console.log(" this entry was eralier stored when this session was active  and now it is in completed state");
        // remove entry for replayArray
        let indexPos = this.getIndexPos(id);
        ReplayService.replayArray.splice(indexPos,1);
        entry = null;
        id = this.makeEntry(sid,session,pagelist,index,pageinstance,isActive);
      }
      this.resetMap();
      this.console("log","ReplayService , openReplay called , id : ", id);
      //this.console("log","ReplayService , openReplay called , ReplayService.replayArray : ", JSON.stringify(ReplayService.replayArray));
      this.router.navigate(['/play-sessions'],{queryParams :{sid: sid,id:id,active:isActive}, replaceUrl : true}) 
    }
    getSessionPages(sid,session:Session,id,isActive)
    {
      let msg = "Page request for session with sid : "+ sid + " for id : " + id;  
      this.console("log","Replay Service : getSessionPages " ,msg);
      let ref = {activeSession:isActive,session: session};
      let r = this;
      let entry = ReplayService.idToEntity(id);
      this.httpService.getPages(ref).subscribe(
        (state: Store.State) => {
          if (state instanceof NVPreLoadedState) {
            let response = state.data;
        if(response == null || response.length == 0 )
          entry.pages = null;
        let dsession = DataManager.sessionData.get(sid);
        dsession.pageInformation = [];
        entry.pages = [];
        if(isActive){
          response = response.data;
        }
        for(let i=0; i < response.length; i++){
          let page: PageInformation  = new PageInformation(response[i], i, r.metadata);
          dsession.pageInformation.push(page);
          entry.pages.push(page);
          if(entry.pageinstance == null)
            entry.pageinstance = page.pageinstance;
          // requesting for http request and js error data
          // this data will be saved in datamanager, and can be accessed when needed
          this.getPageHttpRequestData(session, page.pageinstance);
          this.getPageJSErrorData(session, page.pageinstance);
        }
        entry.index = r.getIndex(entry.pages,entry.pageinstance);
        let msg  = "Entry with id : " + id + " filled with pages for session sid : " + sid ;
        r.console("log","ReplayService :  ",msg);
      }
      });
      
    }
    getSession(sid,id,pagelist:PageInformation[],isActive:boolean){
      //console.log("replay service, getSession, isActive : ", isActive);
      let r = this;
      let entry = ReplayService.idToEntity(id);
      let filterCriteria= {"limit":15,"offset":0,"sessionCount":false,"orderBy":["sessionstarttime"],"output":[],"timeFilter":{"last":"1 Hour","startTime":"","endTime":""},"previousSessFlag":false,"particularPage":false,"autoCommand":{"particularPage":false,"pageTab":{"jserrorflag":{"jsError":false},"xhrdata":{"httpFlag":false},"transactiondata":{"tFlag":false},"eventdata":{"eventFlag":false},"navigationflag":{"navflag":false}}},"nvSessionId":sid,"countBucket":300};
      
      this.httpService.getSessions(filterCriteria,isActive).subscribe(
        (state: Store.State) => {
          if (state instanceof NVPreLoadedState) {
            let response = state.data;
            if(response == null || (response != null && (response.data == "NA" || response.data.length == 0)))
            {
            //data not found in active session
            if(isActive == true){
              // search for session in completed
              isActive = false;
              this.getSession(sid,id,pagelist,isActive);
              return;
              // if data found in active, set isActive false , i.e. session is no more in active state
           }
           else
            entry.session = null;
        }
        try{
          let dbRecord =  response.data[0];
          let session: Session = new Session(dbRecord, r.metadata,false);
          entry.session = session;
          DataManager.addSession(session.sid);
        
          let msg  = "Entry with id : " + id + "filled with session with sid : " + sid ;
          r.console("log","ReplayService : getSession",msg);
          // now requesting for page
          if(pagelist == null){
            r.getSessionPages(sid,session, id,isActive);
          }
        }catch(e){
          this.console("warn","Replay Service : getSession : Exception : ", e); 
        }
      }
      });
    }

    console(type,name,msg){
      switch (type) {
        case "log":
          console.log("Replay : " , name , " , " , msg);
          break;
        case "warn":
          console.log("Replay : " , name , " , " , msg);
          break;
        case "info":
          console.log("Replay : " , name , " , " , msg);
          break;
        case "error":
          console.log("Replay : " , name , " , " , msg);
          break;
      
        default:
          break;
      }

    }
    getIndex(pagelist , pi){
      let j =0; 
      for(let i =0; i< pagelist.length; i++ ){
         if(pi == pagelist[i].pageinstance)
           return pagelist[i].index;
      }
      return j;
    }

    // getting ajax call data for page
    getPageHttpRequestData(session : Session, pageinstance:number)
    {
      let request = new DataRequestParams(session.sid, pageinstance, DataManager.HTTP_REQUESTS, session.startTime,session.endTime);
      let ref = {"session":session};
      DataManager.handleRequest(request,ref);
      
    }
    // getting js error data for page
    getPageJSErrorData(session : Session, pageinstance:number){
      let request = new DataRequestParams(session.sid, pageinstance , DataManager.JS_ERRORS, session.startTime, session.endTime);
      let ref = {"session":session};
      DataManager.handleRequest(request,ref);
    }

    // get index position of an entry in replay array
    getIndexPos(id){
      for(var i =0; i < ReplayService.replayArray.length ; i++){
          if(ReplayService.replayArray[i].id == id)
            return i;
      }
      return -1;
    }

   /************ PREFETCH **************/

  setUserActionData(useractiondata){
     this.useractiondata = useractiondata;
  }
  setDetails(session,all_pages,currentPI,index){
    this.currentSession = session;
    this.currentPI = currentPI;
    this.all_pages = all_pages;
    this.currentpageindex = index;
  }

  //Reset map on opening new Session
   resetMap(){
     this.userdatamap=new userdata();
    // console.log('userdatamap ====',this.userdatamap);
   }


  //check useraction data ,for next page and send request , if data for next two pages are not available.
  // type = useractions/snapshots 
  getNextPage(type:String)
  {
     // assuming that current page will have data already
     // p1 and p2 are next two pages
     // if replay is started from  somewhere between the replay session, then do not fetch old data
     let p1 = null,p2 = null;
     let def_offset = "0";
     let snapshot_id = "0";
     for(let i=0; i<this.all_pages.length; i++)
     {
       if(this.currentpageindex >= i) continue;
       let pins = this.all_pages[i].pageinstance;
       if(type == "useractions"){ 
         // if the current page do not have offset and even the useraction data is populated continue
         if(this.getOffsetValue(this.useractiondata[pins].data) == null && this.useractiondata[pins].jsonDataCollected == true ) 
         {
          //console.log('continue path check for pageins',pins);   
          continue;
         }      
         // if json data collected is false or , check for offset for the current page having data
         p1 = this.all_pages[i];
         def_offset = this.getOffsetValue(this.useractiondata[pins].data);
          if(def_offset == null){
            // if the current offset is null , and useraction data is not yet populated, check in userdatamap
            if(this.IspresentInMap(pins)){
               continue;
            }
            else
             return {"p1" : p1, "offset" : "0"};
           }
          if(def_offset == null)
            def_offset = "0"; 
          return {"p1" : p1, "offset" : def_offset};
        }else{
          snapshot_id = this.pathCheck(this.useractiondata[pins].snapshotInfo);
          //TODO :  also check in userdatamap
          let snapCheckInMap = this.SnapCheckInMap(pins);
          if(snapshot_id != null){
            // here offset is snapshot id
            return {"p1" : this.all_pages[i], "offset" : snapshot_id};
          }
          if(snapCheckInMap != null)
          return {"p1" : this.all_pages[i], "offset" :snapCheckInMap};
        }
     }
     return {"p1" : p1, "offset" : def_offset};
  }

  IspresentInMap(pi){
    try{
      if(this.userdatamap[pi].useractions != null && this.userdatamap[pi].useractions != undefined && Object.keys(this.userdatamap[pi].useractions).length != 0)
        return true;
    }catch(e){}  
    return false;
  }
  SnapCheckInMap(pins){
    try{
     let s = this.userdatamap[pins].snapshots;
     // si is snapshot index;
     for(var si in s){
       if(s[si].pagedump["response"] == undefined || s[si].pagedump["response"] == "")
        return si;
     }
    }catch(e){}
     return null; 
  }

  pathCheck(pageinstancedata){
    for(var index in pageinstancedata)
    {
      let obj = pageinstancedata[index];
      //console.log('page index object=',obj.snapshotPath);
      if(obj.snapshotPath == null)
      return index + "";
    }
    return null; 
  }

  /**
   *  check if current page is having offset in its data, if yes send offset value, "2_5"
   *  if not send null
   */
  getOffsetValue(data_array)
  {
      for(let i=0; i<data_array.length; i++){
        let d = data_array[i];
        if(d.hasOwnProperty("o") == true)
        {
            let currentoffset =  d.newoffset;
            let prevoffset    =  d.prevoffset;
            //console.log('=',currentoffset);
            if(currentoffset != prevoffset){
               return currentoffset;
            }
        }
      }
      return null;
  }
  
  isOffsetPresent(offset){
    let ispresent = false;
    if(offset != null && offset != "0")
       ispresent = true;
    return ispresent;
  }
  // all the request of replay must go from here
  // not wrapping first request 
  // type  : useractions, pagedump path, pagedump data
  // pi : page_instance, for which data needs to be prefetched
  /**
   * 
   * @param fn 
   * @param arg 
   * @param type 
   * @param nextdata 
   * purpose : to wrap the getReplayJsonData method to prefetch useraction data
   * limitation :  currently this function keeps track of single  page only , 
   * so when we are sending five page request , suppose 6- 10 , taht request will be marked pending only for 6th  page
   * so if user jumped to page 7 , again the request will be done for 7 to 11 th page as per default five pages.
   * Work around : for first time, we will make request for 5 pages so that userdatamap keeps it and then we will request for a single page ua.
   * FIX ME : fix the limitation and also send the whole five data at once not on demand by replay handler.
   */
  methodWrapper(fn:string, arg:any,type:string,nextdata) : Observable <any> {
    // request handling for useraction data
    let ctx = this;
    let pi = nextdata.p1.pageinstance;
    let rpl = [];
    rpl = this.parsingargs(arg);


    let offset = nextdata.offset;
    let offset_value = 0;
    let offset_present = this.isOffsetPresent(offset);
  
  
    if(offset_present)
    {
      if(offset.includes("_")) 
         offset_value = Number(offset.split("_")[1]);
    }

    return Observable.create(observer => {
      let finalobj={};
      if(ctx.userdatamap && ctx.userdatamap.hasOwnProperty(pi) && 
         ctx.userdatamap[pi][type] != null && /*offset_present && */
         ctx.userdatamap[pi][type].hasOwnProperty(offset_value))
        {
          /*
          here if the userdatamap has data for pages pi onwards then we are not only
           data for pi only ,we are sending data fo all the pagrs pi onwards from the map
           */  
          let keys =Object.keys(ctx.userdatamap);
          let leng =keys.length-1;
          let length =keys[leng];
          let finalobj={};

          for(let num=0;num<=rpl.length-1;num++){
            // handling case , if userdatamp do not have data for any requested page list(rpl)
            if(ctx.userdatamap[rpl[num]] == undefined || ctx.userdatamap[rpl[num]].hasOwnProperty(type) == false)
              continue; 
            let merger = ctx.mergeObjects(rpl[num],ctx.userdatamap[rpl[num]][type]);
            finalobj = Object.assign(finalobj,merger) 
          }
         
           observer.next(finalobj);
           observer.complete();

        }else if(ctx.userdatamap && ctx.userdatamap.hasOwnProperty(pi) && ctx.userdatamap[pi].UArequestInProgress == true){
         let logmsg = "pageinstance : " + pi + " offset : "+ offset_value + "  request is pending state.";
         this.console("log","Prefetch : UA ", logmsg);
         // add for loop
         for(let i=0; i < rpl.length; i++){
           ctx.userdatamap[rpl[i]].pendingUARequest.push(observer);
         }
      }else
      {
        for(let i=0; i < rpl.length; i++){  
          if(ctx.userdatamap.hasOwnProperty(rpl[i]) == false)
          ctx.userdatamap[rpl[i]] = new uaData();
          ctx.userdatamap[rpl[i]].UArequestInProgress = true;
        }
        ctx.httpService[fn].apply(this.httpService,arg).subscribe(
          (state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;
          for(let i=0; i < rpl.length; i++)
          {
            ctx.userdatamap[rpl[i]].UArequestInProgress = false;
          }

          ctx.fillUserdata(response,type,nextdata,fn,arg,offset_present,offset_value);
          let finalobj = {};
          for(let i=0; i <=Object.keys(response).length-1; i++)
          {
           // ctx.userdatamap[rpl[i]].UArequestInProgress = false;
            // if rpl[i] == currentPI 
            // means replay is on first page and demanding first page another chunk, so in this case it is not prefetching
            // so to remove duplicacy , we should not merge chunks for that page and return response as it is.
            // alternatively check in useractiondata, for that pi, how much data is set by data array length, send the data with remaing chunks 
            // match useractiondata[pi].data.length  and userdatamap[pi].useractions[offset].length
            //  136 - 0 : 136 , 1 :56, 2: 50  , 4 : 50 => 136 : 136 + 156 = > send these 100 data object 
            let merger = ctx.mergeObjects(rpl[i],ctx.userdatamap[rpl[i]][type]);
            finalobj = Object.assign(finalobj,merger)          
            /**ua data format :  {  1:[], 2:[] } */
            ctx.userdatamap[rpl[i]].pendingUARequest.forEach(observer => {
               let merger = ctx.mergeObjects(rpl[i],ctx.userdatamap[rpl[i]][type]);
               finalobj = Object.assign(finalobj,merger)
               observer.next(finalobj);
               observer.complete();
            });
            ctx.userdatamap[pi].pendingUARequest = [];
          }
          observer.next(finalobj);
          observer.complete();         
            }
       });
      }
    });
    
    // request handling for snapshot data
  }

parsingargs(a){
 let b =a.toString().split(',');
 let rpl =[];
  for(let i=0;i<b.length-1;i++)
  {
  if(b[i].includes('_')){
    let a =b[i].split('_')[0]
    rpl.push(a);
  }
  }
  return rpl;
}
  
  //prev_offset - for which we have received data
  //nextdata will have offset , for which we are sending request 
  fillUserdata(response,type,nextdata,fn,arg, isoffset, prev_offset)
  {
    
    let pi = nextdata.p1.pageinstance;
    let offset = nextdata.offset;
    let o =0;
    if(offset.includes("_"))
      o= Number(offset.split("_")[1]);
    if(type == "useractions")
    {
        for(var pins in response)
        {
          if(pins!=pi)
          prev_offset=0;      
         // console.log('prev_offset in forpins=',prev_offset);

          // populate the data structure
          if(this.userdatamap.hasOwnProperty(pins) == false){
            this.userdatamap[pins] = new uaData();
          }
          if(this.userdatamap[pins].useractions == null)
            this.userdatamap[pins].useractions = {};
            
            this.userdatamap[pins].useractions[prev_offset] = [];
            this.userdatamap[pins].useractions[prev_offset] = this.userdatamap[pins].useractions[prev_offset].concat(response[pins]);
            //console.log("userdatamap : ", this.userdatamap);  
            //console.log("Prefetch : Received  useraction data for pageinstance  ", pins, " filling in userdata map");
            let logmsg = "pageinstance : " + pins + " offset : "+ o + "  filling in userdatamap.";
            this.console("log","Prefetch : UA ", logmsg);
            // find next offset value , if present in response to make new request
            for(let j=0;j<response[pins].length;j++)
            {  
              
              if(response[pins][j].hasOwnProperty("o"))
              {
                let nxt= {"p1" :{"pageinstance":pins}, "offset" : pins+"_"+response[pins][j].o};
                
               
                //console.log("Prefetch : Requesting useraction data for pageinstance  ", pins, " since , got chunk");             
                let logmsg = "pageinstance : " + pins + " offset : "+ response[pins][j].o + "  requested from prefetch useraction module";
                this.console("log","Prefetch : UA ", logmsg);
                // making new request for next page, if offset exists
                let requested_pl = ReplayUtil.getRequestedPageList(Number(pins),2,this.all_pages,this.all_pages.length,this.currentSession.partitionID,nxt.offset);
                let basepath =  ReplayUtil.getBasePathURL(this.all_pages[this.currentpageindex].url); 
                let newarg = [requested_pl,this.currentSession.sid,basepath,/*basepath n current version*/1];
                this.methodWrapper(fn,newarg,type,nxt).subscribe(
                  (state: Store.State) => {
                    if (state instanceof NVPreLoadedState) {
                      let response = state.data;
                 // console.log("Request done with new offset=",response)
                    }
                });
              }
              // check for snapshot data
              if(response[pins][j].hasOwnProperty("s")){
                let nxt= {"p1" :{"pageinstance":pins}, "offset" :+response[pins][j].s};
                //console.log("Prefetch : Requesting  snapshot data for page  ", nxt.p1.pageinstance,  " and snapshot id : ",response[pins][j].s);
                let logmsg = "pageinstance : " + nxt.p1.pageinstance + " snapshot id : "+ response[pins][j].s + " " +  "path" + " requested from prefetch useraction module.";
                this.console("log","Prefetch : Snapshot ", logmsg);
                this.snapWrapper("getSnapShotPathThroughAjax",[1,this.currentSession.startTime,this.currentSession.sid,nxt.p1.pageinstance,this.currentSession.partitionID,nxt.offset],"snapshots",nxt,"path",nxt.offset).subscribe(
                  (state: Store.State) => {
                    if (state instanceof NVPreLoadedState) {
                      let response = state.data;
                   //console.log(" snapshot path for page instance : ", nextdatas.p1.pageinstance);
                    }
                 });
              }
            }

          }
    }
     
  }

  mergeObjects(ins,pagearrays){
     //console.log('pagearrays=',pagearrays,'ins=',ins);
     let newarr =null;
     let obj ={};
     if(pagearrays!=null){
     newarr=[];
     for(let obj in pagearrays){
       let individualarr = pagearrays[obj];
       let len =individualarr.length;
        
        if(individualarr[len-1] && individualarr[len-1].hasOwnProperty("o"))
        individualarr.splice(-1,1);
      newarr = newarr.concat(individualarr);
       }
      }
     obj[ins]=newarr;
      //console.log('newarr=',newarr);
      // console.log('obj==>',obj);
     return obj;
  }
  
  // cheking for pagedump , since path can be null or empty indicating no pagedump
  isDataPresentforPagedump(value,key)
  {
     if(key == "pagedump"){
       if(value != undefined && value != ""  && value != null){
         return true;
     }
    }
    else if(key == "path") 
       return true;
    return false;
  }

  // a  - function name
  // b - function argument
  // type - snapshots
  // what - path / pagedump
  snapWrapper(a,b,type,nextdata,what,snapshotIndex) : Observable <any> {
    let context=this;  
    let pi = nextdata.p1.pageinstance;
    let snapshot_id = snapshotIndex;
    let logmsg =""
    return Observable.create(observer => {
        // already has data
      if(context.userdatamap && context.userdatamap.hasOwnProperty(pi) &&
         context.userdatamap[pi][type] != null && 
         context.userdatamap[pi][type].hasOwnProperty(snapshot_id) && context.userdatamap[pi][type][snapshot_id].hasOwnProperty(what) && context.isDataPresentforPagedump(context.userdatamap[pi][type][snapshot_id][what].response,what))
       {
           //console.log("Prefetch : Serving snapshot ",what," data for pageinstance  ", pi, " from userdatamap for snapshot id ", snapshot_id);
           logmsg = "pageinstance : " + pi + " snapshot id : "+ snapshot_id + " " +  what + " is served from userdatamap";
           context.console("log","Prefetch : Snapshot ", logmsg);
           observer.next(context.userdatamap[pi][type][snapshot_id][what].response);
           observer.complete();
       }else if(context.userdatamap && context.userdatamap.hasOwnProperty(pi) && context.userdatamap[pi][type] != null &&
                 context.userdatamap[pi][type].hasOwnProperty(snapshot_id) &&
                 context.userdatamap[pi][type][snapshot_id].hasOwnProperty(what) &&
                context.userdatamap[pi][type][snapshot_id][what].SnaprequestInProgress == true)
          {        // request in progress
           //console.log("Prefetch :  snapshot ",what," data for pageinstance  ", pi, " is in pending state for snapshot id ", snapshot_id);
           logmsg = "pageinstance : " + pi + " snapshot id : "+ snapshot_id + " " +  what + " is in pending state";
           context.console("log","Prefetch : Snapshot ", logmsg);
           context.userdatamap[pi].pendingSnapRequest.push(observer);
         }
      else{
        // userdata map for that page is not defined
        if(context.userdatamap.hasOwnProperty(pi) == false){
            context.userdatamap[pi] = new uaData();
            context.userdatamap[pi][type] = new snapdata();
            context.userdatamap[pi][type][snapshot_id] =new snapObj();
        } //snapshot structure for that page in userdatamap  is not defined
        if(context.userdatamap[pi].snapshots == undefined ||
           context.userdatamap[pi].snapshots == null ) 
            context.userdatamap[pi][type] = new snapdata();
          //snapshot id in snapshot structure for that page in userdatamap  is not defined
         if(context.userdatamap[pi].snapshots.hasOwnProperty(snapshot_id) == false){
          context.userdatamap[pi][type][snapshot_id] =new snapObj();
         }
         context.userdatamap[pi][type][snapshot_id][what].SnaprequestInProgress = true;
         // else, we have the data , fill in userdatamap
        context.httpService[a].apply(this.httpService,b).subscribe( response => {
          /*(state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;*/
          //console.log("Prefetched  snapshot ",what," data for pageinstance  ", pi, " received, for snapshot id ", snapshot_id);
          //if(response instanceof NVPreLoadedState)
            //response = response.data;
          logmsg = "pageinstance : " + pi + " snapshot id : "+ snapshot_id + " " +  what + " received in userdatamap";
          context.console("log","Prefetch : Snapshot ", logmsg);
          context.userdatamap[pi][type][snapshot_id][what].SnaprequestInProgress = false;
          context.userdatamap[pi][type][snapshot_id][what].response = response;
          observer.next(context.userdatamap[pi][type][snapshot_id][what].response);
          observer.complete();
          //console.log('reading maps for snapshotMap ==',context.userdatamap);   
          // when you have data for path , request for pagedump
          if(what == 'path')
            this.callforPageDump(context.userdatamap[pi][type][snapshot_id][what].response,pi,snapshot_id);
          // check what is pending, do whatever is needful
          context.userdatamap[pi].pendingSnapRequest.forEach(observer => {
              observer.next(this.userdatamap[pi][type][snapshot_id][what].response);
              observer.complete();
            });
          context.userdatamap[pi].pendingSnapRequest = [];
            if(context.userdatamap[pi][type][snapshot_id] != undefined)
            context.userdatamap[pi][type][snapshot_id][what].SnaprequestInProgress = false;
            //console.log('exceptionerror=',context.userdatamap[pi][type][snapshot_id][what].SnaprequestInProgress);
          //}
        });
        
       }
      })
   } 

  callforPageDump(response,pageinstance,snapshot_id){
    let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}

    if(response!=undefined)
    var pagedump_path = response.split("%%%")[0];
    pagedump_path = pagedump_path.trim();
    if(pagedump_path == "") return;
    //console.log("Prefetch :  Requesting snapshot pagedump data for pageinstance  ", pageinstance, " for snapshot id ", snapshot_id);
    let logmsg = "pageinstance : " + pageinstance + " snapshot id : "+ snapshot_id + " " +  "pagedump" + " requested from prefetch module";
    this.console("log","Prefetch : Snapshot ", logmsg);
    if(this.currentSession.protocolVersion == 200){
       // call for android snapshot file
      this.snapWrapper("readAndroidSnapshotFile",[pagedump_path],"snapshots",nextdata,"pagedump",snapshot_id).subscribe(response => {
       console.log('response readAndroidSnapshotFile=',response);
       //return response;
      })
      }else{
        this.snapWrapper("readSnapshotFile",[pagedump_path],"snapshots",nextdata,"pagedump",snapshot_id).subscribe(response => {
          /*(state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;*/
          console.log('response  readSnapshotFile=',response);
        //return response;
            
        })
     }
   }
}
